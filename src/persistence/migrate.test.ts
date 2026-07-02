import { describe, it, expect } from 'vitest';
import { migrate } from './migrate';

describe('migrate() — ordered forward chain (PRD §6.8.2)', () => {
  const fake = {
    1: (s: unknown) => ({ ...(s as object), addedAtV2: 'two' }),
    2: (s: unknown) => ({ ...(s as object), addedAtV3: 'three' }),
  };
  it('runs every step from->to in order', () => {
    expect(migrate({ x: 1 }, 1, 3, fake)).toEqual({ x: 1, addedAtV2: 'two', addedAtV3: 'three' });
  });
  it('is a no-op when already at the target version', () => {
    expect(migrate({ x: 1 }, 3, 3, fake)).toEqual({ x: 1 });
  });
  it('stops at a gap (missing step) — leaves the rest to the recovery/version guard', () => {
    expect(migrate({ x: 1 }, 1, 5, { 1: (s: unknown) => ({ ...(s as object), a: 1 }) })).toEqual({
      x: 1,
      a: 1,
    });
  });
  it('the real v1→v2 step hydrates the tier spine (the reshape bump, D-048/D-067)', () => {
    // an old v1 save loads as a fresh-spine T0 with its existing progress preserved. (Explicit
    // toVersion=2 isolates the single step — the full chain is exercised below.)
    const v1 = { schemaVersion: 1, rung: 'R2', resources: { koku: 42 } };
    const v2 = migrate(v1, 1, 2) as Record<string, unknown>;
    expect(v2.tier).toBe(0);
    expect(v2.influence).toEqual({ estate: { value: 0, highWater: 0, judged: 0 } });
    expect(v2.rung).toBe('R2'); // existing progress carries forward
    expect(v2.resources).toEqual({ koku: 42 });
  });
  it('the real v2→v3 step hydrates the interactive-intro fields (npcMemory + introBeat)', () => {
    // an AWAKE pre-intro save has finished the old cold open ⇒ it lands intro-DONE with empty memory
    const awake = { schemaVersion: 2, flags: { awake: true }, rung: 'R2' };
    const v3 = migrate(awake, 2, 3) as Record<string, unknown>;
    expect(v3.npcMemory).toEqual({});
    expect(typeof v3.introBeat).toBe('number');
    expect(v3.introBeat as number).toBeGreaterThan(0); // intro-done (= INTRO_BEAT_COUNT), not pre-wake
    expect(v3.rung).toBe('R2'); // existing progress carries forward
  });

  it('a v2→v3 migration of a PRE-WAKE save lands pre-intro (introBeat = -1)', () => {
    const asleep = { schemaVersion: 2, flags: {} };
    const v3 = migrate(asleep, 2, 3) as Record<string, unknown>;
    expect(v3.npcMemory).toEqual({});
    expect(v3.introBeat).toBe(-1);
  });

  it('the real v3→v4 step hydrates the dialogue-tree ask-hub field (askedTopics: [])', () => {
    // an in-flight v3 intro save (mid-scene) resumes at the SAME index with an empty ask hub;
    // introBeat + npcMemory ride along untouched (scene order == old beat order).
    const v3 = {
      schemaVersion: 3,
      introBeat: 1,
      npcMemory: { soan: { regard: 'curt', warmth: -1 } },
    };
    const v4 = migrate(v3, 3, 4) as Record<string, unknown>;
    expect(v4.askedTopics).toEqual([]); // additively hydrated
    expect(v4.introBeat).toBe(1); // the scene cursor carries over UNCHANGED
    expect(v4.npcMemory).toEqual({ soan: { regard: 'curt', warmth: -1 } }); // memory untouched
  });

  it('the real v4→v5 step renames koku→coin and adds rice (the economy re-core, D-107)', () => {
    // the flattened spend-currency `koku` becomes `coin`; `rice` (a real resource) is introduced at
    // 0; koku LEAVES resources entirely. The rename covers BOTH pools (carried + banked kura).
    const v4 = {
      schemaVersion: 4,
      resources: { koku: 42, wood: 3 },
      banked: { koku: 10 },
    };
    const v5 = migrate(v4, 4, 5) as Record<string, unknown>;
    expect(v5.resources).toEqual({ rice: 0, wood: 3, coin: 42 }); // koku→coin, rice added, wood kept
    expect(v5.banked).toEqual({ rice: 0, coin: 10 }); // the kura mirror renames too
  });

  it('the real v5→v6 step hydrates the rung-beat cursor (rungBeat: null, D-110)', () => {
    // additively hydrate the rung-beat cursor to its inert default; nothing else moves.
    const v5 = { schemaVersion: 5, rung: 'R2', introBeat: 3 };
    const v6 = migrate(v5, 5, 6) as Record<string, unknown>;
    expect(v6.rungBeat).toBeNull(); // no beat live on load — the correct inert default
    expect(v6.rung).toBe('R2'); // existing progress carries forward
    expect(v6.introBeat).toBe(3); // the intro cursor rides along untouched
  });

  it('the real v6→v7 step hydrates the belongings store (belongings: [], D-111 / F89)', () => {
    // additively hydrate the deep-housing belongings array to empty — an old save owns no BOUGHT
    // furniture yet (the granted mat + bowl are derived from the home surface, not stored). Explicit
    // toVersion=7 isolates the single step.
    const v6 = { schemaVersion: 6, rung: 'R2', rungBeat: null };
    const v7 = migrate(v6, 6, 7) as Record<string, unknown>;
    expect(v7.belongings).toEqual([]); // owns no furniture on load — the correct fresh default
    expect(v7.rung).toBe('R2'); // existing progress carries forward
    expect(v7.rungBeat).toBeNull(); // the prior cursor rides along untouched
  });

  it('a v1 save migrates the WHOLE chain v1→v7 (tier spine + intro + ask hub + coin/rice + rung beat + housing)', () => {
    const v1 = { schemaVersion: 1, flags: { awake: true }, resources: { koku: 7 } };
    const v7 = migrate(v1, 1) as Record<string, unknown>;
    expect(v7.tier).toBe(0); // v1→v2
    expect(v7.npcMemory).toEqual({}); // v2→v3
    expect(v7.askedTopics).toEqual([]); // v3→v4
    expect(v7.resources).toEqual({ rice: 0, coin: 7 }); // v4→v5: koku→coin, rice added
    expect(v7.rungBeat).toBeNull(); // v5→v6: the rung-beat cursor
    expect(v7.belongings).toEqual([]); // v6→v7: the belongings store
  });

  it('a current (v7) save is unchanged by the chain', () => {
    const s = { schemaVersion: 7 };
    expect(migrate(s, 7)).toBe(s); // already at target => identity
  });
});

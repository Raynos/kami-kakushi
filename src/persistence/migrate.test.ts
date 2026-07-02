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
    // an old v1 save loads as a fresh-spine T0 with its existing progress preserved
    const v1 = { schemaVersion: 1, rung: 'R2', resources: { koku: 42 } };
    const v2 = migrate(v1, 1) as Record<string, unknown>;
    expect(v2.tier).toBe(0);
    expect(v2.influence).toEqual({ estate: { value: 0, highWater: 0, judged: 0 } });
    expect(v2.rung).toBe('R2'); // existing progress carries forward
    expect(v2.resources).toEqual({ koku: 42 });
  });
  it('the real v2→v3 step hydrates the interactive-intro fields (npcMemory + introBeat)', () => {
    // an AWAKE pre-intro save has finished the old cold open ⇒ it lands intro-DONE with empty memory
    const awake = { schemaVersion: 2, flags: { awake: true }, rung: 'R2' };
    const v3 = migrate(awake, 2) as Record<string, unknown>;
    expect(v3.npcMemory).toEqual({});
    expect(typeof v3.introBeat).toBe('number');
    expect(v3.introBeat as number).toBeGreaterThan(0); // intro-done (= INTRO_BEAT_COUNT), not pre-wake
    expect(v3.rung).toBe('R2'); // existing progress carries forward
  });

  it('a v2→v3 migration of a PRE-WAKE save lands pre-intro (introBeat = -1)', () => {
    const asleep = { schemaVersion: 2, flags: {} };
    const v3 = migrate(asleep, 2) as Record<string, unknown>;
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
    const v4 = migrate(v3, 3) as Record<string, unknown>;
    expect(v4.askedTopics).toEqual([]); // additively hydrated
    expect(v4.introBeat).toBe(1); // the scene cursor carries over UNCHANGED
    expect(v4.npcMemory).toEqual({ soan: { regard: 'curt', warmth: -1 } }); // memory untouched
  });

  it('a v1 save migrates the WHOLE chain v1→v4 (tier spine + intro fields + ask hub)', () => {
    const v1 = { schemaVersion: 1, flags: { awake: true }, resources: { koku: 7 } };
    const v4 = migrate(v1, 1) as Record<string, unknown>;
    expect(v4.tier).toBe(0); // v1→v2
    expect(v4.npcMemory).toEqual({}); // v2→v3
    expect(v4.askedTopics).toEqual([]); // v3→v4
    expect(v4.resources).toEqual({ koku: 7 });
  });

  it('a current (v4) save is unchanged by the chain', () => {
    const s = { schemaVersion: 4 };
    expect(migrate(s, 4)).toBe(s); // already at target => identity
  });
});

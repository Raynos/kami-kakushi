import { describe, it, expect } from 'vitest';
import { migrate } from './migrate';
import { SCHEMA_VERSION } from '../core';
import { RUNG_BEATS, type RungScene } from '../core/content/rungBeats';
import { renderLogLine } from '../core/content/log-render';

describe('migrate() — ordered forward chain (PRD §6.8.2)', () => {
  const fake = {
    1: (s: unknown) => ({ ...(s as object), addedAtV2: 'two' }),
    2: (s: unknown) => ({ ...(s as object), addedAtV3: 'three' }),
  };
  it('runs every step from->to in order', () => {
    expect(migrate({ x: 1 }, 1, 3, fake)).toEqual({
      x: 1,
      addedAtV2: 'two',
      addedAtV3: 'three',
    });
  });
  it('is a no-op when already at the target version', () => {
    expect(migrate({ x: 1 }, 3, 3, fake)).toEqual({ x: 1 });
  });
  it('stops at a gap (missing step) — leaves the rest to the recovery/version guard', () => {
    expect(
      migrate({ x: 1 }, 1, 5, {
        1: (s: unknown) => ({ ...(s as object), a: 1 }),
      }),
    ).toEqual({
      x: 1,
      a: 1,
    });
  });

  // ── STORYWAVE CLEAN BREAK (ADR-161) ──────────────────────────────────────────────
  // The old v1→v9 migration chain is DELETED (git history is its archive). A pre-storywave
  // blob is a PRIOR app generation and RETIRES at validateEnvelope's generation gate — backed
  // up + fresh boot, never migrated (proven in save.test.ts). So the REAL chain restarts at
  // v10 (the first this-generation step: v10→v11, ADR-179 below) and migrate() stays an
  // identity no-op across the whole pre-v10 range.
  it('a pre-v10 version has no registered step (clean break) — identity, not migrated', () => {
    const old = { schemaVersion: 3, rung: 'R2' };
    expect(migrate(old, 3)).toBe(old); // no step registered ⇒ the gap-stop identity path
  });
  it('a current save is unchanged by the real chain', () => {
    const s = { schemaVersion: SCHEMA_VERSION };
    expect(migrate(s, SCHEMA_VERSION)).toBe(s); // already at target ⇒ identity
  });

  // ── v10 → v11 (ADR-179 derived reveal) — the first REAL this-generation step ─────
  // The stored `unlocked` visibility latch is deleted (visibility derives from facts);
  // `seenReveals` (the announce-once ceremony latch) is seeded from it so no reveal line
  // ever re-plays; and a latched readout-coin synthesizes the `coin-earned` fact — the one
  // fact the old latch was the only record of (coin earned, then spent back to 0).
  it('v10→v11 drops `unlocked`, seeds `seenReveals` from it, and keeps the other fields', () => {
    const v10 = {
      schemaVersion: 10,
      rung: 'R2',
      flags: { awake: true, 'rank-r1': true },
      unlocked: ['verb-rake', 'verb-rest', 'panel-rung-ladder'],
    };
    const v11 = migrate(v10, 10) as Record<string, unknown>;
    expect('unlocked' in v11).toBe(false); // the visibility latch is GONE
    expect(v11.seenReveals).toEqual(v10.unlocked); // the announce latch is a lossless seed
    expect(v11.rung).toBe('R2'); // untouched fields ride through
    expect(v11.flags).toEqual(v10.flags); // no coin fact — readout-coin was never latched
  });
  it('v10→v11 synthesizes `coin-earned` iff the old latch included readout-coin', () => {
    const v10 = { schemaVersion: 10, flags: {}, unlocked: ['readout-coin'] };
    const v11 = migrate(v10, 10) as { flags: Record<string, boolean> };
    expect(v11.flags['coin-earned']).toBe(true); // a spent-to-0 first wage can't hide the readout
  });
});

// ── v11 → v12: the log's line addresses become NAMES (ADR-186's known limit, closed) ─────────
// A v11 save addressed a scene's greeting / answer line by INDEX. An index does not survive an
// edit to the narrative .md: re-order or delete a line and the old entry silently re-points at its
// NEIGHBOUR — the player's own history, rewritten in someone else's words. The lines now carry
// authored ids, and THIS migration rewrites the old indexes to them. It is sound only here, in the
// release that adds ids and re-orders nothing, which is exactly why it is not deferred.
describe('v11 → v12 — a save stops being vulnerable to the next re-order', () => {
  const beat = Object.entries(RUNG_BEATS).find(
    ([, b]) => b && b.topics.length > 0,
  )!;
  const [rank, scene] = beat as [string, RungScene];
  const topic = scene.topics[0]!;

  /** A v11 save: a log whose VN entries are addressed positionally. */
  const v11 = (contentKey: string) => ({
    log: { entries: [{ text: 'the words the player read', contentKey }] },
  });
  const keyAfter = (contentKey: string): string => {
    const out = migrate(v11(contentKey), 11, 12) as {
      log: { entries: { contentKey: string }[] };
    };
    return out.log.entries[0]!.contentKey;
  };

  it('rewrites a greeting index to the id of the line that index NAMES today', () => {
    // Derived from the registry, never a copied slug: the line at index 1 is the line the v11
    // save meant, because this release re-orders nothing.
    const second = scene.greeting[1]!;
    expect(keyAfter(`beat.${rank}.greeting.1`)).toBe(
      `beat.${rank}.greeting.${second.id}`,
    );
  });

  it('rewrites a topic-answer index the same way', () => {
    const first = topic.answer[0]!;
    expect(keyAfter(`beat.${rank}.topic.${topic.id}.answer.0`)).toBe(
      `beat.${rank}.topic.${topic.id}.answer.${first.id}`,
    );
  });

  it('the migrated key renders the SAME WORDS the player originally read', () => {
    // The migration is worthless if it renames the line to something else. This is the check that
    // it named the right one — end to end, through the real resolver.
    const second = scene.greeting[1]!;
    expect(renderLogLine(keyAfter(`beat.${rank}.greeting.1`))).toBe(
      second.text,
    );
  });

  it('AND the id is position-free: it resolves the same wherever the line sits', () => {
    // The whole point. `greeting.<id>` names a LINE, not a slot — so a re-voice wave that moves
    // this line to the top of the scene cannot re-point this save's entry at its neighbour. (Under
    // v11's `greeting.1` it silently would; the compiler tests prove the id travels with the text.)
    const second = scene.greeting[1]!;
    const first = scene.greeting[0]!;
    expect(renderLogLine(`beat.${rank}.greeting.${second.id}`)).toBe(
      second.text,
    );
    expect(renderLogLine(`beat.${rank}.greeting.${first.id}`)).toBe(first.text);
    expect(second.text).not.toBe(first.text); // …and they are genuinely different lines
  });

  it('an index the registry no longer has is LEFT ALONE (the entry keeps its stored prose)', () => {
    const gone = `beat.${rank}.greeting.999`;
    expect(keyAfter(gone)).toBe(gone); // unresolvable → codec falls back to the words it stored
  });

  it('an unkeyed legacy line passes through untouched', () => {
    const out = migrate(
      { log: { entries: [{ text: 'authored prose, no key' }] } },
      11,
      12,
    ) as {
      log: { entries: Record<string, unknown>[] };
    };
    expect(out.log.entries[0]).toEqual({ text: 'authored prose, no key' });
  });
});

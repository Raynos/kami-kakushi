import { describe, it, expect } from 'vitest';
import { migrate } from './migrate';
import { SCHEMA_VERSION } from '../core';

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

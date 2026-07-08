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
  // up + fresh boot, never migrated (proven in save.test.ts). So the REAL MIGRATIONS map is
  // EMPTY and migrate() is an identity no-op across the whole pre-v10 range.
  it('the real chain is EMPTY — a pre-v10 version has no registered step (clean break)', () => {
    const old = { schemaVersion: 3, rung: 'R2' };
    expect(migrate(old, 3)).toBe(old); // no step registered ⇒ the gap-stop identity path
  });
  it('a current save is unchanged by the (empty) real chain', () => {
    const s = { schemaVersion: SCHEMA_VERSION };
    expect(migrate(s, SCHEMA_VERSION)).toBe(s); // already at target ⇒ identity
  });
});

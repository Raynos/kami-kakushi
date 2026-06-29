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
    expect(v2.influence).toEqual({ estate: { value: 0, highWater: 0 } });
    expect(v2.rung).toBe('R2'); // existing progress carries forward
    expect(v2.resources).toEqual({ koku: 42 });
  });
  it('a current (v2) save is unchanged by the chain', () => {
    const s = { schemaVersion: 2 };
    expect(migrate(s, 2)).toBe(s); // already at target => identity
  });
});

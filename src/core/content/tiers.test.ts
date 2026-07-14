import { describe, it, expect } from 'vitest';
import { toTierId, TIER_NAMES } from './tiers';

describe('M3 — the TierId spine', () => {
  it('toTierId pins untrusted numbers onto the spine (floor, clamp both ends)', () => {
    // RED against a clamp that trusts its input: a hacked save's tier 9 or -1 must land
    // on the spine, and a fractional QA teleport must floor.
    expect(toTierId(9)).toBe(6);
    expect(toTierId(-1)).toBe(0);
    expect(toTierId(2.7)).toBe(2);
    expect(toTierId(4)).toBe(4);
  });

  it('every tier has a non-empty display name (the single naming source, AC-21)', () => {
    for (const name of Object.values(TIER_NAMES))
      expect(name.length).toBeGreaterThan(0);
  });
});

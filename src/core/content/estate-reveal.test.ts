import { describe, it, expect } from 'vitest';
import { RANKS, type RankId } from './ranks';

// A8: the interior-house AREA reveals are staggered across the estate ladder — the omoya at R4,
// the workshops + granary at R6, the lord's study at R7 (flavour reveals, not walkable map nodes).
// Derived from RANKS (the source of truth), so this goes RED if a reveal is moved, dropped, or
// double-bundled — never from a copied rung list.
function unlockedThrough(rank: RankId): Set<string> {
  const out = new Set<string>();
  for (const r of RANKS) {
    for (const s of r.rewardOnReach?.unlock ?? []) out.add(s);
    if (r.id === rank) break;
  }
  return out;
}

describe('A8 — interior-house reveals stagger across the estate ladder', () => {
  it('the omoya opens at R4, not before', () => {
    expect(unlockedThrough('R3').has('house-omoya')).toBe(false);
    expect(unlockedThrough('R4').has('house-omoya')).toBe(true);
  });

  it('the workshops + granary open at R6, not before', () => {
    expect(unlockedThrough('R5').has('house-workshops')).toBe(false);
    expect(unlockedThrough('R5').has('house-granary')).toBe(false);
    expect(unlockedThrough('R6').has('house-workshops')).toBe(true);
    expect(unlockedThrough('R6').has('house-granary')).toBe(true);
  });

  it("the lord's study opens at the R7 capstone, not before", () => {
    expect(unlockedThrough('R6').has('house-study')).toBe(false);
    expect(unlockedThrough('R7').has('house-study')).toBe(true);
  });

  it('every interior-house surface is revealed EXACTLY once (no double-bundle)', () => {
    for (const room of ['house-omoya', 'house-workshops', 'house-granary', 'house-study']) {
      const count = RANKS.filter((r) => (r.rewardOnReach?.unlock ?? []).includes(room)).length;
      expect(count).toBe(1);
    }
  });
});

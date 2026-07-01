import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  phaseOf,
  ascensionAvailable,
  estateGrade,
  applyGrindFight,
  focusedOptimalIntent,
  balance,
  type GameState,
} from './index';

// THE WHOLE T0 ARC, end-to-end, via the REAL reducer — the strongest "is it playtestable" proof.
// Unit tests cover the arc in FRAGMENTS (the ladder via forced flags, combat survival, pillars,
// ascension — each in isolation). This drives a single auto-pilot from the cold open all the way to
// the T0→T1 ascension with NO forced flags, so it proves the SEAMS hold: real combat actually sets
// the flags the ladder gates on, real Phase-2 labour actually banks Estate deeds to EXCELLENT, and
// the ascension actually fires. If any link dead-ends, the guard trips and this goes RED.
//
// Policy (mirrors the production auto-loop): ascend when the gate opens · stand the gate-watch (one
// real grind fight) when R3 needs `combat-blooded` · otherwise the SHARED focused-optimal intent
// (open_eyes > rest-if-starving > rake > face_wolf@R2 > cheapest-eligible labour). The labour banks
// Estate deeds once Phase 2 opens (post-R7 capstone).
function playToAscension(seed: number): { final: GameState; reachedRung: Record<string, boolean> } {
  let s = reduce(createInitialState(seed), { type: 'open_eyes' });
  const reachedRung: Record<string, boolean> = {};
  let guard = 0;
  while (s.tier === 0 && guard++ < 1_000_000) {
    reachedRung[s.rung] = true;
    if (ascensionAvailable(s)) {
      s = reduce(s, { type: 'ascend' });
      break;
    }
    // R3→R4 needs real combat duty, not just meter — one grind fight sets `combat-blooded`.
    if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded')) {
      s = applyGrindFight(s, 'monkey');
      continue;
    }
    const intent = focusedOptimalIntent(s);
    if (!intent) break; // a genuine dead-end (no legal move) — the arc is broken
    s = reduce(s, intent);
  }
  return { final: s, reachedRung };
}

describe('T0 arc closes end-to-end via real intents (cold open → ascension)', () => {
  const { final, reachedRung } = playToAscension(20260626);

  it('climbs the full contiguous rung ladder R0…R7', () => {
    for (const r of ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as const) {
      expect(reachedRung[r], `never reached ${r}`).toBe(true);
    }
  });

  it('the real combat gates open by actually fighting (not forced flags)', () => {
    expect(hasFlag(final, 'first-fight-survived')).toBe(true); // the scripted grain-store wolf (R2→R3)
    expect(hasFlag(final, 'combat-blooded')).toBe(true); // a real grind fight (R3→R4)
  });

  it('the R7 capstone opened Phase 2 and the Estate banked deeds to EXCELLENT', () => {
    expect(hasFlag(final, 't0-capstone')).toBe(true);
    expect(estateGrade(final)).toBe('EXCELLENT');
    expect(final.influence.estate.value).toBeGreaterThanOrEqual(balance.ESTATE_BANDS.excellent);
  });

  it('THE LOOP CLOSES: the ascension fired and the Estate rose to tier 1', () => {
    expect(final.tier).toBe(1); // T0 → T1
    // post-ascension we are no longer ascension-eligible at the just-cleared grade (it advanced)
    expect(phaseOf({ ...final, tier: 0 })).toBe(2); // the macro engine was open at the capstone
  });

  it('is deterministic — the same seed plays the same arc', () => {
    const again = playToAscension(20260626);
    expect(again.final.tier).toBe(1);
    expect(again.final.influence.estate.value).toBe(final.influence.estate.value);
  });
});

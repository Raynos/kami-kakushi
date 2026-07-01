// The manual opt-in tier ascension (PRD §1.6.4 / §3.3 / D-049/D-062/D-013a). T0→T1: the gate
// is Estate ≥ EXCELLENT and the player CHOOSES the moment — it never auto-advances. Overshoot
// buys a better permanent boon; the FIRST ascension always lands BIG (D-062). Performing it
// bumps `tier` 0→1, grants the boon, fires the per-tier DREAM beat (which READS the accumulated
// mystery flags — the porter's-knot stranger's-habit hands — so they are no longer write-only,
// fixing the v0.1 bug), and emits the ceremonial cascade the UI renders. Pure & deterministic.

import type { GameState } from './state';
import { hasFlag } from './state';
import { phaseOf } from './ranks';
import { estateGrade } from './pillars';
import { applyRewards } from './rewards';
import {
  ESTATE_BANDS,
  ASCENSION_BOON_BASE_POINTS,
  ASCENSION_BOON_OVERSHOOT_PER_POINT,
} from './content/balance';
import { NAMES } from './content/names';

/** The T0→T1 ascension gate (D-049/D-057): Estate ≥ EXCELLENT, in Phase 2, still at tier 0.
 *  This unlocks the OPTION only — the ascension is a manual opt-in story event (D-049/D-062). */
export function ascensionAvailable(state: GameState): boolean {
  return state.tier === 0 && phaseOf(state) === 2 && estateGrade(state) === 'EXCELLENT';
}

/** The grade-scaled permanent boon (attribute points): the always-big base (D-062) + overshoot. */
export function ascensionBoon(state: GameState): number {
  const overshoot = Math.max(0, state.influence.estate.value - ESTATE_BANDS.excellent);
  return ASCENSION_BOON_BASE_POINTS + Math.floor(overshoot / ASCENSION_BOON_OVERSHOOT_PER_POINT);
}

/** Perform the T0→T1 ascension (the `ascend` intent). A no-op unless the gate is open. */
export function ascend(state: GameState): GameState {
  if (!ascensionAvailable(state)) return state;
  const boon = ascensionBoon(state);
  let next: GameState = {
    ...state,
    tier: 1,
    character: {
      ...state.character,
      attributePoints: state.character.attributePoints + boon,
    },
  };
  // The dream beat reads the accumulated mystery flags (no longer write-only): a player who
  // carries the porter's-knot stranger's-habit gets the clearer, more unsettling cut.
  const knot = hasFlag(state, 'porters-knot');
  // These three are INTENTIONAL beat-markers, not dead write-only cruft (battery #19 audit): the
  // ascension e2e (ascension.test.ts) asserts `ascended-t0` + `dream-t0-ascension` as the recorded
  // outcome of the beat, and `dream-t0-ascension` is the forward-hook for the next dream in the
  // chain (the same `dream-1 → dream-2` pattern surfaces.ts already uses) — read when T1's dream lands.
  next = applyRewards(next, {
    flags: ['tier-1-reached', 'ascended-t0', 'dream-t0-ascension'],
    log: [
      {
        channel: 'milestone',
        text: `The house gathers in the main hall. The lord ${NAMES.lord} names you a man of the ${NAMES.house} — no longer a servant earning his rice, but one entrusted with the house's own standing. You feel the weight of it settle, and something in you answer to it. (You ascend — the Estate rises.)`,
      },
      {
        channel: 'narration',
        text: knot
          ? `That night the dream comes clearer than it ever has: hands that are yours and not yours, tying a porter's knot you never learned; a road in the dark; a name on the tip of your tongue. You wake reaching for it, and it is already gone.`
          : `That night a dream comes — a road in the dark, a name almost remembered — and is gone by the time you wake.`,
      },
    ],
  });
  return next;
}

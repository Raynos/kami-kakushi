// The rung ladder engine (PRD §3.2.1 / §4.1.1 / FU6). The Estate Service rung-meter
// accrues from the current rung's CURATED eligible activities and promotes on the
// AND-gate (meter ≥ threshold AND the story milestone). Promotion resets the meter
// and fires the next rank's RewardBundle (the reveal reads as plot). The phase is
// DERIVED from the current rung (never a separate stored flag, FU7).

import type { GameState } from './state';
import { RANKS, getRank, nextRankId, type RankDef, type RankId } from './content/ranks';
import { RUNG_POINTS_PER_ACT, rungThreshold } from './content/balance';
import { applyRewards } from './rewards';
import { satietyMax } from './selectors';

export function currentRank(state: GameState): RankDef {
  return getRank(state.rung);
}

/** Add meter points if the just-performed action feeds the current rung (FU7). */
export function accrueRungMeter(state: GameState, actionId: string): GameState {
  const rank = getRank(state.rung);
  if (!rank.eligible.includes(actionId)) return state;
  return { ...state, rungMeter: state.rungMeter + RUNG_POINTS_PER_ACT };
}

/** Distance-to-next-gate read for the rung ladder (ui-design §5.3). */
export function rungProgress(state: GameState): { into: number; needed: number; ready: boolean } {
  const rank = getRank(state.rung);
  const needed = rungThreshold(rank.id);
  const ready = state.rungMeter >= needed && rank.storyGate(state.flags);
  return {
    into: Math.min(state.rungMeter, needed),
    needed,
    ready,
  };
}

/** Promote while the AND-gate is satisfied (loop-safe; resets meter, fires rewards). */
export function promoteRungs(state: GameState): GameState {
  let next = state;
  let guard = 0;
  while (guard++ < RANKS.length + 1) {
    const rank = getRank(next.rung);
    const nid = nextRankId(next.rung);
    if (!nid) break;
    const threshold = rungThreshold(rank.id);
    const gateOpen = next.rungMeter >= threshold && rank.storyGate(next.flags);
    if (!gateOpen) break;
    const target = getRank(nid);
    next = { ...next, rung: nid, rungMeter: 0 };
    if (target.rewardOnReach) next = applyRewards(next, target.rewardOnReach);
    // a promotion is a renewal — the house feasts a new rank, so the BELLY refills
    // (satiety). HP does NOT: under D-050 only eating (cook) mends wounds, so a rung
    // climb can't be farmed as a free heal.
    next = {
      ...next,
      character: { ...next.character, satiety: satietyMax(next) },
    };
  }
  return next;
}

/** T0 has R0…R7; Phase 2 (the pillar grind) opens after the final rung (FU7). */
export function phaseOf(state: GameState): 1 | 2 {
  return state.rung === 'R7' && state.flags['t0-capstone'] === true ? 2 : 1;
}

export function isRank(state: GameState, id: RankId): boolean {
  return state.rung === id;
}

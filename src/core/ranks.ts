// The rung ladder engine (PRD §3.2.1 / §4.1.1 / FU6). The Estate Service rung-meter
// accrues from the current rung's CURATED eligible activities and promotes on the
// AND-gate (meter ≥ threshold AND the story milestone). Promotion resets the meter
// and fires the next rank's RewardBundle (the reveal reads as plot). The phase is
// DERIVED from the current rung (never a separate stored flag, FU7).

import type { GameState } from './state';
import { getRank, nextRankId, type RankDef, type RankId } from './content/ranks';
import { RUNG_POINTS_PER_ACT, rungThreshold } from './content/balance';
import { getWeapon } from './content/weapons';
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

/** True when the CURRENT rung's AND-gate is open (meter ≥ threshold AND the story milestone).
 *  A thin read over `rungProgress().ready` — the header affordance + `begin_rung_beat` consult it.
 *  D-110: a ready promotion HOLDS here; nothing advances until the player triggers + completes the
 *  rung beat (`choose_rung_option` → `applyPromotion`). */
export function promotionReady(state: GameState): boolean {
  return rungProgress(state).ready;
}

/** The rank a ready promotion would advance INTO, or null when not ready / already at the top rung.
 *  `begin_rung_beat` opens `RUNG_BEATS[pendingPromotionTarget(state)]`. */
export function pendingPromotionTarget(state: GameState): RankId | null {
  return promotionReady(state) ? nextRankId(state.rung) : null;
}

/** Apply EXACTLY ONE promotion INTO `target` (D-110). The former `promoteRungs` body, minus the
 *  gate/loop: bump the rung, reset the meter, fire `rewardOnReach` (flags + unlocks), refill satiety.
 *  This is the SOLE place a rung advances — called only from `choose_rung_option`'s terminal node
 *  (behind the beat) and the DEV rung-seek (a deliberate beat-bypass). It does NOT check the gate;
 *  the gate is verified by `promotionReady` before `begin_rung_beat`. */
export function applyPromotion(state: GameState, target: RankId): GameState {
  const rank = getRank(target);
  let next: GameState = { ...state, rung: target, rungMeter: 0 };
  if (rank.rewardOnReach) next = applyRewards(next, rank.rewardOnReach);
  // D-122 — the T0 status token: a rung that grants `wall-weapon` mounts the weapon you WIELD at that
  // moment on your home wall (the status-mirror). The reveal names your ACTUAL weapon (never a generic
  // sword), read from state — data-driven off the flag, so the R-rung isn't hard-coded here.
  if (rank.rewardOnReach?.flags?.includes('wall-weapon')) {
    const w = getWeapon(next.equippedWeapon);
    next = applyRewards(next, {
      log: [
        {
          channel: 'milestone',
          voice: 'narrator',
          text: `You mount your ${w.label.toLowerCase()} on the wall of your corner — the weapon you carry, and proof of the road you have walked. A servant with a place, and a token of it on the wall.`,
        },
      ],
    });
  }
  // F103 (channel fix): the ONE terse mechanical marker on the Progress/milestone channel — a
  // scannable progression record. Single-sourced from the RankDef (A21 — never hand-typed); the
  // rung-up STORY prose lives in the beat greeting (Story channel), never here.
  next = applyRewards(next, {
    log: [{ channel: 'milestone', text: `Rank ↑ — ${rank.title} ${rank.kanji}` }],
  });
  // a promotion is a renewal — the house feasts a new rank, so the BELLY refills (satiety). HP does
  // NOT: under D-050 only eating (cook) mends wounds, so a rung climb can't be farmed as a free heal.
  next = { ...next, character: { ...next.character, satiety: satietyMax(next) } };
  return next;
}

/** T0 has R0…R7; Phase 2 (the pillar grind) opens after the final rung (FU7). */
export function phaseOf(state: GameState): 1 | 2 {
  return state.rung === 'R7' && state.flags['t0-capstone'] === true ? 2 : 1;
}

export function isRank(state: GameState, id: RankId): boolean {
  return state.rung === id;
}

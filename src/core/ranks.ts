// The rung ladder engine (PRD §3.2.1 / §4.1.1 / FU6, reworked by FB-121 / ADR-137).
// Each rung carries an authored HIDDEN requirement list (content/requirements.ts);
// progress IS the requirements — the player sees only a rounded integer percent, and
// 100% alone opens the gate (the old meter-AND-storyGate model is deleted, not
// wrapped). Promotion resets the progress map and fires the next rank's RewardBundle
// (the reveal reads as plot). The phase is DERIVED from the current rung (FU7).

import type { GameState } from './state';
import { getRank, nextRankId, type RankDef, type RankId } from './content/ranks';
import { allRequirementsDone, isRequirementDone, rungPercentOf } from './requirements-engine';
import type { RequirementDef } from './requirements-engine';
import { rungRequirements } from './content/requirements';
import { getWeapon } from './content/weapons';
import { applyRewards } from './rewards';
import { satietyMax } from './selectors';

export function currentRank(state: GameState): RankDef {
  return getRank(state.rung);
}

/** The player-facing rung read (ui-design §5.3): a rounded INTEGER percent 0–100
 *  (100 ⟺ every requirement done — the engine's 99-clamp keeps rounding honest)
 *  and the gate state. The SAME engine fn feeds the bar, the sim, and the gate
 *  (AC-6 — no drift between preview and reality). */
export function rungProgress(state: GameState): { percent: number; ready: boolean } {
  const defs = rungRequirements(state.rung);
  return {
    percent: rungPercentOf(defs, state.rungReqs),
    ready: allRequirementsDone(defs, state.rungReqs),
  };
}

/** The CURRENT rung's not-yet-done requirements, in authored order — the harness/sim
 *  policies read this ("is only the wolf left?"), never the raw progress map. */
export function remainingRequirements(state: GameState): readonly RequirementDef[] {
  return rungRequirements(state.rung).filter((d) => !isRequirementDone(d, state.rungReqs));
}

/** True when the CURRENT rung's requirement list is fully done (100% IS ready — the
 *  old AND-gate died with the meter). ADR-110 still holds: a ready promotion BANKS
 *  here; nothing advances until the player triggers + completes the rung beat
 *  (`begin_rung_beat` → `choose_rung_option` → `applyPromotion`). */
export function promotionReady(state: GameState): boolean {
  return rungProgress(state).ready;
}

/** The rank a ready promotion would advance INTO, or null when not ready / already at the top rung.
 *  `begin_rung_beat` opens `RUNG_BEATS[pendingPromotionTarget(state)]`. */
export function pendingPromotionTarget(state: GameState): RankId | null {
  return promotionReady(state) ? nextRankId(state.rung) : null;
}

/** Apply EXACTLY ONE promotion INTO `target` (ADR-110). The former `promoteRungs` body, minus the
 *  gate/loop: bump the rung, reset the meter, fire `rewardOnReach` (flags + unlocks), refill satiety.
 *  This is the SOLE place a rung advances — called only from `choose_rung_option`'s terminal node
 *  (behind the beat) and the DEV rung-seek (a deliberate beat-bypass). It does NOT check the gate;
 *  the gate is verified by `promotionReady` before `begin_rung_beat`. */
export function applyPromotion(state: GameState, target: RankId): GameState {
  const rank = getRank(target);
  let next: GameState = { ...state, rung: target, rungReqs: {} };
  if (rank.rewardOnReach) next = applyRewards(next, rank.rewardOnReach);
  // ADR-122 — the T0 status token: a rung that grants `wall-weapon` mounts the weapon you WIELD at that
  // moment on your home wall (the status-mirror). The reveal names your ACTUAL weapon (never a generic
  // sword), read from state — data-driven off the flag, so the R-rung isn't hard-coded here.
  if (rank.rewardOnReach?.flags?.includes('wall-weapon')) {
    const w = getWeapon(next.equippedWeapon);
    next = applyRewards(next, {
      log: [
        {
          channel: 'milestone',
          voice: 'narrator',
          contentKey: 'rank.wallWeapon',
          params: { weapon: w.label.toLowerCase() },
        },
      ],
    });
  }
  // FB-103 (channel fix): the ONE terse mechanical marker on the Progress/milestone channel — a
  // scannable progression record. Single-sourced from the RankDef (AC-21 — never hand-typed); the
  // rung-up STORY prose lives in the beat greeting (Story channel), never here.
  next = applyRewards(next, {
    log: [
      {
        channel: 'milestone',
        contentKey: 'rank.marker',
        params: { title: rank.title, kanji: rank.kanji },
      },
    ],
  });
  // a promotion is a renewal — the house feasts a new rank, so the BELLY refills (satiety). HP does
  // NOT: under ADR-050 only eating (cook) mends wounds, so a rung climb can't be farmed as a free heal.
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

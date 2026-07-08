// The NIGHT-ROUND ENGINE (storywave G2) — pure `(GameState, …) -> GameState` stage
// resolution for the on-rails night round. The CURRENT stage's foe is resolved through
// the EXISTING combat resolver (`resolveFight`) on the seeded `combat` stream, so a round
// is a deterministic replay like every other fight. Outcomes:
//   - a WON stage → MATERIALS-ONLY reward (NEVER coin — the bible: night-round spoils are
//     salvage, not pay) → advance to the next stage; finishing the last stage ends the round.
//   - a `scripted: 'survive'` stage (the R3 wolf) → GUARANTEED survival, NEVER a win: the
//     fighter lives (HP floored), the foe flees bleeding, no death and no victory reward.
//   - a FALL (loss) → the round ends here.
// DORMANT at G2: `NIGHT_ROUNDS` is empty, so no round is reachable live; the tests drive a
// constructed `NightRoundDef` through `resolveNightStage` directly.

import type { GameState } from './state';
import { withResource } from './state';
import { getMob } from './content/enemies';
import { mcCombatStats, mobCombatStats, resolveFight } from './combat';
import { rollMaterialDrop } from './content/crafting';
import { SETBACK_HP } from './content/balance';
import { applyDefeatConsequences } from './defeat';
import type { NightRoundDef, NightRoundStage } from './content/nightRounds';

/** The in-flight round cursor (mirrors `GameState['roundState']`). */
export type RoundState = { readonly roundId: string; readonly stage: number };

/** A won stage's reward — MATERIALS ONLY, never coin (bible). Exposed as a typed shape so a
 *  test can assert the reward carries no coin (RED the moment anyone adds a coin reward). */
export interface NightStageReward {
  readonly materials: Readonly<Record<string, number>>;
}

function setHp(state: GameState, hp: number): GameState {
  return { ...state, character: { ...state.character, hp } };
}

/** Roll a won stage's MATERIALS-ONLY reward off the foe's carcass (seeded LOOT stream). No
 *  coin path exists by construction — the return shape has only `materials`. */
export function nightStageReward(
  rng: GameState['rng'],
  stage: NightRoundStage,
): {
  reward: NightStageReward;
  rng: GameState['rng'];
} {
  const [drop, r] = rollMaterialDrop(rng, stage.foe);
  const materials: Record<string, number> = {};
  if (drop) materials[drop.material] = drop.qty;
  return { reward: { materials }, rng: r };
}

/** Advance the round cursor one stage; clearing `roundState` when the last stage is done
 *  (the round is FINISHED — its rewards were materials-only, granted per stage). */
function advanceStage(state: GameState, def: NightRoundDef): GameState {
  const cur = state.roundState;
  if (cur === null) return state;
  const nextStage = cur.stage + 1;
  if (nextStage >= def.stages.length) return { ...state, roundState: null };
  return { ...state, roundState: { roundId: cur.roundId, stage: nextStage } };
}

/** Resolve the CURRENT stage of an in-flight round through the seeded combat resolver. */
export function resolveNightStage(state: GameState, def: NightRoundDef): GameState {
  if (state.roundState === null || state.roundState.roundId !== def.id) return state;
  const stage = def.stages[state.roundState.stage];
  if (!stage) return state; // no stage under the cursor (round already past its last)
  const mob = getMob(stage.foe);
  const result = resolveFight(state.rng, mcCombatStats(state), mobCombatStats(mob));
  let next: GameState = { ...state, rng: result.rng };

  if (stage.scripted === 'survive') {
    // The R3 wolf: GUARANTEED survival, NEVER a win. Ignore the sim's win/loss verdict —
    // force a survive-and-advance: HP floored at the setback floor (never 0, never a death),
    // and NO reward (a survive stage is never a victory). Blood on the sill, mostly his.
    next = setHp(next, Math.max(SETBACK_HP, result.mcHpLeft));
    // The wolf-flees / new-moon crossing log line is G4 content (a per-stage newMoonLine key).
    return advanceStage(next, def);
  }

  if (result.won) {
    next = setHp(next, result.mcHpLeft);
    // MATERIALS-ONLY reward (never coin — bible), rolled on the LOOT stream (independent of
    // the combat cursor) so it folds cleanly into the round's seeded replay.
    const { reward, rng: lootRng } = nightStageReward(next.rng, stage);
    next = { ...next, rng: lootRng };
    for (const [id, qty] of Object.entries(reward.materials)) next = withResource(next, id, qty);
    return advanceStage(next, def);
  }

  // FALL (loss): the round ENDS here — HP at the setback floor, cursor cleared, and (G3) the
  // SHARED defeat→sickroom consequence: Sōan's ledger grows, SICKROOM_DAYS_LOST whole days are
  // lost, and the MC relocates to the sickroom node once it exists (the guard no-ops today). The
  // carried-loss BLEED lives with the grind-fight loss branch (fight.ts) for now — night rounds
  // are DORMANT (empty registry) so nothing carried is bled here yet; that folds into the shared
  // handler when the round lane goes live (G4).
  next = setHp(next, SETBACK_HP);
  next = applyDefeatConsequences(next);
  return { ...next, roundState: null };
}

/** Begin a round: seat the cursor at stage 0. (The reducer arm calls this; dormant with the
 *  empty registry.) */
export function beginNightRound(state: GameState, def: NightRoundDef): GameState {
  return { ...state, roundState: { roundId: def.id, stage: 0 } };
}

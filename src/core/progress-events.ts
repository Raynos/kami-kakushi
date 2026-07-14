// The shared progress-event glue (AC-20 / FB-121). Fight, labour, and economy reducers
// emit ONE '<verb>:<subject>' advance-token stream; this module fans it out to every
// consumer — the quest engine (ADR-037) AND the rung-requirements engine (ADR-137) —
// so a new consumer never grows a reducer→reducer call. It also runs the atomic
// requirement settle pass (state predicates + story flags) at the reduce tail.
//
// Every requirement completion emits its authored flavor line — a PERMANENT
// narration-channel line in the narrator's voice: the % bar's jump always has a
// visible, diegetic cause in the log (T3/T4), without naming a checklist item.

import type { GameState } from './state';
import { applyQuestEvent } from './quest-engine';
import {
  advanceOnToken,
  settleOnState,
  type AdvanceResult,
  type RequirementDef,
} from './requirements-engine';
import { requirementFlavor, rungRequirements } from './content/requirements';
import { applyRewards } from './rewards';

/** Fold an engine advance result back onto the state: store the next progress map and
 *  voice each newly-completed requirement's flavor line (exactly once — the engine
 *  reports only fresh completions). */
function foldAdvance(state: GameState, result: AdvanceResult): GameState {
  if (result.progress === state.rungReqs) return state;
  let next: GameState = { ...state, rungReqs: result.progress };
  for (const req of result.completed) next = voiceFlavor(next, req);
  return next;
}

function voiceFlavor(state: GameState, req: RequirementDef): GameState {
  // requirementFlavor = canon, or the DEV switcher's selected take (ADR-139 review).
  // The save persists the requirement's ID; its words re-render from the requirements registry.
  return applyRewards(state, {
    log: [
      {
        channel: 'narration',
        text: requirementFlavor(req),
        voice: 'narrator',
        contentKey: `requirement.${req.id}`,
      },
    ],
  });
}

/** Emit an advance token ('act:rake_rice', 'kill:boar', 'gather:wood') to every
 *  consumer: accepted quests + the current rung's counted requirements. */
export function applyProgressEvent(state: GameState, token: string): GameState {
  let next = applyQuestEvent(state, token);
  next = foldAdvance(
    next,
    advanceOnToken(rungRequirements(next.rung), next.rungReqs, token),
  );
  return next;
}

/** The reduce-tail settle pass: evaluate the current rung's not-yet-done ATOMIC
 *  requirements (state predicates + story flags) against the post-intent snapshot,
 *  latching completions + voicing their flavor. Cheap when nothing is pending. */
export function settleRequirements(state: GameState): GameState {
  return foldAdvance(
    state,
    settleOnState(rungRequirements(state.rung), state.rungReqs, state),
  );
}

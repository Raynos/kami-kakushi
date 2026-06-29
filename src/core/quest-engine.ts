// The quest progression glue (T0-M4-F1 / D-037). Sits between the pure quest DATA
// (content/quests.ts) and the GameState reducers: it accepts quests and routes advance-event
// tokens ('<verb>:<subject>') from the fight/labour reducers to every accepted quest. Lives
// in its own module so BOTH fight.ts and intents.ts can emit events without an import cycle
// (it imports rewards/quests/state; neither fight nor intents is imported back). Pure.

import type { GameState } from './state';
import { getQuest, advanceQuest, isQuestComplete } from './content/quests';
import { applyRewards } from './rewards';

/** Accept a quest (seed empty step-progress). A no-op if already accepted; validates the id. */
export function acceptQuest(state: GameState, questId: string): GameState {
  if (state.quests.accepted.includes(questId)) return state;
  getQuest(questId); // throws on an unknown id
  return {
    ...state,
    quests: {
      ...state.quests,
      accepted: [...state.quests.accepted, questId],
      progress: { ...state.quests.progress, [questId]: state.quests.progress[questId] ?? [] },
    },
  };
}

/** Emit an advance token to every accepted, not-yet-completed quest. Marks matching steps done
 *  (order-free); on completion grants the quest reward EXACTLY ONCE (the `completed` list +
 *  the reward's own flag are the double-grant guard). An unmatched token is a cheap no-op. */
export function applyQuestEvent(state: GameState, token: string): GameState {
  if (state.quests.accepted.length === 0) return state;
  let next = state;
  for (const id of state.quests.accepted) {
    if (next.quests.completed.includes(id)) continue;
    const quest = getQuest(id);
    const done = advanceQuest(new Set(next.quests.progress[id] ?? []), token, quest);
    next = {
      ...next,
      quests: { ...next.quests, progress: { ...next.quests.progress, [id]: [...done] } },
    };
    if (isQuestComplete(done, quest)) {
      next = { ...next, quests: { ...next.quests, completed: [...next.quests.completed, id] } };
      next = applyRewards(next, quest.reward);
    }
  }
  return next;
}

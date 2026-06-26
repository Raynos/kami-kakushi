// The universal rewards/unlock bus (PRD §6.4 core/rewards): the ONE funnel through
// which intents, quests, thresholds, and combat grant resources/flags/unlocks and
// emit diegetic log lines. (XP / items / pillarDeltas / quests arrive additively at
// their milestone; pillarDeltas accrual is Phase-2-gated, §6.5.)

import type { GameState, ResourceId, FlagId } from './state';
import { withResource, setFlag } from './state';
import { pushLog, type LogChannel } from './log';
import { revealSurface } from './unlock';

export interface RewardBundle {
  readonly resources?: Readonly<Record<ResourceId, number>>;
  readonly flags?: readonly FlagId[];
  readonly unlock?: readonly string[];
  readonly log?: readonly { readonly channel: LogChannel; readonly text: string }[];
}

export function applyRewards(state: GameState, rewards: RewardBundle): GameState {
  let next = state;
  if (rewards.resources) {
    for (const [id, delta] of Object.entries(rewards.resources)) {
      next = withResource(next, id, delta);
    }
  }
  if (rewards.flags) {
    for (const f of rewards.flags) next = setFlag(next, f, true);
  }
  if (rewards.log) {
    for (const line of rewards.log) {
      next = { ...next, log: pushLog(next.log, line.channel, line.text, next.clock.tick) };
    }
  }
  if (rewards.unlock) {
    for (const id of rewards.unlock) next = revealSurface(next, id);
  }
  return next;
}

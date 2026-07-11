// The universal rewards/unlock bus (PRD §6.4 core/rewards): the ONE funnel through
// which intents, quests, thresholds, and combat grant resources/flags/unlocks and
// emit diegetic log lines. (XP / items / pillarDeltas / quests arrive additively at
// their milestone; pillarDeltas accrual is Phase-2-gated, §6.5.)

import type { GameState, ResourceId, FlagId } from './state';
import { withResource, setFlag } from './state';
import { pushLog, type LogChannel } from './log';
import { playerSpeaker, type VoiceCategory } from './content/voices';
import { renderLogLine, type LogParams } from './content/log-render';

export interface RewardBundle {
  readonly resources?: Readonly<Record<ResourceId, number>>;
  readonly flags?: readonly FlagId[];
  /** DECLARATIVE since ADR-179: the surfaces this grant makes visible from here on.
   *  Read by the schedule builder (core/unlock SURFACE_RUNG) + the promotion ceremony
   *  (ceremonyLabels) — applyRewards itself no longer latches anything; visibility
   *  derives from the flags/facts this same bundle sets. */
  readonly unlock?: readonly string[];
  readonly log?: readonly {
    readonly channel: LogChannel;
    /** The line's words, EITHER inline (`text`) OR via the log-content registry
     *  (`contentKey` + `params`). During the Stage-C migration both forms coexist; a
     *  keyed line persists as a compact descriptor, an inline line as its prose. */
    readonly text?: string | undefined;
    readonly contentKey?: string | undefined;
    readonly params?: LogParams | undefined;
    /** Optional speaker nameplate + voice tag (carried to the log entry; FB-23/FB-26). */
    readonly speaker?: string | undefined;
    readonly voice?: VoiceCategory | undefined;
    /** Fleeting flavor (FB-53) — routed to the "Now" view only; kept off the permanent channels. */
    readonly ephemeral?: boolean | undefined;
    /** Optional Q&A (FB-111) — routed to the "Chat" tab (+ `all`), kept off the mandatory "Story" tab. */
    readonly chat?: boolean | undefined;
    /** Chat-group context label (FB-270) — see LogEntry.context. */
    readonly context?: string | undefined;
  }[];
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
      // A keyed line derives its text from the registry (the single source, T1); an inline
      // line uses its prose verbatim (transitional, until every emit site is migrated).
      const text =
        line.contentKey !== undefined
          ? renderLogLine(line.contentKey, line.params)
          : (line.text ?? '');
      next = {
        ...next,
        log: pushLog(next.log, line.channel, text, next.clock.tick, {
          // FB-198 — a player-voiced line authored with no static name (the narrative
          // `You:` form) takes the G4.7 speaker-ladder label (You → Nameless → Gonbei)
          // HERE, the one funnel every log emission crosses — no per-site resolution.
          speaker:
            line.voice === 'player' && line.speaker === undefined
              ? playerSpeaker(next)
              : line.speaker,
          voice: line.voice,
          ephemeral: line.ephemeral,
          chat: line.chat,
          context: line.context,
          contentKey: line.contentKey,
          params: line.params,
        }),
      };
    }
  }
  return next;
}

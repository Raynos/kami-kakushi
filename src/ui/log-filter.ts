// The event-log channel FILTER (playtest F9): the log panel gains a bottom bar that
// filters which channels show, so the story is a first-class, returnable view rather than
// buried under work/combat spam. Pure (no DOM) so the channel→category mapping is unit-
// tested directly; the renderer + the bar presentation live in render.ts / dev.ts.

import type { LogChannel } from '../core/log';

export type LogFilter = 'story' | 'progression' | 'combat' | 'work' | 'all' | 'now';

/** The bar's buttons, left→right (F52). `story` leads (the default returnable view — F9);
 *  `all` is the escape hatch; `now` trails as the fleeting-flavor scratch view (F53 — fades). */
export const LOG_FILTERS: readonly { id: LogFilter; label: string }[] = [
  { id: 'story', label: 'Story' },
  { id: 'progression', label: 'Progress' },
  { id: 'combat', label: 'Combat' },
  { id: 'work', label: 'Work' },
  { id: 'all', label: 'All' },
  { id: 'now', label: 'Now' },
];

/** channel → which category-set shows it. `null` = the catch-all (`all` shows everything).
 *  Mapping (F9): Story = the diegetic narration; Work = labour rewards + mundane system
 *  lines; Combat = the fight; Progression = milestones (rung-ups, unlocks, crafts). `now` is
 *  NOT here — it's the ephemeral axis, handled specially in logFilterMatches (F53). */
const FILTER_CHANNELS: Record<Exclude<LogFilter, 'now'>, ReadonlySet<LogChannel> | null> = {
  story: new Set<LogChannel>(['narration']),
  work: new Set<LogChannel>(['reward', 'system']),
  combat: new Set<LogChannel>(['combat']),
  progression: new Set<LogChannel>(['milestone']),
  all: null,
};

/** Does a log entry (`channel` + its `ephemeral` flag) show under the active `filter`?
 *  F53: the `now` view is the SOLE home of fleeting flavor — it matches ONLY ephemeral entries;
 *  every other filter (story/progress/combat/work/all) hides ephemeral entirely, so the permanent
 *  channels + All never carry the transient noise. */
export function logFilterMatches(
  channel: LogChannel,
  filter: LogFilter,
  ephemeral: boolean,
): boolean {
  if (filter === 'now') return ephemeral;
  if (ephemeral) return false;
  const set = FILTER_CHANNELS[filter];
  return set === null || set.has(channel);
}

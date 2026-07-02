// The event-log channel FILTER (playtest F9): the log panel gains a bottom bar that
// filters which channels show, so the story is a first-class, returnable view rather than
// buried under work/combat spam. Pure (no DOM) so the channel→category mapping is unit-
// tested directly; the renderer + the bar presentation live in render.ts / dev.ts.

import type { LogChannel } from '../core/log';

export type LogFilter = 'story' | 'work' | 'combat' | 'progression' | 'all';

/** The bar's buttons, left→right. `story` leads (the default view — F9: "the story is cool,
 *  a tab you can come back to"); `all` trails as the escape hatch. */
export const LOG_FILTERS: readonly { id: LogFilter; label: string }[] = [
  { id: 'story', label: 'Story' },
  { id: 'work', label: 'Work' },
  { id: 'combat', label: 'Combat' },
  { id: 'progression', label: 'Progress' },
  { id: 'all', label: 'All' },
];

/** channel → which category-set shows it. `null` = the catch-all (`all` shows everything).
 *  Mapping (F9): Story = the diegetic narration; Work = labour rewards + mundane system
 *  lines; Combat = the fight; Progression = milestones (rung-ups, unlocks, crafts). */
const FILTER_CHANNELS: Record<LogFilter, ReadonlySet<LogChannel> | null> = {
  story: new Set<LogChannel>(['narration']),
  work: new Set<LogChannel>(['reward', 'system']),
  combat: new Set<LogChannel>(['combat']),
  progression: new Set<LogChannel>(['milestone']),
  all: null,
};

/** Does a log entry on `channel` show under the active `filter`? */
export function logFilterMatches(channel: LogChannel, filter: LogFilter): boolean {
  const set = FILTER_CHANNELS[filter];
  return set === null || set.has(channel);
}

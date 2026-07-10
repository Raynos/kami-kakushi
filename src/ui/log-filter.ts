// The event-log channel FILTER (playtest FB-9): the log panel gains a bottom bar that
// filters which channels show, so the story is a first-class, returnable view rather than
// buried under work/combat spam. Pure (no DOM) so the channel→category mapping is unit-
// tested directly; the renderer + the bar presentation live in render.ts / dev.ts.

import type { LogChannel } from '../core/log';

export type LogFilter = 'story' | 'progression' | 'chat' | 'combat' | 'work' | 'all' | 'now';

/** The bar's buttons, left→right (FB-111): Story · Progress · Chat · Combat · Work · All · Now.
 *  `story` leads (the default returnable view — FB-9); `chat` holds the OPTIONAL Q&A you chose to ask
 *  (FB-111); `all` is the escape hatch; `now` trails as the fleeting-flavor scratch view (FB-53 — fades). */
export const LOG_FILTERS: readonly { id: LogFilter; label: string }[] = [
  { id: 'story', label: 'Story' },
  { id: 'progression', label: 'Progress' },
  { id: 'chat', label: 'Chat' },
  { id: 'combat', label: 'Combat' },
  { id: 'work', label: 'Work' },
  { id: 'all', label: 'All' },
  { id: 'now', label: 'Now' },
];

/** channel → which category-set shows it. `null` = the catch-all (`all` shows everything).
 *  Mapping (FB-9): Story = the diegetic narration; Work = labour rewards + mundane system
 *  lines; Combat = the fight; Progression = milestones (rung-ups, unlocks, crafts). `now` (FB-53)
 *  and `chat` (FB-111) are NOT here — they're the ephemeral / optional-Q&A axes, orthogonal to
 *  channel and handled specially in logFilterMatches. */
const FILTER_CHANNELS: Record<
  Exclude<LogFilter, 'now' | 'chat'>,
  ReadonlySet<LogChannel> | null
> = {
  story: new Set<LogChannel>(['narration']),
  work: new Set<LogChannel>(['reward', 'system']),
  combat: new Set<LogChannel>(['combat']),
  progression: new Set<LogChannel>(['milestone']),
  all: null,
};

/** FB-320 — the Story tab's sub-view. `vn` keeps only the SCENE lines (a `context`-carrying
 *  line is one a VN scene emitted — the MAIN story); `all` keeps the full story channel
 *  (scene lines + ambient narration flavor). Only consulted while the active filter is
 *  `story`; every other filter ignores it. */
export type StorySub = 'vn' | 'all';

export function storySubMatches(sub: StorySub, hasContext: boolean): boolean {
  return sub === 'all' || hasContext;
}

/** Does a log entry (`channel` + its `ephemeral` / `chat` flags) show under the active `filter`?
 *  Two axes sit ORTHOGONAL to the channel mapping:
 *  - FB-53: `now` is the SOLE home of fleeting flavor — it matches ONLY ephemeral entries; every
 *    other filter hides ephemeral entirely, so the permanent channels + All never carry it.
 *  - FB-111: `chat` is the home of the OPTIONAL Q&A the player chose to ask — a chat line shows in
 *    Chat (and the All escape-hatch), never in the MANDATORY Story tab (which keeps only the scene
 *    beats you must see). A chat line stays `narration` so it renders with its voice/nameplate. */
export function logFilterMatches(
  channel: LogChannel,
  filter: LogFilter,
  ephemeral: boolean,
  chat = false,
): boolean {
  // ephemeral axis first (FB-53): Now shows only ephemeral; no permanent view shows ephemeral.
  if (filter === 'now') return ephemeral;
  if (ephemeral) return false;
  // chat axis (FB-111): the optional Q&A lives in Chat + All, and is withheld from Story/etc.
  if (filter === 'chat') return chat;
  if (chat) return filter === 'all';
  // permanent, non-chat lines: the channel→category mapping.
  const set = FILTER_CHANNELS[filter];
  return set === null || set.has(channel);
}

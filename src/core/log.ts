// The event/story log model (PRD §6.4 / core/log): a true ring buffer capped at
// LOG_RING_MAX. Data only — the renderer paints it (via textContent, never
// innerHTML; PRD §6.9 XSS guard). The log is the HERO surface (ui-design.md §5.1):
// each line is a tier of the house's story.

import { LOG_RING_MAX } from './constants';

/** Visual/semantic channels (ui-design.md §5.1). */
export type LogChannel = 'narration' | 'reward' | 'combat' | 'system' | 'milestone';

export interface LogEntry {
  /** Stable monotonic key for keyed DOM reconciliation + reveal-on-load no-respam. */
  readonly key: number;
  readonly channel: LogChannel;
  /** Authored diegetic text (trusted; rendered via textContent). */
  readonly text: string;
  /** The abstract tick at which it was emitted. */
  readonly tick: number;
}

export interface LogState {
  readonly entries: readonly LogEntry[];
  /** Monotonic counter: total lines ever pushed (drives unique keys). */
  readonly seq: number;
}

export function emptyLog(): LogState {
  return { entries: [], seq: 0 };
}

/** Append a line, evicting the oldest once the ring is full. Immutable-in/out. */
export function pushLog(log: LogState, channel: LogChannel, text: string, tick: number): LogState {
  const entry: LogEntry = { key: log.seq, channel, text, tick };
  const next =
    log.entries.length >= LOG_RING_MAX
      ? [...log.entries.slice(log.entries.length - LOG_RING_MAX + 1), entry]
      : [...log.entries, entry];
  return { entries: next, seq: log.seq + 1 };
}

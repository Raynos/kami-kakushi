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
  /** The abstract tick at which it was (last) emitted. */
  readonly tick: number;
  /** Consecutive byte-identical (same channel+text) repeats collapsed onto this entry.
   *  Always ≥1; the renderer paints a "×N" tally (audit §3 #3 / G-LOG readability gate). */
  readonly count: number;
}

export interface LogState {
  readonly entries: readonly LogEntry[];
  /** Monotonic counter: total lines ever pushed (drives unique keys). */
  readonly seq: number;
}

export function emptyLog(): LogState {
  return { entries: [], seq: 0 };
}

/** Append a line, evicting the oldest once the ring is full. Immutable-in/out.
 *  A run of consecutive same-channel+same-text lines coalesces onto the last entry
 *  (count++), so an auto-grind never spams byte-identical rows (G-LOG). The coalesced
 *  entry keeps its original `key`, and `seq` is NOT consumed — so keyed DOM
 *  reconciliation and the reveal-on-load cursor stay stable. */
export function pushLog(log: LogState, channel: LogChannel, text: string, tick: number): LogState {
  const last = log.entries[log.entries.length - 1];
  if (last !== undefined && last.channel === channel && last.text === text) {
    const bumped: LogEntry = { ...last, count: last.count + 1, tick };
    return { entries: [...log.entries.slice(0, -1), bumped], seq: log.seq };
  }
  const entry: LogEntry = { key: log.seq, channel, text, tick, count: 1 };
  const next =
    log.entries.length >= LOG_RING_MAX
      ? [...log.entries.slice(log.entries.length - LOG_RING_MAX + 1), entry]
      : [...log.entries, entry];
  return { entries: next, seq: log.seq + 1 };
}

// The event/story log model (PRD §6.4 / core/log): a true ring buffer capped at
// LOG_RING_MAX. Data only — the renderer paints it (via textContent, never
// innerHTML; PRD §6.9 XSS guard). The log is the HERO surface (ui-design.md §5.1):
// each line is a tier of the house's story.

import { LOG_RING_MAX } from './constants';
import type { VoiceCategory } from './content/voices';

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
  /** Optional nameplate for a spoken line (display name or 'You'). Absent ⇒ no nameplate.
   *  Carried by the core; the renderer paints it (a later phase, interactive-intro plan §3.1). */
  readonly speaker?: string;
  /** Optional speaker category — drives the render-time colour class. Absent ⇒ 'narrator'. */
  readonly voice?: VoiceCategory;
  /** Fleeting flavor (rest / trivial labour output) — lives ONLY in the render's "Now" view and
   *  fades ~15s after it appears (a RENDER-time, wall-clock concern; the pure core never times it).
   *  The permanent channels + `all` never show it. Absent ⇒ a normal, permanent line. */
  readonly ephemeral?: boolean;
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
export function pushLog(
  log: LogState,
  channel: LogChannel,
  text: string,
  tick: number,
  meta?: {
    readonly speaker?: string | undefined;
    readonly voice?: VoiceCategory | undefined;
    readonly ephemeral?: boolean | undefined;
  },
): LogState {
  const last = log.entries[log.entries.length - 1];
  // Coalesce key stays channel+text (speech lines rarely byte-repeat); the bumped entry
  // keeps its original speaker/voice via `...last` (identical-text runs share them anyway).
  if (last !== undefined && last.channel === channel && last.text === text) {
    const bumped: LogEntry = { ...last, count: last.count + 1, tick };
    return { entries: [...log.entries.slice(0, -1), bumped], seq: log.seq };
  }
  const entry: LogEntry = {
    key: log.seq,
    channel,
    text,
    tick,
    count: 1,
    ...(meta?.speaker !== undefined ? { speaker: meta.speaker } : {}),
    ...(meta?.voice !== undefined ? { voice: meta.voice } : {}),
    ...(meta?.ephemeral !== undefined ? { ephemeral: meta.ephemeral } : {}),
  };
  const next =
    log.entries.length >= LOG_RING_MAX
      ? [...log.entries.slice(log.entries.length - LOG_RING_MAX + 1), entry]
      : [...log.entries, entry];
  return { entries: next, seq: log.seq + 1 };
}

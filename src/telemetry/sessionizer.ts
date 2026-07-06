// The attended-time sessionizer (FB-8) — a PURE incremental reducer that turns a timeline of
// typed events into attended-time segments, so 5-min-play / 20-min-away / 5-min-play records
// 10 minutes of gameplay, not 30 (the human's rule, the plan's §2 worked example).
//
// PURE means: no DOM, no Date.now(), no storage — timestamps arrive ON the events. The live
// DOM shell (signals.ts) and the unit suite consume the SAME advance() one event at a time,
// so the correctness proof (sessionizer.test.ts) covers exactly what runs in the browser.
//
// Time classes (plan §2.2) — at any instant, time is in exactly one class:
//   (a) attended-active   visible + focused + input within INPUT_RECENCY_MS      → counted
//   (b) attended-idle     visible + focused, no input but within the idle TTL    → counted
//                         (watching autos grind / reading the log IS play)
//   (c) hidden/away       document.hidden OR window blurred                      → excluded ALWAYS
//   (d) unattended-visible past the idle TTL: the walked-away edge               → excluded,
//                         detected RETROACTIVELY (segment closed back-dated to lastInput+TTL)
//
// The idle TTL is TWO-TIER (human-locked 2026-07-05): 5 min while autos are armed (watching a
// grind), 2 min static (a still screen with no input is more likely a walk-away). The TTL in
// force is the autos-armed state DURING the gap — an auto-stop mid-gap drops the span to the
// static TTL, which is the honest reading (the grind you were watching has ended).

/** One event on the sessionizer's timeline. The DOM shell is the only producer in the app;
 *  tests produce them synthetically. `t` is epoch ms (Date.now() — comparable across events
 *  and to savedAt; sleep jumps are caught by the heartbeat watchdog, plan §6.6). */
export type TelemetryEvent =
  | { t: number; kind: 'visible' | 'hidden' } // Page Visibility API
  | { t: number; kind: 'focus' | 'blur' } // window focus/blur
  | { t: number; kind: 'input' } // raw pointer/key/wheel, throttled by the shell
  | { t: number; kind: 'intent' } // a PLAYER intent dispatched (never auto-mode's)
  | { t: number; kind: 'auto'; armed: boolean } // any auto (labour/rake/combat) armed/disarmed
  | { t: number; kind: 'note' } // attention-worthy game notification (auto-stop, promotion-ready)
  | { t: number; kind: 'heartbeat' } // watchdog sample (sleep/freeze detection)
  | { t: number; kind: 'flush' }; // unload / run-change: close out now

/** Why a segment closed — the report's closer histogram is the calibration read's raw material
 *  (which rule clipped what — plan §6.1). */
export type SegmentCloser = 'hidden' | 'blur' | 'idle-ttl' | 'sleep-gap' | 'flush';

/** A maximal contiguous attended span. active/idle interleave freely WITHIN a segment;
 *  hidden/blur/walk-away close it. `autosArmedMs` distinguishes watching-a-grind from
 *  reading-a-static-screen after the fact (plan §2.2b). */
export interface Segment {
  readonly start: number;
  readonly end: number;
  readonly activeMs: number;
  readonly idleMs: number;
  readonly autosArmedMs: number;
  readonly closer: SegmentCloser;
}

/** The tunable constants (plan §2.4) — every default carries its rationale here, and every
 *  value is injectable (tests + `__qa.telemetry.configure` shrink them). */
export interface TelemetryConfig {
  /** Input within this ⇒ attended-active. 60 s: one action per minute is unambiguously hands-on. */
  readonly inputRecencyMs: number;
  /** Visible-no-input credit cap while autos are armed. 5 min: watching a grind IS play, but
   *  past 5 min with zero input the odds you walked away dominate. */
  readonly idleTtlAutosMs: number;
  /** Visible-no-input credit cap with NO autos armed (human-locked two-tier deviation): a still
   *  screen produces nothing to watch, so the walk-away odds dominate sooner. 2 min. */
  readonly idleTtlStaticMs: number;
  /** Input within this after a note ⇒ you were watching (segment reopens back-dated to the
   *  note). 30 s: a fast reaction to a game notification is evidence of attention. The plan's
   *  flagged weakest rule — set 0 to disable. */
  readonly noteReengageWindowMs: number;
  /** Watchdog sample cadence. 30 s: cheap, and bounds the sleep-split error. */
  readonly heartbeatMs: number;
  /** Gap > heartbeat × this ⇒ the machine slept / tab froze without a visibilitychange;
   *  close back-dated to the last event. 3 ⇒ 90 s worst-case over-credit, bounded and stated. */
  readonly heartbeatGapFactor: number;
}

export const DEFAULT_TELEMETRY_CONFIG: TelemetryConfig = {
  inputRecencyMs: 60_000,
  idleTtlAutosMs: 300_000,
  idleTtlStaticMs: 120_000,
  noteReengageWindowMs: 30_000,
  heartbeatMs: 30_000,
  heartbeatGapFactor: 3,
};

interface OpenSegment {
  readonly start: number;
  readonly activeMs: number;
  readonly idleMs: number;
  readonly autosArmedMs: number;
}

/** The full reducer state. Immutable — advance() returns a fresh object (game-core idiom). */
export interface SessionizerState {
  readonly config: TelemetryConfig;
  readonly visible: boolean;
  readonly focused: boolean;
  readonly autosArmed: boolean;
  readonly lastEventT: number;
  readonly lastInputT: number;
  /** A note that fired while unattended-visible (the only time it matters — §2.2's
   *  re-engagement heuristic); cleared when a segment opens. */
  readonly lastNoteT: number | null;
  readonly open: OpenSegment | null;
  readonly segments: readonly Segment[];
  /** Closed-segment totals (the open segment's accrual is added by attendedMs()). */
  readonly closedActiveMs: number;
  readonly closedIdleMs: number;
}

/** Boot a sessionizer at time `t` with the document's real visibility/focus. No segment opens
 *  until the first input/intent — attention is proven by acting, never assumed. */
export function createSessionizer(
  t: number,
  config: Partial<TelemetryConfig> = {},
  init: { visible?: boolean; focused?: boolean } = {},
): SessionizerState {
  return {
    config: { ...DEFAULT_TELEMETRY_CONFIG, ...config },
    visible: init.visible ?? true,
    focused: init.focused ?? true,
    autosArmed: false,
    lastEventT: t,
    // Sentinel far past: no input yet, so no active/idle credit can accrue before the first one.
    lastInputT: Number.NEGATIVE_INFINITY,
    lastNoteT: null,
    open: null,
    segments: [],
    closedActiveMs: 0,
    closedIdleMs: 0,
  };
}

/** Monotonic attended total (ms): closed segments + the open segment's accrued span. Milestone
 *  snapshots read this — per-rung attended time is a difference of two reads, which by
 *  construction sums attended segments BETWEEN milestones across any number of gaps (§2.3). */
export function attendedMs(s: SessionizerState): number {
  const openMs = s.open ? s.open.activeMs + s.open.idleMs : 0;
  return s.closedActiveMs + s.closedIdleMs + openMs;
}

/** The TTL in force for the current gap — two-tier by the autos-armed state (human-locked). */
function idleTtl(s: SessionizerState): number {
  return s.autosArmed ? s.config.idleTtlAutosMs : s.config.idleTtlStaticMs;
}

/** Accrue the span [t0, t1] into the open segment: active up to lastInput+recency, idle after. */
function accrue(s: SessionizerState, t0: number, t1: number): SessionizerState {
  if (!s.open || t1 <= t0) return s;
  const activeEnd = Math.min(t1, Math.max(t0, s.lastInputT + s.config.inputRecencyMs));
  const active = activeEnd - t0;
  const idle = t1 - activeEnd;
  return {
    ...s,
    open: {
      ...s.open,
      activeMs: s.open.activeMs + active,
      idleMs: s.open.idleMs + idle,
      autosArmedMs: s.open.autosArmedMs + (s.autosArmed ? t1 - t0 : 0),
    },
  };
}

/** Close the open segment at `end` (already accrued to `end` by the caller). */
function close(s: SessionizerState, end: number, closer: SegmentCloser): SessionizerState {
  if (!s.open) return s;
  const seg: Segment = {
    start: s.open.start,
    end,
    activeMs: s.open.activeMs,
    idleMs: s.open.idleMs,
    autosArmedMs: s.open.autosArmedMs,
    closer,
  };
  return {
    ...s,
    open: null,
    segments: [...s.segments, seg],
    closedActiveMs: s.closedActiveMs + seg.activeMs,
    closedIdleMs: s.closedIdleMs + seg.idleMs,
  };
}

/** The reducer. Order of operations per event (each step justified in the plan §2.2–2.3):
 *  1. sleep watchdog — a silent gap > heartbeat×factor closes back-dated to the LAST event
 *     (nothing in the gap is credited: the machine was asleep / the tab frozen);
 *  2. walked-away retro-split — if the event lands past lastInput+TTL, accrue only up to the
 *     TTL deadline and close there (`idle-ttl`);
 *  3. normal accrual of [lastEvent, now] into the open segment;
 *  4. the event's own edge (visibility/focus close-or-track, input opens/reopens, etc.). */
export function advance(state: SessionizerState, ev: TelemetryEvent): SessionizerState {
  let s = state;
  const t = ev.t;
  const gap = t - s.lastEventT;

  if (s.open && gap > s.config.heartbeatMs * s.config.heartbeatGapFactor) {
    // (1) sleep/freeze: close at the last event we actually saw; the gap is dead time.
    s = close(s, s.lastEventT, 'sleep-gap');
  } else if (s.open) {
    // Clamped to lastEventT: an auto-disarm mid-gap shrinks the TTL (300s→120s) and can move
    // the deadline BEHIND spans already legitimately accrued under the armed TTL — credit
    // granted while the grind ran is never clawed back; the close just lands where we are.
    const deadline = Math.max(s.lastInputT + idleTtl(s), s.lastEventT);
    if (t > deadline) {
      // (2) walked away with the tab up: only discoverable in hindsight — back-date the close.
      s = accrue(s, s.lastEventT, deadline);
      s = close(s, deadline, 'idle-ttl');
    } else {
      // (3) still attended: fold the elapsed span in.
      s = accrue(s, s.lastEventT, t);
    }
  }

  // (4) the event's own edge.
  switch (ev.kind) {
    case 'visible':
      s = { ...s, visible: true };
      break;
    case 'hidden':
      s = close(s, t, 'hidden');
      s = { ...s, visible: false };
      break;
    case 'focus':
      s = { ...s, focused: true };
      break;
    case 'blur':
      // Excluded ALWAYS (the human's rule) — even devtools-driving fires blur; __qa use taints
      // the run anyway, and the closer histogram makes heavy blur-flapping visible (plan §6.2).
      s = close(s, t, 'blur');
      s = { ...s, focused: false };
      break;
    case 'input':
    case 'intent': {
      if (!s.open && s.visible && s.focused) {
        // Re-engagement (§2.2, the flagged weakest rule): a note fired while unattended and the
        // human reacted within the window ⇒ they were watching — reopen back-dated to the note.
        // The gap BEFORE the note stays excluded (no retro-credit of the whole gap).
        const reengage =
          s.lastNoteT !== null &&
          s.config.noteReengageWindowMs > 0 &&
          t - s.lastNoteT <= s.config.noteReengageWindowMs;
        const start = reengage && s.lastNoteT !== null ? s.lastNoteT : t;
        s = { ...s, open: { start, activeMs: 0, idleMs: 0, autosArmedMs: 0 }, lastNoteT: null };
        // The back-dated note→input span accrues as idle (they watched, they didn't act).
        s = accrue(s, start, t);
      }
      s = { ...s, lastInputT: t };
      break;
    }
    case 'auto':
      s = { ...s, autosArmed: ev.armed };
      break;
    case 'note':
      // Only meaningful while unattended-visible — that's the only state a note can rescue.
      if (!s.open && s.visible && s.focused) s = { ...s, lastNoteT: t };
      break;
    case 'heartbeat':
      break; // its work (steps 1–3) is done by arriving at all
    case 'flush':
      s = close(s, t, 'flush');
      break;
  }

  return { ...s, lastEventT: t };
}

/** Close out at `t` (unload / run change). Idempotent when nothing is open. */
export function finalize(state: SessionizerState, t: number): SessionizerState {
  return advance(state, { t, kind: 'flush' });
}

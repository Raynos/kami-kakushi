// The ActionClock (ADR-148 Phase 2) — the SHELL's wall-clock for timed actions.
// The pure core never sees time: it holds only the timing DATA (content/timing.ts);
// this clock runs the duration, dispatches the intent's effect at completion, and
// holds the per-action cooldown before the next press. ONE action in flight
// globally (ADR-148 — you are one person); pressing anything timed while busy is
// refused (the UI shows why by disabling).
//
// Interruption drops (ADR-148): a reset / import / tab-hide cancels the in-flight
// action outright — it simply never happened; no partial credit is ever granted.
// Timers are injected so tests drive the clock deterministically (no fake-timer
// global patching), mirroring the FB-115 expiry-clock pattern.

export type ClockPhase = 'idle' | 'running' | 'cooldown';

export interface ClockStatus {
  readonly phase: ClockPhase;
  /** 0→1 across the CURRENT phase (fill while running, drain while cooling). */
  readonly fraction: number;
  /** ms remaining in the current phase (0 when idle). */
  readonly remainingMs: number;
  readonly durationMs: number;
  readonly cooldownMs: number;
}

export interface ActionClock {
  /** Start a timed action. Returns false (and does nothing) when another action
   *  is in flight or this key is still cooling — one global action (ADR-148). */
  press(key: string, durationMs: number, cooldownMs: number, onComplete: () => void): boolean;
  /** The per-key phase for button painting (TST4 — the player never guesses). */
  status(key: string): ClockStatus;
  /** True while ANY action is in flight (the global gate). */
  busy(): boolean;
  /** The key of the in-flight action, if any. */
  runningKey(): string | null;
  /** Drop the in-flight action (never dispatches) AND all cooldowns — reset /
   *  import / tab-hide (ADR-148: interruption = the action never happened). */
  cancelAll(): void;
  /** Instant mode (QA/e2e): press dispatches synchronously, no cooldown. */
  setInstant(on: boolean): void;
  /** Stop/resume the clock this module reads (FB-256 — the DEV capture freeze). While frozen,
   *  `status()` is constant; thawing re-arms nothing but notifies, so the UI repaints from the
   *  corrected remainder. In-flight timers are banked separately by the FreezeClock. */
  setFrozen(on: boolean): void;
  frozen(): boolean;
  /** Subscribe to phase changes (start / complete / cooldown-end / cancel).
   *  Returns the unsubscribe. The UI repaints button states from this. */
  onChange(cb: () => void): () => void;
}

interface ClockDeps {
  readonly now?: () => number;
  readonly setTimer?: (fn: () => void, ms: number) => number;
  readonly clearTimer?: (id: number) => void;
}

export function createActionClock(deps: ClockDeps = {}): ActionClock {
  const wallNow = deps.now ?? (() => Date.now());
  const setTimer = deps.setTimer ?? ((fn, ms) => window.setTimeout(fn, ms) as unknown as number);
  const clearTimer = deps.clearTimer ?? ((id) => window.clearTimeout(id));

  // FB-256 — the DEV capture freeze stops the shell's TIMERS, but `status()` derives its progress
  // fraction from the wall clock, not from a timer. Left alone, a bar would sit still (nothing
  // repaints) and then JUMP forward on thaw by however long the human spent writing their note,
  // while its completion timer correctly re-armed with the banked remainder. So the clock this
  // module reads must stop too: `frozenAt` holds the reading, `frozenTotal` accumulates the debt.
  let frozenAt: number | null = null;
  let frozenTotal = 0;
  const now = (): number => (frozenAt ?? wallNow()) - frozenTotal;

  let instant = false;
  let inflight: {
    key: string;
    startedAt: number;
    durationMs: number;
    cooldownMs: number;
    timer: number;
  } | null = null;
  // key → { until, startedAt } — cooldowns are per action key (per-action data, ADR-148).
  const cooling = new Map<string, { until: number; cooldownMs: number; timer: number }>();
  const listeners = new Set<() => void>();
  const notify = (): void => {
    for (const cb of listeners) cb();
  };

  function beginCooldown(key: string, cooldownMs: number): void {
    if (cooldownMs <= 0) return;
    const timer = setTimer(() => {
      cooling.delete(key);
      notify(); // cooldown ended — the button re-enables
    }, cooldownMs);
    cooling.set(key, { until: now() + cooldownMs, cooldownMs, timer });
  }

  return {
    press(key, durationMs, cooldownMs, onComplete): boolean {
      if (instant) {
        onComplete(); // QA/e2e — synchronous, no cooldown, no busy window
        return true;
      }
      if (inflight !== null) return false; // one global action (ADR-148)
      if (cooling.has(key)) return false; // this action is still cooling
      const timer = setTimer(() => {
        inflight = null;
        beginCooldown(key, cooldownMs);
        onComplete(); // the effect lands exactly once, at completion
        notify();
      }, durationMs);
      inflight = { key, startedAt: now(), durationMs, cooldownMs, timer };
      notify(); // started — the row disables, the bar begins
      return true;
    },
    status(key): ClockStatus {
      if (inflight?.key === key) {
        const elapsed = now() - inflight.startedAt;
        const remainingMs = Math.max(0, inflight.durationMs - elapsed);
        return {
          phase: 'running',
          fraction: inflight.durationMs <= 0 ? 1 : Math.min(1, elapsed / inflight.durationMs),
          remainingMs,
          durationMs: inflight.durationMs,
          cooldownMs: inflight.cooldownMs,
        };
      }
      const cd = cooling.get(key);
      if (cd) {
        const remainingMs = Math.max(0, cd.until - now());
        return {
          phase: 'cooldown',
          fraction: cd.cooldownMs <= 0 ? 0 : remainingMs / cd.cooldownMs,
          remainingMs,
          durationMs: 0,
          cooldownMs: cd.cooldownMs,
        };
      }
      return { phase: 'idle', fraction: 0, remainingMs: 0, durationMs: 0, cooldownMs: 0 };
    },
    busy: () => inflight !== null,
    runningKey: () => inflight?.key ?? null,
    cancelAll(): void {
      if (inflight) {
        clearTimer(inflight.timer);
        inflight = null; // dropped — never dispatches (ADR-148)
      }
      for (const cd of cooling.values()) clearTimer(cd.timer);
      cooling.clear();
      notify();
    },
    setInstant(on: boolean): void {
      instant = on;
      if (on) this.cancelAll();
    },
    setFrozen(on: boolean): void {
      if (on) {
        if (frozenAt === null) frozenAt = wallNow();
        // Deliberately NO notify: a repaint here would re-arm the progress bar's CSS transition
        // (paintActBar always restarts it), and the freeze is about to pin that transition.
        return;
      }
      if (frozenAt === null) return;
      frozenTotal += wallNow() - frozenAt;
      frozenAt = null;
      // Thaw DOES notify — the renderer repaints every bar from the corrected clock, which restarts
      // each transition with its true remaining time. That is what un-pins them.
      notify();
    },
    frozen: () => frozenAt !== null,
    onChange(cb): () => void {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}

/** The per-press identity a cooldown attaches to: the intent type, refined by the
 *  payload where one button ≠ one type (each activity / edge cools separately). */
export function actionKey(
  type: string,
  payload?: { readonly activityId?: string; readonly to?: string; readonly recipeId?: string },
): string {
  if (payload?.activityId) return `${type}:${payload.activityId}`;
  if (payload?.to) return `${type}:${payload.to}`;
  if (payload?.recipeId) return `${type}:${payload.recipeId}`;
  return type;
}

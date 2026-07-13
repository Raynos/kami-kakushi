// The freeze WATCHDOG (DEV-only) — the backstop that makes a stranded shell freeze impossible.
//
// The playtest capture overlay (`` ` ``) freezes the entire shell: the FreezeClock banks every
// window timer (src/app/freeze-clock.ts) and the ActionClock's wall clock stops. That is the whole
// point — the screen must hold still from the pick to the send. But it means a freeze that is never
// thawed is CATASTROPHIC and SILENT: the auto-step heartbeat never fires, no timed action ever
// completes, and nothing on screen says why. The game looks alive (instant intents still dispatch
// and re-render, so buttons still toggle) while every clock in it is stopped — and only an F5
// clears it, because `frozen` is shell state that no save carries.
//
// The overlay thaws on every exit it knows about, and `onPickDown` now thaws on a throw. This is the
// rung above that: rather than trust every path, ASK — if the shell is frozen and the overlay does
// not own that freeze (no pick in progress, no note box open), the freeze is stranded. Thaw it and
// say so.
//
// The poll MUST run on the RAW timers. The patched ones are exactly what a freeze banks, so a
// watchdog scheduled through them would freeze along with the world it is meant to rescue — the one
// mistake that would make this whole module a no-op.

/** How often to ask. A freeze is only ever legitimate while the human is picking/typing a note, so
 *  a stranded one is caught within a second — long before it reads as "the game is broken". */
export const FREEZE_WATCHDOG_MS = 1000;

export interface FreezeWatchdogDeps {
  /** Is the shell's clock frozen right now? */
  readonly frozen: () => boolean;
  /** Does the capture overlay own that freeze (a pick or a note box is open)? */
  readonly captureActive: () => boolean;
  /** Give the world back (thaws BOTH clocks — the shell timers and the ActionClock). */
  readonly thaw: () => void;
  /** Shout: a stranded freeze is a bug in the overlay, not a state to live with. */
  readonly warn: (msg: string) => void;
  /** The RAW (unpatched) setTimeout — see the module note. */
  readonly setTimer: (fn: () => void, ms: number) => number;
  readonly clearTimer: (id: number) => void;
}

/** One check. Exported for the test: the whole judgment lives here, and it can go RED. */
export function checkFreeze(deps: FreezeWatchdogDeps): boolean {
  if (!deps.frozen()) return false;
  if (deps.captureActive()) return false; // a human is picking or writing — the freeze is earned
  deps.warn(
    '[kami-kakushi] thawed a STRANDED shell freeze — the world was frozen with no capture ' +
      'overlay open (every auto and timed action was silently dead). This is a capture-overlay bug.',
  );
  deps.thaw();
  return true;
}

/** Start polling. Returns the stop fn. */
export function startFreezeWatchdog(
  deps: FreezeWatchdogDeps,
  everyMs: number = FREEZE_WATCHDOG_MS,
): () => void {
  let timer = deps.setTimer(function tick(): void {
    checkFreeze(deps);
    timer = deps.setTimer(tick, everyMs);
  }, everyMs);
  return () => deps.clearTimer(timer);
}

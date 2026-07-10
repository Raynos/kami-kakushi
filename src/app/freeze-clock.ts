// The FreezeClock (FB-215) — a DEV-only wall-clock freeze for the whole shell.
//
// The playtest capture overlay needs the screen to hold absolutely still from the moment `` ` `` is
// pressed until the note is sent: no auto-play, no typewriter, no VN scroll, no rank-up fly-by. Only
// then can the human point at a thing and say "THAT", and only then are the pixels at submit the
// same pixels they picked (which is what lets the ~600ms rasterisation move off the interaction).
//
// Everything the shell animates or advances with is a `window.setTimeout` / `setInterval`: the
// renderer's typewriters and reveal cascades (17 call sites), the ActionClock's duration/cooldown
// timers, the auto-step heartbeat, the autosave interval. So rather than retrofit a `frozen` check
// into every one of them — a change that could never stay exhaustive — we freeze the ONE thing they
// all go through: the window's timer functions.
//
// `freeze()` cancels every pending timer and banks its REMAINING time; `thaw()` re-arms each with
// exactly that remainder, so a 2s auto-advance that had 1.4s left still has 1.4s left. An interval
// resumes on its own phase (remainder first, then its period). Timers scheduled WHILE frozen are
// banked at full delay and armed on thaw, so a callback that schedules the next step (the per-char
// typewriter) simply stops mid-word and resumes mid-word.
//
// CSS motion is not a timer, so it freezes separately: `<html class="frozen">` sets
// `animation-play-state: paused` on everything (styles.css). Running TRANSITIONS are deliberately
// left alone — they're all sub-400ms and would snap to their end value if we cut them.
//
// DEV-ONLY: installed from main.ts's `import.meta.env.DEV` branch, alongside the capture overlay it
// exists to serve. Monkey-patching the global clock is a heavy hammer, and it is confined to a dev
// build and to the seconds a feedback box is open.
//
// The overlay's OWN chrome must keep ticking while the game is frozen (its toast, its click-swallow
// guard, its after-paint hook) — so `raw` hands back the untouched natives.

/** The subset of `window` the clock patches. Injected so the whole thing is testable in jsdom. */
export interface TimerHost {
  setTimeout(fn: (...a: never[]) => void, ms?: number, ...args: never[]): number;
  clearTimeout(id?: number): void;
  setInterval(fn: (...a: never[]) => void, ms?: number, ...args: never[]): number;
  clearInterval(id?: number): void;
}

/** The untouched timer functions, for code that must run WHILE the game is frozen. */
export interface RawTimers {
  setTimeout(fn: () => void, ms: number): number;
  clearTimeout(id: number): void;
}

export interface FreezeClock {
  /** Hold the world still. Idempotent — a second freeze() while frozen is a no-op. */
  freeze(): void;
  /** Resume, re-arming every banked timer with the time it had left. Idempotent. */
  thaw(): void;
  frozen(): boolean;
  /** The natives, unpatched — the freezer's own machinery must not freeze itself. */
  readonly raw: RawTimers;
  /** Restore the host's original timer functions (thaws first). */
  uninstall(): void;
}

/** A timer we own: `period` is set for intervals (they re-arm forever), absent for timeouts. */
interface Pending {
  readonly fn: (...a: never[]) => void;
  readonly args: never[];
  readonly period?: number;
  /** native id while armed; undefined while frozen (we cancelled it) */
  native?: number;
  /** epoch ms at which it should next fire; only meaningful while armed */
  dueAt: number;
  /** ms left when frozen; only meaningful while frozen */
  remaining: number;
}

export interface FreezeClockDeps {
  /** Wall clock, injectable for deterministic tests. */
  readonly now?: () => number;
  /** The document whose root element carries the `.frozen` class; omit to skip the CSS half. */
  readonly doc?: Document;
}

/**
 * Patch `host`'s timer functions with freezable equivalents. Returns the control surface; call
 * `uninstall()` to put the natives back.
 *
 * Ids handed out are our OWN (a counter), so `clearTimeout(id)` still works across a freeze/thaw
 * that re-armed the timer under a different native id. An id we don't recognise (a timer armed
 * before install, or one of vite's) is passed straight through to the native clear.
 */
export function installFreezeClock(host: TimerHost, deps: FreezeClockDeps = {}): FreezeClock {
  const now = deps.now ?? (() => Date.now());
  const nativeSetTimeout = host.setTimeout.bind(host);
  const nativeClearTimeout = host.clearTimeout.bind(host);
  const nativeSetInterval = host.setInterval.bind(host);
  const nativeClearInterval = host.clearInterval.bind(host);

  const pending = new Map<number, Pending>();
  let nextId = 1;
  let isFrozen = false;

  /** Arm `p` for `ms` from now, wiring the native callback that fires it. */
  function arm(id: number, p: Pending, ms: number): void {
    p.dueAt = now() + ms;
    if (p.period === undefined) {
      p.native = nativeSetTimeout(() => {
        pending.delete(id); // a timeout is spent the moment it fires
        p.fn(...p.args);
      }, ms);
      return;
    }
    // An interval resumes on its own phase: wait out the remainder, fire, THEN re-establish the
    // periodic native timer. (A plain setInterval(period) here would skew the cadence on every thaw.)
    const period = p.period;
    p.native = nativeSetTimeout(() => {
      p.fn(...p.args);
      if (!pending.has(id)) return; // cleared from inside its own callback
      p.dueAt = now() + period;
      p.native = nativeSetInterval(() => {
        p.dueAt = now() + period;
        p.fn(...p.args);
      }, period);
    }, ms);
  }

  /** Cancel `p`'s native timer, whichever kind it currently is. */
  function disarm(p: Pending): void {
    if (p.native === undefined) return;
    // While frozen→thawed an interval spends a phase as a native TIMEOUT, so we can't key the clear
    // off `period` alone. Clearing with both is safe: ids are per-kind and a miss is a no-op.
    nativeClearTimeout(p.native);
    nativeClearInterval(p.native);
    delete p.native; // `exactOptionalPropertyTypes`: absent, not `undefined`
  }

  function schedule(
    fn: (...a: never[]) => void,
    ms: number | undefined,
    args: never[],
    period: number | undefined,
  ): number {
    const id = nextId++;
    const delay = Math.max(0, ms ?? 0);
    const p: Pending = {
      fn,
      args,
      dueAt: 0,
      remaining: delay,
      ...(period !== undefined && { period }),
    };
    pending.set(id, p);
    if (isFrozen) return id; // banked at full delay; armed on thaw
    arm(id, p, delay);
    return id;
  }

  function cancel(id: number | undefined, nativeClear: (n?: number) => void): void {
    if (id === undefined) return;
    const p = pending.get(id);
    if (!p) {
      nativeClear(id); // not ours (armed before install, or vite's) — let the native handle it
      return;
    }
    disarm(p);
    pending.delete(id);
  }

  host.setTimeout = (fn, ms, ...args) => schedule(fn, ms, args, undefined);
  host.setInterval = (fn, ms, ...args) => schedule(fn, ms, args, Math.max(0, ms ?? 0));
  host.clearTimeout = (id) => cancel(id, nativeClearTimeout);
  host.clearInterval = (id) => cancel(id, nativeClearInterval);

  const clock: FreezeClock = {
    frozen: () => isFrozen,
    raw: { setTimeout: nativeSetTimeout, clearTimeout: nativeClearTimeout },
    freeze(): void {
      if (isFrozen) return;
      isFrozen = true;
      const t = now();
      for (const p of pending.values()) {
        p.remaining = Math.max(0, p.dueAt - t);
        disarm(p);
      }
      deps.doc?.documentElement.classList.add('frozen');
    },
    thaw(): void {
      if (!isFrozen) return;
      isFrozen = false;
      for (const [id, p] of pending) arm(id, p, p.remaining);
      deps.doc?.documentElement.classList.remove('frozen');
    },
    uninstall(): void {
      clock.thaw();
      host.setTimeout = nativeSetTimeout as TimerHost['setTimeout'];
      host.clearTimeout = nativeClearTimeout;
      host.setInterval = nativeSetInterval as TimerHost['setInterval'];
      host.clearInterval = nativeClearInterval;
    },
  };
  return clock;
}

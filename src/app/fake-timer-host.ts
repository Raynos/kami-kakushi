// A deterministic TimerHost for the shell-clock tests (freeze-clock, freeze-watchdog). The freeze
// clock's `now` and its natives share ONE virtual clock, so every assertion is about freeze
// semantics, never about real wall-time flake. Test-only: nothing in the app imports it, so it
// tree-shakes out of the bundle.

import type { TimerHost } from './freeze-clock';

export interface FakeTimerHost {
  readonly host: TimerHost;
  /** Run the virtual clock forward, firing whatever falls due (in due order). */
  readonly tick: (ms: number) => void;
  readonly now: () => number;
}

export function makeFakeTimerHost(): FakeTimerHost {
  let t = 0;
  let seq = 1;
  interface Entry {
    fn: (...a: never[]) => void;
    args: never[];
    at: number;
    period?: number;
  }
  const timers = new Map<number, Entry>();
  const host: TimerHost = {
    setTimeout(fn, ms = 0, ...args) {
      const id = seq++;
      timers.set(id, { fn, args, at: t + ms });
      return id;
    },
    clearTimeout(id) {
      if (id !== undefined) timers.delete(id);
    },
    setInterval(fn, ms = 0, ...args) {
      const id = seq++;
      timers.set(id, { fn, args, at: t + ms, period: Math.max(1, ms) });
      return id;
    },
    clearInterval(id) {
      if (id !== undefined) timers.delete(id);
    },
  };
  function tick(ms: number): void {
    const end = t + ms;
    for (;;) {
      let pickId: number | undefined;
      let pick: Entry | undefined;
      for (const [id, e] of timers) {
        if (e.at <= end && (pick === undefined || e.at < pick.at)) {
          pick = e;
          pickId = id;
        }
      }
      if (pick === undefined || pickId === undefined) break;
      t = pick.at;
      if (pick.period !== undefined) pick.at = t + pick.period;
      else timers.delete(pickId);
      pick.fn(...pick.args);
    }
    t = end;
  }
  return { host, tick, now: () => t };
}

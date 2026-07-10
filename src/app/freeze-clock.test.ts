// @vitest-environment jsdom
//
// The freeze semantics are pure (a virtual timer host below), but the `.frozen` class case needs a
// real `documentElement` — that half is what pauses CSS animation while the timers are banked.

import { describe, it, expect, vi } from 'vitest';
import { installFreezeClock, type TimerHost } from './freeze-clock';

/** A deterministic timer host — the freeze clock's `now` and its natives share one virtual clock,
 *  so every assertion below is about the freeze semantics, never about real wall-time flake. */
function makeFake(): { host: TimerHost; tick: (ms: number) => void; now: () => number } {
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

describe('installFreezeClock', () => {
  it('holds a pending timeout until thaw, then honours the time it had LEFT', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const fired = vi.fn();

    fake.host.setTimeout(fired, 100);
    fake.tick(60); // 40ms left on the clock
    expect(fired).not.toHaveBeenCalled();

    clock.freeze();
    fake.tick(10_000); // the world moves on; the frozen timer must not
    expect(fired).not.toHaveBeenCalled();

    clock.thaw();
    fake.tick(39);
    expect(fired).not.toHaveBeenCalled(); // 40ms remained, not a fresh 0
    fake.tick(1);
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('banks a timer scheduled WHILE frozen and arms it on thaw', () => {
    // The per-char typewriter schedules its next step from inside the previous one. If a callback
    // slips through during a freeze, the line keeps typing under the feedback box.
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const fired = vi.fn();

    clock.freeze();
    fake.host.setTimeout(fired, 32);
    fake.tick(10_000);
    expect(fired).not.toHaveBeenCalled();

    clock.thaw();
    fake.tick(31);
    expect(fired).not.toHaveBeenCalled();
    fake.tick(1);
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('resumes an interval on its own phase rather than skewing it', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const beat = vi.fn();

    fake.host.setInterval(beat, 100);
    fake.tick(250); // fired at 100, 200
    expect(beat).toHaveBeenCalledTimes(2);

    clock.freeze(); // 50ms remained on the third beat
    fake.tick(10_000);
    expect(beat).toHaveBeenCalledTimes(2);

    clock.thaw();
    fake.tick(49);
    expect(beat).toHaveBeenCalledTimes(2);
    fake.tick(1);
    expect(beat).toHaveBeenCalledTimes(3); // the banked remainder, not a fresh 100
    fake.tick(100);
    expect(beat).toHaveBeenCalledTimes(4); // and the period re-establishes
    fake.tick(100);
    expect(beat).toHaveBeenCalledTimes(5);
  });

  it('clears a frozen timer by the id the caller was handed', () => {
    // Our ids outlive the native ones (thaw re-arms under a new native id), so a stale
    // clearTimeout(id) from render.ts must still cancel the right timer.
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const fired = vi.fn();

    const id = fake.host.setTimeout(fired, 100);
    clock.freeze();
    fake.host.clearTimeout(id);
    clock.thaw();
    fake.tick(10_000);
    expect(fired).not.toHaveBeenCalled();
  });

  it('clears a re-armed interval after a freeze/thaw cycle', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const beat = vi.fn();

    const id = fake.host.setInterval(beat, 100);
    fake.tick(150);
    clock.freeze();
    clock.thaw();
    fake.tick(200); // the interval is alive again (fires at the 50ms remainder, then +100)
    expect(beat).toHaveBeenCalledTimes(3);

    fake.host.clearInterval(id);
    fake.tick(1000);
    expect(beat).toHaveBeenCalledTimes(3);
  });

  it('passes a foreign id straight through to the native clear', () => {
    // vite's HMR timers (and anything armed before install) are not in our map.
    const fake = makeFake();
    const fired = vi.fn();
    const foreign = fake.host.setTimeout(fired, 50); // armed BEFORE install
    const clock = installFreezeClock(fake.host, { now: fake.now });

    fake.host.clearTimeout(foreign);
    fake.tick(1000);
    expect(fired).not.toHaveBeenCalled();
    clock.uninstall();
  });

  it('leaves the raw timers unfrozen, so the overlay can tick while the game cannot', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const game = vi.fn();
    const overlay = vi.fn();

    clock.freeze();
    fake.host.setTimeout(game, 50);
    clock.raw.setTimeout(overlay, 50);
    fake.tick(100);

    expect(game).not.toHaveBeenCalled();
    expect(overlay).toHaveBeenCalledTimes(1);
  });

  it('toggles the `frozen` class so CSS animation pauses with the timers', () => {
    const fake = makeFake();
    const doc = document;
    const clock = installFreezeClock(fake.host, { now: fake.now, doc });

    expect(doc.documentElement.classList.contains('frozen')).toBe(false);
    clock.freeze();
    expect(doc.documentElement.classList.contains('frozen')).toBe(true);
    expect(clock.frozen()).toBe(true);
    clock.thaw();
    expect(doc.documentElement.classList.contains('frozen')).toBe(false);
    clock.uninstall();
  });

  it('is idempotent — a second freeze does not re-bank a shortened remainder', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const fired = vi.fn();

    fake.host.setTimeout(fired, 100);
    fake.tick(60);
    clock.freeze();
    fake.tick(500);
    clock.freeze(); // must NOT recompute remaining from the (long past) dueAt
    clock.thaw();
    fake.tick(39);
    expect(fired).not.toHaveBeenCalled();
    fake.tick(1);
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('uninstall restores the natives and thaws what it banked', () => {
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now });
    const fired = vi.fn();

    fake.host.setTimeout(fired, 100);
    clock.freeze();
    clock.uninstall();
    fake.tick(100);
    expect(fired).toHaveBeenCalledTimes(1);
    expect(clock.frozen()).toBe(false);
  });
});

// FB-256 — `.frozen` pauses keyframe animations, but a CSS TRANSITION has no play-state. The action
// button's progress bar is an inline `transition: width <remaining>ms linear`, so it kept sliding
// under the feedback box. `transition: none` alone would snap it to 100%; we pin the live value first.
describe('installFreezeClock — running CSS transitions are pinned, not snapped', () => {
  function bar(): HTMLElement {
    const el = document.createElement('div');
    el.style.width = '100%'; // the transition TARGET, as paintActBar leaves it
    el.style.transition = 'width 5000ms linear';
    document.body.appendChild(el);
    return el;
  }

  it('cuts the transition only after writing back the CURRENT computed value', () => {
    // The bug this guards: cutting the transition first makes the element snap to its TARGET, so a
    // half-full progress bar slams to 100% the instant the capture box opens. jsdom resolves an
    // inline `100%` to itself, which would make the two orderings indistinguishable — so stub
    // getComputedStyle to report a genuinely mid-flight value.
    const el = bar();
    const real = window.getComputedStyle;
    window.getComputedStyle = ((node: Element) =>
      node === el
        ? ({
            width: '43.2px', // mid-transition
            transitionProperty: 'width',
            getPropertyValue: (n: string) => (n === 'width' ? '43.2px' : ''),
          } as unknown as CSSStyleDeclaration)
        : real.call(window, node)) as typeof window.getComputedStyle;

    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now, doc: document });
    try {
      clock.freeze();
      expect(el.style.transition).toBe('none'); // it can no longer move…
      expect(el.style.width).toBe('43.2px'); // …pinned where it STOOD, not at the 100% target

      clock.thaw();
      expect(el.style.transition).toBe('width 5000ms linear'); // original inline transition restored
      expect(el.style.width).toBe('100%'); // target back, for the repaint to correct
    } finally {
      window.getComputedStyle = real;
      clock.uninstall();
      el.remove();
    }
  });

  it('leaves elements with no inline transition alone', () => {
    const plain = document.createElement('div');
    plain.style.width = '50%';
    document.body.appendChild(plain);
    const fake = makeFake();
    const clock = installFreezeClock(fake.host, { now: fake.now, doc: document });

    clock.freeze();
    expect(plain.style.transition).toBe('');
    clock.thaw();
    clock.uninstall();
    plain.remove();
  });
});

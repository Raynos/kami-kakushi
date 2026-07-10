// ActionClock (ADR-148 Phase 2) — deterministic tests via injected timers.
// The levers under test: one-global-inflight, effect-exactly-once-at-completion,
// per-key cooldown, cancel-drops-without-dispatch, instant mode.
import { describe, expect, it } from 'vitest';
import { actionKey, createActionClock } from './action-clock';

/** A hand-cranked timer harness: fire() advances the queue like wall time would. */
function harness(): {
  deps: {
    now: () => number;
    setTimer: (fn: () => void, ms: number) => number;
    clearTimer: (id: number) => void;
  };
  advance: (ms: number) => void;
} {
  let t = 0;
  let nextId = 1;
  const timers = new Map<number, { at: number; fn: () => void }>();
  return {
    deps: {
      now: () => t,
      setTimer: (fn, ms) => {
        const id = nextId++;
        timers.set(id, { at: t + ms, fn });
        return id;
      },
      clearTimer: (id) => void timers.delete(id),
    },
    advance: (ms) => {
      const target = t + ms;
      // fire due timers in time order (a fired timer may schedule another)
      for (;;) {
        const due = [...timers.entries()]
          .filter(([, x]) => x.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        timers.delete(due[0]);
        t = due[1].at;
        due[1].fn();
      }
      t = target;
    },
  };
}

describe('ActionClock (ADR-148)', () => {
  it('runs the duration, dispatches exactly once at completion, then cools down', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    let fired = 0;
    expect(clock.press('rake', 5000, 2000, () => fired++)).toBe(true);
    expect(clock.status('rake').phase).toBe('running');
    expect(fired).toBe(0); // nothing lands early
    h.advance(4999);
    expect(fired).toBe(0);
    h.advance(1);
    expect(fired).toBe(1); // the effect lands at completion, once
    expect(clock.status('rake').phase).toBe('cooldown');
    h.advance(2000);
    expect(clock.status('rake').phase).toBe('idle'); // pressable again
    expect(clock.press('rake', 5000, 2000, () => fired++)).toBe(true);
  });

  it('refuses a second press while ANY action is in flight (one global)', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    clock.press('rake', 5000, 2000, () => {});
    expect(clock.press('rest', 4000, 2000, () => {})).toBe(false);
    expect(clock.busy()).toBe(true);
    expect(clock.runningKey()).toBe('rake');
  });

  it('cooldown is per key: a cooling action blocks itself, not others', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    clock.press('rake', 5000, 2000, () => {});
    h.advance(5000); // rake completes → cooling
    expect(clock.press('rake', 5000, 2000, () => {})).toBe(false); // still cooling
    expect(clock.press('rest', 4000, 2000, () => {})).toBe(true); // others free
  });

  it('cancelAll drops the in-flight action WITHOUT dispatching (interruption = never happened)', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    let fired = 0;
    clock.press('rake', 5000, 2000, () => fired++);
    h.advance(4000);
    clock.cancelAll();
    h.advance(10_000);
    expect(fired).toBe(0); // no partial credit, no late dispatch (ADR-148)
    expect(clock.status('rake').phase).toBe('idle');
  });

  it('instant mode dispatches synchronously with no busy window and no cooldown', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    clock.setInstant(true);
    let fired = 0;
    expect(clock.press('rake', 5000, 2000, () => fired++)).toBe(true);
    expect(fired).toBe(1);
    expect(clock.busy()).toBe(false);
    expect(clock.status('rake').phase).toBe('idle');
  });

  it('notifies on start, completion, cooldown-end, and cancel', () => {
    const h = harness();
    const clock = createActionClock(h.deps);
    let ticks = 0;
    clock.onChange(() => ticks++);
    clock.press('rake', 5000, 2000, () => {});
    expect(ticks).toBe(1); // start
    h.advance(5000);
    expect(ticks).toBe(2); // completion (cooldown begins)
    h.advance(2000);
    expect(ticks).toBe(3); // cooldown end
    clock.cancelAll();
    expect(ticks).toBe(4); // cancel
  });

  it('actionKey refines per payload so cooldowns attach to the right button', () => {
    expect(actionKey('rake_rice')).toBe('rake_rice');
    expect(actionKey('do_activity', { activityId: 'farm_paddy' })).toBe('do_activity:farm_paddy');
    expect(actionKey('move_to', { to: 'kura' })).toBe('move_to:kura');
    expect(actionKey('craft_weapon', { recipeId: 'ono' })).toBe('craft_weapon:ono');
  });
});

// FB-256 — the DEV capture freeze stops the shell's timers, but `status()` reads the WALL clock.
// Without freezing that too, a progress bar jumps forward on thaw by however long the human spent
// writing their capture note. RED-able: delete `frozenTotal += …` and the remainder is wrong.
describe('setFrozen — the clock stops while a capture note is open', () => {
  function harness() {
    let t = 1000;
    const timers = new Map<number, { fn: () => void; at: number }>();
    let seq = 1;
    const clock = createActionClock({
      now: () => t,
      setTimer: (fn, ms) => {
        const id = seq++;
        timers.set(id, { fn, at: t + ms });
        return id;
      },
      clearTimer: (id) => void timers.delete(id),
    });
    return { clock, advance: (ms: number) => (t += ms) };
  }

  it('holds `status()` still while frozen, and does not lose the remainder on thaw', () => {
    const { clock, advance } = harness();
    clock.press('rake', 1000, 0, () => {});
    advance(400);
    expect(clock.status('rake').fraction).toBeCloseTo(0.4, 5);

    clock.setFrozen(true);
    expect(clock.frozen()).toBe(true);
    advance(30_000); // the human writes a long note
    const frozen = clock.status('rake');
    expect(frozen.fraction).toBeCloseTo(0.4, 5); // the bar does not creep…
    expect(frozen.remainingMs).toBe(600);

    clock.setFrozen(false);
    expect(clock.frozen()).toBe(false);
    const thawed = clock.status('rake');
    expect(thawed.fraction).toBeCloseTo(0.4, 5); // …and it does not JUMP on thaw
    expect(thawed.remainingMs).toBe(600);

    advance(600);
    expect(clock.status('rake').fraction).toBe(1);
  });

  it('notifies on thaw (so the UI repaints from the corrected clock) but never on freeze', () => {
    // A repaint while frozen would re-arm the very CSS transition the freeze just pinned.
    const { clock } = harness();
    let notifications = 0;
    clock.onChange(() => notifications++);
    clock.press('rake', 1000, 0, () => {});
    notifications = 0;

    clock.setFrozen(true);
    expect(notifications).toBe(0);
    clock.setFrozen(false);
    expect(notifications).toBe(1);
  });

  it('survives a freeze/thaw with no action in flight', () => {
    const { clock, advance } = harness();
    clock.setFrozen(true);
    advance(5000);
    clock.setFrozen(false);
    expect(clock.status('rake').phase).toBe('idle');
    expect(clock.busy()).toBe(false);
  });
});

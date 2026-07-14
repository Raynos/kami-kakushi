// The freeze watchdog — the backstop against a STRANDED shell freeze (the capture overlay froze
// the world and never thawed it: every timer banked, every auto silently dead, only an F5 clears
// it). Each test drives the one judgment that matters and could have gone RED: delete the thaw in
// checkFreeze and "thaws a stranded freeze" fails; delete the captureActive guard and "leaves a
// freeze the overlay OWNS alone" fails; schedule the poll on the patched timers instead of the raw
// ones and "polls on RAW timers" fails.
import { describe, expect, it, vi } from 'vitest';
import {
  checkFreeze,
  startFreezeWatchdog,
  type FreezeWatchdogDeps,
} from './freeze-watchdog';
import { installFreezeClock } from './freeze-clock';
import { makeFakeTimerHost } from './fake-timer-host';

function deps(over: Partial<FreezeWatchdogDeps> = {}): FreezeWatchdogDeps & {
  thawed: () => number;
  warnings: () => string[];
} {
  let thaws = 0;
  const warnings: string[] = [];
  const base: FreezeWatchdogDeps = {
    frozen: () => true,
    captureActive: () => false,
    thaw: () => void thaws++,
    warn: (m) => void warnings.push(m),
    setTimer: (fn, ms) => setTimeout(fn, ms) as unknown as number,
    clearTimer: (id) => clearTimeout(id),
    ...over,
  };
  return { ...base, thawed: () => thaws, warnings: () => warnings };
}

describe('freeze watchdog — checkFreeze', () => {
  it('thaws a STRANDED freeze (frozen, but no capture overlay owns it)', () => {
    const d = deps({ frozen: () => true, captureActive: () => false });
    expect(checkFreeze(d)).toBe(true);
    expect(d.thawed()).toBe(1);
    expect(d.warnings()[0]).toMatch(/STRANDED/);
  });

  it('leaves a freeze the overlay OWNS alone — a human is picking or writing a note', () => {
    const d = deps({ frozen: () => true, captureActive: () => true });
    expect(checkFreeze(d)).toBe(false);
    expect(d.thawed()).toBe(0);
    expect(d.warnings()).toEqual([]);
  });

  it('does nothing to a thawed shell', () => {
    const d = deps({ frozen: () => false, captureActive: () => false });
    expect(checkFreeze(d)).toBe(false);
    expect(d.thawed()).toBe(0);
  });
});

describe('freeze watchdog — the poll', () => {
  it('keeps checking, so a strand that appears LATER is still caught', () => {
    vi.useFakeTimers();
    let frozen = false;
    const d = deps({ frozen: () => frozen, captureActive: () => false });
    const stop = startFreezeWatchdog(d, 1000);
    vi.advanceTimersByTime(3000);
    expect(d.thawed()).toBe(0); // nothing frozen yet — never cries wolf
    frozen = true; // …the overlay throws between freeze() and the box opening
    vi.advanceTimersByTime(1000);
    expect(d.thawed()).toBe(1);
    stop();
    vi.useRealTimers();
  });

  // The end-to-end case, against the REAL FreezeClock: the overlay freezes the shell and then dies
  // without thawing (a throw between `freeze()` and the box opening). Wired on `raw`, the watchdog
  // still ticks and takes the world back. Wire it on the PATCHED host instead — the mistake that
  // would make this module a decorative no-op — and the freeze banks the watchdog's own tick: it
  // never fires, `thawed` stays 0, and this goes RED. That is the whole point of the module.
  it('rescues a real stranded FreezeClock — the patched clock would have banked its own tick', () => {
    const fake = makeFakeTimerHost();
    const shell = installFreezeClock(fake.host, { now: fake.now });
    let thaws = 0;
    const d: FreezeWatchdogDeps = {
      frozen: () => shell.frozen(),
      captureActive: () => false, // no pick, no box — nobody owns this freeze
      thaw: () => {
        thaws++;
        shell.thaw();
      },
      warn: () => {},
      setTimer: (fn, ms) => shell.raw.setTimeout(fn, ms), // RAW — as main.ts wires it
      clearTimer: (id) => shell.raw.clearTimeout(id),
    };
    startFreezeWatchdog(d, 1000);

    const gameTimer = vi.fn(); // stands in for the auto-step heartbeat / an action's completion
    fake.host.setTimeout(gameTimer, 500);
    shell.freeze(); // …and the overlay never thaws
    fake.tick(400);
    expect(gameTimer).not.toHaveBeenCalled(); // banked: the game is dead in the water

    fake.tick(1000); // the watchdog's next tick — on raw timers, so the freeze did NOT bank it
    expect(thaws).toBe(1);
    expect(shell.frozen()).toBe(false);

    fake.tick(600); // the banked game timer was re-armed with the time it had left, and lands
    expect(gameTimer).toHaveBeenCalledTimes(1);
  });
});

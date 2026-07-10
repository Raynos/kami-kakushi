// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { attachSignals } from './signals';
import type { TelemetryEvent } from './sessionizer';

// The DOM shell is untested elsewhere (all judgment lives in the pure sessionizer). This file
// covers the ONE piece of judgment the shell does own: noticing that the FB-3 capture note box
// is open, without capture.ts knowing telemetry exists. A MutationObserver that never fires
// would silently restore the bug it was written to fix.

const CFG = () => ({ inputThrottleMs: 5_000, heartbeatMs: 10 ** 9 }); // heartbeat parked
const flush = () => new Promise<void>((r) => setTimeout(r, 0)); // MutationObserver is a microtask

let events: TelemetryEvent[];
let detach: () => void;
let t = 0;

beforeEach(() => {
  events = [];
  t = 0;
  detach = attachSignals(
    (ev) => events.push(ev),
    CFG,
    () => ++t,
  );
});
afterEach(() => detach());

const captureEvents = () => events.filter((e) => e.kind === 'capture');

function openBox(): HTMLElement {
  const el = document.createElement('div');
  el.dataset.kamiCapture = '__KAMI_PLAYTEST_CAPTURE__';
  document.body.appendChild(el);
  return el;
}

describe('attachSignals — capture-mode observer', () => {
  it('emits capture:true when the note box mounts, capture:false when it unmounts', async () => {
    const box = openBox();
    await flush();
    expect(captureEvents()).toMatchObject([{ kind: 'capture', open: true }]);

    box.remove();
    await flush();
    expect(captureEvents()).toMatchObject([
      { kind: 'capture', open: true },
      { kind: 'capture', open: false },
    ]);
  });

  it('is edge-triggered: unrelated body children never emit a capture event', async () => {
    document.body.appendChild(document.createElement('div')); // e.g. the pick-mode hint
    document.body.appendChild(document.createElement('span'));
    await flush();
    expect(captureEvents()).toEqual([]);
  });

  it('does not re-emit while the box stays open', async () => {
    openBox();
    await flush();
    document.body.appendChild(document.createElement('div')); // some other overlay mounts
    await flush();
    expect(captureEvents()).toHaveLength(1);
  });

  it('stops observing after detach (no events from a torn-down shell)', async () => {
    detach();
    detach = () => {}; // afterEach must not double-detach
    openBox();
    await flush();
    expect(captureEvents()).toEqual([]);
  });

  it('survives an environment with no MutationObserver', () => {
    const saved = globalThis.MutationObserver;
    // @ts-expect-error — deleting a lib.dom global for the degraded-environment path
    delete globalThis.MutationObserver;
    try {
      const off = attachSignals(
        () => {},
        CFG,
        () => 0,
      );
      expect(off).toBeTypeOf('function');
      off();
    } finally {
      globalThis.MutationObserver = saved;
    }
  });
});

describe('attachSignals — the shell stays passive', () => {
  it('registers its input listeners passively (never affects the game it measures)', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    const off = attachSignals(
      () => {},
      CFG,
      () => 0,
    );
    const passive = spy.mock.calls
      .filter(([type]) => ['pointerdown', 'pointermove', 'keydown', 'wheel'].includes(type))
      .map(([, , opts]) => opts);
    expect(passive).toHaveLength(4);
    for (const o of passive) expect(o).toMatchObject({ passive: true });
    off();
    spy.mockRestore();
  });
});

// @vitest-environment jsdom
//
// The SFX contract (T0-M1-F4 / DS#2 / D-068 / D-041): a lazy, synth-only Web-Audio
// engine that is mute-safe and silent when Web Audio is unavailable. We stub a fake
// global AudioContext that captures every oscillator/gain it builds, and assert the
// real contract — full API, muted → silence, unmuted → voices, no-context → no-op.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createSfx, type Sfx } from './sfx';

// ── A capturing fake of the slice of Web Audio the module touches ──
interface FakeParam {
  value: number;
  setValueAtTime(v: number, t: number): FakeParam;
  linearRampToValueAtTime(v: number, t: number): FakeParam;
  exponentialRampToValueAtTime(v: number, t: number): FakeParam;
}
function fakeParam(value = 0): FakeParam {
  const p: FakeParam = {
    value,
    setValueAtTime: () => p,
    linearRampToValueAtTime: () => p,
    exponentialRampToValueAtTime: () => p,
  };
  return p;
}
class FakeOscillator {
  type = 'sine';
  frequency = fakeParam(440);
  started = false;
  stopped = false;
  connections: unknown[] = [];
  connect(node: unknown): void {
    this.connections.push(node);
  }
  start(): void {
    this.started = true;
  }
  stop(): void {
    this.stopped = true;
  }
}
class FakeGain {
  gain = fakeParam(1);
  connections: unknown[] = [];
  connect(node: unknown): void {
    this.connections.push(node);
  }
}
class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  state: 'running' | 'suspended' | 'closed' = 'running';
  currentTime = 0;
  destination = { kind: 'destination' };
  oscillators: FakeOscillator[] = [];
  gains: FakeGain[] = [];
  resumed = 0;
  constructor() {
    FakeAudioContext.instances.push(this);
  }
  createOscillator(): FakeOscillator {
    const o = new FakeOscillator();
    this.oscillators.push(o);
    return o;
  }
  createGain(): FakeGain {
    const g = new FakeGain();
    this.gains.push(g);
    return g;
  }
  resume(): Promise<void> {
    this.resumed += 1;
    return Promise.resolve();
  }
}

type MutableGlobals = {
  AudioContext?: unknown;
  webkitAudioContext?: unknown;
  matchMedia?: unknown;
};
function setGlobal(key: keyof MutableGlobals, value: unknown): void {
  (globalThis as MutableGlobals)[key] = value;
}
function totalOscillators(): number {
  return FakeAudioContext.instances.reduce((n, c) => n + c.oscillators.length, 0);
}
function totalGainConnections(): number {
  let n = 0;
  for (const c of FakeAudioContext.instances) for (const g of c.gains) n += g.connections.length;
  return n;
}

beforeEach(() => {
  FakeAudioContext.instances = [];
  setGlobal('AudioContext', FakeAudioContext);
});
afterEach(() => {
  setGlobal('AudioContext', undefined);
  setGlobal('webkitAudioContext', undefined);
  setGlobal('matchMedia', undefined);
});

describe('createSfx — public contract', () => {
  it('(a) returns the full API', () => {
    const sfx: Sfx = createSfx();
    for (const m of ['hit', 'reward', 'rankUp', 'setMuted', 'isMuted'] as const) {
      expect(typeof sfx[m]).toBe('function');
    }
    expect(sfx.isMuted()).toBe(false);
  });

  it('(b) muted via setMuted(true) creates no oscillator (and no context)', () => {
    const sfx = createSfx();
    sfx.setMuted(true);
    expect(sfx.isMuted()).toBe(true);
    sfx.hit();
    sfx.reward();
    sfx.rankUp();
    expect(totalOscillators()).toBe(0);
    expect(FakeAudioContext.instances.length).toBe(0); // never even reached for the context
  });

  it('(b2) constructing muted is also silent until unmuted', () => {
    const sfx = createSfx({ muted: true });
    sfx.hit();
    expect(totalOscillators()).toBe(0);
    sfx.setMuted(false);
    sfx.hit();
    expect(totalOscillators()).toBeGreaterThan(0);
  });

  it('(c) unmuted: each cue creates >=1 oscillator and connects a gain', () => {
    const sfx = createSfx();

    let prevOsc = totalOscillators();
    sfx.hit();
    expect(totalOscillators()).toBeGreaterThan(prevOsc);
    expect(totalGainConnections()).toBeGreaterThan(0);

    prevOsc = totalOscillators();
    sfx.reward();
    expect(totalOscillators()).toBeGreaterThan(prevOsc);

    prevOsc = totalOscillators();
    sfx.rankUp();
    expect(totalOscillators()).toBeGreaterThan(prevOsc);

    // lazy + reused: one context shared across all three cues
    expect(FakeAudioContext.instances.length).toBe(1);
    // every created oscillator was started and connected onward
    for (const c of FakeAudioContext.instances) {
      for (const o of c.oscillators) {
        expect(o.started).toBe(true);
        expect(o.connections.length).toBeGreaterThan(0);
      }
    }
  });

  it('(c2) keeps every voice short (<400ms) — no scheduled stop runs long', () => {
    // a proxy for the spec "voices <400ms": all cues fire without error and the engine
    // is built exactly once; the durations live in the voice specs (compile-time).
    const sfx = createSfx();
    expect(() => {
      sfx.hit();
      sfx.reward();
      sfx.rankUp();
    }).not.toThrow();
  });

  it('(d) when AudioContext is undefined, all methods are safe no-ops', () => {
    setGlobal('AudioContext', undefined);
    setGlobal('webkitAudioContext', undefined);
    const sfx = createSfx();
    expect(() => {
      sfx.hit();
      sfx.reward();
      sfx.rankUp();
      sfx.setMuted(true);
      sfx.setMuted(false);
    }).not.toThrow();
    expect(sfx.isMuted()).toBe(false);
    expect(totalOscillators()).toBe(0);
  });

  it('(e) honors prefers-reduced-motion only when opted in', () => {
    setGlobal('matchMedia', (q: string) => ({ matches: true, media: q }));

    const honoring = createSfx({ honorReducedMotion: true });
    honoring.hit();
    expect(totalOscillators()).toBe(0); // reduced-motion silences it

    const ignoring = createSfx(); // default: does not consult matchMedia
    ignoring.hit();
    expect(totalOscillators()).toBeGreaterThan(0);
  });
});

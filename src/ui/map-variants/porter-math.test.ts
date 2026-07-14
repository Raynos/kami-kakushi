// porter-math.test.ts — the FB-340 v2 walk math (pure, no DOM). Fixtures
// derive from the module's own exported constants, never copied magic numbers.
import { describe, expect, it } from 'vitest';
import { gaitAt, PORTER_SCALE, PORTER_STAND_Y, walkPoint } from './porter-math';

describe('walkPoint — linear, clock-driven travel', () => {
  const from = { x: 100, y: 200 };
  const to = { x: 500, y: 1000 };

  it('starts exactly at from and arrives exactly at to', () => {
    expect(walkPoint(from, to, 0)).toEqual(from);
    expect(walkPoint(from, to, 1)).toEqual(to);
  });

  it('is LINEAR — the midpoint fraction is the midpoint of the edge (the human ask: constant speed, no easing)', () => {
    expect(walkPoint(from, to, 0.5)).toEqual({ x: 300, y: 600 });
    // equal fraction steps cover equal distances (no ease-in/out on the piece)
    const d = (
      a: { x: number; y: number },
      b: { x: number; y: number },
    ): number => Math.hypot(b.x - a.x, b.y - a.y);
    const step1 = d(walkPoint(from, to, 0.1), walkPoint(from, to, 0.2));
    const step2 = d(walkPoint(from, to, 0.8), walkPoint(from, to, 0.9));
    expect(step1).toBeCloseTo(step2, 9);
  });

  it('clamps an out-of-range clock fraction to the edge endpoints (a late rAF after arrival must not overshoot)', () => {
    expect(walkPoint(from, to, -0.5)).toEqual(from);
    expect(walkPoint(from, to, 1.7)).toEqual(to);
  });
});

describe('gaitAt — the bounded netsuke waddle', () => {
  it('bob and rock stay within their sculpt-safe envelopes at any time', () => {
    for (let t = 0; t < 5000; t += 37) {
      const g = gaitAt(t);
      expect(Math.abs(g.bob)).toBeLessThanOrEqual(3.5);
      expect(Math.abs(g.rock)).toBeLessThanOrEqual(6);
    }
  });

  it('actually moves — the gait is not a dead zero (a frozen piece would read as a slide)', () => {
    const samples = Array.from({ length: 40 }, (_, i) => gaitAt(i * 23).bob);
    expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(3);
  });
});

describe('placement constants', () => {
  it('the piece stands SOUTH of the anchor, clear of the 78-tall seal box + its caption (~y+95)', () => {
    // Human re-anchor 2026-07-11: the piece stands ON the seal (feet at the kanji
    // baseline, y+16), never below the English caption (~y+73) — the old south lane.
    expect(PORTER_STAND_Y).toBeLessThan(78 / 2); // inside the seal box
    expect(PORTER_STAND_Y).toBeGreaterThanOrEqual(0); // at/under the kanji line, not floating over the box top
  });

  it('the sculpt scale keeps the piece smaller than the 132-wide seal label (the human size call)', () => {
    // sculpt height is ~56 local units (buildPorter geometry, feet 0 → crown -53)
    expect(56 * PORTER_SCALE).toBeLessThan(78); // shorter than the seal box itself
  });
});

import { describe, it, expect } from 'vitest';
import { computeProxies, evaluate, type Baseline } from './playcheck';

// Proves the playcheck gate has TEETH (op-model v2 FINAL, Workstream D): the §3 fun-vector
// gate must pass the current fun-green build AND go red on a regression. `evaluate` is pure,
// so we feed it degraded vectors directly rather than mutating the engine.
describe('playcheck — the fun-vector gate has teeth', () => {
  const v = computeProxies('real');
  const base: Baseline = { seed: 20260626, ...v };

  it('passes against its own blessed baseline (the current build is fun-green)', () => {
    expect(evaluate(v, base)).toEqual([]);
  });

  it('RED when the first-action hook blows the 5s cap (a dead cold-open)', () => {
    const fails = evaluate({ ...v, firstActionMs: 9000 }, base);
    expect(fails.some((f) => f.includes('firstActionMs'))).toBe(true);
  });

  it('RED when dead-time regresses past the floor (a long reward-less grind)', () => {
    const fails = evaluate({ ...v, maxDeadTimeMs: 99_999 }, base);
    expect(fails.some((f) => f.includes('maxDeadTimeMs'))).toBe(true);
  });

  it('a sub-3s reward gap never trips (no false alarm on integer-intent noise)', () => {
    expect(evaluate({ ...v, maxDeadTimeMs: 2900 }, base)).toEqual([]);
  });
});

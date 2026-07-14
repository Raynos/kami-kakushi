import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { computeProxies, evaluate, type Baseline } from './playcheck';

// Proves the playcheck gate has TEETH (op-model v2 FINAL, Workstream D). We load the COMMITTED
// baseline (not one derived from the live vector — that would be tautological), so "the live build
// passes" actually asserts the engine hasn't drifted from the blessed numbers. `evaluate` is pure,
// so we feed it degraded vectors directly, including values right at the ratchet boundary.
const committed = JSON.parse(
  readFileSync(new URL('./playcheck.baseline.json', import.meta.url), 'utf8'),
) as Baseline;

describe('playcheck — the fun-vector gate has teeth', () => {
  const v = computeProxies();

  it('the live build still passes the COMMITTED baseline (real drift check, not a tautology)', () => {
    expect(evaluate(v, committed)).toEqual([]);
  });

  it('RED when the first-action hook blows the §3 5s hard cap', () => {
    const fails = evaluate({ ...v, firstActionMs: 9000 }, committed);
    expect(fails.some((f) => f.includes('firstActionMs'))).toBe(true);
  });

  it('RED when the first-action hook trips the ratchet (past 3× baseline, still under the 5s cap)', () => {
    const fails = evaluate({ ...v, firstActionMs: 2100 }, committed);
    expect(fails.some((f) => f.includes('firstActionMs'))).toBe(true);
  });

  it('RED when dead-time regresses past the ratchet (a long reward-less grind)', () => {
    const fails = evaluate({ ...v, maxDeadTimeMs: 2100 }, committed);
    expect(fails.some((f) => f.includes('maxDeadTimeMs'))).toBe(true);
  });

  it('GREEN just under the ratchet boundary (no false alarm on minor drift)', () => {
    expect(
      evaluate({ ...v, firstActionMs: 1900, maxDeadTimeMs: 1900 }, committed),
    ).toEqual([]);
  });
});

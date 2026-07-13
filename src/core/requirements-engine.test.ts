import { describe, it, expect } from 'vitest';
import { createInitialState } from './index';
import {
  advanceOnToken,
  allRequirementsDone,
  chunkCount,
  isRequirementDone,
  rungPercentOf,
  settleOnState,
  type RequirementDef,
  type RequirementProgress,
} from './requirements-engine';

// Synthetic defs on purpose: these tests pin the ENGINE's contract (quantization,
// latching, the 99-clamp), not authored content — the content-derived fixtures live
// with the registry/integration tests (ADR-086: those derive from the gen'd lists).

const rake: RequirementDef = {
  id: 'rake',
  type: 'count',
  token: 'act:rake_rice',
  target: 100,
  flavor: 'Genemon counts the swept rows without a word.',
  objective: 'The yard swept, the rows counted over.',
  drive: 'rake_rice',
};
const boar: RequirementDef = {
  id: 'boar',
  type: 'count',
  token: 'kill:boar',
  target: 1,
  flavor: 'The boar is down.',
  objective: 'One boar taken at the field margin.',
  drive: 'fight boar',
};
const purse: RequirementDef = {
  id: 'purse',
  type: 'state',
  pred: { kind: 'resource', res: 'coin', min: 200 },
  flavor: 'The purse sits heavier than it ever has.',
  objective: 'Coin held, and none of it spent.',
  drive: 'sell rice',
};
const steward: RequirementDef = {
  id: 'steward',
  type: 'flag',
  flag: 'steward-spoken',
  flavor: 'The steward marks how the yard stays swept.',
  objective: 'The yard kept swept, day on day.',
  drive: 'talk steward',
};

const DEFS = [rake, boar, purse, steward];
const NONE: RequirementProgress = {};

describe('requirements engine (FB-121 / ADR-137) — counted advance + quantized percent', () => {
  it('routes a token only to listening, unfinished count reqs; unmatched is a no-op', () => {
    const r1 = advanceOnToken(DEFS, NONE, 'act:rake_rice');
    expect(r1.progress['rake']).toBe(1);
    expect(r1.completed).toEqual([]);
    // unmatched token: the SAME progress object back (cheap no-op)
    const r2 = advanceOnToken(DEFS, r1.progress, 'kill:dragon');
    expect(r2.progress).toBe(r1.progress);
  });

  it('a count req completes exactly once and latches (no over-count past target)', () => {
    const one = advanceOnToken(DEFS, NONE, 'kill:boar');
    expect(one.completed.map((d) => d.id)).toEqual(['boar']);
    expect(isRequirementDone(boar, one.progress)).toBe(true);
    const again = advanceOnToken(DEFS, one.progress, 'kill:boar');
    expect(again.completed).toEqual([]); // flavor never re-fires
    expect(again.progress['boar']).toBe(1); // latched, not 2
  });

  it('settleOnState completes state predicates + flags, latching against regression', () => {
    const s = createInitialState(7);
    const rich = { ...s, resources: { ...s.resources, coin: 200 } };
    const r1 = settleOnState(DEFS, NONE, rich);
    expect(r1.completed.map((d) => d.id)).toEqual(['purse']);
    // the purse drains — the once-met requirement STAYS done (a step climbed, not a tax held)
    const broke = { ...rich, resources: { ...rich.resources, coin: 0 } };
    const r2 = settleOnState(DEFS, r1.progress, broke);
    expect(r2.completed).toEqual([]);
    expect(isRequirementDone(purse, r2.progress)).toBe(true);

    const flagged = { ...broke, flags: { ...broke.flags, 'steward-spoken': true } };
    const r3 = settleOnState(DEFS, r2.progress, flagged);
    expect(r3.completed.map((d) => d.id)).toEqual(['steward']);
  });

  it('percent is a quantized, monotonic INTEGER: chunks for counts, one jump for atomics', () => {
    // 4 equal-weight reqs → each worth 25 points; rake (target 100) moves in 10 chunks of 2.5
    expect(rungPercentOf(DEFS, NONE)).toBe(0);
    let prog: RequirementProgress = NONE;
    let last = 0;
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) {
      prog = advanceOnToken(DEFS, prog, 'act:rake_rice').progress;
      const p = rungPercentOf(DEFS, prog);
      expect(Number.isInteger(p)).toBe(true);
      expect(p).toBeGreaterThanOrEqual(last); // monotonic
      last = p;
      seen.add(p);
    }
    expect(last).toBe(25); // the full count = its whole equal weight
    expect(seen.size).toBeLessThanOrEqual(chunkCount(100) + 1); // ≤10 quantized steps, not 100 ticks
    // an atomic completion lands its whole 25 as ONE jump
    const jumped = advanceOnToken(DEFS, prog, 'kill:boar').progress;
    expect(rungPercentOf(DEFS, jumped)).toBe(50);
  });

  it('100 ⟺ ALL done — near-complete progress clamps to 99, never rounds up to a lie', () => {
    // 20 reqs, 19 done + rake at 99/100 (frac .9) → raw 19.9/20 = 99.5 would ROUND to
    // 100; the clamp holds 99 so the bar can never claim ready before it is.
    const flags: RequirementDef[] = Array.from({ length: 19 }, (_, i) => ({
      id: `f${i}`,
      type: 'flag',
      flag: `f${i}`,
      flavor: 'x',
      objective: 'x-objective',
      drive: 'x',
    }));
    const wide = [rake, ...flags];
    const nearly: RequirementProgress = Object.fromEntries([
      ['rake', 99],
      ...flags.map((f) => [f.id, 1]),
    ]);
    expect(allRequirementsDone(wide, nearly)).toBe(false);
    expect(rungPercentOf(wide, nearly)).toBe(99);
    const done: RequirementProgress = { ...nearly, rake: 100 };
    expect(allRequirementsDone(wide, done)).toBe(true);
    expect(rungPercentOf(wide, done)).toBe(100);
    // and the 4-req list: 99/100 raked + 3 atomics done sits at 98 (quantized), not 99.5
    expect(rungPercentOf(DEFS, { rake: 99, boar: 1, purse: 1, steward: 1 })).toBe(98);
  });

  it('chunk count derives from the span: per-unit for small counts, capped at 10', () => {
    expect(chunkCount(1)).toBe(1);
    expect(chunkCount(7)).toBe(7);
    expect(chunkCount(10)).toBe(10);
    expect(chunkCount(500)).toBe(10);
  });

  it('settle throws on an unknown native predicate (authoring error, loud not silent)', () => {
    const bad: RequirementDef = {
      id: 'bad',
      type: 'state',
      pred: { kind: 'native', key: 'no-such-pred' },
      flavor: 'x',
      objective: 'x-objective',
      drive: 'x',
    };
    expect(() => settleOnState([bad], NONE, createInitialState(1))).toThrow(/no-such-pred/);
  });
});

import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  advanceClock,
  gradeOf,
  perDeedCap,
  accrueDeed,
  applyEstateDeed,
  seasonalJudge,
  estateGrade,
  balance,
  DAYS_PER_SEASON,
  TICKS_PER_DAY,
  type GameState,
} from './index';

/** A state parked at the R7 capstone → Phase 2 open (where deeds bank). */
function atPhase2(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R7',
    flags: { ...s.flags, awake: true, 'rank-r7': true, 't0-capstone': true },
  };
}
const zero = { value: 0, highWater: 0, judged: 0 } as const;

describe('Estate pillar — grade bands + per-deed cap (M2·3)', () => {
  it('gradeOf steps NONE→GOOD→GREAT→EXCELLENT on the bands', () => {
    const b = balance.ESTATE_BANDS;
    expect(gradeOf(0)).toBe('NONE');
    expect(gradeOf(b.good - 1)).toBe('NONE');
    expect(gradeOf(b.good)).toBe('GOOD');
    expect(gradeOf(b.great)).toBe('GREAT');
    expect(gradeOf(b.excellent)).toBe('EXCELLENT');
  });

  it('a single deed is capped — no one act spikes the grade', () => {
    const cap = perDeedCap();
    const p = accrueDeed(zero, 100000);
    expect(p.value).toBe(cap);
    expect(p.highWater).toBe(cap);
    expect(accrueDeed(zero, 0)).toBe(zero); // a zero deed is a structural no-op
  });
});

describe('Estate deeds are Phase-2-gated (FU7) (M2·3)', () => {
  it('applyEstateDeed is a no-op in Phase 1 (pre-capstone)', () => {
    const s = createInitialState(1); // rung R0 → Phase 1
    expect(applyEstateDeed(s, 50)).toBe(s);
    expect(s.influence.estate.value).toBe(0);
  });

  it('applyEstateDeed accrues SUB-koku, banking whole koku only as frac crosses 1 (D-133)', () => {
    const deed = balance.ESTATE_DEED_PER_ACT;
    expect(deed).toBeGreaterThan(0);
    expect(deed).toBeLessThan(1); // the D-133 stopgap: one labour deed is a fraction of a koku
    // one deed banks NO whole koku yet — it rides in `frac`; `value` holds at 0
    const one = applyEstateDeed(atPhase2(), deed);
    expect(one.influence.estate.value).toBe(0);
    expect(one.influence.estate.frac ?? 0).toBeCloseTo(deed, 6);
    // accumulate past a whole koku → `value` ticks up (RED-able: a broken accumulator stays at 0)
    let s = atPhase2();
    const acts = Math.ceil(1 / deed) + 1;
    for (let i = 0; i < acts; i++) s = applyEstateDeed(s, deed);
    expect(s.influence.estate.value).toBeGreaterThanOrEqual(1);
  });

  it('labour banks an Estate deed in Phase 2 (via the reducer)', () => {
    const base = atPhase2();
    const s = reduce(
      // farm_paddy is SPATIAL (v0.3.1 Step 5) — must be at its node to run.
      { ...base, location: 'home-paddies', unlocked: [...base.unlocked, 'verb-farm'] },
      { type: 'do_activity', activityId: 'farm_paddy' },
    );
    // The deed is SUB-koku (D-133): a single act banks into `frac`, not yet a whole koku in `value`.
    expect(s.influence.estate.frac ?? 0).toBeGreaterThan(0);
  });
});

describe('seasonal judge — new high-water, the 70/30 share, ±10% (M2·3/M2·4)', () => {
  it('fires only on a NEW high-water (highWater > judged)', () => {
    expect(seasonalJudge({ value: 70, highWater: 70, judged: 70 }, 0.5).bonus).toBe(0);
    expect(seasonalJudge({ value: 140, highWater: 140, judged: 70 }, 0.5).bonus).toBeGreaterThan(0);
  });

  it('pays ~3/7 of the deed-growth — the 30% seasonal share', () => {
    const growth = 700;
    const { bonus } = seasonalJudge({ value: growth, highWater: growth, judged: 0 }, 0.5); // swing 1.0
    expect(bonus).toBe(Math.round((growth * 3) / 7)); // 300, i.e. 30% beside the 70% of deeds
  });

  it('swings ±10%, never net-negative, and advances the judged baseline', () => {
    const lean = seasonalJudge({ value: 700, highWater: 700, judged: 0 }, 0); // swing 0.9
    const fat = seasonalJudge({ value: 700, highWater: 700, judged: 0 }, 0.999); // swing ≈1.1
    expect(lean.bonus).toBeGreaterThanOrEqual(0);
    expect(lean.bonus).toBeLessThan(fat.bonus);
    expect(fat.pillar.value).toBeGreaterThan(700);
    // the baseline advances to the POST-bonus high-water (the bonus is banked, never re-judged)
    expect(fat.pillar.judged).toBe(fat.pillar.highWater);
  });

  it('does NOT re-judge its own payout next season without new deeds (no geometric inflation)', () => {
    const first = seasonalJudge({ value: 700, highWater: 700, judged: 0 }, 0.5);
    expect(first.bonus).toBeGreaterThan(0);
    // a second judge with NO intervening deeds (high-water unchanged) → no new high-water → bonus 0
    const second = seasonalJudge(first.pillar, 0.5);
    expect(second.bonus).toBe(0);
    expect(second.pillar).toBe(first.pillar); // structural no-op
  });
});

describe('the seasonal judge is wired into the clock (M2·4)', () => {
  const SEASON_TICKS = DAYS_PER_SEASON * TICKS_PER_DAY;
  const pending = { estate: { value: 100, highWater: 100, judged: 0 } }; // a new high-water awaiting judge

  it('fires at a season boundary in Phase 2 and advances the judged baseline', () => {
    const s0: GameState = { ...atPhase2(), influence: pending };
    const s1 = advanceClock(s0, SEASON_TICKS); // → day 28, a season boundary
    expect(s1.influence.estate.value).toBeGreaterThan(100); // the season paid out the 30% share
    expect(s1.influence.estate.judged).toBe(s1.influence.estate.highWater); // baseline = POST-bonus HW
  });

  it('does NOT fire in Phase 1 (pre-capstone)', () => {
    const s0: GameState = { ...createInitialState(1), influence: pending };
    const s1 = advanceClock(s0, SEASON_TICKS);
    expect(s1.influence.estate.value).toBe(100); // no judge before Phase 2
    expect(s1.influence.estate.judged).toBe(0);
  });
});

describe('estateGrade reads the live pillar', () => {
  it('reflects accrued standing', () => {
    expect(estateGrade(createInitialState(1))).toBe('NONE');
    const rich: GameState = {
      ...createInitialState(1),
      influence: { estate: { value: balance.ESTATE_BANDS.excellent, highWater: 999, judged: 0 } },
    };
    expect(estateGrade(rich)).toBe('EXCELLENT');
  });
});

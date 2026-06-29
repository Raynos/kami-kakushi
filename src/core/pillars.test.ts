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

  it('applyEstateDeed banks (capped) in Phase 2 (post-R7)', () => {
    const after = applyEstateDeed(atPhase2(), balance.ESTATE_DEED_PER_ACT);
    expect(after.influence.estate.value).toBe(balance.ESTATE_DEED_PER_ACT);
  });

  it('labour banks an Estate deed in Phase 2 (via the reducer)', () => {
    const base = atPhase2();
    const s = reduce(
      { ...base, unlocked: [...base.unlocked, 'verb-farm'] },
      { type: 'do_activity', activityId: 'farm_paddy' },
    );
    expect(s.influence.estate.value).toBeGreaterThan(0);
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
    expect(fat.pillar.judged).toBe(700); // the baseline moves up to the judged high-water
    expect(fat.pillar.value).toBeGreaterThan(700);
  });
});

describe('the seasonal judge is wired into the clock (M2·4)', () => {
  const SEASON_TICKS = DAYS_PER_SEASON * TICKS_PER_DAY;
  const pending = { estate: { value: 100, highWater: 100, judged: 0 } }; // a new high-water awaiting judge

  it('fires at a season boundary in Phase 2 and advances the judged baseline', () => {
    const s0: GameState = { ...atPhase2(), influence: pending };
    const s1 = advanceClock(s0, SEASON_TICKS); // → day 28, a season boundary
    expect(s1.influence.estate.value).toBeGreaterThan(100); // the season paid out the 30% share
    expect(s1.influence.estate.judged).toBe(100); // baseline moved up to the judged high-water
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

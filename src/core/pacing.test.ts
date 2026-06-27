import { describe, it, expect } from 'vitest';
import { walkPacing } from '../scripts/pacing-report';
import { balance } from '../core';

// The signed pacing criterion as a RED-able assertion: REAL clears the ≥30-min wall
// floor on every climb rung; DEMO stays fast (review-velocity default); the profile is
// wired end-to-end through the REAL reducer (walkPacing drives createInitialState + reduce).
describe('pacing profile', () => {
  it('REAL clears the >=30-min wall floor on every climb rung', () => {
    const climb = walkPacing('real').filter((r) => !r.terminal && r.intents > 0);
    expect(climb.length).toBeGreaterThanOrEqual(3); // R0, R1, R2
    for (const r of climb) expect(r.wallMin).toBeGreaterThanOrEqual(balance.RUNG_WALL_FLOOR_MIN);
  });

  it('DEMO stays fast (minutes, the review-velocity default)', () => {
    const total = walkPacing('demo').reduce((a, r) => a + r.wallMin, 0);
    expect(total).toBeLessThan(5);
  });

  it('demo map mirrors RankDef thresholds (drift guard, belt-and-suspenders w/ verify-content)', () => {
    expect(balance.RUNG_METER_THRESHOLDS.demo).toMatchObject({ R0: 14, R1: 30, R2: 48, R3: 80 });
  });
});

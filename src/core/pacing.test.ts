import { describe, it, expect } from 'vitest';
import { walkPacing } from '../scripts/pacing-report';
import { balance, rungRequirements } from '../core';

// ADR-056: the DEMO/REAL profile fork is RETIRED — ONE shipped profile. T0 is ≥30-min-floor-EXEMPT
// ("quick but not easy"; the signed ≥30-min/rank floor gates from T1 per the 6-tier reshape).
// So the T0 pacing criterion is the sane BAND: each measured climb rung slow enough not to be
// the seconds-fast DEMO crutch, fast enough to stay a tutorial. walkPacing drives the REAL reducer
// (createInitialState + reduce), so the model can't drift from the game. RED-able.
// Targets (locked): R0 ≈ 5-min cold-open (ADR-022); the climb rungs ≈ 10–15 min (battery R4#2).
describe('T0 pacing (single profile, D-056)', () => {
  const rows = walkPacing();
  const climb = rows.filter((r) => !r.terminal && r.intents > 0);

  it('measures the T0 climb rungs R0..R2 (the sim stops at the R3 combat gate)', () => {
    expect(climb.map((r) => r.rung)).toEqual(['R0', 'R1', 'R2']);
  });

  it('every T0 climb rung lands inside the sane band (not DEMO-trivial, not a grind)', () => {
    for (const r of climb) {
      expect(r.wallMin).toBeGreaterThanOrEqual(balance.T0_PACING_BAND_MIN);
      expect(r.wallMin).toBeLessThanOrEqual(balance.T0_PACING_BAND_MAX);
      expect(r.outOfBand).toBe(false);
    }
  });

  it('R0 is a ~5-min cold-open — quick, but no longer the seconds-fast DEMO trivia', () => {
    const r0 = climb.find((r) => r.rung === 'R0')!;
    expect(r0.wallMin).toBeGreaterThanOrEqual(3); // not the old 0.06-min DEMO crutch
    expect(r0.wallMin).toBeLessThanOrEqual(8); // a cold-open, not a grind
  });

  it('the climb ramps up (each rung at least as long as the one before)', () => {
    for (let i = 1; i < climb.length; i++) {
      expect(climb[i]!.wallMin).toBeGreaterThanOrEqual(climb[i - 1]!.wallMin);
    }
  });

  it('the R0 rake count is the cold-open pace anchor (deliberate copied literal)', () => {
    // FB-121: the meter map is gone — the one magic-number mirror moves to the R0 rake
    // requirement (≈5-min cold-open, ADR-022). Deriving it from the registry would be a
    // tautology; a requirements.md retune updates this on purpose (re-signed via the sim).
    const rake = rungRequirements('R0').find((r) => r.type === 'count');
    expect(rake).toMatchObject({ token: 'act:rake_rice', target: 500 });
  });
});

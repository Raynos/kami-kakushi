import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  ascensionAvailable,
  ascensionBoon,
  ascend,
  estateGrade,
  balance,
  type GameState,
} from './index';

/** A state parked at the R7 capstone → Phase 2 open. */
function atPhase2(): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R7',
    flags: { ...s.flags, awake: true, 'rank-r7': true, 't0-capstone': true },
  };
}
/** …with the Estate pillar at a given value (the ascension gate reads the grade). */
function withEstate(value: number): GameState {
  const s = atPhase2();
  return { ...s, influence: { estate: { value, highWater: value, judged: 0 } } };
}

describe('ascension gate (T0 = Estate ≥ EXCELLENT) — manual opt-in (M2·5)', () => {
  it('is closed below EXCELLENT, and at the wrong tier/phase', () => {
    expect(ascensionAvailable(createInitialState(1))).toBe(false); // Phase 1
    expect(ascensionAvailable(withEstate(balance.ESTATE_BANDS.great))).toBe(false); // only GREAT
    expect(ascensionAvailable({ ...withEstate(balance.ESTATE_BANDS.excellent), tier: 1 })).toBe(
      false,
    ); // already ascended
  });

  it('opens exactly at EXCELLENT in Phase 2 at tier 0', () => {
    const s = withEstate(balance.ESTATE_BANDS.excellent);
    expect(estateGrade(s)).toBe('EXCELLENT');
    expect(ascensionAvailable(s)).toBe(true);
  });

  it('NEVER auto-advances — the tier only changes on the explicit ascend intent', () => {
    const s = withEstate(balance.ESTATE_BANDS.excellent);
    // a normal reduce (e.g. spend a point) does not ascend; only `ascend` does
    expect(reduce(s, { type: 'set_stance', stance: 'gedan' }).tier).toBe(0);
  });
});

describe('ascend — tier bump + grade-scaled boon + dream beat (D-049/D-062)', () => {
  it('bumps tier 0→1, grants the always-big base boon, fires the ceremony + dream flags', () => {
    const s = withEstate(balance.ESTATE_BANDS.excellent);
    const t1 = ascend(s);
    expect(t1.tier).toBe(1);
    expect(t1.character.attributePoints).toBe(
      s.character.attributePoints + balance.ASCENSION_BOON_BASE_POINTS,
    );
    expect(t1.flags['ascended-t0']).toBe(true);
    expect(t1.flags['dream-t0-ascension']).toBe(true);
    // the dream beat READS the porter's-knot flag (no longer write-only) — the clearer cut
    const withKnot = ascend({ ...s, flags: { ...s.flags, 'porters-knot': true } });
    const dream = withKnot.log.entries.find((e) => e.text.includes("porter's knot"));
    expect(dream).toBeDefined();
  });

  it('overshooting the gate buys a BIGGER boon (D-049)', () => {
    const base = ascensionBoon(withEstate(balance.ESTATE_BANDS.excellent));
    const over = ascensionBoon(
      withEstate(balance.ESTATE_BANDS.excellent + 4 * balance.ASCENSION_BOON_OVERSHOOT_PER_POINT),
    );
    expect(over).toBeGreaterThan(base);
    expect(over - base).toBe(4);
  });

  it('is a no-op when the gate is closed', () => {
    const s = withEstate(balance.ESTATE_BANDS.great); // only GREAT
    expect(ascend(s)).toBe(s);
  });
});

// THE WHOLE POINT OF MOVEMENT 2: prove the spine CLOSES — climb into Phase 2, grind Estate
// deeds up to the gate, and ascend T0→T1. Driven through the real reducer end-to-end.
describe('the spine CLOSES end-to-end (M2·5)', () => {
  it('grinds Estate deeds to EXCELLENT in Phase 2, then ascends T0→T1', () => {
    let s: GameState = atPhase2();
    s = { ...s, unlocked: [...s.unlocked, 'verb-farm'] }; // labour available
    expect(ascensionAvailable(s)).toBe(false); // grade NONE at the capstone

    let guard = 0;
    while (estateGrade(s) !== 'EXCELLENT' && guard++ < 1000) {
      // v0.3.1 Step 5: activities are SPATIAL — farm_paddy runs only at its node.
      s = reduce(
        { ...s, location: 'home-paddies' },
        { type: 'do_activity', activityId: 'farm_paddy' },
      );
    }
    expect(estateGrade(s)).toBe('EXCELLENT'); // the deed grind reached the gate
    expect(ascensionAvailable(s)).toBe(true);

    const before = s.character.attributePoints;
    const t1 = reduce(s, { type: 'ascend' });
    expect(t1.tier).toBe(1); // ← the loop CLOSES: T0 → T1
    expect(t1.character.attributePoints).toBeGreaterThan(before); // the permanent boon
    expect(t1.flags['ascended-t0']).toBe(true);
    expect(ascensionAvailable(t1)).toBe(false); // can't re-ascend T0
  });

  it('the seasonal reckoning FIRES on the optimal Phase-2 path, before ascension (battery #8)', () => {
    // The bug: the judge fired only on the 28-day season boundary, but the Estate deed-grind reaches
    // EXCELLENT in ~5 days — so it fired 0× before ascension. The fix reckons on the shorter
    // PHASE2_JUDGE_INTERVAL_DAYS cadence. This test drives the REAL grind (reduce → advanceClock →
    // the reckoning boundary) and asserts the judge is FELT: it goes RED under the old season cadence.
    let s: GameState = atPhase2();
    s = { ...s, unlocked: [...s.unlocked, 'verb-farm'] };
    let guard = 0;
    let firedDuringGrind = false;
    while (estateGrade(s) !== 'EXCELLENT' && guard++ < 1000) {
      s = reduce(
        { ...s, location: 'home-paddies' },
        { type: 'do_activity', activityId: 'farm_paddy' },
      );
      // the judge banks by advancing `judged` past 0 (its baseline moves to the post-bonus high-water)
      if ((s.influence.estate.judged ?? 0) > 0) firedDuringGrind = true;
    }
    expect(firedDuringGrind).toBe(true); // ← the reckoning fired WHILE climbing to the gate
    expect(s.influence.estate.judged).toBeGreaterThan(0); // it banked (not just logged)
    // and it left its ceremonial mark in the log — the player SEES it
    expect(s.log.entries.some((e) => /accounts are reckoned/.test(e.text))).toBe(true);
  });
});

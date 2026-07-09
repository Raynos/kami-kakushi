import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  gradeOf,
  perDeedCap,
  accrueDeed,
  applyEstateDeed,
  estateDeedMagnitude,
  bankEstateDeed,
  seasonalJudge,
  estateGrade,
  balance,
  advanceSeason,
  type GameState,
  type EstateDeedSource,
  ESTATE_STAGES,
  estateBuild,
} from './index';
import { FLAVOR } from './content/flavor';

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
    expect(deed).toBeLessThan(1); // the ADR-133 stopgap: one labour deed is a fraction of a koku
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
      { ...base, location: 'paddies', unlocked: [...base.unlocked, 'verb-farm'] },
      { type: 'do_activity', activityId: 'farm_paddy' },
    );
    // The deed is SUB-koku (ADR-133): a single act banks into `frac`, not yet a whole koku in `value`.
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

describe('the seasonal judge fires on the season-exit pipeline (M2·4, storywave G1)', () => {
  const pending = { estate: { value: 100, highWater: 100, judged: 0 } }; // a new high-water awaiting judge

  it('fires on advance_season in Phase 2 and advances the judged baseline', () => {
    const s0: GameState = { ...atPhase2(), influence: pending };
    const s1 = advanceSeason(s0); // end the season → the exit pipeline reckons
    expect(s1.influence.estate.value).toBeGreaterThan(100); // the season paid out the 30% share
    expect(s1.influence.estate.judged).toBe(s1.influence.estate.highWater); // baseline = POST-bonus HW
    expect(s1.seasonsPassed).toBe(s0.seasonsPassed + 1); // the wheel actually turned
  });

  it('does NOT fire in Phase 1 (pre-capstone)', () => {
    const s0: GameState = { ...createInitialState(1), influence: pending };
    const s1 = advanceSeason(s0);
    expect(s1.influence.estate.value).toBe(100); // no judge before Phase 2
    expect(s1.influence.estate.judged).toBe(0);
  });
});

describe('ADR-145 — the multi-source Phase-2 economy (Phase 1 DoD)', () => {
  // Fixtures derive from the SOURCE OF TRUTH (the balance constants), never copied literals.
  const base = () => balance.ESTATE_DEED_PER_ACT;
  const mult = balance.ESTATE_DEED_SOURCE_MULT as Record<EstateDeedSource, number>;

  it('each source banks its OWN magnitude — base × its multiplier (the design lever)', () => {
    for (const source of Object.keys(mult) as EstateDeedSource[]) {
      // the derivation itself (AC-21: one place source→magnitude comes from)
      expect(estateDeedMagnitude(source)).toBeCloseTo(base() * mult[source], 9);
      // …and banking it lands EXACTLY that in the accumulator (RED if a source is mis-routed)
      const s = bankEstateDeed(atPhase2(), source);
      expect(s.influence.estate.frac ?? 0).toBeCloseTo(base() * mult[source], 9);
    }
    // the sources are genuinely DISTINCT magnitudes, not one flat rate (RED if the table
    // collapses to a single value — the "grind with 4 buttons that pay the same" regression)
    expect(new Set(Object.values(mult)).size).toBeGreaterThan(1);
  });

  it('a source deed still folds through the per-deed cap (anti-spike holds)', () => {
    const cap = perDeedCap();
    for (const source of Object.keys(mult) as EstateDeedSource[]) {
      expect(estateDeedMagnitude(source)).toBeLessThanOrEqual(cap);
    }
  });

  it('an estate-IRRELEVANT act banks NOTHING (Q4 — undefined source is a structural no-op)', () => {
    const s = atPhase2();
    expect(bankEstateDeed(s, undefined)).toBe(s);
  });

  it('Phase-1 gating holds for every source (deeds never bank pre-capstone)', () => {
    const s = createInitialState(1); // rung R0 → Phase 1
    for (const source of Object.keys(mult) as EstateDeedSource[]) {
      expect(bankEstateDeed(s, source)).toBe(s);
    }
  });

  it('via the reducer: farm banks FIELDS, woodcut banks ZERO (the Q4 gate end-to-end)', () => {
    const base2 = atPhase2();
    const farm = reduce(
      { ...base2, location: 'paddies', unlocked: [...base2.unlocked, 'verb-farm'] },
      { type: 'do_activity', activityId: 'farm_paddy' },
    );
    expect(farm.influence.estate.frac ?? 0).toBeCloseTo(estateDeedMagnitude('fields'), 9);
    const wood = reduce(
      { ...base2, location: 'woodlot', unlocked: [...base2.unlocked, 'verb-woodcut'] },
      { type: 'do_activity', activityId: 'woodcut_edge' },
    );
    expect(wood.resources.wood ?? 0).toBeGreaterThan(0); // the act really ran…
    expect(wood.influence.estate.frac ?? 0).toBe(0); // …but built no house standing
  });
});

describe('ADR-145 — the staged E0→E1 build as pacing beats (Phase 2 DoD)', () => {
  // All fixtures derive from the SOURCE OF TRUTH: ESTATE_STAGES (coin costs) +
  // ESTATE_STAGE_DEED_GATES (deed gates) + ESTATE_BANDS (the ascension bands).
  const gates = balance.ESTATE_STAGE_DEED_GATES;
  const richPhase2 = (deedValue: number, stage = 0): GameState => {
    const s = atPhase2();
    return {
      ...s,
      estateStage: stage,
      unlocked: [...s.unlocked, 'panel-estate'],
      resources: { ...s.resources, coin: 99999 },
      influence: { estate: { value: deedValue, highWater: deedValue, judged: 0 } },
    };
  };

  it('a stage is BLOCKED below its deed gate even with the coin (the B-half lever)', () => {
    // U1's gate is 0 (Phase-1 purchasable, unchanged behavior)…
    expect(gates[0]).toBe(0);
    // …U2+ are deed-gated: standing one koku short of the gate refuses the buy.
    for (let stage = 2; stage <= ESTATE_STAGES.length; stage++) {
      const gate = gates[stage - 1]!;
      expect(gate).toBeGreaterThan(0);
      const blocked = richPhase2(gate - 1, stage - 1);
      expect(reduce(blocked, { type: 'improve_estate' })).toBe(blocked); // RED if the gate is dropped
      const allowed = reduce(richPhase2(gate, stage - 1), { type: 'improve_estate' });
      expect(allowed.estateStage).toBe(stage);
    }
  });

  it('the gates are ordered along the deed climb and sit under the EXCELLENT band', () => {
    for (let i = 1; i < gates.length; i++) expect(gates[i]!).toBeGreaterThan(gates[i - 1]!);
    // the E1 build-complete beat must be reachable BEFORE/AT the ascension gate (plan §6 P2)
    expect(gates[gates.length - 1]!).toBeLessThanOrEqual(balance.ESTATE_BANDS.excellent);
  });

  it('the build advances in ORDER and the E1 "estate stands" beat fires exactly once (TST2)', () => {
    let s = richPhase2(balance.ESTATE_BANDS.excellent); // standing high enough for every gate
    for (let stage = 1; stage <= ESTATE_STAGES.length; stage++) {
      s = reduce(s, { type: 'improve_estate' });
      expect(s.estateStage).toBe(stage); // strictly one stage per commissioning — never skips
    }
    expect(s.flags['estate-stands']).toBe(true);
    // Match the completion BEAT precisely (FLAVOR.estateStands) — the U4 stage's own commissioning
    // line also carries the phrase "the estate stands", so a loose substring would over-count.
    const standsLines = s.log.entries.filter((l) => l.text === FLAVOR.estateStands);
    expect(standsLines.length).toBe(1); // the build-complete beat fired exactly once
    // …and a further improve is a no-op that does NOT re-fire it (append-only, TST2)
    const again = reduce(s, { type: 'improve_estate' });
    expect(again).toBe(s);
  });

  it('a deed source fires its reveal beat on FIRST bank only (TST3 discovery, TST2 once)', () => {
    const s0 = atPhase2();
    const first = bankEstateDeed(s0, 'fields');
    expect(first.flags['deed-source-fields']).toBe(true);
    const revealed = first.log.entries.length;
    expect(revealed).toBeGreaterThan(s0.log.entries.length); // the beat landed in the log
    const second = bankEstateDeed(first, 'fields');
    expect(second.log.entries.length).toBe(revealed); // no repeat — the reveal is one-time
    expect(second.influence.estate.frac).toBeGreaterThan(first.influence.estate.frac ?? 0);
  });
});

describe('ADR-145 — estateBuild is the ONE build read (Phase 4 DoD, AC-6/TST4)', () => {
  it('the shown distances equal the reducer-enforced gates (DISPLAYED==TESTED)', () => {
    const gates = balance.ESTATE_STAGE_DEED_GATES;
    // park standing one koku short of U2's gate, coin one mon short of its cost
    const gate2 = gates[1]!;
    const cost2 = ESTATE_STAGES[1]!.coinCost;
    const s: GameState = {
      ...atPhase2(),
      estateStage: 1,
      resources: { coin: cost2 - 1 },
      influence: { estate: { value: gate2 - 1, highWater: gate2 - 1, judged: 0 } },
    };
    const b = estateBuild(s);
    expect(b.complete).toBe(false);
    expect(b.next?.def.stage).toBe(2);
    expect(b.next?.deedGate).toBe(gate2); // the SAME constant improve_estate enforces
    expect(b.next?.deedsShort).toBe(1);
    expect(b.next?.coinShort).toBe(1);
    // …and the reducer indeed refuses at exactly this state (the selector can't drift green)
    expect(
      reduce({ ...s, unlocked: [...s.unlocked, 'panel-estate'] }, { type: 'improve_estate' }),
    ).toEqual(expect.objectContaining({ estateStage: 1 }));
    // statuses ladder: built ≤ current < next < locked, one row per stage
    expect(b.rows.map((r) => r.status)).toEqual(['built', 'next', 'locked', 'locked']);
  });

  it('reports complete at U4 with no next block', () => {
    const s: GameState = { ...atPhase2(), estateStage: ESTATE_STAGES.length };
    const b = estateBuild(s);
    expect(b.complete).toBe(true);
    expect(b.next).toBeUndefined();
    expect(b.rows.every((r) => r.status === 'built')).toBe(true);
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

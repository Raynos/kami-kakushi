import { describe, it, expect } from 'vitest';
import { WORKS_PROJECTS } from './works';
import {
  createInitialState,
  reduce,
  getActivity,
  addSkillXp,
  skillLevel,
  skillYieldNum,
  mcCombatStats,
  getWeapon,
  hpMax,
  workRate,
  lowHpWorkMult,
  activityForecast,
  satietyMax,
  season,
  estateSatietyBonus,
  estateYieldNum,
  getItem,
  applyGrindFight,
  formatCoin,
  riceSellQuote,
  merchantOffer,
  MERCHANT_SAG_STEP_SHO,
  initialMerchants,
  isMarketDay,
  TICKS_PER_DAY,
  MAX_ESTATE_STAGE,
  ESTATE_STAGES,
  MARKET_ITEMS,
  SEASONS,
  type Season,
  tick,
  balance,
  introActive,
  introSceneAt,
  RUNG_BEATS,
  type GameState,
  rungRequirements,
  isRequirementDone,
  factsForSurfaces,
} from './index';
import { validateState } from '../persistence/validate';
import { YOHEI_MARKET_DAYS, YOHEI_PURSE_MON } from './content/market';

// A weekday that IS one of Yohei's market days (his stall is open) — derived from the source
// (never a pinned literal). clock.day in 0..6 has day-of-week === itself.
const MARKET_DAY = YOHEI_MARKET_DAYS[0]!;

// ADR-110: promotion is a player-TRIGGERED beat now. These local helpers drive the real path — finish
// the intro's VN scenes, then trigger + complete a ready rung beat.
function finishIntro(s: GameState): GameState {
  while (introActive(s.introBeat)) {
    const sc = introSceneAt(s.introBeat)!;
    s = reduce(s, {
      type: 'choose_intro',
      optionId: sc.decision.options[0]!.id,
    });
  }
  return s;
}
function playBeat(s: GameState): GameState {
  s = reduce(s, { type: 'begin_rung_beat' });
  const t = s.rungBeat;
  if (t === null) return s;
  return reduce(s, {
    type: 'choose_rung_option',
    optionId: RUNG_BEATS[t]!.decision.options[0]!.id,
  });
}

// The reinvestment + sinks lens (audit #4/#5). The yield multiplier is deterministic
// integer fixed-point (no RNG), so these are exact; the combat/estate sinks are pure
// reducers. L1 defaults keep every existing m1/m2 assertion byte-identical.

const SEASON_SPRING_SAFE = 1; // day 0 is spring → no autumn harvest multiplier

/** A fresh state with the labour verb entitled + full satiety (rate = 1, no throttle). */
function farmReady(seed = SEASON_SPRING_SAFE): GameState {
  const s = createInitialState(seed);
  return {
    ...s,
    // G4: farm_paddy is SPATIAL — it only runs at its 'paddies' node.
    location: 'paddies',
    character: { ...s.character, satiety: satietyMax(s) },
    // ADR-179 — visibility DERIVES from facts: stamp the entitling rank flag, no latch.
    flags: { ...s.flags, ...factsForSurfaces('verb-farm') },
  };
}

function farmYield(s: GameState): number {
  // ADR-163: paddy work banks RICE (shō) into the KURA (banked), never a carried pocket.
  const before = s.banked.rice ?? 0;
  const after = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
  return (after.banked.rice ?? 0) - before;
}

/** The L1 first-draw paddy yield, derived from the source pool + draw curve (never a copied
 *  magic number): a fresh winter paddy pool, one diminishing-returns draw. */
const PADDY_L1_FIRST_DRAW = balance.productionDraw(
  balance.SITE_POOL_BASE.paddies!,
);

describe('skill → yield multiplier (audit #4)', () => {
  it('is ×1.00 at L1 (byte-identical to v0.1), reaches the ×3.0 cap, and never decreases', () => {
    expect(skillYieldNum(1)).toBe(balance.SKILL_YIELD_DEN); // 100 → ×1.00
    expect(skillYieldNum(51)).toBe(
      balance.SKILL_YIELD_DEN + balance.SKILL_YIELD_CAP_NUM,
    ); // 300 → ×3.0
    expect(skillYieldNum(99)).toBe(skillYieldNum(51)); // cap holds past L51
    let prev = 0;
    for (let lvl = 1; lvl <= 99; lvl++) {
      const v = skillYieldNum(lvl);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('do_activity yields v0.1 base at L1, strictly more once the skill climbs, bounded by ×3', () => {
    const base = farmReady();
    expect(skillLevel(base, 'farming')).toBe(1);
    const baseKoku = farmYield(base);
    expect(baseKoku).toBe(PADDY_L1_FIRST_DRAW); // the fresh-pool first-draw yield at skill L1

    const leveled = addSkillXp(base, 'farming', 200); // a few ranks of farming
    expect(skillLevel(leveled, 'farming')).toBeGreaterThan(1);
    expect(farmYield(leveled)).toBeGreaterThan(baseKoku); // the loop has teeth

    const maxed = addSkillXp(base, 'farming', Number.MAX_SAFE_INTEGER); // clamps at SKILL_MAX_LEVEL
    const maxKoku = farmYield(maxed);
    expect(maxKoku).toBeGreaterThan(baseKoku);
    expect(maxKoku).toBeLessThanOrEqual(3 * baseKoku); // the ×3.0 cap is the ceiling
    expect(maxKoku).toBe(3 * baseKoku); // exactly ×3 once the cap binds
  });

  it('the estate flywheel COMPOUNDS — a higher estate stage raises labour yield (T0-M4-F2)', () => {
    // U0 (un-worked) is identity (byte-identical to pre-flywheel); each bought stage lifts every act.
    const e0 = farmReady();
    expect(estateYieldNum(e0)).toBe(balance.SKILL_YIELD_DEN);
    const baseKoku = farmYield(e0);

    let prev = baseKoku;
    for (let stage = 1; stage <= MAX_ESTATE_STAGE; stage++) {
      const atStage: GameState = { ...e0, estateStage: stage };
      // the MECHANISM strictly compounds each stage…
      expect(estateYieldNum(atStage)).toBeGreaterThan(
        estateYieldNum({ ...e0, estateStage: stage - 1 }),
      );
      // …and the realised yield never drops (integer rounding can plateau on a small base).
      const yielded = farmYield(atStage);
      expect(yielded).toBeGreaterThanOrEqual(prev);
      prev = yielded;
    }
    // end-to-end the flywheel has real teeth: the top stage out-yields foreclosure's edge.
    expect(farmYield({ ...e0, estateStage: MAX_ESTATE_STAGE })).toBeGreaterThan(
      baseKoku,
    );
  });

  it('rung pacing is independent of skill — requirement counts move per-ACT, not per-yield', () => {
    let atR1 = finishIntro(
      reduce(createInitialState(SEASON_SPRING_SAFE), { type: 'open_eyes' }),
    );
    // FB-121: derive the rake count from the R0 registry (never a frozen literal);
    // staged same-token reqs complete cumulatively, so the climb is the MAX target.
    const rakesToR1 = Math.max(
      ...rungRequirements('R0')
        .filter((r) => r.type === 'count')
        .map((r) => (r.type === 'count' ? r.target : 0)),
    );
    for (let i = 0; i < rakesToR1; i++) {
      // FB-265: work refuses at empty satiety — rest back up like a real player must
      while (atR1.character.satiety < 6) atR1 = reduce(atR1, { type: 'rest' });
      atR1 = reduce(atR1, { type: 'rake_rice' });
    }
    atR1 = playBeat(atR1); // R0 → R1 via the story beat (ADR-110)
    expect(atR1.rung).toBe('R1');

    const CAP = 5000;
    // Count the farm acts that COMPLETE R1's farm requirement (the design lever: a count
    // requirement ticks once per act, never per yield — skill can't shrink the climb).
    // the TERMINAL farm stage (staged same-token reqs — take the max target)
    const farmReq = rungRequirements('R1')
      .filter((r) => r.type === 'count' && r.token === 'act:farm_paddy')
      .sort(
        (a, b) =>
          (b.type === 'count' ? b.target : 0) -
          (a.type === 'count' ? a.target : 0),
      )[0]!;
    const actsToFarmDone = (start: GameState): number => {
      // v0.3.1 Step 5: farm_paddy is spatial — grind at its 'home-paddies' node.
      let s: GameState = { ...start, location: 'paddies' };
      let n = 0;
      while (!isRequirementDone(farmReq, s.rungReqs) && n < CAP) {
        // FB-265: rest when the act would refuse (rests don't count as farm acts)
        while (s.character.satiety < 6) s = reduce(s, { type: 'rest' });
        s = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
        n++;
      }
      return n;
    };
    const low = actsToFarmDone(atR1);
    const high = actsToFarmDone(addSkillXp(atR1, 'farming', 100_000));
    expect(low).toBeLessThan(CAP); // the requirement actually completed, not the guard cap
    expect(low).toBe(high); // per-act, not per-yield — skill doesn't shrink it
  });
});

// G3 — the missing body coupling (ADR-155/ADR-164): "one body, two meters, coupled ONE way".
// Low HP now IMPAIRS work; labour NEVER costs HP. Fixtures derive the threshold from the source
// constant (LOW_HP_WORK_THRESHOLD), never a copied 30 — RED if anyone drops the HP term from the
// work rate OR couples labour → HP backwards.
describe('low-HP work impairment (G3 — the missing coupling)', () => {
  it('below LOW_HP_WORK_THRESHOLD of hpMax, labour yields strictly less than at full HP', () => {
    const base = farmReady(); // full satiety → the satiety throttle is a flat 1.0, so HP is isolated
    const max = hpMax(base);
    const full: GameState = {
      ...base,
      character: { ...base.character, hp: max },
    };
    // HP just UNDER the threshold, DERIVED from the source constant (never a copied 0.3 / 30).
    const injuredHp = Math.floor(balance.LOW_HP_WORK_THRESHOLD * max) - 1;
    expect(injuredHp).toBeGreaterThan(0); // a sane fixture — hurt, still on his feet
    const injured: GameState = {
      ...base,
      character: { ...base.character, hp: injuredHp },
    };
    // the design lever: the work multiplier is 1 at full HP and drops to LOW_HP_WORK_MULT once hurt…
    expect(lowHpWorkMult(full)).toBe(1);
    expect(lowHpWorkMult(injured)).toBe(balance.LOW_HP_WORK_MULT);
    expect(workRate(injured)).toBeLessThan(workRate(full));
    // …and it bites the REALISED labour yield (RED if the HP term is dropped from the work rate).
    expect(farmYield(injured)).toBeLessThan(farmYield(full));
  });

  it('labour at 1 HP never reduces HP — the coupling is strictly ONE-WAY (satiety is the work fuel)', () => {
    const atFloor: GameState = {
      ...farmReady(),
      character: { ...farmReady().character, hp: 1 },
    };
    const after = reduce(atFloor, {
      type: 'do_activity',
      activityId: 'farm_paddy',
    });
    // the one-way law: working NEVER writes HP — RED the instant anyone couples labour → HP.
    expect(after.character.hp).toBe(1);
    // …and the act still HAPPENED — it spent SATIETY (the real work fuel) and banked rice (kura).
    expect(after.character.satiety).toBeLessThan(atFloor.character.satiety);
    expect(after.banked.rice ?? 0).toBeGreaterThan(atFloor.banked.rice ?? 0);
  });
});

describe('cook_meal — the sansai → HP heal sink (F22 / D-050)', () => {
  // FB-22: cook is the HEALTH-recovery action — it mends HP and does NOT touch work-stamina
  // (satiety). See the FB-22 distinctness block below for the "one action must not refill both".
  function cookReady(hp: number, sansai = 5): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      character: { ...s.character, hp },
      resources: { ...s.resources, sansai },
      // ADR-184 — the kitchen is what TEACHES the pot (verb-cook keys to room-kitchen), so the
      // entitling facts below open the threshold too; standing there is not required (HD-40).
      location: 'kitchen',
      flags: {
        ...s.flags,
        ...factsForSurfaces('row-sansai', 'verb-cook', 'room-kitchen'),
      },
    };
  }

  it('spends sansai, feeds the belly, and mends ZERO HP (ADR-164/ADR-197 — food is satiety-only)', () => {
    const before = cookReady(10);
    const after = reduce(before, { type: 'cook_meal' });
    expect(after.resources.sansai).toBe(5 - balance.COOK_SANSAI_COST);
    expect(after.character.hp).toBe(10); // the severed mend — this FAILED while cook healed
    // the belly side (exact math, incl. the cap clamp) is body-split.test.ts's subject
    expect(after.character.hunger).toBeGreaterThanOrEqual(
      before.character.hunger,
    );
  });

  it('is a no-op without enough sansai, or while the verb is unrevealed', () => {
    const poor = cookReady(10, 1); // < COOK_SANSAI_COST
    expect(reduce(poor, { type: 'cook_meal' })).toBe(poor);

    const locked = { ...createInitialState(1), resources: { sansai: 9 } };
    expect(reduce(locked, { type: 'cook_meal' })).toBe(locked); // verb-cook not unlocked
  });
});

describe('F22 — work-stamina (rest) and health (treat) are DISTINCT recovery actions', () => {
  // The core FB-22 invariant: "rest from work" ≠ "recover from a fight". Two meters —
  // work-stamina (satiety) and health (hp) — each with its OWN recovery action, and NO single
  // action refills both. Health's action is the sickroom lane now (ADR-164/ADR-197 — cook fed
  // the belly and lost the mend). All fixtures derive their expected deltas from the balance
  // source of truth (SATIETY_PER_REST / TREAT_*), never a copied magic number.

  /** Hurt on BOTH meters, with the rest-loop live (awake+raked) and the cook verb revealed —
   *  standing AT the pot (ADR-184: cooking is sited), since the subject here is the two meters. */
  function hurtOnBoth(): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      // well below both maxes so a recovery has clear headroom (can go RED if it heals nothing)
      character: { ...s.character, hp: 5, satiety: 10 },
      resources: { ...s.resources, sansai: 5 },
      location: 'kitchen',
      flags: {
        ...s.flags,
        awake: true,
        raked: true,
        ...factsForSurfaces('row-sansai', 'verb-cook', 'room-kitchen'),
      },
    };
  }

  it('Rest a moment recovers WORK-STAMINA (satiety) but NOT health (hp)', () => {
    const s = hurtOnBoth();
    const after = reduce(s, { type: 'rest' });
    // work-stamina climbs by exactly the rest amount…
    expect(after.character.satiety).toBe(
      s.character.satiety + balance.SATIETY_PER_REST,
    );
    // …and health is untouched — rest is NOT a heal.
    expect(after.character.hp).toBe(s.character.hp);
  });

  it('Treatment recovers HEALTH (hp) but NOT work-stamina (satiety)', () => {
    const s = { ...hurtOnBoth(), location: 'sickroom' };
    const paid = {
      ...s,
      resources: { ...s.resources, coin: balance.TREAT_COST_MON },
    };
    const after = reduce(paid, { type: 'treat' });
    // health climbs by exactly the treatment amount…
    expect(after.character.hp).toBe(
      paid.character.hp + balance.TREAT_HP_RESTORE,
    );
    // …and work-stamina is untouched — a heal is NOT a work-rest.
    expect(after.character.satiety).toBe(paid.character.satiety);
  });

  it('the heal COSTS something — treat bills mon (D-076: no free/auto-heal; D-197: mon-only)', () => {
    const s = { ...hurtOnBoth(), location: 'sickroom' };
    const paid = {
      ...s,
      resources: { ...s.resources, coin: balance.TREAT_COST_MON },
    };
    const after = reduce(paid, { type: 'treat' });
    expect(after.resources.coin).toBe(0);
    expect(balance.TREAT_COST_MON).toBeGreaterThan(0);
    // the work-rest, by contrast, costs no resource — only time (ticks).
    const rested = reduce(s, { type: 'rest' });
    expect(rested.resources.sansai).toBe(s.resources.sansai);
  });
});

describe('D-164/D-197 — the sickroom mend lane: pay mon for speed, or spend days', () => {
  /** Hurt, standing at the sickroom, carrying `coin`. Deltas derive from balance.TREAT_* /
   *  REST_SICKROOM_HP (the source of truth), never copied magic numbers. */
  function atSickroom(coin: number, hp = 5): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      location: 'sickroom',
      character: { ...s.character, hp },
      resources: { ...s.resources, coin },
    };
  }

  it('treat debits TREAT_COST_MON and mends TREAT_HP_RESTORE, clamped at hpMax', () => {
    const s = atSickroom(balance.TREAT_COST_MON + 3);
    const after = reduce(s, { type: 'treat' });
    expect(after.resources.coin).toBe(3);
    expect(after.character.hp).toBe(5 + balance.TREAT_HP_RESTORE);

    const nearMax = atSickroom(
      balance.TREAT_COST_MON,
      hpMax(createInitialState(1)) - 1,
    );
    const clamped = reduce(nearMax, { type: 'treat' });
    expect(clamped.character.hp).toBe(hpMax(clamped)); // clamp, not overflow
  });

  it('treat is MON-ONLY (D-197): one mon short is a refusal, never a day billed instead', () => {
    const broke = atSickroom(balance.TREAT_COST_MON - 1);
    expect(reduce(broke, { type: 'treat' })).toBe(broke); // strict no-op — no silent day-cost
  });

  it('rest_sickroom is FREE and slow: +REST_SICKROOM_HP, the day spent, no coin touched', () => {
    const s = atSickroom(0);
    const after = reduce(s, { type: 'rest_sickroom' });
    expect(after.character.hp).toBe(5 + balance.REST_SICKROOM_HP);
    expect(after.resources.coin ?? 0).toBe(0);
    expect(after.clock.day).toBe(s.clock.day + 1); // a day given to the pallet
    expect(after.clock.tick).toBe(0); // …and you wake at dawn (the sleep math, ADR-187)
  });

  it('neither verb fires outside the sickroom, and neither at full HP (no idle farming)', () => {
    const elsewhere = {
      ...atSickroom(balance.TREAT_COST_MON),
      location: 'woodshed',
    };
    expect(reduce(elsewhere, { type: 'treat' })).toBe(elsewhere);
    expect(reduce(elsewhere, { type: 'rest_sickroom' })).toBe(elsewhere);
    const whole = atSickroom(
      balance.TREAT_COST_MON,
      hpMax(createInitialState(1)),
    );
    expect(reduce(whole, { type: 'treat' })).toBe(whole);
    expect(reduce(whole, { type: 'rest_sickroom' })).toBe(whole);
  });
});

describe('improve_estate — the coin → estateStage sink (audit #5 / D-107)', () => {
  function estateReady(coin: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      resources: { ...s.resources, coin },
      // ADR-177 — close the discovery chain (derived from the source of truth) so
      // each no-op case below tests ITS OWN gate, never masked by the works gate.
      flags: {
        ...s.flags,
        ...factsForSurfaces('panel-rung-ladder', 'panel-estate'),
        ...Object.fromEntries(WORKS_PROJECTS.map((p) => [p.openFlag, true])),
      },
    };
  }

  it('is a no-op before the discovery chain opens the stage (ADR-177 — coin alone buys nothing)', () => {
    const rich = createInitialState(1);
    const unopened: GameState = {
      ...rich,
      resources: { ...rich.resources, coin: 10_000 },
      // ADR-179 — panel-estate's fact (works-named-u1) only NAMES the stage; the works
      // OPEN flag stays unset, so the commissioning must still refuse.
      flags: {
        ...rich.flags,
        ...factsForSurfaces('panel-rung-ladder', 'panel-estate'),
      },
    };
    expect(reduce(unopened, { type: 'improve_estate' })).toBe(unopened);
  });

  it('commissions on coin + wood, completes through sited work, lifts satietyMax', () => {
    // ADR-177 F3 — projects are WORK: the commissioning pays the inputs; the stage
    // lands only after the sited work_project acts.
    const u1 = ESTATE_STAGES[0]!;
    let s: GameState = {
      ...estateReady(150),
      resources: {
        ...estateReady(150).resources,
        coin: 150,
        wood: u1.woodCost,
      },
    };
    const beforeMax = satietyMax(s);
    expect(estateSatietyBonus(s)).toBe(0);
    s = reduce(s, { type: 'improve_estate' });
    expect(s.estateCommission).toBe(1);
    expect(s.estateStage).toBe(0); // not yet — the work is ahead (RED if F3 dropped)
    expect(s.resources.coin).toBe(150 - u1.coinCost);
    expect(s.resources.wood ?? 0).toBe(0);
    s = { ...s, location: 'gate', character: { ...s.character, satiety: 999 } };
    for (let i = 0; i < u1.workActs; i++)
      s = reduce(s, { type: 'work_project' });
    expect(s.estateStage).toBe(1);
    expect(satietyMax(s)).toBe(beforeMax + u1.satietyMaxBonus);
  });

  it('is a no-op when too poor, when fully built out, or while the panel is unrevealed', () => {
    const poor = estateReady(ESTATE_STAGES[0]!.coinCost - 1);
    expect(reduce(poor, { type: 'improve_estate' })).toBe(poor);

    const maxed = { ...estateReady(10_000), estateStage: MAX_ESTATE_STAGE };
    expect(reduce(maxed, { type: 'improve_estate' })).toBe(maxed);

    const locked = { ...createInitialState(1), resources: { coin: 10_000 } };
    expect(reduce(locked, { type: 'improve_estate' })).toBe(locked); // panel-estate not unlocked
  });
});

describe('spend_attribute — attributePoints feed the 5 attributes (§4.6.1)', () => {
  function withPoints(n: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      character: { ...s.character, attributePoints: n, satiety: satietyMax(s) },
    };
  }

  it('STR feeds hpMax/defense/attackPower; each spend consumes a point', () => {
    const s = withPoints(3);
    const str = reduce(s, { type: 'spend_attribute', attr: 'str' });
    expect(str.character.attributePoints).toBe(2);
    expect(str.character.attrs.str).toBe(balance.ATTR_BASE + 1);
    // hpMax and defense are exact single-source functions of STR; attackPower rises (rounded).
    expect(hpMax(str)).toBe(hpMax(s) + balance.STR_HP);
    expect(mcCombatStats(str).defense).toBeCloseTo(
      mcCombatStats(s).defense + balance.STR_DEF_COEFF,
    );
    expect(mcCombatStats(str).attackPower).toBeGreaterThan(
      mcCombatStats(s).attackPower,
    );
  });

  it('AGI feeds accuracy + evasion; SPD feeds attackSpeed; LUCK feeds crit', () => {
    const s = withPoints(3);
    const agi = reduce(s, { type: 'spend_attribute', attr: 'agi' });
    expect(mcCombatStats(agi).accuracy).toBeCloseTo(
      mcCombatStats(s).accuracy + balance.AGI_ACC_COEFF,
    );
    expect(mcCombatStats(agi).evasion).toBeCloseTo(
      mcCombatStats(s).evasion + balance.AGI_EVA_COEFF,
    );

    const spd = reduce(s, { type: 'spend_attribute', attr: 'spd' });
    expect(mcCombatStats(spd).attackSpeed).toBeGreaterThan(
      mcCombatStats(s).attackSpeed,
    );

    const luck = reduce(s, { type: 'spend_attribute', attr: 'luck' });
    expect(mcCombatStats(luck).critChance).toBeCloseTo(
      mcCombatStats(s).critChance + balance.CRIT_LUCK_COEFF,
    );
  });

  it('INT lifts damage only vs a bestiary-KNOWN foe (non-dump)', () => {
    // 10 points into INT so the ±rounding cannot mask the multiplier.
    const s = withPoints(10);
    let leveled = s;
    for (let i = 0; i < 10; i++)
      leveled = reduce(leveled, { type: 'spend_attribute', attr: 'int' });
    expect(leveled.character.attrs.int).toBe(balance.ATTR_BASE + 10);
    // unknown foe → no bonus (foeKnown false === default); known foe → strictly more damage.
    expect(mcCombatStats(leveled, false).attackPower).toBe(
      mcCombatStats(s, false).attackPower,
    );
    expect(mcCombatStats(leveled, true).attackPower).toBeGreaterThan(
      mcCombatStats(leveled, false).attackPower,
    );
  });

  it('is a no-op with no points to spend', () => {
    const broke = withPoints(0);
    expect(reduce(broke, { type: 'spend_attribute', attr: 'str' })).toBe(broke);
  });

  it('base allocation derives its combat stats from the single-source constants', () => {
    // Base attrs (all ATTR_BASE) at L1 — attackPower/defense/hpMax fall straight out of the
    // §4.6.1 coefficients (RED-able: change a coefficient and this moves).
    const s = withPoints(0);
    const b = balance.ATTR_BASE;
    expect(mcCombatStats(s).attackPower).toBe(
      Math.round(
        getWeapon('carrying_pole').baseAttack + balance.STR_ATK_COEFF * b,
      ),
    );
    expect(mcCombatStats(s).defense).toBeCloseTo(balance.STR_DEF_COEFF * b);
    expect(hpMax(s)).toBe(
      balance.HP_BASE + balance.HP_PER_LEVEL + balance.STR_HP * b,
    );
  });
});

describe('persistence — the explicit character rebuild keeps the attribute build', () => {
  it('save round-trip preserves the 5-attribute build + estateStage', () => {
    const seed = createInitialState(1);
    const s: GameState = {
      ...seed,
      character: {
        ...seed.character,
        attrs: { str: 8, agi: 7, int: 6, spd: 9, luck: 5 },
      },
      estateStage: 2,
    };
    const round = validateState(JSON.parse(JSON.stringify(s)));
    expect(round.ok).toBe(true);
    if (round.ok) {
      expect(round.state.character.attrs).toEqual({
        str: 8,
        agi: 7,
        int: 6,
        spd: 9,
        luck: 5,
      });
      expect(round.state.estateStage).toBe(2);
    }
  });
});

// T0-M4-F3 — the tiny provisioning shop: a PERSONAL coin sink (ADR-099/ADR-107 — the player buys for his
// own needs, NOT the estate trading), held to a minority lane by the per-run stockCap (ADR-008).
describe('the tiny capped market (T0-M4-F3 / D-008)', () => {
  function withMarket(): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      // ADR-163: Yohei's stall is open only on his MARKET DAYS — sit the clock on one.
      clock: { ...s.clock, day: MARKET_DAY },
      resources: { ...s.resources, coin: 1000 },
      flags: { ...s.flags, ...factsForSurfaces('panel-estate') },
    };
  }

  it('buys a good (coin → resource) and is hard-capped per run', () => {
    const item = getItem('greens_sack'); // 10 coin → +3 sansai, stockCap 5
    let s = withMarket();
    const coin0 = s.resources.coin ?? 0;
    s = reduce(s, { type: 'buy_item', itemId: 'greens_sack' });
    expect(s.resources.coin ?? 0).toBe(coin0 - item.coinCost);
    expect(s.resources.sansai ?? 0).toBe(3);
    expect(s.marketBought['greens_sack']).toBe(1);

    for (let i = 1; i < item.stockCap; i++)
      s = reduce(s, { type: 'buy_item', itemId: 'greens_sack' });
    expect(s.marketBought['greens_sack']).toBe(item.stockCap);
    // over the cap → no-op (the minority-lane clamp holds however much coin you hoard)
    expect(reduce(s, { type: 'buy_item', itemId: 'greens_sack' })).toBe(s);
  });

  it('is gated on the estate economy (a no-op before panel-estate)', () => {
    const base = createInitialState(1);
    const s: GameState = {
      ...base,
      resources: { ...base.resources, coin: 1000 },
    };
    expect(reduce(s, { type: 'buy_item', itemId: 'greens_sack' })).toBe(s);
  });

  it('the buy line DENOMINATES the cost (D-108 — mon/monme/ryō, matching the pills)', () => {
    const item = getItem('greens_sack');
    const after = reduce(withMarket(), {
      type: 'buy_item',
      itemId: 'greens_sack',
    });
    const line =
      after.log.entries.find((e) => e.text.includes('barter'))?.text ?? '';
    expect(line).toContain(formatCoin(item.coinCost)); // the cost rendered as the pill renders it
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "barter N coin" raw-integer form
  });
});

describe('v0.3.1 Step 4 — coin sinks tighten the economy (D-086 scarcity / call 4)', () => {
  it('repair charges a coin FEE (the new sink) when you can pay it', () => {
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      flags: { ...base.flags, ...factsForSurfaces('verb-repair') },
      weaponDurability: 1, // worn
      resources: { ...base.resources, wood: 10, coin: 30 },
    };
    const after = reduce(ready, { type: 'repair_weapon' });
    expect(after.resources.wood ?? 0).toBe(10 - balance.REPAIR_WOOD_COST);
    expect(after.resources.coin ?? 0).toBe(30 - balance.REPAIR_COIN_COST); // ← the coin sink bites
    expect(after.weaponDurability).toBeGreaterThan(ready.weaponDurability); // repaired to max
    // ADR-108 — the repair fee is denominated (mon/monme/ryō) in the log, matching the pills.
    const line =
      after.log.entries.find((e) => e.text.includes('repair the'))?.text ?? '';
    expect(line).toContain(formatCoin(balance.REPAIR_COIN_COST)); // the fee, as the pill renders it
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "−N coin" raw-integer fee
  });

  it('the coin fee is WAIVED when you cannot pay — repair never softlocks (D-061/D-086)', () => {
    const base = createInitialState(1);
    const broke: GameState = {
      ...base,
      flags: { ...base.flags, ...factsForSurfaces('verb-repair') },
      weaponDurability: 1,
      resources: { ...base.resources, wood: 10, coin: 0 }, // wood, no coin
    };
    const after = reduce(broke, { type: 'repair_weapon' });
    expect(after.weaponDurability).toBeGreaterThan(broke.weaponDurability); // STILL repairs
    expect(after.resources.wood ?? 0).toBe(10 - balance.REPAIR_WOOD_COST); // wood spent
    expect(after.resources.coin ?? 0).toBe(0); // fee waived (nothing to take) — no stranding
  });

  it('the estate sink is DEEPER — ≥4 contiguous stages with strictly ascending coin costs', () => {
    expect(MAX_ESTATE_STAGE).toBeGreaterThanOrEqual(4); // U4 added (the deeper flywheel sink)
    ESTATE_STAGES.forEach((s, i) => {
      expect(s.stage).toBe(i + 1); // contiguous 1..N
      if (i > 0)
        expect(s.coinCost).toBeGreaterThan(ESTATE_STAGES[i - 1]!.coinCost); // ascending
    });
  });

  it('the market stays a MINORITY lane — total spend ≤ ⅓ of the estate sink (D-008)', () => {
    const marketMax = MARKET_ITEMS.reduce(
      (sum, m) => sum + m.coinCost * m.stockCap,
      0,
    );
    const estateTotal = ESTATE_STAGES.reduce((sum, s) => sum + s.coinCost, 0);
    // the market-depth add stays inside the ≤⅓ Estate-&-Wealth cap — a hard design invariant.
    expect(marketMax).toBeLessThanOrEqual(estateTotal / 3);
  });
});

// ── ADR-107 Phase 2 — the RICE LOOP (eat / store / sell). Rice becomes a REAL resource: a coin
// FAUCET (sell at the season price), a food path (eat → satiety), and a kura-sheltered store. Every
// fixture derives from the balance source of truth (riceSellPrice / EAT_RICE_* / LOSS_COIN_FRAC),
// never a copied magic number, and each assertion could go RED against the split. ──
describe('D-107 Phase 2 — sell_rice: the season-swinging coin faucet', () => {
  function seller(rice: number, seas: Season = 'spring'): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      season: seas, // season is STORED now (storywave G1), not derived from the day
      clock: { ...s.clock, day: MARKET_DAY }, // ADR-163: Yohei buys only on his market days
      banked: { ...s.banked, rice }, // ADR-163: rice lives in the KURA (shō), sold from there
      flags: { ...s.flags, ...factsForSurfaces('panel-estate') },
    };
  }

  it('converts kura rice to coin at the quoted sagging price (rice → coin, ADR-194)', () => {
    // 20 shō in dear spring sits inside Yohei's seed purse even after the ADR-194 sag, so he
    // clears the whole kura — the amounts derive from the ONE quote fn (AC-6), never a flat
    // price × shō product (the pre-merchant-state math this test used to pin).
    const s = seller(20); // season 'spring'
    expect(season(s)).toBe('spring');
    const quote = riceSellQuote(s);
    expect(quote.sho).toBe(20); // within his purse + above the curve floor → all of it sells
    const after = reduce(s, { type: 'sell_rice' });
    expect(after.banked.rice ?? 0).toBe(0); // all kura rice sold
    expect(after.resources.coin ?? 0).toBe(quote.coin); // exact — the executed trade IS the quote
  });

  it('the price fn SWINGS by season — dearest in spring, cheapest at the autumn glut', () => {
    // the DESIGN LEVER (the monotonic direction), not the exact magnitudes — derived from the table.
    const prices = SEASONS.map((s) => balance.riceSellPrice(s));
    expect(balance.riceSellPrice('autumn')).toBe(Math.min(...prices)); // autumn glut = the cheapest
    expect(balance.riceSellPrice('spring')).toBeGreaterThan(
      balance.riceSellPrice('autumn'),
    ); // spring dearer
  });

  it('the SAME rice earns MORE selling in dear spring than at the cheap autumn glut (the timing call)', () => {
    // a SMALL pile (10 shō) sits inside Yohei's purse in BOTH seasons, so the purse clamp doesn't
    // mask the price swing — the delta is purely the season price.
    const rice = 10;
    expect(riceSellQuote(seller(rice, 'spring')).sho).toBe(rice); // inside the purse both seasons
    const springCoin =
      reduce(seller(rice, 'spring'), { type: 'sell_rice' }).resources.coin ?? 0;
    // the SAME rice, sold in a DIFFERENT stored season — the timing choice the swing creates.
    const autumnCoin =
      reduce(seller(rice, 'autumn'), { type: 'sell_rice' }).resources.coin ?? 0;
    expect(springCoin).toBe(riceSellQuote(seller(rice, 'spring')).coin); // AC-6: trade == quote
    expect(autumnCoin).toBe(riceSellQuote(seller(rice, 'autumn')).coin);
    expect(springCoin).toBeGreaterThan(autumnCoin); // the swing is real ⇒ store-or-sell is a choice
  });

  it('is a no-op with no carried rice, or before the estate economy opens', () => {
    const noRice = seller(0);
    expect(reduce(noRice, { type: 'sell_rice' })).toBe(noRice);
    const base = createInitialState(1);
    const locked: GameState = {
      ...base,
      resources: { ...base.resources, rice: 50 },
    }; // no panel-estate
    expect(reduce(locked, { type: 'sell_rice' })).toBe(locked);
  });

  it('the sell line DENOMINATES the per-measure price + proceeds (D-108, matching the pills)', () => {
    // 20 shō at the spring price (a full purse) clears ≥1 monme of proceeds — the log shows the SAME
    // mon/monme/ryō rendering the coin pill uses, never a raw " coin" integer (ADR-108).
    const sold = 20;
    const s = seller(sold); // spring, a market day
    const quote = riceSellQuote(s); // ADR-194 — proceeds + headline price come from the quote
    expect(quote.sho).toBe(sold); // within his purse → all of it sells
    expect(quote.coin).toBeGreaterThanOrEqual(80); // ≥1 monme, so the denominated form is a monme readout
    const after = reduce(s, { type: 'sell_rice' });
    const line =
      after.log.entries.find((e) => e.text.includes('pedlar'))?.text ?? '';
    expect(line).toContain(formatCoin(quote.coin)); // e.g. "1 monme 24 mon" — the denominated proceeds
    expect(line).toContain(formatCoin(quote.unitNow)); // the headline per-measure price, denominated too
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "N coin the measure / +N coin" form
  });

  it('the coin faucet makes an early estate cost affordable (rice → coin → improve_estate)', () => {
    const u1 = ESTATE_STAGES[0]!.coinCost;
    // Derive the rice to clear U1 from the source of truth — the QUOTE now (ADR-194: the sag
    // means it's more shō than a flat u1/price). Scan up until one market visit covers it; the
    // design property is that ONE good visit CAN (his seed purse ≥ u1), so the scan terminates.
    expect(YOHEI_PURSE_MON).toBeGreaterThanOrEqual(u1);
    let riceNeeded = 1;
    while (riceNeeded < 500 && riceSellQuote(seller(riceNeeded)).coin < u1)
      riceNeeded += 1;
    expect(riceSellQuote(seller(riceNeeded)).coin).toBeGreaterThanOrEqual(u1); // the scan found it
    let s = seller(riceNeeded); // day 0 spring, panel-estate open
    expect(s.resources.coin ?? 0).toBeLessThan(u1); // starts unable to afford the first kura-works
    s = reduce(s, { type: 'sell_rice' });
    expect(s.resources.coin ?? 0).toBeGreaterThanOrEqual(u1); // the faucet crosses the cost
    const opened: GameState = {
      ...s,
      flags: { ...s.flags, [WORKS_PROJECTS[0]!.openFlag]: true }, // ADR-177 — chain closed
      resources: { ...s.resources, wood: ESTATE_STAGES[0]!.woodCost }, // F3 — the timber input
    };
    const built = reduce(opened, { type: 'improve_estate' });
    expect(built.estateCommission).toBe(1); // and the sink actually accepts the coin
    expect(built.resources.coin ?? 0).toBeLessThan(opened.resources.coin ?? 0);
  });
});

// ── ADR-194 — merchants get PERMANENT state: a real purse, real stock, sagging prices. The
// per-visit cap EMERGES from Yohei's purse (the H2 exploit: each sell used to draw a fresh
// 120-mon purse — an unbounded faucet); the marginal price sags with his stock and CAN reach
// 0 (human, 2026-07-14); market days drift him partway back (never a full reset). ──
describe('ADR-194 — merchant permanent state (purse, stock, the general-store curve)', () => {
  function seller(rice: number, seas: Season = 'spring'): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      season: seas,
      clock: { ...s.clock, day: MARKET_DAY },
      banked: { ...s.banked, rice },
      flags: { ...s.flags, ...factsForSurfaces('panel-estate') },
    };
  }

  it('N sells on ONE market day draw AT MOST his purse in total (the H2 exploit is dead)', () => {
    // A huge kura pile + repeated sells: pre-ADR-194 each call drew a fresh YOHEI_PURSE_MON,
    // so N calls paid N×120 — this assertion was RED on main, the proof the bug was real.
    let s = seller(500);
    for (let i = 0; i < 10; i++) s = reduce(s, { type: 'sell_rice' });
    expect(s.resources.coin ?? 0).toBeLessThanOrEqual(YOHEI_PURSE_MON);
    expect(s.merchants.yohei!.mon).toBe(
      YOHEI_PURSE_MON - (s.resources.coin ?? 0),
    ); // coin moved, never minted
  });

  it('the marginal offer is monotonically NON-INCREASING in his stock, and reaches 0', () => {
    // The design lever itself (the curve's mechanism), asserted across the whole relevant range —
    // and the human's 2026-07-14 ruling: stuffed full, he STOPS buying (0), not an asymptotic floor.
    const base = balance.riceSellPrice('spring');
    let prev = merchantOffer({ mon: 0, stock: {} }, 'rice', base);
    expect(prev).toBe(base); // an empty store pays the full season price
    for (let held = 1; held <= base * MERCHANT_SAG_STEP_SHO + 1; held++) {
      const p = merchantOffer({ mon: 0, stock: { rice: held } }, 'rice', base);
      expect(p).toBeLessThanOrEqual(prev);
      prev = p;
    }
    expect(prev).toBe(0); // the curve bottoms at REFUSAL, not a floor
  });

  it('a stocked-up pedlar QUOTES less — the sag is felt through the same quote the UI shows', () => {
    // Preload one full sag band of rice into his store: the very next shō already pays 1 mon
    // less than the season base — and the sale executes at those sagged prices (AC-6).
    const fresh = seller(10);
    const s: GameState = {
      ...fresh,
      merchants: {
        ...fresh.merchants,
        yohei: {
          ...fresh.merchants.yohei!,
          stock: { rice: MERCHANT_SAG_STEP_SHO },
        },
      },
    };
    const base = balance.riceSellPrice('spring');
    const quote = riceSellQuote(s);
    expect(quote.unitNow).toBe(base - 1); // the shown price has sagged
    expect(quote.coin).toBeLessThan(10 * base); // and the whole sale pays under the flat rate
    const after = reduce(s, { type: 'sell_rice' });
    expect((after.resources.coin ?? 0) - (s.resources.coin ?? 0)).toBe(
      quote.coin,
    );
  });

  it('the displayed offer IS the executed trade (AC-6 — one quote fn on both sides)', () => {
    const s = seller(40);
    const quote = riceSellQuote(s);
    const after = reduce(s, { type: 'sell_rice' });
    expect((after.resources.coin ?? 0) - (s.resources.coin ?? 0)).toBe(
      quote.coin,
    );
    expect((s.banked.rice ?? 0) - (after.banked.rice ?? 0)).toBe(quote.sho);
    // and the trade MUTATED him: purse debited, stock credited — permanent state, not a clamp.
    expect(after.merchants.yohei!.mon).toBe(quote.merchantMon - quote.coin);
    expect(after.merchants.yohei!.stock.rice).toBe(quote.sho);
  });

  it('a market day drifts him PARTWAY back — purse up, stock down, never a full reset', () => {
    // Drain his purse on one market day, then walk the clock to his NEXT market day: the
    // day-boundary restock recovers part of the gap (human, 2026-07-14: partial drift — a
    // Tuesday rice-dump still depresses Friday's price).
    let s = seller(500);
    s = reduce(s, { type: 'sell_rice' });
    const drained = s.merchants.yohei!;
    expect(drained.mon).toBeLessThan(YOHEI_PURSE_MON);
    expect(drained.stock.rice ?? 0).toBeGreaterThan(0);
    // find the NEXT market day strictly after today, then tick day by day up to it.
    let target = s.clock.day + 1;
    while (!isMarketDay(target)) target += 1;
    const arrived = tick(s, (target - s.clock.day) * TICKS_PER_DAY);
    const rested = arrived.merchants.yohei!;
    expect(rested.mon).toBeGreaterThan(drained.mon); // the purse recovered…
    expect(rested.mon).toBeLessThan(YOHEI_PURSE_MON); // …but NOT a full reset
    expect(rested.stock.rice ?? 0).toBeLessThan(drained.stock.rice ?? 0); // stock sold down…
    expect(rested.stock.rice ?? 0).toBeGreaterThan(0); // …but the dump still weighs on the price
  });

  it('an old (pre-v14) save hydrates the seeded roster; a saved merchant is KEPT (idempotent)', () => {
    // v(n)→v(n+1): a save written before `merchants` existed loads with Yohei seeded whole…
    const base = createInitialState(1);
    const { merchants: _dropped, ...old } = JSON.parse(
      JSON.stringify(base),
    ) as GameState & {
      merchants?: unknown;
    };
    const hydrated = validateState({ ...old, schemaVersion: 13 });
    expect(hydrated.ok).toBe(true);
    if (hydrated.ok)
      expect(hydrated.state.merchants).toEqual(initialMerchants());
    // …and a save that ALREADY carries merchant state keeps it verbatim (no double-grant).
    const traded: GameState = {
      ...base,
      merchants: { yohei: { mon: 7, stock: { rice: 33 } } },
    };
    const round = validateState(JSON.parse(JSON.stringify(traded)));
    expect(round.ok).toBe(true);
    if (round.ok)
      expect(round.state.merchants.yohei).toEqual({
        mon: 7,
        stock: { rice: 33 },
      });
  });

  it('a buy at his stall CREDITS his purse — the trade is two-sided', () => {
    const item = MARKET_ITEMS[0]!;
    const s: GameState = {
      ...seller(0),
      resources: { coin: item.coinCost },
    };
    const after = reduce(s, { type: 'buy_item', itemId: item.id });
    expect(after.merchants.yohei!.mon).toBe(YOHEI_PURSE_MON + item.coinCost);
  });
});

describe('D-107 Phase 2 / D-178 — eat_rice: the plain-rice BELLY path', () => {
  function eatReady(rice: number, hunger: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      character: { ...s.character, hunger },
      banked: { ...s.banked, rice }, // ADR-163: the meal is drawn from the KURA (shō)
      flags: {
        ...s.flags,
        ...factsForSurfaces('panel-estate', 'verb-eat-rice'),
      },
    };
  }

  it('spends kura rice and fills the BELLY (D-178: food never feeds the work bar), clamped at the cap', () => {
    const s = eatReady(10, 20);
    const after = reduce(s, { type: 'eat_rice' });
    expect(after.banked.rice).toBe(10 - balance.EAT_RICE_COST);
    expect(after.character.hunger).toBe(20 + balance.EAT_RICE_HUNGER);
    expect(after.character.satiety).toBe(s.character.satiety); // the FB-345 split

    const nearMax = eatReady(10, balance.HUNGER_MAX - 2);
    const clamped = reduce(nearMax, { type: 'eat_rice' });
    expect(clamped.character.hunger).toBe(balance.HUNGER_MAX); // clamp, not overflow
  });

  it('a deliberate meal RAISES what the daily ration only maintains (the design lever)', () => {
    expect(balance.EAT_RICE_HUNGER).toBeGreaterThan(
      balance.HUNGER_MEAL_RESTORE,
    );
  });

  it('is a no-op without enough rice, or while the verb is unrevealed', () => {
    const poor = eatReady(balance.EAT_RICE_COST - 1, 20);
    expect(reduce(poor, { type: 'eat_rice' })).toBe(poor);
    const base = createInitialState(1);
    const locked: GameState = {
      ...base,
      resources: { ...base.resources, rice: 10 },
    }; // verb-eat-rice locked
    expect(reduce(locked, { type: 'eat_rice' })).toBe(locked);
  });
});

describe('D-107 Phase 2 — the kura shelters RICE beside coin (deposit/withdraw round-trip)', () => {
  function atKura(rice: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      location: 'kura',
      resources: { ...s.resources, rice },
      flags: { ...s.flags, ...factsForSurfaces('panel-estate') },
    };
  }

  it('deposit sweeps carried rice into the bank; a rice WITHDRAW refuses LOUDLY (H3 — retired verb)', () => {
    // ADR-163 made rice one-way (it fills the kura and is spent from the store), so the old
    // round-trip is dead. The refusal must be LOUD: state untouched, a visible log line — RED
    // against both the old draw-it-back behavior and a silent no-op.
    let s = atKura(40);
    s = reduce(s, { type: 'deposit', resource: 'rice' });
    expect(s.resources.rice ?? 0).toBe(0); // carried swept
    expect(s.banked.rice ?? 0).toBe(40); // sheltered in the kura
    const after = reduce(s, { type: 'withdraw', resource: 'rice' });
    expect(after.banked.rice ?? 0).toBe(40); // the store is untouched
    expect(after.resources.rice ?? 0).toBe(0); // nothing drawn back out
    expect(after.log.entries.at(-1)?.contentKey).toBe(
      'bank.withdrawRefusedRice',
    ); // loud, not silent
  });

  it('the kura CAPS stored rice at kuraRiceCap(estateStage); a full kura deposits nothing (D-118 §1b)', () => {
    // the LEVER: only room UNDER the cap is deposited. Cap derived from the source of truth, never a
    // magic number — RED against the old uncapped deposit that swept the whole carried pile in.
    const cap = balance.kuraRiceCap(0); // U0 estate
    const over = cap + 50;
    let s = atKura(over);
    s = reduce(s, { type: 'deposit', resource: 'rice' });
    expect(s.banked.rice ?? 0).toBe(cap); // filled exactly to the wall, not past it
    expect(s.resources.rice ?? 0).toBe(over - cap); // the overflow stays carried
    // a full kura is a no-op (nothing more to store) — identity return.
    expect(reduce(s, { type: 'deposit', resource: 'rice' })).toBe(s);
    // improving the estate RAISES the wall, so more can be stored (the coin-sink reason to invest).
    expect(balance.kuraRiceCap(1)).toBeGreaterThan(cap);
  });

  it('a lost fight bleeds carried COIN but the kura-STORED rice is sheltered from the rout (D-113)', () => {
    // ADR-163: rice lives ONLY in the kura, so a rout can't touch the grain the way it bites carried
    // coin. Carried coin takes the LOSS_COIN_FRAC hit; the kura rice loses only the household's daily
    // MEAL over the lost sick-days (a few shō), NEVER the ~20% fractional rout.
    const base = atKura(0);
    const armed: GameState = {
      ...base,
      character: { ...base.character, level: 1, satiety: 100 },
      resources: { ...base.resources, coin: 100 }, // carried, at risk
      banked: { ...base.banked, rice: 500 }, // stored, sheltered
    };
    const ready = {
      ...armed,
      character: { ...armed.character, hp: hpMax(armed) },
    };
    const after = applyGrindFight(ready, 'bandit'); // L1 vs bandit ≈ 0.00 → a guaranteed loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    expect(after.resources.coin).toBe(
      100 - Math.round(100 * balance.LOSS_COIN_FRAC),
    ); // coin bitten
    // the kura rice loses at MOST the meals over the sick-days — strictly less than the 20% rout would.
    const maxMeals =
      balance.CONSUMPTION_SHO_PER_DAY * (balance.SICKROOM_DAYS_LOST + 3);
    const rout = Math.round(500 * balance.LOSS_COIN_FRAC); // what a rice-bleed WOULD have taken
    expect(500 - (after.banked.rice ?? 0)).toBeLessThanOrEqual(maxMeals); // only meals, not the rout
    expect(maxMeals).toBeLessThan(rout); // proves the two are distinguishable (this can go RED)
  });
});

describe('D-118 §1a — kura rice SPOILS on advance_season (holding costs something)', () => {
  // Storywave G1 + ADR-163: seasons are MANUAL, so spoilage fires in the season-EXIT pipeline
  // (`advance_season`). Rice lives ONLY in the kura now, so spoilage decays the BANKED pile alone —
  // there is no carried grain to rot. Fixtures derive the loss from riceSpoilage (source of truth),
  // so a broken or missing spoilage step flips these RED (against the old lossless kura).
  function withKura(banked: number): GameState {
    const s = createInitialState(1);
    // rung R2: the manual wheel is engine-refused below it (C1.4 — guards in season.test.ts);
    // this suite tests the SPOILAGE lever, so it stands on legal ground and pulls only that.
    return { ...s, rung: 'R2', banked: { ...s.banked, rice: banked } };
  }

  it('advance_season decays the KURA pile by exactly riceSpoilage(banked), leaving the rest', () => {
    // pick a pile big enough that the season's meal-draw can't be confused with spoilage — the
    // spoilage LEVER is the ≈10% bleed on a hoard (source-of-truth fraction > 0).
    const banked = 200;
    const before = withKura(banked);
    const after = reduce(before, { type: 'advance_season' });
    const spoil = balance.riceSpoilage(banked);
    expect(spoil).toBeGreaterThan(0);
    // the kura lost AT LEAST the spoilage (a background daily meal may draw a little more).
    expect(after.banked.rice ?? 0).toBeLessThanOrEqual(banked - spoil);
    // …but not catastrophically — the bleed is the spoilage plus at most a season's worth of meals.
    const maxMeals = balance.CONSUMPTION_SHO_PER_DAY * 4;
    expect(after.banked.rice ?? 0).toBeGreaterThanOrEqual(
      banked - spoil - maxMeals,
    );
    // and the wheel actually turned (the pipeline ran, not just the spoilage step).
    expect(after.seasonsPassed).toBe(1);
    // rice is never carried — the pocket stays empty across the turn.
    expect(after.resources.rice ?? 0).toBe(0);
  });

  it('a plain clock tick spoils nothing — the cost is per season-turn, not per-tick', () => {
    const after = tick(withKura(200), 1);
    expect(after.banked.rice).toBe(200);
  });
});

describe('v0.3.1 Step 5d — the load-bearing map node gates a richer yield (D-078)', () => {
  it('the deeper woodlot forage out-yields the near one on BOTH resources (the map earns its walk)', () => {
    const near = getActivity('forage_satoyama').yields;
    const deep = getActivity('forage_deepwoods').yields;
    // the design lever: walking one hill farther is STRICTLY richer per act — else the node is dead
    // breadth (battery #13). Derived from the activity defs, not copied magic numbers.
    expect(deep.sansai ?? 0).toBeGreaterThan(near.sansai ?? 0);
    expect(deep.coin ?? 0).toBeGreaterThan(near.coin ?? 0);
  });

  it('the deeper haul costs more to earn — it sits behind the danger ring at a higher satiety cost', () => {
    const near = getActivity('forage_satoyama');
    const deep = getActivity('forage_deepwoods');
    expect(deep.dangerRing).toBe(true); // gated by the conditioning ring, like its near sibling
    expect(deep.area).toBe('woodlot'); // G4: both forage acts run at the woodlot (the wild edge)
    expect(deep.satietyCost).toBeGreaterThan(near.satietyCost); // the richer haul taxes you more
  });
});

describe('activityForecast — forecast == reality (FB-264, AC-6)', () => {
  // The DEV hover card shows what one act WILL pay. These drive the REAL reducer and compare
  // deltas against the forecast — never re-deriving the multiplier math in the test — so either
  // side drifting from the shared selector goes RED.
  const hungry = (s: GameState): GameState => ({
    ...s,
    // deep inside the stamina throttle, but still able to PAY the act — at/below the
    // FB-265 floor the act refuses outright (0 = 0, trivially forecast == reality).
    character: { ...s.character, satiety: 4 },
  });
  const hurt = (s: GameState): GameState => ({
    ...s,
    character: { ...s.character, hp: 1 }, // under the low-HP work impairment (G3)
  });

  const paddyStates: [string, GameState][] = [
    ['fresh spring paddy', farmReady()],
    ['hungry (stamina throttle)', hungry(farmReady())],
    ['hurt (low-HP impairment)', hurt(farmReady())],
    [
      'autumn (harvest multiplier)',
      { ...farmReady(), season: 'autumn' as Season },
    ],
    ['skilled (yield multiplier)', addSkillXp(farmReady(), 'farming', 500)],
    [
      'worked-out pool',
      { ...farmReady(), sitePools: { ...farmReady().sitePools, paddies: 0 } },
    ],
  ];

  for (const [name, s] of paddyStates) {
    it(`matches the real do_activity payout — ${name}`, () => {
      const f = activityForecast(s, getActivity('farm_paddy'));
      const after = reduce(s, {
        type: 'do_activity',
        activityId: 'farm_paddy',
      });
      // rice is a kura commodity (ADR-163): the banked delta IS the payout
      expect((after.banked.rice ?? 0) - (s.banked.rice ?? 0)).toBe(
        f.gained.rice ?? 0,
      );
      expect((after.skillXp.farming ?? 0) - (s.skillXp.farming ?? 0)).toBe(
        f.xp,
      );
      expect((s.sitePools.paddies ?? 0) - (after.sitePools.paddies ?? 0)).toBe(
        f.rawDraw,
      );
    });
  }

  it('matches carried-pocket yields too (haul_stores coin)', () => {
    const base = createInitialState(SEASON_SPRING_SAFE);
    const s: GameState = {
      ...base,
      location: 'forecourt',
      character: { ...base.character, satiety: satietyMax(base) },
      flags: { ...base.flags, ...factsForSurfaces('verb-haul') },
    };
    const f = activityForecast(s, getActivity('haul_stores'));
    const after = reduce(s, { type: 'do_activity', activityId: 'haul_stores' });
    expect((after.resources.coin ?? 0) - (s.resources.coin ?? 0)).toBe(
      f.gained.coin ?? 0,
    );
    expect(
      (after.skillXp.conditioning ?? 0) - (s.skillXp.conditioning ?? 0),
    ).toBe(f.xp);
  });

  it('is a pure read — forecasting never spends the pool or the body', () => {
    const s = farmReady();
    const snapshot = JSON.stringify(s);
    activityForecast(s, getActivity('farm_paddy'));
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

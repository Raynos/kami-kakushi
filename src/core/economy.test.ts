import { describe, it, expect } from 'vitest';
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
  satietyMax,
  season,
  estateSatietyBonus,
  estateYieldNum,
  getItem,
  applyGrindFight,
  formatCoin,
  MAX_ESTATE_STAGE,
  ESTATE_STAGES,
  MARKET_ITEMS,
  DAYS_PER_SEASON,
  TICKS_PER_DAY,
  SEASONS,
  tick,
  balance,
  introActive,
  introSceneAt,
  RUNG_BEATS,
  type GameState,
  rungRequirements,
  isRequirementDone,
} from './index';
import { validateState } from '../persistence/validate';

// ADR-110: promotion is a player-TRIGGERED beat now. These local helpers drive the real path — finish
// the intro's VN scenes, then trigger + complete a ready rung beat.
function finishIntro(s: GameState): GameState {
  while (introActive(s.introBeat)) {
    const sc = introSceneAt(s.introBeat)!;
    s = reduce(s, { type: 'choose_intro', optionId: sc.decision.options[0]!.id });
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

/** A fresh state with the labour verb latched + full satiety (rate = 1, no throttle). */
function farmReady(seed = SEASON_SPRING_SAFE): GameState {
  const s = createInitialState(seed);
  return {
    ...s,
    // v0.3.1 Step 5: farm_paddy is SPATIAL — it only runs at its 'home-paddies' node.
    location: 'home-paddies',
    character: { ...s.character, satiety: satietyMax(s) },
    unlocked: [...s.unlocked, 'verb-farm'],
  };
}

function farmYield(s: GameState): number {
  // farm_paddy now yields RICE (ADR-107) — the honest noun for working the paddies.
  const before = s.resources.rice ?? 0;
  const after = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
  return (after.resources.rice ?? 0) - before;
}

describe('skill → yield multiplier (audit #4)', () => {
  it('is ×1.00 at L1 (byte-identical to v0.1), reaches the ×3.0 cap, and never decreases', () => {
    expect(skillYieldNum(1)).toBe(balance.SKILL_YIELD_DEN); // 100 → ×1.00
    expect(skillYieldNum(51)).toBe(balance.SKILL_YIELD_DEN + balance.SKILL_YIELD_CAP_NUM); // 300 → ×3.0
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
    expect(baseKoku).toBe(4); // home-paddy base yield, unchanged at skill L1

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
    expect(farmYield({ ...e0, estateStage: MAX_ESTATE_STAGE })).toBeGreaterThan(baseKoku);
  });

  it('rung pacing is independent of skill — requirement counts move per-ACT, not per-yield', () => {
    let atR1 = finishIntro(reduce(createInitialState(SEASON_SPRING_SAFE), { type: 'open_eyes' }));
    // FB-121: derive the rake count from the R0 registry (never a frozen literal);
    // staged same-token reqs complete cumulatively, so the climb is the MAX target.
    const rakesToR1 = Math.max(
      ...rungRequirements('R0')
        .filter((r) => r.type === 'count')
        .map((r) => (r.type === 'count' ? r.target : 0)),
    );
    for (let i = 0; i < rakesToR1; i++) atR1 = reduce(atR1, { type: 'rake_rice' });
    atR1 = playBeat(atR1); // R0 → R1 via the story beat (ADR-110)
    expect(atR1.rung).toBe('R1');

    const CAP = 5000;
    // Count the farm acts that COMPLETE R1's farm requirement (the design lever: a count
    // requirement ticks once per act, never per yield — skill can't shrink the climb).
    // the TERMINAL farm stage (staged same-token reqs — take the max target)
    const farmReq = rungRequirements('R1')
      .filter((r) => r.type === 'count' && r.token === 'act:farm_paddy')
      .sort(
        (a, b) => (b.type === 'count' ? b.target : 0) - (a.type === 'count' ? a.target : 0),
      )[0]!;
    const actsToFarmDone = (start: GameState): number => {
      // v0.3.1 Step 5: farm_paddy is spatial — grind at its 'home-paddies' node.
      let s: GameState = { ...start, location: 'home-paddies' };
      let n = 0;
      while (!isRequirementDone(farmReq, s.rungReqs) && n < CAP) {
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

describe('cook_meal — the sansai → HP heal sink (F22 / D-050)', () => {
  // FB-22: cook is the HEALTH-recovery action — it mends HP and does NOT touch work-stamina
  // (satiety). See the FB-22 distinctness block below for the "one action must not refill both".
  function cookReady(hp: number, sansai = 5): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      character: { ...s.character, hp },
      resources: { ...s.resources, sansai },
      unlocked: [...s.unlocked, 'row-sansai', 'verb-cook'],
    };
  }

  it('spends sansai and mends HP, clamped at hpMax (never above)', () => {
    const after = reduce(cookReady(10), { type: 'cook_meal' });
    expect(after.resources.sansai).toBe(5 - balance.COOK_SANSAI_COST);
    expect(after.character.hp).toBe(10 + balance.COOK_HP_RESTORE);

    const nearMax = cookReady(hpMax(createInitialState(1)) - 5);
    const clamped = reduce(nearMax, { type: 'cook_meal' });
    expect(clamped.character.hp).toBe(hpMax(clamped)); // clamp, not overflow
    expect(clamped.character.hp).toBeLessThanOrEqual(hpMax(clamped));
  });

  it('is a no-op without enough sansai, or while the verb is unrevealed', () => {
    const poor = cookReady(10, 1); // < COOK_SANSAI_COST
    expect(reduce(poor, { type: 'cook_meal' })).toBe(poor);

    const locked = { ...createInitialState(1), resources: { sansai: 9 } };
    expect(reduce(locked, { type: 'cook_meal' })).toBe(locked); // verb-cook not unlocked
  });
});

describe('F22 — work-stamina (rest) and health (cook) are DISTINCT recovery actions', () => {
  // The core FB-22 invariant: "rest from work" ≠ "recover from a fight". Two meters —
  // work-stamina (satiety) and health (hp) — each with its OWN recovery action, and NO single
  // action refills both. All fixtures derive their expected deltas from the balance source of
  // truth (SATIETY_PER_REST / COOK_HP_RESTORE / COOK_SANSAI_COST), never a copied magic number.

  /** Hurt on BOTH meters, with the rest-loop live (awake+raked) and the cook verb revealed. */
  function hurtOnBoth(): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      // well below both maxes so a recovery has clear headroom (can go RED if it heals nothing)
      character: { ...s.character, hp: 5, satiety: 10 },
      resources: { ...s.resources, sansai: 5 },
      flags: { ...s.flags, awake: true, raked: true },
      unlocked: [...s.unlocked, 'row-sansai', 'verb-cook'],
    };
  }

  it('Rest a moment recovers WORK-STAMINA (satiety) but NOT health (hp)', () => {
    const s = hurtOnBoth();
    const after = reduce(s, { type: 'rest' });
    // work-stamina climbs by exactly the rest amount…
    expect(after.character.satiety).toBe(s.character.satiety + balance.SATIETY_PER_REST);
    // …and health is untouched — rest is NOT a heal.
    expect(after.character.hp).toBe(s.character.hp);
  });

  it('Cook a meal recovers HEALTH (hp) but NOT work-stamina (satiety)', () => {
    const s = hurtOnBoth();
    const after = reduce(s, { type: 'cook_meal' });
    // health climbs by exactly the heal amount…
    expect(after.character.hp).toBe(s.character.hp + balance.COOK_HP_RESTORE);
    // …and work-stamina is untouched — a heal is NOT a work-rest.
    expect(after.character.satiety).toBe(s.character.satiety);
  });

  it('the heal COSTS something — cook spends sansai (D-076: no free/auto-heal)', () => {
    const s = hurtOnBoth();
    const after = reduce(s, { type: 'cook_meal' });
    expect(after.resources.sansai).toBe((s.resources.sansai ?? 0) - balance.COOK_SANSAI_COST);
    expect(balance.COOK_SANSAI_COST).toBeGreaterThan(0);
    // the work-rest, by contrast, costs no resource — only time (ticks).
    const rested = reduce(s, { type: 'rest' });
    expect(rested.resources.sansai).toBe(s.resources.sansai);
  });
});

describe('improve_estate — the coin → estateStage sink (audit #5 / D-107)', () => {
  function estateReady(coin: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      resources: { ...s.resources, coin },
      unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate'],
    };
  }

  it('spends coin, advances the stage, and lifts satietyMax by the stage bonus', () => {
    const s = estateReady(150);
    const beforeMax = satietyMax(s);
    expect(estateSatietyBonus(s)).toBe(0);
    const after = reduce(s, { type: 'improve_estate' });
    expect(after.estateStage).toBe(1);
    expect(after.resources.coin).toBe(150 - ESTATE_STAGES[0]!.coinCost);
    expect(satietyMax(after)).toBe(beforeMax + ESTATE_STAGES[0]!.satietyMaxBonus);
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
    return { ...s, character: { ...s.character, attributePoints: n, satiety: satietyMax(s) } };
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
    expect(mcCombatStats(str).attackPower).toBeGreaterThan(mcCombatStats(s).attackPower);
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
    expect(mcCombatStats(spd).attackSpeed).toBeGreaterThan(mcCombatStats(s).attackSpeed);

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
    expect(mcCombatStats(leveled, false).attackPower).toBe(mcCombatStats(s, false).attackPower);
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
      Math.round(getWeapon('carrying_pole').baseAttack + balance.STR_ATK_COEFF * b),
    );
    expect(mcCombatStats(s).defense).toBeCloseTo(balance.STR_DEF_COEFF * b);
    expect(hpMax(s)).toBe(balance.HP_BASE + balance.HP_PER_LEVEL + balance.STR_HP * b);
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
      expect(round.state.character.attrs).toEqual({ str: 8, agi: 7, int: 6, spd: 9, luck: 5 });
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
      resources: { ...s.resources, coin: 1000 },
      unlocked: [...s.unlocked, 'panel-estate'],
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
    const s: GameState = { ...base, resources: { ...base.resources, coin: 1000 } };
    expect(reduce(s, { type: 'buy_item', itemId: 'greens_sack' })).toBe(s);
  });

  it('the buy line DENOMINATES the cost (D-108 — mon/monme/ryō, matching the pills)', () => {
    const item = getItem('greens_sack');
    const after = reduce(withMarket(), { type: 'buy_item', itemId: 'greens_sack' });
    const line = after.log.entries.find((e) => e.text.includes('barter'))?.text ?? '';
    expect(line).toContain(formatCoin(item.coinCost)); // the cost rendered as the pill renders it
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "barter N coin" raw-integer form
  });
});

describe('v0.3.1 Step 4 — coin sinks tighten the economy (D-086 scarcity / call 4)', () => {
  it('repair charges a coin FEE (the new sink) when you can pay it', () => {
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      unlocked: [...base.unlocked, 'verb-repair'],
      weaponDurability: 1, // worn
      resources: { ...base.resources, wood: 10, coin: 30 },
    };
    const after = reduce(ready, { type: 'repair_weapon' });
    expect(after.resources.wood ?? 0).toBe(10 - balance.REPAIR_WOOD_COST);
    expect(after.resources.coin ?? 0).toBe(30 - balance.REPAIR_COIN_COST); // ← the coin sink bites
    expect(after.weaponDurability).toBeGreaterThan(ready.weaponDurability); // repaired to max
    // ADR-108 — the repair fee is denominated (mon/monme/ryō) in the log, matching the pills.
    const line = after.log.entries.find((e) => e.text.includes('repair the'))?.text ?? '';
    expect(line).toContain(formatCoin(balance.REPAIR_COIN_COST)); // the fee, as the pill renders it
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "−N coin" raw-integer fee
  });

  it('the coin fee is WAIVED when you cannot pay — repair never softlocks (D-061/D-086)', () => {
    const base = createInitialState(1);
    const broke: GameState = {
      ...base,
      unlocked: [...base.unlocked, 'verb-repair'],
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
      if (i > 0) expect(s.coinCost).toBeGreaterThan(ESTATE_STAGES[i - 1]!.coinCost); // ascending
    });
  });

  it('the market stays a MINORITY lane — total spend ≤ ⅓ of the estate sink (D-008)', () => {
    const marketMax = MARKET_ITEMS.reduce((sum, m) => sum + m.coinCost * m.stockCap, 0);
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
  function seller(rice: number, day = 0): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      clock: { ...s.clock, day },
      resources: { ...s.resources, rice },
      unlocked: [...s.unlocked, 'panel-estate'],
    };
  }

  it('converts ALL carried rice to coin at the current season price (rice → coin)', () => {
    const s = seller(20); // day 0 → spring
    expect(season(s)).toBe('spring');
    const price = balance.riceSellPrice('spring');
    const after = reduce(s, { type: 'sell_rice' });
    expect(after.resources.rice ?? 0).toBe(0); // all carried rice sold
    expect(after.resources.coin ?? 0).toBe(20 * price); // exact, from the source-of-truth price
  });

  it('the price fn SWINGS by season — dearest in spring, cheapest at the autumn glut', () => {
    // the DESIGN LEVER (the monotonic direction), not the exact magnitudes — derived from the table.
    const prices = SEASONS.map((s) => balance.riceSellPrice(s));
    expect(balance.riceSellPrice('autumn')).toBe(Math.min(...prices)); // autumn glut = the cheapest
    expect(balance.riceSellPrice('spring')).toBeGreaterThan(balance.riceSellPrice('autumn')); // spring dearer
  });

  it('the SAME rice earns MORE selling in dear spring than at the cheap autumn glut (the timing call)', () => {
    const rice = 30;
    const springCoin = reduce(seller(rice, 0), { type: 'sell_rice' }).resources.coin ?? 0;
    // day = 2·DAYS_PER_SEASON lands in autumn (spring, summer, AUTUMN, winter) — SAME rice, different coin.
    const autumnCoin =
      reduce(seller(rice, 2 * DAYS_PER_SEASON), { type: 'sell_rice' }).resources.coin ?? 0;
    expect(springCoin).toBe(rice * balance.riceSellPrice('spring'));
    expect(autumnCoin).toBe(rice * balance.riceSellPrice('autumn'));
    expect(springCoin).toBeGreaterThan(autumnCoin); // the swing is real ⇒ store-or-sell is a choice
  });

  it('is a no-op with no carried rice, or before the estate economy opens', () => {
    const noRice = seller(0);
    expect(reduce(noRice, { type: 'sell_rice' })).toBe(noRice);
    const base = createInitialState(1);
    const locked: GameState = { ...base, resources: { ...base.resources, rice: 50 } }; // no panel-estate
    expect(reduce(locked, { type: 'sell_rice' })).toBe(locked);
  });

  it('the sell line DENOMINATES the per-measure price + proceeds (D-108, matching the pills)', () => {
    // 100 rice at the spring price clears ≥1 monme of proceeds — the log shows the SAME mon/monme/ryō
    // rendering the coin pill uses, never a raw " coin" integer (the ADR-108 same-transaction mismatch).
    const s = seller(100); // day 0 → spring
    const price = balance.riceSellPrice('spring');
    const proceeds = 100 * price;
    expect(proceeds).toBeGreaterThanOrEqual(80); // ≥1 monme, so the denominated form is a monme readout
    const after = reduce(s, { type: 'sell_rice' });
    const line = after.log.entries.find((e) => e.text.includes('pedlar'))?.text ?? '';
    expect(line).toContain(formatCoin(proceeds)); // e.g. "7 monme 40 mon" — the denominated proceeds
    expect(line).toContain(formatCoin(price)); // the per-measure price, denominated too
    expect(line).not.toMatch(/\d+ coin/); // RED against the old "N coin the measure / +N coin" form
  });

  it('the coin faucet makes an early estate cost affordable (rice → coin → improve_estate)', () => {
    const price = balance.riceSellPrice('spring');
    const u1 = ESTATE_STAGES[0]!.coinCost;
    const riceNeeded = Math.ceil(u1 / price); // derive the rice to clear U1 from the source of truth
    let s = seller(riceNeeded); // day 0 spring, panel-estate open
    expect(s.resources.coin ?? 0).toBeLessThan(u1); // starts unable to afford the first kura-works
    s = reduce(s, { type: 'sell_rice' });
    expect(s.resources.coin ?? 0).toBeGreaterThanOrEqual(u1); // the faucet crosses the cost
    const built = reduce(s, { type: 'improve_estate' });
    expect(built.estateStage).toBe(1); // and the sink actually accepts the coin
  });
});

describe('D-107 Phase 2 — eat_rice: the plain-rice satiety path', () => {
  function eatReady(rice: number, satiety: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      character: { ...s.character, satiety },
      resources: { ...s.resources, rice },
      unlocked: [...s.unlocked, 'panel-estate', 'verb-eat-rice'],
    };
  }

  it('spends rice and restores work-stamina (satiety), clamped at satietyMax', () => {
    const s = eatReady(10, 20);
    const after = reduce(s, { type: 'eat_rice' });
    expect(after.resources.rice).toBe(10 - balance.EAT_RICE_COST);
    expect(after.character.satiety).toBe(20 + balance.EAT_RICE_SATIETY);

    const nearMax = eatReady(10, satietyMax(createInitialState(1)) - 2);
    const clamped = reduce(nearMax, { type: 'eat_rice' });
    expect(clamped.character.satiety).toBe(satietyMax(clamped)); // clamp, not overflow
  });

  it('a proper meal refuels MORE than a free rest (the design lever — never a dominated action)', () => {
    expect(balance.EAT_RICE_SATIETY).toBeGreaterThan(balance.SATIETY_PER_REST);
  });

  it('is a no-op without enough rice, or while the verb is unrevealed', () => {
    const poor = eatReady(balance.EAT_RICE_COST - 1, 20);
    expect(reduce(poor, { type: 'eat_rice' })).toBe(poor);
    const base = createInitialState(1);
    const locked: GameState = { ...base, resources: { ...base.resources, rice: 10 } }; // verb-eat-rice locked
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
      unlocked: [...s.unlocked, 'panel-estate'],
    };
  }

  it('deposit sweeps carried rice into the bank; withdraw draws it back (a full round-trip)', () => {
    let s = atKura(40);
    s = reduce(s, { type: 'deposit', resource: 'rice' });
    expect(s.resources.rice ?? 0).toBe(0); // carried swept
    expect(s.banked.rice ?? 0).toBe(40); // sheltered in the kura
    s = reduce(s, { type: 'withdraw', resource: 'rice' });
    expect(s.resources.rice ?? 0).toBe(40); // drawn back out
    expect(s.banked.rice ?? 0).toBe(0);
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

  it('a lost fight bleeds carried rice but the kura-STORED rice is sheltered (D-113)', () => {
    const base = atKura(0);
    const armed: GameState = {
      ...base,
      character: { ...base.character, level: 1, satiety: 100 },
      resources: { ...base.resources, rice: 100 }, // carried, at risk
      banked: { ...base.banked, rice: 50 }, // stored, safe
    };
    const ready = { ...armed, character: { ...armed.character, hp: hpMax(armed) } };
    const after = applyGrindFight(ready, 'bandit'); // L1 vs bandit ≈ 0.00 → a guaranteed loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    expect(after.resources.rice).toBe(100 - Math.round(100 * balance.LOSS_COIN_FRAC)); // carried bitten
    expect(after.banked.rice).toBe(50); // stored rice untouched — the shelter holds
  });
});

describe('D-118 §1a — rice SPOILS on a season turn, carried AND banked (holding costs something)', () => {
  // Park the clock one tick short of a season boundary, then advance ONE tick across it so exactly
  // one season turn fires. Fixtures derive the loss from riceSpoilage (source of truth), so a broken
  // or missing spoilage step flips these RED (against the old free/lossless kura).
  function eveOfSeason(carried: number, banked: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      // last tick of the last day of season 0 → the next tick rolls day → DAYS_PER_SEASON (a turn).
      clock: { tick: TICKS_PER_DAY - 1, day: DAYS_PER_SEASON - 1 },
      resources: { ...s.resources, rice: carried },
      banked: { ...s.banked, rice: banked },
    };
  }

  it('a season turn decays BOTH piles by exactly riceSpoilage(each), leaving the rest', () => {
    const carried = 100;
    const banked = 200;
    const after = tick(eveOfSeason(carried, banked), 1); // cross exactly one season boundary
    expect(after.resources.rice).toBe(carried - balance.riceSpoilage(carried));
    expect(after.banked.rice).toBe(banked - balance.riceSpoilage(banked));
    // the LEVER is a real bleed on a hoard (source-of-truth fraction > 0 for these piles).
    expect(balance.riceSpoilage(carried)).toBeGreaterThan(0);
    expect(balance.riceSpoilage(banked)).toBeGreaterThan(0);
  });

  it('mid-season (no boundary crossed) spoils nothing — the cost is per-season, not per-tick', () => {
    const s = { ...eveOfSeason(100, 200), clock: { tick: 0, day: 1 } }; // deep inside season 0
    const after = tick(s, 1);
    expect(after.resources.rice).toBe(100);
    expect(after.banked.rice).toBe(200);
  });
});

describe('v0.3.1 Step 5d — the load-bearing map node gates a richer yield (D-078)', () => {
  it('the deep satoyama forage out-yields the near one on BOTH resources (the map earns its walk)', () => {
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
    expect(deep.area).toBe('deep-satoyama'); // a DIFFERENT node — you walk there
    expect(deep.satietyCost).toBeGreaterThan(near.satietyCost); // the richer haul taxes you more
  });
});

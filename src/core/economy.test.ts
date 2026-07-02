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
  estateSatietyBonus,
  estateYieldNum,
  getItem,
  MAX_ESTATE_STAGE,
  ESTATE_STAGES,
  MARKET_ITEMS,
  balance,
  type GameState,
} from './index';
import { validateState } from '../persistence/validate';

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
  const before = s.resources.koku ?? 0;
  const after = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
  return (after.resources.koku ?? 0) - before;
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
      const koku = farmYield(atStage);
      expect(koku).toBeGreaterThanOrEqual(prev);
      prev = koku;
    }
    // end-to-end the flywheel has real teeth: the top stage out-yields foreclosure's edge.
    expect(farmYield({ ...e0, estateStage: MAX_ESTATE_STAGE })).toBeGreaterThan(baseKoku);
  });

  it('rung pacing is independent of skill — acts-to-promote do not shrink as yield grows', () => {
    let atR1 = reduce(createInitialState(SEASON_SPRING_SAFE), { type: 'open_eyes' });
    // D-056 single profile: derive the rake count from the real R0 threshold (flat pts/act).
    const rakesToR1 = Math.ceil(balance.rungThreshold('R0') / balance.RUNG_POINTS_PER_ACT);
    for (let i = 0; i < rakesToR1; i++) atR1 = reduce(atR1, { type: 'rake_rice' }); // R0 → R1
    expect(atR1.rung).toBe('R1');

    const CAP = 5000;
    const actsToR2 = (start: GameState): number => {
      // v0.3.1 Step 5: farm_paddy is spatial — grind at its 'home-paddies' node.
      let s: GameState = { ...start, location: 'home-paddies' };
      let n = 0;
      while (s.rung === 'R1' && n < CAP) {
        s = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
        n++;
      }
      return n;
    };
    const low = actsToR2(atR1);
    const high = actsToR2(addSkillXp(atR1, 'farming', 100_000));
    expect(low).toBeLessThan(CAP); // we actually reached R2, not the guard cap
    expect(low).toBe(high); // RUNG_POINTS_PER_ACT is per-act, not per-koku — skill doesn't shrink it
  });
});

describe('cook_meal — the sansai → HP heal sink (F22 / D-050)', () => {
  // F22: cook is the HEALTH-recovery action — it mends HP and does NOT touch work-stamina
  // (satiety). See the F22 distinctness block below for the "one action must not refill both".
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
  // The core F22 invariant: "rest from work" ≠ "recover from a fight". Two meters —
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

describe('improve_estate — the koku → estateStage sink (audit #5)', () => {
  function estateReady(koku: number): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      resources: { ...s.resources, koku },
      unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate'],
    };
  }

  it('spends koku, advances the stage, and lifts satietyMax by the stage bonus', () => {
    const s = estateReady(150);
    const beforeMax = satietyMax(s);
    expect(estateSatietyBonus(s)).toBe(0);
    const after = reduce(s, { type: 'improve_estate' });
    expect(after.estateStage).toBe(1);
    expect(after.resources.koku).toBe(150 - ESTATE_STAGES[0]!.kokuCost);
    expect(satietyMax(after)).toBe(beforeMax + ESTATE_STAGES[0]!.satietyMaxBonus);
  });

  it('is a no-op when too poor, when fully built out, or while the panel is unrevealed', () => {
    const poor = estateReady(ESTATE_STAGES[0]!.kokuCost - 1);
    expect(reduce(poor, { type: 'improve_estate' })).toBe(poor);

    const maxed = { ...estateReady(10_000), estateStage: MAX_ESTATE_STAGE };
    expect(reduce(maxed, { type: 'improve_estate' })).toBe(maxed);

    const locked = { ...createInitialState(1), resources: { koku: 10_000 } };
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

// T0-M4-F3 — the tiny provisioning shop: a PERSONAL koku sink (D-099 — the player buys for his
// own needs, NOT the estate trading), held to a minority lane by the per-run stockCap (D-008).
describe('the tiny capped market (T0-M4-F3 / D-008)', () => {
  function withMarket(): GameState {
    const s = createInitialState(1);
    return {
      ...s,
      resources: { ...s.resources, koku: 1000 },
      unlocked: [...s.unlocked, 'panel-estate'],
    };
  }

  it('buys a good (koku → resource) and is hard-capped per run', () => {
    const item = getItem('greens_sack'); // 10 koku → +3 sansai, stockCap 5
    let s = withMarket();
    const koku0 = s.resources.koku ?? 0;
    s = reduce(s, { type: 'buy_item', itemId: 'greens_sack' });
    expect(s.resources.koku ?? 0).toBe(koku0 - item.kokuCost);
    expect(s.resources.sansai ?? 0).toBe(3);
    expect(s.marketBought['greens_sack']).toBe(1);

    for (let i = 1; i < item.stockCap; i++)
      s = reduce(s, { type: 'buy_item', itemId: 'greens_sack' });
    expect(s.marketBought['greens_sack']).toBe(item.stockCap);
    // over the cap → no-op (the minority-lane clamp holds however much koku you hoard)
    expect(reduce(s, { type: 'buy_item', itemId: 'greens_sack' })).toBe(s);
  });

  it('is gated on the estate economy (a no-op before panel-estate)', () => {
    const base = createInitialState(1);
    const s: GameState = { ...base, resources: { ...base.resources, koku: 1000 } };
    expect(reduce(s, { type: 'buy_item', itemId: 'greens_sack' })).toBe(s);
  });
});

describe('v0.3.1 Step 4 — koku sinks tighten the economy (D-086 scarcity / call 4)', () => {
  it('repair charges a koku FEE (the new sink) when you can pay it', () => {
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      unlocked: [...base.unlocked, 'verb-repair'],
      weaponDurability: 1, // worn
      resources: { ...base.resources, wood: 10, koku: 30 },
    };
    const after = reduce(ready, { type: 'repair_weapon' });
    expect(after.resources.wood ?? 0).toBe(10 - balance.REPAIR_WOOD_COST);
    expect(after.resources.koku ?? 0).toBe(30 - balance.REPAIR_KOKU_COST); // ← the koku sink bites
    expect(after.weaponDurability).toBeGreaterThan(ready.weaponDurability); // repaired to max
  });

  it('the koku fee is WAIVED when you cannot pay — repair never softlocks (D-061/D-086)', () => {
    const base = createInitialState(1);
    const broke: GameState = {
      ...base,
      unlocked: [...base.unlocked, 'verb-repair'],
      weaponDurability: 1,
      resources: { ...base.resources, wood: 10, koku: 0 }, // wood, no koku
    };
    const after = reduce(broke, { type: 'repair_weapon' });
    expect(after.weaponDurability).toBeGreaterThan(broke.weaponDurability); // STILL repairs
    expect(after.resources.wood ?? 0).toBe(10 - balance.REPAIR_WOOD_COST); // wood spent
    expect(after.resources.koku ?? 0).toBe(0); // fee waived (nothing to take) — no stranding
  });

  it('the estate sink is DEEPER — ≥4 contiguous stages with strictly ascending koku costs', () => {
    expect(MAX_ESTATE_STAGE).toBeGreaterThanOrEqual(4); // U4 added (the deeper flywheel sink)
    ESTATE_STAGES.forEach((s, i) => {
      expect(s.stage).toBe(i + 1); // contiguous 1..N
      if (i > 0) expect(s.kokuCost).toBeGreaterThan(ESTATE_STAGES[i - 1]!.kokuCost); // ascending
    });
  });

  it('the market stays a MINORITY lane — total spend ≤ ⅓ of the estate sink (D-008)', () => {
    const marketMax = MARKET_ITEMS.reduce((sum, m) => sum + m.kokuCost * m.stockCap, 0);
    const estateTotal = ESTATE_STAGES.reduce((sum, s) => sum + s.kokuCost, 0);
    // the market-depth add stays inside the ≤⅓ Estate-&-Wealth cap — a hard design invariant.
    expect(marketMax).toBeLessThanOrEqual(estateTotal / 3);
  });
});

describe('v0.3.1 Step 5d — the load-bearing map node gates a richer yield (D-078)', () => {
  it('the deep satoyama forage out-yields the near one on BOTH resources (the map earns its walk)', () => {
    const near = getActivity('forage_satoyama').yields;
    const deep = getActivity('forage_deepwoods').yields;
    // the design lever: walking one hill farther is STRICTLY richer per act — else the node is dead
    // breadth (battery #13). Derived from the activity defs, not copied magic numbers.
    expect(deep.sansai ?? 0).toBeGreaterThan(near.sansai ?? 0);
    expect(deep.koku ?? 0).toBeGreaterThan(near.koku ?? 0);
  });

  it('the deeper haul costs more to earn — it sits behind the danger ring at a higher satiety cost', () => {
    const near = getActivity('forage_satoyama');
    const deep = getActivity('forage_deepwoods');
    expect(deep.dangerRing).toBe(true); // gated by the conditioning ring, like its near sibling
    expect(deep.area).toBe('deep-satoyama'); // a DIFFERENT node — you walk there
    expect(deep.satietyCost).toBeGreaterThan(near.satietyCost); // the richer haul taxes you more
  });
});

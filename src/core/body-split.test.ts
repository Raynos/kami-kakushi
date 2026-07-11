import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  advanceClock,
  balance,
  factsForSurfaces,
  type GameState,
} from './index';
import { hungerMax, restQuality, restRefill, satietyMax, staminaRate } from './selectors';
import { TICKS_PER_DAY } from './constants';

// ADR-178 (the body split, Option C) — TWO legible stores on two clocks:
// `satiety` stays the per-act WORK fuel ("Body 体", numbers unchanged, ADR-172);
// `hunger` is the NEW slow daily store food maintains ("Belly 腹"), whose only
// teeth are the rest-quality multiplier (hungry rest is poor rest — it SLOWS,
// never blocks, T0 stays gentle). Every fixture derives from the balance source
// of truth (HUNGER_* / EAT_RICE_* / SATIETY_PER_REST), never a copied magic
// number; the assertions target the design LEVERS (drain per day, the ramp
// mechanism, the food→belly routing), not collapsed outcomes.

/** Awake, rest-loop live, with the belly/kura set to the case's needs. */
function withVitals(over: {
  hunger?: number;
  satiety?: number;
  kuraRice?: number;
  unlocked?: readonly string[];
}): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    character: {
      ...s.character,
      hunger: over.hunger ?? s.character.hunger,
      satiety: over.satiety ?? s.character.satiety,
    },
    banked: { ...s.banked, rice: over.kuraRice ?? 0 },
    // ADR-179 — `over.unlocked` names SURFACES to make visible; visibility derives, so the fact
    // bridge translates each to its entitling fact-flag(s) (verb-eat-rice → rank-r1, verb-cook →
    // rank-r2 via its row).
    flags: { ...s.flags, awake: true, raked: true, ...factsForSurfaces(...(over.unlocked ?? [])) },
  };
}

describe('D-178 — hunger is a DAILY store: the day drains it, the kura ration maintains it', () => {
  it('a day boundary with an EMPTY kura drains exactly HUNGER_PER_DAY', () => {
    const s = withVitals({ hunger: hungerMax(createInitialState(1)), kuraRice: 0 });
    const after = advanceClock(s, TICKS_PER_DAY);
    expect(after.clock.day).toBe(s.clock.day + 1);
    expect(after.character.hunger).toBe(s.character.hunger - balance.HUNGER_PER_DAY);
  });

  it('a STOCKED kura serves the daily ration: rice leaves the kura and the belly is maintained', () => {
    const start = balance.HUNGER_MAX - balance.HUNGER_PER_DAY * 2; // headroom both ways
    const s = withVitals({ hunger: start, kuraRice: 20 });
    const after = advanceClock(s, TICKS_PER_DAY);
    // the household eats its shō/day (the ADR-163 sink, unchanged)…
    expect(after.banked.rice).toBe(20 - balance.CONSUMPTION_SHO_PER_DAY);
    // …and the FULL ration restores the full meal amount against the day's drain.
    expect(after.character.hunger).toBeCloseTo(
      start - balance.HUNGER_PER_DAY + balance.HUNGER_MEAL_RESTORE,
      10,
    );
  });

  it('a PARTIAL kura serves a partial ration — the belly refill pro-rates by what was eaten', () => {
    const start = balance.HUNGER_MAX / 2;
    const short = balance.CONSUMPTION_SHO_PER_DAY - 1; // one shō short of the full ration
    const s = withVitals({ hunger: start, kuraRice: short });
    const after = advanceClock(s, TICKS_PER_DAY);
    expect(after.banked.rice).toBe(0);
    expect(after.character.hunger).toBeCloseTo(
      start -
        balance.HUNGER_PER_DAY +
        balance.HUNGER_MEAL_RESTORE * (short / balance.CONSUMPTION_SHO_PER_DAY),
      10,
    );
  });

  it('hunger clamps at 0 — days of famine never drive it negative', () => {
    const s = withVitals({ hunger: balance.HUNGER_PER_DAY / 2, kuraRice: 0 });
    const after = advanceClock(s, TICKS_PER_DAY * 3);
    expect(after.character.hunger).toBe(0);
  });

  it('hunger clamps at HUNGER_MAX — a fed day at a full belly never overflows', () => {
    const s = withVitals({ hunger: balance.HUNGER_MAX, kuraRice: 50 });
    const after = advanceClock(s, TICKS_PER_DAY);
    expect(after.character.hunger).toBeLessThanOrEqual(balance.HUNGER_MAX);
  });
});

describe('D-178 — food feeds the BELLY, never the work bar (the split itself)', () => {
  it('eat_rice refills hunger and leaves satiety UNTOUCHED', () => {
    const s = withVitals({
      hunger: 10,
      satiety: 20,
      kuraRice: 10,
      unlocked: ['verb-eat-rice'],
    });
    const after = reduce(s, { type: 'eat_rice' });
    expect(after.banked.rice).toBe(10 - balance.EAT_RICE_COST);
    expect(after.character.hunger).toBe(10 + balance.EAT_RICE_HUNGER);
    expect(after.character.satiety).toBe(s.character.satiety); // the FB-345 headline
  });

  it('eat_rice clamps at the belly cap and still spends the rice (a deliberate splurge)', () => {
    const s = withVitals({
      hunger: balance.HUNGER_MAX - 1,
      kuraRice: 10,
      unlocked: ['verb-eat-rice'],
    });
    const after = reduce(s, { type: 'eat_rice' });
    expect(after.character.hunger).toBe(balance.HUNGER_MAX);
    expect(after.banked.rice).toBe(10 - balance.EAT_RICE_COST);
  });

  it('cook_meal mends HP (FB-22, unchanged) AND fills the belly — a meal is food', () => {
    const s = withVitals({ hunger: 10, satiety: 20, unlocked: ['verb-cook', 'room-kitchen'] });
    const fed = {
      ...s,
      resources: { ...s.resources, sansai: 5 },
      character: { ...s.character, hp: 5 },
      location: 'kitchen', // ADR-184 — cooking is sited at the pot; the belly math is the subject
    };
    const after = reduce(fed, { type: 'cook_meal' });
    expect(after.character.hp).toBe(5 + balance.COOK_HP_RESTORE);
    expect(after.character.hunger).toBe(10 + balance.COOK_HUNGER_RESTORE);
    expect(after.character.satiety).toBe(fed.character.satiety); // never the work bar
  });

  it('a deliberate meal beats the household ration (the design lever that makes eating worth it)', () => {
    expect(balance.EAT_RICE_HUNGER).toBeGreaterThan(balance.HUNGER_MEAL_RESTORE);
  });
});

describe('D-178 — the teeth: hungry rest is POOR rest (a multiplier that slows, never blocks)', () => {
  it('restQuality is FLAT (1.0) at and above HUNGER_FLAT_ABOVE of the belly', () => {
    const at = withVitals({ hunger: balance.HUNGER_MAX * balance.HUNGER_FLAT_ABOVE });
    const above = withVitals({ hunger: balance.HUNGER_MAX });
    expect(restQuality(at)).toBe(1);
    expect(restQuality(above)).toBe(1);
  });

  it('restQuality ramps MONOTONICALLY down to HUNGER_REST_FLOOR at empty — never to 0', () => {
    const empty = withVitals({ hunger: 0 });
    const mid = withVitals({ hunger: (balance.HUNGER_MAX * balance.HUNGER_FLAT_ABOVE) / 2 });
    expect(restQuality(empty)).toBe(balance.HUNGER_REST_FLOOR);
    expect(restQuality(mid)).toBeGreaterThan(restQuality(empty));
    expect(restQuality(mid)).toBeLessThan(1);
    expect(balance.HUNGER_REST_FLOOR).toBeGreaterThan(0); // slows, NEVER hard-blocks
  });

  it('a FED rest restores the full amount; a STARVED rest restores the floored amount', () => {
    const fed = withVitals({ hunger: balance.HUNGER_MAX, satiety: 10 });
    const fedAfter = reduce(fed, { type: 'rest' });
    expect(fedAfter.character.satiety).toBe(10 + balance.SATIETY_PER_REST);
    const starved = withVitals({ hunger: 0, satiety: 10 });
    const starvedAfter = reduce(starved, { type: 'rest' });
    expect(starvedAfter.character.satiety).toBe(
      10 + Math.round(balance.SATIETY_PER_REST * balance.HUNGER_REST_FLOOR),
    );
  });

  it('the reducer and the shown forecast share restRefill (AC-6 — forecast == reality)', () => {
    const s = withVitals({ hunger: 0, satiety: 10 });
    const after = reduce(s, { type: 'rest' });
    expect(after.character.satiety - s.character.satiety).toBe(restRefill(s));
  });

  it('staminaRate reads satiety ONLY — the belly never throttles the work rate directly', () => {
    const starved = withVitals({ hunger: 0, satiety: 50 });
    const fed = withVitals({ hunger: balance.HUNGER_MAX, satiety: 50 });
    expect(staminaRate(starved)).toBe(staminaRate(fed));
  });

  it('the belly cap is FLAT — it does not grow with level (unlike satietyMax)', () => {
    const s = createInitialState(1);
    const leveled = { ...s, character: { ...s.character, level: 10 } };
    expect(hungerMax(leveled)).toBe(hungerMax(s));
    expect(satietyMax(leveled)).toBeGreaterThan(satietyMax(s)); // the contrast that makes it a lever
  });
});

// ADR-187 — the day-skip (`sleep`): the only verb that moves time without doing work, and it
// needs a bed. Every fixture derives its expectation from the SOURCE OF TRUTH (HUNGER_PER_DAY,
// HUNGER_MEAL_RESTORE, SLEEP_MEAL_FRACTION, CONSUMPTION_SHO_PER_DAY, TICKS_PER_DAY), never a
// copied magic number, and asserts the DESIGN LEVER (the teeth: the day, the ration, the missed
// pot) rather than a collapsed metric — so each of these can genuinely go RED.
//
// The test that matters most is "a slept day on a FULL kura is NOT belly-neutral". That is the
// bug the pre-build survey caught: HUNGER_MEAL_RESTORE == HUNGER_PER_DAY by design (a stocked
// kura maintains the belly), so a day-skip priced by the existing day-boundary sink ALONE would
// have cost 3 shō and nothing else — near-free, and the 水・土 market rhythm collapses into a
// menu. Delete SLEEP_MEAL_FRACTION from the reducer and that test goes RED.

import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  balance,
  factsForSurfaces,
  canSleep,
  sleepForecast,
  availableActions,
  timingFor,
  type GameState,
} from '../core';
import { TICKS_PER_DAY } from './constants';
import { PERSONAS } from '../sim/personas';

const { HUNGER_PER_DAY, HUNGER_MEAL_RESTORE, SLEEP_MEAL_FRACTION, CONSUMPTION_SHO_PER_DAY } =
  balance;

/** What ONE slept day costs the belly, derived from the balance source: the day's drain, less the
 *  FRACTION of the household's ration that reached a man who was asleep when it was served. */
const SLEPT_DAY_BELLY_COST = HUNGER_PER_DAY - HUNGER_MEAL_RESTORE * SLEEP_MEAL_FRACTION;

/** In your corner, with the corner YOURS (panel-home derives from tab-inventory's rung facts —
 *  ADR-179), belly mid-bar so a slide has headroom in both directions, kura stocked unless said. */
function atCorner(over: { hunger?: number; kuraRice?: number; tick?: number } = {}): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    location: 'woodshed',
    clock: { ...s.clock, tick: over.tick ?? 0 },
    character: { ...s.character, hunger: over.hunger ?? balance.HUNGER_MAX },
    banked: { ...s.banked, rice: over.kuraRice ?? 100 },
    flags: { ...s.flags, awake: true, raked: true, ...factsForSurfaces('tab-inventory') },
  };
}

describe('ADR-187 — sleep is a HOME verb: a bed, at your corner, or nothing', () => {
  it('refuses without the corner: pre-home, sleep is not even offered', () => {
    const s = createInitialState(1);
    const homeless: GameState = { ...s, location: 'woodshed', flags: { ...s.flags, awake: true } };
    expect(canSleep(homeless)).toBe(false);
    expect(availableActions(homeless)).not.toContain('sleep');
    // ...and the reducer refuses on its own — the guard is not the shell's to keep.
    expect(reduce(homeless, { type: 'sleep' })).toBe(homeless);
  });

  it('refuses away from the corner: the bed is the woodshed, and it does not travel', () => {
    const elsewhere: GameState = { ...atCorner(), location: 'gate' };
    expect(canSleep(elsewhere)).toBe(false);
    expect(reduce(elsewhere, { type: 'sleep' })).toBe(elsewhere);
  });

  it('offers itself at the corner, beside Rest', () => {
    expect(canSleep(atCorner())).toBe(true);
    expect(availableActions(atCorner())).toContain('sleep');
  });

  it('refuses mid-VN — you do not sleep through a scene you are standing in', () => {
    const inBeat: GameState = { ...atCorner(), rungBeat: 'R3' };
    expect(canSleep(inBeat)).toBe(false);
    expect(reduce(inBeat, { type: 'sleep' })).toBe(inBeat);
  });

  it('is INSTANT, not a timed bar (a waiting bar would be dead REAL time — PRD §6.9)', () => {
    expect(timingFor('sleep').kind).toBe('instant');
  });
});

describe('ADR-187 — one press = one dawn: exactly ONE day boundary, from any tick', () => {
  it('wakes at tick 0 of the next day, from EVERY starting tick of the day', () => {
    for (let tick = 0; tick < TICKS_PER_DAY; tick++) {
      const s = atCorner({ tick });
      const after = reduce(s, { type: 'sleep' });
      expect(after.clock.day).toBe(s.clock.day + 1);
      expect(after.clock.tick).toBe(0);
    }
  });

  it('forfeits the rest of today — sleeping at dawn throws away a whole day of acts', () => {
    // The teeth that need no constant: the price of a sleep is the acts you had left in it.
    expect(sleepForecast(atCorner({ tick: 0 })).ticks).toBe(TICKS_PER_DAY);
    expect(sleepForecast(atCorner({ tick: TICKS_PER_DAY - 1 })).ticks).toBe(1);
  });

  it('crosses exactly ONE boundary: the house eats one ration, never two', () => {
    const s = atCorner();
    const after = reduce(s, { type: 'sleep' });
    expect(s.banked.rice! - after.banked.rice!).toBe(CONSUMPTION_SHO_PER_DAY);
  });
});

describe('ADR-187 — the teeth: an idle day is a hungrier day', () => {
  it('a slept day on a FULL kura is NOT belly-neutral (the near-free-skip bug this exists to kill)', () => {
    // A WORKED day boundary on a stocked kura maintains the belly exactly (HUNGER_MEAL_RESTORE ==
    // HUNGER_PER_DAY, by design). A SLEPT one must not: you were not up for the pot.
    const s = atCorner({ hunger: balance.HUNGER_MAX });
    const after = reduce(s, { type: 'sleep' });
    expect(SLEPT_DAY_BELLY_COST).toBeGreaterThan(0); // the design lever itself: teeth exist
    expect(after.character.hunger).toBeCloseTo(s.character.hunger - SLEPT_DAY_BELLY_COST, 5);
  });

  it('the belly SLIDES on a run of sleeps — three dawns cost three days of pot', () => {
    let s = atCorner({ hunger: balance.HUNGER_MAX });
    const start = s.character.hunger;
    for (let i = 0; i < 3; i++) s = reduce(s, { type: 'sleep' });
    expect(s.clock.day).toBe(3);
    expect(s.character.hunger).toBeCloseTo(start - 3 * SLEPT_DAY_BELLY_COST, 5);
    // ...and the house ate every one of those days.
    expect(s.banked.rice).toBe(100 - 3 * CONSUMPTION_SHO_PER_DAY);
  });

  it('an EMPTY kura serves no meal to sleep through — a starving sleeper is not double-punished', () => {
    // The missed-pot loss is PRO-RATED by what the kura could actually serve. With nothing in it,
    // a slept day costs exactly what a WORKED day costs (the plain drain) — no more.
    const s = atCorner({ hunger: balance.HUNGER_MAX, kuraRice: 0 });
    const after = reduce(s, { type: 'sleep' });
    expect(after.character.hunger).toBe(s.character.hunger - HUNGER_PER_DAY);
    expect(sleepForecast(s).missedMeal).toBe(0);
  });

  it('sleeping is NOT resting: the body gets nothing back', () => {
    // `rest` (2 ticks) stays the only thing that puts the body back — and the cheaper way to get
    // it. Sleep buys time, and only time. Give sleep a body refill and this goes RED.
    const s = atCorner({ hunger: balance.HUNGER_MAX });
    const spent: GameState = { ...s, character: { ...s.character, satiety: 1 } };
    expect(reduce(spent, { type: 'sleep' }).character.satiety).toBe(1);
  });
});

describe('ADR-187 — AC-6: the forecast IS the reality', () => {
  it('the price the hover shows is the price the reducer spends', () => {
    const s = atCorner({ hunger: balance.HUNGER_MAX / 2, kuraRice: 10 });
    const f = sleepForecast(s);
    const after = reduce(s, { type: 'sleep' });
    expect(s.banked.rice! - after.banked.rice!).toBe(f.riceDrawn);
    expect(s.character.hunger - after.character.hunger).toBeCloseTo(f.bellyLost, 5);
  });

  it('a nearly-empty kura forecasts the SHORT ration it can actually serve', () => {
    const s = atCorner({ kuraRice: 1 }); // less than a day's ration in the whole house
    expect(sleepForecast(s).riceDrawn).toBe(1);
    expect(reduce(s, { type: 'sleep' }).banked.rice).toBe(0);
  });
});

describe('ADR-187 — the standing ruling: the balance sim is SKIP-BLIND', () => {
  it('no persona knows how to sleep — the pacing bands measure REAL play', () => {
    // The ruling that keeps this build from stalling on a band violation (the HD-40 failure mode):
    // the greedy persona never sleeps, so a convenience the sim does not model can never drag a
    // rung under the signed 3-minute floor. Teach a persona to sleep and this goes RED — which is
    // correct: that is a NEW decision, and it reopens the pacing bands.
    for (const p of PERSONAS) expect(p.knows).not.toContain('sleep');
  });
});

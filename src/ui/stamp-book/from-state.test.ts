// from-state.test.ts — the ADR-201 derivation test (the plan's named check):
// stamps == rungs reached, knots == recorded defeats, every expectation
// DERIVED from the registries (RANKS, rungRequirements) — never copied
// counts. Also the v16 persistence contract: a pre-v16 blob hydrates to an
// UNDATED (not missing, not fabricated) record.

import { describe, expect, it } from 'vitest';
import {
  advanceClock,
  advanceSeason,
  applyGrindFight,
  applyPromotion,
  createInitialState,
  RANKS,
  rungRequirements,
  TICKS_PER_DAY,
  type GameState,
} from '../../core';
import { makeEnvelope } from '../../persistence/codec';
import { validateEnvelope } from '../../persistence/validate';
import { stripFromState } from './from-state';

/** Drive the REAL clock forward `days` (no field pokes). */
function laterBy(state: GameState, days: number): GameState {
  return advanceClock(state, days * TICKS_PER_DAY);
}

describe('stripFromState — slots (ADR-201 rulings 4 + 5)', () => {
  it('a fresh run: R0 pressed (the seeded cold-open date), the NEXT slot named, the rest mystery', () => {
    const s = createInitialState(7);
    const { slots } = stripFromState(s);
    expect(slots.length).toBe(RANKS.length); // the whole ladder, always

    const r0 = slots[0]!;
    expect(r0.state).toBe('pressed');
    expect(r0.day).toBe(0);
    expect(r0.season).toBe('winter');
    expect(r0.kanji).toBe(RANKS[0]!.kanji); // registry-sourced, never copied

    const next = slots[1]!;
    expect(next.state).toBe('next');
    expect(next.title).toBe(RANKS[1]!.title);
    expect(next.reqsTotal).toBe(rungRequirements('R0').length); // the source of truth

    // ruling 5 — beyond the next slot the DATA carries no identity at all:
    // a variant cannot leak a future rung's name, because it never receives it.
    for (const slot of slots.slice(2)) {
      expect(slot.state).toBe('future');
      expect(slot.kanji).toBeUndefined();
      expect(slot.title).toBeUndefined();
      expect(slot.granter).toBeUndefined();
    }
  });

  it('a promotion dates the press with the LIVE clock + season and the registry granter', () => {
    let s = createInitialState(7);
    s = laterBy(s, 6);
    s = advanceSeason(s); // winter → the next block on the wheel
    s = applyPromotion(s, 'R1');

    const { slots } = stripFromState(s);
    const r1 = slots[1]!;
    expect(r1.state).toBe('pressed');
    expect(r1.day).toBe(s.clock.day);
    expect(r1.season).toBe(s.season);
    expect(r1.granter).toBe(RANKS[1]!.granter); // the hand, from the registry
    expect(slots[2]!.state).toBe('next'); // the window advances with the rung
  });

  it('an UNDATED press (pre-v16 save shape) renders pressed with no day — never missing, never fabricated', () => {
    let s = createInitialState(7);
    s = applyPromotion(laterBy(s, 4), 'R1');
    // a pre-v16 save: the rung advanced but the record never existed
    const old: GameState = { ...s, rungRecord: [] };
    const { slots } = stripFromState(old);
    expect(slots[1]!.state).toBe('pressed'); // the SET derives from ladder position
    expect(slots[1]!.day).toBeUndefined(); // the date honestly absent
    expect(slots[1]!.kanji).toBe(RANKS[1]!.kanji);
  });
});

describe('stripFromState — the thread (knots + lean)', () => {
  it('knots == recorded defeats, landing on the stretch they fell in', () => {
    let s = createInitialState(7);
    s = applyPromotion(laterBy(s, 5), 'R1');
    expect(s.rungRecord.length).toBe(2); // R0 seed + the press — the record grew

    // a real lost fight (L1 vs bandit ≈ certain loss) dates a defeat
    const before = s.defeatDays.length;
    const fightDay = s.clock.day;
    s = applyGrindFight(s, 'bandit');
    expect(s.defeatDays.length).toBe(before + 1);
    // the record dates the FALL, not the waking: the sickroom days advance the
    // clock AFTER the entry is written, so fallDay ≤ recorded < the woken day.
    expect(s.defeatDays.at(-1)).toBeGreaterThanOrEqual(fightDay);
    expect(s.defeatDays.at(-1)).toBeLessThan(s.clock.day);

    // the defeat fell AFTER the last press → it knots the open stretch (R1→R2)
    const { stretches } = stripFromState(s);
    expect(stretches[1]!.knots).toBe(s.defeatDays.length);
    expect(stretches[0]!.knots).toBe(0); // R0→R1 closed clean before the fall
  });

  it('a long dated gap reads LEAN; ordinary gaps do not', () => {
    let s = createInitialState(7);
    s = applyPromotion(laterBy(s, 3), 'R1'); //   gap 3
    s = applyPromotion(laterBy(s, 3), 'R2'); //   gap 3
    s = applyPromotion(laterBy(s, 40), 'R3'); //  gap 40 — ≥10 days and ≥1.6×median(3)
    const { stretches } = stripFromState(s);
    expect(stretches[0]!.lean).toBe(false);
    expect(stretches[1]!.lean).toBe(false);
    expect(stretches[2]!.lean).toBe(true);
  });
});

describe('the run record persists (SCHEMA_VERSION 16, additive)', () => {
  it('rungRecord + defeatDays survive a save→load round-trip', () => {
    let s = createInitialState(7);
    s = applyPromotion(laterBy(s, 5), 'R1');
    s = applyGrindFight(s, 'bandit');
    const res = validateEnvelope(
      JSON.parse(JSON.stringify(makeEnvelope(s, 1, 1))),
    );
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.state.rungRecord).toEqual(s.rungRecord);
      expect(res.state.defeatDays).toEqual(s.defeatDays);
    }
  });

  it('a pre-bump (v15) blob opens with an EMPTY record — undated, not synthesized', () => {
    const bare = createInitialState(7) as unknown as Record<string, unknown>;
    delete bare.rungRecord; // a v15 state never carried either field
    delete bare.defeatDays;
    const env = {
      ...makeEnvelope(createInitialState(7), 1, 1),
      schemaVersion: 15,
      state: bare,
    };
    const res = validateEnvelope(JSON.parse(JSON.stringify(env)));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.state.rungRecord).toEqual([]);
      expect(res.state.defeatDays).toEqual([]);
    }
  });
});

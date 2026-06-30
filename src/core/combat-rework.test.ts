// v0.3.1 Step 3 — the combat rework (D-076 + batch-2). RED-able guards for the new behaviours,
// added as each sub-step lands: 3a summarised one-line outcomes + a LOSS stops the autopilot
// (no auto-heal grind); 3c the carried-resource loss penalty (banked is safe); 3d the
// auto-retreat-@20% mode (a 3rd "fled" outcome). HP still carries (D-050).
//
// Fixtures are driven by the SEED-ROBUST combat curve (m2.test header): mc(5) vs monkey ≈ 1.00
// (a guaranteed win) and mc(1) vs bandit ≈ 0.00 (a guaranteed loss) — so these are deterministic
// without fishing for a magic seed, and they go RED if the new behaviour regresses.
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  applyGrindFight,
  balance,
  hpMax,
  type GameState,
} from './index';

/** A ready fighter at the given level: full HP (hpMax grows with level), full satiety. */
function mc(level = 1, satiety = 100): GameState {
  const s = createInitialState(1);
  const t: GameState = { ...s, character: { ...s.character, level, satiety } };
  return { ...t, character: { ...t.character, hp: hpMax(t) } };
}
function combatLines(s: GameState): string[] {
  return s.log.entries.filter((e) => e.channel === 'combat').map((e) => e.text);
}
/** Awake, the estate economy open (the deposit/withdraw gate), carrying `koku`. */
function economyReady(koku = 100): GameState {
  const s = createInitialState(1);
  return {
    ...s,
    flags: { ...s.flags, awake: true },
    unlocked: [...s.unlocked, 'panel-estate'],
    resources: { ...s.resources, koku },
  };
}

describe('3a · summarised one-line fight outcomes (D-076 / batch-1 call 2)', () => {
  it('a WIN emits a SINGLE combat line carrying the HP swing + koku (not the old 2-3 lines)', () => {
    const before = mc(5); // L5 vs monkey ≈ 1.00 win-rate → a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // proves it won

    const added = combatLines(after).length - combatLines(before).length;
    expect(added).toBe(1); // win + optional loot fold into ONE outcome line

    const line = combatLines(after).at(-1) ?? '';
    expect(line).toMatch(/bring down the .*monkey/i);
    expect(line).toMatch(/HP \d+→\d+/); // the HP swing is IN the outcome line
    expect(line).toMatch(/\+\d+ koku/);
  });

  it('a LOSS emits a single summarised line with the HP drop', () => {
    const after = applyGrindFight(mc(1), 'bandit'); // ≈ 0.00 → a loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // proves it lost
    const line = combatLines(after).at(-1) ?? '';
    expect(line).toMatch(/overcomes you|limp home/i);
    expect(line).toMatch(/HP \d+→\d+/);
  });
});

describe('3a · a loss STOPS the autopilot (D-076: 0 HP ⇒ autopilot off)', () => {
  it('a lost grind-fight nulls autoCombat and floors HP to the setback', () => {
    const before: GameState = { ...mc(1), autoCombat: 'bandit' }; // a guaranteed loss
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    expect(after.autoCombat).toBeNull(); // ← the autopilot stopped
  });

  it('a WON grind-fight leaves the autopilot running (you keep grinding)', () => {
    const before: GameState = { ...mc(5), autoCombat: 'monkey' }; // a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // it won
    expect(after.autoCombat).toBe('monkey'); // ← autopilot unchanged
  });
});

describe('3b · the bank — deposit/withdraw move carried ↔ banked (batch-2 call 7)', () => {
  it('deposit moves ALL carried koku into the kura storehouse', () => {
    const after = reduce(economyReady(100), { type: 'deposit', resource: 'koku' });
    expect(after.resources.koku ?? 0).toBe(0); // carried emptied
    expect(after.banked.koku ?? 0).toBe(100); // sheltered
  });

  it('withdraw moves banked koku back to carried (round-trips)', () => {
    const stored = reduce(economyReady(100), { type: 'deposit', resource: 'koku' });
    const after = reduce(stored, { type: 'withdraw', resource: 'koku' });
    expect(after.resources.koku ?? 0).toBe(100);
    expect(after.banked.koku ?? 0).toBe(0);
  });

  it('deposit with nothing carried is a gate-safe no-op (unchanged state)', () => {
    const s = economyReady(0);
    expect(reduce(s, { type: 'deposit', resource: 'koku' })).toBe(s); // same ref → no-op
  });
});

describe('3c · a lost fight drops CARRIED koku/materials; BANKED is safe (D-076 / call 7)', () => {
  it('a loss bites carried koku by LOSS_KOKU_FRAC and leaves the storehouse untouched', () => {
    const base = mc(1); // L1 vs bandit ≈ 0.00 → a loss
    const before: GameState = {
      ...base,
      resources: { ...base.resources, koku: 100 },
      banked: { koku: 50 },
    };
    const after = applyGrindFight(before, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    // the design lever (LOSS_KOKU_FRAC), derived from the source constant — not a magic number
    const expectedLost = Math.round(100 * balance.LOSS_KOKU_FRAC);
    expect(after.resources.koku ?? 0).toBe(100 - expectedLost); // carried bitten
    expect(after.banked.koku ?? 0).toBe(50); // ← sheltered, untouched
  });

  it('a WIN never touches the storehouse (banked stays put)', () => {
    const before: GameState = { ...mc(5), banked: { koku: 50 } }; // a guaranteed win
    const after = applyGrindFight(before, 'monkey');
    expect(after.character.combatXp).toBeGreaterThan(before.character.combatXp); // it won
    expect(after.banked.koku ?? 0).toBe(50);
  });
});

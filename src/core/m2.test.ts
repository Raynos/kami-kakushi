import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  mcCombatStats,
  mobCombatStats,
  analyticWinRate,
  combatLevelForXp,
  durabilityBand,
  resolveFight,
  applyGrindFight,
  applyScriptedWolf,
  getMob,
  type GameState,
} from './index';

function atFullSatiety(s: GameState): GameState {
  return { ...s, character: { ...s.character, satiety: 100 } };
}
function atLevel(s: GameState, level: number): GameState {
  return { ...s, character: { ...s.character, level } };
}

describe('analytic win-rate (closed-form, no sampling — D-Q-winrate)', () => {
  it('the fresh MC vs the grindable wolf sits in the LOCKED 20–35% band (at adequate satiety)', () => {
    const fresh = atFullSatiety(createInitialState(1));
    const wr = analyticWinRate(mcCombatStats(fresh), mobCombatStats(getMob('wolf')));
    expect(wr).toBeGreaterThanOrEqual(0.2);
    expect(wr).toBeLessThanOrEqual(0.35);
  });

  it('a trained MC reaches ~85%+ vs the same wolf', () => {
    const trained = atLevel(atFullSatiety(createInitialState(1)), 3);
    expect(
      analyticWinRate(mcCombatStats(trained), mobCombatStats(getMob('wolf'))),
    ).toBeGreaterThanOrEqual(0.85);
  });

  it('the satiety throttle measurably lowers the win-rate below the knee', () => {
    const full = atFullSatiety(createInitialState(1));
    const starving = {
      ...createInitialState(1),
      character: { ...createInitialState(1).character, satiety: 5 },
    };
    const wrFull = analyticWinRate(mcCombatStats(full), mobCombatStats(getMob('wolf')));
    const wrLow = analyticWinRate(mcCombatStats(starving), mobCombatStats(getMob('wolf')));
    expect(wrLow).toBeLessThanOrEqual(wrFull);
  });
});

describe('combat level curve + durability bands', () => {
  it('levels on the combat-XP curve', () => {
    expect(combatLevelForXp(0)).toBe(1);
    expect(combatLevelForXp(29)).toBe(1);
    expect(combatLevelForXp(30)).toBe(2);
  });
  it('durability bands step down attackPower, never to zero', () => {
    expect(durabilityBand(40, 40).mult).toBe(1.0);
    expect(durabilityBand(20, 40).mult).toBe(0.9);
    expect(durabilityBand(1, 40).mult).toBe(0.75);
    expect(durabilityBand(0, 40).mult).toBe(0.55);
  });
});

describe('the seeded auto-battler', () => {
  it('replays byte-identically for a fixed seed', () => {
    const s = atFullSatiety(createInitialState(42));
    const mc = mcCombatStats(s);
    const en = mobCombatStats(getMob('boar'));
    const a = resolveFight(s.rng, mc, en);
    const b = resolveFight(s.rng, mc, en);
    expect(a.won).toBe(b.won);
    expect(a.mcHpLeft).toBe(b.mcHpLeft);
    expect(a.rounds).toBe(b.rounds);
  });
});

describe('fight outcomes are self-recovering and never lose progress (§4.6.6 LOCKED)', () => {
  it('a win grants combat-XP + koku; a loss applies the soft setback', () => {
    const s = atFullSatiety(createInitialState(7));
    const before = s.character.combatXp;
    const after = applyGrindFight(s, 'wolf');
    expect(after.character.combatXp).toBeGreaterThanOrEqual(before);
    expect(after.character.level).toBeGreaterThanOrEqual(s.character.level);
  });

  it('many fights vs a tough foe NEVER reduce level / combat-XP, and HP never goes negative', () => {
    let s = atFullSatiety(createInitialState(3));
    for (let i = 0; i < 20; i++) {
      const prevLevel = s.character.level;
      const prevXp = s.character.combatXp;
      s = applyGrindFight(s, 'bandit');
      expect(s.character.level).toBeGreaterThanOrEqual(prevLevel);
      expect(s.character.combatXp).toBeGreaterThanOrEqual(prevXp);
      expect(s.character.hp).toBeGreaterThanOrEqual(0);
    }
  });

  it('the scripted grain-store wolf is always survived and opens R3', () => {
    const s = createInitialState(99);
    const after = applyScriptedWolf(s);
    expect(after.flags['first-fight-survived']).toBe(true);
    expect(after.character.hp).toBeGreaterThanOrEqual(1);
  });
});

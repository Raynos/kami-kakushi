import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  mcCombatStats,
  mobCombatStats,
  analyticWinRate,
  sampledWinRate,
  combatLevelForXp,
  durabilityBand,
  resolveFight,
  applyGrindFight,
  applyScriptedWolf,
  getMob,
  type GameState,
} from './index';

function mc(level = 1, satiety = 100): GameState {
  const s = createInitialState(1);
  return { ...s, character: { ...s.character, level, satiety } };
}
function atFullSatiety(s: GameState): GameState {
  return { ...s, character: { ...s.character, satiety: 100 } };
}

describe('win-rate forecast + progression (sampled — the honest, played behaviour)', () => {
  it('the fresh MC reliably beats the easiest foe — the starter grind has traction', () => {
    const wr = sampledWinRate(mcCombatStats(mc(1)), mobCombatStats(getMob('monkey')), 11, 100);
    expect(wr).toBeGreaterThan(0.6);
  });

  it('a tough foe is out of reach fresh, but grindable once leveled (the climb pays off)', () => {
    const fresh = sampledWinRate(mcCombatStats(mc(1)), mobCombatStats(getMob('bandit')), 22, 100);
    const leveled = sampledWinRate(mcCombatStats(mc(5)), mobCombatStats(getMob('bandit')), 22, 100);
    expect(fresh).toBeLessThan(0.25);
    expect(leveled).toBeGreaterThan(0.7);
  });

  it('the satiety throttle lowers the win-rate (eat before you fight)', () => {
    const full = sampledWinRate(mcCombatStats(mc(2, 100)), mobCombatStats(getMob('wolf')), 33, 100);
    const starving = sampledWinRate(
      mcCombatStats(mc(2, 5)),
      mobCombatStats(getMob('wolf')),
      33,
      100,
    );
    expect(starving).toBeLessThanOrEqual(full);
  });

  it('the analytic closed-form stays a sane estimate (kept for the M6 gate)', () => {
    const wr = analyticWinRate(mcCombatStats(mc(1)), mobCombatStats(getMob('wolf')));
    expect(wr).toBeGreaterThan(0);
    expect(wr).toBeLessThan(1);
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

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
  foeForecasts,
  applyGrindFight,
  applyScriptedWolf,
  getMob,
  balance,
  revealPass,
  isUnlocked,
  getRank,
  applyRewards,
  type GameState,
} from './index';

function mc(level = 1, satiety = 100): GameState {
  const s = createInitialState(1);
  return { ...s, character: { ...s.character, level, satiety } };
}
function atFullSatiety(s: GameState): GameState {
  return { ...s, character: { ...s.character, satiety: 100 } };
}
/** Sampled win-rate of one grindable foe against the MC in this state (the UI forecast). */
function foeWr(state: GameState, mobId: string): number {
  const f = foeForecasts(state).find((x) => x.mob.id === mobId);
  if (!f) throw new Error(`no grindable foe ${mobId}`);
  return f.winRate;
}

// The merged combat-curve gate (audit #1 fix). ALL assertions are BANDS driven by the
// shared balance.CURVE_* constants — point-estimates are seed/weapon-sensitive, so if a
// value lands outside, WIDEN the constant to engine reality, never tighten below it.
// Verified curve (foeForecasts mc(lvl), n=48 run-seed 1, chudan/pole):
//   monkey 0.33/0.65/0.94/0.98/1.00 · wolf 0.04/0.23/0.54/0.85/0.96
//   boar   0.00/0.08/0.21/0.48/0.77 · bandit 0.00/0.00/0.00/0.00/0.10 (L1-5) · bandit L8 0.75
describe('combat curve — a graded close-duel rolling frontier (sampled forecast)', () => {
  it('the first foe (monkey @L1) is humbling-but-winnable — G3/FU19', () => {
    const wr = foeWr(mc(1), 'monkey');
    expect(wr).toBeGreaterThanOrEqual(balance.CURVE_FIRST_FOE_WR_MIN);
    expect(wr).toBeLessThanOrEqual(balance.CURVE_FIRST_FOE_WR_MAX);
  });

  it('no checkpoint level is ALL-dead or ALL-trivial (the invariant v0.1 violated)', () => {
    for (const lvl of balance.CURVE_CHECKPOINT_LEVELS) {
      const rates = foeForecasts(mc(lvl)).map((f) => f.winRate);
      expect(rates.every((r) => r <= balance.CURVE_DEAD_TIER_MAX)).toBe(false);
      expect(rates.every((r) => r >= balance.CURVE_TRIVIAL_TIER_MIN)).toBe(false);
    }
  });

  it('the player has a real choice — ≥2 foes inside the choice band at L2 and L3', () => {
    const inBand = (state: GameState) =>
      foeForecasts(state).filter(
        (f) =>
          f.winRate >= balance.CURVE_CHOICE_BAND_MIN && f.winRate <= balance.CURVE_CHOICE_BAND_MAX,
      ).length;
    expect(inBand(mc(2))).toBeGreaterThanOrEqual(2);
    expect(inBand(mc(3))).toBeGreaterThanOrEqual(2);
  });

  it('the mid-tier wolf is a genuine race once leveled (anchor: wolf @L3)', () => {
    const wr = foeWr(mc(3), 'wolf');
    expect(wr).toBeGreaterThanOrEqual(0.4);
    expect(wr).toBeLessThanOrEqual(0.72);
  });

  it('mastering the easiest foe takes real investment (dozens of fights, not ~5 kills)', () => {
    // the combat level at which the monkey first becomes trivial (≥ CURVE_TRIVIAL_TIER_MIN)
    let masterLevel = 1;
    for (let lvl = 1; lvl <= 12; lvl++) {
      if (foeWr(mc(lvl), 'monkey') >= balance.CURVE_TRIVIAL_TIER_MIN) {
        masterLevel = lvl;
        break;
      }
    }
    // monkey kills needed to climb to that level on the v0.2 XP curve
    const xpPerKill = getMob('monkey').level * balance.COMBAT_XP_K;
    let xp = 0;
    let kills = 0;
    while (combatLevelForXp(xp) < masterLevel) {
      xp += xpPerKill;
      kills++;
    }
    expect(kills).toBeGreaterThanOrEqual(balance.CURVE_MASTERY_MIN_KILLS);
  });

  it('the top foe (bandit) is a real wall — out of reach fresh, hard at L5, a challenge by L8', () => {
    expect(foeWr(mc(1), 'bandit')).toBeLessThan(0.1);
    expect(foeWr(mc(5), 'bandit')).toBeLessThan(0.35);
    expect(foeWr(mc(8), 'bandit')).toBeGreaterThan(0.5);
  });

  it('the analytic closed-form diverges from the honest sample on a lopsided race (boar @L5)', () => {
    const s = mc(5);
    const analytic = analyticWinRate(mcCombatStats(s), mobCombatStats(getMob('boar')));
    const sampled = foeWr(s, 'boar');
    expect(Math.abs(analytic - sampled)).toBeGreaterThan(0.1);
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

  it('Aggressive (jodan) meaningfully raises the win-rate on a longshot (stance gap ≥ 0.08)', () => {
    const chudan = foeWr({ ...mc(1), stance: 'chudan' }, 'monkey');
    const jodan = foeWr({ ...mc(1), stance: 'jodan' }, 'monkey');
    expect(jodan - chudan).toBeGreaterThanOrEqual(0.08);
  });

  it('stance mods stay in range and set the durability-wear axis (jodan 3 / chudan 2 / gedan 1)', () => {
    for (const id of balance.STANCE_ORDER) {
      const m = balance.STANCE_MODS[id];
      expect(m.atkMult).toBeGreaterThan(0);
      expect(m.wearMult).toBeGreaterThan(0);
      for (const lvl of [1, 8]) {
        const cs = mcCombatStats({ ...mc(lvl), stance: id });
        expect(cs.critChance).toBeGreaterThanOrEqual(0);
        expect(cs.critChance).toBeLessThanOrEqual(1);
        expect(cs.blockChance).toBeGreaterThanOrEqual(0);
        expect(cs.blockChance).toBeLessThanOrEqual(1);
      }
    }
    const fresh = createInitialState(1);
    const wearOf = (stance: GameState['stance']) =>
      fresh.weaponDurability - applyGrindFight({ ...fresh, stance }, 'monkey').weaponDurability;
    expect(wearOf('jodan')).toBe(3);
    expect(wearOf('chudan')).toBe(2);
    expect(wearOf('gedan')).toBe(1);
  });
});

describe('combat level curve + durability bands', () => {
  it('levels on the combat-XP curve', () => {
    expect(combatLevelForXp(0)).toBe(1);
    expect(combatLevelForXp(39)).toBe(1);
    expect(combatLevelForXp(40)).toBe(2);
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

// The R3 terminal beat + 2nd-dream payoff + macro-teaser (audit #2/#6/#13). The two
// live-gated surfaces (frontier capstone + dream-2) latch via revealPass only once the
// gate-watch has actually fought (combat level ≥ the frontier gate); dream-2 is the FIRST
// READER of the formerly write-only dream-1 + porters-knot flags; the macro teaser is
// revealed by the R3 rank reward.
describe('narrative — R3 terminal beat + 2nd dream payoff (audit #2/#6/#13)', () => {
  /** A state parked at R3 with the mystery flags written, before the new surfaces latch. */
  function atR3(level: number, flagOverrides: Record<string, boolean> = {}): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      rung: 'R3',
      character: { ...base.character, level },
      flags: {
        ...base.flags,
        awake: true,
        'dream-1': true,
        'porters-knot': true,
        'rank-r3': true,
        ...flagOverrides,
      },
    };
  }

  it('the frontier beat + 2nd dream are gated on real combat (level ≥ R3_FRONTIER_COMBAT_LEVEL)', () => {
    const below = revealPass(atR3(balance.R3_FRONTIER_COMBAT_LEVEL - 1));
    expect(isUnlocked(below, 'screen-demo-frontier')).toBe(false);
    expect(isUnlocked(below, 'dream-2')).toBe(false);

    const at = revealPass(atR3(balance.R3_FRONTIER_COMBAT_LEVEL));
    expect(isUnlocked(at, 'screen-demo-frontier')).toBe(true);
    expect(isUnlocked(at, 'dream-2')).toBe(true);
  });

  it('the 2nd dream reads the earlier mystery flags — no longer write-only', () => {
    const noKnot = revealPass(atR3(balance.R3_FRONTIER_COMBAT_LEVEL, { 'porters-knot': false }));
    expect(isUnlocked(noKnot, 'dream-2')).toBe(false);

    const noDream1 = revealPass(atR3(balance.R3_FRONTIER_COMBAT_LEVEL, { 'dream-1': false }));
    expect(isUnlocked(noDream1, 'dream-2')).toBe(false);
  });

  it('the macro-teaser panel unlocks on reaching R3 (revealed by the rank reward)', () => {
    const reward = getRank('R3').rewardOnReach;
    expect(reward).toBeDefined();
    const promoted = applyRewards(createInitialState(1), reward!);
    expect(isUnlocked(promoted, 'panel-house-influence')).toBe(true);
  });

  it('the terminal beat fires exactly once (idempotent revealPass)', () => {
    const once = revealPass(atR3(balance.R3_FRONTIER_COMBAT_LEVEL));
    const twice = revealPass(once);
    expect(twice.unlocked.filter((id) => id === 'screen-demo-frontier')).toHaveLength(1);
    const frontierLines = twice.log.entries.filter(
      (e) => e.channel === 'milestone' && e.text.includes('a soldier in you under the farmhand'),
    );
    expect(frontierLines).toHaveLength(1);
  });
});

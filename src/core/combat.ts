// The deterministic auto-battler (PRD §4.6). MC combat stats derive from the
// character (combat) level + equipped weapon (× durability band × satiety throttle ×
// stance); mob stats derive from MobDef.level (same curve family, Block N.1 #1). Two
// win-rate lenses: analyticWinRate() is a closed-form race-to-kill estimate kept for
// the M6 gate, while the displayed/decision FORECAST (foeForecasts → sampledWinRate)
// is an honest fixed-seed SAMPLE of the real sim. The actual fight is a seeded sim
// over the combat RNG cursor (deterministic replay).

import type { GameState } from './state';
import type { Rng } from './rng';
import { nextChance, nextFloat, createRng } from './rng';
import { clamp } from './math';
import { hpMax, satietyMax } from './selectors';
import { getWeapon } from './content/weapons';
import { GRINDABLE_MOBS, type MobDef } from './content/enemies';
import {
  DAMAGE_FLOOR,
  HIT_CHANCE,
  CRIT_CHANCE,
  CRIT_MULT,
  BLOCK_CHANCE,
  BLOCK_REDUCTION,
  WINRATE_GAIN,
  COMBAT_SATIETY_FLOOR,
  COMBAT_SATIETY_FLAT_ABOVE,
  MC_ATK_PER_LEVEL,
  MC_DEF_BASE,
  MC_DEF_PER_LEVEL,
  MOB_ATK_BASE,
  MOB_ATK_PER_LEVEL,
  MOB_DEF_PER_LEVEL,
  MOB_HP_BASE,
  MOB_HP_PER_LEVEL,
  COMBAT_XP_BASE,
  COMBAT_XP_GROWTH_NUM,
  COMBAT_XP_GROWTH_DEN,
  COMBAT_MAX_LEVEL,
  DURABILITY_BANDS,
  SPREAD_LO,
  SPREAD_SPAN,
  STANCE_MODS,
  ATTR_MIGHT_ATK,
  ATTR_GUARD_DEF,
} from './content/balance';

export interface CombatStats {
  readonly attackPower: number;
  readonly defense: number;
  readonly hp: number;
  readonly speed: number;
  readonly hitChance: number;
  readonly critChance: number;
  readonly blockChance: number;
  /** Incoming-damage multiplier applied to this combatant when it DEFENDS (stance). */
  readonly damageTakenMult: number;
}

// Combat-XP → character level (integer 1.3× cumulative; combat-only, Q1/FU14).
const COMBAT_CUM: readonly number[] = (() => {
  const arr: number[] = [0, 0];
  let cost = COMBAT_XP_BASE;
  for (let l = 2; l <= COMBAT_MAX_LEVEL; l++) {
    arr[l] = arr[l - 1]! + cost;
    cost = Math.floor((cost * COMBAT_XP_GROWTH_NUM) / COMBAT_XP_GROWTH_DEN);
  }
  return arr;
})();

export function combatLevelForXp(xp: number): number {
  let level = 1;
  while (level < COMBAT_MAX_LEVEL && xp >= (COMBAT_CUM[level + 1] ?? Infinity)) level++;
  return level;
}

export function combatXpProgress(xp: number): { level: number; into: number; needed: number } {
  const level = combatLevelForXp(xp);
  const base = COMBAT_CUM[level] ?? 0;
  const next = COMBAT_CUM[level + 1] ?? base + 1;
  return { level, into: xp - base, needed: Math.max(1, next - base) };
}

/** Combat satiety throttle on attackPower (FU16/§4.6.1b) — a separate coefficient. */
export function combatSatietyRate(state: GameState): number {
  const frac = satietyMax(state) > 0 ? state.character.satiety / satietyMax(state) : 0;
  if (frac >= COMBAT_SATIETY_FLAT_ABOVE) return 1;
  const t = clamp(frac / COMBAT_SATIETY_FLAT_ABOVE, 0, 1);
  return COMBAT_SATIETY_FLOOR + (1 - COMBAT_SATIETY_FLOOR) * t;
}

export function durabilityBand(
  durability: number,
  durabilityMax: number,
): { mult: number; name: string } {
  const pct = durabilityMax > 0 ? (durability / durabilityMax) * 100 : 0;
  for (const b of DURABILITY_BANDS) if (pct >= b.min) return { mult: b.mult, name: b.name };
  const last = DURABILITY_BANDS[DURABILITY_BANDS.length - 1]!;
  return { mult: last.mult, name: last.name };
}

export function mcCombatStats(state: GameState): CombatStats {
  const weapon = getWeapon(state.equippedWeapon);
  const level = state.character.level;
  const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
  const satRate = combatSatietyRate(state);
  const stance = STANCE_MODS[state.stance];
  const c = state.character;
  const baseAtk = weapon.baseAttack + (level - 1) * MC_ATK_PER_LEVEL;
  return {
    // Might is a flat add AFTER durability/satiety/stance scaling — "your own muscle",
    // not weakened by a broken weapon or hunger. At L1 defaults (0) this is identity.
    attackPower:
      Math.max(1, Math.round(baseAtk * band.mult * satRate * stance.atkMult)) +
      c.might * ATTR_MIGHT_ATK,
    defense: MC_DEF_BASE + (level - 1) * MC_DEF_PER_LEVEL + c.guard * ATTR_GUARD_DEF,
    hp: hpMax(state),
    speed: weapon.baseSpeed,
    hitChance: HIT_CHANCE,
    critChance: clamp(CRIT_CHANCE + stance.critAdd, 0, 1),
    blockChance: clamp(BLOCK_CHANCE + stance.blockAdd, 0, 1),
    damageTakenMult: stance.takenMult,
  };
}

export function mobCombatStats(mob: MobDef): CombatStats {
  const lvl = mob.level;
  return {
    attackPower: MOB_ATK_BASE + lvl * MOB_ATK_PER_LEVEL,
    defense: lvl * MOB_DEF_PER_LEVEL,
    hp: MOB_HP_BASE + lvl * MOB_HP_PER_LEVEL,
    speed: 1.0,
    hitChance: HIT_CHANCE,
    critChance: CRIT_CHANCE,
    blockChance: 0, // grounded beasts don't parry
    damageTakenMult: 1, // mobs take normal damage
  };
}

function expectedDmg(atk: CombatStats, def: CombatStats): number {
  const raw = Math.max(DAMAGE_FLOOR, atk.attackPower - def.defense);
  const critFactor = 1 + atk.critChance * (CRIT_MULT - 1);
  const blockFactor = 1 - def.blockChance * BLOCK_REDUCTION;
  return atk.hitChance * raw * critFactor * blockFactor;
}

/** Closed-form win probability (race-to-kill; deterministic, no sampling). */
export function analyticWinRate(mc: CombatStats, enemy: CombatStats): number {
  const ttkMc = Math.ceil(enemy.hp / expectedDmg(mc, enemy)) / mc.speed;
  const ttkEn = Math.ceil(mc.hp / expectedDmg(enemy, mc)) / enemy.speed;
  const p = 0.5 + (WINRATE_GAIN * (ttkEn - ttkMc)) / (ttkEn + ttkMc);
  return clamp(p, 0.02, 0.98);
}

// ── the seeded auto-resolve sim (deterministic replay over the combat cursor) ──
const DT = 0.1;

function swing(rng: Rng, atk: CombatStats, def: CombatStats): [number, Rng] {
  let r = rng;
  const [hit, r1] = nextChance(r, 'combat', atk.hitChance);
  r = r1;
  if (!hit) return [0, r];
  let raw = Math.max(DAMAGE_FLOOR, atk.attackPower - def.defense);
  // per-hit damage spread (~±45%) — smooths the win-rate curve so a fight can be a
  // genuine 30–70% race, not a binary outcome of the stat gap.
  const [v, rv] = nextFloat(r, 'combat');
  r = rv;
  raw = Math.max(DAMAGE_FLOOR, Math.round(raw * (SPREAD_LO + SPREAD_SPAN * v)));
  const [crit, r2] = nextChance(r, 'combat', atk.critChance);
  r = r2;
  if (crit) raw = Math.round(raw * CRIT_MULT);
  const [block, r3] = nextChance(r, 'combat', def.blockChance);
  r = r3;
  if (block) raw = Math.max(DAMAGE_FLOOR, Math.round(raw * (1 - BLOCK_REDUCTION)));
  // stance: the defender's incoming-damage multiplier (RNG-free post-processing — no
  // new draw, so seeded replays stay byte-identical). Mobs have damageTakenMult = 1.
  raw = Math.max(DAMAGE_FLOOR, Math.round(raw * def.damageTakenMult));
  return [raw, r];
}

export interface FightResult {
  readonly won: boolean;
  readonly mcHpLeft: number;
  readonly rounds: number;
  readonly rng: Rng;
}

export interface FoeForecast {
  readonly mob: MobDef;
  readonly winRate: number;
}

/**
 * The displayed/decision win-rate: a small fixed-seed SAMPLE of the real sim (D-Q-winrate
 * keeps the analytic form for the M6 gate, but the per-foe FORECAST samples so it's honest
 * — the closed form over/under-states a lopsided race). Deterministic: seeds derive from the
 * run seed + the foe, so a given stat-state yields a stable forecast.
 */
export function sampledWinRate(
  mc: CombatStats,
  enemy: CombatStats,
  baseSeed: number,
  n = 48,
): number {
  let wins = 0;
  for (let i = 0; i < n; i++) {
    const rng = createRng((baseSeed + i * 2654435761) >>> 0);
    if (resolveFight(rng, mc, enemy).won) wins++;
  }
  return wins / n;
}

/** The grindable foes (danger order) with their win-rate against the MC right now. */
export function foeForecasts(state: GameState): FoeForecast[] {
  const mc = mcCombatStats(state);
  return GRINDABLE_MOBS.map((mob) => ({
    mob,
    winRate: sampledWinRate(mc, mobCombatStats(mob), (state.rng.seed + mob.level * 7919) >>> 0),
  }));
}

export function resolveFight(rng: Rng, mc: CombatStats, enemy: CombatStats): FightResult {
  let mcHp = mc.hp;
  let enHp = enemy.hp;
  let mcTimer = 0;
  let enTimer = 0;
  const mcInt = 1 / mc.speed;
  const enInt = 1 / enemy.speed;
  let r = rng;
  let rounds = 0;
  while (mcHp > 0 && enHp > 0 && rounds < 5000) {
    rounds++;
    mcTimer += DT;
    enTimer += DT;
    if (mcTimer >= mcInt) {
      mcTimer -= mcInt;
      const [d, r2] = swing(r, mc, enemy);
      r = r2;
      enHp -= d;
    }
    if (enHp <= 0) break;
    if (enTimer >= enInt) {
      enTimer -= enInt;
      const [d, r2] = swing(r, enemy, mc);
      r = r2;
      mcHp -= d;
    }
  }
  return { won: enHp <= 0 && mcHp > 0, mcHpLeft: Math.max(0, mcHp), rounds, rng: r };
}

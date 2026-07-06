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
  CRIT_MULT,
  BLOCK_REDUCTION,
  WINRATE_GAIN,
  COMBAT_SATIETY_FLOOR,
  COMBAT_SATIETY_FLAT_ABOVE,
  STR_ATK_COEFF,
  STR_DEF_COEFF,
  AGI_EVA_COEFF,
  AGI_ACC_COEFF,
  ACC_BASE,
  SPD_ATKSPEED_COEFF,
  CRIT_BASE,
  CRIT_AGI_COEFF,
  CRIT_LUCK_COEFF,
  CRIT_CHANCE_MAX,
  INT_KNOWN_DMG_COEFF,
  HIT_CHANCE_MIN,
  HIT_CHANCE_MAX,
  DMG_VARIANCE,
  DAMAGE_FLOOR_FRAC,
  MOB_ATK_BASE,
  MOB_ATK_K,
  MOB_DEF_BASE,
  MOB_DEF_K,
  MOB_HP_BASE,
  MOB_HP_K,
  MOB_ACC_BASE,
  MOB_ACC_K,
  MOB_EVA_BASE,
  MOB_EVA_K,
  MOB_CRIT,
  COMBAT_XP_BASE,
  COMBAT_XP_GROWTH_NUM,
  COMBAT_XP_GROWTH_DEN,
  COMBAT_MAX_LEVEL,
  DURABILITY_BANDS,
  STANCE_MODS,
} from './content/balance';

export interface CombatStats {
  readonly attackPower: number;
  readonly defense: number;
  readonly hp: number;
  /** Swings per time-unit (was `speed`) — weapon cadence × SPD scaling (§4.6.1). */
  readonly attackSpeed: number;
  /** Hit-chance is now DERIVED per exchange from accuracy vs the defender's evasion (§4.6.3),
   *  so it is not carried on the stat block; accuracy/evasion are. */
  readonly accuracy: number;
  readonly evasion: number;
  readonly critChance: number;
  readonly blockChance: number;
  /** Incoming-damage multiplier applied to this combatant when it DEFENDS (stance). */
  readonly damageTakenMult: number;
}

/** clamp(accuracy/(accuracy+evasion)) — the per-exchange hit-chance (§4.6.3). */
function hitChance(atk: CombatStats, def: CombatStats): number {
  const denom = atk.accuracy + def.evasion;
  const p = denom > 0 ? atk.accuracy / denom : 1;
  return clamp(p, HIT_CHANCE_MIN, HIT_CHANCE_MAX);
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

/**
 * The MC's derived combat stats (§4.6.1, T0: gearAtk=0, no weapon-skill/armour/shield terms).
 * `foeKnown` applies the INT bestiary damage bonus (+0.5%·INT) — set only when fighting an
 * already-encountered foe (its `mob-<id>` flag is set), so it stays foe-specific and honest.
 */
export function mcCombatStats(state: GameState, foeKnown = false): CombatStats {
  const weapon = getWeapon(state.equippedWeapon);
  const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
  const satRate = combatSatietyRate(state);
  const stance = STANCE_MODS[state.stance];
  const a = state.character.attrs;
  const intMult = foeKnown ? 1 + INT_KNOWN_DMG_COEFF * a.int : 1;
  // attackPower = (weaponBase + 1.2·STR)·stance·satiety·durability·intBestiary (§4.6.1).
  const rawAtk =
    (weapon.baseAttack + STR_ATK_COEFF * a.str) * stance.atkMult * satRate * band.mult * intMult;
  return {
    attackPower: Math.max(1, Math.round(rawAtk)),
    defense: STR_DEF_COEFF * a.str,
    // ADR-050: a fight starts from your CARRIED hp, not a free full refill. hpMax is the
    // ceiling (level/STR); the only mend is eating (cook). A hurt fighter forecasts lower.
    hp: clamp(state.character.hp, 0, hpMax(state)),
    attackSpeed: weapon.baseSpeed * (1 + SPD_ATKSPEED_COEFF * a.spd),
    accuracy: ACC_BASE + AGI_ACC_COEFF * a.agi,
    evasion: AGI_EVA_COEFF * a.agi,
    critChance: clamp(
      CRIT_BASE + CRIT_AGI_COEFF * a.agi + CRIT_LUCK_COEFF * a.luck,
      0,
      CRIT_CHANCE_MAX,
    ),
    blockChance: 0, // T0 has no shield/guard → block 0 (§4.6.1)
    damageTakenMult: stance.takenMult,
  };
}

export function mobCombatStats(mob: MobDef): CombatStats {
  const L = mob.level;
  return {
    attackPower: MOB_ATK_BASE + MOB_ATK_K * L,
    defense: MOB_DEF_BASE + MOB_DEF_K * L,
    hp: MOB_HP_BASE + MOB_HP_K * L,
    attackSpeed: mob.baseSpeed ?? 1.0, // per-mob archetype cadence
    accuracy: MOB_ACC_BASE + MOB_ACC_K * L + (mob.accBonus ?? 0),
    evasion: MOB_EVA_BASE + MOB_EVA_K * L + (mob.evaBonus ?? 0),
    critChance: MOB_CRIT,
    blockChance: 0, // grounded beasts don't parry
    damageTakenMult: 1, // mobs take normal damage
  };
}

/** Expected damage per swing (mean variance = 1), including the per-exchange hit-chance,
 *  crit/block expectation, the defender's stance takenMult, and the per-attacker floor (§4.6.4). */
function expectedDmg(atk: CombatStats, def: CombatStats): number {
  const floor = Math.max(1, DAMAGE_FLOOR_FRAC * atk.attackPower);
  const critFactor = 1 + atk.critChance * (CRIT_MULT - 1);
  const blockFactor = 1 - def.blockChance * BLOCK_REDUCTION;
  const mitigated =
    (atk.attackPower - def.defense) * critFactor * blockFactor * def.damageTakenMult;
  return hitChance(atk, def) * Math.max(floor, mitigated);
}

/** Closed-form win probability (race-to-kill; deterministic, no sampling). §4.6.4b:
 *  P_win = TTK(mob→MC)/(TTK(MC→mob)+TTK(mob→MC)), DPS = attackSpeed·hitChance·E_dmg. */
export function analyticWinRate(mc: CombatStats, enemy: CombatStats): number {
  const dpsMc = mc.attackSpeed * expectedDmg(mc, enemy);
  const dpsEn = enemy.attackSpeed * expectedDmg(enemy, mc);
  const ttkMc = enemy.hp / dpsMc; // time for the MC to fell the foe
  const ttkEn = mc.hp / dpsEn; // time for the foe to fell the MC
  const p = 0.5 + (WINRATE_GAIN * (ttkEn - ttkMc)) / (ttkEn + ttkMc);
  return clamp(p, 0.02, 0.98);
}

// ── the seeded auto-resolve sim (deterministic replay over the combat cursor) ──
const DT = 0.1;

function swing(rng: Rng, atk: CombatStats, def: CombatStats): [number, Rng] {
  let r = rng;
  const [hit, r1] = nextChance(r, 'combat', hitChance(atk, def));
  r = r1;
  if (!hit) return [0, r];
  // ±DMG_VARIANCE (±15%) per-swing variance — smooths the curve so a fight is a genuine race.
  const [v, rv] = nextFloat(r, 'combat');
  r = rv;
  const variance = 1 - DMG_VARIANCE + 2 * DMG_VARIANCE * v;
  let mitigated = atk.attackPower * variance - def.defense;
  const [crit, r2] = nextChance(r, 'combat', atk.critChance);
  r = r2;
  if (crit) mitigated *= CRIT_MULT;
  const [block, r3] = nextChance(r, 'combat', def.blockChance);
  r = r3;
  if (block) mitigated *= 1 - BLOCK_REDUCTION;
  // stance: the defender's incoming-damage multiplier (RNG-free — no new draw, so seeded
  // replays stay byte-identical). Mobs have damageTakenMult = 1.
  mitigated *= def.damageTakenMult;
  // per-attacker floor applied ONCE, LAST (§4.6.4): chip damage that always lands.
  const floor = Math.max(1, DAMAGE_FLOOR_FRAC * atk.attackPower);
  return [Math.round(Math.max(floor, mitigated)), r];
}

export interface FightResult {
  readonly won: boolean;
  /** True when the MC broke off via the auto-retreat threshold (a flee, not a win/loss). */
  readonly fled: boolean;
  readonly mcHpLeft: number;
  readonly rounds: number;
  readonly rng: Rng;
}

export interface FoeForecast {
  readonly mob: MobDef;
  readonly winRate: number;
}

/**
 * The displayed/decision win-rate: a SAMPLE of the real sim (D-Q-winrate keeps the analytic
 * form for the M6 gate, but the per-foe FORECAST samples so it's honest — the closed form
 * over/under-states a lopsided race). Internally it averages over `n` independent sub-seeds,
 * so it estimates the TRUE win-probability for the given stat-state.
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

// The displayed forecast uses a FIXED base seed (NOT the run seed) + a larger sample, so it
// is SEED-ROBUST: every player sees the same representative win-rate for the same stat-state,
// and it matches the test/gate value. (Coupling it to the run seed made n=48 vary the headline
// — e.g. monkey@L1 read 0.33 at seed 1 but 0.48 at the shipped seed; the true value is ~0.30.)
const FORECAST_SEED = 0x9e3779b9;
const FORECAST_SAMPLES = 400; // converged (monkey@L1 ≈ 0.29, stable); ~5ms/forecast, fine off-frame

/** The grindable foes (danger order) with their seed-robust win-rate against the MC right now.
 *  Location-INDEPENDENT on purpose: this is "my win-rate if I fought this foe" — the combat curve
 *  the balance gates read. The SPATIAL "which foes are here" question is `foesHere` below. */
export function foeForecasts(state: GameState): FoeForecast[] {
  return GRINDABLE_MOBS.map((mob) => ({
    mob,
    // INT bestiary bonus applies only vs an already-encountered foe (its `mob-<id>` flag set),
    // so the forecast is foe-specific — a first-contact foe reads its no-bonus win-rate.
    winRate: sampledWinRate(
      mcCombatStats(state, state.flags[`mob-${mob.id}`] === true),
      mobCombatStats(mob),
      (FORECAST_SEED + mob.level * 7919) >>> 0,
      FORECAST_SAMPLES,
    ),
  }));
}

/** The grindable foes physically present AND reachable at the MC's current node (v0.3.1 Step 5b —
 *  foes are spatial). The combat tab's "watch" shows only these: you walk to a foe's ground to
 *  fight it. A foe gated to a later tier (`minTier` — e.g. the bandit, the first human threat held
 *  for T2 per A10) is excluded here even on its node, though it stays in the balance curve. */
export function foesHere(state: GameState): FoeForecast[] {
  return foeForecasts(state).filter(
    (fc) => fc.mob.area === state.location && (fc.mob.minTier ?? 0) <= state.tier,
  );
}

/** The foe's fighting tell, DERIVED from its archetype knobs (enemies.ts is the source of truth) —
 *  the cadence/accuracy/evasion character the player learns by fighting it. Empty knobs → 'plain'. */
export function foeTell(mob: MobDef): string {
  const parts: string[] = [];
  const speed = mob.baseSpeed ?? 1;
  if (speed >= 1.3) parts.push('fast');
  else if (speed <= 0.98) parts.push('heavy');
  if ((mob.evaBonus ?? 0) >= 4) parts.push('evasive');
  if ((mob.accBonus ?? 0) >= 3) parts.push('unerring');
  return parts.length ? parts.join(', ') : 'plain';
}

/** One Bestiary record (A7): the foe, whether it's been ENCOUNTERED (its `mob-<id>` flag set on
 *  first fight), its seed-robust win-rate forecast, its derived tell, and the node it haunts. The
 *  renderer fogs an un-encountered foe (mirrors the combat-tab scout-by-fighting fog). Pure over
 *  the same forecast the fight uses (AC-6), so a hurt fighter's shown win-rate drops for free. */
export interface BestiaryEntry {
  readonly mob: MobDef;
  readonly seen: boolean;
  readonly winRate: number;
  readonly tell: string;
}

export function bestiaryEntries(state: GameState): BestiaryEntry[] {
  return foeForecasts(state).map((fc) => ({
    mob: fc.mob,
    seen: state.flags[`mob-${fc.mob.id}`] === true,
    winRate: fc.winRate,
    tell: foeTell(fc.mob),
  }));
}

export function resolveFight(
  rng: Rng,
  mc: CombatStats,
  enemy: CombatStats,
  retreatHp = 0,
): FightResult {
  let mcHp = mc.hp;
  let enHp = enemy.hp;
  let mcTimer = 0;
  let enTimer = 0;
  const mcInt = 1 / mc.attackSpeed;
  const enInt = 1 / enemy.attackSpeed;
  let r = rng;
  let rounds = 0;
  let fled = false;
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
    // auto-retreat (batch-2 call 6): break off on a turn where HP drops below the threshold but is
    // still > 0. A killing blow (mcHp ≤ 0) ends the loop as a LOSS above — so a burst foe that
    // one-shots you past the threshold still wins; retreat only saves a survivable grind-down.
    if (retreatHp > 0 && mcHp > 0 && mcHp < retreatHp) {
      fled = true;
      break;
    }
  }
  return { won: enHp <= 0 && mcHp > 0, fled, mcHpLeft: Math.max(0, mcHp), rounds, rng: r };
}

// Game-balance constants (PRD §4, "proposed v1 balance" — tunable; the real ≥30-min
// rung floor is back-solved + locked at M6). Kept as data so the verifier and
// gen:docs own them. DEMO-tuned so the M0→M2 slice is reviewable in minutes while
// the auto-repeat "leave it running" feel reads true.

// ── Vitals (PRD §2.3, §6.4) ─────────────────────────────────────────────────────
export const HP_BASE = 30;
export const HP_PER_LEVEL = 6;
export const SATIETY_BASE = 100;
export const SATIETY_PER_LEVEL = 4;
export const COLD_OPEN_SATIETY = 64;

/** Soft-stamina throttle (FU16/FU21): the rate ramps down to the floor, never to 0. */
export const STAMINA_RATE_FLOOR = 0.5;
export const STAMINA_FLAT_ABOVE = 0.7;

// ── Cold-open economy (PRD §3.1, §5 T0.2 beat 1) ────────────────────────────────
export const RICE_PER_RAKE = 3;
export const SATIETY_PER_ACT = 2;
export const SATIETY_PER_REST = 18;
export const TICKS_PER_ACT = 2;

// ── Skills (PRD §4.5) — integer 1.3×-per-level XP curve (deterministic, no floats) ─
export const SKILL_XP_BASE = 12; // xp from level 1 → 2
export const SKILL_XP_GROWTH_NUM = 13;
export const SKILL_XP_GROWTH_DEN = 10;
export const SKILL_MAX_LEVEL = 99;
export const SKILL_VISIBILITY_XP = 1; // a skill surfaces once it has ANY xp (discover-by-doing)
export const SKILL_XP_PER_ACT = 5; // base XP a labour act grants its skill (the per-event cap)

// ── Activity yields (PRD §4.7.1) ────────────────────────────────────────────────
/** Autumn harvest multiplier (×1.3) applied to season-gated field yields. */
export const HARVEST_AUTUMN_MULT_NUM = 13;
export const HARVEST_AUTUMN_MULT_DEN = 10;

// ── Rung meter (PRD §4.1.1 / FU6) — per-rung-reset; DEMO thresholds in ranks.ts ──
/** Points a curated eligible activity adds to the current rung's meter. */
export const RUNG_POINTS_PER_ACT = 2;

// ── Conditioning gate (PRD §4.4/§4.6.1) — the ZERO-stat weak→capable enablement ──
/** Conditioning level needed to enter the first danger ring / be combat-capable. */
export const CONDITIONING_GATE_LEVEL = 2;

// ── Combat (PRD §4.6) — proposed v1 balance, tuned so the analytic first-fight
// win-rate lands in the LOCKED 20–35% band at adequate satiety (D-Q-winrate). ──
export const DAMAGE_FLOOR = 1;
export const HIT_CHANCE = 0.9;
export const CRIT_CHANCE = 0.1;
export const CRIT_MULT = 1.8;
export const BLOCK_CHANCE = 0.1;
export const BLOCK_REDUCTION = 0.5;
/** Smoothing gain for the closed-form win-probability (race-to-kill model). */
export const WINRATE_GAIN = 1.0;

/** Combat satiety throttle: attackPower × this floor when empty (FU16/§4.6.1b). */
export const COMBAT_SATIETY_FLOOR = 0.5;
export const COMBAT_SATIETY_FLAT_ABOVE = 0.7;

/** MC combat scaling per character (combat) level. */
export const MC_ATK_PER_LEVEL = 2;
export const MC_DEF_BASE = 2;
export const MC_DEF_PER_LEVEL = 1;

/** Enemy stat curve from MobDef.level (same curve family as the MC; Block N.1 #1). */
export const MOB_ATK_BASE = 4;
export const MOB_ATK_PER_LEVEL = 2;
export const MOB_DEF_PER_LEVEL = 1;
export const MOB_HP_BASE = 10;
export const MOB_HP_PER_LEVEL = 6;

/** Combat-XP → character level (integer 1.3× curve; combat-only, Q1/FU14). */
export const COMBAT_XP_BASE = 30;
export const COMBAT_XP_GROWTH_NUM = 13;
export const COMBAT_XP_GROWTH_DEN = 10;
export const COMBAT_MAX_LEVEL = 50;
/** Combat-XP a kill grants = MobDef.level × this (§4.6.5). */
export const COMBAT_XP_K = 6;

/** Soft-setback-on-loss (LOCKED shape, §4.6.6): never levels/gear/Influence. */
export const SETBACK_HP = 1;
export const SETBACK_TICKS = 12; // ~½ day
export const FORCED_REST_TICKS = 18;

// ── Durability bands (D-034/FU17): attackPower multiplier; never auto-unequipped ──
export const DURABILITY_BANDS: readonly { min: number; mult: number; name: string }[] = [
  { min: 75, mult: 1.0, name: 'Pristine' },
  { min: 50, mult: 0.9, name: 'Worn' },
  { min: 1, mult: 0.75, name: 'Battered' },
  { min: 0, mult: 0.55, name: 'Broken' },
];
export const DURABILITY_WEAR_PER_FIGHT = 2;
/** Wood to repair the equipped weapon to full (a coin/material sink, D-Q-craft+coin). */
export const REPAIR_WOOD_COST = 5;
/** Ticks the fight itself costs. */
export const FIGHT_TICKS = 2;

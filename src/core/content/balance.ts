// Game-balance constants (PRD §4, "proposed v1 balance" — tunable; the real ≥30-min
// rung floor is back-solved + locked at M6). Kept as data so the verifier and
// gen:docs own them. DEMO-tuned so the M0→M2 slice is reviewable in minutes while
// the auto-repeat "leave it running" feel reads true.

// ── Vitals (PRD §2.3, §6.4) ─────────────────────────────────────────────────────
export const HP_BASE = 32; // provisional (v0.2) — tune by playtest
export const HP_PER_LEVEL = 4; // provisional (v0.2) — tune by playtest
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

// ── Combat (PRD §4.6) — provisional v0.2 close-duel retune. Honest claim: the
// first-fight (monkey @L1) SAMPLED win-rate lands ~0.33 — humbling-but-winnable
// (G3/FU19) — and the full foe curve is a graded rolling frontier, NOT a single
// pinned 20–35% point estimate. The hit/crit/block feel is UNCHANGED; the grading
// comes from the stat economy + per-hit spread. Tune by playtest. ──
export const DAMAGE_FLOOR = 1;
export const HIT_CHANCE = 0.9;
export const CRIT_CHANCE = 0.1;
export const CRIT_MULT = 1.8;
export const BLOCK_CHANCE = 0.1;
export const BLOCK_REDUCTION = 0.5;
/** Smoothing gain for the closed-form win-probability (race-to-kill model). */
export const WINRATE_GAIN = 1.0;

/** Per-hit damage spread (multiplier = SPREAD_LO + SPREAD_SPAN·rand) — the only
 * variance knob; ~±45% (was the inline 0.7+0.6·v ≈ ±30%) so a fight is a genuine
 * race, not a binary stat-gap outcome. */
export const SPREAD_LO = 0.55; // provisional (v0.2) — tune by playtest
export const SPREAD_SPAN = 0.9; // provisional (v0.2) — tune by playtest

/** Combat satiety throttle: attackPower × this floor when empty (FU16/§4.6.1b). */
export const COMBAT_SATIETY_FLOOR = 0.5;
export const COMBAT_SATIETY_FLAT_ABOVE = 0.7;

/** MC combat scaling per character (combat) level. */
export const MC_ATK_PER_LEVEL = 3; // provisional (v0.2) — tune by playtest
export const MC_DEF_BASE = 3; // provisional (v0.2) — tune by playtest
export const MC_DEF_PER_LEVEL = 1;

/** Enemy stat curve from MobDef.level (same curve family as the MC; Block N.1 #1). */
export const MOB_ATK_BASE = 12; // provisional (v0.2) — tune by playtest
export const MOB_ATK_PER_LEVEL = 3; // provisional (v0.2) — tune by playtest
export const MOB_DEF_PER_LEVEL = 1;
export const MOB_HP_BASE = 24; // provisional (v0.2) — tune by playtest
export const MOB_HP_PER_LEVEL = 10; // provisional (v0.2) — tune by playtest

/** Combat-XP → character level (integer 1.3× curve; combat-only, Q1/FU14). */
export const COMBAT_XP_BASE = 40; // provisional (v0.2) — tune by playtest (slower, weightier climb)
export const COMBAT_XP_GROWTH_NUM = 13;
export const COMBAT_XP_GROWTH_DEN = 10;
export const COMBAT_MAX_LEVEL = 50;
/** Combat-XP a kill grants = MobDef.level × this (§4.6.5). */
export const COMBAT_XP_K = 5; // provisional (v0.2) — tune by playtest

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

// ── Combat stance (PRD §2.8 kendo kamae; D-Q-active-combat) — the active combat
// decision. Single source of truth for BOTH the combat math (mcCombatStats) and the
// durability-wear cost axis (fight.ts). jodan/chudan/gedan = Aggressive/Balanced/
// Guarded. atk/defense multipliers couple win-rate↔HP-retention, so Aggressive's
// COST lives on a separate axis: durability wear (jodan 3 / chudan 2 / gedan 1). ──
export type StanceId = 'jodan' | 'chudan' | 'gedan';
export interface StanceMod {
  readonly atkMult: number;
  /** Incoming-damage multiplier applied ON THE MC (the defender's takenMult). */
  readonly takenMult: number;
  readonly critAdd: number;
  readonly blockAdd: number;
  readonly wearMult: number;
}
export const STANCE_MODS: Record<StanceId, StanceMod> = {
  // provisional (v0.2) — tune by playtest
  chudan: { atkMult: 1.0, takenMult: 1.0, critAdd: 0.0, blockAdd: 0.0, wearMult: 1.0 },
  jodan: { atkMult: 1.35, takenMult: 1.15, critAdd: 0.05, blockAdd: -0.1, wearMult: 1.5 },
  gedan: { atkMult: 0.8, takenMult: 0.85, critAdd: 0.0, blockAdd: 0.15, wearMult: 0.5 },
};
/** Defensive → aggressive, for the UI segmented control. */
export const STANCE_ORDER: readonly StanceId[] = ['gedan', 'chudan', 'jodan'];

// ── Combat-curve gate constants (the SHARED single source the m2 combat-curve tests
// assert against). These are BANDS, not pinned point-estimates — the real sampled
// win-rate is seed/weapon-sensitive, so widen a band to engine reality, never tighten
// below it. Verified against foeForecasts(mc(lvl)) (n=48, run-seed 1, chudan / pole):
// monkey 0.33/0.65/0.94/0.98/1.00, wolf 0.04/0.23/0.54/0.85/0.96,
// boar 0.00/0.08/0.21/0.48/0.77, bandit 0.00/…/0.10 (L1-5), bandit L8 ≈ 0.75. ──
/** First-fight (monkey @L1) sampled win-rate band — humbling-but-winnable (G3/FU19). */
export const CURVE_FIRST_FOE_WR_MIN = 0.25; // provisional (v0.2) — tune by playtest
export const CURVE_FIRST_FOE_WR_MAX = 0.46; // provisional (v0.2) — tune by playtest
/** "A real choice exists" band: ≥2 foes should sit inside it at the mid levels. */
export const CURVE_CHOICE_BAND_MIN = 0.18; // provisional (v0.2) — tune by playtest
export const CURVE_CHOICE_BAND_MAX = 0.85; // provisional (v0.2) — tune by playtest
/** A foe at/below this is a dead (un-fightable) wall; a tier is never ALL-dead. */
export const CURVE_DEAD_TIER_MAX = 0.05; // provisional (v0.2) — tune by playtest
/** A foe at/above this is trivial (mastered); a tier is never ALL-trivial. */
export const CURVE_TRIVIAL_TIER_MIN = 0.95; // provisional (v0.2) — tune by playtest
/** The combat levels the no-all-dead / no-all-trivial invariant is checked at. */
export const CURVE_CHECKPOINT_LEVELS: readonly number[] = [1, 2, 3, 4];
/** Mastering the easiest foe must take real investment (dozens of fights, not ~5). */
export const CURVE_MASTERY_MIN_KILLS = 8; // provisional (v0.2) — tune by playtest

// ── Economy: skill → yield multiplier (audit #4) — a bounded "work → skill up →
// faster output → work" accelerator. Integer fixed-point (no Math.pow), applied as
// yield × (SKILL_YIELD_DEN + min((level-1)·PER_LEVEL_NUM, CAP_NUM)) / SKILL_YIELD_DEN.
// Rung pacing is per-ACT (RUNG_POINTS_PER_ACT, fixed) so the multiplier accelerates
// currency WITHOUT trivialising rung promotion. skillYieldNum(1) === DEN → L1 yields
// are byte-identical to v0.1. ──
export const SKILL_YIELD_DEN = 100; // fixed-point denominator for the skill yield multiplier
export const SKILL_YIELD_PER_LEVEL_NUM = 4; // +4% labour yield per skill level above 1 — provisional (v0.2) — tune by playtest
export const SKILL_YIELD_CAP_NUM = 200; // multiplier capped at +200% (×3.0), reached at skill L51 — provisional (v0.2) — tune by playtest

// ── Economy: sinks (audit #5) — the first-ever consumers of the surfaced labour
// values. Cook turns sansai → satiety; the estate (estate.ts) turns koku → a soft
// satietyMax buffer; spent attribute points feed combat (might/guard/vigor). ──
export const COOK_SANSAI_COST = 2; // sansai consumed per cooked meal — provisional (v0.2) — tune by playtest
export const COOK_SATIETY_RESTORE = 40; // satiety restored per meal (vs rest's +18) — provisional (v0.2) — tune by playtest
export const ATTR_MIGHT_ATK = 1; // +attackPower per allocated Might point — provisional (v0.2) — tune by playtest
export const ATTR_GUARD_DEF = 1; // +defense per allocated Guard point — provisional (v0.2) — tune by playtest
export const ATTR_VIGOR_HP = 3; // +hpMax per allocated Vigor point — provisional (v0.2) — tune by playtest

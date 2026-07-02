// Game-balance constants (PRD §4, "proposed v1 balance" — tunable; the real ≥30-min
// rung floor is back-solved + locked at M6). Kept as data so the verifier and
// gen:docs own them. DEMO-tuned so the M0→M2 slice is reviewable in minutes while
// the auto-repeat "leave it running" feel reads true.

// Type-only import (erased at runtime — no module cycle) so the rung-meter profile
// map can be keyed by the canonical RankId.
import type { RankId } from './ranks';

// ── Vitals (PRD §2.3, §4.6.1, §6.4) ─────────────────────────────────────────────
// hpMax = HP_BASE + HP_PER_LEVEL·characterLevel + STR_HP·STR (§4.6.1) — level (NOT level-1)
// so a fresh L1 base-STR MC reads 40 + 8·1 + 2·5 = 58 HP. Liquid (D-059) — tune by playtest.
export const HP_BASE = 40; // §4.6.1 — was 32 (v0.2 3-attr placeholder)
export const HP_PER_LEVEL = 8; // §4.6.1 — was 4
export const SATIETY_BASE = 100;
export const SATIETY_PER_LEVEL = 4;
export const COLD_OPEN_SATIETY = 64;

/** Soft-stamina throttle (FU16/FU21): the rate ramps down to the floor, never to 0. */
export const STAMINA_RATE_FLOOR = 0.5;
export const STAMINA_FLAT_ABOVE = 0.7;

// ── Cold-open economy (PRD §3.1, §5 T0.2 beat 1) ────────────────────────────────
/** Rice raked back from the spilled grain-store floor per rake act (D-107: this is genuinely
 *  RICE now — the real resource — not a coin alias). */
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

// ── Rung-meter thresholds (audit G-PACING) — D-056: the DEMO/REAL profile fork is RETIRED
// here at M2·8. ONE shipped profile, re-derived to the LOCKED T0 targets: R0 ≈ 5-min cold-open
// (D-022); the climb rungs ≈ 10–15 min each (battery R4#2); T0 is ≥30-min-floor-EXEMPT (the
// signed ≥30-min/rank floor gates from T1 per the 6-tier reshape, NOT T0 "quick but not easy").
// Review velocity now comes from the DEV-only 2×/4×/8× speed toggle (D-056) — NOT a fast profile.
// Single source of truth (gen:docs + verify-content + the pacing sim own it); mirrored by
// RankDef.meterThreshold (verifier-enforced). PROVISIONAL / liquid (D-059) — tune by
// `npm run pacing`. R0..R2 are simulator-verified to the targets; R3..R7 ride a gentle
// continuing ramp (the sim stops at R3, so they re-derive when the T0-combat path is simulated). ──
export const RUNG_METER_THRESHOLDS: Partial<Record<RankId, number>> = {
  R0: 1100, // ≈ 5-min cold-open
  R1: 2150, // ≈ 10 min
  R2: 2600, // ≈ 12 min
  R3: 2800, // ≈ 13 min (not sim-measured — sim stops at the R3 combat gate)
  R4: 2950,
  R5: 3100,
  R6: 3250,
  R7: 3400, // ≈ 16 min — the capstone, the longest climb
};
/** The active meter threshold for a rung (single profile — D-056, fork retired). */
export function rungThreshold(rankId: RankId): number {
  const t = RUNG_METER_THRESHOLDS[rankId];
  if (t === undefined) throw new Error(`no meter threshold for rung ${rankId}`);
  return t;
}

/** The active-only auto-loop cadence (ONE dispatched intent per interval). Single-sourced
 *  here so the app loop AND the pacing report share it (was a magic 480 in main.ts). */
export const AUTO_REPEAT_MS = 480;
/** Signed ≥30-min-per-rung wall floor — the pacing acceptance criterion that gates from T1
 *  (per the 6-tier reshape; T0 is EXEMPT, "quick but not easy"). Kept for when the T1+ pacing
 *  sim lands. provisional (v0.2). */
export const RUNG_WALL_FLOOR_MIN = 30;
/** T0 pacing band (D-056): the fork is retired, so T0 has ONE profile and instead of the ≥30
 *  floor each measured T0 climb rung must land in this sane band — slow enough not to be
 *  DEMO-trivial, fast enough to stay a tutorial tier. Targets: R0 ≈ 5-min cold-open, climb
 *  rungs ≈ 10–15 min. Liquid (D-059) — widen by playtest, never below the floor by stealth. */
export const T0_PACING_BAND_MIN = 3;
export const T0_PACING_BAND_MAX = 22;

// ── House-Influence pillars (M2·3 / D-049/D-055/D-057) — the macro engine. T0 Estate (家産)
// grade bands + the deed/seasonal accrual rates. All PROVISIONAL T0 magnitudes (liquid, D-059
// — re-derived at Ship-M1-F2); chosen so the THIN spine demonstrably CLOSES (deeds → EXCELLENT
// → ascension) and the season judge is a visible beat. ──
export const ESTATE_BANDS = { good: 240, great: 360, excellent: 480 } as const;
/** Per-deed cap = this/100 · GOOD (anti-spike: one deed can't jump the grade). 0.04·240 ≈ 10. */
export const PER_DEED_CAP_NUM = 4;
/** Estate standing a single Phase-2 labour act banks (a "deed"); under the per-deed cap. */
export const ESTATE_DEED_PER_ACT = 8;
/** The season judge contributes this fraction of the season's deed-growth — seasonal:deeds =
 *  3:7 = the 70/30 share (D-049). */
export const SEASONAL_OVER_DEEDS_NUM = 3;
export const SEASONAL_OVER_DEEDS_DEN = 7;
/** The season judge's ±10% swing on its payoff (a good/lean season), never net-negative (D-061). */
export const SEASONAL_SWING = 0.1;

// ── Ascension boon (M2·5 / D-049/D-062) — the permanent reward for ascending. The FIRST
// ascension always lands BIG (the base), and OVERSHOOTING the gate buys more (grade-scaled).
// Granted as attribute points (a real, permanent stat investment). provisional (v0.2, liquid). ──
export const ASCENSION_BOON_BASE_POINTS = 5; // the "always big" first-contact boon (D-062)
export const ASCENSION_BOON_OVERSHOOT_PER_POINT = 60; // +1 point per this much Estate-value past EXCELLENT

// ── Conditioning gate (PRD §4.4/§4.6.1) — the ZERO-stat weak→capable enablement ──
/** Conditioning level needed to enter the first danger ring / be combat-capable. */
export const CONDITIONING_GATE_LEVEL = 2;

// ── Combat (PRD §4.6 — the full 5-attr + accuracy/evasion model, Plan B v0.3.2). Five
// attributes STR/AGI/INT/SPD/LUCK drive the derived combat stats (§4.6.1); the per-swing
// exchange is accuracy/evasion hit-chance + ±15% variance + a per-attacker damage floor
// (§4.6.3/§4.6.4). The first-fight (monkey @L1, base attrs) SEED-ROBUST win-rate lands in
// the signed humbling-but-winnable 20–35% band (G3/FU19). Magnitudes liquid (D-059). ──

// ── The 5 attributes (§4.6.1 / §4.4). Each starts at ATTR_BASE (mediocre-start), soft-cap
// ~30; +1 point every ATTR_POINTS_PER_LEVELS character levels, allocated manually. ──
export type AttrId = 'str' | 'agi' | 'int' | 'spd' | 'luck';
export const ATTR_IDS: readonly AttrId[] = ['str', 'agi', 'int', 'spd', 'luck'];
export const ATTR_BASE = 5; // every attribute starts here (§4.6.1 mediocre-start)
export const ATTR_POINTS_PER_LEVELS = 2; // +1 attribute point per this many character levels (§4.4)

/** UI + log copy for each attribute (single source — the training panel and the spend_attribute
 *  log line both read this). `gain` is the short combat gloss; `log` is the diegetic spend line. */
export const ATTR_META: Record<
  AttrId,
  { label: string; kanji: string; gain: string; log: string }
> = {
  str: {
    label: 'STR',
    kanji: '力',
    gain: '+atk',
    log: 'You drill the cut until your shoulders burn. (STR +1)',
  },
  agi: {
    label: 'AGI',
    kanji: '敏',
    gain: '+eva·acc',
    log: 'You sharpen your footwork and your eye. (AGI +1)',
  },
  int: {
    label: 'INT',
    kanji: '智',
    gain: '+dmg·known',
    log: 'You study the beasts and learn their weak lines. (INT +1)',
  },
  spd: {
    label: 'SPD',
    kanji: '速',
    gain: '+speed',
    log: 'You loosen your swing until it flows quicker. (SPD +1)',
  },
  luck: {
    label: 'LUCK',
    kanji: '運',
    gain: '+crit·luck',
    log: 'You trust the moment; fortune leans a little your way. (LUCK +1)',
  },
};

// ── MC derived-stat coefficients (§4.6.1, T0: no gear/skill/armour terms) ──
export const STR_ATK_COEFF = 1.2; // attackPower += STR·this, inside the stance/satiety/dura scaling
export const STR_DEF_COEFF = 0.5; // defense = STR·this (no level term, no armour at T0)
export const STR_HP = 2; // hpMax += STR·this (§4.6.1)
export const AGI_EVA_COEFF = 0.6; // evasion = AGI·this
export const AGI_ACC_COEFF = 0.4; // accuracy = ACC_BASE + AGI·this
export const ACC_BASE = 10; // accuracy base term
export const SPD_ATKSPEED_COEFF = 0.005; // attackSpeed = weapon.baseSpeed·(1 + SPD·this)
export const CRIT_BASE = 0.02;
export const CRIT_AGI_COEFF = 0.002;
export const CRIT_LUCK_COEFF = 0.001;
export const CRIT_CHANCE_MAX = 0.5; // critChance clamp ceiling (§4.6.1)
/** INT combat effect (§4.4): +0.5%·INT damage vs bestiary-KNOWN foes only (keeps INT non-dump). */
export const INT_KNOWN_DMG_COEFF = 0.005;

// ── Per-swing damage exchange (§4.6.3/§4.6.4) ──
/** Hit-chance = clamp(accuracy/(accuracy+evasion), MIN, MAX) — replaces the flat 0.9. */
export const HIT_CHANCE_MIN = 0.15;
export const HIT_CHANCE_MAX = 0.95;
/** Per-swing damage variance: multiplier ∈ [1−this, 1+this] (±15%, replaces the ±45% spread). */
export const DMG_VARIANCE = 0.15;
/** Per-attacker damage floor = max(1, this·attackPower) — chip damage that always lands. */
export const DAMAGE_FLOOR_FRAC = 0.1;
export const CRIT_MULT = 1.5; // §4.6.4 — was 1.8
export const BLOCK_REDUCTION = 0.5;
/** Smoothing gain for the closed-form win-probability (race-to-kill model). */
export const WINRATE_GAIN = 1.0;

/** Combat satiety throttle: attackPower × this floor when empty (FU16/§4.6.1b). */
export const COMBAT_SATIETY_FLOOR = 0.5;
export const COMBAT_SATIETY_FLAT_ABOVE = 0.7;
// (COMBAT_HEAL_FRAC retired by D-076 — the auto-loop no longer auto-heals; HP accumulates and
//  mend is manual (cook). The unused constant + its now-false "unattended grind eats" doc were
//  removed so nothing claims a combat cadence the build doesn't run.)

/** Enemy stat curve — ONE linear-in-level rule per stat (§4.6.1d), plus per-mob archetype
 *  knobs (baseSpeed / accBonus / evaBonus in enemies.ts). Tuned so monkey@L1 lands in the
 *  20–35% first-fight band and the foe curve is a graded rolling frontier. Liquid (D-059). */
export const MOB_ATK_BASE = 9;
export const MOB_ATK_K = 0.8;
export const MOB_DEF_BASE = 1;
export const MOB_DEF_K = 0.7;
export const MOB_HP_BASE = 28;
export const MOB_HP_K = 6;
export const MOB_ACC_BASE = 11;
export const MOB_ACC_K = 1.5;
export const MOB_EVA_BASE = 1;
export const MOB_EVA_K = 1.2;
export const MOB_CRIT = 0.05; // grounded beasts' flat crit chance

/** Combat-XP → character level (integer 1.3× curve; combat-only, Q1/FU14). */
export const COMBAT_XP_BASE = 40; // provisional (v0.2) — tune by playtest (slower, weightier climb)
export const COMBAT_XP_GROWTH_NUM = 13;
export const COMBAT_XP_GROWTH_DEN = 10;
export const COMBAT_MAX_LEVEL = 50;
/** Combat-XP a kill grants = MobDef.level × this (§4.6.5). */
export const COMBAT_XP_K = 5; // provisional (v0.2) — tune by playtest

/** v0.2 narrative: the built-demo terminal beat (frontier capstone + 2nd dream) fires
 *  once the gate-watch reaches this combat level — proof they've truly fought the system
 *  R3 unlocks, not just clocked time. Recomputed for the v0.2 XP curve: cumXp(L3)=92
 *  (COMBAT_XP_BASE 40) and a monkey grants level×COMBAT_XP_K = 1×5 = 5 xp/kill, so ≈19
 *  monkey kills (the spec's '~12' was under the old BASE 30 / K 6). The ~0.29 monkey@L1
 *  win-rate makes this a genuine "you've fought" gate. Provisional (v0.2) — tune by playtest. */
export const R3_FRONTIER_COMBAT_LEVEL = 3;

/** Soft-setback-on-loss (LOCKED shape, §4.6.6): never levels/gear/Influence. */
export const SETBACK_HP = 1;
export const SETBACK_TICKS = 12; // ~½ day
export const FORCED_REST_TICKS = 18;

/** Loss penalty (D-076 + batch-2 call 7 + D-113): a lost fight drops this fraction of your CARRIED
 *  COIN + RICE (the two wealth resources); what's BANKED in the kura storehouse is SAFE. The "real
 *  bite" magnitude (batch-1 call 3) — liquid (D-059), tuned by playtest. koku (House standing) is
 *  never carried, so a loss never touches it (D-107). */
export const LOSS_COIN_FRAC = 0.2;
export const LOSS_MATERIAL_FRAC = 0.34;

/** Auto-retreat threshold (batch-2 call 6): the "auto-fight, retreat @20%" mode breaks off on a
 *  turn where HP drops below this fraction of MAX HP — a PER-TURN check, so a burst foe that kills
 *  outright still wins (a killing blow is a loss, not a flee). The safer auto-mode: no death, no
 *  loss-penalty, but it STOPS the autopilot (you mend + re-engage). Liquid (D-059). */
export const AUTO_RETREAT_FRAC = 0.2;

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
/** Coin to repair (v0.3.1 Step 4 — a recurring combat-UPKEEP coin sink; D-086 scarcity / batch-1
 *  call 4 / D-107). Closes the fight→coin→repair→fight loop (A4), so a grind pays its own upkeep.
 *  Liquid (D-059, tune by playtest). */
export const REPAIR_COIN_COST = 6;
/** Ticks the fight itself costs. */
export const FIGHT_TICKS = 2;

// ── Combat stance (PRD §2.8 kendo kamae, §4.6.10; D-Q-active-combat) — the active combat
// decision, simplified to the glass-cannon↔tank axis (A2). ONLY atkMult + takenMult: jodan
// (Aggressive) hits harder but takes more; gedan (Defensive) hits softer but takes less;
// chudan (Balanced) is identity. Because HP carries between fights (no auto-heal), the tank's
// lower damage-taken genuinely trades against the glass-cannon's output — NO stance is strictly
// dominated, Balanced is not a trap. Weapon wear is NO LONGER stance-dependent (flat, fight.ts). ──
export type StanceId = 'jodan' | 'chudan' | 'gedan';
export interface StanceMod {
  readonly atkMult: number;
  /** Incoming-damage multiplier applied ON THE MC (the defender's takenMult). */
  readonly takenMult: number;
}
export const STANCE_MODS: Record<StanceId, StanceMod> = {
  // §4.6.10 — liquid (D-059), tune by playtest
  chudan: { atkMult: 1.0, takenMult: 1.0 },
  jodan: { atkMult: 1.35, takenMult: 1.15 },
  gedan: { atkMult: 0.8, takenMult: 0.85 },
};
/** Defensive → aggressive, for the UI segmented control. */
export const STANCE_ORDER: readonly StanceId[] = ['gedan', 'chudan', 'jodan'];

// ── Combat-curve gate constants (the SHARED single source the m2 combat-curve tests
// assert against). These are BANDS, not pinned point-estimates — the real sampled
// win-rate is weapon-sensitive, so widen a band to engine reality, never tighten below it.
// Verified against the SEED-ROBUST foeForecasts(mc(lvl)) (chudan / pristine pole, STR-leaning
// build), full satiety — Plan B v0.3.2 5-attr model, A9 roster, L1-5 then L8:
// rice_rats 0.66/0.96/0.99/1.00/1.00 (the gentle warmup), monkey 0.29/0.69/0.78/0.90/0.93
// (trivial ≈L6), monkey_troop 0.11/0.37/0.48/0.66/0.74 (the high-eva lesson),
// wolf 0.03/0.35/0.51/0.70/0.80, mamushi 0.12/0.61/0.76/0.86/0.94 (the fast biter),
// boar 0.07/0.45/0.62/0.79/0.88, bandit 0.00/0.00/0.00/0.01/0.02 (L1-5), bandit L8 ≈ 0.90. ──
/** First-fight (monkey @L1) win-rate band — the signed humbling-but-winnable G3/FU19 (20–35%);
 *  the seed-robust forecast lands ~0.30 here (full satiety), in band and seed-independent. */
export const CURVE_FIRST_FOE_WR_MIN = 0.2; // provisional (v0.2) — tune by playtest
export const CURVE_FIRST_FOE_WR_MAX = 0.35; // provisional (v0.2) — tune by playtest
/** "A real choice exists" band: ≥2 foes should sit inside it at the mid levels (a 0.15
 *  longshot is a real choice once the Aggressive stance lifts it ~10–20pt). */
export const CURVE_CHOICE_BAND_MIN = 0.15; // provisional (v0.2) — tune by playtest
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
// values. Cook turns sansai → satiety; the estate (estate.ts) turns coin → a soft
// satietyMax buffer; spent attribute points feed combat (the 5 attrs, §4.6.1). ──
export const COOK_SANSAI_COST = 2; // sansai consumed per cooked meal — provisional (v0.2) — tune by playtest
/** HP a hot meal mends (D-050: eating is the ONLY HP heal — couples combat ↔ cook sink).
 *  F22: cook recovers HEALTH *only* now — the belly/work-stamina (satiety) refill is the
 *  separate `rest` action (SATIETY_PER_REST); a meal no longer doubles as a work-rest, so the
 *  old COOK_SATIETY_RESTORE was retired. Sized so a couple of meals returns a hurt fighter to
 *  fighting shape. provisional (v0.2). */
export const COOK_HP_RESTORE = 14;

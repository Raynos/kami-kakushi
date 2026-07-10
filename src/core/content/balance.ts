// Game-balance constants (PRD §4, "proposed v1 balance" — tunable; the real ≥30-min
// rung floor is back-solved + locked at M6). Kept as data so the verifier and
// gen:docs own them. DEMO-tuned so the M0→M2 slice is reviewable in minutes while
// the auto-repeat "leave it running" feel reads true.

// Type-only (erased) — the rice season-price table is keyed by the canonical Season.
import type { Season } from '../constants';

// ── Vitals (PRD §2.3, §4.6.1, §6.4) ─────────────────────────────────────────────
// hpMax = HP_BASE + HP_PER_LEVEL·characterLevel + STR_HP·STR (§4.6.1) — level (NOT level-1)
// so a fresh L1 base-STR MC reads 40 + 8·1 + 2·5 = 58 HP. Liquid (ADR-059) — tune by playtest.
export const HP_BASE = 40; // §4.6.1 — was 32 (v0.2 3-attr placeholder)
export const HP_PER_LEVEL = 8; // §4.6.1 — was 4
export const SATIETY_BASE = 100;
export const SATIETY_PER_LEVEL = 4;
export const COLD_OPEN_SATIETY = 64;

/** Soft-stamina throttle (FU16/FU21): the rate ramps down to the floor, never to 0. */
export let STAMINA_RATE_FLOOR = 0.5;
export let STAMINA_FLAT_ABOVE = 0.7;

// ── Cold-open economy (PRD §3.1, §5 T0.2 beat 1) ────────────────────────────────
/** Rice raked back from the spilled grain-store floor per rake act (ADR-107: this is genuinely
 *  RICE now — the real resource — not a coin alias). */
// `let`, not `const`: a curated set of feel levers is DEV-live-tunable via the balance cockpit
// (FB-7 / ADR-059). Only this module reassigns them (through `__setBalanceLever` at the file foot); the
// setter is DEV-folded dead code in prod, so canon semantics are untouched and `prefer-const` stays
// green (the binding IS reassigned in-module). Every call site reads the live binding unchanged.
export let RICE_PER_RAKE = 2; // R9 (2026-07-05): 3→2, trim the faucet (W1) — human-adopted via FB-7
export let SATIETY_PER_ACT = 2;
export let SATIETY_PER_REST = 18;
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

// ── Rung progression (FB-121 / ADR-137): the points meter is GONE. Each rung's authored
// requirement list lives in narrative/requirements.md → content/requirements.ts; tuning is
// edit → gen:narrative → sim — no balance.ts mirror, no cockpit slider (the locked design). ──

/** The active-only auto-loop cadence (ONE dispatched intent per interval). Single-sourced
 *  here so the app loop AND the pacing report share it (was a magic 480 in main.ts). */
export const AUTO_REPEAT_MS = 480;
/** Signed ≥30-min-per-rung wall floor — the pacing acceptance criterion that gates from T1
 *  (per the 6-tier reshape; T0 is EXEMPT, "quick but not easy"). Kept for when the T1+ pacing
 *  sim lands. provisional (v0.2). */
export const RUNG_WALL_FLOOR_MIN = 30;
/** T0 pacing band (ADR-056): the fork is retired, so T0 has ONE profile and instead of the ≥30
 *  floor each measured T0 climb rung must land in this sane band — slow enough not to be
 *  DEMO-trivial, fast enough to stay a tutorial tier. Targets: R0 ≈ 5-min cold-open, climb
 *  rungs ≈ 10–15 min. Liquid (ADR-059) — widen by playtest, never below the floor by stealth. */
export const T0_PACING_BAND_MIN = 3;
export const T0_PACING_BAND_MAX = 22;
/** Phase 2 ≈ Phase 1 in wall-time (ADR-133, HD-19): the capstone→ascension grind should take roughly
 *  as long as the R0→R7 climb. A GENERAL rule across tiers (a tunable playtest default, not frozen)
 *  — expressed as a RATIO (phase2Wall / phase1Wall) so it single-sources the "equal time" law and
 *  auto-scales to every tier's Phase 1, rather than N hand-signed per-tier minute bands. Gated HARD
 *  (`verify:balance`), but ONLY for tiers whose Phase 2 is actually built (today: T0) — it no-ops
 *  where there is no Phase-2 economy yet, so it never cries wolf on an unbuilt tier. Liquid (ADR-059). */
export const PHASE2_PHASE1_RATIO_MIN = 0.8;
export const PHASE2_PHASE1_RATIO_MAX = 1.2;

// ── House-Influence pillars (M2·3 / ADR-049/ADR-055/ADR-057) — the macro engine. T0 Estate (家産)
// grade bands + the deed/seasonal accrual rates. All PROVISIONAL T0 magnitudes (liquid, ADR-059
// — re-derived at Ship-M1-F2); chosen so the THIN spine demonstrably CLOSES (deeds → EXCELLENT
// → ascension) and the season judge is a visible beat. ──
// C4.7 (ADR-159): the six-step ladder's lower rungs — BAD/OK thresholds are sim-owned
// intermediate steps (ADR-132); the T0 ascension gate stays EXCELLENT (480), untouched.
export const ESTATE_BANDS = { bad: 80, ok: 160, good: 240, great: 360, excellent: 480 } as const;
/** Per-deed cap = this/100 · GOOD (anti-spike: one deed can't jump the grade). 0.04·240 ≈ 10. */
export let PER_DEED_CAP_NUM = 4;
/** Estate standing a single Phase-2 labour act banks (a "deed") — a SUB-koku fraction, accumulated
 *  (`PillarState.frac`) and banked as whole koku when it crosses 1. Fractional so Phase 2 grinds at
 *  ~1:1 with Phase 1's wall-time (ADR-133 · the `PHASE2_PHASE1_RATIO_BAND` gate) WITHOUT inflating the
 *  480-koku ascension gate (which must stay a small, minor-household standing below the 10,000-koku
 *  daimyō line — a bigger threshold would collapse the inter-tier koku ladder). This is the ADR-133
 *  STOPGAP: it buys the duration honestly (one day's labour barely moves a household's standing) but
 *  NOT the texture — the real Phase-2 economy redesign (long AND fun) supersedes it. Liquid (ADR-059);
 *  tuned against the sim to land greedy's Phase 2 inside the ratio band.
 *  // SUPERSEDED by opus-2026-07-04-phase2-economy-redesign (ADR-145): this is now the BASE
 *  // magnitude the multi-source table below multiplies — re-derived at the plan's Phase 3.
 *  ADR-170 (HD-34, human 2026-07-10): re-tuned 0.05 → 0.22 against the sim — the story rewrite
 *  shrank Phase 1 while this base (tuned to the OLD climb) stood, drifting the ratio to ~4.4–5×;
 *  the signed ≈1:1 law (ADR-133) holds, so the base scales back into the [0.8, 1.2] band.
 *  HD-35 re-pace (human, 2026-07-10): 0.22 → 0.6 — the R3 re-pace shrank the climb ~224 →
 *  ~76 min, so the same ≈1:1 law scales Phase 2 to match (ratio re-centers at ~0.95). */
export let ESTATE_DEED_PER_ACT = 0.6;
/** ADR-145 — the Phase-2 economy is MULTI-SOURCE (the A+B loop): each Estate deed source banks
 *  `ESTATE_DEED_PER_ACT · its multiplier`, so the sources stay distinct in cadence AND magnitude
 *  while the single base stays the one cockpit lever. Estate-relevant work ONLY banks (ADR-145 Q4
 *  — TST3, the fiction causes the accrual): woodcut/forage have NO source. All PROVISIONAL /
 *  liquid (ADR-059) — retuned in the plan's Phase 3 against the ADR-133 ratio band.
 *   - fields   · farm_paddy — the reclaimed shinden/paddy work, the steady earner
 *   - stores   · haul_stores + a rice deposit at the kura — granary stocking
 *   - workshop · craft_weapon — the workshop's recorded yield (rare, bigger)
 *   - watch    · a WON grind fight — the house is safer (Arms stays T1-gated)
 *   - treasury · sell_rice — coin into the house books (the Q3 store-vs-sell lever) */
export type EstateDeedSource = 'fields' | 'stores' | 'workshop' | 'watch' | 'treasury';
export const ESTATE_DEED_SOURCE_MULT: Record<EstateDeedSource, number> = {
  fields: 1,
  stores: 1,
  workshop: 2,
  watch: 1.5,
  treasury: 1.25,
};
/** ADR-145 (the B half) — the staged E0→E1 BUILD is Phase 2's spine: estate stage U<k> now needs
 *  BANKED Estate standing (koku, `influence.estate.value`) ≥ this gate BESIDE its coin cost, so
 *  the U1–U4 ladder arrives as paced build beats across the deed climb to EXCELLENT (480) instead
 *  of a fast coin dash. Index = stage−1 (U1..U4). U1 stays 0 — Phase-1 purchasable, today's
 *  behavior; U2+ imply Phase 2 (deeds only bank post-capstone). PROVISIONAL / liquid (ADR-059) —
 *  the plan's Phase-3 retune spreads these against the ratio band. */
export const ESTATE_STAGE_DEED_GATES: readonly number[] = [0, 90, 220, 380];
/** The season judge contributes this fraction of the season's deed-growth — seasonal:deeds =
 *  3:7 = the 70/30 share (ADR-049). */
export const SEASONAL_OVER_DEEDS_NUM = 3;
export const SEASONAL_OVER_DEEDS_DEN = 7;
/** The season judge's ±10% swing on its payoff (a good/lean season), never net-negative (ADR-061). */
export const SEASONAL_SWING = 0.1;
/** The mythic ceiling the House's koku STANDING climbs toward — the DAIMYŌ line (10,000 koku, the
 *  historical daimyō threshold; ADR-109's tier→koku ladder reaches it at T4). At T0 it is ONLY a
 *  NAMED HORIZON on the standing panel — the far destination that gives the small T0 koku number a
 *  direction — it gates nothing here (the T0 gate is EXCELLENT via ESTATE_BANDS). The ladder bands
 *  are liquid (ADR-059), but 10,000 = the daimyō line is fixed. Single source for the "10,000 koku"
 *  copy — never hard-type the number in the renderer/tests (AC-21). */
export const DAIMYO_KOKU = 10_000;

// ── Ascension boon (M2·5 / ADR-049/ADR-062) — the permanent reward for ascending. The FIRST
// ascension always lands BIG (the base), and OVERSHOOTING the gate buys more (grade-scaled).
// Granted as attribute points (a real, permanent stat investment). provisional (v0.2, liquid). ──
export const ASCENSION_BOON_BASE_POINTS = 5; // the "always big" first-contact boon (ADR-062)
export const ASCENSION_BOON_OVERSHOOT_PER_POINT = 60; // +1 point per this much Estate-value past EXCELLENT

// ── Conditioning gate (PRD §4.4/§4.6.1) — the ZERO-stat weak→capable enablement ──
/** Conditioning level needed to enter the first danger ring / be combat-capable. */
export const CONDITIONING_GATE_LEVEL = 2;

// ── Combat (PRD §4.6 — the full 5-attr + accuracy/evasion model, Plan B v0.3.2). Five
// attributes STR/AGI/INT/SPD/LUCK drive the derived combat stats (§4.6.1); the per-swing
// exchange is accuracy/evasion hit-chance + ±15% variance + a per-attacker damage floor
// (§4.6.3/§4.6.4). The first-fight (monkey @L1, base attrs) SEED-ROBUST win-rate lands in
// the signed humbling-but-winnable 20–35% band (G3/FU19). Magnitudes liquid (ADR-059). ──

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
// (COMBAT_HEAL_FRAC retired by ADR-076 — the auto-loop no longer auto-heals; HP accumulates and
//  mend is manual (cook). The unused constant + its now-false "unattended grind eats" doc were
//  removed so nothing claims a combat cadence the build doesn't run.)

/** Enemy stat curve — ONE linear-in-level rule per stat (§4.6.1d), plus per-mob archetype
 *  knobs (baseSpeed / accBonus / evaBonus in enemies.ts). Tuned so monkey@L1 lands in the
 *  20–35% first-fight band and the foe curve is a graded rolling frontier. Liquid (ADR-059). */
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
/** Combat-XP a kill grants = MobDef.level × this (§4.6.5).
 *  HD-35 re-pace (human, 2026-07-10): 5 → 20 — the ~19-kill grind dragged a ~123-min
 *  life-support loop (526 cooks / 379 walks / 158 forages on the canonical seed) behind
 *  R3's fights, blowing the [3, 22] band ~8×; ~5 kills keeps the "you've fought" gate
 *  while the rung sims in band. Tuned against `verify:balance`, sim-owned (ADR-132). */
export const COMBAT_XP_K = 20;

/** v0.2 narrative: the built-demo terminal beat (frontier capstone + 2nd dream) fires
 *  once the gate-watch reaches this combat level — proof they've truly fought the system
 *  R3 unlocks, not just clocked time. Recomputed for the v0.2 XP curve: cumXp(L3)=92
 *  (COMBAT_XP_BASE 40) and a monkey grants level×COMBAT_XP_K = 1×20 = 20 xp/kill, so ≈5
 *  monkey kills (was ≈19 pre-HD-35; the spec's '~12' was under the old BASE 30 / K 6).
 *  The ~0.29 monkey@L1 win-rate makes this a genuine "you've fought" gate. Provisional
 *  (v0.2) — tune by playtest. */
export const R3_FRONTIER_COMBAT_LEVEL = 3;

/** Soft-setback-on-loss (LOCKED shape, §4.6.6): never levels/gear/Influence. */
export const SETBACK_HP = 1;
export const SETBACK_TICKS = 12; // ~½ day
export const FORCED_REST_TICKS = 18;

/** Low-HP work impairment (storywave G3 — ADR-155/ADR-164, the missing coupling): below
 *  LOW_HP_WORK_THRESHOLD of hpMax an injured body works at LOW_HP_WORK_MULT (yield + speed).
 *  The coupling is strictly ONE-WAY — low HP slows labour, labour NEVER costs HP (satiety is the
 *  work fuel). SIM-OWNED (ADR-132): seed values, tuned by the balance sim, not the DEV cockpit. */
export const LOW_HP_WORK_THRESHOLD = 0.3; // fraction of hpMax below which work is impaired
export const LOW_HP_WORK_MULT = 0.5; // yield/speed multiplier while injured

/** Defeat → sickroom (storywave G3 — ADR-155/ADR-164): a loss costs this many whole days (routed
 *  toward the sickroom), ON TOP of the carried-loss bleed + Sōan's growing ledger — the double-cost
 *  curve. SIM-OWNED (ADR-132): seed value, sim-tuned. The paid treatment / manual rest-at-sickroom
 *  that MEND HP are G4 sickroom content; HP has no auto-trickle (ADR-164). */
export const SICKROOM_DAYS_LOST = 2;

/** Loss penalty (ADR-076 + batch-2 call 7 + ADR-113): a lost fight drops this fraction of your CARRIED
 *  COIN + RICE (the two wealth resources); what's BANKED in the kura storehouse is SAFE. The "real
 *  bite" magnitude (batch-1 call 3) — liquid (ADR-059), tuned by playtest. koku (House standing) is
 *  never carried, so a loss never touches it (ADR-107). */
export let LOSS_COIN_FRAC = 0.2;
export let LOSS_MATERIAL_FRAC = 0.34;

/** Ambient log-texture cadence (C4.3 — the bible §0.5 "flavor in the log" half): the chance an
 *  ordinary day boundary breathes one authored season/weather line into the Now view, and the
 *  chance a MARKET day adds a stall-gossip line. Cockpit levers; magnitudes sim-owned (ADR-132). */
export let TEXTURE_DAY_CHANCE = 0.25;
export let TEXTURE_MARKET_CHANCE = 0.5;

/** Auto-retreat threshold (batch-2 call 6): the "auto-fight, retreat @20%" mode breaks off on a
 *  turn where HP drops below this fraction of MAX HP — a PER-TURN check, so a burst foe that kills
 *  outright still wins (a killing blow is a loss, not a flee). The safer auto-mode: no death, no
 *  loss-penalty, but it STOPS the autopilot (you mend + re-engage). Liquid (ADR-059). */
export let AUTO_RETREAT_FRAC = 0.2;

// ── Durability bands (ADR-034/FU17): attackPower multiplier; never auto-unequipped ──
export const DURABILITY_BANDS: readonly { min: number; mult: number; name: string }[] = [
  { min: 75, mult: 1.0, name: 'Pristine' },
  { min: 50, mult: 0.9, name: 'Worn' },
  { min: 1, mult: 0.75, name: 'Battered' },
  { min: 0, mult: 0.55, name: 'Broken' },
];
export const DURABILITY_WEAR_PER_FIGHT = 2;
/** Wood to repair the equipped weapon to full (a coin/material sink, D-Q-craft+coin). */
export let REPAIR_WOOD_COST = 5;
/** Coin to repair (v0.3.1 Step 4 — a recurring combat-UPKEEP coin sink; ADR-086 scarcity / batch-1
 *  call 4 / ADR-107). Closes the fight→coin→repair→fight loop (A4), so a grind pays its own upkeep.
 *  Liquid (ADR-059, tune by playtest). */
export let REPAIR_COIN_COST = 6;
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
  // §4.6.10 — liquid (ADR-059), tune by playtest
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
// Rung progression counts ACTS (FB-121 requirement counts), so the multiplier accelerates
// currency WITHOUT trivialising rung promotion. skillYieldNum(1) === DEN → L1 yields
// are byte-identical to v0.1. ──
export const SKILL_YIELD_DEN = 100; // fixed-point denominator for the skill yield multiplier
export let SKILL_YIELD_PER_LEVEL_NUM = 4; // +4% labour yield per skill level above 1 — provisional (v0.2) — tune by playtest
export let SKILL_YIELD_CAP_NUM = 200; // multiplier capped at +200% (×3.0), reached at skill L51 — provisional (v0.2) — tune by playtest

// ── Economy: sinks (audit #5) — the first-ever consumers of the surfaced labour
// values. Cook turns sansai → satiety; the estate (estate.ts) turns coin → a soft
// satietyMax buffer; spent attribute points feed combat (the 5 attrs, §4.6.1). ──
export let COOK_SANSAI_COST = 2; // sansai consumed per cooked meal — provisional (v0.2) — tune by playtest
/** HP a hot meal mends (ADR-050: eating is the ONLY HP heal — couples combat ↔ cook sink).
 *  FB-22: cook recovers HEALTH *only* now — the belly/work-stamina (satiety) refill is the
 *  separate `rest` action (SATIETY_PER_REST); a meal no longer doubles as a work-rest, so the
 *  old COOK_SATIETY_RESTORE was retired. Sized so a couple of meals returns a hurt fighter to
 *  fighting shape (2×35 = 70 ≳ the R3-window hpMax ~64). HD-35 re-pace (2026-07-10): 14 → 35 —
 *  at 14 the R3 grind cooked 526 meals on the canonical seed (~70 min of the rung's 163);
 *  sim-owned (ADR-132), tuned against the [3, 22] band. provisional (v0.2). */
export let COOK_HP_RESTORE = 35;

// ── Rice sinks (ADR-107 Phase 2) — rice becomes a REAL resource with three uses: EAT it (→ satiety),
// STORE it in the kura (deposit/withdraw), or SELL it for coin at a SEASON-swinging price. This is
// what closes the "rice has no consumer" gap (integrity ledger) + restores the coin faucet. All
// numbers provisional (v0.2, liquid ADR-059) — tune by playtest / `pnpm run pacing`. ──

/** Rice one plain-rice meal consumes (the `eat_rice` satiety path, beside `rest`/`cook_meal`). */
export let EAT_RICE_COST = 2; // R9 (2026-07-05): 3→2, narrow eat's coin gap vs free rest (W3)
/** Work-stamina (satiety) a plain-rice meal restores. Sized ABOVE a free `rest` (SATIETY_PER_REST,
 *  18) on purpose — the DESIGN LEVER that keeps eat_rice from being dominated by rest: a proper
 *  meal refuels FASTER than merely resting, trading your own rice for readiness (never strictly
 *  worse than a free rest, never the only satiety source). provisional (v0.2, liquid ADR-059).
 *  `let` for the FB-7 balance cockpit — see RICE_PER_RAKE. */
export let EAT_RICE_SATIETY = 30;

/** Rice SELL price — COIN paid per unit of rice, SWINGING BY SEASON (ADR-107 / §14): DEAR in the
 *  lean spring, CHEAP at the autumn glut — a light store-vs-sell TIMING decision that pairs with
 *  the kura (hold the cheap-autumn haul, sell into the dear spring). No live forex — a fixed
 *  per-season table (the Dōjima swing, abstracted to seasons). Base unit mon. The MONOTONIC
 *  DIRECTION (spring dearest, autumn cheapest) is the design lever the tests assert; the exact
 *  magnitudes are provisional (v0.2, liquid ADR-059). */
export const RICE_SELL_PRICE_BY_SEASON: Record<Season, number> = {
  winter: 5,
  'new-year': 5, // storywave G1 seed: new-year takes winter's price (sim-owned, ADR-132)
  spring: 6, // lean spring — rice is DEAR (the best season to sell)
  summer: 5,
  bon: 5, // storywave G1 seed: Bon takes summer's price (sim-owned, ADR-132)
  autumn: 4, // R9 (2026-07-05): 3→4, narrow the swing to 6:4 (W2) — still the cheapest season
};
/** The current coin-per-rice sell price for a season (pure — keyed off the season selector). */
export function riceSellPrice(season: Season): number {
  return RICE_SELL_PRICE_BY_SEASON[season];
}

// ── Rice STORAGE COST (ADR-118 / build-plan §1) — holding rice must COST something so the seasonal
// store-vs-sell choice is LIVE. The shipped kura was free, lossless and loss-safe, so "always hold
// until spring" dominated. TWO levers, both applied here: (a) SPOILAGE — a per-season decay on ALL
// rice, CARRIED and BANKED, so pure hoarding always bleeds and you can't out-store the loss; (b) a
// KURA CAPACITY CAP — the kura holds only N rice, and raising N is an estate/kura upgrade (a coin
// sink + a reason to invest). Magnitudes LIQUID (ADR-059) — tuned by feel. Integer fixed-point (no
// floats), so spoilage stays deterministic (no RNG) and fold-invariant with the clock (B10). ──
/** Fraction of held rice that spoils on each season turn (carried + banked): floor(held·NUM/DEN). */
export const RICE_SPOILAGE_NUM = 1; // ≈10% per season — a real bleed on a hoard, gentle on a small pile
export const RICE_SPOILAGE_DEN = 10;
/** Rice lost to spoilage from a pile on a season turn — floor(held·NUM/DEN). Pure + deterministic
 *  (no RNG), so it folds one-day-at-a-time with the clock (B10 / engine fold-invariance). Applied to
 *  the CARRIED and the BANKED pile SEPARATELY (each floors on its own), so a split hoard isn't a dodge. */
export function riceSpoilage(held: number): number {
  if (held <= 0) return 0;
  return Math.floor((held * RICE_SPOILAGE_NUM) / RICE_SPOILAGE_DEN);
}
/** The kura's RICE capacity — a base cap raised by each estate/kura upgrade stage you've bought
 *  (improve_estate). A real wall you INVEST past (the coin sink of §1's lever (b)); only rice is
 *  capped (coin/materials bank freely — the cap is the rice-hoard governor, not a bank limit).
 *  U0 120 · U1 200 · U2 280 · U3 360 · U4 440. Liquid (ADR-059). */
export const KURA_RICE_CAP_BASE = 120;
export const KURA_RICE_CAP_PER_STAGE = 80;
export function kuraRiceCap(estateStage: number): number {
  return KURA_RICE_CAP_BASE + Math.max(0, estateStage) * KURA_RICE_CAP_PER_STAGE;
}

// ── The measured-kura rice model (ADR-163 / G4.5, the soft-cap two-lane economy) ──────────────
// The KIND lane, made grind-proof by construction: each labour SITE carries a per-season yield
// POOL that depletes with DIMINISHING RETURNS (each act takes a fraction of what remains, so
// output asymptotes toward — never reaches — zero within a season), and REFILLS when the season
// turns (this is *why* seasons are manual containers). Rice deposits into the kura in shō; the
// household eats a steady shō/day; held stores spoil per season; Autumn's nengu draws koku.
//
// ALL magnitudes below are SIM-OWNED SEEDS (ADR-132) — the balance sim verdicts them; do NOT
// hand-tune. Keyed by the labour SITE (the activity's `area` string) so balance.ts stays acyclic
// (no import of ActivityId — AC-20).

/** Per-(site, season) base yield POOL, in the site's own yield unit (shō for the paddy, wood for
 *  the woodlot, sansai for forage). Refilled to this at season-turn; drawn down as the site is
 *  worked. A site absent here falls back to POOL_DEFAULT. SIM-OWNED SEED (ADR-132). */
export const SITE_POOL_BASE: Readonly<Record<string, number>> = {
  paddies: 300, // the rice pool (shō) — the household's staple faucet
  forecourt: 120, // porter's-wage hauling (coin)
  woodlot: 160, // wood + forage greens
};
/** Fallback pool for any labour site not in SITE_POOL_BASE. SIM-OWNED SEED (ADR-132). */
export const SITE_POOL_DEFAULT = 120;

/** The diminishing-returns DRAW: one act yields ceil(remaining · NUM/DEN), floored at 1 (while the
 *  pool has anything left) and capped at what remains. NUM/DEN = 1/6 seeds a pool that thins to a
 *  trickle over ~a dozen acts, never fully dry within a season. SIM-OWNED SEED (ADR-132). */
export const POOL_DRAW_NUM = 1;
export const POOL_DRAW_DEN = 6;

/** The season-refill pool for a site — the base, lifted by the autumn-harvest peak when the site is
 *  season-gated (the paddy peaks Autumn). Pure; the caller passes whether this site rides the
 *  harvest multiplier. SIM-OWNED SEED (ADR-132). */
export function sitePoolRefill(site: string, season: Season, seasonHarvest: boolean): number {
  const base = SITE_POOL_BASE[site] ?? SITE_POOL_DEFAULT;
  if (seasonHarvest && season === 'autumn') {
    return Math.round((base * HARVEST_AUTUMN_MULT_NUM) / HARVEST_AUTUMN_MULT_DEN);
  }
  return base;
}

/** One labour act's yield off a remaining pool, via the diminishing-returns curve. Returns 0 only
 *  when the pool is exhausted; otherwise ≥1 (min a single unit while anything remains). Pure +
 *  deterministic (no RNG) — folds cleanly with the reducer. */
export function productionDraw(remaining: number): number {
  if (remaining <= 0) return 0;
  const draw = Math.ceil((remaining * POOL_DRAW_NUM) / POOL_DRAW_DEN);
  return Math.min(remaining, Math.max(1, draw));
}

/** The household's steady daily rice CONSUMPTION (shō/day), drawn from the kura each day-turn —
 *  the constant background drain that makes rice working capital, never a score. Scales with
 *  household size in later tiers; a flat single-mouth draw at T0. SIM-OWNED SEED (ADR-132). */
export const CONSUMPTION_SHO_PER_DAY = 3;

/** The nengu (年貢) — Autumn's land-tax reckoning, stated in KOKU. Met from the kura (converted to
 *  shō via SHO_PER_KOKU) at the Autumn season-exit; the shortfall is the debt's felt pressure,
 *  never numbered in T0. SIM-OWNED SEED (ADR-132). */
export const NENGU_KOKU_DEMAND = 5;

// ── Emergent node discovery (ADR-146) — the pity ramp + the hint ladder step. Liquid (ADR-059).
// Re-tuned to the human's "rare ambient" feel-verdict (2026-07-07, HR-14 playtest): a discovery
// is a many-visits background surprise (~50+ qualifying acts), never an instant pop — each def
// also carries a `minAttempts` FLOOR (no roll at all before it), so hint 0 → hint 1 is a real
// arc. The first tune (12% base, 1/4 slope, step 3) latched in ~5 cuts ≈ 3 seconds. ──
/** Each qualifying attempt BEYOND a def's floor raises the seeded roll's effective chance by this
 *  RELATIVE fraction of the base (integer fixed-point): eff = chance·(DEN + n·NUM)/DEN, clamped
 *  to 1. Persistence pays without a hard wall (the plan's Phase-2 trigger 3), gently: at
 *  NUM/DEN = 1/10, the 20th post-floor attempt rolls at 3× the base chance. */
export const DISCOVERY_PITY_NUM = 1;
export const DISCOVERY_PITY_DEN = 10;
/** Attempts per hint-ladder step (ADR-146 tightening hints): hint index = floor(attempts/STEP),
 *  clamped to the authored ladder's last line. */
export const DISCOVERY_HINT_STEP = 12;

// ── DEV-only live-tuning hook (balance cockpit, FB-7 / ADR-059) ─────────────────────────────────────
// INERT unless called: only the DEV-folded cockpit (src/ui/dev-cockpit.ts) ever calls these, and
// the whole DEV branch dead-code-eliminates from prod — so tests, sims, scripts and the shipped
// game all run CANON. Only the DECLARING module can reassign its own `export let` bindings, so the
// setter must live HERE. The `balance-override:` string literal in the throws survives minification
// and is the strip-gate marker (verify-dev-strip.sh). CONTRACT: nothing outside ui/dev-cockpit.ts
// (and its tests) may import these — they exist to serve the HUMAN's feel-tuning, never to move a
// number into canon on an agent's behalf (ADR-059). Purity: no DOM / no `import.meta` — core stays
// env-free so the tsx scripts (pacing-report, balance-sim) keep importing it cleanly.
//
// An explicit `switch` (not a dynamic table) keeps `tsc` owning the path list. The full §2 curated
// set: scalar levers reassign their own `let` binding; STRUCTURED map paths (ESTATE_BANDS.*,
// STANCE_MODS.*, RICE_SELL_PRICE_BY_SEASON.*) mutate the runtime object IN
// PLACE — `readonly`/`as const` is compile-time only, so a local cast is safe and importers reading
// the property/helper at call time see the change. `readBalanceLever` + `__setBalanceLever` MUST
// stay in lockstep; the cockpit's registry round-trip test (set→read→reset every path) is the guard.

/** Read a lever's CURRENT (possibly overridden) value by its cockpit path. */
export function readBalanceLever(path: string): number {
  switch (path) {
    // W1 · rice faucet / coin
    case 'RICE_PER_RAKE':
      return RICE_PER_RAKE;
    case 'SKILL_YIELD_PER_LEVEL_NUM':
      return SKILL_YIELD_PER_LEVEL_NUM;
    case 'SKILL_YIELD_CAP_NUM':
      return SKILL_YIELD_CAP_NUM;
    // W2 · store-vs-sell (season price table — six seasons, storywave G1)
    case 'RICE_SELL_PRICE_BY_SEASON.winter':
      return RICE_SELL_PRICE_BY_SEASON.winter;
    case 'RICE_SELL_PRICE_BY_SEASON.new-year':
      return RICE_SELL_PRICE_BY_SEASON['new-year'];
    case 'RICE_SELL_PRICE_BY_SEASON.spring':
      return RICE_SELL_PRICE_BY_SEASON.spring;
    case 'RICE_SELL_PRICE_BY_SEASON.summer':
      return RICE_SELL_PRICE_BY_SEASON.summer;
    case 'RICE_SELL_PRICE_BY_SEASON.bon':
      return RICE_SELL_PRICE_BY_SEASON.bon;
    case 'RICE_SELL_PRICE_BY_SEASON.autumn':
      return RICE_SELL_PRICE_BY_SEASON.autumn;
    // W3 · eat-rice vs rest
    case 'EAT_RICE_SATIETY':
      return EAT_RICE_SATIETY;
    case 'EAT_RICE_COST':
      return EAT_RICE_COST;
    case 'SATIETY_PER_REST':
      return SATIETY_PER_REST;
    // W4 · capstone pacing
    case 'ESTATE_BANDS.bad':
      return ESTATE_BANDS.bad;
    case 'ESTATE_BANDS.ok':
      return ESTATE_BANDS.ok;
    case 'ESTATE_BANDS.good':
      return ESTATE_BANDS.good;
    case 'ESTATE_BANDS.great':
      return ESTATE_BANDS.great;
    case 'ESTATE_BANDS.excellent':
      return ESTATE_BANDS.excellent;
    case 'ESTATE_DEED_PER_ACT':
      return ESTATE_DEED_PER_ACT;
    case 'ESTATE_DEED_SOURCE_MULT.fields':
      return ESTATE_DEED_SOURCE_MULT.fields;
    case 'ESTATE_DEED_SOURCE_MULT.stores':
      return ESTATE_DEED_SOURCE_MULT.stores;
    case 'ESTATE_DEED_SOURCE_MULT.workshop':
      return ESTATE_DEED_SOURCE_MULT.workshop;
    case 'ESTATE_DEED_SOURCE_MULT.watch':
      return ESTATE_DEED_SOURCE_MULT.watch;
    case 'ESTATE_DEED_SOURCE_MULT.treasury':
      return ESTATE_DEED_SOURCE_MULT.treasury;
    case 'PER_DEED_CAP_NUM':
      return PER_DEED_CAP_NUM;
    // Stamina / meals
    case 'SATIETY_PER_ACT':
      return SATIETY_PER_ACT;
    case 'STAMINA_RATE_FLOOR':
      return STAMINA_RATE_FLOOR;
    case 'STAMINA_FLAT_ABOVE':
      return STAMINA_FLAT_ABOVE;
    case 'COOK_SANSAI_COST':
      return COOK_SANSAI_COST;
    case 'COOK_HP_RESTORE':
      return COOK_HP_RESTORE;
    // Rung pacing (threshold levers carry the ranks.ts meterThreshold mirror in the export)
    // Sinks / upkeep
    case 'REPAIR_COIN_COST':
      return REPAIR_COIN_COST;
    case 'REPAIR_WOOD_COST':
      return REPAIR_WOOD_COST;
    // Combat feel
    case 'STANCE_MODS.jodan.atkMult':
      return STANCE_MODS.jodan.atkMult;
    case 'STANCE_MODS.jodan.takenMult':
      return STANCE_MODS.jodan.takenMult;
    case 'STANCE_MODS.gedan.atkMult':
      return STANCE_MODS.gedan.atkMult;
    case 'STANCE_MODS.gedan.takenMult':
      return STANCE_MODS.gedan.takenMult;
    case 'LOSS_COIN_FRAC':
      return LOSS_COIN_FRAC;
    case 'LOSS_MATERIAL_FRAC':
      return LOSS_MATERIAL_FRAC;
    case 'AUTO_RETREAT_FRAC':
      return AUTO_RETREAT_FRAC;
    case 'TEXTURE_DAY_CHANCE':
      return TEXTURE_DAY_CHANCE;
    case 'TEXTURE_MARKET_CHANCE':
      return TEXTURE_MARKET_CHANCE;
    default:
      throw new Error(`balance-override: unknown lever ${path}`);
  }
}

/** Override a curated lever live (DEV cockpit only). Scalars reassign this module's own binding;
 *  structured map paths mutate the object in place. Every importer's next read sees the new value. */
export function __setBalanceLever(path: string, value: number): void {
  switch (path) {
    // W1
    case 'RICE_PER_RAKE':
      RICE_PER_RAKE = value;
      return;
    case 'SKILL_YIELD_PER_LEVEL_NUM':
      SKILL_YIELD_PER_LEVEL_NUM = value;
      return;
    case 'SKILL_YIELD_CAP_NUM':
      SKILL_YIELD_CAP_NUM = value;
      return;
    // W2 (six seasons, storywave G1)
    case 'RICE_SELL_PRICE_BY_SEASON.winter':
      RICE_SELL_PRICE_BY_SEASON.winter = value;
      return;
    case 'RICE_SELL_PRICE_BY_SEASON.new-year':
      RICE_SELL_PRICE_BY_SEASON['new-year'] = value;
      return;
    case 'RICE_SELL_PRICE_BY_SEASON.spring':
      RICE_SELL_PRICE_BY_SEASON.spring = value;
      return;
    case 'RICE_SELL_PRICE_BY_SEASON.summer':
      RICE_SELL_PRICE_BY_SEASON.summer = value;
      return;
    case 'RICE_SELL_PRICE_BY_SEASON.bon':
      RICE_SELL_PRICE_BY_SEASON.bon = value;
      return;
    case 'RICE_SELL_PRICE_BY_SEASON.autumn':
      RICE_SELL_PRICE_BY_SEASON.autumn = value;
      return;
    // W3
    case 'EAT_RICE_SATIETY':
      EAT_RICE_SATIETY = value;
      return;
    case 'EAT_RICE_COST':
      EAT_RICE_COST = value;
      return;
    case 'SATIETY_PER_REST':
      SATIETY_PER_REST = value;
      return;
    // W4 — ESTATE_BANDS is `as const` (compile-time readonly); cast to mutate the runtime object.
    case 'ESTATE_BANDS.bad':
      (ESTATE_BANDS as { bad: number }).bad = value;
      return;
    case 'ESTATE_BANDS.ok':
      (ESTATE_BANDS as { ok: number }).ok = value;
      return;
    case 'ESTATE_BANDS.good':
      (ESTATE_BANDS as { good: number }).good = value;
      return;
    case 'ESTATE_BANDS.great':
      (ESTATE_BANDS as { great: number }).great = value;
      return;
    case 'ESTATE_BANDS.excellent':
      (ESTATE_BANDS as { excellent: number }).excellent = value;
      return;
    case 'ESTATE_DEED_PER_ACT':
      ESTATE_DEED_PER_ACT = value;
      return;
    // ADR-145 — the mult table is a mutable object; assign fields in place (cockpit tuning).
    case 'ESTATE_DEED_SOURCE_MULT.fields':
      ESTATE_DEED_SOURCE_MULT.fields = value;
      return;
    case 'ESTATE_DEED_SOURCE_MULT.stores':
      ESTATE_DEED_SOURCE_MULT.stores = value;
      return;
    case 'ESTATE_DEED_SOURCE_MULT.workshop':
      ESTATE_DEED_SOURCE_MULT.workshop = value;
      return;
    case 'ESTATE_DEED_SOURCE_MULT.watch':
      ESTATE_DEED_SOURCE_MULT.watch = value;
      return;
    case 'ESTATE_DEED_SOURCE_MULT.treasury':
      ESTATE_DEED_SOURCE_MULT.treasury = value;
      return;
    case 'PER_DEED_CAP_NUM':
      PER_DEED_CAP_NUM = value;
      return;
    // Stamina / meals
    case 'SATIETY_PER_ACT':
      SATIETY_PER_ACT = value;
      return;
    case 'STAMINA_RATE_FLOOR':
      STAMINA_RATE_FLOOR = value;
      return;
    case 'STAMINA_FLAT_ABOVE':
      STAMINA_FLAT_ABOVE = value;
      return;
    case 'COOK_SANSAI_COST':
      COOK_SANSAI_COST = value;
      return;
    case 'COOK_HP_RESTORE':
      COOK_HP_RESTORE = value;
      return;
    // Sinks / upkeep
    case 'REPAIR_COIN_COST':
      REPAIR_COIN_COST = value;
      return;
    case 'REPAIR_WOOD_COST':
      REPAIR_WOOD_COST = value;
      return;
    // Combat feel — StanceMod fields are `readonly`; cast to mutate in place.
    case 'STANCE_MODS.jodan.atkMult':
      (STANCE_MODS.jodan as { atkMult: number }).atkMult = value;
      return;
    case 'STANCE_MODS.jodan.takenMult':
      (STANCE_MODS.jodan as { takenMult: number }).takenMult = value;
      return;
    case 'STANCE_MODS.gedan.atkMult':
      (STANCE_MODS.gedan as { atkMult: number }).atkMult = value;
      return;
    case 'STANCE_MODS.gedan.takenMult':
      (STANCE_MODS.gedan as { takenMult: number }).takenMult = value;
      return;
    case 'LOSS_COIN_FRAC':
      LOSS_COIN_FRAC = value;
      return;
    case 'LOSS_MATERIAL_FRAC':
      LOSS_MATERIAL_FRAC = value;
      return;
    case 'AUTO_RETREAT_FRAC':
      AUTO_RETREAT_FRAC = value;
      return;
    case 'TEXTURE_DAY_CHANCE':
      TEXTURE_DAY_CHANCE = value;
      return;
    case 'TEXTURE_MARKET_CHANCE':
      TEXTURE_MARKET_CHANCE = value;
      return;
    default:
      throw new Error(`balance-override: unknown lever ${path}`);
  }
}

/** The canon (module-init) value of every cockpit lever, keyed by path. A PLAIN LITERAL (references
 *  the bindings directly, never the setter/switch) so the whole DEV hook still tree-shakes from prod
 *  — captured HERE, before any setter runs, so no magic number is hand-copied (derive from source). */
export const BALANCE_CANON: Readonly<Record<string, number>> = Object.freeze({
  RICE_PER_RAKE,
  SKILL_YIELD_PER_LEVEL_NUM,
  SKILL_YIELD_CAP_NUM,
  'RICE_SELL_PRICE_BY_SEASON.winter': RICE_SELL_PRICE_BY_SEASON.winter,
  'RICE_SELL_PRICE_BY_SEASON.new-year': RICE_SELL_PRICE_BY_SEASON['new-year'],
  'RICE_SELL_PRICE_BY_SEASON.spring': RICE_SELL_PRICE_BY_SEASON.spring,
  'RICE_SELL_PRICE_BY_SEASON.summer': RICE_SELL_PRICE_BY_SEASON.summer,
  'RICE_SELL_PRICE_BY_SEASON.bon': RICE_SELL_PRICE_BY_SEASON.bon,
  'RICE_SELL_PRICE_BY_SEASON.autumn': RICE_SELL_PRICE_BY_SEASON.autumn,
  EAT_RICE_SATIETY,
  EAT_RICE_COST,
  SATIETY_PER_REST,
  'ESTATE_BANDS.bad': ESTATE_BANDS.bad,
  'ESTATE_BANDS.ok': ESTATE_BANDS.ok,
  'ESTATE_BANDS.good': ESTATE_BANDS.good,
  'ESTATE_BANDS.great': ESTATE_BANDS.great,
  'ESTATE_BANDS.excellent': ESTATE_BANDS.excellent,
  ESTATE_DEED_PER_ACT,
  'ESTATE_DEED_SOURCE_MULT.fields': ESTATE_DEED_SOURCE_MULT.fields,
  'ESTATE_DEED_SOURCE_MULT.stores': ESTATE_DEED_SOURCE_MULT.stores,
  'ESTATE_DEED_SOURCE_MULT.workshop': ESTATE_DEED_SOURCE_MULT.workshop,
  'ESTATE_DEED_SOURCE_MULT.watch': ESTATE_DEED_SOURCE_MULT.watch,
  'ESTATE_DEED_SOURCE_MULT.treasury': ESTATE_DEED_SOURCE_MULT.treasury,
  PER_DEED_CAP_NUM,
  SATIETY_PER_ACT,
  STAMINA_RATE_FLOOR,
  STAMINA_FLAT_ABOVE,
  COOK_SANSAI_COST,
  COOK_HP_RESTORE,
  REPAIR_COIN_COST,
  REPAIR_WOOD_COST,
  'STANCE_MODS.jodan.atkMult': STANCE_MODS.jodan.atkMult,
  'STANCE_MODS.jodan.takenMult': STANCE_MODS.jodan.takenMult,
  'STANCE_MODS.gedan.atkMult': STANCE_MODS.gedan.atkMult,
  'STANCE_MODS.gedan.takenMult': STANCE_MODS.gedan.takenMult,
  LOSS_COIN_FRAC,
  LOSS_MATERIAL_FRAC,
  AUTO_RETREAT_FRAC,
  TEXTURE_DAY_CHANCE,
  TEXTURE_MARKET_CHANCE,
});

/** Reset every overridden lever back to its canon value (the cockpit's "Reset all to canon"). */
export function __resetBalanceLevers(): void {
  for (const path of Object.keys(BALANCE_CANON)) __setBalanceLever(path, BALANCE_CANON[path]!);
}

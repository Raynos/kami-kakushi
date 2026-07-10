// Derived/computed reads (PRD §6.4 core/selectors): pure functions of GameState,
// nothing stored. satietyMax/hpMax grow with level; season/week/year/lunar derive
// from the absolute day (D-Q6); the stamina rate is the soft throttle (FU16/FU21).

import type { GameState } from './state';
import {
  HP_BASE,
  HP_PER_LEVEL,
  STR_HP,
  SATIETY_BASE,
  SATIETY_PER_LEVEL,
  SATIETY_PER_ACT,
  STAMINA_RATE_FLOOR,
  STAMINA_FLAT_ABOVE,
  LOW_HP_WORK_THRESHOLD,
  LOW_HP_WORK_MULT,
  CONDITIONING_GATE_LEVEL,
  SKILL_YIELD_DEN,
  ESTATE_STAGE_DEED_GATES,
  HARVEST_AUTUMN_MULT_NUM,
  HARVEST_AUTUMN_MULT_DEN,
  productionDraw,
} from './content/balance';
import { ESTATE_STAGES, type EstateStageDef } from './content/estate';
import {
  BELONGINGS,
  HOME_SURFACE,
  comfortBonus,
  homeHasCookLocus,
  type BelongingDef,
} from './content/home';
import {
  DAYS_PER_WEEK,
  SEASONS,
  LUNAR_PERIOD_DAYS,
  SHO_PER_BALE,
  SHO_PER_KOKU,
  type Season,
} from './constants';
import { clamp } from './math';
import { ACTIVITIES, type ActivityDef, type LabourResource } from './content/activities';
import { PEOPLE, presenceCtx, type NodePerson } from './content/people';
import { isUnlocked } from './unlock';
import { hiddenActivityIds } from './discovery';
import { skillLevel, skillYieldNum } from './skills';

/** hpMax = HP_BASE + HP_PER_LEVEL·characterLevel + STR_HP·STR (§4.6.1). */
export function hpMax(state: GameState): number {
  return HP_BASE + state.character.level * HP_PER_LEVEL + STR_HP * state.character.attrs.str;
}

/** Cumulative satietyMax bonus from the bought-out estate stages (the coin sink). */
export function estateSatietyBonus(state: GameState): number {
  let b = 0;
  for (const s of ESTATE_STAGES) if (state.estateStage >= s.stage) b += s.satietyMaxBonus;
  return b;
}

/** The cumulative labour-yield multiplier from the estate stages, in fixed-point /SKILL_YIELD_DEN
 *  (T0-M4-F2 / ADR-051: the compounding coin flywheel). estateYieldNum(E0) === SKILL_YIELD_DEN, so a
 *  fresh estate is identity; each bought stage lifts every labour act's output. */
export function estateYieldNum(state: GameState): number {
  let bonus = 0;
  for (const s of ESTATE_STAGES) if (state.estateStage >= s.stage) bonus += s.yieldBonusNum;
  return SKILL_YIELD_DEN + bonus;
}

// ── HOME / belongings (ADR-111 / FB-89) — the comfort register, pure over GameState ──────────────────

/** Does the MC own this belonging? A GRANTED keepsake (mat/bowl) is auto-owned once the home surface
 *  latches — the promised things arrive WITH the corner, not as a purchase; a BUY piece is owned once
 *  it's in `state.belongings`. */
export function ownsBelonging(state: GameState, id: string): boolean {
  const def = BELONGINGS.find((b) => b.id === id);
  if (!def) return false;
  if (def.source.kind === 'granted') return isUnlocked(state, HOME_SURFACE);
  return state.belongings.includes(id);
}

/** The full owned-belonging id set (granted-with-home ∪ bought). The single read the comfort math
 *  and the UI both go through, so preview and reality never drift (AC-6). Empty until the home exists. */
export function ownedBelongingIds(state: GameState): Set<string> {
  const owned = new Set<string>();
  for (const def of BELONGINGS) if (ownsBelonging(state, def.id)) owned.add(def.id);
  return owned;
}

/** Owned belongings, as their defs (for the Inventory tab's owned list). */
export function ownedBelongings(state: GameState): BelongingDef[] {
  return BELONGINGS.filter((b) => ownsBelonging(state, b.id));
}

/** Extra satiety a `rest` restores from owned comfort furniture (bedding + the settled-home set).
 *  0 until you own comfort furniture, so it is inert pre-home and for a bare corner. */
export function homeRestBonus(state: GameState): number {
  return comfortBonus(ownedBelongingIds(state), 'rest');
}

/** satietyMax buffer from owned comfort furniture (`body` comfort) — the personal-scale mirror of the
 *  estate buffer (curve-neutral: never touches the full-satiety combat win-rate). ADR-120 retired the
 *  hearth/chest `body` bonuses (hearth homes cook, chest is storage), so no T0 piece feeds this today;
 *  kept as the live channel for a future warmth piece. */
export function homeSatietyBonus(state: GameState): number {
  return comfortBonus(ownedBelongingIds(state), 'body');
}

/** Belongings STORAGE capacity from owned furniture (the chest, ADR-120) — a prestige buffer for what's
 *  yours, read through the SAME comfort math the UI shows (AC-6). 0 until you own a storage piece. */
export function homeStorageBonus(state: GameState): number {
  return comfortBonus(ownedBelongingIds(state), 'storage');
}

/** ADR-120 — is a cook locus (the hearth) among your owned belongings? Drives the home's cook affordance. */
export function homeHasCook(state: GameState): boolean {
  return homeHasCookLocus(ownedBelongingIds(state));
}

/** satietyMax grows with combat level (FU21/Q47) + the estate buffer (audit #5) + the home comfort
 *  buffer (ADR-111 — a warm, dry corner keeps more of your body's reserve). */
export function satietyMax(state: GameState): number {
  return (
    SATIETY_BASE +
    (state.character.level - 1) * SATIETY_PER_LEVEL +
    estateSatietyBonus(state) +
    homeSatietyBonus(state)
  );
}

/** The current season — STORED, MANUAL state (storywave G1): a season is a container the
 *  player ends with `advance_season`, never derived from the day. */
export function season(state: GameState): Season {
  return state.season;
}

export function week(state: GameState): number {
  return Math.floor(state.clock.day / DAYS_PER_WEEK);
}

/** Year (1-based) — derived from the count of season boundaries crossed (one full wheel = a
 *  year). The month/year counter stays HIDDEN in T0 (bible); this is for internal cadence. */
export function year(state: GameState): number {
  return 1 + Math.floor(state.seasonsPassed / SEASONS.length);
}

// ── The measured-kura rice display (ADR-163 / G4.5, TST4) ───────────────────────────────────────
// Rice is stored ONLY as shō in the kura (`banked.rice`). These derive the magnitude-appropriate
// DISPLAY units — the kura reads in bales, the nengu surfaces a koku total; wages/meals read raw
// shō. The player never sees a unit-less "N rice" integer.

/** Raw rice in the kura, in shō (the stored integer). */
export function kuraRiceSho(state: GameState): number {
  return state.banked.rice ?? 0;
}
/** The kura's rice as BALES (俵) — the storehouse display unit. Fractional (one decimal) so a
 *  part-bale still reads honestly. */
export function kuraBales(state: GameState): number {
  return Math.round((kuraRiceSho(state) / SHO_PER_BALE) * 10) / 10;
}
/** The kura's rice as KOKU (石) — the reckoning unit, surfaced at the nengu. Fractional (one
 *  decimal). */
export function kuraKoku(state: GameState): number {
  return Math.round((kuraRiceSho(state) / SHO_PER_KOKU) * 10) / 10;
}

/** The production YIELD one labour act at `site` would produce right now, off the site's remaining
 *  seasonal pool via the diminishing-returns curve (ADR-163). 0 once the pool is worked out for the
 *  season. Routes through the SAME `productionDraw` the reducer uses (AC-6 — forecast == reality). */
export function siteYield(state: GameState, site: string): number {
  return productionDraw(state.sitePools[site] ?? 0);
}

// ── The per-act labour forecast (FB-264, AC-6 — forecast == reality) ─────────────────────────────

export interface ActivityForecast {
  /** The site-pool draw this act would take (0 = the site is worked out this season). */
  readonly rawDraw: number;
  /** Effective yields after every live multiplier (throttle, autumn, skill, estate). */
  readonly gained: Partial<Record<LabourResource, number>>;
  /** Effective skill XP — the same workRate scaling the reducer pays. */
  readonly xp: number;
}

/** What ONE `do_activity` act would pay right now. The reducer CALLS this (never a copy), so any
 *  preview built on it can't drift from reality — the same seam as mcCombatStats/siteYield. Pure
 *  read: it never depletes the pool or spends satiety.
 *  The multiplier chain (G3 throttle × autumn × skill × estate over the site-pool draw) lives
 *  here; `do_activity` keeps only the state writes. */
export function activityForecast(state: GameState, act: ActivityDef): ActivityForecast {
  const rate = workRate(state);
  const autumn = act.seasonHarvest === true && season(state) === 'autumn';
  // Skill level is read BEFORE this act's addSkillXp on purpose: the leveling act uses the
  // pre-level mult; the bump shows on the NEXT act. skillYieldNum(1) === DEN → L1 is identity.
  const yNum = skillYieldNum(skillLevel(state, act.skill));
  // the estate flywheel (T0-M4-F2): identity (===DEN) at U0 — byte-identical pre-buy.
  const eNum = estateYieldNum(state);
  // ADR-163 — the primary yield rides the per-(site, season) pool's diminishing-returns draw;
  // secondary "pocket" yields keep their fixed base.
  const rawDraw = productionDraw(state.sitePools[act.area] ?? 0);
  const yieldEntries = Object.entries(act.yields) as [LabourResource, number][];
  const primary = yieldEntries[0]?.[0];
  const gained: Partial<Record<LabourResource, number>> = {};
  for (const [res, amt] of yieldEntries) {
    // a worked-out pool yields nothing on the primary.
    if (res === primary && rawDraw === 0) {
      gained[res] = 0;
      continue;
    }
    let v = (res === primary ? rawDraw : amt) * rate;
    if (autumn) v = (v * HARVEST_AUTUMN_MULT_NUM) / HARVEST_AUTUMN_MULT_DEN;
    v = (v * yNum) / SKILL_YIELD_DEN;
    v = (v * eNum) / SKILL_YIELD_DEN;
    gained[res] = Math.max(1, Math.round(v));
  }
  const xp = Math.max(1, Math.round(act.xp * rate));
  return { rawDraw, gained, xp };
}

/** Continuous lunar phase in [0,1) — a real ~29.53d ephemeris, not a per-day roll (D-Q6). */
export function lunarPhase(state: GameState): number {
  const frac = (state.clock.day % LUNAR_PERIOD_DAYS) / LUNAR_PERIOD_DAYS;
  return frac < 0 ? frac + 1 : frac;
}

/** The NEW-MOON window (±~1 day around phase 0) — the hooded-lantern nights: the G2
 *  mystery seam the night rounds key their sighting beats off (C4.4). */
export function isNewMoon(state: GameState): boolean {
  const p = lunarPhase(state);
  return p < 0.04 || p > 0.96;
}

/**
 * The soft stamina throttle multiplier on the action rate (FU16/FU21): flat (1.0)
 * above STAMINA_FLAT_ABOVE of satietyMax, ramping down to STAMINA_RATE_FLOOR as
 * satiety empties. It SLOWS the day; it never hard-blocks (floor > 0).
 */
export function staminaRate(state: GameState): number {
  const frac = satietyMax(state) > 0 ? state.character.satiety / satietyMax(state) : 0;
  if (frac >= STAMINA_FLAT_ABOVE) return 1;
  // linear from FLOOR at frac=0 to 1.0 at frac=FLAT_ABOVE
  const t = clamp(frac / STAMINA_FLAT_ABOVE, 0, 1);
  return STAMINA_RATE_FLOOR + (1 - STAMINA_RATE_FLOOR) * t;
}

/**
 * The low-HP work impairment (storywave G3 — ADR-155/ADR-164, the missing coupling): an injured
 * body works worse. Below LOW_HP_WORK_THRESHOLD of hpMax the multiplier drops to LOW_HP_WORK_MULT,
 * else it is 1 (no impairment). This only READS hp to slow labour — the coupling is strictly
 * ONE-WAY, so labour never writes hp back (satiety, not HP, is the work fuel).
 */
export function lowHpWorkMult(state: GameState): number {
  const max = hpMax(state);
  const frac = max > 0 ? state.character.hp / max : 0;
  return frac < LOW_HP_WORK_THRESHOLD ? LOW_HP_WORK_MULT : 1;
}

/**
 * The labour-facing work rate: the satiety soft-throttle (staminaRate) FURTHER scaled by the low-HP
 * impairment (lowHpWorkMult). Labour reads THIS; the stamina BAR keeps reading staminaRate (satiety
 * only), so the HP coupling slows work without mislabelling the stamina meter (TST4).
 */
export function workRate(state: GameState): number {
  return staminaRate(state) * lowHpWorkMult(state);
}

export interface LabourOption {
  readonly activity: ActivityDef;
  readonly available: boolean;
  readonly reason?: string;
}

/** FB-265 — a labour act costs satiety, so at empty the act is REFUSED, not free: the reducer
 *  no-ops and the button disables off this ONE predicate (AC-6 — shown gate == real gate),
 *  forcing the manual player to "Rest a moment" exactly as the auto loop already does (it
 *  rests at the 70% knee, so auto never even sees this floor). */
export function canAffordAct(state: GameState): boolean {
  return state.character.satiety >= SATIETY_PER_ACT;
}
/** The one user-facing refusal reason for an unaffordable act (TST4 — never a dead button). */
export const OUT_OF_STRENGTH_REASON = 'Out of strength — rest a moment.';

/** Revealed labour activities AT THE CURRENT NODE + whether they're currently doable (PRD §6.9).
 *  v0.3.1 Step 5 (batch-2 call 1): activities are SPATIAL — each belongs to one map node
 *  (`activity.area`), so only the current node's labours are listed. Walk (`move_to`) to work. */
export function availableLabours(state: GameState): LabourOption[] {
  const out: LabourOption[] = [];
  const hidden = hiddenActivityIds(state); // ADR-146: undiscovered node actions don't exist yet
  for (const a of ACTIVITIES) {
    if (a.area !== state.location) continue; // ← spatial: only this node's activities
    if (!isUnlocked(state, a.surface)) continue;
    if (hidden.has(a.id)) continue;
    if (a.dangerRing && skillLevel(state, 'conditioning') < CONDITIONING_GATE_LEVEL) {
      out.push({
        activity: a,
        available: false,
        reason: `Needs Conditioning Lv${CONDITIONING_GATE_LEVEL}`,
      });
    } else if (!canAffordAct(state)) {
      // FB-265 — same predicate the reducer refuses on: the button reads why, never lies.
      out.push({ activity: a, available: false, reason: OUT_OF_STRENGTH_REASON });
    } else {
      out.push({ activity: a, available: true });
    }
  }
  return out;
}

export function canDoActivity(state: GameState, activity: ActivityDef): boolean {
  if (activity.area !== state.location) return false; // ← spatial: must be at the activity's node
  if (!isUnlocked(state, activity.surface)) return false;
  if (hiddenActivityIds(state).has(activity.id)) return false; // ADR-146: not found yet

  if (activity.dangerRing && skillLevel(state, 'conditioning') < CONDITIONING_GATE_LEVEL)
    return false;
  if (!canAffordAct(state)) return false; // FB-265 — no free labour at empty satiety
  return true;
}

/** The PEOPLE present + reachable at the MC's current node (ADR-114 vendors-as-people; mirrors the
 *  spatial `foesHere`). The Map tab's "who's here" list shows only these: a person appears once you
 *  stand at their node, their `placeGate` (if any) is satisfied — you REACHED or BUILT the place —
 *  and their `presence` (if any) holds. Pure + deterministic over the surface latch (no RNG), so a
 *  place-gated vendor (the smith on `panel-equipment`) is simply absent until the gate opens. */
export function peopleHere(state: GameState): NodePerson[] {
  const ctx = presenceCtx(state);
  return PEOPLE.filter((p) => {
    if (p.node !== state.location) return false;
    if (p.placeGate !== undefined && !isUnlocked(state, p.placeGate)) return false;
    if (p.presence !== undefined && !p.presence(ctx)) return false;
    return true;
  });
}

// ── ADR-145 Phase 4 — the estate BUILD read (AC-6: the ONE source the tracker UI, the improve
// gate, and any sim/forecast consult; the reducer enforces the same constants, so the shown
// distance can never drift from the real gate). ──────────────────────────────────────────────

export interface EstateBuildRow {
  readonly def: EstateStageDef;
  /** 'built' — already commissioned · 'next' — the live target · 'locked' — beyond the next. */
  readonly status: 'built' | 'next' | 'locked';
  /** The banked-standing gate this stage needs (ADR-145 the B half). */
  readonly deedGate: number;
}

export interface EstateBuild {
  readonly rows: readonly EstateBuildRow[];
  /** U4 commissioned — the estate STANDS (the E1 build-complete beat has fired). */
  readonly complete: boolean;
  /** The next stage's shortfalls (absent when complete): plain numbers for the TST4 read. */
  readonly next?: {
    readonly def: EstateStageDef;
    readonly deedGate: number;
    /** Banked Estate standing now vs the gate (koku). */
    readonly standing: number;
    readonly deedsShort: number;
    /** Carried coin now vs the cost (mon). */
    readonly carried: number;
    readonly coinShort: number;
  };
}

/** The staged E0→E1 build, as the UI reads it (pure; derived — no stored build state). */
export function estateBuild(state: GameState): EstateBuild {
  const rows: EstateBuildRow[] = ESTATE_STAGES.map((def) => ({
    def,
    status:
      def.stage <= state.estateStage
        ? 'built'
        : def.stage === state.estateStage + 1
          ? 'next'
          : 'locked',
    deedGate: ESTATE_STAGE_DEED_GATES[def.stage - 1] ?? 0,
  }));
  const nextRow = rows.find((r) => r.status === 'next');
  const standing = state.influence.estate.value;
  const carried = state.resources.coin ?? 0;
  return {
    rows,
    complete: state.estateStage >= ESTATE_STAGES.length,
    ...(nextRow
      ? {
          next: {
            def: nextRow.def,
            deedGate: nextRow.deedGate,
            standing,
            deedsShort: Math.max(0, nextRow.deedGate - standing),
            carried,
            coinShort: Math.max(0, nextRow.def.coinCost - carried),
          },
        }
      : {}),
  };
}

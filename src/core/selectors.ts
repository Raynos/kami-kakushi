// Derived/computed reads (PRD §6.4 core/selectors): pure functions of GameState,
// nothing stored. satietyMax/hpMax grow with level; season/week/year/lunar derive
// from the absolute day (D-Q6); the stamina rate is the soft throttle (FU16/FU21).

import type { GameState } from './state';
import {
  HP_BASE,
  HP_PER_LEVEL,
  SATIETY_BASE,
  SATIETY_PER_LEVEL,
  STAMINA_RATE_FLOOR,
  STAMINA_FLAT_ABOVE,
  CONDITIONING_GATE_LEVEL,
  ATTR_VIGOR_HP,
  SKILL_YIELD_DEN,
} from './content/balance';
import { ESTATE_STAGES } from './content/estate';
import {
  DAYS_PER_SEASON,
  DAYS_PER_WEEK,
  SEASONS,
  LUNAR_PERIOD_DAYS,
  type Season,
} from './constants';
import { clamp } from './math';
import { ACTIVITIES, type ActivityDef } from './content/activities';
import { isUnlocked } from './unlock';
import { skillLevel } from './skills';

export function hpMax(state: GameState): number {
  return (
    HP_BASE + (state.character.level - 1) * HP_PER_LEVEL + state.character.vigor * ATTR_VIGOR_HP
  );
}

/** Cumulative satietyMax bonus from the bought-out estate stages (the koku sink). */
export function estateSatietyBonus(state: GameState): number {
  let b = 0;
  for (const s of ESTATE_STAGES) if (state.estateStage >= s.stage) b += s.satietyMaxBonus;
  return b;
}

/** The cumulative labour-yield multiplier from the estate stages, in fixed-point /SKILL_YIELD_DEN
 *  (T0-M4-F2 / D-051: the compounding koku flywheel). estateYieldNum(E0) === SKILL_YIELD_DEN, so a
 *  fresh estate is identity; each bought stage lifts every labour act's output. */
export function estateYieldNum(state: GameState): number {
  let bonus = 0;
  for (const s of ESTATE_STAGES) if (state.estateStage >= s.stage) bonus += s.yieldBonusNum;
  return SKILL_YIELD_DEN + bonus;
}

/** satietyMax grows with combat level (FU21/Q47) + the estate buffer (audit #5). */
export function satietyMax(state: GameState): number {
  return SATIETY_BASE + (state.character.level - 1) * SATIETY_PER_LEVEL + estateSatietyBonus(state);
}

/** Season derived from the absolute day — never stored (D-Q6). */
export function season(state: GameState): Season {
  const idx = Math.floor(state.clock.day / DAYS_PER_SEASON) % SEASONS.length;
  return SEASONS[idx]!;
}

export function week(state: GameState): number {
  return Math.floor(state.clock.day / DAYS_PER_WEEK);
}

/** Year (1-based) derived from the absolute day. */
export function year(state: GameState): number {
  return 1 + Math.floor(state.clock.day / (DAYS_PER_SEASON * SEASONS.length));
}

/** Continuous lunar phase in [0,1) — a real ~29.53d ephemeris, not a per-day roll (D-Q6). */
export function lunarPhase(state: GameState): number {
  const frac = (state.clock.day % LUNAR_PERIOD_DAYS) / LUNAR_PERIOD_DAYS;
  return frac < 0 ? frac + 1 : frac;
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

export interface LabourOption {
  readonly activity: ActivityDef;
  readonly available: boolean;
  readonly reason?: string;
}

/** Revealed labour activities + whether they're currently doable (PRD §6.9 lit/faded). */
export function availableLabours(state: GameState): LabourOption[] {
  const out: LabourOption[] = [];
  for (const a of ACTIVITIES) {
    if (!isUnlocked(state, a.surface)) continue;
    if (a.dangerRing && skillLevel(state, 'conditioning') < CONDITIONING_GATE_LEVEL) {
      out.push({
        activity: a,
        available: false,
        reason: `Needs Conditioning Lv${CONDITIONING_GATE_LEVEL}`,
      });
    } else {
      out.push({ activity: a, available: true });
    }
  }
  return out;
}

export function canDoActivity(state: GameState, activity: ActivityDef): boolean {
  if (!isUnlocked(state, activity.surface)) return false;
  if (activity.dangerRing && skillLevel(state, 'conditioning') < CONDITIONING_GATE_LEVEL)
    return false;
  return true;
}

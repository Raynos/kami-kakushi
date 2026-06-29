// The House-Influence (家威) macro engine (PRD §1.6 / §4.2 / D-049/D-055/D-057). One pillar
// per tier; T0 lights the Estate (家産) pillar. The loop: in PHASE 2 (post-R7 capstone, FU7)
// your recognised deeds bank standing (capped per-deed, anti-spike); each season the house is
// JUDGED at a new high-water (the 30% seasonal share, ±10%); the grade (NONE→GOOD→GREAT→
// EXCELLENT) gates the ascension (T0 = Estate ≥ EXCELLENT). Pure & deterministic; balance
// magnitudes are LIQUID (D-059). Deeds accrue ONLY in Phase 2 so the spine can't bank early.

import type { GameState, PillarState } from './state';
import { phaseOf } from './ranks';
import {
  ESTATE_BANDS,
  PER_DEED_CAP_NUM,
  ESTATE_DEED_PER_ACT,
  SEASONAL_OVER_DEEDS_NUM,
  SEASONAL_OVER_DEEDS_DEN,
  SEASONAL_SWING,
} from './content/balance';

export type Grade = 'NONE' | 'GOOD' | 'GREAT' | 'EXCELLENT';

export interface GradeBands {
  readonly good: number;
  readonly great: number;
  readonly excellent: number;
}

/** The grade a pillar value earns (the ascension gate reads this; D-049/D-057). */
export function gradeOf(value: number, bands: GradeBands = ESTATE_BANDS): Grade {
  if (value >= bands.excellent) return 'EXCELLENT';
  if (value >= bands.great) return 'GREAT';
  if (value >= bands.good) return 'GOOD';
  return 'NONE';
}

/** The cap a single deed may contribute (0.04 · GOOD) — no one act spikes the grade. */
export function perDeedCap(bands: GradeBands = ESTATE_BANDS): number {
  return Math.max(1, Math.round((bands.good * PER_DEED_CAP_NUM) / 100));
}

/** Bank ONE deed into a pillar, capped per-deed; bumps the high-water. Pure; returns the same
 *  ref when the (capped) delta is ≤ 0 (structural sharing). */
export function accrueDeed(
  pillar: PillarState,
  rawDelta: number,
  bands: GradeBands = ESTATE_BANDS,
): PillarState {
  const capped = Math.min(perDeedCap(bands), Math.max(0, Math.round(rawDelta)));
  if (capped === 0) return pillar;
  const value = pillar.value + capped;
  return { ...pillar, value, highWater: Math.max(pillar.highWater, value) };
}

/** Bank an Estate deed onto the state — ONLY in Phase 2 (post-R7 capstone, FU7). The labour
 *  reducer calls this so estate work builds House standing once the tutorial ladder is climbed. */
export function applyEstateDeed(
  state: GameState,
  rawDelta: number = ESTATE_DEED_PER_ACT,
): GameState {
  if (phaseOf(state) !== 2) return state;
  const estate = accrueDeed(state.influence.estate, rawDelta);
  if (estate === state.influence.estate) return state;
  return { ...state, influence: { ...state.influence, estate } };
}

/** The seasonal judge (PRD §4.2 / D-049): on a NEW high-water (highWater > judged), the season
 *  pays the 30% share — `growth · 3/7`, swung ±10% by the day-keyed RNG float `r` ∈ [0,1). Never
 *  net-negative (no permanent loss, D-061). Returns the updated pillar + the bonus (for the log).
 *  No new high-water → a no-op (same ref, bonus 0). */
export function seasonalJudge(
  pillar: PillarState,
  r: number,
): { pillar: PillarState; bonus: number } {
  if (pillar.highWater <= pillar.judged) return { pillar, bonus: 0 };
  const growth = pillar.highWater - pillar.judged;
  const swing = 1 - SEASONAL_SWING + r * (2 * SEASONAL_SWING); // [1-σ, 1+σ]
  const bonus = Math.max(
    0,
    Math.round((growth * SEASONAL_OVER_DEEDS_NUM * swing) / SEASONAL_OVER_DEEDS_DEN),
  );
  const value = pillar.value + bonus;
  return {
    pillar: { value, highWater: Math.max(pillar.highWater, value), judged: pillar.highWater },
    bonus,
  };
}

/** The live Estate grade (the ascension gate + the UI bar read it). */
export function estateGrade(state: GameState): Grade {
  return gradeOf(state.influence.estate.value);
}

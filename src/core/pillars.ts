// The House-Influence (家威) macro engine (PRD §1.6 / §4.2 / ADR-049/ADR-055/ADR-057). One pillar
// per tier; T0 lights the Estate (家産) pillar. The loop: in PHASE 2 (post-R7 capstone, FU7)
// your recognised deeds bank standing (capped per-deed, anti-spike); each season the house is
// JUDGED at a new high-water (the 30% seasonal share, ±10%); the grade (NONE→GOOD→GREAT→
// EXCELLENT) gates the ascension (T0 = Estate ≥ EXCELLENT). Pure & deterministic; balance
// magnitudes are LIQUID (ADR-059). Deeds accrue ONLY in Phase 2 so the spine can't bank early.

import type { GameState, PillarState } from './state';
import { phaseOf } from './ranks';
import {
  ESTATE_BANDS,
  PER_DEED_CAP_NUM,
  ESTATE_DEED_PER_ACT,
  ESTATE_DEED_SOURCE_MULT,
  SEASONAL_OVER_DEEDS_NUM,
  SEASONAL_OVER_DEEDS_DEN,
  SEASONAL_SWING,
  type EstateDeedSource,
} from './content/balance';

export type { EstateDeedSource } from './content/balance';
import { applyRewards } from './rewards';
import { setFlag } from './state';
import { FLAVOR } from './content/flavor';

/** The LOCKED six-step pillar ladder (ADR-159: FAIL·BAD·OK·GOOD·GREAT·EXCELLENT —
 *  不可·劣·可·良·優·秀). C4.7 closed the build's 4-step divergence (the PRD §1.6 already
 *  spoke six-step; the docs were AHEAD of the build here). The T0 ascension gate is
 *  unchanged: top grade = EXCELLENT. */
export type Grade = 'FAIL' | 'BAD' | 'OK' | 'GOOD' | 'GREAT' | 'EXCELLENT';

export interface GradeBands {
  readonly bad: number;
  readonly ok: number;
  readonly good: number;
  readonly great: number;
  readonly excellent: number;
}

/** The grade a pillar value earns (the ascension gate reads this; ADR-049/ADR-057/ADR-159). */
export function gradeOf(value: number, bands: GradeBands = ESTATE_BANDS): Grade {
  if (value >= bands.excellent) return 'EXCELLENT';
  if (value >= bands.great) return 'GREAT';
  if (value >= bands.good) return 'GOOD';
  if (value >= bands.ok) return 'OK';
  if (value >= bands.bad) return 'BAD';
  return 'FAIL';
}

/** The cap a single deed may contribute (0.04 · GOOD) — no one act spikes the grade. At T0 the sole
 *  producer (`ESTATE_DEED_PER_ACT`) is now a SUB-koku fraction (ADR-133), far under this cap, so it
 *  never *binds* yet — that is intentional FORWARD-HEADROOM (battery #22, "documented not gated"):
 *  it is the anti-spike guardrail for T1+, where multiple, larger deed producers land and a single
 *  fat deed COULD spike the grade. (Whether T0 estate-standing should bank from ALL labour or only
 *  estate-relevant work — farm/haul, not forage/woodcut — is a separate T1 balance/design call.) */
export function perDeedCap(bands: GradeBands = ESTATE_BANDS): number {
  return Math.max(1, Math.round((bands.good * PER_DEED_CAP_NUM) / 100));
}

/** Bank ONE deed into a pillar, capped per-deed; bumps the high-water. Deeds are SUB-koku (ADR-133):
 *  `rawDelta` (a fraction) accumulates in `frac` and only banks whole koku into `value` once it
 *  crosses 1 — so the Phase-2 grind takes ~1:1 with Phase 1 without inflating the koku gate. A whole
 *  integer `rawDelta` still banks immediately (frac untouched → 0), so integer callers/tests are
 *  unchanged. Pure; returns the same ref only when nothing moved (delta ≤ 0). */
export function accrueDeed(
  pillar: PillarState,
  rawDelta: number,
  bands: GradeBands = ESTATE_BANDS,
): PillarState {
  const capped = Math.min(perDeedCap(bands), Math.max(0, rawDelta));
  if (capped <= 0) return pillar;
  const pool = (pillar.frac ?? 0) + capped;
  const whole = Math.floor(pool);
  const frac = pool - whole;
  if (whole === 0) return { ...pillar, frac }; // sub-koku progress only — value/high-water hold
  const value = pillar.value + whole;
  return { ...pillar, value, highWater: Math.max(pillar.highWater, value), frac };
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

/** The seasonal judge (PRD §4.2 / ADR-049): on a NEW high-water (highWater > judged), the season
 *  pays the 30% share — `growth · 3/7`, swung ±10% by the day-keyed RNG float `r` ∈ [0,1). Never
 *  net-negative (no permanent loss, ADR-061). Returns the updated pillar + the bonus (for the log).
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
  const highWater = Math.max(pillar.highWater, value);
  // Advance `judged` to the POST-bonus high-water — the bonus is BANKED, never re-judged next
  // season (was `pillar.highWater`, which re-judged its own payout → geometric inflation; battery fix).
  // Carry `frac` (the sub-koku deed accumulator) untouched — the seasonal bonus banks whole koku.
  return { pillar: { value, highWater, judged: highWater, frac: pillar.frac ?? 0 }, bonus };
}

/** ADR-145 — the deed a given SOURCE banks: the single base magnitude × the source's multiplier.
 *  The one place source→magnitude is derived (AC-21); tests fixture from THIS, never a literal. */
export function estateDeedMagnitude(source: EstateDeedSource): number {
  return ESTATE_DEED_PER_ACT * ESTATE_DEED_SOURCE_MULT[source];
}

/** ADR-145 — bank an Estate deed FROM a source (the multi-source Phase-2 economy). `undefined`
 *  = the act is not estate-relevant (Q4: woodcut/forage build no house standing) → a structural
 *  no-op. Phase-1 gating rides on `applyEstateDeed` (deeds never bank pre-capstone).
 *  The FIRST deed a source ever banks fires its one-time reveal beat (TST3 — the recurring
 *  earner is DISCOVERED via the beat, never spawned; flag-gated, append-only per TST2). This is
 *  shared glue both the activity and fight reducers ride (AC-20 — never a reducer→reducer call). */
export function bankEstateDeed(state: GameState, source: EstateDeedSource | undefined): GameState {
  if (source === undefined) return state;
  const banked = applyEstateDeed(state, estateDeedMagnitude(source));
  if (banked === state) return state; // Phase 1 / nothing moved — no beat, no flag
  const flag = `deed-source-${source}`;
  if (banked.flags[flag]) return banked;
  return applyRewards(setFlag(banked, flag), {
    log: [{ channel: 'milestone', text: DEED_SOURCE_REVEAL[source], voice: 'narrator' }],
  });
}

/** ADR-145/ADR-139 — the per-source one-time reveal lines (FB-5 canon; authored in
 *  `content/narrative/flavor.md`, alternates in `takes/` until human sign-off). */
const DEED_SOURCE_REVEAL: Record<EstateDeedSource, string> = {
  fields: FLAVOR.estateSourceFields,
  stores: FLAVOR.estateSourceStores,
  workshop: FLAVOR.estateSourceWorkshop,
  watch: FLAVOR.estateSourceWatch,
  treasury: FLAVOR.estateSourceTreasury,
};

/** The live Estate grade (the ascension gate + the UI bar read it). */
export function estateGrade(state: GameState): Grade {
  return gradeOf(state.influence.estate.value);
}

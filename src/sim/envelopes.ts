// Envelope assertions (FB-4 §3) — the machine verdict on "did the arc's pacing shape survive".
// Test-discipline rules apply in full: every band DERIVES from the design source of truth
// (`balance` constants / the RANKS structure), never a copied magic number; bands assert the
// DESIGN LEVER (per-rung wall-time — each rung's threshold is an independently tunable lever),
// never a collapsed metric (total-arc time is reported, not gated). Idler/explorer carry NO time
// bands (no signed intent exists — inventing one would manufacture wolf-cries); their gates are
// purely structural. This is a design-drift ALARM: a RED means "the shape moved outside signed
// intent — a human decision is required", never auto-canon.

import { RANKS, balance } from '../core';
import type { RunMetrics } from './metrics';

/** The T0 climb rungs — every rank EXCEPT the final one. Time spent AT the final rung is not a
 *  meter climb: the capstone fires on REACHING it, so residence there is the Phase-2 window
 *  (capstone → ascension), which has NO signed band yet (FB-4 open Q1 / HD-19) and is report-only. */
export const CLIMB_RUNGS: readonly string[] = RANKS.slice(0, -1).map((r) => r.id);

/** ADR-148 INTERIM (human, 2026-07-07): timed actions divided the act targets but the
 *  ECONOMY (coin sinks, XP/materials accumulation) is deliberately NOT rebalanced yet —
 *  "I'll rebalance later." Until that rebalance re-signs the full-ladder bands, the
 *  per-rung band verdict applies to the pre-combat climb (R0–R2, the rungs the divided
 *  targets fully govern). ADR-170 (HD-34) re-tuned the Phase-2 economy and RE-ENABLED the
 *  ratio gate; the R3–R6 band scope stays interim — R3's timed wall (~146–221 min vs the
 *  [3, 22] band) is an unruled design question, filed as HD-35. Delete this scope —
 *  restoring the full-ladder verdicts — when HD-35 is ruled. */
export const ADR148_INTERIM_BAND_RUNGS: ReadonlySet<string> = new Set(['R0', 'R1', 'R2']);

/** The final rung — its residence time IS the Phase-2 window (report-only, see HD-19). */
export const PHASE2_RUNG: string = RANKS[RANKS.length - 1]!.id;

export interface BandVerdict {
  rung: string;
  /** Measured wall-min across the gating seeds (the printed margin). */
  measuredMin: number;
  measuredMax: number;
  bandMin: number;
  bandMax: number;
  ok: boolean;
}

/** Greedy per-rung wall-time vs the signed T0 band (ADR-056, [T0_PACING_BAND_MIN/MAX]) — the
 *  per-lever gate: a regression localises to the rung whose threshold moved. */
export function greedyBandVerdicts(runs: readonly RunMetrics[]): BandVerdict[] {
  // ADR-148 INTERIM — see ADR148_INTERIM_BAND_RUNGS above.
  return CLIMB_RUNGS.filter((r) => ADR148_INTERIM_BAND_RUNGS.has(r)).map((rung) => {
    const mins = runs.map((r) => r.rungs.find((x) => x.rung === rung)?.wallMin ?? 0);
    const measuredMin = Math.min(...mins);
    const measuredMax = Math.max(...mins);
    return {
      rung,
      measuredMin,
      measuredMax,
      bandMin: balance.T0_PACING_BAND_MIN,
      bandMax: balance.T0_PACING_BAND_MAX,
      ok: measuredMin >= balance.T0_PACING_BAND_MIN && measuredMax <= balance.T0_PACING_BAND_MAX,
    };
  });
}

export interface RatioVerdict {
  /** Measured phase2Wall / phase1Wall across the gating seeds. */
  measuredMin: number;
  measuredMax: number;
  bandMin: number;
  bandMax: number;
  /** How many of the runs actually reached Phase 2 (a built Phase-2 economy); the gate no-ops when
   *  none did — an unbuilt tier is not a RED. */
  built: number;
  ok: boolean;
}

/** Phase 2 ≈ Phase 1 (ADR-133 / HD-19): greedy's phase2Wall / phase1Wall must sit inside the signed
 *  ratio band. Time-based ⇒ greedy only (idler/explorer carry no time bands, per this file's rule).
 *  SCOPED to runs with a BUILT Phase 2 (ascended + a measured window): a tier with no Phase-2
 *  economy yet never reaches here, so the gate can't cry wolf on the unbuilt. Measured in the
 *  ADR-148 TIMED wall model (the final rung's residence wall vs the climb's) — the signed law is
 *  wall-TIME, and timed actions broke the old wall≈intents shortcut (ADR-170). Generalises
 *  per-tier the day the sim spans more than T0. */
export function phase2RatioVerdict(runs: readonly RunMetrics[]): RatioVerdict {
  const ratios: number[] = [];
  for (const r of runs) {
    if (!r.ascended || r.economy.phase2Intents === null) continue; // Phase 2 not built/reached
    const p2 = r.rungs.find((x) => x.rung === PHASE2_RUNG)?.wallMin ?? 0;
    const p1 = r.totalWallMin - p2;
    if (p2 <= 0 || p1 <= 0) continue;
    ratios.push(p2 / p1);
  }
  const built = ratios.length;
  const measuredMin = built ? Math.min(...ratios) : 0;
  const measuredMax = built ? Math.max(...ratios) : 0;
  return {
    measuredMin,
    measuredMax,
    bandMin: balance.PHASE2_PHASE1_RATIO_MIN,
    bandMax: balance.PHASE2_PHASE1_RATIO_MAX,
    built,
    // No built Phase 2 anywhere ⇒ no-op (ok). Otherwise every built run must sit in the band.
    ok:
      built === 0 ||
      (measuredMin >= balance.PHASE2_PHASE1_RATIO_MIN &&
        measuredMax <= balance.PHASE2_PHASE1_RATIO_MAX),
  };
}

export interface StructuralVerdict {
  personaId: string;
  seed: number;
  ascended: boolean;
  softLock: RunMetrics['softLock'];
  /** Every rung of the ladder was reached (the game itself enforces order; presence of the
   *  full contiguous set is the structural claim). */
  fullLadder: boolean;
  /** What the persona's run promised (ADR-170): 'ascend' — the arc closes tier 0 → 1;
   *  'ladder' — the full ladder is climbed, ascension deliberately not promised. */
  promise: 'ascend' | 'ladder';
  ok: boolean;
}

/** The structural gate every persona × seed must pass: the run's PROMISE closes with zero
 *  soft-locks — full ladder + ascension for 'ascend' personas; full ladder only for 'ladder'
 *  personas (ADR-170/HD-34 — Phase 2 is attention-priced, so idle play stops at the top rung).
 *  Applies to all personas (no time judgement involved). */
export function structuralVerdict(
  m: RunMetrics,
  promise: 'ascend' | 'ladder' = 'ascend',
): StructuralVerdict {
  const seen = new Set(m.rungs.map((r) => r.rung));
  const fullLadder = RANKS.every((r) => seen.has(r.id));
  return {
    personaId: m.personaId,
    seed: m.seed,
    ascended: m.ascended,
    softLock: m.softLock,
    fullLadder,
    promise,
    ok: (promise === 'ladder' || m.ascended) && m.softLock === null && fullLadder,
  };
}

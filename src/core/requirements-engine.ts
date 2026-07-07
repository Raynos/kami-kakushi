// The requirements progression engine (FB-121 / ADR-137). Each rung R0–R7 carries a
// finite, authored list of HIDDEN requirements (counted acts, one-shot event goals,
// economy/state predicates, story flags) — completable in any order; ALL done ⟺ the
// rung's story beat unlocks. The player sees only a rounded integer percent bar; a
// counted requirement moves it in 5–10 quantized chunks, an atomic one lands its whole
// weight as one jump, and every completion emits an authored diegetic flavor line.
//
// Mirrors quest-engine.ts's pure shape: this module is the shared glue between the
// authored requirement DATA (content/requirements.ts, gen'd from narrative markdown)
// and the reducers — fight/labour/economy emit '<verb>:<subject>' advance tokens
// (the ONE token grammar shared with quests, ADR-037) and state snapshots; nothing
// here imports a reducer back (AC-20, acyclic core).
//
// The pure functions below take the requirement list + progress map EXPLICITLY so
// they are unit-testable without content; the state-reading wrappers (rungPercent /
// promotionReady in ranks.ts) bind them to the CURRENT rung's authored list.

import type { GameState } from './state';
import { skillLevel } from './skills';

// ── Requirement shapes ──────────────────────────────────────────────────────────

/** The tiny declared state-predicate grammar (FB-5): anything it can't say is a
 *  `native:` escape hatch resolving into NATIVE_PREDICATES — never a grammar growth. */
export type StatePredicate =
  | { readonly kind: 'resource'; readonly res: string; readonly min: number }
  | { readonly kind: 'banked'; readonly res: string; readonly min: number }
  | { readonly kind: 'belonging'; readonly id: string }
  | { readonly kind: 'skill'; readonly skill: string; readonly min: number }
  | { readonly kind: 'native'; readonly key: string };

interface RequirementBase {
  /** Stable id, unique within its rung — the progress-map key. */
  readonly id: string;
  /** The authored diegetic completion line (story voice) — the jump's visible cause. */
  readonly flavor: string;
  /** Machine-readable hint for the sim bot (how a bot satisfies this requirement). */
  readonly drive: string;
}

export type RequirementDef =
  /** N occurrences of an advance token ('act:rake_rice', 'kill:boar', 'gather:wood'). */
  | (RequirementBase & { readonly type: 'count'; readonly token: string; readonly target: number })
  /** A predicate over GameState snapshots (mon held, item owned) — atomic. */
  | (RequirementBase & { readonly type: 'state'; readonly pred: StatePredicate })
  /** A story flag turning true (absorbs the old storyGate milestones) — atomic. */
  | (RequirementBase & { readonly type: 'flag'; readonly flag: string });

/** Per-requirement progress for the CURRENT rung (reset on promotion, exactly like the
 *  old meter). count: 0..target; state/flag (atomic): 0 | 1. A req is DONE when its
 *  progress ≥ its target — completion latches (a drained purse never un-completes a
 *  once-met economy predicate; the requirement was a step climbed, not a tax held). */
export type RequirementProgress = Readonly<Record<string, number>>;

/** Native escape-hatch predicates (FB-5 `native:`) — real logic beyond the declared
 *  grammar lives HERE as hand-written TS, keyed by the `native:` name in the md. */
export const NATIVE_PREDICATES: Readonly<Record<string, (s: GameState) => boolean>> = {};

// ── Progress reads ──────────────────────────────────────────────────────────────

export function requirementTarget(def: RequirementDef): number {
  return def.type === 'count' ? def.target : 1;
}

export function isRequirementDone(def: RequirementDef, progress: RequirementProgress): boolean {
  return (progress[def.id] ?? 0) >= requirementTarget(def);
}

export function allRequirementsDone(
  defs: readonly RequirementDef[],
  progress: RequirementProgress,
): boolean {
  return defs.every((d) => isRequirementDone(d, progress));
}

/** Derived (never authored) chunk count for a counted requirement's bar movement:
 *  one chunk per unit for small counts, capped at 10 — so any large count reads as
 *  5–10 satisfying steps, never 500 micro-ticks. */
export function chunkCount(target: number): number {
  return Math.max(1, Math.min(10, target));
}

/** A requirement's quantized 0..1 contribution fraction. Counted reqs step in
 *  chunkCount() increments; atomic reqs are all-or-nothing. */
function quantizedFrac(def: RequirementDef, progress: RequirementProgress): number {
  const prog = progress[def.id] ?? 0;
  if (def.type !== 'count') return prog >= 1 ? 1 : 0;
  if (prog >= def.target) return 1;
  const chunks = chunkCount(def.target);
  return Math.floor((prog * chunks) / def.target) / chunks;
}

/** The player-facing read: a rounded INTEGER 0–100, equal weight per requirement.
 *  Exactly 100 ⟺ every requirement is done (99-clamped otherwise, so rounding can
 *  never lie about readiness); an empty list is vacuously 100. Monotonic within a
 *  rung: progress only accrues and completion latches, so the sum never falls. */
export function rungPercentOf(
  defs: readonly RequirementDef[],
  progress: RequirementProgress,
): number {
  if (defs.length === 0) return 100;
  if (allRequirementsDone(defs, progress)) return 100;
  const sum = defs.reduce((acc, d) => acc + quantizedFrac(d, progress), 0);
  return Math.min(99, Math.round((100 * sum) / defs.length));
}

// ── Progress writes (pure — return the next progress map + what completed) ───────

export interface AdvanceResult {
  readonly progress: RequirementProgress;
  /** Requirements that crossed to DONE in this advance (flavor fires once each). */
  readonly completed: readonly RequirementDef[];
}

/** Route an advance token ('<verb>:<subject>') to every listening counted requirement.
 *  An unmatched token is a cheap no-op (same contract as applyQuestEvent). */
export function advanceOnToken(
  defs: readonly RequirementDef[],
  progress: RequirementProgress,
  token: string,
): AdvanceResult {
  let next: Record<string, number> | null = null;
  const completed: RequirementDef[] = [];
  for (const def of defs) {
    if (def.type !== 'count' || def.token !== token) continue;
    const prog = progress[def.id] ?? 0;
    if (prog >= def.target) continue; // already done — latched
    next ??= { ...progress };
    next[def.id] = prog + 1;
    if (prog + 1 >= def.target) completed.push(def);
  }
  return { progress: next ?? progress, completed };
}

function evalPredicate(pred: StatePredicate, state: GameState): boolean {
  switch (pred.kind) {
    case 'resource':
      return (state.resources[pred.res] ?? 0) >= pred.min;
    case 'banked':
      return (state.banked[pred.res] ?? 0) >= pred.min;
    case 'belonging':
      return state.belongings.includes(pred.id);
    case 'skill':
      return skillLevel(state, pred.skill as Parameters<typeof skillLevel>[1]) >= pred.min;
    case 'native': {
      const fn = NATIVE_PREDICATES[pred.key];
      if (!fn) throw new Error(`unknown native requirement predicate: ${pred.key}`);
      return fn(state);
    }
  }
}

/** Evaluate every not-yet-done atomic requirement (state predicates + story flags)
 *  against the CURRENT state snapshot; completion latches at 1. Called from the
 *  reducer tail so a flag set or a purse filled anywhere is noticed the same tick. */
export function settleOnState(
  defs: readonly RequirementDef[],
  progress: RequirementProgress,
  state: GameState,
): AdvanceResult {
  let next: Record<string, number> | null = null;
  const completed: RequirementDef[] = [];
  for (const def of defs) {
    if (def.type === 'count') continue;
    if ((progress[def.id] ?? 0) >= 1) continue; // latched
    const met =
      def.type === 'flag' ? state.flags[def.flag] === true : evalPredicate(def.pred, state);
    if (!met) continue;
    next ??= { ...progress };
    next[def.id] = 1;
    completed.push(def);
  }
  return { progress: next ?? progress, completed };
}

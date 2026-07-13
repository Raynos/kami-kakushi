// The hidden rung-requirement lists (FB-121 / ADR-137) — DATA, not script. Authored as
// prose-first markdown in `narrative/requirements.md` (FB-5 — the source of truth) and
// compiled to `requirements.gen.ts` by `pnpm run gen:narrative`; this module keeps the
// hand-written helpers and re-exports the generated registry so consumers see one
// unchanged surface. The def/progress TYPES live in core/requirements-engine.ts (the
// engine both this data and the reducers bind to). Counts are provisional fun-first
// drafts — tuning is edit → gen:narrative → sim (ADR-132; no balance.ts mirror).

import type { RankId } from './ranks';
import type { RequirementDef } from '../requirements-engine';
import { RUNG_REQUIREMENTS } from './requirements.gen';

export { RUNG_REQUIREMENTS };

// ── DEV-only flavor overlay (ADR-139 / ADR-143 — the story set-switcher) ────────────
// INERT unless called: only the DEV story switcher (src/ui/dev.ts) ever sets this, and
// the DEV branch dead-code-eliminates from a strip build — tests, sims and the shipped
// game read canon. Same declaring-module pattern as balance's __setBalanceLever. The
// overlay affects FUTURE emissions only; lines already in the log stay (T2 — a watched
// surface never rewrites history).
let FLAVOR_OVERRIDE: Readonly<Record<string, string>> | null = null;

/** DEV-only: overlay requirement-completion flavor by requirement id (null = canon). */
export function __setRequirementFlavorOverride(map: Readonly<Record<string, string>> | null): void {
  FLAVOR_OVERRIDE = map;
}

/** The flavor line a completion should voice — the DEV overlay's take if one is
 *  selected, else the authored canon line. The ONE read progress-events uses. */
export function requirementFlavor(req: RequirementDef): string {
  return FLAVOR_OVERRIDE?.[req.id] ?? req.flavor;
}

/** HD-41 — every authored requirement, keyed by its id (ids are unique across the whole
 *  ladder — the narrative validator enforces it). The renderer looks a completion up from
 *  its ADR-186 descriptor (`contentKey: 'requirement.<id>'`) to read the PROGRESS-tab
 *  objective line, so the words are never stored in a save. */
const BY_ID: ReadonlyMap<string, RequirementDef> = new Map(
  Object.values(RUNG_REQUIREMENTS)
    .flat()
    .map((r) => [r.id, r]),
);

/** The requirement an ADR-186 descriptor names, or undefined when the id is gone from the
 *  registry (a save written before a requirement was retired — the caller falls back to the
 *  entry's own logged text rather than inventing one). */
export function requirementById(id: string): RequirementDef | undefined {
  return BY_ID.get(id);
}

/** The CURRENT rung's authored requirement list. Every rung has one (the validator
 *  holds the registry to exactly R0–R7), so an unknown id is a programmer error. */
export function rungRequirements(id: RankId): readonly RequirementDef[] {
  const reqs = RUNG_REQUIREMENTS[id];
  if (!reqs) throw new Error(`no requirements authored for rung ${id}`);
  return reqs;
}

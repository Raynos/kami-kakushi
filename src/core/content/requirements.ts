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

/** The CURRENT rung's authored requirement list. Every rung has one (the validator
 *  holds the registry to exactly R0–R7), so an unknown id is a programmer error. */
export function rungRequirements(id: RankId): readonly RequirementDef[] {
  const reqs = RUNG_REQUIREMENTS[id];
  if (!reqs) throw new Error(`no requirements authored for rung ${id}`);
  return reqs;
}

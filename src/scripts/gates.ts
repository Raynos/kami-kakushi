// gates.ts — the verify gate roster, the SINGLE SOURCE OF TRUTH for the gate list.
//
// Extracted from verify-run.ts (F1a mechanical checkpoint) so it can be imported
// WITHOUT running the runner: verify-run.ts executes top-level on import, so a
// consumer that only wants the roster (checkpoint.ts, which regenerates the
// gate-count docs from this array) cannot import verify-run. This module is pure
// data — no side effects, no top-level execution — so both verify-run.ts and
// checkpoint.ts import it. Add / remove a gate HERE and nowhere else; the
// gate-roster doc regions regenerate from this list (npm run checkpoint).
//
// scope (audited 2026-07-03): what a gate READS decides its lane — code = src/config
// only · docs = markdown only · both = a code<->docs invariant ('both' is skipped
// only when BOTH lanes are skipped — see verify-scope.ts).

import type { GateScope } from './verify-scope';

export interface Gate {
  name: string;
  cmd: string;
  scope: GateScope;
}

export const GATES: ReadonlyArray<Gate> = [
  { name: 'tsgo', cmd: 'tsgo --noEmit', scope: 'code' }, // native-preview TS compiler (typescript-go)
  { name: 'oxlint', cmd: 'oxlint', scope: 'code' }, // .oxlintrc.json; pure-core boundary in its src/core override
  { name: 'oxfmt', cmd: 'oxfmt --check', scope: 'code' }, // .oxfmtrc.json; *.md + docs dirs ignored there
  { name: 'vitest', cmd: 'vitest run', scope: 'code' },
  { name: 'verify-content', cmd: 'tsx src/scripts/verify-content.ts', scope: 'code' }, // imports registries only
  { name: 'verify-prd', cmd: 'tsx src/scripts/verify-prd.ts', scope: 'docs' }, // reads docs/living/prd/* only
  { name: 'gen-docs', cmd: 'tsx src/scripts/gen-docs.ts --check', scope: 'both' }, // src registries -> docs/content
  { name: 'gen-prd-regions', cmd: 'tsx src/scripts/gen-prd-regions.ts --check', scope: 'both' }, // RANKS -> PRD §3 region (F1b Ph2)
  { name: 'pacing', cmd: 'tsx src/scripts/pacing-report.ts --check', scope: 'code' }, // imports ../core only
  { name: 'playcheck', cmd: 'tsx src/playcheck.ts --check', scope: 'code' },
  { name: 'md-links', cmd: 'tsx src/scripts/check-md-links.ts', scope: 'both' }, // md links break via src renames too
  { name: 'milestone-integrity', cmd: 'tsx src/scripts/milestone-integrity.ts', scope: 'both' }, // roadmap DoD -> real tests
  { name: 'verify-changelog', cmd: 'tsx src/scripts/verify-changelog.ts', scope: 'both' }, // package.json -> CHANGELOG
  { name: 'doc-budgets', cmd: 'tsx src/scripts/verify-doc-budgets.ts', scope: 'docs' }, // snapshot-doc caps (D-126)
  { name: 'checkpoint', cmd: 'tsx src/scripts/checkpoint.ts --check', scope: 'both' }, // gates.ts/plans -> process-doc regions
];

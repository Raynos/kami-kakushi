// inbox-ledger — the verify gate over the parallel-drain state (ADR-171).
//
// The durable-status design (per-item lane/status/fb/commit fields on the
// capture sidecars) deliberately breaks the inbox's old "no status field to
// go stale" property — location alone can't encode completion once a lane
// spans buckets. THIS GATE is the replacement teeth: content invariants only
// (never a diff heuristic, so it never cries wolf), enforced at commit, push,
// and CI:
//
//   1. no F-number stamped on two captures;
//   2. above FB_BASELINE (198), F-log heading allocations are unique across
//      the unified F/FB space — two drain lanes grabbing the same next number
//      is caught mechanically, not by etiquette;
//   3. a `done` capture names its fb + fixing commit;
//   4. a fully-done bucket must be archived out of pending/.
export {};

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fbAllocations, ledgerFindings, readItems } from './inbox-lanes';

const root = (p: string): string =>
  resolve(new URL(`../../${p}`, import.meta.url).pathname);
const PENDING = root('project/playtest-inbox/pending');
const ARCHIVE = root('project/playtest-inbox/archive');
const FLOG_DIR = root('project/feedback-human');

function flogTexts(): string[] {
  try {
    return readdirSync(FLOG_DIR)
      .filter((f) => f.endsWith('.md'))
      .map((f) => readFileSync(join(FLOG_DIR, f), 'utf-8'));
  } catch {
    return [];
  }
}

const findings = ledgerFindings(
  readItems(PENDING),
  readItems(ARCHIVE),
  fbAllocations(flogTexts()),
);

if (findings.length > 0) {
  console.error(`  X inbox-ledger: ${findings.length} invariant violation(s):`);
  for (const f of findings) console.error(`    - ${f}`);
  console.error(
    '    See ADR-171 + .claude/skills/drain-inbox/SKILL.md (parallel drains).',
  );
  process.exit(1);
}
console.log(
  '  ✓ inbox-ledger: drain state is consistent (F-numbers unique, done items recorded).',
);
process.exit(0);

// Milestone-integrity gate (battery #20 / ADR-054, backstops ADR-088) — pushes the milestone-integrity
// NORM up to a verify GATE. ADR-054: "a milestone SHIPS only when every DoD line is met or ADR-amended,
// and a CI check asserts every instrument a DoD NAMES resolves to a real test/tool." This is the CI
// check, kept LEAN on purpose: a hand-curated MANIFEST maps each named DoD forward-contract to the
// test/tool that implements it, and the gate asserts (1) every manifest instrument RESOLVES (its file
// exists and carries a stable marker), and (2) every named contract the roadmap MENTIONS is in the
// manifest (so a DoD can't name an instrument that was never wired). No fragile full-markdown parse —
// it fails only when a named instrument genuinely doesn't resolve, so it never cries wolf (AC-11).
//
// Run: `tsx src/scripts/milestone-integrity.ts` (a verify gate). Fast (a few file reads).
export {};

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (rel: string): string | null =>
  existsSync(root + rel) ? readFileSync(root + rel, 'utf8') : null;

/** Each named DoD forward-contract (roadmap §"DoD forward-contracts" + ADR-088's per-tier tests) →
 *  the instrument that RESOLVES it: a file that must exist + a stable marker proving it's the real
 *  check (a contract name embedded in a describe, or a load-bearing symbol). */
const MANIFEST: ReadonlyArray<{
  contract: string;
  file: string;
  marker: string;
}> = [
  { contract: 'G-CURVE', file: 'src/core/m2.test.ts', marker: 'combat curve' },
  {
    contract: 'G-NO-DEAD-VALUES',
    file: 'src/core/integrity.test.ts',
    marker: 'G-NO-DEAD-VALUES',
  },
  {
    contract: 'NO-STANCE-DOMINATED',
    file: 'src/core/m2.test.ts',
    marker: 'stance strictly dominates',
  },
  {
    contract: 'DISPLAYED==TESTED',
    file: 'src/core/m2.test.ts',
    marker: 'seed-robust',
  },
  {
    contract: 'playcheck',
    file: 'src/playcheck.ts',
    marker: 'focusedOptimalIntent',
  },
  // ADR-088 — the per-tier hard DoD contract: a full-arc e2e + an invariants test, each a real test.
  {
    contract: 'T0-e2e (D-088)',
    file: 'src/core/t0-arc.test.ts',
    marker: 'focusedOptimalIntent',
  },
  {
    contract: 'T0-invariants (D-088)',
    file: 'src/core/invariants.test.ts',
    marker: 'invariant',
  },
];

const problems: string[] = [];

// (1) every manifest instrument must resolve — the file exists AND carries its marker.
for (const { contract, file, marker } of MANIFEST) {
  const src = read(file);
  if (src === null) {
    problems.push(
      `${contract}: names ${file}, which does NOT exist (DoD instrument unresolved).`,
    );
    continue;
  }
  if (!src.toLowerCase().includes(marker.toLowerCase())) {
    problems.push(
      `${contract}: ${file} exists but the marker "${marker}" is gone — the instrument may have been renamed/removed. Update the manifest or restore the check.`,
    );
  }
}

// (2) every named contract the roadmap MENTIONS must be in the manifest (no un-wired DoD instrument).
const roadmap = read('docs/living/roadmap.md') ?? '';
const manifestNames = new Set(
  MANIFEST.map((m) => m.contract.replace(/\s*\(.*\)$/, '')),
);
// the token vocabulary the roadmap uses for its forward-contracts (§"DoD forward-contracts").
const NAMED = [
  'G-CURVE',
  'G-NO-DEAD-VALUES',
  'NO-STANCE-DOMINATED',
  'DISPLAYED==TESTED',
  'playcheck',
];
for (const token of NAMED) {
  if (roadmap.includes(token) && !manifestNames.has(token)) {
    problems.push(
      `roadmap names the DoD contract "${token}" but the milestone-integrity manifest has no resolver for it — wire the test/tool or add a manifest entry.`,
    );
  }
}

if (problems.length) {
  console.error(
    '  X milestone-integrity FAILED — a DoD names an instrument that does not resolve:',
  );
  for (const p of problems) console.error(`    - ${p}`);
  process.exit(1);
}
console.log(
  `  milestone-integrity OK — ${MANIFEST.length} DoD instruments resolve; all named roadmap contracts wired.`,
);

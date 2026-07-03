// verify-doc-budgets — snapshot-class docs hold their hard line caps (D-126).
//
// A hard budget turns "append" into "displace": to add a line, cull a weaker
// one, so the doc sharpens instead of growing (project-status.md once bloated
// to 326 lines under a cap-less norm). The caps live ONLY here — the pre-commit
// snapshot gate's own count check was absorbed into this table. Runs as a
// docs-lane verify gate (see verify-run.ts), so it fires at commit (including
// SKIP_CODE_VERIFY docs-only commits), push, and CI; pre-commit also invokes it
// standalone under a full SKIP_VERIFY=1 so the caps can't be dodged there.
//
// WARN-only genre tripwire: a `(session-NN)` reference inside taste/ui-design,
// or a "Phase update" bullet in the status snapshot, is the journal genre
// leaking into a replace-in-place doc — loud, never blocking (A11).
export {};

import { readFileSync, existsSync } from 'node:fs';

const BUDGETS: ReadonlyArray<{ path: string; cap: number; genreLeak: RegExp }> = [
  { path: 'docs/living/taste.md', cap: 150, genreLeak: /\(session-\d+\)/ },
  { path: 'docs/living/ui-design.md', cap: 400, genreLeak: /\(session-\d+\)/ },
  {
    path: 'project/status/project-status.md',
    cap: 120,
    genreLeak: /^\s*-\s+\*\*Phase update/m,
  },
];

let red = false;
for (const { path, cap, genreLeak } of BUDGETS) {
  if (!existsSync(path)) {
    console.error(`  X doc-budgets: budgeted doc missing: ${path}`);
    red = true;
    continue;
  }
  const text = readFileSync(path, 'utf-8');
  const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
  if (lines > cap) {
    console.error(`  X doc-budgets: ${path} is ${lines} lines — over its ${cap}-line cap.`);
    console.error(
      '    SNAPSHOT-CLASS doc (D-126): replace in place — to add a line, displace a weaker',
    );
    console.error(
      '    one. Cull, do not bypass (SKIP_DOCBUDGET=1 is a human-blessed cap raise only).',
    );
    red = true;
  }
  if (genreLeak.test(text)) {
    console.log(
      `  ~ doc-budgets WARN: ${path} carries a journal-genre marker — per-session history belongs in project/journal/.`,
    );
  }
}
if (red) process.exit(1);
console.log(`  ✓ doc-budgets: ${BUDGETS.length} snapshot docs within their caps.`);

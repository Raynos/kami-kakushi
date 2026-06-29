// verify-prd — the PRD-split completeness check (op-model v2 FINAL, Workstream E).
//
// The durable guard against the monolith-truncation failure class: once the PRD is split, assert all 7
// sections are present, ASCII-named, contiguous (§1…§7), non-truncated, and linked from the stub index.
// SAFE-WHEN-ABSENT: if the split hasn't been applied yet (no docs/living/prd/ dir), it exits 0 with a
// note — so it can be wired into `npm run verify` now or at split time without breaking the build.
//
// CLI:  tsx src/scripts/verify-prd.ts  [--dir=<split-dir>] [--index=<stub-prd.md>]
export {};

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const arg = (name: string, fallback: string): string => {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fallback;
};
const DIR = arg('--dir', join(repoRoot, 'docs/living/prd'));
const INDEX = arg('--index', join(repoRoot, 'docs/living/prd.md'));

const EXPECTED = 7; // §1…§7
const MIN_CHARS = 200; // a real section is never this small — guards truncation-to-stub
const ASCII_NAME = /^0[1-7]-[a-z0-9-]+\.md$/; // ordered numeric prefix + ascii slug, NO unicode `§`

if (!existsSync(DIR)) {
  console.log(`verify-prd: PRD not split yet (no ${DIR}) — skipping. [OK]`);
  process.exit(0);
}

const errors: string[] = [];
const files = readdirSync(DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');

if (files.length !== EXPECTED) {
  errors.push(`expected ${EXPECTED} section files, found ${files.length}: ${files.join(', ')}`);
}

const seen = new Set<number>();
for (const f of files) {
  if (!ASCII_NAME.test(f)) errors.push(`filename not ASCII/ordered: ${f} (want e.g. 01-vision.md)`);
  const content = readFileSync(join(DIR, f), 'utf8');
  if (content.length < MIN_CHARS) errors.push(`${f} is only ${content.length} chars — truncated?`);

  const header = /^# §(\d+)\b/m.exec(content);
  if (!header) {
    errors.push(`${f} has no \`# §N\` section header`);
    continue;
  }
  const num = Number(header[1]);
  seen.add(num);
  const prefix = Number(f.slice(0, 2));
  if (num !== prefix) errors.push(`${f}: header §${num} != filename prefix ${prefix}`);

  // The stub index must link this section file (so no orphan, and the inbound refs resolve).
  if (existsSync(INDEX)) {
    const idx = readFileSync(INDEX, 'utf8');
    if (!idx.includes(f)) errors.push(`stub index ${INDEX} does not link ${f}`);
  } else {
    errors.push(`stub index ${INDEX} is missing`);
  }
}

for (let n = 1; n <= EXPECTED; n++) {
  if (!seen.has(n)) errors.push(`§${n} is missing from the split`);
}

if (errors.length) {
  console.error('verify-prd: FAIL');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `verify-prd: OK (${EXPECTED} ASCII sections present, contiguous, linked from the index).`,
);

// checkpoint.ts — "generate, don't duplicate" applied to the PROCESS layer.
//
// The game-content layer solved doc-vs-doc drift with gen-docs.ts (typed data ->
// docs/content + a --check gate). The process layer never got the same treatment,
// so a handful of DERIVABLE facts (the gate roster + count, the active-plans list)
// were hand-copied across docs and rotted (the gate-count sentence said 11 while
// GATES held 13; docs/plans/README claimed "no active plans" beside a dir full of
// them). This script regenerates those fenced regions from their single sources
// (gates.ts, the docs/plans/ listing) so the drift is impossible by construction.
//
// Two modes, mirroring gen-docs.ts:
//   npm run checkpoint          write: regenerate the regions in place, then report
//   npm run checkpoint:check    --check: regenerate into memory, fail on any byte
//                               diff; writes nothing (the verify gate — F1a Phase 4)
//
// Determinism (why --check is a SOUND gate — §3.1): every input is a committed
// worktree file (gates.ts, the docs/plans/ listing + status tokens). No clock, no
// git log, no mtimes, no network — momentum data (recent commits) stays in
// session-brief.sh, which runs at session time and is never committed.

import { readFileSync, writeFileSync, readdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GATES } from './gates';
import { spliceRegion, wrap } from './gen-regions';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const abs = (rel: string): string => join(repoRoot, rel);
const read = (rel: string): string => readFileSync(abs(rel), 'utf-8');

const PLANS_DIR = 'docs/plans';

// --- plan status tokens (the small convention change, §2.2) -------------------
// A closed vocabulary: a plan's `**Status:**` line MUST lead with one of these
// (a leading glyph is decoration; the WORD is the machine token). checkpoint AND
// session-brief.sh parse this one token. Archivable = the plan has graduated out
// of docs/plans/ and should be moved to project/archive/.
export const CLOSED_TOKENS = [
  'PROPOSED',
  'LOCKED',
  'IN-PROGRESS',
  'DONE',
  'PARKED',
  'SUPERSEDED',
] as const;
export type ClosedToken = (typeof CLOSED_TOKENS)[number];
// Only DONE / SUPERSEDED graduate. (Legacy synonyms are tolerated by the lenient
// classifier for session-brief parity until every live plan is migrated.)
const ARCHIVABLE = new Set(['DONE', 'SUPERSEDED', 'COMPLETE', 'COMPLETED', 'SHIPPED', 'ARCHIVED']);

export interface PlanStatus {
  token: string; // the leading token, UPPER-CASE, hyphen-joined ("IN-PROGRESS")
  archivable: boolean;
}

/** Parse the leading status token from a plan's body. Total (never throws);
 *  returns null when there is no `**Status:` line at all. */
export function parseStatusToken(content: string): PlanStatus | null {
  const line = content.split('\n').find((raw) => /^\s*\*\*status\b/i.test(raw));
  if (line === undefined) return null;
  let s = line.trim();
  s = s.replace(/^\*\*/, ''); // drop the leading **
  s = s.replace(/^status\s*:?\s*/i, ''); // drop the "Status:" label
  s = s.replace(/^\*\*\s*/, ''); // drop the closing ** of a "**Status:**" pair
  s = s.replace(/^[^A-Za-z]+/, ''); // drop a leading glyph / punctuation
  const m = s.match(/^[A-Za-z]+(?:-[A-Za-z]+)*/); // one token, hyphens included ("IN-PROGRESS")
  if (!m) return null;
  let token = m[0].toUpperCase();
  // Only the space-separated "IN PROGRESS" two-worder folds into the canonical
  // token; every other status is a single leading word (so "SUPERSEDED by F2"
  // parses as SUPERSEDED, not SUPERSEDED-BY).
  if (token === 'IN' && /^\s+PROGRESS\b/i.test(s.slice(m[0].length))) token = 'IN-PROGRESS';
  return { token, archivable: ARCHIVABLE.has(token) };
}

// --- generated region bodies --------------------------------------------------

/** The gate roster + count, derived from gates.ts. Link-free ON PURPOSE so the
 *  IDENTICAL bytes serve both project/status/ files (the "roster in gates.ts"
 *  link lives in each file's fixed prose, with its own relative path). */
function genGateRoster(): string {
  const names = GATES.map((g) => g.name).join(', ');
  // The gate names have no internal spaces, so a plain ~78-col word-fold of the
  // comma-separated list never splits an inline-code span.
  return wrap(`**${GATES.length} gates**: ${names}.`, 78);
}

/** The active-plans list for docs/plans/README.md, derived from the dir listing +
 *  parsed status tokens. Archivable (DONE/SUPERSEDED) plans are excluded — they
 *  belong in project/archive/. Sorted by filename for determinism. */
function genActivePlans(): string {
  const files = readdirSync(abs(PLANS_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort();
  const rows: string[] = [];
  for (const f of files) {
    const st = parseStatusToken(read(`${PLANS_DIR}/${f}`));
    if (st?.archivable) continue; // graduated — lives in project/archive/ now
    const tok = st ? st.token : '—';
    rows.push(`- [\`${f}\`](${f}) — ${tok}`);
  }
  const head = `**${rows.length} active plans** (generated — done / superseded plans graduate to [\`../../project/archive/\`](../../project/archive)):`;
  return `${head}\n\n${rows.join('\n')}`;
}

// --- region wiring ------------------------------------------------------------

interface RegionSpec {
  file: string;
  id: string;
  gen: () => string;
}
const REGIONS: ReadonlyArray<RegionSpec> = [
  { file: 'project/status/project-status.md', id: 'gate-roster', gen: genGateRoster },
  { file: 'project/status/working-agreements.md', id: 'gate-roster', gen: genGateRoster },
  { file: 'docs/plans/README.md', id: 'active-plans', gen: genActivePlans },
];

/** Apply every region targeting `file` and return the rewritten content. */
function regenerateFile(file: string): { before: string; after: string } {
  const before = read(file);
  let after = before;
  for (const r of REGIONS.filter((r) => r.file === file)) {
    after = spliceRegion(after, r.id, r.gen());
  }
  return { before, after };
}

const targetFiles = [...new Set(REGIONS.map((r) => r.file))];

// --- CLI ----------------------------------------------------------------------

function runCli(): void {
  const check = process.argv.includes('--check');

  if (check) {
    const stale: string[] = [];
    for (const file of targetFiles) {
      const { before, after } = regenerateFile(file);
      if (before !== after) stale.push(file);
    }
    if (stale.length) {
      console.error('  X checkpoint --check FAILED: generated region(s) are stale:');
      for (const f of stale) console.error(`      ${f}`);
      console.error('    Run `npm run checkpoint` to regenerate, then stage the files.');
      process.exit(1);
    }
    console.log(`  ✓ checkpoint --check: ${targetFiles.length} doc(s) have up-to-date regions.`);
    process.exit(0);
  }

  // write mode
  const wrote: string[] = [];
  for (const file of targetFiles) {
    const { before, after } = regenerateFile(file);
    if (before !== after) {
      writeFileSync(abs(file), after, 'utf-8');
      wrote.push(file);
    }
  }

  console.log('checkpoint — mechanical process-doc regeneration');
  if (wrote.length) {
    console.log(`  wrote ${wrote.length} file(s):`);
    for (const f of wrote) console.log(`    ~ ${f}`);
  } else {
    console.log('  regions already up to date (no write).');
  }
  // Newest journal (a bare run just names it — scaffolding lands in Phase 3).
  const journals = readdirSync(abs('project/journal'))
    .filter((f) => /^\d{4}-\d{2}-\d{2}-session-\d+.*\.md$/.test(f))
    .sort();
  if (journals.length)
    console.log(`  newest journal: project/journal/${journals[journals.length - 1]}`);
  process.exit(0);
}

// Run the CLI only when invoked directly (tsx src/scripts/checkpoint.ts), NOT when
// imported by a test for its pure exports (parseStatusToken, CLOSED_TOKENS).
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invoked === fileURLToPath(import.meta.url)) runCli();

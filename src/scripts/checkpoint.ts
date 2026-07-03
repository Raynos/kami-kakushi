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

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  existsSync,
  statSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GATES } from './gates';
import { spliceRegion, wrap } from './gen-regions';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const abs = (rel: string): string => join(repoRoot, rel);
const read = (rel: string): string => readFileSync(abs(rel), 'utf-8');

const PLANS_DIR = 'docs/plans';
const ARCHIVE_DIR = 'project/archive';
const QUEUE = 'project/todo-human.md';

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
  const rows: string[] = [];
  for (const f of planFiles()) {
    const st = parseStatusToken(read(`${PLANS_DIR}/${f}`));
    if (st?.archivable) continue; // graduated — lives in project/archive/ now
    const tok = st ? st.token : '—';
    rows.push(`- [\`${f}\`](${f}) — ${tok}`);
  }
  const head = `**${rows.length} active plans** (generated — done / superseded plans graduate to [\`../../project/archive/\`](../../project/archive)):`;
  return `${head}\n\n${rows.join('\n')}`;
}

// --- plan listing + token validation ------------------------------------------

/** Every real plan file in docs/plans/ (README is exempt — it documents the dir). */
function planFiles(): string[] {
  return readdirSync(abs(PLANS_DIR))
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort();
}

/** Plans whose `**Status:` token is missing or outside the closed vocabulary
 *  (§2.2). Loud in write mode, RED in --check — the "token parses" gate. */
function invalidTokenPlans(): Array<{ file: string; token: string | null }> {
  const bad: Array<{ file: string; token: string | null }> = [];
  for (const f of planFiles()) {
    const st = parseStatusToken(read(`${PLANS_DIR}/${f}`));
    if (!st || !(CLOSED_TOKENS as readonly string[]).includes(st.token)) {
      bad.push({ file: `${PLANS_DIR}/${f}`, token: st?.token ?? null });
    }
  }
  return bad;
}

// --- auto-archive done plans (§2.3–2.4) ---------------------------------------
// A plan whose token is DONE/SUPERSEDED graduates OUT of docs/plans/. We move the
// file, recompute every intra-repo markdown link that pointed at it, and rewrite
// its backticked path in the reading queue (tagging it, never removing it — D-089
// removal is human-engagement judgment, §2.4). Nothing is staged unless --stage.

// Mirror check-md-links' SCAN_ROOTS so a moved plan never leaves a dead link.
const LINK_SCAN_ROOTS = [
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  'docs',
  '.claude',
  'project/status',
  'project/human-in-the-loop',
  'project/todo-human.md',
];
const LINK_EXCLUDE = new Set(['node_modules', '.git', 'dist', 'tmp', 'worktrees']);
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LINK_SKIP = /^(https?:|mailto:|tel:|data:|#|<)/i;

function walkMd(absPath: string, out: string[]): void {
  if (!existsSync(absPath)) return;
  const st = statSync(absPath);
  if (st.isFile()) {
    if (absPath.endsWith('.md')) out.push(absPath);
    return;
  }
  for (const name of readdirSync(absPath)) {
    if (LINK_EXCLUDE.has(name)) continue;
    walkMd(join(absPath, name), out);
  }
}

function scannedMdFiles(): string[] {
  const out: string[] = [];
  for (const root of LINK_SCAN_ROOTS) walkMd(abs(root), out);
  // the per-dir project/<dir>/README.md indexes, like check-md-links
  const projAbs = abs('project');
  if (existsSync(projAbs)) {
    for (const name of readdirSync(projAbs)) {
      const readme = join(projAbs, name, 'README.md');
      if (existsSync(readme) && !out.includes(readme)) out.push(readme);
    }
  }
  return out;
}

/** If `target` (a markdown link from `fromAbs`) points at `oldAbs`, return the
 *  new link target (relative to the file) pointing at `newAbs`; else null.
 *  Preserves any #anchor / ?query suffix. Pure — path math only. */
export function relinkTarget(
  fromAbs: string,
  target: string,
  oldAbs: string,
  newAbs: string,
): string | null {
  if (LINK_SKIP.test(target)) return null;
  const pathPart = target.split('#')[0]!.split('?')[0]!;
  if (!pathPart) return null;
  if (resolve(dirname(fromAbs), pathPart) !== oldAbs) return null;
  const suffix = target.slice(pathPart.length);
  let rel = relative(dirname(fromAbs), newAbs);
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel + suffix;
}

/** Rewrite the backticked plan path in the reading queue to its archive path and
 *  tag it `(archived — done)` — KEEP the entry (D-089: removal is human judgment).
 *  Pure string transform. Idempotent (won't double-tag). */
export function rewriteQueuePath(queue: string, oldRel: string, newRel: string): string {
  const escaped = oldRel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return queue.replace(
    new RegExp('`' + escaped + '`(?!\\s*\\(archived)', 'g'),
    `\`${newRel}\` (archived — done)`,
  );
}

interface Move {
  oldRel: string;
  newRel: string;
  oldAbs: string;
  newAbs: string;
}

/** Move every archivable plan and fix up links + queue. Returns what it did.
 *  With `stage`, records the moves/edits in the index (git mv + git add) — else
 *  writes to disk only, staging nothing (shared-tree default). */
function archiveDonePlans(stage: boolean): { moves: Move[]; relinked: string[]; queued: boolean } {
  const moves: Move[] = [];
  for (const f of planFiles()) {
    const st = parseStatusToken(read(`${PLANS_DIR}/${f}`));
    if (!st?.archivable) continue;
    moves.push({
      oldRel: `${PLANS_DIR}/${f}`,
      newRel: `${ARCHIVE_DIR}/${f}`,
      oldAbs: abs(`${PLANS_DIR}/${f}`),
      newAbs: abs(`${ARCHIVE_DIR}/${f}`),
    });
  }
  if (moves.length === 0) return { moves, relinked: [], queued: false };

  // 1) move the files
  for (const m of moves) {
    if (stage) execFileSync('git', ['mv', m.oldRel, m.newRel], { cwd: repoRoot });
    else renameSync(m.oldAbs, m.newAbs);
  }
  // 2) rewrite intra-repo markdown links pointing at any moved plan
  const relinked: string[] = [];
  for (const fileAbs of scannedMdFiles()) {
    const before = readFileSync(fileAbs, 'utf-8');
    let after = before;
    for (const m of moves) {
      after = after.replace(LINK_RE, (whole, tgt: string) => {
        const next = relinkTarget(fileAbs, tgt, m.oldAbs, m.newAbs);
        return next === null ? whole : whole.replace(tgt, next);
      });
    }
    if (after !== before) {
      writeFileSync(fileAbs, after, 'utf-8');
      relinked.push(relative(repoRoot, fileAbs));
      if (stage) execFileSync('git', ['add', '--', relative(repoRoot, fileAbs)], { cwd: repoRoot });
    }
  }
  // 3) rewrite the reading-queue backticked path (keep + tag)
  let queued = false;
  const queueAbs = abs(QUEUE);
  if (existsSync(queueAbs)) {
    const before = readFileSync(queueAbs, 'utf-8');
    let after = before;
    for (const m of moves) after = rewriteQueuePath(after, m.oldRel, m.newRel);
    if (after !== before) {
      writeFileSync(queueAbs, after, 'utf-8');
      queued = true;
      if (stage) execFileSync('git', ['add', '--', QUEUE], { cwd: repoRoot });
    }
  }
  return { moves, relinked, queued };
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
  const stage = process.argv.includes('--stage');

  if (check) {
    // 1) token vocabulary — every plan must lead with a closed token (§2.2, §3.2)
    const bad = invalidTokenPlans();
    // 2) region freshness — the generated regions must byte-match a dry run
    const stale = targetFiles.filter((f) => {
      const { before, after } = regenerateFile(f);
      return before !== after;
    });
    if (bad.length || stale.length) {
      if (bad.length) {
        console.error('  X checkpoint --check FAILED: plan status token(s) outside the closed set');
        console.error(`    (${CLOSED_TOKENS.join(' · ')}):`);
        for (const b of bad) console.error(`      ${b.file} — ${b.token ?? '(no **Status: line)'}`);
      }
      if (stale.length) {
        console.error('  X checkpoint --check FAILED: generated region(s) are stale:');
        for (const f of stale) console.error(`      ${f}`);
        console.error('    Run `npm run checkpoint` to regenerate, then stage the files.');
      }
      process.exit(1);
    }
    console.log(
      `  ✓ checkpoint --check: ${targetFiles.length} region-doc(s) fresh; ${planFiles().length} plan token(s) valid.`,
    );
    process.exit(0);
  }

  // write mode
  console.log('checkpoint — mechanical process-doc regeneration');

  // Loud (never blocking) warn on any non-closed token — the write still proceeds.
  const bad = invalidTokenPlans();
  for (const b of bad) {
    console.log(`  !! non-closed status token in ${b.file}: ${b.token ?? '(no **Status: line)'}`);
  }

  // Archive done/superseded plans FIRST (so the active-plans region excludes them).
  const { moves, relinked, queued } = archiveDonePlans(stage);
  for (const m of moves)
    console.log(`  → archived ${m.oldRel} → ${m.newRel}${stage ? ' (staged)' : ''}`);
  for (const f of relinked) console.log(`    relinked ${f}`);
  if (queued) console.log(`    reading-queue path(s) rewritten + tagged (archived — done)`);

  const wrote: string[] = [];
  for (const file of targetFiles) {
    const { before, after } = regenerateFile(file);
    if (before !== after) {
      writeFileSync(abs(file), after, 'utf-8');
      wrote.push(file);
    }
  }
  if (wrote.length) {
    console.log(`  wrote ${wrote.length} region-doc(s):`);
    for (const f of wrote) console.log(`    ~ ${f}`);
  } else if (moves.length === 0) {
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

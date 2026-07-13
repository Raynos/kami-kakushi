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
//   pnpm run checkpoint          write: regenerate the regions in place, then report
//   pnpm run checkpoint:check    --check: regenerate into memory, fail on any byte
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
const JOURNAL_DIR = 'project/journal';
const JOURNAL_TEMPLATE = 'project/journal/_TEMPLATE.md';

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
// Only DONE / SUPERSEDED graduate out of docs/plans/. This set MUST agree with
// session-brief.sh's archivable match — both parse the SAME closed vocabulary.
const ARCHIVABLE = new Set<string>(['DONE', 'SUPERSEDED']);

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
  // token; every other status is a single leading word (so "SUPERSEDED by FB-2"
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
  // The gate names have no internal spaces, so a plain ~72-col word-fold of the
  // comma-separated list never splits an inline-code span.
  return wrap(`**${GATES.length} gates**: ${names}.`, 72);
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

/** The resume-block "newest journal" pointer for project-status.md — a markdown
 *  link to the newest journal, relative to project/status/. Generated so the hand-
 *  typed filename can't rot (it lagged 6 sessions behind newest at s63, the exact
 *  drift this closes). Only the derivable path lives inside the markers; the prose
 *  around them stays hand-authored. The 3-space indent aligns the line as the
 *  step-1 list continuation it sits inside — bake it in so a dry run byte-matches. */
function genResumeJournal(): string {
  const newest = newestJournalName(readdirSync(abs(JOURNAL_DIR)));
  const link = newest
    ? `[\`journal/${newest}\`](../journal/${newest})`
    : '_(no journal yet — `project/journal/` is empty)_';
  return `   ${link}`;
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

/** Done/superseded plans still physically sitting in docs/plans/ (write mode
 *  auto-archives them; in --check we can only FLAG). A loud WARN, never a block:
 *  mid-flight a co-agent may mark DONE moments before archiving, so a tree-wide
 *  hard block day-one would collide with "don't fight someone else's red" (§3.2).
 *  Promotion WARN->block is DEFERRED to the human after a clean soak week. */
function unArchivedDonePlans(): string[] {
  return planFiles().filter((f) => parseStatusToken(read(`${PLANS_DIR}/${f}`))?.archivable);
}

// --- stale BACKLOG plan-pointer guard (human, 2026-07-07) ---------------------
// project/BACKLOG.md holds parked *notes*, not pointers to plans — a parked PLAN
// lives as a real doc in docs/plans/ (a deferred-tier plan in docs/plans/<tier>/,
// PARKED). A `docs/plans/…` reference in BACKLOG rots the moment that plan
// archives out of docs/plans/ (it happened twice — the T0 economy + rung-
// progression pointers outlived their archived plans). This guard RED-flags any
// such reference whose target file no longer exists under docs/plans/. A live
// cross-reference (target present) is fine. Sound rung: a backticked path either
// resolves on disk or it doesn't — no wolf-crying.
const BACKLOG = 'project/BACKLOG.md';

/** Every `docs/plans/….md` path referenced in `text` (markdown link, inline-code,
 *  or bare) — deduped, in source order. Pure. */
export function extractPlanRefs(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const re = /docs\/plans\/[A-Za-z0-9._/-]+\.md/g;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (!seen.has(m[0])) {
      seen.add(m[0]);
      out.push(m[0]);
    }
  }
  return out;
}

/** Of the plan paths referenced in `backlogText`, those whose file is ABSENT
 *  (archived / moved / deleted) — the stale pointers BACKLOG must not keep.
 *  Pure: `exists` (repo-relative → bool) is injected so it is RED-able. */
export function stalePlanRefs(backlogText: string, exists: (rel: string) => boolean): string[] {
  return extractPlanRefs(backlogText).filter((p) => !exists(p));
}

/** Wrapper over the real filesystem: the stale `docs/plans/…` refs in BACKLOG. */
function staleBacklogRefs(): string[] {
  if (!existsSync(abs(BACKLOG))) return [];
  return stalePlanRefs(read(BACKLOG), (rel) => existsSync(abs(rel)));
}

// --- auto-archive done plans (§2.3–2.4) ---------------------------------------
// A plan whose token is DONE/SUPERSEDED graduates OUT of docs/plans/. We move the
// file, recompute every intra-repo markdown link that pointed at it, and rewrite
// its backticked path in the reading queue (tagging it, never removing it — ADR-089
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

/** Swap ONLY the target inside a matched `[text](target …)` link. A naive
 *  `whole.replace(tgt, next)` hits the FIRST occurrence of the target string —
 *  and in this repo's dominant [`path`](path) idiom that first occurrence is
 *  the link TEXT, so the text got rewritten and the target stayed stale
 *  (found the hard way archiving the process-wave master plan; md-links
 *  caught the dead target). The text cannot contain `]` (LINK_RE), so the
 *  first `](` is the text/target boundary — splice by position. */
export function replaceLinkTarget(whole: string, tgt: string, next: string): string {
  const sep = whole.indexOf('](') + 2;
  return whole.slice(0, sep) + next + whole.slice(sep + tgt.length);
}

/** Rewrite the backticked plan path in the reading queue to its archive path and
 *  tag it `(archived — done)` — KEEP the entry (ADR-089: removal is human judgment).
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
        return next === null ? whole : replaceLinkTarget(whole, tgt, next);
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

// --- journal skeleton scaffolding (§2.5) --------------------------------------
// `checkpoint -- --journal "<topic>"` CREATES a dated session-skeleton from the
// _TEMPLATE.md shape-A block, with NN = (max existing NN) + 1. It only ever
// CREATES — it never opens or appends to an existing file, so the append-only
// lossless journal invariant is preserved. Prose stays hand-written.

/** Global monotonic session number = max existing NN + 1 (what hand-numbering does). */
export function nextSessionNumber(names: string[]): number {
  const nums = names
    .map((f) => /-session-(\d+)/.exec(f)?.[1])
    .filter((n): n is string => n != null)
    .map(Number);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

/** The newest journal filename from a listing = the one with the GREATEST session
 *  number. Session numbers are globally monotonic (nextSessionNumber = max + 1), so
 *  the max number is authoritative — and it beats a lexical `.sort()`, which mis-
 *  ranks an unpadded "session-9" ABOVE "session-63". Returns null when the listing
 *  holds no session journals. Pure — exported for test. */
export function newestJournalName(names: string[]): string | null {
  let best: string | null = null;
  let bestNum = -Infinity;
  for (const f of names) {
    const m = /^\d{4}-\d{2}-\d{2}-session-(\d+).*\.md$/.exec(f);
    if (!m) continue;
    const n = Number(m[1]);
    if (n > bestNum) {
      bestNum = n;
      best = f;
    }
  }
  return best;
}

export function slugify(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function today(): string {
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Extract the shape-A skeleton from _TEMPLATE.md and fill NN / date / topic.
 *  Generated from the template (single source) rather than hard-copied here. */
export function fillJournalSkeleton(
  template: string,
  nn: number,
  date: string,
  topic: string,
): string {
  const aStart = template.indexOf('SHAPE A');
  const bStart = template.indexOf('SHAPE B');
  const afterA = template.indexOf('-->', aStart);
  if (aStart < 0 || bStart < 0 || afterA < 0)
    throw new Error('checkpoint: _TEMPLATE.md is missing its SHAPE A / SHAPE B markers.');
  const block = template
    .slice(afterA + 3, bStart)
    .replace(/<!--[\s\S]*?-->\s*$/, '')
    .trim();
  return (
    block
      .replace('Session NN', `Session ${nn}`)
      .replace('{YYYY-MM-DD}', date)
      .replace('{one-line tagline / goal}', topic) + '\n'
  );
}

/** Create the skeleton file. Returns its repo-relative path, or throws if the
 *  target already exists (never touches an existing journal file). */
function scaffoldJournal(topic: string): string {
  const names = readdirSync(abs(JOURNAL_DIR)).filter((f) => /-session-\d+/.test(f));
  const nn = nextSessionNumber(names);
  const rel = `${JOURNAL_DIR}/${today()}-session-${nn}-${slugify(topic)}.md`;
  if (existsSync(abs(rel)))
    throw new Error(`checkpoint --journal: refusing to touch an existing file: ${rel}`);
  const body = fillJournalSkeleton(read(JOURNAL_TEMPLATE), nn, today(), topic);
  writeFileSync(abs(rel), body, 'utf-8');
  return rel;
}

// --- region wiring ------------------------------------------------------------

interface RegionSpec {
  file: string;
  id: string;
  gen: () => string;
}
const REGIONS: ReadonlyArray<RegionSpec> = [
  { file: 'project/status/project-status.md', id: 'gate-roster', gen: genGateRoster },
  { file: 'project/status/project-status.md', id: 'resume-journal', gen: genResumeJournal },
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
  const argv = process.argv;
  const check = argv.includes('--check');
  const stage = argv.includes('--stage');
  // `--journal "<topic>"` — the topic is the next non-flag argument.
  const jIdx = argv.indexOf('--journal');
  const journalTopic = jIdx >= 0 ? argv[jIdx + 1] : undefined;

  if (check) {
    // 1) token vocabulary — every plan must lead with a closed token (§2.2, §3.2)
    const bad = invalidTokenPlans();
    // 2) region freshness — the generated regions must byte-match a dry run
    const stale = targetFiles.filter((f) => {
      const { before, after } = regenerateFile(f);
      return before !== after;
    });
    // 3) stale BACKLOG plan-pointers — a docs/plans/… ref whose target archived
    const staleRefs = staleBacklogRefs();
    if (bad.length || stale.length || staleRefs.length) {
      if (bad.length) {
        console.error('  X checkpoint --check FAILED: plan status token(s) outside the closed set');
        console.error(`    (${CLOSED_TOKENS.join(' · ')}):`);
        for (const b of bad) console.error(`      ${b.file} — ${b.token ?? '(no **Status: line)'}`);
      }
      if (stale.length) {
        console.error('  X checkpoint --check FAILED: generated region(s) are stale:');
        for (const f of stale) console.error(`      ${f}`);
        console.error('    Run `pnpm run checkpoint` to regenerate, then stage the files.');
      }
      if (staleRefs.length) {
        console.error(`  X checkpoint --check FAILED: ${BACKLOG} references plan(s) no longer`);
        console.error('    in docs/plans/ (archived / moved) — a stale pointer, remove the line:');
        for (const p of staleRefs) console.error(`      ${p}`);
        console.error(`    BACKLOG holds parked NOTES, not plan-pointers (see its header).`);
      }
      process.exit(1);
    }
    // DONE-not-archived: a loud WARN, never a block (promotion deferred to the human).
    const unarchived = unArchivedDonePlans();
    for (const f of unarchived) {
      console.error(
        `  ~ checkpoint WARN: ${PLANS_DIR}/${f} reads DONE/SUPERSEDED but still sits in ${PLANS_DIR}/ —` +
          ` run \`pnpm run checkpoint\` to graduate it to ${ARCHIVE_DIR}/. (WARN only, not blocking.)`,
      );
    }
    console.log(
      `  ✓ checkpoint --check: ${targetFiles.length} region-doc(s) fresh; ${planFiles().length} plan token(s) valid.`,
    );
    process.exit(0);
  }

  // --- write mode: the end-of-run report is "wrote / moved / flagged" ---------
  console.log('checkpoint — mechanical process-doc regeneration');

  // Optional journal skeleton (create-only; never touches an existing file).
  let scaffolded: string | undefined;
  if (jIdx >= 0) {
    if (!journalTopic || journalTopic.startsWith('--')) {
      console.error('  X checkpoint --journal needs a topic: --journal "the topic"');
      process.exit(2);
    }
    scaffolded = scaffoldJournal(journalTopic);
    console.log(`  + scaffolded journal: ${scaffolded}`);
  }

  // Archive done/superseded plans FIRST (so the active-plans region excludes them).
  const { moves, relinked, queued } = archiveDonePlans(stage);
  for (const m of moves)
    console.log(`  → moved ${m.oldRel} → ${m.newRel}${stage ? ' (staged)' : ''}`);
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

  // Flagged (never blocking here — the RED gate is --check): non-closed tokens.
  const bad = invalidTokenPlans();
  for (const b of bad)
    console.log(
      `  !! flagged: non-closed status token in ${b.file}: ${b.token ?? '(no **Status: line)'}`,
    );

  // Flagged: stale BACKLOG plan-pointers (the RED gate is --check; here a WARN).
  for (const p of staleBacklogRefs())
    console.log(`  !! flagged: ${BACKLOG} points at archived/moved plan: ${p} (remove the line)`);

  // Newest journal — a bare run just names it (no scaffolding). Same picker the
  // resume-journal region uses, so the printout and the spliced pointer agree.
  if (!scaffolded) {
    const newest = newestJournalName(readdirSync(abs(JOURNAL_DIR)));
    if (newest) console.log(`  newest journal: ${JOURNAL_DIR}/${newest}`);
  }
  process.exit(0);
}

// Run the CLI only when invoked directly (tsx src/scripts/checkpoint.ts), NOT when
// imported by a test for its pure exports (parseStatusToken, CLOSED_TOKENS).
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invoked === fileURLToPath(import.meta.url)) runCli();

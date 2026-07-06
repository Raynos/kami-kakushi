// check-md-links — resolve every intra-repo relative markdown link and fail on a dead target.
//
// The "highest rung that SOUNDLY holds it" for link rot (AC-11): file/dir EXISTENCE only — strict,
// zero false-positive over the repo's links. Anchor-checking is deliberately OMITTED — there are no
// intra-repo `#anchor` links today, and slugifying the §/kanji/emoji headings would risk crying
// wolf; add it only if anchor links appear. External links (http/mailto) and same-page `#anchors`
// are skipped. History / scratch dirs are NOT scanned (their staleness is by design — AC-22), but a
// link POINTING INTO them is still resolved (the target must exist).
//
// Motivated by the 2026-06-30 stale-markdown sweep (the completeness critic's #1 next-check): the
// PRD split + retired trackers left dead `[text](path)` links a prose review can't see. Wired into
// `verify` as a gate so link rot can't recur silently.
export {};

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

// Authoritative / living docs to SCAN (history & scratch excluded by design — AC-22).
const SCAN_ROOTS = [
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  'docs',
  '.claude',
  'project/status',
  'project/human-in-the-loop',
  'project/todo-human.md',
];
// 'worktrees': co-agent git worktrees under .claude/worktrees — transient full-repo
// checkouts whose relative links break one level deeper; scanning them cries wolf (AC-11).
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'tmp', 'worktrees']);

function walk(abs: string, out: string[]): void {
  const st = statSync(abs);
  if (st.isFile()) {
    if (abs.endsWith('.md')) out.push(abs);
    return;
  }
  for (const name of readdirSync(abs)) {
    if (EXCLUDE_DIRS.has(name)) continue;
    walk(join(abs, name), out);
  }
}

const files: string[] = [];
for (const root of SCAN_ROOTS) {
  const abs = join(repoRoot, root);
  if (existsSync(abs)) walk(abs, files);
}
// The per-dir index docs (project/<dir>/README.md) are authoritative too.
const projAbs = join(repoRoot, 'project');
if (existsSync(projAbs)) {
  for (const name of readdirSync(projAbs)) {
    const readme = join(projAbs, name, 'README.md');
    if (existsSync(readme) && !files.includes(readme)) files.push(readme);
  }
}

// `[text](target)` / `![alt](target)` — target = up to the first space (a "title") or `)`.
const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const SKIP = /^(https?:|mailto:|tel:|data:|#|<)/i;

interface Broken {
  file: string;
  line: number;
  target: string;
}
const broken: Broken[] = [];

for (const abs of files) {
  // Strip fenced code blocks + inline code so EXAMPLE links (in ``` or `…`) aren't resolved.
  const text = readFileSync(abs, 'utf8').replace(/```[\s\S]*?```/g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
  text.split('\n').forEach((rawLine, i) => {
    const line = rawLine.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length));
    LINK.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = LINK.exec(line)) !== null) {
      const raw = m[1]!;
      if (SKIP.test(raw)) continue;
      const pathPart = raw.split('#')[0]!.split('?')[0]!;
      if (!pathPart) continue; // pure `#anchor` / `?query`
      if (!existsSync(resolve(dirname(abs), pathPart))) {
        broken.push({ file: relative(repoRoot, abs), line: i + 1, target: pathPart });
      }
    }
  });
}

if (broken.length > 0) {
  console.error(`✗ md-links: ${broken.length} dead intra-repo link(s):`);
  for (const b of broken) console.error(`    ${b.file}:${b.line} → ${b.target}`);
  console.error(
    '  Fix the path, or point at the renamed target. (External/#anchor links are skipped.)',
  );
  process.exit(1);
}
console.log(
  `✓ md-links: all intra-repo relative links resolve (${files.length} md files scanned).`,
);

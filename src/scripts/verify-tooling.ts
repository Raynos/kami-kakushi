// verify-tooling — a RED-able meta-suite for the process scaffolding itself.
//
// Why: the game has ~800 tests; the enforcement lattice (git hooks, Claude
// guards, hookify rules, the session-brief probes) had ZERO — and both known
// silent failures lived exactly there (the macOS `timeout` CI probe dead for
// weeks; the phantom herdr self-peer). This suite makes the advisory layer
// able to go RED. Context-hardening P2 (docs/plans → archived plan).
//
// Wiring: `pnpm run verify:tooling`, run by .github/workflows/verify-nightly.yml
// ONLY — deliberately NOT in the commit/push roster (src/scripts/gates.ts):
// ADR-072's 5s budget is sacred, and this suite spawns dozens of processes.
//
// Checks (all fixture/table-driven so each can go RED):
//   1. hook syntax + executability   bash -n + +x on .githooks/* and .claude/hooks/*.sh
//   2. guard-git-add-all matrix      canned PreToolUse JSON → expected allow/block exit
//   3. commit-msg matrix             canned message files → expected pass/fail exit
//   4. hookify rules                 frontmatter well-formed, pattern compiles,
//                                    per-rule must-match / must-not-match strings
//   5. probe liveness                the perl alarm+exec time-box works; herdr-peers.sh
//                                    exits 0 with and without herdr; session-brief.sh
//                                    completes and prints the brief
//   6. mutation self-test            break the guard regex in a TEMP COPY → the matrix
//                                    must go RED (proves the fixtures bite; the copy is
//                                    deleted, the real hook is never touched)
export {};

import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

let failures = 0;
let checks = 0;
function ok(label: string): void {
  checks++;
  console.log(`  ✓ ${label}`);
}
function fail(label: string, detail?: string): void {
  checks++;
  failures++;
  console.error(`  ✗ ${label}`);
  if (detail)
    console.error(
      detail
        .trimEnd()
        .split('\n')
        .map((l) => `      ${l}`)
        .join('\n'),
    );
}

// Run a command; returns {code, out}. Never throws.
function run(
  cmd: string,
  args: string[],
  opts: { input?: string; cwd?: string; env?: Record<string, string | undefined> } = {},
): { code: number; out: string } {
  const r = spawnSync(cmd, args, {
    input: opts.input,
    cwd: opts.cwd ?? ROOT,
    env: { ...process.env, ...opts.env },
    encoding: 'utf8',
    timeout: 30_000,
  });
  return { code: r.status ?? 1, out: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

// ---------------------------------------------------------------------------
// 1 · syntax + executability — every hook parses and carries +x
// ---------------------------------------------------------------------------
console.log('verify:tooling — the process-scaffolding meta-suite\n');
console.log('1 · hook syntax + executability');

const hookFiles: string[] = [
  ...readdirSync(join(ROOT, '.githooks')).map((f) => join('.githooks', f)),
  ...readdirSync(join(ROOT, '.claude/hooks'))
    .filter((f) => f.endsWith('.sh'))
    .map((f) => join('.claude/hooks', f)),
];
for (const rel of hookFiles) {
  const abs = join(ROOT, rel);
  const syn = run('bash', ['-n', abs]);
  if (syn.code !== 0) fail(`${rel} — bash -n`, syn.out);
  else if (!(statSync(abs).mode & 0o111)) fail(`${rel} — not executable (+x missing)`);
  else ok(`${rel} — parses, +x`);
}

// ---------------------------------------------------------------------------
// 2 · guard-git-add-all matrix — the shared-tree sweep guard's exact contract
// ---------------------------------------------------------------------------
console.log('\n2 · guard-git-add-all.sh allow/block matrix');

const GUARD = join(ROOT, '.claude/hooks/guard-git-add-all.sh');
// The bare-commit check consults `.git/MERGE_HEAD` relative to CWD — run the
// guard from an empty temp dir so the matrix is hermetic (no merge state).
const guardCwd = mkdtempSync(join(tmpdir(), 'vt-guard-'));

type GuardCase = { cmd: string; expect: 0 | 2; why: string };
const GUARD_MATRIX: GuardCase[] = [
  // must BLOCK (exit 2)
  { cmd: 'git add -A', expect: 2, why: 'stage-all' },
  { cmd: 'git add --all', expect: 2, why: 'stage-all long form' },
  { cmd: 'git add -Av', expect: 2, why: 'combined short flags containing A' },
  { cmd: 'git add .', expect: 2, why: 'whole-tree staging' },
  { cmd: 'cd foo && git add .', expect: 2, why: 'whole-tree staging after &&' },
  { cmd: 'git commit -am "x"', expect: 2, why: 'commit -a stages all tracked' },
  { cmd: 'git commit --all -m "x"', expect: 2, why: 'commit --all' },
  { cmd: 'git commit -m "x"', expect: 2, why: 'bare commit snapshots the shared index' },
  // must ALLOW (exit 0)
  { cmd: 'git add path/a path/b', expect: 0, why: 'explicit pathspec add' },
  { cmd: 'git add -p src/foo.ts', expect: 0, why: 'interactive patch add' },
  { cmd: 'git commit -m "x" -- path/a path/b', expect: 0, why: 'pathspec commit (--only)' },
  { cmd: 'git commit --amend --no-edit', expect: 0, why: 'amend passes' },
  { cmd: 'SKIP_SWEEPGUARD=1 git commit -m "x"', expect: 0, why: 'deliberate whole-index escape' },
  { cmd: 'git status', expect: 0, why: 'read-only command' },
  { cmd: 'git diff --cached --name-only', expect: 0, why: 'read-only command' },
];

// Returns the failing case labels — reused by the mutation self-test (§6),
// which needs the SAME matrix to go RED against a broken copy of the hook.
function runGuardMatrix(hookPath: string): string[] {
  const bad: string[] = [];
  for (const c of GUARD_MATRIX) {
    const json = JSON.stringify({ tool_input: { command: c.cmd } });
    const r = run('bash', [hookPath], { input: json, cwd: guardCwd });
    if (r.code !== c.expect)
      bad.push(`"${c.cmd}" → exit ${r.code}, expected ${c.expect} (${c.why})`);
  }
  return bad;
}

if (run('bash', ['-c', 'command -v jq']).code !== 0) {
  fail(
    'jq present (guard-git-add-all depends on it)',
    'install jq — without it the guard silently allows everything',
  );
} else {
  const bad = runGuardMatrix(GUARD);
  if (bad.length)
    fail(`guard matrix — ${bad.length}/${GUARD_MATRIX.length} case(s) wrong`, bad.join('\n'));
  else ok(`guard matrix — ${GUARD_MATRIX.length} cases (block + allow) hold`);
}

// ---------------------------------------------------------------------------
// 3 · commit-msg matrix — the Assisted-by attribution gate's exact contract
// ---------------------------------------------------------------------------
console.log('\n3 · commit-msg attribution matrix');

const COMMIT_MSG = join(ROOT, '.githooks/commit-msg');
const msgDir = mkdtempSync(join(tmpdir(), 'vt-msg-'));
type MsgCase = { name: string; body: string; expect: 0 | 1; env?: Record<string, string> };
const MSG_MATRIX: MsgCase[] = [
  {
    name: 'good trailer passes',
    body: 'feat(core): a change\n\nBody.\n\nAssisted-by: Claude Code:claude-fable-5\n',
    expect: 0,
  },
  {
    name: 'trailer with unknown version passes',
    body: 'fix(ui): x\n\nAssisted-by: Claude Code:unknown\n',
    expect: 0,
  },
  { name: 'missing trailer fails', body: 'feat(core): a change\n\nBody only.\n', expect: 1 },
  {
    // The FIRST colon is the delimiter (spec) — extra colons land in VERSION,
    // so "Claude: Code:model" parses as name=Claude and legitimately PASSES.
    name: 'first-colon-is-delimiter (extra colons live in version)',
    body: 'feat: x\n\nAssisted-by: Claude: Code:model\n',
    expect: 0,
  },
  {
    name: 'name starting with a colon fails',
    body: 'feat: x\n\nAssisted-by: :model\n',
    expect: 1,
  },
  { name: 'empty version fails', body: 'feat: x\n\nAssisted-by: Claude Code:\n', expect: 1 },
  { name: 'Merge first-line auto-passes', body: "Merge branch 'foo' into main\n", expect: 0 },
  { name: 'fixup! first-line auto-passes', body: 'fixup! feat(core): a change\n', expect: 0 },
  {
    name: 'SKIP_ATTRIB=1 bypasses',
    body: 'chore: human commit, no trailer\n',
    expect: 0,
    env: { SKIP_ATTRIB: '1' },
  },
];
for (const c of MSG_MATRIX) {
  const f = join(msgDir, c.name.replace(/\W+/g, '-'));
  writeFileSync(f, c.body);
  // SKIP_ATTRIB must not leak in from the calling env except in its own case.
  const r = run('bash', [COMMIT_MSG, f], { env: { SKIP_ATTRIB: undefined, ...c.env } });
  if (r.code !== c.expect)
    fail(`commit-msg: ${c.name} → exit ${r.code}, expected ${c.expect}`, r.out);
  else ok(`commit-msg: ${c.name}`);
}

// ---------------------------------------------------------------------------
// 4 · hookify rules — frontmatter parses, pattern compiles, fixtures hold
// ---------------------------------------------------------------------------
console.log('\n4 · hookify rules parse + fixtures');

// Per-rule behavioural fixtures, keyed by rule name. A rule with no entry gets
// the parse/compile check only — so adding or CULLING a rule (P3 deletes
// no-bulk-git-add) never breaks this suite structurally.
const RULE_FIXTURES: Record<string, { match: string[]; noMatch: string[] }> = {
  'no-tree-mutation': {
    match: [
      'git stash',
      'git restore src/app.ts',
      'git checkout main',
      // P3 extension — the three worst uncovered tree-mutators:
      'git switch main',
      'git reset --hard origin/main',
      'git clean -fd',
      'git clean --force',
    ],
    noMatch: [
      'git checkout -b feature/x',
      'git show HEAD:file',
      'git diff',
      'git switch -c feature/x',
      'git reset --soft HEAD~1',
      'git clean -n',
    ],
  },
  'no-skip-verify-push': {
    match: ['SKIP_VERIFY=1 git push origin main', 'git push && SKIP_VERIFY=1 git push'],
    noMatch: ['git push origin main', 'SKIP_JOURNAL=1 git commit -m x'],
  },
  'warn-shell-write-source': {
    match: ['cat > src/core/foo.ts <<EOF', 'echo "x" >> src/app/main.ts'],
    noMatch: ['echo scratch > tmp/notes.txt', 'cat src/core/foo.ts'],
  },
};

const ruleFiles = readdirSync(join(ROOT, '.claude')).filter(
  (f) => f.startsWith('hookify.') && f.endsWith('.local.md'),
);
if (ruleFiles.length === 0)
  fail('hookify rules found', 'expected at least one .claude/hookify.*.local.md');
for (const rf of ruleFiles) {
  const text = readFileSync(join(ROOT, '.claude', rf), 'utf8');
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) {
    fail(`${rf} — frontmatter block missing`);
    continue;
  }
  const fields = Object.fromEntries(
    fm[1]!
      .split('\n')
      .map((l) => l.match(/^(\w[\w-]*):\s*(.*)$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => [m[1]!, m[2]!]),
  );
  const missing = ['name', 'enabled', 'event', 'pattern', 'action'].filter((k) => !(k in fields));
  if (missing.length) {
    fail(`${rf} — frontmatter missing: ${missing.join(', ')}`);
    continue;
  }
  let re: RegExp;
  try {
    re = new RegExp(fields['pattern']!);
  } catch (e) {
    fail(`${rf} — pattern does not compile`, String(e));
    continue;
  }
  const fx = RULE_FIXTURES[fields['name']!];
  if (!fx) {
    ok(`${rf} — frontmatter + pattern compile (no fixtures registered)`);
    continue;
  }
  const bad: string[] = [];
  for (const s of fx.match) if (!re.test(s)) bad.push(`should match but doesn't: "${s}"`);
  for (const s of fx.noMatch) if (re.test(s)) bad.push(`must NOT match but does: "${s}"`);
  if (bad.length) fail(`${rf} — fixtures`, bad.join('\n'));
  else ok(`${rf} — frontmatter, pattern, ${fx.match.length}+${fx.noMatch.length} fixtures`);
}

// ---------------------------------------------------------------------------
// 5 · probe liveness — the exact failure class of the dead-for-weeks CI probe
// ---------------------------------------------------------------------------
console.log('\n5 · probe liveness');

// The portable time-box the brief's CI probe relies on (macOS has no GNU
// `timeout`): perl alarm+exec must run the command and pass its output through.
{
  const r = run('perl', ['-e', 'alarm shift @ARGV; exec @ARGV', '5', 'echo', 'alive']);
  if (r.code !== 0 || !r.out.includes('alive'))
    fail('perl alarm+exec time-box runs a command', r.out);
  else ok('perl alarm+exec time-box runs a command');
  const t0 = Date.now();
  const timedOut = run('perl', ['-e', 'alarm shift @ARGV; exec @ARGV', '1', 'sleep', '10']);
  const secs = (Date.now() - t0) / 1000;
  if (timedOut.code === 0 || secs > 5)
    fail(`perl time-box actually times out (took ${secs.toFixed(1)}s, exit ${timedOut.code})`);
  else ok('perl time-box kills an over-time command');
}

// The gh probe itself — only when gh is present AND authed (CI runners and
// fresh machines legitimately lack auth; that's the brief's own fallback path).
if (run('bash', ['-c', 'command -v gh && gh auth status']).code === 0) {
  const r = run('bash', [
    '-c',
    String.raw`perl -e 'alarm shift @ARGV; exec @ARGV' 10 gh run list -L 1 -b main -w verify.yml --json conclusion,status --jq '.[0] | (.status + "/" + (.conclusion // "-"))'`,
  ]);
  if (r.code !== 0 || r.out.trim() === '')
    fail(
      'gh CI probe returns non-empty',
      r.out || '(empty output — the silent-dead-probe failure class)',
    );
  else ok(`gh CI probe returns non-empty (${r.out.trim()})`);
} else {
  ok(
    'gh CI probe skipped (gh absent or unauthed — the brief handles this as "(status unavailable)")',
  );
}

// herdr-peers must be a clean no-op in EVERY environment (ADR-124).
{
  const without = run('bash', [join(ROOT, 'src/scripts/herdr-peers.sh'), ROOT], {
    env: { HERDR_ENV: undefined },
  });
  if (without.code !== 0) fail('herdr-peers.sh exits 0 without herdr', without.out);
  else ok('herdr-peers.sh exits 0 without herdr');
  const withEnv = run('bash', [join(ROOT, 'src/scripts/herdr-peers.sh'), ROOT], {
    env: { HERDR_ENV: '1' },
  });
  if (withEnv.code !== 0) fail('herdr-peers.sh exits 0 with HERDR_ENV=1', withEnv.out);
  else ok('herdr-peers.sh exits 0 with HERDR_ENV=1');
}

// The brief itself completes and prints — a broken brief is a blind session start.
{
  const r = run('bash', [join(ROOT, 'src/scripts/session-brief.sh')]);
  if (r.code !== 0 || !r.out.includes('Human-in-the-loop brief'))
    fail('session-brief.sh completes and prints the brief', r.out.slice(0, 800));
  else ok('session-brief.sh completes and prints the brief');
}

// ---------------------------------------------------------------------------
// 6 · mutation self-test — prove the guard matrix can go RED
// ---------------------------------------------------------------------------
console.log('\n6 · mutation self-test (temp copy — the real hook is untouched)');

{
  const mutated = join(mkdtempSync(join(tmpdir(), 'vt-mut-')), 'guard-broken.sh');
  // Break the `git add` detection: every add-pattern stops matching.
  writeFileSync(
    mutated,
    readFileSync(GUARD, 'utf8').replaceAll('git[[:space:]]+add', 'git[[:space:]]+zzadd'),
  );
  chmodSync(mutated, 0o755);
  const bad = runGuardMatrix(mutated);
  if (bad.length === 0)
    fail(
      'broken guard regex makes the matrix RED',
      'matrix stayed GREEN against a broken hook — the fixtures cannot bite',
    );
  else ok(`broken guard regex makes the matrix RED (${bad.length} case(s) caught the mutation)`);
  rmSync(join(mutated, '..'), { recursive: true, force: true });
}

rmSync(guardCwd, { recursive: true, force: true });
rmSync(msgDir, { recursive: true, force: true });

// ---------------------------------------------------------------------------
console.log(
  failures
    ? `\n  ✗ verify:tooling FAILED — ${failures}/${checks} check(s) red`
    : `\n  ✓ verify:tooling OK — ${checks} checks green`,
);
process.exit(failures ? 1 : 0);

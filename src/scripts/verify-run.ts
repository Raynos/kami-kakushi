// verify-run — run the verify gates IN PARALLEL and join at the end (op-model v2 FINAL).
//
// The gates are independent, read-only checks, so the old sequential `&&` chain wasted wall-time
// (~sum of all gates) when the real floor is ~the slowest single gate (vitest). This fans them out
// across a worker pool (default = CPU count; VERIFY_CONCURRENCY to override), captures each gate's
// output, and reports pass/fail at the end — failures print their captured output.
//
// Modes:
//   (default)       run once · per-gate pass/fail · exit non-zero on any failure
//   --verbose, -v   also print every gate's captured output (pass AND fail) + a timing table
//   --debug         --verbose + the resolved config up front (roster, cmds, scope, concurrency, env)
//   --performance   a single pass/fail run PLUS the per-gate critical-path timing table (no budget gate)
//   --budget        run the suite RUNS× · median total · per-gate critical-path breakdown · 5s hard check
//   --help, -h      usage + the full gate roster + the env knobs, then exit
//
// Lane flags (commit-time convenience; semantics in verify-scope.ts):
//   SKIP_CODE_VERIFY=1  skip the 'code'-scoped gates (a docs-only commit — the docs gates still run)
//   SKIP_DOCS_VERIFY=1  skip the 'docs'-scoped gates (a pure code commit)
// Ignored by --budget (it measures the full roster) and by pre-push (a push always runs everything).
//
// The gate list itself now lives in `gates.ts` (the single source of truth — extracted so
// checkpoint.ts can import the roster without running this runner). `npm run verify` → this;
// `npm run verify:budget` → this --budget.
export {};

import { spawn } from 'node:child_process';
import { cpus } from 'node:os';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { GATES } from './gates';
import { gatesForFlags, scopeFlagsFromEnv } from './verify-scope';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const binDir = fileURLToPath(new URL('../../node_modules/.bin', import.meta.url));
const env = { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` };

interface GateResult {
  name: string;
  code: number;
  ms: number;
  output: string;
}

function runGate(g: { name: string; cmd: string }): Promise<GateResult> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const child = spawn(g.cmd, { cwd: repoRoot, env, shell: true });
    let output = '';
    child.stdout.on('data', (d: Buffer) => (output += d.toString()));
    child.stderr.on('data', (d: Buffer) => (output += d.toString()));
    child.on('close', (code) =>
      resolve({ name: g.name, code: code ?? 1, ms: performance.now() - t0, output }),
    );
    child.on('error', (e) =>
      resolve({ name: g.name, code: 1, ms: performance.now() - t0, output: String(e) }),
    );
  });
}

// Worker-pool fan-out. `next++` is atomic on the single-threaded event loop (no await between
// read and increment), so the pull is race-free; each gate's `ms` is its pure run time (the
// worker awaits the prior gate before pulling the next — queue wait is excluded).
async function runAll(
  gates: ReadonlyArray<{ name: string; cmd: string }>,
  limit: number,
): Promise<GateResult[]> {
  const results: GateResult[] = [];
  let next = 0;
  const worker = async (): Promise<void> => {
    while (next < gates.length) {
      results.push(await runGate(gates[next++]!));
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, gates.length) }, worker));
  return results;
}

const fmt = (ms: number): string => `${(ms / 1000).toFixed(2)}s`;
const indent = (s: string): string =>
  s
    .trimEnd()
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n');
const concurrency = Number(process.env.VERIFY_CONCURRENCY) || cpus().length;
const flags = scopeFlagsFromEnv(process.env);

// --- flag parsing (introspection) -------------------------------------------
// npm eats bare args, so users pass these as `npm run verify -- --verbose`;
// pnpm forwards them directly (`pnpm run verify --verbose`). Both land in argv.
const argv = process.argv.slice(2);
const KNOWN = new Set([
  '--budget',
  '--help',
  '-h',
  '--verbose',
  '-v',
  '--debug',
  '--performance',
  '--perf',
]);
const hasFlag = (...names: string[]): boolean => names.some((n) => argv.includes(n));
for (const a of argv) {
  if (a.startsWith('-') && !KNOWN.has(a)) {
    console.error(`  ! unknown flag "${a}" — try \`npm run verify -- --help\``);
    process.exit(2);
  }
}
const budget = hasFlag('--budget');
const debug = hasFlag('--debug');
const verbose = hasFlag('--verbose', '-v') || debug; // --debug implies --verbose
const perf = hasFlag('--performance', '--perf');

function printHelp(): void {
  const budgetMs = fmt(Number(process.env.VERIFY_BUDGET_MS ?? 5000));
  console.log(`verify — run the ${GATES.length} verify gates in parallel and report pass/fail.

Usage:
  npm run verify                    run once · per-gate pass/fail · exit non-zero on any failure
  npm run verify -- --verbose       + every gate's captured output (pass and fail) + a timing table
  npm run verify -- --debug         --verbose + the resolved config before running
  npm run verify -- --performance   a real run + the per-gate timing table (the critical path)
  npm run verify:budget             run the suite RUNS× · median total · hard ${budgetMs} budget check
  npm run verify -- --help          this text
  (pnpm forwards args without the \`--\`, e.g. \`pnpm run verify --verbose\`.)

Env knobs:
  VERIFY_CONCURRENCY   worker-pool size (default = CPU count, currently ${cpus().length})
  SKIP_CODE_VERIFY=1   skip the 'code'-scoped gates (a docs-only commit)
  SKIP_DOCS_VERIFY=1   skip the 'docs'-scoped gates (a pure code commit)
  VERIFY_BUDGET_MS     --budget target in ms (default 5000)
  VERIFY_BUDGET_RUNS   --budget sample count (default 3)

Gates (source of truth: src/scripts/gates.ts):
${GATES.map((g) => `  ${g.scope.padEnd(4)}  ${g.name.padEnd(20)} ${g.cmd}`).join('\n')}`);
}

function printTimings(results: GateResult[]): void {
  console.log('\n  per-gate run time (slowest first = the critical path):');
  for (const g of [...results].sort((a, b) => b.ms - a.ms)) {
    console.log(`    ${fmt(g.ms).padStart(7)}  ${g.name}`);
  }
}

function printAllOutput(results: GateResult[]): void {
  for (const r of [...results].sort((a, b) => b.ms - a.ms)) {
    const out = r.output.trim();
    console.log(`\n  ${r.code === 0 ? '✓' : '✗'} ${r.name} (${fmt(r.ms)}, exit ${r.code}):`);
    console.log(out ? indent(out) : '    (no output)');
  }
}

if (hasFlag('--help', '-h')) {
  printHelp();
  process.exit(0);
}

if (!budget) {
  const { run: roster, skipped } = gatesForFlags(GATES, flags);
  if (debug) {
    console.log('  debug — resolved config:');
    console.log(`    concurrency: ${concurrency} (${cpus().length} CPUs)`);
    console.log(`    scope flags: skipCode=${flags.skipCode} skipDocs=${flags.skipDocs}`);
    console.log(`    PATH prepend: ${binDir}`);
    console.log(`    roster: ${roster.length}/${GATES.length} gate(s)`);
    for (const g of roster) console.log(`      ${g.name.padEnd(20)} ${g.cmd}`);
    console.log('');
  }
  if (skipped.length) {
    // Loud, never silent: a scoped run must be unmistakable in the output (no false "all green").
    const via = [flags.skipCode && 'SKIP_CODE_VERIFY', flags.skipDocs && 'SKIP_DOCS_VERIFY']
      .filter(Boolean)
      .join(' + ');
    console.log(
      `  ~ scoped verify (${via}) — skipping ${skipped.length}/${GATES.length}: ${skipped.map((g) => g.name).join(', ')}`,
    );
  }
  if (roster.length === 0) {
    console.log(
      '  ~ ALL gates skipped (both lane flags set = a full skip — prefer SKIP_VERIFY=1 to say that).',
    );
    process.exit(0);
  }
  const t0 = performance.now();
  const results = await runAll(roster, concurrency);
  const total = performance.now() - t0;
  const failed = results.filter((r) => r.code !== 0);
  // --verbose/--debug dump every gate's output (incl. failures); --performance shows just timings.
  if (verbose) {
    printAllOutput(results);
    printTimings(results);
  } else if (perf) {
    printTimings(results);
  }
  if (failed.length) {
    // Skip the per-failure reprint when --verbose already dumped everything above.
    if (!verbose)
      for (const f of failed) {
        console.error(`\n  ✗ ${f.name} FAILED (exit ${f.code}):`);
        console.error(indent(f.output));
      }
    console.error(
      `\n  verify FAILED — ${failed.length}/${roster.length} gate(s) in ${fmt(total)} (${concurrency}-way parallel)`,
    );
    process.exit(1);
  }
  const slowest = [...results].sort((a, b) => b.ms - a.ms)[0]!;
  const scopeNote = skipped.length ? ` of ${GATES.length} (${skipped.length} lane-skipped)` : '';
  console.log(
    `  verify OK — ${roster.length} gates${scopeNote} in ${fmt(total)} (${concurrency}-way parallel; slowest: ${slowest.name} ${fmt(slowest.ms)})`,
  );
  process.exit(0);
}

if (flags.skipCode || flags.skipDocs) {
  console.log('  ~ SKIP_CODE_VERIFY/SKIP_DOCS_VERIFY ignored: --budget measures the FULL roster.');
}

// --budget: the deliberate hard check — median of RUNS parallel runs + the per-gate critical path.
const BUDGET_MS = Number(process.env.VERIFY_BUDGET_MS ?? 5000);
const RUNS = Math.max(1, Number(process.env.VERIFY_BUDGET_RUNS ?? 3));
if (!Number.isFinite(BUDGET_MS) || BUDGET_MS <= 0) {
  console.error(`  X VERIFY_BUDGET_MS is not a positive number: "${process.env.VERIFY_BUDGET_MS}"`);
  process.exit(2);
}
console.log(
  `verify:budget — target ${fmt(BUDGET_MS)} · ${GATES.length} gates · ${concurrency}-way parallel · median of ${RUNS}\n`,
);
const totals: number[] = [];
let last: GateResult[] = [];
for (let i = 0; i < RUNS; i++) {
  const t0 = performance.now();
  last = await runAll(GATES, concurrency);
  totals.push(performance.now() - t0);
  const failed = last.filter((r) => r.code !== 0);
  if (failed.length) {
    console.error(
      `  X verify is RED (${failed.map((f) => f.name).join(', ')}) — fix it before measuring budget.`,
    );
    process.exit(2);
  }
}
console.log('  per-gate run time (slowest first = the critical path):');
for (const g of [...last].sort((a, b) => b.ms - a.ms)) {
  console.log(`    ${fmt(g.ms).padStart(7)}  ${g.name}`);
}
totals.sort((a, b) => a - b);
const median = totals[Math.floor(totals.length / 2)]!;
console.log(`\n  parallel runs: ${totals.map(fmt).join(' · ')}`);
console.log(`  median: ${fmt(median)}   budget: ${fmt(BUDGET_MS)}`);
if (median > BUDGET_MS) {
  console.error(
    `\n  X OVER BUDGET by ${fmt(median - BUDGET_MS)}. The critical path is the slowest gate above — trim or shard it.`,
  );
  process.exit(1);
}
console.log(`\n  OK — ${fmt(BUDGET_MS - median)} of headroom under the ${fmt(BUDGET_MS)} budget.`);

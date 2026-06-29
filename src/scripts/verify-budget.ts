// Verify BUDGET check (op-model v2 FINAL, Workstream B — 2026-06-29).
//
// The pre-commit gate runs the full `npm run verify` every commit; it must stay inside a ~5s
// budget so commits stay cheap. This script is the DELIBERATE, hard-failing budget check:
//   - times each `verify` gate once (a "what's slow" breakdown), and
//   - runs the full `verify` 3x cold and takes the MEDIAN total,
//   - exits NON-ZERO if the median is over the budget.
//
// It is the ONLY place a budget hard-fail lives, and it only fires when you explicitly run it
// (`npm run verify:budget`). The pre-commit timer + the pre-push hook are noisy-but-non-blocking
// (X-3); this is where you sit down and decide the box is blown. The gate list is parsed from
// package.json's `verify` script so it can never drift out of sync.
export {};

import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BUDGET_MS = Number(process.env.VERIFY_BUDGET_MS ?? 5000);
const RUNS = Number(process.env.VERIFY_BUDGET_RUNS ?? 3);

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const binDir = fileURLToPath(new URL('../../node_modules/.bin', import.meta.url));
const env = { ...process.env, PATH: `${binDir}:${process.env.PATH ?? ''}` };

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  scripts: Record<string, string>;
};
const verifyScript = pkg.scripts.verify ?? '';
const gates = verifyScript
  .split('&&')
  .map((s) => s.trim())
  .filter(Boolean);

function time(cmd: string): number {
  const t0 = performance.now();
  execSync(cmd, { cwd: repoRoot, env, stdio: 'ignore' });
  return performance.now() - t0;
}

const fmt = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

console.log(
  `verify:budget — target ${fmt(BUDGET_MS)} per full run · ${gates.length} gates · median of ${RUNS}\n`,
);

// --- per-gate breakdown (one run each) ---
let breakdown: Array<{ cmd: string; ms: number }>;
try {
  breakdown = gates.map((cmd) => ({ cmd, ms: time(cmd) }));
} catch (err) {
  console.error(
    '  X a verify gate FAILED while timing — verify is red; fix it before measuring budget.',
  );
  console.error(`  ${(err as Error).message.split('\n')[0]}`);
  process.exit(2);
}

breakdown.sort((a, b) => b.ms - a.ms);
const sumGates = breakdown.reduce((n, g) => n + g.ms, 0);
console.log('  per-gate (slowest first):');
for (const g of breakdown) {
  const pct = sumGates > 0 ? Math.round((g.ms / sumGates) * 100) : 0;
  const label = g.cmd.length > 52 ? g.cmd.slice(0, 49) + '...' : g.cmd;
  console.log(`    ${fmt(g.ms).padStart(7)}  ${String(pct).padStart(3)}%  ${label}`);
}

// --- full verify, median of RUNS ---
const totals: number[] = [];
for (let i = 0; i < RUNS; i++) {
  const t0 = performance.now();
  execSync('npm run --silent verify', { cwd: repoRoot, env, stdio: 'ignore' });
  totals.push(performance.now() - t0);
}
totals.sort((a, b) => a - b);
const median = totals[Math.floor(totals.length / 2)];
if (median === undefined) {
  console.error('  X no timing samples collected (VERIFY_BUDGET_RUNS must be >= 1)');
  process.exit(2);
}

console.log(`\n  full verify runs: ${totals.map(fmt).join(' · ')}`);
console.log(`  median: ${fmt(median)}   budget: ${fmt(BUDGET_MS)}`);

if (median > BUDGET_MS) {
  const over = median - BUDGET_MS;
  console.error(
    `\n  X OVER BUDGET by ${fmt(over)}. Trim/speed the slowest gate(s) above, parallelize, or`,
  );
  console.error(`    raise the budget deliberately (VERIFY_BUDGET_MS / PRECOMMIT_BUDGET_S).`);
  process.exit(1);
}

const head = BUDGET_MS - median;
console.log(`\n  OK — ${fmt(head)} of headroom under the ${fmt(BUDGET_MS)} budget.`);

// vitest-verify — the lane-aware entry point for the `vitest` verify gate.
//
// The problem it solves: a few full-arc / full-mount integration tests are
// legitimately slow (a whole-T0 playthrough, a 24× app-mount click-sweep, the
// 103-test jsdom render suite) — together they push the `vitest` gate from ~3s to
// ~33s. They're the ADR-088 "full-arc e2e + invariants" tier: they MUST gate before
// anything leaves the machine, but they don't need to run on every local commit.
// So, exactly as ADR-072 laned the Playwright e2e suite to CI-only, we lane these
// to the PUSH + CI run and keep the per-commit `vitest` gate fast (the 5s soft /
// 8s hard verify budget).
//
// The lane is SELF-DESCRIBING — a test opts into the slow lane with a top-of-file
//   // @slow
// pragma (the same per-file-pragma pattern `// @vitest-environment jsdom` uses).
// No hand-maintained exclude list: this script derives it by scanning for the tag.
//
//   (default)         COMMIT lane — every *.test.ts EXCEPT the @slow-tagged ones.
//   VERIFY_FULL=1     FULL lane   — everything (pre-push + CI set this).
//
// Any extra argv is forwarded to vitest (e.g. `--reporter=dot`). Exit code is
// vitest's own, so it drops into the verify runner unchanged.
export {};

import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const srcDir = join(repoRoot, 'src'); // vitest `root` is 'src'; excludes resolve relative to it
const binDir = join(repoRoot, 'node_modules', '.bin');
const full = process.env['VERIFY_FULL'] === '1';

// Recursively collect every test file under src (skip node_modules-like dirs; none exist under src).
function testFiles(dir: string): string[] {
  const out: string[] = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...testFiles(p));
    else if (ent.name.endsWith('.test.ts')) out.push(p);
  }
  return out;
}

// A file is in the SLOW lane if it carries the `// @slow` pragma. Scan only the head
// (the pragma is a top-of-file marker) so this stays cheap even across the whole tree.
function isSlow(file: string): boolean {
  return /^\s*\/\/\s*@slow\b/m.test(readFileSync(file, 'utf8').slice(0, 2048));
}

const excludeArgs: string[] = [];
if (!full) {
  for (const f of testFiles(srcDir).filter(isSlow)) {
    // vitest `--exclude` globs resolve from the config root ('src'); pass the src-relative path.
    excludeArgs.push('--exclude', relative(srcDir, f));
  }
}

const passthrough = process.argv.slice(2);
const args = ['run', ...excludeArgs, ...passthrough];

if (!full && excludeArgs.length > 0) {
  const n = excludeArgs.length / 2;
  console.log(
    `  ~ vitest COMMIT lane — ${n} @slow test(s) deferred to the push/CI lane (VERIFY_FULL=1 runs all).`,
  );
}

const child = spawn('vitest', args, {
  cwd: repoRoot,
  env: { ...process.env, PATH: `${binDir}:${process.env['PATH'] ?? ''}` },
  stdio: 'inherit',
  shell: false,
});
child.on('close', (code) => process.exit(code ?? 1));
child.on('error', (e) => {
  console.error(String(e));
  process.exit(1);
});

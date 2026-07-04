// gen-prd-regions — transclude a DERIVABLE fact slice INTO the hand-written PRD
// so that class of game→PRD drift becomes impossible, not merely reported
// (F1b Phase 2; plan: docs/plans/fable-process-F1b-prd-ripple-tooling.md §2).
//
// The F1b Phase 1 reporter (prd-drift.ts) DETECTS drift; this PREVENTS it, for
// one pilot slice: the §3 T0 rung-ladder TITLES (R0→R7), read straight from the
// RANKS registry — the same typed data the running game uses. RANKS titles are
// shipped, played, and stable through every re-core, so they are the least
// contestable build==end-state fact (thresholds are provisional per D-021 and
// stay OUT — numbers are §4's ripple-frozen domain, never transcluded).
//
// Mechanism: the shared region splicer (gen-regions.ts, built once in the F1a
// lane) replaces only the bytes between a marker pair and preserves every byte
// outside — so a co-agent's concurrent edit to the surrounding §3 prose survives.
// Two modes mirror gen-docs.ts / checkpoint.ts:
//   npm run gen:prd-regions          write: regenerate the region(s) in place
//   npm run gen:prd-regions -- --check  regenerate into memory, fail on any byte
//                                        diff; writes nothing (the verify gate)
//
// Determinism (why --check is a SOUND gate, never A11 wolf-crying): the only
// input is a committed worktree file (the RANKS registry). No clock, no git, no
// network — the same RANKS yields the same bytes every run.
export {};

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RANKS } from '../core';
import { spliceRegion } from './gen-regions';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const abs = (rel: string): string => join(repoRoot, rel);

// --- generated region body ----------------------------------------------------

/** The T0 rung-ladder titles, derived from RANKS. A markdown table (id · the
 *  build-canonical title · kanji) framed HONESTLY: these are the mechanical
 *  labels the running game ships; the richer narrative titles in the §3.2 ladder
 *  reconcile to them via the R1-gated compression sweep (Flow 2 / `/prd-compress`),
 *  NOT here — Ph2 is a pilot, not the sweep. Pure fn of RANKS; exported for test. */
export function genT0RungTitles(): string {
  const rows = RANKS.map((r) => `| ${r.id} | ${r.title} | ${r.kanji} |`);
  return [
    '> **The T0 rung titles, as the build ships them** — GENERATED from `RANKS`',
    '> ([`ranks.ts`](../../../src/core/content/ranks.ts)) by `npm run',
    '> gen:prd-regions`; **do not edit between the markers**. These are the',
    '> **mechanical** rung labels the running game uses. The richer *narrative*',
    '> titles in the §3.2 ladder table below are reconciled to these by the T0',
    '> compression sweep (Flow 2, gated on R1 — `/prd-compress`), not here.',
    '> Editing a title in `RANKS` without regenerating turns the',
    '> `gen-prd-regions` gate RED.',
    '>',
    '> | Rung | Title (build) | 漢字 |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

// --- region wiring ------------------------------------------------------------

interface RegionSpec {
  file: string;
  id: string;
  gen: () => string;
}
const REGIONS: ReadonlyArray<RegionSpec> = [
  { file: 'docs/living/prd/03-unlock-ladder.md', id: 't0-rung-titles', gen: genT0RungTitles },
];

/** Apply every region targeting `file` and return before/after. */
function regenerateFile(file: string): { before: string; after: string } {
  const before = readFileSync(abs(file), 'utf-8');
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
    const stale = targetFiles.filter((f) => {
      const { before, after } = regenerateFile(f);
      return before !== after;
    });
    if (stale.length) {
      console.error('  X gen-prd-regions --check FAILED: generated PRD region(s) are stale:');
      for (const f of stale) console.error(`      ${f}`);
      console.error('    Run `npm run gen:prd-regions` to regenerate, then stage the file.');
      process.exit(1);
    }
    console.log(`  ✓ gen-prd-regions --check: ${targetFiles.length} PRD region-doc(s) fresh.`);
    process.exit(0);
  }

  const wrote: string[] = [];
  for (const file of targetFiles) {
    const { before, after } = regenerateFile(file);
    if (before !== after) {
      writeFileSync(abs(file), after, 'utf-8');
      wrote.push(file);
    }
  }
  if (wrote.length) {
    console.log('gen-prd-regions — wrote:');
    for (const f of wrote) console.log(`  ~ ${f}`);
  } else {
    console.log('gen-prd-regions: PRD region(s) already up to date (no write).');
  }
  process.exit(0);
}

// Run the CLI only when invoked directly (tsx src/scripts/gen-prd-regions.ts),
// NOT when a test imports genT0RungTitles for its pure output.
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invoked === fileURLToPath(import.meta.url)) runCli();

// gen-prd-regions — transclude a DERIVABLE fact slice INTO the hand-written PRD
// so that class of game→PRD drift becomes impossible, not merely reported
// (F1b Phase 2; plan: docs/plans/fable-process-F1b-prd-ripple-tooling.md §2).
//
// The F1b Phase 1 reporter (prd-drift.ts) DETECTS drift; this PREVENTS it, by
// transcluding the derivable T0 rosters straight from the typed registries the
// running game uses. It began as ONE pilot slice (the §3 rung-ladder TITLES from
// RANKS); ADR-128 ("ripple during T0 — no compression backlog") expanded it to the
// full set of shipped, stable T0 IDENTITY facts:
//   • §3 rung-ladder titles (RANKS)          — genT0RungTitles
//   • §2.10.1 weapon roster (WEAPONS)         — genT0WeaponRoster
//   • §2.9 bestiary, T0-reachable (MOBS)      — genT0Bestiary
// IDENTITY only — labels/kanji/archetype/where-found. The provisional TUNING
// numbers (thresholds, baseAttack, per-mob level) stay OUT: those are §4's
// ripple-frozen domain (ADR-021), never transcluded.
//
// Mechanism: the shared region splicer (gen-regions.ts, built once in the F1a
// lane) replaces only the bytes between a marker pair and preserves every byte
// outside — so a co-agent's concurrent edit to the surrounding §3 prose survives.
// Two modes mirror gen-docs.ts / checkpoint.ts:
//   pnpm run gen:prd-regions          write: regenerate the region(s) in place
//   pnpm run gen:prd-regions -- --check  regenerate into memory, fail on any byte
//                                        diff; writes nothing (the verify gate)
//
// Determinism (why --check is a SOUND gate, never AC-11 wolf-crying): the only
// input is a committed worktree file (the RANKS registry). No clock, no git, no
// network — the same RANKS yields the same bytes every run.
export {};

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RANKS, WEAPONS, MOBS, ACTIVITIES, balance } from '../core';
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
    '> ([`ranks.ts`](../../../src/core/content/ranks.ts)) by `pnpm run',
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

/** The T0 weapon roster — identity only (label · kanji · archetype · flavour),
 *  derived from WEAPONS. Every current weapon is T0, so the whole registry ships;
 *  if a tier field is added later, filter here. The per-weapon tuning numbers
 *  (`baseAttack`/`baseSpeed`/durability) stay OUT — those are §4.6.9's provisional,
 *  ripple-frozen domain (ADR-021), never transcluded. Pure fn; exported for test. */
export function genT0WeaponRoster(): string {
  const rows = WEAPONS.map((w) => `| ${w.label} | ${w.kanji} | ${w.archetype} | ${w.blurb} |`);
  return [
    '> **The T0 weapon roster, as the build ships it** — GENERATED from `WEAPONS`',
    '> ([`weapons.ts`](../../../src/core/content/weapons.ts)) by `pnpm run',
    '> gen:prd-regions`; **do not edit between the markers**. Identity only — the',
    '> per-weapon `baseAttack`/`baseSpeed`/durability tuning lives in §4.6.9 (the',
    '> ripple-frozen provisional numbers, D-021), never here. Adding or renaming a',
    '> weapon in `WEAPONS` without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Weapon | 漢字 | Archetype | Note |',
    '> |---|---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 bestiary — identity + location (label · kanji · where-found), derived
 *  from MOBS, tier-filtered to T0-reachable foes (`minTier` 0 / undefined). The
 *  road bandit (`minTier` 2 — the first HUMAN threat, canon-held for T2 per A10)
 *  is EXCLUDED: it ripples into §5 frontier, not the T0 bestiary (ADR-128). Per-mob
 *  `level` is §4.6 tuning and stays out. Pure fn of MOBS; exported for test. */
export function genT0Bestiary(): string {
  const t0 = MOBS.filter((m) => (m.minTier ?? 0) < 2);
  const rows = t0.map((m) => `| ${m.label} | ${m.kanji} | ${m.area.replace(/-/g, ' ')} |`);
  return [
    '> **The T0 bestiary, as the build ships it** — GENERATED from `MOBS`',
    '> ([`enemies.ts`](../../../src/core/content/enemies.ts)) by `pnpm run',
    '> gen:prd-regions`; **do not edit between the markers**. T0-reachable foes',
    '> only — the road bandit is canon-held for T2 (§5) and excluded here (A10);',
    '> per-mob `level` is §4.6 tuning, kept out. Adding or renaming a T0 mob in',
    '> `MOBS` without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Foe | 漢字 | Found on |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 Phase-2 Estate deed sources (ADR-145) — identity only (source · what banks it),
 *  derived from ESTATE_DEED_SOURCE_MULT's keys + the ACTIVITIES registry's `deedSource`
 *  bindings. The non-activity feeders (workshop/watch/treasury) are reducer wiring
 *  (`intents.ts` / `fight.ts`), described here in fixed prose keyed BY the registry key —
 *  adding/renaming a source without regenerating turns the gate RED. The per-source
 *  MULTIPLIERS are §4 tuning (ripple-frozen, ADR-021) and stay OUT. Pure fn; exported for test. */
export function genT0DeedSources(): string {
  const feeders: Record<string, string> = {
    fields: 'the shinden/paddy labour',
    stores: 'hauling + a rice deposit at the kura',
    workshop: 'a workshop craft (`craft_weapon`)',
    watch: 'a WON grind fight (the house is safer)',
    treasury: 'a rice sale into the house books',
  };
  const activityOf: Record<string, string[]> = {};
  for (const a of ACTIVITIES) {
    if (a.deedSource) (activityOf[a.deedSource] ??= []).push(`\`${a.id}\``);
  }
  const rows = Object.keys(balance.ESTATE_DEED_SOURCE_MULT).map((src) => {
    const acts = activityOf[src]?.join(', ');
    return `| ${src} | ${feeders[src] ?? '(unmapped — describe me)'}${acts ? ` (${acts})` : ''} |`;
  });
  return [
    '> **The T0 Phase-2 Estate deed sources, as the build ships them (ADR-145)** — GENERATED',
    '> from `ESTATE_DEED_SOURCE_MULT` + the `ACTIVITIES` `deedSource` bindings',
    '> ([`balance.ts`](../../../src/core/content/balance.ts) /',
    '> [`activities.ts`](../../../src/core/content/activities.ts)) by `pnpm run gen:prd-regions`;',
    '> **do not edit between the markers**. Identity only — the per-source multipliers are',
    '> §4 tuning (ripple-frozen, ADR-021). Estate-relevant work ONLY banks (ADR-145 Q4):',
    '> woodcut/forage carry no source. Each source fires a one-time reveal beat on first bank.',
    '>',
    '> | Source | Banks from |',
    '> |---|---|',
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
  { file: 'docs/living/prd/03-unlock-ladder.md', id: 't0-deed-sources', gen: genT0DeedSources },
  { file: 'docs/living/prd/02-systems.md', id: 't0-weapon-roster', gen: genT0WeaponRoster },
  { file: 'docs/living/prd/02-systems.md', id: 't0-bestiary', gen: genT0Bestiary },
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
      console.error('    Run `pnpm run gen:prd-regions` to regenerate, then stage the file.');
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

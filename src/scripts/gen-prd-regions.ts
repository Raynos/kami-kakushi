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
// provisional sim-owned domain (ADR-132; identity-in/tuning-out — ADR-168), never transcluded.
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
import {
  RANKS,
  WEAPONS,
  MOBS,
  ACTIVITIES,
  balance,
  DISCOVERIES,
  AREAS,
  QUESTS,
  MARKET_ITEMS,
  ESTATE_STAGES,
} from '../core';
import { GATES } from './gates';
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
 *  sim-owned domain (ADR-132), never transcluded. Pure fn; exported for test. */
export function genT0WeaponRoster(): string {
  const rows = WEAPONS.map(
    (w) => `| ${w.label} | ${w.kanji} | ${w.archetype} | ${w.blurb} |`,
  );
  return [
    '> **The T0 weapon roster, as the build ships it** — GENERATED from `WEAPONS`',
    '> ([`weapons.ts`](../../../src/core/content/weapons.ts)) by `pnpm run',
    '> gen:prd-regions`; **do not edit between the markers**. Identity only — the',
    '> per-weapon `baseAttack`/`baseSpeed`/durability tuning lives in §4.6.9 (the',
    '> provisional sim-owned numbers, ADR-132), never here. Adding or renaming a',
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
  const rows = t0.map(
    (m) => `| ${m.label} | ${m.kanji} | ${m.area.replace(/-/g, ' ')} |`,
  );
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
 *  MULTIPLIERS are §4 tuning (provisional, sim-owned — ADR-132) and stay OUT. Pure fn; exported for test. */
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
    '> §4 tuning (provisional, sim-owned — ADR-132). Estate-relevant work ONLY banks (ADR-145 Q4):',
    '> woodcut/forage carry no source. Each source fires a one-time reveal beat on first bank.',
    '>',
    '> | Source | Banks from |',
    '> |---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 hidden discoveries (ADR-146/ADR-168 G1) — identity only (id · node · what it
 *  unlocks · how found), derived from DISCOVERIES. The tuning floor/chances (minAttempts,
 *  pity ramp) and the fiction text (hints, the discovery line — ADR-139 diverge-picked
 *  canon, readable in t0-story/flavor) stay OUT. Pure fn; exported for test. */
export function genT0Discoveries(): string {
  const trig = (d: (typeof DISCOVERIES)[number]): string =>
    d.trigger.kind === 'watch'
      ? `watching (\`${d.trigger.activity}\`)`
      : 'stumbled on arrival';
  const rows = DISCOVERIES.map(
    (d) =>
      `| \`${d.id}\` | ${d.node} | ${d.reveals ? `\`${d.reveals}\`` : '*(seed-only find)*'} | ${trig(d)} |`,
  );
  return [
    '> **The T0 hidden discoveries, as the build ships them (ADR-146)** — GENERATED from',
    '> `DISCOVERIES` ([`discoveries.ts`](../../../src/core/content/discoveries.ts)) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. Identity only —',
    '> the attempt floors / pity-ramp chances are §4 tuning, and the hint/reveal fiction',
    '> is ADR-139 canon (read it in `docs/content/t0-story.md`), both kept out. Adding a',
    '> discovery without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Discovery | Node | Unlocks | Found by |',
    '> |---|---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 zone roster + reveal bindings (ADR-168 G2) — every AREAS zone with the rung
 *  whose `rewardOnReach.unlock` carries its `room-<id>` flag (no flag = on the board
 *  from the open; `locked` = scenery, never walkable). Derived from AREAS × RANKS —
 *  the pair that staled the hand table silently every story wave. Pure fn; exported. */
export function genT0ZoneReveals(): string {
  const revealedBy = new Map<string, string>();
  for (const r of RANKS) {
    for (const u of r.rewardOnReach?.unlock ?? []) {
      if (u.startsWith('room-')) revealedBy.set(u.slice('room-'.length), r.id);
    }
  }
  const rows = AREAS.map((a) => {
    const when = a.locked
      ? 'locked scenery (visible, never walkable)'
      : revealedBy.has(a.id)
        ? `inks in at **${revealedBy.get(a.id)}**`
        : 'on the board from the open';
    return `| \`${a.id}\` | ${a.label} | ${when} |`;
  });
  return [
    '> **The T0 zones and when each inks in, as the build ships them** — GENERATED from',
    '> `AREAS` × `RANKS` `room-*` unlocks ([`areas.ts`](../../../src/core/content/areas.ts) /',
    '> [`ranks.ts`](../../../src/core/content/ranks.ts)) by `pnpm run gen:prd-regions`;',
    '> **do not edit between the markers**. Identity + reveal binding only — the diegetic',
    '> reveal lines are canon (`t0-story.md`), kept out. Adding a zone or moving a reveal',
    '> without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Zone | Label | Revealed |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 per-rung reveal ladder (ADR-168 G3) — each rung's full `rewardOnReach.unlock`
 *  list, verbatim ids, derived from RANKS. Replaces §1.12's hand-typed reveal schedule
 *  (the audit found its R3/R4 rows wrong). Pure fn; exported for test. */
export function genT0RungReveals(): string {
  const rows = RANKS.map((r) => {
    const u = r.rewardOnReach?.unlock ?? [];
    return `| ${r.id} — ${r.title} | ${u.length ? u.map((x) => `\`${x}\``).join(' · ') : '—'} |`;
  });
  return [
    '> **The T0 reveal ladder, as the build ships it** — GENERATED from `RANKS`',
    '> `rewardOnReach.unlock` ([`ranks.ts`](../../../src/core/content/ranks.ts)) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. The verbatim',
    '> unlock ids per rung — tabs/panels/verbs/rooms/readouts as the running game opens',
    '> them. Moving a reveal in `RANKS` without regenerating turns the',
    '> `gen-prd-regions` gate RED.',
    '>',
    '> | Rung | Opens |',
    '> |---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 quest roster (ADR-168 G4) — identity only (id · kind · title), derived from
 *  QUESTS. Step events and rewards are content/tuning, kept out. Pure fn; exported. */
export function genT0QuestRoster(): string {
  const rows = QUESTS.map((q) => `| \`${q.id}\` | ${q.kind} | ${q.title} |`);
  return [
    '> **The T0 quest roster, as the build ships it** — GENERATED from `QUESTS`',
    '> ([`quests.ts`](../../../src/core/content/quests.ts)) by `pnpm run gen:prd-regions`;',
    '> **do not edit between the markers**. Identity only — step chains and rewards are',
    '> content detail (read the script in `docs/content/t0-story.md`). Adding a quest',
    '> without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Quest | Kind | Title |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 activity roster (ADR-168 G5) — identity + bindings (id · label · node · skill ·
 *  deed source), derived from ACTIVITIES. Yields/satiety/xp are §4 tuning, out. */
export function genT0Activities(): string {
  const rows = ACTIVITIES.map(
    (a) =>
      `| \`${a.id}\` | ${a.label} | ${a.area} | ${a.skill} | ${a.deedSource ?? '—'} |`,
  );
  return [
    '> **The T0 activity roster, as the build ships it** — GENERATED from `ACTIVITIES`',
    '> ([`activities.ts`](../../../src/core/content/activities.ts)) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. Identity +',
    '> bindings only — yields, satiety costs and xp are §4 tuning, kept out. A `—` deed',
    '> source = not estate-relevant (feeds the pockets, not the house — ADR-145 Q4).',
    '> Adding an activity without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Activity | Label | Node | Skill | Deed source |',
    '> |---|---|---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 market stock (ADR-168 G6) — identity only (label · goods granted · season
 *  window), derived from MARKET_ITEMS. Prices/stock caps are §4 tuning, out. */
export function genT0MarketStock(): string {
  const rows = MARKET_ITEMS.map((m) => {
    const goods = Object.keys(m.grants).join(', ');
    const when = m.seasons ? m.seasons.join(' · ') : 'every season';
    return `| ${m.label} | ${goods} | ${when} |`;
  });
  return [
    '> **The T0 provisioning-stall stock, as the build ships it** — GENERATED from',
    '> `MARKET_ITEMS` ([`market.ts`](../../../src/core/content/market.ts)) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. Identity only —',
    '> mon prices, stock caps and the pedlar purse are §4 tuning, kept out. The stall',
    "> re-keys per season (ADR-163): a season column names each item's window. Adding an",
    '> item without regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Item | Grants | Stocked |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The T0 estate works ladder (ADR-168 G7) — identity only (stage · label · blurb),
 *  derived from ESTATE_STAGES. Coin costs and bonuses are sim-owned seeds, out. */
export function genT0EstateWorks(): string {
  const rows = ESTATE_STAGES.map(
    (s) => `| U${s.stage} | ${s.label} | ${s.blurb} |`,
  );
  return [
    '> **The T0 estate works (kura-works flywheel), as the build ships them** — GENERATED',
    '> from `ESTATE_STAGES` ([`estate.ts`](../../../src/core/content/estate.ts)) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. Identity only —',
    '> coin costs, satiety and yield bonuses are sim-owned seed tuning (ADR-132), kept',
    '> out. The pending deed-reframe (ADR-145) will rename stages HERE, not by hand.',
    '>',
    '> | Stage | Work | What it is |',
    '> |---|---|---|',
    ...rows.map((r) => `> ${r}`),
  ].join('\n');
}

/** The verify gate roster (ADR-168 G8) — name · command · lane, derived from GATES
 *  (gates.ts, the roster's single source). Replaces §6's fossilized command chain. */
export function genVerifyGates(): string {
  const rows = GATES.map((g) => `| ${g.name} | \`${g.cmd}\` | ${g.scope} |`);
  return [
    '> **The `pnpm run verify` gate roster, as it ships** — GENERATED from `GATES`',
    '> ([`gates.ts`](../../../src/scripts/gates.ts), the single source of the roster) by',
    '> `pnpm run gen:prd-regions`; **do not edit between the markers**. Gates run in',
    '> parallel; `scope` is the commit-time lane (`SKIP_CODE_VERIFY`/`SKIP_DOCS_VERIFY`',
    '> skip a lane at commit; a push always runs everything). Adding a gate without',
    '> regenerating turns the `gen-prd-regions` gate RED.',
    '>',
    '> | Gate | Command | Lane |',
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
  {
    file: 'docs/living/prd/01-vision.md',
    id: 't0-rung-reveals',
    gen: genT0RungReveals,
  },
  {
    file: 'docs/living/prd/03-unlock-ladder.md',
    id: 't0-rung-titles',
    gen: genT0RungTitles,
  },
  {
    file: 'docs/living/prd/03-unlock-ladder.md',
    id: 't0-deed-sources',
    gen: genT0DeedSources,
  },
  {
    file: 'docs/living/prd/03-unlock-ladder.md',
    id: 't0-zone-reveals',
    gen: genT0ZoneReveals,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-weapon-roster',
    gen: genT0WeaponRoster,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-bestiary',
    gen: genT0Bestiary,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-discoveries',
    gen: genT0Discoveries,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-quest-roster',
    gen: genT0QuestRoster,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-activities',
    gen: genT0Activities,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-market-stock',
    gen: genT0MarketStock,
  },
  {
    file: 'docs/living/prd/02-systems.md',
    id: 't0-estate-works',
    gen: genT0EstateWorks,
  },
  {
    file: 'docs/living/prd/06-tech-architecture.md',
    id: 'verify-gates',
    gen: genVerifyGates,
  },
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
      console.error(
        '  X gen-prd-regions --check FAILED: generated PRD region(s) are stale:',
      );
      for (const f of stale) console.error(`      ${f}`);
      console.error(
        '    Run `pnpm run gen:prd-regions` to regenerate, then stage the file.',
      );
      process.exit(1);
    }
    console.log(
      `  ✓ gen-prd-regions --check: ${targetFiles.length} PRD region-doc(s) fresh.`,
    );
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
    console.log(
      'gen-prd-regions: PRD region(s) already up to date (no write).',
    );
  }
  process.exit(0);
}

// Run the CLI only when invoked directly (tsx src/scripts/gen-prd-regions.ts),
// NOT when a test imports genT0RungTitles for its pure output.
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invoked === fileURLToPath(import.meta.url)) runCli();

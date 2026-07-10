// prd-drift — the game→PRD fact-drift REPORT (ADR-117 Phase 0; plan:
// docs/plans/fable-process-F1b-prd-ripple-tooling.md §1).
//
// One-directional by design (game → PRD) so the frontier can never false-fire:
// an unbuilt T3 beat is SUPPOSED to be absent from the build, but a BUILT
// entity absent from the whole PRD is spec-invisible — that's the ripple
// punch-list. Two checks:
//   1. PRESENCE — every display name in the SPEC-ALTITUDE registries must be
//      mentioned somewhere in docs/living/prd/*.md. INFORMATIONAL registries
//      (beneath spec altitude — the PRD doesn't name every mushroom) are
//      listed for coverage but never counted as drift.
//   2. RETIRED TERMS — terms an ADR retired (renames, re-cores) appearing in
//      the PRD are drift by definition. Scans docs/living/prd/ PLUS the three
//      shipped-reality living docs (fun-factor · ui-design · qa-playtesting —
//      WIDENED by the human's 2026-07-09 closure ruling; the A5-class misses
//      lived exactly there). The ADR log (decisions.md) stays OUT of scope —
//      append-only history legitimately quotes old names. Config lives here:
//      an entry is added in the same commit as the rename ADR, deleted once a
//      compression sweep clears it.
//
// This is a REPORT, never a verify gate (prose matching is heuristic — a hard
// gate would cry wolf, AC-11). `--strict` exits 1 on drift for scripted use.
//
// CLI:  tsx src/scripts/prd-drift.ts  [--strict]

import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import {
  NAMES,
  SKILLS,
  RANKS,
  MOBS,
  WEAPONS,
  MAP_NODES,
  MARKET_ITEMS,
  STANCE_ORDER,
  RECIPES,
  MATERIALS,
  BELONGINGS,
  QUESTS,
  ACTIVITIES,
  ESTATE_STAGES,
} from '../core';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const PRD_DIR = join(repoRoot, 'docs/living/prd');
const STRICT = process.argv.includes('--strict');

/** Whole-word containment: `needle` in `haystack` with no letter/digit flush
 *  against either end. Plain `includes()` let a short name hide inside a longer
 *  one — "Toku" (the Dowager) stayed "mentioned" via Toku*bei* / Toku*jirō* /
 *  Toku*emon* even with every real mention deleted (a false-CLEAN, found by the
 *  2026-07-05 audit). Unicode-aware (`\p{L}` — Tōzō, Sōan). */
export function hasWholeWord(haystack: string, needle: string): boolean {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, 'u').test(haystack);
}

// A display name counts as mentioned if the full label OR its core (the label
// minus any trailing parenthetical, e.g. "Mamushi (pit viper)" → "Mamushi")
// appears case-insensitively, as a whole word, anywhere in the PRD.
/** Strip gen-region bodies (between `<!-- gen:begin` / `<!-- gen:end` marker
 *  lines). Generated regions are BUILD TRUTH by construction (the gen-prd-regions
 *  gate byte-compares them), so the RETIRED-terms scan must not fire on them —
 *  a shipped registry id that carries a retired word (e.g. `forage_satoyama`)
 *  is a code-rename concern, not PRD drift. The PRESENCE scan keeps regions
 *  (they are exactly where many names are mentioned). Exported for test. */
export function stripGenRegions(text: string): string {
  const out: string[] = [];
  let inRegion = false;
  for (const line of text.split('\n')) {
    if (line.includes('<!-- gen:begin ')) inRegion = true;
    if (!inRegion) out.push(line);
    if (line.includes('<!-- gen:end ')) inRegion = false;
  }
  return out.join('\n');
}

export function matchesLabel(corpus: string, label: string): boolean {
  const forms = [label, label.replace(/\s*\([^)]*\)\s*$/, '')].map((s) => s.trim().toLowerCase());
  return forms.some((f) => f.length > 0 && hasWholeWord(corpus, f));
}

interface RegistryCheck {
  readonly registry: string;
  readonly labels: readonly string[];
}

// SPEC-ALTITUDE: a built entity here should be named somewhere in the spec.
const SPEC: readonly RegistryCheck[] = [
  { registry: 'RANKS (rung titles)', labels: RANKS.map((r) => r.title) },
  { registry: 'WEAPONS', labels: WEAPONS.map((w) => w.label) },
  { registry: 'MOBS', labels: MOBS.map((m) => m.label) },
  { registry: 'MAP_NODES', labels: MAP_NODES.map((n) => n.label) },
  { registry: 'SKILLS', labels: SKILLS.map((s) => s.label) },
  { registry: 'STANCES', labels: [...STANCE_ORDER] },
  { registry: 'NAMES (cast)', labels: Object.values(NAMES) },
  // A whole built quest is above spec altitude (2026-07-05 audit: 3 of 4 T0
  // quest TITLES were spec-invisible and unscanned). Titles only — step
  // labels are prose-phrased and would cry wolf (AC-11).
  { registry: 'QUESTS (titles)', labels: QUESTS.map((q) => q.title) },
];

// INFORMATIONAL: listed for coverage, never counted as drift. ACTIVITIES and
// ESTATE_STAGES carry verb-phrase labels ("Patch the kura") the PRD states as
// prose, not as labels — label-presence over them would cry wolf (AC-11), so
// they report coverage only.
const INFO: readonly RegistryCheck[] = [
  { registry: 'MATERIALS', labels: MATERIALS.map((m) => m.label) },
  { registry: 'MARKET_ITEMS', labels: MARKET_ITEMS.map((i) => i.label) },
  { registry: 'BELONGINGS', labels: BELONGINGS.map((b) => b.label) },
  { registry: 'RECIPES', labels: RECIPES.map((r) => r.label) },
  { registry: 'ACTIVITIES', labels: ACTIVITIES.map((a) => a.label) },
  { registry: 'ESTATE_STAGES', labels: ESTATE_STAGES.map((e) => e.label) },
];

// RETIRED TERMS — term + the ADR that retired it (PRD-only scan). A hit line
// that ALSO names the successor is a documented rename (e.g. the §2 real-name
// denylist "Munenori … → Shigemasa"), not drift — calibrated after the
// tripwire's very first run false-fired on exactly that line (AC-11).
const RETIRED: readonly { term: string; adr: string; successor?: string }[] = [
  { term: 'munenori', adr: 'Q39/Block N (Yagyū-echo rename)', successor: 'munemasa' },
  { term: 'shigemasa', adr: 'G4 storywave cutover (lord rename)', successor: 'munemasa' },
  { term: 'jūbei', adr: 'Q12/Q39 (Yagyū-echo rename)', successor: 'kihei' },
  { term: 'ranpo', adr: 'Q39/Block N.1 (Edogawa-echo rename)', successor: 'sōan' },
  { term: 'spend koku', adr: 'D-107/D-109 (koku is House standing, not spendable)' },
  { term: 'koku cost', adr: 'D-107/D-109 (coin/rice pay costs, never koku)' },
  // D7 (the closure plan C3) — the A5-class misses the post-ship review found:
  // "shipped but described as the pre-storywave build" was invisible to the
  // presence check, so the pre-storywave vocabulary itself is retired.
  { term: 'satoyama', adr: 'G4 storywave map cutover (the 16-zone estate — areas.ts)' },
  { term: '28-day', adr: 'ADR-153 (the stored manual six-season wheel)' },
  // successor 'tomita': the canon ladder's campaign REPLACES the rival-house
  // climax, so a line naming both documents the cut (e.g. §1's cast table).
  {
    term: 'akagi',
    adr: 'story reboot (rival house CUT — the canon antagonist ladder)',
    successor: 'tomita',
  },
  { term: 'oyuki', adr: 'bible cast sweep (origin mother)', successor: 'o-nobu' },
  { term: 'okimi', adr: 'bible cast sweep (origin sister)', successor: 'suzu' },
  { term: 'o-sato', adr: 'bible cast sweep (B1 closure)', successor: 'o-hisa' },
  { term: 'tokubei', adr: 'bible cast sweep (the dowager thread)', successor: 'yohei' },
  // ADR-168 truth-sync (s136): the pre-reboot corpse-vocabulary the audit swept
  // out of the PRD wholesale — teeth so it cannot creep back. Names first
  // (people who exist nowhere in the bible/names.ts), then the retired rung
  // fictions and the retired node.
  { term: 'gonta', adr: 'ADR-168 truth-sync (pre-reboot smith)', successor: 'tetsuji' },
  { term: 'obaa kuni', adr: 'ADR-168 truth-sync (pre-reboot herbalist — no canon successor)' },
  { term: 'tokuemon', adr: 'ADR-168 truth-sync (pre-reboot brewer — no canon successor)' },
  { term: 'onatsu', adr: 'ADR-168 truth-sync (pre-reboot weaver — no canon successor)' },
  { term: 'sukezō', adr: 'ADR-168 truth-sync (pre-reboot innkeeper — no canon successor)' },
  { term: 'yagōemon', adr: 'ADR-168 truth-sync (pre-reboot headman)', successor: 'mohei' },
  { term: 'ryōa', adr: 'ADR-168 truth-sync (pre-reboot priest)', successor: 'ekai' },
  { term: 'magobei', adr: 'ADR-168 truth-sync (pre-reboot antagonist — no canon successor)' },
  { term: 'yatarō', adr: 'ADR-168 truth-sync (pre-reboot retinue — no canon successor)' },
  { term: 'heita', adr: 'ADR-168 truth-sync (pre-reboot field-lad — no canon successor)' },
  { term: 'mosuke', adr: 'ADR-168 truth-sync (pre-reboot clerk — no canon successor)' },
  { term: 'hiyatoi', adr: 'ADR-168 truth-sync (pre-reboot R1 fiction — the bible ladder)' },
  { term: 'monban', adr: 'ADR-168 truth-sync (pre-reboot R5 "gate-guard" fiction)' },
  { term: 'kogashira', adr: 'ADR-168 truth-sync (pre-reboot R6 "foreman" fiction)' },
  { term: 'jikata-yaku', adr: 'ADR-168 truth-sync (pre-reboot R7 "bailiff" fiction)' },
  {
    term: 'deeper woods',
    adr: 'ADR-168 truth-sync (node retired into the woodlot)',
    successor: 'woodlot',
  },
];

// The RETIRED scan's WIDENED file set beyond docs/living/prd/ (human ruling,
// 2026-07-09): the living docs that state shipped reality. Presence (check 1)
// stays PRD-only — "named in the SPEC" is a PRD property, not a guides one.
const EXTRA_RETIRED_SCAN: readonly string[] = [
  'docs/living/fun-factor.md',
  'docs/living/ui-design.md',
  'docs/guides/qa-playtesting.md',
];

// ── run ──────────────────────────────────────────────────────────────────────
function run(): void {
  // the corpus: all 7 PRD section files, lowercased
  const prdFiles = readdirSync(PRD_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
  const corpusByFile = new Map<string, string>(
    prdFiles.map((f) => [f, readFileSync(join(PRD_DIR, f), 'utf8').toLowerCase()]),
  );
  const corpus = [...corpusByFile.values()].join('\n');
  // the RETIRED scan reads the PRD corpus PLUS the widened living docs
  const retiredScanByFile = new Map(
    [...corpusByFile].map(([f, text]) => [f, stripGenRegions(text)] as const),
  );
  for (const rel of EXTRA_RETIRED_SCAN) {
    retiredScanByFile.set(
      rel,
      stripGenRegions(readFileSync(join(repoRoot, rel), 'utf8').toLowerCase()),
    );
  }

  let driftCount = 0;
  const lines: string[] = [];
  lines.push(`prd-drift — game→PRD fact drift (${prdFiles.length} PRD section files scanned)`);
  lines.push('');

  lines.push('── SPEC-ALTITUDE presence (missing = drift) ──');
  for (const { registry, labels } of SPEC) {
    const missing = labels.filter((l) => !matchesLabel(corpus, l));
    const ok = labels.length - missing.length;
    lines.push(`  ${registry}: ${ok}/${labels.length} mentioned`);
    for (const m of missing) {
      driftCount++;
      lines.push(`    ✗ MISSING from PRD: "${m}"`);
    }
  }

  lines.push('');
  lines.push('── RETIRED TERMS (any hit = drift; rename-documenting lines allowed) ──');
  for (const { term, adr, successor } of RETIRED) {
    let bad = 0;
    let allowed = 0;
    for (const [file, text] of retiredScanByFile) {
      for (const line of text.split('\n')) {
        // WHOLE-WORD (C3): plain includes() false-fired 'oyuki' inside every
        // "Naoyuki" — the same Toku/Tokubei lesson the presence check learned.
        if (!hasWholeWord(line, term)) continue;
        if (successor && hasWholeWord(line, successor)) {
          allowed++;
          continue; // documents the rename (old → new on one line) — not drift
        }
        bad++;
        driftCount++;
        lines.push(`  ✗ RETIRED "${term}" in ${file} — ${adr}`);
      }
    }
    if (bad === 0)
      lines.push(
        `  ✓ "${term}" — clean${allowed > 0 ? ` (${allowed} documented-rename line(s) allowed)` : ''}`,
      );
  }

  lines.push('');
  lines.push('── INFORMATIONAL coverage (report-only, never drift) ──');
  for (const { registry, labels } of INFO) {
    const ok = labels.filter((l) => matchesLabel(corpus, l)).length;
    lines.push(`  ${registry}: ${ok}/${labels.length} mentioned`);
  }

  lines.push('');
  lines.push(
    driftCount === 0
      ? 'prd-drift: CLEAN — no game→PRD fact drift detected. [OK]'
      : `prd-drift: ${driftCount} drift item(s) — the ripple punch-list above. ` +
          '(Report-only; ripple per Flow 1 — docs/plans/fable-process-F1b-prd-ripple-tooling.md.)',
  );
  console.log(lines.join('\n'));
  if (STRICT && driftCount > 0) process.exit(1);
}

// Run the CLI only when invoked directly (tsx src/scripts/prd-drift.ts), NOT
// when a test imports hasWholeWord/matchesLabel for their pure behaviour.
const invoked = process.argv[1] ? realpathSync(process.argv[1]) : '';
if (invoked === fileURLToPath(import.meta.url)) run();

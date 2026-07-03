// prd-drift — the game→PRD fact-drift REPORT (D-117 Phase 0; plan:
// docs/plans/fable-process-F1-prd-ripple-tooling.md §1).
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
//      the PRD are drift by definition. Scans docs/living/prd/ ONLY (the ADR
//      log legitimately quotes old names). Config lives here: an entry is
//      added in the same commit as the rename ADR, deleted once a compression
//      sweep clears it.
//
// This is a REPORT, never a verify gate (prose matching is heuristic — a hard
// gate would cry wolf, A11). `--strict` exits 1 on drift for scripted use.
//
// CLI:  tsx src/scripts/prd-drift.ts  [--strict]
export {};

import { readFileSync, readdirSync } from 'node:fs';
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
} from '../core';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const PRD_DIR = join(repoRoot, 'docs/living/prd');
const STRICT = process.argv.includes('--strict');

// ── the corpus: all 7 PRD section files, lowercased ─────────────────────────
const prdFiles = readdirSync(PRD_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
const corpusByFile = new Map<string, string>(
  prdFiles.map((f) => [f, readFileSync(join(PRD_DIR, f), 'utf8').toLowerCase()]),
);
const corpus = [...corpusByFile.values()].join('\n');

// A display name counts as mentioned if the full label OR its core (the label
// minus any trailing parenthetical, e.g. "Mamushi (pit viper)" → "Mamushi")
// appears case-insensitively anywhere in the PRD.
function mentioned(label: string): boolean {
  const forms = [label, label.replace(/\s*\([^)]*\)\s*$/, '')].map((s) => s.trim().toLowerCase());
  return forms.some((f) => f.length > 0 && corpus.includes(f));
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
];

// INFORMATIONAL: listed for coverage, never counted as drift.
const INFO: readonly RegistryCheck[] = [
  { registry: 'MATERIALS', labels: MATERIALS.map((m) => m.label) },
  { registry: 'MARKET_ITEMS', labels: MARKET_ITEMS.map((i) => i.label) },
  { registry: 'BELONGINGS', labels: BELONGINGS.map((b) => b.label) },
  { registry: 'RECIPES', labels: RECIPES.map((r) => r.label) },
];

// RETIRED TERMS — term + the ADR that retired it (PRD-only scan). A hit line
// that ALSO names the successor is a documented rename (e.g. the §2 real-name
// denylist "Munenori … → Shigemasa"), not drift — calibrated after the
// tripwire's very first run false-fired on exactly that line (A11).
const RETIRED: readonly { term: string; adr: string; successor?: string }[] = [
  { term: 'munenori', adr: 'Q39/Block N (Yagyū-echo rename)', successor: 'shigemasa' },
  { term: 'jūbei', adr: 'Q12/Q39 (Yagyū-echo rename)', successor: 'kihei' },
  { term: 'ranpo', adr: 'Q39/Block N.1 (Edogawa-echo rename)', successor: 'sōan' },
  { term: 'spend koku', adr: 'D-107/D-109 (koku is House standing, not spendable)' },
  { term: 'koku cost', adr: 'D-107/D-109 (coin/rice pay costs, never koku)' },
];

// ── run ──────────────────────────────────────────────────────────────────────
let driftCount = 0;
const lines: string[] = [];
lines.push(`prd-drift — game→PRD fact drift (${prdFiles.length} PRD section files scanned)`);
lines.push('');

lines.push('── SPEC-ALTITUDE presence (missing = drift) ──');
for (const { registry, labels } of SPEC) {
  const missing = labels.filter((l) => !mentioned(l));
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
  for (const [file, text] of corpusByFile) {
    for (const line of text.split('\n')) {
      if (!line.includes(term)) continue;
      if (successor && line.includes(successor)) {
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
  const ok = labels.filter((l) => mentioned(l)).length;
  lines.push(`  ${registry}: ${ok}/${labels.length} mentioned`);
}

lines.push('');
lines.push(
  driftCount === 0
    ? 'prd-drift: CLEAN — no game→PRD fact drift detected. [OK]'
    : `prd-drift: ${driftCount} drift item(s) — the ripple punch-list above. ` +
        '(Report-only; ripple per Flow 1 — docs/plans/fable-process-F1-prd-ripple-tooling.md.)',
);
console.log(lines.join('\n'));
if (STRICT && driftCount > 0) process.exit(1);

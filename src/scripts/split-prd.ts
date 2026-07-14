// split-prd — the mechanical 7-way ASCII split of the monolithic PRD (op-model v2 FINAL, Workstream E).
//
// Reads docs/living/prd.md, splits its `# §1 … # §7` top-level sections into ASCII-named per-section
// files under docs/living/prd/, and rewrites prd.md into a stub INDEX (the original preamble + links to
// the 7 files). ZERO content change — it ASSERTS a byte-exact round-trip (preamble + concat(sections)
// === original) before writing anything; if that fails, it writes nothing and exits non-zero.
//
// This kills the "7.6k-line monolith → truncation" failure class. Filenames are ASCII (no `§`), per the
// human's 2026-06-29 steer.
//
// CLI:
//   tsx src/scripts/split-prd.ts            # DRY-RUN against docs/living/prd.md (prints the plan, writes nothing)
//   tsx src/scripts/split-prd.ts --apply    # do it (round-trip asserted first)
//   --src <file> --out <dir> --index <file> # override paths (used to test against a tmp/ copy)
export {};

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : fallback;
}
const SRC = arg('--src', join(repoRoot, 'docs/living/prd.md'));
const OUT = arg('--out', join(repoRoot, 'docs/living/prd'));
const INDEX = arg('--index', SRC); // the stub index overwrites prd.md by default
const APPLY = process.argv.includes('--apply');

// The locked §N → ASCII-slug map (human steer 2026-06-29). The title is derived from the header text.
const SLUGS: Record<number, string> = {
  1: '01-vision',
  2: '02-systems',
  3: '03-unlock-ladder',
  4: '04-combat-balance',
  5: '05-narrative',
  6: '06-tech-architecture',
  7: '07-roadmap-scope',
};

interface Section {
  num: number;
  slug: string;
  header: string; // the full `# §N — Title` line
  title: string; // the part after the em-dash, for link text
  body: string; // header line + everything to the next section (verbatim, incl. trailing newlines)
}

const original = readFileSync(SRC, 'utf8');
const lines = original.split('\n');

// Find the top-level section header lines: `# §N — …` (one hash; NOT `## §N.x`).
const headerIdx: Array<{ line: number; num: number }> = [];
lines.forEach((l, i) => {
  const m = /^# §(\d+)\b/.exec(l);
  if (m) headerIdx.push({ line: i, num: Number(m[1]) });
});

if (headerIdx.length === 0) {
  console.error(`  X no \`# §N\` section headers found in ${SRC}`);
  process.exit(1);
}

// Byte-exact slicing by character offset (so round-trip is exact, newlines included).
const lineStartOffset: number[] = [];
{
  let off = 0;
  for (const l of lines) {
    lineStartOffset.push(off);
    off += l.length + 1; // +1 for the '\n' we split on
  }
}
const firstHeaderOffset = lineStartOffset[headerIdx[0]!.line]!;
const preamble = original.slice(0, firstHeaderOffset);

const sections: Section[] = headerIdx.map((h, i) => {
  const start = lineStartOffset[h.line]!;
  const end =
    i + 1 < headerIdx.length
      ? lineStartOffset[headerIdx[i + 1]!.line]!
      : original.length;
  const body = original.slice(start, end);
  const slug = SLUGS[h.num];
  if (!slug) {
    console.error(
      `  X no ASCII slug mapped for §${h.num} — update SLUGS in split-prd.ts`,
    );
    process.exit(1);
  }
  const headerLine = lines[h.line]!;
  const title = headerLine.replace(/^# §\d+\s*[—-]\s*/, '').trim();
  return { num: h.num, slug, header: headerLine, title, body };
});

// --- The round-trip safety assert: NO content may be lost. ---
const roundTrip = preamble + sections.map((s) => s.body).join('');
if (roundTrip !== original) {
  console.error(
    '  X ROUND-TRIP FAILED — preamble + sections != original. Writing nothing.',
  );
  console.error(
    `     original ${original.length} chars, reconstructed ${roundTrip.length} chars`,
  );
  process.exit(1);
}

// --- The stub index = the original preamble + a Sections list linking the per-section files. ---
const rel = OUT.split('/').pop() ?? 'prd';
const indexBody =
  preamble.replace(/\s*$/, '\n') +
  '\n## Sections\n\n' +
  'The PRD is split per-section (ASCII filenames — no `§` in paths) to kill the monolith-truncation\n' +
  'failure class. Each file is one top-level section, verbatim.\n\n' +
  sections
    .map((s) => `- [§${s.num} — ${s.title}](${rel}/${s.slug}.md)`)
    .join('\n') +
  '\n';

const dirReadme =
  '# PRD sections\n\n' +
  'Per-section split of the PRD (see [`../prd.md`](../prd.md) for the index + preamble). ASCII filenames;\n' +
  'each file is one `# §N` section verbatim. Maintained as living docs — edit the relevant section in place.\n';

console.log(`split-prd — ${sections.length} sections from ${SRC}`);
for (const s of sections) {
  console.log(
    `  §${s.num}  ${rel}/${s.slug}.md   (${s.body.length} chars)  ${s.title}`,
  );
}
console.log(`  round-trip: OK (${original.length} chars preserved exactly)`);

if (!APPLY) {
  console.log(
    '\n  DRY-RUN — nothing written. Re-run with --apply to write the split.',
  );
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
for (const s of sections) writeFileSync(join(OUT, `${s.slug}.md`), s.body);
writeFileSync(join(OUT, 'README.md'), dirReadme);
mkdirSync(dirname(INDEX), { recursive: true });
writeFileSync(INDEX, indexBody);
console.log(`\n  WROTE ${sections.length} section files + README to ${OUT}`);
console.log(`  WROTE stub index ${INDEX}${existsSync(INDEX) ? '' : ' (?)'}`);

// ONE-TIME codemod (2026-07-13) — give every greeting / topic-answer line a `<!--#slug-->` id.
//
// The save log addresses those lines by name; before this they were addressed by INDEX, so
// re-ordering a scene's lines in the .md re-pointed an old save's log entry at its NEIGHBOUR
// (ADR-186's "known limit"). Ids travel with the line, so a reorder is a no-op and a REWORD still
// reaches every existing save. 314 lines is too many to slug by hand, so the slug is DERIVED from
// each line's own opening words — once, here — and thereafter it is AUTHORED: an author renaming a
// line renames its id, and the parse/validate gates hold it.
//
// Idempotent: a line that already carries a marker is left exactly as it is. Run once, read the
// diff, commit. Kept in the tree (not deleted) because the next tier's story files will want it.
//
//   pnpm exec tsx src/scripts/narrative-add-line-ids.ts [--check]

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { parseNarrative, type ProseLine } from './narrative/parse';

const CHECK = process.argv.includes('--check');
const ROOT = 'src/core/content/narrative';

/** The slug for a line, from its own opening words — the id an author would have picked.
 *  Kept VERBATIM (no stop-word stripping): an author reads these, and `#do-you-know-the-year`
 *  names the line at a glance where `#do-know-year` makes them go and look it up. */
function slugFor(line: ProseLine): string {
  const ref = /^@[a-z-]+\.(\S+)$/.exec(line.text.trim()); // `@cold-open.weir` → 'weir'
  const source = ref ? ref[1]! : line.text;
  const words = source
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // Sōan → Soan
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ') // drop quotes/punctuation
    .split(/\s+/)
    .filter(Boolean);
  const slug = words.slice(0, 6).join('-').slice(0, 44).replace(/-+$/, '');
  return slug || 'line';
}

let touched = 0;
let added = 0;
const stale: string[] = [];

// Exactly what the compiler reads: the canon files + the DEV take bundles. `t0v2/` is parked story
// drafts — gen-narrative never loads it, so its lines are addressed by nothing and need no ids.
for (const file of globSync(`${ROOT}/**/*.md`).sort()) {
  if (/(^|\/)(README|bundle)\.md$/.test(file)) continue; // docs + bundle meta, not scene content
  if (file.includes('/t0v2/')) continue; // not compiled (see gen-narrative.ts)
  const source = readFileSync(file, 'utf-8');
  if (!/^## (rung|scene|scene-def) /m.test(source)) continue; // no scenes → no addressed lines

  const doc = parseNarrative(source, file);
  const lines = source.split('\n');
  const inserts: { at: number; id: string }[] = [];
  const used = new Set<string>();

  for (const scene of doc.blocks) {
    if (
      scene.kind !== 'rung' &&
      scene.kind !== 'scene' &&
      scene.kind !== 'scene-def'
    )
      continue;
    const addressed: ProseLine[] = [
      ...scene.greeting,
      ...scene.topics.flatMap((t) => t.answer),
    ];
    for (const line of addressed) {
      if (line.id !== undefined) {
        used.add(line.id);
        continue;
      }
      let id = slugFor(line);
      for (let n = 2; used.has(id); n++) id = `${slugFor(line)}-${n}`; // collisions within a file
      used.add(id);
      inserts.push({ at: line.loc.line, id });
    }
  }

  if (inserts.length === 0) continue;
  touched++;
  added += inserts.length;
  if (CHECK) {
    stale.push(`${file} — ${inserts.length} line(s) without an id`);
    continue;
  }

  // Descending, so an earlier insert never shifts a later one's line number.
  for (const { at, id } of inserts.sort((a, b) => b.at - a.at)) {
    lines.splice(at - 1, 0, `<!--#${id}-->`);
  }
  writeFileSync(file, lines.join('\n'));
  console.log(`  ${file} — ${inserts.length} id(s)`);
}

if (CHECK && stale.length > 0) {
  console.error('narrative line-ids MISSING:\n  ' + stale.join('\n  '));
  process.exit(1);
}
console.log(
  CHECK
    ? 'every greeting / answer line carries an id.'
    : `line-ids: ${added} added across ${touched} file(s).`,
);

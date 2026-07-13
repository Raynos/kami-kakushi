// review-link gate — the DEV review queue and the human's review queue must name each other.
//
// The failure this exists to stop is quiet, and it has already happened: the ADR-184 zone-announce
// toggle shipped into the DEV panel's SETTINGS tab, and HR-32b told the human to look for it there.
// When the toggle moved, the doc still said "Settings". Nobody was lying — the two halves of the
// link were just written by hand, twice, and only one got updated. A hand-copied cross-reference
// rots; a computed one cannot.
//
// So the registry is the source of truth for the TAG (V6 / SV10 — both derived from registry
// POSITION, by the same helpers the panel renders with), and review.md is the source of truth for
// the QUEUE (which HR-items are open). This gate binds them, both ways:
//
//   forward   every registry entry names an HR-item, and that item is OPEN in review.md
//             (a toggle the human is meant to judge, with no line in the queue she reads, is a
//              toggle that does not exist — "if it isn't in the queue, it doesn't exist")
//   tags      that item names the entry's CURRENT tag — so a registry REORDER, which renumbers
//             every tag after it, goes RED here instead of silently sending her to the wrong row
//   reverse   an item may not name a **V<n>** / **SV<n>** that belongs to a DIFFERENT item —
//             the stale-tag case the forward check alone would miss
//
// A story bundle may declare `hr: none · <why>` — a SETTLED diverge the human asked to keep live
// for comparison (hd30-nengu, fb324-rake-cap). It is exempt from all three checks by construction:
// it awaits nobody. A SURFACE has no such escape — ADR-075's zero-flag-debt rule says a settled
// surface keeps no toggle at all, so a surface in the registry is by definition still open.

import { readFileSync } from 'node:fs';
import { SURFACES, surfaceTag } from '../ui/dev-surfaces';
import { STORY_TAKE_BUNDLES, bundleTag } from '../ui/storyTakes';

const REVIEW_MD = 'project/human-in-the-loop/review.md';

interface Entry {
  readonly kind: 'surface' | 'bundle';
  readonly id: string;
  readonly hr: string;
  readonly tag: string;
}

const entries: Entry[] = [
  ...SURFACES.map((s, i) => ({ kind: 'surface' as const, id: s.id, hr: s.hr, tag: surfaceTag(i) })),
  ...STORY_TAKE_BUNDLES.map((b, i) => ({
    kind: 'bundle' as const,
    id: b.id,
    hr: b.hr,
    tag: bundleTag(i),
  })),
];

/** Split review.md into its `### HR-n …` sections (heading line + body). */
function sections(md: string): Map<string, { open: boolean; body: string }> {
  const out = new Map<string, { open: boolean; body: string }>();
  let cur: string | undefined;
  let open = false;
  let body: string[] = [];
  const flush = (): void => {
    if (cur) out.set(cur, { open, body: body.join('\n') });
  };
  for (const line of md.split('\n')) {
    const h = /^### (HR-\S+)\s+(\S+)/.exec(line);
    if (h) {
      flush();
      cur = h[1]!;
      open = h[2] === '🔲' || h[2] === '⏳'; // ✅ = done
      body = [];
      continue;
    }
    if (cur) body.push(line);
  }
  flush();
  return out;
}

const md = readFileSync(REVIEW_MD, 'utf8');
const secs = sections(md);
const errors: string[] = [];

// which HR-item does each tag belong to? (for the reverse check)
const ownerOfTag = new Map<string, string>();
for (const e of entries) if (e.hr.startsWith('HR-')) ownerOfTag.set(e.tag, e.hr);

for (const e of entries) {
  if (!e.hr.startsWith('HR-')) {
    // `none · <why>` — a settled bundle kept for comparison. Surfaces get no such escape.
    if (e.kind === 'surface') {
      errors.push(
        `SURFACE "${e.id}" (${e.tag}) declares hr="${e.hr}" — a surface must name an open HR-item ` +
          `(a SETTLED surface keeps no toggle at all: ADR-075 zero flag-debt).`,
      );
    }
    continue;
  }
  const sec = secs.get(e.hr);
  if (!sec) {
    errors.push(
      `${e.kind} "${e.id}" (${e.tag}) names ${e.hr}, which has no section in ${REVIEW_MD} — ` +
        `file the review item, or the human never sees this toggle.`,
    );
    continue;
  }
  if (!sec.open) {
    errors.push(
      `${e.kind} "${e.id}" (${e.tag}) names ${e.hr}, which is CLOSED (✅) in ${REVIEW_MD} — ` +
        `strip the toggle (ADR-075 zero flag-debt), or, for a story bundle the human asked to ` +
        `keep, declare \`hr: none · <why>\` in its bundle.md.`,
    );
    continue;
  }
  // the item must name the CURRENT tag — bold, as the generated block writes it
  const tagRe = new RegExp(`\\*\\*${e.tag}\\*\\*`);
  if (!tagRe.test(sec.body)) {
    errors.push(
      `${e.hr} does not name **${e.tag}** (${e.kind} "${e.id}") — add the "In the DEV panel:" ` +
        `line, or fix it if the registry order moved the tag.`,
    );
  }
}

// reverse: a section may not name a surface/bundle tag that belongs to a different item
for (const [hr, sec] of secs) {
  for (const m of sec.body.matchAll(/\*\*(S?V\d+)\*\*/g)) {
    const tag = m[1]!;
    const owner = ownerOfTag.get(tag);
    if (owner && owner !== hr) {
      errors.push(
        `${hr} names **${tag}**, but that tag belongs to ${owner} — a stale cross-reference ` +
          `(tags are registry POSITIONS: a reorder renumbers them).`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`X review-link FAILED: ${errors.length} broken link(s):`);
  for (const e of errors) console.error(`    ${e}`);
  process.exit(1);
}

const awaiting = entries.filter((e) => e.hr.startsWith('HR-')).length;
const kept = entries.length - awaiting;
console.log(
  `review-link: OK (${awaiting} toggle(s) linked to open HR-items` +
    `${kept > 0 ? `, ${kept} kept as reference` : ''}).`,
);

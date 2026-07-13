// review-link gate — the DEV review queue and the human's review queue must name each other.
//
// The failure this exists to stop is quiet, and it has already happened twice: the ADR-184
// zone-announce toggle shipped into the DEV panel's SETTINGS tab while HR-32b still said
// "Settings"; and on 2026-07-13 the old POSITIONAL tags (V6 / SV19 = registry index) sent the
// human to the wrong row twice in one day — inserting `adr190-nudge` renumbered 22 tags, and
// pruning `hd41-progress-objective` renumbered three more. ADR-192 killed positional tags:
// the reference is the entry's ID (`market`, `sleep-announce`), which never renumbers.
//
// The registry is the source of truth for WHAT exists (ids + the HR each entry awaits);
// review.md is the source of truth for the QUEUE (which HR-items are open). This gate binds
// them, both ways:
//
//   forward   every registry entry names an HR-item, that item is OPEN in review.md, and the
//             item's body cites the entry's **id** (a toggle the human is meant to judge, with
//             no line in the queue she reads, is a toggle that does not exist)
//   reverse   every "Review → Story|Variants → **id**" citation in an OPEN item must point at
//             an entry that EXISTS in the registry and that names THIS item — a pruned bundle
//             or a re-homed toggle goes RED here instead of sending her to a missing row
//
// A story bundle may declare `hr: none · <why>` — a SETTLED diverge the human asked to keep
// live for comparison (hd30-nengu, fb324-rake-cap). It is exempt from the forward check by
// construction: it awaits nobody. A SURFACE has no such escape — ADR-075's zero-flag-debt rule
// says a settled surface keeps no toggle at all, so a surface in the registry is by definition
// still open. (Reverse still covers a `none` bundle: citing one under an HR-item is a lie.)

import { readFileSync } from 'node:fs';
import { SURFACES } from '../ui/dev-surfaces';
import { STORY_TAKE_BUNDLES } from '../ui/storyTakes';

const REVIEW_MD = 'project/human-in-the-loop/review.md';

interface Entry {
  readonly kind: 'surface' | 'bundle';
  readonly id: string;
  readonly hr: string;
}

const entries: Entry[] = [
  ...SURFACES.map((s) => ({ kind: 'surface' as const, id: s.id, hr: s.hr })),
  ...STORY_TAKE_BUNDLES.map((b) => ({ kind: 'bundle' as const, id: b.id, hr: b.hr })),
];
const byId = new Map(entries.map((e) => [e.id, e]));

/** Split review.md into its `### HR-n …` sections (heading line + body, whitespace-collapsed
 *  so a citation wrapped across lines still parses). */
function sections(md: string): Map<string, { open: boolean; body: string }> {
  const out = new Map<string, { open: boolean; body: string }>();
  let cur: string | undefined;
  let open = false;
  let body: string[] = [];
  const flush = (): void => {
    if (cur) out.set(cur, { open, body: body.join(' ').replace(/\s+/g, ' ') });
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

// forward: every registry entry → an open HR-item that cites its id
for (const e of entries) {
  if (!e.hr.startsWith('HR-')) {
    // `none · <why>` — a settled bundle kept for comparison. Surfaces get no such escape.
    if (e.kind === 'surface') {
      errors.push(
        `SURFACE "${e.id}" declares hr="${e.hr}" — a surface must name an open HR-item ` +
          `(a SETTLED surface keeps no toggle at all: ADR-075 zero flag-debt).`,
      );
    }
    continue;
  }
  const sec = secs.get(e.hr);
  if (!sec) {
    errors.push(
      `${e.kind} "${e.id}" names ${e.hr}, which has no section in ${REVIEW_MD} — ` +
        `file the review item, or the human never sees this toggle.`,
    );
    continue;
  }
  if (!sec.open) {
    errors.push(
      `${e.kind} "${e.id}" names ${e.hr}, which is CLOSED (✅) in ${REVIEW_MD} — ` +
        `strip the toggle (ADR-075 zero flag-debt), or, for a story bundle the human asked to ` +
        `keep, declare \`hr: none · <why>\` in its bundle.md.`,
    );
    continue;
  }
  if (!sec.body.includes(`**${e.id}**`)) {
    errors.push(
      `${e.hr} does not cite **${e.id}** (${e.kind}) — add its "In the DEV panel:" line ` +
        `(Review → ${e.kind === 'bundle' ? 'Story' : 'Variants'} → **${e.id}**).`,
    );
  }
}

// reverse: every DEV-panel citation in an open item must resolve, and to THIS item
for (const [hr, sec] of secs) {
  if (!sec.open) continue;
  for (const m of sec.body.matchAll(/Review → (?:Story|Variants) → ((?:\*\*[^*]+\*\*[ ·]*)+)/g)) {
    for (const t of m[1]!.matchAll(/\*\*([^*]+)\*\*/g)) {
      const id = t[1]!;
      const owner = byId.get(id);
      if (!owner) {
        errors.push(
          `${hr} cites **${id}** in its "In the DEV panel:" line, but no surface/bundle with ` +
            `that id exists — it was pruned or renamed; fix the citation (or close the item).`,
        );
      } else if (owner.hr !== hr) {
        errors.push(
          `${hr} cites **${id}**, but that ${owner.kind} names ${owner.hr} — a stale ` +
            `cross-reference.`,
        );
      }
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

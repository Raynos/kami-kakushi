// The deferred-work gate — "if it isn't in the queue, it doesn't exist" (human, 2026-07-12).
//
// THE ERROR MODE THIS EXISTS FOR. Session 183 shipped the `sleep` verb, found (late) that
// nothing announces it, and the human RULED the fix. That ruling was then recorded in an ADR
// bullet, a snapshot line, a journal entry and an HR-item — everywhere except the one place
// that gets PICKED UP. The human's words:
//
//   "If it's not in docs/plans/ it will be lost and not built. When I wake up and look at the
//    project, I think: if it's not in human-in-the-loop, or in my reading queue, or in
//    docs/plans, then it doesn't exist — it just vanishes into the 100s of commits."
//
// He is right, and the failure is STRUCTURAL. The session brief names startable work from
// `docs/plans/`. An ADR bullet is canon (read once you already know to look); a journal entry
// is history; a snapshot sentence is prose a human skims. None of them is a QUEUE. Work parked
// there is read, never resumed.
//
// WHY THIS SHAPE, AND NOT A BROADER SCAN (the never-cry-wolf calibration — AGENTS.md: push a
// rule to the highest rung that can SOUNDLY hold it). The obvious gate — grep the docs for
// "deferred" — is unshippable: `decisions.md` is full of HISTORICAL deferrals ("ADR-021
// deferred the docs-explosion", "the freeze remains DEFERRED"), and a gate that reds on prose
// about the past teaches everyone to bypass it. So the trigger is a DELIBERATE, SHOUTED
// declaration: write NOT BUILT / NOT YET BUILT / UNBUILT in capitals and you are telling a
// future reader "there is work here" — at which point naming its home costs one token, and
// refusing to is the bug. Lowercase prose ("T1+ are specced, not built") is a state
// description and never fires.
//
// This gate therefore catches the DECLARED case with teeth and zero false positives. The
// UNdeclared case — work that lives only in a journal's "next steps" and is never shouted
// anywhere — is not mechanically detectable, and is carried one rung down, by the
// leftover-work sweep in the Checkpoint ritual (working-agreements.md) that /prepare-to-exit
// must run before it may print a BYE.

import { readFileSync } from 'node:fs';

/** Docs that make CLAIMS about the project's state — canon + the live snapshot. A shouted
 *  "NOT BUILT" here is a promise to a future reader, so it must name where the work lives.
 *  Journals are deliberately NOT scanned: they are append-only HISTORY, not a queue, and
 *  reding an old entry for describing the past is exactly the wolf-cry this avoids. */
const SCANNED = ['docs/living/decisions.md', 'project/status/project-status.md'] as const;

/** SHOUTED declarations of leftover work. The shout is on the **NOT** (case-sensitive): an agent
 *  typing "NOT built" is flagging work to the future, while lowercase prose about the past
 *  ("T1+ are specced, not built") is a state description and never fires.
 *
 *  CALIBRATED AGAINST THE REAL TREE, not guessed: a first pass also matched the bare word
 *  UNBUILT and immediately cried wolf on ADR-117, whose TITLE is "the PRD's primary job is the
 *  forward spec of the UNBUILT" — a noun, a job description, not deferred work. A gate that reds
 *  on that gets bypassed within a week, so the word is gone. Trigger on the declaration, never
 *  on the vocabulary. */
const DECLARES_DEFERRED = /\bNOT (YET )?[Bb]uilt\b|\bRULED BUT NOT\b/;

/** The homes the human actually reads — as a PATH, never a bare id. `roadmap.md` counts (tier and
 *  milestone work genuinely lives and is tracked there); an ADR bullet, a journal line and a
 *  snapshot sentence never do — that is the whole point of this gate.
 *
 *  A bare `HR-nn`/`HD-nn` is deliberately NOT enough, and that is the second hole this gate had:
 *  those ids are sprinkled through canon and the snapshot ("Human-gated: HD-40 + HR-1 …"), so any
 *  declaration standing near one passed for free. Proximity to an id proves nothing. A PATH is a
 *  pointer a reader can follow, and it cannot be satisfied by accident — so "cite the home" means
 *  cite the FILE. */
const NAMES_A_HOME = /(?:\.\.\/|docs\/)?plans\/|BACKLOG\.md|roadmap\.md|human-in-the-loop\//;

/** The window a home must appear in: the declaration's own line, the line before, and the two
 *  after. NOT the whole bullet — that was the first cut, and it had a HOLE the size of the bug:
 *  the snapshot's resume block declared the announce beat "NOT built" while citing no plan, and
 *  the gate went green anyway because an UNRELATED plan link (T2's) sat elsewhere in the same
 *  numbered item. A citation that belongs to different work is not a home; it is camouflage.
 *  Requiring the home NEXT TO the shout is what makes the pass mean something — and it is also
 *  what a human reading the declaration needs: the pointer where their eye already is. */
function windowAt(lines: readonly string[], i: number): string {
  return lines.slice(Math.max(0, i - 1), i + 3).join('\n');
}

const failures: string[] = [];

for (const file of SCANNED) {
  let text: string;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue; // a moved/renamed doc is md-links' job, not this gate's
  }
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (!DECLARES_DEFERRED.test(line)) continue;
    if (NAMES_A_HOME.test(windowAt(lines, i))) continue;
    failures.push(
      `  ${file}:${i + 1}\n` +
        `      ${line.trim().slice(0, 96)}\n` +
        `    ^ declares work that is NOT BUILT, but names no home for it.`,
    );
  }
}

if (failures.length > 0) {
  console.error(
    `✗ deferred-work: ${failures.length} declaration(s) with nowhere to be picked up:\n`,
  );
  console.error(failures.join('\n\n'));
  console.error(
    `\n  A ruling you did not build is a PLAN, not a sentence. Give it a home the human\n` +
      `  actually reads — the session brief starts from docs/plans/, and nothing else is a queue:\n` +
      `\n` +
      `    • docs/plans/<model>-<date>-<slug>.md   ← work an agent should pick up (use /write-plan)\n` +
      `    • HR-nn / HD-nn in project/human-in-the-loop/   ← a call only the human can make\n` +
      `    • project/BACKLOG.md                    ← deliberately parked; never nagged\n` +
      `\n` +
      `  Then cite it in the same bullet. An ADR bullet, a journal line and a snapshot sentence\n` +
      `  are a RECORD, not a QUEUE: work parked there vanishes into the commit log (human,\n` +
      `  2026-07-12). Lowercase prose about the past never fires this gate — only a SHOUTED\n` +
      `  "NOT BUILT" does, and that is a promise you are making to a future reader.\n`,
  );
  process.exit(1);
}

console.log(
  '✓ deferred-work: every NOT-BUILT declaration names a home (plan / HR / HD / BACKLOG).',
);

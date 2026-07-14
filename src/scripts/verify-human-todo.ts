// The human-todo gate — project/todo-human.md must stay TIDY, because the
// session brief is only as honest as this file.
//
// THE ERROR MODE THIS EXISTS FOR (session 205, 2026-07-14). The brief told the
// human "reading queue: all read & signed off ✅" while the file actually held
// two live entries — buried under months of quiet rot. Every rot pattern below
// was OBSERVED in the real file, not guessed:
//
//   1. Ticked `- [x]` entries left in place — the file's own header rule is
//      "closed items are REMOVED, not struck" (git history is the record).
//   2. Orphan fragments — sessions clearing a 72-char-wrapped entry deleted
//      only its first lines, leaving dangling tails (`satiety-only)`, a
//      description whose link line was gone) that read as garbage and hid the
//      real entries around them.
//   3. Entries linking into project/archive/ — an ARCHIVED doc never belongs
//      in the queue (archiving IS the sign-off; any still-owed bit is an
//      HR-item, per the file's footer).
//   4. Plain `- ` bullets used for entries — the brief's parser (and this
//      file's contract) is CHECKBOXES; a bare bullet is invisible to the
//      brief, which is exactly how two live entries got stranded below the
//      footer blockquote and vanished from every session's opening relay.
//
// CALIBRATION (never cry wolf): only `## TODO` and `## Reading queue` section
// bodies are scanned; blockquote (`>`) lines are exempt everywhere — the
// header/footer prose legitimately mentions archive/, example bullets, etc.
// What this gate CANNOT judge — whether an entry is stale because the human
// already read it — stays one rung down, with ADR-089 implicit sign-off and
// the /prepare-to-exit queue reconciliation.

import { readFileSync } from 'node:fs';

// Optional path arg so the gate's RED cases are provable against a fixture
// (PH3: a check that cannot go RED is not a check).
const FILE = process.argv[2] ?? 'project/todo-human.md';

const SECTIONS = ['## TODO', '## Reading queue'];
const ARCHIVE_LINK = /\]\((?:\.\.\/)?(?:project\/)?archive\//;

const lines = readFileSync(FILE, 'utf8').split('\n');
const failures: string[] = [];
const fail = (i: number, msg: string) =>
  failures.push(`  ${FILE}:${i + 1}\n      ${lines[i]!.trim().slice(0, 88)}\n    ^ ${msg}`);

let insec = false;
let inEntry = false; // inside a `- [ ]` entry's continuation block
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]!;
  if (line.startsWith('## ')) {
    insec = SECTIONS.includes(line.trim());
    inEntry = false;
    continue;
  }
  if (!insec || line.startsWith('>')) continue;

  if (/^- \[[xX]\]/.test(line)) {
    fail(
      i,
      'ticked entry left in place — closed items are REMOVED, not struck (git is the record).',
    );
    inEntry = true; // absorb its continuation lines — one failure per ticked entry, not per line
  } else if (/^- \[ \]/.test(line)) {
    inEntry = true;
    if (ARCHIVE_LINK.test(line)) {
      fail(i, 'entry links into project/archive/ — an archived doc never belongs in the queue.');
    }
  } else if (/^- /.test(line)) {
    fail(i, 'plain bullet — queue entries are `- [ ]` checkboxes, or the brief cannot see them.');
    inEntry = false;
  } else if (/^[ \t]+\S/.test(line)) {
    if (!inEntry) {
      fail(
        i,
        "orphan fragment — a wrapped entry was part-deleted; remove ALL of an entry's lines.",
      );
    } else if (ARCHIVE_LINK.test(line)) {
      fail(i, 'entry links into project/archive/ — an archived doc never belongs in the queue.');
    }
  } else {
    inEntry = false; // blank line or other top-level content ends the entry
  }
}

if (failures.length > 0) {
  console.error(`✗ human-todo: ${FILE} has ${failures.length} rot pattern(s):\n`);
  console.error(failures.join('\n\n'));
  console.error(
    `\n  This file is what the session brief relays to the human every morning — rot here\n` +
      `  means live items silently vanish from the relay (it happened: session 205). Rules:\n` +
      `    • close an entry by DELETING it — every line of it, not just the link line\n` +
      `    • never tick [x]; never leave an archived doc's entry behind\n` +
      `    • entries are \`- [ ]\` checkboxes above the footer blockquote, nothing else\n`,
  );
  process.exit(1);
}

console.log(`✓ human-todo: ${FILE} is tidy (no ticked/orphaned/archived/bare entries).`);

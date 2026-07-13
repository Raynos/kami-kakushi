# Session 186 — 2026-07-13 — the prose norm drops from 80 to 72

**Summary:** The human hit soft-wrap in an 80-column pane and ruled the
markdown prose norm down from **≈80 to ≈72 characters**. Ran the change
through every LIVE site that states or *executes* the width — the
AGENTS.md convention, working-agreements, two skills/workflows, the
narrative authoring spec, and the one place it was real code
(`gen-regions.ts`'s `wrap()` default, which hard-folds the generated
gate-roster regions). 19 gates green.

## The diagnosis (worth keeping)

The wrap the human saw wasn't purely a width problem. Two distinct
causes:

1. **The gutter.** An editor's line numbers + fold/sign column eat ~8
   columns before a character of prose renders — so an "80-char" source
   line needs an 88-column window. 72 restores the headroom, and doubles
   as the git-commit body width, so one number now covers prose and
   commits.
2. **Unbreakable tokens.** Long inline links
   (`[text](../../docs/plans/long-slug.md)`) and backticked paths are
   single atoms — *no* wrap width fixes them. Narrowing to 65 would have
   churned more paragraphs and still not fixed these. The AGENTS.md
   bullet now says so explicitly and points at reference-style links /
   shorter relative paths as the actual remedy.

## What changed

- `AGENTS.md` — the "Markdown prose width" convention bullet: 80 → 72,
  with the gutter rationale, the git-body coincidence, and the
  unbreakable-token caveat. **This bullet is the only always-loaded
  statement of the norm** — it is what makes agents write
  `docs/plans/*.md` at the given width. Nothing in `plan-authoring.md`,
  the `write-plan` skill, or `docs/plans/templates/` mentions a width at
  all (verified by grep); plans inherit it purely from here.
- `project/status/working-agreements.md` — the one-line restatement, +
  why.
- `src/scripts/gen-regions.ts` — `wrap()` default `78` → `72`. **The
  only executable site.** It hard-folds the generated `gate-roster`
  regions.
- `src/scripts/checkpoint.ts` — its explicit `wrap(…, 78)` → `72` to
  match.
- `project/status/project-status.md` + `working-agreements.md` — the
  generated `gate-roster` region, reflowed by `pnpm run checkpoint` (78
  → 72 cols). This is a regen, not a hand-edit.
- `.claude/skills/ship/SKILL.md` — the CHANGELOG-authoring instruction
  (~80 → ~72).
- `.claude/workflows/map-blind-pass.js` — the blind-pass report prompt
  (~80 → ~72).
- `src/core/content/narrative/README.md` — the FB-5 authoring spec's
  hard-wrap rule + the heading-exemption bullet.
- `src/core/content/narrative/takes/works-cause/bundle.md` — the
  take-author brief.

## Deliberately NOT changed

- **`.oxfmtrc.json`'s `printWidth: 100`** — that's the TypeScript
  formatter, and markdown is on its ignore list. Unrelated to the prose
  norm; left alone.
- **`project/journal/`, `project/archive/`, `project/brainstorms/`** —
  historical records under the append-only rule. Their "~80" mentions
  are accurate history of what the norm *was*; rewriting them would be
  falsifying the record.
- **`src/core/content/narrative/t0v2/u1-r1-day-hand/VERDICT.md`** —
  likewise a record of a past review.
- **Existing docs at 80.** The norm explicitly says don't mass-retrofit;
  mixed widths are invisible once rendered. New/edited prose gets 72
  from here on.
- **`.claude/worktrees/agent-*/`** — a co-agent's worktree; not mine to
  touch.

## Next intended steps

1. Nothing pending — the norm is canon and every executable site follows
   it.
2. If reflow churn ever becomes a real annoyance, the escalation is a
   `verify` *warn* (never a hard gate — CJK/URLs/tables make it cry
   wolf).

## Landmines

- **`wrap()` is load-bearing.** Changing its default rewrites every
  generated gen-region, and the `gen-prd-regions` / `checkpoint` gates
  **byte-compare**. Touch the width → run `pnpm run gen:prd-regions`
  **and** `pnpm run checkpoint` in the same change, or the gates go red.
  (`gen:prd-regions` was a no-op here: those regions' lines already sat
  under 72.)
- Shared tree: `docs/plans/opus-2026-07-12-sleep-announce-beat.md`,
  `project/todo-human.md`, and the co-agent's own session-185 journal
  were dirty throughout and are **not** in this commit.

---

## 2 · The oxfmt sibling — attempted, reverted, queued

The human then asked to take the **TypeScript** formatter to 80 as well
(`.oxfmtrc.json`'s `printWidth`, currently **100** — it governs code,
not markdown, and markdown is on its ignore list). I made the edit and
**reverted it within the same turn**, un-committed. Why, so nobody
retries it blind:

- It is a **~310-file mechanical reformat**. At the moment of the
  request a co-agent had **9 dirty `src/` files** open (`reveals.ts`,
  `log-filter.ts`, `dev.ts`, `flavor.ts`, …). `pnpm run format` would
  have rewritten those files *underneath* their in-flight edits.
- The two halves **cannot be split**: config-at-80 without the reformat
  turns the `oxfmt` gate **red for all three agents**, blocking
  everyone's commits. So it's one commit, or nothing.

**Queued as a human TODO** (`project/todo-human.md`) rather than done —
the human dictated it verbatim, which is the sanctioned
`SKIP_HUMAN_TODO=1` case. The recipe when the tree is quiet: flip the
one number → `pnpm run format` → `pnpm run verify` → commit, naming the
changed files by pathspec.

**Also raised, not yet decided:** what tooling would make the 72-char md
norm actually *fire* rather than sit as a written sentence. The standing
analysis — a hard `verify` gate is the WRONG rung (it cries wolf on CJK
/ long URLs / unwrappable table rows, which is precisely why markdown
was never gated); the sound rung is a **`PostToolUse` hook** on
`Write|Edit` of `*.md` (violations are born in agent tool-calls, so
feedback belongs there — advisory, no red build), optionally backed by a
`pnpm run md:wrap` script reusing the already-tested `wrap()` from
`gen-regions.ts`, plus an `.editorconfig` `max_line_length = 72` (the
repo has none) so the human's editor draws the ruler. Prettier with
`proseWrap: always` is rejected: it mass-retrofits every existing doc
(the norm forbids that) and adds a second formatter. **Awaiting the
human's pick.**

---

## 3 · The human picked three of the four — built

Human picked the **hook**, the **`md:wrap` script**, and the
**`.editorconfig` ruler**; declined the `verify` WARN gate. All three
landed.

- **`src/scripts/md-wrap.ts`** (+ 20 tests) — reflow/check for markdown
  prose. Deliberately conservative: it only ever re-folds at an EXISTING
  space, and leaves fences, tables, headings, frontmatter, `gen:`
  regions, hard line breaks, and unbreakable tokens exactly as found.
  Modes: rewrite in place, `--check`, and `--check --new-only` (only
  lines this tree ADDED vs HEAD).
- **`.claude/hooks/md-prose-width.sh`** — `PostToolUse(Edit|Write)`,
  wired in `.claude/settings.json` (the repo's FIRST PostToolUse hook).
- **`.editorconfig`** — the repo had none. `max_line_length = 72` for
  `*.md`, 100 for code (matching `.oxfmtrc.json`, so the flip must move
  both).
- **`pnpm run md:wrap <file>`** in `package.json`.

**The three design calls, and why:**

1. **A hook, not a gate.** A hard width gate on markdown cries wolf on
   CJK, long URLs/paths, and table rows that physically cannot wrap —
   which is precisely why markdown was never gated. A red build over a
   soft norm just trains everyone to `SKIP_VERIFY=1`. The violations are
   BORN in agent Edit/Write calls, so that is the rung where feedback
   fires soundly.
2. **It REPORTS, never rewrites.** A PostToolUse that reflowed the file
   would invalidate the agent's very next `Edit` (whose `old_string`
   must match byte-for-byte). So it hands back a list; the agent runs
   `md:wrap` itself.
3. **`--new-only`.** The norm says "apply to new/edited docs; don't
   mass-retrofit". Reporting only lines changed vs HEAD means editing
   one line of a 300-line 80-wide archive doc doesn't dump 40 complaints
   about prose nobody in this session wrote. This is the whole reason it
   can't nag.

**Offender = over-width AND reflow would improve it.** That one
definition is what makes it sound: an over-long line that reflow leaves
alone (an unbreakable URL, a table row) is not an offender *by
construction*, not by a special case.

**Verified, not asserted:** a mutation test (deleting the table skip)
turned the guard test RED, so the tests can fail. The hook was probed
live — it flagged the prose line in a fixture while correctly ignoring
an 80-char table row and an unbreakable link. Then, unprompted, **it
fired on my own 78-char edit to `todo-human.md` mid-session** and
flagged only that new line. That is the real end-to-end proof.

## Landmines (2)

- **The repo's first `PostToolUse` hook.** Hook edits in
  `.claude/settings.json` only take full effect on a **session restart**
  — a fresh agent gets it, this session got it live only because the
  file is re-read per tool call.
- The hook shells out to `npx tsx` (~300–500 ms) on every `.md` write.
  Tolerable (it is not in the commit path), but it is why it does NOT
  run on every gate.
- Committed with `SKIP_DOCS_VERIFY=1`: the docs lane (`md-links`,
  `deferred-work`, `checkpoint`) was red on a **co-agent's** in-flight
  plan archival, not on anything here. The CODE lane was fully green.
  **Left local, not pushed** — never push onto someone else's red.

---

## 4 · The tool corrupted a human-owned file. What happened, and the fix

**It shipped with a content-destroying bug and it bit within minutes.**
Being plain about it, because the recovery is the useful part.

**The bug.** `isProse()` treated a bare `>` — a blockquote's PARAGRAPH
SEPARATOR — as prose. It carries no text, so folding merged it away and
the paragraphs either side of it collapsed into one. Running `md:wrap`
on `project/todo-human.md` ate all **3** separators in its header
blockquote and welded three distinct paragraphs together.

**How it got worse before it got better.** While I was diagnosing, a
co-agent committed (`295bbd56`) and their commit **swept my damaged
working copy of `todo-human.md` into it** — so the corruption landed in
`main`'s history under someone else's name. That is the shared-index
hazard the checkpoint rules warn about, seen from the other side: I was
the one who left a dirty file lying in the shared tree for a co-agent's
commit to pick up.

**The recovery — the part worth copying.** Do NOT eyeball a reflow diff.
A reflow changes every line, so the eye cannot see content loss inside
it. Compare **normalized word streams** instead:

```sh
norm() { tr -s ' \n' ' ' | tr ' ' '\n' | grep -vE '^>$|^$'; }
diff <(git show HEAD:path.md | norm) <(norm < path.md)   # empty == pure reflow
```

That check proved the damage was *only* the separators (no prose lost),
identified the right pre-damage base (`f80dee28`), and then caught a
SECOND mistake: restoring from that base **re-added a reading-queue
entry the co-agent had deliberately deleted** (they archived
`sleep-announce-beat.md`, so its queue line had to go — it was also
`md-links`' dead link). Word-diffing against HEAD, rather than against
my memory of the file, is what surfaced that.

**The guard + the teeth.** `isProse()` now returns false for a
quote-only line. Two regression tests (`keeps a bare ">" …` and `does
not merge quoted paragraphs …`) pin it, and both were **mutation-proven
RED** by deleting the guard.

**The lesson, generalised.** A tool that rewrites prose must be judged
on what it PRESERVES, not on what it produces. The 16 original tests all
asserted the happy path and the skip-list; not one asserted "a separator
survives". A suite that only proves the tool *works* will not notice the
tool *destroying* things. Content-preservation is its own test class —
assert the word stream is invariant, not merely that the output looks
right.

## 5 · The second bug: the tool cried wolf at itself

Minutes after the separator fix, the hook flagged a **shell one-liner
inside a ```sh fence``` in this very journal**. The cause: `offenders()`
re-folded each line **in isolation**, which throws away the file context
— and a line judged alone cannot know it sits inside a code fence.

That is the exact failure mode this whole design was chosen to avoid:
the argument for a hook-over-a-gate was "a width check on markdown cries
wolf". A crying-wolf hook is no better than a crying-wolf gate.

**The fix** is structural, not a special case. `reflow()` and
`offenders()` now share ONE context-aware pass (`analyze`), which
returns the set of source lines it actually treated as reflowable prose.
`offenders()` may only report lines in that set. So the skip-list is
enforced in the one place that has the context, and cannot drift between
the two functions.

An offender is now the conjunction of three conditions, each closing a
distinct cry-wolf hole: **(1)** the line is reflowable prose *in
context* (not fence/table/heading/gen-region/frontmatter); **(2)** it
exceeds the width; **(3)** folding it would actually shorten it (so an
unbreakable URL is never reported). Two more regression tests pin the
fence and the table cases, and 20 tests now pass.

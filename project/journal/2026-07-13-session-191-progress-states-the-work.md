# Session 191 — 2026-07-13 — Progress states the work, not the story

**Summary:** the human played the HD-41 diverge, picked **B (the ruled
entry)**, and rejected two things the build had wrong: the meter flashed
on every rake, and the Progress tab spoke story prose. Both are fixed —
the pulse now fires when a rung **objective completes** (R0: three
flashes, not thirty-five), and every requirement authors its own
`objective:` line, so Progress **states the labour that was finished**.
The retired `earnedEntry` docket formula is gone. Landed in `ab3fe517`
(a fold-with-credit commit that also carried w2:p5's Review-tab work)
and `<this commit>` (the settled-toggle prune + the V-tag renumber).
HR-41 stays open on the WORDS — three blind takes, canon = A "the
house's book".

## What changed

- `src/core/content/narrative/requirements.md` — every requirement (31,
  R0→R7) gains an `objective:` line: the terse statement of the work it
  finished. Canon is take A of the ADR-139 diverge.
- `src/core/content/narrative/takes/hd41-progress-objective/` — the two
  not-picked takes (B "the world, changed", C "the hands keep the
  account"), swappable in DEV → Story. Replaces `hd41-earned-entry`,
  which is deleted (same alphabetical slot, so SV18 never moved).
- `src/core/content/narrative/flavor.md` — `earnedEntry` retired: one
  line stamped on every completion said nothing about the work it
  recorded.
- `src/scripts/narrative/{parse,emit,takes,story-doc}.ts` — the compiler
  learns `objective:` (**required** — "no objective line" is a build
  error), the `## prose req-objective` take unit, and prints both
  readings into `docs/content/t0-story.md`.
- `src/core/requirements-engine.ts`, `content/requirements.ts`,
  `core/ranks.ts`, `core/index.ts` — `RequirementDef.objective`;
  `requirementById` (the renderer's ADR-186 descriptor lookup);
  `rungProgress().done` — the count of finished requirements, which is
  what the pulse rides.
- `src/ui/render.ts` — the Progress view paints the objective line
  (never the story prose); the meter pulses on `done` growth, not on
  percent growth; a DEV take-flip repaints the log through the
  sanctioned tab-switch path.
- `src/ui/{styles.css,dev.ts,dev-surfaces.ts,storyTakes.ts}` — B is the
  sole `.earned` treatment; `subReqObjective` + the reader wiring; the
  settled `earned-line` surface is **pruned** (ADR-075 zero flag-debt),
  which renumbered every V-tag.
- `project/human-in-the-loop/review.md` — HR-41 rewritten: the treatment
  is settled, the open call is the objective line's voice. All V-rows
  renumbered (the `review-link` gate named every stale one).
- `docs/plans/opus-2026-07-12-rung-reward-legibility.md` — steps 5–6.

## What I got wrong, and what it cost

I edited a co-agent's **untracked** file (`dev-surfaces.ts`) before
checking who owned it. Reverted it byte-for-byte and re-did the prune as
its own commit after theirs landed. The lesson is the cheap one: in this
tree, `git status` **before** the first edit, not after the first
conflict.

## A defect I reported and then disproved (the harness was the bug)

~~An open defect: story lines never land in the log incrementally — 36
story-visible entries in state, 32 in the DOM, the earned line among the
missing.~~ **Wrong — there is no defect.** The lines were sitting in the
log's reveal cascade + typewriter queue. My headless drive fired ten
rakes in ~1.5 s, which no human does; the queue needs ~25 s to type four
long narration lines. Waiting 30 s instead of 6 s, **all 36 land**, the
earned line included.

Worth keeping because the mistake is instructive: **a headless driver
plays at a speed the game was never paced for, so "the UI didn't update"
is a claim about the DRIVER until proven otherwise.** The tell was there
and I nearly missed it — the same drive was "losing" ordinary teach
lines too, which no HD-41 change could touch. Check the harness before
you accuse the build.

## A red I found on the way out: the e2e lane, dark since ADR-184

The push's e2e blast-radius warning was right to nag. `pnpm run
test:e2e` came back **3 failed / 88 passed** — the R3 journey, on all
three profiles, timing out on a tab that "is not visible". Not mine: the
lane
has been red on `main` since `a4863592` (**ADR-184 — a zone opens only
in a VN**), and two CI e2e runs had already failed unnoticed.

The cause is the feature working *exactly as designed*. Zone reveals
fire from the labour the player is already doing — arriving at the
forecourt with coin opens `sb-market`, the paddies at R3 open
`sb-racks` — and a full-screen VN **hides the shell** (`vnActive`). The
spec's `walkSheet` walked paddies → forecourt → gate, opened scenes it
never played, and then pressed a tab that was behind the washi. So a
walk across the sheet now has to **play what it opens, as the player
must**: `playAnyOpenVn` drains the VN after each hop (no-op when nothing
opened, bounded because one arrival can queue two scenes), and
`hurryTypewriter`/`playVnScene` move from `journeys.spec.ts` into
`helpers.ts` — one home, both specs (TST1). Lane: **91/91**.

Worth saying plainly: **a green `verify` never covered this.** The e2e
lane is CI-only by budget (D-072), so its red sat in a workflow nobody
was reading. The push-time blast-radius warning is the only thing that
put it in front of me.

## Next intended steps

1. **HR-41** — the human picks the objective-line take; that verdict
   **writes the HD-41 ADR** (and closes the plan).
2. **HD-45** (new) — what rung the e2e lane sits on. I fixed the red;
   I did **not** fix the hole that let it sit there unread. Queued as a
   decision because the answer costs either push-time or a brief line,
   and that is the human's call to make.
3. `/prd-ripple` at close-out (`pnpm run prd:drift` is **CLEAN** as of
   this session — no game→PRD fact drift from the objective lines).

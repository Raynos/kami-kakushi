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

## Next intended steps

1. **HR-41** — the human picks the objective-line take; that verdict
   **writes the HD-41 ADR** (and closes the plan).
2. `/prd-ripple` + `pnpm run prd:drift` at close-out.

# Session 211 — 2026-07-18 — five plans from the overnight-burn triage

**Summary:** The human asked what a weekly rate limit should be spent
on given their own review time is the bottleneck, then pulled five
parked items forward into real plans: pictogram A/B (#15), stamp-book
resume (#8+10), the t0-story.md reading-script interleave (BACKLOG),
the estate-sheet craft pass (#5), and bestiary plates (#4). All five
authored via the write-plan skill, grounded against the tree at
`9e2dff3c`, template-gate green, queued for the human's read.

## What changed

- `docs/plans/fable-2026-07-18-pictogram-ab.md` — NEW (build): the
  honest 10-item pictogram-vs-emoji contact sheet; the 2026-07-08 A/B
  ruling stands verbatim, "both slop, keep emoji" pre-sanctioned.
- `docs/plans/fable-2026-07-18-stamp-book-resume.md` — NEW (build):
  E3 resume — spec, state feed (core-history audit flagged), home HD,
  ADR-075 diverge. Grounding note: the old "gated on Plan B"
  condition is SATISFIED (Plan B shipped v0.4.0).
- `docs/plans/fable-2026-07-18-reading-script-interleave.md` — NEW
  (process): interleave rung-triggered scene-defs into the ladder
  (`trigger: rung RN` auto; new inert `reading: RN` meta for
  `count`/`count-resolve`, whose R5 home is only `intents.ts:385`);
  spine test derived from `RANKS`, RED-proven first.
- `docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md` — NEW
  (build): PH2 catch — the register's #5 forward track is STALE (the
  sheet already folded into the Estate 家 tab as HR-30 variant A,
  state-driven), so the plan is a craft pass on the three recorded
  scorecard ✘s (P20 mobile · TST4 shutters · P2 idiom), additive
  under the open review.
- `docs/plans/fable-2026-07-18-bestiary-plates.md` — NEW (build):
  code-drawn field-guide plates for the open HR-5 panel, spec +
  golden pin + blind-pass, wired as DEV-only `bestiary-d`; scholar
  fiction stays a flagged proposal, not canon.
- `docs/living/graphics-concepts.md` — plan pointers stamped into
  rows 4 / 5 / 8+10 / 15 (row 5 additionally flagged stale).
- `project/BACKLOG.md` — the reading-script entry moved OUT (the
  human's "make a plan" is the pull-forward; the plan is its home).
- `project/todo-human.md` — the five plans added to the reading
  queue (same-commit gate).

## Next intended steps

1. The human reads/signs the five plans (reading queue).
2. Execution order proposed for an overnight burn: talk-system plan
   first (active, other session), then pictogram A/B →
   reading-script interleave → stamp-book spec → estate craft pass →
   bestiary plates.

## Landmines

- **Seams named in each plan:** stamp-book step 2 and the whole
  reading-script plan touch files the in-flight talk-system session
  (210) holds dirty (`state.ts`, persistence, fixtures,
  `story-doc.ts`) — both are explicitly land-AFTER-210-commits.
- Estate craft pass + bestiary plates both amend OPEN HR items
  (HR-30 / HR-5) — dated addenda only, never rewrites, ids stable
  (ADR-192).

# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`HD`-decisions + `HR`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`. Work the human has deliberately
> parked lives in [`BACKLOG.md`](BACKLOG.md), which the brief never nags.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet (how the
>   agent surfaces the markdown it generated, so nothing goes unseen).
>
> **Sign-off is implicit — you never tick anything off (ADR-089).** Reading a doc,
> or discussing / working on it together, counts as sign-off: the agent then
> clears it and keeps this list clean for you. `/prepare-to-exit` reconciles the
> queue and asks (via AskUserQuestion) to confirm any removal it can't infer.

## TODO

- Move `e2e/` → `src/tests/e2e/` (root-tidy follow-up). Deferred on purpose:
  multiple agents were live in the shared tree at move-time and `e2e/` is
  wired into `playwright.config.ts` + CI (`.github/workflows/e2e.yml`) + the
  mobile-e2e lane, so it needs a quiet tree. When done: `git mv`, update
  `testDir` in `playwright.config.ts`, the workflow paths, and the `e2e/`
  entries in `docs/repo-map.md`.

## Reading queue

> **What belongs here** — a durable doc whose purpose is for you to read or sign
> off: a **plan** (`docs/plans/`), a **brainstorm / retrospective for adoption**
> (`project/brainstorms/`), an **audit / battery report** (`project/audit/reports/`),
> or a **design doc awaiting a taste call**. Added in the commit that authors it
> (a pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).
>
> **An ARCHIVED doc (`project/archive/`) NEVER belongs here** — archiving means it's
> done/superseded, and git history + `decisions.md` + the journal are its record.
> When a plan/doc is archived, remove its queue entry in the same move (any still-owed
> bit lives as an HR-item in `human-in-the-loop/review.md`, not here).

- [`src/ui/estate-sheet/README.md`](../src/ui/estate-sheet/README.md) — the E1
  estate-cutaway spec + rubric (a standalone prototype experiment — not part
  of the map-sheets system); read before/with the HR-16 variant pick.
- [`project/brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md`](brainstorms/2026-07-08-storywave-g0-fiction-gap-inventory.md)
  — the storywave G0 fiction-gap inventory backing **HD-30** (the supplemental
  prose mini-wave); read before authorizing/scoping that wave.
- [`docs/plans/t0/fable-2026-07-09-authored-depth-demo.md`](../docs/plans/t0/fable-2026-07-09-authored-depth-demo.md)
  — **Plan K (🧊 PARKED)**: the kikigaki authored-depth demo — the "game only
  this can make" exploration turned into a Sonnet-buildable plan, sequenced
  after v0.4.0. Read to confirm it captures the direction you want parked;
  un-park is your call. (Discovery record:
  [`2026-07-09-authored-depth-direction.md`](brainstorms/2026-07-09-authored-depth-direction.md).)


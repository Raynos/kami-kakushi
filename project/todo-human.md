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

- [ ] `docs/plans/fable-2026-07-07-storywave-docs.md` — **storywave Plan A
  (DOCS)**: the docs/PRD/ADR ripple to the blessed bible — the ten-ADR
  engine docket (A0, ready-to-paste), PRD §5 rewrite + banner, targeted
  §1/§3 ripples, roadmap reshape; open questions at the bottom (pillar
  model, v1 scope, +3). Executes in parallel with Plan B per the §S seam.
- [ ] `docs/plans/fable-2026-07-07-storywave-game.md` — **storywave Plan B
  (GAME)**: re-implement T0 in src/ to the bible — six-season calendar,
  night rounds, coin lanes, 17-node map, speaker ladder, scene machinery,
  the t0v2 prose migration (ONE version ships, per your 2026-07-08
  ruling), clean-break ship; 11 open questions at the bottom.
- [ ] `docs/guides/map-spec.md` **§6** — the **T2 valley map spec** (HR-13):
  the read gate BEFORE the T2 sheet is drawn (map-styles §4 locked flow).
  The valley depiction — estate demoted to one compound, Asagiri village,
  the `ruinRevealed` re-label, the V1–V12 rubric. Same-class extension, no
  diverge. Build is blocked on your read.


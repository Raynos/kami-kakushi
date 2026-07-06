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

_(none open)_

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

- [ ] `docs/plans/fable-2026-07-06-story-quality-ladder.md` — the **story-quality
  umbrella plan**: your 19-answer decision pass recorded verbatim (§1 answer
  sheet — adopted vs rejected) + the forward phases (§2): Phase 1 = the
  story-bible co-write (cast sheet first), Phase 2 = the T0 prose wave in five
  diverge bundles. **No ADR minted yet, per your call** — approve the plan and
  the ADR is pulled from §1, then Phase 1 starts.
- [ ] `docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md` — **UI-v2 Andon
  Steel migration** (v0.3.6): **BUILD-READY** full-replacement remaster plan,
  co-authored with you. All calls locked (full replacement · Andon composition ·
  Western fonts · cursor cut · re-theme all variants · straight-on-main). **7 build
  cards** M1 palette → M2 materials → M3 composition → M4 GBA cold-open → M5
  VN/ceremony → M6 variant surfaces (HR-2/HR-5/HR-6/HR-7) → M7 doc ripple, each with
  `file:line` anchors + acceptance criteria, written for a Sonnet-class builder;
  4 reference appendices (token map · material CSS · fonts · variant recipe).
  **Read to LOCK → then I start M1.**

# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`H`-decisions + `R`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet (how the
>   agent surfaces the markdown it generated, so nothing goes unseen).
>
> **Sign-off is implicit — you never tick anything off (D-089).** Reading a doc,
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

- [x] `docs/plans/2026-07-01-prd-standalone-endstate-reconcile.md` — **Plan A** —
  IMPLEMENTED + archived (PRD → standalone end-state v1.0.0).
- [x] `docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md` — **Plan B** —
  IMPLEMENTED + archived (v0.3.2 build; A1–A10 + C all landed, session-40).
- [x] `project/audit/reports/2026-07-01-doc-staleness-reconcile.md` — *the initial
  (partial) staleness audit — SUPERSEDED by the full bidirectional reconcile above;
  read Plans A/B instead*

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

- _(none open — the `e2e/` → `src/tests/e2e/` move landed 2026-07-09.)_

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

- [`docs/plans/fable-2026-07-10-prd-truth-sync.md`](../docs/plans/fable-2026-07-10-prd-truth-sync.md)
  — the HD-33/ADR-168 PRD fix plan: 8 new gen-regions + 3 strike-and-points,
  then transcription passes over the 59 audited stale spots. Execution is
  agent-safe (text-sync, no intent moves); read to steer scope or ordering.
- [`project/audit/reports/2026-07-10-prd-truth-audit.md`](../project/audit/reports/2026-07-10-prd-truth-audit.md)
  — the audit behind that plan: 59 verified findings (18 high) — §1's rung/
  T2/cast tables, §2's defeat bleed, §6's fossil architecture, §7's "no CI"
  claim. Skim the section verdicts; the per-finding detail is for the agent.
- [`docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`](../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md)
  — the ready-to-build plan for T2 (Valley) map rungs + fog (you greenlit it
  2026-07-09; mechanics-only, no pin/HR). Skim before/whenever I build it.


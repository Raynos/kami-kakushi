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

- **Audit & review of the narrative.** Review how the cast speaks, how the
  prose is written, whether it reads easily, and whether the register matches
  the **14–21 target audience**. Cover voice consistency, readability, and tone
  fit across the T0 narrative content.

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

- [`project/audit/reports/2026-07-11-plan-quality-audit.md`](audit/reports/2026-07-11-plan-quality-audit.md)
  — all 78 plans scored (your "audit the plans + gate a template" TODO, done
  2026-07-11): verdict distribution, the systematic gaps (routing / sync /
  risks), and the back-test proving the new gate discriminates lazy from
  strong. Companion (the enforced canon):
  [`docs/guides/plan-authoring.md`](../docs/guides/plan-authoring.md) — the
  three templates (`build`/`process`/`ops`) now HARD-gated on new plans.

- [`docs/plans/fable-2026-07-11-save-format-streamline.md`](../docs/plans/fable-2026-07-11-save-format-streamline.md)
  — the save-format audit + streamline plan (your "audit the save-file format"
  TODO, done 2026-07-11): verdict, 5 findings (the log is ~90% of a save and
  mostly stale-able prose), and the steps to make `src/` the only truth on
  load. Companion format doc: `src/persistence/README.md`.

- [`docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`](../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md)
  — the ready-to-build plan for T2 (Valley) map rungs + fog (you greenlit it
  2026-07-09; mechanics-only, no pin/HR). Skim before/whenever I build it.

- [`project/audit/reports/2026-07-11-t0-narrative-register-audit.md`](audit/reports/2026-07-11-t0-narrative-register-audit.md)
  — the T0 narrative readability/register audit vs the 14–21 light-novel
  target (your 2026-07-11 ask): findings + six recommendations + the D1–D4
  direction forks that need your call before any re-voicing starts.


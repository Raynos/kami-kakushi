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

- [ ] [`docs/plans/fable-2026-07-11-wait-a-day.md`](../docs/plans/fable-2026-07-11-wait-a-day.md) —
  the wait-a-day lever you asked for (FB-408): full option map A–F with
  pros/cons + balance analysis; recommendation D+F; Phase 0 is YOUR pick.
- [ ] [`docs/plans/fable-2026-07-11-zone-rung-rebalance.md`](../docs/plans/fable-2026-07-11-zone-rung-rebalance.md) —
  the zone→rung re-mapping ("too many zones in R1"): purpose audit table +
  proposed moves (gate→R2, kitchen→R2, woodshed→R4 with the home); Phase 0
  is your sign-off.
- [ ] [`docs/plans/fable-2026-07-11-prd-rungmeter-textsync.md`](../docs/plans/fable-2026-07-11-prd-rungmeter-textsync.md) —
  the plan you asked for covering what remains after the session-179 PRD
  ripple: sweep the ~90 stale rung-meter/AND-gate lines in §1–§7 to the
  ADR-137 requirements model, keeping T1+ frontier prose. Agent-safe to
  run (ADR-168); queued so you know it exists before it starts.


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

- [`docs/plans/fable-2026-07-11-save-format-streamline.md`](../docs/plans/fable-2026-07-11-save-format-streamline.md)
  — the save-format audit + streamline plan (your "audit the save-file format"
  TODO, done 2026-07-11): verdict, 5 findings (the log is ~90% of a save and
  mostly stale-able prose), and the steps to make `src/` the only truth on
  load. Companion format doc: `src/persistence/README.md`.

- [`docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`](../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md)
  — the ready-to-build plan for T2 (Valley) map rungs + fog (you greenlit it
  2026-07-09; mechanics-only, no pin/HR). Skim before/whenever I build it.

- [`docs/plans/fable-2026-07-11-t0-narrative-revoice.md`](../docs/plans/fable-2026-07-11-t0-narrative-revoice.md)
  — the plan from the 2026-07-11 narrative register audit (findings fully
  relayed in-session; the audit report stays at
  `project/audit/reports/2026-07-11-t0-narrative-register-audit.md`):
  Wave 0 canon (audience ADR + §0.5 clarity floor + Genemon two-voice + MC
  interiority) then five worst-first ADR-139 re-voice waves with a blind
  paraphrase test per take. Your **HD-38 (D1–D4) ruling** unblocks Wave 0.


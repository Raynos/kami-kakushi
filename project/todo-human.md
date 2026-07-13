# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck
> — git history is the record. This is separate from
> `project/human-in-the-loop/` (`HD`-decisions + `HR`-reviews); both
> sections here are auto-surfaced at session start by
> `src/scripts/session-brief.sh`. Work the human has deliberately parked
> lives in [`BACKLOG.md`](BACKLOG.md), which the brief never nags.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet
>   (how the agent surfaces the markdown it generated, so nothing goes
>   unseen).
>
> **Sign-off is implicit — you never tick anything off (ADR-089).**
> Reading a doc, or discussing / working on it together, counts as
> sign-off: the agent then clears it and keeps this list clean for you.
> `/prepare-to-exit` reconciles the queue and asks (via AskUserQuestion)
> to confirm any removal it can't infer.

## TODO

- [ ] https://x.com/PrajwalTomar_/status/2074810260271800596
- [ ] **Flip `.oxfmtrc.json` `printWidth` 100 → 80 when all the agents
  are chill** (human, 2026-07-13 — dictated). Needs a **clean tree**:
  it's a ~310-file mechanical reformat, and running it over a co-agent's
  open `src/` files rewrites their work under them. Leaving the config
  at 80 *without* reformatting turns the `oxfmt` gate red for **every**
  agent, so the two halves must land in one commit. When the tree is
  quiet: edit the one number → `pnpm run format` → `pnpm run verify` →
  commit. Bump `.editorconfig`'s `max_line_length` for code 100 → 80 in
  the same commit too — it's the editor's ruler for that same number.

## Reading queue

- [ ]
  [`project/brainstorms/2026-07-12-quest-shapes-that-emerged.md`](brainstorms/2026-07-12-quest-shapes-that-emerged.md)
  —
- [ ]
  [`docs/plans/opus-2026-07-12-adr-embedded-work.md`](../docs/plans/opus-2026-07-12-adr-embedded-work.md)
  — the ADR-log sweep: work other agents buried in decisions.md instead
  of a plan, triaged HIGH/MEDIUM/LOW against `src/` the four quest
  shapes ADR-184's reveal wave actually produced (emergent, deliberately
  not an ADR — your call)
- [x]
  [`fable-2026-07-11-wait-a-day.md`](archive/fable-2026-07-11-wait-a-day.md)
  — ✅ **BUILT + archived** (session-183). You ruled Phase 0 (**D
  alone**, at your corner, R4+, teeth on both levers, one day per press,
  sim skip-blind) → **ADR-187**; it is in the game. What is left for you
  is **HR-36** (the line, three takes, live in DEV → Story) — the
  review, not the plan. Drop this line whenever.
- [x]
  [`fable-2026-07-11-prd-rungmeter-textsync.md`](archive/fable-2026-07-11-prd-rungmeter-textsync.md)
  — ✅ **DONE + archived** (session-180). It did NOT run as written: you
  ruled the rung-meter dead at **every** tier (**ADR-182**), which
  deleted the plan's whole "keep T1+ frontier prose" premise. Became a
  full rewrite — 6 PRD sections + roadmap + t1/t2-content, the lying
  code comments, and the `prd-drift` teeth (proven RED-able). Surfaced
  **HD-39**, which you ruled → **ADR-183**. Drop this line whenever;
  kept only because it reappeared in the queue after I cleared it.


> **What belongs here** — a durable doc whose purpose is for you to read
> or sign off: a **plan** (`docs/plans/`), a **brainstorm /
> retrospective for adoption** (`project/brainstorms/`), an **audit /
> battery report** (`project/audit/reports/`), or a **design doc
> awaiting a taste call**. Added in the commit that authors it (a
> pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).
>
> **An ARCHIVED doc (`project/archive/`) NEVER belongs here** —
> archiving means it's done/superseded, and git history + `decisions.md`
> + the journal are its record. When a plan/doc is archived, remove its
> queue entry in the same move (any still-owed bit lives as an HR-item
> in `human-in-the-loop/review.md`, not here).

- [`docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`](../docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md)
  — the ready-to-build plan for T2 (Valley) map rungs + fog (you
  greenlit it 2026-07-09; mechanics-only, no pin/HR). Skim
  before/whenever I build it.

  — the plan from the 2026-07-11 narrative register audit (findings
  fully relayed in-session; the audit report stays at
  `project/audit/reports/2026-07-11-t0-narrative-register-audit.md`):
  Wave 0 canon (audience ADR + §0.5 clarity floor + Genemon two-voice +
  MC interiority) then five worst-first ADR-139 re-voice waves with a
  blind paraphrase test per take. Your **HD-38 (D1–D4) ruling** unblocks
  Wave 0.


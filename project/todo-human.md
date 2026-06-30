# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs awaiting your **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.

## TODO

- [ ] **Veto pass** on the propose-then-veto adoption table (the ~16 remaining A-items) in
  [`human-feedback/2026-06-30-process-learnings-decisions.md`](human-feedback/2026-06-30-process-learnings-decisions.md).
  The decided items (3 ADRs + the F/E/P forks) are already landed; these last hygiene/process
  learnings wait for your veto/adjust before I commit them.

## Reading queue

> Docs still awaiting your **"read & reviewed"** sign-off.
>
> **What belongs here** — any durable doc whose *purpose is for you to read / review / sign off*: a **plan**
> (`docs/plans/`), a **brainstorm / retrospective put up for adoption** (`project/brainstorms/`), an **audit /
> battery report** or **changelog** (`project/audit/reports/`), or a **design doc awaiting a taste call**. Added
> in the same commit it's authored; removed when you sign off. A pre-commit gate hard-blocks a new `docs/plans/`
> doc missing from this list and loud-warns on the rest (CLAUDE.md "Reading queue").

- [ ] `project/audit/reports/2026-06-30-skill-shelfware-audit.md` — *skill shelf-ware + wiring audit (FYI)*
  - You asked "are the skills even hooked up / used?" Answer: **all 7 are wired** (valid frontmatter;
    `handoff`/`prepare-to-exit` are correctly human-only via `disable-model-invocation`), and the one
    real shelf-ware risk (`tdd`'s rules) was **already fixed** this session by lifting test-discipline
    into AGENTS.md Conventions. No action needed — read only if curious.

> **Signed off this session (removed):** `project/brainstorms/2026-06-30-v03-process-learnings.md`
> — read + adoption decided (3 ADRs D-086…D-088 + the F/E/P forks landed; the ~16 remaining items
> are in the **Veto pass** TODO above).

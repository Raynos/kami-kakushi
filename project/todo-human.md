# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs awaiting your **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.

## TODO

- [x] **Move `CLAUDE.md` to `AGENTS.md`** — done (`ebc5297`): the canonical file is now
  `AGENTS.md`; `CLAUDE.md` is a one-line `@AGENTS.md` import stub so Claude Code still loads it,
  and other agents (Cursor/Codex/etc.) can share the same instructions.

## Reading queue

> Docs still awaiting your **"read & reviewed"** sign-off.
>
> **What belongs here** — any durable doc whose *purpose is for you to read / review / sign off*: a **plan**
> (`docs/plans/`), a **brainstorm / retrospective put up for adoption** (`project/brainstorms/`), an **audit /
> battery report** or **changelog** (`project/audit/reports/`), or a **design doc awaiting a taste call**. Added
> in the same commit it's authored; removed when you sign off. A pre-commit gate hard-blocks a new `docs/plans/`
> doc missing from this list and loud-warns on the rest (CLAUDE.md "Reading queue").

- [ ] `project/brainstorms/2026-06-30-v03-process-learnings.md` — *process retrospective (a proposal)*
  - What this cycle taught us about building a better game + concrete process changes to
    adopt (an `onboarding` battery lens, e2e+invariant tests per tier, "design the
    after-state of a payoff", RED-able tests from derived fixtures, re-audit-the-diff).
    Awaiting your read + a **pick-which-to-adopt** call (some become ADRs / battery lenses).
- [ ] `project/brainstorms/2026-06-30-operating-philosophies.md` — *the unified 10 (a proposal)*
  - A repo-wide mine (41-agent workflow) distilled 30 verified philosophies into the **10
    most important operating philosophies** (unify + combine; nothing thrown away — full
    crosswalk). Awaiting your **pick-which-to-formalize** call: which become
    `docs/philosophy/*.md` next to `no-clock-no-shortcuts.md` (+ an ADR each).

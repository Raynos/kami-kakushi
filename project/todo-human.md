# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs awaiting your **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.

## TODO

- [ ] **Consider removing the raw JSON dumps from git history** — the verbatim `Workflow`-output
  snapshots in `project/brainstorms/raw/` bloat the repo; weigh a history rewrite (e.g.
  `git filter-repo`) vs. leaving them, given the shared-tree / remote constraints. *(Bundle with
  stripping the old `Co-Authored-By` trailers from past commits in the same rewrite.)* Full plan:
  [`docs/plans/2026-06-30-history-rewrite.md`](docs/plans/2026-06-30-history-rewrite.md) — parked on
  (1) all agents parked+pushed, (2) human picks message-scope A vs B.
- [ ] **Consider moving `CLAUDE.md` to `AGENTS.md` if supported** — Claude Code reads `CLAUDE.md`,
  *not* `AGENTS.md`, but supports it via an `@AGENTS.md` import (or a `CLAUDE.md → AGENTS.md`
  symlink). Worth it only if other agents (Cursor/Codex/etc.) need to share the same instructions.

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

# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs awaiting your **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.

## TODO

- [x] **Why GitHub shows `claude` as a committer — RESOLVED (going forward).** Cause: the
  `Co-Authored-By: Claude …` trailer (a harness default), which GitHub renders as a co-author; the
  real git committer was always you. Switched to an `Assisted-by:` trailer, enforced by
  `.githooks/commit-msg`. *Residual decision:* whether to rewrite history to strip the old
  `Co-Authored-By` trailers from past commits (force-push) — folds into the item below.
- [ ] **Consider removing the raw JSON dumps from git history** — the verbatim `Workflow`-output
  snapshots in `project/brainstorms/raw/` bloat the repo; weigh a history rewrite (e.g.
  `git filter-repo`) vs. leaving them, given the shared-tree / remote constraints. *(Could be
  bundled with stripping the old `Co-Authored-By` trailers in the same rewrite.)*
- [x] **Commit-message best practices — DONE.** Standardized on Conventional-Commits subjects +
  the 50/72 body rule + the required `Assisted-by:` trailer, captured in
  `.claude/rules/commit-message-style.md` (+ CLAUDE.md). Review/tweak that rule if the style isn't
  to taste.
- [ ] **Consider moving `CLAUDE.md` to `AGENTS.md` if supported** — Claude Code reads `CLAUDE.md`,
  *not* `AGENTS.md`, but supports it via an `@AGENTS.md` import (or a `CLAUDE.md → AGENTS.md`
  symlink). Worth it only if other agents (Cursor/Codex/etc.) need to share the same instructions.

## Reading queue

> Docs still awaiting your **"read & reviewed"** sign-off.

- [ ] `project/brainstorms/2026-06-30-v03-process-learnings.md` — *process retrospective (a proposal)*
  - What this cycle taught us about building a better game + concrete process changes to
    adopt (an `onboarding` battery lens, e2e+invariant tests per tier, "design the
    after-state of a payoff", RED-able tests from derived fixtures, re-audit-the-diff).
    Awaiting your read + a **pick-which-to-adopt** call (some become ADRs / battery lenses).

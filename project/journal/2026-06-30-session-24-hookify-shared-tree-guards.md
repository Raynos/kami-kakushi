# Session 24 — 2026-06-30 — hookify guards for shared-tree safety

**Summary:** Encoded three shared-tree/CI-safety norms from CLAUDE.md as
**hookify rules** (agent-side PreToolUse guards) — promoting them from the
weakest rung (written norm) to an automatic check that catches *me* before a
risky `git` command runs. No game code touched. The rest of the session was
Q&A about `/context` token accounting and the hookify plugin commands.

## What changed
- `.claude/hookify.no-bulk-git-add.local.md` — **warn** on `git add -A` /
  `add --all` / `add .` / `commit -a` (`-am`…). Exempts `commit --amend`.
- `.claude/hookify.no-tree-mutation.local.md` — **warn** on `git stash` /
  `restore` / `checkout <path|branch>`. Exempts `checkout -b/-B`.
- `.claude/hookify.no-skip-verify-push.local.md` — **block** on
  `SKIP_VERIFY=…` combined with `git push`.

All three regexes were unit-tested in isolation (25/25 true/false cases
pass). All three **tracked in git** (not gitignored) so they ship to every
clone and apply to every agent on this shared tree — a deliberate deviation
from hookify's default of git-ignoring `*.local.md`. The `.local.md` suffix
is mandatory (the plugin only globs `.claude/hookify.*.local.md`); tracking
them is independent of the name.

## Why
CLAUDE.md's "highest rung that can hold it" principle: these were
written norms only. The real `.githooks` (commit-msg, pre-push) can't catch
a bulk `git add` or a destructive `checkout` because those happen *before*
commit. Hookify fills that pre-commit gap — but only for agent actions, not
a human typing in their own terminal.

## Landmines
- **Guards me, not humans.** A human running `git add -A` is unaffected.
- **Untested against the live hook engine** — regexes verified standalone,
  but no end-to-end trigger was run to confirm the hookify runtime wires
  them up. First real `git stash`/`add -A`/etc. will confirm.
- These are **warn** (not block) for the two `git` cases on purpose:
  `git checkout main` / `git add .` are sometimes legitimate, so a hard
  block would be wrong; the warning just forces a conscious confirm.

## Next intended steps
1. (Optional) trigger one rule to confirm the live engine fires it.
2. Continue the queued v0.3.1 build (`docs/plans/2026-06-30-v0.3.1-build.md`).

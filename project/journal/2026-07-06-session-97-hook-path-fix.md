# Session 97 — 2026-07-06 — fix relative hook paths (CWD-fragile)

**Summary:** The human reported seeing hook errors in another session:
`bash: .claude/hooks/guard-git-add-all.sh: No such file or directory` (exit
127). Diagnosed as a working-directory bug, not a missing file: every hook
command in `.claude/settings.json` invoked its script via the **relative** path
`bash .claude/hooks/…`, which resolves against the hook's CWD. From the repo
root that works (exit 0); from any subdir — a `cd`'d session or a herdr
worktree agent like `w6:p1` (npm→pnpm sweep) — it misses. Reproduced exactly:
run from `src/`, both guards fail 127; from root, exit 0. All hook files are
present and committed (`b95ce33`) — nothing was deleted.

## What changed

- `.claude/settings.json` — rewrote all four hook commands to use Claude Code's
  `$CLAUDE_PROJECT_DIR` absolute root instead of a relative path:
  `guard-git-add-all.sh`, `guard-bash-safety.sh`, `enforce-headless-qa.sh`
  (PreToolUse) and `session-brief.sh` (SessionStart, same latent fragility).

## Verification

- Both guard hooks now exit 0 when invoked from `src/` with
  `CLAUDE_PROJECT_DIR` set; `settings.json` re-validated as JSON.
- Takes effect on each session's **next** start (already-running sessions
  loaded the old config).

## Shared-tree note

`w6:p1` had a large staged set (their npm→pnpm commit) plus an unstaged
modification to `.claude/hooks/enforce-headless-qa.sh` I did **not** author —
left untouched. Committed via pathspec (only `.claude/settings.json` + this
journal) so none of their staged files were swept in.

## Next intended steps

- None — isolated config fix.

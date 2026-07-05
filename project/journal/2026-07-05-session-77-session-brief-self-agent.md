# Session 77 — 2026-07-05 — session-brief: mark "you" among shared-tree agents

**Summary:** Fixed the SessionStart shared-tree callout, which counted the
current agent as its own "other agent" — a solo session wrongly showed
"1 other agent live." Root cause: `herdr-peers.sh` excluded self by
`pane_id == HERDR_PANE_ID`, but that env var is the Bash-tool subshell's pane
(e.g. `w2:p1`), never the pane herdr registered the agent under (`w1:p3`), so the
match silently failed. Now self-exclude by **session id**
(`agent_session.value == CLAUDE_CODE_SESSION_ID`), and in an include-self mode the
brief renders the current session as its own row marked **(you)**.

## What changed
- `src/scripts/herdr-peers.sh` — self-detection now keys on the Claude session id
  (pane id kept only as a best-effort fallback). New `HERDR_PEERS_INCLUDE_SELF=1`
  mode emits a 4th `peer|self` column so a caller can show which row is this
  session; default output is unchanged 3-column peers-only (git-hook contract
  intact — pre-commit/pre-push untouched).
- `src/scripts/session-brief.sh` — shared-tree callout uses include-self mode,
  gates on the **peer** count (self never counts, so solo stays silent), retitles
  to "N OTHER agent(s) … plus you (N+1 total)", and marks the self row **you**.

## Next intended steps
1. None — self-contained tooling fix.

## Landmines
- The self-exclusion depends on `CLAUDE_CODE_SESSION_ID` being exported into the
  hook/script env (it is, under Claude Code). If absent, the pane-id fallback
  applies — which is unreliable in herdr (subshell pane ≠ registered pane), so a
  future env change that drops that var would resurrect the phantom-self bug.
- `git hooks` still call `herdr-peers.sh` WITHOUT the env var → 3-column
  peers-only; verified the format is byte-identical to before.

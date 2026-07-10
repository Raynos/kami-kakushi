# Session 147 — 2026-07-10 — guard herdr sends to dead / self panes

**Summary:** A co-agent's lane-coordination message was typed into a pane whose
`claude` had exited, so the follow-up Enter ran the prose as a shell command
(`syntax error near unexpected token '('`). Added a `guard-herdr-send.sh`
PreToolUse(Bash) hook that blocks `herdr agent send` at a pane with no live agent
(or at the session's own pane) and `herdr pane run` at a live agent pane, and
updated the always-loaded norms to make the liveness check step 0.

## Root cause
`herdr agent send <pane> "msg"` accepts any pane id ("legacy pane ids" are valid
targets) and types **blindly** — it never checks that an agent is listening.
Verified: sending to a shell pane returns `{"type":"ok"}` and types straight into
bash. A pane id goes stale the instant that agent exits/restarts; what's left is a
`$` prompt. The repo norm verified delivery *after* the Enter (`agent read`) —
one step too late. `herdr agent get <pane>` already answers liveness definitively
*before* the send (`agent_not_found` for a dead pane), but nothing was calling it.

## What changed
- `.claude/hooks/guard-herdr-send.sh` — NEW PreToolUse(Bash) guard. Blocks: send
  to a pane with no live agent; send to `$HERDR_PANE_ID` (self); `pane run` at a
  live agent pane. Passes: sends to live agents, `pane run`/`send-text` at shell
  panes, all non-herdr commands. Fail-open when herdr is unreachable. Deny message
  re-prints the live roster. Escape: `SKIP_HERDRGUARD=1`.
- `.claude/settings.json` — registered the hook as the 3rd PreToolUse(Bash) guard.
- `AGENTS.md` — rewrote the cross-agent-messaging bullet: liveness check first,
  names the hook + the shell-execution failure mode.
- `project/status/working-agreements.md` — "Cross-agent messaging" section now
  leads with step 0 (`agent get` must resolve), documents the incident + the hook.
- `memory/herdr-send-needs-enter.md` (+ MEMORY.md line) — updated for the dead-pane
  failure mode and the `agent get` stderr/exit-0 trap.

## Landmines
- **CLI sharp edge (the bug in my own first draft):** `herdr agent get` prints its
  success payload to **stdout** but `agent_not_found` to **STDERR**, and exits
  **0 either way**. My first `resolve_agent` discarded stderr, so a dead pane read
  as "herdr unreachable" and fail-open waved it through — the guard silently missed
  the exact case it exists for. Fixed with `2>&1`; parse the JSON, never `$?`.
- The `[w1:p3 coordination]` message prefix the incident agent used is an ad-hoc
  convention — it appears nowhere in the repo, so the guard does NOT depend on it.
- Hook fires live without a session restart (confirmed end-to-end via a real
  `herdr agent send` to a dead pane).

## Next intended steps
1. None — self-contained fix, verified.

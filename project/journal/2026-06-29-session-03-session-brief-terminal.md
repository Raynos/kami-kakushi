# Session 03 — 2026-06-29 — session-brief reaches the terminal, not just context

**Summary:** The `SessionStart` hook's brief was injected into Claude's context only (stdout),
so the human never saw it unless they prompted. Updated `session-brief.sh` to emit the identical
brief on **both** streams — stdout (→ Claude's context) and stderr (→ the human's terminal) — so
the open queue is visible at session start without being asked.

## What changed
- `src/scripts/session-brief.sh` — refactored to accumulate the whole brief into a single `BRIEF`
  buffer (via an `add` helper), then `printf` it to stdout **and** stderr. Header comment updated to
  document the two-stream contract.

## Why
- Confirmed via the claude-code-guide: for `SessionStart`, plain stdout (and `additionalContext`)
  is context-only; **stderr** is the documented way to surface text to the human at the terminal.
  Emitting both keeps the agent's "lead with the brief" behavior AND makes it human-visible.

## Next intended steps
1. Unchanged: still blocked on the human for ⭐ H10 (Operating Model v2) + the tier reshape PRD application.

## Landmines
- Terminal display of stderr on exit 0 is the documented mechanism but may vary by Claude Code
  version — if it doesn't show, the fallback would be writing to `/dev/tty`. stdout/context path is
  unaffected either way.

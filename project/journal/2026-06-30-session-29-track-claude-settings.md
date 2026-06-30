# Session 29 — 2026-06-30 — track .claude/settings.json

**Summary:** At the human's request, stopped git-ignoring
`.claude/settings.json` so the Claude Code hook wiring (the `PreToolUse`
git-add guard + the `SessionStart` brief) and the `enabledPlugins` list are
version-controlled and shared on clone, instead of being recreated per machine.

## Why
The file was ignored as "local Claude Code config (plugins/permissions) — not
repo state", but it also held the **hook wiring** that AGENTS.md treats as a
project fixture ("wired in `.claude/settings.json`"). A fresh clone got the hook
*scripts* (`.claude/hooks/guard-git-add-all.sh`, `src/scripts/session-brief.sh`)
but not the wiring, so the hooks wouldn't fire until someone rebuilt the file by
hand. The human's call: commit it whole, plugins included — the shared plugin
set is desirable, not machine-private.

## What changed
- `.gitignore`: removed the `.claude/settings.json` line + its comment.
- `.claude/settings.json`: now tracked (first commit of the file).
- `project-status.md`: added a "Tracked Claude config" bullet to the live
  snapshot (checkpoint).

## Next intended steps
1. Resume the greenlit **v0.3.1 build** (`docs/plans/2026-06-30-v0.3.1-build.md`,
   Step 1 — DEV panel + variant-toggle infra).

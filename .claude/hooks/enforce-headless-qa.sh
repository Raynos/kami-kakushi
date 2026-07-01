#!/usr/bin/env bash
# PreToolUse guard — HEADLESS-ONLY game QA; block headed browser drivers.
#
# Why: the Playwright / Chrome-DevTools MCP browser tools open a VISIBLE browser
# window. This repo's game QA/playtesting is HEADLESS-ONLY — drive the game via the
# repo's headless harness instead (it's faster, reproducible, and doesn't steal
# focus). See docs/living/qa-playtesting.md → §0 "HEADLESS ONLY".
#
# Contract: this hook is wired (in .claude/settings.json) to the headed-browser MCP
# tool-name prefixes, so whenever one of those tools fires it simply denies (exit 2)
# with guidance. Running the dev server (npm run dev) is unaffected — only the
# headed-browser DRIVER tools are blocked.

set -euo pipefail

tool="$(jq -r '.tool_name // empty' 2>/dev/null || true)"

cat >&2 <<EOF
BLOCKED by .claude/hooks/enforce-headless-qa.sh: ${tool:-a headed-browser tool}

Game QA in this repo is HEADLESS-ONLY — a headed browser pops a visible window.
Drive the game headlessly instead:

    node src/scripts/qa-shots.mjs        # the headless screenshot gallery
    # or the capture-game-states skill
    # or window.__qa driven through a headless page

See docs/living/qa-playtesting.md → §0 "HEADLESS ONLY".
EOF
exit 2

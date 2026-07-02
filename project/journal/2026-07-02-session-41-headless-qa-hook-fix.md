# Session 41 — 2026-07-02 — headless-QA hook was silently never firing

**Summary:** A human report ("another agent said the hooks are not enabled")
turned out to be a **matcher bug** in the native Claude-Code `PreToolUse` hook,
not a git-hook / trust / session-load problem. The headed-browser guard
(`enforce-headless-qa.sh`) had a **bare-prefix** matcher that Claude Code —
which matches the matcher regex against the *full, anchored* tool name — never
matched, so Playwright / chrome-devtools tools popped a visible window unguarded.
Fixed by appending `.*` to each matcher alternative; verified live.

## What changed
- `.claude/settings.json` — the `PreToolUse` matcher for the headed-browser
  guard went from the bare prefix
  `mcp__playwright__browser_|mcp__plugin_chrome-devtools-mcp_chrome-devtools__`
  to `mcp__playwright__browser_.*|mcp__plugin_chrome-devtools-mcp_chrome-devtools__.*`.
  Committed as `7dd1c80` (SKIP_JOURNAL — this entry backfills it).

## How it was diagnosed (verify-don't-trust, empirically)
1. Confirmed git hooks are fine (`core.hooksPath=.githooks`, all three present).
2. Confirmed the QA hook *script* works (fed it a payload by hand → `exit 2`).
3. Confirmed native Claude hooks fire this session: `git add -A --dry-run` was
   **blocked** by the `Bash` guard (`guard-git-add-all.sh`) — so the mechanism,
   trust, and session-load were all fine.
4. Contrast isolated the cause: exact-name matcher `"Bash"` fires; bare-prefix
   MCP matcher does not → Claude Code anchors the matcher against the full tool
   name (matches the documented `Notebook.*` convention needing an explicit
   `.*`). Post-fix, `browser_close` was blocked → **fix confirmed live**, and it
   took effect **mid-session** (no restart needed).

## Landmines
- **Matcher gotcha (reusable):** a Claude-Code hook `matcher` is a **full,
  anchored** regex over the tool name — a bare prefix like `mcp__server__foo_`
  will NOT match `mcp__server__foo_bar`. Always suffix `.*` for prefix matches.
- Not hookify-worthy: native hooks work; hookify would only add a dependency.
- A headed browser window was popped during diagnosis (before the fix bit) and
  the now-working hook blocks closing it via Playwright — close it manually; it
  also dies with the MCP server.

## Next intended steps
- None required; the fix is self-contained. Next agent inherits a working
  headless-QA guard (drive the game via `node src/scripts/qa-shots.mjs` /
  `window.__qa`, never a headed browser).

# Session 151 — one dev server: guard against rival spawns / kills

**When:** 2026-07-10
**Model:** Claude Opus 4.8

## Why

The human's dev server kept dying: concurrent agents were spawning their own
private Vite server (or killing the running one) instead of reusing the shared
dev server in the herdr playtest pane on `:5173`.

## Root cause

`vite.config.ts` already had a `singleServerGuard` that refuses to start a
second server on `:5173`. **But its error message literally said `kill <pid>`** —
so an agent that wanted to observe the game ran `pnpm run dev`, hit the guard,
dutifully killed the shared server, and spawned its own. The guard's own advice
was the footgun.

## What changed

- **New `.claude/hooks/guard-dev-server.sh`** PreToolUse(Bash) gate (highest
  sound rung, per the quality-rung philosophy). While `:5173` is held it:
  - **BLOCKS** starting a rival server — `pnpm|npm|yarn|bun (run) dev`, bare/npx
    `vite`, `vite serve`, `vite --port …` (but never `vite build`/`preview`/
    `vitest`, which all load the config legitimately).
  - **BLOCKS** killing the holder — `pkill/killall …vite`, `kill <holder-pid>`,
    any `kill` naming `:5173` / `lsof -ti :5173 | xargs kill`.
  - When `:5173` is free it WARNS (nudge to the herdr pane) but allows.
  - Escapes: `KAMI_ALLOW_MULTI_DEV=1` (throwaway server on another port),
    `SKIP_DEVGUARD=1` (bypass the hook). lsof is only called for
    dev-server-shaped commands, so the per-Bash cost is nil otherwise.
  - Wired into `.claude/settings.json` alongside the other Bash guards.
  - Tested against a 24-case matrix (starts / kills / benign) with the real
    herdr server live on `:5173` — all correct.
- **Fixed the vite `singleServerGuard` message** (`vite.config.ts`) — no longer
  instructs `kill <pid>`; tells the agent to reuse the pane and ask the human if
  it's truly dead.
- **Docs:** AGENTS.md gains an always-loaded "One dev server — REUSE the herdr
  pane's" bullet in the shared-tree family; `qa-playtesting.md` §0 + §7 Tooling
  updated (the old "`pnpm run dev` is fine" line was the doc-level footgun).

## Next

None — self-contained. The hook + the reworded guard + the docs close the loop.

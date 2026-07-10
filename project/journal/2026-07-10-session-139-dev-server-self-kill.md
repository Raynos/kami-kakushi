# Session 139 — 2026-07-10 — the dev server stops killing itself, and stops reloading the game

**Summary:** The human's playtest capture started saving a `.md` to their Downloads
folder instead of reaching the inbox. That was a *symptom*: the DEV server had
exited, so the capture POST failed and the overlay's silent download-fallback
fired. Root cause was the single-dev-server guard mistaking the server's **own
pid** for a rival during vite's in-process restart. Fixed that, replaced the
silent download with an honest error dialog, and — on the human's follow-up —
closed vite's *second* reload path (`server.hmr: false`), which had been
reloading the human's live game session every time an agent edited a config
dependency.

## The bug chain

1. `vite.config.ts` imports `src/scripts/playtest-inbox.ts` and
   `src/scripts/telemetry-drop.ts`, so both are **vite config dependencies**.
2. An agent edits `telemetry-drop.ts` → vite restarts **in-process**
   (`restartServer()` re-execs the config via `_createServer()` and only *then*
   calls `server.close()`).
3. So while the guard runs, `:5173` is **still listening — held by our own pid**.
   The guard read that as "a dev server is already running", printed
   `kill <its own pid>`, and `process.exit(1)`'d. The server killed itself.
4. No dev server ⇒ the capture POST to `/__playtest-capture` fails ⇒
   `capture.ts` silently downloaded `<session>-entry.md` and toasted
   "inbox unreachable". A file in `~/Downloads` reads as *captured* while the
   inbox stays empty — the note quietly dies there.

## What changed

- `vite.config.ts` — **two independent fixes**:
  - `singleServerGuard()` now filters its **own pid** out of the `lsof` holder
    list before refusing. A restart is not a rival. (This edit was authored
    here but got **swept into `89c5624`** by the telemetry agent — see Landmines.)
  - `server.hmr: false` — closes vite's **second** reload path. F75's
    `handleHotUpdate → []` plugin only suppresses `full-reload` on a *file
    change*; on a **server restart** the HMR client's socket drops and
    `@vite/client` calls `location.reload()` on reconnect. That is what was
    yanking the human's live game session (TST2). The 2026-07-05 note claiming
    `hmr:false` served STALE modules was **stale itself** — that was a missing
    watcher, and `watch.usePolling` (added since) keeps re-transform alive.
- `src/ui/capture.ts` — the failed-POST path no longer auto-downloads. It opens
  an **error dialog** ("✗ Capture not saved") that holds the entry in memory and
  offers **Retry** (re-POSTs the *same* payload), **Copy note**, **Save .md**
  (explicit escape hatch, never automatic) and **Discard**. Esc discards; the
  capture hotkey is inert beneath it. Also probes for `navigator.clipboard`
  before promising a copy — optional chaining alone `await undefined`s and would
  falsely report success.
- `src/ui/capture.test.ts` — replaced the "falls back to a file download" test
  with five: dialog opens + **downloads nothing**, Retry re-sends the held entry
  and closes, Retry-while-down keeps the note, Save `.md` is opt-in, Esc discards.
- `src/scripts/dev-server-config.test.ts` — **new**. Asserts `server.hmr === false`
  *and* `watch.usePolling === true`; the two are a pair (drop the watcher and the
  stale-module regression that got `hmr:false` reverted in 2026-07-05 returns).

## How it was verified (PH3 — none of this is a declared green)

- **Guard, A/B in an isolated `git worktree`** (detached at HEAD, `DEV_PORT`
  retargeted to `:5199` so the human's `:5173` was never touched), triggering a
  restart by editing a config dep:
  - pre-fix guard (`89c5624^`) → `✗ A dev server is already running on :5199
    (pid 96837)` where **96837 was its own pid** → **DEAD**. Reproduces the
    human's screenshot exactly.
  - fixed guard → `server restarted.`, same pid, still listening. **ALIVE**.
  - a *genuine* second server is still refused (exit 1) — the fix doesn't
    disable the guard.
- **HMR reload, A/B** with a real headless page open and a sentinel planted on
  `window`: HEAD (HMR on) ⇒ **1 reload, session destroyed**; `hmr:false` ⇒
  **0 reloads, session survives**. A module re-fetched after an edit carried the
  new code, so a manual F5 still serves fresh.
- **The dialog, headless end-to-end** against a real dev server: server up ⇒
  toast `captured → inbox`, file lands, **0 downloads**; server killed ⇒ dialog
  opens, **0 downloads**; Retry while down ⇒ dialog stays, status reads
  `Still unreachable — is 'pnpm run dev' up?`.
- **RED-proofs:** re-introducing the auto-download fails 4 capture tests;
  removing `hmr: false` fails the new config test.

## Landmines

- **`89c5624` swept an uncommitted edit.** The telemetry agent committed
  `vite.config.ts` by pathspec at 12:01:48 while this session's guard fix sat
  uncommitted in the shared working tree — so the guard fix landed inside
  *their* commit, unattributed. This is exactly the `0e10d96` hazard in
  AGENTS.md. Nothing to undo (the fix is correct and green), but it is why the
  first attempt to "reproduce the bug at HEAD" failed: HEAD *already had the fix*.
  Re-check `git diff --cached --name-only` before every commit in this tree.
- **One last reload.** A browser tab opened *before* `hmr:false` landed still has
  a live HMR client; it will `location.reload()` once when the server next
  restarts, and after that the freshly-loaded page has no client and stays put.
- `hmr: false` and `watch.usePolling` are load-bearing **together**. Removing the
  watcher brings back stale modules; the new test guards both.

## Next intended steps

1. Nothing blocking. If a future vite upgrade changes `restartServer()` ordering
   (close-then-create instead of create-then-close), the self-pid filter becomes
   a harmless no-op rather than a regression.

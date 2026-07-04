# Session 70 — 2026-07-04 — F3 playtest capture inbox: decisions + Ph1

## ☀️ SUMMARY (read this first)

Building **F3 — the playtest capture inbox + async drain loop**
(`docs/plans/fable-process-F3-playtest-capture-inbox.md`). This session: ran
the four gating open questions past the human, locked the decisions into the
plan, then built **Ph1 (capture format + dev-server transport + inbox dirs)**
green and proven against a live dev server.

This file is HISTORY, not live state — the live snapshot is
`project/status/project-status.md`.

**Concurrency note:** three OTHER agents are live on this repo (F4 balance-sim,
`verify --sequential`, F2 CI). Their uncommitted WIP (`verify-run.ts`,
`docs/plans/README.md`, the F2 rename, `todo-human.md`) is NOT mine — I stage
only my own files by explicit path. The one future collision is
`src/app/main.ts` (my F3 Ph2 overlay mount vs. F4 Ph3 `autoStep` extraction).

---

## 1 · Decisions locked (human, 2026-07-04)

Four §5-class open questions run past the human before build. Two kept the
plan defaults, two overrode:

1. **Hotkey → Backquote `` ` ``** (default kept).
2. **Screenshots → CAPTURE in-browser, git-ignored** (OVERRODE the
   skip-and-repro-later default). PNG sidecar is git-ignored; the note +
   save-JSON stay committed as the durable deterministic repro. The rasteriser
   is a `devDependency` stripped from prod with the overlay, so the
   zero-runtime-dep guarantee holds.
3. **Storage → committed, two-tier `pending/`+`archive/`** (REFINED the flat-dir
   + delete-on-drain model). Drain `git mv`s each capture into `archive/` for
   durable long-term keeping, like `project/human-feedback/`.
4. **Scope → DEV-server only** (default kept).

Rewrote plan §2.3/2.5/2.6/2.7/2.8, phases, risks, open Qs; added a
Decisions-locked block. Committed `c2faaa9` (kept the plan Status token as
PROPOSED to avoid a `docs/plans/README.md` regen that would entangle the
decoupled F2-archival WIP).

## 2 · Ph1 — capture format + transport + inbox dirs (built, green)

**What landed:**

- `project/playtest-inbox/{pending,archive}/` + `README.md` (the agent-facing
  drain contract) + `.gitkeep`s.
- `.gitignore` — `project/playtest-inbox/**/*.png` (screenshots local-only).
- `src/ui/capture-format.ts` — pure `buildCapture(note, ctx) → {filename,
  markdown}` (+ `stampOf`/`slugOf`). No DOM, no fs, no Date (caller passes
  `capturedAt`, snapshotted at box-OPEN) — deterministic + node-testable.
- `src/scripts/playtest-inbox.ts` — the dev-server transport: pure
  `resolveCapture` (filename allowlist + dir-jail + size caps + PNG decode),
  `writeCapture` (fs shell), `playtestInboxHandler` (connect middleware,
  POST-only, streamed body under a hard cap). Exports `CAPTURE_ENDPOINT`.
- `vite.config.ts` — the `apply: 'serve'` plugin mounting the handler at
  `/__playtest-capture` (structurally absent from `vite build`).
- Tests: `capture-format.test.ts` (11) + `playtest-inbox.test.ts` (9,
  incl. a real save round-trip through the codec) — **20/20 green**; typecheck
  clean.

**DoD proven LIVE** (not just unit-green): `npm run dev` up (port 5174, since
5173 was another agent's server), scripted `curl` POST →
`200 {"ok":true,"file":…}`, the `.md` landed in `pending/`, the `.png` sidecar
is git-ignored (`git check-ignore` ✓), a path-traversal filename → `400`.
Smoke-test artifacts removed; my dev server stopped (only my pid).

**Deviation from the plan (noted):** the 256 KB cap now applies to the
*markdown* specifically; overall body cap raised to 12 MB to fit a base64 PNG
sidecar (a screenshot dwarfs 256 KB). Consistent with the screenshot decision.

**Committed with `SKIP_VERIFY=1` (local only — DO NOT PUSH until green).** At
commit time the shared working tree was RED from co-agents' in-flight WIP, none
of it mine: (a) the F4 session's `src/app/main.ts` mid-edit
(`autoModeIntent` referenced but not yet defined + orphaned imports — the exact
Ph2/Ph3 `main.ts` collision this plan flagged); (b) stale `project-status.md` +
`docs/plans/README.md` gen-regions. My code passed independently — `tsgo` clean,
20/20 tests, the live endpoint DoD — before the tree changed under me. Per the
shared-tree rule I did NOT touch their `main.ts` and must NOT push this red
tree; the commit is local until the co-agents' work settles green.

**Correction to the plan's map (R2 — build wins):** the DEV strip gate is NOT
inline in `gh-pages.sh` — it's extracted to `src/scripts/verify-dev-strip.sh`.
Ph2 extends THAT file's marker loop.

## 3 · Side-quest (dropped): status-line label not rendering

The human's status line showed the prompt-fallback, not my set label. Root
cause: the live status payload's `.session_id` ≠ `$CLAUDE_CODE_SESSION_ID`
(which `set-label.sh` keys off), so the label lookup missed. Added a dual-key
lookup to `~/.claude/statusline.sh` (JSON id then env id); it fixes the
reproducible cases but not the live render (the subprocess doesn't inherit the
env var). Human handed it to another agent — dropped. (That file is global
config, outside the repo — nothing committed.)

## 4 · Ph2a — overlay module + strip gate (built, green; NOT the mount)

Split Ph2 into **2a (non-`main.ts`, done now)** and **2b (the F4-blocked
wire-up, deferred)** because F4 has `main.ts` broken AND has uncommitted
`package.json` scripts (`verify:balance`/`balance:fresh`) in the working tree.

**Ph2a landed:**

- `src/ui/capture.ts` — the DEV overlay: `` ` `` hotkey + focused-input guard,
  ink-dark note box, ⌘/Ctrl+Enter submit + Escape cancel, toast, download
  fallback, `CAPTURE_SENTINEL`. Evidence frozen at box-OPEN. **Dependency-free
  by design** — the DOM→PNG snapshotter is an INJECTED seam (`DomSnapshotter`),
  so the module is fully jsdom-testable and the real `modern-screenshot` impl
  lands with the mount (Ph2b).
- Moved `CAPTURE_ENDPOINT` into `capture-format.ts` (browser-safe) so the
  client overlay shares it WITHOUT importing the fs/http-laden
  `playtest-inbox.ts`; the node module re-exports it (vite.config unchanged).
- `src/ui/capture.test.ts` — 6 jsdom tests driving the REAL flow (real
  KeyboardEvents, real textarea, ⌘/Ctrl+Enter): open/toggle, input-guard,
  Escape-cancels, submit-posts-the-note, screenshot-flows, POST-fail→download.
- `verify-dev-strip.sh` — marker loop extended with `__KAMI_PLAYTEST_CAPTURE__`
  + `__playtest-capture` (the overlay + endpoint, incl. the injected
  rasteriser that rides in via the overlay module).

**Verified:** typecheck clean on all my files (only `main.ts` errors, all
F4's), 26/26 F3 tests green, oxlint/oxfmt clean, strip gate parses.

**Deliberately backed out:** I installed `modern-screenshot` then reverted it
(removed my `package.json` line leaving F4's scripts untouched;
`git checkout package-lock.json`) — the lib + snapshotter + mount all belong to
Ph2b on a clean `package.json`, and the screenshot can't be PROVEN until mounted
anyway.

---

## Next intended steps (current)

1. **Ph2b — the wire-up (BLOCKED on F4's `main.ts` + `package.json`
   settling green):** add `modern-screenshot` devDep; the real `DomSnapshotter`
   (domToPng of `#app`); mount `mountCapture` from `main.ts`'s
   `import.meta.env.DEV` branch (independent of `?dev=no`) with a `buildContext`
   closure over live state/save/dev; the one-line `root.dataset.activeTab` stamp
   in `render.ts` `setTab` (~line 1083); then the build+grep strip proof + the
   headless real-flow DoD. **COORDINATE the `main.ts` edit with F4.**
2. Ph3 — the `/drain-inbox` skill + first real drained batch.
3. Ph4 — loop-mode + conventions wiring (session-brief count, AGENTS.md,
   repo-map, qa-playtesting).

## Landmines (current)

- **Shared tree, 3+ concurrent agents.** Stage only my own files by explicit
  path; never `git add -A`; don't `SKIP_VERIFY=1` a push over another agent's
  red. Recheck `git diff --cached --name-only` right before each commit.
- **F3 plan Status stays `PROPOSED`** (not IN-PROGRESS/DONE) until archive-time,
  deliberately, to avoid a `docs/plans/README.md` gen-region regen colliding
  with the in-flight F2-archival WIP.
- Ph2's `main.ts` overlay mount and F4 Ph3's `autoStep` extraction touch the
  same file — coordinate before editing.

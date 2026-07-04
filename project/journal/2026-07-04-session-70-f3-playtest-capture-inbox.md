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

## 5 · Ph2b — the wire-up (built, green, DoD proven live)

Coordinated via herdr: read the F4 session (`w1:p1`, Fable-5, on its Ph4) —
confirmed its `main.ts` `autoModeIntent` extraction was DONE + committed (my
mount won't collide) and its `package.json` scripts had landed (so my devDep
isolates cleanly). Then built the wire-up:

- `src/ui/capture-screenshot.ts` — the real `DomSnapshotter` (`domToPng` of the
  `#app` root; null on failure — a shot never breaks a capture). Own module so
  `capture.ts` stays dependency-free.
- `package.json` — `modern-screenshot@4.7.0` **devDependency** (chosen over
  html-to-image: smaller, newer, better CSS fidelity).
- `src/app/main.ts` — mount `mountCapture` in the `import.meta.env.DEV` branch,
  OUTSIDE `if (dev)` so `?dev=no` still captures (F2). `buildContext` closes
  over live `state`/`save`/`dev`: build stamp, seed, clock, location, rung,
  tier, `root.dataset.activeTab`, non-default variants, viewport, url, the
  base64 save, last-20 log tail.
- `src/ui/render.ts` — one-line `root.dataset.activeTab = tab` stamp in
  `setTab`.

**Verified — the two Ph2 DoDs, for real:**

- **Strip proof:** `npm run build` + `verify-dev-strip.sh` + a grep — the
  overlay, the `__playtest-capture` endpoint, AND all `modern-screenshot`/
  `domToPng`/`foreignObject` code are ABSENT from `dist/`. The prod
  zero-runtime-dep guarantee holds (the lib tree-shakes out; DEV-only).
- **Headless real-flow:** a real Playwright browser pressed `` ` ``, typed,
  Ctrl+Enter — a well-formed `.md` (real build SHA, seed, location `kura`,
  viewport, `?dev=no` url) + a genuine 721 KB PNG landed in `pending/`, on BOTH
  the default URL and `?dev=no`. Artifacts cleaned; dev server stopped.

Typecheck clean (whole project), 26/26 F3 tests. **F3 Ph2 is COMPLETE.**

Ph1 + Ph2 pushed to origin during a collective-green window (pre-push gate
green, 15 gates).

## 6 · Ph3 — the /drain-inbox skill + the first REAL drained capture

- `.claude/skills/drain-inbox/SKILL.md` — the drain loop (§2.7): stand-down
  check → read `pending/` oldest-first (empty ⇒ fast no-op) → intake-commit →
  reproduce from the embedded save (headless) → triage (bug fix · taste →
  R-item · design → H-item) → log the Fnn → `git mv` to `archive/` → one commit
  per item → `/loop` guidance. User-invoked (`disable-model-invocation`).
- **First real drained capture (the DoD, done honestly):** drove the live
  overlay headlessly at the cold open and captured a GENUINE observation — the
  "Open your eyes" button is `opacity: 0` for ~8 s (through the intro), so the
  player first sees a title card with no visible way to begin. Drained it:
  - **Intake commit** `e35b9c1` (raw capture durable before processing).
  - **Reproduced + verified (R2):** tracked the button's computed opacity —
    0 at 500/1500/3000/5000 ms → 1 at ~8000 ms; present + styled the whole
    time, just transparent. Symptom real.
  - **Triaged as TASTE, not a bug** (the button DOES appear; the reveal is
    intentional, F86): logged **F118 💬** in a new
    `project/human-feedback/2026-07-04-playtest.md` (async-inbox source) and
    routed it to **R9** in `review.md` — the human's cold-open pacing call.
    Did NOT invent the taste or fake a fix (R3/R4).
  - **Archived:** `git mv` pending → `archive/` (the `.png` rode along,
    git-ignored). `pending/` empty.

Full round-trip in git history: intake commit + the drain commit (F118 +
archive move + R9). This honestly exercises the surface-to-human drain path.

---

## 7 · Ph4 — conventions wiring (the loop is discoverable)

- `src/scripts/session-brief.sh` — an agent-facing "📥 Playtest inbox: N
  capture(s) waiting" line (counts `pending/*.md`; **silent at zero**, no
  busywork nudge).
- `AGENTS.md` — a Conventions bullet (capture in-game → `pending/`, drain with
  `/drain-inbox`, completion = archive move; agent-facing).
- `repo-map.md` — the `project/playtest-inbox/` dir entry.
- `docs/living/qa-playtesting.md` — a "Capture (the playtest inbox)" subsection
  under §1 (the overlay is part of the QA harness).

**F3 is COMPLETE** — all four phases built, verified, and the loop is live end
to end (capture in-game → drain async → F-entry → archive).

---

## Next intended steps (current)

1. Push the Ph3/Ph4 commits at the next collective-green window.
2. Mark the F3 plan DONE + graduate it to `project/archive/` (mind the
   `docs/plans/README.md` gen-region — regenerate via `npm run checkpoint`).

## Landmines (current)

- **Shared tree, 3+ concurrent agents.** Stage only my own files by explicit
  path; never `git add -A`; don't `SKIP_VERIFY=1` a push over another agent's
  red. Recheck `git diff --cached --name-only` right before each commit.
- **F3 plan Status stays `PROPOSED`** (not IN-PROGRESS/DONE) until archive-time,
  deliberately, to avoid a `docs/plans/README.md` gen-region regen colliding
  with the in-flight F2-archival WIP.
- Ph2's `main.ts` overlay mount and F4 Ph3's `autoStep` extraction touch the
  same file — coordinate before editing.

## 8 · Correction — removed the bootstrap F118 / R9 (human, 2026-07-04)

The Ph3 "first drained capture" was an **agent-manufactured bootstrap** (I drove
the overlay myself to prove the loop), so F118 + R9 were *my* observation, not
the human's. On review the human called the ~8s cold-open reveal fine / intended
and asked to delete it. Removed: **R9** from `review.md`, the **F118** feedback
file, and the archived capture (`.md` + `.png`). The `/drain-inbox` skill + the
capture/drain loop itself stay — only the manufactured test *content* was
pulled. (Intake `e35b9c1` / drain `3b624b4` remain in history — append-only.)
**Note for future drains:** an agent-produced bootstrap capture should NOT file
a human-facing R-item; route it to a plain note or skip the R-item.

## 9 · Storage redesign — one session file, not one file per capture (human, 2026-07-04)

Human steer (D-022): all captures from a game session should land in **one**
`.md`, appended, with a sibling **screenshots folder** of the same name — not a
file per comment. Rebuilt the storage model:

- **`capture-format.ts`** — split `buildCapture` into `buildSessionHeader` (once)
  + `buildEntry` (per capture, a `##` block); added `mintSessionId` /
  `sessionFilename`. `build` moved from per-entry to session-level.
- **`playtest-inbox.ts`** — the endpoint now takes `{session, header, entry,
  screenshotName?, screenshot?}` and **creates-with-header or appends** to
  `pending/<session>.md`; screenshots write into `pending/<session>/`.
- **`capture.ts`** — mints a **sessionStorage-backed** session id (survives a
  reload within the tab; a fresh tab = new session), builds the header once,
  POSTs an entry per capture.
- **`main.ts`** — passes `build` as a top-level mount option.
- Docs (README, drain-inbox skill, AGENTS.md, qa-playtesting) updated to the
  session-file model; drain now iterates `##` entries and archives a session file
  once every entry is drained (+ `mv`s its screenshot folder).

**Verified:** typecheck clean, 20/20 tests (incl. a create-then-append + a
two-captures-share-one-session test), prod strip proof green, and a **live e2e**
— two captures in one page load produced ONE `.md` (header once + 2 entries) and
ONE folder with 2 screenshots. `git-ignore` `**/*.png` already covers the
folders (no gitignore change).

**Session = browser-tab sitting** (sessionStorage) — noted for the human; easy
to switch to per-page-load if they meant that instead.

## 10 · Spin-off — single-dev-server guard (human, 2026-07-04)

The concurrent-agent sprawl left 3+ `vite` servers cascading 5173→5174→5175.
Human asked for a sanity guard so only ONE runs. Added to `vite.config.ts` (kept
out of the co-agent-dirty `package.json`): a `singleServerGuard()` preflight that,
for `command === 'serve'` only (skipped for `build`/`preview`/vitest via a
`VITEST` check — so it never blocks the verify gate), greps `lsof` for a listener
on `DEV_PORT` (5173) and, if found, prints a friendly message (holder pid + how
to kill it + `KAMI_ALLOW_MULTI_DEV=1` bypass) and `process.exit(1)`. Plus
`server: { port: 5173, strictPort: true }` as the race backstop (vite won't
cascade). Verified: a 2nd `npm run dev` is refused with the message; vitest +
build unaffected; one server on 5173 in the herdr dev-server workspace (w5).

## 11 · Element-pick targeting (human, 2026-07-05)

The plan had NOTHING about targeting the specific UI element being critiqued —
captures were whole-moment only. Added **pick mode**: `` ` `` → hover-highlights
the element under the cursor → **click LOCKS it** → the note box opens; the entry
gains an `**Element:**` line (semantic label preferring `data-panel`/`data-node`/
button text, + a CSS-ish selector + on-screen rect), and the **full-page
screenshot is taken with the highlight still on** (human call: keep the whole
page, box the element). Click empty / Esc → a general whole-page note (nothing
lost).

- `capture-format.ts` — `ElementDescriptor` type + `CaptureContext.element?`;
  `buildEntry` renders the `**Element:**` line.
- `capture.ts` — pick machinery (hover-highlight as a `host` child so it rides
  into the domToPng shot; `describeElement` + `cssPath`).
- Tests: element rendering (format) + jsdom pick flow (element vs general).

**Bug the human hit + fixed same-turn:** on a **hover-effect element** (the rung
meter, whose tooltip pops on hover and whose fill re-renders each tick), a
`click` never fired — the element detaches/target-changes between mousedown and
mouseup. Switched the pick to fire on **`mousedown`** (press), + a one-shot
swallow of the follow-up `click` so the game never acts on it. Verified live:
mousedown pick opens the box + records the element; strip proof still green;
24/24 tests. (Note: `set-label.sh` now needs a 2nd ≤12-char tag arg — CLAUDE.md
update this turn.)

## 12 · Vite: watch + re-transform, no auto-reload (human, 2026-07-05)

Debugging the meter-pick bug surfaced a bigger DX problem: **the dev server was
serving STALE code** — `hmr: false` (F75) meant edits weren't re-transformed
until a manual server restart, so both the human (still on old code) and my
debugging were stuck. Human's diagnosis was exactly right: keep no-auto-refresh
but restore watch+rebuild. Fix in `vite.config.ts`:

- `server.watch: { usePolling: true, interval: 250 }` — native fs events weren't
  reaching vite in this env; polling makes the watcher detect changes (proven:
  an edited module re-transforms on the next request, no restart).
- a `kami-no-auto-reload` plugin with `handleHotUpdate: () => []` — the module
  graph still invalidates (F5 = fresh) but NO update/full-reload is sent to the
  browser, so a live playtest is never yanked (F75 preserved). Removed the old
  `hmr: false`.

Verified both: a marker export appears without restart (watch), AND an open
page's `window` flag survives a file edit (no reload).

(Debug lesson: a *comment* marker is useless for testing this — esbuild strips
comments on transform; use a real `export const`.)

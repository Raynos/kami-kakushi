# Playtest capture inbox + async drain loop (build plan)

**Status:** 📋 PROPOSED — awaiting human read
**created_date:** 2026-07-03
**Owns:** the DEV-only in-game capture overlay · the dev-server → repo
transport · `project/playtest-inbox/` and its lifecycle · the
`/drain-inbox` skill · the strip-gate extension for the new DEV surface.
**Composes with (does NOT own):** the F-log metabolization loop
(`project/human-feedback/*-playtest.md`, F1–F117 to date) · the
`capture-game-states` skill + `qa-playtesting.md` harness (headless repro) ·
the D-075 variant harness (`src/ui/dev.ts`) · the save codec
(`src/persistence/codec.ts`) · session-brief surfacing.

## Who builds this — Fable or Opus?

**Confidence: ( 80% Opus, 20% Fable )** — the 20%: the drain-skill triage
wording shapes every future taste call it routes; Fable eyes there.

**Build: Opus 4.8 is sufficient. Running drains: either — Fable preferred
when captures need taste triage.** The build phases are well-specified
engineering with mechanical DoDs: a DEV-only overlay (not a player-facing
surface, so the woodblock taste bar and the D-075 diverge mandate don't
apply), a dev-middleware endpoint, a skill file. The judgment lives at
DRAIN time, and the skill routes it safely by design — mechanical bugs are
fixed by rule, unsettled taste goes to R-items/diverge, design forks go to
H-items — so an Opus-run drain cannot silently decide taste. Fable-run
drains simply produce better first-pass fixes on ambiguous taste captures.

---

## 0 · Problem & shape

Human playtest feedback is the project's highest-ROI signal (F1–F115 captured
and mostly fixed same-day on 2026-07-02), but its transport is synchronous:
the human types prose into the chat and waits. This plan makes capture
**instant in-game** (hotkey → note → vanish, < 5 s, reproduction context
auto-attached) and metabolization **fully async** (the agent drains a repo
inbox later, continuing the established Fnn → fix → graduate-to-living-docs
loop). The human plays whenever; the agent drains whenever. Nobody waits.

The moment is deterministically reproducible by construction: `GameState`
carries the seeded RNG (seed + per-stream cursors), the clock, the location,
and the log ring — so one save-export string **is** the full repro context
(qa-playtesting.md §0: "a fixed (seed, intent-script) reproduces
byte-identically").

## 1 · What exists to reuse (cited)

- **Save export, synchronous.** `save.exportState(state)` returns a base64
  JSON envelope (`src/persistence/codec.ts` — `{app, schemaVersion,
  saveCounter, savedAt, state}`); `__qa.load(b64)` round-trips it through the
  migration chain (`src/app/main.ts:453`). State embeds `rng`, `clock`,
  `location`, `log` (ring ≤ 300, `LOG_RING_MAX`), `unlocked`.
- **Build identity.** `__VERSION__` / `__BUILD_SHA__` / `__BUILD_DATE__`
  defines (`vite.config.ts:45-50`) — checkout-able repro anchor.
- **Variant IDs.** `createDevApi()` (`src/ui/dev.ts:248`) — `SURFACES`
  registry; non-default picks mirrored to URL params (F18); `getVariant(s)`.
- **DEV strip teeth.** `src/scripts/gh-pages.sh` step 1b greps
  `dist/assets/*.js` for `__qa` and `__KAMI_DEV_PANEL__` and refuses to
  deploy a leak — the pattern this plan extends.
- **Headless drive.** Playwright headless + `window.__qa`
  (`src/scripts/playtest.mjs`, `qa-shots.mjs`, the `capture-game-states`
  skill); headed browsers are hook-blocked
  (`.claude/hooks/enforce-headless-qa.sh`).
- **The F-log.** `project/human-feedback/2026-07-02-playtest.md` — per-item
  template (Verbatim / Reading / Fix plan / Doc-update plan / Distilled rule /
  Fixed in), status legend 🔲🔧✅🅿️💬, taste graduates to
  `docs/living/ui-design.md` / `fun-factor.md` / `decisions.md`. Highest
  number today: **F117**.
- **Gates that touch this plan.** `.githooks/pre-commit`: reading-queue gate
  matches only `docs/plans/`, `project/brainstorms/`,
  `project/audit/reports/` — `project/playtest-inbox/` is invisible to it
  (correct: agent-facing); journal gate applies to every drain commit.
- **Keyboard surface.** The game binds only `Escape` + a `Tab` focus-trap in
  the settings modal (`src/ui/render.ts:333-351`). No character hotkeys —
  the field is open.

## 2 · Design

### 2.1 Capture UX — hotkey, note box, submit-and-vanish

- **Hotkey: `` ` `` (Backquote) toggles the capture box.** Free in the game
  (only Escape/Tab are bound), no browser default, one keystroke on macOS
  (F-keys need Fn). Guard: ignore when `e.target` is an
  input/textarea/select/contentEditable (the save-import textarea, the note
  box itself). The binding is a single top-of-file constant for a one-line
  human override.
- **The box:** a small fixed overlay (ink-dark, matching the DEV panel
  palette — F1's no-white-chrome rule), one auto-focused `<textarea>`, a
  hint line "⌘/Ctrl+Enter send · Esc cancel". No buttons to hunt.
- **Submit = ⌘/Ctrl+Enter** (plain Enter keeps newlines for multi-line
  notes). **Escape cancels.** On submit: POST, unmount, and flash a ~1.5 s
  toast ("captured → inbox"). Target flow: `` ` `` → type → ⌘Enter, < 5 s,
  game never pauses.
- **Context is snapshotted at OPEN, not submit** — the hotkey press marks
  *the moment you saw it*; typing time doesn't drift the evidence (the
  active-only sim keeps running).
- **Mounted from the `import.meta.env.DEV` branch of `main.ts`,
  independent of `?dev=no`** — the human's true-layout preview mode (F2)
  keeps capture; the overlay is invisible until hotkeyed, so it can't
  distort the layout it exists to critique.
- Renderer-side only; `src/core` is untouched (pure-core boundary).

### 2.2 Auto-attached context

Captured by a thunk built in `main.ts` (which already closes over `state`,
`save`, `dev`):

- **Full state snapshot:** `save.exportState(state)` — this alone carries
  RNG seed + cursors, clock (day/tick), location, resources, unlocked, and
  the full log ring.
- **Human-readable frontmatter duplicates the at-a-glance bits** (so the
  drain agent triages without decoding base64): seed (`state.rng.seed`),
  day/tick, location, rung/tier, build `v<version> (<sha>, <date>)`.
- **Active variant IDs:** non-default `dev.getVariant(s)` per `SURFACES`
  (empty under `?dev=no` — noted as `defaults`).
- **Current tab:** `render.ts` stamps `root.dataset.activeTab` on tab switch
  (one line in the existing `selectTab`; also useful to `qa-shots.mjs`);
  the capture reads the DOM attribute — no render-API change.
- **Last ~20 log lines** as plain text (`state.log.entries.slice(-20)`,
  `[channel] speaker: text ×N`) — redundant with the snapshot, but makes the
  capture skimmable in the inbox file itself.
- **Viewport:** `innerWidth×innerHeight @devicePixelRatio` (layout
  complaints are viewport-shaped — F117's column-balance class of feedback).
- **The page URL** (carries variant params + `?dev=no` verbatim).

### 2.3 Screenshots — **skip them (default)**

No in-browser screenshot at capture time. Justification:

- The UI is **DOM-rendered, not canvas** — an in-browser shot needs a heavy
  imperfect dependency (html2canvas); the game ships zero runtime deps today.
- State + seed + variants + viewport make the moment **deterministically
  reproducible**: the drain loop loads the save into the existing headless
  harness, resizes to the captured viewport, applies the variant params, and
  takes a *pixel-perfect* screenshot then — strictly better than a lossy one
  now.
- The known loss — truly transient render-only glitches (a mid-animation
  frame) — is accepted: those get a 💬 F-entry asking for a repro hint. If
  this bites repeatedly, revisit (risk §4.7); don't pre-pay the dependency.

### 2.4 Transport — Vite dev-middleware POST (primary)

**(a) Primary: a dev-server middleware endpoint** writing into the inbox dir.
Inline plugin in `vite.config.ts`, handler in a node-testable module:

```ts
plugins: [{
  name: 'playtest-inbox',
  apply: 'serve',              // dev server ONLY — never part of the build
  configureServer(server) {
    server.middlewares.use('/__playtest-capture', playtestInboxHandler);
  },
}],
```

Why primary: it is **structurally absent from prod** (`vite.config.ts` code
never ships; the gh-pages build is a static bundle with no server), it's
instant (one `fetch`), and it lands the file exactly where the drain loop
reads it. Handler hardening: POST-only; JSON `{filename, markdown}`;
server-side re-sanitization (`/^[A-Za-z0-9T.-]+\.md$/`, no path separators);
resolved path must stay inside `project/playtest-inbox/` (dir-jail); body cap
256 KB; collision-proof stamp+suffix filenames.

**(b) Fallback: download-a-file.** If the POST fails (server hiccup), the
overlay offers the same markdown as a Blob `<a download>` — the human drops
it into `project/playtest-inbox/` later. Zero dependencies. Clipboard is
rejected as primary: a capture with an embedded save is too big to trust to
a clipboard the human will overwrite.

**Deployed gh-pages build: explicitly out of scope.** The overlay is
DEV-only and stripped, so the deployed build has no capture surface at all —
and that's correct: every playtest session to date ran on `localhost:5173`
(the F-log's own header says so), and a deployed-build player has no repo
inbox to write to anyway. Revisit only if the human starts playtesting
deployed builds (open question §5.1).

### 2.5 Inbox format — one self-contained file per capture

`project/playtest-inbox/<ISO-stamp>-<slug>.md` — slug = first ~4 words of
the note, kebab-cased; stamp makes ordering and uniqueness:

```markdown
---
captured_at: 2026-07-03T18:42:07+0200
build: v0.3.2 (abc1234, 2026-07-03)
seed: 20260626
clock: { day: 12, tick: 7 }
location: home-paddies
rung: R3
active_tab: work
variants: { market: market-c }   # non-default only; {} = all defaults
viewport: 1728x1117 @2x
url: /?market=market-c
---

## Note
<verbatim human note>

## Log tail (last 20)
- [narration] Sōan: …

## Save (base64 envelope — `__qa.load()` this to reproduce)
eyJhcHAiOiJra2FtaS…
```

Embedded save (not a sidecar JSON): one file = one capture = one atomic
create/delete; no orphanable pairs. Size is fine — the envelope measures
tens of KB with the 300-entry log ring, and the file's life is short.

### 2.6 Lifecycle — committed, drained, deleted

**Committed, not git-ignored (recommendation).** The repo is the memory ("if
it isn't a committed file, it doesn't exist"); a capture may wait days for a
drain, across sessions or machines. The counter-argument (churn) is answered
by the lifecycle: the inbox never accumulates.

1. **Capture:** middleware writes the file (untracked, machine-written —
   never hand-edited; the dir README states the contract).
2. **Intake:** the drain's first act commits all pending captures verbatim
   (`chore(inbox): intake N playtest captures`). This makes the raw capture
   durable in git history *before* processing — the append-only/lossless
   norm holds even though the file is later deleted.
3. **Drain:** per item — reproduce → triage → fix → log its **Fnn** in the
   canonical feedback log → **delete the capture file in the same commit as
   its F-entry**. Completion is deletion; the F-log (which quotes the note
   verbatim, per the existing template) is the durable record; the intake
   commit preserves the raw bytes forever.
4. **Empty dir = drained.** The inbox is a transport queue, never a tracker
   — there is no status field to go stale, because a capture has exactly two
   states: present (pending) or deleted (logged as Fnn).

The inbox is **agent-facing**: it never enters `project/todo-human.md` (the
pre-commit reading-queue gate ignores this path — verified against the
hook's patterns), and no new human-facing doc is created. The human's
optional window into the results stays the existing F-log.

### 2.7 The drain loop — `.claude/skills/drain-inbox/SKILL.md`

User-invocable as `/drain-inbox`; also runnable under `/loop` overnight.

- **Read** `project/playtest-inbox/*.md` oldest-first (README exempt).
  Empty → say so and stop (the per-run stopping condition; a `/loop`
  iteration on an empty inbox is a fast no-op).
- **Intake-commit** all pending captures (§2.6.2). This is also the
  concurrency claim: a second drain seeing a clean inbox-status knows one is
  in flight.
- **Reproduce (R2 — verify the complaint before touching code):** dev server
  + headless Playwright (never headed — the hook enforces it), navigate with
  the captured variant params, `__qa.load(<b64>)`, resize to the captured
  viewport, screenshot/observe. Confirm the symptom is real; where doc and
  build disagree, the build wins.
- **Triage (the existing metabolization, made explicit):**
  - **(i) Mechanical bug** → fix now, test-first where a test could go RED.
  - **(ii) Taste/UI** → if a settled `ui-design.md` rule covers it, fix per
    rule; if unsettled, log 💬/🅿️ and route to an R-item or a `diverge`
    lane — don't invent taste.
  - **(iii) Design fork (what the game *is*)** → surface as an **H-item** in
    `project/human-in-the-loop/`, log the Fnn as 💬 — **never auto-decide**
    (R4: bias to motion, surface forks async). Its capture file is still
    deleted once logged: the F-entry + H-item are the record; the intake
    commit holds the save if repro is needed later.
- **F-numbering continues globally:** next free number after the current max
  (F118 as of today). Entries append to a dated
  `project/human-feedback/<date>-playtest.md` (created per drain-day with
  the standard header/template, source noted as "async inbox capture"),
  using the established per-item template + status legend.
- **Graduate** distilled taste rules to `ui-design.md` / `fun-factor.md`
  exactly as the F1–F117 loop does; ADR-worthy calls → `decisions.md` only
  with the human (via the H-item).
- **Commit convention: one commit per item** — fix + F-entry + capture
  deletion + journal line, staged **by explicit path only** (shared-tree
  rule; `guard-git-add-all.sh` already enforces the no-`-A` half). Subject
  style: `fix(ui): recenter open-eyes button (F118, inbox drain)`. Full
  `verify` runs per commit as normal.
- **End of run:** journal summary (items drained, Fnn range, forks
  surfaced), inbox empty, then the normal checkpoint loop.

### 2.8 Teeth & hygiene

- **Strip gate extended, not trusted (R2):** `src/ui/capture.ts` exports
  `CAPTURE_SENTINEL = '__KAMI_PLAYTEST_CAPTURE__'` and stamps it on the
  overlay node (so it lands in the bundle iff the module does);
  `gh-pages.sh` step 1b's marker loop gains it:
  `for marker in "__qa" "__KAMI_DEV_PANEL__" "__KAMI_PLAYTEST_CAPTURE__"`.
  Ph2's DoD *proves* the strip with a real build + grep (could-go-RED).
- **The endpoint can't leak by construction** (`apply: 'serve'`, config code
  never bundles) — asserted anyway by grepping dist for
  `__playtest-capture` in the same gate, so a future refactor that moves the
  path string into the client keeps a tripwire.
- **Pure, tested capture builder:** `src/ui/capture-format.ts` — a pure
  `buildCapture(note, ctx) → {filename, markdown}` (node-testable: filename
  sanitization, frontmatter shape, log-tail formatting). The middleware
  handler is likewise a pure `handleCapture(body) → {path, content} | error`
  under test; only the thin fs/DOM shells are untested glue.
- **No human-facing surface:** no todo-human entry, no new living doc; the
  dir README addresses agents.

## 3 · Phases (each independently committable, with DoD)

### Ph1 — capture core + transport (no UI yet)

Inbox dir + README (lifecycle contract §2.6) · `src/ui/capture-format.ts` +
tests · middleware handler module + tests · the `vite.config.ts` plugin.

**DoD (could-go-RED):** with `npm run dev` up, a scripted
`fetch('/__playtest-capture', …)` from a headless page lands a well-formed
inbox file (frontmatter parses, save round-trips through `__qa.load`); a
path-traversal filename and an oversized body are **rejected** (asserted in
tests); `verify` green.

### Ph2 — overlay UX

`src/ui/capture.ts` (hotkey/guards §2.1, box, toast, download fallback,
sentinel) · mount from `main.ts` DEV branch (independent of `?dev=no`) · the
one-line `data-active-tab` stamp in `render.ts` · `gh-pages.sh` marker
extension.

**DoD:** driven headlessly through the REAL flow — dispatch a real `` ` ``
KeyboardEvent, type into the real textarea, ⌘Enter — the file appears with
correct seed/variants/tab/viewport; `?dev=no` still captures; the hotkey is
inert while focused in the save-import textarea; `npm run build` + grep
shows **zero** sentinels / endpoint strings in `dist/` (the strip proven,
not assumed); wall-clock capture < 5 s.

### Ph3 — drain skill + first REAL drained batch (the R3 proof)

`.claude/skills/drain-inbox/SKILL.md` (§2.7) · then run it for real: at
least one genuine capture produced through the real overlay + endpoint
(agent-produced headlessly is an acceptable bootstrap; the human's first
live capture is invited via an R-item, never waited on), drained end-to-end
— intake commit → headless repro from the embedded save → fix or triage →
**F118+** logged in the canonical feedback log → capture deleted.

**DoD:** the full round-trip exists in git history (intake commit + per-item
drain commit); the F-entry cites the fix commit; the inbox is empty; the
fix itself verified in the running game (the `verify` skill / headless
drive), not just green gates.

### Ph4 — loop-mode + conventions wiring

`session-brief.sh` prints "playtest inbox: N capture(s) waiting" (the async
nudge that makes cold-session drains happen — agent-facing, distinct from
the human queue) · AGENTS.md Conventions bullet (captures →
`project/playtest-inbox/`, drained by `/drain-inbox`, completion is
deletion) · `repo-map.md` dir entry · a short `qa-playtesting.md` section
(the capture overlay is part of the QA harness) · `/loop` guidance in the
skill (idle iterations exit fast; single drain lane at a time).

**DoD:** brief shows the count (silent at zero); `md-links` green; docs
wrapped ~80; a `/loop`-style repeated invocation on an empty inbox is a
clean fast no-op.

## 4 · Risks (each with a proposed default — never block on the human)

1. **Hotkey collision / IME quirks.** Default: Backquote + focused-input
   guard; binding is one constant; surfaced in the Ph3 R-item for a taste
   override.
2. **An open local write endpoint.** The dev server binds localhost;
   filename allowlist + dir-jail + size cap + POST-only. Residual risk (any
   local process can drop a note) accepted: a capture is inert markdown and
   the drain *verifies every claim against the running game* before acting
   (R2).
3. **Capture file size.** Envelope ≈ tens of KB (log ring capped at 300);
   fine for short-lived committed files. If it grows, gzip-then-base64 the
   envelope later — format change is frontmatter-versioned by `build:`.
4. **Schema drift between capture and drain.** `importState` runs the
   migration chain; frontmatter carries the build SHA. Default: drain on
   current `main`; checkout the captured SHA only when repro fails on main.
5. **The inbox rots into a tracker.** Structural teeth: no status field
   exists to go stale (present xor deleted); deletion rides the same commit
   as the F-entry; the session brief keeps the count visible.
6. **Concurrent drains (shared tree).** Intake-commit-first is the claim;
   the skill checks for an in-flight drain (uncommitted inbox deletions) and
   stands down; per-item explicit-path staging already governs. Worst case
   is a duplicate Fnn, caught at the F-log append.
7. **Transient render-only glitches don't survive state repro** (§2.3
   accepted loss). Default: log 💬 with a repro-hint request; reconsider
   in-browser screenshots only if this class recurs.

## 5 · Open questions (proposed defaults)

1. **Deployed-build capture?** Default: no — DEV-server-only scope (§2.4);
   revisit if the human playtests gh-pages builds.
2. **F-entry home:** per-drain-day `human-feedback/<date>-playtest.md` vs
   one rolling async log? Default: per-day file (matches the established
   per-session pattern and keeps files bounded).
3. **Pause the sim while the note box is open?** Default: no — snapshot at
   open (§2.1) already freezes the evidence; pausing would make capture feel
   heavier than 5 seconds.
4. **A verify-time bundle-strip gate (build + grep) in addition to the
   deploy-time one?** Default: no — a build in `verify` blows the 5 s
   budget; the deploy gate is the established rung for exactly this check
   (the `__qa` precedent).

---

*Committing note (for the executing agent): this file is a new
`docs/plans/*.md`, so the pre-commit reading-queue gate requires adding it
to `project/todo-human.md` → "Reading queue" in the same commit.*

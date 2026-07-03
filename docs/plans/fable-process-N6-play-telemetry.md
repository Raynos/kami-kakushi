# Real-play telemetry — attended-time instrumentation of the human's sessions

**Status: 📋 PROPOSED — awaiting human read.**
**created_date:** 2026-07-03
**Owns:** the DEV-only attended-time sessionizer (`src/telemetry/`) · the
localStorage telemetry ring · the per-rung attended-time report · the
DEV-panel Telemetry section · the strip-gate extension for the new surface.
**Composes with (does NOT own):** the balance-sim pacing report
(`docs/plans/fable-process-S4-balance-sim-gates.md` — the bot side of the
triangulation) · the playtest capture inbox
(`docs/plans/fable-process-S2-playtest-capture-inbox.md` — **UNBUILT**; Ph4
adapter only) · `pacing-report.ts`'s wall-minutes model · the D-075 DEV panel
(`src/ui/dev.ts`) · the `gh-pages.sh` strip gate.

## Who builds this — Fable or Opus?

**Confidence: ( 85% Opus, 15% Fable )** — the 15%: the first-session
calibration read of the attention constants (not a build step, but the
moment a wrong default silently skews all future pacing data).

**Opus 4.8 is sufficient for every phase.** The heart — the attended-time
sessionizer — is fully specified below as a pure state machine with named
constants and a worked example whose expected output is arithmetic, so Ph1
is self-verifying (R3): the 5/20/5 test either produces exactly 10 minutes
or it goes RED. The DOM shell is thin glue, the report is agent/human-DEV
facing (no woodblock taste bar, no D-075 diverge mandate), and the storage
is a capped ring following the `ui-prefs.ts` pattern. The one
Fable-preferred moment is not a build step at all: reading the FIRST real
session's data against the default attention constants (§2.4) and judging
whether the idle-TTL default misclassifies how the human actually plays —
that calibration read should get Fable or human eyes before anyone tunes a
constant.

---

## 0 · Problem & shape

Pacing decisions today have two legs: sim bots (theoretical — the balance-sim
plan) and design bands (intent — `T0_PACING_BAND_MIN/MAX` = [3, 22] wall-min
per rung). The third leg — what the human's play ACTUALLY costs in minutes —
is guessed. The balance-watch
(`project/audit/reports/2026-07-02-economy-balance-watch.md`) shows why the
guess is not enough: the koku capstone measured ~25–30 s against an intended
~85-minute climb, and the open questions there (rice out-produces sinks,
eat-vs-rest dominance, store-vs-sell) are all "how does a HUMAN actually
spend time" questions.

The hard part is the human's own requirement, verbatim:

> "You need to start and stop timers correctly: what's active play, what's
> idle play, what's the tab active versus not active, what's the user active
> versus not active. It's hard to get good real-play telemetry for pacing if
> I'm testing for 5min, then doing something else for 20min, then testing
> for 5min again — that's 10min of gameplay, not 30min."

So the deliverable is an **attended-time model** (§2) implemented as a pure,
unit-proven sessionizer, fed by thin DOM listeners, recording rung-ups and
economy snapshots against attended minutes — DEV-only, local-only, zero
network, zero core changes, stripped from prod with teeth.

## 1 · What exists to reuse (cited — R2 grounding)

- **The loop's real pause semantics (D-079, active-only-PAUSE).**
  `src/app/main.ts:239` — `autoStep()` guards on
  `paused || document.hidden || crashed`; one intent per `AUTO_REPEAT_MS`
  (480 ms, `balance.ts:78`) via `setInterval` (main.ts:300). Two facts the
  model is grounded in: **(1)** a hidden tab advances ZERO game ticks — the
  engine already excludes hidden time from game-time; **(2) window blur does
  NOT pause the loop** — a visible-but-unfocused window keeps simulating.
  So game-ticks and attended-ms genuinely diverge under blur, and the report
  must carry BOTH numbers (§3.2) rather than pretend they agree.
- **The intent tap point.** `dispatch()` (main.ts:194) is shared by the
  renderer (`mount(root, dispatch, …)`, main.ts:172) and by `autoStep` —
  auto-mode intents flow through the SAME function, so "an intent arrived"
  is NOT "the human acted". The wrap must be on the renderer's copy only.
- **The state-diff precedent.** `commit()` (main.ts:185) already diffs
  prev/next (`trackReveals`, main.ts:178) — rung-ups, ascension and losses
  are observable the same way, without touching `src/core`. Public fields:
  `state.rung`, `state.tier`, `state.resources.coin/rice`, `state.banked`,
  `state.influence.estate.value` (the koku standing), `balance.SETBACK_HP`
  (a lost fight SETS hp to it — `fight.ts:162`), `state.clock` (day/tick;
  `day*24+tick` is the `__qa.pacing()` convention, main.ts:474).
- **The hide-edge write precedent.** main.ts:311 already listens to
  `visibilitychange` to flush the save — telemetry's segment-close writes
  ride the same moment.
- **The wall-minutes framing to rhyme with.** `src/scripts/pacing-report.ts`
  — per-rung table `rung · title · … · wall(min) · ~days · band`, model
  `intents × AUTO_REPEAT_MS / 60000`, band [3, 22]. The balance-sim plan's
  report (`docs/content/t0-pacing.md`, when built) uses the same framing —
  the human table must be eyeball-diffable against both.
- **DEV strip teeth.** `src/ui/dev.ts:51` `DEV_SENTINEL = '__KAMI_DEV_PANEL__'`;
  `gh-pages.sh` step 1b greps `dist/assets/*.js` for
  `"__qa" "__KAMI_DEV_PANEL__"` and refuses to deploy a leak — the marker
  loop this plan extends. The DEV panel's `section()`/`mono()` helpers
  (dev.ts:1966-1988) are the UI pattern for the Telemetry section.
- **Storage precedents.** Saves: IndexedDB → localStorage → sessionStorage
  chain (`src/persistence/index.ts:30`). Device-scoped non-save data:
  `src/ui/ui-prefs.ts` uses guarded localStorage — telemetry follows the
  ui-prefs precedent, not the save chain (justified §3.3).
- **The inbox transport is UNBUILT.** The playtest-capture-inbox plan is
  📋 PROPOSED — no middleware, no `project/playtest-inbox/` exists today.
  **Ph1–3 of this plan therefore work standalone** (localStorage ring +
  copy/download/console); Ph4 is a thin adapter that lands only after that
  plan ships. Stated honestly: if the inbox plan is rejected, this plan
  still delivers its full value minus the async drop.

## 2 · The attended-time model (the heart)

### 2.1 Signals

The sessionizer consumes a timeline of typed events; the DOM shell (§3.4)
is the only producer in the app, tests produce them synthetically:

```ts
type TelemetryEvent =
  | { t: number; kind: 'visible' | 'hidden' }   // Page Visibility API
  | { t: number; kind: 'focus' | 'blur' }       // window focus/blur
  | { t: number; kind: 'input' }                // pointer/key/wheel, throttled
  | { t: number; kind: 'intent' }               // a PLAYER intent dispatched
  | { t: number; kind: 'auto'; armed: boolean } // auto-mode armed/disarmed
  | { t: number; kind: 'note' }                 // auto-stop / promotion-ready
  | { t: number; kind: 'heartbeat' }            // 30s watchdog sample
  | { t: number; kind: 'flush' };               // unload / run-change close
```

The game's own intent stream is the CLEANEST input signal (every player
intent is proof of hands-on play); raw DOM input covers attention that
produces no intent (scrolling the log, hovering the bestiary). Auto-mode
intents are deliberately NOT input (§1, the shared-dispatch trap).

### 2.2 Time classes — precise definitions

At any instant, time is in exactly one class:

- **(a) attended-active** — page visible AND window focused AND
  time-since-last-input ≤ `INPUT_RECENCY_MS`. Hands-on play.
- **(b) attended-idle** — visible AND focused AND time-since-last-input in
  (`INPUT_RECENCY_MS`, `IDLE_ATTENTION_TTL_MS`]. For an incremental this IS
  play: the human is watching autos run or reading the log (the log is the
  hero surface — reading is the game). Counted. The segment records how much
  of it ran with autos armed, so the report can distinguish watching-a-grind
  from reading-a-static-screen.
- **(c) hidden/away** — `document.hidden` OR window blurred. **Excluded
  ALWAYS** (the human's rule). Closes the current segment. Note the engine
  asymmetry: hidden also stops game ticks (D-079); blur does NOT — the
  report surfaces the divergence rather than hiding it (§3.2, risk §6.4).
- **(d) unattended-visible** — visible, focused, but
  time-since-last-input > `IDLE_ATTENTION_TTL_MS`: the walked-away edge.
  Excluded. Because a walk-away is only discoverable in hindsight, the
  sessionizer applies it RETROACTIVELY: when the next event arrives after a
  long gap, the segment is closed back-dated to
  `lastInput.t + IDLE_ATTENTION_TTL_MS` (closer `idle-ttl`), and attention
  resumes only at the new input.
- **Re-engagement heuristic (tunable, the weakest rule — flagged):** if a
  `note` event (auto-combat stopped, weapon-broken, promotion-ready) fires
  while unattended-visible and an input follows within
  `NOTE_REENGAGE_WINDOW_MS`, a new segment opens back-dated to `note.t` —
  responding fast to a game notification is evidence you were watching.
  The gap BEFORE the note stays excluded (no retro-credit of the whole gap).

### 2.3 Sessionization & attribution

- A **segment** is a maximal contiguous attended span:
  `{ start, end, activeMs, idleMs, autosArmedMs, closer }` where
  `closer ∈ hidden | blur | idle-ttl | sleep-gap | flush`. Classes (a) and
  (b) interleave freely WITHIN a segment; (c)/(d) close it. No micro-gap
  merging in v1 (a 2 s alt-tab blip splits the segment — harmless, since
  attribution sums segments; noted as tunable).
- **Sleep watchdog:** the shell emits `heartbeat` every `HEARTBEAT_MS`; a
  gap between consecutive events > `HEARTBEAT_MS × HEARTBEAT_GAP_FACTOR`
  means the machine slept / the tab froze without firing `visibilitychange`
  — the segment closes back-dated to the last event (closer `sleep-gap`).
- **Per-rung attribution:** the sessionizer maintains a monotonic
  `attendedMs` counter. Every milestone event snapshots it. Per-rung
  attended time = `attendedMs(rungUp[n]) − attendedMs(rungUp[n−1])`, which
  by construction sums attended segments BETWEEN rung-ups, across any
  number of hidden/idle gaps.

### 2.4 The tunable constants (named, defaulted, one place)

In `src/telemetry/sessionizer.ts`, each with a rationale comment; all
injectable via the config param (so tests and `__qa.telemetry.configure`
can shrink them):

| Constant | Default | Meaning |
|---|---|---|
| `INPUT_RECENCY_MS` | 60 000 | input within this ⇒ attended-active |
| `IDLE_ATTENTION_TTL_MS` | 300 000 | visible-no-input credit cap (5 min) |
| `NOTE_REENGAGE_WINDOW_MS` | 30 000 | note→input response ⇒ was watching |
| `HEARTBEAT_MS` | 30 000 | watchdog sample cadence |
| `HEARTBEAT_GAP_FACTOR` | 3 | gap > 3× heartbeat ⇒ sleep split |
| `INPUT_THROTTLE_MS` | 5 000 | raw DOM input coalescing in the shell |

### 2.5 The worked example — 5/20/5 traced through the rules

Canonical case (tab hidden during the break):

```
t= 0:00        visible+focused, click        → segment S1 opens (active)
t= 0:00– 5:00  inputs every ≤60 s            → S1 accrues 5:00 active
t= 5:00        document.hidden               → S1 CLOSES [0:00–5:00] = 5:00
t= 5:00–25:00  hidden                        → class (c): excluded, no ticks
t=25:00        visible, click                → S2 opens
t=25:00–30:00  inputs                        → S2 accrues 5:00
t=30:00        flush (unload)                → S2 CLOSES [25:00–30:00] = 5:00

attendedMs total = 600 000 exactly — 10 min of gameplay, not 30.
```

Hard variant (walked away WITHOUT hiding the tab — class (d)):

```
t= 5:00  last input; tab stays visible, autos running
t=25:00  input returns → retro-split:
         [ 5:00–10:00] attended-idle (TTL 5 min credit)   → counted
         [10:00–25:00] unattended-visible (closer idle-ttl) → excluded
attended = 5:00 + 5:00 + 5:00 = 15 min — degrades gracefully; the TTL is
the single knob, and the segment log makes the split auditable.
```

Both variants are Ph1 unit tests; the first is the DoD's headline assert.

## 3 · Design

### 3.1 What's recorded per event

One **run record** per game run, ring-stored (§3.3):

- **Run header:** `{ runId, seed, buildVersion, buildSha, startedAtISO,
  taints: string[] }`. `runId = <seed>-<startedAt epoch>`; a new run starts
  at boot-with-no-save, `newGame` (hooks + `__qa`), or save-import.
- **Rung-ups:** `{ rung, tGame: day*24+tick, attendedMs, wallMs,
  coin, coinBanked, rice, riceBanked, standing }` — detected in the pure
  `milestones.ts` as `prev.rung !== next.rung` on commit; economy snapshot
  read from the public fields (§1).
- **Ascension:** tier increase, same snapshot shape.
- **Losses:** `next.character.hp === balance.SETBACK_HP` from above it plus
  a carried-resource bleed in the same commit (the rout signature,
  `fight.ts:162-176`) — marked best-effort in the detector's comment.
- **Segments:** the §2.3 shape, appended at close.
- **Taints — the honesty ledger.** A run whose DEV tools distorted time is
  labelled, never silently mixed into pacing data: `speed>1`
  (`qa.speed`), any teleport (`toRung`/`jumpToPhase2`/`jumpToAscension`/
  `toTier`), `forceState`, `qa.tick`, save-import. Tainted runs render in
  the report but are excluded from the vs-sim comparison by default.

### 3.2 The report

Per run, rhyming with `pacing-report.ts` / the sim's `t0-pacing.md` so
human-vs-bot comparison is one eyeball pass:

```
run 20260626-1751558527 (v0.3.5 abc1234) — untainted
rung  attended(min)  sim-greedy(min)  band[3,22]  ticks  coin(+kura)  rice(+kura)  standing
R1    4.2            3.1              ok          38     12(+0)       40(+0)       0
…
Σ attended 92.4 min · active 61.0 / idle 31.4 · hidden/away excluded 48.0
segments: 14  (closers: hidden×9 · idle-ttl×2 · blur×2 · flush×1)
```

- `sim-greedy(min)` reads `walkPacing()` numbers today; switches to the
  sim's `docs/content/t0-pacing.md` medians when that plan lands.
- BOTH `attended(min)` and `ticks` print per rung so blur-time divergence
  (§2.2c) is visible: ticks climbing while attended stalls = background-
  window play, a finding, not a silent lie.
- The segment log follows the table (start/end/class breakdown/closer).
- **Emission:** session-end (segment close on hide/unload) →
  `console.info` one-liner + the full report persisted; on-demand from the
  DEV panel (§3.4). **Transport Ph1–3:** copy-to-clipboard button, download
  as `.md` (Blob anchor), `console.table`. **Ph4:** one extra button/auto
  drop into `project/playtest-inbox/` via the inbox middleware, frontmatter
  `kind: telemetry-report` — a thin adapter over the same report string.

### 3.3 Storage — localStorage ring (not IndexedDB), justified

- **The critical write moment is the hide/unload edge** (segment close).
  localStorage is synchronous — the write completes before the tab freezes.
  IndexedDB (the save codec's primary) is async; its transaction can be
  dropped at unload. The save manager tolerates that via its 15 s cadence;
  telemetry's most important byte IS the hide edge, so sync wins.
- **The data is small:** a session is tens of segments + ≤8 rung events —
  a few KB per run against the envelope's tens of KB. No index/query needs.
- **Precedent:** `ui-prefs.ts` — device-scoped non-save data in guarded
  localStorage; degrade to in-memory when unavailable (private mode).
- Key `kami.telemetry.v1`; cap `TELEMETRY_MAX_BYTES = 262 144` (256 KB),
  pruning oldest whole runs. **NEVER in the save envelope** (codec
  untouched; export/import carries zero telemetry). **Kept across
  new-game** — pacing spans runs (the ascension loop and the human's own
  new-game testing cadence are exactly the data) — with run-id tagging;
  a DEV-panel "clear telemetry" button is the manual reset.

### 3.4 Wiring — zero core changes, DEV-only, strip-proven

- **`src/core` untouched.** All observation is app/render-layer:
  - `main.ts` DEV branch creates `const telemetry = createTelemetry(…)`
    (the ternary-folds-to-`undefined` idiom `dev` already uses, main.ts:170,
    so `src/telemetry/` tree-shakes out of prod entirely).
  - The renderer's dispatch is wrapped:
    `mount(root, telemetry ? telemetry.wrapDispatch(dispatch) : dispatch, …)`
    — PLAYER intents emit `intent` events; `autoStep` keeps the raw
    `dispatch`, and its arm/disarm intents emit `auto` events via the same
    commit tap.
  - `commit()` gains one DEV-guarded line:
    `if (import.meta.env.DEV) telemetry?.onCommit(state, next)` — feeding
    the pure milestone detectors (rung/tier/loss/auto-mode/note changes).
  - Run lifecycle: `onRunStart` called from boot, `hooks.newGame`,
    `qa.newGame`, import; taint marks from the `__qa` cheats (§3.1).
- **DOM shell** (`src/telemetry/signals.ts`): `visibilitychange`,
  `focus`/`blur`, throttled `pointerdown`/`pointermove`/`keydown`/`wheel`
  (passive listeners, one `input` event per `INPUT_THROTTLE_MS`), the
  heartbeat interval, `beforeunload → flush`. Every handler is one line:
  read clock, call `advance(state, event)` — the shell stays thin (§4).
- **Mounted independent of `?dev=no`** (the capture-overlay precedent):
  the human's true-layout playtests (F2) are precisely the sessions worth
  measuring; telemetry has no visible surface, so it can't distort them.
  The panel section is absent under `?dev=no`; the data persists and is
  readable from the panel next session.
- **Strip teeth (R2, not trusted):** `src/telemetry/index.ts` exports
  `TELEMETRY_SENTINEL = '__KAMI_TELEMETRY__'`, stamped on the DEV-panel
  section node; `gh-pages.sh` step 1b's loop becomes
  `for marker in "__qa" "__KAMI_DEV_PANEL__" "__KAMI_TELEMETRY__"`. Ph2's
  DoD proves the strip with a real build + grep. **No network, ever** —
  Ph1–3 touch storage/clipboard/download only; Ph4's inbox POST is vite
  dev-middleware (`apply: 'serve'`), structurally absent from any build.

### 3.5 Module layout

```
src/telemetry/sessionizer.ts      // PURE attended-time state machine (§2)
src/telemetry/milestones.ts       // PURE (prev,next) detectors + snapshots
src/telemetry/report.ts           // PURE report/table formatter
src/telemetry/store.ts            // localStorage ring (guarded, mockable)
src/telemetry/signals.ts          // thin DOM shell → sessionizer events
src/telemetry/index.ts            // createTelemetry() wiring + sentinel
src/telemetry/*.test.ts           // Ph1 proofs (run in the vitest gate)
```

## 4 · Correctness proof (R3) — the pure sessionizer is mandatory

`sessionizer.ts` is an incremental reducer —
`advance(SessionizerState, TelemetryEvent) → SessionizerState` plus
`finalize(state, t)` — consumed identically by the live shell (event at a
time) and by tests (a synthetic timeline folded through it). No DOM, no
`Date.now`, no storage inside: timestamps arrive ON the events. Unit suite
(Ph1, before ANY DOM wiring exists):

- **The human's 5/20/5 case** (§2.5) → exactly 600 000 attended ms, two
  segments, closers `hidden`/`flush`.
- The walked-away variant → 15 min with the retroactive `idle-ttl` split.
- Blur excludes (visible+blurred span contributes zero).
- Idle counts (visible, autos armed, no input, under TTL).
- Sleep gap: heartbeat silence > 90 s → back-dated `sleep-gap` close.
- Note re-engage: note + input inside the window → segment reopens at
  `note.t`; outside the window → no retro-credit.
- Per-rung attribution across segments: a rung-up mid-S2 attributes
  S1 + partial-S2 correctly (the sum-across-segments claim, proven).
- Determinism: same timeline twice ⇒ identical output.

The DOM shell stays a shell: each listener maps one browser event to one
`TelemetryEvent`. The only untested glue is those mappings, and Ph2's DoD
exercises them end-to-end anyway.

## 5 · Phases (each independently committable, verify green)

### Ph1 — the pure sessionizer + detectors + report, unit-proven

`sessionizer.ts`, `milestones.ts`, `report.ts` + the §4 test suite. No
app wiring, no DOM, no storage yet.

**DoD (could-go-RED):** the 5/20/5 test asserts exactly 600 000 ms and the
walked-away variant asserts the retro split; every §4 case green; every
constant from §2.4 exists with a rationale comment and is config-injectable;
`npm run verify` green (the suite rides the existing vitest gate).

### Ph2 — DOM shell + storage + main.ts wiring + strip teeth

`signals.ts`, `store.ts`, `index.ts` (sentinel); main.ts DEV-branch wiring
(§3.4: wrapDispatch, commit tap, run lifecycle, taint marks);
`__qa.telemetry = { summary, report, segments, configure, clear }`;
`gh-pages.sh` marker extension.

**DoD (could-go-RED):** a REAL headless session proves the totals — a
Playwright page with shrunken constants (via `__qa.telemetry.configure`)
runs a compressed 5/20/5 script (real pointer events; visibility driven by
overriding `visibilityState` + dispatching real `visibilitychange`; blur via
real `blur` events) and `__qa.telemetry.summary()` returns the scripted
attended total, not the wall total; the hidden span also shows ZERO game-tick
advance (the D-079 cross-check); a reload recovers the persisted run from
localStorage; `npm run build` + grep shows zero `__KAMI_TELEMETRY__` in
`dist/` (strip proven, not assumed); `verify` green.

### Ph3 — report UX + docs

DEV-panel "Telemetry" section (panel `section()` pattern): live one-line
summary (attended today / current class), buttons — copy report · download
`.md` · `console.table` · clear (confirm). Session-end `console.info` on
segment close. Docs: a `qa-playtesting.md` section (the attended-time model,
the constants, how to read the report vs sim/bands), `repo-map.md` entry,
one AGENTS.md Conventions line.

**DoD:** driven headlessly through the real panel, the copy/download
buttons emit a report whose per-rung table columns line up with
`pacing-report.ts`'s (eyeball-diffable); a tainted run renders labelled and
is excluded from the vs-sim columns; docs wrapped ~80, `md-links` green;
`verify` green.

### Ph4 — inbox adapter (BLOCKED on the capture-inbox plan shipping)

A `postSessionReport()` adapter POSTing the same report markdown to the
inbox middleware, frontmatter `kind: telemetry-report`; a drain-skill note
that telemetry reports are DATA for pacing reads (filed toward balance
watch items), not bug captures.

**DoD:** a real session-end report lands in `project/playtest-inbox/` via
the real middleware and survives a drain intake commit; nothing in this
phase weakens the Ph2 strip proof. If the inbox plan is rejected, Ph4 is
cancelled with a strikethrough here — Ph1–3 stand alone.

## 6 · Risks (each with a default — never block on the human)

1. **The idle-TTL heuristic misreads the human's real style** (e.g. long
   watching stretches while autos grind). Default: 5 min TTL, constants in
   one place, the FIRST real session gets a calibration read (the report's
   segment closers show exactly which rule clipped what) — tune by
   evidence, not upfront.
2. **Devtools focus quirks.** Clicking into devtools fires `blur` while the
   human is genuinely attending (console-driving `__qa`). Default: honor
   the human's excluded-ALWAYS rule; `__qa` calls mark the run tainted
   anyway when they distort time; revisit only if real sessions show heavy
   blur-flapping (visible in the closer counts).
3. **OS sleep / lid close without a `visibilitychange`.** Default: the
   heartbeat watchdog back-dates a `sleep-gap` close (§2.3); worst case
   over-credits ≤ `HEARTBEAT_MS × FACTOR` (90 s), bounded and stated.
4. **Background-window play** (visible + blurred: the loop keeps ticking —
   grounded in main.ts:240 — while attended time is excluded). Default:
   report BOTH ticks and attended-min per rung so the divergence is a
   visible finding; if the human actually plays this way a lot, that's an
   H-item on the model (maybe blurred-with-autos deserves partial credit),
   decided on data.
5. **Multi-tab double-count / ring races.** Two DEV tabs would both write.
   Default: per-tab run instances keyed by `runId + tab nonce`;
   last-writer-wins on the ring accepted (DEV-only, one human); a loud
   console warn when a second tab detects an active writer beacon.
6. **Clock source.** `Date.now()` (comparable across events and to
   `savedAt`; `performance.now()` can pause in background). Sleep jumps are
   exactly what the watchdog catches. Default: `Date.now()` on every event.
7. **localStorage unavailable/quota** (private mode). Default: degrade to
   in-memory (ui-prefs pattern) — the session still reports live; history
   is lost on reload, acceptable for DEV tooling.
8. **Scripted/headless QA runs polluting the ring.** Default: `__qa`-driven
   dispatch and teleports taint; agents clear telemetry after harness runs
   (one line in `qa-playtesting.md`).

## 7 · Open questions (proposed defaults)

1. **Idle TTL when NO autos are armed** — reading a static screen: same
   5 min TTL, or shorter? Default: same (reading the log IS play; the
   segment's `autosArmedMs` keeps the distinction analyzable).
2. **Note-re-engage back-dating to `note.t`** — keep or drop? Default:
   keep (it matches the watch-the-grind reality) but flagged as the weakest
   rule; one constant to zero it out (`NOTE_REENGAGE_WINDOW_MS = 0`).
3. **Micro-gap merging** (a 2 s alt-tab blip splits a segment). Default:
   no merging in v1 — attribution sums segments so totals are unaffected;
   add `MICRO_GAP_MERGE_MS` only if the segment log gets noisy.
4. **Keep telemetry across new-game** — default KEEP with run-id tagging
   (pacing spans runs); the clear button is the escape hatch. Flip to
   auto-clear only if the human says the history is noise.
5. **Should a signed human-pacing band ever GATE?** Default: never — human
   data is n=1 evidence for the human's own tuning, not a machine gate
   (gates never cry wolf); the sim plan owns gating.

---

## Critical files for implementation

- `src/app/main.ts` — the ONLY app file touched: the loop's
  `paused || document.hidden` guard (lines 239-240) grounds the model;
  `dispatch` (194) / `commit` (185) / the DEV branch (319) are the taps.
- `src/ui/dev.ts` — `DEV_SENTINEL` + `mountDevPanel` `section()`/`mono()`
  patterns for the Telemetry panel section.
- `src/scripts/gh-pages.sh` — step 1b marker loop to extend with
  `__KAMI_TELEMETRY__`.
- `src/scripts/pacing-report.ts` — the wall-minutes model and per-rung
  table the report must rhyme with.
- `src/ui/ui-prefs.ts` — the guarded-localStorage pattern `store.ts`
  follows.

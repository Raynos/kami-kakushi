# QA & Playtesting Plan — the harness, the fun-proxies, the visual loop

How we **prove this game is correct, paced, and *fun* — not just that it compiles.** This is the
plan for the QA spine (built in **MS0**, per [§6.10](prd.md) and the milestone roadmap) and the
loops we run on top of it every milestone and in the **MS6 polish pass**.

> **Status:** LIVING GUIDE — the `__qa` harness is BUILT (`src/app/main.ts`, DEV-guarded); the
> visual/feel loop has run from MS1 (`audit/` screenshots); the §2 headless auto-player is BUILT
> for T0 (the FB-4 persona-bot balance sim, `pnpm run verify:balance` — 2026-07-04). Still pending:
> the §3 automated fun-proxy suite as a verify gate + the §2 T1+ scope. Adapted from the
> ironsight-saga QA harness + polish-loop, retargeted from a turn-based FPS to a long-horizon
> **incremental RPG**. The big differences for us: there's **no pointer-lock problem**, but there
> *is* a **28.5h grind** no human can hand-play to validate, a **multi-screen reveal** that is the
> game's signature, and **"is it fun?"** as a first-class acceptance question.

The three things that make an incremental good — **correct**, **well-paced**, and **fun to look at
and play** — each need a different QA tool. This plan covers all three.

---

## 0. Principles

- **HEADLESS ONLY — never a headed browser window.** All game QA/playtesting drives
  the game **headlessly**: `node src/scripts/qa-shots.mjs`, the
  [`capture-game-states`](../../.claude/skills/capture-game-states/SKILL.md) skill, or
  `window.__qa` through a headless page. **Do NOT use the Playwright / Chrome-DevTools
  MCP browser tools** — they open a *visible* browser window, which is disallowed here
  (enforced by the `.claude/hooks/enforce-headless-qa.sh` PreToolUse hook). Running the
  dev server (`pnpm run dev`) is fine — just observe it headlessly.
- **Drive real code paths, never synthetic input.** All QA routes through the pure-core
  `reduce(state, intent)` / `tick(state, dt)` contracts (§6.3) via a DEV-only API — the *same* flow a
  real player triggers. No test-only shortcuts; a scripted pass exercises the actual game.
- **Determinism is the QA substrate.** One seeded RNG (splitmix64 + named sub-streams, §6.7) means a
  fixed `(seed, intent-script)` reproduces byte-identically — every bug is reproducible, every
  playtest is a regression test.
- **Three QA modes, three tools:** (1) **headless correctness** (unit tests + the content-verifier +
  `state()` assertions — authored test-first via the [`tdd`](../../.claude/skills/tdd) skill, which owns the
  red→green→refactor discipline; this §0 owns the *why*); (2) **headless pacing/fun** (the auto-player +
  fun-proxy telemetry — the only
  way to "play" 28.5h); (3) **visual/feel** (headless screenshot drive — `qa-shots.mjs` / the
  `capture-game-states` skill — that **the agent itself
  reviews** with its own vision against the UI design-language bible).
- **The agent is a capable reviewer, not a blind builder.** With the headless capture drivers
  (`src/scripts/qa-shots.mjs`, the [`capture-game-states`](../../.claude/skills) skill) + its own multimodal vision, the agent
  **looks at every screen itself**, catches slop/misalignment/visual bugs, and iterates **before**
  the human sees it. The **human is the higher-level taste & fun arbiter** on self-vetted candidates.
- **Fun is a hypothesis tested by play, not a spec verified once.** We instrument proxies for it,
  play against them, and tune — continuously from MS1, not saved for the end.

---

## 1. The harness — `window.__qa` (DEV-only)

Built in MS0 alongside the engine; gated on `import.meta.env.DEV`, **stripped from production**. It
wraps the pure core so the game can be driven and observed from code (a console, or an MCP browser
tool).

### Capture (the playtest inbox — FB-3)

The DEV build also carries an **in-game capture overlay** (also `import.meta.env.DEV`, also
stripped from prod — proven by `verify-dev-strip.sh`). The `` ` `` hotkey pops a note box;
⌘/Ctrl+Enter appends a **lean** entry (the note + picked element + links) to **that game session's
file** in `project/playtest-inbox/pending/` via a dev-server endpoint (auto-committed on write),
while the heavy data — the **deterministic save** (seed + RNG cursors + clock + location + log) —
goes to a committed `<stamp>.json` sidecar and a `modern-screenshot` PNG to a git-ignored
`<stamp>.png`, then vanishes (< 5 s, the game never pauses). One `<session>.md` per browser-tab
sitting collects every capture. Because the `.json`'s save reproduces the moment byte-identically
(§0), each entry **is** a full repro context. The human plays and captures whenever; an agent drains asynchronously with
[`/drain-inbox`](../../.claude/skills/drain-inbox/SKILL.md) — reproduce from the save headlessly →
triage → log a **FB-nn** in `project/feedback-human/` → `git mv` the capture to `archive/`. This is
the async twin of the human's live playtest loop; it never blocks either side.

### Observe

| Method | Returns | Notes |
|---|---|---|
| `state()` | snapshot (below) | The QA observation point — a plain-data view of `GameState`. |
| `pacing()` | pacing/telemetry object | Proxy metrics accumulated this run (§3). |
| `reveals()` | revealed-entry log | What's been unlocked + when (tick/season) — verifies the reveal cadence. |

**`state()` snapshot (proposed):**

```ts
{
  tier,            // 0..5 (T0 Estate-tutorial · T1 Estate-full … T5 Edo)
  rung,            // current rung id ('R3' | 'V5' | 'G2' | …)
  estateStanding,  // 'stranger'|'friendly'|'trusted'|'honoraryMember'|'yonin'  (the rep arc)
  pillars,         // { arms, estate, office, name } — the four House Influence accumulators
  koku,            // the House's assessed STANDING — a kokudaka-like prestige SCORE (never spent, not an income multiplier); re-assessed seasonally + at tier jumps, gates ascension/unlocks. NOT a resource, immune to combat loss.
  influence,       // the rolled-up 家威 read + the per-tier domain-rank read (House Influence is re-expressed AS the koku standing above)
  resources,       // { coin, rice, wood, sansai, … } — the CARRIED pool (at-risk in a fight). `coin` is ONE underlying mon 文 value, shown in mixed denominations (mon → monme → ryō, revealed as wealth grows); `rice` is a real resource — eat it (satiety), store it in the kura, or sell it for coin at a season-swung price.
  banked,          // the sheltered kura pool — a lost fight bites `resources`, never `banked` (real field)
  skills,          // { farming:{lvl,xp}, …, weaponLines:{…} }
  attrs,           // real attrs are { might, guard, vigor }; the 5-attr { str, agi, int, spd, luck } is the v1 target
  time,            // { day, season, year } — the abstract clock
  location,        // current map NODE id ('kura' | 'home-paddies' | 'deep-satoyama' | …) — labours + foes are spatial (real field)
  combat,          // active fight state | null  (idle auto-resolve + active setup)
  sideTracks,      // { villageRep:{…}, origin:{ rung:'O2', … } }  — the optional side-tracks
  screen,          // the active nav screen + which nav entries are revealed
  log,             // recent diegetic event-log lines
  outcome,         // 'playing' | 't0done' | 't1done' | 't2done' | 't3done' (the v1 finish — Region cleared)
}
```

### Drive

| Method | Effect |
|---|---|
| `newGame(seed)` | Fresh run on a fixed seed (skips any title wait). |
| `dispatch(intent)` | Apply one player intent through `reduce` (the universal driver). Convenience wrappers: `activity(id)`, `auto(id\|null)`, `faceWolf()`, `fight(mobId)`, `autoCombat(mobId\|null)`, `setStance(s)`. Intents with no wrapper are driven raw: `move_to` (or use `goto` below), `deposit`/`withdraw` (the kura 蔵 bank — move a resource carried ↔ sheltered `banked`), `set_auto_rake` (the leave-it-running auto-labour toggle), and `set_auto_combat`'s `retreat` flag (sets `autoCombatRetreat` — the auto-retreat-at-~20%-HP mode vs fight-to-death). |
| `goto(node)` | **Walk to a map node** — replays real `move_to` hops over the revealed graph (nodes: `kura`, `gate-forecourt`, `home-paddies`, `woodlot-edge`, `near-satoyama`, `deep-satoyama` 奥山, `drill-yard`). **REQUIRED to reach node-gated activities/foes** — labours + enemies are spatial, so a driver that never walks can't reach forage / the deep-satoyama boar den or bank at the `kura`. `fight`/`faceWolf` auto-`goto` the foe's node first. |
| `tick(dt)` / `frames(n)` | Advance the sim one step (`tick`) / re-render N frames without advancing the sim (`frames`). |
| `toRung(id)` / `toTier(n)` | **Jump-to-rung / jump-to-tier teleport** — play the optimal path to a checkpoint so a QA run reaches a target in seconds. `toTier(n)` accepts **0..5**. |
| `jumpToPhase2()` / `jumpToAscension()` | **DEV teleports** — to the R7 capstone (Phase-2 open) / an ascension-ready Estate-EXCELLENT state, so the macro spine is one click away. |
| `speed(mult)` | **DEV speed toggle** — run **N auto-steps per tick** (2× / 4× / 8×; `1` = prod cadence), so the build plays hands-on at a compressed-but-real pace. Distinct from `tick` (one discrete step) and the `toRung`/`toTier` teleport (instant warp). |
| `pause()` / `resume()` | Pause / resume the active-only auto-loop. |
| `save()` / `load(b64)` | The base64 round-trip + migration chain (§6.8): `save()` **returns** the export string; `load(b64)` imports it. *(No separate `export`/`import` — these are it.)* |
| `loadFixture(name)` / `fixtures()` | **FB-6 named scenario saves** — `loadFixture(name)` loads a GENERATED fixture waypoint (backup-first via the FB-96 slot, so the human's run is safe — "↩ last backup" restores it); `fixtures()` lists `{name, blurb}`. Also on the **DEV panel → Scenarios** tab and as the **`?fixture=<name>`** boot param (`page.goto('/?fixture=pre-ascension')`). See the scenario library below. |
| `forceState(patch)` / `setSeed(n)` | DEV state patch / reseed — **spot-checks only, never the gate runs** (they fabricate per-rung tick-counts; see the gate-run invariant below). |

> **Mode-guarded, never throws.** Calling an intent that isn't currently legal is a no-op returning
> `false`/`null` (mirrors the ironsight harness), so scripts degrade gracefully.

> **Gate-run invariant — no fabricated state.** The MS6 **pacing + fun + win-rate GATE** runs must each be
> a **single, uninterrupted `newGame(seed)` → play-to-finish run**, *never* assembled via
> `forceState`/`toRung`/`toTier` — those fabricate (or zero) the per-rung tick-counts, so a win-rate could
> read green on a loadout that never paid its deed cost. The time-compression helpers stay for **spot-checks**,
> not for the gate runs.

### Scenario library (FB-6 — named fixture saves)

Six committed, GENERATED start-states so "reproduce X" becomes "load X, look" — never a
hand-driven climb. Each is rebuilt by driving the REAL engine from a fixed seed
(`pnpm run fixtures:regen`; the `fixtures` verify gate keeps them fresh), so a balance retune
or schema bump regenerates the whole library from scratch. Load via `__qa.loadFixture(name)`,
the DEV panel's **Scenarios** tab, or `?fixture=<name>`:

- `fresh-R3-pre-wolf` — R2, wolf-ready (the first-fight taste check), one click before `face_wolf`.
- `rung-beat-ready` — the first rung-up story beat, on the trigger, before the VN modal.
- `post-loss-broke` — the post-loss slump (ADR-113): HP at the floor, carried rice bled, kura hoard sheltered.
- `worn-weapon-no-wood` — a Battered blade with no wood to mend it (the repair-loop bind).
- `pre-ascension` — the full T0 arc at the ascension threshold (Estate EXCELLENT), before the ceremony.
- `wealthy-idler` — Phase 2, coffers full (coin banked past 2× the dearest estate stage), idle at the kura.

Fixtures are DEV-only (stripped from prod; the `verify-dev-strip` deploy gate greps the bundle to
prove it). Home + spec model: `src/fixtures/` (specs drive the engine; nothing hand-authored).

### Browser e2e lane (`e2e/` — real-browser input, CI-gated, 2026-07-05)

The automated real-browser regression net: `pnpm run test:e2e` runs Playwright
(`playwright.config.ts`) on THREE projects — Android Chrome (Pixel 7, chromium),
the iOS floor (iPhone SE 3rd gen, webkit, 375px), and **desktop-chromium
(1280×800)** — against the DEV server at `?dev=no` (true player layout; `__qa`
observes, never acts in journeys). Input goes through the `press()` helper: a
REAL tap on touch profiles, a REAL click on desktop — one spec drives every
project. Project scoping is per-project `testIgnore`, never copy-pasted specs.
The suites:

- **`e2e/mobile-layout.spec.ts`** (mobile projects) — the invariants, per fixture
  + cold open + landscape + a desktop→mobile mid-run resize (T2): **no horizontal
  scroll**, byōbu stacks to ONE column (work above log, work never height-0),
  every control in reach / ≥24px (WCAG 2.2, the `--tap-min` floor) / actually
  RECEIVES its tap (`elementFromPoint`, re-probed at scroll-centre so fixed bars
  don't false-flag).
- **`e2e/desktop-layout.spec.ts`** (desktop) — the mirror: no horizontal scroll,
  the byōbu SPREAD holds two live columns (both nonzero, no overlap, log ≤ its
  46% cap), controls ≥18px (a laxer desktop floor — hover-scale styles would
  false-flag 24px) and receiving the pointer. The shared `FIXTURES` constant +
  each suite's registry-drift test force every new FB-6 fixture into BOTH nets.
- **`e2e/mobile-journey.spec.ts`** (all projects) — the short play paths:
  cold-open wake, tab switching, a work action landing as a player intent, the
  scripted wolf fight, the rung-beat summons, settings open/close.
- **`e2e/journeys.spec.ts`** (all projects) — the story-beat reachability net
  (the 8 flows of `docs/plans` → `project/archive/` fable-2026-07-05-desktop-journey-e2e):
  the whole intro VN to the shell, a rung-beat promotion landing, the Tokubei
  market loop (ADR-114 talk-to-open), the kura deposit, cook-to-heal (ADR-076), the
  repair bind (R4 — `verb-repair` is an R4 unlock by design), a quest slice, and
  the ascension ceremony. Fixtures checkpoint past grind; tests press only
  visible controls and assert state + surface outcomes.
- **`e2e/persistence.spec.ts`** (desktop-chromium only) — what only a real
  browser proves: the autosave ring lands in `localStorage` and a fresh boot
  resumes it; the shipped settings textareas round-trip an export/import across
  browser contexts; a mid-intro refresh resumes the scene (T2).

Every test fails on any `pageerror`/`console.error`. The wiring layer below the
browser has its own cheap ratchet in the verify gate:
`src/ui/affordance-coverage.test.ts` — every player-facing `Intent` must be
dispatched by ≥1 control across representative render states (a new intent fails
typecheck until classified; an orphaned control fails the sweep).

**Where it gates:** its own CI workflow (`.github/workflows/e2e.yml`, every push)
— deliberately NOT a `verify` gate: the roster lives under the 5s budget (ADR-072)
and a browser suite (~50s local across 3 projects, minutes in CI) is the same
RED-able backstop at the rung its cost affords. A **pre-push blast-radius advisory**
(`.githooks/pre-push` — loud warn, never blocks; `SKIP_E2E_WARN=1` silences)
names any pushed files inside the lane's covered surface (`e2e/`,
`playwright.config.ts`, `src/fixtures/`, `src/ui/styles.css`) and nudges a local
`pnpm run test:e2e` before CI discovers the red minutes later. Born proving its
worth: its first run caught the nav tab-strip overflowing at 375px AND the dead
≤720px byōbu block (`.work` at height 0, the log painted over the verbs —
work-tab taps hit the log on phones).

A live slider panel over a curated set of `balance.ts` feel levers (the W1–W4 balance-watch
targets first, then stamina / rung / sink / combat feel). **The division is ADR-059: the HUMAN
tunes and exports; an agent transcribes — an agent NEVER moves a slider into canon on the
human's behalf.** Drag a lever mid-run and it takes effect immediately (ES named imports are
live bindings; the override lives only in the module binding + the URL, never in the save
envelope). The `?bal.<path>=<value>` URL params make a tune FB-5-survivable and shareable; the
`__qa.balance` handle (`set` / `read` / `touched` / `reset` / `exportMarkdown` / `exportPayload`)
drives it headlessly. Overrides are DEV-only (the `balance-override` marker is in the
`verify-dev-strip` gate).

**The human's ~10-minute tuning session:** open the DEV panel → **Balance** tab → drag a lever →
feel it in the running game (the live-feel readouts estimate next-rung / capstone ETA, eat-vs-rest,
rice→coin) → **Export tune → inbox**. The export drops a `<stamp>-balance-tune.md` artifact into
`project/playtest-inbox/pending/` (reusing the FB-3 inbox endpoint verbatim — no separate handler),
with a clipboard-copy + file-download fallback if the dev server is unreachable.

**The agent apply-flow (transcription only — the human already picked the numbers):**

1. **Read** the artifact from `project/playtest-inbox/pending/<stamp>-balance-tune.md`.
2. **Stale-canon guard:** if any `canon` value in the Touched-levers table ≠ the value currently
   in `balance.ts`, **STOP and ask** — the file moved since the session; never merge by guess.
3. **Apply the exact `old → new` edits** the artifact lists (scalars are `export let` lines;
   structured paths name the object field), plus any listed `src/core/content/ranks.ts`
   `meterThreshold` mirror (a `RUNG_METER_THRESHOLDS.*` tune requires it — verify-content enforces
   the 1:1). The agent picks **NO** numbers and widens **NO** bands.
4. **Run the re-verify block** the artifact prints (`pnpm run gen:docs && pnpm run verify`; then the
   balance-sim flow `pnpm run verify:balance && pnpm run balance:report`, §2 above). An honest RED
   (gen-docs bakes `EAT_RICE_*` / the price table; a moved arc trips `pacing:check` or a signed
   band) is a **finding to surface to the human** for a signed re-derivation — never a test-side fudge.
5. **Commit** citing the artifact (quote the touched-levers table in the body) and **`git mv` /
   delete the inbox file in the same commit** (completion is the archive move, like `/drain-inbox`).

### Real-play telemetry (FB-8 — the attended-time stopwatch, 2026-07-05)

The third leg of the pacing triangle: sim bots (theory, §2) · design bands
(intent) · **the human's real minutes (this)**. A DEV-only sessionizer
(`src/telemetry/`, pure + unit-proven) classifies every instant as
attended-active / attended-idle / hidden-away / walked-away, so
5-min-play → 20-min-away → 5-min-play records **10 minutes, not 30**:

- **The model:** input within 60 s ⇒ active; visible+focused with no input
  stays counted (watching autos / reading the log IS play) up to a
  **two-tier idle TTL** — 5 min with autos armed, 2 min static; hidden or
  blurred is excluded ALWAYS; a walk-away with the tab up is detected
  retroactively (segment closed back-dated to lastInput+TTL); a 30 s
  heartbeat watchdog catches lid-close sleeps; reacting to a game note
  within 30 s reopens back-dated to the note. Constants live in
  `src/telemetry/sessionizer.ts`, all injectable via
  `__qa.telemetry.configure`.
- **The taint ledger:** any `__qa` drive/teleport/speed/import labels the
  run (`qa-drive`, `toRung`, `speed>1`, `save-import`, …) — tainted runs
  render labelled and are EXCLUDED from vs-sim columns. **Agents: your
  headless runs are automatically tainted; `__qa.telemetry.clear()` after
  a harness session keeps the ring lean.**
- **Where the data lands:** per-rung reports (attended vs `walkPacing()`
  sim minutes vs the band, + ticks + economy snapshots) auto-drop on
  session-end into **git-ignored [`project/telemetry/`](../../project/telemetry/README.md)**
  — read that README's contract (never commit reports; distill conclusions
  into committed notes). Handles: `__qa.telemetry.{summary,report,segments,
  runs,configure,drop,clear}`; the DEV panel's **Telemetry** section shows
  the live one-liner + drop/clear buttons.
- **Smoke:** `node src/scripts/telemetry-smoke.mjs` (dev server up) —
  compressed 5/20/5 with real events; proves attended ≠ wall, zero hidden
  ticks (ADR-079), ring persistence, the auto-drop file.
- **Human pacing data NEVER gates** (locked 2026-07-05): n=1 evidence for
  the human's own tuning; the sim owns gating.

---

## 2. The headless auto-player ("the bot") — **BUILT for T0** (FB-4, 2026-07-04)

The single biggest QA gap for a long incremental: **you cannot manually play the whole arc to find
out if the pacing works.** The T0 instance of this is now **built and gating** — the persona-bot
balance sim (`src/sim/`, plan `project/archive`-bound `fable-process-F4-balance-sim-gates.md`):

- **Three personas** (pure policies over player-visible state, no cheating — real `Intent`s
  through `reduce` only): **greedy** (the shared `focusedOptimalIntent` + a real R3 combat leg —
  the floor), **idler** (replays the shipped `autoModeIntent` auto-loop verbatim between sparse
  check-ins — the "leave it running" reality), **explorer** (novelty-first breadth over every
  verb/topic/node — the ceiling probe). Skipped intents print per persona in every report.
- **The commands:** `pnpm run verify:balance` (the gating matrix: greedy per-rung bands from
  `T0_PACING_BAND_MIN/MAX` with margins printed, structural arc-closure gates for all 3 personas
  × the 5 `SIM_SEEDS`, report freshness) · `pnpm run balance:report` (regenerate
  [`docs/content/t0-pacing.md`](../content/t0-pacing.md) — committed, so **`git diff` on it IS
  the before/after of a balance change**) · `balance:sim --fuzz N` (structural-only seed sweep) ·
  `balance:selftest` (harness self-proof) · `balance:fresh` (fingerprint staleness, also a
  pre-commit WARN). A slim in-gate tripwire (`src/sim/pacing-envelope.test.ts`) rides the vitest
  gate (~40 ms).
- **The balance-change flow (the norm):** (0) **read `project/telemetry/` first (FB-8)** — if
  untainted real-play reports exist, quote attended-vs-sim for the touched rungs in the commit
  body (the human's real minutes outrank the bot's theory as evidence; a conclusion drawn from
  them gets distilled into a committed note per that folder's README) → (1) touch
  balance/content values → (2) `pnpm run verify:balance` → (3) `pnpm run balance:report` + eyeball
  the report diff → (4) commit the report WITH the change, pasting `balance-sim --summary`
  (per-rung deltas + verdicts) into the commit body. A staged design-input change with a stale
  report trips the pre-commit WARN.
- **Determinism contract:** personas are deterministic functions of (state, issued-history);
  all game randomness stays in `GameState.rng`; same (persona, seed) ⇒ byte-identical
  `RunMetrics` (test-asserted). Soft-locks RED at `SIM_SOFTLOCK_INTENTS` no-progress intents.
- **What it measures:** time-to-rung (wall-model: intents × `AUTO_REPEAT_MS`), economy curves,
  first-coin, the Phase-2 window (report-only until HD-19 signs a band), combat W/L/R + loss
  bleed, starvation/durability stalls.
- **T1+ scope (still ahead):** the full T0→T3 pacing budget (§4.8), the ≥30-min rung floor
  (`RUNG_WALL_FLOOR_MIN` gates from T1 — ADR-088 makes this harness the per-tier instrument),
  the 70/30 deed/seasonal split assert, and save-survives-a-full-arc.

---

## 3. Fun-proxy acceptance tests (measuring the fun-factor targets)

> This section is the **measurement mechanism**. *What* fun is, *why* these targets matter, and *how to
> improve / keep* fun live in **[`fun-factor.md`](fun-factor.md)** — the design doc this harness serves.

Fun isn't unit-testable, but its **absence** is measurable. The auto-player + `pacing()` assert these proxies
(the fun-factor.md targets) on every build (the "fun regression suite"); a fail is a design smell to fix:

- **No dead-time:** never more than ~N seconds where the player has **no meaningful action and no
  reward incoming** (the incremental killer). Flag reward-deserts and choice-deserts.
- **Reward cadence:** a reward / unlock / number-jump / reveal at least every ~X minutes of active
  play; a **new-thing reveal** (the signature) on a steady drip, never dumped.
- **Always a visible next goal:** at every state there is a legible "one-more-rung" target (the pull).
- **The first-5-minutes hook:** from the cold open, the player has done a verb, seen the log react,
  earned the first rice (+ a little coin), and glimpsed a next goal — fast.
- **The ≥30-min-per-rung floor** (§4.8): the optimal bot can't clear a grind rung in < ~28 min.
- **Pillar/seasonal pacing:** the 70/30 split holds; the seasonal judged result lands a satisfying
  high-water "headline" each autumn.

> These are *proxies*. They catch boredom, walls, and starvation — they do **not** prove fun. The
> human play-judgment (the playable T0 slice at MS3) is the real test; the proxies make the loop fast.

---

## 4. The visual / feel QA loop (every screen, every transition)

The "UI as progression" is the signature feature, so the UI must look **intentional, not generic**.
The loop (per the [UI design-language bible](ui-design.md), which the MS1/MS2 renderer is built to):

1. **Drive** the game to a target state with `__qa` (or the `capture-game-states` skill).
2. **Screenshot** it via Playwright / Chrome DevTools MCP (`take_screenshot`) — at desktop **and**
   the mobile bottom-bar/drawer layout (§6.9 responsive).
3. **The agent reviews the screenshot itself** against the bible: is the woodblock/ink language
   coherent? typography/spacing/colour-roles right? the event-log reading as the heart? the reveal/
   rank-up *motion* satisfying? any slop, misalignment, overflow, contrast/readability fail, or
   placeholder-looking element? Check the console (`list_console_messages`) + network for errors /
   missing assets.
4. **Iterate** until it's a self-vetted candidate, then **surface it to the human** with the agent's
   own read for the higher-level taste call.

**a11y is a SOFT check on every new / restyled UI surface (FB-3/A10) — a norm, deliberately *not* a gate.**
Run **both** a **Lighthouse a11y pass** *and* a **code-level a11y review**, because they catch **disjoint**
classes: the eye + Lighthouse are blind to whether an accessible *name* reads right (a buy button named just
"10 mon"); code review is blind to actual **contrast ratios** (eyeballing missed the vermilion/gold WCAG
fail that Lighthouse caught at a11y-95). Two cautions learned the hard way: drive Lighthouse against the
surface's **real deep state**, not the fresh shell (the shell never exercises the breadth panels — A9); and
treat a **visual oddity as a real bug until proven otherwise**, never wave it off as a "harness artifact"
(the seal "doubled text" was rationalised away repeatedly — it was a real missing-scrim bug on the most
climactic screen — A8). The design constraint is **on-palette AND ≥4.5:1**: resolve the
aesthetic-vs-accessibility tension *in-palette* (deeper cinnabar/bronze tones that hit AA while staying
woodblock, ADR-045), never by abandoning the approved palette — and if an a11y fix touches an
**approved** design/diverge pick, **flag it + offer to revert** even when it's "obviously correct" (P2).
Soft = it informs the work, it doesn't block the build.

**Coverage checklist (every one gets a screenshot + review):**
- The **cold open** (single screen, one verb, the log) — the first impression.
- **Every nav screen** as it reveals: Work → Skills → Combat → Crafting → Quests → Map →
  House(Influence) → Village → Region → Ties/Origin → Castle-town stub (§3.5; Crafting + Quests are
  top-level tab reveals, not nested panels).
- **Every transition/beat:** a rank-up, a reveal (new tab/area), a pillar achievement-jump, the
  seasonal judged-result "headline", a combat resolve + the soft-setback, an allegiance swing.
- **Every panel:** the four-bar Influence panel (bar-by-bar reveal), the rung ladder, the quest log,
  crafting, bestiary/equipment, the rumours board, the domain-rank / mitate-banzuke read.
- **States that break layouts:** K/M/B number growth (does the UI hold at 999B?), long event logs,
  many revealed tabs, empty vs full panels, the smallest mobile viewport.

---

## 5. The systematic QA sweep (per milestone)

Each milestone (MS0…MS7) is **not "done" until its QA sweep passes** (this is its definition-of-done,
§7). The sweep, adapted from the ironsight per-chapter pass:

- **Correctness:** the milestone's headless run reaches its target state; `state()`/`reveals()`
  assertions pass; `pnpm run verify` green (tsgo + oxlint + oxfmt + vitest + verify-content +
  `gen:docs --check` — verify-content enforces the id/canon invariants + a real-name denylist, and
  K/M/B is unit-tested; the macron lint + the §4.8 pacing regression are **planned** additions, not
  yet in the gate); a fixed-seed determinism test is byte-identical; save round-trips.
- **Content/canon:** the content-verifier confirms the invariants (no belief-creatures in spawn
  tables, trade ≤⅓, ≤1 residual ambiguity, the reveal triggers, the earned-transition gates).
- **Visual:** the §4 screenshot-review of every new/changed screen + transition.
- **Pacing/fun:** the auto-player run for the tiers in scope; the fun-proxy suite green.
- **Log every issue with a screenshot, fix, re-verify** (a `journal/` QA log per sweep, like the
  ironsight fix-log). Don't rabbit-hole — there's a **discipline line**: if one bug resists a couple
  of focused passes, log it, park it, move on.

---

## 6. The polish loop (the long-horizon `/loop`, mainly MS6)

Once T0–T2 is content-complete, run the iterative polish cycle the ironsight session used to take a
working build to a *great* one: **audit the current build → maintain a "road-to-great" queue → take
the highest-value item → build it → re-verify (headless + screenshot) → re-audit → repeat until the
audit saturates.** Each iteration is a small, shippable, verify-green improvement.

**Queue categories (incremental-retargeted):**
- **Number/reward juice (feel):** the satisfying pillar-jump animation, the coin/rice tick, the
  rank-up beat, a **separate seasonal-koku re-assessment beat** (the assessors' verdict on the
  House's standing), the seasonal-result fanfare, the unlock "reveal" flourish, milestone celebration.
- **Readability:** can the player parse the four pillars, the rung ladder, the gates, the next goal,
  the combat forecast, at a glance? Legends, tooltips (non-hover-dependent), clear thresholds.
- **Onboarding:** the cold open + the first few reveals must *teach the loop* without a wall of text;
  the open-ended-not-handholdy quest framing reads as a suggestion, not a checklist.
- **Atmosphere (within text+emoji+CSS):** the woodblock/ink mood, season/weather flavour, the diegetic
  log voice, festival beats — coherence over decoration.
- **Balance:** the auto-player audits → tuning passes to the §4.8 targets. **Calibrate the sim as an
  *instrument* and back-solve (A18):** take two measured points, derive the inverse transfer function, and
  hit the target in one shot — don't guess-and-iterate a dial.
- **Accessibility:** scalable text, colourblind-safe cues, keyboard + touch, pause (the locked v1 set).
- **Shipping hygiene:** favicon, og:image/social embed, build-size prune, the itch.io packaging +
  relative-base check, a clean console/network bill of health.

---

## 7. Tooling

- **Dev server:** `pnpm run dev` → Vite (it does **not** survive a Claude restart — relaunch on cold
  pickup). The headless drivers point at it.
- **MCP browser servers: BLOCKED (headed).** The Playwright / Chrome-DevTools MCP browser tools open
  a *visible* window and are denied by the `.claude/hooks/enforce-headless-qa.sh` PreToolUse hook
  (§0 "HEADLESS ONLY"). Drive `window.__qa` through a **headless page** instead — the tracked node
  drivers (`qa-shots.mjs`, `playtest.mjs`) or an ad-hoc headless-chromium script under `tmp/`.
- **The [`capture-game-states`](../../.claude/skills) skill:** the project's purpose-built driver for
  "drive the game headlessly and screenshot/record its states" — the front door for the §4 visual loop
  and audit sweeps; outputs land in [`audit/screens/latest/`](../../project/audit/screens/latest).
- **Where the harness lives:** `src/app/` (the composition root) installs `window.__qa` under
  `import.meta.env.DEV`, wrapping `src/core`'s `reduce`/`tick`; the screenshot/playtest drivers are
  tracked at `src/scripts/qa-shots.mjs` + `src/scripts/playtest.mjs`. The auto-player + fun-proxy collectors
  will live as a DEV/test module driven through the same API (still pending).

---

## 8. Cadence & the human's role

- **Continuous, not end-loaded:** correctness QA every commit (the verify gate); the auto-player +
  fun-proxies from MS3 (first playable T0); the visual loop from MS1 (first real UI); the big polish
  `/loop` at MS6.
- **The agent owns:** building the harness/bot, the headless correctness + pacing runs, the
  screenshot-review-and-iterate loop (with its own eyes), the fix-and-re-verify, the journal QA logs.
- **The human owns:** the **final fun call** (playing the T0 slice) and the **high-level taste call**
  on self-vetted UI candidates — the judgments the proxies and the agent's review *inform* but can't
  replace.

## 9. The workshop bar — DEV-tooling taste (from the first playtest, ADR-126)

The DEV/diverge tooling is held to the game's own standards — if the playtester
can see it, it is part of the experience. Relocated here from `taste.md` (the
player-facing standard) at the ADR-126 lock; evidence: the F-items in
`project/feedback-human/2026-07-02-playtest.md`.

- **Zero-footprint overlay.** DEV chrome is `position:fixed`, reserves NO
  player-layout space (the game centers on the full viewport as if it's
  absent); `?dev=no` previews the true layout. In-palette, organized sub-tabs
  (Settings / Variants), a truly fixed footer outside the scroll body, no
  duplicate controls, clear hit-areas. (FB-1 FB-2 FB-4 FB-16 FB-37 FB-38 FB-92)
- **Destructive actions are hard to mis-hit AND recoverable.** New Game is
  half-width/offset off the common click path, auto-backs-up the prior save,
  and "goto last backup" restores it one-click — a mis-click is never a lost
  run. New Game also resets the renderer's UI state (tab → Work, filter →
  Story); a loaded save starts IDLE with history already-seen. (FB-25 FB-32 FB-59
  FB-95 FB-96)
- **Cheap teleports.** DEV rung jumps expose the FULL source-derived roster,
  reach any rung in either direction (descend = reset + promote), and never
  spin a synchronous main-thread resim. (FB-24 FB-68)
- **Diverge ergonomics.** Variants split from Settings, importance-ordered as
  collapsible per-surface summaries; per-surface handles (number = surface,
  letter = variant: V6A/B/C); approve → promote the winner + strip the losers
  immediately (zero PROD flag-debt); selections round-trip the URL; list rows
  stack title over muted detail; HMR OFF during hand playtests (the
  playtester owns refresh). (FB-16 FB-17 FB-18 FB-21 FB-35 FB-36 FB-43 FB-49 FB-75 FB-101)

> See also: **[`fun-factor.md`](fun-factor.md)** (the *what/why* of fun — this harness measures its
> targets), [`prd.md`](prd.md) §4.8 (pacing targets), §6 (architecture / DEV play-API / save),
> §7 (milestone definitions-of-done), [`ui-design.md`](ui-design.md) (the visual bible),
> [`taste.md`](taste.md) (the player-facing taste standard — this §9 is its workshop twin), and
> [`2026-06-26-prd-human-feedback.md`](../../project/feedback-human/2026-06-26-prd-human-feedback.md) §K (the fun/UI process intent).

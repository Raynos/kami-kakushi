# QA & Playtesting Plan — the harness, the fun-proxies, the visual loop

How we **prove this game is correct, paced, and *fun* — not just that it compiles.** This is the
plan for the QA spine (built in **M0**, per [§6.10](prd.md) and the milestone roadmap) and the
loops we run on top of it every milestone and in the **M6 polish pass**.

> **Status:** LIVING GUIDE — the `__qa` harness is BUILT (`src/app/main.ts`, DEV-guarded); the
> visual/feel loop has run from M1 (`audit/` screenshots); the §2 headless auto-player is BUILT
> for T0 (the F4 persona-bot balance sim, `npm run verify:balance` — 2026-07-04). Still pending:
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
  dev server (`npm run dev`) is fine — just observe it headlessly.
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
  way to "play" 28.5h); (3) **visual/feel** (MCP browser drive + screenshots that **the agent itself
  reviews** with its own vision against the UI design-language bible).
- **The agent is a capable reviewer, not a blind builder.** With Playwright MCP + Chrome DevTools MCP
  + the [`capture-game-states`](../../.claude/skills) skill + its own multimodal vision, the agent
  **looks at every screen itself**, catches slop/misalignment/visual bugs, and iterates **before**
  the human sees it. The **human is the higher-level taste & fun arbiter** on self-vetted candidates.
- **Fun is a hypothesis tested by play, not a spec verified once.** We instrument proxies for it,
  play against them, and tune — continuously from M1, not saved for the end.

---

## 1. The harness — `window.__qa` (DEV-only)

Built in M0 alongside the engine; gated on `import.meta.env.DEV`, **stripped from production**. It
wraps the pure core so the game can be driven and observed from code (a console, or an MCP browser
tool).

### Capture (the playtest inbox — F3)

The DEV build also carries an **in-game capture overlay** (also `import.meta.env.DEV`, also
stripped from prod — proven by `verify-dev-strip.sh`). The `` ` `` hotkey pops a note box;
⌘/Ctrl+Enter drops a self-contained capture — the note + the **deterministic save** (seed + RNG
cursors + clock + location + log) + a git-ignored `modern-screenshot` PNG — into
`project/playtest-inbox/pending/` via a dev-server endpoint, then vanishes (< 5 s, the game never
pauses). Because the save reproduces the moment byte-identically (§0), one capture **is** a full
repro context. The human plays and captures whenever; an agent drains asynchronously with
[`/drain-inbox`](../../.claude/skills/drain-inbox/SKILL.md) — reproduce from the save headlessly →
triage → log an **Fnn** in `project/human-feedback/` → `git mv` the capture to `archive/`. This is
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
| `forceState(patch)` / `setSeed(n)` | DEV state patch / reseed — **spot-checks only, never the gate runs** (they fabricate per-rung tick-counts; see the gate-run invariant below). |

> **Mode-guarded, never throws.** Calling an intent that isn't currently legal is a no-op returning
> `false`/`null` (mirrors the ironsight harness), so scripts degrade gracefully.

> **Gate-run invariant — no fabricated state.** The M6 **pacing + fun + win-rate GATE** runs must each be
> a **single, uninterrupted `newGame(seed)` → play-to-finish run**, *never* assembled via
> `forceState`/`toRung`/`toTier` — those fabricate (or zero) the per-rung tick-counts, so a win-rate could
> read green on a loadout that never paid its deed cost. The time-compression helpers stay for **spot-checks**,
> not for the gate runs.

---

## 2. The headless auto-player ("the bot") — **BUILT for T0** (F4, 2026-07-04)

The single biggest QA gap for a long incremental: **you cannot manually play the whole arc to find
out if the pacing works.** The T0 instance of this is now **built and gating** — the persona-bot
balance sim (`src/sim/`, plan `project/archive`-bound `fable-process-F4-balance-sim-gates.md`):

- **Three personas** (pure policies over player-visible state, no cheating — real `Intent`s
  through `reduce` only): **greedy** (the shared `focusedOptimalIntent` + a real R3 combat leg —
  the floor), **idler** (replays the shipped `autoModeIntent` auto-loop verbatim between sparse
  check-ins — the "leave it running" reality), **explorer** (novelty-first breadth over every
  verb/topic/node — the ceiling probe). Skipped intents print per persona in every report.
- **The commands:** `npm run verify:balance` (the gating matrix: greedy per-rung bands from
  `T0_PACING_BAND_MIN/MAX` with margins printed, structural arc-closure gates for all 3 personas
  × the 5 `SIM_SEEDS`, report freshness) · `npm run balance:report` (regenerate
  [`docs/content/t0-pacing.md`](../content/t0-pacing.md) — committed, so **`git diff` on it IS
  the before/after of a balance change**) · `balance:sim --fuzz N` (structural-only seed sweep) ·
  `balance:selftest` (harness self-proof) · `balance:fresh` (fingerprint staleness, also a
  pre-commit WARN). A slim in-gate tripwire (`src/sim/pacing-envelope.test.ts`) rides the vitest
  gate (~40 ms).
- **The balance-change flow (the norm):** (1) touch balance/content values → (2)
  `npm run verify:balance` → (3) `npm run balance:report` + eyeball the report diff → (4) commit
  the report WITH the change, pasting `balance-sim --summary` (per-rung deltas + verdicts) into
  the commit body. A staged design-input change with a stale report trips the pre-commit WARN.
- **Determinism contract:** personas are deterministic functions of (state, issued-history);
  all game randomness stays in `GameState.rng`; same (persona, seed) ⇒ byte-identical
  `RunMetrics` (test-asserted). Soft-locks RED at `SIM_SOFTLOCK_INTENTS` no-progress intents.
- **What it measures:** time-to-rung (wall-model: intents × `AUTO_REPEAT_MS`), economy curves,
  first-coin, the Phase-2 window (report-only until H19 signs a band), combat W/L/R + loss
  bleed, starvation/durability stalls.
- **T1+ scope (still ahead):** the full T0→T3 pacing budget (§4.8), the ≥30-min rung floor
  (`RUNG_WALL_FLOOR_MIN` gates from T1 — D-088 makes this harness the per-tier instrument),
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
> human play-judgment (the playable T0 slice at M3) is the real test; the proxies make the loop fast.

---

## 4. The visual / feel QA loop (every screen, every transition)

The "UI as progression" is the signature feature, so the UI must look **intentional, not generic**.
The loop (per the [UI design-language bible](ui-design.md), which the M1/M2 renderer is built to):

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

**a11y is a SOFT check on every new / restyled UI surface (F3/A10) — a norm, deliberately *not* a gate.**
Run **both** a **Lighthouse a11y pass** *and* a **code-level a11y review**, because they catch **disjoint**
classes: the eye + Lighthouse are blind to whether an accessible *name* reads right (a buy button named just
"10 mon"); code review is blind to actual **contrast ratios** (eyeballing missed the vermilion/gold WCAG
fail that Lighthouse caught at a11y-95). Two cautions learned the hard way: drive Lighthouse against the
surface's **real deep state**, not the fresh shell (the shell never exercises the breadth panels — A9); and
treat a **visual oddity as a real bug until proven otherwise**, never wave it off as a "harness artifact"
(the seal "doubled text" was rationalised away repeatedly — it was a real missing-scrim bug on the most
climactic screen — A8). The design constraint is **on-palette AND ≥4.5:1**: resolve the
aesthetic-vs-accessibility tension *in-palette* (deeper cinnabar/bronze tones that hit AA while staying
woodblock, D-045), never by abandoning the approved palette — and if an a11y fix touches an
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

Each milestone (M0…M7) is **not "done" until its QA sweep passes** (this is its definition-of-done,
§7). The sweep, adapted from the ironsight per-chapter pass:

- **Correctness:** the milestone's headless run reaches its target state; `state()`/`reveals()`
  assertions pass; `npm run verify` green (tsgo + oxlint + oxfmt + vitest + verify-content +
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

## 6. The polish loop (the long-horizon `/loop`, mainly M6)

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

- **Dev server:** `npm run dev` → Vite (it does **not** survive a Claude restart — relaunch on cold
  pickup). The MCP browser tools point at it.
- **MCP browser servers (headless):** Playwright MCP + Chrome DevTools MCP, both available. Drive the
  harness via their evaluate tools (`evaluate_script` / `browser_evaluate` with `() => window.__qa.…`),
  screenshot between steps, inspect console/network. Headless config takes effect only after a client
  restart; until then the game is headful but harmless (no pointer-lock to steal the cursor).
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
  fun-proxies from M3 (first playable T0); the visual loop from M1 (first real UI); the big polish
  `/loop` at M6.
- **The agent owns:** building the harness/bot, the headless correctness + pacing runs, the
  screenshot-review-and-iterate loop (with its own eyes), the fix-and-re-verify, the journal QA logs.
- **The human owns:** the **final fun call** (playing the T0 slice) and the **high-level taste call**
  on self-vetted UI candidates — the judgments the proxies and the agent's review *inform* but can't
  replace.

## 9. The workshop bar — DEV-tooling taste (from the first playtest, D-126)

The DEV/diverge tooling is held to the game's own standards — if the playtester
can see it, it is part of the experience. Relocated here from `taste.md` (the
player-facing standard) at the D-126 lock; evidence: the F-items in
`project/human-feedback/2026-07-02-playtest.md`.

- **Zero-footprint overlay.** DEV chrome is `position:fixed`, reserves NO
  player-layout space (the game centers on the full viewport as if it's
  absent); `?dev=no` previews the true layout. In-palette, organized sub-tabs
  (Settings / Variants), a truly fixed footer outside the scroll body, no
  duplicate controls, clear hit-areas. (F1 F2 F4 F16 F37 F38 F92)
- **Destructive actions are hard to mis-hit AND recoverable.** New Game is
  half-width/offset off the common click path, auto-backs-up the prior save,
  and "goto last backup" restores it one-click — a mis-click is never a lost
  run. New Game also resets the renderer's UI state (tab → Work, filter →
  Story); a loaded save starts IDLE with history already-seen. (F25 F32 F59
  F95 F96)
- **Cheap teleports.** DEV rung jumps expose the FULL source-derived roster,
  reach any rung in either direction (descend = reset + promote), and never
  spin a synchronous main-thread resim. (F24 F68)
- **Diverge ergonomics.** Variants split from Settings, importance-ordered as
  collapsible per-surface summaries; per-surface handles (number = surface,
  letter = variant: V6A/B/C); approve → promote the winner + strip the losers
  immediately (zero PROD flag-debt); selections round-trip the URL; list rows
  stack title over muted detail; HMR OFF during hand playtests (the
  playtester owns refresh). (F16 F17 F18 F21 F35 F36 F43 F49 F75 F101)

> See also: **[`fun-factor.md`](fun-factor.md)** (the *what/why* of fun — this harness measures its
> targets), [`prd.md`](prd.md) §4.8 (pacing targets), §6 (architecture / DEV play-API / save),
> §7 (milestone definitions-of-done), [`ui-design.md`](ui-design.md) (the visual bible),
> [`taste.md`](taste.md) (the player-facing taste standard — this §9 is its workshop twin), and
> [`2026-06-26-prd-human-feedback.md`](../../project/human-feedback/2026-06-26-prd-human-feedback.md) §K (the fun/UI process intent).

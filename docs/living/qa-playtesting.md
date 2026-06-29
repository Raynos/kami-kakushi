# QA & Playtesting Plan — the harness, the fun-proxies, the visual loop

How we **prove this game is correct, paced, and *fun* — not just that it compiles.** This is the
plan for the QA spine (built in **M0**, per [§6.10](prd.md) and the milestone roadmap) and the
loops we run on top of it every milestone and in the **M6 polish pass**.

> **Status:** LIVING GUIDE — the `__qa` harness is BUILT (`src/app/main.ts`, DEV-guarded); the
> visual/feel loop has run from M1 (`audit/` screenshots). Still pending: the §2 headless auto-player
> bot + the §3 automated fun-proxy suite as a verify gate. Adapted from the
> ironsight-saga QA harness + polish-loop, retargeted from a turn-based FPS to a long-horizon
> **incremental RPG**. The big differences for us: there's **no pointer-lock problem**, but there
> *is* a **28.5h grind** no human can hand-play to validate, a **multi-screen reveal** that is the
> game's signature, and **"is it fun?"** as a first-class acceptance question.

The three things that make an incremental good — **correct**, **well-paced**, and **fun to look at
and play** — each need a different QA tool. This plan covers all three.

---

## 0. Principles

- **Drive real code paths, never synthetic input.** All QA routes through the pure-core
  `reduce(state, intent)` / `tick(state, dt)` contracts (§6.3) via a DEV-only API — the *same* flow a
  real player triggers. No test-only shortcuts; a scripted pass exercises the actual game.
- **Determinism is the QA substrate.** One seeded RNG (splitmix64 + named sub-streams, §6.7) means a
  fixed `(seed, intent-script)` reproduces byte-identically — every bug is reproducible, every
  playtest is a regression test.
- **Three QA modes, three tools:** (1) **headless correctness** (unit tests + the content-verifier +
  `state()` assertions); (2) **headless pacing/fun** (the auto-player + fun-proxy telemetry — the only
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

### Observe

| Method | Returns | Notes |
|---|---|---|
| `state()` | snapshot (below) | The QA observation point — a plain-data view of `GameState`. |
| `pacing()` | pacing/telemetry object | Proxy metrics accumulated this run (§3). |
| `reveals()` | revealed-entry log | What's been unlocked + when (tick/season) — verifies the reveal cadence. |

**`state()` snapshot (proposed):**

```ts
{
  tier,            // 0..4 (T0 Estate … T4 Edo)
  rung,            // current rung id ('R3' | 'V5' | 'G2' | …)
  estateStanding,  // 'stranger'|'friendly'|'trusted'|'honoraryMember'|'yonin'  (the rep arc)
  pillars,         // { arms, estate, office, name } — the four House Influence accumulators
  influence,       // the rolled-up 家威 read + the per-tier domain-rank read
  resources,       // { koku, mon, wood, sansai, … }
  skills,          // { farming:{lvl,xp}, …, weaponLines:{…} }
  attrs,           // { str, agi, int, spd, luck }
  time,            // { day, season, year } — the abstract clock
  combat,          // active fight state | null  (idle auto-resolve + active setup)
  sideTracks,      // { villageRep:{…}, origin:{ rung:'O2', … } }  — the optional side-tracks
  screen,          // the active nav screen + which nav entries are revealed
  log,             // recent diegetic event-log lines
  outcome,         // 'playing' | 't0done' | 't1done' | 't2done' (the v1 finish)
}
```

### Drive

| Method | Effect |
|---|---|
| `newGame(seed)` | Fresh run on a fixed seed (skips any title wait). |
| `dispatch(intent)` | Apply one player intent through `reduce` (the universal driver — gather, craft, take-quest, set-stance, assign-job, advance-rung, swing-allegiance, …). |
| `tick(dt)` / `advance(days)` | Advance the active-only clock (drives idle-combat resolution, harvests, the seasonal judged result). |
| `advanceSeason()` / `toRung(id)` / `toTier(n)` | **Time-compression helpers** — fast-forward by playing the optimal/scripted path to a checkpoint, so a QA run reaches T2 in seconds, not hours. |
| `save()` / `load(blob)` / `export()` / `import(b64)` | Exercise the IndexedDB + base64 round-trip + the migration chain (§6.8). |

> **Mode-guarded, never throws.** Calling an intent that isn't currently legal is a no-op returning
> `false`/`null` (mirrors the ironsight harness), so scripts degrade gracefully.

> **Gate-run invariant — no fabricated state.** The M6 **pacing + fun + win-rate GATE** runs must each be
> a **single, uninterrupted `newGame(seed)` → play-to-finish run**, *never* assembled via
> `forceState`/`toRung`/`toTier` — those fabricate (or zero) the per-rung tick-counts, so a win-rate could
> read green on a loadout that never paid its deed cost. The time-compression helpers stay for **spot-checks**,
> not for the gate runs.

---

## 2. The headless auto-player ("the bot") — for the 28.5h no human can hand-play

The single biggest QA gap for a long incremental: **you cannot manually play 28.5 hours to find out
if the pacing works.** So we build a **scripted/heuristic auto-player** on top of `__qa` that plays a
full T0→T2 run headlessly in seconds and emits telemetry.

- **What it does:** loops `state()` → pick the best legal action (a simple greedy/heuristic policy:
  do the highest-value available deed, advance rungs when gated thresholds are met, take quests, let
  idle-combat run, advance time to the next meaningful event) → `dispatch`/`tick` → record metrics.
- **Variants:** an **optimal-ish bot** (validates the *floor* — fastest sensible clear, checks the
  ≥30-min-per-rung floor isn't trivially broken) and a **casual bot** (sub-optimal play — checks the
  ceiling isn't a wall). Run both per seed; run several seeds.
- **Determinism contract (the bot underwrites every deterministic gate, so it must reproduce
  byte-identically):** a total, **stable action-id tie-break** so "do the highest-value available deed"
  resolves identically whenever two deeds tie; a dedicated **seed-pinned bot-RNG sub-stream, separate from
  the game's RNG cursors** (drives the casual/sub-optimal bot's choices without perturbing game state); an
  **integer/rational value function with a fixed reduction order** (no float-ordering drift); and the **bot
  seeds committed alongside the win-rate seed-set**.
- **What it proves (hard data, not vibes):** the §4.8 pacing budget (T0≈4.5h / T1≈8h / T2≈16h),
  every gate is *reachable*, no pillar is un-satisfiable, the 70/30 deed/seasonal split actually
  lands, no dead-ends, the save survives a full arc + migration.
- This is the **§4 balance-tuning engine** — it turns "does the grind feel right?" into a tunable
  number loop (the M6 balance pass, run continuously from M3).

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
  earned the first koku, and glimpsed a next goal — fast.
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
  assertions pass; `npm run verify` green (tsc + eslint + prettier + vitest + verify-content +
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
- **Number/reward juice (feel):** the satisfying pillar-jump animation, the koku tick, the
  rank-up beat, the seasonal-result fanfare, the unlock "reveal" flourish, milestone celebration.
- **Readability:** can the player parse the four pillars, the rung ladder, the gates, the next goal,
  the combat forecast, at a glance? Legends, tooltips (non-hover-dependent), clear thresholds.
- **Onboarding:** the cold open + the first few reveals must *teach the loop* without a wall of text;
  the open-ended-not-handholdy quest framing reads as a suggestion, not a checklist.
- **Atmosphere (within text+emoji+CSS):** the woodblock/ink mood, season/weather flavour, the diegetic
  log voice, festival beats — coherence over decoration.
- **Balance:** the auto-player audits → tuning passes to the §4.8 targets.
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

> See also: **[`fun-factor.md`](fun-factor.md)** (the *what/why* of fun — this harness measures its
> targets), [`prd.md`](prd.md) §4.8 (pacing targets), §6 (architecture / DEV play-API / save),
> §7 (milestone definitions-of-done), [`ui-design.md`](ui-design.md) (the visual bible), and
> [`2026-06-26-prd-human-feedback.md`](../../project/human-feedback/2026-06-26-prd-human-feedback.md) §K (the fun/UI process intent).

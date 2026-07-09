# Changelog

All notable changes to **Kami-kakushi** are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (pre-1.0, so
the surface still moves under playtest).

Play the live build: <https://raynos.github.io/kami-kakushi/>. The displayed
in-game version is single-sourced from `package.json` (footer: `vX.Y.Z · build
<sha> · <date>`). Pre-`0.3.1` builds were tagged `v0.1` / `v0.2` in git; from
`0.3.1` on the version lives only in `package.json`, never a git tag.

## [Unreleased]

## [0.4.0] — 2026-07-09

The storywave release. The whole of the opening tier is rebuilt on the story
bible — a truer house, a year that actually turns, and a new reckoning between
the land and the people who work it. If you played an earlier build, that run is
closed and laid away, and you begin again from the first line.

### Changed

- **The whole T0 story is rewritten.** The house, its people, and the beats that
  carry you up from the weir to a trusted hand (R0→R7) are re-authored to the
  story bible — new faces, new scenes, and prose that means to be read.
- **The year turns through six seasons.** Winter, the New Year, Spring, Summer,
  Bon, and Autumn come round in order, advanced by your hand, and each closes on
  its own account of where the house stands.
- **Rice is the house's store now, not a figure in your pocket.** The harvest is
  counted into the kura by the year, feeds the household through the lean months,
  spoils if it overflows the store, and answers the land's due. What the house
  pays _you_ is coin (mon) — and that you keep and count yourself.
- **The nengu reckoning.** Once a year, at Autumn's turn, the house is measured
  against the land — the shortfall named plainly, once, and let stand. You stand
  in the room for it, counted as part of it and not asked into it.
- **Your body is part of the work.** A hurt or ill-fed man works worse than a
  whole one, and a fight you lose puts you on a sickroom pallet to mend before
  you can take the day up again.

### Added

- **Year-turning story beats.** The season-exit ceremonies and the nengu
  reckoning play as full scenes as the year comes round, so the calendar reads as
  the house's life, not a counter.

### Internal

- **The T0 engine rebuilt (G0–G6).** A generalized VN-scene engine + night-round
  runner, six-season time and the kura-unit economy in the pure core, two body
  economies (work-impairment + defeat→sickroom), the FB-5 narrative grammar
  extended to carry it, a VERDICT reconciliation pass, and the e2e/drift sweep —
  all green on `main`.
- **Clean-break persistence (D-161).** A pre-rewrite save is retired (backed up,
  then a fresh boot) rather than migrated, with a composed in-fiction notice.
- **Live scene-def review (D-139).** The DEV Story switcher now swaps a
  generalized VN beat between its authored takes, so a narrative diverge (the
  nengu reckoning's three takes) reviews live in the running game. DEV-only.

## [0.3.9] — 2026-07-06

The steel release. The whole game re-dressed in one day — the washi paper and
woodblock ink retire, and **Andon Steel** takes their place: dark plate
surfaces under lantern light, silver for what things ARE, gold for what they're
WORTH, and vermillion spent only where it means something. Same game, same
rules, a new house.

### Changed

- **The look, end to end.** Blackened-steel plates with gold keylines and
  silver catchlights replace the paper-and-ink surfaces; Western serif type
  (Palatino-class) replaces the brush faces; every meter is a gold thread in a
  steel groove (your life reads silver, satiety a quiet green). The old grain,
  frames and washes are gone entirely.
- **The screen is a new frame.** Tabs live in a left rail now, your work in
  the centre desk, and the story log in its own tall window on the right. On a
  phone the game holds one fixed column — the log folds to a single line that
  opens near-full-screen on a tap and folds back — with proper 44px touch
  targets throughout.
- **The cold open types itself.** Title, name and first words each strike in
  character by character behind a blinking gold caret, old-handheld style.
- **Promotions are a ceremony.** Answering the summons now ends on its own
  full-card moment — the gold house seal presses with a bloom of vermillion
  heat and "You've been promoted." — instead of a fleeting overlay.
- **A quieter header.** Rice, coin and the calendar have left the top strip —
  wealth lives on the Inventory tab where it's managed; the season and year
  sit small at the rail's foot. And the calendar itself now turns 24× slower,
  so years pass like years, not weeks.
- **The story reads like a page.** Spoken words alone carry each speaker's
  colour (narration stays quiet ink), every voice keeps its own shade, names
  are bold, quotes are always quoted, conversations open with a small
  "— with Sōan —" rule, and different speakers get breathing room between
  blocks.

### Fixed

- **Nothing the house remembers is ever forgotten.** Story, chat and progress
  history is now unbounded — an afternoon of auto-raking can no longer push
  your perks and story out of the log's memory. Only fleeting flavour lines
  expire.
- **Clicking takes over from auto.** Doing anything by hand now stops a
  running auto-action instead of racing it.
- **The review toolkit works on the live build.** The `?dev=yes` variant
  toggles on the deployed game were dead — the panel showed, the variants
  didn't switch. They do now.
- Steadier chrome besides: no more number-flash strobe on ticking counters,
  the log glides instead of jumping, slim steel scrollbars off the text, and
  the tab rail renders without a load animation.

### Internal

- **Five illustrated estate maps** (a surveyed ezu plan, a 3-D model board, a
  cadastral register-map, a lantern-lit etched plate, and engraved kamon
  medallions) built in parallel and live behind the DEV toggle for the map
  verdict, alongside the estate-section redesign takes.
- ADR-144 retires the woodblock design canon; the UI bible is rewritten to
  steel; the attribute palette locked to steel temper-oxide colours; the
  calendar change carries a clean balance verdict (±0.0 min on every rung).

## [0.3.8] — 2026-07-06

Another tooling-only release — nothing changes for an ordinary player. It cuts a
clean build of the QA and telemetry work landed since 0.3.7, and — for this early
chapter only — folds the development harness into the deployed game so it can be
reviewed on the real build.

### Internal

- **The dev harness now rides the live build (T0-only).** During the opening
  chapter the deployed game ships the review tools — the dev panel, state
  driving, variant toggles, the balance cockpit — compiled in but **dormant**:
  an ordinary visitor sees nothing, and appending `?dev=yes` to the URL wakes
  them. A single build switch flips back to the old hard strip once the chapter
  closes, and the always-on telemetry and playtest-capture (which need a local
  server) stay stripped as before.
- **Real-play attended-time telemetry (F8).** A DEV-only, unit-proven
  sessionizer measures actual play minutes (5-min-play / 20-min-away /
  5-min-play records 10, not 30) — idle-aware, blur-excluded, taint-guarded so
  `__qa`-driven runs never pollute the data. Per-rung reports auto-drop into a
  git-ignored folder on session-end and now seed the balance-tuning flow.
  Stripped from prod. Nothing changes for the player.
- **A real end-to-end test net.** Desktop-Chromium and mobile (Android Chrome +
  iOS WebKit) Playwright lanes now drive the actual game through its story
  beats, persistence journeys and layout invariants — the reachability net that
  proves a player can still get from the cold open to the capstone. Faster boot
  and a phone-layout fix ride along.

## [0.3.7] — 2026-07-05

A tooling-only release — nothing changes for the player. It cuts a clean build
of the process work landed since 0.3.6 so the deployed version tracks HEAD.

### Internal

- **Two-pass taste flow (F10 / D-135).** Player-visible work now runs a
  constraint brief _before_ building and a 21-principle scorecard _after_, so
  taste is designed in rather than graded at the end.
- **Leaner, tagged release train (/ship v2).** The deploy reuses a persistent
  build worktree and only re-installs when the lockfile moves, exit-0 means
  "pushed" without waiting on GitHub Pages, and every release commit is now
  git-tagged so deploy messages version themselves.
- **F8 play-telemetry plan locked** and the plans index regenerated.

## [0.3.6] — 2026-07-05

Mostly an under-the-hood release: the endgame climb now takes its intended
time, saves shrank ~10×, and the intro reads snappier when you click through.

### Changed

- **The Phase-2 climb is a real climb (D-133 stopgap).** Estate deeds now bank
  the House's standing in sub-koku fractions — one day's labour barely moves a
  household's ledger — so the capstone→ascension stretch takes about as long
  as Phase 1 instead of ending in a half-minute anticlimax.
- **Economy tunings from live playtest (R10).** Raking yields a little less
  rice, autumn pays a little more for it, and eating rice costs less coin —
  the sell-vs-hold call swings closer, and a warm meal competes with free rest.
- **Saves are ~10× smaller.** The internal save is compressed and log lines are
  stored as compact descriptors rebuilt on load. Old saves and copied-out
  plain-text backups still load unchanged.

### Fixed

- Clicking through the intro now advances on a snappy beat instead of the slow
  atmospheric hold (hands-off auto-advance keeps its unhurried pacing).
- The rung-meter popover lingers a moment on mouse-out instead of vanishing the
  instant your cursor slips off it.

### Internal

- **Balance-tuning cockpit (F7 / D-134).** A DEV-only panel (DEV → Balance tab)
  of live sliders over the curated `balance.ts` feel levers: the human drags a
  lever mid-run, feels it immediately, and exports a committable diff an agent
  transcribes back to canon (D-059 — an agent never tunes on the human's behalf).
  Overrides live in the module binding + a `?bal.*` URL, never the save file, and
  the whole hook is stripped from the production bundle. Not player-facing.
- **Playtest capture inbox (F3).** In a DEV build the `` ` `` hotkey picks the
  element you're commenting on and files a note + deterministic save into
  `project/playtest-inbox/`, auto-committed; `/drain-inbox` triages it later.
- **Story authored as text (F5)** — T0 narrative now compiles from prose-first
  markdown into generated registries; **scenario-save library (F6)** — named,
  engine-generated start-states loadable from the DEV panel; **/ship release
  train (F9)** — one command: isolated build, deploy, live proof.

## [0.3.5] — 2026-07-03

Continues the T0 rebuild — the housing feature, more log/UI polish, and a
CHANGELOG that now enforces itself.

### Added

- **A home, belongings, and comfort (D-111 / F89).** The story's promised "dry
  corner and a bowl" are real now: a home reveals as you're kept on, **rest**
  happens at your own quarters, and you own **belongings** (the mat, the bowl —
  a category distinct from resources). Buy a few pieces of **comfort furniture**
  (a futon for deeper rest, a sunken hearth, a clothes chest; a "settled home" set
  bonus) — grounded comfort, never combat stat-gear. Lives in the Inventory tab.
- **A "Chat" log tab** — the optional questions you ask (in the intro and at rung
  beats) collect under **Chat**, so **Story** holds only the beats that matter.
- **A clickable version → About** modal that deep-links the changelog.

### Changed

- **The event log no longer swallows the screen (F117).** It stays a first-class
  reading column but is capped (~⅓–46%) so the workspace reads in balance; the
  work column holds the majority and fills as you unlock more.
- The transient "Now" log entries now expire on a real clock, whether or not the
  Now tab is open.
- The rung/progress display lives only in the header — the duplicate in the work
  column is gone.

### Fixed

- A version bump now **fails the build unless the CHANGELOG documents it** (a new
  `verify-changelog` gate) — this file can't drift from the shipped version again.
- The DEV New-Game / Settings controls no longer overlap in the footer.

## [0.3.4] — 2026-07-02

The autonomous T0 rebuild — a large, human-directed pass (scope locked in ADRs
D-107–D-116) that reshapes the engine, the economy, the information
architecture, and how you rank up. Verified before deploy by an adversarial
reachability + regression + prod-bundle workflow (no soft-lock; DEV tools
stripped). Balance stays liquid (D-059) — a "balance-watch" note lists tuning
items for playtest.

### Added

- **Rice · Coin · Standing economy (D-107/108/109/113).** koku the copper-coin
  currency becomes **coin** (base unit _mon_), shown in mixed
  **mon → monme → ryō** notation that reveals more denominations as you grow rich
  (1 ryō = 50 monme = 4,000 mon). **Rice** is now a real resource you rake, then
  **eat** (satiety), **store** in the kura, or **sell** for coin at a
  season-swinging price. **koku** is reserved for its true meaning — the House's
  assessed **standing** ("the House stands at N koku", toward the 10,000-koku
  daimyō line). A lost fight now bites carried coin + rice + materials; the kura
  shelters what you bank.
- **Six-tab interface, revealed as you earn it (D-112).** Work · Map · Estate ·
  Inventory · Character · Combat — each appears only once it has content. Vendors
  are **people you talk to** on the Map, not inline menus (meet Tokubei the
  pedlar); navigation and the storehouse have single, thematic homes.
- **Rank-ups are story beats (D-110).** Filling a rung meter no longer
  auto-promotes — a **summons** appears in the header; answer it to play a
  full-screen story beat (some introduce a new character; your choices are
  remembered) that _motivates_ what the rung unlocks. You can ignore it and keep
  grinding as long as you like.
- **Estate-map presentations** — seven diegetic map variants to choose from (DEV).

### Changed

- **The whole UI renders incrementally** (append-only) — no more flash/repaint on
  a tick; in-progress typewriter, meters, focus, and scroll survive.
- Location/arrival flavour moved out of the Story log into the Map description +
  a fading "Now" line; log narration speaks in consistent character voices.
- **DEV New-Game** backs up your save first, with a one-click "goto last backup".

### Fixed

- Loading a save now back-reveals the surfaces its state has already earned.
- The terminal rung (R7) no longer shows a summons that does nothing.

## [0.3.3] — 2026-07-02

Round-2 of the human-steered playtest reshape (F62–F103). _Not yet shipped and
therefore not listed here: the story-transition, estate-map and home-belongings
items remain planned._

### Added

- DEV rung menu (R0–R7 + descend) for jumping the ladder while play-testing.
- DEV New-Game backup/restore and a variant reorder in the DEV panel.
- The **1780 cold-open** — the setting's date is surfaced in the opening beat
  (D-105).
- Two **density registers** and a **persisted per-log font stepper** so the
  reader can size the log to taste.

### Changed

- The **VN intro was rebuilt append-only** — auto-advance, grayed-out "asked"
  topics, and speaker prefixes; no flash, all text typewrites, the right panel
  stays static.
- The **multi-panel workspace is now LOCKED** to the byōbu (屏風) folding layout
  plus soft cards; the exploratory variants were pruned (D-106).
- A **flavor-voice consistency pass** across the prose.
- Dev-server **HMR disabled** so a live playtest controls its own refresh (F75).

## [0.3.2] — 2026-07-02

Two bodies of work landed under this version: a PRD-reconciling mechanics build
(Plan B, A1–A10 + §C) and round-1 of the playtest UI overhaul (F1–F61).

### Added

- Full-screen **VN intro** for story-NPC introductions (D-104).
- **Log v2** — Story · Progress · Combat · Work · All · Now channels, speaker
  prefixes, and bottom-scroll.
- A **multi-panel workspace** with reveal-gated slices and layout variants (F11).
- **Bestiary** of grounded estate/near-satoyama foes (A7).
- **HUNT / CLEAR / DEFEND** quest types (A6).
- A **third T0 weapon** — the yari (A3).
- **Interior house-area reveals** (A8).
- A full-screen **error modal** on a render crash (F61).

### Changed

- **App-shell overhaul** — dark-ink theme, centered paper column, fixed
  header/footer, `100dvh`, log on the right, and a `?dev=no` true-player preview.
- **Combat reworked to the PRD's 5-attribute + accuracy/evasion model** with
  glass-cannon and tank archetypes (A1/A2).
- Estate stage labels renamed **E→U** (A4).
- A **richer mob roster** (A9); the **bandit threat moved to T2** (A10).
- **Stamina and health split** into separate recovery tracks (F22).
- Generated content/balance docs regenerated to match (§C).

## [0.3.1] — 2026-07-01

The combat-feel and spatial-map build (D-076, D-090–D-094).

### Added

- A **DEV panel** with live UI-variant toggles (D-075).
- The **kura bank** — carried (at-risk) vs banked (safe) resources, with
  deposit/withdraw at the storehouse (D-090).
- **Combat auto-modes** — fight-to-death vs auto-retreat at 20% HP, with retreat
  as a distinct third outcome (D-091).
- A **spatial map** (D-093) — activities and enemies live on walkable nodes; you
  walk to a node to act there.
- An 11th `verify` gate — **milestone-integrity** (D-054).

### Changed

- **Combat is deadlier** — HP accumulates with no free regen; hitting 0 HP is a
  loss that stops autopilot (D-076); the combat log is summarised.
- The **koku economy tightened** — a repair soft-fee and deeper coin sinks
  (D-092).
- The **displayed version is single-sourced from `package.json`**, never a git
  tag (H1).

## [0.3.0] — 2026-06-30

The macro spine closes — the T0 tier plays end-to-end (built 2026-06-29→06-30).

### Added

- **The macro spine CLOSES** — the R7 capstone opens Phase 2, estate deeds bank
  into the live House-Influence 家産 pillar (per-deed-capped), the season judges
  your high-water (70/30, ±10%), and at Excellent the manual **BIG T0→T1
  ascension ceremony** fires.
- The **contiguous T0 ladder R0→R7** (the v0.1 R3 dead-end is fixed).
- The **T0-M4 breadth** — a first quest, the koku estate-upgrade flywheel, a tiny
  market, a walkable estate map, and a diegetic dialogue mentor.
- A **found/crafted 2nd weapon** via a loot→craft loop (retiring the grant).

### Changed

- **Combat re-baseline (D-050)** — HP carries between fights and heals only by
  eating.
- Retired the **DEMO/REAL pacing fork** — real D-049 pacing is the only profile
  (D-056).

## [0.2.0] — 2026-06-27

The audit-fix prototype — turning "a beautiful chassis" into a working loop
(Lighthouse a11y 100, 98 tests).

### Added

- A wired **cold-open title screen**.
- The **reinvestment loop** (skill→yield) and real sinks — cook sansai→satiety,
  koku→estate E0→E3, attribute points→Might/Guard/Vigor.
- A **chapter-close beat**, a dream-2 mystery payoff, and a greyed 4-pillar House
  Influence macro teaser.
- **DEMO/REAL pacing profiles** and a headless `npm run pacing` report.

### Changed

- **Combat: binary → a graded rolling-frontier win-rate curve** plus a real kendo
  stance decision.
- Log **×N coalescing**, **number-pop** juice, and labour **grouped by place**.

### Fixed

- New Game / Import left the previous run's log lines in the DOM.
- The dead `migrate()` path wired and tested; a11y/label/touch-target fixes.

## [0.1.0] — 2026-06-27

The first reviewable prototype — the M0–M2 baseline (tagged `v0.1`).

### Added

- Foundation — Vite + TypeScript + Vitest + ESLint toolchain, a pure-core
  architecture, a single seeded RNG, the incremental reveal engine, and a
  multi-backend save with crash-recovery.
- The **labour loop R0→R2** — discover-by-doing skills, a season clock, and soft
  stamina.
- **First-blood combat @R3** — the grain-store wolf, seeded auto-resolve, sampled
  win-rate forecasts, and character leveling.
- **Equipment** with graded durability + repair, and a 2nd weapon.

[0.3.3]: https://github.com/Raynos/kami-kakushi
[0.3.2]: https://github.com/Raynos/kami-kakushi
[0.3.1]: https://github.com/Raynos/kami-kakushi
[0.3.0]: https://github.com/Raynos/kami-kakushi
[0.2.0]: https://github.com/Raynos/kami-kakushi/releases/tag/v0.2
[0.1.0]: https://github.com/Raynos/kami-kakushi/releases/tag/v0.1

# Changelog

All notable changes to **Kami-kakushi** are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (pre-1.0, so
the surface still moves under playtest).

Play the live build: <https://raynos.github.io/kami-kakushi/>. The displayed
in-game version is single-sourced from `package.json` (footer: `vX.Y.Z · build
<sha> · <date>`). Pre-`0.3.1` builds were tagged `v0.1` / `v0.2` in git; from
`0.3.1` on the version lives only in `package.json`, never a git tag.

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

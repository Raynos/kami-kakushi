---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append** (`doc-budgets` caps
> it at 120 lines; **every edit must bump the rewrite-debt counter at the bottom**,
> and at the threshold the doc gets rewritten fresh). The lossless record is
> [`../journal/`](../journal) — culling stale state here is correct, never a loss.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780, fictional) rural
Japan: a nameless man rises through a declining *gōshi* house. **The shipped game
is the story-bible canon** as of **v0.4.0** — the storywave T0 rewrite is live at
raynos.github.io/kami-kakushi. Canon =
[`docs/story-bible/`](../../docs/story-bible/README.md): **SEVEN tiers**
(Estate-household · Estate-land · Valley · Region · Castle-town · Domain · Edo),
time-skips, the ruin/guest-house twist, the succession knot. **T0 is BUILT &
shipped; T1+ are specced, not built** ([`prd.md`](../../docs/living/prd.md)). No
magic; no reset.

## Where we are now

- **✅ SAVE = FACTS ONLY, `src/` IS TRUTH (s180, ADR-186):** the log is a DERIVED
  VIEW — every line persists as a descriptor and re-renders from current `src/`, so a
  reword reaches every existing save (gated). Fixtures store descriptors.
- **✅ PROGRESSION = ONE MODEL, ALL TIERS (s180, ADR-182/183):** the flat-points
  rung-meter is **DEAD at every tier** — a rung promotes when its **authored
  objective-requirement list** is 100% done. PRD + roadmap + t1/t2-content rewritten;
  `prd-drift` RETIRES the dead vocabulary. **ADR-183:** every T1+ rung's list must span
  BOTH tracks — **canon, no teeth yet** (ships with T1 authoring).
- **✅ ESTATE REDESIGN (s168, ADR-177):** works chain (**HR-27**) · Works/Estate diverges (**HR-29/HR-30**) · repair verbs.
- **✅ SLEEP — TIME MOVES WITHOUT WORK (s183, ADR-187):** FB-408's day-skip, ruled
  **option D alone**: a `sleep` verb at **your woodshed corner (R4+, the only bed in the
  game)** — one press = one dawn, INSTANT. **Priced:** the day's acts are forfeited, the
  house still eats, and you slept through the pot (`SLEEP_MEAL_FRACTION`) — the belly
  SLIDES on a run of sleeps into ADR-178's teeth. The **R1 player who asked is
  deliberately unserved** (a nobody has no bed — ADR-184); that itch is content's job.
  The **sim stays SKIP-BLIND** (standing ruling) — pinned by a test.
- **✅ ZONE-REVEAL LAW (s182, ADR-184):** a zone opens **only inside a VN**; a rung-up VN
  opens **≤2** (gated). R1 opened 4 zones, 3 empty (FB-407/8/9) → now **1**. Five zones
  earn side-quest VNs (gate · kitchen · margins · reeds · sickroom); the woodshed rides to
  **R4**, where the home it promises is granted. `seenReveals` **re-arms**. Fog wave
  (s171) stands: sheet CLIPS, one viewer engine.
- **✅ BODY SPLIT (s167, ADR-178):** Body 体 (work fuel) + Belly 腹 (food store; teeth =
  rest quality) — core + two-bar UI + PRD §2.3.
- **✅ v0.4.0 STORYWAVE SHIPPED (s125–144):** bible-canon T0 live on gh-pages (tag `v0.4.0`); PRD truth-synced, freeze CANCELLED (ADR-168/169); HD-35 re-paced (ADR-172).
- **✅ FOUNDATIONS:** bible blessed (ADR-150) · UI-v2 Andon Steel + taste.md's 21-principle
  lock (ADR-144/126) · T0/T1 map sheets = the player map; T2 sheet BUILT (`?t2-map-demo`)
  — **NOT DONE: T2 rungs/fog** · Phase-2 economy · timed actions.
- **🧊 PARKED:** Plan K + the T1 emergent-node plan (`docs/plans/t1/`). Un-park = human.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **HD-40** 🔲 — **the kitchen-only pot.** Picked, BUILT, one line turns it on — held
  because the sim prices its walk at **R3 31.6 wall-min, outside the signed [3,25]
  band** (ADR-056 is yours to move). Four levers in the item.
- **HR-33** 🔲 (story) + **HR-32b** 🔲 (announce) — the four zone-reveal VNs (take A canon; **B answers "the people are pure flavor"**) + VN-only vs VN+map-ink.
- **HR-36** 🔲 (story) — the **slept-day line** (3 takes, canon = C). Your acceptance
  test: press Sleep three times running and see whether the line wears out.
- **Story picks (DEV → Story)** 🔲 — HR-18…HR-21 · **HR-27** · **HR-28**. **DEV-variant
  picks (ADR-075)** 🔲 — HR-6 · HR-5 · HR-2A–D · HR-29 · HR-30 (a pick → agent strips
  the alternates).

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint boundary
(no Math.random/pow/DOM/Date.now in `src/core`). `pnpm run verify` runs in parallel
via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**19 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets,
checkpoint, inbox-ledger, deferred-work.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **No auto-reload** — inert `/@vite/client`, FB-257. `dev`·`build`·`/ship`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, ascension, pillars, works, selectors, `content/*` incl.
  `narrative/`, `scenes`, seasons) · `src/persistence` (save layer, SCHEMA 11
  — ADR-179 derived reveal; clean-break at v10) · `src/ui` (render.ts +
  dev.ts) · `src/app/main.ts` (root +
  `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) · `src/` (code).

## How to resume

1. Read the **newest journal** + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-13-session-187-adr-embedded-work-plan-reverified.md`](../journal/2026-07-13-session-187-adr-embedded-work-plan-reverified.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → reuse the shared dev server on
   localhost:5173 (never spawn/kill your own). **`?dev=no`** for the true
   player layout. The page NEVER auto-reloads (FB-257) — F5 to pick up code.
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous):** the **ADR-log sweep**
   ([`adr-embedded-work`](../../docs/plans/opus-2026-07-12-adr-embedded-work.md), s184) —
   work agents buried in `decisions.md` instead of a plan. **S1 is docs-only, start
   there:** the log misleads *both* ways — four `BUILD TODO`s are stale (shipped), while
   ADR-068/ADR-164/ADR-184 read ✅ for mechanisms absent from `src/`. Its S4 also writes
   the still-unwritten **save-migration policy** (ADR-186 greeting ids). Then **T2
   rungs/fog** (`docs/plans/t2/…`) · **telemetry distillation** (6 FB-8 reports).
   Human-gated: **HD-40** · **HD-41** · HR-1 · **HR-34…HR-38** · older picks — **plus two
   the sweep files: the ADR-068 audio call** (the game ships muted — HR-1 would judge
   silence) and the **ADR-148 combat-timing review**, never run.
5. **Shared tree:** stage only your own files by explicit pathspec commit.
   **`VERIFY_FULL=1 pnpm run verify` before you push** — the commit lane skips
   `@slow`, so a green commit can still red the push (bit s180).

<!-- rewrite-debt: 17/20 · last full rewrite: 2026-07-11 -->

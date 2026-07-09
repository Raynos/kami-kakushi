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
is the story-bible canon** as of **v0.4.0** — the storywave T0 rewrite is live.
Canon = [`docs/story-bible/`](../../docs/story-bible/README.md): **SEVEN tiers**
(Estate-household · Estate-land · Valley · Region · Castle-town · Domain · Edo),
time-skips, the ruin/guest-house twist, the succession knot. **T0 is BUILT &
shipped; T1+ are specced, not built** ([`prd.md`](../../docs/living/prd.md)). No
magic; no reset.

## Where we are now

- **✅ STORYWAVE COMPLETE & SHIPPED v0.4.0 (s125–131, 2026-07-09):** the T0 rewrite
  to the bible is LIVE on gh-pages (`4ac1ead`, tag `v0.4.0`). All THREE storywave
  plans DONE & archived — Plan B (game, G0–G7), Plan A (docs, A0–A5: PRD
  de-bannered, renamed, `prd:drift` CLEAN), and the story-bible-finish parent.
  HR-17 signed off (Take C canon; the `hd30-nengu` diverge KEPT by human steer);
  HR-8 closed moot.
- **OWED → the playtest inbox (human steer 2026-07-09):** the rung-by-rung QA + the
  balance re-baseline (pacing went liquid across the rewrite) become future FB
  items via `/drain-inbox`, NOT a blocker. Combat curve R4+ kills still parked.
- **🧊 PARKED:** Plan K authored-depth demo (`docs/plans/t0/`; prototypes ⭐
  `project/prototypes/authored-depth-demo/`) + the T1 emergent-node plan
  (`docs/plans/t1/`). Un-park = human.
- **✅ THE BIBLE — DONE & BLESSED (s109–116, ADR-150):** 7 tier sheets · full cast ·
  register-rules law · THE FALL. The human signed off the whole read (s116).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98):** the steel palette
  (ADR-144); `taste.md` 21-principle lock (ADR-126) + the FB-10 two-pass flow.
- **✅ MAPS PLAYER-BOUND (s112–119):** T0/T1 sheets = the player map (HR-12 ✅, golden
  pin, blind-pass); T2 valley sheet BUILT (`?t2-map-demo`) — **NOT DONE: T2
  rungs/fog (§6.1).**
- **✅ PHASE-2 ECONOMY (ADR-145):** the A+B deed-source loop; FB-121 rungs (hidden
  lists + %-bar, points meter dead). **✅ TIMED ACTIONS (ADR-148):** ActionClock.

## Waiting on the human

- **HR-1** 🔲 — play/review the full T0 arc for fun & pacing (the LOOK is UI-v2
  certified; this is the fun/taste call on the live storywave build).
- **DEV-variant picks** 🔲 — kept live for a detailed pass: estate-section (HR-9) ·
  home (HR-6) · bestiary (HR-5) · the HR-2 bundle · Phase-2 build-beat + tracker
  (HR-10/HR-11). Picks → the agent strips the alternates (zero prod flag-debt).
- Closed on the storywave ship: HR-8, HR-12, HR-14, HR-16, HR-17 (→
  `human-in-the-loop/archive.md`).

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint boundary
(no Math.random/pow/DOM/Date.now in `src/core`). `pnpm run verify` runs in parallel
via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**17 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **HMR OFF** (`vite.config.ts`) — FB-5. `pnpm run dev` · `build` · `/ship`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, ascension, pillars, selectors, `content/*` incl.
  `narrative/`, `scenes`, seasons) · `src/persistence` (save layer, SCHEMA 10,
  clean-break) · `src/ui` (render.ts + dev.ts) · `src/app/main.ts` (root +
  `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (process) · `src/` (code).

## How to resume

> 🎮 **v0.4.0 "the storywave release" shipped 2026-07-09 via `/ship`** — the
> bible-canon T0 rewrite (six-season year, kura economy, body economies, new cast).
> Live at raynos.github.io/kami-kakushi. Session 133 then AUDITED the whole wave
> (6-agent review + map-sheets audit): ship real, engine sound, no src/ criticals —
> but two closure debts are now mapped in two PROPOSED plans (awaiting the human's
> read): `docs/plans/fable-2026-07-09-storywave-closure.md` (A5 doc staleness ·
> B-fixes · C4 "switch the written world on") and
> `docs/plans/fable-2026-07-09-map-sheets-fixes.md` (ensemble blind-pass first —
> the loop proved noisy — then redraw only robust fails).

1. Read the **newest journal** (then skim prior) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-09-session-134-storywave-closure-execution.md`](../journal/2026-07-09-session-134-storywave-closure-execution.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced): `window.__qa` / `node src/scripts/qa-shots.mjs`.
4. **Next (autonomous): the storywave-closure plan is IN EXECUTION (s134,
   Fable, human-ruled forks — ADR-166 refusing gate · ADR-167 full fiction
   wave; rulings in `feedback-human/2026-07-09-storywave-closure-rulings.md`).**
   Resume it phase-by-phase (C1→C5, per the plan's Status + this journal).
   Also startable: **T2 rungs/fog** (plan ready + human-greenlit:
   `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`) · map-sheets-fixes
   (PROPOSED) — its P2 denylist test coordinates with closure C1.1 (O-Sato).
   Combat R4+ = a design call, NOT a fix → inbox.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

<!-- rewrite-debt: 3/20 · last full rewrite: 2026-07-09 (bump on every edit; rewrite at 20) -->

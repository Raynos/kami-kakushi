---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append** (`doc-budgets` caps
> it at 120 lines). The lossless record is [`../journal/`](../journal) — deleting
> stale state here is correct, never a loss. No dated "Phase update" bullets.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780, fictional) rural
Japan: a nameless man rises through a declining *gōshi* house. **BUILT game** =
the 6-tier PRD (T0 shipped; spec [`prd.md`](../../docs/living/prd.md)).
**FORWARD canon = the STORY REBOOT** ([`docs/story-bible/`](../../docs/story-bible/README.md)):
**SEVEN tiers** (Estate-household · Estate-land · Valley · Region · Castle-town ·
Domain · Edo), time-skips, the ruin/guest-house twist, the succession knot.
The built T0 ships until the reboot's build wave replaces it. No magic; no reset.

## Where we are now

- **✅ STORYWAVE GAME (Plan B) SHIPPED v0.4.0 (s125–131, 2026-07-09):** the T0
  rewrite to the bible is LIVE on gh-pages (`4ac1ead`, tag `v0.4.0`). G0–G7 done;
  Plan B archived; HR-17 signed off (Take C, diverge KEPT by steer); HR-8 moot.
  **Wrap-up REMAINING (tomorrow, coupled):** rung-by-rung QA → OWED balance
  re-baseline → **Plan A's A5** (strip PRD forward-spec banners · shigemasa→munemasa
  · add new T0 nodes/quests · `prd:drift` clean · qa-playtesting pacing re-anchor,
  which needs the re-baseline) → archive Plan A + story-bible-finish.
- **🧊 PLAN K PARKED (s127):** authored-depth demo (`docs/plans/t0/`) — §U =
  the Asking + clue-book after 5 failed feel-tests (§R = the law; prototypes
  ⭐ `project/prototypes/authored-depth-demo/`). Un-park = human, post-v0.4.0.
- **PRD** — `prd.md` = stub index → `docs/living/prd/*` (seven-tier per s118
  ripple); §4 + §7 MS2–MS7 provisional (ADR-059).
- **v0.3.0–v0.3.7 shipped** T0 MS0–MS4 (FB-1–117), the T0 rebuild
  (ADR-107–125; R7 cap → T1).
- **✅ THE TASTE LOCK (ADR-126, s57):** `taste.md` (21 principles, capped) ·
  generated tokens · `doc-budgets` gate · FB-10 two-pass flow (ADR-135).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98, 2026-07-06):** M1–M7
  (tokens/fonts · materials · Andon rail|desk|log-window + phone band · GBA
  cold open · VN/ceremony heat · variants steel-native · **ADR-144** retires
  the woodblock locks) + drains FB-127–FB-172.
- **✅ T0/T1 MAPS PLAYER-BOUND, HR-12 ✅ (s112–117, ADR-149/151):** the sheet =
  THE player map. Drain · reveal mech · blind-pass all-M · golden pin · Phase C
  closed · s117 guides+skill+runner — non-Fable map builds; spec→HR→build.
- **🔧 T2 VALLEY MAP BUILT (s119, `?t2-map-demo`):** spec §6 drawn (demoted
  estate + Asagiri); pinned, verify-green. **NOT DONE §6.1: no T2 rungs/fog.**
- **✅ PHASE-2 ECONOMY (ADR-145, s100):** A+B loop — 5 deed sources · deed-gated
  U1–U4+E1 beats · tracker diverge (HR-11). **✅ FB-121 RUNGS (ADR-137):** points
  meter DEAD — hidden lists, %-bar. RESIDUE: R4+ kills parked (curve retune).
- **✅ THE BIBLE — DONE & BLESSED (s109–116, ADR-150):** all 7 tier sheets ·
  full cast · origin relocked warm (Tahei) · use-name **GONBEI** · register
  rules law · THE FALL · the salvage/audit cross-check ruled in (law §0.5.7,
  Kihei's "…"-react, D5 wants). **The human signed off the whole read (s116);
  ADR-150 minted** — the frame ADR is the build wave's charter.
- **✅ TIMED ACTIONS (ADR-148, s105):** every action `timed`/`instant` ·
  **ActionClock** · in-button bar (HR-14 ✅). INTERIM: economy unbal. R3+.

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (HR-1) — play/review the full T0 arc for fun & pacing
  (the LOOK is now certified — UI-v2 PH5, s98).
- **DEV-variant picks** 🔲 — ALL KEPT live by the human's call (s98) for a
  detailed pass: estate-section A/B/C (HR-9) · home A/B/C (HR-6) · bestiary
  (HR-5) · the HR-2 bundle. Picks → I strip (zero flag-debt).
- **Phase-2 story + tracker picks** 🔲 — HR-10 (the estate-build beat take:
  ledger canon vs land/heir alternates) · HR-11 (tracker A ladder / B rail /
  C ledger); PH5 fun-certification of the new ~65-min Phase 2 rides HR-1.
- **Graphics slate DONE/archived (s124):** E1.4/E3.4 gated on Plan B (HR-16 closed · E2 parked · E3 good-later).

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 side-quests** → T1 · **status-token ladder** → T1–T5 · home grows w/
rung · NPC placement (FB-113) · node-discovery T1+ tail → `BACKLOG.md`.

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `pnpm run verify` runs
in parallel via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**17 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **HMR OFF** (`vite.config.ts`) — FB-5. `pnpm run dev` · `build` · `build:itch`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, fight, ascension, pillars, selectors, format, `content/*`
  incl. `rungBeats.ts`/`people.ts`) · `src/persistence` (save layer, SCHEMA 6) ·
  `src/ui` (render.ts + reconcile.ts + styles.css) · `src/app/main.ts` (composition
  root + `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (agentic process) · `src/` (code).

## How to resume

> 🎮 **v0.3.9 "the steel release" shipped 2026-07-06 via `/ship`** (the full
> Andon Steel UI-v2 + drains FB-127–172 + the deployed-variant-toggle fix,
> ADR-138 axis; gh-pages `a337ab6` ← main `3ebeef0`). Live at
> raynos.github.io/kami-kakushi. Open = the human queue above.

1. Read the **newest journal** (then skim prior sessions) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-09-session-131-hd30-prose-wave.md`](../journal/2026-07-09-session-131-hd30-prose-wave.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER a headed browser, incl.
   subagents): `window.__qa` / `node src/scripts/qa-shots.mjs`; `newGame()` resets.
4. **Next — Plan A's A5 closure** (UNBLOCKED — Plan B SHIPPED v0.4.0): strip PRD
   forward-spec banners · shigemasa→munemasa · add T0 nodes/quests · `prd:drift`
   clean · qa-playtesting pacing re-anchor; then archive Plan A + story-bible-finish.
   Best done tomorrow with the QA + balance re-baseline (pacing anchors couple).
5. **Shared tree:** stage only your own files by explicit pathspec commit.

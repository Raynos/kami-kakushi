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

A grounded, story-driven **incremental RPG** in mid-Edo (1780, An'ei 9, fictional)
rural Japan. A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining
lower-samurai (*goshi*) estate (the **Kurosawa** house) and rises through **6 tiers**
(T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town ·
T5 Edo). **v1 scope = T0→T3.** Signature: **the UI itself unlocks incrementally.**
No magic; growth only through perseverance; no reset.
Spec: [`../../docs/living/prd.md`](../../docs/living/prd.md).

## Where we are now

- **PRD V2.3** — 6-tier reshape rippled; `prd.md` = a stub index →
  `docs/living/prd/*`; §4 + §7 MS2–MS7 provisional (ADR-059).
- **v0.3.0–v0.3.7 shipped** the full T0 MS0–MS4 arc (FB-1–FB-117), the
  autonomous T0 rebuild (**ADR-107–ADR-116**) + the v0.3.5 deltas
  (**ADR-118–ADR-125**; R7 capstone designed, build → T1).
- **✅ THE TASTE LOCK (ADR-126, s57):** `taste.md` (21 principles, capped) ·
  generated tokens · `doc-budgets` gate · FB-10 two-pass flow (ADR-135).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98, 2026-07-06):** M1–M7
  (tokens/fonts · materials · Andon rail|desk|log-window + phone band · GBA
  cold open · VN/ceremony heat · variants steel-native · **ADR-144** retires
  the woodblock locks) + drains FB-127–FB-172. **Five REAL illustrated estate
  maps** (ezu · model board · cadastral · lantern · kamon) live for HR-7.
- **✅ Process/e2e/narrative infra COMPLETE** (s77–s94): FB-1–FB-10 wave ·
  e2e lane + **ADR-141/142** · s90 hardening (**ADR-140**) · **ADR-139
  narrative diverge** (first real bundle: `estate-build-beats`, s100).
- **✅ THE PHASE-2 ECONOMY (ADR-145, s100, 2026-07-07):** the A+B loop shipped —
  5 deed sources (estate-relevant only) · deed-gated U1–U4 staged build with
  reveal + E1 "estate stands" beats · build-tracker diverge (HR-11) · textured
  sim loop + report-only texture metrics · retuned in-band (ratio 0.93–0.94,
  15/15; deed base 0.04→0.05) · PRD ripple + `t0-deed-sources` gen-region.
  Plan archived. **✅ FB-121 REQUIREMENTS RUNGS (ADR-137, s101):** the points
  meter is DEAD — authored hidden lists per rung, %-bar, ADR-139-locked flavor
  (HR-12/HR-13 ✅). RESIDUE: R4+ predator kills parked (combat-curve retune).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (HR-1) — play/review the full T0 arc for fun & pacing
  (the LOOK is now certified — UI-v2 PH5, s98).
- **DEV-variant picks** 🔲 — ALL KEPT live by the human's call (s98) for a
  detailed pass: **the map H–L** (five real-map takes + interim B/G, HR-7) ·
  estate-section A/B/C (HR-9) · home A/B/C (HR-6) · bestiary (HR-5) · the HR-2
  bundle. Picks → I strip (zero flag-debt) + land the two-column Map tab with
  the map winner.
- **Two small calls** 🔲 (s98 flags): re-express spoilage/autumn on days after
  the 24× calendar? · does R0–R2 read fine with no header wealth (FB-166/171)?
- **Phase-2 story + tracker picks** 🔲 — HR-10 (the estate-build beat take:
  ledger canon vs land/heir alternates) · HR-11 (tracker A ladder / B rail /
  C ledger); PH5 fun-certification of the new ~65-min Phase 2 rides HR-1.
- **Rung cast + R0→R7 beats** 🔲 (HR-8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **Story track kickoffs** 🔲 — the 2 TODOs: fable story **audit**, then the
  fable **beat redesign** (fresh sessions, ADR-139-bundled).


(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 · **status-token ladder** → T1–T5 · home
grows w/ rung · NPC placement (FB-113) · `emergent-node-actions` (Phase 0).

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
> ADR-138 axis; gh-pages `a337ab6` ← main `3ebeef0`; Pages was still
> propagating at ship time — `ship.sh --verify-live` to confirm). Live at
> raynos.github.io/kami-kakushi. Open = the human queue above.

1. Read the **newest journal** (then skim prior sessions) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (pnpm run checkpoint — do not edit inside) -->
   [`journal/2026-07-07-session-105-inbox-drain-timed-actions-plan.md`](../journal/2026-07-07-session-105-inbox-drain-timed-actions-plan.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** — UI-v2 DONE+certified (s98; human picks remain),
   FB-121 DONE+signed (s101). **Story-quality plan** (`fable-2026-07-06-story-quality-ladder.md`): 19
   answers in, HUMAN-GATED — approval → ADR → bible co-write. Phase-2 economy =
   human-parked (`BACKLOG.md`). Balance liquid (ADR-059) — changes run ADR-132
   (the 24× calendar did, Δ0.0). A co-agent owns the verify-budget trim.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

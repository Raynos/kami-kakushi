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

- **PRD V2.3** — 6-tier reshape rippled; `prd.md` = a stub index → `docs/living/prd/*`;
  §4 balance + §7 MS2–MS7 provisional (ADR-059).
- **v0.3.0–v0.3.7 shipped** the full T0 MS0–MS4 arc (FB-1–FB-117), the autonomous
  T0 rebuild (**ADR-107–ADR-116**: append-only renderer · koku=standing economy ·
  7-tab IA · rung VN beats · SCHEMA 6 · changelog gate) + the v0.3.5 deltas
  (**ADR-118–ADR-125**; R7 capstone designed, build → T1).
- **✅ THE TASTE LOCK (ADR-126, s57):** `taste.md` (21 principles, capped) ·
  generated tokens · `doc-budgets` gate · FB-10 two-pass flow (ADR-135).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98, 2026-07-06, one day):**
  M1–M7 built (tokens/fonts · materials · Andon rail|desk|log-window + phone
  band · GBA cold open · VN/ceremony + vermillion heat · variants steel-native
  · doc ripple **ADR-144** retiring the woodblock locks). Drains FB-127–FB-172
  landed alongside (unbounded durable log · in-modal rung ceremony · 24×
  calendar Δ0.0-verified · header minimalism — wealth + clock out). **Five
  REAL illustrated estate maps** (map-h…l: ezu · model board · cadastral ·
  lantern · kamon) built by parallel xhigh subagents, live for the HR-7 pick.
- **✅ Process/e2e/narrative infrastructure COMPLETE** (s77–s94): the FB-1–FB-10
  wave (CI · inbox · sim · saves · cockpit · /ship · taste two-pass · telemetry)
  · the 3-project e2e lane + HD-23/24 (**ADR-141/142**) · s90 hardening
  (**ADR-140**) · **ADR-139 narrative diverge** (takes compiler + Story
  surfaces + galley reader; `takes/` awaits the first real bundle).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (HR-1) — play/review the full T0 arc for fun & pacing
  (the LOOK is now certified — UI-v2 PH5, s98).
- **DEV-variant picks** 🔲 — ALL KEPT live by the human's call (s98) for a
  detailed pass: **the map H–L** (five real-map takes + interim B/G, HR-7) ·
  estate-section A/B/C (HR-9) · home A/B/C (HR-6) · bestiary (HR-5) · the HR-2
  bundle. Picks → I strip (zero flag-debt) + land the two-column Map tab with
  the map winner.
- **Two small calls** 🔲 (s98 flags): seasonal spoilage/autumn now epoch-rare
  after the 24× calendar — re-express on days?; and does R0–R2 play fine with
  NO wealth readout pre-Inventory (rice+coin left the header, FB-166/171)?
- **Rung cast + R0→R7 beats** 🔲 (HR-8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **Story track kickoffs** 🔲 — the 2 TODOs: fable **audit** of story/narrative,
  then the fable **beat redesign** (fresh sessions; the redesign = the first
  real ADR-139 bundle, reviewed in the new Story surfaces).


(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 (`capstone-t0-branch.md`) · **status-token
ladder** → T1–T5 · home grows w/ rung · NPC placement (FB-113) · balance feel-tune
· `emergent-node-actions` (Phase 0).

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
   [`journal/2026-07-07-session-100-phase2-economy-lock.md`](../journal/2026-07-07-session-100-phase2-economy-lock.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** — UI-v2 is DONE+certified (s98); what remains on it
   is human picks (above) then the strips. Startable without the human:
   **requirements rung progression** (ADR-137, human phase-confirm pending).
   **Story-quality plan** (`fable-2026-07-06-story-quality-ladder.md`): 19
   answers in, HUMAN-GATED — approval → ADR → bible co-write. Phase-2 economy =
   human-parked (`BACKLOG.md`). Balance liquid (ADR-059) — changes run ADR-132
   (the 24× calendar did, Δ0.0). A co-agent owns the verify-budget trim.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

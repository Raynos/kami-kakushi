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

- **PRD V2.3** — 6-tier reshape rippled; `prd.md` = a stub index →
  `docs/living/prd/*`; §4 + §7 MS2–MS7 provisional (ADR-059).
- **v0.3.0–v0.3.7 shipped** the full T0 MS0–MS4 arc (FB-1–FB-117), the T0
  rebuild (**ADR-107–116**) + v0.3.5 deltas (**ADR-118–125**; R7 cap → T1).
- **✅ THE TASTE LOCK (ADR-126, s57):** `taste.md` (21 principles, capped) ·
  generated tokens · `doc-budgets` gate · FB-10 two-pass flow (ADR-135).
- **✅ UI-v2 Andon Steel SHIPPED + PH5-CERTIFIED (s98, 2026-07-06):** M1–M7
  (tokens/fonts · materials · Andon rail|desk|log-window + phone band · GBA
  cold open · VN/ceremony heat · variants steel-native · **ADR-144** retires
  the woodblock locks) + drains FB-127–FB-172. HR-7 ✅ (絵図 map pick — superseded by ADR-151 below).
- **✅ Process/e2e/narrative infra** (s77–s94): FB-1–10 · e2e lane
  (ADR-141/142) · s90 hardening (ADR-140) · ADR-139 story diverge.
- **✅ T0/T1 MAPS PLAYER-BOUND, HR-12 ✅ (s112–115, ADR-149/151):** the sheet =
  THE player map. Drain · rung-reveal mech · blind-pass-3 all-M · golden pin.
- **✅ THE PHASE-2 ECONOMY (ADR-145, s100):** the A+B loop shipped — 5 deed
  sources · deed-gated U1–U4 staged build + E1 beats · tracker diverge (HR-11)
  · retuned in-band · PRD rippled. **✅ FB-121 REQUIREMENTS RUNGS (ADR-137,
  s101):** points meter DEAD — authored hidden lists, %-bar, locked flavor
  (HR-12/13 ✅). RESIDUE: R4+ predator kills parked (combat-curve retune).
- **✅ THE BIBLE — DONE & BLESSED (s109–116, ADR-150):** all 7 tier sheets ·
  full cast · origin relocked warm (Tahei) · use-name **GONBEI** · register
  rules law · THE FALL · the salvage/audit cross-check ruled in (law §0.5.7,
  Kihei's "…"-react, D5 wants). **The human signed off the whole read (s116);
  ADR-150 minted** — the frame ADR is the build wave's charter.
- **✅ TIMED ACTIONS (ADR-148, s105):** press→instant is DEAD — every action
  `timed{duration,cooldown}` or `instant` (total, compile-enforced) · shell
  **ActionClock** (one global, drop-on-interrupt, auto = go-again) · in-button
  bar (the human's A+C mix, HR-14 ✅) · per-edge travel · targets ÷ wall-cost
  (G-PACING holds R0–R2). **INTERIM: economy NOT rebalanced (human)** — R3+
  balloons; suspended gates in `envelopes.ts` ADR148_INTERIM re-enable then.

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (HR-1) — play/review the full T0 arc for fun & pacing
  (the LOOK is now certified — UI-v2 PH5, s98).
- **DEV-variant picks** 🔲 — ALL KEPT live by the human's call (s98) for a
  detailed pass: estate-section A/B/C (HR-9) · home A/B/C (HR-6) · bestiary (HR-5) · the HR-2
  bundle. Picks → I strip (zero flag-debt). (HR-7 map ✅ picked: 絵図 survey
  plan shipped; two-column Map tab still queued.)
- **Phase-2 story + tracker picks** 🔲 — HR-10 (the estate-build beat take:
  ledger canon vs land/heir alternates) · HR-11 (tracker A ladder / B rail /
  C ledger); PH5 fun-certification of the new ~65-min Phase 2 rides HR-1.

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 · **status-token ladder** → T1–T5 · home
grows w/ rung · NPC placement (FB-113) · node-discovery T1+ tail → `BACKLOG.md`.

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
   [`journal/2026-07-08-session-117-map-spec-graduates.md`](../journal/2026-07-08-session-117-map-spec-graduates.md)
   <!-- gen:end resume-journal -->
2. `pnpm install` → `pnpm run verify` (green) → `pnpm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. FB-5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next** — **the STORYWAVE twin plans** (s116, supersede the finish plan's
   B): the human READS `docs/plans/fable-2026-07-07-storywave-{docs,game}.md`
   (PRD/ADR ripple · the T0 re-implementation) → two ⬩Opus executors run
   them IN PARALLEL per their §S seam. The T0 prose wave is DONE in
   `src/core/content/narrative/t0v2/` — ONE version ships (2026-07-08 ruling;
   VERDICT picks canonical, alternates archived). Clean-break saves.
5. **Shared tree:** stage only your own files by explicit pathspec commit.

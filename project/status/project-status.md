---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **A SNAPSHOT, not a log — REPLACE in place, never append** (the `doc-budgets`
> gate caps it at 120 lines). The lossless record is [`../journal/`](../journal),
> so deleting stale state here is correct, never a loss. No dated "Phase update"
> bullets — those are journal entries.

## The game

A grounded, story-driven **incremental RPG** in mid-Edo (1780, An'ei 9, fictional)
rural Japan. A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining
lower-samurai (*goshi*) estate (the **Kurosawa** house) and rises through **6 tiers**
(T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town ·
T5 Edo). **v1 scope = T0→T3.** Signature: **the UI itself unlocks incrementally.**
No magic; growth only through perseverance; no reset.
Spec: [`../../docs/living/prd.md`](../../docs/living/prd.md).

## Where we are now

- **PRD V2.3** — the 6-tier reshape is fully rippled; `prd.md` is a stub index →
  per-section files `docs/living/prd/*`. §4 balance + §7 M2–M7 stay provisional (D-059).
- **v0.3.0–v0.3.5 shipped** the full T0 M0–M4 arc (F1–F117) + the **autonomous
  T0 rebuild** (2026-07-03, ADRs **D-107–D-116**): append-only render engine ·
  economy re-core (koku=House **standing**) · 7-tab IA · estate-map · rung VN
  beats (SCHEMA 6) · `CHANGELOG.md` + `verify-changelog` gate.
- **✅ Agent-default audit + v0.3.5 deltas** (ADRs **D-118–D-125**: 7-tab IA ·
  rice spoilage/cap · cook/storage · R5 wall-weapon · home→R3). **R7 capstone**
  DESIGNED (D-125), build DEFERRED to T1. `emergent-node-actions` → a plan.
- **✅ THE TASTE LOCK (D-126, s57):** top layer locked WITH the human → `taste.md`
  (pyramid, 21 principles, 150-cap) · `ui-design.md` 1159→351 (tokens GENERATED)
  · `doc-budgets` gate · **F10 re-plan FIRED**.
- **✅ UI-v2 direction LOCKED (R9 → D-127): 10 Andon Steel** (blackened-steel
  bimetal · silver=state/gold=value/vermillion=commit · GBA typewriter cold-open).
  01–09 anchored in `ui-demos/`; the `src/` port is a future build, washi ships
  till then. Resolves D-126's "visual identity provisional pending R9".
- **Philosophy** R1–R6 + taste T1–T4 + process canon D-086–089.
- **D-117 frontier PRD + the process wave** — §4 ripple-frozen; F1–F10 ordered by
  `fable-process-master-plan.md`. **BUILT: `prd:drift`+sweep-guard · F1a/F1b ·
  F2 CI · ✅ F4 balance sim (D-132) · ✅ F3 capture inbox + `/drain-inbox` · ✅ F6
  scenario saves · ✅ F5 narrative format (s74) · ✅ F7 balance cockpit (s76 — DEV
  Balance tab, `?bal.*` URLs, export→inbox, **D-134**). NEXT: F8 or Phase-2 redesign.**
- **✅ H19/H20 CLOSED (2026-07-04):** H20→B (freshness WARN stays soft).
  **H19→D-133:** Phase 2 ≈ Phase 1 (~1:1), general per-tier rule → hard
  `verify:balance` **ratio gate** `[0.8, 1.2]`. Stopgap **hotfix shipped**
  (fractional sub-koku deeds → greedy Phase 2 0.94:1; 480-koku gate/fiction
  intact). Real Phase-2 **redesign** planned + queued
  (`opus-2026-07-04-phase2-economy-redesign.md`) — needs a human direction call.

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (R1) — play/review the **freshly-redeployed** T0 (VN intro,
  log v2, **7-tab IA**, economy re-core + rice spoilage/cap, estate-map, rung beats,
  R5 wall-weapon).
- **DEV-variant picks** 🔲 — live in the DEV panel: estate-map **V5A–G** (R7),
  home/Inventory **A/B/C** (R6, now BUILT — list · 一間 room · 持ち物帳 ledger) +
  older surfaces (R2/R5). Pick each live → I strip the rest (zero flag-debt).
- **Balance-watch** — ✅ **R10 CLOSED (s76):** human adopted the F7 W1–W4 tunings
  (`RICE_PER_RAKE 3→2`, `autumn 3→4`, `EAT_RICE_COST 3→2`; W4 no-op). Still liquid.
- **Rung cast + R0→R7 beats** 🔲 (R8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **UI-v2 build** ⏳ — R9 CLOSED (10 Andon Steel, D-127). Open: are R2/R5/R6/R7
  (washi-UI picks) still wanted as interim polish now UI-v2 supersedes them?

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 (`capstone-t0-branch.md`) · **status-token
ladder** → T1–T5 · home grows w/ rung · NPC placement (F113) · balance feel-tune
· `emergent-node-actions` (Phase 0).

## Toolchain

Vite 5 + TS (strict, `tsgo`) + Vitest 2 + oxlint + oxfmt. Pure-core oxlint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` runs
in parallel via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (npm run checkpoint — do not edit inside) -->
**17 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
**`pre-commit`** runs `verify` + reading-queue/journal/snapshot gates; **`pre-push`**
blocks red. **HMR OFF** (`vite.config.ts`) — F5. `npm run dev` · `build` · `build:itch`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, fight, ascension, pillars, selectors, format, `content/*`
  incl. `rungBeats.ts`/`people.ts`) · `src/persistence` (save layer, SCHEMA 6) ·
  `src/ui` (render.ts + reconcile.ts + styles.css) · `src/app/main.ts` (composition
  root + `window.__qa`) · `src/scripts/*`. ADR ledger: `docs/living/decisions.md`.
- **3 top-level dirs:** `docs/` (truth) · `project/` (agentic process) · `src/` (code).

## How to resume

> 🎮 **T0 rebuild + agent-default-audit (v0.3.5): COMPLETE + deployed 2026-07-03.**
> On `origin/main` (green), live at raynos.github.io/kami-kakushi; ADRs **D-107–D-125**.
> Open = the human queue above; the deferred tail (R7-capstone once **T1**) is next.

1. Read the **newest journal** (then skim prior sessions) + `todo-human.md` for forks:
   <!-- gen:begin resume-journal (npm run checkpoint — do not edit inside) -->
   [`journal/2026-07-05-session-78-f9-ship-skill.md`](../journal/2026-07-05-session-78-f9-ship-skill.md)
   <!-- gen:end resume-journal -->
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. F5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** = **F8 play-telemetry** (next in the wave;
   F1a/F1b/F2/F3/F4/F5/F6/F7 ✅) — OR the **Phase-2 economy redesign**
   (`opus-2026-07-04-phase2-economy-redesign.md`, higher game-impact); the human
   owns that direction call. Balance liquid (D-059) — every balance change runs
   the D-132 flow (`verify:balance` → report diff → `--summary`).
5. **Shared tree:** stage only your own files by explicit pathspec commit.

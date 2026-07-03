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
- **v0.3.0–v0.3.3 shipped** the T0 M0–M4 arc + playtests (F1–F85): combat, bank,
  map, Bestiary, quests, VN intro (D-104), log v2, cold-open.
- **✅ AUTONOMOUS T0 REBUILD — COMPLETE + DEPLOYED** (2026-07-03, v0.3.5; ADRs
  **D-107–D-116**; all **F86–F117 ✅**). **Eight lanes:** append-only render engine
  (`reconcile.ts`) · economy re-core Ph1–4 (koku→coin+rice, koku=House **standing**,
  D-107/108/109/113) · IA tab reorg (vendors-as-people, nav→Now, D-116) · estate-map
  diverge (7 variants, F102) · rung-up story VN beats (D-110, SCHEMA 5→6) · log/UI
  polish · deep housing T0 (D-111) · combat-log voice. + `CHANGELOG.md` + the 12th
  gate `verify-changelog` (A21).
- **✅ Agent-default audit + v0.3.5 deltas (`origin/main` green + REDEPLOYED):**
  6 T0 plans verified→archived; agent defaults walked with the human → ADRs
  **D-118–D-125** (7-tab IA · rice spoilage/kura cap · cook/storage · R5
  wall-weapon token · home→R3). **R7 capstone** DESIGNED (D-125) → build
  DEFERRED to T1 (`capstone-t0-branch.md`). `emergent-node-actions` → a plan.
- **✅ THE TASTE LOCK (D-126, s57):** top layer locked WITH the human (4 values ·
  3 touchstones · proto23/YAIR refs, shots in `raw/screenshots/`) → **`taste.md`
  rewritten** (pyramid, 21 principles, 150-cap) · **`ui-design.md` 1159→351**
  (vision provisional→R9; tokens GENERATED → `docs/content/ui-tokens.md`) ·
  workshop bar → qa§9 · AGENTS.md **T1–T4 register** · 13th gate **`doc-budgets`**
  · **prediction test 24/24** · ⭐ TODO closed; **F10 re-plan trigger FIRED**.
- **Fable parallel:** six T0 remaster variants (R9), mobile pass landed — live
  at <https://kami-kakushi-ui-demos.vercel.app> (s56).
- **Philosophy** R1–R6 + taste T1–T4 + process canon D-086–089.
- **D-117 frontier PRD + the process wave** — §4 ripple-frozen; process plans
  queued, **ordered F1–F10 by `fable-process-master-plan.md`**. BUILT so far:
  `prd:drift` + sweep-guard.

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (R1) — play/review the **freshly-redeployed** T0 (VN intro,
  log v2, **7-tab IA**, economy re-core + rice spoilage/cap, estate-map, rung beats,
  R5 wall-weapon).
- **DEV-variant picks** 🔲 — live in the DEV panel: estate-map **V5A–G** (R7),
  home/Inventory **A/B/C** (R6, now BUILT — list · 一間 room · 持ち物帳 ledger) +
  older surfaces (R2/R5). Pick each live → I strip the rest (zero flag-debt).
- **Balance-watch** 🔲 — 4 D-059 feel-calls best tuned by **playing**; the
  balance-cockpit plan (fable-process-F7) is the tuning aid.
- **Rung cast + R0→R7 beats** 🔲 (R8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **UI-remaster variants** 🔲 (R9, Fable) — **shortlisted 6 → 3** (01 Moonlit ·
  04 Lacquer · 06 Washi). Winner → the D-075 diverge. **R9 now also resettles
  the visual identity** (D-126: woodblock/ink is provisional, not hard canon).

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → T1 (`capstone-t0-branch.md`) · **status-token
ladder** → T1–T5 · home grows w/ rung · NPC placement (F113) · balance feel-tune
· `emergent-node-actions` (Phase 0).

## Toolchain

Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` runs
in parallel via `verify-run.ts` (roster: [`gates.ts`](../../src/scripts/gates.ts)):
<!-- gen:begin gate-roster (npm run checkpoint — do not edit inside) -->
**14 gates**: tsc, eslint, prettier, vitest, verify-content, verify-prd,
gen-docs, pacing, playcheck, md-links, milestone-integrity, verify-changelog,
doc-budgets, checkpoint.
<!-- gen:end gate-roster -->
Docs-only: `SKIP_CODE_VERIFY=1` (docs lane runs, ~0.3s; `SKIP_VERIFY=1` last resort).
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

> 🎮 **T0 rebuild + the agent-default-audit v0.3.5 deltas are COMPLETE + deployed
> (2026-07-03).** Everything is on `origin/main` (green) + live at
> raynos.github.io/kami-kakushi. Scope in ADRs **D-107–D-125**. What's open is the
> human async queue above; the deferred/owed tail (led by the R7-capstone build once
> **T1** exists) is the next autonomous work.

1. Read the **newest journals** (`journal/2026-07-03-session-57-taste-transfer-architecture.md`
   — the taste lock/redo arc — then s54/s56) + `todo-human.md` for the open forks.
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. F5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** = the **F10 full re-plan** (taste scorecards vs the 21
   principles — its trigger fired at the D-126 lock), then the F1+ process wave /
   the deferred tail above. Balance liquid (D-059).
5. **Shared tree:** stage only your own files by explicit pathspec commit.

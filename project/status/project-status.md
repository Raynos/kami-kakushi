---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> **This file is a SNAPSHOT, not a log. REPLACE in place — do NOT append.** Keep
> it to one screen (~a `pre-commit` cap enforces it). The lossless "how it got
> here" record is [`../journal/`](../journal) — so deleting stale state here is
> correct, never a loss. **No dated "Phase update — (session-NN)" bullets** — those
> are journal entries; if you're tempted to add one, you're writing the wrong file.

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
- **v0.3.0–v0.3.3 shipped** the T0 M0–M4 arc + playtest rounds 1–3 (F1–F85):
  combat, bank, spatial map, Bestiary, quests, VN intro (D-104), log v2, 1780 cold-open.
- **✅ AUTONOMOUS T0 REBUILD — COMPLETE + DEPLOYED** (2026-07-03, v0.3.5; ADRs
  **D-107–D-116**; all **F86–F117 ✅**). **Eight lanes:** append-only render engine
  (`reconcile.ts`) · economy re-core Ph1–4 (koku→coin+rice, koku=House **standing**,
  D-107/108/109/113) · IA tab reorg (vendors-as-people, nav→Now, D-116) · estate-map
  diverge (7 variants, F102) · rung-up story VN beats (D-110, SCHEMA 5→6) · log/UI
  polish · deep housing T0 (D-111) · combat-log voice. + `CHANGELOG.md` + the 12th
  gate `verify-changelog` (A21).
- **✅ Agent-default audit + v0.3.5 deltas (this session, `origin/main` green +
  REDEPLOYED):** 6 T0 plans verified→archived; every agent-picked default walked
  through with the human → ADRs **D-118–D-125**. Shipped: **7-tab IA** (Quests
  regains its own tab @R5, D-119) · **rice spoilage + upgradeable kura cap** (D-118)
  · Now-view append-only · hearth→cook / chest→storage (D-120) · **R5 wall-weapon
  status token** (D-122) · home reveal→R3. **R7 capstone** DESIGNED (D-125 — the
  reusable pattern + the 3×3 board) → **build DEFERRED to T1** (T1 doesn't exist
  yet, R6; graduated to `docs/living/capstone-t0-branch.md`). Subagents inherit the
  parent's model (**D-124**). `emergent-node-actions` graduated to a plan.
- **Fable parallel:** six T0 remaster variants (R9) — **mobile pass landed**:
  six + gallery phone-ready, desktop unchanged (VARIANT-SPEC §4) — pushed and
  live at <https://kami-kakushi-ui-demos.vercel.app> (prod redeployed, s56).
- **Philosophy** R1–R6 + **process canon** D-086–089 (tension>generosity · loop
  done-rule · e2e+invariants DoD · implicit queue sign-off).
- **D-117 frontier PRD + the process wave** — tiers compress at taste
  sign-off; §4 ripple-frozen. **10 `fable-process-*` plans queued** (picks
  1/3/5/6/7/8/10; 2/9 rejected). BUILT: `prd:drift` + the sweep-guard.

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (R1) — play/review the **freshly-redeployed** T0 (VN intro,
  log v2, **7-tab IA**, economy re-core + rice spoilage/cap, estate-map, rung beats,
  R5 wall-weapon).
- **DEV-variant picks** 🔲 — live in the DEV panel: estate-map **V5A–G** (R7),
  home/Inventory **A/B/C** (R6, now BUILT — list · 一間 room · 持ち物帳 ledger) +
  older surfaces (R2/R5). Pick each live → I strip the rest (zero flag-debt).
- **Balance-watch** 🔲 — read this session; the 4 items are D-059 feel-calls best
  tuned by **playing** (#2 store-vs-sell already helped by v0.3.5 spoilage+cap). Left
  as the audit report; the balance-cockpit plan (fable-process-N1) is the tuning aid.
- **Rung cast + R0→R7 beats** 🔲 (R8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `project/archive/opus-2026-07-02-rung-up-story-transitions.md`.
- **UI-remaster variants** 🔲 (R9, Fable) — **shortlisted 6 → 3** (01 Moonlit ·
  04 Lacquer · 06 Washi; no winner/refine/blend yet). Winner → the D-075 diverge.

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

**R7 capstone side-quests** → **T1** (designed, `capstone-t0-branch.md`; T1=R8→R15 not
built) · **status-token ladder** → T1–T5 (T0 wall-weapon shipped, D-122) · home grows
w/ rung · NPC placement (F113) · balance feel-tune · `emergent-node-actions` (Phase 0).

## Toolchain

Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = **12
gates** (tsc, eslint, prettier, vitest, verify-content, verify-prd, gen:docs --check,
pacing:check, playcheck:check, md-links, milestone-integrity, verify-changelog) run
**in parallel** via `src/scripts/verify-run.ts` (soft 5s drift budget — `verify:budget`).
**`.githooks/pre-commit`** runs full `verify` + the reading-queue/journal/snapshot
gates; **`.githooks/pre-push`** runs `verify` and **blocks on red** (`SKIP_VERIFY=1`
overrides). **Note: HMR is OFF** (`vite.config.ts`) — hit F5 to see dev changes.
`npm run dev` · `npm run build` (→ `dist/`, itch) · `build:itch`. Hooks once per
clone: `git config core.hooksPath .githooks`.

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

1. Read the **newest journals** (`journal/2026-07-03-session-54-agent-default-audit.md`
   — the audit + v0.3.5 + capstone-design arc — and `-session-56-ui-demos-mobile.md`,
   back through s55/s52) + `todo-human.md` (the reading queue + open forks) for the arc.
2. `npm install` → `npm run verify` (green, 12 gates) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. F5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Next autonomous work** = the deferred/owed tail above. Balance liquid (D-059).
5. **Shared tree:** stage only your own files by explicit path; Fable's UI-v2 prototype
   (`prototype/`) + snapshot edits are theirs — leave untouched.

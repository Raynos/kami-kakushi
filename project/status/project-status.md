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
  5-attr combat, bank, spatial map, Bestiary, quests; app-shell overhaul, the
  append-only **VN intro** (D-104), **log v2**, LOCKED multi-panel (D-106), 1780
  cold-open (D-105).
- **✅ AUTONOMOUS T0 REBUILD — COMPLETE + DEPLOYED** (2026-07-03, `origin/main`,
  green; live at **raynos.github.io/kami-kakushi** as **v0.3.5**). Full autonomy +
  scope in ADRs **D-107–D-116**. **Eight lanes:** ① append-only render engine
  (`reconcile.ts`, flash-free) · ② economy re-core Ph1–4 + audited — koku→**coin+
  rice**, rice loop, mon/monme/ryō, koku=House **standing** (D-107/108/109/113) ·
  ③ IA 6-tab reorg (Work·Map·Estate·Inventory·Character·Combat, incremental;
  vendors-as-people; nav→Now, D-116) · ④ estate-map diverge (7 DEV variants V5A–G,
  F102) · ⑤ rung-up story beats — every rung a player-triggered VN beat (D-110;
  pending→beat→apply; SCHEMA 5→6) · ⑥ log/UI polish (Chat F111 · Now-timer F115 ·
  footer F92 · About modal F104/105 · F116 dup-ladder · F117 log rebalance) ·
  ⑦ deep housing T0 (home/belongings/comfort, D-111) · ⑧ combat-log voice (F91).
- **v0.3.4→v0.3.5 deploys** + a backfilled `CHANGELOG.md` (v0.1.0→v0.3.5) + the
  **12th verify gate** `verify-changelog` (version↔changelog single-source, A21).
  **Two adversarial audits** ran — economy balance-watch (4 liquid tuning items,
  left un-tuned for the human, D-059) + a deploy-gate check. **All F86–F117 ✅.**
- **Parallel worker (Fable):** UI-v2 round 2 — `prototype/` human-vetoed (lost
  resemblance) → **six T0 remaster variants** (06 = faithful baseline +
  light/dark) at <https://kami-kakushi-ui-demos.vercel.app> (R9).
- **Philosophy** R1–R6 + **process canon** D-086–089 (tension>generosity · loop
  done-rule · e2e+invariants DoD · implicit queue sign-off).
- **D-117: the frontier PRD** — PRD = forward spec of the unbuilt; tiers
  compress at taste sign-off (human-signed sweep); §4 ripple-frozen NOW. Three
  process plans queued (checkpoint · playtest-inbox · balance-sim).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 (R1) — play/review the **deployed** T0 (VN intro, log v2,
  6-tab IA, the economy re-core, estate-map, the rung beats).
- **DEV-variant picks** 🔲 — live in the DEV panel: estate-map **V5A–G** (R7),
  home/Inventory **A/B/C** (R6, now BUILT — list · 一間 room · 持ち物帳 ledger) +
  older surfaces (R2/R5). Pick each live → I strip the rest (zero flag-debt).
- **Balance-watch** 🔲 — 4 liquid tuning items the economy audit found (rice out-
  produces sinks → coin too abundant; koku capstone too fast). NOT silently
  re-tuned — your feel-call. `audit/reports/2026-07-02-economy-balance-watch.md`.
- **Rung cast + R0→R7 beats** 🔲 (R8) — drafted for your read (3 faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `docs/plans/opus-2026-07-02-rung-up-story-transitions.md`.
- **UI-remaster variants** 🔲 (R9, Fable) — pick a direction/blend at the
  URL above → it becomes the D-075 diverge.

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Deferred / owed tail (engineering — not blocking the deploy)

The **'lord' voice** needs a core `VoiceCategory` extension · economy **Phase 5**
status tokens (captured — PRD §2 + D-109 + both plans) · **home grows with rung** ·
**per-tier/rung NPC placement** (F113) · the balance-watch tuning (above).

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

> 🎮 **Autonomous T0 rebuild COMPLETE + deployed (2026-07-03, v0.3.5).** All eight
> lanes are on `origin/main` (green) and live at raynos.github.io/kami-kakushi.
> What's open is the human async queue above; the deferred/owed tail is the next
> autonomous work as picks land. Scope locked in ADRs D-107–D-116.

1. Read the **newest journal** (`journal/2026-07-03-session-49-t0-rebuild-complete.md`)
   + the feedback doc (`human-feedback/2026-07-02-playtest.md`, F1–F117 all ✅) +
   `todo-human.md` (the reading queue + open forks) for the full arc.
2. `npm install` → `npm run verify` (green, 12 gates) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. F5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Serial `render.ts` lane** — next autonomous work is the deferred/owed tail (the
   home-panel diverge is highest-value). Balance stays liquid (D-059) for the human.
5. **Shared tree:** stage only your own files by explicit path; Fable's UI-v2 prototype
   (`prototype/`) + snapshot edits are theirs — leave untouched.

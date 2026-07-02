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
- **v0.3.0–v0.3.2 shipped** — the T0 M0–M4 arc plays end-to-end; 5-attr accuracy/
  evasion combat, bank, spatial map, Bestiary, quests. Site is live (a bit behind now).
- **v0.3.3 shipped** — playtest rounds 1–3 (F1–F115): app-shell overhaul, the
  append-only **VN intro** (D-104), **log v2**, LOCKED multi-panel (D-106), 1780
  cold-open (D-105), DEV New-Game backup/restore, `CHANGELOG.md`.
- **🔨 AUTONOMOUS T0 REBUILD — IN FLIGHT (2026-07-02, `origin/main`, green).** Human
  gave full autonomy + scope decisions (ADRs **D-107–D-116**). DONE + pushed:
  **① append-only render engine** (whole UI flash-free, `reconcile.ts`) · **② economy
  re-core Ph1–4 + audited** — koku→**coin+rice**, rice loop (sell/eat/store), mon/monme/
  ryō display, koku=House **standing** (D-107/108/109/113) · **③ IA 6-tab reorg**
  (Work·Map·Estate·Inventory·Character·Combat, incremental; vendors-as-people; D-116
  nav→Now) · **④ estate-map diverge** (7 DEV variants, F102) · **⑤ rung-story CORE**
  (every rung a player-triggered VN beat, D-110; pending→beat→apply; SCHEMA 5→6).
  **IN PROGRESS:** rung-story **UI** (VN reuse + F106 rung-in-header trigger).
- **Queued next (T0):** log/UI polish (Chat tab F111 · Now-timer F115 · footer F92 ·
  about-modal F104/105) · **deep housing** (D-111) · combat light polish → **v0.3.4 +
  gh-pages deploy**. Everything funnels through `render.ts` (serial).
- **Parallel worker (Fable):** a **UI-v2 prototype** gallery (`prototype/index.html`) —
  a taste-call spike, separate from this rebuild.
- **Philosophy** R1–R6 + **process canon** D-086–089 (tension>generosity · loop
  done-rule · e2e+invariants DoD · implicit queue sign-off).

## Waiting on the human

- **REVIEW PASSOVER** 🔲 — play/review the reshaped T0 (VN intro, log v2, 6-tab IA,
  the economy re-core, estate-map, the rung beats once the UI lands).
- **Balance-watch** 🔲 — 4 liquid tuning items the economy audit found (rice out-
  produces sinks → coin too abundant; koku capstone too fast). I did NOT silently
  re-tune — your feel-call. `audit/reports/2026-07-02-economy-balance-watch.md`.
- **Rung cast + R0→R7 beats** 🔲 — drafted for review (3 invented faces: pedlar
  Tokubei, Rokusuke, smith Tōzō). `docs/plans/2026-07-02-rung-up-story-transitions.md`.
- **DEV variants** 🔲 — pick live in the DEV panel: estate-map V5A–G + older surfaces.
- **UI-v2 gallery** 🔲 — `prototype/index.html` (Fable): pick a framing → `diverge`.

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Toolchain

Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = **11
gates** (tsc, eslint, prettier, vitest, verify-content, verify-prd, gen:docs --check,
pacing:check, playcheck:check, md-links, milestone-integrity) run **in parallel** via
`src/scripts/verify-run.ts` (soft 5s drift budget — `npm run verify:budget`).
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

> 🎮 **Autonomous T0 rebuild in flight (2026-07-02).** The render engine, economy
> re-core (Ph1–4), 6-tab IA, estate-map, and rung-story CORE are built + on
> `origin/main` (green). Rung-story **UI** is the active build; then log/UI polish,
> deep housing, combat polish → **v0.3.4 + gh-pages deploy**. Scope is locked in
> ADRs D-107–D-116; prose ships live (human reviews async).

1. Read the **newest journal** + the feedback doc (`human-feedback/2026-07-02-playtest.md`,
   F1–F115) + `todo-human.md` (the reading queue + open forks) for the full arc.
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ localhost:5173).
   Use **`?dev=no`** for the true player layout. F5 to reload (HMR off).
3. Drive **headless-only** (hook-enforced — NEVER open a headed browser, incl. from
   subagents): `window.__qa` or `node src/scripts/qa-shots.mjs`. `newGame()` to reset.
4. **Serial `render.ts` lane** — build order: rung-story UI → log/UI polish → deep
   housing → combat polish → v0.3.4 deploy. Balance stays liquid (D-059) for the human.
5. **Shared tree:** stage only your own files by explicit path; Fable's UI-v2 prototype
   (`prototype/`) + snapshot edits are theirs — leave untouched.

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

A grounded, story-driven **incremental RPG** in mid-Edo (~18th c., fictional) rural
Japan. A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining
lower-samurai (*goshi*) estate (the **Kurosawa** house) and rises through **6 tiers**
(T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town ·
T5 Edo), growing **House Influence** (4 pillars; one per tier). **v1 scope = T0→T3.**
Signature: **the UI itself unlocks incrementally.** No magic; growth only through
perseverance; no reset. Spec: [`../../docs/living/prd.md`](../../docs/living/prd.md).

## Where we are now

- **PRD: V2.3** — the 6-tier reshape (ADRs D-048–D-069 + 5 forks) is fully rippled
  into the body. `prd.md` is a stub index → the spec lives in per-section files
  `docs/living/prd/01-vision.md … 07-roadmap-scope.md`. §4 balance numbers + §7
  M2–M7 detail stay **provisional** (D-021/D-059, liquid — tuned by playtest).
- **Build: v0.3 is shipped & playtestable** — the **T0 M0–M4 arc** plays end-to-end,
  the macro spine **closes** (tier 0→1 ascension fires, proven by `src/core/t0-arc.test.ts`),
  DEMO/REAL fork retired (one re-derived T0 pace), twice-audited (8-lens fidelity
  battery + adversarial re-audit, both ship-quality), a11y-100, `verify`-green, on
  `origin/main`. Site live: <https://raynos.github.io/kami-kakushi/>.
- **v0.3.1 — BUILT + AUDITED + fun-polished (on `origin/main`, all green).** ✅ Steps 1–7 + the
  canon ripples: DEV-panel + variants (D-075) · combat rework + the **bank** + two auto-modes
  (D-090/D-091) · koku tightening (D-092) · the **SPATIAL MAP** (D-093 — activities/foes/banking on
  nodes, the load-bearing **deep-*satoyama***/D-078, the ascension after-state) · the reckoning-cadence
  fix (D-094) · the **milestone-integrity verify gate** (11th, D-054). Then a **4-fix fun/feel pass**
  (labour-above-fold · the HP "life" meter · the Cook heal-cue · the "Walk on" smooth-nav strip) and a
  **6-lens fun/quality audit workflow → 19 confirmed fixes** (a weapon-swap free-repair EXPLOIT, a
  corrupt-save CRASH, the R0 blind-grind onboarding, the estate flywheel/node-hints/rung-cue legibility
  batch). **Prod re-verified** (fixes ship, DEV stripped, 0 console errors); gallery refreshed.
  **Deferred:** the §4 6-tier re-derivation → the T1 build (D-092 finding); **#15 material-sink → T1**
  (H11 closed WAI, **D-095**).
  Batch-2 design: [`../human-feedback/2026-06-30-v0.3.1-priming-decisions.md`](../human-feedback/2026-06-30-v0.3.1-priming-decisions.md);
  plan [`../archive/2026-06-30-v0.3.1-build.md`](../archive/2026-06-30-v0.3.1-build.md) (done — archived).
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust ·
  done-is-earned · bias-to-motion · if-it-isn't-fun · if-a-player-can't-reach-it) lives
  in [`../../docs/philosophy/`](../../docs/philosophy/README.md), summarised in AGENTS.md.
- **Process canon (2026-06-30):** the v0.3 retro is adopted — **D-086** (tension > generosity),
  **D-087** (loop done-rule), **D-088** (e2e+invariants per tier = hard DoD), **D-089** (implicit
  reading-queue sign-off); the rest folded as norms (fun-factor / qa-playtesting / working-agreements /
  AGENTS Conventions). Full: `human-feedback/2026-06-30-process-learnings-decisions.md`.
- **Deferred:** the full **§4 6-tier balance re-derivation** (T1 Estate-full bands + §4.8 floors +
  the §4.1–4.7 relabel) is **DEFERRED to the T1 build** — the v0.3.1 Step-4 finding (**D-092**) showed
  it's **T1+ tier balance decoupled from the T0 koku work**, best derived with T1 built + playtest data
  (liquid/D-059), not speculatively now. (§4.0 is already 6-tier-labelled.)

## Waiting on the human

- **R1** 🔲 — play/taste call on the **T0 demo — now the v0.3.1 build** (fun · pacing · look): the
  **spatial map** (walk-to-work/fight, the deep-*satoyama* hunting ground), the **combat rework**
  (HP accumulates, no auto-heal, two auto-modes, the loss bites carried wealth), the **kura bank**,
  the tightened **koku** economy, and the resolved **ascension after-state**. Drive with `__qa`
  (`toRung`, `goto`, `fight`, `jumpToAscension`, `speed(8)`).
- **R2** 🔲 — review the UI variants **live in the DEV panel** (D-075) — now incl. the **Estate-map**
  A/B/C (paths list · 絵地図 schematic · 道中記 ledger).
- **Reading queue:** _(none open)_ — the v0.3 process-learnings retro is signed off

_(H11 — the T0 material-surplus sink — closed 2026-07-01 as WAI for the miniature → **D-095**;
revisit at T1. No open decisions remain.)_
  (adopted as D-086…D-088 + norms); the skill-audit report was retired (no actions).

(Live lists: `project/human-in-the-loop/review.md` + `project/todo-human.md`.)

## Toolchain

Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint
boundary (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = **11
gates** (tsc, eslint, prettier, vitest, verify-content, verify-prd, gen:docs --check,
pacing:check, playcheck:check, md-links, milestone-integrity) run **in parallel** via `src/scripts/verify-run.ts`
(well under the 5s drift budget — `npm run verify:budget` checks it; don't hard-code a figure). **`.githooks/pre-commit`**
runs full `verify` + a non-blocking drift timer + the reading-queue/journal/snapshot
gates; **`.githooks/pre-push`** runs `verify` on every push and **blocks on red**
(`SKIP_VERIFY=1` overrides). `npm run dev` · `npm run build` (→ `dist/`, itch-ready)
· `npm run build:itch` (zip). Enable hooks once per clone:
`git config core.hooksPath .githooks`.

## Code & repo layout

- `src/core` — pure (rng, state, intents/reduce, step/tick, unlock/rewards/log,
  skills, ranks, combat, fight, ascension, pillars, selectors, format, `content/*`)
  · `src/persistence` (save layer) · `src/ui` (render.ts + styles.css) ·
  `src/app/main.ts` (composition root + `window.__qa`) · `src/index.html` (web entry,
  Vite `root: 'src'` → repo-root `dist/`) · `src/scripts/*` (verify/gen/QA/dev scripts).
- **3 content top-level dirs:** `docs/` (current truth — `living/` design docs,
  `content/` generated tables) · `project/` (agentic process: `status/` [this file],
  `journal/`, `brainstorms/`, `human-feedback/`, `human-in-the-loop/`, `audit/`,
  `archive/`) · `src/` (game code + web entry + dev/QA scripts). ADR ledger:
  `docs/living/decisions.md`.

## How to resume

1. Read the **newest journal** (`project/journal/2026-07-01-session-36-v0.3.1-build.md` — the live
   build log) + the **batch-2 capture** (`project/human-feedback/2026-06-30-v0.3.1-priming-decisions.md`)
   + the **build plan** `project/archive/2026-06-30-v0.3.1-build.md` (DONE — archived).
2. `npm install` (fresh clone) → `npm run verify` (green) → `npm run dev`.
3. Drive headlessly: `node src/scripts/qa-shots.mjs`, or `window.__qa` in the console
   (`newGame`, `toRung`, `faceWolf`, `fight`, `auto`; DEV jumps: `speed(8)`,
   `jumpToPhase2()`, `jumpToAscension()`). The in-UI **DEV panel** (top-right) toggles variants live.
4. **Next, in order:** (a) ⭐ **R1/R2** (human, non-blocking) — play/taste the v0.3.1 build + review the
   UI variants live in the DEV panel (override-only). (b) **Scope the T1 (Estate-full) build** — the
   next roadmap slice; it carries the two reasoned-deferred items: the **§4 6-tier balance re-derivation**
   (D-092) and a **real material economy / 2nd koku sink** (D-095 / battery #15). The v0.3.1 build +
   its 8-lens fidelity battery are **fully actioned** — no open engineering findings or decisions remain.

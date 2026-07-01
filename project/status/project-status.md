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
- **v0.3.1 — IN PROGRESS (Steps 1–5 done, on `origin/main`).** ✅ Step 1 DEV panel + strip-safe
  variant toggle · ✅ Step 2 craft/market/quests variants · ✅ Step 3 combat rework + the **bank**
  (carried/banked) + the carried-loss penalty + two auto-modes (**D-090/D-091**) · ✅ Step 4 koku
  tightening (sinks + soft repair-fee, **D-092**) · ✅ **Step 5 the SPATIAL MAP** (**D-093**): 5a
  activities on nodes (no default node — walk to work) · 5b foes on nodes (walk to the fight) · 5c
  banking at the *kura* · 5d the load-bearing **deep-*satoyama*** node (richer yield, D-078) + the
  ascension **after-state** (F2) · 5e the map-presentation D-075 diverge. **Remaining:** Step 7
  (battery leftovers) · final PRD-consistency (incl. the deferred §4 6-tier re-derivation) +
  gallery regen + R1 hand-off. Batch-2 design captured in
  [`../human-feedback/2026-06-30-v0.3.1-priming-decisions.md`](../human-feedback/2026-06-30-v0.3.1-priming-decisions.md);
  plan [`../../docs/plans/2026-06-30-v0.3.1-build.md`](../../docs/plans/2026-06-30-v0.3.1-build.md).
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust ·
  done-is-earned · bias-to-motion · if-it-isn't-fun · if-a-player-can't-reach-it) lives
  in [`../../docs/philosophy/`](../../docs/philosophy/README.md), summarised in AGENTS.md.
- **Process canon (2026-06-30):** the v0.3 retrospective is adopted — **D-086**
  (tension > generosity), **D-087** (loop done-rule: keep finding work), **D-088**
  (e2e+invariants per tier = hard DoD contract), **D-089** (reading-queue sign-off
  is implicit — read/discuss = signed off; the agent keeps `todo-human.md` clean,
  `/prepare-to-exit` reconciles); the rest folded as norms into
  fun-factor / qa-playtesting / working-agreements / AGENTS.md Conventions / the
  battery skill. Skills audited — all wired, test-discipline lifted into Conventions.
  Capture: [`../human-feedback/2026-06-30-process-learnings-decisions.md`](../human-feedback/2026-06-30-process-learnings-decisions.md).
- **Doc-health sweep (2026-06-30):** a repo-wide stale-markdown `Workflow` (21
  findings) + a P1 diff re-audit landed: the **D-048 6-tier ripple is now finished
  in §1** (01-vision spine/antagonists/rep-arc — it wasn't, despite the old "fully
  rippled" claim), the **D-053→D-079 clock** supersession, built-features-described-
  as-unbuilt fixes, and a new **`md-links` verify gate (10th)**. `package.json`
  version → **0.3.0** (was 0.0.0; A21). §4.0 magnitude table relabeled to 6-tier;
  **the full §4 coupled balance re-derivation (T1 Estate-full bands + floors + the
  bulk §4.1–4.7 relabel) is scheduled in the v0.3.1 plan, Step 4** (liquid/D-059 —
  it rides the koku retune). Report:
  [`../audit/reports/2026-06-30-stale-markdown-sweep.md`](../audit/reports/2026-06-30-stale-markdown-sweep.md).

## Waiting on the human

- **R1** 🔲 — play/taste call on the v0.3 T0 M0–M4 demo (fun · pacing · look).
- **R2** 🔲 — review the UI variants **live in the DEV panel** (D-075).
- **Reading queue:** _(none open)_ — the v0.3 process-learnings retro is signed off
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
   + the active **build plan** `docs/plans/2026-06-30-v0.3.1-build.md` (in progress, Steps 1–5 done).
2. `npm install` (fresh clone) → `npm run verify` (green) → `npm run dev`.
3. Drive headlessly: `node src/scripts/qa-shots.mjs`, or `window.__qa` in the console
   (`newGame`, `toRung`, `faceWolf`, `fight`, `auto`; DEV jumps: `speed(8)`,
   `jumpToPhase2()`, `jumpToAscension()`). The in-UI **DEV panel** (top-right) toggles variants live.
4. **Next, in order:** (a) **continue the v0.3.1 build** — **Step 7** (battery leftovers: seasonal-judge
   #8, DOM tests #11, DEV-harness smoke #12, dead-flags #19, milestone-integrity gate #20, 2nd craft
   recipe #15, UI nits, the diverge-skill doc rewrite) → **final** PRD-consistency (incl. the deferred
   §4 6-tier re-derivation) + gallery regen + R1 hand-off. (b) ⭐ **R1/R2** — the human plays the build
   + reviews UI variants live in the DEV panel (override-only, non-blocking).

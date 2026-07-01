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
- **v0.3.1 — BUILT + AUDITED + fun-polished** (on `origin/main`, all green): DEV-panel
  + variants (D-075) · combat rework + the **bank** + two auto-modes · koku tightening
  (D-092) · the **SPATIAL MAP** (D-093) · milestone-integrity gate (11th, D-054); a
  fun/feel pass + two audit workflows → **29 confirmed fixes, no core/logic/balance
  defect surviving**. Detail: session-36 journal + the archived plan.
- **v0.3.2 — IN PROGRESS (Plan B, this session).** Closing the build-behind gap so the
  build matches the reconciled PRD. ✅ **A1+A2 landed** (`8e5cb52`, pushed): the PRD
  **5-attr STR/AGI/INT/SPD/LUCK + accuracy/evasion combat model** + glass-cannon/tank
  stances — combat now matches §4.6 (balance liquid, D-059). Queued: A3 (crafted yari) ·
  A4 (E→U rename) · A6 (quests) · A7/A8 (UI, **diverge** per D-075) · A9 (mobs) · A10
  (bandit-gate) · C (gen-docs). Plan:
  [`../../docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md`](../../docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md).
- **Operating philosophy:** the **R1–R6 register** (no-clock · verify-don't-trust ·
  done-is-earned · bias-to-motion · if-it-isn't-fun · if-a-player-can't-reach-it) lives
  in [`../../docs/philosophy/`](../../docs/philosophy/README.md), summarised in AGENTS.md.
- **Process canon (2026-06-30):** the v0.3 retro is adopted — **D-086** (tension > generosity),
  **D-087** (loop done-rule), **D-088** (e2e+invariants per tier = hard DoD), **D-089** (implicit
  reading-queue sign-off); the rest folded as norms (fun-factor / qa-playtesting / working-agreements /
  AGENTS Conventions). Full: `human-feedback/2026-06-30-process-learnings-decisions.md`.
- **Deferred to T1:** the §4 6-tier balance re-derivation (D-092) + the material-sink
  (H11 closed WAI, D-095) — T1-tier balance decoupled from T0, best derived with T1 +
  playtest data (liquid/D-059).

## Waiting on the human

- **R1** 🔲 — play/taste call on the **T0 demo — now the v0.3.1 build** (fun · pacing · look): the
  **spatial map** (walk-to-work/fight, the deep-*satoyama* hunting ground), the **combat rework**
  (HP accumulates, no auto-heal, two auto-modes, the loss bites carried wealth), the **kura bank**,
  the tightened **koku** economy, and the resolved **ascension after-state**. Drive with `__qa`
  (`toRung`, `goto`, `fight`, `jumpToAscension`, `speed(8)`).
- **R2** 🔲 — review the UI variants **live in the DEV panel** (D-075) — now incl. the **Estate-map**
  A/B/C (paths list · 絵地図 schematic · 道中記 ledger).
- **Reading queue:** **Plan B** (v0.3.2 build) is the live plan — see `docs/plans/`.
  (Plan A — PRD→standalone end-state — is DONE; H13–H18 resolved → D-098…D-103.)

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

> 🔨 **NOW: build Plan B (v0.3.2) — autonomously, in the background.** The human
> greenlit the build (2026-07-01, **supersedes** the earlier "play the game, not
> build" steer): they're busy today, can't playtest, and will **playtest v0.3.2
> tomorrow** — so close the build-behind gap now so game & PRD converge. Plan:
> [`../../docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md`](../../docs/plans/2026-07-01-v0.3.2-build-close-the-gap.md).
> **R1 playtest is deferred to tomorrow, not dropped**; build headless-only
> (hook-enforced) and keep every task reachable in the live T0 (R6).

1. Read the **newest journal** (session-40 = Plan B build; session-38 = doc
   reconcile) + the plan's task list (A1 combat model FIRST → A2/A3/A9 → A4/A6/A7/A8/A10 + C gen-docs).
2. `npm install` → `npm run verify` (green) → `npm run dev` (→ http://localhost:5173/).
3. Drive **headless-only** (hook-enforced): `window.__qa` (`newGame`, `toRung`,
   `goto`, `fight`, `jumpToAscension()`, `speed(8)`) or `node src/scripts/qa-shots.mjs`.
4. **Next:** work Plan B §A (A1–A10) + §C in dependency order — each ships RED-able
   tests + the tier full-arc/invariants check, `verify` stays green, commit+journal per
   task. Then **R1/R2** with the human tomorrow. (**Plan A** — PRD→standalone end-state — is
   **DONE**, implemented + pushed; forks → **D-098…D-103**.)

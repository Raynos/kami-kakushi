---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> Keep this to one screen. Update it at the end of each session so a cold pickup is instant.

- **Game:** a grounded, story-driven **incremental RPG** in mid-Edo (~18th c., fictional) rural Japan.
  A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining lower-samurai (*goshi*) estate
  (the **Kurosawa** house); rise through **5 tiers** (Estate→Village→Region→Castle-town→Edo), growing
  **House Influence** (4 pillars). Signature: **the UI itself unlocks incrementally**. No magic; growth
  only through perseverance; no reset. (Spec: `docs/living/prd.md`.)
- **Phase:** **PRD V2.2 DONE → DEMO BUILT (M0+M1+M2), POLISHED → now human play-testing.** The overnight
  build session (2026-06-26, `project/journal/2026-06-26-session-02-overnight-build.md`) + a 2026-06-27
  human-directed **repo reorg** (the 3-dir tree above) and first-playthrough UX fixes (log cascade
  newest-at-bottom, bigger/indigo Settings ✕, modal closes on new-game). Live human feedback now lands in
  `project/feedback/`. PRD V2.2 = all 32 Block N + 7 N.1
  decisions woven into `docs/living/prd.md` (two workflows: apply 943 insertions + an audit-fix reconcile;
  ADRs D-044 crash-recovery / D-045 a11y-ink). The **playable demo is built**: M0 (toolchain + pure-core
  engine + the FULL multi-backend save spine + cold open), M1 (T0 Phase-1 labour: rung-meter R0→R2,
  skills, season clock, soft stamina, the first nav reveal), M2 (combat: auto-resolve + analytic win-rate
  + the humbling first fight + character level + gear/durability + self-recovering losses). **51 unit
  tests green; `npm run verify` passes; headless visual QA clean (woodblock/ink, no console errors).**
  Polish: title bar + Settings/About modal (build stamp · license · itch content descriptors · export/
  import save · a11y toggles), favicon, a11y win-rate fix.
- **Toolchain:** Vite 5 + TS (strict) + Vitest 2 + ESLint 9 (flat) + Prettier. Pure-core ESLint boundary
  live (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = tsc + eslint + prettier +
  vitest + verify-content + `gen:docs --check`. `npm run dev` (Vite); `npm run build` (→ `dist/`, ~42 KB
  JS [gz ~15 KB] + ~14 KB CSS [gz ~4 KB] — itch-ready, relative-base); `npm run build:itch` (zip). Headless
  QA harness: `src/scripts/qa-shots.mjs` + `src/scripts/playtest.mjs` (Playwright) → screenshots in `project/audit/`.
- **Key docs:** `docs/living/prd.md` (the V2.2 vision+spec) · `project/feedback/history/2026-06-26-prd-human-feedback.md` Block N (the
  authoritative decisions) · `docs/living/ui-design.md` (woodblock/ink bible — the renderer is built to it) ·
  `docs/living/fun-factor.md` · `docs/living/qa-playtesting.md` (the __qa harness + fun-proxies) ·
  `docs/living/decisions.md` (ADRs D-001…D-045).
- **Code layout:** `src/core` (pure: rng, state, intents/reduce, step/tick, unlock/rewards/log, skills,
  ranks, combat, fight, selectors, format, `content/*` registries) · `src/persistence` (save layer) ·
  `src/ui` (render.ts + styles.css) · `src/app/main.ts` (composition root + `window.__qa`) ·
  `src/index.html` (the web entry — Vite `root: 'src'`, builds to repo-root `dist/`) ·
  `src/scripts/{verify-content,gen-docs}.ts` + `{qa-shots,playtest}.mjs` + `snapshot-research.sh`.
- **Repo structure (2026-06-27 reorg):** only **3** content top-level dirs — `docs/` (current truth; living
  docs under `docs/living/`, generated tables under `docs/content/`), `project/` (the agentic-process umbrella:
  `status/` [this file], `journal/`, `brainstorms/`, `feedback/`, `human-in-the-loop/`, `audit/`, `archive/`),
  and `src/` (all game code + the web entry + dev/QA scripts). The ADR ledger is `docs/living/decisions.md`.
- **Phase update — v0.2 BUILT + RE-AUDITED (2026-06-27/28).** The battery audit (below) was acted on: an
  autonomous **v0.2** build (tag **`v0.2`**; baseline tagged **`v0.1`**) fixed the top findings, then got its
  **own de-duplicated battery report** ([`state-of-the-game-v0.2-2026-06-28.md`](../audit/state-of-the-game-v0.2-2026-06-28.md)).
  **Final v0.2 scores** (battery-reconciled): **Fun 4.5→6.0 · UI 7→8.5 · PRD-faithful 6.5→8 · README-spirit
  7→7.5 · human-feedback 7.5→8.5 · Incremental 4.5→7 · Laziness 4.5→3 · roadmap 5→7**. **99 tests green.**
  Changelog: `project/audit/v0.2-changelog.md`. What v0.2 added:
  graded combat curve + kendo stance decision (seed-robust forecast, first fight in the signed 20–35% band),
  work→skill→yield reinvestment + cook/estate/attribute sinks (no more dead values), R3 chapter-close + dream-2
  payoff + a greyed House-Influence 家威 macro **teaser**, the cold-open screen, log ×N, real RED→GREEN tests,
  wired `migrate()`, DEMO/REAL pacing (`npm run pacing`). **Main remaining work:** the real four-pillar macro
  *engine* (still only a teaser) + the human's H1–H6 + a few v0.2 tuning rough-edges (durability friction,
  slower grind). The 6 H-items were deliberately NOT decided.
- **Battery audit (2026-06-27):** a multi-wave state-of-the-game review of v0.1 →
  **[`project/audit/state-of-the-game-2026-06-27.md`](../audit/state-of-the-game-2026-06-27.md)** (CONVERGED) +
  6 H-items (`human-in-the-loop/decisions.md`). **v0.1 scores** (↑=better, except Laziness): Fun 4.5 · UI 7 ·
  PRD-faithful 6.5 · README-spirit 7 · human-feedback 7.5 · Incremental 4.5 · Laziness 4.5/10. Verdict: a
  **beautifully-built chassis with no engine** (now substantially addressed by v0.2 above). 10 M3 guardrails
  proposed (G-PACING/CURVE/FUN@M3a/TEST-TEETH/MIGRATION/…).
- **How to resume:**
  1. Read the newest journal (`project/journal/2026-06-27-session-01-state-of-game-audit.md`) + the audit report.
  2. `npm install` (if fresh clone) → `npm run verify` (should be green) → `npm run dev` to play.
  3. Drive headlessly: `node src/scripts/qa-shots.mjs` (or `window.__qa` in the console: `newGame`, `toRung`,
     `faceWolf`, `fight`, `auto`).
  4. **Next (post-review):** triage the audit's H1–H6 + the critical/high game improvements (grade combat +
     one decision; close the R3 chapter + macro teaser; ×N log + deed juice; reinvestment loop + skill teeth;
     resolve dead values; wire+test `migrate()`; real RED tests for the signed criteria) — ideally *before*
     M3 (T0 R4→R7 + the four-pillar Phase-2 grind + the hybrid gate). Then T1/T2 per `docs/living/prd.md` §7.2.
- **Demo arc (what to look at):** cold open (wake → Sōan grounds the folklore → rake rice) → labour earns
  the kept-hand then trusted-hand rungs (the estate + Skills tab ink in) → the humbling grain-store wolf
  (R3, survived by luck) → combat goes live (forecasts, level up, the woodlot axe, auto-fight). Screenshots:
  `project/audit/qa-0[1-9]-*.png`.

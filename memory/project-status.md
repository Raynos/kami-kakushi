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
  only through perseverance; no reset. (Spec: `docs/prd.md`.)
- **Phase:** **PRD V2.2 DONE → DEMO BUILT (M0+M1+M2) & POLISHED.** The overnight build session
  (2026-06-26, `journal/2026-06-26-session-02-overnight-build.md`). PRD V2.2 = all 32 Block N + 7 N.1
  decisions woven into `docs/prd.md` (two workflows: apply 943 insertions + an audit-fix reconcile;
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
  QA harness: `scripts/qa-shots.mjs` + `scripts/playtest.mjs` (Playwright) → screenshots in `audit/`.
- **Key docs:** `docs/prd.md` (the V2.2 vision+spec) · `docs/prd_human_feedback.md` Block N (the
  authoritative decisions) · `docs/ui-design.md` (woodblock/ink bible — the renderer is built to it) ·
  `docs/fun-factor.md` · `docs/qa-playtesting.md` (the __qa harness + fun-proxies) ·
  `docs/history/decisions.md` (ADRs D-001…D-045).
- **Code layout:** `src/core` (pure: rng, state, intents/reduce, step/tick, unlock/rewards/log, skills,
  ranks, combat, fight, selectors, format, `content/*` registries) · `src/persistence` (save layer) ·
  `src/ui` (render.ts + styles.css) · `src/app/main.ts` (composition root + `window.__qa`) ·
  `scripts/{verify-content,gen-docs}.ts`.
- **How to resume:**
  1. Read the newest journal (`journal/2026-06-26-session-02-overnight-build.md`).
  2. `npm install` (if fresh clone) → `npm run verify` (should be green) → `npm run dev` to play.
  3. Drive headlessly: `node scripts/qa-shots.mjs` (or `window.__qa` in the console: `newGame`, `toRung`,
     `faceWolf`, `fight`, `auto`).
  4. **Next (post-review):** M3 (T0 R4→R7 + the four-pillar Phase-2 grind + the hybrid gate) → close T0;
     then T1/T2 per `docs/prd.md` §7.2. Pre-publish: self-host the OFL font (Q52) + a real perf/fun gate (M6).
- **Demo arc (what to look at):** cold open (wake → Sōan grounds the folklore → rake rice) → labour earns
  the kept-hand then trusted-hand rungs (the estate + Skills tab ink in) → the humbling grain-store wolf
  (R3, survived by luck) → combat goes live (forecasts, level up, the woodlot axe, auto-fight). Screenshots:
  `audit/qa-0[1-9]-*.png`.

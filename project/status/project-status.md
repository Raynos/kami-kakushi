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
  `project/human-feedback/`. PRD V2.2 = all 32 Block N + 7 N.1
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
  QA harness: `src/scripts/qa-shots.mjs` + `src/scripts/playtest.mjs` (Playwright) → screenshots in `project/audit/screens/latest/`.
- **Key docs:** `docs/living/prd.md` (the V2.2 vision+spec) · `project/human-feedback/2026-06-26-prd-human-feedback.md` Block N (the
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
  `status/` [this file], `journal/`, `brainstorms/`, `human-feedback/`, `human-in-the-loop/`, `audit/`, `archive/`),
  and `src/` (all game code + the web entry + dev/QA scripts). The ADR ledger is `docs/living/decisions.md`.
- **Phase update — v0.2 BUILT + RE-AUDITED (2026-06-27/28).** The battery audit (below) was acted on: an
  autonomous **v0.2** build (tag **`v0.2`**; baseline tagged **`v0.1`**) fixed the top findings, then got its
  **own de-duplicated battery report** ([`2026-06-28-state-of-the-game-v0.2.md`](../audit/reports/2026-06-28-state-of-the-game-v0.2.md)).
  **Final v0.2 scores** (battery-reconciled): **Fun 4.5→6.0 · UI 7→8.5 · PRD-faithful 6.5→8 · README-spirit
  7→7.5 · human-feedback 7.5→8.5 · Incremental 4.5→7 · Laziness 4.5→3 · roadmap 5→7**. **99 tests green.**
  Changelog: `project/audit/reports/2026-06-27-v0.2-changelog.md`. What v0.2 added:
  graded combat curve + kendo stance decision (seed-robust forecast, first fight in the signed 20–35% band),
  work→skill→yield reinvestment + cook/estate/attribute sinks (no more dead values), R3 chapter-close + dream-2
  payoff + a greyed House-Influence 家威 macro **teaser**, the cold-open screen, log ×N, real RED→GREEN tests,
  wired `migrate()`, DEMO/REAL pacing (`npm run pacing`). **Main remaining work:** the real four-pillar macro
  *engine* (still only a teaser) + the human's H1–H6 + a few v0.2 tuning rough-edges (durability friction,
  slower grind). The 6 H-items were deliberately NOT decided.
- **Phase update — TIER RESHAPE decided (2026-06-28, session-03).** A human-steered review of the v0.1 report
  resolved the H-items by **reshaping the tier spine**: **split the Estate into T0 (tutorial) + T1 (full)** →
  **6 tiers** (T0 Estate-tut · T1 Estate-full · T2 Village · T3 Region · T4 Castle-town · T5 Edo), **one pillar
  per tier** (1→2→3→4→4, **Estate→Arms→Office→Name**), **v1 = T0→T3**; + manual opt-in graded ascension,
  carry-HP/heal-by-eating combat, compounding koku sink, showcase-in-miniature tutorial, wall-time "leave it
  running", milestone-integrity rule, pillar silhouettes + per-tier mystery beats. Locked as **ADRs D-048…D-055**
  — but **NOT yet applied to the PRD (the PRD body is STALE on tiers).** Master checklist + precedence:
  [`pending-prd-reshape.md`](pending-prd-reshape.md); intent: [`../human-feedback/2026-06-28-tier-reshape.md`](../human-feedback/2026-06-28-tier-reshape.md);
  human reading queue: [`docs-to-read-for-human.md`](../docs-to-read-for-human.md). *(Applying + building is downstream of the ⭐ v2 / H10 gate below.)*
- **Phase update — v0.2 AUDIT FULLY TRIAGED + FORWARD DECISIONS LOCKED (2026-06-29, decision session).** A
  human-driven pass closed the v0.2 audit **100% — 23 decisions across 7 question-batches** (this session +
  the reshape D-048…D-055). Newly locked this session (→ ADRs **D-056+**, landing in the batched ripple):
  real **D-049 pacing** as default + a DEV-only 2×/4×/8× speed toggle (H1); keep the signed **20–35%
  single-fight** band (H2); **split** `prd.md` into per-section files (H8); analytic-for-gate /
  sampled-for-display win-rate (amends signed D-043); **spine-first T0** + a big T0→T1 ascension (H3);
  humbling-throughout difficulty (T0 quick but not easy); diegetic-mentor onboarding + a small walkable T0
  map (non-hand-holdy); **carry-forward + retune** the shipped T0 (M0–M2b kept); linear koku flywheel now /
  branch at T1; save-wipe on the schema bump; the **durable-by-default** CLAUDE.md norm. The **6-tier
  reshape** (D-048…D-055) + all of the above stand **LOCKED**. **Source of truth:**
  [`../human-feedback/2026-06-29-decision-session.md`](../human-feedback/2026-06-29-decision-session.md); the audit report
  is banner-marked triaged. **ADRs D-056+ + the PRD/doc/code ripple are PENDING** — one batch, gated on the
  human's extra PRD feedback. New plans in `docs/plans/`: the **roadmap re-axe** (nested
  Tier→Milestones→Fun-slices), the **op-model v2-lite reel-back**, and the **implementation plan**.
- **Battery audit (2026-06-27):** a multi-wave state-of-the-game review of v0.1 →
  **[`project/audit/reports/2026-06-27-state-of-the-game.md`](../audit/reports/2026-06-27-state-of-the-game.md)** (CONVERGED) +
  6 H-items (`human-in-the-loop/decisions.md`). **v0.1 scores** (↑=better, except Laziness): Fun 4.5 · UI 7 ·
  PRD-faithful 6.5 · README-spirit 7 · human-feedback 7.5 · Incremental 4.5 · Laziness 4.5/10. Verdict: a
  **beautifully-built chassis with no engine** (now substantially addressed by v0.2 above). 10 M3 guardrails
  proposed (G-PACING/CURVE/FUN@M3a/TEST-TEETH/MIGRATION/…).
- **Phase update — H-item queue CLEARED (2026-06-29, session-06).** **H10 (Operating Model v2) → DEFERRED**
  — the v2-lite *bundle* is **not adopted**; the build proceeds without it. Greenlit **one** piece ad-hoc: a
  **content-aware, fast (<5s) pre-commit gate** ([`.githooks/pre-commit`](../../.githooks/pre-commit) +
  [`src/scripts/smoke.ts`](../../src/scripts/smoke.ts) — staged `.ts`→`tsc`, staged `.ts/.md`→`prettier`,
  journal gate kept, pure-core boot smoke; **no test suite**; measured ~0.87s). **H7** (ship-gate skill) +
  **H9** (resolve-queue skill) → **don't build** (resolve by hand; **D-054** owns the milestone-integrity
  policy). Decisions: [`../human-feedback/2026-06-29-h-item-decisions.md`](../human-feedback/2026-06-29-h-item-decisions.md).
  **No open ⛔ blockers remain.** The fuller v2-lite (playcheck ratchet, ship-gate) is revisitable if the
  hand-holding cost resurfaces; the v2-lite reel-back + roadmap re-axe stay as reference in `docs/plans/`.
  Still open: **R1** (the human play/taste call).
- **How to resume:**
  1. Read the newest journal (`project/journal/2026-06-29-session-06-h-item-decisions.md`) + the
     **decision-session ledger** (`project/human-feedback/2026-06-29-decision-session.md`, the source of truth) +
     the `docs/plans/` docs (roadmap re-axe, op-model v2-lite reel-back, the `2026-06-29-path-to-v0.3` sequencing plan).
  2. `npm install` (if fresh clone) → `npm run verify` (should be green) → `npm run dev` to play.
  3. Drive headlessly: `node src/scripts/qa-shots.mjs` (or `window.__qa` in the console: `newGame`, `toRung`,
     `faceWolf`, `fight`, `auto`).
  4. **Next, in order:** (a) **R1** — the human plays the M0–M2 demo for the fun/pacing/look call (still
     open). (b) **Finalize `docs/living/roadmap.md`** from the re-axe proposal — the next ungated step in
     `path-to-v0.3`. (c) Once the human's **extra PRD feedback** lands → the **batched PRD/doc/code ripple**
     in ONE batch: split `prd.md` into per-section files, apply the reshape (D-048…D-055) + the 06-29
     decisions (now ADRs **D-056–D-069**) to the PRD body, ripple docs + code. (d) **Then the build:**
     **carry-forward + retune** the shipped T0 (keep the play-tested M0–M2b foundation), **spine-first** —
     close the four-pillar loop (Estate pillar + the first T0→T1 ascension on thin content) **before**
     showcase breadth, per the roadmap re-axe + `path-to-v0.3`.
- **Demo arc (what to look at):** cold open (wake → Sōan grounds the folklore → rake rice) → labour earns
  the kept-hand then trusted-hand rungs (the estate + Skills tab ink in) → the humbling grain-store wolf
  (R3, survived by luck) → combat goes live (forecasts, level up, the woodlot axe, auto-fight). Screenshots:
  `project/audit/screens/latest/qa-0[1-9]-*.png`.

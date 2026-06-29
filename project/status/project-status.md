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
- **Phase:** **PRD now at V2.3** (the 6-tier reshape — ADRs D-048–D-069 + 5 forks — rippled into the body
  2026-06-29, Part 1 of `path-to-v0.3`; the build against it is Part 2, pending). The **DEMO (M0+M1+M2) was
  built & POLISHED against PRD V2.2** → now human play-testing. The overnight
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
  live (no Math.random/pow/DOM/Date.now in `src/core`). `npm run verify` = 9 gates (tsc, eslint, prettier,
  vitest, verify-content, verify-prd, gen:docs --check, pacing:check, playcheck:check) run **in parallel** via
  `src/scripts/verify-run.ts` (~1.7s; `npm run verify:budget` = the 5s-budget check). The pre-commit hook runs
  full `verify` + a non-blocking drift timer (D-072); the **pre-push hook runs `verify` on every push (all
  branches) and BLOCKS on red** (`SKIP_VERIFY=1` overrides) — session-18. `npm run dev` (Vite); `npm run build` (→ `dist/`, ~42 KB
  JS [gz ~15 KB] + ~14 KB CSS [gz ~4 KB] — itch-ready, relative-base); `npm run build:itch` (zip). Headless
  QA harness: `src/scripts/qa-shots.mjs` + `src/scripts/playtest.mjs` (Playwright) → screenshots in `project/audit/screens/latest/`.
- **Key docs:** `docs/living/prd.md` (the V2.2 vision+spec) · `project/human-feedback/2026-06-26-prd-human-feedback.md` Block N (the
  authoritative decisions) · `docs/living/ui-design.md` (woodblock/ink bible — the renderer is built to it) ·
  `docs/living/fun-factor.md` · `docs/living/qa-playtesting.md` (the __qa harness + fun-proxies) ·
  `docs/living/decisions.md` (ADRs D-001…D-074; each carries a `created_date`). **`prd.md` is now a stub index**
  → the spec lives in per-section files `docs/living/prd/01-vision.md … 07-roadmap-scope.md` (split 2026-06-29).
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
  — but **NOT yet applied to the PRD** *(historical; ✅ applied session-15, see below).* Master checklist +
  precedence: `pending-prd-changes.md` *(retired session-15)*; intent: [`../human-feedback/2026-06-28-tier-reshape.md`](../human-feedback/2026-06-28-tier-reshape.md);
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
  Tier→Milestones→Fun-slices), and the **op-model v2 FINAL** plan (the v2-lite reel-back + implementation drafts
  are archived under `project/archive/`).
- **Phase update — OPERATING MODEL v2 FINAL BUILT (2026-06-29, session-09).** The human reopened op-model v2 as
  **"v2 FINAL"** and it's now built end-to-end (plan, now archived: [`../archive/2026-06-29-operating-model-v2-final.md`](../archive/2026-06-29-operating-model-v2-final.md);
  journal: `project/journal/2026-06-29-session-09-op-model-v2-final.md`): **(A/B)** pre-commit runs the full
  `verify` (9 gates, **parallelized** → ~1.7s) + a noisy-not-blocking 5s drift guard + `verify:budget` + a
  `pre-push` readout; **(D)** the scoped **`playcheck`** §3 fun-vector ratchet in `verify`; **(C)** the mandatory
  **`diverge`** UI-variant skill (branch-preservation → zero `main` flag-debt); **(E)** the **PRD split**
  (`prd.md` → 7 ASCII section files + stub index); **(F)** ADRs **D-072–D-074** (D-072 ⛔ **reverses** the
  pre-session D-070/D-071 "defer v2" call) + CLAUDE.md rules. Also: an **adversarial review** (15 findings fixed),
  **`created_date`** backfilled on all 73 ADRs, and an **ADR staleness audit** (15 superseded/stale entries
  annotated). All commits `verify`-green. *(Op-model v2 / H10 is no longer a gate — it's DONE.)*
- **Phase update — ROADMAP PROMOTED + 5 FORKS FINALIZED + GIT-ADD GUARD (2026-06-29, session-11).** Promoted the
  re-axe proposal → **`docs/living/roadmap.md` (LIVING)** (M0–M7 tracker retired); finalized the **5 forks** (all
  defaults — T2 kept **"Village"** + a "valley beyond your gate" subtitle; ledger:
  [`../human-feedback/2026-06-29-roadmap-forks-finalized.md`](../human-feedback/2026-06-29-roadmap-forks-finalized.md)).
  Added 6 post-promotion ripple items to `pending-prd-changes.md` (incl. **§7/prd-07 = slim + delegate** to the
  living roadmap, not re-duplicate). Built a **PreToolUse guard** (`.claude/hooks/guard-git-add-all.sh`) that
  **blocks broad `git add -A`/`.`/`commit -a`** to stop cross-agent sweeps — *other live sessions must
  `/hooks`-reload to pick it up; script committed, `.claude/settings.json` is gitignored-local.* Commits
  `89dde8e`/`15f932a`/`6784d4f`/`17c7566`.
- **Phase update — PLAN STALENESS RECONCILED + COMPLETED PLANS ARCHIVED (2026-06-29, session-12).** Refreshed
  [`../../docs/plans/2026-06-29-path-to-v0.3.md`](../../docs/plans/2026-06-29-path-to-v0.3.md): 3 of its 4 gated
  blockers had cleared (op-model **D** built, roadmap **C** promoted, the PRD-**split** of **B** shipped) — it
  now reads as just **B content-ripple → E build**. **Archived** the two complete plans → `project/archive/`
  (op-model v2 FINAL, roadmap re-axe proposal) + fixed cross-refs in `decisions.md`/`roadmap.md`/t1-t2 content.
  **`docs/plans/` now holds only `path-to-v0.3.md`.** Ticked the stale `PRD-SPLIT` checkbox in
  `pending-prd-changes.md` (~41 ripple items remain; figure corrected session-13). **Simplified** `docs-to-read-for-human.md` to a terse live
  queue (only path-to-v0.3 + pending-prd-changes still need sign-off). Commit `929ace6`, `verify`-green.
- **Phase update — path-to-v0.3 RESTRUCTURED + HOUSEKEEPING SWEEP (2026-06-29, session-13).** A 3-way grounded
  Workflow audit confirmed **every** upstream "done" claim (ADRs D-056–D-069 + D-072–D-074, roadmap promotion,
  op-model v2 FINAL, PRD-split) against the repo, then
  [`path-to-v0.3.md`](../../docs/plans/2026-06-29-path-to-v0.3.md) was rewritten into **two clean parts** —
  **Part 1 · the doc/PRD content ripple** (~41 items, gated on the human's extra PRD feedback) + **Part 2 · the
  v0.3 build** (RE-SCOPED session-16 into 3 movements: re-baseline T0-M1/M2 → T0-M3 spine → T0-M4 breadth;
  T0-M3 + T0-M4 back-to-back) —
  with all done work collapsed into a footer. Plus the 3 ungated consistency fixes the audit flagged: flipped the
  roadmap-re-axe box (tracker now **41 open / 3 done**), corrected the stale "37"→"~41" ripple figure, and
  repointed all **6 broken `docs/plans/` links** → `project/archive/`. Commits `0d2fa28`/`3148e78`, docs-only.
  Critical path unchanged: **Part 1 (ripple) → Part 2 (build)**, both gated on the human; **R1** still open.
- **Phase update — VERSION DISPLAY WIRED (2026-06-29, session-14).** The Settings panel build stamp was
  hard-stuck at `build dev · dev`; now resolves from git at vite config-load (works in both `dev` and `build`).
  Panel reads `… · {__VERSION__} · build {__BUILD_SHA__} · {__BUILD_DATE__}` — clean tag (`v0.2`) + full
  `git describe` (`v0.2-NN-gSHA`) + last-commit date. Env vars still override for CI. Commit `d279f88`, verify
  green. Small wiring fix, not a canon change — flag for the Part 1 ripple if the human wants it PRD-formalized
  (the stamp is speced under §6.1.1 / Q54).
- **Phase update — PART 1 of v0.3 EXECUTED: the PRD/doc ripple is DONE (2026-06-29, session-15).** The locked
  6-tier reshape (D-048…D-069) + the 5 finalized forks are now **rippled into the 7 PRD section files + the
  other living docs** — the PRD body is **no longer 5-tier-stale**. Flow: a **multi-agent audit** of
  `pending-prd-changes.md` (verdict *fix-tracker-then-ripple*: canon-faithful but it had missed 2 roadmap locks +
  had stale framing) → **tracker corrected** + an **authoritative reshape-mapping spec** authored
  ([`../archive/2026-06-29-part1-ripple-spec.md`](../archive/2026-06-29-part1-ripple-spec.md)) → a
  **12-agent ripple Workflow + convergence critic** → a **structural-consistency cleanup**. **`npm run verify`
  GREEN (9 gates, incl. `verify-prd`); ZERO accidental deletions** (the §7.2 M0–M7 block, ~538 lines, was gutted
  to a delegation pointer at `roadmap.md` — §7.1/§7.3/§7.4 survive). Net-new locks all landed: Staff weapon-line
  pulled forward to new-T2 Village, combos partial-T2/full-T3, rivals begin-T2/climax-T3, retinue+E1→E2 in T1.
  The tracker's 2 markdown checklists are **all `[x]`**; **what remains is Part 2** — the **code** checklist +
  the **`docs/content/` regen**, and the **§4 balance MAGNITUDES** (deed-bands/hour budgets) which re-derive at
  **Ship-M1-F2** (LIQUID, D-059 — banner'd in `prd/04-combat-balance.md`). Raw audit + ripple snapshots in
  `project/brainstorms/raw/2026-06-29-{prd-ripple-tracker-audit,part1-doc-ripple}.json`; journal:
  `2026-06-29-session-15-part1-ripple.md`. **The PRD-feedback gate is fully closed — Part 2 (the build) is next.**
  **Post-ripple housekeeping (session-15):** the `pending-prd-changes` tracker is **RETIRED/deleted** (zero
  pending PRD changes; its Part-2 code checklist is **migrated into `path-to-v0.3` Part 2** as a provenance map
  so nothing's lost) + all live refs repointed; the executed reshape-mapping spec is **archived** to
  `project/archive/2026-06-29-part1-ripple-spec.md`; the misfiled repo-relative `.claude/projects/` agent-memory
  stray was removed (relocated to its canonical `~/.claude/` HOME).
- **Phase update — GH-PAGES DEPLOY + PRE-PUSH GATE + "CHECKPOINT" FORMALIZED (2026-06-29, session-18).**
  Shipped a one-command publish path: **`pnpm run gh-pages`** (`src/scripts/gh-pages.sh`) builds → `rsync`s
  `dist/` into an **orphan `gh-pages` worktree** (on disk at `../gh-pages-kami-kakushi`) → `.nojekyll` →
  commit + push. **Site is LIVE: https://raynos.github.io/kami-kakushi/** (Pages already configured + built;
  vite's `base: './'` makes the project-page subpath work). Added a **pre-push gate** (`.githooks/pre-push`):
  runs `npm run verify` on **every push, all branches**, blocks on red (`SKIP_VERIFY=1` overrides) — the
  push-time backstop for the pre-commit `SKIP_VERIFY` escape. Formalized **"checkpoint"** as a named ritual in
  `CLAUDE.md` + `working-agreements.md`: commit-own-files-by-path → journal → update THIS file → **push main
  (fires the verify gate)** → confirm clean; with three baked-in rules — **verify-before-claiming**,
  **shared-tree safety** (NEVER stash/restore another agent's WIP; stage only your own files by explicit path —
  multiple agents may edit the tree at once), **don't-fight-someone-else's-red**. Commits `a7608a9`→`2813e6a`,
  all on `origin/main`, green. *(Note: another agent landed `22cf15c` HP-carry combat — Movement-1 work —
  during this session.)* Journal: `project/journal/2026-06-29-session-18-gh-pages-deploy.md`.
- **Phase update — v0.3 PART 2 BUILD IN PROGRESS (2026-06-29, session-19).** Full mandate to build
  `path-to-v0.3` Part 2 end-to-end with parallelism. Done so far (all `verify`-green; journal:
  `project/journal/2026-06-29-session-19-v03-part2-build.md`): **(audit)** a 21-agent source-fidelity Workflow +
  headless built-game pass → the **re-baseline gap report** (`project/audit/reports/2026-06-29-t0-m1-m2-rebaseline.md`,
  27🟢/10🟡/14🔴). **(Movement 1 combat-correctness)** P1 **HP-carry/heal-by-eating** (D-050 — `mcCombatStats`
  reads carried HP, 3 non-eating heals removed, `cook_meal` mends HP); P2 **no-stance-dominated** (Pareto-lever
  test); P4 **no-stranding** (eat+repair reaches L2, 8 seeds). **(Movement 2 spine — THE LOOP CLOSES)** M2·1 schema
  (`tier`+`influence`, SCHEMA_VERSION 1→2, real v1→v2 migrate) · M2·2 R7 capstone (thin R4→R7, R3 dead-end fixed,
  `t0-capstone`→Phase 2) · M2·3 `pillars.ts` (Phase-2-gated, per-deed-capped Estate deeds) · M2·4 seasonal judge
  (new-high-water, 70/30, ±10%, day-keyed) · M2·5 `ascension.ts` (gate=Estate≥EXCELLENT, manual opt-in, tier 0→1,
  grade-scaled boon, dream beat) **+ a reducer-driven spine-closure test**. A **6-module scatter-gather Workflow**
  authored the disjoint leaf modules (sfx/dialogue/quests/crafting/map/market — raw at
  `project/brainstorms/raw/2026-06-29-v03-leaf-modules-authoring.json`), staged for integration. **Remaining:** M2·6
  live-Estate UI (DIVERGE) · M2·8 retire DEMO/REAL fork + DEV tools · integrate the leaves · M3 flywheel + stance
  reveals · roadmap-respect verification. ⚠️ **Shared tree** — another agent committing concurrently; explicit-path staging only.
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
  1. Read the newest journal in `project/journal/` (latest: `2026-06-29-session-19-v03-part2-build.md`) + the
     **decision-session ledger** (`project/human-feedback/2026-06-29-decision-session.md`, the source of truth) +
     the active sequencing plan `docs/plans/2026-06-29-path-to-v0.3.md` (**Part 1 done → Part 2 next**) + its
     executed reshape-mapping spec `project/archive/2026-06-29-part1-ripple-spec.md` (the OLD→NEW tier mapping +
     per-system re-placement table — useful reference for the Part-2 build).
  2. `npm install` (if fresh clone) → `npm run verify` (should be green) → `npm run dev` to play.
  3. Drive headlessly: `node src/scripts/qa-shots.mjs` (or `window.__qa` in the console: `newGame`, `toRung`,
     `faceWolf`, `fight`, `auto`).
  4. **Next, in order:** (a) **R1** — the human plays the M0–M2 demo for the fun/pacing/look call (still
     open, in parallel). (b) ✅ **DONE (session-11)** — roadmap promoted to `docs/living/roadmap.md` + 5 forks
     finalized. (c) ✅ **DONE (session-15)** — **Part 1 (the PRD/doc ripple) is EXECUTED** (reshape + forks
     rippled into the 7 `prd/0N-*.md` section files + the living docs; `verify` green). (d) **NEXT — Part 2,
     the build (`path-to-v0.3` Part 2), RE-SCOPED 2026-06-29 session-16 into THREE movements:** **Movement 1 —
     re-baseline T0-M1/M2** (v0.2 was built against an older PRD → audit the source code AND the running game via
     `battery` + `capture-game-states` → gap report ✅/🟡/🔴 in `project/audit/reports/` → re-implement the gaps;
     blanket carry-forward is downgraded to *carry-forward-earned-per-fun-slice-by-audit*); **Movement 2 — the
     T0-M3 spine** (the live Estate pillar + the BIG T0→T1 ascension on thin content, prove it CLOSES);
     **Movement 3 — the T0-M4 breadth** (first quest, koku flywheel, mentor lore-talk + market, walkable map,
     stance/ability reveals, found/crafted 2nd weapon). **T0-M3 + T0-M4 ship back-to-back** (coupled); spine-first
     held *within* the release. At the start of Movement 2, re-derive the **§4 balance MAGNITUDES** onto the 6-tier
     spine (liquid, banner'd in `prd/04-combat-balance.md`) + regen `docs/content/`.
- **Demo arc (what to look at):** cold open (wake → Sōan grounds the folklore → rake rice) → labour earns
  the kept-hand then trusted-hand rungs (the estate + Skills tab ink in) → the humbling grain-store wolf
  (R3, survived by luck) → combat goes live (forecasts, level up, the woodlot axe, auto-fight). Screenshots:
  `project/audit/screens/latest/qa-0[1-9]-*.png`.

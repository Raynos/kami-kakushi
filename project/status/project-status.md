---
name: project-status
description: Live one-screen snapshot — current state + how to resume
metadata:
  type: project
---

# Project status

> Keep this to one screen. Update it at the end of each session so a cold pickup is instant.

- **History rewrite (session-25):** all 269 commits on `main` rewritten via `git filter-repo` — scrubbed
  the 58 `project/brainstorms/raw/*.json` blobs from history + converted every AI `Co-Authored-By` trailer
  to `Assisted-by:` (force-pushed `c5e2a67…839f98d`). **Any separate clone must `git fetch && git reset
  --hard origin/main`.** Backups deleted post-confirm. (`project/archive/2026-06-30-history-rewrite.md`.)

- **Repo guards (session-24):** three **hookify** rules in `.claude/hookify.*.local.md` (tracked, not
  gitignored) warn/block *agent* git actions that violate shared-tree safety — bulk `git add -A`/`commit -a`,
  `git stash`/`restore`/`checkout <path>`, and `SKIP_VERIFY=…` + `git push`. They guard agents, not humans;
  the real `.githooks` still own commit/push gating.

- **Tracked Claude config (session-29):** `.claude/settings.json` is now **version-controlled** (was
  gitignored) — the hook wiring (`PreToolUse` git-add guard + `SessionStart` brief) and the `enabledPlugins`
  set ship on clone, plugins included. Per-machine overrides still go in `.claude/settings.local.json`.

- **Game:** a grounded, story-driven **incremental RPG** in mid-Edo (~18th c., fictional) rural Japan.
  A mediocre ~18yo (true name **Tahei**) wakes amnesiac on a declining lower-samurai (*goshi*) estate
  (the **Kurosawa** house); rise through **5 tiers** (Estate→Village→Region→Castle-town→Edo), growing
  **House Influence** (4 pillars). Signature: **the UI itself unlocks incrementally**. No magic; growth
  only through perseverance; no reset. (Spec: `docs/living/prd.md`.)
- **Phase:** **PRD at V2.3** (the 6-tier reshape — ADRs D-048–D-069 + 5 forks — rippled into the body 2026-06-29,
  Part 1 of `path-to-v0.3`). **⭐ Part 2 (the v0.3 build) is BUILT END-TO-END (session-19): the T0 M0–M4 arc is
  PLAYTESTABLE** — the macro spine demonstrably CLOSES (tier 0→1 ascension fires, proven by an end-to-end
  real-intent test `src/core/t0-arc.test.ts`) + the T0-M4 breadth is wired + **M2·8 DONE** (DEMO/REAL fork retired,
  real ~5-min cold-open pace) + an 8-lens fidelity battery (prd 9 / adr 8.5 / human-fb 8) **AND a post-M2·8
  adversarial re-audit both passed — independently confirmed ship-quality** (231 tests green). **Now awaiting the
  human's R1 play/taste call** (+ the R4 judgment queue). The earlier **DEMO (M0+M1+M2) built & POLISHED against PRD V2.2** is the v0.3 floor. The overnight
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
  human reading queue: [`todo-human.md`](../todo-human.md). *(Applying + building is downstream of the ⭐ v2 / H10 gate below.)*
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
- **Phase update — ⭐ v0.3 PART 2 BUILT END-TO-END + FIDELITY-BATTERED — PLAYTESTABLE (2026-06-29, session-19).**
  The full `path-to-v0.3` Part-2 mandate is **DONE** and the **T0 M0–M4 arc is now playtestable** (journal:
  `project/journal/2026-06-29-session-19-v03-part2-build.md`; **220 tests green**, all `verify`-green, on
  `origin/main`). **(audit)** a 21-agent source-fidelity Workflow + headless pass → the re-baseline gap report
  (`…/2026-06-29-t0-m1-m2-rebaseline.md`, 27🟢/10🟡/14🔴). **(Movement 1 — combat correctness)** P1 **HP-carry/
  heal-by-eating** (D-050); P2 **no-stance-dominated** (Pareto-lever); P4 **no-stranding** (eat+repair → L2, 8
  seeds). **(Movement 2 — THE SPINE CLOSES)** M2·1 schema (`tier`+`influence`, SCHEMA_VERSION 1→2, real migrate) ·
  M2·2 R7 capstone (thin R4→R7, R3 dead-end fixed, `t0-capstone`→Phase 2) · M2·3 `pillars.ts` (Phase-2-gated,
  per-deed-capped Estate deeds) · M2·4 seasonal judge (new-high-water, 70/30, ±10%, day-keyed) · M2·5
  `ascension.ts` (gate=Estate≥EXCELLENT, manual opt-in, tier **0→1**, grade-scaled boon, dream beat) · M2·6
  **live-Estate UI** (grade bar + locked pillar silhouettes + Ascend CTA + the T0→T1 ceremony — **DIVERGE**, R2).
  **(Movement 3 — T0-M4 breadth)** all 5 leaf modules wired: diegetic **dialogue** mentor (D-039/D-063), one
  **craftable** 2nd weapon (loot→craft, grant retired D-052), first **quests** (D-037), tiny **market** (D-008),
  walkable **map** (node-graph + `move_to`, D-065 — DIVERGE, R3). **(fidelity battery)** an 8-lens cold-read
  Workflow → `project/audit/reports/2026-06-29-v03-fidelity-battery.md` (**prd 9 / adr 8.5 / human-fb 8**;
  verdict: *the game the PRD promised is built & honest; the first-10-min FEEL isn't tuned yet*). **7
  self-resolvable findings applied** (cold-open reveal-as-plot gating · ascension seal scrim · seasonal-judge
  geometric-inflation fix · dead-value ratchet now covers loot mats · no-stranding test de-tautologised · +2
  RED-able guards: D-052 equip-gate, porter's-knot inert). **Deferred to the human (R4 judgment queue, 6 calls):**
  D-056 DEMO/REAL fork retirement + T0 pacing re-derive (the one live ADR contradiction), D-053 wall-time clock,
  surplus-material dead-tail, first-10-min fun tuning, DEV-harness coverage, D-073 variants-log backfill. ⚠️
  **Shared tree** — concurrent agents; explicit-path staging only.
- **Phase update — v0.3 POLISH PASS 2 (2026-06-29, session-19 cont.).** After the build + battery, a second
  autonomous-safe pass (no design calls): **(1)** backfilled the **D-073 variants-log** registry (battery §72 —
  was empty despite 5 diverge runs); **(2)** a **hands-on QA visual sweep** of the *running* build —
  `project/audit/screens/2026-06-29-v03-qa-sweep/` (15 surfaces, **0 console errors**), which **found + fixed 1
  real visual bug** (the map header read "You stand at **the the** grain-store" — `render.ts` stripped the doubled
  article) and confirmed the macro-spine UI in-pixels (grade-bar Good⅓→Excellent-gold + the Ascend CTA; the
  cold-open koku-teaching lands on the +koku; seals all scrimmed); **(3)** a **populated-state save round-trip
  test** (cross-session playtest persistence for tier/influence/quests/location/marketBought). All green, pushed.
  One observation routed to R4#5 (post-ascension panel shows stale T0 framing = thin-T1-content, a depth call).
- **Phase update — M2·8 DONE: DEMO/REAL fork RETIRED (2026-06-29, session-19, human-steered mid-loop).** The human
  asked about M2·8 + clarified **the DEV tools are permanent until ship**; with **D-056** (locked: ship real pacing,
  DEV speed toggle for velocity) that unblocked it. Retired the fork across 14 files → **ONE re-derived T0 profile**
  (R0 1100 ≈ **4.88 min** cold-open · R1 2150 ≈ **10.0** · R2 2600 ≈ **12.1** · R3–R7 2800→3400; sim-verified). T0 is
  ≥30-floor-EXEMPT → the pacing gate is the sane **band [3,22] min** (RED-able). Removed `BalanceProfile` + the
  `balanceProfile` state field + the `?balance=`/VITE boot resolver + `__qa.setProfile/profile`; **KEPT** the DEV
  speed toggle + teleports (the R1 playbook). playcheck re-blessed, docs regenerated. **verify GREEN (9 gates, 226
  tests)** + a headless DEV-tools smoke (0 console errors). Magnitudes LIQUID (D-059) — human tunes by playtest. The
  one remaining live ADR contradiction (D-056) is **resolved**; R4#2 closed. Commit `adebf22`.
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
- **Phase update — ⭐ R4 DECISIONS LOCKED + v0.3.1 APPROVED + reading-queue GATE (2026-06-30, session-23).** The human went
  through the open v0.3 questions interactively (2× AskUserQuestion) → **ADRs D-075…D-079**: **D-079** active-only
  PAUSE clock (resolves the D-053 contradiction); **D-076** combat = HP-attrition, **no auto-heal**, 0-HP-loss
  stops autopilot; **D-077** standing/pillars stay deed-based (NOT wealth) + tighten koku (more sinks, not rich
  until T5); **D-078** ≥1 load-bearing breadth (a map node gates a deed/yield); **D-075** diverge-v2 (full 2–3
  variants always, live in a **DEV panel** toggle, each a review.md item — retires diverge-LITE; refines D-073).
  Capture: `project/human-feedback/2026-06-30-r4-playtest-decisions.md`. **Conventions adopted:** the
  `Assisted-by:` commit trailer (not `Co-Authored-By:`, hook-enforced); ~80-char markdown prose (soft norm); the
  HITL archive flow now covers **R-items** (`archive.md` = Decisions + Reviews; `review.md` open-only). **Late in
  the session — a reading-queue GATE:** the v0.3.1 plan got authored but not added to the reading queue (an
  implicit norm got forgotten), so a `.githooks/pre-commit` gate now **hard-blocks** a new `docs/plans/*.md`
  missing from `todo-human.md` and **loud-warns** a new brainstorm/audit-report (two rungs by the queue's own
  history; `SKIP_QUEUE=1` bypass). The judgment-based "what belongs in the reading queue" rule is now in CLAUDE.md
  + the `todo-human.md` header. CLAUDE.md was also **reflowed to ~80-char** (pure rewrap, word-diff-verified).
  **Hygiene:** archived the executed `path-to-v0.3` plan, closed R4. The **v0.3.1 build plan is human-READ +
  APPROVED → build greenlit** (dequeued; only the process-learnings retrospective remains in the reading queue).
  **No code yet** — sequenced in **`docs/plans/2026-06-30-v0.3.1-build.md`** (DEV panel + variants → combat → koku
  → map node → clock doc-fix → battery leftovers). All `verify`-green, on `origin/main`.
  **Later (same session):** a **full-session JSONL review** (83 MB / 5053 records) added a 4th hookify rule
  `warn-shell-write-source` (`58419ed`) and an independent re-pass Workflow (6 miners → convergence) that found
  **23 process learnings the retrospective missed** — folded into `brainstorms/2026-06-30-v03-process-learnings.md`
  as an Addendum A1–A23 (`7ca6ac2`). Those 2 commits were **local-only at checkpoint** (a co-agent ran sessions
  24–26 in the shared tree — held the push; see resume step 0).
- **Phase update — SESSION-BRIEF NUDGES NEXT AUTONOMOUS WORK (2026-06-30, session-26).**
  `session-brief.sh` now appends a "🤖 Next autonomous work" section after the human queue: it surfaces the last
  6 commits + lists `docs/plans/` tagged DONE/maybe-active **from each plan's own Status line** (done plans can
  linger in `docs/plans/`, so trust the Status line, not the filename) + points at the live snapshot / latest
  journal / roadmap, and asks the agent to **propose ≤3 startable tasks, verifying against git**. **No stored
  task list** — a `next-tasks.md` queue was tried then rejected as one-more-file-to-maintain. Documented in
  AGENTS.md "Session start". Commits `d554db3` + the checkpoint; journal
  `2026-06-30-session-26-session-brief-autonomous-tasks.md`.
- **Phase update — SESSION-BRIEF MADE FAST & LEAN (2026-06-30, session-28).** Live human feedback: a cold start
  was ~27s and the brief padded one plan into three "tasks". The script itself runs in **0.11s** — the cost was
  the *agent* reading the 293-line snapshot + the active plan + running full `verify`, all nudged by the brief's
  "investigate… propose up to 3… verify against git" wording. Reworded `session-brief.sh` + AGENTS.md "Session
  start": **"up to 3" is now a cap for genuinely-parallel work, not a quota** (often just the one active plan;
  don't split one plan's steps into three), and an explicit **≤5s budget** — brief from the hook output + a peek
  at the active plan's Status line, **defer** the verify-against-git check to when the work is picked up. Commit
  `b05e7ea`, docs-only; journal `2026-06-30-session-28-session-brief-speedup.md`.
  **Also (session-28):** added a **user-invoked-only** `/prepare-to-exit` skill
  (`.claude/skills/prepare-to-exit/SKILL.md`, `disable-model-invocation: true`) — the runnable form of the
  checkpoint ritual. Designed as **pure delegation**: it holds no copy of the steps, just reads
  `working-agreements.md → "Checkpoint"` live and runs it, so evolving the ritual is a one-file edit. Commits
  `3af676a` → `01e63e2`.
- **Phase update — SESSION-BRIEF: ZERO-TOOL-CALL OPENING TURN (2026-06-30, session-30).** A cold start was still
  timed at ~9s — over the ≤5s budget set in session-28. Root cause: the script runs in <0.1s; the cost was the
  agent firing a needless `git status`/`git log`/grep round-trip *during* the opening relay, invited by the
  brief's own "brief from THIS output **+ a peek at the active plan's Status line + the commits**" wording.
  Reframed `session-brief.sh`: a prominent `⏱️` directive at the **top** of the brief — relay with **ZERO tool
  calls**; everything (queue, reviews, commits, ▶️/✅ active-plan tag) is already inlined; defer verify-against-git
  to when the work is picked up. Dropped the "+ a peek" wording from the next-work block. Commit `ef993cd`,
  docs-only (`SKIP_JOURNAL`); journal `2026-06-30-session-30-brief-zero-tool-calls.md`.
- **How to resume:**
  1. Read the newest journal in `project/journal/` (latest: `2026-06-30-session-30-brief-zero-tool-calls.md`)
     + the **R4 decision capture** (`project/human-feedback/2026-06-30-r4-playtest-decisions.md`) + the active
     **build plan** `docs/plans/2026-06-30-v0.3.1-build.md` (the v0.3.1 build — **human-APPROVED / greenlit, NOT
     started**). _(The v0.3 build
     plan `path-to-v0.3.md` is fully executed → archived in `project/archive/`; its reshape spec lives there too (
     per-system re-placement table — useful reference for the Part-2 build).
  2. `npm install` (if fresh clone) → `npm run verify` (should be green) → `npm run dev` to play.
  3. Drive headlessly: `node src/scripts/qa-shots.mjs` (or `window.__qa` in the console: `newGame`, `toRung`,
     `faceWolf`, `fight`, `auto`).
  4. **Next, in order:** (a) ⭐ **R1 — the human plays the v0.3 T0 M0–M4 build** for the fun/pacing/look call
     (the headline open action — see `project/human-in-the-loop/review.md`, which carries a **DEV-tools playbook**:
     `__qa.speed(8)`, `jumpToPhase2()`, `jumpToAscension()`, `toRung()`; gallery at
     `project/audit/screens/v03-gallery/`). (b) ✅ **DONE (session-11)** — roadmap promoted + 5 forks finalized.
     (c) ✅ **DONE (session-15)** — Part 1 (the PRD/doc ripple) executed. (d) ✅ **DONE (session-19)** — **Part 2,
     the v0.3 build, is COMPLETE** (all 3 movements: re-baseline T0-M1/M2 → the T0-M3 spine that CLOSES →
     the T0-M4 breadth) + fidelity-battered + 7 self-resolvable findings applied. **What's left is the human's
     call:** R1 (playtest) + the **R4 judgment queue** (6 design/taste decisions, incl. the deferred D-056
     DEMO/REAL fork retirement + T0 pacing re-derive — a risky 13-file pacing-gate refactor that needs human
     sign-off on the re-derived ≥30-min thresholds, NOT a unilateral call). R2/R3 are the M2·6 / breadth diverge
     picks (override-only, non-blocking).
- **Demo arc (what to look at):** cold open (wake → Sōan grounds the folklore → rake rice) → labour earns
  the kept-hand then trusted-hand rungs (the estate + Skills tab ink in) → the humbling grain-store wolf
  (R3, survived by luck) → combat goes live (forecasts, level up, the woodlot axe, auto-fight). Screenshots:
  `project/audit/screens/latest/qa-0[1-9]-*.png`.

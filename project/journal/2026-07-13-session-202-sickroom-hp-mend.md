# 2026-07-13 · session 202 — the sickroom HP-mend lane

**Goal:** walk the human through the open decisions in
`docs/plans/fable-2026-07-13-sickroom-hp-mend.md`, then build it.

## Decisions locked (human, via AskUserQuestion)

- **Routing:** this Fable session builds all five steps; the step-4
  take-authors inherit Fable (the 07-11 near-cap Opus steer treated as
  retired for this work).
- **Magnitudes:** agent self-picks `TREAT_COST_MON` / restore / trickle,
  gated by the no-stranding sim + the ADR-132 pacing report; human tunes
  later by cockpit slider.
- **Unwaged `treat`:** **mon-only** — before a wage the paid verb is
  hidden and the only mend lane is the free `rest_sickroom` trickle.
  This SUPERSEDES the plan's "else costs a day" wording (ADR-022,
  newest steer wins); plan + ADR-164 phrasing to be amended in step 1.
- **Order:** fix the RED CI e2e lane first, then step 1.

## Done

- **e2e lane un-redded.** CI's `fixture registry drift` test failed on
  main: session 201's rung-jump fold-in added the eight `rung-R0`…
  `rung-R7` fixture saves without joining `FIXTURES` in
  `src/tests/e2e/helpers.ts` — exactly the drift the test guards. Added
  the eight names (which also grants each rung save the per-fixture
  mobile + desktop layout tests). Full local e2e: **115 passed**.

- **ADR-197 recorded** (mon-only `treat`, 🔁 refines ADR-164 Q9;
  the Q9 clause struck with a forward pointer) and the plan amended
  to match (Status → IN PROGRESS, step 1 + verification reworded).

## Done (continued) — the mechanism (plan steps 1–3 + 5)

- **The two verbs built.** `treat` (mon-only, TICKS_PER_ACT, timed
  8 s) + `rest_sickroom` (free, the sleep-math dawn wake + missed-meal
  pro-rate, INSTANT like sleep) — intents, AC-6 selectors
  (`canTreat`/`treatForecast`/`canRestSickroom`/`restSickroomForecast`),
  place-strip rows at the sickroom node, cockpit levers, timing +
  affordance + persona registries. `SICKROOM_NODE` re-homed to
  `content/map.ts` (defeat.ts re-exports).
- **Cook heal severed** in the same commit: `COOK_HP_RESTORE` deleted
  end-to-end; cook = belly only; heal-cue UI + stale comments
  (`defeat.ts`/`fight.ts`/`combat.ts`/`selectors.ts`) fixed;
  `combat.loss` + `food.cook` log lines reworded; seed prose for
  `sickroom.treat`/`sickroom.rest` (step 4 diverge revoices).
- **Latent TST2 bug fixed:** labour-earned coin never latched
  `coin-earned`, so a purse spent to 0 could un-reveal `readout-coin`
  — `applyRewards` now latches on any carried-coin gain (the
  invariants arc caught it the moment `treat` could zero a purse).
- **Balance pass (ADR-132):** no-stranding green on every persona ×
  seed. R3 measured 26.0 [24.3–27.8] vs the signed [3, 25] — the
  mend-trip walk is structural (old cook-mend was in-field). Human
  re-signed **T0_PACING_BAND_MAX 25 → 28** (over trimming R3 counts;
  recorded under ADR-197). Seeds: TREAT_COST_MON 8 · TREAT_HP_RESTORE
  50 · REST_SICKROOM_HP 32; QA driver mends on a trigger/target pair
  (walk under ⅓ HP, leave full). `t0-pacing.md` regenerated; fixtures
  regenerated; full vitest 1395 green.
- Telemetry read (FB-8): 6 reports, all pre-date the mend change
  (06-26 / 07-10) — attended R3 baseline ~old-model; no untainted
  post-change data to quote yet.

## Done (continued) — ripple + proof

- **PRD ripple landed (`a473dc40`):** six "only mend is eating"
  passages re-pointed at the sickroom lane (§2.3 · §2.8 ×2 · defeat
  block · R3 ladder row · §4 ×2); t0 bible's sb-cook line fixed;
  `prd:drift` CLEAN.
- **PH6 player-reach proof (headless, vs committed HEAD on a
  throwaway :5199 worktree — :5173 was boot-red from w1's take WIP):**
  post-loss-broke boots AT the sickroom hp 1; both rows priced
  honestly; treat → hp 1→51, coin −8; rest → day+1, hp→68 (clamped);
  treat row HIDES broke/full; cook on a hurt body → sansai spent,
  belly +15, **hp unmoved at 1**. Shots:
  `project/audit/screens/2026-07-13-sickroom-mend/`.

## Next intended steps

- **Step 4 HELD:** the ADR-139 3-take diverge for the treat/rest
  lines waits on w1's take-system refactor (same bundle format);
  resume after it lands — the plan's Status line carries the hold.
- Push rides the next open push-lane window (`pnpm run push`; lane
  was held by w1 at the last attempt).

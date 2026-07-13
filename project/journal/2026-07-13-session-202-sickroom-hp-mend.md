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

## Next intended steps

- Plan step 1: the `treat` / `rest_sickroom` intents + sickroom
  activity entry (mon-only treat per the ruling above).
- Step 2 same commit: sever `COOK_HP_RESTORE`, fix the three stale
  comments; free rest lands in the same commit (no-stranding).

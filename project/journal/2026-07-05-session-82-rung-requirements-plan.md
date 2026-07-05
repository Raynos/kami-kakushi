# Session 82 — 2026-07-05 — F121 rung-requirements grill → plan + ADR D-137

**Summary:** grilled the human live (three AskUserQuestion rounds) on the F121
requirements-based rung-progression brainstorm, locked all five open questions
plus two new forks surfaced in grilling (gate shape, tunables), and turned it
into a build plan + ADR D-137. Docs-only session — no code touched.

## What changed

- `docs/plans/fable-2026-07-05-requirements-rung-progression.md` — NEW: the
  7-phase plan (core engine → md grammar+authoring → wiring → UI/cheatlist →
  sim re-derive → tier tests → PRD ripple), with routing verdict
  (70% Opus / 30% Fable; grammar + sim policy are the Fable-risk phases).
- `docs/living/decisions.md` — NEW ADR **D-137**: full replace of the points
  model with hidden anything-goes per-rung requirements; rounded-% bar with
  5–10-chunk counted updates + flavor line per completion; 100% alone unlocks
  the rung beat (`storyGate` deleted); F5 markdown authoring, no balance.ts
  mirror; bands re-derive; all R0–R7 in one pass.
- `project/brainstorms/2026-07-05-requirements-based-rung-progression.md` —
  Status → DIRECTION LOCKED; appended the grill-outcomes record (the human's
  verbatim intent quotes live there).
- `project/todo-human.md` — reading queue: brainstorm entry cleared (discussed
  live = implicit sign-off, D-089), plan queued in its place.

## Next intended steps

1. Human reads the plan (queued) — confirm phases/sequencing.
2. Build starts at Phase 1 (pure-core engine, TDD) + Phase 2 grammar spec in
   parallel; coordinate `render.ts` timing with the live UI-v2 Andon plan
   (that plan owns the rung-head's LOOK, this one its DATA).

## Landmines

- The plan deletes `rungThreshold`/`RUNG_POINTS_PER_ACT` — load-bearing in
  `economy.test.ts`, `m1.test.ts`, `rung-beats.test.ts`, `balance-sim.ts:293`
  (signed-intent guard) and the DEV cockpit sliders. All mapped in the plan.
- Phase 5 (sim driving arbitrary requirements) is the risk concentration; the
  grammar's `drive:` hint exists specifically to keep every authored
  requirement bot-satisfiable.

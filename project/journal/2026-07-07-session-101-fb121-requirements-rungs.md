# Session 101 — 2026-07-07 — FB-121 requirements-based rung progression (build)

## ☀️ SUMMARY (read this first)

Building the LOCKED plan
[`docs/plans/fable-2026-07-05-requirements-rung-progression.md`](../../docs/plans/fable-2026-07-05-requirements-rung-progression.md)
(ADR-137): the points/meter model is replaced by authored hidden requirement
lists per rung, a rounded-% bar, flavor lines, and re-derived pacing bands.
Four build decisions locked by the human at session start (recorded in the
plan's header): per-rung flavor diverge bundles (ADR-139), build now
independent of the story-quality-ladder plan, async Phase-2 sign-off, all
phases in this Fable session. Live snapshot: `project/status/project-status.md`.
This file is HISTORY, not live state.

Shared-tree note: the Phase-2 economy redesign build is running IN PARALLEL in
another session — Phase 5 here (balance-sim + bands) re-derives against
whatever economy has landed by then; contested files rebase-aware.

---

## 1 · Phase 1 — pure requirements engine (TDD)

- `src/core/requirements-engine.ts` — NEW: the pure engine mirroring
  quest-engine's shape. Requirement defs (`count` token/target, `state`
  tiny-grammar predicate + `native:` escape hatch, `flag`), latching progress
  map, `advanceOnToken` / `settleOnState` (both return what completed, so
  flavor fires exactly once), quantized `rungPercentOf` (equal weight per req;
  counted reqs step in derived ≤10 chunks; integer 0–100 with a 99-clamp so
  100 ⟺ ALL done), `chunkCount` derived never authored.
- `src/core/requirements-engine.test.ts` — NEW: 7 engine-contract tests
  (synthetic defs on purpose — content-derived fixtures come with the gen'd
  registry in later phases): token routing + no-op identity, complete-once
  latching, state/flag settle + no-regression latch, quantized monotonic
  integer percent, the 99-clamp (a 20-req list where rounding WOULD lie),
  chunk derivation, loud unknown-native error.

## Next intended steps

1. Phase 2 — `requirements.md` grammar in gen-narrative (parse/emit/validate),
   author all 8 rung lists, registry `requirements.gen.ts` + t0-story section
   (reading-queue it).
2. Phase 3 — the full cutover: state field swap (`rungMeter` →
   `rungReqs`), ranks.ts rewire, delete `storyGate` + points constants, save
   migration, fixtures regen.
3. Phases 4–7 per the plan.

## Landmines

- The state cutover CANNOT land halfway — `rungThreshold` has ~27 consumer
  files; the delete + rewire goes in one verified commit (plan: no
  half-migrated ladder).
- Flavor completion lines: permanent `narration`-channel, `narrator` voice
  (log channels are `narration|reward|combat|system|milestone` — no dedicated
  story channel; rung beats use narration too).

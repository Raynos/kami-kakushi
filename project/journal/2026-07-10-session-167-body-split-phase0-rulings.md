# Session 167 — 2026-07-10 — body-split plan Phase 0 ruled (ADR-178)

**Summary:** The human asked for all open questions & decisions in the
body-split plan (`docs/plans/fable-2026-07-10-body-split-hunger-stamina.md`)
via AskUserQuestion. The plan's four Phase-0 forks were surfaced in one round
and all four ruled: **Option C** (stamina short-cycle + hunger daily-cycle),
display names **Body 体 + Belly 腹**, hunger **only slows in T0** (starvation
consequences allowed T1+), and the FB-343 food verbs **re-home to the
Inventory tab** once Schedule A (ADR-177) lands. Transcribed as **ADR-178**;
plan Status flipped to PHASE 0 RULED. Docs-only session — nothing built.

## What changed
- `docs/living/decisions.md` — appended ADR-178 (the four rulings + why +
  consequences).
- `docs/plans/fable-2026-07-10-body-split-hunger-stamina.md` — Status line →
  ✅ PHASE 0 RULED; Phase 0 bullet rewritten as the ruled record.

## Next intended steps
1. Phase 1 (core model, test-first — Opus-safe per the plan's routing): the
   new `hunger` store + drain/refill in `step.ts`/`intents.ts`, selectors,
   save-schema migration, invariants test (ADR-088 lane).
2. Phase 2 (UI two-bar header, taste-scorecard both passes) after Phase 1.
3. Phase 3 (ADR-132 balance verdict, telemetry step 0) last.

## Landmines
- The Inventory re-home (ruling 4) depends on Schedule A's R4 Inventory tab
  (ADR-177 Phase 2) landing first — until then eat/cook stay zone actions.
- Bar names are canon NOW (FB-334's law): any interim UI text touching the
  satiety readout should already say Body 体, and Phase 2 must not surface
  internal field names.

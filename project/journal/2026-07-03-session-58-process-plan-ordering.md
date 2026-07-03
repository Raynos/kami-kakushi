# Session 58 — 2026-07-03 — process-wave build order: master plan + F-rename

**Summary:** Ranked the ten process-wave plans into a build order (waves +
trample-safe lanes), wrote `docs/plans/fable-process-master-plan.md`, and —
per the human's call in-session — renamed the S/N series to build-order
ranks `fable-process-F1…F10` (the checkpoint + PRD-ripple plans share F1 as
one merged build lane). Rippled the two race clauses shut: the capture-inbox
plan (F3) owns the middleware transport (cockpit F7 / telemetry F8 import
it); the F1 checkpoint lane owns `gen-regions.ts` (ripple Ph2 imports it).

## What changed

- `docs/plans/fable-process-master-plan.md` — NEW: the order F1–F10 ranked
  by meta-leverage / game impact / trample risk, the lane structure (F1
  alone → F2 → lane A F3→F6→F7→F8 ∥ lane B F4 ∥ lane C F5 → F9; F10
  blocked on taste.md), the hot-file trampling map (`main.ts` ×5 plans,
  `dev.ts` ×3, marker loop ×6, GATES ×5), six merge verdicts, and the S/N →
  F rename map.
- `docs/plans/fable-process-{S,N}*.md` → `fable-process-F{1..10}-*.md` —
  11 `git mv` renames to build-order names (two files share F1: one build
  lane, two review surfaces).
- `docs/plans/fable-process-F7-balance-cockpit.md` — §6b + risk 6: the
  "whichever lands first ships the handler" branch replaced with "F3 owns
  the transport; this plan ships no handler".
- `docs/plans/fable-process-F1-prd-ripple-tooling.md` — §2 + risk 3: the
  "first-lander owns `gen-regions.ts`" race replaced with "built once in
  the F1 lane; this plan imports it".
- `docs/plans/fable-process-F1-mechanical-checkpoint.md` — Phase 1 now
  names the shared `src/scripts/gen-regions.ts` module explicitly.
- Cross-reference re-paths: `fable-process-F2/F6/F8` plan bodies,
  `src/scripts/prd-drift.ts` (header comment + report string),
  `docs/plans/README.md` (naming note → the F-rank scheme, F≠feedback-item
  disclaimer), `project/status/project-status.md` (2 lines),
  `project/todo-human.md` (queue re-pathed + reordered to F-order; master
  plan queued at the top of the process block).
- Journal/brainstorm history untouched — old S/N names stay as the record;
  the master plan's rename map is the resolver.

## Next intended steps

1. Human reads the master plan (queued) — ratify or reorder.
2. On sign-off, Wave 0 starts: the F1 lane (checkpoint Phases 1–5 + ripple
   Ph2–Ph4, ONE builder, nothing else in flight), then F2 Ph1–2.

## Landmines

- Two files share the F1 rank on purpose (merged build lane). Lexicographic
  sorting puts F10 between F1 and F2 — the master plan's table is the
  authoritative order, not `ls`.
- The wave's `F` rank collides with F-numbered feedback items (F1–F117) by
  accepted trade-off (human call); the plans README carries the
  disambiguation note.

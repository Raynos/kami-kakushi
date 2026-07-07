# Session 113 — 2026-07-07 — FB-8 telemetry distill (the pre-timed-actions baseline)

**Summary:** Answered the human's "why are there 82 telemetry reports when I
played ~20 times" (74 of 82 are tainted; ~57 are agent QA harness exhaust —
fixture loads each mint a run + a stub file; human reloads correctly do NOT
fragment), then ran the FB-8 diary-rule distillation: the corpus has near-zero
untainted signal (8 runs, ~14.4 min, zero rung-ups), one real 17.2-min
playthrough day (R0 rung-up at 6.2 attended min — in-band), and ALL of it
predates the ADR-148 timed-actions build, so it's a baseline only. Report:
`project/audit/reports/2026-07-07-telemetry-distill.md`.

## What changed

- `project/audit/reports/2026-07-07-telemetry-distill.md` — NEW: the
  committed distillation (corpus shape · untainted-signal audit · the one
  real datapoint · 5 conclusions incl. the QA-stub-drop suppression
  proposal and the save-import sticky-taint observation).
- `project/journal/2026-07-07-session-113-telemetry-distill.md` — this file.

## Next intended steps

1. Human call pending (surfaced in-session via AskUserQuestion): suppress
   report-FILE drops for harness-tainted runs (`fixture`/`qa-drive`/
   `forceState`) in `src/telemetry/` + optionally delete the 54 zero-minute
   stubs (git-ignored, disposable by contract).
2. The deferred ADR-148 economy rebalance wants FRESH attended-time data on
   the timed-actions build — this corpus is the "before" side only.

## Landmines

- `project/telemetry/*.md` filenames start `20260626-` — that's the fixed
  RNG SEED, not a date; the suffix is run-start epoch seconds.
- Taints are run-scoped and sticky: a `save-import` at boot excludes the
  whole run from vs-sim forever — the human's most real play is
  systematically tainted (distill report, conclusion 3) — worth a design
  pass before the reality leg ever gates anything.
- Sessions 109–112 exist alongside a session-99 file from today (numbering
  forked across parallel agents); 113 continues the higher fork.

# Session 134 — 2026-07-09 — storywave closure: rulings + execution begins

**Summary:** the human read the closure plan
(`docs/plans/fable-2026-07-09-storywave-closure.md`), ruled every surfaced
fork live via AskUserQuestion, and went AFK with this Fable session executing
the whole plan (C0→C5) end-to-end autonomously. C0 pre-flight landed: every
B-finding re-verified live against the tree (none pre-fixed; line refs hold),
both design forks recorded as ADRs, the plan annotated + flipped IN
EXECUTION.

## The rulings (verbatim record: `project/feedback-human/2026-07-09-storywave-closure-rulings.md`)

- **HD-31 → the REFUSING gate (ADR-166)** — reverses the plan's keep-as-built
  default: Autumn's exit refuses until that year's nengu is reckoned; the
  refused attempt triggers the nengu scene; completion reckons (kura draw +
  flag latches); annual re-arm; the latched `nengu-reckoned` still serves R7.
- **HD-32 → the FULL fiction wave now (ADR-167)** — units 1–5 incl.
  per-season node flavor at PER-SEASON diverge units (6 units × 3 takes).
- **Routing** — Fable executes the whole plan this session (overrides the
  plan's 80%-Opus table for this execution).
- **C3 gate scope** — WIDEN the prd-drift retired-terms scan to
  `fun-factor.md` / `ui-design.md` / `qa-playtesting.md` (allowance rows).
- Standing steers: adjacent misses the plan didn't catch are in scope
  (mechanical on sight; design-shaped → HD/HR-items); no blocking asks for
  the rest of the session — defaults + async-override items instead.

## What changed (C0)

- `docs/living/decisions.md` — ADR-166 (refusing gate) + ADR-167 (fiction
  wave in full).
- `project/human-in-the-loop/archive.md` — HD-31/HD-32 rows (ruled same-day,
  never sat open).
- `project/feedback-human/2026-07-09-storywave-closure-rulings.md` — NEW.
- `docs/plans/fable-2026-07-09-storywave-closure.md` — Status → IN EXECUTION;
  ruling annotations at C0.2/C0.3, C1.4's gate block, C3's scope check, C5a's
  options, the routing section.
- `project/status/project-status.md` — resume block points at this execution.
- This journal.

## C0 verification notes (PH2)

- B1: `O-Sato` ×4 in `src/ui/map-sheets/nodes.ts:122,133,491,508` — confirmed,
  and confirmed absent elsewhere in `src/`.
- B2: `night-rounds.ts` FALL still skips the bleed (comment still says
  "DORMANT"); `fight.ts:166-179` carries the bleed + the dead `lostRice` read
  (B5). B4: `autoplay.ts:405` reads `resources.rice`. B6/B7: reducer guards
  absent as reported; `season.test.ts` does not exist; `step.ts` auto-reckons
  the nengu in `advanceSeason` (the ADR-166 target). Combat-rework debt: 3
  `it.skip` + TODO(g4-tests) patches confirmed.
- ADR-166 implementation note discovered in pre-flight: `nengu-reckoned`
  latches ONCE but Autumn recurs — the refusing gate must key on a per-year
  seam (e.g. the seasonsPassed of the last reckoning), not the latched flag,
  which keeps serving R7 unchanged.

## Next intended steps

C1 (build fixes, one commit per step) → C2 (docs sweep) → C3 (gate hardening,
RED-proof vs pre-C2 tree) → C4 (wire the dark world) → C5a (fiction wave,
ADR-139) + C5b (balance re-baseline). Each phase checkpoints (commit →
journal append → snapshot → push).

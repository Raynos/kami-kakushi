# Plan-quality audit — all 78 plans, scored (2026-07-11)

**Status:** ✅ DONE (2026-07-11, w2:p5). 16-agent workflow (`wf_9c63e7bd-d4d`,
raw verbatim in `project/brainstorms/raw/2026-07-11-plan-quality-audit-*.json`,
git-ignored) scored every plan in `project/archive/` + `docs/plans/` — 78 docs —
on an 11-dimension 0–2 rubric at TODAY'S bar. Deliverables shipped with this
report: the three plan templates
([`docs/guides/plan-authoring.md`](../../../docs/guides/plan-authoring.md)),
the validator
([`src/scripts/verify-plan-template.ts`](../../../src/scripts/verify-plan-template.ts)),
and the pre-commit HARD gate on new plans (`.githooks/pre-commit`,
`SKIP_PLAN_TEMPLATE=1` escape).

## Headline

- Verdicts: **55 exemplary · 19 good · 4 adequate · 0 weak** — the corpus is
  strong overall, but graded on a curve the scorers admitted leaning generous
  on; the dimension averages are the honest signal.
- The systematic gaps (avg of 2.0): **routing 1.22** (27 plans have NO "Who
  builds this" — all pre-dating the 2026-07-03 convention), **sync 1.49**
  (6 plans fully silent on doc/PRD ripple; dozens more implicit), **risks
  1.53**, **scope/non-goals 1.62**, **verification 1.69** (20 plans at ≤1 —
  "run verify" instead of named RED-able checks).
- Strong everywhere: why 1.96, writing 1.95, grounding 1.87, steps 1.85.
  The house style writes *readable, grounded, sequenced* plans by habit; what
  it forgets is *routing, ripples, risks* — exactly what the templates now
  make mandatory.
- Era check: the 21 pre-convention plans (no model prefix, ≤2026-07-02)
  average **16.5/22**; the 57 prefixed ones **19.6/22**. The conventions
  wave (2026-07-03 →) measurably raised the floor.
- The 4 adequate (bottom): `2026-06-29-overnight-v03-completion`,
  `2026-06-29-tdd-skill-integration-proposal`,
  `2026-07-02-playtest-polish-build`, `2026-07-05-diverge-v1-branch-model`
  (the last is a misfiled reference doc, not a plan — as is
  `fable-2026-07-07-story-salvage`).
- Perfect 22s: `context-hardening`, `desktop-journey-e2e`,
  `requirements-rung-progression`, `storywave-docs`, `storywave-game`,
  `derived-reveal`, and process-F 1b/2/3/4 — the F-wave is the house
  gold standard.

## What the exemplary plans do (now canonized in the templates)

The scorers named 75 exemplar moves; the recurring ones became template
sections or guide guidance:

1. **"Context a fresh executor needs" ordered read list** (storywave pair,
   map-sheets-fixes, story-bible-finish) — a cold session executes without
   archaeology.
2. **Open questions each shipping a proposed default** (F-wave, the 07-02
   dialogue/layout plans) — PH4 in section form; now the mandatory
   Human-in-the-loop section.
3. **"What exists to reuse (cited)" with file:line + commits** (deep-housing,
   F3/F6/F7/F8) — now the mandatory What-exists-today section.
4. **Teeth tables with RED-ability proofs + rollback** (F1a §3, op-model v2)
   — now mandatory for `process` plans.
5. **Cutover worksheets for risky migrations** (requirements-rung Phase-3,
   storywave-game G4 worktree protocol) — guide-recommended.
6. **Explicit negative sync entries** ("Story-bible: none — because X",
   porter plan) — now the accepted escape everywhere: "none — <reason>".
7. **Failure-handling tables** (F9 §4: fails-at → state-left → recovery).

## The enforcement (what shipped)

- **Three template classes** — `build` / `process` / `ops` — declared by a
  `**Template:**` header line; full skeletons in
  [`plan-authoring.md`](../../../docs/guides/plan-authoring.md).
- **The gate** fires on brand-NEW `docs/plans/**/*.md` only (ADDED staged
  files): header triplet (Status token · Confidence · Template), every
  mandatory section present via alias-tolerant heading match AND
  non-trivially filled (≥15 words, or "none — <reason>"); the Sync ripple
  must cover PRD + story-bible explicitly (build). HTML comments and code
  fences can't satisfy a section, so committing an unfilled skeleton fails.
- **Warn-rung** (never blocks): no FB-/ADR-/HR-/HD- citation, missing model
  prefix, missing Rollback (process), missing routing (ops).
- 15 vitest cases prove each check can flip RED; the RED/GREEN proof ran
  live on fixture plans before wiring.

## Back-test — would the old plans have failed?

`pnpm exec tsx src/scripts/verify-plan-template.ts --backtest` runs every
archived + active plan against its BEST-FIT class, with the new
Template/Confidence formalities excluded — measuring pure substance.

- **All 79 fail at today's bar** (0 PASS) — nobody wrote to a bar that
  didn't exist. Failure counts: 2 fails ×8 plans · 3×15 · 4×14 · 5×19 ·
  6×14 · 7×7 · 8×2.
- **The gate discriminates the way the judged scores do**: exemplary plans
  average **4.2** missing checks, good **5.3**, adequate **6.8** (max 8).
  The weak plans fail on *substance* — steps too thin, no verification, no
  grounding, no Status line. The strong recent plans fail almost entirely
  on the **new cheap obligations**: an explicit `## Why` heading (their why
  lives in prose), `## Non-goals`, `## Risks`, and the consolidated Sync
  ripple — each satisfiable in 1–3 lines. So yes: the lazy plans would have
  been forced back for real rewrites, and the strong ones would have paid
  minutes, not hours.
- Top missing sections corpus-wide: Sync ripple (60), Why-as-heading (51),
  Risks (50), Verification (36), Non-goals (20), What-exists-today (19),
  Steps (18). (Go-conditions/Aftermath counts are inflated by best-fit
  choosing `ops` for borderline docs — classifier artifact, not signal.)
- Bonus catches: 12 archived plans carry NO Status line and 12 more carry
  tokens outside the closed vocabulary (`COMPLETE`, `PROPOSAL`, `SCOPE`,
  `IMPLEMENTED`…) — fine in the archive (checkpoint only parses
  `docs/plans/`), but evidence the closed vocabulary needed its gate.

## Follow-ups (not done here)

- The 2 misfiled reference docs (`2026-07-05-diverge-v1-branch-model`,
  `fable-2026-07-07-story-salvage`) could carry a "reference, not a plan"
  banner — cosmetic, archive-only.
- If the warn-rung citations prove ignored, promote the FB-/ADR- citation
  check to HARD after a few weeks of observation (the F4 §3 promotion
  pattern).
- `docs/plans/README.md` links the guide; AGENTS.md was deliberately NOT
  grown (budget-capped; the gate self-announces at commit time).

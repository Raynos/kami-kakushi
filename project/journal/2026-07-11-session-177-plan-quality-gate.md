# Session 177 — plan-quality audit + the plan-template gate (2026-07-11)

**Summary:** executed the human's "audit the plans + gate a plan-quality
template" TODO end-to-end: scored all 78 historical plans via a 16-agent
workflow, distilled three plan templates, built the `verify-plan-template`
pre-commit gate, and back-tested it against the corpus. New plans in
`docs/plans/` are now HARD-blocked unless they declare a template class and
carry its mandatory sections (incl. the PRD/story-bible Sync ripple).

---

- **Audit (workflow `wf_9c63e7bd-d4d`, 16 agents × ~5 plans):** 55 exemplary
  / 19 good / 4 adequate on an 11-dimension rubric at today's bar. Systematic
  gaps: routing (27 plans without "Who builds this"), sync-ripple (avg 1.49),
  risks, non-goals, named verification. Raw verbatim snapshotted to
  `project/brainstorms/raw/2026-07-11-plan-quality-audit-w3v4eai2v.json`
  (git-ignored); distillation:
  `project/audit/reports/2026-07-11-plan-quality-audit.md`.
- **Templates:** `docs/guides/plan-authoring.md` — three classes
  (`build`/`process`/`ops`), a common header triplet (Status token ·
  Confidence · Template), and per-class mandatory sections canonizing the
  corpus's 75 scored exemplar moves ("Context a fresh executor needs",
  defaults-on-every-open-question, teeth tables, "none — <reason>" sync
  entries).
- **Gate:** `src/scripts/verify-plan-template.ts` (+ 15 vitest cases, all
  RED-able; pure `validatePlan()` shared with the tests). Wired into
  `.githooks/pre-commit` on ADDED `docs/plans/**/*.md` only — the archive
  and existing active plans are grandfathered by construction. Escape:
  `SKIP_PLAN_TEMPLATE=1`. Anti-skeleton: HTML comments/code fences can't
  satisfy a section; ≥15-word floor per mandatory section.
- **Back-test (`--backtest`):** all 79 corpus docs FAIL at today's bar —
  judged-exemplary plans average 4.2 missing checks (almost all the new
  cheap obligations: explicit Why/Non-goals/Risks headings, the consolidated
  Sync ripple), judged-adequate average 6.8 (substance: thin steps, no
  verification, no grounding). The gate discriminates exactly the way the
  judged scores do. Bonus: found 24 archived plans with missing/out-of-vocab
  Status tokens (`COMPLETE`, `PROPOSAL`, `SCOPE`…).
- **Shared-tree friction (mea culpa):** my in-flight WIP REDed the tree
  three times (dead md-links to not-yet-written targets; tsgo strict-null +
  oxlint/oxfmt on the new script; a stale test field) while four agents were
  commit-gated behind it — each fixed within minutes of the ping, but the
  lesson stands: on a shared tree, write link targets BEFORE the doc that
  links them, and run tsgo/oxlint/oxfmt on a new src file in the same breath
  it's written.
- **Model routing:** the human steered mid-session — subagents/workflows on
  Opus while Fable usage is near its cap (memory saved:
  `route-workflows-to-opus-near-fable-cap`). The scoring workflow had
  already completed on inherited Fable before the steer landed.
- **Queue hygiene:** cleared the human's completed "Audit the plans" TODO
  (this session is its execution); queued the report + guide for reading.

**Next intended steps:** none owed on this thread — the gate is live. Watch
whether the warn-rung citation check gets ignored (promote to HARD if so,
per the F4 §3 pattern); consider "reference, not a plan" banners on the two
misfiled archive docs.

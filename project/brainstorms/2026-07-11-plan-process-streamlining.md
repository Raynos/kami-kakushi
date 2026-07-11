# Streamlining the planning process — proposals (2026-07-11)

**Status:** 📋 PROPOSED — follow-on to the plan-quality audit
(`project/audit/reports/2026-07-11-plan-quality-audit.md`). The gate ships;
these are the *ergonomics* around it, surfaced for the human's pick before
any build (process-shape changes lock direction first).

The gap the gate leaves: it fires at **commit time** — the latest possible
moment. Everything below moves the contract earlier in the authoring loop.

## A · `/write-plan` skill (recommended first)

A `.claude/skills/write-plan/` skill invoked when any session starts a plan:

1. Resolves the filename from live facts: `<model>-<date>-<slug>.md` (the
   model prefix convention, applied automatically instead of remembered).
2. Emits a compliant skeleton via a new `verify-plan-template.ts --scaffold
   <class>` flag — generated FROM the validator's `REQUIRED` table, so the
   skeleton and the gate can never drift (single source, AC-21).
3. Walks the author through the judgment the regex can't hold: cite the
   record (FB-/ADR-/HR-), verify grounding against `src/` THIS session
   (PH2), write real sync-ripple lines, Confidence + routing.
4. Runs the validator before presenting, and adds the reading-queue line in
   the same breath (the gate demands it anyway; the skill does it).

Cost: one SKILL.md + ~30 lines in the validator. No new maintained state.

## B · Write-time feedback hook (WARN-only)

A `PreToolUse` hook on Write/Edit targeting `docs/plans/**/*.md`: pipe the
proposed content through `validatePlan()` (new `--stdin <filename>` mode)
and WARN inline on missing sections — instant feedback while authoring,
no commit round-trip. Blocking stays at the commit rung; write-time stays
advisory so mid-draft saves aren't punished (AC-11 — a draft is SUPPOSED
to be incomplete).

Cost: one hook script + settings.json wiring + the `--stdin` mode.
Judgment call: only worth it if plans are usually built up across many
Write calls; if plans land in one Write, the commit gate already catches
it same-session and this adds noise.

## C · AGENTS.md conventions bullet (3 lines)

The gate is invisible until it fires. One always-loaded bullet under
Conventions: *"Plans follow the template contract — declare `**Template:**
build|process|ops`; mandatory sections incl. the Sync ripple are
commit-gated (`docs/guides/plan-authoring.md`, or `/write-plan`)."*
AGENTS.md sits at its warn line (420-cap pressure), so this displaces or
earns its ~3 lines; the repo-map guides line (done with this commit) may
be enough if A ships — a skill announces itself.

## Horizon (parked — not proposed for now)

- **Sync-ripple settlement check:** when `checkpoint` archives a DONE plan,
  warn if its Sync section names a PRD §/story-bible edit but no commit in
  the plan's lifetime touched those paths. Real teeth for "promised ripple
  actually happened" — but git-archaeology heuristics risk crying wolf;
  design it only if broken promises actually show up.
- **Confidence-line telemetry:** aggregate the `( X% Opus )` headers vs who
  actually built each plan, to calibrate the routing instinct.
- **Verification-section ↔ milestone-integrity linkage:** extend the
  ADR-054 gate to resolve tests *named in a plan's Verification section*
  once it flips DONE.
- **NOT proposed:** a template for brainstorms (their value is freedom —
  the plan gate is the funnel where structure pays), and no verify-gate
  version of the plan check (staged-awareness belongs to the hook rung).

# Plan authoring — the three templates + the template gate

How to write a `docs/plans/` plan that isn't lazy. Born from the 2026-07-11
plan-quality audit
([`project/audit/reports/2026-07-11-plan-quality-audit.md`](../../project/audit/reports/2026-07-11-plan-quality-audit.md)),
which scored all 78 plans ever written here and found the difference between
the plans that executed cleanly and the ones that stalled, drifted, or left
the PRD/story-bible behind was almost entirely **missing sections, not missing
talent**: no grounding in what the build actually is, no named verification,
no sync-ripple map, no routing call.

The enforcement lives in
[`src/scripts/verify-plan-template.ts`](../../src/scripts/verify-plan-template.ts),
invoked by `.githooks/pre-commit` on every **brand-new** `docs/plans/**/*.md`
(HARD block; `SKIP_PLAN_TEMPLATE=1` is the rare escape). Existing/archived
plans are grandfathered — the gate fires on ADDED files only, so archiving a
done plan never trips it.

## Pick a template class

Every plan declares its class in the header (`**Template:** build`), which
selects the mandatory-section set the gate checks:

- **`build`** — changes the *game*: a feature, system, UI surface, story
  content, balance mechanism. The full set: this is most plans.
- **`process`** — changes *how we work*: tooling, gates, CI, hooks, skills,
  scripts, doc machinery. Swaps the story/taste obligations for teeth +
  rollback.
- **`ops`** — a *one-shot operation*: a doc ripple, a reconcile pass, a
  history rewrite, a release, a rename sweep. Procedure-shaped, with go
  conditions and an aftermath.

A design diagnosis / option-map whose output is a **decision, not code**
(e.g. the koku re-diagnosis, the 10 estate-map directions) is a
**brainstorm**, not a plan — it belongs in `project/brainstorms/` and does
not pass through this gate. If it must live in `docs/plans/` (it sequences a
pick → build path), class it `build` and let its Steps be the pick + build.

## The common header (all classes)

```markdown
# <imperative title — what lands when this plan is done>

**Status:** 📋 PROPOSED (<date>, <session>)
**Confidence:** ( X% Opus, Y% Fable ) — one clause on where judgment sits
**Template:** build
```

- `Status` first token comes from the closed six-word vocabulary
  ([`docs/plans/README.md`](../plans/README.md)); `checkpoint` parses it.
- `Confidence` is the routing split (memory: doubt favors Fable); the "Who
  builds this" section below carries the reasoning.
- Filename: `<model>-<series>-<slug>.md` — the AUTHORING session's model.

## Template: `build`

Mandatory sections (heading names may vary within the gate's aliases, but
prefer these):

```markdown
## Why
<!-- The problem in the player's / project's terms. Cite the record: FB-nn,
     ADR-nnn, HR/HD items, human quotes with dates. A plan with no citation
     to WHY it exists is a solution looking for a problem (warn-rung). -->

## Who builds this — Fable or Opus?
<!-- Per-phase: where does judgment concentrate (taste, fiction, look) vs
     mechanical execution? Doubt favors Fable. -->

## What exists today
<!-- Verify, don't trust (PH2): the current build, SOURCE-VERIFIED — file
     paths, commit hashes, what's reusable, what the plan replaces. Write it
     from the code you read this session, not from memory or older docs. -->

## Steps
<!-- Sequenced, file-level, each independently committable + verify-green.
     Name the order's rationale when it matters (seams with in-flight plans,
     migrations before content, engine before UI). ≥3 real steps; a plan
     with one giant step is a wish, not a plan. -->

## Verification
<!-- Done is earned (PH3): the checks that could go RED, named — unit tests
     (which invariant), e2e, sim envelopes, golden pin / blind-pass for map
     work, headless captures for look-bearing work. "run verify" alone is
     not a verification plan. -->

## Sync ripple
<!-- The single most-skipped section in the audited corpus. What ELSE moves
     when src/ moves — each line either a concrete edit or an explicit
     "none — <reason>". The gate requires the PRD and story-bible lines. -->
- **PRD:** <§ + one-line edit, via /prd-ripple> · or: none — <reason>
- **Story-bible:** <section / tier sheet> · or: none — <reason>
- **Living docs / registries:** <roadmap, ui-design, gen:narrative,
  fixtures, t0-pacing (ADR-132 if balance moves)> · or: none — <reason>
- **CHANGELOG:** <if a version bump ships this> · or: none

## Human-in-the-loop
<!-- Bias to motion (PH4): HR/HD items this plan files or closes; open
     questions WITH proposed defaults (never blocking); taste-scorecard
     Pass 1/Pass 2 points for UI surfaces; diverge obligations (ADR-075 /
     ADR-139) named. -->

## Non-goals
<!-- What this plan deliberately does NOT do — parked, deferred, or
     rejected, each with a pointer if it lives on. -->

## Risks
<!-- Landmines, sequencing conflicts with other live plans / co-agents on
     this shared tree, migration hazards, and the rollback story where one
     exists. -->
```

## Template: `process`

Same header + `Why`, `Who builds this`, `What exists today`, `Steps`,
`Verification`, `Sync ripple`, `Non-goals`, `Risks` — with two additions and
one substitution:

```markdown
## Teeth
<!-- Which rung holds each new invariant (gate > hook > skill > norm), and
     the PROOF the gate can go RED (a false green is worse than no gate).
     Budget: what it adds to the ≤8s commit lane (ADR-176). -->

## Rollback
<!-- How this unwinds if it misfires: the flag, the revert seam, the escape
     hatch env var. A process change without an escape trains SKIP_VERIFY
     habits. -->
```

The `Sync ripple` for process plans targets the process docs instead:
AGENTS.md / repo-map.md (always-loaded budget!), `docs/guides/`,
`working-agreements.md`, skill SKILL.md files — PRD/story-bible lines may be
"none — process-only change".

## Template: `ops`

```markdown
## Goal            <!-- the one-shot outcome, in one screen -->
## Go conditions   <!-- blocking preconditions: coordination (other agents
                        parked?), human sign-offs already in hand, backups -->
## Procedure       <!-- the numbered runbook, exact commands where they are
                        load-bearing; recon step first (read-only) -->
## Verification    <!-- how you PROVE it worked before declaring done -->
## Sync ripple     <!-- docs/PRD/story-bible lines, same shape as build -->
## Aftermath       <!-- cleanup, comms to co-agents, what re-syncs, what
                        gets archived; risks/caveats fold in here or in a
                        Risks section -->
```

## What the gate actually checks (and what stays a norm)

The gate blocks only what it can check **soundly** (a gate must never cry
wolf — AC-11):

- HARD: header triplet (Status token in the closed vocabulary · Confidence
  line · Template line with a known class).
- HARD: every mandatory section for the class present (alias-tolerant
  heading match) and **non-trivial** (a body, not a bare heading; the
  explicit `none — <reason>` escape is always accepted where offered).
- HARD: the Sync ripple covers PRD + story-bible (build/ops) — even as an
  explicit "none — <reason>".
- WARN: no FB-/ADR-/HR-/HD- citation anywhere in Why; missing model-prefix
  filename; prose lines way past ~80 chars.
- NORM (ungated): whether the grounding is *true*, the steps *right-sized*,
  the tests *RED-able* — judgment a regex cannot hold. PH2/PH3 own these.

Full mandatory-section matrix + aliases: the `REQUIRED` table in
[`verify-plan-template.ts`](../../src/scripts/verify-plan-template.ts) is the
single source of truth; this guide describes it.

## Exemplars from the corpus (steal these moves)

- **Context a fresh executor needs (ordered read list)** —
  `fable-2026-07-07-storywave-game.md`, `fable-2026-07-09-storywave-closure.md`:
  a cold session can start executing without archaeology.
- **Per-risk proposed defaults, never blocking** — the `fable-process-F*`
  wave: every open question ships with the default the agent will take.
- **Critical files for implementation** — F1a/F4–F9: the touch-list that
  makes the diff reviewable before it exists.
- **Cutover worksheet** — `fable-2026-07-05-requirements-rung-progression.md`:
  the surveyed, atomic-commit touch list for a risky migration.
- **Sync honesty** — `docs/plans/fable-2026-07-11-map-porter-presence.md`:
  a real PRD ripple named, and a story-bible section that says *none* with
  the reason (the piece is the reader's marker, not fiction).

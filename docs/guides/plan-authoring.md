# Plan authoring — the three templates + the template gate

How to write a `docs/plans/` plan that isn't lazy. Born from the 2026-07-11
plan-quality audit
([`project/audit/reports/2026-07-11-plan-quality-audit.md`](../../project/audit/reports/2026-07-11-plan-quality-audit.md)),
which scored all 78 plans ever written here and found the difference between
the plans that executed cleanly and the ones that stalled, drifted, or left
the PRD/story-bible behind was almost entirely **missing sections, not missing
talent**: no grounding in what the build actually is, no named verification,
no sync-ripple map, no routing call.

**Start here:** run the [`write-plan` skill](../../.claude/skills/write-plan/SKILL.md)
(`/write-plan`), or copy the skeleton for your class from
[`docs/plans/templates/`](../plans/templates) —
[`build.md`](../plans/templates/build.md) ·
[`process.md`](../plans/templates/process.md) ·
[`ops.md`](../plans/templates/ops.md). The skeletons are **GENERATED** from
the validator's own tables (`--scaffold-write`), so they can never drift from
what the gate checks — a vitest case REDs on drift. Never hand-edit them.

The enforcement lives in
[`src/scripts/verify-plan-template.ts`](../../src/scripts/verify-plan-template.ts),
invoked by `.githooks/pre-commit` on every **brand-new** `docs/plans/**/*.md`
(HARD block; `SKIP_PLAN_TEMPLATE=1` is the rare escape). Existing/archived
plans and the `templates/` skeletons are exempt by construction — the gate
fires on ADDED files only, so archiving a done plan never trips it.

## Pick a template class

Every plan declares its class in the header (`**Template:** build`), which
selects the mandatory-section set the gate checks:

- **`build`** — changes the *game*: a feature, system, UI surface, story
  content, balance mechanism. The full set: this is most plans.
- **`process`** — changes *how we work*: tooling, gates, CI, hooks, skills,
  scripts, doc machinery. Swaps the story/taste obligations for Teeth +
  Rollback.
- **`ops`** — a *one-shot operation*: a doc ripple, a reconcile pass, a
  history rewrite, a release, a rename sweep. Procedure-shaped, with Go
  conditions and an Aftermath.

A design diagnosis / option-map whose output is a **decision, not code**
(e.g. the koku re-diagnosis, the 10 estate-map directions) is a
**brainstorm**, not a plan — it belongs in `project/brainstorms/` and does
not pass through this gate. If it must live in `docs/plans/` (it sequences a
pick → build path), class it `build` and let its Steps be the pick + build.

## The mandatory sections — why each earns its place

The skeletons carry per-section guidance inline; this is the rationale:

- **Header triplet** — `Status` (closed six-token vocabulary, parsed by
  `checkpoint`), `Confidence` (the routing split; doubt favors Fable),
  `Template` (selects the gate's checklist).
- **Why** — a plan with no citation to the record (FB-/ADR-/HR-/HD-) is a
  solution looking for a problem.
- **Who builds this** — where judgment concentrates, per phase (the audit
  found 27 plans silent on this).
- **What exists today** — PH2: source-verified THIS session, with paths,
  commits, and the **survey date** (grounding rots; an executor weeks later
  must know to re-check). Cited paths must exist on disk — the gate warns
  on any that don't (anti-hallucination).
- **Steps** — ≥3 sequenced, file-level, independently committable moves.
- **Verification** — PH3: checks that could go RED, named. Build plans also
  name the **player-reach proof** (PH6): a capture, e2e, fixture, or live
  drive — unit tests alone can green a feature no player can reach.
- **Sync ripple** — the most-skipped section in the audited corpus. PRD ·
  story-bible · living docs/registries · CHANGELOG, each line a concrete
  edit or an explicit `none — <reason>`.
- **Human-in-the-loop** — PH4: HR/HD items, open questions WITH proposed
  defaults, taste/diverge obligations named.
- **Non-goals / Risks** — what's deliberately out; landmines, migration
  hazards, and the **seam** — which files this plan owns vs what in-flight
  plans and co-agents on this shared tree touch.
- **Teeth / Rollback** (process) — the rung per invariant + the RED-ability
  proof; the escape hatch if it misfires.
- **Go conditions / Aftermath** (ops) — blocking preconditions before an
  irreversible pass; cleanup and comms after.

## What the gate actually checks (and what stays a norm)

The gate blocks only what it can check **soundly** (a gate must never cry
wolf — AC-11):

- HARD: the header triplet; every mandatory section present
  (alias-tolerant heading match) and **non-trivial** (≥15 words, or the
  `none — <reason>` escape); Sync covers PRD + story-bible (build/ops);
  guidance comments and code fences never count as content, so an unfilled
  skeleton fails loudly.
- WARN (never blocks): no record citation in Why; grounding cites paths
  that don't exist on disk; grounding carries no survey date; Status LOCKED
  with no human attribution; build-plan verification with no player-reach
  proof; missing model-prefix filename; missing Rollback (process) /
  routing (ops).
- NORM (ungated): whether the grounding is *true*, the steps *right-sized*,
  the tests *RED-able* — judgment a regex cannot hold. PH2/PH3 own these.

Single source of truth: the `REQUIRED` / `SECTION_HEADING` / `SECTION_GUIDE`
tables in
[`verify-plan-template.ts`](../../src/scripts/verify-plan-template.ts) drive
the gate, the `--scaffold` output, AND the committed template files; this
guide describes them.

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
- **Owns / composes-with header** — F3/F6: hard-delimits the plan's surface
  against named sibling plans (the shared-tree trampling antidote).
- **Sync honesty** — the porter plan (archived 2026-07-11): a real PRD
  ripple named, and a story-bible line that says *none* with the reason.

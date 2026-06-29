# Session 06 — 2026-06-29 — doc-hygiene pass + H-item decision pass (+ a lean pre-commit hook)

**Summary:** A human-driven session that (1) **compared** the two PRD-evolution planning docs and caught
both being born-stale on the now-existing ADRs; (2) **signed off** the v0.2 changelog; (3) ran a
**rename + reconcile + reading-queue restructure** pass; and (4) **walked the human-in-the-loop queue** and
resolved it — **H10 Operating Model v2 → DEFER the bundle** (build a lean ad-hoc pre-commit gate instead),
**H9 resolve-queue → DROP**, **H7 ship-gate → don't build**. Built + measured the pre-commit hook (~0.87s).
This file is HISTORY — the live snapshot is [`../status/project-status.md`](../status/project-status.md).

## 1 · Compared `path-to-v0.3` vs `pending-prd-changes`

A 3-agent compare Workflow (`wf_d2e8590f-d85`): the two docs are **not duplicates** — complementary at
different altitudes (the plan is the *sequencing conductor*; the tracker is the *per-file edit checklist*,
which the plan consumes). Caught a **born-stale** issue: both docs predated the D-056–D-069 ADRs they call
for. Raw snapshot + distillation: [`../brainstorms/2026-06-29-impl-plan-vs-prd-reshape-compare.md`](../brainstorms/2026-06-29-impl-plan-vs-prd-reshape-compare.md)
(committed `767e7f3`).

## 2 · v0.2 changelog signed off

Walked [`../audit/reports/v0.2-changelog.md`](../audit/reports/v0.2-changelog.md): no hidden decisions —
its open-feeling items were already resolved by the 06-29 session; the residue is **R1 playtest tuning**.
Dropped it from the reading queue (`2d359a0`).

## 3 · Rename + reconcile + reading-queue restructure

- **Renamed** `docs/plans/2026-06-29-implementation-plan.md` → **`2026-06-29-path-to-v0.3.md`** (the human's
  pick; the doc's spirit = "from locked decisions to the next build"). Reframed its title/intro.
- **Reconciled** the born-stale ADR refs in both `path-to-v0.3` and `pending-prd-changes` (Workstream A
  marked done; added the `DS#N → D-0NN` crosswalk to the tracker's Table B + Already-done + precedence note).
- **Sharpened the boundary:** the plan's Workstream B now *points to* the tracker as the single source of
  truth for the edit list (no duplicated code-target list → no drift).
- **Restructured** [`../docs-to-read-for-human.md`](../docs-to-read-for-human.md) around the dependency tree
  (① conductor → ② pieces [②a game-canon / ②b ⭐H10] → ③ foundation).
- The bulk landed via the other agent's `f54f0be` (a `feedback/`→`human-feedback/` rename + date-prefixing
  that swept up my edits with a `git add -A`); rename finalized in `cb46d9b`.

## 4 · H-item decision pass + the lean pre-commit hook

Walked `project/human-in-the-loop/` via `AskUserQuestion`. The queue collapsed to one real decision (H10,
absorbing H7+H9). Decisions (verbatim capture:
[`../human-feedback/2026-06-29-h-item-decisions.md`](../human-feedback/2026-06-29-h-item-decisions.md)):

- **H10 → DEFER** the v2-lite operating-model bundle. Not a freeze; greenlit one piece ad-hoc (the hook).
- **D-a → a content-aware, FAST (<5s) pre-commit subset** (not full `verify`): staged `.ts`→`tsc`, staged
  `.ts/.md`→`prettier`, keep the journal gate, + a pure-core boot smoke. **No test suite.**
- **D-d → a tiny boot smoke** in the hook (not the full `playcheck` ratchet).
- **H9 → DROP** (resolve queues by hand). **H7 → don't build** (D-054 owns the policy).

Built it: [`.githooks/pre-commit`](../../.githooks/pre-commit) (content-aware; journal gate unchanged) +
[`src/scripts/smoke.ts`](../../src/scripts/smoke.ts) (boots `createInitialState`→`reduce`). **Measured
~0.87s** on a TS+core commit (tsc 0.58s + prettier ~0.06s + smoke 0.16s). Bypass: `SKIP_VERIFY=1` /
`SKIP_JOURNAL=1`.

## What changed

- `docs/plans/2026-06-29-path-to-v0.3.md` — renamed from `…-implementation-plan.md`; reframed + reconciled +
  boundary-sharpened.
- `project/status/pending-prd-changes.md` — reconciled stale ADR refs; added the `DS#→D-0NN` crosswalk.
- `project/docs-to-read-for-human.md` — restructured around the dependency tree.
- `project/human-in-the-loop/decisions.md` — **H7 ✅, H9 ✅, H10 ✅ (DEFERRED)**; H10 no longer ⛔ blocks.
- `project/human-feedback/2026-06-29-h-item-decisions.md` — NEW; the verbatim decision capture.
- `.githooks/pre-commit` — NEW content-aware fast gate (journal policy unchanged).
- `src/scripts/smoke.ts` — NEW pure-core boot smoke.
- `project/brainstorms/2026-06-29-impl-plan-vs-prd-reshape-compare.md` (+ `raw/…`) — the compare workflow.
- `project/journal/2026-06-29-session-04-decision-session.md` — link fixes (rename refs).

## Next intended steps

1. **R1** — the human plays the M0–M2 demo (`npm run dev`) for the fun/pacing/look call (still open).
2. **Finalize the roadmap** — `docs/living/roadmap.md` from the re-axe proposal (next ungated step in
   `path-to-v0.3`).
3. **Then** the batched PRD/doc/code ripple (gated on the human's extra PRD feedback) → the spine-first
   carry-forward build.

## Landmines

- **H10 is DEFERRED, not killed.** The fuller v2-lite (playcheck ratchet, ship-gate) is revisitable if the
  hand-holding cost resurfaces. The pre-commit hook is the *only* op-model piece adopted.
- **The new hook runs on every commit.** It's fast (<1s) but doc-only commits now also get `prettier --check`
  on staged `.md`; if a new `.md` isn't prettier-clean the commit blocks (fix: `npm run format`, or
  `SKIP_VERIFY=1`).
- **Other agent's date-prefix rename is mid-flight.** The session-04 journal points at a date-prefixed
  `…-operating-model-v2-lite-reelback.md` that does **not** exist on disk yet (current name has no prefix) —
  their rename to finish, not mine.
- **ADRs D-056–D-069 exist; the PRD ripple still does NOT.** The PRD body is still stale on tiers.

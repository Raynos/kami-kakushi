# Session 08 — 2026-06-29 — decision hygiene: H-item → ADR graduation, archive split, tracker rename, hook

**Summary:** Human-directed process hygiene on the decision pipeline. (1) Paid down the H-item → ADR
graduation debt — the four process H-items (H7/H8/H9/H10) lacked ADRs; added **D-070** (op-model v2
deferred; absorbs H7+H9) and **D-071** (the lean pre-commit gate), and fixed a stale "not ADR'd" header
note. (2) Established the **graduate-then-archive** lifecycle: closed H-items now live in a new lean
crosswalk `project/human-in-the-loop/archive.md`; `decisions.md` is open-items-only (what the
session-brief scrapes). (3) Settled where the PRD-ripple tracker lives (`project/status/`, not
`docs/plans/` — it's post-canon operational state, not a pre-canon proposal) and **renamed** it
`pending-prd-reshape.md` → `pending-prd-changes.md`. (4) Taught the session-brief hook a new **pending
PRD changes** section. No design intent changed — pure record-keeping structure.

## What changed

**ADRs (`docs/living/decisions.md`):**
- Added **D-070** — Operating Model v2 deferred as a bundle; process improvements adopted ad hoc. Closes
  H7 (ship-gate skill → don't build), H9 (resolve-queue skill → drop), H10 (defer). `diverge` gate +
  `playcheck` ratchet remain HELD.
- Added **D-071** — the lean content-aware (<5s) pre-commit gate (the one greenlit v2-lite piece; built
  in `64ad701`). Documents the D-a/D-d spec + `.githooks/pre-commit` + `src/scripts/smoke.ts`.
- Fixed the stale `D-056…D-069` section header note (it claimed the pre-commit hook was "deliberately NOT
  ADR'd, pending the op-model review" — that review happened; now points at D-070/D-071).

**Archive split (`project/human-in-the-loop/`):**
- New `archive.md` — a lean one-line crosswalk of closed H-items (H1–H10 → ADR + date + intent link). An
  index, not the record (the ADR is the "why", `human-feedback/` is the verbatim intent).
- `decisions.md` reduced to **open-items-only** (currently none) + the graduate/archive lifecycle + pointers.
- `README.md` — documented the decision lifecycle (graduate → archive), the 4 durable homes table, and the
  mechanical-items-skip-the-ADR rule.

**Tracker rename + home clarification:**
- `git mv project/status/pending-prd-reshape.md → pending-prd-changes.md` (generic durable name, not tied to
  the one reshape event). All ~12 references updated repo-wide (perl in-place); zero stale refs remain.
- `project/status/README.md` — rewrote (it was mislabeled `# memory/`); added the **live-tracker-belongs-here**
  taxonomy note and indexed `pending-prd-changes`.
- `CLAUDE.md` — status-dir layout line now states live trackers live in `project/status/` (not `docs/plans/`)
  and points at `pending-prd-changes`; human-in-the-loop line documents the archive + lifecycle.

**Session-brief hook (`src/scripts/session-brief.sh`):**
- New **📥 Pending PRD changes** section — counts unticked `- [ ]` in `pending-prd-changes.md` and warns
  `prd.md` is stale on those points until applied. Verified: surfaces "37 decided change(s) not yet rippled".

## Why
- Hygiene ask from the human: every resolved H-item should have an ADR (or a deliberate no-ADR record), and
  resolved items should be archived out of the live queue so the brief stays lean.
- The graduation rule recorded: ADR a decision future-us needs the *rationale* for; a purely mechanical item
  (H8, the PRD file-split) gets an archive row, not an ADR — keeps the ADR log meaningful.

## Next intended steps
- The big downstream work is unchanged: apply the `pending-prd-changes` ripple (split `prd.md` into
  `prd/§1…§7`, then ripple D-048…D-069 into PRD/docs/code), then build (carry-forward + retune T0, spine-first).
- **R1** (the M0–M2 play/taste call) still open — needs the human at the controls.

## Landmines
- `pending-prd-changes.md` now appears in **two** session-brief sections (the reading queue *and* the new
  pending-PRD section) — intentional for now (it's both awaiting sign-off and tracking unapplied work); revisit
  if it reads as noise.
- The orphaned **session-07** journal (reel-back date-prefix + tdd archive; its work landed in `64ad701` but the
  journal was never committed) is committed alongside this session-08 entry to preserve the history.

# Session 10 — 2026-06-29 — Roadmap re-axe: review + detail T1/T2 + add a Ship section

**Summary:** Reviewed the roadmap re-axe proposal with a 6-lens grounded workflow, then — on human steer —
**detailed T1 (Estate-full) and T2 (Village)** into full Tier→Milestones→Fun-slices (they were coarse prose),
**added a new top-level "Ship" section** (restoring the old M6 quality gate + M7 release the re-axe had
dropped), and reconciled the proposal against decisions/ADRs that had gone stale. The proposal stays
**PROPOSAL / pre-canon** — awaiting the human's read + approval to promote to `docs/living/roadmap.md`. This
file is HISTORY; the live snapshot is `project/status/project-status.md`.

## What changed
- `docs/plans/2026-06-29-roadmap-reaxe-proposal.md` — the major revision:
  - **Reframed** Tier→Milestones→Fun-slices to **Section→Milestones→Fun-slices** (sections = T0–T3 **+ Ship**);
    **T0/T1/T2 DETAILED · T3 COARSE · Ship DETAILED**.
  - **Detailed T1** (4 milestones / 16 fun-slices) and **T2** (4 / 17), via a `detail-t1-t2` design workflow
    (2 parallel designers + a convergence critic; cross-tier bugs caught + fixed — silhouette off-by-one vs
    D-048, double-booked retinue, Phase-2 sequencing, T2 rung map).
  - **New Ship section** (Ship-M1 quality gate: whole-v1 balance / fun-proxy→gate / perf / a11y · Ship-M2:
    save-durability incl. the §6.8 iframe test + the human-approved itch upload, D-017).
  - **Staleness banner** + review fixes: added the missing **D-053** (wall-time clock) + **D-054**
    (milestone-integrity) spine contracts; fixed **D-014 → D-013a** (tier-stored) ×3; retired the DEMO/REAL
    pacing-profile fork (D-056); mentor = the **domain-split canon cast** (Genemon/Kihei/Sōan).
  - **Human decision round** baked in: NQ-1 = full ceremony in T0-M3-F3; NQ-2 = domain-split cast; NQ-3 =
    minimal map grown per tier; **Staff weapon line pulled forward into T2** (T3 → combat depth); cross-pillar
    combos = partial Office-pairs at T2; **milestone count = content-driven, no fixed cut**.
  - **Op-model reconcile** (see landmine): process-gates bullet now defers to the **op-model v2 FINAL** as
    source of truth (pre-commit full-verify + `playcheck` ratchet + `diverge` skill — all BUILT); legend adds
    `playcheck` as a forward DoD contract.
- `project/brainstorms/2026-06-29-t1-t2-content-digest.md` — NEW: the T1/T2 content digest (seed for detailing).
- `project/audit/reports/2026-06-29-roadmap-reaxe-review.md` — NEW: the distilled 6-lens review report.
- `project/brainstorms/raw/2026-06-29-roadmap-reaxe-review.json` + `…-detail-t1-t2.json` — NEW: verbatim
  workflow-output snapshots (durable insurance).
  *(These four were created this session but were swept into the parallel agent's commit `3b29d12` — see
  landmine; they're already committed.)*

## Next intended steps
1. **Human reads** the detailed T1/T2 + the Ship section, and the **5 remaining provisional forks** (hour
   floors · E-stage→tier mapping · T1 rung titles · rival T2/T3 split · deed-band magnitudes — all default-applied).
2. On approval: **promote the proposal → `docs/living/roadmap.md`**, retire the M0–M7 tracker, update the
   H-item / reading queues + `project-status.md`.
3. (Separate workstream) the reshape **PRD ripple** (`pending-prd-changes.md`) — unblocked but not this session.

## Landmines
- **CONCURRENCY:** a parallel agent implemented **op-model v2 FINAL** *during* this session (commits `a997690`,
  `3b29d12`, `5cc64fc`, `d9a7afa`, `abe0861`) — full-verify drift-aware pre-commit, the `playcheck` ratchet,
  and the `diverge` skill, all **built**. It also swept my untracked brainstorms/audit files into `3b29d12`.
  The proposal was reconciled to reference that work; the op-model plan explicitly owns the gates and **must not
  edit the roadmap** (clean division — F-4 in its plan).
- **ADR numbers in flux:** the op-model v2 FINAL plan **reuses D-070/D-071 numbers** (collision with the existing
  ADRs in `decisions.md`); they'll be renumbered when applied. The proposal therefore defers to the FINAL *plan*,
  not to specific D-0NN, for process gates.
- The pre-commit hook now runs the **full `verify`** (~3s, drift-bounded). This commit is **docs-only** →
  committed with `SKIP_VERIFY=1` (the sanctioned docs path); the journal gate still applies.
- The proposal is **pre-canon**; `docs/living/roadmap.md` is still the old M0–M7 tracker until the human approves
  the promotion.

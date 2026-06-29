# ADR staleness audit — docs/living/decisions.md (2026-06-29)

**Method.** A 5-batch fan-out workflow over the 74 ADRs, each batch judged against the known ground-shifts
(the 6-tier reshape D-048…D-055, the 2026-06-29 session D-056…D-069, the v2-FINAL reversal D-072…D-074, the
PRD split), then a convergence critic that **re-verified every claim against the actual ADR bodies** and built
the supersession map. Raw verbatim: [`project/brainstorms/raw/2026-06-29-adr-staleness-audit.json`](../../brainstorms/raw/2026-06-29-adr-staleness-audit.json).
**Conservative bar:** a wrong "superseded" is worse than a missed one.

## Applied — 10 supersession annotations (heading was ✅ + clean; now `🔁 Amended` / `⛔ Superseded`)

| ADR | Amended/superseded by | Stale clause (note added) |
|---|---|---|
| **batch hdr (D-056…D-069)** | ⛔ D-072–D-074 | "op-model v2 deferred / `diverge`+`playcheck` HELD" — the one place still contradicting the adopted v2 |
| **D-007** | D-048 | "five tiers / T0–T4" enumeration + tier→number map |
| **D-008** | D-048 (+D-028/D-049) | per-tier required-pillar weighting → one pillar per tier |
| **D-012** | D-048 + D-032 | "v1 = Tiers 0–2" → T0→T3; "~4 quest types" → no fixed quest budget |
| **D-013** | D-030/D-044/D-067; D-018/D-041 | "single autosave"; "no asset pipeline" |
| **D-016** | D-050; D-028 | "drop to 1 HP" → HP-carry/heal; "simple thresholds" → grade-gate (signed shape preserved) |
| **D-017** | D-048 | "v1 = full T0–T2" → T0→T3 |
| **D-018** | D-041 | "NO asset pipeline" (D-041 is the explicit corrector, no back-pointer) |
| **D-028** | D-048/D-049 | "good-in-all / T0 2-pillar special" → one pillar per tier; gate itself survives |
| **D-043** (group hdr) | D-048/D-049/D-051 | tier/pillar vocab (Name reveals at T3, per-N-pillars); signed locks hold |

## Applied — 5 tier-renumber notes (decision holds; only the tier *number* was dated)

**D-009** Region T2→T3 · **D-010** Edo T4→**T5** (factual fix) · **D-014** antagonist list re-map to 6 tiers ·
**D-026** weapon cadence keyed to old 3-tier · **D-040** "spent T2"→T3.

## NOT applied (deliberately)

- **Negligible "leave" (decision fully current, wording barely dated):** D-019, D-023, D-030, D-031, D-035,
  D-047. Adding notes here would be noise.
- **Low-confidence:** D-036 — the auditor's "no Origin pillar" reasoning was a **misread** (Origin is a
  *faction*, D-009, never a pillar); the only residual is a possible rung-ID (O5/G6) re-map — left as-is.
- **Already annotated, no action:** D-004, D-020, D-021, D-033, D-046, D-047, D-070, D-071.
- **Rejected false positives:** the `prd.md §X` deep-links in D-048…D-068 Consequences are **PRD-split
  link-repointing**, not decision staleness — batch-repoint to `prd/0X-*.md` when the PRD content ripple lands
  (tracked in `project/status/pending-prd-changes.md`), not here.

## Net
The decision log is now **internally consistent** with the post-reshape, post-v2 reality: every superseded
decision points forward, nothing was deleted (annotate-don't-delete), and `created_date` + the `🔁/⛔` markers
make the precedence legible at a glance.

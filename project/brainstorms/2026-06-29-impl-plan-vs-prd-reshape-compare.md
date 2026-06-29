---
name: impl-plan-vs-prd-reshape-compare
description: Comparison of docs/plans/2026-06-29-path-to-v0.3.md (formerly 2026-06-29-implementation-plan.md) vs project/status/pending-prd-reshape.md — relationship, overlap, and a born-stale catch
metadata:
  type: project
---

# `implementation-plan` vs `pending-prd-reshape` — how they relate

> **What this is:** the distilled verdict of a 3-agent compare Workflow (run 2026-06-29,
> `wf_d2e8590f-d85`). Verbatim raw output:
> [`raw/2026-06-29-impl-plan-vs-prd-reshape-compare-wwm8jq0cs.json`](raw/2026-06-29-impl-plan-vs-prd-reshape-compare-wwm8jq0cs.json).
> **Question:** the human asked whether these two docs are the same / overlapping — both *looked like*
> "plans for evolving the PRD with the recently-made decisions."

## Verdict — NOT duplicates; complementary at different altitudes

They share the **same decision set** (the 2026-06-28 reshape **D-048–D-055** + the 2026-06-29 session
**DS#1–DS#23**) and both treat the **stale 5-tier PRD** as the thing to fix — so the "they overlap"
instinct is understandable. But they answer **different questions**, and the plan **consumes** the tracker:

| | [`pending-prd-reshape.md`](../status/pending-prd-reshape.md) | [`2026-06-29-path-to-v0.3.md`](../../docs/plans/2026-06-29-path-to-v0.3.md) *(was `…-implementation-plan.md`)* |
|---|---|---|
| **Altitude** | Tactical — *what edit, where* | Strategic — *in what order, gated on whom* |
| **Form** | Per-file **checklist**: 14 PRD-section edits + 8 living-doc edits + 13 code edits, with checkboxes | **Sequencing memo**: 6 workstreams (A–F), 3 execution options, a gates map |
| **PRD scope** | The PRD ripple **is the whole doc** | The PRD ripple is **only Workstream B** of six |
| **Home / lifespan** | `project/status/` — live, self-clearing ("delete once empty") | `docs/plans/` — pre-canon, "supersedes nothing until executed"; disposable |

The plan **defers to the tracker** — Workstream B cites `pending-prd-reshape` as its source, and §5's ripple
mechanism credits it. **The plan is the conductor; the tracker is one section of the score.** Merging them
would re-create the monolith the PRD-split (DS#6/H8) is trying to undo.

**On the human's hypothesis ("both are PRD-evolution plans"):** *partly* right. True they share the decision
set. But the impl-plan's real job is **sequencing the whole backlog** (ADRs, roadmap, op-model, the *build*,
housekeeping) — PRD-reshape is just one of its six workstreams.

## ⚠️ The catch worth acting on — both are **born-stale** on the same point

- The impl-plan's **#1 recommended next step** ("write the ~15 ADRs D-056+") was **already done in the very
  same commit that introduced the plan** (`3f24fe6`). `decisions.md` now holds **D-056–D-069**.
- The tracker is stale the same way: still lists "write ADRs for DS#1–DS#23" as **unticked**; its "Already
  done" only credits D-048–D-055. Both docs still say the DS items "live only in the feedback ledger" — but
  they're **canon ADRs now**.
- **Three coexisting reference schemes** for the same decisions: `#N` (ledger) · `DS#N` (tracker) · `D-0NN`
  (the real ADRs) — drift risk as they age.

This matters because both docs are in the human's **H10 review** queue — read as-is, you hit a "next step"
that's already finished and a notation mismatch.

## Recommendation (agreed)

1. **Keep separate, sharpen the boundary** — do **not** merge (different altitudes; merging destroys info).
2. **Reconcile the staleness** *(safe, pure fact-fixing)*: tick the "write ADRs" line + add a `DS#N → D-0NN`
   crosswalk in the tracker; mark Workstream A / next-step-#1 **DONE** in the plan.
3. **Single-source the edit list**: the plan's Workstream B should *point to* the tracker, not re-list the
   code targets (kills future drift).
4. **Archive the impl-plan later** — once its ungated workstreams (A done, C, F) execute, it's a spent
   one-shot memo → `project/archive/`; the tracker stays live until emptied & deleted per its own rule.

**Status:** analysis only — no edits applied to either doc yet. Step 2 offered to the human; held pending
their go-ahead (they're about to review both for H10).

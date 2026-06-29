# Session 03 — 2026-06-28 — the two-tier-Estate reshape (decisions → ADRs)

**Summary:** Reviewed/audited the v0.1 state-of-the-game report with the human, ran several
`AskUserQuestion` decision batches, and **reshaped the tier spine**: split the Estate into **T0 (tutorial)
+ T1 (full)** → **6 tiers**, one pillar unlocking per tier (1→2→3→4→4, **Estate→Arms→Office→Name**), v1 =
T0→T3. Plus 7 supporting decisions (manual opt-in graded ascension, carry-HP/heal-by-eating combat,
compounding koku sink, showcase-in-miniature tutorial, wall-time "leave it running", milestone-integrity
rule, pillar silhouettes + per-tier mystery beats). Locked as **ADRs D-048…D-055**; **not yet applied to
the PRD** (tracked). Also did a housekeeping `project/audit/` reorg (reports/ + screens/) earlier in the day.

## What changed
- `project/audit/` — reorganized into `reports/` (md battery audits + changelog) + `screens/<pass>/` (png);
  `qa-shots.mjs` repointed to `screens/latest/`; all live-doc refs updated. *(committed `4c37bf7`)*
- `project/feedback/prd_human_feedback.md` → `…/2026-06-26-prd-human-feedback.md` (date-prefix). *(`c50cfb3`)*
- `project/feedback/2026-06-28-tier-reshape.md` — **NEW**: verbatim human directive + all 13 resolved forks (the intent record).
- `docs/living/decisions.md` — **NEW ADRs D-048…D-055** (batch header marks them ⏳ PRD-application-pending);
  they REFINE D-028 (gate), D-029 (floor→T1), D-033 (estate stages yield-bearing), pair with D-035 (satiety).
- `project/status/pending-prd-reshape.md` — **NEW**: the "ADRs locked but not applied to PRD" ripple tracker
  (per-file checklist for prd.md / living docs / code).

## Next intended steps
1. **Ripple the reshape into the PRD + living docs + code** — the `pending-prd-reshape.md` checklist; ideal as
   a single `battery`/Workflow doc-sweep, then regenerate `docs/content/` + `npm run verify`.
2. Then **build the milestone**: T0 (tutorial) showcase-in-miniature content + the **T0→T1 one-pillar ascension**
   (Estate pillar, manual opt-in graded story event) — the first real macro-spine transition.
3. Update `roadmap.md` with the new milestone + the milestone-integrity DoD rule.

## Landmines
- **The PRD is STALE on the tier model** until the ripple lands — `prd.md` still says 5 tiers (T0–T4). Read it
  with `pending-prd-reshape.md` open; the ADR batch + the feedback capture GOVERN (D-022). Don't trust the PRD
  body on tiers/pillars/pacing/gate until the checklist is cleared.
- The QA `state()` snapshot still says `tier: 0..4` / `outcome …t2done`; new canon is `0..5` / `t3done`.
- ADRs D-048…D-055 are `✅` (decided/locked) but their **Consequences explicitly flag PRD-application PENDING**
  — `✅` here means "decision made", not "docs updated".

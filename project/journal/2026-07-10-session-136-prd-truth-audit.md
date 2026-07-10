# Session 136 — 2026-07-10 — HD-33 ruled: the PRD unfreezes; truth-audit + sync plan

## ☀️ SUMMARY (read this first)

The human ruled HD-33 at session open: **there is no PRD freeze** ("we
can't freeze it") — the queued §1 vision-freeze (ADR-021 → ADR-059's
end-of-v1 door) is **cancelled**, and the PRD gets fixed wholesale to
match the current story-bible + shipped src (option a), with
**generation preferred** (new gen-regions / strike-and-point at the
generated `docs/content/` docs, "a segment at a time in the PRD
files"). Recorded as **ADR-168**; verbatim intent in
`project/feedback-human/2026-07-10-hd33-prd-unfreeze.md`. This file is
HISTORY; live state is `project/status/project-status.md`.

Session deliverables: (1) the HD-33 closure batch (ADR-168 +
annotations on ADR-021/ADR-059 + AGENTS.md freeze bullet rewritten +
HD-33 archived); (2) a 7-section **PRD truth-audit** (workflow: one
auditor per PRD section vs bible/src/generated docs, per-section
adversarial verify, plus a gen-region opportunity scout) → report in
`project/audit/reports/`; (3) a **truth-sync plan** in `docs/plans/`.

---

## 1 · HD-33 closure (this commit)

- **ADR-168** appended to `docs/living/decisions.md`: the PRD is never
  frozen; it tracks the shipped game. Locked intent binds as *intent*
  (ADR-022 newest-steer), not as a text-freeze. `/prd-ripple`'s "frozen
  §1 → stop" class relaxes to "intent change → stop" (text-sync to
  shipped canon is agent-safe).
- ADR-021 + ADR-059 annotated (freeze door removed, not moved).
- AGENTS.md "Freeze = locked intent" bullet → "The PRD is never frozen".
- HD-33 → archive row (→ ADR-168); live `decisions.md` now holds only
  HD-34.
- `prd:drift` ran CLEAN before the audit — proof the presence-checker
  can't see the semantic staleness HD-33 named; hence the workflow
  audit.

## 2 · PRD truth-audit (workflow `prd-truth-audit`)

Workflow `prd-truth-audit` (15 agents — 7 section auditors + 7
per-section adversarial verifiers + 1 gen-region scout, all Fable;
~1.38M tokens, 0 errors). **59 findings confirmed (18 high · 30
medium · 11 low), 1 refuted and dropped.** Raw output snapshotted to
`project/brainstorms/raw/2026-07-10-prd-truth-audit.json`
(git-ignored); the distilled report is
`project/audit/reports/2026-07-10-prd-truth-audit.md`.

By section: §1 vision 8 (5 high — the §1.5 T0 rung table, the T2
V-ladder with never-existed cast, the area registry, the reputation
web vs the bible's one five-stage standing, the §1.12 reveal ladder);
§2 systems 9 (defeat bleed says rice bleeds — it's kura-only); §3
unlock ladder 9 (pre-ADR-137 meter/threshold rows, the pre-reboot
cold-open script); §4 combat/balance 11 (the §4.8 pacing twin + 6
stale mechanism spots beyond the known tables); §5 narrative 1 (the
one healthy section — post-reboot pointer style works); §6 tech 13
(the 6-command verify fossil vs 17 gates, stale scripts/save/DEV
claims); §7 roadmap 8 ("no hosted CI, no deploy automation" — both
exist).

Scout: 8 ranked gen-region opportunities (t0-discoveries first —
drift already live: PRD says 1 discovery, build ships 4).

## 3 · The truth-sync plan

`docs/plans/fable-2026-07-10-prd-truth-sync.md` (queued for the
human, with the report): Phase G — 8 new gen-regions + 3
strike-and-points (G1–G11); Phase T1 — the five §1 canon
transcriptions; Phase T2 — the remaining sections top-down; Phase P —
regression teeth (the audit's corpse-names into `prd-drift.ts`
RETIRED TERMS) + `/prd-ripple` freeze-language relax + closure.
Identity-in/tuning-out binds every region; ~20 commits estimated.

## 4 · Plan forks locked (human, via AskUserQuestion)

Four forks put to the human: **(1) T2 reputation — KEEP THE WEB**
(§1.5.2 stands; the bible's single five-stage track is superseded in
part → **ADR-169**, t2.md annotated, T1.4 dropped, reconciliation owed
by the T2 plan); **(2) Phase G scope — all 8 regions**; **(3) routing —
Fable executes everything in-session**; **(4) order — generation
first**. Plan Status → EXECUTING.

## Next intended steps

1. Phase G: G1–G8 gen-regions + G9–G11 strike-and-points, one commit
   each, verify-green.
2. Then T1 (§1 canon transcriptions, T1.4 dropped), T2 (remaining
   sections), P (prd-drift teeth + /prd-ripple relax + closure).

## 5 · Phase G built — the generation half lands

`gen-prd-regions.ts` grew from 4 regions to **12**: G1 `t0-discoveries`
(§2.6.1g) · G2 `t0-zone-reveals` (§3.3, replaces the 12-row hand table
with its pre-reboot fictions) · G3 `t0-rung-reveals` (§1.12, replaces
the hand ladder whose R3/R4 rows were wrong) · G4 `t0-quest-roster`
(§2.12) · G5 `t0-activities` (§2.6) · G6 `t0-market-stock` (§2.4) ·
G7 `t0-estate-works` (§2.17c) · G8 `verify-gates` (§6.1, replaces the
fossil 6-command chain). 20 new could-go-RED tests (derived-from-
registry containment, counts, tuning-exclusion — 28 total in the file).

Strike-and-points: G9 §4.1.1 threshold table → t0-pacing.md pointer;
G10 §3.1 cold-open script table (pre-storywave, kura-first — the
shipped open begins at the WEIR) → narrative sources + t0-story.md;
G11 §4.8 T0 Phase-1 pacing table (retired meter gates, old rung
fictions) → t0-pacing.md + requirements.ts, locked intent kept as
prose (escalation, the T1+ 30-min floor, ≤2–3× ratios, no Phase-1
pillar deeds). Full verify green (17 gates).

# The taste redo — lock, cull, wire (the ⭐ TODO, executable form)

**Status: ✅ DONE (2026-07-03) — all five phases shipped.** P0 lock → D-126;
P1 taste.md pyramid (150 lines, full coverage); P2 ui-design cull (351/400,
tokens generated); P3 taste register + `doc-budgets` gate (RED-proven); P4
prediction test 24/24 (one wording ambiguity found + fixed in place). The
human's lock reads of the two docs ride the reading queue; the F10 re-plan
trigger has fired.
**Confidence: ( 5% Opus, 95% Fable )** — this is the taste keystone; only
the P3 gate wiring is routine enough for either.

The strategy + all locked decisions live in the brainstorm
([`2026-07-03-taste-transfer-architecture.md`](../../project/brainstorms/2026-07-03-taste-transfer-architecture.md));
this plan is only the build order. Constraints already locked: corpus =
`project/human-feedback/2026-07-02-playtest.md` ONLY; both docs
snapshot-class + hard-budgeted (taste.md ≤150, ui-design.md ≤400 — pending
final confirm); checklist leaves taste.md; P21/P22 → qa-playtesting.md.

## Who builds this — Fable or Opus?

Fable, with the human in the loop for Phase 0 and every sign-off. The
values/touchstones layer and both culls are taste judgment (the reason the
⭐ TODO said "WITH FABLE"). P3's `verify-doc-budgets` gate is mechanical —
Opus-safe if parallelized, but small enough to stay in-lane.

## Phases

**P0 · Lock the top layer** *(human + Fable — in flight, grill via
AskUserQuestion, checkpointed to brainstorm §10).*
Locked: V1/V2/V3/V5; touchstones GBA typewriter / JRPG learned boxes /
Fallout dialogue tree; density refs proto23 + yet-another-idle-rpg.
Open: V4 fate, V6 demotion target, Kurosawa's status, proto23 specifics,
budget confirm, missing values.
**DoD:** every open flag in brainstorm §10 answered or explicitly parked.

**P1 · Re-derive + rewrite `taste.md`** *(Fable, autonomous).*
Fresh read of the full playtest corpus; re-derive principles bottom-up and
diff against the current 22 (verify-don't-trust — no in-place editing);
chase F9/F21/F72/F102. Rewrite as the pyramid: values → touchstones →
principles at 1–2 lines each with F-pointers; no checklist, no Do/Don't
casebooks. **DoD:** taste.md ≤150 lines, coverage set-diff re-run clean,
committed + queued for the human's lock read.

**P2 · Cull `ui-design.md` + relocate the workshop bar** *(Fable).*
Reconcile to the locked taste.md; components section → per-component
one-liners + `src/` pointers; hand-maintained token tables → generated
`docs/content/ui-tokens.md` (extend `gen-docs.ts`, rides its existing
gate); P21/P22 content lands in `qa-playtesting.md`. **DoD:** ui-design.md
≤400 lines, `npm run verify` green (gen-docs proves the token move), no
taste rule stated in two places.

**P3 · Wire the delivery rungs** *(Fable; mechanical).*
AGENTS.md taste register (~10 lines, mirrors the R1–R6 pattern);
`verify-doc-budgets.ts` as a docs-scoped 13th gate (caps 150/400, absorbs
the snapshot's 120 so all caps live in one table) + the dated-bullet genre
warn. **DoD:** gate RED-provable (over-budget fixture goes red), caps
single-sourced, hooks docs updated.

**P4 · Prove the transfer** *(Fable).*
Prediction test: a fresh-eyes agent, given ONLY the locked docs, judges
~10 reversed F-item situations; mismatches fix the doc. Then the F10
placeholder's re-plan trigger fires (scorecards — separate plan, rewritten
there, not here). **DoD:** prediction results recorded in the brainstorm;
⭐ TODO closed; F10 re-plan queued.

## Order + why

P0 → P1 → P2 → P3 → P4, strictly serial: the lock feeds the rewrite, the
rewrite feeds the cull (ui-design reconciles *to* taste.md), the budgets
gate lands only after both docs fit their budgets (else it's born red),
and the prediction test needs the finished docs. No parallel lanes — every
phase edits the same two docs.

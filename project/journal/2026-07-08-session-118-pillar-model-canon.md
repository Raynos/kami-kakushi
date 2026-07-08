# Session 118 — 2026-07-08 — storywave open-Q rulings + the pillar model into canon

**Summary:** Reviewed the two storywave plans with the human, resolved the
five open HD-items (HD-25…HD-29), then grilled the pillar/tier-up model to a
lock and promoted it into the story bible. Named the T2 village Asagiri (HD-27).
No code touched — docs/canon only.

## What changed
- `docs/story-bible/tiers/t2.md`, `docs/story-bible/03-tiers.md` — named the
  T2 valley village **Asagiri** (朝霧, "morning mist") — HD-27 ruling.
- `docs/story-bible/03-tiers.md` — NEW "House Standing — the four pillars"
  block in "The structure": the pillar-structured tier-up engine (Estate/Arms/
  Office/Name, revealed one per tier; the 6-grade ladder F·D·B·A·A+·S =
  FAIL→EXCELLENT; breadth-required-specialize-on-top gate; T0 depth-autonomy in
  the four deed sources). Refines the flat standing/deeds engine per HD-25.
- `docs/story-bible/tiers/t0.md` — "The tier-up (locked)" refined: T0 reveals
  the Estate pillar; deeds bank across fields/stores/works/watch; graded
  FAIL→EXCELLENT at season exits; gate collapses to one top grade (sim-owned).
- `docs/story-bible/tiers/t1.md` — "The tier-up (locked)" refined: T1 reveals
  Arms (2 pillars); breadth gate (1 EXCELLENT + 1 GREAT, both ≥ GOOD).
- `project/brainstorms/2026-07-08-pillar-model.md` — NEW. The full grill: the
  locked pillar model (5 Q&A) + parking lot + flags. The reference for the
  canon promotion.
- `project/feedback-human/2026-07-08-storywave-open-questions-rulings.md` —
  NEW. The five HD-item rulings (HD-25 pillars/c · HD-26 v1=T0–T3 · HD-27
  Asagiri · HD-28 banner-flip-authorized · HD-29 capstone adopt-partial).

## The rulings (for the storywave A0 to transcribe as resolved HD-items)
- **HD-25** — keep pillars as mechanics (c), NOT superseded. Model now LOCKED
  (see brainstorm) and IN THE BIBLE. Downstream: redraft ADR-159 (docket #8)
  to the pillar engine (was the flat-engine transcription); ripple PRD §1.6.
- **HD-26** — v1 = full T0–T3 (default).
- **HD-27** — village named Asagiri (bible edit DONE).
- **HD-28** — agent may flip the bible README banner (after §5 rewrite).
- **HD-29** — adopt-partial: keep a real forking R7 capstone, rewrite vs
  `tiers/t1.md` when T1 opens; un-archive its plan with a rework Status line.

## Next intended steps
1. **Storywave Plan A** now needs: ADR-159 redrafts to the PILLAR engine (not
   the flat one the docket draft assumed); PRD §1.6 ripple updates the pillar
   NAMES (Office, not "Standing & Office") + the 6-grade ladder + confirms the
   model. Both are A0/A2.2 work — not done this session.
2. HD-29: un-archive `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md`
   with a "rework against tiers/t1.md" Status line (deferred to T1 build).
3. Parked (brainstorm): the T0 required peak (S vs A+ — sim-tunable); how
   House Standing SURFACES (banzuke/assessor — kernel #6, downstream UI pass);
   deed-source→pillar mapping for T1+.

## Landmines
- **Bible now DISAGREES with PRD §1.6** on pillar names (Office vs "Standing &
  Office") and the grade ladder (6-grade F–S vs the old good/great/excellent).
  This is EXPECTED — the bible is canon; PRD §1.6 is trailing forward-spec, to
  be reconciled by the storywave docs plan's A2.2 ripple. Don't "fix" the bible
  to match the PRD; ripple the PRD to the bible.
- **ADR-159's current docket DRAFT (in the storywave docs plan A0) transcribes
  the FLAT standing/deeds engine** — it must be REDRAFTED to the pillar engine
  before A0 mints it, or the docket will contradict the bible.
- The 03-tiers.md pillar block links to the brainstorm for provenance; if that
  brainstorm later archives, leave a forward pointer (append-only law).

## Addendum — storywave plan consistency (ADR-159 + HD-29)
Patched the storywave docs plan so it stops contradicting the new canon:
- `docs/plans/fable-2026-07-07-storywave-docs.md` — the **ADR-159 draft**
  (docket #8) redrafted from the FLAT standing/deeds engine to the
  **pillar-structured** engine; the **A2.2 §1.6** ripple instruction flipped
  from "pillars superseded" to "rewrite to the pillar engine (Office rename +
  6-grade ladder + keep the reveal ramp)"; the **HD-25 open-question** entry
  marked **RULED (c) — keep pillars**, so A0 files it resolved.
- `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md` — Status → **HD-29
  adopt-partial**: keep a real forking T0→T1 capstone, but its R8–R15 /
  Shigemasa devoted-ambitious-humble content is VOID; rework against
  `tiers/t1.md` when T1 opens. (Plan was PARKED, not archived — so this is a
  Status/flag update, not a literal un-archive.)
Still open (unchanged): PRD §1.6 ripple itself (A2.2) is NOT done — only the
plan INSTRUCTION is corrected; the PRD text still reads old until Plan A runs.

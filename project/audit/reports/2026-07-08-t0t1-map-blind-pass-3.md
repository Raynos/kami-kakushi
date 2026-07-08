# T0/T1 map sheets — blind pass 3 (Phase B close)

**Date:** 2026-07-08 · session 115 (continuous). **What this is:** the
Phase-B-closing blind verification — two fresh readers (images only, no repo
access) on `project/audit/screens/2026-07-08-t0t1-map-phaseb/` (14 shots,
LOD-correct captures), after the inbox-drain landings + the fine-register /
ground-plane / strata batches.

## Rubric result: every M-line passes on both sheets

The two pass-2 misses are closed, in the readers' own words:

- **R4 (was the "road" miss):** T0 — *"from the weir an irrigation channel
  peels off and runs a long southeast diagonal to feed the paddies"*; the
  weir itself read as gold crib-work, "the one piece of infrastructure still
  kept in repair."
- **R13-closed-half (was invisible):** T1 — *"the East wing is drawn solid
  and finished (改・東棟成)… the West wing is drawn as open lattice with an
  X-like mark across it — unfinished, mothballed, or closed"*; listed as an
  oddity ("one wing rises while its mirror stands open"), which is the
  designed wrongness.

The designed reads all landed harder than pass 2:

- **R16 as the T1 headline:** *"the great ruined compound receives not one
  drop of red ink… the ruin is deliberately left as a held breath. That
  silence is the single most striking thing on the sheet."*
- **R5/R6 on T0:** *"the household has visibly retreated into one corner of
  its former grounds… far more dead field than living field"*; the ruin as
  "the map's centre of gravity."
- **Craft (R11/L1/L10):** T0 — *"illustrated period document, decisively…
  does zoom reward? Yes."* T1 — *"the sheet feels like paper, not a void…
  the zoom genuinely rewards"* — V-1 (the void finding) closed by a blind
  reader's own words. Gold-as-maintenance was read as "a quiet legend the
  map never states."
- The ADR-151 hybrid mend read as "a small red 改 note beside the orchard
  (a mend/reclaim mark)" — visible, attributed loosely; acceptable.

## Remaining nits (logged, small)

1. ~~Gate/Night-rounds caption collision at fit (both readers)~~ — FIXED in
   the same commit as this report: the caption collision pass now covers ALL
   seals (with a self-chip exclusion bug found and RED-tested on the way).
2. Fold creases read as "rendering artifacts" to one reader (craft note —
   creases may want a softer tone or paper-texture context).
3. The centre-south band still "underfilled at mid-zoom" (one reader);
   the other called the same ground "paper, not void" — split verdict,
   acceptable on the committed night substrate.
4. Mountain scallop motif repetition; ruin masses "slightly flat at the
   deepest zoom" — future craft, not blockers.
5. The T0 grave terrace (drawn, unlabeled at T0) keeps being read as an
   "elevation-view facade building" — a genuinely ambiguous pictogram;
   consider a plan-view treatment when T2 craft comes around.

## Verdict

Phase B closes verified: all must-say lines on both sheets, the craft bar
met in both readers' judgment, and the two structural fixes (water grammar,
the shuttered wing) confirmed by cold reads. The golden-hash pin
(`golden.test.ts`, committed b479393) now freezes this rendering; Phase C
refactors prove themselves against it.

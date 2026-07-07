# T0/T1 map sheets — blind pass 2 (post-polish, corrected captures)

**Date:** 2026-07-07 · session 115. **What this is:** the second blind-reader
verification of the rebuilt map sheets (spec §5 rubric in
`docs/plans/fable-2026-07-07-t0t1-map-spec.md`), run on captures that FIX the
LOD bug pass 1 was blind to: the old capture script set the SVG viewBox
directly, so `data-zoom` never flipped and the `.ms-fine` register (rake
arcs, room captions, terrace numerals — spec L10) was hidden in every iter1–5
shot. The graduated script (`src/scripts/map-audit-shots.mjs`) sets the LOD
attribute the way the shell's own zoom does. Captures:
`project/audit/screens/2026-07-07-t0t1-map-postpolish/` (14 shots). Readers:
two fresh agents, images only, no repo access.

## Rubric scoring (M = must-say · S = should-say)

Both sheets: R1 ✓✓ (both named the Kurosawa family ezu, An'ei 9 / Tenmei,
north up) · R2 ✓✓ (river west, N→S, T1 in correct downstream order:
pools → flood-works → weir → reeds → shallows) · R3 ✓✓ · **R4 ✗ (T0)** —
see below · R5 ✓✓ (T0 led with it: *"the household lives in a small fenced
box in the corner of its own land, its back to the woods, while the true
center of the estate stands ruined"*) · R6 ✓✓ (*"ghost grid… the outline of
far more farmland than is currently worked"*) · R7 ✓✓ (village half a ri
south, temple lands upstream, neighboring valley east) · R8 ✗ (drill yard
read as "practice track", not a stable court) · R9 ~ (T0: *"the ruin's
garden, gone feral"* — planted-as-courtyard landed; the bamboo raid corridor
didn't) · R10 ✓✓ · R11 ✓ with honest caveats (below).

T1: R12 ✓ (partly via the roster panel's own text — the drawing plus the
product carry it) · **R13 ~** — east wing NEW landed (gold 新 + the red
改・東棟 note) but the west wing's CLOSED state did not (shutter marks too
subtle; reader said "the wings opened / reopened its formal rooms") ·
R14 ✓ (*"the water dies from the top"* — pools struck 改・涸 read exactly;
the closed breach specifically unremarked) · **R15 ✓✓ — the capture fix
paying off directly:** the reader read the terrace numerals 一–九 across the
kept and let-go runs — *"one continuous flight of fields, of which the
family has kept the lower half and surrendered the upper half… the retreat
legible in the numbering."* Those numerals live in `.ms-fine`; pass-1
readers could never have seen them. · R16 ✓ (*"pointedly untouched by any
new work"*) · R17 ~ (new gold-walled graveyard = "unannounced deaths"; the
one stoneless plot unremarked) · R18 ~ (clamp named; burn line unremarked).

Also recovered unprompted: the night patrol as a mapped phantom, Sōan as
the only personal name, the universal 怪 as THE reading (*"a siege without
a visible enemy"*, *"a catalogue of hauntings"*), the fresher boundary
stone's 新? as *"an editorial hesitation left on the sheet."*

## The two real misses → Phase B items

1. **R4 (M, T0): the irrigation channel reads as a ROAD.** The reader saw
   the weir and a "long diagonal path from the weir SE to the estate gate"
   and called the channel's gold line through the paddies "a gold vein…
   like a kintsugi crack, unexplained." Diagnosis: the channel wears path
   grammar (single dashed-adjacent line) instead of water grammar. Fix:
   double wet-line + sluice bars + a water-tone thread at FIT zoom weight,
   reading as the weir's child, not the road's sibling.
2. **R13 (M-half, T1): the west wing's CLOSED state is illegible.** Fix:
   stronger shutter-bar marks + a cooler/veiled roof treatment vs the east
   wing's fresh-ink, so "one wing bright, one wing shuttered" survives fit
   zoom.

## Converged craft notes (both readers, matching session-115 review)

- Building fills at deep zoom are "flat vector blocks… below the craft
  level of the trees and mountains" (the wing plane cleanup, V-5).
- Large empty darks remain (T0 centre-east/NW-centre; T1 centre-south/SE)
  — the V-1 ground pass, now committed to the NIGHT substrate (see below).
- Uniform dash patterns + English serif glosses read as UI over the
  drawing — a deliberate trade (play needs the gloss), noted not actioned.
- Deep-zoom label collisions at the T1 house cluster (Shoin/Inner-garden
  overprint, the 改・東棟 note) — V-6, Phase B.

## Substrate: RESOLVED — night-indigo stays

ADR-149's A/B toggle was built and screenshotted this session, then
**killed by the human before commit** (2026-07-07: *"doesn't fit the style
of the rest"*). The night sheet is the committed substrate; the V-1 void
fix is therefore earned by rendering (ground-texture pass), not by a
palette swap. HR-12's substrate question is closed.

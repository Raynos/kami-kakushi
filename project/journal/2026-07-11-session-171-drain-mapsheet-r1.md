# Session 171 — inbox drain: mapsheet + r1 (FB-377…FB-387)

**Date:** 2026-07-11 · **Agent:** Claude Code (claude-fable-5) ·
**Mode:** `/drain-inbox all` (ADR-171 — claimed mapsheet + r1, no collisions)

## What happened

Claimed both open lanes (11 captures), reproduced every item headlessly
against the shared `:5173` server (screenshots + code-grounding + a live
drive of the R0→R1 ceremony for FB-383), and presented one wholesale
proposal. The human approved the lot; FB-381/382 (gate kitchen + sickroom)
locked to the *separate, fiction-led beats* direction with the drafted hooks
shown before landing.

## Landed

- FB-377/378/379/380/384/385/386 — the live map's fog of war made whole
  (`reveal.ts` + `sheet-map.ts` + `.map-pane` CSS): fog overshoots the window
  past the pan clamp's reach (east woods + outskirts covered), the cartouche
  slip fogs with the land (ADR-151 furniture exemption narrowed by human
  steer), the rung-1 known polygon gains the paddies SW pocket (reachable
  ground never under fog; stale ghost dropped), locked-scenery seals wait
  under fog via the new `isFogged()`, and the Map tab pins the sheet
  top-left with the you-are-here card floating in the right column.
  Golden pin GREEN (reveal isn't hashed); verify green.
- FB-387 — header body + belly stack as a `.vital-stack` column, bars only
  (numerals → hover titles); header height unchanged.
- FB-383 — 💬 answered, not reproduced: the real ceremony names all three R1
  unlocks incl. the woodshed (driven live via `rung-beat-ready`).
- FB-381/382 — 🔧 drafted, awaiting the human's read: `room-kitchen` revealed
  by the R1 terms beat; `room-sickroom` at R3 with combat (ADR-177 pattern).

## Next intended steps

- Land the kitchen/sickroom reveal hooks once the human signs the draft.
- T0 blind-pass after the look-bearing fog change (map-authoring §5).

## Commits

- `6003a78b` — the map fog/seal/layout batch (FB-377/378/379/380/384/385/386)
- FB-387 header vital-stack rides the next commit with this journal line.

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
- Bookkeeping: sidecars stamped (9 done: FB-377…380, 383…387); the r1 bucket
  archived (entry merged into the existing archive file); mapsheet stays in
  pending/ on the two open fiction-led items (FB-381/382).
- FB-381/382 landed (human-approved draft): `room-kitchen` reveals at the R1
  terms beat, `room-sickroom` at R3 with combat (ADR-177 pattern); ceremony
  labels announce both; tests updated to the new schedule; fixtures +
  narrative registries + PRD regions regenerated.
- `8686618e` — FB-381/382 landed; mapsheet bucket archived (10/10 done);
  pending/ is EMPTY. T0 blind pass PASSED (7/7 M · 3/4 S; the R9 orchard
  S-miss is a pre-existing content gap) — report committed.
- Human steer mid-session: the live sheet was showing T1-scale world (forest,
  hills) — root-caused to paintWorld drawing the whole world with only the
  viewBox as crop. paintT0Ground now CLIPS the world to the T0 window (the
  furniture stays on the frame); the fog rect simplifies back to window-exact.
  Golden pin regenerated deliberately; captures eyeballed; verify green.
- Human steer #2 — "one engine, one source of truth" for the map sheets: new
  `map-sheets/viewer.ts` (the shared pan/zoom/pinch/fit engine, superset of
  the two drifted copies) + `stageAtRung()` in reveal.ts; sheet.ts and
  sheet-map.ts now consume it (~230 duplicated lines deleted). Seal painters
  stay separate by design (roster vs travel semantics — the plan doc records
  the scope). Pin GREEN; both surfaces smoke-tested live headlessly.

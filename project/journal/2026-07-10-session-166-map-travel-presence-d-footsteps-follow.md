# Session 166 — 2026-07-10 — map travel presence D: footsteps + follow (V6D)

**Summary:** The human wanted a 4th travel-presence variant combining B (ink
footsteps) and C (the sheet follows/pans) — "I want both the map moving and the
footsteps." Built `presence-d` ('trail' mode), wired it into the DEV toggle
(HR-26). First cut had a bad feel (the human playtested: "footsteps don't play
immediately, map doesn't re-center, big pause"); reworked the timing to be brisk
and concurrent and re-verified with a headless probe. DEV-only, awaiting the
human's live pick.

## What changed
- `src/ui/map-variants/sheet-map.ts` — new `'trail'` value on `TravelPresence`
  and a `runPresence` branch. Footprints (B's geometry) + the follow-pan (C's
  viewBox lerp) run in ONE concurrent timeline; prints live in SVG user-space so
  they ride the panning viewBox. Reduced-motion recentres instantly (like C),
  no footsteps.
- `src/ui/dev.ts` — added the `presence-d` variant (label "D · footsteps +
  follow") to the `travel-presence` surface; mapped it to the `'trail'` mode in
  `renderTravelPresenceVariant`.
- `src/ui/dev.test.ts` — the variant-list assertion now expects presence-d; the
  non-default routing test loops over `['presence-b','presence-d']`.
- `project/human-in-the-loop/review.md` — HR-26 gains a D row + the `?travel-
  presence=…-d` look-live pointer + the zoom caveat.

## The feel fix (first cut → rework)
First cut copied B's timing verbatim: footsteps staggered 110ms apart, the
here-ring HIDDEN until 780ms, total 1460ms with a ~680ms dead tail (prints
weathering under a static ring). That reads as "delayed + a big pause." Rework:
- Footprints born from ms≈0 (first at ~90ms measured), all down by ~0.7·walk.
- The ring PRESSES IN across the whole walk (`press(ms/walkMs)`) — the marker is
  present throughout, never a void.
- Pan from frame 0 (`ease(ms/walkMs)`), arriving as the walk completes.
- walk 520ms + a 240ms overlapping tail = ~760ms total, no dead beat.

## The "map doesn't re-center" note
The pan is mechanically identical to C and DOES pan (headless probe: 57 viewBox
frames, 430,330 → 840,592). The human's "no re-center" was the old timing
burying the pan under the dead-tail feel. **Genuine limit:** at full fit-zoom
the sheet fits the viewport, so `clampVb` pins any pan — same as C. Flagged in
HR-26; if the human wants it to always pan, that means overriding the player's
zoom (a taste call for them, not self-serve — TST2 "never yank the ground").

## Verification
- `pnpm run verify` — 18 gates green in 5.15s (routing test updated + passing).
- Headless probe (`tmp/verify-trail.mjs`, fixture `rung-R3`, reduced-motion off,
  driven via `__qa.goto` — synthetic seal clicks DON'T move, the SVG hit-test
  needs real pointer events): firstFoot 88ms · here-ring visible 139ms · 6 feet
  · overlay gone by 864ms · pan 57 frames · 0 console errors.
- Mid-animation screenshot (forecourt→paddies): the vermilion footprint trail +
  the ring pressing in at 田, view following. Reads as intended.

## Next intended steps
1. Human reviews D live (DEV → Variants → Map travel presence, or
   `?travel-presence=presence-d`) and picks among A/B/C/D.
2. If they want the pan to always show (even at fit-zoom), that's a follow-up
   design call (override the player's zoom vs. keep the C-style clamp).

## Landmines
- The trail's footprints are SVG-user-space children of the panning `svg`, so
  they slide with the viewBox by construction — do not "correct" their coords
  for the pan.
- Headless QA of the map: drive movement with `__qa.goto(node)`, NOT synthetic
  seal clicks (the map uses pointer hit-testing; `MouseEvent('click')` no-ops).
  Complete the cold-open first (a fixture like `?fixture=rung-R3` skips it) or
  the shell never mounts (`here: kura`, no `.nav-tab`).

# Session 166 — 2026-07-11 — map presence: converge to D + sync to the move timer

**Summary:** The human picked travel-presence **D (footsteps + follow)** and asked
to (a) delete A/B/C from code + DEV menu, and (b) make the footsteps play DURING
the move's action timer, synced to its length — not after it. Converged D to the
sole shipped behavior and re-architected the trigger to be **ActionClock-driven**:
the walk fires the instant a `move_to` action starts and its progress reads the
clock's live fraction, so it starts immediately and arrives exactly as the timer
completes. HR-26 resolved (pending the archive move).

## What changed
- `src/ui/map-variants/sheet-map.ts` — removed the `TravelPresence` type, the
  `presence` param, the four animation branches, and the post-rebuild `prevHere`
  trigger. Added `travelPresenceRef` (a module ref render.ts fires) + a single
  `runFootstepsFollow(svg, from, to, view, sample)` driven by `sample()` (the
  clock's `{fraction, running}`): footprints stamp along the edge, the sheet pans
  to centre, and a temp destination ring presses in — all keyed to `fraction`,
  so the animation speed == the timer length and it pauses/freezes/scales with
  the clock. The prints ride the panning viewBox (SVG user-space).
- `src/ui/render.ts` — dropped the DEV variant hook + `presenceVariant` from the
  map sig; added `maybeStartTravelPresence()` on `clock.onChange`: when a new
  `move_to:<id>` starts running, fire `travelPresenceRef.current(here, id, …)`
  with a sampler reading `clock.status(key)`. So the walk plays during the timer.
- `src/ui/dev.ts` — removed the `travel-presence` SURFACES entry, its
  `renderSurfaceVariant` branch, `renderTravelPresenceVariant`, and the orphaned
  `renderMapSheet`/`TravelPresence`/`buildMapCtx` imports.
- `src/ui/dev.test.ts` — deleted the DEV variant-routing describe block (no
  variant registry entry any more; the prod sheet is covered in render.test.ts).

## Why clock-driven (the human's exact ask)
Before: click → the ActionClock timer ran (node act-bar) → completed → move
dispatched → map rebuilt → THEN a fixed ~760ms footstep animation. Two sequential
phases = "a big pause, then the animation." Now the footsteps ARE the timer's
visual: same start, same length, synced frame-by-frame off `clock.status().fraction`.

## Shared-tree note (IMPORTANT for the next pickup)
`render.ts` was CO-EDITED: a co-agent's uncommitted **FB-367/FB-368 rake-row
lock-hint** hunks (~L3014-3050) sat alongside my travel-presence hunks. I committed
ONLY my 3 render.ts hunks via `git apply --cached` of a filtered patch (dropping
the two foreign hunks), leaving their WIP untouched in the working tree — NOT a
pathspec commit (that would have swept them). Coordinated with the body-split agent
(w6:p1) first: they kept a deprecated `EAT_RICE_SATIETY` alias in balance.ts so the
tree stays green until their Phase-2 UI commit renames the two render.ts display
refs (L3195/L6153); they confirmed none of render.ts is theirs and I could land
independently. Backup of my full diff: `tmp/map-presence-timer-sync.patch`.

## Verification
- Typecheck clean (no TS errors in my files; tree green via w6:p1's alias).
- Headless smoke (`?fixture=rung-R3`): game loads, map renders (svg + here-ring +
  6 seals), ZERO errors from my code.
- The timed-sync path itself is verified by reasoning through the clock wiring
  (onChange → runningKey → travelPresenceRef), not a headless timed-move capture
  (__qa.goto may bypass the timed gate) — the human is the live verifier on :5173.

## Next intended steps
1. Human confirms the synced footsteps feel right on :5173 (walk speed vs. timer,
   trail density, follow-pan). Quick tuning lives in sheet-map.ts (not co-edited).
2. Resolve HR-26 → archive.md once the human signs off on D.
3. After w6:p1's Phase-2 UI commit lands (renames the EAT_RICE_SATIETY refs +
   drops the alias), re-verify the map path still compiles.

## Landmines
- The presence is now fired ONLY from `clock.onChange` in render.ts — a move that
  does NOT go through the timed ActionClock gate (e.g. some `__qa` drives) won't
  animate. That's correct (only real timed player moves animate).
- `runFootstepsFollow` reads `sample()` each frame and stops when `!running` or the
  svg is replaced (completion rebuild). It restores the hidden here-ring on cancel.
- Committed via index (`git apply --cached`), NOT pathspec — because render.ts is
  co-edited. Re-verify the staged set before any future render.ts commit here.

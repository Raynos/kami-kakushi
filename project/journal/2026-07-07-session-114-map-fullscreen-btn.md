# Session 114 — 2026-07-07 — full-screen button for the T0/T1 review maps

**Summary:** Added a `⛶ full` control to the DEV T0/T1 review-map modal so the
human can blow the map SVG up to the whole physical screen (native Fullscreen
API on the map pane) and read the survey close. DEV-only, self-contained in
`map-sheets/sheet.ts`.

## What changed
- `src/ui/map-sheets/sheet.ts` — new `⛶ full` button in the zoom control group
  (next to `⤢ fit`). Toggles `document.fullscreenElement` on the `.t0v2-mapwrap`
  pane via `requestFullscreen()` / `exitFullscreen()`; a `fullscreenchange`
  listener flips the label `full`↔`exit` and re-runs `fit()` so the whole sheet
  stays framed when the pane resizes. Shared code, so both T0 and T1 get it.

## Verified
- `pnpm run typecheck` clean.
- Headless Playwright: opened the T0 map from the DEV Story tab — the button
  renders in the control row (`⊕ ⊖ ⤢ fit ⛶ full`) and clicking it invokes
  `requestFullscreen()` on the map pane; no page errors.

## Next intended steps
1. None — small self-contained DEV affordance.

## Landmines
- `requestFullscreen()` needs a user gesture + a real display, so it can't be
  truly exercised headless (the verify patched the method to confirm wiring).
  The button click IS a user gesture in the real browser, so it works live.

# Session 114 — 2026-07-07 — maximize button for the T0/T1 review maps

**Summary:** Added a `⛶ full` control to the DEV T0/T1 review-map modal so the
human can blow the map SVG up to fill the viewport and read the survey close.
First tried the native Fullscreen API — but that promotes the pane into the
browser's TOP LAYER, where the `` ` `` playtest-capture overlay + drawing pen
(appended to `<body>`) can't paint over it. Switched to a **CSS maximize**
(`position:fixed; inset:0`) that stays in normal DOM stacking, so the capture
layer (z ~2^31) still renders above the map. DEV-only, self-contained in
`map-sheets/sheet.ts`.

## What changed
- `src/ui/map-sheets/sheet.ts` — `⛶ full` button in the zoom control group
  (next to `⤢ fit`) toggles a `.t0v2-max` class on `.t0v2-mapwrap`
  (`position:fixed; inset:0; z-index:40`). An on-pane `⛶ exit` chip (the head
  bar is covered when maxed) and Esc both step back out; Esc exits maximize
  first, then closes the modal on a second press. `fit()` re-runs on every
  toggle so the whole sheet stays framed. Shared code — both T0 and T1 get it.

## Why not native Fullscreen
The backtick playtest-capture (FB-3) renders its overlay + pen at z-index ~2^31
on `<body>`. A native-fullscreen element sits in the browser top layer, ABOVE
all normal DOM regardless of z-index, so the capture UI vanished behind it. A
CSS blow-up keeps the map in the ordinary stacking context, so capture wins.

## Verified (headless Playwright, no page errors)
- `pnpm run typecheck` clean.
- `⛶ full` → `.t0v2-mapwrap` gets `position:fixed` and fills the viewport
  exactly (1200×800); exit chip shows; label flips to `⛶ exit`.
- Fired the `` ` `` hotkey while maxed — capture overlay renders at z 2147483646,
  far above the map's z-40 (so the pen paints over the map).
- One Esc exits maximize (modal stays open); a second Esc closes the modal.

## Next intended steps
1. None — small self-contained DEV affordance.

## Landmines
- The maximize z-index (40) MUST stay far below the capture layer (~2^31) — that
  gap is the whole point. Don't "fix" it up into fullscreen/top-layer territory.

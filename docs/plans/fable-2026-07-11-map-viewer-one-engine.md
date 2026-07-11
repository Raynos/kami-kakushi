# Map sheets — one viewer engine (kill the sheet.ts ↔ sheet-map.ts copy-pasta)

**Status:** ▶️ in progress (human-ordered 2026-07-11, mid-session steer)
**Confidence:** ( 90% Opus, 10% Fable ) — mechanical extraction under a green
pin; the taste-bearing look is untouched.

## Who builds this — Fable or Opus?

Either. It's a behavior-preserving extraction guarded by the golden pin, the
map integrity tests, and a live smoke of both surfaces. Authored and executed
by the Fable drain session that received the steer.

## The problem

The live Map tab (`src/ui/map-variants/sheet-map.ts`) was built by PORTING the
DEV survey viewer's interaction stack (`src/ui/map-sheets/sheet.ts`) — about
200 lines of pan / wheel-zoom / pinch / fit / maximize / viewBox-clamp logic
now live twice, already drifting (jsdom guards and view persistence exist only
in the live copy; the zoom-time filter suspension only in the DEV copy). The
fog-stage lookup (`REVEAL.filter(s => s.rung <= rung)` → last) is pasted in
both. The human's steer: one engine, one source of truth.

## What is already single-sourced (no change)

- Geography: `layout.ts` (`WORLD`, `T0_WINDOW`, `ANCHORS`) — both consume.
- Ground painting: `ground.ts`/`t0-sheet.ts` (golden-pinned) — both consume.
- Fog painting: `reveal.ts` `paintReveal` + `REVEAL` data — both consume.
- Zone narrative: `nodes.ts` (DEV) / core `content/map.ts` (live) — distinct
  BY DESIGN (bible roster vs walkable game nodes; ADR-151).

The two SEAL painters stay separate on purpose: the DEV sheet draws
roster/detail seals (kind-classed, caption zoom-gate), the live map draws
travel seals (here/walkable/gated/locked + move dispatch). Different
semantics, shared anchors — merging them would be a forced abstraction.

## The change

1. New `src/ui/map-sheets/viewer.ts` — `attachSheetViewer(svg, FR, opts)`:
   the ONE interaction engine (viewBox state, clamp, wheel/pinch/drag with
   late pointer-capture, zoomAt-about-a-point, fit, the `data-zoom` LOD gate,
   client→world via getScreenCTM). Superset semantics: jsdom guards always on
   (the live copy's), optional zoom-time filter suspension (the DEV copy's),
   optional initial view + apply hook (the live copy's persistence).
2. `reveal.ts` exports `stageAtRung(rung)` — the sparse-stage lookup, used by
   both (and anywhere later).
3. `sheet.ts` and `sheet-map.ts` delete their copies and consume the engine;
   each keeps its own chrome (buttons, CSS classes, maximize wiring, default
   framing, travel-presence follow).

## Verification

- `pnpm exec vitest run src/ui/map-sheets/` — the pin must stay GREEN (the
  engine never touches the draw stream).
- Full `pnpm run verify` (dev.test.ts mounts the DEV sheet; full-mount sweeps
  click the zoom buttons under jsdom).
- Live smoke, headless: the Map tab (pan/zoom/fit/full + fog + travel) and
  the DEV T0/T1 viewers (`openTierMap`), before/after screenshots.

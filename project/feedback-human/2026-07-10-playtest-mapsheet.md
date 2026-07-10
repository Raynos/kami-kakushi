# Playtest feedback — 2026-07-10 (async inbox capture, mapsheet lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), **mapsheet**
bucket — drained via `/drain-inbox mapsheet` (the whole lane, 3 entries, human
go-ahead 2026-07-10). Status legend: 🔲 open · 🔧 in progress · ✅ fixed ·
🅿️ parked · 💬 needs-discussion.

## Mapsheet (session `2026-07-10T18-06-15-82be22`)

### FB-341 · Far map seals read clickable but aren't — ✅
**Verbatim:** _"When tryign to navigate the map it appears that woodshed is
reachable but its not, like it should be disabled and only the ones where we
can go to are enabled."_
**Reading:** the live map IS adjacency-gated (`canMove`, core `map.ts`) and
strokes walkable seals gold vs far seals dim silver — but `.sheetmap-node`
put `cursor:pointer` on EVERY seal and the hover rule lit ANY non-locked seal
in the same gold as walkable, so a two-hops-away seal (woodshed, from the
gate) read clickable and clicked dead. Repro'd live from the capture save.
**Distilled rule:** an affordance (cursor, hover glow) belongs only to the
element that actually responds — pointer + glow are `wireTravel`'s, never the
class's. (TST4: the player never guesses state.)
**Fixed in:** (this drain's commit) — far seals stamp `data-far` +
`aria-disabled`; the pointer cursor + gold hover now scope to `[role="button"]`
(wireTravel'd seals only). RED-able test: at the gate a revealed woodshed seal
is inert (no role, no pointer, click walks nowhere).

### FB-339 · Port the prototype viewer's interactions to the live map — ✅
**Verbatim:** _"High level, the T0 prottoype map is way better then the one
actually integrated into the game. it has R0/R1 fog of war. / It has zoom
capabilities, it has dragging ability, it has buttons for full screen and fit,
which i think we want all of this to go into the actual map in the game
itself."_
**Reading:** fog-of-war is ALREADY live and real on the map tab (core-driven
reveal + the 未測 fog frontier — the prototype's rung pill is a DEV preview of
the same thing). What the live map lacks is the interaction layer: wheel/pinch
zoom, drag pan, fit + fullscreen. Human approved porting it from the prototype
viewer (`src/ui/map-sheets/sheet.ts`) onto `renderMapSheet`.
**Fixed in:** (this drain's FB-339 commit) — wheel/pinch zoom, drag pan (pointer
captured only once a REAL drag starts, so seal taps stay live), ⊕/⊖/fit/full
controls, the L10 fine-register zoom gate (`data-zoom`), and the view + maximize
state persisted at module level so the sig-guard rebuild never snaps the sheet
back under the player (TST2). Golden pin stayed green (geometry untouched);
verified live headlessly: zoom → pan → timed seal-click walk → view kept.

### FB-340 · Travel presence: a real marker + animated movement — ✅
**Verbatim:** _"For the map I want to see my current position, some kind of
marker, or something that shows on the map that's really cool. / Then when you
move from zone to zone on the map, I want that to be animated as if I'm
moving. / Maybe like a little 3D figurine that's sitting on top of the flat
screen, or something else. I dont know, need to really think of a good idea."_
**Reading:** a marker exists (the vermilion ring + "You are here") but is
quiet, and movement has zero motion — the sheet just re-renders. Unsettled
taste → human approved a **diverge lane** (ADR-075): 2–3 working
travel-presence variants (marker + move animation) behind the DEV toggle,
each an HR-item for the human's pick.
**Doc-update plan:** the winning variant's idiom graduates to `ui-design.md`
with the human's pick (not before).
**Fixed in:** (this drain's FB-340 commit) — the ADR-075 diverge is BUILT and
live: **HR-26** files the three variants (A · glide seal — self-picked prod
default; B · ink footsteps; C · the sheet walks), all driving the ONE
here-ring idiom, toggleable in DEV panel → Variants or
`?travel-presence=<id>`. Only a real one-hop walk animates (a load/teleport
never does); reduced-motion is instant. The human's pick closes HR-26.

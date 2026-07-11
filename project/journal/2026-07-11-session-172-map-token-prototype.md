# Session 172 — 2026-07-11 — physical-token map presence prototype

**Summary:** Built the human-requested feel-test prototype: a physical piece
(koma / miniature / go stone / pilgrim hat) sitting on the REAL T0 survey
sheet, travelling between zones as a linear animation — the proposed
replacement for the flat shu square/circle/footsteps presence marks (FB-340 /
HR-26 territory). Lives in `project/prototypes/map-token-presence/`.

## What changed
- `project/prototypes/map-token-presence/physical-token/t0-sheet.svg` — the
  real T0 sheet baked standalone: harvested the live render (headless, via
  `openTierMap('T0')` per the map-audit-shots idiom), embedded the sheet's CSS
  rules + the 54 resolved Andon Steel custom properties into an inline
  `<style>` so the SVG renders faithfully with zero external deps (3.4 MB).
- `project/prototypes/map-token-presence/physical-token/index.html` — the
  prototype: token layer overlaid on the baked sheet in the same viewBox
  coordinates; T0 zone anchors copied from `layout.ts` as labeled mock data.
  Four token builds (将棋 koma with bevel/grain/主 kanji · upright wooden
  miniature with shu sash · polished go stone with the gold 黒 mon · true
  top-down 笠 pilgrim hat with swaying gait + sandal tips), three movement
  idioms (walk + fading shu footprint stamps · slide · lift & place with the
  shadow separating and softening under the lifted piece), optional camera
  follow (zoom-in lerp during travel, eases back to fit on arrival). Travel is
  linear constant-speed per the ask; click a zone seal or anywhere on the
  sheet.
- `project/prototypes/README.md` — new `map-token-presence/` plan-folder
  section (no owning plan yet; prototype precedes plan).
- `project/todo-human.md` — reading-queue entry (play the prototype).

## Next intended steps
1. Human plays the prototype → verdict per token + movement idiom (⭐/REFERENCE
   tags into the prototypes README).
2. If it lands: an owning plan for wiring a token presence into the live map
   tab (`src/ui/map-variants/sheet-map.ts`, the FB-340 presence layer) —
   respecting the golden pin (the token layer is shell/overlay, not hashed
   ground).

## Landmines
- `t0-sheet.svg` is a BAKED CAPTURE (2026-07-11) — it will drift from the live
  sheet as map work lands; re-bake via `tmp/extract-t0-sheet.mjs` +
  `tmp/bake-t0-svg.mjs` if the prototype needs refreshing (both scripts are
  git-ignored scratch; the journal is their record).
- Headless QA hook blocks the playwright MCP (headed) — drive prototype shots
  through node playwright scripts, same as the game.

---

## Entry 2 — round 2: the human steers the feel-test live

Live feedback while iterating: (1) koma / go stone / pilgrim hat are "not the
fit" — REMOVED (builds recoverable at `73300fa1`); the miniature/peon idiom is
the theme. (2) First miniature set was too samey ("the same robe with one
piece of flare") and mis-sized — first too large vs the zone-seal labels, then
0.55 too small; landed on 0.82 (+50%, the human's middle ground). (3) Needed to
zoom in AND STAY zoomed to compare sculpts — added a persistent manual camera
(scroll-to-zoom at cursor, drag-to-pan, drag suppresses travel clicks; camera
follow now zooms at least as far as the manual view).

New sculpt set — divergent in material / silhouette / base / gait:
- 根付 **porter** — boxwood netsuke, bundle high on the back, staff, heavy waddle
- 塗 **painted lord** — indigo kamishimo wings + gold mon, lacquer base, glides
- 切絵 **ink cutout** — flat sumi paper-cut walker on a wood block, tilts
- 埴輪 **clay peon** — fired-clay flared cylinder, hollow eyes, stomps

Zone landings now offset ~46 units south of the seal so the piece stands
BESIDE the label, never behind it (first vet showed it hidden by the seal box).

Self-vetted headlessly per sculpt (zoomed crops via the `window.__proto` QA
hook); porter + cutout were redrawn once after the first vet read muddled.

# Session 111 — 2026-07-07 — T0 V2 review map (story-bible zones, DEV modal)

## What the human asked

The story bible's T0 zones were just redone (`docs/story-bible/tiers/t0.md`,
walked whole 2026-07-07) but the game hasn't been rebuilt to match — and the
map is the component they're worried about. Ask: a **brand-new T0 V2 map**,
viewable full-screen from a DEV-menu button, interactive, carrying **all the
nodes in the new tier sheet** — WITHOUT replacing the existing map or touching
any game function or test.

## What shipped

- **`src/ui/dev-t0v2-map.ts`** (new, self-contained): `openT0V2Map()` — a
  full-screen `.modal-scrim/.modal-card` modal drawing the rebooted zone
  roster as an ezu-style survey sheet (絵図・改). Renders from its OWN
  bible-distilled data table, **not** `src/core` — the point is reviewing
  territory the engine doesn't have yet. All **17 nodes**: 7 estate (gate,
  forecourt, woodshed, kitchen threshold, shrine-alcove corridor, kura,
  Sōan's sickroom) · 4 grounds (weir & riverbank, drill yard, home paddies,
  woodlot edge) · 4 combat zones (weir reeds, field margins, overgrown
  orchard, bamboo grove) · the Night rounds activity (post by the gate) ·
  the LOCKED ruined compound (scenery, roped off).
- **Interactive:** click/Enter a seal or a roster row → detail pane with the
  full node grammar (blurb · actions incl. hidden · who's there · combat
  shape · the wrong thing); 戦/人/怪 layer pills toggle the mark layers
  (怪 also owns the drawn wrong-things: the hidden sett under the ruined
  wall, the bamboo waymark, char stumps, boundary stones); selecting the
  Night rounds draws its patrol rail through the zones' night states.
- **`dev.ts`:** one import + one launcher button at the top of the Story
  pane. Nothing else touched — no game function, no test, prod untouched
  (module rides the DEV fold).
- Fix found by headless QA: the DEV panel floats at z-index 9999 ABOVE
  `.modal-scrim`, blocking the aside's corner rows — the map scrim goes to
  10000 (it's a full-screen review surface).

**Proof:** `verify` 17/17 green · headless Playwright pass (tmp/t0v2-shot.mjs):
open → overview → night-rail → detail → layers off → roster-select → Esc
closes; screenshots eyeballed (tmp/t0v2-shots/).

## Next intended steps

- Human reviews the sheet (DEV → Story → "⤢ T0 V2 map"); zone placement +
  kanji seals + adjacency roads are all display-draft — steer freely.
- After sign-off: the engine rebuild (real nodes/edges/actions for the V2
  roster) is its own plan — this artifact is the map's dress rehearsal.

## Redesign pass (same session — human steer)

The first cut squeezed the roster onto the shipped ezu sheet's footprint —
"too damn busy", and it read as an extension of the old map. Rebuilt the
geography from scratch:

- **Big world canvas (2400×1600) + a moving view**: drag-to-pan, wheel-zoom
  (cursor-anchored), ⊕/⊖/fit buttons; opens at full-sheet fit; roster rows
  FLY the view to their zone. Nothing shares ground any more.
- **T1-aware layout (t1.md read whole):** every T1 zone has reserved, empty
  ground — upstream pools up-river (top-left), downstream shallows below the
  reeds, terraced + let-go terraces on the slope between margins and ruin,
  woodlot proper beyond the edge, family plot on the knoll, and the wings /
  inner garden / shoin drawn TODAY as faint shuttered blocks on the big
  compound's main house. The T1 map = this sheet, more seals (deferred —
  human wants T0 signed first).
- **The compound got its real size** (over half the tier lives there): big
  walled court, house + closed wings, kura, woodshed, sickroom lean-to
  outside the wall, gate + stall + night post along the south.
- Pointer-capture bug caught by the QA pass: capturing on pointerdown
  retargets the derived click to the svg — node selection went dead.
  Capture now starts only when a real drag begins.

Proof: verify 17/17 · headless pass (pan keeps selection · zoom · fly-to ·
pills · Esc) · screenshots eyeballed (tmp/t0v2-shots/).

## T1 map (same session — human ask: side-by-side)

Second button in DEV → Story: **"⤢ T1 map — the land & the wings (grown
sheet)"** — its own full-screen modal, same world as T0 so the two review
side by side. Implementation: the module went tier-parametric
(`openTierMap('T0'|'T1')`); T1 = the T0 sheet + 14 new zones from t1.md
landing on exactly the ground the redesign reserved (terraces + let-go up
the NW slope, pools behind the breach, flood-works channels, shallows with
fish-weir chevrons, family plot on the knoll, clamp + firebreak past the
woodlot, boundary far-fields, and the compound interiors: kura interior,
workshops, east/west wings, inner garden + its gate-onto-the-ruin, shoin).
New-in-T1 seals wear a gold 新 badge (roster too); carried T0 zones keep
their seals and their detail pane gains a "What T1 changes here" section
(reeds pressure drop, the grown night rail — now threading workshops and
the east wing — the room offered vs the woodshed, papers leaving the
kitchen…). East wing draws solid on T1, west stays shut.

Proof: verify 17/17 · headless T1 pass (31 seals · new-node fly-to ·
carried-node T1 note · Esc) · screenshots eyeballed.

## T1 REBUILT — its own grander sheet (human steer: "T1 makes no sense")

The first T1 was rightly rejected: it grafted new zones onto the T0 sheet
with small changes and read as random. T1 is the REVEAL, so it got its own
world (WORLD_T1 3200×2100) laid out to the human's spec — a proper samurai
estate at true scale:

- **The great precinct** — a big worn outer wall (part-broken, crumble ticks),
  the NEW great gate + gatehouse, Yohei's stall moved to its shadow.
- **The main house HALF-RUINED** — center + west wing drawn as fallen
  footprints + rubble; the **east wing rebuilt SOLID**, the shoin restored at
  its head; the inner garden's stepping stones walk into the ruin.
- **The guest house is now ONE sub-compound** in the SE corner — the whole T0
  world (kitchen, forecourt, woodshed, sickroom, shrine, its small inner gate)
  shrunk to a corner of the estate.
- **A service court** — workshops + cold forge, a kura pair, standing stores
  AND ruined outbuildings (the "many buildings, half of them ruins" texture);
  the drill yard beside the ruined twenty-horse stable range.
- **Organized farm & paddies quarter** (west-centre) — let-go scrub → four
  ordered terraces → home paddies → far fields, one legible staircase; a barn
  + drying racks; the numbered stones running up into the scrub.
- **A coherent river/flood-works corridor** down the west — upstream pools
  behind the taken-stone breach → the fanning flood-works + levees → the weir
  + jizō → the reeds → the downstream shallows (fish-weir chevrons, the
  dressed-stone otter den).
- **A REAL forest** filling the east (42 trees edge→deep), the charcoal clamp +
  its firebreak's straight edge, the road east off the sheet.

Every seal has its own T1 world position (T1_POS); the module is now
per-tier throughout (worldFor / posFor / paintT0Ground vs paintT1Ground /
per-tier night rail, cartouche, fit + fly-to). T1 drops the roped `ruined`
node (in T1 the ruin is ENTERED). 30 seals, 14 gold-新.

Proof: verify 17/17 · headless both maps (T1 30 seals · precinct + guest
house + river fly-tos) · screenshots eyeballed.

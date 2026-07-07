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

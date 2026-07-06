# The REAL estate map — 10 candidate directions (pick 3 to build)

**Status: PROPOSED — awaiting the human's pick of 3.** Human steer (2026-07-06,
UI-v2 session): the seven schematic map takes are dead or provisional — C/D/E/F
stripped, A disliked, **B (spatial schematic) & G (ink node-graph) survive only
because they have real 2D what-is-where navigation**. The destination is a
**genuine illustrated 2D map of the estate** — "a real illustration, not just
boxes" — that **evolves**: grows as tiers open the world, and changes as estate
improvements land (U1–U4, house rooms reopening, unlocks). The human picks
**3 of the 10 directions below**; each pick is then built by its own
**Fable-5 xhigh subagent** as a full ADR-075 working variant (real data, real
`move_to`, live behind the DEV toggle).

**Who builds this:** 3 × Fable-5 **xhigh** subagents, one direction each
(human routing call, 2026-07-06). Confidence: (100% Fable — illustration
judgment is the whole task.)

**Shared constraints (every direction):**

- **Medium:** CSS + inline SVG only (the ADR-144 no-asset-pipeline lock) — but
  *ambitious* SVG: terrain shapes, building silhouettes, brushed paths,
  filters; never `<img>`.
- **The Andon bimetal** (ui-design.md §1–2): silver = state/labels, gold =
  value/keylines, shu spent on you-are-here/danger only.
- **Navigation contract** (§5.11): every node reachable by click (`move_to`),
  danger ring gated-with-reason, fog-of-war for undiscovered ground
  (reveal-as-plot — never spoil), the two-section Map tab (the where-you-are
  flavour card stays; the human also wants the tab **two-column**: card |
  map).
- **Evolution:** the map must have a STORY over the run — (a) tier growth
  (T0 estate → T1+ the world widens), (b) estate stages U0→U4 visibly
  repairing/adding buildings, (c) unlock reveals (rooms reopening, new nodes).
- **Legibility (TST4):** what's where (labour, foes, people) readable per
  node; who stands where; where you are.

---

## The 10 directions

### 1 · 絵図 Ezu — the period survey plan
A hand-surveyed Edo estate plan, top-down: paddies as irregular gold-keylined
parcels, buildings as roofed footprints with kanji seals, roads as brushed
paths, a north mark. Improvements literally REDRAW the sheet (U1 shores the
kura roof-line; U3's granary adds a new footprint; reopened rooms gain their
kanji seal). Tier growth: the sheet gains a pasted margin — the survey extends.
Fog: unsurveyed ground is blank sheet with a faint "未測" (unsurveyed) wash.
*Risk: parcel art in SVG needs taste but is very buildable.*

### 2 · Yamato-e bird's-eye with kasumi clouds
The classic painted oblique view: buildings in simple axonometric line-art,
paths receding into the hills — and **gold kasumi cloud-bands mask everything
unrevealed**, parting as you unlock (the period fog-of-war device). Estate
stages swap building art states (broken → shored → prosperous). Tier growth =
the clouds recede further. *The most "real illustration" feel; the most
drawing work.*

### 3 · Sumi-e living terrain
Terrain-first ink painting: layered SVG brush strokes for hills, flat washes
for paddies, the satoyama treeline in receding bands; nodes are small
vignettes ON the terrain. **The palette shifts with the season** (spring/
summer/autumn/winter grades) and the estate stage (bare → tended). Danger
reads as the forest literally darkening. *Atmospheric; node markers must stay
crisp against painterly ground.*

### 4 · The model board (shōgi-ban diorama)
The estate as a tabletop model: a steel board with raised plate TILES per
area (subtle CSS 3D), buildings as extruded silhouettes, and **pieces (koma)
standing where people stand** — your piece at you-are-here, walking animates
it along the road. Improvements upgrade a tile's material (rough steel →
gold-trimmed). *Uniquely good at "whom"; the most game-boardy.*

### 5 · The layered map-case (tier sheets)
The map is explicitly a STACK of sheets: T0 is the estate sheet; each
ascension ADDS a sheet extending the world (village, region), and you can
peel/flip between them. Within a sheet, unlocks stamp in as red seals; estate
stages re-ink the T0 sheet. *Makes tier growth the hero; in-tier illustration
is whatever sheet style we pair it with.*

### 6 · Cadastral kokudaka map (map + register hybrid)
Half drawn parcels, half ledger: each parcel carries its koku/yield
annotation and work marks (what labour lives there); people pinned as
name-chips on their parcel. Improvements annotate in red seal-script in the
margin. Deeply period (the kenchi survey registers). *Strong "what's where"
information design; less romantic.*

### 7 · Dōchūzu road panorama, done properly
A continuous painted ROAD BAND (Tōkaidō-print style): the road runs left→
right with real landmark illustrations at each station, branches forking
vertically; you scroll along it, you-are-here as the walking figure.
Tier growth extends the road rightward into new country. *Beautiful for
journeys; adjacency reads linearly, which fights the estate's hub shape.*

### 8 · The lantern map (Andon fog-of-war) ★ the most Andon-native
The WHOLE estate exists as a dark etched steel plate — and **every visited
node is a pool of warm lamplight** (radial gold) revealing the drawn detail
beneath; unexplored ground shows only faint etched silhouettes in the dark.
Improvements literally brighten their building's lamp; the danger ring sits
at the light's edge. Tier growth = new dark plate beyond the lit ground.
*The strongest thematic fit (Andon = lantern); night-only mood is the risk.*

### 9 · Kamon medallion map (heraldic inlay)
Each area a circular engraved MEDALLION (a real little scene: paddies,
woodlot, gate) connected by damascened road inlays; medallions gain
embellishment rings as their area improves; people as small crest-pips on
their medallion. *Bimetal-native and crisp; "illustrated" at medallion scale
rather than terrain scale.*

### 10 · Orihon folding album (seasonal panels)
An accordion-folded album: each area is ONE painted panel in the current
season; physical panel adjacency = map adjacency; walking re-centres the
fold. Panels get visibly repainted as improvements land (the album is the
estate's biography). *Charming, tactile; panel-adjacency limits complex road
graphs.*

---

## What happens after the pick

1. The human names 3 directions (+ any tunes).
2. Three **Fable-5 xhigh** subagents build them in parallel as FULL ADR-075
   variants (`map-h/i/j`): real `MapNavCtx` data, real `move_to`, fog +
   danger gating, DEV-toggle live, routing tests each.
3. The Map tab goes **two-column** (flavour card | map) as shared groundwork.
4. The human picks live; B/G + the losers strip; HR-7 closes.

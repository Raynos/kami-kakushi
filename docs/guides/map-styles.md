# Map styles — scale classes and designing new tier sheets

**A living guide** (forward design language). [`map-spec.md`](map-spec.md) is
the locked corpus for the T0/T1 sheets that exist;
[`map-authoring.md`](map-authoring.md) is how to build; THIS doc is what the
NEXT sheets should be — the scale grammar that keeps a T2 valley sheet, a T4
town plan, and a T5 province map feeling like one game while drawing like
three different documents. World facts here are derived from the story bible
([`03-tiers.md`](../story-bible/03-tiers.md) · [`05-world.md`](../story-bible/05-world.md));
the bible wins every disagreement.

## §1 · Scale classes — a different map style per zoom level

The overworld≠zone principle, grounded in real Edo cartography: each zoom
level is a **different period document genre**, with its own primitive
vocabulary, label density, and honesty rules. The fiction carries it — every
sheet is a survey the HOUSE plausibly owns or commissions.

| class | period genre | tiers | one line |
|---|---|---|---|
| **estate survey** | mura-ezu 村絵図 | T0 · T1 | the holding drawn field-by-field: buildings as roof pictograms, paddies as washed blocks, every ditch drawn |
| **valley sheet** | mura-ezu, wide | T2 (Valley) | the same idiom pulled back: the VILLAGE joins the frame, whole compounds become single pictograms, fields become pattern masses |
| **route map** | dōchūzu 道中図 | T3 (Region) | the ROAD is the spine: a ribbon of stations, temple country, river crossings — distance notes between nodes, terrain as banded scenery either side |
| **town plan** | machi-ezu 町絵図 | T4 (Castle-town) | block grid, moat rings, ward labels; the castle is the one great pictogram; individual houses vanish into block tone |
| **province sheet** | kuniezu 国絵図 | T5 (Domain) | ground masses + route lines + castellan NODES; a whole valley is a dot with a name; rice yields as notes, not fields |
| **city cut-sheet** | kiriezu 切絵図 | T6 (Edo) | the metropolis as ward pages: dense named blocks, daimyō compounds as crested rectangles, the house's world shrunk to one address |

Class boundaries are honesty boundaries: a mura-ezu draws every ditch it
claims; a kuniezu NAMES what it cannot draw. Never mix registers on one sheet
(a province map with individual trees reads as noise, not richness).

## §2 · One world, several projections

The one-geography law (spec §0) generalizes across scales:

- **Within a scale class** — one master layout in shared world units; finer
  sheets are viewBox crops. This is literal today: `T0_WINDOW` crops T1's
  `WORLD`. The T2 valley sheet should EXTEND the same master (grow
  `layout.ts`'s world or wrap it in a larger valley frame with the current
  WORLD as a region) so T0 ⊂ T1 ⊂ T2 stays a mathematical fact.
- **Across scale classes** — coordinates do NOT carry; **anchors** do. Keep a
  small named registry (the river + its N→S flow, the estate, the village,
  the temple country NW, the next valley E, the han's castle town, the packet
  road) whose RELATIVE geography must agree on every sheet that shows them.
  A route map bends distances (that's the genre); it may never put the temple
  country downstream.
- **The demotion rule** — each zoom-out demotes last tier's whole world to
  one glyph: the estate = a compound pictogram on T2 · the valley = a named
  station-dot on T3 · the han = a bordered mass on T5's neighbours. Demotion
  is the reward structure: the player has WALKED that dot, and knows how much
  world a dot hides. (Its inverse is T0's own trick — the ruin looming 5×
  the lived house. Scale-shock is this game's cartographic voice.)

## §3 · What carries across every class (the family resemblance)

Whatever the class, a kami-kakushi sheet keeps:

- **The look**: aizuri-night — silver ink + gold work on steel, shu for the
  reviser; Andon tokens only; brush-alive strokes (L2 ladder); paper
  furniture (cartouche, 凡例 legend, scale bar, north, creases). One
  substrate across classes — zoom levels differ by GRAMMAR, not palette.
- **The document fiction**: every sheet is commissioned/annotated by someone
  in the story (T0: the family's own survey · T1: the R7 re-survey in
  reviser's red · a T3 route map might be a bought commercial print the house
  annotates). The fiction decides what the sheet honestly knows (TST3).
- **The wrong things**: every sheet carries visible unexplained details
  seeding later tiers, deliberately OUTSIDE the legend (G12).
- **The engine**: seeded primitives, one master layout per class, TIER_DELTA
  state, the golden pin, the blind-pass rubric. New classes add vocabulary
  modules (e.g. `routes.ts`, `town.ts`) — they never fork the laws.

## §4 · The new-sheet process (locked flow — human, 2026-07-08)

**Spec → HR read → build.** The spec is the taste-heavy artifact; drawing to
a signed spec is safe for any model (map-authoring §6).

1. **Read the bible tier sheet** (`docs/story-bible/tiers/tN.md` + 05-world)
   and this doc's class row. Decide: extend an existing master layout
   (same class) or found a new class (new master + vocabulary)?
2. **Write the spec** — a new numbered section IN [`map-spec.md`](map-spec.md)
   (it's the living corpus; split per class only if it outgrows its budget):
   master truths (the §0 idiom) · zone-by-zone table (position · drawn form ·
   the wrong thing) · look deltas vs the class default · **a blind-reader
   rubric** (M/S lines) — what a cold reader MUST recover. Rubric lines are
   the spec's teeth; write them first.
3. **Queue the HR-item** (`project/human-in-the-loop/review.md`) + reading
   queue; the human reads the SPEC (cheap to fix) before any drawing.
4. **Build** per [`map-authoring.md`](map-authoring.md): layout data →
   primitives → ground composition → pin → the blind-pass loop against the
   NEW rubric until all M + ≥half S.
5. **A new sheet class is a new major UI surface** — ADR-075 diverge applies
   to its look (2–3 working variants behind the DEV toggle; the substrate A/B
   of s115 is the precedent). A same-class extension (T2) is not a restyle
   and needs no diverge.

## §5 · Per-tier direction sketches (starting points, not specs)

- **T2 · Valley (mura-ezu, wide).** The frame grows to the valley: the
  village street with its named houses SOUTH down the river, terraced flanks,
  the estate now one walled compound pictogram (its interior detail retired
  to the T0/T1 sheets), the ruin still the largest single footprint in the
  valley — now visibly so against the village's scale. New vocabulary:
  village block, street, shrine/temple glyphs, bridge row. The reveal
  mechanism carries (the survey extends as the tier's story walks it).
  `ruinRevealed` (TIER_DELTA) exists for this tier's honesty flip.
- **T3 · Region (dōchūzu).** Rotate the reading: the packet road NW becomes
  the sheet's spine, drawn as a ribbon with stations (the post town, the
  temple country, fords, a barrier). Distances as period notes (里); terrain
  demotes to banded scenery either side of the road. First sheet the house
  plausibly BUYS rather than surveys — printed grammar, hand annotations.
- **T4 · Castle-town (machi-ezu).** Block grid inside moat rings; ward
  chips; the castle pictogram anchors north; the house's town lodging is one
  named rectangle in a merchant ward. Density does the storytelling: the
  player's whole T0 world would fit inside one block.
- **T5 · Domain (kuniezu).** The province: han borders, mountains as massed
  profile bands, rivers as the only drawn lines, castle towns as crested
  nodes, routes as dotted threads with 里 counts. The valley is a dot. Yields
  and obligations as red survey notes — the sheet reads as the *paperwork of
  power*, which is T5's story register.
- **T6 · Edo (kiriezu).** A ward cut-sheet: dense named blocks, daimyō
  compounds with crests, temple grounds, the bay. The family's presence: one
  address chip. The scale-shock inverts T0 — from owning the biggest ruin in
  a valley to renting a sliver of the biggest city on earth.

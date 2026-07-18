# estate-sheet — the E1 okoshi-ezu cutaway (standalone prototype)

**A graphics exploration (E1 of
[`fable-2026-07-08-graphics-explorations.md`](../../../docs/plans/fable-2026-07-08-graphics-explorations.md)),
NOT part of the map-sheets system** (human, 2026-07-08): a brand-new
parallel experiment that REUSES some of that module's code (`brush.ts`,
`geom.ts` — the seeded ink toolkit) but does not extend its spec
(`map-spec.md`), its scale-class registry (`map-styles.md`), its master
layout, or its golden pin. This README is the experiment's whole spec:
the document fiction, the room truths, the re-ink grammar, and the
blind-reader rubric its captures are judged against. ~~Prototype-first
law: DEV-menu only, fixture-fed, zero game integration~~ →
**SHIPPED (2026-07-13 fold-in): the sheet is the Estate 家 tab's
variant A**, painted over live state (`from-state.ts`); the
fixture-era DEV demo door retired 2026-07-18 (craft pass 3d, TST1 —
one home). Review: **HR-30** (`estate-house` row); HR-16 closed
"needs more work", answered by the 2026-07-18 craft pass (see
"Craft pass" below).

The module ships **2 working look variants** (ADR-075 diverge,
capped at 2 by the human 2026-07-08) — see "The variant fork" below.

World facts derive from the story bible
([`05-world.md`](../../../docs/story-bible/05-world.md) "The estate
anatomy"); the bible wins every disagreement.

## What the sheet is

The first house-scale drawing in the game: the period genre is the
**okoshi-ezu 起こし絵図**, the carpenter's fold-up plan — floor plan and
wall elevations drawn on one sheet so the paper can be cut and folded
into a standing model of the building. Intended home (if it survives
the human's keep/kill ruling): the Estate tab's centerpiece at R1.

## Master truths (H-lines)

- **H1 · The document fiction.** This is the household's own **repair
  sheet**: the joiner's fold-up plan of the lived compound, kept in the
  kura and re-inked each season the house repairs (REPAIR is the
  world's first-class verb; the Estate tab is where repairs live). It
  is drawn NOW (R1 era), by hands that believe the lie: the cartouche
  names the building **母屋 — "the main house."** It is NOT the old-era
  compound plan (that document — the one naming this house *guest
  quarters* — is found in the kura at T2 and must not be spoiled here).
- **H2 · One winged residence.** The house reads as ONE building: a
  central body with EAST and WEST wings and a joining corridor; the
  kitchen threshold on the WEST flank (facing the paddies); the formal
  south front facing the gate across the forecourt. Around it, its
  yards: kura NE (fire-gapped), woodshed SW, Sōan's sickroom lean-to
  off the outer court SW, the drill yard — the old stable court — on
  the EAST flank inside the walls.
- **H3 · The compression is the wrongness.** An entire estate's
  functions live compressed into a guest residence, and the sheet
  shows it without saying it: the steward's board and day-book drawn
  IN the kitchen · the shrine alcove sitting in a CORRIDOR joining the
  wings · a stable range with stall divisions for twenty horses
  holding one mule. Every room is a size too grand or a purpose too
  doubled for the household living in it.
- **H4 · The ruin looms at interior scale.** Beyond the north wall the
  old precinct's remains — standing wall stretches, the crumbled great
  gate, fallen roof masses — are drawn AT THE SAME SCALE as the rooms:
  the scale-shock trick brought indoors. The lived house's tallest
  ridge reaches perhaps half the ghosted line of the old gate. Honesty
  rule: depicted, never honestly named — the backdrop carries at most
  a curt 廃 note, and the mystery stays outside any legend.
- **H5 · State re-inks; geometry never moves.** The sheet is fed by
  estate state and answers it in INK, not layout: repaired members and
  new boards in fresh GOLD work · opened rooms gain their interior
  marks · closed rooms wear shutter marks drawn like an open room kept
  (the West wing law) · the reviser's SHU strikes what a repair
  replaced and stamps 新 on what a season added · `ruinRevealed` (the
  T2 seam) swaps the labels' honesty — 母屋 → **客殿 "guest house"**,
  the backdrop gaining its true name 本邸 — with no geometry change.
  The room the player repairs is the room that re-inks: the same fact
  drives the action and the drawing (AC-6 at the ink layer).

## Room by room (position · elevation form · the wrong thing)

The T0-era (R1) state draws the OUTER house open and the inner wings
present but closed; the T1 arc opens and re-inks them (H5). Fields
stay off this sheet (they are the survey sheets' ground; here at most
a paddy edge past the west yard line).

| Part | Place | Elevation form + wrong thing |
|---|---|---|
| Gate & gateyard 門 | S wall | roofed house-gate in elevation: gatehouse roof, flanking wall run, worn threshold; the stall ground beside it empty |
| Forecourt 庭 | inside the gate | swept ground band with the well ring; rake arcs; drawn WIDER than the front it serves |
| Main body + corridor | centre | the winged residence: post-and-beam rhythm, engawa line, the joining corridor legible; the shrine alcove marked IN the corridor (an altar niche where a hallway is) |
| Kitchen & board 竈 | W flank | threshold step, hearth smoke, the board: a writing desk + ledger hooks drawn inside a KITCHEN — the steward's room that isn't |
| East wing | E of centre | T0: closed face, shutter marks. T1 arc: opened — family rooms, fresh-gold roof (rebuilt) |
| West wing | W of centre | drawn CLOSED but kept: shutter marks, swept sill, no ruin-ink ever (Katsuhide's things; kept like an open room) |
| Toku's room · Shoin | inner, N end | T0 closed; T1: Toku's room opens plain; the Shoin last — fresh boards, the register's shelf |
| Kura 蔵 | NE corner | white-plaster body (lighter fill) with heavy roof; fire-gap drawn as honest empty ken between it and the house |
| Woodshed 薪 | SW corner | small solid roof mass; split stack |
| Sōan's sickroom 薬 | lean-to, outer court SW | a lean-to profile against the compound edge; medicine shelf tick |
| Drill yard / stable court 稽 | E flank, in the walls | the long stable range in elevation: MANY stall divisions, a rack, raked ground — one mule drawn in twenty horses' housing |
| The ruin backdrop 廃 | beyond the N wall | the precinct's remains at the SAME ken scale: standing wall stretches, the crumbled great gate's mass, fallen roof planes, grass breach — towering past the lived ridge; roped line at the wall |

## Look

The map-sheets AA bar carries wherever it applies (aizuri-night
substrate, silver/gold/shu on Andon tokens, brush-alive tapered
strokes, paper furniture) — same hand, different genre. What this
class changes:

- **Elevation grammar, not plan grammar.** Posts, beams, roof
  profiles, wall faces; the ken grid 間 as the module (a period scale
  bar in ken; tatami-count notes on rooms). Buildings are FACES seen
  from the yard, not roofs seen from above.
- **Ink states are the content.** Fresh gold = this season's work ·
  silver = the standing old fabric · shu = strikes and 新 stamps ·
  shutter marks = closed-but-kept · ash wash + breach = the backdrop
  only. The sheet must read as a WORKING document mid-revision.
- **Furniture at house scale.** Cartouche (母屋起絵図 + the hanko),
  ken scale bar, a small 凡例 decoding repair marks only (新 · 改 ·
  closed); the ruin and the alcove-in-a-corridor stay OUTSIDE it.

## The variant fork (the capped diverge)

Two WORKING variants behind the DEV toggle; a third only if these two
converge:

- **A · Fold-up okoshi-ezu.** The floor plan at the sheet's centre
  (rooms as tatami-gridded blocks); wall and roof ELEVATIONS hinged
  flat off the plan's edges as an unfolded paper model, with fold tabs
  and hinge dashes; the ruin as an un-folded backdrop elevation pinned
  along the north edge, taller than any folded wall. Truest to the
  genre; the riskier read.
- **B · Flat section-cut.** One long south-facing section-elevation:
  the house cut open like a dollhouse — rooms in a row, roof profile
  above, ground line below, yards flanking; the ruin's elevation
  rising behind at the same scale. Reads at a glance; the more
  pictorial document.

## The blind-reader rubric (E-lines — the pass bar)

A fresh agent given ONLY a screenshot set must recover these. **M** =
must-say (fail the iteration if missed) · **S** = should-say. Written
before any drawing; these are the spec's teeth.

- **E1 M** — an architectural sheet of ONE pre-modern Japanese
  residence — a carpenter's/fold-up plan or section-elevation, drawn
  by hand in a period idiom; NOT a game diagram, NOT a modern
  blueprint.
- **E2 M** — one winged house: a central body with two wings and a
  joining corridor; a kitchen/service edge on one flank; a formal gate
  side with a forecourt and well.
- **E3 M** — at least one "too grand / doubled purpose" wrongness
  read cold: a writing board in the kitchen, an altar niche in a
  corridor, or a stable court for many horses holding one animal —
  the reader senses the household is smaller than its house.
- **E4 M** — something far larger looms behind/beyond the house AT
  THE SAME SCALE — ruined walls and a great gate out-massing the lived
  roofs; the reader says the house is small against an older, greater
  structure (not merely "a ruin is nearby").
- **E5 M** — repair state is legible: some members fresh/new against
  old fabric, something struck or stamped by a reviser, at least one
  part closed/shuttered — a document of work in progress, not a
  finished showpiece.
- **E6 S** — the document fiction reads: variant A's fold-up
  paper-model conventions (tabs, hinges) or variant B's cut-plane; ken
  scale bar and tatami counts noticed.
- **E7 S** — room identities recoverable from marks alone: kitchen by
  hearth/smoke, kura by white plaster + fire gap, the lean-to
  sickroom, the stall divisions.
- **E8 S** — the honesty rule: the looming structure is drawn but
  never honestly named; the strange details stay outside the legend.
- **E9 S** — quality read: brush-alive strokes, an "illustrated
  building," zoom pays craft — NOT CAD lines, NOT floating labels,
  NOT AI-slop.

Iteration loop: capture → one fresh blind-describe agent per variant →
a judge scores THESE E-lines → fix → repeat until all **M** pass and
≥ half of **S** on the picked variant.

## Craft pass (2026-07-18 — the HR-30 ✘s, rulings locked with the human)

Deltas beside the rules they refine (plan:
`docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md`; baseline +
after reports in `project/audit/reports/`):

- **One closed convention (TST4, refines H5's shutter law).** Plan
  rooms shutter with the SAME vertical-board + tie marks the wall
  faces use — the old 45° plan-hatch was a second convention the
  凡例 never decoded (blind readers called it "mothballed").
- **The 凡例 is APP furniture now (P2).** Variant A no longer draws
  the in-sheet legend box; the decoder is an Andon strip beside the
  drawing (`render/estate.ts legendStrip`, marks still brush-drawn),
  legible at every width. Sheet B keeps its own in-sheet legend
  (unreviewed under HR-30 — additive-only law). The diegetic
  cartouche + ken bar stay ON the document (H1 needs the 母屋 lie
  told by the sheet itself).
- **Tap-to-maximize (P20, ruling R2).** The inline sheet is a
  fit-width preview; an advertised ⛶ study chip (and the preview
  itself) opens a full-viewport blow-up on the ONE shared
  sheet-viewer engine (`map-sheets/viewer.ts` — pan/zoom/pinch),
  the live map's maximize idiom (normal stacking, capture overlay
  safe).

## Module shape

- `fixture.ts` — the static estate-state fixture (room
  open/closed/repaired states + `ruinRevealed`); the demo ships a
  T0-R1 state and a T1-R7 state toggle to PROVE the H5 re-ink grammar.
  The fixture is the ONLY data source — no game imports.
- `elevation.ts` — the new drawing vocabulary (wallFace, roofProfile,
  tatamiPlan, shutterMarks, foldTab, stallRange…), each
  `(parent, …geometry, o: XxxOpts)` per the brush.ts idiom.
- `sheet-a.ts` / `sheet-b.ts` — the two variant compositions.
- `demo.ts` — the DEV mount (variant switch + state toggle).
- `golden.test.ts` + `golden.hash.json` — this module's own pin
  (separate from the map-sheets pin), frozen once a look is kept.

Laws inherited from the shared graphics-exploration rules (the plan's
header): seeded determinism (`rng(seed)` only), Andon tokens only,
taste-scorecard two-pass, pin once kept, blind-pass before "done".

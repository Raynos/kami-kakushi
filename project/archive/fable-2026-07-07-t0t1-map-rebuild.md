# T0/T1 review-map rebuild — audit + plan

**Status:** ✅ DONE — authored 2026-07-07 (s112), completed s112–s115:
rebuilt on one geography, three blind passes (all M-lines green), HR-12
PASSED (ADR-151), the 17-capture drain landed, rung-reveal mechanism +
golden pin + Phase C hardening shipped. The companion SPEC stays active
as the standing verification corpus.
**Confidence:** ( 40% Opus, 60% Fable ) — canon fidelity + art judgment
dominate; drawing code is mechanical once the spec exists.
**Who builds this — Fable or Opus?** This session (Fable 5) builds it:
the work is spec-driven composition against a written rubric with an
automated verification loop (blind-describe agents), which bounds the
judgment risk; no engine/core surface is touched (DEV fold only).
**The spec/corpus:** [`docs/guides/map-spec.md`](../../docs/guides/map-spec.md)
(graduated from `docs/plans/fable-2026-07-07-t0t1-map-spec.md` to a
living guide, 2026-07-08).

The human steer (2026-07-07): audit the two DEV reference maps
(`dev-t0v2-map.ts` — T0 V2 + T1) against the story-bible world vision via
screenshots + blind independent description; then rebuild both at AA
quality, spatially/logically coherent, composed from drawing primitives
instead of inline code.

## 1 · Audit findings

Method: headless captures (fit + quadrants + deep zoom →
`project/audit/screens/2026-07-07-t0t1-map-audit/`), then four fresh
isolated agents — per map, one world-reader given ONLY the images, one
art-director critique. Findings converged:

**Canon / spatial (the maps don't match the world vision):**
- **The buried truth is invisible (both sheets).** Nobody reading the
  sheets can tell the lived-in house sits in the CORNER of the old
  precinct's ground (bible G4/G5): T0's blind reader concluded "a branch
  family's dead house up the hill"; T1's read "one walled mansion
  compound." The core twist geography — the single most important thing
  the maps exist to seed — does not land.
- **T1 mis-assigns the wings (canon error).** The T1 sheet draws East
  wing / West wing / Inner garden / Shoin as buildings of the precinct's
  great hall. Per the bible (05-world "estate anatomy"; t1.md "the
  wings") they are the GUEST HOUSE's interior arc; the ruin stays locked
  scenery until T2's reveal.
- **T0/T1 disagree spatially.** Same world, two layouts: the drill yard
  moves SE-outside (T0) → SW-inside (T1); the compound geometry shifts.
  T1 must be T0 revealed, never rearranged.
- **The water works are asserted, not drawn.** No channel from weir to
  paddies on either sheet ("the one stroke that would make the weir
  matter" — blind reader); no bridge/ford to Matsuzō's side; three weir
  zones read interchangeable on T1.
- **Floating zones.** T0 drill yard + night rounds are labels on empty
  ground; field margins anchor to dots, not to the fields they margin.
- **No bounds, no scale, no destinations, no legend** — the title claims
  領内 (within the holding) and the sheet never draws the holding; roads
  exit to nothing; the 戦/人/怪/新 grammar is never decoded.
- **Drawable wrong-things are missing.** Boundary stones far beyond the
  worked rows, the oversized forecourt, the stable court for twenty
  horses, courtyard-row orchard alignment, ghost bunds of the old
  fields, the numbered terrace stones, the swept stoneless grave plot,
  the garden gate opening on the ruin — all bible-canon, all visual, all
  absent.

**Graphic quality (both art critics, independently):** "indie-passable
information design wrapped around amateur illustration — the
illustration layer is essentially absent." One stroke weight everywhere
(CAD, not brush); wireframe buildings; ruin as a line-style, not a
depiction; stamped identical tree glyphs; no wash/texture layer; zoom
punishes instead of rewarding; labels float on void; the flat dark
ground reads as dark-mode app, not a night survey sheet. What works and
must survive: the seal-chip label grammar, the 凡例-able mark system,
the vertical title cartouche, the palette discipline (gold structure /
red danger).

**Code structure:** `dev-t0v2-map.ts` is 3,557 lines; `paintT0Ground`
(~570 lines) and `paintT1Ground` (~1,050 lines) are inline one-off
drawing with hand-placed magic coordinates. Only five tiny primitives
exist (scrawl/stroke/tree/building/hachure). There is no vocabulary for
water, fields, walls, gates, ruins, ground washes, or furniture — so
the two sheets can't share a geography and every fix is bespoke.

## 2 · The build

1. **Primitives library** `src/ui/map-sheets/` (DEV fold) — the toolkit
   per spec §4: brush / terrain / water / fields / flora / built /
   furniture, all seeded-deterministic, parameterized, reusable.
2. **The one geography** — `layout.ts`: every anchor in shared world
   units; the T0 sheet is a viewBox window of the T1 world (spec §0).
3. **Sheet compositions** — `t0-sheet.ts` / `t1-sheet.ts` as thin
   layout-data → primitive-call passes; extract the modal shell
   (pan/zoom/roster/detail/night-rail) from `dev-t0v2-map.ts` and keep
   the zone roster/detail data verbatim (it is bible-distilled and
   already correct).
4. **Wire the DEV Story-tab buttons** to the new sheets; retire the old
   painters (git keeps them).
5. **Verification loop** (spec §5): capture → fresh blind-describe per
   sheet → judge scores the rubric → iterate until all M-lines pass and
   ≥ half of S-lines. Art-critic re-run for the quality delta.
6. **HR-item** for the human: review both sheets live in the DEV panel;
   Pass-2 taste scorecard attached.

## 3 · Taste Pass-1 constraint brief (FB-10 / ADR-135)

- **TST1 (one home):** one primitive per drawing idiom — no per-sheet
  forks of trees/water/walls; one master layout both sheets read;
  roster data stays the one bible-distilled copy.
- **TST2 (solid ground):** deterministic seeded rendering — every open
  paints the identical sheet; pan/zoom never rebuilds mid-gesture;
  selection/detail panes patch in place.
- **TST3 (fiction causes mechanics):** every mark has a story reason —
  the reviser's red records the tier's events; wrong-things are drawn
  where canon puts them; the legend decodes the survey's own system and
  stays silent about the mysteries; the ruin shows no new work in T1.
- **TST4 (never guess state):** flow direction, built-vs-ruined,
  new-this-tier (新/fresh ink), danger (戦), and folk presence readable
  at a glance; contrast floor ≥ ~35% on load-bearing lines; a legend +
  scale bar on-sheet.
- **ui-design.md:** all colour via the Andon Steel tokens; no raster
  texture/grain (washes are flat token fills; texture is STROKE-based);
  no pure #000/#FFF; shu spent only on the reviser's red (danger/
  revision); square corners; type stacks per §3.

## 4 · Surfaced fork (async override, not blocking)

**Substrate: indigo-night vs warm washi.** Both art critics independently
said the flat dark ground is the #1 credibility problem and named two
honest exits: (a) commit to the night sheet (aizuri-e indigo — layered
washes, lamplit vignette, high-contrast silver ink) or (b) warm
cream-paper ezu (period-canonical, highest contrast — but off the Andon
Steel grounds and against ui-design.md §9's "void/steel grounds only,
DEV included"). **Self-picked default: (a)**, executed with full
commitment — it stays on-palette and the review artifact lives inside
the dark game. If the human prefers (b) for these sheets, it is a
palette-table swap in one place (`layout.ts` ground tokens), not a
redraw.

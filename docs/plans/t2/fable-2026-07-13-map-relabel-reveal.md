# The T2 map re-label reveal needs a flag-driven label shape (parked)

**Status:** PARKED (2026-07-13, session-187 — parked until the T2
build; human-ruled "park to T2 planning" in the 2026-07-13 finding
walk)
**Confidence:** ( 60% Opus, 40% Fable ) — the data shape is engine
work (Opus); the reveal moment itself is a signature story beat whose
delivery deserves Fable eyes at build time.
**Template:** build

## Who builds this — Fable or Opus?

Decided at unpark. The label-override shape is mechanical; the reveal
staging (one quiet log line, the map redrawing under the player, TST2)
is exactly the kind of moment the taste values exist for — route the
delivery with the human then.

## Why

**ADR-157 (2)** locks the T2 reveal's delivery: mid-T2, at the third
signal's scene end, the map redraws two labels — *Main house → Guest
house; the ruin → the Main house* — one log line in the day-book's
voice, no ceremony. The ADR said the **data shape** "should land now
so the sheet-map work (ADR-151) can carry it". That window was missed:
neither `MapNode` (`src/core/content/map.ts`) nor `SheetNode`
(`src/ui/map-sheets/nodes.ts`) has any rename/alias field; T2 support
instead **duplicates the whole roster** (`nodes.ts:764`, `rosterFor()`
swaps wholesale).

The catch the sweep surfaced: a per-*tier* roster swap keys on tier
number, but the reveal is a **mid-tier flip keyed on a story flag** —
as built, the beat cannot ship. The human ruled: park the shape
question to T2 planning (2026-07-13 walk, M2). Evidence:
`project/archive/opus-2026-07-12-adr-embedded-work.md` (M2).

## What exists today

**Survey date: 2026-07-13 (session-187), source-verified.**

- `src/ui/map-sheets/nodes.ts:764` — `rosterFor(tier)` returns a
  wholly separate node list per tier; no per-node label override.
- `src/core/content/map.ts` — `MapNode` has no alias/rename field.
- `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md` (greenlit,
  mechanics-only) notes the "§6.2 `ruinRevealed` honesty re-label" as
  a SEPARATE concern — this plan is that separate home.
- All map work is bound to the map-sheets system (golden pin +
  blind-pass laws) — the shape change lands through the `map-sheets`
  skill, never freehand.

## Steps

At unpark (T2 planning), decide the shape first, then build:

1. **Pick the mechanism** — a per-node label-override keyed on a story
   flag (favoured: labels flip in place, TST2-clean) vs a third
   flag-selected roster variant (favoured only if overrides prove
   invasive). Record the pick as the ADR-157 follow-up ADR.
2. **Land the shape** through the map-sheets system (roster↔layout
   integrity test must cover the flipped labels; regenerate the golden
   pin deliberately if the committed look changes).
3. **Wire the reveal:** the third signal's scene end sets the flag;
   the map redraws; one day-book log line (fiction-voiced → ADR-139
   3-take diverge at build time).
4. **Blind-pass** the changed sheet (`map-blind-pass` workflow) before
   calling it done.

## Verification

Owed at unpark: a RED-able test that the flag flips exactly the two
labels (and nothing else re-renders — TST2); the map-spec blind-pass
rubric on the changed sheet; a live drive of the scene-end → redraw
moment (PH6). This plan parked: template + deferred-work gates green.

## Sync ripple

- **PRD:** none now — the reveal ripples with the T2 build.
- **Story-bible:** none now — `tiers/t2.md` already carries the
  staged reveal; this plan is its mechanism.
- **Living docs / registries:** none while parked.
- **CHANGELOG:** none.

## Human-in-the-loop

- Nothing now (ruled 2026-07-13). At unpark: the reveal's log line is
  an ADR-139 diverge; the sheet change may warrant an HR look if the
  committed pin changes.

## Non-goals

- **Not blessing duplicate-roster as final** — the human chose to
  decide at T2 planning, not now.
- **Not touching the t2-rungs-fog plan's scope** — fog/reveal
  mechanics land there; only the label shape lives here.

## Risks

- **Staleness at unpark:** re-verify `nodes.ts`/`map.ts` shapes
  against the tree (PH2) — the sheet system is actively worked.
- **Roster duplication compounds:** every new tier sheet built before
  this lands adds another wholesale roster copy — if T3+ sheet work
  starts first, revisit whether the shape should land earlier than T2
  planning assumed.

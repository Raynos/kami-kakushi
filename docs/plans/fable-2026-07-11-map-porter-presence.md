# Map travel presence — the porter piece (FB-340 v2, closes HR-26)

**Status:** ▶️ in progress (this Fable session; human-picked 2026-07-11:
porter sculpt, walk + footprints idiom, from the `map-token-presence`
prototype rounds)
**Confidence:** ( 60% Opus, 40% Fable )

**Human decisions (AskUserQuestion, 2026-07-11):** arrival is the porter
settling — the destination press-in ring is DROPPED; the here-seal KEEPS its
shu stroke (far-zoom legibility beside the piece); camera follow KEPT as v1;
build proceeds in this session now that the one-engine extraction (`8a3f83c9`)
has landed.

## Who builds this — Fable or Opus?

Split by phase. Steps 1–4 (palette vars, the porter builder module, the pure
walk-math helper, wiring the resting piece) are mechanical ports from the
committed prototype — Opus-safe. Steps 5–6 (gait sync to the ActionClock,
sizing/tuning the sculpt against the LIVE sheet's bigger seals, the arrival
beat) are look-bearing judgment on the player-facing map — prefer Fable, or
Opus with mandatory screenshot self-review + the blind-pass loop. Doubt favors
Fable.

## The locked design (human, 2026-07-11)

The player's map position is a **physical piece on the survey sheet** — the
根付 boxwood **porter** (bundle high on the back, staff, shu carry-cord),
prototype-proven at
`project/prototypes/map-token-presence/physical-token/index.html`.

- **Indicator, not avatar.** The porter only shows where you are. It is
  display-only, derived from game state; it can never be dragged, clicked, or
  freely moved. The prototype's click-anywhere travel is prototype-only.
- **Real moves animate it.** Clicking a walkable zone's seal on the Map tab is
  already the real `move_to` (sheet-map.ts): when that action starts, the
  porter walks the edge linearly — bob/rock gait, shu **footprints** stamping
  behind it (the human-picked idiom, kept from FB-340 v1) — synced to the
  move's ActionClock fraction so pause / freeze / speed all hold (ADR-148).
- **Scale:** clearly smaller than the zone-seal label, not lost — the
  prototype's 0.82 ratio, re-tuned against the live sheet's 132×78 seals.
- **Placement:** stands just south of the here-zone's seal, never behind the
  label box.

## What exists today (the seam is already built)

- `src/ui/map-variants/sheet-map.ts` — FB-340 v1: resting shu **here-ring** on
  the current zone; `travelPresenceRef` fired by `render.ts` the instant a
  `move_to` starts, with a `sample()` thunk yielding the clock's live
  `{fraction, running}`; the player stamps footprints along the walked edge,
  pans follow, presses in a destination ring; P12 reduced-motion path (no
  footsteps, follow only); P14 (only timed walks animate).
- The porter sculpt + gait, working, in the prototype (commit `6921aac1`).

So this plan **replaces the resting here-ring with the porter piece and makes
the porter the thing that walks** — the driver, the footprints, the follow and
the P12/P14 guards all stay.

## Sequencing

**After** `fable-2026-07-11-map-viewer-one-engine.md` lands — it is actively
rewriting sheet-map.ts's viewer internals; per that plan the travel-presence
chrome stays in sheet-map.ts, which is exactly where this plan works. Don't
edit the same file mid-extraction.

## `src/` implementation

1. **Palette (AC-21 / map law 2 spirit):** the prototype's boxwood hexes
   become tokens in `styles.css` — `--piece-wood-hi/-mid/-lo`, `--piece-carve`
   — used by the sculpt; shu stays `var(--shu)`.
2. **`src/ui/map-variants/porter-token.ts`** — `buildPorter(): {g, setGait}`,
   the sculpt ported from the prototype (defs-safe gradient ids, tokens not
   hexes), plus a **pure** helper module for the walk math (position along the
   edge from `fraction`, gait phase, footprint cadence) — unit-testable with
   no DOM.
3. **Resting state:** on every `renderMapSheet`, mount the porter beside the
   here-zone's anchor (south offset, clear of the seal box). The here seal
   keeps its shu stroke (TST4 — zone state stays readable when zoomed out);
   the old resting here-ring is deleted (TST1 — one home for "you are here").
4. **Travel:** inside the existing presence player, move the porter along the
   walked edge at `sample().fraction` with the gait; footprints keep stamping
   behind it (unchanged code); the destination press-in ring is DELETED — the
   porter settling at the new anchor IS the arrival beat (human call,
   2026-07-11). P12 reduced-motion: no gait, no footsteps — the porter simply
   appears at the destination with the existing follow. Move cancel/fail:
   restore at `from` (the current restore path already exists).
5. **DEV toggle (ADR-075 shape):** presence v1 (ring+footsteps) vs v2 (porter)
   switchable in the DEV panel; **v2 is the prod default** (the human already
   picked it from 11 prototype takes across two rounds — record the pick as an
   ADR); v1 is deleted once the human confirms on the live build, so no
   flag-debt outlives the review.
6. **Tests (could-go-RED):** unit the pure walk-math (fraction→position,
   cadence monotonicity, P12 branch); jsdom-assert the porter mounts at the
   here anchor and moves on a fired presence. The golden pin is untouched
   (map-variants is not hashed) — verify look live instead: headless captures
   resting / mid-walk / arrival, plus a reduced-motion capture.

## PRD update

§ describing the Map tab / travel feedback (FB-340 presence): targeted ripple
via `/prd-ripple` — system/UI change, one paragraph (presence marks → physical
porter piece), then `pnpm run prd:drift`. No balance numbers touched.

## Story-bible update

None — the porter is a piece ON the map artifact (the sheet's fiction is a
survey drawing; the piece is the reader's marker, like the hanko already in
the idiom). No fiction-voiced text is added, so no ADR-139 diverge. If a
flavor line ever names the piece, that line diverges then.

## Landing checklist

- taste-scorecard Pass 1 before step 3, Pass 2 after step 5 (attach to the
  HR-item).
- HR-26 closes with the pick; new HR-item: "porter presence live — confirm v1
  deletion". ADR logged (presence idiom v2). Prototype README: porter ⭐
  POTENTIAL, the other three sculpts REFERENCE.
- `pnpm run verify` green; captures into `project/audit/screens/`.

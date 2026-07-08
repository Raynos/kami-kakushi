# stamp-book/ — the E3 graphics-exploration prototype

The **shuinchō stamp book + ink thread** (concepts #8 ❤️ + #10, folded
together at the 2026-07-08 triage): the run's progression as a pilgrimage
stamp book — one pressed seal per rung ceremony, strung on the run's single
ink-thread brushstroke (knots at crises, thin dry passages through lean
stretches).

**Status: DEV-only prototype, zero game integration** — the prototype-first
law in
[`docs/plans/fable-2026-07-08-graphics-explorations.md`](../../../docs/plans/fable-2026-07-08-graphics-explorations.md)
(E3.3, pulled forward by the human 2026-07-08 as a single lightweight demo:
no spec, no diverge yet). It draws from the STATIC run history in
`fixture.ts` (rung names + crises from the story bible's T0 sheet, dates on
the six-season calendar) — it reads no game state.

- `book.ts` — `openStampBook()`: the full-screen modal + the whole drawing.
  Seeded-deterministic, Andon tokens only, brush primitives reused from
  [`../map-sheets/brush.ts`](../map-sheets/brush.ts). Reads right → left
  (the genre's rule); opens at the cover.
- `fixture.ts` — the fixture run (R0–R7 stamps, thread marks).

Reached via the DEV panel → Story pane → "⤢ Stamp book". Imported ONLY by
`ui/dev.ts`, so it rides the DEV strip fold like the map review sheets.

Later, separately-gated steps (NOT this prototype): the E3.1 spec + stamp
grammar, the home HD-item (Character-tab "Record" panel default), the
ADR-075 diverge, golden pin + blind-pass, and integration (gated on
storywave Plan B).

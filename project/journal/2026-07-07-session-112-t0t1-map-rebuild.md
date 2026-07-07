# Session 112 — 2026-07-07 — T0/T1 map audit + rebuild (spec phase)

**Summary:** Audited the two DEV reference maps (`dev-t0v2-map.ts`) against
the story-bible world vision using headless screenshots + four fresh
isolated agents (per map: a blind world-reader given only the images, and
an art-director critique). All four converged: the sheets are
indie-passable information design over amateur illustration, the core
twist geography (the guest house in the old precinct's corner) is
invisible, T1 mis-assigns the wings to the ruin (canon error), T0/T1
disagree spatially, and the drawing code is ~1,600 lines of inline one-off
painting with no primitive vocabulary. Authored the baseline spec (the
verification corpus with a blind-reader rubric) + the rebuild plan.

## What changed
- `project/audit/screens/2026-07-07-t0t1-map-audit/` — 14 headless
  captures (fit/quadrants/deep-zoom, both sheets) via
  `tmp/map-audit-shots.mjs` (script kept in repo-local tmp/).
- `docs/plans/fable-2026-07-07-t0t1-map-spec.md` — the super-detailed
  baseline: one master geography (T0 = a window of T1's world), zone-by-
  zone drawn forms + visible wrong-things, the AA look bar (L1–L10), the
  primitives contract, and the blind-reader rubric (R1–R18) that gates
  the iteration loop.
- `docs/plans/fable-2026-07-07-t0t1-map-rebuild.md` — audit findings,
  build steps, taste Pass-1 constraint brief, the surfaced substrate fork
  (indigo-night default vs warm washi — human can override async).

## Key findings (the why)
- Blind T0 reader: "a branch family's dead house up the hill" — NOT "the
  living compound sits inside something older and larger." The single
  most important seed the maps exist to plant does not land.
- Blind T1 reader: "one walled mansion compound"; East/West wings + Shoin
  drawn as the PRECINCT hall's — but the bible puts the whole wings arc
  inside the guest house; the ruin stays locked scenery until T2.
- Both critics: one stroke weight (CAD not brush), wireframe buildings,
  ruin-as-line-style, zoom punishes, labels float on void. What survives:
  the seal-chip grammar, the cartouche, the palette discipline.

## Next intended steps
1. Build `src/ui/map-sheets/` primitives (brush/terrain/water/fields/
   flora/built/furniture) + the one master `layout.ts`.
2. Compose `t0-sheet.ts` / `t1-sheet.ts`; wire the DEV Story-tab buttons.
3. Run the loop: capture → fresh blind describe → judge vs rubric →
   iterate until all M-lines pass; art-critic re-run for the delta.
4. HR-item for the live review + Pass-2 scorecard.

## Landmines
- The old painters (`paintT0Ground`/`paintT1Ground`) are retired wholesale
  when the new sheets wire in — git keeps them; don't half-migrate.
- Another agent (w2:p2) is live in this tree on story-bible docs — stage
  only own paths, pathspec commits.

## Build phase (same session, later)

Rebuilt both sheets per the spec. `src/ui/map-sheets/` replaces
`dev-t0v2-map.ts` (deleted, 3,557 lines): `brush.ts` (seeded ink toolkit:
tapered brushStroke, washes, stipple/hatch, wave combs) · six domain
primitive modules (terrain/water/fields/flora/built/furniture — five
authored by a parallel agent fan-out with per-module headless
gallery-screenshot self-iteration; water hand-written after two agent
attempts died) · `layout.ts` (the ONE geography — T0's viewBox is a crop
of T1's world) · `ground.ts` (scene composition, tier deltas: wet/drained
pools, open/closed breach, cold/lit forge, terrace numerals, the
reviser's red) · `sheet.ts` (modal shell; room-scale seals zoom-gate
their captions; art clipped to the sheet border).

Four visual iterations (tmp/iter1–4, headless captures): terrace-slab fix
(steel-hi washes → quiet steel-2), T0 window widened to catch river +
hills, precinct ring OPENED so its footings hand over to the guest
compound's neat wall (the G5 twist drawn), ruin enlarged + interior
wash, gate rubble apron, channel wet-line, boundary stones 1.5×,
west-wing closed veil vs east-wing fresh veil + horizontal red note.

## Next intended steps (build phase)
1. Blind-reader verification vs spec §5 rubric (two fresh agents on
   iter4 shots) → fix any missed M-lines.
2. Final checkpoint: snapshot + push; HR-item for the live DEV-panel
   review + Pass-2 taste scorecard.

## Verification phase (same session, later still)

Two fresh blind readers (images only, no context) scored iter4/iter5:
EVERY must-say rubric line passes on both sheets — T0's reader led with
the twist ("the family now lives behind a tight gold fence in one corner
of their own land"), T1's rebuilt the whole water/build causal chain from
the reviser's red. Their converged craft notes became the final polish
(per-tier legend honesty, shrine seal to the corridor, ditches joining
the paddy grid, kura/plot seal collisions, T0 silver vs T1 gold grave
fence, red at full strength). HR-12 filed for the human's live taste
call; snapshot updated. Iteration closed at iter5.

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

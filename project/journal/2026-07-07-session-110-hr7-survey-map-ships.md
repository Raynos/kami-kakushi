# Session 110 — 2026-07-07 — HR-7 resolved: the 絵図 survey plan ships as THE map

## What the human decided

> "For V7 we approve V7D survey plan."

V7D is the DEV panel's V-tag for `map-h` — **H · 絵図 survey plan** (map is
surface #7 in the variant registry; its 4th entry, A/B/G/**H**, is letter D).
That closes **HR-7** (the FB-102 real-map diverge, narrowed 2026-07-06 to an
H-vs-I final): the survey plan is the estate map.

## What shipped

- **`render.ts` mounts `map-variants/ezu.ts` as the one prod map** — the old
  terse-paths-list default (`moveStrip`/`patchStrip`) is deleted. The sheet is
  a wholesale-but-deterministic SVG paint, so it renders behind a new
  `mapSignature` guard (location · unlocked · conditioning gate · estateStage ·
  PEOPLE presence bits): an idle tick repaints nothing (TST2); the render.test
  churn/identity test holds it.
- **Losing takes stripped (ADR-075 zero flag-debt):** `model-board.ts`,
  `cadastral.ts`, `lantern.ts`, `kamon.ts` deleted; the B/G schematic renderers
  + `renderMapVariant` + the `map` surface group pruned from `dev.ts` (~360
  lines). NOTE: pruning the group renumbers later DEV V-tags (home V8→V7).
- **ezu hit-target fix (found by e2e):** WebKit taps at a node-group's bbox
  centre landed in the seal→caption GAP and the plate rect intercepted — each
  `.ezu-node` now carries an invisible hit rect spanning seal+caption+marks
  (also better for real fingers).
- **Tests moved to the sheet's contract:** render.test map suite rewritten
  (seal click = move_to · locked seal inert + visible reason · 未測 fog stays
  unnamed · title cartouche paints · sig-guard identity); dev.test map-variant
  routing suite removed (pointer comment left); affordance-coverage sweep now
  clicks `role="button"` controls too (that's what re-caught `move_to`);
  e2e journeys walk via `.map-nav [data-node=…]`.
- **Queue hygiene:** HR-7 removed from `review.md` → one-line row in
  `archive.md` Reviews; snapshot updated.

**Proof:** `verify` 17/17 green · `playwright test e2e/journeys.spec.ts`
24/24 across all profiles (mobile chrome/webkit + desktop).

## Next intended steps

- **Two-column Map tab** (flavour card | map) — the HR-7 re-scope's layout
  note, still queued; deliberately not rushed into this close-out.
- The map's ADR-116 "no next-zone hint" wording is now softened by design
  (the sheet marks what-is-where — that WAS the re-scope's point); if a future
  pass wants it recorded as an ADR amendment, it's a one-liner.

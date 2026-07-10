# map-sheets — the survey-sheet map engine

The T0/T1 estate maps as full-screen **aizuri-night survey sheets** — hand-rolled
SVG, drawn entirely from seeded primitives. **Player-bound** (ADR-149/151): the
sheet IS the game's map: T0 ships live on the in-game Map tab (its DEV demo
entry points were retired with it — FB-364; headless captures use
`openTierMap('T0')`), while T1/T2 still mount from the DEV panel or the
`?t1-map-demo` / `?t2-map-demo` boot params until their tiers ship. The rendering passed the human taste bar (HR-12) and is
**frozen by a golden pin** — read the laws below before editing anything.

**Start here if you're changing maps:** the
[`map-sheets` skill](../../../.claude/skills/map-sheets/SKILL.md) routes every
job (edit · add a zone · new primitive · new tier sheet); the deep guides are
[`map-authoring.md`](../../../docs/guides/map-authoring.md) (procedures),
[`map-styles.md`](../../../docs/guides/map-styles.md) (scale classes, new
tiers), and [`map-spec.md`](../../../docs/guides/map-spec.md) (what T0/T1
depict + the blind-pass rubric).

## The five laws

1. **Deterministic.** Every mark flows through `rng(seed)` — one seed paints one
   identical sheet, forever. No `Math.random`, no `Date`. Seed strings are part
   of the pinned look; `seedSeq` is call-order-dependent (inserting a mark
   reshuffles every later seed → expect the pin to go RED; regen deliberately).
2. **Tokens only.** All colour is Andon Steel vars (`--steel-*`, `--ink-*`,
   `--silver-*`, `--gold*`, `--shu`). Silver = drawn/survey state, gold =
   built/worked structure, shu = the reviser's red. Never a hex literal.
3. **Brush-alive.** No uniform CAD polylines: structural lines are tapered
   variable-width `brushStroke` polygons; glyphs are seed-jittered so no two
   trees/hills/stones read identical (spec L2/L6). Micro-detail rides the
   `.ms-fine` register (`fineLayer`) so the fit view stays composed.
4. **One geography.** `layout.ts` holds THE world in shared units; the T0 sheet
   is a viewBox crop (`T0_WINDOW`) of T1's full `WORLD`. Landmarks never move
   between tiers — tiers differ only by `TIER_DELTA` state (ground.ts).
5. **Pin-guarded.** `golden.test.ts` hashes both grounds' full draw streams into
   `golden.hash.json`. A refactor must stay GREEN (byte-identical). An
   intentional visual change goes RED — regen with
   `UPDATE_MAP_GOLDEN=1 pnpm exec vitest run src/ui/map-sheets/golden.test.ts`,
   eyeball fresh captures, and commit the new hash WITH the change.

## Module map (dependency order)

| module | role |
|---|---|
| `geom.ts` | ALL pure geometry (Pt, bbox, resample, normals, scanlineRuns…) — no DOM, no rng of its own |
| `brush.ts` | the ink toolkit: rng, scrawl, brushStroke, wash, stipple, hatchArea, waveComb, inkText, fineLayer. API idiom lives in its header |
| `terrain.ts` `water.ts` `fields.ts` `flora.ts` `built.ts` `furniture.ts` | the primitive vocabulary (hills, river, paddies, trees, buildings, sheet furniture) — every emitter `(parent, …geometry, o: XxxOpts)` |
| `layout.ts` | THE ONE GEOGRAPHY: `WORLD`, `T0_WINDOW`, `ANCHORS` (seal positions), wash/field/road polygons. Pure data |
| `nodes.ts` | zone rosters (`T0_NODES`/`T1_NODES`) — bible-distilled narrative data (what a zone IS) + `RUNG_LADDER`. Never coordinates |
| `ground.ts` | the scene composition: layout data → primitive calls, parameterized by `TIER_DELTA` (fresh/drained/lit/…, plus the `ruinRevealed` T2 seam) |
| `t0-sheet.ts` / `t1-sheet.ts` | thin per-tier compositions (window + furniture) |
| `sheet.ts` | the shared modal shell: pan/zoom/pinch, roster/detail panes, night rail, LOD gate, caption collision pass, the rung previewer pill |
| `reveal.ts` | rung-reveal fog (ADR-151): unsurveyed paper, ghost chips, rumor notes — all DATA (`REVEAL` stages) |
| `golden.test.ts` + `golden.hash.json` | the pin (law 5) |
| `integrity.test.ts` | roster↔layout integrity: every zone has an anchor, ladders/stages name real zones |

## Where does my change go?

- **Move/resize a landmark, adjust a polygon** → `layout.ts` (then pin regen).
- **Change how a tier differs** → `TIER_DELTA` in `ground.ts` (additive columns;
  T2's ruin reveal hooks `ruinRevealed`).
- **Add a zone** → `nodes.ts` entry + `ANCHORS` + painter in `ground.ts` +
  `RUNG_LADDER`/`REVEAL` if rung-gated (`integrity.test.ts` keeps you honest).
- **New drawing primitive** → the matching vocabulary module, following the
  `XxxOpts` idiom in `brush.ts`'s header.
- **Zone text/blurbs/actions** → `nodes.ts` (fiction-voiced text = ADR-139
  narrative-diverge territory).
- **Shell behaviour (zoom, panes, captions)** → `sheet.ts` (not hashed by the
  pin — verify live instead).

## Verify

```
pnpm exec vitest run src/ui/map-sheets/            # pin + integrity
node src/scripts/map-audit-shots.mjs [outdir]      # headless captures (dev server up)
```

Then the blind-pass loop for anything look-bearing — the `map-blind-pass`
workflow (see [`map-authoring.md`](../../../docs/guides/map-authoring.md) §5)
scores fresh captures against the map-spec §5 rubric.

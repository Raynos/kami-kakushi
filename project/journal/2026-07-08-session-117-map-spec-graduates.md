# Session 117 — 2026-07-08 — the map spec graduates to a living guide

**Summary:** The human ruled the T0/T1 map spec's home: it leaves
`docs/plans/` (which is active-plans-only — the rebuild it gated is DONE,
HR-12 ✅, ADR-151) and becomes a **living guide** at
`docs/guides/map-spec.md`, alongside `qa-playtesting.md` and
`sfx-spec.md`. Guides over living because its standing job is process
(the §5 blind-pass rubric + iteration loop), and its §0–§2 world truths
are DERIVED from the story bible — the bible stays the single home of
world canon (TST1).

## What changed

- `docs/plans/fable-2026-07-07-t0t1-map-spec.md` → **`git mv`** →
  `docs/guides/map-spec.md`.
- The header rewritten from plan-speak (Status/Confidence lines) to
  living-guide framing: edited in place, new tiers add sections, the
  bible wins on disagreement; build history pointer → the archived
  rebuild plan.
- **Warm-washi recorded as REJECTED** (the human's ruling, relayed this
  session, matching s115's live A/B kill): §3's "surfaced as a fork"
  parenthetical now states night-indigo is the locked substrate (ADR-149
  as amended).
- §4 caught up to the build: `dev-t0v2-map.ts` is gone — the roster/
  detail data lives in `nodes.ts`; added `ground.ts` / `sheet.ts` /
  `reveal.ts` and the golden-pin contract; "DEV-fold" → player-bound
  (ADR-151). §5's capture script path updated to
  `src/scripts/map-audit-shots.mjs` (graduated from tmp/ in s115).
- Pointers fixed: the archived rebuild plan's spec link (was
  same-dir-relative, broken since the plan archived), `repo-map.md`'s
  guides line, and `docs/plans/README.md`'s generated active-plans list
  (`pnpm run checkpoint`).

## Key findings (the why)

- The map workstream state, reconciled from s115: the rebuild + Phase A/B
  + rung-reveal mechanism + golden pin + G-2/G-3/G-4/G-9 all landed; the
  open tail is **G-5 (geom-core extraction) + G-7 (API idiom pass)** —
  internal quality, golden-pin-guarded (the "~80%" the human referenced;
  the task tracker itself is empty, the tail lives in s115's closing
  notes).

## Next intended steps

1. The Phase C tail (G-5 + G-7) is the startable autonomous map work.
2. The storywave twin plans await the human's read (the bigger queue
   item); the map sheets swap into the real game via that build wave.

## Landmines

- The spec is now a guide: future map-spec edits are living-doc edits in
  place — do NOT re-plan it into `docs/plans/`.

## The Phase C tail opens — G-5 geom core (same session, later)

The human asked for the remaining ~20%: G-5 + G-7 from s115's review.
G-5 lands first: new `geom.ts` — the ONE geometry home (Pt, bbox,
pointInPoly, polyLen, resample, along, edgeNormal, normalAt,
offsetPolyline, insetPoly, scanlineRuns). The duplicates die:

- `fields.rowSegments` was a second copy of `hatchArea`'s scanline-clip
  loop — both now ride ONE `scanlineRuns` engine (parameterized by
  step/phase/jitter; rowSegments survives as a 3-line register wrapper
  since all five field call sites share step 5 / phase spacing/2).
- The vertex-normal idiom, re-derived inline 6× (brush `offsetPolyline`
  + `brushStroke`, water river banks + current threads, terrain
  `hillRange` under-mass, built robbed footings) → `normalAt` /
  `edgeNormal`. The terrain site used the NEGATED normal — replaced
  with `-normalAt`, exact under IEEE sign symmetry.
- terrain's private `polyLen` → geom, exported.
- `insetPoly` (centroid-scale) moves to geom with its limitation
  DOCUMENTED (wrong-ish for elongated paddies — but the pinned look
  leans on it; a true edge-offset inset is a pin-regenerating visual
  change, deliberately NOT taken in a refactor).

Every module now imports geometry from `geom.ts` and ink from
`brush.ts`. Proof of look-neutrality: the golden pin GREEN with NO
regen (the pin re-renders both grounds through the new code at test
time and byte-compares the draw stream — the r()-per-row call order in
scanlineRuns was preserved exactly for this). Full verify 17/17.
Shared-tree note: the co-agent's uncommitted story-bible edits
(03-tiers.md, tiers/t2.md) left untouched.

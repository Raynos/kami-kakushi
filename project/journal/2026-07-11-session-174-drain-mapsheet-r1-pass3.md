# Session 174 — 2026-07-11 — drain: mapsheet + r1, third pass (FB-388…FB-397)

**Summary:** drained the whole `mapsheet` (9) + `r1` (1) lanes under an ADR-171
claim (`w1:p3`). Wholesale proposal approved by the human, with two live steers:
travel time is part of FB-389 (not just the waddle), and — mid-drain, via
`w6:p1` — the walk-table change was superseded by the human's direct ×5 ask in
that session, so this drain **ceded `timing.ts` / `sheet-map.ts` / `dev.ts`**
to `w6:p1` and kept the rest.

## Entries (append at the bottom)

- Claimed `mapsheet` + `r1` (10 open, no collisions at claim time; the
  `w6:p1` overlap surfaced mid-pass via a coordination message — resolved by
  ceding the shared files, keeping gait/reveal/furniture/core work here).
- Reproduced all 10 captures headlessly against the shared `:5173` server
  (`tmp/drain-repro.mjs`): corner leaks = `FURNITURE_HOLES` exposing world art;
  floating kanji = fog-frontier 未測 washes on blank paper; "half a ri" cut =
  fog mask slicing world-art text labels (also seen on the stables note);
  FB-388/389 confirmed as steers.
- FB-389 (animation half): porter gait frequencies halved in `porter-math.ts`
  (bob 0.4s→0.8s, rock 0.8s→1.6s cycles) — the travel-time half is `w6:p1`'s
  ×5 table.
- FB-390/391: `FURNITURE_HOLES` deleted — the north arrow + scale bar ride a
  tagged `.ms-furn-lift` group that `paintReveal` raises ABOVE the fog (a hole
  showed the world art beneath: the river/upstream sketch, the old-fields
  grid). FB-396: sheet notes are fog-atomic (`ms-sheet-note`) — hidden when
  anchored under fog, lifted whole above it otherwise (the mask sliced
  "to the village — half a ri" / "the old stables — stalls for…" mid-glyph).
  Golden pin regenerated deliberately (both changes; DEV sheets unchanged).
- FB-388: `RankDef.arriveAt` — `applyPromotion` moves you where the beat's
  fiction leaves you; R1 arrives at the forecourt. RED-able tests in
  rung-beats.test.ts; proven live through the real VN UI (kura → beat →
  forecourt). Fixture saves regenerate (ride the shared-tree batch).
- Map fog fixes landed as `0fdf3d14` (FB-390/391/396). The FB-388 core change
  follows as its own commit; fixture saves ride the shared-tree batch (they
  reflect this + w6:p1's timing change together).
- Recovery note: 6 fresh r1 captures (FB-404…FB-410, 16:2x) landed WHILE the
  bucket was being archived and were swept along by the wildcard move — split
  back out to `pending/` undrained (only the drained FB-388 stays archived).
  Lesson: archive by NAMED stamp, never `mv <bucket>/*` — a live bucket grows
  under you.
- Close-out: `w6:p1`'s porter batch (`09c04284`) landed the folded FB-389 gait
  + walk-table ×2 (human revised the 500% ask down; T0 band re-signed [3,25])
  and the FB-392/393/394/397 未測 guard. All five sidecars stamped `09c04284`,
  ledger flipped to ✅, the mapsheet bucket archived (named stamps this time).
  Pass complete: 10/10 items closed; pending/ holds r1 (6 fresh, undrained)
  + the-log (unclaimed).

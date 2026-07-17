# Playtest feedback — 2026-07-17 — mapsheet lane (async inbox capture)

Source: `project/playtest-inbox/` drain, `mapsheet` bucket (captured
2026-07-13, build v0.4.1 `0cabf1a3`). Status legend: 🔲 open · 🔧 in
progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

### FB-412 · future-zone 未測 washes float at R1 — ✅
**Verbatim:** _"In R1 with only two zones unlocked all the kanjis for
future zones are still flaoting, i think we want them hidden"_
**Reading:** the live sheet's `fogFrontier` loop painted a 未測 wash for
EVERY adjacent unsurveyed zone, ignoring the rung ladder — so the R4
woodshed + drill yard teased at R1 (5 washes; the DEV previewer already
filters by `zonesAtRung`, the live map didn't). Human approved the
rung-filter fix over hide-all: walk-now teases (gate · kitchen ·
sickroom) stay — that's the ADR-151 reveal-as-plot idiom.
**Distilled rule:** the live sheet and the DEV previewer must share one
visibility predicate (`zonesAtRung`) — AC-6's shown-gate == real-gate,
applied to fog.
**Fixed in:** `f4d2db61` — the frontier loop consults `zonesAtRung`;
RED test first (`map.test.ts` — wash present for kitchen, absent for
woodshed/drill-yard at R1, per-zone via `data-fog-node`).

### FB-413 · village caption sliced by the fog edge — ✅ (margin fix)
**Verbatim:** _"This text here about village still truncated."_
**Reading:** could NOT reproduce on HEAD (headless chromium, both
framings, DEV on/off — the note lifts above the fog per FB-396, which
was in the capture's build too). But the geometry is razor-thin: the
note baseline sits 13 world-units from the fog frontier while the fog's
displacement filter jitters ±14 — any renderer that rasterizes the
filter differently (the human's GPU path) can eat glyph bottoms.
**Fixed in:** `f9791670` — margin, not mechanism: the village pair
nudged up ~24 units clear of the displacement band (pin regenerated).

### FB-414 · stables note overlaps the building — ✅
**Verbatim:** _"If we bump this text down a few pixels it wont overlap
on the building as much."_
**Reading:** the R8 sheet note `the old stables — stalls for twenty`
(`layout.ts`, y 1402) ran across the stable building + the drill-yard
wash. Candidates y 1432/1452 tested live; 1432 clears the building and
stays visually tied to the stables.
**Fixed in:** `e3a20fc5` — `layout.ts` y 1402 → 1432 (pin
regenerated).

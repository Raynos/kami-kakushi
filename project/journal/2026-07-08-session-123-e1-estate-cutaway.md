# Session 123 — 2026-07-08 — E1 estate cutaway (okoshi-ezu) spec + prototype

## ☀️ SUMMARY (read this first)

The human picked **E1** off the graphics-explorations plan (E2 parked,
E3 paused) with two steers: **diverge capped at 1–2 variants** (cost),
and — mid-session — **the estate cutaway is a STANDALONE prototype
experiment, not part of the map-sheets system**: a brand-new parallel
system that reuses some code (`brush.ts`/`geom.ts`), NOT an extension
of the approved sheet-map system. So no map-spec/map-styles edits; the
spec + E-line rubric live in the module README
(`src/ui/estate-sheet/README.md`), scene-cards/stamp-book precedent.
This file is HISTORY; live state → `project/status/project-status.md`.

---

## 1 · E1.1 spec, re-homed standalone

Drafted the spec into map-spec §7 + a map-styles class row first, per
the plan's original E1.1 wording — the human corrected course before
commit: **reverted both guide edits** (git checkout, never committed)
and re-homed the whole spec as `src/ui/estate-sheet/README.md`:
document fiction (the household's own repair sheet, cartouche believes
the 母屋 lie), H1–H5 master truths (H4 = the ruin looming at interior
scale; H5 = the re-ink grammar incl. `ruinRevealed`), room-by-room
table, the 2-variant fork (A fold-up okoshi-ezu · B flat section-cut),
and the E1–E9 blind-reader rubric (written before any drawing). Filed
**HR-16** (spec read + variant pick; kill is a valid verdict) + a
reading-queue entry. The human's build steer pulls E1.2 (HR read gate)
forward like E2/E3; integration (E1.4) stays gated.

## 2 · Taste Pass 1 — the constraint brief (full walk)

Walked all 21 principles + 4 values for the E1 prototype (a static,
fixture-fed SVG sheet in a DEV modal, 2 variants + an era toggle).
Applicable lines:

- **P2** — reuse `map-sheets/brush.ts`+`geom.ts` (rng, brushStroke,
  wash, hatch, inkText) and the stamp-book modal idiom (scrim/card/CSS
  block); no local palette or RNG fork; Andon tokens only.
- **P4** — the SVG redraws ONLY on an explicit toggle click (variant /
  era); no timers, nothing self-rebuilds while watched.
- **P5** — the modal card is fixed-size (100dvh−2rem); toggles repaint
  the sheet INSIDE the fixed shell; the shell never resizes.
- **P6** — the sheet is one viewBox object scaled into its scroll pane
  — fully painted at every width, never clipped under its controls.
- **P15/TST3** — the sheet believes the 母屋 lie: cartouche 母屋起絵図,
  the ruin drawn but never honestly named pre-reveal (curt 廃 at most),
  no T2-artifact spoilers; mystery details stay OUTSIDE the 凡例. The
  reveal era swaps labels only (客殿/本邸), no geometry move.
- **P19** — two registers: the sheet itself is ceremony (breathes,
  fine-detail craft in a close-look layer); the demo's toggles/hints
  stay chrome-tight (11px, dense).
- **P20** — full-viewport DEV modal, internal scroll, no page
  scrollbar.
- **TST1** — ONE house-geometry source (`house.ts`) + ONE vocabulary
  module (`elevation.ts`) shared by both variants — A and B cannot
  drift into two houses.
- **TST4** — ink states legible at a glance: gold = fresh work ·
  silver = standing fabric · shu = strikes/新 · shutter marks =
  closed-but-kept; the demo header names the active variant + era;
  `tip()` hover titles name rooms.
- (Engineering law, V-derived): `rng(seed)` only — no
  `Math.random`/`Date`.

n/a (silently skipped per the skill, listed once for the record): P1,
P3, P7, P8, P9–P14, P16–P18, P21 — no capability moves, no speakers /
dialogue / typewriter / log surfaces, no app-info in a static DEV
artifact.

## 3 · E1.3 build — the module, both variants, iteration 1

Built `src/ui/estate-sheet/`: `house.ts` (ONE geometry source — plan
rects in ken + elevation heights + ruin masses), `fixture.ts` (3 eras:
T0·R1, T1·R7, reveal-preview — the only data source), `elevation.ts`
(the shared vocabulary: wallFace/roofProfile/tatami/shutters/fold
tabs/stalls+mule/ruinBackdrop/cartouche/kenBar/legend/reviser marks),
`sheet-a.ts` (fold-up: plan centre + hinged wall folds + loose pieces +
the ruin un-folded along the north edge), `sheet-b.ts` (section-cut:
dollhouse row + hatched cut members + foreground yards + the ruin
skyline behind), `demo.ts` (DEV modal, variant + era toggles),
`golden.test.ts` (own pin: 4 hashes + node budget + a machine check of
H5: the reveal flips ≤12 nodes — labels only). One shared-file touch:
`ui/dev.ts` Story-pane button (the E-exploration cluster). Headless
captures via `tmp/e1-shots.mjs` (scratch).

**Iteration 1 (own-eyes review):** tatami bond read as BRICKWORK →
fainter/sparser; closed rooms' vertical boards read masonry → diagonal
shut-hatch + tie; the kura had mats (storehouse!) → service floors
bare; ruin walls read as HILLS → masonry course dashes + foot rubble;
B's ruin ground line overlapped the west wing's roof (read as roof
damage) → raised clear of the lived ridgeline; washes brightened a
notch. Verify green (17 gates), pin regenerated post-polish.

## 4 · Blind pass (iter 1+2) → both variants PASS · Pass-2 scorecards

Two fresh blind describers (images only) → E-lines scored against
their verbatim text (mechanical; a separate judge skipped per the cost
steer). **B passed everything first try** — corridor, the alcove read
as a maintained household shrine, "the ratio is the story," the full
gold/shu grammar including the west→east work migration, "decisively
NOT CAD." **A missed E2's corridor** (buried under floor texture;
alcove read as a door; rake arcs as scrub) → iter-2 fixes (corridor
re-inked over floors + 廊下 · shrine glyph posts+lintel · orderly broom
rows · kitchen attached to the west flank per the bible) → a THIRD
fresh reader: full pass — "all strung on the single 廊下 corridor,"
the alcove "the single strangest interior feature," "the tending stops
exactly at the wall." Post-pass polish: the well's 井 mark. Full
report + quotes:
`project/audit/reports/2026-07-08-e1-estate-sheet-blind-pass.md`;
final captures committed to
`project/audit/screens/2026-07-08-e1-estate-sheet/`. Pin regenerated
at the final look.

**Taste Pass 2 (full 21-walk, per variant).** Applicable set as the
Pass-1 brief (P2 P4 P5 P6 P15 P17 P19 P20 + TST1/TST4 value-lines);
all others n/a for a static DEV artifact (no capability moves,
speakers, typewriter, log surfaces, app-info).

- **A (fold-up): 8✔ · 0✘ · 13—.** Borderline ✔ flagged: P6 — the
  modal is desktop-register; at phone widths the sheet shrinks legibly
  but small (DEV-only tool, accepted); P2 — the local `txt` helper is
  now the THIRD copy of the font-register text idiom (stamp-book,
  scene-cards, here) → hoist-into-brush.ts candidate, named as debt.
- **B (section-cut): 8✔ · 0✘ · 13—.** Same P6/P2 flags; plus the
  noted depth-overlap residual (kitchen gold vs west wing, mitigated).

**Self-pick: A · fold-up** carries as the exploration's default —
truest to the okoshi-ezu fiction, and the plan projection is the
right substrate for the Estate tab's future per-room repair
interactions; B kept as the alternate (the harder-hitting single
glance). Both stay live behind the DEV toggle until HR-16.

## Next intended steps (current)

1. HR-16 verdict from the human (spec read + A/B pick or kill).
2. If kept: E1.4 integration stays GATED on storywave Plan B + HR-9.
3. Debt noted: hoist the `txt` font-register helper into brush.ts
   (three copies now exist).

## Landmines (current)

- **Seam law:** storywave Plan B owns `src/**` — this experiment
  touched ONLY `src/ui/estate-sheet/` + one `ui/dev.ts` button.
- The estate-sheet pin is its OWN golden test
  (`UPDATE_ESTATE_GOLDEN=1`); map-sheets' pin untouched; the
  map-blind-pass workflow does NOT apply to this module.
- `tmp/e1-shots.mjs` is the capture harness (scratch, git-ignored) —
  it force-fits the svg to the scroll pane before shooting; without
  that the element screenshot viewport-clips.

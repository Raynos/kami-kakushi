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

## Next intended steps (current)

1. Taste-scorecard Pass 1 brief.
2. Build `src/ui/estate-sheet/` (fixture → elevation vocabulary →
   sheet-a/sheet-b → demo + DEV entry), seeded + Andon tokens only.
3. Blind-pass loop vs the README E-lines; pin the pick; Pass 2
   scorecards into HR-16; checkpoint.

## Landmines (current)

- **Seam law:** storywave Plan B owns `src/**` — this experiment may
  touch ONLY the new `src/ui/estate-sheet/` dir + one DEV-menu entry
  (`src/ui/dev.ts`); pathspec commits, check the shared index before
  every commit (another agent is live in this tree).
- The estate-sheet pin is its OWN golden test — do not touch the
  map-sheets pin; the map-blind-pass workflow does NOT apply here
  (fresh-eyes subagents judge vs the README rubric instead).

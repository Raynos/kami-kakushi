# Fix the three 390px shell defects the estate blind pass surfaced

**Status:** 📋 PROPOSED (2026-07-18, session 212)
**Confidence:** ( 40% Opus, 60% Fable ) — mostly mechanical CSS/layout
work, but defect 1 touches the mobile log recomposition (TST2-risky)
and the fixes must be judged on real phone captures.
**Template:** build

## Who builds this — Fable or Opus?

- Defects 2–3 (footer collision · life-bar read): mechanical — either.
- Defect 1 (the log overlay clipping a pane): the M3 mobile
  recomposition is the shell's touchiest seam — Fable preferred,
  Opus fine with capture-verified care.

## Why

Two independent zero-context blind readers (the estate craft pass,
session 212 — baseline AND after passes, so it reproduces reliably at
390×844 on `?fixture=rung-R6/R7/wealthy-idler`) reported the same
three shell defects in passing; none is estate-surface work, so the
craft pass recorded them here rather than scope-creeping (ruling R1,
craft-only). Record: `project/audit/reports/`
`2026-07-18-estate-craft-baseline.md` §"Findings beyond" +
`2026-07-18-estate-craft-after.md` §"Out-of-scope". Agent-surfaced
(no FB/HD yet) — the reports carry verbatim reader quotes.

1. **The narrative overlay clips the House's Standing panel** — the
   mobile log (an M3 shell sibling) sits ON the pane's card, slicing
   its prose mid-glyph; an empty border stub shows between legend and
   log box. "Two text surfaces fighting for the same space, and both
   lose."
2. **The "End the Winter/Spring 季" pill occludes the footer** — the
   day-of-week text and a control behind it are partially hidden; the
   神隠し wordmark wraps (し on its own line).
3. **The life bar reads full at 1/100** — the header numeral says
   1/100 while the bar paints visually near-full; per
   `vitals.ts:155` the exact-number-vs-bar contract is ADR-076
   ("1 HP vs a full bar is life-or-death"), so a track that READS as
   fill is a real TST4 defect (may be track/fill contrast, not
   state — diagnose first).

## What exists today

Surveyed 2026-07-18 at `c3d18bd1`:

- `src/ui/render/vitals.ts` — owns both the season-end button
  (`:116`) and the life bar (`:155`, ADR-076 contract).
- `src/ui/styles/shell-layout.css` — the ≤920px Andon phone
  recomposition (`:117` on; the M3 log-as-shell-sibling block
  `:482-502`); `header-nav-rung.css:86` the bottom tab bar.
- Repro captures (git-ignored, regenerable via
  `tmp/estate-baseline-capture.mjs` while it survives — else any
  390×844 headless shot of the Estate tab):
  `project/audit/screens/2026-07-18-estate-craft-baseline/*-phone-viewport.png`.

## Steps

1. **Repro + diagnose** — 390×844 headless captures of the affected
   regions on 2–3 fixtures; for each defect name the owning
   rule/element (defect 1: which box the log overlay actually
   overlaps and why the pane doesn't reserve its height; defect 3:
   whether the bar's FILL is wrong or the TRACK reads as fill).
2. **Defect 2 fix** — footer layout at ≤920px: the season pill,
   date, and wordmark each get honest space (wrap or reflow, never
   occlusion); commit with before/after captures.
3. **Defect 1 fix** — the log sibling and the pane cards stop
   overlapping (reserve height / stacking / scroll bounds per the
   diagnosis); TST2: no watched surface may resize under the reader
   mid-tick; commit with captures.
4. **Defect 3 fix** — per diagnosis: fill math or track/fill
   contrast so a 1% bar READS as 1% (ADR-076); commit with a
   low-life fixture capture.

## Verification

- Before/after 390×844 captures per defect, committed to the report
  set (the could-go-RED check: the after capture must show the
  clipped glyphs whole, the footer un-occluded, a 1% bar reading
  near-empty).
- The mobile e2e lane (`src/tests/e2e/mobile-layout`) — add a cheap
  assertion per fixed defect ONLY if it fits the existing spec shape
  (CI lane, not the commit budget).
- **Player-reach (PH6):** all three sit on the always-shipped shell —
  a live 390px drive of the Estate + any tab at `?fixture=rung-R6`
  proves the player path.

## Sync ripple

- **PRD:** none — shell polish, no system change.
- **Story-bible:** none — no fiction touched.
- **Living docs / registries:** none — no registry moves; ui-design.md
  only if a fix mints a new mobile rule (not expected).
- **CHANGELOG:** none — no version bump.

## Human-in-the-loop

- No open questions — three recorded defects with reader quotes;
  defaults are the obvious fixes. Taste-scorecard Pass 1 before the
  layout fixes (P5/P6/P20 will dominate); no diverge (defect fixes,
  ADR-075 §1 exempt).
- If defect 3 diagnoses as by-design (a track misread), close it
  with a note in the report instead of a fix — surface, don't force.

## Non-goals

- No estate-sheet work (that pass is done — see the craft-pass plan).
- No general mobile audit; exactly these three.
- No log-routing or content changes — layout only.

## Risks

- **Seam:** owns `src/ui/styles/shell-layout.css` (footer/log
  blocks), `src/ui/render/vitals.ts`, possibly `footer-modals.css`.
  No live plan touches them (checked `docs/plans/` 2026-07-18);
  three co-agents active on this tree — re-check herdr peers +
  `git diff --cached` before each commit.
- **TST2:** the log recomposition is watched ground — a fix that
  rebuilds or resizes the log under the reader is worse than the
  clip; capture-verify scroll behavior.

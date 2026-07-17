# Estate sheet craft pass — past "needs more work" (#5)

**Status:** 📋 PROPOSED (2026-07-18, session 211)
**Confidence:** ( 20% Opus, 80% Fable ) — ink craft + taste judgment;
only the mobile-layout mechanics are routine.
**Template:** build

## Who builds this — Fable or Opus?

- **The craft fixes + blind-pass loop (steps 2–4): Fable** — this is
  look-iteration on the game's most elaborate drawn surface, under an
  open review.
- **Register/HR bookkeeping (steps 1, 5): either.**

## Why

Graphics register **#5** (estate cutaway, okoshi-ezu): HR-16 closed
2026-07-08 at **"NEEDS MORE WORK"** — the human ruled the demo not
ready to carry forward as-is (`project/human-in-the-loop/archive.md`
row HR-16). Pulled forward by the human 2026-07-18 ("Make a plan for
Estate cutaway", the overnight-burn triage).

**The register's forward track is STALE** — it still reads "iterate
the look, THEN E1.4 integration," but integration already happened:
the sheet folded into the **Estate 家 tab as HR-30's variant A**
(state-driven — rooms ink in as they reopen, fresh work wears the
gold 新; self-picked prod default, awaiting the human's pick,
`project/human-in-the-loop/review.md:434`). What actually remains is
the **look craft**: HR-30's recorded scorecard ✘s — **P20** (the tall
sheet compresses on a phone), **TST4** (shutter marks are a subtle
open/shut read), **P2 [blind spot]** (the legend/cartouche idiom is
prototype-native, not the app's card idiom).

## What exists today

Surveyed **2026-07-18** at `9e2dff3c`:

- `src/ui/estate-sheet/` — `sheet-a.ts` (640) · `sheet-b.ts` (532) ·
  `elevation.ts` (1385) · `house.ts` · `from-state.ts` (the live
  state feed) · `fixture.ts` · `golden.hash.json` + `golden.test.ts`
  (the pin) · `README.md` (the full spec: H1–H5 master truths, the
  room table, the look rules, the blind-reader rubric).
- The shipped surface: Estate 家 tab anchor = `paintSheetA` over live
  state (HR-30 variant A, prod default); B (steward's reckoning) and
  C (rooms list) DEV-only. Review row: DEV panel → Review → Variants
  → `estate-house`.
- HR-30 is **OPEN** — the pick is the human's; its entry carries the
  three ✘s this plan answers plus the taste brief (pass 1) already
  written.
- The DEV prototype door also still exists (protos-pane
  "⤢ Estate sheet", fixture-era demo).

## Steps

1. **Register truth fix** — `docs/living/graphics-concepts.md` row 5:
   rewrite the stale forward track to the real state (folded in via
   HR-30; remaining work = this craft pass). One honest paragraph.
2. **Blind-pass baseline** — run the README rubric blind pass on
   TODAY'S from-state sheet (not the 2026-07-08 fixture demo):
   `?fixture=rung-R6`, `rung-R7`, `wealthy-idler`; report to
   `project/audit/reports/`. The "needs more work" ruling carries no
   redline, so the baseline + the three recorded ✘s ARE the working
   spec for this pass (see Human-in-the-loop for the async check).
3. **The three ✘s** — each an independently committable,
   verify-green fix behind the golden pin, taste-scorecard Pass 1
   first:
   - **a · P20 mobile:** a real phone presentation for the tall
     sheet (≤920px) — reuse the map-sheets mobile idiom (TST1: one
     shared primitive per idiom) rather than inventing one; labels
     must stay legible at viewport width.
   - **b · TST4 shutters:** strengthen the closed-but-kept marks and
     add the shutter glyph to the 凡例 legend so the open/shut read
     survives a cold reader.
   - **c · P2 idiom:** align the cartouche/legend furniture with the
     app's card idiom per `ui-design.md` — the smallest change that
     kills the ✘; the period-document character must survive it.
4. **Re-verify** — re-run the blind pass; re-scorecard variant A;
   the after-report must clear the rubric lines behind the ✘s.
5. **HR-30 addendum + pin** — append a dated addendum to the OPEN
   HR-30 entry (never rewrite it; the review ground gets better, not
   different — TST2), regenerate the golden pin deliberately, commit
   the capture set with the report.

## Verification

- `golden.test.ts` hash pin — RED on any accidental drift; the step-5
  regen is the one deliberate change.
- Blind-pass **before/after reports** (the after must clear the
  motivating rubric lines — a check that can go RED).
- Mobile: a viewport capture at the e2e profiles' widths; add a cheap
  assertion to the mobile e2e lane only if it fits the existing spec
  shape (CI lane, not the commit budget).
- **Player-reach (PH6):** the Estate 家 tab IS a shipped player
  surface (variant A default) — live drive at `?fixture=rung-R6`,
  capture committed with the report.

## Sync ripple

- **PRD:** none — presentation craft on a shipped surface; no system
  change (`/prd-ripple` class: balance/presentation → no §4 edit).
- **Story-bible:** none — H-lines and room truths untouched; any fix
  that would touch an H-line is out of scope by definition (the
  bible wins).
- **Living docs / registries:** graphics-concepts row 5 (step 1);
  `estate-sheet/README.md` records the craft-pass deltas beside the
  rules they refine.
- **CHANGELOG:** none — no version bump.

## Human-in-the-loop

- **HR-30 addendum**, not a new item — the open review absorbs the
  improved ground with a dated note.
- One async question, filed in the addendum WITH a default (never
  blocking): *"any redline beyond the three recorded ✘s? Default:
  craft-only — geometry, room truths, and variant set stay
  exactly as reviewed."*
- Taste-scorecard Pass 1 before step 3; Pass 2 after step 4.

## Non-goals

- **No variant pick** — HR-30 stays the human's call.
- No new variants, no elevation-grammar redesign, no geometry moves.
- No T1 room-opening content; no estate-SECTION redesign (that is
  parked separately at HR-9's "interim" note).
- No map-sheets spec changes — this module deliberately does not
  extend `map-spec.md` (its README's own law).

## Risks

- **Iterating under an open review (TST2):** mitigated by
  additive-only changes, the dated addendum, and pin discipline — if
  a fix would materially change what B/C look like too, it waits.
- **Craft churn without a redline:** bounded — exactly the three
  recorded ✘s, two blind-pass rounds max, then ship the report
  as-is.
- **Seam:** owns `src/ui/estate-sheet/**`; small touches to the
  estate view/styles possible — no live plan holds them, but check
  herdr peers + `git diff --cached --name-only` before each commit
  (three agents in this tree today).

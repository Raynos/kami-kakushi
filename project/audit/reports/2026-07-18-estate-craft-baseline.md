# Estate sheet craft pass — blind-pass BASELINE (step 2)

**Date:** 2026-07-18 · session 212 · plan:
`docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md`
**Surface:** the SHIPPED Estate 家 tab, variant A (`paintSheetA` over
live state via `from-state.ts`) — NOT the 2026-07-08 fixture demo.
**Captures:** `project/audit/screens/2026-07-18-estate-craft-baseline/`
— per fixture (`rung-R6` · `rung-R7` · `wealthy-idler`): desktop
1440×900 in-situ, phone 390×844 in-situ, and the sheet SVG at its
natural 1200×1010 (`*-sheet-natural.png`, 2× DPR).
**Method:** two independent zero-context blind readers (one on the
natural-size set, one on the phone set), judged here against the
README rubric (E1–E9). This baseline + HR-30's three recorded ✘s are
the working spec for the pass (ruling R1: craft-only).

## E-line scores (natural-size reader)

| Line | M/S | Verdict | Evidence |
|---|---|---|---|
| E1 period sheet, not CAD/game-diagram | M | ✔ | "okoshi-ezu idiom… period-document pastiche… not CAD, not AI filler"; cartouche 母屋起絵図 + 改 seal + 当代 read verbatim |
| E2 one winged house | M | ✔ | centre block + 西/東 wings + 廊下 corridor; kitchen on the west flank; south gate + forecourt + well |
| E3 the wrongness read cold | M | ✘ marginal | the corridor shrine WAS flagged ("a shrine embedded in the dwelling… conspicuous") but the "household smaller than its house" inference never landed; the kitchen board read as only a stove; the empty stable ladder wasn't read as one-mule-in-twenty |
| E4 something greater looms at scale | M | ✔ | "the ruin is enormous — footprint wider than the main house… a deliberately looming mystery" |
| E5 repair state legible | M | ✔✔ | legend fully decoded; per-fixture state story reconstructed exactly (R6 shuttered → R7 shed 新 → wealthy study/main-house gold) |
| E6 document fiction (fold-up read) | S | ✘ | margin faces read as "classic survey-sheet furniture", ken bar ✔ — but fold tabs/hinges never read as FOLDABLE; tatami counts unmentioned |
| E7 rooms from marks alone | S | ✔ | kitchen by stove, kura by lighter fill, sheds 薬/薪, stables by bays + horse |
| E8 honesty rule | S | ✔ | ruin carries only 廃; legend holds repair marks only |
| E9 craft under zoom | S | ✔ | "hand-authored… wobble well-tuned… none of the AI tells"; noted zoom weaknesses: uniform stroke weight, no pressure variation, even tick spacing |

**Baseline: 4/5 M · 3/4 S.** (The 2026-07-08 demo pass was 5 M — the
E3 miss is specific to today's from-state sheet + this reader; see
findings.)

## The three recorded ✘s — baseline evidence

- **P20 mobile (✘ confirmed, severe).** Phone reader: "the most
  crafted element on the screen carries the least legible
  information at this size… every label is a 2–4px smudge… there is
  NO visible control suggesting enlargement." State highlights
  survive only as "something is marked."
- **TST4 shutters (✘ confirmed, sharpened).** Plan-view closure
  renders as diagonal HATCHING (read as "mothballed"), while the
  legend's closed symbol is ||| boards — which appear only on the
  elevation's stable bays. Two conventions for one state; the legend
  decodes only one of them. Fix 3b should unify the closed mark with
  its legend row (and keep the West-wing "kept, not lost" warmth).
- **P2 idiom (✘ confirmed).** The 凡例 is a 118×64 in-SVG box —
  8.4px type at natural size, illegible at pane scale, invisible on
  phone. Prototype-native furniture; ruling R3 rebuilds legend +
  cartouche as full Andon card furniture (the drawing stays period).

## Findings beyond the three ✘s (recorded, NOT silently fixed)

In-scope-adjacent (will fall out of 3b naturally or stay recorded):
- E3 marginal: the kitchen board reads as a stove only; the stable's
  emptiness doesn't land. Candidate strengthening is LOOK-only but
  beyond the ruled scope — recorded for the HR-30 addendum as an
  open craft note, the human may pull it in.
- E6 ✘: the fold-up conventions don't read as foldable. Same status.
- E9 zoom notes: uniform stroke weight / no pressure variation.
  Same status.

Out-of-scope phone-layout defects (not this surface, found by the
phone reader in passing; home: this report + the HR-30 addendum
names them so they reach the queue):
- The narrative overlay/toast sits ON TOP of the House's Standing
  panel at 390px, truncating both (all three fixtures).
- The "End the Winter/Spring 季" footer button overlaps the
  day-of-week text and a control behind it at 390px.
- The header "life 1/100" numeral contradicts its visually-full bar.

## Pass bar for step 4 (what the after-report must clear)

1. Phone: a blind reader at 390px can either read the sheet's state
   or SEES an advertised control that opens it full-screen readable
   (tap-to-maximize, ruling R2).
2. Closed-but-kept: ONE convention, decoded by the legend, read
   correctly cold (plan + elevation agreeing).
3. Furniture: legend/cartouche read as the app's card idiom (Andon
   tokens/type) while the drawing itself still scores E1/E9 as
   period-handmade.
4. E-lines: all 5 M pass; ≥ half S pass (README bar), on the SAME
   fixture set.

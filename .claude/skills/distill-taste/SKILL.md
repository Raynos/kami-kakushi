---
name: distill-taste
description: Distill a feedback-human corpus into the locked taste standard (docs/living/taste.md) WITHOUT growing it — triage every item into one of five moves, verify coverage + budgets, prediction-test substantial changes, and lock any top-layer change with the human. User-invoked only (/distill-taste [corpus-file]); never auto-invoked.
disable-model-invocation: true
---

# Distill taste — feedback → the standard, without slop

The standard (ADR-126) is a **capped snapshot**: 4 human-locked values →
touchstones/references → ~21 principles, ≤150 lines, gated by
`verify-doc-budgets`. The corpus (`project/feedback-human/*.md`) is the
lossless record. **Distillation therefore never appends — it triages.**
This procedure is the one that built the standard (session 57, prediction-
tested 24/24); run it after every playtest / feedback session.

Input: the corpus file to distill (default: the newest
`project/feedback-human/` file with undistilled items).

## 0 · Read the standard first, fresh

Read `docs/living/taste.md` + `docs/guides/qa-playtesting.md` §9 in full
(they're small by design). You cannot triage against a standard you hold
only from memory.

## 1 · Triage EVERY item into exactly one move

For each feedback item (keep its F-number + verbatim quote — the phrasing
IS data; never paraphrase a quote away):

1. **Repeat-offense** — an existing principle already forbids it. The doc
   did not fail; the *delivery* failed. → Strengthen the RUNG, not the
   prose: file it against the FB-10 scorecard/gate work, and only sharpen
   the principle's wording if the judges/builder genuinely misread it.
   **Never add a rule for a repeat.** Tag the item `repeat` in the corpus
   (the repeat-rate is the standard's health metric).
2. **New evidence for an existing principle** — same taste, new instance.
   → Add the F-number to that principle's citation list; sharpen wording
   in place only if the new instance exposes ambiguity. Zero growth.
3. **Genuinely new taste** — no principle predicts the verdict. → A new
   principle ONLY if it expresses one of the four values; write it 1–3
   lines, falsifiable, with its F-pointers — and **displace** a weaker
   line to stay under the cap. If it expresses NO existing value, that is
   a top-layer change → step 3 below, never a solo call.
4. **Wrong-home taste** — workshop/DEV ergonomics → `qa-playtesting.md`
   §9; game-systems taste (resources, balance, mechanic shapes) →
   `prd.md` + an ADR. taste.md stays player-facing UI/narrative/feel.
5. **One-off verdict** — a specific fix with no standing rule behind it.
   → Stays in the corpus only. Not every correction is taste.

When in doubt between 2 and 3: default to 2 (sharpen, don't multiply).
Rule-count creep is how a standard turns back into noise.

## 2 · Edit snapshot-class, keep the genre

Replace in place, never append; no dated/session references (the genre
tripwire warns); examples live in the corpus — the doc carries F-pointers,
not casebooks; keep the human's verbatim anchors ("GBA typewriter") where
they carry the register. The four values + touchstones are HUMAN-LOCKED:
the agent proposes edits there but never applies one without the human
(step 3).

## 3 · Lock any top-layer change with the human

A new/removed/reworded **value, touchstone, or reference** = a design
decision: AskUserQuestion (or a grill-me round for anything contested),
then record it as an ADR amending ADR-126. Principle-level sharpening is
agent-owned — the human sees it in the commit + queue.

## 4 · Verify — the DoD

1. **Budgets**: `pnpm exec tsx src/scripts/verify-doc-budgets.ts` green
   (taste ≤150 · ui-design ≤400).
2. **Coverage**: every corpus F-number appears in taste.md ∪
   qa-playtesting §9 (set-diff the `F\d+` tokens; investigate any gap —
   it is either move-5 by intent or a missed distillation).
3. **Prediction test** (for any session that added/reworded principles):
   2 fresh blind agents, ONLY the two docs in scope, judge ~10 disguised
   cases — reversed pre-fix states + ≥2 compliant decoys. A convergent
   miss = a wording ambiguity → fix the doc, re-run. Record the score in
   the distillation's brainstorm/journal entry.
4. Full `pnpm run verify` green; commit by pathspec; queue taste.md for
   the human's read if the top layer or ≥3 principles changed.

## 5 · Close the loop

Tag distilled items in the corpus (`distilled → P<n>` / `repeat` /
`corpus-only`), journal the pass (counts per move + the repeat-rate), and
if the repeat-rate is rising, the next work item is FB-10 enforcement — not
more prose.

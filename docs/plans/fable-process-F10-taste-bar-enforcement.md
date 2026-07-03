# Taste-bar enforcement — self-scorecards against taste.md

**Status: ⏸️ PLACEHOLDER — RE-PLAN TRIGGER FIRED (2026-07-03).**
`docs/living/taste.md` is now **LOCKED** (D-126: 4 values → touchstones →
21 numbered principles, hard-capped 150 lines by the `doc-budgets` gate,
prediction-tested 24/24 — receipts: the archived taste-redo plan + the
taste-transfer brainstorm §12). The ⭐ TODO closed, so this placeholder is
due its full rewrite. Note for the re-plan: **the pre-ship checklist no
longer exists** — the per-surface scorecard IS its operational form,
scoring against the 21 numbered principles.

## Who builds this — Fable or Opus?

**Confidence: ( 70% Fable, 30% Opus )** — for the eventual full work:
judging which taste principles are checkable is itself a taste call.

Placeholder authored by Fable 5 (this session). The eventual full plan:
**Fable drafts the scorecard rubric** (which taste principles are checkable
per surface-type — a taste-judgment call); **Opus wires the enforcement**
(skill edits, R-item template, any gate). Not started until taste.md locks.

## The idea (so the intent survives until then)

`taste.md` distills all 117 human feedback items into ~12–16
meta-principles + a pre-build/pre-ship checklist. Today it is a document an
agent may or may not internalize. This plan wires it into the workflow so
it fires on every surface:

1. **Self-scorecard per new/restyled surface.** The `diverge` skill (and
   any surface-building flow) gains a mandatory step: score the surface
   against each applicable taste principle — pass / fail / n-a, one line
   each — and attach the scorecard to the surface's R-item in
   `project/human-in-the-loop/review.md`.
2. **Two payoffs.** (a) Agents catch their own violations before the human
   reviews — fewer feedback rounds (the "less feedback needed" promise made
   mechanical). (b) When the human disagrees with a shipped surface, the
   scorecard shows what the agent *thought* the standard was — the
   disagreement pinpoints exactly which taste principle needs sharpening,
   and that edit graduates back into taste.md.
3. **Pre-ship checklist pass** as a release-train step (composes with the
   `/ship` plan's step sequence once both exist).

## Enforcement rung (to be settled in the full plan)

Likely: a **skill-step norm** (the diverge skill's procedure) + the R-item
template carrying an empty scorecard section — NOT a verify gate (taste
pass/fail is judgment; a lint here would cry wolf, A11). The full plan
re-evaluates once the locked taste.md shows which principles are
mechanically checkable (some may be — e.g. "no white chrome" is greppable
in CSS) vs judgment-only.

## What NOT to do before taste.md locks

- Do not wire any scorecard against the draft taste.md.
- Do not edit the diverge skill yet.
- Do not treat draft principles as review criteria in R-items.

## Re-plan trigger + DoD of THIS placeholder

- **Trigger:** the ⭐ "redo taste-distillation with Fable" TODO closes
  (taste.md locked by the human).
- This placeholder is DONE when the full plan replaces it (same file,
  rewritten; Status flips to 📋 PROPOSED with real phases + DoDs).

---

*Committing note: new `docs/plans/*.md` → reading-queue entry in the same
commit (pre-commit gate).*

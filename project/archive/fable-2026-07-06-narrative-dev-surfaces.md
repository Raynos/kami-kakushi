# Narrative-diverge DEV surfaces — story set-switcher + script-reader modal

**Status:** ✅ DONE — built & verified in session 92 (same day as the
design): Phases 1–5 all landed (038c01f take-set compiler · 228a786 Story
switcher, live-swap proven headless · 7c76a68 3-variant reader modal ·
strip/ship + prune proofs in the session journal). Open remainder is the
HUMAN side only: HR-9 (pick the reader variant; confirm the switcher).
Locked calls: Fable end-to-end · lighter ADR-075 split (switcher
single-idea + brief, reader full diverge) · built before the redesign.
**Confidence:** ( 35% Opus, 65% Fable ) — mostly mechanical DEV-panel
wiring, but the script-reader's reading experience is a taste surface.
**ADR:** ADR-139 · **Skill:** `.claude/skills/narrative-diverge/SKILL.md` ·
**Brainstorm:** `project/brainstorms/2026-07-06-narrative-diverge-design.md`

## Why

ADR-139 makes every narrative element ship from 3+ takes, and the human
reviews **in game**: "we should have variants & story variants as different
elements in the DEV menu… I also want a separate 'explore story variant'
full-page modal… that lets me read and review the readable script doc, but
in game, not reading t0-story.md in the terminal/IDE." These two surfaces
are that review tooling. Until they exist, narrative-diverge bundles are
reviewed from the HR-item doc alone (the skill's §2.7 interim note).

## Who builds this — Fable or Opus?

Fable-leaning. Phases 1–3 (variant source area, compiler pass-through,
set-switcher) are mechanical and could be Opus- or Sonnet-class; Phase 4
(the script-reader modal — typography, reading rhythm, how options sit
beside the picked line) concentrates the judgment and wants Fable-class.
Routing is the human's call at kickoff (ADR-124).

## Shape (locked in the grill; details are the builder's)

1. **DEV-only narrative-variants source area.** Alternate takes live
   compiled-but-strip-gated (ADR-138's `__DEV_TOOLS__` axis is the current
   inclusion gate; post-T0 they fold to dead code like the rest). Canon FB-5
   markdown (`src/core/content/narrative/`) carries ONLY the picked take —
   the variants area is a sibling, never mixed into canon source.
2. **`gen:narrative` learns takes.** The compiler emits the picked take to
   the canon registries exactly as today, and additionally emits DEV-only
   take-sets for bundles that have open (unsigned) diverges. Byte-compare
   gate semantics unchanged for canon output.
3. **Story set-switcher in the DEV menu.** A story-variants element,
   *sibling of* (not merged into) the UI-variant `SURFACES` toggle: pick a
   bundle → pick a take-set (A/B/C…) → the live game swaps that narrative
   in. **Grain: sets + per-unit override** — coarse swap keeps pacing
   readable; a per-unit override within the chosen set is available.
4. **"Explore story variant" full-page modal.** A DEV-menu entry opening a
   full-page reader: the bundle as a continuous script (t0-story.md style),
   the picked take inline, alternates readable under each unit, Pass-2
   scorecard verdicts + pick rationale visible. **Read-only** — sign-off is
   conversational (Q17); no export controls, no canon writes.
5. **Prune path.** On human sign-off the agent deletes the bundle's DEV
   take-set (the committed review doc is the archive) — the switcher and
   modal list only open diverges, so an empty state means "nothing awaiting
   story review".

## Constraints & notes

- These are new UI surfaces → ADR-075 applies to *them*; scope the diverge
  touch for DEV-only tooling in the build (a lighter pass is arguable —
  decide and record at kickoff, don't skip silently).
- Both surfaces are `__DEV_TOOLS__`-gated (ADR-138 ship/strip modes must stay
  green); nothing here touches the pure core — narrative variants are
  content data + render only.
- Determinism: swapping a take-set must not perturb the RNG stream; takes
  are display/content substitution, not state.
- First real consumer: whichever narrative work runs first under ADR-139
  (likely the human-kicked redesign) — build before or alongside it so
  review isn't doc-only for long.

## Acceptance

- A bundle with 3 takes compiled → DEV menu shows it in the set-switcher;
  swapping sets swaps the live text; per-unit override works within a set.
- The modal renders the full bundle script readably at desktop + 390px.
- Prod bundle (strip mode) carries zero take-set strings (ADR-138 gate green).
- Prune of a signed bundle leaves canon + gen output byte-identical.

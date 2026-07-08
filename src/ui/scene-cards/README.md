# scene-cards/ — the E2 graphics-exploration demo

The **VN scene-card pilot** (concept #12): two composed woodblock vignettes
for the cold open's VN scenes — **Sōan's sickroom** ("You're awake.") and
**Genemon's grain-store** ("On your feet, then.") — each a still frame a
scene card would one day set above its dialogue.

**Status: DEV-only demo, zero game integration** — the prototype-first law
in
[`docs/plans/fable-2026-07-08-graphics-explorations.md`](../../../docs/plans/fable-2026-07-08-graphics-explorations.md)
(E2, pulled forward by the human 2026-07-08 as a single lightweight demo:
one version, no diverge, ahead of the E2.1 grammar spec — the same move as
the E3 stamp-book demo). Text comes from the existing cold-open/intro/
dialogue sources verbatim (the story bible has since moved on — the demo
illustrates the card idea, not current canon).

The composition grammar the demo embodies (E2.1 will spec it properly):

- **One focal mass on a horizon band**; the rest of the frame stays
  negative space — the still, composed frame is the look.
- **Figures are featureless silhouette masses — never faces, never literal
  action.** The MC goes further: a **figure-scale void**, the
  spirited-away man drawn as the absence the light falls around (Sōan card).
- **A caption cartouche** — the vermillion seal-frame with vertical
  role-kanji (医 / 家令), the print's title-cartouche idiom.
- **One tint per card = the speaker's VN voice colour** (`--v-physician` /
  `--v-steward`), tying the cards to the dialogue system they'd sit above.

- `cards.ts` — `openSceneCards()`: the modal + both card painters.
  Seeded-deterministic, Andon tokens only, brush primitives reused from
  [`../map-sheets/brush.ts`](../map-sheets/brush.ts).

Reached via the DEV panel → Story pane → "⤢ Scene cards". Imported ONLY by
`ui/dev.ts`, so it rides the DEV strip fold like the map review sheets.

Later, separately-gated steps (NOT this demo): the E2.1 composition-grammar
spec + rubric, the HR read, the real E2.3 diverge (2–3 compositions of ONE
moment, taste-scorecarded), the keep/kill ruling — **kill stays a valid
outcome** — and integration into the cold open (gated on storywave Plan B).

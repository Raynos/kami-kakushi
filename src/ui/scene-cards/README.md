# scene-cards/ — the E2 graphics-exploration demo (v2 · kage-e)

The **VN scene-card pilot** (concept #12): two vignette cards for the cold
open's VN scenes — **Sōan's sickroom** ("You're awake.") and **Genemon's
grain-store** ("On your feet, then.") — each a still frame a scene card
would one day set above its dialogue.

**Status: DEV-only demo, zero game integration** — the prototype-first law
in
[`docs/plans/fable-2026-07-08-graphics-explorations.md`](../../../docs/plans/fable-2026-07-08-graphics-explorations.md)
(E2, pulled forward by the human 2026-07-08 as a single lightweight demo:
one version, no diverge, ahead of the E2.1 grammar spec). **v1 (figurative
room-scenes from map primitives) got the human's slop verdict** and was
rebuilt the same day in the 1+2 rescue direction the human picked
([`project/brainstorms/2026-07-08-e2-scene-card-rescue.md`](../../../project/brainstorms/2026-07-08-e2-scene-card-rescue.md)).
Text comes from the existing cold-open/intro/dialogue sources verbatim (the
story bible has since moved on — the demo illustrates the card idea, not
current canon).

The v2 style — what E2.1 would spec as the grammar:

- **Kage-e silhouette theatre.** Flat depth planes (foreground prop
  bleeding off frame · figures on a ground-shadow band · one flat
  voice-tint paper field) — no perspective, no rooms. Figures are pure
  near-black silhouettes in **strict profile**; all character lives in the
  crafted outline (nape step, chin/nose notch, sleeve, stoop) — drawn
  facial features stay banned. Bumps are arcs of points, never lone peak
  vertices (a peak renders as a spike).
- **The MC is a figure-scale paper void** cut out of the ground shadow
  (`fill-rule: evenodd`) — the spirited-away man is the one shape the
  shadow does not own, and the slat-light bands fall into the cutout for
  free.
- **Print-craft press layer.** A keyblock (silhouettes, props) over flat
  colour blocks that ride a seeded **misregistration slip** (a few px off
  the keyblock), with baren/paper grain (feTurbulence alpha masks) in the
  fills. Perfect registration is the tell of SVG art; the slip reads
  "printed object". The vermillion cartouche lives in the colour layer — a
  seal is a second press.
- **One tint per card = the speaker's VN voice colour** (`--v-physician` /
  `--v-steward`), tying the cards to the dialogue system they'd sit above.

- `cards.ts` — `openSceneCards()`: the modal + both card painters + the
  layer/filter stack. Seeded-deterministic, Andon tokens only, brush
  primitives reused from [`../map-sheets/brush.ts`](../map-sheets/brush.ts).

Reached via the DEV panel → Story pane → "⤢ Scene cards". Imported ONLY by
`ui/dev.ts`, so it rides the DEV strip fold like the map review sheets.

Later, separately-gated steps (NOT this demo): the E2.1 composition-grammar
spec + rubric, the HR read, the real E2.3 diverge (2–3 compositions of ONE
moment, taste-scorecarded), the keep/kill ruling — **kill stays a valid
outcome** — and integration into the cold open (gated on storywave Plan B).

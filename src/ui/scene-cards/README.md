# scene-cards/ — the E2 graphics-exploration demos (PARKED)

The **VN scene-card pilot** (concept #12): two vignette cards for the cold
open's VN scenes — **Sōan's sickroom** ("You're awake.") and **Genemon's
grain-store** ("On your feet, then.") — each a still frame a scene card
would one day set above its dialogue.

**Status: PARKED (human, 2026-07-08) — BOTH demo versions kept in code as
concept references**, per the human's call; neither advances until E2
un-parks. DEV-only, zero game integration — the prototype-first law in
[`docs/plans/fable-2026-07-08-graphics-explorations.md`](../../../docs/plans/fable-2026-07-08-graphics-explorations.md)
(E2, pulled forward by the human 2026-07-08 as a single lightweight demo:
one version, no diverge, ahead of the E2.1 grammar spec).

- `cards-v1.ts` — **v1, the figurative take** (room-scenes staged from map
  primitives): got the human's **slop verdict** — kept as the reference for
  what the toolkit can NOT carry (anatomy, perspective) and for the
  concepts worth saving (the lit void-MC, slat light, the cartouche).
- `cards.ts` — **v2, the kept look**: rebuilt same-session in the 1+2
  rescue direction the human picked
  ([`project/brainstorms/2026-07-08-e2-scene-card-rescue.md`](../../../project/brainstorms/2026-07-08-e2-scene-card-rescue.md)).

Text comes from the existing cold-open/intro/dialogue sources verbatim (the
story bible has since moved on — the demos illustrate the card idea, not
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

Both modules are self-contained (`openSceneCards()` / `openSceneCardsV1()`:
modal + card painters + layer/filter stack), seeded-deterministic, Andon
tokens only, brush primitives reused from
[`../map-sheets/brush.ts`](../map-sheets/brush.ts).

Reached via the DEV panel → Story pane → "⤢ Scene cards v2 — kage-e" and
"⤢ Scene cards v1 — figurative" (both labelled *parked*). Imported ONLY by
`ui/dev.ts`, so they ride the DEV strip fold like the map review sheets.

Later, separately-gated steps (NOT this demo): the E2.1 composition-grammar
spec + rubric, the HR read, the real E2.3 diverge (2–3 compositions of ONE
moment, taste-scorecarded), the keep/kill ruling — **kill stays a valid
outcome** — and integration into the cold open (gated on storywave Plan B).

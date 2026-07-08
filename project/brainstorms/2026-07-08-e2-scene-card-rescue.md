# E2 scene-card rescue — three art-style changes (s122)

**Context.** The s122 E2 demo (`src/ui/scene-cards/`) got the human's verdict:
*slop, amateur-town art*. Diagnosis: the cards attempted representational
illustration — mid-distance figures in a perspective-ish interior — which the
code-drawn toolkit has no draftsmanship for; the stamp book worked because it
is graphic design (flat, symbolic). The human rules some concepts redeemable
(the void-MC, the cartouche, the voice tint, the composed still frame) and
asked for the best 3 style changes. Status: **RULED — the human picked 1+2
(2026-07-08, same session); `src/ui/scene-cards/` rebuilt in that direction
the same day (v2).**

## 1 · Kage-e — full-commitment silhouette theatre

Every figure becomes a **pure flat silhouette in strict profile** — no grays,
no fold lines, no half-commitment; all character lives in the crafted OUTLINE
(the physician's bowed seiza wedge, the steward's stoop with hands clasped
behind). Stage the card in 2–3 flat planes like a shadow-lantern play:
foreground prop silhouette bleeding off frame, midground figures on a ground
band, background one flat voice-tint paper field. No perspective, no room.

- **Why it kills the slop:** gray blobs *trying* to be figures read amateur; a
  hard silhouette with a deliberate profile edge reads as a chosen language
  (kage-e is a real Edo parlor art; Reiniger proves the ceiling).
- **Theme resonance:** in a game about a spirited-away man, everyone is a
  shadow — and the MC inverts to a **paper void**, the one non-shadow. The
  redeemable void-MC concept lands harder here than in the demo.
- **Craft rule that makes or breaks it:** profile poses only — silhouettes are
  legible in profile and mud in 3/4 view.

## 2 · Print-craft honesty — fake the PRESS, not the drawing

Woodblock reads come from **press artifacts**, not linework: draw each card as
a dark **keyblock** (line layer) plus 2–3 **flat color blocks**, then
deliberately **misregister** the color group 2–4px off the keyblock; add
baren/woodgrain mottle inside fills (feTurbulence masks, already in our
vocabulary), ink-pool edge darkening, paper showing through.

- **Why it kills the slop:** the tell of "SVG art" is perfect alignment and
  uniform fills; misregistration + grain is the signature the eye reads as
  *printed object*. Deterministic, cheap, orthogonal.
- **Note:** this is a LAYER, not a direction — it upgrades whichever
  composition grammar sits under it (combine with 1 or 3).

## 3 · The intimate crop — one object, monumental, texture-forward

Grammar change: a scene card never depicts a room or staged scene. It depicts
**ONE hand-scale motif at monumental crop**, bleeding off the frame — Sōan = a
medicine chest face-on, drawers ajar, filling the frame; Genemon = the tawara
bale's torn mouth with rice pouring toward the viewer as a stipple river. The
object carries the craft as **texture** (woodgrain hatch, rope braid, grain
stipple) on a voice-tint field; caption answers "what moment is this?".

- **Why it kills the slop:** the toolkit's proven strengths are texture,
  pattern, and one confident shape (maps, stamps); its weaknesses are anatomy
  and perspective. This grammar bans the weaknesses outright.

## Recommendation

The real fork is **1 vs 3**, each taken **with 2** as the finishing layer.
Self-pick: **1 + 2** — a VN scene card wants its *speaker* present, and the
shadows-vs-paper-void inversion makes the style feel inevitable rather than
decorative. **3 + 2** is the safer floor if figures stay too risky.

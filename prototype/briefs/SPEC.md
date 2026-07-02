# Build spec — UI-v2 prototypes (uniform contract for every builder)

## Deliverable

Exactly ONE self-contained HTML file at the absolute path given in your
prompt. Nothing else. Do NOT read the game repo (especially not `src/ui/`) —
your frame must not inherit the current UI's shape; work only from your
three input files.

## Hard constraints

- **Self-contained, zero network.** No webfonts, no CDN, no image files, no
  fetch. Must open via `file://` with ZERO console errors. Inline CSS + JS +
  SVG only (canvas allowed). One `<style>`, one `<script>` (at end of body).
- **System fonts only** (macOS target, always with fallbacks):
  JP — "Hiragino Mincho ProN", "Toppan Bunkyu Midashi Mincho", "Toppan
  Bunkyu Mincho", "Yu Mincho", "Klee", "Hiragino Kaku Gothic ProN",
  "Hiragino Maru Gothic ProN"; Latin — "Iowan Old Style", Baskerville,
  "Hoefler Text", Palatino, Optima, Seravek, Charter, Georgia.
- `<title>Kami-kakushi — <Concept name></title>` + viewport meta.
- Desktop 1440×900 is primary. At 390px wide it must stay usable per your
  brief's mobile strategy (best effort, never broken): no BODY horizontal
  scroll (inner scrollers/pans are fine).
- `prefers-reduced-motion` fully respected per your brief's reduced-motion
  story. Keyboard focus visible. `font-variant-numeric: tabular-nums` +
  reserved width on every live number.
- Performance: animate transform/opacity; bake feTurbulence into static
  layers; obey your brief's own performance mitigations.

## It must be a LIVING mock (this is what sells it)

Load directly into the **hour-three** preset with auto-tick ON — alive
within 2 seconds: numbers easing, a deed happening, ambient motion (subtle).
All six demo beats from DATA.md must be playable. Fake everything; keep a
tiny state object; no game logic beyond what the demo needs.

## Uniform dev strip (so QA can drive every prototype identically)

A small fixed strip, bottom-right, styled as quiet dev chrome (muted,
monospace ~10px, opacity .55, hover 1; collapsed is fine but buttons must
exist in DOM). It must contain buttons with EXACTLY these attributes:
`data-dev="tick" | "fight" | "rung" | "judge" | "reveal" | "season" |
"auto" | "reset" | "stage-1min" | "stage-3hr" | "stage-10hr"`, plus the
concept name as a tiny label. The strip is dev chrome — exempt from the
period styling, but keep it dark/quiet, never white.

## Taste contract (hard)

Banned: purple/blue web gradients, glassmorphism, glow/neon, generic rounded
card grids, pill radii, uniform drop-shadows, raw #FFF/#000 surfaces, ad-hoc
type sizes, static walls of numbers, number jitter, dead grey locked items
(locked = visible mystery, your brief says how), per-tick particles/shake/
confetti, emoji-as-icon-system, colour as the only signal. Required: your
brief's own palette as CSS custom properties; a fixed type scale (pick ~5
sizes, stick to them); depth from material + ink weight, not shadows; ONE
rare accent reserved for milestones; significance-gating (routine quiet,
milestones loud); real copy from DATA.md only.

## The bar

A player should believe a really good indie/AA studio shipped this screen
(the craft register of Pentiment / Balatro / Banner Saga, in pure
HTML/CSS/SVG). Commit totally to your brief's ontology — its SIGNATURE MOVE
must be unmissable within 10 seconds. Spend your boldness there; keep
everything around it quiet and disciplined. Before finishing, remove one
accessory (Chanel). A partial concept executed brilliantly beats a complete
concept executed adequately.

## Return (your final message — no file dumps)

1. SELF-REVIEW: what reads handmade; what still smells generic; signature
   move — landed or compromised (why).
2. DEMO SCRIPT: how a human should spend 60 seconds with it.
3. KNOWN GAPS: what you'd do with another hour.

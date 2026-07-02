# THE HOUSEHOLD STAGE — concept brief

## 1. THESIS

The screen is a single horizontal sumi-e handscroll (emaki) of the Kurosawa estate, side-staged like Banner Saga: your figure lives in it, works in it, and is *addressed* in it — beneath the painting, one cedar ledge (the engawa dock) holds every earned system as a physical object. This makes the game more fun because the cast and ceremony copy stop being log lines and become **staged events you watch happen to a person you can see** — and an estate you watch is an estate you leave open.

## 2. WIREFRAME

```
┌────────────────────────────────────────────────────────────────────── 1440px ┐
│  ◦ house mon (settings)                          睦月 · 十四日 · 🌓 waxing ── │
│                                                                              │
│      ~~ far ridge (0.3× parallax) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    │
│        [奥山]   [里山]    [杣]      [田圃]   [門前]   [蔵]      [稽古場]      │
│                            ▲treeline            ⛩       ▓kura              │
│                 (wolf shape resolving)     YOU→ 卂 raking   Genemon standing  │
│                                                 田圃 「田を打つ」← in-scene verb│
│  ‥‥ newest log line brushes along this margin: "You rake the spilled…" ‥‥   │
├──────────────────────── ENGAWA DOCK (cedar ledge) ───────────────────────────┤
│ [fuda: TAMA?]  [rung rail: 日雇|下人|▮▮▮░手代]  [coin string] [rice tally]     │
│  HP ▮▮▮░ 46/58   ink meter fills toward R2      ¤ 34 mon     米 112 (蔵 480) │
│ [diary 日記]   [verbs 1–4 mirror]   ( empty mortise )  ( empty mortise )      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Mobile: stage letterboxes to 16:9 up top; the ledge becomes one horizontally swipeable tray; ceremony text drops vertical-rl for horizontal.

## 3. ANATOMY

- **Log** — newest line brush-writes along the stage's lower margin like an emaki caption, then binds into the **Diary** dock panel (Klee hand; dreams accumulate here in a paler ink).
- **Verbs** — anchored in-scene at each of the 7 nodes; click a distant node and your figure *walks* (scene pans, 3-layer parallax). The dock **mirrors** the current node's verbs as keys 1–4, so watching is optional, playing is fast.
- **Vitals** — your wooden name-fuda ("Tama?") on the dock's left: HP as ink strokes, satiety as a rice-bowl glyph.
- **Resources** — carried = visible load on your figure (pole, basket) + numeral echo; banked = the kura's doors/bales visibly fill; authoritative numbers live only in fixed dock slots.
- **Rung meter** — a fuda rail: eight slots, current rung's fuda fills with ink toward the ceremony.
- **Combat** — staged in-scene (see Key Moments); forecast + stance glyphs overlay the held scene.
- **Quests/market/skills** — earned dock objects; the market panel exists only while the pedlar figure physically stands at the gate.
- **Settings** — the small house mon, top-left corner of the frame.

## 4. SIGNATURE MOVE

**The Entrance & Address.** When a named character addresses you, the dock dims to underpainting, ambient loops still, the figure walks into frame — and their line is set **vertically (writing-mode: vertical-rl, Toppan Bunkyu Midashi Mincho)**, hanging in the painting's sky like an emaki inscription, brush-revealed character by character. No portrait box, no dialogue window: the words share the air with the scene. Every ceremony, teaching, and greeting uses this one mechanism.

## 5. KEY MOMENTS

- **(a) Deed tick** — the rake pose loops; a small "+3 米" rises by your hands, settles into the carried tag with an eased count-up; the margin line brushes in. Quiet.
- **(b) Fight** — a shape resolves at the treeline into the wolf; the scene drains to pure sumi; the forecast is a single vertical stroke whose ink-load *is* the odds — 「二九分」 29% — held as a breath. Choosing jodan visibly re-poses your silhouette. Auto-resolve plays as 3–4 ink-flurry beats; the verdict line brushes in.
- **(c) Rung-up** — Kihei enters; Entrance & Address speaks the real gate-watch charge; a new fuda is knocked onto the rail (woodblock *thock*) and stamped with the **bengara seal** — the game's one accent.
- **(d) Seasonal judge** — the messenger arrives; the koku standing is brushed enormous across the sky and held; then the whole scroll repaints into the new season under your feet.
- **(e) Panel reveal** — locked systems are **empty mortises** cut into the cedar ledge, visible from minute one. When earned, a sleeved hand reaches from off-frame and *sets the object into its joint*, named by one line.
- **(f) Minute one** — near-black washi, one lamp pool, your figure on the ground. No dock — the ledge hasn't been drawn yet. One verb in the dark: 「起きる」 *Rise.*

## 6. MATERIAL & TYPE

Palette: **揉紙 washi #E8DCC3** (ground) · **墨 sumi #2A241D** (ink/figures) · **薄墨 usuzumi #8C7F6D** (wash, dimmed states) · **杉 cedar #6E5540** (dock) · **藍 ai #3E4E5E** (the scroll's single pigment: sky, water, indigo cloth) · **弁柄 bengara #A63F2C** (milestone seal only). Type: display/ceremony = Toppan Bunkyu Midashi Mincho; body = Hiragino Mincho ProN + Iowan Old Style; utility numerals = Optima, tabular, reserved width; diary/dreams = Klee. Depth comes from ink-weight and material seams (paper grain via one cached feTurbulence layer, cedar joinery lines) — zero drop-shadows.

## 7. MOTION SCRIPT

1. **Count-ups** — 400ms, cubic-bezier(.2,.8,.2,1), tabular figures.
2. **Brush-reveal** — clip-path sweep, ~30ms/char stagger; ceremony verticals 80ms/char, top-down.
3. **Walk & pan** — constant ~110px/s, parallax 0.3×/0.6×/1×, 300ms ease-in-out at endpoints.
4. **Ink flurry** (combat beats only) — sumi splash scale .8→1, opacity 1→0, 450ms ease-out.
5. **Breath-hold** — ambient loops decelerate to still over 600ms while dock dims to 40%; release on resolve.
Reduced motion: all reveals become ≤150ms crossfades, pans become node-to-node crossfades, numbers snap to final value, ambient loops freeze — every state still fully reachable.

## 8. FUN AMPLIFIERS

1. **Numbers have bodies** — rice is a bale on your back and a fuller kura door; the numeral confirms what your eyes already earned.
2. **Foreshadowed ceremony** — as the rung fuda nears full, the granter begins *lingering in-scene* near where the ceremony will happen; the goal gradient becomes a person waiting for you.
3. **Rate as tempo** — income rate drives the work animation's tempo; you read prosperity by watching the estate move, fish-tank style.

## 9. RISKS

- **Legibility** — numbers scattered in a painting get lost. *Mitigation:* in-scene numerals are echoes only; every authoritative value lives in a fixed dock slot in tabular Optima.
- **Sumi-e kitsch / AI-slop ink** — bad procedural brushwork reads as slop instantly. *Mitigation:* hard art constraints — two-tone silhouettes, one pigment, a fixed ~12-pose figure library, feTurbulence restricted to paper grain and stroke edges; no gradients inside figures.
- **Performance** — parallax + SVG filters at 24 ticks/day. *Mitigation:* filters rendered once and cached on the static paper layer; all runtime motion is transform/opacity only; max 3 concurrent ambient loops.

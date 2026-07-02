# THE FILLING KURA 蔵 — concept brief

## 1 · THESIS

The screen is not a dashboard about your wealth — it **is the storehouse**, one continuous candle-lit room whose contents are your save file. This makes the game more fun because accumulation becomes *spatial*: every deed adds a visible object to a room you are slowly filling, so progress is felt with the eyes before it is read as a number.

## 2 · WIREFRAME (desktop ~1440px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ THE BEAM 梁 — chalked: season·day·moon ── judge's koku figure ── rung marks  │
├───────────────┬────────────────────────────────────────────┬─────────────────┤
│ NORTH SHELVES │                 THE FLOOR                  │  DOOR & YARD    │
│ (banked)      │                                            │                 │
│ rice baskets  │   held tool = current verb; rake strokes   │ sliding door →  │
│ coin strings  │   pull spilled rice into the basket        │ estate map 絵図  │
│ on pegs       │                                            │ 7 nodes, you    │
│ cordwood      │   ── combat: the wolf among the sacks ──   │ walk as a       │
│ sansai bundles│   slate: 勝算 三割 (29%) · stance placard    │ lantern dot     │
│ materials rack│                                            │                 │
│ …empty pegs = │   BALE STACK (rung meter) ▓▓▓░ → beam-line │ quest slips 貼紙 │
│  mysteries    │                                            │ pedlar unpacks  │
├───────────────┴────────────────────────────────┬───────────┴─────────────────┤
│ CHŌBA DESK — daifukuchō daybook: the living    │ HEARTH — pot (meals→HP),    │
│ log, brushed line by line; cinnabar milestone  │ door-tag 木札 (HP, attrs),  │
│ seals; older pages dim                         │ pack 背負子 = carried pools  │
└────────────────────────────────────────────────┴─────────────────────────────┘
```

**Mobile:** portrait puts you *standing inside* the kura facing one wall at a time — swipe pans the room; the desk (log + verb) stays pinned to the bottom edge.

## 3 · ANATOMY

- **Log** = the daifukuchō account-book on the chōba desk; every line brushed in, milestones sealed in cinnabar.
- **Verbs** = the tool in your hands; the tool rack holds the rest, each haft labelled in ink (no mystery-meat).
- **Vitals** = hearth corner: the pot is meals/satiety; the wooden door-tag carries HP notches and flips for STR/AGI/INT/SPD/LUCK spends.
- **Resources**: banked = shelves; carried = the pack by the door. Deposit animates pack→shelf.
- **Rung meter** = the rice-bale stack climbing to R-marks chalked on the beam-line.
- **Map** = sliding the door open reveals the painted estate board; walking is your lantern dot moving.
- **Combat** = the foe enters *the room*; forecast chalked on a slate (勝算 三割), stances on a three-mark placard.
- **Quests** = paper slips pinned by the door; **market** = the pedlar unpacking in the doorway; **skills** = tally-burns on each tool's haft; **settings** = the iron door-fitting.

## 4 · SIGNATURE MOVE

**The Hundred-Mon Knot.** Every coin earned physically drops onto the current string through its centre hole and *swings*, damped, like a real strung mon. At exactly 100, the string is knotted, lifted, and hung on the next peg — wealth is readable at a glance as strings-on-pegs, and the 100th coin is a tiny ceremony you start playing toward. Buildable: one SVG path per string + a coin count; only the newest coin animates.

## 5 · KEY MOMENTS

- **(a) Deed tick:** rake stroke → grains slide into the basket (heap steps up one authored fill-state), the Klee ink tally re-brushes 142→145, one daybook line appears. Quiet.
- **(b) Fight:** the candle dims; a wolf silhouette between the sacks; slate chalks 29%; you set the stance placard; blows land as ink slashes and lantern flickers; a loss spills coins across the floor to be re-gathered — most, not all.
- **(c) Rung-up:** the room stills; Genemon's shadow at the door; a new bale is hoisted onto the stack and *meets the beam-line*; the rung's name is chalked on the beam; a cinnabar seal stamps the daybook.
- **(d) Seasonal judge:** a lantern-pass sweeps the shelves, lighting each heap as it's counted, tallies re-brushing; then the koku figure is chalked large on the main beam and weathers there all season.
- **(e) Reveal:** first sansai gathered — "Nowhere to hang them. Genemon nods at the north wall." A drying rack inks itself onto the plaster stroke-by-stroke; its *empty pegs* remain as visible promises.
- **(f) Minute one:** near-black. One candle's radius. Spilled rice on the boards, a rake leaning. One verb: *Rake the spilled rice.* Each stroke widens the light a hair; you sense sacks in the dark.

## 6 · MATERIAL & TYPE

Palette: **煤 soot-beam #241E19** · **漆喰 plaster #CFC3A8** · **杉 cedar #6E4A2E** · **藁 straw-gold #C89B3C** · **藍 indigo #34455C** · **朱 cinnabar #A93B26** (milestones ONLY). Type: **Toppan Bunkyu Midashi Mincho** for beam-chalk and ceremony; **Hiragino Mincho ProN / Iowan Old Style** for the daybook; **Klee** for heap tallies and marginalia (tabular figures, reserved width). Depth comes from ink-weight, overlap, and candle-light falloff — objects nearer the flame are warmer and higher-contrast; no drop-shadows anywhere.

## 7 · MOTION SCRIPT

1. **Grain-slide** — ≤8 grains arc into the heap, 300ms ease-out; tally count-up 400ms.
2. **Coin drop-and-swing** — 250ms cubic-in fall, 1.2s damped pendulum; knot-and-hang 900ms ease-in-out.
3. **Candle flicker** — 4s subtle radius/opacity noise loop; dims 600ms for combat.
4. **Ink-in reveal** — stroke-dashoffset draw of new furniture, 1.6s, visible stroke order.
5. **Judge's chalk** — koku numeral drawn 1.2s with one chalk-dust puff.
*Reduced-motion:* counts snap, swings settle in one frame, ink-in crossfades, flicker off; no information lives in motion alone.

## 8 · FUN AMPLIFIERS

1. **Mass is pre-numeric** — a bulging basket vs a scatter is felt before it's read; the bale stack makes goal-gradient literal geometry.
2. **Defended, not displayed** — combat happens *among your things*; the stakes are the room itself, and a spill stings visibly.
3. **Empty pegs are promises** — locked capacity reads as furniture waiting to be filled, so anticipation is spatial, never a grey box.

## 9 · RISKS

- **Legibility** — heaps read vague → every heap carries a fixed-position ink tally; heaps quantize to ~12 authored fill-states; hover reveals the exact ledger line.
- **Kitsch** — skeuomorphic clutter → strict woodblock reduction: flat ink shapes, ≤3 tones per object, one global feTurbulence paper grain, zero photo-texture.
- **Performance** — hundreds of coins/grains → heaps are path-swaps not particles; strings render as one path + count; particles capped at 8, deed-triggered only.

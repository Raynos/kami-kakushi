# NISHIKI-E IN PROGRESS 摺 — Concept Brief

## 1. THESIS
The screen is a single ukiyo-e print of the Kurosawa estate, mid-production: you are looking at the paper on the printer's bench, and every system you unlock pulls one more colour block onto it. Progress becomes *visible fidelity* — the player doesn't read that the house is rising, they watch their world gain colour separations, which turns every meter in the game into art the player made.

## 2. WIREFRAME (desktop ~1440px)

```
┌────┬──────────────────────────────────────────────────────┬──────────────┐
│PROOF│  ┌題┐                 THE PRINT                      │ MARGIN NOTES │
│STRIP│  │字│   奥山 ~~~ 里山 ~~ 杣 ~~ (blind-embossed)      │ (log, Klee)  │
│ ▓sumi│ └──┘      \        |                               │ 春・三日      │
│ ▓ai │            稽古場   田圃 ← your figure, walking      │ You rake the │
│ ▓ōdo│      蔵 ═══╗   \   /   [combat composes HERE,       │ spilled rice │
│ ░next│     ╔════╝    門前     forecast cartouche 29%]     │ back… (+3米) │
│ :rung│    ╚═(kura cartouche unfolds: banked pools)        │ ──────────   │
│ meter│         ⊕ verb-stamps appear AT the place clicked  │ ●beni: rung  │
│ 改seal│                                    [publisher mark]│  moments     │
├────┴──────────────────────────────────────────────────────┴──────────────┤
│ BENCH: HP dish◐ 満腹◑ │ 携 rice 12 coin 34 wood 5 │ 蔵 banked… │ 農採樵鍛 │⚙kentō
└───────────────────────────────────────────────────────────────────────────┘
```
**Mobile:** the print stays whole and pans; bench strip pins to bottom; margin notes become a pull-up scroll from the bench; proof strip collapses to the current swatch.

## 3. ANATOMY
- **Log** — right margin annotation column, a diarist's hand (Klee); routine entries in sumi, milestones stamped beni. It is the *only* prose surface.
- **Verbs** — contextual carved seal-stamps that appear in a small cartouche anchored to the estate node you clicked; you walk there first (your printed figure moves along the road keylines).
- **Vitals** — bottom bench strip: HP and satiety as two pigment dishes that visibly drain/fill.
- **Resources** — bench strip, tabular figures, reserved width: carried pools always visible; banked pools live inside the kura cartouche, which unfolds only when your figure stands at the kura (deposit/withdraw there, as the game demands).
- **Rung meter** — left edge: a printer's *progressive proof strip*. Each pulled plate is a filled swatch; the next rung is a swatch filling top-down. Goal gradient, made of pigment.
- **Combat** — a two-figure exchange composes into the scene itself; win-rate forecast in a red-keyed cartouche; the three stances are three tiny figure-pose seals (下段/中段/上段).
- **Quests** — the publisher's slip pinned in the top margin. **Market** — the pedlar figure enters the print on the road; clicking him opens his pack as a cartouche. **Skills** — the colophon block (農採樵鍛) with brush-fill levels. **Settings** — the kentō registration mark, bottom-right.

## 4. SIGNATURE MOVE
**The baren stroke.** Every unlock prints a new colour plate: a flat pigment field sweeps diagonally across its masked regions (SVG clip-path + a translated grain-textured rect), settles with a 60ms registration "thunk" (2px snap into place), and a matching swatch fills on the proof strip. One gesture, reused for every reveal, so the player learns: *colour arriving = I grew*. It is buildable as one parameterised animation.

## 5. KEY MOMENTS
- **(a) Deed tick** — the worked region's linework micro-sways (rice stalks, 300ms), the value drifts as a brush numeral into the margin log, bench count eases up. Quiet.
- **(b) Fight** — the wolf prints into the scene in key-line only; forecast cartouche shows 29% with stance seals below; each exchange is an impression-flash (figures swap poses); victory flecks the beast's keyline with beni; loss = your figure limps the road home at 1 HP, goods falling as small printed shapes.
- **(c) Rung-up** — the whole print lifts off the block (4px rise, paper shadowless — a tone shift), re-registers, one new pigment sweeps in, and the rung name is stamped as a beni seal beside the title cartouche.
- **(d) Seasonal judge** — the entire palette re-inks to the season's key over 2s; the koku standing is stamped with the censor's 改 seal, count-up inside it.
- **(e) Panel reveal** — a locked surface (bestiary, colophon) first exists as *karazuri* — blind embossing, inkless relief in the washi, a visible mystery. Unlock inks it with the baren stroke.
- **(f) Minute one** — bare textured washi. Only the kura corner exists, in sumi keyline. One verb-stamp: *rake the spilled rice*. Everything else is faint emboss. One verb against the dark, literally uninked.

## 6. MATERIAL & TYPE
Palette (all pigments, flat, no gradients): **washi** #E9DCBB, **sumi** #2A2420, **ai** indigo #3A5566, **ōdo** ochre #C08F3F, **rokushō** green #5F7355, **beni** #AE3B2E — beni is the milestone accent, used nowhere else. Type: **Toppan Bunkyu Midashi Mincho** for cartouches/seals (display), **Hiragino Mincho ProN + Iowan Old Style** body, **Klee** for the margin log, tabular-figure mincho on the bench. Depth = ink-weight and layered flat pigment with slight misregistration offsets (1px keyline/colour slip — period-true), plus karazuri emboss (paired light/dark 1px strokes). No drop-shadows anywhere.

## 7. MOTION SCRIPT
1. **Baren sweep** — pigment field wipes diagonally, cubic-bezier(.2,.8,.2,1), 900ms + 60ms snap.
2. **Count-ups** — eased 400ms, tabular figures, reserved width; no jitter.
3. **Figure walk** — 240ms steps along road path, steppy (steps(2)) like block-printed frames.
4. **Deed sway** — worked region strokes rock ±1.5°, ease-in-out 300ms.
5. **Seasonal re-ink** — global palette crossfade via CSS variables, 2s linear.
**Reduced motion:** sweeps and walks become instant crossfades; count-ups become single swaps; the registration thunk becomes a one-frame ink-darken. Nothing is lost semantically.

## 8. FUN AMPLIFIERS
1. **The proof strip** makes the rung climb *material*: you're not filling a bar, you're pulling impressions — and the strip is a permanent trophy of every plate you've earned.
2. **Numbers land somewhere real**: +3 rice sways actual paddies and inks the margin; the stat and the world are the same object, so grinding redraws your picture.
3. **Comparative memory**: because minute-one's bare washi was seen, every glance at the polychrome screen is an implicit before/after — the whole UI is a progress screenshot.

## 9. RISKS
- **Legibility** — scene-as-UI can bury numbers. Mitigation: the bench strip is a permanent, boring-on-purpose tabular ledger; the print never carries load-bearing digits alone.
- **Kitsch/pastiche** — too much furniture reads theme-park. Mitigation: hard cap of six pigments, flat fields only, furniture arrives one piece per unlock (scarcity is the aesthetic).
- **Performance** — feTurbulence on everything tanks paint. Mitigation: render the washi grain once as a single fixed filter layer (or pre-rasterised data-URI), keep plates as plain flat SVG.
- **Ergonomics** — small in-scene targets. Mitigation: generous invisible hit regions per node (min 48px), keyboard cycling between nodes, verbs always restated as stamps at fixed anchor sizes.

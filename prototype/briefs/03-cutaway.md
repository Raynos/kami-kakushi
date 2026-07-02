# YASHIKI CUTAWAY 屋敷断面 — Concept Brief

## 1. THESIS
The screen is a carpenter's cross-section of the Kurosawa estate — a hand-inked elevation you inhabit, where every panel, meter, and menu is a physical place your small figure must walk to. This makes progression *architectural*: numbers going up become rooms relighting, bales stacking, roofs re-thatched — the ant-farm pleasure of Fallout Shelter rendered in sumi ink, where the house itself is the save file you can read at a glance.

## 2. WIREFRAME
```
┌────────────────────────────────────────────────────────────────────────────────┐
│ SKY · season wash, moon phase, weather      安永九年 春 · 三日 ◐  (brushed date)│
│   ~~ 奥山 deep ridge (fogged) ~~ 里山 near hills ~~     [judge's koku seal here]│
├────────┬──────────────────────────────────────────────┬─────────┬─────────────┤
│ 門前    │ MAIN HOUSE — cut-open bays                   │  蔵      │  稽古場      │
│ gate &  │ hearth │ engawa │ ▓dark ruined bays▓         │ kura:   │ drill yard  │
│ forecourt  (smoke when cooking)   (U3/U4 scaffolds)    │ drawn   │ (▓ruin til  │
│ ┌────┐  │ ═ rung meter: sumitsubo ink-line on the      │ bales = │  U2, then   │
│ │高札│  │   main beam, filling toward 手代 ═══▒▒▒▒      │ banked  │  flails &   │
│ └quest──┘   board                                      │ stock   │  dust)      │
│  ⚔ beasts enter here ←        ● you, walking →         │         │             │
├────────┴──────────────────────────────────────────────┴─────────┴─────────────┤
│ 田圃 paddies · road (pedlar walks in here) ······ ground line ················ │
│  fuda verbs pinned at your feet:  ⟨米を掻き集める rake the rice⟩ ⟨田を打つ till⟩ │
├────────────────────────────────────────────────────────────────────────────────┤
│ LOG STRIP  "You rake the spilled rice back toward the basket. (+3 rice)"       │
│ furoshiki(carried): 米12 文8 薪3    身 41/58    ⚙ inkpot (colophon/settings)   │
└────────────────────────────────────────────────────────────────────────────────┘
```
**Mobile:** the section keeps full height and pans horizontally, camera glued to the figure; fuda verbs and the log dock to the bottom edge.

## 3. ANATOMY
- **Narrative log** — the ground-line strip beneath the section; newest line inked darkest, older lines fading like drying ink. It is the earth the house stands on.
- **Verbs** — paper fuda tags pinned where you stand; only the current place's verbs exist. Walking *is* the menu system.
- **Vitals** — HP as a small strip beside the figure (身 41/58); the figure's posture slumps below half. Meals are cooked at the hearth, where smoke is the affordance.
- **Resources** — carried = a furoshiki bundle readout tied to the figure; banked = literal drawn stock inside the kura (bales, wood cords, coin box). Deposit/withdraw only when standing inside it.
- **Rung meter** — a sumitsubo ink-line snapped along the main beam, filling stroke-by-stroke toward the next rung's kanji.
- **Map & walking** — the section IS the map; click a bay, the figure walks, that bay's ink-weight deepens and its interior detail resolves.
- **Combat** — staged in-scene at the gate or field edge; the beast physically enters. Forecast is a brushed slip: 勝目 二分九厘 (29%); stance = three small brush-figure silhouettes (下段/中段/上段) you tap.
- **Quests** — the kōsatsu notice-board (高札) in the forecourt, period-correct. **Market** — the pedlar walks the road in; his pack unrolls on cloth. **Skills** — tally-strokes brushed on the post of each worksite (farming tallies on the paddy shed). **Settings** — the inkpot icon opens a colophon slip.

## 4. SIGNATURE MOVE
**Rooms are the menus.** No overlay panel ever opens: the camera leans 12% into whichever bay the figure occupies, its linework thickens from 0.75px to 1.5px strokes, interior objects resolve (bales become countable), and its fuda become live. Everything else recedes to ghost-weight ink. The player never "navigates UI" — they walk their house, and the house answers.

## 5. KEY MOMENTS
- **(a) Deed tick:** the figure's rake loops; a small "+3" numeral rises from his hands into the tally fuda; one log line prints; a bale edge in the kura darkens a stroke. Quiet.
- **(b) Fight:** the wolf slinks in from the dark edge of the section. Time holds; the forecast slip unrolls; you set a stance. The exchange is three ink strokes crossing; win = the beast's line unravels off-screen; loss = your figure limps home along the ground line at 1 HP, goods tumbling.
- **(c) Rung-up:** the whole section dims to dusk, one lamp stays lit; a card in heavy display mincho — 門番 — receives a vermilion seal stamp (the only accent in the game); your drawn figure permanently gains a detail (haori line, pole).
- **(d) Seasonal judge:** a figure arrives along the road, walks the section as a lantern-glow crosses each pillar's rooms; the koku number is brushed large onto the sky, then shrinks to a seal that stays there all season.
- **(e) Panel reveal (U1):** scaffold lines draw on via stroke-dashoffset, thatch hatching fills, the dark kura bay warms and relights — and only then do its banked-ledger fuda exist.
- **(f) Minute one:** near-black indigo night; the entire section a faint ghost outline; one candle-lit engawa where you lie; a single fuda: "rake the spilled rice." The house un-fogs bay by bay as your feet first learn it.

## 6. MATERIAL & TYPE
Palette: **washi cream #E9DFC7** (ground), **sumi ink #2B2620** (line/type), **aged cedar #9C7B57** (timber fills), **aizome indigo #34465A** (night, sky, cloth), **candle amber #C99347** (lit interiors), **shu vermilion #A63A22** (milestone seal ONLY). Type: display = Toppan Bunkyu Midashi Mincho (ceremony cards, rung kanji); body = Hiragino Mincho ProN / Iowan Old Style (log, slips); marginalia = Klee (tallies, pedlar's prices); numerals tabular, width-reserved. Depth = ink-weight (ghost 0.5px → active 1.5px), paper tone shifts, and feTurbulence washi grain — never a drop-shadow.

## 7. MOTION SCRIPT
1. **Walk** — figure translates along the ground line, 90px/s linear, legs a 2-frame ink swap.
2. **Bay focus** — scale 1.0→1.12, stroke-width crossfade, 450ms cubic-bezier(.2,.8,.2,1).
3. **Count-up** — numerals ease over 600ms ease-out, fixed-width, no jitter.
4. **Carpentry reveal** — stroke-dashoffset draw-on 1.8s ease-in-out, then fill fade 600ms.
5. **Seal stamp** — vermilion scales 1.4→1.0 with 80ms overshoot, paper darkens beneath.
**Reduced motion:** walks become 200ms crossfades between bays; count-ups snap with a brief weight-flash; draw-ons become fades. The scene stays alive through state, not movement.

## 8. FUN AMPLIFIERS
1. **Stock is stuff:** +40 rice isn't a digit — it's another drawn bale in the kura you walk past every day. Hoarding becomes visible wealth.
2. **The house is the progress bar:** every session's establishing shot shows exactly how far you've come — scaffolds, new thatch, relit rooms — before a single number is read.
3. **The sumitsubo rung-line** sits on the architecture you're restoring, so goal-gradient pull and place-attachment are the same feeling: the beam fills, the ceremony nears.

## 9. RISKS
- **Legibility:** an in-scene HUD can bury numbers in illustration. → Fuda always render on flat washi chips at fixed type sizes, never over hatching.
- **Kitsch:** "cute dollhouse" undercuts the spare voice. → Ban faces/chibi; the figure stays a 20px brush silhouette; humor lives in the log copy only.
- **Performance:** a full-screen SVG with turbulence filters can crawl. → Rasterize the paper grain once to a canvas layer; animate only transforms/opacity; cap the live scene at ~300 nodes.

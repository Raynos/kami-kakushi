# THE UNROLLING SCROLL — Kami-kakushi as a living emaki (絵巻)

**Why this beats the six taken frames:** every one of them is a *place the UI lives in*; the handscroll is the only frame where **the camera, the log, the map, and the progression system collapse into one physical object**. An emaki is already a game loop: continuous painted space read right-to-left, scenes divided by gold mist, text columns (詞書) interleaved with picture — a period-true artifact whose *native affordance is scrolling*, the one gesture browsers do perfectly. The board, the desk, the cutaway all still need a separate log and a separate map; the scroll IS both, and "no reset, the world only widens" gets a literal body: the paper only gets longer.

## 1. THESIS
The screen is a horizontal picture-scroll being painted *as you live it* — your deeds brush themselves onto the leading edge while the estate's seven places exist as contiguous painted scenes along the paper. This makes the game more fun because progress acquires physical length and weight: every tick adds paper to the take-up roller, every rung is a section you can drag back and re-read, and the future is always a hand-width of blank washi glowing past the mist.

## 2. WIREFRAME (~1440px)
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  hanging fuda tags:  ⌾依頼 quests  ⌾行商 pedlar  ⌾技 skills      (top selvage)  │
├────┬──────────────────────────────────────────────────────────────────────┬────┤
│████│   ← the past (painted, drag to re-read)        NOW          mist     │▒▒▒▒│
│█ta█│ ┌ scene 門前 gate ┐  ┌──── scene 田圃 paddies ────┐  ≈≈≈≈  ┌ faint  ┐ │▒cl▒│
│█ke█│ │ painted figures │  │  YOU ⛢   dikes, kura bg    │  ≈≈≈≈  │ under- │ │▒os▒│
│█-up│ │ 詞書 text cols   │  │  詞書 log columns brush in →│  ≈≈≈≈  │ drawing│ │▒ed▒│
│█rl█│ │ (vertical-rl)   │  │  verbs: [耕す Till] [運ぶ]   │  ≈≈≈≈  │ sketch │ │▒rl▒│
│████│ └─────────────────┘  └────────────────────────────┘        └────────┘ │▒▒▒▒│
├────┴──────────────────────────────────────────────────────────────────────┴────┤
│ HP 41/58 ▰▰▰▱ 飯◦ │ 手 carried 米12 文85 薪3 │ 蔵 banked 米210 文460 │ 春·17日 ☽ │
│ R3 門番 ━━━━━━━━●─────── R4 蔵番                        奥書 colophon ⊙settings │
└────────────────────────────────────────────────────────────────────────────────┘
```
**Mobile:** the scroll stays horizontal — swipe *is* unrolling; verbs and vitals dock into a thumb-height bottom selvage.

## 3. ANATOMY
- **Narrative log** = the scroll itself: vertical-rl 詞書 columns brushing in at the leading edge, interleaved with the painted scene they describe. English body text runs horizontal inside the column block, styled as a translation gloss.
- **Verbs** = ink-brushed labels pinned under the scene you stand in; only the current place's verbs are live.
- **Vitals & resources** = the bottom selvage (the scroll's backing paper): HP, meal state, carried 手 vs banked 蔵 in tabular figures. Deposits happen only when the kura scene is in view.
- **Rung meter** = the selvage line filling toward the next title, doubled ambiently by the take-up roller visibly fattening.
- **Map & walking** = the scroll IS the map: seven contiguous scenes separated by suyari-gasumi mist bands; choosing a place glides the camera there.
- **Combat** = in-scene: the wolf is painted into your scene; the forecast is a slipped-in omen paper ("勝 29 in 100"); stances are three brush marks (下段/中段/上段) under your figure; blows land as ink strokes.
- **Quests / market / skills** = fuda tags hanging from the top selvage; the pedlar literally walks onto the paper from the left.
- **Settings** = the colophon 奥書 at the scroll's tail.

## 4. SIGNATURE MOVE
**The un-rolling.** Locked content is never a grey box — it is the closed right roller, and past the mist you can always see a sliver of blank washi with faint under-drawing (sketch lines of a scene not yet earned). When a reveal triggers, the roller turns, paper physically extends (~240px), the under-drawing darkens stroke by stroke into a finished scene, and one narrated column brushes in: *"Kihei sets you to the estate's defence… You are the gate-watch now."* Buildable: SVG roller rotation + width transition + stroke-dashoffset draw-on.

## 5. KEY MOMENTS
- **(a) Deed tick:** "You rake the spilled rice back toward the basket. (+3 rice)" wipes in as one thin column; selvage count eases up; a hair of paper winds onto the roller. Quiet.
- **(b) Fight:** wolf figure fades into your scene's dark edge; omen slip shows 29/100; you set a stance mark; strokes flick; on the win, the column narrates the escape. Loss: your figure limps left one scene, carried numbers drop.
- **(c) Rung-up:** the scroll glides to fresh paper; your new title brushes in as a heavy display-mincho section heading with a small black kaō signature.
- **(d) Seasonal judge:** the season's section draws fully past; a vermilion seal stamps down onto it with the koku score — the *only* vermilion in the game.
- **(e) Reveal:** the un-rolling (above).
- **(f) Minute one:** everything rolled. One hand-width of night-ink wash, a river, and a single lit column: **"Rake the spilled rice."** Nothing else exists.

## 6. MATERIAL & TYPE
Palette: **washi** #EDE3CC ground · **sumi** #2E2A24 ink · **ai indigo** #2E4A5A (water, night, cloth) · **kakishibu** #7A5636 (rollers, wood) · **kasumi gold** #B99B5B (mist bands, worn accents) · **shu vermilion** #A63B22 (seals only — milestones).
Type: **Toppan Bunkyu Midashi Mincho** (rung titles, section heads) / **Hiragino Mincho ProN** (scroll text) / **Klee** (dream-memory fragments in the margins — a different hand for a returning mind) / **Iowan Old Style** tabular figures (all numerals). Depth comes from paper (feTurbulence grain), ink weight, and the mist bands — zero drop-shadows.

## 7. MOTION SCRIPT
1. **Walk glide** — scroll translateX per node, cubic-bezier(0.22,1,0.36,1), 900ms.
2. **Column brush-in** — clip-path wipe top→bottom, ease-out, 350ms.
3. **Count-up** — eased 400ms, tabular figures, reserved width.
4. **Un-roll** — roller rotates, paper extends 1200ms, under-drawing strokes darken over 800ms.
5. **Seal stamp** — scale 1.15→1, hard ease-in 120ms, one 60ms paper shudder.
**Reduced motion:** cuts replace glides; columns and seal appear complete; count-ups snap with a brief ink-blot blink.

## 8. FUN AMPLIFIERS
1. **Progress has length.** You can drag back through every day you've lived; the fattening take-up roller is a progress bar you *made of paper*.
2. **Rates paint the world.** A place worked more gains painted detail — dikes, a scarecrow, a mended fence — so grinding visibly enriches the picture, not just a number.
3. **The future is visible mystery.** Blank washi and under-drawing past the mist are a standing goal-gradient: you can always see that there is *more scroll*.

## 9. RISKS
- **Horizontal-scroll fatigue/legibility:** mitigate — the camera moves only on discrete walk actions; everything actionable lives in one static viewport between walks.
- **Vertical-rl unreadable to non-JP players:** mitigate — vertical-rl is reserved for kanji headings and flavor; all English body text is horizontal gloss blocks.
- **Ever-growing DOM:** mitigate — virtualize: only ±2 scenes mounted; older sections collapse into the rolled roller and render from cached snapshots on drag-back.

# SHUSSE SUGOROKU 出世双六 — Concept Brief

## 1. THESIS

The screen is a woodblock-printed promotion board — a real Edo shusse sugoroku — being *printed as you live it*: your folded-paper koma stands on the square you occupy, and every rung, place, and beast is an impression pressed onto the sheet the moment you earn it. This makes the game more fun because the goal-gradient stops being a bar and becomes *distance you can count*, and "no reset, the world widens" becomes physical: new paper unfolds at the edge, and Edo is already printed out there, waiting.

One deliberate inversion of the genre: period boards spiral inward to *agari*; ours spirals **outward** from the river at the center — because there is no goal square, only a widening world.

## 2. WIREFRAME (~1440px)

```
┌──────────────────────────────────────────────────────────────┬─────────────┐
│  spring · An'ei 9        ····faint keyblock ghosts····  [江戸]│ 記  RECORD  │
│   ┌─────┐    ┌─────┐    ┌ ─ ─ ─ ┐   squares not yet printed  │ (recorder's │
│   │ R5  │····│ R6  │····  R7 ??   ← visible mysteries        │  Klee hand) │
│   │家人 │    │用人 │    └ ─ ─ ─ ┘                             │─────────────│
│   └─────┘    └─────┘                                         │ You rake the│
│                 path of PLACE squares          next rung     │ spilled rice│
│  ┌─────────┐   ┌───┐  ┌───┐  ┌───┐   ┌──────────────┐        │ back toward │
│  │ R3 門番  │···│ 蔵 │··│田圃│··│稽古│···│ R4 蔵番       │        │ the basket. │
│  │  ● seal │   │rice│  │ ♟ │  │ 場 │   │ tally 正正一  │        │ (+3 rice)   │
│  └─────────┘   │bank│  └───┘  └───┘   └──────────────┘        │             │
│   極 (judge     └───┘    ▲YOU    ╲┌───┐                       │ The wolf    │
│    seal here)  banked pools      ╱│ 猪 │ detour square:       │ comes out of│
│  ┌corner: 武威┐ printed ON kura   └───┘ fight · 29% 勝目      │ the dark…   │
├──────────────────────────────────────────────────────────────┴─────────────┤
│ COLOPHON   命 HP ████████░ 58 · 携 carried: 米12 文34 薪3 · 農 採 · ⚙版元    │
└──────────────────────────────────────────────────────────────┴─────────────┘
```

**Mobile:** the board holds; the camera tightens to a vertical scroll that follows the koma along the path, and the colophon becomes a bottom bar.

## 3. ANATOMY

- **Path = the estate.** The stretch between rung squares is paved with the seven **place squares** (蔵, 門前, 田圃, 杣, 里山, 奥山, 稽古場). Walking is your koma sliding square to square; **verbs live on the square you stand on** (small printed labels under its title). One marker, one path.
- **Rung squares** are the large milestones on that same path; the *next* one carries the **rung meter as 正 tally strokes** brushed in per deed — remaining strokes plus remaining squares *are* the goal gradient.
- **Log** = the right-hand **recorder's strip** in Klee, a game-recorder annotating your board.
- **Vitals + carried goods** live in the bottom **colophon margin** (the print's publisher strip); **banked pools are printed ON the kura square** — deposit where the numbers live.
- **Combat** = a **detour square** hanging off the path (猪 off the woodlot). Stepping on expands it to a full ukiyo-e panel: forecast as a printed odds column (勝目 二分九厘 / 29%), stances as three brush-circle seals 下段/中段/上段.
- **Quests** = paper slips pinned to the gate square; **market** = the pedlar figure walking the path, his pack unfolding as a furoshiki overlay; **skills** 農採樵鍛 appear as margin seals the first time each is used; **settings** hide in the colophon's publisher's block 版元.
- **Pillars** 武威/家産/官威/家格 occupy the four printed corners after R7.

## 4. SIGNATURE MOVE

**The impression.** Nothing "unlocks" — it gets *printed*. A new square arrives as successive woodblock pulls: the sumi keyblock presses in first (opacity + 1.02→1 scale, like a baren stroke), then its colour block slides ~2px **into register** a beat later. Distant squares exist only as faint keyblock ghosts with smudged, unreadable titles — visible mysteries. The whole interface is one sheet being printed, impression by impression, for eighty hours.

## 5. KEY MOMENTS

- **(a) Deed tick:** one 正 stroke draws itself in the next rung square; the rice count *on the kura* eases up; the recorder inks a line. Quiet.
- **(b) Fight:** the 狼 detour square swells to a panel; odds column brushes in at 29%; you press a stance seal; three exchange-lines print; the panel closes and the recorder writes "You are alive. You should not be."
- **(c) Rung-up:** the koma squats, **hops** the path to the new square, lands with a paper settle; its kanji title 門番 stamps in vermilion; ceremony text prints beneath. The one loud moment.
- **(d) Seasonal judge:** the board dims candle-warm; the four corners are read in turn; the **kiwame 極 censor's seal** (period-true — the print examiner's mark) stamps the margin with the koku figure counting up.
- **(e) Reveal:** the drill yard is *printed into existence* — keyblock, then ochre — as Kihei's line inks the recorder's strip.
- **(f) Minute one:** an almost blank sheet, vignetted dark. One dim square — the riverbank — one koma, one verb: *rake the spilled rice*. The first deed pulls the first impression.

## 6. MATERIAL & TYPE

Palette: **生成 Kinari** #E8DCC0 (washi ground) · **墨 Sumi** #2A241C (keyblock) · **朱 Shu** #A93B26 (seals — *milestones only*) · **藍 Ai** #3E5C6B (indigo blocks) · **黄土 Ōdo** #C0913F (ochre blocks) · **松葉 Matsuba** #6E7A57 (pine). Type: **Toppan Bunkyu Midashi Mincho** for square-title kanji (vertical-rl), **Hiragino Mincho ProN** for narrative/ceremony, **Klee** for the recorder's strip, **Iowan Old Style** tabular-nums for every figure. Depth without shadows: three fixed ink weights, deliberate colour-block misregistration, fresher-toned washi where newly printed, and karazuri embossing faked with a 1px lighter inner line. One shared low-opacity feTurbulence grain on the background sheet only.

## 7. MOTION SCRIPT

1. Tally stroke: stroke-dashoffset draw, 240ms ease-out.
2. Count-ups: 500ms cubic ease, tabular figures, reserved width.
3. Koma hop: 120ms squat → 500ms arc (cubic-bezier(.3,-.2,.2,1)) → 2° landing rock; title stamps 150ms after.
4. Impression: keyblock 400ms press-in; colour registers +300ms.
5. Judge seal: scale 1.4→1, −4° rotation, 200ms ease-in.
**Reduced motion:** all values appear final with a 120ms opacity dip; hop becomes cross-fade; stamps appear placed; strokes appear drawn.

## 8. FUN AMPLIFIERS

1. **Countable distance** — squares-to-go plus strokes-to-go make the gradient spatial, not abstract.
2. **Numbers live on things** — rice rises *on the kura*, coin in your margin bundle; a stat increase redraws a place.
3. **The finished print behind you** — every climbed square stays inked; panning back shows your whole life as one accumulating artwork. No reset; the sheet only grows.

## 9. RISKS

- **Legibility:** a whole board shrinks the active area → an eased camera keeps koma + next rung framed readable; colophon is a fixed HUD.
- **Kitsch japonisme:** fake brush fonts, red everywhere → real mincho faces only; Shu vermilion strictly seal-reserved; one grain filter, three ink weights.
- **Performance:** SVG texture on hundreds of nodes → filter on the background rect only; squares as `<use>` symbols; animate transform/opacity exclusively.

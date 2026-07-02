# KAGE-E — The Guard-Post Wall
*A concept brief for Kami-kakushi's UI*

**Why this beats the six taken frames:** every one of them shows the world directly — board, print, cutaway, desk, stage, storehouse. This game's whole theme is *mis-seeing*: a village that believes in spirits, omens that always resolve to human causes, a memory glimpsed through water. So the screen never shows the world at all. It shows the world's **shadow on paper** — and combat, the assignment's centre, becomes the art of *reading a silhouette before it reaches you*. The bestiary isn't a menu; it is literally your growing skill at telling a wolf's shadow from a spirit's. Character-cinema stages scenes; kage-e withholds them — which is why the forecast, the stances, and the field-guide stop being widgets and become the fiction.

## 1. THESIS
The screen IS the lamplit interior wall of the Kurosawa guard-post — a run of shoji panels on cedar rails, one andon lamp, a pillar, a hanging scroll. It makes the game more fun because everything arrives as a shadow before it arrives as a fact: threat is legible at a glance, mastery is visible as sharpening silhouettes, and progression is literal light spreading along a dark wall.

## 2. WIREFRAME (~1440px)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ LINTEL — estate hand-scroll:  蔵 · 門前 · [田圃 ◉lantern] · 杣 · 里山 · 奥山 · 稽古場 │
├────────┬─────────────────────────────────────────────────────┬───────────────┤
│ PILLAR │              THE SHOJI WALL (the stage)             │ HANGING SCROLL│
│ andon  │ ┌──────┐ ┌───────────────────────┐ ┌──────┐ ┌─ ─ ─┐ │  (living log) │
│ flame  │ │unlit │ │ LIT PANEL: your sumi  │ │unlit │ │dark: │ │ "You rake the │
│ = HP   │ │paper │ │ silhouette works /    │ │paper │ │smth  │ │  spilled rice │
│ meal   │ │      │ │ fights here           │ │      │ │moves…│ │  …(+3 rice)"  │
│ pot    │ └──────┘ └───────────────────────┘ └──────┘ └─ ─ ─┘ │               │
│ skill  │  Kihei's charcoal on the post: 三割弱 · 29%          │ quest fuda    │
│ seals  ├─────────────────────────────────────────────────────┤ pinned board  │
│ 農採樵鍛 │ SILL — verb-tags hung for THIS place only:          │ shadow-album  │
│ carried│ [米を掃く rake rice] [水汲み draw water] [stance ▲彳▼] │ (bestiary)    │
│ tags 正│ DOORPOST — rung notches ▮▮▮▮▯ → R3 門番              │ pedlar: at 門前│
└────────┴─────────────────────────────────────────────────────┴──⚙ small mon──┘
```
**Mobile:** one panel wide — the stage; pillar and scroll become fusuma leaves swiped in from either edge; the lintel map stays as a thin strip.

## 3. ANATOMY
**Log** — the hanging kakemono, right: brushed lines stream downward, Iowan/Hiragino Mincho; milestone lines get a vermilion seal. **Verbs** — wooden efuda tags on iron hooks along the sill; only the current node's verbs hang (walk elsewhere, the tags change). **Vitals** — the andon: flame height = HP; the sansai pot beside it is the only refill (cooking). **Resources** — carried = nifuda paper tags on the pillar, tallied in 正 strokes + tabular figures; banked = a dim ledger column that wakes only when the lantern stands at the kura (deposit/withdraw there, as the rules demand). **Rung meter** — knife notches climbing the doorpost toward a faint pencil mark; ceremony cuts it. **Map & walking** — the lintel hand-scroll; your lantern-dot slides node to node and the stage's shadows change with it. **Combat** — on the lit panel (below). **Quests** — fuda slips pinned by the door; **market** — the pedlar's kneeling silhouette appears at the 門前 panel, goods laid out as shadow-shapes with price tags; **skills** — four seals (農採樵鍛) on the pillar that darken by-doing. **Settings** — one small mon, bottom corner.

## 4. SIGNATURE MOVE
**Fight the shadow, then own its shape.** A foe enters as sumi on paper. Your silhouette steps in; stance is not a button row — your figure *poses*: gedan low, chudan level, jodan raised (keys/click cycle it; small kanji tag confirms). Kihei's charcoal fraction on the post — `三割弱 · 29%` in Klee — rewrites as your stance changes. The bout auto-resolves as 3–5 silhouette exchanges. On a first kill, the beast's silhouette **detaches from the paper as a cut-out**, drifts down into the open shadow-album, and its entry sharpens from smudge → crisp profile → brushed notes over repeat encounters. Un-fogging = focus.

## 5. KEY MOMENTS
**(a) Deed tick:** tap the tag → one arm-arc of shadow (400ms) → log line lands → the rice tag's 正 gains a stroke, figure eases up. Quiet. **(b) Fight:** shadow enters; charcoal forecast appears; you pose; exchanges play; a hit blooms an ink blot into the paper. Loss: your shadow drops, the flame gutters near-out, panels slide you home. **(c) Rung-up:** work stops; Genemon's seated silhouette; the pencil mark on the doorpost is *cut* — one knife stroke — and the new title stamps in vermilion, heavy mincho: 門番. **(d) Seasonal judge:** the central panel **slides open** — the only time you see through paper — revealing the writ, vertical-rl, koku standing, shu-in seal. Then it closes; shadows resume. **(e) Panel reveal:** a new system is a dark panel where something *already faintly moves* (locked = visible mystery); its lamp is lit, the lattice glows, one narrated line names it. **(f) Minute one:** the whole wall is night. One panel lit. One tag on one hook: *rake the spilled rice*. Nothing else exists.

## 6. MATERIAL & TYPE
Palette: **#262119** room-dark · **#EFE2C4** lamplit shoji · **#C9B896** unlit paper · **#6B4B33** cedar lattice · **#C98A3D** andon amber (live numbers, flame) · **#AF3B25** seal vermilion (milestones only). Type: **Toppan Bunkyu Midashi Mincho** for titles/writs; **Iowan Old Style + Hiragino Mincho ProN** body/log; **Klee** for Kihei's charcoal and marginalia; **Charter tabular figures**, reserved-width, for all counts. Depth without shadows: backlight — a radial warm gradient per lit panel; cedar bars occlude paper; hierarchy is ink weight and lit-vs-unlit paper, plus feTurbulence roughening every sumi edge.

## 7. MOTION SCRIPT
1. Work-stroke: silhouette arc, 400ms ease-in-out; panel brightness blooms +2% at contact. 2. Count-up: cubic-out 600ms roll; 正 stroke self-draws via dashoffset, 250ms. 3. Panel slide (walk/reveal): 700ms cubic-bezier(.2,.8,.2,1), wood-on-wood, no bounce. 4. Combat exchange: close–cut–separate, 900ms each; hit = ink blot blooms 300ms, settles. 5. Seal stamp: scale 1.15→1.0, 250ms ease-out, hair of rotation. Ambient flame flicker, 4s loop, subtle. **Reduced-motion:** everything cross-fades 150ms; count-ups snap with an amber pulse; meaning lives in ink-weight and light, so nothing is lost.

## 8. FUN AMPLIFIERS
1. **Numbers as calligraphy:** tallies accrete 正 stroke by stroke — every fifth deed *completes a character*. Writing accumulates; a stat panel never does. 2. **Light is the progress bar:** each unlocked panel raises the wall's ambient luminance — total progress readable from across the room, no meter. 3. **The notch ladder:** rung progress is carved wood with the next notch pencilled faint — goal gradient made physical, and the ceremony's knife-cut pays it off.

## 9. RISKS
1. **Legibility at night** — sumi on dark fails. *Mitigation:* text only ever sits on lit-paper zones held ≥7:1 against ink; the dark surround never hosts type. 2. **Kitsch** — shadow puppets can go cute. *Mitigation:* faceless sumi-only figures posed from period kendo woodcuts; low motion count; no bouncy easing, ever. 3. **Performance** — feTurbulence everywhere. *Mitigation:* bake one static filtered rect per panel; animate transforms only; cap concurrent animated silhouettes at two.

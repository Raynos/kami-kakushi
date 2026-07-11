# Playtest bucket — mapsheet

- **bucket:** `mapsheet`
- **details + screenshots:** `./mapsheet/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-389 · 2026-07-11T12:08:16+0200 — walking-animations-are-too

Walking animations are too fast. tbh

**Element:** panel "do" — "The old breach — dressed stone does not wash away; it walks." · `div:nth-of-type(8) > div:nth-of-type(1) > div > svg` · @136,67 933×623
**Screenshot:** `mapsheet/2026-07-11T12-08-16.png`
**Details:** `mapsheet/2026-07-11T12-08-16.json` — save + recent logs + full context

---

## Bug · FB-390 · 2026-07-11T12:08:34+0200 — this-top-left-corner

This top left corner is not in forg of war lol

**Element:** panel "do" · `div > svg > g:nth-of-type(2) > path:nth-of-type(1)` · @272,132 3591×2394
**Screenshot:** `mapsheet/2026-07-11T12-08-34.png`
**Details:** `mapsheet/2026-07-11T12-08-34.json` — save + recent logs + full context

---

## Bug · FB-391 · 2026-07-11T12:08:45+0200 — neither-is-this-bottom

Neither is this bottom left corner

**Element:** panel "do" · `svg > g:nth-of-type(1) > g:nth-of-type(1) > path:nth-of-type(1)` · @-1889,-3209 9183×4659
**Screenshot:** `mapsheet/2026-07-11T12-08-45.png`
**Details:** `mapsheet/2026-07-11T12-08-45.json` — save + recent logs + full context

---

## Bug · FB-392 · 2026-07-11T12:08:56+0200 — random-floating-kanji-in

Random floating kanji in the fog of war means nothing in the R1 stage

**Element:** panel "do" — "未" · `svg > g:nth-of-type(3) > text:nth-of-type(6) > tspan:nth-of-type(1)` · @688,343 99×135
**Screenshot:** `mapsheet/2026-07-11T12-08-56.png`
**Details:** `mapsheet/2026-07-11T12-08-56.json` — save + recent logs + full context

---

## Bug · FB-393 · 2026-07-11T12:09:08+0200 — more-floating-kanji-that

More floating kanji that has no meaning in R1

**Element:** panel "do" — "測" · `svg > g:nth-of-type(3) > text:nth-of-type(5) > tspan:nth-of-type(2)` · @420,376 12×17
**Screenshot:** `mapsheet/2026-07-11T12-09-08.png`
**Details:** `mapsheet/2026-07-11T12-09-08.json` — save + recent logs + full context

---

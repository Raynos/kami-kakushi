# Playtest bucket — mapsheet

- **bucket:** `mapsheet`
- **details + screenshots:** `./mapsheet/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Question · FB-339 · 2026-07-10T18:40:39+0200 — high-level-the-t0

High level, the T0 prottoype map is way better then the one actually integrated into the game. it has R0/R1 fog of war. 

It has zoom capabilities, it has dragging ability, it has buttons for full screen and fit, which i think we want all of this to go into the actual map in the game itself.

**Element:** div.modal-card — ".t0v2-card { max-width:none; width:100%; height:calc(100dvh " · `html > body > div:nth-of-type(4) > div` · @10,30 1476×692
**Screenshot:** `mapsheet/2026-07-10T18-40-39.png`
**Details:** `mapsheet/2026-07-10T18-40-39.json` — save + recent logs + full context

---

## Question · FB-340 · 2026-07-10T18:42:16+0200 — for-the-map-i

For the map I want to see my current position, some kind of marker, or something that shows on the map that's really cool. 

Then when you move from zone to zone on the map, I want that to be animated as if I'm moving.

Maybe like a little 3D figurine that's sitting on top of the flat screen, or something else. I dont know, need to really think of a good idea.

**Element:** rect · `div:nth-of-type(1) > svg > g:nth-of-type(1) > rect` · @-28,-25 1259×824
**Screenshot:** `mapsheet/2026-07-10T18-42-16.png`
**Details:** `mapsheet/2026-07-10T18-42-16.json` — save + recent logs + full context

---

## Bug · FB-341 · 2026-07-10T18:44:54+0200 — when-tryign-to-navigate

When tryign to navigate the map it appears that woodshed is reachable but its not, like it should be disabled and only the ones where we can go to are enabled.

**Element:** panel "do" · `svg > g:nth-of-type(2) > g:nth-of-type(6) > rect:nth-of-type(2)` · @645,563 45×27
**Screenshot:** `mapsheet/2026-07-10T18-44-54.png`
**Details:** `mapsheet/2026-07-10T18-44-54.json` — save + recent logs + full context

---

## Bug · FB-370 · 2026-07-10T23:14:39+0200 — nice-try-lol-now

Nice try lol, now the map is too big here, Like it still needs to fit in the view pan.

**Element:** panel "do" — "What you can doRest a moment🏮 Post the night watch 夜廻No wor" · `section[data-panel=do]` · @125,115 1332×1002
**Screenshot:** `mapsheet/2026-07-10T23-14-39.png`
**Details:** `mapsheet/2026-07-10T23-14-39.json` — save + recent logs + full context

---

## Bug · FB-375 · 2026-07-10T23:17:16+0200 — why-is-weir-rendered

Why is weir rendered here in R1 theres only three zones

**Element:** panel "do" · `svg > g:nth-of-type(2) > g:nth-of-type(1) > rect:nth-of-type(2)` · @217,422 68×41
**Screenshot:** `mapsheet/2026-07-10T23-17-16.png`
**Details:** `mapsheet/2026-07-10T23-17-16.json` — save + recent logs + full context

---

## Bug · FB-376 · 2026-07-10T23:17:30+0200 — why-is-soans-sickroom

Why is soans sickroom rendered here theres onl 3 zones available in R1

**Element:** panel "do" · `svg > g:nth-of-type(2) > g:nth-of-type(2) > rect:nth-of-type(2)` · @916,538 68×41
**Screenshot:** `mapsheet/2026-07-10T23-17-30.png`
**Details:** `mapsheet/2026-07-10T23-17-30.json` — save + recent logs + full context

---

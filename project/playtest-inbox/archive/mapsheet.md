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

## Bug · FB-377 · 2026-07-11T09:28:41+0200 — place-the-actual-map

Place the actual map to the left, add a bit more padding / margin at the bottom of the screen, but anchor the map closer to the top of the box, with a bit less padding / margin at the top.

**Element:** panel "do" — ".sheetmap-wrap { width:100%; position:relative; overflow:hid" · `section[data-panel=do] > div:nth-of-type(8) > div:nth-of-type(1)` · @148,70 1298×632
**Screenshot:** `mapsheet/2026-07-11T09-28-41.png`
**Details:** `mapsheet/2026-07-11T09-28-41.json` — save + recent logs + full context

---

## Bug · FB-378 · 2026-07-11T09:29:14+0200 — the-fog-of-war

The fog of war is partially implemented, it does not include the actual foreset.

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > path:nth-of-type(1)` · @61,118 1168×593
**Screenshot:** `mapsheet/2026-07-11T09-29-14.png`
**Details:** `mapsheet/2026-07-11T09-29-14.json` — save + recent logs + full context

---

## Bug · FB-379 · 2026-07-11T09:29:37+0200 — this-text-is-not

This text is not hidden under fog of war, no reason to make it visible, just fog of war it.

**Element:** panel "do" · `g:nth-of-type(1) > g:nth-of-type(330) > g:nth-of-type(4) > path:nth-of-type(1)` · @875,294 111×326
**Screenshot:** `mapsheet/2026-07-11T09-29-37.png`
**Details:** `mapsheet/2026-07-11T09-29-37.json` — save + recent logs + full context

---

## Bug · FB-380 · 2026-07-11T09:29:55+0200 — dont-preview-things-under

Dont preview things under fog of war, the ruined compound, fully hidden under fog of war

**Element:** map node "ruined" · `g[data-node=ruined] > rect:nth-of-type(2)` · @799,221 81×49
**Screenshot:** `mapsheet/2026-07-11T09-29-55.png`
**Details:** `mapsheet/2026-07-11T09-29-55.json` — save + recent logs + full context

---

## Bug · FB-381 · 2026-07-11T09:30:14+0200 — i-still-ahve-no

I still ahve no idea why kitchen threshold is shown in R1 as an area you could walk to why is it not completely removed from the map to be revealed later ?

**Element:** panel "do" · `svg > g:nth-of-type(3) > g:nth-of-type(4) > rect:nth-of-type(2)` · @681,207 80×48
**Screenshot:** `mapsheet/2026-07-11T09-30-14.png`
**Details:** `mapsheet/2026-07-11T09-30-14.json` — save + recent logs + full context

---

## Bug · FB-382 · 2026-07-11T09:30:35+0200 — same-with-sick-room

Same with sick room

**Element:** panel "do" · `svg > g:nth-of-type(3) > g:nth-of-type(2) > rect:nth-of-type(2)` · @633,234 81×49
**Screenshot:** `mapsheet/2026-07-11T09-30-35.png`
**Details:** `mapsheet/2026-07-11T09-30-35.json` — save + recent logs + full context

---

## Bug · FB-383 · 2026-07-11T09:30:40+0200 — the-r0-rung-up

The R0 rung up only mentioned three zones, paddies, gate, forecourt, it didnt mention wood shed, these 4 zones make sense for R1 but they should be mentioned

**Element:** panel "do" · `svg > g:nth-of-type(3) > g:nth-of-type(6) > rect:nth-of-type(2)` · @651,311 80×48
**Screenshot:** `mapsheet/2026-07-11T09-30-40.png`
**Details:** `mapsheet/2026-07-11T09-30-40.json` — save + recent logs + full context

---

## Bug · FB-384 · 2026-07-11T09:31:07+0200 — if-home-paddies-is

If home paddies is reachable it should not be in the fog of war.

**Element:** panel "do" · `div > svg > g:nth-of-type(2) > path:nth-of-type(1)` · @-238,-345 1338×882
**Screenshot:** `mapsheet/2026-07-11T09-31-07.png`
**Details:** `mapsheet/2026-07-11T09-31-07.json` — save + recent logs + full context

---

## Bug · FB-385 · 2026-07-11T09:31:20+0200 — the-bottom-and-right

The bottom and right and outskirts of the map beyond the lines of the house/estate should also be fog of war

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > path:nth-of-type(1)` · @80,-5 1168×593
**Screenshot:** `mapsheet/2026-07-11T09-31-20.png`
**Details:** `mapsheet/2026-07-11T09-31-20.json` — save + recent logs + full context

---

## Bug · FB-386 · 2026-07-11T09:31:38+0200 — with-the-map-moved

With the map moved to kind of pin or fit to the top left; we can move this zone description text to the right hand remaining panel floating next to the map.

**Element:** panel "do" — "You stand at the home paddy & vegetable rows 田The guest hous" · `section[data-panel=do] > div:nth-of-type(8) > div:nth-of-type(2)` · @148,590 1298×107
**Screenshot:** `mapsheet/2026-07-11T09-31-38.png`
**Details:** `mapsheet/2026-07-11T09-31-38.json` — save + recent logs + full context

---

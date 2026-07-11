# Playtest bucket — mapsheet

- **bucket:** `mapsheet`
- **details + screenshots:** `./mapsheet/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


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

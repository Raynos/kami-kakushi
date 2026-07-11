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

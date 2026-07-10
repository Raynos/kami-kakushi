# Playtest bucket — new game screen

- **bucket:** `new-game-screen`
- **details + screenshots:** `./new-game-screen/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-314 · 2026-07-10T18:10:13+0200 — i-fucking-saw-the

I fucking saw the height of this box change over time based on the interior content, this box needs to be fixed height, not dynamic based on the text inside.

**Element:** div.frame — "神隠しKamikakushiA man is in the river above the weir. Carried " · `div:nth-of-type(1) > div` · @564,236 368×281
**Screenshot:** `new-game-screen/2026-07-10T18-10-13.png`
**Details:** `new-game-screen/2026-07-10T18-10-13.json` — save + recent logs + full context

---

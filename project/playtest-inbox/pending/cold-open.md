# Playtest bucket — cold open

- **bucket:** `cold-open`
- **details + screenshots:** `./cold-open/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-360 · 2026-07-10T19:19:01+0200 — i-cant-click-continue

i cant click continue lol

**Element:** button "Continue" — "Continue" · `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > button` · @988,315 91×36
**Screenshot:** `cold-open/2026-07-10T19-19-01.png`
**Details:** `cold-open/2026-07-10T19-19-01.json` — save + recent logs + full context

---

# Playtest bucket — cold open

- **bucket:** `cold-open`
- **details + screenshots:** `./cold-open/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · 2026-07-10T11:33:06+0200 — in-the-vn-you

In the VN you can click to advance, but you cant hit space to advance the text, let's advance text with space.

**Element:** div.vn-nameplate — "医Sōan" · `div:nth-of-type(4) > div > div:nth-of-type(1)` · @318,108 859×40
**Screenshot:** `cold-open/2026-07-10T11-33-06.png`
**Details:** `cold-open/2026-07-10T11-33-06.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:33:36+0200 — in-the-cold-open

In the cold open the "No." is not prefixed with You:

**Element:** span.vn-speech — ""No."" · `div > p:nth-of-type(5) > span > span` · @318,455 33×20
**Screenshot:** `cold-open/2026-07-10T11-33-36.png`
**Details:** `cold-open/2026-07-10T11-33-36.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:34:03+0200 — here-too-all-text

here too all text by the main character should be consistntly prefix with you: or nameless: etc.

**Element:** span.vn-speech — ""What name did I give? When they pulled me out."" · `div > p:nth-of-type(13) > span > span` · @318,508 326×20
**Screenshot:** `cold-open/2026-07-10T11-34-03.png`
**Details:** `cold-open/2026-07-10T11-34-03.json` — save + recent logs + full context

---

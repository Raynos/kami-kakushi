# Playtest bucket — The log

- **bucket:** `the-log`
- **details + screenshots:** `./the-log/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-362 · 2026-07-10T23:07:54+0200 — honestly-i-expected-this

Honestly, I expected this to be grouped into multiple sections, I know it's the cold open, but the cold open existed of multiple VN scenes, so I expected to see that grouping in mutliple groups here.

**Element:** panel "log" — "— the cold open —Water, above and below. What surfaces is co" · `section[data-panel=log] > div:nth-of-type(1)` · @935,128 507×525
**Screenshot:** `the-log/2026-07-10T23-07-54.png`
**Details:** `the-log/2026-07-10T23-07-54.json` — save + recent logs + full context

---

## Bug · FB-363 · 2026-07-10T23:08:52+0200 — i-expected-this-to

I expected this to be actually like a single wider [story] section with inside the [story] section to be a toggle between vn/all so it still looks like its 

[story][progress][chat]...

but the story button is wider then the rest and has a toggle embedded inside it.

**Element:** button "Story" — "Story" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(1) > button:nth-of-type(1)` · @986,669 46×26
**Screenshot:** `the-log/2026-07-10T23-08-52.png`
**Details:** `the-log/2026-07-10T23-08-52.json` — save + recent logs + full context

---

# Playtest bucket — The log

- **bucket:** `the-log`
- **details + screenshots:** `./the-log/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-262 · 2026-07-10T14:17:31+0200 — the-log-is-just

The log is just generally unorganized at the "Story" level 

I mean I see so much content at this R3 checkpoint, and it's just random lienar scroll,

I think we need entire little sections in there with a proper border that's like a "VN" section 

Each "VN" is basically a grouping unit for lines in the log, so when you scroll back you scrolling back through  either a bunch of VNs or through VNs plus in game story flavor plus another VN plus more in game story flavor etc.

**Element:** panel "log" — "The house remembersThe river gives you up at the weir. You k" · `section[data-panel=log]` · @921,115 536×591
**Screenshot:** `the-log/2026-07-10T14-17-31.png`
**Details:** `the-log/2026-07-10T14-17-31.json` — save + recent logs + full context

---

## Bug · FB-263 · 2026-07-10T14:19:48+0200 — i-think-the-contrast

I think the contrast is wrong here, the log is supposed to be something interesting, and the colors here all bleed, the blue of the text, the dark blue of the background, the other blues of the surrounding game.

What if we used a white here, or even a bright white for narrator story text ?

**Element:** panel "log" — "Under the silt, cut stone and a lift-board seized in its gro" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(68)` · @942,427 493×74
**Screenshot:** `the-log/2026-07-10T14-19-48.png`
**Details:** `the-log/2026-07-10T14-19-48.json` — save + recent logs + full context

---

## Bug · FB-308 · 2026-07-10T15:22:47+0200 — the-geneomon-flavor-text

The geneomon flavor text is not indented correcly.

**Element:** panel "log" — "Genemon: "So you put your hands to it. Rake what grain is st" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(30)` · @942,489 493×96
**Screenshot:** `the-log/2026-07-10T15-22-47.png`
**Details:** `the-log/2026-07-10T15-22-47.json` — save + recent logs + full context

---

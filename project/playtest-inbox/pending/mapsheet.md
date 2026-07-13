# Playtest bucket — mapsheet

- **bucket:** `mapsheet`
- **details + screenshots:** `./mapsheet/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-412 · 2026-07-13T11:09:16+0200 — in-r1-with-only

In R1 with only two zones unlocked all the kanjis for future zones are still flaoting, i think we want them hidden

**Element:** panel "do" — "測" · `svg > g:nth-of-type(4) > text:nth-of-type(3) > tspan:nth-of-type(2)` · @808,225 20×27
**Screenshot:** `mapsheet/2026-07-13T11-09-16.png`
**Details:** `mapsheet/2026-07-13T11-09-16.json` — save + recent logs + full context

---

## Bug · FB-413 · 2026-07-13T11:09:39+0200 — this-text-here-about

This text here about village still truncated.

**Element:** panel "do" — "beyond this, not yet walked" · `svg > g:nth-of-type(4) > g:nth-of-type(2) > text:nth-of-type(1)` · @849,477 94×10
**Screenshot:** `mapsheet/2026-07-13T11-09-39.png`
**Details:** `mapsheet/2026-07-13T11-09-39.json` — save + recent logs + full context

---

## Bug · FB-414 · 2026-07-13T11:09:54+0200 — if-we-bump-this

If we bump this text down a few pixels it wont overlap on the building as much.

**Element:** panel "do" — "the old stables — stalls for twenty" · `div:nth-of-type(1) > div > svg > text:nth-of-type(1)` · @583,353 321×29
**Screenshot:** `mapsheet/2026-07-13T11-09-54.png`
**Details:** `mapsheet/2026-07-13T11-09-54.json` — save + recent logs + full context

---

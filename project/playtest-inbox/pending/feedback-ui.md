# Playtest bucket — feedback UI

- **bucket:** `feedback-ui`
- **details + screenshots:** `./feedback-ui/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-337 · 2026-07-10T18:34:28+0200 — bug-for-feedback-if

Bug for feedback, if the map is open then the whole dom 2 png thing takes too long.

We need a new strategy because the elements in the SVG are just too mcuh.

**Element:** header.vitals — "黒沢家lifebodywood0sansai0The day-hand 日雇Answer the summons ›Th" · `div:nth-of-type(2) > header:nth-of-type(2)` · @29,33 1438×48
**Screenshot:** `feedback-ui/2026-07-10T18-34-28.png`
**Details:** `feedback-ui/2026-07-10T18-34-28.json` — save + recent logs + full context

---

## Bug · FB-347 · 2026-07-10T18:54:53+0200 — test-bug-for-how

test bug for how fast we can screenshot the SVG now

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > path:nth-of-type(1)` · @-3,283 1082×549
**Screenshot:** `feedback-ui/2026-07-10T18-54-53.png`
**Details:** `feedback-ui/2026-07-10T18-54-53.json` — save + recent logs + full context

---

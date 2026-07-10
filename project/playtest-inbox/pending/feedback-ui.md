# Playtest bucket — feedback UI

- **bucket:** `feedback-ui`
- **details + screenshots:** `./feedback-ui/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · 2026-07-10T11:34:29+0200 — is-it-possible-to

Is it possible to somehow globally pause the whole game / game engine when the feedback window is open so the game does not continue playing, text does not continue rendering, the VN does not continue scrolling etc.

Then I can really clearly target what we are talking about.

**Element:** div.vn-card — "医SōanThe river gives you up at the weir. You keep none of it" · `div:nth-of-type(4) > div` · @298,88 900×576
**Screenshot:** `feedback-ui/2026-07-10T11-34-29.png`
**Details:** `feedback-ui/2026-07-10T11-34-29.json` — save + recent logs + full context

---

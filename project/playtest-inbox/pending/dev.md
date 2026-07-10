# Playtest bucket — dev

- **bucket:** `dev`
- **details + screenshots:** `./dev/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-353 · 2026-07-10T19:04:24+0200 — i-m-pretty-sure

I'm pretty sure all the scenarios are broken / stale.

how do we implement these in a non stale fashion that never breaks and is upto date with the src/ built ?

**Element:** div — "Fresh startpost-cold-openLoadNew game, cold open already ans" · `body > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(4)` · @1120,268 329×404
**Screenshot:** `dev/2026-07-10T19-04-24.png`
**Details:** `dev/2026-07-10T19-04-24.json` — save + recent logs + full context

---

## Bug · FB-358 · 2026-07-10T19:17:01+0200 — when-i-click-ng

When i click "NG (post open)" It doesnt reset all the state correctly, im still on the map screen, like something is just completely fucked in the UI / DOM

The map screen should never be rendered, like all the game features that are R1/R2/R3 etc should just never be rendered.

When you enter a broken state, I mean it should say Rung R0 too in the dev tools because i presed NG (post open)

I feel like the new game button is implemented properly, and NG (post open) is buggy as shit.

Anyway I'm supposed to be on another screen.

**Element:** header.titlebar — "神隠しKamikakushi" · `div:nth-of-type(2) > header:nth-of-type(1)` · @29,0 1438×33
**Screenshot:** `dev/2026-07-10T19-17-01.png`
**Details:** `dev/2026-07-10T19-17-01.json` — save + recent logs + full context

---

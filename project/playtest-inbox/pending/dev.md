# Playtest bucket — dev

- **bucket:** `dev`
- **details + screenshots:** `./dev/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · 2026-07-10T11:47:11+0200 — add-a-dev-only

Add a dev only toggle under settings to have a detailed hove description of each action including cost and rewards as well as timing.

**Element:** div — "SettingsVariantsScenariosBalanceStory (10)RungsSpeed1×2×4×8×" · `html > body > div:nth-of-type(2) > div:nth-of-type(2)` · @1242,159 214×589
**Screenshot:** `dev/2026-07-10T11-47-11.png`
**Details:** `dev/2026-07-10T11-47-11.json` — save + recent logs + full context

---

## Bug · FB-298 · 2026-07-10T15:14:38+0200 — when-you-open-the

When you open the dev menu it should default to settings.

**Element:** div — "SettingsVariantsScenariosBalanceStory (10)RungsSpeed1×2×4×8×" · `html > body > div:nth-of-type(3) > div:nth-of-type(2)` · @1242,159 214×589
**Screenshot:** `dev/2026-07-10T15-14-38.png`
**Details:** `dev/2026-07-10T15-14-38.json` — save + recent logs + full context

---

## Bug · FB-299 · 2026-07-10T15:15:42+0200 — action-detail-is-not

Action detail is not fully implemented yet, it just says the time, it doesn't say "what the action is" it just says "work" and "cooldown" it doesnt say what it needs and what it produces etc. ( Does raking still produce +2rice?)

**Element:** button "action detail: on" — "action detail: on" · `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > button` · @1249,326 136×25
**Screenshot:** `dev/2026-07-10T15-15-42.png`
**Details:** `dev/2026-07-10T15-15-42.json` — save + recent logs + full context

---

## Bug · FB-300 · 2026-07-10T15:16:23+0200 — i-dont-think-we

I dont think we need combat / auto here anymore, these buttons can all go and all that dev code can be deleted.

**Element:** div — "Combat / Auto" · `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(5) > div:nth-of-type(1)` · @1249,515 200×16
**Screenshot:** `dev/2026-07-10T15-16-23.png`
**Details:** `dev/2026-07-10T15-16-23.json` — save + recent logs + full context

---

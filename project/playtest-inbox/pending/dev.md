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

## Bug · FB-301 · 2026-07-10T15:16:44+0200 — let-s-add-a

Let's add a top level button here that's "NG (post open)"

**Element:** div — "↩ last backup⟳ New game" · `body > div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(8)` · @1249,665 200×77
**Screenshot:** `dev/2026-07-10T15-16-44.png`
**Details:** `dev/2026-07-10T15-16-44.json` — save + recent logs + full context

---

## Bug · FB-302 · 2026-07-10T15:17:19+0200 — let-s-make-the

Let's make the dev menu wider, and let's add three buttons side by side for the sections of the dev menu.

**Element:** div — "SettingsVariantsScenariosBalanceStory (10)RungsSpeed1×2×4×8×" · `html > body > div:nth-of-type(3) > div:nth-of-type(2)` · @1242,159 214×589
**Screenshot:** `dev/2026-07-10T15-17-19.png`
**Details:** `dev/2026-07-10T15-17-19.json` — save + recent logs + full context

---

## Bug · FB-303 · 2026-07-10T15:17:47+0200 — balance-is-a-confusing

Balance is a confusing section, I don't think I'll use it often so lets make that the last button in the group

**Element:** div — "SettingsVariantsScenariosBalanceStory (10)RungsSpeed1×2×4×8×" · `html > body > div:nth-of-type(3) > div:nth-of-type(2)` · @1242,159 214×589
**Screenshot:** `dev/2026-07-10T15-17-47.png`
**Details:** `dev/2026-07-10T15-17-47.json` — save + recent logs + full context

---

## Bug · FB-304 · 2026-07-10T15:18:11+0200 — rename-rungs-to-rung

Rename rungs to "rung info"

**Element:** button "Rungs" — "Rungs" · `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(1) > button:nth-of-type(6)` · @1351,388 98×25
**Screenshot:** `dev/2026-07-10T15-18-11.png`
**Details:** `dev/2026-07-10T15-18-11.json` — save + recent logs + full context

---

## Bug · FB-305 · 2026-07-10T15:18:26+0200 — all-these-buttons-in

All these buttons in Story (10) are basically prototypes so lets add a new section for prorotypes.

**Element:** button "⤢ T0 V2 map — the story-bible zone draft" — "⤢ T0 V2 map — the story-bible zone draft" · `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(6) > button:nth-of-type(1)` · @1249,257 200×42
**Screenshot:** `dev/2026-07-10T15-18-26.png`
**Details:** `dev/2026-07-10T15-18-26.json` — save + recent logs + full context

---

## Bug · FB-306 · 2026-07-10T15:18:45+0200 — in-the-new-prototype

In the new prototype section let's group them

 - Map sheets
 - new UI (E3 / E1)
 - Parked UI prototypes

**Element:** button "⤢ T0 V2 map — the story-bible zone draft" — "⤢ T0 V2 map — the story-bible zone draft" · `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(6) > button:nth-of-type(1)` · @1249,257 200×42
**Screenshot:** `dev/2026-07-10T15-18-45.png`
**Details:** `dev/2026-07-10T15-18-45.json` — save + recent logs + full context

---

## Bug · FB-307 · 2026-07-10T15:19:12+0200 — all-of-these-stories

All of these stories diverge here need to be goruped by rung just like variants and secnarios

**Element:** div — "The autumn node reads (16 zones)⤢ Explore this divergeCanon " · `div:nth-of-type(3) > div:nth-of-type(2) > div:nth-of-type(6) > div:nth-of-type(3)` · @1249,419 200×318
**Screenshot:** `dev/2026-07-10T15-19-12.png`
**Details:** `dev/2026-07-10T15-19-12.json` — save + recent logs + full context

---

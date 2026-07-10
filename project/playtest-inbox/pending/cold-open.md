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

## Bug · 2026-07-10T11:36:21+0200 — the-new-section-renders

The new section renders in determinitely I think the new section needs more consistent here. 

I also think new can stick around for longer, like fade out after 30s or something.

**Element:** div.log-fresh-divider — "新 · new" · `div:nth-of-type(2) > div:nth-of-type(1) > div > div` · @318,558 543×17
**Screenshot:** `cold-open/2026-07-10T11-36-21.png`
**Details:** `cold-open/2026-07-10T11-36-21.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:37:24+0200 — continue-button-feels-placed

Continue button feels placed a bit small and off center, I think we can add more whitespace, lower it a bit and center it a bit better.

**Element:** button "Continue" — "Continue" · `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button` · @890,305 71×33
**Screenshot:** `cold-open/2026-07-10T11-37-24.png`
**Details:** `cold-open/2026-07-10T11-37-24.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:37:43+0200 — also-i-think-the

Also i think the continue button can be a bit larger, and font size a bit larger.

**Element:** button "Continue" — "Continue" · `div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(3) > button` · @890,305 71×33
**Screenshot:** `cold-open/2026-07-10T11-37-43.png`
**Details:** `cold-open/2026-07-10T11-37-43.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:38:17+0200 — the-cold-open-changed

The cold open changed, completely, the Memory section is gone, the discussion with genemon is gone, the ability to choose 3 perks is gone.

**Element:** panel "log" — "The house remembersThe river gives you up at the weir. You k" · `section[data-panel=log]` · @921,83 536×622
**Screenshot:** `cold-open/2026-07-10T11-38-17.png`
**Details:** `cold-open/2026-07-10T11-38-17.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:38:45+0200 — when-the-cold-open

When the cold open finished, the Progress did not have an unread symbol, it needs to have an unread symbol.

**Element:** button "Progress" — "Progress" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(1) > button:nth-of-type(2)` · @1031,669 64×26
**Screenshot:** `cold-open/2026-07-10T11-38-45.png`
**Details:** `cold-open/2026-07-10T11-38-45.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:39:11+0200 — the-text-color-of

The text color of the narrator text is the same as the main character here, like the narrator text color in the cold open VN and the log panel are not consistent with each other.

**Element:** panel "log" — "The river gives you up at the weir. You keep none of it in o" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(1)` · @942,135 493×79
**Screenshot:** `cold-open/2026-07-10T11-39-11.png`
**Details:** `cold-open/2026-07-10T11-39-11.json` — save + recent logs + full context

---

## Bug · 2026-07-10T11:39:59+0200 — i-want-all-speech

I want all speech to stand out a bit more then the narrator text, other then fixing the narrator text color, can you indent the lines that are character speech with margin left or padding left by like 5px or 10px

**Element:** panel "log" — "Sōan: "Can you stand? Then the rake is by the door, and the " · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(23)` · @942,573 493×73
**Screenshot:** `cold-open/2026-07-10T11-39-59.png`
**Details:** `cold-open/2026-07-10T11-39-59.json` — save + recent logs + full context

---

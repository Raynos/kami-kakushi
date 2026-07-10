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

## Bug · 2026-07-10T11:35:21+0200 — the-text-color-of

The text color of my spoken text in the ask/chat mode is different color from in the intro text, we need a unique and specific color for the main cahracter, and it needs to be very obvouis, I think I like the blue idea but the contrast is too low with blue of the background.

The white is too close to the gray/white of the narrator.

**Element:** span.vn-speech — ""How long was I in the river?"" · `div > p:nth-of-type(20) > span:nth-of-type(2) > span` · @353,592 191×20
**Screenshot:** `feedback-ui/2026-07-10T11-35-21.png`
**Details:** `feedback-ui/2026-07-10T11-35-21.json` — save + recent logs + full context

---

## Bug · 2026-07-10T12:07:56+0200 — the-feedback-ui-i

The feedback UI I want the bucket to be mandatory, so it dont want to be able to submit without a bucket and I guess I'll just keep creating named buckets.

**Element:** section.work — "What you can doRake the spilled rice▶ autoRest a moment🏮 Po" · `div:nth-of-type(2) > main > section` · @39,88 871×618
**Screenshot:** `feedback-ui/2026-07-10T12-07-56.png`
**Details:** `feedback-ui/2026-07-10T12-07-56.json` — save + recent logs + full context

---

## Bug · 2026-07-10T12:20:46+0200 — feedback-ui-has-some

Feedback UI has some kind of really bad perf issue in it, it's not smooth at all. when you click some elements or hit esc.

**Element:** header.vitals — "黒沢家lifebodywood0sansai0The day-hand 日雇Answer the summons ›Th" · `div:nth-of-type(2) > header:nth-of-type(2)` · @29,33 1438×48
**Screenshot:** `feedback-ui/2026-07-10T12-20-46.png`
**Details:** `feedback-ui/2026-07-10T12-20-46.json` — save + recent logs + full context

---

## Bug · 2026-07-10T12:21:14+0200 — yeah-the-delay-between

Yeah the delay between clicking the select element and the text box section opening is too long, there's something borked here.

**Element:** nav.nav — "WorkMap 地図Estate 家" · `div:nth-of-type(2) > nav` · @29,81 86×635
**Screenshot:** `feedback-ui/2026-07-10T12-21-14.png`
**Details:** `feedback-ui/2026-07-10T12-21-14.json` — save + recent logs + full context

---

## Bug · 2026-07-10T13:13:28+0200 — test

Test

**Element:** panel "do" — "What you can do" · `section[data-panel=do] > h2` · @50,92 849×18
**Screenshot:** `feedback-ui/2026-07-10T13-13-28.png`
**Details:** `feedback-ui/2026-07-10T13-13-28.json` — save + recent logs + full context

---

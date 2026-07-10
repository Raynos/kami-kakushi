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

## Bug · FB-348 · 2026-07-10T18:55:10+0200 — hmm-i-think-i

hmm i think i did see that it changed, like the rasterize is not perfect.

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > rect` · @-7,122 1092×715
**Screenshot:** `feedback-ui/2026-07-10T18-55-10.png`
**Details:** `feedback-ui/2026-07-10T18-55-10.json` — save + recent logs + full context

---

## Bug · FB-349 · 2026-07-10T18:55:24+0200 — yeah-all-the-text

Yeah all the text was lost during the rasterization.

**Element:** panel "do" — "The estate 地図You stand at the home paddy & vegetable rows 田T" · `section[data-panel=do] > div:nth-of-type(7)` · @136,99 763×766
**Screenshot:** `feedback-ui/2026-07-10T18-55-24.png`
**Details:** `feedback-ui/2026-07-10T18-55-24.json` — save + recent logs + full context

---

## Bug · FB-350 · 2026-07-10T18:55:33+0200 — the-japanese-icons-too

The japanese icons too which i guess is font text.

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > path:nth-of-type(1562)` · @385,295 415×348
**Screenshot:** `feedback-ui/2026-07-10T18-55-33.png`
**Details:** `feedback-ui/2026-07-10T18-55-33.json` — save + recent logs + full context

---

## Bug · FB-351 · 2026-07-10T18:56:51+0200 — test-capture

test capture.

**Element:** header.vitals — "黒沢家lifebodywood0sansai0The day-hand 日雇Answer the summons ›Th" · `div:nth-of-type(2) > header:nth-of-type(2)` · @29,33 1438×48
**Screenshot:** `feedback-ui/2026-07-10T18-56-51.png`
**Details:** `feedback-ui/2026-07-10T18-56-51.json` — save + recent logs + full context

---

## Bug · FB-352 · 2026-07-10T18:57:10+0200 — test-rasterize

test rasterize.

**Element:** header.vitals — "黒沢家lifebodywood0sansai0The day-hand 日雇Answer the summons ›Th" · `div:nth-of-type(2) > header:nth-of-type(2)` · @29,33 1438×48
**Screenshot:** `feedback-ui/2026-07-10T18-57-10.png`
**Details:** `feedback-ui/2026-07-10T18-57-10.json` — save + recent logs + full context

---

## Bug · FB-354 · 2026-07-10T19:05:16+0200 — test

test

**Element:** panel "do" · `div > svg > g:nth-of-type(1) > rect` · @53,153 1019×667
**Screenshot:** `feedback-ui/2026-07-10T19-05-16.png`
**Details:** `feedback-ui/2026-07-10T19-05-16.json` — save + recent logs + full context

---

## Bug · FB-355 · 2026-07-10T19:05:25+0200 — test-2

test 2

**Element:** button "Rest a moment" — "Rest a moment" · `section[data-panel=do] > div:nth-of-type(1) > div:nth-of-type(1) > button` · @187,148 280×33
**Screenshot:** `feedback-ui/2026-07-10T19-05-25.png`
**Details:** `feedback-ui/2026-07-10T19-05-25.json` — save + recent logs + full context

---

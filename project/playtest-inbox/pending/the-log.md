# Playtest bucket — The log

- **bucket:** `the-log`
- **details + screenshots:** `./the-log/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-398 · 2026-07-11T16:13:30+0200 — we-lost-the-phrased

We lost the phrased spoken have an indentation effect.

**Element:** panel "log" — "You: "The days. I'll count from this one."" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(23)` · @942,271 493×37
**Screenshot:** `the-log/2026-07-11T16-13-30.png`
**Details:** `the-log/2026-07-11T16-13-30.json` — save + recent logs + full context

---

## Bug · FB-399 · 2026-07-11T16:14:01+0200 — you-can-flip-the

You can flip the prefix here at this point from You: to Nameless:

**Element:** panel "log" — "You: "The days. I'll count from this one."" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(23)` · @942,464 493×37
**Screenshot:** `the-log/2026-07-11T16-14-01.png`
**Details:** `the-log/2026-07-11T16-14-01.json` — save + recent logs + full context

---

## Bug · FB-400 · 2026-07-11T16:14:25+0200 — we-now-have-to

We now have to grouping UIs in the log, this one here for the Chat and the full square border grouping from the VN in the Story.

Can you change the grouping behavior / logic / UI here in the Chat panel to match the VN/Story grouping with the full border

**Element:** panel "log" — "— with Genemon · entered in the book —" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(7) > div` · @950,166 485×16
**Screenshot:** `the-log/2026-07-11T16-14-25.png`
**Details:** `the-log/2026-07-11T16-14-25.json` — save + recent logs + full context

---

## Question · FB-401 · 2026-07-11T16:16:39+0200 — in-r0-i-should

In R0 I should be in one location, the court or the Kura, like I don't even know where I am and where I am raking the spilled rice.

But I received here two zone unlock messages for both 

Can you explain what these messages are for the three mesages

 - You have started to keep count of your sterength
 - Kura's count
 - The outer court. 

Also where am I raking the spilled rice ?

**Element:** panel "log" — "The kura's count is open to you now: rice in, rice out, and " · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(29)` · @942,265 493×52
**Screenshot:** `the-log/2026-07-11T16-16-39.png`
**Details:** `the-log/2026-07-11T16-16-39.json` — save + recent logs + full context

---

## Bug · FB-402 · 2026-07-11T16:19:04+0200 — the-resting-flavor-text

The resting flavor text in R0 references the woodshed but the woodshed unlocks in R1, the resting flavor text in R0 should be something else. Not the woodshed, maybe just resting standing holding the rake.

In R1 the resting flavor text can be the woodshed but only if you rest in the location of the woodshed zone.

**Element:** panel "log" — "You lie down in the bare corner of the woodshed — no mat yet" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(13)` · @942,436 493×45
**Screenshot:** `the-log/2026-07-11T16-19-04.png`
**Details:** `the-log/2026-07-11T16-19-04.json` — save + recent logs + full context

---

## Bug · FB-403 · 2026-07-11T16:20:53+0200 — this-is-a-stupid

This is a stupid bug right there, how the VN log text be interrupted by "raking the spilled rice to the last grain"

The moment you click the rung up VN it should CANCEL the current action that's auto looping mid action and CANCEL the auto.

The action that's in flight DOES NOT COMPLETE.

**Element:** panel "log" — "The spilled rice is raked to the last grain. There is nothin" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(52)` · @942,482 493×52
**Screenshot:** `the-log/2026-07-11T16-20-53.png`
**Details:** `the-log/2026-07-11T16-20-53.json` — save + recent logs + full context

---

## Bug · FB-406 · 2026-07-11T16:24:21+0200 — ok-all-this-flavor

Ok all this flavor text that renders in Now when you navigate from one zone to the other zone, I dont want it. I want this to be in the zone description in the Map tab instead.

**Element:** panel "log" — "The gate & gateyard: The estate's face, kept barely, kept an" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(9)` · @942,444 493×96
**Screenshot:** `the-log/2026-07-11T16-24-21.png`
**Details:** `the-log/2026-07-11T16-24-21.json` — save + recent logs + full context

---

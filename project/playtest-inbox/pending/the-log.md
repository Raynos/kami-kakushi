# Playtest bucket — The log

- **bucket:** `the-log`
- **details + screenshots:** `./the-log/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-315 · 2026-07-10T18:17:36+0200 — when-you-open-the

When you open the chat panel, I don't need to see the chat scrolling, like i already saw it scrolling in the VN

So basically everything I read in the VN is fundamentally not unread, you dont have to scroll it or show it to me slowly.

But I appreciated the rest you know, showing the rest of the unread messages one by one, that's a great idea, just not for these VN lines I already read.

**Element:** panel "log" — "— with Sōan · the cold open —You: "How long was I in the riv" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(1)` · @942,135 493×57
**Screenshot:** `the-log/2026-07-10T18-17-36.png`
**Details:** `the-log/2026-07-10T18-17-36.json` — save + recent logs + full context

---

## Bug · FB-316 · 2026-07-10T18:19:38+0200 — for-this-v5a-the

For this V5A the grouping in the log, you can see all kinds of black space in between, the box is not clean, that looks like a UI / CSS mistake.

we want all of that which belongs together to fit togeth.

**Element:** panel "log" — "The house remembers— the cold open —Water, above and below. " · `section[data-panel=log]` · @921,83 536×622
**Screenshot:** `the-log/2026-07-10T18-19-38.png`
**Details:** `the-log/2026-07-10T18-19-38.json` — save + recent logs + full context

---

## Bug · FB-317 · 2026-07-10T18:20:17+0200 — each-card-section-needs

Each card section needs a unique name and better grouping, its not clear to me.

**Element:** panel "log" — "— the cold open —Water, above and below. What surfaces is co" · `section[data-panel=log] > div:nth-of-type(1)` · @935,128 507×525
**Screenshot:** `the-log/2026-07-10T18-20-17.png`
**Details:** `the-log/2026-07-10T18-20-17.json` — save + recent logs + full context

---

## Bug · FB-318 · 2026-07-10T18:20:50+0200 — this-log-line-shows

This log line shows too early, I know that the kura open to me but it should show after the cold open VN

**Element:** panel "log" — "The kura's count is open to you now: rice in, rice out, and " · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(3)` · @942,324 493×52
**Screenshot:** `the-log/2026-07-10T18-20-50.png`
**Details:** `the-log/2026-07-10T18-20-50.json` — save + recent logs + full context

---

## Bug · FB-319 · 2026-07-10T18:21:10+0200 — also-something-that-can

Also something that can show after the VN open

**Element:** panel "log" — "You have started to keep count of your own strength — what t" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(2)` · @942,272 493×52
**Screenshot:** `the-log/2026-07-10T18-21-10.png`
**Details:** `the-log/2026-07-10T18-21-10.json` — save + recent logs + full context

---

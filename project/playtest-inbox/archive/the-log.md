# Playtest bucket — The log

- **bucket:** `the-log`
- **details + screenshots:** `./the-log/` (`<stamp>.json` = save + logs +
  context, committed; `<stamp>.png` = screenshot, git-ignored)

Each `##` block below is one in-game capture in this bucket, appended in order —
possibly across sessions and builds. Each entry names its kind and records its own
save + context in the linked `<stamp>.json`; reproduce any one with `__qa.load(<its save>)`.


## Bug · FB-262 · 2026-07-10T14:17:31+0200 — the-log-is-just

The log is just generally unorganized at the "Story" level 

I mean I see so much content at this R3 checkpoint, and it's just random lienar scroll,

I think we need entire little sections in there with a proper border that's like a "VN" section 

Each "VN" is basically a grouping unit for lines in the log, so when you scroll back you scrolling back through  either a bunch of VNs or through VNs plus in game story flavor plus another VN plus more in game story flavor etc.

**Element:** panel "log" — "The house remembersThe river gives you up at the weir. You k" · `section[data-panel=log]` · @921,115 536×591
**Screenshot:** `the-log/2026-07-10T14-17-31.png`
**Details:** `the-log/2026-07-10T14-17-31.json` — save + recent logs + full context

---

## Bug · FB-263 · 2026-07-10T14:19:48+0200 — i-think-the-contrast

I think the contrast is wrong here, the log is supposed to be something interesting, and the colors here all bleed, the blue of the text, the dark blue of the background, the other blues of the surrounding game.

What if we used a white here, or even a bright white for narrator story text ?

**Element:** panel "log" — "Under the silt, cut stone and a lift-board seized in its gro" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(68)` · @942,427 493×74
**Screenshot:** `the-log/2026-07-10T14-19-48.png`
**Details:** `the-log/2026-07-10T14-19-48.json` — save + recent logs + full context

---

## Bug · FB-308 · 2026-07-10T15:22:47+0200 — the-geneomon-flavor-text

The geneomon flavor text is not indented correcly.

**Element:** panel "log" — "Genemon: "So you put your hands to it. Rake what grain is st" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(30)` · @942,489 493×96
**Screenshot:** `the-log/2026-07-10T15-22-47.png`
**Details:** `the-log/2026-07-10T15-22-47.json` — save + recent logs + full context

---

## Bug · FB-309 · 2026-07-10T15:24:29+0200 — lol-colors-for-genemon

lol colors for genemon still wrong here, maybe another agent is working on it.

**Element:** panel "log" — ""...You don't shirk the work," Genemon says, eyeing the clea" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(34)` · @942,573 493×73
**Screenshot:** `the-log/2026-07-10T15-24-29.png`
**Details:** `the-log/2026-07-10T15-24-29.json` — save + recent logs + full context

---

---

<!-- second drain pass (session 162) — entries appended from the re-created pending bucket -->


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

## Bug · FB-320 · 2026-07-10T18:22:21+0200 — i-m-thinking-we

I'm thinking we want the Story to expand when selected and have a little toggle inside of it that says "vn / all" and you can select to look at all story text or only VN story text.

Because VN text is the "MAIN MAIN STORY" and the rest is all flavor text you can see in all.

**Element:** button "Story" — "Story" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(1) > button:nth-of-type(1)` · @986,669 46×26
**Screenshot:** `the-log/2026-07-10T18-22-21.png`
**Details:** `the-log/2026-07-10T18-22-21.json` — save + recent logs + full context

---

## Bug · FB-321 · 2026-07-10T18:23:05+0200 — i-fucking-saw-that

I fucking saw that lol, as the text scrolled it didnt have the correct colors or italics.

**Element:** panel "log" — ""...You don't shirk the work," Genemon says, eyeing the clea" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(34)` · @942,573 493×73
**Screenshot:** `the-log/2026-07-10T18-23-05.png`
**Details:** `the-log/2026-07-10T18-23-05.json` — save + recent logs + full context

---

## Bug · FB-322 · 2026-07-10T18:24:03+0200 — do-you-see-what

do you see what I mean its not italics or correct colors here as its scrolling.

**Element:** panel "log" — ""Still at it," Genemon sa" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(36)` · @942,617 493×29
**Screenshot:** `the-log/2026-07-10T18-24-03.png`
**Details:** `the-log/2026-07-10T18-24-03.json` — save + recent logs + full context

---

## Bug · FB-323 · 2026-07-10T18:24:20+0200 — i-also-saw-this

I also saw this pop in as new text, but it didnt say new remember all NEW text that gets written gets the NEW divider ( 60s to fade )

**Element:** panel "log" — ""Still at it," Genemon says, passing the granary door withou" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(36)` · @942,617 493×29
**Screenshot:** `the-log/2026-07-10T18-24-20.png`
**Details:** `the-log/2026-07-10T18-24-20.json` — save + recent logs + full context

---

## Bug · FB-325 · 2026-07-10T18:27:22+0200 — i-pressed-rake-the

I pressed rake the spilled rice, but the color of the now tab didnt change to highlight it has new text.

**Element:** button "Now" — "Now" · `section[data-panel=log] > div:nth-of-type(2) > button` · @935,669 43×26
**Screenshot:** `the-log/2026-07-10T18-27-22.png`
**Details:** `the-log/2026-07-10T18-27-22.json` — save + recent logs + full context

---

## Bug · FB-326 · 2026-07-10T18:27:58+0200 — the-now-having-next

The Now having next text should also change the background color of the button, not just the text.

**Element:** button "Now" — "Now" · `section[data-panel=log] > div:nth-of-type(2) > button` · @935,669 43×26
**Screenshot:** `the-log/2026-07-10T18-27-58.png`
**Details:** `the-log/2026-07-10T18-27-58.json` — save + recent logs + full context

---

## Bug · FB-331 · 2026-07-10T18:31:03+0200 — same-issue-the-chat

same issue, the chat text i already read in VN is scrolling here.

**Element:** panel "log" — "— with Genemon · The day-hand promotion —Nameless: "Why keep" · `section[data-panel=log] > div:nth-of-type(1) > div:nth-of-type(10)` · @942,550 493×57
**Screenshot:** `the-log/2026-07-10T18-31-03.png`
**Details:** `the-log/2026-07-10T18-31-03.json` — save + recent logs + full context

---

## Bug · FB-362 · 2026-07-10T23:07:54+0200 — honestly-i-expected-this

Honestly, I expected this to be grouped into multiple sections, I know it's the cold open, but the cold open existed of multiple VN scenes, so I expected to see that grouping in mutliple groups here.

**Element:** panel "log" — "— the cold open —Water, above and below. What surfaces is co" · `section[data-panel=log] > div:nth-of-type(1)` · @935,128 507×525
**Screenshot:** `the-log/2026-07-10T23-07-54.png`
**Details:** `the-log/2026-07-10T23-07-54.json` — save + recent logs + full context

---

## Bug · FB-363 · 2026-07-10T23:08:52+0200 — i-expected-this-to

I expected this to be actually like a single wider [story] section with inside the [story] section to be a toggle between vn/all so it still looks like its 

[story][progress][chat]...

but the story button is wider then the rest and has a toggle embedded inside it.

**Element:** button "Story" — "Story" · `section[data-panel=log] > div:nth-of-type(2) > div:nth-of-type(1) > button:nth-of-type(1)` · @986,669 46×26
**Screenshot:** `the-log/2026-07-10T23-08-52.png`
**Details:** `the-log/2026-07-10T23-08-52.json` — save + recent logs + full context

---

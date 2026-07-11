# Playtest feedback — 2026-07-11 (async inbox capture, `the-log` lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), the **the-log**
bucket lane (2 open items). FB-stamped at capture time; no reserved block
drawn. Drained in the 2026-07-10→11 all-lanes parallel pass (ADR-171).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## The Story view

### FB-362 · the cold open should group as multiple scenes — ✅
**Verbatim:** _"Honestly, I expected this to be grouped into multiple
sections, I know it's the cold open, but the cold open existed of multiple VN
scenes, so I expected to see that grouping in mutliple groups here."_
**Reading:** every intro emission hardcoded `context: 'the cold open'`
(5 sites in intents.ts), so the FB-262 context-grouping had nothing to split
the three authored scenes on.
**Fixed in:** `cd10b315` — the `## scene` grammar gains a `title:` field;
each intro scene stamps its own context; old saves keep their baked single
card (TST2). The three scene heads are new fiction-voiced text → ADR-139
diverge bundle `fb362-intro-titles` (3 blind takes); pick = Take B: "what the
water takes" · "no name to give" · "entered in the book". **HR-28** carries
the human review; alternates swap live in the DEV Story switcher.
**Distilled rule:** the log's grouping key IS narrative structure — scene
boundaries must be authored data (the narrative grammar), never a hardcoded
constant at the emit site.

### FB-363 · Story tab is double-width with the toggle embedded — ✅
**Verbatim:** _"I expected this to be actually like a single wider [story]
section with inside the [story] section to be a toggle between vn/all so it
still looks like its / [story][progress][chat]... / but the story button is
wider then the rest and has a toggle embedded inside it."_
**Fixed in:** `84cb7747` — the vn/all sub-toggle moved from the filter row
(FB-320 placement) to the log head's right edge (title left, toggle right);
the tab row reads uniform; same show-only-on-Story logic; the mobile band's
collapse selectors follow.

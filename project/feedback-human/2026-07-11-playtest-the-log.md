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

## 2026-07-11 evening pass (FB-398…FB-406)

### FB-398 · spoken-line indent lost in the log — ✅
**Verbatim:** _"We lost the phrased spoken have an indentation effect."_
**Reading:** the FB-228 `.log-line.spoken` indent was overridden inside 幕
cards: `.log-line.scene-line` (FB-262) sets its own `padding-left` later in
the sheet at equal specificity, so card dialogue actually sat LEFT of card
narration.
**Distilled rule:** compose additive indents (`calc(card + speech)`), never
let two idioms fight over one `padding-left`.
**Fixed in:** styles.css `.log-line.scene-line.spoken` composed rule.

### FB-403 · rung-up VN must cancel the in-flight auto action — ✅
**Verbatim:** _"The moment you click the rung up VN it should CANCEL the current action that's auto looping mid action and CANCEL the auto. The action that's in flight DOES NOT COMPLETE."_
**Reading:** FB-266 already disarmed the *armed* autos on VN entry, but the
already-running timed action kept its timer and its completion line landed
mid-scene, fracturing the card.
**Fixed in:** playerDispatch cancels the ActionClock on `begin_rung_beat` /
`begin_scene`; e2e case in timed-actions.spec.ts (proven RED pre-fix).

### FB-399 · sickroom say-lines should read "Nameless:", not "You:" — ✅
**Verbatim:** _"You can flip the prefix here at this point from You: to Nameless:"_
**Reading:** intro.md's flip comment ("every MC line from this point renders
as Nameless:") sits before the sickroom hub's asks/decide, but the
`label-nameless` latch fired only at scene END — so the asks and the decide's
say line still printed "You:".
**Fixed in:** the latch moved ahead of the say-line emit in `ask_topic` +
`choose_intro` (soan scene); new RED-able test in intro-flow.test.ts.

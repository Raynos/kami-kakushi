# Playtest feedback — 2026-07-10 (async inbox capture, `log-panel` lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), the **log-panel**
cluster lane (ADR-171 regroup: 14 r0 captures + 2 the-log captures sharing the
log-panel fix surface). Reserved block **FB-285..297**; capture-time-stamped
items keep their numbers (FB-228/261/262/263). Cross-lane FB-268/269/270/272-275
were drawn while both lanes were held by this session.
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## The Now view (fade behavior)

### FB-268 · two-way fade — keep the last 10, 60s TTL — ✅
**Verbatim (11:43):** _"I want to actually always keep the last 10 lines in it,
and have the rest fade, change the fade timer to 60s. / but also do a two way
fade… at either 60s old (beyond the last 10) or at 100 items in the log panel."_
**Also covers (11:52):** _"yeah the now panel is quiet which doesnt make sense…
things fade way too fast."_
**Fixed in:** the UI hunks (2b5d226) — `NOW_TTL_MS` 15s→60s, `NOW_KEEP_LAST=10`
floor (the newest 10 fleeting lines never age out), the 100-cap half already
lived in core (`LOG_EPHEMERAL_MAX`). FB-115 test updated to the new law.

### FB-280 · "what is this marriage flavor text" — 💬 answered
**Verbatim (11:51):** _"Lol what is this flavor tet and where did it come from i
barely saw in the Now section it was marriage related."_
**Answer:** an ambient story-flavor line ("Married out to the next valley…") —
authored world-texture, not a bug. "Barely saw it" is the FB-268 fade problem
(fixed above); with the 60s/keep-10 law it stays readable.

## Speaker color + indent

### FB-267 · Genemon's speech not tinted (live-typed lines) — ✅
**Verbatim (11:46 / 11:51 / 12:07, three captures):** _"Genemon text is not
yellow again"_ etc.
**Reading:** `typeLine`'s finalize re-render skipped narrator-VOICED lines, so a
live-typed narration line's embedded quotes never got the FB-228 inferred
speaker tint — a refresh repainted them correctly, which made it look random.
**Fixed in:** the UI hunks (2b5d226) — finalize re-renders narrator-voiced
lines too. (The three sidecars were already stamped done by the earlier FB-228
voice-law pass; this closes the residual live-typing path.)

### FB-261 · one speech line not indented — ✅
**Verbatim (14:12):** _"This text here, is not indented like the rest of the
text that is speech from the cold open."_
**Reading:** the typewriter path omitted the `.spoken` step-in class that the
static paint path adds — live-typed speech sat flush-left until a refresh.
**Fixed in:** the UI hunks (2b5d226) — `typeLine` stamps the same `spokenClass`.

## Post-rung-up Story flood → the ceremony

### FB-272 · gate/gateyard + woodshed reveals move to the ceremony — ✅
**Verbatim (12:15):** _"AFter the rung up finishes there's way too much flavor
text that just popped in… can show on the rung up screen instead."_ + _"They
give you the lean space between the woodpiles… I guess the rung up screen it
can go about your 'home' area."_
**Fixed in:** the core-set commit — `ceremonyLabel` per surface; the ceremony
lists them; the Story revealLines removed.

### FB-273 · seasons/days line → Now — ✅
**Verbatim (12:17):** _"That the turning of the seasons and days exists, can be
flavor text in 'Now'; instead of showing up here in the Story panel."_
**Fixed in:** the core-set commit — the `readout-clock` reveal line is
`ephemeral: true` (Now only, fades).

### FB-274 · estate-repair line struck — ✅
**Verbatim (12:17):** _"Let's strike this line for now, it's obvouis by the time
you get to the Estate section and I need to think harder about the Estate
section TBH."_
**Fixed in:** the core-set commit — `panel-estate` revealLine removed. (The
"think harder about the Estate section" thread is HR-9's, not this lane's.)

### FB-275 · no flavor for eating & rice — ✅
**Verbatim (12:17):** _"I don't think we need flavor text for eating & rice."_
**Fixed in:** the core-set commit — `verb-eat-rice` revealLine removed.

## Unread + duplication

### FB-276 · Progress didn't show unread for Rank Up — ✅ (no repro; FB-222)
**Verbatim (12:18):** _"Progress did not show unread for Rank Up."_
**Reading:** could NOT reproduce on the current build — drove the full R0→R1
beat headlessly (live and refresh-mid-beat): the Progress dot fires. The FB-222
seeding fix (session 145, landed between the capture and this drain) covers
exactly this class. Re-capture if it recurs.

### FB-269 · duplicate questions in the log after refresh — ✅
**Verbatim (12:18):** _"The questions are duplicated here, and now all of sudden
you are nameless lol. Let's be consistent in your own name, the color etc. / i
think refreshing between saves appended duplicates to the log."_
**Fixed in:** the core-set commit — an already-asked topic is a full no-op (no
re-emitted Q+A block; the VN transcript already shows it). On the name: the
You→Nameless flip is AUTHORED (the G4.7 speaker ladder — the witnessed naming
latches `label-nameless`); the color is one token (`--v-player`) on both names.
If the flip itself reads wrong, that's a story call → say the word and it
becomes an HD-item. 💬

## Dividers + unread reveal

### FB-270 · section dividers get context — ✅
**Verbatim (12:19, two captures):** _"These section dividers are good but they
have no context, maybe we need some thing here like 'With Genemon, day-hand
promotion'"_ + _"With Soan - Cold open."_
**Fixed in:** core carries `context` on chat openers ("the cold open" /
"The day-hand promotion"); the kicker renders "— with Genemon · The day-hand
promotion —".

### FB-285 · unread Story types in on tab open (continues FB-228) — ✅
**Verbatim (13:40):** _"I would like an unread Story* log to slowly render in
the unread lines one by one as if I had it open the whole time."_
**Fixed in:** the UI hunks (2b5d226) — opening a tab paints the READ history
instantly, then the unread tail plays through the fresh divider + cascade +
typewriter (the >12 flush valve still protects a huge backlog).

## The log at Story level (the-log bucket)

### FB-262 · VN grouping units in the Story log — 🔧 diverge live
**Verbatim (14:17):** _"The log is just generally unorganized at the 'Story'
level… I think we need entire little sections in there with a proper border
that's like a 'VN' section."_
**Built:** core tags every VN line with its scene (`context`); the renderer
groups consecutive scene lines into one unit with a scene-name header; THREE
treatments live behind `[data-vn-groups]`: **a · 幕 card** (hairline gold box —
the self-picked prod default) · **b · margin rail** · **c · raised plate**.
DEV Variants-tab registry entry + per-variant HR items follow once the dev.ts
lane is free (w6 holds it). Old saves' lines carry no scene tag (they predate
the field), so grouping shows from new play onward.

### FB-263 · log contrast — narrator toward white — ✅
**Verbatim (14:19):** _"I think the contrast is wrong here… the colors here all
bleed, the blue of the text, the dark blue of the background… What if we used a
white here, or even a bright white for narrator story text?"_
**Fixed in:** the UI hunks (2b5d226) — `--v-narrator` #9aa4c4 → **#e7e9f0**
(bright near-white, ~13:1 on steel; chroma ≈ 0 so the FB-228 figure/ground law
still separates by CHROMA — neutral ground, chromatic voices).
**Doc-update plan:** ui-design.md §v-\* ramp line (narrator "muted blue-grey" →
"bright near-white") — rides the next docs pass.

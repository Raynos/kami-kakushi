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

---

## Second pass — 2026-07-10 evening (session 162, `log-panel` cluster re-lane)

12 `the-log` + 2 `r1` captures re-laned into this lane (ADR-171 collision
announce → the human's steer: one owner for the whole fix surface). All 14
capture-time-stamped (FB-315..FB-344); wholesale-approved: all fixed,
re-anchor-when-pinned divider policy, speaker-style zone prefix.

### FB-315 · VN-read chat replays in the log — ✅
**Verbatim:** _"When you open the chat panel, I don't need to see the chat scrolling, like i already saw it scrolling in the VN … everything I read in the VN is fundamentally not unread … But I appreciated the rest, showing the rest of the unread messages one by one, that's a great idea, just not for these VN lines I already read."_
**Reading:** VN-displayed lines must count as READ; the one-by-one unread reveal stays for genuinely-unseen lines.
**Distilled rule:** a line the player already read on another surface is never "unread" on this one (TST4).
**Fixed in:** 8abc9f03 — scene-context lines arriving while a VN is live pre-mark themselves seen per matching filter.

### FB-316 · scene-card grouping shows black gaps — ✅
**Verbatim:** _"…you can see all kinds of black space in between, the box is not clean, that looks like a UI / CSS mistake. we want all of that which belongs together to fit togeth."_
**Reading:** the 幕 card fractured — in-card speaker-break margins split the bordered box; mid-scene lines (choose_intro react, ask answers) lacked the scene context.
**Fixed in:** 76c73130 — every scene-emitted line carries its context (core) + in-card breaks become padding (CSS). Old saves keep their stored context-less lines; new runs heal.

### FB-317 · card sections need unique names + grouping — ✅
**Verbatim:** _"Each card section needs a unique name and better grouping, its not clear to me."_
**Reading:** one clean box per scene, exactly one lintel naming it; no duplicate heads on reopened fragments.
**Fixed in:** 8abc9f03 (lintel dedup) + 76c73130 (the grouping causes).

### FB-318 · kura-count line shows too early — ✅
**Verbatim:** _"This log line shows too early, I know that the kura open to me but it should show after the cold open VN"_
**Fixed in:** 22d11325 — `readout-rice` gates on `awake && !introActive`; the reveal lands right after the cold open.

### FB-319 · strength-count line too — ✅
**Verbatim:** _"Also something that can show after the VN open"_
**Fixed in:** 22d11325 — `readout-body`, same gate.

### FB-320 · Story expands with a vn/all toggle — ✅
**Verbatim:** _"I'm thinking we want the Story to expand when selected and have a little toggle inside of it that says 'vn / all' … Because VN text is the 'MAIN MAIN STORY' and the rest is all flavor text you can see in all."_
**Fixed in:** 549c5652 — Story expands a mini vn/all segmented pair while selected; `vn` = scene lines only (the same context discriminator the 幕 cards group by). Default stays `all` — say the word if `vn` should lead.

### FB-321 · typed text lacks colors/italics — ✅
**Verbatim:** _"I fucking saw that lol, as the text scrolled it didnt have the correct colors or italics."_
**Reading:** the typewriter typed into a bare text node; the `.speech` quote styling only applied at finalize.
**Fixed in:** fd934341 — the line builds fully styled up front; the text reveals progressively ACROSS the styled spans. (The hunk rode w6:p1's FB-324 commit — a staging race, content is this fix; noted in both journals.)

### FB-322 · same, mid-scroll — ✅
**Verbatim:** _"do you see what I mean its not italics or correct colors here as its scrolling."_
**Fixed in:** fd934341 (same fix as FB-321).

### FB-323 · new text without the NEW divider — ✅
**Verbatim:** _"I also saw this pop in as new text, but it didnt say new remember all NEW text that gets written gets the NEW divider ( 60s to fade )"_
**Reading:** two holes — the anchored divider sat stale far up-log for a reader pinned at the foot; a coalesced ×N bump never marked at all.
**Distilled rule:** the 新 divider marks the read/unread boundary — pinned-at-foot means it re-anchors with each arrival (your pick).
**Fixed in:** d8c2d1b1.

### FB-325 · Now tab didn't highlight on rake — ✅
**Verbatim:** _"I pressed rake the spilled rice, but the color of the now tab didnt change to highlight it has new text."_
**Reading:** a real hole, reproduced — a coalesced repeat (same key, ×N bump) never re-stamped, so the lamp stayed dark after its first 10s window.
**Fixed in:** aab5b957 — `stampEphemeral` re-stamps on a count bump.

### FB-326 · Now highlight should change the background — ✅
**Verbatim:** _"The Now having next text should also change the background color of the button, not just the text."_
**Fixed in:** aab5b957 — `.tab-now.live` gains a warm gold background wash.

### FB-330 · logs rescroll when the rung-up VN ends — ✅
**Verbatim:** _"I saw all the logs rescroll in when the rung up VN was done, that doesn't feel right, i dont think it should rescroll on render."_
**Reading:** scroll writes were no-ops while the shell was hidden; the reveal then re-scrolled + re-animated in front of the player (TST2).
**Fixed in:** 8abc9f03 — VN-end lands dead still: a real repaint for the VN-forced filter, no backlog reveal anim, instant pre-pin to the foot.

### FB-331 · VN-read chat scrolling again — ✅
**Verbatim:** _"same issue, the chat text i already read in VN is scrolling here."_
**Fixed in:** 8abc9f03 (same fix as FB-315).

### FB-344 · zone flavor needs a name prefix — ✅
**Verbatim:** _"The zone flavor text here i think needs a prefix like 'Zone [name]: [text]'"_
**Fixed in:** ec8f1b60 — the arrival line carries the node's label as its speaker → "Kura: <description>" via the existing styled prefix (your pick: speaker-style over the literal "Zone …:").

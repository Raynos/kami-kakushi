# Playtest feedback — 2026-07-11 (async inbox capture, `mapsheet` lane)

Source: the in-game capture inbox (`project/playtest-inbox/`), the **mapsheet**
bucket lane (3 open items). FB-stamped at capture time; no reserved block
drawn. Drained in the 2026-07-10→11 all-lanes parallel pass (ADR-171).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## The live map's frame

### FB-370 · the map is too big for the view pane — ✅
**Verbatim:** _"Nice try lol, now the map is too big here, Like it still needs
to fit in the view pan."_
**Reading:** follow-up to the FB-339 zoom/pan/fit work — the svg sized from
width alone (3:2 sheet aspect), so at 1496×752 the bottom ~280px (the house
compound, the walkable seals) hung below the fold; ⤢ fit resets the viewBox,
never the CSS box.
**Fixed in:** `2ff55503` — the wrap sizes to the sheet's own aspect at
whichever of width/available-height binds (no letterbox — an svg paints
beyond-viewBox art into letterbox bands), re-measured on resize.

## The R1 reveal schedule

### FB-375 · why is the weir rendered at R1 — 💬 answered
**Verbatim:** _"Why is weir rendered here in R1 theres only three zones"_
**Answer:** working as designed — the weir, sickroom, forecourt, and kitchen
are rung-0 cold-open ground carrying no `revealFlag` (the river left him at
the weir; he was carried to the sickroom): walked ground before R1's three
NEW unlocks (gate · paddies · woodshed). The fiction causes the map (TST3).
If story-strict fog is wanted instead (R0 zones hidden until re-visited),
that's a reveal-schedule design fork → say the word and it becomes an HD-item;
the data edit itself is trivial.

### FB-376 · why is Sōan's sickroom rendered at R1 — 💬 answered (+ a real fix)
**Verbatim:** _"Why is soans sickroom rendered here theres onl 3 zones
available in R1"_
**Answer:** same mechanism as FB-375 (rung-0 node, no `revealFlag`).
**Adjacent find, fixed:** the repro surfaced a genuine TST4 gap — at R1 you
stand at the kura, an unsurveyed R3 zone, and the map drew NO here-ring for
your own position (likely the root of the "where am I" confusion).
**Fixed in:** `2ff55503` — the here-ring draws even on unsurveyed ground (the
ring alone; never the zone's seal or name — reveal-as-plot holds). Whether the
START LOCATION should be an unsurveyed zone at all is a design call, left
untouched.

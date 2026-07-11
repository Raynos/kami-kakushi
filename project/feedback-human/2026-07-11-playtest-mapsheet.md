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

---

## Second pass — 2026-07-11 (10 items, FB-377…FB-386)

Same lane, drained in the session-171 all-lanes pass; wholesale proposal
approved by the human in-session (fog + seals + layout now; kitchen/sickroom
reveal fiction-led, drafted for sign-off).

## The Map tab's frame

### FB-377 · pin the map top-left, more air at the bottom — ✅
**Verbatim:** _"Place the actual map to the left, add a bit more padding /
margin at the bottom of the screen, but anchor the map closer to the top of
the box, with a bit less padding / margin at the top."_
**Reading:** the height-capped sheet centred itself (`margin: 0 auto`) and sat
below the you-are-here card, leaving dead space left + top.
**Fixed in:** see FB-386 (one layout change covers both).

### FB-386 · zone description floats right of the map — ✅
**Verbatim:** _"With the map moved to kind of pin or fit to the top left; we
can move this zone description text to the right hand remaining panel floating
next to the map."_
**Fixed in:** `.map-pane` becomes a wrapping flex row — the sheet pins
top-left (margin 0, +12px bottom air), the you-are-here card takes the freed
right column (falls below on a narrow pane).
**Distilled rule:** when one element is aspect-capped, the freed axis is
usable layout space — park the companion text there, never below the fold.

## Fog of war — coverage

### FB-378 · the fog misses the forest — ✅
**Verbatim:** _"The fog of war is partially implemented, it does not include
the actual foreset."_
**Reading:** the fog sheet covered only the T0 window inset by 20 units; the
world art paints past the window edge and the pan clamp travels ±25% beyond
it, so the east woods showed unfogged.
**Fixed in:** the fog rect overshoots the window by 35% each side (past the
pan clamp's maximum reach, verified arithmetically) — with FB-385.

### FB-385 · the outskirts beyond the estate should be fogged — ✅
**Verbatim:** _"The bottom and right and outskirts of the map beyond the lines
of the house/estate should also be fog of war"_
**Fixed in:** same change as FB-378 (the fog margins).

### FB-379 · the cartouche text should fog too — ✅
**Verbatim:** _"This text is not hidden under fog of war, no reason to make it
visible, just fog of war it."_
**Reading:** the art-level cartouche slip was a deliberate ADR-151
`FURNITURE_HOLES` exemption ("the family owns the document"). The live sheet
draws its own title above fog, so the exemption carried no information —
human steer reverses it for the cartouche (north arrow + scale bar keep
their holes).
**Fixed in:** cartouche hole removed from `FURNITURE_HOLES`.

### FB-384 · reachable home paddies must not sit under fog — ✅
**Verbatim:** _"If home paddies is reachable it should not be in the fog of
war."_
**Reading:** the rung-1 `known` polygon predated paddies unlocking AT R1 — the
paddies anchor sat outside it, exactly under a stale 未 ghost chip.
**Fixed in:** the rung-1 polygon gains a SW pocket covering the paddies; the
ghost chip is dropped (the live sheet's `fogFrontier` already marks the next
ground with its own 未測).
**Distilled rule:** reachable ground is never under fog — reveal data must be
derived-from/checked-against the rung's real unlock list, not authored from
memory.

## Fog of war — what seals may show

### FB-380 · don't preview the ruined compound under fog — ✅
**Verbatim:** _"Dont preview things under fog of war, the ruined compound,
fully hidden under fog of war"_
**Reading:** locked scenery drew its greyed seal unconditionally, naming a
place the survey hasn't reached.
**Fixed in:** seal painters consult the new `isFogged()` — a locked-scenery
seal waits under fog until the paper is surveyed.
**Distilled rule:** nothing under unsurveyed paper is previewed by name
(reveal-as-plot, TST3) — fog gates *names*, not just ground art.

### FB-381 · kitchen threshold shouldn't show at R1 — ✅
**Verbatim:** _"I still ahve no idea why kitchen threshold is shown in R1 as
an area you could walk to why is it not completely removed from the map to be
revealed later ?"_
**Reading:** the FB-375 design fork, now taken: the human wants the R0
bible-anchor ground gated. Direction locked in-session: separate, fiction-led
beats (ADR-177 weir pattern): `room-kitchen` revealed by the R1 terms beat
(Genemon names "meals at the threshold"), announced on the ceremony.
**Fixed in:** `8686618e` (draft approved in-session).

### FB-382 · same for Sōan's sickroom — ✅
**Verbatim:** _"Same with sick room"_
**Reading:** as FB-381: `room-sickroom` revealed at R3 with combat (the
grain-watch/wolf beat — hurt men go to Sōan; defeat relocation lands there
only after combat exists, so the reveal always precedes it).
**Fixed in:** `8686618e` (draft approved in-session).

## The rung-up ceremony

### FB-383 · R0 rung-up didn't mention the woodshed — 💬 answered (not reproduced)
**Verbatim:** _"The R0 rung up only mentioned three zones, paddies, gate,
forecourt, it didnt mention wood shed, these 4 zones make sense for R1 but
they should be mentioned"_
**Answer:** could not reproduce — drove the real R0→R1 ceremony headlessly
(fixture `rung-beat-ready`): "Now open to you" lists all three R1 unlocks
verbatim, including "The woodshed corner — a mat, a bowl, a nail for the
coat: yours". It never lists the forecourt because the forecourt is R0 ground,
not an R1 unlock (likely the memory slip). If the kitchen reveal (FB-381)
lands at R1, the ceremony will name it as a fourth line via its
`ceremonyLabel`.

---

## Third pass — 2026-07-11 (9 items, FB-389…FB-397)

Same lane, drained under an ADR-171 claim (`w1:p3`); wholesale proposal
approved with two steers: FB-389 covers travel TIME too (ruled ×2 here, then
superseded mid-drain by the human's direct walk-table steer in the `w6:p1`
porter session — that lane owns `timing.ts` now), and the shared files
(`sheet-map.ts`, `dev.ts`) were ceded to `w6:p1` mid-pass.

## The porter piece

### F389 · walking animations are too fast — 🔧
**Verbatim:** _"Walking animations are too fast. tbh"_
**Reading:** two halves — the traverse (clock-synced) felt fast because the
per-edge walk table is short, AND the free-running netsuke waddle cycled at
0.4s/0.8s.
**Fixed in:** the gait halving (bob ~0.8s, rock ~1.6s cycles) is folded into
`w6:p1`'s porter batch (with the walk-table change) — stamp on its landing.

## Fog of war — the corners

### F390 · top-left corner is not in fog of war — ✅
**Verbatim:** _"This top left corner is not in forg of war lol"_
**Reading:** the fog's `FURNITURE_HOLES` (north arrow) exposed the world art
beneath — the river + "upstream" sketch read as an unfogged corner.
**Distilled rule:** never punch a HOLE in a mask to keep chrome visible —
raise the chrome ABOVE the mask; a hole shows everything beneath it.
**Fixed in:** `0fdf3d14` — holes deleted; north arrow + scale bar ride a
`.ms-furn-lift` group raised above the fog.

### F391 · bottom-left corner neither — ✅
**Verbatim:** _"Neither is this bottom left corner"_
**Reading:** the scale-bar hole — same mechanism as F390 (the old-fields grid
+ its label showed through).
**Fixed in:** `0fdf3d14` (with F390).

## Fog of war — the frontier marks

### F392 · random floating kanji means nothing at R1 — 🔧
**Verbatim:** _"Random floating kanji in the fog of war means nothing in the
R1 stage"_
**Reading:** the fog-frontier 未測 washes draw at hidden zones' anchors; three
of six at R1 sit on BLANK paper fog, reading as noise.
**Fixed in:** the `isFogged` guard in the fogFrontier loop — implemented in
`w6:p1`'s in-tree `sheet-map.ts` batch (per the mid-drain coordination) —
stamp on its landing. Washes over drawn ground stay (they mark visible but
unsurveyed ground).

### F393 · more floating kanji — 🔧
**Verbatim:** _"More floating kanji that has no meaning in R1"_
**Fixed in:** with F392.

### F394 · this kanji too — 🔧
**Verbatim:** _"This knaji too."_
**Fixed in:** with F392.

### F397 · kanji here has no meaning — 🔧
**Verbatim:** _"Kanji here has no meaning"_
**Fixed in:** with F392.

## The sheet's English notes

### F395 · the english hint is nice — ✅ (praise)
**Verbatim:** _"This english hint is nice."_
**Reading:** reinforcement of the FB-181/183 English-notes policy (the
surveyor's hand writes English on the player-bound sheet). No change.

### F396 · nice flavor text, but cut off — ✅
**Verbatim:** _"This flavor text is nice too. But its cut off."_
**Reading:** world-art text labels were not fog-aware — the mask sliced
"to the village — half a ri" mid-glyph (and "the old stables — stalls
for…", reproduced at HEAD).
**Distilled rule:** a text label is ATOMIC against any reveal mask — show it
whole or not at all; never let a mask cut a sentence mid-glyph.
**Fixed in:** `0fdf3d14` — `ms-sheet-note` labels hide when anchored under
fog, lift whole above it otherwise. (Known bbox imprecision: `isFogged` is
bbox-cheap, same semantics the seal painters use, so a note just outside the
known POLY but inside its bbox lifts whole — reads as a rumor note, accepted.)

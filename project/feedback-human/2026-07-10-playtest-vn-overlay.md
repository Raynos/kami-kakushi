# Playtest feedback — 2026-07-10 (async inbox capture, `vn-overlay` lane)

Cross-bucket cluster lane (ADR-171 regroup): the cold-open capture sharing the
vn-overlay fix surface with two r0 captures, drained by the w6:p1 r0+dev pass.
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

### FB-360 · "i cant click continue lol" — ✅
**Verbatim:** _"i cant click continue lol"_
**Reading:** the third leg of the FB-358/FB-359 cascade: the Continue the human
clicked belonged to a STALE VN scene left mounted after the New game swap to a
pre-awake state (the capture's save is a fresh pre-awake run). Its dispatch
(`choose_intro`) is refused by the pre-awake reducer, so the button is dead by
construction — the bug is the overlay surviving, not the button.
**Fixed in:** this commit (with FB-359) — the pre-awake render branch now tears
the VN scene down, so no dead Continue can survive a New game.

### FB-327 · literal "Say nothing." spoken aloud — ✅
**Verbatim:** _"lol bro for real. say nothing should clearly say \"...\" not
literally the words say nothing."_
**Reading:** the r1 beat's silent option echoed its LABEL into the transcript
as the MC's spoken line — `Nameless: "Say nothing."` — because label doubles
as `say` when no override is authored. The grammar already supports `say:`.
**Human pick (fork):** echo as `Nameless: "…"` (over narration-style "You say
nothing." and keep-literal).
**Fixed in:** this commit — `say: "…"` on `r1-kept` in rung-beats.md +
regenerated registry. Verified live from the capture's save: the transcript
now reads `Nameless: "…"`. (R5's "Say nothing. Stand for the count." is
half-silent, half-action — left as-is deliberately; flag it if it grates.)

### FB-329 · "3 zones open ⇒ fog of war + movement lock" — 💬 answered
**Verbatim:** _"if you say that these 3 zones are open to me then / - The map
better have fog of war hiding the rest. / - It should not be possible to move
to anything else on the map because only those 3 are open to me."_
**Answer:** the build already does both. Reproduced from this capture's exact
save, through the ceremony to the map at fresh R1: only the estate core (weir /
sickroom / kitchen / forecourt — the always-open R0 ground) plus the three
ceremony zones (gate · paddies · woodshed) render; five 未測 "unsurveyed
ground" fog markers hang one step past the frontier, deliberately UNNAMED
(reveal-as-plot); and `canMove` refuses any unrevealed target — the seals
aren't even wired as travel controls until their reveal flag unlocks. The
capture element was the ceremony text, before the map was opened. If the map
you saw in-game contradicted this, capture it ON the map tab and I'll chase it.

**FB-327 addendum (post-drain follow-up, same day):** R5's half-silent option
`r5-stand · "Say nothing. Stand for the count."` now also echoes as
`Nameless: "…"` — Naoyuki's react ("he offers— nothing. Note that.") already
carries the standing beat, so the ellipsis loses nothing. Fixtures R5+
regenerated (the echo lives in their logs).

**FB-329 addendum (post-drain follow-up, same day):** visual proof captured
from this capture's save, driven past the ceremony + SLOP gate to the live map
tab at fresh R1 — `project/audit/screens/2026-07-10-fb329-map-fog/
map-fresh-r1.png` (local-only dir; screens/ isn't tracked). Verdict by eye:
named seals only for the estate core + gate/paddies/woodshed, the ruined
compound greyed + locked, five unnamed 未測 markers past the frontier. Note:
the sheet's faint BACKGROUND terrain art (the drawn survey plan) is visible by
design — the committed golden-pin look. If the ask was to fog the artwork
itself, that's a map-spec taste change → route through the map-sheets skill.

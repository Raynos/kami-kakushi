---
unit: u2-r2-yard-hand
take: b
stance: the held breath — grief close under the surface; warmth priced and
  rationed; human detail forward; what people almost say
covers: T0 ladder R2 (the silent rung) — the yard's round simply not taken
  back; pay turns from meals to dry rice; the seasons/calendar unlock (a man
  counts days again when he has a future — t0.md calendar bundle)
---

<!--
STAGED, NOT COMPILED — t0v2 prose wave (ADR-139). The compiler reads only the
six canon files + takes/; this file migrates by git mv at the rewrite.

Wiring notes for migration:
- `motivates:` uses forward ids for the rebuilt T0's calendar bundle
  (panel-calendar, verb-yard-round) — map to real unlock ids at build.
- O-Hisa is NEW cast: needs a NAMES entry (+ NpcId if she takes memory)
  before emit — speaker lines here will not resolve until then.
- Per t0.md the seasons DISPLAY unlocks at R2; season CHANGE stays a manual
  action with its own overlay (a separate unit). This beat only turns the
  counting on.
-->

## rung R2 · rung-r2
speaker: rokusuke
voice: villager
motivates: panel-calendar, verb-yard-round

> The pair that went south have been gone a week. Their quitting was a
> morning's talk at the board; their share of the yard was no talk at all.
> It is a rake left standing where he set it, and nobody sent to take it
> back.

> Morning. He stands at the board the way a man stands to be told, and is
> not told. Through the open window the steward's brush is moving. It does
> not stop for him.

Rokusuke: "Gate, well, woodpile, court. Nobody's said anything. I'd leave
it that way."

> He leaves it that way. The round takes him to noon. The court was laid
> for five times the hands that keep it, and there is no line on the gravel
> where anyone told the yard to be smaller. Past the lantern-stones it
> keeps its leaves.

> At the threshold, at evening, the bowl does not come. O-Hisa sets down a
> cloth instead, knotted at the top, heavy the way a meal is not.

O-Hisa: "Rice. Dry, so mind it. The house pays a yard-hand in rice."

O-Hisa: "There's a small pot under the kitchen shelf. It isn't doing
anything. Bring it back when — bring it back."

> She is inside before the knot is open.

### ask r2-round · "Whose round was this?"

Rokusuke: "The two that went south split it. Before them, more of us. Rake
to the lantern-stones; past that it keeps its leaves, and nobody's said
anything about that either."

### ask r2-pot · "Whose pot is it?"

O-Hisa: "The kitchen's. It's been the kitchen's a long time. If it boils
dry it'll crack, so don't let it."

> In the woodshed he weighs the cloth in one hand and the days in the
> other. Six to the market. He cuts a notch in the doorpost with the
> hatchet's corner — one line, low, where his eye falls from the mat.

> Lower on the post, grey with age, older rows. Hands before him, counting
> the same six days to the same market. Every row ends even.

> Six days to the measure. Past the measure, the planting. Past that he
> does not go. It is a long time since he had a day worth counting. Now he
> has six.

### decide · The knot under his thumb — what does he do with the measure?

#### r2-cook-full · "Cook a full pot tonight."

O-Hisa: "The cloth's back already, then. You'll be at the threshold come
morning for the — no. The kitchen doesn't feed a man twice-paid. Well.
Mornings the broth is only water and miso. Nobody counts water."

flags: r2-ate-full

#### r2-halve · "Tie half back into the cloth and hang it from a nail."

Rokusuke: "Rats'll climb a nail for less. Wire it, and higher than you
think."

flags: r2-counted-days

#### r2-ask-measure · "Carry the cloth back and ask how it is meant to stretch."

O-Hisa: "Three shō. Five gō the day and it comes out even at the market —
if the market keeps its day. It keeps its day. Your bowl holds one gō
level to the lower chip; twice that, boiled, is a day."

flags: r2-asked-measure

<!--
native: the calendar unlock reveal. At scene end the engine must (1) grow
the header's day-of-week line into day + season + a notch count (the
panel-calendar unlock from motivates:); (2) render the calendar panel's
fiction as the doorpost — a row of notches, market at the sixth — not an
abstract date widget; (3) keep season change a manual action (t0.md), gated
elsewhere. The promotion itself writes NO summons and NO praise anywhere:
the rung's only official trace is the day-book line below, carried by the
Progress lane, never spoken.
-->

## prose flavor

### calendar-post

A row of notches on the doorpost, one to a day. Market at the sixth. The
older rows below his are not his business, and end even.

### day-book-r2

The yard: one hand. Rice, three shō the market-week. Kept.

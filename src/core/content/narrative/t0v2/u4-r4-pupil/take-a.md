<!--
unit: U4 · R4 — the pupil
take: a
stance: the ledger — maximal restraint; the day-book's temperature; scenes
  end a beat earlier than comfort asks; silence load-bearing
covers: t0.md ladder row R4 whole — the confession at the board · the shame
  that drives the beg · the creed on-screen once · the drill yard opened as
  Kihei's need (the oiled rack, the buried men — never a grant list)

STAGED, NOT COMPILED (t0v2). Notes for the wiring pass:
- motivates ids are v2-staged placeholders; bind to the real unlock ids at
  the build wave.
- native: the MC's two spoken lines use the `Nameless:` speaker label (the
  speaker-label ladder, 04-cast.md). If the compiler's NPC_NAME map lacks an
  MC entry at this rung, the engine must provide the Nameless label for
  MC-voiced beat lines.
- authored answer behind the confession (reconciling R3's "rice untouched"):
  the wolf ate nothing — but the MC OPENED the inner door and chose the
  fight among the bales rather than let the wolf dig through the screen; the
  fight fouled two bales (his blood, the scuffle) and split the door. The
  fault is real, mundane, and arguable — that is what he confesses.
- the creed appears ONCE, before the decide, so no react duplicates it
  (echo craft: a future callback @-reuses this line, never retypes it).
-->

## rung R4 · rung-r4
speaker: kihei
voice: arms
motivates: panel-drill-yard, verb-drill, verb-spar

> The board, the morning after the wolf. You come to it at the pace the ribs
> allow. Genemon's window is open; the day-book is open under it.

Nameless: "The wolf took nothing. The house lost anyway. Two bales fouled.
The inner door, split. I opened that door myself. Put it against my rice."

> Genemon looks at you one count longer than the numbers need. Then he
> writes.

Genemon: "Item: rice, two bales, fouled. Item: the inner door, split.
Reported by the hand himself."

Genemon: "Against your rice, three weeks. The door mended before the wet."

> He blots the line. The window stays open behind you the whole way across
> the forecourt.

> The meal is waiting at the kitchen threshold. You leave it there and cross
> to the old stable court.

> Stalls for twenty horses; the house owns one mule. Kihei is at the gear
> rack he has kept oiled, all these years, for nobody.

Nameless: "Drillmaster."

> The next words take their time coming.

Nameless: "I held the door. It cost the house two bales. Teach me to hold it
for less."

> Kihei takes your wrists and turns the hands over, the way a man turns gear
> he is deciding whether to buy. The scars get a longer look than the
> calluses.

Kihei: "I have buried men this house liked better than you. Not one of them
drilled."

Kihei: "So hear the terms, once. Talent is a story the lucky tell. You are
not lucky. So you will work."

> On the wall above the court, the heir's boy has given up pretending he is
> not watching.

### decide · The terms stand in the cold of the court. Answer them.

#### r4-terms-work · "Then I will work."

Kihei: "...Good. First light. And eat first — the house has no rice to spare
for lessons that don't hold."

memory: kihei +1 (steady)
flags: r4-terms-work

#### r4-terms-wolf · "The wolf is alive. It knows the way in now."

Kihei: "A watchman's answer. Then we drill for the wolf — the spear first;
a sword when you've earned a sword's price. First light."

memory: kihei +1 (watchman)
flags: r4-terms-wolf

#### r4-terms-count · "I can pay in work. The door wants mending anyway."

Kihei: "The yard is not the board. What this costs, you pay in the morning,
every morning. First light."

memory: kihei +0 (dealer)
flags: r4-terms-count

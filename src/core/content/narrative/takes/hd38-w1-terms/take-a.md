## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-paddies, verb-farm, verb-haul, readout-clock, readout-stamina,
  panel-rung-ladder

> Morning at the board. The hands take their rice at the threshold; the
> steward's papers hold the table's far end — an estate's worth of paper on a
> kitchen table. Genemon calls you up from the step without looking up.

Genemon: "Two hands took the lowland road this week. Wages drawn through the day
they left, lines struck. The yard is short. The work is not."

> It is the first you have heard of any leaving.

> He opens the day-book to a page already half-filled with other men, wets the
> brush, and begins to write you into it. He reads each line aloud as it goes
> down, the way a man checks a sum against the page.

Genemon: "Hired by the day. Day-hand, no rank."

Genemon: "Labour: sun to sun, at whatever the yard wants doing."

Genemon: "Counted each day in this book. A day worked is a line. A day not
worked is a line as well."

Genemon: "Wage: none."

> The brush stops on that line. It is the shortest one on the page and it takes
> him the longest to write.

Genemon: "Objections: heard now, or kept."

> Then he lifts his eyes off the page, and his voice comes up out of it —
> slower, and pitched to a man rather than a book.

Genemon: "That last one is not a formality. Hear the wage line again, because
it is the one men mishear. The house pays you nothing. Every coin this house
takes in is owed to somebody in the town before it ever reaches this yard, and
the yard is where you stand. There will be no coin. Not late, not small. None.
A man who agrees to that and then waits for it will hate us by autumn."

> The entry sits there, finished. Work, by day, no coin. There is no line for
> where you eat. There is no line for where you sleep. Written out, a man comes
> to very little.

Genemon: "The paddies want you by full light. Say now if you will not."

> Nobody stops eating. Two hands lost was a morning's talk; one stray kept is
> not even that. The bowls go on.

Genemon: "The board has heard it. That serves for witness."

> On the veranda above the step, Naoyuki has stopped — the second son, papers of
> his own under one arm. Passing, and made a witness like the rest of the room.

Naoyuki: "The house is glad of —"

> The sentence stops. He stands with it a moment, as if he has read it back and
> found it not worth the ink.

Naoyuki: "Two hands left. You were here. That is all it is."

> He goes on along the veranda. He looked at you once.

> Then Genemon takes up the brush again, and asks it plainly, at board volume.
> The room hears without listening.

Genemon: "One thing before the ink dries. If a claim follows you here, I enter
it against your board. Is anything owing on you?"

### ask r1-the-two · "The two that left?"

Genemon: "Left owed nothing, owing nothing. Struck clean. The lowlands pay coin
in winter; I could not argue the sum, so I did not argue it."

### ask r1-why-keep · "Why keep me?"

Genemon: "The paddies take six hands at the least. Five sleep here now. You are
the sixth. If a better sixth comes by, the book will say so."

### decide · Is anything owing on you?

#### r1-none-claimed · "Not that I know."

Genemon: "Then the book says none claimed. It has lived with worse."

flags: r1-none-claimed

#### r1-kept · "Say nothing."

Genemon: "Kept, then. The book carries what is claimed, and I keep my own
margins."

say: "…"
memory: genemon +1 (kept-accounts)
flags: r1-kept-owing

#### r1-and-if · "And if there were?"

Genemon: "Then the house's claim comes first, while you eat its rice. After that
— whoever can find you. So far nobody has asked."

flags: r1-asked-owing

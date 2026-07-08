<!--
unit: U5 · R5 the accused — THE COUNT night
take: a
stance: the ledger — maximal restraint; the day-book's temperature; scenes
  end a beat earlier than comfort asks; texture over sentiment; silence
  load-bearing.
covers: t0.md ladder row R5 whole — the Count; Toku's packet missing;
  Naoyuki says his name first (he has none to say — the epithet is the
  beat); the day-book + Rokusuke's load-tally hold the exculpatory number;
  Toku in night-clothes — "It went up at the new moon."; nobody asks what
  it is for; NO apology. Plus the R5 economics turn (rice → day-wage in
  mon, per t0.md §Economics) played as the ledger's answer where an
  apology would go — a need dramatized, not a grant.

migration notes (staged, NOT compiled — scout §2/§4):
  - speakers `naoyuki` and `toku` are new-canon cast: NAMES / voices.ts
    entries must land before this compiles (emit resolveSpeaker throws).
  - `motivates:` id is a placeholder for the R5 unlock (the mon purse /
    wage readout); binds at the rewrite.
  - grammar-conformant throughout for git-mv migration.
-->

## rung R5 · rung-r5-count
speaker: genemon
voice: steward
motivates: readout-purse-mon

> A hand on the woodshed door, after the lamps are out. Rokusuke, holding
> his lantern low and his eyes lower.

Rokusuke: "The board. The Count came up short. Don't ask me."

> Count night: the closing moon, the day-book against the shelves, every
> entered thing answered for or missed. You have slept through two of
> them. Nobody woke you for those.

> The board room holds one lantern. Genemon sits with the day-book open
> and the kura shelf-list beside it. Naoyuki stands where the light ends.

Genemon: "Entered the fourth of last month: one packet, cloth-wrapped,
sealed, a hand's length. On the shelf at the last reckoning. Not on it
tonight."

> Nobody looks at you. That is how you know.

Naoyuki: "It would be proper to ask the hands in their order, oldest
service first. And I do not say — I would not have it thought that I —"

> He stops. You have no name for him to say. He says what there is.

Naoyuki: "The man from the weir. Him first."

> Genemon does not ask you anything. He turns the day-book back a leaf at
> a time, and reads.

Genemon: "Sixth: the far rows, first bell to dark, meals at the
threshold. Seventh, the same. Eighth: the reed screens, then the round.
It goes on so. Rokusuke — the loads."

> Rokusuke has the tally with him already: a slat of split bamboo,
> notched to the end and onto a second slat. He holds it out and looks at
> the floor.

Rokusuke: "Two hundred and six this moon, steward. One notch the load,
marked at the kura door. Every one his. The old slat has last moon's."

> Genemon lays the slat against the open book. For a while there is only
> the small sound of a page, then a page.

Genemon: "The book has his days. The tally has his loads. Entry against
notch they agree, this moon and the last. The count is done with him."

> Which leaves the shelf light by one packet, and the room quiet.

> The door has stood open for some of this. Toku is in it — night-clothes,
> hair unbound, the corridor's cold coming in ahead of her.

Toku: "It went up at the new moon. I carried it myself."

> Nobody asks her what it is. Nobody asks what it is for. Genemon dips
> his brush; that is all the answer the room makes.

> She goes the way she came. She never brought a light.

Genemon: "The entry moves to the new moon's date."

> He writes it. Then, without lifting the brush:

Genemon: "From tomorrow you draw the day-wage. Mon, counted into your
hand at dark, entered against your line. The rice stays for room and
board."

> Naoyuki has waited at the edge of the light through all of it.

Naoyuki: "It would be usual, I think, to say that I regret the — that
tonight was —"

> He rebuilds the sentence colder before it can finish.

Naoyuki: "The book clears you. You are still hiding something."

> He is first out of the room.

> In the day-book the night comes to three lines. The packet's entry,
> moved to the new moon's date. The count, even. A day-wage, opened
> against the man the book still enters as "name unknown."

> The book keeps no column for sorry.

### ask r5-why-mon · "Why mon, now?"

Genemon: "Because the entry changed. Meals keep a pair of hands. A wage
is owed to a man the book answers for — and as of tonight it answers for
you, two hundred and six times, in notches, at the door. The wage follows
the entry. That is the house's practice, not its thanks."

### decide · The lantern is burning low. What do you say before you go?

#### r5-quiet · "Nothing. Good night."

Genemon: "Good night. First bell is first bell."

memory: genemon +1 (steady)
flags: r5-quiet

#### r5-tally-why · "You counted my loads. Why?"

Rokusuke: "I count everything. Every load, every man's, mine first. If
it's marked they don't ask you, and if they don't ask you, you keep your
place. Twenty years now. — Yours were full loads. I'd have said so, if
they'd asked."

memory: rokusuke +1 (asked)
flags: r5-asked-tally

#### r5-my-line · "What does the book call me?"

Genemon: "One man, name unknown. Kept from the fourth month; day-wage
from tomorrow; answers for his days. It is a short line. It is getting
longer."

memory: genemon +1 (counted)
flags: r5-read-line

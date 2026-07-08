<!--
unit: U5 · R5 "the accused" — THE COUNT night
take: B
stance: the held breath — the house's grief close under the surface;
  warmth priced and rationed; human detail forward; what people almost say
covers: the whole R5 spec — the night count, Naoyuki names him first,
  the decide (how he stands accused), Rokusuke's load-tally + the
  day-book clearing him, Toku in night-clothes ("It went up at the new
  moon."), nobody asks what it is for, NO apology — plus the wage entered
  instead of one, and a morning-after log flavor key.
native:
  - NAMES / NPC_NAME registry entries for `naoyuki` and `toku` (new
    speakers) must land before this wires — emit-time resolveSpeaker
    throws on unknown names.
  - beat-chaining: `rung-r5-cleared` plays immediately after `rung-r5`'s
    decide resolves — one continuous night in the player's hands. The
    grammar has no post-decide prose form today; either add one or the
    engine chains the two blocks.
  - motivates ids are v2-provisional (the R5 day-wage unlock id is open
    until the economy ADR names it).
  - the scene opens from sleep — fiction framing only; no day/night
    system implied (the rung-up stays player-initiated per taste §9).
-->

## rung R5 · rung-r5
speaker: genemon
voice: steward
motivates: wage-mon

> A lantern crosses the yard long after midnight and stops at the
> woodshed. Rokusuke's face above it, saying nothing, meaning come.

> The board is lit. Genemon sits with the day-book open and the kura
> ledger beside it, and he is not writing — the first time anyone has
> seen him hold a still brush. Naoyuki stands at the veranda door in a
> house robe, arms in his sleeves against the cold.

Genemon: "Hulled rice, one to. Forty mon, strung. Wanting from the kura
against the count at the new moon."

Naoyuki: "In such a case the custom is to question the hands in the
order of their — no. The man from the weir. Begin with him."

> Nobody says the word. Everyone stands around the place where it
> would go.

### decide · The house is looking at you.

#### r5-turn-out · "Count my corner, then."

Genemon: "One mat. One bowl, chipped at the lip. A whetstone. A straw
coat, mended twice."

> He counts it by lamplight himself, on the spot, and writes it down.
> It does not take long.

memory: genemon +1 (nothing-hidden)
flags: r5-turned-out

#### r5-stand · Stand still. Say nothing.

Naoyuki: "It would be usual, for a man with nothing taken from him, to
ask what is — he asks nothing. Enter that as well."

> By the door, Rokusuke's shoulders come down a little. In the yard the
> quiet man is the safe man. He knows no other lesson to want for you.

flags: r5-stood-silent

#### r5-ask-what · "What is gone?"

Genemon: "Hulled rice, one to. Forty mon, strung. Gone under seal,
between the new moon and tonight."

> The question comes out of the weir man one word at a time, like coins
> counted from a small purse. It is the most anyone has heard him say
> since the wolf.

flags: r5-asked-what

## rung R5 · rung-r5-cleared
speaker: genemon
voice: steward

> Genemon turns the day-book back a page, and then another, reading
> with his finger.

Genemon: "Eleven loads in from the home paddy since the new moon.
Eleven entered. The seal on the kura was whole this evening. Whatever
went, went under seal."

> Rokusuke has not raised his head all night. Now he holds out his
> notch-stick and speaks to the floor.

Rokusuke: "Eleven. I notch what I carry."

> Genemon counts the notches twice. Eleven, and eleven. The book and
> the stick agree, and what they agree on arrives around the board
> slowly: the weir man never held the seal. Whoever opened the kura
> was of the house.

> Naoyuki takes a breath to speak. The door to the corridor is already
> open.

> She is small in it, in her night-clothes, bare feet on the board
> floor. Nobody woke her. Lamps travel in this house; she followed the
> light.

Toku: "It went up at the new moon."

Toku: "It has gone up at every new moon since the year the weir went."

> Nobody asks what it is. Nobody asks where up is. Genemon writes one
> line in the day-book, and the line is not what she said.

> Naoyuki looks at the weir man the way a man reads a page twice.

Naoyuki: "The book holds. That is not the same as — "

> He does not finish it.

Naoyuki: "The count is closed."

Genemon: "Six mon the day. Entered from tomorrow."

> It is not an apology. It is an entry.

> The lamp goes back across the yard the way it came. Nobody has said
> the word that stood in the room all night, and nobody says any other
> word in its place.

## prose flavor

### after-the-count

By first light the straw coat is back on the woodshed doorstep, mended
at the shoulder, folded seam-out the way careful hands fold. No note,
no knock. The stitching is new since last night.

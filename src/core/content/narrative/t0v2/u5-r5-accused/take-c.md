<!--
unit: U5 · R5 "the accused" — the Count night
take: c
stance: the weather — kernel #7 forward: he watched, he is misread, he is
  owed nothing; the Count is house machinery that moves around him and
  nothing in the room performs for him. Social cost is shown as floor
  space and silence, never narrated as grievance.
covers: the whole R5 ladder row — the packet missing · Naoyuki names him
  first · the day-book + Rokusuke's load-tally hold the exculpatory
  number · Toku in night-clothes, "It went up at the new moon." ·
  nobody asks what it is for · NO apology — plus the morning after
  (the day-wage in mon, stated as arithmetic, not amends).
native:
  - speaker registries: `toku` and `naoyuki` need NAMES/voices entries
    before this compiles (suggest NAMES.dowager = 'Toku'; NAMES.heir =
    'Naoyuki' already exists but a full NpcId is needed for the
    `memory:` effects below). The old-canon NpcId roster has neither.
  - night interrupt: the Count fires as an authored beat at nightfall of
    the rung's earning day — the engine must pull the MC out of
    sleep/rest into a VN scene (a scheduled beat, like the night
    rounds' rails; no day/night map state exists).
  - post-decide continuation: this scene continues past the decide (the
    tally, Toku, the close, the morning). If the grammar's decide must
    end a scene, split at the marked seam into a chained second beat.
  - motivates id: `wage-mon` is a placeholder for the R5 mon-wage
    unlock; the build names the real id.
-->

## rung R5 · rung-r5-count
speaker: genemon
voice: steward
motivates: wage-mon

> A hand shakes you awake in the dark of the woodshed. Rokusuke, with a
> lantern, looking mostly at the door.

Rokusuke: "Board room. The whole house is called. You as well. I only
fetch."

> Lamps at the board at the wrong hour. The household stands in two
> rows — the hands by the door, the house by the book — and between
> the rows there is more floor than the room usually has. You are shown
> to the middle of it. Nobody arranged that. It arranged itself.

Genemon: "The alcove chest stands open. One item short against the
book. A packet — cloth, bound with cord, a hand's length — entered as
lamp-oil for the shrine. Counted at the evening rice. Gone since. The
house will be counted before it sleeps."

> Naoyuki stands at his father's place at the board. He does not look
> at you until he does.

Naoyuki: "If the house must do this, then it does it properly — in
order of service, eldest hands first, so that no one can say—"

Naoyuki: "No. The weir man. Him first."

> Nobody objects. Some of the hands look at you; more look at the
> floor. It is not malice. It is the order the room was already
> thinking in.

### ask r5-accused · "Am I accused?"

> The question costs you something to ask. Genemon does not notice the
> price.

Genemon: "You are counted. The whole house is counted. Accusation is
for after the book speaks."

### ask r5-why-first · "Why me first?"

Naoyuki: "Because the book carries ten years on every other man here,
and on you it carries—"

Naoyuki: "Because nobody in this house knows what you are."

### decide · The room waits on you.

#### r5-stand · "Say nothing. Stand for the count."

Naoyuki: "Asked before the whole house, and he offers— note it down,
steward. He offers nothing. Note that."

memory: naoyuki -1 (unreadable)
flags: r5-stood

#### r5-account · "Give your day, hour by hour."

Genemon: "Say it slower. I am writing."

memory: genemon +0 (exact)
flags: r5-accounted

#### r5-search · "Offer your corner to be searched."

Genemon: "It was searched while Rokusuke fetched you. A mat, a bowl, a
whetstone, a mended cord. Nothing of the house's past its keep."

memory: genemon +0 (open-handed)
flags: r5-offered-search

<!-- native seam: the scene continues after the decide -->

Genemon: "The kura tally. Who kept it today?"

> Rokusuke has been standing where the lantern light mostly isn't. He
> comes forward the way a man wades cold water.

Rokusuke: "Eleven loads in by dark, steward. His mark against each.
Last mark at lamp-lighting, and the rice was long cleared by then. He
never left the kura side of the yard. That's what the board says. The
board's there to look at."

> Genemon sets the tally board beside the day-book and reads one
> against the other. The room watches him do arithmetic. It takes as
> long as it takes.

Genemon: "The packet was counted at the evening rice, in the inner
house. From mid-day to lamp-lighting this man was under grain. The
book holds no gap with him in it."

Naoyuki: "Then the book is—"

Naoyuki: "Then it is someone of the house."

> The door to the inner corridor slides. Toku stands in it, in her
> night-clothes, her hair down — a woman nobody sent for. She looks at
> no one in particular, and at the book last.

Toku: "It went up at the new moon."

> Nobody asks what went up. Nobody asks where. Genemon dips his brush,
> enters one line, and closes the day-book.

> Twice, on the new-moon rounds, you have seen a hooded lantern cross
> the far edge of the yard, going upstream. You say nothing now. Nobody
> asks you either.

Genemon: "The count is answered. The house is not short. Take the
lamps."

> The rows break up around you. Naoyuki passes you last.

Naoyuki: "For the house's part, it was—"

Naoyuki: "You were counted. That is all it was."

> At the morning board nobody speaks of the night. The hands keep a
> little more room around you than the work needs — for a day, then
> two — and then it is spent, needing nothing from you to end.

Genemon: "From today the book carries you at a day-wage, in mon, paid
against each day worked. It was due at the season's turn. It is the
season's turn."

> At the paddy Rokusuke works the row over from yours, as he did
> before, no nearer. You thank him for the tally.

Rokusuke: "Kept it same as any day. It would have read the same if it
hanged you."

> He bends back to the row.

> That evening the wage enters the day-book: so many mon, and against
> the entry, where a name would go, a mark. It is still not a name.

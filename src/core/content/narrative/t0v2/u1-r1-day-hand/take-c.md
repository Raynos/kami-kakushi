<!--
unit: u1-r1-day-hand
take: c
stance: the weather — kernel #7 forward: the MC watched, misread, unowed;
  the world's indifference and the social cost carry the scene; nothing
  performs for him.
covers: two hands quit for the lowlands (heard late, already counted);
  Genemon states the terms at the board, WITNESSED; debt named sideways
  ("the house's coin is spoken for"); the day-book entry; Naoyuki's first
  abandoned sentence from the veranda.
migration notes: Naoyuki uses the ambient form `Naoyuki (lord):` — mint a
  `naoyuki` NpcId + NPC_NAME entry at migration. Decide option ids/flags
  are NEW (pre-rewrite wave; reader-review only, per the scout §3.3).
  Motivates ids kept byte-identical to canon for wireability.
-->

## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-gate-forecourt, room-home-paddies, verb-farm, verb-haul,
  readout-clock, readout-stamina, panel-rung-ladder

> Morning at the board. The hands take their rice at the threshold; the
> steward's papers hold the table's far end — an estate's worth of paper
> on a kitchen table. Genemon calls you up from the step without looking
> up.

Genemon: "Two hands took the lowland road this week. Wages drawn through the day they left, lines struck. The yard is short. The work is not."

> It is the first you have heard of any leaving.

Genemon: "Terms. Work, sun to sun, at what the yard wants doing — hired by the day, counted in the book. Meals at the threshold, morning and evening. The woodshed corner and a mat. No coin: the house's coin is spoken for before it reaches the yard. Objections are heard now or kept. The paddies want you by full light."

> Nobody stops eating. Two hands lost was a morning's talk; one stray
> kept is not even that. The bowls go on.

Genemon: "The board has heard it. That serves for witness."

> He opens the day-book to a page already half-filled with other men.

> On the veranda above the step, Naoyuki has stopped — the second son,
> papers of his own under one arm. Passing, and made a witness like the
> rest of the room.

Naoyuki: "The house is glad of —"

> The sentence stops. He stands with it a moment, as if he has read it
> back and found it not worth the ink.

Naoyuki: "Two hands left. You were here. That is all it is."

> He goes on along the veranda. He looked at you once, and the once was
> thorough.

### ask r1-the-two · "The two that left?"

Genemon: "Left owed nothing, owing nothing. Struck clean. The lowlands pay coin in winter; I could not argue the sum, so I did not argue it."

### ask r1-why-keep · "Why keep me?"

Genemon: "The paddies take six hands at the least. Five sleep here now. You are the sixth. If a better sixth comes by, the book will say so."

### ask r1-the-meals · "Just the meals?"

Genemon: "A fed hand does a day's work; a hungry one is half a hand at a whole board. The house is not feeding you out of kindness. It is feeding the work."

> Then he takes up the brush, and asks it plainly, at board volume. The
> room hears without listening.

Genemon: "One thing before the ink. If a claim follows you here, I enter it against your board. Is anything owing on you?"

### decide · Is anything owing on you?

#### r1-none-claimed · "Not that I know."

Genemon: "Then the book says none claimed. It has lived with worse."

flags: r1-none-claimed

#### r1-kept · "Say nothing."

Genemon: "Kept, then. The book carries what is claimed, and I keep my own margins."

memory: genemon +1 (kept-accounts)
flags: r1-kept-owing

#### r1-and-if · "And if there were?"

Genemon: "Then the house's claim comes first, while you eat its rice. After that — whoever can find you. So far nobody has asked."

flags: r1-asked-owing

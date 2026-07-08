<!--
unit: u4-r4-pupil
take: b
stance: the held breath — the house's grief close under the surface; warmth
  priced and rationed; human detail forward; what people almost say
covers: t0.md ladder R4 whole — the board confession · the beg · the creed
  (on-screen, once) · the drill yard opened as Kihei's need

Authored answers (compiler-ignored; every withheld line has its answer here):
- THE GRANARY LOSS: R3 canon holds — the wolf never got the rice. The loss is
  the three unwatched nights AFTER: he lay in the sickroom, the watch stood
  empty, rats took a quarter-sack and opened two more at the seam. He counts
  it his because the watch was his. Nobody in the house counts it that way;
  that is the point.
- THE OILED STAFF: Kihei has kept a second staff oiled for years, for the
  student who never came — his want (04-cast: one student who outlives him).
  He will never say so. The WHAT is on screen; the WHY waits for the game to
  earn it.
- THE FOOTWORK LINES: drawn in the raked dirt this morning, before the MC
  asked. Kihei heard how the man took the wolf-night and prepared the yard on
  the chance. His need, dramatized; never spoken.
- THE DECIDE (rule 7): no dutiful→selfish axis. Three readings of one act;
  the cross-quarter option moves the STEWARD's regard, not the drillmaster's;
  the most personal answer moves no ledger at all — hearts are not owed
  (kernel #7).
-->

## rung R4 · rung-r4
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard
native: MC speech lines under the pre-R7 speaker label (`Nameless:`) — the
  speaker-label ladder (04-cast.md). The grammar's NPC map has no MC entry;
  the engine must resolve these lines to the current MC label.

> Sōan strapped the ribs so you could walk, not so you could work. It is
> thirty paces from the sickroom door to the board. You count them.

> Genemon is there, the day-book open, the morning's entries not yet dry. He
> looks up, and waits, and does not help you begin.

Nameless: "Rats were in the store. Three nights, while I lay. A quarter-sack
gone. Two more opened at the seam."

Nameless: "The watch was mine."

> Genemon writes before he answers. It is what he does with surprise, though
> nothing in his face has admitted to any.

Genemon: "Rice, one quarter-sack, to vermin. Two sacks to resew — O-Hisa has
thread. Entered under the store."

Genemon: "Not under your name. No wage ran for the nights you lay. The
account is even."

Nameless: "It isn't."

> The pen stops above the line a moment longer than the line needs. Then it
> moves on, and he says nothing, and writes nothing further.

> At the kitchen threshold O-Hisa has stopped with a bowl in her hands, as if
> there were something to say to somebody. She sets it down where you will
> pass, and goes in.

> From the board, the woodshed is one way and the old stable court is the
> other. Your ribs are for the woodshed. You go the other way.

> Stalls for twenty horses run down the long side of the court, and the house
> owns one mule. Kihei is at the rack, running a whetstone down a spear-head
> that has no war to go to. Two practice staves lean beside him. One is worn
> grey at the grip. The other is oiled, and looks as if it has never been
> anything else.

Nameless: "Teach me."

> That was the easy half. The question costs more than the walk did.

Nameless: "Will you?"

> Kihei sets down the whetstone. He looks at the strapping, at the way you
> keep your left side back, at the scars that were old before the river. He
> has looked at them before. He has never once asked.

Kihei: "...You walked here on cracked ribs to ask for more of what cracked
them."

> It is not a question, so you do not answer it.

Kihei: "Terms, then. Once. Talent is a story the lucky tell. You are not
lucky. So you will work."

> He takes the oiled staff from the rack and holds it out. He does not say
> how long it has stood there, and you do not ask.

Kihei: "The house has one man who can stand a watch, and he is grey. That is
the whole of why this yard is open to you. Dawn, before the others. Every day
the ribs allow, and some they don't."

### ask r4-what-first · "What will you teach me?"

Kihei: "Feet first. Then the staff. The spear when the staff says so. Not the
sword — the sword is not yours to carry, and that is the law's affair, not a
judgment."

### ask r4-whose-staff · "Whose staff is this?"

Kihei: "One that was kept oiled. Oil is cheap. Ask again when you can hold it
right."

### ask r4-wolf · "Will the wolf come back?"

Kihei: "It went off bleeding into a lean winter. It comes back, or it dies
out there. Train for the one that comes back."

> Lines are already scratched in the court's raked dirt — footwork lines,
> drawn fresh this morning, before you asked.

> On the wall above the empty stalls a boy sits very still, the way boys sit
> when they believe stillness is the same as not being there.

Kihei: "One thing before the staff. Why."

### decide · Why do you ask for this?

#### r4-it-returns · "It will come back."

Kihei: "It will. Or its like. Dawn, then."

memory: kihei +1 (watchful)
flags: r4-it-returns

#### r4-the-rice · "I lost the house rice."

Kihei: "The rice is the steward's grief; mine is the sill it crossed. But
carry it, if it carries you to this yard at dawn."

memory: genemon +1 (owned-the-loss)
flags: r4-the-rice

#### r4-not-carried · "I was carried once. Not again."

Kihei: "Then don't be. Dawn."

flags: r4-not-carried

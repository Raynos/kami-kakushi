---
unit: u0-cold-open
take: a
stance: >
  the ledger — maximal restraint; the day-book's temperature; scenes end a
  beat earlier than comfort asks; texture over sentiment; silence
  load-bearing
covers: >
  R0 whole — the weir rescue · Sōan's examination · the forced name beat
  (speaker flip You: → Nameless:, witnessed) · first verbs (rake, haul
  water) · the day-book line "one man, name unknown"
---

<!-- native (what the engine must provide):
  1. Sequence: play cold-open.weir, then cold-open.wake, then `## scene soan`.
  2. The MC speaker label: `You:` renders the MC's spoken lines until the
     flip point marked inside scene soan; from that line on the label is
     `Nameless:` — on screen, persistent, save-carried (the speaker-label
     ladder, 04-cast). Ask/decide labels spoken after the flip render under
     `Nameless:`.
  3. The day-book surface appends cold-open.day-book as its first entry at
     the moment Genemon writes it in-scene, and cold-open.day-book-verbs
     once both first verbs (rake, haul water) have each run once. The
     in-scene `Genemon: @cold-open.day-book` line is a DELIBERATE echo:
     the spoken entry IS the written entry, single-sourced by @-reuse.
  4. motivates ids are placeholders — bind to the v2 unlock registry at the
     game plan (the rake action, the haul-water action, the forecourt node).
-->

## prose cold-open

### weir

The river gives you up at the weir. You keep none of it in order: hands in
your collar, gravel under your back, the sky white and near, water leaving
you in coughs. A stone jizō watches from the bank, rice at its feet, nobody
on the road who could have left it. Someone says, carry him up, then. Then
nothing.

### wake

Straw. A low roof. A fire kept small. Something surfaces — a knot, a road
in grey rain — and goes down again before you can put a hand to it. You
have been three days in a room you have never seen.

### day-book

One man, name unknown. Taken at the weir. Fed, four days. Condition, poor;
hands, good.

### day-book-verbs

Rakes; hauls. Wage: meals.

### rake

The court is long and the rake is short. You work it in rows, corner to
gate, until the gravel shows its lines again. Nobody watches. The rows
stay.

### haul

Two buckets on a yoke, well to kitchen, forty paces each way. By the
fourth trip the jars stop ringing hollow. The kitchen does not thank the
water. It uses it.

## scene soan
speaker: soan
voice: physician
motivates: action-rake, action-haul-water, node-forecourt
native: mid-scene speaker-label flip (marked below); You:/Nameless: lines
  are MC speech and must render under the active label

> The physician does not ask how you feel. He takes your wrist, then your
> jaw, then turns your hands over and looks at them longer than at
> anything else. He presses a thumb into the callus line across one palm
> and says nothing. There is a ledger open on his knee.

Sōan: "Do you know the year?"

You: "No."

Sōan: "An'ei nine. Now you know it again. Drink this."

> Whatever the hands told him goes into the ledger, two lines, too far off
> to read. The door slides, and he closes the book on his thumb.

> The man in the doorway is grey and dry and carries a book of his own.
> Two books in the room now, and only one of them open.

Genemon: "The weir man. Sōan — can he work?"

Sōan: "Ask him."

Genemon: "Name, age, where from. In that order."

> Three answers, and you do not have one of them. The silence goes on long
> enough that the physician looks up.

You: "What name did I give? When they pulled me out."

Sōan: "None. You gave none. Three days I have had nothing to call you,
and neither have you."

> Nothing comes.

<!-- native: THE FLIP — the speaker label changes here, You: → Nameless:,
  witnessed: it happens on screen with both men in the room. Every MC line
  from this point renders as Nameless:. -->

> Genemon does not look surprised. He looks down and writes, and reads it
> back as he writes, aloud and once.

Genemon: @cold-open.day-book

Genemon: "When he can stand, he rakes. The kitchen wants water before it
wants anything."

> He goes. Sōan opens his ledger again, where his thumb kept the place.

### ask r0-where · "Where is this?"

Sōan: "The Kurosawa house — the estate, or what answers to the word. This
is my sickroom, off the outer court, and you will be out of it by
tomorrow. I need the mat."

### ask r0-kami · "Someone on the bank said a god hid me."

Sōan: "Kamikakushi. The valley says it of every man the river takes and
every child who runs off. Let them say it; it comforts them and costs you
nothing. What took you was water."

### ask r0-how-long · "How long was I in the river?"

Sōan: "That I can't write down. Three days here, fevered. Before that,
ask the river."

### decide · No name, then. What do you keep instead?

#### r0-knot · "My hands know a knot. I'll keep that."

> You tie it in the cord of your own bedding: a carrier's hitch, fast and
> one-handed, twice. Sōan watches it both times. He does not write it down
> while you are looking.

Sōan: "Keep it, then."

stat: +agi -int
perk: The Carrier's Hitch — a knot the hands kept when the head kept
  nothing.
memory: soan +1 (noted)
flags: r0-knot

#### r0-work · "The work. Point me at it."

Sōan: "Can you stand? Then the rake is by the door, and the well is past
the kitchen. Water first — the kitchen never has enough. Come back when
something bleeds."

stat: +str -luck
perk: The Well Yoke — shoulders that answer before they are asked.
memory: soan +0 (plain)
flags: r0-work

#### r0-count · "The days. I'll count from this one."

Sōan: "Day four, by mine. Yours can start where you like. Mark the post —
notches hold."

stat: +int -agi
perk: The Notched Post — a day cut where fever cannot blur it.
memory: soan +0 (methodical)
flags: r0-count

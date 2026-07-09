<!-- The rung-up story beats (ADR-110), R1→R7 — the AUTHORING SOURCE OF TRUTH (FB-5).
  Compiled to src/core/content/rungBeats.gen.ts by `pnpm run gen:narrative`.
  Format spec: ./README.md. R0 has no beat — the intro IS the R0 beat.

  storywave G4.1 — migrated from the t0v2 VERDICT picks (u1-c, u2-c, u3-b, u4-b,
  u6-c, u7-b) + each unit's redlines. MC speech (the pre-R7 `Nameless:` label /
  the `You:` label) has no FB-5 speaker form, so those lines render as narrator
  `>` quotes (the label flip stays a `native:` engine concern, 04-cast ladder).

  Each rung keeps its CURRENT `motivates:` list (verbatim-equal to
  RANKS.<rung>.rewardOnReach.unlock, unchanged this chunk — the validator hard-
  checks that equality). The picks' own aspirational motivates ids bind when
  RANKS/SURFACES are re-derived in a later G4 chunk; several rung beats now
  narrate a granter/theme (e.g. R4 = Kihei's drill-yard) that does not yet match
  its RANKS unlock list (repair/omoya) — a KNOWN later-chunk reconciliation.

  R5 is intentionally ABSENT: the R5 promotion is the ensemble "Count" night,
  which plays as the `scripted` scene-defs `count` / `count-resolve` in
  scenes.md (map: "u5-c — plays via a scripted scene"). Duplicating its
  r5-stand/account/search option ids here would RED the global-unique check. -->

## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-gate, room-paddies, room-woodshed, verb-farm, verb-haul,
  readout-clock, readout-stamina, panel-rung-ladder

> Morning at the board. The hands take their rice at the threshold; the
> steward's papers hold the table's far end — an estate's worth of paper on a
> kitchen table. Genemon calls you up from the step without looking up.

Genemon: "Two hands took the lowland road this week. Wages drawn through the day
they left, lines struck. The yard is short. The work is not."

> It is the first you have heard of any leaving.

Genemon: "Terms. Work, sun to sun, at what the yard wants doing — hired by the
day, counted in the book. Meals at the threshold, morning and evening. The
woodshed corner and a mat. No coin: the house's coin is spoken for before it
reaches the yard. Objections are heard now or kept. The paddies want you by full
light."

> Nobody stops eating. Two hands lost was a morning's talk; one stray kept is
> not even that. The bowls go on.

Genemon: "The board has heard it. That serves for witness."

> He opens the day-book to a page already half-filled with other men.

> On the veranda above the step, Naoyuki has stopped — the second son, papers of
> his own under one arm. Passing, and made a witness like the rest of the room.

Naoyuki: "The house is glad of —"

> The sentence stops. He stands with it a moment, as if he has read it back and
> found it not worth the ink.

Naoyuki: "Two hands left. You were here. That is all it is."

> He goes on along the veranda. He looked at you once.

> Then Genemon takes up the brush, and asks it plainly, at board volume. The
> room hears without listening.

Genemon: "One thing before the ink. If a claim follows you here, I enter it
against your board. Is anything owing on you?"

### ask r1-the-two · "The two that left?"

Genemon: "Left owed nothing, owing nothing. Struck clean. The lowlands pay coin
in winter; I could not argue the sum, so I did not argue it."

### ask r1-why-keep · "Why keep me?"

Genemon: "The paddies take six hands at the least. Five sleep here now. You are
the sixth. If a better sixth comes by, the book will say so."

### ask r1-the-meals · "Just the meals?"

Genemon: "Six hands' work, five men fed. The sixth eats. That is the whole of it."

### decide · Is anything owing on you?

#### r1-none-claimed · "Not that I know."

Genemon: "Then the book says none claimed. It has lived with worse."

flags: r1-none-claimed

#### r1-kept · "Say nothing."

Genemon: "Kept, then. The book carries what is claimed, and I keep my own
margins."

memory: genemon +1 (kept-accounts)
flags: r1-kept-owing

#### r1-and-if · "And if there were?"

Genemon: "Then the house's claim comes first, while you eat its rice. After that
— whoever can find you. So far nobody has asked."

flags: r1-asked-owing

<!-- R2 is the SILENT RUNG (ADR-165): a speakerless narration-only beat with no
  decision — which a `## rung` block cannot express (the compiler requires a
  decide). It lives in scenes.md as the `r2-yard-hand` scene-def, `trigger: rung
  R2` — the README's own home for the speakerless form. -->

## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level, panel-bestiary,
  panel-house-influence, room-kura, room-weir-reeds

> Dawn comes grey through the kura door. The blood on the sill has dried black,
> and most of it is yours. Inside, the rice sits in its rows, untouched, exactly
> as it was put. Sōan has strapped your ribs so tight that breathing is a
> decision.

> Kihei crouches at the sill a long time, reading the blood the way Genemon
> reads a column of figures. The trail goes west, into the trees, in drops that
> get no smaller.

Kihei: "…Alive. Good."

> For a moment there is more in him than the verdict. He checks the broken bar
> instead.

> Genemon stands in the doorway. Whatever he came to say, he writes something in
> the day-book first.

Genemon: "Screen, one, torn. Bar, one, broken. Grain — none lost. Hand, one.
Standing."

> None lost. You think of the gnawed seed-bale at the back wall, and the count
> you made twice by lantern, and you do not correct him. Not yet.

Genemon: "The bar was old. It goes against the house, not your wage."

> Kihei stands, takes the boar-spear off the sill, and puts it back in your
> hands, butt first.

Kihei: "You didn't win. The house lost nothing. Keep the watch."

> By evening the padded coat is folded at the woodshed step, the torn shoulder
> closed with stitches smaller than the tear deserved. O-Hisa is still three
> steps from the kitchen when you come round the corner, caught.

O-Hisa: "It tore clean, at least. If the ribs knit as straight — well."

> She is back inside before you find anything to say to that.

### ask r3-wolf · "Will it come back?"

Kihei: "It left more blood past the woodlot than a wolf keeps spare. If the
winter doesn't finish it, it remembers this door. So do you. That makes you
even."

### ask r3-ribs · "How long?"

Sōan: "Breathe to the bottom of it. Cracked, not broken. Three weeks
strapped, nothing heavier than the lantern, and you come to me before you decide
you are healed."

> He writes a line in his ledger and closes it when you turn your head.

### ask r3-rice · "The rice?"

Kihei: "Where it was put. Last night's, at least. The rest is the board's
arithmetic, not mine."

### decide · What do you do about the wolf?

#### r3-track · "It bled going west. The trail is fresh."

Sōan: "And you can chase it exactly as far as I can throw you. Sit down. It is
winter's business now, not yours."

memory: kihei +1 (spine)
flags: r3-track

#### r3-hold · "It knows this door now. So do I. I'll be at the sill."

Kihei: "Then mend the bar before dark, and take the long spear this time. Eat
first."

memory: kihei +1 (steady)
flags: r3-hold

#### r3-mend · "The bar first. Then the wolf."

Genemon: "The bar, the screen, then the tally. I will enter the wood against the
house."

memory: genemon +1 (careful)
flags: r3-mend

## rung R4 · rung-r4
speaker: kihei
voice: arms
motivates: readout-durability, panel-equipment, verb-repair, house-omoya, room-drill-yard

> Sōan strapped the ribs for walking. Not for work. It is thirty paces from
> the sickroom door to the board. You count them.

> Past the kitchen passage a screen stands open on a corridor you have never
> been sent down. An altar set into the passage wall; rites laid out for
> somebody; a pair of straw sandals, new this year, facing away from the
> house. You look a breath too long. The screen slides shut from inside.
> Nobody says anything to you about it, then or after.

> Genemon is there, the day-book open, the morning's entries not yet dry. He
> looks up, and waits, and does not help you begin.

> "Rats were in the store. Three nights, while I lay. A quarter-sack gone. Two
> more opened at the seam."

> "The watch was mine."

> Genemon writes before he answers. It is what he does with surprise, though
> nothing in his face has admitted to any.

Genemon: "Rice, one quarter-sack, to vermin. Two sacks to resew — O-Hisa has
thread. Entered under the store."

Genemon: "Not under your name. No wage ran for the nights you lay. No watch
stood — the gate cannot leave the gate. The account is even."

> "It isn't."

> The pen stops above the line a moment longer than the line needs. Then it
> moves on, and he says nothing, and writes nothing further.

> At the kitchen threshold O-Hisa has stopped with a bowl in her hands, as if
> there were something to say to somebody. She sets it down where you will pass,
> and goes in.

> From the board, the woodshed is one way and the old stable court is the other.
> Your ribs are for the woodshed. You go the other way.

> Stalls for twenty horses run down the long side of the court, and the house
> owns one mule. Kihei is at the rack, running a whetstone down a spear-head
> that has no war to go to. Two practice staves lean beside him. One is worn
> grey at the grip. The other is oiled, and looks as if it has never been
> anything else.

> "Teach me."

> That was the easy half. The question costs more than the walk did.

> "Will you?"

> Kihei sets down the whetstone. He looks at the strapping, at the way you keep
> your left side back, at the scars that were old before the river. He has
> looked at them before. He has never once asked.

Kihei: "...You walked here on cracked ribs to ask for more of what cracked
them."

> It is not a question, so you do not answer it.

Kihei: "Terms, then. Once. Talent is a story the lucky tell. You are not lucky.
So you will work."

> He takes the oiled staff from the rack and holds it out. He does not say how
> long it has stood there, and you do not ask.

Kihei: "The house has one man who can stand a watch, and he is grey. Dawn,
before the others. Every day the ribs allow, and some they don't."

> On the wall above the empty stalls a boy sits very still, the way boys sit
> when they believe stillness is the same as not being there.

Kihei: "One thing before the staff. Why."

### ask r4-what-first · "What will you teach me?"

Kihei: "Feet first. Then the staff. The spear when the staff says so. Not the
sword — the sword is not yours to carry, and that is the law's affair, not a
judgment."

### ask r4-whose-staff · "Whose staff is this?"

Kihei: "One that was kept oiled. Oil is cheap. Ask again when you can hold it
right."

### ask r4-wolf · "Will the wolf come back?"

Kihei: "It went off bleeding into a lean winter. It comes back, or it dies out
there. Train for the one that comes back."

### decide · Why do you ask for this?

#### r4-it-returns · "It will come back."

Kihei: "It will. Or its like. Dawn, then."

memory: kihei +1 (watchful)
flags: r4-it-returns

#### r4-the-rice · "I lost the house rice."

Kihei: "The rice is Genemon's grief. Mine is the sill. Then carry it to this
yard at dawn."

memory: genemon +1 (owned-the-loss)
flags: r4-the-rice

#### r4-not-carried · "I was carried once. Not again."

Kihei: "Then don't be. Dawn."

flags: r4-not-carried

## rung R6 · rung-r6
speaker: genemon
voice: steward
motivates: house-workshops, house-granary

<!-- u6-c, redlined: "Everything walks downhill but the rain." cut from
  r6-ford-news; the `You:` count reshaped to a narrator quote. The count-back
  epilogue (`## scene r6-count-back`, native when:-gated post-decide prose) and
  its @-reuse of the R0 "one man, name unknown" echo have no rung-beat form —
  DEFERRED to a later chunk (a scene-def / native sidecar), noted HD-30. -->

> Morning, the forecourt. Genemon's window stands open, the day-book out, and
> beside it a purse the size of a fist, dark with handling.

Genemon: "Salt, one shō. Waxed thread, two hanks. Lamp oil, one masu. Yohei sets
his boards up at the gate by mid-morning."

Genemon: "Two hands short since spring, and I cannot leave the book on a market
morning. So."

> He counts the coins into your palm one at a time, watching each one land.

Genemon: "Forty mon. Count them back."

> "Forty."

> He watches the whole count. When it comes out even he does not nod. He enters
> something in the day-book, unasked.

Genemon: "His prices are his own. The house's figures are mine. Go."

> Market morning at the gate. Yohei's boards are up and the gateyard has people
> in it for once — baskets, a mule, talk. The woman ahead of you pulls her
> basket an inch closer when you stop beside her. The talk is rain over the pass
> and the price of salt, and it thins a little when you step to the boards, and
> it is not about you either.

Yohei: "The house's hand, and carrying the house's purse — there's news by
itself. Rain over the pass, the dye-man's held at the ford a week, so waxed
thread is scarce, so the thread is eleven. Salt fifteen, the oil fourteen — fair
as water, those two. Eleven for the thread, then?"

### ask r6-stray-price · "You priced me high, my first market."

Yohei: "I did. First market, you were the road's — a road man pays the road's
price, carries it off, and is gone. A house man comes back twelve markets a
year. I price the coming back."

### ask r6-ford-news · "What holds the dye-man?"

Yohei: "The ford, swollen, and no hurry in him — lowland wages are fat this year
and half the carriers went down for them. Your house lost two hands to the same
road, I hear."

### decide · The thread is eleven. The steward reckoned nine.

#### r6-count-flat · "Nine. Count it with me."

Yohei: "Ha — the steward's figure, out of the steward's own mouth. Nine, nine,
take it. Twelve markets a year, I'd rather be the stall you count at than the
one you walk past."

memory: yohei +1 (square)
flags: r6-flat

#### r6-pay-over · "Eleven, then."

Yohei: "Done, and kindly done. Salt, oil, thread — mind the oil, it sweats in
the sun. My regards to the kitchen."

memory: yohei +0 (a mark still)
flags: r6-over

#### r6-put-back · "Then the house does without thread."

Yohei: "As you like. Thread keeps, and so do I. Salt and oil, twenty-nine — and
tell the steward it's the dye-man sets that price, not me."

memory: yohei +0 (hard)
flags: r6-back

## rung R7 · rung-r7
speaker: genemon
voice: steward
motivates: house-study, room-grove

<!-- u7-b, redlined: the spoken Item/Count/Condition labels recast into plain
  Genemon speech (r7-what-changes). Two grafts from u7 take-c/take-a could NOT
  be applied — their source prose was not transcribed this pass: take-c's "An
  entry can be amended" line, and take-a's morning-after log line (HD-30 /
  un-applied redlines). THE FIRST DREAM (`scene r7-dream`) is NOT a rung block
  (a `## scene` here would break the intro scene-order check) — it migrates to
  scenes.md as the `r7-dream` scene-def, where the "fine as sieved ash" simile
  is cut. The name-flip Nameless:→Gonbei: on the decide labels stays native. -->

> The board, past supper, past the year's tax. The household's noises are done
> for the day. Genemon has the day-book open under the lamp and a fresh page
> ruled, and he does not look up until the last column of the old one is footed.

Genemon: "Stand where I can see you. This is quick."

Genemon: "A full year and more, this book has said 'one man, name unknown.'
Every entry, the same six strokes spent on a man the whole yard knows on sight.
Paper is not free. Neither is my evening."

> He turns back through the pages — a winter, a wolf, a harvest — to the first
> entry, and reads it aloud, once. One man, name unknown. Then he dips the
> brush, and holds it over the page a breath longer than any entry needs.

Genemon: "Gonbei. Every hired man this house has kept has carried it before you.
The house's name for you, then. Earn a better."

> He writes it small and square — the hand of a man who has written all his life
> and never once for pleasure — and the thing is done. One man, Gonbei, sound.

### ask r7-what-changes · "What changes?"

Genemon: "Your name, on the page. A day-wage, as before, and the house's purse
when it's sent out with you. And watched — as every name on this book is
watched."

Genemon: "And one thing more. From this season's close I rule a second
reckoning — not the hands. The house. Stores past the winter's need, walls that
held, ground taken back. One line, each season, in this book's plain words. I
have written this house's losses for thirty-one years. I mean to write something
else before I am done."

### ask r7-before · "Who carried it before me?"

> The question costs him something to ask, and Genemon looks up as if a chair
> had spoken. Then he turns the book back further than he turned it for the ink,
> to a page the lamp barely reaches.

Genemon: "Four, in my years. Two served their seasons out and went to the
lowlands. One died of a winter chest, in the house's service; his dates are
here. The fourth was let go. There was a year this house could keep no one it
did not have to keep. That is the whole of it."

> The same name, four times over, each line ruled through — dated, footed,
> closed. He answers the rest of the question by writing the date on the fifth,
> and the fifth stands open.

### decide · The ink is drying. How do you take the name?

#### r7-plain · "It will do."

Genemon: "So it will. Take what is left in the pot as you pass the kitchen. It
is paid for."

memory: genemon +1 (plain)
flags: r7-plain

#### r7-earn · "Then I'll earn the better one."

Genemon: "Better is earned at the season's close, like everything on this book.
I will hold you to the word."

memory: genemon +1 (ambitious)
flags: r7-earn

#### r7-mine · "Until mine comes back, it can serve."

Genemon: "As you say. An entry can be amended."

memory: genemon +1 (guarded)
flags: r7-mine

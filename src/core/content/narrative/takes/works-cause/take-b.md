<!-- TAKE B · "the household knows" — the yard has worked AROUND the damage
  for years; the day-book only ratifies what everyone knows and nobody says.
  Genemon names the concerns grudgingly, pressed by the household's sidelong
  signals; each priced work makes the stray more theirs. -->

## scene-def works-intro
trigger: scripted
once: true
speaker: genemon
voice: steward

<!--#morning-at-the-board-after-rain-->
> Morning at the board, after rain. O-Hisa crosses the gateyard the long way,
> around a hollow that holds water — the same long way she took yesterday, and
> dry days too, the detour worn smoother than the reason for it. Rokusuke is
> in early, mud to the knee, saying nothing about where the mud came from.
> Nobody says anything. The house has its ways around its own sore places,
> and the ways stopped being noticed years ago.

<!--#genemon-has-the-day-book-open-and-->
> Genemon has the day-book open, and for once he is not writing. He is
> reading back — pages of it, a season at a time — with the face of a man
> counting a debt he has been letting stand.

<!--#the-gate-board-is-wedged-it-has-->
Genemon: "The gate-board is wedged. It has been wedged four winters. The
wedge is in this book as kindling, which it is not."

<!--#the-east-bund-weeps-rokusuke-stakes-->
Genemon: "The east bund weeps. Rokusuke stakes it after every rain — his own
straw, his own hour, no entry. The woodshed roof: the wood in there is
stacked to miss a drip. Whoever stacks it knows where the drip falls. The
book does not."

<!--#he-turns-a-page-as-if-->
> He turns a page as if the page had argued with him.

<!--#and-the-weir-the-screens-the-->
Genemon: "And the weir. The screens the house leases from Matsuzō — rats in
them, coin owed across the water every season the gnawing runs ahead of the
mending. The lease line has carried the damage so long that the carrying has
started to look like the lease."

<!--#named-then-since-the-yard-has-->
Genemon: "Named, then — since the yard has plainly known it all along. The
gate. The bund. The roof. The lease. Go and look at each with your own eyes;
the book takes no man's word for damage, mine included. Then we will talk of
work, and what work costs."

### ask works-intro-ask-a · "Why name it now?"

<!--#because-the-yard-has-been-naming-->
Genemon: "Because the yard has been naming it for years — in wedges, in
straw, in the long way round a puddle. A book that will not carry what the
whole yard carries is not a record; it is a lie of omission. I keep worse
things than losses out of this book. I will not keep that."

### ask works-intro-ask-b · "Whose coin mends it?"

<!--#not-the-house-s-the-house-->
Genemon: "Not the house's. The house's coin is spoken for before it reaches
the yard — you were told so your first morning, and it has not changed. A man
who puts his own coin and his own hours into a house is entered as having
done so, and the book remembers longer than men do. What that is worth, ask
me at a season's close."

### decide · The concerns are named. What do you do with them?

#### works-intro-go · "I'll walk them today, with my own eyes."

Genemon: "Then take them in the book's order: gate, bund, roof, and the weir
last — the water can be looked at while you are already wet from the bund.
Say what you see when you have seen it. Looking is entered as work."

memory: genemon +1 (walked-the-book)
flags: works-named-u1, works-named-weir

#### works-intro-hold · "The day's work first. I'll look as the round takes me."

Genemon: "As the round takes you, then. The round goes past all four. It
always has — that is rather the point."

flags: works-named-u1, works-named-weir

## scene-def works-u1
trigger: flag works-seen-u1
once: true
speaker: genemon
voice: steward

<!--#the-board-evening-word-that-you-->
> The board, evening. Word that you walked the named places has beaten you
> back to it — Shinnosuke watched you stare at the woodshed roof from the
> woodpile and told the kitchen, and the kitchen has told the pot: the bowl
> at the threshold is a little fuller tonight than the terms say. Genemon
> waits with the day-book open at a clean line.

<!--#you-have-seen-them-say-what-->
Genemon: "You have seen them. Say what you saw."

<!--#the-gate-board-is-soft-behind-the-->
You: "The gate-board is soft behind the wedge. The east bund is Rokusuke's
straw, not the house's earth. The roof shows daylight over my own mat."

<!--#so-the-book-has-it-from-->
Genemon: "So the book has it from a hand that looked, and not from four
winters of wedges. Board-wood, stone and straw, thatch. Small work, all of
it, and all of it one lot — the kind that is never worth a day until it has
cost a season."

<!--#the-house-s-coin-is-spoken-->
Genemon: "The house's coin is spoken for. If this is done, it is done on your
own coin and your own hours, entered against your name. The book remembers
what a man puts in. So, I find, does the yard."

### ask works-u1-ask-a · "Who set the wedge?"

<!--#the-hand-before-you-or-the-->
Genemon: "The hand before you, or the one before him. It passed to whoever
slept nearest — things do, here, when the book is silent. Nobody was ever
asked; nobody ever entered it. That is the habit I mean to end, starting
with the wedge."

### ask works-u1-ask-b · "Why one lot?"

<!--#because-the-yard-treats-them-as-->
Genemon: "Because the yard treats them as one: three places it steps around
in a single round. Mend one, and the round still bends. Mend all three, and
the yard walks straight — and knows exactly who straightened it. That last
part is not nothing, for a man in your position."

### decide · Three works, one lot. The book waits on your word.

#### works-u1-begin · "Set me to it."

Genemon: "Entered. Gate, bund, roof, against your name. Rokusuke will hear it
read at the morning board; expect his stakes and straw stacked at the bund by
evening, sorted, best to hand. That is how the yard says so."

memory: genemon +1 (set-to-it)
flags: works-open-u1

#### works-u1-hold · "When my purse can stand it."

Genemon: "Then it stands entered and unpaid, like much else in here. The
wedge has held four winters; it will hold while you count. Not forever."

flags: works-open-u1

## scene-def works-u2
trigger: flag works-seen-u2
once: true
speaker: genemon
voice: steward

<!--#the-board-again-on-it-beside-->
> The board again. On it, beside the day-book, sits a small dish of bought
> plums — O-Hisa's, set down this morning without one word said. Genemon has
> been looking at the dish longer than a dish wants looking at.

<!--#nine-years-the-kitchen-has-bought-->
Genemon: "Nine years the kitchen has bought what this house once grew. The
entry is one small line each market: plums, so many mon. Set the nine years
end to end and it is not a small line. The kitchen has known it. The stall
has known it. The dish is O-Hisa's way of asking when the book will."

<!--#you-have-seen-the-rows-sound-->
Genemon: "You have seen the rows. Sound trees under the choke, and dens dug
in the hollow. The cutting-back is long work; the dens are Kihei's kind of
work, and yours. The house calls the place the dogs' yard. I mean to strike
that name."

### ask works-u2-ask-a · "Whose orchard was it?"

<!--#the-house-s-planted-for-a-->
Genemon: "The house's. Planted for a larger house than this one — you have
seen how the rows are laid: for paths between, and room to walk them. Who
walked them is an old page. The trees are this year's business, and they are
alive, which is more than the old page can say."

### ask works-u2-ask-b · "And the dogs?"

<!--#kihei-s-word-on-them-is-->
Genemon: "Kihei's word on them is one word, and it has kept the yard whole
this long. The dens come first — there is no cutting bramble over a den. Go
to him before you go near the hollow, and go in his order. He will have one."

### decide · The dish is still on the board.

#### works-u2-begin · "The house grows its own plums again."

Genemon: "Entered: orchard, to be taken back. The kitchen will hold you to it
harder than this book will, and the book does not forget. Take the dish back
as you go — empty. O-Hisa will know what it means."

memory: genemon +1 (ground-taken-back)
flags: works-open-u2

#### works-u2-hold · "After the season's work. It has waited nine years."

Genemon: "So it has — and each year has cost more than the one before it.
Entered all the same. The dish stays on the board until the line closes;
that is O-Hisa's term, not mine, and I would not cross it either."

flags: works-open-u2

## scene-def works-u3
trigger: flag works-seen-u3
once: true
speaker: genemon
voice: steward

<!--#genemon-is-at-the-kura-when-->
> Genemon is at the kura when you come back to it, and for once he is not
> counting rice — he is counting wall. Rokusuke stands by with the look of a
> man whose private arrangement is about to be read aloud.

<!--#show-him-->
Genemon: "Show him."

<!--#bottom-bales-go-musty-against-the-->
Rokusuke: "Bottom bales go musty against the north wall, so they get turned.
Week about, all winter. The marks on the beam say whose week. It's not in
any book. It never seemed a thing for a book."

<!--#a-wall-s-worth-of-labour-->
Genemon: "A wall's worth of labour every winter, spent standing still. And
last autumn three bales sat a week in the forecourt under oilcloth, because
the floor was full. If the wild rows come back to bearing, the harvests
grow, and this kura will not grow with them. A second granary, raised at its
side. Board by board, on your coin, against your name."

### ask works-u3-ask-a · "Why was it never raised before?"

<!--#it-was-to-be-the-year-->
Genemon: "It was to be. The year it was to be raised was a year this house
could keep no one it did not have to keep, and after that year, nobody asked
again. Rokusuke's beam-marks have done the asking since — quietly, week
about, for longer than he will say. I have decided to hear them."

### ask works-u3-ask-b · "Where does it stand?"

<!--#against-the-kura-s-south-side-->
Genemon: "Against the kura's south side, on the dry ground the oilcloth
found last autumn. The forecourt taught the house where a granary should
stand. We build on the lesson; it was dearly enough bought."

### decide · Rokusuke is waiting on the answer too.

#### works-u3-begin · "Raise it. The turning ends this winter."

Genemon: "Entered: granary, second, at the kura. Stores past the winter's
need — the book has wanted to write that line a long time. Rokusuke keeps the
turning till your roof is on; he said so before you answered."

memory: genemon +1 (past-winters-need)
flags: works-open-u3

#### works-u3-hold · "Boards cost. Let me count my purse first."

Genemon: "Count, then. The beam-marks will keep your place. They have kept
it this long."

flags: works-open-u3

## scene-def works-u4
trigger: flag works-seen-u4
once: true
speaker: genemon
voice: steward

<!--#evening-the-forecourt-the-omoya-s-->
> Evening, the forecourt, the omoya's shut screens going grey with the last
> light. Naoyuki is there before you — standing where you stood to look at
> them, which means he saw you looking, or was told.

<!--#when-i-was-a-boy-those-->
Naoyuki: "When I was a boy, those rooms —"

<!--#the-sentence-stops-the-way-his-->
> The sentence stops, the way his sentences do, as if he has read it back
> and found it not worth the ink. He goes in along the veranda. Genemon
> comes out by the same boards, the day-book under his arm, and stands where
> Naoyuki stood.

<!--#you-have-seen-the-shut-rooms-->
Genemon: "You have seen the shut rooms. Everyone has. The house walks past
its own best rooms daily, by the shortest way, the way a man walks past a
debt. And still the veranda edge is wiped clean along its whole length —
you will have seen that too."

<!--#thirty-one-years-i-have-written-the-->
Genemon: "Thirty-one years I have written the closing of this house, door by
door. A room shut is one line, and cheap. Opening is dearer. I rule a second
reckoning now — walls that held, ground taken back, stores past need — and
that page wants the omoya on it, or the page is a lie of a new kind."

<!--#it-is-the-last-work-and-->
Genemon: "It is the last work, and the largest: your coin, your hours,
against your name in this book. Set the house in order, and whatever else
this book has been, it ends as the record of a house that stands."

### ask works-u4-ask-a · "Who keeps the veranda edge clean?"

<!--#o-hisa-when-she-thinks-the-yard-->
Genemon: "O-Hisa, when she thinks the yard is empty. Nobody set her to it,
and she would not thank the book for noticing. Houses are kept alive by such
hands long after they are shut, and none of it has ever been entered. That
is the arrears I mean to clear."

### ask works-u4-ask-b · "Why me?"

<!--#because-every-work-on-this-page-->
Genemon: "Because every work on this page went in against your name, and the
yard watched each one done. When this house asks, someday, who set it in
order, the book should answer with a name it can stand behind. Yours is the
one written on the doing."

### decide · The last page of the reckoning is ruled, and empty.

#### works-u4-begin · "Open the rooms. Set the house in order."

Genemon: "Entered. And when it is done, I will write the line I have kept
thirty-one years for. See that you make it true."

memory: genemon +1 (the-house-stands)
flags: works-open-u4

#### works-u4-hold · "Order is a large word. Let me come at it slowly."

Genemon: "Slowly is how the rooms were shut — one line at a time. Come at it
however you like; it is entered, and the page will wait. Pages do."

flags: works-open-u4

## prose flavor

### worksNamedOrchard

The day-book opens a heading the kitchen has paid toward for nine years in
bought plums: orchard, gone wild, to be taken back — {elder} enters it
without looking up, as if it had always been there.

### worksNamedGranary

Entered in the day-book: granary, second, to be raised at the kura — the
line saying plainly what Rokusuke's beam-marks and last autumn's oilcloth
have said for years.

### worksNamedHouse

Entered, in {elder}'s smallest hand: the omoya, to be set in order. Nobody
at the board says anything, which is how this house says most things.

### worksSeenGate

The gate-board hangs by grace of a wedge someone renews without being asked,
and the wood behind it has gone soft as old bread. Yohei's stall always
ropes to the same post — even trade knows which one to trust.

### worksSeenPaddies

The east bund weeps through a fist of stakes and straw — Rokusuke's work,
redone after every rain, entered nowhere. The water it loses is the far
rows' water, and the far rows show it.

### worksSeenWoodshed

The wood is stacked in a horseshoe around one bare patch of floor, and
Shinnosuke's perch on the pile keeps to the dry end — even the boy's
trespassing has learned this roof. Above the bare patch, daylight.

### worksSeenOrchard

Under the bramble the fruit trees stand alive in their rows while the
kitchen buys plums at the stall. The dogs' paths through the choke are
wider than the house's.

### worksSeenKura

The rice is stacked to the beams and turned week about so the bottom bales
can breathe — Rokusuke's arithmetic, not the builder's. One good harvest
more than this floor can hold, and the surplus sits out under oilcloth.

### worksSeenHouse

From the forecourt the omoya's shut rooms show as a row of weathered
screens, and along the veranda edge the dust is wiped in one clean band —
someone still keeps that much of it, and no one says who.

### worksLadderUnnamed

The yard works around what nobody has named.

### worksLadderNamed

The book has named its concerns; go and see them with your own eyes.

### worksU1Label

Make the first repairs

### worksU1Blurb

Mend the gate, the bund, and the woodshed roof — the small work the yard
has walked around for years.

### worksU1Done

The wedge comes out of the gate, the bund holds through a whole rain, and
the woodshed roof goes dark where daylight showed. By week's end O-Hisa
crosses the gateyard the short way, and the yard's rounds run straight for
the first time in four winters. (U1 · Stabilising)

<!-- TAKE A · "the ledger's mercy" — works-cause bundle (ADR-139 blind diverge).
  Information source: the day-book itself, read aloud / written while the MC
  watches. Genemon's care is shown ONLY through bookkeeping choices — what he
  enters against the house, which lines he has kept open, what he does not
  charge. The seen-lines confirm the entries exactly; the precision is the
  emotion. The MC's stake: being entered in a book is a form of being kept. -->

## scene-def works-intro
trigger: scripted
once: true
speaker: genemon
voice: steward

<!--#morning-the-forecourt-genemon-s-window-->
> Morning, the forecourt. Genemon's window stands open on the board and the
> day-book is out — turned back, for once, from the working page to the old
> ones, the corners gone soft with handling. He does not call you. He waits
> until the round brings you past, which he knew it would.

<!--#stand-where-you-can-see-the-->
Genemon: "Stand where you can see the page. This concerns you now — you are on
the book, and the book has other lines than wages."

<!--#he-reads-them-the-way-he-->
> He reads them the way he reads everything, at board volume, one figure at a
> time, and each one lands like a thing set down and not thrown.

<!--#gate-posts-two-sound-paint-gone-->
Genemon: "Gate. Posts, two, sound. Paint, gone. Lower hinge, crying since the
year before your river. Carried open four years. Charged to no man."

<!--#home-paddies-bunds-slumping-at-the-->
Genemon: "Home paddies. Bunds, slumping at the water-edges — two hand-spans
lost to the mud each spring, entered each spring, mended never. Carried open
six years."

<!--#woodshed-roof-north-slope-taking-water-->
Genemon: "Woodshed. Roof, north slope, taking water. The damp goes against the
house. The man who sleeps under the damp does not."

<!--#he-turns-further-back-to-a-->
> He turns further back, to a page ruled tighter than the rest, and lays the
> book flat so the line faces you.

<!--#and-this-one-which-does-not-->
Genemon: "And this one, which does not close. Weir screens, leased of Matsuzō,
across the river. The rats gnaw them at the waterline; every slat gnawed is
coin owed off the estate. I have entered that damage every season for nine
years, the way I enter rain. The weir path is open to you. It was always the
house's to walk; it is time a hand walked it."

<!--#that-is-the-reading-now-the-->
Genemon: "That is the reading. Now the checking. Go and stand where the
figures stand — the gate, the paddies, your own roof. An entry is worth what
the eye that checks it is worth. Come back when you have looked."

### ask works-intro-ask-a · "Why show me the book?"

<!--#because-you-are-in-it-a-->
Genemon: "Because you are in it. A man on this book eats from these figures
whether he reads them or not — every open line above your line leans on your
line. The others know the yard by their years here. You will know it the way
I know it, or not at all."

### ask works-intro-ask-b · "Who pays for the mending?"

<!--#not-the-house-its-coin-is-->
Genemon: "Not the house — its coin is spoken for before it reaches the yard;
that was your first day's lesson and it has not improved. What a hand puts in
of his own — labour, and coin when he has coin — the book carries under his
mark, dated. It forgets nothing it is given. That is the one promise I am in a
position to make."

### decide · The day-book lies open on the named lines.

#### works-intro-go · "I'll walk them today."

Genemon: "Then the book says so. A short line, the date, no more. Named, and
walked the same day — the date will keep you honest."

memory: genemon +1 (walked-the-book)
flags: works-named-u1, works-named-weir

#### works-intro-hold · "Figures aren't mending. The yard wants me first."

Genemon: "The yard is on this book too; I am not asking you off it. The lines
stay open. Open is what they are used to. The old pages keep their corners."

flags: works-named-u1, works-named-weir

## scene-def works-u1
trigger: flag works-seen-u1
once: true
speaker: genemon
voice: steward

<!--#the-board-evening-the-day-book-stands-->
> The board, evening. The day-book stands open at a page ruled fresh — the
> gate's line, the bunds' line, the woodshed's, copied out of their years and
> set together under one head, in ink already dry. He did the copying before
> you had crossed the yard.

<!--#the-gate-hinge-the-bunds-the-->
Genemon: "The gate hinge. The bunds. The slope over your mat. You stood where
the figures stand. Tell me if they lied."

<!--#they-didn-t-->
You: "They didn't."

<!--#they-never-do-that-is-the-->
Genemon: "They never do. That is the whole of their use."

<!--#he-rules-a-bracket-down-the-->
> He rules a bracket down the three lines, joining them.

<!--#one-work-then-taken-as-one-->
Genemon: "One work, then, taken as one: board and hinge-iron for the gate,
clay and stone for the water-edges, straw for the roof. The tools are the
house's — their wear I enter against the house, as I enter my own pen. The
rest goes in as you can put it in, and is entered as it goes."

### ask works-u1-ask-a · "Why these three first?"

<!--#because-they-are-the-oldest-lines-->
Genemon: "Because they are the oldest lines still cheap. The gate has waited
four years; a fifth costs a post. The bund gives up more each spring than the
spring before. Old damage compounds like a debt, and these three have not yet
learned to. Close them before they do."

### ask works-u1-ask-b · "And when it's done?"

<!--#the-line-closes-a-house-stands-->
Genemon: "The line closes. A house stands on closed lines; there is no other
material. And the closing carries the mark of the hand that closed it — dated,
footed, kept. The yard forgets a mended hinge by the next rain. The book does
not."

### decide · Three lines under one head, and the brush is wet.

#### works-u1-begin · "Put my mark to it."

Genemon: "Entered. First repairs — opened this day, against the hand that
walked them. Three of the book's oldest lines now point at you."

memory: genemon +1 (set-to-it)
flags: works-open-u1

#### works-u1-hold · "When I have the means. Not before."

Genemon: "That is the correct order, and rarer than it should be. The head is
ruled either way — it waits better than the timber will. Bring your mark when
you bring the means."

flags: works-open-u1

## scene-def works-u2
trigger: flag works-seen-u2
once: true
speaker: genemon
voice: steward

<!--#the-board-genemon-has-the-day-book-->
> The board. Genemon has the day-book turned back further than you have seen
> it go — years back, to a line ruled open and never carried forward, never
> struck, sitting on its page like a door left unlocked in an empty house.

<!--#orchard-last-entered-bearing-the-year-->
Genemon: "Orchard. Last entered bearing the year before the dogs. Since then —
nothing against it. No fruit, no loss, no line. I did not strike it. A struck
line is a judgment. This one was only waiting."

<!--#you-have-seen-the-rows-now-->
Genemon: "You have seen the rows now. Sound trees under the choke, planted in
order by people who expected to walk between them. Wild wood over the top, and
the dens under. Clearing it is billhook work and den work — weeks of the one,
and the other is not work I can enter for you."

### ask works-u2-ask-a · "You kept the line open all this time?"

<!--#ink-is-cheap-judgment-is-not-->
Genemon: "Ink is cheap. Judgment is not. Whoever set those trees out expected
paths, and lanterns, and years — I do not close another man's expectation
until it is proved wrong. Six stewards' worth of pages carry that line open. I
was not going to be the one who ended it for tidiness."

### ask works-u2-ask-b · "And the dogs?"

<!--#kihei-s-column-not-mine-mine-->
Genemon: "Kihei's column, not mine. Mine says only this: the year the dens
filled, the fruit line emptied. The book has watched the two trade for six
years, one for one. Empty the dens, and I know what the other line does. I
have the figures."

### decide · The open line waits on the page.

#### works-u2-begin · "Then it stops waiting."

Genemon: "Ground taken back. I have not ruled those words in thirty years of
this book. They are ruled now, and dated. Prove the ink right."

memory: genemon +1 (ground-taken-back)
flags: works-open-u2

#### works-u2-hold · "It has waited years. It can wait for my strength."

Genemon: "It can. It has the practice. The head is ruled; the line goes on
waiting the way it knows how — open. Bring me the date when you are fit to
put under it."

flags: works-open-u2

## scene-def works-u3
trigger: flag works-seen-u3
once: true
speaker: genemon
voice: steward

<!--#genemon-meets-you-at-the-kura-->
> Genemon meets you at the kura door itself, the day-book carried out into the
> yard under his arm — a thing you have not seen him do in a year of watching
> him not do it.

<!--#you-have-stood-the-watch-here-->
Genemon: "You have stood the watch here. Then you know what I know: the count
is honest and the walls are not equal to it. For eleven years this book has
entered 'stored to the rafters' as a limit. It should have been a boast. One
good harvest and the house's own rice would sleep in the weather."

<!--#a-second-granary-then-raised-beside-->
Genemon: "A second granary, then, raised beside the first. Timber, stone
footing, board by board. The ground it stands on is the house's — that much
costs you nothing. The rest is put in as it has been put in: your labour,
your coin as you have it, entered as it goes. The term of the work is three
words. Stores past need. This book has never once been able to write them."

### ask works-u3-ask-a · "Eleven years. Why now?"

<!--#because-for-eleven-years-the-house-->
Genemon: "Because for eleven years the house was bleeding, and a bleeding
house does not build. Look at the book, not at me: the lease's damage line,
empty. The gate, the bunds, the roof — closed. The orchard — open and moving.
A book that has stopped bleeding can afford to plan. The figures changed. Most
of the hands in the changing are one hand's."

### ask works-u3-ask-b · "And if the harvests don't fill it?"

<!--#then-it-stands-empty-and-i-->
Genemon: "Then it stands empty, and I enter an empty granary, which costs
nothing to carry and shames no one but the weather. I have carried worse lines
for poorer reasons. But I have footed this year twice, once for the house and
once against my own doubt, and the two counts agree. It does not stand empty
long."

### decide · The measure of it is drawn on the page.

#### works-u3-begin · "Raise it."

Genemon: "Past winter's need. Opened, dated, against the kura wall for a
desk. I will foot it against every season until it closes. See that the
seasons are short."

memory: genemon +1 (past-winters-need)
flags: works-open-u3

#### works-u3-hold · "Timber first. My back second. Then the book."

Genemon: "That is the whole craft of it in one line — I have known stewards
who never learned it. The head is ruled. The timber will tell you when, and
the book will still be here."

flags: works-open-u3

## scene-def works-u4
trigger: flag works-seen-u4
once: true
speaker: genemon
voice: steward

<!--#the-board-late-the-lamp-down-->
> The board, late, the lamp down to its last width of oil. The day-book lies
> open at the newest page — the second reckoning, ruled at the season's close:
> one line a season, in the book's plain words. Most of the page is still to
> come. Genemon sits before the empty part of it the way other men sit before
> a fire.

<!--#you-have-looked-at-the-omoya-->
Genemon: "You have looked at the omoya. From the forecourt — everyone looks
from the forecourt; the house is arranged so that nobody sees further. The
south rooms, shuttered since before your river. Nine years I have entered no
repair against those rooms. Not because nothing wanted repairing."

<!--#the-second-reckoning-wants-its-capstone-->
Genemon: "The second reckoning wants its capstone. Stores past need — rising.
Ground taken back — taken. Walls that held — they held. One head remains, and
in thirty-one years I have not had the standing to rule it. The house itself.
Set in order, room by shut room, until this book can write of the omoya what
it writes of the kura. Sound."

### ask works-u4-ask-a · "Nine years of silence on it. Why?"

<!--#because-a-repair-entered-is-a-->
Genemon: "Because a repair entered is a repair owed. To write the omoya's
wants into this book while the house could not answer them — that is not
stewardship, that is accusation, one line a season, forever. So I kept the
rooms shut and the page shut with them, and charged the silence to nobody.
Both open now, or neither. The figures say now."

### ask works-u4-ask-b · "Why tell me?"

<!--#because-the-book-says-gonbei-against-->
Genemon: "Because the book says Gonbei against more closed lines than any
name in it — count them yourself, the pages are numbered. When this house
stands in order, the order will be made of entries, and most of the entries
are yours. That is not thanks. It is arithmetic. Thanks is not my column."

<!--#he-says-it-to-the-page-->
> He says it to the page, not to you, and enters nothing, which from him is
> the same as looking up.

### decide · The last head, unruled.

#### works-u4-begin · "Rule it."

Genemon: "The house, set in order. Opened. When it closes, this book's plain
words will be: the estate stands. I have waited a working life to be allowed
the sentence. See that I am here to enter it."

memory: genemon +1 (the-house-stands)
flags: works-open-u4

#### works-u4-hold · "After the season's work. It can wait for me steady."

Genemon: "It has waited longer, for worse reasons, under worse hands. The head
is ruled and the page is patient — it is the one thing I own that is. Bring me
the closing."

flags: works-open-u4

## prose flavor

### worksNamedOrchard

At the board, {elder} turns the day-book back years and reads one line aloud:
orchard — open, never struck, waiting.

### worksNamedGranary

The day-book rules a head it has never carried: a second granary — stores past
the winter's need.

### worksNamedHouse

Under the second reckoning, {elder} rules the last head as plainly as any:
the house itself, set in order.

### worksSeenGate

The posts stand sound, the paint long gone, and the lower hinge cries on the
swing exactly as entered. Four years of that sound, carried, and charged to no
one.

### worksSeenPaddies

The bund's water-edge has slumped to a soft lip a thumb can push into, the mud
below it fat with what six springs have taken. The figure said two hand-spans;
the eye, measuring, gets two.

### worksSeenWoodshed

Daylight through the north slope, and a water-stain riding the rafter over
your own mat. The book carries the damp against the house; the roof carries it
against you.

### worksSeenOrchard

Wild rows to the shoulder, windfall gone to vinegar underfoot — and beneath
the choke the trees stand in planted order, set out by someone who expected to
walk here. The dens in the hollow are exactly where the losses said.

### worksSeenKura

The rice stands to the rafters with room for nothing above it — a limit the
book has entered as a limit for eleven years. One good harvest would have
nowhere to sleep.

### worksSeenHouse

From the forecourt the omoya shows its shut south face: shutters weathered
grey into their grooves, rooms nine years absent from the book. Not one entry
against any of it, and that is its own kind of entry.

### worksLadderUnnamed

The day-book carries lines it has not read aloud yet.

### worksLadderNamed

Named at the board. Now go and stand where the figures stand.

### worksU1Label

Close the oldest lines

### worksU1Blurb

Gate, bunds, and the woodshed roof — three standing entries, mended as one
work.

### worksU1Done

The hinge swings silent, the bunds hold their line, the woodshed roof turns
the rain. At the board, three of the day-book's oldest open entries are ruled
through in one evening — dated, footed, closed. (U1 · Stabilising)

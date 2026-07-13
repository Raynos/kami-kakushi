## scene-def works-intro
trigger: scripted
once: true
speaker: genemon
voice: steward

<!--#the-board-an-evening-some-weeks-->
> The board, an evening some weeks into the rice terms. The day's wages are
> footed and the book should be closed, but Genemon has turned instead to a
> page ruled off from the rest — older ink at the head of it, this morning's
> at the foot.

<!--#the-wages-are-settled-this-is-->
Genemon: "The wages are settled. This is the other page."

<!--#gate-the-west-post-takes-water-->
Genemon: "Gate: the west post takes water at the foot, second winter
running. Paddies: three bunds slumped, the water going through them at its
own level. Woodshed: rain through the north corner of the roof, into the
stacked wood. None of that is new. It has all been there for years. It is
only now in the book."

<!--#he-enters-nothing-the-lines-are-->
> He enters nothing. The lines are already there, dated.

<!--#and-one-line-the-house-carries-->
Genemon: "And one line the house carries whether I write it or not. The weir
screens are Matsuzō's — leased, and the keeping of them ours. River rats gnaw
them at the waterline; every slat through is coin we owe him. The rats come
back every season, and the house pays every season. That account was open
before you were pulled out of the water at the weir."

<!--#i-commission-nothing-that-has-not-->
Genemon: "I commission nothing that has not been looked at. Walk the three,
and the weir path, and look with your own eyes. Rot shows better by daylight.
The book will keep."

### ask works-intro-ask-a · "Why now? It's stood this long."

<!--#stood-is-the-wrong-word-it-->
Genemon: "Stood is the wrong word. It has been going, at the pace rot keeps,
which is slow enough that a busy man calls it standing. There is ground on
the far side of the orchard where nobody mended anything. Roofs, once. It
went a year at a time, and no one put a hand to it. This house will not go
the same way."

### ask works-intro-ask-b · "Whose coin mends it?"

<!--#not-the-house-s-what-coin-->
Genemon: "Not the house's. What coin this house sees is owed out before it
reaches the yard — I told you that the first morning, and it has not improved
since. What mends any of it is labour, and whatever coin the labourer chooses
to put in himself. The book credits what is put in, under the name that put
it."

### decide · The page is read out. What do you do with it?

#### works-intro-go · "I'll walk it today, while the light holds."

Genemon: "Then it will be answered. Water first. Every line on that page is
water — at the post, through the bunds, through the roof."

memory: genemon +1 (walked-the-book)
flags: works-named-u1, works-named-weir

#### works-intro-hold · "It's stood this long. It can wait a day for me."

Genemon: "It can. It will be worse when you get there. The lines stand
entered; walk them when you walk them."

flags: works-named-u1, works-named-weir

## scene-def works-u1
trigger: flag works-seen-u1
once: true
speaker: genemon
voice: steward

<!--#the-board-again-genemon-watches-you-->
> The board again. Genemon watches you cross the forecourt, sets the day-book
> open at the ruled-off page, and takes up the brush before you have spoken.

<!--#you-walked-it-then-you-know-->
Genemon: "You walked it. Then you know I did not overstate it."

<!--#then-hear-the-work-post-one-->
Genemon: "Then hear the work. Post, one, drawn and reset on dry footing.
Bunds, three, cut back to sound earth and rammed. Roof, one corner — boards
and thatch. One work, the three together. Water is at all three, and I will
not mend one at a time."

<!--#he-rules-the-line-and-leaves-->
> He rules the line and leaves it open, the brush held off the paper.

<!--#taken-up-it-goes-against-your-->
Genemon: "Taken up, it goes against your name — your labour, and any coin
you put beside it. The book credits what is put in."

### ask works-u1-ask-a · "Why the three together?"

<!--#because-it-is-one-fault-whatever-->
Genemon: "Because it is one fault, whatever three names we give it. Water at
the post, water through the bunds, water through the roof. Mend one and the
water still comes in at the other two. Close the account whole, or I open it
again in a season."

### ask works-u1-ask-b · "Where do I begin?"

<!--#water-first-always-the-post-and-->
Genemon: "Water first, always. The post and the bunds while the weather
holds; the roof before the autumn rains — after them it is too late, and the
corner is worse than when you started. The weather sets the order. I do not."

### decide · The line is ruled and open.

#### works-u1-begin · "Set it against my name."

Genemon: "Entered. Three concerns, one work, your name on the answering
side. It is the first entry this page has carried that is not a loss, in some
years. We will see if it holds."

memory: genemon +1 (set-to-it)
flags: works-open-u1

#### works-u1-hold · "When the yard can spare me. It's slow work, losing."

Genemon: "Slow, and it does not stop. Do not stand and watch it too long.
The line stays open. So is the roof."

flags: works-open-u1

## scene-def works-u2
trigger: flag works-seen-u2
once: true
speaker: genemon
voice: steward

<!--#genemon-finds-you-at-the-forecourt-->
> Genemon finds you at the forecourt with the orchard's brambles still on
> your sleeves, and does not ask where you have been. The day-book comes open
> at the ruled page.

<!--#the-orchard-nothing-on-this-side-->
Genemon: "The orchard. Nothing on this side of the wall has been let go
longer — a row at a time, over years, and nobody cut it back. Trees a
household set out with paths in mind, gone under the choke, and dogs denned
in the hollow where fruit was dried once."

<!--#the-work-the-wild-rows-cut-->
Genemon: "The work: the wild rows cut back to the sound wood, and the dens
broken and emptied. Not a mending — a taking-back. It will grow in again
behind you if you stop."

### ask works-u2-ask-a · "The dogs first, or the cutting?"

<!--#the-dens-first-cut-with-them-->
Genemon: "The dens first. Cut with them still in there and they will come at
your back. Bold from lean winters, and they do not run. Break the pack and
what is left is dogs. Kihei will tell you the same, in fewer words, and drill
you for it if you ask him plainly."

### ask works-u2-ask-b · "Is anything left in there worth the taking?"

<!--#sound-trees-under-the-choke-trees-->
Genemon: "Sound trees under the choke. Trees outlast neglect; that is usually
the way. Whoever planted them expected paths between the rows, and lanterns.
Thirty years of bramble have gone over the paths. The paths are still under
it."

### decide · The orchard's line stands the oldest on the page.

#### works-u2-begin · "Cut it back. Row by row, the way it was lost."

Genemon: "Entered. Ground taken back is a line I have not written since I
was a younger man's clerk. Mind the dogs, and bring me the rows one at a
time. I will strike them off the page as they come."

memory: genemon +1 (ground-taken-back)
flags: works-open-u2

#### works-u2-hold · "Thirty years of choke. It'll keep another season."

Genemon: "It will keep the way it has kept — by growing. Every season the
cutting is a season heavier. The line is entered; take it up before there is
more of it than a man can cut."

flags: works-open-u2

## scene-def works-u3
trigger: flag works-seen-u3
once: true
speaker: genemon
voice: steward

<!--#evening-at-the-board-genemon-has-->
> Evening at the board. Genemon has the kura's tallies out beside the
> day-book, one read against the other, and he speaks without looking up. He
> has done the sums already.

<!--#you-have-seen-it-the-kura-->
Genemon: "You have seen it. The kura is sound and full, and those are two
different worries. It holds this year's rice and not a measure over. A poor
year starves the house; a good year would embarrass it — grain standing in
the damp for want of a roof. We lose the grain either way."

<!--#so-a-second-granary-raised-at-->
Genemon: "So: a second granary, raised at the kura, on its own footings.
Stores past the winter's need. Every work on this page till now has answered
a loss already taken. This one is made before the loss. I have waited a long
time to rule a line of that kind."

### ask works-u3-ask-a · "Why a second? Widen the one that stands."

<!--#the-kura-is-sound-and-sound-->
Genemon: "The kura is sound, and sound is kept, not cut open. A second
stands on its own feet, its own roof, its own lock — two roofs do not fail
in one night, and two counts can be checked one against the other. A fire
takes the building it starts in. It does not take the one across the yard."

### ask works-u3-ask-b · "Stores past need — for what, exactly?"

<!--#for-the-year-the-valley-has-->
Genemon: "For the year the valley has instead of the year we plan for. A bad
year comes without warning. A full storehouse is the only thing that carries
a house through one; nothing else does. Look at the ground past the orchard.
Households stood there once, with nothing stored, and a lean year finished
them."

### decide · The footings can be cut this season or not at all.

#### works-u3-begin · "Raise it. Board by board, ahead of the weather."

Genemon: "Entered — and mark it: the first line on this page written before
the damage, not after it. Green wood dries crooked; buy seasoned, or cut
early and wait. Either way it must stand through the winter."

memory: genemon +1 (past-winters-need)
flags: works-open-u3

#### works-u3-hold · "A whole granary. That's past my scale of mending."

Genemon: "It is past mending altogether; that is its virtue. The line is
ruled and stands open. Footings before the frost — after it the ground will
not take a spade, and the year is gone."

flags: works-open-u3

## scene-def works-u4
trigger: flag works-seen-u4
once: true
speaker: genemon
voice: steward

<!--#past-supper-the-board-the-lamp-->
> Past supper, the board, the lamp low. Genemon has the day-book open to the
> ruled page, and for once he is not writing — he is reading it back, line by
> line.

<!--#stand-where-i-can-see-you-->
Genemon: "Stand where I can see you; this is the last of the page."

<!--#the-omoya-you-have-seen-it-->
Genemon: "The omoya. You have seen it from the forecourt — half this house
shut, moss on the ridge, and indoors the same rot with no weather to blame:
dust, damp, screens that no hand slides. A room does not need rain to be
lost. It only needs to be left alone."

<!--#the-house-set-in-order-roofs-->
Genemon: "The house set in order: roofs sound, screens mended, air and use in
every room. Thirty-one years I have written this house's losses and little
else. I mean to write something else before I am done."

### ask works-u4-ask-a · "Why the omoya last?"

<!--#because-the-rest-holds-now-and-->
Genemon: "Because the rest holds now, and it did not. The gate is dry at the
foot, the bunds carry their water, the orchard bears, grain stands past the
winter's need. What is still wrong with this house is less than it has been
in thirty years. The omoya is the longest line left on the page — and a house
is mended from the outside in."

### ask works-u4-ask-b · "What does 'in order' come to, in the doing?"

<!--#roof-and-ridge-first-a-room-->
Genemon: "Roof and ridge first — a room is lost from above. Then the shut
rooms, opened one at a time: screens repapered, boards taken up where the
damp has been under them, braziers lit until the walls are dry through. Then
use. A room is kept by being lived in; there is no other keeping. The doing
is long. The entry is one line."

### decide · The last line of the page is ruled, and open.

#### works-u4-begin · "Open the rooms. All of them."

Genemon: "Entered. When it is done, this season's line will not be a loss.
The far bank is lost, and the winter will do as it does. This house will be
standing."

memory: genemon +1 (the-house-stands)
flags: works-open-u4

#### works-u4-hold · "A whole house. Give me the winter to look at it."

Genemon: "Look, then. Every day, not once. The line is ruled. The omoya has
gone years without a hand on it; it can go a season more. It should not go
two."

flags: works-open-u4

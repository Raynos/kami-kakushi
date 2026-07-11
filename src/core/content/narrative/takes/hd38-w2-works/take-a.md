## scene-def works-intro
trigger: scripted
once: true
speaker: genemon
voice: steward

> The board, an evening some weeks into the rice terms. The day's wages are
> footed and the book should be closed. Genemon turns instead to a page ruled
> off from the rest and sets it where you can see it — old ink at the head of
> it, this morning's at the foot.

Genemon: "The wages are settled. This is the other page."

Genemon: "Gate, west post: standing in wet ground, second winter running.
Paddies — three bunds slumped, the water going through them instead of round.
Woodshed, north corner — rain comes in through the roof. The wood under it
does not dry, and the boards it lands on are going soft."

Genemon: "Every one of those is worse this year than it was last year. I have
been writing them down for thirty years. Writing them down is all I have been
able to do about them."

> He adds nothing to the page. The lines are already there, each with the date
> it was first entered.

Genemon: "One more, and this one the house pays for in coin. The weir screens
belong to Matsuzō. We lease them; the keeping of them is ours. River rats chew
through the slats at the waterline, and every slat they take, we buy him a new
one. We were paying for those screens before you washed up against them."

Genemon: "I do not commission work I have not had looked at. Walk the gate,
the paddies, the woodshed, and the weir path. Look at them yourself, in
daylight. Then come back and I will price them."

### ask works-intro-ask-a · "Why now? It's stood this long."

Genemon: "It has not stood. It has been going down, slowly enough that a busy
man calls it standing. Walk past the orchard and you will find the ground
where houses used to be. Roofs, once. Nobody had the money to keep them up,
and now there is nothing to see but humps in the grass. I have watched this
estate go the same way, a little each year. I would like to stop."

### ask works-intro-ask-b · "Whose coin mends it?"

Genemon: "Not the house's. I told you your first morning: what coin this house
sees is owed out before it ever reaches the yard, and I am the man who sends
it. That has not changed. What mends these is labour, and whatever coin the
man doing the labour chooses to put down beside it. I write in what is put in,
under the name that put it."

### decide · The page is read out. What do you do with it?

#### works-intro-go · "I'll walk it today, while the light holds."

Genemon: "Good. Start with the water — the post and the bunds. Wet ground is
doing the most damage, and it is doing it fastest."

memory: genemon +1 (walked-the-book)
flags: works-named-u1, works-named-weir

#### works-intro-hold · "It's waited years. It can wait a day."

Genemon: "It can. It will not be any better for the wait. The lines are
written. Walk them when you walk them — but nothing out there stops while you
decide."

flags: works-named-u1, works-named-weir

## scene-def works-u1
trigger: flag works-seen-u1
once: true
speaker: genemon
voice: steward

> The board again. Genemon watches you cross the forecourt, sets the day-book
> open at the ruled page, and takes up the brush before you have spoken.

Genemon: "You walked it. Your face says the page did not lie to you."

Genemon: "Then hear the work. Post, one: drawn out and reset on dry footing.
Bunds, three — cut back to sound earth and rammed. Roof, one corner — boards
and thatch. One work, the three together."

> He rules the line and leaves it open, the brush held off the paper.

Genemon: "Taken up, it goes against your name — your labour, and any coin you
put beside it. I credit what is put in."

### ask works-u1-ask-a · "Why the three together?"

Genemon: "Because all three are the same fault: water where it should not be.
Reset the post and the bunds still slide. Ram the bunds and the roof still
lets the rain in. And whichever two you leave are worse by the time you get
back to them. Do the three and the water is out for good."

### ask works-u1-ask-b · "Where do I begin?"

Genemon: "Water first. The post and the bunds while the weather holds. The
roof before the autumn rains start — after that you are laying boards on wet
thatch, and you will be doing it twice."

### decide · The line is ruled and open.

#### works-u1-begin · "Set it against my name."

Genemon: "Entered. Three concerns, one work, your name against them. It is the
first work this page has carried in years."

memory: genemon +1 (set-to-it)
flags: works-open-u1

#### works-u1-hold · "When the yard can spare me."

Genemon: "The line stays open. Only understand that the post gets no drier
while it waits."

flags: works-open-u1

## scene-def works-u2
trigger: flag works-seen-u2
once: true
speaker: genemon
voice: steward

> Genemon finds you at the forecourt with the orchard's brambles still on your
> sleeves, and does not ask where you have been. He opens the day-book at the
> ruled page.

Genemon: "The orchard. That is the oldest thing on this page. It went a row at
a time, over years, and there were never hands enough to stop it. Somebody
planted those trees with paths between them. The bramble is over the paths
now, and there are dogs denned in the hollow where fruit was dried."

Genemon: "The work: the wild rows cut back to sound wood, the dens broken and
emptied. This is not a mending. It is ground taken back."

### ask works-u2-ask-a · "The dogs first, or the cutting?"

Genemon: "The dens first. Swing a billhook in there with the pack still in it
and you are feeding them your arms. They are bold — lean winters do that.
Break the pack and what is left is only dogs. Kihei will tell you the same in
fewer words, and drill you for it if you ask him plainly."

### ask works-u2-ask-b · "Is anything left in there worth the taking?"

Genemon: "There are sound trees under the choke. That is usually the way — the
stock lives, the keeping fails. Thirty years of bramble has not killed them.
Cut it off them and they will bear."

### decide · The orchard's line is the oldest on the page.

#### works-u2-begin · "Cut it back. Row by row, the way it was lost."

Genemon: "Entered. I have not written ground taken back since I was a younger
man's clerk. Mind the dogs. Bring me the rows one at a time and I will strike
each one off as it comes."

memory: genemon +1 (ground-taken-back)
flags: works-open-u2

#### works-u2-hold · "Thirty years of choke. It'll keep another season."

Genemon: "It will keep by growing. Every season you leave it, the cutting is
heavier and the arms are the same. The line is entered. Take it up before it
is past what one man can cut."

flags: works-open-u2

## scene-def works-u3
trigger: flag works-seen-u3
once: true
speaker: genemon
voice: steward

> Evening at the board. Genemon has the kura's tallies out beside the day-book,
> one read against the other, and he speaks without looking up at you.

Genemon: "You have seen it. The kura is sound, and the kura is full, and those
are two different problems. It holds this year's rice and not a measure over.
A bad year starves us. A good year would shame us — grain standing out in the
damp because there is no roof to put it under."

Genemon: "So: a second granary, raised beside the kura, on its own footings.
Room for stores past the winter's need. Everything on this page until now is
damage already done. This one would be built before the damage. I have waited
a long time to rule a line of that kind."

### ask works-u3-ask-a · "Why a second? Widen the one that stands."

Genemon: "Because the kura is sound, and you do not cut open a sound building
to make it larger. A second stands on its own footings, under its own roof,
behind its own lock. If one roof goes in a storm, the other store is still
dry. And two stores are counted separately, so a shortfall shows the moment
it happens."

### ask works-u3-ask-b · "Stores past need — for what, exactly?"

Genemon: "For the year we get instead of the year we planned for. A flood, a
failed harvest, a levy called early. When one of those comes, the only thing
that answers it is grain already in the store. Go and stand on the empty
ground past the orchard. Those households had nothing put by."

### decide · The footings can be cut this season or not at all.

#### works-u3-begin · "Raise it. Board by board, ahead of the weather."

Genemon: "Entered — and mark it: the first line on this page that is not a
loss. Green wood dries crooked. Buy seasoned, or cut early and let it stand.
Do not put wet timber under next year's rice."

memory: genemon +1 (past-winters-need)
flags: works-open-u3

#### works-u3-hold · "A whole granary. That's past my scale of mending."

Genemon: "It is not a mending at all. That is the whole point of it. The line
is ruled and stands open. Footings before the frost, or the ground goes hard
and the year is lost."

flags: works-open-u3

## scene-def works-u4
trigger: flag works-seen-u4
once: true
speaker: genemon
voice: steward

> Past supper, the board, the lamp low. Genemon has the day-book open at the
> ruled page, and for once he is not writing. He is reading it back, line by
> line, and he waits until you are standing in front of him.

Genemon: "Stand where I can see you. This is the last of the page."

Genemon: "The omoya. You have seen it from the forecourt. Half this house is
shut — moss on the ridge, damp in the boards, screens no hand has slid in
years. A room nobody uses goes bad. It does not need a storm to do it. It only
needs to be left."

Genemon: "The work: roofs sound, screens mended, air and use in every room.
Thirty-one years I have written this house's losses down. I would like to
write something else before I am finished."

### ask works-u4-ask-a · "Why the omoya last?"

Genemon: "Because the rest holds now, and it did not. The post is dry at the
foot. The bunds carry their water. The orchard bears. There is grain in store
past the winter. The house is the largest thing still going down, and it is
the last thing left on this page. You mend a house from the outside in — the
roof first, or every day's work indoors is undone by the next rain."

### ask works-u4-ask-b · "What does 'in order' come to, in the doing?"

Genemon: "Roof and ridge first; a room is lost from above. Then the shut rooms,
opened one at a time — screens repapered, boards lifted where the damp has got
under them, braziers lit until the wood is dry through. Then use. A room stays
sound because people are in it. There is no other way to keep one. The doing is
long. The entry is one line."

### decide · The last line of the page waits on an answer.

#### works-u4-begin · "Open the rooms. All of them."

Genemon: "Entered. When it is done I will write it down, and for once it will
not be a loss."

memory: genemon +1 (the-house-stands)
flags: works-open-u4

#### works-u4-hold · "A whole house. Give me the winter to look at it."

Genemon: "Look at it, then. The line is ruled and stays open. The omoya has
waited years for a pair of hands. It can wait a season. It should not wait
two."

flags: works-open-u4

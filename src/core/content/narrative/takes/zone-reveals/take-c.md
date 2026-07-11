## scene-def sb-market
trigger: scripted
once: true
speaker: genemon
voice: steward

> Copper. Rounds of it, square-holed, the rims worn thin by hands that
> were not yours. They have gone warm from being carried in a fist all
> morning, and they knock against each other when you walk, which is how
> you came to be standing still in the middle of the forecourt.

> You have counted them twice. Both counts came out the same.

> Nothing inside these walls will take them. The rice is weighed dry at
> the kura door and entered against your name; the bowl is the kitchen's;
> the mat is the woodshed's. The village road runs out past the gate and
> the day's work does not let go of you long enough to walk it. The coin
> is metal, and metal keeps, and that is the whole of what it does here.

> Genemon comes to the board with the day-book under his arm and stops,
> because a man standing still in a swept yard is a thing out of order.

Genemon: "Open the hand."

> You open it. He looks at the coins the way he looks at everything that
> is put in front of him: he counts them, and then he waits to be told
> what they are for.

Genemon: "That is enough for the smallest thing on a pedlar's cart — a
sack of mountain greens, ten mon. There is nothing else this side of the
pass that your money reaches."

Genemon: "Two days in seven, Yohei brings the cart up from the valley and
sets his stall in the gateyard. Greens, kindling, a hone. He buys rice off
a man and sells him what a man on foot can carry away again. Those two
days are the reach of it. There is a monk who lodges at the gate at the
New Year and at Bon, and he sells nothing and asks for nothing, and past
those, nothing comes to that gate at all."

> From the board you can see the whole of the gateyard through the open
> posts: hard dirt, bare of everything, and the crest board hung above it
> in wood newer than the posts that carry it. Nobody has swept out there
> since the hand who swept it left for the lowlands.

Genemon: "It is the first ground anyone sees of this house, and it has
been dirt for two years. It goes with the round. It is yours."

### ask sb-market-ask-a · "What does he stock?"

Genemon: "A sack of mountain greens, ten mon — the cheapest thing he
carries. A bundle of split kindling above that. A river-stone hone and a
faggot of ash, for a man who means to keep an edge on something. The rest
of the cart turns with the season: one straw coat this winter, and when it
is gone it is gone until the wheel comes round to winter again."

### ask sb-market-ask-b · "And if I never spend it?"

Genemon: "Then it sits, and it will sit well; copper is patient. A hone is
twenty-eight mon. An edge that is not kept fails in the middle of a day's
work and costs you the rest of that day. Put the two numbers beside each
other and you have my whole opinion. It is arithmetic. It is not advice."

### decide · Coin in the one hand. The broom in the other.

#### sb-market-go · "I'll be at the gate on his day."

Genemon: "Then be there with it counted before you go, and count what
comes back into your palm before you shut it. He prices a stranger high
the first time and a square dealer fairly ever after — that is his trade,
not his friendship, and the trade is the part you can hold him to."

memory: genemon +1 (counts-his-coin)
flags: told-of-the-stall

#### sb-market-hold · "It keeps. Copper doesn't rot."

Genemon: "Copper does not. The cart does — his stock turns with the
weather, and the coat that hangs on it this winter will not hang there in
the spring. Hold it, then; a shut fist has never yet been an error in this
house. You will be sweeping the ground he stands on either way."

memory: genemon +0 (keeps-his-coin)
flags: told-of-the-stall

## scene-def sb-cook
trigger: scripted
once: true
speaker: ohisa
voice: steward

> The bundle has gone heavy on your back the way green things go heavy:
> fern-shoots and butterbur stalks, a double armful, cut at the woodlot
> edge where the light gets down through. The cut ends have browned and
> gone sticky. The tight-curled heads that stood up straight this morning
> are lying over on themselves.

> You ate one raw up there, because you were hungry and it was in your
> hand. Bracken raw is bitter enough to close a throat, and an hour later
> your mouth still knows about it. Raw, this is not food. By tomorrow it
> is not anything at all — greens cut in the morning are rot by the next
> morning, and you are carrying two days' worth of nothing.

> Across the forecourt the kitchen door stands open and smoke is going up
> through the roof-hole, because there is one pot on this estate and it is
> in there, on its hook, over the only fire the house permits. O-Hisa is on
> the threshold with a basin against her hip, watching a man stand in a
> yard holding an armful of greens he cannot eat.

O-Hisa: "Bring it. No — not to me, to the step, and set it down instead of
squeezing the life out of it. There was not much life in it to start."

> Past her shoulder: the pot, the crocks in a row along the wall, and the
> steward's papers stacked on the same shelf as the crocks, because in
> this house there is nowhere better to put them.

O-Hisa: "Bracken is bitter and it is worse than bitter. Cold ash out from
under the pot, water off the boil poured over it, the greens in that till
morning. Then boil them and throw the water out, and boil them again and
throw that water out too. What is left is food. It wants a fire, a pot,
and somebody who will not wander off in the middle of it."

O-Hisa: "The fire is here. The pot is here. Neither of them leaves this
threshold, so neither does the man who wants them used — you stand where
the pot is or you eat your rice cold, the same as you have been."

O-Hisa: "And you will want it hot. A man comes in off a bad night with
something torn in him and thinks lying down will put it back. Lying down
puts nothing back. Sōan will bind what is broken; putting the flesh back
on your bones is this pot's work and there is no other pot."

### ask sb-cook-ask-a · "Why can I not eat it raw?"

O-Hisa: "Because it is bracken. Eat it as it comes off the hill and you
are two days no use to anybody, and the two days are worse than the hunger
was — I have watched a hired man learn it, and I have scrubbed the step
after. Everything that grows up there wants boiling before it wants
eating. That is the hill. It is not a rule I made up to keep you here."

### ask sb-cook-ask-b · "Why must it be your pot?"

O-Hisa: "Because it is the only one, and because a fire anywhere else on
this yard is a fire in the thatch. The woodshed is dry as tinder and you
sleep in it. When you have a hearth of your own you may boil what you like
on it, and if it comes to that — well. Until then the pot is here."

### decide · The greens are on the step, going over.

#### sb-cook-learn · "Show me the ash-water."

O-Hisa: "Then stand where you can see. Cold ash, one fist — more than that
and it comes out tasting of the hearth. Water off the boil, not on it. You
will do the second boil yourself and you will do it badly the first time.
A man who can feed himself does not have to wait on anybody's kindness,
and if a year from now you are still — well. Mind the rim, it catches."

memory: ohisa +1 (learns-the-pot)
flags: taught-to-cook

#### sb-cook-thanks · "Cook them. I'll take the bowl."

O-Hisa: "I will cook them. Come at the hour I give you and hold the bowl
out with both hands, because it will be too hot for one and I am not
scrubbing this step twice in a season. It is greens. Do not go looking for
anything in it past greens."

memory: ohisa +0 (takes-the-bowl)
flags: taught-to-cook

## scene-def sb-racks
trigger: scripted
once: true
speaker: rokusuke
voice: villager

> The drying rack stands at the paddy's end: two forked posts, a
> cross-pole, and the straw cords that hold the sheaves up off the wet.
> You count the cords, because counting is the reading you trust. Three
> gnawed clean through. One chewed halfway and holding. The pole is down
> at the near end and last night's sheaves are lying in the mud beneath
> it, half of them stripped and scattered wide.

> The mud has kept what did it. Five toes and a long claw-mark ahead of
> each, crossing and doubling and crossing again — and a dragged furrow
> going away from the rack toward the field's edge, where the ground lifts
> and the grass has not been cut in years.

> The furrow does not stop at the last worked row. It goes on into the
> margin and ends at a hole in the bank that you can see from where you
> stand, and have never once walked out to.

> Rokusuke is working the row over from yours. He straightens when your
> shadow crosses his water, and looks at the rack, and then at the blade
> Kihei hung on your hip, and then back at the rack.

Rokusuke: "Tanuki, mostly. Badger for the digging — that hole is dug, not
worn. The board writes down the sheaves, and the sheaves is what the board
wants written. Nobody has written down the hole."

> He takes hold of the fallen pole and lifts it back up onto its fork,
> where it sits, and does nothing at all, because the cords are still cut.

Rokusuke: "There. That's the rack seen to."

### ask sb-racks-ask-a · "How many nights has it been?"

Rokusuke: "Three. Four, if you count the night they only chewed the cords
and carried nothing off — I don't count that one, and I'd thank you not to
count it to the board either. Sheaves lost: eleven, near enough; I'd say
eleven. I keep a count of what crosses my hands. Keeping a count and
telling somebody are two different jobs and only one of them is mine."

### ask sb-racks-ask-b · "What's out there, past the bank?"

Rokusuke: "Setts. Old ones. The holes go in under the grass and come out
somewhere else, and there's one at the far end that was there before I
was. Drying racks all along that side — ours, and O-Ume's; she has her
plot at the worst of it and she is out among it at first light, every
light. That ground has never been anybody's work. So nobody has ever done
it."

### decide · The rack. The furrow. The hole in the bank.

#### sb-racks-take · "I'll walk the margin tonight."

Rokusuke: "You'll walk it. That's right — you're the one wearing the
blade. Take a light and carry it low; they come out in the dark and they
come out where they have always come out. And if it's asked after, the
rack fell. I'll have said the rack fell. It did fall."

memory: rokusuke +1 (walks-the-margin)
flags: racks-raided

#### sb-racks-ask · "Whose ground is that? I'll ask before I dig it."

Rokusuke: "Ask, then. O-Ume is at the edge by first light and the steward
is at his board after. Go into that ground with somebody's yes behind you
and it is their ground you dug, not yours, and their sheaves you were
saving. It is slower. That is how a man keeps a place here."

memory: rokusuke +0 (asks-first)
flags: racks-raided

## scene-def sb-sickroom
trigger: scripted
once: true
speaker: soan
voice: physician

> The rag was your sleeve. You tore it at the seam, wound it twice around
> the ribs, pulled the knot with your teeth because the left hand had
> stopped being any use to you, and it went through in the dark. You wound
> a second layer over the first. It has gone through that as well, and the
> wet edge of it is still spreading while you look down at it.

> A half-breath goes in. A whole one catches on something low on the right
> that grinds, so you have stopped taking whole breaths.

> There is blood dried on the kura's sill in a smear the length of your
> forearm. Most of it is yours. The rice behind the door was not touched.

> Sōan crosses the yard at the pace he does everything and crouches, and
> does not ask how you feel. He takes the wet edge of the wrapping between
> two fingers, and looks at what comes away on them, and looks at it for
> longer than you would like.

Sōan: "Which side did it put you down on, and did you get up by yourself?"

You: "The sill. I got up."

Sōan: "Then they are cracked and not driven in, or you would not have got
up and you would not be answering me in whole words. That is the best
thing I will say today. The rest is that your wrapping is a sleeve, and a
sleeve does not close a wound. It drinks."

Sōan: "There is a lean-to off the outer court, north side, with a door
that does not latch. Boiled water, clean cloth, a board to lie on, and
light enough to see by. You have been in it. They carried you up from the
weir on a door taken off its runners and you were never awake for the
room — which is why you are sitting in a yard, bleeding, forty paces from
the only place on this estate that can stop it."

### ask sb-sickroom-ask-a · "What are you writing?"

> He has the ledger open on his knee and the brush already wet. He is
> writing while he speaks, which is not a thing a man does unless he means
> to.

Sōan: "When did the bleeding slow? — Then it is slowing, and that is your
answer, and it is the only one you need while you are upright. The book is
mine. It holds how fast a man knits and where. It is a physician's
business."

> The book is shut before you have finished looking at it. He does not
> hurry it shut. He simply closes it.

### ask sb-sickroom-ask-b · "And if I don't get up next time?"

Sōan: "Then you are carried, and the door comes off its runners again, and
four men bring you to the room I have just told you about. It has no lock
and it never had one. What it takes from you is days — the work not done,
the season going on outside without you, a man on a board counting the
roof-beams. Now stop talking and breathe out."

### decide · Forty paces, and a door that does not latch.

#### sb-sickroom-mend · "Take it off, then. Do it properly."

Sōan: "Sit. Arms down — I will lift them when I want them lifted. Six days
wrapped if you are dull about it; three weeks if you are clever. Hold
still now, and understand that I am about to hurt you and that it will not
be an accident."

memory: soan +1 (holds-still)
flags: tended-by-soan

#### sb-sickroom-refuse · "It'll knit. The rice won't."

Sōan: "It will knit. Bone does that whether the man consents to it or not
— crooked, if it is carrying sacks while it works, and crooked is for
life. Go back to your grain, then. The door is where I said it is, it does
not latch, and I am behind it most hours. I will write down that you were
offered."

memory: soan +0 (walks-it-off)
flags: tended-by-soan

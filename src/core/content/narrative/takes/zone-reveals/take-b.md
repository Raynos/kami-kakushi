## scene-def sb-market
trigger: scripted
once: true
speaker: genemon
voice: steward

<!--#the-errand-at-the-board-is-->
> The errand at the board is finished and you are still standing at it, because
> your hand is shut around the first coin the work has put in it and there is
> nowhere in this yard to open it.

<!--#genemon-does-not-look-up-when-->
> Genemon does not look up when you come to the board. He does not look up when
> you fail to leave it. Then he does — at the fist, not at the face.

<!--#something-crosses-the-steward-s-face-->
> Something crosses the steward's face that you have not seen on it before,
> quick, and gone the way a spark goes off a wet stone. He dips the brush and
> writes a line the day does not need.

<!--#thirty-one-years-i-have-kept-this-->
Genemon: "Thirty-one years I have kept this house's book, and every hand I ever
paid stood in that spot holding it exactly as you are. Open your hand before you
sweat the copper green."

<!--#you-open-your-hand-the-coin-->
> You open your hand. The coin has gone a little green already.

<!--#there-is-nothing-inside-these-walls-->
Genemon: "There is nothing inside these walls that will take it from you. The
house pays in rice and eats what it grows; coin in this yard is coin standing
still. The gate is where the outside comes to us — Yohei sets his mat in the
gateyard two days in seven, with greens and wood and a hone and whatever the
season left on his cart. Twice a year a monk sleeps under that same roof-beam
and asks for nothing. That is the whole of the world that calls here."

<!--#he-is-back-in-the-book-->
> He is back in the book before he has finished saying it, which is how the
> steward leaves a room without moving.

### ask sb-market-ask-a · "Do you buy from him yourself?"

<!--#once-a-hone-my-first-season-->
Genemon: "Once. A hone, my first season keeping this book. I paid a stranger's
price for it because I did not yet know how to stand at a stall. I have it
still. I have not needed a second."

<!--#that-is-more-of-himself-than-->
> That is more of himself than the board has ever handed you. He closes it off
> by ruling a line under nothing.

### ask sb-market-ask-b · "Is it mine to spend?"

<!--#it-came-out-of-the-work-->
Genemon: "It came out of the work and the book knows which work. Nobody in this
house will ask you for it, and I will not ask you what you did with it. That is
the whole of what yours means here."

<!--#he-writes-nothing-down-it-is-->
> He writes nothing down. It is the only answer he has given you that the book
> had no room for.

### decide · The coin is warm in your open hand.

#### sb-market-go · "Then I'll go on his day, and count it in front of him."

Genemon: "Do that. Yohei prices a stranger once and a regular ever after, and he
decides which you are at the first coin, not the fifth. Count it out where he
can watch your hands doing it — and do not thank him for the price. He will put
it back up."

memory: genemon +1 (counts-his-coin)
flags: told-of-the-stall

#### sb-market-hold · "It keeps. Copper doesn't spoil."

Genemon: "It does not. And a man may hold the first thing he has ever owned as
long as it pleases him; I will not enter an opinion on it. The stall stands at
the gate two days in seven, on its own days, whether or not you come to it."

memory: genemon +0 (keeps-his-coin)
flags: told-of-the-stall

## scene-def sb-cook
trigger: scripted
once: true
speaker: ohisa
voice: steward

<!--#the-greens-have-been-in-your-->
> The greens have been in your fist since the woodlot — fern-shoots, a knot of
> butterbur, bitter enough to smell from where you hold them. You are standing
> in the middle of the forecourt with nowhere to put them and no reason to carry
> them further, and one of them is already halfway to your mouth.

<!--#across-the-yard-at-the-kitchen-->
> Across the yard, at the kitchen threshold, O-Hisa stops with a wet pan in her
> hands. She does not come out into the yard. Anyone in this house could tell
> you that: the yard is where the hands are, and she keeps the threshold.

<!--#she-comes-out-into-the-yard-->
> She comes out into the yard.

<!--#not-raw-bracken-raw-will-take-->
O-Hisa: "Not raw. Bracken raw will take the lining out of a man's—"

<!--#she-takes-the-greens-out-of-->
> She takes the greens out of your hand. She does it the way she takes a knife
> off the boy: without asking, and without any hurry at all.

<!--#nobody-has-shown-you-of-course-->
O-Hisa: "Nobody has shown you. Of course nobody has shown you. You have eaten
whatever was set in front of you since the spring, and not one person in this
house has thought to ask what you would do the day it wasn't."

<!--#there-is-a-pot-on-the-->
O-Hisa: "There is a pot on the fire at the threshold from first light to dark.
Wood-ash out of the hearth, a hard boil, then it stands until it has stopped
fighting you — an hour, near enough, and then it is food. A hot bowl puts a man
back on his feet after a beating and a cold one leaves him where he fell. I have
watched it do both."

### ask sb-cook-ask-a · "Why come out for it?"

<!--#she-looks-at-the-greens-and-->
> She looks at the greens, and not at you, long enough that you think she has
> decided against answering.

<!--#because-i-have-watched-a-grown-->
O-Hisa: "Because I have watched a grown man eat standing up in that yard, out of
his fist, every day since the spring — and today he was going to put something
in his mouth that would have—"

<!--#it-is-not-a-thing-a-->
O-Hisa: "It is not a thing a person can watch. That is the whole of it."

### ask sb-cook-ask-b · "Whose pot is it?"

<!--#the-house-s-mine-at-the-->
O-Hisa: "The house's. Mine at the hours I stand over it, which is most of them.
O-Yae carries the water up from the well and carries the talk back down again,
and the boy will be at your elbow asking you things nobody has answered him
either. Mind him. And mind the lid — he steals the lid."

### decide · The greens are in her hands, and she is waiting.

#### sb-cook-learn · "Show me the ash and the boil."

O-Hisa: "Come to the threshold, then, and stand where I put you. You hold a
ladle like a man holding a rake, and I'll not have that in my kitchen — so. Like
that. A man who knows the pot can keep himself, if there is ever nobody to—
well. Come. It's on the fire."

memory: ohisa +1 (learns-the-pot)
flags: taught-to-cook

#### sb-cook-thanks · "The bowl, then. Thank you."

O-Hisa: "Don't thank me for a pot that was boiling anyway. Sit at the threshold
and eat it hot — hot, not warm; there's a difference, and it is the whole of
what the pot is for. And leave the fist for the field. A man who eats out of his
hand ends up eating like one. Sit down."

memory: ohisa +0 (takes-the-bowl)
flags: taught-to-cook

## scene-def sb-racks
trigger: scripted
once: true
speaker: rokusuke
voice: villager

<!--#the-rows-mid-morning-rokusuke-has-worked-->
> The rows, mid-morning. Rokusuke has worked the row over from yours since the
> spring — near enough to hand a tool across, and no nearer — and in all that
> time he has said nothing to you that the work did not say first.

<!--#he-straightens-he-looks-once-at-->
> He straightens. He looks once at the blade on your hip. Then he looks, for a
> good while, at your feet.

<!--#you-walk-the-top-of-the-->
Rokusuke: "You walk the top of the bund. Every man in this field walks the low
side, out of the wind, where the mud holds him. You've walked the top since the
day they put you in the rows."

<!--#i-don-t-say-it-s-->
Rokusuke: "I don't say it's wrong. I watch where a man puts his feet, is all.
It's not a thing I'd carry to the board."

<!--#the-drying-racks-at-the-far-->
Rokusuke: "The drying racks at the far end are stripped again. Third night
running — sheaves down, and the seed store's been at. It isn't birds. There's
holes under the bank where the worked ground stops: setts, badger and tanuki
both, dug out wider this year than last. That strip is the margin. It's nobody's
ground and nobody's job, and you could stand on it from where you're standing
and see the racks."

<!--#i-don-t-tell-the-steward-->
Rokusuke: "I don't tell the steward. The man who tells him what's gone is the
man who was there when it went — that's the yard's arithmetic and it has never
once been wrong. You've a blade, and you walk the top of the bund. Do as you
like with it."

<!--#old-o-ume-s-plot-borders-the-->
Rokusuke: "Old O-Ume's plot borders the worst of it. She'll not say a word
against them either. She thanks the kami for what's left standing and calls that
a good year."

### ask sb-racks-ask-a · "Why tell me?"

<!--#he-bends-back-to-the-row-->
> He bends back to the row to answer, so that anyone watching from the forecourt
> would see two men working and one of them talking to the mud.

<!--#you-re-not-of-this-house-->
Rokusuke: "You're not of this house. Nor am I, twelve years in. A man tells his
own kind, and then he says he never told anybody, and both of those are true
enough to live with."

### ask sb-racks-ask-b · "A season is a long time to watch a man's feet."

<!--#it-s-how-i-ve-kept-->
Rokusuke: "It's how I've kept a place here twelve years while better hands went
down the road. The noticed hand is the blamed one. So I do the noticing, and I
keep it where the board can't reach it."

### decide · The margin is a hundred paces off, and nobody is watching it.

#### sb-racks-take · "I'll walk the margin tonight."

Rokusuke: "That's right, that's right. Setts on the bank side, racks on the
paddy side, and the wind comes off the water, so they'll not hear you coming.
— I never said any of it. You've eyes of your own. You'd have got there."

memory: rokusuke +1 (walks-the-margin)
flags: racks-raided

#### sb-racks-ask · "The steward should hear it first."

Rokusuke: "The board's the board. Tell him, then, and tell it as your own — you
saw the racks, you saw the holes, you counted the nights. Leave my name out of
the telling. It's a small name and it doesn't stand being written down."

memory: rokusuke +0 (asks-first)
flags: racks-raided

## scene-def sb-sickroom
trigger: scripted
once: true
speaker: soan
voice: physician

<!--#you-sat-down-when-it-was-->
> You sat down when it was over and you have not stood up since. It got light
> while you were deciding whether to.

<!--#soan-comes-across-the-outer-court-->
> Sōan comes across the outer court with his sleeves already tied back and his
> box under his arm. Nobody sent for him. You did not call out, and the yard has
> not been told anything.

<!--#breathe-in-for-me-all-the-->
Sōan: "Breathe in for me. All the way in — and don't help me. I can see you
doing it."

<!--#he-sets-two-fingers-under-the-->
> He sets two fingers under the rib, and you find out what last night did.

<!--#cracked-not-sprung-i-have-had-->
Sōan: "Cracked, not sprung. — I have had this body on my mat once already, so I
will tell you a thing nobody else in this valley can. I know what your ribs were
like when they were whole. I know what your hands were like before the rake got
at them. You have no memory of those four days. I have all four."

<!--#behind-him-on-the-shelf-where-->
> Behind him, on the shelf where he sets his box down, there is a ledger. He
> does not open it. When you look at it he moves, so that it stands behind him,
> and goes on talking.

<!--#off-the-outer-court-there-is-->
Sōan: "Off the outer court there is a lean-to: a bench, a brazier, and a door
that does not lock. It is where they carried you the morning the river gave you
up, and you have never once walked into it on your own feet. Walk into it today."

### ask sb-sickroom-ask-a · "How long was I on the mat?"

<!--#four-days-you-woke-on-the-->
Sōan: "Four days. You woke on the fourth and asked for water before you asked
for your name — which told me more about you than the fever did."

<!--#he-says-it-without-looking-anything-->
> He says it without looking anything up.

### ask sb-sickroom-ask-b · "Why come out to me? Men come to you."

<!--#they-do-not-a-man-with-->
Sōan: "They do not. A man with a cracked rib sits down on the nearest thing to
hand and calls it resting, and by the third day he has a fever and a story about
how it was nothing. I have been fetching men off sills for thirty years. You are
not even an interesting case."

### decide · He is waiting to be argued with.

#### sb-sickroom-mend · "Do what you have to. I'll hold still."

Sōan: "Then hold still, and go on holding still when it stops being easy.
Wrapped, not bound — a bound rib is a lung fever waiting on a cold night.
Willow bark morning and evening, food hot and never cold, and six days of my
bench. Come on all six. The men who come on five are the men I see twice."

memory: soan +1 (holds-still)
flags: tended-by-soan

#### sb-sickroom-refuse · "It's cracked, not broken. There's work."

Sōan: "There is always work. There was work the morning they carried you off the
weir, and the work waited. — Walk it off, then. The lean-to is off the outer
court, past the well-path; the door does not lock and I do not ask twice. On the
third night you will find you cannot lie down. They always come on the third
night, and always at an hour that suits nobody."

memory: soan +0 (walks-it-off)
flags: tended-by-soan

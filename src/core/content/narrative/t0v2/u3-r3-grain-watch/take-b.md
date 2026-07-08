---
unit: u3-r3-grain-watch
take: b
stance: the held breath — grief close under the surface; warmth priced and
  rationed; human detail forward; what people almost say
covers: t0.md ladder row R3 · the Kura exterior & grain-store zone · the
  Night rounds mini-dungeon (first-round quest, rats → marten → wolf
  escalation, fall-to-sickroom, the new-moon lantern) · the wolf night and
  the dawn-after rung beat
---

<!-- STAGED, NOT COMPILED (t0v2 wave). FB-5 grammar throughout so migration is
  git mv + regen. Registry need before compile: O-Hisa has no NAMES/voices
  entry yet (spoken here as `O-Hisa (steward):`). Toku is deliberately never
  named — the lantern stays a sighting; its authored answer is the packet
  (R5). The kura crest's authored answer is the old seat's crest (T2). The
  unconfessed seed-bale count is R4's confession — seeded here, never spent.
  One maxim in this unit, Kihei's, in the watch-set scene; the dawn beat
  carries none. -->

## dialogue watch-set · drillmaster
unrouted: routed by the first-night-round quest at rewrite (native — see the
  engine contract at the foot of this file)

<!-- Kihei sets the grain-watch. Fires at the gate post before the first
  round: the fiction that produces the begin-the-night-round action. Rats at
  the harvest stores are the need; the round is his design. -->

### line watch-1
voice: arms

Rats are in the store. Harvest brings them; the cold keeps them. Every night
they eat, the house pays for a watch it isn't keeping. From tonight it keeps
one. You.

### line watch-2
voice: arms

The gear is at the post. A lantern, a boar-spear older than you, and the bar
for the kura door — the bar goes down before you walk, not after. Gate,
forecourt, kura, the paddy path, back to the gate. In that order, every
round, every time. A watch that wanders is no watch.

### line watch-3
voice: arms

Rice draws rats. Rats draw the thing that eats rats. Stand where the rice is
long enough and you will meet everything in this valley, in order of teeth.

### line watch-4
voice: arms

You finish at the gate, or Sōan finds you where you dropped. Aim for the
gate. Go.

## prose flavor

<!-- Zone + round texture. Keys bind at rewrite; one paragraph per key. -->

### kura-day

The kura is the one building on the estate kept like it matters — walls
limed, floor swept, the door bar worn smooth with use. Above the door the
seal-plate carries the house crest with one more petal than the gate's. You
counted twice. Nobody reads it aloud.

### night-round-post

The watch post is a stool, a hooded lantern, and the boar-spear leaning
where Kihei left it. The round begins when you lift the lantern, and ends
when you set it down here again.

### night-round-rats

Rats in the store, where Kihei said. You learn the sound grain makes when
something small is stealing it — a dry whisper under the floor, gone the
moment you stop walking. The spear-butt does the rest. In the morning you
sweep up what they spoiled and say what you took. The number is never
nothing.

### night-round-marten

The thing that eats rats came, as promised: a marten, quick as spilled
water, dead by more luck than spear-work. Behind the back bales, where it
hunted, you find what the rats had all along — a seed-rice bale gnawed open
at the seam, half gone into the walls. You make the count alone, by lantern,
twice. It does not improve the second time. You bar the door on it and tell
no one yet.

### night-round-quiet

Nothing moves in the store tonight. No whisper under the floor, no scratch
in the walls. The rats are gone, and you did not take them. Whatever quiets
rats is not smaller than a rat.

### night-round-wolf

At the kura door the lantern finds two eyes at the height of your waist,
and the dark around them is the wrong shape for a dog. The bar is behind
you. So is the rice.

### night-round-new-moon

On the dark of the moon a lantern crosses the far edge of the yard — hooded
low, held steady, going upstream. By the time the round brings you back the
yard is empty, and in the morning no one has missed a lantern. It is not
your watch's business. You watch for it anyway.

### night-round-fall

You wake on Sōan's mat with daylight standing in the wrong place. Days gone,
and the wages with them. He asks one question, writes two lines, and closes
the ledger when you turn your head.

## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: post-grain-watch, action-night-round-repeat
<!-- motivate ids bind at rewrite: the grain-watch post becomes his; the
  night round is repeatable, Kihei's and the MC's alone from here. -->

> Dawn comes grey through the kura door. The blood on the sill has dried
> black, and most of it is yours. Inside, the rice sits in its rows,
> untouched, exactly as it was put. Sōan has strapped your ribs so tight
> that breathing is a decision.

> Kihei crouches at the sill a long time, reading the blood the way Genemon
> reads a column of figures. The trail goes west, into the trees, in drops
> that get no smaller.

Kihei: "…Alive. Good."

> For a moment there is more in him than the verdict. He checks the broken
> bar instead.

> Genemon stands in the doorway. Whatever he came to say, he writes
> something in the day-book first.

Genemon: "Screen, one, torn. Bar, one, broken. Grain — none lost. Hand,
one. Standing."

> None lost. You think of the gnawed seed-bale at the back wall, and the
> count you made twice by lantern, and you do not correct him. Not yet.

Genemon: "The bar was old. It goes against the house, not your wage."

### ask r3-wolf · "Will it come back?"

Kihei: "It left more blood past the woodlot than a wolf keeps spare. If the
winter doesn't finish it, it remembers this door. So do you. That makes you
even."

### ask r3-ribs · "How long?"

Sōan: "Breathe to the bottom of it. …No. Cracked, then, not broken. Three
weeks strapped, nothing heavier than the lantern, and you come to me before
you decide you are healed."

> He writes a line in his ledger and closes it when you turn your head.

### ask r3-rice · "The rice?"

Kihei: "Where it was put. Last night's, at least. The rest is the board's
arithmetic, not mine."

### decide · What do you do about the wolf?

#### r3-track · "It bled going west. The trail is fresh."

Sōan: "And you can chase it exactly as far as I can throw you. Sit down.
It is winter's business now, not yours."

memory: kihei +1 (spine)
flags: r3-track

#### r3-hold · "It knows this door now. So do I. I'll be at the sill."

Kihei: "Then mend the bar before dark, and take the long spear this time.
Eat first."

memory: kihei +1 (steady)
flags: r3-hold

#### r3-mend · "The bar first. Then the wolf."

Genemon: "The bar, the screen, then the tally. I will enter the wood
against the house."

memory: genemon +1 (careful)
flags: r3-mend

> Kihei stands, takes the boar-spear off the sill, and puts it back in your
> hands, butt first.

Kihei: "You didn't win. The house lost nothing. Keep the watch."

> By evening the padded coat is folded at the woodshed step, the torn
> shoulder closed with stitches smaller than the tear deserved. O-Hisa is
> still three steps from the kitchen when you come round the corner, caught.

O-Hisa (steward): "It tore clean, at least. If the ribs knit as straight —
well."

> She is back inside before you find anything to say to that.

## native · night-rounds engine contract

<!-- No FB-5 form exists for a mini-dungeon; this block names what the
  engine must provide. Structured scene data lives here so the rewrite can
  lift it whole. -->

- native: a "begin the night round" action at the gate post (its flavor key
  `night-round-post`). First run is a quest routed through the `watch-set`
  dialogue; every later run is repeatable.
- native: on-rails round through zone night-states, fixed order — gate →
  forecourt → kura → paddy path → gate. The round ends at the gate (done)
  or on a fall.
- native: escalation staging — early rounds seed rats (`night-round-rats`);
  after the rat rounds the marten fires once (`night-round-marten`, sets
  flag `r3-bale-count` — the unconfessed loss R4's board scene spends); one
  quiet round follows (`night-round-quiet`); then the wolf encounter fires
  once, gated on rung progress, as the R3 climax (`night-round-wolf`).
- native: the wolf fight is scripted survived-not-won — at a health
  threshold the wolf disengages bleeding and cannot be killed in T0 (it
  returns in T1, locked canon); the fight applies the cracked-ribs injury
  (low body, work capacity impaired for its healing window).
- native: a fall anywhere in the round carries the MC to Sōan's sickroom
  (`night-round-fall`) — days and wages lost, Sōan's closed ledger grows.
- native: on new-moon rounds only, the hooded-lantern sighting
  (`night-round-new-moon`) — non-interactive; the packet seed, unnamed
  until R5.

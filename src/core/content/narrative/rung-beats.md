<!-- The rung-up story beats (ADR-110), R1→R7 — the AUTHORING SOURCE OF TRUTH (FB-5).
  Compiled to src/core/content/rungBeats.gen.ts by `npm run gen:narrative`.
  Format spec: ./README.md. R0 has no beat — the intro IS the R0 beat. -->

## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-gate-forecourt, room-home-paddies, verb-farm, verb-haul,
  readout-clock, readout-stamina, panel-rung-ladder

> Dawn at the gate. The forecourt is swept clean — your doing — and Genemon
> waits by the posts, watching you the way a man watches weather.

Genemon: "You cleared the stores without being told twice. The house is short of
hands and shorter of trustworthy ones. Stay — you're no day-hire now. Earn your
rice."

Genemon: "The gate and the swept forecourt are yours to work now; stores come
and go here. The home paddies too — the rice that feeds the house. And the
kura's own repair is yours to tend: spend the house's small surplus to shore it
up."

> A pack-laden stranger has laid a mat in the lee of the gate-post — an Ōmi
> pedlar, come because a tended gate draws trade. He lifts a hand as you pass.

Tokubei (villager): "A tended gate's a lucky gate for a man with a pack.
Tokubei, of Ōmi — mind if I keep my mat here a while, young master? Coin of your
own spends as well as any lord's."

### decide · How do you take the keeping?

#### r1-dutiful · "The house has my hands."

Genemon: "...Good. Hands that don't need watching are the rarest thing I keep."

memory: genemon +1 (dutiful)
flags: r1-dutiful

#### r1-practical · "A roof and rice is a fair trade."

Genemon: "Honest, and cold. A fair trade it is — see that you hold your half."

memory: genemon +0
flags: r1-practical

#### r1-ambitious · "I mean to rise past a kept hand."

Genemon: "...Ambition, in a hand kept a day. Mind it doesn't outrun your worth."

memory: genemon -1 (ambitious)
flags: r1-ambitious

## rung R2 · rung-r2
speaker: rokusuke
voice: villager
motivates: tab-skills, room-woodlot-edge, room-near-satoyama,
  room-deep-satoyama, verb-woodcut, verb-forage, verb-face-wolf, row-wood,
  row-sansai, skill-conditioning

> The near hill in first light. Genemon leads you past the forecourt for the
> first time, out to where the woodlot meets the wild edge of the satoyama.

Genemon: "You can be set a task and trusted to finish it out of my sight — worth
more than a strong back. The woodlot and the near hill are yours to work now;
the house needs fuel and forage, and it trusts you to bring them in."

Genemon: "One more thing, and not a small one. A wolf's been at the grain stores
in the night. Someone must face it — and there is no one else to send. Think on
it."

> A lean man about your own age ambles up from the wood-stack, an axe on one
> shoulder, grinning as if you two already share a joke.

Rokusuke: "Rokusuke — kept on two winters back, so I know where the bodies are
buried. Do the work, keep your head down, don't let the old steward catch you
idle. That's the whole of it."

> Knotting a load for the woodlot, your fingers tie a porter's knot you never
> learned — quick, certain, a stranger's habit in your own hands. It means
> nothing. It will not leave you.

### decide · The wolf, and the man beside you — how do you take them?

#### r2-wolf-heeded · "The stores are the house's life. I'll face it."

Rokusuke: "...Huh. Most men find a reason to be elsewhere. You might do."

memory: rokusuke +0 (respected)
flags: r2-wolf-heeded

#### r2-rokusuke-friend · "Tell me how the house really runs."

Rokusuke: "Now you're talking. Stick with me and you'll know which pedlar cheats
and which steward's watching. Speaking of — old Tokubei keeps a softer price for
a friend. Tell him I sent you."

memory: rokusuke +1 (friend)
flags: r2-rokusuke-friend, pedlar-favour

#### r2-solitary · "The work's enough. I keep to myself."

Rokusuke: "Suit yourself. Offer stands, if you tire of your own company."

memory: rokusuke -1 (solitary)
flags: r2-solitary

## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level, panel-bestiary,
  panel-house-influence

> The drill yard behind the omoya, first light. You've stood over the
> grain-store wolf's carcass; word travels. A hard-faced man is already there, a
> bokken in each hand — and he throws you one without a word of greeting.

Kihei: "So. You put down the thing that had the run of our stores. Farmers don't
do that. There's a soldier in you under the farmhand — I've watched it a week
and I'm done pretending I haven't."

Kihei: "You're gate-watch now: a weapon, a yard to train in, and the estate's
defence on your shoulders — pests, beasts, and the masterless men who drift down
the woodlot road. Keep a field-guide of what you face; a soldier who knows his
enemy outlives one who doesn't."

### ask kihei-why-blade · "Why set me to the blade?"

Kihei: "The house has walls and no one to stand on them. A great name with an
empty granary draws wolves of both kinds. I'd sooner the man holding the gate be
one who chose to."

### ask kihei-road · "What's out on the woodlot road?"

Kihei: "Boar and wolf in season. And men — ronin, deserters, the leavings of
every lord's quarrel — who'll take rice off a house too weak to keep it. That
last is why you're really here."

### ask kihei-who · "Who are you, drillmaster?"
after: kihei-why-blade

Kihei: "A man who soldiered for a house that no longer exists. Genemon kept the
granary; I kept the walls. Ask me the rest when you've bled for the place."

### decide · How do you take up the blade?

#### r3-aggressive · "Show me how to end a fight fast."

Kihei: "Fast, he says. Fast gets you a spear in the back. But there's fire in it
— we'll aim it before it burns you."

memory: kihei -1 (eager)
flags: r3-aggressive

#### r3-disciplined · "Teach me to stand a watch."

Kihei: "...Good answer. A wall that holds is worth ten swords that swing wild.
Come at dawn — before the others."

memory: kihei +1 (disciplined)
flags: r3-disciplined
bonus: +1 agi — "Kihei drills you an extra dawn; your feet learn the watch. (+1
  AGI)"

#### r3-duty-not-glory · "I'd rather the paddies — but the house needs it."

Kihei: "Honest. I trust a man who'd rather not more than one who's hungry for
it. The house is lucky in you."

memory: kihei +1 (reluctant)
flags: r3-duty-not-glory

## rung R4 · rung-r4
speaker: genemon
voice: steward
motivates: readout-durability, panel-equipment, verb-repair, house-omoya

> Genemon meets you at the kura door with an iron key on a cord, worn smooth by
> other hands before yours.

Genemon: "The kura key. Mind the stores as if the rice were your own — from
today it half is. The house is forgetting you were ever a stranger. So am I."

> He walks you on to the woodlot smithy, where a bent old man coaxes an edge
> back onto a mattock. He doesn't look up.

Tōzō: "Tōzō. I keep the estate's iron. A blade you don't tend turns on you —
bring me the hides and the metal off what you kill, and I'll show you what an
edge wants. The forge is yours to use now; try not to ruin my fire."

Genemon: "And the omoya's shuttered rooms are aired and swept — the house rises,
and you'll walk floors the family walks. Don't let it turn your head."

### decide · How do you hold the key, and the house's surplus?

#### r4-thrifty · "Every grain accounted."

Genemon: "Spoken like a steward. Good — the house was bled white once by hands
that weren't."

memory: genemon +1 (thrifty)
flags: r4-thrifty

#### r4-generous · "Spend it on the house's needs — a mended kura feeds everyone."

Tōzō: "Hah — the lad'd sooner fix the roof than count the rice. Here: a
whetstone that's outlived three wardens. Keep your edge keen and it'll keep
you."

memory: genemon +0, tozo +1 (friend)
flags: r4-generous, smith-whetstone

#### r4-self-keeping · "Keep a little back for myself."

Genemon: "...I'll pretend I didn't hear that. See that I go on not hearing it."

memory: genemon -1 (self-keeping)
flags: r4-self-keeping

## rung R5 · rung-r5
speaker: kihei
voice: arms
motivates: stance-control, tab-quests

> Genemon calls you to the omoya's inner room — a place season-hands never see.

Genemon: "No longer a season-hired hand. From today you answer to the house day
and night, and it answers for you. The work is the same. The standing is not."

> Then he walks you out to the yard, where Kihei waits with two bokken and
> something that might, on another man, be a smile.

Kihei: "The standing means the house trusts your judgment now — so I'll trust
you with the last of it. Set your stance before a foe: press to end it fast, or
guard to outlast it. The call is yours, fight by fight. Show me you understand
the choice."

### decide · What stance do you make your own?

#### r5-stance-aggressive · "Press every fight — end it, don't outlast it."

Kihei: "The tiger's way. Fast and final. It'll serve — until the day it doesn't.
Mind that day."

memory: kihei +0 (aggressive)
flags: r5-stance-aggressive
stance: jodan

#### r5-stance-guard · "Guard first — a live watchman beats a dead hero."

Kihei: "The bear's way. Unglamorous. It's also why I'm old enough to teach you."

memory: kihei +1 (steady)
flags: r5-stance-guard
stance: gedan

#### r5-stance-adaptive · "Read the foe — the call changes fight by fight."

Kihei: "...The answer I hoped for and rarely get. There's a swordsman in you
now, not just a gate-watch. Chūdan — the middle. Everything opens from it."

memory: kihei +1 (adaptive)
flags: r5-stance-adaptive
stance: chudan

## rung R6 · rung-r6
speaker: chiyo
voice: steward
motivates: house-workshops, house-granary

> The omoya's formal room. Lady Chiyo sits behind a low table stacked with the
> house's ledgers, and studies you the way she'd study a column of figures that
> doesn't yet add up.

Chiyo: "So you are the river's foundling Genemon would not stop mentioning. Sit.
I've errands that need a hand I can trust with more than a hoe — ledgers
carried, messages run, the house's small business held close."

Chiyo: "The workshops wake again on the strength of your work — a forge, a
joiner's bench — and a second granary rises behind the kura. They fall under
your oversight now. You are being weighed for something larger than a servant.
Do not disappoint the scales."

### ask chiyo-need · "What does the inner house need?"

Chiyo: "Order. A great name is a heavy thing to carry with an empty purse — I
keep the two from crushing us. I need a man who does what's asked and asks
nothing back he hasn't earned."

### ask chiyo-trust · "Why trust an outsider?"

Chiyo: "An outsider owes no old faction and carries no old grudge. You are loyal
to this house or to nothing — and a man loyal to nothing is easy to read. I
prefer easy to read."

### ask chiyo-lord · "The lord — is he well?"
after: chiyo-need

Chiyo: "Shigemasa is old, and tired, and prouder than either. His heir Naoyuki
is young and wary and not yet ready to carry it. Between them the house needs
steady hands more than another sword. Remember that when the drillmaster fills
your head."

### decide · How do you serve the inner house?

#### r6-loyal · "The house's name is my name now."

Chiyo: "A large thing to say. Larger to mean. We shall see which you've done."

memory: chiyo +1 (loyal)
flags: r6-loyal

#### r6-ambitious · "I'd carry more than errands."

Chiyo: "Ambition. I neither trust it nor waste it. Carry the errands first; the
more comes to those who don't ask for it."

memory: chiyo +0 (ambitious)
flags: r6-ambitious

#### r6-discreet · "A steward's man keeps the house's silences."

Chiyo: "...Yes. That, more than the errands, is the post. You understand it
already. Good."

memory: chiyo +1 (discreet)
flags: r6-discreet

## rung R7 · rung-r7
speaker: shigemasa
voice: official
motivates: house-study

> The shoin — the lord's own writing-room, where the house's real business is
> done and few servants ever cross the threshold. Shigemasa is smaller than his
> name, and older, and his eyes miss nothing.

Shigemasa (official): "Come in. Sit — no, closer. I would see the man Chiyo and
Genemon and even that flint Kihei agree upon, which they have not done in twenty
years."

Shigemasa (official): "You came to us with no name and nothing in your hands.
Look what those hands have done — the kura full, the walls kept, the workshops
loud again. I admit you to this room. The measure of the House itself takes
shape before you now. Few servants ever stand where you stand."

### ask shigemasa-house · "How is a house weighed?"

Shigemasa (official): "Not in koku alone, though the granary matters. In its
name, its arms, its office, the memory it leaves. I have spent my life keeping
one pillar from pulling down the rest. Soon that reckoning will lie open before
you — and you will see how far a house can yet rise."

### ask shigemasa-of-me · "What would you have of me?"

Shigemasa (official): "More than I have the right to ask of a servant, and less
than I suspect you'll one day give. For now — carry the house's standing as if
it were your own name. Perhaps, in time, it will be."

### ask shigemasa-heir · "And your heir?"
after: shigemasa-house

Shigemasa (official): "Naoyuki. He is young, and he watches you already — not
all of it kindly. A house has room for an heir and an able man both, if both are
wise. See that you are the wise one; I cannot always be here to remind him."

### decide · How do you answer the lord?

#### r7-devoted · "I'll carry the Kurosawa name as far as it can go."

Shigemasa: "The house before the man. It is what I would have said at your age.
Whether it was wisdom or only habit, I have never decided."

memory: shigemasa +1 (devoted)
flags: r7-devoted

#### r7-ambitious · "A name can be made as well as served."

Shigemasa: "...Bold. To my face, no less. I'll not pretend it pleases me less
than the safe answer would have."

memory: shigemasa +0 (ambitious)
flags: r7-ambitious

#### r7-humble · "I only did the work in front of me."

Shigemasa: "And that, I think, is why it came to so much. Remember it when
louder men tell you otherwise."

memory: shigemasa +1 (humble)
flags: r7-humble

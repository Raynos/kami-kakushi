<!--
  STAGED — NOT COMPILED. Part of the T0 prose wave (ADR-139).
  gen-narrative reads only the six canon files + takes/; this directory
  is invisible to every gate until a take is picked and migrated.
-->

---
unit: u8-side-beats
take: b
stance: the held breath — grief close under the surface; warmth priced
  and rationed; human detail forward; what people almost say
covers: t0.md "Authored side-beats" whole — (1) Shinnosuke's grove ·
  (2) the first Bon · (3) the lease day · (4) the dog that stays ·
  (5) the crest question
---

<!--
  The grammar has no side-beat block kind, so each beat below is a
  clean structured scene block in FB-5 prose (>, speech lines, decide
  grammar where a decide exists), with a `native:` line declaring what
  the engine must provide. Speaker names are new-canon and expected to
  resolve through NPC_NAME at migration (shinnosuke, ohisa, kihei,
  genemon, matsuzo, iori, toku, oyae, rokusuke are the ids assumed).
-->

## beat sb-grove · Shinnosuke's grove
speaker: shinnosuke
native: side-beat trigger — fires on a bamboo-grove patrol between R2
  and R4 (once). The decide's O-Hisa/Kihei reads land LATER, in their
  own nodes, off the flags below — the engine must carry the flag into
  the kitchen and drill-yard ambient lines, not react in-scene.

> The grove, past noon. The troop is in the vegetable rows again, and
> the patrol is yours now, the way the yard's round became yours:
> nobody said so twice.

> The big male is not in the rows. He is on the path, between you and
> a boy who was told, by everyone, not to be here.

Shinnosuke: "I wasn't doing anything. Is it going to charge? Do they
charge?"

> The boy's voice is level. His hand, flat against the bamboo, is not.

> You put yourself where the path is narrow. The male weighs the two
> of you, finds the arithmetic bad, and goes up and over into the
> green. The rows are quiet. The boy does not move for a while, and
> you let him not move.

Shinnosuke: "You won't say I was here. Will you say I was here?"

### decide · The house will ask about the grove.

#### sb-grove-report · "You were here. I'll say so."

Shinnosuke: "Fine. Fine. They don't listen when I talk anyway. Maybe
they'll listen when you do."

> He goes ahead of you the whole way back, so it is clear to anyone
> watching that he is not being brought.

flags: sb-grove-report
memory: shinnosuke -1 (told-on)

<!-- The delayed reads (native — kitchen + drill-yard ambient):
  O-Hisa, handing the boy's mended jacket past you that evening,
  stops in the doorway: "Thank you. Better he doesn't forgive you
  for a season than — well." — the soft one endorses the hard call.
  Kihei, at watch-change, unimpressed: "Boys go where they're told
  not to. Report the monkey." — the hard one shrugs it off. -->

#### sb-grove-cover · "I saw monkeys. Nothing else."

Shinnosuke: "Nothing else. All right. All right."

> He looks at you the way you'd look at a door left unlocked — glad,
> and already planning to use it.

flags: sb-grove-cover
memory: shinnosuke +1 (kept-quiet)

<!-- The delayed reads (native):
  O-Hisa knows by morning — the kitchen knows everything by morning —
  and says only, setting his bowl down a shade harder than the wood
  needs: "He's twelve." Kihei says nothing at all, and adds a second
  circuit of the grove to your round, which is Kihei saying it. -->

#### sb-grove-teach · "Stand still. Watch what I do."

> You walk him through it on the spot, twice: where the path narrows,
> what the male watches, why you never turn your back going out. He
> asks four questions and waits for no answers, and does it right the
> third time anyway.

Shinnosuke: "Nobody shows me anything. They just say don't. Why does
everyone only say don't?"

flags: sb-grove-teach
memory: shinnosuke +1 (shown-something)

<!-- The delayed reads (native):
  Kihei, days later, watching the boy stand his ground on the wall
  during drills, marks where the stance came from: "…Someone taught
  him to plant his feet." — the "…"-react, his alone, spent here.
  O-Hisa's read arrives at the woodshed doorstep, with your mended
  shirt, not quite looking at you: "His grandmother buried one boy
  who wasn't afraid of anything. If he stays a little afraid of the
  grove — well." She leaves before the sentence needs an end. -->

## beat sb-first-bon · The first Bon
speaker: genemon
native: calendar-bound side-beat — fires at the Bon season observance
  (Summer), any rung R2+. Two-part: the evening scene, then a one-line
  morning coda at the shrine-alcove corridor the next day. Iori's
  lodging and O-Ume's lanterns are ambient log texture the same
  evening (the log carries them; the VN carries the yard).

> Bon. The house has been three days sweeping for it. In the evening
> the household forms up in the forecourt, and everyone is given a
> thing to carry.

Genemon: "The tray, four bowls, O-Hisa. The lantern-pole, the boy.
Mats, two, Rokusuke. O-Yae carries the water."

> The day-book is open on his arm. He reads the list the way he reads
> every list, and your name is not in it, because the list is older
> than you are here, and Bon is for the house's dead, and you are not
> the house's.

You: "What do I carry?"

Genemon: "Nothing is entered for you. Mind the gate while we're at
the alcove."

> They file in past you. O-Hisa comes last, carrying the tray and,
> balanced across it, one lantern more than the tray has hands for.
> At the door she half turns — the lantern lifts an inch toward you —

O-Hisa: "The gate, then. If the wind stays down—"

> — and she is inside, and the door is shut, and whatever the wind
> was going to be allowed to mean stays with her.

> From the gate you can see the river bend. Small lights are going
> down it, one and then one and then one. The widow at the paddy's
> edge sets them loose the way other people set a table: for someone
> particular. At the gate itself the traveling monk sits with his
> bundle already tied, eating what the kitchen sent out, leaving
> tomorrow. He is the only other man on the estate carrying nothing,
> and he wants it that way, and you don't.

> Through the corridor door, once, when it opens for the tray: a
> narrow altar in a passageway, rites laid out full, and below them a
> pair of straw sandals set facing AWAY from the house. The door
> closes on it.

> The morning after Bon you pass the corridor with the water. The
> rites are cleared. The sandals are still there, facing away — and
> they are new. Nobody carries in new sandals for the dead.

<!-- Vague-but-parseable: the player knows WHAT (travel-sandals for a
  dead man, renewed, pointed away from home); the WHY is Katsuhide,
  authored, and holds until T1's register. The exclusion is felt
  friction (kernel #7 dramatized), never narrated as unfair — and it
  is not corrected: next Bon is not this beat's promise to make. -->

## beat sb-lease-day · The lease day
speaker: genemon
native: calendar-bound side-beat — fires once, in the season the weir
  lease falls due, rung R3+ (the MC present as household furniture:
  he carries the tea in and is not dismissed, which is its own small
  entry). Matsuzō must exist at the board for this scene only.

> Matsuzō comes up from the water on the lease day the way the lease
> day comes: on time, expected, and nobody glad. You are sent in with
> the tea and not sent out again.

Genemon: "The weir lease. One koku, two to, due at this sitting.
We hold the two to. The koku follows at harvest."

> He does not say the house is short. He has just said it, in item,
> count, and condition, to a weir-keeper, with the day-book open so
> the man can read the page upside down if he cares to. That is what
> it costs. The old man doesn't look at the book.

Matsuzō: "The screens held all spring. Your man's mending is tight
work. River's been kind this year."

Genemon: "At harvest, then. Entered."

> He writes it. Matsuzō drinks the tea and talks about water — where
> the current has moved since the thaw, which is perhaps his way of
> saying he has seen the house's current move too, or perhaps is only
> an old man talking about water. He leaves without the koku, and at
> the door he stops, not turning around.

Matsuzō: "Your grandfather's people paid early, in my father's day.
The river was different then."

> Genemon holds the brush still until the gate sounds. Then he
> finishes the entry.

<!-- The debt made a scene, not a stat (the locked three-stage rule:
  felt, never numbered, all T0). The sum named is the LEASE, which an
  NPC may name; the standing debt stays offstage. Matsuzō's exit line
  is his register — asked about people he answers about water, and
  the water answers about the house. -->

## beat sb-dog · The dog that stays
speaker: kihei
native: side-beat trigger — fires during the orchard reclamation
  chain, after the feral-dog stages clear. On the FED path the engine
  must provide: a recurring dog-rice sink entered in the day-book, a
  yard-dog presence at the gate node, and the new-moon night-round
  echo below (the bark fires only on this path).

> The orchard is cleared. The pack that denned in it is driven off or
> dead — except one: an old dog, grey to the jaw, lying against the
> base of a stone plinth that once held a lantern, in an orchard laid
> out by someone who expected lanterns. It did not run with the pack.
> Watching it stand, you can see why.

> It doesn't beg and it doesn't bare its teeth. It has simply decided
> where it lives, the way you once lay down in a woodshed.

Kihei: "Old dog. Say the word and it's done before you've turned
around. Kinder than winter will be."

### decide · The dog watches you decide.

#### sb-dog-drive · "Drive it off. The orchard's the house's now."

> It goes as far as the rope line and lies down there instead, on the
> public side, and looks at the orchard. It is there at dusk, and the
> next dusk. The third evening it is not, and you catch yourself
> checking the fourth.

Kihei: "It found somewhere. Or it didn't. Check the rope line less."

flags: sb-dog-drive

#### sb-dog-feed · "It stays. I'll feed it from my share."

> Genemon hears of it by the entry, as he hears of everything.

Genemon: "One dog. A quarter-share of rice, daily, against your wage
— the house does not keep what the house did not take on. If it
earns the yard, we'll see."

> So the estate gains a dog the way it gained you: fed thin,
> written down, and given a corner. It takes the gate as its post
> without being told the gate matters.

flags: sb-dog-feed
memory: kihei +1 (kept-a-watcher)

<!-- Rule 7 — the reads cross the grain: the ledger-man prices the
  warmth without blessing it; the hard man endorses it. Kihei, a week
  on, at watch-change: "A dog that barks is worth its rice. Yours
  hasn't yet. It will." -->

<!-- The echo (deliberate — the craft rule; at migration this hooks
  the night-rounds' new-moon wrong-thing as an @-reuse of that
  round's lantern line, escalated, never verbatim): on a new-moon
  round, the hooded lantern crosses the yard's far edge going
  upstream — and the dog, who has never barked at Kihei, at Yohei's
  mule, at the monkeys on the wall, stands and barks twice, at THAT.
  Nobody comes out. The lantern does not pause. The dog looks at you
  to see what you intend to do about it, and you mark that you are
  the only two on the estate who wonder aloud. -->

#### sb-dog-kihei · "You do it. I won't make it wait."

Kihei: "Go check the reed screens."

> He sends you out of sight first. That is the whole of his opinion
> on the matter, and it is not a small one. When you come back the
> plinth stone is bare and the ground beside it is turned, and no one
> ever tells you to dig there, ever, for anything.

Kihei: "It was old. It had a wall at its back at the end. Most don't."

flags: sb-dog-kihei

## beat sb-crest · The crest question
speaker: shinnosuke
native: side-beat trigger — fires at the kura exterior, rung R4+,
  after the player has stood at both the gate (crest board) and the
  kura seal-plate at least once (the question must land on something
  seen — TST4). Genemon's held brush needs him at the forecourt
  window within the scene's frame.

> Loading at the kura. Shinnosuke is on the sacks, where he is not
> supposed to be, reading the seal-plate above the door the way other
> boys read clouds.

Shinnosuke: "The kura's crest has one more petal than the gate's.
Count them. Why does the storehouse get more petals than the front
of the house?"

You: "I hadn't counted."

Shinnosuke: "I count everything, nobody else here counts anything.
I asked Grandmother — she started from 'the year the weir went' and
then just stopped. I asked Genemon and he said the kura keeps grain,
not answers. Why does everyone here know the same nothing?"

You: "I don't know."

> The boy looks at you for a long moment — checking the answer for a
> false bottom, the way he's learned to check every answer in this
> house — and finds none, because there is none. It is the plain
> truth, plainly short, and he has never once been given it before.

Shinnosuke: "You'd tell me if you knew. That's not the same as
nobody."

> Across the forecourt, at his window, Genemon has the day-book open
> and the brush lifted — a man who answers everything by writing
> something down, writing nothing. The brush stays up until the boy
> is off the sacks and gone. What the steward almost enters, or
> almost says, goes back into the ink.

> Above the door the extra petal keeps its own count.

<!-- The thread pays into T2's reveal (the old seat's crest, the
  quarried works — the answer is authored and waiting). Here it must
  only be felt: the house's silence has a SHAPE, the boy and the MC
  stand outside it together, and for the first time the mirror is
  named from the boy's side — not by the house, by him. -->

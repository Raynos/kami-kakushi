<!--
unit: u9-dialogue
take: take-c
stance: the-weather — kernel #7 forward. The MC is watched, misread, unowed;
  social cost and the world's indifference carry these lines. Nothing on the
  estate performs for him: his work is credited to heaven, his silence is
  read as debt, his one clue sits ignored because nobody asked twice.
covers: T0 cast-at-nodes ambient/node dialogue (t0.md "Cast at nodes" +
  04-cast.md portraits) — Genemon, Kihei, Sōan, O-Hisa, Shinnosuke, Naoyuki,
  Toku, Yohei, O-Yae, Matsuzō, Iori, O-Ume, Rokusuke. Munemasa is a voice
  through a wall in T0 and never met — deliberately absent from this sheet.

native: (1) a node-ambient line picker — the engine must route these defs to
  their NODES (each def below names its node in the id) and surface one line
  per visit, rung-/flag-gated, never the same line twice running. The FB-5
  grammar has dialogue defs but no node routing; every def carries
  `unrouted:` until that exists. (2) NAMES/voices registry entries for the
  new-canon cast before compile: yohei (pedlar rename: Tokubei→Yohei), ohisa,
  shinnosuke, naoyuki, toku, oyae, matsuzo, iori, oume — and the old-canon
  keys lord/mother/sister/etc. re-pointed at the sweep's names. (3) staged
  flags used below (r3-wolf, r5-cleared, r7-named, orchard-dog-fed) bind at
  the rewrite; names are descriptive placeholders.

Prose-law notes: Kihei alone owns the "…"-react (spent twice, both his).
  ZERO new maxims — the creed already spends his license at R4, and no line
  below reaches for a general truth. One deliberate echo: Matsuzō's "the
  river was quiet that night" is the banked T3 origin clue (04-cast.md),
  restated once, unasked-twice — an authored answer, not an ambiguity.
-->

## dialogue genemon-forecourt · elder
unrouted: node-ambient — awaiting node-talk routing

### line gen-rakes
voice: steward

Two rakes. One fit to use, one wanting a tooth. Take the fit one and leave
the other where my window can count it.

### line gen-firewood
voice: steward

Firewood: eleven bundles. Yesterday, thirteen. Either the kitchen answers
for two or you do. I'll know by supper which.

### line gen-hours
voice: steward

You work like a man with a sum against his name somewhere. I keep no other
house's books, so it's none of my page. Hours, then. The day-book wants your
hours.

### line gen-surprise
voice: narrator

{elder} says nothing to that. He opens the day-book and writes, unhurried,
and what he writes is not about the grain.

### line gen-named
when: r7-named
voice: steward

Gonbei. Third of that name I've entered, second I've kept past a winter.
The book doesn't care which you turn out to be. I confess I do.

## dialogue kihei-drillyard · drillmaster
unrouted: node-ambient — awaiting node-talk routing

### line kihei-stance

Shoulders down. Elbow in. Again.

### line kihei-held

…Held. Go eat.

### line kihei-left

You guard low and you give the left. Whatever it was you didn't do, you did
not do it here. Stance. Again.

### line kihei-boy

The boy's on the wall again. Let him watch. A yard that empties when it's
watched was never a drill yard.

## dialogue kihei-gate · drillmaster
unrouted: node-ambient — awaiting node-talk routing

### line kihei-watch

Bar it behind me. Count the lantern oil first, then the arrows we don't
have.

### line kihei-round
when: r3-wolf

The round's yours tonight. Sill to kura to reeds, and nothing past the rope.
…You know the sill.

## dialogue soan-sickroom · physician
unrouted: node-ambient — awaiting node-talk routing

### line soan-sleep
voice: physician

Did you sleep, or did you lie down? There's a difference and your eyes are
telling me which. Steam the barley longer. Chew it slower than you think it
needs.

### line soan-ribs
when: r3-wolf
voice: physician

Where does it catch when you breathe — there? Then bind it mornings only. A
rib heals crooked if you let it be comfortable.

### line soan-ledger
voice: narrator

{physician} closes the ledger before you are through the door. He does not
hurry about it, and he does not explain it.

## dialogue soan-weir · physician
unrouted: node-ambient — awaiting node-talk routing

### line soan-water
voice: physician

Are you drinking above the weir or below it? Above. Always above. I bury
fewer men the years the whole estate remembers that.

## dialogue ohisa-kitchen · ohisa
unrouted: node-ambient — awaiting node-talk routing

### line ohisa-rice

There's rice enough today. Tomorrow — well. Eat while it's hot.

### line ohisa-sleeve

Your sleeve was open at the shoulder again. If the thread holds through
harvest — well. Hold your arm still when you haul, that's all.

### line ohisa-bowl

Somewhere there'll be a bowl kept for you, I shouldn't wonder. Well. This
one's clean, anyway. Sit.

## dialogue ohisa-woodshed · ohisa
unrouted: node-ambient — awaiting node-talk routing

### line ohisa-step
voice: narrator

The coat sits folded on the woodshed step, mended at the shoulder, the
stitches small and even. Nobody knocked.

## dialogue shinnosuke-board · shinnosuke
unrouted: node-ambient — awaiting node-talk routing

### line shin-quiet

Do they stop talking when you come in? They do for me.

### line shin-grandfather

Why does grandfather never come out? Is it the room they don't open, or is
he the room they don't open?

## dialogue shinnosuke-wall · shinnosuke
unrouted: node-ambient — awaiting node-talk routing

### line shin-wolf
when: r3-wolf

Did the wolf look at you? Did you look back?

### line shin-flinch

Kihei says you flinch left. Why left? What's on your left?

## dialogue naoyuki-veranda · naoyuki
unrouted: node-ambient — awaiting node-talk routing

### line nao-grateful

The house is grateful for — . You worked. It was seen.

### line nao-brother

My brother kept those rows, before — . The rows are straight. Keep them so.

### line nao-cold

I had thought to say that the house — that we — . It's cold. Go in.

## dialogue naoyuki-count · naoyuki
unrouted: node-ambient — awaiting node-talk routing

### line nao-after
when: r5-cleared

What was said that night was — . The book cleared you. The book is what we
have. Let that be the end of it.

## dialogue toku-corridor · toku
unrouted: node-ambient — awaiting node-talk routing

### line toku-doors

The year the weir went, this corridor had doors at both ends. Mind the
draught. The draught is younger than you'd think.

### line toku-plums

We salted plums the summer the old lord's father died. Forty jars, that
year. There are three. Take none of them.

### line toku-moon

You came two days past the new moon. I keep the nights by their moons —
someone in this house must.

## dialogue yohei-stall · yohei
unrouted: node-ambient — awaiting node-talk routing

### line yohei-frame

Lowland rice is up, friend, and a man with shoulders like yours wants a
proper carrying-frame — six mon, and I'll do my weeping on the road.

### line yohei-thread

They say the pass road's washed out past the ford, which is why thread is
four mon the card, and you look like a man who mends his own — three, then,
and tell nobody.

### line yohei-regular
when: r5-cleared

Last market you counted my change back to me. For that the straw coat's
eleven, not thirteen. No, don't thank me — it's arithmetic.

## dialogue oyae-kitchen · oyae
unrouted: node-ambient — awaiting node-talk routing

### line oyae-river

They say in the village a man walked out of the river with no name in his
mouth. I'm not saying it. They say it.

### line oyae-autumn

The miller's wife says the house can't pay past autumn. Cook says the
miller's wife should mind her own stones. I only carry the buckets.

### line oyae-well

They ask me at the well what you're like. I say you rake. Well — you do.

## dialogue matsuzo-weir · matsuzo
unrouted: node-ambient — awaiting node-talk routing

### line matsu-newhand

The new hand? River's low for the season. The screens will show their gaps
by Bon, whoever mends them.

### line matsu-quiet

That night? The river was quiet that night. I've said so before. Nobody
asked twice.

### line matsu-lease

Your steward keeps the lease the way his old master did — to the day, short
or not. The water doesn't care whose name is on it.

## dialogue iori-gate · iori
unrouted: node-ambient — awaiting node-talk routing

### line iori-met

Well met, and I'm gone by the quarter moon. Is there rice water going spare?
No matter if not.

### line iori-peace

Peace on this gate until I pass it again. If I pass it again — the roads
decide that, not I.

### line iori-step

I've nothing you'd want and a road that wants me. The step costs nothing.
Sit, if you're sitting.

## dialogue oume-paddy · oume
unrouted: node-ambient — awaiting node-talk routing

### line oume-racks

The kami kept the racks whole this year — do you hear that, old man? Not one
sheaf down. Not one.

### line oume-plum

You'll take a plum. Not from me — the river owes you, and I'm only handing
it across.

### line oume-bon

His place is set. He was never one to miss rice over a little water.

## dialogue rokusuke-paddy · rokusuke
unrouted: node-ambient — awaiting node-talk routing

### line roku-right

That's right, that's right. Whatever the steward said, that's the way of it.

### line roku-weather

Cold for planting. — Aye, or warm for it, could be. You'd know better than
me.

### line roku-tally

Sixteen loads by my count. But if the board says fourteen, fourteen. The
board's the board.

### line roku-dog
when: orchard-dog-fed

You feed it, it's yours. That's how the yard reckons it, and the yard's not
wrong. Not saying it's wrong.

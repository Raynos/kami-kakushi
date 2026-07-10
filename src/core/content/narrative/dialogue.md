<!-- The dialogue registry (teach-by-reveal lines, ADR-039/ADR-063) — the AUTHORING
  SOURCE OF TRUTH (FB-5). Compiled to src/core/content/dialogue.gen.ts by
  `pnpm run gen:narrative`; the pure cursor + helpers stay in dialogue.ts.
  `when: <flag>` gates on a story flag; `when: <npc>.regard is|not <v>` on
  per-NPC memory. {key} interpolates NAMES entries. Spec: ./README.md.

  Two sections: (1) the INTRO-SUPPORT defs (teach-by-reveal — the interactive
  intro's cursor + intro.md reuse); (2) the U9 CAST-AT-NODES ambient mix (G4.1,
  per-character best-take pick — Genemon-A · Kihei-B · Sōan-B · O-Hisa-B ·
  Shinnosuke-B · Naoyuki-A · Toku-C · Yohei-B · O-Yae-C · Matsuzō-C · Iori-A ·
  O-Ume-C · Rokusuke-C). Node-talk routing is the rewrite's job; every U9 def
  carries `unrouted:` until then. -->

## dialogue genemon-open · elder
unrouted: intro-support (gen-greet reused by intro.md; teach-by-reveal cursor)

### line gen-greet
voice: steward

On your feet the fourth day — I have it written. I am {elder}, steward to the
{house}; what this house still holds, I keep counted. Your entry stands open:
one man, name unknown, condition poor. We finish it now.

### line gen-stores
voice: steward

Mind the floor before you mind your head. Half a season’s stores lie spilled and
trodden where the kura door gave way in the rains. Rice on the boards is rice
the house has lost — and this house has done losing enough for three lifetimes.

### line gen-rake
when: raked
voice: steward

So you put your hands to it. Rake what grain is still whole back toward the
basket, a fistful at a time. We reckon a samurai house’s worth in koku — a
year’s eating for one man — and every basket you save us is a measure we need
not go begging to the lord to make good.

### line gen-keep
when: raked
voice: steward

Clear it without my standing over you, and you'll have earned your rice and a
dry corner to sleep in. I'll make you no grander promise than that. In this
house, none of us holds one.

### line gen-kept
when: raked
voice: narrator

"...You don't shirk the work," {elder} says, eyeing the cleared boards and the
filling basket. "The house has had its fill of hands that do. Earn your keep,
and a place here is yours."

## dialogue kihei-intro · drillmaster
unrouted: awaiting-routing

### line kihei-1

{drillmaster}, master-at-arms — what's left of the office. I keep a drill yard
of warped poles and grey-haired men, and I wait on someone with the spine to
swing them.

### line kihei-2

When your legs will hold you and your head has stopped ringing, come and find me
there. A house at the frayed edge of the lord's favour needs more than farmhands
— and I would see what the flood left in your arms.

## dialogue soan-intro · physician
unrouted: awaiting-routing

### line soan-greet-grateful
when: soan.regard is grateful
voice: physician

{physician} looks up. "You came back on your own feet — I told you the wits mend
last. Sit. Let's see what's still bitter to steep."

### line soan-greet-curt
when: soan.regard not grateful
voice: physician

{physician} does not look up. "Still no patience for a physician, I see. Sit
anyway. This will sting, and you'll thank me later — or you won't."

### line soan-1
voice: physician

{physician}. I set what's broken and steep what's bitter, and I tell Asagiri
there are no kami abroad in the reeds, however much the village would prefer
there were.

### line soan-2
voice: physician

Your wits will settle as the swelling does — eat when there is rice, rest when
there is none, and don’t let the old women talk a fever into a haunting. That is
the whole of my craft, and the better part of my counsel.

<!-- ═══ U9 · cast-at-nodes ambient dialogue (G4.1 per-character mix) ═══
  Each character's def is VERBATIM from the picked take; node-talk routing +
  the flag-gate pass land at the rewrite. Flag vocabulary (unified across the
  mix — see the migration report): pupil (post-R4) · wolf-held (post-R3) ·
  named (post-R7) · pedlar-square (dealt honestly at the stall) · sb-dog-fed
  (the U8 dog side-beat's fed branch). -->

<!-- Genemon (take-A) — item, count, condition; his fled-debt read stays
  PRIVATE. Node: the Forecourt window / the board / the day-book. -->

## dialogue u9-genemon · elder
unrouted: t0v2-staged-node-talk

### line u9-gen-terms
voice: steward

Meals at the threshold. Straw in the woodshed. The rest when the day-book has
a reason to say more.

### line u9-gen-entry
voice: steward

One man, name unknown. That is the entry. An entry is amended when there is
something to amend.

### line u9-gen-tally
voice: steward

Straw: four bundles sound, one gone soft. The soft one is entered too.
Everything is.

### line u9-gen-purse
voice: steward

Sixteen mon out. Sixteen back, or the difference in goods, named. The book
takes either. It does not take short.

<!-- Kihei (take-B) — imperative, then verdict; the "…"-react is his alone.
  "The quiet lies." is the sheet's ONE ambient maxim (licensed, watch-ground).
  Node: the Drill yard / the Gate at watch-change. -->

## dialogue u9-kihei · drillmaster
unrouted: t0v2-staged-node-talk

### line kihei-gate
voice: arms

Bar the gate behind me. Count a hundred before you trust the quiet. The
quiet lies.

### line kihei-flinch
when: pupil
voice: arms

Lower. Again. You flinch before the blow, not at it — that's a memory, not
a fault. Again.

### line kihei-wall
when: wolf-held
voice: arms

You held the wall with cracked ribs and a rake. …Good. Tomorrow you learn
what would have held it cheaper.

<!-- Sōan (take-B) — a question, then a prescription; the closed ledger seeded
  by a narrator line (soan-ledger ported verbatim from take-C per redline 2).
  Node: the Sickroom / the Weir on his rounds. -->

## dialogue u9-soan · physician
unrouted: t0v2-staged-node-talk

### line soan-ribs
voice: physician

Does it catch when you breathe, or when you turn? Turn less. The wrap comes
off in six days; the habit of wincing you may keep.

### line soan-hands
voice: physician

Where did your hands learn rope? — No. Forget I asked it. Willow bark,
morning and evening, and stay off the wet stones at the weir.

### line soan-rounds
voice: physician

Sleeping? Dreams? — Mm. Salt, sleep, and no river wind after dark. The rest
mends on its own schedule, not mine.

### line soan-ledger
voice: narrator

{physician} closes the ledger before you are through the door. He does not
hurry about it, and he does not explain it.

<!-- O-Hisa (take-B) — a hope never finished aloud; her "if — well." is hers.
  Node: the Kitchen / mended things at the Woodshed doorstep. -->

## dialogue u9-ohisa · ohisa
unrouted: t0v2-staged-node-talk

### line ohisa-seam
voice: steward

The shoulder seam was going. It's done now. A shirt lasts years if someone —
it's done. It's on the step.

### line ohisa-warm
voice: steward

Eat while it's warm. A man fed at the same hour every day starts to look
like he belongs to — eat. It's getting cold.

### line ohisa-rice
when: named
voice: steward

If the rice holds this year — well. Hold your bowl out. Both hands.

<!-- Shinnosuke (take-B) — questions stacked two at a time, THE MIRROR. Redline
  1: voice narrator → steward (his own voice; taste P3/TST4). Node: the board /
  the Drill-yard wall / the grove. -->

## dialogue u9-shinnosuke · shinnosuke
unrouted: t0v2-staged-node-talk

### line shin-threshold
voice: steward

Why do you eat at the threshold? Did they tell you to, or did you guess it?

### line shin-book
voice: steward

Why does Genemon write you in the back of the book? Whose names are in the
front?

### line shin-wolf
when: wolf-held
voice: steward

Did the wolf look at you before it went? Was it sent, do you think?

### line shin-taken
voice: steward

When the river had you — was there a place? Could someone come back from it
after ten years, if there was?

<!-- Naoyuki (take-A) — two touches only in T0; formal, abandoned, restated
  flat and cold. NAMES-key `heir`. Node: the veranda. -->

## dialogue u9-naoyuki · heir
unrouted: t0v2-staged-node-talk

### line u9-nao-boards
voice: official

My father would have wished you — . The north boards want sweeping. Begin
there.

### line u9-nao-yard
voice: official

You keep the yard as if the house were — . It is a yard. Keep it.

<!-- Toku (take-C) — everything dated; the plum jars are the decline in four
  sentences, guarded. Node: the shrine-alcove corridor / the new-moon walk. -->

## dialogue u9-toku · toku
unrouted: t0v2-staged-node-talk

### line toku-doors
voice: steward

The year the weir went, this corridor had doors at both ends. Mind the
draught. The draught is younger than you'd think.

### line toku-plums
voice: steward

We salted plums the summer the old lord's father died. Forty jars, that
year. There are three. Take none of them.

### line toku-moon
voice: steward

You came two days past the new moon. I keep the nights by their moons —
someone in this house must.

<!-- Yohei (take-B) — news, flattery, and the price in one breath; warms by
  honest arithmetic. NAMES-key `pedlar`. Node: the Gate stall, market days. -->

## dialogue u9-yohei · pedlar
unrouted: t0v2-staged-node-talk

### line yohei-first
voice: villager

A new face at a fine gate — whetstone, two mon, best in the valley — and
half the valley says the river brought you, which for the two mon I never
heard.

### line yohei-coat
voice: villager

Cold coming, they say it in three villages — one straw coat left this
winter, six mon — and a man who sleeps in a woodshed knows what a coat is
worth better than I could flatter him.

### line yohei-square
when: pedlar-square
voice: villager

You count back to the mon, friend, which is rarer than anything on this
mat — the coat's five for you, not six, and the news is free: the passes
open early this year, and prices follow.

<!-- O-Yae (take-C) — nothing is her own claim; always what THEY say. Redline
  3: oyae-jizo ported verbatim from take-B (its register matches — the ambient
  R0 weir-jizō mystery carrier). Node: the Kitchen by day / the village road. -->

## dialogue u9-oyae · oyae
unrouted: t0v2-staged-node-talk

### line oyae-river
voice: villager

They say in the village a man walked out of the river with no name in his
mouth. I'm not saying it. They say it.

### line oyae-jizo
voice: villager

They say someone leaves rice-cakes at the weir-jizō and nobody ever sees
who. My mother says the kami take their own share. My mother says a lot of
things.

### line oyae-autumn
voice: villager

The miller's wife says the house can't pay past autumn. Cook says the
miller's wife should mind her own stones. I only carry the buckets.

### line oyae-well
voice: villager

They ask me at the well what you're like. I say you rake. Well — you do.

<!-- Matsuzō (take-C) — ask him about people, he answers about the water; the
  quiet night is the banked T3 origin clue, unasked-twice. Node: the Weir &
  riverbank / the lease day. -->

## dialogue u9-matsuzo · matsuzo
unrouted: t0v2-staged-node-talk

### line matsu-newhand
voice: villager

The new hand? River's low for the season. The screens will show their gaps
by Bon, whoever mends them.

### line matsu-quiet
voice: villager

That night? The river was quiet that night. I've said so before. Nobody
asked twice.

### line matsu-lease
voice: villager

Your steward keeps the lease the way his old master did — to the day, short
or not. The water doesn't care whose name is on it.

<!-- Iori (take-A) — goodbyes inside greetings; wants nothing, gives what he
  has, leaves; no maxims. Node: the Gate, New Year + Bon only. -->

## dialogue u9-iori · iori
unrouted: t0v2-staged-node-talk

### line u9-iori-greet
voice: villager

Well met — and gone by the third day, so let us say the good things tonight.

### line u9-iori-gifts
voice: villager

I carry needles, dried plum, and a knot worth knowing for a torn net. Take
whichever; I walk lighter without them.

### line u9-iori-bow
voice: villager

I made my goodbye when I bowed at the gate coming in. What we say now is over
and above.

<!-- O-Ume (take-C) — speaks to her drowned husband; thanks the kami for what
  living hands did; straight-dialogue idiom (redline: not narrator-with-quotes).
  Node: the paddy's edge / the Field margins / the river at Bon. -->

## dialogue u9-oume · oume
unrouted: t0v2-staged-node-talk

### line oume-racks
voice: villager

The kami kept the racks whole this year — do you hear that, old man? Not one
sheaf down. Not one.

### line oume-plum
voice: villager

You'll take a plum. Not from me — the river owes you, and I'm only handing
it across.

### line oume-bon
voice: villager

His place is set. He was never one to miss rice over a little water.

<!-- Rokusuke (take-C) — agrees early and often, head down; the tally shown
  pre-Count with zero portent; the dog line ties side-beat 4. Node: the Home
  paddy / the board at the Count. -->

## dialogue u9-rokusuke · rokusuke
unrouted: t0v2-staged-node-talk

### line roku-right
voice: villager

That's right, that's right. Whatever the steward said, that's the way of it.

### line roku-weather
voice: villager

Cold for planting. — Aye, or warm for it, could be. You'd know better than
me.

### line roku-tally
voice: villager

Sixteen loads by my count. But if the board says fourteen, fourteen. The
board's the board.

### line roku-dog
when: sb-dog-fed
voice: villager

You feed it, it's yours. That's how the yard reckons it, and the yard's not
wrong. Not saying it's wrong.

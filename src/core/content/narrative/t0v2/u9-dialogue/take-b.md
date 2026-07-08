---
unit: u9-dialogue
take: b
stance: the held breath — the house's grief close under the surface; warmth
  priced and rationed; human detail forward; what people almost say
covers: T0 node/ambient dialogue for the full cast-at-nodes roster — Genemon,
  Kihei, Sōan, O-Hisa, Shinnosuke, Naoyuki, Toku, Yohei, O-Yae, Matsuzō,
  Iori, O-Ume, Rokusuke (Munemasa excluded — a voice through a wall has no
  node lines in T0; Chiyo excluded — not on the U9 roster)
---

<!-- STAGED (t0v2) — NOT compiled; gen-narrative reads only the six canon
  files + takes/. FB-5 dialogue-def grammar throughout so migration is
  git mv + regen. Migration prerequisites, in order:
  1. NAMES keys used here that do not exist yet: ohisa, shinnosuke, naoyuki,
     toku, yohei, oyae, matsuzo, iori, oume. (elder / drillmaster /
     physician / rokusuke exist.) New NpcId + NPC_VOICE entries where a
     character earns npcMemory; frontmatter strips at migration.
  2. Flags used in `when:` gates bind at the rewrite's flag pass:
     named (post-R7) · pupil (post-R4) · wolf-held (post-R3) ·
     count-cleared (post-R5) · pedlar-square (dealt honestly at the stall) ·
     bon (native: season flag — the six-season calendar must expose the
     current season to story gating; Iori's PRESENCE at the gate is also
     season-gated, New Year + Bon only — native: seasonal node presence).
  3. Every def is unrouted until the rewrite's node wiring routes lines to
     node-talk. -->

<!-- ················ THE HOUSEHOLD ················ -->

<!-- Genemon — the Forecourt window, the board, the day-book.
  Shape: item, count, condition; never a metaphor. Held breath: the count
  is how he carries what he will not say. -->

## dialogue u9b-genemon · elder
unrouted: t0v2 staged — node wiring lands at the rewrite

### line gen-rakes
voice: steward

Rakes: four. One split at the throat — the yard's doing, not yours. It goes
in the book either way. Everything does.

### line gen-column
voice: steward

You work like a man working something off. I don't keep a column for what.
Half a cord by dark, dry, stacked bark-up.

### line gen-night
when: wolf-held
voice: steward

Blood on the sill: yours, mostly. Rice lost: none. Screens, boards, one
door-bar — mend what's listed and the night balances.

### line gen-gonbei
when: named
voice: steward

Gonbei. That name has been in this book before — four hands, my time alone.
Two of them worked out. Kindling: two bundles. Go.

<!-- Kihei — the Drill yard; the Gate at watch-change. Shape: imperative →
  verdict; the "…"-react is HIS ALONE, spent exactly once below. He trains
  a coward he likes without ever saying the word. No maxim spent here —
  rare by temperament; the creed belongs to R4. -->

## dialogue u9b-kihei · drillmaster
unrouted: t0v2 staged — node wiring lands at the rewrite

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

<!-- Sōan — the Sickroom; the Weir on his rounds. Shape: a question, then a
  prescription. Held breath: the closed ledger — he asks one question past
  his trade, and takes it back. -->

## dialogue u9b-soan · physician
unrouted: t0v2 staged — node wiring lands at the rewrite

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

<!-- O-Hisa — the Kitchen; mended things at the Woodshed doorstep. Shape: a
  hope never finished aloud — her "if" protects; ten years married to an
  unstruck line, mending a stranger's shirt in some other woman's place. -->

## dialogue u9b-ohisa · ohisa
unrouted: t0v2 staged — node wiring lands at the rewrite

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

<!-- Shinnosuke — the board's interrogator; the Drill-yard wall; the grove.
  Shape: questions stacked two at a time, never waiting on the first.
  Held breath: every second question is about his father, and he never
  says the word. THE MIRROR. -->

## dialogue u9b-shinnosuke · shinnosuke
unrouted: t0v2 staged — node wiring lands at the rewrite

### line shin-threshold
voice: narrator

Why do you eat at the threshold? Did they tell you to, or did you guess it?

### line shin-book
voice: narrator

Why does Genemon write you in the back of the book? Whose names are in the
front?

### line shin-wolf
when: wolf-held
voice: narrator

Did the wolf look at you before it went? Was it sent, do you think?

### line shin-taken
voice: narrator

When the river had you — was there a place? Could someone come back from it
after ten years, if there was?

<!-- Naoyuki — the veranda; two touches only in T0. Shape: begins formal,
  abandons it, restates flat and cold. His truest T0 sentence ("you are
  hiding something") is left to its scene — these are the ambient
  break-offs around it. -->

## dialogue u9b-naoyuki · naoyuki
unrouted: t0v2 staged — node wiring lands at the rewrite

### line nao-thanks
voice: steward

The house thanks you for — you'll have your rice at dusk. That is the
arrangement.

### line nao-veranda
voice: steward

My brother used to stand where you — the veranda wants sweeping. See to it.

### line nao-closed
when: count-cleared
voice: steward

What was said that night was — the matter is closed. The house closes
matters. Carry on.

<!-- Toku — the shrine-alcove corridor; the new-moon walk. Shape: everything
  dated. The trade-superstition line is her one private permission, gated
  late; the packet behind her dates is answered at R5 and paid at T4. -->

## dialogue u9b-toku · toku
unrouted: t0v2 staged — node wiring lands at the rewrite

### line toku-board
voice: steward

Mind the third board. It has creaked since the year the weir went.
Everything in this house has its year. Step soft.

### line toku-spring
voice: steward

You came the spring the river ran high. We have taken men in before — the
year the chestnuts failed, two came and one stayed. Stay or don't; the
house will date you either way.

### line toku-sums
when: count-cleared
voice: steward

The year the plum split, the mountain took a man from this house. This
spring, a river gave one back. An old woman is allowed her arithmetic.
Tell no one I still do sums.

<!-- ················ THE ESTATE'S EDGE ················ -->

<!-- Yohei — the Gate stall, market days. Shape: news, flattery, and the
  price in one breath, the sale in the middle. Warmth arrives exactly as
  fast as the money is good — the one relationship priced honestly. -->

## dialogue u9b-yohei · yohei
unrouted: t0v2 staged — node wiring lands at the rewrite

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

<!-- O-Yae — the Kitchen by day; the estate/village road. Shape: nothing is
  her own claim — always what THEY say. The jizō rumor she carries has its
  authored answer (O-Ume, T3). -->

## dialogue u9b-oyae · oyae
unrouted: t0v2 staged — node wiring lands at the rewrite

### line oyae-name
voice: villager

They say in the village you had no name on you when the river was done with
you. I don't say it. They say it. The kitchen wants water — two more pails.

### line oyae-jizo
voice: villager

They say someone leaves rice-cakes at the weir-jizō and nobody ever sees
who. My mother says the kami take their own share. My mother says a lot of
things.

### line oyae-screen
voice: villager

They say the house sold another screen this winter. In the kitchen we count
spoons, and the spoons are all there — so I say nothing goes anywhere.

<!-- Matsuzō — the Weir & riverbank; the lease day. Shape: ask him about
  people, he answers about the water — sixty years of attention, not a
  dodge. "The river was quiet that night" is the origin trail's first
  honest clue, answered at T3. -->

## dialogue u9b-matsuzo · matsuzo
unrouted: t0v2 staged — node wiring lands at the rewrite

### line matsu-night
voice: villager

The night you came up? The river was quiet that night. Quiet water carries
a long way. That's the whole of what I know, and it's about the water.

### line matsu-rats
voice: villager

The rats come from upstream. Something up there feeds them — pools where
there shouldn't be pools. Ask the water the right question and it generally
answers.

### line matsu-lease
voice: villager

The house? Water doesn't care whose seal is on the lease. Screens want
mending before the rains. Start there.

<!-- Iori — the Gate, New Year + Bon only (native: seasonal node presence).
  Shape: goodbyes live inside his greetings — permanently passing through.
  He wants nothing, gives what he has, and speaks no maxims: the license
  is spent, and he is the man who'd have earned it. -->

## dialogue u9b-iori · iori
unrouted: t0v2 staged — node wiring lands at the rewrite

### line iori-greet
voice: villager

Well met — and I'll say the farewell now, since I walk at first light: may
the gate be kinder to you than the road was. There. Now we can talk like
men with time.

### line iori-rice
voice: villager

Share the fire. I've rice enough for two and no use for what's left of it —
I always cook for the road behind me. Habit. Somebody's usually on it.

### line iori-bon
when: bon
voice: villager

I go tomorrow, so — goodbye, and good morning. The lanterns go down the
river tonight. Watch from the bank, if they've given you nothing to carry.
Watching counts. I'd know.

<!-- O-Ume — the paddy's edge; the Field margins; the river at Bon. She
  speaks to her drowned husband still, and thanks the kami for what living
  hands did — kernel #1's whole tenderness, never mocked. Kind to the MC
  the way you are kind to an omen. Her jizō decade resolves at T3. -->

## dialogue u9b-oume · oume
unrouted: t0v2 staged — node wiring lands at the rewrite

### line oume-racks
voice: narrator

"The racks stood," O-Ume says past you, to the paddy water. "You'd be glad
of it." To you she says only: "Take rice. He never minded it cold either."

### line oume-thanks
voice: villager

Thank the kami, not me — and I'll thank them, not you. Don't look so. It
isn't that you didn't work. It's that I know who sent you.

### line oume-bon
when: bon
voice: narrator

She sets a place that stays empty and fills your bowl beside it. "He won't
mind. He liked company that ate well."

<!-- Rokusuke — the Home paddy; the board at the Count. Shape: agrees early
  and often, head down; the yard's oldest lesson taught by behavior, never
  stated. His private tally is the exculpatory number at R5. -->

## dialogue u9b-rokusuke · rokusuke
unrouted: t0v2 staged — node wiring lands at the rewrite

### line roku-weather
voice: villager

Cold for planting. — Or fair, if the steward says fair. It goes in the same
rows either way.

### line roku-count
voice: villager

Middle of the row at the count, not the front. — That's right. You'll do
fine.

### line roku-tally
when: count-cleared
voice: villager

I keep my own tally of the loads. Nobody asked me for it before that night,
and that's right too — nobody asks a hand till they need him. Forty loads.
I had you at forty.

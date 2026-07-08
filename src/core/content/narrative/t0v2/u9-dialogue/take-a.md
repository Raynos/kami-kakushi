<!--
unit: u9-dialogue
take: a
stance: the-ledger — maximal restraint; the day-book's temperature; every
  scene ends a beat earlier than comfort asks; texture over sentiment;
  silence load-bearing.
covers: node/ambient dialogue for the whole T0 cast at their nodes —
  Genemon · Kihei · Sōan · O-Hisa · Shinnosuke · Naoyuki · Toku · Yohei ·
  O-Yae · Matsuzō · Iori · O-Ume · Rokusuke. Teach-by-reveal defs: the
  line order IS the progression (early lines land early, later lines land
  after the man has stood a few seasons); no invented flags, so the file
  stays state-compatible for the reader/switcher.
staged: t0v2 — NOT compiled. gen-narrative reads only the six canon files
  plus takes/; this file is grammar-clean so migration is git mv + regen.
-->

<!--
native (what the engine must provide before these route):
- node-talk routing: bind each def to its map node (talk-at-node), with
  availability windows — Yohei only on market days; Iori only in the New
  Year and Bon lodging seasons; Matsuzō's lease line best on the lease day.
- registries first (emit.ts resolveSpeaker): new NAMES keys + voice entries
  for ohisa, shinnosuke, naoyuki, toku, oyae, matsuzo, iori, oume; and the
  new-canon name sweep on names.ts (pedlar Tokubei → YOHEI; lord Shigemasa →
  Munemasa; the origin names). Household voices ride `steward` and the
  estate's edge rides `villager` until a finer split is wanted.
- one "…"-react appears below (kihei-good) — Kihei's alone by the one-owner
  law; no other line in this file uses the ellipsis.
- epigram budget: ZERO maxims spent in this sheet — ambient talk is where
  the license is easiest to leak, so it leaks nothing.
-->

<!-- ═══ The household ═══ -->

<!-- node: the Forecourt window · the board · the day-book.
     Genemon — item, count, condition; never a metaphor in his life. His
     fled-debt read of the MC stays PRIVATE: nothing here states it. -->

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

<!-- node: the Drill yard · the Gate at watch-change · the Night rounds.
     Kihei — imperative, then verdict; gear-nouns between. The "…"-react is
     his alone and spent once. -->

## dialogue u9-kihei · drillmaster
unrouted: t0v2-staged-node-talk

### line u9-kihei-feet
voice: arms

Feet first. The hands come along on their own. Again.

### line u9-kihei-gate
voice: arms

Bar the gate at dusk and check it twice. The first time, you were tired.

### line u9-kihei-rounds
voice: arms

Lantern low on the rounds. Rats by the kura first. Whatever comes for the
rats comes second.

### line u9-kihei-good
voice: arms

…Good. Same hour tomorrow.

<!-- node: the Sickroom · the Weir on his rounds.
     Sōan — a question, then a prescription; the closed ledger seeded in a
     narrator line, per the tier sheet's wrong-thing. -->

## dialogue u9-soan · physician
unrouted: t0v2-staged-node-talk

### line u9-soan-sleep
voice: physician

Sleeping through, or waking before light? Waking, I'd guess. Broth at night,
and nothing over the shoulder until the ribs stop catching.

### line u9-soan-hands
voice: physician

Your hands — where did they learn to carry? Not raking, those calluses. No
matter. Keep the wrapping dry and come back when it itches.

### line u9-soan-ledger
voice: narrator

He closes the ledger when you cross the doorway. He does not hurry about it.
The brush is still wet.

### line u9-soan-weir
voice: physician

Wading the shallows again, at your stage of mending? Straw boots past Bon,
then. A chilled man heals at half pace and eats the same.

<!-- node: the Kitchen & board-side · the Woodshed doorstep.
     O-Hisa — a hope never finished aloud; her "if — well." is hers. -->

## dialogue u9-ohisa · ohisa
unrouted: t0v2-staged-node-talk

### line u9-ohisa-rice
voice: steward

Eat at the threshold, there's rice yet. If the harvest comes in fair — well.
There's rice yet.

### line u9-ohisa-sleeve
voice: steward

Your sleeve was open at the shoulder. It isn't now. The thread was spare in
any case.

### line u9-ohisa-waiting
voice: steward

A man is generally waited for somewhere. If yours — anyway. The coat wanted a
button, that's all.

### line u9-ohisa-bon
voice: steward

If the persimmons hold past first frost — well. There will be something sweet
at Bon.

<!-- node: the board · the drill-yard wall · the Bamboo grove.
     Shinnosuke — questions stacked two at a time, never waiting; the
     player's mirror, asking what the MC can't. -->

## dialogue u9-shinnosuke · shinnosuke
unrouted: t0v2-staged-node-talk

### line u9-shin-wolf
voice: steward

Did the wolf really bleed? How far did it get before the blood stopped
showing?

### line u9-shin-drill
voice: steward

Why does Kihei make you stand so long before you swing? Could I stand it
longer than you?

### line u9-shin-before
voice: steward

Were you somewhere before the river? Does it have a name?

### line u9-shin-silence
voice: steward

Do they stop talking when you come in? They do for me — why, when I live
here?

<!-- node: the veranda. Naoyuki — two touches only in T0; begins formal,
     abandons it, restates flat and cold. The real meeting is T1. -->

## dialogue u9-naoyuki · naoyuki
unrouted: t0v2-staged-node-talk

### line u9-nao-boards
voice: steward

My father would have wished you — . The north boards want sweeping. Begin
there.

### line u9-nao-yard
voice: steward

You keep the yard as if the house were — . It is a yard. Keep it.

<!-- node: the shrine-alcove corridor · the new-moon walk.
     Toku — everything dated; the corridor altar and the dark-night line are
     seeds with authored answers (T1 the alcove; R5 the packet). -->

## dialogue u9-toku · toku
unrouted: t0v2-staged-node-talk

### line u9-toku-altar
voice: steward

The altar had a room to itself, the year I came a bride. A corridor is
warmer, at least.

### line u9-toku-rain
voice: steward

You came up from the river the night before the early rain. I keep the years
by their weather. That one is kept.

### line u9-toku-newmoon
voice: steward

Dark of the moon tomorrow. The year the bridge went, the dark nights were the
ones for walking.

<!-- ═══ The estate's edge ═══ -->

<!-- node: the Gate & gateyard, MARKET DAYS ONLY (native window).
     Yohei — news, flattery, and the price in one breath, the sale in the
     middle; warms by honest arithmetic across the sequence. -->

## dialogue u9-yohei · pedlar
unrouted: t0v2-staged-node-talk

### line u9-yohei-rope
voice: villager

Post-town rice is down two mon a shō, which makes today lucky — hemp rope,
eight mon — and a man who hauls like you knows rope when he holds it.

### line u9-yohei-coat
voice: villager

They say the passes close early this year — straw coat, twelve mon, the last
till winter restocks — and a shoulder like yours deserves better than wet.

### line u9-yohei-regular
voice: villager

For a man who counted straight last market, the thread at cost — and the news
free: the ferry is up a mon, and the ferryman blames the rain.

<!-- node: the Kitchen by day · the estate/village road.
     O-Yae — nothing she says is her own claim; always what THEY say. -->

## dialogue u9-oyae · oyae
unrouted: t0v2-staged-node-talk

### line u9-oyae-river
voice: villager

They say in the village a man walked up out of the river. I don't say it.
They say it.

### line u9-oyae-well
voice: villager

They ask at the well what the house pays you. I carry water, I tell them.
Water's all I carry.

### line u9-oyae-grand
voice: villager

They say the house was grand once — grand as what, I couldn't tell you. I
wash what the kitchen gives me and carry the bowls back dry.

<!-- node: the Weir & riverbank · the lease day.
     Matsuzō — ask him about people, he answers about the water; the quiet
     night is his one unmade observation (answered T3). -->

## dialogue u9-matsuzo · matsuzo
unrouted: t0v2-staged-node-talk

### line u9-matsu-house
voice: villager

The house, you say? Water's low for the season. Your screens will want
mending before Bon — count them from my bank and you'll see.

### line u9-matsu-rats
voice: villager

The rats come down from upstream; always have. Something up there feeds them.
You mend, they gnaw, the lease stands.

### line u9-matsu-night
voice: villager

The night you came up, the current was slow and deep. Slow water carries a
man a long way. I never made more of it than that.

<!-- node: the Gate, New Year + Bon lodging windows (native).
     Iori — goodbyes inside greetings; wants nothing, gives what he has,
     leaves. No maxims: the license is spent, and he'd have earned it. -->

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

<!-- node: the paddy's edge · the Field margins · the river at Bon.
     O-Ume — speaks to her dead husband; thanks the kami for what living
     hands did; kind to the MC the way you are kind to an omen. -->

## dialogue u9-oume · oume
unrouted: t0v2-staged-node-talk

### line u9-oume-racks
voice: villager

Badgers at the racks again, old man. You would have smoked them out by now —
he liked a small war, my husband. Mind the setts as you walk; the ground
gives.

### line u9-oume-kami
voice: villager

The kami sent this paddy a pair of hands before harvest. I thanked them at
the stone this morning — so there is nothing you need hear from me.

### line u9-oume-bon
voice: villager

His place is set at Bon, same as thirty years. The rice is the good rice. He
will know it.

<!-- node: the Home paddy · the board at the Count.
     Rokusuke — agrees early and often, head down; the tally line seeds the
     Count without naming it. -->

## dialogue u9-rokusuke · rokusuke
unrouted: t0v2-staged-node-talk

### line u9-roku-agree
voice: villager

That's right. Whatever the yard wants, that's right. You'll not hear
different from me.

### line u9-roku-rows
voice: villager

Take the near rows, I'll take the far. Or the other way about. Either's
right.

### line u9-roku-steward
voice: villager

Whatever the steward set down, that will be how it was. It generally is.

### line u9-roku-tally
voice: villager

The loads? I keep my own tally, under my hat. Nobody asks a hand for his
tally — till the day they do.

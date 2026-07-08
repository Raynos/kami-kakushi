<!--
unit: U6 · T0 R6 — the trusted hand
take: b
stance: the held breath — the house's grief close under the surface; warmth
  priced and rationed; human detail forward; what people almost say
covers: t0.md ladder R6 whole — the sending (purse + list at the board), the
  errand (Yohei's stall at the gate on a market day, the stray re-priced as a
  regular by honest arithmetic), the count back to the mon under Genemon's
  finger, and the standing gate-errand duty that motivates the trade unlocks

migration notes (staged, NOT compiled — see t0v2/README):
  - NAMES needs pedlar: 'Yohei' (new canon; old-canon 'Tokubei' is void) and
    an O-Hisa registry entry (id + display name) before emit; the memory id
    `ohisa` below depends on it.
  - motivates ids are placeholders; bind them to the rewrite's real unlock
    ids (the purse readout, trading at the stall, the market-day errand).
-->

## rung R6 · rung-r6
speaker: genemon
voice: steward
motivates: panel-purse, verb-trade, room-gate-stall

> The board, early. The day-book is open, and Genemon does not look up
> until the page is finished with him.

Genemon: "Salt, one measure. Lamp-wicks, a dozen. Thread, two hanks.
Incense, one bundle, the white. Yohei sets up at the gate today."

> He takes a purse from the drawer under the board. The leather is soft
> and dark, mended twice at the throat, older than anything else on the
> board.

Genemon: "Fifty mon. Count it."

> You count it. Fifty.

Genemon: "The list, if the gate prices hold, is forty-four. They seldom
hold. This purse carried koku, once. Now it carries this."

> A question stands in your face and does not get asked.

Genemon: "You want the why of it. Four rungs of wages against your name
and no shortfalls. The day-book is the why. Go."

> The gate, mid-morning. Yohei's stall stands open against the wall,
> boards bright with small goods, and the pedlar's eyes are on the purse
> before they are on the man.

Yohei (villager): "The Kurosawa hand himself, and carrying the house's
leather. Salt, is it? I have the last good measure this side of the
pass — eight mon, and cheap at that."

Nameless: "Six on the road."

> The number is out of you before you know where it was kept. You could
> not say which road. You could not say when.

Yohei (villager): "Six where the road is flat and the harvest was kind.
You've carried a load to market before, I'd swear to the shoulders on
you. Six, then — neighbor's price, and don't tell the village I keep
two."

> The rest goes quickly, and differently. The wicks are counted into
> your hand one dozen exact. Nobody flatters the thread.

Yohei (villager): "And the white. Ten years I've carried white incense
for this house, and never once — four mon, same as ever."

> The sentence becomes the price halfway through.

> Kihei crosses the gateyard at watch-change. His eye finds the house's
> purse on your belt, weighs it, and moves on.

### ask r6-news · "What's the news?"

Yohei (villager): "Lowland wages are up again — you'll lose no sleep
over that now, I see. The road says the Kurosawa gate is one man and a
mule these days. The road exaggerates. It's a good mule. Straw coats
come in with the cold — one only, mind, and it goes to whoever's coin
is first."

### ask r6-purse · "You know this purse."

Yohei (villager): "Every pedlar on this round knows that purse. It came
down to market with two porters behind it, in the old lord's father's
day. Salt keeps — tell your steward."

> The board, before the light goes. The goods laid out in their order,
> the purse open. Genemon counts the change under one finger, mon by
> mon, aloud and slow.

Genemon: "Eight. The list reckoned six."

Nameless: "Salt was six, not eight."

> Genemon says nothing. He opens the day-book and writes: salt, six the
> measure — Yohei — hold him to it.

Genemon: "The gate errands are yours on market days. Purse from this
drawer, list from this book, count at this board."

> He hangs the purse on its nail behind him — one nail taken, on a rail
> drilled for twelve.

Genemon: "Two mon over the reckoning. Argued down is earned, by my
arithmetic. Take them, or say otherwise."

### decide · Two mon, pushed across the board.

#### r6-wage · "I'll take them."

Genemon: "Wages are cleaner than favors. Two mon, paid out and
written."

memory: genemon +1 (square)
flags: r6-wage

#### r6-house · "They were the house's mon."

Genemon: "As you like. Two, returned. A man that careful of other
people's coin has usually had practice."

flags: r6-house

#### r6-thread · "Thread with them. The mending basket is low."

Genemon: "Thread, two mon, unlisted. The basket is hers to say.
Noted."

memory: ohisa +1 (noticed)
flags: r6-thread

---
unit: U6 · R6 — the trusted hand
take: take-c
stance: the weather — kernel #7 forward. He is watched, misread, unowed;
  the trust is arithmetic and need, never a verdict on him; the market
  keeps talking when he leaves. Nothing performs for him.
covers: the R6 rung beat whole — the send-off at the forecourt window,
  Yohei's stall at the gate, the count-back under Genemon's finger
  (native epilogue).
---

<!-- STAGED, NOT COMPILED — t0v2 wave. Migration notes:
  - NAMES.pedlar must rename Tokubei→Yohei (the name-norm docket,
    04-cast.md) before any `Yohei:` line resolves.
  - `motivates:` ids are placeholders until the rewrite binds R6's
    unlocks (the house purse / the standing market errand).
  - The count-back is a post-decide continuation with flag-gated prose,
    which the rung-beat grammar lacks — marked native below.
  - Deliberate echo (craft rule): the day-book entry here answers R0's
    "one man, name unknown" — an errand entered with no name to enter it
    under. It escalates the motif toward R7's naming; do not flatten it
    into a fresh line.
  - Purse arithmetic, single source for this scene: salt 15 + oil 14 +
    thread at the steward's figure 9 = 38 mon; the purse carries 40; the
    figure returns 2. Yohei's stray-price for the thread is 11.
-->

## rung R6 · rung-r6
speaker: genemon
voice: steward
motivates: house-purse, market-errand

> Morning, the forecourt. Genemon's window stands open, the day-book out,
> and beside it a purse the size of a fist, dark with handling.

Genemon: "Salt, one shō. Waxed thread, two hanks. Lamp oil, one masu.
Yohei sets his boards up at the gate by mid-morning."

Genemon: "Two hands short since spring, and I cannot leave the book on a
market morning. So."

> He counts the coins into your palm one at a time, watching each one
> land.

Genemon: "Forty mon. Count them back."

You: "Forty."

> He watches the whole count. When it comes out even he does not nod. He
> enters something in the day-book, unasked.

Genemon: "His prices are his own. The house's figures are mine. Go."

> Market morning at the gate. Yohei's boards are up and the gateyard has
> people in it for once — baskets, a mule, talk. The woman ahead of you
> pulls her basket an inch closer when you stop beside her. The talk is
> rain over the pass and the price of salt, and it thins a little when
> you step to the boards, and it is not about you either.

Yohei: "The house's hand, and carrying the house's purse — there's news
by itself. Rain over the pass, the dye-man's held at the ford a week, so
waxed thread is scarce, so the thread is eleven. Salt fifteen, the oil
fourteen — fair as water, those two. Eleven for the thread, then?"

### ask r6-stray-price · "You priced me high, my first market."

Yohei: "I did. First market, you were the road's — a road man pays the
road's price, carries it off, and is gone. A house man comes back twelve
markets a year. I price the coming back."

### ask r6-ford-news · "What holds the dye-man?"

Yohei: "The ford, swollen, and no hurry in him — lowland wages are fat
this year and half the carriers went down for them. Your house lost two
hands to the same road, I hear. Everything walks downhill but the rain."

### decide · The thread is eleven. The steward reckoned nine.

#### r6-count-flat · "Nine. Count it with me."

Yohei: "Ha — the steward's figure, out of the steward's own mouth. Nine,
nine, take it. Twelve markets a year, I'd rather be the stall you count
at than the one you walk past."

memory: yohei +1 (square)
flags: r6-flat

#### r6-pay-over · "Eleven, then."

Yohei: "Done, and kindly done. Salt, oil, thread — mind the oil, it
sweats in the sun. My regards to the kitchen."

memory: yohei +0 (a mark still)
flags: r6-over

#### r6-put-back · "Then the house does without thread."

Yohei: "As you like. Thread keeps, and so do I. Salt and oil,
twenty-nine — and tell the steward it's the dye-man sets that price, not
me."

memory: yohei +0 (hard)
flags: r6-back

## scene r6-count-back
native: post-decide epilogue — the same rung scene continuing after the
  decide resolves, with `when: <flag>`-gated prose lines in scene
  position (the rung-beat grammar has no form for either). The engine
  must run this beat immediately on return, before the rung closes.

> Behind you, before you have crossed the gateyard, Yohei is already
> pricing the next basket.
>
> The forecourt window. Genemon clears a hand's width of sill and you
> set the purse down on it. He tips it out and moves the coins across
> the wood one at a time, under one finger, not quickly.

when: r6-flat
Genemon: "Two back. Even." *He says nothing else about it. The finger
taps the sill once, where the coins were.*

when: r6-over
> The finger crosses the wood and finds nothing to count. He looks at
> the sill a moment. Then he writes something in the day-book, first,
> before he speaks.

when: r6-over
Genemon: "The figure returns two. Yohei's price, or yours?"

when: r6-over
You: "His."

when: r6-over
Genemon: "Next market, mine."

when: r6-back
Genemon: "Eleven back. Even — and no thread. The kitchen's mending waits
on it, and O-Hisa does not ask twice. She will not ask you at all."

> He squares the coins, returns them to the purse, and the purse to its
> drawer. Then the day-book. There is still no name to enter the errand
> under, and he does not invent one: the same hand that wrote *one man,
> name unknown* writes the errand down and leaves the space where a name
> would go.

Genemon: "Market day comes every sixth day. So will you."

> That is all of it. The window is already back at its figures. In the
> gateyard the talk has closed over the morning like water — the rain,
> the salt, the dye-man at the ford. The purse is in the drawer, the
> entry has no name in it, and market day comes every sixth day.

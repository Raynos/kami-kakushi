<!-- DEMO take b — Ledger-cold Genemon. Tooling fixture, not a story proposal.
  State-compatible with canon R1: same option ids, flags, memory writes. -->

## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-gate-forecourt, room-home-paddies, verb-farm, verb-haul,
  readout-clock, readout-stamina, panel-rung-ladder

> Dawn at the gate. The forecourt is swept clean — your doing — and Genemon
> stands over it with a tally-slate, marking before he speaks.

Genemon: "The stores are cleared. I have written it down. A day-hire's work
ends at the writing; yours, it seems, does not. The house will keep you — board
and rice against labor, the terms plain. See they stay plain."

Genemon: "Gate and forecourt pass to your keeping, and the home paddies with
them. The kura's repair draws on the house's surplus — spend it as entered,
and enter what you spend."

> A pack-laden stranger has laid a mat in the lee of the gate-post — an Ōmi
> pedlar, come because a tended gate draws trade. He lifts a hand as you pass.

Tokubei (villager): "A tended gate's a lucky gate for a man with a pack.
Tokubei, of Ōmi — mind if I keep my mat here a while, young master? Coin of your
own spends as well as any lord's."

### decide · How do you take the keeping?

#### r1-dutiful · "The house has my hands."

Genemon: "So the entry reads. Few hands make it true past the first frost."

memory: genemon +1 (dutiful)
flags: r1-dutiful

#### r1-practical · "A roof and rice is a fair trade."

Genemon: "Terms understood on both sides. That is more than most bargains get."

memory: genemon +0
flags: r1-practical

#### r1-ambitious · "I mean to rise past a kept hand."

Genemon: "Ambition is not a column I keep. Show me sums, and I will find one."

memory: genemon -1 (ambitious)
flags: r1-ambitious

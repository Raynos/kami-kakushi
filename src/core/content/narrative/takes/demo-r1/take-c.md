<!-- DEMO take c — Weather-worn Genemon. Tooling fixture, not a story proposal.
  State-compatible with canon R1: same option ids, flags, memory writes. -->

## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-gate-forecourt, room-home-paddies, verb-farm, verb-haul,
  readout-clock, readout-stamina, panel-rung-ladder

> Dawn at the gate. The forecourt is swept clean — your doing — and Genemon
> stands in the middle of it a long moment, as if remembering other hands
> that once swept it.

Genemon: "You cleared the stores without being told twice. I have kept this
gate through forty winters and watched better men than me walk out of it. Stay.
The house is short of hands, and I am short of years to train them."

Genemon: "The gate and the forecourt are yours now, and the home paddies — the
rice that feeds us all. The kura wants shoring; spend the house's little
surplus on it. It was my task once. Carry it better than I did."

> A pack-laden stranger has laid a mat in the lee of the gate-post, the way a
> man does who has been passing this gate for years and never once stopped.

Tokubei (villager): "Tokubei, of Ōmi — twenty years on this road, and this is
the first time this gate looked worth stopping at. Mind if I keep my mat here
a while, young master? Coin of your own spends as well as any lord's."

### decide · How do you take the keeping?

#### r1-dutiful · "The house has my hands."

Genemon: "...Then the house is luckier than it has been in some years. Good."

memory: genemon +1 (dutiful)
flags: r1-dutiful

#### r1-practical · "A roof and rice is a fair trade."

Genemon: "A fair trade. I said the same once, standing where you stand. Well."

memory: genemon +0
flags: r1-practical

#### r1-ambitious · "I mean to rise past a kept hand."

Genemon: "...So did I, boy. So did I. Mind what it costs before you pay it."

memory: genemon -1 (ambitious)
flags: r1-ambitious

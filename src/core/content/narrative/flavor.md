<!-- UI flavor lines (ADR-139) — fiction-voiced micro-copy the RENDERER shows
  outside a VN scene (lock-hints, gate explainers). The AUTHORING SOURCE OF TRUTH
  (FB-5); compiled to src/core/content/flavor.gen.ts by `pnpm run gen:narrative`.
  These are live-switchable via the DEV story set-switcher (a diverge on any of
  these ships its alternates as a takes/ bundle). {key} interpolates NAMES.
  Format spec: ./README.md. -->

## prose flavor

### mendHint

The edge is going. Not yet mine to mend — climb higher, then set it right.

<!-- ADR-145 Phase-2 build beats (CORE-emitted one-time log milestones, not
  renderer hints): the five deed-source reveals + the E1 build-complete beat.
  Canon = the "steward's ledger" take (ADR-139 diverge, bundle
  estate-build-beats — alternates in takes/ until the human signs off).
  Register: Genemon's dry book-keeping voice; each line is the moment a thing
  becomes worth recording — the mechanic itself (recognised deeds bank
  standing) voiced as fiction. -->

### estateSourceFields

Entered: rice from the new paddies, credited to the house's own account. The old books carried this line once; it is carried again.

### estateSourceStores

Entered: the granary takes in more than it pays out. A full storehouse needs no remark — this one has earned it all the same.

### estateSourceWorkshop

Entered: one piece, workshop-made, sold under the house's mark. The mark will outlast the ink of this entry.

### estateSourceWatch

Entered under losses: nothing. The trouble came to the gate and was turned there; the ledger's emptiest lines are the dearest bought.

### estateSourceTreasury

Entered: rice sold at market, the coin set down in the house books — owed to no man. The steward has waited some years to write that word.

<!-- ADR-146 emergent node discovery — the woodlot lacquer tree (bundle
  disc-woodlot-lacquer; alternates in takes/ until the human signs off).
  Canon = the "woodsman's eye" take (ADR-139 diverge): a purely sensory
  register — the hints are the body learning the woodlot, tightening every
  DISCOVERY_HINT_STEP woodcut attempts (lacquerHint0 → 1 → 2, rendered inside
  the node's standing description, never a banner); lacquerFound is the
  CORE-emitted permanent log line at the latch moment. -->

### lacquerHint0

Cut wood at the yard's edge and the smell comes back on the axe — pine, mostly, but under it something else, thin and bitter, like nothing else in the stack.

### lacquerHint1

One trunk past the third row wears a scar the wrong color, grey bark weeping a line gone hard and amber-dark. The hand pauses on it before the eye has decided why.

### lacquerHint2

The axe knows before the arm does — that grey trunk takes the blade soft, and the cut beads at once with a slow milk that stiffens on the steel. This is no firewood tree.

### lacquerFound

The nose knew it first, then the palm, and last the word: urushi. A lacquer tree, hidden all this time among the common pine, and the beading sap already worth more than the day's whole stack.

### estateStands

Let it be entered plainly, for whoever keeps these books hereafter: the estate stands. Every line above this one was the building of it.

<!-- ============================================================
  F1 · NODE FLAVOR (migrated from t0v2/flavor/f1-nodes.md)
  Per-zone narrator flavor: `node<Zone>Blurb` = the current-location
  blurb; `node<Zone>Wrong` = the surfaced "wrong thing" seed line.
  Narrator voice, plainest register, second person for the MC, no
  epigrams. Verbatim from the F1 sheet except the applied redlines.
  Action button labels are NOT migrated here — they are mechanical
  micro-labels bound to action-keys, not renderer flavor prose.
  ============================================================ -->

### nodeWeirRiverbankBlurb

Matsuzō's weir, leased; the screens across it are the house's to keep whole. The river runs loud over the sill and flat below it. This is where they pulled you out.

### nodeWeirRiverbankWrong

<!-- Long-running; shown from R0. Answered at T3 — the line must not lean
  toward any candidate. -->
Someone leaves offerings at the weir-jizō — a pinch of rice, set straight; once, a flower. No one at the house owns to it, and no one asks whose they are.

### nodeGateGateyardBlurb

The estate's face, kept barely: gateposts sound, paint long gone, the ground swept clean all the same. On market days Yohei's stall sets up inside the posts — the market comes to the house now.

### nodeGateGateyardWrong

The crest board over the gate is new wood on old posts. Where the old board went is not discussed.

### nodeForecourtBlurb

The outer court of the guest house, where the day's work is set out and seen to. Genemon's window looks onto it; what is done here gets written down.

### nodeForecourtWrong

Raked corner to corner, the court takes the whole morning. It was laid out for five households' worth of feet, and gets one.

### nodeWoodshedBlurb

A lean space between the woodpiles: a mat, a chipped bowl, a nail for the coat. It is not much, and it is not anyone else's.

<!-- nodeWoodshedWrong: none — deliberate (spec: the one warmth the tier
  allows, and it is earned). Not added at migration. -->

### nodeKitchenThresholdBlurb

Meals are taken at the threshold, on the outer side of the sill. Within is the board, where terms are stated and portions decided, and where the household talks over you as if the sill were a wall.

### nodeKitchenThresholdWrong

The steward's papers share a shelf with the pickle crocks, and nobody carries them anywhere better.

### nodeKuraBlurb

The working storehouse: rice in, counted; rice out, counted again. The iron-strapped door and its good lock are the newest work on the estate. The grain-watch's post is a stool beside the door.

### nodeKuraWrong

The seal-plate above the door carries the house crest — count the petals, and it carries one more than the gate's. Nobody reads it aloud.

### nodeDrillYardBlurb

The old stable court, swept bare and given a new use. Kihei's ground: things happen here in his order or not at all.

### nodeDrillYardWrong

Stalls for twenty horses run the long side of the yard. The house owns one mule.

### nodeHomePaddyBlurb

The guest house's skirts: paddy water, vegetable rows, the plainest work there is — mud, water, backs. Everything else on the estate is paid for from here.

### nodeHomePaddyWrong

Out past the last worked row, the boundary stones stand in long grass. They are the house's. So is everything between.

### nodeWoodlotEdgeBlurb

Kindling and forage country past the last fence. No one works out here beside you; a hundred paces in, the sound of the estate stops.

### nodeWoodlotEdgeWrong

Some of the old stumps carry char. No one at the house puts a year to the burn.

### nodeShrineCorridorBlurb

A family altar set into a corridor — the rites kept properly in a passage never meant to hold them. You see it in passing. You are not asked to stop.

### nodeShrineCorridorWrong

<!-- Glimpse only — the tier's single R4-era pass-by; entering is T1's. -->
Among the rites, the kind kept for the dead: a pair of straw travel-sandals, toes pointed away from the house. The straw is this year's.

### nodeSickroomBlurb

A lean-to surgery off the outer court: drawers of herbs, a pallet, the smell of moxa. You woke here first.

### nodeSickroomWrong

Sōan writes while you heal. Whatever the ledger holds, it is closed by the time the door finishes opening.

### nodeRuinedCompoundBlurb

<!-- Display map label: "The waste ground" (the spec's "not even named
  honestly" — the household's dishonest name is the map label itself). -->
Beyond a rope and a written warning: roofs fallen in on themselves, a great gate down across its own step, walls quarried low by the village, stone by stone. The house calls all of it the waste ground, and no one's eyes stay on it while they say so.

### nodeRuinedCompoundWrong

<!-- The whole node is the wrong thing. -->
Whatever this was, it was no outbuilding. Nobody says what it was. Nobody says anything.

### nodeOvergrownOrchardBlurb

The old orchard gone wild: bramble to the shoulder, windfall rotting underfoot, dogs denned in the hollow — lean winters have made them bold. Kihei calls it the dogs' yard, without irony.

### nodeOvergrownOrchardWrong

Under the bramble the fruit trees stand in courtyard rows, planted by someone who expected paths between them, and lanterns.

### nodeBambooGroveBlurb

Green dark and creaking, close behind the waste ground. The monkey troop raids the vegetable rows from here and is gone up the stems before you have turned around. Shinnosuke is forbidden the grove, and is in the grove.

### nodeBambooGroveWrong

A waymark of cut bamboo stands at the path-fork, green — renewed this season, as it was last. No one claims the habit, and the habit is old.

### nodeNightRoundsBlurb

<!-- The round's post stands at the gate. -->
The round begins at the gate post: a stave, a hooded lamp, the order of the walk in Kihei's hand. Walk it clean and the house sleeps. Fall, and you wake at Sōan's.

<!-- nodeNightRoundsWrong: CUT at migration (redline 1). The F1 new-moon
  "wrong thing" line is a near-duplicate of u3-B's rung-beat, which owns the
  `night-round-new-moon` sighting. One owner only; not reproduced here. -->

### nodeWeirReedsBlurb

The shallows above and below the weir, reeds past the waist. River rats gnaw the screens the house leases from Matsuzō; every screen lost is coin owed. He counts the damage from his own bank, and does not raise his voice.

### nodeWeirReedsWrong

<!-- Seed only — the old breach pools are T1's thread; no further hint. -->
The gnawed screens are always the upstream ones. Whatever is feeding the rats, it is feeding them from above the weir.

### nodeFieldMarginsBlurb

Setts at the paddy's edge — tanuki, badger — and raids on the drying racks and the seed store. By the stories a tanuki is anything it wants to be; the one at the racks is a fat animal with its face in the seed rice.

### nodeFieldMarginsWrong

Dig far enough into the oldest sett and it bends toward the waste ground's wall — and goes under.

<!-- ============================================================
  F2 · TEXTURE FLAVOR (migrated from t0v2/flavor/f2-texture.md)
  Four layers: log-texture (world-breath / weather / market / gossip),
  quest-rewards (offer/complete/reward micro-copy + attributed speech),
  perks (learned-box name + standalone description), and field-guide
  (bestiary pages of Kihei's kept drill-yard book). Narrator / house-
  journal register; no epigrams. Attributed speech kept verbatim, its
  `speaker:` recorded in a comment (keyed prose carries no meta). No
  arithmetic in prose — all sums ride the Progress line at migration.
  Verbatim from the F2 sheet except the applied redlines.
  ============================================================ -->

<!-- log-texture · world-breath, two per season (Winter → New Year →
  Spring → Summer → Bon → Autumn); the season gate is encoded in the key. -->

### seasonWinter1

Snow off the ridge by morning. The mule stays in; the well-rope stiffens overnight and has to be worked soft before the first bucket comes up.

### seasonWinter2

The village kilns are lit — char-smoke standing straight up the valley on the still days. Kindling fetches what firewood did in autumn.

### seasonNewyear1

Pine at every gate in the village, they say. The house sets one small pair at its own, and Genemon enters the cost.

### seasonNewyear2

First market of the year: Yohei's stall half stock, half talk. Prices rest a while; nobody haggles in the first week.

### seasonSpring1

The river comes up brown with the thaw and the weir takes the worst of it. Matsuzō walks his bank twice a day and says nothing yet.

### seasonSpring2

Seed rice out of the kura, counted twice. The paddies want water, the rows want hands, and the day is suddenly short.

### seasonSummer1

Heat by mid-morning. Work moves to the field edges and the shade of the kura wall; the monkeys move with it.

### seasonSummer2

A wedding at the miller's, two days gone. The kitchen heard when the red rice arrived — a bowl of it, already cool.

### seasonBon1

Bon. The village road carries more people in a day than the gate sees in a season.

### seasonBon2

Yohei doesn't come Bon week. Even trade goes home.

### seasonAutumn1

Cutting weather, while it holds. Every field in the valley is a count now — sheaves, racks, and what the racks lose in the night.

### seasonAutumn2

The rice is in and the whole valley counts the same sky. Talk at the stall is all of the assessment; the talk stops when it arrives.

<!-- weather pool — any season unless the key carries a season gate;
  ambient rotation between scenes. -->

### weatherRain

Rain since first light. The yard's work waits under the eaves; the woodshed roof holds, this year.

### weatherWind

A wind off the mountain all day. The bamboo grove talks through it, and the gate-board knocks until someone wedges it.

### weatherFog

Fog up from the river till mid-morning. Matsuzō's bank is an outline; the weir is a sound.

### weatherFrost

<!-- season: winter -->
First frost on the boundary stones. The far ones wear it longest, out where nobody works.

### weatherDry

A dry spell. The vegetable rows drink the well low, and hauling water climbs to the top of the day's list.

### weatherThunder

<!-- season: summer -->
Thunder over the ridge at dusk, rain elsewhere. The paddies wanted it and did not get it.

<!-- market & prices pool — Yohei's stall at the gate on his market days. -->

### marketStallUp

Market day. Yohei's stall is up at first light — thread, salt, straw sandals, and one iron pot he swears he is losing money on.

### marketThreadUp

Thread is a mon dearer at the stall. Yohei blames the road.

### marketStrawCoat

<!-- season: winter -->
One straw coat on the stall — winter's whole stock. Yohei names its price without being asked.

### marketNeedles

Salt held its price; needles didn't. O-Hisa sends for two anyway and counts them into the sewing box like coin.

### marketYoheiBuys

Yohei buys today as well as sells: hides, clean bamboo, dried plums if anyone has them. His purse is a market-day purse — it empties.

### marketNoStall

No stall this week — the ford was up, and Yohei with a cartload on the far side of it. The gateyard is quieter than a market day should be.

<!-- gossip & the without-you world — O-Yae is the conduit; nothing she
  says is her own claim. -->

### gossipBirth

O-Yae brings it with the fish: a boy born at the ferry keeper's, loud and early. The village has already decided who he looks like.

### gossipLowlandWages

They say the lowland wages are up again; two village boys have gone to try them. Their fields will be a pair of hands short at harvest, and everyone knows whose.

### gossipFuneral

A funeral over the ridge — an old man nobody here knew well. The village went anyway; the village always goes.

### gossipRiverMan

The village has it, by way of O-Yae, that the house keeps a man the river left. Some say lucky, some say the other thing. She reports both and owns neither.

### gossipMatchmaker

The matchmaker was at the headman's two days running. Nobody is saying whose name is on the table, which is how everyone knows it is serious.

### gossipTownRice

Word off the post road, third-hand by the time it reaches the board: rice is dear in the towns this year. Genemon writes something down.

### gossipWeddingMissed

Married out to the next valley: a charcoal-burner's daughter, in the house's harvest weeks. The news and the wedding sweets arrived a week apart, both a little stale.

### gossipGanzo

Ganzō at the well has the year of the great snow wrong again, they say, and will not be told. He was there; you weren't; that settles it.

<!-- quest-rewards · offer / complete / reward micro-copy for T0's
  combat-economy loops. Rewards are THINGS; no sums in prose. -->

### questWeirRatsOffer

River rats are at the leased screens again. Every slat gnawed through is coin owed across the water, and the day-book counts it whether anyone fights or not.

### questWeirRatsComplete

<!-- Redline 5: own-bank clause AND water-clean clause dropped. Matsuzō's
  speech line (questWeirRatsSpeech) carries the confirmation; F1's
  nodeWeirReedsBlurb carries the counting-from-his-own-bank. -->
The screens stand mended, slat by slat.

### questWeirRatsReward

Rat hides — stiff little things, but Yohei buys them by the bundle. The lease's damage line stays empty this season.

### questWeirRatsSpeech

<!-- speaker: matsuzo -->
Matsuzō: "Water's running clean."

### questGroveMonkeysOffer

The troop is in the vegetable rows again — seed, eggs, whatever lifts. What the rows lose, the board feels by week's end.

### questGroveMonkeysComplete

The troop breaks for the grove with the big male going last, unhurried, carrying nothing. The rows are the house's again.

### questGroveMonkeysReward

A monkey-dropped sack, recovered: seed-corn, half of it still good, and one of the kitchen's missing eggs, unbroken. O-Hisa takes the count without comment.

### questGroveMaleComplete

<!-- Redline 4: de-duplicated against mobMonkeyMale, which owns "goes over
  the wall last, at his own pace". Reworded here (borrowing the source's
  alternate "unhurried" rendering) so the two never render identical; the
  second sentence is kept verbatim. -->
The big male is the last to go, unhurried, and does not look back. The grove is quiet for a season's worth of nights.

### questOrchardDogsOffer

The old orchard is the dogs' yard, and the dogs have been bold since the lean winter. The fruit rots on the wild rows while the kitchen buys plums.

### questOrchardDogsComplete

The dens stand empty. What is left is work: wild rows to cut back, sound trees to find under the choke — the orchard becoming an orchard again.

### questOrchardReclaimReward

First fruit off the cleared rows — wind-fallen, wasp-bitten at the edges, and the kitchen takes every one. The day-book opens a line it has not carried in years: orchard.

### questMarginSettsOffer

The racks lose more each night — tanuki at the drying frames, a badger under the seed store. Harvest is a count, and the count is going backward.

### questMarginSettsComplete

The setts at the field margin are dug out and collapsed. O-Ume's plot borders the worst of it; she thanks the kami for the quiet, and means it.

### questMarginSettsReward

Hides for the stall, and the seed store's floor swept clean. Under the badger's sett, the thieved hoard: a winter of small theft, recovered in one dig.

### questNightRoundOffer

Kihei has drawn the night round: gate to kura to weir and back, every dark hour accounted for. The first round is walked together; after that, the post is at the gate.

### questNightRoundSpeech

<!-- speaker: kihei -->
Kihei: "Walk it once with me. Then it's yours."

### questNightRoundComplete

The round comes back to the gate with nothing to report, which is what a round is for.

### questNightRoundReward

The round-board hangs by the gate post now — a plain slat with the route burned in. Whoever walks the round turns it; whoever passes can see it turned.

### questTurnInSpeech

<!-- speaker: genemon -->
Genemon: "Entered."

<!-- perks · learned boxes (taste #13). `name:` recorded in a comment; the
  prose is the standalone description. Magnitudes are sim-owned. -->

### perkWhetstone

<!-- name: The Whetstone -->
<!-- Redline 3: the maxim clause "An edge kept is work saved:" cut — the
  sentence now opens at the concrete half. -->
Ten strokes on the stone each dawn, angle held shallow, both sides evened. The sickle bites all day on one honing.

### perkCarryingKnot

<!-- name: The Carrying Knot -->
A hitch that tightens under load and gives one-handed. Nothing roped with it shifts on the road, and nothing has to be tied twice.

### perkWatchPost

<!-- name: The Watch Post -->
Where to stand at the gate after dark: back to the lamp, face to the dark, where the yard's three paths meet in one eye-line. From there, nothing crosses unseen.

### perkWeirSlats

<!-- name: The Slats -->
How a weir screen goes together: green bamboo split with the grain, lashed wet so it tightens as it dries. A screen mended this way outlasts a bought one.

### perkOakStave

<!-- name: The Oak Stave -->
A stave cut to the hand that holds it: where to grip, how to stand, when not to swing. Ten motions, every dawn, in the same order.

### perkSecondCount

<!-- name: The Second Count -->
Count the coins into the palm, then out of it. Two counts, one answer, before the purse closes. Yohei counts fast; the second count is yours.

### perkRatRuns

<!-- name: The Rat Runs -->
Rats keep to their lines — wall edges, sill gaps, the dark side of the grain bales. Know the lines, and the watch is half stood before dark.

### perkForageBasket

<!-- name: The Basket -->
The woodlot's give, learned path by path: which mushrooms are dinner and which are a night in Sōan's sickroom, where the good kindling falls, what each season puts out and where it hides it.

<!-- field-guide · bestiary pages of Kihei's kept drill-yard book (kernel
  #6); folk-loaded animals played PLAIN in daylight. `name:` recorded in a
  comment; the prose is the page body. -->

### mobRatStore

<!-- name: Store rat -->
Comes for the grain along the wall lines after dark, night on night, by the measure. Bar the kura door low as well as high; a rat does not need much of a gap, and never needs it twice.

### mobRatRiver

<!-- name: River rat -->
Gnaws the leased screens at the waterline and dens in the reed bank. Wade the shallows at dusk with a stick and a sack; the work is wet and the count is honest.

### mobTanuki

<!-- name: Tanuki -->
Fat by autumn, boldest at the drying racks. The stories give it ten shapes; by daylight it has one — round, low, and gone at a shout. Dig the sett, or lose the racks nightly.

### mobBadger

<!-- name: Badger -->
Digs where the ground is soft and the seed is near. Slow to rouse and hard to stop once roused — never put a bare hand down the sett. It leaves when the digging costs it more than the seed pays.

<!-- mobOtter: CUT at migration (redline 2) — T1 content, omitted from the
  T0 bestiary surface. -->

### mobMonkey

<!-- name: Monkey -->
<!-- Redline 6: the antithesis close ("Drive them all or you have driven
  none") recast as plain craft; the guide keeps only ONE snap-close, at
  mobFeralDog. -->
Raids the rows in company, posts a watcher, carries off whatever lifts. Boldest in summer and through Bon. Drive off the whole troop at once, or the rest drift back by morning — they count you, too.

### mobMonkeyMale

<!-- name: The big male -->
Head of the grove troop, half again the size of the rest and unafraid of a stick. He goes over the wall last, at his own pace. If he has not moved, the troop has not moved.

### mobFeralDog

<!-- name: Feral dog -->
Dens in the old orchard; bolder in winter, boldest in a pack. It was somebody's dog once, or its sire was — it knows what a man is. Never run. Break the pack, and what is left is only dogs.

### mobMarten

<!-- name: Marten -->
Comes over the roof, not the wall, and kills more than it carries. The sign is the smell, and a small clean ruin where the coop was in order. Night work — take a light.

### mobWolf

<!-- name: Wolf -->
Comes down in a lean winter, alone, after the rats and the smell of stored grain. Big track, no sound, no waste. Do not stand a watch against a wolf without a fire at your back.

### mobMamushi

<!-- name: Mamushi -->
Patterned like dead leaves, thick for its length, short-tempered in the warm months; it holds its ground in the grass where a foot is about to land. The rat-snake is long, plain, and earns its keep in the kura — leave that one be. Know the two apart before the grass is high.

### nightRoundPost

<!-- Migrated VERBATIM from t0v2/u3-r3-grain-watch/take-b.md (THE PICK — the
  staged `native:` engine log lines HD-30 noted for "a later chunk"; C4.4/C4.8
  is that chunk). Emitted by src/core/night-rounds.ts on the round's begin;
  texture goes to the LOG, never the VN (bible §0.5). -->
The watch post is a stool, a hooded lantern, and the boar-spear leaning where Kihei left it. The round begins when you lift the lantern, and ends when you set it down here again.

### nightRoundRats

<!-- u3-B `night-round-rats` — the rats stage's aftermath (emitted on the won stage). -->
Rats in the store, where Kihei said. You learn the sound grain makes when something small is stealing it — a dry whisper under the floor, gone the moment you stop walking. The spear-butt does the rest. In the morning you sweep up what they spoiled and say what you took. The number is never nothing.

### nightRoundMarten

<!-- u3-B `night-round-marten` — the marten stage's aftermath; carries the gnawed
  seed-bale (the unconfessed loss the R4 board scene spends — rung-beats.md). -->
A marten, quick as spilled water, dead by more luck than spear-work. Behind the back bales, where it hunted, you find what the rats had all along — a seed-rice bale gnawed open at the seam, half gone into the walls. You make the count alone, by lantern, twice. It does not improve the second time. You bar the door on it and tell no one yet.

### nightRoundWolf

<!-- u3-B `night-round-wolf` — the survive stage's encounter read (the wolf-flees
  beat the code named and never emitted — the C4.4 closure). -->
At the kura door the lantern finds two eyes at the height of your waist, and the dark around them is the wrong shape for a dog. The bar is behind you. So is the rice.

### nightRoundNewMoon

<!-- u3-B `night-round-new-moon` — the hooded-lantern sighting on new-moon rounds
  (Toku's seed, unnamed until R5). Suppressed the round the sb-dog-coda VN plays
  (one lantern moment per round — TST1). -->
On the dark of the moon a lantern crosses the far edge of the yard — hooded low, held steady, going upstream. By the time the round brings you back the yard is empty, and in the morning no one has missed a lantern. It is not your watch's business. You watch for it anyway.

### nightRoundFall

<!-- u3-B `night-round-fall` — the sickroom wake after a fall (rides WITH the
  mechanical combat.loss line, which carries the costs). -->
You wake on Sōan's mat with daylight standing in the wrong place. Days gone, and the wages with them. He asks one question, writes two lines, and closes the ledger when you turn your head.

<!-- ── C5a unit 2 · the three bible-named hidden discoveries (ADR-146/ADR-167) ──
  tiers/t0.md's locked roster: the reeds bundle (the water-ruined paper — a
  mystery seed, T3 pays it), the silted sluice, the sett under the ruined wall
  (seed-only: no verb — T2 pays it). 3-take blind diverge, self-picked TAKE A
  ("found by hand"), one Pass-2 redline (settFound's rope maxim cut). Alternates
  in takes/c5a-discoveries/. Hint ladders tighten hint0→hint2 (ADR-146). -->

### reedsHint0
The reeds above the sill hold whatever the river gives up, and the work has never yet left time to go through them.

### reedsHint1
Mending the third screen, the pole snags in the reed roots on something that gives like cloth, not like root.

### reedsHint2
At low water a corner of dark cloth shows wedged in the reed roots off the third screen, silted to their color, an arm's reach down.

### reedsFound
Out of the reeds, a bundle: river-heavy, the cloth gone the color of the bank, tied off in a knot your hands undo without being told. Inside, wrapped twice against the wet, a single paper — the ink run to gray, not one word of it left.

### sluiceHint0
However the ditches are kept, the far paddies take their water last, and take it thin.

### sluiceHint1
The feed ditch goes in under the woodlot trees carrying more water than ever comes out the other side.

### sluiceHint2
At the woodlot edge the ditch ends against a bank of silt, and square-cut stone shows through where the rain has worked it.

### sluiceFound
Under the silt, cut stone and a lift-board seized in its groove: a sluice-gate, made well and left to choke. Clearing it is days of honest digging, and nobody at the house knows it is there to clear.

### settHint0
The racks nearest the old compound wall lose the most, season after season, whatever watch is set.

### settHint1
Cut off one run and the badger cuts another, and every one of them bears toward the foot of the old wall.

### settHint2
Behind the scrub at the wall's foot the ground is worked hollow, fresh earth thrown out from under the stones themselves.

### settFound
At the wall's foot the spade finds the sett's main gallery: old work, wider than the badger needs, going down under the stones and not coming up on this side. The digging stops at the stones.

<!-- ── C5a unit 4 · the per-grade day-book judge lines (ADR-159/ADR-167) ──────
  One line per grade of the locked six-step ladder, read AS THE VALLEY SEES IT
  (self-picked TAKE C — koku standing IS outside regard, TST3), one Pass-2
  redline (the counted-twice echo). The engine appends the arithmetic (+N koku);
  these lines carry none. Emitted by pillars.ts at the season judge; live-swap
  via the judge-flavor core overlay. Alternates in takes/c5a-judge/. -->

### judgeLineFail
On the village road the house's name is said in the low voice kept for endings. Nobody wishes it ill; the valley is only deciding, early, what its fields will come to.

### judgeLineBad
The house's word is worth less down the valley than it was: at the stall its name still buys, but the amounts are counted slowly.

### judgeLineOk
The valley lets the house be — greeted on the road, owed nothing, promised nothing. This year, being left alone is a kind of standing.

### judgeLineGood
Word goes down the valley ahead of the season's close: the gate is kept, the roofs hold, and the house's name is said plainly again, without the pause that used to follow it.

### judgeLineGreat
The road bends toward the gate again — a favor asked of the house, a cart that slows without needing anything. The valley has resumed expecting things of it.

### judgeLineExcellent
The season closes on a house the valley measures by once more: its name given first in any accounting of names, as it was given in years nobody thought would come back.

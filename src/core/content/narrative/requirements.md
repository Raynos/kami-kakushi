<!-- The hidden rung requirements (FB-121 / ADR-137) — the AUTHORING SOURCE OF
  TRUTH (FB-5); compiled to src/core/content/requirements.gen.ts by
  `pnpm run gen:narrative`. Each rung R0–R7 lists the finite requirements that
  ARE its progression: all done ⟺ the rung beat unlocks. The player never sees
  this list — only the rounded % bar and each completion's flavor line.

  Grammar (the WHOLE of it — real logic beyond it is a `native <key>` resolving
  into NATIVE_PREDICATES, never a grammar extension):
    ### req <id> · count <verb:subject> <N>     — N advance tokens (quest grammar)
    ### req <id> · flag <flag-id>               — a story flag turning true
    ### req <id> · state resource <res> >= <N>  — held resource predicate
    ### req <id> · state banked <res> >= <N>    — kura-banked predicate
    ### req <id> · state belonging <id>         — owned home comfort
    ### req <id> · state skill <id> >= <N>      — skill level predicate
    ### req <id> · native <key>                 — hand-written TS predicate
  Every req carries `flavor:` (the diegetic completion line, story voice) and
  `drive:` (the sim bot's satisfaction hint — Phase 5; if a req can't state a
  drive it shouldn't be authored yet).

  Counts are PROVISIONAL fun-first drafts scaled to the old meter's act-counts
  (R0 ≈ 5 min, climb rungs ≈ 10–15 min); the FB-4 sim re-derives the bands
  (ADR-132) and tuning is edit → gen:narrative → sim (no balance.ts mirror).

  storywave G4.1 — PROVISIONAL / OWED RE-DERIVATION (HD-30 closed 2026-07-09
  with the verb-token pass still OWED to the G4.2/G4.3 registry chunk; the two
  R7 {lord} lines were re-derived under HD-36, 2026-07-10): the two named
  redlines are applied — R3 gates the night-round wolf flag `wolf-survived-not-won`
  and R7 gates `nengu-reckoned`; and the R4 `smith`/repair requirement is
  retired (the T0 smith leaves the arc). The FULL re-derivation of every rung's
  count-verb tokens against the NEW verb/activity registry (rake · haul water ·
  night-round · …) is DEFERRED to the chunk that lands that registry (G4.2/G4.3) —
  re-binding verb tokens now would be inventing against a registry that does not
  exist yet. The pre-reboot flavor lines below are kept (valid, in-register)
  pending that pass; `gen:narrative` does NOT registry-check `count`/`flag`/`drive`
  tokens, so this file compiles green today. -->

## requirements R0

<!-- The cold open: prove you'll work through the spilled-stores night. Rake-centred
  per the locked design; the intro's Genemon scene IS the R0 beat. -->

<!-- Staged milestones (human, 2026-07-07): same-token requirements complete
  CUMULATIVELY (every rake advances all three tallies), so the climb is
  punctuated at 10 / 20 / 35 (ADR-148: timed actions — targets ÷ the per-act wall-cost ratio, round numbers) — three felt beats, identical total effort. -->

### req rake-the-first-rows · count act:rake_rice 10

flavor: "So he can work," {elder} says, in the way another man says good morning.
objective: The spill by the granary door lies raked into heaps.
drive: rake_rice

### req rake-through-the-night · count act:rake_rice 20

flavor: "Still at it," {elder} says, passing the granary door without stopping.
objective: Half the granary floor shows swept boards under the lamp.
drive: rake_rice

### req rake-the-spill · count act:rake_rice 35

flavor: "Dawn, and he is still raking," {elder} says to the dark, as if the dark had asked.
objective: At dawn the granary floor stands bare, wall to wall.
drive: rake_rice

## requirements R1

<!-- Kept hand: take to the fieldwork (absorbs the old 'farmed' story gate — the
  farm count implies it) and keep hauling at the forecourt. -->

### req first-rows-of-his-own · count act:farm_paddy 10

flavor: The first rows he plants alone come up as straight as anyone's.
objective: The first rows set alone stand straight in the water.
drive: farm_paddy

### req take-to-the-fields · count act:farm_paddy 30

flavor: The paddy women no longer point out which rows are his; he has learned them.
objective: The paddy stands planted, not a row out of true.
drive: farm_paddy

### req a-porters-back · count act:haul_stores 25

flavor: At the gate the porters shift a strap for him without being asked, as they do among their own.
objective: The carrying-pole is worn smooth where a new grip sits.
drive: haul_stores

## requirements R2

<!-- Yard-hand: the wider grounds — wood, the hills, the stores. The SILENT rung (a task
  simply not taken back; no granter beat). The wolf is GONE from R2 (G4 cutover): per the
  new ladder R2 is pure labour, and the wolf is R3's first night round (which latches
  `wolf-survived-not-won`, R3's gate). The stale `face-the-wolf · flag first-fight-survived`
  requirement (nothing in live play set that deleted-scripted-wolf flag) is REMOVED so R2→R3
  is reachable by real labour alone. -->

### req learn-the-woodlot · count act:woodcut_edge 20

flavor: The axe haft darkens where his grip has settled, and the stumps at the woodlot edge stand cut clean.
objective: Split wood is stacked head-high along the woodlot path.
drive: woodcut_edge

### req walk-the-hills · count act:forage_satoyama 25

flavor: The near hills give up bracken and mushrooms without a search; the basket comes home heavy before noon.
objective: The kitchen's drying racks are full of hill mushrooms.
drive: forage_satoyama

### req keep-the-stores-moving · count act:haul_stores 20

flavor: Bales pass the gate and none sit long; the storehouse floor shows bare wood where sacks once rotted.
objective: No bale sits long enough at the gate to sour.
drive: haul_stores

## requirements R3

<!-- Gate-watch: blood the blade on the estate's real pests without letting the
  rows fall behind (absorbs the old combat-blooded gate — the kills imply it).
  G4 cutover — the kill tokens are REPOINTED to foes REACHABLE at R3 (the pre-reboot
  `rice_rats`/`monkey` were unreachable: `rice_rats` names no live mob, and the monkey's
  grove opens only at R7). Now: `river_rats` at the leased weir screens (R3's room-weir-reeds)
  and `tanuki`, the folk field-thief, at the field margins (R2's room-field-margins) — both
  day-grindable at R3. The two flavor lines below are the authored canon kept verbatim; their
  fiction (kura-rats · "the monkeys") reads slightly off the repointed foes — a KNOWN fiction
  gap for narrative-diverge (owed; HD-30 closed without it), NOT invented here. -->

### req clear-the-kura-rats · count kill:river_rats 3

flavor: "Quiet in the kura tonight," {drillmaster} lets drop, cleaning his blade by lamplight.
objective: The weir screens hold whole, no rat-run gnawed through them.
drive: fight river_rats

### req drive-off-the-thieves · count kill:tanuki 2

flavor: "The monkeys have learned his shape," {drillmaster} is heard to say, almost pleased.
objective: The tanuki runs at the field margins lie empty.
drive: fight tanuki

### req the-fields-hold · count act:farm_paddy 15

flavor: "The fields don't miss him while he drills," {elder} notes, half to himself.
objective: Not a paddy lies untended while the watch is kept.
drive: farm_paddy

### req keep-the-rows · count act:farm_paddy 30

flavor: "Watch or no watch, his rows never fell behind," {elder} says over the evening rice.
objective: The rows run green to the bund with no gap.
drive: farm_paddy

### req timber-for-the-palisade · count act:woodcut_edge 25

flavor: "The palisade wood is his cutting," {drillmaster} says, striking a post with the flat of his hand.
objective: New posts stand in the palisade, pale against the weathered wood.
drive: woodcut_edge

### req the-wolf-survived-not-won · flag wolf-survived-not-won

flavor: The night the wolf came you stood between it and the stores, and were still there at dawn — bleeding, ribs cracked, the rice untouched. Not won. Survived.
objective: Blood on the granary step, and not a grain gone.
drive: the R3 first night round resolves its scripted survive-not-won wolf stage, setting `wolf-survived-not-won`.

## requirements R4

<!-- Kura-warden: the stores are yours to keep — goods, coin, and the tools that
  guard them. Repair opens at R4 (the smith's beat), so the mend belongs here.
  NOTE (2026-07-07, sim-measured): kill requirements above R3's rat/monkey tier
  are PARKED — the shipped combat curve walls them (wolf ≈0.2% in-loop win rate,
  bandit 0% at every T0 level; the axe needs boar-dropped hardwood, a
  chicken-and-egg). The predator-kill fiction ("thin the near wolves", "the
  fence-breaker", "clear the woodlot road") returns when combat tuning matures —
  combat above R3 stays the OPTIONAL grind lane it was tuned as. -->

### req a-load-among-loads · count act:haul_stores 25

flavor: The porters have stopped counting his loads against their own.
objective: The kura's floor is squared and roped, load by load.
drive: haul_stores

### req first-name-in-the-yard · count act:haul_stores 50

flavor: When the kura needs moving in a hurry, it is his name the yard calls first.
objective: A kura's worth of bales moves between dawn and dusk.
drive: haul_stores

### req the-stores-know-you · count act:haul_stores 75

flavor: New porters are told to watch how he stacks; nobody remembers deciding that.
objective: Every stack in the kura leans the same way now.
drive: haul_stores

<!-- G4 cutover — the `begs-for-the-drills · flag r4-drills-begun` requirement is REMOVED: no
  live mechanism sets that flag (the drill-yard verbs are a deferred G4 chunk), so it deadlocked
  R4→R5. The pupil-begs-for-drills beat still plays as R4's rung BEAT (RUNG_BEATS.R4); only the
  mechanical requirement is dropped until the drill-yard lands. R4 now gates on the haul ladder +
  the hundred-mon purse alone — completable by real labour. (HD-30: restore a drills requirement
  when the drill-yard verbs are built.) -->

### req a-hundred-mon-held · state resource coin >= 100

flavor: The house learns he keeps coin of his own, strung and counted, spent on nothing foolish.
objective: A hundred mon, strung and hidden in the north corner.
drive: sell rice

## requirements R5

<!-- House-servant: past the danger line, and a corner of the house that is
  actually yours (the bedding — you LIVE here now). -->

### req first-deep-baskets · count act:forage_deepwoods 10

flavor: The first deep-hill baskets come back full, and no one mentions the danger line twice.
objective: Deep-hill baskets stand full at the kitchen door.
drive: forage_deepwoods

### req past-the-danger-line · count act:forage_deepwoods 25

flavor: He comes back from past the charcoal-burners' marker so often the kitchen stops waiting up.
objective: The path past the charcoal-burners' marker is beaten flat now.
drive: forage_deepwoods

### req the-paddies-still-first · count act:farm_paddy 25

flavor: Whatever else he is now, the paddies get his mornings first, and {elder} sees that they do.
objective: No morning passes with the paddies left to wait.
drive: farm_paddy

### req a-made-corner · state belonging bedding

flavor: There is bedding in the north corner, bought with his own coin, and the maids sweep around it now.
objective: There is bedding in the north corner that no one moves.
drive: buy bedding

## requirements R6

<!-- Steward's man: the house's arithmetic — held coin, coin put BACK into the
  works — and the road kept safe for it. -->

### req the-count-comes-early · count act:haul_stores 25

flavor: "The store-room count is early this month," {steward} says, not yet naming why.
objective: The store-room is empty of unshifted bales by mid-month.
drive: haul_stores

### req the-ledgers-agree · count act:haul_stores 65

flavor: "The ledgers agree tonight," {steward} says, which is her whole praise.
objective: No sack goes missing between the gate and the kura.
drive: haul_stores

### req three-hundred-mon-steady · state resource coin >= 300

flavor: "His purse holds steady," {steward} lets fall, "which is more than this house has managed."
objective: Three hundred mon sit strung under the floorboard, none spent.
drive: sell rice

### req coin-into-the-works · native estate-u1

flavor: "He put his own coin into the kura-works," {steward} tells {elder}, twice, to be sure he heard.
objective: The kura-works stand mended with timber no lord paid for.
drive: buy estate_upgrade

## requirements R7

<!-- Trusted of the house: the top of the T0 ladder — the estate runs on your
  rhythm. Gates nothing today (no R8); it seeds the Phase-2 pillar grind.
  HD-36 (2026-07-10): the two {lord} lines re-derived UNSTAGED — Munemasa is
  heard through the wall, never met in T0 (bible t0/04-cast); alternates in
  takes/hd36-lord-unstaged/. -->

### req the-fields-run-on-you · count act:farm_paddy 20

flavor: "The fields keep a man's hours now, and not mine — if mine ever held them," comes {lord}'s voice through the screen of the inner house, unanswered; the yard knows whose hours he means.
objective: The fields keep his hours, and the water follows them.
drive: farm_paddy

### req the-woodlot-runs-on-you · count act:woodcut_edge 20

flavor: "Even the woodlot answers to him," {drillmaster} says to {elder}, who does not disagree.
objective: The woodlot is cut on his rotation, stand by stand.
drive: woodcut_edge

### req a-granary-against-winter · state banked rice >= 200

flavor: "There is rice against winter. There was a saying for that — I had it once," {lord} is heard saying to the dark of the inner house, and nobody who hears it goes in.
objective: The granary is full to the rafters against the winter.
drive: deposit rice

### req the-nengu-reckoned · flag nengu-reckoned

flavor: You stood in the room while the year was measured against the house — the reckoning read out, the gap named plainly and once, and nothing asked of you but to be there for it. A full year, lived through.
objective: The nengu bales stand roped at the gate, the year closed.
drive: sim reaches the Autumn season-exit, whose nengu ceremony sets `nengu-reckoned`.

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
  (ADR-132) and tuning is edit → gen:narrative → sim (no balance.ts mirror). -->

## requirements R0

<!-- The cold open: prove you'll work through the spilled-stores night. Rake-centred
  per the locked design; the intro's Genemon scene IS the R0 beat. -->

### req rake-the-spill · count act:rake_rice 500

flavor: The spilled stores are swept to rows; {elder} counts them without a word.
drive: rake_rice

## requirements R1

<!-- Kept hand: take to the fieldwork (absorbs the old 'farmed' story gate — the
  farm count implies it) and keep hauling at the forecourt. -->

### req take-to-the-fields · count act:farm_paddy 600

flavor: The paddies answer your hand now; the green rows stand straighter for it.
drive: farm_paddy

### req a-porters-back · count act:haul_stores 400

flavor: The porters stop watching you lift. That is its own approval.
drive: haul_stores

## requirements R2

<!-- Trusted hand: the wider grounds — wood, the hills, the stores — and the
  humbling scripted wolf (absorbs the old first-fight-survived AND-gate). -->

### req learn-the-woodlot · count act:woodcut_edge 350

flavor: The woodlot edge knows your axe; the stack by the kura grows even.
drive: woodcut_edge

### req walk-the-hills · count act:forage_satoyama 350

flavor: You come back from the hills with full baskets and no bad stories.
drive: forage_satoyama

### req keep-the-stores-moving · count act:haul_stores 300

flavor: A hand that keeps hauling after the field work is a hand the house notes.
drive: haul_stores

### req face-the-wolf · flag first-fight-survived

flavor: The grain-store wolf is faced. The story runs the estate faster than you walk it.
drive: face_wolf

## requirements R3

<!-- Gate-watch: blood the blade on the estate's real pests without letting the
  rows fall behind (absorbs the old combat-blooded gate — the kills imply it). -->

### req clear-the-kura-rats · count kill:rice_rats 3

flavor: The rats learn the kura has teeth again.
drive: fight rice_rats

### req drive-off-the-thieves · count kill:monkey 2

flavor: The paddies' thieves grow careful where you stand a watch.
drive: fight monkey

### req keep-the-rows · count act:farm_paddy 400

flavor: Watch or no watch, your rows never fall behind — {drillmaster} marks that.
drive: farm_paddy

### req timber-for-the-palisade · count act:woodcut_edge 300

flavor: Timber for the palisade, cut on your own hours.
drive: woodcut_edge

## requirements R4

<!-- Kura-warden: the stores are yours to keep — goods, coin, and the tools that
  guard them. Repair opens at R4 (the smith's beat), so the mend belongs here. -->

### req the-stores-know-you · count act:haul_stores 450

flavor: The stores move through your hands like they were born to it.
drive: haul_stores

### req mend-your-own-blade · count act:repair_weapon 1

flavor: A blade mended by its own bearer — {elder} hears of it from {smith}.
drive: repair_weapon

### req thin-the-near-wolves · count kill:wolf 2

flavor: Two wolves fewer on the near hills; the herders sleep easier.
drive: fight wolf

### req a-hundred-mon-held · state resource coin >= 100

flavor: A hundred mon of your own keeping. The house trusts a hand that can hold money.
drive: sell rice

## requirements R5

<!-- House-servant: past the danger line, and a corner of the house that is
  actually yours (the bedding — you LIVE here now). -->

### req past-the-danger-line · count act:forage_deepwoods 200

flavor: The deep satoyama yields to you now, a hill past where the others turn back.
drive: forage_deepwoods

### req the-fence-breaker · count kill:boar 1

flavor: The boar that tore the fences is down. The field hands say your name differently.
drive: fight boar

### req the-paddies-still-first · count act:farm_paddy 300

flavor: The paddies still come first. They always came first.
drive: farm_paddy

### req a-made-corner · state belonging bedding

flavor: A made bed in your own corner — you live here now, and the house knows it.
drive: buy bedding

## requirements R6

<!-- Steward's man: the house's arithmetic — held coin, coin put BACK into the
  works — and the road kept safe for it. -->

### req the-ledgers-agree · count act:haul_stores 400

flavor: The ledgers and your shoulders have stopped arguing with each other.
drive: haul_stores

### req three-hundred-mon-steady · state resource coin >= 300

flavor: Three hundred mon held steady through a season's spending.
drive: sell rice

### req coin-into-the-works · native estate-u1

flavor: The kura-works stand a stage better for coin you put back into the house.
drive: buy estate_upgrade

### req clear-the-woodlot-road · count kill:bandit 1

flavor: The man who watched the woodlot road watches nothing now.
drive: fight bandit

## requirements R7

<!-- Trusted of the house: the top of the T0 ladder — the estate runs on your
  rhythm. Gates nothing today (no R8); it seeds the Phase-2 pillar grind. -->

### req the-fields-run-on-you · count act:farm_paddy 400

flavor: The house's fields run on your rhythm now, not the other way around.
drive: farm_paddy

### req the-woodlot-runs-on-you · count act:woodcut_edge 400

flavor: The woodlot's stack stands winter-deep, and it was your axe that made it so.
drive: woodcut_edge

### req a-granary-against-winter · state banked rice >= 200

flavor: The granary holds deep against winter, and the ledger names you for it.
drive: deposit rice

### req no-argument-unanswered · count kill:boar 2

flavor: The deep woods hold no argument you haven't answered.
drive: fight boar

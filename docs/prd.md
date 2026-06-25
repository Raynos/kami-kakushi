# Kamikakushi — Product Requirements Document (PRD)

> **Status: DRAFT — under section-by-section review.** Nothing here is locked until it is reviewed
> with the human and recorded as an ADR in [`history/decisions.md`](history/decisions.md). No code is
> written until §7 (the roadmap) is approved.
>
> **Working title:** *Kamikakushi* (神隠し, "spirited away"). A single-player, story-driven
> **incremental RPG** set in Edo-period rural Japan, built as a static HTML5 + TypeScript web game,
> deployable to itch.io.

## How to read this document

This PRD plans the **whole saga in full detail up front**, but is **authored and reviewed one section
at a time**. Each section is drafted in full, walked through with the human, revised, and its load-bearing
decisions locked as ADRs before the next section is drafted.

| § | Section | Status |
|---|---------|--------|
| 1 | Vision, pillars, factions, world & endgame | **DRAFT — integrated; awaiting final review** |
| 2 | Systems & mechanics catalog | _not started_ |
| 3 | Incremental unlock ladder (UI-as-progression) | _not started_ |
| 4 | Combat, progression & balance model | _not started_ |
| 5 | Full act-by-act narrative & content | _not started_ |
| 6 | Tech architecture & data model | _not started_ |
| 7 | Milestone roadmap, v1 scope & deployment | _not started_ |

---

# §1 — Vision, Pillars, Factions, World & Endgame

> **DRAFT — integrated; awaiting final review.** This section is authored end-to-end from the locked
> decisions canon ([`../brainstorms/2026-06-25-locked-decisions.md`](../brainstorms/2026-06-25-locked-decisions.md))
> and the three redesign discovery docs (estate & combat; world-expansion factions; endgame & influence
> rebalance). It supersedes every earlier framing of §1. Tiers are renumbered **T0–T4** (0-indexed)
> throughout; v1 scope is **T0–T2 complete**, with **T3 a stub cliff-hanger** and **T4 a roadmap**.

## 1.1 Vision

You are a **mediocre young man** (~18–20) — weak, slow, unskilled, and nameless — pulled half-drowned from
a mountain river and taken in, out of plain kindness, by the **Kurosawa**: a proud, threadbare
lower-samurai (*goshi*) house two generations past its grandeur and quietly drowning in inherited debt. You
begin as "another mouth," with no place at the table. Through nothing but **daily toil, drills, and a
refusal to quit**, you earn your keep, then their trust, then your name on the household roster — and you
climb, rung by sweat-bought rung, from taken-in stray to the lord's right hand and the **architect of the
house's revival**.

As you rise, the world you can reach grows with you: first the **estate**, then the valley **village of
Asagiri**, then the **region**, then the domain's **castle-town**, and finally **indirect, mediated
recognition at Edo** — until the Kurosawa name stands **restored *and* surpassed** beyond anything it held
three generations ago. The estate-rise *is* the perseverance fantasy at grand scale, and it is the same
motion as the game's **signature feature: the UI itself unlocks as you progress** — minute one is one verb
and a persistent event log; every panel, tab, resource, skill, and area thereafter fades in one at a time,
each reveal a story beat, never silent menu growth.

Two grounded side-threads run quietly beneath the climb and pay off only in **feeling, allies, and flavour
— never in power**: a grieving village is certain you are **"Tama,"** their child spirited away ten years
ago (the estate flatly disbelieves it; to them you are simply a farmhand), and a **recurring dream** slowly
returns the memory of who you truly were and the living family who will come to back you. **Nothing
supernatural ever happens; every omen resolves to a human or natural cause; every climbing number is earned
sweat.** This is the **dignity of a nobody — and a dying house — becoming someone real, by hand**, and
forcing a forgotten name to be spoken at the capital. Built as a **pure, deterministic TypeScript core**
(one seeded RNG, data as single source of truth) with a thin DOM renderer, shipped as a static HTML5 build
for itch.io.

## 1.2 Design pillars

1. **The estate-rise is the spine — a perseverance fantasy at grand scale.** The single load-bearing track
   is the protagonist's climb up the Kurosawa service hierarchy fused to the house's outward expansion
   across **five influence tiers** (T0 estate → T1 village → T2 region → T3 castle-town → T4 Edo). Rising
   through the ranks and restoring-then-surpassing the house **are** the main quest. There is **no reset of
   any kind**: tiers *replace* prestige; everything persists as the canvas grows.

2. **Fractal incrementality.** Every new zone, area, faction, skill, and rumour is **itself incremental**:
   you arrive minimal (one contact, one place, one verb), slowly learn its people and systems, and never
   get overloaded — **everything unlocks.** The whole-game UI-reveal motion repeats in miniature at every
   frontier. Concretely: a drill yard reveals one post, then a rack, then sparring slots; a new region is
   one road, one threat, one contact.

3. **Lean and high-impact — no fluff, no half-built features.** Grinding/slow growth is the core, not
   filler. When scope balloons, **split into "immediate" vs a parked "later"** bucket (e.g. §1.7 →
   §1.7 + §1.7.1) — *park, don't delete.* v1 is deliberately small: **T0–T2 complete**, an **~8-rung early
   rank ladder**, **~5 mobs**, **~4 quest types**, a **~6–8-node world cut-set**. (This honours the standing
   "start lean, add pieces back deliberately; don't over-build" preference.)

4. **Combat is a first-class core pillar, alongside labour.** Combat uses an **idle auto-resolve + active
   setup** model (prepare gear/stance/area; a deterministic seeded fight resolves; you intervene with
   stance/ability/item/retreat — low-APM, strategic). It carries the five classic-RPG combat systems
   (character combat level; weapon/martial skills; a grounded bestiary; loot + equipment you **FIND and
   CRAFT**; gear progression) and **earns House Influence** via the Arms pillar (clear bandits, secure
   roads, defend the estate). The mediocre-start contract holds on the combat track too: start weak, the
   first real fight is humbling/near-fatal, capacity is earned through labour-built conditioning, with **no
   labour→combat training-rate cross-feed** and no hidden edge. Daily texture stays **peaceful labour
   dominant**; combat is the strong mid-game-onward second pillar.

5. **The core loop is the MC's OWN actions.** Combat, skills, jobs, crafting (classic RPG). The meta
   (Influence, tiers, ranking) sits *above*, fed by his grind. Building structures and recruiting members
   are **flavour / light systems wired to the reveal bus — NOT a people-management sim**. The dominant
   minute-to-minute behaviour is the incremental grind — **the hero getting better at what he does.**

6. **No hidden edge, ever.** No bloodline, no secret training, no weapon that "answers to him," no body
   that "remembers." The **porter's-knot habit** and the **recurring dream** are identity flavour with
   **ZERO mechanical bonus** — memory grants *access*, not power. The talent-foils (Hanzaki, the rival heir,
   Rival House Tomita) are always **trained, lucky, or ruthless — made, not born.**

7. **Grounded Edo folk-mystery — folklore is light flavour; quests are open-ended.** Every belief/omen
   resolves one-to-one to a human/natural cause; a thin, **capped-at-≤1**, off-screen margin of ambiguity is
   kept for unease only. Folklore arrives as optional tidbits via the village inn's **rumours board**, which
   unlock organically as the estate and village grow. Quests are a **suggestion + a story the player finds
   out in the world**, never an A→B→C waypoint list; fewer checklists overall.

8. **Deterministic, testable, generated.** Pure-core boundary (no DOM in logic), one seeded RNG, save only
   non-derivable state, generate balance/content docs from the same data the game runs on, and a DEV-only
   play API so every unlock and pacing beat is headlessly regression-tested.

## 1.3 Premise & tone

> *A mediocre young man wakes injured and nameless in the storehouse of the Kurosawa, a declining
> lower-samurai (goshi) house in a remote mountain valley, having been found half-drowned and pulled from
> the river out of plain kindness. The grieving village below is certain he is Tama, the child spirited away
> ten years ago; the estate flatly disbelieves it. Through daily toil, drills, and a refusal to quit, he
> rises through the estate's service ranks from "another mouth" to the lord's right hand and the architect of
> its revival, hauling the house from near-foreclosure up an outward climb of influence — valley, region,
> castle-town, and finally recognition at Edo — until the Kurosawa name is restored and surpassed.*

**Tone:** grounded, warm, bittersweet **Edo folk-mystery** wrapped around a cozy, satisfying **restoration
fantasy** (mid-Edo, stable and commercial, ~18th century, kept **fictional** — no real place or daimyo
names). The dominant texture is peaceful Edo labour (farm, forage, woodcut, fish, craft) over a *koku*/rice
base economy — numbers-go-up as honest sweat — with combat as a dangerous, earned second pillar. Beneath the
warmth runs a quiet grim undercurrent: a house broken by an ancestor's failed venture, a village grieving a
child it nearly sold, official negligence dressed as fate. The darkest material is handled with **off-screen
restraint** and counter-weighted by found-family warmth. The catharsis is **never power** — it is a nobody
becoming someone real by his own hands, and lifting a dying house back into the light. Justice, where the
side-mysteries reach it, is **partial**: the reachable culprits answer, the truly powerful largely escape —
the same thesis made structural by the honest **ceiling** at Edo. Relationships are **narrative-only** (no
dating-sim).

## 1.4 The protagonist & the mediocre-start contract

The protagonist is an **authored, fixed male character** (~18–20) — there is **no name/appearance/gender
creator and no player rename**. He is the same person in every playthrough. The village calls him **"Tama"**
(the borrowed legend-name) for most of the game; his true name — **Tahei**, a plain commoner name — returns
to him as a **late, de-emphasised side beat** in the origin thread (identity is explicitly a side thread, not
the spine's climax). The **fixed male gender is load-bearing**: the village's legend has drifted to
"remember" the real lost child as a *boy*, when Tama was in fact a *girl* — a fair, re-readable clue that
only works if the protagonist is fixed-male.

**The mediocre-start contract (binding, enforced in writing *and* code).** He is **NOT a bedridden invalid**;
he can rest and recover a little in the first hours, but he **starts weak and slow** — unskilled, low-stat,
soft-handed, slower than the boy who shows him the paddy, blistering on the first hoe. His one genuine asset
is **temperament**: stubbornness, a strong back, a patient temper, a refusal to stop getting up. He grows
**only** through perseverance, repetition, rest, technique, and crafted tools. The answer to a wall is never a
magic item, only more reps and better tools. Combat capacity is gated entirely behind labour-built
conditioning, and the first real fight is humbling and near-fatal — motivating training.

**No-hidden-edge guardrails (binding):**

- **No hidden edge, ever.** No bloodline, secret training, weapon that "answers to him," or body that
  "remembers" combat. The one thing the village treats as special — that he is the returned Tama — is
  **false.**
- **The porter's-knot rule.** He sometimes ties a porter's/labourer's load-knot on instinct. This is
  **procedural body-memory** (like still knowing how to walk after amnesia), framed as a labourer's habit
  ("huh, you've hauled before") — a **narrative identity clue only, ZERO mechanical bonus.**
- **The dream rule.** The recurring dream is **returning autobiographical memory only** — never clairvoyance,
  never a psychic tether, **ZERO mechanical bonus.** It returns only things he actually lived; it never
  surfaces facts he could not have known firsthand. What memory grants is **access**, not power.
- **Growth is grind, not gift.** No returning memory or instinctive habit ever grants a starting stat,
  recipe, tool, or combat bonus.
- **The talent-foils are made, not born.** Hanzaki, the rival heir, and Rival House Tomita are always shown
  as trained, lucky, or ruthless — never innately gifted in a way the protagonist could not match by work.

## 1.5 Factions

Three starter factions span T0–T2, deliberately distinct in **shape** so they never read as one bar painted
three colours. They share an economy and the Tama-vs-farmhand allegiance, and the side factions **feed the
spine without ever gating it.** More factions/zones bloom per tier beyond the three starters (see §1.7.1 and
§1.11); each is itself incremental and side content never blocks the spine.

### 1.5.1 ESTATE — the Kurosawa *goshi* household (MAIN — a fresh rank ladder PER TIER)

The **Kurosawa** hold a modest hill estate in **Asagiri valley** — proud, threadbare, working much of their
own land, quietly drowning in a ruinous debt inherited from grandfather **Sadamune's** failed flood-control
venture. This is the **only** faction structured as a discrete, gated **rank ladder**, because rising through
it *is* the perseverance fantasy and the dominant driver of the UI-reveal. **A fresh rank ladder is minted
per tier** (per-tier service/standing hierarchies); **rungs interleave LABOUR and COMBAT as twin paths up**,
and **combat earns standing** alongside labour. The estate **cast and buildings GROW per tier** — the player
builds structures and recruits members, framed as **flavour / light systems, not a management sim**. The
household flatly **disbelieves** the *kamikakushi* legend — to them he is a reliable hand who became a
fighting one.

**Twin earned currencies** drive the ladder: **Estate Service XP** gates the big labour promotions; **Combat
Deeds** gates the martial ones; smaller responsibility/perk drips fill between gates so there is always a
"next reveal" on either track. **Labour conditioning is a one-way enablement gate** on combat rungs (it
unlocks them; it grants ZERO combat stat bonus). The capstone rung **confirms** (does not first-open) the
higher macro tiers — Influence has gated those in parallel.

**v1 early ladder (T0–T1, ~8 rungs)** — interleaving **exactly two combat rungs** (R4 humbling-fight floor,
R6 first combat-earned standing) inside the labour spine. Grander martial titles are **aspirational narration
only**; default to humble household/ashigaru-tier titles. *(Patrol-leader / expedition / captain / overseer
rungs and the full 15-rung braid are parked for T2+ — see §1.7.1 and §1.14.)*

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **R0 — Stray / "another mouth"** | labour | Found half-drowned and taken in; survive convalescence and the first labour. *(Met at the open.)* | The *kura* storehouse (one room, one verb); the body/rest bar and rice counter; the bare diegetic estate dashboard. |
| **R1 — Day-labourer (*hiyatoi*)** | labour | Chief Steward **Genemon** ("another mouth, soft and clumsy") assigns the first real work; complete it, earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the *koku* heartbeat); the basic labour loop and first producers. |
| **R2 — Bonded hand (*genin*)** | labour | Sustained, reliable labour across a season; Genemon grants a place on the household's books. | Foraging, woodcutting, hauling; the stables & woodlot edge; the porter's-knot beat surfaces; the **Skills tab** reveals. |
| **R3 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger; defend the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); **errands beyond the estate — the VILLAGE TIER opens here.** |
| **R4 — Yard-hand under arms (*buke-hōkōnin*)** | **combat (entry)** | Conditioning floor (R2-level Estate Service: "the spear is just a long hoe held with intent") + **SURVIVE the humbling, near-fatal first fight**, then beg **Jūbei** for drills. The deliberately-incompetent floor of the combat ladder. | The drill yard; the **Combat panel** + idle-combat/training; first crude weapon + **Equipment & Inventory**; the **Bestiary**. Combat stats start near-zero. |
| **R5 — Foreman of works (*kogashira*)** | labour→mgmt | Demonstrate command of a labour-gang and a managed sub-economy; the first *shinden* reclamation begun. | The workshops and granary; a labour-gang to assign (Sota, Mago, seconded hands as idle producers); the first managed sub-economy; +1 helper slot; the **assignment/management panel**. |
| **R6 — Gate-guard (*monban*)** | combat | Stand a real watch; survive pest/animal clears; weapon-skill milestones reached. (Combat Deeds gate; conditioning floor at R5.) | Estate-defence duties; the near-satoyama hunting grounds; **PEST-CONTROL / HUNT / CLEAR** quest types; loot + craft (Smith Gonta spearheads via the component chain); **the FIRST combat-earned standing.** |
| **R7 — Bailiff of the home fields (*jitō-dai*)** | labour→mgmt | First reclamation recorded; the house edging toward solvency; the lord begins to notice. | Field administration; **House Influence made visible and tracked** (the four-bar standing panel); cash-crop and proto-industry levers come online; the **tier-expansion map**. The capstone bridge to the next tier. |

> **Estate physical growth runs *ahead* of top personal rank** (buildings gate on Influence band + a **low**
> rank floor + cost, not the capstone). v1 covers estate stages **E0 — Foreclosure's Edge** (leaning gate,
> cracked *kura*, fallow paddies, a rusty door-bar) → **E1 — Stabilising** (kura patched, first *shinden*
> reclaimed, drill yard cleared, gate night-watch) → **E2 — Recovering** (granary, two workshops, a low
> palisade, 2–3 men-at-arms on a rota). Stages E3–E5 (fortified seat → restored-and-surpassed) are parked
> (§1.7.1). Estate growth pulls **seconded/recruited** faces; the village's own cast does not balloon.

### 1.5.2 VILLAGE of Asagiri (SIDE — a static reputation web)

A rich side faction shaped deliberately **unlike** the estate: instead of one rank ladder it is a continuous,
**multi-node reputation web**. Its cast is **mostly static** (it is a reputation web, not a recruitable
roster). It is the home of the *kamikakushi* / "are you Tama?" legend, which the villagers **believe** and the
estate does not; folklore lives here as **light flavour**, delivered through the inn's **rumours board**.
**Village standing NEVER gates the UI ladder or the tier climb** — ignoring it leaves you only poorer and
lonelier, a viable-but-poorer playstyle, never a wall.

Several **continuous meters** rather than one ladder:

- **Per-shop "patron/regular" standing** (smith, dry-goods/rice broker, herbalist, brewer, weaver) — each
  unlocks stock, discounts, and exclusives, and high standing **softens the market-saturation price-crash**.
- **Per-family goodwill**, raised by **open-ended help** (you hear a family has trouble and figure out how to
  help — never a checklist).
- An **artisans'/craft-guild standing** gating recipes, component tiers, and master-craft commissions.
- The **Village Chief's regard** — headman (*shōya/nanushi*) **Yagoemon**, a weighted roll-up of the others
  plus chief-specific quests.

Curves are **gentle** (linear/soft-cap) for frequent small dopamine across many nodes, contrasting the
estate's steep geometric rank gates.

### 1.5.3 ORIGIN — his living family & friends (SIDE — a memory-gated support track, opens at T2)

The protagonist's **original family & friends** are **living** people in a nearby post-town
(**Sawatari-juku**, an invented town on an unnamed *kaidō*, a day-plus down the road) — **not** the local
village. His true name is **Tahei**; his old life was as a young porter/errand-hand for a small
transport-and-goods house. This track is a memory-gated, late-blooming **support track**, NOT grindable from
day one. It stays dark — foreshadowed for hours by the dream so its absence reads as anticipation — and
**opens at T2 (the region tier)**, when the dream has returned enough memory **AND** the protagonist's
standing lets him physically travel the controlled *kaidō* (*sekisho* checkpoints make free travel
impossible without standing). It then opens as per-contact **"restored ties"** — discrete one-time milestones
(mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart **Ohana**, the
porter-guild).

Payoff is **support, not local power**:

- **Pride/morale** — a modest global skill-XP/producer buff framed as a **new present-day relationship** ("a
  man with people behind him works harder"), **never a retroactive gift from remembering.**
- **Allies** — old porter/guild mates recruited to the expansion.
- **Trade ties** — origin-town goods, contracts, and ready-made caravan/porter routes that plug into the
  estate's region/castle-town/Edo expansion.

**Hard guardrail:** returning memory grants **access only** (new nodes/allies/quests unlock narratively) and
**ZERO mechanical bonus**; every asset must still be grind-built. At least one origin beat is always available
**without** reputation-gating, so the thread never fully stalls. (The re-foundable **Kuzuhara** birthplace and
the wider post-town commercial region are T2+ expansion nodes — see §1.7.1.)

### 1.5.4 How the three interrelate — and the Tama-vs-farmhand allegiance

**Separate currencies** keep them from collapsing into one bar: **Estate Service XP** (steep geometric) and
**Combat Deeds** (the estate's twin spine currencies), **Village Reputation** (gentle per-node meters), and
**Origin Ties** (discrete memory milestones). Above all of them sits **House Influence**, the macro-resource
the estate spends to expand: the estate generates it directly, while village allies and origin trade-ties act
as **multipliers/feeders** — they don't unlock the next tier, they make conquering it faster and cheaper
(tuned so weaving both in roughly **halves** time-to-next-tier — *felt, never a wall*).

**Tensions (chosen, not bugs):** high estate rank can hand duties that **extract** from the village (collect
the rice quota), raising Estate Service but denting Village reputation — with an always-available "soften it
quietly" option the side-mystery rewards. The legend pulls both ways; the origin pulls him down-valley while
the spine pulls him deeper in. **Faction tension is light / flavour — no mechanical penalty.**

**Synergies:** village allies become idle producers seconded to estate works; origin trade-ties become the
supply chains that make region/Edo expansion affordable; high estate rank grants the standing and safe-passage
to even reach the origin town.

**The Tama-vs-farmhand allegiance** is a **continuous, re-swingable leaning** (village-leaning ↔
estate-leaning, default neutral, never frozen) the player nudges through dialogue and where he invests labour.
Leaning **"I am Tama"** warms the village (faster rep, grief-coded content, Bon rites) at slight friction with
the estate (slightly slower trust beats, **never blocked**). Leaning **"just a farmhand"** smooths estate
trust at the cost of village warmth and Tama-only lore.

> **Critical rule:** the choice rebalances **rates and flavour, never availability** — both factions remain
> fully completable on either lean; neither is the "good" path; staying ambivalent is a valid in-character
> stance. The spine is restored-and-surpassed fastest and richest when all three are woven together, but is
> still completable spine-only, just slower and lonelier.

## 1.6 House Influence (家威) — the four pillars & the five tiers

**House Influence** (家威, *ka-i*) is the macro-resource — the estate's **recognized standing** in the eyes of
progressively wider authorities — and the **one thing the entire UI-reveal is gated on.** It is deliberately
**NOT** *koku* and **NOT** coin: those are the inputs you spend and grind; Influence is the cumulative score of
what the house has visibly **become.** It is no longer a single trade-leaning number: it is the **umbrella
roll-up of FOUR achievement-driven pillars** grown in lockstep, each mapping to a distinct protagonist domain
so the grind stays load-bearing.

### 1.6.1 The four pillars

| Pillar | Kanji | Protagonist domain | Grows on |
|---|---|---|---|
| **Arms** (martial) | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognised martial deeds (a road declared safe; a nest cleared; the grain store defended; a rival's enforcer broken) + seasonal security results |
| **Estate & Wealth** (economic) | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation), **TREASURY** (debt→solvency→creditworthiness, *goyōkin*), **TRADE** (routes, broker standing, the optional *meibutsu*) |
| **Standing & Office** (political/territorial) | 政威 *sei-i* *(coined — see below)* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed (named on the roster; the bailiff duty; a dispute arbitrated; a valley allied) |
| **Name & Honour** (prestige/cultural) | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition; the house off the foreclosure list; a sponsored rite; an inspector's report; a recorded merit-elevation |

> **Trade is demoted to 1-of-3 sub-engines inside Estate & Wealth and hard-capped to ~⅓ of that one pillar**
> — so a pure-trade run maxes ~⅓ of one of four pillars and can never dominate. The famous *meibutsu* that was
> once the whole endgame is now **one optional capstone in one sub-engine of one pillar.**
>
> **Authenticity flag:** 政威 *sei-i* is a **coined compound**; an attested alternative is **領 *ryō* /
> "territorial sway."** Confirm at the §4/§5 authenticity-harden (see §1.13).

### 1.6.2 Accrual

Influence accrues in **two shapes only — never a passive time-trickle and never a flat per-action increment:**

- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded yield, a
  granted title, a sealed contract, a road declared safe in the books, a won petition). Per-event caps carry
  over from the Combat-Deeds discipline so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (not repeatable maintenance awards).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable dents** (a lost battle
dents Arms; a scandal dents Name; a called debt dents Estate) — small and **never a wipe** (no permanent
holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by rebuild).

### 1.6.3 The five tiers, transition story gates & per-tier required-pillar gating

Tier-up is **not** crossing a single band: it is a **four-value gate** — a **balanced-development floor**
(clear ALL FOUR per-pillar minimums) plus **capped overflow-substitution (≤25%)** so a strong pillar partly
carries a lagging one. This structurally forbids a pure-trade or pure-combat tier-skip. **Per-tier weighting
drifts:** early tiers weight **Arms + Estate** ("survive and get strong"); upper tiers weight **Office + Name**
("win it socially"). Side factions are **multipliers** into the pillars, never new pillars. The full five-tier
climb is paced over a **generational/decadal in-world span** for the upper tiers (T3→T4), so "restore *and*
surpass" reads as earned over years.

| Tier | Theme | Transition story gate (entry) | Required-pillar weighting |
|---|---|---|---|
| **T0 — Estate** | Earn your keep and a place at the table. One declining hill estate, unlocked room by room. | *(Met at the open.)* Survive convalescence and the first labour. | **Arms + Estate** (humbling first fight survived; first *shinden* begun; kura solvent). |
| **T1 — Village** | The estate as a presence in its own valley: Asagiri's shops, craftsmen, inn, shrine, and the legend. | **T0→T1:** do enough estate work + complete **basic repairs** → the estate sends you out into the village. | **Arms + Estate**, first **Office** (errand-authority; the headman's regard; cash-crops online). |
| **T2 — Region** | Reach beyond the home valley: a cluster of valleys, the post-town, the upstream Kuzuhara ruins, roads, *sekisho*. | **T1→T2:** **"clean your room"** (estate healthy, village happy, immediate fires out) → the lord first believes impact beyond the estate is possible → a quest to grow **regional influence**; the region introduces **rival samurai houses** with more sway to surpass. | **Estate + Office** rising; **Arms** secures roads; the **personal-mystery payoff** lands here. |
| **T3 — Castle-town** *(stub in v1)* | Be reckoned with by the people who actually rule: the castle-town, *daikan*/*tedai*, inter-*han* markets. | **T2→T3:** **win the region** (rival houses no longer the leaders) → the castle-town rulers **confer regional leadership** and **invite** the house in. | **Office + Name** dominant (the takeover is won socially); Arms/Estate as leverage. |
| **T4 — Edo** *(roadmap)* | Recognition at the capital — restore **and** surpass the grandeur of three generations ago. | **T3→T4:** a **"taste of Edo"** — the house is **forced to build & fund an Edo estate** → grow influence → the **national** tier. | **Name + Office** (the national *banzuke* ranking on all four pillars). |

> **Castle-town takeover = MULTI-ROUTE** (peaceful: office / economy / marriage / out-maneuvering rivals; AND
> assertive: martial-security leverage). "Take over" = becoming the **dominant house holding key domain
> offices** — **never open rebellion against the bakufu.** Martial scale is **hard-capped** throughout: a small
> named retinue plus temporary corvée/levies for crises, **never a standing army.**

## 1.7 World & areas — v1 IMMEDIATE (T0–T2)

The estate-rank climb spatially **embodies** the tier escalation: you start trapped in one storehouse room and
earn the rest of the estate room by room (the rank ladder made of doors), then the village, then the
wilderness (by conditioning), then your own past (by memory). Each tier opens a fresh, larger canvas — **no
reset** — and every frontier is **itself incremental** (arrive minimal, learn its people and systems). The
wilderness is a **shared danger gradient gated by conditioning**, distinct from the Influence-tier authority
canvas. v1 ships **full maps** for T0–T2 within a **~6–8-node cut-set** (the rest parked in §1.7.1).

| Area | Region (tier) | Faction | Notable locations | Unlocks when |
|---|---|---|---|---|
| **The Kura Storehouse** | Kurosawa Estate (T0) | Estate | The convalescence pallet; spilled rice to rake | At the open (R0, Stray). Home of the UI-reveal engine (body/rest bar, rice counter). |
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate (T0) | Estate | The *genkan*; the visitor's mat | R1. The diegetic stage for promotions and the Tama-vs-farmhand framing. *(Stables/woodlot edge may fold in here to avoid early reveal fatigue — see §1.14.)* |
| **The Home Paddies & Dry Fields** | Kurosawa Estate (T0) | Estate | Fallow plots to reclaim; the granary | R1; *shinden* reclamation begins late T0. The rice/*koku* heartbeat. |
| **The Main House / *Omoya*** | Kurosawa Estate (T0) | Estate | Kitchen & inner rooms; the household shrine; the lord's study (ledgers) | R3 (houseman); the study at R7 (bailiff). |
| **The Drill Yard** | Kurosawa Estate (T0) | Estate | Training posts; Jūbei's weapon rack | R4, after the humbling first fight. Conditioning & idle-combat. |
| **The Market / Shop Row** | Village of Asagiri (T1) | Village | Smith Gonta's forge; Obaa Sato's herb stall; Brewer Tokuemon's; Weaver Onatsu's | T1 (estate trusts him to run errands; R3+). Per-shop reputation meters. |
| **The Chief's House** | Village of Asagiri (T1) | Village | Yagoemon's receiving room; the village ledgers | T1, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
| **The Inn & Rumours Board** | Village of Asagiri (T1) | Village | The rumours board; the common room | T1. Sukezō's inn — hub for optional light folklore side-quests (unlocked organically). **None gate tier progression.** |
| **The Shrine / Temple** | Village of Asagiri (T1) | Village | The shrine (*shimenawa*); the temple register; the Bon offering site | T1. Priest Ryōa's register of the vanished (a mystery clue). |
| **The Boundary-Stone / Jizō** | Village of Asagiri (T1) | Village / neutral | The boundary *jizō*; an offering left by an unknown hand | T1. Where he was found — the **one** capped residual-ambiguity beat (lingers unresolved). |
| **The Near Satoyama** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | Foraging groves; the bamboo stand | R2/T0, gated by conditioning. First ring of the danger gradient. |
| **The River, Ford & Weir** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | The ford (the "kappa" spot); the weir where he was found | T0–T1, gated by conditioning. Fishing + the "kappa" thread (undertow + smugglers' sinking-spot). |
| **The Foothills & Charcoal Grounds** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | The hidden charcoal kiln ("fox-fire"); hunting trails | T1, deeper conditioning. Second danger ring. |

## 1.7.1 World & areas — LATER (T2 deep + T3–T4 expansion; parked, not cut)

Parked per the lean discipline (§1.2 pillar 3): designed but **not authored as full areas in v1.** Per the
world-expansion cut-set, beyond the three starters a sane buildable set is **~6–8 nodes** that reuse the
existing cast and pay off the spine directly.

| Node | Tier | Kind / role |
|---|---|---|
| **Kuzuhara — re-foundable upstream hamlet & embankment river-works** | T2 | **Spine.** The faction-3 fusion: the drowned hamlet (the disaster that nearly killed Tahei) becomes a resettlement node + the embankment (*seki*) river-works that secures the disaster. Access-only, grind-built; the backstory and lost-child evidence resolve here. |
| **Sawatari-juku & the wider post-town region** | T2 | **Mixed.** The origin reunion hub (optional) + the *toiya* transport office / waystation trade layer (the practical surplus-export runway to T3). |
| **The Kaidō Porters' & Transport Guild** | T2→T4 | **Spine-thin.** Routes, *sekisho* pass-tiers, route-risk — the trade backbone. Met via friend Kanta's first favour run; the T3 stub cliff-hanger is **this one node's first-contact**. |
| **The Rice & Silver finance network** | T2→T4 | **Spine-thin.** The conversion engine: village broker → regional warehouse → *Marutaya* debt-restructuring → *goyōkin* → Osaka/Edo *fudasashi*. |
| **The Neighbouring Valleys** | T2 | Side. **Hard-capped at exactly two named valleys (Hibara + Toge-mura)** — Asagiri fractally replicated, slimmer. Courting them is an optional accelerant. |
| **The High Mountains & The Pass** | T2–T3 | Shared wilderness, top of the conditioning gradient. The lethal terrain where his caravan died; the "one-eyed mountain god" (= Hanzaki + fog-blind terrain). |
| **The Daikan's Office (castle-town officialdom)** | T3 | **Spine-critical** for formal T3 recognition; the racket's nerve-centre. Where most T3 Influence is minted. No folklore here — the rational, ledgered counter-world. |
| **The Edo *yashiki* / rusui + sankin-kōtai conduit (one cluster)** | T4 | **Spine.** The mediated capital conduit (rusui **Konoe**; the lord's biennial attendance), with the **Nihonbashi/*banzuke*** payoff and the **touring-inspector set-piece** folded in as its two payoff beats. |

> **Cut for now (reintroduce later, "start lean, add back"):** the Matagi hunters, the Pilgrimage Order, and
> the Scholars-&-Physicians as a *network* (keep Ranpo / Obaa Sato as the existing seed only), and the
> Marriage/Adoption brokerage. **Macro-tier spatiality** (full walkable maps vs abstract holdings/
> correspondence boards above T2) is a §1.14 open question — the human has indicated **full maps at every
> tier**; design upper nodes so they *can* ship first as thin abstract boards.

## 1.8 Cast (by faction & area)

Grouped by faction. Most NPCs do **double duty** — a gatekeeper *and* a story thread in the same beat — to
keep the web legible. The **estate roster GROWS per tier** (annotated below); the **village cast stays
static**; the origin cast unlocks at T2.

### Estate (main) — the Kurosawa household & retainers

| NPC | Role | Function | First appears |
|---|---|---|---|
| **Lord Kurosawa Munenori** | Head of the house, late 50s; weary, decent, stiff-backed pride papering over shame. | **Apex rank-gatekeeper** — upper-rung promotions need his explicit recognition; his approval *is* the main quest's measure. Believes ledgers, not omens. The **generational succession beat** runs through his aging decline. | E0 (T0) |
| **Kurosawa Naoyuki** | The lord's son and heir, ~22; talented, restless, chafing at genteel poverty. | Early **rival inside the household** (gatekeeps mid rungs); the talent-foil *inside* the family until the grind outpaces his coasting. Arc: rivalry → grudging respect → brotherhood; **converted talent, not innate gift.** Later the **ally against Rival House Tomita**; comes into his own as the house's future. | E0 (T0) |
| **Lady Kurosawa Chiyo** | The lord's wife, ~50; manages the inner household and its meagre purse. | Gatekeeps **houseman access (R3)** and the domestic economy; later the house's **alliance-strategist** at the castle-town. | E0 (T0) |
| **Dowager Kurosawa Toku** | The lord's mother, ~75; sharp-memoried; the only one who lived through the fall as an adult. | Living **backstory keeper** — slowly parts with why the house declined (grandfather **Sadamune's** failed flood-venture). Embodies "no shortcuts." | E0 (T0) |
| **Chief Steward Genemon** | Runs the estate day to day, ~60; dry, overworked, fiercely loyal. | The **spine's primary rank-gatekeeper and quest-giver** — first calls him "another mouth," assigns nearly all early labour, grants the rung-by-rung promotions. Arc: grudging tolerance → reliance → naming him deputy and successor. | E0 (T0) |
| **Tanomo** | Estate accountant/clerk, ~45. | Gatekeeps the *koku*/economy and debt-repayment systems; the in-house thread into the ledger/debt mystery; later runs the debt-restructuring interface. | E0 (T0) |
| **Jūbei** | Aging master-at-arms / drillmaster; competent-but-never-great old foot-soldier. | **The mentor** and combat/training gatekeeper — "Talent is a story the lucky tell. You are not lucky. So you will work." Gates the entire training/idle-combat suite after the humbling first fight. | E0 (T0) |
| **Sota & Mago** | A grizzled groom and a cheeky teen field-labourer — the bottom-rung peers. | The field/stable labour loop and honest friendship at the floor of the ladder; the first assignable seconded hands. | E0 (T0) |
| **Oai** | Head maidservant, ~40; runs the indoor staff and the servant-gossip network. | Quest-giver and information broker inside the house. | E0 (T0) |
| **Kyūsuke** | Estate cook, ~50; warm comic relief. | Runs the food/provisioning sub-economy; a soft daily-life anchor. | E0 (T0) |
| **Ranpo** | Estate physician, ~55; rational, plain-spoken. | Dresses the healing scalp wound (grounding the mundane amnesia), names symptoms not visions, gates healing/medicine; flatly disbelieves the kami story. *(Origin/Scholars seed.)* | E0 (T0) |
| **Tokujirō** | Green recruit, ~16; joins after the protagonist has risen. | The mirror that proves the protagonist's growth; seeds the late-tier **"you now teach others from zero"** layer (re-homes the old reset's teaching idea). | E1 (T0→T1) |
| **Gohei & Yatarō** | Ex-*ashigaru* men-at-arms hired off the road. | The first paid martial outsiders; the 2–3-man rota at E2. | E2 (T1) |
| **Saburozaemon** *(later)* | Stern senior retainer, ~55; traditional, exacting. | Gatekeeps respect at the retainer rungs; later marshals the lord's procession. | T2+ |
| **Heisuke** *(later)* | Friendly peer retainer, ~30; open-handed. | Shows the ropes of retainer life; low-friction quest-giver; later the field escort lead. | T2+ |
| **Kanbei** *(later)* | Jealous middling retainer, ~35; cornered and proud, not evil. | **In-household antagonist-rival** who sees the rising stray as a threat; player-influenceable détente or self-inflicted washout. | T2+ |

### Village (side) — Asagiri *(static cast)*

| NPC | Role | Function |
|---|---|---|
| **Headman Yagoemon** | Village headman (*shōya/nanushi*). | The **Village Chief reputation gatekeeper** AND a humanly-reachable culprit (doctored ledgers cover the foreman's skim). Warm civic quest-giver up front; never a monster. |
| **Sayo** | The headman's daughter, ~16; sharp, kind. | The village's main quest-giver and the **living heart of the legend** — names him "Tama" on sight. Tutorializes the village/trade loop; the person the truth most hurts and most frees. |
| **Obaa Sato** | Village herbalist / wise-woman. | The village's **folklore-keeper** — narrates the *kamikakushi* legend sympathetically while knowing it is coping; teaches foraging/village-craft. |
| **Priest Ryōa** | Shrine/temple keeper. | Folklore-atmosphere quest-giver whose **register of the vanished** becomes hard evidence in the lost-child thread. |
| **Smith Gonta** | Gruff village blacksmith. | Tools and later spearheads — gates metalcraft; values shown effort over flash. |
| **Carpenter Risuke** | Village carpenter/builder. | Repairs and construction — gates building systems; later the Kuzuhara river-works lead. |
| **Weaver Onatsu** | Village weaver, a sharp widow. | Cloth/textile trade — ties into Lady Chiyo's economy and origin routes; lead *meibutsu* candidate. |
| **Brewer Tokuemon** | Village sake brewer, jovial. | The village's festival/social hub; *meibutsu* (sake) candidate. |
| **Innkeeper Sukezō** | Runs the inn and the **rumours board**. | The dedicated delivery vector for optional light-folklore side-quests; information broker. |
| **Peddler Sokichi** | Itinerant medicine-seller / peddler. | The **bridge** beyond the village (toward the origin town and the region); grounded source of yokai tales; helped the real Tama flee (a lost-child clue). |
| **Foreman Magobei** | A skimming village foreman — the "tanuki" of the rumours board. | The **T1 antagonist** and first hard thread into the rice-quota pattern (a doctored measuring-box). Reachable and human. |

### Origin (side) — Sawatari-juku & Kuzuhara *(unlocks at T2)*

| NPC | Role | Function |
|---|---|---|
| **Oyuki** | Tahei's widowed mother, ~45. | Emotional core of the origin thread — grieved him as dead; the reunion is the warm payoff, kept earned and a little costly. |
| **Okimi** | Tahei's elder sister, ~20; married into a trading family. | The concrete **trade-tie** that lets the origin town supply and route goods for the expansion. |
| **Master Denbei** | Tahei's old employer, ~55; runs the transport-and-goods house. | Supplies porter/logistics know-how and legitimate manifests; the grounded source of the porter's-knot identity (**ZERO bonus**). |
| **Kanta** | Tahei's childhood best friend and fellow porter, ~18. | Comic-warm friendship rekindled; the first porter contact and recruitable lead carrier. |
| **Ohana** | A sweetheart Tahei half-remembers, ~17. | Optional relationship thread the dream surfaces; grounded and gentle, narrative-only. |
| **Oharu (the real Tama)** | The "spirited-away" child, alive and grown in the post-town. | Mystery payoff & living proof — a girl who **ran** from a violent stepfather and a near-sale for debt. Reunion kept **costly and incomplete** (she may not forgive). |

### Region / Castle-town / Edo — antagonists, rivals & apex authority *(T2+, mostly parked)*

| NPC | Role | Function |
|---|---|---|
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" of the pass. | The **T2 dangerous combat beat** and the **talent-gone-rotten mirror** — edge **trained and brutal, never innate**; survived by labour-built endurance, never out-talented; muscle-for-hire (often Tomita's). |
| **Rival House Tomita** (head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei**) | A competing *goshi*/merchant house that prospered as the Kurosawa fell. | The **primary, persistent regional STATUS rival** (T2→T4) — capital + connections + ruthlessness, **never innate gift.** Out-maneuvered commercially/socially, **never killed** (détente, alliance, or clean defeat). |
| **Rival House Akagi** (head **Gennai**) | An older, prouder, declining samurai line — prestige without coin. | The **second rival house** (canon-required): contests the region on **honour/precedence** while Tomita contests on money — so the two can be played against each other. |
| **Tedai Kuroiwa** | The magistrate's agent (*tedai*) — the gracious facilitator who *records* your achievements. | The **T3 primary human antagonist** — outwardly an ally, secretly the local architect of the rice-quota skim. **Defeated by evidence, not violence.** Sits beneath Daikan **Iemasa** and above clerk **Naozane** (the crack). |
| **Daikan Iemasa** | Deputy magistrate; incurious, status-conscious, not personally corrupt. | Signs what Kuroiwa hands him; **largely escapes** — the honoured ceiling. |
| **Clerk Naozane** | A guilt-sick junior clerk. | The crack in the cover-up; supplies documentary proof; a reachable conscience. |
| **Junkenshi Toyama Saemon-no-jō (the Touring Inspector)** | A senior shogunal inspector. | The **T4 impartial judge** — the apex human authority whose survey validates or threatens everything the house built. Not a villain; the antagonist-shaped *test*. The **lord** faces him; the MC stands at the back. |
| **Echizen-ya Sōbei (the Edo factor)** | An Edo money-broker (*fudasashi*-adjacent) who launders the skimmed silver. | The **untouchable apex** of the quota machine — glimpsed, named, **never reached.** The antagonist as *system*. |

## 1.9 Side-threads — identity, origin & the dream rule

Two grounded side-threads run quietly beneath the spine; both pay off only in **feeling, allies, and flavour,
never power**, both resolve to human causes with no magic, and **both resolve at the Region tier (T2)** —
T3/T4 carry the house's power rise.

**(A) The Tama-vs-farmhand allegiance & the lost-child truth.** The valley grieves a child, **Tama**, taken
ten years ago; a half-drowned, memoryless young man reads to them as Tama returned. The estate disbelieves
it. This split powers the continuous **allegiance leaning** (§1.5.4): rates, flavour, and which quest-givers
open first — **never** stats, drops, production, or availability. "What happened to Tama?" is a **suggestion +
a story the player discovers in the world** (a sandal left yearly at the shrine; a household that flinches at
her name; the legend "remembering" a boy; a debt-ledger mention; a post-town sighting). **The truth:** Tama
was a **girl** (the gender-drift is the fair clue) who **ran** from a violent stepfather and a near-sale into
service to clear a debt; she has been alive and grown the whole decade in the post-town (as **Oharu**),
too ashamed to return. Resolution is grounded and **partial** (she may not forgive). The MC is **not** her.

**(B) The grounded true-origin thread.** His real past is mundane: his true name is **Tahei**, a young
porter/errand-hand for a small transport house in **Sawatari-juku**, with **living** family and friends
there. **The origin story (no magic):** he left on a mundane errand escorting a goods consignment over the
pass; a **flash flood (a neglected upstream embankment failing) and rockfall** struck the small caravan; he
was struck, half-drowned, swept downriver, and snagged at the weir below the estate. His amnesia is ordinary
**head trauma + near-drowning + exposure** — no magic. As memory returns he re-engages them; seeing what he
is rebuilding, they back him with **pride, allies, resources, and trade ties** — **access only, never a
mechanical gift.**

**The dream rule (enforced in writing *and* code):** returning autobiographical **memory only** — never
clairvoyance, **ZERO mechanical bonus**. **Memory-only** (only things he lived; the "voice in the water" is a
real person recalled, not a spirit). **Zero mechanical bonus** (memory grants access, not power). **Guaranteed
cadence** (at least one fragment within a capped number of in-game days OR a skill/standing threshold; at least
one origin beat always available without reputation-gating, so the thread never goes cold). All variance flows
through the one seeded RNG; cadence is headlessly regression-testable.

### Per-tier side-quest list (lean)

| Tier | Side-quests (open-ended; never gate the spine) |
|---|---|
| **T0** | The spilled-rice recovery; the porter's-knot beat ("you've hauled before"); first dream fragment; Dowager Toku's first memory of the fall. |
| **T1** | The inn rumours-board opener (the "kappa" of the ford = undertow + smugglers' sinking-spot); Magobei's skim (the "tanuki"); a per-family goodwill help; Priest Ryōa's register entry; the boundary-stone offering (the one residual-ambiguity beat). |
| **T2** | The lost-child truth (Oharu) resolves; the origin reunions (Oyuki, Okimi, Denbei, Kanta, Ohana); Kuzuhara re-founding + naming the drowned; the "one-eyed mountain god" = Hanzaki investigated; the fox-fire ridge = a hidden charcoal kiln. |
| **T3+ (parked)** | The *osso* petition (a *gimin*-martyr bears the lethal risk); the rice-quota racket's reachable rungs answer; Naoyuki's coming-into-his-own; the succession secured. |

## 1.10 Folklore & quest-design philosophy

**Folklore is light flavour, not the spine.** The campaign is **NOT** built around named yokai; folklore
arrives occasionally as small optional tidbits, concentrated in the village inn's **rumours board** and
**unlocked organically** (conditions per tier; more unlock as the estate and village grow — never an
all-at-once dump). Each rumour is a lightweight yokai story the player **may** go investigate open-endedly.

**Hard rules:** every rumour-quest is **optional** and **none** gate tier progression. Every folk belief is
introduced as genuine, respected village dread first, investigated through ordinary work, and resolved
one-to-one to a concrete human/natural cause — but the game **lingers in the unease before resolving**, and
debunks with **dawning dread, never a Scooby-Doo unmasking.** The master belief, *kamikakushi*, is itself a
comforting lie covering a human truth (people who fled debt/violence, or died on a lethal road — and the
protagonist's own flood trauma); handled as grief-coping, not superstition to mock.

**Residual ambiguity is hard-capped at ≤1** unresolved, off-screen, mundane-readable beat (the unidentified-
hand offering at the boundary-stone where he was found). Folk-religion texture distinguishes **Shinto** (shrine,
*shimenawa*, boundary/mountain kami, the soul-calling rite) from **Buddhist** elements (roadside/boundary
*jizō* as guardians of children and travellers, Bon offerings, the temple register of the vanished that
becomes hard evidence). **No rite ever mechanically "works"; nothing is confirmed supernatural; there is never
player magic.**

**Quest design — open-ended, not hand-holdy.** A quest is a **suggestion + a story you go find out in the
world**, never an A→B→C waypoint checklist. There are **fewer checklists overall**; the dominant
minute-to-minute behaviour is the **incremental grind — the hero getting better at what he does.**

**The ~4 v1 quest types** (combat- and labour-spanning, all open-ended): **PEST CONTROL**, **HUNT**, **CLEAR**,
and **DEFEND** (the standing-earner). Escort/patrol/bounty/duel/expedition/siege/relief/investigate are parked
for T2+.

## 1.11 Antagonists & endgame

**One antagonist per tier**, escalating in scope (estate → village → region → castle-town → Edo), grounded (no
magic; "yokai" are misread humans/animals), each **revealed incrementally** rather than unmasked. The
**reachable culprits answer at their tier; the truly powerful largely escape** — **partial justice by design.**
**T0 estate decline is a simple debt/misfortune, NOT conspiracy-linked** — the one antagonist with no villain.

| Tier | Antagonist | What they block | Reveal | Resolution |
|---|---|---|---|---|
| **T0 — Estate** | **The Inherited Debt** (personified only by tired pawnbroker **Moneylender Tōkichi**; *a circumstance, not a conspirator*). | The estate is dying of compound interest from grandfather **Sadamune's** failed embankment-venture, plus thin harvests and a cracked kura. Can't leave until the immediate fires are out. | A leaning gate and a red ledger; clerk **Tanomo** drips "we owe coin" → "the interest is the problem" → Dowager **Toku**'s memory that the root is Sadamune's own failure, **not anyone's crime.** | Purely economic. **Peaceful:** out-grind the interest and renegotiate. **Assertive:** refuse the worst terms, force a fair table by proving solvency (no fight). Restructured, not erased; the house's **root-sin** it atones for at Kuzuhara — emotional payload, **no antagonist.** |
| **T1 — Village** | **Foreman Magobei**, the "tanuki of the rumours board" — skimming rice with a doctored measuring-box (*kyō-masu*). The first, small human antagonist. | The T1→T2 gate needs the village happy; his skim keeps stores short and steals the surplus you need; he's the "tanuki" folklore beat. | The board's "rice-thieving tanuki" → one load measuring short twice → the doctored *masu* → the thread runs up to Headman **Yagoemon**, whose ledgers cover Magobei. Dawning unease, then a box of rigged wood. | **Peaceful:** expose the skim, Yagoemon makes restitution and keeps his post in disgrace. **Assertive:** force Magobei off the books (his hired muscle is the first small brawl). **Partial:** Magobei answers; better-connected Yagoemon mostly escapes with a quiet rebuke. |
| **T2 — Region** | **Rival House Tomita** (spine antagonist) + **Rival House Akagi** (the foil), with **Hanzaki** as the road's teeth. | "Win the region." Tomita underbids deals and courts the same valleys; Akagi blocks the upstart Kurosawa on **precedence**; Hanzaki makes the trade pass unsafe. | Tomita first a *name* underbidding one deal → agent Yasubei → the head. Akagi first a *snub* → a precedence dispute → Gennai. Hanzaki: rumour → a survived-not-won encounter → a recurring duel nemesis (**trained, never gifted**). | Multi-route. **Peaceful/commercial:** out-supply and out-arbitrate valleys; settle Akagi by *restoring its honour*. **Assertive:** secure the pass with a hard-capped 2–3-man detail; break the brigand roost; out-leverage Tomita's brokers. Tomita is **never killed**; a famine-band under Hanzaki can be **fed/resettled.** **The personal-mystery payoff lands here.** |
| **T3 — Castle-town** | **Tedai Kuroiwa**, the gracious door — the magistrate's agent who *records* your achievements and secretly architects the rice-quota skim. | The gate is the rulers conferring leadership + inviting the house in. All T3 Influence is *minted by officialdom*, and Kuroiwa controls that gate (slow-walks recognition, misrecords yields, routes the rigged-quota friction). | The polite junior clerk who keeps you waiting → the facilitator who records your service (seems an ally) → a yield misrecorded "by error" → Naozane's flinch → the rigged *kyō-masu* at the weighing-yard cross-referenced against quota ledgers. The gracious man at the gate **is** the rot. | Multi-route, **partial justice.** **Peaceful:** outgrow him — become the dominant house holding key offices (Marutaya credit, a graded *meibutsu*, samurai-society standing) and make his skim irrelevant; **you need not prosecute him at all.** **Assertive:** mount the **osso over-the-head petition** on proof — Kuroiwa answers; **Daikan Iemasa largely escapes**; the petition's lethal risk falls on an **ally / *gimin*-martyr**, not the MC. "Take over" = dominant house, **never rebellion.** |
| **T4 — Edo** | **The Edo factor, Echizen-ya Sōbei** (untouchable apex, laundering the silver) + **the Touring Inspector** (the impartial test). | The factor blocks *full justice* (the trail dies in Edo). The inspector blocks *final recognition* (only a house whose record survives the survey earns the mediated merit-commendation). | The factor a single glimpse (Konoe forwards a dispatch; a manifest dies at his name — you learn *who*, and that you can't touch him). The inspector: rumour down the *kaidō* → a looming date → the staged set-piece where the **lord** faces him and the record is read aloud, MC at the back. | The inspector set-piece is **won or dented**, not fought (a recoverable dent on neglect, never a wipe). **The factor escapes** — the deliberate, honoured incompleteness: reachable culprits answered at their tiers; the truly powerful walk. The win is **the house restored and ranked**, the rot's apex still out of reach. Bittersweet by design. |

**The connective thread (light, optional — NOT the spine).** A single optional **investigation overlay — "the
rigged measuring-box"** — recurs as a motif: Magobei's doctored *masu* (T1) → the same rigging in Kuroiwa's
weighing-yard (T3) → the silver's trail dying at Echizen-ya (T4). A curious player who pulls it finds the rungs
connect into one **quota machine** and can mount the *osso* petition for partial justice; an incurious player
simply beats five separate antagonists and never notices the through-line. **No tier requires touching the
racket to advance** — tier progress is always achievable by economic/social means alone. **Crucially the thread
is NOT attached to T0:** estate decline stays a self-contained debt/misfortune (Sadamune's embankment), with no
racket fingerprints; the "one rotten root behind everything" framing is **retired** — the motif is "*a pattern
you may notice*," not "*the secret behind everything*."

**The power-focused late game & the national *banzuke*.** The endgame story centres on the house's **POWER**
(office / debt-rescue / takeover / ranking) — **trade is OUT of the finale spine** (a supporting thread only).
The T3 castle-town becomes a multi-route "become the leading house" conquest (offices held in the house's name,
the daimyo's confidence won, rivals subordinated — never killed by the player, never rebellion). The T4 Edo
climax is a **national multi-pillar *banzuke* ranking of the HOUSE** on all four pillars — a **popular
*mitate*/parody broadsheet, NOT an official bakufu register** — on which the Kurosawa climb from unranked to a
named **upper-rank provincial house** (a respectable Maegashira/Komusubi; the **Ōzeki/Yokozuna slots are
structurally sealed** — the wall the truly powerful built, made the chart's literal geometry). Per-tier rank
ladders also rank the house at each tier (a domain *banzuke* precedes the national one).

**One ending + post-game.** There is **one authored ending** (the house restored & ranked) + **post-game
free-play (no reset)**; branches are in *how* you got there (allegiance / takeover route), not separate endings.
**D-010's honest ceiling is preserved by ranking the HOUSE, not the man:** the protagonist does **not** become a
*hatamoto* or get received by the shogun; recognition arrives **indirect and mediated** (down through rusui
**Konoe** and **Lord Munenori**). His personal ceiling stays **chief steward / the lord's right hand**; the
house's *banzuke* rank keeps climbing post-cap (decoupling personal vs house ascension). The post-game long-tail
is escalation/mastery over what's already built (defend the top *banzuke* spot on the biennial *sankin-kōtai*
heartbeat, recoverable and never a decay-tax; optional grounded super-bosses; per-pillar mastery goals; the
estate-as-sandbox teaching layer re-homed onto **Tokujirō** and recruited origin friends).

**Succession.** A generational beat: aging **Lord Munenori**'s decline → heir **Naoyuki** comes into his own
(the MC as right-hand); the house's future is secured across a generation. The epilogue is a tableau of
everything built: the restored-and-surpassed house seal, the reclaimed fields, the resettled Kuzuhara, the
named drowned, the freed and self-determining Oharu, the recovered family proud behind him, and a true name
(Tahei) and a life built by hand.

## 1.12 How §1 paces the incremental unlocks

The estate-rank climb is the **dominant driver** of the UI-as-progression reveal, with House Influence as the
underlying gate-currency, so **"numbers go up" and "the world enlarges" are one motion.**

**Spatially:** the player starts trapped in one storehouse room (one verb) and earns the rest of the estate
room by room (the rank ladder made of doors), then the village (errands at R3+), then the wilderness (by
conditioning), then his own past (by memory at T2), then the region. Each tier opens a fresh, larger canvas
with bigger numbers and **no reset**, so the map physically embodies the tier escalation.

**Systemically — the multi-screen UI that appears single-screen early.** The **UI shell is multi-screen
navigation with screens/nav progressively revealed**: it *appears single-screen early* (one verb + a
persistent event log) and **more screens unlock as you progress.** Each rank-up fires through the universal
rewards/unlock bus as **one** event that simultaneously pushes a diegetic log line, reveals the next
panel/tab/resource/area, grants the perk, and advances a story flag — so feature unlocks read as plot, never
silent menu growth. Concretely (v1 ladder):

- **R0** — body/rest bar + rice counter.
- **R1** — labour loop + paddies + *koku*.
- **R2** — Skills tab + foraging/woodcutting.
- **R3** — main house + village tier (errands).
- **R4** — drill yard + Combat panel + Equipment/Inventory + Bestiary (after the humbling fight).
- **R5** — assignment/management panel + labour-gang.
- **R6** — pest-control/hunt/clear quests + first combat-earned standing.
- **R7** — the four-bar House Influence panel made visible + cash-crop/proto-industry levers + the tier-expansion map.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal Influence results); **auto-producers are
limited / late-game only** (early game is active grind). Everything is data-driven (areas/panels/resources as
registries with unlock predicates over GameState), deterministic under the one seeded RNG, with balance/unlock
tables generated into `docs/` and headlessly regression-testable via the DEV play API. The three faction tracks
differ in **shape** to keep pacing varied (estate steep-geometric gates; village gentle per-node meters; origin
discrete milestones), and the side factions act as Influence **multipliers** (≈ halve time-to-tier — felt,
never a wall).

## 1.13 Risks & guardrails

Folded in from the locked-rule fixes (to apply at integration and hold through §§2–7):

- **No belief-creatures in grindable spawn tables.** Grindable mobs are honestly-mundane (boars, monkeys,
  hornets, wolves/bear, bandits/deserters — **~5 in v1**). Any "yokai" (kappa, fox-fire fox/tanuki,
  yamanba/tengu, the one-eyed mountain god) is an **INVESTIGATE-then-confront one-shot** resolving to a
  human/animal, never a respawn population.
- **Residual ambiguity ≤1.** Re-affirmed: exactly one unresolved, off-screen, mundane-readable token, kept at
  the **Asagiri boundary-stone.** No new ambiguity beats (e.g. the invented "T4 castle-town ghost-story wink"
  is **deleted**). Provide a region-wide belief→cause table before authoring any node with new omens.
- **No permanent holding-loss ("never a wipe").** A failed defence **dents/disables** a holding *temporarily*
  (recoverable by rebuild); Influence can stall or take small per-pillar dents but is **never wiped**.
- **No labour→combat cross-feed.** Labour conditioning is a **one-way enablement gate** on combat rungs and
  grants **ZERO combat stat or training-rate bonus** (the soft hidden edge is killed outright).
- **Fictionalise real names.** Keep the world generic-rural — no real place/daimyo/house names (the post-town
  is the invented **Sawatari-juku**; sealed *banzuke* top ranks use fictionalised great-house analogues).
  Resolve name collisions (the origin **father** is dropped/renamed to avoid colliding with any other
  *Kuranosuke*; pick one macron romanization convention project-wide).
- **Hard-cap martial scale.** A **small named retinue** + temporary corvée/levies for crises, **never a
  standing army**; "de-facto security" = the house the daimyo *deputises* (sanctioned, revocable). Re-balance
  toward **labour-plurality** (peaceful labour the dominant daily texture; combat the strong mid-game-onward
  second pillar).
- **Replace coined 政威 if a better-attested term exists** (candidate **領 *ryō***); confirm at the §4/§5
  authenticity-harden, alongside the top-rung title (keep grand *karō*/adoption vocabulary as **aspirational
  narration only** for a modest *goshi* house).
- **Lock the *meibutsu* product** with the human before authoring any T3/T4 trade/prestige payload (it threads
  through several nodes); until then author against a placeholder.
- **Estate-restoration must not drift into city-builder/4X tedium** — Influence stays diegetic and
  story-framed; the cozy daily-labour texture and grounded character story remain the core.

## 1.14 §1 decisions → ADRs

The §1 decisions map to ADRs D-001…D-015 (final numbering set at integration). **D-004 is reversed** (no
reset); **D-006 is amended** (Tahei reveal softened to a late side beat; age ~18–20).

| ADR | Decision | Status |
|---|---|---|
| **D-001 / D-002 / D-003 / D-005** | Grounded / no-magic; folklore = believed-atmosphere (light flavour); mediocre-start (no hidden edge); title *Kamikakushi* + fictional mid-Edo setting. | **Hold.** |
| **D-004** | Reset / prestige. | **⛔ REVERSED** — tiers replace prestige; **NO reset of any kind**; everything persists. Teaching layer re-homed onto Tokujirō + recruited origin friends. |
| **D-006** | Protagonist identity. | **Amended** — fixed male, no rename; "Tama" borrowed name, true name **Tahei**; reveal softened to a de-emphasised **late side beat**; age **~18–20**. |
| **D-007** | Estate-rise spine + tiers **T0–T4** + per-tier transition story gates. | **New ADR** (supersedes the mistaken-identity spine). |
| **D-008** | Three starter factions + **four-pillar** House Influence + **per-tier required-pillar gating** (floor + ≤25% overflow). | **New ADR.** |
| **D-009** | Origin = **living** family/friends (Sawatari-juku) opening at **T2**; Kuzuhara a re-foundable region node; access-only. | **New ADR** (supersedes family-death canon). |
| **D-010** | Indirect/mediated **Edo ceiling** — rank the HOUSE (national *mitate-banzuke*), not the man; no *hatamoto*/shogunal audience. | **New ADR** (Option A: provincial/parody chart; personal rank hard-capped at chief steward). |
| **D-011** | **Combat earns standing** via the Arms pillar (reverses the old "never a source of standing"); mediocre-start preserved; conditioning gate, no cross-feed. | **New ADR.** |
| **D-012** | Per-tier rank ladders + full maps every tier + **v1 = T0–2** (T3 stub, T4 roadmap); lean cut-set (~8 rungs, ~5 mobs, ~4 quest types, ~6–8 nodes). | **New ADR.** |
| **D-013** | Tech: Vite + TS + Vitest; pure-core + thin DOM renderer; one seeded RNG; IndexedDB + base64 export/import; responsive desktop+mobile; **active-only, no offline progress**; static itch.io build. | **New ADR.** |
| **D-014** | **Per-tier antagonists** (not a single racket); the racket demoted to a **light, optional connective thread**; T0 villain-less; two rival houses (Tomita + Akagi). | **New ADR.** |
| **D-015** | Four-pillar accrual = **achievement JUMPS + seasonal JUDGED RESULTS** (new-high-water-mark only), up-only + rare recoverable **per-pillar** dents (never a wipe). | **New ADR.** |

### Items still flagged for the human

- **The canonical *meibutsu* product** (silk/sericulture, sake, textile, lacquer, paper, or a rice brand) — gates the trade sub-engine capstone, the Nihonbashi category, and the *banzuke* product strand; lock before authoring any T3/T4 payload.
- **政威 *sei-i* vs 領 *ryō*** for the Standing & Office pillar, and the top-rung title (chief steward / *yōnin* vs aspirational *karō*) — an authenticity-vs-legibility call for the §4/§5 harden.
- **Macro-tier spatiality** — full walkable maps at every tier (the human's stated preference) vs thin abstract holdings/correspondence boards above T2, given the lean-v1 scope guard.
- **The *osso* petition's "whose neck"** — recommend a *gimin*-martyr ally bears the lethal risk (the MC's hands stay clean); reconcile with partial-justice and the indirect ceiling.
- **Second rival house confirmation** — Akagi (honour/precedence) as the canon-required second house beside Tomita; confirm it is not folded into Naoyuki-as-internal-foil.
- **Romanization convention** (macron policy) and final **ADR numbering** at integration; confirm the origin **father** is cut/renamed to avoid the *Kuranosuke* collision.
- **Estate room-unlock granularity** — fold the stables/woodlot edge into the forecourt to avoid early reveal fatigue, or keep separate.
- **Balance values** — per-pillar thresholds, the seasonal judged-result formula, conversion weights, and big-number formatting — deferred to §4 but the SHAPE (floor + ≤25% overflow; min/geometric-mean roll-up; Estate ≤¼ of roll-up, trade ≤⅓ of Estate) needs sign-off.

---

_§§2–7 to be authored next._

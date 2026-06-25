# Kamikakushi — Product Requirements Document (PRD)

> **Status: DRAFT — under section-by-section review.** Nothing here is locked until it is reviewed
> with the human and recorded as an ADR in [`history/decisions.md`](history/decisions.md). No code is
> written until §7 (the roadmap) is approved.
>
> **Working title:** *Kamikakushi* (神隠し, "spirited away"). A single-player, story-driven
> **incremental RPG** set in Edo-period rural Japan, built as a static HTML5 + TypeScript web game,
> deployable to itch.io.

## How to read this document

This PRD plans the **whole saga in full detail up front**, authored and reviewed one section at a time.
It is now a **single living document** — every authored section lives below, in order; sections still to
be written appear as in-place placeholders. Each section is drafted in full, walked through with the human,
revised, and its load-bearing decisions locked as ADRs.

| § | Section | Status |
|---|---------|--------|
| 1 | Vision, pillars, factions, world & endgame | **Locked** |
| 2 | Systems & mechanics catalog | **Drafted** (merged; awaiting review) |
| 3 | Incremental unlock ladder (UI-as-progression) | **Not started (Wave 2)** |
| 4 | Combat, progression & balance model | **Not started (Wave 2)** |
| 5 | Full act-by-act narrative & content | **Drafted** |
| 6 | Tech architecture & data model | **Drafted** |
| 7 | Milestone roadmap, v1 scope & deployment | **Not started** |

---

# §1 — Vision, Pillars, Factions, World & Endgame

> **DRAFT — integrated (staleness fixed); awaiting review.** This section is authored end-to-end from the
> PATCHED locked-decisions canon
> ([`../brainstorms/2026-06-25-locked-decisions.md`](../brainstorms/2026-06-25-locked-decisions.md), incl. its
> 2026-06-25 Round-A deltas) and the three redesign discovery docs. It supersedes every earlier framing of §1.
> Tiers are renumbered **T0–T4** (0-indexed) throughout; v1 scope is **T0–T2 complete**, with **T3 a stub
> cliff-hanger** and **T4 a roadmap**. Round-A locks are applied as **settled**: *meibutsu* = **silk /
> sericulture**; **full maps at every tier**; **simple per-tier required-pillar thresholds** (the floor+overflow
> formula is rejected); origin **father Jinpachi** re-added; **marriage/adoption** restored as a real late-game
> lever; **combat surfaced from T0.**

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
   labour→combat training-rate cross-feed** and no hidden edge. Combat is **surfaced from the first tier (T0)**
   — the drill yard, Combat panel, bestiary, and the humbling first fight are early beats, not a mid-ladder
   reveal — so it is a first-class pillar from the start. Daily *texture* stays **peaceful-labour dominant** by
   volume (labour-plurality), but combat is live and load-bearing throughout.

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
per tier** (per-tier service/standing hierarchies, T0–T2 enumerated for v1); **rungs interleave LABOUR and
COMBAT throughout** — combat is a first-class core pillar **from the very first tier (T0)**, never a mid-ladder
reveal — and **combat earns standing** alongside labour. The estate **cast and buildings GROW per tier** — the
player builds structures and recruits a small named retinue, framed as **flavour / light systems wired to the
reveal bus, NOT a people-management sim** (no labour-gang to assign, no managed sub-economy, no
assignment/management panel; building and recruiting are narration, never a minigame). The household flatly
**disbelieves** the *kamikakushi* legend — to them he is a reliable hand who became a fighting one.

**Two earned standing meters** drive each ladder (these are rank-gating progress meters, **not** economy
currencies): **Estate Service** gates the labour promotions; **Combat Standing** (recognised martial deeds)
gates the martial ones; smaller responsibility/perk drips fill between gates so there is always a "next reveal"
on either track. **Labour conditioning is a one-way enablement gate** on combat rungs (it unlocks them; it
grants ZERO combat stat bonus). Combat is available **off-ladder from early game** as well: the drill yard and
first real fight open inside T0, so the player is *fighting and crafting his own gear* long before any
late-game helper appears. The capstone rung **confirms** (does not first-open) the higher macro tiers — the
relevant pillars have gated those in parallel.

Per the lean discipline, each per-tier ladder is **~8 rungs**. Grander martial titles are **aspirational
narration only**; default to humble household/*ashigaru*-tier titles. *(Patrol-leader / expedition / captain /
overseer narration and any longer braid are parked for T3+ — see §1.7.1 and §1.14.)*

**T0 — Estate ladder (~8 rungs; combat is live from the first tier).** Auto-producers do **not** appear on
this ladder — early game is the MC's own active grind (combat, skills, jobs, crafting); idle helpers are a
late-game convenience only (§1.12, canon §G).

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **R0 — Stray / "another mouth"** | labour | Found half-drowned and taken in; survive convalescence and the first labour. *(Met at the open.)* | The *kura* storehouse (one room, one verb); the body/rest bar and rice counter; the bare diegetic estate dashboard. |
| **R1 — Day-labourer (*hiyatoi*)** | labour | Chief Steward **Genemon** ("another mouth, soft and clumsy") assigns the first real work; complete it, earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the *koku* heartbeat); the basic labour loop. |
| **R2 — Bonded hand (*genin*)** | labour | Sustained, reliable labour across a season; Genemon grants a place on the household's books. | Foraging, woodcutting, hauling; the stables & woodlot edge; the porter's-knot beat surfaces; the **Skills tab**; the near-satoyama (conditioning-gated). |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | **combat (entry)** | A wolf at the grain store forces the **humbling, near-fatal first fight** early; **survive it**, then beg **Jūbei** for drills. The deliberately-incompetent floor of the combat track — surfaced inside T0, not mid-ladder. | The drill yard; the **Combat panel** + idle-combat/training; first crude weapon + **Equipment & Inventory**; the **Bestiary**. Combat stats start near-zero. |
| **R4 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger; help hold the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); the first *shinden* reclamation begun. |
| **R5 — Gate-guard (*monban*)** | combat | Stand a real watch; clear the first pest/animal threats; weapon-skill milestones reached. (Combat Standing gate; conditioning floor at R3.) | Estate-defence duties; **PEST-CONTROL / HUNT / CLEAR / DEFEND** quest types; loot + craft (Smith Gonta spearheads via the component chain); **the FIRST combat-earned standing.** |
| **R6 — Foreman of works (*kogashira*)** | labour | Drive the *shinden* reclamation and the workshops to recorded yield; the house edging toward solvency. | The workshops and granary; the low palisade; proto-industry levers; **errands beyond the estate — the VILLAGE TIER opens here.** |
| **R7 — Bailiff of the home fields (*jitō-dai*)** | labour→admin (as narration) | First reclamation recorded; the lord begins to notice; the MC takes on the home-fields *office* (his own quests/duties, not a management layer). | Field administration framed as the MC's own offices/quests; **House Influence made visible and tracked** (the four-bar standing panel); cash-crop levers; the **tier-expansion map**. The capstone bridge to T1. |

**T1 — Village ladder (~8 rungs; a fresh ladder, not a continuation of T0).** Rank resets to a new
village-facing service hierarchy; labour and combat keep interleaving, now reaching past the estate gate.

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **V0 — Estate errand-runner in the valley** | labour | The estate trusts him to carry its business into Asagiri; first village errands. | The village tier proper; per-shop reputation meters; the market/shop row. |
| **V1 — Recognised hand of the house** | mixed | Build standing with the headman and shops; combat keeps pace clearing valley pests/animals. | The chief's house; the inn & rumours board; deeper satoyama rings. |
| **V2 — Road-warden (*michi-ban*)** | combat | Make a stretch of valley road or the ford safe; survive a real bandit/animal clear. | Road-security duties; **HUNT/CLEAR** at valley scale; better loot/craft tiers; combat-earned Arms standing. |
| **V3 — Granary & cash-crop steward** | labour | Bring the village economy and the estate's cash-crops to a recorded seasonal result. | Cash-crop and trade levers (the silk/sericulture *meibutsu* sub-engine begins); the broker meters. |
| **V4 — Trusted of the headman** | mixed | Resolve a village-affecting threat (Magobei's skim surfaces here); earn Yagōemon's regard. | The headman's roll-up quests; the doctored-ledger thread; first **Office** standing. |
| **V5 — Sworn man-at-arms** | combat | Stand a real watch for the village; weapon-line milestones; survive the first dangerous-road encounter. | The first paid martial outsiders (Gohei & Yatarō) recruited as flavour retinue; defence of the valley. |
| **V6 — Right-hand-in-waiting** | mixed | The lord first believes impact beyond the estate is possible; "clean your room" nearly done. | Authority across the valley; the alliance/standing levers that point at the region. |
| **V7 — Agent of the house in the valley** | labour→admin (as narration) | Estate healthy, village happy, immediate fires out — the capstone "clean your room" beat. | The **region** map and the **T1→T2** quest to grow regional influence; rival samurai houses appear. The capstone bridge to T2. |

**T2 — Region ladder (v1 scope; enumerated as a per-tier ladder).** v1 completes T2, so its ~8-rung ladder
ships too: a region-facing hierarchy (e.g. **valley-envoy → road-captain of the cluster → broker of the post-town
trade → arbiter between valleys → recognised regional retainer → captain of the road-security detail →
alliance-broker → leading house of the region**), still interleaving labour and combat, with the **personal-mystery
payoff** (Kuzuhara, the origin reunions incl. father **Jinpachi**, the lost-child truth) landing across it. Exact
rung copy is detailed at §3 (the unlock ladder); the **shape** — fresh ~8-rung ladder, combat woven throughout —
is locked here. T3/T4 ladders are **scoped forward** (T3 stub, T4 roadmap).

> **Estate physical growth runs *ahead* of top personal rank** (buildings gate on the relevant **pillars**
> — primarily **Estate & Wealth** (and **Arms** for defensive works) — plus a **low** rank floor + cost, not
> the capstone; never a single monolithic "Influence band"). v1 covers estate stages **E0 — Foreclosure's
> Edge** (leaning gate, cracked *kura*, fallow paddies, a rusty door-bar) → **E1 — Stabilising** (kura
> patched, first *shinden* reclaimed, drill yard cleared, gate night-watch) → **E2 — Recovering** (granary,
> two workshops, a low palisade, 2–3 men-at-arms on a rota). Stages E3–E5 (fortified seat →
> restored-and-surpassed) are parked (§1.7.1). Estate growth pulls **seconded/recruited** faces; the
> village's own cast does not balloon.

### 1.5.2 VILLAGE of Asagiri (SIDE — a static reputation web)

A rich side faction shaped deliberately **unlike** the estate: instead of one rank ladder it is a continuous,
**multi-node reputation web**. Its cast is **mostly static** (it is a reputation web, not a recruitable
roster). It is the home of the *kamikakushi* / "are you Tama?" legend, which the villagers **believe** and the
estate does not; folklore lives here as **light flavour**, delivered through the inn's **rumours board**.
**Village standing NEVER gates the UI ladder or the tier climb** — ignoring it leaves you only poorer and
lonelier, a viable-but-poorer playstyle, never a wall.

Several **continuous meters** rather than one ladder:

- **Per-shop "patron/regular" standing** (smith, dry-goods/rice broker, herbalist, brewer, and **weaver
  Onatsu — the lead of the locked *meibutsu*: silk / sericulture**) — each unlocks stock, discounts, and
  exclusives, and high standing **softens the market-saturation price-crash**.
- **Per-family goodwill**, raised by **open-ended help** (you hear a family has trouble and figure out how to
  help — never a checklist).
- An **artisans'/craft-guild standing** gating recipes, component tiers, and master-craft commissions.
- The **Village Chief's regard** — headman (*shōya/nanushi*) **Yagōemon**, a weighted roll-up of the others
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
(father **Jinpachi**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart
**Osen**, the porter-guild). *(Father **Jinpachi** is re-added per the Round-A lock — renamed from the
colliding "Kuranosuke" to a clean period name; he resolves at T2 with an optional later emotional callback at
T4 — see §1.9, §1.11.)*

Payoff is **support, not local power**:

- **Pride/morale** — a modest global skill-XP buff framed as a **new present-day relationship** ("a man with
  people behind him works harder"), **never a retroactive gift from remembering.**
- **Allies** — old porter/guild mates recruited to the expansion.
- **Trade ties** — origin-town goods, contracts, and ready-made caravan/porter routes that plug into the
  estate's region/castle-town/Edo expansion.

**Hard guardrail:** returning memory grants **access only** (new nodes/allies/quests unlock narratively) and
**ZERO mechanical bonus**; every asset must still be grind-built. At least one origin beat is always available
**without** reputation-gating, so the thread never fully stalls. (The re-foundable **Kuzuhara** birthplace and
the wider post-town commercial region are T2+ expansion nodes — see §1.7.1.)

### 1.5.4 How the three interrelate — and the Tama-vs-farmhand allegiance

**Separate earned standing meters** keep them from collapsing into one bar: **Estate Service** (steep geometric)
and **Combat Standing** (the estate's two rank-gating meters — progress meters, **not** economy currencies),
**Village Reputation** (gentle per-node meters), and **Origin Ties** (discrete memory milestones). Above all of
them sits **House Influence**, the macro-resource
the estate spends to expand: the estate generates it directly, while village allies and origin trade-ties act
as **multipliers/feeders** — they don't unlock the next tier, they make conquering it faster and cheaper
(tuned so weaving both in roughly **halves** time-to-next-tier — *felt, never a wall*).

**Tensions (chosen, not bugs):** high estate rank can hand duties that **extract** from the village (collect
the rice quota), raising Estate Service but denting Village reputation — with an always-available "soften it
quietly" option the side-mystery rewards. The legend pulls both ways; the origin pulls him down-valley while
the spine pulls him deeper in. **Faction tension is light / flavour — no mechanical penalty.**

**Synergies:** village allies and recruited friends become **late-game** seconded helpers at estate works
(auto-producers are late-game only — never an early idle layer); origin trade-ties become the supply chains
that make region/Edo expansion affordable; high estate rank grants the standing and safe-passage to even reach
the origin town.

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
| **Arms** (martial) | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognised martial deeds (a road declared safe; a nest cleared; the grain store defended; a rival's enforcer broken) + seasonal security **judged results** (fired on a new high-water mark, never repeatable maintenance) |
| **Estate & Wealth** (economic) | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation), **TREASURY** (debt→solvency→creditworthiness, *goyōkin*), **TRADE** (routes, broker standing, the signature ***meibutsu*: silk / sericulture**) |
| **Standing & Office** (political/territorial) *(exact kanji TBD at the §5 authenticity pass)* | — | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed (named on the roster; the bailiff duty; a dispute arbitrated; a valley allied) |
| **Name & Honour** (prestige/cultural) | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition; the house off the foreclosure list; a sponsored rite; an inspector's report; a recorded merit-elevation |

> **Trade is demoted to 1-of-3 sub-engines inside Estate & Wealth and hard-capped to ~⅓ of that one pillar**
> — so a pure-trade run maxes ~⅓ of one of four pillars and can never dominate. The signature **_meibutsu_ =
> silk / sericulture (LOCKED)** that was once the whole endgame is now **one capped strand in one sub-engine of
> one pillar** (still subject to the trade ≤⅓ cap).
>
> **Note:** the **Standing & Office** pillar is labelled in plain English; its **exact kanji is deferred to the
> §5 authenticity pass.** (Resolved: no coined compound is committed to here.)

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

Tier-up is **not** crossing a single band, and it is **not** a balanced-development floor with overflow
substitution (that author-invented "four-value gate / clear-all-four / ≤25% overflow" mechanic is **REJECTED** —
Round A). Instead, **tier gating = per-tier REQUIRED PILLARS via SIMPLE THRESHOLDS**: each tier names the one or
two pillars that must clear a stated threshold to advance, and **the required pillars drift per tier** — early
tiers require **Arms + Estate** ("survive and get strong"); upper tiers require **Office + Name** ("win it
socially"). No global floor across all four, no overflow-substitution arithmetic. The only structural cap that
survives is the **trade sub-engine ≤⅓ of Estate & Wealth** (so trade can never carry a gate). Side factions are
**multipliers** into the pillars, never new pillars. The full five-tier climb is paced over a
**generational/decadal in-world span** for the upper tiers (T3→T4), so "restore *and* surpass" reads as earned
over years.

| Tier | Theme | Transition story gate (entry) | Required pillars (simple thresholds) |
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
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate (T0) | Estate | The *genkan*; the visitor's mat | R1. The diegetic stage for promotions and the Tama-vs-farmhand framing. *(LOCKED: T0 room/area reveals are SEPARATE — the stables, woodlot edge, and drill yard each reveal individually, not folded in.)* |
| **The Home Paddies & Dry Fields** | Kurosawa Estate (T0) | Estate | Fallow plots to reclaim; the granary | R1; *shinden* reclamation begins around R4. The rice/*koku* heartbeat (active grind, not idle producers). |
| **The Drill Yard** | Kurosawa Estate (T0) | Estate | Training posts; Jūbei's weapon rack | **R3, after the humbling first fight (combat live from T0).** Conditioning & idle-combat. |
| **The Main House / *Omoya*** | Kurosawa Estate (T0) | Estate | Kitchen & inner rooms; the household shrine; the lord's study (ledgers) | R4 (houseman); the study at R7 (bailiff). |
| **The Market / Shop Row** | Village of Asagiri (T1) | Village | Smith Gonta's forge; Obaa Sato's herb stall; Brewer Tokuemon's; Weaver Onatsu's (silk) | T1 (estate trusts him to run errands; from T0-R6 / village V0). Per-shop reputation meters. |
| **The Chief's House** | Village of Asagiri (T1) | Village | Yagōemon's receiving room; the village ledgers | T1, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
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

> **Marriage / adoption-into-higher-status is a REAL late-game (T3/T4) lever (NOT cut).** Kept lean — a
> grounded alliance/status move (not a relationship or people-management sim) that lifts **Standing & Office**
> and **Name & Honour** and is one of the **multi-route castle-town takeover** paths. It threads through the
> T3/T4 nodes above (the *daikan*'s office, the Edo conduit) rather than being a node of its own; details at
> §3/§5.
>
> **Cut for now (reintroduce later, "start lean, add back"):** the Matagi hunters, the Pilgrimage Order, and
> the Scholars-&-Physicians as a *network* (keep Ranpo / Obaa Sato as the existing seed only).
>
> **Macro-tier spatiality is SETTLED: full walkable maps at EVERY tier, always** (T0–T2 built in v1; T3–T4
> maps built later — **not** abstract-board-only by design). This is no longer an open question. The only
> residual is **build sequencing** (upper-tier maps are authored after v1), not a design hedge toward abstract
> boards.

## 1.8 Cast (by faction & area)

Grouped by faction. Most NPCs do **double duty** — a gatekeeper *and* a story thread in the same beat — to
keep the web legible. The **estate roster GROWS per tier** (annotated below); the **village cast stays
static**; the origin cast unlocks at T2.

### Estate (main) — the Kurosawa household & retainers

| NPC | Role | Function | First appears |
|---|---|---|---|
| **Lord Kurosawa Munenori** | Head of the house, late 50s; weary, decent, stiff-backed pride papering over shame. | **Apex rank-gatekeeper** — upper-rung promotions need his explicit recognition; his approval *is* the main quest's measure. Believes ledgers, not omens. The **generational succession beat** runs through his aging decline. | E0 (T0) |
| **Kurosawa Naoyuki** | The lord's son and heir, ~22; talented, restless, chafing at genteel poverty. | Early **rival inside the household** (gatekeeps mid rungs); the talent-foil *inside* the family until the grind outpaces his coasting. Arc: rivalry → grudging respect → brotherhood; **converted talent, not innate gift.** Later the **ally against Rival House Tomita**; comes into his own as the house's future. *(LOCKED: Naoyuki-rises-as-heir and the early in-house rival→brotherhood arc are confirmed.)* | E0 (T0) |
| **Lady Kurosawa Chiyo** | The lord's wife, ~50; manages the inner household and its meagre purse. | Gatekeeps **houseman access (R3)** and the domestic economy; later the house's **alliance-strategist** at the castle-town. | E0 (T0) |
| **Dowager Kurosawa Toku** | The lord's mother, ~75; sharp-memoried; the only one who lived through the fall as an adult. | Living **backstory keeper** — slowly parts with why the house declined (grandfather **Sadamune's** failed flood-venture). Embodies "no shortcuts." | E0 (T0) |
| **Chief Steward Genemon** | Runs the estate day to day, ~60; dry, overworked, fiercely loyal. | The **spine's primary rank-gatekeeper and quest-giver** — first calls him "another mouth," assigns nearly all early labour, grants the rung-by-rung promotions. Arc: grudging tolerance → reliance → naming him deputy and successor. | E0 (T0) |
| **Tanomo** | Estate accountant/clerk, ~45. | Gatekeeps the *koku*/economy and debt-repayment systems; the in-house thread into the ledger/debt mystery; later runs the debt-restructuring interface. | E0 (T0) |
| **Jūbei** | Aging master-at-arms / drillmaster; competent-but-never-great old foot-soldier. | **The mentor** and combat/training gatekeeper — "Talent is a story the lucky tell. You are not lucky. So you will work." Gates the entire training/idle-combat suite after the humbling first fight. | E0 (T0) |
| **Sota & Mago** | A grizzled groom and a cheeky teen field-labourer — the bottom-rung peers. | The field/stable labour loop and honest friendship at the floor of the ladder. | E0 (T0) |
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
| **Headman Yagōemon** | Village headman (*shōya/nanushi*). | The **Village Chief reputation gatekeeper** AND a humanly-reachable culprit (doctored ledgers cover the foreman's skim). Warm civic quest-giver up front; never a monster. |
| **Sayo** | The headman's daughter, ~16; sharp, kind. | The village's main quest-giver and the **living heart of the legend** — names him "Tama" on sight. Tutorializes the village/trade loop; the person the truth most hurts and most frees. |
| **Obaa Sato** | Village herbalist / wise-woman. | The village's **folklore-keeper** — narrates the *kamikakushi* legend sympathetically while knowing it is coping; teaches foraging/village-craft. |
| **Priest Ryōa** | Shrine/temple keeper. | Folklore-atmosphere quest-giver whose **register of the vanished** becomes hard evidence in the lost-child thread. |
| **Smith Gonta** | Gruff village blacksmith. | Tools and later spearheads — gates metalcraft; values shown effort over flash. |
| **Carpenter Risuke** | Village carpenter/builder. | Repairs and construction — gates building systems; later the Kuzuhara river-works lead. |
| **Weaver Onatsu** | Village weaver / sericulturist, a sharp widow. | **Lead of the signature *meibutsu*: silk / sericulture (LOCKED)** — runs the silk/textile trade sub-engine that ties into Lady Chiyo's economy and the origin trade routes. |
| **Brewer Tokuemon** | Village sake brewer, jovial. | The village's festival/social hub and a minor trade line (sake is **not** the *meibutsu* — that is silk). |
| **Innkeeper Sukezō** | Runs the inn and the **rumours board**. | The dedicated delivery vector for optional light-folklore side-quests; information broker. |
| **Peddler Sokichi** | Itinerant medicine-seller / peddler. | The **bridge** beyond the village (toward the origin town and the region); grounded source of yokai tales; helped the real Tama flee (a lost-child clue). |
| **Foreman Magobei** | A skimming village foreman — the "tanuki" of the rumours board. | The **T1 antagonist** and first hard thread into the rice-quota pattern (a doctored measuring-box). Reachable and human. |

### Origin (side) — Sawatari-juku & Kuzuhara *(unlocks at T2)*

| NPC | Role | Function |
|---|---|---|
| **Jinpachi** | Tahei's father, ~50; a senior porter / labourer at Denbei's house. | **Re-added per Round A** (renamed from the colliding "Kuranosuke"). Grieved him as dead; the source of the porter's-knot lineage (**ZERO bonus**). His **reunion resolves at T2** alongside the rest of the family, with an **optional later emotional callback at T4** (the recovered family proud behind the MC). |
| **Oyuki** | Tahei's mother, ~45. | Emotional core of the origin thread — grieved him as dead; the reunion is the warm payoff, kept earned and a little costly. |
| **Okimi** | Tahei's elder sister, ~20; married into a trading family. | The concrete **trade-tie** that lets the origin town supply and route goods for the expansion. |
| **Master Denbei** | Tahei's old employer, ~55; runs the transport-and-goods house. | Supplies porter/logistics know-how and legitimate manifests; the grounded source of the porter's-knot identity (**ZERO bonus**). |
| **Kanta** | Tahei's childhood best friend and fellow porter, ~18. | Comic-warm friendship rekindled; the first porter contact and recruitable lead carrier. |
| **Osen** | A sweetheart Tahei half-remembers, ~17. | Optional relationship thread the dream surfaces; grounded and gentle, narrative-only. |
| **Otsuru (the real Tama)** | The "spirited-away" child, alive and grown in the post-town. | Mystery payoff & living proof — a girl who **ran** from a violent stepfather and a near-sale for debt. Reunion kept **costly and incomplete** (she may not forgive). **"Otsuru" is LOCKED** (the substance — a girl who ran — was always canon; the name is now confirmed; deliberately distinct from sweetheart **Osen** to avoid confusion). |

### Region / Castle-town / Edo — antagonists, rivals & apex authority *(T2+, mostly parked)*

| NPC | Role | Function |
|---|---|---|
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" of the pass. | The **T2 dangerous combat beat** and the **talent-gone-rotten mirror** — edge **trained and brutal, never innate**; survived by labour-built endurance, never out-talented; muscle-for-hire (often Tomita's). |
| **Rival House Tomita** (head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei**) | A competing *goshi*/merchant house that prospered as the Kurosawa fell. | The **primary, persistent regional STATUS rival** (T2→T4) — capital + connections + ruthlessness, **never innate gift.** Out-maneuvered commercially/socially, **never killed** (détente, alliance, or clean defeat). *(LOCKED: house "Tomita" plus the lineage — head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei** — are confirmed.)* |
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
service to clear a debt; she has been alive and grown the whole decade in the post-town (as **Otsuru**),
too ashamed to return. Resolution is grounded and **partial** (she may not forgive). The MC is **not** her.

**(B) The grounded true-origin thread.** His real past is mundane: his true name is **Tahei**, a young
porter/errand-hand for a small transport house in **Sawatari-juku**, with **living** family and friends
there — father **Jinpachi**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**,
sweetheart **Osen**. **The origin story (no magic):** he left on a mundane errand escorting a goods
consignment over the pass; a **flash flood (a neglected upstream embankment failing) and rockfall** struck the
small caravan; he was struck, half-drowned, swept downriver, and snagged at the weir below the estate. His
amnesia is ordinary **head trauma + near-drowning + exposure** — no magic. As memory returns he re-engages
them; seeing what he is rebuilding, they back him with **pride, allies, resources, and trade ties** — **access
only, never a mechanical gift.** **Both side-threads (incl. the father reunion) RESOLVE at the Region tier
(T2)**; the T4 epilogue carries only an **optional emotional callback** (the recovered family proud behind him
— §1.11), never a second mechanical payoff.

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
| **T2** | The lost-child truth (Otsuru) resolves; the origin reunions (Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen); Kuzuhara re-founding + naming the drowned; the "one-eyed mountain god" = Hanzaki investigated; the fox-fire ridge = a hidden charcoal kiln. |
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
| **T1 — Village** | **Foreman Magobei**, the "tanuki of the rumours board" — skimming rice with a doctored measuring-box (*kyō-masu*). The first, small human antagonist. | The T1→T2 gate needs the village happy; his skim keeps stores short and steals the surplus you need; he's the "tanuki" folklore beat. | The board's "rice-thieving tanuki" → one load measuring short twice → the doctored *masu* → the thread runs up to Headman **Yagōemon**, whose ledgers cover Magobei. Dawning unease, then a box of rigged wood. | **Peaceful:** expose the skim, Yagōemon makes restitution and keeps his post in disgrace. **Assertive:** force Magobei off the books (his hired muscle is the first small brawl). **Partial:** Magobei answers; better-connected Yagōemon mostly escapes with a quiet rebuke. |
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
climax is a **national multi-pillar *banzuke* ranking of the HOUSE** on all four pillars (canon-locked: rank
the house, D-010 ceiling kept), on which the Kurosawa climb from unranked toward the top, with the highest
slots **structurally sealed** — the wall the truly powerful built, made the chart's literal geometry. Per-tier
rank ladders also rank the house at each tier (a domain *banzuke* precedes the national one). *(LOCKED framing:
presented as a **popular *mitate*/parody broadsheet** rather than an official register, with **sumo-rank
vocabulary** — Maegashira/Komusubi for the house's attainable band, Ōzeki/Yokozuna for the sealed top.
Confirmed alongside the house-ranking *banzuke* + the D-010 ceiling.)*

**One ending + post-game.** There is **one authored ending** (the house restored & ranked) + **post-game
free-play (no reset)**; branches are in *how* you got there (allegiance / takeover route), not separate endings.
**D-010's honest ceiling is preserved by ranking the HOUSE, not the man:** the protagonist does **not** become a
*hatamoto* or get received by the shogun; recognition arrives **indirect and mediated** (down through rusui
**Konoe** and **Lord Munenori**). His personal ceiling stays **chief steward / *yōnin* — the lord's right hand**
(*karō* stays aspirational narration only); the house's *banzuke* rank keeps climbing post-cap (decoupling personal vs house ascension). The post-game long-tail
is escalation/mastery over what's already built (defend the top *banzuke* spot on the biennial *sankin-kōtai*
heartbeat, recoverable and never a decay-tax; optional grounded super-bosses; per-pillar mastery goals; the
estate-as-sandbox teaching layer re-homed onto **Tokujirō** and recruited origin friends).

**Succession.** A generational beat: aging **Lord Munenori**'s decline → heir **Naoyuki** comes into his own
(the MC as right-hand); the house's future is secured across a generation. The epilogue is a tableau of
everything built: the restored-and-surpassed house seal, the reclaimed fields, the resettled Kuzuhara, the
named drowned, the freed and self-determining Otsuru, the recovered family proud behind him, and a true name
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
silent menu growth. Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — see §1.5.1), **not**
one continuous R0→R7 climb. **Combat surfaces inside the FIRST tier (T0)**, not mid-ladder.

**T0 — Estate ladder reveals:**

- **R0** — body/rest bar + rice counter.
- **R1** — labour loop + paddies + *koku*.
- **R2** — Skills tab + foraging/woodcutting + the near-satoyama.
- **R3** — **drill yard + Combat panel + Equipment/Inventory + Bestiary** (after the humbling first fight — combat is live this early).
- **R4** — main-house interior + the household domestic economy; first *shinden* begun.
- **R5** — pest-control/hunt/clear/defend quests + craft chain + **the first combat-earned standing.**
- **R6** — workshops + granary + proto-industry levers; **errands beyond the estate (the village tier opens).**
- **R7** — the four-bar House Influence panel made visible + cash-crop levers + the tier-expansion map (capstone bridge to T1).

**T1 — Village ladder reveals (a FRESH ladder, V0→V7):** the village tier opens minimal (one contact, one shop)
and progressively reveals shop-reputation meters → chief's house → inn & rumours board → road-security &
valley-scale combat → the silk/sericulture *meibutsu* sub-engine → Office standing → the **region** map and the
T1→T2 quest. **T2 mints another fresh ladder** the same way (region scale; the personal-mystery payoff lands
across it). The point is the same motion repeating per tier, never an eight-rung-and-done staircase.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal **judged** Influence results — fired on a
**new high-water mark**, never a repeatable per-season maintenance trickle, per §1.6.2). **Auto-producers are
limited / late-game only** (early game is the MC's own active grind — combat, skills, jobs, crafting; **no
assignment/management panel and no labour-gang to manage**, ever). Everything is data-driven (areas/panels/
resources as registries with unlock predicates over GameState), deterministic under the one seeded RNG, with
balance/unlock tables generated into `docs/` and headlessly regression-testable via the DEV play API. The
estate, village, and origin tracks differ in **shape** to keep pacing varied (estate steep-geometric per-tier
ladders; village gentle per-node meters; origin discrete milestones), and the side factions act as Influence
**multipliers** (≈ halve time-to-tier — felt, never a wall). The presentation register throughout is
**text + emoji + CSS art** (woodblock palette; kanji season tags; colour-coded rarities — see D-013).

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
  Name collisions resolved: the origin **father is re-added as Jinpachi** (renamed from the colliding
  "Kuranosuke") — **settled, not dropped**; pick one macron romanization convention project-wide.
- **Hard-cap martial scale.** A **small named retinue** + temporary corvée/levies for crises, **never a
  standing army**; "de-facto security" = the house the daimyo *deputises* (sanctioned, revocable). Re-balance
  toward **labour-plurality** (peaceful labour the dominant daily texture; combat the strong mid-game-onward
  second pillar).
- **Standing & Office pillar uses a plain-English label (RESOLVED)** — no coined compound is committed; the
  **exact kanji is deferred to the §5 authenticity pass.** The top-rung title is **RESOLVED = chief steward /
  *yōnin*** ("the lord's right hand"); keep grand *karō*/adoption vocabulary as **aspirational narration only**
  for a modest *goshi* house.
- ***Meibutsu* product is LOCKED = silk / sericulture** (Round A). No placeholder; author the T3/T4
  trade/prestige payload directly against silk (weaver Onatsu leads the sub-engine; it stays under the trade
  ≤⅓ cap).
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
| **D-008** | Three starter factions + **four-pillar** House Influence + **per-tier required-pillar gating via SIMPLE per-tier thresholds** (no balanced-development floor, no overflow-substitution — that formula is rejected; only structural cap is trade ≤⅓ of Estate & Wealth). | **New ADR.** |
| **D-009** | Origin = **living** family/friends (Sawatari-juku) opening at **T2**; Kuzuhara a re-foundable region node; access-only. | **New ADR** (supersedes family-death canon). |
| **D-010** | Indirect/mediated **Edo ceiling** — rank the HOUSE (national *mitate-banzuke*), not the man; no *hatamoto*/shogunal audience. | **New ADR** (Option A: provincial/parody chart; personal rank hard-capped at chief steward). |
| **D-011** | **Combat earns standing** via the Arms pillar (reverses the old "never a source of standing"); mediocre-start preserved; conditioning gate, no cross-feed. | **New ADR.** |
| **D-012** | Per-tier rank ladders + full maps every tier + **v1 = T0–2** (T3 stub, T4 roadmap); lean cut-set (~8 rungs, ~5 mobs, ~4 quest types, ~6–8 nodes). | **New ADR.** |
| **D-013** | Tech & presentation: Vite + TS + Vitest; pure-core + thin DOM renderer; one seeded RNG; IndexedDB + base64 export/import; responsive desktop+mobile (not hover-dependent); **active-only, no offline progress**; static itch.io build. **Art register = TEXT + EMOJI + CSS** (woodblock palette; kanji season tags; colour-coded rarities). | **New ADR.** |
| **D-014** | **Per-tier antagonists** (not a single racket); the racket demoted to a **light, optional connective thread**; T0 villain-less; two rival houses (Tomita + Akagi). | **New ADR.** |
| **D-015** | Four-pillar accrual = **achievement JUMPS + seasonal JUDGED RESULTS** (new-high-water-mark only), up-only + rare recoverable **per-pillar** dents (never a wipe). | **New ADR.** |

### Resolved by Round A (no longer open — recorded for traceability)

- ***Meibutsu* = silk / sericulture** (LOCKED). Was a candidate list; now settled — weaver Onatsu leads the
  sub-engine; threads T1→T4 under the trade ≤⅓ cap.
- **Macro-tier spatiality = full walkable maps at every tier, always** (LOCKED). The "vs abstract boards above
  T2" hedge is removed; only build sequencing (upper-tier maps authored after v1) remains.
- **Origin father = re-added as Jinpachi** (LOCKED; renamed from "Kuranosuke"). Reunion resolves at T2, optional
  emotional callback at T4. The "cut/dropped?" framing is retired.
- **Second rival house = Akagi** (honour/precedence) beside Tomita (money) (LOCKED — canon requires exactly two
  rival houses; not folded into Naoyuki-as-internal-foil).
- **Marriage / adoption = a real lean late-game (T3/T4) Standing/Name lever** and a castle-town takeover route
  (LOCKED — restored; not cut).
- **Tier-gate shape = simple per-tier required-pillar thresholds** (LOCKED — the floor+overflow formula is
  rejected; only the trade ≤⅓ cap survives as a structural cap).
- **Author-invented names/framing = CONFIRMED** (LOCKED — human sign-off received): **Otsuru** (grown Tama's
  name; substance "a girl who ran" was always canon); the **national *banzuke* as a *mitate*/parody broadsheet +
  sumo-rank vocabulary** (Maegashira/Komusubi for the attainable band, Ōzeki/Yokozuna for the sealed top); the
  **Naoyuki rival→brotherhood** in-house arc; **Rival House Tomita** lineage (head **Sōzaemon**, heir
  **Kageyuki**, agent **Yasubei**); **Rival House Akagi** (head **Gennai**).
- **Standing & Office pillar label = plain English** (LOCKED — no coined compound committed; the exact kanji is
  deferred to the **§5 authenticity pass**, not an open design question).
- **Top-rung title = chief steward / *yōnin*** ("the lord's right hand") (LOCKED); aspirational *karō*/adoption
  vocabulary stays **narration only** for a modest *goshi* house.
- **Romanization convention = macrons (proper Hepburn) project-wide** (LOCKED — Tōkichi, Yagōemon, Jūbei,
  *kyō-masu*, etc.).
- **Estate T0 room/area reveals = SEPARATE** (LOCKED — stables, woodlot edge, and drill yard each reveal
  individually; no fold-into-forecourt).

### Genuinely-open items still flagged for the human

- **The *osso* petition's "whose neck" = SETTLED** (a *gimin*-martyr ally bears the lethal risk; the MC's hands
  stay clean — reconciled with partial-justice and the indirect ceiling). Listed here only for traceability; it
  is no longer an open question.
- **Balance values** — the per-tier required-pillar thresholds, the seasonal judged-result formula, conversion
  weights, and big-number formatting — deferred to §4. (The *shape* is settled: simple thresholds + trade ≤⅓ of
  Estate & Wealth; **no** floor/overflow arithmetic.)
- **Final ADR numbering** — set at integration.

---

# §2 — Systems & Mechanics Catalog

### System inventory (the parts list)

| # | System | First introduced | Pillar(s) it feeds |
|---|--------|------------------|--------------------|
| 2.1 | UI-reveal engine + event log | T0 (M0; exists from build one) | — (the meta-spine that surfaces every other system) |
| 2.2 | Time, season & world clock (active-only) | T0 | feeds seasonal **judged results** for all four |
| 2.3 | Soft stamina / satiety | T0 | — (paces the day; no pillar) |
| 2.4 | Resources & currencies (koku, coin, pillars, materials) | T0 (koku); coin T1 | Estate & Wealth; pillars are the macro layer |
| 2.5 | Auto-producers (late-game only) | T3+ | Estate & Wealth (idle convenience, never early) |
| 2.6 | Gathering / labour nodes & jobs-as-offices | T0 | **Estate & Wealth**, **Standing & Office** |
| 2.7 | Attributes, per-skill levels & milestones | T0 (attributes/skills); web grows per tier | Arms (combat skills), Estate & Wealth (labour skills) |
| 2.8 | Combat (idle auto-resolve + active setup) | **T0 (R3)** | **Arms** |
| 2.9 | Bestiary & mobs (grounded) | T0 (R3) | Arms |
| 2.10 | Loot, equipment (FIND + CRAFT), gear & inventory | T0 (R3) | Arms; crafting overlaps Estate & Wealth |
| 2.11 | Crafting (hybrid: simple → component/quality) | T0 (simple); component system T1+ | Estate & Wealth (trade sub-engine); Arms (gear) |
| 2.12 | Dialogue & quests (open-ended) | T0 (dialogue); quest log ~R5 | all (the universal unlock/reward bus) |
| 2.13 | Lore, inn rumours & the belief→cause engine | T1 | Name & Honour (flavour); never gates the spine |
| 2.14 | World sim (seasons / weather / festivals) | T0 clock; seasons/festivals T1 | seasonal judged results for all four |
| 2.15 | Factions & reputation (estate ladder, village web, origin ties, allegiance) | T0 (estate); T1 (village); T2 (origin) | all four (via multipliers / standing) |
| 2.16 | House Influence — the four pillars (accrual + per-tier gating) | tracked visible at T0-R7 | the macro roll-up of all four |
| 2.17 | Estate growth (build / recruit = flavour) | T0 (E0→E2 in v1) | Estate & Wealth; Arms (defensive works) |
| 2.18 | The national *banzuke* / per-tier ranking | per-tier domain rank; national at T4 | reads all four pillars |
| 2.19 | Save / load (IndexedDB + export/import) | T0 (M2 minimal) | — (infrastructure) |
| 2.20 | The DEV play API + content verifier | T0 (M1 skeleton) | — (infrastructure/QA) |
| 2.21 | Accessibility, audio & presentation register | T0 | — (infrastructure) |

The rest of §2 details each. **Systems 2.1, 2.16, and the pillar accrual rules in 2.15 are the most
load-bearing** and are flagged for the human at the end (§2.22).

---

## 2.1 The UI-reveal engine + event log

**(a) What it is.** The signature first-class system and the spine of the entire game's presentation:
**every panel, tab, resource row, button, skill, area, and screen is DATA with an unlock predicate
over `GameState`.** The renderer shows only what is currently unlocked. "The UI is incremental" is a
tunable content table, not hardcoded view logic. Paired with it is the **persistent event log** — a
scrolling, colour-coded, capped message feed present from second one, which doubles as the narration
channel *and* the unlock announcer. Every reveal fires through a **universal rewards/unlock bus**
(`process_rewards`) as **one event** that simultaneously: pushes a diegetic log line, reveals the
next panel/tab/resource/area, grants the perk, and advances a story flag — so feature unlocks read as
**plot, never silent menu growth.**

**(b) Player-facing behaviour / loop.** Minute one is one verb ("Rake the spilled rice") + the log +
a counter. As the player acts, things *appear*, each announced in-fiction ("footsteps — a door
slides…"). The **UI shell is multi-screen navigation that appears single-screen early**: more
screens/nav unlock as the player progresses (responsive desktop + mobile, **not** hover-dependent).
Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — §1.5.1, §2.15), never one
continuous staircase. The loop the player feels: *act → something new fades in with a log line →
explore it → act more.*

**(c) Rough DATA shape.**
- `RevealableEntry { id, kind ('panel'|'tab'|'resourceRow'|'button'|'screen'|'area'|'navLink'),
  unlockPredicate (expression over GameState: flags, resources, rank, skill levels, story node,
  season, pillar values), revealLogLineId, oncePerGame }`
- `RewardBundle { items?, xp?, coin?, koku?, materials?, locationsRevealed?, panelsRevealed?,
  dialoguesUnlocked?, recipesUnlocked?, questsStarted?, flagsSet?, pillarDeltas? }` — the universal
  object every dialogue/quest/threshold/combat-deed can emit.
- `LogMessage { id, text, channel ('narration'|'reward'|'combat'|'system'), colorClass, tICK }`,
  stored in a capped ring buffer.
- Unlock predicates are **pure functions**; the renderer subscribes to state snapshots and does one
  `render(state)` reconciliation (no scattered push-updates → kills stale UI).

**(d) Ties to the four pillars.** Indirect but total: the **House Influence panel (2.16) and many
late reveals are gated on pillar thresholds**, so "numbers go up" and "the world enlarges" are one
motion. The reveal engine is the surface on which all four pillars become *visible* (the four-bar
standing panel reveals at T0-R7).

**(e) When introduced / fractal reveal.** **T0, build one (M0).** It exists before any content and
governs everything thereafter. It is itself fractal: a drill yard reveals one post → a rack →
sparring slots; a new region reveals one road → one threat → one contact.

---

## 2.2 Time, season & world clock (active-only)

**(a) What it is.** An **abstract in-game clock advanced by active play** (a single tick driver with
per-tick / per-day / per-week scheduler). Drives day/season (kanji tags), weather, lunar phase,
festivals, vendor restocks, food rotting/fermenting, and — critically — the **seasonal *judged*
Influence results** (§2.16). **ACTIVE-ONLY: no offline progress; story never advances while away.**

**(b) Player-facing behaviour / loop.** Time passes as the player works; a day/season indicator (e.g.
春 spring) is always visible once revealed. Seasons gate which gathering nodes are productive (rice
cycle, foraging windows) and trigger festivals and the seasonal appraisal beats. There is **no
real-time idle accrual and no offline summary** — the clock only turns when the player plays.

**(c) Rough DATA shape.**
- `WorldClock { tick, day, season ('spring'|'summer'|'autumn'|'winter'), year, lunarPhase, weather }`
- `Scheduler { perTickPlans[], perDayPlans[], perWeekPlans[] }` — registry rows that fire effects on
  cadence (restock, rot, festival start, harvest appraisal).
- `SeasonalAppraisalState { lastJudgedHighWaterMark per pillar, pendingAppraisalDue }` — feeds 2.16's
  judged-result accrual (fires on a **new high-water mark**, never repeatable maintenance).

**(d) Ties to the four pillars.** The clock is the **timing source for accrual shape (B)** — periodic
**judged results** (a season's harvest, an autumn audit, a security appraisal) for **all four
pillars**. It never grants Influence by itself (no time-trickle).

**(e) When introduced / fractal reveal.** **T0** — the clock display reveals early (around R1, with
the *koku* heartbeat); seasons/weather/festivals deepen at **T1** (the world-sim layer, §2.14).

---

## 2.3 Soft stamina / satiety

**(a) What it is.** A **soft** energy/satiety meter that **slows** action when low — it **never
hard-blocks** play. Rest and eat to refill; it paces the day and gives food/cooking a purpose.

**(b) Player-facing behaviour / loop.** As the MC labours or fights, satiety/energy drains; depleted,
actions get slower / less efficient (a gentle nudge to rest, eat, or change activity), never a wall or
a punishing timer. Refill by resting (advances the clock) and eating cooked food (ties to the cooking
skill and provisioning economy). The convalescence framing of the cold open uses this meter (rest and
recover "a little" in the first hours — he is **not** a bedridden invalid).

**(c) Rough DATA shape.**
- `Vitals { hp, hpMax, satiety, satietyMax, fatigue }` (derived caps recomputed on load from
  attributes + gear + milestones).
- Action costs reference a `staminaCost` field; a soft-throttle function maps low satiety → a
  *rate multiplier* on labour/combat speed (never to zero).
- `FoodItem { restoreSatiety, buffs?, perishable, spoilTicks }`.

**(d) Ties to the four pillars.** None directly. It is a pacing system. (Cooking/provisioning that
feeds it sits under Estate & Wealth's labour, §2.6.)

**(e) When introduced / fractal reveal.** **T0** — the body/rest bar reveals at **R0** (in the *kura*,
alongside the rice counter). The satiety soft-gate surfaces as the player leaves the storehouse and
labour begins (R1–R2).

---

## 2.4 Resources & currencies (koku, coin, pillars, materials)

**(a) What it is.** The economic substrate. **Canon currencies:** **koku (rice)** = the base
exponential currency and historically real unit of wealth/tax (the *koku* heartbeat); **coin (mon)** =
the secondary trade currency; **the four House Influence pillars** = the macro standing layer (NOT
spendable like koku/coin — they are the cumulative score of what the house has *become*; see 2.16).
**Other resources** (wood, charcoal, fish, *sansai*/wild greens, herbs, hides, fibre/silk cocoons,
ore/iron, etc.) feed crafting and trade. Each new resource **lights its own panel/row** on first
acquisition (via 2.1).

**(b) Player-facing behaviour / loop.** Grind koku by farming; convert surplus to coin via trade
(brokers/shops); spend koku/coin/materials on crafting, gear, building, and tier-expansion. **Koku and
coin are inputs you spend and grind; Influence is what you become.** A **market-saturation damper**
(2.11/2.15) depresses sell prices when one good is flooded, recovering over in-game days — keeps
grinding interesting and stops trade running away (reinforced by the trade ≤ ⅓ cap).

**(c) Rough DATA shape.**
- `ResourceDef { id, name, kind ('currency'|'material'|'food'|'fibre'|'ore'…), revealPredicate,
  stackable, perishable?, spoilTicks? }`
- `GameState.resources: Record<resourceId, amount>` (counts only; derived rates computed, never
  stored).
- `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` (numbers → §4).
- Pillar values live in `Influence` (2.16), kept structurally separate from `resources` so trade can
  never masquerade as standing.

**(d) Ties to the four pillars.** koku/coin/materials are the **inputs** the house spends to earn
recognition; **recorded yields and sealed contracts convert to Estate & Wealth** (via achievement
jumps / seasonal judged results). The **trade strand (routes / broker standing / the silk *meibutsu*)
is hard-capped to ≤ ⅓ of Estate & Wealth**, so a pure-trade run maxes ~⅓ of one of four pillars.

**(e) When introduced / fractal reveal.** **T0** — koku at **R0/R1** (rice counter → paddies). **Coin
(mon)** reveals at **T1** when the village market/shop row opens. Material resources reveal one at a
time as their nodes/crafts come online (foraging → *sansai*; woodcutting → wood → charcoal; fishing →
fish; sericulture → cocoons/silk at the silk sub-engine).

---

## 2.5 Auto-producers (LATE-GAME only)

**(a) What it is.** Idle helpers that produce a resource over time **without** the MC's active action.
**Canon: limited / late-game ONLY** — early game is the MC's own active grind. There is **no
assignment/management panel and no labour-gang to manage, ever** (that would be the rejected
people-management sim). Auto-producers are a late convenience surfaced as **seconded/recruited helpers**
(village allies, recruited origin friends) wired to existing idle-producer slots.

**(b) Player-facing behaviour / loop.** From late game, a recruited helper quietly trickles a resource
(e.g. a seconded hand tending a reclaimed paddy) so attention is freed for the active grind elsewhere.
Framed diegetically as a person joining the house's works — **flavour roster cards, not a managed
sub-economy.** Consistent with active-only: helpers produce **only while the game is being played**;
there is **no offline accrual.**

**(c) Rough DATA shape.**
- `AutoProducerDef { id, resourceProduced, baseRate, costToBuild (koku/coin/materials),
  rankFloor (LOW), pillarFloor, revealPredicate, rosterCardId }` — gated on Influence band + a LOW
  rank floor + cost (not the capstone), per the estate-growth rule.
- Cost curve scaffold mirrors the genre (`cost = base * r^owned`, ~5× jumps between tiers) — **values
  deferred to §4.**
- Bound to a `RosterMember` for the diegetic framing (the helper is a face, not a slider).

**(d) Ties to the four pillars.** **Estate & Wealth** (their output converts to recorded yield).
Defensive auto-producers (a standing watch) can feed **Arms** via security appraisals. They are an
*efficiency* layer, never a standing source in themselves.

**(e) When introduced / fractal reveal.** **T3+ (parked beyond v1's early surface).** v1's E0–E2 estate
stays an **active grind**; the first auto-producers belong to later tiers. Each arrives minimal (one
helper, one resource) and is announced as a recruitment beat.

---

## 2.6 Gathering / labour nodes & jobs-as-offices

**(a) What it is.** The peaceful-labour core — the **dominant daily texture** (labour-plurality). Two
faces: **gathering/labour nodes** (the MC's own active work) and **jobs-as-offices** (administrative
duties framed as *the MC's own quests/offices*, **not** a management layer). **Lean starter set
(canon):** farming, foraging, woodcutting, fishing, smithing, cooking; **more unlock as you climb
tiers/regions.** Nodes are **tiered and season-gated**; clickable now, idle later (active grind first;
an auto-gather toggle is a *late* automation reward, §2.5).

**(b) Player-facing behaviour / loop.** Do the work manually (rake rice, fell timber, forage the
near-*satoyama*, fish the ford); each action yields a **resource + skill XP + sometimes a quest event**.
Higher ranks/offices add **jobs-as-offices** — e.g. the bailiff of the home fields takes on field
administration as **his own duties/quests**, never a city-builder panel. The texture stays **grind
("the hero gets better at what he does")**, not micromanagement.

**(c) Rough DATA shape.**
- `LabourNode { id, skill, resourceYields[], seasonWindow, dangerRing?, staminaCost,
  revealPredicate, autoGatherUnlock? (LATE) }`
- `Job/OfficeDef { id, kind ('labour'|'admin-as-quest'), grantsResponsibilities[], questsOpened[],
  rankFloor, pillarContribution }` — admin offices emit **Standing & Office** recognition, not a sim.
- Yields reference `ResourceDef` (2.4) and grant `SkillXP` (2.7).

**(d) Ties to the four pillars.** **Estate & Wealth** primarily (LAND via *shinden* reclamation;
TREASURY via debt→solvency; TRADE via routes/broker/silk — the trade strand ≤ ⅓ capped). **Jobs-as-
offices** feed **Standing & Office** (offices granted, the bailiff duty, a dispute arbitrated). Recorded
yields and seasonal harvest appraisals are the canonical **achievement-jump / judged-result** sources.

**(e) When introduced / fractal reveal.** **T0.** Farming at **R1** (paddies, the *koku* heartbeat);
foraging + woodcutting + hauling at **R2** (Skills tab + near-*satoyama*); smithing/crafting chains and
fishing fold in across R5–R6 and the wilderness rings. **T1** adds village-facing labour (cash-crops,
the silk/sericulture sub-engine at V3); **T2** adds region-scale labour (post-town trade, Kuzuhara
river-works as a labour project). Jobs-as-offices begin at **T0-R7** (bailiff) and grow per tier.

---

## 2.7 Attributes, per-skill levels & milestones

**(a) What it is.** The **rich attribute system** + **per-skill levels** + a **milestone web**. Canon:
deep, interacting attributes (STR / AGI / INT / SPD / a luck-style stat) **+ per-skill `total_xp`
pools** (skills surface *by doing*, hidden until a small visibility threshold) **+ milestone perks**
(flat stats, multipliers, titles, cross-skill XP bonuses). **Lean core skills at T0; more unlock per
tier.** Character level + XP grants HP, satiety capacity, attribute points, and a compounding skill-XP
multiplier.

**(b) Player-facing behaviour / loop.** Doing labour/combat raises hidden skills until they **surface**
(a discover-by-doing reveal via 2.1), then keep levelling on a steep curve with **per-event XP caps**
(combat and crafting per-event caps force *breadth and grind*, never a quick spike). Milestones at
thresholds grant perks — an emergent build web and long-tail goals. Attributes layer base / additive /
multiplier and **recompute on load** (saved as `total_xp`, not derived stats).

**(c) Rough DATA shape.**
- `Attribute { id (STR|AGI|INT|SPD|luck), base, fromGear, fromMilestones }` (recomputed).
- `SkillDef { id, category ('Farming/Labour'|'Gathering'|'Crafting'|'Combat'|'Weapon'|
  'Environmental'), visibilityThreshold, xpCurveParams, perEventCap, milestones[] }`
- `Milestone { atLevel, perks: RewardBundle-like (flatStat | multiplier | title | crossSkillXp) }`
- `GameState.skills: Record<skillId, total_xp>`; character `Level + xp`.
- **No-hidden-edge guard encoded:** combat skills have **no input edge from labour skills** (no
  cross-feed field exists); milestones never read returning-memory/porter's-knot flags.

**(d) Ties to the four pillars.** Indirect: **combat skills → Arms** (better deeds), **labour/craft
skills → Estate & Wealth** (better yields/quality). Skills do **not** grant Influence directly; they
make the *deeds* that the authorities recognize more achievable. Milestone titles can feed **Name &
Honour** flavour (a recorded merit), but the pillar value comes from the recognized deed, not the level.

**(e) When introduced / fractal reveal.** **T0** — attributes exist from the open; the **Skills tab**
reveals at **R2** on first XP. Combat/weapon skills surface at **R3** (drill yard). Lean core lines at
T0 (farming, foraging, woodcutting, fishing, smithing, cooking; conditioning; 2–3 weapon lines); **more
skills unlock per tier** (e.g. sericulture/textile at T1, surveying/engineering and trade skills at T2).

---

## 2.8 Combat (idle auto-resolve + active setup)

**(a) What it is.** A **first-class core pillar from T0** (not a mid-ladder reveal). Style (canon):
**idle auto-resolve + active setup** — prepare gear/stance/area, a **deterministic seeded fight**
resolves, and the player intervenes with stance / ability / item / retreat. Low-APM, strategic, **NOT
twitch.** It carries a **character Combat Level** (a Combat Deeds pool: combat-XP + a deed-count of
kills / clears / defends), **weapon/martial skills** (2.7), the **bestiary** (2.9), **loot + equipment
FIND and CRAFT** (2.10), and **gear progression**. Combat **EARNS House Influence via the Arms pillar.**
**Mediocre-start preserved:** start near-zero; the **humbling, near-fatal first fight** is an early beat
(survived by luck / sheer stubbornness, never skill — and never *rescued*: you survive it, THEN beg Jūbei
for drills); capacity is **earned through Jūbei's drills**, gated
behind labour-built **conditioning** (a one-way enablement gate that grants **ZERO combat stat or
training-rate bonus**). **Failure = soft setback** (lose HP/time, maybe drop carried loot or take an
injury to rest off) — **never** lose levels/gear/permanent progress.

**(b) Player-facing behaviour / loop.** Choose an area/danger ring, equip gear, pick a **stance** (data
shifting attack/speed/evasion/target-count), optionally bring consumables, then let the fight
auto-resolve on a fixed-step seeded sim; intervene mid-fight (swap stance, use ability/item, retreat).
On kill: XP + skill XP + seeded loot roll + bestiary update + quest events. Cleared areas can re-spawn
idly once an **auto-continue** toggle is earned (a later QoL reward). HP/satiety managed via rest/eat
between fights. **Texture stays peaceful-labour-dominant by volume**; combat is live and load-bearing.

**(c) Rough DATA shape.**
- `Combatant { hp, attackPower, attackSpeed, evasion, defense, critChance, blockChance, statuses[] }`
  (the MC's derived from attributes + weapon/martial skills + gear).
- `CombatSim` advances an internal sub-tick accumulator per `attackSpeed`; per swing: hit (attacker
  dex-like vs target evasion) → damage (`attackPower ± seeded variance` minus defense, with a floor) →
  separate seeded crit/block rolls → status effects applied per tick. All draws from the **one seeded
  RNG** (reproducible, unit-testable).
- `Stance { attackMod, speedMod, evasionMod, targetCount }`; `CombatInterventionIntent`
  (stance/ability/item/retreat).
- `CombatDeedsPool { combatXp, deedCounts (kills|clears|defends), perEventCap }` → the Combat Level
  and a gated **Arms** contribution.
- `InjuryState { kind, restTicksToHeal }` (the soft-setback model — temporary, recoverable).

**(d) Ties to the four pillars.** **Arms (武威)** — recognized martial deeds (a road declared safe, a
nest cleared, the grain store defended, a rival's enforcer broken) convert to Arms via **achievement
jumps** (per-event capped so no single fight spikes the pillar) + **seasonal security judged results**
(fired on a new high-water mark, **not** repeatable maintenance). A **lost battle dents Arms** (small,
scripted, recoverable — never a wipe).

**(e) When introduced / fractal reveal.** **T0, R3** — after the **humbling first fight** (a wolf at
the grain store), the drill yard + **Combat panel** + idle-combat/training reveal (combat is live this
early). Combat-earned **standing** first appears at **R5** (gate-guard). It then interleaves through
every per-tier ladder (V2 road-warden, V5 sworn man-at-arms at T1; road-captain / road-security detail
at T2). Reveals are woven throughout, **never dumped at one Act-close.**

---

## 2.9 Bestiary & mobs (grounded)

**(a) What it is.** A **grounded** bestiary across a **shared danger gradient** (near-*satoyama* →
foothills/charcoal grounds → river/ford → upstream Kuzuhara → high pass), gated by **conditioning**.
**Canon hard rule: NO belief-creatures in grindable spawn tables.** Grindable mobs are honestly-mundane
(**~5 in v1**: wild boar, crop-raiding monkeys, a giant-hornet nest, a wolf pack *or* rogue bear,
bandits/starving deserters). Any "yokai" (kappa, fox-fire fox/tanuki, yamanba/tengu, the "one-eyed
mountain god") is an **INVESTIGATE-then-confront one-shot** that resolves to a human/animal — **never a
respawn population** (surfaced through the optional rumour quests, §2.13).

**(b) Player-facing behaviour / loop.** Entering a danger ring (or a danger event firing) auto-spawns an
enemy from a **weighted population table** for that ring. The bestiary panel fills one entry at a time
(discover-by-encounter). Mobs map to quest types (boar → PEST CONTROL; bear → HUNT; bandit lean-to →
CLEAR; raiders → DEFEND). Human mobs (bandits/deserters) introduce mixed motives and CLEAR/CAPTURE
choices with consequences; some are reachable consciences, not pure villains.

**(c) Rough DATA shape.**
- `MobDef { id, kind ('animal'|'insect'|'human'|'wildlife'), dangerRing, stats (Combatant base),
  lootTableId, spawnWeightByRing, isGrindable (true), bestiaryEntryId }` — **isGrindable = honest-
  mundane only.**
- `BeliefBeast { id, rumourQuestId, resolvesToCause (human|animal|natural), oneShot: true }` — kept in
  a **separate registry** from grindable mobs (enforces the canon rule at the type level).
- `SpawnTable { ring, weightedEntries[] }`.

**(d) Ties to the four pillars.** **Arms** — clearing/securing against mobs is the recognized martial
service that converts to Arms. Loot also feeds Estate & Wealth (crafting materials, §2.10/2.11).

**(e) When introduced / fractal reveal.** **T0, R3** (the Bestiary reveals with the Combat panel; the
boar is the first grindable threat after the humbling fight). New rings/mobs reveal one at a time by
conditioning: near-*satoyama* (T0) → foothills/charcoal grounds + river (T1) → high mountains/pass and
human bandits/ronin (T2). Belief-beast one-shots arrive only via inn rumours (T1+).

---

## 2.10 Loot, equipment (FIND + CRAFT), gear & inventory

**(a) What it is.** The gear pipeline. **Equipment slots with durability** (weapon, body/*dō*, head,
hands, foot/*waraji*, charm) filled **two ways (canon): FIND** (dropped gear — a dropped *nata*, a
fallen rōnin's worn *kodachi*, a boar-hide vest) **AND CRAFT** (through the component chain — wood →
charcoal → Smith Gonta's forge → spearheads/blades/tools; hides → tanner → armour). **Gear progression**
is a measurable ladder (borrowed carrying-pole + crude hatchet → fitted *yari*, padded jacket,
smith-forged blade). Plus the **Inventory panel.**

**(b) Player-facing behaviour / loop.** Defeat mobs / work nodes → seeded loot rolls drop materials,
coin, occasional **found gear**. Equip gear into slots (with durability that wears and is repaired/
re-crafted). Craft better gear via the component chain (quality from crafter skill + component quality +
station tier, §2.11). Disassembly returns materials. Each gear tier is a clear power step on the combat
track (and tools improve labour yields).

**(c) Rough DATA shape.**
- `EquipDef { id, slot, statMods (attack/defense/etc.), durabilityMax, craftRecipeId?, foundOnly? }`
- `LootTable { entries: { itemOrMaterialId, weight, qtyRange }[] }` (seeded rolls via the one RNG).
- `EquipState { slot → { equipDefId, durability, qualityTier } }`; `Inventory: Record<itemId, count>`
  (quality folded into the stack key so quality tiers stack distinctly).
- `Durability { current, max, repairCost }`.

**(d) Ties to the four pillars.** **Arms** (gear enables the deeds that earn Arms). The crafting overlap
(tools, the silk/textile finishing chain) feeds **Estate & Wealth** (and the trade strand, ≤ ⅓ capped).
Gear itself is never a standing source — the *recognized deed* is.

**(e) When introduced / fractal reveal.** **T0, R3** — first crude weapon + **Equipment & Inventory**
panels reveal with the Combat panel. The **loot + craft loop** (Smith Gonta spearheads via the
component chain) comes online at **R5** (gate-guard). Better loot/craft tiers unlock per tier and per
danger ring (worn blades from rōnin at T2; Hanzaki's worn gear as a late FOUND prize).

---

## 2.11 Crafting (hybrid: simple → component/quality)

**(a) What it is.** **Canon: HYBRID** — **simple recipes early; the component/quality system unlocks
later.** Early crafting is a flat recipe (inputs → output). Later it becomes **component-based**: an item
is built from components, and **quality = crafter skill + component quality + station tier**, with
**processing chains** (wood → charcoal → forge → tools → blades; hides → tanner → armour; cocoons →
silk → woven textile). **Disassembly returns materials.**

**(b) Player-facing behaviour / loop.** Early: gather inputs, craft a tool/item at a station (a sickle,
a repaired tool) — simple and legible, gating a small bonus. Later: choose components of varying quality
and a station tier to influence the output's quality tier; build multi-step chains; disassemble to
recover materials. The **silk / sericulture *meibutsu*** is the signature late craft/trade chain
(cocoons → reeled silk → woven/graded textile), led by **Weaver Onatsu**, threading T1→T4 under the
trade ≤ ⅓ cap.

**(c) Rough DATA shape.**
- `RecipeDef { id, mode ('simple'|'component'), inputs[], output, stationTier, skillRequired,
  revealPredicate }`
- `ComponentCraft { componentSlots[], qualityFormula (crafterSkill + componentQuality + stationTier),
  outputQualityTier }` (the *shape*; numbers → §4).
- `StationDef { id, tier, recipesEnabled[] }`; `ChainStep` links processing stages.
- Quality tier is part of an item's stack key (so a fine *yari* and a crude one don't merge).

**(d) Ties to the four pillars.** **Estate & Wealth** — crafted trade goods (esp. the silk *meibutsu*)
convert to recorded trade/yield within the **TRADE sub-engine (≤ ⅓ of Estate & Wealth)**; proto-industry
levers feed the LAND/TREASURY strands. Crafted **gear** feeds **Arms** (via 2.10). A graded *meibutsu*
later feeds **Name & Honour** (a famous product celebrated up-tier).

**(e) When introduced / fractal reveal.** **T0** — simple crafting (the Craft tab / first tool) around
R5. The **component/quality system + processing chains** unlock at **T1+** (smithing chains, then the
silk sub-engine at V3). Each chain arrives minimal (one recipe, one station) and deepens fractally.

---

## 2.12 Dialogue & quests (open-ended, non-hand-holdy)

**(a) What it is.** The narrative + unlock delivery vehicle, and a core part of the **universal
rewards/unlock bus.** **Dialogue** = textlines that grant a `RewardBundle` and can lock other lines
(branching), gated by `display_conditions` (reputation / rank / season / skills / flags). **Quests** =
sequential tasks advanced by game events. **Canon quest design: open-ended, NON-hand-holdy** — a quest
is **a suggestion + a story you find out in the world**, never an A→B→C waypoint list; **fewer
checklists overall**; the dominant minute-to-minute behaviour is the **incremental grind.** **~4 v1
quest types** (combat- and labour-spanning, all open-ended): **PEST CONTROL, HUNT, CLEAR, DEFEND** (the
standing-earner). Escort/patrol/bounty/duel/expedition/siege/relief/investigate are **parked for T2+**.

**(b) Player-facing behaviour / loop.** Talk to NPCs (gatekeepers who do double duty as story threads);
lines unlock content and advance flags. Take a quest as an *aim + a rough where* (e.g. "something is in
the lower field at night"), then **read the world** to find the truth (one boar or a sounder? where does
it den?) — preparation and approach are the player's. Quest events drive the unlock graph. **Per-tier
side-quest lists are lean** (§1.9) and **never gate the spine.**

**(c) Rough DATA shape.**
- `Dialogue/TextLine { id, speaker, text, displayConditions (predicate), rewards: RewardBundle,
  locksLineIds[] }`
- `Quest { id, type ('PEST_CONTROL'|'HUNT'|'CLEAR'|'DEFEND'|…parked…), suggestionText, openEnded: true,
  advanceEvents[], rewards: RewardBundle, gatesSpine: false (for side-quests) }`
- `QuestTask { advancedBy (gameEvent), optionalDiscoveryNodes[] }` — discovery, not waypoints.

**(d) Ties to the four pillars.** All four, indirectly: quests are *how the player performs the deeds*
that the authorities recognize. **DEFEND** is the canonical combat **Arms** standing-earner; labour/
office quests feed **Estate & Wealth** / **Standing & Office**; recognition/petition quests feed **Name
& Honour**. The reward bus can carry `pillarDeltas` for recognized completions (achievement jumps,
per-event capped).

**(e) When introduced / fractal reveal.** **T0** — dialogue from the open (the guide/steward beats);
the **quest log** reveals around **R5** (with the pest-control/hunt/clear/defend types and the first
combat-earned standing). Quest scope grows per tier (valley-scale at T1, region-scale at T2 with the
personal-mystery payoff). Parked quest types reintroduce at T2+.

---

## 2.13 Lore, inn rumours & the belief→cause engine

**(a) What it is.** The **light-flavour folklore delivery system.** Folklore is **NOT the spine**; it
arrives as **optional tidbits via the village inn's rumours board** (Innkeeper Sukezō), each a
lightweight yokai story the player **may** investigate. **Canon hard rules:** every rumour-quest is
**optional** and **NONE gate tier progression**; each unlocks **organically** (conditions per tier; more
unlock as the estate & village grow — never an all-at-once dump); each resolves **one-to-one to a
concrete human/natural cause** with **dawning dread, never a Scooby-Doo unmasking** (the game lingers in
the unease before resolving). **Residual ambiguity is hard-capped at ≤ 1** unresolved, off-screen,
mundane-readable beat (the unidentified-hand offering at the **Asagiri boundary-stone**). Folk-religion
texture distinguishes **Shintō** (shrine, *shimenawa*, soul-calling rite) from **Buddhist** elements
(roadside *jizō*, Bon offerings, the temple register of the vanished — which becomes hard evidence). **No
rite ever mechanically "works"; nothing is confirmed supernatural; there is never player magic.**

**(b) Player-facing behaviour / loop.** Read the rumours board → optionally pick up a belief-beast
INVESTIGATE-then-confront one-shot (e.g. the "kappa" of the ford = undertow + a snapping turtle/large
catfish, tied to smugglers' sinking-spot; the "fox-fire" ridge = a hidden charcoal kiln; the "one-eyed
mountain god" = Hanzaki + fog-blind terrain). Investigate through ordinary work/travel; the unease
lingers, then resolves to a grounded cause. Also surfaces lore scrolls/registers (temple register, the
household Journal) read at the cost of in-game time. A **belief→cause table** is authored region-wide
before any node with new omens (so the ≤ 1 cap provably holds).

**(c) Rough DATA shape.**
- `Rumour { id, boardText, unlockPredicate (per-tier, organic), linkedBeliefBeastId?, optional: true,
  gatesSpine: false }`
- `BeliefBeast` (shared with 2.9's separate registry) `{ resolvesToCause, dread-beats[], oneShot }`.
- `BeliefCauseTableEntry { belief, groundedCause, isResidualAmbiguity: false }` — exactly **one** entry
  game-wide has `isResidualAmbiguity: true` (the boundary-stone), enforced by the content verifier.
- `LoreScroll { id, readCostTicks, unlocks: RewardBundle }`.

**(d) Ties to the four pillars.** **Name & Honour** lightly (a sponsored rite, a respected investigation
can colour the house's name), but folklore **never gates the spine and is never a primary pillar
source.** Most rumour payoff is *feeling, allies, and flavour*, not power.

**(e) When introduced / fractal reveal.** **T1** — the inn & rumours board reveal in the village; the
opener is the "kappa" of the ford. Rumours unlock **organically and per-tier** (more as the estate/
village grow). The residual-ambiguity boundary-stone beat is a T1 village node that **lingers
unresolved** by design.

---

## 2.14 World simulation (seasons / weather / festivals)

**(a) What it is.** The living-world layer on top of the clock (2.2): **seasons** (kanji tags driving
the rice cycle, foraging windows, and the seasonal judged results), **weather hazards** (cold/wet
affecting labour/combat), **lunar phases**, **festivals** (Bon, seasonal rites — social/economic hubs,
e.g. Brewer Tokuemon's festival hub), **vendor restocks**, and **food rotting/fermenting**. **Active-
only**, scheduler-driven, deterministic.

**(b) Player-facing behaviour / loop.** The world changes around the grind: plant/harvest by season;
weather nudges what's worth doing; festivals offer time-boxed social/economic beats; the **seasonal
appraisal** (harvest result, autumn audit, security appraisal) fires the **judged-result Influence**
when a new high-water mark is reached. Reinforces "the world enlarges as numbers go up."

**(c) Rough DATA shape.**
- `SeasonRules { perSeason: { activeNodes[], yieldModifiers, weatherWeights } }`
- `Festival { id, season/day, effects (vendorRestock | socialBeat | reputationOpportunity),
  revealPredicate }`
- `WeatherHazard { kind, rateModifiers (labour/combat) }` (soft, never hard-blocking — pairs with 2.3).
- Reuses `WorldClock` + `Scheduler` + `SeasonalAppraisalState` from 2.2.

**(d) Ties to the four pillars.** The **timing/source of the seasonal JUDGED RESULTS for all four
pillars** (harvest → Estate & Wealth; security appraisal → Arms; an inspector's seasonal report → Name &
Honour; an office's seasonal account → Standing & Office). Always **new-high-water-mark only**, never a
repeatable per-season maintenance trickle.

**(e) When introduced / fractal reveal.** **T0** clock first; **T1** brings seasons/weather/festivals to
life (and the village social calendar). Festivals/weather deepen per tier (regional Bon at T2, etc.).

---

## 2.15 Factions & reputation (estate ladder, village web, origin ties, allegiance)

**(a) What it is.** Three starter factions, **deliberately distinct in SHAPE** so they never read as
one bar painted three colours, plus the **Tama-vs-farmhand allegiance**. **More factions/zones bloom per
tier** (the §1.7.1 / world-expansion cut-set; **v1 ships only the three starters + the six cross-cutting
SEEDS** embedded in the starter region — porter's-knot, Ranpo/Obaa Sato, the artisans, the rice-broker,
Ryōa's shrine+register, Magobei/Yagōemon's skim).

- **ESTATE (main) — a fresh rank LADDER per tier.** The only faction structured as a discrete, gated
  ladder (rising through it *is* the perseverance fantasy and the dominant UI-reveal driver). **~8 rungs
  per tier** (T0 R0→R7, T1 V0→V7, T2 enumerated). **Rungs interleave LABOUR and COMBAT**; **combat is
  first-class from T0** and **earns standing.** Driven by **two earned standing meters (progress meters,
  NOT economy currencies): Estate Service** (gates labour promotions) and **Combat Standing** (gates
  martial ones); **labour conditioning is a one-way enablement gate** on combat rungs (ZERO combat stat/
  training-rate bonus). The capstone rung (chief steward / *yōnin* — the personal ceiling) **confirms**,
  does not first-open, the higher macro tiers (pillars gated those in parallel). The estate cast &
  buildings **grow per tier** as **flavour / light systems** (build/recruit — **NOT** a people-management
  sim; no labour-gang, no managed sub-economy, no assignment panel).
- **VILLAGE of Asagiri (side) — a static reputation WEB.** Continuous, **multi-node** meters (not a
  ladder): per-shop "patron/regular" standing (smith Gonta, dry-goods/rice broker, herbalist Obaa Sato,
  brewer Tokuemon, **weaver Onatsu — lead of the silk *meibutsu***), per-family goodwill (raised by
  **open-ended help**), an artisans'/craft-guild standing, and the **Village Chief's regard** (headman
  Yagōemon — a weighted roll-up). **Gentle curves** (linear/soft-cap) for frequent small dopamine.
  **Cast mostly STATIC.** **Village standing NEVER gates the UI ladder or the tier climb** (ignoring it
  leaves you poorer and lonelier — a viable-but-poorer playstyle, never a wall).
- **ORIGIN (side, memory-gated SUPPORT track) — discrete MILESTONES.** Tahei's **living** family/friends
  in **Sawatari-juku** (mother Oyuki, **father Jinpachi**, sister Okimi, employer Denbei, friend Kanta,
  sweetheart Osen, the porter guild). **Opens at T2** (the dream foreshadows from early game). Per-
  contact **"restored ties"** one-time milestones. Payoff = **support, not local power**: pride/morale (a
  modest global skill-XP buff framed as a *present-day relationship*, never a retroactive gift), allies
  (recruited porter mates), trade ties (origin-town goods/routes plugging into expansion). **Hard
  guardrail: returning memory grants ACCESS only, ZERO mechanical bonus**; at least one origin beat is
  always available **without** reputation-gating (the thread never stalls).
- **The Tama-vs-farmhand allegiance** — a **continuous, re-swingable leaning** (village-leaning ↔
  estate-leaning, default neutral, never frozen). **Rebalances rates & flavour, NEVER availability** —
  both factions fully completable on either lean; neutral is a valid in-character stance. **Faction
  tension is light / flavour — no mechanical penalty.**

**(b) Player-facing behaviour / loop.** Climb the estate ladder (the spine); raise village per-node
meters by trade and open-ended help; restore origin ties as memory + travel-standing allow; nudge the
allegiance through dialogue and where you invest labour. **Separate earned standing meters** keep the
three from collapsing into one bar. Above them sits **House Influence** (2.16); village allies and
origin trade-ties act as **multipliers/feeders** (tuned so weaving both in roughly **halves** time-to-
next-tier — *felt, never a wall; never a new pillar*).

**(c) Rough DATA shape.**
- `EstateLadder { tier, rungs: RankDef[] }`; `RankDef { id, track ('labour'|'combat'|'mixed'|
  'admin-as-narration'), earnedBy (EstateService|CombatStanding thresholds + trustBeats),
  unlocks: RewardBundle }`. Two meters: `EstateService` (steep geometric), `CombatStanding`.
- `VillageWeb { nodes: { shopId|familyId|guildId → meter (gentle curve) }, chiefRegard (rollup) }`.
- `OriginTies { perContactMilestone: boolean, prideBuff (global skill-XP, access-framed),
  allies[], tradeTies[] }` — every asset still grind-built.
- `Allegiance { value (-1 village … +1 estate, default 0), affects: rates+flavour only }`.
- `FactionMultiplier { source (village|origin), influenceSpeedup, budgetShare (apportioned so the
  combined ≈ ½ time, never exceeded) }`.

**(d) Ties to the four pillars.** The **estate ladder generates Influence directly** (labour → Estate &
Wealth; combat → Arms; offices → Standing & Office; recognition → Name & Honour). **Village & origin are
multipliers/feeders into the pillars, never new pillars.** The allegiance shifts *gain rates and
flavour*, never which pillars are reachable.

**(e) When introduced / fractal reveal.** **T0** — the estate ladder (R0→R7) and its two standing
meters. **T1** — the village web (one contact/one shop first, then meters fan out) + the silk sub-engine.
**T2** — the origin support track opens (memory + travel-standing gated) and a fresh region ladder mints.
Each new faction/zone arrives **minimal** (one contact, one place, one verb) and unlocks fractally.

---

## 2.16 House Influence — the four pillars (accrual & per-tier gating)

**(a) What it is.** The **macro-resource** — the house's **recognized standing** in the eyes of
progressively wider authorities, and **the one thing the entire UI-reveal is ultimately gated on.** It
is **NOT** koku and **NOT** coin (those are inputs you spend/grind; Influence is the cumulative score of
what the house has *become*). It is the **umbrella roll-up of FOUR achievement-driven pillars** grown in
lockstep, each mapping to a distinct protagonist domain:

| Pillar | Kanji | Protagonist domain | Grows on |
|--------|-------|--------------------|----------|
| **Arms** | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognized martial deeds + seasonal security judged results (new high-water mark) |
| **Estate & Wealth** | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation) / **TREASURY** (debt→solvency→creditworthiness, *goyōkin*) / **TRADE** (routes, broker standing, the silk *meibutsu*) — **TRADE hard-capped to ≤ ⅓ of this pillar** |
| **Standing & Office** | *(plain-English label; exact kanji deferred to the §5 authenticity pass)* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed (incl. the **marriage / adoption lever**, 2.16.1 — T3+ parked), rivals eclipsed |
| **Name & Honour** | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition, off the foreclosure list, a sponsored rite, an inspector's report, a recorded merit-elevation |

**Accrual = two shapes only — never a passive time-trickle, never a flat per-action increment (canon):**
- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded
  yield, a granted title, a sealed contract, a road declared safe in the books, a won petition).
  **Per-event caps** so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (NOT repeatable maintenance awards).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable DENTS** (a lost
battle dents Arms; a scandal dents Name; a called debt dents Estate) — **small and NEVER a wipe** (no
permanent holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by
rebuild).

**Tier gating = PER-TIER REQUIRED PILLARS via SIMPLE THRESHOLDS (canon).** Each tier names the one or
two pillars that must clear a stated threshold to advance, and the **required pillars drift per tier**:
early tiers require **Arms + Estate** ("survive and get strong"); upper tiers require **Office + Name**
("win it socially"). **NO** global floor across all four; **NO** overflow-substitution arithmetic (the
floor+overflow formula is **REJECTED**). The only structural cap that survives is **trade ≤ ⅓ of Estate
& Wealth** (so trade can never carry a gate). **Plus a per-tier transition STORY GATE** (see table).

| Tier | Transition story gate (entry) | Required pillars (simple thresholds) |
|------|-------------------------------|--------------------------------------|
| **T0 Estate** | *(met at the open)* survive convalescence + first labour | **Arms + Estate** (humbling first fight survived; first *shinden* begun; kura solvent) |
| **T1 Village** | enough estate work + **basic repairs** → sent into the village | **Arms + Estate**, first **Office** (errand-authority; headman's regard; cash-crops online) |
| **T2 Region** | **"clean your room"** (estate healthy, village happy, fires out) → grow regional influence; rival houses appear | **Estate + Office** rising; **Arms** secures roads; the **personal-mystery payoff** lands here |
| **T3 Castle-town** *(stub in v1)* | **win the region** → rulers confer leadership + invite the house in | **Office + Name** dominant (won socially); Arms/Estate as leverage |
| **T4 Edo** *(roadmap)* | a **"taste of Edo"** — forced to build & fund an Edo estate → grow influence | **Name + Office** (the national *banzuke* on all four pillars) |

**(b) Player-facing behaviour / loop.** Perform recognized deeds → watch the relevant pillar JUMP (capped)
or rise on the seasonal appraisal → cross a tier's required-pillar thresholds **and** trigger its story
gate → the next tier's canvas opens (no reset). The four-bar standing panel makes the pillars legible
once revealed. Side factions visibly speed the climb (multipliers) without changing what's reachable.

**(c) Rough DATA shape.**
- `Influence { arms, estateWealth (subEngines: { land, treasury, trade(≤⅓ cap enforced) }), office,
  name }` — kept separate from `resources` (2.4).
- `AccrualEvent { kind ('jump'|'judged'), pillar, sourceDeedId, amount (capped), highWaterMarkCheck }`.
- `Dent { pillar, amount (small), scriptedSourceId, recoverable: true }`.
- `TierGate { tier, requiredPillarThresholds: Partial<Record<pillar, threshold>>, storyGateFlag }` —
  **simple thresholds; no floor/overflow fields exist.**
- `TradeCap { tradeStrand ≤ ⅓ * estateWealthTotal }` (structural invariant, verifier-checked).
- *(All thresholds/caps/weights/formulae → §4.)*

**(d) Ties to the four pillars.** This **IS** the four-pillar system — the macro roll-up everything else
feeds. Every other system's deeds funnel here through the accrual shapes (A)/(B).

**(e) When introduced / fractal reveal.** Pillars accrue from early deeds, but the **four-bar House
Influence panel becomes visible/tracked at T0-R7** (the capstone bridge to T1), so the player first
*does* deeds, then *sees* the standing they built. Per-tier required-pillar thresholds + story gates pace
the whole climb (T0→T4); v1 reaches the **T2** gate (T3 stub, T4 roadmap).

### 2.16.1 Marriage / adoption-into-higher-status (T3+ parked alliance/status lever)

**(a) What it is.** A canon-locked **late-game (T3/T4) alliance/status lever** (canon §G): a **marriage**
or **adoption-into-higher-status** match that lifts **Standing & Office** + **Name & Honour** and serves
as one of the **castle-town takeover routes** (canon §B's "office / economy / **marriage** / out-maneuvering
rivals"). It is a **real, lean** strategic move — **explicitly NOT a relationship / people-management sim**
(no courtship minigame, no spouse/heir-management screen, no dating mechanics): it is a brokered alliance
that, once secured, emits a one-time **Name & Honour + Standing & Office** jump and unlocks takeover
leverage. Brokered diegetically via the go-between (e.g. T3's Omiya-no-Sahei, §5.T3.5).

**(b) Player-facing behaviour / loop.** *(T3+ only — not in v1.)* At castle-town scale, a brokered match
becomes available as a discrete alliance deed: meet its standing prerequisites → secure it through the
go-between → it lands as a capped achievement jump into the two upper pillars and opens a takeover route
against the rivals (an alternative to pure office/economy/martial paths).

**(c) Rough DATA shape (one line).**
- `AllianceLever { id, kind ('marriage'|'adoption'), prerequisitePillars (Standing/Name thresholds),
  pillarJump ({ office, name } capped), takeoverRouteUnlocked, brokeredByNpcId }` — **T3+ parked (not in v1).**

**(d) Ties to the four pillars.** **Standing & Office** + **Name & Honour** (a one-time, capped achievement
jump into both); never Arms/Estate, never a recurring trickle.

**(e) When introduced / fractal reveal.** **T3+ parked (not in v1)** — the lever matures in the T3
castle-town arc (§5.T3.2/§5.T3.5) and pays an optional callback at T4; v1 (T0–T2) does **not** surface it.

---

## 2.17 Estate growth (build / recruit = FLAVOUR, not a sim)

**(a) What it is.** The estate as a **persistent, visibly-mutating place** that grows per tier — an
economic fabric (kura → granary → workshops → …) and a martial fabric (rusty door-bar → cleared drill
yard → low palisade → men-at-arms rota → …). **Canon: building structures and recruiting a small named
retinue are FLAVOUR / LIGHT systems wired to the reveal bus — NOT a people-management sim** (no
labour-gang to assign, no managed sub-economy, no assignment/management panel; **martial scale
hard-capped** — a small named retinue + temporary corvée/levies for crises, **never a standing army**).
**v1 covers stages E0–E2** (E0 Foreclosure's Edge → E1 Stabilising → E2 Recovering); **E3–E5 parked.**

**(b) Player-facing behaviour / loop.** Spend koku / coin / materials / labour (sometimes a martial
prerequisite like "roads cleared") to raise the next structure — every build a **diegetic beat** ("the
frame is raised"), never silent menu inflation. Recruit/secondment adds **light roster cards** (role +
one-line hook + a data-driven contribution slotting into existing idle-producer/garrison systems). The
estate's physical growth runs **ahead** of top personal rank (buildings gate on the relevant **pillars**
— primarily **Estate & Wealth**, plus **Arms** for defensive works — **plus a LOW rank floor + cost, not
the capstone**). The minute-to-minute texture stays **labour + combat grind**, not estate
micromanagement (guards against city-builder/4X drift).

**(c) Rough DATA shape.**
- `EstateStage { id (E0…E2 in v1), econFabric[], martialFabric[], rosterCards[], pillarFloor, rankFloor
  (LOW) }`
- `BuildableStructure { id, costs (koku/coin/materials/labour), martialPrereq?, pillarFloor, rankFloor,
  revealBeatId, contributesTo (idleProducerSlot|garrisonStrength|stationTier) }`
- `RosterMember { id, role, hookLine, contributionSlot, firstAppearsTier }` — **light card by default**;
  only a few get full arcs (existing cast reused: village artisans seconded, origin friends recruited).
- **No** `assignmentPanel` / `labourGang` types (their absence is the canon guard).

**(d) Ties to the four pillars.** **Estate & Wealth** (economic fabric → recorded yields) and **Arms**
(martial fabric → defensive works / men-at-arms readiness, feeding security appraisals). Buildings are
*enablers/displays* of standing; the pillar value comes from the recognized output, not the structure.

**(e) When introduced / fractal reveal.** **T0** — E0 at the open (leaning gate, cracked *kura*, fallow
paddies, rusty door-bar); E1 (kura patched, first *shinden*, drill yard cleared, gate night-watch) and
E2 (granary, two workshops, low palisade, 2–3 men-at-arms on a rota) build across T0→T1. Each structure
reveals fractally (a drill yard = one post → a rack → sparring slots). E3–E5 parked for post-v1.

---

## 2.18 The national *banzuke* / per-tier ranking

**(a) What it is.** The endgame's legible win-display and a per-tier motif: a **ranking of the HOUSE**
(not the man) on all four pillars. **Per-tier rank ladders also rank the house at each tier** (a domain
*banzuke* precedes the national one). The **T4 Edo climax** is a **national multi-pillar *banzuke***.
**LOCKED presentation:** a **popular *mitate* / parody broadsheet** (woodblock, not an official register)
using **sumo-rank vocabulary** — **Maegashira / Komusubi** for the house's attainable band; **Ōzeki /
Yokozuna** for the **structurally sealed top** (the wall the truly powerful built, made the chart's
literal geometry). Honours the **indirect/mediated ceiling**: the house ranks; the MC's personal ceiling
stays **chief steward / *yōnin*** (no *hatamoto* / shogunal audience).

**(b) Player-facing behaviour / loop.** As pillars rise, the house climbs the chart from unranked toward
the attainable band; the top slots remain visibly out of reach (the honest ceiling). A domain *banzuke*
gives each tier a "where do we stand" read; the national chart is the T4 payoff. **One authored ending**
(house restored & ranked) + **post-game free-play (no reset)**; the long-tail is defending the top
attainable spot on the biennial *sankin-kōtai* heartbeat (recoverable, **never a decay-tax**), optional
grounded super-bosses, and per-pillar mastery goals.

**(c) Rough DATA shape.**
- `BanzukeChart { tier ('domain'|'national'), entries: { houseId, computedRankFromPillars }[],
  sealedTopRanks (Ōzeki|Yokozuna, unreachable), attainableBand (Maegashira…Komusubi) }`
- `HouseRank` is **derived from the four pillar values** (read-only display; never a stored stat).
- `PostGameGoal { id, kind ('defend-spot'|'super-boss'|'pillar-mastery'), recoverable: true }`.

**(d) Ties to the four pillars.** It **reads all four pillars** and renders them as a single legible
rank — the most visible expression of House Influence. Defending the spot is a recoverable Arms/Estate/
Office/Name appraisal, never a wipe.

**(e) When introduced / fractal reveal.** **Per-tier domain ranking** surfaces with the Influence panel
(T0-R7 onward, deepening each tier). The **national *banzuke* is the T4 (roadmap) payoff** (v1 stops at
T2 with T3 stubbed). It arrives as a single broadsheet artifact first (the chart that omits you), then
the house climbs it.

---

## 2.19 Save / load (IndexedDB + export/import)

**(a) What it is.** Persistence. **Canon: IndexedDB** (robust, durable, static-friendly — no backend) +
**base64 export/import to file**; **single autosave**; **versioned MINIMAL-STATE** (recompute derived on
load); **seeded RNG persisted.** (The mechanics brainstorm's localStorage note is superseded by canon's
IndexedDB choice.)

**(b) Player-facing behaviour / loop.** The game autosaves transparently; the player can export a save to
a text file and import it back (portability / backup). On load, derived stats are recomputed (so a bug in
derivation never corrupts the save). Versioned migrations run in order; on a bad/old save the game
**degrades gracefully** (clear, explained recovery — never a scary "save is dead" wall).

**(c) Rough DATA shape.**
- **Persist ONLY non-derivable state:** `{ schemaVersion, rngSeed + counter/stream, worldClock,
  total_xp per skill, character level/xp, unlock/finished/story flags, inventory counts (with quality
  keys), equip state + durability, kill/clear/deed counts, current location, reputation/meters
  (EstateService, CombatStanding, VillageWeb, OriginTies, Allegiance), Influence pillar values + dents +
  high-water marks, quest/task status, active-effect remainders, estate stage + built structures +
  roster, market saturation state }`.
- **Recompute on load:** attributes, derived combat stats, production rates, what's unlocked, banzuke
  rank.
- `MigrationStep { fromVersion, toVersion, transform }` (ordered).

**(d) Ties to the four pillars.** Persists the `Influence` pillar values, dents, and high-water marks so
the up-only macro-progress is durable (and the never-a-wipe rule survives reloads).

**(e) When introduced / fractal reveal.** **T0 (M2)** — minimal save first, hardened across milestones as
new state (quests, combat, factions, estate) is added.

---

## 2.20 The DEV play API + content verifier

**(a) What it is.** Two QA systems. **The DEV-only play API** (`window.__qa`, stripped from production
via the build's DEV flag): read state, drive the game's verbs (the same typed intents the UI dispatches),
loop control (`tick`/`step`/`frames(n,ms)`, `pause`/`resume`), `new`/`load`/`save`, and **force-state
helpers** (jump to a late unlock / rare outcome / terminal screen). **Canon: expose a DEV-only play API
on `window` so the game can be driven and observed headlessly** (used by the `capture-game-states` skill).
**The content verifier** (`Verify_Game_Objects` equivalent) cross-checks all ids/refs across registries at
test time, and **balance/content docs in `docs/` are GENERATED** from the same data the game runs
(`npm run gen:docs`) — single source of truth.

**(b) Player-facing behaviour / loop.** None (developer-facing). Powers **headless regression tests**:
force EstateService / CombatStanding / Influence / a story flag, fast-forward, and assert **each reveal
fires at the intended `GameState`**, that **pacing milestones hit on schedule**, that the **belief→cause
table holds the ≤ 1 ambiguity cap**, that **no rung/build/memory grants a hidden stat** (no-hidden-edge),
that **trade ≤ ⅓** holds, and that **no system ever wipes Influence/holdings**.

**(c) Rough DATA shape.**
- `QaApi { state(), drive(intent), tick/step/frames, pause/resume, new/load/save, force(partialState) }`.
- `VerifyReport { danglingRefs[], unreachableReveals[], capViolations[], hiddenEdgeViolations[],
  ambiguityCount }`.
- `gen:docs` reads `core/content` registries → writes balance/content tables into `docs/`.

**(d) Ties to the four pillars.** Indirect: it **regression-tests the pillar accrual rules** (caps,
high-water-mark gating, dents-not-wipes, trade ≤ ⅓) so the four-pillar invariants can't silently break.

**(e) When introduced / fractal reveal.** **T0 (M1 skeleton)**, grows every milestone. Developer
infrastructure, present from early build.

---

## 2.21 Accessibility, audio & presentation register

**(a) What it is.** Cross-cutting presentation. **Art register (canon): TEXT + EMOJI + CSS** (woodblock
palette; kanji season tags; colour-coded rarities; CSS flourishes; a small canvas only for optional
ambient FX, never logic). **Accessibility (canon):** solid basics — scalable text, colourblind-safe cues,
keyboard + touch, pause; **responsive desktop + mobile, NOT hover-dependent** (Shift-for-detail is an
*extra* layer, not the only way to read info). **Audio (canon):** light ambient beds + UI/event SFX +
mute toggle.

**(b) Player-facing behaviour / loop.** A legible, text-first interface that scales and reflows for
mobile; colour cues backed by text/shape (never colour-only); full keyboard and touch operation; a pause;
ambient seasonal audio with a mute toggle. One carefully-tuned **difficulty** (no modes).

**(c) Rough DATA shape.**
- `RarityStyle { tier → colorClass + label }` (colour + text, colourblind-safe).
- `A11ySettings { textScale, colorblindMode, reduceMotion, paused }` (persisted).
- `AudioSettings { ambientVolume, sfxVolume, muted }`.
- Tooltips: a base info layer always reachable without hover (tap/focus), Shift = extra detail.

**(d) Ties to the four pillars.** None directly (presentation infrastructure). It renders the pillar/
standing panels legibly (rarity-coded, scalable) so the four-pillar progress is readable on any device.

**(e) When introduced / fractal reveal.** **T0** — the text/emoji/CSS register and a11y/audio basics
exist from the first build; rarity colour-coding and season tags appear as the relevant systems (loot,
clock) reveal.

---

## 2.22 §2 — items flagged for the human (review checklist)

These are the load-bearing or genuinely-open calls in §2 that should be confirmed before §3:

1. **Pillar accrual & dent shape (2.16).** Confirm the **two-shape accrual** (achievement jumps +
   seasonal judged results, new-high-water-mark only, per-event capped) and the **per-pillar recoverable
   dents (never a wipe)** are correctly captured as *systems*, and that **simple per-tier required-pillar
   thresholds** (no floor/overflow) is the gate model to build against. *(Balance numbers themselves are
   §4.)*
2. **Trade ≤ ⅓ as a hard structural invariant (2.4 / 2.11 / 2.16).** Confirm enforcing it as a
   verifier-checked invariant (not just a tuning target) is desired.
3. **Auto-producers strictly T3+ (2.5).** Confirm v1's E0–E2 estate is **fully active grind** with **no**
   idle producers and **no** assignment/management panel surfaced in v1 (the people-management-sim guard).
4. **Estate build/recruit as light flavour (2.17).** Confirm building & recruiting ship as **diegetic
   reveal beats + light roster cards**, explicitly **not** a buildable management minigame — and that the
   **martial-scale hard-cap** (small named retinue, never an army) is the v1 ceiling.
5. **Belief→cause registry + ≤ 1 ambiguity (2.9 / 2.13).** Confirm keeping **belief-beasts in a separate
   registry** from grindable mobs (so canon's "no belief-creatures in spawn tables" is enforced at the
   type level) and that the **single residual-ambiguity token stays at the Asagiri boundary-stone**.
6. **Skill/quest-type lean-set for v1 (2.7 / 2.12).** Confirm the **lean core skills** (farming, foraging,
   woodcutting, fishing, smithing, cooking; conditioning; 2–3 weapon lines) and **~4 quest types** (PEST
   CONTROL, HUNT, CLEAR, DEFEND) are the v1 surface, with the rest parked.
7. **Standing & Office kanji (2.16).** Still deferred to the **§5 authenticity pass** (plain-English label
   only here) — noted, not an open §2 design question.

---

_§2 drafted from locked canon + LOCKED §1 + the three redesign brainstorms. Balance numbers are
deliberately deferred to §4. Next: §3 — the incremental unlock ladder (UI-as-progression)._

---

# §3 — Incremental Unlock Ladder (UI-as-progression)

_Not yet authored — Wave 2._

---

# §4 — Combat, Progression & Balance Model

_Not yet authored — Wave 2 (the parked balance numbers land here)._

---

# §5 — Act-by-Act Narrative & Content

# T0 — Estate (tutorial; v1 full)

## T0.1 Overview

**Theme:** *earn your keep and a place at the table.* One declining hill estate — the Kurosawa *goshi* house in
Asagiri valley — unlocked room by room. A half-drowned, nameless young man (~18–20), pulled from the weir out of
plain kindness, becomes "another mouth," then a reliable hand, then a hand who can fight. The tier is the
mediocre-start contract made playable: he is weak and slow, the first hoe blisters him, and the **first real
fight is humbling and near-fatal.**

**Transition gate (T0→T1):** *do enough estate work + complete **basic repairs*** → the estate trusts him to
carry its business down into the village. **Required pillars:** Arms + Estate (humbling first fight survived;
first *shinden* begun; the kura solvent enough that the immediate fires are out). **Estate stage span:** E0
Foreclosure's Edge → E1 Stabilising (cross-ref §1.5.1).

**Felt arc:** cold-open helplessness (one verb, a near-bare screen) → the dignity of honest labour → the shock
of the first fight → the relief of being *named* on the household books. Combat is **live this tier** (the drill
yard, Combat panel, Bestiary, the first fight all surface inside T0) but daily texture stays peaceful-labour
dominant.

## T0.2 Main-quest beats (toward the T0→T1 gate)

1. **The Weir (cold open).** Wake feverish on a pallet in the **kura** storehouse, head bandaged. One verb, a
   persistent event log, a body/rest bar and a rice counter. Physician **Ranpo** names the injury plainly —
   "head's been knocked, lad; you near drowned" — grounding the amnesia as ordinary trauma, **no visions.**
   *(He keeps language and labourer's body-habits; he has lost his autobiographical past.)* **[THREAD: Origin]**
   first dream-fragment seeded here: a half-drowning, a voice in the water calling a name he can't hold (a real
   person recalled, never a spirit — ZERO bonus).
2. **The spilled rice.** Chief Steward **Genemon** — dry, overworked — sets the first task: rake and recover
   spilled rice from the cracked kura floor. "Another mouth, soft and clumsy." Completing it earns a
   sleeping-place and the first real labour loop (paddies, dry fields, the *koku* heartbeat).
3. **A season of honest work.** Sustained, reliable labour (farming → foraging → woodcutting → hauling) across
   a season earns a place on the household's books (bonded hand). The **porter's-knot beat** surfaces while
   hauling — he ties a load-knot on instinct; a groom grunts "huh, you've hauled before." **[THREAD: Origin]**
   identity clue, **ZERO bonus.**
4. **The wolf at the grain store (the humbling first fight).** A wolf gets into the grain store; cornered, he
   grabs a carrying-pole, lands at most **one lucky blow**, is thrashed — disarmed, ribs cracked, left in the
   dirt — surviving **only** by luck / by drillmaster **Jūbei's** arrival, **never by skill.** The shame of
   limping home to confess drives him to beg Jūbei for drills. *(Off-screen restraint on the injury; the
   *lesson* is on-screen, the gore is not.)*
5. **Begging for drills.** Jūbei's creed, stated here and paid off at the finale: *"Talent is a story the lucky
   tell. You are not lucky. So you will work."* This opens the drill yard, the Combat panel, the first crude
   weapon, Equipment/Inventory, and the Bestiary. Combat stats start near-zero.
6. **Earning the house's trust (indoor + the heir).** Win **Lady Chiyo's** regard for indoor work and heir
   **Naoyuki's** grudging vouching via authored trust beats (return a mislaid ledger; help hold the grain
   store). **[THREAD: Tama]** the estate flatly disbelieves he is "Tama" — to them he is simply a farmhand —
   establishing the allegiance tension from the estate side.
7. **The first standing watch (first combat-earned standing).** Stand a real gate-watch; clear the first
   pest/animal threats. This produces the **first combat-earned Arms standing** — "the gate held, and the books
   say so" — the load-bearing proof that combat earns recognition (canon §E).
8. **Basic repairs & the first *shinden* (the gate).** Drive the kura repair and begin the first *shinden*
   reclamation to a recorded result; the house edges off the foreclosure cliff. Genemon, grudging, entrusts him
   with **errands beyond the estate** — the village tier opens. The four-bar House Influence panel becomes
   visible at the capstone. **Gate met.**

> **Succession seed (early).** Lord **Munenori**'s weariness and Naoyuki's restless coasting are planted in T0
> dialogue so the generational arc (Munenori's decline → Naoyuki coming into his own) reads as earned when it
> pays off at T3/T4. **No** succession *beat* fires this tier — only the seed.

## T0.3 Antagonist arc — **The Inherited Debt** (the villain-less antagonist)

The T0 "antagonist" is **a circumstance, not a conspirator** (canon §F: estate decline is a simple
debt/misfortune, **NOT conspiracy-linked**). It is personified only by a tired pawnbroker, **Moneylender
Tōkichi**, who is owed money and is not cruel about it.

- **What it blocks:** the estate is dying of compound interest on grandfather **Sadamune's** failed
  flood-control venture, plus thin harvests and a cracked kura. He cannot leave for the village until the
  immediate fires are out.
- **Incremental reveal:** a leaning gate and a red ledger → clerk **Tanomo** drips *"we owe coin"* → *"the
  interest is the problem, not the principal"* → Dowager **Toku** parts with the root: Sadamune's **own
  failure**, **not anyone's crime.** The reveal lands as *family shame*, not mystery.
- **Resolution (purely economic, multi-route):** **Peaceful** — out-grind the interest and renegotiate.
  **Assertive** — refuse the worst terms and force a fair table by *proving solvency* (no fight). The debt is
  **restructured, not erased**; it becomes the **root-sin the house later atones for at Kuzuhara** (T2) —
  emotional payload, **no antagonist.**
- **[MOTIF: rigged box] — explicitly ABSENT.** Per canon, the racket has **no fingerprints on T0.** Sadamune's
  embankment is the house's own misfortune; no quota machine touches the estate's decline.

## T0.4 Estate roster & buildings growing (E0 → E1)

**Roster present at the open (E0, all first-appear T0; cross-ref §1.8):** Lord **Munenori**, heir
**Naoyuki**, Lady **Chiyo**, Dowager **Toku**, Chief Steward **Genemon**, clerk **Tanomo**, drillmaster
**Jūbei**, groom **Sota** & field-lad **Mago**, head maidservant **Oai**, cook **Kyūsuke**, physician
**Ranpo**.

**Joins this tier:** green recruit **Tokujirō** (~16) arrives at E1 (T0→T1 seam) — the mirror that will later
prove the MC's growth and seed the "you now teach others from zero" layer.

**Buildings (E0 → E1):**
- **E0 — Foreclosure's Edge:** leaning gate, sagging cracked kura, fallow paddies, a rusty door-bar as the only
  "defence."
- **E1 — Stabilising:** kura patched & re-roofed; first *shinden* plot reclaimed; drill yard cleared (one post);
  a night-watch lantern at the gate; a ledger no longer only red.

> **Build/recruit framing (binding):** every build is a diegetic beat ("the frame is raised"), every recruit a
> light roster card — **NOT a management minigame** (no labour-gang to assign, no managed sub-economy, no
> assignment panel). T0 reveals **rooms/areas separately** (LOCKED): stables, woodlot edge, and drill yard each
> reveal individually — never folded into the forecourt.

## T0.5 Key NPC & dialogue beats

- **Genemon** — the spine's primary gatekeeper. Voice: clipped, exhausted, fair under the gruffness. Beat: the
  shift from "another mouth" to writing the MC onto the books is the tier's quiet emotional spine.
- **Jūbei** — the mentor; the creed (above). Beat: refusing to coddle after the humbling fight; drilling the
  basics until they hold.
- **Naoyuki** — the in-house **rival** (talent-foil, *converted not innate*). Voice: bored brilliance, chafing
  at genteel poverty. Beat: grudging vouch in T0 that plants the rivalry → respect → brotherhood arc.
- **Dowager Toku** — backstory keeper. Beat: her first memory of the fall (Sadamune) — "no shortcuts; he
  thought he'd bought one."
- **Ranpo** — the rational, kami-disbelieving voice; grounds the amnesia.
- **[THREAD: Tama] estate-side:** the household's flat disbelief is the counterweight to the village's
  certainty (paid off at T1–T2). Establish that **nobody in the house calls him Tama.**

## T0.6 Areas & mob roster

**Areas (T0 estate + the shared near-wilderness ring; cross-ref §1.7):**
- **The Kura Storehouse** — convalescence pallet; spilled rice. Home of the UI-reveal engine.
- **The Gate & Forecourt (*genkan*)** — the stage for promotions and the Tama-vs-farmhand framing.
- **The Home Paddies & Dry Fields** — the *koku* heartbeat (active grind, not idle producers).
- **The Stables & Woodlot Edge** — reveal separately; the porter's-knot beat.
- **The Drill Yard** — reveals at the first-fight beat (combat live from T0).
- **The Main House / *Omoya*** — kitchen, inner rooms, household shrine, the lord's study (ledgers).
- **The Near Satoyama** (shared wilderness, conditioning-gated) — foraging groves, bamboo stand; the first ring
  of the danger gradient.

**Mob roster (grounded; ~part of the v1 ~5-mob set; conditioning-gated; cross-ref §1.13):**

| Mob | Type | Where | Role |
|---|---|---|---|
| **Wild boar (*inoshishi*)** | animal | home paddies / near satoyama | The first real grindable threat after the humbling fight; tramples crops. Drops boar-hide (armour craft) + meat. The "something's in the lower field" pest-control intro. |
| **Crop-raiding monkeys (*saru*) troop** | animal | field-edge / near satoyama | Fast, evasive pack nuisance; teaches multi-target combat & evasion. Low danger, high annoyance. |
| **Rice-rats & a *mamushi* (pit-viper)** | pest / wildlife | granary / paddies | Store pests + a venomous snake (status: poison). Cheap early grind; *mamushi* gall is a medicine/craft drop. |

> **No belief-creatures in spawn tables (binding).** The wolf of the humbling fight is an ordinary wolf. Any
> "yokai" arrives only via the inn rumours board (T1+) as INVESTIGATE-then-confront one-shots.

## T0.7 Open-ended side-quests (T0)

All optional; none gate the spine. Open-ended (a suggestion + a story found in the world), not waypoint chains.

- **The spilled-rice recovery** — the first task, doubling as the side-content tutorial.
- **The porter's-knot beat** — "you've hauled before." **[THREAD: Origin]**, ZERO bonus.
- **First dream fragment** — the half-drowning / the voice in the water. **[THREAD: Origin]**, guaranteed-cadence
  seed.
- **Dowager Toku's first memory of the fall** — Sadamune's venture (optional lore that humanises the debt).
- *(No inn-rumour folklore yet — the rumours board is a T1 unlock; T0 keeps the screen lean.)*

---

# T1 — Village (v1 full)

## T1.1 Overview

**Theme:** *the estate as a presence in its own valley.* Asagiri's shops, craftsmen, inn, shrine, and the
**kamikakushi legend** open up. A fresh **village rank ladder** is minted (V0→V7; cross-ref §1.5.1) — rank
resets to a village-facing service hierarchy, labour and combat still interleaving, now reaching past the estate
gate. The village is a **static reputation web** (it never gates the spine); the inn's **rumours board** begins
delivering optional light folklore.

**Transition gate (T1→T2):** *"clean your room"* — estate healthy, village happy, immediate fires out → Lord
**Munenori** first believes impact *beyond* the estate is possible → a quest to grow **regional influence**;
the region will introduce **rival samurai houses** with more sway to surpass. **Required pillars:** Arms +
Estate, first **Office** (errand-authority; the headman's regard; cash-crops online). **Estate stage span:**
E1 Stabilising → E2 Recovering.

**Felt arc:** the world enlarges from one estate to a whole valley of faces; the legend's warmth and ache pull
at the MC; the first cash-crop (silk) and the first valley-scale danger arrive; the lord's horizon lifts.

## T1.2 Main-quest beats (toward the T1→T2 gate)

1. **Errands into the valley (V0).** The estate trusts the MC to carry its business into Asagiri; first village
   errands open the market/shop row and per-shop reputation meters. **[THREAD: Tama]** the headman's daughter
   **Sayo** names him "Tama" on sight — the living heart of the legend.
2. **Becoming a recognised hand (V1).** Build standing with headman **Yagōemon** and the shops; combat keeps
   pace clearing valley pests/animals. The inn & rumours board unlock (folklore begins, optional).
3. **Making the road safe (V2, road-warden).** Secure a stretch of valley road or the ford against
   bandits/animals; survive a real clear. Combat-earned **Arms** standing at valley scale.
4. **The cash-crop comes online (V3).** Bring the village economy and the estate's cash-crops to a recorded
   seasonal result — the **silk / sericulture *meibutsu*** sub-engine begins under weaver **Onatsu** (LOCKED;
   trade hard-capped ≤⅓ of Estate & Wealth). Broker meters appear.
5. **Trusted of the headman (V4) — the skim surfaces.** Resolve a village-affecting threat: **Foreman
   Magobei's** rice-skim surfaces here (the T1 antagonist; see T1.3). Earn Yagōemon's regard. **First Office
   standing.**
6. **Sworn man-at-arms (V5).** Stand a real watch for the village; survive the first dangerous-road encounter;
   the first paid martial outsiders (**Gohei & Yatarō**) join as flavour retinue (E2). Defence of the valley.
7. **Right-hand-in-waiting (V6).** The lord first believes impact beyond the estate is possible; "clean your
   room" nearly done; the alliance/standing levers that point at the region appear.
8. **Agent of the house in the valley (V7) — the gate.** Estate healthy, village happy, immediate fires out —
   the capstone "clean your room" beat. The **region** map and the **T1→T2** quest open; rival samurai houses
   appear on the horizon. **Gate met.**

> **Allegiance, live this tier. [THREAD: Tama]** The continuous Tama-vs-farmhand leaning (canon §C, §1.5.4) is
> nudged through dialogue and where the MC invests labour. Leaning "I am Tama" warms the village (faster rep,
> grief-coded content, Bon rites) at slight friction with the estate; leaning "just a farmhand" smooths estate
> trust at the cost of village warmth and Tama-only lore. **Rebalances rates & flavour, never availability** —
> both factions stay fully completable on either lean; neutral is valid.

## T1.3 Antagonist arc — **Foreman Magobei**, the "tanuki of the rumours board"

The first small **human** antagonist (canon §F). He skims village rice with a doctored measuring-box
(***kyō-masu***), keeping stores short and stealing the surplus the T1→T2 gate needs.

- **What it blocks:** the gate needs the village happy; the skim keeps it poor.
- **Incremental reveal:** the rumours board's *"rice-thieving tanuki"* → one load measures short, then twice →
  the doctored *masu* (a box of rigged wood) → the thread runs **up** to Headman **Yagōemon**, whose ledgers
  cover Magobei. **Dawning unease, then a concrete object** — never a Scooby-Doo unmasking.
- **Resolution (multi-route, partial justice):** **Peaceful** — expose the skim; Yagōemon makes restitution and
  keeps his post in disgrace. **Assertive** — force Magobei off the books (his hired muscle is the **first small
  brawl**). **Partial:** Magobei answers; the better-connected Yagōemon mostly escapes with a quiet rebuke
  (foreshadows the partial-justice thesis).
- **[MOTIF: rigged box]** — **first appearance** of the optional through-line (the doctored *masu*). A curious
  player notes the rigging; an incurious one just beats a petty thief. **No tier requires touching it.**

## T1.4 Estate roster & buildings growing (E1 → E2)

**Joins this tier:** men-at-arms **Gohei & Yatarō** (ex-*ashigaru* hired off the road — the first paid
outsiders, the 2–3-man rota at E2); a carpenter-apprentice seconded via village **Carpenter Risuke**; a
charcoal artisan; maidservant expansion under Oai.

**Buildings (E1 → E2):**
- **E2 — Recovering:** a proper granary raised; two workshops (textile + charcoal/smith-adjacent); a repaired
  forecourt and a real (if low) palisade fence; 2–3 men-at-arms on a rota; a managed woodlot. The valley starts
  calling it "the Kurosawa works."

> **Village cast stays static (binding).** Estate growth pulls *seconded/recruited* faces (Risuke's apprentice,
> the men-at-arms); the village's own reputation-web cast does **not** balloon.

## T1.5 Key NPC & dialogue beats

**Village (static reputation web; cross-ref §1.8):**
- **Sayo** (headman's daughter, ~16) — the legend's heart; names him "Tama," tutorialises the village/trade
  loop. **[THREAD: Tama]** the person the truth will most hurt and most free (her own family's complicity in
  the old rice debt). Voice: sharp, kind, hopeful.
- **Headman Yagōemon** — warm civic quest-giver up front; **also** a reachable culprit (his ledgers cover
  Magobei). Never a monster — a frightened middle-man who chose his own neck.
- **Obaa Sato** (herbalist / wise-woman) — the village's **folklore-keeper**; narrates the *kamikakushi* legend
  sympathetically *while knowing it is coping.* Teaches foraging/village-craft.
- **Priest Ryōa** (shrine/temple keeper) — folklore-atmosphere quest-giver whose **register of the vanished**
  becomes hard evidence in the lost-child thread (double duty). **[THREAD: Tama]**
- **Smith Gonta** — gruff; tools then spearheads; values shown effort over flash (gates metalcraft).
- **Weaver Onatsu** (sharp widow) — **lead of the silk/sericulture *meibutsu***; runs the trade sub-engine that
  ties into Lady Chiyo's economy and (later) origin trade routes.
- **Brewer Tokuemon** — festival/social hub; a *minor* trade line (sake is **not** the *meibutsu*).
- **Innkeeper Sukezō** — runs the **rumours board**; the delivery vector for optional folklore; information
  broker.
- **Peddler Sokichi** — the **bridge** beyond the village (toward the origin town and region); grounded source
  of yokai tales; **helped the real Tama flee** (a lost-child clue). **[THREAD: Tama]**

**[THREAD: Origin] this tier:** the dream keeps a guaranteed cadence (sensory fragments: paddy-mud that isn't
Asagiri's; a familiar road; the name surfacing). Peddler Sokichi's road-tales begin pointing down-valley toward
an unnamed post-town. The thread stays **dark/foreshadowed** — the Origin faction does not *open* until T2.

## T1.6 Areas & mob roster

**Areas (T1 village + deeper shared wilderness; cross-ref §1.7):**
- **The Market / Shop Row** — Gonta's forge; Obaa Sato's herb stall; Tokuemon's brewery; Onatsu's silk.
- **The Chief's House** — Yagōemon's receiving room; the village ledgers (the doctored-ledger thread).
- **The Inn & Rumours Board** — Sukezō's inn; the optional-folklore hub.
- **The Shrine / Temple** — Ryōa's register of the vanished; the Bon offering site.
- **The Boundary-Stone / Jizō** — where he was found; the **ONE** capped residual-ambiguity beat (an offering
  left by an unidentified hand — lingers unresolved, off-screen, mundane-readable).
- **The River, Ford & Weir** (shared wilderness) — the "kappa" spot + the weir where he was found; fishing.
- **The Foothills & Charcoal Grounds** (shared wilderness, deeper conditioning) — the hidden charcoal kiln
  ("fox-fire"); hunting trails; the second danger ring.

**Mob roster (grounded; completes the v1 ~5-mob set; conditioning-gated):**

| Mob | Type | Where | Role |
|---|---|---|---|
| **Giant hornets (*suzumebachi*) nest** | insect | woodlot edge / satoyama | Swarm/AoE threat near foraging & charcoal work; a CLEAR-the-nest beat; tests conditioning (status: stings). |
| **Wolves (*ōkami*) pack** | animal | foothills & charcoal grounds | First fight that punishes a lone, under-geared player; drives the need for a detail or better gear. HUNT/escort threat. |
| **Bandits / starving deserters (*nobushi*)** | human | valley roads / bandit lean-to | First **human** threat; the road-security core. Mixed motives (organised toll-takers vs desperate deserters) make CLEAR/CAPTURE choices matter. Drop worn weapons (FOUND gear) + coin; clearing them earns recorded Influence. |

*(A rogue bear is available as an optional HUNT quarry; see §T1.7.)*

## T1.7 Open-ended side-quests (T1)

All optional; none gate the spine. **Inn-rumour folklore unlocks organically** (more rumours appear as the
estate & village grow — never an all-at-once dump). Each folk belief is introduced as genuine village dread,
investigated through ordinary work, and resolved one-to-one to a human/natural cause, **lingering in the unease**
before resolving.

- **The inn rumours-board opener — the "kappa" of the ford.** **[FOLKLORE → cause]** an undertow + an undercut
  bank (and, later, the smugglers' weighted-net sinking-spot). Resolves to grounded cause; the river stays
  uneasy.
- **Magobei's skim — the "tanuki."** **[FOLKLORE → cause]** = the skimming foreman (ties into T1.3).
- **A per-family goodwill help** — you hear a family has trouble and figure out how to help (open-ended, never a
  checklist).
- **Priest Ryōa's register entry** — log a vanished traveller; a quiet lost-child clue. **[THREAD: Tama]**
- **The boundary-stone offering** — the **one residual-ambiguity beat** (an offering by an unknown hand). It is
  *not* resolved; it is the single capped token (canon §1.13).
- **The rogue bear (HUNT).** A bear raids the charcoal-burners' grounds; track it by sign; return hide + gall.
  Optional, lore-light.
- **The "fox-fire" ridge (seed).** **[FOLKLORE → cause]** first *rumour* of ghost-lights on the ridge; the full
  INVESTIGATE-then-confront (a hidden charcoal kiln) resolves at **T2** when conditioning lets the MC range
  there.

> **Belief→cause table (T0–T1 region; binding before authoring any new omen).** Every belief resolves one-to-one
> to a grounded cause; **exactly one** token is left ambiguous (the boundary-stone offering).
>
> | Folk-belief | Grounded cause | Where / when |
> |---|---|---|
> | **Kamikakushi** (master lie) | A flood victim (Tahei); a child who *ran* (Tama/Otsuru); negligence dressed as fate (Kuzuhara) | spans T0→T2 |
> | Weir/ford **kappa** | Undertow + undercut bank; later a poacher's weighted nets / smugglers' sinking-spot | T1 ford |
> | **Tanuki** stealing rice | Magobei's skim | T1 village |
> | **Fox-fire** on the ridge | A charcoal-burner's hidden kiln | seeded T1, resolved T2 |
> | Yearly **soul-calling rite** | Grief-work that nonetheless yields hard evidence (Ryōa's register) | T1 shrine |
> | The unidentified-hand **boundary-stone offering** | *(left ambiguous — the ONE capped token)* | T1 |

---

# T2 — Region (v1 full; the personal-mystery payoff lands here)

## T2.1 Overview

**Theme:** *reach beyond the home valley.* A cluster of valleys, the post-town **Sawatari-juku**, the upstream
**Kuzuhara** ruins, the roads and *sekisho* checkpoints. A third fresh **rank ladder** is minted (region-scale,
~8 rungs; see T2.2). Two **rival samurai houses** contest the region. **This is where both personal threads
RESOLVE** (canon §F): the **lost-child truth (Otsuru)** and the **origin / family reunions (incl. father
Jinpachi)**. The **Origin faction opens** here (memory-gated; the dream has returned enough, and standing now
lets the MC travel the controlled *kaidō*).

**Transition gate (T2→T3):** *win the region* (the rival houses are no longer the leaders) → the castle-town
rulers **confer regional leadership** on the house and **invite** it in. **Required pillars:** Estate + Office
rising; Arms secures roads. **Estate stage span:** E2 Recovering → early E3 (regional reach; estate fabric runs
*ahead* of top personal rank, gated on pillars + a low rank floor, never the capstone).

**Felt arc:** the canvas becomes a region; the MC's *own past* finally opens (the warmest and most costly
payoff of the game); the house out-competes older/richer rivals; the spine's personal questions are answered —
**grounded and partial** — clearing the deck so T3/T4 carry the house's power rise alone.

## T2.2 Main-quest beats (toward the T2→T3 gate)

The region ladder shape (LOCKED at §1.5.1; exact rung copy detailed in §3): **valley-envoy → road-captain of
the cluster → broker of the post-town trade → arbiter between valleys → recognised regional retainer → captain
of the road-security detail → alliance-broker → leading house of the region.** Labour and combat interleave
throughout. The two personal threads land across this ladder.

1. **Out into the region (valley-envoy).** The estate sends the MC to broker its surplus beyond Asagiri. The
   **trade backbone** opens minimally: friend **Kanta** runs the estate's first consignment off the books as a
   favour (one route, one porter, one verb). **[THREAD: Origin]** first origin contact made.
2. **The road and the pass (road-captain).** Secure the cluster's roads; the first *sekisho* turn-back (obtain a
   pass) makes travel-standing felt. Rumours of the **"one-eyed mountain god"** of the pass surface (= **Hanzaki**
   + fog-blind terrain; see T2.3).
3. **The post-town opens (broker of the post-town trade). [THREAD: Origin] — the faction opens.** Once the
   dream-gate + travel-standing align, **Sawatari-juku** opens. The **toiya** transport office registers the
   estate's mon; the regional broker runway begins. The **origin reunions** start here (see T2.5).
4. **Arbiter between valleys.** Court/supply/arbitrate the two neighbouring valleys (**Hibara** + **Tōge-mura**,
   hard-capped at exactly two) — optional accelerants that flip contested meters by out-supplying, never force.
5. **Kuzuhara — the house's root-sin (recognised regional retainer).** With conditioning + standing, the MC
   reaches the **broken embankment (*seki*)** of the drowned, depopulated upstream hamlet — the house's own
   **root-sin** (Sadamune's neglected flood-works, atoned for here). A multi-stage **river-works** project
   secures the valley; resettlement re-founds the struggling hamlet as a T2 region project; **the drowned are
   named** (grief-work + a temple register, not a rite). *(Kuzuhara is a region node with **no personal tie to
   the MC's identity** — his origin/backstory and the lost-child evidence resolve through the **dream → the
   Sawatari-juku family** (beats 3 & 7), not here.)*
6. **The road-security captain (captain of the detail).** Break the brigand roost; secure the trade pass with a
   **hard-capped 2–3-man detail**. The **Hanzaki** encounters escalate (survived, not won; see T2.3). A
   famine-band under him can be **fed/resettled** (mercy, not a kill).
7. **The lost-child truth resolves (alliance-broker). [THREAD: Tama] — PAYOFF.** Tracking threads down-valley
   leads to the living, grown **Otsuru** (the real Tama). **The truth:** Tama was a **girl** (the legend's
   gender-drift is the fair clue) who **ran** from a violent stepfather and a near-sale into service to clear a
   debt; she has been alive in the post-town the whole decade, too ashamed to return. **The MC is not her.**
   Resolution is grounded and **partial** — she may not forgive; she is freed to *choose.* **[THREAD: Origin]**
   resolves in the same span: the reunions complete; Tahei claims his **true name.**
8. **Leading house of the region (the gate).** The rival houses are no longer the leaders. The castle-town
   rulers confer regional leadership and invite the house in. **Gate met.**

> **The dream rule (binding) at payoff.** Returning memory grants **access only** — new nodes/allies/quests
> unlock narratively, **ZERO mechanical bonus.** The reunion's "pride/morale" buff is framed as a *new
> present-day relationship* ("a man with people behind him works harder"), **never a retroactive gift from
> remembering.** At least one origin beat is always available without reputation-gating so the thread never
> stalls.

## T2.3 Antagonist arc — **Rival House Tomita** (spine) + **Rival House Akagi** (foil), with **Hanzaki** as the road's teeth

The T2 antagonist is the **two rival houses** (canon §F: exactly two), with the scarred *rōnin* **Hanzaki** as
the dangerous combat beat. The "win the region" gate is contested.

- **What they block:** **Tomita** underbids deals and courts the same valleys (contests on **money** + capital +
  connections + ruthlessness — **never innate gift**); **Akagi** blocks the upstart Kurosawa on **precedence**
  (contests on **honour**); **Hanzaki** makes the trade pass unsafe (muscle-for-hire, often Tomita's).
- **Incremental reveal:** **Tomita** first a *name* underbidding one deal → agent **Yasubei** (the legible
  day-to-day face) → heir **Kageyuki** → head **Sōzaemon**. **Akagi** first a *snub* → a precedence dispute →
  head **Gennai**. **Hanzaki:** a rumour ("one-eyed mountain god") → a survived-not-won encounter → a recurring
  duel nemesis (**trained, never gifted** — survived by labour-built endurance).
- **Resolution (multi-route):** **Peaceful/commercial** — out-supply and out-arbitrate the valleys; settle
  **Akagi** by *restoring its honour* (give the proud old line its precedence back); out-leverage Tomita's
  brokers. **Assertive** — secure the pass with the 2–3-man detail; break the brigand roost. **Tomita is never
  killed** (détente, forced alliance, or clean commercial defeat). The two rivals can be **played against each
  other** (money vs honour).
- **Talent-foil rule (binding):** every Tomita/Hanzaki advantage is shown as **bought, lucked, or trained** —
  never innate. Naoyuki's converted-not-innate growth mirrors the thesis (and from here he turns from internal
  rival into **ally against Tomita**).

## T2.4 Estate roster & buildings growing (E2 → early E3)

**Joins this tier:**
- **Saburozaemon** (stern senior retainer) and **Heisuke** (friendly peer retainer) join at retainer scale;
  **Kanbei** (jealous middling retainer — an in-household antagonist-rival, player-influenceable détente or
  self-inflicted washout, *not evil*).
- **Origin recruits (access-only, grind-built):** friend **Kanta** as the first porter contact / recruitable
  lead carrier; porter-guild mates as recruited carriers; sister **Okimi's** trading family as the concrete
  **trade-tie** multiplier.
- **Kuzuhara returnees** — one returning family / one origin recruit as the first resettlement producer (a
  *late-game* helper, consistent with auto-producers being late-only).

**Buildings (E2 → early E3):**
- A counting-house begun; guest quarters for visiting brokers; the silk/sericulture sub-economy deepening; the
  mon flying on village (and first regional) contracts; the first branch holding up-valley; **Kuzuhara** as a
  small standing producer-base + the secured embankment.
- *Martial:* a roofed dojo replacing the open yard begun; a small standing squad forming.

> **Estate physical growth runs *ahead* of top personal rank** (gated on the relevant pillars — Estate & Wealth,
> and Arms for defensive works — plus a **low** rank floor + cost, **not** the capstone). Stages E3–E5
> (fortified seat → restored-and-surpassed) are **parked** for the T3/T4 build (see "Parked — later").

## T2.5 Key NPC & dialogue beats

**Origin (opens at T2; Sawatari-juku & Kuzuhara; cross-ref §1.8). [THREAD: Origin] — payoff cast:**
- **Jinpachi** (father, ~50; senior porter/labourer at Denbei's house). **Re-added per canon** (renamed from
  the colliding "Kuranosuke"). The family grieved him as away/lost; the source of the porter's-knot lineage
  (**ZERO bonus**). **His reunion resolves at T2** alongside the rest of the family, with an **optional later
  emotional callback at T4** (the recovered family proud behind the MC). *(Authored as a clean reunion, not a
  third debt-bondage arc — the verifier flagged that the superseded father draft stacked a third
  "debt-machine-ate-a-person" story beside Tahei's caravan and Otsuru's near-sale; keep his return warm and
  un-stacked.)* **[FLAG-HUMAN]**
- **Oyuki** (mother, ~45) — the emotional core; grieved him; the reunion is the warm payoff, kept earned and a
  little costly.
- **Okimi** (elder sister, ~20; married into a trading family) — the concrete trade-tie that lets the origin
  town supply/route goods for the expansion.
- **Master Denbei** (old employer, ~55; transport-and-goods house) — porter/logistics know-how + legitimate
  manifests; the grounded source of the porter's-knot identity (**ZERO bonus**).
- **Kanta** (childhood best friend, ~18) — comic-warm friendship rekindled; first porter contact; recruitable.
- **Osen** (a sweetheart half-remembered, ~17) — optional, gentle, **narrative-only** relationship thread the
  dream surfaces (no dating-sim). *(Named **Osen** to stay clearly distinct from the lost-child **Otsuru**.)*
- **Otsuru** (the real Tama, alive & grown in the post-town) — mystery payoff & living proof; **costly &
  incomplete** reunion (she may not forgive). *(Distinct from the sweetheart **Osen** — the two post-town
  women no longer near-rhyme; keep voices/roles distinct so they don't blur.)*

**Region rivals & the road (cross-ref §1.8):** **Hanzaki** (the talent-gone-rotten mirror; the rare dangerous
combat beat); **Tomita** (Sōzaemon / Kageyuki / Yasubei); **Akagi** (Gennai).

**Kuzuhara cast:** **Carpenter Risuke** as the river-works lead; Dowager **Toku**'s flood-venture memory makes
Kuzuhara the house **atoning for its own root-sin.** *(No "Kuzuhara survivor" / co-investigator character: per
canon the MC has **no personal tie to Kuzuhara** — it is purely a struggling, depopulated upstream hamlet the
player can help resettle as a T2 region project. The MC's origin is uncovered via the **dream → the
Sawatari-juku family** (Oyuki / Jinpachi / etc.), never via anyone here who recognizes him.)*

## T2.6 Areas & mob roster

**Areas (T2 region; v1 cut-set; cross-ref §1.7 / §1.7.1):**
- **Kuzuhara — re-foundable upstream hamlet & embankment river-works** *(spine)* — the faction-3 fusion: the
  drowned hamlet → a resettlement node + the embankment that secures the disaster. Access-only, grind-built.
- **Sawatari-juku & the wider post-town region** *(mixed)* — the origin reunion hub (optional) + the *toiya*
  transport office / waystation trade layer (the practical surplus-export runway to T3).
- **The Kaidō Porters' & Transport Guild** *(spine-thin)* — routes, *sekisho* pass-tiers, route-risk; the trade
  backbone (met via Kanta's first favour run).
- **The Neighbouring Valleys** *(side)* — **hard-capped at exactly two named valleys (Hibara + Tōge-mura)** —
  Asagiri fractally replicated, slimmer. Optional accelerant.
- **The High Mountains & The Pass** *(shared wilderness, top of the conditioning gradient)* — the lethal terrain
  where his caravan died; the "one-eyed mountain god" (= Hanzaki + fog-blind terrain).

**Mob roster (grounded; region-scale; reuses the v1 set + adds human threats; conditioning-gated):**

| Mob | Type | Where | Role |
|---|---|---|---|
| **Rogue bear (*kuma*)** | animal | foothills / charcoal camp | A named HUNT quarry; high HP/damage; bear hide + gall = valuable craft/bounty loot. |
| **Wild dogs / feral pack & poachers' snares** | animal / hazard | woodlot & foothills | Ambient patrol threat; pairs with the poacher bounty (the dogs are the poacher's; the snares are evidence). |
| **Rice-thieves & smugglers' muscle** | human | region roads / post-town outskirts | Tied to the short-weighting/contraband **[MOTIF: rigged box]**; fighting them feeds standing AND the optional evidence thread. |
| **Masterless *rōnin* / road toughs** | human | region roads & post-town | Better-trained than bandits; drop the first decent FOUND blades (a worn *kodachi*, a fitted *yari*). The talent-foil's lesser kin. |
| **Mountain raiders / brigand roost** | human | high mountains & the pass | The CLEAR/break-the-roost target; regional-standing payoff; the approach to Hanzaki's territory. |
| **Hanzaki (named nemesis)** | human | the fog-blind pass / lookout | The recurring DUEL nemesis & talent-gone-rotten mirror; early encounters are **survived, not won**; his worn gear is a late FOUND prize. |

> **No belief-creatures in spawn tables (binding).** The "one-eyed mountain god," "fox-fire fox/tanuki," and
> "yamanba/tengu" are **INVESTIGATE-then-confront one-shots** resolving to humans/animals — never respawn
> populations.

## T2.7 Open-ended side-quests (T2)

All optional; none gate the spine. Inn-rumour folklore continues to unlock organically as the region grows.

- **The lost-child truth (Otsuru) resolves.** **[THREAD: Tama]** — the spine's personal payoff (also a
  main-quest beat; listed here as the optional-depth investigation that *finds* her).
- **The origin reunions.** **[THREAD: Origin]** Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen — each a discrete
  "restored ties" milestone; **access-only, ZERO gift.**
- **Kuzuhara re-founding + naming the drowned.** Grief-work + a temple register (not a rite); the cover-up
  evidence surfaces here. **[MOTIF: rigged box]**
- **The "one-eyed mountain god" investigated.** **[FOLKLORE → cause]** = Hanzaki + fog-blind terrain. One-shot.
- **The fox-fire ridge.** **[FOLKLORE → cause]** = a hidden charcoal kiln (resolves the T1 seed). One-shot.
- **A famine-band, fed not fought.** A starving band under Hanzaki's orbit can be **fed/resettled** — a mercy
  quest, not a kill (sensitivity: traumatised survivors with dignity, never "wild people to tame").
- **The poacher bounty.** A named poacher thinning the woodlot deer (BOUNTY archetype); some poachers are
  reachable consciences, not pure villains.
- **Courting the neighbouring valleys.** Optional accelerant (Hibara's first consignment; Tōge-mura's timber);
  capped at two.

> **Belief→cause additions (T2; binding).** "One-eyed mountain god" → Hanzaki + terrain. "Fox-fire ridge" →
> hidden charcoal kiln. "Yamanba/tengu of the high cedars" → a hermit / recluse / large raptors / wind in the
> cedars (INVESTIGATE-then-confront, never a monster). The **≤1 residual-ambiguity cap holds** — the only
> ambiguous token remains the Asagiri boundary-stone offering; **no new ambiguity beats** are added at T2.

---

# T3 — Castle-town (STUB in v1)

> **v1 ships a STUB cliff-hanger only** (canon §I). The single buildable T3 node for v1 is the **Kaidō Porters'
> & Transport Guild first-contact** (Kanta's favour run + the first *sekisho* turn-back) — chosen because it
> (a) pays off the MC's own porter past, (b) is the trade backbone everything else hangs from, and (c)
> demonstrates the fractal-incremental motion at a new frontier with the least new art/systems. The T2 capstone
> opens onto exactly this one teaser, then ends. **Everything below is authored-forward (not built in v1).**

## T3.1 Overview (forward)

**Theme:** *be reckoned with by the people who actually rule* — the castle-town, the *daikan*/*tedai*,
inter-*han* markets. The takeover is won **socially** (canon §B: multi-route — office / economy / marriage /
out-maneuvering rivals; AND assertive martial-security leverage; **never open rebellion**). "Take over" =
becoming the **dominant house holding key domain offices.**

**Transition gate (T3→T4):** a **"taste of Edo"** — the house is **forced to build & fund an Edo estate** →
grow influence → the national tier. **Required pillars:** **Office + Name** dominant; Arms/Estate as leverage.
**Estate stage span:** E3 Prosperous → E4 Fortified Seat.

## T3.2 Main-quest beats (forward stub)

1. **The summons.** After the T2→T3 service is rendered, a low *tedai* delivers a sealed note: present the
   Kurosawa's representative at the **Daikan's Office** — one node (the receiving anteroom), one verb (present
   credentials).
2. **The townhouse beachhead.** Secure a modest rented castle-town townhouse — a single bare room with a gate,
   mirroring the T0 kura cold-open (the T3 hub through which introductions route).
3. **Officialdom records you.** Repeated correct conduct earns an audience with **Daikan Iemasa** and a
   "standing with officialdom" meter; yields/contracts get **formally recorded** (the *koku*→Influence
   conversion at domain scale).
4. **Debt restructured into creditworthiness.** The finance network restructures the grandfather-era loan
   (Tanomo's interface), opening working capital + the *goyōkin* lever.
5. **The *meibutsu* graded toward Osaka.** The silk is graded/branded for wider markets (still ≤⅓-capped).
6. **Out-maneuvering Tomita (and the marriage lever).** Tomita contests broker terms + samurai-society standing;
   the optional **marriage/adoption alliance** lever matures (a real, lean Standing/Name move + a takeover
   route).
7. **Win the region's confidence (the gate).** Become the dominant house holding key offices → the "taste of
   Edo" forces the house to build & fund an Edo estate. **Gate met.**

## T3.3 Antagonist arc — **Tedai Kuroiwa**, the gracious door (forward)

- The magistrate's agent (*tedai*) who *records* your achievements and secretly architects the rice-quota skim
  (canon §F). Outwardly an ally; **defeated by evidence, not violence.** Sits **beneath** Daikan **Iemasa** and
  **above** guilt-sick clerk **Naozane** (the crack).
- **Incremental reveal:** the polite junior clerk who keeps you waiting → the facilitator who records your
  service (seems an ally) → a yield misrecorded "by error" → Naozane's flinch → the rigged *kyō-masu* at the
  weighing-yard cross-referenced against quota ledgers. **The gracious man at the gate *is* the rot.**
- **Resolution (multi-route, partial justice):** **Peaceful** — outgrow him; make his skim irrelevant; you need
  not prosecute him at all. **Assertive** — mount the ***osso* over-the-head petition** on proof. **Kuroiwa
  answers; Daikan Iemasa largely escapes**; the petition's **lethal risk falls on an ally / *gimin*-martyr**,
  not the MC (canon §F — settled). **[MOTIF: rigged box]** the through-line connects here (Magobei's *masu* →
  Kuroiwa's weighing-yard).

## T3.4 Estate roster & buildings (forward) — E3 → E4

**Joins (forward):** a patrol-leader NPC + the MC's 2–3-man detail; a counting-house clerk under Tanomo;
seconded village-artisan teams (Onatsu's apprentices); a small standing squad of named men-at-arms; branch-
holding stewards; **Town-agent Heikuro** (townhouse caretaker; transacts while the MC is away — the late-game
idle/automation hook); **Tokujirō seconded** to staff the townhouse (re-homing "teach others from zero").
**Buildings (forward):** counting-house, guest quarters, roofed dojo + barracks → a proper **wall + gatehouse**,
armoury, watchtower, a standing road-patrol; multi-valley branch holdings; *meibutsu* groundwork toward Osaka.

## T3.5 Key NPC beats (forward)

**Tedai Kuroiwa** (primary antagonist); **Daikan Iemasa** (incurious apex who largely escapes — the honoured
ceiling); **Clerk Naozane** (the reachable conscience / documentary proof); **Proprietress Okatsu** (teahouse
super-broker — the introductions layer, period-accurate restraint); **Retainer Tadahiro** (first genuine
peer-ally); **Lady Chiyo** escalated to the house's **alliance-strategist**; **Go-between Omiya-no-Sahei**
(marriage/adoption broker — standing & discretion, not romance); **Naoyuki** as the ally against Tomita;
**Munenori**'s decline begins in earnest (the succession beat opens). **[THREAD: Origin]** Jinpachi's optional
emotional callback is *carried forward to T4* (no second mechanical payoff).

## T3.6 Areas & mobs (forward)

**Areas:** **The Daikan's Office (代官所)** *(spine-critical for formal T3 recognition; the racket's
nerve-centre; no folklore here — the rational, ledgered counter-world)*; the **castle-town townhouse +
social/entertainment district** (one hub); the **Rice & Silver finance network** (regional warehouse →
*Marutaya* debt-restructuring → *goyōkin*). **Mobs (forward):** Tomita toughs; the corrupt official's muscle /
the *daikan*'s enforcers (Kuroiwa is beaten by evidence, but his muscle is a real combat threat); a raiding
party that tests the men-at-arms corps (a DEFEND set-piece — a failed defence **dents/disables** a holding
*temporarily*, **never a wipe**).

## T3.7 Side-quests (forward)

The ***osso* petition** (a *gimin*-martyr bears the lethal risk); the rice-quota racket's reachable rungs
answer; Naoyuki's coming-into-his-own; the succession secured. **[MOTIF: rigged box]** the curious player pulls
the through-line; the incurious one advances by economy/society alone. **No T3 castle-town folklore "wink"** —
the invented T4-era ghost-story beat is **deleted** (it would breach the ≤1 ambiguity cap; canon §1.13).

> **Parked — later (designed, not authored as full v1 content):** estate stages **E3–E5** in full; the marriage/
> adoption brokerage depth; the *daikan*-office audit/evidence sub-thread depth; the full social-district
> introductions system. **Cut for now (reintroduce later):** the Matagi hunters, the Pilgrimage Order, and the
> Scholars-&-Physicians as a *network* (keep Ranpo / Obaa Sato as the existing seed only).

---

# T4 — Edo (ROADMAP)

> **v1 ships a ROADMAP only** (canon §I) — the national tier is scoped forward, not built. All beats below are
> the authored target, kept lean so a later milestone can build against them.

## T4.1 Overview (roadmap)

**Theme:** *recognition at the capital* — restore **and** surpass the grandeur of three generations ago. The
ceiling is honoured absolutely: recognition is **indirect & mediated** (down through rusui **Konoe** and Lord
**Munenori**); the MC does **not** become a *hatamoto* and is **never** received by the shogun. His personal
ceiling stays **chief steward / *yōnin* — the lord's right hand** (grand *karō*/adoption vocabulary stays
aspirational narration only). The house's *banzuke* rank keeps climbing post-cap (personal vs house ascension
decoupled).

**The tier's mechanism:** the house's hands reach Edo **only inside the lord's body of work** — the MC equips,
provisions, and burnishes the lord's biennial **sankin-kōtai** attendance; credit accrues to the lord, and
thence to the house. The Edo *yashiki* is a corner of someone else's compound, known only through letters.

## T4.2 Main-quest beats (roadmap)

1. **The two conduits open (seeded late T3).** Genemon hands the MC a share of outfitting the lord's biennial
   journey (sankin-kōtai); the first sealed dispatch arrives from the domain's Edo residence (rusui **Konoe**).
2. **The *meibutsu* reaches Edo.** Silk rides the procession up as tribute; a Nihonbashi *tonya* sends a single
   trial order (the silk's first capital-side buyer).
3. **The chart that omits you.** Konoe forwards a popular ***mitate*/parody broadsheet** (sumo-rank vocabulary)
   on which a rival domain's product appears and the Kurosawa's does not — one stinging absence.
4. **Climbing the *banzuke*.** The silk first appears on a minor chart → climbs toward the attainable band
   (Maegashira/Komusubi) as the house's standing rises; the top ranks (Ōzeki/Yokozuna) are **structurally
   sealed** — the wall the truly powerful built, made the chart's literal geometry.
5. **The untouchable apex glimpsed. [MOTIF: rigged box] — terminus.** **Echizen-ya Sōbei**, the Edo factor
   laundering the skimmed silver, is glimpsed **once** (Konoe forwards a dispatch; a manifest dies at his name)
   — you learn *who*, and that you **cannot touch him.** **The factor escapes** (the honoured incompleteness).
6. **The touring-inspector set-piece (capstone).** Word travels down the *kaidō* that **Junkenshi Toyama
   Saemon-no-jō** will survey the domain. The whole game's accumulated work becomes the answer to one exam; the
   **lord** faces the inspector, the house's record is read aloud, **the MC stands at the back.** **Won or
   dented**, never fought (a recoverable dent on neglect, **never a wipe**).
7. **The mediated commendation (the ending).** A favourable report travels up and becomes a documented
   merit-commendation entering an official register (the house's name in bakufu ink), delivered **down** through
   Konoe and the lord. **One authored ending** (house restored & ranked) + **post-game free-play** (no reset);
   branches are in *how* you got there (allegiance / takeover route), not separate endings.

## T4.3 Antagonist arc — the Edo factor + the impartial test (roadmap)

- **Echizen-ya Sōbei (the Edo factor)** — the **untouchable apex** of the quota machine (the antagonist as
  *system*); glimpsed, named, **never reached.** Blocks *full justice* (the trail dies in Edo).
- **The Touring Inspector (Toyama Saemon-no-jō)** — **not a villain**; the antagonist-shaped **test** (the
  impartial judge whose survey validates or threatens everything the house built). Blocks *final recognition*.
  His secretary **Mabuchi** writes the report — the reachable human whose pen captures the house's worth
  (honestly informed, never bought).

## T4.4 Estate roster & buildings (roadmap) — E5 Restored-and-Surpassed

**Joins/escalates (roadmap):** **Rusui Konoe Settsu-no-suke** (the MC's sole pen-pal proxy in the capital — the
single recurring T4 through-line face; the filter through whom every official contact passes); **Procession-
master Saburozaemon** (marshals the retinue; gatekeeps outfitting quality tiers); **Naoyuki** travels in the
retinue as the house's future face (the rivalry→brotherhood pays off as he reports back from Edo); the MC's
**own students** (Tokujirō now teaches under him; recruited origin friends + famine-orphan recruits "started
from zero"); **Jinpachi** fully integrated as a caravan/route contributor (the **[THREAD: Origin]** optional
emotional callback — the recovered family proud behind him; **no second mechanical payoff**).
**Buildings (roadmap):** a rebuilt grand *omoya* beyond the three-generations-ago original; a famous-*meibutsu*
workshop quarter; a school/training-hall where the MC now **teaches**; formal retainer barracks; the
restored-and-surpassed house seal — **the epilogue tableau.** **No reset** — E5 persists into post-game.

## T4.5 Endgame, succession & epilogue (roadmap)

**Succession.** Aging **Munenori**'s decline → heir **Naoyuki** comes into his own (the MC as right-hand); the
house's future is secured across a generation.

**The epilogue tableau** (a single warm, bittersweet image of everything built): the restored-and-surpassed
house seal; the reclaimed fields; the resettled **Kuzuhara**; the **named drowned**; the freed and
self-determining **Otsuru**; the recovered family (incl. **Jinpachi**) proud behind him; and a true name —
**Tahei** — and a life built by hand. **Partial justice, by design:** reachable culprits answered at their
tiers; the truly powerful (Iemasa, Echizen-ya Sōbei) walk. The win is **the house restored and ranked**, the
rot's apex still out of reach.

**Post-game long-tail (no reset; no decay-tax):** defend the top *banzuke* spot on the biennial sankin-kōtai
heartbeat (recoverable, never a decay-tax); optional grounded super-bosses; per-pillar mastery goals; the
estate-as-sandbox **teaching layer** re-homed onto **Tokujirō** + recruited origin friends.

---

## §5 cross-references & integration notes

- **Numbers belong in §4.** Every "result," "threshold," "result-recorded," and pillar-gate here is a **shape**;
  the per-tier required-pillar thresholds, seasonal judged-result formula, conversion weights, and big-number
  formatting are §4's job.
- **Rung copy belongs in §3.** T2's region-ladder rung wording, and all per-tier reveal cadences, are §3's job;
  §5 fixes only the *story shape* of each ladder.
- **Authenticity pass (the Standing & Office pillar's exact kanji; martial-title hardening).** Canon defers the
  **Standing & Office** kanji and the authenticity-hardening of new martial/office titles to **this section's
  authenticity pass** — a follow-up sweep over the names used above (e.g. confirm humble *ashigaru*/household-
  tier titles vs grander aspirational narration). Tracked here, not yet executed. **[FLAG-HUMAN]**
- **Belief→cause tables are binding inputs to §2/§6** (the bestiary registry must contain **no belief-creatures**;
  yokai are INVESTIGATE-then-confront one-shots; exactly one ambiguous token at the boundary-stone).

## Items flagged for the human

1. **Authenticity pass not yet run.** The Standing & Office pillar's exact kanji and the hardening of new
   martial/office title vocabulary (humble *ashigaru*/household-tier vs aspirational narration) are deferred to
   this section's authenticity pass and are **not yet executed** — they need a research-harden sweep before
   T0–T2 dialogue is finalised.
2. **Jinpachi's reunion kept un-stacked (confirm tone).** Authored as a **clean warm reunion**, deliberately
   **not** a third "debt-bondage / debt-machine-ate-a-person" arc beside Tahei's caravan and Otsuru's near-sale
   (the superseded father draft stacked exactly that; the verifier flagged it). Confirm this lighter framing —
   and whether his return re-reads Oyuki at all.
3. **Otsuru / Osen name-proximity (RESOLVED).** The two post-town women previously near-rhymed; per human
   review the sweetheart was renamed to **Osen**, so they no longer blur. Authored with distinct roles/voices;
   no further rename needed.
4. **Kuzuhara has NO survivor / co-investigator character (CUT).** Per human review the stale fellow-survivor-
   who-recognizes-the-MC (the "Kiku"-type) is **cut entirely**: the MC has **no personal tie to Kuzuhara**.
   Kuzuhara is purely a struggling, depopulated upstream hamlet the player resettles as a T2 region project; the
   MC's origin is uncovered via the **dream → the Sawatari-juku family**, never via a Kuzuhara survivor. (The
   superseded spine's Ren/Kiku/Genza/Zenroku remain NOT canon and must not be revived.)
5. **T3/T4 are forward-authored only.** Per canon v1 scope (T3 stub = the Porter-Guild first-contact; T4
   roadmap). Confirm the chosen T3 stub node and that the parked/cut lists (E3–E5 depth; Matagi / Pilgrimage /
   Scholars-network) match the human's intent before any post-v1 build.

---

# §6 — Tech Architecture & Data Model

This section specifies, concretely and leanly: the **toolchain**; the **pure-core boundary** and module
layout; the **GameState** shape (stored vs. computed) and the `reduce`/`tick` contracts; the **one seeded
RNG**; **content as data registries** (data-as-code, single source of truth); the **save model** (IndexedDB
+ base64, versioned minimal-state, migrations); the **renderer contract** (thin DOM, multi-screen UI,
responsive, active-only); the **DEV play API** (`window.__qa`); **accessibility basics**; and how all of
this satisfies the four project conventions (pure-core, one RNG, generate-don't-duplicate, playtest-by-code).

> **ADR note:** §6 is recorded as an **elaboration of D-013 (D-013a — tech architecture detail)**, **not** a
> new design decision; it adds buildable detail to the already-locked tech canon (see §6.13).

---

## 6.1 Toolchain & build

**Stack (per D-013): Vite + TypeScript + Vitest, with ESLint + Prettier.** Committed `package.json` +
lockfile (the ad-hoc-toolchain weakness of the inspiration games is fixed by pinning everything). Output is
**fully static** — `vite build` → `dist/` → zipped and uploaded to itch.io, no server, no backend.

- **TypeScript: strict.** `"strict": true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitOverride`. The core is typed end-to-end; content registries are typed data so the content
  verifier (§6.6) and the compiler share the work.
- **Vite** handles the dev server (HMR), TS compile, bundling, and cache-busting. The production bundle is a
  single static app; the DEV play API and any dev-only helpers are stripped via `import.meta.env.DEV`
  (dead-code-eliminated from the production build).
- **Vitest** unit-tests the pure core (it imports cleanly in Node because it has zero DOM/canvas/window
  references — see §6.2). Determinism tests assert that a fixed seed + a fixed intent/tick script produces a
  byte-identical `GameState` (snapshot or structural hash).
- **ESLint** enforces the architectural rules as lint, not just convention:
  - **no `Math.random()` anywhere in `src/core/`** (custom `no-restricted-syntax` / `no-restricted-globals`
    rule) — all randomness flows through `core/rng` (convention: *one RNG*);
  - **no DOM/canvas/window/`document`/`localStorage`/`indexedDB`/`Date.now`/`performance.now` in
    `src/core/`** (a `no-restricted-imports` + `no-restricted-globals` boundary rule) — keeps the core pure,
    deterministic, and Node-testable (convention: *pure-core*);
  - the renderer (`src/ui/`) may use the DOM but may **not** import from another screen's internals or
    mutate `GameState` directly (it only dispatches intents).
- **Prettier** for formatting; **lint-staged + the existing `.githooks/pre-commit`** keep each commit
  green and journaled (the hook already requires a `journal/` entry; `SKIP_JOURNAL=1` for trivial commits).

### `npm run verify` (the single gate)

One command must pass before any commit and in CI:

```
npm run verify  =  tsc --noEmit
               && eslint .
               && prettier --check .
               && vitest run
               && node scripts/verify-content.ts      # the content verifier (§6.6)
               && node scripts/gen-docs.ts --check     # generated docs are up to date (§6.6)
```

`gen:docs --check` regenerates the balance/content docs into a temp buffer and fails if they differ from
what's committed — this is how *generate-don't-duplicate* is enforced mechanically: you cannot land a data
change without regenerating its docs. `npm run gen:docs` (without `--check`) writes them.

**Scripts:** `dev` (Vite dev server), `build` (`vite build` → `dist/`), `preview`, `test`, `test:watch`,
`verify`, `gen:docs`, `lint`, `format`. `build:itch` = `build` + zip `dist/` for upload.

---

## 6.2 The pure-core boundary

**The single most valuable architectural rule (CLAUDE.md conventions): all game logic — rules, state,
math — lives in a pure core with ZERO DOM / canvas / window imports.** The renderer consumes the core as
plain data. This makes the core deterministic, unit-testable in Node, and headlessly drivable.

```
src/
  core/        ← PURE. No DOM/canvas/window. The whole game's logic & data.
  ui/          ← thin DOM renderer. Reads GameState, dispatches intents. No game logic.
  app/         ← composition root: wires core ↔ ui ↔ persistence; the tick loop; __qa in DEV.
  persistence/ ← IndexedDB + base64 codec + migrations. (Side-effectful; never imported BY core.)
scripts/       ← gen-docs.ts, verify-content.ts (Node entry points; import core data only).
```

**Dependency rule (one-directional):** `ui`, `app`, `persistence`, and `scripts` may import from `core`;
**`core` imports from none of them.** `core` exports only pure functions and data and the `GameState` type.
The lint boundary rule (§6.1) makes a violation a build failure, not a code-review catch.

### `core/` module layout

| Module | Responsibility | Pure? |
|---|---|---|
| `core/state` | The `GameState` type, `createInitialState(seed)`, and the **stored vs. computed** split (§6.4). | yes |
| `core/intents` | The typed `Intent` union (every player verb) + `reduce(state, intent) -> state` — the action reducer. | yes |
| `core/step` | `tick(state, dtTicks) -> state` — the deterministic clock advance + the per-tick / per-day / per-week / per-season scheduler. | yes |
| `core/rng` | The **one** seeded RNG: pure `next(rng) -> [value, rng']`, derivations, helpers (`int`, `chance`, `pick`, `weighted`). Persisted in `GameState`. | yes |
| `core/combat` | The deterministic, fixed-step auto-battler (data-driven `attackSpeed`; seeded hit/crit/block/damage/loot). Stepped by `core/step`. | yes |
| `core/economy` | Producers, costs, resource flows (the *koku*/coin spine; the capped Estate & Wealth sub-engines: land / treasury / trade incl. the silk *meibutsu*, trade ≤⅓-capped per canon §D). | yes |
| `core/skills` | Per-skill XP curves, per-event caps, visibility thresholds, milestone web. | yes |
| `core/rewards` | The universal **rewards/unlock bus** — `applyRewards(state, rewards) -> state` — the one funnel through which dialogue, quests, thresholds, and combat grant items/xp/coin/locations/recipes/quests/**flags & unlocks**, and emit diegetic log lines. | yes |
| `core/unlock` | Predicate evaluation for the UI-reveal engine: each panel/screen/tab/row/area is data with an unlock predicate over `GameState`; `isUnlocked(state, id)` and `visibleSurfaces(state)`. | yes |
| `core/influence` | The four House-Influence pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour), achievement-jump + seasonal judged-result accrual (new-high-water-mark, up-only + per-pillar recoverable dents), and **simple per-tier required-pillar thresholds** for tier-up (canon §D — no floor/overflow formula). | yes |
| `core/content` | The **data registries** (one module per content type; §6.5) + the registry index. Data-as-code. | yes |
| `core/log` | The event/story log model (append, cap, severity/colour tag) — data only; the renderer paints it. | yes |
| `core/selectors` | Derived/computed reads (current production rates, effective stats, what's unlocked, current tier). **Pure functions of `GameState`; nothing stored.** | yes |

**Public surface of `core`:** the `GameState` type, `createInitialState`, `reduce`, `tick`, the selectors,
the registries, and the RNG helpers. **Nothing else mutates state.** Everything is immutable-in/immutable-out
(structural sharing; never mutate the input `state`).

---

## 6.3 The two contracts: `reduce` and `tick`

Two pure functions are the *only* ways state changes. Both are deterministic given `(state, input)` because
all randomness is carried inside `state.rng` (§6.7).

```ts
// Every player action is a typed intent. Discriminated union.
type Intent =
  | { type: 'rake_rice' }
  | { type: 'do_activity'; activityId: ActivityId }   // farm/forage/woodcut/fish/craft/...
  | { type: 'travel'; areaId: AreaId }
  | { type: 'buy_producer'; producerId: ProducerId }
  | { type: 'equip'; itemId: ItemId; slot: EquipSlot }
  | { type: 'set_stance'; stanceId: StanceId }
  | { type: 'use_item'; itemId: ItemId }
  | { type: 'combat_action'; action: CombatAction }   // ability/item/retreat — strategic, low-APM
  | { type: 'advance_dialogue'; lineId: DialogueLineId; choiceId?: ChoiceId }
  | { type: 'accept_quest'; questId: QuestId }
  | { type: 'read_scroll'; scrollId: ScrollId }       // diegetic feature unlock (costs in-game time)
  | { type: 'set_allegiance'; lean: number }          // Tama ↔ farmhand, continuous, re-swingable
  // ...one variant per verb; the renderer NEVER mutates state, it only dispatches these.

// The action reducer: a player verb → new state. Pure; deterministic.
function reduce(state: GameState, intent: Intent): GameState;

// The clock advance: simulate dtTicks of abstract game-time. Pure; deterministic.
// dtTicks is ABSTRACT (active-play ticks), never wall-clock. Active-only, no offline (canon §H).
function tick(state: GameState, dtTicks: number): GameState;
```

**`reduce`** validates the intent against current state (e.g. enough *koku*, area reachable, rung high
enough), applies the change, runs any triggered rewards through `core/rewards`, and re-checks unlock and
tier-threshold predicates so newly-earned surfaces flip to unlocked and push their diegetic log line. An
illegal intent is a no-op (returns the same state) plus an optional rejection note — never a throw.

**`tick`** advances the abstract clock by `dtTicks` and runs the scheduler in `core/step`:
- **per-tick:** combat sub-step (the auto-battler), satiety/energy drain (soft — slows, never hard-blocks),
  active-activity progress, auto-producer output (late-game only).
- **per-day / per-week:** vendor restocks, food rot/ferment, the market-saturation damper recovering.
- **per-season:** harvest resolution, the **seasonal judged Influence appraisal** (runs **every season —
  4×/in-game year**, the autumn harvest the headline; it **raises a pillar only on a new high-water mark
  (up-only)**, never a per-season maintenance trickle, per canon §D and PRD §1.6.2), weather/festival events.

`dtTicks` is computed by the **app-layer** loop from real elapsed time *while the tab is active*, then handed
to the pure `tick`. The core never reads a clock. **Active-only is enforced structurally:** there is no
offline-accrual code path — on load, the world resumes exactly where it was saved (no "while you were away").

> **Determinism guarantee (testable):** `replay(initialState, [intents…], [tickScript…])` produces an
> identical `GameState` every run. This is asserted in Vitest and is what makes the DEV play API (§6.9) a
> regression harness for pacing and unlock timing.

---

## 6.4 GameState — stored vs. computed

`GameState` is a single immutable-ish tree reduced by `reduce`/`tick`. The cardinal rule (per the architecture
sketch and the *save-minimal* canon): **store only what is NOT derivable; recompute everything derivable on
read.** Derived values (effective stats, current production/sec, what's unlocked, current tier, time-to-next)
are **computed by `core/selectors`, never stored** — so they can never go stale and never need a migration.

### Stored (non-derivable) — the persisted surface

```ts
interface GameState {
  schemaVersion: number;            // for ordered migrations (§6.8)
  rng: RngState;                    // seed + counter/stream — persisted (§6.7)
  clock: { tick: number; day: number; season: Season; year: number };  // abstract time
  resources: Record<ResourceId, number>;         // koku, coin(mon), wood, fish, materials…
  producers: Record<ProducerId, number>;         // owned counts (late-game only)
  skills: Record<SkillId, { xp: number }>;       // total xp per skill; levels DERIVED
  character: { hp: number; satiety: number; attributePoints: number;
               attributes: Record<AttrId, number> };  // base attrs stored; effective DERIVED
  inventory: Record<ItemId, number>;             // counts (quality folded into the item key)
  equipment: Partial<Record<EquipSlot, ItemInstanceId>>;
  influence: Record<PillarId, { value: number; highWater: number }>;  // 4 pillars; dents recorded here
  tier: TierId;                                   // current macro tier T0..T4 (DERIVED-checkable, stored for clarity)
  ranks: Record<TierId, { estateService: number; combatStanding: number; rung: RankId }>;
  reputation: Record<FactionNodeId, number>;     // village per-node meters; origin ties as milestones
  allegiance: number;                            // Tama ↔ farmhand lean, continuous
  flags: Set<FlagId>;                            // story/finished/one-shot flags (serialized as array)
  unlocked: Set<SurfaceId>;                       // panels/screens/areas the player has earned
  quests: Record<QuestId, { status: QuestStatus; step: number }>;
  counts: Record<CountId, number>;               // kills, clears, harvests — drive achievements/quests
  effects: ActiveEffect[];                        // active buffs/injuries with remaining duration
  combat?: CombatEncounterState;                  // present only while a fight is live; NON-derivable mid-fight (consumed RNG, current HP/positions/statuses cannot be recomputed) — stored so a save resumes the exact encounter; cleared when the fight ends
  log: LogEntry[];                                // capped event/story log
  settings: { textScale: number; colourblindMode: boolean; reducedMotion: boolean; muted: boolean };
}
```

### Computed (never stored) — examples from `core/selectors`

`effectiveStats(state)` (base + additive + multiplier layers + equipment + milestones); `productionPerTick(state)`;
`unlockedSurfaces(state)`; `currentTier(state)` and `tierThresholdProgress(state)` (against the simple
required-pillar thresholds); `skillLevel(skillId, state)` (from xp + curve); `timeToNextGoal(state)` (for the
greyed next-purchase). These are pure, cheap, memoizable per-snapshot, and **excluded from the save**.

> **Why this split matters:** it keeps the save tiny and forward-compatible (you only ever migrate
> non-derivable fields), makes the renderer a pure function of state, and means a balance retune (a curve
> change) instantly reflows every derived number with **no migration** — only stored facts ever migrate.

---

## 6.5 Content as data registries (data-as-code, single source of truth)

**All content is authored as plain, typed TypeScript data in `core/content`, one module per type** — consumed
by the pure core, never co-located with DOM or behaviour. This inverts both inspiration games' mistake of
binding data to the renderer, and it is the backbone of *generate-don't-duplicate*.

| Registry module | Holds | Keyed by |
|---|---|---|
| `content/resources.ts` | resources (koku, coin, wood, fish, materials…) + display/emoji + caps | `ResourceId` |
| `content/activities.ts` | jobs/labour nodes (farm/forage/woodcut/fish/craft) — yields, skill, season/area gates | `ActivityId` |
| `content/producers.ts` | late-game auto-producers — cost curve refs, output, unlock predicate | `ProducerId` |
| `content/skills.ts` | skills — xp curve refs, per-event cap, visibility threshold, milestones | `SkillId` |
| `content/items.ts` | items/equipment/consumables — slots, stats, rarity, quality rules | `ItemId` |
| `content/recipes.ts` | crafting — inputs, station tier, quality-from-skill rules, disassembly | `RecipeId` |
| `content/enemies.ts` | the **grounded** bestiary (boars/wolves/monkeys/bandits/ronin/smugglers — NO belief-creatures in spawn tables, canon §E) — stats, attackSpeed, loot tables | `EnemyId` |
| `content/areas.ts` | the full per-tier maps (T0–T2 in v1) — nodes, travel edges, conditioning gates, faction | `AreaId` |
| `content/dialogues.ts` | dialogue lines — text, display conditions, the rewards object, branch locks | `DialogueLineId` |
| `content/quests.ts` | quests — sequential steps, advance events, rewards (open-ended, non-waypoint) | `QuestId` |
| `content/scrolls.ts` | lore scrolls — in-game-time cost, the subsystem they unlock | `ScrollId` |
| `content/surfaces.ts` | every panel / screen / tab / row / button — its **unlock predicate** + which screen it lives on (drives the UI-reveal engine and multi-screen nav) | `SurfaceId` |
| `content/ranks.ts` | the **fresh rank ladder PER TIER** (T0/T1/T2 enumerated for v1) — rung, track (labour/combat/mixed), earn-condition, unlock | `RankId` |
| `content/influence.ts` | the four pillars + per-tier required-pillar thresholds (shapes; values cross-ref §4) + accrual deeds | `PillarId` / `DeedId` |
| `content/effects.ts` | buffs/injuries/status — magnitude, duration, stacking | `EffectId` |
| `content/balance.ts` | shared curve/constant definitions (cost growth, xp scaling, etc.) — the *single* home for tunables; §4 sets the values | (named) |

**Rewards are one shape everywhere.** Dialogue, quests, gathering thresholds, and combat all grant the same
`Rewards` object (`{ items?, xp?, resources?, unlocks?, areas?, recipes?, quests?, flags?, dialogues? }`),
funnelled through `core/rewards.applyRewards`. Story flags and UI reveals ride the *same* bus — so "story" and
"UI growth" are one dependency graph (a reveal reads as plot, not menu growth), exactly as §1/§3 require.

---

## 6.6 The content verifier + generated docs (generate-don't-duplicate)

**Content verifier** (`scripts/verify-content.ts`, run in `npm run verify`): cross-checks every id/reference
across all registries (a recipe's inputs exist; an area's travel edges resolve; a quest's reward items exist;
a rank's unlock surface exists; every `SurfaceId` referenced by a screen is registered; no orphan ids). It
also asserts the **canon invariants** as machine checks so they cannot silently rot:

- no `EnemyId` in any spawn/population table is tagged `belief-creature` (canon §E);
- the **trade** sub-engine of Estate & Wealth is capped at **≤⅓** of that pillar (canon §D);
- exactly **≤1** residual-ambiguity token exists across content (canon §A);
- no Influence path is a passive per-tick trickle or flat per-action increment (accrual is jump/judged only);
- no content grants a combat stat/training-rate bonus from labour conditioning (no labour→combat cross-feed);
- **macron / no-plain-ASCII-romaji lint:** display/name strings use proper-Hepburn **macrons** (Tōkichi,
  Yagōemon, Jūbei, *kyō-masu*) — the verifier flags plain-ASCII romaji that should carry a macron, so no
  ASCII-slip can land in shipped text (canon §H).

**Generated docs** (`scripts/gen-docs.ts`): a Node entry that imports the same registries the game runs on and
writes balance/content tables into `docs/` (e.g. `docs/balance/curves.md`, `docs/content/bestiary.md`,
`docs/content/areas.md`, `docs/content/ranks.md`, `docs/content/influence.md`). Run with `--check` in
`verify` to fail the build if the committed docs drift from the data. This is the convention *generate, don't
duplicate* made literal: balance/content tables are **never hand-maintained twice** — they are a build
artifact of the one source of truth.

---

## 6.7 The one seeded RNG

**One seeded RNG for the entire game** (canon §H, convention *one RNG*). A small, fast, well-distributed
generator (e.g. **mulberry32** or **splitmix64**), seeded at new-game from a stored seed.

- **It is part of `GameState`** (`state.rng = { seed, counter }`) and is **saved & loaded**, so resumed games
  stay deterministic and reproduce exactly.
- The API is **pure**: `next(rng) -> [n, rng']` returns the value *and* the advanced RNG; helpers
  (`rngInt`, `rngChance`, `rngPick`, `rngWeighted`) thread the new RNG back into `GameState` via `reduce`/
  `tick`. Combat, loot, weather, and dialogue flavour all draw from this one stream.
- **`Math.random()` is banned in `core/` by lint** (§6.1) — there is no second, hidden source of randomness.
- For independent sub-streams (e.g. a fight's rolls vs. weather) we **derive child RNGs by splitting** from
  the parent counter, so each subsystem is reproducible without coupling — still all rooted in the one seed.

> This is what lets a saved fight resume identically, lets the DEV play API force a rare loot/crit outcome by
> seed, and lets Vitest assert byte-identical replays.

---

## 6.8 Save model — IndexedDB + base64, versioned minimal-state

Per **D-013 / canon §H**: robust, durable, static-friendly, **no backend**.

- **Primary store: IndexedDB.** A single object store holds **one autosave slot** (canon: *single autosave*).
  IndexedDB is chosen over `localStorage` for robustness and capacity (structured data, no 5 MB string wall,
  survives better). Autosave fires on a debounced cadence (after meaningful intents and on a tick interval)
  and on `visibilitychange`/`beforeunload`.
- **Export / import: base64 to a text file.** The same serialized save is base64-encoded for copy-paste / file
  export and import — the player's portable backup (and a hand-off path for QA). Import validates + migrates.
- **Persist only non-derivable state (§6.4).** The save is the **stored** surface of `GameState`: schemaVersion,
  RNG (seed + counter), clock, resources, producer counts, skill xp, base attributes, inventory, equipment,
  influence pillars (value + high-water + dents), ranks, reputation, allegiance, flags, unlocked surfaces,
  quest status, counts, active-effect remainders, settings. **All derived stats are recomputed on load** by
  the selectors — never serialized.
- **Versioned with ordered migrations.** `schemaVersion` is stored; on load, an ordered list of
  `migrate_vN_to_vN+1(save)` steps runs in sequence to bring an old save current (each migration is a pure
  function, unit-tested). Migrations live in `persistence/migrations/`.
- **Validate + degrade gracefully on load.** A corrupt/unreadable save shows a calm, explained recovery (offer
  re-import or a fresh start), **never** a scary "save is kill" wall. A pre-migration backup of the raw bytes
  is kept so a failed migration is recoverable.
- **No offline accrual on load.** Active-only: load restores the exact saved `GameState` and resumes; there is
  no time-skip catch-up.

**Persistence lives in `src/persistence/`** (IndexedDB access, the base64 codec, the migration chain). It is
side-effectful and is **never imported by `core`** — `core` only produces the plain serializable `GameState`;
the app layer hands it to persistence.

---

## 6.9 Renderer contract (thin DOM, multi-screen, responsive, active-only)

**The renderer is a thin DOM layer in `src/ui/` with zero game logic** (D-013). It is a (near-)pure function
of `GameState`: `render(state, prevState)` reconciles the DOM against the new snapshot; it does **not** compute
outcomes and does **not** mutate state — it only **dispatches intents** back to the core. The combat renderer
animates the deterministic result (filling bars, floating numbers); it never decides the fight.

- **Data-driven surfaces.** Every panel/screen/tab/row/button is described by `core/content/surfaces.ts` with
  an unlock predicate; the renderer shows only `unlockedSurfaces(state)`. "The UI is incremental" is a tunable
  content table, **not** hardcoded view logic. Each first-time reveal pushes a diegetic line to the event log
  (the reveal reads as plot).
- **Multi-screen UI, progressively revealed (canon §H).** There is a real multi-screen shell with navigation
  (e.g. Estate / Village / Wilds / Skills / Combat / Influence / Map / Journal / Settings screens), but
  **nav and screens are revealed as earned** — so it *appears single-screen early* (minute one is one verb +
  the log) and grows into a full multi-screen app. The nav is itself driven by unlock predicates.
- **Responsive desktop + mobile, NOT hover-dependent (canon §H).** A fluid layout (CSS grid/flex,
  container/media queries) that reflows columns→stacked on narrow screens; **all information reachable without
  hover** — any hover tooltip has a tap/focus-equivalent, and "Shift for more detail" is an *enhancement*, never
  the only path to a value. Touch targets are comfortably sized.
- **Art register = text + emoji + CSS (D-013 / canon §H).** Woodblock-style palette, kanji season tags,
  colour-coded rarities, CSS flourishes; a small canvas is permitted ONLY for optional ambient FX (seasonal
  particles), **never for logic**. Colour is never the *sole* carrier of meaning (see §6.10).
- **Number formatting = abbreviated K/M/B (canon §H).** Large values display **human-scaled, abbreviated**
  (e.g. `12.4K`, `3.1M`, `2.7B`) — **not** scientific notation (`1.2e7`) and **not** myriad units
  (man/oku). A single shared display formatter in the renderer (a pure helper fed by the selectors) keeps the
  scale legible as koku/coin/pillar numbers climb.
- **Active-only loop.** The app-layer tick loop runs only while the tab is active (driven by
  `requestAnimationFrame` / a paced timer); it computes `dtTicks` from elapsed active time and calls the pure
  `tick`. Backgrounding pauses; there is no offline catch-up. A user **pause** is supported.
- **One render path.** Updates go through `render(state)` reconciliation — not scattered manual
  `update_displayed_*` push-calls — which kills the stale-UI class of bug by construction.

---

## 6.10 The DEV play API (`window.__qa`) — playtest by code

**A DEV-only play API on `window.__qa`** (canon: *playtest via code, not synthetic input*; the
`capture-game-states` skill consumes it). It is attached **only when `import.meta.env.DEV`** and is
dead-code-eliminated from the production bundle.

```ts
window.__qa = {
  state(): GameState,                       // read the current snapshot
  dispatch(intent: Intent): void,           // drive any player verb (same intents the UI uses)
  // convenience verb wrappers: rake(), activity(id), travel(id), buy(id), equip(id,slot), ...
  tick(dtTicks: number): void,              // advance the abstract clock by N ticks
  frames(n: number, dtPerFrame?: number): void,  // step N render frames (for capture/pacing)
  pause(): void, resume(): void,            // control the active loop
  newGame(seed?: number): void,             // deterministic fresh start from a seed
  save(): string, load(b64: string): void,  // round-trip the save (base64)
  forceState(patch: DeepPartial<GameState>): void,  // jump to a late unlock / rare outcome / terminal screen
  setSeed(seed: number): void,              // pin RNG for reproducible rare rolls
  selectors: { unlocked(): SurfaceId[]; tier(): TierId; production(): ... },  // read-only derived reads
};
```

This lets us **headlessly drive and observe** the game: assert that each unlock fires at the intended
`GameState`, that pacing milestones (reveal cadence; time-to-next-goal) hit on schedule, that a forced rare
outcome renders correctly, and capture screenshots/recordings of any state for QA — all without synthetic
mouse/keyboard input. The same typed `Intent`s the UI dispatches are what `__qa` drives, so a headless run
exercises the real code paths.

---

## 6.11 Accessibility basics

Solid basics (canon §H), wired so they cannot be an afterthought:

- **Scalable text** (a `textScale` setting on `GameState.settings`, applied via CSS custom property; respects
  the browser/root font size).
- **Colourblind-safe cues:** colour is *never* the sole signal — rarities/severities also carry an icon/emoji
  and/or text label; a `colourblindMode` setting swaps to a safe palette.
- **Keyboard + touch:** full keyboard operability (focus order, visible focus ring, no hover-only controls —
  ties to §6.9's not-hover-dependent rule) **and** comfortable touch targets.
- **Reduced motion:** a `reducedMotion` setting (and `prefers-reduced-motion` honoured) downgrades the ambient
  canvas FX and number-float animations.
- **Pause:** the active loop can be paused (also an accessibility/comfort feature).
- **Semantic structure + live region:** the event/story log is an ARIA live region so reveals/important events
  are announced to assistive tech; screens/panels use semantic landmarks and labelled controls.
- **Mute:** light ambient beds + UI/event SFX with a mute toggle (canon §H audio note).

---

## 6.12 How this satisfies the project conventions

| Convention (CLAUDE.md) | How §6 satisfies it |
|---|---|
| **Pure-core boundary** | All logic/state/math in `src/core/` with **zero DOM/canvas/window** — enforced by an ESLint boundary rule (build failure, not review). Renderer consumes plain data; one-directional dependency. (§6.2) |
| **Determinism: one RNG** | A single seeded RNG **in `GameState`**, saved/loaded; pure `next`; child streams by splitting; **`Math.random()` lint-banned** in core. Replays are byte-identical (Vitest-asserted). (§6.7, §6.3) |
| **Single source of truth — generate, don't duplicate** | Content is typed data registries (`core/content`); a content verifier cross-checks ids and canon invariants; balance/content docs are **generated** into `docs/` from the same data and `gen:docs --check` fails the build on drift. (§6.5, §6.6) |
| **Playtest via code, not synthetic input** | DEV-only `window.__qa` (read state, drive intents, tick/frames, pause, force-state, seed) drives the **real** typed intents headlessly; powers `capture-game-states` and pacing/unlock regression. (§6.10) |
| **Active-only, no offline (D-013/canon §H)** | `tick` takes **abstract** ticks; the active-only loop lives in the app layer; load resumes the exact saved state with **no** offline accrual code path. (§6.3, §6.8, §6.9) |
| **Lean / high-impact** | One `npm run verify` gate; minimal stored save; no speculative subsystems — the module list maps 1:1 to systems already locked in §§1–5; anything bigger is parked for §7's roadmap. (§6.1, §6.4) |

---

## 6.13 §6 decisions → ADR (proposed)

§6 **refines** the already-locked **D-013** rather than opening new design questions; it adds buildable
detail (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed split, the registry set,
the verifier + generated-docs gate, the `__qa` surface). Proposed: record §6 as an **elaboration of D-013**
(or a child ADR **D-013a — Tech architecture detail**), not a new design reversal. Final ADR numbering is set
at integration.

### Flagged for the human

1. **IndexedDB vs. localStorage.** Canon/D-013 say IndexedDB; this section commits to it (single autosave +
   base64 export) for robustness. Confirm we accept IndexedDB's small async/boilerplate cost over
   localStorage's simpler-but-fragile sync API for a single-slot save.
2. **RNG algorithm choice (mulberry32 vs. splitmix64) and the sub-stream split scheme.** Low-stakes and
   reversible (it only affects the seed→sequence mapping, not any contract), but it pins save reproducibility
   once content ships — worth a nod before we lock a seed format.
3. **`schemaVersion` / migration policy ceiling.** Proposed: support ordered forward migrations indefinitely
   + a pre-migration raw backup; confirm we will *not* guarantee cross-major-rewrite save compatibility (so a
   future ground-up schema change may legitimately retire very old saves with a clear message).
4. **`core/state.tier` stored vs. fully derived.** Tier is checkable from the influence thresholds, but a
   tier-up is also a story beat (it fires rewards/log). Proposed: store `tier` as the committed value (set by
   the tier-up intent) and treat threshold-progress as derived — confirm this stored/derived split is right
   rather than re-deriving tier purely from pillars on every load.

---

# §7 — Milestone Roadmap, v1 Scope & Deployment

_Not yet authored._

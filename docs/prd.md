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
| **R4 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger; help hold the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); the first *shinden* reclamation begun; the **simple Crafting tab + loot→craft loop** (Smith Gonta). |
| **R5 — Gate-guard (*monban*)** | combat | Stand a real watch; clear the first pest/animal threats; weapon-skill milestones reached. (Combat Standing gate; conditioning floor at R3.) | Estate-defence duties; **PEST-CONTROL / HUNT / CLEAR / DEFEND** quest types; **Arms deeds begin accruing** (the standing itself is recorded at R6). |
| **R6 — Foreman of works (*kogashira*)** | labour | Drive the *shinden* reclamation and the workshops to recorded yield; the house edging toward solvency. | The workshops and granary; the low palisade; proto-industry levers; **the FIRST combat-earned Arms standing is recorded**; **errands beyond the estate — the VILLAGE TIER opens here.** |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** | labour→admin (as narration) | First reclamation recorded; the lord begins to notice; the MC takes on the home-fields *office* (his own quests/duties, not a management layer). | Field administration framed as the MC's own offices/quests; **House Influence made visible and tracked** (the four-bar standing panel); cash-crop levers; the **tier-expansion map**. The capstone bridge to T1. |

**T1 — The estate's domain expands into the valley (~8 rungs; a fresh ladder, not a continuation of T0).**
The HOUSE's standing climbs **friendly → TRUSTED**, and its domain grows from bare *survival* to **anchoring its
valley**. Rank is still a rung **within the house's theme**; at every rung you act **FOR THE ESTATE** across the
village + estate + surrounding roads. Labour and combat keep interleaving, now reaching past the estate gate.
*(The **village reputation web** — §1.5.2 — runs **alongside** this as a parallel **optional accelerant**, never
a gate; see §1.5.4.)*

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | labour | The house trusts him to carry its business past its own gate into Asagiri; first village errands. | The market/shop row; coin; the village reputation web seeds (optional). |
| **V1 — Recognised hand of the house** | mixed | The valley begins to know the house's man (headman + shops acknowledge him); combat keeps pace clearing valley pests/animals. | The chief's house; deeper satoyama rings; the inn & rumours board (side). |
| **V2 — Road-warden (*michi-ban*) for the house** | combat | Make a stretch of valley road or the ford safe in the estate's name; survive a real bandit/animal clear. | Road-security duties; **HUNT/CLEAR** at valley scale; better loot/craft tiers; combat-earned Arms standing. |
| **V3 — The house's steward of the valley economy** | labour | Bring the valley economy and the estate's cash-crops to a recorded seasonal result. | Cash-crop and trade levers (the silk/sericulture *meibutsu* sub-engine begins); the broker meters. |
| **V4 — Trusted of the headman** | mixed | Put a valley fire out on the estate's behalf (Magobei's skim surfaces here); win the headman's regard (personal regard is a side accelerant). | The headman's roll-up quests; the doctored-ledger thread; first **Office** standing. |
| **V5 — Sworn man-at-arms of the house** | combat | Stand a real watch for the valley in the house's name; weapon-line milestones; survive the first dangerous-road encounter. | The first paid martial outsiders (Gohei & Yatarō) recruited as flavour retinue; defence of the valley. |
| **V6 — Right-hand-in-waiting (agent over the valley)** | mixed | The lord first believes the house's impact beyond the estate is possible; "clean your room" nearly done. | Authority across the valley; the alliance/standing levers that point at the region. |
| **V7 — Agent of the house, the valley anchored** | labour→admin (as narration) | Estate healthy, valley anchored under it, immediate fires out — the capstone "clean your room" beat. | The **region** map and the **T1→T2** quest to grow the house's regional influence; rival samurai houses appear. The capstone bridge to T2 (the domain expands again, to the Region). |

**T2 — Region ladder (v1 scope; enumerated as a per-tier ladder).** v1 completes T2, so its ~8-rung ladder
ships too: the estate's domain expands again — a region-facing hierarchy framed as **the house's** agent over an
ever-larger domain (e.g. the house's **valley-envoy → road-captain of the cluster → broker of the post-town
trade → arbiter between valleys → recognised regional retainer → captain of the road-security detail →
alliance-broker → leading house of the region**), estate standing climbing **trusted → HONORARY MEMBER of the
house**, still interleaving labour and combat, with the **rival houses Tomita & Akagi** as the region's
incumbents to surpass (G7 = the rivals dethroned). The **personal-mystery payoff** (Kuzuhara on the spine; the
origin reunions incl. father **Jinpachi** + the lost-child truth on the **Origin one-tier rep side-track**,
`O0→O5`) lands across it. Exact rung copy is detailed at §3.6 (the unlock ladder); the **shape** — fresh ~8-rung
ladder, combat woven throughout — is locked here. T3/T4 ladders are **scoped forward** (T3 stub, T4 roadmap).

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
impossible without standing). It is a **one-tier standalone reputation side-track with its OWN rung ladder**
(`O0→O5`, §3.6.2 — **upgraded** from the older "discrete restored-ties milestones" framing per canon
§"Reputation systems model") — optional, fully completable, an **accelerant**, narrative-only with **ZERO
mechanical gift**, and it **NEVER gates the spine**. Its rungs walk the reunion in sequence: recognised at the
post-town → the household reopens (mother **Oyuki**, sister **Okimi**) → the old trade welcomes him (employer
**Denbei**, friend **Kanta**, the porter-guild) → the half-remembered tie (sweetheart **Osen**) → the father
returns (**Jinpachi**) → his name set down (the **Tama-payoff** capstone, at G6). *(Father **Jinpachi** is
re-added per the Round-A lock — renamed from the colliding "Kuranosuke" to a clean period name; he resolves at
T2 with an optional later emotional callback at T4 — see §1.9, §1.11.)*

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

**THREE reputation systems, two shapes (canon §"Reputation systems model").** The **ESTATE = the FIVE-TIER
SPINE** — the only thing that gates tier advancement. Per tier the estate-rep arc climbs (T0 stranger→friendly ·
T1 friendly→**TRUSTED** · **T2 trusted→HONORARY MEMBER of the house** · **T3 honorary member→chief steward /
*yōnin*** (the MC's personal CEILING) · **T4 the MC stays *yōnin*; the arc shifts to the HOUSE's national
standing** — the indirect/mediated Edo ceiling, the *house* ranked, never the man) and the estate's **domain
expands**: survival on its own land (T0) → **+ the village & surrounding valley** (T1) → **+ the region** (T2) →
**+ the castle-town** (T3) → **+ Edo / the nation** (T4). The **VILLAGE (T1)** and **ORIGIN (T2)** reputations are **ONE-TIER
standalone side-tracks**, each with its **own ranks/rungs**, optional and fully completable — **accelerants that
NEVER gate** the climb. The **village web** (how the villagers *personally* regard you) carries forward through
T2; the **Origin track** (Tahei's living family/friends at Sawatari-juku) is a one-tier rep side-track with its
own `O0→O5` rung ladder (§3.6.2), narrative-only.

**Separate earned standing meters** keep them from collapsing into one bar: **Estate Service** (steep geometric)
and **Combat Standing** (the estate spine's two rank-gating meters — progress meters, **not** economy
currencies), **Village Reputation** (gentle per-node meters — the optional T1 side-track), and **Origin Ties**
(the optional T2 side-track's own rung meter). Above all of them sits **House Influence**, the macro-resource
the estate spends to expand: the estate generates it directly, while village allies and origin trade-ties act
as **multipliers/feeders** — they don't unlock the next tier, they make conquering it faster and cheaper
(tuned so weaving both in shaves **~10–15%** off time-to-next-tier — *felt, never a wall*).

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
| **Standing & Office** (political/territorial) | 官威 *kan'i* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed (named on the roster; the bailiff duty; a dispute arbitrated; a valley allied) |
| **Name & Honour** (prestige/cultural) | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition; the house off the foreclosure list; a sponsored rite; an inspector's report; a recorded merit-elevation |

> **Trade is demoted to 1-of-3 sub-engines inside Estate & Wealth and hard-capped to ~⅓ of that one pillar**
> — so a pure-trade run maxes ~⅓ of one of four pillars and can never dominate. The signature **_meibutsu_ =
> silk / sericulture (LOCKED)** that was once the whole endgame is now **one capped strand in one sub-engine of
> one pillar** (still subject to the trade ≤⅓ cap).
>
> **Note:** the **Standing & Office** pillar's kanji is **RESOLVED = 官威 (*kan'i*)**, "authority of office"
> (set at the §5 authenticity pass, 2026-06-25; the earlier coined 政威 was rejected). Awareness: 官威 is a
> spoken homophone of 官位 ("court rank") — disambiguated by the kanji.

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
| **T1 — The Valley** | The estate's domain expands to **anchor its own valley** (standing friendly→**trusted**): Asagiri's shops, craftsmen, inn, shrine and the legend run as an **optional side-track**. | **T0→T1:** do enough estate work + complete **basic repairs** → the estate sends you out into the valley. | **Arms + Estate**, first **Office** (errand-authority; the headman's regard; cash-crops online). |
| **T2 — Region** | The estate's domain expands to **lead a region** (standing **trusted→HONORARY MEMBER of the house**): a cluster of valleys, the post-town, the upstream Kuzuhara ruins, roads, *sekisho* — with the **Origin** family/friends as a one-tier rep side-track (own rungs). | **T1→T2:** **"clean your room"** (estate healthy, village happy, immediate fires out) → the lord first believes impact beyond the estate is possible → a quest to grow **regional influence**; the region's **rival houses Tomita & Akagi** are the incumbents to surpass (G7 = rivals dethroned). | **Estate + Office** rising; **Arms** secures roads; the **personal-mystery payoff** lands here. |
| **T3 — Castle-town** *(stub in v1)* | The estate's domain expands to **become a castle-town power holding key domain offices** (standing **honorary member → chief steward / *yōnin*** — the MC's personal CEILING): the *daikan* / *tedai* officialdom and inter-*han* markets acknowledge, contend with, and cede to the house. | **T2→T3:** **win the region** (rival houses no longer the leaders) → the castle-town rulers **confer regional leadership** and **invite** the house in. | **Office + Name** dominant (the takeover is won socially); Arms/Estate as leverage. |
| **T4 — Edo** *(roadmap)* | The **HOUSE** rises to **national standing — ranked at the capital** while the **MC stays *yōnin*** (the arc is the house's, not the man's; indirect/mediated Edo ceiling, canon §F / D-010): restore **and** surpass the grandeur of three generations ago. | **T3→T4:** a **"taste of Edo"** — the house is **called to staff & run the *domain's* Edo establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence → the **national** tier. | **Name + Office** (the national *banzuke* ranking on all four pillars). |

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
| **The Neighbouring Valleys** | T2 | Side. **Hard-capped at exactly two named valleys (Hibara + Tōge-mura)** — Asagiri fractally replicated, slimmer. Courting them is an optional accelerant. |
| **The High Mountains & The Pass** | T2–T3 | Shared wilderness, top of the conditioning gradient. The lethal terrain where his caravan died; the "one-eyed mountain god" (= Hanzaki + fog-blind terrain). |
| **The Daikan's Office (castle-town officialdom)** | T3 | **Spine-critical** for formal T3 recognition; the racket's nerve-centre. Where most T3 Influence is minted. No folklore here — the rational, ledgered counter-world. |
| **The *domain's* Edo *yashiki* / *rusui-yaku* + *sankin-kōtai* conduit (one cluster)** | T4 | **Spine.** The mediated capital conduit — the house **staffs & runs the domain's establishment** (rusui **Konoe**) under the **daimyō's** biennial *sankin-kōtai* (never its own) — with the **Nihonbashi/*banzuke*** payoff and the **touring-inspector set-piece** folded in as its two payoff beats. |

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
| **T1 — The Valley** | **Foreman Magobei**, the "tanuki of the rumours board" — skimming rice with a doctored measuring-box (*kyō-masu*). The first, small human antagonist. | The T1→T2 gate needs the village happy; his skim keeps stores short and steals the surplus you need; he's the "tanuki" folklore beat. | The board's "rice-thieving tanuki" → one load measuring short twice → the doctored *masu* → the thread runs up to Headman **Yagōemon**, whose ledgers cover Magobei. Dawning unease, then a box of rigged wood. | **Peaceful:** expose the skim, Yagōemon makes restitution and keeps his post in disgrace. **Assertive:** force Magobei off the books (his hired muscle is the first small brawl). **Partial:** Magobei answers; better-connected Yagōemon mostly escapes with a quiet rebuke. |
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
- **R4** — main-house interior + the household domestic economy; first *shinden* begun; **simple Crafting + loot→craft loop**.
- **R5** — pest-control/hunt/clear/defend quest types; **Arms deeds begin accruing** (standing recorded at R6).
- **R6** — workshops + granary + proto-industry levers; **the first combat-earned Arms standing is recorded**; **errands beyond the estate (the village tier opens).**
- **R7** — the four-bar House Influence panel made visible + cash-crop levers + the tier-expansion map (capstone bridge to T1).

**T1 — the estate's domain expands into the valley (a FRESH ladder, V0→V7):** the tier opens minimal (one
contact, one shop) and progressively reveals — as the *house's* reach grows — the market/shop row → chief's
house → road-security & valley-scale combat → the silk/sericulture *meibutsu* sub-engine → first Office standing
→ the **region** map and the T1→T2 quest. The **village reputation web** (shop meters, the inn & rumours board)
fans out **alongside** as a parallel **optional** side-track, never a gate (§1.5.4, §2.15). **T2 mints another
fresh ladder** the same way (the domain expands again, to region scale; the personal-mystery payoff lands across
it). The point is the same motion repeating per tier, never an eight-rung-and-done staircase.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal **judged** Influence results — fired on a
**new high-water mark**, never a repeatable per-season maintenance trickle, per §1.6.2). **Auto-producers are
limited / late-game only** (early game is the MC's own active grind — combat, skills, jobs, crafting; **no
assignment/management panel and no labour-gang to manage**, ever). Everything is data-driven (areas/panels/
resources as registries with unlock predicates over GameState), deterministic under the one seeded RNG, with
balance/unlock tables generated into `docs/` and headlessly regression-testable via the DEV play API. The
estate, village, and origin tracks differ in **shape** to keep pacing varied (estate steep-geometric per-tier
ladders; village gentle per-node meters; origin discrete milestones), and the side factions act as Influence
**multipliers** (shave **~10–15%** off time-to-tier — felt, never a wall). The presentation register throughout is
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
- **Standing & Office pillar kanji (RESOLVED)** — the earlier coined 政威 was rejected; its **kanji is now
  RESOLVED = 官威 (*kan'i*)**, "authority of office" (§5 authenticity pass, 2026-06-25). The top-rung title is
  **RESOLVED = chief steward / *yōnin*** ("the lord's right hand"); keep grand *karō*/adoption vocabulary as
  **aspirational narration only** for a modest *goshi* house.
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
- **Standing & Office pillar kanji = 官威 (*kan'i*)** ("authority of office") (RESOLVED at the **§5 authenticity
  pass**, 2026-06-25; the earlier coined 政威 was rejected).
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
| 2.19 | Save / load (IndexedDB + export/import) | T0 (M0 minimal) | — (infrastructure) |
| 2.20 | The DEV play API + content verifier | T0 (M0 skeleton) | — (infrastructure/QA) |
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
early). Combat-earned **standing** begins accruing at **R5** (gate-guard) and is first recorded at **R6** (foreman). It then interleaves through
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
component chain) comes online at **R4** (trusted hand & houseman). Better loot/craft tiers unlock per tier and per
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
R4. The **component/quality system + processing chains** unlock at **T1+** (smithing chains, then the
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
the **quest log** reveals around **R5** (with the pest-control/hunt/clear/defend types; Arms deeds begin
accruing — the first combat-earned standing is recorded at R6). Quest scope grows per tier (valley-scale at T1, region-scale at T2 with the
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
- **ORIGIN (side, memory-gated SUPPORT track) — a ONE-TIER standalone rep ladder (`O0→O5`).** Tahei's
  **living** family/friends in **Sawatari-juku** (mother Oyuki, **father Jinpachi**, sister Okimi, employer
  Denbei, friend Kanta, sweetheart Osen, the porter guild). **Opens at T2-G2** on the **doubly-earned** gate
  (dream-memory **AND** travel-standing); the dream foreshadows it from early game. **Upgraded** from
  "discrete restored-ties milestones" to a **proper one-tier reputation side-track with its own short rung
  ladder** (`O0→O5`, §3.6.2 — kept LIGHT, 6 rungs, never a second spine), tracking the MC's standing with his
  origin community. Payoff = **support, not local power**: pride/morale (a modest global skill-XP buff framed
  as a *present-day relationship*, never a retroactive gift), allies (recruited porter mates), trade ties
  (origin-town goods/routes plugging into expansion). **Hard guardrail: returning memory grants ACCESS only,
  ZERO mechanical bonus**; at least one origin beat is always available **without** reputation-gating (the
  thread never stalls); the track **NEVER gates the spine**.
- **The Tama-vs-farmhand allegiance** — a **continuous, re-swingable leaning** (village-leaning ↔
  estate-leaning, default neutral, never frozen). **Rebalances rates & flavour, NEVER availability** —
  both factions fully completable on either lean; neutral is a valid in-character stance. **Faction
  tension is light / flavour — no mechanical penalty.**

**(b) Player-facing behaviour / loop.** Climb the estate ladder (the spine); raise village per-node
meters by trade and open-ended help; restore origin ties as memory + travel-standing allow; nudge the
allegiance through dialogue and where you invest labour. **Separate earned standing meters** keep the
three from collapsing into one bar. Above them sits **House Influence** (2.16); village allies and
origin trade-ties act as **multipliers/feeders** (tuned so weaving both in shaves **~10–15%** off time-to-
next-tier — *felt, never a wall; never a new pillar*).

**(c) Rough DATA shape.**
- `EstateLadder { tier, rungs: RankDef[] }`; `RankDef { id, track ('labour'|'combat'|'mixed'|
  'admin-as-narration'), earnedBy (EstateService|CombatStanding thresholds + trustBeats),
  unlocks: RewardBundle }`. Two meters: `EstateService` (steep geometric), `CombatStanding`.
- `VillageWeb { nodes: { shopId|familyId|guildId → meter (gentle curve) }, chiefRegard (rollup) }`.
- `OriginLadder { tier:'T2', rungs: RankDef[] (O0–O5), meter: OriginTies (gentle), prideBuff (global
  skill-XP, access-framed), allies[], tradeTies[] }` — a one-tier standalone rep ladder; every asset still
  grind-built; never a spine trigger.
- `Allegiance { value (-1 village … +1 estate, default 0), affects: rates+flavour only }`.
- `FactionMultiplier { source (village|origin), influenceSpeedup, budgetShare (apportioned so the
  combined ≈ ½ time, never exceeded) }`.

**(d) Ties to the four pillars.** The **estate ladder generates Influence directly** (labour → Estate &
Wealth; combat → Arms; offices → Standing & Office; recognition → Name & Honour). **Village & origin are
multipliers/feeders into the pillars, never new pillars.** The allegiance shifts *gain rates and
flavour*, never which pillars are reachable.

**(e) When introduced / fractal reveal.** **T0** — the estate ladder (R0→R7) and its two standing
meters. **T1** — the village web (one contact/one shop first, then meters fan out) + the silk sub-engine.
**T2** — the origin support track opens at G2 (memory + travel-standing gated) as its own one-tier rep ladder
(`O0→O5`, §3.6.2) and a fresh region estate ladder (`G0→G7`) mints alongside.
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
| **Standing & Office** | 官威 *kan'i* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed (incl. the **marriage / adoption lever**, 2.16.1 — T3+ parked), rivals eclipsed |
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
| **T4 Edo** *(roadmap)* | a **"taste of Edo"** — staff & run the *domain's* Edo establishment (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence | **Name + Office** (the national *banzuke* on all four pillars) |

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

**(e) When introduced / fractal reveal.** **T0 (M0)** — minimal save first, hardened across milestones as
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

**(e) When introduced / fractal reveal.** **T0 (M0 skeleton)**, grows every milestone. Developer
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
7. **Standing & Office kanji (2.16).** RESOLVED at the **§5 authenticity pass** (2026-06-25) = **官威
   (*kan'i*)**, "authority of office" (the earlier coined 政威 was rejected).

---

_§2 drafted from locked canon + LOCKED §1 + the three redesign brainstorms. Balance numbers are
deliberately deferred to §4. Next: §3 — the incremental unlock ladder (UI-as-progression)._

---

# §3 — Incremental Unlock Ladder (UI-as-progression)

> **DRAFT — awaiting human review.** Authored end-to-end from the LOCKED CANON
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md),
> incl. all three "Updated 2026-06-25" header blocks) and the merged PRD §1, §2, §5, §6. This section makes the
> **signature feature** concrete: it specifies the **ordered reveal of every panel, tab, screen, system,
> resource-row, and area** across the game — **T0–T2 in full (v1)**, with **T3/T4 sketched**. It references the
> §2 systems by name and **defers all exact numbers to §4** (thresholds, costs, curves, conversion weights).
>
> **Canon honoured throughout:** grounded / no-magic; mediocre-start (no hidden edge); **the core loop is the
> MC's own actions, NOT a management sim**; the four-pillar House Influence (Arms / Estate & Wealth [trade ≤⅓] /
> Standing & Office / Name & Honour) with **achievement-jumps + per-season judged results**, **up-only + minor
> recoverable dents**, **simple per-tier required-pillar thresholds (no floor/overflow)**; combat first-class &
> **EARLY (T0-R3)** & **earns Arms**; tiers **T0–T4** with per-tier story gates; a **fresh rank ladder PER
> TIER**; **full maps every tier**; **active-only / no offline**; abstract clock; **fractal incrementality**;
> LEAN / high-impact, immediate-vs-later; **auto-producers T3+ only**; rich attributes; **soft** stamina;
> **hybrid** crafting; **K/M/B** number formatting; **macron** romanization; names per canon.

## 3.0 How to read this section

The whole game is built on **one engine: the UI-reveal engine + event log (§2.1)**. Every panel, tab, resource
row, button, area, and screen is **DATA with an unlock predicate over `GameState`** (a `RevealableEntry`,
§2.1c). When a predicate flips true, **one event** fires through the universal rewards/unlock bus
(`process_rewards`) that *simultaneously*: pushes the **diegetic event-log line**, reveals the
panel/tab/resource/area, grants the perk, and advances a story flag — so **a feature unlock IS a plot beat,
never silent menu growth** (§2.1a, §1.12).

**Trigger taxonomy** (the four predicate kinds used in every table below):

| Code | Trigger kind | Predicate source |
|---|---|---|
| **RANK** | an estate rank rung reached (a fresh ladder per tier: T0 `R0–R7`, T1 `V0–V7`, T2 `G0–G7`) | the two earned standing meters — **Estate Service** + **Combat Standing** (§2.15) — crossing a rung |
| **PILLAR** | a House Influence pillar threshold crossed (Arms / Estate & Wealth / Standing & Office / Name & Honour) | `Influence.*` ≥ threshold (§2.16; numbers → §4) |
| **STORY** | a story / quest / dialogue flag set | a `flagsSet` from a quest or `TextLine` (§2.12) |
| **FIRST-USE** | first acquisition / first action / discover-by-doing | first resource gained, first XP in a skill, first entry into an area/danger ring (§2.4, §2.7, §2.9) |

**Reading the tables.** Each tier is **one coherent ladder table** (a *fresh* ladder, never a continuation —
canon §C, §I; §1.5.1). Rows are in **reveal order**. Each reveal gives: the **trigger**, **what becomes
visible**, and the **diegetic event-log line** that announces it (the `revealLogLineId` copy; final wording is a
§5 authenticity-pass concern, but the substance is locked here).

**Two cross-cutting rules that shape the whole ladder:**

1. **Fractal incrementality (§1.2 pillar 2).** Nothing is dumped. A composite system reveals **one piece at a
   time**: the drill yard reveals one post → one rack → sparring slots; a new region reveals one road → one
   threat → one contact; the four-bar Influence panel reveals **bar-by-bar** as each pillar first scores, not
   all four at once.
2. **The multi-screen UI appears single-screen early (§2.1b, §1.12, canon §H).** v1 begins as **one screen** (a
   single column: event log + one verb). **Navigation chrome and additional screens unlock progressively** — the
   first nav tab appears only when there is a second place to go. The "screen / nav reveals" are called out
   explicitly in §3.5 (the navigation reveal track) so the shell's growth is legible as its own ladder.

---

## 3.1 The cold open — minute one (T0, before R0)

The lone hand-authored, pre-ladder state. Built from **§2.1 (reveal engine + log)**, **§2.3 (soft stamina)**,
and **§2.4 (koku)**. This is the *only* moment with no nav, no tabs, no map — **one verb and a log.**

| Order | Trigger | What becomes visible | Diegetic event-log line |
|---|---|---|---|
| 1 | At launch (`STORY`: new game) | The **single screen**: the **persistent event log** (§2.1) — colour-coded, capped — and nothing else. | *"Cold. Wet straw. The dark smells of old rice. You do not know your name."* |
| 2 | Log advances (`STORY`) | The **one verb button**: **"Open your eyes."** (the entire interactable UI). | *"Somewhere above, a bird. You make yourself look."* |
| 3 | First verb pressed (`FIRST-USE`) | The **body / rest bar** (HP + soft satiety, §2.3) and the **rice counter** (koku, §2.4) — the two readouts of the *kura*. The verb changes to **"Rake the spilled rice."** | *"You are in a storehouse — a* kura*. Your head is bound. A pallet, a rake, rice spilled across a cracked floor."* |
| 4 | First rice raked (`FIRST-USE`: first koku) | The koku row lights its own panel (§2.4); the **rest verb** ("Lie back and breathe") appears beside the work verb (soft-stamina recovery, §2.3). Physician **Ranpo** speaks (grounds the amnesia — no visions). | *"You rake. A grain at a time. Ranpo, the physician: 'Head's been knocked, lad. You near drowned. Rest, and work when you can.'"* |

> **Canon checks:** matches the **cold-open spec** (canon §H; §5 T0.2 beat 1) — *kura*, one verb, persistent
> log, body/rest bar + rice counter, "no visions." The **first dream-fragment** (§5 T0.2 beat 1, Origin thread)
> is seeded as a log line here with **ZERO mechanical effect** (no panel, no bonus). After step 4 the player is
> at **R0** and the T0 ladder (§3.2) takes over.

---

## 3.2 T0 — Estate ladder (full; v1) — `R0 → R7`

**The tutorial tier.** One declining hill estate (the Kurosawa *goshi* house), **unlocked room by room** — and
T0 room/area reveals are **SEPARATE** (LOCKED): stables, woodlot edge, and drill yard each reveal individually,
never folded into the forecourt. **Combat surfaces EARLY at R3** (the humbling first fight). The ladder
**interleaves labour and combat** and is driven by two meters: **Estate Service** (labour rungs) and **Combat
Standing** (martial rungs). **No auto-producers appear** (canon §G — early game is the MC's own active grind).
The **four-bar House Influence panel reveals at R7** (the player *does* deeds first, *sees* the standing last).

Estate stage span this tier: **E0 Foreclosure's Edge → E1 Stabilising** (§1.5.1, §5 T0.4).

| Rung | Trigger (rung gate) | What this rung REVEALS (in fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **R0 — Stray ("another mouth")** | `STORY` (met at the open; cold-open §3.1 complete) | The bare **diegetic estate dashboard** as a single screen (the *kura* room readout); the body/rest bar + rice counter carried from the cold open. | *"You can stand. Barely. The household calls you nothing yet — 'another mouth.'"* |
| **R1 — Day-labourer (*hiyatoi*)** | `RANK` Estate Service (complete the spilled-rice task; Chief Steward **Genemon** assigns first real work) | **The Gate & Forecourt (*genkan*)** area (the promotions stage); **The Home Paddies & Dry Fields** area; the **basic labour loop** (Farming via §2.6); the **world-clock display** (day/season tag, §2.2) appears with the *koku* heartbeat; a **sleeping-place** (rest is now safe). | *"A door slides. Genemon, dry as a husk: 'Another mouth — soft, clumsy. Earn your sleep.' He points you to the paddies. The seasons begin to turn."* |
| **R2 — Bonded hand (*genin*)** | `RANK` Estate Service (a season of reliable labour; Genemon enters you on the books) | The **Skills tab** (§2.7) — first nav tab; surfaces by-doing as XP lands (Farming first, then **Foraging / Woodcutting / Hauling**); **The Stables & Woodlot Edge** area (revealed *separately*); **The Near Satoyama** wilderness ring (first danger ring, conditioning-gated, §2.9 — its actual surfacing is the `FIRST-USE` reveal at the conditioning floor, see §3.3); new resource rows light as gathered (wood, *sansai*). The **porter's-knot beat** fires (Origin clue, **ZERO bonus**). | *"Your name goes on the household books. You forage the near hills, fell timber, haul loads. A groom grunts: 'Huh — you've tied that knot before.' (You don't know why.)"* |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | `STORY` the **humbling, near-fatal first fight** (a wolf at the grain store — survived by luck, **never rescued, never skill**), THEN beg drillmaster **Jūbei** for drills | **COMBAT GOES LIVE (EARLY).** Reveals fractally: **The Drill Yard** area (one post → Jūbei's rack → sparring slots); the **Combat panel** (§2.8, idle auto-resolve + active setup: stance / ability / item / retreat); **idle-combat / training**; the **first crude weapon** + **Equipment & Inventory** panels (§2.10); the **Bestiary** panel (§2.9, fills by-encounter; the **wild boar** is the first grindable threat). Combat stats start near-zero; combat/weapon **skills surface** in the Skills tab. | *"The wolf left you in the dirt — ribs cracked, alive only by luck. You crawl to Jūbei. 'Talent is a story the lucky tell. You are not lucky. So you will work.' The drill yard opens."* |
| **R4 — Trusted hand & houseman** | `RANK` Estate Service (win **Lady Chiyo's** regard for indoor work + heir **Naoyuki's** grudging vouch; authored trust beats) | **The Main House / *Omoya*** interior area (kitchen, inner rooms, household shrine); the **household domestic economy** rows (textiles, kitchen, provisioning — feeds **Cooking** §2.6 and the satiety loop §2.3); the **first *shinden* reclamation** begins (a LAND lever toward Estate & Wealth); the **simple Crafting tab** (§2.11, hybrid — *simple recipes first*) opens with the early **loot→craft loop** (Smith **Gonta**, §2.10/§2.11). **[THREAD: Tama — seed only]** the house simply sees a proven, honest hand; **no one speaks the name "Tama"** yet (the village ignites the legend at T1-V0). | *"Lady Chiyo nods you indoors. Naoyuki, bored: 'He'll do.' The inner rooms open; the first fallow plot is yours to bring back. You earned this with honest hands."* |
| **R5 — Gate-guard (*monban*)** | `RANK` Combat Standing (stand a real watch; clear first pest/animal threats; weapon-skill milestones — conditioning floor set at R3) | The **Quest log** (§2.12) + the **four v1 quest types**, revealed as each is first taken: **PEST CONTROL → HUNT → CLEAR → DEFEND** (DEFEND is the Arms standing-earner). **Arms deeds begin accruing here** — the standing itself is first *recorded* at R6 and the full panel waits for R7 (earn → recognised → see). | *"You stand the gate, and the work finds you: vermin in the stores, a boar in the paddies, a night-watch to hold. Your sword starts to matter — not just your back."* |
| **R6 — Foreman of works (*kogashira*)** | `RANK` Estate Service (drive the *shinden* + workshops to recorded yield; house edging toward solvency) | The **Workshops** and **Granary** areas; **proto-industry levers** (LAND/TREASURY strands of Estate & Wealth); the **low palisade** (martial fabric); **THE FIRST COMBAT-EARNED HOUSE STANDING is recorded** — the first **Arms** achievement-jump formally enters the books (§2.16, capped; the four-bar panel still waits for R7); **errands beyond the estate are authorised — the VILLAGE TIER OPENS** (the **tier-expansion map** seed + the road out). | *"The frame of a workshop is raised; the granary takes shape; the ledger is no longer only red — and for the first time the books record the house's* Arms *standing rising by your sword. Genemon, grudging: 'Carry the house's business down to the village.' A road opens past the gate."* |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** *(capstone bridge to T1)* | `RANK` Estate Service + `PILLAR` (Arms + Estate thresholds; first *shinden* recorded; kura solvent) | The **lord's study** (ledgers) in the Main House; **jobs-as-offices** begin (field administration framed as **the MC's own quests/offices — NOT a management layer**, §2.6); **THE FOUR-BAR HOUSE INFLUENCE PANEL becomes visible** (§2.16) — revealed **bar-by-bar** in fractal order as each pillar has first scored (Arms first recorded at R6, Estate from the *shinden*; Office/Name appear as faint, not-yet-scored bars); **cash-crop levers**; the **per-tier domain ranking** read (§2.18) first appears here as "unranked." **Gate met → T1.** | *"The lord enters your name in his own ledger. You see, for the first time, what the house has become — four standings, rising. 'Now: the valley.'"* |

> **T0 deliberately withheld (fractal discipline):** coin/*mon* (a T1 reveal — there is no market yet); the inn
> & **rumours board** / folklore (T1, §2.13); the **component/quality** crafting system (T1+ — T0 is *simple*
> recipes only, §2.11); seasons/weather/**festivals** as a live layer (the *clock* shows at R1; the world-sim
> deepens at T1, §2.14); **auto-producers** (T3+, §2.5); the **origin** track (T2, §2.15). Holding these back
> keeps the screen lean (canon §G, lean discipline).

### 3.2.1 The earned-transition spine — *why* each promotion happens

> **Audit rule: no rung is granted for free.** Each promotion has a concrete in-game **trigger** (what you
> did), an in-fiction **reason** (why the house grants it), and a **named granter** — and the granters
> *escalate* as your standing rises.

Two engines make a rise from "another mouth" to the lord's bailiff believable inside one tier:

- **The house is dying and short-staffed.** The Kurosawa are a broke *goshi* household of ~a dozen people,
  buried in inherited debt (§5 T0.3), with a rusty door-bar for defence. A house this thin **can't be
  choosy** — it spends its scarce trust on whoever keeps proving capable. Every promotion below is that
  necessity in action.
- **You earn it on merit; identity is a later, lighter thread.** Across T0 you rise purely on demonstrated
  work — labour, grit, honesty, restoring the land. The "are you the lost *Tama*?" question is only
  **foreshadowed** here (the dream, the porter's-knot); **no one at the estate ever speaks the name "Tama."**
  To the house you are simply a hand who keeps earning his place. The legend only **ignites in T1**, when the
  village (Sayo) names you Tama on sight (§3.4 V0) — and the estate's plain "we only ever saw a hand"
  *becomes* the counterweight to the village's certainty. (Allegiance goes live at T1; grounded, partial
  payoff at T2-G6. Kept **light** — narrative-only, never gates stats/availability, canon §C.)

| Promotion | Earned by (trigger) | Why the house grants it | Granter |
|---|---|---|---|
| **R0 → R1** | Complete the spilled-rice task; the rest-bar recovers enough to work | Charity bought you a pallet, not a place. Raking the rice proves you'll work despite your state → casual day-labour ("earn your sleep") | Genemon |
| **R1 → R2** | A full **season** of reliable labour to an Estate-Service output threshold, never shirking | A casual *hiyatoi* is a transient the house owes nothing. A whole season of reliable work proves you're worth keeping → your name goes on the books (*genin*). *(Porter's-knot beat foreshadows the Origin thread.)* | Genemon |
| **R2 → R3** | Working the wild **Near Satoyama** (an exposure/conditioning threshold) **triggers** the wolf-at-the-grain-store incident; you survive by luck, then beg Jūbei | The undefended house is exposed; the attack proves it. Shamed at being thrashed, you beg for drills; an understaffed house that can't hire a guard trains the willing hand it has | Jūbei |
| **R3 → R4** | An authored **trust beat** — return the mislaid **debt-ledger** you could have pocketed; keep your head in the grain-store scare — plus a trust threshold | A broke house needs an **honest** hand near its dwindling affairs (the debt, the pawnable valuables) more than another field-hand. You've proven reliable, capable, **and** honest → Lady Chiyo brings you into the *Omoya*, strictly as a trusted servant | Lady Chiyo (+ heir **Naoyuki's** grudging vouch — seeds the rivalry→respect arc) |
| **R4 → R5** | A **Combat-Standing** threshold — weapon-skill milestones from drilling + clearing the first pest/animal threats | You've drilled (R3) and you're trusted (R4), and the threats keep coming with still no real guard. Drilling earns a real night-watch post → **Arms deeds begin to accrue** | Jūbei + Genemon |
| **R5 → R6** | **Estate & Wealth** thresholds — drive the first *shinden* reclamation + restart a workshop to a **recorded yield** | Solvency is the house's only survival path, Genemon is aging, and there's no coin to hire an overseer. You're the only proven **all-rounder** (labour + arms + trust) → he makes you foreman of the recovery; there is no one else, and the stakes are existential | Genemon |
| **R6 → R7** | The **tier gate** — Arms + Estate pillar thresholds + first *shinden* recorded + kura solvent | The works **succeed** — the house is off the foreclosure cliff, and it's materially your doing. The **Lord himself**, roused from despair, enters your name in his own ledger as **bailiff** and points at the next horizon: *"Now: the valley."* | **Lord Munenori** |

The capabilities **stack** (labour → reliability → arms → honesty → a real post → driving the recovery →
restoring the estate) and the granters **climb** (Genemon → Jūbei → Chiyo → the Lord) — so at every rung the
player knows exactly *what they did* to rise, and the capstone coming from the lord himself reads as earned.

---

## 3.3 T0 estate growth — room-by-room reveals (the SEPARATE-reveal rule, expanded)

A focused expansion of the LOCKED **separate T0 room/area reveals** (canon §I; §5 T0.4): the estate dashboard
**grows room by room**, each room its own reveal beat on its own trigger — never a single "estate unlocked"
dump. This is the same data (`RevealableEntry kind:'area'`) as the rungs above, surfaced here as one view so the
"rank ladder made of doors" (§1.12) is legible.

| Estate room / area | Stage | Trigger | Diegetic event-log line |
|---|---|---|---|
| **The Kura Storehouse** | E0 | `STORY` (cold open) | *"A storehouse. A pallet. Spilled rice."* |
| **The Gate & Forecourt (*genkan*)** | E0→E1 | `RANK` R1 | *"The forecourt gate, leaning on its post, opens to you."* |
| **The Home Paddies & Dry Fields** | E0→E1 | `RANK` R1 | *"Fallow paddies and dry fields stretch below — yours to work."* |
| **The Stables & Woodlot Edge** | E1 | `RANK` R2 *(revealed SEPARATELY)* | *"You're trusted past the yard — the stables, and the woodlot's edge."* |
| **The Near Satoyama** (shared wilderness, ring 1) | E1 | `FIRST-USE` (conditioning floor at R2) | *"The near hills open — foraging groves, a bamboo stand. Something rustles deeper in."* |
| **The Drill Yard** | E1 | `STORY` R3 (after the humbling fight) *(revealed SEPARATELY)* | *"Jūbei kicks open the drill-yard gate. One post. One rack. Begin."* |
| **The Main House / *Omoya*** (inner) | E1 | `RANK` R4 | *"The screens slide back — kitchen, inner rooms, the household shrine."* |
| **The Workshops & Granary** | E1 | `RANK` R6 | *"A workshop frame; a granary rising. The Kurosawa works begin."* |
| **The lord's study** (ledgers) | E1 | `RANK` R7 | *"You are called to the lord's study, where the ledgers live."* |

> **Binding:** each is a diegetic beat; building/recruiting is **flavour / light systems wired to the reveal bus
> — NOT a people-management sim** (no assignment panel, no labour-gang; §2.17, canon §G). Recruit **Tokujirō**
> joins at the E1 seam as a **light roster card** (the future "teach from zero" mirror), announced as a beat, not
> a managed unit.

---

## 3.4 T1 — The estate's domain expands into the valley (full; v1) — `V0 → V7` (a FRESH ladder)

> **What this tier IS (read this first).** T1 is **not** "the village track." It is the **HOUSE rising** —
> a **fresh per-tier rank ladder** (canon §C, §I) on which the Kurosawa estate's standing climbs from
> **friendly → TRUSTED** and its **domain expands** from bare *survival* (T0) to **the estate effectively
> anchoring / overseeing its valley** (T1). Every rung is still a **rank within the house's theme**; at every
> rung you act **FOR THE ESTATE**, carrying its business and its authority across the **village, the estate,
> and the surrounding satoyama/roads**. The valley's figures (headman **Yagōemon**, the shops, the inn)
> **acknowledge** the estate's growing role; they do not promote you — **the house does** (§3.4.1). *(Carried
> forward: **T2** is the domain expanding **again — to the Region**; §3.6.)*

**Two parallel tracks (one gates, one accelerates):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `V0→V7` ladder below. Its milestones are the
  **gate to T2 / Region** — this is what must be completed to advance. Rising it raises **House Influence**
  and grows the estate's reach over the valley. Labour and combat keep interleaving, now past the estate gate;
  the **four-pillar Influence panel already exists** (from R7) and T1 **lights its Office bar** for the first time.
- **(SIDE-TRACK) Village reputation web — an OPTIONAL accelerant.** A **second, parallel reputation** (§2.15):
  how the **villagers personally regard you** — per-shop "patron/regular" meters, the headman's **personal**
  regard, the inn/rumours social web, and the **Tama-vs-farmhand allegiance**. It is **fully completable** and
  shaves **~10–15%** off time-to-T2 (§1.5.4), but it **NEVER gates the spine** — ignoring it leaves you only
  poorer and lonelier, never walled. **Estate-rep advances the main quest; village-rep is a full optional
  side-quest layer.** *(The two reputations are deliberately distinct in shape — a steep gated ladder vs. a
  gentle multi-node web — so they never read as one bar painted twice; §2.15.)*

Estate stage span: **E1 Stabilising → E2 Recovering** (§5 T1.4). Coin (*mon*), the **component/quality**
crafting system, the **inn rumours board**, and the **silk/sericulture *meibutsu*** sub-engine all first appear
this tier.

| Rung | Trigger (rung gate) | What this rung REVEALS (fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | `STORY` (T0-R6 authorised it; first village errand) | The house pushes its first business past its own gate — **The Market / Shop Row** area opens (**ONE shop first** — Smith **Gonta's** forge — then fractally adds Obaa Sato's herb stall, Tokuemon's brewery, Onatsu's silk); **coin (*mon*)** resource row appears (§2.4). **[SIDE-TRACK]** the **village reputation web** seeds here — **per-shop "patron/regular" meters** begin (§2.15, gentle curves; optional accelerant, never the gate). **[THREAD: Tama]** headman's daughter **Sayo** names him "Tama" on sight — the legend **ignites** (allegiance goes live this tier; §1.5.4). | *"You carry the house's business into Asagiri. A girl, Sayo, stops dead: 'Tama? You're alive?' The shop row — and coin — opens to you."* |
| **V1 — Recognised hand of the house** | `RANK` Estate Service (the valley begins to know the house's man; shop + headman acknowledgment) | The house's reach widens: **The Chief's House** area (Yagōemon's receiving room, where the headman **acknowledges** the estate's man); **deeper satoyama rings** (combat keeps pace on valley pests, securing the estate's near-ground). **[SIDE-TRACK]** **The Inn & Rumours Board** area — the **rumours board** (§2.13) goes live with its **first optional folklore tidbit** (the "kappa" of the ford; look, or not). | *"The headman receives the house's man. At the inn, Sukezō taps a board of rumours: 'Folk say a* kappa *takes children at the ford…' (You may look, or not.)"* |
| **V2 — Road-warden (*michi-ban*) for the house** | `RANK` Combat Standing (make a stretch of valley road / the ford safe **in the estate's name**; survive a real bandit/animal clear) | The estate's writ now reaches the **roads** — **HUNT / CLEAR at valley scale**; **The River, Ford & Weir** and **The Foothills & Charcoal Grounds** wilderness rings open (§2.9, ring 2); **better loot / craft tiers**; **combat-earned Arms standing at valley scale** (Arms jump). | *"You clear the ford road for the house. 'The road is declared safe — it's in the village book.' The Kurosawa name reaches past their own gate now."* |
| **V3 — The house's steward of the valley economy** | `RANK` Estate Service (bring the valley economy + the estate's cash-crops to a recorded seasonal result) | The estate's domain grows to **the valley's livelihood** — the **TRADE sub-engine** of Estate & Wealth begins: the **silk / sericulture *meibutsu*** (LOCKED) under weaver **Onatsu** (cocoon → reeled silk → woven textile rows, §2.11); the **component/quality crafting system** unlocks (hybrid → component chains, §2.11); **broker meters** appear; the **market-saturation damper** becomes visible (§2.4). **(Trade hard-capped ≤⅓ of Estate & Wealth — §2.16.)** | *"Onatsu shows you the reeling-frame: 'Silk pays, if you're patient.' The first bolt is graded and sold under the house's name. (Trade is one strand of one pillar — no more.)"* |
| **V4 — Trusted of the headman** (the house's hand puts a valley fire out) | `STORY` (resolve a village-affecting threat **on the estate's behalf** — **Magobei's** rice-skim surfaces; the headman's **personal** regard is earned as a SIDE accelerant) | The estate's **authority over valley affairs** is recognised in office: the **Standing & Office pillar lights for the FIRST time** on the four-bar panel (first **Office** achievement-jump, §2.16); the **headman's roll-up quest** node; the **[MOTIF: rigged box]** doctored-*masu* thread (optional through-line). **[SIDE-TRACK]** Yagōemon's **personal** regard rises on the village web (optional). | *"You set the doctored measuring-box on the table. The skim ends; the valley breathes. For the first time the* house *holds an office's regard — a new bar rises."* |
| **V5 — Sworn man-at-arms of the house** (valley defence) | `RANK` Combat Standing (stand a real watch **for the valley, in the house's name**; survive the first dangerous-road encounter; weapon-line milestones) | The estate becomes the **valley's shield** — the **first paid martial outsiders** (**Gohei & Yatarō**) join as a **light flavour retinue** (E2 rota, §2.17 — roster cards, **not** managed units); valley-defence **DEFEND** quests; festivals/seasonal social beats deepen (§2.14, e.g. Brewer **Tokuemon's** festival hub). | *"Two old* ashigaru *take the house's coin and stand its watch. The valley starts calling it 'the Kurosawa works.'"* |
| **V6 — Right-hand-in-waiting** (the house's agent over the valley) | `RANK` Estate Service + `STORY` (Lord **Munenori** first believes the house's impact *beyond* the estate is possible) | The estate now effectively **runs much of the valley** through its agent — **authority across the valley**; the **alliance / standing levers** that point the house toward the region; the **region map seed** appears on the horizon of the tier-expansion map. | *"Munenori, watching the valley settle around the house: 'Perhaps… beyond this estate.' A far ridge, and a wider road, appear on the map."* |
| **V7 — Agent of the house, the valley anchored** *(capstone bridge to T2)* | `RANK` + `PILLAR` (the **"clean your room"** beat: the **estate** healthy, the **valley** anchored under it, immediate fires out — Arms + Estate + first Office thresholds) | The estate's domain is **secured at valley scale**; its standing is now **TRUSTED**. The **REGION map** fully opens; the **T1→T2 quest** to grow the house's *regional* influence begins; **rival samurai houses appear** on the horizon (Tomita / Akagi as distant names); the **domain-ranking** read updates. **Gate met → T2 (the domain expands again, to the Region).** | *"The room is clean — house, valley, all of it. The lord: 'Now, the region.' Two rival names surface from beyond the ridge: Tomita. Akagi."* |

> **T1 deliberately withheld:** the **origin** track (still dark/foreshadowed by the dream — opens at T2); the
> *sekisho* / pass-tier travel layer; region-scale combat (the pass, ronin/bandits as a population); **marriage
> / adoption** (T3+, §2.16.1); **auto-producers** (T3+). Folklore rumours unlock **organically and per-tier**
> (§2.13) — never an all-at-once dump.

### 3.4.1 The earned-transition spine — *why* each promotion happens (T1)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out in the valley), an in-fiction **reason** (why the *house's
> domain* expands), and a **named granter** — and **the GRANTERS are HOUSE-side** (the **Lord Munenori** /
> chief steward **Genemon**), with the valley's figures (headman **Yagōemon**) **acknowledging** the estate's
> growing role, never conferring rank. The throughline: **the estate's domain expands because you, its agent,
> deliver results in the valley** — survival (T0) becomes *the estate anchors its valley* (T1), standing
> **friendly → TRUSTED**.

| Promotion | Earned by (trigger) | Why the house grants it (its domain expands) | Granter |
|---|---|---|---|
| **V0 → V1** | Run the house's first errands into Asagiri to an Estate-Service threshold; open shop dealings (Gonta first) and survive valley pests on the near satoyama | The house, off the foreclosure cliff, must now **operate** in the valley, not just survive on its own land. A man who can carry its business and hold its near-ground is worth recognising → the valley starts knowing "the house's man" | Genemon *(Yagōemon **acknowledges** him at the receiving room — does not promote)* |
| **V1 → V2** | A **Combat-Standing** threshold — make a stretch of valley road / the ford safe in the estate's name; survive a real bandit/animal clear | The estate's reach can't stop at its gate while its own road is unsafe. Proving you can **secure the valley's roads** extends the house's writ past its fence → it names you its **road-warden** | Genemon (in the **Lord's** name) |
| **V2 → V3** | An **Estate & Wealth** threshold — bring the valley economy + the estate's cash-crops to a **recorded seasonal result**; the silk *meibutsu* comes online | Solvency must scale beyond the home fields. You've proven you can run not just the estate's land but **the valley's livelihood** → the house makes you its **steward of the valley economy** | Genemon *(weaver **Onatsu** vouches for the silk hand)* |
| **V3 → V4** | A **STORY** trust beat — surface and end **Magobei's** rice-skim (the doctored *masu*) on the estate's behalf; cross a trust/Office threshold | A house that puts out the valley's fires is owed a voice in the valley's affairs. Resolving the skim earns the estate its **first office-holder's regard** → the Lord records the house's first **Office** standing | **Lord Munenori** *(Yagōemon, the reachable culprit's patron, **acknowledges** the house's standing in disgrace)* |
| **V4 → V5** | A **Combat-Standing** threshold — stand a real watch for the valley in the house's name; survive the first dangerous-road encounter; weapon-line milestones; the first paid retinue (Gohei & Yatarō) stands up | The estate has become the thing the valley leans on for safety. A house that **shields its valley** needs sworn arms → the Lord swears you its **man-at-arms** and funds the first (light, flavour) retinue | **Lord Munenori** + Genemon |
| **V5 → V6** | An **Estate-Service** threshold **+** a **STORY** beat — the valley visibly settles **under the house**; the alliance/standing levers come into reach | With the valley anchored, the Lord — for the first time — believes the house's impact can reach **beyond** the estate. You are the only agent who has run all of it (errands, roads, economy, office, arms) → he makes you his **right-hand-in-waiting** | **Lord Munenori** |
| **V6 → V7** | The **tier gate** — the **"clean your room"** beat: Arms + Estate + first Office thresholds met; estate healthy, **valley anchored under the house**, immediate fires out | The estate's domain is **secured at valley scale** and its standing is now **TRUSTED**. The Lord, convinced wider impact is real, points past the ridge: the house's domain must expand **again — to the Region** → the **T1→T2 quest** opens; Tomita & Akagi surface as distant rivals | **Lord Munenori** *(capstone — "Now, the region.")* |

The capabilities **stack** (operate in the valley → secure its roads → run its economy → hold an office in its
affairs → shield it → run all of it → anchor it) and the granters stay **HOUSE-side and climb** (Genemon → the
Lord), with the valley **acknowledging** rather than conferring — so the tier reads, start to finish, as **the
estate's domain expanding into the valley**, not as climbing village society. The **V7→T2 gate** is the
ESTATE-domain milestone ("clean your room"): estate healthy, valley anchored, fires out → the lord believes
wider impact is possible → **Region opens**. *(The **village reputation web** runs alongside all of this as a
parallel **optional** track — it can be fully completed and shaves ~10–15% off the climb, but it **never**
appears as a trigger above; §1.5.4, §2.15.)*

---

## 3.5 The navigation / screen-reveal track (the multi-screen shell, made explicit)

The UI shell **appears single-screen and grows into multi-screen navigation** (canon §H; §2.1b; §1.12). Because
this is the *signature* "UI as progression" feature, the nav chrome itself is laddered here as its own reveal
sequence (data: `RevealableEntry kind:'navLink'|'screen'`). It cross-cuts the tier ladders above.

| Nav / screen reveal | Trigger | What appears | Diegetic event-log line |
|---|---|---|---|
| **(none) — single column** | cold open → R1 | Just the event log + verb(s) + the two readouts. **No nav exists yet.** | *(no nav line — there is only one place to be)* |
| **First tab: "Skills"** | `RANK` R2 (Skills tab, §2.7) | The **first navigation appears** — the screen splits into *Work* + *Skills*. | *"You begin to notice you're getting better at this. (A way to track it appears.)"* |
| **"Combat" / "Yard" tab** | `RANK` R3 (Combat panel, §2.8) | A **Combat** nav node joins Work + Skills (drill yard, Bestiary, Equipment live under it). | *"There is fighting to track now, too."* |
| **"Map" screen** | `RANK` R6 (errands authorised) | The **first map screen** (the estate, with a road leading out) becomes a distinct navigable screen. | *"You can picture the land now — the estate, and a road past the gate."* |
| **"House" / Influence screen** | `RANK` R7 (four-bar panel, §2.16) | A dedicated **House** screen (the four pillars + the domain-ranking read, §2.18). | *"A page for the house itself — what it is becoming."* |
| **"Village" screen** | `RANK` V0 (T1 opens) | A **Village** screen (shop row, reputation web, inn) joins the nav. | *"A new page: Asagiri, and everyone in it."* |
| **"Region" screen** | `RANK` V7 / `STORY` T1→T2 | A **Region** screen (the cluster map, the post-town, the roads) joins the nav. | *"The map grows a page wider: the region."* |
| **"Ties" / Origin screen** | `STORY`+`PILLAR` T2-G2 Origin track opens (doubly-earned) | An **Origin / Ties** screen (the Sawatari-juku contacts + the **`O0→O5` Origin reputation ladder**, §3.6.2). | *"A page you didn't know you'd been missing: people who knew your name."* |
| **"Castle-town" screen** | `STORY` T2→T3 *(stub in v1)* | A **Castle-town** screen stub (the cliff-hanger first-contact). | *"A page opens onto stone walls and a magistrate's seal — and then the story pauses."* |

> **Responsive note (canon §H, §6.9):** on mobile the same nav reveals collapse into a bottom tab-bar / drawer
> that **grows the same number of entries in the same order** — **not** hover-dependent. The reveal *data* is
> shared; only the chrome differs (§6.9).

---

## 3.6 T2 — The estate's domain expands to the region (full; v1) — `G0 → G7` (a FRESH ladder)

> **What this tier IS (read this first).** Like T1, T2 is **not** "the region track" — it is the **HOUSE
> rising**, a **fresh per-tier rank ladder** (canon §C, §I) on which the Kurosawa estate's standing climbs from
> **TRUSTED → HONORARY MEMBER of the house** (you stop being merely the lord's reliable agent and become
> *family in all but blood* — the house's name spoken in the same breath as yours) and its **domain expands
> again** — from anchoring its own valley (T1) to the estate **effectively leading a region** (T2). Every rung
> is still a **rank within the house's theme**; at every rung you act **FOR THE ESTATE**, carrying its business,
> its arms, and its authority across **all three** scales at once: **the estate, the village, and the region**
> (a cluster of valleys, the post-town **Sawatari-juku**, the upstream **Kuzuhara** ruins, the roads &
> *sekisho*). Region figures — the post-town *toiya*, neighbouring headmen, the castle-town's distant officials,
> and the **rival samurai houses Tomita & Akagi** — **acknowledge, contend with, and finally cede to** the
> house's rise; they do not promote you — **the house does** (§3.6.1), and at the very top the castle-town
> authorities **confer regional leadership** and **invite the house in**. *(Carried forward: **T3** is the
> domain expanding **again — to the castle-town**; §3.7.1.)*

**THREE parallel reputation tracks (only one gates the tier):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `G0→G7` ladder below. Its milestones are the
  **gate to T3 / the castle-town** — completing them advances the tier (canon §"Reputation systems model"). Rising it raises
  **House Influence** and grows the estate's reach to **region** scale. Labour and combat keep interleaving at
  region scale; the four-pillar panel exists from T0-R7, and T2 drives **Office** to the fore (the "win it
  socially" steepening, §4.8.3). Estate standing climbs **trusted → HONORARY MEMBER of the house**.
- **(SIDE-TRACK A) Village reputation web — carried from T1, still OPTIONAL.** The Asagiri per-shop / per-family
  meters, the headman's **personal** regard, the inn/rumours web, and the **Tama-vs-farmhand allegiance**
  (§1.5.4, §2.15) persist as a fully-completable accelerant — it shaves **~10–15%** off time-to-T3 but
  **NEVER gates the spine**.
- **(SIDE-TRACK B) Origin reputation — NEW this tier (`O0→O5`; see §3.6.2).** Tahei's **living** origin
  community at **Sawatari-juku** is **upgraded from "discrete restored-ties milestones" to a proper one-tier
  standalone reputation side-track with its OWN rung ladder** (elaborates D-009 / canon §"Reputation systems
  model"). It **opens at G2** (doubly-earned: dream-memory **AND** travel-standing), is **optional, fully
  completable, an accelerant, narrative-only with ZERO mechanical gift**, and **NEVER gates the spine**. The
  **Tama-payoff** and the reunions land on *this* track.

> **Only the estate spine (the `G0→G7` rungs + their pillar milestones) gates T2→T3.** Village and Origin are
> both fully-completable optional side-tracks — ignoring either leaves you only poorer and lonelier, never
> walled (canon §"Reputation systems model").

Estate stage span: **E2 Recovering → early E3** (estate fabric runs *ahead* of top personal rank, on pillars +
a **low** rank floor — never the capstone; §1.5.1). **Required pillars drift** toward **Estate + Office** (Arms
secures roads). Ladder shape (LOCKED, §1.5.1 / §5 T2.2): the house's **valley-envoy → road-captain of the
cluster → broker of the post-town trade → arbiter between valleys → recognised regional retainer → captain of
the road-security detail → alliance-broker → leading house of the region** (the rivals dethroned).

| Rung | Trigger (rung gate) | What this rung REVEALS (fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **G0 — The house's valley-envoy** | `STORY` (T1→T2 quest; broker the estate's surplus beyond Asagiri) | The estate pushes its business past the valley — the **trade backbone** opens **minimally** (one route, one porter, one verb): friend **Kanta** runs the house's first consignment off the books (§1.7.1, the Kaidō Porters' & Transport Guild seed). **[RIVALS]** the names **Tomita** and **Akagi** harden from distant rumour into the region's **two incumbent samurai houses** — Tomita's agent **Yasubei** is already brokering the route you want. **[THREAD: Origin]** first origin contact made (the `O0→O5` track still closed). | *"You carry the house's surplus past the ridge — and find the road already worked. 'Tomita's man bought that consignment yesterday,' says a familiar face: Kanta. 'I'll run yours, for old times' sake.' One route. One load. (Why does his face ache to remember?)"* |
| **G1 — Road-captain of the cluster (for the house)** | `RANK` Combat Standing (secure the cluster's roads **in the estate's name**; first *sekisho* turn-back → obtain a pass under the house's seal) | The estate's writ reaches the **region's roads** — the ***sekisho* / pass-tier travel layer** (travel-standing made felt); **region-scale combat rings** (the pass; **ronin / bandits / smugglers** as grindable human mobs, §2.9); rumours of the **"one-eyed mountain god"** (= **Hanzaki** + fog-blind terrain) surface on the board. **[RIVALS]** the unsafe roads are partly **Tomita's** doing (their muscle-for-hire, often **Hanzaki**, lets rivals' caravans pass and harries the Kurosawa's). | *"The barrier-guard turns you back — then, seeing the Kurosawa seal, waves you through. The cluster's roads are the house's to keep now. The brigands who skip Tomita's wagons and hit yours whisper of a one-eyed god on the pass."* |
| **G2 — Broker of the post-town trade (the house's factor)** *(Origin track OPENS — §3.6.2)* | `STORY` + `PILLAR` (dream-gate returned enough memory **AND** travel-standing aligned — the **doubly-earned** gate) | **Sawatari-juku** post-town area opens; the **toiya** transport office registers **the estate** as a regional factor (the export ramp to T3); **the ORIGIN reputation side-track opens at `O0`** (§3.6.2) — the **Origin / Ties screen** (§3.5). **[RIVALS]** at the *toiya* the Kurosawa factor sits **below Tomita's** established berth and **outside Akagi's** old precedence — the regional pecking order is now visible and contestable. | *"You register the house's mon at the Sawatari-juku* toiya *— third behind Tomita and Akagi. Then the street stops: an old woman drops her basket. 'Tahei…?' The name lands like a stone in still water. Your own past opens."* |
| **G3 — Arbiter between valleys (for the house)** | `RANK` Estate Service (court / supply / arbitrate the two neighbouring valleys **on the estate's behalf**) | The estate's authority extends over **The Neighbouring Valleys** — **Hibara** + **Tōge-mura** (hard-capped at exactly two, §1.7.1), Asagiri fractally replicated, slimmer. **[RIVALS]** both valleys are **already courted by Tomita** (cheaper grain) and watched by **Akagi** (older ties); you win them by **out-supplying and out-arbitrating** — contested meters flip your way, **never by force** (canon §B). The two rivals can be **played against each other** (money vs precedence). | *"Two valleys, weighing the houses courting them. Tomita undercuts you on rice; Akagi sniffs that the Kurosawa are upstarts. You arbitrate, you supply, you out-give — and the valleys lean the house's way."* |
| **G4 — Recognised regional retainer of the house** | `STORY` (reach Kuzuhara with conditioning + standing; the house takes on a region-scale work) | The house's name attaches to **Kuzuhara** — the drowned upstream hamlet (the Kurosawa's own **root-sin**: ancestor Sadamune's neglected flood-works); a multi-stage **river-works (*seki*)** project (a LAND mega-lever); **resettlement** re-founds the hamlet as a region node; **the drowned are named** (grief-work + temple register — **not a rite**). **[RIVALS]** the works the rivals never bothered with become the region's proof the **Kurosawa** lead by *building*, not just trading. | *"The broken embankment; the empty houses underwater; Dowager Toku's shame made real. Neither Tomita nor Akagi ever touched it. You begin to raise the* seki *under the house's name — and to name the drowned."* |
| **G5 — Captain of the house's road-security detail** | `RANK` Combat Standing (break the brigand roost; secure the trade pass **for the region, in the house's name**) | The estate becomes the **region's shield** — a **hard-capped 2–3-man detail** (martial scale capped, canon §E; §2.17); escalating **Hanzaki** encounters (**survived, not won** — trained, never gifted); a **CLEAR/CAPTURE-with-mercy** branch (a famine-band can be fed/resettled, not killed). **[RIVALS]** breaking the roost cuts off **Tomita's** hired teeth — Hanzaki is exposed as their muscle, and securing the pass flips the region's safest road to the **Kurosawa's** wagons. | *"You and two others hold the pass for the house. Hanzaki — Tomita's hired edge — tests you, and you live: endurance, not talent. With the roost broken, the safe road is the Kurosawa's, not theirs."* |
| **G6 — The house's alliance-broker** *(personal threads RESOLVE — on the Origin track, §3.6.2)* | `STORY` + `PILLAR` (Office rising; the rivals' contest tips; the two personal threads land) | **[RIVALS]** the house brokers the region's alliances over the rivals' heads: **Akagi** is settled by *restoring its old precedence* (the proud line gets its honour back and stands with you), isolating **Tomita** commercially — the détente that sets up G7. **[THREAD: Tama] — PAYOFF (Origin `O5`):** the living, grown **Otsuru** is found — Tama was a **girl** who **ran**; the MC is **not** her (grounded + **partial**). **[THREAD: Origin] — PAYOFF:** the reunions complete (incl. father **Jinpachi**); **Tahei claims his true name** (a late, de-emphasised side beat). The Origin **pride/morale** buff lands (a *present-day relationship*, **ZERO retroactive gift**). | *"You broker the region's alliances over the rivals' heads — Akagi at your side, Tomita boxed in. And down-valley: she is real, and grown, and not you. 'Tama ran. Tama lived.' You have a name again: Tahei. You set it down quietly, and pick the house's work back up."* |
| **G7 — Leading house of the region** *(capstone bridge to T3 — stub; the rivals DETHRONED)* | `RANK` + `PILLAR` (**win the region**: Estate + Office thresholds met; the rivals **no longer the leaders**) | The estate-domain milestone: the **rival houses Tomita & Akagi are surpassed** (Akagi allied with restored precedence; **Tomita** out-competed into commercial détente — **never killed**, canon §B). The estate's standing is now **HONORARY MEMBER of the house**; the **region domain-ranking** read shows the Kurosawa **leading**; the castle-town rulers **confer regional leadership** and **invite** the house in; the **Castle-town screen STUB** (§3.5) appears as the **T3 cliff-hanger first-contact**. **Gate met → T3 (stub; the domain expands again, to the castle-town).** | *"The region's leading house is the Kurosawa now — Tomita and Akagi behind them. A messenger in finer cloth than you've seen: 'The castle-town confers the region on your house, and invites it in.' The page turns onto stone walls — and the story pauses here."* |

> **T2 honours the dream rule (binding):** returning memory grants **access only** (new nodes/allies/quests) and
> **ZERO mechanical bonus**; at least one Origin beat is always available **without** reputation-gating so the
> thread never stalls (§1.5.3, §5 T2.2). **Belief-creatures stay out of spawn tables** — the "one-eyed mountain
> god" is an **INVESTIGATE-then-confront one-shot** (Hanzaki + terrain), never a population (canon §E; §2.9,
> §2.13).

> **T2 deliberately withheld** (fractal discipline): **auto-producers** (T3+, §2.5 — Kuzuhara's first returnee
> producer is the *latest-game* exception); the **marriage / adoption** lever (T3+, §2.16.1); the castle-town
> *daikan*/*tedai* officialdom and inter-*han* markets (the T3 stub only teases them, §3.7.1). Folklore rumours
> keep unlocking **organically and per-tier** (§2.13) — never an all-at-once dump.

### 3.6.1 The earned-transition spine — *why* each promotion happens (T2)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1 / §3.4.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out across the region), an in-fiction **reason** (why the *house's
> domain* expands to region scale), and a **named granter** — and **the GRANTERS stay HOUSE-side and escalate**
> (chief steward **Genemon** → the **Lord Munenori** / heir **Naoyuki**), with the region's figures (the *toiya*,
> neighbouring headmen, the **rival houses Tomita & Akagi**) **acknowledging, contending with, and finally
> ceding to** the house — never conferring rank — until the **capstone**, where the **castle-town authorities**
> confer regional leadership and invite the house in (the T2→T3 gate). The throughline: **the estate's domain
> expands to region scale because you, its agent, deliver** — *the estate anchors its valley* (T1) becomes *the
> estate leads its region* (T2); standing **TRUSTED → HONORARY MEMBER of the house**.

| Promotion | Earned by (trigger) | Why the house grants it (its domain expands to region scale) | Granter |
|---|---|---|---|
| **G0 → G1** | Run the house's first surplus past the valley (Kanta's off-books route) **and** survive the region's roads where **Tomita's** brokers already operate | The house, having anchored its valley, must now **trade and travel at region scale** — but the roads are unsafe and the rivals already worked. A man who can carry its business and hold the cluster's roads is worth raising → it names him **road-captain** | Genemon *(the *toiya* and Tomita's agent **Yasubei** merely **note** the new Kurosawa man)* |
| **G1 → G2** | A **Combat-Standing** threshold — secure the cluster's roads in the estate's name; earn the first *sekisho* pass under the house's seal | The estate's writ can't reach the region while its caravans are turned back at the barriers and harried on the pass. Proving you can move the house freely and safely earns it a **factor's** standing at the post-town → it makes you its **broker** *(and the **doubly-earned** dream + travel-standing conjunction opens the Origin track, §3.6.2 — narrative-only, NOT a promotion trigger)* | Genemon (in the **Lord's** name) *(the **toiya** registers the house — third behind **Tomita & Akagi**)* |
| **G2 → G3** | An **Estate-Service** threshold — court, supply, and arbitrate **Hibara** + **Tōge-mura** on the house's behalf, out-supplying **Tomita** and out-precedence-ing **Akagi** | Region leadership means the neighbouring valleys lean on **your** house, not the rivals'. Winning them by giving more (never force) proves the estate can **govern beyond its own valley** → it makes you its **arbiter between valleys** | **Lord Munenori** *(the two valleys **lean** the house's way; the rivals **contest** but cede)* |
| **G3 → G4** | A **STORY** beat — reach Kuzuhara with conditioning + standing and commit the house to the multi-stage **river-works (*seki*)** the rivals never touched | A house that **builds** what others wouldn't — atoning for its own root-sin while re-founding a region node — earns recognition as a true regional retainer, not just a trader. The works are the region's proof the **Kurosawa lead by building** → the Lord recognises you as his **regional retainer** | **Lord Munenori** *(Dowager **Toku** and carpenter **Risuke** vouch; the region marks that **neither rival** did this)* |
| **G4 → G5** | A **Combat-Standing** threshold — break the brigand roost and secure the trade pass for the region, exposing **Hanzaki** as **Tomita's** hired teeth | The region now leans on the house for **safety**, not just supply. A house that **shields the region's roads** — and cuts off a rival's muscle doing it — needs a sworn captain → the Lord names you captain of its **road-security detail** (hard-capped, canon §E) | **Lord Munenori** + Genemon *(heir **Naoyuki** now turns from internal rival into **ally against Tomita**)* |
| **G5 → G6** | An **Office** (Standing) threshold **+** a **STORY** beat — broker the region's alliances over the rivals' heads: settle **Akagi** by restoring its precedence and isolate **Tomita** commercially | With supply, build, and arms all carrying the house's name, it can now **broker the region's alliances itself** — turning a proud rival into a partner and boxing in the other. You are the only agent who has run all of it → he makes you the house's **alliance-broker** *(the personal threads resolve in this same span — on the Origin track, §3.6.2 — narrative-only, NOT a trigger)* | **Lord Munenori** *(Akagi's **Gennai** allies; **Tomita's Sōzaemon** concedes ground)* |
| **G6 → G7** | The **tier gate** — **win the region**: Estate + Office thresholds met; **Tomita & Akagi no longer the leaders** (Akagi allied, Tomita out-competed into détente — never killed) | The estate-domain milestone: the rivals are **surpassed** and the Kurosawa are the region's **leading house**. The estate's standing is now **HONORARY MEMBER of the house**. Convinced the house *leads*, the **castle-town authorities confer regional leadership** and **invite the house in** → the **T2→T3 quest** opens; the domain must expand **again — to the castle-town** | **Lord Munenori** (house-side rank) *+ the **castle-town authorities** (confer regional leadership / invite the house in) — capstone: "the castle-town invites your house."* |

The capabilities **stack** (trade the region → secure its roads → broker its post-town → arbitrate its valleys
→ build its works → shield its roads → broker its alliances → lead it) and the granters stay **HOUSE-side and
climb** (Genemon → the Lord / Naoyuki), with the region (the *toiya*, the valleys, **Tomita & Akagi**)
**acknowledging, contending, and ceding** rather than conferring — until the **castle-town** confers regional
leadership at the top. So the tier reads, start to finish, as **the estate's domain expanding to the region**,
not as climbing region society. The **G6→G7 gate** is the ESTATE-domain milestone (**rivals dethroned; region
led**) → the castle-town invites the house in → **T3 opens**. *(The **village web** and the new **Origin track**
(§3.6.2) run alongside as **optional** accelerants — neither ever appears as a trigger above; canon
§"Reputation systems model".)*

### 3.6.2 SIDE-TRACK B — the Origin reputation ladder (`O0 → O5`, a one-tier standalone track)

> **What this is.** Tahei's **living** origin community at **Sawatari-juku** — **upgraded** from D-009's
> "discrete restored-ties milestones" to a **proper one-tier standalone reputation side-track with its OWN rung
> ladder** (canon §"Reputation systems model"). It mirrors how T1's village web is a parallel side-track, but
> shaped as a **short laddered arc** (the reunion *is* a sequence) rather than a multi-node web. **Prefix `O`**
> (Origin) — distinct from the estate rung scheme `R/V/G/C/E` *and* the estate physical stages `E0–E5`.

**Hard rules (binding, canon §C / §"Reputation systems model").** The Origin track is **OPTIONAL, fully
completable, an accelerant, narrative-only with ZERO mechanical gift**, and **NEVER gates the spine** (it is not
a trigger anywhere in §3.6.1). It is **deliberately LIGHT** (6 rungs, not 8 — it must never read as a second
spine). It **opens at G2** on the **doubly-earned** gate (**STORY** — the dream returned enough memory — **AND**
**PILLAR** — travel-standing to walk the checkpointed *kaidō*; §1.5.3, F11). The Origin "pride/morale" buff is
framed as a **present-day relationship** ("a man with people behind him works harder"), **never a retroactive
gift from remembering**; **at least one Origin beat is always available without rep-gating** so the thread never
stalls. The **Tama-payoff** (Otsuru) and **Tahei claiming his true name** land on this track's capstone.

| Origin rung | Earned by (trigger — own meter: **Origin Ties**) | Beat | Diegetic event-log line |
|---|---|---|---|
| **O0 — Recognised at Sawatari-juku** | `STORY` + `PILLAR` (the **doubly-earned** G2 gate: dream-memory **AND** travel-standing) | The track **opens**: the old woman in the street names "Tahei"; the post-town's people half-remember a vanished porter-boy. The **Origin / Ties screen** lights (§3.5). | *"An old woman drops her basket. 'Tahei…?' The street remembers a boy who never came home. A page opens onto people who knew your name."* |
| **O1 — The household reopens** | `RANK` Origin Ties (return often enough to be let back over the threshold) | Mother **Oyuki** (the emotional core) and sister **Okimi** take him back in — grieved-as-lost, now home. Earned and a little costly. | *"Oyuki's hands stop at the loom. 'You're thin.' She feeds you anyway. Okimi just cries, then scolds. You are, somehow, home."* |
| **O2 — The old trade welcomes him** | `RANK` Origin Ties (work a few honest runs with the old crew) | Old employer **Master Denbei** and the **porter guild** take his hand again; friend **Kanta** (met at G0) is rekindled comic-warm. The porter's-knot is just *how the men here tie loads* — **ZERO bonus**, confirmed mundane. | *"Denbei grunts: 'Still tie a load like my house taught you.' The guild makes room. Kanta's already laughing. (The knot was never a secret — just home.)"* |
| **O3 — The half-remembered tie** | `RANK` Origin Ties (a gentle, optional thread the dream surfaces) | Sweetheart **Osen** — half-remembered, gentle, **narrative-only** (no dating-sim). Optional even within this optional track. | *"Osen, at the well, doesn't run. 'I waited a while. Then I stopped.' Neither of you knows what's left — only that it's not nothing."* |
| **O4 — The father returns** | `RANK` Origin Ties (the deepest tie; opens late on the track) | Father **Jinpachi** — grieved as away/lost — returns. A **clean, warm, un-stacked** reunion (NOT a third debt-bondage arc; the source of the porter's-knot lineage, **ZERO bonus**). Optional later T4 callback. | *"Jinpachi, older, leaner: 'They said the pass took you.' A long silence. Then: 'Tie off that load properly, boy.' It is the most he can say, and it is everything."* |
| **O5 — His name set down** *(capstone — lands at G6; the Tama-payoff)* | `RANK` Origin Ties (the track completes; coincides with the G6 spine beat) | **[THREAD: Tama] — PAYOFF:** the living, grown **Otsuru** is found — Tama was a **girl** who **ran**; the MC is **not** her (grounded + **partial** — she may not forgive; she is freed to choose). **Tahei claims his true name** (a late, de-emphasised side beat). The Origin **pride/morale** buff lands (present-day relationship; **ZERO retroactive gift**). | *"She is real, and grown, and not you. 'Tama ran. Tama lived.' And you have a name again: Tahei. You set it down quietly — and pick your work back up."* |

> **Why `O0→O5` and not `O0→O7`:** the Origin track is a **support arc, not a frontier** — a short reunion
> sequence, kept light so it never competes with the estate spine for the player's attention or reads as a
> second main quest (canon §C, lean discipline). It runs **entirely inside T2** (G2 → G6), is fully completable,
> and shaves a felt-but-small slice off the climb (folded into the ~10–15% side-faction speedup, §1.5.4) —
> **never required, never a wall.**

---

## 3.7 T3 / T4 — sketched ladders (forward; stub + roadmap)

Per v1 scope (canon §I), **T3 is a stub cliff-hanger** and **T4 is a roadmap**. Their fresh ladders are
**scoped forward** here — *shape only*, not authored rung-copy — so the per-tier-ladder motion is legible and so
the later reveals (**auto-producers**, the **marriage/adoption lever**, the **national *banzuke***) have an
explicit home. Full authoring deferred.

> **Same spine, two more frontiers (canon §"Reputation systems model").** T3/T4 carry the **same model as
> T0–T2**: the **estate's domain expands again** — **+ the castle-town** (T3), then **+ Edo / national** (T4) —
> and **every rung stays in the house's theme** (the house becoming a castle-town power, then a
> nationally-ranked house — **NOT** the MC climbing castle-town / Edo society; the castle-town & Edo figures
> **acknowledge, contend with, and cede**, and **only the estate spine gates tiers**). The **estate-rep arc
> continues**: **honorary member** (entering T3) **→ chief steward / *yōnin*** (T3 — the MC's personal
> **CEILING**) **→ T4: the MC STAYS *yōnin*; the arc shifts to the HOUSE's national standing** — the
> indirect / mediated Edo ceiling, the *house* ranked, never a personal *hatamoto* / shogunal rise (canon
> §F / §I, D-010).

### 3.7.1 T3 — The estate's domain expands to the castle-town (stub; `C0 → C7`, forward)

> **What this tier IS (sketch).** Like T1/T2, T3 is **not** "the castle-town track" — it is the **HOUSE
> rising**, a **fresh per-tier ladder** on which the Kurosawa estate's **domain expands again** (from leading
> its region in T2 to the house **becoming a castle-town power that holds key domain offices** in T3), and the
> MC's estate standing climbs **HONORARY MEMBER → chief steward / *yōnin*** (his **personal CEILING**, canon
> §I). Every rung stays **in the house's theme**; the castle-town's figures (the *daikan* / *tedai*
> officialdom, the rival merchant houses) **acknowledge, contend with, and finally cede to** the house — they
> do not promote you; **the house does**. *(Carried forward: **T4** is the domain expanding **again — to Edo /
> the nation**, where the MC **stays *yōnin*** and the arc becomes the **HOUSE's**; §3.7.2.)*

Required pillars drift to **Office + Name dominant** (the takeover is **won socially**; Arms/Estate as
leverage). **MULTI-ROUTE takeover** (peaceful: office / economy / **marriage** / out-maneuvering rivals; AND
assertive: martial-security leverage) — "take over" = becoming the **dominant house holding key domain
offices**, **never rebellion** (canon §B).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **C0 — The house's envoy at the castle-town gate** | The **Castle-town map / screen** proper (beyond the T2 stub); the *daikan* / *tedai* officialdom layer the house must now operate within. | `STORY` T2→T3 (the house forced / invited in) |
| **C1–C2 — The house's office-seeker & inter-*han* factor** | **AUTO-PRODUCERS first appear** (§2.5, T3+ ONLY) — seconded / recruited helpers as **light roster cards** trickling a resource (no assignment panel, ever); inter-*han* market rows as the house pushes its trade to castle scale. | `PILLAR` Office + `RANK` |
| **C3–C4 — The house holds a minor domain office** | **Jobs-as-offices at castle scale**; the **debt-restructuring / *goyōkin* TREASURY mega-lever** (Marutaya / *fudasashi* network, §1.7.1). | `PILLAR` Office |
| **C5 — The house's alliance-maker** | **THE MARRIAGE / ADOPTION lever** (§2.16.1, T3+ ONLY) — a brokered **Standing & Office + Name & Honour** one-time jump and a **takeover route** for the house (NOT a relationship sim). | `STORY` + `PILLAR` Name |
| **C6 — The house eclipses its rivals** | The **antagonist Tedai Kuroiwa** ("the gracious door") arc; the racket's nerve-centre (the *Daikan's* Office, §1.7.1) out-maneuvered — **never rebellion** (canon §B). | `STORY` |
| **C7 — The dominant house of the castle-town; the MC made chief steward / *yōnin*** *(bridge to T4)* | The **domain *banzuke*** shows the house atop the castle-town (holding the key offices); the MC's estate standing reaches its **CEILING — chief steward / *yōnin*** (canon §I); the **T3→T4 "taste of Edo"** (the house called to staff & run the *domain's* Edo establishment — the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own). | `RANK` + `PILLAR` |

> **T3 side-tracks (forward — sketch only):** the **village web** (T1) and the **Origin track** (T2) persist as
> fully-completable optional accelerants (never gating). T3 *may* seed a **new optional castle-town side-track**
> (a merchant / official rep web — e.g. the Marutaya factor or a *tedai* contact) — **forward note only, never a
> gate**; full authoring deferred with the tier.

### 3.7.2 T4 — The HOUSE's standing expands to the national stage (roadmap; `E0 → E7`, forward)

> **Note — label namespace:** these `E#` are **Edo rung labels** (the R/V/G/C/E per-tier rung scheme),
> distinct from the estate physical **stages** `E0–E5` (Foreclosure's Edge → Restored) used in
> §3.2/§3.3/§4.7.5. Context disambiguates; a rename candidate if T4 is ever fully authored.

> **What this tier IS (sketch).** T4 is the **same spine, last frontier** — the estate's **domain expands to the
> national stage** — **but the arc is now the HOUSE's, not the man's.** The MC **stays *yōnin*** (his ceiling,
> reached at T3); what climbs at T4 is the **HOUSE's national standing**, recognised **indirectly / mediated**
> through the Edo conduit — the *house* is ranked on the national *banzuke*, **never** a personal *hatamoto* /
> shogunal rise (the indirect Edo ceiling; canon §F / §I, D-010). The capital's figures (the rusui's
> counterparts, the *fudasashi*, a touring inspector) **acknowledge and rank** the house; the MC remains its
> **architect**, off-stage from any shogunal audience.

Required pillars: **Name + Office** (the **national *banzuke*** on all four pillars). The **indirect/mediated
ceiling** holds — the **HOUSE** is recognised; the MC's personal ceiling stays **chief steward / *yōnin***
(no *hatamoto* / shogunal audience; canon §F, §I; §2.18).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **E0–E2 — The *domain's* Edo *yashiki* conduit (worked by the house)** | The **Edo screen / map** (one cluster); the **rusui Konoe** + the **daimyō's** *sankin-kōtai* mediated conduit (§1.7.1) — the house reaches the capital **through** the domain's rusui, **staffing the domain's establishment (never its own)**; the MC works the conduit, never attends a shogunal audience (the indirect ceiling). | `STORY` T3→T4 |
| **E3–E5 — The house's national trade & finance reach** | The **Osaka / Edo *fudasashi*** top of the finance network; the full silk *meibutsu* prestige payload carries the house's name to the capital (still trade ≤⅓). | `PILLAR` |
| **E6 — The touring-inspector set-piece** | The impartial-test antagonist beat; the **HOUSE's Name & Honour** climax via an inspector's national report. | `STORY` |
| **E7 — The HOUSE ranked at the capital** *(authored ending)* | **THE NATIONAL *MITATE* / PARODY *BANZUKE*** broadsheet (§2.18) — sumo-rank vocabulary: **Maegashira / Komusubi** attainable band, **Ōzeki / Yokozuna** the **structurally sealed top**; the **house** climbs from "the chart that omits you" into the attainable band (the MC stays *yōnin* — its architect, never personally ennobled); **post-game free-play, NO reset**; defend-the-spot on the biennial heartbeat (recoverable, **never a decay-tax**). | `PILLAR` Name + Office |

> **The whole ladder is the same motion, five times:** arrive minimal → the world fades in one panel/area/system
> at a time, each a logged plot beat → the canvas and the numbers enlarge together → a fresh ladder is minted for
> the next, larger frontier. **No reset, ever** (canon §B).

---

## 3.8 Cross-references & deferrals

- **Numbers → §4** (combat/progression/balance): every rung threshold, pillar threshold, conversion weight, cost
  curve, soft-stamina rate, market-saturation rate, and the **K/M/B** formatting rules are deferred. §3 fixes the
  **order and the triggers' kinds**, never the values.
- **Final log-line wording → §5 authenticity pass** (macron romanization). The **Standing & Office** pillar's
  kanji is now RESOLVED = **官威 (*kan'i*)** (2026-06-25). §3 fixes the **substance** of each `revealLogLineId`;
  copy may be polished.
- **Data shapes → §2 / §6:** every reveal is a `RevealableEntry` with a pure `unlockPredicate` over `GameState`,
  fired via the `process_rewards` bus as one event (§2.1, §6.3); the renderer does one `render(state)`
  reconciliation showing only unlocked entries (§6.9); every reveal is **headlessly regression-testable** via
  the DEV play API (`window.__qa`, §2.20, §6.10) — the unlock ladder is a generated/verifiable table (§6.6).

## 3.9 Items flagged for the human (review checklist)

> **Status (human-reviewed 2026-06-25):** items 2–5 RESOLVED; item 1 remains a routine confirm. Resolutions
> folded into the ladder above.

1. **The trigger *mix* per tier is an authored pacing choice (numbers → §4).** §3 assigns each reveal a trigger
   *kind* (RANK / PILLAR / STORY / FIRST-USE). Whether, e.g., R7 should gate on **PILLAR (Arms+Estate)** vs
   **pure RANK** — and the exact thresholds — is deferred to §4; confirm the *kinds* read right (esp. R7, V4,
   V7, G2, G6, G7, which mix RANK + PILLAR + STORY). *(Routine — leave for the §4 review.)*
2. ~~**Navigation-reveal granularity (§3.5).**~~ **RESOLVED:** **one nav entry at a time** (first tab at R2) is
   the locked grain — the signature progressive-reveal feel.
3. ~~**R5 bundles four things.**~~ **RESOLVED:** R5 **de-densified** — simple Crafting + the loot→craft loop moved
   **up to R4**; the first combat-earned **Arms standing record** moved **down to R6**; R5 now reveals only the
   **Quest log + the four quest types** (Arms deeds *begin* at R5). Each rung reveals less (one-at-a-time grain).
4. ~~**T2-G2 double-gate (Origin opens).**~~ **RESOLVED:** **BOTH** conditions required — STORY (dream returned
   enough memory) **AND** PILLAR (travel-standing) — so the warmest payoff stays doubly earned (per §1.5.3).
5. ~~**T3/T4 late first-reveal placement.**~~ **RESOLVED (confirmed as sketched):** **auto-producers at T3-C1**,
   the **marriage/adoption lever at T3-C5**, the **national *banzuke* at T4-E7**. Full rung-copy deferred with T3/T4.


---

# §4 — Combat, Progression & Balance Model

> **STATUS: DRAFT — awaiting human review.** Nothing here is locked until reviewed with the human and
> recorded as an ADR in [`../history/decisions.md`](../history/decisions.md). This section is authored
> end-to-end from the LOCKED CANON
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md),
> incl. all three "Updated 2026-06-25" header blocks) and the drafted PRD §§1, 2, 6.
>
> **⚠️ ALL NUMBERS IN THIS SECTION ARE TAGGED `proposed v1 balance — for human review` EXCEPT the
> pacing SHAPE the human signed off on** (saga length / per-tier hour budget / per-rank ≥30-min floor /
> first-fight win-rate / soft-setback severity / deeds-dominate split / no-respec), which are tagged
> **`LOCKED by human 2026-06-25`** (canon §I-bal). Everything else is a *coherent first-pass*, chosen so the
> whole curve is self-consistent and the locked pacing targets (§4.8) hold; **every proposed number is a
> lever, tunable later** without touching architecture. Per canon §H + §6.4, every value lives in
> `core/content/balance.ts` (the single home for tunables) and derived numbers reflow with **no save
> migration**. The shapes (data types, accrual modes, the trade ≤⅓ invariant, no-floor/overflow gating, no
> labour→combat cross-feed) are **canon and NOT tunable**; only the magnitudes are.
>
> **REBALANCE NOTE (2026-06-25).** This draft was rewritten to honour the human-signed **§4 BALANCE LOCKS**
> (canon §I-bal): **LONGER saga** (v1 T0–T2 ≈ **28.5 h**: T0 ≈ 4.5 h, T1 ≈ 8 h, T2 ≈ 16 h), a **per-rank
> ≈30-min floor**, **deeds dominate accrual** (≈70 % deeds / ≈30 % seasonal), and **smaller/steadier
> deed jumps** (per-event cap dropped 0.08 → **0.04**). The whole curve below is derived **backward** from
> the per-rank time floor + the per-tier hour budget (see the **§4.8 rank-by-rank pacing table**, the new
> centrepiece). The old "leave T0 in ~45–75 min, v1 ~12–20 h" targets are **superseded.**

## How to read this section

This is where the **parked balance numbers** from §§1–2 finally land. Each subsection states the **shape**
(canon, fixed), then a **proposed v1 number set** (tunable), then the **levers** to turn during tuning.
Units throughout: **koku** (rice, base currency), **coin/mon** (trade currency), **House Influence** in
abstract **Influence points (ip)** per pillar, displayed with **K/M/B** abbreviation (canon §H — not
scientific, not myriad units). One **tick** = the atomic active-play time-step; **1 action ≈ 1–4 ticks**;
**1 day ≈ 200 ticks**; **1 season ≈ 30 days ≈ 6,000 ticks**; **1 year = 4 seasons = 120 days** (abstract,
active-only — §2.2). These tick/day mappings are themselves levers.

**Wall-clock anchor (NEW — required by the locked time budget).** Because the saga length and the
per-rank ≥30-min floor are now *locked in real minutes*, the balance must commit a **wall-clock ⇄ game-time
binding**: at the intended active-play pace, **1 season ≈ 34 min of real play** in T0 (so T0's ~8 seasons
span its ~4.5 h), stretching to **~60 min/season in T1** and **~120 min/season in T2** (the player does more
*per* season as the world enlarges, not more seasons). This binding is what lets the §4.8 pacing table be
read in minutes. The binding itself is a **lever** (`SEASON_WALLCLOCK_MIN[tier]`), but the *targets* it
serves (≥30 min/rank; 4.5/8/16 h tiers) are **LOCKED by human 2026-06-25**.

---

## §4.0 The number spine — magnitudes per tier (the master scale)

Everything below hangs off one **per-tier magnitude band** so K/M/B abbreviation reads naturally and "the
next goal never balloons > ~2–3× the prior" (canon §G / §1.2 pillar 3 / pacing §4.8). The house's
**total resource & Influence magnitudes** grow ~**one order of magnitude per tier** (≈10×), but **within a
tier** every individual step is a gentle **~1.15× geometric** so no single jump feels like a wall.

> **T0 koku band reconciled (2026-06-25 fix).** The T0 lifetime-produced band reads **~21K** to match the
> §4.8.1 rung-by-rung sum exactly (R1…R7 = 0.75K+1.05K+1.2K+2.1K+3.2K+4.95K+8.25K = **21.5K ≈ 21K**); the two
> figures are now the same round number.

**Rebalanced for the LONGER saga (canon §I-bal).** "More grind, more numbers" means the *koku* bands are
**wider** than the old draft (you produce far more over a 4.5-h tier than over a 45-min one), while the
**Influence-per-pillar** bands stay close to the old gate magnitudes — Influence is the *slow, judged*
measure, deliberately lagging the raw resource counters. The widened *koku* bands below come straight out of
the §4.8 throughput model (end-T0 *lifetime-produced* koku ≈ 21K; end-T0 *held* koku ≈ a few K).

| Tier | koku band (lifetime-produced → held) | Influence-per-pillar band (display) | Typical single number the player sees |
|---|---|---|---|
| **T0 Estate** | tens → ~**21K** produced (~**3–5K** held) | 0 → ~**1K** ip | "**3.4K koku**", "**Arms 0.5K**" |
| **T1 Village** | ~10K → ~**250K** produced | ~0.5K → ~**10K** ip | "**42K koku**", "**Estate 8K**" |
| **T2 Region** | ~100K → low **M** | ~5K → ~**80K** ip | "**1.8M koku**", "**Office 50K**" |
| **T3 Castle-town** *(stub)* | low **M** → ~**100M** | ~50K → ~**900K** ip | "**240M koku**", "**Name 900K**" |
| **T4 Edo** *(roadmap)* | ~100M → low **B** | ~1M → ~**12M** ip | "**3.4B koku**", "**Name 11M**" |

**Lever:** the **per-tier multiplier `TIER_MAG = 10`** (the order-of-magnitude step) and the
**intra-tier growth `r_intra = 1.15`** are the two master dials. The Influence bands still step ~**10×**
for Arms/Estate; the **Standing & Office** band steps **harder** (≈10× → ≈25× at the T1→T2 boundary) by
design, because the required-pillar gate **drifts** from "survive/get strong" to "win it socially" (§4.1).
**v1 only ships T0–T2** fully (T3 stub, T4 roadmap), so only the first three bands are load-bearing for
launch tuning. Note: lengthening the saga was done by **stretching wall-clock-per-rung** (the ≥30-min floor)
and **fattening the *koku* counters**, *not* by inflating `TIER_MAG` — the chapter-break feel of ~10× is
preserved (canon §I-bal: "a slower release of incremental features," not bigger walls).

---

## §4.1 Per-tier REQUIRED-PILLAR thresholds (SIMPLE bands — NO floor/overflow)

**Shape (canon §D, §1.6.3, §2.16 — fixed).** Tier-up requires **(1)** the named **required pillar(s)** for
that tier to each independently clear a **single stated threshold**, **AND (2)** the per-tier **transition
story gate**. There is **NO** global floor across all four pillars, **NO** overflow/substitution arithmetic
(that formula is REJECTED). The required pillars **drift** per tier (early = Arms+Estate; upper = Office+Name).
The only structural cap that survives is **trade ≤⅓ of Estate & Wealth** (§4.2.3) — so trade can never carry
a gate. Each threshold is a **flat ip number on that pillar's `value`** (a simple `value ≥ threshold` check);
no weighting between pillars, no product, no sum.

**Proposed v1 thresholds** *(proposed v1 balance — for human review; magnitudes re-derived so each gate's
required-pillar total = the deeds + seasonal accrual the §4.8 pacing table actually delivers over that tier)*:

| Tier-up | Required pillar thresholds (each independent, simple `≥`) | Story gate (also required — §1.6.3) |
|---|---|---|
| **T0 → T1** | **Arms ≥ 0.5K** ip · **Estate ≥ 0.8K** ip | humbling first fight survived; first *shinden* begun; kura solvent; basic repairs done |
| **T1 → T2** | **Arms ≥ 5K** · **Estate ≥ 8K** · **Office ≥ 2K** | "clean your room" — estate healthy, village happy, immediate fires out |
| **T2 → T3** *(v1 end-gate)* | **Estate ≥ 60K** · **Office ≥ 50K** · **Arms ≥ 30K** | win the region (rival houses Tomita & Akagi no longer the leaders) |
| **T3 → T4** *(stub)* | **Office ≥ 600K** · **Name ≥ 500K** | win the castle-town socially; rulers confer leadership & invite the house in |
| **T4 (national rank)** *(roadmap)* | **Name ≥ 6M** · **Office ≥ 5M** | the national *banzuke* ranking on all four pillars |

> **Why the threshold *magnitudes* survived the rebalance.** The locked saga-lengthening was applied to
> **wall-clock per rung** (the ≥30-min floor) and to the *koku* counters, **not** to the Influence gates —
> so these ip thresholds are unchanged from the first pass. What changed is **how the player reaches them**:
> with deeds now ≈70 % of growth and the per-deed cap halved (0.08 → 0.04), the **0.8K Estate** gate is now
> the sum of **30 small deeds (≤32 ip each) summing to 560 ip + 8 seasonal high-water hits summing to 240 ip**
> spread over ~4.5 h, not a handful of spikes (full derivation in §4.2.1 / §4.2.2 / §4.8). The *texture* is
> grindier; the *destination* is the same number.

**Reading the drift:** Arms+Estate dominate the T0/T1 gates ("survive and get strong"); Office enters as a
*required* gate at T1→T2 and rises; by T3→T4 the gate is **Office+Name** ("win it socially"). A pillar that
is *not named* for a given tier is **never** a gate for it (you can advance with that pillar low) — this is
the whole point of "simple thresholds, no floor." Each threshold sits at roughly **the top of the prior
tier's band** (§4.0): T0→T1 is ~**10×** T0's start; T1→T2 keeps ~**6–10×** on Arms/Estate but the **Office
gate steps ~25×** (2K → 50K) — the deliberate "win it socially" steepening, NOT a violation of the
within-tier ≤2–3× rule (that rule binds *consecutive within-tier goals*, never the chapter-break tier step).

**Levers:** the **5 threshold rows above** (15 numbers total, only the first 3 rows ship in v1). Tune each
independently against playtest time-to-tier (§4.8). Keeping a gate's required-pillar **threshold ≈ band-top**
of that tier is the design invariant; the absolute values are free. The **per-tier hour budget each gate
must take to fill** (T0 ≈ 4.5 h, T1 ≈ 8 h, T2 ≈ 16 h) is **LOCKED by human 2026-06-25** — retune yields, not
these thresholds, if a playtest time-to-tier drifts.

---

## §4.2 The four-pillar ACCRUAL model

**Shape (canon §D, §1.6.2, §2.16 — fixed).** Influence accrues in **exactly two shapes — never a passive
time-trickle, never a flat per-action increment**:

- **(A) Achievement JUMPS** — a concrete deed *recognized* by the relevant authority, **per-event capped**.
  **(PRIMARY growth driver — ≈70 % of each pillar's growth; LOCKED by human 2026-06-25 as "more from deeds.")**
- **(B) Periodic JUDGED RESULTS** — fired **every season** (4×/year; autumn harvest the headline), raising a
  pillar **only on a new high-water mark** (never repeatable maintenance). **(SMALLER top-up — ≈30 % of each
  pillar's growth; the appraisal seasons your deeds, it doesn't carry the tier.)**

**The accrual split is LOCKED by human 2026-06-25:** **deeds ≈⅔–¾ (we use 70 %)**, **seasonal ≈¼–⅓ (30 %)**
of every pillar's growth toward its gate. This replaces the old draft's "~⅓–½ from seasonal." The split is a
*design target*, realised by sizing the deed inventory (§4.2.1) and the seasonal `JUDGE_K` (§4.2.2) so the
two streams add to the §4.1 gate in that ratio; the **exact 70/30** is a tunable *(proposed)* realisation of
the locked "deeds dominate" shape.

Up-only, with small scripted **per-pillar recoverable dents** (§4.2.4). The **trade ≤⅓** cap is a hard
invariant (§4.2.3).

### §4.2.1 Achievement JUMPS — concrete values + per-event caps

A jump fires when a recognized deed completes (a recorded yield, a granted title, a sealed contract, a road
declared safe in the books, a won petition, a nest cleared, the grain store defended). Each deed carries a
**base jump value** and is subject to a **per-event cap** = a fraction of the *current tier's pillar band*,
so **no single fight or harvest spikes a pillar** (§2.7/§2.16 per-event-cap discipline). Formula:

```
jump = min( deedBaseValue, PER_EVENT_CAP_FRACTION * tierPillarBandTop(pillar, currentTier) )
```

*(proposed v1 balance — for human review)* — **`PER_EVENT_CAP_FRACTION = 0.04`** (one deed can move a pillar
at most ~**4 %** of the way across its tier band). **This is HALF the old draft's `0.08`** — the change is
mandated by canon §I-bal **"deed-jump size = SMALLER / STEADIER (grindier)"**: growth is the sum of *many
small acts*, never a few spikes. The per-deed cap is computed against **that pillar's own band-top for the
current tier** (= its §4.1 gate threshold): T0 Estate cap = 0.04·0.8K = **32 ip**, T0 Arms = 0.04·0.5K =
**20 ip**, T1 Office = 0.04·2K = **80 ip**, T2 Arms = 0.04·30K = **1.2K**, T2 Office = 0.04·50K = **2K**, etc.
**Every deed base in the table below now sits at or under its own pillar/tier cap** (the rightmost column lists
each cap; a handful of intentional *at-cap* anchors — the DEFEND deed, the top road/alliance deeds — are
labelled *(cap)*). So **the cap virtually never silently clamps** a deed: bases were tuned *down* to fit under
the cap rather than being clamped by it — the texture is *quantity of small deeds*, not a clamp on big ones.
Representative **deed base values**, scaled by tier band (§4.0) and re-tuned **downward** so the per-deed
contribution is small and a full tier needs **dozens** of deeds:

| Deed class | Pillar | T0 base | T1 base | T2 base | per-deed cap (0.04·band-top) |
|---|---|---|---|---|---|
| Minor clear (boar/monkey nest) | Arms | 8 | 70 | 700 | T0 20 · T1 200 · T2 1.2K |
| Road/ford declared safe (in the books) | Arms | 18 | 150 | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| Grain-store / valley defended (DEFEND quest) | Arms | 20 *(cap)* | 200 *(cap)* | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| First *shinden* plot recorded | Estate | 30 | — | — | T0 32 |
| Recorded seasonal yield milestone | Estate | 16 | 130 | 1.3K | T0 32 · T1 320 · T2 2.4K |
| Debt tranche cleared → solvency step | Estate | 26 | 200 | 2K | T0 32 · T1 320 · T2 2.4K |
| Sealed trade contract *(TRADE strand — ≤⅓ capped)* | Estate(trade) | 12 | 90 | 900 | T0 32 · T1 320 · T2 2.4K |
| Office granted / bailiff duty / dispute arbitrated | Office | — | 60 | 1.3K | T1 80 · T2 2K |
| Valley allied / rival eclipsed | Office | — | 80 *(cap)* | 2K *(cap)* | T1 80 · T2 2K |
| Lord's recognition / off foreclosure list | Name | 20 | 160 | 1.6K | T0 40 · T1 400 · T2 3.2K |
| Sponsored rite / inspector's favourable report | Name | — | 180 | 1.8K | T0 40 · T1 400 · T2 3.2K |

**Deed-count sanity — the itemizations that PROVE the 70 % share (corrected 2026-06-25).** Each gate pillar's
deed inventory below sums **exactly** to 70 % of that pillar's §4.1 gate, within ~20–35 recognised deeds, every
base ≤ its cap. (The earlier draft's T0 itemizations summed to only ~61 %; these are the corrected figures.)

**T0 — gate 70 % = 560 ip Estate / 350 ip Arms:**
- **Estate (560 ip, 30 deeds):** 1 *shinden* (30) + 14 yield milestones (14×16 = 224) + 9 solvency steps
  (9×26 = 234) + 6 trade contracts (6×12 = 72) = **30 + 224 + 234 + 72 = 560** ✔. (Trade = 72 ip = **12.9 %**
  of the Estate deed-ip — comfortably under the ≤⅓ cap, §4.2.3.)
- **Arms (350 ip, 30 deeds):** 20 minor clears (20×8 = 160) + 5 road-clears (5×18 = 90) + 5 defends
  (5×20 = 100) = **160 + 90 + 100 = 350** ✔.
- **Cadence:** ~30 Estate + ~30 Arms = **~56–60 total recognised deeds** across T0's ~4.5 h ≈ **one act every
  ~4.5–5 min** (≈9–10 min *per individual pillar*).

**T1 — gate 70 % = 5,600 ip Estate / 3,500 Arms / 1,400 Office:**
- **Estate (5,600, 35 deeds):** 9 yield (9×130 = 1,170) + 19 solvency (19×200 = 3,800) + 7 trade
  (7×90 = 630) = **5,600** ✔ (trade 11.25 %).
- **Arms (3,500, 35 deeds):** 25 minor (25×70 = 1,750) + 5 road (5×150 = 750) + 5 defend (5×200 = 1,000) =
  **3,500** ✔.
- **Office (1,400, 20 deeds):** 10 granted (10×60 = 600) + 10 allied (10×80 = 800) = **1,400** ✔.

**T2 — gate 70 % = 42,000 ip Estate / 21,000 Arms / 35,000 Office:**
- **Estate (42,000, 31 deeds):** 16 yield (16×1.3K = 20,800) + 7 solvency (7×2K = 14,000) + 8 trade
  (8×900 = 7,200) = **42,000** ✔ (trade 17.1 %).
- **Arms (21,000, 20 deeds):** 6 minor (6×700 = 4,200) + 7 road (7×1.2K = 8,400) + 7 defend (7×1.2K = 8,400) =
  **21,000** ✔.
- **Office (35,000, 21 deeds):** 10 granted (10×1.3K = 13,000) + 11 allied (11×2K = 22,000) = **35,000** ✔.

Every line above sums to exactly **70 %** of its gate (the residual **30 %** comes from the seasonal stream,
§4.2.2). That cadence — a small recognised act every few minutes — *is* the "more grind, more numbers" texture
the human locked.

**Levers:** `PER_EVENT_CAP_FRACTION` *(now 0.04 — proposed; the **direction** "smaller than 0.08" is LOCKED
by human 2026-06-25)*; each deed's per-tier base value; the deed→tier scaling (here ~**9–10×** per tier
within a deed class, ≈`TIER_MAG`, with the seasonal stream supplying the residual 30 %).

### §4.2.2 Seasonal JUDGED RESULT — the per-season formula (fires every season; high-water-mark only)

**Shape (canon — fixed).** Every season the scheduler (§2.2/§6.3 per-season hook) computes a **judged score**
per pillar from *accumulated state*, and **raises the pillar only if the score exceeds its stored
`highWater`** — then sets the pillar to that new score (Δ = newScore − highWater) and records the new
high-water mark. If the score does **not** beat the high-water mark, **nothing accrues** (no maintenance
trickle). Autumn is the headline (harvest), but **all four pillars are appraised every season**.

```
// 1. Read the pillar's raw judged basis from accumulated state (domain-specific, any scale).
rawBasis = b_pillar(accumulatedState)
// 2. NORMALIZE by the tier reference magnitude so the basis is O(1) at the tier band-top.
fracBasis = clamp( rawBasis / TIER_REF[pillar][tier], 0, 1 )
// 3. Sub-linear (sqrt) shaping AFTER normalization, so f_pillar ∈ [0,1].
f_pillar  = sqrt( fracBasis )
// 4. The seasonal score; JUDGE_K is the pillar's seasonal ip budget for this tier (see back-solve below).
seasonalScore = JUDGE_K[pillar][tier] * f_pillar
if seasonalScore > influence[pillar].highWater:
    Δ = seasonalScore - influence[pillar].highWater
    influence[pillar].value    += Δ
    influence[pillar].highWater  = seasonalScore   // up-only; never decreases here
```

> **F2/F4 fix (2026-06-25) — the seasonal basis is now DIMENSIONALLY CONTROLLED for every pillar.** The earlier
> draft fed each pillar a raw basis of wildly different scale (Estate `sqrt(landKoku)` ≈ O(50–70); Arms/Office
> small integers; Name ≈ O(0.3)) into four un-co-derived `JUDGE_K` (45/55/38/34) — so Estate's seasonal alone
> could be several × the whole gate, and the F4 normalization was applied **only to Name**. The fix introduces
> an **explicit named normalizer `TIER_REF[pillar][tier]`** (a reference magnitude = the pillar's band-top in
> that tier, in the basis's own units) applied to **all four pillars** *before* the `sqrt` shaping, so every
> `f_pillar ∈ [0,1]` and reaches **1.0 only at the tier's band-top**. With `f` bounded in [0,1], the seasonal
> stream is bounded and back-solvable (below).

Where `b_pillar(state)` reads the house's *current standing* in that domain (a slowly-growing function of
holdings, not a per-action counter), and `TIER_REF` is its band-top reference (in the basis's own units):

| Pillar | `b_pillar(state)` — raw judged basis | `TIER_REF[tier]` (basis units; the normalizer) |
|---|---|---|
| **Arms** | `securedNodeCount · avgClearedDanger + retinueReadiness` (a "secured-danger" index) | T0 `ARMS_REF` · T1 10·ref · T2 100·ref (the secured-danger reachable at each band-top) |
| **Estate & Wealth** | `landReclaimedKoku + treasurySolvency + min(tradeIndex, ⅓·estateTotal)` (a koku-scaled index) | T0 `ESTATE_REF_KOKU` · T1 10× · T2 100× (the koku-index reachable at each band-top) |
| **Standing & Office** | `officesHeld·officeWeight + alliancesSealed·allianceWeight` (a standing index) | T0 — · T1 `OFFICE_REF` · T2 10× (the standing reachable at each band-top) |
| **Name & Honour** | `armsHW + estateHW + officeHW + deedsPatronageBonus` (reflects the other three + deeds) | `TIER_REF_NAME[tier] = armsGate + estateGate + officeGate` (T1 = 15K · T2 = 140K) |

> **F4 double-scale resolved.** The old Name basis `0.25·(armsHW+estateHW+officeHW)/1000` carried a bare
> `/1000` scaler; the prior F4 patch folded it into `JUDGE_NAME_BLEND = 0.00025` **and** still multiplied by
> `JUDGE_K[Name] = 34` — an accidental **34× change** in the effective Name coefficient. That ad-hoc blend is
> **RETIRED.** Name now uses the **same** scheme as every other pillar: its normalizer is the **explicit**
> `TIER_REF_NAME = armsGate + estateGate + officeGate` (so `f_Name = sqrt((armsHW+estateHW+officeHW) / TIER_REF_NAME)
> ∈ [0,1]`), and its seasonal budget is the same back-solved `JUDGE_K[Name][tier]`. There is **no** remaining
> `JUDGE_NAME_BLEND` magic number — the effective Name coefficient is now `JUDGE_K[Name][tier] / TIER_REF_NAME[tier]`,
> fully explicit and intended.

**Back-solving `JUDGE_K` (so each pillar's seasonal stream = exactly 30 % of its gate).** Because the basis is
monotone-rising over the tier and `f_pillar` is normalized to reach **1.0 at the band-top (final autumn)**, the
**cumulative high-water seasonal gain** over the tier's ~8 seasons telescopes to `JUDGE_K · max(f) = JUDGE_K · 1`.
So the back-solve is exact and dimensionless:

```
JUDGE_K[pillar][tier]  =  SEASONAL_SHARE · gate[pillar][tier]          // SEASONAL_SHARE = 0.30
```

i.e. `JUDGE_K` **is** the pillar's seasonal ip headroom this tier — one constant (`SEASONAL_SHARE = 0.30`)
applied to the §4.1 gate table. The four old scalar `JUDGE_K` (45/55/38/34) are **replaced** by this co-derived
per-pillar-per-tier table. (**Name & Honour** gates no v1 tier, so its 0.30 is taken of its reference
`TIER_REF_NAME` = armsGate + estateGate + officeGate = **15K (T1) / 140K (T2)**, not a gate — same 30 %
philosophy applied to its basis reference.)

| `JUDGE_K[pillar][tier]` = 0.30 · gate (Name: 0.30 · `TIER_REF_NAME`) | T0 | T1 | T2 |
|---|---|---|---|
| **Arms** | **150** | **1,500** | **9,000** |
| **Estate & Wealth** | **240** | **2,400** | **18,000** |
| **Standing & Office** | — (no T0 gate) | **600** | **15,000** |
| **Name & Honour** | — (not gated) | **4,500** | **42,000** |

The **`sqrt`** shaping is deliberate: each pillar's judged score grows **sub-linearly** in raw holdings, so
doubling your land does *not* double the appraisal — the high-water mark advances in **diminishing, earned
steps**, and the **autumn headline** (Estate gets a ~12 % harvest bump to its basis on autumn seasons) is the
one most likely to set a fresh mark. **Seasonal results supply the SMALLER ~30 % of pillar growth; deed jumps
(§4.2.1) supply the punchy ~70 % foreground.**

**WORKED 8-SEASON TIE-OUT (proves each `JUDGE_K` lands the seasonal stream on exactly 30 % of its gate).** The
basis fraction `rawBasis/TIER_REF` ramps from ~4 % (season 1) to **100 %** (season 8, the final autumn);
Estate's autumn seasons (4 & 8) carry a ~12 % harvest bump. `f = sqrt(frac)`; score `= JUDGE_K·f`; Δ accrues
only on a new high-water mark; the **accumulated** column is the running cumulative seasonal ip. Each table ends
at exactly **30 % of the gate** (because `f` ends at 1.0 ⇒ cumulative = `JUDGE_K`). Seasons read
Sp→Su→**Au**→Wi ×2 (Au = autumn headline).

*T0 Estate — `JUDGE_K = 240`, target 30 % of 0.8K = **240 ip*** ✔

| season | basis% | f | score | Δ | accumulated |
|---|---|---|---|---|---|
| 1 Sp | 4 % | 0.200 | 48.0 | 48.0 | 48.0 |
| 2 Su | 18 % | 0.421 | 101.0 | 53.0 | 101.0 |
| 3 **Au** | 31 % | 0.561 | 134.5 | 33.5 | 134.5 |
| 4 Wi | 51 % | 0.711 | 170.7 | 36.1 | 170.7 |
| 5 Sp | 59 % | 0.767 | 184.1 | 13.5 | 184.1 |
| 6 Su | 73 % | 0.852 | 204.5 | 20.3 | 204.5 |
| 7 **Au** | 86 % | 0.929 | 222.9 | 18.5 | 222.9 |
| 8 Wi | 100 % | 1.000 | **240.0** | 17.1 | **240.0** |

*T0 Arms — `JUDGE_K = 150`, target 30 % of 0.5K = **150 ip*** ✔ (smooth ramp, no autumn bump): season Δs
30.0 → 33.1 → 21.0 → 16.7 → 14.3 → 12.7 → 11.6 → 10.7, **accumulated = 150.0**.

The same scheme back-solves every gated pillar at every tier (each ends on its 30 % target by construction):

| Pillar / tier | `JUDGE_K` | per-season accumulated (s1 … s8) | end = 30 % gate |
|---|---|---|---|
| **T1 Estate** | 2,400 | 480 · 1,010 · 1,346 · 1,707 · 1,841 · 2,045 · 2,229 · **2,400** | **2,400** ✔ |
| **T1 Arms** | 1,500 | 300 · 631 · 841 · 1,008 · 1,151 · 1,278 · 1,393 · **1,500** | **1,500** ✔ |
| **T1 Office** | 600 | 120 · 253 · 336 · 403 · 460 · 511 · 557 · **600** | **600** ✔ |
| **T2 Estate** | 18,000 | 3,600 · 7,576 · 10,091 · 12,799 · 13,809 · 15,334 · 16,720 · **18,000** | **18,000** ✔ |
| **T2 Arms** | 9,000 | 1,800 · 3,788 · 5,046 · 6,047 · 6,905 · 7,667 · 8,360 · **9,000** | **9,000** ✔ |
| **T2 Office** | 15,000 | 3,000 · 6,313 · 8,409 · 10,078 · 11,508 · 12,778 · 13,934 · **15,000** | **15,000** ✔ |

So at every tier the seasonal stream is **exactly 30 %** of each gate, the deed inventory (§4.2.1) supplies the
other **70 %**, and the two add to the §4.1 gate — the locked 70/30 split, verifiable line-by-line. *(Note the
season-1 Δ is the largest because the high-water mark starts at 0; the **autumn** marks are the diegetic
headlines even when their numeric Δ is mid-pack. This tie-out is headlessly regression-testable via §6.10.)*

**Levers:** `SEASONAL_SHARE = 0.30` (the one dial that sets the whole seasonal stream — its 30 % value realises
the LOCKED deeds-dominate split); `JUDGE_K[pillar][tier]` (the derived seasonal-ip table above = `SEASONAL_SHARE
· gate`); the **`TIER_REF[pillar][tier]`** normalizers (incl. `TIER_REF_NAME = armsGate+estateGate+officeGate`)
that make each `f_pillar` O(1) at band-top; the **autumn-basis bump** (~12 %); the exponents inside each
`f_pillar` (default `0.5`; lower = harsher diminishing returns). The high-water-mark rule, the every-season
cadence, **and the ≈30 %-seasonal / ≈70 %-deeds split direction (LOCKED by human 2026-06-25)** are not free to
invert; only the magnitudes (`SEASONAL_SHARE`, the `TIER_REF` values, the exponents) that realise it are levers.

### §4.2.3 The trade ≤⅓ cap (HARD INVARIANT — not a lever)

**Shape (canon §D — fixed, verifier-enforced §6.6).** Within Estate & Wealth's three sub-engines
(LAND / TREASURY / TRADE), the **TRADE strand's contribution is hard-clamped to ≤ ⅓ of the Estate & Wealth
pillar total**, applied at **every** accrual point (both jump and judged):

```
// WORKING FORM (non-circular — this is the implementation):
tradeAllowed = 0.5 * (land + treasury)
trade        = min( rawTrade, tradeAllowed )
estateTotal  = land + treasury + trade

// PROOF the working form yields trade ≤ ⅓ of the Estate total (the HARD INVARIANT):
//   at the cap, trade = 0.5·(land+treasury)
//   ⇒ estateTotal = (land+treasury) + 0.5·(land+treasury) = 1.5·(land+treasury)
//   ⇒ trade / estateTotal = 0.5·(land+treasury) / 1.5·(land+treasury) = 1/3   (exactly, at the cap)
//   below the cap trade is smaller, so trade/estateTotal < 1/3 always. ✔
```

> **F1 fix.** The previous first line `tradeContribution = min(rawTrade, (1/3)*(land+treasury+tradeContribution_clamped))`
> was **self-referential** (`tradeContribution` on both sides) and not implementable. It is **deleted**. The
> working form above (`tradeAllowed = 0.5·(land+treasury)`) is mathematically equivalent to "trade ≤ ⅓ of the
> Estate total" — verified by the proof block — and is the canonical implementation. The **≤⅓ HARD INVARIANT
> is intact** (and unchanged by this rebalance).

A pure-trade run therefore maxes **~⅓ of one of four pillars** (≈ **8%** of total House Influence) and can
**never carry a tier gate**. The signature *meibutsu* (**silk / sericulture**, LOCKED) lives entirely inside
this capped strand. **The ⅓ ratio is canon and NOT tunable**; the *raw* trade yields feeding into it (§4.7)
are levers.

### §4.2.4 Recoverable DENTS (up-only with minor, scripted, per-pillar dips)

**Shape (canon §D, §1.6.2 — fixed).** Up-only **except** rare, scripted, **per-pillar** dents
(scandal→Name, called debt→Estate, lost battle→Arms), **MINOR & quickly recoverable**, **never a wipe**, and
the dent **never touches `highWater`** (so it self-heals as play resumes the appraisal).

*(proposed v1 balance — for human review)*: a dent removes **`DENT_FRACTION = 0.10`** of the *current pillar
`value`* (max one dent active per pillar), and `value` regrows toward `highWater` at the normal accrual rate —
**clawed back within ~1–2 seasons** by design (canon: "a small dip clawed back within a season or two"). Dents
are scripted story beats only (a finite authored list per tier), **never** procedural/random.

**Levers:** `DENT_FRACTION` (default 0.10); the authored dent list per tier (count & which pillar). The
"never a wipe / never below 0 / never touches highWater / recoverable in ≤2 seasons" rules are **canon.**

---

## §4.3 Pillar conversion weights (labour / combat / office / deeds → pillar gains)

**Shape (canon — fixed).** Each *protagonist domain* funnels into **one primary pillar** via the accrual
shapes above; there is **no cross-pillar leakage except** the explicit roll-ups (Name reflects the other
three; trade folds into Estate under the ⅓ cap). Skills/levels never grant Influence **directly** — they make
the *recognized deed* more achievable (§2.7d). The "weights" below are the **multipliers applied to a deed's
base value** based on *how well it was performed* (quality/scale), then capped per §4.2.1.

| Domain → pillar | Conversion weight (multiplier on deed base) *(proposed)* | Notes |
|---|---|---|
| **Combat** → **Arms** | `1.0 + 0.05·(combatLevel) + 0.10·(dangerRingClearedAbove)` | scale of the threat clears more Arms; **per-event cap (0.04) still binds** |
| **Labour (LAND/TREASURY)** → **Estate** | `1.0 + 0.04·(skillLevel of the labour skill)` | better farmer → bigger recorded yield jump (still capped at 0.04·band) |
| **Trade** → **Estate(trade strand)** | `1.0 + 0.04·(tradeSkill)`, then **⅓-clamped** (§4.2.3) | silk *meibutsu* graded quality raises the raw, both caps still bind |
| **Office/admin** → **Standing & Office** | `1.0 + 0.06·(officeRank) + 0.15·(allianceSealed?1:0)` | alliances (incl. marriage/adoption lever, T3+) weigh heaviest |
| **Recognition/deeds/patronage** → **Name** | `1.0 + 0.25·((armsHW+estateHW+officeHW) / TIER_REF_NAME)` *(normalized by the same explicit `TIER_REF_NAME` as §4.2.2 — no bare `/1000` scaler)* | Name is *derivative* — it lags the other three by design |

**The marriage/adoption lever (T3+, parked):** a one-time **alliance** deed with an unusually large base
(roughly **a full per-event cap** into *both* Office and Name simultaneously) — canon's "real late-game lever."
Numbers detailed when T3 is authored.

**Interaction with the locked deeds-dominate split.** These multipliers grow a deed's *base* with how well
it was performed, but **every result is still clamped by the §4.2.1 per-event cap of 0.04**. So even a
high-skill master cannot turn one deed into a spike — the cap keeps growth in the *many-small-acts* regime
the human locked (§I-bal). The conversion weights therefore tune **which deeds feel rewarding to specialise
in**, not the overall deeds-vs-seasonal balance (that's fixed by §4.2.1/§4.2.2 sizing).

**Levers:** the per-domain coefficients (the `0.04`–`0.25` multipliers). The **structural routing** (which
domain → which pillar, no cross-feed, Name-as-derivative) and the **deeds-dominate split** are **not levers**;
the coefficients that realise them are.

---

## §4.4 The rich ATTRIBUTE system (STR / AGI / INT / SPD / LUCK)

**Shape (canon §G, §2.7 — fixed).** Five interacting attributes, **stored as base values** (recompute
effective on load = base + gear + milestones, §6.4). Attributes start **near-mediocre** and rise only via
character levels / milestones / gear (mediocre-start; **no labour→combat cross-feed** — labour skills never
feed combat attributes, §1.13). Each attribute has **labour effects and combat effects** so it is never a
dump stat.

| Attr | Combat effect *(proposed)* | Labour effect *(proposed)* |
|---|---|---|
| **STR** (力) | `attackPower += 1.2·STR` (melee); raises carry/durability damage | labour yield `+0.8%·STR`; hauling capacity `+2·STR`; lower stamina cost on heavy work |
| **AGI** (体) | `evasion += 0.6·AGI`; `critChance += 0.2%·AGI`; hit-accuracy `+0.4·AGI` | gathering speed `+0.6%·AGI` (forage/fish); craft success `+0.3%·AGI` |
| **INT** (智) | `+0.5%` damage vs known bestiary entries; better stance/ability effects | craft quality `+0.7%·INT`; recipe unlock thresholds eased; office/admin deed weight `+0.5%·INT` |
| **SPD** (速) | `attackSpeed += 0.5%·SPD` (faster swings — see cadence §4.6); turn-order/first-strike | action tick-cost `−0.3%·SPD` (faster labour cycles, floored) |
| **LUCK** (運) | `critChance += 0.1%·LUCK`; `blockChance += 0.1%·LUCK`; rare-loot weight `+0.5%·LUCK` | better gather/forage rare-drop odds; market price-swing favourability |

**Starting attributes (mediocre-start contract):** all five start at **5** (out of an early soft-cap of ~30
by end-T0, ~80 by end-T2). The MC's only edge is *temperament* (narrative), **never a stat** (canon §A,
§1.4). **Attribute points:** **+1 point every 2 character levels**, plus milestone grants.

> **NO RESPEC IN v1 (LOCKED by human 2026-06-25, canon §I-bal).** Attribute-point allocations are
> **committed** — there is **no reset / re-spend lever in v1**. Every point spent on STR/AGI/INT/SPD/LUCK is
> permanent; the build you grow is the build you keep. (A late-game respec lever may be reconsidered post-v1,
> but it is explicitly **out** of the v1 balance lock and must NOT be implemented as a v1 dial.) This makes
> the dual labour+combat purpose of each attribute (every attr does double duty) load-bearing: because you
> can't undo a choice, no attribute may be a dump stat — which the §4.4 table already guarantees.

**Levers:** every coefficient in the table; starting value (5); points-per-level cadence; the soft-caps per
tier. The **five-attribute identity, the dual labour+combat purpose of each, the no-cross-feed rule, and the
no-respec-in-v1 rule** are **not levers** (the last is LOCKED by human 2026-06-25).

---

## §4.5 Per-skill XP curves, per-event caps & milestone perks

**Shape (canon §G, §2.7 — fixed).** Per-skill `total_xp` pools (stored), **levels derived** from a curve;
skills are **hidden until a small visibility threshold** (discover-by-doing); **per-event XP caps force
breadth** (no single action spikes a skill); **milestone perks** at thresholds. Lean core skills at T0; more
unlock per tier.

### §4.5.1 The XP→level curve

A standard incremental geometric curve, shared by all skills (one curve, per-skill *speed* differs):

```
xpForLevel(L)      = round( XP_BASE * XP_GROWTH^(L-1) )
totalXpForLevel(L) = sum_{i=1..L} xpForLevel(i)
```

*(proposed v1 balance — for human review)*: `XP_BASE = 50`, `XP_GROWTH = 1.18`. So L1→L2 costs 50 xp, L10
cumulatively ~**2.1K**, L25 ~**41K**, L50 ~**1.5M** xp. **Visibility threshold** = a skill surfaces in the UI
at **cumulative 30 xp** (~one good session) so it reads as a discovery, not a pre-listed menu. **Soft level
cap per tier**: T0 ≈ **L15**, T1 ≈ **L30**, T2 ≈ **L50** (you *can* exceed, but XP cost makes the next tier's
content the efficient path — this is what stops a player grinding T0 to god-tier).

### §4.5.2 Per-event XP caps (breadth-forcing)

```
xpGain = min( actionXp, PER_EVENT_XP_CAP_FRACTION * xpForLevel(currentLevel+1) )
```

*(proposed)* `PER_EVENT_XP_CAP_FRACTION = 0.25` — **one action can advance a skill at most ¼ of the way to its
next level**, so leveling always takes **≥4 actions** and a lucky big harvest/kill can't one-shot a level.
This is the same per-event-cap discipline canon mandates for combat *and* Influence.

### §4.5.3 Milestone perks (the build web)

Milestones at **levels 5 / 10 / 25 / 50** per skill (lever). Perk magnitudes *(proposed)*:

| Milestone | Typical perk | Example |
|---|---|---|
| **L5** | small flat stat or `+5%` skill efficiency | Farming L5: `+5%` koku/harvest |
| **L10** | a title (feeds Name flavour) + `+1` related attribute **(combat skills only — see no-cross-feed constraint below)** or a recipe unlock | Smithing L10 (labour): unlocks component-craft tier (a recipe unlock, **no attribute**); Swordsmanship L10 (combat): `+1 STR` |
| **L25** | a `×1.10` multiplier or a cross-skill XP bonus (`+5%` to a *sibling* skill) | Foraging L25: `+5%` XP to Cooking |
| **L50** | a `×1.25` capstone multiplier + a marquee unlock | Combat-weapon L50: stance slot / signature ability |

**No milestone ever reads a returning-memory or porter's-knot flag** (no-hidden-edge guard, §1.4/§2.7c —
canon, encoded at the type level). Cross-skill bonuses go skill→sibling-skill **only**; **no
labour-skill→combat-attribute edge exists** (canon §E).

> **No-cross-feed wall — type-level enforced on the L10 `+1 attribute` perk (2026-06-25 fix).** The L10
> milestone's `+1 related attribute` grant is **constrained so a LABOUR skill can NEVER grant a combat-feeding
> attribute (STR or AGI)**. Concretely, each skill is typed `combat | labour`, each attribute is typed by
> whether it feeds a **combat-derived stat** (STR, AGI feed attackPower/evasion/etc. per §4.6.1 → *combat-feed*;
> INT/SPD/LUCK's combat effects are minor/incidental but to be safe the wall is: **labour-skill milestones may
> grant attribute points ONLY to a non-combat-feed attribute, or — preferably — grant no attribute at all and
> take the recipe-unlock branch instead** (e.g. Smithing/Farming/Foraging L10 → a recipe/efficiency unlock, never
> `+STR`/`+AGI`). Only **combat-skill** milestones (weapon lines, conditioning's combat facet) may grant STR/AGI.
> This makes the canon "no labour→combat cross-feed" (canon §E, §1.13, §4.4) **enforceable at the type level**
> rather than relying on hand-authored perk lists: a labour-skill milestone with a combat-feed attribute grant is
> a type error.

> **NO RESPEC IN v1 (LOCKED by human 2026-06-25, canon §I-bal).** Where a milestone offers a *choice* (e.g. a
> branch perk, a stance slot, or a "pick one of two" unlock), that choice is **committed** — there is **no
> reset / re-pick lever in v1**. Skills themselves still level freely by doing (no skill is locked out), but a
> milestone *selection* once taken is permanent. Mirrors the attribute no-respec rule (§4.4): the build you
> grow is the build you keep. A post-v1 respec is explicitly **out** of the v1 balance lock.

**Levers:** `XP_BASE`, `XP_GROWTH`, `PER_EVENT_XP_CAP_FRACTION`, visibility threshold (30), per-tier soft
caps, milestone levels & perk magnitudes. The curve *shape* (geometric), the discover-by-doing reveal,
per-event capping, and the no-cross-feed wall are **canon.**

---

## §4.6 The COMBAT math (idle auto-resolve)

**Shape (canon §E, §2.8 — fixed).** Idle auto-resolve + active setup: prepare gear/stance/area → a
**deterministic seeded fight** resolves on a fixed-step sub-tick sim (one RNG, §6.7) → intervene with
stance/ability/item/retreat. **Mediocre-start preserved** (start near-zero; humbling near-fatal first fight;
earned via grind; **no cross-feed**). **Failure = soft setback** (HP/time, maybe drop carried loot, take a
rest-off injury) — **never** lose levels/gear/permanent progress.

### §4.6.1 Combatant model & derived stats

```
attackPower  = weaponBase + 1.2·STR + gearAtk + skillBonus      (skillBonus = 0.3·weaponSkillLevel)
attackSpeed  = baseSpeed · (1 + 0.005·SPD) · stance.speedMod    (swings per "combat second"; see cadence)
evasion      = 0.6·AGI + gearEva + stance.evasionMod            (an evasion *rating*, not a flat %)
accuracy     = 10 + 0.4·AGI + 0.3·weaponSkillLevel              (an accuracy rating)
defense      = gearDef + 0.5·STR + stance.defMod
critChance   = 0.02 + 0.002·AGI + 0.001·LUCK   (cap 0.50)
blockChance  = gearBlock + 0.001·LUCK          (cap 0.40, requires a shield/guard)
hpMax        = 40 + 8·characterLevel + 2·STR + gearHp
```

### §4.6.2 Attack-speed cadence

Combat runs on an internal **sub-tick accumulator** (§2.8c). `baseSpeed = 1.0` swing per **20 combat
sub-ticks** at SPD 5; each point of SPD shaves cadence per the `+0.5%·SPD` above. A typical T0 fight is
**~6–12 swings** (a handful of real ticks). **Lever:** `baseSpeed` and the `0.005·SPD` coefficient set how
twitchy-vs-grindy fights feel (canon: low-APM, strategic — keep fights short).

### §4.6.3 Hit vs evasion, damage minus defence (with a floor)

```
hitChance = clamp( accuracy / (accuracy + evasion), 0.15, 0.95 )      // logistic; never auto-miss/auto-hit
rawDamage = attackPower · rngVariance(0.85 … 1.15)                    // seeded ±15%
damage    = max( DAMAGE_FLOOR, rawDamage − defense )                  // the canon damage FLOOR
DAMAGE_FLOOR = max( 1, 0.10·attackPower )                             // chip damage always lands → fights end
```

The **damage floor** (`max(1, 10% of attackPower)`) guarantees even a heavily-armoured foe takes chip damage,
so a fight always resolves (no infinite stalemate) — the canon "damage minus defence (with a floor)".

### §4.6.4 Crit / block

```
on hit:  if rngChance(critChance) → damage ·= CRIT_MULT   (CRIT_MULT = 1.5)
         if defender rngChance(blockChance) → damage ·= (1 − BLOCK_REDUCTION)   (BLOCK_REDUCTION = 0.5)
```
Crit and block are **separate seeded rolls** (§2.8c). **Levers:** `CRIT_MULT` (1.5), `BLOCK_REDUCTION` (0.5),
the chance caps (0.50 / 0.40).

### §4.6.5 On-kill rewards (XP + loot)

- **Combat XP** = `mobLevel · COMBAT_XP_K`, then per-event capped (§4.5.2). `COMBAT_XP_K = 12` *(proposed)*.
- **Skill XP** to the equipped weapon line, separately per-event capped.
- **Loot** = one seeded roll on the mob's `LootTable` (§4.7.3); rare-tier weight scaled by `+0.5%·LUCK`.
- **Arms deed** (only for *recognized* clears/defends, not every trash mob) → an achievement jump (§4.2.1),
  per-event capped — so grinding boars does **not** balloon Arms; the *recognized* road-cleared deed does.

### §4.6.6 The mediocre-start curve & the soft-setback-on-loss rule

- **Start near-zero, earned only by grind, no cross-feed.** At R3 (first drills) the MC has weaponSkill 0,
  attributes 5, a crude weapon (`weaponBase ≈ 3`). The **humbling first fight** (a wolf, §2.8/§2.9) is tuned
  so a fresh MC wins only **~20–35%** of the time **(LOCKED by human 2026-06-25, canon §I-bal —
  "humbling-but-winnable; drives the player to train")** — survivable by luck/stubbornness, never skill; it is
  meant to be *barely* survived, then motivate training. After ~a season of drills (weaponSkill ~5, attrs ~10,
  a smith-forged blade), win-rate against that same wolf is **~85%+**. **No labour conditioning bonus enters
  any of these numbers** — conditioning is a one-way *enablement gate* only (canon §E, §1.13). Note: under the
  longer saga, "~a season of drills" is now ~30–40 min of real R3 play (the per-rank floor) — the climb from
  ~25 % to ~85 % is felt as *earned over real time*, exactly the locked intent.
- **Soft setback on loss** **(LOCKED by human 2026-06-25 "as proposed", canon §I-bal)**: a lost fight → MC
  drops to **1 HP** (not death), advances **~½ a day** of clock (the recovery), takes a **random light injury**
  (`InjuryState`, heals in ~**1–2 days** of rest, a small `−10%` to one stat meanwhile), and **may drop
  carried loot** (a seeded roll, **never equipped gear, never levels, never Influence** — the only Influence
  movement on a loss is a *scripted* Arms dent if the lost fight was a defence-deed, §4.2.4). **Never** a
  level/gear/permanent loss (canon §E). The **severity SHAPE** (1 HP + ~½-day + light injury + *possible*
  carried-loot drop, never permanent progress) is **LOCKED**; the exact magnitudes below remain levers.
  **Levers (magnitudes only):** the drop-loot chance, injury severity/duration, the ½-day clock cost. The
  **first-fight win-rate target (20–35%)** and the **soft-setback shape** are **LOCKED, not levers.**

---

## §4.7 Producer / cost curves (gathering yields, crafting, T3+ auto-producers)

**Shape (canon §G — fixed).** **Auto-producers are LATE-GAME (T3+) ONLY** (§2.5); v1's T0–T2 is the MC's own
**active grind** — so for v1 the load-bearing curves are **gathering yields**, **crafting costs/quality**, and
**building/upgrade costs**. The genre-standard `cost = base · r^owned` is used **only** for the late-game
auto-producers and for repeatable upgrades, **never** to fake an early idle layer.

### §4.7.1 Gathering / labour yields (active)

```
yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · (soft-stamina rate)
ticksPerAction = baseTicks · (1 − 0.003·SPD)   (floored at 1)
```

*(proposed v1 base yields, koku/material per action — UNCHANGED in magnitude from the first pass; the longer
saga is paid in TIME at the per-rank floor, not in shrunk yields)*:

| Node | baseYield | baseTicks | toolMult range | season gate |
|---|---|---|---|---|
| Rake/farm rice (paddy) | 2 koku | 3 | 1.0 → 2.5 (sickle→fine tools) | grows spring/summer, **harvest autumn** |
| Forage *sansai* | 1 greens | 2 | 1.0 → 1.8 | spring/summer windows |
| Woodcut | 2 wood | 3 | 1.0 → 2.2 | year-round |
| Fish (ford) | 1 fish | 2 | 1.0 → 2.0 | year-round, peak autumn |
| Sericulture (silk, T1+) | 1 cocoon | 4 | 1.0 → 3.0 | **summer** (mulberry) |

**Throughput tie-out (how these yields produce the §4.8 pacing).** A T0 rice action runs
`2·(1+0.04·skill)·toolMult` koku. At **R1** (skill ~1, crude tools 1.0) that's **~2.1 koku/action**; at
**R7** (skill ~12, fine tools 2.0) it's **~5.9 koku/action**. At the intended active pace, the *net
koku-equivalent throughput* (after stamina, food, and re-investment) rises across T0's rungs roughly:
**R1 ~25 → R2 ~35 → R3 ~40 → R4 ~60 → R5 ~80 → R6 ~110 → R7 ~150 koku/min** (combat rungs trade some labour
minutes for loot value; crafting/cash-crop rungs add value per action). Multiplying each by its rung's
wall-clock minutes (§4.8) gives **lifetime-produced koku over T0 ≈ 21K** (held ≈ 3–5K after spend) — which is
the §4.0 T0 band, and which clears the E1/E2 building costs (§4.7.5) on schedule. **This throughput table is
the bridge between the yields here and the rank-time table in §4.8; retune the `0.04·skillLevel` slope and
tool multipliers, never the per-rank time floor, to fix pacing drift.**

**Seasonal headline:** the autumn rice harvest is a **`×3` season multiplier** on paddy yield (drives the
Estate judged-result high-water mark, §4.2.2 — the autumn appraisal is the one most likely to set a fresh
mark). **Levers:** every baseYield/baseTicks, the `0.04·skillLevel` and `0.003·SPD` coefficients, tool
multipliers, season multipliers, the autumn `×3`, and the **per-rung net-throughput assumptions** (§4.8).

### §4.7.2 Crafting cost & quality (hybrid: simple → component)

- **Simple recipes (early):** flat `inputs → output`; cost a fixed small material bundle; success ~100%.
- **Component recipes (T1+):** `outputQualityTier = floor( (crafterSkill·0.4 + avgComponentQuality·0.4 +
  stationTier·0.2) / QUALITY_DIVISOR )`, `QUALITY_DIVISOR = 10` → quality tiers **0–5** (crude → masterwork).
  Each quality tier multiplies the item's stat/value by **`1.25^tier`**. Disassembly returns **~60%** of
  materials. **Levers:** the 0.4/0.4/0.2 quality weights, `QUALITY_DIVISOR`, the `1.25^tier` value step, the
  60% disassembly return. *(Crafting magnitudes are unchanged by the rebalance — the value-add they provide is
  already folded into the rising per-rung throughput in §4.7.1/§4.8.)*

### §4.7.3 Loot tables (seeded)

A mob/node drops on a weighted table; **rarity tiers common/uncommon/rare/fine** with default weights
**70 / 22 / 6 / 2** (rare/fine weight scaled by `+0.5%·LUCK`). **Levers:** the rarity weights and the LUCK
coefficient.

### §4.7.4 Auto-producers (T3+ ONLY — parked, scaffold only)

```
cost(n)  = producerBase · PRODUCER_GROWTH^owned          (PRODUCER_GROWTH = 1.5, ~5× per few buys)
output   = producerBaseRate · (1 + 0.1·tier)              (per active tick — NO offline accrual, canon §H)
```

Gated on **Influence band + a LOW rank floor + cost** (NOT the capstone — §1.5.1 estate-growth rule), bound to
a `RosterMember` (a face, not a slider; §2.5). **All values parked until T3 is authored**; only the
**shape/`PRODUCER_GROWTH` scaffold** is fixed here.

### §4.7.5 Building / upgrade costs (estate stages E0→E2, v1)

Estate physical stages gate on **Estate & Wealth (+ Arms for defensive works) + a LOW rank floor + cost**
(§1.5.1 — never the capstone). *(proposed)*:

| Stage | Gate (pillar floor + rank) | koku cost | material cost |
|---|---|---|---|
| **E0 Foreclosure's Edge** | start | — | — |
| **E1 Stabilising** (kura patched, first *shinden*, drill yard, night-watch) | Estate ≥ 0.3K, rank ≥ R4 | 400 koku | 30 wood |
| **E2 Recovering** (granary, 2 workshops, low palisade, men-at-arms rota) | Estate ≥ 1K + Arms ≥ 0.4K, rank ≥ R6 | 2K koku | 120 wood, 40 stone |

**Affordability tie-out (vs the §4.7.1/§4.8 throughput).** E1's **400 koku** falls due around **R4**, by which
point lifetime-produced koku ≈ **5.1K** — comfortably affordable while leaving headroom for food/tools/crafting
spend (the held balance is what's tight, by design). E2's **2K koku** falls due around **R6**, by which point
lifetime-produced koku ≈ **13.3K**. Both costs are thus **paced to be reached, not trivially pre-bought** — and
their **rank floors (R4/R6) plus Estate/Arms pillar floors** keep building gated on standing, never the
capstone (§1.5.1). E3–E5 parked (§1.5.2). **Levers:** every cost & pillar/rank floor above (all *proposed*).

---

## §4.8 PACING targets — the LOCKED time budget + the rank-by-rank pacing table

These are the **playtest acceptance criteria** the numbers above are derived *backward from*; they are
headlessly regression-tested via the DEV play API (§6.10) so a retune that breaks pacing fails CI. Canon hard
rules: **first action < 5 s**, **the next goal never balloons > ~2–3× the prior** (within a tier; canon §G,
§1.2), and — **NEW, LOCKED by human 2026-06-25 (canon §I-bal)** — **every single rank takes ≥ ~30 min**, and
the **per-tier budgets are T0 ≈ 4.5 h · T1 ≈ 8 h · T2 ≈ 16 h** ("more grind, more numbers, a slower release of
incremental features"). **v1 total (T0–T2) ≈ 28.5 h** (the canon "≈32 h" figure includes the T3-stub
runway/free-play tail past the T2→T3 gate).

### §4.8.0 Headline beats

| Beat | Target | Lock status | How measured |
|---|---|---|---|
| **First action available** | **< 5 s** from load (rake spilled rice in the kura) | canon | time-to-first-interactable |
| **First meaningful reveal** | **< 30 s** (rice counter ticks → Skills tab fades in) | proposed | first `unlock` event |
| **Per-rank minimum** | **≥ ~30 min per rung** (no rung advances faster) | **LOCKED 2026-06-25** | per-rung tick-count floor |
| **Humbling first fight (R3)** | **~60–75 min** in (start of R3) | proposed | tick-count to the wolf encounter |
| **Time-to-T1** (sent to village) | **≈ 4.5 h** active play | **LOCKED (T0 budget)** | tick-count to T0→T1 gate |
| **Time-to-T2** (region opens) | **≈ 12.5 h** cumulative (4.5 + 8) | **LOCKED (T1 budget)** | tick-count to T1→T2 gate |
| **v1 completion** (T2→T3 gate / stub) | **≈ 28.5 h** cumulative (4.5 + 8 + 16) | **LOCKED (T2 budget)** | tick-count to T2→T3 gate |
| **Goal-to-goal step ratio** | **≤ 2–3×** between consecutive within-tier goals | canon | max ratio of consecutive costs |
| **Tier-to-tier step** | **~10×** (Arms/Estate) — a chapter, not a wall; Office steepens | proposed | band-top ratio across tiers |
| **Side-faction speedup** | village+origin weaving **shaves** time-to-next-tier (felt, never required) | proposed | with/without multipliers |

> The old draft's "leave T0 in ~45–75 min; v1 ~12–20 h" row is **deleted** — superseded by the locked
> longer budget above.

### §4.8.1 ⭐ T0 rank-by-rank pacing table (the centrepiece — all 8 rungs, full resolution)

This is the table the rest of §4 is tuned to satisfy. **Each rung's expected wall-clock ≥ ~30 min (R0 aside,
the cold-open story rung)**, escalating toward the capstone, **summing to ≈4.5 h**. "Gating cost" is in the
units defined above: **koku** (lifetime-produced, the labour/economy currency), **deed-count → ip** (the
pillar-accrual units, §4.2.1), and the **rank-meter** (Estate Service / Combat Standing crossings, §3 / §2.15).
"Throughput" is the net koku-equivalent/min from §4.7.1. *(Times & costs: proposed; the ≥30-min floor and the
4.5-h sum: **LOCKED**.)*

| Rung (what it gates — from §3) | Gating cost to LEAVE it | Throughput assumption | ⏱ wall-clock |
|---|---|---|---|
| **R0 Stray** — cold open done; bare estate dashboard | *(story only — the cold open §3.1)*; ~0 koku, 0 deeds | n/a (tutorial) | **~5 min** |
| **R1 Day-labourer** — paddies, basic labour loop, world-clock | ~750 koku produced; **~3 Estate deeds** (first yields); Estate Service x1 | ~25 koku/min | **~30 min** *(floor)* |
| **R2 Bonded hand** — Skills tab, foraging/woodcut/haul, near satoyama | ~1.05K koku; **~4 Estate deeds**; 1 season appraisal passed; Estate Service x2 | ~35 koku/min | **~30 min** *(floor)* |
| **R3 Yard-hand under arms** — COMBAT LIVE; humbling first fight; drill yard, Bestiary | survive the wolf (20–35% win); **~4 deeds (mixed)**; weaponSkill→~3; Combat Standing x1 | ~40 koku/min | **~30 min** *(floor)* |
| **R4 Trusted hand** — Main House, domestic economy, **first *shinden*** (E1), **simple Crafting + loot→craft loop** | **400 koku** (build E1); **first *shinden* deed (30 ip)** + ~4 Estate deeds; Estate ≥ 0.3K; Estate Service x3 | ~60 koku/min | **~35 min** |
| **R5 Gate-guard** — Quest log + 4 quest types (**Arms deeds BEGIN accruing**) | **first DEFEND deed (20 ip)** + ~6 Arms deeds (Arms→~0.25K); ~5 Estate deeds; Combat Standing x2 | ~80 koku/min | **~40 min** |
| **R6 Foreman of works** — Workshops/Granary (E2), proto-industry, **FIRST combat-earned Arms standing RECORDED**, **village tier seed** | **2K koku** (build E2); Estate ≥ 1K + Arms ≥ 0.4K; ~6 Estate + ~5 Arms deeds; Estate Service x4 | ~110 koku/min | **~45 min** |
| **R7 Bailiff** *(capstone → T1)* — lord's study, **four-bar Influence panel**, T0→T1 gate | **Arms ≥ 0.5K · Estate ≥ 0.8K** (the §4.1 gate); the autumn-harvest seasonal top-up; Estate Service x5 + PILLAR | ~150 koku/min | **~55 min** |

**Totals & checks (T0):** wall-clock **5 + 30 + 30 + 30 + 35 + 40 + 45 + 55 = 270 min = 4.5 h** ✔ (every grind
rung ≥ 30 min ✔; escalating ✔). Lifetime koku produced ≈ **0.75K + 1.05K + 1.2K + 2.1K + 3.2K + 4.95K + 8.25K
= 21.5K ≈ ~21K** ✔ (the **same round figure** as the §4.0 T0 band; clears E1@R4 and E2@R6 ✔). Deeds across T0 =
**30 Estate + 30 Arms = ~56–60 total recognised deeds, one act every ~4.5–5 min (≈9–10 min per individual
pillar)** ✔ (the locked "many small deeds" texture). Pillars at the R7 gate: **Estate = 0.8K (70 % = 560 ip
from 30 deeds + 30 % = 240 ip from 8 seasonal hits)**, **Arms = 0.5K (70 % = 350 deed-ip from 30 deeds + 30 % =
150 seasonal-ip)** ✔ (the locked 70/30 split — itemizations in §4.2.1, seasonal tie-out in §4.2.2). Consecutive
within-rung *cost* ratios stay ≤ ~2× (750→1.05K→1.2K→2.1K…), honouring the ≤2–3× rule ✔.

> **R0 floor carve-out — blessed by the human (2026-06-25).** The ≥30-min per-rank floor (canon §I-bal) applies
> to the **7 grind rungs R1–R7**; **R0 is the exempt ~5-min cold-open story rung** (the *kura* cold open §3.1 — a
> scripted beat, not a grind rung). So T0's **4.5 h** comes from *floor + escalation across R1–R7*, **not** a
> literal "8 rungs × 30 min" reading of canon. This is a settled, deliberate carve-out from canon's literal
> "8 rungs" phrasing. *(Note: R0 is intentionally NOT held to the ≥30-min floor — keeping the cold open short
> is the point; T0's budget stays ~4.5 h.)*

### §4.8.2 T1 rank-by-rank pacing (lower resolution — targets ≈8 h, avg ~1 h/rung)

T1 spends its longer budget on **wider** content (market, coin, component crafting, silk *meibutsu*, rumours
board, valley-scale combat) at **~60 min/season** wall-clock. Throughput rises ~10× over T0 (koku into the
tens-of-thousands). Office becomes a *required* gate. Each rung ≥ ~40 min; capstone longest.

| Rung (§3.4) | Gating cost to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **V0 Errand-runner** — market/coin opens (one shop first) | first valley errands; coin row lit; ~few K koku | **~40 min** |
| **V1 Recognised hand** — chief's house, inn & rumours board | shop+headman standing; Estate Service | **~55 min** |
| **V2 Road-warden** — HUNT/CLEAR at valley scale; ford safe | road-safe Arms deed (150 ip) + valley clears; Combat Standing | **~60 min** |
| **V3 Steward of the valley economy** — silk *meibutsu* + component crafting | recorded seasonal result; trade strand opens (≤⅓-capped); Estate Service | **~65 min** |
| **V4 Trusted of the headman** — **Office bar lights** (first Office jump) | first Office deeds (Magobei's skim); Office→toward 2K | **~70 min** |
| **V5 Sworn man-at-arms** — paid retinue (flavour), DEFEND quests | valley DEFEND deeds (200 ip); Combat Standing; Arms→toward 5K | **~70 min** |
| **V6 Right-hand-in-waiting** — authority across the valley; region seed | alliance/standing levers; Estate Service + STORY | **~55 min** |
| **V7 Agent of the house** *(capstone → T2)* — "clean your room"; region opens | **Arms ≥ 5K · Estate ≥ 8K · Office ≥ 2K** (§4.1 gate); RANK+PILLAR | **~65 min** |

**Totals & checks (T1):** **40+55+60+65+70+70+55+65 = 480 min = 8.0 h** ✔. Deeds supply **70 %** of each gate
(§4.2.1 itemizations): **Estate 5,600 ip (35 deeds) · Arms 3,500 (35) · Office 1,400 (20)**, ~20–35
deeds/required-pillar over the tier ✔. Per-deed cap = 0.04 · T1 band-top (Estate 8K → ≤320; Arms 5K → ≤200;
**Office 2K → ≤80**) — every T1 base sits ≤ its cap (Office bases retuned to 60 / 80 to fit the 80 cap) ✔.
Seasonal supplies the residual **30 %** (Estate 2,400 · Arms 1,500 · Office 600; §4.2.2 tie-out) ✔. Tier step
Arms/Estate ≈10×; **Office 2K is a fresh required gate** (it was 0 at T0). Season ≈ 60 min ⇒ ~8 seasons over T1.

### §4.8.3 T2 rank-by-rank pacing (lower resolution — targets ≈16 h, avg ~2 h/rung)

T2 is the longest, widest tier: region map, *sekisho* travel, region-scale human mobs, the Origin faction +
both personal payoffs, Kuzuhara river-works, the rival houses. **~120 min/season** wall-clock. Required
pillars drift to **Estate + Office** (Arms secures roads). Each rung ≥ ~75 min; capstone among the longest.

| Rung (§3.6) | Gating cost to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **G0 Valley-envoy** — trade backbone opens minimally; first Origin contact | first off-the-books consignment; ~100K-scale koku | **~75 min** |
| **G1 Road-captain** — *sekisho* layer; region-scale combat (ronin/bandits) | secure cluster roads; first pass obtained; Combat Standing | **~110 min** |
| **G2 Broker of the post-town** *(Origin OPENS)* — Sawatari-juku, toiya | STORY(dream)+PILLAR(travel-standing); Office deeds → toward 50K | **~120 min** |
| **G3 Arbiter between valleys** — Hibara + Tōge-mura (capped at 2) | out-supply/arbitrate; Estate Service; Estate → toward 60K | **~130 min** |
| **G4 Recognised regional retainer** — Kuzuhara river-works (LAND mega-lever) | multi-stage *seki* project; big Estate deeds; resettlement | **~140 min** |
| **G5 Captain of the road-detail** — brigand roost; Hanzaki (survived) | secure the trade pass; Arms deeds (700 ip–1.2K, at cap); Combat Standing | **~140 min** |
| **G6 Alliance-broker** *(threads RESOLVE)* — Otsuru + Tahei's name | Office rising; STORY+PILLAR; alliance Office/Name deeds | **~120 min** |
| **G7 Leading house of the region** *(capstone → T3 stub)* — rivals eclipsed | **Estate ≥ 60K · Office ≥ 50K · Arms ≥ 30K** (§4.1 v1 end-gate); RANK+PILLAR | **~125 min** |

**Totals & checks (T2):** **75+110+120+130+140+140+120+125 = 960 min = 16.0 h** ✔. Deeds supply **70 %** of
each gate (§4.2.1 itemizations): **Estate 42,000 ip (31 deeds) · Arms 21,000 (20) · Office 35,000 (21)**,
~20–35 deeds/required-pillar ✔. Per-deed cap = 0.04 · band-top (Estate 60K → ≤2.4K; **Arms 30K → ≤1.2K**;
Office 50K → ≤2K) — every T2 base sits ≤ its cap (Arms road/defend retuned to 1.2K, Office allied to 2K, each
at-cap by design) ✔. Seasonal supplies the residual **30 %** (Estate 18,000 · Arms 9,000 · Office 15,000;
§4.2.2 tie-out) ✔. Tier step Arms 5K→30K (6×), Estate 8K→60K (7.5×), Office 2K→50K (25× — the locked "win it
socially" steepening, §4.0/§4.1). Season ≈ 120 min ⇒ ~8 seasons over T2.

### §4.8.4 The v1 budget at a glance

| Tier | rungs | per-rung avg | season wall-clock | tier wall-clock | lock |
|---|---|---|---|---|---|
| **T0 Estate** | R0–R7 (8) | ~34 min (grind rungs ≥30) | ~34 min | **≈ 4.5 h** | LOCKED budget |
| **T1 Village** | V0–V7 (8) | ~60 min | ~60 min | **≈ 8 h** | LOCKED budget |
| **T2 Region** | G0–G7 (8) | ~120 min | ~120 min | **≈ 16 h** | LOCKED budget |
| **v1 total (T0–T2)** | 24 | — | — | **≈ 28.5 h** | LOCKED budget |

**The two single most important invariants now:** (1) **every rung ≥ ~30 min** (LOCKED) — enforced as a CI
pacing floor: if a headless playthrough clears any rung in < ~28 min the pacing test fails; and (2) the
**goal-to-goal ratio ≤ 2–3×** *within* a tier (canon) — the 1.15× intra-tier growth keeps consecutive costs
gentle, while the ~10× tier step is the deliberate chapter break. **Levers:** all per-rung *times/costs* are
tunable *proposed* numbers, but the **<5 s first action**, the **≤2–3× never-balloon rule**, the **≥30-min
per-rank floor**, and the **4.5/8/16-h tier budgets** are constraints the tuning must always satisfy (the last
two LOCKED by human 2026-06-25).

---

## §4.9 Levers index (the tuning dashboard) & open questions

**Master dials:** `TIER_MAG = 10`, `r_intra = 1.15`, `SEASON_WALLCLOCK_MIN[tier]` (T0≈34 / T1≈60 / T2≈120).
**Accrual:** **`PER_EVENT_CAP_FRACTION = 0.04`** *(halved from 0.08; the "smaller than 0.08" direction is
LOCKED 2026-06-25)*, the **deeds/seasonal split ≈ 70/30** *(the deeds-dominate direction is LOCKED; the exact
70/30 is the proposed realisation)*, the **deed-base table** (§4.2.1, every base ≤ its 0.04·band-top cap),
**`SEASONAL_SHARE = 0.30`** *(the single dial that sets the whole seasonal stream; realises the locked 30 %
seasonal share — replaces the old scalar `JUDGE_K` quartet)*, the derived **`JUDGE_K[pillar][tier] =
SEASONAL_SHARE · gate`** table *(T0 Arms 150 / Estate 240 · T1 Arms 1,500 / Estate 2,400 / Office 600 / Name
3,000 · T2 Arms 9,000 / Estate 18,000 / Office 15,000 / Name 24,000)*, the **`TIER_REF[pillar][tier]`**
seasonal-basis normalizers *(make each `f_pillar` O(1) at band-top — Estate koku ref, Arms secured-danger ref,
Office standing ref)*, **`TIER_REF_NAME[tier] = armsGate + estateGate + officeGate`** *(the explicit Name
normalizer — REPLACES the retired `JUDGE_NAME_BLEND` magic scaler; the F4 double-scale is resolved)*, the
**autumn-basis bump** (~12 %), `f_pillar` exponents (0.5), `DENT_FRACTION = 0.10`. **Gating:** the 5 threshold
rows (§4.1) **+ the per-tier hour budgets (LOCKED) the gates must take to fill**. **Skills:** `XP_BASE = 50`, `XP_GROWTH = 1.18`,
`PER_EVENT_XP_CAP_FRACTION = 0.25`, visibility 30, per-tier soft caps, milestone levels/perks; **no-respec
(LOCKED, not a lever)**. **Attributes:** all coefficients (§4.4), start = 5, +1 pt / 2 levels; **no-respec
(LOCKED, not a lever)**. **Combat:** `baseSpeed`, SPD coeff 0.005, `DAMAGE_FLOOR = max(1, 0.10·atk)`,
`CRIT_MULT = 1.5`, `BLOCK_REDUCTION = 0.5`, `COMBAT_XP_K = 12`; **first-fight win-rate 20–35% (LOCKED, not a
lever)**; soft-setback *magnitudes* (lever) but its *shape* (LOCKED). **Pacing:** all per-rung times/costs in
§4.8 (proposed) under the **≥30-min floor + 4.5/8/16-h budgets (LOCKED)**. **Producers/costs:** gather base
yields/ticks + per-rung net throughput (§4.7.1/§4.8), autumn `×3`, crafting quality weights +
`QUALITY_DIVISOR = 10` + `1.25^tier`, loot rarity 70/22/6/2, `PRODUCER_GROWTH = 1.5` (T3+), E1/E2 costs.

**LOCKED by human 2026-06-25 (§I-bal — shape fixed, not free to invert; only the magnitudes that realise
them are tunable):** saga length / per-tier hour budget (T0 ≈ 4.5 h · T1 ≈ 8 h · T2 ≈ 16 h · v1 ≈ 28.5 h) ·
the **≥30-min per-rank floor** · **first-fight win-rate 20–35 %** · **soft-setback severity shape** (1 HP +
~½-day + light injury + possible carried-loot drop; never levels/gear/Influence) · **deeds-dominate accrual
split (~70 % deeds / ~30 % seasonal)** · **deed-jump size smaller than the old 0.08 cap** · **no respec in
v1** (attributes & skill-milestone choices committed).

**HARD INVARIANTS (canon — NOT levers):** trade ≤⅓ of Estate & Wealth; simple per-tier thresholds with **no
floor/overflow**; accrual = jumps + seasonal-judged-on-high-water-mark only (no time-trickle, no flat
per-action); up-only with minor recoverable per-pillar dents (never a wipe, never touches highWater); no
labour→combat cross-feed; auto-producers T3+ only & active-only (no offline); combat first-class & EARLY (T0);
mediocre-start (start near-zero, grind-only); K/M/B display; macron romanization.

**RESOLVED — now LOCKED (no longer open; moved to the levers index above as "LOCKED by human 2026-06-25"):**
saga length / per-tier hour budget (§I-bal) · first-fight harshness 20–35 % · seasonal-vs-jump split
(deeds dominate ~70/30) · soft-setback severity · no-respec-in-v1. **Do not re-open these.**

**Resolved by the human (2026-06-25):**
1. **Deeds/seasonal ratio** — **70/30** (within the locked ⅔–¾ deeds / ¼–⅓ seasonal band). LOCKED.
2. **Per-event cap value** — **0.04** (half the old 0.08 cap; the "many small acts" granularity). LOCKED.
3. **Per-rung escalation shape** — **front-loaded floor then ramp** (T0 grind rungs = 30/30/30/35/40/45/55, all
   ≥30 min, summing to ~4.5 h). LOCKED.
4. **Wall-clock-per-season binding** — **~8 seasons per tier (≈2 in-game years)** at T0≈34 / T1≈60 / T2≈120
   min/season. LOCKED.
5. **Office tier-step magnitude** — **keep ~25×** (2K→50K at T1→T2); the social wall is intended. LOCKED.
6. **Side-faction speedup magnitude** — **~10–15%** off time-to-next-tier (supersedes the stale "≈halve"
   target, too strong now that tiers are 4–16 h); felt but optional, never required. LOCKED.


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
   store). The promotion is earned on **honesty + competence + the house's need** for a trustworthy indoor
   hand — *not* on identity. **[THREAD: Tama — seed only]** to the house he is simply a proven hand; **no one
   speaks the name "Tama"** yet. This plain baseline becomes the counterweight once the village names him at
   **T1-V0** (where the allegiance tension actually goes live).
7. **The first standing watch.** Stand a real gate-watch; clear the first pest/animal threats. Your **Arms
   deeds begin to accrue** — combat starts earning the house recognition (canon §E). The standing itself is
   formally **recorded at the foreman step** (beat 8 / R6: "the gate held, and the books say so").
8. **Basic repairs & the first *shinden* (the gate).** Drive the kura repair and begin the first *shinden*
   reclamation to a recorded result; the house edges off the foreclosure cliff; the **first combat-earned Arms
   standing is now recorded** ("the gate held, and the books say so"). Genemon, grudging, entrusts him
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
- **[THREAD: Tama] estate-side (SEED ONLY):** in T0 the house simply sees a hand who earns his place —
  **nobody speaks the name "Tama."** The legend **ignites in T1** (Sayo, V0); the estate's plain baseline then
  reads as the counterweight to the village's certainty (paid off T1–T2). Keep it foreshadow-only in T0
  (the dream + the porter's-knot); do not stage a Tama "debate" before the village raises it.

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

# T1 — The Valley (estate domain expands) (v1 full)

## T1.1 Overview

**Theme:** *the estate's domain expands from survival to anchoring its valley.* This tier is the **HOUSE
rising** — its standing climbs **friendly → TRUSTED** and its reach grows from its own land out across the
**village + estate + surrounding roads**. A fresh **estate rank ladder** is minted (V0→V7; cross-ref §1.5.1):
every rung is a rung **within the house's theme**, and at every rung you act **FOR THE ESTATE** out in the
valley — carrying its business, securing its roads, running its economy, holding office in its affairs, shielding
it. Asagiri's shops, craftsmen, inn, shrine, and the **kamikakushi legend** open up **around** that spine.

**Two parallel tracks:** the **estate ladder is the spine** (its milestones gate T2). Running alongside it is the
**village reputation web** — a *second, parallel reputation* (how the villagers *personally* regard you; per-shop
meters, the headman's personal regard, the inn/rumours social web, the Tama-vs-farmhand allegiance) that is
**fully completable** and an **optional accelerant** (~10–15% faster to T2), but **NEVER gates the spine**
(§1.5.4, §2.15). The inn's **rumours board** begins delivering optional light folklore on the side-track.

**Transition gate (T1→T2):** *"clean your room"* — estate healthy, **valley anchored under the house**, immediate
fires out → Lord **Munenori** first believes the house's impact *beyond* the estate is possible → a quest to grow
the house's **regional influence** (the domain expands again, to the Region); the region will introduce **rival
samurai houses** with more sway to surpass. **Required pillars:** Arms + Estate, first **Office** (errand-
authority; office in valley affairs; cash-crops online). **Estate stage span:** E1 Stabilising → E2 Recovering.

**Felt arc:** the *house's* world enlarges from one estate to a whole valley it comes to anchor; the legend's
warmth and ache pull at the MC; the first cash-crop (silk) and the first valley-scale danger arrive; the lord's
horizon lifts past the ridge.

## T1.2 Main-quest beats (toward the T1→T2 gate)

1. **Errands FOR the house, into the valley (V0).** The estate trusts the MC to carry its business past its own
   gate into Asagiri; first errands open the market/shop row (and, on the side, per-shop reputation meters).
   **[THREAD: Tama]** the headman's daughter **Sayo** names him "Tama" on sight — the living heart of the
   legend, igniting it this tier.
2. **Becoming a recognised hand of the house (V1).** The valley starts knowing the house's man — headman
   **Yagōemon** and the shops **acknowledge** him; combat keeps pace clearing valley pests/animals, securing the
   estate's near-ground. The inn & rumours board unlock (folklore begins, optional side-track).
3. **Securing the house's roads (V2, road-warden).** Make a stretch of valley road or the ford safe **in the
   estate's name** against bandits/animals; survive a real clear. The house's writ now reaches the roads;
   combat-earned **Arms** standing at valley scale.
4. **Running the valley economy for the house (V3).** Bring the valley economy and the estate's cash-crops to a
   recorded seasonal result — the **silk / sericulture *meibutsu*** sub-engine begins under weaver **Onatsu**
   (LOCKED; trade hard-capped ≤⅓ of Estate & Wealth). Broker meters appear. The estate's domain now reaches the
   valley's livelihood.
5. **Trusted of the headman (V4) — the skim surfaces.** Put a valley fire out on the estate's behalf: **Foreman
   Magobei's** rice-skim surfaces here (the T1 antagonist; see T1.3). The house earns its **first Office
   standing**; Yagōemon's *personal* regard rises on the side-track.
6. **Sworn man-at-arms of the house (V5).** Stand a real watch for the valley **in the house's name**; survive
   the first dangerous-road encounter; the first paid martial outsiders (**Gohei & Yatarō**) join as flavour
   retinue (E2). The estate becomes the valley's shield.
7. **Right-hand-in-waiting (V6) — agent over the valley.** The lord first believes the house's impact beyond the
   estate is possible; "clean your room" nearly done; the alliance/standing levers that point the house at the
   region appear.
8. **Agent of the house, the valley anchored (V7) — the gate.** Estate healthy, valley anchored under the house,
   immediate fires out — the capstone "clean your room" beat; standing now **TRUSTED**. The **region** map and
   the **T1→T2** quest open (the domain expands again, to the Region); rival samurai houses appear on the
   horizon. **Gate met.**

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

**Theme:** *the estate's domain expands to lead a region.* The HOUSE rises — a third fresh **estate rank
ladder** is minted (`G0→G7`, region-scale, ~8 rungs; see T2.2) on which the Kurosawa's standing climbs
**trusted → HONORARY MEMBER of the house** and its domain expands again, now spanning **estate + village +
region**: a cluster of valleys, the post-town **Sawatari-juku**, the upstream **Kuzuhara** ruins, the roads and
*sekisho* checkpoints. The region's **two incumbent rival samurai houses, Tomita & Akagi**, are the contest the
house must surpass (**G7 "leading house of the region" = the rivals dethroned**). **This is where both personal
threads RESOLVE** (canon §F): the **lost-child truth (Otsuru)** and the **origin / family reunions (incl. father
Jinpachi)** — both landing on the **Origin one-tier reputation side-track** (`O0→O5`, §3.6.2), which **opens at
G2** (doubly-earned: the dream has returned enough memory, and standing now lets the MC travel the controlled
*kaidō*) as an optional, fully-completable accelerant that **never gates the spine**.

**Transition gate (T2→T3):** *win the region* (the rival houses are no longer the leaders) → the castle-town
rulers **confer regional leadership** on the house and **invite** it in. **Required pillars:** Estate + Office
rising; Arms secures roads. **Estate stage span:** E2 Recovering → early E3 (regional reach; estate fabric runs
*ahead* of top personal rank, gated on pillars + a low rank floor, never the capstone).

**Felt arc:** the canvas becomes a region; the MC's *own past* finally opens (the warmest and most costly
payoff of the game); the house out-competes older/richer rivals; the spine's personal questions are answered —
**grounded and partial** — clearing the deck so T3/T4 carry the house's power rise alone.

## T2.2 Main-quest beats (toward the T2→T3 gate)

The region estate-ladder shape (LOCKED at §1.5.1; exact rung copy detailed in §3.6): the house's
**valley-envoy → road-captain of the cluster → broker of the post-town trade → arbiter between valleys →
recognised regional retainer → captain of the road-security detail → alliance-broker → leading house of the
region** (the rivals dethroned). Every rung stays in the **theme of the house** — you act FOR THE ESTATE across
estate + village + region, and the **house** confers each rank while the region's figures (the *toiya*, the
neighbouring headmen, **Tomita & Akagi**) acknowledge, contend, and finally cede (§3.6.1). Labour and combat
interleave throughout. The two personal threads land across the **Origin one-tier rep side-track** (`O0→O5`,
§3.6.2), which runs alongside this spine as an optional accelerant (it never gates).

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

The T2 antagonist is the **two rival houses** (canon §F: exactly two) — the region's **incumbent samurai
houses** when the Kurosawa arrive — with the scarred *rōnin* **Hanzaki** as the dangerous combat beat. They are
the **contest layer that rides the spine**: the "win the region" gate (G7) *is* surpassing them. **Both are
*goshi*/samurai houses that prospered while the Kurosawa fell**; both fight on **bought, lucked, or trained**
advantages — **never innate** (the talent-foil rule).

- **What they block:** **Tomita** (head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei**) underbids deals and
  courts the same valleys — contests on **money** + capital + connections + ruthlessness; **Akagi** (head
  **Gennai**) blocks the upstart Kurosawa on **precedence** — contests on **honour** + old standing;
  **Hanzaki** makes the trade pass unsafe (muscle-for-hire, often Tomita's).
- **How the rivalry ESCALATES across the `G0→G7` rungs (mirrors §3.6 / §3.6.1):**
  - **G0** — Tomita & Akagi harden from distant rumour into the region's two **incumbents**; Yasubei has already
    bought the consignment you wanted.
  - **G1** — the unsafe roads are partly Tomita's doing (their muscle, **Hanzaki**, skips their wagons and harries yours).
  - **G2** — at the Sawatari-juku *toiya* the Kurosawa factor registers **third**, below Tomita's berth and outside Akagi's precedence — the pecking order made visible.
  - **G3** — both neighbouring valleys are already courted by Tomita (cheaper grain) and watched by Akagi (older ties); you flip them by **out-supplying / out-arbitrating**, never force; the rivals can be **played against each other**.
  - **G4** — Kuzuhara's river-works (which neither rival touched) become the region's proof the **Kurosawa lead by building**.
  - **G5** — breaking the brigand roost **cuts off Tomita's hired teeth** (Hanzaki exposed as their muscle) and flips the safest road to Kurosawa wagons.
  - **G6** — the house brokers the region's alliances **over the rivals' heads**: **Akagi** settled by restoring its precedence (now at your side), **Tomita** isolated commercially — the détente that sets up the capstone.
  - **G7** — the rivals are **dethroned**: Akagi allied, Tomita out-competed into commercial détente (**never killed**) → the Kurosawa are the region's leading house → the castle-town invites the house in.
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
- **The origin reunions.** **[THREAD: Origin]** Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen — the rungs of the
  **Origin one-tier rep side-track** (`O0→O5`, §3.6.2); **access-only, ZERO gift; never gates the spine.**
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

**Transition gate (T3→T4):** a **"taste of Edo"** — the house is **called to staff & run the *domain's* Edo
establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence → the
national tier. **Required pillars:** **Office + Name** dominant; Arms/Estate as leverage.
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
   Edo" calls the house to staff & run the *domain's* Edo establishment (the *rusui-yaku* under the daimyō's
   *sankin-kōtai*, never its own). **Gate met.**

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

**The tier's mechanism:** the house's hands reach Edo **only inside the domain's body of work** — as the
daimyō's leading retainers, the Kurosawa help **staff & run the domain's Edo establishment** (the *rusui-yaku*),
and the MC equips, provisions, and burnishes the **daimyō's** biennial **sankin-kōtai** attendance; credit
accrues to the daimyō, and thence to the house. The Edo *yashiki* is the **domain's** — a corner of the
daimyō's compound, known to the house only through letters.

## T4.2 Main-quest beats (roadmap)

1. **The two conduits open (seeded late T3).** Genemon hands the MC a share of outfitting the **daimyō's**
   biennial journey (*sankin-kōtai*); the first sealed dispatch arrives from the domain's Edo residence (rusui
   **Konoe**).
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
- **Authenticity pass — RESOLVED (2026-06-25).** The **Standing & Office** pillar kanji is set to **官威
  (*kan'i*)**, "authority of office" (coined 政威 rejected); the R7 rung title is **地方役 (*jikata-yaku*)**,
  "home-field bailiff" (the grander *jitō-dai* dropped); *michi-ban* (road-warden) is **diegetic-only** (an
  in-house role the estate confers, not an attested bakufu office); and the **T4** arc has the house **staff and
  run the *domain's* Edo establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*), never its own.
  A routine follow-up confirm of humble *ashigaru*/household-tier titles vs aspirational narration may still
  run, but no design item is open.
- **Belief→cause tables are binding inputs to §2/§6** (the bestiary registry must contain **no belief-creatures**;
  yokai are INVESTIGATE-then-confront one-shots; exactly one ambiguous token at the boundary-stone).

## Items flagged for the human

1. **Authenticity pass — RESOLVED (2026-06-25).** The Standing & Office pillar kanji = **官威 (*kan'i*)**; R7 =
   **地方役 (*jikata-yaku*)** (home-field bailiff); *michi-ban* stays **diegetic-only**; **T4** = the house runs
   the *domain's* Edo conduit (*rusui-yaku* under the daimyō's *sankin-kōtai*), not its own. A routine confirm of
   humble *ashigaru*/household-tier title vocabulary vs aspirational narration may still run before T0–T2 dialogue
   is finalised, but no design item is open.
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

### Flagged for the human — ALL RESOLVED/CONFIRMED (2026-06-25)

> All four items below are **resolved by the human (2026-06-25)**: IndexedDB ✓ · RNG = **splitmix64 + named
> sub-streams** ✓ · **ordered forward migrations + raw backup (no cross-major-rewrite guarantee)** ✓ · `tier`
> **stored** ✓.

1. **RESOLVED: IndexedDB vs. localStorage → IndexedDB.** Canon/D-013 say IndexedDB; this section commits to it
   (single autosave + base64 export) for robustness. We accept IndexedDB's small async/boilerplate cost over
   localStorage's simpler-but-fragile sync API for a single-slot save.
2. **RESOLVED: RNG algorithm → splitmix64 + named sub-streams.** Low-stakes and reversible (it only affects the
   seed→sequence mapping, not any contract), but it pins save reproducibility once content ships — locked as
   **splitmix64** with named sub-streams for the seed format.
3. **RESOLVED: `schemaVersion` / migration policy → ordered forward migrations + raw backup.** Support ordered
   forward migrations indefinitely + a pre-migration raw backup; we will *not* guarantee cross-major-rewrite
   save compatibility (so a future ground-up schema change may legitimately retire very old saves with a clear
   message).
4. **RESOLVED: `core/state.tier` stored vs. fully derived → stored.** Tier is checkable from the influence
   thresholds, but a tier-up is also a story beat (it fires rewards/log). Store `tier` as the committed value
   (set by the tier-up intent) and treat threshold-progress as derived — rather than re-deriving tier purely
   from pillars on every load.

---

# §7 — Milestone Roadmap, v1 Scope & Deployment

> **DRAFT — awaiting human review.** Authored end-to-end from the LOCKED CANON
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md),
> incl. its **§I v1 scope** and the human-signed **§I-bal §4 BALANCE LOCKS**) and the drafted PRD
> §§1–6 (esp. §1 vision/pillars/factions/endgame, §2 systems catalog, §3 the unlock ladder, §4 the
> balance model, §5 the narrative, §6 the tech architecture). This is the **last PRD section** and the
> one that, once approved, unlocks code (§ "How to read this document": *no code is written until §7 is
> approved*). It commits the **definitive v1 scope**, an ordered **milestone roadmap** of verifiable
> vertical slices, the **deployment** path to itch.io, and a **risk register + scope-risk
> posture**. It references other sections by number and **defers all numbers to §4**; here we fix the
> *build order*, the *cut-set*, and the *release gate*, never the magnitudes.
>
> **Canon honoured throughout:** pure-core / deterministic / **single seeded RNG** (§6.2, §6.7);
> **active-only v1 — NO idle/offline layer** (auto-producers T3+ only, §4.7.4); **no
> people-management sim** (building/recruiting are flavour wired to the reveal bus, §1.5.1); **combat
> first-class & EARLY, combat EARNS Arms** (§1.2 pillar 4, §4.6); **no magic / grounded** (§1.2
> pillar 7); **K/M/B** number display + **macron** romanization (§6.9, §6.6); **no reset, ever**
> (§1.2 pillar 1). Locked pacing shape (saga ≈ 28.5 h; T0 ≈ 4.5 h / T1 ≈ 8 h / T2 ≈ 16 h; ≥30-min
> per-rank floor) is **LOCKED by human 2026-06-25** (canon §I-bal) and treated as a release acceptance
> criterion, not a lever.

## 7.0 How to read this section

§7 turns the design (§§1–6) into a **build plan**. It has four parts:

1. **§7.1 v1 scope (definitive)** — exactly what ships, the lean cut-set, the locked pacing target, and an
   explicit PARKED/CUT list (so "what's *not* in v1" is as legible as what is).
2. **§7.2 Milestone roadmap (M0…M7)** — the build order as a sequence of **vertical slices**, each
   leaving the build working, `npm run verify` green, and a crisp **definition-of-done**. Sequenced to the
   §3 reveal ladder and the §6 architecture.
3. **§7.3 Deployment** — the static itch.io build, the export/import save path, the `npm run verify`
   release gate, and a brief "how to ship."
4. **§7.4 Risk register + scope-risk posture** — the top risks and how we hold scope. **v1 = full T0–T2,
   non-negotiable (no pre-planned descope).**

**The cardinal build rule (from CLAUDE.md + §6):** every milestone is a *vertical slice* — it touches
core + content + renderer + tests together and **leaves `npm run verify` green and the game playable** to
its current frontier. We never build a horizontal layer (e.g. "all of combat") in isolation; we build the
**next playable beat** end-to-end. This is the agentic working cadence (*pick → build → verify → commit →
journal → repeat*) made into a roadmap.

---

## 7.1 v1 scope (definitive)

### 7.1.1 What v1 IS

**v1 = Tiers 0–2 complete** (canon §I): the **Estate** (T0), the **Village** of Asagiri (T1), and the
**Region** (T2) **including the T2 personal-mystery payoff** (the lost-child **Otsuru** resolution and the
**Origin** reunions incl. father **Jinpachi** — §3.6 G6, §5 T2). **T3 Castle-town ships only as a STUB
cliff-hanger** (the §3.7.1 first-contact screen at the G7 capstone — "the page turns onto stone walls, and
the story pauses"); **T4 Edo is roadmap only** (sketched in §3.7.2, not built).

**The lean cut-set (canon §I; §1.2 pillar 3) — what "complete" means per tier:**

| Dimension | v1 cut-set | Source |
|---|---|---|
| **Rank ladders** | a **fresh ~8-rung ladder per tier** × 3 tiers: T0 `R0–R7`, T1 `V0–V7`, T2 `G0–G7` (24 rungs total) | §3.2 / §3.4 / §3.6 |
| **Bestiary** | **~5 grounded mobs** core (boar, wolf, monkey, bandit, ronin/smuggler) — NO belief-creatures in spawn tables | §4.6, §6.5 `enemies.ts`, canon §E |
| **Quest types** | the **4 types**: PEST-CONTROL · HUNT · CLEAR · DEFEND (DEFEND is the Arms earner) | §3.2 R5, canon §I |
| **World** | **full walkable maps T0–T2** within a **~6–8-node-per-tier** cut-set (canon: full maps every tier, not abstract boards) | §1.7, §3, canon §I |
| **Skills (LOCKED v1 set)** | **farming · foraging · woodcutting · fishing · smithing · cooking** + **conditioning** + **2–3 weapon lines** | §1.5.1, §4.5, canon §G |
| **Estate stages** | **E0 → E1 → E2** (Foreclosure's Edge → Stabilising → Recovering); E3–E5 parked | §1.5.1, §4.7.5 |
| **House Influence** | the **four pillars** (Arms / Estate & Wealth [trade ≤⅓] / Standing & Office / Name & Honour), the four-bar panel, achievement-jump + seasonal-judged accrual, simple per-tier required-pillar thresholds | §1.6, §4.1–§4.2 |
| **Crafting** | **hybrid**: simple recipes from T0-R4; the component/quality system from T1-V3 | §4.7.2, §3.4 |
| **Save** | IndexedDB single autosave + base64 export/import; versioned minimal-state | §6.8 |

### 7.1.2 The locked pacing target (acceptance criterion, not a lever)

Per canon **§I-bal** (human-signed) and §4.8: **v1 total ≈ 28.5 h** of active play —
**T0 ≈ 4.5 h · T1 ≈ 8 h · T2 ≈ 16 h** — with a **≥ ~30-min-per-rank floor** (no single rung advances
faster). (The canon "≈ 32 h" figure includes the post-T2 stub runway / free-play tail; the *built*
content sums to ≈ 28.5 h — §4.8.4.) This is **LOCKED**: the **M6 balance pass** (§7.2) treats the
per-tier hour budgets and the ≥30-min floor as **CI-enforced acceptance criteria** (a headless
playthrough that clears any rung in < ~28 min, or misses a tier budget, **fails the pacing test** —
§4.8.4, §6.10). Tuning retunes *yields*, never these targets.

### 7.1.3 PARKED / CUT for v1 (designed, not deleted — "park, don't delete")

Per the lean discipline (§1.2 pillar 3, §1.7.1). **Parked = reintroduce later, deliberately**; nothing
here is a design hedge — the *shape* is decided, only the *authoring* is deferred.

| Parked item | Where it returns | Source |
|---|---|---|
| **Estate stages E3–E5** (fortified seat → restored-and-surpassed) | T3+ | §1.5.1 |
| **The Matagi hunters, the Pilgrimage Order, the Scholars-&-Physicians *network*** (keep Ranpo / Obaa Sato as seeds only) | T3+ | §1.7.1 |
| **Auto-producers** (any idle/seconded-helper layer) — **v1 is active-only, no idle layer** | T3-C1 first; scaffold only in v1 | §4.7.4, canon §G/§H |
| **The marriage / adoption status lever** (a real T3/T4 alliance lever; numbers deferred) | T3-C5 | §1.7.1, §4.3 |
| **Deeper upper-tier world nodes** (the *Daikan's* office, the Edo *yashiki* / rusui conduit, the full finance network, the High Mountains & Pass) | T3 / T4 | §1.7.1 |
| **The national *mitate* / parody-*banzuke*** (the Edo finale presentation) | T4-E7 | §3.7.2 |
| **No respec** (attributes & skill-milestone choices committed — explicitly out of v1) | post-v1, reconsider | §4.4, §4.5, canon §I-bal |

> **Hard guardrails that v1 must NOT violate** (canon, machine-checked by the content verifier §6.6 — see
> M6): no belief-creature in any spawn table; trade ≤⅓ of Estate & Wealth; ≤1 residual-ambiguity token;
> no labour→combat training-rate cross-feed; no passive Influence trickle (jumps + seasonal-judged only);
> no permanent holding-loss / no Influence wipe; force-fictionalised real names; macron romanization;
> hard-capped martial scale (a small named retinue, never a standing army).

---

## 7.2 Milestone roadmap (M0 … M7)

Each milestone is a **vertical slice** ending **green** (`npm run verify` passes — §6.1) with the game
playable to its frontier. The spine follows the §3 reveal ladder (cold open → T0 rungs → T1 → T2) layered
onto the §6 architecture (core boundary first, content registries throughout). "Lands" lists the
§-systems the slice makes real; "Definition of done" is the verifiable bar.

> **Granularity note.** M1–M5 are content-tier slices; each is internally **rung-by-rung** (a sub-slice
> per `RevealableEntry`, per §3 / §6.5) so a milestone never stalls the build — the smallest shippable
> unit is *one rung's reveal end-to-end*. Combat (the densest stretch) is **two fixed, planned milestones**
> split up front at the natural seam: **M2a = idle auto-resolve + first fight**, **M2b = bestiary /
> equipment / loot→craft** (the §3.2 R3→R4 boundary). This is not a conditional split — M2a and M2b are
> separate milestones each ending verify-green.

### M0 — Toolchain bootstrap + the cold open + save spine

**Goal:** stand up the deterministic, testable foundation and the one hand-authored pre-ladder state — the
narrowest possible *complete* game (one screen, one verb, a save you can export).

**Lands (§-systems):**
- The **toolchain** (§6.1): Vite + TypeScript (strict) + Vitest, ESLint + Prettier, the committed
  `package.json` + lockfile, and the **`npm run verify`** gate wired (typecheck + lint + format + unit +
  the content-verifier + `gen:docs --check`).
- The **pure-core / renderer split** (§6.2): `src/core` (pure, no DOM), `src/ui` (thin DOM), `src/app`
  (composition root + the active-only tick loop), `src/persistence` — with the **ESLint boundary rules**
  (no `Math.random` in core; no DOM/window/`Date.now` in core) live as build failures.
- The **one seeded RNG** (§6.7) in `GameState`; the `reduce` / `tick` contracts (§6.3); the **rewards /
  unlock bus** (`applyRewards`, §6.5) and the **UI-reveal engine + event log** (§2.1, §3.0) — the engine
  the entire game is built on.
- The **content-verifier harness** (§6.6) and **`gen:docs`** (even with a near-empty registry — the
  scaffolding that makes generate-don't-duplicate enforceable from commit #1).
- The **DEV play API** `window.__qa` (§6.10), DEV-only / dead-code-eliminated.
- The **cold open** (§3.1, §5 T0.2 beat 1): the single screen, the persistent event log, the one verb
  ("Open your eyes" → "Rake the spilled rice"), the body/rest bar + rice counter, Ranpo's grounding line,
  the first dream-fragment (ZERO bonus).
- **IndexedDB single autosave + base64 export/import** + versioned minimal-state + the migration chain
  scaffold (§6.8).

**Definition of done:** `npm run verify` green; a fresh game loads in **< 5 s to first interactable**
(§4.8.0); pressing the verb rakes rice, ticks the koku counter, and pushes a log line; the state autosaves,
exports to base64, and re-imports identically; a Vitest **determinism test** asserts a fixed seed + fixed
intent/tick script yields a byte-identical `GameState` (§6.3); `__qa.newGame(seed)` / `dispatch` / `tick`
drive the real intents headlessly. **No game logic in the renderer; no `Math.random` in core** (lint
proves it).

**Phases / high-level tasks:**

1. **Stand up the toolchain, the pure-core boundary & the verify gate** — `npm run verify` runs green on an empty src/core·ui·app·persistence skeleton, and the ESLint boundary rules FAIL the build on a planted Math.random or DOM/window/Date.now/indexedDB import inside src/core. *(§6.1, §6.2)*
2. **Build the core spine: GameState + the one seeded RNG + reduce/tick** — The pure core compiles with a stored-vs-computed GameState (M0 surface: schemaVersion, rng, clock, vitals, resources, flags, unlocked, log), createInitialState(seed), the seeded RNG living IN GameState (pure next + int/chance/pick helpers), and reduce(state,intent)/tick(state,dtTicks) as deterministic, immutable-in/out pure functions of (state,input) covering the cold-open intents (open_eyes / rake_rice / rest) and a per-tick·day·season scheduler skeleton. *(§6.2, §6.3, §6.4, §6.7)*
3. **Build the reveal engine: rewards/unlock bus + event log + the surfaces registry** — A flag/threshold flip fires exactly ONE event through core/rewards.applyRewards that simultaneously reveals a surface, pushes its diegetic log line (capped ring buffer in core/log), and sets the flag; visibleSurfaces(state)/isUnlocked drive a data-driven content/surfaces.ts holding only the cold-open RevealableEntries — all unit-tested. *(§2.1, §3.0, §6.5)*
4. **Make the content-verifier & gen:docs real** — scripts/verify-content.ts cross-checks ids across the (near-empty) registries with no orphan SurfaceIds and enforces the M0-applicable canon invariants (≤1 ambiguity token, macron/no-plain-ASCII-romaji lint), and scripts/gen-docs.ts writes a generated doc into docs/content/ with `--check` failing on drift — both replace the task-1 stubs and run green inside npm run verify. *(§6.6, §6.5)*
5. **Build the save spine: IndexedDB autosave + base64 export/import + migration chain** — src/persistence round-trips the STORED surface of GameState (§6.4 only — derived recomputed on load) through save→base64→load byte-identically (unit-proven), runs an ordered, pure, unit-tested schemaVersion migration chain, degrades gracefully on a corrupt save, and is never imported by core. *(§6.8, §6.4)*
6. **Build the app composition root: active-only tick loop + DEV play API** — src/app wires core↔persistence↔ui with an active-only tick loop (computes dtTicks from active elapsed time → pure tick; pauses on background, no offline catch-up), debounced autosave on meaningful intents + visibilitychange/beforeunload, and a DEV-only window.__qa (state/dispatch/tick/frames/pause/resume/newGame/save/load/forceState/setSeed/selectors) that drives the REAL typed intents and is dead-code-eliminated from the production bundle. *(§6.10, §6.3, §6.9, §6.8)*
7. **Render the cold open — the diegetic beat** — src/ui is a thin DOM renderer (zero game logic, dispatch-only, single render(state) reconciliation) showing the single-column cold-open screen — persistent event log as an ARIA live region + one verb — that walks the §3.1 reveal order: "Open your eyes" reveals the body/rest bar + rice counter and flips the verb to "Rake the spilled rice"; raking ticks the koku counter and pushes a log line; the rest verb appears; Ranpo's grounding line and the first dream-fragment land as a ZERO-bonus log line (no panel, no mechanical effect). *(§3.1, §5 T0.2 beat 1, §2.1, §2.3, §2.4, §6.9)*
8. **Lock the DoD: determinism test + headless cold-open acceptance + verify-green checkpoint** — A Vitest determinism test asserts a fixed seed + fixed intent/tick script yields a byte-identical GameState (snapshot/structural hash); a __qa-driven headless test (newGame(seed)→open_eyes→rake_rice) asserts koku increments, the log line, and the §3.1 surfaces revealing in order; load-to-first-interactable is confirmed < 5s and the save round-trip identity holds end-to-end; `npm run verify` is green — the M0 Definition of Done is met. *(§6.3, §6.10, §4.8.0, §7.2 (M0 DoD))*

### M1 — T0 labour loop + rank ladder R0→R2 + skills + estate E0→E1 (start)

**Goal:** the peaceful-labour spine — earn your keep room by room, the first three rungs, the Skills tab,
the first separate estate-room reveals.

**Lands:** the **labour loop** (§2.6: farming → foraging → woodcutting → hauling) on the *koku*/rice
heartbeat (§2.4); **rungs R0→R2** (§3.2) on the **Estate Service** meter (§2.15); the **Skills tab**
(§2.7) as the **first nav reveal** (§3.5) with discover-by-doing visibility (§4.5); the **separate** T0
room reveals — Gate & Forecourt, Home Paddies, Stables & Woodlot Edge — each its own beat (§3.3, canon §I
LOCKED-separate rule); the **world-clock** (day/season tag, §2.2) and **soft stamina/satiety** (§2.3); the
**porter's-knot** identity beat (ZERO bonus); the **Near Satoyama** first danger ring (conditioning-gated,
discover-by-doing). Estate stage **E0 → start of E1**.

**Definition of done:** verify green; a headless run via `__qa` reaches **R2**, the Skills tab fades in on
schedule, ≥3 skills surface by-doing, the world-clock advances and seasons turn, soft stamina paces the day
(slows, never hard-blocks); the first generated content doc (`docs/content/ranks.md`) regenerates and
`gen:docs --check` passes; per-rung pacing is *instrumented* (the ≥30-min-floor test exists, even if final
tuning lands at M6).

**Phases / high-level tasks:**

1. **Author the M1 content registries + balance constants** — Done when the data-as-code registries for this slice exist and the content-verifier is green: activities.ts (farm/forage/woodcut/haul nodes — skill, yields, season window, dangerRing, staminaCost, reveal predicate), resources.ts rows (koku + wood + sansai), skills.ts (the ~4 T0 labour skills with visibility threshold), areas.ts (Kura, Gate & Forecourt, Home Paddies, Stables & Woodlot Edge, Near Satoyama ring), ranks.ts (R0→R2 rungs + earn-conditions), surfaces.ts (Skills tab, room panels, clock + stamina readouts, new resource rows — each with its unlock predicate), and balance.ts holding the §4 constants by reference; every id resolves, no orphans. *(§6.4, §6.5, §6.6, §2.4, §2.6, §2.7, §3.2, §3.3, §4 (constants referenced, not restated))*
2. **Build the active labour loop + skill-XP core** — Done when dispatching do_activity for farming/foraging/woodcutting/hauling resolves through the pure core: yields koku/materials per the §4.7.1 formula (baseYield·(1+0.04·skill)·toolMult·seasonMult·stamina-rate), grants per-skill XP under the §4.5.2 per-event cap, derives levels from the §4.5.1 curve, and surfaces a skill at its §4.5 visibility threshold — all routed through the rewards/unlock bus and the one seeded RNG, with Vitest covering yield/XP/visibility. Pure-core only (lint proves no DOM/Math.random/Date.now); no idle/auto-producers (active-only). *(§2.6, §2.7, §2.4, §4.7.1, §4.5, §6.2, §6.3, §6.5, §6.7)*
3. **Build the world-clock, seasons + soft stamina** — Done when tick() deterministically advances the abstract clock and runs the per-tick/per-day/per-season scheduler: seasons turn spring→summer→autumn→winter (kanji day/season tag), node productivity is season-gated with the autumn ×3 harvest multiplier (§4.7.1), the per-season judged-appraisal hook fires on a new high-water mark (scaffold only — full pillar accrual lands at M3), and soft stamina/satiety drains on labour and soft-throttles the action rate (slows, never to zero, never hard-blocks) with a rest verb recovering it. Vitest asserts seasons turn and stamina throttles-not-blocks. Active-only — no offline catch-up path exists. *(§2.2, §2.3, §4.7.1, §6.3 (tick/scheduler), §6.4 (clock/vitals stored fields))*
4. **Wire the Estate Service meter, R0→R2 ladder + separate room reveals** — Done when the Estate Service standing meter (§2.15) accrues from recognized labour and crosses the R0→R1→R2 rung gates (R0 cold-open complete → R1 spilled-rice/first real work → R2 a season of reliable labour), each promotion firing its RewardBundle through the single rewards/unlock bus to reveal surfaces + push its diegetic log line, with the canon §I SEPARATE room reveals honoured (Gate & Forecourt + Home Paddies at R1; Stables & Woodlot Edge at R2 — each its own beat, never folded into the forecourt) and the estate stepping E0 → start of E1 as flavour (no management sim). Vitest asserts each rung flips at the intended GameState and rooms reveal individually. *(§2.15, §3.2, §3.2.1, §3.3, §2.17, §5 T0.2/T0.4, §6.5 (ranks/surfaces), §6.3)*
5. **Land the Skills-tab nav reveal, Near Satoyama ring + porter's-knot beat** — Done when the first navigation chrome appears (the Work column splits to Work + Skills at R2 per §3.5) with ≥3 skills surfaced discover-by-doing; the Near Satoyama first danger ring surfaces as a FIRST-USE conditioning-gated reveal (§3.3); and the porter's-knot Origin beat fires once with ZERO mechanical effect — a one-shot story flag + log line, no panel, no stat, no flag-read edge (the no-hidden-edge guard, asserted in Vitest). All wired as data through the reveal bus. *(§3.5, §3.3, §2.7, §4.5, §1.9 / §5 T0.2-T0.7 (Origin thread, ZERO bonus), §2.9 (danger ring))*
6. **Wire the thin renderer for every M1 surface** — Done when the game is playable to R2 in the browser: a single render(state) path paints the Work column (labour verbs), the Skills tab/screen, the room/area panels, the clock + season tag, the soft-stamina bar + rest verb, and new resource rows — each appearing only when its surfaces.ts predicate unlocks, each first reveal pushing its diegetic log line. The renderer holds zero game logic and only dispatches the same intents __qa uses (ESLint boundary rule proves it). *(§2.1, §3.5, §6.9, §6.2 (boundary))*
7. **Generate docs, headless-QA the R2 run + instrument pacing** — Done when npm run verify is green end-to-end: gen:docs emits docs/content/ranks.md from the registries and gen:docs --check passes; a fixed-seed determinism replay test yields a byte-identical GameState; a __qa headless run reaches R2 asserting each unlock fires at its intended state, the Skills tab fades in on schedule, ≥3 skills surface by-doing, seasons turn, and stamina throttles-not-blocks; and the per-rung ≥30-min-floor pacing instrumentation test exists (final tuning deferred to M6). *(§6.6 (gen:docs/verifier), §6.10 (__qa), §6.3 (determinism replay), §4.8.0/§4.8.1 (pacing floor — instrumented, not tuned), §7.2 M1 DoD)*

### M2a — Combat goes live at R3 (idle auto-resolve + active setup) + the humbling first fight

**Goal:** combat as a first-class pillar **from T0** — the humbling near-fatal first fight, the drill yard,
and the deterministic, seeded auto-battler — unit-testable in isolation. *(Fixed milestone; the first half of
the combat slice, split up front at the R3→R4 seam — see the granularity note.)*

**Lands:** the **R3** rung (§3.2) gated on the **humbling first fight** (the wolf at the grain store,
survived by luck — §5 T0.4); the **Combat panel** (§2.8) and the **deterministic, seeded auto-battler**
(§4.6: idle auto-resolve + active stance/ability/item/retreat; the §4.6 combat math, damage floor,
crit/block, attack-speed cadence); the **first-fight win-rate 20–35%** target (§4.6.6, **LOCKED**); the
**soft-setback-on-loss** rule (1 HP + ~½-day + light injury + possible carried-loot drop — **never**
levels/gear/Influence; **LOCKED** shape, §4.6.6); combat/weapon **skills** in the Skills tab seeded; the
**Drill Yard** revealed *separately* (§3.3); the **Combat nav node** (§3.5). The **no-cross-feed** wall is
enforced (conditioning is a one-way enablement gate; §4.4/§4.6.6).

**Definition of done:** verify green; a headless run reaches R3 and triggers the first fight; a fixed-seed
fight **replays byte-identically** (§6.7) and a forced-seed rare crit/loot renders correctly via `__qa`; a
Vitest test confirms the fresh-MC first-fight win-rate sits in **20–35%** and a post-drills MC ~85%+
(§4.6.6); a loss applies the soft setback and **never** removes a level/gear/Influence (asserted); **no
labour conditioning bonus enters any combat number** (asserted). The auto-battler is unit-testable in
isolation (no bestiary/equipment dependency).

**Phases / high-level tasks:**

1. **Combat data model + balance constants (types & content scaffold)** — core/combat exports the Combatant / CombatEncounterState / Stance / CombatDeedsPool / InjuryState types; the §4.6 combat tunables (DAMAGE_FLOOR formula, CRIT_MULT, BLOCK_REDUCTION, baseSpeed + SPD coefficient, COMBAT_XP_K) live in content/balance.ts referencing §4 values; combat/weapon skills are registered in content/skills.ts, the crude carrying-pole weapon and the wolf are added as minimal Combatant fixtures (NOT the full bestiary/equipment registries — kept isolated so the engine has no enemies-registry dependency), and stances are defined — typecheck + content-verifier green. *(§2.8(c), §4.6.1, §6.4, §6.5)*
2. **Deterministic seeded auto-battler (core/combat engine)** — A pure fixed-step CombatSim resolves a live fight stepped by core/step's per-tick path: derived stats (§4.6.1), the sub-tick attack-speed accumulator (§4.6.2), hit-vs-evasion + damage-minus-defence with the canon floor (§4.6.3), separate seeded crit/block rolls (§4.6.4), and on-kill XP + combat-skill XP + a per-event-capped Arms deed-count hook (§4.6.5) — all draws from the one seeded RNG and active intervention runs through the combat_action intent (stance/ability/item/retreat); no DOM / no Math.random; loot tables and the full Arms pillar conversion are deferred (M2b / M3). *(§2.8, §4.6.1–§4.6.5, §6.2, §6.3, §6.7)*
3. **Combat unit tests — determinism + the LOCKED win-rate band + no-cross-feed** — Vitest proves a fixed-seed fight replays byte-identically (§6.7); the fresh-MC-vs-wolf win-rate sits in the LOCKED 20–35% band and a post-drills MC (~weaponSkill 5 / attrs 10) reaches ~85%+ (§4.6.6, values referenced not invented); the damage floor guarantees every fight terminates; and an assertion confirms no labour-conditioning value enters any combat stat or training rate (the no-cross-feed wall) — verify green. *(§4.6.6 (LOCKED), §4.4, §6.7)*
4. **Soft-setback-on-loss + the conditioning enablement gate** — A lost fight applies the full LOCKED setback shape via core/rewards + reduce/step — drop to 1 HP, advance ~½ day, a random light recoverable injury (effects[], ~1–2 days, −10% one stat), and a possible seeded carried-loot drop — and a test asserts it NEVER removes a level, equipped gear, or Influence (the only Influence move being a scripted Arms dent if the lost fight was a defence-deed, §4.2.4); the R3 conditioning floor is implemented purely as a one-way access predicate granting ZERO combat/training bonus. *(§4.6.6 (LOCKED shape), §4.2.4, §4.4, §1.13, §6.5)*
5. **R3 reveal content — the humbling first fight, Drill Yard & Combat surfaces on the reveal bus** — Reaching the conditioning floor triggers the scripted wolf-at-the-grain-store fight (survived by luck, never rescued/skill); surviving it then begging Jūbei flips the R3 rung (ranks.ts, STORY gate) and, through applyRewards/unlock predicates, SEPARATELY reveals the Drill Yard (§3.3) + the Combat panel + the Combat nav node (§3.5) and surfaces combat/weapon skills discover-by-doing — each pushing its diegetic event-log line (Jūbei's creed beat); the full Bestiary + Equipment/Inventory panels stay deferred to M2b (M2a uses the crude pole + wolf/sparring-target as the fixed setup). *(§3.2 (R3), §3.3, §3.5, §5 T0.2 (beats 4–5) / T0.4 / T0.5, §6.5)*
6. **Renderer wiring — Combat panel & Drill Yard (thin DOM, animates the result)** — src/ui renders the Combat panel and Drill Yard for unlocked surfaces only: stance/ability/item/retreat controls dispatch combat_action intents, HP bars and swing/crit numbers animate the deterministic outcome (never decide it), and win/loss + the soft setback display — responsive and not hover-dependent (emoji/CSS register), with zero game logic in the renderer. *(§6.9, §2.8(b), §3.5)*
7. **DEV play-API combat hooks + headless QA + verify-green checkpoint** — window.__qa can drive a headless run to R3 and trigger the first fight, setSeed/forceState a rare crit, and replay a fixed-seed fight (§6.10); a capture-game-states headless pass confirms R3 is reached, the fight auto-resolves, and the forced-seed rare crit renders (loot deferred to M2b); gen:docs --check regenerates the ranks/skills content docs and the content-verifier's no-cross-feed invariant passes; full npm run verify is green (typecheck/lint+boundary rules/unit/verifier/gen:docs) — meeting the M2a definition of done with the auto-battler isolation-tested. *(§6.10, §6.6, §6.1, §4.6.6)*

### M2b — Bestiary + equipment + the loot→craft gear loop

**Goal:** complete the combat slice — the bestiary fills by encounter, the equipment/inventory panels land,
loot tables drop, and the find→craft gear loop closes (R3→R4). *(Fixed milestone; the second half of the
combat slice.)*

**Lands:** the **Bestiary** (§2.9, the ~5 grounded mobs filling **by-encounter**); **Equipment & Inventory**
(§2.10) + the first crude weapon; **loot tables** wired into the auto-battler's seeded resolution; the
**find→craft gear loop** (loot feeds the simple crafting recipes, §4.7.2) carrying into R4. Equipment stats
flow into the §4.6 combat math; weapon-line skills surface by-doing in the Skills tab.

**Definition of done:** verify green; a headless run via `__qa` fills the Bestiary by-encounter and drops
seeded loot that **replays byte-identically** (§6.7); the equipment/inventory panels equip and the gear
stats enter the combat numbers (asserted); a found→crafted weapon completes the loot→craft loop end-to-end;
the generated content docs (e.g. `docs/content/enemies.md`) regenerate and `gen:docs --check` passes.

**Phases / high-level tasks:**

1. **Author bestiary, equipment & loot-table data registries** — content/enemies.ts holds the ~3 remaining grounded T0 grindable mobs (wild boar, crop-raiding-monkey troop, rice-rats + a mamushi — the M2a wolf already exists) with stats/lootTableId/spawnWeightByRing, kept in a registry SEPARATE from an (empty/scaffold) BeliefBeast registry; content/items.ts holds the first crude weapon + found-gear EquipDefs (slot, statMods, durabilityMax) and LootTable + per-ring SpawnTable entries land in content/areas.ts with rarity weights referenced from balance.ts (per §4.7.3, no restated numbers); the content-verifier is extended to assert no belief-creature appears in any spawn table and every loot/item/recipe id resolves; verify stays green on pure data + types. *(§2.9, §2.10, §6.4, §6.5, §6.6, §4.7.3)*
2. **Wire equipment into the §4.6 combat math + equip/durability intents** — effectiveStats (core/selectors) folds an EquipState's gearAtk/gearDef/gearEva/gearHp/gearBlock into the §4.6.1 combatant model; reduce handles the existing equip/unequip intents and applies durability wear immutably (structural sharing, no Math.random/Date.now in core); a fixed-seed fight's resolved numbers provably differ with gear equipped vs not; verify green. *(§4.6.1, §4.6.3, §4.6.4, §6.3, §6.4)*
3. **Seeded on-kill loot roll + bestiary discover-by-encounter** — the auto-battler's on-kill path draws exactly one seeded LootTable roll (§4.6.5 + §4.7.3, rare/fine weight scaled by the §4.7.3 LUCK coefficient) through the single RNG into inventory, and weighted per-ring spawn selection picks the active-encounter mob; a mob's first encounter flips its Bestiary entry unlocked (one at a time); all rolls thread state.rng so a fixed-seed run replays byte-identically; verify green. *(§2.9, §4.6.5, §4.7.3, §6.7)*
4. **Close the simple find→craft gear loop** — content/recipes.ts holds the simple-mode recipe(s) (flat inputs→output, ~100% success per §4.7.2, Smith Gonta seed) fed by dropped loot materials; reduce handles the craft and disassembly intents (disassembly returns ~60% materials per §4.7.2); a crafted weapon is equippable and its stats reach the combat numbers — find→craft→equip is closed end-to-end in core; verify green. *(§2.10, §2.11, §4.7.2, §6.3)*
5. **Unit tests: determinism, loot replay & the gear/loop assertions** — Vitest suites assert a fixed-seed loot/spawn sequence replays byte-identically, gear stats measurably enter the §4.6 combat numbers, the found→crafted weapon completes the loop end-to-end, the Bestiary fills strictly by-encounter, and the canon invariants still hold (no labour→combat cross-feed enters any combat number; no belief-creature in spawn tables); verify green with the new suites. *(§6.6, §6.7, §4.6, §4.7.2)*
6. **Render Bestiary / Equipment / Inventory panels + the R3 reveals** — content/surfaces.ts registers the three panels (and the first-crude-weapon grant) with R3 unlock predicates; the thin-DOM renderer paints them as a pure function of GameState (Bestiary entry-by-entry, equip slots with durability, inventory counts with colour + icon/label rarity cues per §6.11) and equips only by dispatching intents; each panel's first reveal pushes its diegetic §3.2-R3 log line via the rewards/unlock bus; verify green. *(§2.9e, §2.10e, §3.2 (R3), §6.9, §6.11)*
7. **Generated docs + headless QA close-out (the R3→R4 gear beat)** — gen:docs regenerates docs/content/enemies.md (plus items/recipes tables) from the registries and gen:docs --check passes; a headless __qa playthrough proves the DoD — Bestiary fills by-encounter, seeded loot replays byte-identically, equipping moves the combat numbers (asserted), and a found→crafted weapon completes the loop carrying toward R4 (Smith Gonta beat); a capture-game-states audit snapshots the new panels; final npm run verify green. *(§6.6, §6.10, §3.2 (R3→R4), §5 T0.6)*

### M3 — Quests + crafting + four-pillar accrual + the four-bar panel (R4→R7) → T0 complete

**Goal:** close out T0 — the quest system, hybrid crafting, the four House-Influence pillars accruing, and
the four-bar panel revealing bar-by-bar at the capstone.

**Lands:** rungs **R4→R7** (§3.2); the **simple Crafting tab** + the early **loot→craft loop** at R4
(§4.7.2, Smith Gonta seed); the **Main House** interior + domestic economy (Cooking, provisioning) at R4;
the first ***shinden* reclamation** (a LAND lever) and **E1 build** (§4.7.5); the **Quest log + the 4 quest
types** at R5 (PEST-CONTROL → HUNT → CLEAR → DEFEND, §3.2); the **four-pillar accrual model** (§4.2:
achievement jumps **≈70%** + seasonal judged-on-high-water-mark **≈30%**, per-event-capped, up-only + the
recoverable-dent scaffold); the **first combat-earned Arms standing recorded at R6** (canon: combat earns
Arms); the **Workshops & Granary** + **E2 start**; the **four-bar House Influence panel** revealed
**bar-by-bar** at R7 (§3.2, §2.16); the **House screen** + the per-tier domain-ranking "unranked" read
(§3.5, §2.18); the **T0→T1 gate** (Arms ≥ 0.5K · Estate ≥ 0.8K + the story gate, §4.1) wired.

**Definition of done:** verify green; a headless run completes **all of T0** to the T0→T1 gate; the
four-bar panel reveals one bar at a time as each pillar first scores; the **trade ≤⅓** invariant holds at
every accrual point (verifier-asserted, §4.2.3); accrual is **jumps + seasonal only** (no time-trickle / no
flat per-action — verifier-asserted); the deeds/seasonal split lands ≈70/30 over T0 (§4.8.1); the autumn
harvest sets the headline seasonal high-water mark; the T0→T1 transition fires its story beat + log line.

**Phases / high-level tasks:**

1. **Build the four-pillar Influence accrual engine (core + data + tests)** — Done when content/influence.ts holds the 4 pillars, per-tier required thresholds and the deed registry (values referenced from §4.1/§4.2, not restated); applyRewards' pillarDeltas produce capped achievement JUMPS (PER_EVENT_CAP_FRACTION), the per-season tick hook produces JUDGED RESULTS (TIER_REF-normalized, sqrt-shaped, high-water-mark up-only, JUDGE_K back-solved), the trade≤⅓ clamp (tradeAllowed=0.5·(land+treasury)) applies at every accrual point, and the recoverable-dent scaffold exists — all in pure core (no DOM/Date.now/Math.random); Vitest proves caps bind, trade≤⅓ holds, accrual is jumps+seasonal only (no trickle/no flat-per-action), up-only, dent self-heals without touching highWater, and a fixed-seed scripted run is byte-identical. Panel stays hidden (reveals at R7); pillars accrue invisibly. *(§2.16, §4.1, §4.2 (incl. §4.2.1/§4.2.2/§4.2.3/§4.2.4), §4.3, §6.3, §6.4, §6.5)*
2. **R4 rung — simple Crafting + loot→craft loop + Main House domestic economy + first shinden + E1 build** — Done when the **simple Crafting tab SURFACE reveals at R4** and R4 content is wired to it — the craft *core* (content/recipes.ts + the craft/disassembly intents + the find→craft loop) was already built in **M2b**; M3 surfaces the tab and feeds found loot through it end-to-end; the Main House/Omoya area + domestic-economy activities (Cooking/provisioning) feed the satiety loop (§2.3); the first shinden reclamation (LAND lever) emits the Estate 'shinden plot recorded' deed into the Task-1 engine; and the E1 estate build fires on its §4.7.5 floor+cost. Each surfaces as its own separate diegetic reveal beat on the bus; verify green. *(§2.11, §4.7.2, §2.17, §4.7.5, §2.3, §3.2 R4, §3.3, §5 T0.4)*
3. **R5 rung — Quest log + the four open-ended quest types (Arms deeds begin accruing)** — Done when content/quests.ts + the Quest-log surface land with the accept_quest intent and event-driven (non-waypoint, open-ended, gatesSpine:false) task advancement; the four v1 types reveal as each is first taken — PEST_CONTROL → HUNT → CLEAR → DEFEND — with DEFEND as the canonical Arms standing-earner emitting capped Arms jumps into the Task-1 engine (Arms deeds begin accruing here); verify green and a headless run can take and complete one of each type. *(§2.12, §3.2 R5, §4.2.1, §6.5)*
4. **R6 rung — Workshops & Granary + E2 + first combat-earned Arms standing recorded + village-tier seed** — Done when the Workshops and Granary areas reveal separately, proto-industry LAND/TREASURY Estate levers are driven by ACTIVE labour (explicitly NOT T3+ auto-producers — active-only, no idle accrual per canon §G/§2.5); the E2 build fires on its §4.7.5 Estate+Arms floor+cost; the first combat-earned Arms achievement-jump is formally recorded in the books (the R6 'the gate held, and the books say so' beat); and errands-beyond-the-estate authorise the village-tier map seed + the road out. Verify green. *(§3.2 R6, §4.7.5, §2.17, §2.16, §2.5, §5 T0.2 beat 7-8)*
5. **R7 capstone — four-bar Influence panel (bar-by-bar) + House screen + ranking read + T0→T1 gate** — Done when the lord's-study area reveals and the four-bar House Influence panel becomes visible at the capstone, revealing ONE bar at a time as each pillar first scores (Estate from the shinden, Arms from R6's recorded standing, Office/Name shown faint/not-yet-scored); the House screen + the per-tier domain-ranking 'unranked' read (§2.18) appear; and the T0→T1 gate (Arms≥0.5K · Estate≥0.8K + the story gate, §4.1 — referenced, not restated) is wired so crossing it fires the transition story beat + log line ('Now: the valley.'). Verify green. *(§3.2 R7, §2.16, §2.18, §3.5, §4.1, §5 T0.2 beat 8)*
6. **Headless QA, pacing instrumentation & generated docs (T0-complete verification)** — Done when a headless __qa run completes ALL of T0 to the T0→T1 gate; tests assert the four-bar panel reveals one bar at a time as each pillar first scores, the trade≤⅓ invariant and 'jumps+seasonal-only (no trickle)' hold as content-verifier machine checks, the deeds/seasonal split lands ≈70/30 over T0 (§4.8.1), the autumn harvest sets the headline seasonal high-water mark, and the per-rung ≥30-min pacing is instrumented; docs/content/influence.md (+ recipes/quests/ranks) regenerate and gen:docs --check passes; full npm run verify green. *(§4.8.1, §6.6, §6.10, §6.3, §4.2.2, §4.2.3)*

### M4 — T1 Village (rep web · rumours board · coin · component crafting · silk) — V0→V7

**Goal:** the second fresh ladder and the static reputation web — the estate as a presence in its valley.

**Lands:** the **T1 ladder V0→V7** (§3.4) as a **fresh ladder** (rank resets); the **Village screen** +
the **Market / Shop Row** opening **one shop first** then fractally (§3.4 V0); **coin (*mon*)** (§2.4); the
**static reputation web** (§1.5.2, §2.15: per-shop, per-family, artisans' guild, the chief Yagōemon's
regard) — **gentle curves**, **never gates the spine**; the **Inn & Rumours Board** (§2.13) with optional
folklore tidbits unlocking **organically / per-tier** (never an all-at-once dump); the
**component/quality crafting system** (§4.7.2) from V3; the **silk / sericulture *meibutsu*** TRADE
sub-engine (§3.4 V3, trade ≤⅓-capped); the **Standing & Office pillar lighting for the first time** at V4
(Magobei's rice-skim thread); valley-scale combat (HUNT/CLEAR, road-warden) + the **first paid martial
outsiders** as **flavour roster cards** (§2.17 — not managed units); the festival/seasonal social layer
deepening (§2.14); estate **E1 → E2** completing; the **T1→T2 gate** (Arms ≥ 5K · Estate ≥ 8K · Office ≥
2K + "clean your room", §4.1).

**Definition of done:** verify green; a headless run completes **all of T1**; the village can be **ignored
without blocking the spine** (a spine-only headless run still reaches the T1→T2 gate, just slower —
asserted); the rumours board unlocks tidbits **per-tier organically**; the component crafting quality
tiers compute per §4.7.2; the Office bar first lights at V4; rep-web curves are gentle (frequent small
gains); the responsive nav (§6.9) shows the same reveals in the same order on a narrow viewport.

**Phases / high-level tasks:**

1. **T1 data foundation: registries + balance constants** — Done when the fresh V0→V7 rank ladder, the T1 areas (Market/Shop Row, Chief's House, Inn, Shrine, Boundary-Stone, River/Ford/Weir, Foothills/Charcoal), the 3-mob valley set (giant hornets, wolves pack, bandits/deserters), the coin (mon) resource, the Village + Region nav/screen surfaces, the E1→E2 build costs, and the T1 §4 tunables (yields, deed bases, gate thresholds, season wall-clock) are all authored as typed data — no logic yet — and `npm run verify` is green: tsc clean, content-verifier resolves every new id (no orphans), and `gen:docs --check` passes with the regenerated ranks/areas/influence/balance docs committed. *(§6.5, §6.6, §3.4, §3.5, §1.7/§1.8, §2.4, §2.9, §4.7.5, §4.8.2, §4.1, §4.2.1)*
2. **Coin economy + the V0–V2 early spine (presence, valley combat)** — Done when a headless run climbs V0→V2: V0 opens the Market/Shop Row one-shop-first (Gonta) then fractally adds the rest and lights the coin (mon) row + Village screen nav; V1 opens the Chief's House and deeper satoyama; V2 (road-warden) opens the Ford/Weir + Foothills wilderness rings, runs HUNT/CLEAR at valley scale, and records the road-safe Arms achievement-jump (150 ip base, per §4.2.1). Rung transitions and the fractal reveal order are covered by deterministic unit tests; verify green. *(§3.4 (V0–V2), §3.4.1, §2.4, §2.6, §2.8/§2.9, §4.6, §4.2.1, §2.1, §6.3)*
3. **Component/quality crafting + the silk TRADE sub-engine (V3)** — Done when component recipes compute outputQualityTier per §4.7.2 (0.4 skill / 0.4 component / 0.2 station, QUALITY_DIVISOR 10, 1.25^tier value step, ~60% disassembly) with quality as part of the stack key; the silk/sericulture meibutsu chain (cocoon → reeled silk → woven/graded textile) runs as the TRADE strand of Estate & Wealth under the broker-meter + market-saturation damper; and the trade ≤⅓-of-Estate&Wealth hard cap holds at every accrual point. Unit tests assert quality-tier math and the trade-cap invariant (also verifier-asserted); verify green. *(§2.11, §4.7.2, §2.4, §2.16, §4.2.3, §3.4 (V3))*
4. **Village reputation web + Tama-vs-farmhand allegiance (optional accelerant)** — Done when the static multi-node rep web (per-shop patron/regular meters, per-family goodwill, artisans' guild, headman Yagōemon's rolled-up personal regard) rises on gentle curves with frequent small gains, the continuous allegiance leaning rebalances rates/flavour only, and the combined village feed speeds the climb ~10–15% as a pillar multiplier — never a new pillar, never a spine trigger. Unit tests assert the web gives frequent small gains AND that a spine-only run still reaches the T1→T2 gate (village fully ignorable, per DoD); verify green. *(§1.5.2, §1.5.4, §2.15, §4 (gentle curves — reference))*
5. **Inn & Rumours Board + belief→cause folklore (organic, ≤1 ambiguity)** — Done when the rumours board (Sukezō) unlocks optional folklore tidbits organically per-tier as the estate/village grow (kappa-of-the-ford opener at V1, more drip-fed — never an all-at-once dump), each belief resolves one-to-one to a grounded human/natural cause with dawning unease, the optional side-quests (per-family help, Ryōa's register entry, rogue-bear HUNT, fox-fire seed) are present, and exactly one residual-ambiguity token (the boundary-stone offering) exists game-wide. Verifier asserts ≤1 ambiguity and the belief→cause coverage; none of it gates the spine; verify green. *(§2.13, §2.9, §1.10, §3.4/§T1.7, §6.6)*
6. **V4–V7 spine: Office first-light (Magobei) → man-at-arms → 'clean your room' gate** — Done when a headless run completes V4→V7: V4 resolves Magobei's rice-skim STORY beat (doctored-masu motif) firing the FIRST Office achievement-jump so the Standing & Office bar lights on the four-bar panel; V5 stands up DEFEND quests + the first paid retinue (Gohei & Yatarō) as flavour roster cards and triggers the E2 'Recovering' estate build; V6 surfaces the region-map seed; V7 fires the 'clean your room' capstone, meets the T1→T2 gate (Arms ≥ 5K · Estate ≥ 8K · Office ≥ 2K + story gate, §4.1) and reveals the Region screen. Seasonal judged-results + festival/weather social layer (Tokuemon hub) deepen and feed the gate at ≈70/30 deeds/seasonal. Unit tests cover the Office accrual, the gate predicate, and that Office first lights exactly at V4; verify green. *(§3.4 (V4–V7), §3.4.1, §2.16, §4.2.1/§4.2.2, §4.1, §5 T1.3 (Magobei), §2.12, §2.17, §4.7.5, §2.14, §3.5)*
7. **Renderer wiring, responsive nav + headless-QA DoD sweep** — Done when the thin DOM renderer paints the Village screen (shop row, rep-web meters, rumours board), the four-bar panel's Office reveal, the component-crafting/silk UI and the Region-screen reveal — reading reveals from surfaces.ts with K/M/B formatting and no game logic — and the same reveals appear in the same order on a narrow viewport. A `capture-game-states` headless run via window.__qa completes ALL of T1 to the T1→T2 gate, a spine-only run still reaches it (just slower), the rumours board drip is confirmed per-tier, and audit screenshots of the key beats are captured. Final `npm run verify` green. *(§6.9, §6.10, §6.6, §4.8.2, capture-game-states skill)*

### M5 — T2 Region (trade backbone · Origin faction · the G6 payoff) — G0→G7 → v1 content complete

**Goal:** the third fresh ladder, the region canvas, and **both personal threads resolving** — the warmest,
widest tier; on completion **v1 content is feature-complete**.

**Lands:** the **T2 ladder G0→G7** (§3.6) as a **fresh ladder**; the **Region screen** + the **trade
backbone** opening minimally (one route/porter/verb via Kanta, §3.6 G0); the ***sekisho* / pass-tier travel
layer** (§3.6 G1); **region-scale grounded human mobs** (ronin / bandits / smugglers — still the ~5-mob
cut-set, scaled; NO belief-creatures); the **Origin faction OPENS** at G2 (memory-gated, **double-gated**:
STORY dream-memory **AND** PILLAR travel-standing — §1.5.3, §3.6 G2) with the **Origin / Ties screen** and
the **`O0→O5` Origin reputation ladder** (§3.6.2; **ZERO mechanical gift** — access only); **Sawatari-juku** +
the two **Neighbouring Valleys** (Hibara + Tōge-mura, hard-capped at 2); **Kuzuhara** re-foundable hamlet +
the multi-stage **river-works (*seki*)** LAND mega-lever (G4); the capped **2–3-man road-security detail**
+ the **Hanzaki** encounters (**survived, not won**) + the CLEAR/CAPTURE-with-mercy branch (G5); **the
G6 personal-mystery PAYOFF** — the grown **Otsuru** found (Tama was a *girl* who *ran*; the MC is **not**
her — partial, grounded) and the **Origin reunions** complete incl. father **Jinpachi**; **Tahei claims
his true name** (a late, de-emphasised side beat) and the pride/morale support buff lands (a *present-day*
relationship, **ZERO retroactive gift**); the **rival houses (Tomita / Akagi) eclipsed** (Tomita never
killed); the **T2→T3 v1 end-gate** (Estate ≥ 60K · Office ≥ 50K · Arms ≥ 30K + win-the-region, §4.1).

**Definition of done:** verify green; a headless run completes **all of T2** to the T2→T3 gate; the Origin
faction is **double-gated** (it does not open on memory alone, nor on standing alone — asserted); **at
least one origin beat is always available without reputation-gating** so the thread never stalls (§1.5.3 —
asserted); returning memory grants **access only, ZERO mechanical bonus** (no stat/recipe/tool/combat
bonus traceable to a memory or porter's-knot flag — verifier-asserted, §4.5.3); the "one-eyed mountain
god" is an INVESTIGATE-then-confront **one-shot** (Hanzaki + terrain), **never a spawn population** (§3.6,
canon §E); the G6 payoff fires its full story beat; ≤1 residual-ambiguity token across all content
(verifier-asserted).

**Phases / high-level tasks:**

1. **Lay the T2 data spine (registries, screens, gate, pacing refs)** — Done when the T2 content is authored as data — the G0→G7 rank ladder (ranks.ts), the region areas/edges/conditioning gates (Region screen, Kaidō Guild routes, Sawatari-juku, Hibara, Tōge-mura, Kuzuhara, High Mountains/Pass — areas.ts), the scaled ~5-mob region cut-set (enemies.ts, no belief-creature tags), the new Region + Origin/Ties surfaces with unlock predicates (surfaces.ts), and the T2→T3 required-pillar thresholds + T2 pacing/season constants wired into balance.ts as REFERENCES to §4.1/§4.8.3 (no invented numbers) — and the content-verifier resolves every new id with no orphans; build verify-green. *(§6.5, §6.6, §3.6, §4.1, §4.8.3, §2.9, §1.7.1)*
2. **Build the two new T2 core systems: the capped trade backbone + the sekisho travel-standing layer** — Done when (a) the region trade backbone opens minimally in pure core (one route/one porter/one verb — Kanta's off-books consignment) by extending the existing capped Estate&Wealth trade sub-engine, with the trade-≤⅓ HARD invariant holding, and (b) the sekisho/pass-tier travel layer gates region travel on travel-standing (first barrier turn-back → pass under the house seal) — both as pure reduce/tick/economy logic with unit tests asserting determinism (one seeded RNG), the ≤⅓ cap, and active-only yields (no idle/auto accrual). *(§2.4, §4.2.3, §4.7.1, §6.2, §6.3, §3.6 (G0/G1))*
3. **Author the region combat content: scaled human mobs, Hanzaki, and the belief→cause one-shots** — Done when the region-scale grounded human mobs (ronin/bandits/smugglers, plus the bear/dogs/poacher set) resolve through the existing idle auto-resolve combat at §4.6 scale; the brigand-roost CLEAR target plus the CLEAR/CAPTURE-with-mercy (famine-band fed, not killed) branch work; Hanzaki is a survived-not-won DUEL nemesis (trained/endurance, never gifted); and the 'one-eyed mountain god' (+ fox-fire ridge) are INVESTIGATE-then-confront one-shots resolving to human/terrain — with the verifier asserting NO belief-creature in any spawn/population table. *(§2.8, §2.9, §4.6, §3.6 (G1/G5), §5 T2.3/T2.6 (canon §E))*
4. **Author the estate spine, climb chunk — rungs G0→G3 + early rival escalation + the Origin track OPENING at G2** — Done when G0 valley-envoy → G1 road-captain → G2 post-town broker (toiya registration) → G3 arbiter-between-valleys (Hibara/Tōge-mura, capped at two) play as quests/dialogue/rank-earn conditions, each promotion earned via its concrete trigger and named HOUSE-side granter (Genemon → Lord Munenori, region figures only acknowledging/contending), with the Tomita/Akagi rivalry escalating per-rung, the deeds driving Estate/Office/Arms pillars toward §4.1, and the G2 doubly-earned (STORY dream-memory AND PILLAR travel-standing) gate firing the Origin/Ties screen unlock — a headless run reaches G3. *(§3.6 (G0–G3), §3.6.1, §5 T2.2/T2.3, §2.12, §2.16, §4.2.1)*
5. **Author the estate spine, eclipse chunk — rungs G4→G7 (Kuzuhara mega-lever, road-detail, alliance, gate) + rivals dethroned + T2→T3 end-gate** — Done when G4 recognised-regional-retainer (the multi-stage Kuzuhara river-works LAND mega-lever + naming the drowned; resettlement as a region node kept FLAVOUR, with any returnee 'producer' scaffold-only — no auto-producer code path before T3) → G5 captain of the hard-capped 2–3-man road-security detail → G6 alliance-broker (Akagi precedence restored, Tomita boxed in, never killed) → G7 leading-house capstone all play with earned HOUSE-side promotions, and the T2→T3 end-gate (Estate ≥60K · Office ≥50K · Arms ≥30K + win-the-region, per §4.1) fires the Castle-town first-contact STUB; a spine-only headless run reaches the gate. *(§3.6 (G4–G7), §3.6.1, §5 T2.2, §2.17, §2.5 (parked), §4.1, §4.8.3)*
6. **Author the Origin reputation side-track O0→O5 and fire the G6 personal-mystery payoff** — Done when the standalone Origin Ties ladder O0→O5 (own meter, opens at the doubly-earned G2 gate) plays on the Origin/Ties screen with the reunions (Oyuki/Okimi/Denbei/Kanta/Osen/Jinpachi) and the O5 capstone payoff — Otsuru found (Tama was a girl who ran; the MC is NOT her — grounded/partial), Tahei claims his true name, the present-day pride/morale buff lands — verifier-asserting it NEVER appears as a spine trigger, that returning memory grants access only with ZERO mechanical gift (no stat/recipe/tool/combat bonus traceable to a memory or porter's-knot flag), and that ≥1 Origin beat is always available without rep-gating so the thread never stalls. *(§3.6.2, §1.5.3, §3.5, §5 T2.5/T2.7, §4.5.3)*
7. **Wire the renderer: the Region and Origin/Ties screens, trade/travel/detail UI, on the responsive nav** — Done when the thin DOM renderer paints the two new screens plus the trade-route, sekisho-pass, and 2–3-man-detail surfaces purely from GameState (no game logic in ui/), every first-time reveal pushes its diegetic log line in the §3.6 order, and the responsive nav shows the same reveals in the same order on a narrow viewport with all info reachable without hover. *(§6.9, §3.5, §6.11)*
8. **Close out M5: verifier invariants as machine checks + headless QA + generated docs + audit** — Done when verify is green and the M5 definition-of-done is machine-asserted via the DEV play API: a headless run completes ALL of T2 to the T2→T3 gate AND a spine-only run still reaches it; the Origin double-gate, the always-available ungated beat, and the zero-mechanical-gift rule are asserted; the one-eyed-mountain-god one-shot (never a population) and ≤1 residual-ambiguity token hold; generated docs (ranks/areas/bestiary/influence) are current; and a capture-game-states sweep audits the key beats (G2 Origin open, Kuzuhara works, G6 payoff, G7 capstone). *(§6.6, §6.10, §2.20, §4.8.4)*

### M6 — Balance pass to the §4 targets + content-verifier green + the T3 stub + polish

**Goal:** make the whole curve hit the **LOCKED** pacing budget, prove every canon invariant by machine,
ship the T3 cliff-hanger stub, and polish to a launchable feel.

**Lands:** the **balance pass** — tune `balance.ts` so a headless full playthrough hits **T0 ≈ 4.5 h · T1 ≈
8 h · T2 ≈ 16 h**, **every rung ≥ ~30 min**, the **≤2–3× never-balloon** within-tier ratio, and the
**≈70/30 deeds/seasonal** split (§4.8); the **pacing-regression tests** (run by the local `verify` gate — a headless playthrough that clears any
rung in < ~28 min or misses a tier budget **fails** — §4.8.4, §6.10); the **content verifier** green on
**all** canon invariants (§6.6: no belief-creature spawns; trade ≤⅓; ≤1 ambiguity; no passive Influence
trickle; no labour→combat cross-feed; **macron / K/M/B** lints; no orphan ids); the **T3 Castle-town STUB**
— the §3.7.1 first-contact screen at the G7 capstone (the cliff-hanger "the story pauses here"; the Kaidō
Guild's first castle-town node only — **no T3 ladder, no auto-producers, no marriage lever** built);
**accessibility** pass (§6.11: scalable text, colourblind-safe cues, keyboard + touch, reduced-motion,
pause, ARIA live-region log, mute); **art/feel** polish (text + emoji + CSS woodblock register, kanji
season tags, colour-coded rarities, K/M/B formatter, light ambient audio + SFX + mute, §6.9); a
**`capture-game-states` audit** sweep of the key beats (audit/ screenshots).

**Definition of done:** verify green; the headless **pacing regression** confirms the locked T0/T1/T2 hour
budgets and the ≥30-min floor; **every §6.6 canon invariant passes as a machine check**; the T3 stub
renders the cliff-hanger and then *stops* cleanly (no half-built T3 systems reachable); accessibility
basics verified (keyboard-only and touch-only playthrough of the cold open + a rung; live-region announces
reveals); the generated docs (`docs/balance/`, `docs/content/`) are current (`gen:docs --check` passes);
no plain-ASCII romaji slips (macron lint clean); all large numbers display **K/M/B**.

**Phases / high-level tasks:**

1. **Build the headless pacing-instrumentation harness** — Done when a __qa-driven full T0→T2 (and spine-only) playthrough runs headlessly and prints a per-rung tick→wall-clock + per-tier-total report measurable against the §4 targets — landed as a reporting tool only, so verify stays green. *(§6.10 (DEV play API), §4.8 (pacing tables/budgets))*
2. **Balance pass — tune balance.ts to the §4 LOCKED targets** — Done when the measured playthrough hits T0≈4.5 h / T1≈8 h / T2≈16 h, every grind rung ≥~30 min, the ≤2–3× within-tier never-balloon step, and the ~70/30 deeds/seasonal split — by tuning the §4.9 levers only (master dials, accrual, gating cadence, producer/cost curves), with all magnitudes taken from §4 (reference, never invented). *(§4.0/§4.1/§4.2/§4.7/§4.8/§4.9 (the locked balance model + levers index))*
3. **Promote pacing into a hard verify gate (pacing-regression tests)** — Done when the harness assertions run inside `npm run verify` and FAIL the build if any rung clears in <~28 min or a tier misses its locked hour budget — and it passes green because the balance pass already satisfies it. *(§4.8.4 (the two locked invariants + CI floor), §6.1 (the verify gate), §6.10)*
4. **Content-verifier + generated-docs green on every canon invariant** — Done when scripts/verify-content.ts asserts ALL §6.6 machine checks (no belief-creature in any spawn table, trade ≤⅓, ≤1 residual-ambiguity token, no passive/flat Influence accrual, no labour→combat cross-feed, macron + K/M/B lints, no orphan ids) and scripts/gen-docs.ts regenerates docs/balance/ + docs/content/ with `gen:docs --check` passing — both wired into verify. *(§6.6 (verifier + generated docs), §6.1 (verify gate), §2.20)*
5. **Ship the T3 Castle-town STUB cliff-hanger** — Done when reaching the G7 capstone renders the §3.7.1 C0 first-contact screen (Kaidō Guild's first castle-town node) with the diegetic 'the story pauses here' reveal, then STOPS cleanly — with a verifier/test assertion that NO T3 ladder, auto-producers, or marriage/adoption lever is reachable. *(§3.7.1 (T3 forward stub), §6.9 (renderer/reveal), §6.6 (no half-built-system assertion), §5 (G7 beat))*
6. **Accessibility pass (§6.11 basics, wired so they cannot rot)** — Done when textScale, colourblindMode (colour never the sole cue — icon/text labels too), full keyboard operability + comfortable touch targets, reducedMotion (+ prefers-reduced-motion), user pause, the event log as an ARIA live region, and a mute toggle are all live and verified by a keyboard-only and a touch-only run of the cold open + one rung. *(§6.11 (accessibility), §6.9 (not-hover-dependent renderer / pause))*
7. **Art/feel + presentation polish (the woodblock register)** — Done when the text+emoji+CSS woodblock palette/flourishes, kanji season tags, colour-coded rarities, the single shared K/M/B display formatter, and a light ambient audio bed + UI/event SFX (all behind mute) are applied across screens, giving a launchable feel. *(§6.9 (art register, K/M/B formatter, audio))*
8. **capture-game-states audit sweep of the key beats** — Done when __qa is driven headlessly to the signature states (cold-open <5 s, R3 humbling fight, R7 four-bar Influence panel, V4 first Office light, G6 personal payoff, G7→T3 stub) on desktop and a narrow viewport, lossless screenshots are saved under audit/, and any findings are recorded. *(§6.10 (__qa), §5 (act beats), the capture-game-states skill, §6.9 (responsive nav))*

### M7 — Deploy

**Goal:** ship the static build to itch.io as free / pay-what-you-want.

**Lands:** `build:itch` (= `vite build` → `dist/` → zipped, §6.1) with the **base path** set for itch's
served subpath and a **single static HTML bundle** (no backend, §6.1/§7.3); a final **export/import
save** round-trip smoke test on the built artifact; the itch.io page (free / PWYW per canon §H), the build
uploaded, a **fresh-browser smoke test** of the deployed build (load < 5 s to first interactable; save
persists across reload; export/import works).

**Definition of done:** the zipped `dist/` runs from itch.io's static host with the correct base path;
loading the live URL reaches the cold open and the first verb works; IndexedDB autosave + base64
export/import work against the deployed origin; **no backend, no network calls**; the release artifact was
cut from a **verify-green** commit.

**Phases / high-level tasks:**

1. **Pin the relative base path + strip the DEV surface** — Done when `vite.config.ts` sets `base: './'` and a production `vite build` emits a single static HTML bundle with hashed JS/CSS that resolves from a served subpath, containing NO `__qa`/dev helpers (DEV-only code dead-code-eliminated via `import.meta.env.DEV`). *(§6.1, §6.10, §7.3)*
2. **Add the `build:itch` script (build → zip) + a build provenance stamp** — Done when `npm run build:itch` runs `vite build` then zips `dist/` into an upload-ready artifact, and the built bundle stamps the source commit SHA / version into the Settings/About surface so any shipped zip is traceable to the commit it was cut from. *(§6.1, §7.3)*
3. **Wire the `npm run verify` release gate as the cut-rule** — Done when a local release flow refuses to cut a zip unless `verify` is green (tsc --noEmit + eslint + prettier --check + vitest run + verify-content + gen:docs --check, PLUS the M6 §4.8 headless pacing regression) and the working tree is clean — i.e. a release artifact can only ever be cut from a verify-green commit; no hosted CI, run locally as the pre-push/release gate. *(§6.1, §7.3, §4.8, §6.6)*
4. **Smoke-test the built artifact offline (itch-subpath + no-network)** — Done when the unzipped `dist/` served from a subpath (mimicking itch's served path via `vite preview` / a static server) passes: load < 5 s to first interactable, the first verb (rake rice) works, IndexedDB autosave persists across reload, base64 export → clear store → import yields identical state, AND there are zero network calls and no `__qa` surface present. *(§7.3, §6.8, §6.9, §3.1)*
5. **Prepare the itch.io page + upload the zip as a draft (human-gated)** — Done when the itch.io project is configured as a draft with the smoke-passed zip uploaded — Kind = HTML, "played in the browser" ticked, a sensible responsive viewport frame, pricing free / pay-what-you-want — with the agent supplying the page copy + step-by-step upload runbook and the human performing the create/upload (outward-facing, approval-gated). *(§7.3, canon §H)*
6. **Fresh-browser smoke of the live draft, then publish (human-gated)** — Done when the live draft URL passes the fresh-browser smoke (load < 5 s to first interactable, first verb works, autosave persists across reload, export → clear store → import round-trips identical, no backend / no network calls) and the game is then published free/PWYW — the milestone's go-live beat. *(§7.3, §6.8)*

### 7.2.1 Milestone summary

| M | Goal (one line) | Frontier reached | §-systems landed (primary) |
|---|---|---|---|
| **M0** | Toolchain + cold open + save spine | one screen, one verb | §6.1/§6.2/§6.3/§6.7/§6.8/§6.10, §3.1 |
| **M1** | T0 labour + R0→R2 + skills + E0→E1 | R2 | §2.6/§2.7/§2.15, §3.2/§3.3/§3.5 |
| **M2a** | Combat live at R3 + idle auto-resolve + the humbling first fight | R3 | §2.8, §4.6 |
| **M2b** | Bestiary + equipment + the loot→craft gear loop | R3→R4 | §2.9/§2.10, §4.6/§4.7.2 |
| **M3** | Quests + crafting + 4-pillar panel → T0 done | R7 / T0→T1 gate | §2.11/§2.12/§2.16, §4.1/§4.2 |
| **M4** | T1 Village (rep web, rumours, coin, silk) | V7 / T1→T2 gate | §1.5.2/§2.13/§2.14, §3.4 |
| **M5** | T2 Region (trade, Origin, G6 payoff) | G7 / T2→T3 gate | §1.5.3/§3.6, §5 T2 |
| **M6** | Balance to §4 + verifier green + T3 stub + polish | v1 launchable | §4.8/§6.6/§6.11, §3.7.1 |
| **M7** | Deploy to itch.io | live | §6.1/§7.3 |

> **Milestones map to ADR-able checkpoints.** Each milestone's *design* is already locked in §§1–6; the
> roadmap adds no new design decisions, so M0–M7 are **execution** checkpoints (commit + journal per the
> CLAUDE.md cadence), not new ADRs. The only ADR §7 itself proposes is recording the **v1 scope + the
> M0…M7 build order** as the project's execution plan (see §7.5).

---

## 7.3 Deployment

**No backend. Fully static.** Per §6.1 / canon §H: `vite build` emits a static `dist/` (a **single HTML
bundle** + hashed JS/CSS assets), zipped and uploaded to **itch.io**.

- **Static itch.io build.** `npm run build:itch` = `vite build` + zip `dist/`. itch.io serves the unzipped
  bundle from a project subpath, so Vite's **`base`** must be set to a **relative base** (`base: './'`) so
  asset URLs resolve under itch's served path — this is the single most common static-host break and is
  pinned in `vite.config.ts`. The DEV play API and any dev-only helpers are stripped via
  `import.meta.env.DEV` (dead-code-eliminated), so the shipped bundle carries **no** `__qa` surface.
- **The export/import save path.** Persistence is **IndexedDB single autosave** + **base64 export/import**
  to a text file (§6.8). Because itch.io is a static host with no server, the base64 export is the **only**
  portable backup / hand-off path — the player's safety net against a cleared browser store. Import
  validates + migrates (versioned minimal-state, ordered migrations, pre-migration raw backup; a corrupt
  save degrades gracefully, never a "save is kill" wall).
- **The `npm run verify` release gate.** The **same** one-command gate that guards every commit (§6.1) is
  the release gate: `tsc --noEmit && eslint . && prettier --check . && vitest run && verify-content &&
  gen:docs --check` — i.e. **typecheck + unit tests + the content-verifier (incl. the K/M/B + macron + the
  canon-invariant machine checks) + lints**, plus the **§4.8 headless pacing regression** added at M6. A
  release artifact is **only ever cut from a verify-green commit**; `verify` is run **locally** as the
  pre-push / release gate (**no hosted CI, no deploy automation** — confirmed by the human 2026-06-25).
- **How to ship to itch.io (brief).** (1) `npm run verify` green; (2) `npm run build:itch` → a zipped
  `dist/`; (3) on itch.io, create / edit the project, set **Kind = HTML**, upload the zip, tick **"This
  file will be played in the browser,"** set the viewport (a sensible default frame; the layout is
  responsive per §6.9), and set pricing to **free / pay-what-you-want** (canon §H); (4) save as a draft,
  open the draft URL, run the **fresh-browser smoke test** (load < 5 s to first interactable; rake rice;
  reload → autosave persists; export → clear store → import → identical); (5) publish.

> **Out of scope for v1 deployment:** any server, account system, cloud save, analytics backend, or
> network call. The game is wholly client-side and offline-capable after first load (active-only; no
> offline *progress*, but it runs with no network).

---

## 7.4 Risk register + scope-risk posture

### 7.4.1 Top risks

| # | Risk | Likelihood / impact | Mitigation |
|---|---|---|---|
| **R1 — Scope creep on T2** (the widest, warmest tier: region map + Origin faction + two payoffs + Kuzuhara + rivals) blows the timeline | **High / High** | Hold the **~6–8-node** cut-set and the **hard caps** (exactly 2 neighbouring valleys; 2–3-man detail; ~5 mobs) as *invariants*, not suggestions; build T2 **rung-by-rung** (M5) so progress is always verify-green; park anything not on the §1.7.1 spine list. **v1 ships full T0–T2 — no pre-planned descope (§7.4.2)**; if genuinely blocked, the forward-migratable save (§6.8) lets a later update add tiers. |
| **R2 — Balance-tuning time** (hitting the LOCKED 4.5/8/16-h budgets + the ≥30-min floor + ≈70/30 split across 24 rungs) is open-ended | **High / Medium** | The §4.8 curve is derived **backward** from the locked floor, so M6 tunes *yields* against a fixed target, not the target itself; the **headless pacing regression** (§6.10) makes drift a `verify`-gate failure, so tuning is measured, not vibes; every number lives in `balance.ts` (§6.4) and reflows with **no save migration** — tuning is cheap and continuous, not a big-bang at the end. |
| **R3 — Save migration** (a stored-shape change orphans players' saves) | **Medium / High** | Store **only non-derivable state** (§6.4) so the migratable surface is minimal; **ordered, unit-tested migrations** + a **pre-migration raw backup**; base64 export as the player's own safety net; degrade gracefully on a bad save (never a hard wall). The stored/computed split (§6.4) means balance retunes **never** migrate. |
| **R4 — Art / feel** (text + emoji + CSS must read as a *coherent woodblock world*, not a spreadsheet) | **Medium / Medium** | The art register is locked **low-risk** (no asset pipeline: text + emoji + CSS, §6.9); a dedicated **M6 polish pass** + a **`capture-game-states` audit** sweep catches feel regressions; the diegetic event log carries most of the "feel," so feel scales with *writing* (a known quantity) more than with art production. |
| **R5 — The combat slice is the densest stretch** and could stall the whole roadmap | **Medium / Medium** | **M2a / M2b are fixed milestones** split up front at the R3→R4 seam (M2a = idle auto-resolve + first fight; M2b = bestiary/gear), so the combat slice is two shippable, verify-green checkpoints by design; the deterministic seeded auto-battler is **unit-testable in isolation** (§6.7) before it's wired to the UI; the first-fight win-rate (20–35%) and soft-setback shape are **LOCKED**, so the target is fixed. |

### 7.4.2 Scope-risk posture — no pre-planned descope

**v1 = full T0–T2, non-negotiable.** The human chose **not** to pre-plan a reduced-scope cut (no "minimum
shippable T0–T1" fallback, no cut-down ladder) — we build to the full T0–T2 target and ship it complete
(plus the §3.7.1 T3 stub cliff-hanger). We do **not** design a T0–T1 fallback.

> **Holding scope:** every milestone stays **verify-green, deterministic, and a complete playable arc to its
> frontier**, and we hold the §7.1 cut-set + hard caps as *invariants* (this is how we protect the budget —
> by trimming *breadth within a tier*, never by dropping a tier). If a milestone is **genuinely blocked**,
> the forward-migratable save (§6.8) plus **no reset** means a later update can add tiers without orphaning
> anyone — but that is a recovery path, not a plan: **v1 ships complete T0–T2.**

---

## 7.5 §7 decisions → ADR (proposed)

§7 opens **no new design decisions** — it sequences the already-locked design (§§1–6) into an execution
plan. Proposed ADR: record **the v1 scope (§7.1) + the M0…M7 build order (§7.2, with the combat slice as the
fixed milestones M2a/M2b) + the static-itch.io deployment + verify-gate (§7.3) + the no-pre-planned-descope
scope posture (§7.4.2: full T0–T2 is non-negotiable)** as **D-017 — v1 execution plan** (D-016 is the §4
balance locks — distinct), an execution checkpoint rather than a design reversal. Final ADR numbering is set
at integration. **Approving §7 is the gate that unlocks code** (per the PRD preamble: *no code until §7 is
approved*).

### Flagged for the human — ALL RESOLVED (2026-06-25)

> All items below are **resolved by the human (2026-06-25)**; none of it changes *what the game is* (§§1–6),
> only *how/when we build and ship it*.

1. **RESOLVED: Milestone granularity / the M2 split → fixed M2a / M2b milestones.** The combat slice is **two
   fixed, separate milestones up front** (M2a = idle auto-resolve + first fight; M2b = bestiary / equipment /
   loot→craft) at the R3→R4 seam — **not** a conditional "agent's call at build time" split.
2. **RESOLVED: The cut-down floor → no pre-planned cut.** **Full T0–T2 is non-negotiable**; we do **not**
   pre-plan a reduced-scope cut and we do **not** design a T0–T1 minimum-shippable fallback (§7.4.2). If
   genuinely blocked, the forward-migratable save (§6.8) lets a later update add tiers — but v1 ships
   complete T0–T2.
3. **RESOLVED: itch.io page specifics → confirmed.** **Free / pay-what-you-want** (canon §H), **Kind = HTML /
   play-in-browser**, **relative `base: './'`**, and a sensible responsive default frame. Confirmed.
4. **RESOLVED: CI host for `npm run verify` → local verify gate, no hosted CI.** The release gate is
   `npm run verify` + the §4.8 pacing regression, run **locally** as the pre-push/release gate — **no hosted
   CI, no deploy automation** — sufficient for a solo/agentic workflow.
5. **RESOLVED: "How to ship" → manual upload, confirmed.** The itch.io upload is a **manual** step (§7.3) —
   outward-facing / hard-to-reverse, so per CLAUDE.md it needs human approval each release. **No** deploy
   automation (no itch CLI / butler pipeline) for v1. Manual upload is the intended release process.


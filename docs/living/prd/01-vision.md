# §1 — Vision, Pillars, Factions, World & Endgame

The finished game is a seven-tier estate-rise. Tiers run **T0–T6** (0-indexed): v1
ships **T0–T3 complete** (T0 Estate-tutorial · T1 Estate-full · T2 Village · T3
Region — the game ends at Region, `outcome: t3done`), with **T4 a stub
cliff-hanger** (the castle-town / Daikan's-Office first-contact beat) and **T5–T6 a
roadmap** (the Domain, then Edo). Progression is **sequential per tier** — climb the rungs (Phase 1),
then grind the estate's pillars (Phase 2), then tier-up (§1.6.4); the tier-gate is
a **scaled good/great/excellent** pillar profile over the pillars revealed by that
tier; combat feeds **three clean tracks** (character level · the Arms pillar · the
Combat Rank rung-meter — §1.6.4) and is **incremental** (T0 starts with the
carrying-pole and grows a roster). The **~28.5 h budget is a FLOOR**, a long
OSRS-rough grind you "leave auto-running"; **reveals are design-staggered
one-at-a-time** (no runtime reveal-queue). The signature *meibutsu* is **silk /
sericulture**; there are **full walkable maps at every tier**; combat is
**surfaced from T0**.

## 1.1 Vision

You are a **mediocre young man** (~18–20) — weak, slow, unskilled, and nameless — pulled half-drowned from
a mountain river and taken in, out of plain kindness, by the **Kurosawa**: a proud, threadbare
lower-samurai (*gōshi*) house two generations past its grandeur and quietly drowning in inherited debt. You
begin as "another mouth," with no place at the table. Through nothing but **daily toil, drills, and a
refusal to quit**, you earn your keep, then their trust, then your name on the household roster — and you
climb, rung by sweat-bought rung, from taken-in stray to the lord's right hand and the **architect of the
house's revival**. Each tier is the **same earned, two-phase motion** (§1.6.4): **climb the rungs** of that
tier's service ladder, **then grind the house's standing up** through its pillars, **then the world widens to
the next tier.** The climb is a **long, generous grind** — an OSRS-rough **minimum** you settle into and
*leave auto-running, checking the progress* (active-only, no offline), never a brick-wall: the ~28.5 h budget
is a **floor**, not a ceiling (§1.12/§1.13).

As you rise, the world you can reach grows with you: first the **estate** (the household, then its land), then
the valley **village of Asagiri**, then the **region**, then the **castle-town**, then the **domain**, and
finally **indirect, mediated recognition at Edo** — until the Kurosawa name stands **restored *and* surpassed** beyond anything it held
three generations ago. The estate-rise *is* the perseverance fantasy at grand scale, and it is the same
motion as the game's **signature feature: the UI itself unlocks as you progress** — minute one is one verb
and a persistent event log; every panel, tab, resource, skill, and area thereafter fades in **one at a time
by design** (the unlock schedule is *authored* so reveals never arrive in a batch), each reveal a story
beat, never silent menu growth.

Two grounded side-threads run quietly beneath the climb and pay off only in **feeling, allies, and flavour
— never in power**: a grieving village half-adopts you as **"Tama,"** its OWN child lost to a "taking" years
ago — a misreading (the estate flatly disbelieves it; to them you are simply a hand) that the true story
quietly corrects (Tama was a girl who ran, found grown), and a **recurring dream** slowly returns the memory
of who you truly were — **Tahei**, a porter a landslide took into the river — and the living family who kept
your name on their register and will come to back you. **Nothing
supernatural ever happens; every omen resolves to a human or natural cause; every climbing number is earned
sweat.** This is the **dignity of a nobody — and a dying house — becoming someone real, by hand**, and
forcing a forgotten name to be spoken at the capital. Built as a **pure, deterministic TypeScript core**
(one seeded RNG, data as single source of truth) with a thin DOM renderer, shipped as a static HTML5 build
for itch.io.

## 1.2 Design pillars

1. **The estate-rise is the spine — a perseverance fantasy at grand scale.** The single load-bearing track
   is the protagonist's climb up the Kurosawa service hierarchy fused to the house's outward expansion
   across **seven influence tiers** (T0 estate-*household* → T1 estate-*land* → T2 valley → T3 region →
   T4 castle town → T5 domain → T6 Edo). Rising
   through the ranks and restoring-then-surpassing the house **are** the main quest. There is **no reset of
   any kind**: tiers *replace* prestige; everything persists as the canvas grows.

2. **Fractal incrementality.** Every new zone, area, faction, skill, and rumour is **itself incremental**:
   you arrive minimal (one contact, one place, one verb), slowly learn its people and systems, and never
   get overloaded — **everything unlocks.** The whole-game UI-reveal motion repeats in miniature at every
   frontier. Concretely: a drill yard reveals one post, then a rack, then sparring slots; a new region is
   one road, one threat, one contact. **Reveals are design-staggered one-at-a-time** — the unlock schedule is
   *authored* so beats arrive singly (there is **no runtime reveal-queue**) — and obey a general
   **NO-UI-DUMPS** principle (stagger everything, slowly and gently). The player UI resolves to a **SEVEN-TAB
   IA — Work · Map · Estate · Inventory · Character · Combat · Quests — each revealed only as it unlocks**
   (**ADR-119**, reinstating ADR-037 and superseding ADR-112's six-tab lock: **Quests regains its own top-level tab**;
   crafting stays a **section**, not its own tab): **one capability per thematic tab**, so the main surface
   stays the active labour/deeds/combat loop. Where each remaining capability is homed within those seven tabs
   is **`ui-design.md`'s domain** (the PRD owns the reveal *order*, not the layout).

3. **Lean and high-impact — no fluff, no half-built features.** Grinding/slow growth is the core, not
   filler. **"Lean" is about FEATURES, not the grind**: no fluff, no half-built systems, and when scope
   balloons, **split into "immediate" vs a parked "later"** bucket (e.g. §1.7 → §1.7 + §1.7.1) — *park,
   don't delete.* The **grind itself is deliberately generous and long** — an OSRS-rough **minimum** (the
   budget is a floor, not a ceiling). v1's *scope* stays focused: **T0–T3 complete**, an **~8-rung
   early rank ladder**, **~5 mobs**, a **~6–8-node world cut-set** — but there is **no quest-type budget**:
   author whatever quest types fit each stage, more and more-interesting
   quests welcome, especially at later tiers. (This honours the standing "start lean, add pieces back
   deliberately; don't over-build" preference — applied to **features**, not to grinding content.)

4. **Combat is a first-class core pillar, alongside labour.** Combat uses an **idle auto-resolve + active
   setup** model (prepare gear/stance/area; a deterministic seeded fight resolves; you intervene with
   stance/ability/item/retreat — low-APM, strategic). It is **INCREMENTAL** like everything else: T0 starts
   with the **carrying-pole**, and a **growing roster** (T0 +2 / T1 +3 / T2 +4 — **~9–10 across v1**, at
   least one craftable, each an
   archetype + a signature ability) unlocks rung-to-rung along a **combat-reveal ladder** (§1.5.1, §2.8/§4) —
   an **incremental progression surface**. It feeds **THREE
   clean, separately-stored tracks** (never one fused bar — §1.6.4): **kills/combat-XP → character (combat)
   level** (which scales HP, attribute points, and satietyMax); **recognised martial DEEDS → the Arms pillar**
   (House Influence — clear bandits, secure roads, defend the estate; gated to each tier's **Phase 2**); and
   **per-rung curated activities → the Combat Rank rung-meter** (the martial rung-gate). The mediocre-start
   contract holds on the combat track too: start weak, the first real fight is humbling/near-fatal (**measured
   at adequate satiety, ≥~0.7** — combat is satiety-throttled, "eat before you fight"; §1.4/§4), capacity is
   **enabled** by labour-built conditioning (a **zero-stat** weak→capable gate), and **trained labour skills
   each grant a few small, bounded combat perks** (~2–8 per skill, stackable, small magnitudes, no global cap
   — skills make you **more capable**, but big combat power
   stays combat-only). Combat is **surfaced from the first tier (T0)** — the drill yard, Combat panel,
   bestiary, and the humbling first fight are early beats — so it is load-bearing from the start. Daily
   *texture* stays **peaceful-labour dominant** by volume (labour-plurality), but combat is live and
   load-bearing throughout.

5. **The core loop is the MC's OWN actions.** Combat, skills, jobs, crafting (classic RPG). The meta
   (Influence, tiers, ranking) sits *above*, fed by his grind. Building structures and recruiting members
   are **flavour / light systems wired to the reveal bus — NOT a people-management sim**. The dominant
   minute-to-minute behaviour is the incremental grind — **the hero getting better at what he does.**

6. **No hidden edge, ever.** No bloodline, no secret training, no weapon that "answers to him," no body
   that "remembers." The **porter's-knot habit** and the **recurring dream** are identity flavour with
   **ZERO mechanical bonus** — memory grants *access*, not power. **"No hidden edge" means no edge of BIRTH,
   GIFT, or MEMORY** — distinct from **trained labour SKILLS**, which *do* grant small, bounded, **earned**
   combat perks: the line is **gift-vs-work**, not labour-vs-combat. The talent-foils (chief among them the
   enemy lord Tomita) are always **trained, lucky, or ruthless — made, not born.**

7. **Grounded Edo folk-mystery — folklore is light flavour; quests are open-ended.** Every belief/omen
   resolves one-to-one to a human/natural cause; a thin, **capped-at-≤1**, off-screen margin of ambiguity is
   kept for unease only. Folklore arrives as optional tidbits via the village inn's **rumours board**, which
   unlock organically as the estate and village grow. Quests are a **suggestion + a story the player finds
   out in the world**, never an A→B→C waypoint list; fewer checklists overall.

8. **Deterministic, testable, generated.** Pure-core boundary (no DOM in logic), one seeded RNG, save only
   non-derivable state, generate balance/content docs from the same data the game runs on, and a DEV-only
   play API so every unlock and pacing beat is headlessly regression-tested.

## 1.3 Premise & tone

> *1780. A man is pulled half-drowned from the Kurosawa estate's weir with no name he can give; fed once
> out of form and kept by arithmetic, the declining lower-samurai (gōshi) house learns his hands before his
> face. The truth — the player's, long before his — is that he is **Tahei**, a kaidō porter a landslide took
> into the river: no flight, no guilt, no grave, and a family a region away who keep his register entry open
> by refusing to grieve him. The valley below has its own vanished child, **Tama**; a villager's misreading
> briefly makes the stranger her returned ghost. Through daily toil, drills, and a refusal to quit, he rises
> through the estate's service ranks from "another mouth" to the lord's right hand and the architect of its
> revival, hauling the house from near-foreclosure up an outward climb of influence — valley, region, castle
> town, domain, and finally mediated recognition at Edo — until the Kurosawa name is restored and surpassed.*

**Tone:** grounded, warm, bittersweet **Edo folk-mystery** wrapped around a cozy, satisfying **restoration
fantasy** — **set in 1780** (*An'ei* 9, 安永9年), mid-Edo, stable and commercial, kept **fictional**. The
anchor is **real YEAR, fictional GEOGRAPHY & POLITICS**: every place and house is invented (no real place or
daimyō names — ADR-018), and "the shōgun" is only ever an **unnamed office**, never the historical Tokugawa. The
era's real commercial texture is *ambient flavour*, never named politics. The dominant texture is peaceful Edo labour (farm, forage, woodcut, fish, craft) over a rice-and-coin
base economy — numbers-go-up as honest sweat — with combat as a dangerous, earned second pillar. Beneath the
warmth runs a quiet grim undercurrent: a house broken by an ancestor's failed venture, a valley grieving its
own vanished child (**Tama**, taken a decade past), **a family a region away who REFUSE to grieve the
protagonist as dead — keeping his register entry open** (his is a quiet **"presumed-dead → back-from-the-dead"**
return to everyone but them), official negligence dressed as fate. The darkest material is
handled with **off-screen restraint** and counter-weighted by found-family warmth. The catharsis is **never
power** — it is a nobody becoming someone real by his own hands, and lifting a dying house back into the
light. Justice, where the side-mysteries reach it, is **partial**: the reachable culprits answer, the truly
powerful largely escape — the same thesis made structural by the honest **ceiling** at Edo. Relationships are
**narrative-only** (no dating-sim).

## 1.4 The protagonist & the mediocre-start contract

The protagonist is an **authored, fixed male character** (~18–20) — there is **no name/appearance/gender
creator and no player rename**. He is the same person in every playthrough. He begins with **no name he can give**: the on-screen speaker
label runs **`You:` → `Nameless:`** (a forced early beat where he asks his own name and Sōan answers that he
has none, witnessed), then the estate writes him the **use-name Gonbei** in the day-book at **T0-R7**. His
**birth name — Tahei**, a plain commoner name — he does not *know* until **T3**, when returning memory and the
origin register confirm it; setting "**Tahei**" down in the register is the **Origin O5 capstone: earned,
late, de-emphasised, and *missable*** — a player who never walks the Origin thread may finish without it.
This is **distinct from** the valley's lost-child **TRUTH** (that Tama — the village's own vanished child,
whom **Sayo's T2 misreading** briefly projects onto him — is **not** him; the real Tama is **Otsuru**, found
grown **down-valley in Yanagi-watari**), which is **spine-guaranteed at G6 for every player** (§1.5.3/§1.9).
Identity is explicitly a side thread, not the spine's climax. The **fixed male gender is load-bearing**: **Sayo's**
certainty — the valley's loudest misreading — "remembers" the vanished child as a *boy*, when Tama was in fact
a *girl* who ran. Her misreading holds up on **concrete, in-world reasons, never magic**: **a decade has
passed** (a small child's face — and sex — blur across ten years of grief and retelling), and those who knew
Tama were **themselves young then and remember only vaguely**, so a grieving heart reads what it needs to
read. That ordinary mechanism keeps the stranger-as-returned-Tama **diegetically believable while the truth
stays wholly human.** It is also the game's **fairest clue**: a quietly re-readable tell — the *legend*
insists on a *boy*, while the temple register of the vanished (which the parish archivist amends on screen)
says *girl* — that only lands because the protagonist is fixed-male.

**The mediocre-start contract (binding, enforced in writing *and* code).** He is **NOT a bedridden invalid**;
he can rest and recover a little in the first hours, but he **starts weak and slow** — unskilled, low-stat,
soft-handed, slower than the boy who shows him the paddy, blistering on the first hoe. His one genuine asset
is **temperament**: stubbornness, a strong back, a patient temper, a refusal to stop getting up. He grows
**only** through perseverance, repetition, rest, technique, and crafted tools. The answer to a wall is never a
magic item, only more reps and better tools. Combat capacity is **enabled** by labour-built **conditioning** —
a **zero-stat** weak→capable **enablement gate** (it unlocks the combat track; it grants no combat stat) —
while **trained labour skills each grant a few small, bounded combat perks** (~2–8 per skill, stackable, small
magnitudes, no global cap): more reps make you **more capable**, but big combat power stays
combat-only. Combat is also **satiety-throttled** ("eat before you fight"); the **humbling, near-fatal first
fight** is balanced **at adequate satiety (≥~0.7)** — its **20–35% win-rate** is measured there (§4) — so an
underfed protagonist fares worse still. Motivating training, never a magic item.

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
- **Growth is grind, not gift.** No returning **memory** or instinctive **habit** ever grants a starting
  stat, recipe, tool, or combat bonus — but **trained labour skills DO** grant small, bounded combat perks.
  The distinction is **gift-vs-work**, not labour-vs-combat: nothing is *given* by birth or memory;
  everything is *earned* by reps.
- **The talent-foils are made, not born.** The rivals the house eclipses — chief among them the enemy lord
  **Tomita** — are always shown as trained, lucky, or ruthless, never innately gifted in a way the protagonist
  could not match by work.

## 1.5 Factions

Three starter factions span T0–T3, deliberately distinct in **shape** so they never read as one bar painted
three colours. They share an economy and the Tama-vs-farmhand allegiance, and the side factions **feed the
spine without ever gating it.** More factions/zones bloom per tier beyond the three starters (see §1.7.1 and
§1.11); each is itself incremental and side content never blocks the spine.

### 1.5.1 ESTATE — the Kurosawa *gōshi* household (MAIN — one unbroken R0–R7 career per tier)

The **Kurosawa** hold a modest hill estate in **Asagiri valley** — proud, threadbare, working much of their
own land, quietly drowning in a ruinous debt inherited from grandfather **Sadamune's** failed flood-control
venture. This is the **only** faction structured as a discrete, gated **rank ladder**, because rising through
it *is* the perseverance fantasy and the dominant driver of the UI-reveal. The career is **one unbroken
climb** — each tier its own **R0–R7** arc (docket #1, **ADR-152**), the old renumbered per-tier ladders
(R8–R15, V0–V7) retired, **T6** flipping the rungs to the house's Edo standing **H0–H7** (docket #9,
**ADR-160**); **rungs interleave LABOUR and COMBAT throughout** — combat is a first-class core pillar **from the very first tier (T0)**, never a mid-ladder
reveal — and **combat earns its own rung-rank (the Combat Rank rung-meter) and Arms-pillar deeds** alongside
labour. The estate **cast and buildings GROW per tier** — the player builds structures and recruits a small
named retinue, framed as **flavour / light systems wired to the reveal bus, NOT a people-management sim** (no
labour-gang to assign, no managed sub-economy, no assignment/management panel; building and recruiting are
narration, never a minigame). The household flatly **disbelieves** the *kamikakushi* legend — to them he is a
reliable hand who became a fighting one.

**Each tier is climbed in TWO SEQUENTIAL PHASES** (formalised at §1.6.4):

- **Phase 1 — climb the rungs.** **At T0 (BUILT — ADR-137/FB-121)** each rung carries a finite **authored
  list of hidden requirements** (counted acts, event goals, economy predicates, story beats — order-free,
  story-consistent, a designed *one-to-many* set); the player sees a **rounded % bar**, completions land
  as diegetic flavor lines, and **100% alone** opens the player-triggered rung beat. **From T1 (frontier
  intent)** the ladder splits into two sub-tracks — **Estate Service** (labour) and **Combat Rank**
  (martial) — each per-rung-reset and floor-paced (≥30 min/rung from T1; whether T1+ keeps a numeric
  meter or adopts the T0 requirement model is that tier's design pass). Smaller responsibility/perk
  drips fill between gates so there is always a "next reveal" on either track.
- **Phase 2 — grind the house up.** **After the final rung** of the tier, the **estate-influence / four-pillar
  grind unlocks** (the capstone rung **OPENS** Phase 2; it does not merely confirm it). The tier's **pillar
  DEEDS accrue here and only here** — they do **not** accrue while climbing the rungs, which prevents the
  "half the rungs, maxed deeds" exploit. Clearing the tier's **hybrid good/great/excellent pillar profile**
  (§1.6.3/§1.6.4) is then what **tiers up** to the next canvas.

**Labour conditioning** stays the **zero-stat enablement gate** on the combat rungs (it *unlocks* them; it
grants **ZERO** combat stat) — orthogonal to, and never bypassed by, the small bounded per-skill combat perks:
conditioning is the **weak→capable** gate, the perks a *capable→a-bit-more-capable* polish. Combat is
available **early** (inside T0): the drill yard and humbling first fight open inside T0, so the player is
*fighting and crafting his own gear* long before any late-game helper appears.

Per the lean discipline, each per-tier ladder is **~8 rungs**. Grander martial titles are **aspirational
narration only**; default to humble household/*ashigaru*-tier titles. *(Patrol-leader / expedition / captain /
overseer narration and any longer braid are parked for T3+ — see §1.7.1.)* Combat grows
**incrementally** along these rungs: T0 **starts with the carrying-pole** and unlocks **+2 more across the tier**
(at least one craftable; the roster grows **+3 at T1, +4 at T2 — ~9–10 weapons across v1**, each an archetype +
a signature ability), surfaced one at a time on the **combat-reveal ladder** (below). *(The cadence is **canon, not a
lever** (§3): T1 (the full estate) opens the **2nd/sword** line, T2 (the Village) the **3rd/staff** line, and
**T3 Region adds no new line — only depth**.)*

**T0 — Estate ladder (~8 rungs; combat is live from the first tier).** Auto-producers do **not** appear on
this ladder — early game is the MC's own active grind (combat, skills, jobs, crafting); idle helpers are a
late-game convenience only (§1.12).

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **R0 — Stray / "another mouth"** | labour | Found half-drowned and taken in; survive convalescence and the first labour. *(Met at the open.)* | The *kura* storehouse (one room, one verb); the body/rest bar and rice counter; the bare diegetic estate dashboard. |
| **R1 — Day-labourer (*hiyatoi*)** | labour | Chief Steward **Genemon** ("another mouth, soft and clumsy") assigns the first real work; complete it, earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the **rice heartbeat** — labour yields **rice + a little coin**, both live from T0; rice you then **eat** (satiety), **store** in the *kura*, or **sell** for coin at a season-swinging price); the basic labour loop. |
| **R2 — Bonded hand (*genin*)** | labour | Sustained, reliable labour across a season; Genemon grants a place on the household's books. | Foraging, woodcutting, hauling; the stables & woodlot edge; the porter's-knot beat surfaces; the **Skills tab**; the woodlot's forage grounds (conditioning-gated). |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | **combat (entry)** | A wolf at the grain store forces the **humbling, near-fatal first fight** early; **survive it**, then beg **Kihei** for drills. The deliberately-incompetent floor of the combat track — surfaced inside T0, not mid-ladder. | The drill yard; the **Combat panel** + idle-combat/training; the **carrying-pole** + **Equipment & Inventory**; the **Bestiary**; the **bare auto-resolve loop + retreat** (character (combat) **level** begins, fed by combat-XP). Combat stats start near-zero. |
| **R4 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger; help hold the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); the first *shinden* reclamation begun; the **simple Crafting tab + loot→craft loop** (Smith Gonta), surfaced as a **top-level nav tab**; **graded weapon-durability bands** surface with it (a weapon degrades but is **never auto-unequipped**). |
| **R5 — Gate-guard (*monban*)** | combat | Stand a real watch; clear the first pest/animal threats; weapon-skill milestones reached. (**Combat Rank** gate; conditioning floor at R3.) | Estate-defence duties; the **stance slot** unlocks; **PEST-CONTROL / HUNT / CLEAR / DEFEND** quest types, surfaced on a **top-level Quests nav tab**. *(Curated combat activities feed the **Combat Rank** rung-meter here; the **Arms PILLAR deeds** do **not** accrue yet — they are gated to **Phase 2**, post-R7.)* |
| **R6 — Foreman of works (*kogashira*)** | labour | Drive the *shinden* reclamation and the workshops to recorded yield; the house edging toward solvency. | The workshops and granary; the low palisade; proto-industry levers; **the first errands past the estate gate** (the valley comes into view; the **village tier proper opens after Phase 2 / tier-up**). |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** | labour→admin (as narration) | First reclamation recorded; the lord begins to notice; the MC takes on the home-fields *office* (his own quests/duties, not a management layer). | Field administration framed as the MC's own offices/quests; **the capstone OPENS Phase 2** — the four-pillar **estate-influence grind** — and the **capstone CHOICE is a mechanical branch** (each answer unlocks a unique T1 side quest → item + unlock; **§3.0.2 / ADR-125**) — with **House Influence made visible** (the standing panel, showing the **revealed** pillar: at T0 that is **Estate** only — Arms reveals at T1; §1.6.4/§2.16(e)); cash-crop levers; the **tier-expansion map**. Clearing T0's **single-EXCELLENT Estate gate** (Estate only — Arms reveals at T1; §1.6.3) is what **tiers up to T1.** |

**T1 — Estate (the land, at full depth): the real grind begins (~8 rungs; its own `R0→R7` arc — the career
unbroken, docket #1; built game trails on the old `R8→R15` labels).**
The same one estate at **full depth** — the deliberate **≥30-min-per-rung** climb first bites here (T0's
tutorial cadence ends). Standing climbs **tolerated → friendly**. The **Arms pillar reveals** and its
**deeds first bank** (in T1's Phase 2); the **coin/rice** flywheel **branches into LAND / TREASURY / TRADE** (trade
**≤⅓**); the **first paid retinue** (Gohei & Yatarō) is won and the **E1→E2** estate stage lands. New verbs,
same familiar domain — and the **first ascension (T0→T1) lands BIG**. The rung-meters reset per rung;
the weapon roster grows **+3** and the **2nd archetype line — the sword** opens here (a Combat Rank rung-gate;
the blade is a full-estate reveal, §3). T1 mints its own ~8-rung R0→R7 arc
(the career unbroken, docket #1; built game trails on `R8→R15`) where the grind-floor first bites; per-rung
detail is at §3.

**T2 — The Valley (the estate's domain expands beyond its gate; ~8 rungs; its own `R0→R7` arc — the career
unbroken, docket #1; built game trails on the old `V0→V7` labels).**
The HOUSE's standing climbs **friendly → TRUSTED**, and its domain grows from bare *survival* to **anchoring its
valley**. Rank is still a rung **within the house's theme**; at every rung you act **FOR THE ESTATE** across the
village + estate + surrounding roads. Labour and combat keep interleaving, now reaching past the estate gate.
The rung-meters **reset per rung** afresh, T2 grows the weapon roster **+4** and opens the **3rd combat line**
(the staff/polearm; on a **Combat Rank** rung-gate), and **T2's Arms-pillar
deeds accrue only in T2's Phase 2**.
*(The **village reputation web** — §1.5.2 — runs **alongside** this as a parallel **optional accelerant**, never
a gate; see §1.5.4.)*

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | labour | The house trusts him to carry its business past its own gate into Asagiri; first village errands. | The market/shop row; the **monme** coin denomination (coin itself runs from T0 — this is a *denomination* reveal as wealth grows, not a new currency); the village reputation web seeds (optional). |
| **V1 — Recognised hand of the house** | mixed | The valley begins to know the house's man (headman + shops acknowledge him); combat keeps pace clearing valley pests/animals. | The chief's house; the deeper wilderness rings; the inn & rumours board (side). |
| **V2 — Road-warden (*michi-ban*) for the house** | combat | Make a stretch of valley road or the ford safe in the estate's name; survive a real bandit/animal clear. | Road-security duties; **HUNT/CLEAR** at valley scale; better loot/craft tiers; the **3rd combat line** (the staff) opens here (a Combat Rank rung-gate; +weapons across T2). *(Arms-pillar deeds accrue in T2's **Phase 2**, not on the rungs.)* |
| **V3 — The house's steward of the valley economy** | labour | Bring the valley economy and the estate's cash-crops to a recorded seasonal result. | Cash-crop and trade levers (the silk/sericulture *meibutsu* sub-engine begins — the trade strand opens at T1, never T0); the broker meters. |
| **V4 — Trusted of the headman** | mixed | Put a valley fire out on the estate's behalf (Magobei's skim surfaces here); win the headman's regard (personal regard is a side accelerant). | The headman's roll-up quests; the doctored-ledger thread; first **Office** standing (the Office pillar reveals at T2). |
| **V5 — Sworn man-at-arms of the house** | combat | Stand a real watch for the valley in the house's name; weapon-line milestones; survive the first dangerous-road encounter. | Gohei & Yatarō (the **T1** paid retinue) **deployed/expanded** at valley scale (not first-won — that was T1, §3); defence of the valley. |
| **V6 — Right-hand-in-waiting (agent over the valley)** | mixed | The lord first believes the house's impact beyond the estate is possible; "clean your room" nearly done. | Authority across the valley; the alliance/standing levers that point at the region. |
| **V7 — Agent of the house, the valley anchored** | labour→admin (as narration) | Estate healthy, valley anchored under it, immediate fires out — the capstone "clean your room" beat. | The **region** map and the **T2→T3** quest; the capstone **OPENS T2's Phase 2** (the pillar grind across **Arms + Estate + Office**); clearing T2's **hybrid profile** bridges to **T3** (the domain expands again, to the Region). Rival samurai houses appear. |

**T3 — Region ladder (v1 scope; enumerated as a per-tier ladder).** v1 completes T3, so its ~8-rung ladder
ships too: the estate's domain expands again — a region-facing hierarchy framed as **the house's** agent over an
ever-larger domain (e.g. the house's **valley-envoy → road-captain of the cluster → broker of the post-town
trade → arbiter between valleys → recognised regional retainer → captain of the road-security detail →
alliance-broker → leading house of the region**), estate standing climbing **trusted → HONORARY MEMBER of the
house**, still interleaving labour and combat (the region has **no rival-house climax** — the enemy with a
face is Lord **Tomita** at the T4 campaign; §1.11). T3 **adds no new weapon line — only depth** (the roster
completes at T2, §3), and **T3's Arms-pillar deeds accrue only in T3's Phase 2** (the revealed-pillar set
reaches **4**, + Name surfacing). The **personal-mystery payoff** (Kuzuhara on the spine; the origin reunions incl. father
**Jinpachi** + the lost-child truth on the **Origin reputation side-track** — §3.6, never 1:1) lands across it. Exact
rung copy is detailed at §3.6 (the unlock ladder). T4/T5 ladders are **scoped forward** (T4 stub, T5 roadmap).

**Combat progression — incremental weapons + the reveal ladder (the §1-level shape; detail at §2.8/§4).**
Combat is a real **incremental progression surface**, not a single switch flipped at T0:

- **The growing weapon roster.** T0 **starts with the carrying-pole** and unlocks **+2** across the tier; T1
  adds **+3**, T2 adds **+4** — **~9–10 weapons across v1**, spread over **3 archetype lines**, each weapon an
  **archetype** (its baseSpeed / reach / targetCount) **+ a signature ability**. New weapons/styles
  are **FOUND and CRAFTED** (at least one craftable), never gifted.
- **The combat-reveal ladder (one reveal per beat).** **R3** — the carrying-pole + the bare
  **auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). **R4** —
  **graded durability bands** surface with the loot→craft loop. **R5** — the **stance** slot. **First
  weapon-L10 milestone** — the **ability + item** slots. **T1** — the **2nd combat line** (a Combat Rank
  rung-gate). **T2** — the **3rd line.**

These feed the three clean tracks (§1.6.4), never one fused bar; the curves and per-weapon params live in
§2.8/§4.

> **Estate physical growth runs *ahead* of top personal rank** (buildings gate on the relevant **pillars**
> — primarily **Estate & Wealth** (and **Arms** for defensive works) — plus a **low** rank floor + cost, not
> the capstone; never a single monolithic "Influence band"). v1 covers estate stages **E0 — Foreclosure's
> Edge** (leaning gate, cracked *kura*, fallow paddies, a rusty door-bar) → **E1 — Stabilising** (kura
> patched, first *shinden* reclaimed, drill yard cleared, gate night-watch) → **E2 — Recovering** (granary,
> two workshops, a low palisade, 2–3 men-at-arms on a rota) → **E3 — Prosperous / Recovering+** (a third
> workshop and a full granary, the palisade closed into a proper perimeter, a standing 4–5-man rota, the
> *shinden* reclamation paying out — the house visibly **back on its feet**; authored for v1). Stages
> **E4–E5** (fortified seat → restored-and-surpassed) are parked (§1.7.1). Estate growth pulls
> **seconded/recruited** faces; the village's own cast does not balloon.

### 1.5.2 VILLAGE of Asagiri (SIDE — a static reputation web)

A rich side faction shaped deliberately **unlike** the estate: instead of one rank ladder it is a continuous,
**multi-node reputation web**. Its cast is **mostly static** (it is a reputation web, not a recruitable
roster). It is the home of the vanished-child (*kamikakushi*) grief the valley carries for **Tama** — and of
**Sayo's** insistence that the stranger is the returned Tama, which the estate flatly disbelieves; folklore
lives here as **light flavour**, delivered through the inn's **rumours board**.
**Village standing NEVER gates the UI ladder or the tier climb** — ignoring it leaves you only poorer and
lonelier, a viable-but-poorer playstyle, never a wall.

Several **continuous meters** rather than one ladder:

- **Per-shop "patron/regular" standing** (smith, dry-goods/rice broker, herbalist, brewer, and **the weaver
  who leads the *meibutsu*: silk / sericulture**) — each unlocks stock, discounts, and
  exclusives, and high standing **softens the market-saturation price-crash**.
- **Per-family goodwill**, raised by **open-ended help** (you hear a family has trouble and figure out how to
  help — never a checklist).
- An **artisans'/craft-guild standing** gating recipes, component tiers, and master-craft commissions.
- The **Village Chief's regard** — headman (*shōya/nanushi*) **Mohei**, a weighted roll-up of the others
  plus chief-specific quests. His daughter **Sayo** is the namer — the living heart of the Tama thread.

Curves are **gentle** (linear/soft-cap) for frequent small dopamine across many nodes, contrasting the
estate's steep geometric rank gates.

### 1.5.3 ORIGIN — his living family & friends (SIDE — a memory-gated support track, opens at T3)

The protagonist's **original family & friends** are **living** people in a nearby post-town
(**Sawatari-juku**, an invented town on an unnamed *kaidō*, a day-plus down the road) — **not** the local
village. His true name is **Tahei**; his old life was as a young porter/errand-hand for a small
transport-and-goods house. This track is a memory-gated, late-blooming **support track**, NOT grindable from
day one. It stays dark — foreshadowed for hours by the dream so its absence reads as anticipation — and
**opens at T3 (the region tier)**, when the dream has returned enough memory **AND** the protagonist's
standing lets him physically travel the controlled *kaidō* (*sekisho* checkpoints make free travel
impossible without standing). It is a **standalone reputation side-track**, distinct from the house rungs and
**never converting 1:1** (docket #9/ADR-160; §3.6) — optional, fully completable, an **accelerant**,
narrative-only with **ZERO mechanical gift from remembering**, and it **NEVER gates the spine**. Its stages
walk the reunion in sequence:
recognised at the post-town → the household reopens (mother **O-Nobu**, sister **Suzu**) → the old trade
welcomes him (toiya master **Zenbei**, friend **Kenta**, the porter-guild) → the father met (**Jinpachi**) →
**his own name reclaimed — "Tahei" set down (the Origin capstone, O5).** This O5 name-reclaim is **earned and *missable*** (a player who skips the Origin track may
never reclaim it) — and is **separate from** the lost-child **TRUTH** (that he is *not* Tama; **Otsuru** is),
which is **spine-guaranteed at G6 for every player** regardless of the Origin track. *(His family — father
**Jinpachi**, mother **O-Nobu**, sister **Suzu** — are **all alive** and, unlike the valley, **refused to
grieve him**, keeping his register entry open; so the reunion is a **homecoming**, not a return-from-the-dead.
It resolves at **T3**, with an optional later emotional callback at T5 — see §1.9, §1.11.)*

Payoff is **support, not local power**:

- **Pride/morale** — a modest global skill-XP buff framed as a **new present-day relationship** ("a man with
  people behind him works harder"), **never a retroactive gift from remembering.**
- **Allies** — old porter/guild mates recruited to the expansion.
- **Trade ties** — origin-town goods, contracts, and ready-made caravan/porter routes that plug into the
  estate's region/castle-town/Edo expansion.

**Hard guardrail:** **remembering itself grants ZERO** — the returning **memory / backstory
reveal** confers no stat, recipe, tool, or combat bonus; it grants **access** (new nodes/allies/quests unlock
narratively). But the **present-day relationships** you then build **are** legitimate mechanics that **stay**:
the new-relationship **morale buff** (a modest global skill-XP nudge) and the **origin trade-ties** that **shave
~10–15% off time-to-next-tier** are **earned new relationships, not retroactive gifts from remembering**
(§1.5.4). Every asset must still be grind-built. At least one origin beat is always available **without**
reputation-gating, so the thread never fully stalls. (The re-foundable **Kuzuhara** hamlet and the wider
post-town commercial region are T2+ expansion nodes — see §1.7.1.)

**Missable-capstone signpost.** Because the O5 name-reclaim is **earned and missable**, the game
gives a **soft, non-spoiler signpost** that the Origin track carries a **one-time capstone a player can miss** —
e.g., a faintly-marked final rung on the Origin / Ties ladder, or a single line such as *"this thread has an
ending you could let slip"* — enough that a **completionist isn't blindsided**, **without revealing what the
capstone is** (the surprise of *what* "Tahei" means is preserved).

### 1.5.4 How the three interrelate — and the Tama-vs-farmhand allegiance

**THREE reputation systems, two shapes.** The **ESTATE = the SEVEN-TIER
SPINE** — the only thing that gates tier advancement. Per tier the estate-standing arc climbs (T0 stranger→**tolerated** ·
T1 tolerated→**man of the house** · T2 friendly→**TRUSTED in the valley** · **T3 trusted→the house's reach made
flesh** · **T4 the campaign that TAKES the castle-town** · **T5 the domain's caretaker→chief steward / *yōnin***
— the MC's personal CEILING, "ends at THE STEWARD" · **T6 the MC stays *yōnin*; the arc shifts to the HOUSE's
national standing (H0→H7)** — the indirect/mediated Edo ceiling, the *house* ranked, never the man) and the
estate's **domain expands**: the household on its own land (T0) → **the full estate & land** (T1) → **+ the
valley & the village of Asagiri** (T2) → **+ the region** (T3) → **+ the castle-town** (T4) → **+ the domain**
(T5) → **+ Edo / the nation** (T6). The **VILLAGE (from T2)** and **ORIGIN (T3)** reputations are **standalone
side-tracks**, distinct from the house rungs and **never converting 1:1** (docket #9/ADR-160) — optional
**accelerants that NEVER gate** the climb. The **village web** (how Asagiri *personally* regards you) carries
forward; the **Origin track** (Tahei's living family/friends; the reunion an OPTIONAL side-track at
Sawatari-juku) is a **reputation side-track** (§3.6), never a parallel rung ladder.

**Separate earned tracks** keep these from collapsing into one bar. The **estate spine** is gated, **per
tier**, by **Phase-1 rung progression** — at T0 the authored requirement lists (ADR-137); from T1 the
Estate-Service/Combat-Rank sub-tracks (frontier) — each **per-rung-reset**;
then, in **Phase 2**, by the separate **four-pillar hybrid tier-gate** (§1.6.3/§1.6.4). Distinctly, the **combat
systems feed THREE clean, separately-stored tracks** that must never collapse into one: **(1)** kills/combat-XP →
the **character (combat) level** (HP + attribute points + satietyMax); **(2)** recognised **deeds** → the **Arms
pillar** (House Influence, Phase-2-gated); **(3)** per-rung curated activities → the **Combat Rank rung-meter**
(the martial rung-gate above). Alongside the spine sit the optional side-track meters: **Village Reputation**
(gentle per-node meters — the T2 side-track) and **Origin Ties** (the T3 reputation side-track).
Above all of them sits **House Influence** (家威), the macro-measure the tier-gate reads — **never spent** (§1.6):
the estate generates it directly, while village allies and origin trade-ties act as **multipliers/feeders** — they don't unlock the
next tier, they make conquering it faster and cheaper (tuned so weaving both in shaves **~10–15%** off
time-to-next-tier — *felt, never a wall*).

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

## 1.6 House Influence (家威) — the four pillars & the seven tiers

**House Influence** (家威, *ka-i*) is the macro-resource — the estate's **recognized standing** in the eyes of
progressively wider authorities — and the **one thing the entire UI-reveal is gated on.** It is **re-expressed
as the house's *koku* standing** — a *kokudaka*-like prestige **SCORE** (an assessed *kokudaka*), **NEVER
spent** and **NOT an income multiplier**: it is the cumulative measure of what the house has visibly
**become**, re-assessed **seasonally** (a *seasonalJudge*) with a big "the assessors arrive" set-piece at each
tier jump. It is deliberately **NOT coin** — coin is the currency you spend and grind; the *koku* standing is
the assessment that grind *earns*. It is no longer a single trade-leaning number: it is the **umbrella
roll-up of FOUR achievement-driven pillars** grown in lockstep, each mapping to a distinct protagonist domain
so the grind stays load-bearing.

> **The tier→*koku* ladder (bands PROVISIONAL/liquid — magnitudes sim-owned, ADR-117/ADR-132).** The standing
> score climbs with the tiers: **T0** tens → **T1** ~100–1,000 → **T2** ~1,000–5,000 → **T3** ~5,000–10,000 →
> **T4 = 10,000 (DAIMYŌ)** to ~100,000 → **T5 (the Domain)** ~100,000–1,000,000+ → **T6 (Edo)** — band
> **provisional (—)**, set at sim time. The score **gates ascension/unlocks** but is never a currency; a
> **personal *koku* stipend** appears only from **T4+** (House-only before), and the **upper tiers (T5–T6)**
> add a **full parallel Office / court-rank / favour track** (koku = scale, office = access) with rank
> milestones granting **visible status tokens** (surname → the two swords → *gōshi* rank). **T0 already grants
> exactly ONE hard-won home status token** (across R1→R7, shown by the housing status-mirror); the **full**
> surname→swords→*gōshi* ladder is the deliberate **T1–T6** arc (**ADR-122**).

> **The pillar-reveal schedule.** The four pillars **reveal one per tier** across the
> spine — **Estate (家産) at T0 → + Arms (武威) at T1 → + Office (官威) at T2 → + Name & Honour (家格) at T3** —
> then **T4–T6 deepen the four with no new pillar.** The reveal-ramp of active pillars is **1 → 2 → 3 → 4 → 4 → 4 → 4**.
> *(T0 opens **one** pillar, Estate; the Arms-pillar **DEEDS** first bank at T1, though combat-as-activity is
> live from T0.)*

### 1.6.1 The four pillars

| Pillar | Kanji | Protagonist domain | Grows on |
|---|---|---|---|
| **Arms** (martial) | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognised martial deeds (a road declared safe; a nest cleared; the grain store defended; a rival's enforcer broken) + seasonal security **judged results** (fired on a new high-water mark, never repeatable maintenance) |
| **Estate** (economic) | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation), **TREASURY** (debt→solvency→creditworthiness, *goyōkin*), **TRADE** (routes, broker standing, the signature ***meibutsu*: silk / sericulture**) |
| **Office** (political/territorial) | 官威 *kan'i* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed (named on the roster; the bailiff duty; a dispute arbitrated; a valley allied) |
| **Name** (prestige/cultural) | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition; the house off the foreclosure list; a sponsored rite; an inspector's report; a recorded merit-elevation |

> **Canon pillar names (bible; ADR-159, HD-25 — kept, not superseded).** The four
> pillars' canon names are the crisp single words **Estate · Arms · Office · Name**
> (家産 · 武威 · 官威 · 家格), under the umbrella **House Standing (家威)**. "Office"
> (官威) replaces the old "Standing & Office" so it no longer collides with the
> umbrella term; the "& Wealth"/"& Honour" longforms are descriptive only. Each
> pillar is graded on a **six-step ladder — FAIL · BAD · OK · GOOD · GREAT ·
> EXCELLENT** (F·D·B·A·A+·S). Full engine:
> [`docs/story-bible/03-tiers.md`](../../story-bible/03-tiers.md) "House Standing —
> the four pillars".

> **The Estate & Wealth sub-engines = the coin/rice flywheel, revealed across the Estate split.**
> In **T0** the economy is a **single LINEAR taste** — one work → **rice + a little coin** → upgrade → more
> output — the flywheel shown in miniature, with **no branching and no trade strand**. **Rice is a real
> resource** (not a synonym for the *koku* standing): you **eat** it (satiety), **store** it in the *kura*
> **at a cost** (spoilage / cap / fee, mechanism TBD — **ADR-118**, so store-vs-sell is a real choice), or
> **sell** it for coin at a price that **swings by season**. At **T1** (the full estate) it **branches into
> the three capped sub-engines — LAND / TREASURY / TRADE** (the *meibutsu* silk strand stays **≤⅓** of the
> pillar). The real village silk market (the weaver's *meibutsu*) opens later still, at **T2 the Valley**.
>
> **Coin is the sole spendable currency** — ONE underlying value (base unit *mon* 文), **displayed in fixed
> mixed denominations** revealed **incrementally as wealth grows**: *mon* (T0–T1) → *monme* (the T2 reveal) →
> *ryō* (T4–T5), where **1 ryō = 50 monme = 4,000 mon** and **1 monme = 80 mon**. There is **no moneychanger
> and no floating forex** — every cost (market, estate, repair) and the combat loss-bite is **coin**.

> **The Arms pillar vs. the other two combat tracks (§1.6.4).** Arms grows **only** on **recognised DEEDS**
> (the influence economy) and, like every pillar, **accrues in each tier's Phase 2** — *not* while climbing the
> rungs. It is **distinct** from the **character (combat) level** (fed by combat-XP from kills) and from
> the **Combat Rank rung-meter** (fed by per-rung curated activities): **one kill** writes XP to your
> **level**; **one recognised deed** writes to **Arms**; **one curated rung activity** writes to the **meter**.
> Reconflating these three is the single likeliest regression — they stay separate by design.

> **Trade is demoted to 1-of-3 sub-engines inside Estate & Wealth and hard-capped to ~⅓ of that one pillar**
> — so a pure-trade run maxes ~⅓ of one of four pillars and can never dominate. The signature **_meibutsu_ =
> silk / sericulture** is **one capped strand in one sub-engine of one pillar** (still subject to the trade ≤⅓
> cap).
>
> **The trade ≤⅓ cap is a HARD structural cap.** Cross-pillar **combos** are **broad**
> — **multiple pillar pairs**, larger magnitude (the T2 anti-slump leans on **both** seasonal-reward
> **rotation** *and* these combos) — but they are computed **POST**-clamp and **excluded** from the
> gate-threshold check, and the §6.6 verifier proves a combo can **never** breach ⅓ nor satisfy a required
> pillar. **T0 has no trade strand at all** (the trade sub-engine opens at T1).
>
> **Note:** the **Office** pillar's kanji is **官威 (*kan'i*)**, "authority of office". Awareness:
> 官威 is a spoken homophone of 官位 ("court rank") — disambiguated by the kanji.

### 1.6.2 Accrual

Influence accrues in **two shapes only — never a passive time-trickle and never a flat per-action increment** —
and, crucially, **only on the PHASE-2 estate-influence track**: pillar **DEEDS do not accrue while you are
climbing the rungs** (they are gated **post-final-rung**), which prevents a "half the rungs, maxed deeds"
state.

- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded yield, a
  granted title, a sealed contract, a road declared safe in the books, a won petition). Per-event caps carry
  over from the Combat-Deeds discipline so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (not repeatable maintenance awards).
  **Weather and festivals modulate these judged results mechanically, bounded ±10%** (a day-keyed RNG
  sub-stream), and **bulk sales** apply a **saturation damper progressively per-unit** (legible, un-gameable).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable dents** (a lost battle
dents Arms; a scandal dents Name; a called debt dents Estate) — small and **never a wipe** (no permanent
holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by rebuild). Dent
self-heal is a small **below-high-water seasonal restore** that **never advances the high-water mark**.

### 1.6.3 The seven tiers, transition story gates & per-tier pillar gating

Tier-up is **not** crossing a single band: each tier gates on a **scaled
grade-gate across the pillars REVEALED by that tier**. For **N** open pillars you need **exactly 1
EXCELLENT + 1 GREAT + (N−2) GOOD**, all **≥ GOOD** (**no** overflow substitution; **breadth required,
specialisation rewarded**). The grades are a **six-step ladder — FAIL · BAD · OK ·
GOOD · GREAT · EXCELLENT** (F·D·B·A·A+·S; the English word carries the read, the
letter is the glance): **GOOD = the expected baseline · GREAT = really strong ·
EXCELLENT = above-and-beyond**, with OK/BAD/FAIL the states below the GOOD gate
floor. The **revealed-pillar set grows one per tier**: **T0 = 1**
(Estate — the gate **collapses to a single EXCELLENT**, the (N−2) term dropping), **T1 = 2** (+ Arms → 1 GREAT
+ 1 EXCELLENT), **T2 = 3** (+ Office → 1 EXC + 1 GRT + 1 GOOD), **T3 = 4** (+ Name → 1 EXC + 1 GRT + 2 GOOD) —
the gate is **only ever checked against revealed pillars** (never against an unrevealed one).

This sits **after** the **sequential** climb (§1.5.1/§1.6.4): **Phase 1** — climb **all** the tier's rungs
(at T0 the per-rung requirement lists, ADR-137; T1+ per that tier's design); **Phase 2** — the estate-influence/pillar grind unlocks and the
**scaled grade-gate** above is what tiers up. The required pillars still **drift** as they reveal — early
tiers lean **Estate then Arms** ("survive and get strong"); upper tiers lean **Office + Name** ("win it socially").
The **per-pillar-per-tier thresholds** are **back-solved against the fixed §4 deed inventory**; the numbers
live in §4. The only structural cap is the **trade sub-engine ≤⅓ of Estate & Wealth** (so trade can never
carry a gate; cross-pillar combos are computed **post-clamp** and **excluded** from this gate-check). Side factions are
**multipliers** into the pillars, never new pillars. The full seven-tier climb is paced over a
**generational/decadal in-world span** for the upper tiers (T4→T6), so "restore *and* surpass" reads as earned
over years.

> **Ascension is a manual opt-in story event.** Clearing the scaled grade-gate only **unlocks
> the *option*** to ascend — the player chooses *when* to take it, a deliberate story beat (never an auto-snap).
> **Overshooting** the gate (higher grades than required) earns a **grade-scaled permanent boon** carried
> forward. The **first ascension (T0→T1) always lands BIG** on first contact regardless of grade — the
> locked silhouettes stir, a new pillar reveals. **The T0→T1 capstone now also carries a
> mechanically-distinct BRANCH** — a real choice that matters mechanically, not just the grade-scaled boon;
> the exact branch design is **TBD at build** (**ADR-121**; opus-2026-07-03-v0.3.5-build-plan §7). Throughout,
> the **standing panel teases the locked pillars as
> unnamed silhouettes** beside the active one(s) (§1.6.4 / §2.16(e)), so the player always senses *more* is
> coming without it being spelled out.

| Tier | Theme | Transition story gate (entry) | Phase-2 scaled grade-gate (per revealed pillars) |
|---|---|---|---|
| **T0 — Estate (the household)** | Earn your keep and survive your first days — a showcase-in-miniature (standing **stranger→tolerated**). One declining hill estate, a **small walkable map**, unlocked room by room. | *(Met at the open.)* Survive convalescence and the first labour. | **1 pillar** (revealed: **Estate**): the gate **collapses to a single EXCELLENT** (the (N−2) term drops) — *kura* solvent, first *shinden* begun. The humbling first fight is survived as **activity**, but the Arms-pillar **DEEDS don't bank yet**; **no trade engine** (the T0 shop is a personal **coin** sink, not estate trade). |
| **T1 — Estate (the land)** | The estate's LAND at full depth — the real **≥30-min-per-rung** climb (standing **tolerated→friendly**): terraces, the *kura* key, the wings opening one at a time, ending in the restored *shoin* (Lord **Munemasa**'s only scene, the register's last entry, his death at the seam). The **Arms pillar reveals**; the **coin/rice** flywheel **branches into LAND / TREASURY / TRADE** (trade ≤⅓). | **T0→T1:** clear T0's single-EXCELLENT gate → the **first ascension lands BIG** on first contact regardless of grade (the silhouettes stir, the **Arms pillar reveals**). | Revealed: **Estate + Arms** (2): **1 GREAT + 1 EXCELLENT.** The first Arms-pillar **deeds bank here**; **E1→E2**; the first paid retinue is won. |
| **T2 — the Valley** | The estate's domain expands **beyond its gate** to the valley village **Asagiri** and its watching households (standing **friendly→trusted**). THE REVEAL lands (three signals; the map re-labels itself — guest house → the true main house; docket #6) and the true restoration begins; the village reputation track opens at zero; the bandit camp is the valley's trouble. | **T1→T2:** clear the land gate → the regency sends him into the valley as the house's messenger (**unlocks the Valley**). | Revealed: Estate + Arms + **Office** (3). **1 EXC + 1 GRT + 1 GOOD** (the house's voice at the headman's table; cash-crops + the silk market online). |
| **T3 — the Region** | The estate's domain expands to **lead a region** (standing **trusted→HONORARY MEMBER of the house**): road-guard to the house's reach made flesh; the **Origin** family (Tahei) as a one-tier rep side-track (own rungs) and the **Tama truth resolving — Otsuru found grown**. **v1 completes here.** | **T2→T3:** the valley anchored → the lord first believes impact beyond it is possible → a quest to grow **regional influence**; the personal-mystery payoff lands. *(v1's content finishes on completing Region — `outcome: t3done`.)* | Revealed: Estate + Arms + Office (+ **Name** → 4). **1 EXC + 1 GRT + 2 GOOD**; the **personal-mystery payoff** lands here. |
| **T4 — the Castle Town** *(stub / cliff-hanger; beyond v1)* | The tier with a FACE for an enemy — the martial lord **Tomita**, whose hands are in both old wounds. **Katsuhide** found and renouncing in writing; **Shinnosuke** named heir; the campaign ends with the house **TAKING the castle town**. The hard lock drops — free travel from here (standing **honorary member → chief steward / *yōnin***, the MC's personal CEILING). | **T3→T4:** **win the region** → the campaign against Lord **Tomita** and his castle town. *(v1 closes on the **castle-town first-contact** cliff-hanger.)* | Deepen the four — **Office + Name excellent** (the takeover won socially); Arms/Estate as leverage. |
| **T5 — the Domain** *(roadmap)* | **Caretaker administration of a broken domain** — the inherited debt at scale (the MC stays *yōnin*; the arc shifts to the HOUSE). THE RUNG-UP INVERTS: each rung an audience-day, the domain summoned to HIM; beneath it **Genemon**'s failing, the handover, the chair. Ends at **THE STEWARD**. | **T4→T5:** the taken castle town cedes → the house is charged with the **broken domain's** caretaker administration. | Deepen the four (**provisional** — the profile is set at sim time). |
| **T6 — Edo** *(roadmap; reserved)* | Personal rungs retire; the rungs become the **HOUSE's Edo standing, H0→H7**; **Shinnosuke** is lord — restore **and** surpass the grandeur of three generations ago. Deliberately **RESERVED** (the mediated capital ceiling; the man is never received). | **T5→T6:** the house is called to the capital — it staffs & runs the **domain's** Edo establishment under the daimyō's biennial *sankin-kōtai* (never its own). | **Provisional (—)** — the national *banzuke* on all four pillars; reserved. |

> **Every tier is Phase-1-then-Phase-2.** The rung-meter + story milestones (Phase 1, §1.5.1/§1.6.4)
> **precede** the pillar profile above (Phase 2): you climb the rungs first, then grind the **revealed** pillars
> to the profile, then tier-up. (The T0 entry is "met at the open"; the deed-bearing Phase-2 grind that *proves*
> the profile begins only **after R7**.)

> **Castle-town takeover = MULTI-ROUTE** (peaceful: office / economy / marriage / out-maneuvering rivals; AND
> assertive: martial-security leverage). "Take over" = becoming the **dominant house holding key domain
> offices** — **never open rebellion against the bakufu.** Martial scale is **hard-capped** throughout: a small
> named retinue plus temporary corvée/levies for crises, **never a standing army.**

### 1.6.4 Progression structure — the sequential two-phase model & the three combat tracks

This subsection is the **single load-bearing home** for the progression spine; §1.5.1, §1.6.3 and §1.12 all
reference it (exact curves/thresholds live in §4).

**(1) Sequential per-tier progression.** Each tier is climbed in **two ordered
phases**:

- **Phase 1 — climb the rungs.** Every rung of the tier's ladder promotes when its progression is
  **fully earned** — **at T0 (BUILT, ADR-137)**: the rung's authored **hidden requirement list** is 100%
  done (story preconditions are requirements IN the list; the % bar is the read; per-rung-reset). **From
  T1 (frontier)**: floor-paced per-rung progression (the ≥30-min floor the §4.8 pacing model and the
  §6.6 gate-monotonicity verifier use), fed by **curated, story-consistent per-rung activities** — a
  designed **one-to-many** set, **not** a single repeat-counter; meter vs requirement-list mechanism is
  each tier's design pass. Two sub-tracks run in
  parallel: **Estate Service** (labour) and **Combat Rank** (martial).
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind**. **Pillar DEEDS accrue here and ONLY here** (gated post-final-rung), which
  structurally prevents "half the rungs, maxed deeds." Clearing the tier's **hybrid pillar profile** (below) is
  what **tiers up** to the next, larger canvas. *(There is **no stored "phase" flag** — the current phase is
  **derivable from the current rung**: pre-capstone = Phase 1, post-capstone = Phase 2.)*

> **Every rung-up is a player-TRIGGERED story beat, not a silent number-fill (ADR-110, extending ADR-104).**
> Clearing a rung's AND-gate only **readies** the promotion — it **holds** (surfaced at the header rung
> element) until the player chooses to stop grinding and **trigger** it, and a ready rung can be **ignored**
> (grind combat forever, never advance; never a forced modal every few seconds). Triggering plays the rung as
> a **full-screen VN beat** on the same scene engine as an NPC first-meet (ADR-104): **some** rungs introduce a
> **new character**, others deepen a known one (no rung is a silent number-fill). The beat carries **choices**,
> and **NPCs REMEMBER** them — per-NPC relationships + story flags persisting across ascension (`npcMemory`,
> §2.12). Choices **mainly** move **relationships + flags**, with only **occasional, small, varied** bonuses —
> **it is NOT the case that every rung grants a perk** (the intro's three perks were a one-time boost, not the
> standing pattern). This is the within-tier twin of the manual-opt-in **ascension** callout below (§1.6.4(3)).

**(2) The three clean combat tracks.** The combat systems feed **three separately-stored
tracks that never collapse into one bar.** What **one kill** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role |
|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** (labour and deeds **never** raise it) | **HP** (`hpMax = 40 + 8·characterLevel`), **+1 attribute point / 2 levels**, **satietyMax** (base + per-level growth) | personal power; per-mob `MobDef.level` sets on-kill XP (§4) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the scaled grade-gate) |
| **The Combat Rank rung-meter** | **per-rung curated** combat activities | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate |

So: **one kill** → character-level XP; **one recognised deed** → Arms; **one curated rung activity** → the
Combat Rank meter. *("**Combat Rank**" is the martial rung-meter; "**Standing**" means the
**官威 Office** pillar **only**.)* **Labour conditioning** stays the **zero-stat enablement gate** on
the combat rungs — orthogonal to, and never a back-door past, the small bounded **per-skill combat perks**:
conditioning is **weak→capable**; the perks are a small **capable→a-bit-more-capable** polish.

**(3) The Phase-2 scaled grade-gate.** Phase 2 tiers up on the **scaled
grade-gate** **over the pillars revealed by that tier** — for **N** open pillars, **exactly 1 EXCELLENT + 1 GREAT
+ (N−2) GOOD**, all **≥ GOOD**, **no overflow** (at **T0**, N = 1, the gate **collapses to a single EXCELLENT**).
Revealed set (one per tier): **T0 = Estate**, **T1 = + Arms**, **T2 = + Office**, **T3 = + Name** (4).
Ascension is a **manual opt-in story event** (the gate only unlocks the *option*); **overshoot** earns a
**grade-scaled permanent boon**; the **first ascension (T0→T1) always lands BIG** and now also carries a
**mechanically-distinct BRANCH** (a real capstone choice; design TBD at build — **ADR-121**). The
per-pillar-per-tier thresholds are back-solved against the fixed deed inventory in §4; trade
stays **≤⅓** of Estate & Wealth as the **only** structural cap, with cross-pillar combos computed **post-clamp**
and excluded from the gate-check.

> **The standing-panel teaser.** From the capstone of **T0**, **House Influence becomes visible** as a
> standing panel showing the **active pillar(s)** filled and bar-graphed beside the **locked pillars rendered as
> unnamed silhouettes** — the player sees there are more pillars coming (and roughly how many) **without** their
> names or mechanics being spelled out, so each reveal still lands as a story beat (§2.16(e); ui-design.md).

Together: **climb the rungs (Phase 1: rung-meter + story) → unlock and grind the revealed pillars (Phase 2) →
clear the scaled grade-gate → tier-up.** Every reveal along the way is **design-staggered one-at-a-time** (no
runtime reveal-queue).

## 1.7 World & areas — v1 IMMEDIATE (T0–T3)

The estate-rank climb spatially **embodies** the tier escalation: you start trapped in one storehouse room and
earn the rest of the estate room by room (the rank ladder made of doors), then the village, then the
wilderness (by conditioning), then your own past (by memory). Each tier opens a fresh, larger canvas — **no
reset** — and every frontier is **itself incremental** (arrive minimal, learn its people and systems). The
wilderness is a **shared danger gradient gated by conditioning**, distinct from the Influence-tier authority
canvas. **T0 ships as a small walkable estate map** (delivering §1's "areas to explore"), extending into Asagiri (the Valley) at T2; v1 ships **full maps** for **T0–T3** within a **~6–8-node cut-set** (the rest parked in §1.7.1). Areas live
in a **data-driven registry** (`content/world.ts`) with **unlock predicates** over GameState — reinforcing the
data-driven, headlessly-testable framing.

**The tier→map ladder** ([`05-world.md`](../../story-bible/05-world.md)): Estate (the household) → Estate (the
land) → the Valley → the Region → the Castle Town → the Domain (*han*) → Edo. Two large late regions (the
castle town, the domain), then Edo; the map never attempts all of Japan. Zones unlock **rung by rung within
each tier** (incremental, never dumped at tier start), the home base **grows every tier**, and **REPAIR is a
first-class world verb** (older parts carry visible repaired-vs-ruined state; restoring the main house is the
spine).

**The estate anatomy — the twist made spatial** (the single most load-bearing world structure;
[`05-world.md` "The estate anatomy"](../../story-bible/05-world.md)):

- **Layer 1 — the GUEST HOUSE** (what everyone calls "the main house" through T0–T1): a grand winged guest
  residence with an entire estate's functions COMPRESSED into it — the clue hiding in plain sight.
  - *Outer guest house (T0):* the **Gate & gateyard** · the **Forecourt** · the **Woodshed & yard buildings** ·
    the **Kitchen & board** · **Sōan's sickroom** · the **Drill yard** (the old stable court repurposed) · the
    working **Kura** · the **home paddy & vegetable rows**.
  - *Inner guest house (T1 unlock arc):* the **East wing** · the **West wing** (closed rooms) · the inner
    garden · Toku's room · the shrine alcove (the wrong sandals) · the **Shoin**, restored last — Munemasa's
    one scene, the register.
- **Layer 2 — the RUIN** (the TRUE main house, the old *jin'ya* compound; locked scenery until the **T2
  reveal**, then the restoration's object): the outer domain (T2 works — the great gate, outer court, barracks
  row, the gatehouse rebuilt first) → the wings (T3 — the East hall's offices, the West hall's quarters) → the
  inner domain (late T3 — the old lord's residence, the original family temple-alcove, **the sealed storerooms
  — the BURIED TRUTH**) → the **AUDIENCE HALL** at the center (T4–T5, restored last — the venue of the T5
  audience-days).
- **The function migration** (the twist made playable): the steward's office → the East hall (T3); the family →
  the inner domain (T4–T5); worship → the original temple-alcove (T3); and at **T5 the guest house RETURNS TO
  BEING A GUEST HOUSE** — the bakufu's men lodged in the rooms the family once hid in.

**The T2 reveal, staged** (docket #6, **ADR-157**): three converging signals — a well rumor ("that yard was a
town once"), the compound's old plans found in the kura (the "main house" labelled *guest quarters*), one Toku
past-tense line — then **THE MAP RE-LABELS ITSELF** ("Main house" → "Guest house"; the ruin gains its true
name), the twist delivered by the UI surface itself (kernel #6; TST2 — a watched surface never yanked).

Beyond the estate, the **wilderness** stays a shared danger gradient gated by conditioning (the estate's
near grounds → the deeper woods → the river/ford/weir where he was found → the foothills); the **valley,
region, castle town, domain and Edo** zones are enumerated per tier in the bible tier sheets
([`tiers/`](../../story-bible/tiers/); [`03-tiers.md`](../../story-bible/03-tiers.md)).

**The shipped T0 walkable map (v0.4.0)** opens the estate anatomy above room by room:
*The weir & riverbank* (the cold open) · *The forecourt* · *The gate & gateyard* · *The kitchen threshold* ·
*The woodshed* · *The home paddy & vegetable rows* · *The field margins* · *The kura & grain-store* ·
*The woodlot edge* · *The weir reeds* · *The drill yard* · *The shrine-alcove corridor* ·
*The overgrown orchard* · *The bamboo grove* · and *The ruined compound* (locked scenery until the T2 reveal).
Bible source: [`tiers/t0.md`](../../story-bible/tiers/t0.md).

**The built-game area registry (trailing until the storywave game plan lands):**

| Area | Region (tier) | Faction | Notable locations | Unlocks when |
|---|---|---|---|---|
| **The Kura Storehouse** | Kurosawa Estate (T0) | Estate | The convalescence pallet; spilled rice to rake | At the open (R0, Stray). Home of the UI-reveal engine (body/rest bar, rice counter). |
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate (T0) | Estate | The *genkan*; the visitor's mat | R1. The diegetic stage for promotions and the Tama-vs-farmhand framing. *(T0 room/area reveals are SEPARATE — the stables, woodlot edge, and drill yard each reveal individually, not folded in.)* |
| **The Home Paddies & Dry Fields** | Kurosawa Estate (T0) | Estate | Fallow plots to reclaim; the granary | R1; *shinden* reclamation begins around R4. The **rice heartbeat** (active grind, not idle producers) — rice to eat, store, or sell for coin. |
| **The Drill Yard** | Kurosawa Estate (T0) | Estate | Training posts; Kihei's weapon rack | **R3, after the humbling first fight (combat live from T0).** Conditioning & idle-combat. |
| **The Main House / *Omoya*** | Kurosawa Estate (T0) | Estate | Kitchen & inner rooms; the household shrine; the lord's study (ledgers) | R4 (houseman); the study at R7 (bailiff). |
| **The Workshops, Granary & Palisade** | Kurosawa Estate (T1) | Estate | The two workshops; the granary; the low palisade; the men-at-arms' rota | **T1** — the full-estate grind (estate stage **E1→E2**); proto-industry levers; the first paid retinue (Gohei & Yatarō) mustered. The Arms-pillar's first deeds bank here. |
| **The Market / Shop Row** | Village of Asagiri (T2) | Village | Smith Gonta's forge; Obaa Kuni's herb stall; Brewer Tokuemon's; Weaver Onatsu's (silk) | T2 (the full estate trusts him to carry its business past the gate; village V0). Per-shop reputation meters; the real silk *meibutsu* market. |
| **The Chief's House** | Village of Asagiri (T2) | Village | Yagōemon's receiving room; the village ledgers | T2, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
| **The Inn & Rumours Board** | Village of Asagiri (T2) | Village | The rumours board; the common room | T2. Sukezō's inn — hub for optional light folklore side-quests (unlocked organically). **None gate tier progression.** |
| **The Shrine / Temple** | Village of Asagiri (T2) | Village | The shrine (*shimenawa*); the temple register; the Bon offering site | T2. Priest Ryōa's register of the vanished (a mystery clue). |
| **The Jizō at the Weir** | Wilderness & Mountains / Asagiri boundary (shared, T0–T3) | Village / neutral | The boundary *jizō* **at the weir where he was found**; an offering left by an unknown hand | T0–T2, gated by conditioning. **The single find-spot** — where he was pulled from the river — and the **one** capped residual-ambiguity beat (the unknown-hand offering lingers unresolved). |
| **The Woodlot's Forage Grounds** | Wilderness & Mountains (shared, T0–T3) | Shared wilderness | Foraging groves; the bamboo stand | R2/T0, gated by conditioning. First ring of the danger gradient. |
| **The Deeper Woods (奥山)** | Wilderness & Mountains (shared, T0–T3) | Shared wilderness | Deep forage groves (*sansai*) | T0, one hill past the forage grounds (behind the danger ring, at a higher satiety cost). **The second conditioning-gated danger ring** — gates the richer `forage_deepwoods` yield, so the map earns its walk. |
| **The River, Ford & Weir** | Wilderness & Mountains (shared, T0–T3) | Shared wilderness | The ford (the "kappa" spot); the weir | T0–T2, gated by conditioning. Fishing + the "kappa" thread (undertow + smugglers' sinking-spot). *(The find-spot **jizō at the weir** is its own row above — the lone residual-ambiguity beat is co-located there.)* |
| **The Foothills & Charcoal Grounds** | Wilderness & Mountains (shared, T0–T3) | Shared wilderness | The hidden charcoal kiln ("fox-fire"); hunting trails | T2, deeper conditioning. A further danger ring at valley scale. |

## 1.7.1 World & areas — LATER (T3 deep + T4–T5 expansion; parked, not cut)

Parked per the lean discipline (§1.2 pillar 3): designed but **not authored as full areas in v1.** Per the
world-expansion cut-set, beyond the three starters a sane buildable set is **~6–8 nodes** that reuse the
existing cast and pay off the spine directly.

| Node | Tier | Kind / role |
|---|---|---|
| **Kuzuhara — re-foundable upstream hamlet & embankment river-works** | T3 | **Spine.** The faction-3 fusion: the drowned hamlet — the house's own **root-sin** (ancestor Sadamune's neglected flood-works) — becomes a resettlement node + the embankment (*seki*) river-works that secures the disaster. Access-only, grind-built; the player **names the drowned** and re-founds the hamlet. **No personal tie to the MC** — his origin/backstory and the lost-child evidence resolve via the **dream → the Sawatari-juku family** (§5 T2.2/T2.5), not here. |
| **Sawatari-juku & the wider post-town region** | T3 | **Mixed.** The origin reunion hub (optional — **Tahei's living family**) + the *toiya* transport office / waystation trade layer (the practical surplus-export runway to T3). |
| **Yanagi-watari — down-valley river-crossing market town** | T3 | **Spine (personal-mystery).** A second post-region locale a day **down**-valley (distinct from Sawatari-juku, which is up the *kaidō*) — a busy river-crossing market where a runaway child could vanish into the crowd. **Where the grown Otsuru (the real Tama) is found** — the **G6 lost-child TRUTH** locale, deliberately **separated from the origin-reunion hub** so the two T3 personal threads don't both land in Sawatari-juku. |
| **The Kaidō Porters' & Transport Guild** | T3→T5 | **Spine-thin.** Routes, *sekisho* pass-tiers, route-risk — the trade backbone. Met via friend Kenta's first favour run. *(The **v1 stub ending is NOT** this node — see the Daikan's Office row below.)* |
| **The Rice & Silver finance network** | T3→T5 | **Spine-thin.** The conversion engine: village broker → regional warehouse → *Marutaya* debt-restructuring → *goyōkin* → Osaka/Edo *fudasashi*. |
| **The Neighbouring Valleys** | T3 | Side. **Hard-capped at exactly two named valleys (Hibara + Tōge-mura)** — Asagiri fractally replicated, slimmer. Courting them is an optional accelerant. |
| **The High Mountains & The Pass** | T3–T4 | Shared wilderness, top of the conditioning gradient. The lethal terrain of the pass; the "one-eyed mountain god" (a misread scarred *rōnin* + fog-blind terrain). |
| **The Daikan's Office (castle-town officialdom)** | T4 | **Spine-critical** for formal T4 recognition **and the v1 STUB ENDING**: v1 (which *completes* at Region/T3) **closes on the castle-town / Daikan's-Office first-contact cliff-hanger** — the **T4 stub, beyond v1**. The racket's nerve-centre; where most T4 Influence is minted. No folklore here — the rational, ledgered counter-world. |
| **The *domain's* Edo *yashiki* / *rusui-yaku* + *sankin-kōtai* conduit (one cluster)** | T5 | **Spine.** The mediated capital conduit — the house **staffs & runs the domain's establishment** (rusui **Mukai**) under the **daimyō's** biennial *sankin-kōtai* (never its own) — with the **Nihonbashi/*banzuke*** payoff and the **touring-inspector set-piece** folded in as its two payoff beats. |

> **Marriage / adoption-into-higher-status is a REAL late-game (T4/T5) lever.** Kept lean — a
> grounded alliance/status move (not a relationship or people-management sim) that lifts **Office**
> and **Name & Honour** and is one of the **multi-route castle-town takeover** paths. It threads through the
> T4/T5 nodes above (the *daikan*'s office, the Edo conduit) rather than being a node of its own; details at
> §3/§5.
>
> **Cut for now (reintroduce later, "start lean, add back"):** the Matagi hunters, the Pilgrimage Order, and
> the Scholars-&-Physicians as a *network* (keep Sōan / Obaa Kuni as the existing seed only). **Estate stages
> E4–E5** (fortified seat → restored-and-surpassed) stay parked — **E3 "Prosperous" is authored in v1**
> (§1.5.1).
>
> **Macro-tier spatiality: full walkable maps at EVERY tier, always** (T0–T3 built in v1; T4–T5 maps built
> later — **not** abstract-board-only by design).

## 1.8 Cast (by faction & area)

Most NPCs do **double duty** — a gatekeeper *and* a story thread in the same beat. The estate roster **grows
per tier**; the village (T2) and origin (T3) casts open with their tiers. Canon home + full entries:
[`04-cast.md`](../../story-bible/04-cast.md) + the per-tier sheets ([`tiers/`](../../story-bible/tiers/)).

| Group (bible home) | Key cast |
|---|---|
| **The house — T0–T1** ([`04-cast.md`](../../story-bible/04-cast.md)) | **Genemon** (steward; the spine's rank-gatekeeper) · **Kihei** (drillmaster/mentor) · **Sōan** (physician; the sickroom) · Dowager **Toku** (backstory keeper) · Lord **Munemasa** (dying by inches; his one scene the T1 shoin, dies at the seam) · **Naoyuki** (second son, regent; reads him true, declines the chair) · **Shinnosuke** (the boy, the MC's mirror; lord by T6) · **Katsuhide** (the vanished elder son, a temple registrar; renounces in writing at T4) · **O-Hisa** (Katsuhide's wife) · **Rokusuke** (the hired hands' face) |
| **The estate's edge — T0** ([`04-cast.md`](../../story-bible/04-cast.md)) | **Yohei** (the pedlar — T0's whole coin economy; was "Tokubei") · **O-Yae** (the scullery day-girl; the estate/village news) · **Matsuzō** (the weir-keeper; the origin trail's first clue) · **Iori** (the traveling monk; New Year & Bon) · **O-Ume** (the widow — the jizō offerings are hers, revealed T3) |
| **The works & crews — T1** ([`04-cast.md`](../../story-bible/04-cast.md)) | **Denshichi** (crew boss) · **Heikichi** (master joiner; the shoin) · **Ribei** (the creditor's clerk — the debt's face) · **Tetsuji** (the smith) |
| **The village, Asagiri — T2** ([`tiers/t2.md`](../../story-bible/tiers/t2.md)) | **Mohei** (headman) · **Sayo** (his daughter, THE NAMER — the Tama thread's living heart) · **Ekai** (the parish archivist; amends the register of the vanished on screen) |
| **The origin — T3** ([`tiers/t3.md`](../../story-bible/tiers/t3.md)) | father **Jinpachi** · mother **O-Nobu** · sister **Suzu** · porter friend **Kenta** · toiya master **Zenbei** · **Otsuru** (the grown "Tama," found at Yanagi-watari — the G6 truth) |
| **The enemy — T4 Castle Town** ([`tiers/t4.md`](../../story-bible/tiers/t4.md)) | Lord **Tomita** — the martial castle-town lord, the campaign's face (no rival-house G5/G7 climax; **Akagi** is not in the bible) |

## 1.9 Side-threads — identity, origin & the dream rule

Two grounded side-threads run quietly beneath the spine; both pay off only in **feeling, allies, and flavour,
never power**, both resolve to human causes with no magic, and **both resolve at the Region tier (T3)** —
T4/T5 carry the house's power rise.

**(A) The Tama-vs-farmhand allegiance & the lost-child truth.** The valley grieves a child, **Tama**, taken
ten years ago; **Sayo**, the headman's daughter, misreads the half-drowned, memoryless stranger as Tama
returned. The estate flatly disbelieves it. This split powers the continuous **allegiance leaning** (§1.5.4): rates, flavour, and which quest-givers
open first — **never** stats, drops, production, or availability. "What happened to Tama?" is a **suggestion +
a story the player discovers in the world** (a sandal left yearly at the jizō-at-the-weir; a household that
flinches at her name; the legend "remembering" a boy; a debt-ledger mention; a post-town sighting). **The
truth:** Tama was a **girl** (the gender-drift is the fair clue) who **ran** from a violent stepfather and a
near-sale into service to clear a debt; she has been alive and grown the whole decade **down-valley in
Yanagi-watari** (a river-crossing market town a day the *other* way from the origin hub Sawatari-juku — the two
T3 personal threads sit in **separate locales** by design), living as **Otsuru**, too
ashamed to return — a quiet **"presumed dead → back from the dead"** that mirrors the protagonist's own. Resolution is grounded and **partial** (she may not forgive). The MC is **not** her. **This
Otsuru/Tama TRUTH is spine-guaranteed at G6 for every player** — independent of the optional Origin
track.

**(B) The grounded true-origin thread.** His real past is mundane: his true name is **Tahei**, a young porter
for a small transport house in **Sawatari-juku**, with **living** family and friends there — father
**Jinpachi**, mother **O-Nobu**, sister **Suzu**, toiya master **Zenbei**, friend **Kenta**. Unlike the valley,
the family **refused to grieve him as dead** — they keep his register entry **open by refusal**, no flight, no
guilt, no grave; so the reunion is a **homecoming**, not a return-from-the-dead. **The origin story (no
magic):** he left on a mundane run escorting a goods consignment over the pass; a **sudden landslide — a
rain-loosened slope giving way above the road** — pitched him down the cut into the swollen river below; he was
struck, half-drowned, swept downriver, and snagged at the weir below the estate. His amnesia is ordinary **head
trauma + near-drowning + exposure** — no magic (the founding debt and the Kuzuhara root-sin carry the single
embankment-flood; the MC's own accident is a **landslide**, so the water-disaster motif is never repeated). As
memory returns he re-engages them; seeing what he is rebuilding, they back him with **pride, allies, resources,
and trade ties**. **Remembering itself grants ZERO** (the backstory reveal confers no
stat/recipe/tool/combat bonus); the **morale buff** and **trade-tie ~10–15% speedup** are legitimate
**present-day-relationship** mechanics that **stay** (§1.5.3/§1.5.4). Reclaiming his **name "Tahei" is the
Origin O5 capstone — earned and *missable*** (a player who skips the Origin track may never reclaim it),
distinct from the spine-guaranteed G6 Otsuru truth. **The origin thread RESOLVES at the Region tier (T3)**;
the T5 epilogue carries only an **optional emotional callback** (the recovered family proud behind him —
§1.11), never a second mechanical payoff.

**The dream rule (enforced in writing *and* code):** returning autobiographical **memory only** — never
clairvoyance, **ZERO mechanical bonus**. **Memory-only** (only things he lived; the "voice in the water" is a
real person recalled, not a spirit). **Zero mechanical bonus** (memory grants access, not power). **Guaranteed
cadence** (bible law, [`01-laws.md` §0.5](../../story-bible/01-laws.md)): the **first dream is T0-R7**; from
**T1 on** a fragment rides **every second sleep-ending promotion**, escalating and **never verbatim** — plus a
dream/mystery beat at each tier transition (**T0→T1 lands BIG**, alongside the first ascension), with the
**full origin payoff held at the Region tier (T3)**, the Otsuru/Tama truth; at least one origin beat is always
available without reputation-gating, so the thread never goes cold. All variance flows through the one seeded
RNG; cadence is headlessly regression-testable.

**The ink thread (two registers, one man).** The spine in objects runs across two registers: the use-name
**Gonbei** written in the day-book (T0) → the Kurosawa house register, **Munemasa's** last entry (T1) → the
birth name **Tahei** known and the origin register confirmed-not-struck (T3) → what the Kurosawa register
finally says is **his choice** at the end. Two registers, one thread
([`03-tiers.md` "The ink thread"](../../story-bible/03-tiers.md)).

### Per-tier side-quest list

| Tier | Side-quests (open-ended; never gate the spine) |
|---|---|
| **T0** (the household) | The porter's-knot beat ("you've hauled before"); the first dream fragment (T0-R7); Dowager **Toku**'s first memory of the fall; **O-Ume**'s Bon grief at the paddy's edge (the jizō offerings, revealed T3). **Shipped v0.4.0:** *Walk the first night round* · *Take back the orchard* · *Drive the troop from the rows* · *Keep the leased screens whole* · *Dig out the field-margin setts*. |
| **T1** (the land) | The **T0→T1 ascension** dream beat (BIG — the silhouettes stir); the cadence deepens (a fragment every second promotion); the first paid retinue settles; the shoin restoration with **Heikichi** → Lord **Munemasa**'s last entry, his death at the seam. |
| **T2** (the Valley) | THE REVEAL (three signals; the map re-labels itself — guest house → the true main house); **Sayo**'s Tama misreading ignites and is worked; the bandit camp answered as a campaign; a per-family goodwill help; **Ekai**'s register of the vanished. |
| **T3** (the Region) | The Tama truth resolves — **Otsuru** found grown at Yanagi-watari (**spine-guaranteed at G6**); the origin reunions (**Jinpachi, O-Nobu, Suzu, Kenta, Zenbei**); the **Origin O5 name-reclaim ("Tahei")** the optional, missable capstone; the sealed storerooms (the buried truth); Kuzuhara re-founded + the drowned named. |
| **T4+ (parked)** | The campaign against Lord **Tomita** and the taking of the castle town; **Katsuhide** found and renouncing in writing; **Shinnosuke** named heir; **Naoyuki** declines the cleared chair; the succession secured. |

## 1.10 Folklore & quest-design philosophy

**Folklore is light flavour, not the spine.** The campaign is **NOT** built around named yokai; folklore
arrives occasionally as small optional tidbits, concentrated in the village inn's **rumours board** and
**unlocked organically** (conditions per tier; more unlock as the estate and village grow — never an
all-at-once dump). Each rumour is a lightweight yokai story the player **may** go investigate open-endedly.

**Hard rules:** every rumour-quest is **optional** and **none** gate tier progression. Every folk belief is
introduced as genuine, respected village dread first, investigated through ordinary work, and resolved
one-to-one to a concrete human/natural cause — but the game **lingers in the unease before resolving**, and
debunks with **dawning dread, never a Scooby-Doo unmasking.** The master belief, *kamikakushi*, is itself a
comforting lie covering a **mundane** truth — sometimes dark (people who fled debt/violence, or died on a
lethal road), sometimes **nobody's sin and even warm** (a child who simply ran, found grown; a family that
refused to grieve) — including the protagonist's own: a landslide that swept him into the river, not a flood.
Handled as grief-coping, not superstition to mock.

**Residual ambiguity is hard-capped at ≤1** unresolved, off-screen, mundane-readable beat (the unidentified-
hand offering at the **jizō at the weir** where he was found — the single co-located find-spot). Folk-religion
texture distinguishes **Shinto** (shrine, *shimenawa*, boundary/mountain kami, the soul-calling rite) from
**Buddhist** elements (roadside/boundary *jizō* as guardians of children and travellers, Bon offerings, the
temple register of the vanished that becomes hard evidence). **No rite ever mechanically "works"; nothing is
confirmed supernatural; there is never player magic.**

**Quest design — open-ended, not hand-holdy.** A quest is a **suggestion + a story you go find out in the
world**, never an A→B→C waypoint checklist. There are **fewer checklists overall**; the dominant
minute-to-minute behaviour is the **incremental grind — the hero getting better at what he does.**

**Quest types — no fixed budget.** **PEST CONTROL**, **HUNT**, **CLEAR**,
and **DEFEND** (the deeds-earner) are the **T0 starter set** (combat- and labour-spanning, all open-ended), but
there is **no quest-type budget** — author **whatever quest types fit each stage**, and **more and
more-interesting quests are welcome, especially at later tiers** (escort/patrol/bounty/duel/investigate/etc. all
welcome).

## 1.11 Antagonists & endgame

**The trouble escalates by tier** across the seven-tier climb (household → land → valley → region → castle
town → domain → Edo), grounded (no magic; "yokai" are misread humans/animals), each **revealed incrementally**
rather than unmasked. The **standing antagonist is the DEBT** (T0–T1, and again as the broken domain at scale,
T5); each tier's trouble is otherwise **self-contained and human-scale** (a bandit camp, an enemy lord). The
**reachable culprits answer; the truly powerful stay out of reach** — **partial justice by design**, made
structural by the honest **ceiling** (the daimyō and shogun are **never scenes**, kernel #5). **T0 estate
decline is a simple debt/misfortune, NOT conspiracy-linked** — an antagonist with no villain. **v1's ending
beat is explicit:** v1 **closes on the castle-town first-contact cliff-hanger** (the **T4 stub**); the full
T4–T6 endgame below is the **roadmap vision**, not a v1-shippable tier.

| Tier | Antagonist | What they block | Reveal | Resolution |
|---|---|---|---|---|
| **T0 — Estate (household)** | **The Inherited Debt** — *a circumstance, not a conspirator.* | The estate is dying of compound interest from grandfather **Sadamune's** failed embankment-venture, plus thin harvests and a cracked kura. Can't leave until the immediate fires are out. | A red ledger; **Genemon**'s day-book drips "we owe coin" → "the interest is the problem" → Dowager **Toku**'s memory that the root is Sadamune's own failure, **not anyone's crime.** | Purely economic — out-grind the interest and force a fair table by proving solvency (no fight). Restructured, not erased; the house's **root-sin** it atones for at Kuzuhara — emotional payload, **no villain.** |
| **T1 — Estate (the land)** | **The Inherited Debt, still** — the same circumstance, deeper in; *no human antagonist.* | The land gate won't open until the *kura* is genuinely solvent and the Arms pillar is earned; the debt's drag (not a person) is the wall. | No new face — the red ledger blackens as Phase-2 deeds bank; **Ribei** the creditor's clerk is its polite face on interest days. Lord **Munemasa** dies at the seam. | **Economic, continued** — out-grind and renegotiate to a stable house; the **root-sin** is still atoned for later at Kuzuhara. **No villain.** |
| **T2 — the Valley** | **The bandit camp** — the valley's trouble, and the first *men* the MC ever fights. | The valley won't be anchored while the roads and the works are unsafe; the camp is the estate's and the village's **shared** trouble. | Rumor at the well → raids on the works → the **R5 crossing** (the outside forcing itself in — docket #3) → the camp answered as a **CAMPAIGN**. | Grounded and human-scale — the camp is broken/dispersed; a famine-band can be **fed/resettled**. No conspiracy. |
| **T3 — the Region** | *No rival-house climax* — the region's dangerous roads and the estate's **buried truth** (the sealed storerooms). | Leading the region means the roads made safe and the origin/Tama threads faced; the ruin's inner domain within reach. | The origin trail (Matsuzō's unmade clue) and the ruin's inner domain open; the **Tama truth resolves — Otsuru found grown at Yanagi-watari**. | Grounded and **partial** (Otsuru may not forgive). **The personal-mystery payoff lands here** — spine-guaranteed at G6. |
| **T4 — the Castle Town** *(stub / cliff-hanger; beyond v1)* | **Lord Tomita** — the martial castle-town lord, the tier with a FACE for an enemy (his hands in both old wounds). | Taking the castle town means beating the enemy lord; all T4 standing is contested through the campaign. | The enemy behind the old arrears → the campaign → **Katsuhide** found (renouncing in writing), **Shinnosuke** named heir. *(v1 reaches only the **first-contact** beat — the stub cliff-hanger.)* | The campaign ends with the house **TAKING the castle town** — "take over" = dominant house, **never open rebellion against the bakufu.** |
| **T5 — the Domain** *(roadmap)* | **The inherited domain-ruin** — the DEBT AT SCALE (a broken *han*, not a villain). | Caretaker administration of a broken domain; the rung-up **inverts** (the domain summoned to HIM, each rung an audience-day). | **Genemon**'s failing, the handover, the chair; the debt writ large across a whole domain. | Economic-at-scale — the domain stabilised; ends at **THE STEWARD**. **No villain.** |
| **T6 — Edo** *(roadmap; reserved)* | *No antagonist — the honest ceiling.* | Final recognition is **mediated**; the daimyō and shogun are **never scenes** (kernel #5). | The house is called to the domain's Edo establishment under the daimyō's *sankin-kōtai* (never its own). | The house restored **and** ranked at the capital, **the man never received** — bittersweet, mediated. Reserved. |

**The through-line (grounded, not a conspiracy).** There is **no cross-tier racket**. The connective thread is
the **DEBT and its root-sin** — grandfather **Sadamune's** failed embankment-works (the Kuzuhara drowning) —
carried from T0's red ledger to the T5 domain-ruin at scale, and atoned for at Kuzuhara. Each tier's trouble is
**self-contained** (a debt, a bandit camp, an enemy lord); the capital's powers stay **out of reach** (kernel
#5), so justice is **partial by design** — the reachable answer, the powerful walk. **No tier requires touching
any of it to advance** — tier progress is always achievable by economic/social means alone.

**The power-focused late game & the national *banzuke*.** The endgame story centres on the house's **POWER**
(office / debt-rescue / takeover / ranking) — **trade is OUT of the finale spine** (a supporting thread only).
The **T4 castle town** is a multi-route "become the leading house" conquest (offices held in the house's name,
the enemy lord **Tomita**'s town taken, the daimyō's confidence won — **never open rebellion**). The late-game
**anti-slump / variety** leans on **cross-pillar combos + seasonal-reward rotation**, with trade
held out of the finale spine. The **T6 Edo climax** is a **national multi-pillar *banzuke* ranking of the HOUSE** on
all four pillars (rank the house, the honest ceiling kept), on which the Kurosawa climb from unranked
toward the top, with the highest slots **structurally sealed** — the wall the truly powerful built, made the
chart's literal geometry. Per-tier rank ladders also rank the house at each tier (a domain *banzuke* precedes
the national one). *(Presented as a **popular *mitate*/parody broadsheet** rather than an
official register, with **sumo-rank vocabulary** — Maegashira/Komusubi for the house's attainable band,
Ōzeki/Yokozuna for the sealed top.)*

**The *banzuke* overtake is computed, not scripted.** A few **unnamed domain houses** fill the chart, each
carrying **LIGHT stats** (a small per-pillar standing/rank value, cross-ref **§2.18**), so the house's rise
past them is a **real chart-position overtake** the player's four-pillar climb computes, **not** a
hand-scripted cutscene. There is **no rival-house G5/G7 dethroning climax** (old canon); the enemy with a face
is **Lord Tomita** at T4, resolved by the campaign, not by a *banzuke* line. This is **NOT a full house-sim** —
just enough stored standing for the per-tier *banzuke* to read the Kurosawa rising.

**One ending + post-game.** There is **one authored ending** (the house restored & ranked) + **post-game
free-play (no reset)**; branches are in *how* you got there (allegiance / takeover route), not separate endings.
**The honest ceiling is preserved by ranking the HOUSE, not the man:** the protagonist does **not** become a
*hatamoto* or get received by the shogun; recognition arrives **indirect and mediated** (down through the
domain's rusui and the lord — **Shinnosuke** by the endgame). His personal ceiling stays **chief steward /
*yōnin* — the lord's right hand** (*karō* stays aspirational narration only); the house's *banzuke* rank keeps
climbing post-cap (decoupling personal vs house ascension). The post-game long-tail is escalation/mastery over
what's already built (defend the top *banzuke* spot on the biennial *sankin-kōtai* heartbeat, recoverable and
never a decay-tax; optional grounded super-bosses; per-pillar mastery goals; the estate-as-sandbox teaching
layer re-homed onto recruited hands and origin friends).

**Succession.** A generational beat: Lord **Munemasa** dies at the T1 seam → the **lordless years** under
**Naoyuki**'s regency (T2) → **Shinnosuke** named heir (T4) and **lord by T6**, formed at the last by the man
who rebuilt the house; **Naoyuki declines the cleared chair** — "never lord" his own proud choice. The house's
future is secured across a generation. The epilogue is a tableau of everything built:
the restored-and-surpassed house seal, the reclaimed fields, the resettled Kuzuhara, the named drowned, the
freed and self-determining Otsuru, the recovered family proud behind him, and — **if the player walked the
Origin track to O5** — a reclaimed **true name (Tahei)**; the name-reclaim is **conditional** (missable — the
epilogue reflects whether it was earned), while the rest of the tableau and the Otsuru truth are
spine-guaranteed. A life built by hand.

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
silent menu growth. **Reveals are design-staggered one-at-a-time** — the unlock schedule is *authored* so beats
arrive singly (there is **no runtime reveal-queue**) — and obey a general **NO-UI-DUMPS** principle.
The UI resolves to the **seven-tab IA** (Work · Map · Estate · Inventory · Character · Combat · Quests —
**ADR-119**, reinstating ADR-037 over ADR-112's six-tab lock: Quests regains its own top-level tab, crafting stays
a section), each tab revealed only as it unlocks; the home of each capability within those tabs is
`ui-design.md`'s domain. Reveals follow the **per-tier R0–R7 ladders** (each tier its own R0→R7 arc — docket
#1, see §1.5.1), each running the **sequential Phase-1 (climb the rungs) → Phase-2 (estate
pillar-grind)** model (§1.6.4). **Combat surfaces inside the FIRST tier (T0)** as an **incremental ladder**
(the combat-reveal ladder, below), not a single mid-ladder dump.

**T0 — Estate ladder reveals (sequential phasing):**

- **R0** — body/rest bar + rice counter.
- **R1** — labour loop + paddies + **rice + a little coin** (rice you eat / store / sell for coin).
- **R2** — Skills tab + foraging/woodcutting + the woodlot's forage grounds.
- **R3** — **drill yard + Combat panel + the carrying-pole + Equipment/Inventory + Bestiary + the bare auto-resolve loop + retreat** (after the humbling first fight; **character (combat) level begins**, fed by combat-XP).
- **R4** — main-house interior + the household domestic economy; first *shinden* begun; **the simple Crafting loop as a top-level tab + graded durability bands** (never auto-unequip).
- **R5** — **stance slot** + the **Quests top-level tab** (pest-control/hunt/clear/defend). *(Curated combat activities feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — gated to Phase 2.)*
- **R6** — workshops + granary + proto-industry levers; **the first errands past the estate gate** (the valley comes into view).
- **R7 (capstone)** — **OPENS Phase 2**: the four-pillar **estate-influence grind**; the standing panel made visible (the **revealed** pillar — **Estate** only at T0; Arms reveals at T1); cash-crop levers; the tier-expansion map. Clearing T0's **single-EXCELLENT Estate gate** (§1.6.3) is what **tiers up to T1.**

**Combat-reveal ladder (incremental; one reveal per beat):** **R3** the carrying-pole + bare
auto-resolve + retreat + Bestiary → **R4** graded **durability** bands → **R5** **stance** slot → **first
weapon-L10 milestone** the **ability + item** slots → **T1** the **2nd combat line**, **T2** the **3rd line.**
The **weapon roster grows incrementally** alongside: **T0 +2 / T1 +3 / T2 +4** (~9–10 across v1, each an
archetype + signature ability; **T3 Region adds no new line, only depth**). Detail at §2.8/§4.

**T1 — the estate's land at FULL depth (its own R0→R7 arc; built game trails on `R8→R15`):** the same domain, deeper — the ≥30-min-per-rung
grind first bites, the **Arms pillar reveals** and banks its first deeds, the **coin/rice flywheel** branches
(LAND/TREASURY/TRADE, trade ≤⅓), the first paid retinue is won. New verbs, no new domain (per-rung detail
in §3).

**T2 — the Valley (the estate's domain expands beyond its gate; its own R0→R7 arc; built game trails on V0→V7):** the tier opens minimal (one
contact, one shop) and progressively reveals — as the *house's* reach grows — **the guest-house/ruin reveal**
(three signals; the map re-labels itself — the structural **mid-game reveal**, docket #6/**ADR-157**); the
market/shop row → chief's house → road-security & valley-scale combat → the silk/sericulture *meibutsu*
sub-engine → first Office standing → the **region** map and the T2→T3 quest. The **village reputation web** (shop meters, the inn & rumours board)
fans out **alongside** as a parallel **optional** side-track, never a gate (§1.5.4, §2.15). **T3 mints another
R0→R7 arc** the same way (the domain expands again, to region scale; the personal-mystery payoff lands across
it). Each tier is the same **Phase-1-then-Phase-2** motion repeating, never an eight-rung-and-done staircase.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal **judged** Influence results — fired on a
**new high-water mark**, never a repeatable per-season maintenance trickle, per §1.6.2). To give the
"leave it running, check the progress" feel within active-only, **tab-open AUTO-RESOLVE + AUTO-REPEAT** keep a
loop ticking while you watch; **auto-producers stay late-game (T4+)** — early game is the MC's own active
grind (combat, skills, jobs, crafting; **no assignment/management panel and no labour-gang to manage**, ever).
The time/budget model is a **FLOOR, not a ceiling**: the **~28.5 h budget is a minimum** — a longer
**OSRS-rough grind** with enough grinding content, **interleaved, never brick-walled** (§4.8 is a
*minimum-grind* model). Everything is data-driven (areas/panels/resources as registries with unlock predicates
over GameState), deterministic under the one seeded RNG, with balance/unlock tables generated into `docs/` and
headlessly regression-testable via the DEV play API. The estate, village, and origin tracks differ in **shape**
to keep pacing varied (estate steep-geometric per-tier ladders; village gentle per-node meters; origin a short
reputation side-track), and the **per-rung-reset rung-meter** is the numeric per-rung curve that
drives the Phase-1 reveals. The side factions act as Influence **multipliers** (shave **~10–15%** off
time-to-tier — felt, never a wall). The presentation register throughout is **text + emoji + CSS art**
(the Andon Steel bimetal palette, ADR-127; kanji season tags; colour-coded rarities), with **load-bearing
period motifs as inline SVG** and **functional text on the AA-passing ink ramp** (§6).

## 1.13 Risks & guardrails

Guardrails that hold through §§2–7:

- **No belief-creatures in grindable spawn tables.** Grindable mobs are honestly-mundane (boars, monkeys,
  hornets, wolves/bear, bandits/deserters — **~5 in v1**). Any "yokai" (kappa, fox-fire fox/tanuki,
  yamanba/tengu, the one-eyed mountain god) is an **INVESTIGATE-then-confront one-shot** resolving to a
  human/animal, never a respawn population.
- **Residual ambiguity ≤1.** Exactly one unresolved, off-screen, mundane-readable token, kept at
  the **jizō at the weir** (the single co-located find-spot where he was found). No new ambiguity beats.
  Provide a region-wide belief→cause table before authoring any node with new omens.
- **No permanent holding-loss ("never a wipe").** A failed defence **dents/disables** a holding *temporarily*
  (recoverable by rebuild); Influence can stall or take small per-pillar dents but is **never wiped**.
- **The budget is a FLOOR, not a ceiling.** A longer **OSRS-rough grind** with enough grinding content; the
  game may be **longer** than ~28.5 h, never shorter at the gates — **interleave, never brick-wall**; "leave it
  auto-running, check the progress" (active-only + tab-open **auto-resolve / auto-repeat**). The §4.8
  pacing tables are a **minimum-grind** model; the pacing check fails on **undershoot only**, never overshoot.
- **Bounded labour→combat perks (not a hard wall).** Each labour skill grants **~2–8 small, stackable combat
  perks / flat bonuses** (unlocked by levelling it; **no hard global cap**; small magnitudes), via a separate
  `skillCombatBonus` channel — labour skills make you **more capable**, but **big combat power stays
  combat-only.** **Conditioning stays the zero-stat enablement gate** (the perks must never become a back-door
  past the weak→capable gate; they are orthogonal). The no-edge line is **gift-vs-work**, not labour-vs-combat.
- **Combat is incremental + never weaponless.** T0 starts with the **carrying-pole**; a **growing roster**
  unlocks rung-to-rung (+2 T0 / +3 T1 / +4 T2; ~9–10 across v1, at least one craftable). **Graded durability
  bands** degrade a weapon's attackPower but **NEVER auto-unequip** — a weapon stays functional even at 0
  wear-band (auto-battler; never weaponless).
- **Fictionalise real names.** Keep the world generic-rural — no real place/daimyō/house names. **Allow-list:
  Nihonbashi** (the *banzuke* payoff). A **§6.6 real-name denylist lint** prevents real names slipping in.
  Macron romanization (proper Hepburn) is project-wide.
- **Hard-cap martial scale.** A **small named retinue** + temporary corvée/levies for crises, **never a
  standing army**; "de-facto security" = the house the daimyō *deputises* (sanctioned, revocable). Combat stays
  **labour-plurality** (peaceful labour the dominant daily texture; combat the strong mid-game-onward
  second pillar).
- **Combat-track lexicon.** The Arms rank-gate is **"Combat Rank"** — so **"Standing"** means the
  **官威 Office** pillar **only**. The three combat tracks stay
  lexically and mechanically distinct: **character (combat) level** (kills/XP) · the **Arms pillar** (deeds) ·
  the **Combat Rank rung-meter** (curated rung activities; §1.6.4). Macronize *gōshi* and *rōnin* forms
  project-wide.
- **Office pillar kanji = 官威 (*kan'i*)**, "authority of office". The top-rung title is
  **chief steward / *yōnin*** ("the lord's right hand"); grand *karō*/adoption vocabulary stays
  **aspirational narration only** for a modest *gōshi* house.
- ***Meibutsu* product = silk / sericulture.** Author the T4/T5
  trade/prestige payload directly against silk (the village weaver leads the sub-engine; it stays under the trade
  ≤⅓ cap).
- **Estate-restoration must not drift into city-builder/4X tedium** — Influence stays diegetic and
  story-framed; the cozy daily-labour texture and grounded character story remain the core.

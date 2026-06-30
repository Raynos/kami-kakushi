# §1 — Vision, Pillars, Factions, World & Endgame

> **PRD V2.3 — locked intent (D-021); reshaped per the V2 decisions (D-022 governing).** This section is authored
> end-to-end from the PATCHED locked-decisions canon
> ([`locked-decisions.md`](../../../project/brainstorms/2026-06-25-locked-decisions.md), incl. its
> 2026-06-25 Round-A deltas), the three redesign discovery docs, **and the 79 human-signed V2 decisions** (Block L
> `Q1–Q56` + Block M `FU1–FU23`). It supersedes every earlier framing of §1 (most-recent-wins per D-022).
> **Reshaped to the 6-tier spine (D-048): the old single Estate tier SPLITS into a T0 tutorial + a T1 full
> estate, and every later tier shifts up one.** Tiers are **T0–T5** (0-indexed) throughout; v1 scope is
> **T0–T3 complete** (T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region — v1 ends at Region,
> `outcome: t3done`), with **T4 a stub cliff-hanger** (the **castle-town / Daikan's-Office first-contact** beat
> — Q24) and **T5 a roadmap**. **Per D-059 the PRD stays LIQUID — the §1 freeze is NOT taken; the §4 numbers
> and §7 milestone detail remain provisional, revised by playtest.** The V2 spine locks these shapes:
> progression is **SEQUENTIAL per tier** — climb the rungs (**Phase 1**), THEN grind the estate's pillars
> (**Phase 2**), THEN tier-up (§1.6.4); the tier-gate is a **HYBRID good/great/excellent** pillar profile (good in
> all revealed pillars · great in 2–3 · excellent in 1–2 — the old "simple per-tier thresholds" are superseded,
> Q7/FU10); combat is **THREE clean tracks** (character level · the Arms pillar · the Combat Rank rung-meter —
> §1.6.4) and **INCREMENTAL** (T0 starts with **one weapon**, a growing roster — Q15/FU13); the **~28.5 h budget is
> a FLOOR**, a long OSRS-rough grind you "leave auto-running" (FU18/FU23); and **reveals are design-staggered
> one-at-a-time** (no runtime reveal-queue — FU4). Round-A locks still apply as settled: *meibutsu* = **silk /
> sericulture**; **full maps at every tier**; origin **father Jinpachi** re-added; **marriage/adoption** restored
> as a real late-game lever; **combat surfaced from T0.**

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

As you rise, the world you can reach grows with you: first the **estate**, then the valley **village of
Asagiri**, then the **region**, then the domain's **castle-town**, and finally **indirect, mediated
recognition at Edo** — until the Kurosawa name stands **restored *and* surpassed** beyond anything it held
three generations ago. The estate-rise *is* the perseverance fantasy at grand scale, and it is the same
motion as the game's **signature feature: the UI itself unlocks as you progress** — minute one is one verb
and a persistent event log; every panel, tab, resource, skill, and area thereafter fades in **one at a time
by design** (the unlock schedule is *authored* so reveals never arrive in a batch — FU4), each reveal a story
beat, never silent menu growth.

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
   across **six influence tiers** (T0 estate-*tutorial* → T1 estate-*full* → T2 village → T3 region →
   T4 castle-town → T5 Edo; the Estate split per D-048). Rising
   through the ranks and restoring-then-surpassing the house **are** the main quest. There is **no reset of
   any kind**: tiers *replace* prestige; everything persists as the canvas grows.

2. **Fractal incrementality.** Every new zone, area, faction, skill, and rumour is **itself incremental**:
   you arrive minimal (one contact, one place, one verb), slowly learn its people and systems, and never
   get overloaded — **everything unlocks.** The whole-game UI-reveal motion repeats in miniature at every
   frontier. Concretely: a drill yard reveals one post, then a rack, then sparring slots; a new region is
   one road, one threat, one contact. **Reveals are design-staggered one-at-a-time** — the unlock schedule is
   *authored* so beats arrive singly (there is **no runtime reveal-queue**; FU4) — and obey a general
   **NO-UI-DUMPS** principle (stagger everything, slowly and gently; Q17). Distinct activities (e.g.
   **Crafting**, **Quests**) surface as their **own top-level nav tabs**, not nested panels (Q10), so the main
   screen stays the active labour/deeds/combat loop.

3. **Lean and high-impact — no fluff, no half-built features.** Grinding/slow growth is the core, not
   filler. **"Lean" is about FEATURES, not the grind**: no fluff, no half-built systems, and when scope
   balloons, **split into "immediate" vs a parked "later"** bucket (e.g. §1.7 → §1.7 + §1.7.1) — *park,
   don't delete.* The **grind itself is deliberately generous and long** — an OSRS-rough **minimum** (the
   budget is a floor, not a ceiling; FU18). v1's *scope* stays focused: **T0–T3 complete**, an **~8-rung
   early rank ladder**, **~5 mobs**, a **~6–8-node world cut-set** — but there is **no quest-type budget**
   (Q23 supersedes the old "lean ~4"): author whatever quest types fit each stage, more and more-interesting
   quests welcome, especially at later tiers. (This honours the standing "start lean, add pieces back
   deliberately; don't over-build" preference — applied to **features**, not to grinding content.)

4. **Combat is a first-class core pillar, alongside labour.** Combat uses an **idle auto-resolve + active
   setup** model (prepare gear/stance/area; a deterministic seeded fight resolves; you intervene with
   stance/ability/item/retreat — low-APM, strategic). It is **INCREMENTAL** like everything else: T0 starts
   with **exactly one weapon**, and a **growing roster** (T0 +2 / T1 +3 / T2 +4 — **~9–10 across v1**, each an
   archetype + a signature ability) unlocks rung-to-rung along a **combat-reveal ladder** (§1.5.1, §2.8/§4) —
   so combat is no longer "fully surfaced at T0" but an **incremental progression surface**. It feeds **THREE
   clean, separately-stored tracks** (never one fused bar — §1.6.4): **kills/combat-XP → character (combat)
   level** (which scales HP, attribute points, and satietyMax); **recognised martial DEEDS → the Arms pillar**
   (House Influence — clear bandits, secure roads, defend the estate; gated to each tier's **Phase 2**); and
   **per-rung curated activities → the Combat Rank rung-meter** (the martial rung-gate). The mediocre-start
   contract holds on the combat track too: start weak, the first real fight is humbling/near-fatal (**measured
   at adequate satiety, ≥~0.7** — combat is satiety-throttled, "eat before you fight"; §1.4/§4), capacity is
   **enabled** by labour-built conditioning (a **zero-stat** weak→capable gate), and **trained labour skills
   each grant a few small, bounded combat perks** (~2–8 per skill, stackable, small magnitudes, no global cap
   — a *relaxation* of the old hard no-cross-feed wall: skills make you **more capable**, but big combat power
   stays combat-only; Q6/FU8). Combat is **surfaced from the first tier (T0)** — the drill yard, Combat panel,
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
   combat perks (Q6/FU8): the line is **gift-vs-work**, not labour-vs-combat. The talent-foils (Hanzaki, the
   rival heir, Rival House Tomita) are always **trained, lucky, or ruthless — made, not born.**

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
> lower-samurai (gōshi) house in a remote mountain valley, having been found half-drowned and pulled from
> the river out of plain kindness. The grieving village below is certain he is Tama, the child spirited away
> ten years ago; the estate flatly disbelieves it. Through daily toil, drills, and a refusal to quit, he
> rises through the estate's service ranks from "another mouth" to the lord's right hand and the architect of
> its revival, hauling the house from near-foreclosure up an outward climb of influence — valley, region,
> castle-town, and finally recognition at Edo — until the Kurosawa name is restored and surpassed.*

**Tone:** grounded, warm, bittersweet **Edo folk-mystery** wrapped around a cozy, satisfying **restoration
fantasy** (mid-Edo, stable and commercial, ~18th century, kept **fictional** — no real place or daimyō
names). The dominant texture is peaceful Edo labour (farm, forage, woodcut, fish, craft) over a *koku*/rice
base economy — numbers-go-up as honest sweat — with combat as a dangerous, earned second pillar. Beneath the
warmth runs a quiet grim undercurrent: a house broken by an ancestor's failed venture, a village grieving a
child it nearly sold, **a family a valley away who grieved the protagonist himself as dead** (his is a quiet
**"presumed-dead → back-from-the-dead"** return), official negligence dressed as fate. The darkest material is
handled with **off-screen restraint** and counter-weighted by found-family warmth. The catharsis is **never
power** — it is a nobody becoming someone real by his own hands, and lifting a dying house back into the
light. Justice, where the side-mysteries reach it, is **partial**: the reachable culprits answer, the truly
powerful largely escape — the same thesis made structural by the honest **ceiling** at Edo. Relationships are
**narrative-only** (no dating-sim).

## 1.4 The protagonist & the mediocre-start contract

The protagonist is an **authored, fixed male character** (~18–20) — there is **no name/appearance/gender
creator and no player rename**. He is the same person in every playthrough. The village calls him **"Tama"**
(the borrowed legend-name) for most of the game; his true name — **Tahei**, a plain commoner name — is
**reclaimed only by completing the Origin side-track (the O5 capstone): earned, late, de-emphasised, and
*missable*** — a player who never walks the Origin thread may finish the game without ever reclaiming it
(Q5/D-036). This is **distinct from** the lost-child **TRUTH** (that he is *not* Tama; the real Tama is
**Otsuru**, alive down-valley in **Yanagi-watari**), which is **spine-guaranteed at G6 for every player** (§1.5.3/§1.9).
Identity is explicitly a side thread, not the spine's climax. The **fixed male gender is load-bearing**: the
village's legend has drifted to "remember" the real lost child as a *boy*, when Tama was in fact a *girl*. The
village rationalises the mismatch with **concrete, in-world reasons, never magic**: **ten years have passed**
(a small child's face — and sex — blur across a decade of grief and retelling); the *kamikakushi* belief
itself holds that **the kami keeps and "changes" what it takes**, so a child returned *altered* is *expected*,
not suspect; and the handful who knew Tama were **themselves young then and remember only vaguely**, so a
grieving valley reads what it needs to read. The belief bends gender through that ordinary mechanism — which
keeps the man-as-returned-Tama **diegetically believable while the truth stays wholly human.** It is also the
game's **fairest clue**: a quietly re-readable tell — the *legend* insists on a *boy*, while the temple
register of the vanished and Sokichi's first-hand memory say *girl* — that only lands because the protagonist
is fixed-male.

**The mediocre-start contract (binding, enforced in writing *and* code).** He is **NOT a bedridden invalid**;
he can rest and recover a little in the first hours, but he **starts weak and slow** — unskilled, low-stat,
soft-handed, slower than the boy who shows him the paddy, blistering on the first hoe. His one genuine asset
is **temperament**: stubbornness, a strong back, a patient temper, a refusal to stop getting up. He grows
**only** through perseverance, repetition, rest, technique, and crafted tools. The answer to a wall is never a
magic item, only more reps and better tools. Combat capacity is **enabled** by labour-built **conditioning** —
a **zero-stat** weak→capable **enablement gate** (it unlocks the combat track; it grants no combat stat) —
while **trained labour skills each grant a few small, bounded combat perks** (~2–8 per skill, stackable, small
magnitudes, no global cap; Q6/FU8): more reps make you **more capable**, but big combat power stays
combat-only. Combat is also **satiety-throttled** ("eat before you fight"); the **humbling, near-fatal first
fight** is balanced **at adequate satiety (≥~0.7)** — its locked 20–35% win-rate is measured there (§4) — so an
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
  stat, recipe, tool, or combat bonus — but **trained labour skills DO** grant small, bounded combat perks
  (Q6/FU8). The distinction is **gift-vs-work**, not labour-vs-combat: nothing is *given* by birth or memory;
  everything is *earned* by reps.
- **The talent-foils are made, not born.** Hanzaki, the rival heir, and Rival House Tomita are always shown
  as trained, lucky, or ruthless — never innately gifted in a way the protagonist could not match by work.

## 1.5 Factions

Three starter factions span T0–T3, deliberately distinct in **shape** so they never read as one bar painted
three colours. They share an economy and the Tama-vs-farmhand allegiance, and the side factions **feed the
spine without ever gating it.** More factions/zones bloom per tier beyond the three starters (see §1.7.1 and
§1.11); each is itself incremental and side content never blocks the spine.

### 1.5.1 ESTATE — the Kurosawa *gōshi* household (MAIN — a fresh rank ladder PER TIER)

The **Kurosawa** hold a modest hill estate in **Asagiri valley** — proud, threadbare, working much of their
own land, quietly drowning in a ruinous debt inherited from grandfather **Sadamune's** failed flood-control
venture. This is the **only** faction structured as a discrete, gated **rank ladder**, because rising through
it *is* the perseverance fantasy and the dominant driver of the UI-reveal. **A fresh rank ladder is minted
per tier** (per-tier service/standing hierarchies, T0–T2 enumerated for v1); **rungs interleave LABOUR and
COMBAT throughout** — combat is a first-class core pillar **from the very first tier (T0)**, never a mid-ladder
reveal — and **combat earns its own rung-rank (the Combat Rank rung-meter) and Arms-pillar deeds** alongside
labour. The estate **cast and buildings GROW per tier** — the player builds structures and recruits a small
named retinue, framed as **flavour / light systems wired to the reveal bus, NOT a people-management sim** (no
labour-gang to assign, no managed sub-economy, no assignment/management panel; building and recruiting are
narration, never a minigame). The household flatly **disbelieves** the *kamikakushi* legend — to them he is a
reliable hand who became a fighting one.

**Each tier is climbed in TWO SEQUENTIAL PHASES** (the V2 progression spine, formalised at §1.6.4):

- **Phase 1 — climb the rungs.** Two **rung-meter** sub-tracks drive the ladder (rank-gating progress meters,
  **not** economy currencies): **Estate Service** (the **labour** rung-meter) gates the labour promotions, and
  **Combat Rank** (the **martial** rung-meter — *renamed from the old "Combat Standing"*, Q9) gates the martial
  ones. Each rung promotes on **BOTH** a **numeric rung-meter** — a real §4 curve, **per-rung-reset**, its
  threshold back-solved from the **≥30-min-per-rung floor** × that rung's eligible-activity rate — **AND** the
  rung's **story milestones** (an **AND-gate**: the UI reads "awaiting X" when one lags; Q30/FU6). The meter is
  fed by **curated, story-consistent per-rung activities** (a designed *one-to-many* set, **not** a single
  repeat-counter; FU7). Smaller responsibility/perk drips fill between gates so there is always a "next reveal"
  on either track.
- **Phase 2 — grind the house up.** **After the final rung** of the tier, the **estate-influence / four-pillar
  grind unlocks** (the capstone rung **OPENS** Phase 2; it does not merely confirm it). The tier's **pillar
  DEEDS accrue here and only here** — they do **not** accrue while climbing the rungs (FU7), which prevents the
  "half the rungs, maxed deeds" exploit. Clearing the tier's **hybrid good/great/excellent pillar profile**
  (§1.6.3/§1.6.4) is then what **tiers up** to the next canvas.

**Labour conditioning** stays the **zero-stat enablement gate** on the combat rungs (it *unlocks* them; it
grants **ZERO** combat stat) — orthogonal to, and never bypassed by, the small bounded per-skill combat perks
(Q6/FU8): conditioning is the **weak→capable** gate, the perks a *capable→a-bit-more-capable* polish. Combat is
available **early** (inside T0): the drill yard and humbling first fight open inside T0, so the player is
*fighting and crafting his own gear* long before any late-game helper appears.

Per the lean discipline, each per-tier ladder is **~8 rungs**. Grander martial titles are **aspirational
narration only**; default to humble household/*ashigaru*-tier titles. *(Patrol-leader / expedition / captain /
overseer narration and any longer braid are parked for T3+ — see §1.7.1 and §1.14.)* Combat grows
**incrementally** along these rungs: T0 **starts with exactly one weapon** and unlocks **+2 across the tier**
(the roster grows **+3 at T1, +4 at T2 — ~9–10 weapons across v1**, each an archetype + a signature ability;
Q15/FU13), surfaced one at a time on the **combat-reveal ladder** (below). *(The cadence is **canon, not a
lever** (§3): T1 (the full estate) opens the **2nd/sword** line, T2 (the Village) the **3rd/staff** line, and
**T3 Region adds no new line — only depth**.)*

**T0 — Estate ladder (~8 rungs; combat is live from the first tier).** Auto-producers do **not** appear on
this ladder — early game is the MC's own active grind (combat, skills, jobs, crafting); idle helpers are a
late-game convenience only (§1.12, canon §G).

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **R0 — Stray / "another mouth"** | labour | Found half-drowned and taken in; survive convalescence and the first labour. *(Met at the open.)* | The *kura* storehouse (one room, one verb); the body/rest bar and rice counter; the bare diegetic estate dashboard. |
| **R1 — Day-labourer (*hiyatoi*)** | labour | Chief Steward **Genemon** ("another mouth, soft and clumsy") assigns the first real work; complete it, earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the *koku* heartbeat); the basic labour loop. |
| **R2 — Bonded hand (*genin*)** | labour | Sustained, reliable labour across a season; Genemon grants a place on the household's books. | Foraging, woodcutting, hauling; the stables & woodlot edge; the porter's-knot beat surfaces; the **Skills tab**; the near-satoyama (conditioning-gated). |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | **combat (entry)** | A wolf at the grain store forces the **humbling, near-fatal first fight** early; **survive it**, then beg **Kihei** for drills. The deliberately-incompetent floor of the combat track — surfaced inside T0, not mid-ladder. | The drill yard; the **Combat panel** + idle-combat/training; the **single starter weapon** + **Equipment & Inventory**; the **Bestiary**; the **bare auto-resolve loop + retreat** (character (combat) **level** begins, fed by combat-XP). Combat stats start near-zero. |
| **R4 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger; help hold the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); the first *shinden* reclamation begun; the **simple Crafting tab + loot→craft loop** (Smith Gonta), surfaced as a **top-level nav tab** (Q10); **graded weapon-durability bands** surface with it (a weapon degrades but is **never auto-unequipped**; Q33/FU17). |
| **R5 — Gate-guard (*monban*)** | combat | Stand a real watch; clear the first pest/animal threats; weapon-skill milestones reached. (**Combat Rank** gate; conditioning floor at R3.) | Estate-defence duties; the **stance slot** unlocks; **PEST-CONTROL / HUNT / CLEAR / DEFEND** quest types, surfaced on a **top-level Quests nav tab** (Q10). *(Curated combat activities feed the **Combat Rank** rung-meter here; the **Arms PILLAR deeds** do **not** accrue yet — they are gated to **Phase 2**, post-R7; FU7.)* |
| **R6 — Foreman of works (*kogashira*)** | labour | Drive the *shinden* reclamation and the workshops to recorded yield; the house edging toward solvency. | The workshops and granary; the low palisade; proto-industry levers; **the first errands past the estate gate** (the valley comes into view; the **village tier proper opens after Phase 2 / tier-up**). |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** | labour→admin (as narration) | First reclamation recorded; the lord begins to notice; the MC takes on the home-fields *office* (his own quests/duties, not a management layer). | Field administration framed as the MC's own offices/quests; **the capstone OPENS Phase 2** — the four-pillar **estate-influence grind** — with **House Influence made visible** (the standing panel, showing the **revealed** pillar: at T0 that is **Estate** only — Arms reveals at T1; §1.6.4/§2.16(e)); cash-crop levers; the **tier-expansion map**. Clearing T0's **single-EXCELLENT Estate gate** (Estate only — Arms reveals at T1; §1.6.3) is what **tiers up to T1.** |

**T1 — Estate (full): the real grind begins (~8 new rungs `R8→R15`; a fresh ladder, not a continuation of T0).**
The same one estate at **full depth** — the deliberate **≥30-min-per-rung** climb first bites here (T0's
tutorial cadence ends; D-061). Standing climbs **tolerated → friendly**. The **Arms pillar reveals** and its
**deeds first bank** (in T1's Phase 2); the *koku* flywheel **branches into LAND / TREASURY / TRADE** (trade
**≤⅓**); the **first paid retinue** (Gohei & Yatarō) is won and the **E1→E2** estate stage lands. New verbs,
same familiar domain — and the **first ascension (T0→T1) lands BIG** (D-062). The rung-meters reset per rung;
the weapon roster grows **+3** and the **2nd archetype line — the sword** opens here (a Combat Rank rung-gate;
the blade is **pulled back to be a full-estate reveal**, §3). **New-T1 `R8→R15` is a forward sketch with
placeholder rung titles** in §3 (full rung-copy deferred to playtest); the **shape**
— a fresh ~8-rung full-estate ladder where the grind-floor first bites — is locked here (§1.6.3 T1; per-rung
detail at §3).

**T2 — The estate's domain expands into the valley (~8 rungs `V0→V7`; a fresh ladder, not a continuation of T1).**
The HOUSE's standing climbs **friendly → TRUSTED**, and its domain grows from bare *survival* to **anchoring its
valley**. Rank is still a rung **within the house's theme**; at every rung you act **FOR THE ESTATE** across the
village + estate + surrounding roads. Labour and combat keep interleaving, now reaching past the estate gate.
The rung-meters **reset per rung** afresh, T2 grows the weapon roster **+4** and opens the **3rd combat line**
(the staff/polearm, pulled forward from the old Region; on a **Combat Rank** rung-gate), and **T2's Arms-pillar
deeds accrue only in T2's Phase 2** (FU7).
*(The **village reputation web** — §1.5.2 — runs **alongside** this as a parallel **optional accelerant**, never
a gate; see §1.5.4.)*

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | labour | The house trusts him to carry its business past its own gate into Asagiri; first village errands. | The market/shop row; coin; the village reputation web seeds (optional). |
| **V1 — Recognised hand of the house** | mixed | The valley begins to know the house's man (headman + shops acknowledge him); combat keeps pace clearing valley pests/animals. | The chief's house; deeper satoyama rings; the inn & rumours board (side). |
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
house**, still interleaving labour and combat, with the **rival houses Tomita & Akagi** as the region's
incumbents to surpass (G7 = the rivals dethroned). T3 **adds no new weapon line — only depth** (the roster
completes at T2, §3), and **T3's Arms-pillar deeds accrue only in T3's Phase 2** (the revealed-pillar set
reaches **4**, + Name surfacing; FU7). The **personal-mystery payoff** (Kuzuhara on the spine; the origin reunions incl. father
**Jinpachi** + the lost-child truth on the **Origin one-tier rep side-track**, `O0→O5`) lands across it. Exact
rung copy is detailed at §3.6 (the unlock ladder); the **shape** — fresh ~8-rung ladder, combat woven
throughout — is locked here. T4/T5 ladders are **scoped forward** (T4 stub, T5 roadmap).

**Combat progression — incremental weapons + the reveal ladder (the §1-level shape; detail at §2.8/§4).**
Combat in V2 is a real **incremental progression surface**, not a single switch flipped at T0:

- **The growing weapon roster.** T0 **starts with exactly one** weapon and unlocks **+2** across the tier; T2
  adds **+3**, T3 adds **+4** — **~9–10 weapons across v1**, spread over **3 archetype lines**, each weapon an
  **archetype** (its baseSpeed / reach / targetCount) **+ a signature ability** (Q15/FU13). New weapons/styles
  are **FOUND and CRAFTED**, never gifted.
- **The combat-reveal ladder (one reveal per beat; FU12).** **R3** — the single starter weapon + the bare
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
> *shinden* reclamation paying out — the house visibly **back on its feet**; authored for v1 per Q8). Stages
> **E4–E5** (fortified seat → restored-and-surpassed) are parked (§1.7.1). Estate growth pulls
> **seconded/recruited** faces; the village's own cast does not balloon.

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

### 1.5.3 ORIGIN — his living family & friends (SIDE — a memory-gated support track, opens at T3)

The protagonist's **original family & friends** are **living** people in a nearby post-town
(**Sawatari-juku**, an invented town on an unnamed *kaidō*, a day-plus down the road) — **not** the local
village. His true name is **Tahei**; his old life was as a young porter/errand-hand for a small
transport-and-goods house. This track is a memory-gated, late-blooming **support track**, NOT grindable from
day one. It stays dark — foreshadowed for hours by the dream so its absence reads as anticipation — and
**opens at T3 (the region tier)**, when the dream has returned enough memory **AND** the protagonist's
standing lets him physically travel the controlled *kaidō* (*sekisho* checkpoints make free travel
impossible without standing). It is a **one-tier standalone reputation side-track with its OWN rung ladder**
(`O0→O5`, §3.6.2 — **upgraded** from the older "discrete restored-ties milestones" framing per canon
§"Reputation systems model") — optional, fully completable, an **accelerant**, narrative-only with **ZERO
mechanical gift from remembering**, and it **NEVER gates the spine**. Its rungs walk the reunion in sequence:
recognised at the post-town → the household reopens (mother **Oyuki**, sister **Okimi**) → the old trade
welcomes him (employer **Denbei**, friend **Kanta**, the porter-guild) → the half-remembered tie (sweetheart
**Osen**) → the estranged father reconciled (**Jinpachi**) → **his own name reclaimed — "Tahei" set down (the Origin
capstone, O5).** This O5 name-reclaim is **earned and *missable*** (a player who skips the Origin track may
never reclaim it) — and is **separate from** the lost-child **TRUTH** (that he is *not* Tama; **Otsuru** is),
which is **spine-guaranteed at G6 for every player** regardless of the Origin track (Q5/D-036). *(Father
**Jinpachi** is re-added per the Round-A lock — renamed from the colliding "Kuranosuke" to a clean period name;
he is **alive but long estranged** (away on the *kaidō* for years), so his beat is a **reconciliation**, **not**
a second return-from-the-dead — only the MC is that for this family (D-Q-Oyuki). He resolves at T3 with an
optional later emotional callback at T5 — see §1.9, §1.11.)*

Payoff is **support, not local power**:

- **Pride/morale** — a modest global skill-XP buff framed as a **new present-day relationship** ("a man with
  people behind him works harder"), **never a retroactive gift from remembering.**
- **Allies** — old porter/guild mates recruited to the expansion.
- **Trade ties** — origin-town goods, contracts, and ready-made caravan/porter routes that plug into the
  estate's region/castle-town/Edo expansion.

**Hard guardrail (rescoped, Q12):** **remembering itself grants ZERO** — the returning **memory / backstory
reveal** confers no stat, recipe, tool, or combat bonus; it grants **access** (new nodes/allies/quests unlock
narratively). But the **present-day relationships** you then build **are** legitimate mechanics that **stay**:
the new-relationship **morale buff** (a modest global skill-XP nudge) and the **origin trade-ties** that **shave
~10–15% off time-to-next-tier** are **earned new relationships, not retroactive gifts from remembering**
(§1.5.4). Every asset must still be grind-built. At least one origin beat is always available **without**
reputation-gating, so the thread never fully stalls. (The re-foundable **Kuzuhara** hamlet and the wider
post-town commercial region are T2+ expansion nodes — see §1.7.1.)

**Missable-capstone signpost (Block N.1 #7).** Because the O5 name-reclaim is **earned and missable**, the game
gives a **soft, non-spoiler signpost** that the Origin track carries a **one-time capstone a player can miss** —
e.g., a faintly-marked final rung on the Origin / Ties ladder, or a single line such as *"this thread has an
ending you could let slip"* — enough that a **completionist isn't blindsided**, **without revealing what the
capstone is** (the surprise of *what* "Tahei" means is preserved).

### 1.5.4 How the three interrelate — and the Tama-vs-farmhand allegiance

**THREE reputation systems, two shapes (canon §"Reputation systems model").** The **ESTATE = the SIX-TIER
SPINE** — the only thing that gates tier advancement. Per tier the estate-rep arc climbs (T0 stranger→**tolerated** ·
T1 tolerated→**friendly** · T2 friendly→**TRUSTED** · **T3 trusted→HONORARY MEMBER of the house** · **T4 honorary
member→chief steward / *yōnin*** (the MC's personal CEILING) · **T5 the MC stays *yōnin*; the arc shifts to the
HOUSE's national standing** — the indirect/mediated Edo ceiling, the *house* ranked, never the man) and the
estate's **domain expands**: survival on its own land (T0) → **the full estate** (T1) → **+ the village &
surrounding valley** (T2) → **+ the region** (T3) → **+ the castle-town** (T4) → **+ Edo / the nation** (T5). The
**VILLAGE (T2)** and **ORIGIN (T3)** reputations are **ONE-TIER standalone side-tracks**, each with its **own
ranks/rungs**, optional and fully completable — **accelerants that NEVER gate** the climb. The **village web**
(how the villagers *personally* regard you) carries forward through T3; the **Origin track** (Tahei's living
family/friends at Sawatari-juku) is a one-tier rep side-track with its own `O0→O5` rung ladder (§3.6.2),
narrative-only.

**Separate earned meters** keep these from collapsing into one bar. The **estate spine** is gated, **per tier**,
by **two rung-meters** in **Phase 1** — **Estate Service** (labour) and **Combat Rank** (martial; *renamed from
"Combat Standing"*, Q9) — each **per-rung-reset** (FU6) and **AND-gated** with that rung's story milestones;
then, in **Phase 2**, by the separate **four-pillar hybrid tier-gate** (§1.6.3/§1.6.4). Distinctly, the **combat
systems feed THREE clean, separately-stored tracks** that must never collapse into one: **(1)** kills/combat-XP →
the **character (combat) level** (HP + attribute points + satietyMax); **(2)** recognised **deeds** → the **Arms
pillar** (House Influence, Phase-2-gated); **(3)** per-rung curated activities → the **Combat Rank rung-meter**
(the martial rung-gate above). Alongside the spine sit the optional side-track meters: **Village Reputation**
(gentle per-node meters — the T2 side-track) and **Origin Ties** (the T3 side-track's own `O0→O5` rung meter).
Above all of them sits **House Influence**, the macro-resource the estate spends to expand: the estate generates
it directly, while village allies and origin trade-ties act as **multipliers/feeders** — they don't unlock the
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

## 1.6 House Influence (家威) — the four pillars & the six tiers

**House Influence** (家威, *ka-i*) is the macro-resource — the estate's **recognized standing** in the eyes of
progressively wider authorities — and the **one thing the entire UI-reveal is gated on.** It is deliberately
**NOT** *koku* and **NOT** coin: those are the inputs you spend and grind; Influence is the cumulative score of
what the house has visibly **become.** It is no longer a single trade-leaning number: it is the **umbrella
roll-up of FOUR achievement-driven pillars** grown in lockstep, each mapping to a distinct protagonist domain
so the grind stays load-bearing.

> **The pillar-reveal schedule (6-tier spine, D-048).** The four pillars **reveal one per tier** across the new
> spine — **Estate (家産) at T0 → + Arms (武威) at T1 → + Office (官威) at T2 → + Name & Honour (家格) at T3** —
> then **T4/T5 deepen the four with no new pillar.** The reveal-ramp of active pillars is **1 → 2 → 3 → 4 → 4**.
> *(This is a SHIFT, not just a renumber: the old "T0 = 2-pillar special" is retired — T0 now opens **one**
> pillar, Estate; the Arms-pillar **DEEDS** first bank at T1, though combat-as-activity is live from T0.)*

### 1.6.1 The four pillars

| Pillar | Kanji | Protagonist domain | Grows on |
|---|---|---|---|
| **Arms** (martial) | 武威 *bu-i* | combat / weapon-skills / men-at-arms leadership | recognised martial deeds (a road declared safe; a nest cleared; the grain store defended; a rival's enforcer broken) + seasonal security **judged results** (fired on a new high-water mark, never repeatable maintenance) |
| **Estate & Wealth** (economic) | 家産 *kasan* | labour / jobs / skills / trades / crafting | three **capped sub-engines** — **LAND** (*shinden* reclamation), **TREASURY** (debt→solvency→creditworthiness, *goyōkin*), **TRADE** (routes, broker standing, the signature ***meibutsu*: silk / sericulture**) |
| **Standing & Office** (political/territorial) | 官威 *kan'i* | jobs-as-offices / administration / quests | offices granted, territory secured, alliances sealed, rivals eclipsed (named on the roster; the bailiff duty; a dispute arbitrated; a valley allied) |
| **Name & Honour** (prestige/cultural) | 家格 *kakaku* | the recognition layer (reflects the other three + deeds/patronage/lineage) | the lord's recognition; the house off the foreclosure list; a sponsored rite; an inspector's report; a recorded merit-elevation |

> **The Estate & Wealth sub-engines = the *koku* flywheel, revealed across the Estate split (D-051 / D-066).**
> In **T0** the economy is a **single LINEAR taste** — one work → *koku* → upgrade → more output — the flywheel
> shown in miniature, with **no branching and no trade strand**. At **T1** (the full estate) it **branches into
> the three capped sub-engines — LAND / TREASURY / TRADE** (the *meibutsu* silk strand stays **≤⅓** of the
> pillar). The real village silk market (Onatsu's *meibutsu*) opens later still, at **T2 Village**.

> **The Arms pillar vs. the other two combat tracks (§1.6.4).** Arms grows **only** on **recognised DEEDS**
> (the influence economy) and, like every pillar, **accrues in each tier's Phase 2** — *not* while climbing the
> rungs (FU7). It is **distinct** from the **character (combat) level** (fed by combat-XP from kills) and from
> the **Combat Rank rung-meter** (fed by per-rung curated activities): **one kill** writes XP to your
> **level**; **one recognised deed** writes to **Arms**; **one curated rung activity** writes to the **meter**.
> Reconflating these three is the single likeliest regression — they stay separate by design (Q1/FU14).

> **Trade is demoted to 1-of-3 sub-engines inside Estate & Wealth and hard-capped to ~⅓ of that one pillar**
> — so a pure-trade run maxes ~⅓ of one of four pillars and can never dominate. The signature **_meibutsu_ =
> silk / sericulture (LOCKED)** that was once the whole endgame is now **one capped strand in one sub-engine of
> one pillar** (still subject to the trade ≤⅓ cap).
>
> **The trade ≤⅓ cap is a HARD structural cap (V2-reaffirmed).** Cross-pillar **combos** are **broader** in V2
> — **multiple pillar pairs**, larger magnitude (the T2 anti-slump leans on **both** seasonal-reward
> **rotation** *and* these combos; Q22/FU20) — but they are computed **POST**-clamp and **excluded** from the
> gate-threshold check, and the §6.6 verifier proves a combo can **never** breach ⅓ nor satisfy a required
> pillar. **T0 has no trade strand at all** (the trade sub-engine opens at T1).
>
> **Note:** the **Standing & Office** pillar's kanji is **RESOLVED = 官威 (*kan'i*)**, "authority of office"
> (set at the §5 authenticity pass, 2026-06-25; the earlier coined 政威 was rejected). Awareness: 官威 is a
> spoken homophone of 官位 ("court rank") — disambiguated by the kanji.

### 1.6.2 Accrual

Influence accrues in **two shapes only — never a passive time-trickle and never a flat per-action increment** —
and, crucially, **only on the PHASE-2 estate-influence track**: pillar **DEEDS do not accrue while you are
climbing the rungs** (they are gated **post-final-rung**, FU7), which prevents a "half the rungs, maxed deeds"
state.

- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded yield, a
  granted title, a sealed contract, a road declared safe in the books, a won petition). Per-event caps carry
  over from the Combat-Deeds discipline so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (not repeatable maintenance awards).
  **Weather and festivals modulate these judged results mechanically, bounded ±10%** (a day-keyed RNG
  sub-stream; Q35), and **bulk sales** apply a **saturation damper progressively per-unit** (legible,
  un-gameable; Q42).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable dents** (a lost battle
dents Arms; a scandal dents Name; a called debt dents Estate) — small and **never a wipe** (no permanent
holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by rebuild). Dent
self-heal is a small **below-high-water seasonal restore** that **never advances the high-water mark** (Q32).

### 1.6.3 The six tiers, transition story gates & per-tier pillar gating

Tier-up is **not** crossing a single band, and it is **not** the old "simple per-tier required-pillar
thresholds" (that framing is **superseded** by the V2 decisions, Q7/FU10/D-022) — nor the even older
balanced-development floor + ≤25% overflow (which stays rejected). Instead, each tier gates on a **scaled
grade-gate across the pillars REVEALED by that tier** (D-049): for **N** open pillars you need **exactly 1
EXCELLENT + 1 GREAT + (N−2) GOOD**, all **≥ GOOD** (**no** overflow substitution; **breadth required,
specialisation rewarded**). The semantics: **good = the expected baseline · great = really strong · excellent =
above-and-beyond** (FU10). The **revealed-pillar set grows one per tier** (D-048): **T0 = 1**
(Estate — the gate **collapses to a single EXCELLENT**, the (N−2) term dropping), **T1 = 2** (+ Arms → 1 GREAT
+ 1 EXCELLENT), **T2 = 3** (+ Office → 1 EXC + 1 GRT + 1 GOOD), **T3 = 4** (+ Name → 1 EXC + 1 GRT + 2 GOOD) —
the gate is **only ever checked against revealed pillars** (never against an unrevealed one).

This sits **after** the **sequential** climb (§1.5.1/§1.6.4): **Phase 1** — climb **all** the tier's rungs
(the per-rung rung-meter + story AND-gate); **Phase 2** — the estate-influence/pillar grind unlocks and the
**scaled grade-gate** above is what tiers up. The required pillars still **drift** as they reveal — early
tiers lean **Estate then Arms** ("survive and get strong"); upper tiers lean **Office + Name** ("win it socially").
The **per-pillar-per-tier thresholds need a full OVERHAUL** (not simple ratios) — **back-solved against the
fixed §4 deed inventory** — so **exact numbers are deferred to §4** *(proposed v1 balance)*. The only structural
cap that survives is the **trade sub-engine ≤⅓ of Estate & Wealth** (so trade can never carry a gate;
cross-pillar combos are computed **post-clamp** and **excluded** from this gate-check). Side factions are
**multipliers** into the pillars, never new pillars. The full six-tier climb is paced over a
**generational/decadal in-world span** for the upper tiers (T4→T5), so "restore *and* surpass" reads as earned
over years.

> **Ascension is a manual opt-in story event (D-049 / D-062).** Clearing the scaled grade-gate only **unlocks
> the *option*** to ascend — the player chooses *when* to take it, a deliberate story beat (never an auto-snap).
> **Overshooting** the gate (higher grades than required) earns a **grade-scaled permanent boon** carried
> forward. The **first ascension (T0→T1) always lands BIG** on first contact regardless of grade (D-062) — the
> locked silhouettes stir, a new pillar reveals. Throughout, the **standing panel teases the locked pillars as
> unnamed silhouettes** beside the active one(s) (§1.6.4 / §2.16(e)), so the player always senses *more* is
> coming without it being spelled out.

| Tier | Theme | Transition story gate (entry) | Phase-2 scaled grade-gate (per revealed pillars) |
|---|---|---|---|
| **T0 — Estate (tutorial)** | Earn your keep and survive your first days — a showcase-in-miniature (standing **stranger→tolerated**). One declining hill estate, a **small walkable map**, unlocked room by room. | *(Met at the open.)* Survive convalescence and the first labour. | **1 pillar** (revealed: **Estate**): the gate **collapses to a single EXCELLENT** (the (N−2) term drops) — *kura* solvent, first *shinden* begun. The humbling first fight is survived as **activity**, but the Arms-pillar **DEEDS don't bank yet**; **no market**. |
| **T1 — Estate (full)** | The full estate grind — the real **≥30-min-per-rung** climb across ~8 new rungs (standing **tolerated→friendly**). The **Arms pillar reveals**; the *koku* flywheel **branches into LAND / TREASURY / TRADE** (trade ≤⅓). | **T0→T1:** clear T0's single-EXCELLENT gate → the **first ascension lands BIG** on first contact regardless of grade (the silhouettes stir, the **Arms pillar reveals**; D-062). | Revealed: **Estate + Arms** (2): **1 GREAT + 1 EXCELLENT.** The first Arms-pillar **deeds bank here**; **E1→E2**; the first paid retinue (**Gohei & Yatarō**) is won. |
| **T2 — Village** | The estate's domain expands to **the valley beyond your gate** (standing **friendly→trusted**): Asagiri's shops, craftsmen, inn, shrine and the legend run as an **optional side-track**; the real silk *meibutsu* market opens. | **T1→T2:** clear the full-estate gate → the estate sends you out into the valley (**unlocks Village**); the region's **rival houses Tomita & Akagi** are **introduced** and the contest **begins**. | Revealed: Estate + Arms + **Office** (3). **1 EXC + 1 GRT + 1 GOOD** (errand-authority; the headman's regard; cash-crops + the silk market online). |
| **T3 — Region** | The estate's domain expands to **lead a region** (standing **trusted→HONORARY MEMBER of the house**): a cluster of valleys, the post-town, the upstream Kuzuhara ruins, roads, *sekisho* — with the **Origin** family/friends as a one-tier rep side-track (own rungs). **v1 completes here.** | **T2→T3:** **"clean your room"** (estate healthy, village happy, immediate fires out) → the lord first believes impact beyond the valley is possible → a quest to grow **regional influence**; the rivalry **climax** (Naoyuki ally-flip G5, **G7 = rivals dethroned**). *(v1's content finishes on completing Region — `outcome: t3done`.)* | Revealed: Estate + Arms + Office (+ **Name** → 4). **1 EXC + 1 GRT + 2 GOOD**; the **personal-mystery payoff** lands here. |
| **T4 — Castle-town** *(stub / cliff-hanger; beyond v1)* | The estate's domain expands to **become a castle-town power holding key domain offices** (standing **honorary member → chief steward / *yōnin*** — the MC's personal CEILING): the *daikan* / *tedai* officialdom and inter-*han* markets acknowledge, contend with, and cede to the house. | **T3→T4:** **win the region** (rival houses no longer the leaders) → the castle-town rulers **confer regional leadership** and **invite** the house in. *(v1 closes on this **castle-town / Daikan first-contact** cliff-hanger — Q24 / D-040.)* | **Office + Name excellent** (the takeover is won socially); Arms/Estate as leverage. |
| **T5 — Edo** *(roadmap)* | The **HOUSE** rises to **national standing — ranked at the capital** while the **MC stays *yōnin*** (the arc is the house's, not the man's; indirect/mediated Edo ceiling, canon §F / D-010): restore **and** surpass the grandeur of three generations ago. | **T4→T5:** a **"taste of Edo"** — the house is **called to staff & run the *domain's* Edo establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence → the **national** tier. | **Name + Office excellent** (the national *banzuke* ranking on all four pillars). |

> **Every tier is Phase-1-then-Phase-2.** The rung-meter + story milestones (Phase 1, §1.5.1/§1.6.4)
> **precede** the pillar profile above (Phase 2): you climb the rungs first, then grind the **revealed** pillars
> to the profile, then tier-up. (The T0 entry is "met at the open"; the deed-bearing Phase-2 grind that *proves*
> the profile begins only **after R7**.)

> **Castle-town takeover = MULTI-ROUTE** (peaceful: office / economy / marriage / out-maneuvering rivals; AND
> assertive: martial-security leverage). "Take over" = becoming the **dominant house holding key domain
> offices** — **never open rebellion against the bakufu.** Martial scale is **hard-capped** throughout: a small
> named retinue plus temporary corvée/levies for crises, **never a standing army.**

### 1.6.4 Progression structure — the sequential two-phase model & the three combat tracks (V2 canon)

This subsection is the **single load-bearing home** for the V2 progression spine; §1.5.1, §1.6.3 and §1.12 all
reference it (exact curves/thresholds are deferred to §4 — *proposed v1 balance*).

**(1) Sequential per-tier progression (D-023; FU7 / FU6 / Q30).** Each tier is climbed in **two ordered
phases**:

- **Phase 1 — climb the rungs.** Every rung of the tier's ladder promotes on **BOTH** a **numeric rung-meter**
  **AND** the rung's **story milestones** (an **AND-gate**; the UI reads "awaiting X" when one side lags). The
  **rung-meter** is a real §4 curve, **per-rung-reset**, whose threshold is **back-solved from the
  ≥30-min-per-rung floor × that rung's eligible-activity rate** (the **same ≥30-min floor** the §4.8 pacing
  model and the §6.6 gate-monotonicity verifier use). It is fed by **curated, story-consistent per-rung
  activities** — a designed **one-to-many** set, **not** a single repeat-counter. Two sub-tracks run in
  parallel: **Estate Service** (labour) and **Combat Rank** (martial).
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind**. **Pillar DEEDS accrue here and ONLY here** (gated post-final-rung; FU7), which
  structurally prevents "half the rungs, maxed deeds." Clearing the tier's **hybrid pillar profile** (below) is
  what **tiers up** to the next, larger canvas. *(There is **no stored "phase" flag** — the current phase is
  **derivable from the current rung**: pre-capstone = Phase 1, post-capstone = Phase 2.)*

**(2) The three clean combat tracks (D-025; FU14 / Q1 / Q47).** The combat systems feed **three separately-stored
tracks that never collapse into one bar.** What **one kill** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role |
|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** (labour and deeds **never** raise it; Q1) | **HP** (`hpMax = 40 + 8·characterLevel`), **+1 attribute point / 2 levels**, **satietyMax** (base + per-level growth; Q47) | personal power; per-mob `MobDef.level` sets on-kill XP (§4) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the scaled grade-gate) |
| **The Combat Rank rung-meter** | **per-rung curated** combat activities | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate |

So: **one kill** → character-level XP; **one recognised deed** → Arms; **one curated rung activity** → the
Combat Rank meter. *("**Combat Rank**" renames the old "Combat Standing", Q9; "**Standing**" now means the
**官威 Standing & Office** pillar **only**.)* **Labour conditioning** stays the **zero-stat enablement gate** on
the combat rungs — orthogonal to, and never a back-door past, the small bounded **per-skill combat perks**
(Q6/FU8): conditioning is **weak→capable**; the perks are a small **capable→a-bit-more-capable** polish.

**(3) The Phase-2 scaled grade-gate (D-028, scaled by D-049; Q7 / FU10).** Phase 2 tiers up on the **scaled
grade-gate** **over the pillars revealed by that tier** — for **N** open pillars, **exactly 1 EXCELLENT + 1 GREAT
+ (N−2) GOOD**, all **≥ GOOD**, **no overflow** (at **T0**, N = 1, the gate **collapses to a single EXCELLENT**).
Revealed set (one per tier, D-048): **T0 = Estate**, **T1 = + Arms**, **T2 = + Office**, **T3 = + Name** (4).
Ascension is a **manual opt-in story event** (the gate only unlocks the *option*); **overshoot** earns a
**grade-scaled permanent boon**; the **first ascension (T0→T1) always lands BIG** (D-062). The
per-pillar-per-tier thresholds are a **full §4 overhaul** back-solved against the fixed deed inventory; trade
stays **≤⅓** of Estate & Wealth as the **only** structural cap, with cross-pillar combos computed **post-clamp**
and excluded from the gate-check.

> **The standing-panel teaser (D-055).** From the capstone of **T0**, **House Influence becomes visible** as a
> standing panel showing the **active pillar(s)** filled and bar-graphed beside the **locked pillars rendered as
> unnamed silhouettes** — the player sees there are more pillars coming (and roughly how many) **without** their
> names or mechanics being spelled out, so each reveal still lands as a story beat (§2.16(e); ui-design.md).

Together: **climb the rungs (Phase 1: rung-meter + story) → unlock and grind the revealed pillars (Phase 2) →
clear the scaled grade-gate → tier-up.** Every reveal along the way is **design-staggered one-at-a-time** (no
runtime reveal-queue; FU4).

## 1.7 World & areas — v1 IMMEDIATE (T0–T3)

The estate-rank climb spatially **embodies** the tier escalation: you start trapped in one storehouse room and
earn the rest of the estate room by room (the rank ladder made of doors), then the village, then the
wilderness (by conditioning), then your own past (by memory). Each tier opens a fresh, larger canvas — **no
reset** — and every frontier is **itself incremental** (arrive minimal, learn its people and systems). The
wilderness is a **shared danger gradient gated by conditioning**, distinct from the Influence-tier authority
canvas. **T0 ships as a small walkable estate map** (delivering §1's "areas to explore"), extending into Asagiri (Village) at T2; v1 ships **full maps** for **T0–T3** within a **~6–8-node cut-set** (the rest parked in §1.7.1). Areas live
in a **data-driven registry** (`content/world.ts`) with **unlock predicates** over GameState — reinforcing the
data-driven, headlessly-testable framing (Q55).

| Area | Region (tier) | Faction | Notable locations | Unlocks when |
|---|---|---|---|---|
| **The Kura Storehouse** | Kurosawa Estate (T0) | Estate | The convalescence pallet; spilled rice to rake | At the open (R0, Stray). Home of the UI-reveal engine (body/rest bar, rice counter). |
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate (T0) | Estate | The *genkan*; the visitor's mat | R1. The diegetic stage for promotions and the Tama-vs-farmhand framing. *(LOCKED: T0 room/area reveals are SEPARATE — the stables, woodlot edge, and drill yard each reveal individually, not folded in.)* |
| **The Home Paddies & Dry Fields** | Kurosawa Estate (T0) | Estate | Fallow plots to reclaim; the granary | R1; *shinden* reclamation begins around R4. The rice/*koku* heartbeat (active grind, not idle producers). |
| **The Drill Yard** | Kurosawa Estate (T0) | Estate | Training posts; Kihei's weapon rack | **R3, after the humbling first fight (combat live from T0).** Conditioning & idle-combat. |
| **The Main House / *Omoya*** | Kurosawa Estate (T0) | Estate | Kitchen & inner rooms; the household shrine; the lord's study (ledgers) | R4 (houseman); the study at R7 (bailiff). |
| **The Workshops, Granary & Palisade** | Kurosawa Estate (T1) | Estate | The two workshops; the granary; the low palisade; the men-at-arms' rota | **T1** — the full-estate grind (estate stage **E1→E2**); proto-industry levers; the first paid retinue (Gohei & Yatarō) mustered. The Arms-pillar's first deeds bank here. |
| **The Market / Shop Row** | Village of Asagiri (T2) | Village | Smith Gonta's forge; Obaa Kuni's herb stall; Brewer Tokuemon's; Weaver Onatsu's (silk) | T2 (the full estate trusts him to carry its business past the gate; village V0). Per-shop reputation meters; the real silk *meibutsu* market. |
| **The Chief's House** | Village of Asagiri (T2) | Village | Yagōemon's receiving room; the village ledgers | T2, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
| **The Inn & Rumours Board** | Village of Asagiri (T2) | Village | The rumours board; the common room | T2. Sukezō's inn — hub for optional light folklore side-quests (unlocked organically). **None gate tier progression.** |
| **The Shrine / Temple** | Village of Asagiri (T2) | Village | The shrine (*shimenawa*); the temple register; the Bon offering site | T2. Priest Ryōa's register of the vanished (a mystery clue). |
| **The Jizō at the Weir** | Satoyama & Mountains / Asagiri boundary (shared, T0–T3) | Village / neutral | The boundary *jizō* **at the weir where he was found**; an offering left by an unknown hand | T0–T2, gated by conditioning. **The single find-spot** (Q11) — where he was pulled from the river — and the **one** capped residual-ambiguity beat (the unknown-hand offering lingers unresolved). |
| **The Near Satoyama** | Satoyama & Mountains (shared, T0–T3) | Shared wilderness | Foraging groves; the bamboo stand | R2/T0, gated by conditioning. First ring of the danger gradient. |
| **The River, Ford & Weir** | Satoyama & Mountains (shared, T0–T3) | Shared wilderness | The ford (the "kappa" spot); the weir | T0–T2, gated by conditioning. Fishing + the "kappa" thread (undertow + smugglers' sinking-spot). *(The find-spot **jizō at the weir** is its own row above — the lone residual-ambiguity beat is co-located there; Q11.)* |
| **The Foothills & Charcoal Grounds** | Satoyama & Mountains (shared, T0–T3) | Shared wilderness | The hidden charcoal kiln ("fox-fire"); hunting trails | T2, deeper conditioning. Second danger ring. |

## 1.7.1 World & areas — LATER (T3 deep + T4–T5 expansion; parked, not cut)

Parked per the lean discipline (§1.2 pillar 3): designed but **not authored as full areas in v1.** Per the
world-expansion cut-set, beyond the three starters a sane buildable set is **~6–8 nodes** that reuse the
existing cast and pay off the spine directly.

| Node | Tier | Kind / role |
|---|---|---|
| **Kuzuhara — re-foundable upstream hamlet & embankment river-works** | T3 | **Spine.** The faction-3 fusion: the drowned hamlet — the house's own **root-sin** (ancestor Sadamune's neglected flood-works) — becomes a resettlement node + the embankment (*seki*) river-works that secures the disaster. Access-only, grind-built; the player **names the drowned** and re-founds the hamlet. **No personal tie to the MC** — his origin/backstory and the lost-child evidence resolve via the **dream → the Sawatari-juku family** (§5 T2.2/T2.5), not here. |
| **Sawatari-juku & the wider post-town region** | T3 | **Mixed.** The origin reunion hub (optional — **Tahei's living family**) + the *toiya* transport office / waystation trade layer (the practical surplus-export runway to T3). |
| **Yanagi-watari — down-valley river-crossing market town** | T3 | **Spine (personal-mystery).** A second post-region locale a day **down**-valley (distinct from Sawatari-juku, which is up the *kaidō*) — a busy river-crossing market where a runaway child could vanish into the crowd. **Where the grown Otsuru (the real Tama) is found** — the **G6 lost-child TRUTH** locale, deliberately **separated from the origin-reunion hub** so the two T3 personal threads don't both land in Sawatari-juku (D-Q-otsuru-locale; authenticity spread > narrative economy). |
| **The Kaidō Porters' & Transport Guild** | T3→T5 | **Spine-thin.** Routes, *sekisho* pass-tiers, route-risk — the trade backbone. Met via friend Kanta's first favour run. *(The **v1 stub ending is NOT** this node — see the Daikan's Office row below; the porter-guild first-contact framing is dropped, Q24.)* |
| **The Rice & Silver finance network** | T3→T5 | **Spine-thin.** The conversion engine: village broker → regional warehouse → *Marutaya* debt-restructuring → *goyōkin* → Osaka/Edo *fudasashi*. |
| **The Neighbouring Valleys** | T3 | Side. **Hard-capped at exactly two named valleys (Hibara + Tōge-mura)** — Asagiri fractally replicated, slimmer. Courting them is an optional accelerant. |
| **The High Mountains & The Pass** | T3–T4 | Shared wilderness, top of the conditioning gradient. The lethal terrain where his caravan died; the "one-eyed mountain god" (= Hanzaki + fog-blind terrain). |
| **The Daikan's Office (castle-town officialdom)** | T4 | **Spine-critical** for formal T4 recognition **and the v1 STUB ENDING**: v1 (which *completes* at Region/T3) **closes on the castle-town / Daikan's-Office first-contact cliff-hanger** — the **T4 stub, beyond v1** (Q24 / D-040). The racket's nerve-centre; where most T4 Influence is minted. No folklore here — the rational, ledgered counter-world. |
| **The *domain's* Edo *yashiki* / *rusui-yaku* + *sankin-kōtai* conduit (one cluster)** | T5 | **Spine.** The mediated capital conduit — the house **staffs & runs the domain's establishment** (rusui **Mukai** — *invented surname; the real "Konoe" is a regent-house name, removed per Q27*) under the **daimyō's** biennial *sankin-kōtai* (never its own) — with the **Nihonbashi/*banzuke*** payoff (**Nihonbashi** is an explicitly **allow-listed** real place name, Q12) and the **touring-inspector set-piece** folded in as its two payoff beats. |

> **Marriage / adoption-into-higher-status is a REAL late-game (T4/T5) lever (NOT cut).** Kept lean — a
> grounded alliance/status move (not a relationship or people-management sim) that lifts **Standing & Office**
> and **Name & Honour** and is one of the **multi-route castle-town takeover** paths. It threads through the
> T4/T5 nodes above (the *daikan*'s office, the Edo conduit) rather than being a node of its own; details at
> §3/§5.
>
> **Cut for now (reintroduce later, "start lean, add back"):** the Matagi hunters, the Pilgrimage Order, and
> the Scholars-&-Physicians as a *network* (keep Sōan / Obaa Kuni as the existing seed only). **Estate stages
> E4–E5** (fortified seat → restored-and-surpassed) stay parked — **E3 "Prosperous" is now authored in v1**
> (§1.5.1; Q8).
>
> **Macro-tier spatiality is SETTLED: full walkable maps at EVERY tier, always** (T0–T3 built in v1; T4–T5
> maps built later — **not** abstract-board-only by design). This is no longer an open question. The only
> residual is **build sequencing** (upper-tier maps are authored after v1), not a design hedge toward abstract
> boards.

## 1.8 Cast (by faction & area)

Grouped by faction. Most NPCs do **double duty** — a gatekeeper *and* a story thread in the same beat — to
keep the web legible. The **estate roster GROWS per tier** (annotated below); the **village cast stays
static**; the origin cast unlocks at T3.

### Estate (main) — the Kurosawa household & retainers

| NPC | Role | Function | First appears |
|---|---|---|---|
| **Lord Kurosawa Shigemasa** | Head of the house, late 50s; weary, decent, stiff-backed pride papering over shame. *(Renamed off the Yagyū **Munenori** echo — Q12/Q39.)* | **Apex rank-gatekeeper** — upper-rung promotions need his explicit recognition; his approval *is* the main quest's measure. Believes ledgers, not omens. The **generational succession beat** runs through his aging decline. | E0 (T0) |
| **Kurosawa Naoyuki** | The lord's son and heir, ~22; talented, restless, chafing at genteel poverty. | Early **rival inside the household** (gatekeeps mid rungs); the talent-foil *inside* the family until the grind outpaces his coasting. Arc: rivalry → grudging respect → brotherhood; **converted talent, not innate gift.** Later the **ally against Rival House Tomita**; comes into his own as the house's future. *(A dedicated **T1 / early-T2 rivalry→grudging-respect beat** is authored so the **G5 ally-flip** against Rival House Tomita reads as **earned**, not abrupt — §1.9/§1.11; Q26.)* *(LOCKED: Naoyuki-rises-as-heir and the early in-house rival→brotherhood arc are confirmed.)* | E0 (T0) |
| **Lady Kurosawa Chiyo** | The lord's wife, ~50; manages the inner household and its meagre purse. | Gatekeeps **houseman access (R4)** and the domestic economy; later the house's **alliance-strategist** at the castle-town. | E0 (T0) |
| **Dowager Kurosawa Toku** | The lord's mother, ~75; sharp-memoried; the only one who lived through the fall as an adult. | Living **backstory keeper** — slowly parts with why the house declined (grandfather **Sadamune's** failed flood-venture). Embodies "no shortcuts." | E0 (T0) |
| **Chief Steward Genemon** | Runs the estate day to day, ~60; dry, overworked, fiercely loyal. | The **spine's primary rank-gatekeeper and quest-giver** — first calls him "another mouth," assigns nearly all early labour, grants the rung-by-rung promotions. Arc: grudging tolerance → reliance → naming him deputy and successor. | E0 (T0) |
| **Tanomo** | Estate accountant/clerk, ~45. | Gatekeeps the *koku*/economy and debt-repayment systems; the in-house thread into the ledger/debt mystery; later runs the debt-restructuring interface. | E0 (T0) |
| **Kihei** | Aging master-at-arms / drillmaster; competent-but-never-great old foot-soldier. *(Renamed off the Yagyū **Jūbei** echo — Q12/Q39.)* | **The mentor** and combat/training gatekeeper — "Talent is a story the lucky tell. You are not lucky. So you will work." Gates the entire training/idle-combat suite after the humbling first fight. | E0 (T0) |
| **Sota & Heita** | A grizzled groom and a cheeky teen field-labourer — the bottom-rung peers. | The field/stable labour loop and honest friendship at the floor of the ladder. *(The teen field-lad is renamed off the antagonist **Magobei** collision — Q11.)* | E0 (T0) |
| **Oai** | Head maidservant, ~40; runs the indoor staff and the servant-gossip network. | Quest-giver and information broker inside the house. | E0 (T0) |
| **Kyūsuke** | Estate cook, ~50; warm comic relief. | Runs the food/provisioning sub-economy; a soft daily-life anchor. | E0 (T0) |
| **Sōan** | Estate physician, ~55; rational, plain-spoken. *(Renamed off the Edogawa **Ranpo** echo — Q39 / Block N.1.)* | Dresses the healing scalp wound (grounding the mundane amnesia), names symptoms not visions, gates healing/medicine; flatly disbelieves the kami story. *(Origin/Scholars seed.)* | E0 (T0) |
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
| **Obaa Kuni** | Village herbalist / wise-woman. | The village's **folklore-keeper** — narrates the *kamikakushi* legend sympathetically while knowing it is coping; teaches foraging/village-craft. *(Renamed off the **Sayo** collision — Q39.)* |
| **Priest Ryōa** | Shrine/temple keeper. | Folklore-atmosphere quest-giver whose **register of the vanished** becomes hard evidence in the lost-child thread. |
| **Smith Gonta** | Gruff village blacksmith. | Tools and later spearheads — gates metalcraft; values shown effort over flash. |
| **Carpenter Risuke** | Village carpenter/builder. | Repairs and construction — gates building systems; later the Kuzuhara river-works lead. |
| **Weaver Onatsu** | Village weaver / sericulturist, a sharp widow. | **Lead of the signature *meibutsu*: silk / sericulture (LOCKED)** — runs the silk/textile trade sub-engine that ties into Lady Chiyo's economy and the origin trade routes. |
| **Brewer Tokuemon** | Village sake brewer, jovial. | The village's festival/social hub and a minor trade line (sake is **not** the *meibutsu* — that is silk). |
| **Innkeeper Sukezō** | Runs the inn and the **rumours board**. | The dedicated delivery vector for optional light-folklore side-quests; information broker. |
| **Peddler Sokichi** | Itinerant medicine-seller / peddler. | The **bridge** beyond the village (toward the origin town and the region); grounded source of yokai tales; helped the real Tama flee (a lost-child clue). |
| **Foreman Magobei** | A skimming village foreman — the "tanuki" of the rumours board. | The **T2 antagonist** and first hard thread into the rice-quota pattern (a doctored measuring-box). Reachable and human. |

### Origin (side) — Sawatari-juku & Kuzuhara *(unlocks at T3)*

| NPC | Role | Function |
|---|---|---|
| **Jinpachi** | Tahei's father, ~50; a senior porter long away on a far stretch of the *kaidō* — **alive but long estranged** from the household. | **Re-added per Round A** (renamed from the colliding "Kuranosuke"). Grieved his lost son; the source of the porter's-knot lineage (**ZERO bonus**). His beat is a **reconciliation with an estranged living father — NOT a second resurrection** (D-Q-Oyuki: only the MC returns from the presumed-dead for this family). It **resolves at T3** alongside the rest of the family, with an **optional later emotional callback at T5** (the recovered family proud behind the MC). *(The **Tahei NAME-reclaim** is a **separate** Origin **O5** capstone — earned + missable — not this father reconciliation; Q5.)* |
| **Oyuki** | Tahei's mother, ~45. | Emotional core of the origin thread — grieved her **son** (the MC) as dead, **the family's one genuine return-from-the-dead**; the reunion is the warm payoff, kept earned and a little costly. |
| **Okimi** | Tahei's elder sister, ~20; married into a trading family. | The concrete **trade-tie** that lets the origin town supply and route goods for the expansion. |
| **Master Denbei** | Tahei's old employer, ~55; runs the transport-and-goods house. | Supplies porter/logistics know-how and legitimate manifests; the grounded source of the porter's-knot identity (**ZERO bonus**). |
| **Kanta** | Tahei's childhood best friend and fellow porter, ~18. | Comic-warm friendship rekindled; the first porter contact and recruitable lead carrier. |
| **Osen** | A sweetheart Tahei half-remembers, ~17. | Optional relationship thread the dream surfaces; grounded and gentle, narrative-only. |
| **Otsuru (the real Tama)** | The "spirited-away" child, alive and grown **down-valley in Yanagi-watari** (a river-crossing market town — deliberately **not** the origin-reunion hub Sawatari-juku; D-Q-otsuru-locale). | Mystery payoff & living proof — a girl who **ran** from a violent stepfather and a near-sale for debt. **Her truth / living-proof is spine-guaranteed at G6 for every player** (Q5). Reunion kept **costly and incomplete** (she may not forgive). **"Otsuru" is LOCKED** (the substance — a girl who ran — was always canon; the name is now confirmed; deliberately distinct from sweetheart **Osen** to avoid confusion). |

### Region / Castle-town / Edo — antagonists, rivals & apex authority *(T2+, mostly parked)*

| NPC | Role | Function |
|---|---|---|
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" of the pass. | The **T3 dangerous combat beat** and the **talent-gone-rotten mirror** — edge **trained and brutal, never innate**; survived by labour-built endurance, never out-talented; muscle-for-hire (often Tomita's). |
| **Rival House Tomita** (head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei**) | A competing *gōshi*/merchant house that prospered as the Kurosawa fell. | The **primary, persistent regional STATUS rival** (T2→T4) — capital + connections + ruthlessness, **never innate gift.** Out-maneuvered commercially/socially, **never killed** (détente, alliance, or clean defeat). *(LOCKED: house "Tomita" plus the lineage — head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei** — are confirmed.)* |
| **Rival House Akagi** (head **Gennai**) | An older, prouder, declining samurai line — prestige without coin. | The **second rival house** (canon-required): contests the region on **honour/precedence** while Tomita contests on money — so the two can be played against each other. |
| **Tedai Kuroiwa** | The magistrate's agent (*tedai*) — the gracious facilitator who *records* your achievements. | The **T3 primary human antagonist** — outwardly an ally, secretly the local architect of the rice-quota skim. **Defeated by evidence, not violence.** Sits beneath Daikan **Iemasa** and above clerk **Mosuke** (the crack). |
| **Daikan Iemasa** | Deputy magistrate; incurious, status-conscious, not personally corrupt. | Signs what Kuroiwa hands him; **largely escapes** — the honoured ceiling. |
| **Clerk Mosuke** | A guilt-sick junior clerk. | The crack in the cover-up; supplies documentary proof; a reachable conscience. *(Renamed off the **Naoyuki** collision — Q39.)* |
| **Junkenshi Hayami Saemon-no-jō (the Touring Inspector)** | A senior shogunal inspector. | The **T4 impartial judge** — the apex human authority whose survey validates or threatens everything the house built. Not a villain; the antagonist-shaped *test*. The **lord** faces him; the MC stands at the back. *(Surname **Hayami** is invented — the real "Toyama" is removed per Q27.)* |
| **Echizen-ya Sōbei (the Edo factor)** | An Edo money-broker (*fudasashi*-adjacent) who launders the skimmed silver. | The **untouchable apex** of the quota machine — glimpsed, named, **never reached.** The antagonist as *system*. |

## 1.9 Side-threads — identity, origin & the dream rule

Two grounded side-threads run quietly beneath the spine; both pay off only in **feeling, allies, and flavour,
never power**, both resolve to human causes with no magic, and **both resolve at the Region tier (T3)** —
T4/T5 carry the house's power rise.

**(A) The Tama-vs-farmhand allegiance & the lost-child truth.** The valley grieves a child, **Tama**, taken
ten years ago; a half-drowned, memoryless young man reads to them as Tama returned. The estate disbelieves
it. This split powers the continuous **allegiance leaning** (§1.5.4): rates, flavour, and which quest-givers
open first — **never** stats, drops, production, or availability. "What happened to Tama?" is a **suggestion +
a story the player discovers in the world** (a sandal left yearly at the jizō-at-the-weir; a household that
flinches at her name; the legend "remembering" a boy; a debt-ledger mention; a post-town sighting). **The
truth:** Tama was a **girl** (the gender-drift is the fair clue) who **ran** from a violent stepfather and a
near-sale into service to clear a debt; she has been alive and grown the whole decade **down-valley in
Yanagi-watari** (a river-crossing market town a day the *other* way from the origin hub Sawatari-juku — the two
T3 personal threads sit in **separate locales** by design, D-Q-otsuru-locale), living as **Otsuru**, too
ashamed to return — a quiet **"presumed dead → back from the dead"** that mirrors the protagonist's own. Resolution is grounded and **partial** (she may not forgive). The MC is **not** her. **This
Otsuru/Tama TRUTH is spine-guaranteed at G6 for every player** (Q5/D-036) — independent of the optional Origin
track.

**(B) The grounded true-origin thread.** His real past is mundane: his true name is **Tahei**, a young
porter/errand-hand for a small transport house in **Sawatari-juku**, with **living** family and friends
there — father **Jinpachi**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**,
sweetheart **Osen** — all of whom **grieved him as dead** (his own "presumed dead → back from the dead").
*(The father **Jinpachi** is the deliberate exception: **alive but long estranged**, away on the *kaidō* for
years — his T3 beat is a **reconciliation**, **not** a second presumed-dead return, so **only the MC** comes
back from the dead for this family and **Oyuki is not twice-bereaved-then-twice-restored**; D-Q-Oyuki.)* **The
origin story (no magic):** he left on a mundane errand escorting a goods consignment over the pass; a **sudden
landslide — a rain-loosened slope giving way above the road** — struck the small caravan and pitched him down
the cut into the swollen river below; he was struck, half-drowned, swept downriver, and snagged at the weir
below the estate. His amnesia is ordinary **head trauma + near-drowning + exposure** — no magic. *(Re-skinned
off the embankment-FLOOD motif so the water-disaster isn't repeated three times — the founding debt and the
Kuzuhara root-sin keep the single embankment-flood; the MC's accident is now a **landslide** that swept him
into the river; Block N.1 #6.)* As memory returns he re-engages them; seeing what he is rebuilding,
they back him with **pride, allies, resources, and trade ties**. **Remembering itself grants ZERO** (the
backstory reveal confers no stat/recipe/tool/combat bonus); the **morale buff** and **trade-tie ~10–15%
speedup** are legitimate **present-day-relationship** mechanics that **stay** (Q12, §1.5.3/§1.5.4). Reclaiming
his **name "Tahei" is the Origin O5 capstone — earned and *missable*** (a player who skips the Origin track may
never reclaim it; Q5/D-036), distinct from the spine-guaranteed G6 Otsuru truth. **Both side-threads (incl. the
father *reconciliation*) RESOLVE at the Region tier (T3)**; the T5 epilogue carries only an **optional emotional
callback** (the recovered family proud behind him — §1.11), never a second mechanical payoff.

**The dream rule (enforced in writing *and* code):** returning autobiographical **memory only** — never
clairvoyance, **ZERO mechanical bonus**. **Memory-only** (only things he lived; the "voice in the water" is a
real person recalled, not a spirit). **Zero mechanical bonus** (memory grants access, not power). **Guaranteed
cadence** (at least one fragment within a capped number of in-game days OR a skill/standing threshold; **plus a
dream/mystery beat at EVERY tier transition** — incl. **T0→T1** (which **lands BIG**, alongside the first
ascension; D-062) and **T1→T2** — with the **full origin payoff held at the Region tier (T3)**, the Otsuru/Tama
truth (D-055); at least one origin beat always available without reputation-gating, so the thread never goes cold). All variance flows
through the one seeded RNG; cadence is headlessly regression-testable.

### Per-tier side-quest list

| Tier | Side-quests (open-ended; never gate the spine) |
|---|---|
| **T0** (tutorial) | The spilled-rice recovery; the porter's-knot beat ("you've hauled before"); first dream fragment; Dowager Toku's first memory of the fall. |
| **T1** (full estate) | The **T0→T1 ascension** dream beat (BIG — the silhouettes stir; D-062); the cadence deepens with further fragments; settling in the first paid retinue (Gohei & Yatarō); deeper estate life as the house stabilises (E1→E2). |
| **T2** | The inn rumours-board opener (the "kappa" of the ford = undertow + smugglers' sinking-spot); Magobei's skim (the "tanuki"); a per-family goodwill help; Priest Ryōa's register entry; the jizō-at-the-weir offering (the one residual-ambiguity beat); a first **Naoyuki rivalry→grudging-respect** beat (so the G5 ally-flip is earned; Q26). |
| **T3** | The lost-child truth (Otsuru) resolves and is **spine-guaranteed at G6**; the origin reunions (Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen); the **Origin O5 name-reclaim ("Tahei")** as the optional, missable capstone; Kuzuhara re-founding + naming the drowned; the "one-eyed mountain god" = Hanzaki investigated; the fox-fire ridge = a hidden charcoal kiln. |
| **T4+ (parked)** | The *osso* petition (a *gimin*-martyr bears the lethal risk); the rice-quota racket's reachable rungs answer; Naoyuki's coming-into-his-own; the succession secured. |

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
protagonist's own near-drowning trauma — a landslide that swept him into the river, not a flood; Block N.1 #6);
handled as grief-coping, not superstition to mock.

**Residual ambiguity is hard-capped at ≤1** unresolved, off-screen, mundane-readable beat (the unidentified-
hand offering at the **jizō at the weir** where he was found — the single co-located find-spot, Q11). Folk-religion
texture distinguishes **Shinto** (shrine, *shimenawa*, boundary/mountain kami, the soul-calling rite) from
**Buddhist** elements (roadside/boundary *jizō* as guardians of children and travellers, Bon offerings, the
temple register of the vanished that becomes hard evidence). **No rite ever mechanically "works"; nothing is
confirmed supernatural; there is never player magic.**

**Quest design — open-ended, not hand-holdy.** A quest is a **suggestion + a story you go find out in the
world**, never an A→B→C waypoint checklist. There are **fewer checklists overall**; the dominant
minute-to-minute behaviour is the **incremental grind — the hero getting better at what he does.**

**Quest types — no fixed budget (Q23 supersedes the old "lean ~4").** **PEST CONTROL**, **HUNT**, **CLEAR**,
and **DEFEND** (the deeds-earner) are the **T0 starter set** (combat- and labour-spanning, all open-ended), but
there is **no quest-type budget** — author **whatever quest types fit each stage**, and **more and
more-interesting quests are welcome, especially at later tiers** (escort/patrol/bounty/duel/investigate/etc. are
**no longer hard-parked**).

## 1.11 Antagonists & endgame

**One antagonist per tier**, escalating in scope (estate → village → region → castle-town → Edo), grounded (no
magic; "yokai" are misread humans/animals), each **revealed incrementally** rather than unmasked. The
**reachable culprits answer at their tier; the truly powerful largely escape** — **partial justice by design.**
**T0 estate decline is a simple debt/misfortune, NOT conspiracy-linked** — the one antagonist with no villain.
**v1's ending beat is explicit:** v1 **closes on the castle-town / Daikan first-contact cliff-hanger** (the
**T4 stub**, Q24 / D-040) — **not** the porter-guild node; the full T4/T5 endgame below is the **roadmap
vision**, not a v1-shippable tier.

| Tier | Antagonist | What they block | Reveal | Resolution |
|---|---|---|---|---|
| **T0 — Estate** | **The Inherited Debt** (personified only by tired pawnbroker **Moneylender Tōkichi**; *a circumstance, not a conspirator*). | The estate is dying of compound interest from grandfather **Sadamune's** failed embankment-venture, plus thin harvests and a cracked kura. Can't leave until the immediate fires are out. | A leaning gate and a red ledger; clerk **Tanomo** drips "we owe coin" → "the interest is the problem" → Dowager **Toku**'s memory that the root is Sadamune's own failure, **not anyone's crime.** | Purely economic. **Peaceful:** out-grind the interest and renegotiate. **Assertive:** refuse the worst terms, force a fair table by proving solvency (no fight). Restructured, not erased; the house's **root-sin** it atones for at Kuzuhara — emotional payload, **no antagonist.** |
| **T1 — Estate (full)** | **The Inherited Debt, still** — the same circumstance, deeper in; *no new human antagonist.* | The full-estate gate won't open until the *kura* is genuinely solvent and the Arms pillar is earned; the debt's drag (not a person) is the wall. | No new face — the red ledger blackens slowly as Phase-2 deeds bank; the house's own near-ruin is the obstacle. | **Economic, continued.** Out-grind and renegotiate to a stable house; the **root-sin** is still atoned for later at Kuzuhara. **No antagonist.** |
| **T2 — The Valley** | **Foreman Magobei**, the "tanuki of the rumours board" — skimming rice with a doctored measuring-box (*kyō-masu*). The first, small human antagonist. | The T2→T3 gate needs the village happy; his skim keeps stores short and steals the surplus you need; he's the "tanuki" folklore beat. | The board's "rice-thieving tanuki" → one load measuring short twice → the doctored *masu* → the thread runs up to Headman **Yagōemon**, whose ledgers cover Magobei. Dawning unease, then a box of rigged wood. | **Peaceful:** expose the skim, Yagōemon makes restitution and keeps his post in disgrace. **Assertive:** force Magobei off the books (his hired muscle is the first small brawl). **Partial:** Magobei answers; better-connected Yagōemon mostly escapes with a quiet rebuke. |
| **T3 — Region** | **Rival House Tomita** (spine antagonist) + **Rival House Akagi** (the foil), with **Hanzaki** as the road's teeth. | "Win the region." Tomita underbids deals and courts the same valleys; Akagi blocks the upstart Kurosawa on **precedence**; Hanzaki makes the trade pass unsafe. | Tomita first a *name* underbidding one deal → agent Yasubei → the head. Akagi first a *snub* → a precedence dispute → Gennai. Hanzaki: rumour → a survived-not-won encounter → a recurring duel nemesis (**trained, never gifted**). | Multi-route. **Peaceful/commercial:** out-supply and out-arbitrate valleys; settle Akagi by *restoring its honour*. **Assertive:** secure the pass with a hard-capped 2–3-man detail; break the brigand roost; out-leverage Tomita's brokers. Tomita is **never killed**; the **G5 ally-flip** — heir **Naoyuki** turning against Tomita beside the MC — pays off the authored **T2/early-T3 rivalry→respect beat** (Q26); a famine-band under Hanzaki can be **fed/resettled.** **The personal-mystery payoff lands here.** |
| **T4 — Castle-town** | **Tedai Kuroiwa**, the gracious door — the magistrate's agent who *records* your achievements and secretly architects the rice-quota skim. | The gate is the rulers conferring leadership + inviting the house in. All T4 Influence is *minted by officialdom*, and Kuroiwa controls that gate (slow-walks recognition, misrecords yields, routes the rigged-quota friction). | The polite junior clerk who keeps you waiting → the facilitator who records your service (seems an ally) → a yield misrecorded "by error" → Mosuke's flinch → the rigged *kyō-masu* at the weighing-yard cross-referenced against quota ledgers. The gracious man at the gate **is** the rot. *(v1 reaches only the **first-contact** beat of this tier — the stub cliff-hanger.)* | Multi-route, **partial justice.** **Peaceful:** outgrow him — become the dominant house holding key offices (Marutaya credit, a graded *meibutsu*, samurai-society standing) and make his skim irrelevant; **you need not prosecute him at all.** **Assertive:** mount the **osso over-the-head petition** on proof — Kuroiwa answers; **Daikan Iemasa largely escapes**; the petition's lethal risk falls on an **ally / *gimin*-martyr**, not the MC. "Take over" = dominant house, **never rebellion.** |
| **T5 — Edo** | **The Edo factor, Echizen-ya Sōbei** (untouchable apex, laundering the silver) + **the Touring Inspector** (the impartial test). | The factor blocks *full justice* (the trail dies in Edo). The inspector blocks *final recognition* (only a house whose record survives the survey earns the mediated merit-commendation). | The factor a single glimpse (rusui **Mukai** forwards a dispatch; a manifest dies at his name — you learn *who*, and that you can't touch him). The inspector: rumour down the *kaidō* → a looming date → the staged set-piece where the **lord** faces him and the record is read aloud, MC at the back. | The inspector set-piece is **won or dented**, not fought (a recoverable dent on neglect, never a wipe). **The factor escapes** — the deliberate, honoured incompleteness: reachable culprits answered at their tiers; the truly powerful walk. The win is **the house restored and ranked**, the rot's apex still out of reach. Bittersweet by design. |

**The connective thread (light, optional — NOT the spine).** A single optional **investigation overlay — "the
rigged measuring-box"** — recurs as a motif: Magobei's doctored *masu* (T2) → the same rigging in Kuroiwa's
weighing-yard (T4) → the silver's trail dying at Echizen-ya (T5). A curious player who pulls it finds the rungs
connect into one **quota machine** and can mount the *osso* petition for partial justice; an incurious player
simply beats five separate antagonists and never notices the through-line. **No tier requires touching the
racket to advance** — tier progress is always achievable by economic/social means alone. **Crucially the thread
is NOT attached to T0:** estate decline stays a self-contained debt/misfortune (Sadamune's embankment), with no
racket fingerprints; the "one rotten root behind everything" framing is **retired** — the motif is "*a pattern
you may notice*," not "*the secret behind everything*."

**The power-focused late game & the national *banzuke*.** The endgame story centres on the house's **POWER**
(office / debt-rescue / takeover / ranking) — **trade is OUT of the finale spine** (a supporting thread only).
The T3 castle-town becomes a multi-route "become the leading house" conquest (offices held in the house's name,
the daimyō's confidence won, rivals subordinated — never killed by the player, never rebellion). The late-game
**anti-slump / variety** leans on **cross-pillar combos + seasonal-reward rotation** (Q22/Q20/FU20), with trade
held out of the finale spine. The T5 Edo climax is a **national multi-pillar *banzuke* ranking of the HOUSE** on
all four pillars (canon-locked: rank the house, D-010 ceiling kept), on which the Kurosawa climb from unranked
toward the top, with the highest slots **structurally sealed** — the wall the truly powerful built, made the
chart's literal geometry. Per-tier rank ladders also rank the house at each tier (a domain *banzuke* precedes
the national one). *(LOCKED framing: presented as a **popular *mitate*/parody broadsheet** rather than an
official register, with **sumo-rank vocabulary** — Maegashira/Komusubi for the house's attainable band,
Ōzeki/Yokozuna for the sealed top. Confirmed alongside the house-ranking *banzuke* + the D-010 ceiling.)*

**Rivals carry real standing (so the overtake is computed, not scripted; D-Q-banzuke).** The named houses —
**Tomita** and **Akagi**, plus a few unnamed domain houses to fill the chart — carry **LIGHT rival stats** (a
small per-pillar standing/rank value each, cross-ref **§2.18**), so the **G7 "rivals dethroned"** beat is a
**real chart-position overtake** the player's four-pillar climb computes past, **not** a hand-scripted cutscene.
This is **NOT a full house-sim** — just enough stored standing for the per-tier *banzuke* to read the Kurosawa
rising above them.

**One ending + post-game.** There is **one authored ending** (the house restored & ranked) + **post-game
free-play (no reset)**; branches are in *how* you got there (allegiance / takeover route), not separate endings.
**D-010's honest ceiling is preserved by ranking the HOUSE, not the man:** the protagonist does **not** become a
*hatamoto* or get received by the shogun; recognition arrives **indirect and mediated** (down through rusui
**Mukai** and **Lord Shigemasa**). His personal ceiling stays **chief steward / *yōnin* — the lord's right hand**
(*karō* stays aspirational narration only); the house's *banzuke* rank keeps climbing post-cap (decoupling personal vs house ascension). The post-game long-tail
is escalation/mastery over what's already built (defend the top *banzuke* spot on the biennial *sankin-kōtai*
heartbeat, recoverable and never a decay-tax; optional grounded super-bosses; per-pillar mastery goals; the
estate-as-sandbox teaching layer re-homed onto **Tokujirō** and recruited origin friends).

**Succession.** A generational beat: aging **Lord Shigemasa**'s decline → heir **Naoyuki** comes into his own
(the MC as right-hand; his arc earned via the **T1/early-T2 rivalry→respect beat** and the G5 ally-flip against
Tomita, Q26); the house's future is secured across a generation. The epilogue is a tableau of everything built:
the restored-and-surpassed house seal, the reclaimed fields, the resettled Kuzuhara, the named drowned, the
freed and self-determining Otsuru, the recovered family proud behind him, and — **if the player walked the
Origin track to O5** — a reclaimed **true name (Tahei)**; the name-reclaim is **conditional** (missable; the
epilogue reflects whether it was earned, Q5/D-036), while the rest of the tableau and the Otsuru truth are
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
arrive singly (there is **no runtime reveal-queue**; FU4) — and obey a general **NO-UI-DUMPS** principle (Q17).
Distinct activities (e.g. **Crafting**, **Quests**) appear as their **own top-level nav tabs**, not nested
panels (Q10). Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — see §1.5.1), **not** one
continuous R0→R7 climb, and each ladder runs the **sequential Phase-1 (climb the rungs) → Phase-2 (estate
pillar-grind)** model (FU7, §1.6.4). **Combat surfaces inside the FIRST tier (T0)** as an **incremental ladder**
(the combat-reveal ladder, below), not a single mid-ladder dump.

**T0 — Estate ladder reveals (sequential phasing):**

- **R0** — body/rest bar + rice counter.
- **R1** — labour loop + paddies + *koku*.
- **R2** — Skills tab + foraging/woodcutting + the near-satoyama.
- **R3** — **drill yard + Combat panel + the single starter weapon + Equipment/Inventory + Bestiary + the bare auto-resolve loop + retreat** (after the humbling first fight; **character (combat) level begins**, fed by combat-XP).
- **R4** — main-house interior + the household domestic economy; first *shinden* begun; **the simple Crafting loop as a top-level tab + graded durability bands** (never auto-unequip).
- **R5** — **stance slot** + the **Quests top-level tab** (pest-control/hunt/clear/defend). *(Curated combat activities feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — gated to Phase 2.)*
- **R6** — workshops + granary + proto-industry levers; **the first errands past the estate gate** (the valley comes into view).
- **R7 (capstone)** — **OPENS Phase 2**: the four-pillar **estate-influence grind**; the standing panel made visible (the **revealed** pillar — **Estate** only at T0; Arms reveals at T1); cash-crop levers; the tier-expansion map. Clearing T0's **single-EXCELLENT Estate gate** (§1.6.3) is what **tiers up to T1.**

**Combat-reveal ladder (incremental; one reveal per beat — FU12/FU13):** **R3** single starter weapon + bare
auto-resolve + retreat + Bestiary → **R4** graded **durability** bands → **R5** **stance** slot → **first
weapon-L10 milestone** the **ability + item** slots → **T1** the **2nd combat line**, **T2** the **3rd line.**
The **weapon roster grows incrementally** alongside: **T0 +2 / T1 +3 / T2 +4** (~9–10 across v1, each an
archetype + signature ability; **T3 Region adds no new line, only depth**). Detail at §2.8/§4.

**T1 — the estate at FULL depth (a FRESH ladder, `R8→R15`):** the same domain, deeper — the ≥30-min-per-rung
grind first bites, the **Arms pillar reveals** and banks its first deeds, the *koku* flywheel branches
(LAND/TREASURY/TRADE, trade ≤⅓), the first paid retinue is won. New verbs, no new domain (forward-sketch rungs
in §3).

**T2 — the estate's domain expands into the valley (a FRESH ladder, V0→V7):** the tier opens minimal (one
contact, one shop) and progressively reveals — as the *house's* reach grows — the market/shop row → chief's
house → road-security & valley-scale combat → the silk/sericulture *meibutsu* sub-engine → first Office standing
→ the **region** map and the T2→T3 quest. The **village reputation web** (shop meters, the inn & rumours board)
fans out **alongside** as a parallel **optional** side-track, never a gate (§1.5.4, §2.15). **T3 mints another
fresh ladder** the same way (the domain expands again, to region scale; the personal-mystery payoff lands across
it). Each tier is the same **Phase-1-then-Phase-2** motion repeating, never an eight-rung-and-done staircase.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal **judged** Influence results — fired on a
**new high-water mark**, never a repeatable per-season maintenance trickle, per §1.6.2). To give the
"leave it running, check the progress" feel within active-only, **tab-open AUTO-RESOLVE + AUTO-REPEAT** keep a
loop ticking while you watch (FU23); **auto-producers stay late-game (T4+)** — early game is the MC's own active
grind (combat, skills, jobs, crafting; **no assignment/management panel and no labour-gang to manage**, ever).
The time/budget model is a **FLOOR, not a ceiling**: the **~28.5 h budget is a minimum** — a longer
**OSRS-rough grind** with enough grinding content, **interleaved, never brick-walled** (FU18; §4.8 is a
*minimum-grind* model). Everything is data-driven (areas/panels/resources as registries with unlock predicates
over GameState), deterministic under the one seeded RNG, with balance/unlock tables generated into `docs/` and
headlessly regression-testable via the DEV play API. The estate, village, and origin tracks differ in **shape**
to keep pacing varied (estate steep-geometric per-tier ladders; village gentle per-node meters; origin a short
one-tier rep ladder `O0→O5`), and the **per-rung-reset rung-meter** (FU6) is the numeric per-rung curve that
drives the Phase-1 reveals. The side factions act as Influence **multipliers** (shave **~10–15%** off
time-to-tier — felt, never a wall). The presentation register throughout is **text + emoji + CSS art**
(woodblock palette; kanji season tags; colour-coded rarities — see D-013), with **load-bearing period motifs as
inline SVG** and **functional text at `--ink-soft`** (WCAG AA) per the V2 presentation pass (§6).

## 1.13 Risks & guardrails

Folded in from the locked-rule fixes (to apply at integration and hold through §§2–7):

- **No belief-creatures in grindable spawn tables.** Grindable mobs are honestly-mundane (boars, monkeys,
  hornets, wolves/bear, bandits/deserters — **~5 in v1**). Any "yokai" (kappa, fox-fire fox/tanuki,
  yamanba/tengu, the one-eyed mountain god) is an **INVESTIGATE-then-confront one-shot** resolving to a
  human/animal, never a respawn population.
- **Residual ambiguity ≤1.** Re-affirmed: exactly one unresolved, off-screen, mundane-readable token, kept at
  the **jizō at the weir** (the single co-located find-spot where he was found; Q11). No new ambiguity beats
  (e.g. the invented "T4 castle-town ghost-story wink" is **deleted**). Provide a region-wide belief→cause table
  before authoring any node with new omens.
- **No permanent holding-loss ("never a wipe").** A failed defence **dents/disables** a holding *temporarily*
  (recoverable by rebuild); Influence can stall or take small per-pillar dents but is **never wiped**.
- **The budget is a FLOOR, not a ceiling.** A longer **OSRS-rough grind** with enough grinding content; the
  game may be **longer** than ~28.5 h, never shorter at the gates — **interleave, never brick-wall**; "leave it
  auto-running, check the progress" (active-only + tab-open **auto-resolve / auto-repeat**; FU18/FU23). The §4.8
  pacing tables are a **minimum-grind** model; the M-pacing regression fails on **undershoot only**.
- **Bounded labour→combat perks (not a hard wall).** Each labour skill grants **~2–8 small, stackable combat
  perks / flat bonuses** (unlocked by levelling it; **no hard global cap**; small magnitudes), via a separate
  `skillCombatBonus` channel — labour skills make you **more capable**, but **big combat power stays
  combat-only.** **Conditioning stays the zero-stat enablement gate** (the perks must never become a back-door
  past the weak→capable gate; they are orthogonal). *(This **reverses** the old "ZERO combat stat or
  training-rate bonus / soft hidden edge killed outright" guardrail — Q6/FU8; the no-edge line is now
  **gift-vs-work**, not labour-vs-combat.)*
- **Combat is incremental + never weaponless.** T0 starts with **exactly one weapon**; a **growing roster**
  unlocks rung-to-rung (+2 T0 / +3 T1 / +4 T2; ~9–10 across v1; FU13). **Graded durability bands** degrade a
  weapon's attackPower but **NEVER auto-unequip** — a weapon stays functional even at 0 wear-band (auto-battler;
  never weaponless; Q33/FU17).
- **Fictionalise real names.** Keep the world generic-rural — no real place/daimyō/house names. **Allow-list:
  Nihonbashi** (the *banzuke* payoff; Q12). Renames recorded: the touring-inspector's surname **Toyama** and the
  Edo rusui **Konoe** → **invented** (Q27, here **Hayami** / **Mukai** pending the cross-section name-canon
  sweep); the T0 field-lad **Mago** → renamed off the antagonist **Magobei** (Q11); the clerk **Naozane** and
  herbalist **Obaa Sato** → renamed off the **Naoyuki** / **Sayo** collisions (Q39). The lord **Munenori**,
  drillmaster **Jūbei**, and physician **Ranpo** → renamed **Shigemasa** / **Kihei** / **Sōan** (off the Yagyū
  **Munenori**+**Jūbei** father-son echo and the Edogawa **Ranpo** collision; Q12/Q39 / Block N.1 #3). The origin **father is
  re-added as Jinpachi** (renamed from the colliding "Kuranosuke") — **settled, not dropped.** A **§6.6 real-name
  denylist lint** prevents recurrence (Q28). Macron romanization is project-wide.
- **Hard-cap martial scale.** A **small named retinue** + temporary corvée/levies for crises, **never a
  standing army**; "de-facto security" = the house the daimyō *deputises* (sanctioned, revocable). Re-balance
  toward **labour-plurality** (peaceful labour the dominant daily texture; combat the strong mid-game-onward
  second pillar).
- **Combat-track lexicon (RESOLVED).** The Arms rank-gate is **"Combat Rank"** (renamed from "Combat Standing",
  Q9) — so **"Standing"** now means the **官威 Standing & Office** pillar **only**. The three combat tracks stay
  lexically and mechanically distinct: **character (combat) level** (kills/XP) · the **Arms pillar** (deeds) ·
  the **Combat Rank rung-meter** (curated rung activities; §1.6.4). Macronize *gōshi* and *rōnin* forms
  project-wide.
- **Standing & Office pillar kanji (RESOLVED)** — the earlier coined 政威 was rejected; its **kanji is now
  RESOLVED = 官威 (*kan'i*)**, "authority of office" (§5 authenticity pass, 2026-06-25). The top-rung title is
  **RESOLVED = chief steward / *yōnin*** ("the lord's right hand"); keep grand *karō*/adoption vocabulary as
  **aspirational narration only** for a modest *gōshi* house.
- ***Meibutsu* product is LOCKED = silk / sericulture** (Round A). No placeholder; author the T4/T5
  trade/prestige payload directly against silk (weaver Onatsu leads the sub-engine; it stays under the trade
  ≤⅓ cap).
- **Estate-restoration must not drift into city-builder/4X tedium** — Influence stays diegetic and
  story-framed; the cozy daily-labour texture and grounded character story remain the core.

## 1.14 §1 decisions → ADRs

The §1 decisions map to ADRs D-001…D-015 (final numbering set at integration). **D-004 is reversed** (no
reset); **D-006 is amended** (Tahei reclaim Origin-gated at O5, earned + missable; age ~18–20).

> **V2 deltas (governing).** The V2 reshape adds ADRs **D-016 … D-045** (the 56 Block-L decisions + 23 Block-M
> follow-ups → the new D-023…D-042 set; **+ Block N → D-043 (V2.1), D-044 (crash-recovery), D-045 (a11y-ink)**).
> **D-022 is GOVERNING** — these V2 decisions **supersede** any
> conflicting prior ADR / canon / K-item / lock (**most-recent-wins, annotate-don't-delete**). **D-021** sets
> the freeze line: "freeze" = **locked-intent only** (PD-1 — §1 vision + the signed acceptance criteria are
> frozen; the §4 numbers and §7 M2–M7 detail stay **provisional**). The rows below are **amended in place** to
> the V2 model.

| ADR | Decision | Status |
|---|---|---|
| **D-001 / D-002 / D-003 / D-005** | Grounded / no-magic; folklore = believed-atmosphere (light flavour); mediocre-start (no hidden edge); title *Kamikakushi* + fictional mid-Edo setting. | **Hold.** |
| **D-004** | Reset / prestige. | **⛔ REVERSED** — tiers replace prestige; **NO reset of any kind**; everything persists. Teaching layer re-homed onto Tokujirō + recruited origin friends. |
| **D-006** | Protagonist identity. | **Amended (V2)** — fixed male, no rename; "Tama" borrowed name, true name **Tahei**; the **Tahei reclaim is now Origin-gated at O5 — earned + MISSABLE** (Q5); the **Otsuru/Tama TRUTH stays spine-guaranteed at G6** for every player; age **~18–20**. |
| **D-007** | Estate-rise spine + tiers **T0–T5** *(reshaped from T0–T4 by D-048 — the Estate split)* + per-tier transition story gates. | **New ADR** (supersedes the mistaken-identity spine). |
| **D-008** | Three starter factions + **four-pillar** House Influence + per-tier gating. | **New ADR; amended (V2)** — gating is now the **HYBRID good/great/excellent** profile over revealed pillars (good in all · great in 2–3 · excellent in 1–2; Q7/FU10) under the **SEQUENTIAL Phase-1 (rungs) → Phase-2 (pillar grind)** model (FU7); the old "simple per-tier thresholds" framing is superseded; **trade ≤⅓ of Estate & Wealth** survives as the only structural cap. |
| **D-009** | Origin = **living** family/friends (Sawatari-juku) opening at **T3**; Kuzuhara a re-foundable region node; access-only. | **New ADR** (supersedes family-death canon); tier reshaped by D-048. |
| **D-010** | Indirect/mediated **Edo ceiling** — rank the HOUSE (national *mitate-banzuke*), not the man; no *hatamoto*/shogunal audience. | **New ADR** (Option A: provincial/parody chart; personal rank hard-capped at chief steward). |
| **D-011** | **Combat earns standing** via the Arms pillar; mediocre-start preserved; conditioning gate. | **New ADR; amended (V2)** — the no-cross-feed wall is relaxed to **BOUNDED per-skill combat perks** (Q6/FU8; conditioning stays the zero-stat gate); combat is now **THREE clean tracks** — character level (combat-XP) / the Arms pillar (deeds) / the **Combat Rank** rung-meter (curated rung activities; FU14). |
| **D-012** | Per-tier rank ladders + full maps every tier + **v1 = T0–T3** (T4 stub, T5 roadmap; reshaped by D-048); lean cut-set. | **New ADR; amended (V2)** — the **~4-quest budget is dropped** (Q23: no quest-type budget — author whatever fits, more/interesting welcome); combat is now **incremental** with a **bigger weapon roster** (Q15/FU13); the **budget is a FLOOR / longer grind** (FU18); estate **E3 "Prosperous" is authored in v1** (E4–E5 parked; Q8). Cut-set otherwise: ~8 rungs, ~5 mobs, ~6–8 nodes. |
| **D-013** | Tech & presentation: Vite + TS + Vitest; pure-core + thin DOM renderer; one seeded RNG; export/import; responsive desktop+mobile; **active-only, no offline progress**; static itch.io build. Art register = TEXT + EMOJI + CSS. | **New ADR; amended (V2)** — **multi-backend redundant save** (IndexedDB + localStorage + sessionStorage; magic field; monotonic save-counter newest-wins + timestamp tiebreaker; Q37/FU1–FU2); **per-named-stream RNG cursors** `{seed,cursors}` + **stateless day-keyed** weather/lunar (Q2/FU3); **ban `Math.pow` → integer-pow + lint** (Q36); active-only with **tab-open auto-resolve / auto-repeat** (FU23). Presentation V2: a11y correctness now, functional text → **`--ink-soft`** (WCAG AA), **self-hosted OFL fonts**, **inline-SVG** load-bearing motifs (Q18/Q48/Q52/Q38). |
| **D-014** | **Per-tier antagonists** (not a single racket); the racket demoted to a **light, optional connective thread**; T0 villain-less; two rival houses (Tomita + Akagi). | **New ADR.** |
| **D-015** | Four-pillar accrual = **achievement JUMPS + seasonal JUDGED RESULTS** (new-high-water-mark only), up-only + rare recoverable **per-pillar** dents (never a wipe). | **New ADR; amended (V2)** — accrual belongs to the **Phase-2** estate-influence track (deeds **don't** accrue while climbing the rungs; FU7); weather/festivals modulate judged results **±10%** (Q35); bulk-sale saturation damps **progressively per-unit** (Q42). |

### Resolved by Round A (no longer open — recorded for traceability; 🔁 = reversed by the V2 decisions)

- ***Meibutsu* = silk / sericulture** (LOCKED). Was a candidate list; now settled — weaver Onatsu leads the
  sub-engine; threads T1→T5 under the trade ≤⅓ cap.
- **Macro-tier spatiality = full walkable maps at every tier, always** (LOCKED). The "vs abstract boards above
  T2" hedge is removed; only build sequencing (upper-tier maps authored after v1) remains.
- **Origin father = re-added as Jinpachi** (LOCKED; renamed from "Kuranosuke"). Reunion resolves at T3, optional
  emotional callback at T5. The "cut/dropped?" framing is retired.
- **Second rival house = Akagi** (honour/precedence) beside Tomita (money) (LOCKED — canon requires exactly two
  rival houses; not folded into Naoyuki-as-internal-foil).
- **Marriage / adoption = a real lean late-game (T4/T5) Standing/Name lever** and a castle-town takeover route
  (LOCKED — restored; not cut).
- **🔁 Tier-gate shape** — was "simple per-tier required-pillar thresholds" (the floor+overflow formula
  rejected); **now SUPERSEDED by the HYBRID good/great/excellent profile** (Q7/FU10) under the **sequential
  Phase-1/Phase-2** model (FU7). The trade ≤⅓ cap survives as the only structural cap.
- **🔁 Estate stages E3–E5 parked** — **now E3 "Prosperous" is authored in v1** (estate grows E0→E3); only
  **E4–E5** remain parked (Q8).
- **🔁 Combat rank-gate rename** — the Arms rank-gate **"Combat Standing" → "Combat Rank"** (Q9); "Standing" =
  the 官威 pillar only; macronize *gōshi*/*rōnin*.
- **🔁 Single find-spot** — consolidated at the **jizō at the weir** where he was found (the lone
  residual-ambiguity beat co-located there; Q11).
- **Author-invented names/framing = CONFIRMED** (LOCKED — human sign-off received): **Otsuru** (grown Tama's
  name; substance "a girl who ran" was always canon); the **national *banzuke* as a *mitate*/parody broadsheet +
  sumo-rank vocabulary** (Maegashira/Komusubi for the attainable band, Ōzeki/Yokozuna for the sealed top); the
  **Naoyuki rival→brotherhood** in-house arc; **Rival House Tomita** lineage (head **Sōzaemon**, heir
  **Kageyuki**, agent **Yasubei**); **Rival House Akagi** (head **Gennai**).
- **Standing & Office pillar kanji = 官威 (*kan'i*)** ("authority of office") (RESOLVED at the **§5 authenticity
  pass**, 2026-06-25; the earlier coined 政威 was rejected).
- **Top-rung title = chief steward / *yōnin*** ("the lord's right hand") (LOCKED); aspirational *karō*/adoption
  vocabulary stays **narration only** for a modest *gōshi* house.
- **Romanization convention = macrons (proper Hepburn) project-wide** (LOCKED — Tōkichi, Yagōemon, Kyūsuke,
  *kyō-masu*, *gōshi*, etc.).
- **Estate T0 room/area reveals = SEPARATE** (LOCKED — stables, woodlot edge, and drill yard each reveal
  individually; no fold-into-forecourt).

### Genuinely-open items still flagged for the human

- **The *osso* petition's "whose neck" = SETTLED** (a *gimin*-martyr ally bears the lethal risk; the MC's hands
  stay clean — reconciled with partial-justice and the indirect ceiling). Listed here only for traceability; it
  is no longer an open question.
- **Balance values** — the per-pillar-per-tier **hybrid** thresholds (a full overhaul, back-solved against the
  fixed deed inventory), the rung-meter curve, the seasonal judged-result formula, conversion weights, and
  big-number formatting — deferred to §4 *(proposed v1 balance)*. (The *shape* is settled: hybrid
  good/great/excellent + sequential Phase-1/Phase-2 + trade ≤⅓ of Estate & Wealth; **no** floor/overflow
  arithmetic.)
- **Cross-section name-canon sweep** — the invented replacements for Toyama/Konoe (here **Hayami** / **Mukai**)
  and the renamed Mago/Naozane/Obaa Sato (here **Heita** / **Mosuke** / **Obaa Kuni**) must tie out byte-for-byte
  across §1.8, §5 cast, and the §6.6 real-name denylist in the final consistency sweep.
- **Final ADR numbering** — set at integration.

---


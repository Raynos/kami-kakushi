# Kamikakushi — Product Requirements Document (PRD)

> **Status: PRD V2.2 — reshaped from the 79 human-signed V2 decisions** (Block L `Q1–Q56` + Block M `FU1–FU23`)
> **+ Block N (32 post-battery) + Block N.1 (7); ADRs D-043/D-044/D-045**
> (2026-06-26; see [`2026-06-26-prd-human-feedback.md`](../../project/feedback/2026-06-26-prd-human-feedback.md) §§L–N). Per **ADR D-022 (governing)** these
> V2 decisions **supersede** any conflicting prior lock / canon / ADR — **most-recent-wins, annotate-don't-delete.**
> The V2 **LOCKED INTENT** is frozen per **ADR D-021** (the freeze-framing below); the §4 balance numbers and the
> §7 M2–M7 milestone detail stay **provisional** and are re-planned after each playtest. No code is written until
> §7 (the roadmap) is approved. *(Satisfied 2026-06-26: §7 approved → M0–M2b built & verify-green; M3–M7 provisional.)*
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
| 1 | Vision, pillars, factions, world & endgame | **PRD V2.2 — locked intent** |
| 2 | Systems & mechanics catalog | **PRD V2** |
| 3 | Incremental unlock ladder (UI-as-progression) | **PRD V2** |
| 4 | Combat, progression & balance model | **PRD V2.2 — numbers provisional** |
| 5 | Full act-by-act narrative & content | **PRD V2** |
| 6 | Tech architecture & data model | **PRD V2** |
| 7 | Milestone roadmap, v1 scope & deployment | **PRD V2.2 — M2–M7 provisional** |

> **FRAMING — the freeze line (ADR D-021, refines D-020).** Read this PRD as **LOCKED INTENT vs.
> PROVISIONAL IMPLEMENTATION**, *not* "vision vs. plan." **LOCKED INTENT (the destinations — frozen):** §1
> vision + the hard human constraints (no magic; mediocre start; trade ≤⅓; active-only v1; the four
> pillars; the estate spine) + the human-signed **acceptance criteria** tagged `LOCKED` in §4 — the
> **≥30-min-per-rank floor**, the **≈70/30 deeds/seasonal** split, the **≈28.5 h v1 budget** (a **FLOOR / minimum**,
> not a ceiling — D-016-as-annotated per FU18), and the **tier-gate TARGETS** (the V2 **hybrid good/great/excellent**
> pillar profile, Q7/FU10). **PROVISIONAL IMPLEMENTATION (the route — liquid, revised via playtest):**
> everything tagged `proposed v1 balance` (the §4 yields/levers/magnitudes) and the **§7 M2–M7** milestone
> detail — these *hit* the locked targets, so the levers move while the targets do not. The **v1 scope**
> (full **T0–T2**, no pre-planned descope — §7.4.2) is **orthogonal and still LOCKED**: it fixes *what*
> ships, not the provisional *how*. **Do NOT explode this doc yet** — **M0 + M1 build against this PRD
> as-is**; full sign-off and the one-time reorganisation come **after the first build-and-play cycle**, on
> ground that has survived contact with play. Then §1 + the locked constraints freeze as a tagged vision
> snapshot, §7 moves to a living `docs/living/roadmap.md` ("M0–M1 committed; M2–M7 provisional, re-planned after
> each playtest"), and the §4 numbers move to generated `docs/content/` tables. **M2–M7 are never frozen
> as canon** (per ADR D-021).
> *(Update 2026-06-26: the first build-and-play cycle is complete — **M0–M2b are built, verify-green and
> play-tested**, and the living roadmap now exists at [`roadmap.md`](roadmap.md). The remaining one-time
> reorg — freezing §1 as a tagged vision snapshot and moving the §4 numbers to generated `docs/content/`
> ([`content/t0-content.md`](../content/t0-content.md) already exists) — is the queued next step.)*

---

# §1 — Vision, Pillars, Factions, World & Endgame

> **PRD V2 — locked intent (D-021); reshaped per the V2 decisions (D-022 governing).** This section is authored
> end-to-end from the PATCHED locked-decisions canon
> ([`../brainstorms/2026-06-25-locked-decisions.md`](../../project/brainstorms/2026-06-25-locked-decisions.md), incl. its
> 2026-06-25 Round-A deltas), the three redesign discovery docs, **and the 79 human-signed V2 decisions** (Block L
> `Q1–Q56` + Block M `FU1–FU23`). It supersedes every earlier framing of §1 (most-recent-wins per D-022). Tiers are
> **T0–T4** (0-indexed) throughout; v1 scope is **T0–T2 complete**, with **T3 a stub cliff-hanger** (the
> **castle-town / Daikan's-Office first-contact** beat — Q24) and **T4 a roadmap**. The V2 spine locks these shapes:
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
   across **five influence tiers** (T0 estate → T1 village → T2 region → T3 castle-town → T4 Edo). Rising
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
   budget is a floor, not a ceiling; FU18). v1's *scope* stays focused: **T0–T2 complete**, an **~8-rung
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

Three starter factions span T0–T2, deliberately distinct in **shape** so they never read as one bar painted
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
Q15/FU13), surfaced one at a time on the **combat-reveal ladder** (below).

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
| **R7 — Bailiff of the home fields (*jikata-yaku*)** | labour→admin (as narration) | First reclamation recorded; the lord begins to notice; the MC takes on the home-fields *office* (his own quests/duties, not a management layer). | Field administration framed as the MC's own offices/quests; **the capstone OPENS Phase 2** — the four-pillar **estate-influence grind** — with **House Influence made visible** (the standing panel, showing the **revealed** pillars: at T0 that is **Arms + Estate**; §1.6.4/§2.16(e)); cash-crop levers; the **tier-expansion map**. Clearing T0's **hybrid pillar profile** (Arms + Estate; §1.6.3) is what **tiers up to T1.** |

**T1 — The estate's domain expands into the valley (~8 rungs; a fresh ladder, not a continuation of T0).**
The HOUSE's standing climbs **friendly → TRUSTED**, and its domain grows from bare *survival* to **anchoring its
valley**. Rank is still a rung **within the house's theme**; at every rung you act **FOR THE ESTATE** across the
village + estate + surrounding roads. Labour and combat keep interleaving, now reaching past the estate gate.
The rung-meters **reset per rung** afresh, T1 grows the weapon roster **+3** and opens the **2nd combat line**
(on a **Combat Rank** rung-gate), and **T1's Arms-pillar deeds accrue only in T1's Phase 2** (FU7).
*(The **village reputation web** — §1.5.2 — runs **alongside** this as a parallel **optional accelerant**, never
a gate; see §1.5.4.)*

| Rank | Track | How earned | Unlocks |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | labour | The house trusts him to carry its business past its own gate into Asagiri; first village errands. | The market/shop row; coin; the village reputation web seeds (optional). |
| **V1 — Recognised hand of the house** | mixed | The valley begins to know the house's man (headman + shops acknowledge him); combat keeps pace clearing valley pests/animals. | The chief's house; deeper satoyama rings; the inn & rumours board (side). |
| **V2 — Road-warden (*michi-ban*) for the house** | combat | Make a stretch of valley road or the ford safe in the estate's name; survive a real bandit/animal clear. | Road-security duties; **HUNT/CLEAR** at valley scale; better loot/craft tiers; the **2nd combat line** opens here (a Combat Rank rung-gate; +weapons across T1). *(Arms-pillar deeds accrue in T1's **Phase 2**, not on the rungs.)* |
| **V3 — The house's steward of the valley economy** | labour | Bring the valley economy and the estate's cash-crops to a recorded seasonal result. | Cash-crop and trade levers (the silk/sericulture *meibutsu* sub-engine begins — the trade strand opens at T1, never T0); the broker meters. |
| **V4 — Trusted of the headman** | mixed | Put a valley fire out on the estate's behalf (Magobei's skim surfaces here); win the headman's regard (personal regard is a side accelerant). | The headman's roll-up quests; the doctored-ledger thread; first **Office** standing (the Office pillar reveals at T1). |
| **V5 — Sworn man-at-arms of the house** | combat | Stand a real watch for the valley in the house's name; weapon-line milestones; survive the first dangerous-road encounter. | The first paid martial outsiders (Gohei & Yatarō) recruited as flavour retinue; defence of the valley. |
| **V6 — Right-hand-in-waiting (agent over the valley)** | mixed | The lord first believes the house's impact beyond the estate is possible; "clean your room" nearly done. | Authority across the valley; the alliance/standing levers that point at the region. |
| **V7 — Agent of the house, the valley anchored** | labour→admin (as narration) | Estate healthy, valley anchored under it, immediate fires out — the capstone "clean your room" beat. | The **region** map and the **T1→T2** quest; the capstone **OPENS T1's Phase 2** (the pillar grind across **Arms + Estate + Office**); clearing T1's **hybrid profile** bridges to **T2** (the domain expands again, to the Region). Rival samurai houses appear. |

**T2 — Region ladder (v1 scope; enumerated as a per-tier ladder).** v1 completes T2, so its ~8-rung ladder
ships too: the estate's domain expands again — a region-facing hierarchy framed as **the house's** agent over an
ever-larger domain (e.g. the house's **valley-envoy → road-captain of the cluster → broker of the post-town
trade → arbiter between valleys → recognised regional retainer → captain of the road-security detail →
alliance-broker → leading house of the region**), estate standing climbing **trusted → HONORARY MEMBER of the
house**, still interleaving labour and combat, with the **rival houses Tomita & Akagi** as the region's
incumbents to surpass (G7 = the rivals dethroned). T2 grows the weapon roster **+4** and opens the **3rd combat
line**, and **T2's Arms-pillar deeds accrue only in T2's Phase 2** (the revealed-pillar set reaches **4**, +
Name surfacing; FU7). The **personal-mystery payoff** (Kuzuhara on the spine; the origin reunions incl. father
**Jinpachi** + the lost-child truth on the **Origin one-tier rep side-track**, `O0→O5`) lands across it. Exact
rung copy is detailed at §3.6 (the unlock ladder); the **shape** — fresh ~8-rung ladder, combat woven
throughout — is locked here. T3/T4 ladders are **scoped forward** (T3 stub, T4 roadmap).

**Combat progression — incremental weapons + the reveal ladder (the §1-level shape; detail at §2.8/§4).**
Combat in V2 is a real **incremental progression surface**, not a single switch flipped at T0:

- **The growing weapon roster.** T0 **starts with exactly one** weapon and unlocks **+2** across the tier; T1
  adds **+3**, T2 adds **+4** — **~9–10 weapons across v1**, spread over **3 archetype lines**, each weapon an
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
mechanical gift from remembering**, and it **NEVER gates the spine**. Its rungs walk the reunion in sequence:
recognised at the post-town → the household reopens (mother **Oyuki**, sister **Okimi**) → the old trade
welcomes him (employer **Denbei**, friend **Kanta**, the porter-guild) → the half-remembered tie (sweetheart
**Osen**) → the estranged father reconciled (**Jinpachi**) → **his own name reclaimed — "Tahei" set down (the Origin
capstone, O5).** This O5 name-reclaim is **earned and *missable*** (a player who skips the Origin track may
never reclaim it) — and is **separate from** the lost-child **TRUTH** (that he is *not* Tama; **Otsuru** is),
which is **spine-guaranteed at G6 for every player** regardless of the Origin track (Q5/D-036). *(Father
**Jinpachi** is re-added per the Round-A lock — renamed from the colliding "Kuranosuke" to a clean period name;
he is **alive but long estranged** (away on the *kaidō* for years), so his beat is a **reconciliation**, **not**
a second return-from-the-dead — only the MC is that for this family (D-Q-Oyuki). He resolves at T2 with an
optional later emotional callback at T4 — see §1.9, §1.11.)*

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

**Separate earned meters** keep these from collapsing into one bar. The **estate spine** is gated, **per tier**,
by **two rung-meters** in **Phase 1** — **Estate Service** (labour) and **Combat Rank** (martial; *renamed from
"Combat Standing"*, Q9) — each **per-rung-reset** (FU6) and **AND-gated** with that rung's story milestones;
then, in **Phase 2**, by the separate **four-pillar hybrid tier-gate** (§1.6.3/§1.6.4). Distinctly, the **combat
systems feed THREE clean, separately-stored tracks** that must never collapse into one: **(1)** kills/combat-XP →
the **character (combat) level** (HP + attribute points + satietyMax); **(2)** recognised **deeds** → the **Arms
pillar** (House Influence, Phase-2-gated); **(3)** per-rung curated activities → the **Combat Rank rung-meter**
(the martial rung-gate above). Alongside the spine sit the optional side-track meters: **Village Reputation**
(gentle per-node meters — the T1 side-track) and **Origin Ties** (the T2 side-track's own `O0→O5` rung meter).
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

### 1.6.3 The five tiers, transition story gates & per-tier pillar gating

Tier-up is **not** crossing a single band, and it is **not** the old "simple per-tier required-pillar
thresholds" (that framing is **superseded** by the V2 decisions, Q7/FU10/D-022) — nor the even older
balanced-development floor + ≤25% overflow (which stays rejected). Instead, V2 gates each tier on a **HYBRID
"specialisation" profile across the pillars REVEALED by that tier**: you must be **good in ALL revealed
pillars**, **great in 2–3**, and **excellent in 1–2** (**no** overflow substitution; **breadth required,
specialisation rewarded**). The semantics: **good = the expected baseline · great = really strong · excellent =
above-and-beyond** (FU10). The **revealed-pillar set grows per tier**: **T0 = 2** (Arms + Estate — a **2-pillar
special case**: good in both, one of them excellent), **T1 = 3** (+ Office), **T2 = 4** (+ Name) — the gate is
**only ever checked against revealed pillars** (never "good in ALL" against an unrevealed one).

This sits **after** the **sequential** climb (§1.5.1/§1.6.4): **Phase 1** — climb **all** the tier's rungs
(the per-rung rung-meter + story AND-gate); **Phase 2** — the estate-influence/pillar grind unlocks and the
**hybrid pillar profile** above is what tiers up. The required pillars still **drift** as they reveal — early
tiers lean **Arms + Estate** ("survive and get strong"); upper tiers lean **Office + Name** ("win it socially").
The **per-pillar-per-tier thresholds need a full OVERHAUL** (not simple ratios) — **back-solved against the
fixed §4 deed inventory** — so **exact numbers are deferred to §4** *(proposed v1 balance)*. The only structural
cap that survives is the **trade sub-engine ≤⅓ of Estate & Wealth** (so trade can never carry a gate;
cross-pillar combos are computed **post-clamp** and **excluded** from this gate-check). Side factions are
**multipliers** into the pillars, never new pillars. The full five-tier climb is paced over a
**generational/decadal in-world span** for the upper tiers (T3→T4), so "restore *and* surpass" reads as earned
over years.

| Tier | Theme | Transition story gate (entry) | Phase-2 pillar profile (good/great/excellent) |
|---|---|---|---|
| **T0 — Estate** | Earn your keep and a place at the table (standing **stranger→friendly**). One declining hill estate, unlocked room by room. | *(Met at the open.)* Survive convalescence and the first labour. | **2-pillar special** (revealed: Arms + Estate): **good** in both, **one excellent** (humbling first fight survived; first *shinden* begun; *kura* solvent — LAND/TREASURY deeds, **no market yet**). |
| **T1 — The Valley** | The estate's domain expands to **anchor its own valley** (standing friendly→**trusted**): Asagiri's shops, craftsmen, inn, shrine and the legend run as an **optional side-track**. | **T0→T1:** do enough estate work + complete **basic repairs** → the estate sends you out into the valley. | Revealed: Arms + Estate + **Office**. **Good in all three**, **great in 2** (errand-authority; the headman's regard; cash-crops online). |
| **T2 — Region** | The estate's domain expands to **lead a region** (standing **trusted→HONORARY MEMBER of the house**): a cluster of valleys, the post-town, the upstream Kuzuhara ruins, roads, *sekisho* — with the **Origin** family/friends as a one-tier rep side-track (own rungs). | **T1→T2:** **"clean your room"** (estate healthy, village happy, immediate fires out) → the lord first believes impact beyond the estate is possible → a quest to grow **regional influence**; the region's **rival houses Tomita & Akagi** are the incumbents to surpass (G7 = rivals dethroned). | Revealed: Arms + Estate + Office (+ **Name** surfacing → 4). **Estate + Office great/excellent**, **Arms good**; the **personal-mystery payoff** lands here. |
| **T3 — Castle-town** *(stub in v1)* | The estate's domain expands to **become a castle-town power holding key domain offices** (standing **honorary member → chief steward / *yōnin*** — the MC's personal CEILING): the *daikan* / *tedai* officialdom and inter-*han* markets acknowledge, contend with, and cede to the house. | **T2→T3:** **win the region** (rival houses no longer the leaders) → the castle-town rulers **confer regional leadership** and **invite** the house in. *(v1 ends here, on the **castle-town / Daikan first-contact** cliff-hanger — Q24.)* | **Office + Name excellent** (the takeover is won socially); Arms/Estate as leverage. |
| **T4 — Edo** *(roadmap)* | The **HOUSE** rises to **national standing — ranked at the capital** while the **MC stays *yōnin*** (the arc is the house's, not the man's; indirect/mediated Edo ceiling, canon §F / D-010): restore **and** surpass the grandeur of three generations ago. | **T3→T4:** a **"taste of Edo"** — the house is **called to staff & run the *domain's* Edo establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence → the **national** tier. | **Name + Office excellent** (the national *banzuke* ranking on all four pillars). |

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
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the hybrid profile) |
| **The Combat Rank rung-meter** | **per-rung curated** combat activities | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate |

So: **one kill** → character-level XP; **one recognised deed** → Arms; **one curated rung activity** → the
Combat Rank meter. *("**Combat Rank**" renames the old "Combat Standing", Q9; "**Standing**" now means the
**官威 Standing & Office** pillar **only**.)* **Labour conditioning** stays the **zero-stat enablement gate** on
the combat rungs — orthogonal to, and never a back-door past, the small bounded **per-skill combat perks**
(Q6/FU8): conditioning is **weak→capable**; the perks are a small **capable→a-bit-more-capable** polish.

**(3) The hybrid Phase-2 tier-gate (D-028; Q7 / FU10).** Phase 2 tiers up on the **good/great/excellent** profile
**over the pillars revealed by that tier** — **good in all revealed · great in 2–3 · excellent in 1–2**, **no
overflow** (T0 is the 2-pillar special case). Revealed set: **T0 = Arms + Estate**, **T1 = + Office**, **T2 = +
Name** (4). The per-pillar-per-tier thresholds are a **full §4 overhaul** back-solved against the fixed deed
inventory; trade stays **≤⅓** of Estate & Wealth as the **only** structural cap, with cross-pillar combos
computed **post-clamp** and excluded from the gate-check.

Together: **climb the rungs (Phase 1: rung-meter + story) → unlock and grind the revealed pillars (Phase 2) →
clear the hybrid profile → tier-up.** Every reveal along the way is **design-staggered one-at-a-time** (no
runtime reveal-queue; FU4).

## 1.7 World & areas — v1 IMMEDIATE (T0–T2)

The estate-rank climb spatially **embodies** the tier escalation: you start trapped in one storehouse room and
earn the rest of the estate room by room (the rank ladder made of doors), then the village, then the
wilderness (by conditioning), then your own past (by memory). Each tier opens a fresh, larger canvas — **no
reset** — and every frontier is **itself incremental** (arrive minimal, learn its people and systems). The
wilderness is a **shared danger gradient gated by conditioning**, distinct from the Influence-tier authority
canvas. v1 ships **full maps** for T0–T2 within a **~6–8-node cut-set** (the rest parked in §1.7.1). Areas live
in a **data-driven registry** (`content/world.ts`) with **unlock predicates** over GameState — reinforcing the
data-driven, headlessly-testable framing (Q55).

| Area | Region (tier) | Faction | Notable locations | Unlocks when |
|---|---|---|---|---|
| **The Kura Storehouse** | Kurosawa Estate (T0) | Estate | The convalescence pallet; spilled rice to rake | At the open (R0, Stray). Home of the UI-reveal engine (body/rest bar, rice counter). |
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate (T0) | Estate | The *genkan*; the visitor's mat | R1. The diegetic stage for promotions and the Tama-vs-farmhand framing. *(LOCKED: T0 room/area reveals are SEPARATE — the stables, woodlot edge, and drill yard each reveal individually, not folded in.)* |
| **The Home Paddies & Dry Fields** | Kurosawa Estate (T0) | Estate | Fallow plots to reclaim; the granary | R1; *shinden* reclamation begins around R4. The rice/*koku* heartbeat (active grind, not idle producers). |
| **The Drill Yard** | Kurosawa Estate (T0) | Estate | Training posts; Kihei's weapon rack | **R3, after the humbling first fight (combat live from T0).** Conditioning & idle-combat. |
| **The Main House / *Omoya*** | Kurosawa Estate (T0) | Estate | Kitchen & inner rooms; the household shrine; the lord's study (ledgers) | R4 (houseman); the study at R7 (bailiff). |
| **The Market / Shop Row** | Village of Asagiri (T1) | Village | Smith Gonta's forge; Obaa Kuni's herb stall; Brewer Tokuemon's; Weaver Onatsu's (silk) | T1 (estate trusts him to run errands; from T0-R6 / village V0). Per-shop reputation meters. |
| **The Chief's House** | Village of Asagiri (T1) | Village | Yagōemon's receiving room; the village ledgers | T1, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
| **The Inn & Rumours Board** | Village of Asagiri (T1) | Village | The rumours board; the common room | T1. Sukezō's inn — hub for optional light folklore side-quests (unlocked organically). **None gate tier progression.** |
| **The Shrine / Temple** | Village of Asagiri (T1) | Village | The shrine (*shimenawa*); the temple register; the Bon offering site | T1. Priest Ryōa's register of the vanished (a mystery clue). |
| **The Jizō at the Weir** | Satoyama & Mountains / Asagiri boundary (shared, T0–T2) | Village / neutral | The boundary *jizō* **at the weir where he was found**; an offering left by an unknown hand | T0–T1, gated by conditioning. **The single find-spot** (Q11) — where he was pulled from the river — and the **one** capped residual-ambiguity beat (the unknown-hand offering lingers unresolved). |
| **The Near Satoyama** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | Foraging groves; the bamboo stand | R2/T0, gated by conditioning. First ring of the danger gradient. |
| **The River, Ford & Weir** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | The ford (the "kappa" spot); the weir | T0–T1, gated by conditioning. Fishing + the "kappa" thread (undertow + smugglers' sinking-spot). *(The find-spot **jizō at the weir** is its own row above — the lone residual-ambiguity beat is co-located there; Q11.)* |
| **The Foothills & Charcoal Grounds** | Satoyama & Mountains (shared, T0–T2) | Shared wilderness | The hidden charcoal kiln ("fox-fire"); hunting trails | T1, deeper conditioning. Second danger ring. |

## 1.7.1 World & areas — LATER (T2 deep + T3–T4 expansion; parked, not cut)

Parked per the lean discipline (§1.2 pillar 3): designed but **not authored as full areas in v1.** Per the
world-expansion cut-set, beyond the three starters a sane buildable set is **~6–8 nodes** that reuse the
existing cast and pay off the spine directly.

| Node | Tier | Kind / role |
|---|---|---|
| **Kuzuhara — re-foundable upstream hamlet & embankment river-works** | T2 | **Spine.** The faction-3 fusion: the drowned hamlet — the house's own **root-sin** (ancestor Sadamune's neglected flood-works) — becomes a resettlement node + the embankment (*seki*) river-works that secures the disaster. Access-only, grind-built; the player **names the drowned** and re-founds the hamlet. **No personal tie to the MC** — his origin/backstory and the lost-child evidence resolve via the **dream → the Sawatari-juku family** (§5 T2.2/T2.5), not here. |
| **Sawatari-juku & the wider post-town region** | T2 | **Mixed.** The origin reunion hub (optional — **Tahei's living family**) + the *toiya* transport office / waystation trade layer (the practical surplus-export runway to T3). |
| **Yanagi-watari — down-valley river-crossing market town** | T2 | **Spine (personal-mystery).** A second post-region locale a day **down**-valley (distinct from Sawatari-juku, which is up the *kaidō*) — a busy river-crossing market where a runaway child could vanish into the crowd. **Where the grown Otsuru (the real Tama) is found** — the **G6 lost-child TRUTH** locale, deliberately **separated from the origin-reunion hub** so the two T2 personal threads don't both land in Sawatari-juku (D-Q-otsuru-locale; authenticity spread > narrative economy). |
| **The Kaidō Porters' & Transport Guild** | T2→T4 | **Spine-thin.** Routes, *sekisho* pass-tiers, route-risk — the trade backbone. Met via friend Kanta's first favour run. *(The **v1 stub ending is NOT** this node — see the Daikan's Office row below; the porter-guild first-contact framing is dropped, Q24.)* |
| **The Rice & Silver finance network** | T2→T4 | **Spine-thin.** The conversion engine: village broker → regional warehouse → *Marutaya* debt-restructuring → *goyōkin* → Osaka/Edo *fudasashi*. |
| **The Neighbouring Valleys** | T2 | Side. **Hard-capped at exactly two named valleys (Hibara + Tōge-mura)** — Asagiri fractally replicated, slimmer. Courting them is an optional accelerant. |
| **The High Mountains & The Pass** | T2–T3 | Shared wilderness, top of the conditioning gradient. The lethal terrain where his caravan died; the "one-eyed mountain god" (= Hanzaki + fog-blind terrain). |
| **The Daikan's Office (castle-town officialdom)** | T3 | **Spine-critical** for formal T3 recognition **and the v1 STUB ENDING**: v1 **closes on the castle-town / Daikan's-Office first-contact cliff-hanger** (Q24 / D-040). The racket's nerve-centre; where most T3 Influence is minted. No folklore here — the rational, ledgered counter-world. |
| **The *domain's* Edo *yashiki* / *rusui-yaku* + *sankin-kōtai* conduit (one cluster)** | T4 | **Spine.** The mediated capital conduit — the house **staffs & runs the domain's establishment** (rusui **Mukai** — *invented surname; the real "Konoe" is a regent-house name, removed per Q27*) under the **daimyō's** biennial *sankin-kōtai* (never its own) — with the **Nihonbashi/*banzuke*** payoff (**Nihonbashi** is an explicitly **allow-listed** real place name, Q12) and the **touring-inspector set-piece** folded in as its two payoff beats. |

> **Marriage / adoption-into-higher-status is a REAL late-game (T3/T4) lever (NOT cut).** Kept lean — a
> grounded alliance/status move (not a relationship or people-management sim) that lifts **Standing & Office**
> and **Name & Honour** and is one of the **multi-route castle-town takeover** paths. It threads through the
> T3/T4 nodes above (the *daikan*'s office, the Edo conduit) rather than being a node of its own; details at
> §3/§5.
>
> **Cut for now (reintroduce later, "start lean, add back"):** the Matagi hunters, the Pilgrimage Order, and
> the Scholars-&-Physicians as a *network* (keep Sōan / Obaa Kuni as the existing seed only). **Estate stages
> E4–E5** (fortified seat → restored-and-surpassed) stay parked — **E3 "Prosperous" is now authored in v1**
> (§1.5.1; Q8).
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
| **Foreman Magobei** | A skimming village foreman — the "tanuki" of the rumours board. | The **T1 antagonist** and first hard thread into the rice-quota pattern (a doctored measuring-box). Reachable and human. |

### Origin (side) — Sawatari-juku & Kuzuhara *(unlocks at T2)*

| NPC | Role | Function |
|---|---|---|
| **Jinpachi** | Tahei's father, ~50; a senior porter long away on a far stretch of the *kaidō* — **alive but long estranged** from the household. | **Re-added per Round A** (renamed from the colliding "Kuranosuke"). Grieved his lost son; the source of the porter's-knot lineage (**ZERO bonus**). His beat is a **reconciliation with an estranged living father — NOT a second resurrection** (D-Q-Oyuki: only the MC returns from the presumed-dead for this family). It **resolves at T2** alongside the rest of the family, with an **optional later emotional callback at T4** (the recovered family proud behind the MC). *(The **Tahei NAME-reclaim** is a **separate** Origin **O5** capstone — earned + missable — not this father reconciliation; Q5.)* |
| **Oyuki** | Tahei's mother, ~45. | Emotional core of the origin thread — grieved her **son** (the MC) as dead, **the family's one genuine return-from-the-dead**; the reunion is the warm payoff, kept earned and a little costly. |
| **Okimi** | Tahei's elder sister, ~20; married into a trading family. | The concrete **trade-tie** that lets the origin town supply and route goods for the expansion. |
| **Master Denbei** | Tahei's old employer, ~55; runs the transport-and-goods house. | Supplies porter/logistics know-how and legitimate manifests; the grounded source of the porter's-knot identity (**ZERO bonus**). |
| **Kanta** | Tahei's childhood best friend and fellow porter, ~18. | Comic-warm friendship rekindled; the first porter contact and recruitable lead carrier. |
| **Osen** | A sweetheart Tahei half-remembers, ~17. | Optional relationship thread the dream surfaces; grounded and gentle, narrative-only. |
| **Otsuru (the real Tama)** | The "spirited-away" child, alive and grown **down-valley in Yanagi-watari** (a river-crossing market town — deliberately **not** the origin-reunion hub Sawatari-juku; D-Q-otsuru-locale). | Mystery payoff & living proof — a girl who **ran** from a violent stepfather and a near-sale for debt. **Her truth / living-proof is spine-guaranteed at G6 for every player** (Q5). Reunion kept **costly and incomplete** (she may not forgive). **"Otsuru" is LOCKED** (the substance — a girl who ran — was always canon; the name is now confirmed; deliberately distinct from sweetheart **Osen** to avoid confusion). |

### Region / Castle-town / Edo — antagonists, rivals & apex authority *(T2+, mostly parked)*

| NPC | Role | Function |
|---|---|---|
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" of the pass. | The **T2 dangerous combat beat** and the **talent-gone-rotten mirror** — edge **trained and brutal, never innate**; survived by labour-built endurance, never out-talented; muscle-for-hire (often Tomita's). |
| **Rival House Tomita** (head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei**) | A competing *gōshi*/merchant house that prospered as the Kurosawa fell. | The **primary, persistent regional STATUS rival** (T2→T4) — capital + connections + ruthlessness, **never innate gift.** Out-maneuvered commercially/socially, **never killed** (détente, alliance, or clean defeat). *(LOCKED: house "Tomita" plus the lineage — head **Sōzaemon**, heir **Kageyuki**, agent **Yasubei** — are confirmed.)* |
| **Rival House Akagi** (head **Gennai**) | An older, prouder, declining samurai line — prestige without coin. | The **second rival house** (canon-required): contests the region on **honour/precedence** while Tomita contests on money — so the two can be played against each other. |
| **Tedai Kuroiwa** | The magistrate's agent (*tedai*) — the gracious facilitator who *records* your achievements. | The **T3 primary human antagonist** — outwardly an ally, secretly the local architect of the rice-quota skim. **Defeated by evidence, not violence.** Sits beneath Daikan **Iemasa** and above clerk **Mosuke** (the crack). |
| **Daikan Iemasa** | Deputy magistrate; incurious, status-conscious, not personally corrupt. | Signs what Kuroiwa hands him; **largely escapes** — the honoured ceiling. |
| **Clerk Mosuke** | A guilt-sick junior clerk. | The crack in the cover-up; supplies documentary proof; a reachable conscience. *(Renamed off the **Naoyuki** collision — Q39.)* |
| **Junkenshi Hayami Saemon-no-jō (the Touring Inspector)** | A senior shogunal inspector. | The **T4 impartial judge** — the apex human authority whose survey validates or threatens everything the house built. Not a villain; the antagonist-shaped *test*. The **lord** faces him; the MC stands at the back. *(Surname **Hayami** is invented — the real "Toyama" is removed per Q27.)* |
| **Echizen-ya Sōbei (the Edo factor)** | An Edo money-broker (*fudasashi*-adjacent) who launders the skimmed silver. | The **untouchable apex** of the quota machine — glimpsed, named, **never reached.** The antagonist as *system*. |

## 1.9 Side-threads — identity, origin & the dream rule

Two grounded side-threads run quietly beneath the spine; both pay off only in **feeling, allies, and flavour,
never power**, both resolve to human causes with no magic, and **both resolve at the Region tier (T2)** —
T3/T4 carry the house's power rise.

**(A) The Tama-vs-farmhand allegiance & the lost-child truth.** The valley grieves a child, **Tama**, taken
ten years ago; a half-drowned, memoryless young man reads to them as Tama returned. The estate disbelieves
it. This split powers the continuous **allegiance leaning** (§1.5.4): rates, flavour, and which quest-givers
open first — **never** stats, drops, production, or availability. "What happened to Tama?" is a **suggestion +
a story the player discovers in the world** (a sandal left yearly at the jizō-at-the-weir; a household that
flinches at her name; the legend "remembering" a boy; a debt-ledger mention; a post-town sighting). **The
truth:** Tama was a **girl** (the gender-drift is the fair clue) who **ran** from a violent stepfather and a
near-sale into service to clear a debt; she has been alive and grown the whole decade **down-valley in
Yanagi-watari** (a river-crossing market town a day the *other* way from the origin hub Sawatari-juku — the two
T2 personal threads sit in **separate locales** by design, D-Q-otsuru-locale), living as **Otsuru**, too
ashamed to return — a quiet **"presumed dead → back from the dead"** that mirrors the protagonist's own. Resolution is grounded and **partial** (she may not forgive). The MC is **not** her. **This
Otsuru/Tama TRUTH is spine-guaranteed at G6 for every player** (Q5/D-036) — independent of the optional Origin
track.

**(B) The grounded true-origin thread.** His real past is mundane: his true name is **Tahei**, a young
porter/errand-hand for a small transport house in **Sawatari-juku**, with **living** family and friends
there — father **Jinpachi**, mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**,
sweetheart **Osen** — all of whom **grieved him as dead** (his own "presumed dead → back from the dead").
*(The father **Jinpachi** is the deliberate exception: **alive but long estranged**, away on the *kaidō* for
years — his T2 beat is a **reconciliation**, **not** a second presumed-dead return, so **only the MC** comes
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
father *reconciliation*) RESOLVE at the Region tier (T2)**; the T4 epilogue carries only an **optional emotional
callback** (the recovered family proud behind him — §1.11), never a second mechanical payoff.

**The dream rule (enforced in writing *and* code):** returning autobiographical **memory only** — never
clairvoyance, **ZERO mechanical bonus**. **Memory-only** (only things he lived; the "voice in the water" is a
real person recalled, not a spirit). **Zero mechanical bonus** (memory grants access, not power). **Guaranteed
cadence** (at least one fragment within a capped number of in-game days OR a skill/standing threshold; at least
one origin beat always available without reputation-gating, so the thread never goes cold). All variance flows
through the one seeded RNG; cadence is headlessly regression-testable.

### Per-tier side-quest list

| Tier | Side-quests (open-ended; never gate the spine) |
|---|---|
| **T0** | The spilled-rice recovery; the porter's-knot beat ("you've hauled before"); first dream fragment; Dowager Toku's first memory of the fall. |
| **T1** | The inn rumours-board opener (the "kappa" of the ford = undertow + smugglers' sinking-spot); Magobei's skim (the "tanuki"); a per-family goodwill help; Priest Ryōa's register entry; the jizō-at-the-weir offering (the one residual-ambiguity beat); a first **Naoyuki rivalry→grudging-respect** beat (so the G5 ally-flip is earned; Q26). |
| **T2** | The lost-child truth (Otsuru) resolves and is **spine-guaranteed at G6**; the origin reunions (Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen); the **Origin O5 name-reclaim ("Tahei")** as the optional, missable capstone; Kuzuhara re-founding + naming the drowned; the "one-eyed mountain god" = Hanzaki investigated; the fox-fire ridge = a hidden charcoal kiln. |
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
**T3 stub**, Q24 / D-040) — **not** the porter-guild node; the full T3/T4 endgame below is the **roadmap
vision**, not a v1-shippable tier.

| Tier | Antagonist | What they block | Reveal | Resolution |
|---|---|---|---|---|
| **T0 — Estate** | **The Inherited Debt** (personified only by tired pawnbroker **Moneylender Tōkichi**; *a circumstance, not a conspirator*). | The estate is dying of compound interest from grandfather **Sadamune's** failed embankment-venture, plus thin harvests and a cracked kura. Can't leave until the immediate fires are out. | A leaning gate and a red ledger; clerk **Tanomo** drips "we owe coin" → "the interest is the problem" → Dowager **Toku**'s memory that the root is Sadamune's own failure, **not anyone's crime.** | Purely economic. **Peaceful:** out-grind the interest and renegotiate. **Assertive:** refuse the worst terms, force a fair table by proving solvency (no fight). Restructured, not erased; the house's **root-sin** it atones for at Kuzuhara — emotional payload, **no antagonist.** |
| **T1 — The Valley** | **Foreman Magobei**, the "tanuki of the rumours board" — skimming rice with a doctored measuring-box (*kyō-masu*). The first, small human antagonist. | The T1→T2 gate needs the village happy; his skim keeps stores short and steals the surplus you need; he's the "tanuki" folklore beat. | The board's "rice-thieving tanuki" → one load measuring short twice → the doctored *masu* → the thread runs up to Headman **Yagōemon**, whose ledgers cover Magobei. Dawning unease, then a box of rigged wood. | **Peaceful:** expose the skim, Yagōemon makes restitution and keeps his post in disgrace. **Assertive:** force Magobei off the books (his hired muscle is the first small brawl). **Partial:** Magobei answers; better-connected Yagōemon mostly escapes with a quiet rebuke. |
| **T2 — Region** | **Rival House Tomita** (spine antagonist) + **Rival House Akagi** (the foil), with **Hanzaki** as the road's teeth. | "Win the region." Tomita underbids deals and courts the same valleys; Akagi blocks the upstart Kurosawa on **precedence**; Hanzaki makes the trade pass unsafe. | Tomita first a *name* underbidding one deal → agent Yasubei → the head. Akagi first a *snub* → a precedence dispute → Gennai. Hanzaki: rumour → a survived-not-won encounter → a recurring duel nemesis (**trained, never gifted**). | Multi-route. **Peaceful/commercial:** out-supply and out-arbitrate valleys; settle Akagi by *restoring its honour*. **Assertive:** secure the pass with a hard-capped 2–3-man detail; break the brigand roost; out-leverage Tomita's brokers. Tomita is **never killed**; the **G5 ally-flip** — heir **Naoyuki** turning against Tomita beside the MC — pays off the authored **T1/early-T2 rivalry→respect beat** (Q26); a famine-band under Hanzaki can be **fed/resettled.** **The personal-mystery payoff lands here.** |
| **T3 — Castle-town** | **Tedai Kuroiwa**, the gracious door — the magistrate's agent who *records* your achievements and secretly architects the rice-quota skim. | The gate is the rulers conferring leadership + inviting the house in. All T3 Influence is *minted by officialdom*, and Kuroiwa controls that gate (slow-walks recognition, misrecords yields, routes the rigged-quota friction). | The polite junior clerk who keeps you waiting → the facilitator who records your service (seems an ally) → a yield misrecorded "by error" → Mosuke's flinch → the rigged *kyō-masu* at the weighing-yard cross-referenced against quota ledgers. The gracious man at the gate **is** the rot. *(v1 reaches only the **first-contact** beat of this tier — the stub cliff-hanger.)* | Multi-route, **partial justice.** **Peaceful:** outgrow him — become the dominant house holding key offices (Marutaya credit, a graded *meibutsu*, samurai-society standing) and make his skim irrelevant; **you need not prosecute him at all.** **Assertive:** mount the **osso over-the-head petition** on proof — Kuroiwa answers; **Daikan Iemasa largely escapes**; the petition's lethal risk falls on an **ally / *gimin*-martyr**, not the MC. "Take over" = dominant house, **never rebellion.** |
| **T4 — Edo** | **The Edo factor, Echizen-ya Sōbei** (untouchable apex, laundering the silver) + **the Touring Inspector** (the impartial test). | The factor blocks *full justice* (the trail dies in Edo). The inspector blocks *final recognition* (only a house whose record survives the survey earns the mediated merit-commendation). | The factor a single glimpse (rusui **Mukai** forwards a dispatch; a manifest dies at his name — you learn *who*, and that you can't touch him). The inspector: rumour down the *kaidō* → a looming date → the staged set-piece where the **lord** faces him and the record is read aloud, MC at the back. | The inspector set-piece is **won or dented**, not fought (a recoverable dent on neglect, never a wipe). **The factor escapes** — the deliberate, honoured incompleteness: reachable culprits answered at their tiers; the truly powerful walk. The win is **the house restored and ranked**, the rot's apex still out of reach. Bittersweet by design. |

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
the daimyō's confidence won, rivals subordinated — never killed by the player, never rebellion). The late-game
**anti-slump / variety** leans on **cross-pillar combos + seasonal-reward rotation** (Q22/Q20/FU20), with trade
held out of the finale spine. The T4 Edo climax is a **national multi-pillar *banzuke* ranking of the HOUSE** on
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
- **R7 (capstone)** — **OPENS Phase 2**: the four-pillar **estate-influence grind**; the standing panel made visible (the **revealed** pillars — **Arms + Estate** at T0); cash-crop levers; the tier-expansion map. Clearing T0's **hybrid pillar profile** (§1.6.3) is what **tiers up to T1.**

**Combat-reveal ladder (incremental; one reveal per beat — FU12/FU13):** **R3** single starter weapon + bare
auto-resolve + retreat + Bestiary → **R4** graded **durability** bands → **R5** **stance** slot → **first
weapon-L10 milestone** the **ability + item** slots → **T1** the **2nd combat line**, **T2** the **3rd line.**
The **weapon roster grows incrementally** alongside: **T0 +2 / T1 +3 / T2 +4** (~9–10 across v1, each an
archetype + signature ability). Detail at §2.8/§4.

**T1 — the estate's domain expands into the valley (a FRESH ladder, V0→V7):** the tier opens minimal (one
contact, one shop) and progressively reveals — as the *house's* reach grows — the market/shop row → chief's
house → road-security & valley-scale combat → the silk/sericulture *meibutsu* sub-engine → first Office standing
→ the **region** map and the T1→T2 quest. The **village reputation web** (shop meters, the inn & rumours board)
fans out **alongside** as a parallel **optional** side-track, never a gate (§1.5.4, §2.15). **T2 mints another
fresh ladder** the same way (the domain expands again, to region scale; the personal-mystery payoff lands across
it). Each tier is the same **Phase-1-then-Phase-2** motion repeating, never an eight-rung-and-done staircase.

Because the climb is **active-only with no offline progress**, time is an **abstract clock advanced by active
play** (days/seasons drive harvest/weather/festivals and the seasonal **judged** Influence results — fired on a
**new high-water mark**, never a repeatable per-season maintenance trickle, per §1.6.2). To give the
"leave it running, check the progress" feel within active-only, **tab-open AUTO-RESOLVE + AUTO-REPEAT** keep a
loop ticking while you watch (FU23); **auto-producers stay late-game (T3+)** — early game is the MC's own active
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
- ***Meibutsu* product is LOCKED = silk / sericulture** (Round A). No placeholder; author the T3/T4
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
| **D-007** | Estate-rise spine + tiers **T0–T4** + per-tier transition story gates. | **New ADR** (supersedes the mistaken-identity spine). |
| **D-008** | Three starter factions + **four-pillar** House Influence + per-tier gating. | **New ADR; amended (V2)** — gating is now the **HYBRID good/great/excellent** profile over revealed pillars (good in all · great in 2–3 · excellent in 1–2; Q7/FU10) under the **SEQUENTIAL Phase-1 (rungs) → Phase-2 (pillar grind)** model (FU7); the old "simple per-tier thresholds" framing is superseded; **trade ≤⅓ of Estate & Wealth** survives as the only structural cap. |
| **D-009** | Origin = **living** family/friends (Sawatari-juku) opening at **T2**; Kuzuhara a re-foundable region node; access-only. | **New ADR** (supersedes family-death canon). |
| **D-010** | Indirect/mediated **Edo ceiling** — rank the HOUSE (national *mitate-banzuke*), not the man; no *hatamoto*/shogunal audience. | **New ADR** (Option A: provincial/parody chart; personal rank hard-capped at chief steward). |
| **D-011** | **Combat earns standing** via the Arms pillar; mediocre-start preserved; conditioning gate. | **New ADR; amended (V2)** — the no-cross-feed wall is relaxed to **BOUNDED per-skill combat perks** (Q6/FU8; conditioning stays the zero-stat gate); combat is now **THREE clean tracks** — character level (combat-XP) / the Arms pillar (deeds) / the **Combat Rank** rung-meter (curated rung activities; FU14). |
| **D-012** | Per-tier rank ladders + full maps every tier + **v1 = T0–2** (T3 stub, T4 roadmap); lean cut-set. | **New ADR; amended (V2)** — the **~4-quest budget is dropped** (Q23: no quest-type budget — author whatever fits, more/interesting welcome); combat is now **incremental** with a **bigger weapon roster** (Q15/FU13); the **budget is a FLOOR / longer grind** (FU18); estate **E3 "Prosperous" is authored in v1** (E4–E5 parked; Q8). Cut-set otherwise: ~8 rungs, ~5 mobs, ~6–8 nodes. |
| **D-013** | Tech & presentation: Vite + TS + Vitest; pure-core + thin DOM renderer; one seeded RNG; export/import; responsive desktop+mobile; **active-only, no offline progress**; static itch.io build. Art register = TEXT + EMOJI + CSS. | **New ADR; amended (V2)** — **multi-backend redundant save** (IndexedDB + localStorage + sessionStorage; magic field; monotonic save-counter newest-wins + timestamp tiebreaker; Q37/FU1–FU2); **per-named-stream RNG cursors** `{seed,cursors}` + **stateless day-keyed** weather/lunar (Q2/FU3); **ban `Math.pow` → integer-pow + lint** (Q36); active-only with **tab-open auto-resolve / auto-repeat** (FU23). Presentation V2: a11y correctness now, functional text → **`--ink-soft`** (WCAG AA), **self-hosted OFL fonts**, **inline-SVG** load-bearing motifs (Q18/Q48/Q52/Q38). |
| **D-014** | **Per-tier antagonists** (not a single racket); the racket demoted to a **light, optional connective thread**; T0 villain-less; two rival houses (Tomita + Akagi). | **New ADR.** |
| **D-015** | Four-pillar accrual = **achievement JUMPS + seasonal JUDGED RESULTS** (new-high-water-mark only), up-only + rare recoverable **per-pillar** dents (never a wipe). | **New ADR; amended (V2)** — accrual belongs to the **Phase-2** estate-influence track (deeds **don't** accrue while climbing the rungs; FU7); weather/festivals modulate judged results **±10%** (Q35); bulk-sale saturation damps **progressively per-unit** (Q42). |

### Resolved by Round A (no longer open — recorded for traceability; 🔁 = reversed by the V2 decisions)

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

# §2 — Systems & Mechanics Catalog

> **PRD V2.2 — reshaped per the 79 human-signed V2 decisions (D-022 governing).** This section catalogues the
> systems as *shapes* (the parts list + each system's data sketch); **all balance numbers stay deferred to §4**
> *(proposed v1 balance)*. The V2 reshape flips the load-bearing **system shapes** the rest of the doc consumes,
> per the canonical spine in **§1.6.4**: the conflated combat-deeds pool is split into **three clean,
> separately-stored combat tracks** (character level · the Arms pillar · the Combat Rank rung-meter); combat
> becomes **INCREMENTAL** (one weapon at T0, a growing **~9–10-weapon** roster on a staggered combat-reveal
> ladder); labour skills now grant **bounded per-skill combat perks** (conditioning stays the zero-stat gate);
> the tier-gate becomes the **HYBRID good/great/excellent** pillar profile under the **SEQUENTIAL Phase-1
> (rungs) → Phase-2 (pillar grind)** model; the save layer becomes **multi-backend redundant**; weather/festivals
> carry **bounded ±10% mechanical** effects (derived day-keyed, not stored); dialogue gains **intra-line
> branching**; and reveals are **design-staggered with NO runtime reveal-queue**, distinct activities surfacing
> as **top-level nav tabs**. Most-recent-block-wins (Block L `Q1–Q56`, Block M `FU1–FU23`), annotate-don't-delete.

### System inventory (the parts list)

| # | System | First introduced | Pillar(s) it feeds |
|---|--------|------------------|--------------------|
| 2.1 | UI-reveal engine + event log | T0 (M0; exists from build one) | — (the meta-spine that surfaces every other system) |
| 2.2 | Time, season & world clock (active-only) | T0 | feeds seasonal **judged results** for all four |
| 2.3 | Soft stamina / satiety (throttles labour **and** combat) | T0 | — (paces the day; no pillar) |
| 2.4 | Resources & currencies (koku, coin, pillars, materials) | T0 (koku); coin T1 (coin/market numbers deferred to M4) | Estate & Wealth; pillars are the macro layer |
| 2.5 | Auto-producers (late-game only) | T3+ | Estate & Wealth (idle convenience, never early) |
| 2.6 | Gathering / labour nodes & jobs-as-offices | T0 | **Estate & Wealth**, **Standing & Office** |
| 2.7 | Attributes, per-skill levels & milestones (character level **combat-fed only**; per-skill perks add small combat texture) | T0 (attributes/skills); web grows per tier | Arms (combat skills + perks), Estate & Wealth (labour skills) |
| 2.8 | Combat (idle auto-resolve + active setup) — **INCREMENTAL** (one weapon at T0); **THREE clean tracks** | **T0 (R3)** | **Arms** |
| 2.9 | Bestiary & mobs (grounded) | T0 (R3) | Arms |
| 2.10 | Loot, equipment (FIND + CRAFT), gear & inventory — a **growing ~9–10-weapon roster** | T0 (R3) | Arms; crafting overlaps Estate & Wealth |
| 2.11 | Crafting (hybrid: simple → component/quality) | T0 (simple); component system T1+ | Estate & Wealth (trade sub-engine); Arms (gear) |
| 2.12 | Dialogue & quests (open-ended; intra-line branching; no quest-type budget) | T0 (dialogue); quest log ~R5 | all (the universal unlock/reward bus) |
| 2.13 | Lore, inn rumours & the belief→cause engine | T1 | Name & Honour (flavour); never gates the spine |
| 2.14 | World sim (seasons / weather / festivals — bounded ±10% mechanical) | T0 clock; seasons/festivals T1 | seasonal judged results for all four |
| 2.15 | Factions & reputation (estate ladder, village web, origin ties, allegiance) | T0 (estate); T1 (village); T2 (origin) | all four (via multipliers / standing) |
| 2.16 | House Influence — the four pillars (accrual + **HYBRID good/great/excellent** tier-gating) | tracked visible at T0-R7 | the macro roll-up of all four |
| 2.17 | Estate growth (build / recruit = flavour) | T0 (E0→E3 in v1) | Estate & Wealth; Arms (defensive works) |
| 2.18 | The national *banzuke* / per-tier ranking | per-tier domain rank; national at T4 | reads all four pillars |
| 2.19 | Save / load (**MULTI-BACKEND** redundant + export/import) | T0 (M0, built full) | — (infrastructure) |
| 2.20 | The DEV play API + content verifier | T0 (M0 skeleton) | — (infrastructure/QA) |
| 2.21 | Accessibility, audio & presentation register | T0 | — (infrastructure) |

The rest of §2 details each. **Systems 2.1, 2.8, 2.16, 2.19, and the pillar accrual rules in 2.15 are the most
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

**Design-staggered reveals — a general NO-UI-DUMPS principle (FU4; supersedes Q17's queue framing).**
Reveal cadence is a **gameplay/UI DESIGN responsibility, not runtime machinery.** The unlock schedule is
**authored so reveals are inherently one-at-a-time** — beats are spaced across the rank ladders so no two
collide on a single tick. There is **NO runtime `revealQueue` field** in `GameState` (FU4 supersedes the
earlier Q17 "serialize reveals into a deterministic one-per-beat queue" note): staggering is a property of
the *authored* schedule, not stored runtime state. The rare genuine multi-element single-feature reveal (a
panel that legitimately ships two controls at once) is a **bespoke one-off designed per case with the human**,
not a generic queue. Everything obeys the general NO-UI-DUMPS rule (stagger everything, slowly and gently).

**(b) Player-facing behaviour / loop.** Minute one is one verb ("Rake the spilled rice") + the log +
a counter. As the player acts, things *appear*, each announced in-fiction ("footsteps — a door
slides…"). The **UI shell is multi-screen navigation that appears single-screen early**: more
screens/nav unlock as the player progresses (responsive desktop + mobile, **not** hover-dependent).
Reveals follow the **per-tier rank ladders** (a fresh ladder per tier — §1.5.1, §2.15), never one
continuous staircase. **Distinct activities (e.g. Crafting, Quests) surface as their own TOP-LEVEL nav
tabs, not nested panels** (Q10) — so the main screen stays the active labour/deeds/combat loop. The loop
the player feels: *act → something new fades in with a log line → explore it → act more.*

**(c) Rough DATA shape.**
- `RevealableEntry { id, kind ('panel'|'tab'|'navLink'|'resourceRow'|'button'|'screen'|'area'),
  unlockPredicate (expression over GameState: flags, resources, rank, skill levels, story node,
  season, pillar values), revealLogLineId, oncePerGame }` — the `'tab'`/`'navLink'` kinds carry the
  **top-level activities** (Crafting, Quests) that reveal as their own nav rows, not nested panels.
- `RewardBundle { items?, xp?, coin?, koku?, materials?, locationsRevealed?, panelsRevealed?,
  dialoguesUnlocked?, recipesUnlocked?, questsStarted?, flagsSet?, pillarDeltas? }` — the universal
  object every dialogue/quest/threshold/combat-deed can emit.
- `LogMessage { id, text, channel ('narration'|'reward'|'combat'|'system'|'milestone'), colorClass, tick }`,
  stored in a **true ring buffer** with a pinned hard cap (`LOG_RING_MAX ≈ 300`, oldest evicted; only a
  ~50-line tail persists — §6.4/§6.8).
- Unlock predicates are **pure functions**; the renderer subscribes to state snapshots and does one
  `render(state)` reconciliation (no scattered push-updates → kills stale UI). **No reveal-queue state is
  persisted** (the schedule is authored, not buffered at runtime).

**(d) Ties to the four pillars.** Indirect but total: the **House Influence panel (2.16) and many
late reveals are gated on pillar thresholds**, so "numbers go up" and "the world enlarges" are one
motion. The reveal engine is the surface on which all four pillars become *visible* (the four-bar
standing panel reveals at T0-R7).

**(e) When introduced / fractal reveal.** **T0, build one (M0).** It exists before any content and
governs everything thereafter. It is itself fractal: a drill yard reveals one post → a rack →
sparring slots; a new region reveals one road → one threat → one contact. Reveals are
**design-staggered one-at-a-time** (no runtime queue; FU4).

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
- `WorldClock { tick, day, season ('spring'|'summer'|'autumn'|'winter'), year }` — **only the day index
  and tick persist.** Weather and lunar phase are **NOT stored fields**: they are **DERIVED on read** via a
  pure stateless helper `deriveDayKeyed(seed, 'weather'|'lunar', day)` over the day-keyed RNG sub-stream
  (Q3/FU3/Q2), so nothing weather/lunar ever serialises (only `day` does). This keeps the clock replay-stable
  and the save minimal.
- A **fractional-tick remainder** accumulates in the app tick loop (not in core) so `tick()` only ever
  receives **whole integer ticks** — the deterministic core never sees a fractional `dtTicks`.
- `Scheduler { perTickPlans[], perDayPlans[], perWeekPlans[] }` — registry rows that fire effects on
  cadence (restock, rot, festival start, harvest appraisal).
- `SeasonalAppraisalState { lastJudgedHighWaterMark per pillar, pendingAppraisals: number }` — feeds 2.16's
  judged-result accrual (fires on a **new high-water mark**, never repeatable maintenance).

**(d) Ties to the four pillars.** The clock is the **timing source for accrual shape (B)** — periodic
**judged results** (a season's harvest, an autumn audit, a security appraisal) for **all four
pillars**. It never grants Influence by itself (no time-trickle).

**(e) When introduced / fractal reveal.** **T0** — the clock display reveals early (around R1, with
the *koku* heartbeat); seasons/weather/festivals deepen at **T1** (the world-sim layer, §2.14).

---

## 2.3 Soft stamina / satiety (throttles labour AND combat)

**(a) What it is.** A **soft** energy/satiety meter that **slows** action when low — it **never
hard-blocks** play. It throttles **BOTH labour AND combat** (V2 — the earlier labour-only framing is
superseded; Q31/FU16). Rest and eat to refill; it paces the day and gives food/cooking a purpose, and
adds the "eat before you fight" texture to combat.

**(b) Player-facing behaviour / loop.** As the MC labours or fights, satiety/energy drains; depleted,
actions get slower / less efficient (a gentle nudge to rest, eat, or change activity), never a wall or
a punishing timer. The throttle curve is **flat above ~0.7** of `satietyMax`, then **knees down toward a
~0.5 floor** (`STAMINA_RATE_FLOOR ≈ 0.5` *(proposed v1 balance)*) — a rate multiplier, never to zero.
**Combat uses a SEPARATE `satietyRate` coefficient** from the labour floor (so the two can be tuned
independently; §2.8/§4), and "**adequate satiety**" = **≥~0.7** — the level at which the **locked 20–35%
first-fight win-rate** is measured (§2.8/§4.6.6), so an underfed protagonist fares worse still. Refill by
resting (advances the clock) and eating cooked food (ties to the cooking skill and provisioning economy).
The convalescence framing of the cold open uses this meter (rest and recover "a little" in the first
hours — he is **not** a bedridden invalid).

**(c) Rough DATA shape.**
- `Vitals { hp, hpMax, satiety, satietyMax, fatigue }` (derived caps recomputed on load; `satietyMax = base
  + per-(combat-)level growth`, scaling off the character (combat) level, §2.7/§4.4 — Q47).
- Action costs reference a `staminaCost` field; a soft-throttle function maps low satiety → a *rate
  multiplier* on labour/combat speed (never to zero), using the **labour floor** for work and the
  **separate `satietyRate` combat coefficient** for fights (floor ~0.5; bounded so the floor only costs a
  few win-rate points, never below ~15% — *proposed v1 balance*).
- `FoodItem { restoreSatiety, buffs?, perishable, spoilTicks }`.

**(d) Ties to the four pillars.** None directly. It is a pacing/throttle system. (Cooking/provisioning that
feeds it sits under Estate & Wealth's labour, §2.6; combat's satiety throttle is detailed at §2.8/§4.6.)

**(e) When introduced / fractal reveal.** **T0** — the body/rest bar reveals at **R0** (in the *kura*,
alongside the rice counter). The satiety soft-gate surfaces as the player leaves the storehouse and
labour begins (R1–R2); the **combat** throttle surfaces with the first fight at **R3**.

---

## 2.4 Resources & currencies (koku, coin, pillars, materials)

**(a) What it is.** The economic substrate. **Canon currencies:** **koku (rice)** = the base
exponential currency and historically real unit of wealth/tax (the *koku* heartbeat; held koku reads as a
comfortable **NET** figure, not gross); **coin (mon)** = the secondary trade currency; **the four House
Influence pillars** = the macro standing layer (NOT spendable like koku/coin — they are the cumulative score
of what the house has *become*; see 2.16). **Other resources** (wood, charcoal, fish, *sansai*/wild greens,
herbs, hides, fibre/silk cocoons, ore/iron, etc.) feed crafting and trade. Each new resource **lights its own
panel/row** on first acquisition (via 2.1). **Coin / market numbers** (the koku↔coin spread, sinks, the silk
*meibutsu* economics, `MarketState`) are **deferred to M4 as placeholders, not frozen here.**

**(b) Player-facing behaviour / loop.** Grind koku by farming; convert surplus to coin via trade
(brokers/shops; **the village shop row is the first market, opening at T1 — no market in T0**); spend
koku/coin/materials on crafting, gear, building, and tier-expansion. **Koku and coin are inputs you spend
and grind; Influence is what you become.** A **market-saturation damper** (2.11/2.15) applies
**PROGRESSIVELY per-unit** on bulk sales — **each unit walks the price down** (legible, un-gameable) — and
recovers over in-game days, keeping grinding interesting and stopping trade running away (reinforced by the
trade ≤ ⅓ cap).

**(c) Rough DATA shape.**
- `ResourceDef { id, name, kind ('currency'|'material'|'food'|'fibre'|'ore'…), revealPredicate,
  stackable, perishable?, spoilTicks? }`
- `GameState.resources: Record<resourceId, amount>` (**counts only, UNBOUNDED — no caps**; derived rates
  computed, never stored).
- `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` — the **per-unit progressive** damper;
  **numbers deferred to M4 → §4.**
- Pillar values live in `Influence` (2.16), kept structurally separate from `resources` so trade can
  never masquerade as standing. The **Estate & Wealth pillar value is DERIVED** — summed `land + treasury
  + trade` on read, **never a stored aggregate** (a strand-dent can't desync it; D-Q-estate-dent — §2.16/§6.4).

**(d) Ties to the four pillars.** koku/coin/materials are the **inputs** the house spends to earn
recognition; **recorded yields and sealed contracts convert to Estate & Wealth** (via achievement
jumps / seasonal judged results). The **trade strand (routes / broker standing / the silk *meibutsu*)
is hard-capped to ≤ ⅓ of Estate & Wealth**, so a pure-trade run maxes ~⅓ of one of four pillars.

**(e) When introduced / fractal reveal.** **T0** — koku at **R0/R1** (rice counter → paddies). **Coin
(mon)** reveals at **T1** when the village market/shop row opens (the first market). Material resources
reveal one at a time as their nodes/crafts come online (foraging → *sansai*; woodcutting → wood → charcoal;
fishing → fish; sericulture → cocoons/silk at the silk sub-engine).

---

## 2.5 Auto-producers (LATE-GAME only)

**(a) What it is.** Idle helpers that produce a resource over time **without** the MC's active action.
**Canon: limited / late-game ONLY** — early game is the MC's own active grind. There is **no
assignment/management panel and no labour-gang to manage, ever** (that would be the rejected
people-management sim). Auto-producers are a late convenience surfaced as **seconded/recruited helpers**
(village allies, recruited origin friends) wired to existing idle-producer slots.

> **Auto-producers are NOT the "leave it running, check the progress" feel.** That feel comes from
> **tab-open AUTO-RESOLVE combat + AUTO-REPEAT labour** (FU23) — active-only loops that keep ticking while
> you watch — **not** from offline accrual or early idle producers. Auto-producers remain a distinct
> *late* convenience; v1 stays active-only (no offline progress).

**(b) Player-facing behaviour / loop.** From late game, a recruited helper quietly trickles a resource
(e.g. a seconded hand tending a reclaimed paddy) so attention is freed for the active grind elsewhere.
Framed diegetically as a person joining the house's works — **flavour roster cards, not a managed
sub-economy.** Consistent with active-only: helpers produce **only while the game is being played**;
there is **no offline accrual.**

**(c) Rough DATA shape.**
- `AutoProducerDef { id, resourceProduced, baseRate, costToBuild (koku/coin/materials),
  rankFloor (LOW), pillarFloor, revealPredicate, rosterCardId }` — gated on Influence band + a LOW
  rank floor + cost (not the capstone), per the estate-growth rule.
- Cost curve scaffold mirrors the genre (`cost = base * r^owned`, ~5× jumps between tiers; **integer-pow,
  not `Math.pow`** — §2.19/§6) — **values deferred to §4.**
- Bound to a `RosterMember` for the diegetic framing (the helper is a face, not a slider).

**(d) Ties to the four pillars.** **Estate & Wealth** (their output converts to recorded yield).
Defensive auto-producers (a standing watch) can feed **Arms** via security appraisals. They are an
*efficiency* layer, never a standing source in themselves.

**(e) When introduced / fractal reveal.** **T3+ (parked beyond v1's early surface).** v1's E0–E3 estate
stays an **active grind**; the first auto-producers belong to later tiers. Each arrives minimal (one
helper, one resource) and is announced as a recruitment beat.

---

## 2.6 Gathering / labour nodes & jobs-as-offices

**(a) What it is.** The peaceful-labour core — the **dominant daily texture** (labour-plurality). Two
faces: **gathering/labour nodes** (the MC's own active work) and **jobs-as-offices** (administrative
duties framed as *the MC's own quests/offices*, **not** a management layer). **Lean starter set
(canon):** farming, foraging, woodcutting, fishing, smithing, cooking; **more unlock as you climb
tiers/regions.** Nodes are **tiered and season-gated**; clickable now, idle later. A **tab-open AUTO-REPEAT
labour** convenience (active-only — repeats the chosen action while the tab is open; FU23) is the grind
convenience, **distinct from** the *late* auto-gather toggle / auto-producer (§2.5).

**(b) Player-facing behaviour / loop.** Do the work manually (rake rice, fell timber, forage the
near-*satoyama*, fish the ford), or leave the **tab-open auto-repeat** running and check the progress;
each action yields a **resource + skill XP + sometimes a quest event**. Higher ranks/offices add
**jobs-as-offices** — e.g. the bailiff of the home fields takes on field administration as **his own
duties/quests**, never a city-builder panel. The texture stays **grind ("the hero gets better at what he
does")**, not micromanagement. **Grind depth is a FLOOR, not a ceiling** — a longer OSRS-rough grind with
**enough grinding content, interleaved, never brick-walled** (FU18); §4.8 is a **minimum-grind** model
(the pacing regression fails on **undershoot only**).

**(c) Rough DATA shape.**
- `LabourNode { id, skill, resourceYields[], seasonWindow, dangerRing?, staminaCost,
  revealPredicate, autoRepeatable (tab-open, active-only), autoGatherUnlock? (LATE) }`
- `Job/OfficeDef { id, kind ('labour'|'admin-as-quest'), grantsResponsibilities[], questsOpened[],
  rankFloor, pillarContribution }` — admin offices emit **Standing & Office** recognition, not a sim.
- Yields reference `ResourceDef` (2.4) and grant `SkillXP` (2.7).

**(d) Ties to the four pillars.** **Estate & Wealth** primarily (LAND via *shinden* reclamation;
TREASURY via debt→solvency; TRADE via routes/broker/silk — the trade strand ≤ ⅓ capped). **Jobs-as-
offices** feed **Standing & Office** (offices granted, the bailiff duty, a dispute arbitrated). Recorded
yields and seasonal harvest appraisals are the canonical **achievement-jump / judged-result** sources
(accruing in **Phase 2** — §2.15.1/§2.16).

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
tier.** The **character (combat) level is its OWN stored track, fed by COMBAT XP ONLY** (labour and deeds
**never** raise it; Q1/FU14 — §2.8.1): it grants **HP** (`hpMax`), **satiety capacity** (`satietyMax`),
and **attribute points** (the curves are §4 numbers). To keep the tracks from coupling, the old
**compounding skill-XP multiplier is scoped out (or kept tiny)** so combat level can never drive labour XP
(that would re-open a combat→labour loop).

**(b) Player-facing behaviour / loop.** Doing labour/combat raises hidden skills until they **surface**
(a discover-by-doing reveal via 2.1), then keep levelling on a steep curve with **per-event XP caps**
(combat and crafting per-event caps force *breadth and grind*, never a quick spike). Milestones at
thresholds grant perks — an emergent build web and long-tail goals; **every skill (labour included) also
has a small per-skill perk track that adds a few bounded combat bonuses** (§2.7.1). Attributes layer base
/ additive / multiplier and **recompute on load** (saved as `total_xp`, not derived stats).

**(c) Rough DATA shape.**
- `Attribute { id (STR|AGI|INT|SPD|luck), base, fromGear, fromMilestones }` (recomputed).
- `SkillDef { id, category ('Farming/Labour'|'Gathering'|'Crafting'|'Combat'|'Weapon'|
  'Environmental'), visibilityThreshold, xpCurveParams, perEventCap, milestones[], perks[] }` — **every
  `SkillDef` carries a `perks[]` track** (§2.7.1).
- `Milestone { atLevel, perks: RewardBundle-like (flatStat | multiplier | title | crossSkillXp) }`
- `GameState.skills: Record<skillId, total_xp>`; `character.level + xp` (the **combat-fed** level track,
  §2.8.1).
- **No-hidden-edge guard (REVISED, V2 — Q6/FU8).** The old hard wall ("combat skills have **no** input edge
  from labour skills; no cross-feed field exists") is **replaced** by a **bounded** cross-feed: every skill
  (labour included) grants a **few small combat perks** through a **separate `skillCombatBonus` channel**
  (NOT an attribute, NOT character level) — see §2.7.1. **Conditioning stays the ZERO-stat enablement gate**
  (the one exception that grants no combat stat at all). Milestones never read returning-memory/porter's-knot
  flags (the no-edge-of-BIRTH/GIFT/MEMORY line holds; the new line is **gift-vs-work**, not labour-vs-combat).

**(d) Ties to the four pillars.** Indirect: **combat skills → Arms** (better deeds), **labour/craft
skills → Estate & Wealth** (better yields/quality) and, via per-skill perks, a little extra combat
**capability**. Skills do **not** grant Influence directly; they make the *deeds* that the authorities
recognize more achievable. Milestone titles can feed **Name & Honour** flavour (a recorded merit), but the
pillar value comes from the recognized deed, not the level.

**(e) When introduced / fractal reveal.** **T0** — attributes exist from the open; the **Skills tab**
reveals at **R2** on first XP. Combat/weapon skills surface at **R3** (drill yard) — with **exactly ONE
starter weapon** (not "2–3 weapon lines"): the weapon roster grows **incrementally** (T0 +2 / T1 +3 / T2 +4;
**~9–10 across v1** — §2.10.1). Lean core lines at T0 (farming, foraging, woodcutting, fishing, smithing,
cooking; conditioning); **more skills unlock per tier** (e.g. sericulture/textile at T1, surveying/
engineering and trade skills at T2). This **incremental per-rung/per-tier skill unlock is itself the real
bound** on the labour→combat cross-feed — you can't front-load perks.

### 2.7.1 Per-skill perks — the bounded labour→combat cross-feed (Q6/FU8 — replaces the no-cross-feed wall)

**(a) What it is.** A **relaxation** of the old absolute "no labour→combat feed" wall into a **bounded,
earned** cross-feed: **every skill** (labour skills included) has a **perk / flat-bonus track** —
**~2–8 perks** (or ~3–8 small flat stat bonuses) per skill — **unlocked by levelling that skill.** Each
perk adds a **small combat bonus** through a **dedicated `skillCombatBonus` channel** (kept off the
attribute/level math). So a milled-out labourer is **a little** more combat-capable — *capable→a-bit-more-
capable* — but **big combat power stays combat-only.** This is the **gift-vs-work** line, not labour-vs-
combat: nothing is *given* by birth/memory; reps *earn* small bonuses.

**(b) Boundedness (how it stays honest without a hard global cap).** Perks are **stackable with NO hard
global cap.** They stay bounded by three soft levers instead: **(1)** a **small per-perk magnitude**
(individually tiny — §4); **(2)** the **incremental skill unlock** (perks reveal per rung/tier, never
front-loadable); and **(3)** **holistic enemy/drop scaling** (encounter difficulty is tuned against the
expected total — the modest power-creep risk is **accepted**, Q6/FU8). The content verifier asserts each
perk is **small-magnitude (not zero, not a single global ≤CAP)** — flipping the old "labour→combat == 0"
check (§2.20).

**(c) The conditioning exception.** **Conditioning** alone stays the **ZERO-stat one-way enablement
gate** (the weak→capable gate that *unlocks* the combat track) — it grants **no** combat stat or
training-rate bonus, and the per-skill perk channel must **never** become a back-door past it: conditioning
(enablement) and `skillCombatBonus` (small polish) are **orthogonal** (§2.8(a)/§4.5/§4.6.1).

**(d) Rough DATA shape.**
- `SkillDef.perks: PerkDef[]`; `PerkDef { id, unlockAtSkillLevel, combatBonus (small flat/%, via
  skillCombatBonus channel), isConditioningException: false }`.
- `GameState` derives a single `skillCombatBonus` aggregate (summed independently of attributes and
  character level) applied in the combat sim (§2.8(c)). *(Magnitudes → §4.5.4, proposed v1 balance.)*

**(e) When introduced / fractal reveal.** **T0+** — perks reveal as their parent skill levels, **one at a
time**, interleaved with the combat-reveal ladder (§2.8.2). The conditioning enablement gate is the T0-R3
combat-unlock beat; the small per-skill polish accrues gradually thereafter.

---

## 2.8 Combat (idle auto-resolve + active setup)

**(a) What it is.** A **first-class core pillar from T0** (not a mid-ladder reveal) and an **INCREMENTAL
progression surface** (no longer "fully surfaced at T0"). Style (canon): **idle auto-resolve + active
setup** — prepare gear/stance/area, a **deterministic seeded fight** resolves, and the player intervenes
with stance / ability / item / retreat. Low-APM, strategic, **NOT twitch.** **T0 starts with EXACTLY ONE
weapon**, and a **growing roster** unlocks rung-to-rung along the **combat-reveal ladder** (§2.8.2;
~9–10 weapons across v1 — §2.10.1). It feeds **THREE clean, separately-stored tracks** (never one fused
bar — §2.8.1): **character (combat) level** (kills/combat-XP), the **Arms pillar** (recognised deeds,
Phase-2-gated), and the **Combat Rank rung-meter** (per-rung curated activities). **Mediocre-start
preserved:** start near-zero; the **humbling, near-fatal first fight** is an early beat (survived by luck /
sheer stubbornness, never skill — and never *rescued*: you survive it, THEN beg Kihei for drills);
capacity is **earned through Kihei's drills**, gated behind labour-built **conditioning** (a one-way
enablement gate that grants **ZERO combat stat or training-rate bonus** — orthogonal to the small per-skill
perks of §2.7.1). Combat is **satiety-throttled** ("eat before you fight"; §2.3). **Failure = soft setback**
(lose HP/time, maybe drop carried loot or take an injury to rest off) — **never** lose levels/gear/permanent
progress.

**(b) Player-facing behaviour / loop.** Choose an area/danger ring, equip gear, pick a **stance** (data
shifting attack/speed/evasion/target-count), optionally bring consumables, then let the fight
auto-resolve on a fixed-step seeded sim; intervene mid-fight (swap stance, use ability/item, retreat).
On kill: combat-XP → **character level** + skill XP + seeded loot roll + bestiary update + quest events.
**A weapon's `attackPower` is scaled by its current durability BAND and by the satiety `satietyRate`
coefficient** (below). Cleared areas can re-spawn idly under a **tab-open auto-resolve** loop (the
"leave it running, check the progress" feel; FU23). HP/satiety managed via rest/eat between fights.
**Texture stays peaceful-labour-dominant by volume**; combat is live and load-bearing.

- **Graded durability bands (Q33/FU17).** Weapon `attackPower` is scaled by **4 graded durability bands**
  — **75 %+ / 50 %+ / 1 %+ / 0** of `durabilityMax` → multipliers **1.0 / 0.9 / 0.75 / 0.55** *(proposed v1
  balance)* — with **FIXED wear per FIGHT** (cheap, replay-stable). A weapon is **NEVER auto-unequipped**:
  it stays equipped and functional even at 0 (the 0.55 floor) — **never weaponless** (auto-battler safety).
  **Armour bands apply identically on `defense`.** Repair / re-craft restores durability to max (§2.10/§2.11).
- **Satiety → combat throttle (Q31/FU16/Q47).** A **`satietyRate` multiplier** scales `attackPower`
  (lighter touch on `attackSpeed`) — **flat above ~0.7** of `satietyMax`, kneeing to a **~0.5 floor** — a
  **SEPARATE combat coefficient** from the labour throttle (§2.3). "**Adequate satiety**" = **≥~0.7**, where
  the **locked 20–35% first-fight win-rate is measured** (re-specified "at adequate satiety"); the throttle
  is bounded so the floor only costs a few win-rate points (**never below ~15%** — *proposed v1 balance*).
- **Retreat semantics (Q16).** Retreat is a **CLEAN escape valve**: you keep HP + loot, pay a modest clock
  cost, and **it NEVER dents Influence.** (The one exception: **abandoning a DEFEND deed** counts as a
  *failed defend* — a small, recoverable **Arms** dent, never a wipe.)
- **Unattended auto-resolve — the self-recovering loss loop (D-Q-idle-combat).** Left running, the
  auto-resolver **fights everything**; outcomes **self-correct, never death-spiral, never hard-stall.** A
  **LOSS forces a retreat** (keep HP + loot per the retreat semantics above); a **0-HP loss forces the MC
  to travel to a safe place** (home or elsewhere) **and REST to recover** — a **time cost**, not a wipe.
  No level/gear/Influence loss; play always continues. (Combat math + the 0-HP→forced-rest transition:
  §4.6.6b.)

**(c) Rough DATA shape.**
- `Combatant { hp, attackPower, attackSpeed, evasion, defense, critChance, blockChance, statuses[] }`
  — the MC's derived from **attributes + character (combat) level + the equipped weapon's archetype +
  the `skillCombatBonus` aggregate (§2.7.1) + gear**, then scaled by the **durability band** and the
  **`satietyRate`** multiplier.
- `WeaponArchetype { baseSpeed, reach, targetCount, attackProfile, signatureAbilityId }` — **distinct
  combat identity now lives on the WEAPON** (per §2.10.1), not only on the Stance; **`baseSpeed` is
  per-weapon** (the old single `baseSpeed = 1.0` is superseded). The crude carrying-pole is a **0th
  IMPROVISED weapon** (not a line).
- `CombatSim` advances an internal sub-tick accumulator per `attackSpeed`; per swing: hit (attacker
  dex-like vs target evasion) → damage (`attackPower ± seeded variance` minus defense, with a floor; the
  `attackPower` already carries the **durability-band × satietyRate** scaling) → separate seeded crit/block
  rolls → status effects applied per tick. All draws from the **combat RNG cursor** (`cursors.combat`; §2.19)
  — reproducible, unit-testable, **integer-pow only** (no `Math.pow`; §6).
- `Stance { attackMod, defMod, speedMod, evasionMod, targetCount }`; `CombatInterventionIntent`
  (stance/ability/item/retreat).
- **DELETED: `CombatDeedsPool`.** A kill writes to **`character.level`'s combat-XP ONLY** — *never* the
  Combat Rank rung-meter, *never* the Arms pillar directly (the three tracks are summed independently;
  §2.8.1). Recognised **deeds** write to **Arms** (§2.16); per-rung **curated activities** write to the
  **Combat Rank rung-meter** (§2.15).
- `CombatEncounterState { … }` — the in-fight working state; added **additively at its M2/M5 milestone**,
  **not** pre-declared in M0 (FU5).
- `InjuryState { kind, restTicksToHeal }` (the soft-setback model — temporary, recoverable).

**(d) Ties to the four pillars.** **Arms (武威)** — recognized martial deeds (a road declared safe, a
nest cleared, the grain store defended, a rival's enforcer broken) convert to Arms via **achievement
jumps** (per-event capped so no single fight spikes the pillar) + **seasonal security judged results**
(fired on a new high-water mark, **not** repeatable maintenance). **These DEEDS accrue in each tier's
Phase 2 ONLY** (post-final-rung; FU7 — §2.15.1) — *not* while climbing the rungs. A **lost battle dents
Arms** (small, scripted, recoverable — never a wipe).

**(e) When introduced / fractal reveal — the staggered combat-reveal ladder (NOT a one-beat dump).**
**T0, R3** — after the **humbling first fight** (a wolf at the grain store), combat opens **incrementally,
one reveal per beat** (the old "drill yard + Combat panel + idle-combat all at once" dump is **retired**):
**R3** = the drill yard + Combat panel + the **single starter weapon** + Equipment/Inventory + the
**Bestiary** + the **bare auto-resolve loop + retreat** (character (combat) **level** begins). The full
staggered order is tabulated at **§2.8.2**. Curated combat activities feed the **Combat Rank rung-meter**
from **R5** (gate-guard); the **Arms PILLAR deeds** do **not** accrue until **Phase 2** (post-R7; §2.15.1).
Combat then interleaves through every per-tier ladder (V2 road-warden, V5 sworn man-at-arms at T1;
road-captain / road-security detail at T2), the **2nd combat line opening at T1** and the **3rd at T2**.
Reveals are woven throughout, **never dumped at one Act-close.**

### 2.8.1 The three clean combat tracks (replaces the conflated CombatDeedsPool — FU14/Q1/Q30)

The combat systems feed **three INDEPENDENT, separately-stored tracks** that must **never collapse into one
bar** (reconflating them is the single likeliest regression). What **one kill / one deed / one curated rung
activity** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role |
|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** (labour and deeds **never** raise it; Q1) | **HP** (`hpMax`), **satietyMax**, **+attribute points** (curves → §4) | personal power; per-mob `MobDef.level` sets on-kill XP (§2.9/§4) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** (§2.16) | **Phase-2** tier-gate input (the hybrid profile) |
| **The Combat Rank rung-meter** | **per-rung CURATED** combat activities (not raw kills/XP; FU14) | the **per-rung-reset martial rung-meter** (§2.15) | **Phase-1** martial rung-gate |

So: **one kill** → character-level combat-XP (only); **one recognised deed** → Arms; **one curated rung
activity** → the Combat Rank meter. Each stream **sums independently** (the verifier asserts no leakage —
§2.20). *("**Combat Rank**" renames the old "Combat Standing", Q9; "**Standing**" now means the **官威
Standing & Office** pillar **only**.)* `character.level` is the only one of the three that scales personal
power; the other two are *standing*/*gate* meters, not power.

### 2.8.2 The combat-reveal ladder (incremental — one reveal per beat; FU12/FU13)

Combat is a real **incremental progression surface**. The reveals are **staggered, one per beat** (kills the
old R3 UI-dump), with the trigger kind noted per step:

| Beat (trigger kind) | What reveals |
|---|---|
| **R3** — combat rung | The **single starter weapon** + the **bare auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). Combat stats start near-zero. |
| **R4** — loot→craft loop | **Graded weapon-durability bands** surface with the simple Crafting loop (a weapon degrades but is **never auto-unequipped**; §2.8(b)/§2.10). |
| **R5** — combat rung | The **stance** slot. *(Curated combat activities now feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — gated to Phase 2.)* |
| **First weapon-line L10 milestone** — weapon-skill milestone | The **ability + item** intervention slots. |
| **T1** — combat rung | The **2nd combat line** (a Combat Rank rung-gate); **+3 weapons across T1.** |
| **T2** — combat rung | The **3rd combat line**; **+4 weapons across T2.** |

Weapon **signature abilities** deepen at higher weapon-line milestones (e.g. **L25 / L50** — *proposed v1
balance*). The **weapon roster grows incrementally** alongside (T0 +2 / T1 +3 / T2 +4; ~9–10 across v1 —
§2.10.1). These feed the **three clean tracks** (§2.8.1), never one fused bar; curves and per-weapon params
live in §4.6.

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
- `MobDef { id, kind ('animal'|'insect'|'human'|'wildlife'), level, dangerRing, stats (Combatant base),
  lootTableId, spawnWeightByRing, isGrindable (true), bestiaryEntryId }` — **isGrindable = honest-
  mundane only.** The explicit per-mob **`level`** field (hand-tunable; defaults ~ the `dangerRing`'s
  expected character-level) **feeds the on-kill combat-XP path** (on-kill XP = `MobDef.level · COMBAT_XP_K`,
  §4.6.5 — FU15) into the character (combat) level (§2.8.1).
- `BeliefBeast { id, rumourQuestId, resolvesToCause (human|animal|natural), oneShot: true }` — kept in
  a **separate registry, `content/beliefBeasts.ts`** (separate from grindable mobs; enforces the canon
  "no belief-creatures in spawn tables" rule at the type level — Q3).
- `SpawnTable { ring, weightedEntries[] }`.

**(d) Ties to the four pillars.** **Arms** — clearing/securing against mobs is the recognized martial
service that converts to Arms (as **Phase-2 deeds**; §2.8(d)/§2.15.1). Loot also feeds Estate & Wealth
(crafting materials, §2.10/2.11).

**(e) When introduced / fractal reveal.** **T0, R3** (the Bestiary reveals with the Combat panel; the
boar is the first grindable threat after the humbling fight). New rings/mobs reveal one at a time by
conditioning: near-*satoyama* (T0) → foothills/charcoal grounds + river (T1) → high mountains/pass and
human bandits/rōnin (T2). Belief-beast one-shots arrive only via inn rumours (T1+).

---

## 2.10 Loot, equipment (FIND + CRAFT), gear & inventory

**(a) What it is.** The gear pipeline. **Equipment slots with durability** (weapon, body/*dō*, head,
hands, foot/*waraji*, charm) filled **two ways (canon): FIND** (dropped gear — a dropped *nata*, a
fallen rōnin's worn *kodachi*, a boar-hide vest) **AND CRAFT** (through the component chain — wood →
charcoal → Smith Gonta's forge → spearheads/blades/tools; hides → tanner → armour). **Gear progression**
is a measurable ladder (borrowed carrying-pole + crude hatchet → fitted *yari*, padded jacket,
smith-forged blade), and the **weapon roster GROWS incrementally** (~9–10 across v1; T0 starts with 1, +2 /
+3 / +4 per tier — §2.10.1). New weapons/styles are **FOUND and CRAFTED, never gifted.** Plus the
**Inventory panel.**

**(b) Player-facing behaviour / loop.** Defeat mobs / work nodes → seeded loot rolls drop materials,
coin, occasional **found gear**. Equip gear into slots (with **graded durability bands** that wear a
**fixed amount per fight** and are repaired/re-crafted). Craft better gear via the component chain (quality
from crafter skill + component quality + station tier, §2.11). Disassembly returns materials. Each gear
tier is a clear power step on the combat track (and tools improve labour yields).

**(c) Rough DATA shape.**
- `EquipDef { id, slot, statMods (attack/defense/etc.), durabilityMax, craftRecipeId?, foundOnly?,
  archetype? (WeaponArchetype: baseSpeed/reach/targetCount/attackProfile + signatureAbilityId, for weapons)
  }` — **weapons carry archetype params + a signature ability** (§2.8(c)/§2.10.1).
- `LootTable { entries: { itemOrMaterialId, weight, qtyRange }[] }` (seeded rolls via the **loot RNG
  cursor**, `cursors.loot`; §2.19).
- `EquipState { slot → { equipDefId, durability, qualityTier } }`; `Inventory: Record<itemId, count>`
  (quality folded into the stack key so quality tiers stack distinctly).
- `Durability { current, max, repairCost }` — read through the **4 graded bands** (75 %+ / 50 %+ / 1 %+ / 0
  → 1.0 / 0.9 / 0.75 / 0.55) on `attackPower` (weapons) / `defense` (armour); **NEVER auto-unequip**;
  repair / re-craft restores to max (§2.8(b), §2.11).

**(d) Ties to the four pillars.** **Arms** (gear enables the deeds that earn Arms). The crafting overlap
(tools, the silk/textile finishing chain) feeds **Estate & Wealth** (and the trade strand, ≤ ⅓ capped).
Gear itself is never a standing source — the *recognized deed* is.

**(e) When introduced / fractal reveal.** **T0, R3** — first crude weapon + **Equipment & Inventory**
panels reveal with the Combat panel. The **loot + craft loop** (Smith Gonta spearheads via the
component chain) comes online at **R4** (trusted hand & houseman) — **graded durability bands reveal here**
with it. Better loot/craft tiers + new weapons unlock per tier and per danger ring (worn blades from rōnin
at T2; Hanzaki's worn gear as a late FOUND prize).

### 2.10.1 The weapon roster (incremental, ~9–10 across v1)

**(a) What it is.** A **growing, period-appropriate weapon roster** spanning **3 archetype lines**. **T0
starts with exactly ONE weapon** and unlocks **+2 across the tier**; the roster grows **+3 at T1** and
**+4 at T2** — **~9–10 weapons across v1** (replaces the old "2–3 weapon lines at T0"; Q15/FU13). Each
weapon is an **archetype** (its `baseSpeed` / `reach` / `targetCount` / `attackProfile`) **+ a signature
ability** — so distinct combat identity lives on the **weapon**, not only on the stance. The crude
**carrying-pole is a 0th IMPROVISED weapon** (the convalescence-era stick), **not a line of its own.**

**(b) How it grows.** New weapons are **FOUND** (drops) and **CRAFTED** (the component chain, §2.11), never
gifted, and reveal **one at a time** on the combat-reveal ladder (§2.8.2). The **2nd archetype line opens at
T1**, the **3rd at T2** (each on a Combat Rank rung-gate). Signature abilities deepen at weapon-line
milestones (L10 unlocks the ability/item slots; richer signatures ~L25/L50 — *proposed v1 balance*).

**(c) Rough DATA shape.**
- `WeaponArchetype { id, line ('1'|'2'|'3'), baseSpeed, reach, targetCount, attackProfile,
  signatureAbilityId, foundOrCrafted }` — the **per-weapon** `baseSpeed`/`reach`/`targetCount` are the
  single source of a weapon's identity (the old global `baseSpeed = 1.0` is **superseded**; §4.6.1/§4.6.2).
  These params are authored **byte-identical** to §4.6 and `content/items.ts` (§6.5).
- A weapon's improvised 0th entry carries a minimal archetype (slow, short, single-target) and **no**
  signature. *(Exact per-weapon numbers → §4.6 — proposed v1 balance.)*

**(d) Ties to the four pillars.** **Arms** (better weapons → more achievable deeds). Crafted weapons also
exercise the smithing chain that feeds **Estate & Wealth** (tools/trade goods, ≤ ⅓ trade cap).

**(e) When introduced / fractal reveal.** **T0-R3** the single starter weapon; **+2** more across T0; the
roster then grows **+3 (T1) / +4 (T2)** across the tier ladders, each weapon a one-at-a-time reveal beat.

---

## 2.11 Crafting (hybrid: simple → component/quality)

**(a) What it is.** **Canon: HYBRID** — **simple recipes early; the component/quality system unlocks
later.** Early crafting is a flat recipe (inputs → output). Later it becomes **component-based**: an item
is built from components, and **quality = crafter skill + component quality + station tier**, with
**processing chains** (wood → charcoal → forge → tools → blades; hides → tanner → armour; cocoons →
silk → woven textile). **Disassembly returns materials.** **Crafting surfaces as its own TOP-LEVEL nav
tab** (Q10), not a nested panel.

**(b) Player-facing behaviour / loop.** Early: gather inputs, craft a tool/item at a station (a sickle,
a repaired tool) — simple and legible, gating a small bonus; **repair / re-craft restores a weapon's or
armour's durability to max** (the graded-band system, §2.8(b)/§2.10; FU17). Later: choose components of
varying quality and a station tier to influence the output's quality tier; build multi-step chains;
disassemble to recover materials. **Bulk sales of a crafted good apply the saturation damper PROGRESSIVELY
per-unit** (each unit walks the price down; §2.4 — Q42). The **silk / sericulture *meibutsu*** is the
signature late craft/trade chain (cocoons → reeled silk → woven/graded textile), led by **Weaver Onatsu**,
threading T1→T4 under the trade ≤ ⅓ cap; **its trade/coin economics are deferred to M4** (§2.4 — Q13).

**(c) Rough DATA shape.**
- `RecipeDef { id, mode ('simple'|'component'), inputs[], output, stationTier, skillRequired,
  revealPredicate }`
- `ComponentCraft { componentSlots[], qualityFormula (crafterSkill + componentQuality + stationTier),
  outputQualityTier }` (the *shape*; numbers → §4).
- `StationDef { id, tier, recipesEnabled[] }`; `ChainStep` links processing stages.
- `RepairAction { equipId, restoresDurabilityToMax: true }` (the graded-band restore; FU17).
- Quality tier is part of an item's stack key (so a fine *yari* and a crude one don't merge).

**(d) Ties to the four pillars.** **Estate & Wealth** — crafted trade goods (esp. the silk *meibutsu*)
convert to recorded trade/yield within the **TRADE sub-engine (≤ ⅓ of Estate & Wealth)**; proto-industry
levers feed the LAND/TREASURY strands. Crafted **gear** feeds **Arms** (via 2.10). A graded *meibutsu*
later feeds **Name & Honour** (a famous product celebrated up-tier).

**(e) When introduced / fractal reveal.** **T0** — simple crafting (the **Craft top-level nav tab** / first
tool) around R4, with the graded-durability bands. The **component/quality system + processing chains**
unlock at **T1+** (smithing chains, then the silk sub-engine at V3). Each chain arrives minimal (one recipe,
one station) and deepens fractally.

---

## 2.12 Dialogue & quests (open-ended, non-hand-holdy)

**(a) What it is.** The narrative + unlock delivery vehicle, and a core part of the **universal
rewards/unlock bus.** **Dialogue** = textlines that grant a `RewardBundle` and can lock other lines
(branching), gated by `display_conditions` (reputation / rank / season / skills / flags), **with
intra-line BRANCHING in v1** (Q34/FU22). **Quests** = an **order-free SET of advance-events** (no fixed order, no `step` cursor; D-Q-B14) advanced by game events. **Canon
quest design: open-ended, NON-hand-holdy** — a quest is **a suggestion + a story you find out in the
world**, never an A→B→C waypoint list; **fewer checklists overall**; the dominant minute-to-minute
behaviour is the **incremental grind.** **No fixed quest-type budget (Q23 supersedes D-012's "lean 4"):**
**PEST CONTROL, HUNT, CLEAR, DEFEND** (the deeds-earner) are the **T0 STARTING set**, *not a cap* — author
**whatever quest types fit each stage**, more/interesting welcome especially at later tiers
(escort/patrol/bounty/duel/investigate/etc. are **no longer hard-parked**).

**Intra-line dialogue branching (v1; Q34/FU22).** A node carries a **flat `choices[]` list**; picking a
choice applies its effect — `locksLineIds[]` (closes off other lines) and/or `flags` set — and the
conversation branches. It is **DATA, not scripting**, and **deterministic (no RNG)**; **only the chosen
flags persist** (save-light). Authored in **`content/dialogue.ts`** (added additively at its milestone,
not pre-declared in M0 — FU5).

**(b) Player-facing behaviour / loop.** Talk to NPCs (gatekeepers who do double duty as story threads);
lines unlock content, advance flags, and **offer in-line choices** that lock/branch. Take a quest as an
*aim + a rough where* (e.g. "something is in the lower field at night"), then **read the world** to find
the truth (one boar or a sounder? where does it den?) — preparation and approach are the player's. Quest
events drive the unlock graph. The **Quest log is a TOP-LEVEL nav tab** (Q10). **Per-tier side-quest lists
never gate the spine** (§1.9).

**(c) Rough DATA shape.**
- `Dialogue/TextLine { id, speaker, text, displayConditions (predicate), rewards: RewardBundle,
  locksLineIds[], choices?: ChoiceId[] }` — `choices[]` carries the intra-line branches.
- `Choice { id (ChoiceId), label, effect: { locksLineIds[]?, flagsSet[]? } }` — **deterministic; only
  chosen flags persist.**
- `Quest { id, type ('PEST_CONTROL'|'HUNT'|'CLEAR'|'DEFEND'|…author-as-needed…), suggestionText,
  openEnded: true, advanceEvents[], rewards: RewardBundle, gatesSpine: false (for side-quests),
  repeatable?: boolean, maxAwards?: number }` — **the type union is OPEN** (no parked cap; author
  whatever fits). **Repeatable deeds (D-Q3):** a deed/quest may set `repeatable: true` with a
  `maxAwards: N` ceiling, so the same recognized deed can pay its `RewardBundle` (incl. `pillarDeltas`)
  **up to N times** — the schema that supplies the **great/excellent supra-good surplus** deed-counts per
  pillar/tier (§4.1/§4.2; a non-repeatable deed is the `maxAwards: 1` default).
- **Runtime quest state (§6.4):** `{ status: QuestStatus; advancedBy: Set<QuestEventId> }` where
  `QuestStatus = 'taken' | 'active' | 'abandoned' | 'done' | 'failed'` — **NO `step` cursor;** `advancedBy`
  is the **UNORDERED SET** of advance-events already satisfied (a quest is a SET of advance-events with **no
  fixed order**; D-Q-B14), completing (`done`) once its required `advanceEvents[]` are all in the set **in
  any order**. Each event may carry `optionalDiscoveryNodes[]` — discovery, not waypoints.

**(d) Ties to the four pillars.** All four, indirectly: quests are *how the player performs the deeds*
that the authorities recognize. **DEFEND** remains the canonical combat **Arms** standing-earner.
Crucially, **a quest/deed plays into one of two tracks by PHASE (§2.15.1):** some completions are the
**per-rung CURATED activities** that feed the **Combat Rank rung-meter in PHASE 1**, while the recognised
**pillar DEEDS** (incl. DEFEND-as-Arms) accrue in **PHASE 2** (FU7) — never on the rungs. Labour/office
quests feed **Estate & Wealth** / **Standing & Office**; recognition/petition quests feed **Name & Honour**.
The reward bus can carry `pillarDeltas` for recognized completions (achievement jumps, per-event capped) —
applied only in Phase 2.

**(e) When introduced / fractal reveal.** **T0** — dialogue from the open (the guide/steward beats);
the **quest log (top-level tab)** reveals around **R5** (with the pest-control/hunt/clear/defend types;
**curated combat activities begin feeding the Combat Rank rung-meter here** — but the **Arms PILLAR deeds
do not accrue until Phase 2**, post-R7). Quest scope grows per tier (valley-scale at T1, region-scale at T2
with the personal-mystery payoff). New quest types are authored wherever they fit (no budget).

---

## 2.13 Lore, inn rumours & the belief→cause engine

**(a) What it is.** The **light-flavour folklore delivery system.** Folklore is **NOT the spine**; it
arrives as **optional tidbits via the village inn's rumours board** (Innkeeper Sukezō), each a
lightweight yokai story the player **may** investigate. **Canon hard rules:** every rumour-quest is
**optional** and **NONE gate tier progression**; each unlocks **organically and design-staggered** (per
tier; more unlock as the estate & village grow — never an all-at-once dump; aligns with FU4); each resolves
**one-to-one to a concrete human/natural cause** with **dawning dread, never a Scooby-Doo unmasking** (the
game lingers in the unease before resolving). **Residual ambiguity is hard-capped at ≤ 1** unresolved,
off-screen, mundane-readable beat — **the unidentified-hand offering at the jizō at the weir/ford** (the
**single co-located find-spot** where he was pulled from the river; Q11). Folk-religion texture
distinguishes **Shintō** (shrine, *shimenawa*, soul-calling rite) from **Buddhist** elements (roadside/
boundary *jizō*, Bon offerings, the temple register of the vanished — which becomes hard evidence). **No
rite ever mechanically "works"; nothing is confirmed supernatural; there is never player magic.**

**(b) Player-facing behaviour / loop.** Read the rumours board → optionally pick up a belief-beast
INVESTIGATE-then-confront one-shot (e.g. the "kappa" of the ford = undertow + a snapping turtle/large
catfish, tied to smugglers' sinking-spot; the "fox-fire" ridge = a hidden charcoal kiln; the "one-eyed
mountain god" = Hanzaki + fog-blind terrain). Investigate through ordinary work/travel; the unease
lingers, then resolves to a grounded cause. Also surfaces lore scrolls/registers (temple register, the
household Journal) read at the cost of in-game time. A **belief→cause table** is authored region-wide
before any node with new omens (so the ≤ 1 cap provably holds).

**(c) Rough DATA shape.**
- `Rumour { id, boardText, unlockPredicate (per-tier, organic/design-staggered), linkedBeliefBeastId?,
  optional: true, gatesSpine: false }`
- `BeliefBeast` (in its **separate registry `content/beliefBeasts.ts`** — §2.9) `{ resolvesToCause,
  dread-beats[], oneShot }`.
- `BeliefCauseTableEntry { belief, groundedCause, isResidualAmbiguity: false }` — exactly **one** entry
  game-wide has `isResidualAmbiguity: true` (the **jizō at the weir/ford** — the single find-spot),
  enforced by the content verifier.
- `LoreScroll { id, readCostTicks, unlocks: RewardBundle }`.

**(d) Ties to the four pillars.** **Name & Honour** lightly (a sponsored rite, a respected investigation
can colour the house's name), but folklore **never gates the spine and is never a primary pillar
source.** Most rumour payoff is *feeling, allies, and flavour*, not power.

**(e) When introduced / fractal reveal.** **T1** — the inn & rumours board reveal in the village; the
opener is the "kappa" of the ford. Rumours unlock **organically, design-staggered and per-tier** (more as
the estate/village grow). The residual-ambiguity **jizō at the weir/ford** beat is a T0–T1 boundary node
(the find-spot) that **lingers unresolved** by design.

---

## 2.14 World simulation (seasons / weather / festivals)

**(a) What it is.** The living-world layer on top of the clock (2.2): **seasons** (kanji tags driving
the rice cycle, foraging windows, and the seasonal judged results), **weather hazards** (cold/wet
affecting labour/combat), **lunar phases**, **festivals** (Bon, seasonal rites — social/economic hubs,
e.g. Brewer Tokuemon's festival hub), **vendor restocks**, and **food rotting/fermenting**. Weather hazards
and festivals carry **MECHANICAL effects, bounded ±10%** on labour/combat rates (plus festival economic
beats; Q35). **Active-only**, scheduler-driven, deterministic. **Weather and lunar phase are DERIVED** from
the **day-keyed RNG sub-stream** (`deriveDayKeyed`, §2.2/§2.19 — Q3/FU3), **not stored.**

**(b) Player-facing behaviour / loop.** The world changes around the grind: plant/harvest by season;
weather nudges what's worth doing (a **bounded ±10%** rate swing, never a hard block); festivals offer
time-boxed social/economic beats; the **seasonal appraisal** (harvest result, autumn audit, security
appraisal) fires the **judged-result Influence** when a new high-water mark is reached (weather/festivals
modulate that judged result **±10%**; §2.16). Reinforces "the world enlarges as numbers go up."

**Seasonal-reward ROTATION — the 2nd T2 anti-slump lever (Q22/D-Q-seasonal-rotation).** From **T2**, each
season features a **rotating featured deed / bonus** — a per-season highlighted recognized-deed (or an
accrual bonus on a chosen pillar/activity) — that refreshes *what is most rewarding to chase* as the
seasons turn, so the Phase-2 grind never flattens into one optimal loop. It is the **2nd late-game
anti-slump device alongside the cross-pillar combos** (§2.16/§4.3.1). The featured bonus rides the normal
accrual shapes (capped jumps / judged results) — it **never** bypasses the per-event cap, the trade-≤⅓
cap, or the gate-threshold check (it changes *which* deed pays most this season, not the gate maths).

**(c) Rough DATA shape.**
- `SeasonRules { perSeason: { activeNodes[], yieldModifiers, weatherWeights } }`
- `Festival { id, season/day, effects (vendorRestock | socialBeat | reputationOpportunity |
  economicBeat), revealPredicate }`
- `SeasonalRotation { season, featuredDeedId? , accrualBonus? (pillar/activity + bounded magnitude),
  revealTier: 'T2' }` — the per-season featured deed/bonus (the 2nd T2 anti-slump lever; obeys all caps).
- `WeatherHazard { kind, rateModifiers (labour/combat, bounded ±10%) }` (soft, never hard-blocking —
  pairs with 2.3; the **active weather/lunar phase is derived day-keyed, not a stored field**).
- World-sim content (`SeasonRules` / `Festival` / `WeatherHazard`) is authored in **`content/world.ts`**
  (with a **`content/festivals.ts`** row), generated/verified like the other registries (Q55).
- Reuses `WorldClock` + `Scheduler` + `SeasonalAppraisalState` from 2.2.

**(d) Ties to the four pillars.** The **timing/source of the seasonal JUDGED RESULTS for all four
pillars** (harvest → Estate & Wealth; security appraisal → Arms; an inspector's seasonal report → Name &
Honour; an office's seasonal account → Standing & Office), each **modulated ±10% by weather/festivals**.
Always **new-high-water-mark only**, never a repeatable per-season maintenance trickle.

**(e) When introduced / fractal reveal.** **T0** clock first; **T1** brings seasons/weather/festivals to
life (and the village social calendar). Festivals/weather deepen per tier (regional Bon at T2, etc.).

---

## 2.15 Factions & reputation (estate ladder, village web, origin ties, allegiance)

**(a) What it is.** Three starter factions, **deliberately distinct in SHAPE** so they never read as
one bar painted three colours, plus the **Tama-vs-farmhand allegiance**. **More factions/zones bloom per
tier** (the §1.7.1 / world-expansion cut-set; **v1 ships only the three starters + the six cross-cutting
SEEDS** embedded in the starter region — porter's-knot, Sōan/Obaa Kuni, the artisans, the rice-broker,
Ryōa's shrine+register, Magobei/Yagōemon's skim).

- **ESTATE (main) — a fresh rank LADDER per tier, climbed in TWO SEQUENTIAL PHASES (§2.15.1).** The only
  faction structured as a discrete, gated ladder (rising through it *is* the perseverance fantasy and the
  dominant UI-reveal driver). **~8 rungs per tier** (T0 R0→R7, T1 V0→V7, T2 enumerated). **Rungs interleave
  LABOUR and COMBAT**; **combat is first-class from T0** (incremental — one weapon, a growing roster).
  **Phase 1 (climb the rungs)** is driven by **two earned RUNG-METERS (per-rung progress meters, NOT economy
  currencies): Estate Service** (the labour rung-meter) and **Combat Rank** (the martial rung-meter —
  *renamed from "Combat Standing"*, Q9). Each meter is **numeric and PER-RUNG-RESET**, fed by **curated
  per-rung activities** (a designed one-to-many set, not a single repeat-counter), and each rung promotes on
  an **AND-gate** (the rung-meter ≥ threshold **AND** the rung's story milestones — the UI reads "awaiting X"
  when one side lags). **Phase 2 (grind the house up)** — the estate-influence / four-pillar grind — opens
  **after the final rung**, and the tier's **pillar DEEDS accrue there and ONLY there** (FU7). **Labour
  conditioning is a one-way enablement gate** on the combat rungs (**ZERO** combat stat / training-rate
  bonus; the **per-skill perks of §2.7.1 are a separate, small channel** — conditioning alone grants zero).
  The estate cast & buildings **grow per tier** as **flavour / light systems** (build/recruit — **NOT** a
  people-management sim; no labour-gang, no managed sub-economy, no assignment panel).
- **VILLAGE of Asagiri (side) — a static reputation WEB.** Continuous, **multi-node** meters (not a
  ladder): per-shop "patron/regular" standing (smith Gonta, dry-goods/rice broker, herbalist **Obaa Kuni**,
  brewer Tokuemon, **weaver Onatsu — lead of the silk *meibutsu***), per-family goodwill (raised by
  **open-ended help**), an artisans'/craft-guild standing, and the **Village Chief's regard** (headman
  Yagōemon — a weighted roll-up). **Gentle curves** (linear/soft-cap) for frequent small dopamine.
  **Cast mostly STATIC.** **Village standing NEVER gates the UI ladder or the tier climb** (ignoring it
  leaves you poorer and lonelier — a viable-but-poorer playstyle, never a wall).
- **ORIGIN (side, memory-gated SUPPORT track) — a ONE-TIER standalone rep ladder (`O0→O5`).** Tahei's
  **living** family/friends in **Sawatari-juku** (mother Oyuki, **father Jinpachi**, sister Okimi, employer
  Denbei, friend Kanta, sweetheart Osen, the porter guild). **Opens at T2-G2** on the **doubly-earned** gate
  (dream-memory **AND** travel-standing); the dream foreshadows it from early game. A **proper one-tier
  reputation side-track with its own short rung ladder** (`O0→O5`, §3.6.2 — kept LIGHT, 6 rungs, never a
  second spine), tracking the MC's standing with his origin community. Payoff = **support, not local power**:
  pride/morale (a modest global skill-XP buff framed as a *present-day relationship*), allies (recruited
  porter mates), trade ties (origin-town goods/routes plugging into expansion, shaving **~10–15%** off
  time-to-next-tier). **Hard guardrail (rescoped, Q12):** **returning MEMORY (the backstory reveal) grants
  ZERO retroactive bonus** — no stat, recipe, tool, or combat bonus; it grants **access** only. But the
  **present-day relationships** you then build **are legitimate mechanics that STAY** (the morale buff + the
  ~10–15% trade-tie speedup are *earned new relationships, not gifts from remembering*). At least one origin
  beat is always available **without** reputation-gating (the thread never stalls); the track **NEVER gates
  the spine**. **Reclaiming the name "Tahei" is the Origin O5 capstone — EARNED and MISSABLE** (a player who
  skips the Origin track may never reclaim it; Q5/D-036), **separate from** the lost-child **TRUTH** (that he
  is *not* Tama; **Otsuru** is), which stays **spine-guaranteed at G6 for every player** (§5).
- **The Tama-vs-farmhand allegiance** — a **continuous, re-swingable leaning** (village-leaning ↔
  estate-leaning, default neutral, never frozen). **Rebalances rates & flavour, NEVER availability** —
  both factions fully completable on either lean; neutral is a valid in-character stance. **Faction
  tension is light / flavour — no mechanical penalty.**

**(b) Player-facing behaviour / loop.** Climb the estate ladder (the spine) **two phases per tier** — climb
the rungs (Phase 1), then grind the pillars (Phase 2); raise village per-node meters by trade and
open-ended help; restore origin ties as memory + travel-standing allow; nudge the allegiance through
dialogue and where you invest labour. **Separate earned rung-meters + the separate four-pillar grind** keep
the tracks from collapsing into one bar. Above them sits **House Influence** (2.16); village allies and
origin trade-ties act as **multipliers/feeders** (tuned so weaving both in shaves **~10–15%** off time-to-
next-tier — *felt, never a wall; never a new pillar*).

**(c) Rough DATA shape.**
- `EstateLadder { tier, rungs: RankDef[] }`; `RankDef { id, track ('labour'|'combat'|'mixed'|
  'admin-as-narration'), earnedBy (rungMeter ≥ threshold AND storyFlags — an AND-gate), rungActivityTags[]
  (which curated activities advance which rung-meter), unlocks: RewardBundle }`. Two **per-rung-reset**
  meters: `EstateService` (labour) and `CombatRank` (martial; *renamed from `CombatStanding`*, Q9) — each
  numeric, threshold = **(≥30-min floor × that rung's eligible-activity rate)**, back-solved like the koku
  column so meter and floor stay in lockstep (§2.15.1; numbers → §4). **Double-counting across streams is
  allowed, but each stream sums independently.**
- `VillageWeb { nodes: { shopId|familyId|guildId → meter (gentle curve) }, chiefRegard (rollup) }`.
- `OriginLadder { tier:'T2', rungs: RankDef[] (O0–O5), meter: OriginTies (gentle), prideBuff (global
  skill-XP, present-day-relationship-framed), allies[], tradeTies[], nameReclaimAtO5 (earned + MISSABLE) }`
  — a one-tier standalone rep ladder; every asset still grind-built; never a spine trigger.
- `Allegiance { value (-1 village … +1 estate, default 0), affects: rates+flavour only }`.
- `FactionMultiplier { source (village|origin), influenceSpeedup, budgetShare (apportioned so the
  combined ≈ 10–15% off time-to-next-tier, never exceeded) }`.

**(d) Ties to the four pillars.** The **estate ladder generates Influence directly** (labour → Estate &
Wealth; combat → Arms; offices → Standing & Office; recognition → Name & Honour) — but **only the Phase-2
DEEDS accrue to the pillars** (the Phase-1 rungs feed the rung-meters, not the pillars; §2.15.1). **Village
& origin are multipliers/feeders into the pillars, never new pillars.** The allegiance shifts *gain rates
and flavour*, never which pillars are reachable.

**(e) When introduced / fractal reveal.** **T0** — the estate ladder (R0→R7) and its two **rung-meters**
(Phase 1), then the four-pillar grind (Phase 2) after R7. **T1** — the village web (one contact/one shop
first, then meters fan out) + the silk sub-engine. **T2** — the origin support track opens at G2 (memory +
travel-standing gated) as its own one-tier rep ladder (`O0→O5`, §3.6.2) and a fresh region estate ladder
(`G0→G7`) mints alongside. Each new faction/zone arrives **minimal** (one contact, one place, one verb) and
unlocks fractally.

### 2.15.1 Sequential per-tier progression — rungs (Phase 1) → pillar grind (Phase 2) (FU7/FU6/FU11/Q30/Q7)

This is the **shared home** for the V2 progression spine that §2.15 and §2.16 both build on (the canonical
conceptual statement is §1.6.4; exact curves/thresholds are §4 — *proposed v1 balance*).

**(a) The two ordered phases.** Each tier is climbed **sequentially**:

- **Phase 1 — climb the rungs (R0→R7 etc.).** Driven by **curated per-rung activities** (a designed
  **one-to-many** set per rung, **NOT** a single repeat-counter; FU7) tracked by the **per-rung-reset
  rung-meter** + the rung's **story milestones**. Promotion is an **AND-gate**: `rungMeter ≥ threshold`
  **AND** `storyFlags satisfied` (the UI surfaces "awaiting X" when one side lags; FU6). Two rung-meters run
  in parallel: **Estate Service** (labour) and **Combat Rank** (martial). **Pillar DEEDS do NOT accrue here**
  (the structural fix against "half the rungs, maxed deeds").
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind** — and the tier's **pillar DEEDS accrue here and ONLY here** (FU7). Clearing the tier's
  **hybrid good/great/excellent pillar profile** (§2.16) is then what **tiers up.** *(Revised from "the
  capstone confirms the tier": the capstone confirms **Phase 1**; the **Phase-2 hybrid pillar gate is the
  actual tier-gate**, ANDed with the capstone rung.)*

**(b) The rung-meter accrual law (D-024).** Both meters are **numeric and PER-RUNG-RESET**; each rung's
threshold = **(≥30-min-per-rung floor × that rung's eligible curated-activity rate)** — **back-solved from
the same ≥30-min floor** the §4.8 pacing model and the §6.6 gate-monotonicity verifier use, so the meter and
the floor stay in lockstep. The **Combat Rank** rung-meter is fed by **per-rung CURATED combat activities,
NOT raw kills/XP** (FU14) — kills feed the character (combat) level instead (§2.8.1). **`rungActivityTags`**
tag which activities advance which rung; double-counting across streams is allowed, but **each stream sums
independently** (verifier-asserted, §2.20).

**(c) There is NO stored "phase" flag.** The current phase is **derivable from the current rung**
(pre-capstone = Phase 1; post-capstone = Phase 2) — no extra `GameState` field (§6.4).

**(d) Rough DATA shape.**
- `RungMeter { id ('EstateService'|'CombatRank'), value, perRungReset: true, thresholdForRung (back-solved
  ≥30-min floor × rate) }`.
- `RungGate { rungId, rungMeterThreshold, requiredStoryFlags[] }` — the **AND-gate**.
- *(Phase derived: `phaseOf(currentRung) = currentRung === capstone ? 'phase2' : 'phase1'`.)*

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

**Accrual = two shapes only — never a passive time-trickle, never a flat per-action increment — and ONLY on
the PHASE-2 estate-influence track (FU7):** pillar **DEEDS do not accrue while climbing the rungs** (they
are gated **post-final-rung**; §2.15.1), which prevents a "half the rungs, maxed deeds" state.
- **(A) Achievement JUMPS** — a concrete deed **recognized** by the relevant authority (a recorded
  yield, a granted title, a sealed contract, a road declared safe in the books, a won petition).
  **Per-event caps** so no single fight or harvest spikes a pillar.
- **(B) Periodic JUDGED RESULTS** — a season's harvest, an autumn audit, a security appraisal — a judged
  result of accumulated state, fired on a **new high-water mark** (NOT repeatable maintenance awards).
  **Weather and festivals modulate these judged results mechanically, bounded ±10%** (day-keyed; §2.14 —
  Q35); **bulk sales** apply the **saturation damper PROGRESSIVELY per-unit** (§2.4 — Q42).

Influence is **up-only**, with a small, scripted, **per-pillar** set of **recoverable DENTS** (a lost
battle dents Arms; a scandal dents Name; a called debt dents Estate) — **small and NEVER a wipe** (no
permanent holding-loss; a failed defence damages/disables a holding *temporarily*, recoverable by
rebuild). **Dent self-heal (Q32):** a small **below-high-water seasonal RESTORE** lifts a dented pillar back
toward its untouched high-water mark **WITHOUT advancing the high-water** ("self-heals, never a wipe,
never over-credits").

**Tier gating = the HYBRID good/great/excellent pillar PROFILE (V2 — supersedes simple thresholds;
Q7/FU10/D-028).** Tier-up is **no longer** "one or two pillars clear a stated threshold" (that "simple
per-tier required-pillar thresholds" framing is **superseded**; the older balanced-development floor +
overflow stays rejected). Instead, each tier gates on a **specialisation profile across the pillars
REVEALED by that tier**: you must be **good in ALL revealed pillars · great in 2–3 · excellent in 1–2**
(**NO overflow-substitution** — breadth required, specialisation rewarded). Semantics: **good = the expected
baseline · great = really strong · excellent = above-and-beyond.** The **revealed-pillar set grows per
tier** — **T0 = 2** (Arms + Estate; a **2-pillar special case**: good in both, **one** excellent), **T1 = 3**
(+ Office), **T2 = 4** (+ Name) — and the gate is **only ever checked against revealed pillars** (never
"good in ALL" against an unrevealed one). The required pillars still **drift** as they reveal (early tiers
lean Arms + Estate, "survive and get strong"; upper tiers lean Office + Name, "win it socially"). This
**per-pillar-per-tier threshold set needs a full OVERHAUL** (not simple ratios) — **back-solved against the
fixed §4 deed inventory** — so **exact numbers are deferred to §4** *(proposed v1 balance)*. The hybrid
profile sits in **Phase 2** and is **ANDed with the capstone rung-meter + story** (§2.15.1/FU11). The **only
structural cap that survives is trade ≤ ⅓ of Estate & Wealth** (so trade can never carry a gate). **Plus a
per-tier transition STORY GATE** (see table).

| Tier | Transition story gate (entry) | Phase-2 pillar profile (good/great/excellent) |
|------|-------------------------------|-----------------------------------------------|
| **T0 Estate** | *(met at the open)* survive convalescence + first labour | **2-pillar special** (revealed: Arms + Estate): **good** in both, **one excellent** (humbling first fight survived; first *shinden* begun; *kura* solvent — LAND/TREASURY deeds, **no market yet**). |
| **T1 Village** | enough estate work + **basic repairs** → sent into the village | Revealed: Arms + Estate + **Office**. **Good in all three**, **great in 2** (errand-authority; headman's regard; cash-crops online). |
| **T2 Region** | **"clean your room"** (estate healthy, village happy, fires out) → grow regional influence; rival houses appear | Revealed: Arms + Estate + Office (+ **Name** surfacing → 4). **Estate + Office great/excellent, Arms good**; the **personal-mystery payoff** lands here. |
| **T3 Castle-town** *(stub in v1)* | **win the region** → the castle-town rulers confer regional leadership + **invite the house in** (the **castle-town / Daikan's-Office first-contact** beat; v1 ends here, Q24/D-040) | **Office + Name excellent** (won socially); Arms/Estate as leverage. |
| **T4 Edo** *(roadmap)* | a **"taste of Edo"** — staff & run the *domain's* Edo establishment (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence | **Name + Office excellent** (the national *banzuke* on all four pillars). |

**Cross-pillar combos — the T2 anti-slump (Q22/FU20/D-031; Model-A — D-Q5).** From T2, **broader
cross-pillar combos** (multiple pillar pairs, larger magnitude) join the **seasonal-reward rotation**
(§2.14) as the late-game anti-slump device. **Model-A: a combo credits BOTH pillars of its pair** (never a
phantom "third" Name pillar). Combos are **computed AFTER the trade-≤⅓ clamp** and counted **inside** the
deeds budget + per-event cap, **but they do NOT write the additive deed-only `gateEligibleValue`
accumulator** — so they are **EXCLUDED from the gate-threshold check** (a combo can **NEVER** substitute for
being "good in ALL revealed pillars") **and EXCLUDED from the trade ratio / ≤⅓ denominator** (D-Q-meibutsu).
The **§6.6 verifier proves a combo can never breach the ⅓ trade cap nor satisfy a required gate band** (a
narrow, no-leakage §4.3 exception). Trade ≤ ⅓ stays a **HARD** structural cap.

**(b) Player-facing behaviour / loop.** Perform recognized **Phase-2** deeds → watch the relevant pillar
JUMP (capped) or rise on the seasonal appraisal → clear the tier's **hybrid good/great/excellent profile
over its revealed pillars** **and** the capstone rung + story gate → the next tier's canvas opens (no
reset). The **four-bar standing panel** makes the pillars legible once revealed; **each bar shows
DISTANCE-TO-NEXT-GATE** (Q21). **The breadth gate stays HARD — no substitution, no overflow** — but the
**per-pillar shortfall is surfaced EARLY + CONTINUOUSLY from early Phase 2** (the lagging pillar reads
plainly, e.g. *"Name is behind"*), so a breadth shortfall is **never an end-of-Phase-2 surprise**
(D-Q-breadth-wall/Q5). Number-flash uses the §2.21 gain/loss tokens (**gain = `--ai`, loss =
`--beni`**; vermilion reserved for rank-up / seal beats). Side factions visibly speed the climb
(multipliers) without changing what's reachable.

**(c) Rough DATA shape.**
- `Influence { arms, estateWealth (subEngines: { land, treasury, trade(≤⅓ cap enforced) }), office,
  name }` — kept separate from `resources` (2.4). **Per-strand high-water marks** live under
  `estateWealth.subEngines` (for the trade-≤⅓ clamp + the dent-restore branch). **The Estate & Wealth
  pillar value is PURELY DERIVED — `land + treasury + trade` summed on read, NEVER a stored aggregate
  field** (so a dent on one strand can never desync the roll-up and trade-≤⅓ holds by construction —
  D-Q-estate-dent; cross-ref §6.4).
- `AccrualEvent { kind ('jump'|'judged'), pillar, sourceDeedId, amount (capped), highWaterMarkCheck,
  phase: 'phase2' (deeds only ever accrue in Phase 2) }` — **deeds also write the additive deed-only
  `gateEligibleValue` accumulator per pillar (the value the gate-band check reads); combos do NOT**
  (Model-A — D-Q5).
- `Dent { pillar, amount (small), scriptedSourceId, recoverable: true, seasonalRestoreBelowHighWater: true
  }` (restore lifts toward — never past — the untouched high-water; Q32).
- `TierGate { tier, revealedPillars[], pillarBands: Record<pillar, { good, great, excellent } thresholds>,
  distributionPredicate (good in ALL revealed · great in 2–3 · excellent in 1–2; NO overflow),
  capstoneRungAnd (the Phase-1 capstone rung + story), storyGateFlag }` — **the hybrid distribution
  replaces the old `requiredPillarThresholds` map; there is no floor/overflow field.**
- `CrossPillarCombo { pillarPair, magnitude, creditsBothPillars: true (Model-A), computedPostTradeClamp:
  true, writesGateEligibleValue: false, excludedFromGateCheck: true, excludedFromTradeRatio: true }`.
- `TradeCap { tradeStrand ≤ ⅓ * estateWealthTotal }` (structural invariant, verifier-checked — combos
  cannot breach it).
- *(All thresholds/caps/weights/formulae → §4.)*

**(d) Ties to the four pillars.** This **IS** the four-pillar system — the macro roll-up everything else
feeds. Every other system's **Phase-2** deeds funnel here through the accrual shapes (A)/(B).

**(e) When introduced / fractal reveal.** Pillars accrue from **Phase-2** deeds, but the **four-bar House
Influence panel becomes visible/tracked at T0-R7** (the capstone that opens Phase 2), so the player first
*climbs the rungs*, then *grinds and sees* the standing they build. The **revealed-pillar set grows per
tier** (T0 = Arms + Estate → T1 + Office → T2 + Name) — the panel's bars reveal **one at a time** in step
with §3's reveal schedule (no "good in ALL" check against an unrevealed pillar). The **hybrid Phase-2
profile + capstone rung + story gate** pace the whole climb (T0→T4); v1 reaches the **T2** gate (T3 stub,
T4 roadmap).

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
**v1 covers stages E0–E3** (E0 Foreclosure's Edge → E1 Stabilising → E2 Recovering → **E3 Prosperous /
Recovering+**; Q8); **E4–E5 parked.**

**(b) Player-facing behaviour / loop.** Spend koku / coin / materials / labour (sometimes a martial
prerequisite like "roads cleared") to raise the next structure — every build a **diegetic beat** ("the
frame is raised"), never silent menu inflation. Recruit/secondment adds **light roster cards** (role +
one-line hook + a data-driven contribution slotting into existing idle-producer/garrison systems). The
estate's physical growth runs **ahead** of top personal rank (buildings gate on the relevant **pillars**
— primarily **Estate & Wealth**, plus **Arms** for defensive works — **plus a LOW rank floor + cost, not
the capstone**). **The estate builds E1/E2/E3 are PHASE-2 content/beats per tier (D-Q-B2)** — they land in
**each tier's Phase 2**, where the pillar-Influence floors that gate them are reachable (§2.15.1), **NOT
Phase-1 rung content** (the builds become Phase-2 reveals that keep the back half alive — §4.7.5/§3.x). The
minute-to-minute texture stays **labour + combat grind**, not estate
micromanagement (guards against city-builder/4X drift). **E3 "Prosperous" is authored as a koku/Arms sink
folded into the G-rungs** (build/authoring cost only — the play-time budget is a **FLOOR**, FU18).

**(c) Rough DATA shape.**
- `EstateStage { id (E0…E3 in v1), econFabric[], martialFabric[], rosterCards[], pillarFloor, rankFloor
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
E2 (granary, two workshops, low palisade, 2–3 men-at-arms on a rota) build across T0→T1; **E3 Prosperous /
Recovering+** (a third workshop + full granary, the palisade closed into a proper perimeter, a standing
4–5-man rota, the *shinden* reclamation paying out — the house visibly **back on its feet**) is authored in
v1 (folded into the G-rungs, M5). Each structure reveals fractally (a drill yard = one post → a rack →
sparring slots). **E4–E5 parked** for post-v1.

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

## 2.19 Save / load (MULTI-BACKEND redundant + export/import)

**(a) What it is.** Persistence. **Canon (V2 — supersedes the single-IndexedDB framing; Q37/FU1/FU2/Q44):
a MULTI-BACKEND redundant save layer** — **IndexedDB (primary) + localStorage + sessionStorage** — written
**ATOMICALLY** (one `put`, never clear-then-rewrite), plus **base64 export/import to file**. On save, write
**all available backends**; on load, **read ALL backends and pick the NEWEST** by a **monotonic SAVE-COUNTER**
(the real selector) with a **save-layer timestamp tiebreaker** (a **documented core-lint exemption** —
metadata, NOT game logic; the deterministic core stays clock-free). Each save carries an **app-identity
MAGIC field** (`app: 'kami-kakushi'`). The schema is **BACKWARDS-COMPATIBLE / ADDITIVE** (new fields optional
with defaults, never removed/repurposed), with **raw-backup + rollback + a forward-version guard** as the
safety net. **Versioned MINIMAL-STATE** (recompute derived on load); **the seeded RNG (`{seed, cursors}`)
persisted.** **Built FULL in M0** (only the itch cross-origin-iframe partition test is deferred to M7).

**(b) Player-facing behaviour / loop.** The game autosaves transparently across the redundant backends; the
player can export a save to a text file and import it back (portability / backup). On load, the newest valid
backend wins (counter, then timestamp); derived stats are recomputed (so a bug in derivation never corrupts
the save). On any rejection a **calm "couldn't save — export a backup" notice** appears (never a scary "save
is dead" wall). **Explicit CONFIRM on destructive / genuinely-unrecoverable actions** — import / fresh-start,
plus the rare no-respec attribute allocation, rare-material consume, and narrative-route choices (Q19) —
with an **auto pre-overwrite snapshot.** Because **`Math.pow` is banned in core (integer-pow; §6)**, exported
saves **replay byte-identically cross-engine.**

**(c) Rough DATA shape.**
- **Persist ONLY non-derivable state:** `{ schemaVersion, app:'kami-kakushi' (magic), saveCounter
  (monotonic), savedAtTimestamp (tiebreaker only), rng: { seed, cursors: { combat, loot, seasonal,
  worldgen } }, worldClock: { tick, day, season, year } (weather/lunar DERIVED, NOT stored), total_xp per
  skill, character.level + xp (the combat-fed track), skill perks unlocked, attributePoints,
  unlock/finished/story flags, chosen dialogue-flags, inventory counts (with quality keys), equip state +
  durability, kill/clear/deed counts, current location, reputation/meters (EstateService, CombatRank,
  VillageWeb, OriginTies, Allegiance), Influence pillar values + subEngines{land,treasury,trade} + dents +
  per-pillar/per-strand high-water marks, quest/task status, active-effect remainders, estate stage (E0…E3)
  + built structures + roster, market-saturation state (the ONLY world-sim thing persisted) }`.
- **Recompute on load:** attributes, derived combat stats, production rates, what's unlocked, banzuke
  rank, **weather/lunar (`deriveDayKeyed`)**, and the current **phase** (derived from the current rung).
- **M0 skeleton** = `{ hp, satiety, attributePoints }` + `character.level (=1)` + `satietyMax`-at-floor;
  **do NOT pre-declare** `subEngines` / `CombatEncounterState` / dialogue `choices` — they are **added
  additively at their milestone** (FU5).
- `MigrationStep { fromVersion, toVersion, transform }` (ordered; rare, given the additive schema).

**(d) Ties to the four pillars.** Persists the `Influence` pillar values, sub-engines, dents, and
per-strand high-water marks so the up-only macro-progress is durable (and the never-a-wipe rule survives
reloads), across all redundant backends.

**(e) When introduced / fractal reveal.** **T0 (M0 — built FULL)** — the multi-backend redundant save +
newest-wins arbitration + magic field + additive schema ship in M0 (FU1); only the **itch
cross-origin-iframe** survival test is deferred to M7. Hardened across milestones as new state is added.

### 2.19.1 The multi-backend save layer (Q37/FU1/FU2/Q45/Q46/Q44 — built full in M0)

**(a) Backend abstraction.** A `SaveBackend` interface over **IndexedDB (primary) + localStorage +
sessionStorage**; each implements `read()` / `write(blob)` / `available()`. The save service writes to **all
available** backends (best-effort, **atomic single put** per backend — never clear-then-rewrite) and reads
**all** on load.

**(b) Newest-wins arbitration.** The selector picks the candidate with the **highest monotonic
`saveCounter`** (the **real** newest-wins selector); the **`savedAtTimestamp` is only a tiebreaker** when
counters are equal — and it is the **one documented core-lint exemption** (a save-layer metadata clock, NOT
game logic, so the deterministic core remains clock-free). The **`app` magic field** must equal
`'kami-kakushi'`; a bad/foreign id → **reject-to-recovery**.

**(c) Forward-version & integrity guard.** **Never load a forward-version backend** — fall through to the
newest *readable* one, then **reject-to-recovery** with a calm export-a-backup notice. Keep the **raw-backup
+ rollback** safety net. The **additive, backwards-compatible schema** (protobuf/thrift-style: new fields
optional with defaults; never remove/repurpose) keeps migrations rare.

**(d) Resilience target.** Survives the **itch.io cross-origin-iframe** partition / eviction (a backend may
be wiped or read-only in the iframe sandbox) — redundancy across three backends + export/import is the
hedge. *(The itch iframe survival test itself is the one M7-deferred piece.)*

**(e) Rough DATA shape.**
- `SaveBackend { id ('idb'|'local'|'session'), read(): Blob?, write(blob): ok, available(): bool }`.
- `SaveEnvelope { app:'kami-kakushi', schemaVersion, saveCounter, savedAtTimestamp, payload }`.
- `selectNewest(candidates) → max by saveCounter, then savedAtTimestamp` (the lint-exempt tiebreaker).

---

## 2.20 The DEV play API + content verifier

**(a) What it is.** Two QA systems. **The DEV-only play API** (`window.__qa`, stripped from production
via the build's DEV flag): read state, drive the game's verbs (the same typed intents the UI dispatches),
loop control (`tick`/`step`/`frames(n,ms)`, `pause`/`resume`), `new`/`load`/`save`, and **force-state
helpers** (jump to a late unlock / rare outcome / terminal screen). **Canon: expose a DEV-only play API
on `window` so the game can be driven and observed headlessly** (used by the `capture-game-states` skill).
**The content verifier** (`Verify_Game_Objects` equivalent) cross-checks all ids/refs across registries at
test time, and **balance/content docs are GENERATED** from the same data the game runs (`npm run gen:docs`
→ **`docs/balance/`** + **`docs/content/`**; duplicated derived values are tagged "illustrative — see
generated"; the `content/world.ts` world-sim registry is generated/verified like the others — Q41/Q55).

**(b) Player-facing behaviour / loop.** None (developer-facing). Powers **headless regression tests**:
force EstateService / **CombatRank** / character (combat) level / Influence / a story flag, fast-forward,
and assert **each reveal fires at the intended `GameState`**, that **pacing milestones hit on schedule**,
and the V2 invariants below. **V2 verifier checks (§6.6):**
- **Gate-monotonicity & ceiling** — no rung needs more than its tier can grant; rung-meter thresholds tie
  out against the shared **≥30-min floor** (§2.15.1/§4.8).
- **Accrual tie-out** — the Phase-2 deeds sum to each pillar's gate share within tolerance (the fixed deed
  inventory backs the hybrid bands).
- **Each combat track sums INDEPENDENTLY** — kills→character level, deeds→Arms, curated activities→Combat
  Rank meter; no cross-leakage (the three-track invariant, §2.8.1).
- **No-hidden-edge (FLIPPED, V2)** — was "labour→combat == 0"; now assert **each per-skill perk is
  SMALL-magnitude** (not zero, not a single global ≤CAP), **with conditioning still asserted == 0**
  (the zero-stat enablement exception; Q6/FU8).
- **Trade-can-never-breach-⅓-via-combo** — a cross-pillar combo (computed post-clamp, excluded from the
  gate-check) can never push the trade strand over ⅓ of Estate & Wealth, nor satisfy a required pillar
  (FU20/§2.16).
- **Belief→cause ≤ 1 ambiguity** — exactly one game-wide residual-ambiguity token (the jizō at the weir/
  ford; §2.13).
- **No system ever wipes Influence/holdings** (dents are recoverable; the seasonal restore never advances
  the high-water).
- **Real-name DENYLIST lint** — fictionalised-names guard (Toyama/Konoe and Mago/Naozane/Obaa Sato renamed;
  the retired Yagyū/Edogawa echoes **Munenori/Jūbei/Ranpo** likewise denied (→ Shigemasa/Kihei/Sōan);
  Nihonbashi allow-listed; Q27/Q39/Q11/Q12/Q28 / Block N.1 #3).
- **`Math.pow`/`exp`/`log`/trig lint** (§6.1) — banned in core (integer-pow; **`sqrt` whitelisted**; Q36).

**(c) Rough DATA shape.**
- `QaApi { state(), drive(intent), tick/step/frames, pause/resume, new/load/save, force(partialState) }`.
- `VerifyReport { danglingRefs[], unreachableReveals[], capViolations[], gateMonotonicityViolations[],
  accrualTieOutDeltas[], trackLeakageViolations[], perkMagnitudeViolations[], tradeComboViolations[],
  hiddenEdgeViolations[], realNameDenylistHits[], mathPowLintHits[], ambiguityCount }`.
- `gen:docs` reads `core/content` registries → writes balance/content tables into `docs/balance/` +
  `docs/content/`.

**(d) Ties to the four pillars.** Indirect: it **regression-tests the pillar accrual rules** (caps,
high-water-mark gating, dents-not-wipes, the hybrid gate, trade ≤ ⅓ even via combos) so the four-pillar
invariants can't silently break.

**(e) When introduced / fractal reveal.** **T0 (M0 skeleton)**, grows every milestone. Developer
infrastructure, present from early build; the V2 verifier invariants land as their systems do (§6.6/§7).

---

## 2.21 Accessibility, audio & presentation register

**(a) What it is.** Cross-cutting presentation. **Art register (V2 — corrects the "no asset pipeline"
claim): TEXT + EMOJI + CSS + a small curated asset set.** Woodblock palette; kanji season tags; colour-coded
rarities; CSS flourishes; a small canvas only for optional ambient FX, never logic. **Load-bearing period
motifs** (pillar / season / rarity marks) are **INLINE SVG** (consistent across OSes); **emoji are
COSMETIC-only** (Q38). **Audio (V2 — "good audio"):** a **small curated set** mixing **synthesized Web Audio
+ original/CC0 samples** (light ambient beds + UI/event SFX), with a **mute toggle** and surfaced
licensing/credits (§2.21.1; Q50). **Fonts: self-hosted OFL fonts** (kill Google dynamic-subsetting — it
breaks offline + the itch relative-base; bundle the OFL license; clear the Reserved-Font-Name rule; Q52).
**Accessibility (canon + V2 low-cost correctness):** solid basics — scalable text, colourblind-safe cues,
keyboard + touch, pause; **responsive desktop + mobile, NOT hover-dependent** (Shift-for-detail is an
*extra* layer, not the only way to read info); plus the V2 correctness items in (b)/(c).

**(b) Player-facing behaviour / loop.** A legible, text-first interface that scales and reflows for
mobile; colour cues backed by text/shape (never colour-only); full keyboard and touch operation; a pause;
ambient seasonal audio with a mute toggle. One carefully-tuned **difficulty** (no modes). **V2 a11y
correctness (Q18/Q48):** a **persistent quiet a11y entry point from minute one**; an **ARIA live-region
scoped to narration + milestone** ("polite"); a **large-textScale reflow case** + a **screen-reader
acceptance pass**. **Identity HUES are FILLS / ACCENTS only** — woodblock identity lives in chrome (fills,
bars, pips, borders), **never as the sole carrier of meaning**; **ALL meaning-bearing TEXT renders in
AA-passing ink (`--ink-soft`, contrast ratio ~7.3)** on the paper surfaces it sits on (D-Q-a11y). **There
is NO coloured WIN/LOSS word-as-text and NO coloured label-text** — outcome words and labels render in
`--ink-soft`; **`--ink-faint` is decorative-only**; the meter fill is darkened for contrast. **Number-flash
tokens:** **gain = `--ai`, loss = `--beni`** are an **accent on the ± number** (its sign/shape carries the
meaning, not the hue); vermilion reserved for rank-up / seal beats (§2.16(b)). *(No bare "AA on every
surface" claim — the guarantee is meaning-bearing text in `--ink-soft`; a new UI/a11y ADR + ui-design.md
§5.1/§5.3 own the chrome detail.)*

**(c) Rough DATA shape.**
- `RarityStyle { tier → colorClass + label + inlineSvgMotifId }` (colour + text + inline-SVG motif,
  colourblind-safe; emoji cosmetic-only).
- `A11ySettings { textScale, colorblindMode, reduceMotion, paused, liveRegionScope ('narration+milestone')
  }` (persisted).
- `AudioSettings { ambientVolume, sfxVolume, muted }`.
- Tooltips: a base info layer always reachable without hover (tap/focus), Shift = extra detail. **Each
  system is explained inline via contextual TOOLTIP / first-reveal copy as it unlocks — there is NO
  dedicated codex / glossary screen in v1** (D-Q-codex/Q9; relies on the staggered onboarding).

**(d) Ties to the four pillars.** None directly (presentation infrastructure). It renders the pillar/
standing panels legibly (rarity-coded, scalable, AA-contrast) so the four-pillar progress is readable on
any device.

**(e) When introduced / fractal reveal.** **T0** — the text/emoji/CSS register, the self-hosted fonts, the
inline-SVG motifs, and a11y/audio basics exist from the first build; rarity colour-coding and season tags
appear as the relevant systems (loot, clock) reveal. The a11y correctness items and the curated audio set
land in **M6**; fonts/license/credits finalise in **M7** (§7).

### 2.21.1 About / Credits surface (Q54/Q51/Q53)

**(a) What it is.** A small, always-reachable **About / Credits surface**: authorship, a **commit-SHA build
stamp**, **font/audio attributions**, and a **clean-room attestation**. It carries the **license split**
note — **permissive code (MIT / Apache-2.0)** + **reserved game content** — and links the **itch content
descriptors** (the deploy-checklist; detail in §7).

**(b) Player-facing behaviour / loop.** Reachable from the persistent a11y/settings entry point; purely
informational (no gameplay effect). Shows the build stamp so a player/QA can identify exactly which commit
they are running.

**(c) Rough DATA shape (one line).**
- `AboutCredits { authorship, buildStampSha, fontAttributions[], audioAttributions[], cleanRoomAttestation,
  licenseSplit ({ code:'MIT|Apache-2.0', content:'reserved' }), itchContentDescriptorsRef }`.

**(d) Ties to the four pillars.** None (infrastructure / deploy compliance).

**(e) When introduced / fractal reveal.** Stubbed early; finalised in **M7** with the self-hosted fonts,
LICENSE, and itch content descriptors (§7.3.2).

---

## 2.22 §2 — items flagged for the human (review checklist)

These are the load-bearing or genuinely-open calls in §2 that should be confirmed before §3:

1. **Pillar accrual, the HYBRID tier-gate & dent shape (2.16).** Confirm the **two-shape accrual**
   (achievement jumps + seasonal judged results, new-high-water-mark only, per-event capped, **Phase-2
   only**) and the **per-pillar recoverable dents + below-high-water seasonal restore (never a wipe)** are
   correctly captured as *systems*, and that the **HYBRID good/great/excellent profile over revealed pillars**
   (good in all · great in 2–3 · excellent in 1–2; **no overflow**; **trade ≤ ⅓ still the one hard cap**) is
   the gate model to build against (supersedes simple thresholds; Q7/FU10). *(Balance numbers themselves are
   §4.)*
2. **Trade ≤ ⅓ as a hard structural invariant (2.4 / 2.11 / 2.16).** Confirm enforcing it as a
   verifier-checked invariant (not just a tuning target) — **including that cross-pillar combos, computed
   post-clamp, can never breach it** — is desired.
3. **Auto-producers strictly T3+ (2.5).** Confirm v1's E0–E3 estate is **fully active grind** (the "leave
   it running" feel comes from **tab-open auto-resolve / auto-repeat**, not idle producers) with **no**
   assignment/management panel surfaced in v1 (the people-management-sim guard).
4. **Estate build/recruit as light flavour (2.17).** Confirm building & recruiting ship as **diegetic
   reveal beats + light roster cards**, explicitly **not** a buildable management minigame — and that the
   **martial-scale hard-cap** (small named retinue, never an army) is the v1 ceiling. **(E3 "Prosperous"
   authored in v1; E4–E5 parked; Q8.)**
5. **Belief→cause registry + ≤ 1 ambiguity (2.9 / 2.13).** Confirm keeping **belief-beasts in a separate
   registry (`content/beliefBeasts.ts`)** from grindable mobs (so canon's "no belief-creatures in spawn
   tables" is enforced at the type level) and that the **single residual-ambiguity token stays at the jizō
   at the weir/ford** (the co-located find-spot; Q11).
6. **Combat & quest surface for v1 (2.7 / 2.8 / 2.10 / 2.12).** Confirm: **exactly ONE starter weapon at T0**
   + a **growing roster (~9–10, +2/+3/+4 per tier)** on the **combat-reveal ladder**; **per-skill perks** as
   the bounded labour→combat cross-feed (conditioning still the zero-stat gate); the **lean core skills**
   (farming, foraging, woodcutting, fishing, smithing, cooking; conditioning); and **NO fixed quest-type
   budget** (PEST CONTROL / HUNT / CLEAR / DEFEND are the T0 **starter set**, not a cap — Q23/Q15/Q6/FU13/FU8).
7. **Standing & Office kanji (2.16).** RESOLVED at the **§5 authenticity pass** (2026-06-25) = **官威
   (*kan'i*)**, "authority of office" (the earlier coined 政威 was rejected). *(Macronize gōshi / rōnin
   project-wide.)*
8. **The THREE clean combat tracks (2.8.1).** Confirm the de-conflation — **character (combat) level**
   (kills/XP → HP/satietyMax/attr-points) · the **Arms pillar** (deeds, Phase-2) · the **Combat Rank
   rung-meter** (curated rung activities) — stays lexically + mechanically distinct (the old fused
   "Combat Level = a Combat Deeds pool" is deleted; FU14/Q1).
9. **The SEQUENTIAL Phase-1 / Phase-2 progression (2.15.1).** Confirm each tier is **climb the rungs
   (Phase 1, rung-meter + story AND-gate) THEN grind the pillars (Phase 2, deeds gated post-final-rung)**,
   with **no stored phase flag** (derived from the current rung; FU7/FU6).
10. **The MULTI-BACKEND save layer (2.19 / 2.19.1).** Confirm the redundant IndexedDB + localStorage +
    sessionStorage save with **atomic write, app-identity magic field, monotonic save-counter newest-wins +
    timestamp tiebreaker (a documented core-lint exemption), additive schema, reject-to-recovery** — built
    **full in M0** — is the persistence model (Q37/FU1/FU2).

---

_§2 reshaped to PRD V2 from the locked-decisions canon + the LOCKED V2 §1 (incl. §1.6.4) + the 79 V2
decisions (Block L + Block M, D-022 governing). Balance numbers are deliberately deferred to §4. Next: §3 —
the incremental unlock ladder (UI-as-progression)._

---
# §3 — Incremental Unlock Ladder (UI-as-progression)

> **PRD V2.2 — reshaped per the V2 decisions (D-022 governing; Block L `Q1–Q56` + Block M `FU1–FU23`).** Authored
> end-to-end from the LOCKED CANON
> ([`../brainstorms/2026-06-25-locked-decisions.md`](../../project/brainstorms/2026-06-25-locked-decisions.md), incl. all
> three "Updated 2026-06-25" header blocks), the merged PRD §1, §2, §5, §6, **and the 79 human-signed V2
> decisions**. This section makes the **signature feature** concrete: it specifies the **ordered reveal of every
> panel, tab, screen, system, resource-row, and area** across the game — **T0–T2 in full (v1)**, with **T3/T4
> sketched**. It references the §2 systems by name and **defers all exact numbers to §4** (thresholds, costs,
> curves, conversion weights) *(proposed v1 balance)*.
>
> **Canon honoured throughout:** grounded / no-magic; mediocre-start (no hidden edge of **birth, gift, or
> memory** — but **trained labour skills DO** grant small, bounded combat perks, Q6/FU8); **the core loop is the
> MC's own actions, NOT a management sim**; the four-pillar House Influence (Arms / Estate & Wealth [trade ≤⅓] /
> Standing & Office / Name & Honour) with **achievement-jumps + per-season judged results**, **up-only + minor
> recoverable dents** (with a small below-high-water seasonal **self-heal** that never advances the high-water,
> Q32); the tier-up gate is the **HYBRID good/great/excellent pillar profile** (good in ALL revealed pillars ·
> great in 2–3 · excellent in 1–2; T0 a 2-pillar special case; **NO overflow** — the old "simple per-tier
> required-pillar thresholds" framing is **superseded**, Q7/FU10/D-028); progression is **SEQUENTIAL per tier**
> — climb the rungs (**Phase 1**), THEN grind the estate's pillars (**Phase 2**), THEN tier-up (§3.0.1, FU7);
> combat is **THREE clean separately-stored tracks** (character level · the Arms pillar · the Combat Rank
> rung-meter — §2.8.1/§3.0.1, FU14) and **INCREMENTAL** (T0 starts with **one weapon**, a growing **~9–10**
> roster, +2/+3/+4 per tier, surfaced one-at-a-time on the **combat-reveal ladder** §3.5.1 — Q15/FU13); combat
> first-class & **EARLY (T0-R3)**, satiety-throttled ("eat before you fight", Q31/FU16); tiers **T0–T4** with
> per-tier story gates; a **fresh rank ladder PER TIER**; **full maps every tier**; **active-only / no offline**
> (the "leave it running, check the progress" feel = **tab-open auto-resolve + auto-repeat labour**, FU23);
> abstract clock; **fractal incrementality** with **design-staggered one-at-a-time** reveals (the schedule is
> *authored*; there is **no runtime reveal-queue** — FU4 supersedes Q17's "serialize into a queue"); LEAN /
> high-impact, immediate-vs-later; **auto-producers T3+ only**; the **~28.5 h v1 budget is a FLOOR/minimum**, a
> long OSRS-rough grind (FU18); rich attributes; **soft** stamina; **hybrid** crafting; **K/M/B** number
> formatting; **macron** romanization; names per canon.

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
| **RANK** | a **Phase-1 rung** reached (a fresh ladder per tier: T0 `R0–R7`, T1 `V0–V7`, T2 `G0–G7`) | the rung's **per-rung-reset rung-meter** — **Estate Service** (labour) or **Combat Rank** (martial; *renamed from "Combat Standing"*, Q9) — crossing its threshold (back-solved from the **≥30-min-per-rung floor** × that rung's curated-activity rate) **AND** the rung's **story milestones** (an **AND-gate**, §2.15.1 / §3.0.1). The meter is fed by **curated per-rung activities** — *never* raw XP/kills/deeds (those feed the character level / the pillars). |
| **PILLAR** | the **Phase-2 TIER-UP gate** cleared — the **hybrid pillar profile** over the tier's **revealed** pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour) | the **good/great/excellent** distribution (good in ALL revealed · great in 2–3 · excellent in 1–2; NO overflow; §2.16/§4 — numbers → §4). Pillar **DEEDS accrue in PHASE 2 only** (post-final-rung; FU7), so PILLAR gates the **tier-up**, never an individual rung. |
| **STORY** | a story / quest / dialogue flag set | a `flagsSet` from a quest or `TextLine` (§2.12) |
| **FIRST-USE** | first acquisition / first action / discover-by-doing | first resource gained, first XP in a skill, first entry into an area/danger ring (§2.4, §2.7, §2.9) |

> **The THREE combat-fed tracks (never one fused bar — §2.8.1/§3.0.1, FU14/Q1).** Wherever a combat reveal
> appears below, keep them distinct: **one kill** writes **combat-XP → the character (combat) level** (HP +
> attribute points + satietyMax); **one recognised martial DEED** writes **→ the Arms pillar** (House Influence,
> **Phase-2-gated**); **one curated per-rung activity** writes **→ the Combat Rank rung-meter** (the Phase-1
> martial rung-gate). Reconflating these three is the single likeliest regression — they stay separate by design.

**Reading the tables.** Each tier is **one coherent ladder table** (a *fresh* ladder, never a continuation —
canon §C, §I; §1.5.1). Rows are in **reveal order**. Each reveal gives: the **trigger**, **what becomes
visible**, and the **diegetic event-log line** that announces it (the `revealLogLineId` copy; final wording is a
§5 authenticity-pass concern, but the substance is locked here).

**Three cross-cutting rules that shape the whole ladder:**

1. **Fractal incrementality (§1.2 pillar 2).** Nothing is dumped. A composite system reveals **one piece at a
   time**: the drill yard reveals one post → one rack → sparring slots; a new region reveals one road → one
   threat → one contact; the four-bar Influence panel reveals **bar-by-bar** as each pillar is first revealed,
   not all four at once.
2. **The multi-screen UI appears single-screen early (§2.1b, §1.12, canon §H).** v1 begins as **one screen** (a
   single column: event log + one verb). **Navigation chrome and additional screens unlock progressively** — the
   first nav tab appears only when there is a second place to go. **Distinct activities surface as their OWN
   top-level nav tabs, not nested panels** (Q10) — Skills, Combat, **Crafting**, **Quests**, Map, House, etc. The
   "screen / nav reveals" are called out explicitly in §3.5 (the navigation reveal track) so the shell's growth
   is legible as its own ladder.
3. **Reveals are DESIGN-staggered one-at-a-time — the schedule is AUTHORED, not a runtime queue (FU4, supersedes
   Q17's "serialize into a deterministic queue").** The unlock *schedule* is hand-authored so beats arrive
   **singly** — there is **no `revealQueue` field in `GameState`** (FU4 supersedes Q17); staggering is a
   **design property** of the authored ladder, not stored runtime state (§2.1/§6.4). The general **NO-UI-DUMPS**
   principle (Q17 — stagger everything, slowly and gently) is honoured by *authoring*, never by a runtime
   serializer; a genuine multi-element single-feature reveal (e.g. one new shop row) is a **bespoke one-off**.
   The **incremental skill-unlock ORDER** is itself the real bound on the small, bounded **labour→combat
   per-skill cross-feed** (Q6/FU8): skills surface in a designed order, so their few small combat perks accrue
   gradually — and **conditioning stays the separate ZERO-stat enablement gate** (§2.8/§4.5), never bypassed by
   those perks.

---

## 3.0.1 The two-phase per-tier model, the rung-meter law & the Phase-2 tier-gate (the spine every table below builds on — FU7/FU6/FU11/Q30/Q7)

This makes the V2 progression spine **concrete and cross-cutting before the tier tables.** The canonical
conceptual statement is **§1.6.4**; the system shapes are **§2.15.1 / §2.16 / §2.8.1**; the exact
curves/thresholds are **§4** *(proposed v1 balance)*. Every `R*/V*/G*` row below is read through this model.

**(1) Each tier is climbed in TWO ORDERED PHASES (FU7).**

- **Phase 1 — climb the rungs** (`R0→R7` / `V0→V7` / `G0→G7`). Each rung promotes on an **AND-gate**:
  the rung's **per-rung-reset RUNG-METER** `≥ threshold` **AND** the rung's **story milestones** are satisfied
  (the UI reads **"awaiting X"** when one side lags; FU6/Q30). The meter is fed by **curated, story-consistent
  per-rung activities** — a designed **one-to-many** set (NOT a single repeat-counter), tagged by
  `rungActivityTags`. Two meters run in parallel: **Estate Service** (labour rungs) and **Combat Rank** (martial
  rungs). **Pillar DEEDS do NOT accrue in Phase 1** — this is the structural fix against a "half the rungs, maxed
  deeds" state.
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind** — and the tier's **pillar DEEDS accrue here and ONLY here** (FU7). Clearing the tier's
  **hybrid good/great/excellent pillar profile** (below) is then what **tiers up** to the next, larger canvas.
  *(The capstone rung confirms **Phase 1**; the **Phase-2 hybrid pillar gate is the actual tier-gate**, ANDed
  with the capstone rung-meter + story.)* **Phase 2 is NOT a dead consolidation half (D-Q4):** it carries its
  own **authored reveals** — the tier's **estate BUILD** completing (**E1 / E2 / E3** at **T0 / T1 / T2**, gated
  on the pillar-Influence floor, **not** the Phase-1 rungs; §2.17/§4.7.5/D-Q-B2), new **deed categories** opening
  (Arms at T0, Office at T1, Name at T2), and at **T2** the **cross-pillar combo** unlocks (Model-A; §4.3.1) +
  the **per-season seasonal-rotation** lever (§2.14) as the two anti-slump reveals. And the **per-pillar
  shortfall is surfaced EARLY + CONTINUOUSLY** from the first Phase-2 season (the lagging bar reads plainly, e.g.
  *"Name is behind"*) so a breadth shortfall is **never an end-of-Phase-2 surprise** (§2.16(b)/D-Q-breadth-wall).

**(2) The rung-meter accrual law (D-024/FU6).** Both meters are **numeric and PER-RUNG-RESET** (each rung starts
at 0). Each rung's threshold = **(the ≥30-min-per-rung FLOOR × that rung's eligible curated-activity rate)** —
**back-solved from the SAME ≥30-min floor** the §4.8 pacing model and the §6.6 gate-monotonicity verifier use, so
the meter and the floor stay in lockstep (race the curated activities and the meter is *still* short of
threshold — you cannot skip the floor). The **Combat Rank** meter is fed by **per-rung CURATED combat
activities, NOT raw kills/XP** (FU14) — kills feed the character (combat) level instead (§2.8.1). Double-counting
across streams is allowed, but **each stream sums independently** (verifier-asserted, §2.20).

**(3) The Phase-2 hybrid tier-gate (D-028/Q7/FU10).** Phase 2 tiers up on the **good/great/excellent profile**
**over the pillars REVEALED by that tier** — **good in ALL revealed · great in 2–3 · excellent in 1–2**, **NO
overflow** (a surplus in one pillar can never substitute for a deficit in another). The **revealed-pillar set
grows per tier**: **T0 = 2** (Arms + Estate — a **2-pillar special case**: good in both, **one excellent**),
**T1 = 3** (+ Office), **T2 = 4** (+ Name) — and the gate is **only ever checked against revealed pillars**
(never "good in ALL" against an unrevealed one). The only structural cap that survives is **trade ≤⅓ of Estate &
Wealth**, with cross-pillar combos computed **post-clamp** and excluded from the gate-check (§2.16/§4.3.1). The
per-pillar-per-tier thresholds are a **full §4 overhaul** back-solved against the fixed §4.2.1 deed inventory —
**numbers → §4** *(proposed v1 balance)*.

**(4) The THREE clean combat tracks (D-025/FU14/Q1).** As §3.0 notes: **one kill → character-level combat-XP**
(scales HP / satietyMax / attribute points); **one recognised deed → the Arms pillar** (Phase-2 gated); **one
curated rung activity → the Combat Rank rung-meter** (the Phase-1 martial gate). `character.level` is the only
one of the three that scales personal power; the other two are *standing*/*gate* meters.

**(5) NO stored "phase" flag.** The current phase is **derivable from the current rung** (pre-capstone = Phase 1;
post-capstone = Phase 2) — no extra `GameState` field (§6.4).

**(6) Budget = a FLOOR; the loop is active-only.** The per-tier hour budgets (T0 ≈ 4.5 h, T1 ≈ 8 h, T2 ≈ 16 h;
≈28.5 h v1) and the ≥30-min-per-rung floor are **minimums/FLOORS, never ceilings** (FU18) — pushing 1–2 pillars
to *great/excellent* in Phase 2 **extends** Phase 2 beyond its floor by design. The "leave it running, check the
progress" feel comes from **tab-open auto-resolve combat + auto-repeat labour** (active-only — FU23), **not**
from offline accrual or early idle producers (auto-producers are T3+ only, §2.5).

So, read every tier table below as: **climb the rungs (Phase 1: rung-meter + story AND-gate) → the capstone opens
Phase 2 → grind the REVEALED pillars to the hybrid profile → tier-up.**

---

## 3.1 The cold open — minute one (T0, before R0)

The lone hand-authored, pre-ladder state. Built from **§2.1 (reveal engine + log)**, **§2.3 (soft stamina)**,
and **§2.4 (koku)**. This is the *only* moment with no nav, no tabs, no map — **one verb and a log.**

| Order | Trigger | What becomes visible | Diegetic event-log line |
|---|---|---|---|
| 1 | At launch (`STORY`: new game) | The **single screen**: the **persistent event log** (§2.1) — colour-coded, capped — and nothing else. | *"Cold. Wet straw. The dark smells of old rice. You do not know your name."* |
| 2 | Log advances (`STORY`) | The **one verb button**: **"Open your eyes."** (the entire interactable UI). | *"Somewhere above, a bird. You make yourself look."* |
| 3 | First verb pressed (`FIRST-USE`) | The **body / rest bar** (HP + soft satiety, §2.3) and the **rice counter** (koku, §2.4) — the two readouts of the *kura*. The verb changes to **"Rake the spilled rice."** | *"You are in a storehouse — a* kura*. Your head is bound. A pallet, a rake, rice spilled across a cracked floor."* |
| 4 | First rice raked (`FIRST-USE`: first koku) | The koku row lights its own panel (§2.4); the **rest verb** ("Lie back and breathe") appears beside the work verb (soft-stamina recovery, §2.3). Physician **Sōan** speaks (grounds the amnesia — no visions). | *"You rake. A grain at a time. Sōan, the physician: 'Head's been knocked, lad. You near drowned. Rest, and work when you can.'"* |

> **Canon checks:** matches the **cold-open spec** (canon §H; §5 T0.2 beat 1) — *kura*, one verb, persistent
> log, body/rest bar + rice counter, "no visions." The **first dream-fragment** (§5 T0.2 beat 1, Origin thread)
> is seeded as a log line here with **ZERO mechanical effect** (no panel, no bonus) — a **"presumed dead → back
> from the dead"** seed, the find-spot jizō/weir co-located per §1/§5 (Q11). After step 4 the player is at **R0**
> and the T0 ladder (§3.2) takes over.

---

## 3.2 T0 — Estate ladder (full; v1) — `R0 → R7`

**The tutorial tier — and all of T0 is PHASE 1** (climb the rungs `R0→R7`); the **capstone R7 OPENS PHASE 2**
(the estate-influence / pillar grind, where the tier's pillar DEEDS first accrue). One declining hill estate
(the Kurosawa *gōshi* house), **unlocked room by room** — and T0 room/area reveals are **SEPARATE** (LOCKED):
stables, woodlot edge, and drill yard each reveal individually, never folded into the forecourt. **Combat
surfaces EARLY at R3** (the humbling first fight) and then deepens **incrementally** along the **combat-reveal
ladder** (§3.5.1) — never a one-beat dump. Each rung promotes on the **per-rung RUNG-METER** — **Estate Service**
(labour rungs) or **Combat Rank** (martial rungs), each **per-rung-reset**, its threshold back-solved from the
**≥30-min floor** — **AND** the rung's story milestones (the AND-gate; §3.0.1, FU6/Q30). The meter is fed by
**curated per-rung activities** (a one-to-many set), **never** raw XP/kills/deeds. **No auto-producers appear**
(canon §G — early game is the MC's own active grind). The **four-bar House Influence panel reveals at R7** — and
that reveal is **ENTRY TO PHASE 2**: the player *climbs the rungs first*, then *grinds and sees* the standing he
builds (pillar deeds accrue only from R7 on).

Estate stage span this tier: **E0 Foreclosure's Edge → E1 Stabilising** (§1.5.1, §5 T0.4) — the rooms reveal
across Phase 1, but **the E1 "Stabilising" BUILD COMPLETES as a Phase-2 beat** (gated on the pillar-Influence
floor, not the rungs; §3.3/§2.17/D-Q-B2).

| Rung | Trigger (rung gate) | What this rung REVEALS (in fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **R0 — Stray ("another mouth")** | `STORY` (met at the open; cold-open §3.1 complete) | The bare **diegetic estate dashboard** as a single screen (the *kura* room readout); the body/rest bar + rice counter carried from the cold open. | *"You can stand. Barely. The household calls you nothing yet — 'another mouth.'"* |
| **R1 — Day-labourer (*hiyatoi*)** | `RANK` Estate Service (complete the spilled-rice task; Chief Steward **Genemon** assigns first real work) | **The Gate & Forecourt (*genkan*)** area (the promotions stage); **The Home Paddies & Dry Fields** area; the **basic labour loop** (Farming via §2.6); the **world-clock display** (day/season tag, §2.2) appears with the *koku* heartbeat; a **sleeping-place** (rest is now safe). | *"A door slides. Genemon, dry as a husk: 'Another mouth — soft, clumsy. Earn your sleep.' He points you to the paddies. The seasons begin to turn."* |
| **R2 — Bonded hand (*genin*)** | `RANK` Estate Service (a season of reliable labour; Genemon enters you on the books) | The **Skills tab** (§2.7) — first nav tab; surfaces by-doing as XP lands (Farming first, then **Foraging / Woodcutting / Hauling**); **each skill carries a small perk track revealed by levelling it** (§2.7.1 — the bounded labour→combat channel, Q6/FU8; the incremental skill-unlock **order** is what paces it, and **conditioning stays the separate ZERO-stat gate**); **The Stables & Woodlot Edge** area (revealed *separately*); **The Near Satoyama** wilderness ring (first danger ring, conditioning-gated, §2.9 — its actual surfacing is the `FIRST-USE` reveal at the conditioning floor, see §3.3); new resource rows light as gathered (wood, *sansai*). The **porter's-knot beat** fires (Origin clue, **ZERO bonus**). | *"Your name goes on the household books. You forage the near hills, fell timber, haul loads. A groom grunts: 'Huh — you've tied that knot before.' (You don't know why.)"* |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | `STORY` the **humbling, near-fatal first fight** (a wolf at the grain store — survived by luck, **never rescued, never skill**), THEN beg drillmaster **Kihei** for drills | **COMBAT GOES LIVE (EARLY) — but staggered, one reveal per beat** (§3.5.1, FU12; the old "drill yard + Combat panel + every slot at once" dump is retired). R3 reveals **only**: **The Drill Yard** area (one post → Kihei's rack → sparring slots); the **Combat panel** (§2.8) with the **BARE auto-resolve loop + RETREAT** (a clean escape valve — keep HP + loot, pay a modest clock cost, **never dents Influence**; Q16) — framed as the active-only **"leave it running, check the progress"** loop (FU23); the **single starter weapon** (T0 starts with **exactly one** — Q15/FU13) + **Equipment & Inventory** panels (§2.10); the **Bestiary** panel (§2.9, fills by-encounter; the **wild boar** is the first grindable threat). **"Eat before you fight":** the **satiety→combat throttle** (Q31/FU16) surfaces here — combat is satiety-gated, the first fight measured **at adequate satiety (≥~0.7)** (§4.6.6). Combat stats start near-zero; combat/weapon **skills surface** in the Skills tab. **(Stance / ability / item slots reveal LATER — R5 and the L10 milestone; §3.5.1.)** The character (combat) **level** begins here (kills → combat-XP only). | *"The wolf left you in the dirt — ribs cracked, alive only by luck. You crawl to Kihei. 'Talent is a story the lucky tell. You are not lucky. So you will work.' The drill yard opens. (Eat first, Kihei says. A starving man swings like a child.)"* |
| **R4 — Trusted hand & houseman** | `RANK` Estate Service (win **Lady Chiyo's** regard for indoor work + heir **Naoyuki's** grudging vouch — seeding the rivalry→respect arc; authored trust beats) | **The Main House / *Omoya*** interior area (kitchen, inner rooms, household shrine); the **household domestic economy** rows (textiles, kitchen, provisioning — feeds **Cooking** §2.6 and the satiety loop §2.3); the **first *shinden* reclamation** begins (a LAND lever — its recognised yield is a **Phase-2 Estate deed**, not yet accruing); the **Crafting tab** — a **TOP-LEVEL nav tab** (Q10), revealed as its own beat (§2.11, hybrid — *simple recipes first*) with the early **loot→craft loop** (Smith **Gonta**, §2.10/§2.11); **graded weapon-durability bands** surface here with that loop (a **4-band** scale; a weapon degrades but is **NEVER auto-unequipped**; Q33/FU17 — §3.5.1). **[THREAD: Tama — seed only]** the house simply sees a proven, honest hand; **no one speaks the name "Tama"** yet (the village ignites the legend at T1-V0). | *"Lady Chiyo nods you indoors. Naoyuki, bored: 'He'll do.' The inner rooms open; the first fallow plot is yours to bring back; Gonta hands you a hammer. You earned this with honest hands."* |
| **R5 — Gate-guard (*monban*)** | `RANK` Combat Rank (stand a real watch; clear first pest/animal threats; weapon-skill milestones — conditioning floor at R3) | The **Quest log** — a **TOP-LEVEL nav tab** (Q10) — opens with the **T0 CORE / starter quest set**, revealed as each is first taken: **PEST CONTROL → HUNT → CLEAR → DEFEND** (this is the *starter set, **NOT a cap*** — author whatever quest types fit each later stage; Q23). The **stance slot** unlocks on the Combat panel (§3.5.1, FU12). **DEFEND** is the activity that *will* earn **Arms** — but **its pillar DEEDS accrue only in PHASE 2** (post-R7; FU7); R5 combat feeds the **character (combat) level** + the **Combat Rank rung-meter** (curated activities), **not** the Arms pillar yet. | *"You stand the gate, and the work finds you: vermin in the stores, a boar in the paddies, a night-watch to hold. Your sword starts to matter — not just your back."* |
| **R6 — Foreman of works (*kogashira*)** | `RANK` Estate Service (drive the *shinden* + workshops to recorded yield; house edging toward solvency) | The **Workshops** and **Granary** areas; **proto-industry levers** (the LAND/TREASURY strands whose recorded yields become **Phase-2 Estate deeds**); the **low palisade** (martial fabric); the **2nd starter-line weapon** unlocks (the T0 roster grows **+2 total** across the tier; §3.5.1/§2.10.1); **errands beyond the estate are authorised — the VILLAGE TIER OPENS after tier-up** (the **tier-expansion map** seed + the road out). *(No pillar standing is "recorded" here — Arms/Estate DEEDS do not accrue until Phase 2, post-R7; FU7.)* | *"The frame of a workshop is raised; the granary takes shape; the ledger is no longer only red. Genemon, grudging: 'Carry the house's business down to the village.' A road opens past the gate — once the house itself is set right."* |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** *(capstone — END of PHASE 1 / ENTRY to PHASE 2)* | `RANK` Estate Service rung-meter **+ STORY** (first reclamation recorded; the lord names the bailiff) — **rung-meter + story ONLY**; the **Arms+Estate PILLAR profile is the SEPARATE Phase-2 tier-up gate** (below) | The **lord's study** (ledgers) in the Main House; **jobs-as-offices** begin (field administration framed as **the MC's own quests/offices — NOT a management layer**, §2.6); **THE FOUR-BAR HOUSE INFLUENCE PANEL becomes visible** (§2.16) — and its reveal **OPENS PHASE 2**: pillar **DEEDS now start accruing** (Arms from recognised martial deeds; Estate from the *shinden*/solvency). The panel reveals only the **T0-revealed pillars** — **Arms + Estate** — bar-by-bar (Office/Name are not yet revealed, never checked); **cash-crop levers**; the **per-tier domain ranking** read (§2.18) first appears here as "unranked." **The T0→T1 TIER-UP** is the **Phase-2 hybrid gate** (the **2-pillar special case**: **good in BOTH** Arms + Estate, **one excellent**; numbers → §4) — cleared by grinding Phase-2 deeds, **then** the valley opens. | *"The lord enters your name in his own ledger — bailiff of the home fields. The rungs are climbed. Now he points past them: 'The house is off the cliff. Make it *rise*.' For the first time you see what the house can become — two standings to raise. (Then: the valley.)"* |

> **T0 deliberately withheld (fractal discipline):** coin/*mon* (a T1 reveal — there is **no market in T0**, so
> **no TRADE strand at T0** either; Q29); the inn & **rumours board** / folklore (T1, §2.13); the
> **component/quality** crafting system (T1+ — T0 is *simple* recipes only, §2.11); seasons/weather/**festivals**
> as a live *mechanical* layer (the *clock* shows at R1; the **bounded ±10% weather/festival** layer first
> reveals at **T1**, §2.14/Q35); **auto-producers** (T3+, §2.5); the **origin** track (T2, §2.15). The **pillar
> grind itself is Phase 2** (post-R7). Holding these back keeps the screen lean (canon §G, lean discipline).

> **T0 Phase 2 — what the back half REVEALS (not a dead consolidation half; D-Q4/D-Q-B2/D-Q-breadth-wall).**
> Post-R7 (the four-bar panel live) is itself a **reveal cadence**, not just a number-climb. As Arms + Estate
> deeds accrue, authored beats fire: **the E1 "Stabilising" estate BUILD completes** as a Phase-2 beat — the
> *shinden* paying out, the workshop's first recorded yield, the granary stocked, the house off the cliff (the
> estate fabric *finishing* on the influence track, gated on the pillar-Influence floor, **not** the Phase-1
> rungs; §3.3/§2.17/§4.7.5/D-Q-B2); the **first recognised Arms DEED category** opens (defence/clear deeds now
> *count* toward a pillar for the first time). And the **per-pillar shortfall is surfaced from the FIRST Phase-2
> season** — the lagging bar of the two reads plainly (e.g. *"Arms is behind"*), so the 2-pillar breadth gate is
> **never an end-of-phase surprise** (§2.16(b)/D-Q-breadth-wall; no overflow/substitution). Clearing the
> 2-pillar hybrid profile (good in both Arms + Estate, one excellent) → **T1.**

### 3.2.1 The earned-transition spine — *why* each promotion happens

> **Audit rule: no rung is granted for free.** Each promotion has a concrete in-game **trigger** (what you
> did — a **rung-meter + story** AND-gate, never a pillar threshold), an in-fiction **reason** (why the house
> grants it), and a **named granter** — and the granters *escalate* as your standing rises.

Two engines make a rise from "another mouth" to the lord's bailiff believable inside one tier:

- **The house is dying and short-staffed.** The Kurosawa are a broke *gōshi* household of ~a dozen people,
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

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it | Granter |
|---|---|---|---|
| **R0 → R1** | Complete the spilled-rice task; the rest-bar recovers enough to work (Estate-Service rung-meter + story) | Charity bought you a pallet, not a place. Raking the rice proves you'll work despite your state → casual day-labour ("earn your sleep") | Genemon |
| **R1 → R2** | A full **season** of reliable labour to the Estate-Service **rung-meter** threshold, never shirking | A casual *hiyatoi* is a transient the house owes nothing. A whole season of reliable work proves you're worth keeping → your name goes on the books (*genin*). *(Porter's-knot beat foreshadows the Origin thread.)* | Genemon |
| **R2 → R3** | Working the wild **Near Satoyama** (an exposure/conditioning threshold) **triggers** the wolf-at-the-grain-store incident; you survive by luck, then beg Kihei (the **Combat Rank** rung-meter starts here + the survival story-flag) | The undefended house is exposed; the attack proves it. Shamed at being thrashed, you beg for drills; an understaffed house that can't hire a guard trains the willing hand it has | Kihei |
| **R3 → R4** | An authored **trust beat** — return the mislaid **debt-ledger** you could have pocketed; keep your head in the grain-store scare — plus the Estate-Service rung-meter | A broke house needs an **honest** hand near its dwindling affairs (the debt, the pawnable valuables) more than another field-hand. You've proven reliable, capable, **and** honest → Lady Chiyo brings you into the *Omoya*, strictly as a trusted servant | Lady Chiyo (+ heir **Naoyuki's** grudging vouch — seeds the rivalry→respect arc) |
| **R4 → R5** | The **Combat Rank** rung-meter — weapon-skill milestones from drilling + clearing the first pest/animal threats (curated combat activities) | You've drilled (R3) and you're trusted (R4), and the threats keep coming with still no real guard. Drilling earns a real night-watch post. *(R5 combat feeds the character level + the Combat Rank meter; the **Arms-pillar DEEDS wait for Phase 2**, post-R7.)* | Kihei + Genemon |
| **R5 → R6** | The **Estate-Service** rung-meter — drive the first *shinden* reclamation + restart a workshop to a **recorded yield** (curated labour activities) | Solvency is the house's only survival path, Genemon is aging, and there's no coin to hire an overseer. You're the only proven **all-rounder** (labour + arms + trust) → he makes you foreman of the recovery; there is no one else, and the stakes are existential | Genemon |
| **R6 → R7** | The **Estate-Service** rung-meter **+ story** (first *shinden* recorded; the lord names the bailiff) — **NOT** a pillar threshold; the **Phase-2 Arms+Estate hybrid gate is the separate T0→T1 tier-up** | The works **succeed** — the house is off the foreclosure cliff, and it's materially your doing. The **Lord himself**, roused from despair, enters your name in his own ledger as **bailiff** — *ending Phase 1* — and points at **raising the house's own standing** (Phase 2 opens), then, once it has risen, at the next horizon: *"Now: the valley."* | **Lord Shigemasa** |

The capabilities **stack** (labour → reliability → arms → honesty → a real post → driving the recovery →
restoring the estate) and the granters **climb** (Genemon → Kihei → Chiyo → the Lord) — so at every rung the
player knows exactly *what they did* to rise. **The R7 capstone ends Phase 1** (he names the bailiff); the
**Phase-2 pillar grind** (raise Arms + Estate to the hybrid profile) is what then **tiers up to T1**, so the
capstone reads as earned *and* the tier-up is a distinct, deeds-driven beat.

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
| **The Drill Yard** | E1 | `STORY` R3 (after the humbling fight) *(revealed SEPARATELY)* | *"Kihei kicks open the drill-yard gate. One post. One rack. Begin."* |
| **The Main House / *Omoya*** (inner) | E1 | `RANK` R4 | *"The screens slide back — kitchen, inner rooms, the household shrine."* |
| **The Workshops & Granary** | E1→E2 (begun) | `RANK` R6 | *"A workshop frame; a granary rising. The Kurosawa works begin."* |
| **The lord's study** (ledgers) | E1 | `RANK` R7 | *"You are called to the lord's study, where the ledgers live."* |
| **E1 "Stabilising" — the estate STANDS (build complete)** | **E1 (build)** | **`PILLAR` (Phase 2, post-R7; the pillar-Influence floor + low rank floor — D-Q-B2/§2.17)** | *"The frames are filled, the fields bear, the ledger steadies. The house no longer falls — the first build stands."* |

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

**T1 is the SAME two-phase motion as T0 (§3.0.1).** **Phase 1** = climb `V0→V7` (each rung an **AND-gate**:
the per-rung **Estate Service** / **Combat Rank** rung-meter + the rung's story milestones; **pillar DEEDS do NOT
accrue**). The capstone **V7 OPENS Phase 2** — the four-pillar grind — and **Phase 2** = grind the **revealed**
pillars to **T1's hybrid gate**, now over **THREE revealed pillars: Arms + Estate + Office** (**good in all
three**, **great in 2**; numbers → §4). The **Office BAR reveals during Phase 1** (V4, as a story beat) but
**Office DEEDS accrue only in Phase 2** (FU7), exactly like Arms/Estate. The bounded **±10% weather/festival
MECHANICAL layer** (§2.14/Q35) first reveals this tier, modulating labour/combat rates and the seasonal judged
results.

**Two parallel tracks (one gates, one accelerates):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `V0→V7` ladder below (Phase 1), then the Phase-2
  pillar grind. Clearing **both** is the **gate to T2 / Region**. Rising it raises **House Influence** and grows
  the estate's reach over the valley. Labour and combat keep interleaving, now past the estate gate; the
  **four-pillar Influence panel already exists** (from R7) and T1 **lights its Office bar** for the first time.
- **(SIDE-TRACK) Village reputation web — an OPTIONAL accelerant.** A **second, parallel reputation** (§2.15):
  how the **villagers personally regard you** — per-shop "patron/regular" meters, the headman's **personal**
  regard, the inn/rumours social web, and the **Tama-vs-farmhand allegiance**. It is **fully completable** and
  shaves **~10–15%** off time-to-T2 (§1.5.4), but it **NEVER gates the spine** — ignoring it leaves you only
  poorer and lonelier, never walled. **Estate-rep advances the main quest; village-rep is a full optional
  side-quest layer.** *(The two reputations are deliberately distinct in shape — a steep gated ladder vs. a
  gentle multi-node web — so they never read as one bar painted twice; §2.15.)*

Estate stage span: **E1 Stabilising → E2 Recovering** (§5 T1.4) — as at T0, **the E2 "Recovering" BUILD
COMPLETES as a Phase-2 beat** (gated on the pillar-Influence floor, not the V-rungs; §2.17/§4.7.5/D-Q-B2). Coin (*mon*), the **component/quality**
crafting system, the **inn rumours board**, the **bounded ±10% weather/festival mechanical layer**, and the
**silk/sericulture *meibutsu*** sub-engine (the **TRADE strand opens at T1** — never T0) all first appear this
tier.

| Rung | Trigger (rung gate) | What this rung REVEALS (fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | `STORY` (T0 authorised it; first village errand) | The house pushes its first business past its own gate — **The Market / Shop Row** area opens (**ONE shop first** — Smith **Gonta's** forge — then fractally adds **Obaa Kuni's** herb stall, Tokuemon's brewery, Onatsu's silk); **coin (*mon*)** resource row appears (§2.4). **[SIDE-TRACK]** the **village reputation web** seeds here — **per-shop "patron/regular" meters** begin (§2.15, gentle curves; optional accelerant, never the gate). **[THREAD: Tama]** headman's daughter **Sayo** names him "Tama" on sight — the legend **ignites** (allegiance goes live this tier; §1.5.4). | *"You carry the house's business into Asagiri. A girl, Sayo, stops dead: 'Tama? You're alive?' The shop row — and coin — opens to you."* |
| **V1 — Recognised hand of the house** | `RANK` Estate Service rung-meter + story (the valley begins to know the house's man; shop + headman acknowledgment) | The house's reach widens: **The Chief's House** area (Yagōemon's receiving room, where the headman **acknowledges** the estate's man); **deeper satoyama rings** (combat keeps pace on valley pests, securing the estate's near-ground). **[SIDE-TRACK]** **The Inn & Rumours Board** area — the **rumours board** (§2.13) goes live with its **first optional folklore tidbit** (the "kappa" of the ford; look, or not), and the **bounded ±10% weather/festival mechanical layer** (§2.14/Q35) becomes felt. | *"The headman receives the house's man. At the inn, Sukezō taps a board of rumours: 'Folk say a* kappa *takes children at the ford…' (You may look, or not.) The weather begins to bite at the day's work."* |
| **V2 — Road-warden (*michi-ban*) for the house** | `RANK` Combat Rank rung-meter + story (make a stretch of valley road / the ford safe **in the estate's name**; survive a real bandit/animal clear — curated combat activities) | The estate's writ now reaches the **roads** — **HUNT / CLEAR at valley scale**; **The River, Ford & Weir** and **The Foothills & Charcoal Grounds** wilderness rings open (§2.9, ring 2); **better loot / craft tiers**; the **2nd weapon LINE opens** (a Combat Rank rung-gate; the roster grows **+3 across T1**, §3.5.1/§2.10.1). *(V2 combat feeds the **character (combat) level** + the **Combat Rank rung-meter**; the **Arms-pillar DEEDS** for these valley clears accrue in **T1's Phase 2**, not on the rungs; FU7.)* | *"You clear the ford road for the house. 'The road is declared safe — it's in the village book.' A new style of blade comes within reach. The Kurosawa name reaches past their own gate now."* |
| **V3 — The house's steward of the valley economy** | `RANK` Estate Service rung-meter + story (bring the valley economy + the estate's cash-crops to a recorded seasonal result) | The estate's domain grows to **the valley's livelihood** — the **TRADE sub-engine** of Estate & Wealth begins (it **opens at T1**, never T0): the **silk / sericulture *meibutsu*** (LOCKED) under weaver **Onatsu** (cocoon → reeled silk → woven textile rows, §2.11); the **component/quality crafting system** unlocks (hybrid → component chains, §2.11); **broker meters** appear; the **market-saturation damper** becomes visible (§2.4). **(Trade hard-capped ≤⅓ of Estate & Wealth — §2.16; its DEEDS accrue in Phase 2.)** | *"Onatsu shows you the reeling-frame: 'Silk pays, if you're patient.' The first bolt is graded and sold under the house's name. (Trade is one strand of one pillar — no more.)"* |
| **V4 — Trusted of the headman** (the house's hand puts a valley fire out) | `STORY` (resolve a village-affecting threat **on the estate's behalf** — **Magobei's** rice-skim surfaces; the headman's **personal** regard is earned as a SIDE accelerant) | The estate's **authority over valley affairs** is recognised in office: the **Standing & Office BAR reveals for the FIRST time** on the four-bar panel as this story beat lands (the skim resolved) — but **Office DEEDS accrue only in T1's Phase 2** (FU7), like every pillar; the **headman's roll-up quest** node; the **[MOTIF: rigged box]** doctored-*masu* thread (optional through-line). **[SIDE-TRACK]** Yagōemon's **personal** regard rises on the village web (optional). | *"You set the doctored measuring-box on the table. The skim ends; the valley breathes. For the first time a fourth standing — the* house's *office — appears on the panel, waiting to be earned."* |
| **V5 — Sworn man-at-arms of the house** (valley defence) | `RANK` Combat Rank rung-meter + story (stand a real watch **for the valley, in the house's name**; survive the first dangerous-road encounter; weapon-line milestones) | The estate becomes the **valley's shield** — the **first paid martial outsiders** (**Gohei & Yatarō**) join as a **light flavour retinue** (E2 rota, §2.17 — roster cards, **not** managed units); valley-defence **DEFEND** quests; festivals/seasonal social beats deepen (§2.14, e.g. Brewer **Tokuemon's** festival hub). **[NAOYUKI BEAT — narrative-only, ZERO mechanical effect]** heir **Naoyuki**, who vouched for you grudgingly at R4, rides out beside you on a valley watch and — for the first time — concedes you've outworked him; the rivalry tips toward **grudging respect** (seeding the earned **G5 ally-flip** against Tomita; Q26). | *"Two old* ashigaru *take the house's coin and stand its watch. Naoyuki, reining in beside you after a long night: 'You don't quit. I'll give you that.' The valley starts calling it 'the Kurosawa works.'"* |
| **V6 — Right-hand-in-waiting** (the house's agent over the valley) | `RANK` Estate Service rung-meter + `STORY` (Lord **Shigemasa** first believes the house's impact *beyond* the estate is possible) | The estate now effectively **runs much of the valley** through its agent — **authority across the valley**; the **alliance / standing levers** that point the house toward the region; the **region map seed** appears on the horizon of the tier-expansion map. | *"Shigemasa, watching the valley settle around the house: 'Perhaps… beyond this estate.' A far ridge, and a wider road, appear on the map."* |
| **V7 — Agent of the house, the valley anchored** *(capstone — END of PHASE 1 / ENTRY to PHASE 2)* | `RANK` Estate Service rung-meter **+ STORY** (the **"clean your room"** beat: the **estate** healthy, the **valley** anchored under it, immediate fires out) — **rung-meter + story ONLY**; the **Arms+Estate+Office hybrid profile is the SEPARATE Phase-2 T1→T2 tier-up gate** | The estate's domain is **secured at valley scale**; its standing is now **TRUSTED**. The capstone **OPENS T1's Phase 2** (the pillar grind across **Arms + Estate + Office**); the **REGION map** fully opens; the **T1→T2 quest** to grow the house's *regional* influence begins; **rival samurai houses appear** on the horizon (Tomita / Akagi as distant names); the **domain-ranking** read updates. **Clearing T1's Phase-2 hybrid profile → T2** (the domain expands again, to the Region). | *"The room is clean — house, valley, all of it. The lord: 'Now raise the house's name across all of it — then, the region.' Two rival names surface from beyond the ridge: Tomita. Akagi."* |

> **T1 deliberately withheld:** the **origin** track (still dark/foreshadowed by the dream — opens at T2); the
> *sekisho* / pass-tier travel layer; region-scale combat (the pass, rōnin/bandits as a population); **marriage
> / adoption** (T3+, §2.16.1); **auto-producers** (T3+); the **3rd weapon line** (T2). Folklore rumours unlock
> **organically and per-tier** (§2.13), and the **±10% weather/festival mechanical layer** (Q35) is itself a T1
> reveal — never an all-at-once dump. The **four T0 quest types are a STARTER set, not a cap** — more and varied
> quest types are authored as each later stage fits them (Q23).

> **T1 Phase 2 — what the back half REVEALS (D-Q4/D-Q-B2/D-Q-breadth-wall).** After V7 opens Phase 2, the grind
> over **Arms + Estate + Office** keeps revealing — it is not a flat number-climb: **the E2 "Recovering" estate
> BUILD completes** as a Phase-2 beat (the second workshop, the granary filled, the palisade raised into a real
> perimeter — estate fabric *finishing* on the influence track, post-V7, gated on the pillar-Influence floor,
> **not** the rungs; §2.17/§4.7.5/D-Q-B2); **Office DEEDS begin to count** for the first time (the bar *revealed*
> at V4 now *fills* — a new deed category opening mid-grind); and the **TRADE strand's first graded *meibutsu*
> payout** lands as an Estate-pillar beat (the silk bolt sold under the house's name, **≤⅓-capped**; §2.16). The
> **per-pillar shortfall is surfaced from the first Phase-2 season** (e.g. *"Office is behind"*), continuously,
> so the 3-pillar breadth gate is **never an end-of-phase wall** (§2.16(b)/D-Q-breadth-wall; no overflow).
> Clearing the 3-pillar hybrid profile (good in all three, great in 2) → **T2.**

### 3.4.1 The earned-transition spine — *why* each promotion happens (T1)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out in the valley — a **rung-meter + story** AND-gate), an
> in-fiction **reason** (why the *house's domain* expands), and a **named granter** — and **the GRANTERS are
> HOUSE-side** (the **Lord Shigemasa** / chief steward **Genemon**), with the valley's figures (headman
> **Yagōemon**) **acknowledging** the estate's growing role, never conferring rank. The throughline: **the
> estate's domain expands because you, its agent, deliver results in the valley** — survival (T0) becomes *the
> estate anchors its valley* (T1), standing **friendly → TRUSTED**.

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it (its domain expands) | Granter |
|---|---|---|---|
| **V0 → V1** | Run the house's first errands into Asagiri to an Estate-Service **rung-meter** threshold; open shop dealings (Gonta first) and survive valley pests on the near satoyama | The house, off the foreclosure cliff, must now **operate** in the valley, not just survive on its own land. A man who can carry its business and hold its near-ground is worth recognising → the valley starts knowing "the house's man" | Genemon *(Yagōemon **acknowledges** him at the receiving room — does not promote)* |
| **V1 → V2** | A **Combat Rank** rung-meter threshold — make a stretch of valley road / the ford safe in the estate's name; survive a real bandit/animal clear | The estate's reach can't stop at its gate while its own road is unsafe. Proving you can **secure the valley's roads** extends the house's writ past its fence → it names you its **road-warden** | Genemon (in the **Lord's** name) |
| **V2 → V3** | An **Estate-Service** rung-meter threshold — bring the valley economy + the estate's cash-crops to a **recorded seasonal result**; the silk *meibutsu* comes online | Solvency must scale beyond the home fields. You've proven you can run not just the estate's land but **the valley's livelihood** → the house makes you its **steward of the valley economy** | Genemon *(weaver **Onatsu** vouches for the silk hand)* |
| **V3 → V4** | A **STORY** trust beat — surface and end **Magobei's** rice-skim (the doctored *masu*) on the estate's behalf | A house that puts out the valley's fires is owed a voice in the valley's affairs. Resolving the skim **reveals the house's Office BAR** on the panel → the lord acknowledges the house holds an office's regard (the **Office DEEDS to fill that bar accrue in T1's Phase 2**, FU7) | **Lord Shigemasa** *(Yagōemon, the reachable culprit's patron, **acknowledges** the house's standing in disgrace)* |
| **V4 → V5** | A **Combat Rank** rung-meter threshold — stand a real watch for the valley in the house's name; survive the first dangerous-road encounter; weapon-line milestones; the first paid retinue (Gohei & Yatarō) stands up | The estate has become the thing the valley leans on for safety. A house that **shields its valley** needs sworn arms → the Lord swears you its **man-at-arms** and funds the first (light, flavour) retinue *(and heir **Naoyuki** first concedes grudging respect — the narrative-only beat seeding the G5 ally-flip)* | **Lord Shigemasa** + Genemon |
| **V5 → V6** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — the valley visibly settles **under the house**; the alliance/standing levers come into reach | With the valley anchored, the Lord — for the first time — believes the house's impact can reach **beyond** the estate. You are the only agent who has run all of it (errands, roads, economy, office, arms) → he makes you his **right-hand-in-waiting** | **Lord Shigemasa** |
| **V6 → V7** | The **capstone** — the **"clean your room"** beat (estate healthy, **valley anchored under the house**, immediate fires out): the Estate-Service rung-meter **+ story** — **ends Phase 1**. The **Arms + Estate + Office Phase-2 hybrid profile is the separate T1→T2 tier-up.** | The estate's domain is **secured at valley scale** and its standing is now **TRUSTED**. The Lord names you the house's **agent over the valley** (ends Phase 1) and points at **raising the house's standing across all of it** (Phase 2 opens) — then, once it has risen, the domain must expand **again — to the Region** → the **T1→T2 quest** opens; Tomita & Akagi surface as distant rivals | **Lord Shigemasa** *(capstone — "Raise the house's name; then, the region.")* |

The capabilities **stack** (operate in the valley → secure its roads → run its economy → hold an office in its
affairs → shield it → run all of it → anchor it) and the granters stay **HOUSE-side and climb** (Genemon → the
Lord), with the valley **acknowledging** rather than conferring — so the tier reads, start to finish, as **the
estate's domain expanding into the valley**, not as climbing village society. **V7 ends Phase 1** ("clean your
room"); the **Phase-2 grind** (raise Arms + Estate + Office to the hybrid profile) is the actual T1→T2 tier-up,
after which the lord believes wider impact is possible → **Region opens**. *(The **village reputation web** runs
alongside all of this as a parallel **optional** track — it can be fully completed and shaves ~10–15% off the
climb, but it **never** appears as a trigger above; §1.5.4, §2.15.)*

---

## 3.5 The navigation / screen-reveal track (the multi-screen shell, made explicit)

The UI shell **appears single-screen and grows into multi-screen navigation** (canon §H; §2.1b; §1.12). Because
this is the *signature* "UI as progression" feature, the nav chrome itself is laddered here as its own reveal
sequence (data: `RevealableEntry kind:'navLink'|'screen'`). It cross-cuts the tier ladders above. **Distinct
activities are TOP-LEVEL nav tabs, not nested panels** (Q10) — and each tab is its **own one-per-beat reveal**
(FU4/Q17), never batched.

| Nav / screen reveal | Trigger | What appears | Diegetic event-log line |
|---|---|---|---|
| **(none) — single column** | cold open → R1 | Just the event log + verb(s) + the two readouts. **No nav exists yet.** | *(no nav line — there is only one place to be)* |
| **First tab: "Skills"** | `RANK` R2 (Skills tab, §2.7) | The **first navigation appears** — the screen splits into *Work* + *Skills*. | *"You begin to notice you're getting better at this. (A way to track it appears.)"* |
| **"Combat" / "Yard" tab** | `RANK` R3 (Combat panel, §2.8) | A **Combat** nav node joins Work + Skills (drill yard, Bestiary, Equipment live under it). | *"There is fighting to track now, too."* |
| **"Crafting" tab** | `RANK` R4 (Crafting tab, §2.11) | A **top-level Crafting** nav tab joins (Q10) — the simple loot→craft loop at Gonta's forge, its own page (not nested under Combat). | *"A bench, a hammer, a handful of stock. A page for making things appears."* |
| **"Quests" tab** | `RANK` R5 (Quest log, §2.12) | A **top-level Quests** nav tab joins (Q10) — the quest log, its own page, opening with the T0 starter quest types (PEST/HUNT/CLEAR/DEFEND — a starter set, not a cap; Q23). | *"The work that finds you now has a page of its own: jobs taken, jobs done."* |
| **"Map" screen** | `RANK` R6 (errands authorised) | The **first map screen** (the estate, with a road leading out) becomes a distinct navigable screen. | *"You can picture the land now — the estate, and a road past the gate."* |
| **"House" / Influence screen** | `RANK` R7 (four-bar panel, §2.16 — **ENTRY to PHASE 2**) | A dedicated **House** screen (the four pillars + the domain-ranking read, §2.18) — its reveal **opens Phase 2**, the page on which you now **raise the house itself** (pillar deeds start accruing). | *"A page for the house itself — not what *you* are, but what it can *become*. Now: raise it."* |
| **"Village" screen** | `RANK` V0 (T1 opens) | A **Village** screen (shop row, reputation web, inn) joins the nav. | *"A new page: Asagiri, and everyone in it."* |
| **"Region" screen** | `RANK` V7 / `STORY` T1→T2 | A **Region** screen (the cluster map, the post-town, the roads) joins the nav. | *"The map grows a page wider: the region."* |
| **"Ties" / Origin screen** | `STORY`+`PILLAR` T2-G2 Origin track opens (doubly-earned) | An **Origin / Ties** screen (the Sawatari-juku contacts + the **`O0→O5` Origin reputation ladder**, §3.6.2). | *"A page you didn't know you'd been missing: people who knew your name."* |
| **"Castle-town" screen** | `STORY` T2→T3 *(stub in v1)* | A **Castle-town** screen **stub** — the **Daikan's-Office / castle-town first-contact cliff-hanger** (Q24/D-040; the racket's nerve-centre teased, no porter-guild framing). This **stub is the bounded "v1 complete" ending surface** (§3.7.0/D-Q-B11) — after it, free-play continues (tier HELD at T2-complete; no empty T3). | *"A page opens onto stone walls and a magistrate's seal — the castle-town invites the house in — and then the story pauses."* |

> **Responsive note (canon §H, §6.9):** on mobile the same nav reveals collapse into a bottom tab-bar / drawer
> that **grows the same number of entries in the same order** — **not** hover-dependent. The reveal *data* is
> shared; only the chrome differs (§6.9).

### 3.5.1 The combat-reveal ladder (combat functionality + the weapon roster, staggered — FU12/FU13/Q15)

Combat is a real **incremental progression surface**, not a single switch flipped at T0 — so its functionality
and its weapon roster reveal on their **own laddered track** (parallel to §3.5's nav track), **one reveal per
beat** (FU4/FU12; the old "drill yard + every slot at once" R3 dump is retired). Numbers/params → §4.6
*(proposed v1 balance)*; the byte-identical roster table lives at §2.10.1 / §4.6.9 / `content/items.ts` (§6.5).

**(a) The functionality-reveal cadence (one beat at a time):**

| Beat | Trigger KIND | What reveals |
|---|---|---|
| **R3** | combat rung (`STORY`/`RANK`) | The **single starter weapon** + the **bare auto-resolve loop** + **RETREAT** (a clean escape valve — keep HP + loot, modest clock cost, **never dents Influence**; Q16) + the **Bestiary**. The character (combat) **level** begins (kills → combat-XP only). Combat stats start near-zero. The **satiety→combat throttle** ("eat before you fight"; Q31/FU16) is live from here. |
| **R4** | loot→craft loop (`RANK`) | **Graded weapon-durability bands** surface with the simple Crafting loop + **Equipment/Inventory** — a **4-band** scale (75%+ / 50%+ / 1%+ / 0 → multipliers per §4.6.1c); a weapon degrades but is **NEVER auto-unequipped** (Q33/FU17). |
| **R5** | combat rung (`RANK` Combat Rank) | The **stance** slot on the Combat panel. *(Curated combat activities now feed the **Combat Rank** rung-meter; the **Arms PILLAR deeds do NOT accrue yet** — Phase 2.)* |
| **First weapon-line L10 milestone** | weapon-skill milestone (`FIRST-USE`/`STORY`) | The **ability + item** intervention slots unlock. |
| **T1** (V2) | combat rung (`RANK` Combat Rank) | The **2nd archetype line** opens on a Combat Rank rung-gate. |
| **T2** (G1/G5) | combat rung (`RANK` Combat Rank) | The **3rd archetype line** opens. |

**(b) The weapon roster growth (Q15/FU13).** New weapons are **FOUND and CRAFTED, never gifted**, and reveal
one at a time on the cadence above. **T0 starts with EXACTLY ONE** weapon and unlocks **+2 across the tier**
(the starter line); the roster grows **+3 at T1** (2nd line opens) and **+4 at T2** (3rd line opens) — **~9–10
weapons across v1**, spread over **3 archetype lines**, each weapon an **archetype** (its `baseSpeed` / `reach` /
`targetCount` / `attackProfile`) **+ a signature ability** (the crude **carrying-pole is a 0th IMPROVISED
weapon**, not a line; §2.10.1). Signature abilities deepen at higher weapon-line milestones (~L25 / L50 —
*proposed v1 balance*).

| Reveal point | Roster growth | Trigger KIND |
|---|---|---|
| **T0-R3** | the **single starter weapon** (Line 1) | combat rung (story) |
| **T0-R4** (loot→craft loop) | **+1** — the found/crafted **2nd weapon** (§7.2.0) | loot→craft loop (`RANK`) |
| **T0-R6** + a 2nd T0 beat | **+1** more — the **3rd weapon** (completes Line 1 by end-T0) | character-level / weapon-skill milestone |
| **T1 (from V2)** | the **2nd archetype LINE** opens; **+3** across the V-rungs | combat rung (Combat Rank) |
| **T2 (from G1/G5)** | the **3rd archetype LINE** opens; **+4** across the G-rungs | combat rung (Combat Rank) |

These feed the **THREE clean tracks** (§2.8.1/§3.0.1), never one fused bar: a weapon improves the **character
(combat) level**'s damage and enables more **Arms** deeds (Phase 2), while the **Combat Rank rung-meter** is fed
only by curated per-rung activities. The **T0-starts-1 / +2/+3/+4 cadence, the 3-line shape, the
FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are **canon, not levers** (§4.6.9).

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

**T2 is the SAME two-phase motion as T0/T1 (§3.0.1).** **Phase 1** = climb `G0→G7` (each rung an **AND-gate**:
the per-rung **Estate Service** / **Combat Rank** rung-meter + the rung's story milestones; **pillar DEEDS do
NOT accrue**). The capstone **G7 OPENS Phase 2** — and **Phase 2** = grind the **revealed** pillars to **T2's
hybrid gate**, now over **4 revealed pillars** (Arms + Estate + Office, with **Name** surfacing): **good in ALL
revealed · great in 2–3 · excellent in 1–2**, **NO overflow** (numbers → §4). The required pillars **drift**
toward **Estate + Office great/excellent, Arms good** — the **"win it socially"** steepening (§4.1) — so the
Office grind is a **Phase-2 emphasis** this tier.

**THREE parallel reputation tracks (only one gates the tier):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `G0→G7` ladder below (Phase 1), then the Phase-2
  pillar grind. **Both** gate **T3 / the castle-town** (canon §"Reputation systems model"). Rising it raises
  **House Influence** and grows the estate's reach to **region** scale. Labour and combat keep interleaving at
  region scale; the four-pillar panel exists from T0-R7, and T2 drives **Office** to the fore (the "win it
  socially" steepening, §4.8.3). Estate standing climbs **trusted → HONORARY MEMBER of the house**.
- **(SIDE-TRACK A) Village reputation web — carried from T1, still OPTIONAL.** The Asagiri per-shop / per-family
  meters, the headman's **personal** regard, the inn/rumours web, and the **Tama-vs-farmhand allegiance**
  (§1.5.4, §2.15) persist as a fully-completable accelerant — it shaves **~10–15%** off time-to-T3 but
  **NEVER gates the spine**.
- **(SIDE-TRACK B) Origin reputation — NEW this tier (`O0→O5`; see §3.6.2).** Tahei's **living** origin
  community at **Sawatari-juku** is **a proper one-tier standalone reputation side-track with its OWN rung
  ladder** (elaborates D-009 / canon §"Reputation systems model"). It **opens at G2** (doubly-earned:
  dream-memory **AND** travel-standing), is **optional, fully completable, an accelerant, narrative-only with NO
  retroactive gift from remembering** (the present-day relationships it builds — the morale buff + trade-tie
  ~10–15% speedup — **do** stay; Q12), and **NEVER gates the spine**. The **reunions** and **Tahei's
  name-reclaim** land on *this* track; the **Otsuru/Tama truth** lands on the **spine** at G6 (guaranteed).

> **Only the estate spine (the `G0→G7` rungs + their Phase-2 pillar profile) gates T2→T3.** Village and Origin
> are both fully-completable optional side-tracks — ignoring either leaves you only poorer and lonelier, never
> walled (canon §"Reputation systems model").

Estate stage span: **E2 Recovering → E3 Prosperous / Recovering+** (Q8 — **E3 is now authored in full in v1**:
a third workshop + full granary, the palisade closed into a proper perimeter, a standing 4–5-man rota, the
*shinden* reclamation paying out — the house visibly **back on its feet**; estate fabric runs *ahead* of top
personal rank, gating on pillars + a **low** rank floor, never the capstone; §1.5.1) — i.e. **the E3 build
COMPLETES as a Phase-2 beat** (committed at G4, finished post-G7; §2.17/D-Q-B2). **E4–E5 stay parked.**
**Required pillars drift** toward **Estate + Office** (Arms secures roads). Ladder shape (LOCKED, §1.5.1 / §5
T2.2): the house's **valley-envoy → road-captain of the cluster → broker of the post-town trade → arbiter
between valleys → recognised regional retainer → captain of the road-security detail → alliance-broker → leading
house of the region** (the rivals dethroned).

| Rung | Trigger (rung gate) | What this rung REVEALS (fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **G0 — The house's valley-envoy** | `STORY` (T1→T2 quest; broker the estate's surplus beyond Asagiri) | The estate pushes its business past the valley — the **trade backbone** opens **minimally** (one route, one porter, one verb): friend **Kanta** runs the house's first consignment off the books (§1.7.1, the Kaidō Porters' & Transport Guild seed). **[RIVALS]** the names **Tomita** and **Akagi** harden from distant rumour into the region's **two incumbent samurai houses** — Tomita's agent **Yasubei** is already brokering the route you want. **[THREAD: Origin]** first origin contact made (the `O0→O5` track still closed). | *"You carry the house's surplus past the ridge — and find the road already worked. 'Tomita's man bought that consignment yesterday,' says a familiar face: Kanta. 'I'll run yours, for old times' sake.' One route. One load. (Why does his face ache to remember?)"* |
| **G1 — Road-captain of the cluster (for the house)** | `RANK` Combat Rank rung-meter + story (secure the cluster's roads **in the estate's name**; first *sekisho* turn-back → obtain a pass under the house's seal — curated combat activities) | The estate's writ reaches the **region's roads** — the ***sekisho* / pass-tier travel layer** (travel-standing made felt); **region-scale combat rings** (the pass; **rōnin / bandits / smugglers** as grindable human mobs, §2.9); the **3rd weapon LINE opens** (a Combat Rank rung-gate; the roster grows **+4 across T2**, §3.5.1/§2.10.1); rumours of the **"one-eyed mountain god"** (= **Hanzaki** + fog-blind terrain) surface on the board. **[RIVALS]** the unsafe roads are partly **Tomita's** doing (their muscle-for-hire, often **Hanzaki**). *(G1 combat feeds the **character (combat) level** + the **Combat Rank rung-meter**; the **Arms-pillar DEEDS** accrue in T2's **Phase 2**, FU7.)* | *"The barrier-guard turns you back — then, seeing the Kurosawa seal, waves you through. The cluster's roads are the house's to keep now. A heavier class of weapon comes within reach. The brigands who skip Tomita's wagons and hit yours whisper of a one-eyed god on the pass."* |
| **G2 — Broker of the post-town trade (the house's factor)** *(the Origin side-track OPENS here — §3.6.2)* | `RANK` Estate Service rung-meter **+ STORY** (register the house at the *toiya*) — **the RUNG promotion gates on rung-meter + story only.** *(SEPARATELY: the **Origin SIDE-TRACK opens** on its own **doubly-earned** condition — **STORY** the dream returned enough memory **AND** **PILLAR** travel-standing to walk the checkpointed *kaidō*; §1.5.3/FU11. This is a side-track unlock, **NOT** a four-pillar tier-gate and **NOT** the rung trigger.)* | **Sawatari-juku** post-town area opens; the **toiya** transport office registers **the estate** as a regional factor (the export ramp to T3); **the ORIGIN reputation side-track opens at `O0`** (§3.6.2) — the **Origin / Ties screen** (§3.5). **[RIVALS]** at the *toiya* the Kurosawa factor sits **below Tomita's** established berth and **outside Akagi's** old precedence — the regional pecking order is now visible and contestable. | *"You register the house's mon at the Sawatari-juku* toiya *— third behind Tomita and Akagi. Then the street stops: an old woman drops her basket. 'Tahei…?' The name lands like a stone in still water. Your own past opens."* |
| **G3 — Arbiter between valleys (for the house)** | `RANK` Estate Service rung-meter + story (court / supply / arbitrate the two neighbouring valleys **on the estate's behalf**) | The estate's authority extends over **The Neighbouring Valleys** — **Hibara** + **Tōge-mura** (hard-capped at exactly two, §1.7.1), Asagiri fractally replicated, slimmer. **[RIVALS]** both valleys are **already courted by Tomita** (cheaper grain) and watched by **Akagi** (older ties); you win them by **out-supplying and out-arbitrating** — contested meters flip your way, **never by force** (canon §B). The two rivals can be **played against each other** (money vs precedence). | *"Two valleys, weighing the houses courting them. Tomita undercuts you on rice; Akagi sniffs that the Kurosawa are upstarts. You arbitrate, you supply, you out-give — and the valleys lean the house's way."* |
| **G4 — Recognised regional retainer of the house** | `RANK` Estate Service rung-meter **+ STORY** (reach Kuzuhara with conditioning + standing; the house takes on a region-scale work) | The house's name attaches to **Kuzuhara** — the drowned upstream hamlet (the Kurosawa's own **root-sin**: ancestor Sadamune's neglected flood-works); a multi-stage **river-works (*seki*)** project (a LAND mega-lever) — **committed here (Phase 1), but the E3 "Prosperous" estate BUILD it drives COMPLETES as a Phase-2 beat** (gated on the pillar-Influence floor, not the G-rungs; §2.17/§4.7.5/D-Q-B2) (Q8: the river-works/resettlement is the E3-stage estate-fabric lever); **resettlement** re-founds the hamlet as a region node; **the drowned are named** (grief-work + temple register — **not a rite**). **[RIVALS]** the works the rivals never bothered with become the region's proof the **Kurosawa** lead by *building*, not just trading. | *"The broken embankment; the empty houses underwater; Dowager Toku's shame made real. Neither Tomita nor Akagi ever touched it. You begin to raise the* seki *under the house's name — and to name the drowned. The Kurosawa works stand whole again."* |
| **G5 — Captain of the house's road-security detail** | `RANK` Combat Rank rung-meter + story (break the brigand roost; secure the trade pass **for the region, in the house's name** — curated combat activities) | The estate becomes the **region's shield** — a **hard-capped 2–3-man detail** (martial scale capped, canon §E; §2.17); escalating **Hanzaki** encounters (**survived, not won** — trained, never gifted); a **CLEAR/CAPTURE-with-mercy** branch (a famine-band can be fed/resettled, not killed). **[RIVALS]** breaking the roost cuts off **Tomita's** hired teeth — Hanzaki is exposed as their muscle. *(G5 combat feeds character level + the Combat Rank meter; Arms DEEDS accrue in Phase 2.)* **[NAOYUKI]** heir **Naoyuki** — turned to grudging respect at T1-V5 — now rides as your **ally against Tomita** (the earned flip; Q26). | *"You and two others hold the pass for the house. Hanzaki — Tomita's hired edge — tests you, and you live: endurance, not talent. Naoyuki at your shoulder now, not your throat. With the roost broken, the safe road is the Kurosawa's, not theirs."* |
| **G6 — The house's alliance-broker** *(the Otsuru TRUTH resolves on the SPINE — guaranteed for every player; the reunions + name-reclaim are on the optional Origin track §3.6.2)* | `RANK` Estate Service rung-meter **+ STORY** (broker the region's alliances; the rivals' contest tips; the Otsuru truth lands) — **rung-meter + story; the win-the-region PILLAR profile is the SEPARATE Phase-2 tier-up** | **[RIVALS]** the house brokers the region's alliances over the rivals' heads: **Akagi** is settled by *restoring its old precedence* (the proud line gets its honour back and stands with you), isolating **Tomita** commercially — the détente that sets up G7. **[THREAD: Tama] — PAYOFF (SPINE — guaranteed at G6 for EVERY player):** the living, grown **Otsuru** is found — Tama was a **girl** who **ran**; the MC is **not** her (grounded + **partial**; she may not forgive). **[THREAD: Origin — OPTIONAL track O5, DEEPENS this beat, NEVER gates it]:** *on the Origin track* the reunions complete (incl. father **Jinpachi**) and **Tahei reclaims his true name** at **O5** — **earned and MISSABLE** (a player who skipped the Origin track gets the Otsuru truth here regardless, but **never** the name-reclaim or the morale buff). The Origin **pride/morale** buff (a *present-day relationship*) lands on that track, **never** a retroactive gift from remembering. | *"You broker the region's alliances over the rivals' heads — Akagi at your side, Tomita boxed in. And down-valley: she is real, and grown, and not you. 'Tama ran. Tama lived.' You pick the house's work back up."* |
| **G7 — Leading house of the region** *(capstone — END of PHASE 1 / ENTRY to PHASE 2; the rivals DETHRONED)* | `RANK` Estate Service rung-meter **+ STORY** (**win the region's leadership**: rivals no longer the leaders) — **rung-meter + story ONLY; the Arms+Estate+Office(+Name) Phase-2 hybrid profile is the SEPARATE T2→T3 tier-up gate** | The capstone **OPENS T2's Phase 2** (the four-pillar grind to the hybrid profile over the **revealed** pillars — Estate + Office great/excellent, Arms good, Name surfacing). The **rival houses Tomita & Akagi are surpassed** (Akagi allied with restored precedence; **Tomita** out-competed into commercial détente — **never killed**, canon §B). The estate's standing is now **HONORARY MEMBER of the house**; the **region domain-ranking** read shows the Kurosawa **leading**; the castle-town rulers **confer regional leadership** and **invite** the house in; the **Castle-town screen STUB** (§3.5) appears as the **T3 cliff-hanger first-contact**. **Clearing T2's Phase-2 hybrid profile → T3 (stub; the domain expands again, to the castle-town).** | *"The region's leading house is the Kurosawa now — Tomita and Akagi behind them. A messenger in finer cloth than you've seen: 'The castle-town confers the region on your house, and invites it in.' Raise the house's standing to meet it — and the page turns onto stone walls, where the story pauses."* |

> **T2 honours the dream rule (binding):** the returning **memory / backstory reveal** grants **access only**
> (new nodes/allies/quests) and **NO retroactive stat/recipe/tool/combat bonus**; the present-day relationships
> you then build (the morale buff + the ~10–15% trade-tie speedup) **are** legitimate mechanics that stay (Q12,
> §1.5.3). At least one Origin beat is always available **without** reputation-gating so the thread never stalls
> (§5 T2.2). **Belief-creatures stay out of spawn tables** — the "one-eyed mountain god" is an
> **INVESTIGATE-then-confront one-shot** (Hanzaki + terrain), never a population (canon §E; §2.9, §2.13).

> **T2 deliberately withheld** (fractal discipline): **auto-producers** (T3+, §2.5 — Kuzuhara's first returnee
> producer is the *latest-game* exception); the **marriage / adoption** lever (T3+, §2.16.1); the castle-town
> *daikan*/*tedai* officialdom and inter-*han* markets (the T3 stub only teases them, §3.7.1). Folklore rumours
> keep unlocking **organically and per-tier** (§2.13) — never an all-at-once dump. The four T0 quest types stay
> a **starter set, not a cap** — region-scale quest types (escort/patrol/bounty/duel/investigate/…) are authored
> wherever they fit (Q23).

> **T2 Phase 2 — what the back half REVEALS (the richest Phase 2; D-Q4/D-Q-B2/D-Q-seasonal-rotation/D-Q-breadth-wall).**
> T2's Phase 2 is the longest grind, so it carries the **most** anti-slump reveals — it is explicitly **not** a
> dead consolidation half: **the E3 "Prosperous" estate BUILD completes** as a Phase-2 beat (the river-works
> committed at G4 pays out, the third workshop + full granary stand, the perimeter closes — the house visibly
> back on its feet, gated on the pillar-Influence floor, **not** the G-rungs; §2.17/§4.7.5/D-Q-B2); **Name DEEDS
> begin to count** for the first time (the fourth/Name pillar surfacing as a new deed category mid-grind, the
> seasonal-honour deeds; §4.1/D-Q3); the **cross-pillar COMBO unlocks** (Model-A — a combo credits **both**
> paired pillars but its bonus is excluded from the gate-check + the trade ≤⅓ denominator; §4.3.1/D-Q5/D-Q-meibutsu)
> as the **1st** late-game anti-slump lever; and the **per-season SEASONAL-ROTATION** (a per-season featured
> deed/bonus; §2.14/D-Q-seasonal-rotation) is the **2nd**, so the back half never flattens into one optimal loop.
> The **per-pillar shortfall is surfaced from the first Phase-2 season** — with required pillars drifting toward
> **Estate + Office** great/excellent (the "win it socially" steepening, §4.1), the lagging bar reads plainly
> (e.g. *"Name is behind"*), continuously, so the breadth gate is **never an end-of-phase surprise**
> (§2.16(b)/D-Q-breadth-wall; no overflow/substitution). Clearing T2's hybrid profile over the revealed pillars →
> the **v1-complete surface** (§3.7.0), **then** T3 (stub).

### 3.6.1 The earned-transition spine — *why* each promotion happens (T2)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1 / §3.4.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out across the region — a **rung-meter + story** AND-gate, never a
> pillar threshold), an in-fiction **reason** (why the *house's domain* expands to region scale), and a **named
> granter** — and **the GRANTERS stay HOUSE-side and escalate** (chief steward **Genemon** → the **Lord
> Shigemasa** / heir **Naoyuki**), with the region's figures (the *toiya*, neighbouring headmen, the **rival
> houses Tomita & Akagi**) **acknowledging, contending with, and finally ceding to** the house — never
> conferring rank — until the **capstone**, where the **castle-town authorities** confer regional leadership and
> invite the house in (after the Phase-2 grind, the T2→T3 gate). The throughline: **the estate's domain expands
> to region scale because you, its agent, deliver** — *the estate anchors its valley* (T1) becomes *the estate
> leads its region* (T2); standing **TRUSTED → HONORARY MEMBER of the house**.

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it (its domain expands to region scale) | Granter |
|---|---|---|---|
| **G0 → G1** | Run the house's first surplus past the valley (Kanta's off-books route) **and** survive the region's roads where **Tomita's** brokers already operate (Combat Rank rung-meter + story) | The house, having anchored its valley, must now **trade and travel at region scale** — but the roads are unsafe and the rivals already worked. A man who can carry its business and hold the cluster's roads is worth raising → it names him **road-captain** | Genemon *(the *toiya* and Tomita's agent **Yasubei** merely **note** the new Kurosawa man)* |
| **G1 → G2** | A **Combat Rank** rung-meter threshold + story — secure the cluster's roads in the estate's name; earn the first *sekisho* pass under the house's seal | The estate's writ can't reach the region while its caravans are turned back at the barriers and harried on the pass. Proving you can move the house freely and safely earns it a **factor's** standing at the post-town → it makes you its **broker** *(SEPARATELY, the **doubly-earned** dream + travel-standing conjunction opens the Origin SIDE-TRACK, §3.6.2 — narrative-only, **NOT** a promotion trigger and **NOT** a pillar gate)* | Genemon (in the **Lord's** name) *(the **toiya** registers the house — third behind **Tomita & Akagi**)* |
| **G2 → G3** | An **Estate-Service** rung-meter threshold + story — court, supply, and arbitrate **Hibara** + **Tōge-mura** on the house's behalf, out-supplying **Tomita** and out-precedence-ing **Akagi** | Region leadership means the neighbouring valleys lean on **your** house, not the rivals'. Winning them by giving more (never force) proves the estate can **govern beyond its own valley** → it makes you its **arbiter between valleys** | **Lord Shigemasa** *(the two valleys **lean** the house's way; the rivals **contest** but cede)* |
| **G3 → G4** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — reach Kuzuhara with conditioning + standing and commit the house to the multi-stage **river-works (*seki*)** the rivals never touched (this lands estate stage **E3 Prosperous**, Q8) | A house that **builds** what others wouldn't — atoning for its own root-sin while re-founding a region node — earns recognition as a true regional retainer, not just a trader. The works are the region's proof the **Kurosawa lead by building** → the Lord recognises you as his **regional retainer** | **Lord Shigemasa** *(Dowager **Toku** and carpenter **Risuke** vouch; the region marks that **neither rival** did this)* |
| **G4 → G5** | A **Combat Rank** rung-meter threshold + story — break the brigand roost and secure the trade pass for the region, exposing **Hanzaki** as **Tomita's** hired teeth | The region now leans on the house for **safety**, not just supply. A house that **shields the region's roads** — and cuts off a rival's muscle doing it — needs a sworn captain → the Lord names you captain of its **road-security detail** (hard-capped, canon §E) | **Lord Shigemasa** + Genemon *(heir **Naoyuki** now rides as **ally against Tomita** — the flip earned by the T1-V5 respect beat)* |
| **G5 → G6** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — broker the region's alliances over the rivals' heads: settle **Akagi** by restoring its precedence and isolate **Tomita** commercially | With supply, build, and arms all carrying the house's name, it can now **broker the region's alliances itself** — turning a proud rival into a partner and boxing in the other. You are the only agent who has run all of it → he makes you the house's **alliance-broker** *(the **Otsuru truth** resolves on the **SPINE** at G6 — guaranteed for every player; the family **reunions** + the **name-reclaim** deepen it on the optional Origin track §3.6.2, **NOT** a trigger)* | **Lord Shigemasa** *(Akagi's **Gennai** allies; **Tomita's Sōzaemon** concedes ground)* |
| **G6 → G7** | The **capstone** — **win the region's leadership** (rivals no longer the leaders): the Estate-Service rung-meter **+ story** — **ends Phase 1**. The **Arms + Estate + Office (+ Name) Phase-2 hybrid profile is the separate T2→T3 tier-up.** | The capstone names the Kurosawa the region's **leading house** (Akagi allied, Tomita out-competed into détente — never killed). The estate's standing is now **HONORARY MEMBER of the house**. Once the **Phase-2 grind** raises the house's standing to the hybrid profile, the **castle-town authorities confer regional leadership** and **invite the house in** → the **T2→T3 quest** opens; the domain must expand **again — to the castle-town** | **Lord Shigemasa** (house-side rank) *+ the **castle-town authorities** (confer regional leadership / invite the house in) — capstone: "the castle-town invites your house."* |

The capabilities **stack** (trade the region → secure its roads → broker its post-town → arbitrate its valleys
→ build its works → shield its roads → broker its alliances → lead it) and the granters stay **HOUSE-side and
climb** (Genemon → the Lord / Naoyuki), with the region (the *toiya*, the valleys, **Tomita & Akagi**)
**acknowledging, contending, and ceding** rather than conferring — until the **castle-town** confers regional
leadership at the top. So the tier reads, start to finish, as **the estate's domain expanding to the region**,
not as climbing region society. **G7 ends Phase 1** (**rivals dethroned; region led**); the **Phase-2 grind**
(raise Arms + Estate + Office, Name surfacing, to the hybrid profile) is the actual T2→T3 tier-up → the
castle-town invites the house in → **T3 opens**. *(The **village web** and the new **Origin track** (§3.6.2) run
alongside as **optional** accelerants — neither ever appears as a trigger above; canon §"Reputation systems
model".)*

### 3.6.2 SIDE-TRACK B — the Origin reputation ladder (`O0 → O5`, a one-tier standalone track)

> **What this is.** Tahei's **living** origin community at **Sawatari-juku** — a **proper one-tier standalone
> reputation side-track with its OWN rung ladder** (elaborates D-009 / canon §"Reputation systems model"). It
> mirrors how T1's village web is a parallel side-track, but shaped as a **short laddered arc** (the reunion *is*
> a sequence) rather than a multi-node web. **Prefix `O`** (Origin) — distinct from the estate rung scheme
> `R/V/G/C/E` *and* the estate physical stages `E0–E5`.

**Hard rules (binding, canon §C / §"Reputation systems model").** The Origin track is **OPTIONAL, fully
completable, an accelerant, and NEVER gates the spine** (it is not a trigger anywhere in §3.6.1). It is
**deliberately LIGHT** (6 rungs, not 8 — it must never read as a second spine). It **opens at G2** on the
**doubly-earned** gate (**STORY** — the dream returned enough memory — **AND** **PILLAR** — travel-standing to
walk the checkpointed *kaidō*; §1.5.3). **The guardrail is gift-vs-work (Q12, rescoped):** **returning MEMORY
itself grants ZERO retroactive bonus** — the backstory reveal confers **no stat, recipe, tool, or combat
bonus**; it grants **access** only. But the **present-day relationships** you then build **ARE legitimate
mechanics that STAY**: the Origin **pride/morale** buff (a modest global skill-XP nudge, framed as "a man with
people behind him works harder" — a present-day relationship, **never a gift from remembering**) and the
**origin trade-ties** that **shave ~10–15% off time-to-next-tier** are *earned new relationships, not retroactive
gifts*. **At least one Origin beat is always available without rep-gating** so the thread never stalls. The
**Tama-payoff** (Otsuru) is **spine-guaranteed at G6**; on **this** track the reunions complete and **Tahei
claims his true name at the O5 capstone — EARNED and MISSABLE**.

| Origin rung | Earned by (trigger — own meter: **Origin Ties**) | Beat | Diegetic event-log line |
|---|---|---|---|
| **O0 — Recognised at Sawatari-juku** | `STORY` + `PILLAR` (the **doubly-earned** G2 side-track gate: dream-memory **AND** travel-standing) | The track **opens**: the old woman in the street names "Tahei"; the post-town's people half-remember a vanished porter-boy. The **Origin / Ties screen** lights (§3.5). | *"An old woman drops her basket. 'Tahei…?' The street remembers a boy who never came home. A page opens onto people who knew your name."* |
| **O1 — The household reopens** | `RANK` Origin Ties (return often enough to be let back over the threshold) | Mother **Oyuki** (the emotional core) and sister **Okimi** take him back in — grieved-as-lost, now home. Earned and a little costly. | *"Oyuki's hands stop at the loom. 'You're thin.' She feeds you anyway. Okimi just cries, then scolds. You are, somehow, home."* |
| **O2 — The old trade welcomes him** | `RANK` Origin Ties (work a few honest runs with the old crew) | Old employer **Master Denbei** and the **porter guild** take his hand again; friend **Kanta** (met at G0) is rekindled comic-warm. The porter's-knot is just *how the men here tie loads* — **ZERO bonus**, confirmed mundane. | *"Denbei grunts: 'Still tie a load like my house taught you.' The guild makes room. Kanta's already laughing. (The knot was never a secret — just home.)"* |
| **O3 — The half-remembered tie** | `RANK` Origin Ties (a gentle, optional thread the dream surfaces) | Sweetheart **Osen** — half-remembered, gentle, **narrative-only** (no dating-sim). Optional even within this optional track. | *"Osen, at the well, doesn't run. 'I waited a while. Then I stopped.' Neither of you knows what's left — only that it's not nothing."* |
| **O4 — The father returns** | `RANK` Origin Ties (the deepest tie; opens late on the track) | Father **Jinpachi** — grieved as away/lost — returns. A **clean, warm, un-stacked** reunion (NOT a third debt-bondage arc; the source of the porter's-knot lineage, **ZERO retroactive bonus**). Optional later T4 callback. | *"Jinpachi, older, leaner: 'They said the pass took you.' A long silence. Then: 'Tie off that load properly, boy.' It is the most he can say, and it is everything."* |
| **O5 — His name set down (the reunions complete)** *(Origin capstone — coincides with & DEEPENS the spine G6 beat; the **Otsuru truth-reveal is spine-guaranteed at G6, NOT gated here**; the **name-reclaim is EARNED + MISSABLE**, Q5/Q25/Q40)* | `RANK` Origin Ties (the track completes; coincides with the G6 spine beat) | **[THREAD: Origin] — PAYOFF:** with the **Otsuru truth already landed on the spine at G6**, the present-day family reunions complete and **Tahei sets his true name down** among his own people. The Origin **pride/morale** buff lands (a present-day relationship; **no retroactive gift from remembering** — but an earned mechanic that **stays**, Q12). *(A player who **skips the Origin track** still gets the G6 Otsuru truth-reveal on the spine — they only miss the reunions, the **name-reclaim**, and the buff; the name "Tahei" may **never** be reclaimed.)* | *"You have a name again: Tahei. You set it down quietly among your own people — and pick your work back up."* |

> **Why `O0→O5` and not `O0→O7`:** the Origin track is a **support arc, not a frontier** — a short reunion
> sequence, kept light so it never competes with the estate spine for the player's attention or reads as a
> second main quest (canon §C, lean discipline). It runs **entirely inside T2** (G2 → G6), is fully completable,
> and shaves a felt-but-small slice off the climb (folded into the ~10–15% side-faction speedup, §1.5.4) —
> **never required, never a wall.** *(Place names stay fictional; **Nihonbashi** is the lone explicitly
> allow-listed real place, surfacing only at the T4 Edo conduit, not here; Q12.)*

---

## 3.7 T3 / T4 — sketched ladders (forward; stub + roadmap)

Per v1 scope (canon §I), **T3 is a stub cliff-hanger** and **T4 is a roadmap**. Their fresh ladders are
**scoped forward** here — *shape only*, not authored rung-copy — so the per-tier-ladder motion is legible and so
the later reveals (**auto-producers**, the **marriage/adoption lever**, the **national *banzuke***) have an
explicit home. Full authoring deferred.

> **Same spine, two more frontiers (canon §"Reputation systems model").** T3/T4 carry the **same model as
> T0–T2** — including the **SEQUENTIAL two-phase per-tier motion** (Phase 1 climb the rungs on rung-meter +
> story; Phase 2 grind the revealed pillars to the hybrid gate, then tier-up; §3.0.1/FU7): the **estate's domain
> expands again** — **+ the castle-town** (T3), then **+ Edo / national** (T4) — and **every rung stays in the
> house's theme** (the house becoming a castle-town power, then a nationally-ranked house — **NOT** the MC
> climbing castle-town / Edo society; the castle-town & Edo figures **acknowledge, contend with, and cede**, and
> **only the estate spine gates tiers**). The **estate-rep arc continues**: **honorary member** (entering T3)
> **→ chief steward / *yōnin*** (T3 — the MC's personal **CEILING**) **→ T4: the MC STAYS *yōnin*; the arc
> shifts to the HOUSE's national standing** — the indirect / mediated Edo ceiling, the *house* ranked, never a
> personal *hatamoto* / shogunal rise (canon §F / §I, D-010).

### 3.7.0 The v1 ending — a bounded "v1 complete" surface, THEN free-play (D-Q-B11)

> **v1 terminates on a real, bounded closure — not a dead cliff-hanger.** When **T2's Phase-2 hybrid profile
> clears**, the **castle-town first-contact** (the "stone walls" beat — the **Castle-town screen STUB**, §3.5 /
> §3.6 G7) renders as an explicit, authored **"v1 complete" ending surface**: it **acknowledges the run has
> reached its v1 frontier** (the house leads its region; the castle-town confers regional leadership and invites
> it in; *"the story pauses here — for now"*). The cliff-hanger becomes a **surface, not a stat-wall.**
>
> **THEN free-play continues (the active loop keeps running).** After the v1-complete surface, **play does not
> stop**: the tab-open auto-resolve + auto-repeat loop runs on, and the **tier is HELD at T2-complete** — the
> player may **finish the side-tracks** (the village reputation web, the Origin `O0→O5` ladder incl. the missable
> name-reclaim), **push pillars past their gate floors** (the FLOOR-not-ceiling design, §3.0.1(6)), and complete
> the bestiary / weapon roster. The **post-gate clock/accrual policy is defined**: the world-clock keeps ticking,
> deeds still accrue, **NO decay-tax, NO reset** (canon §B; §3.0.1(6)).
>
> **v1 commits NO empty T3.** §3.7.1 / §3.7.2 below are **forward sketch only** — the `C*` / `E*` ladders are
> roadmap *shape*, never shipped-empty content; v1 does **not** open a playable-but-hollow T3. The **M6 milestone
> carries a PLAYER-FACING terminal assertion** (reachable closure + a defined post-gate clock/accrual policy),
> **not** merely the "no-T3" negative test (D-Q-B11).

### 3.7.1 T3 — The estate's domain expands to the castle-town (stub; `C0 → C7`, forward)

> **What this tier IS (sketch).** Like T1/T2, T3 is **not** "the castle-town track" — it is the **HOUSE
> rising**, a **fresh per-tier ladder** (climbed in the same **two phases**, §3.0.1) on which the Kurosawa
> estate's **domain expands again** (from leading its region in T2 to the house **becoming a castle-town power
> that holds key domain offices** in T3), and the MC's estate standing climbs **HONORARY MEMBER → chief steward
> / *yōnin*** (his **personal CEILING**, canon §I). Every rung stays **in the house's theme**; the castle-town's
> figures (the *daikan* / *tedai* officialdom, the rival merchant houses) **acknowledge, contend with, and
> finally cede to** the house — they do not promote you; **the house does**. **v1 ends on the entry to this
> tier** — the **Daikan's-Office / castle-town first-contact cliff-hanger** (Q24/D-040), no porter-guild
> framing. *(Carried forward: **T4** is the domain expanding **again — to Edo / the nation**, where the MC
> **stays *yōnin*** and the arc becomes the **HOUSE's**; §3.7.2.)*

Required pillars drift to **Office + Name dominant** (the takeover is **won socially**; Arms/Estate as
leverage). **MULTI-ROUTE takeover** (peaceful: office / economy / **marriage** / out-maneuvering rivals; AND
assertive: martial-security leverage) — "take over" = becoming the **dominant house holding key domain
offices**, **never rebellion** (canon §B).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **C0 — The house's envoy at the castle-town gate** | The **Castle-town map / screen** proper (beyond the T2 first-contact stub); the *daikan* / *tedai* officialdom layer the house must now operate within. | `STORY` T2→T3 (the castle-town confers regional leadership / invites the house in — the v1 stub cliff-hanger, Q24) |
| **C1–C2 — The house's office-seeker & inter-*han* factor** | **AUTO-PRODUCERS first appear** (§2.5, T3+ ONLY) — seconded / recruited helpers as **light roster cards** trickling a resource (no assignment panel, ever); inter-*han* market rows as the house pushes its trade to castle scale. | `RANK` (Phase 1) + Phase-2 `PILLAR` Office |
| **C3–C4 — The house holds a minor domain office** | **Jobs-as-offices at castle scale**; the **debt-restructuring / *goyōkin* TREASURY mega-lever** (Marutaya / *fudasashi* network, §1.7.1). | `PILLAR` Office (Phase 2) |
| **C5 — The house's alliance-maker** | **THE MARRIAGE / ADOPTION lever** (§2.16.1, T3+ ONLY) — a brokered **Standing & Office + Name & Honour** one-time jump and a **takeover route** for the house (NOT a relationship sim). | `STORY` + `PILLAR` Name |
| **C6 — The house eclipses its rivals** | The **antagonist Tedai Kuroiwa** ("the gracious door") arc; the racket's nerve-centre (the *Daikan's* Office, §1.7.1) out-maneuvered — **never rebellion** (canon §B). | `STORY` |
| **C7 — The dominant house of the castle-town; the MC made chief steward / *yōnin*** *(capstone — ends Phase 1; the Phase-2 Office+Name hybrid profile is the T3→T4 tier-up)* | The **domain *banzuke*** shows the house atop the castle-town (holding the key offices); the MC's estate standing reaches its **CEILING — chief steward / *yōnin*** (canon §I); the **T3→T4 "taste of Edo"** (the house called to staff & run the *domain's* Edo establishment — the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own). | `RANK` (capstone) + Phase-2 `PILLAR` |

> **T3 side-tracks (forward — sketch only):** the **village web** (T1) and the **Origin track** (T2) persist as
> fully-completable optional accelerants (never gating). T3 *may* seed a **new optional castle-town side-track**
> (a merchant / official rep web — e.g. the Marutaya factor or a *tedai* contact) — **forward note only, never a
> gate**; full authoring deferred with the tier.

### 3.7.2 T4 — The HOUSE's standing expands to the national stage (roadmap; `E0 → E7`, forward)

> **Note — label namespace:** these `E#` are **Edo rung labels** (the R/V/G/C/E per-tier rung scheme),
> distinct from the estate physical **stages** `E0–E5` (Foreclosure's Edge → Restored) used in
> §3.2/§3.3/§4.7.5. **E3 "Prosperous" is now authored in v1** (§3.6/Q8); **E4–E5 stay parked.** Context
> disambiguates the two `E#` uses; a rename candidate if T4 is ever fully authored.

> **What this tier IS (sketch).** T4 is the **same spine, last frontier** (same two-phase motion) — the estate's
> **domain expands to the national stage** — **but the arc is now the HOUSE's, not the man's.** The MC **stays
> *yōnin*** (his ceiling, reached at T3); what climbs at T4 is the **HOUSE's national standing**, recognised
> **indirectly / mediated** through the Edo conduit — the *house* is ranked on the national *banzuke*, **never**
> a personal *hatamoto* / shogunal rise (the indirect Edo ceiling; canon §F / §I, D-010). The capital's figures
> (the rusui's counterparts, the *fudasashi*, a touring inspector) **acknowledge and rank** the house; the MC
> remains its **architect**, off-stage from any shogunal audience.

Required pillars: **Name + Office** (the **national *banzuke*** on all four pillars). The **indirect/mediated
ceiling** holds — the **HOUSE** is recognised; the MC's personal ceiling stays **chief steward / *yōnin***
(no *hatamoto* / shogunal audience; canon §F, §I; §2.18).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **E0–E2 — The *domain's* Edo *yashiki* conduit (worked by the house)** | The **Edo screen / map** (one cluster); the **rusui Mukai** *(invented surname — the real "Konoe" is a regent-house name, removed per Q27)* + the **daimyō's** *sankin-kōtai* mediated conduit (§1.7.1) — the house reaches the capital **through** the domain's rusui, **staffing the domain's establishment (never its own)**; the MC works the conduit, never attends a shogunal audience (the indirect ceiling). | `STORY` T3→T4 |
| **E3–E5 — The house's national trade & finance reach** | The **Osaka / Edo *fudasashi*** top of the finance network; the full silk *meibutsu* prestige payload carries the house's name to the capital (still trade ≤⅓). | `PILLAR` |
| **E6 — The touring-inspector set-piece** | The impartial-test antagonist beat *(senior shogunal inspector — surname **Hayami**, invented; the real "Toyama" removed per Q27)*; the **HOUSE's Name & Honour** climax via an inspector's national report. | `STORY` |
| **E7 — The HOUSE ranked at the capital** *(authored ending)* | **THE NATIONAL *MITATE* / PARODY *BANZUKE*** broadsheet (§2.18) — sumo-rank vocabulary: **Maegashira / Komusubi** attainable band, **Ōzeki / Yokozuna** the **structurally sealed top**; the **house** climbs from "the chart that omits you" into the attainable band (the MC stays *yōnin* — its architect, never personally ennobled); **post-game free-play, NO reset**; defend-the-spot on the biennial heartbeat (recoverable, **never a decay-tax**). | `PILLAR` Name + Office |

> **The whole ladder is the same motion, five times:** arrive minimal → the world fades in one panel/area/system
> at a time, each a logged plot beat → climb the rungs (Phase 1) → grind the house's pillars (Phase 2) → the
> canvas and the numbers enlarge together → a fresh ladder is minted for the next, larger frontier. **No reset,
> ever** (canon §B).

---

## 3.8 Cross-references & deferrals

- **Numbers → §4** (combat/progression/balance): every rung threshold, pillar threshold, conversion weight, cost
  curve, soft-stamina rate, market-saturation rate, and the **K/M/B** formatting rules are deferred. §3 fixes the
  **order and the triggers' kinds**, never the values *(proposed v1 balance)*. Specifically deferred to §4:
  - the **rung-meter accrual curve + the per-rung thresholds** (per-rung-reset; back-solved from the ≥30-min
    floor × each rung's curated-activity rate) — **§4.1.1** (FU6);
  - the **Phase-2 HYBRID tier-gate thresholds**, per-pillar-per-tier (the good/great/excellent bands + the
    great/excellent counts; T0 the 2-pillar special case; **NO overflow**) — **§4.1** (Q7/FU10);
  - the **combat-reveal-ladder weapon params + signature abilities** (per-weapon `baseSpeed`/`reach`/
    `targetCount`/`attackProfile` + signature; the +2/+3/+4 roster, ~9–10 across v1) — **§4.6.9** (Q15/FU13);
  - the **graded durability bands** (the 4-band multipliers, fixed wear-per-fight, never auto-unequip) —
    **§4.6.1c** (Q33/FU17), and the **satiety→combat throttle** coefficient — **§4.6.1b** (Q31/FU16);
  - the **character (combat) level curve** (`hpMax = 40 + 8·characterLevel`, satietyMax growth, +1 attr/2 lvl,
    on-kill XP = `MobDef.level·COMBAT_XP_K`) — **§4.4/§4.6.1/§4.6.5** (Q1/Q47/FU14/FU15).
  - **Determinism:** any §3-implied curve obeys the **`Math.pow` ban in core (integer-pow only)** so reveals fire
    byte-identically cross-engine (§6; Q36/FU).
- **Final log-line wording → §5 authenticity pass** (macron romanization). The **Standing & Office** pillar's
  kanji is RESOLVED = **官威 (*kan'i*)** (2026-06-25). §3 fixes the **substance** of each `revealLogLineId`;
  copy may be polished. *("**Combat Rank**" renames the old "Combat Standing", Q9; "Standing" now means the 官威
  pillar **only**.)*
- **Data shapes → §2 / §6:** every reveal is a `RevealableEntry` with a pure `unlockPredicate` over `GameState`,
  fired via the `process_rewards` bus as one event (§2.1, §6.3); the renderer does one `render(state)`
  reconciliation showing only unlocked entries (§6.9); every reveal is **headlessly regression-testable** via
  the DEV play API (`window.__qa`, §2.20, §6.10) — the unlock ladder is a generated/verifiable table (§6.6).
  **There is NO `revealQueue` field in `GameState`** — staggering is a design property of the authored schedule,
  not stored runtime state (FU4 supersedes Q17; §2.1/§6.4).

## 3.9 Items flagged for the human (review checklist)

> **Status (V2 reshape, 2026-06-26):** the old item 1 is now **RESOLVED by FU7's two-phase model**; items 2–5
> remain resolved as before; three fresh V2 confirm-items are added. Resolutions folded into the ladder above.

1. ~~**The trigger *mix* per tier (R7 PILLAR vs RANK).**~~ **RESOLVED by the two-phase model (FU7/Q30/Q7).** A
   **rung** gates on its **per-rung rung-meter + story** (the AND-gate) — **never** a pillar threshold; the
   **tier-up** gates on the **Phase-2 hybrid good/great/excellent pillar profile** (the separate gate the
   capstone *opens*). So R7/V7/G7 are **RANK (rung-meter + story)** to end Phase 1, and the **PILLAR** check is
   the Phase-2 tier-up — no longer a mixed RANK+PILLAR rung gate. Exact thresholds → §4 *(proposed v1 balance)*.
2. ~~**Navigation-reveal granularity (§3.5).**~~ **RESOLVED:** **one nav entry at a time** (first tab at R2) is
   the locked grain; **distinct activities are TOP-LEVEL tabs** (Skills/Combat/Crafting/Quests/…; Q10) — the
   signature progressive-reveal feel.
3. ~~**R5 bundles too much.**~~ **RESOLVED & re-confirmed under the combat-reveal ladder (FU12):** R5 reveals
   only the **Quests tab + stance slot**; the simple Crafting tab + loot→craft loop + durability bands sit at
   **R4**; the first combat-earned **Arms** standing no longer "records" mid-climb at all (**pillar deeds are
   Phase-2 only**, FU7). Each rung reveals less (one-at-a-time grain).
4. ~~**T2-G2 double-gate (Origin opens).**~~ **RESOLVED:** the **Origin SIDE-TRACK** opens on **BOTH** STORY
   (dream returned enough memory) **AND** PILLAR (travel-standing) — **disentangled** from the G2 *rung* gate
   (which is rung-meter + story) and from any four-pillar tier-gate (§3.6 G2). The warmest payoff stays doubly
   earned (§1.5.3).
5. ~~**T3/T4 late first-reveal placement.**~~ **RESOLVED (confirmed as sketched):** **auto-producers at T3-C1**,
   the **marriage/adoption lever at T3-C5**, the **national *banzuke* at T4-E7**. Full rung-copy deferred with T3/T4.
6. **NEW — the combat-reveal-ladder cadence (FU12/Q15/FU13).** Confirm the staggered combat reveals read right:
   R3 (starter weapon + bare auto-resolve + retreat + bestiary) → R4 (durability bands) → R5 (stance) → first
   weapon-line L10 (ability + item slots) → 2nd line at T1 → 3rd line at T2; roster +2/+3/+4, ~9–10 across v1.
   *(Cadence and the FOUND/CRAFTED-not-gifted rule are canon; placement of individual weapon reveals → §4.6.9.)*
7. **NEW — the Phase-2 grind length under the FLOOR budget (FU18).** Confirm the Phase-2 pillar grind (the
   deeds→hybrid-profile window) per tier reads as a **generous OSRS-rough FLOOR**, not a ceiling: pushing 1–2
   pillars to great/excellent **extends** Phase 2 beyond its minimum by design (§4.8 — *proposed v1 balance*).
8. **NEW — the three combat tracks stay legible in the UI (FU14/Q1).** Confirm the reveal copy never implies
   one kill feeds Arms or the Combat Rank meter, or that the rung-meter is fed by raw XP — the three tracks
   (character level / Arms pillar / Combat Rank rung-meter) must read as **separately-stored** wherever combat
   reveals appear (§2.8.1/§3.0.1).


---
# §4 — Combat, Progression & Balance Model

> **STATUS: PRD V2 — numbers provisional.** This section incorporates the human-signed **Block L (Q1–Q56)**
> and **Block M (FU1–FU23)** (2026-06-26), governed by **ADR D-022 (newest-block-wins; annotate-don't-delete)**.
> The **balance SHAPE the human signed** (saga length as a **FLOOR** / per-tier hour budget / per-rank ≥30-min
> floor / first-fight win-rate / soft-setback severity / deeds-dominate split / no-respec / the **hybrid
> good/great/excellent tier-gate** / the **three clean combat tracks**) is **LOCKED INTENT (ADR D-021)**; the
> §4 magnitudes (yields/levers/curves) and the §7 M2–M7 milestone detail stay **PROVISIONAL** and are re-planned
> after each playtest. This section is authored from the V2 spine in **§1.6.4** (the sequential two-phase model +
> the three combat tracks) and the system *shapes* fixed in **§2** (the three tracks, the incremental weapon
> roster, the per-skill perk channel, the satiety-throttled / durability-banded combat).
>
> **⚠️ ALL NUMBERS IN THIS SECTION ARE TAGGED `proposed v1 balance` EXCEPT the pacing/gate SHAPE the human
> signed off on** (saga length as a **FLOOR** / per-tier hour budget / per-rank ≥30-min floor / first-fight
> win-rate / soft-setback severity / deeds-dominate split / no-respec / the **hybrid good/great/excellent gate**),
> which are tagged **`LOCKED by human`**. Everything else is a *coherent first-pass*, chosen so the whole curve
> is self-consistent and the locked targets (§4.8) hold; **every proposed number is a lever, tunable later**
> without touching architecture. Per canon §H + §6.4, every value lives in `core/content/balance.ts` (the single
> home for tunables) and derived numbers reflow with **no save migration**. The duplicated/derived balance
> numbers below are **illustrative — the source of truth is the generated `balance.ts` / `docs/balance/` /
> `docs/content/` tables** (Q41); no value is hand-maintained twice.
>
> **The CANON shapes (data types, accrual *modes*, the trade ≤⅓ invariant) are NOT tunable; only the
> magnitudes are.** Two former "canon shapes" are **explicitly REVERSED by the V2 decisions (D-022 governing):**
> (1) **"no labour→combat cross-feed" is RELAXED** to a **bounded per-skill combat-perk channel**
> (`skillCombatBonus`, ~2–8 small perks per skill, no hard global cap; Q6/FU8 — §4.5.4); conditioning stays the
> **zero-stat enablement gate**. (2) **"simple per-tier thresholds, no floor/overflow" is REPLACED** by the
> **HYBRID good/great/excellent tier-gate** (good in ALL revealed pillars · great in 2–3 · excellent in 1–2; no
> overflow; Q7/FU10 — §4.1). The **trade ≤⅓ cap** and the **jumps + seasonal-judged-on-high-water-mark** accrual
> mode remain canon and unchanged.
>
> **REBALANCE NOTE — the budget is a FLOOR, not a ceiling (FU18; annotates D-016 / D-Q1).** The **≈28.5 h
> figure is the v1 PHASE-1 climb FLOOR, NOT the total** (T0 ≈ 4.5 h + T1 ≈ 8 h + T2 ≈ 16 h of rung-climbing).
> The full **v1 saga ≈ ~60 h FLOOR = the ~28.5 h Phase-1 climb floor + a ~+32 h Phase-2 pillar-grind floor**
> (T0 ~+4.5–5 h · T1 ~+12 h · T2 ~+20 h — the T2 figure now carries the new **Name gate** good-band deeds,
> D-Q3, which compounds the ~60 h floor toward ~65 h, accepted; §4.8.1b). Every one of these is a **FLOOR, not a ceiling**: the
> **per-rank ≈30-min floor** and the per-tier hour targets are **MINIMUMS** — a long, OSRS-rough grind you
> settle into and *leave auto-running, checking the progress* (FU23: tab-open auto-resolve combat + auto-repeat
> labour, active-only). The saga **can and should run LONGER** than the ~60 h floor when content interleaves
> richly and players push pillars past *good* to great/excellent (§4.1); §4.8 is a **minimum-grind model** and
> the M6 pacing regression **fails on UNDERSHOOT only** (a rung cleared *too fast*), never on overshoot. The old
> "leave T0 in ~45–75 min, v1 ~12–20 h" targets stay superseded; the figures below are the floor the curve is
> derived *backward from*.

## How to read this section

This is where the **parked balance numbers** from §§1–2 finally land. Each subsection states the **shape**
(canon, fixed), then a **proposed v1 number set** (tunable), then the **levers** to turn during tuning.
Units throughout: **koku** (rice, base currency), **coin/mon** (trade currency), **House Influence** in
abstract **Influence points (ip)** per pillar, displayed with **K/M/B** abbreviation (canon §H — not
scientific, not myriad units). One **tick** = the atomic active-play time-step; **1 action ≈ 1–4 ticks**;
**1 day ≈ 200 ticks**; **1 season ≈ 30 days ≈ 6,000 ticks**; **1 year = 4 seasons = 120 days** (abstract,
active-only — §2.2). These tick/day mappings are themselves levers.

**Wall-clock anchor (required by the locked time budget, now read as a FLOOR).** Because the saga length and
the per-rank ≥30-min floor are stated in real minutes, the balance commits a **wall-clock ⇄ game-time
binding**: at the intended active-play pace, **1 season ≈ 34 min of real play** in T0 (so T0's ~8 seasons span
its ~4.5 h *floor*), stretching to **~60 min/season in T1** and **~120 min/season in T2** (the player does more
*per* season as the world enlarges, not more seasons). This binding lets the §4.8 pacing table be read in
minutes. The binding itself is a **lever** (`SEASON_WALLCLOCK_MIN[tier]`), but the *floor* targets it serves
(≥30 min/rank; 4.5/8/16 h tiers, as **minimums**) are **LOCKED by human** as FLOORS (FU18).

---

## §4.0 The number spine — magnitudes per tier (the master scale)

Everything below hangs off one **per-tier magnitude band** so K/M/B abbreviation reads naturally and "the
next goal never balloons > ~2–3× the prior" (canon §G / §1.2 pillar 3 / pacing §4.8). The house's
**total resource & Influence magnitudes** grow ~**one order of magnitude per tier** (≈10×), but **within a
tier** every individual step is a gentle **~1.15× geometric** so no single jump feels like a wall.

> **T0 koku band reconciled (Q14 — yields are already NET).** The T0 lifetime-produced band reads **~21K** to
> match the §4.8.1 rung-by-rung sum exactly (R1…R7 = 0.75K+1.05K+1.2K+2.1K+3.2K+4.95K+8.25K = **21.5K ≈ 21K**).
> Because gathering yields are modelled **already net** of stamina/food/re-investment (Q14 — §4.7.1), the
> **end-T0 HELD koku ≈ 18–19K NET** (the earlier draft's "~3–5K held" double-counted a spend that the net-yield
> model already absorbed). The two figures the player sees — lifetime-produced ~21K, held ~18–19K NET — differ
> only by the genuine koku **sinks** (E1/E2/E3 builds, tools, craft inputs), not by a hidden upkeep tax.

**Rebalanced for the LONGER saga (FU18 — a FLOOR).** "More grind, more numbers" means the *koku* bands are
**wider** than the old draft (you produce far more over a 4.5-h-floor tier than over a 45-min one), while the
**Influence-per-pillar** bands stay close to the old gate magnitudes — Influence is the *slow, judged*
measure, deliberately lagging the raw resource counters. The widened *koku* bands below come straight out of
the §4.8 throughput model (end-T0 *lifetime-produced* koku ≈ 21K; end-T0 *held* koku ≈ 18–19K NET).

| Tier | koku band (lifetime-produced → held NET) | Influence-per-pillar band (display) | Typical single number the player sees |
|---|---|---|---|
| **T0 Estate** | tens → ~**21K** produced (~**18–19K** held NET) | 0 → ~**1.5K** ip | "**3.4K koku**", "**Arms 0.5K**" |
| **T1 Village** | ~10K → ~**250K** produced | ~0.5K → ~**15K** ip | "**42K koku**", "**Estate 11K**" |
| **T2 Region** | ~100K → low **M** | ~5K → ~**110K** ip | "**1.8M koku**", "**Office 78K**" |
| **T3 Castle-town** *(stub)* | low **M** → ~**100M** | ~50K → ~**900K** ip | "**240M koku**", "**Name 900K**" |
| **T4 Edo** *(roadmap)* | ~100M → low **B** | ~1M → ~**12M** ip | "**3.4B koku**", "**Name 11M**" |

**Lever:** the **per-tier multiplier `TIER_MAG = 10`** (the order-of-magnitude step) and the
**intra-tier growth `r_intra = 1.15`** are the two master dials. The Influence bands still step ~**10×**
for Arms/Estate; the **Standing & Office** band steps **harder** (≈10× → ≈25× at the T1→T2 boundary) by
design, because the required-pillar gate **drifts** from "survive/get strong" to "win it socially" (§4.1).
**v1 only ships T0–T2** fully (T3 stub, T4 roadmap), so only the first three bands are load-bearing for
launch tuning. Note: lengthening the saga was done by **stretching wall-clock-per-rung** (the ≥30-min floor)
and **fattening the *koku* counters**, *not* by inflating `TIER_MAG` — the chapter-break feel of ~10× is
preserved ("a slower release of incremental features," not bigger walls).

---

## §4.0.1 Progression architecture — three tracks, two phases *(the V2 master reframe — D-023/D-025)*

This is the conceptual hub the rest of §4 hangs off (the canonical statement is **§1.6.4**; the system shapes
are **§2.8.1 / §2.15.1 / §2.16**). Two structural facts drive every curve below.

**(1) THREE independent, separately-stored tracks (FU14/Q1) — never one fused bar.** Reconflating them is the
single likeliest regression (the old §2.8 "Combat Level = a Combat Deeds pool" fused all three). What **one
kill / one recognised deed / one curated rung activity** writes makes the distinction concrete:

| Track | Fed by | Writes / scales | Gate role | §4 home for its curve |
|---|---|---|---|---|
| **Character (combat) level** | kills → **combat-XP** only (labour and deeds **never** raise it; Q1) | **HP** (`hpMax = 40 + 8·characterLevel`), **satietyMax** (base + per-level growth; Q47), **+1 attribute point / 2 levels** | personal **power**; per-mob `MobDef.level` sets on-kill XP | the curve is **§4.6.5** (one definition, referenced everywhere) |
| **The Arms pillar** (武威) | recognised martial **DEEDS** (a road declared safe; a nest cleared; the grain store defended) | one of the **four House-Influence pillars** | **Phase-2** tier-gate input (the hybrid profile) | §4.1 / §4.2 |
| **The Combat Rank rung-meter** | **per-rung CURATED** combat activities (not raw kills/XP; FU14) | the **per-rung-reset martial rung-meter** | **Phase-1** martial rung-gate | §4.1.1 |

So: **one kill → character-level combat-XP (only)**; **one recognised deed → Arms**; **one curated rung
activity → the Combat Rank meter.** Each stream **sums independently** (the §6.6 verifier asserts no leakage).
*("**Combat Rank**" renames the old "Combat Standing", Q9; "**Standing**" now means the **官威 Standing &
Office** pillar **only**.)* `character.level` is the **only** one of the three that scales personal power; the
other two are *standing*/*gate* meters. **No section may re-derive its own "level" concept** — the one
combat-fed character-level curve (§4.6.5) is the sole driver of `hpMax`, `satietyMax`, and attribute points.

**(2) TWO ordered phases per tier (FU7) — Phase 1 (climb rungs) then Phase 2 (pillar grind).**

- **Phase 1 — climb the rungs (R0→R7 etc.).** Each rung promotes on **BOTH** the **per-rung-reset rung-meter**
  (§4.1.1) **AND** the rung's **story milestones** (an **AND-gate**; the UI reads "awaiting X" when one side
  lags). The meter is fed by **curated, story-consistent per-rung activities** (a designed one-to-many set,
  authored **separately from** the pillar-deed inventory). Two meters run in parallel: **Estate Service**
  (labour) and **Combat Rank** (martial). **Pillar DEEDS do NOT accrue in Phase 1.**
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind.** The tier's **pillar DEEDS accrue here and ONLY here** (gated post-final-rung; FU7),
  which structurally prevents the **"half the rungs, maxed deeds"** exploit. Clearing the tier's **hybrid
  good/great/excellent pillar profile** (§4.1) is what **tiers up.** *(There is **no stored "phase" flag** — the
  phase is **derivable from the current rung**: pre-capstone = Phase 1, post-capstone = Phase 2; §6.4.)*

**Consequence for the pacing tables (§4.8).** A tier's wall-clock = **Phase-1 rung climb + Phase-2 pillar
grind**, both ≥ their floors. The §4.8 rank-by-rank tables therefore split into a **Phase-1 rung block** (gated
on the rung-meter + story, §4.1.1) and a **Phase-2 grind block** (the deed + seasonal accrual to the hybrid
gate, §4.2). Every number ties out against the same **≥30-min-per-rung FLOOR** that §4.1.1 back-solves and that
the §6.6 gate-monotonicity verifier asserts.

---

## §4.1 The HYBRID good/great/excellent tier-gate (the Phase-2 tier-gate)

**Shape (canon §1.6.3/§1.6.4, §2.16 — fixed; supersedes the old "simple bands, no floor/overflow", Q7/FU10/
D-028).** Tier-up is **no longer** "the named required pillar(s) each clear a single stated threshold." It is a
**HYBRID specialisation profile across the pillars REVEALED by that tier**: you must be **good in ALL revealed
pillars** (a **breadth floor** — this half *reverses* the old "no global floor"), **great in 2–3**, and
**excellent in 1–2** — **with NO overflow/substitution** (that half of the old rule *survives*: a surplus in one
pillar can never stand in for a deficit in another). The semantics are **authored levels, not ratios**:
**good = the expected baseline · great = really strong · excellent = above-and-beyond** (FU10). This profile is
the **Phase-2 tier-gate** — it is **ANDed with the Phase-1 capstone rung-meter + story gate** (§4.1.1/FU11), and
it is **only ever checked against pillars REVEALED by that tier** (never "good in ALL" against an unrevealed
pillar).

**The revealed-pillar set grows per tier** (matching the §3 reveal schedule and the §2.16(e) four-bar-panel
reveal): **T0 = 2** (Arms + Estate — a **2-pillar special case**), **T1 = 3** (+ Office), **T2 = 4** (+ Name —
Name is a REAL gated pillar at T2, D-Q3).
The required pillars still **drift** as they reveal — early tiers lean **Arms + Estate** ("survive and get
strong"), upper tiers lean **Office + Name** ("win it socially"). The only structural cap that survives is
**trade ≤⅓ of Estate & Wealth** (§4.2.3) — trade can never carry a gate, and cross-pillar combos (§4.3.1) are
computed **post-clamp** and **excluded** from this gate-check.

**Proposed v1 good/great/excellent bands** *(proposed v1 balance — re-derived per-pillar-per-tier against the
FIXED §4.2.1 deed inventory; **NOT** uniform 0.2×/0.5× ratios — each band is grounded in a deed-count, so the
great/excellent multipliers vary per pillar/tier by design)*. The **good band is the reference magnitude** the
routine Phase-2 grind delivers (= roughly the old single threshold); **great/excellent are reached by
allocating MORE deeds** (per-event cap still binds, so it is *quantity*, never bigger spikes — "above and
beyond," not "one huge act"):

| Tier (revealed pillars) | Pillar | **good** (baseline — required in ALL) | **great** (required in 2–3) | **excellent** (required in 1–2) |
|---|---|---|---|---|
| **T0 → T1** *(Arms + Estate; 2-pillar special: good in BOTH + excellent in 1)* | Arms | **0.5K** | **0.72K** | **0.95K** |
| | Estate | **0.8K** | **1.1K** | **1.5K** |
| **T1 → T2** *(Arms + Estate + Office; good in ALL 3 + great in 2)* | Arms | **5K** | **7.5K** | **10K** |
| | Estate | **8K** | **11K** | **15K** |
| | Office | **2K** | **3.2K** | **4.5K** |
| **T2 → T3** *(v1 end-gate; Arms + Estate + Office + Name → **4 revealed**; good in ALL 4 + Estate & Office great/excellent, Arms & Name good)* | Arms | **30K** | **42K** | **58K** |
| | Estate | **60K** | **84K** | **112K** |
| | Office | **50K** | **78K** | **110K** |
| | Name | **28K** | **42K** | **60K** |
| **T3 → T4** *(stub; Office + Name excellent)* | Office | **600K** | **850K** | **1.2M** |
| | Name | **500K** | **720K** | **1.0M** |
| **T4** *(roadmap; Name + Office excellent)* | Name | **6M** | **8.5M** | **12M** |
| | Office | **5M** | **7M** | **10M** |

> **How the bands tie out against the fixed deed inventory (the §6.6 accrual-tie-out check).** The §4.2.1 deed
> inventory + the §4.2.2 seasonal stream are sized to deliver the **good** band in every revealed pillar — that
> is the breadth floor every player reaches, and it is what the verifier ties out (deeds = 70 % of the *good*
> band, seasonal = 30 %, §4.2.1/§4.2.2). The **great/excellent** bands are then reached by the player
> **specialising** — pouring the Phase-2 window's *additional* recognised deeds into their chosen 1–2 pillars
> (each still per-event-capped at 0.04·good-band, so it is many small acts, not spikes). Because the base
> inventory only guarantees *good in all*, pushing 1–2 pillars to great/excellent **extends Phase 2 beyond its
> floor** — exactly the **budget-as-a-FLOOR** intent (FU18). A combo (§4.3.1) is **excluded** from this check:
> it can never satisfy "good in ALL revealed pillars."

**The great/excellent SURPLUS supply — the supra-good deed inventory (D-Q3(a)).** Because the seasonal stream
tops out at 0.30·good (its `f` saturates at the good-band-top, §4.2.2), **ALL ip above the good band comes from
additional capped deeds.** Each revealed pillar therefore carries an authored *surplus* deed inventory beyond
its 70 %-good base (§4.2.1) — the supra-good supply a specialising player draws on. The counts below (surplus
ip = band − good, ÷ the pillar's representative deed base, every base still ≤ its 0.04·good cap) are the
**extra** recognised deeds to reach great / excellent in that pillar — and because each is done at the tier's
Phase-2 deed cadence (~5 min T0 · ~8 min T1 · ~13 min T2, §4.8.1b), **they ADD Phase-2 minutes on top of the
floor** (the budget-as-a-FLOOR intent, FU18):

| Tier · pillar | good→great surplus (ip / **deeds**) | good→excellent surplus (ip / **deeds**) |
|---|---|---|
| **T0 Arms** | 0.22K / **~18** | 0.45K / **~38** |
| **T0 Estate** | 0.30K / **~14** | 0.70K / **~32** |
| **T1 Arms** | 2.5K / **~25** | 5.0K / **~50** |
| **T1 Estate** | 3.0K / **~19** | 7.0K / **~44** |
| **T1 Office** | 1.2K / **~17** | 2.5K / **~36** |
| **T2 Arms** | 12K / **~12** | 28K / **~28** |
| **T2 Estate** | 24K / **~18** | 52K / **~39** |
| **T2 Office** | 28K / **~17** | 60K / **~36** |
| **T2 Name** | 14K / **~15** | 32K / **~34** |

So the gate's "great in 2–3 · excellent in 1–2" is *paid for in extra deeds*: e.g. pushing **two** T2 pillars to
great (~35 deeds × ~13 min ≈ **+7.5 h**) plus **one** to excellent stacks on T2's **~+20 h Phase-2
window** (§4.8.1b/§4.8.4 — already inflated by the new Name gate, D-Q3). The supra-good inventory is **authored beyond** the 70 %-good base, obeys the same
per-event cap, and never feeds the trade ratio or the gate-eligible accumulator (combos excluded, §4.3.1).

**Reading the drift & the special cases.** **T0** is the **2-pillar special case**: only Arms + Estate are
revealed, so the gate is **good in both + excellent in exactly one** (no phantom third pillar). **T1** reveals
Office, so the gate is **good in all three + great in two**. **T2** surfaces Name (**4 revealed**), with the
profile leaning **Estate + Office great/excellent, Arms & Name good** ("win it socially"). A pillar **not yet
revealed** for a tier is **never** checked (never "good in ALL" against it). **T2 reveals Name as the 4th
gated pillar (D-Q3):** the gate is **good in all 4 + Estate/Office great/excellent, Arms & Name good** — Name's
own **28K good band** (§4.1 table) is a live breadth-floor consumer, not a free pass. Each good-band sits at roughly the
top of the prior tier's band (§4.0); T0→T1 good is ~**10×** T0's start; T1→T2 keeps ~**6–10×** on Arms/Estate
but the **Office good-band steps ~25×** (2K → 50K) — the deliberate "win it socially" steepening, NOT a
violation of the within-tier ≤2–3× rule (that rule binds *consecutive within-tier goals*, never the
chapter-break tier step).

**Levers:** the **good/great/excellent triple per revealed pillar per tier** (the table above — only the first
three tiers ship in v1), **plus the great/excellent COUNTS** per tier (how many pillars must be great vs
excellent). Tune each band independently against playtest time-to-tier (§4.8). Keeping a gate's **good band ≈
band-top** of that tier (§4.0) is the design invariant; the absolute values are free. The **per-tier hour
budget each gate must take to fill** (T0 ≈ 4.5 h, T1 ≈ 8 h, T2 ≈ 16 h — as **FLOORS**, FU18) is **LOCKED by
human** — retune yields and band magnitudes, never the floor, if a playtest time-to-tier *undershoots*.

---

## §4.1.1 The rung-meter accrual law (the third progression curve — D-024/FU6)

**Shape (canon §1.6.4, §2.15.1 — fixed).** Phase 1's two parallel rung-meters — **Estate Service** (labour) and
**Combat Rank** (martial; *renamed from "Combat Standing"*, Q9) — are **numeric and PER-RUNG-RESET** (each rung
starts its meter at 0). A rung promotes on an **AND-gate**: `rungMeter ≥ thresholdForRung` **AND** all the
rung's `requiredStoryFlags` are set — the UI reads **"awaiting X"** when one side lags (FU6/Q30). The meter is
fed **only** by that rung's **curated, story-consistent activities** (a designed one-to-many set tagged by
`rungActivityTags`, authored **separately from** the pillar-deed inventory of §4.2.1) — **not** by raw
kills/XP (those feed the character level, §4.6.5) and **not** by pillar deeds (those are Phase-2, §4.2).

**The back-solve (the ≥30-min FLOOR is enforced on the METER POINTS — D-Q2).** Each rung's threshold is
back-solved against the **maximum** eligible-activity completion rate so that **even optimal FOCUSED play
cannot fill the rung's numeric-points objective in < 30 min** — the *meter threshold* is the runtime
enforcement of the ≥30-min floor (not a wall-clock check). **Unfocused play** (multi-skilling, side-quests,
off-objective wandering) earns the curated points more slowly and so takes **LONGER — ~60–120 min/rung**. The
§4.8.1 per-rung **wall-clock column** (35/40/45/55 min, etc.) is therefore **EXPECTED real, somewhat-unfocused
play — it sits ABOVE the 30-min focused-optimal floor and is NOT a contradiction with it.** The threshold is
in lockstep with the §4.8.1 koku column and asserted by the §6.6 gate-monotonicity verifier:

```
thresholdForRung(rung) = RUNG_FLOOR_MIN · eligibleActivityRate(rung)        // RUNG_FLOOR_MIN = 30 (min, a FLOOR)
//   eligibleActivityRate = curated activity-points the rung yields per minute at the intended pace
//   meter is measured in "rung activity-points (cap)"; per-event-capped like every other accrual
```

So the meter and the time floor are the **same constraint expressed two ways**: clear the curated activities
faster than the floor and the meter is *still* short of threshold (you cannot skip the floor); clear them at
pace and the meter and the floor land together. The activity *rate* drops slightly at higher rungs (their
curated activities are richer/slower), so the threshold falls gently (fewer activity-points fill the same ≥30-min floor as each activity is worth less per minute) while every rung stays ≥ 30 min.

**Proposed v1 T0 rung-meter thresholds** *(proposed v1 balance — back-solved from 30 min × the rung's rate)*:

| Rung | Meter | curated-activity examples (the one-to-many set) | rate (pts/min) | threshold (= 30·rate) |
|---|---|---|---|---|
| **R1 Day-labourer** | Estate Service | rake/recover rice · clear the forecourt · first paddy turns | ~0.60 | **~18** |
| **R2 Bonded hand** | Estate Service | forage runs · woodcut · haul loads · stable chores | ~0.62 | **~19** |
| **R3 Yard-hand** | Combat Rank | survive the first fight · drill reps · first pest skirmishes | ~0.55 | **~17** |
| **R4 Trusted hand** | Estate Service | indoor errands · first *shinden* labour · craft a first tool | ~0.58 | **~17** |
| **R5 Gate-guard** | Combat Rank | stand a watch · pest-control / hunt / clear sweeps | ~0.55 | **~17** |
| **R6 Foreman** | Estate Service | drive workshop/granary works · proto-industry shifts | ~0.50 | **~15** |
| **R7 Bailiff** *(capstone → opens Phase 2)* | Estate Service | field-office duties · record the first reclamation | ~0.46 | **~14** |

The thresholds are deliberately **modest numbers** (the floor is enforced by *time*, not a huge meter): a player
who races the curated activities still cannot beat the ~30-min floor, because the rate ceiling is what the floor
is computed against. **Combat Rank** and **Estate Service** advance **independently** (a rung may gate on one,
the next on the other; both reset per rung). T1/T2 rung-meter thresholds scale the same way against their
longer per-rung floors (≥ ~40 min at T1, ≥ ~75 min at T2; §4.8.2/§4.8.3).

**Levers:** `RUNG_FLOOR_MIN = 30` *(a FLOOR — LOCKED direction; the value is the minimum, not a ceiling)*; each
rung's `eligibleActivityRate` and the curated-activity set that realises it; the per-rung thresholds above. The
**per-rung-reset rule, the AND-gate with story, the curated-activities-not-kills feed, and the ≥30-min floor**
are **not levers** (canon).

---

## §4.2 The four-pillar ACCRUAL model (the PHASE-2 grind)

**Shape (canon §1.6.2, §2.16 — fixed).** Influence accrues in **exactly two shapes — never a passive
time-trickle, never a flat per-action increment — and ONLY on the PHASE-2 estate-influence track (FU7):**
pillar **DEEDS do not accrue while climbing the rungs** (gated post-final-rung; §4.0.1), which prevents the
"half the rungs, maxed deeds" state.

- **(A) Achievement JUMPS** — a concrete deed *recognized* by the relevant authority, **per-event capped**.
  **(PRIMARY growth driver — ≈70 % of each pillar's growth; LOCKED by human as "more from deeds.")**
- **(B) Periodic JUDGED RESULTS** — fired **every season** (4×/year; autumn harvest the headline), raising a
  pillar **only on a new high-water mark** (never repeatable maintenance). **(SMALLER top-up — ≈30 % of each
  pillar's growth; the appraisal seasons your deeds, it doesn't carry the tier.)** **Weather and festivals
  modulate these judged results mechanically, bounded ±10 %** (a day-keyed STATELESS derivation, Q35/FU3 —
  §4.7.1), and **bulk sales** apply a **saturation damper progressively per-unit** (Q42 — §2.4).

**The accrual split is LOCKED by human:** **deeds ≈⅔–¾ (we use 70 %)**, **seasonal ≈¼–⅓ (30 %)** of every
pillar's growth toward its **good band** (the §4.1 reference). The split is a *design target*, realised by
sizing the deed inventory (§4.2.1) and the seasonal `JUDGE_K` (§4.2.2) so the two streams add to the **good
band** in that ratio; the **exact 70/30** is a tunable *(proposed)* realisation of the locked "deeds dominate"
shape. The **great/excellent** bands above the good baseline are reached **predominantly by additional deeds**
(the specialisation surplus, §4.1) — the foreground stays the punchy deed stream throughout.

Up-only, with small scripted **per-pillar recoverable dents** (§4.2.4). The **trade ≤⅓** cap is a hard
invariant (§4.2.3). From **T2** the **broader cross-pillar combos** (§4.3.1 — multiple pillar pairs, larger
magnitude; D-Q31) join seasonal-reward rotation as the late-game anti-slump device — computed
**post-trade-clamp**, **excluded from the trade-ratio denominator**, and **excluded from the deed-only
`gateEligibleValue`** the §4.1 gate checks (combos credit display `value`, never the gate; D-Q-meibutsu).

### §4.2.1 Achievement JUMPS — concrete values + per-event caps

A jump fires when a recognized **Phase-2** deed completes (a recorded yield, a granted title, a sealed
contract, a road declared safe in the books, a won petition, a nest cleared, the grain store defended). Each
deed carries a **base jump value** and is subject to a **per-event cap** = a fraction of the *current tier's
pillar GOOD band* (the §4.1 reference magnitude), so **no single fight or harvest spikes a pillar**:

```
jump = min( deedBaseValue, PER_EVENT_CAP_FRACTION · goodBand(pillar, currentTier) )
```

*(proposed v1 balance)* — **`PER_EVENT_CAP_FRACTION = 0.04`** (one deed can move a pillar at most ~**4 %** of
the way across its good band). **This is HALF the old draft's `0.08`** (canon "deed-jump size = SMALLER /
STEADIER (grindier)": growth is the sum of *many small acts*, never a few spikes). The cap is computed against
**that pillar's own GOOD band for the current tier** (= its §4.1 reference): T0 Estate cap = 0.04·0.8K =
**32 ip**, T0 Arms = 0.04·0.5K = **20 ip**, T1 Office = 0.04·2K = **80 ip**, T2 Arms = 0.04·30K = **1.2K**, T2
Office = 0.04·50K = **2K**, etc. **Every deed base in the table below sits at or under its own pillar/tier cap**
(a handful of intentional *at-cap* anchors — the DEFEND deed, the top road/alliance deeds — are labelled
*(cap)*). So **the cap virtually never silently clamps** a deed: bases were tuned *down* to fit under the cap —
the texture is *quantity of small deeds*, not a clamp on big ones. Reaching the **great/excellent** bands above
the good baseline is therefore a matter of **doing MORE of these small capped deeds in the specialised
pillar**, never of bigger jumps.

> **T0 has NO trade strand (Q29).** The TRADE sub-engine opens at **T1** (the village shop row is the first
> market — there is no market in T0; §2.4). The old T0 "Sealed trade contract" deeds are **deleted** and their
> ip **re-itemized into LAND + TREASURY deeds** (below). Trade contracts first appear in the T1/T2 columns.

| Deed class | Pillar | T0 base | T1 base | T2 base | per-deed cap (0.04·good-band) |
|---|---|---|---|---|---|
| Minor clear (boar/monkey nest) | Arms | 8 | 70 | 700 | T0 20 · T1 200 · T2 1.2K |
| Road/ford declared safe (in the books) | Arms | 18 | 150 | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| Grain-store / valley defended (DEFEND quest) | Arms | 20 *(cap)* | 200 *(cap)* | 1.2K *(cap)* | T0 20 · T1 200 · T2 1.2K |
| First *shinden* plot recorded | Estate (LAND) | 30 | — | — | T0 32 |
| Recorded seasonal yield milestone | Estate (LAND) | 16 | 130 | 1.3K | T0 32 · T1 320 · T2 2.4K |
| Debt tranche cleared → solvency step | Estate (TREASURY) | 26 | 200 | 2K | T0 32 · T1 320 · T2 2.4K |
| Sealed trade contract *(TRADE strand — ≤⅓ capped; opens T1)* | Estate (TRADE) | **— (no T0 trade)** | 90 | 900 | T1 320 · T2 2.4K |
| Office granted / bailiff duty / dispute arbitrated | Office | — | 60 | 1.3K | T1 80 · T2 2K |
| Valley allied / rival eclipsed | Office | — | 80 *(cap)* | 2K *(cap)* | T1 80 · T2 2K |
| Lord's recognition / off foreclosure list | Name | 20 | 160 | 1.0K | T0 40 · T1 400 · **T2 1.12K** *(0.04·28K)* |
| Sponsored rite / inspector's favourable report | Name | — | 180 | 0.8K | T0 40 · T1 400 · **T2 1.12K** *(0.04·28K)* |

**Deed-count sanity — the itemizations that PROVE the 70 % share lands the GOOD band.** Each revealed pillar's
deed inventory below sums **exactly** to 70 % of that pillar's **good** band (§4.1), within ~20–35 recognised
deeds, every base ≤ its cap. (The residual 30 % comes from the seasonal stream, §4.2.2.) **These deeds accrue in
PHASE 2 only** (post-final-rung; FU7), so their **cadence is read within the Phase-2 window** (Q20: ~5 min/act
at T0 · ~8 min at T1 · ~13 min at T2), **not** spread across the whole tier.

**T0 — good-band 70 % = 560 ip Estate / 350 ip Arms (NO trade strand):**
- **Estate (560 ip, 26 deeds — LAND + TREASURY only):** **LAND** = 1 *shinden* (30) + 12 yield milestones
  (12×16 = 192) = 222; **TREASURY** = 13 solvency steps (13×26 = 338) = 338 → **222 + 338 = 560** ✔.
  *(No trade contracts at T0 — the 6 old trade deeds, 72 ip, are absorbed into the LAND/TREASURY counts above;
  Q29.)*
- **Arms (350 ip, 30 deeds):** 20 minor clears (20×8 = 160) + 5 road-clears (5×18 = 90) + 5 defends
  (5×20 = 100) = **160 + 90 + 100 = 350** ✔.
- **Cadence (within T0's Phase-2 window):** ~26 Estate + ~30 Arms recognised deeds at **~5 min/act** (Q20).

**T1 — good-band 70 % = 5,600 ip Estate / 3,500 Arms / 1,400 Office (trade strand now OPEN):**
- **Estate (5,600, 35 deeds):** 9 yield (9×130 = 1,170) + 19 solvency (19×200 = 3,800) + 7 trade
  (7×90 = 630) = **5,600** ✔ (trade = 630 ip = **11.25 %** of the Estate deed-ip — well under ≤⅓, §4.2.3).
- **Arms (3,500, 35 deeds):** 25 minor (25×70 = 1,750) + 5 road (5×150 = 750) + 5 defend (5×200 = 1,000) =
  **3,500** ✔.
- **Office (1,400, 20 deeds):** 10 granted (10×60 = 600) + 10 allied (10×80 = 800) = **1,400** ✔.

**T2 — good-band 70 % = 42,000 ip Estate / 21,000 Arms / 35,000 Office / 19,600 Name** *(Name is now a REAL T2
gate, D-Q3 — its 70 % = 0.70·28K = 19,600)***:**
- **Estate (42,000, 31 deeds):** 16 yield (16×1.3K = 20,800) + 7 solvency (7×2K = 14,000) + 8 trade
  (8×900 = 7,200) = **42,000** ✔ (trade 17.1 %).
- **Arms (21,000, 20 deeds):** 6 minor (6×700 = 4,200) + 7 road (7×1.2K = 8,400) + 7 defend (7×1.2K = 8,400) =
  **21,000** ✔.
- **Office (35,000, 21 deeds):** 10 granted (10×1.3K = 13,000) + 11 allied (11×2K = 22,000) = **35,000** ✔.
- **Name (19,600, 21 deeds — the new T2 gate consumer):** 14 recognition (14×1.0K = 14,000) + 7 sponsored rite
  (7×0.8K = 5,600) = **19,600** ✔ (every base ≤ the **0.04·28K = 1.12K** cap; the residual 30 % = 8,400 is the
  seasonal stream, §4.2.2). Name's deed inventory accrues in **Phase 2**, post-G7, like every other pillar.

Every line above sums to exactly **70 %** of its **good** band (the residual **30 %** is the seasonal stream,
§4.2.2). The **great/excellent** bands are reached by **the same small capped deeds, done more often** in the
specialised pillars (§4.1). **(Q23: there is NO fixed quest-type / deed-type budget** — the inventory above is
the *minimum* that ties out; more and more-interesting recognised deeds are welcome, especially at later tiers,
and any added deed still obeys the per-event cap and ties out to the gate.)*

**Levers:** `PER_EVENT_CAP_FRACTION` *(now 0.04 — proposed; the **direction** "smaller than 0.08" is LOCKED by
human)*; each deed's per-tier base value; the deed→tier scaling (~**9–10×** per tier within a deed class,
≈`TIER_MAG`, with the seasonal stream supplying the residual 30 %); the **great/excellent specialisation
deed-counts** above the good baseline.

### §4.2.2 Seasonal JUDGED RESULT — the per-season formula (fires every season; high-water-mark only)

**Shape (canon — fixed).** Every season the scheduler (§2.2/§6.3 per-season hook) computes a **judged score**
per pillar from *accumulated state*, and **raises the pillar only if the score exceeds its stored
`highWater`** — then sets the pillar to that new score (Δ = newScore − highWater) and records the new
high-water mark. If the score does **not** beat the high-water mark, **nothing accrues** (no maintenance
trickle). Autumn is the headline (harvest), but **all revealed pillars are appraised every season.**

> **Phase reconciliation (FU7).** The seasonal pillar **CREDIT posts only in PHASE 2** (deeds-gated; pillars do
> not accrue in Phase 1). The *basis* (the house's holdings — land reclaimed, treasury, secured danger) grows
> across the **whole tier** via labour (Phase 1 builds the holdings; the appraisal merely doesn't *credit* the
> pillar yet), so when Phase 2 opens the basis is already near band-top and the Phase-2 appraisals post the
> accumulated seasonal share quickly (a large first high-water jump, then diminishing). Seasons still **tick in
> Phase 1** for weather/festival flavour; they just don't move pillars there. The worked 8-season tie-out below
> reads as the appraisal sequence as the basis ramps to band-top.

```
// 1. Read the pillar's raw judged basis from accumulated state (domain-specific, any scale).
rawBasis = b_pillar(accumulatedState)
// 2. NORMALIZE by the tier reference magnitude so the basis is O(1) at the GOOD band-top.
fracBasis = clamp( rawBasis / TIER_REF[pillar][tier], 0, 1 )
// 3. Sub-linear (sqrt) shaping AFTER normalization, so f_pillar ∈ [0,1].
f_pillar  = sqrt( fracBasis )                                   // integer-pow / whitelisted sqrt only (§6.1)
// 4. The seasonal score; JUDGE_K is the pillar's seasonal ip budget for this tier (see back-solve below).
seasonalScore = JUDGE_K[pillar][tier] · f_pillar
if seasonalScore > influence[pillar].highWater:
    Δ = seasonalScore - influence[pillar].highWater
    influence[pillar].value    += Δ
    influence[pillar].highWater  = seasonalScore   // up-only; never decreases here
```

> **The seasonal basis is DIMENSIONALLY CONTROLLED for every pillar.** An **explicit named normalizer
> `TIER_REF[pillar][tier]`** (a reference magnitude = the pillar's **good** band in that tier, in the basis's
> own units) is applied to **all revealed pillars** *before* the `sqrt` shaping, so every `f_pillar ∈ [0,1]` and
> reaches **1.0 only at the good-band-top**. With `f` bounded in [0,1], the seasonal stream is bounded and
> back-solvable (below).

Where `b_pillar(state)` reads the house's *current standing* in that domain (a slowly-growing function of
holdings, not a per-action counter), and `TIER_REF` is its band-top reference (in the basis's own units):

| Pillar | `b_pillar(state)` — raw judged basis | `TIER_REF[tier]` (basis units; the normalizer) |
|---|---|---|
| **Arms** | `securedNodeCount · avgClearedDanger + retinueReadiness` (a "secured-danger" index) | T0 `ARMS_REF` · T1 10·ref · T2 100·ref (the secured-danger reachable at each good-band) |
| **Estate & Wealth** | `landReclaimedKoku + treasurySolvency + min(tradeIndex, ⅓·estateTotal)` (a koku-scaled index; **no trade term at T0**) | T0 `ESTATE_REF_KOKU` · T1 10× · T2 100× (the koku-index reachable at each good-band) |
| **Standing & Office** | `officesHeld·officeWeight + alliancesSealed·allianceWeight` (a standing index) | T0 — *(Office not revealed)* · T1 `OFFICE_REF` · T2 10× |
| **Name & Honour** | `armsHW + estateHW + officeHW + deedsPatronageBonus` (reflects the other three + deeds) | `TIER_REF_NAME[tier] = armsGood + estateGood + officeGood` (T1 = 15K · T2 = 140K) |

> **Name uses the SAME scheme as every other pillar.** Its normalizer is the **explicit**
> `TIER_REF_NAME = armsGood + estateGood + officeGood` (so `f_Name = sqrt((armsHW+estateHW+officeHW) /
> TIER_REF_NAME) ∈ [0,1]`), and its seasonal budget is the same back-solved `JUDGE_K[Name][tier]`. There is
> **no** magic `JUDGE_NAME_BLEND` scaler — the effective Name coefficient is `JUDGE_K[Name][tier] /
> TIER_REF_NAME[tier]`, fully explicit and intended.

**Back-solving `JUDGE_K` (so each pillar's seasonal stream = exactly 30 % of its GOOD band).** Because the basis
is monotone-rising over the tier and `f_pillar` is normalized to reach **1.0 at the good-band-top (the tier's
final season)**, the **cumulative high-water seasonal gain** telescopes to `JUDGE_K · max(f) = JUDGE_K · 1`. So
the back-solve is exact and dimensionless:

```
JUDGE_K[pillar][tier]  =  SEASONAL_SHARE · goodBand[pillar][tier]          // SEASONAL_SHARE = 0.30
```

i.e. `JUDGE_K` **is** the pillar's seasonal ip headroom this tier — one constant (`SEASONAL_SHARE = 0.30`)
applied to the §4.1 **good-band** table. (**Name & Honour is a REAL gated pillar at T2 (D-Q3)**, so — exactly
like every other pillar — its seasonal budget is **`0.30 · its own good band` = 0.30·28K = 8.4K** at T2. Its
*basis* still normalizes against `TIER_REF_NAME = armsGood + estateGood + officeGood` (T2 = 140K) because the
Name basis is the derivative roll-up of the other three; the **8.4K ip budget** comes off Name's own 28K good
band, not off `TIER_REF_NAME`. At **T1 Name is NOT yet revealed/gated**, so its T1 0.30 is taken of its
reference `TIER_REF_NAME` = 15K = 4,500 — a pre-reveal basis-credit, not a gate.)

| `JUDGE_K[pillar][tier]` = 0.30 · goodBand (Name: 0.30 · `TIER_REF_NAME`) | T0 | T1 | T2 |
|---|---|---|---|
| **Arms** | **150** | **1,500** | **9,000** |
| **Estate & Wealth** | **240** | **2,400** | **18,000** |
| **Standing & Office** | — (not revealed at T0) | **600** | **15,000** |
| **Name & Honour** | — (not revealed) | **4,500** *(pre-reveal; 0.30·TIER_REF_NAME)* | **8,400** *(GATED: 0.30·28K good band, D-Q3)* |

The **`sqrt`** shaping is deliberate: each pillar's judged score grows **sub-linearly** in raw holdings, so
doubling your land does *not* double the appraisal — the high-water mark advances in **diminishing, earned
steps**, and the **autumn headline** (Estate gets a ~12 % harvest bump to its basis on autumn seasons) is the
one most likely to set a fresh mark. **Seasonal results supply the SMALLER ~30 % of pillar growth; deed jumps
(§4.2.1) supply the punchy ~70 % foreground.**

**WORKED 8-SEASON TIE-OUT (proves each `JUDGE_K` lands the seasonal stream on exactly 30 % of its good band).**
The basis fraction `rawBasis/TIER_REF` ramps from ~4 % (first appraisal) to **100 %** (final appraisal, as the
basis reaches the good-band-top); Estate's autumn seasons (**3 & 7**, marked Au) carry a ~12 % harvest bump.
`f = sqrt(frac)`; score `= JUDGE_K·f`; Δ accrues only on a new high-water mark; the **accumulated** column is
the running cumulative seasonal ip. Each table ends at exactly **30 % of the good band** (because `f` ends at
1.0 ⇒ cumulative = `JUDGE_K`). Seasons read Sp→Su→**Au**→Wi ×2 (Au = autumn headline).

*T0 Estate — `JUDGE_K = 240`, target 30 % of good-band 0.8K = **240 ip*** ✔

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

*T0 Arms — `JUDGE_K = 150`, target 30 % of good-band 0.5K = **150 ip*** ✔ (smooth ramp, no autumn bump):
season Δs 30.0 → 33.1 → 21.0 → 16.7 → 14.3 → 12.7 → 11.6 → 10.7, **accumulated = 150.0**.

The same scheme back-solves every revealed pillar at every tier (each ends on its 30 % target by construction):

| Pillar / tier | `JUDGE_K` | per-season accumulated (s1 … s8) | end = 30 % good-band |
|---|---|---|---|
| **T1 Estate** | 2,400 | 480 · 1,010 · 1,346 · 1,707 · 1,841 · 2,045 · 2,229 · **2,400** | **2,400** ✔ |
| **T1 Arms** | 1,500 | 300 · 631 · 841 · 1,008 · 1,151 · 1,278 · 1,393 · **1,500** | **1,500** ✔ |
| **T1 Office** | 600 | 120 · 253 · 336 · 403 · 460 · 511 · 557 · **600** | **600** ✔ |
| **T2 Estate** | 18,000 | 3,600 · 7,576 · 10,091 · 12,799 · 13,809 · 15,334 · 16,720 · **18,000** | **18,000** ✔ |
| **T2 Arms** | 9,000 | 1,800 · 3,788 · 5,046 · 6,047 · 6,905 · 7,667 · 8,360 · **9,000** | **9,000** ✔ |
| **T2 Office** | 15,000 | 3,000 · 6,313 · 8,409 · 10,078 · 11,508 · 12,778 · 13,934 · **15,000** | **15,000** ✔ |
| **T2 Name** *(GATED, D-Q3; smooth ramp — derivative basis, no autumn bump)* | 8,400 | 1,680 · 3,536 · 4,712 · 5,645 · 6,443 · 7,157 · 7,804 · **8,400** | **8,400** = 30 % of 28K ✔ |

So at every tier — **now including the GATED T2 Name pillar (D-Q3)** — the seasonal stream is **exactly 30 %**
of each **good** band, the deed inventory (§4.2.1) supplies the other **70 %**, and the two add to the §4.1
good band (Name: 8,400 seasonal + 19,600 deeds = 28K) — the locked 70/30 split, verifiable line-by-line.
*(The season-1 Δ is the largest because the high-water mark starts at 0; the **autumn** marks are
the diegetic headlines even when their numeric Δ is mid-pack — though Name, whose basis is the derivative
roll-up of the other three pillars, takes **no** autumn harvest bump. This tie-out is headlessly
regression-testable via §6.10.)* The **per-season hook also runs the §4.2.4 below-high-water dent-restore branch** (Q32 — a small
seasonal restore lifting a dented value toward its untouched high-water *without* advancing high-water).

**Levers:** `SEASONAL_SHARE = 0.30` (the one dial that sets the whole seasonal stream — its 30 % value realises
the LOCKED deeds-dominate split); `JUDGE_K[pillar][tier]` (the derived seasonal-ip table above = `SEASONAL_SHARE
· goodBand`); the **`TIER_REF[pillar][tier]`** normalizers (incl. `TIER_REF_NAME = armsGood+estateGood+
officeGood`) that make each `f_pillar` O(1) at good-band-top; the **autumn-basis bump** (~12 %); the exponents
inside each `f_pillar` (default `0.5`; lower = harsher diminishing returns). The high-water-mark rule, the
every-season cadence, the **phase-2-only credit**, **and the ≈30 %-seasonal / ≈70 %-deeds split direction
(LOCKED by human)** are not free to invert; only the magnitudes that realise it are levers.

### §4.2.3 The trade ≤⅓ cap (HARD INVARIANT — not a lever)

**Shape (canon §1.6.1 — fixed, verifier-enforced §6.6).** Within Estate & Wealth's three sub-engines
(LAND / TREASURY / TRADE), the **TRADE strand's contribution is hard-clamped to ≤ ⅓ of the Estate & Wealth
pillar total**, applied at **every** accrual point (both jump and judged):

```
// WORKING FORM (non-circular — this is the implementation):
tradeAllowed = 0.5 · (land + treasury)
trade        = min( rawTrade, tradeAllowed )
estateTotal  = land + treasury + trade

// PROOF the working form yields trade ≤ ⅓ of the Estate total (the HARD INVARIANT):
//   at the cap, trade = 0.5·(land+treasury)
//   ⇒ estateTotal = (land+treasury) + 0.5·(land+treasury) = 1.5·(land+treasury)
//   ⇒ trade / estateTotal = 0.5·(land+treasury) / 1.5·(land+treasury) = 1/3   (exactly, at the cap)
//   below the cap trade is smaller, so trade/estateTotal < 1/3 always. ✔
```

A pure-trade run therefore maxes **~⅓ of one of four pillars** (≈ **8 %** of total House Influence) and can
**never carry a tier gate** (nor satisfy "good in ALL revealed pillars"). The signature *meibutsu* (**silk /
sericulture**, LOCKED) lives entirely inside this capped strand. **The ⅓ ratio is canon and NOT tunable**; the
*raw* trade yields feeding into it (§4.7) are levers.

> **Two V2 clarifications.** **(1) T0 has NO trade strand at all** — the TRADE sub-engine opens at **T1** (the
> village shop row is the first market; Q29). **(2) The §4.3.1 cross-pillar combos are computed AFTER this trade
> clamp AND are EXCLUDED from the trade-ratio denominator (D-Q-meibutsu).** The `estateTotal` in the ratio above
> is computed **without** any combo-sourced ip, so a combo can **neither** push trade past ⅓ **nor** inflate the
> denominator to admit more raw trade — the §6.6 verifier proves a combo can neither breach ⅓ in either
> direction, nor write the deed-only `gateEligibleValue` that satisfies a required pillar (a narrow, no-leakage
> exception). Trade ≤⅓ stays a HARD structural cap regardless of combos.

### §4.2.4 Recoverable DENTS (up-only with minor, scripted, per-pillar dips)

**Shape (canon §1.6.2 — fixed).** Up-only **except** rare, scripted, **per-pillar** dents (scandal→Name, called
debt→Estate, lost battle→Arms), **MINOR & quickly recoverable**, **never a wipe**, and the dent **never touches
`highWater`** (so it self-heals as play resumes the appraisal).

*(proposed v1 balance)*: a dent removes **`DENT_FRACTION = 0.10`** of the *current pillar `value`* (max one dent
active per pillar). **Dent self-heal (Q32) — the explicit below-high-water restore branch:** the per-season hook
(§4.2.2) regrows a dented `value` back toward its **untouched `highWater`** at a small seasonal restore rate
**WITHOUT advancing `highWater`** — so the dent **self-heals within ~1–2 seasons** ("never a wipe, never
over-credits"). Dents are scripted story beats only (a finite authored list per tier), **never**
procedural/random.

**Levers:** `DENT_FRACTION` (default 0.10); the seasonal restore rate (clawed back within ≤2 seasons); the
authored dent list per tier (count & which pillar). The "never a wipe / never below 0 / never touches highWater
/ recoverable in ≤2 seasons" rules are **canon.**

---

## §4.3 Pillar conversion weights (labour / combat / office / deeds → pillar gains)

**Shape (canon — fixed).** Each *protagonist domain* funnels into **one primary pillar** via the accrual
shapes above; there is **no cross-pillar leakage except** the explicit roll-ups (Name reflects the other
three; trade folds into Estate under the ⅓ cap) **and the narrow T2 cross-pillar combos (§4.3.1, computed
post-clamp, excluded from the gate-check).** Skills/levels never grant Influence **directly** — they make the
*recognized deed* more achievable (§2.7d). The "weights" below are the **multipliers applied to a deed's base
value** based on *how well it was performed* (quality/scale), then capped per §4.2.1.

> **`combatLevel` = the single combat-fed CHARACTER level (Q1/FU14).** The `combatLevel` term below is the
> **one** combat-fed character level (§4.6.5) — not a separate concept, never raised by labour or deeds.
> **The bounded labour→combat per-skill perk (FU8) is a SEPARATE additive channel (`skillCombatBonus`,
> §4.5.4), NOT a §4.3 conversion weight** — §4.3 still routes deeds→pillars with **no skill/level→Influence-
> direct edge**.

| Domain → pillar | Conversion weight (multiplier on deed base) *(proposed)* | Notes |
|---|---|---|
| **Combat** → **Arms** | `1.0 + 0.05·(characterLevel) + 0.10·(dangerRingClearedAbove)` | scale of the threat clears more Arms; **per-event cap (0.04) still binds** |
| **Labour (LAND/TREASURY)** → **Estate** | `1.0 + 0.04·(skillLevel of the labour skill)` | better farmer → bigger recorded yield jump (still capped at 0.04·good-band) |
| **Trade** → **Estate(trade strand)** | `1.0 + 0.04·(tradeSkill)`, then **⅓-clamped** (§4.2.3) *(trade opens T1; no T0 term)* | silk *meibutsu* graded quality raises the raw, both caps still bind |
| **Office/admin** → **Standing & Office** | `1.0 + 0.06·(officeRank) + 0.15·(allianceSealed?1:0)` | alliances (incl. marriage/adoption lever, T3+) weigh heaviest |
| **Recognition/deeds/patronage** → **Name** | `1.0 + 0.25·((armsHW+estateHW+officeHW) / TIER_REF_NAME)` *(normalized by the same explicit `TIER_REF_NAME` as §4.2.2)* | Name is *derivative* — it lags the other three by design |

**The marriage/adoption lever (T3+, parked):** a one-time **alliance** deed with an unusually large base
(roughly **a full per-event cap** into *both* Office and Name simultaneously) — canon's "real late-game lever."
Numbers detailed when T3 is authored.

**Interaction with the locked deeds-dominate split.** These multipliers grow a deed's *base* with how well
it was performed, but **every result is still clamped by the §4.2.1 per-event cap of 0.04**. So even a
high-skill master cannot turn one deed into a spike — the cap keeps growth in the *many-small-acts* regime
the human locked. The conversion weights therefore tune **which deeds feel rewarding to specialise in** (and
which pillars are easiest to push to great/excellent, §4.1), not the overall deeds-vs-seasonal balance (that's
fixed by §4.2.1/§4.2.2 sizing).

**Levers:** the per-domain coefficients (the `0.04`–`0.25` multipliers). The **structural routing** (which
domain → which pillar, no cross-feed except the named roll-ups + the §4.3.1 combos, Name-as-derivative) and the
**deeds-dominate split** are **not levers**; the coefficients that realise them are.

### §4.3.1 Cross-pillar combos — the T2 anti-slump exception (D-031 / Q22 / FU20)

**Shape (canon §1.6.1, §2.16 — fixed; BROADER than the lean proposal).** From **T2**, recognised deeds that
**genuinely satisfy two domains at once** (a secured road that is also a chartered office; a famed product that
is also a treasury win) emit a small **cross-pillar combo** bonus into **both** pillars of the pair — the **T2
anti-slump device**, paired with seasonal-reward **rotation** (§2.16). V2 makes this **broader than the old
single Name-only rebate**: **multiple pillar pairs** and a **larger magnitude** (Q22/FU20). It is a **narrow,
no-leakage exception** to the §4.3 "one domain → one pillar" routing, fenced by four hard rules:

1. **Computed AFTER the trade-≤⅓ clamp (§4.2.3), and EXCLUDED from the trade-ratio denominator (D-Q-meibutsu).**
   A combo's Estate component is added to the **already-clamped** Estate total **for display only**; the
   `estateTotal` used to compute the trade ratio (§4.2.3 denominator) is taken **without** any combo-sourced ip,
   so a combo can **neither** push the trade strand past ⅓ **nor** inflate the denominator to let *more* raw
   trade in — it cannot bend the cap in **either** direction (verifier-proven, §6.6).
2. **Counted INSIDE the deeds budget + the 0.04 per-event cap.** A combo is not free extra ip — each side is a
   capped deed-jump (≤ 0.04·good-band of its pillar), so the 70/30 split and the band tie-outs (§4.2.1) hold.
3. **EXCLUDED from the §4.1 gate-threshold check — combos never write the `gateEligibleValue` accumulator
   (D-Q5/D-Q-meibutsu).** Each pillar carries a **deed-only additive `gateEligibleValue`** accumulator that
   **combos do NOT write**; the §4.1 gate ("good in ALL revealed pillars · great in 2–3 · excellent in 1–2") is
   evaluated against `gateEligibleValue`, so **combo-sourced ip is not counted** — a combo can **NEVER**
   substitute for being good/great/excellent in a pillar on its own merits. It raises the pillar's displayed
   `value` and smooths the *grind feel*, never the gate.
4. **Bounded as a rebate within the envelope.** A combo's two sides sum to **≤ one per-event cap total**
   (split across the pair), so the broadened magnitude stays inside the 70/30 + 0.04 envelope.

**Proposed v1 combo pairs (T2)** *(proposed v1 balance)*: **Arms × Office** (a road secured *and* a route
chartered) · **Estate × Office** (a chartered trade office) · **Estate × Name** (a celebrated *meibutsu*) ·
**Arms × Name** (a famed clearing that burnishes the house). Each combo deed splits **≈0.02·good-band into each
pillar** (≈ half a per-event cap each, ≤ one cap total). The **§6.6 verifier proves** a combo can never breach
the ⅓ trade cap nor satisfy a required-pillar gate.

**Levers:** which pillar pairs combo, the per-pair magnitude (within the ≤-one-cap envelope), the T2-onset
gating. The **post-clamp computation, the gate-check exclusion, and the ≤⅓-unbreachable proof** are **not
levers** (canon).

---

## §4.4 The rich ATTRIBUTE system (STR / AGI / INT / SPD / LUCK)

**Shape (canon §G, §2.7 — fixed).** Five interacting attributes, **stored as base values** (recompute
effective on load = base + gear + milestones, §6.4). Attributes start **near-mediocre** and rise only via the
combat-fed **character level** / milestones / gear (mediocre-start). Each attribute has **labour effects and
combat effects** so it is never a dump stat.

> **The cross-feed wall — what STAYS and what RELAXES (Q6/FU8).** The **no-labour→combat-VIA-ATTRIBUTES wall
> STAYS**: attributes remain **combat-fed only** — **labour skills never grant STR/AGI** (or any attribute that
> feeds a combat-derived stat). What *relaxes* is a **separate, bounded channel**: per-skill perks may add a
> small **`skillCombatBonus`** addend (NOT an attribute, NOT character level — §4.5.4). So the *attribute* math
> below is still gift-free of labour; the small labour→combat polish lives entirely in `skillCombatBonus`.
> **The combat-fed character level (§4.6.5)** grants **+1 attribute point / 2 levels** + HP + satietyMax.

| Attr | Combat effect *(proposed)* | Labour effect *(proposed)* |
|---|---|---|
| **STR** (力) | `attackPower += 1.2·STR` (melee); `defense += 0.5·STR`; `hpMax += 2·STR` (§4.6.1); raises carry/durability damage | labour yield `+0.8%·STR`; hauling capacity `+2·STR`; lower stamina cost on heavy work |
| **AGI** (敏) | `evasion += 0.6·AGI`; `critChance += 0.2%·AGI`; hit-accuracy `+0.4·AGI` | gathering speed `+0.6%·AGI` (forage/fish); craft success `+0.3%·AGI` |
| **INT** (智) | `+0.5%` damage vs known bestiary entries; better stance/ability effects | craft quality `+0.7%·INT`; recipe unlock thresholds eased; office/admin deed weight `+0.5%·INT` |
| **SPD** (速) | `attackSpeed += 0.5%·SPD` (faster swings — see cadence §4.6.2); turn-order/first-strike | action tick-cost `−0.3%·SPD` (faster labour cycles, floored) |
| **LUCK** (運) | `critChance += 0.1%·LUCK`; `blockChance += 0.1%·LUCK`; rare-loot weight `+0.5%·LUCK` | better gather/forage rare-drop odds; market price-swing favourability |

**Starting attributes (mediocre-start contract):** all five start at **5** (out of an early soft-cap of ~30
by end-T0, ~80 by end-T2). The MC's only edge is *temperament* (narrative), **never a stat** (canon §A,
§1.4). **Attribute points:** **+1 point every 2 character levels** (§4.6.5), plus milestone grants.

> **NO RESPEC IN v1 (LOCKED by human, canon §I-bal).** Attribute-point allocations are **committed** — there is
> **no reset / re-spend lever in v1**. Every point spent on STR/AGI/INT/SPD/LUCK is permanent; the build you
> grow is the build you keep. (A late-game respec may be reconsidered post-v1, but it is explicitly **out** of
> the v1 balance lock and must NOT be implemented as a v1 dial.) This makes the dual labour+combat purpose of
> each attribute load-bearing: because you can't undo a choice, no attribute may be a dump stat — which the
> §4.4 table already guarantees.

**Levers:** every coefficient in the table; starting value (5); points-per-level cadence; the soft-caps per
tier. The **five-attribute identity, the dual labour+combat purpose of each, the no-attribute-cross-feed rule
(distinct from the bounded `skillCombatBonus` channel), and the no-respec-in-v1 rule** are **not levers** (the
last is LOCKED by human).

---

## §4.5 Per-skill XP curves, per-event caps & milestone perks

**Shape (canon §G, §2.7 — fixed).** Per-skill `total_xp` pools (stored), **levels derived** from a curve;
skills are **hidden until a small visibility threshold** (discover-by-doing); **per-event XP caps force
breadth** (no single action spikes a skill); **milestone perks** at thresholds; **plus a per-skill PERK track**
(§4.5.4). Lean core skills at T0; more unlock per tier — **this incremental per-rung/per-tier skill unlock is
itself the real bound** on the labour→combat cross-feed (you cannot front-load perks).

### §4.5.1 The XP→level curve

A standard incremental geometric curve, shared by all skills (one curve, per-skill *speed* differs):

```
xpForLevel(L)      = round( XP_BASE · XP_GROWTH^(L-1) )        // integer-pow by repeated multiply (no Math.pow; §6.1)
totalXpForLevel(L) = sum_{i=1..L} xpForLevel(i)
```

*(proposed v1 balance)*: `XP_BASE = 50`, `XP_GROWTH = 1.18`. So L1→L2 costs 50 xp, L10 cumulatively ~**1.2K**,
L25 ~**17K**, L50 ~**1.1M** xp. **Visibility threshold** = a skill surfaces in the UI at **cumulative 30 xp**
(~one good session) so it reads as a discovery, not a pre-listed menu. **Soft level cap per tier**: T0 ≈
**L15**, T1 ≈ **L30**, T2 ≈ **L50** (you *can* exceed, but XP cost makes the next tier's content the efficient
path — this is what stops a player grinding T0 to god-tier).

### §4.5.2 Per-event XP caps (breadth-forcing)

```
xpGain = min( actionXp, PER_EVENT_XP_CAP_FRACTION · xpForLevel(currentLevel+1) )
```

*(proposed)* `PER_EVENT_XP_CAP_FRACTION = 0.25` — **one action can advance a skill at most ¼ of the way to its
next level**, so leveling always takes **≥4 actions** and a lucky big harvest/kill can't one-shot a level.
This is the same per-event-cap discipline canon mandates for combat *and* Influence.

### §4.5.3 Milestone perks (the build web)

Milestones at **levels 5 / 10 / 25 / 50** per skill (lever). Perk magnitudes *(proposed)*:

| Milestone | Typical perk | Example |
|---|---|---|
| **L5** | small flat stat or `+5%` skill efficiency | Farming L5: `+5%` koku/harvest |
| **L10** | a title (feeds Name flavour) + a recipe unlock **or** a small combat perk *(see the perk model below)* | Smithing L10 (labour): unlocks component-craft tier + a small `skillCombatBonus`; Swordsmanship L10 (combat): `+1 STR` |
| **L25** | a `×1.10` multiplier or a cross-skill XP bonus (`+5%` to a *sibling* skill) | Foraging L25: `+5%` XP to Cooking |
| **L50** | a `×1.25` capstone multiplier + a marquee unlock | Combat-weapon L50: stance slot / signature ability |

**No milestone ever reads a returning-memory or porter's-knot flag** (no-hidden-edge guard, §1.4/§2.7c —
canon, encoded at the type level). Cross-**skill** XP bonuses go skill→sibling-skill **only**.

> **The cross-feed callout — FLIPPED to the bounded per-skill-perk model (Q6/FU8 — supersedes the old `==0`
> type-wall).** The old draft enforced "a LABOUR skill can **NEVER** grant a combat-feed attribute (STR/AGI),
> labour→combat == 0." V2 **relaxes** this: **every skill (labour AND combat) carries a perk track** of
> **~2–8 perks** (or small flat bonuses) **unlocked by levelling that skill** (§4.5.4). A **labour-skill perk MAY
> include a small `skillCombatBonus`** — a **separate additive term, NOT an attribute and NOT character level**.
> The hard line that **stays**: a labour-skill milestone **still may not grant STR/AGI** (or any combat-feed
> *attribute*) — the bounded polish lives only in the `skillCombatBonus` channel, never in the attribute math.
> Only **combat-skill** milestones (weapon lines, conditioning's combat facet) may grant STR/AGI. So a milled-out
> labourer is **a little** more combat-capable (capable→a-bit-more-capable), but **big combat power stays
> combat-only**, and the §6.6 verifier flips from asserting the cross-feed `== 0` to asserting **each perk
> magnitude is small/bounded** (no single global ≤CAP — per-perk smallness; §4.5.4 / Q28). **Conditioning stays
> the ZERO-stat enablement gate** and the perk channel must never bypass it.

> **NO RESPEC IN v1 (LOCKED by human, canon §I-bal).** Where a milestone offers a *choice* (a branch perk, a
> stance slot, a "pick one of two"), that choice is **committed** — there is **no reset / re-pick lever in v1**.
> Skills still level freely by doing; a milestone *selection* once taken is permanent. Mirrors the attribute
> no-respec rule (§4.4). A post-v1 respec is explicitly **out** of the v1 balance lock.

### §4.5.4 Per-skill perk tracks — the bounded labour→combat channel (NEW — D-027 / FU8)

**Shape (canon §2.7.1 — V2-fixed).** **Every skill** (labour skills included) carries a **perk / flat-bonus
track** — **~2–8 perks** per skill — **unlocked by levelling that skill.** Each perk may add a **small combat
bonus** through a **dedicated `skillCombatBonus` channel**, kept **off** the attribute/level math (it is summed
independently and applied to `attackPower` in the combat sim, §4.6.1). This is the **gift-vs-work** line, not
labour-vs-combat: nothing is *given* by birth/memory; reps *earn* small bonuses.

**Boundedness without a hard global cap.** Perks are **stackable with NO hard global cap** (FU8 supersedes Q6's
"small CAPPED"). They stay bounded by **three soft levers** instead:

1. **Small per-perk magnitude** — individually tiny *(proposed: each combat-relevant perk adds ~`+0.5` to `+2`
   flat `attackPower`-equivalent, or a ~`+0.5%` to `+1.5%` modifier — see the table)*.
2. **Incremental skill unlock** — perks reveal **per rung/tier**, never front-loadable (the real bound;
   §2.7.1(b)/§4.5).
3. **Holistic enemy/drop scaling** — encounter difficulty is tuned against the *expected total* perk stack
   (gear/level/attrs/enemy-scaling grow together); the modest power-creep risk is **accepted** (Q6/FU8).

**Proposed v1 perk magnitudes** *(proposed v1 balance)*:

| Skill kind | Example perks (unlocked by levelling) | `skillCombatBonus` magnitude (each) |
|---|---|---|
| **Labour** (Farming, Foraging, Woodcut, Fishing) | "calloused grip" `+attackPower`; "long wind" `+stamina-in-fight` | `+0.5 … +1.5` flat `attackPower`-equiv (2–4 perks/skill) |
| **Crafting** (Smithing, Cooking) | "smith's eye" `+0.5%` crit; "field rations" `+satiety floor in combat` | `+0.5%` crit / small satiety-floor lift (2–4 perks) |
| **Combat / Weapon lines** | weapon-line milestones (the *primary* combat power) | the large combat power — **combat-only**, NOT this channel |
| **Conditioning** | **NONE — the ZERO-stat enablement gate (the one exception)** | **0** (it grants no combat stat; §4.6.1) |

**(The conditioning exception.)** **Conditioning** alone stays the **ZERO-stat one-way enablement gate** (the
weak→capable gate that *unlocks* the combat track) — it grants **no** combat stat or training-rate bonus, and
the `skillCombatBonus` channel must **never** become a back-door past it: conditioning (enablement) and
`skillCombatBonus` (small polish) are **orthogonal**.

**Verifier (Q28).** The §6.6 content verifier **flips** from asserting the labour→combat edge `== 0` to
asserting **each `PerkDef.combatBonus` is small/bounded** (`0 < magnitude ≤ PER_PERK_MAX`, a small per-perk
ceiling — *not* a single global aggregate cap) and that **conditioning's perks are exactly 0** (§2.20).

**Levers:** the per-perk magnitudes; the per-skill perk counts (~2–8); the unlock-level cadence;
`PER_PERK_MAX`. The **conditioning-stays-zero rule, the separate-channel rule, and the no-attribute/no-level
routing** are **not levers** (canon).

---

## §4.6 The COMBAT math (idle auto-resolve)

**Shape (canon §E, §2.8 — fixed).** Idle auto-resolve + active setup: prepare gear/stance/area → a
**deterministic seeded fight** resolves on a fixed-step sub-tick sim (one RNG, §6.7) → intervene with
stance/ability/item/retreat. **INCREMENTAL** (T0 starts with **exactly one** weapon; a growing roster on the
combat-reveal ladder, §4.6.9). **Mediocre-start preserved** (start near-zero; humbling near-fatal first fight;
earned via grind; conditioning the zero-stat gate). **Failure = soft setback** (HP/time, maybe drop carried
loot, take a rest-off injury) — **never** lose levels/gear/permanent progress.

### §4.6.1 Combatant model & derived stats

The MC's effective combatant is derived from **attributes + the combat-fed character level + the equipped
weapon's archetype + the `skillCombatBonus` aggregate (§4.5.4) + gear**, then scaled by the **durability band**
(§4.6.1c) and the **satiety `satietyRate`** multiplier (§4.6.1b):

```
skillCombatBonus = Σ( unlocked per-skill perk combat addends )         // §4.5.4 — bounded, no global cap, conditioning = 0
attackPower  = ( weaponBase + 1.2·STR + gearAtk + 0.3·weaponSkillLevel + skillCombatBonus ) · satietyRate · durabilityBand(weapon)
attackSpeed  = weapon.baseSpeed · (1 + 0.005·SPD) · stance.speedMod · satietyRateSpeed   // PER-WEAPON baseSpeed (§4.6.9); lighter satiety touch
evasion      = 0.6·AGI + gearEva + stance.evasionMod                   // an evasion *rating*, not a flat %
accuracy     = 10 + 0.4·AGI + 0.3·weaponSkillLevel                     // an accuracy rating
defense      = ( gearDef + 0.5·STR + stance.defMod ) · durabilityBand(armour)   // armour band applies identically
critChance   = 0.02 + 0.002·AGI + 0.001·LUCK   (cap 0.50)
blockChance  = gearBlock + 0.001·LUCK          (cap 0.40, requires a shield/guard)
hpMax        = 40 + 8·characterLevel + 2·STR + gearHp                  // characterLevel = the COMBAT-FED level (§4.6.5)
satietyMax   = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel         // Q47 — base + per-level growth off the combat-fed level
```

*(proposed v1 balance)*: `SATIETY_BASE = 100`, `SATIETY_PER_LEVEL = 4`. Every `characterLevel` above is the
**single combat-fed character level** (§4.6.5 — the one curve; never raised by labour or deeds, Q1/FU14).
`skillCombatBonus` is the **bounded** per-skill-perk channel (§4.5.4); `satietyRate` / `durabilityBand` are
**combat-only** scalers (below). **Conditioning contributes ZERO** to any term here (the enablement gate only
*unlocks* the track).

### §4.6.1b Satiety → combat throttle (NEW — D-035 / Q31 / FU16)

**Shape (canon §2.3/§2.8 — V2-fixed).** Combat is **satiety-throttled** ("eat before you fight"). A
**`satietyRate` multiplier** scales `attackPower` (a lighter `satietyRateSpeed` on `attackSpeed`) — a **SEPARATE
combat coefficient** from the labour `STAMINA_RATE_FLOOR` (§4.7.1), so the two tune independently:

```
satietyFrac = satiety / satietyMax
satietyRate = ( satietyFrac ≥ 0.7 ) ? 1.0
            : lerp( SATIETY_COMBAT_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7, knee down to the floor
SATIETY_COMBAT_FLOOR = 0.5     // *(proposed v1 balance)* — a rate multiplier, never to zero
satietyRateSpeed = 0.5·(1 - satietyRate) + satietyRate                  // lighter touch on attackSpeed
```

**"Adequate satiety" = `satietyFrac ≥ ~0.7`** (`satietyRate = 1.0`). The **locked 20–35 % first-fight win-rate
is measured AT adequate satiety** (§4.6.6) — an underfed protagonist fares worse still. The throttle is
**bounded** so the floor only costs a few win-rate points (**never pushes win-rate below ~15 %** — *proposed v1
balance*). **Levers:** `SATIETY_COMBAT_FLOOR` (0.5), the 0.7 knee, the speed-touch weight. The **separate-
coefficient rule, the "win-rate measured at ≥0.7" reference, and the ≥~15 % floor** are **not levers** (canon).

### §4.6.1c Graded durability bands (NEW — D-034 / Q33 / FU17)

**Shape (canon §2.8(b)/§2.10 — V2-fixed).** Weapon `attackPower` is scaled by **4 graded durability bands**, and
**armour `defense` by the same bands**, with **FIXED wear per FIGHT** (cheap, replay-stable — not per swing):

| Band | durability fraction of `durabilityMax` | multiplier |
|---|---|---|
| Fresh | **≥ 75 %** | **1.0** |
| Worn | **≥ 50 %** | **0.9** |
| Battered | **≥ 1 %** | **0.75** |
| Broken | **= 0** | **0.55** |

*(proposed v1 balance)* `WEAR_PER_FIGHT ≈ 3 %` of `durabilityMax` per resolved fight. A weapon is **NEVER
auto-unequipped**: it stays equipped and functional even at 0 (the **0.55 floor**) — the MC is **never
weaponless** (auto-battler safety). **Repair / re-craft restores durability to max** (§2.10/§2.11). **Levers:**
the 4 band thresholds & multipliers; `WEAR_PER_FIGHT`. The **never-auto-unequip / never-weaponless rule, the
fixed-per-fight wear, and the band count** are **not levers** (canon).

### §4.6.1d Enemy (MobDef) derived stats — the `level → {attackPower, defense, HP}` rule (NEW — Block N.1 #1)

**Shape (canon §2.9 — V2-fixed; required by the analytic win-rate, D-Q-winrate).** §4.6.1 derives the MC's
combatant fully; **the enemy uses the SAME curve family**, derived from a single hand-tunable per-mob field
**`MobDef.level`** (FU15 — §2.9). One linear-in-level rule per stat (mirroring the MC's `40 + 8·level` HP / STR-
scaled attack & defence shapes), so a fight is **two derived stat blocks** and the win-probability is computable
in **closed form** (no sampling):

```
// MobDef.level = L  (hand-tunable; DEFAULTS to the mob's dangerRing expected character-level — §2.9/FU15)
mob.HP          = MOB_HP_BASE  + MOB_HP_K ·L          // same family as hpMax = 40 + 8·characterLevel
mob.attackPower = MOB_ATK_BASE + MOB_ATK_K·L          // same family as the MC weaponBase + 1.2·STR block
mob.defense     = MOB_DEF_BASE + MOB_DEF_K·L          // same family as gearDef + 0.5·STR
mob.accuracy    = MOB_ACC_BASE + MOB_ACC_K·L
mob.evasion     = MOB_EVA_BASE + MOB_EVA_K·L
mob.attackSpeed = mob.baseSpeed · (1 + 0.005·MOB_SPD) // mob.baseSpeed = its archetype cadence (default 1.0)
mob.critChance  = MOB_CRIT      (default 0.02)        // mob.blockChance = MOB_BLOCK (default 0 — most beasts)
```

*(proposed v1 balance)*: `MOB_HP_BASE = 24`, `MOB_HP_K = 8` (the MC's HP slope); `MOB_ATK_BASE = 8`,
`MOB_ATK_K = 3`; `MOB_DEF_BASE = 1`, `MOB_DEF_K = 1`; `MOB_ACC_BASE = 10`, `MOB_ACC_K = 2`; `MOB_EVA_BASE = 2`,
`MOB_EVA_K = 2`; `MOB_SPD = 0`, `MOB_CRIT = 0.05`, `MOB_BLOCK = 0`. **Defaults are set so the R3 first wolf
(`MobDef.level ≈ 2`, the R3 dangerRing's expected character-level; wolf `baseSpeed 1.3`) lands the LOCKED
20–35 % first-fight win-rate** (§4.6.6/§4.6.7) under the closed-form win-prob (§4.6.4b):

> **Worked R3 check (closed-form, no sampling).** Fresh MC (level 1, attrs 5, yari `weaponBase 3`, weaponSkill 0):
> `attackPower 9 · defense 2.5 · HP 58 · accuracy 12 · evasion 3 · attackSpeed 1.025 · crit 0.035`. R3 wolf
> (`level 2`): HP 40 · attackPower 14 · defense 3 · accuracy 14 · evasion 6 · attackSpeed 1.3 · crit 0.05. Then
> `DPS(MC→wolf) ≈ 4.17 → TTK ≈ 9.6`; `DPS(wolf→MC) ≈ 12.6 → TTK ≈ 4.6`; **`P_win(MC) = 4.6/(9.6+4.6) ≈ 0.32`**
> ✔ (in the 20–35 % band). After ~a season's training (attrs 10, weaponSkill 5, a forged blade + light armour,
> ~level 4) the same wolf gives **`P_win ≈ 0.86`** ✔ (the ~85 %+ comfortable band, §4.6.7).

Any `MobDef.level` may be hand-overridden per mob (a tougher named foe, a chip-damage swarm). **Levers:** every
`MOB_*` coefficient and per-mob `level`/`baseSpeed` override. The **same-curve-family rule** (so the analytic
win-rate is closed-form) is **not a lever** (canon).

### §4.6.2 Attack-speed cadence (PER-WEAPON baseSpeed)

Combat runs on an internal **sub-tick accumulator** (§2.8c). **`baseSpeed` is now PER-WEAPON** (the old single
`baseSpeed = 1.0` is **superseded** — each weapon's `baseSpeed` is its archetype identity, §4.6.9). A weapon's
`baseSpeed` swing fires per **20 combat sub-ticks at SPD 0**, scaled by `weapon.baseSpeed`; the `(1 +
0.005·SPD)` factor is 1.0 at SPD 0, ≈1.025 at the starting SPD 5; each point of SPD shaves cadence per the
`+0.5%·SPD` of §4.4. A typical T0 fight is **~6–12 swings** (a handful of real ticks). **Lever:** each weapon's
`baseSpeed` and the `0.005·SPD` coefficient set how twitchy-vs-grindy fights feel (canon: low-APM, strategic —
keep fights short).

### §4.6.3 Hit vs evasion, damage minus defence (with a floor)

```
hitChance = clamp( accuracy / (accuracy + evasion), 0.15, 0.95 )      // logistic; never auto-miss/auto-hit
rawDamage = attackPower · rngVariance(0.85 … 1.15)                    // seeded ±15% (combat RNG cursor, §6.7)
mitigated = rawDamage − defense                                      // PRE-floor; crit & block apply next (§4.6.4)
DAMAGE_FLOOR = max( 1, 0.10·attackPower )                            // chip damage always lands → fights end
```

The **damage floor** (`max(1, 10% of attackPower)`) guarantees even a heavily-armoured foe takes chip damage,
so a fight always resolves (no infinite stalemate) — the canon "damage minus defence (with a floor)". **The
floor is NOT applied here** — it is clamped on the **FINAL post-crit/post-block damage** in §4.6.4 (the ordering
fix below), so a block can never push final damage under the floor *or* a pre-floored value get re-inflated by a
crit. Note `attackPower` already carries the **durability-band × satietyRate** scaling (§4.6.1).

### §4.6.4 Crit / block — and the FINAL damage-floor clamp (ordering fix)

```
on hit:  dmg = mitigated                                             // from §4.6.3 (rawDamage − defense, NOT yet floored)
         if rngChance(critChance)            → dmg ·= CRIT_MULT       (CRIT_MULT = 1.5)
         if defender rngChance(blockChance)  → dmg ·= (1 − BLOCK_REDUCTION)   (BLOCK_REDUCTION = 0.5)
         damage = max( DAMAGE_FLOOR, dmg )                            // CLAMP THE FINAL POST-MITIGATION DAMAGE (D-Q fix)
```
Crit and block are **separate seeded rolls** (§2.8c). **The damage floor is applied ONCE, LAST** — after both
crit and block have multiplied `mitigated` — so the chip-damage guarantee always holds on the value the
defender actually loses (the old draft floored *before* crit/block, letting a block drop the final hit below the
floor and a crit re-inflate a floored value — both fixed). **Levers:** `CRIT_MULT` (1.5), `BLOCK_REDUCTION`
(0.5), the chance caps (0.50 / 0.40). The **floor-applied-last ordering** is **not a lever** (canon).

### §4.6.4b Expected win-probability — the ANALYTIC closed form (NEW — D-Q-winrate)

**Shape (V2-fixed).** The §4.6.7 win-rate bands are **ANALYTIC — computed in closed form from the formulae
above, NOT by Monte-Carlo sampling** (no seed-set / N needed; deterministic by construction). With both
combatants reduced to derived stat blocks (§4.6.1 MC, §4.6.1d mob), expected damage-per-swing, time-to-kill,
and the win-probability are all closed-form:

```
// expected damage X→Y per landed swing (E[rngVariance] = 1.0; crit & block in expectation; floored LAST per §4.6.4):
E_dmg(X→Y)  = max( DAMAGE_FLOOR_X,
                   (attackPower_X − defense_Y) · (1 + critChance_X·(CRIT_MULT − 1)) · (1 − blockChance_Y·BLOCK_REDUCTION) )
hitChance(X→Y) = clamp( accuracy_X / (accuracy_X + evasion_Y), 0.15, 0.95 )
DPS(X→Y)    = attackSpeed_X · hitChance(X→Y) · E_dmg(X→Y)            // expected damage per combat tick
TTK(X→Y)    = HP_Y / DPS(X→Y)                                       // expected ticks for X to kill Y

// closed-form win-probability for the MC (the "who reaches 0 HP first" race, normalised to [0,1]):
P_win(MC)   = TTK(mob→MC) / ( TTK(MC→mob) + TTK(mob→MC) )
```

`P_win(MC)` is **1.0** when the mob can never kill the MC, **0.5** at equal time-to-kill, and falls toward 0 as
the mob out-races the MC — a single monotone expression in the §4.6.1/§4.6.1d stats. The §4.6.7 bands are this
`P_win(MC)` evaluated at each combat-entry rung's intended MC stats vs the rung mob's `MobDef.level`; the M3/M6
harness **computes** them (it does not sample), and the §6.10 regression asserts the closed-form values land in
their bands. **Levers:** none here — `P_win` is fully determined by the §4.6 stat formulae; tuning happens on
those inputs (`MOB_*`, gear, `MobDef.level`). The **closed-form / non-sampled rule** is **canon**.

### §4.6.5 On-kill rewards & the ONE combat-fed character-level curve (THREE-track separation)

**The single combat-fed character-level curve (defined ONCE here; referenced by §4.0.1/§4.4/§4.6.1).** A kill
writes **combat-XP** to `character.combatXp` only; the level is derived from cumulative combat-XP:

```
combatXpForLevel(L)      = round( CL_BASE · CL_GROWTH^(L-1) )          // integer-pow (no Math.pow; §6.1)
totalCombatXpForLevel(L) = sum_{i=1..L} combatXpForLevel(i)
//   level → drives: hpMax = 40 + 8·characterLevel (§4.6.1)
//                   satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1, Q47)
//                   +1 attribute point every 2 character levels (§4.4)
```

*(proposed v1 balance)*: `CL_BASE = 60`, `CL_GROWTH = 1.18`. **This is the ONLY "level" concept in the game** —
labour skills and pillar deeds **never** raise it (Q1/FU14); no other section re-derives a "level."

**A kill writes exactly:**
- **Combat XP → the CHARACTER level** = `mobLevel · COMBAT_XP_K`, then per-event capped (§4.5.2). `COMBAT_XP_K =
  12` *(proposed)*. **`mobLevel` = the explicit per-mob `MobDef.level` field** (hand-tunable; defaults ~ the
  `dangerRing`'s expected character-level; FU15 — §2.9).
- **Skill XP → the equipped weapon line** (separately per-event capped).
- **It does NOT bump the rung-meter** (per-rung *curated activities* do that, §4.1.1) and **does NOT accrue a
  pillar deed** — **EXCEPT** a *recognized* clear/defend, which fires an **Arms** achievement jump (§4.2.1,
  per-event capped) **in Phase 2 only.** So grinding boars does **not** balloon Arms; the *recognized* road-
  cleared deed does — and only post-final-rung.
- **Loot** = one seeded roll on the mob's `LootTable` (§4.7.3); rare-tier weight scaled by `+0.5%·LUCK`.

This is the clean THREE-track separation (§4.0.1): **one kill → character-level XP (only); one recognised deed →
Arms (Phase 2); one curated rung activity → the Combat Rank meter** — the three sum independently (verifier-
asserted, §6.6). **Levers:** `CL_BASE`, `CL_GROWTH`, `COMBAT_XP_K`, `MobDef.level` defaults, the HP/satiety/
attr-point coefficients (§4.4/§4.6.1). The **combat-XP-only feed, the three-track separation, and the single
level curve** are **not levers** (canon).

### §4.6.6 The mediocre-start curve & the soft-setback-on-loss rule

- **Start near-zero, earned only by grind.** At R3 (first drills) the MC has weaponSkill 0, attributes 5, the
  single starter weapon (a **yari**, `weaponBase ≈ 3`; §4.6.9), `skillCombatBonus ≈ 0`. The **humbling first
  fight** (a wolf, §2.8/§2.9) is tuned so a fresh MC wins only **~20–35 %** of the time **(LOCKED by human,
  canon §I-bal — "humbling-but-winnable; drives the player to train"), measured AT adequate satiety
  (`satietyFrac ≥ ~0.7`, §4.6.1b)** — survivable by luck/stubbornness, never skill; meant to be *barely*
  survived, then motivate training (an underfed MC fares worse still). After ~a season of drills (weaponSkill
  ~5, attrs ~10, a smith-forged blade), win-rate against that same wolf is **~85 %+**. **Conditioning enters
  none of these numbers** — it is a one-way *enablement gate* only; and the first-fight numbers are measured
  **without heavy per-skill-perk stacking** (the small `skillCombatBonus`, §4.5.4, exists but is not yet milled
  out at R3). Under the longer saga (a FLOOR), "~a season of drills" is ~30–40 min of real R3 play — the climb
  from ~25 % to ~85 % is felt as *earned over real time*.
- **Soft setback on loss (LOCKED by human "as proposed", canon §I-bal):** a lost fight → MC drops to **1 HP**
  (not death), advances **~½ a day** of clock (the recovery), takes a **random light injury** (`InjuryState`,
  heals in ~**1–2 days** of rest, a small `−10%` to one stat meanwhile), and **may drop carried loot** (a seeded
  roll, **never equipped gear, never levels, never Influence** — the only Influence movement on a loss is a
  *scripted* Arms dent if the lost fight was a defence-deed, §4.2.4/§4.6.8). **Never** a level/gear/permanent
  loss (canon §E). The **severity SHAPE** (1 HP + ~½-day + light injury + *possible* carried-loot drop, never
  permanent progress) is **LOCKED**; the exact magnitudes remain levers.
  **Levers (magnitudes only):** the drop-loot chance, injury severity/duration, the ½-day clock cost. The
  **first-fight win-rate target (20–35 %, at adequate satiety)** and the **soft-setback shape** are **LOCKED,
  not levers.**

### §4.6.6b Unattended combat — full auto + the self-recovering loss loop (NEW — D-Q-idle-combat)

**Shape (canon §2.8 — V2-fixed).** Combat is **FULL AUTO**: the auto-resolve loop **fights everything** while
the tab is open (active-only; §4.7.4/FU23) — the player need not babysit. The loss path is a **self-correcting
loop with no death-spiral and no hard stall**, in two graded steps:

1. **A going-badly fight AUTO-RETREATS (the common case).** When the auto-resolver projects a loss (HP trending
   to 0 against the closed-form race, §4.6.4b), it **retreats per the §4.6.8 semantics** — **keep HP + carried
   loot**, pay the **modest ~¼-day clock cost**, **never dent Influence** (except an abandoned DEFEND-deed,
   §4.6.8). The MC walks away weaker-but-intact and trains/re-gears before re-engaging.
2. **A true 0-HP knockout forces a REST (the safety net).** If a fight actually drops the MC to **0 HP**, the
   soft-setback fires (§4.6.6: 1 HP, light injury) **and** the MC is **forced to travel to a safe place (home,
   or the nearest secured node) and REST to recover** — a **time cost** (~½-day travel + the rest, magnitudes
   = the §4.6.6 setback levers), after which the MC is back at adequate HP and the loop resumes. **Never** a
   death, a wipe, or a permanent loss.

Because every loss costs only **time + a recoverable setback** and routes the MC back to safety to recover, the
unattended loop is **self-correcting** — a too-hard mob just burns clock (forced rests) and nudges the player to
train/gear, never softlocks. **Levers:** the auto-retreat projection threshold; the forced-rest travel/rest
clock cost (= §4.6.6/§4.6.8 magnitudes). The **fights-everything auto-resolve, the retreat-keeps-HP/loot rule,
the 0-HP→forced-rest transition, and the no-death-spiral guarantee** are **canon, not levers.**

### §4.6.7 Win-rate bands — the 2nd pacing proxy (NEW — Q16 / FU19)

**Shape (V2-fixed).** Beyond the §4.8 time floor, a second headless **fun-proxy** asserts the combat difficulty
curve at each tier's combat-entry rungs: **fresh-at-rung** (just reached, before that rung's intended
training/gear) should be **humbling** (~30–45 %, with R3's **20–35 %** the anchor), and **comfortable** after
that rung's intended training/gear (**~80 %+**), tightening slightly per tier. All values are the **ANALYTIC
closed-form `P_win(MC)`** (§4.6.4b) — **computed from the combat formulae, NOT sampled** (D-Q-winrate) —
evaluated **at adequate satiety (≥~0.7)**. *(proposed v1 balance — tune-later magnitudes)*:

| Combat-entry rung | fresh-at-rung win-rate | after intended training/gear |
|---|---|---|
| **R3** (first fight, T0) | **20–35 %** *(the LOCKED anchor)* | ~85 %+ |
| **V2** (road-warden, T1) | ~35–45 % | ~80 %+ |
| **V5** (sworn man-at-arms, T1) | ~35–45 % | ~80 %+ |
| **G1** (road-captain, T2) | ~30–40 % | ~80 %+ |
| **G5** (road-detail / Hanzaki, T2) | ~30–40 % *(survived, not won)* | ~75–80 % |

These are wired into the M3/M6 fun-proxy harness (§7) **alongside** the §4.8 pacing floor — together the two
proxies are the playable bar (not just "it compiles"). **Levers:** every band magnitude (mob stats, gear tiers,
`MobDef.level`). The **R3 20–35 % anchor** is **LOCKED**; the rest are proposed.

### §4.6.8 Retreat resolution (NEW — Q16)

**Shape (canon §2.8 — V2-fixed).** Retreat is a **CLEAN escape valve**: you **keep HP + carried loot**, pay a
**modest clock cost**, and it **NEVER dents Influence.** *(proposed v1 balance)*: retreat costs ~**¼ day** of
clock (less than a loss's ~½ day) and no HP/loot penalty. **The one exception:** **abandoning a DEFEND /
defence-deed mid-fight counts as a *failed defend*** — the only Influence movement on a retreat — a small,
recoverable **Arms dent** (§4.2.4), never a wipe. **Levers:** the retreat clock cost. The **keep-HP/loot,
never-dents-Influence (except the abandoned-defend) shape** is **not a lever** (canon).

### §4.6.9 Weapon roster & archetype params + the combat-reveal ladder (NEW — D-026 / FU13 / FU12 / Q15)

**Shape (canon §2.8/§2.10.1 — V2-fixed).** A **growing, period-appropriate weapon roster** spanning **3
archetype LINES** (Spear / Sword / Staff-&-polearm). **T0 starts with exactly ONE weapon** and unlocks **+2
across the tier**; the roster grows **+3 at T1** and **+4 at T2** — **~9–10 weapons across v1** (the crude
**carrying-pole is a 0th IMPROVISED weapon**, not a line). Each weapon is an **archetype** — its **per-weapon**
`baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability.** New weapons are **FOUND and
CRAFTED, never gifted**, and reveal **one at a time** on the combat-reveal ladder (no UI-dump; FU4/FU12).

**Proposed v1 weapon table** *(proposed v1 balance — authored **byte-identical** to §2.8/§2.10, the §3 reveal
rows, and `content/items.ts` §6.5; the single per-weapon `baseSpeed` supersedes the old global 1.0)*:

| Weapon | Line | First reveal | `baseSpeed` | `reach` | `targetCount` | signature ability |
|---|---|---|---|---|---|---|
| Carrying-pole *(0th improvised)* | — | T0 convalescence | 0.80 | 2 | 1 | — *(no signature)* |
| **Yari** *(starter)* | 1 Spear | **T0-R3** | 1.00 | 3 | 1 | **Thrust-through** (partial armour pierce) |
| Kama-yari *(cross-spear)* | 1 Spear | T0 | 0.95 | 3 | 2 | **Sweep** (strikes 2 targets) |
| Nagae-yari *(long spear)* | 1 Spear | T0 | 0.85 | 4 | 2 | **Set-spear** (first-strike vs chargers) |
| Kodachi *(short sword)* | 2 Sword | T1 | 1.25 | 1 | 1 | **Riposte** (counter on evade) |
| Uchigatana | 2 Sword | T1 | 1.10 | 2 | 1 | **Iai draw** (crit on opening swing) |
| Ōdachi *(great sword)* | 2 Sword | T1 | 0.90 | 2 | 2 | **Wide arc** (cleave 2) |
| Bō *(staff)* | 3 Staff | T2 | 1.20 | 2 | 1 | **Stagger** (applies slow) |
| Naginata | 3 Staff | T2 | 1.00 | 3 | 2 | **Reaping arc** (cleave + reach) |
| Kanabō *(spiked club)* | 3 Staff | T2 | 0.75 | 1 | 1 | **Crush** (block-break, defense shred) |
| Tetsubō *(iron club)* | 3 Staff | T2 | 0.70 | 1 | 1 | **Earthbreaker** (heavy single-target burst) |

Count: **3 weapons in Line 1 by end-T0** (1 starter + 2), **+3 at T1** (Line 2 opens), **+4 at T2** (Line 3
opens) = **10 weapons** (+ the 0th improvised pole) ≈ **9–10 across v1** ✔. The improvised pole carries a
minimal archetype (slow, short, single-target) and **no** signature.

**The combat-reveal ladder (one reveal per beat; FU12).** Combat is a real **incremental progression surface**,
staggered one beat at a time (kills the old R3 UI-dump):

| Beat (trigger kind) | What reveals |
|---|---|
| **R3** — combat rung | The **single starter weapon (yari)** + the **bare auto-resolve loop** + **retreat** + the **Bestiary** (character (combat) **level** begins). Combat stats start near-zero. |
| **R4** — loot→craft loop | **Graded weapon-durability bands** (§4.6.1c) surface with the simple Crafting loop + **Equipment/Inventory** (never auto-unequipped). |
| **R5** — combat rung | The **stance** slot. *(Curated combat activities feed the **Combat Rank** rung-meter; **Arms PILLAR deeds do NOT accrue yet** — Phase 2.)* |
| **First weapon-line L10 milestone** — weapon-skill milestone | The **ability + item** intervention slots. |
| **T1** — combat rung | The **2nd archetype line (Sword)** opens on a Combat Rank rung-gate; **+3 weapons across T1.** |
| **T2** — combat rung | The **3rd archetype line (Staff/polearm)** opens; **+4 weapons across T2.** |

Weapon **signature abilities** deepen at higher weapon-line milestones (richer signatures ~**L25 / L50** —
*proposed v1 balance*). These feed the **three clean tracks** (§4.0.1), never one fused bar. **Levers:** the
roster count & each weapon's archetype params + signatures; the reveal-beat placement. The **T0-starts-1 /
+2/+3/+4 cadence, the 3-line shape, the FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are **not
levers** (canon).

### §4.6.10 The LIGHT ACTIVE LAYER — optional mid-fight intervention (NEW — D-Q-active-combat)

**Shape (canon §2.8 — V2-fixed).** **Auto-resolve stays the spine** (§4.6.6b — it fights everything,
unattended): the active layer is **optional**, for engaged players and hard fights, and **changes the closed-
form inputs (§4.6.4b), never replaces the auto-resolve.** Three lightweight, low-APM interventions (no
twitch-combat — canon §E "strategic, not reflex"):

- **(1) Stance** *(set BEFORE the fight or swapped mid-fight; the slot reveals at R5 — §4.6.9).* A stance applies
  the `stance.*` modifiers already wired into §4.6.1 (`defMod` / `atkMod` / `speedMod` / `evasionMod`). Three
  default stances *(proposed v1 balance)*: **Aggressive** (`atkMod +0.20`, `defMod −0.15`, `speedMod +0.05`),
  **Balanced** (all mods 0 — the auto-resolve default), **Defensive** (`defMod +0.25`, `evasionMod +0.15`,
  `atkMod −0.15`). Swapping stance mid-fight costs **one swing's cadence** (no free instant swap).
- **(2) Ability slot** *(reveals at the first weapon-line L10 milestone — §4.6.9).* A **timed** trigger of the
  equipped weapon's **signature ability** (§4.6.9 — e.g. *Iai draw* = guaranteed crit on the next swing;
  *Crush* = `−defense` shred on the target; *Stagger* = apply slow). On a **cooldown** (`ABILITY_CD ≈ 8 combat
  ticks`, *proposed*); if the player never triggers it, the auto-resolver fires it on cooldown at a sensible
  default — so it **helps, never punishes** the hands-off player.
- **(3) Item slot** *(reveals alongside the ability slot — §4.6.9).* A **consumable** mid-fight: a **ration**
  (restore satiety → lifts `satietyRate`, §4.6.1b), a **salve** (heal a chunk of HP), or a **whetstone**
  (restore a durability band, §4.6.1c). Each is a one-shot consumable on a short cooldown; the auto-resolver
  uses a held item automatically when HP/satiety crosses a low threshold.

**Net effect on the math.** Every intervention resolves to a **change in the §4.6.1 derived stats** (stance
mods, an ability's crit/defense/slow, an item's satiety/HP/durability restore), so the fight stays a
deterministic seeded sim and the **closed-form win-prob (§4.6.4b) still holds** for the chosen stance/loadout.
The §4.6.7 win-rate bands are computed for the **Balanced (default) stance**; active play only **improves** the
hard-fight odds. **Levers:** the per-stance mod magnitudes, `ABILITY_CD`, the item-slot effects/cooldowns, the
auto-resolver's default-trigger thresholds. The **auto-resolve-is-the-spine / interventions-only-help rule** and
the **low-APM (no twitch) constraint** are **canon, not levers.**

---

## §4.7 Producer / cost curves (gathering yields, crafting, T3+ auto-producers, building costs)

**Shape (canon §G — fixed; V2-reconciled).** **Auto-producers are LATE-GAME (T3+) ONLY** (§2.5) and
**ACTIVE-ONLY** (no offline accrual; FU23) — v1's T0–T2 is the MC's own **active grind**, so for v1 the
load-bearing curves are **gathering yields**, **crafting costs/quality**, and **building/upgrade costs**. The
genre-standard `cost = base · r^owned` is used **only** for the late-game auto-producers and repeatable
upgrades, **never** to fake an early idle layer. **Yields are modelled already NET** of stamina/food/
re-investment (Q14), which is why end-T0 *lifetime-produced* koku ≈ **21K** but *held* koku ≈ **18–19K NET**
(§4.0) — the gap is genuine **sinks** (E1/E2/E3 builds, tools, craft inputs), not a hidden upkeep tax.

### §4.7.1 Gathering / labour yields (active — already NET)

```
weatherMod   = 1 + 0.10·( 2·deriveDayKeyed(seed,'weather',day) − 1 )   // STATELESS day-keyed ±10%, NOT persisted (Q35/FU3; §2.19/§6.7)
satietyFrac  = satiety / satietyMax                                    // satietyMax = SATIETY_BASE + SATIETY_PER_LEVEL·characterLevel (§4.6.1, Q47)
staminaRate  = ( satietyFrac ≥ 0.7 ) ? 1.0
             : lerp( STAMINA_RATE_FLOOR, 1.0, satietyFrac / 0.7 )      // flat above ~0.7·satietyMax, knee down to the floor (FU21)
yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · weatherMod · staminaRate
ticksPerAction = baseTicks · (1 − 0.003·SPD)                          (floored at 1)
```

*(proposed v1 balance)*: **`STAMINA_RATE_FLOOR = 0.5`** — the **labour** rate multiplier, never to zero
(modest drain per action; rest/eat refills, §2.3). It is a **SEPARATE coefficient from the combat
`SATIETY_COMBAT_FLOOR`** (§4.6.1b), so labour-throttle and combat-throttle tune **independently** (FU16/FU21).
The **±10 % weather/festival** modifier is a bounded, **MECHANICAL** effect derived from a **stateless,
day-keyed** `deriveDayKeyed(seed,'weather',day)` helper (§2.19/§6.7) — it is **NOT stored** (only
market-saturation persists; Q3/FU3), so two saves on the same day at the same seed see the same weather.

*(proposed v1 base yields, koku/material per action — magnitudes UNCHANGED; the longer saga is paid in TIME at
the per-rung FLOOR, not in shrunk yields)*:

| Node | baseYield | baseTicks | toolMult range | season gate |
|---|---|---|---|---|
| Rake/farm rice (paddy) | 2 koku | 3 | 1.0 → 2.5 (sickle→fine tools) | grows spring/summer, **harvest autumn** |
| Forage *sansai* | 1 greens | 2 | 1.0 → 1.8 | spring/summer windows |
| Woodcut | 2 wood | 3 | 1.0 → 2.2 | year-round |
| Fish (ford) | 1 fish | 2 | 1.0 → 2.0 | year-round, peak autumn |
| Sericulture (silk, T1+) | 1 cocoon | 4 | 1.0 → 3.0 | **summer** (mulberry); **TRADE strand opens T1**, never T0 (§4.2.3) |

**Throughput tie-out (how these yields produce the §4.8 pacing).** A T0 rice action runs
`2·(1+0.04·skill)·toolMult` koku. At **R1** (skill ~1, crude tools 1.0) that's **~2.1 koku/action**; at **R7**
(skill ~12, fine tools 2.0) it's **~5.9 koku/action**. At the intended active pace, the *net koku-equivalent
throughput* (already net of stamina/food/re-investment, Q14) rises across T0's rungs roughly: **R1 ~25 → R2
~35 → R3 ~40 → R4 ~60 → R5 ~80 → R6 ~110 → R7 ~150 koku/min** (combat rungs trade some labour minutes for loot
value; crafting/cash-crop rungs add value per action). Multiplying each by its rung's wall-clock minutes
(§4.8.1) gives **lifetime-produced koku over the T0 rung-climb ≈ 21K**, of which **~18–19K is HELD NET** at the
T0→T1 gate (after the E1/E2 build sinks + tools/craft — §4.7.5). **This throughput table is the bridge between
the yields here and the rank-time table in §4.8.1; retune the `0.04·skillLevel` slope and tool multipliers,
never the per-rung time FLOOR, to fix pacing drift.**

**Seasonal headline:** the autumn rice harvest is a **`×3` season multiplier** on paddy yield (drives the
Estate judged-result high-water mark, §4.2.2 — the autumn appraisal is the one most likely to set a fresh
mark). **Levers:** every baseYield/baseTicks, the `0.04·skillLevel` and `0.003·SPD` coefficients, tool
multipliers, season multipliers, the autumn `×3`, `STAMINA_RATE_FLOOR` (0.5) and its 0.7 knee, the weather
`±10 %` band, and the **per-rung net-throughput assumptions** (§4.8.1). The **stateless-day-keyed weather
rule, the yields-already-NET model, and the separate labour/combat throttle coefficients** are **not levers**
(canon).

### §4.7.2 Crafting cost & quality (hybrid: simple → component)

- **Simple recipes (early):** flat `inputs → output`; cost a fixed small material bundle; success ~100 %.
- **Component recipes (T1+):** a **proper 0–1 quality SCORE** — a weighted blend of **each input normalised to
  [0,1]** (weights sum to 1, so **NO spurious divisor**; D-Q-craft) — then mapped to a quality tier:
  ```
  qualityScore = 0.4·norm(crafterSkill) + 0.4·avgComponentQuality + 0.2·norm(stationTier)   // ∈ [0,1], weights sum to 1
  //   norm(crafterSkill) = clamp( crafterSkill / SKILL_REF, 0, 1 )    // SKILL_REF = the skill's tier soft-cap (§4.5)
  //   norm(stationTier)  = stationTier / MAX_STATION_TIER             // station tier as a fraction of the best station
  //   avgComponentQuality already ∈ [0,1] (recursive — a component's own qualityScore)
  outputQualityTier = floor( qualityScore · QUALITY_TIERS )           // QUALITY_TIERS = 5 → tiers 0–5 (crude → masterwork)
  ```
  Each quality tier multiplies the item's stat/value by **`1.25^tier`** (integer-pow, no `Math.pow`; §6.1).
  Disassembly returns **~60 %** of materials. *(The old `/ QUALITY_DIVISOR = 10` divisor is **removed** — it
  conflated a 0–1 weighted blend with an unnormalised raw-skill scale; the normalised score above is the fix.)*

**Resource counts are UNBOUNDED** (Q13 — strike any "+caps"; K/M/B abbreviation reads them, §4.0). **Coin is a
REAL T1+ sink (D-Q-craft+coin):** from **T1** the market row lets the player **spend coin on market purchases
and component-buying** (buying inputs/finished components the trade strand needs) — a genuine ongoing coin
*sink*, not a vestigial counter. The **coin/market MAGNITUDES** — the koku↔coin spread, the per-purchase prices,
`MarketState` — stay **M4-tunable** (Q13; §2.4), but the **sink itself is now load-bearing**, not a placeholder.
**Bulk sales** apply the **saturation damper PROGRESSIVELY per-unit** (each unit walks the price down — legible,
un-gameable; Q42 — §2.4), feeding the trade strand under the ≤⅓ clamp (§4.2.3). **Levers:** the 0.4/0.4/0.2
quality weights, `QUALITY_TIERS` (5) + the `SKILL_REF`/`MAX_STATION_TIER` normalisers, the `1.25^tier` value
step, the 60 % disassembly return, the coin spread/prices and the T1+ coin-sink magnitudes. *(Crafting magnitudes are
unchanged by the rebalance — the value-add they provide is folded into the rising per-rung throughput in
§4.7.1/§4.8.1.)*

### §4.7.3 Loot tables (seeded)

A mob/node drops on a weighted table; **rarity tiers common/uncommon/rare/fine** with default weights
**70 / 22 / 6 / 2** (rare/fine weight scaled by `+0.5 %·LUCK`), rolled on the **`loot` RNG cursor** (§6.7) so
drops replay byte-identically. **Levers:** the rarity weights and the LUCK coefficient. The **seeded-single-
cursor rule and the 70/22/6/… shape** are **not levers** (canon).

### §4.7.4 Auto-producers (T3+ ONLY — active-only, no offline; parked, scaffold only)

```
cost(n)  = producerBase · PRODUCER_GROWTH^owned          (PRODUCER_GROWTH = 1.5, ~5× per few buys)
output   = producerBaseRate · (1 + 0.1·tier)             (per ACTIVE tick — NO offline accrual, canon §H / FU23)
```

Gated on **Influence band + a LOW rank floor + cost** (NOT the capstone — §1.5.1 estate-growth rule), bound to
a `RosterMember` (a face, not a slider; §2.5). **All values parked until T3 is authored**; only the
**shape/`PRODUCER_GROWTH` scaffold** is fixed here.

> **The v1 "leave it running" feel is NOT an idle/offline layer (FU23).** v1's E0–E3 estate is a **fully
> active grind**; the "set it going and check the progress" texture comes entirely from **tab-open
> AUTO-RESOLVE combat + AUTO-REPEAT labour** while the tab is open and active (§2.8/§2.6) — **not** from
> offline accrual or early auto-producers (T3+ only, §2.5). Closing the tab pauses the world. This is the
> canon **active-only / no-offline** rule (D-013a), and it is what makes the **budget-as-a-FLOOR** grind
> (§4.8) feel like an idler without being one.

### §4.7.5 Building / upgrade costs (estate stages E0→E3, v1)

Estate physical stages gate on **Estate & Wealth (+ Arms for defensive works) + a LOW rank floor + cost**
(§1.5.1 — never the capstone; §2.17). **V2 un-parks E3 "Prosperous"** (Q8 — estate grows **E0→E3** in v1;
E4–E5 stay parked), folded into the **later G-rungs as a koku/Arms sink** (NO new rung; M5). *(proposed)*:

| Stage | Gate (pillar floor + rank) | koku cost | material cost |
|---|---|---|---|
| **E0 Foreclosure's Edge** | start | — | — |
| **E1 Stabilising** (kura patched, first *shinden*, drill yard, night-watch) | Estate ≥ 0.3K, rank ≥ R4 | 400 koku | 30 wood |
| **E2 Recovering** (granary, 2 workshops, low palisade, men-at-arms rota) | Estate ≥ 0.6K + Arms ≥ 0.3K, rank ≥ R6 | 2K koku | 120 wood, 40 stone |
| **E3 Prosperous** (3rd workshop + full granary, closed perimeter, standing 4–5-man rota, *shinden* reclamation paying out) | **Estate ≥ 40K + Arms ≥ 15K, rank ≥ G4** | **40K koku** *(staged across the river-works)* | **800 wood, 400 stone** *(+ corvée labour)* |

**Affordability tie-out (vs the §4.7.1/§4.8.1 throughput).** **E1's 400 koku** falls due around **R4**, by
which point lifetime-produced koku ≈ **5.1K** — comfortably affordable while the held NET balance keeps
climbing. **E2's 2K koku** falls due around **R6**, by which point lifetime-produced koku ≈ **13.3K**. After
both T0 sinks (2.4K koku) plus tools/craft inputs, the T0→T1 gate holds **~18–19K NET** out of ~21K produced
(§4.0). **E3's 40K koku** falls due at **G4** (the Kuzuhara river-works, M5) — by which point T2 lifetime
production is well into the **100K+** band (§4.0), so E3 is **paced to be reached, not trivially pre-bought**,
and its **Estate ≥ 40K + Arms ≥ 15K floors sit BELOW the T2 good-bands** (Estate 60K / Arms 30K, §4.1) and its
**rank floor G4 is far below the G7 capstone** — keeping building gated on standing, never the capstone
(§1.5.1). **Levers:** every cost & pillar/rank floor above (all *proposed*); the E3 staging (one lump vs the
multi-stage *seki*).

---

## §4.8 PACING — the budget is a FLOOR, not a ceiling

These are the **playtest acceptance criteria** the numbers above are derived *backward from*; they are
headlessly regression-tested via the DEV play API (§2.20/§6.10) so a retune that breaks pacing fails CI.
Canon hard rules: **first action < 5 s**, **the next goal never balloons > ~2–3× the prior** (within a tier;
canon §G, §1.2), and — **LOCKED by human (canon §I-bal), now read as a FLOOR (FU18)** — **every single rung
takes ≥ ~30 min**, with **per-tier Phase-1 climb budgets T0 ≈ 4.5 h · T1 ≈ 8 h · T2 ≈ 16 h** ("more grind, more
numbers, a slower release of incremental features"). **The ≈28.5 h figure is the v1 PHASE-1 climb FLOOR, NOT
the total (D-Q1):** the full **v1 saga ≈ ~60 h FLOOR = ~28.5 h Phase-1 climb + a ~+32 h Phase-2 pillar-grind
floor** (§4.8.1b/§4.8.4).

> **The ≥30-min floor is enforced on the RUNG-METER POINTS, not the wall-clock (D-Q2).** The runtime floor is
> the per-rung meter threshold (§4.1.1), back-solved so that **even optimal FOCUSED play cannot fill a rung's
> numeric-points objective in < 30 min** — the meter is the enforcement, the time follows. **Unfocused play**
> (multi-skilling, side-quests, off-objective wandering) takes **LONGER — ~60–120 min/rung**. The per-rung
> **wall-clock column** in the tables below (35/40/45/55 min at T0, etc.) is **EXPECTED real, somewhat-unfocused
> play — NOT a contradiction** with the 30-min focused-optimal floor: it sits *above* the floor by design.

> **REBALANCE — these figures are FLOORS / MINIMUMS, not ceilings (FU18; annotates D-016).** §4.8 is a
> **minimum-grind model**: the ≥30-min/rung floor and the 4.5/8/16-h tier figures are the **least** a player
> spends, and the **two-phase tier (Phase-1 rung climb + Phase-2 pillar grind) runs LONGER** than the
> historical "tier budget," which now anchors the **Phase-1 climb FLOOR**. The saga **can and should run
> longer** when content interleaves richly (a long, OSRS-rough grind you leave **auto-resolving / auto-
> repeating** and check on, FU23). The **M6 pacing regression FAILS ON UNDERSHOOT ONLY** — a rung cleared
> *too fast* — **never on overshoot** (§4.8.4). The old "leave T0 in ~45–75 min, v1 ~12–20 h" targets stay
> deleted.

### §4.8.0 Headline beats

| Beat | Target | Lock status | How measured |
|---|---|---|---|
| **First action available** | **< 5 s** from load (rake spilled rice in the *kura*) | canon | time-to-first-interactable |
| **First meaningful reveal** | **< 30 s** (rice counter ticks → the koku row lights its own panel, §3.1) | proposed | first `unlock` event |
| **Per-rung minimum** | **≥ ~30 min per rung** *(a FLOOR; R0 cold-open exempt)* | **LOCKED — FLOOR** | per-rung tick-count floor (undershoot fails) |
| **Humbling first fight (R3)** | **~60–75 min** in (start of R3), **win-rate 20–35 % at adequate satiety (≥~0.7)** | **LOCKED anchor** | tick-count to the wolf + win-rate proxy (§4.6.6/§4.6.7) |
| **Win-rate bands** *(2nd fun-proxy, NEW)* | fresh-at-rung humbling (~20–45 %), comfortable after that rung's training/gear (~80 %+) — **at adequate satiety** | proposed (R3 anchor LOCKED) | the §4.6.7 win-rate-band harness |
| **Phase-1 climb → T1** (rungs cleared) | **≈ 4.5 h** *(FLOOR)* active play | **LOCKED — FLOOR (T0)** | tick-count to the T0 capstone (opens Phase 2) |
| **Phase-1 climb → T2** | **≈ 8 h** *(FLOOR)* | **LOCKED — FLOOR (T1)** | tick-count to the T1 capstone |
| **Phase-1 climb (T2)** | **≈ 16 h** *(FLOOR)* | **LOCKED — FLOOR (T2)** | tick-count to the T2 capstone |
| **v1 Phase-1 FLOOR sum** | **≈ 28.5 h** *(the Phase-1 climb floor — NOT the total; D-Q1)* | **LOCKED — FLOOR** | cumulative tick-count |
| **v1 TOTAL FLOOR** *(Phase-1 + Phase-2)* | **≈ ~60 h** *(≈28.5 h climb + ~+32 h Phase-2 grind; minimum, runs longer)* | **LOCKED — FLOOR** | cumulative tick-count incl. Phase-2 |
| **Goal-to-goal step ratio** | **≤ 2–3×** between consecutive within-tier goals | canon | max ratio of consecutive costs |
| **Tier-to-tier step** | **~10×** (Arms/Estate) — a chapter, not a wall; Office steepens (~25× at T1→T2) | proposed | band-top ratio across tiers |
| **Side-faction speedup** | village+origin weaving **shaves ~10–15 %** off time-to-next-tier (felt, never required) | LOCKED (H6) | with/without multipliers |

> The old draft's "leave T0 in ~45–75 min; v1 ~12–20 h" row is **deleted** — superseded by the locked
> longer **FLOOR** budget above (FU18).

### §4.8.1 ⭐ T0 PHASE-1 rank-by-rank pacing table (the centrepiece — all 8 rungs, full resolution)

This is the table the rest of §4 is tuned to satisfy. **It is the PHASE-1 rung climb** (§4.0.1/§4.1.1): each
rung promotes on an **AND-gate** — its **per-rung-reset rung-meter ≥ threshold** (fed by that rung's **curated
activities**, §4.1.1) **AND** its **story flags** (the UI reads "awaiting X" when one side lags) — **NOT** on
accumulating pillar deeds (those are **Phase 2**, §4.8.1b). Each grind rung's expected wall-clock **≥ ~30 min
(R0 aside, the cold-open story rung)**, escalating toward the capstone, **summing to ≈4.5 h (the Phase-1
FLOOR)**. The **koku column is lifetime-produced** (the labour/economy currency, already NET, §4.7.1); the
**meter threshold** is in rung activity-points (§4.1.1); "throughput" is the net koku-equiv/min from §4.7.1.
*(Times, costs & thresholds: **proposed**; the ≥30-min floor and the 4.5-h Phase-1 sum: **LOCKED as FLOORS**.)*

| Rung (what it gates — from §3) | Meter + story gate to LEAVE it (Phase 1) | Throughput | koku (rung) | ⏱ wall-clock |
|---|---|---|---|---|
| **R0 Stray** — cold open done; bare estate dashboard | *(story only — the cold open §3.1)*; meter n/a | n/a (tutorial) | ~0 | **~5 min** *(floor-exempt)* |
| **R1 Day-labourer** — paddies, basic labour loop, world-clock | **Estate Service ≥ ~18** (rake/recover rice · clear forecourt · first paddy turns) + Genemon assigns real work | ~25 koku/min | ~0.75K | **~30 min** *(floor)* |
| **R2 Bonded hand** — Skills tab, foraging/woodcut/haul, near *satoyama* | **Estate Service ≥ ~19** (forage · woodcut · haul · stable chores) + first season turns | ~35 koku/min | ~1.05K | **~30 min** *(floor)* |
| **R3 Yard-hand under arms** — COMBAT LIVE; humbling first fight; drill yard, Bestiary, the starter **yari** | **Combat Rank ≥ ~17** (survive the **scripted** first wolf [a **guaranteed-survival** beat — win-or-soft-setback, the R3 story trigger] · drill reps · the **grindable** wolf/sparring + first pest skirmishes [where the **LOCKED 20–35 % win @ ≥0.7 satiety** is measured, §4.8.0/§4.6.7]) + drill-yard story | ~40 koku/min | ~1.2K | **~30 min** *(floor)* |
| **R4 Trusted hand** — Main House, domestic economy, **first *shinden* (E1)**, **loot→craft loop + durability bands** | **Estate Service ≥ ~17** (indoor errands · first *shinden* labour · craft a first tool) + invited to the Main House; **build E1 (400 koku)** | ~60 koku/min | ~2.1K | **~35 min** |
| **R5 Gate-guard** — Quest log + quest types; the **stance** slot | **Combat Rank ≥ ~17** (stand a watch · pest-control / hunt / clear sweeps) + posted to the gate | ~80 koku/min | ~3.2K | **~40 min** |
| **R6 Foreman of works** — Workshops/Granary (E2), proto-industry, **village tier seed** | **Estate Service ≥ ~15** (drive workshop/granary works · proto-industry shifts) + works commissioned; **build E2 (2K koku)** | ~110 koku/min | ~4.95K | **~45 min** |
| **R7 Bailiff** *(capstone → OPENS Phase 2)* — lord's study, four-bar Influence panel | **Estate Service ≥ ~14** (field-office duties · record the first reclamation) + the Lord's recognition — **the capstone OPENS the Phase-2 pillar grind (§4.8.1b)** | ~150 koku/min | ~8.25K | **~55 min** |

**Totals & checks (T0 Phase 1):** wall-clock **5 + 30 + 30 + 30 + 35 + 40 + 45 + 55 = 270 min = 4.5 h** ✔
(every grind rung ≥ 30 min ✔; escalating ✔; the Phase-1 FLOOR). Lifetime koku produced ≈ **0.75K + 1.05K +
1.2K + 2.1K + 3.2K + 4.95K + 8.25K = 21.5K ≈ ~21K** ✔ (the **same round figure** as the §4.0 T0 band; clears
E1@R4 and E2@R6 ✔; held ≈ **18–19K NET** at the gate after sinks). Consecutive within-rung *cost* ratios stay
≤ ~2× (0.75K→1.05K→1.2K→2.1K…), honouring the ≤2–3× rule ✔. **No pillar deeds appear in this table** — the
~560 Estate / ~350 Arms deed-ip (§4.2.1) accrue **only in Phase 2** (§4.8.1b), which is what prevents the
"half the rungs, maxed deeds" state (FU7).

> **R0 floor carve-out — blessed by the human (2026-06-25).** The ≥30-min per-rung floor (canon §I-bal)
> applies to the **7 grind rungs R1–R7**; **R0 is the exempt ~5-min cold-open story rung** (the *kura* cold
> open §3.1 — a scripted beat, not a grind rung). So T0's **4.5 h Phase-1 floor** comes from *floor +
> escalation across R1–R7*, **not** a literal "8 rungs × 30 min." A settled, deliberate carve-out.

### §4.8.1b PHASE-2 pillar-grind block (the deeds + seasonal grind, per tier — NEW)

When the **capstone rung opens Phase 2** (§4.0.1), the tier's **pillar DEEDS begin accruing** (§4.2.1) and the
**seasonal appraisals begin crediting** (§4.2.2) toward the **HYBRID good/great/excellent gate** (§4.1) across
the tier's **REVEALED pillars** (T0 = 2 · T1 = 3 · T2 = 4 — Name gated, D-Q3). The basis was **built across Phase 1** by labour
(holdings near band-top), so Phase 2's first appraisal posts a large high-water jump, then diminishes (§4.2.2).
**This grind is ADDED on top of the Phase-1 climb FLOOR** — the realisation of the budget-as-a-FLOOR intent
(FU18): the two-phase tier runs **longer** than its Phase-1 floor. Deed cadence is **tier-relative** (Q20:
~5 min/recognised act at T0 · ~8 min at T1 · ~13 min at T2), interleaved with the continuing auto-resolve /
auto-repeat loop (FU23). *(All Phase-2 window minutes are **proposed**; only the §4.2.1/§4.2.2 deed/seasonal
tie-outs and the §4.1 hybrid bands are the load-bearing invariants the §6.6 verifier asserts.)*

| Tier (revealed pillars → hybrid gate) | Phase-2 deeds (§4.2.1) → 70 % | Seasonal (§4.2.2) → 30 % | great/excellent reached by | ⏱ Phase-2 window *(proposed, ADDS to the floor)* |
|---|---|---|---|---|
| **T0** *(Arms + Estate; **good in BOTH + excellent in 1**)* | **30 Arms (350 ip) + 26 Estate (560 ip)** = ~56 deeds @ ~5 min | Arms 150 · Estate 240 (8-season back-credit) | excellent in **one** (Estate→1.5K *or* Arms→0.95K) via additional capped deeds | **~4.5–5 h** |
| **T1** *(Arms + Estate + Office; **good in ALL 3 + great in 2**)* | **35 Arms (3,500) + 35 Estate (5,600) + 20 Office (1,400)** = ~90 deeds @ ~8 min | Arms 1,500 · Estate 2,400 · Office 600 | great in **two** (e.g. Estate→11K + Arms→7.5K) | **~12 h** |
| **T2** *(Arms + Estate + Office + Name → **4 revealed**; **good in ALL 4 + Estate/Office great/excellent, Arms & Name good**)* | **20 Arms (21,000) + 31 Estate (42,000) + 21 Office (35,000) + 21 Name (19,600)** = ~93 deeds @ ~13 min | Arms 9,000 · Estate 18,000 · Office 15,000 · **Name 8,400** *(0.30·28K)* | Estate/Office to great/excellent (their surplus-deed counts §4.1); **cross-pillar combos** (§4.3.1) smooth the grind + the **E3 sink** (G4) folds in | **~20 h** *(now incl. Name, D-Q3)* |

**Tie-out (Phase 2).** Each tier's deed inventory sums to **exactly 70 %** of every revealed pillar's **good**
band — **including the now-GATED T2 Name pillar** (19,600 deeds + 8,400 seasonal = 28K, D-Q3) — and the
seasonal stream supplies the **30 %** residual (the line-by-line proof is in §4.2.1/§4.2.2) — the
two add to the §4.1 **good** band, the breadth floor every player reaches. **great/excellent** are reached by
**specialising** the Phase-2 surplus into the chosen 1–2 pillars (each still per-event-capped at 0.04·good,
many small acts, never spikes — §4.1/§4.2.1), which **extends Phase 2 beyond its floor** (FU18). **T2 layers in
the cross-pillar combos** (multiple pillar pairs, post-trade-clamp, **excluded from the gate-check**; §4.3.1)
as the anti-slump device and the **E3 "Prosperous" build** (40K koku + materials, §4.7.5) as a Phase-2 koku/
Arms sink. **The whole tier = Phase-1 climb (≥ its 4.5/8/16-h FLOOR) + this Phase-2 grind**, so the realised
tier always runs **above** its floor (the M6 regression fails on **undershoot only**, §4.8.4).

### §4.8.2 T1 PHASE-1 rung pacing (lower resolution — Phase-1 FLOOR ≈ 8 h, avg ~1 h/rung)

T1's Phase-1 spends its longer floor on **wider** content (market, coin, component crafting, silk *meibutsu*,
rumours board, valley-scale combat, the 2nd weapon line) at **~60 min/season** wall-clock. Throughput rises
~10× over T0 (koku into the tens-of-thousands). Each rung gates on the **rung-meter + story** (not deeds);
**Office is revealed** here and becomes a *required* Phase-2 gate (§4.1). Each grind rung ≥ ~40 min; capstone
longest. *(Combat Standing → **Combat Rank** throughout; Q9.)*

| Rung (§3.4) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **V0 Errand-runner** — market/coin opens (one shop first) | Estate Service ≥ thr + first valley errands; coin row lit | **~40 min** |
| **V1 Recognised hand** — chief's house, inn & rumours board | Estate Service ≥ thr + shop+headman standing | **~55 min** |
| **V2 Road-warden** — HUNT/CLEAR at valley scale; ford safe; **Sword line opens** | **Combat Rank ≥ thr** (valley clears; road-safe curated activities) + the ford story | **~60 min** |
| **V3 Steward of the valley economy** — silk *meibutsu* + component crafting | Estate Service ≥ thr + recorded seasonal result; **TRADE strand opens** (≤⅓-capped, §4.2.3) | **~65 min** |
| **V4 Trusted of the headman** — **Office bar lights** (first Office reveal) | Estate Service ≥ thr + the headman's trust beat | **~70 min** |
| **V5 Sworn man-at-arms** — paid retinue (flavour), DEFEND quests; **Naoyuki beat** | **Combat Rank ≥ thr** (valley DEFEND watches) + the man-at-arms oath | **~70 min** |
| **V6 Right-hand-in-waiting** — authority across the valley; region seed | Estate Service ≥ thr + STORY (alliance/standing) | **~55 min** |
| **V7 Agent of the house** *(capstone → OPENS Phase 2)* — "clean your room"; region opens | Estate Service ≥ thr + the Lord sends you to the region — **opens the T1 Phase-2 grind to the hybrid gate (§4.8.1b)** | **~65 min** |

**Totals & checks (T1 Phase 1):** **40+55+60+65+70+70+55+65 = 480 min = 8.0 h** ✔ (the Phase-1 FLOOR). The
**Phase-2 deeds** (Estate 5,600 / Arms 3,500 / Office 1,400 ip — §4.2.1) + seasonal (2,400 / 1,500 / 600)
accrue **after V7** (§4.8.1b), to the hybrid **good-in-3 + great-in-2** gate. Tier step Arms/Estate ≈10×;
**Office is a fresh required gate** (0 at T0 → good-band 2K at T1). Season ≈ 60 min ⇒ ~8 seasons span the T1
Phase-1 floor.

### §4.8.3 T2 PHASE-1 rung pacing (lower resolution — Phase-1 FLOOR ≈ 16 h, avg ~2 h/rung)

T2's Phase-1 is the longest, widest: region map, *sekisho* travel, region-scale human mobs (rōnin/bandits),
the Origin faction + both personal payoffs, Kuzuhara river-works (the **E3** lever), the rival houses, the 3rd
weapon line. **~120 min/season** wall-clock. Required Phase-2 pillars drift to **Estate + Office** (Arms
secures roads); **Name** reveals (**4 revealed** — Name gated, D-Q3). Each grind rung ≥ ~75 min; capstone among the longest. T2's
**Phase 2** weaves in the **cross-pillar combos** (§4.3.1) and lands **E3 "Prosperous"** (§4.7.5).

| Rung (§3.6) | Meter + story gate to leave it (summary) | ⏱ wall-clock |
|---|---|---|
| **G0 Valley-envoy** — trade backbone opens minimally; first Origin contact | Estate Service ≥ thr + first off-the-books consignment | **~75 min** |
| **G1 Road-captain** — *sekisho* layer; region-scale combat (rōnin/bandits); **Staff line opens** | **Combat Rank ≥ thr** (secure cluster roads — curated combat) + first pass obtained | **~110 min** |
| **G2 Broker of the post-town** *(Origin OPENS)* — Sawatari-juku, *toiya* | Estate Service ≥ thr + **STORY (dream) AND travel-standing** (the doubly-earned Origin gate, §3.6.2) | **~120 min** |
| **G3 Arbiter between valleys** — Hibara + Tōge-mura (capped at 2) | Estate Service ≥ thr + out-supply/arbitrate story | **~130 min** |
| **G4 Recognised regional retainer** — Kuzuhara river-works (LAND mega-lever) | Estate Service ≥ thr **+ STORY** (commit the multi-stage *seki*) — **lands estate stage E3 "Prosperous"** (40K koku sink, §4.7.5) | **~140 min** |
| **G5 Captain of the road-detail** — brigand roost; **Hanzaki survived**; **Naoyuki ally-flip** | **Combat Rank ≥ thr** (secure the trade pass — curated combat) + the roost broken | **~140 min** |
| **G6 Alliance-broker** *(Otsuru/Tama TRUTH — spine-guaranteed)* — Tahei-name-reclaim is **Origin-O5 missable** (§3.6.2/Q5) | Estate Service ≥ thr + STORY (alliance) | **~120 min** |
| **G7 Leading house of the region** *(capstone → OPENS Phase 2 → T3 stub)* — rivals eclipsed | Estate Service ≥ thr + the Lord names the house first of the region — **opens the T2 Phase-2 grind to the v1 end-gate (§4.8.1b)** | **~125 min** |

**Totals & checks (T2 Phase 1):** **75+110+120+130+140+140+120+125 = 960 min = 16.0 h** ✔ (the Phase-1 FLOOR).
The **Phase-2 deeds** (Estate 42,000 / Arms 21,000 / Office 35,000 / **Name 19,600** ip — §4.2.1) + seasonal
(18,000 / 9,000 / 15,000 / **Name 8,400**, the gated Name 30 % — D-Q3) accrue **after G7** (§4.8.1b), to the
hybrid **good-in-all-4 + Estate/Office great/excellent, Arms & Name good** end-gate, **plus the cross-pillar
combos** (§4.3.1). Tier step Arms 5K→30K (6×), Estate
8K→60K (7.5×), **Office 2K→50K (25× — the locked "win it socially" steepening**, §4.0/§4.1). Season ≈ 120 min
⇒ ~8 seasons span the T2 Phase-1 floor.

### §4.8.4 The v1 budget at a glance (all figures FLOORS)

| Tier | rungs (Phase 1) | per-rung avg | season wall-clock | **Phase-1 FLOOR** | + Phase-2 grind (§4.8.1b) | lock |
|---|---|---|---|---|---|---|
| **T0 Estate** | R0–R7 (8) | ~34 min (grind rungs ≥30) | ~34 min | **≈ 4.5 h** | ~+4.5–5 h | LOCKED FLOOR |
| **T1 Village** | V0–V7 (8) | ~60 min | ~60 min | **≈ 8 h** | ~+12 h | LOCKED FLOOR |
| **T2 Region** | G0–G7 (8) | ~120 min | ~120 min | **≈ 16 h** | ~+20 h *(incl. Name gate, D-Q3)* | LOCKED FLOOR |
| **v1 total (T0–T2)** | 24 | — | — | **≈ 28.5 h (Phase-1 FLOOR sum)** | **+ ~+32–36 h Phase-2 ⇒ ~60 h v1 FLOOR (D-Q1; compounds toward ~65 h with the T2 Name gate + great/excellent, D-Q3)** | LOCKED FLOOR |

**The three single most important invariants now:** (1) **every grind rung ≥ ~30 min** (LOCKED FLOOR) —
enforced as a CI pacing floor: if a headless playthrough clears any rung in < ~28 min the pacing test **fails**
(undershoot); (2) the **budget figures are FLOORS** — the M6 regression **fails on UNDERSHOOT ONLY, never on
overshoot** (FU18), because the two-phase tier (climb + grind) is *meant* to run past its Phase-1 floor; and
(3) the **goal-to-goal ratio ≤ 2–3×** *within* a tier (canon) — the gentle intra-tier growth keeps consecutive
costs soft, while the ~10× tier step (Office ~25×) is the deliberate chapter break. **Levers:** all per-rung
*times / costs / meter-thresholds* and the Phase-2 window minutes are tunable *proposed* numbers, but the
**< 5 s first action**, the **≤2–3× never-balloon rule**, the **≥30-min per-rung FLOOR**, and the
**4.5/8/16-h tier FLOORS** are constraints the tuning must always satisfy (the last two LOCKED by human as
FLOORS, FU18).

---

## §4.9 Levers index (the tuning dashboard) & the LOCKED-constants index + open questions

**Master dials:** `TIER_MAG = 10`, `r_intra = 1.15`, `SEASON_WALLCLOCK_MIN[tier]` (T0≈34 / T1≈60 / T2≈120 — a
binding that *serves* the FLOORs, itself a lever). **Rung-meter — the third curve (§4.1.1):** `RUNG_FLOOR_MIN
= 30` *(a FLOOR — the value is the minimum, not a ceiling)*, each rung's `eligibleActivityRate` + its curated-
activity set + the per-rung thresholds (T0 ~14–19). **Accrual:** **`PER_EVENT_CAP_FRACTION = 0.04`** *(halved
from 0.08; "smaller than 0.08" is LOCKED)*, the **deeds/seasonal split ≈ 70/30** *(deeds-dominate LOCKED; exact
70/30 proposed)*, the **deed-base table** (§4.2.1, every base ≤ its 0.04·good-band cap), **`SEASONAL_SHARE =
0.30`** (the single dial setting the whole seasonal stream), the derived **`JUDGE_K[pillar][tier] =
SEASONAL_SHARE · goodBand`** table, the **`TIER_REF[pillar][tier]`** + **`TIER_REF_NAME = armsGood + estateGood
+ officeGood`** normalizers, the **autumn-basis bump** (~12 %), `f_pillar` exponents (0.5), `DENT_FRACTION =
0.10` + the dent self-heal rate. **HYBRID gate (§4.1):** the **good/great/excellent triple per revealed pillar
per tier** **+ the great/excellent COUNTS** (how many pillars must be great vs excellent); the revealed-pillar
set (T0=2 / T1=3 / T2=4 — Name gated, D-Q3). **Gating:** the hybrid profile **ANDed with** the Phase-1 capstone rung-meter +
story gate, **+ the per-tier hour FLOORS the gates must take to fill**. **Skills:** `XP_BASE = 50`, `XP_GROWTH
= 1.18`, `PER_EVENT_XP_CAP_FRACTION = 0.25`, visibility 30, per-tier soft caps, milestone levels/perks.
**Per-skill perks (§4.5.4):** each perk's `combatBonus` magnitude, the per-skill perk counts (~2–8), the
unlock-level cadence, `PER_PERK_MAX`. **Conversion weights (§4.3):** `0.05·combatLevel`, `0.10·dangerRing`,
`0.04·skillLevel`, `0.04·tradeSkill`, `0.06·officeRank`, `0.15·allianceSealed`, `0.25·Name-blend`.
**Cross-pillar combos (§4.3.1):** which pillar pairs combo, the per-pair magnitude (≤ one cap), the T2 onset.
**Attributes (§4.4):** all coefficients, start = 5, +1 pt / 2 levels, per-tier soft caps. **Character level
(§4.6.5):** `CL_BASE = 60`, `CL_GROWTH = 1.18`, `COMBAT_XP_K = 12`, `MobDef.level` defaults, `hpMax = 40 +
8·characterLevel`, `satietyMax = SATIETY_BASE(100) + SATIETY_PER_LEVEL(4)·characterLevel`. **Combat (§4.6):**
each weapon's `baseSpeed`/`reach`/`targetCount`/signature (§4.6.9), SPD coeff 0.005, `DAMAGE_FLOOR = max(1,
0.10·atk)` *(floored LAST, post crit/block — §4.6.4)*, `CRIT_MULT = 1.5`, `BLOCK_REDUCTION = 0.5`, chance caps
0.50/0.40, `skillBonus = 0.3·weaponSkill`, accuracy base 10, crit base 0.02; the **enemy `MobDef.level →
{attackPower, defense, HP, …}` curve** (§4.6.1d — `MOB_HP_BASE 24`/`MOB_HP_K 8`, `MOB_ATK_BASE 8`/`MOB_ATK_K 3`,
`MOB_DEF_BASE 1`/`MOB_DEF_K 1`, `MOB_ACC 10/+2L`, `MOB_EVA 2/+2L`, `MOB_CRIT 0.05`); the **closed-form
`P_win(MC)`** (§4.6.4b — ANALYTIC, not sampled); the **light active layer** (§4.6.10 — stance mods, `ABILITY_CD`,
item slots); `SATIETY_COMBAT_FLOOR = 0.5` + the 0.7 knee + the attackSpeed-touch weight;
the 4 durability bands (75/50/1/0 → 1.0/0.9/0.75/0.55) + `WEAR_PER_FIGHT ≈ 3 %`; the **win-rate bands**
(§4.6.7) per combat-entry rung; the **retreat clock cost** + the **0-HP forced-rest** loop (§4.6.6b/§4.6.8). **Pacing (§4.8):** all per-rung times /
costs / meter-thresholds + the Phase-2 window minutes (proposed) under the **≥30-min FLOOR + 4.5/8/16-h tier
FLOORS (LOCKED)**. **Producers/costs (§4.7):** gather base yields/ticks + per-rung net throughput, autumn `×3`,
`STAMINA_RATE_FLOOR = 0.5` + the 0.7 knee, the weather `±10 %` band, crafting quality weights (0.4/0.4/0.2,
0–1 score) + `QUALITY_TIERS = 5` + the `SKILL_REF`/`MAX_STATION_TIER` normalisers + `1.25^tier` + 60 %
disassembly + the **T1+ coin sink** (market/component-buying), loot rarity 70/22/6/2 + `0.5 %·LUCK`,
`PRODUCER_GROWTH = 1.5` (T3+),
the **E1 / E2 / E3** costs & floors (§4.7.5).

**LOCKED-constants index (the fixed v1 dial values, for quick reference — all *proposed v1 balance* but
self-consistent):** `TIER_MAG 10` · `r_intra 1.15` · `RUNG_FLOOR_MIN 30` · `PER_EVENT_CAP_FRACTION 0.04` ·
`SEASONAL_SHARE 0.30` · `DENT_FRACTION 0.10` · `XP_BASE 50` · `XP_GROWTH 1.18` · `PER_EVENT_XP_CAP_FRACTION
0.25` · `CL_BASE 60` · `CL_GROWTH 1.18` · `COMBAT_XP_K 12` · `SATIETY_BASE 100` · `SATIETY_PER_LEVEL 4` ·
`SATIETY_COMBAT_FLOOR 0.5` (knee 0.7) · `STAMINA_RATE_FLOOR 0.5` (knee 0.7) · `WEAR_PER_FIGHT 3 %` ·
durability bands `1.0/0.9/0.75/0.55` · `CRIT_MULT 1.5` · `BLOCK_REDUCTION 0.5` · crit/block caps `0.50/0.40` ·
`DAMAGE_FLOOR max(1, 0.10·atk)` (floored LAST, post crit/block) · `hpMax 40 + 8·level` · `QUALITY_TIERS 5` (0–1 score, no divisor) · quality step `1.25^tier` ·
disassembly `0.60` · loot `70/22/6/2` + `0.5 %·LUCK` · weather `±10 %` · autumn paddy `×3` · `PRODUCER_GROWTH
1.5` (T3+) · `SEASON_WALLCLOCK_MIN[T0/T1/T2] 34/60/120` · tier Phase-1 FLOORS `4.5/8/16 h` (v1 Phase-1 `28.5 h`; v1 TOTAL `~60 h` incl. ~+32 h Phase-2).

**LOCKED by human (§I-bal + the V2 Block-L/M signs — shape fixed, not free to invert; only the realising
magnitudes are tunable):** saga length / per-tier hour budget **as FLOORS** (T0 ≥ 4.5 h · T1 ≥ 8 h · T2 ≥ 16 h
· v1 ≥ 28.5 h Phase-1 climb / v1 ≥ ~60 h TOTAL incl. ~+32 h Phase-2; runs longer, FU18/D-Q1) · the **≥30-min per-rung FLOOR** · **first-fight
win-rate 20–35 % at adequate satiety (≥~0.7)** · **soft-setback severity shape** (1 HP + ~½-day + light injury
+ possible carried-loot drop; never levels/gear/Influence) · **deeds-dominate accrual split (~70 % deeds /
~30 % seasonal)** · **deed-jump size smaller than the old 0.08 cap** · **no respec in v1** · the **HYBRID
good/great/excellent tier-gate** (breadth floor + no overflow) · the **THREE clean combat tracks** (character
level / Arms pillar / Combat Rank meter — never reconflated) · the **SEQUENTIAL two-phase model** (rungs →
pillar grind; deeds Phase-2-only) · **graded durability bands, never auto-unequip / never weaponless** ·
**satiety throttles combat** (floor never below ~15 % win-rate).

**HARD INVARIANTS (canon — NOT levers):** trade ≤⅓ of Estate & Wealth (post-combo-clamp, §4.2.3/§4.3.1); the
**HYBRID good/great/excellent gate — good in ALL revealed pillars (breadth floor) · great in 2–3 · excellent
in 1–2, NO overflow/substitution** *(REPLACES the old "simple per-tier thresholds, no floor/overflow", Q7/
FU10/D-028)*; accrual = achievement jumps + seasonal-judged-on-high-water-mark only (no time-trickle, no flat
per-action), **PHASE-2 only** (deeds don't accrue on the rungs; FU7); up-only with minor recoverable per-pillar
dents (never a wipe, never touches `highWater`); the **bounded per-skill combat-perk channel**
(`skillCombatBonus`, ~2–8 small perks/skill, no hard global cap — conditioning stays the **ZERO-stat
enablement gate**) *(RELAXES the old "no labour→combat cross-feed", Q6/FU8/D-027)*; auto-producers **T3+ only &
ACTIVE-ONLY (no offline)**; combat first-class & EARLY (T0-R3); **one combat-fed character level** (never
raised by labour or deeds); mediocre-start (start near-zero, grind-only); K/M/B display; macron romanization.

**RESOLVED — now LOCKED (do NOT re-open):** all of the above + the full **Block L (Q1–Q56)** + **Block M
(FU1–FU23)** signs (2026-06-26), **D-022 governing (most-recent-block-wins; annotate-don't-delete)**. The
budget is now a **FLOOR** (FU18 supersedes the old "ceiling/target" reading of D-016); the hybrid gate
supersedes the simple thresholds (D-028); the bounded perks relax the cross-feed wall (D-027); the three
clean tracks de-conflate the old fused "Combat Deeds pool" (D-025). **These are settled.**

**Open questions (PROVISIONAL per D-021 — tune at M6 against playtest, the §4 magnitudes only):** the Phase-2
window minutes (§4.8.1b) and the great/excellent **counts** (§4.1); the per-skill perk magnitudes &
`PER_PERK_MAX` (§4.5.4); the `MobDef.level` defaults & win-rate-band magnitudes (§4.6.7); the cross-pillar
combo pairs & per-pair magnitude (§4.3.1); the **E3** cost & staging (§4.7.5); the deferred **coin/market**
numbers (M4 — §4.7.2/§2.4); the `SEASON_WALLCLOCK_MIN` binding. **None of these touch the LOCKED shapes
above** — they are the liquid plan-layer (D-021), re-planned after each playtest; the FLOORS, the gate shape,
the three tracks, and the accrual invariants are the frozen intent.

---
# §5 — Act-by-Act Narrative & Content

> **STATUS: PRD V2.** This section is reshaped from the human-signed **Block L (Q1–Q56)** and **Block M (FU1–FU23)**
> (2026-06-26), governed by **ADR D-022 (newest-block-wins; annotate-don't-delete)**. §5 owns only the **story
> shape** of each tier; the curves/thresholds it defers to are §3 (reveal cadence) and §4 (numbers). The V2 deltas
> applied here: the **sequential two-phase per-tier narration** (climb the rungs in Phase 1 → the
> estate-influence/pillar grind in Phase 2, with pillar DEEDS gated to Phase 2; FU7/§1.6.4/§4.0.1); the **hybrid
> good/great/excellent tier-gate** in narrative terms (Q7/FU10); **INCREMENTAL combat** surfaced one beat at a time
> (one starter weapon → a growing roster; Q15/FU12/FU13); the **Otsuru/Tama TRUTH spine-guaranteed at G6** vs the
> **OPTIONAL, MISSABLE Origin-O5 Tahei name-reclaim** + a **conditional epilogue** (Q5); **E2→E3 Prosperous**
> authored in v1 (Q8); the **castle-town / Daikan first-contact** T3 stub (Q24); **one co-located weir-jizō
> find-spot** + the "presumed-dead → back-from-the-dead" framing (Q11); a **Naoyuki rivalry→respect** beat (Q26);
> **no fixed quest-type budget** (Q23); and the period-name fictionalisation sweep (Mago→**Heita**,
> Obaa Sato→**Obaa Kuni**, Naozane→**Mosuke**, Toyama→**Hayami**, Konoe→**Mukai**, Munenori→**Shigemasa**,
> Jūbei→**Kihei**, Ranpo→**Sōan**; Q11/Q39/Q27 / Block N.1 #3 — lint-guarded by
> the §6.6 real-name denylist), with **Nihonbashi** allow-listed (Q12). Combat-track / pillar / gate mechanics are
> §2/§4's job; §5 keeps only the diegetic beats.

# T0 — Estate (tutorial; v1 full)

## T0.1 Overview

**Theme:** *earn your keep and a place at the table.* One declining hill estate — the Kurosawa *gōshi* house in
Asagiri valley — unlocked room by room. A half-drowned, nameless young man (~18–20), pulled from the weir out of
plain kindness, becomes "another mouth," then a reliable hand, then a hand who can fight. The tier is the
mediocre-start contract made playable: he is weak and slow, the first hoe blisters him, and the **first real
fight is humbling and near-fatal.**

> **Progression shape (binding) — climb the rungs (Phase 1), then the estate-influence grind (Phase 2)**
> (FU7; §1.6.4/§4.0.1). Every tier is the **same two-phase motion**: **Phase 1** climbs the estate rungs via
> **curated, story-consistent per-rung activities** that fill the **rung-meter**, AND-gated with the rung's
> **story milestones**; **Phase 2** opens **only after the final (capstone) rung** and is the
> **estate-influence / four-pillar grind**. The tier's **pillar DEEDS accrue in Phase 2 and only there** (never
> across the rung climb — this blocks the "half the rungs, maxed deeds" exploit), and clearing the **hybrid
> pillar profile** is what tiers up. §5 fixes the *story* of this motion; the rung-meter curve, the curated
> per-rung activity sets, and the gate thresholds are §3/§4's job.

**Transition gate (T0→T1) — the two-phase shape (FU7).** **Phase 1** — climb the estate rungs **R0→R7** on the
**curated per-rung activities + the rung-meter + the story milestones** (an AND-gate; §4.1.1): survive the
humbling first fight, earn a place on the books, stand the first watch, drive the repairs. **Phase 2** — the
**capstone (bailiff) rung OPENS the estate-influence / four-pillar grind**, where the tier's **pillar DEEDS
accrue** (the first *shinden* recorded, the debt tranches, the grain-store defends). Tier-up is the **HYBRID
tier-gate** across T0's **two revealed pillars** — the **2-pillar special case** (Q7/FU10): **good in BOTH Arms +
Estate, and excellent in exactly ONE**, with **NO overflow** (a surplus in one pillar can never cover a deficit in
the other). Diegetically: the humbling first fight survived; the first *shinden* recorded; the kura solvent enough
that the immediate fires are out → the estate trusts him to carry its business down into the village.
**Estate stage span:** E0 Foreclosure's Edge → E1 Stabilising (cross-ref §1.5.1).

**Felt arc:** cold-open helplessness (one verb, a near-bare screen) → the dignity of honest labour → the shock
of the first fight → the relief of being *named* on the household books. Combat is **live this tier**, but it is
**INCREMENTAL** like everything else (Q15/FU12/FU13): its UI and systems surface **one beat at a time**, never an
all-at-once dump — the **starter weapon + the bare auto-resolve loop + retreat + the Bestiary** arrive at the
first-fight beat (R3), while the **graded durability bands** (R4, with the loot→craft loop), the **stance slot**
(R5), and the **ability + item slots** (the first weapon-line **L10** milestone) **stagger in later** (§3 owns the
cadence). Daily texture stays **peaceful-labour dominant** by volume.

## T0.2 Main-quest beats (toward the T0→T1 gate)

1. **The Weir (cold open).** Wake feverish on a pallet in the **kura** storehouse, head bandaged. One verb, a
   persistent event log, a body/rest bar and a rice counter. Physician **Sōan** names the injury plainly —
   "head's been knocked, lad; you near drowned" — grounding the amnesia as ordinary trauma, **no visions.**
   *(He keeps language and labourer's body-habits; he has lost his autobiographical past.)* **[THREAD: Origin]**
   first dream-fragment seeded here: a half-drowning, a voice in the water calling a name he can't hold (a real
   person recalled, never a spirit) — the clue carries **no stat gift** (an identity beat per §1.4/§1.5.3,
   distinct from the later-opening, optional T2 Origin accelerant).
2. **The spilled rice.** Chief Steward **Genemon** — dry, overworked — sets the first task: rake and recover
   spilled rice from the cracked kura floor. "Another mouth, soft and clumsy." Completing it earns a
   sleeping-place and the first real labour loop (paddies, dry fields, the *koku* heartbeat).
3. **A season of honest work.** Sustained, reliable labour (farming → foraging → woodcutting → hauling) across
   a season earns a place on the household's books (bonded hand). The **porter's-knot beat** surfaces while
   hauling — he ties a load-knot on instinct; a groom grunts "huh, you've hauled before." **[THREAD: Origin]**
   identity clue — **no stat gift from the clue** (distinct from the optional T2 Origin accelerant).
4. **The wolf at the grain store (the humbling first fight).** A wolf gets into the grain store; cornered, he
   grabs a carrying-pole, lands at most **one lucky blow**, is thrashed — disarmed, ribs cracked, left in the
   dirt — surviving **only** by luck and sheer stubbornness, **never by skill** — and **never rescued**: he lives through it on his own. The shame of
   limping home to confess drives him to beg Kihei for drills. *(Off-screen restraint on the injury; the
   *lesson* is on-screen, the gore is not.)*
5. **Begging for drills.** Kihei's creed, stated here and paid off at the finale: *"Talent is a story the lucky
   tell. You are not lucky. So you will work."* This opens **only** the drill yard, the **Combat panel**, the
   **first real starter weapon** (a **spear / *yari***, per FU13 — the single weapon T0 begins with), **Equipment
   & Inventory**, the **Bestiary**, and the **bare auto-resolve loop + retreat** (character (combat) **level**
   begins, fed by combat-XP). Combat stats start near-zero. The rest of the combat surface **staggers in later,
   one beat at a time** (no UI-dump): the **graded durability bands** at R4 (with the loot→craft / Crafting loop),
   the **stance slot** at R5, and the **ability + item slots** at the first weapon-line **L10** milestone. T0 then
   grows the roster by **+2 weapons** across the tier (it starts with this one; FU13 — the full roster/params live
   in §2/§4).
6. **Earning the house's trust (indoor + the heir).** Win **Lady Chiyo's** regard for indoor work and heir
   **Naoyuki's** grudging vouching via authored trust beats (return a mislaid ledger; help hold the grain
   store). The promotion is earned on **honesty + competence + the house's need** for a trustworthy indoor
   hand — *not* on identity. **[THREAD: Tama — seed only]** to the house he is simply a proven hand; **no one
   speaks the name "Tama"** yet. This plain baseline becomes the counterweight once the village names him at
   **T1-V0** (where the allegiance tension actually goes live).
7. **The first standing watch.** Stand a real gate-watch; clear the first pest/animal threats. These **curated
   martial activities advance your Combat Rank** (the **martial rung-meter**, Phase 1; *renamed from "Combat
   Standing"*, Q9), and your **character (combat) level** grows from the **kills** (combat-XP) — but the **Arms
   PILLAR deeds** (the House-Influence economy) do **NOT** accrue yet: they open only in the Phase-2 estate-grind
   after the capstone (FU7/FU14 — the three tracks stay clean: kills→level, curated rung activity→Combat Rank,
   recognised deed→Arms). The watch's worth is felt diegetically — "the gate held" — and is formally **recorded
   at the foreman step** (beat 8: "the gate held, and the books say so").
8. **Basic repairs, the capstone & the Phase-2 grind (the gate).** Drive the kura repair and complete the rung
   climb; the **capstone (bailiff) rung OPENS Phase 2** — the four-pillar **estate-influence grind** — and the
   **four-bar House Influence panel becomes visible** (showing the two **revealed** pillars: **Arms + Estate**).
   In Phase 2 the **pillar DEEDS now accrue**: the first *shinden* reclamation recorded (Estate/LAND), the debt
   tranches cleared (Estate/TREASURY), the grain-store defends and road-clears (Arms) — and the
   **first combat-earned Arms standing is recorded** ("the gate held, and the books say so"). Clearing T0's
   **hybrid 2-pillar profile** (good in **both** Arms + Estate + excellent in **one**) edges the house off the
   foreclosure cliff; Genemon, grudging, entrusts him with **errands beyond the estate** — the village tier opens.
   **Gate met.**

> **Succession seed (early).** Lord **Shigemasa**'s weariness and Naoyuki's restless coasting are planted in T0
> dialogue so the generational arc (Shigemasa's decline → Naoyuki coming into his own) reads as earned when it
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
  emotional payload, **no antagonist.** *(The Peaceful/Assertive choices are authored as **intra-line dialogue
  choices** — `choices[]`/`ChoiceId` in `content/dialogue.ts`; data, not scripting; deterministic; only
  chosen-flags persist; Q34/FU22. The data shape is §2/§6's job; §5 names only the routes.)*
- **[MOTIF: rigged box] — explicitly ABSENT.** Per canon, the racket has **no fingerprints on T0.** Sadamune's
  embankment is the house's own misfortune; no quota machine touches the estate's decline.

## T0.4 Estate roster & buildings growing (E0 → E1)

**Roster present at the open (E0, all first-appear T0; cross-ref §1.8):** Lord **Shigemasa**, heir
**Naoyuki**, Lady **Chiyo**, Dowager **Toku**, Chief Steward **Genemon**, clerk **Tanomo**, drillmaster
**Kihei**, groom **Sota** & field-lad **Heita**, head maidservant **Oai**, cook **Kyūsuke**, physician
**Sōan**. *(The teen field-lad is **Heita** — renamed off the antagonist **Magobei** collision and the
porter's-knot homophone; Q11/Q39. The porter's-knot beat is delivered by the groom **Sota**.)*

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
- **Kihei** — the mentor; the creed (above). Beat: refusing to coddle after the humbling fight; drilling the
  basics until they hold.
- **Naoyuki** — the in-house **rival** (talent-foil, *converted not innate*). Voice: bored brilliance, chafing
  at genteel poverty. Beat: grudging vouch in T0 that plants the rivalry → respect → brotherhood arc (the
  earned **grudging-respect bridge** fires in T1.2; the ally-flip pays off at G5/T2.3).
- **Dowager Toku** — backstory keeper. Beat: her first memory of the fall (Sadamune) — "no shortcuts; he
  thought he'd bought one."
- **Sōan** — the rational, kami-disbelieving voice; grounds the amnesia.
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
**There is NO fixed quest-type budget (Q23)** — author whatever quests fit each stage; the handful below is just
T0's *starting* set, and more and more-interesting quests are welcome, especially at later tiers (none gate the
spine).

- **The spilled-rice recovery** — the first task, doubling as the side-content tutorial.
- **The porter's-knot beat** — "you've hauled before." **[THREAD: Origin]** — **no stat gift from the clue**
  (identity flavour only; distinct from the optional T2 Origin accelerant).
- **First dream fragment** — the half-drowning / the voice in the water. **[THREAD: Origin]**, guaranteed-cadence
  seed; **no stat gift from the clue.**
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

> **Progression shape (binding) — climb the rungs (Phase 1), then the estate-influence grind (Phase 2)**
> (FU7; §1.6.4/§4.0.1). T1 repeats the two-phase motion on a fresh ladder: **Phase 1** climbs **V0→V7** on the
> **curated per-rung activities + the rung-meter + story** (AND-gate); **Phase 2** opens **only after V7** as the
> **estate-influence / four-pillar grind**, where the tier's **pillar DEEDS accrue** (never across the rung
> climb). Clearing T1's **hybrid pillar profile** tiers up to T2.

**Two parallel tracks:** the **estate ladder is the spine** (its milestones gate T2). Running alongside it is the
**village reputation web** — a *second, parallel reputation* (how the villagers *personally* regard you; per-shop
meters, the headman's personal regard, the inn/rumours social web, the Tama-vs-farmhand allegiance) that is
**fully completable** and an **optional accelerant** (~10–15% faster to T2), but **NEVER gates the spine**
(§1.5.4, §2.15). The inn's **rumours board** begins delivering optional light folklore on the side-track.

**Transition gate (T1→T2) — the two-phase shape (FU7).** **Phase 1** — climb **V0→V7** (*"clean your room"*):
estate healthy, **valley anchored under the house**, immediate fires out → Lord **Shigemasa** first believes the
house's impact *beyond* the estate is possible. **Phase 2** — the **capstone (V7) rung OPENS the
estate-influence / four-pillar grind**, where the tier's **pillar DEEDS accrue**, driving the house's **regional
influence** quest (the domain expands again, to the Region; the region will introduce **rival samurai houses**
with more sway to surpass). Tier-up is the **HYBRID tier-gate** across T1's **three revealed pillars** —
**good in ALL three** (Arms + Estate + **Office**), **great in 2–3**, **excellent in 1–2**, **no overflow**
(Q7/FU10). Diegetically: errand-authority earned; office in valley affairs held; cash-crops online.
**Estate stage span:** E1 Stabilising → E2 Recovering.

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
   estate's near-ground. These **curated clears advance Combat Rank** (the rung-meter, Phase 1) and feed the
   **character (combat) level** via kills; the **Arms PILLAR deeds** are reserved for the Phase-2 estate-grind
   (FU14/FU7). The inn & rumours board unlock (folklore begins, optional side-track).
3. **Securing the house's roads (V2, road-warden).** Make a stretch of valley road or the ford safe **in the
   estate's name** against bandits/animals; survive a real clear. The house's writ now reaches the roads;
   the road-clears **advance Combat Rank** (rung-meter) and the **character level** via kills — combat-earned at
   valley scale — while the **Arms PILLAR** standing those clears will later be *recognised* opens only in the
   Phase-2 grind (FU14/FU7).
4. **Running the valley economy for the house (V3).** Bring the valley economy and the estate's cash-crops to a
   recorded seasonal result — the **silk / sericulture *meibutsu*** sub-engine begins under weaver **Onatsu**
   (LOCKED; trade hard-capped ≤⅓ of Estate & Wealth; the **trade strand opens here at T1**, never T0). Broker
   meters appear. The estate's domain now reaches the valley's livelihood.
5. **Trusted of the headman (V4) — the skim surfaces.** Put a valley fire out on the estate's behalf: **Foreman
   Magobei's** rice-skim surfaces here (the T1 antagonist; see T1.3). The house earns its **first Office
   standing** (the **Office pillar reveals at T1**); Yagōemon's *personal* regard rises on the side-track.
6. **Sworn man-at-arms of the house (V5).** Stand a real watch for the valley **in the house's name**; survive
   the first dangerous-road encounter; the first paid martial outsiders (**Gohei & Yatarō**) join as flavour
   retinue (E2). The estate becomes the valley's shield.
6a. **Shoulder to shoulder with Naoyuki (rivalry → grudging respect). [THREAD: Naoyuki]** A shared danger —
   a valley fire to beat back, or a road to hold — throws the MC and heir **Naoyuki** into the same fight;
   Naoyuki, who in T0 only *vouched* for him grudgingly, fights **beside** him and, after, **grudgingly
   acknowledges** him as a man worth standing next to. One low-cost interstitial beat that **bridges the T0
   rivalry seed and the G5 rival→ally flip** (T2.3) so the conversion reads as **earned**, not abrupt (Q26).
7. **Right-hand-in-waiting (V6) — agent over the valley.** The lord first believes the house's impact beyond the
   estate is possible; "clean your room" nearly done; the alliance/standing levers that point the house at the
   region appear.
8. **Agent of the house, the valley anchored (V7) — the capstone & the Phase-2 grind (the gate).** Estate
   healthy, valley anchored under the house, immediate fires out — the capstone "clean your room" beat; standing
   now **TRUSTED**. The **V7 capstone OPENS Phase 2** — the four-pillar grind across the **three revealed
   pillars** (Arms + Estate + Office) — where the tier's **pillar DEEDS accrue**; clearing T1's **hybrid profile**
   (good in all three; great in 2–3; excellent in 1–2) opens the **region** map and the **T1→T2** quest (the
   domain expands again, to the Region); rival samurai houses appear on the horizon. **Gate met.**

> **Allegiance, live this tier. [THREAD: Tama]** The continuous Tama-vs-farmhand leaning (canon §C, §1.5.4) is
> nudged through dialogue and where the MC invests labour. Leaning "I am Tama" warms the village (faster rep,
> grief-coded content, Bon rites) at slight friction with the estate; leaning "just a farmhand" smooths estate
> trust at the cost of village warmth and Tama-only lore. **Rebalances rates & flavour, never availability** —
> both factions stay fully completable on either lean; neutral is valid. *(The leaning and the multi-route
> antagonist choices in **T0.3 / T1.3 / T2.3** (Peaceful / Assertive / Partial) are authored as **intra-line
> dialogue choices** — `choices[]`/`ChoiceId`, `content/dialogue.ts`; data, not scripting; deterministic; only
> chosen-flags persist; Q34/FU22. §5 names the leans; the data shape is §2/§6's job.)*

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
  crediting **the Kurosawa's hand** again — the visible mending of a house back on its feet.

> **Village cast stays static (binding).** Estate growth pulls *seconded/recruited* faces (Risuke's apprentice,
> the men-at-arms); the village's own reputation-web cast does **not** balloon.

## T1.5 Key NPC & dialogue beats

**Estate (cross-ref §1.8):**
- **Naoyuki** (heir; estate-side) — the in-house rival begins his **rivalry → grudging respect** turn this tier
  (the interstitial beat in T1.2/6a): fighting a shared danger beside the MC, he acknowledges him for the first
  time — the earned bridge from the T0 vouch to the **G5 ally-flip** against Tomita (Q26). **[THREAD: Naoyuki]**

**Village (static reputation web; cross-ref §1.8):**
- **Sayo** (headman's daughter, ~16) — the legend's heart; names him "Tama," tutorialises the village/trade
  loop. **[THREAD: Tama]** the person the truth will most hurt and most free (her own family's complicity in
  the old rice debt). Voice: sharp, kind, hopeful.
- **Headman Yagōemon** — warm civic quest-giver up front; **also** a reachable culprit (his ledgers cover
  Magobei). Never a monster — a frightened middle-man who chose his own neck.
- **Obaa Kuni** (herbalist / wise-woman) — the village's **folklore-keeper**; narrates the *kamikakushi* legend
  sympathetically *while knowing it is coping.* Teaches foraging/village-craft. *(Renamed off the **Sayo**
  near-rhyme; Q39.)*
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
- **The Market / Shop Row** — Gonta's forge; Obaa Kuni's herb stall; Tokuemon's brewery; Onatsu's silk.
- **The Chief's House** — Yagōemon's receiving room; the village ledgers (the doctored-ledger thread).
- **The Inn & Rumours Board** — Sukezō's inn; the optional-folklore hub.
- **The Shrine / Temple** — Ryōa's register of the vanished; the Bon offering site.
- **The Jizō at the Weir** — the boundary *jizō* **at the weir where he was found** — **the single find-spot**
  (Q11): the one place "where he was pulled from the river." It is also the **ONE** capped residual-ambiguity
  beat (an offering left by an unidentified hand — lingers unresolved, off-screen, mundane-readable).
- **The River, Ford & Weir** (shared wilderness) — the "kappa" spot; fishing. *(The find-spot — the **jizō at
  the weir** — is its own row above; "where he was found" is now a **single co-located place**, and the lone
  residual-ambiguity beat is co-located there; Q11.)*
- **The Foothills & Charcoal Grounds** (shared wilderness, deeper conditioning) — the hidden charcoal kiln
  ("fox-fire"); hunting trails; the second danger ring.

**Mob roster (grounded; completes the v1 ~5-mob set; conditioning-gated):**

| Mob | Type | Where | Role |
|---|---|---|---|
| **Giant hornets (*suzumebachi*) nest** | insect | woodlot edge / satoyama | Swarm/AoE threat near foraging & charcoal work; a CLEAR-the-nest beat; tests conditioning (status: stings). |
| **Wolves (*ōkami*) pack** | animal | foothills & charcoal grounds | First fight that punishes a lone, under-geared player; drives the need for a detail or better gear. HUNT/escort threat. |
| **Bandits / starving deserters (*nobushi*)** | human | valley roads / bandit lean-to | First **human** threat; the road-security core. Mixed motives (organised toll-takers vs desperate deserters) make CLEAR/CAPTURE choices matter. Drop worn weapons (FOUND gear) + coin; clearing them earns recorded Influence. |

*(A rogue bear is available as an optional HUNT quarry; see §T1.7.)*

> **FOUND-gear & the growing roster (FU13/Q15).** The valley's human threats drop **worn FOUND gear** that feeds
> the loot→craft loop; this is also how the **growing weapon roster** surfaces diegetically — T1 grows the roster
> **+3** and opens a new weapon **LINE** (a **sword**), with worn blades (a *kodachi*, a fitted *yari*) found and
> refitted rather than gifted. §5 keeps only the FOUND-gear flavour; the full roster/archetype params live in
> §2/§4 and the reveal cadence in §3.

## T1.7 Open-ended side-quests (T1)

All optional; none gate the spine. **There is NO fixed quest-type budget (Q23)** — the **PEST-CONTROL / HUNT /
CLEAR / DEFEND** set is just T0–T1's *starting* set, not a cap; author whatever quests fit each stage, with
more and more-interesting quests welcome, especially at later tiers. **Inn-rumour folklore unlocks organically**
(more rumours appear as the estate & village grow — never an all-at-once dump). Each folk belief is introduced as
genuine village dread, investigated through ordinary work, and resolved one-to-one to a human/natural cause,
**lingering in the unease** before resolving.

- **The inn rumours-board opener — the "kappa" of the ford.** **[FOLKLORE → cause]** an undertow + an undercut
  bank (and, later, the smugglers' weighted-net sinking-spot). Resolves to grounded cause; the river stays
  uneasy.
- **Magobei's skim — the "tanuki."** **[FOLKLORE → cause]** = the skimming foreman (ties into T1.3).
- **A per-family goodwill help** — you hear a family has trouble and figure out how to help (open-ended, never a
  checklist).
- **Priest Ryōa's register entry** — log a vanished traveller; a quiet lost-child clue. **[THREAD: Tama]**
- **The weir-jizō offering** — the **one residual-ambiguity beat** (an offering by an unknown hand, left at the
  co-located **jizō at the weir** find-spot). It is *not* resolved; it is the single capped token (canon §1.13).
- **The rogue bear (HUNT).** A bear raids the charcoal-burners' grounds; track it by sign; return hide + gall.
  Optional, lore-light.
- **The "fox-fire" ridge (seed).** **[FOLKLORE → cause]** first *rumour* of ghost-lights on the ridge; the full
  INVESTIGATE-then-confront (a hidden charcoal kiln) resolves at **T2** when conditioning lets the MC range
  there.
- **A weaver's missing dye-lot (open-ended help).** Onatsu's silk run comes up short a bolt; figure out where it
  went (a careless porter, a flooded path, or a small theft) — a low-stakes economy errand that warms the
  *meibutsu* sub-engine without gating it. *(Representative addition per Q23; concrete set fleshed out in build.)*
- **The night-heron of the paddies (rumour).** **[FOLKLORE → cause]** a "ghost-bird" haunting the flooded
  fields = an ordinary heron; a one-shot INVESTIGATE that pays a little foraging lore. *(Representative addition
  per Q23.)*

> **Belief→cause table (T0–T1 region; binding before authoring any new omen).** Every belief resolves one-to-one
> to a grounded cause; **exactly one** token is left ambiguous (the weir-jizō offering).
>
> | Folk-belief | Grounded cause | Where / when |
> |---|---|---|
> | **Kamikakushi** (master lie) | A landslide victim swept into the river (Tahei); a child who *ran* (Tama/Otsuru); negligence dressed as fate (Kuzuhara) | spans T0→T2 |
> | Weir/ford **kappa** | Undertow + undercut bank; later a poacher's weighted nets / smugglers' sinking-spot | T1 ford |
> | **Tanuki** stealing rice | Magobei's skim | T1 village |
> | **Fox-fire** on the ridge | A charcoal-burner's hidden kiln | seeded T1, resolved T2 |
> | Yearly **soul-calling rite** | Grief-work that nonetheless yields hard evidence (Ryōa's register) | T1 shrine |
> | The unidentified-hand **weir-jizō offering** | *(left ambiguous — the ONE capped token)* | T1 weir-jizō find-spot |

---

# T2 — Region (v1 full; the personal-mystery payoff lands here)

## T2.1 Overview

**Theme:** *the estate's domain expands to lead a region.* The HOUSE rises — a third fresh **estate rank
ladder** is minted (`G0→G7`, region-scale, ~8 rungs; see T2.2) on which the Kurosawa's standing climbs
**trusted → HONORARY MEMBER of the house** and its domain expands again, now spanning **estate + village +
region**: a cluster of valleys, the post-town **Sawatari-juku** (the origin-reunion hub), the down-valley
river-crossing market town **Yanagi-watari** (where the grown Otsuru is found), the upstream **Kuzuhara** ruins,
the roads and *sekisho* checkpoints. The region's **two incumbent rival samurai houses, Tomita & Akagi**, are the contest the
house must surpass (**G7 "leading house of the region" = the rivals dethroned**). **This is where both personal
threads PAY OFF** (canon §F) — but on **two different rails** (Q5): the **lost-child TRUTH (Otsuru)** resolves on
the **SPINE at G6, guaranteed for every player**; the **origin / family reunions (incl. father Jinpachi)** and the
**Tahei name-reclaim** land on the **OPTIONAL, MISSABLE Origin one-tier reputation side-track** (`O0→O5`, §3.6.2),
which **opens at G2** (doubly-earned: the dream has returned enough memory, and standing now lets the MC travel
the controlled *kaidō*) as a fully-completable accelerant that **never gates the spine** — a player who skips it
still resolves the Otsuru truth and may finish the game without ever reclaiming the name.

> **Progression shape (binding) — climb the rungs (Phase 1), then the estate-influence grind (Phase 2)**
> (FU7; §1.6.4/§4.0.1). T2 repeats the two-phase motion: **Phase 1** climbs **G0→G7** on the **curated per-rung
> activities + the rung-meter + story** (AND-gate); **Phase 2** opens **only after G7** as the
> **estate-influence / four-pillar grind**, where the tier's **pillar DEEDS accrue** (never across the rung
> climb). Clearing T2's **hybrid pillar profile** tiers up to T3.

**Transition gate (T2→T3) — the two-phase shape (FU7).** **Phase 1** — climb **G0→G7**: *win the region* (the
rival houses are no longer the leaders). **Phase 2** — the **G7 capstone OPENS the estate-influence / four-pillar
grind**, where the tier's **pillar DEEDS accrue**, and clearing T2's **HYBRID tier-gate** across the **revealed
pillars** (4 — Estate + Office + Arms, with **Name** surfacing this tier) — **good in ALL revealed pillars**,
**great in 2–3**, **excellent in 1–2**, **no overflow** (Q7/FU10) — makes the castle-town rulers **confer regional
leadership** on the house and **invite** it in. Diegetically the profile leans **Estate + Office** ("win it
socially"), with Arms securing the roads. **Estate stage span:** E2 Recovering → **E3 Prosperous** (regional
reach; estate fabric runs *ahead* of top personal rank, gated on pillars + a low rank floor, never the capstone).

**Felt arc:** the canvas becomes a region; the MC's *own past* finally opens (the warmest and most costly of the
**side-thread** payoffs — a **side thread**, **not** the spine's climax; the Otsuru truth and the origin
threads pay off *here* but the spine's climax is the house's POWER rise, §1.4); the house out-competes
older/richer rivals; the spine's personal questions are answered — **grounded and partial** — clearing the deck
so T3/T4 carry the house's power rise alone.

## T2.2 Main-quest beats (toward the T2→T3 gate)

The region estate-ladder shape (LOCKED at §1.5.1; exact rung copy detailed in §3.6): the house's
**valley-envoy → road-captain of the cluster → broker of the post-town trade → arbiter between valleys →
recognised regional retainer → captain of the road-security detail → alliance-broker → leading house of the
region** (the rivals dethroned). Every rung stays in the **theme of the house** — you act FOR THE ESTATE across
estate + village + region, and the **house** confers each rank while the region's figures (the *toiya*, the
neighbouring headmen, **Tomita & Akagi**) acknowledge, contend, and finally cede (§3.6.1). **Phase 1** climbs
these rungs on curated per-rung activities + the rung-meter + story; the tier's **pillar DEEDS are gated to
Phase 2** (post-G7; FU7). Labour and combat interleave throughout — combat clears advance **Combat Rank** (the
rung-meter) and the **character level** via kills, while the **Arms PILLAR** opens only in the Phase-2 grind. The
**Origin one-tier rep side-track** (`O0→O5`, §3.6.2) runs alongside this spine as an optional accelerant (it never
gates).

1. **Out into the region (valley-envoy).** The estate sends the MC to broker its surplus beyond Asagiri. The
   **trade backbone** opens minimally: friend **Kanta** runs the estate's first consignment off the books as a
   favour (one route, one porter, one verb). **[THREAD: Origin]** first origin contact made.
2. **The road and the pass (road-captain).** Secure the cluster's roads; the first *sekisho* turn-back (obtain a
   pass) makes travel-standing felt. Rumours of the **"one-eyed mountain god"** of the pass surface (= **Hanzaki**
   + fog-blind terrain; see T2.3).
3. **The post-town opens (broker of the post-town trade). [THREAD: Origin] — the faction opens.** Once the
   dream-gate + travel-standing align, **Sawatari-juku** opens. The **toiya** transport office registers the
   estate's mon; the regional broker runway begins. The **origin reunions** start here (see T2.5).
   *(**G2 name-softening (Block N.1 #4):** the **spine-guaranteed** G2 event-log line must **not** speak the
   true name — *a name almost comes, then slips away* ("…a name catches at the back of his throat and is
   gone") — so the **missable O5 name-reclaim** of "Tahei" stays gated to the optional Origin track. The
   old-woman *"Tahei…?"* recognition belongs to the **Origin O0 opener** (which only fires for a player who walks
   the track), **not** the spine line. The **G6 Otsuru/Tama TRUTH still fires for everyone** regardless.)*
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
7. **The lost-child truth resolves (alliance-broker, G6). [THREAD: Tama] — SPINE PAYOFF (guaranteed).** Tracking
   threads **down-valley** leads to the living, grown **Otsuru** (the real Tama) in the river-crossing market
   town of **Yanagi-watari** — a **different T2 locale** from the origin-reunion hub Sawatari-juku, so the two
   personal threads land in separate places (D-Q-otsuru-locale). **The truth:** Tama was a **girl**
   (the legend's gender-drift is the fair clue) who **ran** from a violent stepfather and a near-sale into service
   to clear a debt; she has been alive in Yanagi-watari the whole decade, too ashamed to return. **The MC is not
   her.** Resolution is grounded and **partial** — she may not forgive; she is freed to *choose.* **This Otsuru
   truth is SPINE-GUARANTEED at G6 for every player** (Q5/§1.4). **[THREAD: Origin]** runs *alongside* this span
   as the **OPTIONAL, MISSABLE** Origin side-track (`O0→O5`): a player who walks it completes the reunions and
   reclaims his **true name — Tahei — at the Origin O5 capstone**, but that is the **Origin payoff, NOT a spine
   beat** — a player who skips Origin still resolves the Otsuru truth here and may finish the game **without ever
   reclaiming the name** (the guaranteed "Tahei claims his true name" line of the old draft is **removed from the
   spine**; Q5/D-036).
8. **Leading house of the region (the capstone & the Phase-2 grind — the gate).** The rivals are no longer the
   leaders. The **G7 capstone OPENS Phase 2** — the four-pillar grind across the **revealed pillars** — and
   clearing T2's **hybrid profile** makes the castle-town rulers confer regional leadership and invite the house
   in. **Gate met.**

> **Origin track & the missable name-reclaim (binding note — Q5/Q12; one place).** The Q5 climax structure,
> locked: **(1)** the **Otsuru/Tama TRUTH** (the MC is *not* her; the real Tama is **Otsuru**, alive in the
> post-town) is **SPINE-GUARANTEED at G6 for every player** — it is a main-quest payoff, not gated by any
> side-track. **(2)** The **Origin reunions** (Oyuki, Okimi, Denbei, Kanta, Osen, father **Jinpachi**) and the
> **Tahei name-reclaim** are the **OPTIONAL, MISSABLE** Origin one-tier side-track (`O0→O5`, §3.6.2): fully
> completable, an **accelerant**, but a player may finish the game without it. **(3)** The Origin track's payoff
> is **support, not power** — a present-day **morale / skill-XP buff** + **origin trade-ties** worth **~10–15%**
> off time-to-next-tier (§1.5.4/§2.15) — and these are **earned new present-day relationships**, **NOT** a
> retroactive gift from remembering. **(4)** The epilogue's "a true name — Tahei" element is therefore
> **CONDITIONAL** on completing Origin O5 (see T4.5).

> **The dream rule (binding) at payoff — Q12 rescope.** The returning **memory / backstory reveal** grants
> **narrative ACCESS only** — new nodes/allies/quests unlock — and **no retroactive stat/recipe/tool/combat
> gift** *from the reveal itself*. This scopes to the **reveal**, **not** the track: the optional Origin
> side-track you then *walk* is a legitimate, kept mechanic — its **morale / skill-XP buff** and **origin
> trade-ties** (~10–15% accelerant) are framed as a **new present-day relationship** ("a man with people behind
> him works harder"), an **earned** reward, never a gift from remembering. At least one origin beat is always
> available without reputation-gating so the thread never stalls.

## T2.3 Antagonist arc — **Rival House Tomita** (spine) + **Rival House Akagi** (foil), with **Hanzaki** as the road's teeth

The T2 antagonist is the **two rival houses** (canon §F: exactly two) — the region's **incumbent samurai
houses** when the Kurosawa arrive — with the scarred *rōnin* **Hanzaki** as the dangerous combat beat. They are
the **contest layer that rides the spine**: the "win the region" gate (G7) *is* surpassing them. **Both are
*gōshi*/samurai houses that prospered while the Kurosawa fell**; both fight on **bought, lucked, or trained**
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
  other** (money vs honour). *(Routes are authored as intra-line dialogue choices; cross-ref the T1.2 allegiance
  note — Q34/FU22.)*
- **Talent-foil rule (binding):** every Tomita/Hanzaki advantage is shown as **bought, lucked, or trained** —
  never innate. Naoyuki's converted-not-innate growth mirrors the thesis (and from here he turns from internal
  rival into **ally against Tomita** — the **G5 flip** the T1.2/6a interstitial earned).
- **Rival standing is real, not scripted (binding — D-Q-banzuke).** **Tomita** and **Akagi** (plus a few
  unnamed domain houses) carry **LIGHT rival stats** — a small per-pillar standing/rank value each (cross-ref
  **§2.18** / §1.11) — so the **G7 "rivals dethroned"** capstone is a **computed chart-position overtake** the
  player's four-pillar climb passes, **not** a hand-scripted cutscene. **Not a full house-sim** — just enough
  stored standing for the per-tier *banzuke* to read the Kurosawa rising above them.

## T2.4 Estate roster & buildings growing (E2 → E3 Prosperous)

**Joins this tier:**
- **Saburozaemon** (stern senior retainer) and **Heisuke** (friendly peer retainer) join at retainer scale;
  **Kanbei** (jealous middling retainer — an in-household antagonist-rival, player-influenceable détente or
  self-inflicted washout, *not evil*).
- **Origin recruits (access-only, grind-built):** friend **Kanta** as the first porter contact / recruitable
  lead carrier; porter-guild mates as recruited carriers; sister **Okimi's** trading family as the concrete
  **trade-tie** multiplier.
- **Kuzuhara returnees** — one returning family / one origin recruit as the first resettlement producer (a
  *late-game* helper, consistent with auto-producers being late-only).

**Buildings (E2 → E3 Prosperous):**
- A counting-house begun; guest quarters for visiting brokers; the silk/sericulture sub-economy deepening; the
  mon flying on village (and first regional) contracts; the first branch holding up-valley; **Kuzuhara** as a
  small standing producer-base + the secured embankment.
- *Martial:* a roofed dojo replacing the open yard begun; a small standing squad forming.
- **E3 — Prosperous (authored for v1; Q8):** a third workshop and a full granary; the palisade closed into a
  proper perimeter; a standing **4–5-man rota**; the *shinden* reclamation paying out — the house visibly **back
  on its feet** (cross-ref §1.5.1; the **E3 koku/Arms cost row** is §4.7.5's job).

> **Estate physical growth runs *ahead* of top personal rank** (gated on the relevant pillars — Estate & Wealth,
> and Arms for defensive works — plus a **low** rank floor + cost, **not** the capstone). **E3 Prosperous is
> authored in v1** (Q8); stages **E4–E5** (fortified seat → restored-and-surpassed) remain **parked** for the
> T3/T4 build (see "Parked — later").

## T2.5 Key NPC & dialogue beats

**Origin (opens at T2; Sawatari-juku & Kuzuhara; cross-ref §1.8). [THREAD: Origin] — payoff cast.** *(Binding:
this whole cast is the **OPTIONAL, MISSABLE** Origin O5 side-track per the T2.2 note; the **Tahei name-reclaim**
is its capstone, **not** a spine beat — Q5.)*
- **Jinpachi** (father, ~50; a senior porter long away on a far stretch of the *kaidō* — **known alive but
  long estranged** from the household). **Re-added per canon** (renamed from the colliding "Kuranosuke"). The
  source of the porter's-knot lineage (**no retroactive gift from the reveal**). **His reconciliation resolves
  at T2** alongside the rest of the family, with an **optional later emotional callback at T4** (the recovered
  family proud behind the MC). *(Deliberately **NOT a second resurrection** (D-Q-Oyuki): **Oyuki grieved only
  her son** (the MC) as dead — Jinpachi is the **estranged living father** the MC must travel out and
  *reconcile* with, a quieter, harder reunion than a return-from-the-dead, so the "back-from-the-dead" beat
  lands **once** on this mother, not twice. Authored **un-stacked** — never a third "debt-machine-ate-a-person"
  arc beside Tahei's caravan and Otsuru's near-sale; keep it warm and small.)*
- **Oyuki** (mother, ~45) — the emotional core; she grieved her **son** (the MC) as dead — **the family's one
  genuine return-from-the-dead** — so his reunion is the warm "back-from-the-dead" payoff, kept earned and a
  little costly. *(Her husband **Jinpachi** is **not** a second resurrection — alive but estranged; see above.)*
- **Okimi** (elder sister, ~20; married into a trading family) — the concrete trade-tie that lets the origin
  town supply/route goods for the expansion.
- **Master Denbei** (old employer, ~55; transport-and-goods house) — porter/logistics know-how + legitimate
  manifests; the grounded source of the porter's-knot identity (**no retroactive gift from the reveal**).
- **Kanta** (childhood best friend, ~18) — comic-warm friendship rekindled; first porter contact; recruitable.
- **Osen** (a sweetheart half-remembered, ~17) — optional, gentle, **narrative-only** relationship thread the
  dream surfaces (no dating-sim). *(Named **Osen** to stay clearly distinct from the lost-child **Otsuru**.)*
- **Otsuru** (the real Tama, alive & grown **down-valley in Yanagi-watari** — a river-crossing market town
  kept **separate** from the origin-reunion hub Sawatari-juku; D-Q-otsuru-locale) — mystery payoff & living
  proof; **costly & incomplete** reunion (she may not forgive). *(Distinct from the sweetheart **Osen** — the two post-town
  women no longer near-rhyme; keep voices/roles distinct so they don't blur. Otsuru's truth is the **spine**
  G6 payoff; the rest of this cast is the **optional** Origin side-track — Q5.)*

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
- **Sawatari-juku & the wider post-town region** *(mixed)* — the origin reunion hub (optional — **Tahei's
  living family**) + the *toiya* transport office / waystation trade layer (the practical surplus-export runway to T3).
- **Yanagi-watari — down-valley river-crossing market town** *(spine, personal-mystery)* — a second post-region
  locale a day **down**-valley from Sawatari-juku; the busy river-crossing market where the grown **Otsuru** is
  found (the **G6 spine TRUTH**), kept **separate** from the origin-reunion hub so the two T2 threads don't share
  one locale (D-Q-otsuru-locale).
- **The Kaidō Porters' & Transport Guild** *(T2 trade-backbone)* — routes, *sekisho* pass-tiers, route-risk; the
  trade backbone (met via Kanta's first favour run). **This is a T2 node, NOT the T3 cliff-hanger stub** — the v1
  T3 stub is the **castle-town / Daikan first-contact** (Q24; see the T3 header). The porter/transport guild
  stays here as Kanta's favour-run / sekisho pass-tiers / route-risk layer.
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

> **FOUND-blades & the growing roster (FU13/Q15).** The region's better-trained human threats drop the first
> decent **FOUND blades** (a worn *kodachi*, a fitted *yari*; Hanzaki's gear a late prize) — the diegetic face of
> the **growing weapon roster**: T2 grows it **+4** and opens a new weapon **LINE** (a **staff**), found and
> refitted, never gifted. §5 keeps the FOUND-gear flavour; the roster/params live in §2/§4, the reveal cadence in
> §3.

> **No belief-creatures in spawn tables (binding).** The "one-eyed mountain god," "fox-fire fox/tanuki," and
> "yamanba/tengu" are **INVESTIGATE-then-confront one-shots** resolving to humans/animals — never respawn
> populations.

## T2.7 Open-ended side-quests (T2)

All optional; none gate the spine. **There is NO fixed quest-type budget (Q23)** — author whatever quests fit
the region; more and more-interesting quests are welcome at this later tier. Inn-rumour folklore continues to
unlock organically as the region grows.

- **The lost-child truth (Otsuru) resolves.** **[THREAD: Tama]** — the spine's personal payoff, **guaranteed at
  G6** (also a main-quest beat; listed here as the optional-depth investigation that *finds* her).
- **The origin reunions.** **[THREAD: Origin]** Jinpachi, Oyuki, Okimi, Denbei, Kanta, Osen — the rungs of the
  **OPTIONAL, MISSABLE** Origin one-tier rep side-track (`O0→O5`, §3.6.2). **The Tahei name-reclaim lands HERE
  (at O5), not on the spine** (Q5). The **reveal carries no retroactive gift**; the **track** is the optional
  **~10–15% accelerant + skill-XP buff** (an earned present-day relationship, §1.5.4); it **never gates the
  spine.**
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
- **The *toiya*'s misrouted manifest (open-ended help).** A consignment goes astray on the *kaidō*; trace it
  through the post-town's porters and pass-tiers — a trade-backbone errand that warms the route layer without
  gating it; a curious player notices a short-weighed crate (the **[MOTIF: rigged box]** through-line).
  *(Representative addition per Q23.)*
- **The Bon lanterns for the named drowned (grief-work).** Once Kuzuhara's drowned are named, an optional
  yearly lantern-float at the weir/temple register — warm, lore-light, never a rite with mechanics.
  *(Representative addition per Q23.)*

> **Belief→cause additions (T2; binding).** "One-eyed mountain god" → Hanzaki + terrain. "Fox-fire ridge" →
> hidden charcoal kiln. "Yamanba/tengu of the high cedars" → a hermit / recluse / large raptors / wind in the
> cedars (INVESTIGATE-then-confront, never a monster). The **≤1 residual-ambiguity cap holds** — the only
> ambiguous token remains the Asagiri **weir-jizō offering**; **no new ambiguity beats** are added at T2.

---

# T3 — Castle-town (STUB in v1)

> **v1 ships a STUB cliff-hanger only** (canon §I; Q24). The single buildable T3 node for v1 is the
> **castle-town / Daikan first-contact**: a **sealed summons** delivered after the T2 capstone, **presenting
> credentials at the Daikan's Office** (one node — the receiving anteroom — one verb: present credentials), and a
> **bare rented castle-town townhouse beachhead** — a single room with a gate that **mirrors the T0 kura
> cold-open**, re-running the fractal-incremental motion at a new frontier with the least new art/systems.
> *(This **replaces** the old "Kaidō Porters' & Transport Guild first-contact" stub — that re-ran spent T2
> content; the porter/transport guild stays a **T2** trade-backbone node, T2.6.)* The T2 capstone opens onto
> exactly this one castle-town teaser, then ends. **Everything below is authored-forward (not built in v1).**

## T3.1 Overview (forward)

**Theme:** *be reckoned with by the people who actually rule* — the castle-town, the *daikan*/*tedai*,
inter-*han* markets. The takeover is won **socially** (canon §B: multi-route — office / economy / marriage /
out-maneuvering rivals; AND assertive martial-security leverage; **never open rebellion**). "Take over" =
becoming the **dominant house holding key domain offices.**

**Transition gate (T3→T4):** a **"taste of Edo"** — the house is **called to staff & run the *domain's* Edo
establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own) → grow influence → the
national tier. **Required pillars:** **Office + Name** dominant; Arms/Estate as leverage.
**Estate stage span:** E3 Prosperous → E4 Fortified Seat *(E3 already attained in v1's T2 per Q8; T3-forward
starts from E3).*

## T3.2 Main-quest beats (forward stub)

*(Build boundary — Q24: **beats 1–2 are the v1-BUILT stub node** — the summons + the townhouse beachhead,
mirroring the T0 kura cold-open; **beats 3–7 are authored-forward**, not built in v1.)*

1. **The summons.** After the T2→T3 service is rendered, a low *tedai* delivers a sealed note: present the
   Kurosawa's representative at the **Daikan's Office** — one node (the receiving anteroom), one verb (present
   credentials).
2. **The townhouse beachhead.** Secure a modest rented castle-town townhouse — a single bare room with a gate,
   mirroring the T0 kura cold-open (the T3 hub through which introductions route). **— end of the v1-built stub;
   the T2 capstone opens onto exactly this, then ends.**
3. **Officialdom records you.** *(Authored-forward.)* Repeated correct conduct earns an audience with **Daikan
   Iemasa** and a "standing with officialdom" meter; yields/contracts get **formally recorded** (the
   *koku*→Influence conversion at domain scale).
4. **Debt restructured into creditworthiness.** *(Authored-forward.)* The finance network restructures the
   grandfather-era loan (Tanomo's interface), opening working capital + the *goyōkin* lever.
5. **The *meibutsu* graded toward Osaka.** *(Authored-forward.)* The silk is graded/branded for wider markets
   (still ≤⅓-capped).
6. **Out-maneuvering Tomita (and the marriage lever).** *(Authored-forward.)* Tomita contests broker terms +
   samurai-society standing; the optional **marriage/adoption alliance** lever matures (a real, lean
   Standing/Name move + a takeover route).
7. **Win the region's confidence (the gate).** *(Authored-forward.)* Become the dominant house holding key
   offices → the "taste of Edo" calls the house to staff & run the *domain's* Edo establishment (the *rusui-yaku*
   under the daimyō's *sankin-kōtai*, never its own). **Gate met.**

## T3.3 Antagonist arc — **Tedai Kuroiwa**, the gracious door (forward)

- The magistrate's agent (*tedai*) who *records* your achievements and secretly architects the rice-quota skim
  (canon §F). Outwardly an ally; **defeated by evidence, not violence.** Sits **beneath** Daikan **Iemasa** and
  **above** guilt-sick clerk **Mosuke** (the crack).
- **Incremental reveal:** the polite junior clerk who keeps you waiting → the facilitator who records your
  service (seems an ally) → a yield misrecorded "by error" → **Mosuke's** flinch → the rigged *kyō-masu* at the
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
ceiling); **Clerk Mosuke** (the reachable conscience / documentary proof); **Proprietress Okatsu** (teahouse
super-broker — the introductions layer, period-accurate restraint); **Retainer Tadahiro** (first genuine
peer-ally); **Lady Chiyo** escalated to the house's **alliance-strategist**; **Go-between Omiya-no-Sahei**
(marriage/adoption broker — standing & discretion, not romance); **Naoyuki** as the ally against Tomita;
**Shigemasa**'s decline begins in earnest (the succession beat opens). **[THREAD: Origin]** Jinpachi's optional
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

> **Parked — later (designed, not authored as full v1 content):** estate stages **E4–E5** in full *(E3
> Prosperous is **un-parked** — authored in v1's T2; Q8)*; the marriage/adoption brokerage depth; the
> *daikan*-office audit/evidence sub-thread depth; the full social-district introductions system.
> **Cut for now (reintroduce later):** the Matagi hunters, the Pilgrimage Order, and the Scholars-&-Physicians
> as a *network* (keep Sōan / Obaa Kuni as the existing seed only).

---

# T4 — Edo (ROADMAP)

> **v1 ships a ROADMAP only** (canon §I) — the national tier is scoped forward, not built. All beats below are
> the authored target, kept lean so a later milestone can build against them.

## T4.1 Overview (roadmap)

**Theme:** *recognition at the capital* — restore **and** surpass the grandeur of three generations ago. The
ceiling is honoured absolutely: recognition is **indirect & mediated** (down through rusui **Mukai** and Lord
**Shigemasa**); the MC does **not** become a *hatamoto* and is **never** received by the shogun. His personal
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
   **Mukai**).
2. **The *meibutsu* reaches Edo.** Silk rides the procession up as tribute; a Nihonbashi *tonya* sends a single
   trial order (the silk's first capital-side buyer). *(**Nihonbashi** is an explicitly allow-listed real place
   name; Q12.)*
3. **The chart that omits you.** Mukai forwards a popular ***mitate*/parody broadsheet** (sumo-rank vocabulary)
   on which a rival domain's product appears and the Kurosawa's does not — one stinging absence.
4. **Climbing the *banzuke*.** The silk first appears on a minor chart → climbs toward the attainable band
   (Maegashira/Komusubi) as the house's standing rises; the top ranks (Ōzeki/Yokozuna) are **structurally
   sealed** — the wall the truly powerful built, made the chart's literal geometry.
5. **The untouchable apex glimpsed. [MOTIF: rigged box] — terminus.** **Echizen-ya Sōbei**, the Edo factor
   laundering the skimmed silver, is glimpsed **once** (Mukai forwards a dispatch; a manifest dies at his name)
   — you learn *who*, and that you **cannot touch him.** **The factor escapes** (the honoured incompleteness).
6. **The touring-inspector set-piece (capstone).** Word travels down the *kaidō* that **Junkenshi Hayami
   Saemon-no-jō** will survey the domain. The whole game's accumulated work becomes the answer to one exam; the
   **lord** faces the inspector, the house's record is read aloud, **the MC stands at the back.** **Won or
   dented**, never fought (a recoverable dent on neglect, **never a wipe**).
7. **The mediated commendation (the ending).** A favourable report travels up and becomes a documented
   merit-commendation entering an official register (the house's name in bakufu ink), delivered **down** through
   Mukai and the lord. **One authored ending** (house restored & ranked) + **post-game free-play** (no reset);
   branches are in *how* you got there (allegiance / takeover route), not separate endings.

## T4.3 Antagonist arc — the Edo factor + the impartial test (roadmap)

- **Echizen-ya Sōbei (the Edo factor)** — the **untouchable apex** of the quota machine (the antagonist as
  *system*); glimpsed, named, **never reached.** Blocks *full justice* (the trail dies in Edo).
- **The Touring Inspector (Hayami Saemon-no-jō)** — **not a villain**; the antagonist-shaped **test** (the
  impartial judge whose survey validates or threatens everything the house built). Blocks *final recognition*.
  His secretary **Mabuchi** writes the report — the reachable human whose pen captures the house's worth
  (honestly informed, never bought).

## T4.4 Estate roster & buildings (roadmap) — E5 Restored-and-Surpassed

**Joins/escalates (roadmap):** **Rusui Mukai Settsu-no-suke** (the MC's sole pen-pal proxy in the capital — the
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

**Succession.** Aging **Shigemasa**'s decline → heir **Naoyuki** comes into his own (the MC as right-hand); the
house's future is secured across a generation.

**The epilogue tableau** (a single warm, bittersweet image of everything built): the restored-and-surpassed
house seal; the reclaimed fields; the resettled **Kuzuhara**; the **named drowned**; the freed and
self-determining **Otsuru** (the lost-child truth — **known to every player**, spine-guaranteed at G6); and —
**CONDITIONAL on completing the optional, missable Origin O5 track (Q5)** — the recovered family (incl.
**Jinpachi**) proud behind him **and a true name — Tahei — reclaimed**; and a life built by hand. **A player who
never walked the Origin thread still earns the same warm restored-and-ranked ending and still KNOWS the Otsuru
truth, but the recovered family and the reclaimed name "Tahei" do not appear in the tableau** — they are the
Origin payoff, not a guaranteed ending element. **Partial justice, by design:** reachable culprits answered at
their tiers; the truly powerful (Iemasa, Echizen-ya Sōbei) walk. The win is **the house restored and ranked**,
the rot's apex still out of reach.

**Post-game long-tail (no reset; no decay-tax):** defend the top *banzuke* spot on the biennial sankin-kōtai
heartbeat (recoverable, never a decay-tax); optional grounded super-bosses; per-pillar mastery goals; the
estate-as-sandbox **teaching layer** re-homed onto **Tokujirō** + recruited origin friends.

---

## §5 cross-references & integration notes

- **Numbers belong in §4.** Every "result," "threshold," "result-recorded," and pillar-gate here is a **shape**;
  the **§4** surfaces §5 defers to are: the **rung-meter accrual curve** (the Phase-1 third progression curve;
  FU6/§4.1.1), the **three clean combat tracks + the single combat-fed character-level XP curve** (kills→level,
  curated rung activity→Combat Rank, recognised deed→Arms; FU14/Q1/§4.0.1/§4.6.5), the **HYBRID
  good/great/excellent tier-gate thresholds** (FU10/Q7/§4.1), the per-pillar **deed/seasonal accrual** split
  (§4.2), the **E3 Prosperous cost row** (koku/Arms sink; Q8/§4.7.5), the **graded weapon-durability bands**
  (FU17/§4.6), the **satiety→combat throttle** term (FU16/§4.6 — "eat before you fight"), the **per-weapon
  archetype params** + the growing roster (FU13/§4.6), and the **T2 cross-pillar combos** (the late-game
  anti-slump; FU20/§4.3.1). §5 keeps only the *story shape.*
- **Rung copy belongs in §3.** T2's region-ladder rung wording, all per-tier reveal cadences, **the staggered
  combat-reveal ladder** (one reveal per beat — R3 starter weapon + auto-resolve + retreat + Bestiary → R4
  durability bands + Crafting → R5 stance → weapon-L10 ability/item slots → T1 2nd line → T2 3rd line; FU12),
  and the **per-rung curated-activity sets** that feed the rung-meter (FU7) are **§3's** job; §5 fixes only the
  *story shape* of each ladder and the **Phase-1 / Phase-2 narrative arc.**
- **Authenticity pass — RESOLVED (2026-06-25).** The **Standing & Office** pillar kanji is set to **官威
  (*kan'i*)**, "authority of office" (coined 政威 rejected); the R7 rung title is **地方役 (*jikata-yaku*)**,
  "home-field bailiff" (the grander *jitō-dai* dropped); *michi-ban* (road-warden) is **diegetic-only** (an
  in-house role the estate confers, not an attested bakufu office); and the **T4** arc has the house **staff and
  run the *domain's* Edo establishment** (the *rusui-yaku* under the daimyō's *sankin-kōtai*), never its own.
  A routine follow-up confirm of humble *ashigaru*/household-tier titles vs aspirational narration may still
  run, but no design item is open.
- **Belief→cause tables are binding inputs to §2/§6** (the bestiary registry must contain **no belief-creatures**;
  yokai are INVESTIGATE-then-confront one-shots; exactly one ambiguous token at the weir-jizō find-spot).
- **Name fictionalisation (Q11/Q39/Q27/Block N.1 #3) — lint-guarded.** The invented replacements used in §5 are
  **Heita** (T0 field-lad, off **Magobei**), **Obaa Kuni** (village herbalist, off **Sayo**), **Mosuke** (T3
  clerk, off **Naoyuki**), **Hayami** (T4 touring inspector, off the real "Toyama"), **Mukai** (T4 rusui, off
  the real "Konoe"), **Shigemasa** (the lord, off the Yagyū **Munenori** echo), **Kihei** (the drillmaster, off
  the Yagyū **Jūbei** echo), and **Sōan** (the physician, off the Edogawa **Ranpo** echo) — these must tie out
  byte-for-byte with §1.8 and the **§6.6 real-name denylist** lint.
  **Nihonbashi** stays as an explicitly **allow-listed** real place name (Q12).

## Items flagged for the human

1. **Authenticity pass — RESOLVED (2026-06-25).** The Standing & Office pillar kanji = **官威 (*kan'i*)**; R7 =
   **地方役 (*jikata-yaku*)** (home-field bailiff); *michi-ban* stays **diegetic-only**; **T4** = the house runs
   the *domain's* Edo conduit (*rusui-yaku* under the daimyō's *sankin-kōtai*), not its own. A routine confirm of
   humble *ashigaru*/household-tier title vocabulary vs aspirational narration may still run before T0–T2 dialogue
   is finalised, but no design item is open.
2. **Jinpachi = estranged-living, NOT a second resurrection (RESOLVED — D-Q-Oyuki).** Reworked so the father is
   **alive but long estranged** (away on the *kaidō* for years) and his T2 beat is a **reconciliation**, **not**
   a second "presumed-dead → back-from-the-dead" return — so **Oyuki grieves only her son** as dead (one
   resurrection on one mother, not two). Still authored **un-stacked** — never a third
   "debt-bondage / debt-machine-ate-a-person" arc beside Tahei's caravan and Otsuru's near-sale (the superseded
   father draft stacked exactly that; the verifier flagged it).
3. **Otsuru / Osen name-proximity (RESOLVED).** The two post-town women previously near-rhymed; per human
   review the sweetheart was renamed to **Osen**, so they no longer blur. Authored with distinct roles/voices;
   no further rename needed.
4. **Kuzuhara has NO survivor / co-investigator character (CUT).** Per human review the stale fellow-survivor-
   who-recognizes-the-MC (the "Kiku"-type) is **cut entirely**: the MC has **no personal tie to Kuzuhara**.
   Kuzuhara is purely a struggling, depopulated upstream hamlet the player resettles as a T2 region project; the
   MC's origin is uncovered via the **dream → the Sawatari-juku family**, never via a Kuzuhara survivor. (The
   superseded spine's Ren/Kiku/Genza/Zenroku remain NOT canon and must not be revived.)
5. **T3/T4 are forward-authored only.** Per canon v1 scope: the **T3 stub = the castle-town / Daikan
   first-contact** (the sealed summons + presenting credentials at the Daikan's Office + the bare rented
   townhouse beachhead mirroring the T0 kura cold-open; Q24 — the old "Porter-Guild first-contact" stub is
   dropped); **T4 roadmap.** Estate now grows **E0→E3** in v1 (**E3 Prosperous** authored; **E4–E5** parked; Q8).
   Confirm the chosen T3 stub node and that the parked/cut lists (**E4–E5** depth; Matagi / Pilgrimage /
   Scholars-network) match the human's intent before any post-v1 build.

---
# §6 — Tech Architecture & Data Model

This section specifies, concretely and leanly: the **toolchain**; the **pure-core boundary** and module
layout; the **GameState** shape (stored vs. computed) — including the **three clean combat tracks**
(§6.4.1), the **intra-line dialogue** data model, and the **bounded per-skill labour→combat** channel — and
the `reduce`/`tick` contracts; the **one seeded RNG** (per-named-stream cursors + stateless day-keyed
derivations); **content as data registries** (data-as-code, single source of truth); the **save model**
(MULTI-BACKEND redundant atomic save — IndexedDB + localStorage + sessionStorage — an app-identity magic
field, an additive backwards-compatible schema, and a monotonic-counter newest-wins selector); the
**renderer contract** (thin DOM, multi-screen UI, responsive, active-only); the **DEV play API**
(`window.__qa`); **accessibility basics**; and how all of this satisfies the four project conventions
(pure-core, one RNG, generate-don't-duplicate, playtest-by-code).

> **ADR note:** §6 is **no longer ONLY an elaboration of D-013.** It still adds buildable detail to the
> already-locked tech canon (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed
> split, the registry set, the verifier + generated-docs gate, the `__qa` surface — recorded as a child ADR
> **D-013a — tech architecture detail**), **but it also now IMPLEMENTS the V2 decisions under ADR D-022
> (governing, most-recent-wins)** — real reversals / new locks, not just buildable detail: **multi-backend
> redundant save** (Q37/FU1), **additive backwards-compatible schema** (Q45/FU5), **per-named-stream RNG
> cursors + stateless day-keyed weather** (Q2/FU3), the **`Math.pow` ban → integer-pow** (Q36), the
> **bounded labour→combat verifier flip** (Q6/FU8), the **feature-rich data model** incl. **intra-line
> dialogue** (Q34/FU22) & **`estateWealth.subEngines`** (Q34/FU20), and the **no-runtime-reveal-queue**
> design rule (FU4). See §6.13.

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
  (dead-code-eliminated from the production build). The build also injects a **commit-SHA build stamp**
  (surfaced on the About/Credits surface, §6.1.1/§6.5).
- **Vitest** unit-tests the pure core (it imports cleanly in Node because it has zero DOM/canvas/window
  references — see §6.2). Determinism tests assert that a fixed seed + a fixed intent/tick script produces a
  byte-identical `GameState` (snapshot or structural hash).
- **ESLint** enforces the architectural rules as lint, not just convention:
  - **no `Math.random()` anywhere in `src/core/`** (custom `no-restricted-syntax` / `no-restricted-globals`
    rule) — all randomness flows through `core/rng` (convention: *one RNG*);
  - **no `Math.pow` / `Math.exp` / `Math.log` / trig (`sin`/`cos`/`tan`…) anywhere in `src/core/`** (a new
    `no-restricted-properties` rule; **`Math.sqrt` is whitelisted**) — every growth-curve power is computed
    by **integer-power-by-repeated-multiplication**, not floating transcendentals, accumulated in **ONE
    canonical left-to-right order** (`acc = 1; for i in 1..n: acc = acc · base` — a single pinned reduction
    order, **unit-asserted** so a refactor can't silently re-associate and diverge; D-Q-numeric / Q16+Q17).
    Rationale (Q36): this closes the **1-ULP cross-engine hole**, so a fixed seed replays **byte-identically**
    across engines/OSes and an **exported base64 save** is portable and re-importable everywhere (convention:
    *one RNG / determinism*);
  - **no DOM/canvas/window/`document`/`localStorage`/`indexedDB`/`Date.now`/`performance.now` in
    `src/core/`** (a `no-restricted-imports` + `no-restricted-globals` boundary rule) — keeps the core pure,
    deterministic, and Node-testable (convention: *pure-core*). **Documented save-layer exemption (FU2):**
    `Date.now`/`performance.now` stay **banned in `src/core/`**, but `src/persistence/` **may** call
    `Date.now` for the **save-layer timestamp** used **only** as the newest-wins **tiebreaker** (save
    *metadata*, **not** game logic — §6.8.1). This is a **named, recorded core-lint exemption**: the
    deterministic core stays clock-free; only the side-effectful persistence layer reads the wall clock;
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
               && node src/scripts/verify-content.ts      # the content verifier + V2 invariants (§6.6/§6.6.1)
               && node src/scripts/gen-docs.ts --check     # generated docs are up to date (§6.6)
```

`gen:docs --check` regenerates the balance/content docs into a temp buffer and fails if they differ from
what's committed — this is how *generate-don't-duplicate* is enforced mechanically: you cannot land a data
change without regenerating its docs. `npm run gen:docs` (without `--check`) writes them.

**Scripts:** `dev` (Vite dev server), `build` (`vite build` → `dist/`), `preview`, `test`, `test:watch`,
`verify`, `gen:docs`, `lint`, `format`. `build:itch` = `build` + zip `dist/` for upload.

---

## 6.1.1 Bundled assets (self-hosted OFL fonts · curated audio · inline SVG · build stamp)

> **Corrects the earlier "no asset pipeline" framing.** v1 *does* ship **one small, curated, fully-bundled
> asset set** — there is still no heavy art pipeline, but the build self-hosts a handful of static assets so
> the game works **offline and under itch's relative-base / cross-origin-iframe** sandbox. Everything below
> is committed into `dist/` at build time; nothing is fetched at runtime from a third-party CDN.

- **Self-hosted fonts (Q52).** The display/body typefaces are **SIL OFL** fonts **self-hosted** in
  `dist/` (woff2), **never** Google Fonts dynamic subsetting (which breaks offline play and the itch
  relative-base). The **OFL license text is bundled** alongside and credited on the About/Credits surface.
- **A small curated audio set (Q50).** "Good audio" = a mix of **synthesized Web Audio** (light ambient
  beds + UI/event SFX generated in code) **and a few original / CC0 samples**, bundled into `dist/`. This is
  the **one acknowledged small asset set.** A mute toggle is honoured (§6.11). The Web Audio **`AudioContext`
  starts SUSPENDED** and **resumes only on the first user gesture** (so there is **no ambient at the cold
  open** — effectively muted until the player opts in), and it **suspends again on backgrounding / pause**
  (§6.9 active-only loop).
- **Inline SVG for load-bearing period motifs (Q38).** Pillar / season / rarity / rank-seal marks that must
  read **identically across OSes** are **inline SVG** (in the DOM, themeable by CSS custom properties), not
  emoji. **Emoji are cosmetic-only** — never the sole carrier of a load-bearing meaning (ties to §6.9/§6.11).
- **Build stamp (Q54).** The build injects the **commit SHA** (and build date) as a compile-time constant,
  surfaced on the **About/Credits** surface (§6.5) together with authorship, the font/audio attributions,
  and the license note (Q51: **permissive code** — MIT/Apache-2.0 — **+ reserved game content**).

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
               ←   The app loop ACCUMULATES the fractional dtTicks remainder and hands only
               ←   WHOLE-INTEGER ticks to core.tick(); while the tab is OPEN it drives auto-resolve
               ←   combat + auto-repeat labour (the "leave it running" feel, FU23) — still active-only.
  persistence/ ← MULTI-BACKEND redundant save (IndexedDB + localStorage + sessionStorage) + atomic write
               ←   + app-identity magic field + monotonic-counter newest-wins selector + the additive-schema
               ←   migration chain & raw backup + base64 codec. (Side-effectful; never imported BY core.)
src/scripts/       ← gen-docs.ts, verify-content.ts (Node entry points; import core data only).
```

**Dependency rule (one-directional):** `ui`, `app`, `persistence`, and `scripts` may import from `core`;
**`core` imports from none of them.** `core` exports only pure functions and data and the `GameState` type.
The lint boundary rule (§6.1) makes a violation a build failure, not a code-review catch.

### `core/` module layout

| Module | Responsibility | Pure? |
|---|---|---|
| `core/state` | The `GameState` type, `createInitialState(seed)`, and the **stored vs. computed** split (§6.4). | yes |
| `core/intents` | The typed `Intent` union (every player verb) + `reduce(state, intent) -> state` — the action reducer. | yes |
| `core/step` | `tick(state, dtTicks) -> state` — the deterministic clock advance (whole-integer ticks) + the per-tick / per-day / per-week / per-season scheduler. | yes |
| `core/rng` | The **one** seeded RNG: **splitmix64**, persisted as **per-named-stream cursors** `{ seed, cursors: { combat, loot, seasonal, worldgen } }` (NOT a single counter, NOT child-RNGs-by-splitting). Pure `next(rng, stream) -> [value, rng']`; helpers (`int`, `chance`, `pick`, `weighted`) thread the advanced cursor back into `GameState`. **Plus** a pure **stateless day-keyed** helper `deriveDayKeyed(seed, 'weather'|'festival', day)` for weather/festival rolls, and a pure `lunarPhase(day)` **ephemeris** (real ~29.5-day cycle, no RNG; D-Q6) — both derived on read, **NOT** a persisted cursor (§6.7/§6.7.1). | yes |
| `core/combat` | The deterministic, fixed-step auto-battler. **Feeds the character (combat) `level` track** (combat-XP from kills → `character.level`; Q1/FU14) and the **equipped weapon-line skill**; reads **per-mob `MobDef.level`** (FU15), **graded durability bands** on attackPower/defense (FU17), the **`satietyRate`** combat throttle on attackPower (FU16), and a **clean retreat** (Q16). Drives the **staggered reveal** of the stance / ability / item slots (FU12) over a **bigger weapon roster** (~9–10 across v1; each an archetype + signature ability — FU13). Saves & resumes mid-fight via `CombatEncounterState` (Q34). Stepped by `core/step`. | yes |
| `core/economy` | Producers, costs, resource flows (the *koku*/coin spine; the capped Estate & Wealth sub-engines: land / treasury / trade incl. the silk *meibutsu*, trade ≤⅓-capped per canon §D). Holds the **market-saturation** damper (the only non-derivable economy state; §6.4). | yes |
| `core/skills` | Per-skill XP curves, per-event caps, visibility thresholds, milestone web. **Each skill (labour included) carries a per-skill PERKS track** (~2–8 perks / small flat combat bonuses, unlocked by leveling that skill) — the **bounded labour→combat channel** (FU8). The real bound is **incremental skill unlock** (skills reveal per rung/tier) + small per-perk magnitudes (the §6.6 verifier asserts *each perk* is small — **not** `== 0`, **not** a single global cap). **Conditioning stays the ZERO-stat enablement gate** (weak→capable), orthogonal to and never bypassed by these perks (Q6/FU8). | yes |
| `core/rewards` | The universal **rewards/unlock bus** — `applyRewards(state, rewards) -> state` — the one funnel through which dialogue, **dialogue choices**, quests, thresholds, and combat grant items/xp/coin/locations/recipes/quests/**flags & unlocks**/`pillarDeltas`, and emit diegetic log lines. (`pillarDeltas` deed-accrual is **Phase-2-gated**, §6.5.) | yes |
| `core/unlock` | Predicate evaluation for the UI-reveal engine: each panel/screen/tab/row/area is data with an unlock predicate over `GameState`. **`reduce`/`tick` evaluate the predicates to ADD newly-earned surfaces to the stored write-once `unlocked` latch** (§6.3/§6.4); the reads `isUnlocked(state, id)` (per-id) and `unlockedSurfaces(state)` (the **ONE** set-selector name — replaces the old `visibleSurfaces`) are **pure projections of that stored Set**, never a live predicate re-eval. **Reveal staggering is a DESIGN property of the authored unlock schedule** (one-at-a-time **by construction**, FU4) — there is **NO** stored runtime reveal-queue; genuine multi-element single-feature reveals are bespoke one-offs designed per case. | yes |
| `core/influence` | The four House-Influence pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour), achievement-jump + seasonal judged-result accrual (new-high-water-mark, up-only + per-pillar recoverable dents). **Tier-up is the HYBRID good/great/excellent per-pillar-per-tier gate** (good in **all revealed** pillars · great in 2–3 · excellent in 1–2; **T0 is a 2-pillar special case**; **NO** overflow-substitution — §1.6.3/§1.6.4, Q7/FU10). Pillar **DEEDS accrue only in each tier's Phase 2** (post-final-rung; FU7). The **Estate & Wealth** pillar holds the nested `subEngines { land, treasury, trade }` with the **trade ≤⅓ HARD clamp**; **cross-pillar combos are computed POST-clamp** and excluded from the gate-threshold check (§4.3.1, FU20). | yes |
| `core/ranks` | The **per-tier rung ladder** + the **per-rung-RESET rung-meters**: `estateService` (labour) and `combatRank` (martial — fed by per-rung **CURATED** activities, **not** raw kills/XP; renamed from v1 "Combat Standing" per Q9). Each rung promotes on an **AND-gate** — the numeric meter **≥** that rung's threshold (back-solved from the ≥30-min floor × the rung's eligible-activity rate, FU6) **AND** the rung's **story flags** — surfacing "awaiting X" when one lags. Owns the **phase-1 (climb the rungs) → phase-2 (the estate-influence / pillar grind unlocks after the final rung)** gate per tier; the phase marker is **DERIVED from the current rung**, never a separate stored flag (FU7). | yes |
| `core/content` | The **data registries** (one module per content type; §6.5) + the registry index. Data-as-code. | yes |
| `core/log` | The event/story log model (append, severity/colour tag) — data only; the renderer paints it. A **true ring buffer** with a pinned hard cap **`LOG_RING_MAX ≈ 300`** (oldest entries evicted on overflow — never an unbounded list). | yes |
| `core/selectors` | Derived/computed reads (current production rates, effective stats, `satietyMax`, `durabilityBand`, the gate profile, what's unlocked, current tier). **Pure functions of `GameState`; nothing stored.** | yes |
| `core/format` | Pure display helpers — the shared **K/M/B** number formatter (`999,999 → '1.0M'`, etc.) + macron/label helpers — moved out of `src/ui/` so they're **table-driven boundary-tested under `npm run verify`**; the renderer imports them (§6.9). | yes |

**Public surface of `core`:** the `GameState` type, `createInitialState`, `reduce`, `tick`, the selectors,
the registries, and the RNG helpers. **Nothing else mutates state.** Everything is immutable-in/immutable-out
(structural sharing; never mutate the input `state`).

---

## 6.3 The two contracts: `reduce` and `tick`

Two pure functions are the *only* ways state changes. Both are deterministic given `(state, input)` because
all randomness is carried inside `state.rng` (§6.7), every weather/festival roll is re-derived stateless and
day-keyed, and lunar phase is a derived ephemeris off the absolute day (§6.7.1).

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
  | { type: 'advance_dialogue'; lineId: DialogueLineId; choiceId?: ChoiceId }  // choiceId = an intra-line branch (FU22)
  | { type: 'accept_quest'; questId: QuestId }
  | { type: 'advance_quest'; questId: QuestId; event: QuestEventId }  // an order-free advance-event fires (D-Q-B14): adds `event` to the quest's `advancedBy` set, recomputes status; a no-op if already satisfied or the quest isn't active
  | { type: 'read_scroll'; scrollId: ScrollId }       // diegetic feature unlock (costs in-game time)
  | { type: 'set_allegiance'; lean: number }          // Tama ↔ farmhand, continuous, re-swingable
  // ...one variant per verb; the renderer NEVER mutates state, it only dispatches these.

// The action reducer: a player verb → new state. Pure; deterministic.
function reduce(state: GameState, intent: Intent): GameState;

// The clock advance: simulate dtTicks of abstract game-time. Pure; deterministic.
// dtTicks is a WHOLE INTEGER of ABSTRACT (active-play) ticks — the app loop accumulates the
// fractional remainder and hands core.tick() only integer ticks. Never wall-clock; active-only,
// no offline (canon §H).
function tick(state: GameState, dtTicks: number): GameState;
```

**`reduce`** validates the intent against current state (e.g. enough *koku*, area reachable, rung high
enough), applies the change, runs any triggered rewards through `core/rewards`, and re-checks unlock and
tier-threshold predicates so newly-earned surfaces flip to unlocked and push their diegetic log line. An
illegal intent is a no-op (returns the same state) plus an optional rejection note — never a throw.
**`reduce`/`tick` are the SINGLE reveal authority and only ever ADD to the stored `unlocked` Set (write-once
latch — a surface, once entered, is never removed); the once-per-game reveal log-line is emitted by this same
latch transition, not by the renderer diff.**
**Intra-line dialogue is data, not scripting (FU22):** an `advance_dialogue` carrying a `choiceId` writes
**only chosen-flags** (the choice's `locksLineIds[]`/`flags` effects ride the *same* rewards bus) — it is
deterministic and **save-light** (only the chosen flag persists, in `flags`; §6.4/§6.5).

**`tick`** advances the abstract clock by `dtTicks` (a whole integer) and runs the scheduler in `core/step`:
- **per-tick:** the **auto-resolve combat** sub-step (the auto-battler) and **auto-repeat labour** (the
  "leave it running, check progress" loop, FU23 — runs unattended while the tab is open, still strictly
  active-only), satiety/energy drain (soft — slows, never hard-blocks), active-activity progress,
  auto-producer output (late-game / T3+ only). **It also decrements each `ActiveEffect`'s remaining duration
  and DROPS expired effects** — so `effects[]` is **length-bounded** (live buffs/injuries only), never an
  unbounded persisted collection.
- **per-day / per-week:** vendor restocks, food rot/ferment, the market-saturation damper recovering, and
  the **day-keyed weather / festival resolution** — `deriveDayKeyed(seed, 'weather', day)` produces the
  day's bounded **±10%** *(proposed v1 balance)* mechanical modifier with **nothing weather-related stored**
  (§6.7.1).
- **per-season:** harvest resolution, the **seasonal judged Influence appraisal** (runs **every season —
  4×/in-game year**, the autumn harvest the headline; it **raises a pillar only on a new high-water mark
  (up-only)**, never a per-season maintenance trickle, per canon §D and PRD §1.6.2). Per **FU7 (sequential
  per-tier)** this appraisal **accrues pillar DEEDS only in the tier's Phase 2** (after the final rung) — the
  judged result writes **nothing** to the pillars while the player is still climbing the rungs (which
  prevents the "half the rungs, maxed deeds" exploit). Weather/festivals modulate the judged result
  mechanically (bounded ±10%, day-keyed). Also: festival events. **Crossing a season boundary increments a
  `pendingAppraisals: number` counter** (NOT a `pendingAppraisalDue: boolean` — B10) which the scheduler then
  **drains in a loop, one appraisal per count**, so a multi-season `dtTicks` jump accrues **all N** appraisals
  (a boolean would silently collapse N seasons into one).

`dtTicks` is computed by the **app-layer** loop from real elapsed time *while the tab is active*, then handed
to the pure `tick` as a **whole integer** (the loop accumulates the fractional remainder across frames). That
**fractional-tick remainder is intentionally EPHEMERAL** — it lives only in the app loop, never in
`GameState` and never in the save; `GameState` is **always tick-aligned at save**, so replay determinism is
unaffected. The core never reads a clock. **Active-only is enforced structurally:** there is no offline-accrual code path —
on load, the world resumes exactly where it was saved (no "while you were away"); the unattended
auto-resolve/auto-repeat only runs while the tab is open.

> **Tick-fold determinism (B10, testable).** `tick(state, dtTicks)` **folds `dtTicks` ONE abstract tick at a
> time** — it never batch-applies a multi-tick delta. Within each single tick the per-day / per-week /
> per-season scheduled plans each **fire exactly once, in a FIXED registry order** (a declared, stable list —
> not iteration order of a map), and a counter like `pendingAppraisals` is **drained in a loop** so nothing is
> dropped on a long jump. This makes the clock **split-invariant**: `tick(s, a + b) === tick(tick(s, a), b)`
> for all non-negative integers `a, b` — **unit-asserted** in Vitest. (Combined with the day-keyed weather and
> the lunar ephemeris being pure functions of `day`, a 1-tick step and an N-tick step reach byte-identical
> state.)

> **Determinism guarantee (testable):** `replay(initialState, [intents…], [tickScript…])` produces an
> identical `GameState` every run. This is asserted in Vitest and is what makes the DEV play API (§6.9) a
> regression harness for pacing and unlock timing.

---

## 6.4 GameState — stored vs. computed

`GameState` is a single immutable-ish tree reduced by `reduce`/`tick`. The cardinal rule (per the architecture
sketch and the *save-minimal* canon): **store only what is NOT derivable; recompute everything derivable on
read.** Derived values (effective stats, `satietyMax`, the gate profile, current production/sec, what's
unlocked, current tier, time-to-next) are **computed by `core/selectors`, never stored** — so they can never
go stale and never need a migration.

### Stored (non-derivable) — the persisted surface

```ts
interface GameState {
  schemaVersion: number;            // for the migration safety-net (§6.8.2)
  rng: { seed: number;
         cursors: { combat: number; loot: number; seasonal: number; worldgen: number } };  // per-named-stream MONOTONIC cursors — persisted (§6.7). Weather/lunar are NOT stored — derived day-keyed (§6.7.1).
  clock: { tick: number; day: number };  // abstract time — persist ONLY the absolute monotonic day + tick. createInitialState pins tick 0, day 1; the day index is 1-BASED. season/year are DERIVED (never stored) — see season(day)/year(day) below (D-Q6, resolved: derive-don't-store). Lunar phase is likewise DERIVED — a real ~29.5-day ephemeris off `day` (§6.7.1), not stored and not a per-day RNG roll.
  currentArea: AreaId;                            // where the player IS now (set by the `travel` intent) — non-derivable, persisted (§2.19 "current location")
  resources: Record<ResourceId, number>;         // koku, coin(mon), wood, fish, materials…
  producers: Record<ProducerId, number>;         // owned counts (late-game / T3+ only)
  market: { saturation: Record<ResourceId, number> };  // bulk-sale market-saturation damper — the ONLY non-derivable economy state (weather/lunar are derived; belief-beasts are content). Persist saturation ONLY. (§2/§4, Q3/Q42)
  skills: Record<SkillId, { xp: number }>;       // total xp per skill; levels + which perks are unlocked are DERIVED (the per-skill PERKS track, §6.5)
  character: { hp: number; satiety: number; attributePoints: number;
               level: number;                    // the COMBAT-fed character (combat) level (Q1/FU14) — fed ONLY by combat-XP; floor 1. HP & attribute-points scale off it; satietyMax is DERIVED from it (base + per-level growth, Q47) — NOT stored.
               combatXp: number;                 // total combat-XP toward the next level
               attributes: Record<AttrId, number> };  // base attrs stored; effective DERIVED
  inventory: Record<ItemId, number>;             // counts (quality folded into the item key)
  equipment: Partial<Record<EquipSlot, { equipDefId: EquipDefId; durability: number; qualityTier: QualityTier }>>;  // per-slot EquipState (§2.10) — durability(→band, derived)/quality persist HERE, not in the counts-only inventory
  influence: Record<PillarId, { value?: number; highWater: number; dent: Dent | null;
                                gateEligibleValue: number;
                                subEngines?: { land: SubEngine; treasury: SubEngine; trade: SubEngine } }>;
                                                 // 4 pillars; high-water + the (≤1) active recoverable dent (§4.2.4) + a `gateEligibleValue` accumulator. ESTATE & WEALTH value is PURELY DERIVED (D-Q-estate-dent): it nests `subEngines` (each { value, highWater }) and its pillar `value` is NOT stored — it is computed on read as land + treasury + trade (the subEngine value sum), so a dent on one strand can never desync the pillar total and the trade ≤⅓ HARD clamp holds BY CONSTRUCTION. (Non-Estate pillars store `value`; Estate omits it.) `gateEligibleValue` is the DEED-ONLY accumulator (D-Q5/Model-A): only recognised Phase-2 DEEDS add to it; cross-pillar combos do NOT write it — so a combo can never satisfy a required gate band nor breach trade-≤⅓. The gate check (§6.6.1) reads `gateEligibleValue`, never the combo-inflated `value`. (SubEngine = { value: number; highWater: number }.)
  tier: TierId;                                   // current macro tier T0..T4 (set by the tier-up intent; threshold-progress is DERIVED — §6.13 item 4)
  ranks: Record<TierId, { estateService: number; combatRank: number; rung: RankId }>;
                                                 // PER-RUNG-RESET rung-meters: estateService (labour) + combatRank (martial — fed by per-rung CURATED activities, NOT raw kills/XP; renamed from v1 "combatStanding" per Q9). The phase-1/phase-2 marker is DERIVED from `rung` — there is NO separate stored phase flag (FU7).
  reputation: Record<FactionNodeId, number>;     // village per-node meters; origin ties as the O0→O5 rung meter
  allegiance: number;                            // Tama ↔ farmhand lean, continuous
  flags: Set<FlagId>;                            // story/finished/one-shot flags (serialized as array) — also the home of dialogue CHOSEN-FLAGS (the only thing an intra-line choice persists; FU22)
  unlocked: Set<SurfaceId>;                       // panels/screens/areas the player has earned — the ONLY reveal state; a WRITE-ONCE latch (reduce/tick only ADD, never remove — see the no-revealQueue callout below + §6.6.1)
  quests: Record<QuestId, { status: QuestStatus; advancedBy: Set<QuestEventId> }>;
                                                 // ORDER-FREE quests (D-Q-B14): NO `step` cursor. `advancedBy` is the UNORDERED SET of advance-events already satisfied (a quest is a SET of advance-events with no fixed order). QuestStatus = 'taken' | 'active' | 'abandoned' | 'done' | 'failed' (serialized as array).
  counts: Record<CountId, number>;               // kills, clears, harvests — drive quest advancement & bestiary tallies (NOT a separate player "achievements" feature; pillar achievement-JUMPS are recognized deeds, §2.16, not these raw counts)
  seasonalAppraisal: { lastJudgedHighWater: Record<PillarId, number>; pendingAppraisals: number };
                                                 // the §2.2 SeasonalAppraisalState — `pendingAppraisals` is a COUNTER (NOT the old `pendingAppraisalDue` boolean; B10): each crossed season boundary increments it and the tick scheduler drains it one-per-count, so a multi-season jump accrues all N appraisals (§6.3).
  effects: ActiveEffect[];                        // active buffs/injuries with remaining duration
  combat?: CombatEncounterState;                  // present only while a fight is live; NON-derivable mid-fight (consumed RNG cursor, current HP/positions/statuses cannot be recomputed) — stored so a save resumes the exact encounter; cleared when the fight ends
  log: LogEntry[];                                // event/story log — a true ring buffer (LOG_RING_MAX ≈ 300, oldest evicted); only a small TAIL (~50 lines) is persisted (§6.8)
  settings: { textScale: number; colourblindMode: boolean; reducedMotion: boolean; muted: boolean };
                                                 // CANONICAL persisted settings shape = §2.21(c) A11ySettings + AudioSettings (textScale, colorblindMode, reduceMotion, paused, liveRegionScope · ambientVolume, sfxVolume, muted); this field references that shape.
}
```

> **NON-field callout — there is NO `revealQueue` in `GameState` (FU4, supersedes Q17).** Reveal staggering
> is a **design property of the authored unlock schedule** (one-at-a-time **by construction**) — **not**
> stored runtime state. `unlocked: Set<SurfaceId>` is the *only* reveal state; a surface flips when its
> predicate passes (§6.2 `core/unlock`). Genuine multi-element single-feature reveals are bespoke one-offs
> designed per case. This supersedes Q17's "deterministic one-per-beat queue."

> **Additive-schema note (Q45/FU5).** The **M0 skeleton** stores only `{ hp, satiety, attributePoints,
> character.level = 1 }` (plus `satietyMax`-at-floor derived). The heavier optional fields —
> `combat?` (`CombatEncounterState`), `influence[...].subEngines`, and the dialogue chosen-flags — are
> **ADDITIVE OPTIONAL fields added at their milestone** (M3/M5), **never** pre-declared in the M0 skeleton.
> New stored fields are always added **optional-with-defaults**, never removed/repurposed (§6.8.2).

> **Save envelope (metadata, not game logic).** The persisted blob is a thin envelope around `GameState` —
> `{ app: 'kami-kakushi', schemaVersion, saveCounter, savedAt, state: GameState }` — where `app` is the
> **app-identity magic field**, `saveCounter` is the **monotonic** newest-wins selector, and `savedAt` is
> the **save-layer timestamp tiebreaker** (a documented core-lint exemption — §6.1/§6.8.1). These agree
> byte-for-byte with the §6.8.1 selector and the §7 M0 DoD.

### Computed (never stored) — examples from `core/selectors`

`effectiveStats(state)` (base + additive + multiplier layers + equipment + milestones + the per-skill
`skillCombatBonus` perks, FU8); `satietyMax(state)` (base + per-level growth off `character.level`, Q47);
`durabilityBand(state, slot)` (maps the stored durability integer to the 4-band multiplier, Q33/FU17);
`gateProfile(state)` (the good/great/excellent distribution across the **revealed** pillars for the hybrid
tier-gate, Q7/FU10); `productionPerTick(state)`; `unlockedSurfaces(state)` (a pure projection of the stored `unlocked` Set — **not**
a live predicate re-eval); `currentTier(state)` and
`tierThresholdProgress(state)` (against the hybrid per-pillar-per-tier bands); `skillLevel(skillId, state)`
(from xp + curve); `timeToNextGoal(state)` (for the greyed next-purchase); and the clock derivations off the
**1-based** day index — `season(day) = floor((day − 1) / 30) mod 4` and `year(day) = 1 + floor((day − 1) / 120)`.
These are pure, cheap, memoizable per-snapshot, and **excluded from the save**.

> **Why this split matters:** it keeps the save tiny and forward-compatible (you only ever migrate
> non-derivable fields), makes the renderer a pure function of state, and means a balance retune (a curve
> change) instantly reflows every derived number with **no migration** — only stored facts ever migrate.
> Reinforced by the **additive-schema rule (§6.8.2):** new stored fields are added **optional with defaults**
> (never removed or repurposed), so most schema growth needs **no migration at all** — migrations are the
> rare safety-net, not the default.

---

## 6.4.1 Three combat tracks & the sequential per-tier phase gate (the data-model view)

This is the **data-level** restatement of the §1.6.4 canon — kept explicit here because conflating these is
the single likeliest regression (the superseded v1 model fused a "Combat Level = a Combat-Deeds pool" that
coupled all three). **The combat systems feed THREE clean, separately-stored tracks; they never collapse
into one bar.** Each writes to a *different* field, and **one kill** makes this concrete:

| # | Track | Stored in | Fed by — what **one kill** writes | Distinct from |
|---|---|---|---|---|
| 1 | **Character (combat) level** | `character.level` + `character.combatXp` | the kill's **combat-XP** (`MobDef.level · COMBAT_XP_K`, §4.6.5/FU15) → `combatXp` → `level`; **plus** the equipped **weapon-line skill** XP (in `skills`). HP, attribute-points, and (derived) `satietyMax` scale off `level`. | Arms (no pillar value) and the meter (no rung progress) |
| 2 | **The Arms pillar** | `influence[Arms]` (value/highWater) | **nothing** — *unless* the kill is a **recognised** clear/defend **deed**, and **only in the tier's Phase 2** (post-final-rung; FU7). A deed writes a `pillarDelta` via the rewards bus. | character level (kills don't grant pillar value) and the meter |
| 3 | **The Combat Rank rung-meter** | `ranks[tier].combatRank` (per-rung-RESET) | **nothing** — the meter is fed **only by per-rung CURATED activities** (a designed one-to-many set, FU6/FU7), not raw kills/XP. | character level and Arms |

**The sequential per-tier phase gate (FU7).** Each tier is climbed in two phases, and the phase marker is
**DERIVED from the current `rung`** — there is **no stored phase flag**:

- **Phase 1 — climb the rungs.** The two rung-meters (`estateService` labour, `combatRank` martial) advance
  on their **per-rung-RESET** thresholds; each promotion is the **AND-gate** (meter **≥** threshold **AND**
  the rung's story flags; FU6). Pillar **DEEDS do NOT accrue** here.
- **Phase 2 — grind the house up.** Reaching the tier's **final rung OPENS** the estate-influence / pillar
  grind; **now** `pillarDeltas` accrue (deeds + the seasonal judged result, up-only/new-high-water-mark).
  Clearing the **hybrid good/great/excellent pillar profile** (`gateProfile`, Q7/FU10) is what **tiers up**
  (sets `tier`). The revealed-pillar set grows by tier — T0 = 2 (Arms + Estate), T1 = 3 (+ Office), **T2 = 4**
  (+ Name — a real gated pillar at T2 per B13/D-Q3, NOT '3–4') — matching the §3 reveal schedule and the
  §2.16(e) four-bar-panel reveal (the gate never checks "good in ALL" against an unrevealed pillar). **Conditioning** stays the **ZERO-stat
  enablement gate** on the combat rungs, orthogonal to the bounded per-skill perks (§6.2 `core/skills`).

---

## 6.5 Content as data registries (data-as-code, single source of truth)

**All content is authored as plain, typed TypeScript data in `core/content`, one module per type** — consumed
by the pure core, never co-located with DOM or behaviour. This inverts both inspiration games' mistake of
binding data to the renderer, and it is the backbone of *generate-don't-duplicate*.

| Registry module | Holds | Keyed by |
|---|---|---|
| `content/resources.ts` | resources (koku, coin, wood, fish, materials…) + display/emoji + caps | `ResourceId` |
| `content/activities.ts` | jobs/labour nodes (farm/forage/woodcut/fish/craft) — yields, skill, season/area gates. **Plus per-rung CURATED activity sets** (tagged by rung) that feed the **rung-meter** (FU6/FU7) — authored **SEPARATELY** from the pillar-deed inventory (a designed one-to-many set, never a single repeat-counter). | `ActivityId` |
| `content/producers.ts` | late-game auto-producers — cost curve refs, output, unlock predicate | `ProducerId` |
| `content/skills.ts` | skills — xp curve refs, per-event cap, visibility threshold, milestones. **Plus a per-skill PERKS track** (~2–8 perks / small flat combat bonuses, **unlocked by leveling that skill**) — the bounded labour→combat channel (FU8). The §6.6 verifier asserts **each perk's magnitude is small** (not `== 0`, not a single global cap); **conditioning stays the ZERO-stat gate**. | `SkillId` |
| `content/items.ts` | items/equipment/consumables — slots, stats, rarity, quality rules. **Weapons are the growing V2 roster: ~9–10 across v1** (T0 **starts with 1**, then **+2 T0 / +3 T1 / +4 T2**; FU13), spread over **3 archetype lines (spear / sword / staff)**, **each weapon carrying archetype params (`baseSpeed` / `reach` / `targetCount`) + a signature ability** — byte-identical with §2.8/§2.10, §3 reveal rows, and §4.6. | `ItemId` |
| `content/recipes.ts` | crafting — inputs, station tier, quality-from-skill rules, disassembly | `RecipeId` |
| `content/enemies.ts` | the **grounded** bestiary (boars/wolves/monkeys/bandits/rōnin/smugglers — NO belief-creatures in spawn tables, canon §E) — stats, attackSpeed, loot tables, **and an explicit per-mob `level` field (`MobDef.level`, defaults ~ the dangerRing's expected character-level; FU15)** feeding the on-kill combat-XP path (§4.6.5). Belief-creatures live in `beliefBeasts.ts`, never here. | `EnemyId` |
| `content/world.ts` | the world-sim rules — `SeasonRules` / `Festival` / `WeatherHazard` — the bounded **±10%** *(proposed v1 balance)* mechanical modifiers, resolved **day-keyed** via `deriveDayKeyed` (§6.7.1), nothing stored (Q55/Q3/Q35) | `SeasonId` / `FestivalId` / `HazardId` |
| `content/beliefBeasts.ts` | the **belief-creatures** (the "one-eyed mountain god," "fox-fire fox," "yamanba/tengu") as **INVESTIGATE-then-confront one-shots** — deliberately kept **OUT of the grindable spawn tables** (canon §E); never a respawn population | `BeliefBeastId` |
| `content/areas.ts` | the full per-tier maps (T0–T2 in v1) — nodes, travel edges, conditioning gates, faction | `AreaId` |
| `content/dialogue.ts` | dialogue lines — text, display conditions, the rewards object, branch locks. **Plus `choices[]` + `ChoiceId`** with `locksLineIds[]` / `flags` effects — **intra-line branching as flat DATA (not scripting)**, deterministic; **only chosen-flags persist** (FU22/Q34). | `DialogueLineId` |
| `content/quests.ts` | quests — an **UNORDERED SET of advance-events** (`advanceEvents: QuestEventId[]`, **no `step` cursor, no fixed order**; D-Q-B14), rewards (open-ended, non-waypoint). A quest moves `taken → active` when accepted, completes (`done`) once its required advance-events are all in `advancedBy` **in any order**, and can `abandon`/`fail`; the `advance_quest` intent (§6.3) folds one event into the set. **NO quest-type budget** (Q23): the PEST/HUNT/CLEAR/DEFEND taxonomy is the **T0 starting set**, not a cap — author as many quests as fit each stage, more/interesting ones welcome (esp. later tiers). | `QuestId` |
| `content/scrolls.ts` | lore scrolls — in-game-time cost, the subsystem they unlock | `ScrollId` |
| `content/surfaces.ts` | every panel / screen / tab / row / button — its **unlock predicate** + which screen it lives on (drives the UI-reveal engine and multi-screen nav). **Includes the About/Credits surface** (authorship, the commit-SHA build stamp, font/audio attributions, the license note; Q54/Q51/Q50/Q52). | `SurfaceId` |
| `content/ranks.ts` | the **fresh rank ladder PER TIER** (T0/T1/T2 enumerated for v1) — rung, track (labour/combat/mixed), earn-condition, unlock. **Each rung carries its rung-meter threshold + the AND-gate (meter ≥ threshold AND story flags; FU6)** and references the per-rung **CURATED** activity set that feeds the meter. **Encodes the combat-reveal ladder** (R3 starter weapon + bare auto-resolve + retreat → R4 durability bands → R5 stance → first weapon-L10 ability/item slots → 2nd line T1 / 3rd line T2; FU12). | `RankId` |
| `content/influence.ts` | the four pillars + the **per-pillar-per-tier good/great/excellent band triples** (the V2 overhaul — *not* simple ratios; balanced against the fixed deed inventory; values cross-ref §4) + the **phase-2 deed gating** + the **cross-pillar combos** (**Model-A**, D-Q5: a combo credits **BOTH paired pillars'** display `value`, computed post trade-clamp; it does **NOT** write either pillar's deed-only `gateEligibleValue` — so a combo can never satisfy a required gate band nor breach trade-≤⅓; FU20/Q22) | `PillarId` / `DeedId` |
| `content/effects.ts` | buffs/injuries/status — magnitude, duration, stacking | `EffectId` |
| `content/balance.ts` | shared curve/constant definitions — the *single* home for tunables; §4 sets the values. The V2 set includes: **rung-meter thresholds** (FU6), the **good/great/excellent gate bands** (FU10), **per-skill perk magnitudes** (FU8), **durability bands** (75+/50+/1+/0 → 1.0/0.9/0.75/0.55; FU17), the **satiety throttle** (flat ≥~0.7 → ~0.5 floor; FU16/FU21), **weather ±10%** (Q35), the **combat-XP→level curve** + **`mobLevel` defaults** (FU14/FU15) — **all integer-pow only (no `Math.pow`, §6.1)**. *(All V2 magnitudes proposed v1 balance.)* | (named) |

**Rewards are one shape everywhere.** Dialogue, **dialogue choices**, quests, gathering thresholds, and
combat all grant the same `Rewards` object (`{ items?, xp?, resources?, unlocks?, areas?, recipes?, quests?,
flags?, dialogues?, pillarDeltas? }`), funnelled through `core/rewards.applyRewards`. Story flags and UI
reveals ride the *same* bus — so "story" and "UI growth" are one dependency graph (a reveal reads as plot,
not menu growth), exactly as §1/§3 require. **`pillarDeltas` (deed accrual) is PHASE-2-gated (FU7)** — deeds
write **no** pillar value during the rung-climb; they accrue only after the tier's final rung opens Phase 2.
The intra-line dialogue `choices[]` effects (chosen-flags / `locksLineIds[]`) ride this same bus (FU22).

---

## 6.6 The content verifier + generated docs (generate-don't-duplicate)

**Content verifier** (`src/scripts/verify-content.ts`, run in `npm run verify`): cross-checks every id/reference
across all registries (a recipe's inputs exist; an area's travel edges resolve; a quest's reward items exist;
a rank's unlock surface exists; every `SurfaceId` referenced by a screen is registered; no orphan ids). It
also asserts the **canon invariants** as machine checks so they cannot silently rot:

- no `EnemyId` in any spawn/population table is tagged `belief-creature` (canon §E); belief-creatures live
  **only** in `content/beliefBeasts.ts`, never in a grindable spawn table;
- the **trade** sub-engine of Estate & Wealth is capped at **≤⅓** of that pillar (canon §D) — and this holds
  **EVEN AFTER cross-pillar combos**: combos are **Model-A** (credit BOTH paired pillars' display `value`),
  computed **POST** the trade-clamp, and **never write the deed-only `gateEligibleValue`**, so the verifier
  **proves trade can never breach ⅓ via a combo** (the gate and the ≤⅓ denominator both read
  `gateEligibleValue` / the clamped sub-engines, not the combo-inflated display value; FU20/Q22; see §6.6.1);
- exactly **≤1** residual-ambiguity token exists across content (canon §A);
- no Influence path is a passive per-tick trickle or flat per-action increment (accrual is jump/judged only),
  and pillar **DEEDS accrue only in Phase 2** (no deed value before the tier's final rung; FU7);
- **the bounded labour→combat cross-feed (FLIPPED from the v1 wall, Q6/FU8):** **conditioning still grants
  ZERO combat stat / training-rate bonus** (the absolute check stays — conditioning is the weak→capable
  gate); BUT each **per-skill perk** grants a **SMALL** combat bonus — so the machine check is no longer
  "labour→combat `== 0`": the verifier asserts **each perk's MAGNITUDE is small** (a per-perk magnitude
  bound), **NOT** `== 0` and **NOT** a single global `≤ CAP` (see §6.6.1);
- **macron / no-plain-ASCII-romaji lint:** display/name strings use proper-Hepburn **macrons** (Tōkichi,
  Yagōemon, Kyūsuke, *gōshi*, *rōnin*, *kyō-masu*) — the verifier flags plain-ASCII romaji that should carry a
  macron, so no ASCII-slip can land in shipped text (canon §H). **Allow-list:** naturalized English exonyms —
  *shogun, yokai, samurai, Osaka, daimyō* (written with its macron) — plus the **invented-place
  allow-list incl. *Nihonbashi*** (Q12) are exempt and may stay in their common form. The lint examples track
  the **"Combat Standing" → "Combat Rank"** rename (Q9), and the lint cross-links the **real-name DENYLIST**
  (§6.6.1).

**Generated docs** (`src/scripts/gen-docs.ts`): a Node entry that imports the same registries the game runs on and
writes balance/content tables into `docs/` — aligned to **`docs/balance/`** (e.g. `docs/balance/curves.md`,
`docs/balance/gates.md`) and **`docs/content/`** (e.g. `docs/content/bestiary.md`, `docs/content/areas.md`,
`docs/content/ranks.md`, `docs/content/influence.md`). Run with `--check` in `verify` to fail the build if the
committed docs drift from the data. This is the convention *generate, don't duplicate* made literal:
balance/content tables are **never hand-maintained twice** — they are a build artifact of the one source of
truth. Any illustrative number duplicated **in prose** is tagged **"illustrative — see generated"** (Q41) so a
hand-typed derived value can never silently drift from its generated source.

---

## 6.6.1 V2 verifier invariants

The V2 decisions add a cluster of machine checks (collected here; run inside `verify-content.ts` alongside the
§6.6 canon invariants). These exist so the load-bearing V2 properties **cannot silently regress** — especially
the three-track separation and the hybrid gate.

- **Gate-monotonicity & ceiling (Q28).** No rung's rung-meter threshold and no tier's hybrid gate require
  **more than that tier can grant** (the meter target exists and is reachable from its eligible activities;
  the gate band is achievable from the tier's available deeds). Asserted against the **same ≥30-min floor**
  the §4.8 pacing model uses (FU6) — so the rung-meter thresholds and the §4.8 pacing curve cannot diverge.
- **Accrual tie-out (Q28).** The tier's **deed inventory sums to the gate share within tolerance** — the
  fixed Phase-2 deed inventory (e.g. T0's Estate/Arms deeds) ties out against the re-derived hybrid bands, so
  a balance edit on one side that breaks the other fails the build.
- **Per-rung-meter reachability (FU6).** Each rung's meter target is reachable from its **eligible curated
  activities** at the back-solved rate; an un-feedable meter is a build failure.
- **Per-skill-perk magnitude (the FLIP, Q6/FU8).** Each per-skill perk's `skillCombatBonus` is **small /
  bounded** (a per-perk magnitude check) — **not** `== 0` (the old absolute wall is removed) and **not** a
  single global `≤ CAP`; **conditioning is asserted ZERO** (still the gate). Each of the **three combat
  tracks sums INDEPENDENTLY** (a kill's XP never reaches Arms or the rung-meter; a deed never reaches level
  or the meter; a curated activity never reaches level or Arms) — FU14.
- **Trade-≤⅓-holds-post-combo proof (FU20/Q22 · D-Q5).** The verifier proves the **trade sub-engine ≤⅓ of
  Estate & Wealth even after cross-pillar combos**. Combos are **Model-A** (credit BOTH paired pillars'
  display `value`), computed post-clamp, and **never write the deed-only `gateEligibleValue`** — and since
  Estate's pillar value is itself **purely derived** from the clamped sub-engines (D-Q-estate-dent, never
  stored), a combo can **never** breach ⅓.
- **Hybrid gate-distribution check (Q7/FU10).** The tier-gate is **good in ALL revealed pillars · great in
  2–3 · excellent in 1–2**, with the **T0 2-pillar special case** (Arms + Estate) and **NO**
  overflow-substitution; and the gate reads each pillar's deed-only **`gateEligibleValue`** (NOT the
  combo-inflated display value), so a **combo can never** satisfy a required pillar or the "good in ALL"
  check. The revealed-pillar set per tier (**T0 = 2 / T1 = 3 / T2 = 4** — the T2 set is **Arms + Estate +
  Office + Name**, a single value **4**, since Name IS a real gated pillar at T2 per B13/D-Q3; NOT '3–4')
  must match the §3 reveal schedule and the §2.16(e) panel reveal (the gate never checks an unrevealed
  pillar).
- **`gatesSpine` always-false in v1 (B13/D-Q3 consequence).** The quest `gatesSpine` flag has **no v1
  consumer** — the verifier asserts **`gatesSpine === false` for every quest in v1 content** (no quest gates
  the main spine), so a stray `true` can't silently introduce a hard story-gate the v1 design never wired up.
- **Real-name DENYLIST lint (Q27/Q28/Q39/Q11).** A denylist flags **real surnames / places** (e.g. *Toyama*,
  *Konoe*, real daimyō / place names) so an invented-name slip can't land in shipped strings — maintained
  alongside the macron lint. **Allow-list:** naturalized exonyms + the **invented-place allow-list (incl.
  *Nihonbashi*, Q12)**. It also flags the **superseded** names **Mago** / **Naozane** / **Obaa Sato** so they can't be
  reintroduced; the shipped names are **Heita** / **Mosuke** / **Obaa Kuni** (field-lad **Heita** ≠ antagonist **Magobei**; clerk **Mosuke** ≠ heir **Naoyuki**; herbalist **Obaa Kuni** ≠ **Sayo**).
- **Tick split-invariance & full-drain (B10).** A determinism check asserts `tick(s, a + b) === tick(tick(s,
  a), b)` for non-negative integers `a, b` (the scheduler folds **one tick at a time**, per-day/week/season
  plans fire once each in **fixed registry order**), and that a multi-season `dtTicks` jump **drains the
  `pendingAppraisals` counter fully** (accrues all N appraisals, never collapsing them) — so a long jump can
  never silently skip an appraisal.
- **Unlock-latch monotonicity (FU4).** A guard asserts a surface **never leaves `unlocked` once entered** — `reduce`/`tick` only ever ADD to the latch (write-once); a scripted run that re-checks every prior unlock after each step proves no `SurfaceId` is ever removed.
- **Save-envelope-size budget.** The persisted envelope stays within a size budget (**≤ ~64 KB typical**), provable from the **bounded** collections — the persisted log **tail (~50 lines)**, capped inventory/equipment/quest/flag sets — so no field is an unbounded persisted growth (ties to the `LOG_RING_MAX ≈ 300` ring eviction, §6.4/§6.8).

---

## 6.7 The one seeded RNG

**One seeded RNG for the entire game** (canon §H, convention *one RNG*). A small, fast, well-distributed
generator — **splitmix64** (LOCKED, §6.13 #2), seeded at new-game from a stored seed.

> **Exact-arithmetic mandate (D-Q-numeric / Q16+Q17).** splitmix64's mixing needs full 64-bit integer
> arithmetic, which is **not exact** in a JS `number` (53-bit-safe integers only). To guarantee
> **byte-identical replay**, the seed + cursor state is held and advanced either **as `BigInt`** (exact 64-bit)
> **or** via a **53-bit-safe splitmix variant** whose every intermediate stays within ±2^53 — chosen so cursor
> arithmetic is **exact** with no silent precision loss. The choice is **unit-asserted** against a fixed
> reference sequence. Whichever is used, the *persisted* cursors serialize losslessly (a `BigInt` as a
> decimal/hex string in the envelope; a 53-bit-safe variant as plain integers).

- **It is part of `GameState`** as **per-named-stream MONOTONIC cursors** —
  `state.rng = { seed, cursors: { combat, loot, seasonal, worldgen } }` — and is **saved & loaded**, so
  resumed games stay deterministic and reproduce exactly. (This **replaces** the v1 `{ seed, counter }` shape
  *and* the "derive child RNGs by splitting" model: each named subsystem advances **its own** cursor, so
  combat rolls, loot rolls, seasonal rolls, and world-gen rolls are reproducible **without coupling**, still
  rooted in the one seed.)
- The API is **pure**: `next(rng, stream) -> [n, rng']` returns the value *and* the advanced RNG (only that
  stream's cursor moves); helpers (`rngInt`, `rngChance`, `rngPick`, `rngWeighted`) thread the new RNG back
  into `GameState` via `reduce`/`tick`. **Combat and loot** are the v1-active named streams; the **seasonal and
  worldgen** cursors are **declared for forward-compat** and **no v1 consumer advances them** (FU3 — so the
  cursor-usage verifier won't flag them as forever-zero). **Dialogue stays no-RNG** (§2.12).
- **`Math.random()` is banned in `core/` by lint** (§6.1) — there is no second, hidden source of randomness —
  and so are **`Math.pow` / `Math.exp` / `Math.log` / trig** (§6.1, Q36): every growth-curve power is
  integer-pow, so a fixed seed replays **byte-identically** across engines and an exported save is portable.
- **Weather / festival rolls are NOT a persisted cursor.** They are re-derived **stateless and
  day-keyed** via `deriveDayKeyed(seed, 'weather'|'festival', day)` (§6.7.1) — nothing weather-related is
  stored. **Lunar phase is NOT a roll at all** — it is a real continuous ~29.5-day ephemeris,
  `lunarPhase(day) = f(absoluteDay mod LUNAR_PERIOD)`, derived off the absolute monotonic day alone (no seed,
  no RNG; §6.7.1).
- **`tick` consumes whole-integer `dtTicks`** (the app loop accumulates the fractional remainder; §6.3) so
  the abstract clock advances in deterministic integer steps.

> This is what lets a saved fight resume identically, lets the DEV play API force a rare loot/crit outcome by
> seed, and lets Vitest assert byte-identical replays.

---

## 6.7.1 Stateless day-keyed derivations (weather / festivals) + the lunar ephemeris

Anything that is a **pure function of `(seed, day)`** is **derived on read, never stored** — so the save stays
minimal and replays stay byte-identical. The helper is:

```ts
// PURE & STATELESS — not a persisted cursor; no GameState mutation.
function deriveDayKeyed(seed: number, channel: 'weather' | 'festival', day: number): number;
// RETURNS a NORMALIZED fraction ∈ [0, 1) — e.g. (splitmix64(mix(seed, channel, day)) mod 2^53) / 2^53 —
// so the ±10% weather / judged bands are well-defined and replay-stable.

// Lunar phase is NOT a seed-keyed roll — it is a REAL continuous ~29.5-day ephemeris (D-Q6):
// PURE & STATELESS, a deterministic function of the absolute monotonic `day` ALONE (no seed, no RNG).
function lunarPhase(day: number): number;   // f(day mod LUNAR_PERIOD), LUNAR_PERIOD ≈ 29.5; ∈ [0, 1) — new→full→new, continuous
```

- **Weather / festival modifiers** are reproduced from `seed + day` whenever the per-day scheduler (§6.3) or
  a selector needs them — e.g. the bounded **±10%** *(proposed v1 balance)* mechanical modifier on the
  seasonal judged result, or the day's weather hazard. Because they are recomputed (not stored), they **cost
  nothing in the save**, **never go stale**, and **can never desync** from the seed.
- **Lunar phase is a real ephemeris, not a roll (D-Q6).** It is a **continuous ~29.5-day cycle** computed as
  `f(absoluteDay mod LUNAR_PERIOD)` — a smooth new→full→new progression, **deterministic off the absolute
  monotonic `day` alone** (no seed, no RNG cursor, no per-day randomness). This is why season/year (§6.4) and
  the moon are all **derived from `day`** rather than stored: they can never desync.
- This is **distinct** from the four persisted RNG cursors (§6.7): the cursors are *consumed* monotonically
  by gameplay (combat/loot/seasonal/worldgen draws), whereas `deriveDayKeyed` is a **stateless re-derivation**
  keyed by the calendar day and `lunarPhase` is a **deterministic ephemeris**. The **only** non-derivable
  economy state is `market.saturation` (§6.4) — weather, lunar phase, season and year are not stored at all.

---

## 6.8 Save model — multi-backend redundant atomic save, additive-schema minimal-state

Per **D-013 / canon §H** and the V2 decisions (Q37/Q44/Q45/Q46/FU1–FU2/FU5): robust, durable,
static-friendly, **no backend** — and now hardened to survive **itch's cross-origin-iframe partition /
eviction**. The **FULL layer is built in M0** (FU1); rich per-system fields are added additively later.

- **Multi-backend redundant store (Q37/FU1).** The save is written **redundantly to every available
  backend** — **IndexedDB (primary) + localStorage + sessionStorage** — behind a backend-abstraction. On
  load it reads **ALL** backends and **picks the newest** (§6.8.1). Redundancy hedges the *non*-partitioned
  failure cases (a single backend wiped or isolated) — but it is **NOT** failure-independent inside itch's
  cross-origin iframe, where the three may share **one partition** (redundancy degrades to ~1 effective
  there); the **real** durability guarantee is the crash-recovery last-known-good ring (§6.8.3) + export/import
  (Block N.1 #5, §6.8.1). Autosave fires on a debounced cadence (after meaningful intents and **on a tick
  interval** — also a §7 M0 DoD trigger) and on `visibilitychange`/`beforeunload`.
- **Atomic write (Q44).** Each backend gets **one atomic put** of the whole envelope — **never** a
  clear-then-rewrite (no torn/half-written save). On **any** write rejection (quota / private-mode /
  torn write) the app shows a **calm, persistent "couldn't save — export a backup" banner** — **no silent
  loss** (§6.8.1).
- **App-identity magic field (Q46).** Every blob carries `app: 'kami-kakushi'` for a fast reject of
  foreign/corrupt data; on a bad/foreign id the loader **rejects to recovery** (offer re-import / fresh
  start), never a silent half-load (§6.8.1).
- **Export / import: base64 to a text file (Q37).** The same serialized envelope is base64-encoded for
  copy-paste / file export and import — the player's **portable backup** (and a hand-off path for QA). It is
  kept as a **first-class, periodically-nudged backup** (the matrix-plus-nudge posture) so silent autosave
  loss is caught early. Import validates the magic field + migrates.
- **Persist only non-derivable state (§6.4).** The save is the **stored** surface of `GameState` wrapped in
  the metadata envelope `{ app, schemaVersion, saveCounter, savedAt, state }`: **RNG cursors** (`seed` +
  `cursors{combat,loot,seasonal,worldgen}` — *not* a single counter), **clock (absolute `day` + `tick` only —
  season/year/lunar are DERIVED, not stored; D-Q6)**, current area, resources, producer counts,
  **`market.saturation`**, skill xp, base attributes, current vitals (hp / satiety / attribute-points),
  **`character.level` + `combatXp`**, inventory, equipment, influence pillars (high-water + dents + the
  deed-only **`gateEligibleValue`**; non-Estate `value` — but **Estate value is DERIVED from
  `estateWealth.subEngines`, NOT stored**, §6.4/D-Q-estate-dent), stored tier, the **per-rung-reset
  rung-meters** (`estateService` / `combatRank`), reputation, allegiance, the **`seasonalAppraisal`**
  (`pendingAppraisals` counter + last-judged high-water; B10), flags (incl. **dialogue chosen-flags**),
  unlocked surfaces, **quest status (the order-free `advancedBy` set, no step cursor; D-Q-B14)**, counts, the
  live combat encounter (present only while a fight is live), **only a small TAIL (~50 lines) of the event-log
  ring** (`LOG_RING_MAX ≈ 300`, §6.4 — the rest is runtime-only), active-effect remainders, settings.
  **Heavier optional fields are added additively per milestone** (M3/M5), never pre-declared at M0. **All
  derived stats are recomputed on load** by the selectors — never serialized (weather is re-derived
  day-keyed, lunar is a derived ephemeris, season/year derive from `day`; §6.7.1).
- **Additive-schema-first, migrations as the safety net (Q45/FU5).** New stored fields are added as
  **optional with defaults** (never removed/repurposed) so **most schema growth needs no migration at all**;
  the ordered migration chain + raw pre-migration backup + future-version guard remain the **rare safety net**
  for unavoidable structural changes (§6.8.2).
- **Validate + degrade gracefully on load (`validateLoadedState()`, D-Q9).** A `validateLoadedState()` gate
  sits at the **persistence→core boundary** (after migration, before the state reaches the running core). It
  **clamps/defaults cosmetic out-of-range fields** (e.g. an off-range `settings.textScale`, a negative count)
  so a trivially-dirty field never becomes a wall; but a **structurally-broken / unsalvageable** state
  (NaN/missing-required/internal-bug residue, or a corrupt/unreadable/foreign-id save) is **routed to the
  existing §6.8 recovery flow** (offer re-import or a fresh start) — **never** a scary "save is kill" wall and
  **never** a dead end (it honours the Q44 calm **"couldn't save / export a backup"** posture). It also
  **re-asserts the load-bearing core invariants ON LOAD** — the **trade-≤⅓** sub-engine clamp and the
  **up-only / high-water-mark** pillar rule — re-establishing them from the loaded data (Estate value is
  re-derived from the clamped sub-engines, §6.4) so no hand-edited or bit-rotted save can smuggle in an
  out-of-contract pillar/trade state. A pre-migration backup of the raw bytes is kept so a failed migration is
  recoverable.
- **Save-safety on destructive actions (Q19).** Genuinely-destructive actions (import-over,
  fresh-start, and only truly-unrecoverable rare actions) require an **explicit confirm**, and an
  **automatic pre-overwrite snapshot** (an extra write in the multi-backend matrix) is taken **before** any
  overwrite — so a misclick is recoverable.
- **Multi-tab play is UNSUPPORTED in v1 (D-Q7).** There is **no leader-election / no cross-tab lock** — two
  tabs open on the same game is **last-writer-wins** (the most recent successful save overwrites). We accept
  this footgun for v1 (cheapest option) and **document it** rather than build coordination; revisit only if it
  bites. (The newest-wins `saveCounter` selector still picks the most recent blob on the next load, but
  concurrent tabs can still clobber each other's progress mid-session.)
- **No offline accrual on load.** Active-only: load restores the exact saved `GameState` and resumes; there is
  no time-skip catch-up.

**Persistence lives in `src/persistence/`** (the multi-backend access layer, the atomic write + magic field +
newest-wins selector, the base64 codec, the migration chain). It is side-effectful and is **never imported by
`core`** — `core` only produces the plain serializable `GameState`; the app layer wraps it in the envelope and
hands it to persistence. (The only wall-clock read in the whole app — `Date.now` for `savedAt` — lives here,
under the documented §6.1 save-layer exemption.)

---

## 6.8.1 Multi-backend redundant save + newest-wins arbitration

> Spec for the redundant write + the newest-wins **selector**. Built **in full at M0** (FU1) — only the itch
> cross-origin-iframe *acceptance test* is deferred to M7.

- **Redundant write.** On save, the app writes the **same envelope** atomically to **IndexedDB +
  localStorage + sessionStorage** (whichever are available). Each is **one atomic put** of the whole blob
  (never clear-then-rewrite). On any backend's rejection, the calm **"couldn't save — export a backup"**
  banner is shown and stays until a save succeeds — never silent loss (Q44).
- **Honesty about redundancy under itch's iframe (Block N.1 #5).** These three backends are **NOT
  failure-independent inside itch's cross-origin iframe**: there they may share **one storage partition**, so
  the redundancy can degrade to **~1 effective backend** (a partition eviction can take all three at once). We
  therefore make **no unqualified "3× redundant" claim**. The multi-backend write is a best-effort hedge
  across the *non*-partitioned cases; the **REAL durability guarantee** is the **crash-recovery
  last-known-good ring (§6.8.3) + the player-facing export/import backup** — which is why both are first-class
  and the export backup is periodically nudged.
- **App-identity magic field.** Each blob leads with `app: 'kami-kakushi'`; on load a blob whose `app`
  differs (foreign/corrupt) is **rejected to recovery**, never half-loaded (Q46).
- **Newest-wins selector (FU2).** On load the app reads **every** backend and selects the newest **readable**
  one by this order:
  1. **the monotonic `saveCounter` is the REAL selector** — it increments once per successful save and is
     immune to clock skew;
  2. the **save-layer `savedAt` timestamp is only the TIEBREAKER** (a documented **core-lint exemption** —
     *metadata, not game logic*, §6.1) when counters are equal;
  3. **NEVER load a forward-`schemaVersion` backend** (a future-version blob from a newer/CDN-stale build has
     no forward migration) — **fall through** to the newest *readable* lower-or-equal-version backend; if none
     is loadable, **reject to recovery** (preserve the raw bytes for re-import in a newer build) — never a
     silent half-load and never a downgrade that overwrites the real autosave.
- **Agreement.** This selector, the §6.4 stored envelope metadata (`app` / `saveCounter` / `savedAt`), the
  §6.1 save-layer lint exemption, and the §7 M0 Definition-of-Done describe **one** mechanism.

---

## 6.8.2 Additive backwards-compatible schema & migration safety net

> Makes the **additive-optional-fields** model the **PRIMARY** schema-growth mechanism (protobuf/thrift-style),
> with ordered migrations demoted to a rare safety net (Q45/FU5).

- **Primary mechanism — additive optional fields with defaults.** New stored fields are added **optional,
  with a default** applied on read, and existing fields are **never removed or repurposed**. An older save
  loaded by a newer build simply reads the new fields as their defaults — **no migration needed.** This is why
  the M0 skeleton (`{ hp, satiety, attributePoints, character.level }`) can grow into the full V2 state
  (`combat?`, `estateWealth.subEngines`, dialogue chosen-flags, the rung-meters…) **additively, per milestone
  (M3/M5)**, without a migration per field.
- **Safety net — ordered migrations (rare).** For the unavoidable **structural** change that additivity can't
  express, `schemaVersion` is stored and an ordered list of `migrate_vN_to_vN+1(save)` steps runs on load to
  bring an old save current (each migration a pure, unit-tested function, in `persistence/migrations/`). A
  **raw pre-migration backup** of the bytes is kept so a failed migration is recoverable.
- **Future-version guard.** A save whose `schemaVersion` **exceeds** the running build's takes the same calm
  degrade-gracefully recovery as a corrupt save (raw bytes preserved for re-import in a newer build) — never a
  silent half-load (ties to the §6.8.1 forward-version fall-through).
- **Pre-overwrite snapshot.** Before any overwrite of the live autosave (incl. import-over / fresh-start), an
  automatic snapshot is taken (Q19). We support ordered forward migrations indefinitely + the raw backup,
  but do **not** guarantee cross-major-rewrite compatibility — a future ground-up schema change may legitimately
  retire very old saves with a clear message.

---

## 6.8.3 Crash recovery — error boundary, last-known-good ring, safe-mode boot (D-Q-B12)

> A new lock (B12 → ADR): the save layer is durable, but a **poisoned in-memory state** (an internal bug that
> throws in `tick`/`render`, or a NaN that propagates) must not (a) hard-brick the app, nor (b) get autosaved
> over the last good state. This subsection is the **real durability guarantee** referenced by §6.8.1.

- **Error boundary around `tick`/`render`.** The app-layer loop wraps each `tick(state, dt)` and each
  `render(state, prev)` in an **error boundary**. An uncaught throw is **caught** (not a white-screen) — the
  app stops advancing the loop, surfaces a calm error surface, and enters the recovery path below instead of
  crashing the tab.
- **Crash-counter persisted OUTSIDE `GameState`.** A small `crashCounter` (+ last-crash marker) lives in its
  **own persistence key**, *not* inside `GameState` / the save envelope — so a poisoned save can't carry a
  reset/garbled counter, and the counter survives a failed load. It increments on a caught crash and resets on
  a clean run.
- **Rolling last-known-good save RING.** Beyond the single autosave, the persistence layer keeps a **small
  ring of recent KNOWN-GOOD snapshots** (states that completed a clean tick+render and passed
  `validateLoadedState`). Recovery / safe-mode can **roll back** to the newest good ring entry.
- **Autosave-poison suppression.** A state that just **threw** (or fails `validateLoadedState`) is **NEVER
  written over the good ring** — the autosave is **suppressed** for a poisoned state so the last-known-good
  entries stay intact. (This is the §6.8.1 durability guarantee in practice: even where backend redundancy
  collapses, the good ring + export/import are what actually saves the player.)
- **Repeated-crash → safe-mode boot.** If `crashCounter` exceeds a small threshold across boots, the app
  boots into **safe mode**: it does **not** auto-resume the (suspected-poison) live autosave but instead
  **offers a rollback** to the newest last-known-good ring entry (or a raw-bytes export / fresh start) — a
  calm, explained choice, never a silent loss and never an infinite crash-loop.

---

## 6.9 Renderer contract (thin DOM, multi-screen, responsive, active-only)

**The renderer is a thin DOM layer in `src/ui/` with zero game logic** (D-013). It is a (near-)pure function
of `GameState`: `render(state, prevState)` reconciles the DOM against the new snapshot; it does **not** compute
outcomes and does **not** mutate state — it only **dispatches intents** back to the core. The combat renderer
animates the deterministic result (filling bars, floating numbers); it never decides the fight.

**Reveal-on-load (no re-spam).** On load the renderer's `prevState` is set to the **loaded `GameState`**, so the
first `render(state, state)` yields an **empty reveal diff** — no re-animation, no re-played reveal lines.
Once-per-game reveal log-lines are emitted by the `unlocked` write-once latch **inside `reduce`/`tick`** (§6.3),
**not** by the renderer diff — so reloading a save never re-spams the log. *(Test note: `load(save)` →
`render(state, state)` produces **zero animations and zero new log lines**.)*

- **Data-driven surfaces.** Every panel/screen/tab/row/button is described by `core/content/surfaces.ts` with
  an unlock predicate; the renderer shows only `unlockedSurfaces(state)`. "The UI is incremental" is a tunable
  content table, **not** hardcoded view logic. **Reveals are DESIGN-staggered one-at-a-time** (the
  NO-UI-DUMPS principle) driven by the **authored unlock schedule** — there is **no runtime reveal-queue**
  (FU4/Q17); the renderer just shows the surfaces in `state.unlocked` (the stored write-once latch — §6.4),
  never a live predicate re-eval. Each first-time reveal pushes a diegetic line to the event log (the reveal
  reads as plot) — emitted by the `reduce`/`tick` latch transition (§6.3), not the renderer diff.
- **Multi-screen UI, progressively revealed (canon §H).** There is a real multi-screen shell with navigation
  (e.g. Estate / Village / Wilds / Skills / Combat / Influence / Map / Journal / Settings screens), but
  **nav and screens are revealed as earned** — so it *appears single-screen early* (minute one is one verb +
  the log) and grows into a full multi-screen app. The nav is itself driven by unlock predicates. **Distinct
  activities get their OWN top-level nav tabs (Q10) — Crafting and Quests are top-level tabs, NOT nested
  panels** — so the **main screen stays the active labour/deeds/combat loop**; any distinct non-critical
  activity gets its own top-level tab (still revealed one-at-a-time).
- **Responsive desktop + mobile, NOT hover-dependent (canon §H).** A fluid layout (CSS grid/flex,
  container/media queries) that reflows columns→stacked on narrow screens; **all information reachable without
  hover** — any hover tooltip has a tap/focus-equivalent, and "Shift for more detail" is an *enhancement*, never
  the only path to a value. Touch targets are comfortably sized. **Mobile IA rule (Q19):** the **per-tier
  PRIMARY tabs** (the current tier's core surfaces) sit on the **bottom bar**; older/secondary tabs move to an
  **overflow drawer in reveal order**, so the bottom bar never overflows as the app grows.
- **Art register = text + emoji + inline SVG + CSS + a small audio set (D-013 / canon §H; Q38/Q50).**
  Woodblock-style palette, kanji season tags, colour-coded rarities, CSS flourishes; **inline SVG for
  load-bearing period motifs** (pillar / season / rarity / rank-seal marks — identical across OSes; **emoji are
  COSMETIC-ONLY**), plus the **small curated audio set** (synthesized Web Audio + original/CC0 — §6.1.1). A
  small canvas is permitted ONLY for optional ambient FX (seasonal particles), **never for logic**. Colour is
  never the *sole* carrier of meaning (see §6.11).
- **Legible progression feedback (cross-ref `ui-design.md`; Q21/Q48).** **Pillar bars show distance-to-next-gate**;
  gain/loss **number-flash uses the §2 gain/loss tokens**; **vermilion is reserved for rank-up / seal beats**
  (not routine gains); **functional/hint text uses `--ink-soft`** (passes WCAG AA on every paper surface) while
  `--ink-faint` is decorative-only, and the meter fill is darkened for contrast.
- **Number formatting = abbreviated K/M/B (canon §H).** Large values display **human-scaled, abbreviated**
  (e.g. `12.4K`, `3.1M`, `2.7B`) — **not** scientific notation (`1.2e7`) and **not** myriad units
  (man/oku). A single shared display formatter **lives in `core/format`** (a pure helper — and the other pure
  display helpers — moved OUT of `src/ui/` into core, **table-driven boundary tests under `npm run verify`**:
  `999,999 → '1.0M'`, etc.); **the renderer imports it**. It keeps the scale legible as koku/coin/pillar
  numbers climb.
- **Active-only loop, with the "leave it running" feel (FU23).** The app-layer tick loop runs only while the
  tab is active (driven by `requestAnimationFrame` / a paced timer); it computes whole-integer `dtTicks` from
  elapsed active time and calls the pure `tick`. **While the tab is OPEN, auto-resolve combat + auto-repeat
  labour run unattended for hours** (the "leave it running, check progress" feel) — but it is **strictly
  active-only: no offline catch-up**, and auto-producers stay **T3+**. Backgrounding pauses; a user **pause**
  is supported.
- **One render path.** Updates go through `render(state)` reconciliation — not scattered manual
  `update_displayed_*` push-calls — which kills the stale-UI class of bug by construction.
- **Log DOM-node lifecycle.** The log renderer **reconciles by keyed `id`** and **removes / virtualizes the
  DOM nodes for evicted ring entries** — so the **live log-node count stays ≤ the `LOG_RING_MAX ≈ 300` ring
  cap** (§6.4/`core/log`) over an hours-long unattended run; this **live log-node-count ≤ ring-cap** budget is
  an assertion in the M6 long-run perf/audit sweep.
- **XSS guardrail (untrusted-text safety).** Every **state-derived / persisted / IMPORTED** string — the
  **event log above all** — renders via **`textContent` / `createElement`'d fragments**, **never** `innerHTML`
  and **never** a markup parser run over persisted text. The log persists **`{ messageId, args }`**, not
  resolved markup, so text is templated at render time. The **imported save is the sole untrusted-text
  channel**, so this closes the only injection surface.

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
  pacing(): PacingTelemetry,                // accumulated fun-proxy metrics this run (qa-playtesting.md §3)
  reveals(): RevealLogEntry[],              // what unlocked + when (tick/season) — the reveal-cadence proxy (qa-playtesting.md §1)
  advanceSeason(): void, toRung(id: RankId): void, toTier(n: TierId): void,  // time-compression helpers — fast-forward to a checkpoint (qa-playtesting.md §1)
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

Solid basics (canon §H), wired so they cannot be an afterthought — and the **low-cost correctness items are
done now** (Q18):

- **Scalable text** (a `textScale` setting on `GameState.settings`, applied via CSS custom property; respects
  the browser/root font size). A **large-textScale reflow case** is included in the acceptance checks (the
  layout must not clip/overlap at the largest scale).
- **Colourblind-safe cues:** colour is *never* the sole signal — rarities/severities also carry an
  icon/inline-SVG and/or text label; a `colourblindMode` setting swaps to a safe palette.
- **Contrast (Q48):** **functional/hint text uses `--ink-soft`** (passes WCAG AA on every paper surface);
  **`--ink-faint` is decorative-only** (never carries a value); the meter fill is **darkened for contrast**.
- **Keyboard + touch:** full keyboard operability (focus order, visible focus ring, no hover-only controls —
  ties to §6.9's not-hover-dependent rule) **and** comfortable touch targets.
- **Reduced motion:** a `reducedMotion` setting (and `prefers-reduced-motion` honoured) downgrades the ambient
  canvas FX and number-float animations.
- **Pause:** the active loop can be paused (also an accessibility/comfort feature).
- **Semantic structure + live region (Q18):** the event/story log is an ARIA live region (with an accessible
  name), **scoped to narration + milestones (`polite`)** so reveals/important events are announced to
  assistive tech without spamming routine ticks; the shell uses **named ARIA landmarks** (`banner` header,
  `navigation` rail, `main` workspace) and labelled controls, plus a **skip-to-log / skip-to-content link**
  and a **persistent quiet a11y entry point from minute one** so keyboard and screen-reader users jump
  straight to the content instead of tabbing through the growing (~9-entry) nav on every screen. A
  **screen-reader acceptance pass** is part of the checklist.
- **Language of parts (WCAG 3.1.2):** every Japanese-script run (kanji pillar/rank/season labels, incl.
  *gōshi*/*rōnin* and the **"Combat Rank"** term) is marked `lang="ja"` and romanized terms `lang="ja-Latn"`,
  so assistive tech pronounces them instead of reading Unicode glyph names or skipping them; the §6.6
  romanization lint also flags any untagged CJK in rendered strings.
- **Mute:** light ambient beds + UI/event SFX (the §6.1.1 curated set) with a mute toggle (canon §H audio note).

---

## 6.12 How this satisfies the project conventions

| Convention (CLAUDE.md) | How §6 satisfies it |
|---|---|
| **Pure-core boundary** | All logic/state/math in `src/core/` with **zero DOM/canvas/window** — enforced by an ESLint boundary rule (build failure, not review). Renderer consumes plain data; one-directional dependency. The only wall-clock read (`Date.now` for the save-`savedAt` tiebreaker) is a **documented save-layer exemption** in `persistence/`, never in core. (§6.2, §6.1) |
| **Determinism: one RNG** | A single seeded RNG **in `GameState`** as **per-named-stream MONOTONIC cursors** `{ seed, cursors:{combat,loot,seasonal,worldgen} }`, saved/loaded; pure per-stream `next` (no child-RNG-by-splitting); **stateless day-keyed weather/lunar** (re-derived, not stored); **`Math.random()` AND `Math.pow`/`exp`/`log`/trig lint-banned** in core (integer-pow only). Replays are byte-identical (Vitest-asserted). (§6.7, §6.7.1, §6.3, §6.1) |
| **Single source of truth — generate, don't duplicate** | Content is typed data registries (`core/content`); a **hardened** content verifier cross-checks ids and the **V2 invariants** (gate-monotonicity/ceiling, accrual tie-out, **per-perk magnitude** [flipped from `==0`], **real-name denylist**, **trade-≤⅓-post-combo proof**, hybrid gate-distribution); balance/content docs are **generated** into `docs/balance/` + `docs/content/` from the same data and `gen:docs --check` fails the build on drift. (§6.5, §6.6, §6.6.1) |
| **Playtest via code, not synthetic input** | DEV-only `window.__qa` (read state, drive intents, tick/frames, pause, force-state, seed) drives the **real** typed intents headlessly; powers `capture-game-states` and pacing/unlock regression. (§6.10) |
| **Active-only, no offline (D-013/canon §H)** | `tick` takes **whole-integer abstract** ticks (the app loop accumulates the fractional remainder); the active-only loop lives in the app layer and runs **auto-resolve combat + auto-repeat labour while the tab is open** (the "leave it running" feel, FU23); load resumes the exact saved state with **no** offline accrual code path; auto-producers stay T3+. (§6.3, §6.8, §6.9) |
| **Lean / high-impact** | One `npm run verify` gate; minimal stored save (additive-optional growth, §6.8.2); no speculative subsystems — the module list maps 1:1 to systems already locked in §§1–5; anything bigger is parked for §7's roadmap. (§6.1, §6.4, §6.8.2) |

---

## 6.13 §6 decisions → ADR (proposed)

§6 is **no longer "elaboration only."** It still adds buildable detail that **refines** the already-locked
**D-013** (module layout, the `reduce`/`tick`/rewards contracts, the stored-vs-computed split, the registry
set, the verifier + generated-docs gate, the `__qa` surface — recordable as a child ADR **D-013a — tech
architecture detail**). **But §6 also IMPLEMENTS the V2 decisions under the governing ADR D-022**
(most-recent-wins) — real reversals / new locks, not just detail: **multi-backend redundant save** (Q37/FU1),
**additive backwards-compatible schema** (Q45/FU5), **per-named-stream RNG cursors + stateless day-keyed
weather** (Q2/FU3), the **`Math.pow` ban → integer-pow** (Q36), the **bounded labour→combat verifier flip**
(Q6/FU8), the **feature-rich data model** incl. **intra-line dialogue** (Q34/FU22) & **`estateWealth.subEngines`**
(Q34/FU20), the **no-runtime-reveal-queue** design rule (FU4), and the **bundled-asset-set correction**
(Q50/Q52/Q38). Final ADR numbering is set at integration.

### Flagged for the human — superseded resolutions annotated (newest-wins, don't-delete)

> The four 2026-06-25 resolutions below are **re-graded by the V2 decisions** (D-022 governing). Annotated,
> not deleted: IndexedDB single-autosave → **SUPERSEDED by multi-backend** (Q37); splitmix64 + named
> sub-streams → **REFINED to persisted per-named-stream cursors** (Q2); ordered forward migrations →
> **SUPERSEDED by additive-schema-first / migrations rare** (Q45); `tier` **stored** → **KEEP.**

1. **SUPERSEDED (Q37/FU1): IndexedDB single autosave → multi-backend redundant save.** The original
   resolution committed to IndexedDB + base64 export with a single autosave. **V2 supersedes this** with a
   **multi-backend redundant atomic save** (IndexedDB + localStorage + sessionStorage), an app-identity magic
   field, and a monotonic-counter newest-wins selector (§6.8/§6.8.1) — to survive itch's cross-origin-iframe
   partition/eviction. (The IndexedDB-vs-localStorage trade-off note is now moot: we use **all** backends.)
2. **REFINED (Q2): RNG = splitmix64 + named sub-streams → persisted per-named-stream cursors.** The algorithm
   stays **splitmix64** (low-stakes, reversible — it only affects seed→sequence mapping). V2 **refines** the
   seed format to **`{ seed, cursors:{combat,loot,seasonal,worldgen} }`** (monotonic per-stream cursors, not a
   single counter, not child-RNG-by-splitting) plus a **stateless day-keyed** weather/festival helper, with
   **lunar phase a real continuous ~29.5-day ephemeris** off the absolute day (not a seed-keyed roll; §6.7.1).
   The **`Math.pow` ban** (Q36) is added so the seed→sequence mapping is byte-identical across engines.
3. **SUPERSEDED (Q45/FU5): ordered forward migrations → additive-schema-first; migrations rare.** V2 makes
   **additive optional-fields-with-defaults** the PRIMARY schema-growth mechanism (protobuf/thrift-style), so
   **most schema growth needs no migration at all**; the ordered forward-migration chain + raw pre-migration
   backup + future-version guard remain only as the **rare safety net** (§6.8.2). We still do *not* guarantee
   cross-major-rewrite save compatibility (a future ground-up schema change may legitimately retire very old
   saves with a clear message).
4. **KEEP: `core/state.tier` stored vs. fully derived → stored.** Unchanged by V2. Tier is checkable from the
   influence thresholds, but a tier-up is also a story beat (it fires rewards/log). Store `tier` as the
   committed value (set by the tier-up intent) and treat threshold-progress (the hybrid `gateProfile`) as
   derived — rather than re-deriving tier purely from pillars on every load.

---
# §7 — Milestone Roadmap, v1 Scope & Deployment

> **PRD V2.2 — reshaped from the 79 human-signed V2 decisions (Block L `Q1–Q56` + Block M `FU1–FU23`); per
> ADR D-022 (governing) these supersede any conflicting prior lock, most-recent-wins, annotate-don't-delete.**
> Authored end-to-end from the LOCKED CANON
> ([`../brainstorms/2026-06-25-locked-decisions.md`](../../project/brainstorms/2026-06-25-locked-decisions.md), incl. its
> **§I v1 scope** and the human-signed **§I-bal §4 BALANCE LOCKS**, now re-read through the V2 decisions) and the
> drafted PRD §§1–6 (esp. §1 vision/pillars/factions/endgame, §2 systems catalog, §3 the unlock ladder, §4 the
> balance model, §5 the narrative, §6 the tech architecture). This is the **last PRD section** and the one that,
> once approved, unlocks code (§ "How to read this document": *no code is written until §7 is approved* —
> *satisfied 2026-06-26: §7 approved → M0–M2b built & verify-green; M3–M7 provisional*). It
> commits the **definitive v1 scope**, an ordered **milestone roadmap** of verifiable vertical slices, the
> **deployment** path to itch.io, and a **risk register + scope-risk posture**. It references other sections by
> number and **defers all numbers to §4**; here we fix the *build order*, the *cut-set*, and the *release gate*,
> never the magnitudes. *(Per **ADR D-021**: the cut-set (v1 scope, §7.4.2) and the release gate (the §4-LOCKED
> acceptance criteria) stay locked, but only the **M0–M1** build order is committed — **M2–M7 are provisional,
> re-planned after each playtest**, never frozen as canon. **FU18 annotates D-016**: the saga budget is now a
> **FLOOR / minimum**, not a ceiling — see §7.1.2. The M2–M7 milestone detail below has been **re-cut** under
> D-022 for the V2 reshape.)*
>
> **Canon honoured throughout:** pure-core / deterministic / **one seed → per-named-stream persisted cursors**
> `{ seed, cursors: { combat, loot, seasonal, worldgen } }` + a **stateless day-keyed** weather/lunar derivation
> (`deriveDayKeyed`, derived-not-stored), **integer-pow only** (`Math.pow`/`exp`/`log`/trig lint-banned in core,
> `sqrt` whitelisted) so a fixed seed replays byte-identically across engines (§6.2, §6.7, §6.7.1, §6.1);
> **active-only v1 — NO idle/offline layer**, but with the tab **OPEN** a tick-driven **auto-resolve combat +
> auto-repeat labour** loop gives the "leave it running, check the progress" feel (still active-only, no offline
> catch-up — auto-producers stay T3+, §4.7.4/§2.5); **no people-management sim** (building/recruiting are flavour
> wired to the reveal bus, §1.5.1); **combat first-class & EARLY, INCREMENTAL, and feeding THREE clean tracks**
> (character (combat) level · the Arms pillar · the Combat Rank rung-meter — §1.6.4, §2.8, §4.6); **no magic /
> grounded** (§1.2 pillar 7); **K/M/B** number display + **macron** romanization (§6.9, §6.6); **no reset, ever**
> (§1.2 pillar 1). The pacing shape (saga ≈ 28.5 h; T0 ≈ 4.5 h / T1 ≈ 8 h / T2 ≈ 16 h; ≥30-min per-rung floor) is
> **LOCKED by human 2026-06-25 as a FLOOR / minimum** (canon §I-bal, annotated by FU18) — the game can and should
> run **longer** (a long, OSRS-rough grind); the M6 regression fails on **undershoot only** (§7.1.2).

## §7.0 How to read this section

§7 turns the design (§§1–6) into a **build plan**. It has four parts:

1. **§7.1 v1 scope (definitive)** — exactly what ships, the lean cut-set, the locked pacing floor, the
   sequential per-tier shape, and an explicit PARKED/CUT list (so "what's *not* in v1" is as legible as what is).
2. **§7.2 Milestone roadmap (M0…M7)** — the build order as a sequence of **vertical slices**, each
   leaving the build working, `npm run verify` green, and a crisp **definition-of-done**. Sequenced to the
   §3 reveal ladder and the §6 architecture.
3. **§7.3 Deployment** — the static itch.io build, the multi-backend + export/import save path, the bundled
   asset set, the About/Credits + license + content descriptors, the `npm run verify` release gate, and a brief
   "how to ship."
4. **§7.4 Risk register + scope-risk posture** — the top risks and how we hold scope. **v1 = full T0–T2,
   non-negotiable (no pre-planned descope).**

**The cardinal build rule (from CLAUDE.md + §6):** every milestone is a *vertical slice* — it touches
core + content + renderer + tests together and **leaves `npm run verify` green and the game playable** to
its current frontier. We never build a horizontal layer (e.g. "all of combat") in isolation; we build the
**next playable beat** end-to-end. This is the agentic working cadence (*pick → build → verify → commit →
journal → repeat*) made into a roadmap.

---

## §7.1 v1 scope (definitive)

### §7.1.1 What v1 IS

**v1 = Tiers 0–2 complete** (canon §I): the **Estate** (T0), the **Village** of Asagiri (T1), and the
**Region** (T2) **including the T2 personal-mystery payoff** — the lost-child **Otsuru** resolution (the
**TRUTH** that the MC is *not* Tama; the real Tama is Otsuru, alive and grown) is **spine-guaranteed at G6 for
every player** (§1.5.3, §3.6 G6, §5 T2), while reclaiming the MC's true name — **"Tahei"** — is **earned and
*missable*** on the optional **Origin** side-track's **O5** capstone (a player who skips the Origin thread may
finish without it; Q5/D-036), and the **Origin** reunions incl. father **Jinpachi** land across T2. **T3
Castle-town ships only as a STUB cliff-hanger** — the **castle-town / Daikan's-Office first-contact** beat at
the G7 capstone (Q24; the §3.7.1 first-contact screen — "the page turns onto stone walls, and the story
pauses"; the old "Porter / Kaidō-guild first-contact" framing is dropped because it re-ran spent T2 content);
**T4 Edo is roadmap only** (sketched in §3.7.2, not built).

**The lean cut-set (canon §I; §1.2 pillar 3) — what "complete" means per tier:**

| Dimension | v1 cut-set | Source |
|---|---|---|
| **Rank ladders** | a **fresh ~8-rung ladder per tier** × 3 tiers: T0 `R0–R7`, T1 `V0–V7`, T2 `G0–G7` (24 rungs total). **Each tier is climbed in TWO SEQUENTIAL PHASES** — **Phase 1**: climb the ~8 rungs, each promoting on a **numeric per-rung-reset rung-meter** (FU6, §4.1.1) **AND** that rung's story milestone (an **AND-gate**, Q30); **Phase 2**: the estate-influence / four-pillar **grind unlocks after the final rung** (the capstone OPENS it). | §1.6.4, §3.2 / §3.4 / §3.6, §2.15.1 |
| **Bestiary** | **~5 grounded mobs** core (boar, wolf, monkey, bandit, rōnin/smuggler), each carrying a **`MobDef.level`** (FU15) — NO belief-creatures in spawn tables | §4.6, §6.5 `enemies.ts`, canon §E |
| **Quest types** | the **4 STARTER types**: PEST-CONTROL · HUNT · CLEAR · DEFEND (DEFEND is the Arms-deed earner) — a **taxonomy, not a count budget** (Q23 supersedes D-012's "lean 4"): author whatever quests fit each stage, more / more-interesting welcome, especially at later tiers | §2.12, §3.2 R5, canon §I |
| **World** | **full walkable maps T0–T2** within a **~6–8-node-per-tier** cut-set (canon: full maps every tier, not abstract boards) | §1.7, §3, canon §I |
| **Skills (LOCKED v1 set)** | **farming · foraging · woodcutting · fishing · smithing · cooking** + **conditioning** + the **incremental weapon roster** (below). Each skill (labour included) carries a bounded **per-skill PERKS** track — ~2–8 small, stackable labour→combat bonuses, no global cap, each small-magnitude (Q6/FU8); **conditioning stays the ZERO-stat enablement gate**, orthogonal to and never bypassed by the perks. (Fishing surfaces at T1, Q4.) | §1.5.1, §2.7/§2.7.1, §4.5/§4.5.4, canon §G |
| **Combat** | an **idle/auto-resolve auto-battler** (active-only; tab-open auto-resolve + auto-repeat) revealed **INCREMENTALLY** on the **combat-reveal ladder** (FU12: R3 starter weapon + auto-resolve loop + retreat → R4 graded durability bands → R5 stance → first weapon-line L10 ability/item slots → 2nd combat line at T1 → 3rd at T2; one reveal per beat); **satiety-throttled** (FU16); **graded 4-band durability** (FU17, never auto-unequipped); feeding **THREE clean separately-stored tracks** — kills/combat-XP → the **character (combat) level**, recognised deeds → the **Arms pillar** (Phase-2-gated), per-rung curated activities → the **Combat Rank rung-meter** (FU14) | §1.6.4, §2.8/§2.8.1/§2.8.2, §4.6 |
| **Weapon roster (incremental)** | a **growing ~9–10-weapon roster** across **3 archetype lines** — **T0 starts with exactly ONE weapon** and unlocks **+2** across the tier; **+3 at T1**, **+4 at T2** (each weapon an **archetype** — per-weapon `baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability**; FOUND and CRAFTED, never gifted) | §2.8.2, §2.10.1, §4.6.9 |
| **Estate stages** | **E0 → E1 → E2 → E3** (Foreclosure's Edge → Stabilising → Recovering → **Prosperous**) — E3 authored in v1 (Q8, folded into the G-tier koku/Arms spend, §4.7.5); **E4–E5 parked** | §1.5.1, §4.7.5 |
| **House Influence** | the **four pillars** (Arms / Estate & Wealth [trade ≤⅓] / Standing & Office / Name & Honour), the four-bar panel revealing **bar-by-bar** as each pillar first scores; achievement-jump (**≈70%**) + seasonal-judged-on-high-water-mark (**≈30%**) accrual, **pillar DEEDS gated to PHASE 2**; the tier-gate is the **HYBRID good/great/excellent pillar profile** (good in ALL *revealed* pillars · great in 2–3 · excellent in 1–2; **NO overflow**; T0 is a 2-pillar special — Arms + Estate) — a **per-pillar-per-tier overhaul**, not simple ratios (Q7/FU10) | §1.6, §2.16, §4.1–§4.2 |
| **Crafting** | **hybrid**: simple recipes from T0-R4; the component/quality system from T1-V3. **Crafting and Quests surface as their OWN top-level nav tabs** (Q10), not nested panels | §4.7.2, §2.11/§2.12, §3.4 |
| **Save** | **MULTI-BACKEND redundant atomic save** — IndexedDB + localStorage + sessionStorage, written to all available backends per autosave; an **app-identity magic field** (`app:'kami-kakushi'`, reject-to-recovery on mismatch); a **monotonic save-counter newest-wins selector** (the save-layer **timestamp is only the tiebreaker** — a documented core-lint exemption, metadata not game logic); an **additive backwards-compatible schema** (never remove/repurpose a field) + ordered migrations + raw backup; **base64 export/import** retained as the portable backstop | §2.19/§2.19.1, §6.8/§6.8.1/§6.8.2 |

### §7.1.2 The locked pacing FLOOR (acceptance criterion = a minimum, not a ceiling)

Per canon **§I-bal** (human-signed), **annotated by FU18 (D-016-as-annotated)** and §4.8: the v1 saga budget —
**v1 total ≈ 28.5 h** of active play (**T0 ≈ 4.5 h · T1 ≈ 8 h · T2 ≈ 16 h**) with a **≥ ~30-min-per-rung
floor** — is a **FLOOR / minimum, not a ceiling.** The game **can and should run longer** (a long, OSRS-rough
grind you *leave auto-running, checking the progress*, FU18/FU23); content interleaves richly rather than
brick-walling. (The canon "≈ 32 h" figure includes the post-T2 stub runway / free-play tail; the *built*
content floor sums to ≈ 28.5 h — §4.8.4.) The **M6 balance pass** (§7.2) treats the per-tier hour budgets and
the ≥30-min floor as **verify-gate-enforced minimums** — but the regression **fails on UNDERSHOOT only**: a
headless playthrough that clears any **grind** rung (R1–R7 and the V0–V7 / G0–G7 equivalents; the **R0
cold-open story rung is exempt** per §4.8.1) in **< ~28 min**, or completes a tier in **under its hour floor**,
**fails the pacing test** (too fast). **Overshooting the floor is fine and desired** — a longer grind never
fails the gate. The §4.8 curve is a **minimum-grind model**: tuning lengthens the grind / interleaves content
to clear the floor, never retunes the floor itself. The **auto-resolve combat + auto-repeat labour** loop
(tab-open, active-only) is what makes the longer grind palatable.

### §7.1.3 PARKED / CUT for v1 (designed, not deleted — "park, don't delete")

Per the lean discipline (§1.2 pillar 3, §1.7.1). **Parked = reintroduce later, deliberately**; nothing
here is a design hedge — the *shape* is decided, only the *authoring* is deferred.

| Parked item | Where it returns | Source |
|---|---|---|
| **Estate stages E4–E5** (fortified seat → restored-and-surpassed) — E0→E3 **ships in v1** (E3 authored in M5b) | T3+ | §1.5.1 |
| **The Matagi hunters, the Pilgrimage Order, the Scholars-&-Physicians *network*** (keep Sōan / Obaa Kuni as seeds only) | T3+ | §1.7.1 |
| **Auto-producers** (any idle/seconded-helper layer) — **v1 is active-only, no idle layer** (the "leave it running" feel comes from tab-open auto-resolve/auto-repeat, NOT offline progress) | T3-C1 first; scaffold only in v1 | §4.7.4, §2.5, canon §G/§H |
| **The marriage / adoption status lever** (a real T3/T4 alliance lever; numbers deferred) | T3-C5 | §1.7.1, §2.16.1, §4.3 |
| **Deeper upper-tier world nodes** (the *Daikan's* office depth, the Edo *yashiki* / rusui conduit, the full finance network, the High Mountains & Pass) | T3 / T4 | §1.7.1 |
| **The national *mitate* / parody-*banzuke*** (the Edo finale presentation) | T4-E7 | §3.7.2 |
| **No respec** (attributes & skill-milestone choices committed — explicitly out of v1) | post-v1, reconsider | §4.4, §4.5, canon §I-bal |
| **Dedicated mobile layout / mobile leave-and-return** — v1 is **DESKTOP-FIRST**; mobile is **best-effort responsive only** (touch targets meet the a11y minimum, but no mobile-specific layout and no mobile leave-and-return story — consistent with multi-tab being unsupported) | post-v1 mobile pass | Block N.1 #2 |

> **Hard guardrails that v1 must NOT violate** (canon, machine-checked by the content verifier §6.6/§6.6.1 — see
> M6): no belief-creature in any spawn table; **trade ≤⅓ of Estate & Wealth** (a HARD structural cap — and the
> broadened **cross-pillar combos** are computed **POST-clamp**, **excluded** from the gate-threshold check, and
> the verifier proves a combo can **never** breach ⅓ nor satisfy a required pillar; Q22/FU20); ≤1
> residual-ambiguity token; **bounded labour→combat ONLY via small per-skill perks** (no global cap, each
> small-magnitude — the verifier asserts *each perk is small*, **not** `== 0`; Q6/FU8) with **conditioning kept
> as the ZERO-stat enablement gate** (weak→capable; never bypassed by the perks); no passive Influence trickle
> (jumps + seasonal-judged only); no permanent holding-loss / no Influence wipe; **force-fictionalised real
> names** (a §6.6 real-name denylist lint); macron romanization; hard-capped martial scale (a small named
> retinue, never a standing army).

### §7.1.4 Per-tier shape (Phase 1 → Phase 2) — the sequential progression model

Every content tier is internally **SEQUENTIAL, in two phases** (the V2 spine — §1.6.4, §2.15.1; ADR
D-023/D-024/D-025):

- **Phase 1 — climb the rungs.** Two **rung-meters** drive the ~8-rung ladder in parallel: **Estate Service**
  (the labour rung-meter) and **Combat Rank** (the martial rung-meter — *renamed from "Combat Standing"*, Q9;
  "Standing" now means the **官威** *Standing & Office* pillar only). Each rung promotes on a **numeric
  per-rung-reset rung-meter** — a real §4.1.1 curve whose threshold is **back-solved from the SAME ≥30-min floor
  §4.8 pacing uses** × that rung's eligible-activity rate — **AND** the rung's **story milestone** (an
  **AND-gate**; the UI reads "awaiting X" when one lags, Q30/FU6). The meter is fed by **curated,
  story-consistent per-rung activities** (a designed *one-to-many* set, **NOT** a single repeat-counter; FU7). A
  **pre-R3 taste of variety is FRONT-LOADED** into Phase 1's first hour (D-Q-first-session): a small log-driven
  hazard/skirmish beat (or extra loop) **without the full combat UI**, so first-session retention isn't riding on
  labour alone before combat opens at R3 (M2a).
- **Phase 2 — grind the house up.** **After the final rung** of the tier, the **estate-influence / four-pillar
  grind unlocks** (the capstone rung **OPENS** Phase 2; it does not merely confirm it). The tier's **pillar
  DEEDS accrue here and only here** — they do **not** accrue while climbing the rungs (FU7), which prevents the
  "half the rungs, maxed deeds" exploit. Clearing the tier's **HYBRID good/great/excellent pillar profile**
  (§4.1) against the tier's **revealed-pillar set** — **T0 = 2** (Arms + Estate) · **T1 = 3** (+ Office) ·
  **T2 = 4** (+ Name surfacing) — is then what **tiers up** to the next canvas. (A pillar **not yet revealed**
  for a tier is **never** part of its gate.)
- **The three clean combat tracks** thread through both phases and never collapse into one bar: **kills /
  combat-XP → the character (combat) level** (which scales HP, attribute points, and `satietyMax`); **recognised
  martial DEEDS → the Arms pillar** (Phase-2-gated, the influence economy); **per-rung curated activities → the
  Combat Rank rung-meter** (the Phase-1 martial rung-gate). One kill writes to your **level**; one recognised
  deed writes to **Arms**; one curated rung activity writes to the **meter** (§1.6.4, §2.8.1, §4.0.1).

This per-tier shape is the build skeleton the milestone roadmap (§7.2) hangs on: M1 stands up the rung-meter +
Phase-1 climb; M3b/M4/M5b each close a tier with its Phase-2 pillar grind + hybrid gate.

---

## §7.2 Milestone roadmap (M0 … M7)

> **STATUS: M0 ✅ (8bf6ac9) · M1 ✅ (8bf6ac9) · M2a ✅ · M2b ✅ (248bf93/fc36172) — see the living
> [`roadmap.md`](roadmap.md); M3a is NEXT; M3b–M7 provisional.**

Each milestone is a **vertical slice** ending **green** (`npm run verify` passes — §6.1) with the game
playable to its frontier. The spine follows the §3 reveal ladder (cold open → T0 rungs → T1 → T2) layered
onto the §6 architecture (core boundary first, content registries throughout). "Lands" lists the
§-systems the slice makes real; "Definition of done" is the verifiable bar.

> **Granularity note.** M1–M5 are content-tier slices; each is internally **PHASE 1 (climb the ~8 rungs via the
> per-rung-reset rung-meter + story AND-gate) then PHASE 2 (the four-pillar grind unlocks after the final rung →
> the hybrid good/great/excellent gate → tier-up)**, and within Phase 1 each is **rung-by-rung** (a sub-slice
> per `RevealableEntry`, per §3 / §6.5) so a milestone never stalls the build — the smallest shippable unit is
> *one rung's reveal end-to-end*. **Reveals are DESIGN-staggered, one-per-beat** (the schedule is *authored* so
> beats arrive singly; there is **no runtime reveal-queue** — FU4). Combat (the densest stretch) keeps its **two
> fixed, planned combat-ENGINE milestones** split up front at the natural seam: **M2a = auto-resolve + first
> fight**, **M2b = bestiary / equipment / loot→craft** (the §3.2 R3→R4 boundary) — *not* a conditional split.
> Likewise, **M3 and M5 are PRE-SPLIT at their seams** (D-Q-M3/M5-split, the same up-front discipline as
> M2a/M2b — smaller verifiable milestones): **M3a / M3b** at the **R6→R7 Phase-1/Phase-2 seam** — **M3a** =
> the R4→R6 Phase-1 climb (quests + crafting + the stance/ability/item combat beats; the basis builds, pillars
> not yet scoring), **M3b** = the **R7 capstone that OPENS Phase 2** → the four-pillar grind + the T0→T1 hybrid
> gate → **T0 complete**; and **M5a / M5b** at the **subsystem seam** — **M5a** = the T2 region canvas (the new
> trade-backbone + sekisho travel subsystems + region combat / 3rd combat line + the estate-spine climb G0→G3,
> Origin opening at G2), **M5b** = the back-half climb G4→G7 + E3 + the four-pillar Phase-2 grind + the
> cross-pillar combos + the G6/Origin payoffs (incl. the missable name-reclaim) + the T2→T3 end-gate →
> **v1 content complete**. **Each half ends verify-green and playable to its frontier.**
> The **incremental combat-reveal ladder** (FU12/FU13) then **spreads across M2a→M5** with combat sub-slices
> added at **M4** (the 2nd weapon line / 2nd combat line, +3 T1 weapons) and **M5a** (the 3rd line, +4 T2 weapons)
> — additive slices, *not* a re-split of the fixed M2a/M2b. The per-beat map is §7.2.0.

### §7.2.0 Combat reveal ladder → milestone map

The incremental combat surface (FU12/FU13) reveals **one element per beat** (no R3 UI-dump); this table pins
which element lands in which milestone so the stagger has an unambiguous build home:

| Combat reveal (trigger) | What reveals | Milestone |
|---|---|---|
| **R3** (combat rung) | the **single starter weapon** + the **bare auto-resolve loop** + **retreat** (the character (combat) **level** track begins) | **M2a** |
| **R4** (loot→craft loop) | the **graded 4-band weapon-durability bands** (never auto-unequipped) + a found/crafted **2nd T0 weapon** | **M2b** |
| **R5** (combat rung) | the **stance** slot (curated combat activities now feed the **Combat Rank** rung-meter; **Arms PILLAR deeds still do NOT accrue** — Phase-2-gated) | **M3a** |
| **first weapon-line L10 milestone** | the **ability + item** intervention slots | **M3a** |
| **T1** (combat rung) | the **2nd combat line** (a Combat Rank rung-gate) + **+3 weapons across T1** | **M4** |
| **T2** (combat rung) | the **3rd combat line** + **+4 weapons across T2** | **M5a** |

**One reveal per beat** (FU12); the full ~9–10-weapon roster lands across the tiers (T0 +2 / T1 +3 / T2 +4;
§2.10.1, §4.6.9). The Bestiary / Equipment / Inventory panels themselves stay on the **M2b** half of the fixed
seam (they need the full mob/loot registries); the character-level track and the auto-resolve loop go live in
**M2a**.

### M0 — Toolchain bootstrap + the cold open + the FULL multi-backend save spine

**Goal:** stand up the deterministic, testable foundation, the one hand-authored pre-ladder state, and the
**full multi-backend save layer** (built complete in M0 — only the itch cross-origin-iframe survival test is
deferred to M7) — the narrowest possible *complete* game (one screen, one verb, a redundant save you can
export).

**Lands (§-systems):**
- The **toolchain** (§6.1): Vite + TypeScript (strict) + Vitest, ESLint + Prettier, the committed
  `package.json` + lockfile, and the **`npm run verify`** gate wired (typecheck + lint + format + unit +
  the content-verifier + `gen:docs --check`).
- The **pure-core / renderer split** (§6.2): `src/core` (pure, no DOM), `src/ui` (thin DOM), `src/app`
  (composition root + the active-only tick loop), `src/persistence` — with the **ESLint boundary rules**
  live as build failures: **no `Math.random` in core**; **no `Math.pow`/`exp`/`log`/trig in core** (integer-pow
  only, `sqrt` whitelisted; Q36); no DOM/window/`Date.now`/`indexedDB` in core — with the **documented
  persistence-layer `Date.now` exemption** for the save-layer timestamp *tiebreaker* (FU2/§6.1, metadata not
  game logic).
- The **one seeded RNG** (§6.7) in `GameState` as **per-named-stream cursors** `{ seed, cursors: { combat,
  loot, seasonal, worldgen } }` (not a single counter, not child-RNGs-by-splitting), plus the **stateless
  day-keyed** `deriveDayKeyed(seed, 'weather', day)` helper (weather/festival (day-keyed) + lunar (a real
  ~29.5-day ephemeris), derived-on-read, NOT stored); the `reduce` / `tick` contracts (§6.3); the **rewards / unlock bus** (`applyRewards`, §6.5) and the
  **UI-reveal engine + event log** (§2.1, §3.0) — the engine the entire game is built on. (Reveal staggering is
  a property of the **authored schedule**, not a stored runtime queue — FU4.)
- The **content-verifier harness** (§6.6/§6.6.1) and **`gen:docs`** (even with a near-empty registry — the
  scaffolding that makes generate-don't-duplicate and the V2 invariants enforceable from commit #1).
- The **DEV play API** `window.__qa` (§6.10), DEV-only / dead-code-eliminated.
- The **cold open** (§3.1, §5 T0.2 beat 1): the single screen, the persistent event log, the one verb
  ("Open your eyes" → "Rake the spilled rice"), the body/rest bar + rice counter, Sōan's grounding line,
  the first dream-fragment (ZERO bonus).
- The **FULL multi-backend redundant save layer** (§6.8/§6.8.1, built complete in M0): the backend-abstraction
  over IndexedDB + localStorage + sessionStorage, atomic write to all available backends, the **app-identity
  magic field** (`app:'kami-kakushi'`, reject-to-recovery on mismatch), the **monotonic save-counter newest-wins
  selector** (timestamp tiebreaker only), the **additive backwards-compatible schema** migration chain + raw
  backup, and **base64 export/import** — rich per-system fields are added **additively** at their milestone.

**Definition of done:** `npm run verify` green; a fresh game loads in **< 5 s to first interactable**
(§4.8.0); pressing the verb rakes rice, ticks the koku counter, and pushes a log line; the state autosaves
to **all available backends** (autosave fires both **on meaningful intents AND on a tick-interval** — §6.8),
and on load the **newest-wins selector** (max `saveCounter`, then timestamp)
returns the correct blob, a wrong-`app` blob is rejected to recovery, and a base64 export re-imports
identically; a Vitest **determinism test** asserts a fixed seed + fixed intent/tick script yields a
byte-identical `GameState` across the per-named-stream cursors (§6.3); `__qa.newGame(seed)` / `dispatch` /
`tick` drive the real intents headlessly. **No game logic in the renderer; no `Math.random`/`Math.pow` in
core** (lint proves it).

**Phases / high-level tasks:**

1. **Stand up the toolchain, the pure-core boundary & the verify gate** — `npm run verify` runs green on an empty src/core·ui·app·persistence skeleton, and the ESLint boundary rules FAIL the build on a planted Math.random, Math.pow/exp/log/trig, or DOM/window/Date.now/indexedDB import inside src/core (with the persistence-layer Date.now tiebreaker exemption documented). *(§6.1, §6.2)*
2. **Build the core spine: GameState + the one seeded RNG (cursors) + reduce/tick** — The pure core compiles with a stored-vs-computed GameState (M0 surface: schemaVersion, rng = {seed, cursors:{combat,loot,seasonal,worldgen}}, clock, character {hp, satiety, attributePoints} + character.level (=1 floor) + satietyMax-at-floor — the §6.4 stored fields; subEngines / CombatEncounterState / dialogue are NOT pre-declared, added additively at their milestone per FU5; there is no separate top-level `vitals`, resources, flags, unlocked, log beyond M0 needs), createInitialState(seed), the seeded RNG living IN GameState (pure per-stream next + int/chance/pick helpers threading the advanced cursor back; integer-pow only), the stateless deriveDayKeyed weather helper (derived, not stored), and reduce(state,intent)/tick(state,dtTicks) as deterministic, immutable-in/out pure functions covering the cold-open intents (open_eyes / rake_rice / rest) and a per-tick·day·season scheduler skeleton. *(§6.2, §6.3, §6.4, §6.7, §6.7.1)*
3. **Build the reveal engine: rewards/unlock bus + event log + the surfaces registry** — A flag/threshold flip fires exactly ONE event through core/rewards.applyRewards that simultaneously reveals a surface, pushes its diegetic log line (the LOG_RING_MAX≈300 ring in core/log), and sets the flag; unlockedSurfaces(state)/isUnlocked drive a data-driven content/surfaces.ts holding only the cold-open RevealableEntries — all unit-tested. Reveal staggering is a design property of the authored schedule (NO revealQueue field in GameState; FU4). *(§2.1, §3.0, §6.5)*
4. **Make the content-verifier & gen:docs real** — src/scripts/verify-content.ts cross-checks ids across the (near-empty) registries with no orphan SurfaceIds and enforces the M0-applicable canon invariants (≤1 ambiguity token, macron/no-plain-ASCII-romaji lint, the real-name denylist scaffold per §6.6.1), and src/scripts/gen-docs.ts writes a generated doc into docs/content/ with `--check` failing on drift — both replace the task-1 stubs and run green inside npm run verify. *(§6.6, §6.6.1, §6.5)*
5. **Build the FULL multi-backend save layer: redundant atomic write + newest-wins + base64 + migrations** — src/persistence round-trips the STORED surface of GameState (§6.4 only — derived recomputed on load) through save→base64→load byte-identically (unit-proven), writes atomically to all available backends (IndexedDB + localStorage + sessionStorage) with the app-identity magic field, selects newest on load by the monotonic saveCounter (timestamp tiebreaker — the only Date.now read, the documented core-lint exemption), runs an ordered, pure, unit-tested additive-schema migration chain with a pre-migration raw backup, rejects a wrong-`app` blob to recovery, degrades gracefully on a corrupt save, and is never imported by core. (The itch cross-origin-iframe survival smoke is the only save piece deferred — to M7.) *(§6.8, §6.8.1, §6.8.2, §6.4)*
6. **Build the app composition root: active-only tick loop + DEV play API** — src/app wires core↔persistence↔ui with an active-only tick loop (computes dtTicks from active elapsed time → pure tick; pauses on background, no offline catch-up; tab-open auto-resolve/auto-repeat scaffold for later), debounced autosave-to-all-backends on meaningful intents + **on a tick-interval** + visibilitychange/beforeunload, and a DEV-only window.__qa (state/dispatch/tick/frames/pause/resume/newGame/save/load/forceState/setSeed/selectors) that drives the REAL typed intents and is dead-code-eliminated from the production bundle. *(§6.10, §6.3, §6.9, §6.8)*
7. **Render the cold open — the diegetic beat** — src/ui is a thin DOM renderer (zero game logic, dispatch-only, single render(state) reconciliation) showing the single-column cold-open screen — persistent event log as an ARIA live region + one verb — that walks the §3.1 reveal order: "Open your eyes" reveals the body/rest bar + rice counter and flips the verb to "Rake the spilled rice"; raking ticks the koku counter and pushes a log line; the rest verb appears; Sōan's grounding line and the first dream-fragment land as a ZERO-bonus log line (no panel, no mechanical effect). *(§3.1, §5 T0.2 beat 1, §2.1, §2.3, §2.4, §6.9)*
8. **Lock the DoD: determinism test + headless cold-open acceptance + multi-backend save survival + verify-green checkpoint** — A Vitest determinism test asserts a fixed seed + fixed intent/tick script yields a byte-identical GameState (snapshot/structural hash); a __qa-driven headless test (newGame(seed)→open_eyes→rake_rice) asserts koku increments, the log line, and the §3.1 surfaces revealing in order; the multi-backend save round-trip + newest-wins selection + magic-field reject are asserted; a **tick-interval autosave smoke** asserts a tick-only run (no new intent) still fires an autosave to all backends; load-to-first-interactable is confirmed < 5s; `npm run verify` is green — the M0 Definition of Done is met. *(§6.3, §6.10, §6.8.1, §4.8.0, §7.2 (M0 DoD))*

### M1 — T0 Phase-1 labour spine + rung-meter R0→R2 + skills + estate E0→E1 (start)

**Goal:** the peaceful-labour **Phase-1** spine — earn your keep room by room, the first three rungs on the
**numeric rung-meter**, the Skills tab, the first separate estate-room reveals; **fun-proxies instrumented as
report-only** (Q4/FU9).

**Lands:** the **labour loop** (§2.6: farming → foraging → woodcutting → hauling) on the *koku*/rice
heartbeat (§2.4), with **tab-open auto-repeat** giving the "leave it running" feel (active-only, no offline);
**rungs R0→R2** (§3.2) on the **Estate Service** meter as a **numeric per-rung-reset rung-meter** (§2.15.1,
§4.1.1: the threshold back-solved from the ≥30-min floor × that rung's eligible-activity rate) **AND-gated**
with each rung's story milestone (FU6/Q30); the **Skills tab** (§2.7) as the **first nav reveal** (§3.5) with
discover-by-doing visibility (§4.5) and the **per-skill PERKS scaffold** (§2.7.1/§4.5.4); the **separate** T0
room reveals — Gate & Forecourt, Home Paddies, Stables & Woodlot Edge — each its own beat (§3.3, canon §I
LOCKED-separate rule); the **world-clock** (day/season tag, §2.2) and **soft stamina/satiety** (§2.3); the
**porter's-knot** identity beat (ZERO bonus); the **Near Satoyama** first danger ring (conditioning-gated,
discover-by-doing) — which doubles as the **FRONT-LOADED pre-R3 taste of variety** (D-Q-first-session): a small,
**log-driven** hazard/skirmish beat (and a light non-labour loop) lands **in the first hour, WITHOUT the full
combat UI** (no combat panel — combat proper still arrives at R3, M2a), so the first session isn't all
rake-and-repeat (first-session retention). Estate stage **E0 → start of E1**. **Fun-proxies** (dead-time, reward/unlock cadence,
visible-next-goal, first-5-min hook; deed-cadence T0 ~5 min) are **instrumented as REPORT-ONLY** at M1 (they
*gate* at M6; set + thresholds from `fun-factor.md`).

**Definition of done:** verify green; a headless run via `__qa` reaches **R2**, each rung promoting on the
**numeric rung-meter AND its story milestone** (the meter is per-rung-reset; the UI reads "awaiting X" when one
lags); the Skills tab fades in on schedule, ≥3 skills surface by-doing, the world-clock advances and seasons
turn, soft stamina paces the day (slows, never hard-blocks), and auto-repeat labour runs unattended (active
tab); a **pre-R3 variety beat** (a log-driven hazard/skirmish, **no combat panel**) fires within the first hour
(asserted — D-Q-first-session); the first generated content doc (`docs/content/ranks.md`) regenerates and `gen:docs --check` passes;
per-rung pacing **and the fun-proxies are *instrumented* (report-only)** — the ≥30-min-floor test and the
fun-proxy report exist, even if final tuning / the fun-gate land at M6.

**Phases / high-level tasks:**

1. **Author the M1 content registries + balance constants** — Done when the data-as-code registries for this slice exist and the content-verifier is green: activities.ts (farm/forage/woodcut/haul nodes — skill, yields, season window, dangerRing, staminaCost, reveal predicate), resources.ts rows (koku + wood + sansai), skills.ts (the ~4 T0 labour skills with visibility threshold + the per-skill PERKS track scaffold), areas.ts (Kura, Gate & Forecourt, Home Paddies, Stables & Woodlot Edge, Near Satoyama ring), ranks.ts (R0→R2 rungs + rung-meter thresholds back-solved from the ≥30-min floor + earn-conditions + story AND-gate), surfaces.ts (Skills tab, room panels, clock + stamina readouts, new resource rows — each with its unlock predicate), and balance.ts holding the §4 constants by reference; every id resolves, no orphans. *(§6.4, §6.5, §6.6, §2.4, §2.6, §2.7, §3.2, §3.3, §4.1.1 (rung-meter law, referenced))*
2. **Build the active labour loop + skill-XP core (+ tab-open auto-repeat)** — Done when dispatching do_activity for farming/foraging/woodcutting/hauling resolves through the pure core: yields koku/materials per the §4.7.1 formula (integer-pow only), grants per-skill XP under the §4.5.2 per-event cap, derives levels from the §4.5.1 curve, surfaces a skill at its §4.5 visibility threshold, and a tab-open AUTO-REPEAT affordance re-issues the active labour intent unattended (active-only — no offline catch-up) — all routed through the rewards/unlock bus and the one seeded RNG (per-stream cursors), with Vitest covering yield/XP/visibility/auto-repeat. Pure-core only (lint proves no DOM/Math.random/Math.pow/Date.now); no idle auto-producers. *(§2.6, §2.7, §2.4, §4.7.1, §4.5, §6.2, §6.3, §6.5, §6.7)*
3. **Build the world-clock, seasons + soft stamina** — Done when tick() deterministically advances the abstract clock and runs the per-tick/per-day/per-season scheduler: seasons turn spring→summer→autumn→winter (kanji day/season tag), node productivity is season-gated with the autumn harvest multiplier (§4.7.1), the day-keyed weather/festival modifier resolves statelessly via deriveDayKeyed (bounded ±10%, NOT stored — §6.7.1), the per-season judged-appraisal hook fires on a new high-water mark (scaffold only — full pillar accrual lands at M3b, Phase-2-gated), and soft stamina/satiety drains on labour and soft-throttles the action rate (slows, never to zero, never hard-blocks) with a rest verb recovering it. Vitest asserts seasons turn, weather is re-derived-not-stored, and stamina throttles-not-blocks. Active-only — no offline catch-up path exists. *(§2.2, §2.3, §4.7.1, §6.3 (tick/scheduler), §6.7.1, §6.4 (clock/vitals stored fields))*
4. **Wire the Estate Service rung-meter, R0→R2 ladder + separate room reveals** — Done when the Estate Service **numeric per-rung-reset rung-meter** (§2.15.1, §4.1.1) accrues from curated recognized labour activities (a one-to-many set, NOT a single repeat-counter) and crosses the R0→R1→R2 rung gates as an AND-gate (numeric threshold AND the rung's story milestone: R0 cold-open complete → R1 spilled-rice/first real work → R2 a season of reliable labour), each promotion resetting the meter and firing its RewardBundle through the single rewards/unlock bus to reveal surfaces + push its diegetic log line, with the canon §I SEPARATE room reveals honoured (Gate & Forecourt + Home Paddies at R1; Stables & Woodlot Edge at R2 — each its own beat) and the estate stepping E0 → start of E1 as flavour (no management sim). **Pillar DEEDS do NOT accrue (Phase 1).** Vitest asserts each rung flips at the intended GameState on meter-AND-story, the meter resets per rung, and rooms reveal individually. *(§2.15.1, §3.2, §3.2.1, §3.3, §2.17, §5 T0.2/T0.4, §6.5 (ranks/surfaces), §6.3, §4.1.1)*
5. **Land the Skills-tab nav reveal, the per-skill PERKS scaffold, Near Satoyama ring + porter's-knot beat** — Done when the first navigation chrome appears (the Work column splits to Work + Skills at R2 per §3.5) with ≥3 skills surfaced discover-by-doing and the per-skill PERKS track scaffolded (small, stackable, no global cap — magnitudes deferred, the conditioning ZERO-stat enablement gate kept orthogonal; §2.7.1/§4.5.4); the Near Satoyama first danger ring surfaces as a FIRST-USE conditioning-gated reveal (§3.3); and the porter's-knot Origin beat fires once with ZERO mechanical effect — a one-shot story flag + log line, no panel, no stat, no flag-read edge (the no-hidden-edge guard, asserted in Vitest). All wired as data through the reveal bus. *(§3.5, §3.3, §2.7, §2.7.1, §4.5, §4.5.4, §1.9 / §5 T0.2-T0.7 (Origin thread, ZERO bonus), §2.9 (danger ring))*
6. **Wire the thin renderer for every M1 surface** — Done when the game is playable to R2 in the browser: a single render(state) path paints the Work column (labour verbs + the auto-repeat toggle), the Skills tab/screen, the room/area panels, the clock + season tag, the soft-stamina bar + rest verb, and new resource rows — each appearing only when its surfaces.ts predicate unlocks, each first reveal pushing its diegetic log line. The renderer holds zero game logic and only dispatches the same intents __qa uses (ESLint boundary rule proves it). *(§2.1, §3.5, §6.9, §6.2 (boundary))*
7. **Generate docs, headless-QA the R2 run + instrument pacing AND the fun-proxies (report-only)** — Done when npm run verify is green end-to-end: gen:docs emits docs/content/ranks.md from the registries and gen:docs --check passes; a fixed-seed determinism replay test yields a byte-identical GameState; a __qa headless run reaches R2 asserting each unlock fires at its intended state on the meter-AND-story gate, the Skills tab fades in on schedule, ≥3 skills surface by-doing, seasons turn, and stamina throttles-not-blocks; and the per-rung ≥30-min-floor pacing instrumentation test AND the fun-proxy report (dead-time / reward-cadence / visible-next-goal / first-5-min hook; deed-cadence ~5 min) exist as REPORT-ONLY tools (the fun-gate + final tuning deferred to M6). *(§6.6 (gen:docs/verifier), §6.10 (__qa), §6.3 (determinism replay), §4.8.0/§4.8.1 (pacing floor — instrumented, not tuned), §7.2 M1 DoD, fun-factor.md)*

### M2a — Combat goes live at R3 (auto-resolve + active setup) + the humbling first fight

**Goal:** combat as a first-class pillar **from T0** — the humbling near-fatal first fight, the drill yard,
and the deterministic, seeded auto-battler feeding the **three clean tracks** — unit-testable in isolation.
*(Fixed combat-ENGINE milestone; the first half of the combat slice, split up front at the R3→R4 seam — see the
granularity note. "Idle" dropped: it is an **auto-resolve** auto-battler.)*

**Lands:** the **R3** rung (§3.2) gated on the **humbling first fight** (the wolf at the grain store,
survived by luck — §5 T0.4); the **Combat panel** (§2.8) and the **deterministic, seeded auto-battler**
(§4.6: auto-resolve + active stance/ability/item/retreat; the §4.6 combat math, damage floor, crit/block,
**per-weapon `baseSpeed`** attack-speed cadence — the old single `baseSpeed = 1.0` is superseded, §4.6.2/§4.6.9);
the **R3 combat-reveal-ladder beat** — the **single starter weapon** + the **bare auto-resolve loop** + **retreat**
(the **character (combat) level** track begins, fed by combat-XP only — kills → `level`, never labour/deeds;
§2.8.1/§4.0.1); the **three clean separately-stored tracks** seeded (combat-XP → the character (combat) level;
per-rung curated combat activities → the **Combat Rank rung-meter**; the **Arms PILLAR deeds stay Phase-2-gated**,
M3b); the **first-fight win-rate 20–35% at adequate satiety (≥~0.7)** target (§4.6.6/§4.6.8, **LOCKED**) — combat
is **satiety-throttled** (a `satietyRate` multiplier on attackPower, flat ≥~0.7 → ~0.5 floor, a separate combat
coefficient; FU16/§4.6.1b); the **clean retreat** resolution (keep HP + carried loot, modest clock cost, never
dents Influence except an abandoned DEFEND-deed; Q16/§4.6.8); the **soft-setback-on-loss** rule (1 HP + ~½-day +
light injury + possible carried-loot drop — **never** levels/gear/Influence; **LOCKED** shape, §4.6.6);
combat/weapon **skills** in the Skills tab seeded with their **per-skill PERKS** (the bounded labour→combat
channel, §2.7.1/§4.5.4); the **Drill Yard** revealed *separately* (§3.3); the **Combat nav node** (§3.5). The
**conditioning enablement gate** is enforced as a **ZERO-stat** one-way weak→capable predicate (§4.4/§4.6.1),
orthogonal to and never bypassed by the bounded per-skill perks.

**Definition of done:** verify green; a headless run reaches R3 and triggers the first fight; a fixed-seed
fight **replays byte-identically** (§6.7, per-stream cursors) and a forced-seed rare crit/loot renders
correctly via `__qa`; a Vitest test confirms the fresh-MC win-rate **on the grindable wolf/sparring
encounters** sits in **20–35% at adequate satiety (≥~0.7)** (the scripted story-beat wolf is a separate
guaranteed-survival beat) and a post-drills MC ~85%+ (§4.6.6/§4.6.8); the satiety throttle measurably lowers attackPower
below the ~0.7 knee (never pushing win-rate below ~15%); a loss applies the soft setback and **never** removes a
level/gear/Influence (asserted); a retreat keeps HP + loot and never dents Influence (except an abandoned
DEFEND); **conditioning grants ZERO combat stat** (the enablement gate is access-only — asserted) and **each
per-skill perk is small-magnitude (NOT `== 0`, NO global cap)** (the §6.6.1 perk-magnitude check — flipped from
the old `==0` wall). The auto-battler is unit-testable in isolation (no bestiary/equipment dependency).

**Phases / high-level tasks:**

1. **Combat data model + balance constants (types & content scaffold)** — core/combat exports the Combatant / CombatEncounterState / Stance / InjuryState types (NO single fused CombatDeedsPool — the three tracks are separate stored streams, §2.8.1); the §4.6 combat tunables (DAMAGE_FLOOR formula, CRIT_MULT, BLOCK_REDUCTION, **per-weapon `baseSpeed`** + SPD coefficient, COMBAT_XP_K, the satietyRate throttle constants) live in content/balance.ts referencing §4 values (integer-pow only); per-mob `MobDef.level` is a field (FU15) and **on-kill XP = `MobDef.level · COMBAT_XP_K`** (§4.6.5); combat/weapon skills + their per-skill PERKS are registered in content/skills.ts, the crude carrying-pole (0th improvised weapon) and the wolf are added as minimal Combatant fixtures (NOT the full bestiary/equipment registries — kept isolated), and stances are defined — typecheck + content-verifier green. *(§2.8(c), §2.8.1, §4.6.1, §4.6.2, §4.6.9, §6.4, §6.5)*
2. **Deterministic seeded auto-battler (core/combat engine) feeding the three tracks** — A pure fixed-step CombatSim resolves a live fight stepped by core/step's per-tick path: derived stats (§4.6.1, attackPower scaled by `satietyRate` × the durability band [band scaffold; full bands at M2b]), the sub-tick per-weapon attack-speed accumulator (§4.6.2), hit-vs-evasion + damage-minus-defence with the canon floor (§4.6.3), separate seeded crit/block rolls (§4.6.4), and on-kill **combat-XP → the character (combat) level** + combat-skill XP (§4.6.5) — all draws from the one seeded RNG (combat cursor) and active intervention runs through the combat_action intent (stance/ability/item/**retreat**, §4.6.8); curated combat activities seed the **Combat Rank rung-meter** while the **Arms pillar conversion stays deferred to Phase 2 (M3b)**; no DOM / no Math.random / no Math.pow; loot tables + the full bestiary deferred (M2b). *(§2.8, §2.8.1, §4.6.1–§4.6.5, §4.6.8, §6.2, §6.3, §6.7)*
3. **Combat unit tests — determinism + the LOCKED win-rate band (at satiety) + the perk/conditioning rules** — Vitest proves a fixed-seed fight replays byte-identically (§6.7); the fresh-MC-vs-wolf win-rate sits in the LOCKED **20–35% band at adequate satiety (≥~0.7)** and a post-drills MC (~weaponSkill 5 / attrs 10) reaches ~85%+ (§4.6.6/§4.6.8, values referenced not invented); the satiety throttle lowers attackPower below the 0.7 knee (never below the ~0.5 floor / ~15% win-rate); the damage floor guarantees every fight terminates; and assertions confirm **conditioning enters NO combat stat or training rate** (the ZERO-stat enablement gate) while **each per-skill perk is small-magnitude, not `==0`, with no global cap** (the §6.6.1 perk-magnitude check) — verify green. *(§4.6.6/§4.6.8 (LOCKED), §4.4, §4.5.4, §6.6.1, §6.7)*
4. **Soft-setback-on-loss + retreat + the conditioning enablement gate** — A lost fight applies the full LOCKED setback shape via core/rewards + reduce/step — drop to 1 HP, advance ~½ day, a random light recoverable injury (effects[], ~1–2 days, −10% one stat), and a possible seeded carried-loot drop — and a retreat resolves cleanly (keep HP + loot, ~¼-day clock, NEVER dents Influence except an abandoned DEFEND-deed → a recoverable Arms dent, §4.2.4/§4.6.8); a test asserts a loss/retreat NEVER removes a level, equipped gear, or Influence; the R3 conditioning floor is implemented purely as a one-way access predicate granting ZERO combat/training bonus. *(§4.6.6/§4.6.8 (LOCKED shape), §4.2.4, §4.4, §1.13, §6.5)*
5. **R3 reveal content — the humbling first fight, Drill Yard & Combat surfaces on the reveal bus** — Reaching the conditioning floor triggers the scripted wolf-at-the-grain-store fight (survived by luck, never rescued/skill); surviving it then begging Kihei flips the R3 rung (ranks.ts, STORY half of the AND-gate) and, through applyRewards/unlock predicates, reveals — **one beat at a time** (no UI-dump) — the Drill Yard (§3.3) + the Combat panel + the Combat nav node (§3.5) + the **single starter weapon** + the **retreat** control, and surfaces combat/weapon skills discover-by-doing — each pushing its diegetic event-log line (Kihei's creed beat); the full **Bestiary + Equipment/Inventory panels stay on the M2b half of the seam** (M2a uses the crude pole + wolf/sparring-target as the fixed setup; the character-level track is what begins here). *(§2.8.2, §3.2 (R3), §3.3, §3.5, §5 T0.2 (beats 4–5) / T0.4 / T0.5, §6.5)*
6. **Renderer wiring — Combat panel & Drill Yard (thin DOM, animates the result)** — src/ui renders the Combat panel and Drill Yard for unlocked surfaces only: stance/ability/item/**retreat** controls dispatch combat_action intents, HP bars and swing/crit numbers animate the deterministic outcome (never decide it), and win/loss/retreat + the soft setback display — responsive and not hover-dependent (inline-SVG/CSS register; load-bearing marks are inline SVG, emoji cosmetic-only — §6.9/§6.1.1), with zero game logic in the renderer. *(§6.9, §2.8(b), §3.5)*
7. **DEV play-API combat hooks + headless QA + verify-green checkpoint** — window.__qa can drive a headless run to R3 and trigger the first fight, setSeed/forceState a rare crit, and replay a fixed-seed fight (§6.10); a capture-game-states headless pass confirms R3 is reached, the fight auto-resolves, retreat works, and the forced-seed rare crit renders (loot deferred to M2b); gen:docs --check regenerates the ranks/skills content docs and the content-verifier's perk-magnitude + conditioning-gate invariants pass; full npm run verify is green — meeting the M2a definition of done with the auto-battler isolation-tested. *(§6.10, §6.6, §6.6.1, §6.1, §4.6.6/§4.6.8)*

### M2b — Bestiary + equipment + graded durability bands + the loot→craft gear loop

**Goal:** complete the combat slice — the bestiary fills by encounter, the equipment/inventory panels land,
loot tables drop, the **graded 4-band weapon-durability** surfaces, a **found/crafted 2nd T0 weapon** unlocks,
and the find→craft gear loop closes (R3→R4). *(Fixed combat-ENGINE milestone; the second half of the combat
slice.)*

**Lands:** the **Bestiary** (§2.9, the ~5 grounded mobs filling **by-encounter**, each with its `MobDef.level`);
**Equipment & Inventory** (§2.10) + the crude weapon and a **found/crafted 2nd T0 weapon** (the combat-reveal
ladder's R4 beat — §2.8.2/§7.2.0); the **graded 4-band weapon-durability bands** (Pristine/Worn/Battered/Broken →
1.0/0.9/0.75/0.55 on attackPower, fixed wear per fight, armour bands on defense; a weapon is **NEVER
auto-unequipped / never weaponless**; repair restores; Q33/FU17/§4.6.1c); **loot tables** wired into the
auto-battler's seeded resolution; the **find→craft gear loop** (loot feeds the simple crafting recipes, §4.7.2)
carrying into R4. Equipment stats + the durability band flow into the §4.6 combat math; weapon-line skills
surface by-doing in the Skills tab.

**Definition of done:** verify green; a headless run via `__qa` fills the Bestiary by-encounter and drops
seeded loot that **replays byte-identically** (§6.7); the equipment/inventory panels equip and the gear
stats + the durability-band multiplier enter the combat numbers (asserted); a weapon **degrades through the
bands but is never auto-unequipped** (asserted); a found→crafted **2nd T0 weapon** completes the loot→craft
loop end-to-end; the generated content docs (e.g. `docs/content/enemies.md`) regenerate and `gen:docs --check`
passes.

**Phases / high-level tasks:**

1. **Author bestiary, equipment, durability-band & loot-table data registries** — content/enemies.ts holds the ~3 remaining grounded T0 grindable mobs (wild boar, crop-raiding-monkey troop, rice-rats + a mamushi — the M2a wolf already exists), each with stats / `MobDef.level` / lootTableId / spawnWeightByRing, kept in a registry SEPARATE from an (empty/scaffold) BeliefBeast registry; content/items.ts holds the crude weapon + a found/crafted 2nd T0 weapon + found-gear EquipDefs (slot, statMods, durabilityMax) with the 4 durability bands defined in balance.ts (75+/50+/1+/0 → 1.0/0.9/0.75/0.55; §4.6.1c), and LootTable + per-ring SpawnTable entries land in content/areas.ts with rarity weights referenced from balance.ts (per §4.7.3, no restated numbers); the content-verifier asserts no belief-creature appears in any spawn table and every loot/item/recipe id resolves; verify stays green. *(§2.9, §2.10, §4.6.1c, §6.4, §6.5, §6.6, §4.7.3)*
2. **Wire equipment + durability bands into the §4.6 combat math + equip/durability intents** — effectiveStats (core/selectors) folds an EquipState's gearAtk/gearDef/gearEva/gearHp/gearBlock into the §4.6.1 combatant model and applies the durability band as a multiplier on attackPower (armour band on defense); reduce handles equip/unequip intents and applies fixed per-fight durability wear immutably (structural sharing, no Math.random/Math.pow/Date.now in core), **never auto-unequipping** a worn-out weapon (auto-battler safety) and restoring durability on repair/re-craft; a fixed-seed fight's resolved numbers provably differ with gear equipped vs not and across durability bands; verify green. *(§4.6.1, §4.6.1c, §4.6.3, §4.6.4, §6.3, §6.4)*
3. **Seeded on-kill loot roll + bestiary discover-by-encounter** — the auto-battler's on-kill path draws exactly one seeded LootTable roll (§4.6.5 + §4.7.3, rare/fine weight scaled by the §4.7.3 LUCK coefficient) through the single RNG (loot cursor) into inventory, and weighted per-ring spawn selection picks the active-encounter mob; a mob's first encounter flips its Bestiary entry unlocked (one at a time); all rolls thread state.rng so a fixed-seed run replays byte-identically; verify green. *(§2.9, §4.6.5, §4.7.3, §6.7)*
4. **Close the simple find→craft gear loop + the 2nd T0 weapon** — content/recipes.ts holds the simple-mode recipe(s) (flat inputs→output, ~100% success per §4.7.2, Smith Gonta seed) fed by dropped loot materials; reduce handles the craft and disassembly intents (disassembly returns ~60% materials per §4.7.2); a crafted **2nd T0 weapon** (the R4 combat-reveal-ladder beat) is equippable and its archetype params + stats reach the combat numbers — find→craft→equip is closed end-to-end in core; verify green. *(§2.10, §2.10.1, §2.11, §4.7.2, §6.3)*
5. **Unit tests: determinism, loot replay, durability & the gear/loop assertions** — Vitest suites assert a fixed-seed loot/spawn sequence replays byte-identically, gear stats + the durability band measurably enter the §4.6 combat numbers, a weapon degrades through the bands without ever auto-unequipping, the found→crafted 2nd weapon completes the loop, the Bestiary fills strictly by-encounter, and the canon invariants still hold (no belief-creature in spawn tables; conditioning enters no combat stat; per-skill perks small-magnitude); verify green with the new suites. *(§6.6, §6.6.1, §6.7, §4.6, §4.6.1c, §4.7.2)*
6. **Render Bestiary / Equipment / Inventory panels + the R3→R4 reveals** — content/surfaces.ts registers the three panels (and the durability-band readout + the 2nd-weapon grant) with R3/R4 unlock predicates; the thin-DOM renderer paints them as a pure function of GameState (Bestiary entry-by-entry, equip slots with durability band, inventory counts with colour + inline-SVG rarity cues per §6.11) and equips only by dispatching intents; each panel's first reveal pushes its diegetic §3.2 log line via the rewards/unlock bus; verify green. *(§2.9e, §2.10e, §3.2 (R3→R4), §6.9, §6.11)*
7. **Generated docs + headless QA close-out (the R3→R4 gear beat)** — gen:docs regenerates docs/content/enemies.md (plus items/recipes tables incl. durability bands) from the registries and gen:docs --check passes; a headless __qa playthrough proves the DoD — Bestiary fills by-encounter, seeded loot replays byte-identically, equipping + the durability band move the combat numbers (asserted), and a found→crafted 2nd weapon completes the loop carrying toward R4 (Smith Gonta beat); a capture-game-states audit snapshots the new panels; final npm run verify green. *(§6.6, §6.10, §3.2 (R3→R4), §5 T0.6)*

### M3a — Quests + crafting + R4→R6 Phase-1 climb (basis builds; pillars not yet scoring)

> **Pre-split (D-Q-M3/M5-split):** the **first half** of T0's close-out, split at the **R6→R7 Phase-1/Phase-2
> seam** (M3b is the second half) — a smaller verifiable milestone. **Frontier = verify-green and playable to R6.**

**Goal:** stand up T0's **Phase-1** content surfaces — the quest system (its own top-level tab), hybrid crafting
(its own top-level tab), and the **stance + ability/item** combat-reveal beats — and climb **R4→R6**, building
the Estate/Arms **basis**. The four-pillar accrual ENGINE is built here too, but stays **gated + panel-hidden**:
**no pillar DEEDS score until the R7 capstone opens Phase 2** (M3b).

**Lands:** rungs **R4→R6** (§3.2) on the **rung-meter + story AND-gate**; the **simple Crafting tab** as its
**own top-level nav tab** (Q10) + the early loot→craft loop at R4 (§4.7.2, Smith Gonta seed); the **Main House**
interior + domestic economy (Cooking, provisioning) at R4; the **R4 graded-durability** beat carried from M2b;
the **R5 stance** slot + the **first weapon-line L10 ability/item** intervention slots (the combat-reveal
ladder, §2.8.2/§7.2.0) — R5's **curated combat activities feed the Combat Rank rung-meter** (Phase 1); the
**Quest log as its own top-level nav tab** (Q10) at R5 with the **4 STARTER quest types** (PEST-CONTROL → HUNT →
CLEAR → DEFEND; a taxonomy, not a count cap — Q23); the first ***shinden* reclamation** (a LAND lever, building
the Estate **basis**) and the **E1 build** (§4.7.5); the **Workshops & Granary** + **E2 start** at R6. The
**four-pillar PHASE-2 accrual engine** is built (core + data + tests) but **GATED and panel-hidden** — the
**pillar DEEDS do NOT accrue while climbing R4→R6** (FU7); they begin in **M3b** at the R7 capstone.

**Definition of done:** verify green; a headless run climbs **R4→R6**, each rung promoting on the **rung-meter +
story AND-gate**; the **Crafting tab** and the **Quest log** each reveal as their **own top-level nav tab** (Q10)
and a headless run can take + complete one of each of the **4 starter quest types**; the **R5 stance** + the
**first weapon-line L10 ability/item** slots reveal **one beat at a time** (no UI-dump); the first *shinden* + the
**E1 / E2** builds fire on their §4.7.5 floor+cost; the four-pillar accrual engine is built **but proven gated** —
**a run stopped at R6 has ZERO pillar score** (asserted; the panel stays hidden until R7/M3b); the per-rung
≥30-min pacing is instrumented; gen:docs --check passes.

**Phases / high-level tasks:**

1. **Build the four-pillar PHASE-2 Influence accrual engine (core + data + tests)** — Done when content/influence.ts holds the 4 pillars, the **hybrid good/great/excellent** per-tier bands (values referenced from §4.1, re-derived per-pillar-per-tier against the FIXED §4.2.1 deed inventory — NOT simple ratios) and the deed registry; applyRewards' pillarDeltas produce capped achievement JUMPS (PER_EVENT_CAP = 0.04·good-band) and the per-season tick hook produces JUDGED RESULTS (TIER_REF-normalized, sqrt-shaped [whitelisted sqrt], high-water-mark up-only, integer-pow only), **all GATED so they fire ONLY once Phase 2 is open** (derivable from the current rung — the R7 capstone; NO extra phase flag, §6.4); the trade≤⅓ clamp (tradeAllowed = 0.5·(land+treasury), the non-circular form §4.2.3 mandates) applies at every accrual point (no trade term at T0); the recoverable-dent scaffold exists — all pure core (no DOM/Date.now/Math.random/Math.pow); Vitest proves caps bind, trade≤⅓ holds, accrual is jumps+seasonal only (no trickle), up-only, deeds do NOT accrue before Phase 2, dent self-heals without touching highWater, and a fixed-seed scripted run is byte-identical. Panel stays hidden (reveals at R7). *(§2.16, §2.16(e), §4.0.1, §4.1, §4.2 (incl. §4.2.1/§4.2.2/§4.2.3/§4.2.4), §4.3, §6.3, §6.4, §6.5)*
2. **R4 rung — Crafting top-level tab + loot→craft loop + Main House domestic economy + first shinden + E1 build** — Done when the **simple Crafting tab reveals as its own TOP-LEVEL nav tab at R4** (Q10) and R4 content is wired to it — the craft *core* (content/recipes.ts + the craft/disassembly intents + the find→craft loop) was already built in **M2b**; M3a surfaces the tab and feeds found loot through it end-to-end; the Main House/Omoya area + domestic-economy activities (Cooking/provisioning) feed the satiety loop (§2.3); the first shinden reclamation (LAND lever) builds the Estate **basis** (the influence DEED for it does NOT score until Phase 2); and the E1 estate build fires on its §4.7.5 floor+cost. Each surfaces as its own separate diegetic reveal beat on the bus; verify green. *(§2.11, §4.7.2, §2.17, §4.7.5, §2.3, §3.2 R4, §3.3, §5 T0.4)*
3. **R5 rung — Quests top-level tab + the 4 starter quest types + the stance combat beat (curated activities → Combat Rank)** — Done when content/quests.ts + the **Quest-log TOP-LEVEL nav tab** (Q10) land with the accept_quest intent and event-driven (non-waypoint, open-ended, gatesSpine:false) task advancement; the 4 STARTER quest types reveal as each is first taken — PEST_CONTROL → HUNT → CLEAR → DEFEND (a taxonomy, not a cap — author more as fits); the **R5 stance** slot reveals (the combat-reveal ladder beat); and the **curated combat activities (incl. DEFEND) feed the Combat Rank rung-meter (Phase 1) — the Arms PILLAR DEEDS still do NOT accrue (Phase-2-gated, post-R7)**; verify green and a headless run can take and complete one of each type. *(§2.8.2, §2.12, §3.2 R5, §4.1.1, §6.5)*
4. **R6 rung — Workshops & Granary + E2 + ability/item slots + village-tier seed (basis climbs, no pillar scoring)** — Done when the Workshops and Granary areas reveal separately, proto-industry LAND/TREASURY Estate levers are driven by ACTIVE labour (explicitly NOT T3+ auto-producers — active-only, no idle accrual per canon §G/§2.5) building the Estate/Arms **basis** (no pillar DEED scores yet — Phase 1); the **first weapon-line L10 ability + item** intervention slots reveal (the combat-reveal ladder beat); the E2 build fires on its §4.7.5 Estate+Arms floor+cost; and errands-beyond-the-estate authorise the village-tier map seed + the road out. Verify green. *(§2.8.2, §3.2 R6, §4.7.5, §2.17, §2.16, §2.5, §5 T0.2 beat 7-8)*
### M3b — R7 capstone OPENS Phase 2: four-pillar grind + two-bar Influence panel + the T0→T1 hybrid gate → T0 complete

> **Pre-split (D-Q-M3/M5-split):** the **second half** of T0's close-out — the **R7 capstone that OPENS Phase 2**.
> **Frontier = verify-green with all of T0 complete to the T0→T1 hybrid gate.**

**Goal:** close out T0 — at the **R7 capstone that OPENS Phase 2**, the four House-Influence pillars accrue their
**DEEDS** for the first time and the House Influence panel reveals the **two revealed T0 bars** (Arms + Estate)
one at a time, gated by the **HYBRID good/great/excellent** T0→T1 tier-gate → **T0 complete**.

**Lands:** the **R7 capstone** (§3.2) that **OPENS Phase 2** — the **four-pillar PHASE-2 accrual model** (§4.2:
achievement-JUMP DEEDS **≈70%** + seasonal-judged-on-high-water-mark **≈30%**, per-event-capped, up-only +
recoverable-dent scaffold) where the **pillar DEEDS accrue for the first time** (they did **NOT** accrue while
climbing R0–R7 — FU7); the **House Influence panel** revealing its **two T0 bars (Arms + Estate)** bar-by-bar as
each first scores (Office + Name unrevealed at T0 — the revealed-pillar set is **T0 = 2**); the **House screen** +
the per-tier domain-ranking "unranked" read (§3.5, §2.18); the **T0→T1 HYBRID gate** wired — **good in BOTH
revealed pillars (Arms + Estate) + excellent in 1** (the T0 2-pillar special; **NO overflow**; the good band ≈
Arms 0.5K / Estate 0.8K — *proposed v1 balance* — §4.1) **AND** the story gate.

**Definition of done:** verify green; a headless run completes **all of T0** to the T0→T1 hybrid gate; **pillar
DEEDS accrue ONLY in Phase 2** (after the R7 capstone opens it — asserted: a run that stops at R6 has zero pillar
score); the House Influence panel reveals its **two T0 bars (Arms + Estate)** one at a time as each first scores
(Office + Name stay unrevealed); the **trade ≤⅓** invariant holds at every accrual point (verifier-asserted,
§4.2.3 — though T0 has **NO trade strand**: the trade strand opens at T1, so the cap is trivially satisfied);
accrual is **jumps + seasonal only** (no time-trickle / no flat per-action — verifier-asserted); the
deeds/seasonal split lands ≈70/30 over T0's Phase 2 (§4.8.1); the autumn harvest sets the headline seasonal
high-water mark; the **hybrid gate** evaluates only the **revealed** pillars (never "good in ALL" against an
unrevealed Office/Name — the §6.6.1 gate-distribution check); the T0→T1 transition fires its story beat + log line.

**Phases / high-level tasks:**

1. **R7 capstone — OPEN Phase 2: two-bar Influence panel (bar-by-bar) + House screen + ranking read + the T0→T1 HYBRID gate** — Done when the lord's-study area reveals and the **R7 capstone OPENS Phase 2** — the four-pillar grind unlocks and the **pillar DEEDS begin accruing for the first time** (the basis built over R0–R7 now scores; the seasonal appraisals post against the already-high basis, §4.2.2); the House Influence panel becomes visible, revealing its **two T0 bars (Arms from the recorded martial deeds, Estate from the shinden/works)** ONE at a time as each first scores (Office + Name unrevealed — revealed-pillar set T0=2); the House screen + the per-tier domain-ranking 'unranked' read (§2.18) appear; and the **T0→T1 HYBRID gate** (good in BOTH Arms + Estate + excellent in 1 — the 2-pillar special, NO overflow; §4.1 — referenced, not restated — + the story gate) is wired so crossing it fires the transition story beat + log line ('Now: the valley.'). Verify green. *(§2.16, §2.16(e), §3.2 R7, §2.18, §3.5, §4.1, §5 T0.2 beat 8)*
2. **Headless QA, pacing instrumentation & generated docs (T0-complete verification)** — Done when a headless __qa run completes ALL of T0 to the T0→T1 hybrid gate; tests assert pillar DEEDS accrue ONLY in Phase 2 (a run stopped at R6 scores zero), the two T0 bars reveal one at a time as each first scores, the trade≤⅓ invariant and 'jumps+seasonal-only (no trickle)' hold as content-verifier machine checks, the hybrid gate is checked only against the REVEALED pillars (the §6.6.1 gate-distribution + gate-monotonicity checks), the deeds/seasonal split lands ≈70/30 over T0's Phase 2 (§4.8.1), the autumn harvest sets the headline seasonal high-water mark, and the per-rung ≥30-min pacing is instrumented; docs/content/influence.md (+ recipes/quests/ranks) regenerate and gen:docs --check passes; full npm run verify green. *(§4.8.1, §6.6, §6.6.1, §6.10, §6.3, §4.2.2, §4.2.3)*

### M4 — T1 Village (rep web · rumours · coin · silk) + 2nd weapon line + intra-line dialogue + the Naoyuki beat — V0→V7

**Goal:** the second fresh ladder and the static reputation web — the estate as a presence in its valley —
plus the **2nd combat line** (+3 T1 weapons), **intra-line dialogue branching**, and the **Naoyuki
rivalry→respect** interstitial beat.

**Lands:** the **T1 ladder V0→V7** (§3.4) as a **fresh ladder** (rung-meters reset) on the **rung-meter + story
AND-gate** (§2.15.1); the **Village screen** + the **Market / Shop Row** opening **one shop first** then
fractally (§3.4 V0); **coin (*mon*)** (§2.4); the **static reputation web** (§1.5.2, §2.15: per-shop,
per-family, artisans' guild, the chief Yagōemon's regard) — **gentle curves**, an **optional accelerant**,
**never gates the spine**; the **Inn & Rumours Board** (§2.13) with optional folklore tidbits unlocking
**organically / per-tier** (never an all-at-once dump); the **component/quality crafting system** (§4.7.2) from
V3; the **silk / sericulture *meibutsu*** **TRADE strand of Estate & Wealth** opening at V3 (trade ≤⅓-capped — the
trade strand opens at **T1**, never T0); **fishing surfaces** (Q4) in the Skills tab; the **2nd combat line**
(a Combat Rank rung-gate at T1) with **+3 T1 weapons** revealed one at a time on the combat-reveal ladder
(§2.8.2/§7.2.0); **intra-line dialogue branching** (`choices[]` / `ChoiceId`, deterministic, only chosen-flags
persist; Q34/FU22) wired into the dialogue/quest bus; the **Naoyuki rivalry→respect** interstitial beat (the
internal-rival heir turns from grudging vouching toward ally, authored via intra-line choices; §5 T1.2/T1.5);
the **Standing & Office pillar REVEALED** for the first time at V4 (Magobei's rice-skim thread — the third bar
appears, the **revealed-pillar set reaches T1 = 3**; it **scores its DEEDS only in T1's Phase 2**, post-V7 —
FU7); valley-scale combat (HUNT/CLEAR, road-warden) + the **first paid martial outsiders** as **flavour roster
cards** (§2.17 — not managed units); the festival/seasonal social layer deepening (§2.14, day-keyed weather);
estate **E1 → E2** completing; the **T1→T2 HYBRID gate** (good in all **3** revealed pillars — Arms + Estate +
Office — · great in 2–3 · excellent in 1–2; NO overflow; §4.1 — + "clean your room").

**Definition of done:** verify green; a headless run completes **all of T1**; the village can be **ignored
without blocking the spine** (a spine-only headless run still reaches the T1→T2 hybrid gate, just slower —
asserted); the rumours board unlocks tidbits **per-tier organically**; the component crafting quality
tiers compute per §4.7.2; the **2nd combat line + 3 T1 weapons** reveal one beat at a time (no UI-dump); the
intra-line `choices[]` resolve deterministically and **only the chosen flags persist** (asserted); the Naoyuki
rivalry→respect beat fires via intra-line choices; the **Office pillar REVEALS at V4** but its DEEDS accrue only
in T1's **Phase 2** (post-V7 — asserted); rep-web curves are gentle (frequent small gains); the responsive nav
(§6.9) shows the same reveals in the same order on a narrow viewport.

**Phases / high-level tasks:**

1. **T1 data foundation: registries + balance constants** — Done when the fresh V0→V7 rank ladder (rung-meter thresholds back-solved from the ≥~40-min T1 floor + story AND-gate), the T1 areas (Market/Shop Row, Chief's House, Inn, Shrine, Boundary-Stone, River/Ford/Weir, Foothills/Charcoal), the 3-mob valley set (giant hornets, wolves pack, bandits/deserters — each with `MobDef.level`), the +3 T1 weapons (archetype params + signature, the 2nd archetype line), the coin (mon) resource, fishing, the Village + Region nav/screen surfaces, the E1→E2 build costs, and the T1 §4 tunables (yields, deed bases, hybrid gate bands, season wall-clock) are all authored as typed data — no logic yet — and `npm run verify` is green: tsc clean, content-verifier resolves every new id (no orphans), and `gen:docs --check` passes with the regenerated ranks/areas/influence/balance docs committed. *(§6.5, §6.6, §3.4, §3.5, §1.7/§1.8, §2.4, §2.9, §2.10.1, §4.7.5, §4.8.2, §4.1, §4.1.1, §4.2.1)*
2. **Coin economy + the V0–V2 early spine (presence, valley combat, 2nd combat line)** — Done when a headless run climbs V0→V2: V0 opens the Market/Shop Row one-shop-first (Gonta) then fractally adds the rest and lights the coin (mon) row + Village screen nav; V1 opens the Chief's House and deeper satoyama; V2 (road-warden) opens the Ford/Weir + Foothills wilderness rings, opens the **2nd combat line** (a Combat Rank rung-gate; +T1 weapons revealing one at a time), runs HUNT/CLEAR at valley scale via curated activities that feed the **Combat Rank rung-meter** (the road-safe **Arms DEED stays Phase-2-gated**, post-V7). Rung transitions (rung-meter + story AND-gate) and the fractal reveal order are covered by deterministic unit tests; verify green. *(§3.4 (V0–V2), §3.4.1, §2.8.2, §2.4, §2.6, §2.8/§2.9, §4.6, §4.1.1, §2.1, §6.3)*
3. **Component/quality crafting + the silk TRADE strand (V3)** — Done when component recipes compute outputQualityTier per §4.7.2 (0.4 skill / 0.4 component / 0.2 station, QUALITY_DIVISOR 10, 1.25^tier value step [integer-pow], ~60% disassembly) with quality as part of the stack key; the silk/sericulture meibutsu chain (cocoon → reeled silk → woven/graded textile) runs as the **TRADE strand of Estate & Wealth** (opening at T1) under the broker-meter + market-saturation damper (the only persisted economy state); and the **trade ≤⅓-of-Estate&Wealth HARD cap** holds at every accrual point. Unit tests assert quality-tier math and the trade-cap invariant (also verifier-asserted); verify green. *(§2.11, §4.7.2, §2.4, §2.16, §4.2.3, §3.4 (V3))*
4. **Village reputation web + Tama-vs-farmhand allegiance (optional accelerant) + intra-line dialogue** — Done when the static multi-node rep web (per-shop patron/regular meters, per-family goodwill, artisans' guild, headman Yagōemon's rolled-up personal regard) rises on gentle curves with frequent small gains, the continuous allegiance leaning rebalances rates/flavour only, the combined village feed speeds the climb ~10–15% as a pillar multiplier (never a new pillar, never a spine trigger), and the **intra-line dialogue `choices[]`** resolve deterministically with **only chosen-flags persisting** (data-not-scripting; locksLineIds[]/flags effects; Q34/FU22). Unit tests assert the web gives frequent small gains, a spine-only run still reaches the T1→T2 gate (village fully ignorable), and intra-line choices are deterministic + persist only the chosen flags; verify green. *(§1.5.2, §1.5.4, §2.12, §2.15, §4 (gentle curves — reference))*
5. **Inn & Rumours Board + belief→cause folklore (organic, ≤1 ambiguity)** — Done when the rumours board (Sukezō) unlocks optional folklore tidbits organically per-tier as the estate/village grow (kappa-of-the-ford opener at V1, more drip-fed — never an all-at-once dump), each belief resolves one-to-one to a grounded human/natural cause with dawning unease, the optional side-quests (per-family help, register entry, rogue-bear HUNT, fox-fire seed) are present, and exactly one residual-ambiguity token (the boundary-stone offering) exists game-wide. Verifier asserts ≤1 ambiguity and the belief→cause coverage; none of it gates the spine; verify green. *(§2.13, §2.9, §1.10, §3.4/§T1.7, §6.6)*
6. **V4–V7 spine: Office REVEAL (Magobei) + the Naoyuki beat → man-at-arms → 'clean your room' HYBRID gate (Phase 2)** — Done when a headless run completes V4→V7: V4 resolves Magobei's rice-skim STORY beat (doctored-masu motif) which **REVEALS the Standing & Office pillar** (the third bar appears on the panel — revealed-pillar set T1=3 — though its DEEDS score only in Phase 2) and plays the **Naoyuki rivalry→respect** interstitial via intra-line choices; V5 stands up DEFEND quests (curated → Combat Rank) + the first paid retinue (Gohei & Yatarō) as flavour roster cards and triggers the E2 'Recovering' estate build; V6 surfaces the region-map seed; V7 fires the 'clean your room' capstone that **OPENS T1's Phase 2** (the pillar DEEDS now accrue — Arms/Estate/Office), meets the **T1→T2 HYBRID gate** (good in all 3 revealed pillars + great in 2–3 + excellent in 1–2; §4.1 + story gate) and reveals the Region screen. Seasonal judged-results + festival/weather social layer (Tokuemon hub) feed the Phase-2 gate at ≈70/30 deeds/seasonal. Unit tests cover the Phase-2 Office accrual, the hybrid gate predicate (checked only against revealed pillars), and that Office REVEALS exactly at V4; verify green. *(§3.4 (V4–V7), §3.4.1, §2.16, §2.16(e), §4.0.1, §4.2.1/§4.2.2, §4.1, §5 T1.2/T1.3/T1.5 (Magobei + Naoyuki), §2.12, §2.17, §4.7.5, §2.14, §3.5)*
7. **Renderer wiring, responsive nav + headless-QA DoD sweep** — Done when the thin DOM renderer paints the Village screen (shop row, rep-web meters, rumours board), the panel's Office reveal (the third bar), the component-crafting/silk UI, the 2nd-combat-line controls, and the Region-screen reveal — reading reveals from surfaces.ts with K/M/B formatting and no game logic — and the same reveals appear in the same order on a narrow viewport. A `capture-game-states` headless run via window.__qa completes ALL of T1 to the T1→T2 gate, a spine-only run still reaches it (just slower), the rumours board drip is confirmed per-tier, and audit screenshots of the key beats are captured. Final `npm run verify` green. *(§6.9, §6.10, §6.6, §4.8.2, capture-game-states skill)*

### M5a — T2 Region canvas: trade backbone + sekisho travel + 3rd combat line + the G0→G3 climb (Origin opens at G2)

> **Pre-split (D-Q-M3/M5-split):** the **first half** of T2, split at the **subsystem seam** (M5b is the second
> half) — a smaller verifiable milestone. **Frontier = verify-green and playable to G3, with the new T2
> subsystems standing.**

**Goal:** stand up the T2 region canvas — the **trade backbone** + the **sekisho travel-standing** subsystems,
the region-scale combat (**3rd combat line**, +4 T2 weapons), and the estate-spine climb **G0→G3** with the
**Origin faction OPENING** at G2 (double-gated). Phase-1 climb only — the **pillar DEEDS stay Phase-2-gated**
(post-G7, M5b).

**Lands:** the **T2 ladder G0→G3** (§3.6) as a **fresh ladder** on the **rung-meter + story AND-gate**; the
**Region screen** + the **trade backbone** opening minimally (one route/porter/verb via Kanta — the MC's own
porter past, §3.6 G0); the ***sekisho* / pass-tier travel layer** (§3.6 G1); **region-scale grounded human
mobs** (rōnin / bandits / smugglers — still the ~5-mob cut-set, scaled, each with `MobDef.level`; NO
belief-creatures); the **3rd combat line** (a Combat Rank rung-gate at T2) with **+4 T2 weapons** revealed one at
a time (§2.8.2/§7.2.0); the **Origin faction OPENS** at G2 (memory-gated, **double-gated**: STORY dream-memory
**AND** PILLAR travel-standing — §1.5.3, §3.6 G2) with the **Origin / Ties screen** and the **`O0→O5` Origin
reputation ladder** registered (§3.6.2; **ZERO mechanical gift** — access only); **Sawatari-juku** + the two
**Neighbouring Valleys** (Hibara + Tōge-mura, hard-capped at 2); the early **Tomita / Akagi** rival escalation.
The **pillar DEEDS stay Phase-2-gated** (post-G7, M5b) — the curated activities feed the **Combat Rank / Estate
Service rung-meters** only.

**Definition of done:** verify green; a headless run climbs **G0→G3** on the **rung-meter + story AND-gate**; the
new **trade backbone** opens minimally with the **trade ≤⅓** HARD cap holding at every accrual point
(verifier-asserted), and the **sekisho** travel layer gates region travel on travel-standing; the **3rd combat
line + 4 T2 weapons** reveal one beat at a time (no UI-dump) and region-scale human mobs resolve through the §4.6
auto-resolve combat with **NO belief-creature in any spawn/population table** (asserted); the **Origin faction is
double-gated** (it does not open on memory alone, nor on standing alone — asserted), firing the Origin/Ties screen
at G2; the per-rung ≥30-min pacing is instrumented; gen:docs --check passes.

**Phases / high-level tasks:**

1. **Lay the T2 data spine (registries, screens, hybrid gate, pacing refs)** — Done when the T2 content is authored as data — the G0→G7 rank ladder (ranks.ts; rung-meter thresholds back-solved from the ≥~75-min T2 floor + story AND-gate), the region areas/edges/conditioning gates (Region screen, Kaidō routes, Sawatari-juku, Hibara, Tōge-mura, Kuzuhara, High Mountains/Pass — areas.ts), the scaled ~5-mob region cut-set (enemies.ts, `MobDef.level`, no belief-creature tags), the +4 T2 weapons (the 3rd archetype line), the new Region + Origin/Ties surfaces with unlock predicates (surfaces.ts), the E3 build cost row, and the T2 hybrid gate bands + T2 pacing/season constants wired into balance.ts as REFERENCES to §4.1/§4.8.3 (no invented numbers) — and the content-verifier resolves every new id with no orphans; build verify-green. *(§6.5, §6.6, §3.6, §4.1, §4.7.5, §4.8.3, §2.9, §2.10.1, §1.7.1)*
2. **Build the two new T2 core systems: the capped trade backbone + the sekisho travel-standing layer** — Done when (a) the region trade backbone opens minimally in pure core (one route/one porter/one verb — Kanta's off-books consignment) by extending the existing capped Estate&Wealth trade sub-engine, with the trade-≤⅓ HARD invariant holding, and (b) the sekisho/pass-tier travel layer gates region travel on travel-standing (first barrier turn-back → pass under the house seal) — both as pure reduce/tick/economy logic with unit tests asserting determinism (one seeded RNG, per-stream cursors), the ≤⅓ cap, and active-only yields (no idle/auto accrual). *(§2.4, §4.2.3, §4.7.1, §6.2, §6.3, §3.6 (G0/G1))*
3. **Author the region combat content: 3rd combat line, scaled human mobs, Hanzaki, and the belief→cause one-shots** — Done when the **3rd combat line** opens (a Combat Rank rung-gate; +4 T2 weapons revealing one at a time) and the region-scale grounded human mobs (rōnin/bandits/smugglers, plus the bear/dogs/poacher set) resolve through the existing auto-resolve combat at §4.6 scale; the brigand-roost CLEAR target plus the CLEAR/CAPTURE-with-mercy (famine-band fed, not killed) branch work; Hanzaki is a survived-not-won DUEL nemesis (trained/endurance, never gifted); and the 'one-eyed mountain god' (+ fox-fire ridge) are INVESTIGATE-then-confront one-shots resolving to human/terrain — with the verifier asserting NO belief-creature in any spawn/population table. *(§2.8, §2.8.2, §2.9, §4.6, §3.6 (G1/G5), §5 T2.3/T2.6 (canon §E))*
4. **Author the estate spine, climb chunk — rungs G0→G3 + early rival escalation + the Origin track OPENING at G2** — Done when G0 valley-envoy → G1 road-captain → G2 post-town broker (toiya registration) → G3 arbiter-between-valleys (Hibara/Tōge-mura, capped at two) play as quests/dialogue/rank-earn conditions (rung-meter + story AND-gate), each promotion earned via its concrete trigger and named HOUSE-side granter (Genemon → Lord Shigemasa, region figures only acknowledging/contending), with the Tomita/Akagi rivalry escalating per-rung, the curated activities feeding the **Combat Rank / Estate Service rung-meters** (the pillar DEEDS still **Phase-2-gated**, post-G7), and the G2 doubly-earned (STORY dream-memory AND PILLAR travel-standing) gate firing the Origin/Ties screen unlock — a headless run reaches G3. *(§3.6 (G0–G3), §3.6.1, §5 T2.2/T2.3, §2.12, §2.16, §4.1.1)*
### M5b — G4→G7 + E3 + the four-pillar Phase-2 grind + cross-pillar combos + the G6/Origin payoffs → v1 content complete

> **Pre-split (D-Q-M3/M5-split):** the **second half** of T2 — the back-half climb, the Phase-2 grind, and both
> personal payoffs. **Frontier = verify-green with ALL of T2 complete to the T2→T3 end-gate → v1 content complete.**

**Goal:** close out T2 and **v1 content** — the back-half climb **G4→G7** (the **E3 'Prosperous'** estate stage),
the **four-pillar Phase-2 grind** with the **broadened cross-pillar combos** (the T2 anti-slump), and **both
personal threads resolving** (the spine-guaranteed **G6** Otsuru/Tama truth + the missable **O5** name-reclaim).
On completion **v1 content is feature-complete**.

**Lands:** rungs **G4→G7** (§3.6) on the **rung-meter + story AND-gate**; **Kuzuhara** re-foundable hamlet + the
multi-stage **river-works (*seki*)** LAND mega-lever (G4); the **E3 'Prosperous'** estate stage authored (Q8 —
folded into the G-tier koku/Arms spend, §4.7.5; E4–E5 stay parked); the capped **2–3-man road-security detail** +
the **Hanzaki** encounters (**survived, not won**) + the CLEAR/CAPTURE-with-mercy branch (G5); the **Name & Honour
pillar surfacing** as the 4th bar at the **G7 capstone that OPENS T2's Phase 2** (the revealed-pillar set reaches
**T2 = 4**); the **broadened cross-pillar combos** (the T2 anti-slump — multiple pillar pairs / larger
magnitude, computed **POST trade-clamp**, **EXCLUDED** from the gate-threshold check, verifier-proven never to
breach ⅓ nor satisfy a required pillar; paired with seasonal-reward rotation; Q22/FU20/§4.3.1); **the G6
personal-mystery PAYOFF** — the grown **Otsuru** found (Tama was a *girl* who *ran*; the MC is **not** her —
partial, grounded) — the **TRUTH spine-guaranteed at G6 for every player**; the **Origin reunions** complete incl.
father **Jinpachi**, and on the **O5 Origin capstone** the MC **reclaims his true name "Tahei"** (earned,
de-emphasised, and **MISSABLE** — a player who skips the Origin track finishes without it; the epilogue is
conditional on it) with the pride/morale support buff (a *present-day* relationship, **ZERO retroactive gift**);
the **rival houses (Tomita / Akagi) eclipsed** (Tomita never killed); the **T2→T3 v1 end-gate** as the **HYBRID
profile** (good in the 4 revealed pillars + great in 2–3 + excellent in 1–2; §4.1) → the **castle-town /
Daikan's-Office first-contact STUB** (Q24).

**Definition of done:** verify green; a headless run completes **all of T2** to the T2→T3 hybrid gate; the **E3
'Prosperous'** build fires on its §4.7.5 floor+cost; the **cross-pillar combos** are computed **POST trade-clamp**,
**excluded** from the gate-threshold check, and the §6.6 verifier proves a combo can **never** breach ⅓ nor
satisfy a required pillar (§4.3.1); **at least one origin beat is always available without reputation-gating** so
the thread never stalls (§1.5.3 — asserted); returning memory grants **access only, ZERO mechanical bonus** (no
stat/recipe/tool/combat bonus traceable to a memory or porter's-knot flag — verifier-asserted, §4.5.3); the **G6
Otsuru/Tama TRUTH fires its full story beat for EVERY player** (spine-guaranteed) while the **O5 'Tahei'
name-reclaim is MISSABLE** (a spine-only / Origin-skipping run reaches the end-gate without it — asserted) and the
epilogue reads conditionally; the "one-eyed mountain god" is an INVESTIGATE-then-confront **one-shot** (Hanzaki +
terrain), **never a spawn population** (§3.6, canon §E); ≤1 residual-ambiguity token across all content
(verifier-asserted).

**Phases / high-level tasks:**

1. **Author the estate spine, eclipse chunk — rungs G4→G7 (Kuzuhara mega-lever, E3, road-detail, alliance, gate) + rivals dethroned + the Daikan STUB** — Done when G4 recognised-regional-retainer (the multi-stage Kuzuhara river-works LAND mega-lever + naming the drowned + the **E3 'Prosperous'** build; resettlement as a region node kept FLAVOUR, with any returnee 'producer' scaffold-only — no auto-producer code path before T3) → G5 captain of the hard-capped 2–3-man road-security detail → G6 alliance-broker (Akagi precedence restored, Tomita boxed in, never killed) → G7 leading-house capstone that **OPENS T2's Phase 2** (the Arms/Estate/Office/Name DEEDS now accrue; the Name & Honour bar surfaces — revealed-pillar set T2=4) all play with earned HOUSE-side promotions, and the **T2→T3 HYBRID end-gate** (good in the revealed pillars + great in 2–3 + excellent in 1–2, per §4.1) fires the **castle-town / Daikan's-Office first-contact STUB** (Q24); a spine-only headless run reaches the gate. *(§3.6 (G4–G7), §3.6.1, §5 T2.2, §2.16, §2.16(e), §2.17, §2.5 (parked), §4.1, §4.7.5, §4.8.3)*
2. **Author the Origin reputation side-track O0→O5 and fire the G6 truth + the MISSABLE name-reclaim** — Done when the standalone Origin Ties ladder O0→O5 (own meter, opens at the doubly-earned G2 gate) plays on the Origin/Ties screen with the reunions (Oyuki/Okimi/Denbei/Kanta/Osen/Jinpachi) — the **G6 Otsuru/Tama TRUTH (Tama was a girl who ran; the MC is NOT her — grounded/partial) fires for EVERY player on the spine**, while the **O5 capstone name-reclaim ('Tahei') is earned + MISSABLE** (a spine-only / Origin-skipping run never reclaims it; the epilogue is conditional) and the present-day pride/morale buff lands — verifier-asserting the Origin track NEVER appears as a spine trigger, that returning memory grants access only with ZERO mechanical gift (no stat/recipe/tool/combat bonus traceable to a memory or porter's-knot flag), and that ≥1 Origin beat is always available without rep-gating so the thread never stalls. *(§3.6.2, §1.5.3, §3.5, §5 T2.5/T2.7, §4.5.3, Q5/D-036)*
3. **Build the cross-pillar combos (T2 anti-slump) + seasonal-reward rotation** — Done when the broadened cross-pillar combos compute **POST the trade-≤⅓ clamp**, are **EXCLUDED** from the hybrid-gate-threshold check (they never satisfy a required pillar nor move the trade ratio), and the seasonal-reward rotation lands — with the §6.6 verifier **proving** a combo can never breach ⅓ nor satisfy a required pillar (the trade-post-combo proof, §6.6.1); unit tests cover the post-clamp ordering and the gate-exclusion; verify green. *(§4.3.1, §4.2.3, §2.16, §6.6.1, Q22/FU20)*
4. **Wire the renderer + close out M5b: verifier invariants as machine checks + headless QA + generated docs + audit** — Done when the thin DOM renderer paints the Region and Origin/Ties screens plus the trade-route, sekisho-pass, 2–3-man-detail, and 3rd-combat-line surfaces purely from GameState (no game logic in ui/), every first-time reveal pushes its diegetic log line in the §3.6 order, the responsive nav holds; AND verify is green with the M5b DoD machine-asserted via __qa: a headless run completes ALL of T2 to the T2→T3 gate AND a spine-only run still reaches it; the Origin double-gate, the always-available ungated beat, the zero-mechanical-gift rule, and the **G6-truth-guaranteed / O5-name-reclaim-missable** split are asserted; the cross-pillar-combo ⅓-unbreachable + gate-exclusion proofs, the one-eyed-mountain-god one-shot (never a population), and ≤1 residual-ambiguity token hold; generated docs (ranks/areas/bestiary/influence) are current; and a capture-game-states sweep audits the key beats (G2 Origin open, Kuzuhara works/E3, G6 payoff, G7→Daikan stub). *(§6.6, §6.6.1, §6.9, §6.10, §3.5, §6.11, §4.8.4)*

### M6 — Balance pass to the §4 FLOOR + verifier & fun-proxy GATES green + a11y acceptance + inline-SVG / audio + the T3 Daikan-Office STUB → v1 launchable

**Goal:** make the whole curve hit the **LOCKED pacing FLOOR** (the per-tier hour budgets + the ≥30-min
per-rung minimums — a FLOOR, not a ceiling; FU18), prove every **V2 canon invariant** by machine, **promote the
fun-proxies from report-only to a GATING check** (Q4/FU9), land the **low-cost a11y acceptance** items (contrast
/ keyboard / screen-reader — Q18/Q48), apply the **inline-SVG + audio** register (Q38/Q50), ship the **T3
castle-town / Daikan's-Office first-contact STUB** (Q24) **wrapped in a reachable player-facing "v1 complete"
terminal closure + a defined post-gate clock/accrual policy** (D-Q-B11), **promote PERF to a build-failing gate**
(interim budgets — D-Q-perf/Q15 + Q56), and polish to a launchable feel. *(The grind can and
should run **longer** than the floor — both regressions fail on **UNDERSHOOT only**, §7.1.2.)*

**Lands:** the **balance pass** — tune `balance.ts` so a headless full playthrough is **AT LEAST** the floor:
**T0 ≥ ~4.5 h · T1 ≥ ~8 h · T2 ≥ ~16 h** (minimums — *longer is fine and desired*), **every grind rung ≥ ~30
min**, the within-tier **≤2–3× never-balloon** step, and the **≈70/30 deeds/seasonal** split (§4.8), by tuning
the **§4.9 LOCKED levers** only (master dials, accrual, gating cadence, producer/cost curves), all magnitudes
referenced from §4 (never invented); the **pacing regression** promoted to a hard `verify` gate that **fails on
UNDERSHOOT only** — a **grind** rung cleared in **< ~28 min** (the R0 cold-open story rung exempt, §4.8.1), or a
tier completed **under its hour floor**, fails; **overshoot never fails** (§4.8.4, §6.10); the **fun-proxy GATE**
(Q4/FU9 — the M1/M3a report-only proxies now **GATE the build**: dead-time, reward/unlock cadence,
always-a-visible-next-goal, the first-5-min hook, the **tier-relative deed-cadence** [T0 ~5 / T1 ~8 / T2 ~13 min,
Q20], and the **win-rate bands** at R3/V2/V5/G1/G5 [§4.6.6 — fresh ~30–45% / trained ~80%+] — failing on
**undershoot of the fun floor**, the mitigation for the new fun-risk row §7.4.1-R6); the **content verifier**
green on **all** V2 canon invariants (§6.6/§6.6.1: no belief-creature in any spawn/population table; **trade ≤⅓**
with the broadened cross-pillar combos proven **POST-clamp**, **gate-excluded**, and **⅓-unbreachable**; ≤1
residual-ambiguity token; the **HYBRID good/great/excellent** gate with **NO overflow**, evaluated only against
the **revealed** pillars [gate-distribution + gate-monotonicity]; **bounded per-skill perk magnitude** [each perk
*small*, **NOT** `== 0`, no global cap] with **conditioning == 0**; rung-meter monotonicity + the accrual
tie-out; the **`world.ts`** registry id-resolution [Q55]; the real-name denylist; macron / **K/M/B** lints; no
orphan ids); the **a11y acceptance** pass (§6.11: functional/hint text on **`--ink-soft`** passing **WCAG AA** on
every paper surface, **`--ink-faint`** decorative-only, darkened meter fills [Q48]; **full keyboard operability +
comfortable touch targets**; a **persistent quiet a11y entry from minute one**; the event log as an **ARIA
live region scoped to narration + milestones** ['polite']; a **large-textScale reflow** case; colourblind-safe
cues [colour never the sole cue]; reduced-motion; user pause; mute; a **screen-reader acceptance** pass — Q18);
the **inline-SVG load-bearing motifs** (pillar / season / rarity marks, identical across OSes; **emoji
cosmetic-only** — Q38/§6.1.1) + the **small curated audio set** (synthesized Web Audio + original/CC0 samples,
all behind **mute** — Q50/§6.1.1); the **T3 castle-town / Daikan's-Office STUB** — the §3.7.1 first-contact
screen at the **G7** capstone (the cliff-hanger "the page turns onto stone walls, and the story pauses"; the old
Porter / Kaidō-guild framing dropped; **NO** T3 ladder, auto-producers, or marriage/adoption lever built — Q24)
— surfaced as a **reachable player-facing "v1 complete" terminal closure** with a **defined post-gate
clock/accrual policy** (D-Q-B11): the **active loop CONTINUES** for free-play / cleanup while the **tier is HELD
at T2-complete** (no empty T3 committed, no clock stall); the **PERF GATE** (D-Q-perf/Q15 + Q56) — interim
budgets promoted to a **build-failing** check like pacing/fun: **save-envelope ≤ ~64 KB** (§6.6.1), **event-log
node-count ≤ the `LOG_RING_MAX` ring cap** (§6.9), **bounded tick-loop allocation** (no per-tick garbage
growth), and a **long-run memory ceiling** over an hours-long unattended run;
a **`capture-game-states` audit** sweep of the signature beats (audit/ screenshots).

**Definition of done:** verify green; the headless **pacing regression** confirms the FLOOR and **fails on
undershoot only** (a too-fast grind rung / an under-budget tier fails; a longer grind passes); the **fun-proxy
GATE** passes and is **wired as a gate** (it would fail on undershoot of the fun floor — no longer report-only);
**every V2 §6.6/§6.6.1 canon invariant passes as a machine check** (incl. the hybrid-gate-no-overflow against the
revealed pillars, the bounded-perk-magnitude + conditioning `==0`, the trade-post-combo ⅓-proof, gate +
rung-meter monotonicity, the accrual tie-out, the `world.ts` id-resolution, and the real-name + macron + K/M/B
lints); the **a11y acceptance** passes — a **keyboard-only** and a **touch-only** playthrough of the cold open +
one rung **AND** of a force-loaded late state (via `window.__qa`) exercising the combat panel
(stance/ability/item/retreat), the four-bar Influence panel, a focus-trapped modal, and the map screen;
`--ink-soft` clears WCAG AA on every paper surface; the live region announces reveals; the screen-reader pass
holds; the **inline-SVG / audio** register is applied (emoji cosmetic-only; audio behind mute); the **PERF GATE
passes and is wired as a build-failing check** (save-envelope ≤ ~64 KB, event-log node-count ≤ the `LOG_RING_MAX`
ring cap, bounded tick-loop allocation, a long-run memory ceiling — **fails the build on a breach**, D-Q-perf);
the **T3 stub** renders the cliff-hanger and then **STOPS cleanly** (no half-built T3 system reachable —
asserted) **AND a player-facing "v1 complete" terminal closure is reachable with a defined post-gate
clock/accrual policy** (the active loop CONTINUES for free-play; the tier is HELD at T2-complete) — asserted as a
**positive terminal-state test, not only the "no-T3" negative test** (D-Q-B11); the generated
docs (`docs/content/`, `docs/balance/`) are current (`gen:docs --check` passes); macron lint clean; all large
numbers display **K/M/B**.

**Phases / high-level tasks:**

1. **Build the headless pacing + fun-proxy instrumentation harness (one measured report)** — Done when a `__qa`-driven full T0→T2 (and spine-only) playthrough runs headlessly and prints a per-rung tick→wall-clock + per-tier-total report measurable against the §4 floor PLUS the fun-proxy report (dead-time, reward/unlock cadence, always-a-visible-next-goal, the first-5-min hook, the tier-relative deed-cadence [T0~5/T1~8/T2~13 min, Q20], and the win-rate bands at R3/V2/V5/G1/G5) PLUS a **PERF report** (save-envelope bytes, live event-log node-count vs the `LOG_RING_MAX` ring cap, per-tick allocation, and a long-run memory sample over an hours-long unattended run — D-Q-perf/Q15+Q56) — promoting the M1/M3a report-only proxies into one measured harness, landed as a reporting tool only so verify stays green. *(§6.10 (DEV play API), §4.8 (pacing tables/floor), §4.6.6 (win-rate bands), §6.6.1 (save-envelope budget), §6.9 (log node-count budget), fun-factor.md, docs/living/qa-playtesting.md)*
2. **Balance pass — tune balance.ts to the §4 FLOOR (minimums; longer-is-fine)** — Done when the measured playthrough is AT LEAST T0≈4.5 h / T1≈8 h / T2≈16 h, every grind rung ≥~30 min, the ≤2–3× within-tier never-balloon step, and the ~70/30 deeds/seasonal split — by tuning the §4.9 LOCKED levers only (master dials, accrual, gating cadence, producer/cost curves), **lengthening / interleaving** the grind to clear the floor (never retuning the floor itself), with all magnitudes taken from §4 (reference, never invented). *(§4.0/§4.1/§4.2/§4.7/§4.8/§4.9 (the LOCKED balance model + levers index), FU18)*
3. **Promote pacing + PERF into hard verify gates (UNDERSHOOT / breach-only)** — Done when the harness assertions run inside `npm run verify` and FAIL the build **only** on undershoot — any **grind** rung clearing in <~28 min (the R0 cold-open story rung exempt, §4.8.1) or a tier completing under its hour floor — **never** on overshoot, and it passes green because the balance pass already clears the floor; **AND the PERF budgets from task 1 are likewise wired as a build-failing gate** (D-Q-perf/Q15+Q56): **save-envelope ≤ ~64 KB**, **event-log node-count ≤ the `LOG_RING_MAX` ring cap**, **bounded tick-loop allocation**, and a **long-run memory ceiling** — failing the build on a breach (like the pacing/fun gates). *(§4.8.4 (the floor invariants + undershoot-only gate), §6.6.1/§6.9 (perf budgets), §6.1 (the verify gate), §6.10, D-Q-perf)*
4. **Promote the fun-proxies from report-only to a GATING check (the fun-risk mitigation)** — Done when the M1/M3a fun-proxies move from report-only into `npm run verify` as a GATE (Q4/FU9) — failing the build on undershoot of the fun floor (excess dead-time, a stalled reward/unlock cadence, a missing visible-next-goal, a weak first-5-min hook, a deed-cadence slower than the tier-relative target [T0~5/T1~8/T2~13 min, Q20], or a win-rate band outside its R3/V2/V5/G1/G5 envelope [§4.6.6]) — the thresholds owned by `fun-factor.md`, mirroring the pacing gate and catching the §7.4.1-R6 fun risk. *(Q4, FU9, Q20, §4.6.6, §6.1, §6.10, fun-factor.md, docs/living/qa-playtesting.md)*
5. **Content-verifier + generated-docs green on EVERY V2 canon invariant** — Done when `src/scripts/verify-content.ts` asserts ALL §6.6/§6.6.1 machine checks — no belief-creature in any spawn/population table; trade ≤⅓ with the cross-pillar combos proven POST-clamp, gate-excluded and ⅓-unbreachable; ≤1 residual-ambiguity token; the HYBRID good/great/excellent gate with NO overflow evaluated only against the REVEALED pillars (gate-distribution + gate-monotonicity); bounded per-skill perk magnitude (each perk small, NOT `==0`, no global cap) with conditioning `==0`; rung-meter monotonicity + the accrual (≈70/30, jumps+seasonal-only, up-only) tie-out; the `world.ts` (Q55) id-resolution; the real-name denylist; macron + K/M/B lints; no orphan ids — and `src/scripts/gen-docs.ts` regenerates docs/content/ + docs/balance/ with `gen:docs --check` passing — both wired into verify. *(§6.6, §6.6.1, §6.5, §6.1)*
6. **Ship the T3 castle-town / Daikan's-Office STUB cliff-hanger (Q24)** — Done when reaching the G7 capstone renders the §3.7.1 first-contact screen (the castle-town / Daikan's-Office node — the old Porter / Kaidō-guild framing dropped, Q24) with the diegetic 'the page turns onto stone walls, and the story pauses' reveal, then STOPS cleanly — with a verifier/test assertion that NO T3 ladder, auto-producers, or marriage/adoption lever is reachable, **AND a player-facing "v1 complete" terminal closure surface is reachable with a defined post-gate clock/accrual policy** (the active loop CONTINUES for free-play/cleanup; the tier is HELD at T2-complete; no empty T3 committed; no clock stall) — asserted as a **positive terminal-state test, not only the no-T3 negative test** (D-Q-B11). *(§3.7.1 (T3 forward stub), §6.8.3 (terminal/closure), §6.9 (renderer/reveal), §6.6 (no half-built-system assertion), §5 (G7 beat), Q24, D-Q-B11)*
7. **a11y acceptance pass (§6.11 basics, wired so they cannot rot)** — Done when the low-cost a11y items are live AND verified: functional/hint text on `--ink-soft` (WCAG AA on every paper surface), `--ink-faint` decorative-only, darkened meter fills (Q48); full keyboard operability + comfortable touch targets; textScale (with a large-textScale reflow case), colourblindMode (colour never the sole cue — icon/text labels too), reducedMotion (+ prefers-reduced-motion), a user pause, the event log as an ARIA live region scoped to narration+milestone ('polite'), a persistent quiet a11y entry point from minute one, and a mute toggle — verified by a keyboard-only AND a touch-only run of the cold open + one rung AND of a force-loaded late state (via `window.__qa`) exercising the combat panel (stance/ability/item/retreat), the four-bar Influence panel, a focus-trapped modal, and the map screen, PLUS a screen-reader acceptance pass — so operability is proven on the dense revealed UI, not only the single-column open. *(§6.11 (accessibility), §6.9 (not-hover-dependent renderer / pause), Q18, Q48)*
8. **Inline-SVG / audio register + presentation polish + the capture-game-states audit (verify-green checkpoint)** — Done when the inline-SVG load-bearing motifs (pillar/season/rarity marks, identical across OSes; emoji cosmetic-only — Q38), the colour-coded rarities, the single shared K/M/B display formatter, and the small curated audio set (synthesized Web Audio + original/CC0 samples, all behind mute — Q50) are applied across screens for a launchable feel; `__qa` is driven headlessly to the signature states (cold-open <5 s, R3 humbling fight, R7 two-bar Influence panel, V4 first Office bar, G6 personal payoff, G7→T3 Daikan stub) on desktop and a narrow viewport, lossless screenshots are saved under audit/, any findings recorded, and full `npm run verify` (incl. the M6 pacing + fun + perf gates) is green. *(§6.9 (art register, K/M/B formatter, audio), §6.1.1 (bundled assets), §6.10 (__qa), §5 (act beats), the capture-game-states skill)*

### M7 — Deploy: self-hosted fonts + LICENSE + About/Credits + itch content descriptors + the deferred cross-origin-iframe save test → live

**Goal:** ship the static build to **itch.io** as **free / pay-what-you-want** — with the V2 deploy adds:
**self-hosted OFL fonts**, a **LICENSE** file, the in-product **About/Credits** surface, the declared **itch
content descriptors**, and the **deferred multi-backend cross-origin-iframe save-survival** test (the one M0 save
item held back).

**Lands:** `build:itch` (= `vite build` → `dist/` → zip **the *contents* of** dist/, so `index.html` sits at the
archive root, §6.1) with the **relative base** (`base: './'`) for itch's served subpath and a **single static
HTML bundle** (no backend, §6.1/§7.3); the **self-hosted OFL fonts** bundled (Google dynamic-subsetting killed —
it breaks offline + the itch relative-base; the **OFL license** bundled, the **Reserved-Font-Name** rule honoured
— Q52) so there are **zero font network calls**; the **inline-SVG motifs + the small synth/CC0 audio set** bundled
into the static build (§6.1.1/§7.3.1); the **LICENSE** file — **permissive code** (MIT/Apache-2.0) **+ reserved
game content** (all-rights-reserved or CC-BY-NC) — added before release (Q51); the **About/Credits** surface
(authorship + the **commit-SHA build stamp** + font/audio attributions + a clean-room attestation + license /
content-descriptor pointers — Q54, §7.3.2); the declared **itch content descriptors** (mild thematic:
child-disappearance, drowning, debt — Q53); the **deferred itch cross-origin-iframe save-SURVIVAL test** on
**Chromium AND WebKit** (the **multi-backend redundant save** — IndexedDB + localStorage + sessionStorage —
survives the embed's storage partition/eviction; the only save piece held back from M0, FU1/Q37) + the **base64
export/import** round-trip; an **offline smoke test** asserting **ZERO network calls**; final polish.

**Definition of done:** the zipped `dist/` runs from itch.io's static host with the correct relative base;
loading the live URL reaches the cold open and the first verb works; the **multi-backend autosave** (IndexedDB +
localStorage + sessionStorage) + base64 export/import work against the deployed origin AND **survive the
cross-origin-iframe partition on Chromium AND WebKit** (FU1/Q37); fonts / audio / SVG load with **NO network
calls** (self-hosted); the **About/Credits** surface shows authorship + the commit-SHA stamp + attributions; the
**LICENSE** file is present; the **itch content descriptors** are set; **no backend, no network calls**; the
release artifact was cut from a **verify-green** commit (incl. the M6 pacing + fun + perf + invariant gates).

**Phases / high-level tasks:**

1. **Pin the relative base path + strip the DEV surface** — Done when `vite.config.ts` sets `base: './'` and a production `vite build` emits a single static HTML bundle with hashed JS/CSS that resolves from a served subpath, containing NO `__qa`/dev helpers (DEV-only code dead-code-eliminated via `import.meta.env.DEV`). *(§6.1, §6.10, §7.3)*
2. **Self-host the OFL fonts + bundle the inline-SVG motifs + the synth/CC0 audio set (zero network)** — Done when the SIL OFL fonts are self-hosted (Google dynamic-subsetting removed, the OFL license bundled, the Reserved-Font-Name rule honoured — Q52), the inline-SVG load-bearing motifs and the small synthesized-Web-Audio + original/CC0 audio set are bundled into dist/ (§6.1.1/§7.3.1), and the offline smoke confirms ZERO font/asset network calls. *(Q52, Q38, Q50, §6.1.1, §7.3.1)*
3. **Add the LICENSE file + the About/Credits surface + the itch content descriptors** — Done when a LICENSE file lands before release (permissive code MIT/Apache-2.0 + reserved game content ARR or CC-BY-NC — Q51), the About/Credits surface (content/surfaces.ts) carries authorship + the commit-SHA build stamp + font/audio attributions + a clean-room attestation + license / content-descriptor pointers (Q54), and the itch content descriptors (child-disappearance, drowning, debt — Q53) are written into the deploy checklist. *(Q51, Q54, Q53, §7.3.2, §6.5, §2.21)*
4. **Add the `build:itch` script (build → zip contents) + wire the verify release gate as the cut-rule** — Done when `npm run build:itch` runs `vite build` then zips the *contents* of dist/ (index.html at the archive root) into an upload-ready artifact stamped with the source commit SHA / version, and a local release flow refuses to cut a zip unless `npm run verify` is green (tsc --noEmit + eslint + prettier --check + vitest run + verify-content + gen:docs --check, PLUS the M6 §4.8 pacing regression + the fun-proxy gate + the perf gate) and the working tree is clean — so a release artifact is only ever cut from a verify-green commit (no hosted CI; local pre-push/release gate). *(§6.1, §7.3, §4.8, §6.6)*
5. **Smoke-test the built artifact offline (itch-subpath + no-network + the deferred cross-origin-iframe save-survival)** — Done when the unzipped dist/ served from a subpath (mimicking itch via `vite preview` / a static server, and embedded in a cross-origin iframe) passes on Chromium AND WebKit: load < 5 s to first interactable, the first verb (rake rice) works, the multi-backend autosave persists across reload AND survives the iframe's storage partition/eviction (FU1/Q37), base64 export → clear store → import yields identical state, and there are ZERO network calls and no `__qa` surface present. *(§7.3, §7.3.1, §6.8, §6.9, §3.1, FU1, Q37)*
6. **Prepare the itch.io page + upload the zip as a draft (human-gated)** — Done when the itch.io project is configured as a draft with the smoke-passed zip uploaded — Kind = HTML, "played in the browser" ticked, a sensible responsive viewport frame, pricing free / pay-what-you-want, AND the declared content descriptors set (Q53) — with the agent supplying the page copy + step-by-step upload runbook and the human performing the create/upload (outward-facing, approval-gated). *(§7.3, §7.3.2, canon §H)*
7. **Fresh-browser smoke of the live draft, then publish (human-gated)** — Done when the live draft URL passes the fresh-browser smoke (load < 5 s to first interactable, first verb works, the multi-backend autosave persists across reload, export → clear store → import round-trips identical, the About/Credits + commit-SHA stamp is present, no backend / no network calls) and the game is then published free/PWYW — the milestone's go-live beat. *(§7.3, §6.8)*

---

## §7.3 Deployment & assets

**No backend. Fully static.** Per §6.1 / canon §H: `vite build` emits a static `dist/` (a **single HTML
bundle** + hashed JS/CSS + the **bundled asset set**, §7.3.1), zipped (contents-at-root) and uploaded to
**itch.io**.

- **Static itch.io build.** `npm run build:itch` = `vite build` + zip **the *contents* of** `dist/` (so
  `index.html` sits at the **archive root**, never nested under a `dist/` folder — itch.io requires `index.html`
  at the zip root or the embed shows a blank frame). itch.io serves the unzipped bundle from a project subpath,
  so Vite's **`base`** must be a **relative base** (`base: './'`) so asset URLs resolve under itch's served path —
  the single most common static-host break, pinned in `vite.config.ts`. The DEV play API and any dev-only helpers
  are stripped via `import.meta.env.DEV` (dead-code-eliminated), so the shipped bundle carries **no** `__qa`
  surface.
- **The multi-backend save path.** Persistence is the **multi-backend redundant atomic save** — IndexedDB +
  localStorage + sessionStorage, written to all available backends per autosave; the **app-identity magic field**
  (reject-to-recovery on mismatch); the **monotonic save-counter newest-wins selector** (the timestamp is only
  the tiebreaker — a documented core-lint exemption); the **additive backwards-compatible schema** + ordered
  migrations + raw backup — **plus base64 export/import** as the portable backstop (§6.8). Because itch.io serves
  the game inside a **cross-origin iframe** with no server, the redundant multi-backend write is the defence
  against the embed's storage partition/eviction, and the base64 export is the player's own safety net — its
  **cross-origin-iframe survival is tested at M7** on Chromium AND WebKit (the one M0 save item held back;
  FU1/Q37). Import validates + migrates (versioned, ordered, pre-migration raw backup; a corrupt save degrades
  gracefully, never a "save is kill" wall).
- **The `npm run verify` release gate.** The **same** one-command gate that guards every commit (§6.1) is the
  release gate: `tsc --noEmit && eslint . && prettier --check . && vitest run && verify-content &&
  gen:docs --check` — i.e. **typecheck + unit tests + the content-verifier (incl. the K/M/B + macron + the V2
  canon-invariant machine checks) + lints**, **plus the §4.8 headless pacing regression, the fun-proxy gate, AND
  the build-failing perf gate added at M6**. A release artifact is **only ever cut from a verify-green commit**; `verify` is run **locally** as
  the pre-push / release gate (**no hosted CI, no deploy automation** — confirmed by the human 2026-06-25).
- **How to ship to itch.io (brief).** (1) `npm run verify` green; (2) `npm run build:itch` → a zipped `dist/`
  (contents at root); (3) on itch.io, create / edit the project, set **Kind = HTML**, upload the zip, tick
  **"This file will be played in the browser,"** set the viewport (a sensible default frame; the layout is
  responsive per §6.9), set pricing to **free / pay-what-you-want** (canon §H), **and declare the content
  descriptors** (§7.3.2); (4) run the deploy-checklist gates — **fonts self-hosted** (no Google / no network),
  the **About/Credits + commit-SHA stamp** present, the **LICENSE** file exists, and the **multi-backend
  save-survival smoke** green on Chromium + WebKit; (5) save as a draft, open the draft URL, run the
  **fresh-browser smoke test** (load < 5 s to first interactable; rake rice; reload → autosave persists; export →
  clear store → import → identical); (6) publish.

> **Out of scope for v1 deployment:** any server, account system, cloud save, analytics backend, or network call.
> The game is wholly client-side and **offline-capable after first load** (active-only; no offline *progress*, but
> it runs with no network — **fonts / audio / SVG are all self-hosted**, §7.3.1).

### §7.3.1 Assets (the acknowledged small set)

This **corrects the old "no asset pipeline" claim** (§6.1.1): v1 ships **one small, curated, fully-bundled asset
set** — no CDN, no network.

- **Self-hosted OFL fonts.** The period-evoking display + body fonts are **SIL OFL**, **self-hosted** (Google
  dynamic-subsetting removed — it breaks offline play + the itch relative-base), with the **OFL license bundled**
  and the **Reserved-Font-Name** rule honoured (Q52). The M7 offline smoke confirms **zero font network calls**.
- **Inline-SVG load-bearing motifs.** The **pillar / season / rarity** marks (and the other load-bearing period
  motifs) are **inline SVG** so they render **identically across OSes**; **emoji are cosmetic-only**, never
  load-bearing (Q38).
- **A small curated audio set.** Light ambient beds + UI/event SFX as a mix of **synthesized Web Audio** +
  **original / CC0 samples** — the one acknowledged curated audio set — all behind the **mute** toggle (Q50).
- **Build stamp.** The build injects the **commit-SHA / version** stamp into the About/Credits surface (§7.3.2)
  so any shipped zip is traceable to the commit it was cut from.

All of it is bundled into `dist/`; the M7 offline smoke asserts **zero network calls**.

### §7.3.2 About/Credits, licensing & content rating

- **About/Credits surface.** A small in-product **About/Credits** screen (content/surfaces.ts, §6.5 / §2.21)
  carrying **authorship**, the **commit-SHA build stamp**, **font/audio attributions** (the OFL fonts + the CC0
  samples), a **clean-room attestation**, and pointers to the license + content descriptors (Q54).
- **Licensing.** A **LICENSE** file is added **before release** (M7): **permissive code** (MIT / Apache-2.0) **+
  reserved game content** (all-rights-reserved or CC-BY-NC) — the split is surfaced in About/Credits (Q51). The
  bundled **OFL** license covers the fonts (§7.3.1).
- **Content rating (itch descriptors).** The itch.io page declares the **content descriptors** for the game's
  **mild thematic** content — **child-disappearance, drowning, debt** — as a deploy-checklist step (Q53). (No
  graphic violence, no sexual content; the register stays restrained.)
- **World registry.** The world-sim content lives in a **`content/world.ts`** data-as-code registry (Q55),
  id-resolved by the content verifier at M6 — the single source for the world-facing content that About/Credits +
  the descriptors describe.

---

## §7.4 Risk register + scope-risk posture

### §7.4.1 Top risks

| # | Risk | Likelihood / impact | Mitigation (+ the milestone/gate that catches it) |
|---|---|---|---|
| **R1 — Scope creep on T2** (the widest, warmest tier: region map + Origin faction + two payoffs + Kuzuhara + rivals) blows the timeline | **High / High** | Hold the **~6–8-node** cut-set and the **hard caps** (exactly 2 neighbouring valleys; 2–3-man detail; ~5 mobs) as *invariants*, not suggestions; build T2 **rung-by-rung** (M5a/M5b) so progress is always verify-green; park anything not on the §1.7.1 spine list. **v1 ships full T0–T2 — no pre-planned descope (§7.4.2)**; if genuinely blocked, the forward-migratable multi-backend save (§6.8) lets a later update add tiers. **Caught at:** M5a/M5b (rung-by-rung, verify-green). |
| **R2 — Balance-tuning time to the FLOOR** (lengthening the grind to **at least** the 4.5/8/16-h minimums + the ≥30-min floor + ≈70/30 split across 24 rungs) is open-ended | **High / Medium** | The §4.8 curve is a **minimum-grind model** derived to be **AT LEAST** the floor, so M6 tunes *yields* to clear a fixed target — **lengthening / interleaving** the grind, never chasing a fixed total nor retuning the floor; the **headless pacing regression** makes **undershoot** (too fast / under budget) a `verify`-gate failure while **overshoot never fails** (§4.8.4) — tuning is measured, not vibes; every number lives in `balance.ts` (§6.4) and reflows with **no save migration**. **Caught at:** M6 (undershoot-only pacing gate). |
| **R3 — Save migration / save-loss** (a stored-shape change orphans saves; the itch iframe partitions storage) | **Medium / High** | Store **only non-derivable state** (§6.4) so the migratable surface is minimal; the **multi-backend redundant write** (IndexedDB + localStorage + sessionStorage) + the **magic-field reject-to-recovery** + the **monotonic-counter + timestamp newest-wins** selector + the **additive backwards-compatible schema** (never remove/repurpose) + **ordered, unit-tested migrations** + a **pre-migration raw backup** + **base64 export**; degrade gracefully on a bad save. The stored/computed split means balance retunes **never** migrate. **Caught at:** M0 (built complete) + M7 (cross-origin-iframe survival test, Chromium + WebKit). |
| **R4 — Art / feel** (inline SVG + emoji + CSS + a small audio set + self-hosted fonts must read as a *coherent woodblock world*, not a spreadsheet) | **Medium / Medium** | The register is a **small curated asset set** — inline-SVG load-bearing motifs + a synth/CC0 audio set + self-hosted OFL fonts (§7.3.1), **low-risk** (no heavy asset pipeline); a dedicated **M6 polish pass** + a **`capture-game-states` audit** sweep catch feel regressions; the diegetic event log carries most of the "feel," so feel scales with *writing* (a known quantity) more than with art production. **Caught at:** M6 (polish pass + audit sweep). |
| **R5 — The combat slice is the densest stretch** and could stall the whole roadmap | **Medium / Medium** | **M2a / M2b are fixed milestones** split up front at the R3→R4 seam (M2a = auto-resolve + first fight; M2b = bestiary/gear), so the combat slice is two shippable, verify-green checkpoints by design; the deterministic seeded auto-battler is **unit-testable in isolation** (§6.7) before it's wired to the UI; the first-fight win-rate band (20–35% at adequate satiety) and soft-setback shape are **LOCKED**, so the target is fixed. **Caught at:** M2a / M2b (the fixed split). |
| **R6 — Fun** (the LOCKED grind ships *balanced* but reads as a *slog* — Q4) | **Medium / High** | The **fun-proxies** are instrumented **report-only at M1/M3a** and **promoted to a GATING check at M6** (Q4/FU9: dead-time, reward/unlock cadence, always-a-visible-next-goal, the first-5-min hook, the tier-relative deed-cadence [T0~5/T1~8/T2~13 min, Q20], and the win-rate bands [§4.6.6]) — **failing on undershoot of the fun floor**; FU18's *interleave-don't-brick-wall* + the **tab-open auto-resolve / auto-repeat** "leave it running, check the progress" loop (FU23) keep the long grind palatable. **Caught at:** M6 (fun-proxy gate). |
| **R7 — Perf / memory** (long active sessions + a large multi-backend save) | **Medium / Medium** | **Interim budgets are set after M0/M1 profiling** and then promoted to a **build-failing M6 perf GATE** — like the pacing/fun gates (D-Q-perf/Q15 + Q56): **save-envelope ≤ ~64 KB** (§6.6.1), **event-log node-count ≤ the `LOG_RING_MAX` ring cap** (§6.9), **bounded tick-loop allocation** (no per-tick garbage growth), and a **long-run memory ceiling** over an hours-long unattended run — the build **FAILS on a breach** (no longer just deferred intent). The pure-core / **derived-not-stored** split (§6.4) keeps the stored save minimal (weather/lunar re-derived, not persisted). **Caught at:** M0/M1 profiling (set budgets) → **M6 (build-failing perf gate)** + M7 fresh-browser smoke. |
| **R8 — Bounded per-skill perks + the combat reveal-ladder spread** (per-skill perks have **no hard global cap**; the combat surface spreads across M2a→M5) | **Medium / Medium** | The per-skill perks carry **accepted** balance risk (FU8: no global cap, each small-magnitude) bounded by **holistic** scaling (gear / level / attrs / enemy-scaling grow together) — mitigated by the **§6.6.1 per-perk-magnitude verifier bound** (each perk *small*, **conditioning == 0**); the incremental combat reveal stays **one-per-beat** (no UI-dump) via the **FU12 design-staggered** schedule (§7.2.0) spread across M2a→M5. **Caught at:** M6 (verifier perk-magnitude bound) + M2a→M5 (the one-per-beat schedule). |
| **R9 — Mobile / touch scope** (v1 is desktop-first; some players will try it on a phone) | **Low / Low** | v1 is **DESKTOP-FIRST**: mobile = **best-effort responsive, NOT a v1 target** (Block N.1 #2). Touch targets meet the **a11y minimum** (§6.11) but there is **no dedicated mobile layout and no mobile leave-and-return** story — consistent with **multi-tab being unsupported** (§6.8). A dedicated mobile pass is **post-v1**. **Caught at:** M6 (a11y acceptance — touch-target minimums); otherwise not a v1 gate. |

### §7.4.2 Scope-risk posture — no pre-planned descope

**v1 = full T0–T2, non-negotiable.** The human chose **not** to pre-plan a reduced-scope cut (no "minimum
shippable T0–T1" fallback, no cut-down ladder) — we build to the full T0–T2 target and ship it complete (plus the
§3.7.1 T3 stub cliff-hanger). We do **not** design a T0–T1 fallback.

> **Holding scope:** every milestone stays **verify-green, deterministic, and a complete playable arc to its
> frontier**, and we hold the §7.1 cut-set + hard caps as *invariants* (this is how we protect the FLOOR — by
> trimming *breadth within a tier*, never by dropping a tier, and never by undershooting the grind). If a
> milestone is **genuinely blocked**, the forward-migratable multi-backend save (§6.8) plus **no reset** means a
> later update can add tiers without orphaning anyone — but that is a recovery path, not a plan: **v1 ships
> complete T0–T2.**

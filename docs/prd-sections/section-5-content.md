# §5 — Act-by-Act Narrative & Content

> **DRAFT — awaiting human review.** Nothing here is locked until walked through with the human and recorded
> as an ADR. This section is authored end-to-end from the **LOCKED CANON**
> ([`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md), both
> 2026-06-25 update blocks) and the **LOCKED §1** of the PRD ([`../prd.md`](../prd.md)), with content quarried
> from the three discovery docs: world-expansion-factions, estate-and-combat, and grounded-story-spine **(the
> last is SUPERSEDED as a spine — only its grounded lost-child truth, its amnesia cause, and its folklore
> belief→cause table survive; its act structure, its diegetic reset, and its NPCs Ren/Kiku/Genza/Zenroku are
> NOT canon)**.
>
> **Tier numbering is canon (T0–T4).** The brainstorm docs predate the renumber and call the upper tiers
> T3/T4/T5; everywhere below they are **T2 Region / T3 Castle-town / T4 Edo.** **Names are canon:** the grown
> lost child is **Otsuru** (never "Oharu"); the origin father is **Jinpachi** (never "Kuranosuke"); the
> protagonist's true name is **Tahei** (never "Ren"). **Romanization = macrons (proper Hepburn) project-wide.**
>
> **What this section is and is not.** It is the act-by-act *story and content* per tier — main-quest beats, the
> per-tier antagonist arc, the growing estate roster/buildings, key NPC/dialogue beats, the areas & grounded mob
> roster, and the open-ended per-tier side-quest list (incl. inn-rumour folklore). It is **not** the mechanics
> catalog (§2), the unlock ladder (§3), the balance model (§4 — **all NUMBERS live there**; here we give
> *shapes*, not values), the tech/data model (§6), or the roadmap (§7). **v1 = T0–T2 in full; T3 stub; T4
> roadmap** (canon §I).
>
> **Binding constraints honoured throughout** (canon §A–§J): grounded / no-magic (every omen resolves to a
> human/natural cause); mediocre-start (no hidden edge; memory = access, not power; porter's-knot & dream =
> ZERO mechanical bonus); the MC's-OWN-actions core loop (combat / skills / jobs / crafting) with **no
> people-management sim** (build/recruit = flavour); **one antagonist per tier**, revealed incrementally; the
> rigged-measuring-box motif is a **light optional** through-line, **never attached to T0**; combat is
> first-class & introduced **EARLY (T0)** & earns standing (Arms pillar); **≤1** residual ambiguity, off-screen
> dark beats; **no reset of any kind**; partial justice (reachable culprits answer; the powerful escape) via a
> *gimin*-martyr *osso*; LEAN — split immediate vs a parked "later".

## How to read this section

Each tier (T0–T4) is a self-contained chapter with the same skeleton, so a writer or implementer can open any
one tier and find every authored beat for it in one place:

1. **Tier overview** — theme, the transition gate it climbs toward, the felt arc.
2. **Main-quest beats** — the spine beats that carry the player to the transition gate.
3. **The antagonist arc** — the one per-tier antagonist, revealed incrementally.
4. **Estate roster & buildings growing** — who/what joins the estate at this tier (cross-ref §1.5.1 / §1.8).
5. **Key NPC & dialogue beats** — village, origin family (incl. father Jinpachi), rivals, household.
6. **Areas & mob roster** — the grounded walkable nodes and the honestly-mundane bestiary (cross-ref §1.7).
7. **Open-ended side-quests** — incl. inn-rumour folklore that unlocks organically (each optional; none gate
   the spine).

Two **threads** are tracked across every tier and resolve together at **T2**: the **lost-child / Tama**
allegiance and the **origin / family** memory thread (the dream cadence). They are tagged **[THREAD: Tama]**
and **[THREAD: Origin]** wherever they surface so a reader can trace each from its early foreshadow to its T2
payoff. The optional racket motif is tagged **[MOTIF: rigged box]**.

---

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
5. **Kuzuhara — the knot (recognised regional retainer). [THREAD: Origin] + spine.** With memory + conditioning
   + standing, the MC reaches the **broken embankment (*seki*)** of the drowned upstream hamlet — the disaster
   that nearly killed Tahei and the house's own **root-sin** (Sadamune's neglected works, atoned for here). A
   multi-stage **river-works** project secures the valley; resettlement re-founds the hamlet; **the drowned are
   named** (grief-work + a temple register, not a rite). The backstory and lost-child evidence resolve here.
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
- **Ohana** (a sweetheart half-remembered, ~17) — optional, gentle, **narrative-only** relationship thread the
  dream surfaces (no dating-sim).
- **Otsuru** (the real Tama, alive & grown in the post-town) — mystery payoff & living proof; **costly &
  incomplete** reunion (she may not forgive). *(Near-rhymes with Ohana in the same post-town — keep voices/roles
  distinct so they don't blur.)* **[FLAG-HUMAN]**

**Region rivals & the road (cross-ref §1.8):** **Hanzaki** (the talent-gone-rotten mirror; the rare dangerous
combat beat); **Tomita** (Sōzaemon / Kageyuki / Yasubei); **Akagi** (Gennai).

**Kuzuhara cast:** a **Kuzuhara survivor** connected to the resettlement and the cover-up *(authored as a NEW
invented NPC if used — the superseded spine's "Kiku/Genza" are NOT canon and must not be revived as existing;
keep new omens within the folklore budget)* **[FLAG-HUMAN]**; **Carpenter Risuke** as the river-works lead;
Dowager **Toku**'s flood-venture memory makes Kuzuhara the house **atoning for its own root-sin.**

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
- **The origin reunions.** **[THREAD: Origin]** Jinpachi, Oyuki, Okimi, Denbei, Kanta, Ohana — each a discrete
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
3. **Otsuru / Ohana name-proximity.** Both live in the post-town and near-rhyme; canon notes this. Authored with
   distinct roles/voices, but flagging in case the human wants one renamed for clarity at the authenticity pass.
4. **The Kuzuhara survivor NPC.** The superseded spine's co-investigator ("Kiku") and the "tengu" witness
   ("Genza") are **NOT canon** (the verifier flagged reviving superseded names as existing). If a Kuzuhara
   survivor / co-investigator is wanted at T2, it must be authored as a **new, named, invented** NPC within the
   folklore budget — flagging the slot for a human naming decision rather than inventing a colliding name here.
5. **T3/T4 are forward-authored only.** Per canon v1 scope (T3 stub = the Porter-Guild first-contact; T4
   roadmap). Confirm the chosen T3 stub node and that the parked/cut lists (E3–E5 depth; Matagi / Pilgrimage /
   Scholars-network) match the human's intent before any post-v1 build.

# Estate faction + Combat redesign — *Kamikakushi* (raw discovery capture)

> **Status:** raw discovery capture; **archival**; **NOT yet canon.** Output of a 6-facet workflow
> (parallel facets → synthesized canonical → adversarial constraint verification, verdict **DOES NOT
> PASS as canon-ready — fixable, not fatal**). This redesigns the Kurosawa-estate faction (§1.5) and
> elevates COMBAT to a first-class core pillar, per the human's instruction set (combat-as-core,
> longer interleaved ladder, growing estate, earlier canvas, RPG combat content, an origin Father).
>
> **Feeds:** the **PRD §1** integration (the §1.5 estate rewrite + a new **§1.6** combat treatment)
> and downstream **§2** (systems: combat, construction, recruitment), **§4** (combat balance), and
> **§5** (content). Graduates to `docs/` only after the human approves the integration **and** the
> superseding ADRs below are written. See the verifier's verdict in §9 for what must change first.

> ⚠️ **Direction-changing reversal inside.** This reverses the still-live locked clause "combat is the
> rare exception, **never a source of standing**" (old §1.2 Pillar-4). That reversal is authorized by
> the human but is **not canon** until logged as a superseding ADR (**D-007**, with a companion
> rank-count ADR and a Denbei/Kuranosuke amendment) — see §9.

---

## 0. Estate summary (the spine, in one breath)

The Kurosawa estate is redesigned as a **single persistent, visibly-mutating object** — the spine's
progress bar made of timber, fields, and faces — built across **six growth stages** (E0 → E5). It
remains the **only** faction shaped as a discrete, gated rank **ladder** (vs. the village's
reputation web and the origin's memory milestones), but the ladder is lengthened to **15 interleaved
rungs** (R0 Stray → R14 chief steward) that **braid LABOUR and COMBAT as twin paths up**. The estate
as a *place* grows **two fabrics in lockstep** — an economic one (kura → granary → workshops →
counting-house → meibutsu quarter → branch holdings) and a martial one (rusty door-bar → cleared
drill yard → palisade + men-at-arms → roofed dojo + barracks → wall + gatehouse + armoury + standing
patrol → retainer barracks + training-school) — *because a goshi house earns Influence by rice AND
by martial service*. Combat and economy are **systemically fused**: securing roads / clearing
bandits is literally what lets the next economic node be built. The roster (~5–8 named members per
stage) is the **emotional payload** — the rise felt as a growing FAMILY of faces. Growth is a
**buildable spend-loop** (koku / coin / materials / labour, sometimes a martial prerequisite like
"roads cleared") wired to the universal reveal/Influence bus — every build a diegetic "the frame is
raised," never silent menu inflation, and **fractal** (a drill yard reveals one post, then a rack,
then sparring slots). The estate flatly **disbelieves the kamikakushi legend** (to them he is a
reliable hand who became a fighting one); it persists with **NO reset** — E5 is the endgame tableau.

---

## 1. Combat as a core pillar

**COMBAT IS NOW A FIRST-CLASS PILLAR ALONGSIDE LABOUR — both/and, not the rare exception.** It uses
the locked **data-driven, auto-resolving, seeded-RNG** combat model already specced in the mechanics
doc (per-combatant `attack_speed` sub-tick, hit-vs-evasion, damage-minus-defence with a floor,
on-kill XP + loot + bestiary + quest events) — **no new architecture, only distributed reveals.**

### The five classic-RPG combat systems (all present and central)

| # | System | What it is |
|---|--------|-----------|
| 1 | **Character combat level** | A **Combat Deeds** pool (combat-XP + a deed-count of kills / clears / defended-against) that levels the protagonist as a fighter, parallel to the existing per-skill `total_xp` pools. Same steep curve + per-event cap (~0.1 of a level/kill) so breadth and grind are forced, never a quick spike. |
| 2 | **Combat skills** | Weapon-skill lines (**spear/yari, staff/bo, hatchet/nata**, later **sword/kodachi, bow/yumi**) plus martial sub-skills (**footwork, conditioning, parry**) under the existing Skills "Combat/Weapon" categories, each with milestone perks (flat stats, multipliers, titles). Skills surface by doing, exactly like labour skills. |
| 3 | **Mobs to grind** | A grounded bestiary across the existing danger gradient (near satoyama → foothills/charcoal grounds → upstream Kuzuhara → high pass), spawned by weighted tables on entering an area or a danger event firing. (See §5.) |
| 4 | **Loot + equipment, FIND and CRAFT** | Enemies and nodes drop materials, coin, occasional **found gear**; equipment slots **with durability** (weapon, body/dou, head, hands, foot/waraji, charm) filled by **FINDING** (a dropped nata, a fallen ronin's worn kodachi, a boar-hide vest) **AND by CRAFTING** through the component chain (wood→charcoal→**Smith Gonta's forge**→spearheads/blades/tools; hides→tanner→armour; quality = crafter skill + component quality + station tier). Disassembly returns materials. |
| 5 | **Gear progression** | From a borrowed carrying-pole and a crude hatchet → a fitted yari, padded jacket, and a smith-forged blade — each tier a **measurable** step. |

### How combat EARNS House Influence (the seventh conversion lever)

This is the clause that **deliberately revises old §1.2 Pillar-4's "combat is the rare exception,
never a source of standing"** (human-authorized; must be re-locked as **D-007** — see §9). A samurai
house values **martial service**: clearing a bandit nest, securing a valley road, defending the
grain store or the estate gate, repelling a raid — **each is recorded martial service that converts
to House Influence when the relevant authority acknowledges it** ("the road is safe, and the books
say so"), exactly like reclaimed paddy converting to Influence on a recorded yield. Combat Deeds feed
**BOTH** promotions on the combat rungs **AND** the macro Influence ledger as a **seventh conversion
lever (martial security)** — sitting beside shinden / cash-crops / river-works / etc.

### The mediocre-start contract, preserved on the combat track (binding, D-003)

He starts **WEAK at combat too** — zero combat stats, no hidden edge, no body that "remembers."

- **The humbling first fight** is a near-fatal **set-piece staged between R4 and R5**: he grabs a
  carrying-pole or hatchet, lands **one lucky blow**, is thrashed, disarmed, ribs cracked, left in
  the dirt — surviving only **by luck or Jubei's arrival, NEVER by skill.**
- Combat capacity is then **EARNED**: gated behind **labour-built conditioning** ("the spear is just
  a long hoe held with intent" — R4 entry requires R2-level Estate Service first) and trained through
  **Jubei's drills** ("Talent is a story the lucky tell. You are not lucky. So you will work.").
- The porter's-knot and returning memory grant **ZERO combat bonus.** The talent-foils (**Hanzaki,
  Naoyuki**) are trained / lucky / ruthless, never innately gifted past what work could match.
- Combat thus rises believably from weakness — the **same montage-you-earn** as labour.

---

## 2. The interleaved rank ladder (15 rungs)

Twin earned currencies drive it: **Estate Service XP** gates the big labour promotions; **Combat
Deeds** gates the martial ones; smaller responsibility/perk drips fill *between* gates. Labour and
combat rungs **alternate**, so the player always has a "next reveal" on either track.

| Rank | Track | How earned | Unlocks |
|------|-------|------------|---------|
| **R0 — Stray / "another mouth"** | labour | Found half-drowned and taken in; survive convalescence and the first labour. (Met at the open.) | The **kura** storehouse (one room, one verb); the body/rest bar and rice counter; the bare diegetic estate dashboard. |
| **R1 — Day-labourer / hiyatoi** | labour | Chief Steward **Genemon** ("another mouth, soft and clumsy") assigns the first real work; complete it, earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the koku heartbeat); the basic labour loop and first producers. |
| **R2 — Bonded hand / genin** | labour | Sustained, reliable labour across a season; Genemon grants a place on the household's books. (Estate Service XP gate.) | Foraging, woodcutting, hauling; the stables & woodlot edge; the porter's-knot beat surfaces; the **Skills tab** reveals. |
| **R3 — Trusted hand & houseman** | mixed | Win **Lady Chiyo's** regard for indoor work and heir **Naoyuki's** grudging vouching; complete authored trust beats (return a lost ledger, defend the grain store). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); errands beyond the estate — **the VILLAGE TIER opens here**, and the first regional ESCORT/ERRAND **dispatches** (Reach begins leading rank). |
| **R4 — Yard-hand under arms / buke-hokonin** | **combat (entry)** | Conditioning floor (R2-level Estate Service: "the spear is just a long hoe held with intent") + **SURVIVE the humbling, near-fatal first fight**, then beg Jubei for drills. The deliberately-incompetent **FLOOR** of the combat ladder. | The drill yard; the **Combat panel** + idle-combat/training; first crude weapon + **Equipment & Inventory** panels; the **Bestiary**. Combat stats start at near-zero. |
| **R5 — Foreman of works / kogashira** | labour→management | Demonstrate command of a labour-gang and a managed sub-economy; the first **shinden** reclamation begun. (Estate Service XP gate.) | The workshops and granary; a labour-gang to assign (**Sota, Mago**, seconded hands as idle producers); the first managed sub-economy; +1 helper slot; the assignment/management panel. |
| **R6 — Gate-guard / monban** | combat | Stand a real watch and survive pest/animal clears; weapon-skill milestones reached. (Combat Deeds gate; conditioning floor at R5.) | Estate-defence duties; the near-satoyama hunting grounds; **PEST-CONTROL/HUNT/CLEAR** quest types; loot + craft (**Smith Gonta** spearheads via the component chain); **the FIRST combat-earned standing.** |
| **R7 — Bailiff of the home fields / jito-dai** | labour→management | The first reclamation recorded and the house edging toward solvency; the lord begins to notice. (Estate Service XP gate.) | Field administration; **HOUSE INFLUENCE made visible and tracked**; cash-crop and proto-industry levers come online. |
| **R8 — Patrol-leader / kachi-gashira** | **combat (leadership)** | Lead a 2-3 man patrol clearing bandits and securing the valley roads; an authored "the road declared safe" trust beat. (Combat Deeds gate; conditioning floor at R7.) | **THE REGIONAL CANVAS OPENS HERE** (mid-climb, decoupled from the capstone): the tier-expansion road map, a fighting detail to assign, **ESCORT/CLEAR/BOUNTY/PATROL** quest types, road-security duties; **combat now VISIBLY earns House Influence.** |
| **R9 — Steward's deputy / yonin-hojo** | management | Help clerk **Tanomo** restructure the strangling debt; Genemon comes to rely on him; **Lord Munenori's** explicit recognition. (Estate Service XP + trust beat.) | The lord's study and the ledgers; the estate's whole books; +X% Influence per season; debt-restructuring lever. |
| **R10 — Expedition leader / sakite-gashira** | combat (leadership) | Lead armed expeditions into the high mountains and deep region (the lethal pass, **Hanzaki's** territory). (Combat Deeds gate; regional Reach.) | The high mountains & deep region; expedition logistics/supply for armed parties; **RAID/HUNT/clear-a-region** quest types; expedition combat earns **REGIONAL** standing; green recruit **Tokujiro** arrives (teach-from-zero seed). |
| **R11 — Master of the storehouse & arms / kura-bugyo-kaku** | mixed (management) | Thresholds in **BOTH** Estate Service and Combat Deeds + a trust beat; run the granary AND the armoury as one logistics base. | Unified granary+armoury logistics; scaled equipment crafting/upkeep; the **men-at-arms ROSTER** on wages and equipment as a managed system; the house's whole material backbone. |
| **R12 — Captain of retainers / monogashira** | combat (leadership) | Command the house's growing men-at-arms in **DEFENCE OF THE ESTATE** — the raid/siege-defence set-piece. (Combat Deeds gate + trust beat.) | The men-at-arms corps; the **siege-defence set-piece**; the martial-leadership capstone-but-one; martial service that lifts House Influence at the **DOMAIN's** notice. |
| **R13 — House overseer / sodoshiyori-kaku** | management/leadership | Thresholds in **BOTH** tracks + a trust beat; oversee the labour economy and the martial corps together; succession is openly discussed. | Unified oversight of economy + corps; all sub-economies and defences report to him; the estate operates as one coherent machine. |
| **R14 — Chief steward / the lord's right hand / yonin** | leadership (capstone) | The top a non-born man can reach by merit — sustained service in **BOTH** tracks, solvency secured, a merit-elevation; **Genemon names him deputy and successor.** (Trust-beat capstone.) | **Authority to PROJECT the house outward** (direct expansion, plant holdings, negotiate, commit Influence); named deputy/successor. **CONFIRMS** (does not first-open) the higher macro tiers — Influence has gated those in parallel since R7/R8. **Finishing the ladder RESETS NOTHING.** |

> **Fold candidates (if §4 balance trims to ~13):** R11 (storehouse & arms) → R9, and R13 (house
> overseer) → R14. See §9.

---

## 3. The growing estate (six stages)

| Stage | What it looks like | New members & buildings | Tier / Influence |
|-------|--------------------|--------------------------|------------------|
| **E0 — Foreclosure's Edge** | A leaning gate, a sagging cracked kura, fallow paddies, a household drowning in inherited debt. The only "defence" is a rusty bar on the kura door. The estate looks like it is **dying.** | Household + old **Jubei** (lone drillmaster) + bottom-rung peers **Sota & Mago** and staff (**Oai, Kyusuke, Ranpo**). *Econ:* the cracked kura. *Martial:* a rusty door-bar. | T1 (Estate), Influence band 0; rank floor R0–R2. |
| **E1 — Stabilising** | The kura patched and re-roofed, the first shinden plot reclaimed, the drill yard cleared (one post), a night-watch lantern lit at the gate, a ledger no longer only red. | Green recruit **Tokujiro** (the mirror later taught); a first day-labour gang. *Econ:* repaired kura + first reclaimed shinden. *Martial:* cleared drill yard (one post) + gate night-watch. | T1, low Influence band; rank floor R3–R4. |
| **E2 — Recovering** | A proper granary raised, two workshops (textile + charcoal/smith-adjacent), a repaired forecourt and a real (if low) palisade fence, 2-3 men-at-arms on a rota, a managed woodlot — the valley starts calling it "the Kurosawa works." | First paid outsiders: men-at-arms **Gohei & Yataro** (ex-ashigaru hired off the road), maidservant expansion under Oai, a carpenter-apprentice (via village **Carpenter Risuke**), a charcoal artisan. *Econ:* granary + 2 workshops + managed woodlot. *Martial:* 2-3 men-at-arms on rota + low palisade. | T2 (Village); rank floor R5–R6. |
| **E3 — Prosperous** | A counting-house, guest quarters for visiting brokers, a finished **roofed dojo** replacing the open yard, a barracks for a small standing squad, a sake/sericulture sub-economy, the mon flying on village contracts, a branch woodlot/charcoal holding up-valley. | A seconded village artisan team (**Weaver Onatsu's** apprentices), a patrol-leader NPC and the player's 2-3 man patrol detail (**Heisuke** in the field), a sake-brewer partnership (**Tokuemon's** stake), a counting-house clerk under Tanomo, kitchen + guest staff. *Econ:* counting-house + sake/silk sub-economy + first branch holding. *Martial:* roofed dojo + barracks + small standing squad. | T2→T3 (early regional reach); rank floor R6–R8 (estate fabric runs **ahead** of rank). |
| **E4 — Fortified Seat** | The palisade becomes a proper **wall + gatehouse**, an armoury and a watchtower, a standing patrol securing the roads (combat-earned Influence made physical), branch holdings in a cluster of valleys — a minor fortified manor that garrisons men it pays. | A standing squad of named men-at-arms (a kumigashira/patrol-corporal + 2-3 named soldiers), origin-recruited porters/guards (**Kanta** + guild mates), branch-holding stewards; the origin **Father Kuranosuke** joins late here as a trade/logistics contributor. *Econ:* multi-valley branch holdings + meibutsu groundwork. *Martial:* wall+gatehouse + armoury + watchtower + standing road-patrol. | T3→T4 (Domain/Castle-Town); rank floor R10–R12. |
| **E5 — Restored-and-Surpassed** | A rebuilt grand omoya beyond the three-generations-ago original, a famous-meibutsu workshop quarter, a school/training-hall where the protagonist now **TEACHES**, formal retainer barracks, the restored-and-surpassed house seal — the epilogue tableau. | The protagonist's **OWN students** (Tokujiro now teaches under him; famine-orphan recruits "started from zero"), a master artisan for the meibutsu product, **Kuranosuke** fully integrated as caravan/route master. *Econ:* famous-product quarter surpassing the original + onward (Osaka/Edo) supply chains. *Martial:* formal retainer barracks + the training-school. | T4→T5 (Edo, indirect ceiling); rank floor R13–R14. |

> **§1.8 framing to apply at integration (human directive):**
> 1. **Organize the cast PER TIER** (not per stage-only) when this graduates to the story bible.
> 2. **Make BUILDING and RECRUITING player-driven gameplay systems** (spend-loops wired to the
>    reveal/Influence bus), not narration-only beats.
> 3. **Keep the VILLAGE cast static** — it is the reputation web, not a recruitable roster; estate
>    growth pulls *seconded* / *recruited* faces, but the village's own cast does not balloon.

---

## 4. Earlier canvas / rank ↔ tier decoupling

**The canvas opens earlier by DECOUPLING three loosely-coupled progress axes** advancing at
different rates. **Rule of thumb the whole game obeys: REACH leads, RANK follows, INFLUENCE trails.**

1. **HOUSEHOLD RANK** — your title/authority *inside* the Kurosawa house (the 15-rung interleaved
   ladder). Gates what you may **COMMAND** (helpers, sub-economies, the books, retainers, the
   men-at-arms corps). The **sole** gate on the estate's own systems.
2. **REACH** — a **new explicit axis** = "where you may travel and what you may do out there on the
   house's behalf," expressed as a small **ordered set of discrete travel-PERMITS/commissions**:
   *Estate grounds → Valley/Village → Near satoyama → Region roads & post-town → Domain seat →
   Edo-by-attendance.* Granted as **authored DISPATCH beats** — a named NPC (Genemon, Jubei,
   Heisuke, later Naoyuki) hands you a writ, a manifest, or a marching order — gated by a **LOW
   conditioning floor + a sponsor's leave + a story flag, explicitly NOT by high rank.** The
   sekisho-checkpoint authenticity is preserved (your travel-permit IS the Reach unlock). **Fiction:**
   a mediocre nobody is sent out **FIRST** precisely because he is junior and dispatchable — he
   ranges the region as the house's **HANDS, not its master.**
3. **HOUSE INFLUENCE / TIER** — the macro standing of the **HOUSE**; still the **sole** gate on when
   each macro canvas (village→region→domain→Edo) becomes a real *owned* economic/holdings layer.
   Unchanged from locked §1.6; never resets.

**Concrete decoupling.** The first regional **ESCORT/ERRAND** dispatches fire around **R3–R4**
(mid-climb): (a) **ESCORT/PORTER** — accompany Heisuke hauling surplus to the post-town, fight off a
road-side boar or rice-thief, see the region but make no decisions; (b) **ERRAND** — carry a sealed
letter to the next valley's headman; (c) **EXPEDITION MEMBER** — the junior spear under Jubei
clearing a boar-warren or bandit lean-to; (d) **BOUNTY-TAG-ALONG** under a senior; (e) **RELIEF-RUN**
— haul relief-rice to a flood-hit hamlet (peaceful, regional ground at R3). Real wilderness/region
combat opens by **R4–R6**. The **full regional adventuring canvas** (own quest-board, assign a
detail) opens at **R8 Patrol-leader** — roughly the **middle** of the ladder. From R8 onward he
adventures regionally while still climbing R9–R14 back home.

**Capstone reframed.** R14 grants **AUTHORITY** over the region (plant a branch holding, negotiate,
command an expedition rather than march in one, commit Influence) — **NOT first ACCESS.** "Finishing
the ladder opens the next canvas" survives *in spirit* — it opens the canvas as a thing you now
**RUN.** Personal-rank and influence-tier become two parallel bars that cross-feed but neither
hard-gates the other above R8 (a patrol-secured road is **both** a combat deed **and** recorded
Influence). Macro tiers tick over on **Influence bands, not personal rank**; personal rank tops out
at R14 while Influence keeps climbing to the indirect Edo ceiling.

---

## 5. Mobs bestiary

> **Verifier flag (see §9):** the `T1–T4` locale labels conflate the danger-gradient **conditioning
> rings** (§1.7: wilderness is shared, gated by conditioning) with the Influence-tier authority
> canvas (§1.6). At integration relabel these as **"danger rings,"** not Influence tiers. Belief
> creatures (kappa, fox-fire fox/tanuki, yamanba/tengu, the "one-eyed mountain god") must be pulled
> **out of grindable spawn tables** and kept as INVESTIGATE-then-confront one-shot beats.

| Enemy | Type | Locale (danger ring) | Note |
|-------|------|----------------------|------|
| **Wild boar (inoshishi)** | animal | Home paddies / near satoyama (T1) | First real grindable threat after the humbling fight; tramples/gorges crops. Drops boar hide (armour craft) + meat. The classic "something is in the lower field" pest-control intro. |
| **Crop-raiding monkeys (saru) troop** | animal | Field-edge / near satoyama (T1) | Pack nuisance, fast and evasive; thieve rice and produce. Low danger, high annoyance — teaches multi-target combat and evasion. |
| **Rice-rats & field serpents (mamushi)** | pest/wildlife | Granary / paddies (T1) | Store pests + a venomous snake (status-damage poison). Cheap early grind; **mamushi gall** is a craft/medicine drop. |
| **Giant hornets (suzumebachi) nest** | insect | Woodlot edge / satoyama (T1-2) | Swarm/AoE threat near foraging and charcoal work; a CLEAR-the-nest beat. Tests conditioning (status: stings) early. |
| **Leeches & the "kappa ford" river creatures** | river wildlife | The river, ford & weir (T1-2) | Leeches drain on fishing; the "kappa" of the ford is an undertow + a snapping turtle/large catfish — folklore resolves to grounded cause. Ties combat to the fishing/river economy. |
| **Wolves (okami) pack** | animal | Foothills & charcoal grounds (T2) | Coordinated pack — first fight that punishes a lone, under-geared player; drives the need for a detail or better gear. HUNT/escort threat. |
| **Rogue bear (kuma)** | animal | Foothills / charcoal-burners' camp (T2) | A named HUNT quarry; high HP, high damage; bear hide + gall are valuable craft/bounty loot. The "track and take" archetype. |
| **Wild dogs / feral pack & poachers' snares** | animal/hazard | Woodlot & foothills (T2) | Ambient threat on patrol; pairs with the poacher bounty (the dogs are the poacher's, the snares are evidence). |
| **Foxes & tanuki ("fox-fire" / rice-thief)** | wildlife | The ridge / foothills (T2) | De-fanged folklore mobs — fox-fire is a hidden charcoal-kiln smugglers' signal, the rice-thieving tanuki is just a tanuki. Low-threat, lore-bearing; the helpful fox is flatly explicable (honours the ≤1 ambiguity cap and belief→cause rule). |
| **Bandits / starving deserters (nobushi)** | human | Valley roads / bandit lean-to (T2) | First HUMAN threat and the road-security core; mixed motives (organised toll-takers vs desperate deserters) make CLEAR/CAPTURE choices matter. Drop worn weapons (FOUND gear) + coin; clearing them earns recorded Influence. |
| **Poachers thinning the woodlot deer** | human | Estate woodlot edge (T2) | BOUNTY archetype; the deer they hunt are also a peaceful HUNT node, fusing combat and economy. Some poachers are reachable consciences, not pure villains. |
| **Rice-thieves & smugglers' muscle** | human | Region roads / post-town outskirts (T2-3) | Tied to the short-weighting/contraband racket (**Zenroku→Kuroiwa**); fighting them feeds both standing AND the conspiracy evidence thread. |
| **Masterless ronin / road toughs** | human | Region roads & post-town (T3) | Better-trained than bandits — drop the first decent FOUND blades (a worn kodachi, a fitted yari). Escort/duel fodder; the talent-foil's lesser kin (made, not born). |
| **Rival-house Tomita toughs** | human | Region / contested holdings (T3-4) | Hired muscle of the inter-house rival; harassment of branch holdings and trade routes. Status-competitor's enforcers — beaten and out-maneuvered, the rival himself is never killed. |
| **Corrupt official's muscle / the daikan's enforcers** | human | Domain roads / castle-town (T4) | The dangerous edge of the cover-up's protectors; raids on the estate's interests. The **Tedai Kuroiwa** thread is defeated by EVIDENCE not violence, but his muscle is a real combat threat. |
| **Mountain raiders / brigand roost** | human | High mountains & the pass (T3-4) | The EXPEDITION/RAID target — an organised band to break with a led armed party; the regional-standing payoff and the approach to Hanzaki's territory. |
| **Hanzaki, the scarred ronin ("one-eyed mountain god")** | human (named nemesis) | The fog-blind pass / lookout (T3-4) | The recurring DUEL nemesis and talent-gone-rotten mirror — edge is TRAINED and brutal, never innate; survived by labour-built endurance, never out-talented. Early encounters are meant to be survived, not won; his worn gear is a late FOUND prize. |
| **Yamanba / tengu of the high cedars (rumoured)** | wildlife/human (misread) | High woods & cedars (T3-4) | Rumours-board folklore that resolves to grounded cause — a hermit, a charcoal-recluse, eagles/large raptors, or wind in the cedars. INVESTIGATE-then-confront with humans/animals, never a monster (folklore rule). |
| **The raiding party on the estate** | human | The estate itself (T4) | The SIEGE/RAID-DEFENCE set-piece mob — the test of the men-at-arms corps and the estate's martial fabric; outcome can dent or lift Influence and cost or spare a holding. *(Verifier: the "cost a holding" wording violates "never a wipe" — see §9.)* |

---

## 6. Combat quest types

All are **open-ended** by design: the player is given an *aim and a rough where*, not a waypoint
chain — the content is what is discovered on site / on the road.

| Type | Example | Open-ended note |
|------|---------|-----------------|
| **PEST CONTROL** (clear nuisance animals/insects threatening crops/stores) | The home paddies are trampled/gorged by a boar; clear the field-edge and its warren before the rice is lost. | Given as "something is in the lower field at night" — the player reads the churned mud and broken fence, finds whether it is one boar or a sounder, and where it dens; not a waypoint to a marked boar. |
| **HUNT** (track and take a specific/valuable quarry across the satoyama) | A rogue bear raids the charcoal-burners' camp up the foothills; track it by sign and take it, returning hide and gall (loot + craft + bounty). | The suggestion is "bring back the bear"; the trail, the second carcass it left, and whether it is sick or merely hungry are found in the world. |
| **CLEAR** (drive out/destroy a fixed nest of threats) | Bandits built a lean-to over the valley's main road and levy their own "toll"; clear the nest and pull down the lean-to. | You are told the road is unsafe and roughly where; the band's size, whether they are starving deserters or organised, and the back-trail are discovered on site — and how you handle them (rout, kill, capture) has consequences. |
| **DEFEND** (hold a place/asset against an incoming threat — **the standing-earning core**) | Word comes raiders mean to hit the granary before the rice census; muster the gate-watch and defend the grain store — success is recorded service, converts to Influence. | You learn an attack is coming, not the hour or numbers; preparation (who you arm, where you post the watch, what you barricade) is yours; the fight resolves on what you built. |
| **ESCORT / PORTER-GUARD** (move goods/people through dangerous ground) | Accompany Heisuke hauling the season's surplus down-valley to the post-town market — fight off a road-side boar or lone rice-thief, see the region as muscle, not master. | Destination is set; the **road** is the content (a feared ford, a fox-fire ridge, a toll-spot) and what happens emerges as you travel, not a scripted A→B→C. |
| **PATROL** (range a circuit keeping ground secure — idle/repeatable) | As patrol-leader, run the valley-road circuit with your 2-3 man detail; repeated patrols suppress bandit respawn, keep the road's Influence ticking, surface the occasional ambush. | A **standing duty**, not a quest with an end — the player sets the circuit; encounters are seeded, and a quiet road is itself the reward (visible security). |
| **BOUNTY** (take a named, posted target — poacher, smuggler, deserter, enforcer) | The house posts a bounty on poachers thinning its woodlot deer; tag along under a senior first, later lead it — bring proof, collect coin and recognition. | A name and a rough haunt; you find the man by his sign and his neighbours' fear, and whether he is a hardened killer or a desperate father is something the world tells you. |
| **DUEL** (a single, framed fight — honour, rivalry, recurring nemesis) | Hanzaki, the scarred ronin of the pass, blocks the high route; a one-on-one against a trained, brutal foe survived only by labour-built endurance, never out-talented. | You know who and roughly where; the approach (when, how rested, what gear, whether you can avoid it once) is open, and early attempts are meant to be survived more than won. |
| **EXPEDITION / RAID** (lead an armed party deep into hostile region/mountain) | Lead an armed expedition into the high pass to break the bandit roost in Hanzaki's territory — logistics, supply, a multi-stage push that earns regional standing. | The objective is the roost; the route, rate of march, what you carry, and which fights you pick are yours, and the mountain (weather, fog-blind pass) is an adversary. |
| **SIEGE / RAID DEFENCE** (the set-piece — hold the estate itself) | As Captain of retainers, command the men-at-arms in defence of the estate against a raiding party — a martial capstone-but-one that lifts House Influence at the domain's notice. | You know a strike is coming and roughly when; the whole preparation (walls manned, gate held, where the reserve sits) is the open-ended layer; the outcome can dent or lift Influence. *(Verifier: drop/rewrite the "cost a holding" wording — see §9.)* |
| **RELIEF / RESCUE under threat** (a peaceful-aim quest that turns dangerous) | Haul relief-rice to a flood-hit hamlet up the road; the road is cut and you must fight or talk past desperate, displaced men to get the rice through. | The aim (get the rice there) is given; whether the obstacle is bandits, a washout, or starving refugees is found on the road, and **force is not always the answer.** |
| **INVESTIGATE-then-confront** (folklore/mystery that resolves to a human threat) | The "one-eyed mountain god" and "fox-fire" on the ridge — investigated through ordinary travel — turn out to be Hanzaki's lookout and a hidden charcoal-kiln smugglers' signal; the confrontation is with men, never a monster. | A rumour from the inn board is the only prompt; you go and find out, and the unease lingers before it resolves one-to-one to a grounded cause (honours the belief→cause folklore rule). |

---

## 7. The origin Father — Kuranosuke (蔵之介)

| Field | Detail |
|-------|--------|
| **Name** | **Kuranosuke (蔵之介)** |
| **Role** | Tahei's father, ~50; a former **senior porter / pack-train master of Master Denbei's transport house in Sawatari-juku** — the man who **FIRST taught Tahei the porter's-knot** (Denbei the employer, Kuranosuke the hand who actually showed him). **Presumed dead** at the origin track's open (Oyuki framed as a widow); revealed mid-origin to be **ALIVE but broken** — injured years earlier on the same kind of mountain consignment that later took Tahei, then trapped in **debt-bondage to the transport guild (Guildmaster Zenroku)** over a "lost" short-weighted load he was blamed for, hiding in shame. The family told the children he was "taken on a far route" — their own small **kamikakushi-shaped lie**, shame dressed as absence, mirroring the master theme. |
| **Function** | **Three grounded functions, all access-only and grind-built (ZERO mechanical gift — binds the dream/no-hidden-edge rule):** **(1) Memory-gated origin milestone** — a "find/free the father" beat requiring the player to have **ranged the region** (ties Reach/regional adventuring to faction-3); his freedom is **BOUGHT with resources the player earned** (buy out the debt / win the petition), never magically granted by the son's rank. **(2) Evidence node for the central conspiracy** — Kuranosuke witnessed the same short-weighting/contraband racket (**Zenroku → Tedai Kuroiwa**), so freeing him reunites the family AND hands the conspiracy a **witness** (the **porter / short-weighting angle specifically**, kept distinct from Naozane-type guilt-sick witnesses), knitting the origin into the "one rotten root." **(3) Late ally producer** — once redeemed, he joins the estate's expansion as a **trade/logistics contributor** (unlocks/upgrades the origin caravan/porter route — access only, still grind-built), slotting in as a late **E4/E5** roster card. His redemption is the origin track's emotional capstone — the son's estate achievements literally **buy back the father's freedom and name** (the "they support his achievements" frame run in reverse). Returns **broken and ashamed; redemption is PARTIAL**, not a clean restoration — preserving the bittersweet edge. His reveal **re-reads Oyuki** from grieving widow to a wife who let a comforting lie stand. |

> **Verifier flags (see §9):** Kuranosuke **partially duplicates locked Master Denbei** (§1.8 names
> Denbei as the source of the porter's-knot) — must be flagged as **amending Denbei**, not silent.
> And "alive but broken, debt-bonded" stacks a **third** debt-machine-ate-a-person arc beside Tahei's
> caravan and Oharu's near-sale — lighten the debt-bondage so the beat doesn't read thrice.

---

## 8. How it stays incremental

Five disciplines keep all of this incremental/fractal and never overloading:

1. **The ladder IS the progress bar.** The 15 rungs pace the reveal so **no rung dumps more than
   ~2–3 new affordances.** Steep geometric Estate Service gates space the big labour promotions;
   Combat Deeds gates space the martial ones; smaller responsibility/perk drips fill between. Because
   labour and combat rungs **alternate**, a labour wall is relieved by chasing the next combat rung
   and vice-versa — **doubling the dopamine cadence** vs. a single-track ladder, and the combat
   reveals (Combat panel, Bestiary, Equipment, Inventory, men-at-arms roster, the expansion map at
   R8) are woven **throughout** the climb instead of dumped at one Act-close (smoothing the old "big
   combat dump at Rank 3" spike).
2. **Fractal frontiers.** Every new zone/building/faction arrives **minimal** and itself unlocks: a
   new region is one road, one threat, one contact; a drill yard is one post → a rack → sparring
   slots; a new bestiary tier reveals one mob at a time. The whole-game UI-reveal motion repeats in
   miniature at every frontier (Pillar 7).
3. **Sparse authored Reach, not a fourth grind.** Reach unlocks are a **handful of authored dispatch
   beats** (each a plot event with a log line + reveal + flag through the universal bus), **NOT a
   grindable bar** — so Rank, Reach, Influence read as facets of **one** climb feeding **one** House
   Influence, not three games. **Never all surfaced as three visible meters at once.**
4. **Diegetic, capped builds.** Estate growth is story-framed beats ("the frame is raised"), not a
   build-queue; the number of simultaneously-active build/quest choices is **capped**; the
   minute-to-minute texture stays **labour + combat GRIND** ("the hero getting better at what he
   does"), not estate micromanagement — guarding against the city-builder/4X drift §1.13 warns of.
5. **Light roster cards + reuse.** ~5–8 named members per stage are mostly **light cards** (role +
   one-line hook + a data-driven contribution slotting into existing idle-producer/garrison systems);
   existing cast is reused (village artisans seconded, origin friends recruited) so only a few get
   full arcs — containing cast bloat. Everything stays **pure-core data-driven** (rungs, holdings,
   mobs, quests, permits as registry rows with unlock predicates over GameState), deterministic under
   the one seeded RNG, generated into `docs/` as single source of truth, and **headlessly
   regression-testable** via the DEV play API (force Estate Service + Combat Deeds + Influence + a
   permit, fast-forward, assert each reveal fires at the intended state and that **no rung / build /
   memory grants a hidden stat**).

---

## 9. Decisions to lock + open questions + verifier's verdict

### 9.1 Decisions to lock

| # | Question | Recommendation | Why |
|---|----------|----------------|-----|
| 1 | Reverse the locked "combat is the rare exception, never a source of standing" clause (old §1.2 Pillar-4) — combat is now a core pillar that EARNS House Influence? | **YES** — re-lock as superseding ADR **D-007**: combat is a first-class pillar alongside labour; martial service (clear/secure/defend/repel) converts to Influence via a **seventh conversion lever**, gated behind labour-built conditioning and the humbling first fight; mediocre-start preserved. | Human instruction #1 explicitly authorizes it; it is the load-bearing reframe and directly contradicts a still-live locked pillar, so it must be in the decision log before this is canon. |
| 2 | Final rung count — 15 interleaved, or trim to ~13? | **Lock 15 for now** (in the human's ~12–16 band), with **R11 (storehouse & arms) and R13 (house overseer)** as fold candidates (R11→R9, R13→R14) if §4 balance finds either thin. | 15 gives a real braided climb with both a next-labour and a next-combat goal at every step; flag fold candidates now so the trim is cheap later. |
| 3 | Where does the regional adventuring CANVAS first open relative to rank? | **Lock the three-axis decouple:** first regional ESCORT/ERRAND dispatches at **R3–R4**, real region combat by **R6**, the full regional quest-board/assignable-detail at **R8 Patrol-leader**; the **R14 capstone grants AUTHORITY, not first ACCESS.** | Executes §1.5.4 "canvas opens earlier"; pins the offset (Reach leads rank) so §2/§4/§5 can pace against it. |
| 4 | Two earned currencies (Estate Service XP + Combat Deeds) feeding promotions AND Influence — right model? | **YES** — keep independent grind tracks; labour **conditioning is a ONE-WAY enablement gate** on combat rungs (R4/R6/R8 floors) but grants **ZERO combat stat bonus** (no-hidden-edge); §4 tunes relative gate costs and the alternation. | Two tracks make both labour and combat real paths up; the one-way gate keeps labour mandatory underneath so a combat-only player can't skip the cozy core. |
| 5 | Add the father **Kuranosuke** to the origin faction as designed? | **YES** — lock as part of the origin ADR amendment; witness angle **DISTINCT** (porter/short-weighting), freedom **GRIND-BOUGHT** (access-only), return **broken/ashamed** (partial redemption). | Fills human instruction #6; knits the origin into "one rotten root" without redundancy; honours the dream/no-hidden-edge rule and the bittersweet edge. |
| 6 | Does the estate's physical growth run AHEAD of top personal ranks (E1–E3 buildings mid-climb)? | **YES** — gate buildings on **Influence band + a LOW rank floor + cost** (not the capstone); the "other fabric follows close behind" rule gets concrete pacing in §4. | Makes "the canvas opens earlier" true at estate scale too; rank floors + story flags must be tuned so the estate LEADS without LEAPING the narrative rank gates. |
| 7 | Authenticity of new martial titles (monban, kachi-gashira, sakite-gashira, monogashira, kura-bugyo-kaku) for a modest goshi house? | **Flag for §4/§5 research-harden** alongside the existing yonin-vs-karo top-title note; keep grander terms as **aspirational in-fiction narration** if humbler ashigaru-tier titles prove more defensible. | kachi/monogashira/bugyo are arguably grander than a threadbare lower-samurai house would field; the same discipline already applied to the top rung must apply to the new martial rungs. |

### 9.2 Open questions

- **Final rung count:** lock 15, or trim to ~13 by folding R11→R9 and R13→R14? (~12–16 band; pacing may prefer fewer, fatter rungs.)
- Should the two currencies be **fully independent**, or have a small **ONE-WAY cross-feed** (labour conditioning slightly accelerates combat TRAINING SPEED per "the spear is a long hoe") — with strictly ZERO combat stat bonus? *(Verifier: KILL this — see 9.3.)*
- Is **REACH** a small ordered set of discrete named travel-permits (recommended) or a continuous range number? And exactly how many rungs ahead of rank should Reach run (first regional dispatch at R3 of 15)?
- Where does the **men-at-arms ROSTER** first appear as a managed system — R8 (small detail), R11 (wages/equip, recommended), or R12 (full corps)? Must stay in lockstep with the estate-growth stages.
- How **literal is the estate's spatial representation** per stage — a redrawn estate map/visual each stage, or growth conveyed via panels + roster list + schematic? (Ties to the macro-tier spatiality question.)
- Is the **standing patrol/garrison** a real assignable resource the player tunes (men allocated to road vs gate vs branch holding), or narrative flavour with a derived strength number?
- Can the player permanently **LOSE a holding** (a failed siege costs a branch holding)? *(Verifier: NO — violates "never a wipe"; resolve toward the locked rule — see 9.3.)*
- **Roster depth:** how many of the ~30–40 new members across six stages get real arcs/dialogue vs light cards — and do village-seconded artisans **cost village production** (a real loan) when they join the estate roster?
- Does combat-earned standing on a low-rank dispatch ever **advance REACH itself** ("he came back alive AND useful"), in addition to feeding Estate Service / Influence? (Recommend yes.)
- **Authenticity:** which Edo martial-title set survives the §5 research-harden — keep the grander monogashira/bugyo terms as aspirational narration, or pick humbler ashigaru-tier titles?
- Confirm the **alive-but-ruined father** framing isn't too dark for the warm "they support his achievements" frame, and that re-reading Oyuki from grieving widow to "a wife who let a comforting lie stand" is wanted.
- Does **R14 remain the HARD ceiling** of the personal ladder while House Influence keeps climbing to the indirect Edo ceiling afterward (recommend yes — personal rank tops at R14; macro tiers continue on Influence alone)?

### 9.3 Verifier — verdict, scope assessment, and required fixes

**Verdict (passes = `false`): DOES NOT PASS as canon-ready — fixable, not fatal.** The
combat-as-core reframe, earlier canvas, estate-growth staging, and the father are conceptually sound
and mostly honour the grounded/mediocre-start spine. But the redesign (1) ships content at
**several-times v1 scope** against a locked lean-v1 and an explicit "don't over-build"; (2) leaves
**four locked-rule contradictions live in body text**; and (3) **tilts the back-half rung-count
toward combat**, risking the locked "peaceful labour is the dominant texture" feel. Relevant locked
sources: `docs/prd.md` (§1.2 Pillar 4, §1.4, §1.6, §1.10, §1.13–1.14) and
`docs/history/decisions.md` (D-002, D-003, missing D-007).

**Scope assessment — SEVERELY over-scoped for the project's stated v1 and working style.** Locked
plan (§1.14) recommends an **8-rank ladder** and a v1 of **"Tiers 1–2 complete, Tier 3 stubbed"**;
standing memory is "start lean, add pieces back deliberately; don't over-build." This proposes **15
ranks, 6 estate stages, 30–48 new roster NPCs (atop ~40 existing), 19 mobs across 4 tiers, 12
open-ended quest types, 2 new earned currencies, a 3rd progression axis (Reach), and a 7th Influence
lever** — while §1 is still a DRAFT with no code and the required ADRs unlogged. The design
**thinking** is strong; the design **volume** is years of content in one section.

**Four live constraint violations (must resolve before canon):**
1. **Folklore rule (D-002 / §1.10).** The bestiary mass-produces "misread" folklore mobs (kappa-ford
   creatures, fox-fire fox/tanuki, yamanba/tengu, the one-eyed mountain god) as **grindable spawn
   populations** — a respawn table cannot "linger in unease then resolve one-to-one"; it resolves on
   first kill then farms the corpse (the Scooby-Doo unmasking forbidden). The **≤1 residual-ambiguity
   cap is never re-affirmed.**
2. **"Never a wipe" (§1.6).** The SIEGE/RAID-DEFENCE entry and E4 both say a failed defence "can cost
   a holding," and an open question proposes permanently LOSING a branch holding. Permanently
   destroying an owned recognized holding is a **wipe of accrued Influence.**
3. **No-hidden-edge (D-003 / §1.4).** The open "labour→combat **training-rate** cross-feed" is a
   mechanical combat bonus from a non-combat source — the soft hidden edge D-003 forbids, even with
   "zero combat STAT bonus."
4. **Missing ADR (§1.13/§1.14).** The combat-earns-standing reversal is asserted while §1.2 Pillar 4
   still literally reads "never a source of standing," and **no D-007 exists**; the ladder ships
   **15** ranks against a recommended-locked **8**.

**Recommended v1 cuts (the verifier's "sane v1 subset"):**
- **~8-rung ladder** (locked recommended count) interleaving **exactly TWO combat rungs** — **R4
  yard-hand-under-arms** (humbling-fight floor) and **R6 gate-guard** (first combat-earned standing)
  — inside the labour spine; **defer** patrol-leader / expedition / captain / overseer rungs.
- **Estate stages E0–E2 only** (matches locked "Tiers 1–2 complete").
- **~5 mobs** (boar, monkeys, hornets-nest, wolves-or-bear, bandits/deserters), one per shipped quest type.
- **~4 quest types** — **PEST CONTROL, HUNT, CLEAR, DEFEND** (DEFEND as the standing-earner); defer
  escort/patrol/bounty/duel/expedition/siege/relief/investigate.
- **~5–8 NEW roster members TOTAL for v1**, not per stage.
- The conditioning **GATE** (no cross-feed); the **father as a Tier-3 stub**; **ADRs written first.**

**Other required fixes:** write **D-007** + a rank-count ADR + a Denbei/Kuranosuke amendment **before**
body text asserts the reversal; **re-affirm the ≤1 ambiguity cap** and pull belief-creatures **out of
grindable tables** into INVESTIGATE-then-confront one-shots (grindable mobs = honestly-mundane ones);
**kill the training-rate cross-feed outright**; resolve holding-loss to **dent-not-destroy** (a failed
defence damages/disables a holding **temporarily**, recoverable by rebuild); **demote grand martial
titles to aspirational narration NOW** (default ashigaru/household-tier: monban, kogashira, kachi,
ashigaru-kashira); **collapse the three-axis surface** so only **Rank** and **Influence** are visible
meters and **Reach is authored story-flags, never a meter**; relabel mob locales as **"danger rings,"
not Influence tiers**; **re-balance toward labour-plurality** (target e.g. peaceful-labour ≥60% of
typical play-time), reframing combat as a strong **mid-game-onward second pillar**; and **tone-guard
the father** (lighten the debt-bondage stacking; flag the Denbei retcon; confirm the Oyuki re-read).

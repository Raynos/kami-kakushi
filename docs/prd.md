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
| 1 | Vision, pillars, factions & world | **DRAFT — in review (estate-restoration redesign)** |
| 2 | Systems & mechanics catalog | _not started_ |
| 3 | Incremental unlock ladder (UI-as-progression) | _not started_ |
| 4 | Combat, progression & balance model | _not started_ |
| 5 | Full act-by-act narrative & content | _not started_ |
| 6 | Tech architecture & data model | _not started_ |
| 7 | Milestone roadmap, v1 scope & deployment | _not started_ |

---

# §1 — Vision, Pillars, Factions & World

> **DRAFT — in review (estate-restoration redesign).** This section supersedes the earlier
> lost-child-mystery framing of §1. The spine has changed: the game is now a **perseverance fantasy at
> grand scale** — a nobody and a dying house both rising from nothing. Four direction-changing calls
> here **reverse or amend the previously locked ADRs** and must be re-locked with the human before this
> section is treated as canon (see §1.13–§1.14).

## 1.1 Vision statement

You are a **mediocre young man** (~18–20) — weak, slow, unskilled, and nameless — pulled half-drowned
from a mountain river and taken in, out of plain kindness, by the **Kurosawa**: a proud, threadbare
lower-samurai (*goshi*) house two generations past its grandeur and quietly drowning in debt. You begin
as "another mouth," soft and clumsy, with no place at the table. Through nothing but **daily toil and a
refusal to quit**, you earn your keep, then their trust, then your name on the household roster — and you
**climb, rung by sweat-bought rung**, from taken-in stray to the lord's right hand and the architect of
the house's revival.

As you rise, the world you can reach grows with you: first the **estate**, then the valley **village**,
then the **region**, then the domain's **castle-town**, and finally indirect recognition at the **Edo**
capital itself — until the Kurosawa name stands **restored *and* surpassed** beyond anything it held three
generations ago. The estate-rise *is* the perseverance fantasy at grand scale, and it is the same motion
as the game's **signature feature: the UI itself unlocks as you progress.** Minute one is a single line
of narration, one verb, and a persistent event log; every panel, tab, resource, skill, and area
thereafter fades in one at a time — **each reveal a story beat, never silent menu growth.**

Two grounded side-threads run quietly beneath the climb and pay off only in **feeling, allies, and
flavour — never in power**: a grieving village is certain you are **"Tama,"** their child spirited away
by the kami ten years ago (the estate flatly disbelieves it; to them you are simply a farmhand), and a
**recurring dream** slowly returns the memory of who you truly were and the living family and friends who
will come to back you. Nothing supernatural ever happens; every omen resolves to a human cause; every
climbing number is **earned sweat**.

This is the **dignity of a nobody — and a dying house — becoming someone real, by hand**, and forcing a
forgotten name to be spoken at the capital.

Built as a **pure, deterministic TypeScript core** (one seeded RNG, data as single source of truth) with
a thin DOM renderer, shipped as a static HTML5 build for itch.io.

## 1.2 Design pillars

1. **The estate-rise is the spine — a perseverance fantasy at grand scale.** The single load-bearing
   track is the protagonist's climb up the Kurosawa service hierarchy
   (stray → day-labourer → bonded hand → trusted hand → foreman → bailiff → steward's deputy → chief
   steward / the lord's right hand), fused to the house's outward expansion across **five influence
   tiers** (estate → village → region → domain/castle-town → Edo). Rising through the ranks and
   restoring-then-surpassing the house **are** the main quest; everything else enriches but never
   replaces it.
2. **UI-as-progression — the interface is the reward.** Start with one verb and a story log; reveal each
   panel / tab / resource / skill / area exactly when first earned, and announce every reveal
   **diegetically** through the event log, so feature unlocks read as *plot*, never menu inflation. The
   protagonist's accessible **space** and accessible **systems** literally *are* the progress bar of the
   rank climb; each tier opens a fresh, larger canvas with bigger numbers.
3. **Three factions, three shapes, one web.** The estate (main — a discrete, gated rank **ladder**), the
   village (rich side faction — a continuous multi-node reputation **web**), and the origin (his living
   family/friends in a post-town — a memory-gated **support** track) are deliberately distinct in shape
   and payoff, so they never feel like one bar painted three colours — yet they are coupled by a shared
   economy and the **Tama-vs-farmhand allegiance**, and the side factions feed the spine without ever
   gating it.
4. **Numbers-go-up is a training montage you earn — no hidden edge, ever.** The protagonist starts
   genuinely **weak and slow** (not a bedridden invalid, but unskilled, low-stat, blistered-handed) and
   rises *only* through repetition, rest, technique, and crafted tools. No bloodline, no secret training,
   no body that "remembers" combat. Returning memory and the porter's-knot habit are identity clues that
   confer **ZERO mechanical bonus**. Combat is the rare, dangerous exception, gated behind labour-built
   conditioning — never a source of standing.
5. **Influence is the macro-resource; tiers replace prestige — no reset of any kind.** **House Influence**
   (家威, *ka-i*) is the estate's recognized standing — the single number the whole UI-reveal is gated on
   — accruing only when concrete achievements are recognized by the relevant authority. The long game is a
   pure **tier escalation** (each tier a bigger canvas and an order-of-magnitude bigger number range):
   **there is NO diegetic reset, NO prestige reset; everything persists as the canvas grows.**
6. **Grounded Edo folk-mystery — folklore is light flavour; quests are open-ended, not checklists.** Every
   belief/omen resolves one-to-one to a human/natural cause; a thin, capped, off-screen margin of
   ambiguity is kept for *unease* only, never confirmed magic, never player magic. Folklore arrives as
   optional, light-hearted tidbits via the village inn's **rumours board**. Quests are a **suggestion + a
   story the player goes and finds out in the world**, never an A→B→C waypoint list; the dominant
   minute-to-minute behaviour is the incremental grind — **the hero getting better at what he does.**
7. **Fractal incrementality.** Every new zone, area, and faction is **itself incremental**: you arrive
   minimal, slowly learn its people, places, and systems, and never get overloaded — everything unlocks.
   The whole-game UI-reveal motion repeats in miniature at every new frontier.
8. **Deterministic, testable, generated.** Pure-core boundary (no DOM in logic), one seeded RNG, save only
   non-derivable state, generate balance/content docs from the same data the game runs on, and a DEV-only
   play API so every unlock and pacing beat is headlessly regression-tested.

## 1.3 Premise & tone

> *A mediocre young man wakes injured and nameless in the storehouse of the Kurosawa, a declining
> lower-samurai (goshi) house in a remote mountain valley, having been found half-drowned and pulled from
> the river out of plain kindness. The grieving village below is certain he is Tama, the child "spirited
> away by the kami" ten years ago; the estate flatly disbelieves it. Through nothing but daily toil and a
> refusal to quit, he rises through the estate's service ranks from "another mouth" to the lord's right
> hand and the architect of its revival, hauling the house from near-foreclosure up an outward climb of
> influence — valley, region, castle-town, and finally recognition at Edo — until the Kurosawa name is
> restored and surpassed.*

**Tone:** grounded, warm, bittersweet **Edo folk-mystery** wrapped around a cozy, satisfying
**restoration fantasy**. The dominant texture is peaceful Edo labour (farm, forage, woodcut, fish, craft)
over a *koku*/rice base economy — numbers-go-up as honest sweat — with the steady dignity of a man and a
house both rising from nothing. Beneath the warmth runs a quiet, grim undercurrent: a house bankrupted by
an ancestor's hubris and cover-up, a village grieving a child it nearly sold, official negligence dressed
as fate. The darkest material (a child nearly sold for debt, a drowned hamlet, a covered-up disaster) is
handled with **off-screen restraint** and counter-weighted by found-family warmth (the Kurosawa household,
Sayo, old Jūbei).

The catharsis is **never power** — it is a nobody becoming someone real by his own hands, and lifting a
dying house back into the light. Justice, where the side-mysteries reach it, is **partial**: the reachable
culprits answer, the truly powerful largely escape — and the house's own rise meets a real, honest
**ceiling** the powerful set, which is the same thesis made structural.

## 1.4 The protagonist & the mediocre-start contract

The protagonist is an **authored, fixed male character** (~18–20) — there is **no name/appearance/gender
creator and no player rename**. He is the same person in every playthrough. The village calls him
**"Tama"** (the borrowed legend-name) for most of the game; his true name — **Tahei**, a plain,
period-typical commoner name — returns to him as a **late, de-emphasised memory beat** in the origin
thread (no longer the spine's climax, since identity is explicitly a side thread). The **fixed male gender
is load-bearing**: the village's legend has drifted to "remember" the real lost child as a *boy*, when
Tama was in fact a *girl* — a fair, re-readable clue that only works if the protagonist is fixed-male.

**The refined mediocre-start contract (locked direction, enforced in writing *and* code).** He is **NOT a
bedridden invalid** at the open. He can rest and recover a little in the first hours, but he **starts weak
and slow** — unskilled, low-stat, soft-handed, slower than the boy who shows him the paddy, blistering on
the first hoe. His one genuine asset is **temperament**: stubbornness, a strong back, a patient temper, a
refusal to stop getting up — exactly what the incremental grind rewards. He grows **only** through
perseverance, repetition, rest, technique, and crafted tools. Plateaus are real; the answer to a wall is
never a magic item, only more reps and better tools. Combat capacity is gated entirely behind
labour-built conditioning ("the spear is just a long hoe held with intent"), and the first real fight is
humbling and near-fatal — motivating training.

**No-hidden-edge guardrails (binding):**

- **No hidden edge, ever.** No bloodline, no secret training, no weapon that "answers to him," no body
  that "remembers" combat. The one thing the village treats as special about him — that he is the returned
  Tama — is **false**.
- **The porter's-knot rule.** He sometimes ties a porter's/labourer's load-knot on instinct. This is
  **procedural body-memory** (like still knowing how to walk after amnesia), framed as a labourer's habit
  ("huh, you've hauled before") — a **narrative identity clue only that confers ZERO mechanical bonus.**
- **Growth is grind, not gift.** Every number starts at the bottom; no returning memory or instinctive
  habit ever grants a starting stat, recipe, tool, or combat bonus. What memory grants is **access**, not
  power.
- **The talent-foils are made, not born.** The antagonists (the enforcer Hanzaki, the rival heir Naoyuki,
  the rival house Tomita) must always be shown as **trained, lucky, or ruthless** — never innately gifted
  in a way the protagonist could not match by work — so the effort-over-talent thesis is never undercut.

## 1.5 The three factions

Three parallel standing tracks, each earned diegetically by labour and quests, but **mechanically
distinct so they never feel like one bar painted three colours.** They share an economy and the
Tama-vs-farmhand allegiance, with chosen tensions *and* synergies, and **no faction is ever a dead end.**

### 1.5.1 The estate — the Kurosawa *goshi* household (MAIN, a gated rank ladder)

The **Kurosawa** are a lower-samurai (*goshi*) house holding a modest hill estate in **Asagiri valley** —
proud, threadbare, two generations past their grandeur, working much of their own land, and quietly
drowning in a ruinous debt inherited from a grandfather's failed flood-control venture. This is the
**only** faction structured as a discrete, named, gated **rank ladder** with hard thresholds, because
rising through it *is* the perseverance fantasy and it is the dominant driver of the UI-as-progression
reveal.

Standing is earned by **Estate Service** (a faction-XP pool from completed duties and survived seasons)
**AND** by authored **trust beats** (named story gates), so you can never grind a number to skip the
narrative — rank is where numbers-go-up and story fuse. Each promotion fires through the universal
rewards/unlock bus: a diegetic log line, the next panel/area reveal, a concrete perk, and a story flag.
The household is genuinely populated (a full roster), and it flatly **disbelieves** the *kamikakushi*
legend — to them he is a reliable hand, not a returned spirit. The estate generates House Influence
directly; the capstone is the diegetic **bridge** that opens each next tier.

> **Title note (folded fix).** The top rung is written here as **"chief steward / the lord's right hand."**
> The grander vocabulary — *karō*/*karō-kaku*, "symbolic adoption into the house name" — is kept as
> **in-fiction aspirational narration only**; a modest *goshi* house arguably does not warrant a true
> *karō* (a daimyo-house elder). The accurate top-rung title (a *yōnin*/house-steward "right hand") and
> whether merit-elevation/adoption is a real late-game lever or pure flavour are flagged for the §4/§5
> research-harden (see §1.13).

| Rank | How earned | Unlocks |
|---|---|---|
| **0 — Stray / "another mouth"** | Found half-drowned and taken in; survive convalescence and the first labour. *(Already met at the open.)* | The *kura* storehouse (one room, one verb); the body/rest bar and rice counter. The estate dashboard begins bare and diegetic. |
| **1 — Day-labourer (*hiyatoi*)** | Chief Steward Genemon, who calls him "another mouth, soft and clumsy," assigns the first real work; complete it and earn a sleeping-place. | The gate & forecourt; the home paddies and dry fields (the rice/*koku* heartbeat); the basic labour loop and first producers. |
| **2 — Bonded hand (*genin*)** | Sustained, reliable labour across a season; Genemon grants a place on the household's books. | Foraging, woodcutting, hauling; the stables & woodlot; the porter's-knot beat surfaces. **Skills tab** reveals. |
| **3 — Trusted hand & houseman** | Win Lady Chiyo's regard for indoor work and heir Naoyuki's grudging vouching; complete authored trust beats (defend the grain store, return a lost ledger). | The main-house interior; the household domestic economy (textiles, kitchen, provisioning); **errands beyond the estate (the village unlocks here)**. The **drill yard** opens after the humbling first fight; training/idle-combat under Jūbei. |
| **4 — Foreman of works (*kogashira*)** | Demonstrate command of a labour-gang and a managed sub-economy; the first *shinden* reclamation begun. | The workshops and granary; a labour-gang to assign; the first managed sub-economy; +1 assignable helper slot. The **assignment/management panel** reveals. |
| **5 — Bailiff of the home fields (*jitō-dai*)** | The first reclamation recorded and the house edging toward solvency; the lord begins to notice. | The granary and the estate's field administration; the **House Influence macro-resource becomes visible and tracked**; cash-crop and proto-industry levers come online. |
| **6 — Steward's deputy (*yōnin-hojo*)** | Help clerk Tanomo balance the books and restructure the strangling debt; Genemon comes to rely on him; Lord Munenori's explicit recognition. | The lord's study and the ledgers; the estate's whole books; the **tier-expansion map**; +X% Influence per season. The **village tier** becomes a reachable canvas. |
| **7 — Chief steward / the lord's right hand** | The top a non-born man can plausibly reach by merit — sustained service, solvency secured, and a merit-elevation (the capstone). Genemon names him deputy and eventual successor. | The estate gate to the wider world; authority to project the house's influence outward. **This capstone is the diegetic bridge that opens the higher tiers (region/domain/Edo); finishing the ladder resets NOTHING — it opens the next, larger canvas.** |

### 1.5.2 The village of Asagiri (rich SIDE faction, a reputation web)

A rich side faction with its own problems the player **may choose** to help — a feared ford, a skimming
foreman, debt owed to the estate, and the unhealed grief over the lost child. It is deliberately shaped
**unlike** the estate so the two feel different in the hand: instead of one rank ladder it is a continuous,
**multi-node reputation web**. It is the home of the *kamikakushi* / "are you Tama?" legend, which the
villagers **believe** and the estate does not. Folklore lives here as **light flavour**, delivered through
the **inn's rumours board.** The village's deepest optional side-quest is uncovering what really happened
to the real lost child.

**Crucially, village standing NEVER gates the UI ladder or the tier climb** — a player who ignores the
village is never *blocked* on the spine, only poorer and lonelier. It is a viable-but-poorer playstyle to
skip, never a wall.

Several **continuous meters** rather than one ladder:

- **Per-shop "patron/regular" standing** (the smith, the dry-goods/rice broker, the herbalist's stall, the
  brewer, the weaver) — each unlocks stock, discounts, and exclusives as you trade, and high standing
  **softens the market-saturation price-crash** from flooding a good.
- **Per-family goodwill**, raised by **open-ended help** (you hear a family has trouble and go figure out
  how to help — never a checklist).
- An **artisans'/craft-guild standing** gating recipes, component tiers, and master-craft commissions.
- The **Village Chief's regard** — historically the **shōya/nanushi** headman, **Yagoemon**, drawn from
  the local elite and assisted by the village's self-governing body (*kumigashira*, *hyakushōdai*) under
  *murauke* — a weighted roll-up of the others plus chief-specific quests.

Village reputation unlocks **recipes, crafting tiers, trade** (prices, exclusives, contracts), **allies**
(villagers seconded to the estate as idle producers/co-producers), and **lore** (rumours-board folklore +
clues for the lost-child thread). Curves are **gentle** (linear/soft-cap) for frequent small dopamine
across many nodes, in contrast to the estate's steep geometric rank gates. Yagoemon does honest civic
double-duty: warm quest-giver up front, and the humanly-reachable culprit of the lost-child side-mystery
later (a frightened middle-man who doctored ledgers and let the "cursed" story stand — **never a
monster**).

### 1.5.3 The origin — his living family & friends (memory-gated SUPPORT track)

The protagonist's **original family & friends** — **living** people in a nearby post-town
(**Sawatari-juku**, a day-plus down the *kaidō* road), **not** the local village. His true name is
**Tahei**; his old life was as a young porter/errand-hand for a small transport-and-goods house. This is a
side faction unlocked as his memory returns via the recurring dream, and its defining feature is that it
**supports him for his effort and achievements at the estate** — pride, allies, resources, and trade ties
that plug into the estate's outward expansion.

> **Place-name note (folded fix).** The post-town is the **invented** *Sawatari-juku* on an unnamed
> *kaidō*, restoring the generic-rural guardrail. The earlier facet's real, famous Nakasendō post-town
> was renamed to avoid pinning the otherwise-fictional world (Kurosawa estate, Asagiri valley, Kuzuhara
> hamlet) to an identifiable place. (Confirm the canonical name with the human; see §1.14.)

Structured **differently** from the estate and village: a memory-gated, late-blooming **support track**,
NOT grindable from day one. It stays dark — foreshadowed for hours, so its absence reads as anticipation —
until the recurring dream returns enough memory **AND** the protagonist's estate standing lets him
physically travel the controlled *kaidō* (*sekisho* checkpoints make free travel impossible without
standing). It then opens as a set of per-contact **"restored ties"** — discrete, chunky one-time
milestones (mother **Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart
**Ohana**, the porter-guild), re-engaged in **authored beats** rather than a from-zero grind.

Payoff is deliberately **support, not local power**:

- **Pride/morale** — a modest **global** skill-XP/producer buff framed strictly as a **new present-day
  relationship** ("a man with people behind him works harder"), **never a retroactive gift from
  remembering.**
- **Allies** — old porter/guild mates recruited to the expansion.
- **Trade ties** — origin-town goods, contracts, and ready-made caravan/porter routes that plug into the
  estate's region/domain/Edo expansion.

As the protagonist reaches the region tier, the reconnected contacts and the re-foundable **Kuzuhara**
(his birthplace, an upstream hamlet) become concrete **expansion nodes** (a resettlement labour/producer
base; the post-town as trade partner and information broker; the embankment that killed his caravan as a
Tier-3 river-works Influence project that also resolves his backstory). **Hard guardrail:** returning
memory grants **access only** (new nodes/allies/quests unlock narratively) and **ZERO mechanical bonus**;
every asset must still be grind-built. At least one origin beat is always available **without**
reputation-gating so the thread never fully stalls. The track is **allegiance-neutral** — it is about who
he *really* is (neither Tama nor merely-a-farmhand) — and resolving it softens both leans by giving him a
true self to stand on. Curves use **discrete milestone steps**, distinct from the estate's geometric gates
and the village's gentle per-node meters.

### 1.5.4 How the three interrelate — and the Tama-vs-farmhand allegiance

**Separate currencies** keep them from collapsing into one bar: **Estate Service XP** (steep geometric,
per-duty caps, paces big rank gates), **Village Reputation** (gentle per-node meters), and **Origin Ties**
(discrete memory milestones). Above all three sits **House Influence**, the macro-resource the estate
spends to expand: the estate generates it directly, while village allies and origin trade-ties act as
**multipliers/feeders** — they don't unlock the next tier, they make conquering it faster and cheaper
(tuned so weaving both in roughly **halves** time-to-next-tier — *felt, never a wall*).

**Tensions (chosen, not bugs):**

- High estate rank can hand duties that **extract** from the village (collect the rice quota), raising
  Estate Service but denting Village reputation — with an always-available "soften it quietly" option the
  side-mystery rewards.
- The legend pulls both ways — the village wants "Tama" to be theirs while the estate wants a reliable
  hand, so being beloved in one can make the other wary of split loyalty.
- The origin pulls him down-valley while the estate spine pulls him deeper in.

**Synergies:** village allies become idle producers seconded to estate works; origin trade-ties become the
supply chains that make region/Edo expansion affordable; high estate rank grants the standing and
safe-passage to even reach the origin town and trade with it formally.

**The Tama-vs-farmhand allegiance** is a continuous **leaning** (village-leaning ↔ estate-leaning,
default neutral, re-expressible and never frozen) the player nudges through dialogue and which faction he
invests labour in. Leaning **"I am Tama"** warms the village (faster rep, grief-coded content, Bon rites)
at slight friction with the estate (the estate finds the legend a superstitious distraction — slightly
slower trust beats, **never blocked**). Leaning **"just a farmhand"** smooths estate trust and pragmatic
respect at the cost of village warmth and Tama-only lore.

> **Critical rule:** the choice rebalances **rates and flavour, never availability** — both factions
> remain fully completable on either lean; neither is the "good" path; staying ambivalent is a valid
> in-character stance. The spine is restored-and-surpassed fastest and richest when all three are woven
> together — but it is still completable spine-only, just slower and lonelier.

## 1.6 House Influence (家威) & the five tiers

**House Influence** (家威, *ka-i*) is the single tracked macro-resource and the **one number the entire
UI-reveal is gated on.** It is the estate's **recognized standing** in the eyes of progressively wider
authorities — deliberately **NOT** *koku* and **NOT** coin. *Koku* and coin are the inputs you spend and
grind; Influence is the cumulative, mostly-monotonic score of what the estate has visibly **become.** It
accrues only when a concrete achievement is **recognized** by the relevant authority for the current tier:
reclaiming a paddy adds *koku* immediately, but only converts to Influence when the village/steward/domain
**acknowledges** it (a recorded yield, a granted title, a sealed contract, a won petition). This keeps
Influence diegetic ("the books now show…") and makes it the **gate-currency** — every panel/tab/system/area
unlock carries an Influence (plus flag/skill) predicate, so the macro spine literally paces the UI.

Influence has named **bands** mapping 1:1 to the five tiers; crossing a band is the tier-up moment. It
**never resets** (locked direction: no prestige). It can **stall** at a tier gate you haven't met, and a
small, scripted set of beats can **dent** it (a debt called, a scandal) — small, recoverable, **never a
wipe** — to keep tension.

**The conversion ledger** turns grind into Influence via authentic Edo upward-mobility levers, so
"numbers go up" always reads as a real path a small declining *goshi* house could climb: (1) ***shinden*
land reclamation** (the canonical *goshi*-advancement lever); (2) **cash crops & proto-industry**
(sericulture/silk, sake brewing, textile weaving as village by-employments the estate organizes and takes
a cut of, building toward a famous domain product / *meibutsu*); (3) **river & road works** (fords,
embankments, *kaidō* upkeep — protect yield *and* earn official credit); (4) **debt restructuring** (from a
strangling usurious loan to proper merchant finance / a domain loan — liability into solvency into
creditworthiness); (5) **distinguished service to the domain** (relief-rice in a famine, flood control, a
petition resolved in the house's favour); (6) **patronage & alliance** (strategic marriage and the real
Edo practice of merchant/farmer buy-in via *goyokin* contributions and adoption into samurai rank, plus
patrons who vouch upward); (7) **trade ties** (routes to the post-town, the origin town, and onward to the
inter-*han* / Osaka market). Each lever is a small economic sub-loop (spend → produce → get recognized →
Influence), and which levers are **available** is itself part of the tier reveal.

> **Timescale (folded fix).** The full five-tier climb is paced over a **generational/decadal in-world
> span** for the upper tiers (Tier 3→5), so "restore *and* surpass the three-generations-ago grandeur"
> and the famous-*meibutsu*-at-Edo outcome read as **earned over years**, not compressed into a couple of
> seasons.

| Tier | Theme | Entry gate | Headline beats |
|---|---|---|---|
| **1 — Estate** | Earn your keep and a place at the table. The starting micro-world: one declining hill estate, unlocked room by room as trust rises. | Survive convalescence and the first labour *(already met at the open)*. | Be found half-drowned, taken in, survive convalescence in the *kura* (one room, one verb); become a trusted hand under Genemon; discover the house is quietly insolvent; propose and begin the first *shinden* reclamation (dowager Toku and clerk Tanomo part with why the house fell); survive the humbling, near-fatal first fight and beg old Jūbei for drills (training unlocks). |
| **2 — Village** | The estate as a presence in its own valley. The first expansion frontier: Asagiri's shops, craftsmen, artisans, inn, shrine, and the *kamikakushi* legend. | First reclamation recorded + the house solvent enough to extend credit rather than beg it (and trusted to run errands beyond its gate). | The estate buys village output and contracts craftsmen; reputation builds with Headman Yagoemon and the self-governing body; cash crops/proto-industry come online (sericulture, sake, textiles); a river/ford works project earns official credit; the estate becomes the valley's economic anchor (its *mon* on village contracts; first proper retainers); the optional lost-child mystery and the inn's rumours board open; the Tama-vs-farmhand lean is most legible. |
| **3 — Region** | Reach beyond the home valley. A larger canvas: a cluster of valleys, the down-valley post-town, the upstream Kuzuhara ruins, roads, porters, and *sekisho*. | Village anchored + a tradeable surplus + roads/porters under estate control (and enough standing to travel the controlled roads). | Open trade routes along the *kaidō* (the dream-gated origin faction becomes reachable, its trade ties plug in); **re-found Kuzuhara** as a resettlement node (faction-3 fusion, access-only, grind-built); secure the embankment so the disaster cannot recur (a river-works project that also resolves the backstory); the post-town becomes trade partner and information broker; the estate's name travels. |
| **4 — Domain / Castle-Town** | Be reckoned with by the people who actually rule. The castle-town, domain officials (*daikan*, *tedai*), inter-*han* markets, Osaka rice shipping. | Distinguished **service** rendered to the domain — flood-control, surplus rice in a lean year, or a formal case/petition resolving in the house's favour. | Invited (warily) into domain affairs through the *daikan*→*tedai*→*shōya* chain; restructure the old debt through proper merchant/daimyo finance (the house becomes creditworthy); a strategic marriage/adoption alliance and *goyokin* lift formal standing; the estate's goods reach Osaka and become a renowned domain product. |
| **5 — Edo** | Recognition at the capital — restore **and** surpass the grandeur of three generations ago. Edo, the bakufu status ladder, the realm's markets. | Domain sponsorship + enough standing to be presented (carried via the lord's *sankin-kōtai* attendance). | The house's renowned product is celebrated in Edo's markets via *sankin-kōtai* supply chains; the protagonist's labour materially lifts the **lord's** standing during his Edo attendance, so the **house** gains face; a rare, hard-won merit commendation/appointment is earned by documented service; the restored-and-surpassed house seal and an epilogue tableau. **The ceiling is honoured:** recognition is indirect and mediated — *not* the protagonist personally becoming a *hatamoto* or being received by the shogun. |

## 1.7 The world & areas

The estate-rank climb spatially **embodies** the tier escalation: you start trapped in one storehouse room
and earn the rest of the estate room by room (the rank ladder made of doors), then the village, then the
wilderness (by conditioning), then your own past (by memory), then the region, the castle-town, and finally
Edo. Each tier opens a fresh, larger canvas — **no reset** — so influence is something you can **see**
growing as the world you can reach grows. Every frontier is **itself incremental** (fractal
incrementality): arrive minimal, learn its people and systems, never overload.

| Area | Region (tier) | Factions | Notable locations | Unlocks when |
|---|---|---|---|---|
| **The Kura Storehouse** | Kurosawa Estate & Grounds (T1) | Estate | The convalescence pallet; the spilled rice to rake | At the open (Rank 0, Stray). Home of the UI-reveal engine (body/rest bar, rice counter). |
| **The Gate & Forecourt (*genkan*)** | Kurosawa Estate & Grounds (T1) | Estate | The *genkan*; the visitor's mat | Rank 1 (Day-labourer). The diegetic stage for promotions and the Tama-vs-farmhand framing. |
| **The Main House / *Omoya*** | Kurosawa Estate & Grounds (T1) | Estate | The lord's study (ledgers); kitchen & inner rooms; the household shrine | Rank 3 (houseman); the study at Rank 6 (steward's deputy). |
| **The Home Paddies & Dry Fields** | Kurosawa Estate & Grounds (T1) | Estate | The fallow plots to reclaim; the granary | Rank 1; *shinden* reclamation begins late Tier 1. The rice/*koku* heartbeat. |
| **The Drill Yard** | Kurosawa Estate & Grounds (T1) | Estate | The training posts; Jūbei's weapon rack | Rank 3, after the humbling first fight. Conditioning & idle-combat. |
| **The Stables & Woodlot Edge** | Kurosawa Estate & Grounds (T1) | Estate | The stables; the woodlot edge | Rank 2 (Bonded hand). The porter's-knot beat. *(May fold into the forecourt to avoid early reveal fatigue — see §1.14.)* |
| **The Market / Shop Row** | Village of Asagiri (T2) | Village | Smith Gonta's forge; Obaa Sato's herb stall; Brewer Tokuemon's; Weaver Onatsu's | Tier 2 (estate trusts him to run errands; Rank 3+). Per-shop reputation meters. |
| **The Artisan Workshops** | Village of Asagiri (T2) | Village | Carpenter Risuke's yard; the dyer's vats; the charcoal grounds | Tier 2, via craft-guild standing. Craft chains and apprenticeship side-quests. |
| **The Chief's House** | Village of Asagiri (T2) | Village | Yagoemon's receiving room; the village ledgers | Tier 2, on building the chief's regard. Reputation roll-up + the doctored-ledger thread. |
| **The Inn & Rumours Board** | Village of Asagiri (T2) | Village | The rumours board; the common room | Tier 2. Sukezō's inn — hub for optional, light folklore side-quests. **None gate tier progression.** |
| **The Shrine / Temple** | Village of Asagiri (T2) | Village | The shrine (*shimenawa*); the temple register; the Bon offering site | Tier 2. The soul-calling rite, Priest Ryōa's register of the vanished (a mystery clue). |
| **The Boundary-Stone / Jizō** | Village of Asagiri (T2) | Village / neutral | The boundary *jizō*; the offering left by an unknown hand | Tier 2. Where he was found — the **one** capped residual-ambiguity beat (lingers unresolved). |
| **The Near Satoyama** | Satoyama & Mountains (shared, T1–3) | Shared wilderness | The foraging groves; the bamboo stand | Rank 2 / Tier 1, gated by conditioning. First ring of the danger gradient. |
| **The River, Ford & Weir** | Satoyama & Mountains (shared, T1–3) | Shared wilderness | The ford (the "kappa" spot); the weir where he was found | Tier 1–2, gated by conditioning. Fishing + the "kappa" thread (undertow + smugglers' sinking-spot, recoverable evidence). |
| **The Foothills & Charcoal Grounds** | Satoyama & Mountains (shared, T1–3) | Shared wilderness | The hidden charcoal kiln ("fox-fire"); the hunting trails | Tier 2, deeper conditioning. Second danger ring. |
| **The Forbidden Upstream Ruins of Kuzuhara** | Satoyama & Mountains (shared, T1–3) / Origin overlap | Shared / Origin | The broken embankment (*seki*); the drowned hamlet ruins; the resettlement site | Tier 3 (memory returned + conditioning + standing to range). The geographic knot where the lost-child evidence, his origin, and the cover-up meet; a re-foundable region node. |
| **The High Mountains & The Pass** | Satoyama & Mountains (shared, T1–3) | Shared wilderness | The fog-blind pass; Hanzaki's lookout | Tier 3, top of the conditioning gradient. The lethal terrain where his caravan died; the "one-eyed mountain god"; expeditions/logistics. |
| **Sawatari-juku (the down-valley post-town)** | Origin: Kuzuhara & the Post-Town (T3) | Origin | Master Denbei's goods house; Oyuki's home; the transport guild; Naozane's office | Tier 3 (dream-gated memory + standing to travel the *kaidō*). The faction-3 support hub; where Tahei's living kin/friends and the grown "Tama" (Oharu) sit. |
| **The Wider District / Region** | The Expansion Tiers (T3) | Estate (outward) | The trade-route map; branch holdings; allied villages | Tier 3 (capstone rank reached; village anchored). A logistics/holdings layer — a larger canvas, bigger numbers, no reset. |
| **The Castle-Town / Domain Seat** | The Expansion Tiers (T4) | Estate / Domain officials | The *daikan*'s office; the inter-*han* market; the castle-town townhouse; the petition hall | Tier 4 (distinguished service rendered). Where the estate's standing is contested at the domain level. |
| **Edo** | The Expansion Tiers (T5) | Estate (the capital) | The Edo market where the house's product is celebrated; the presentation set-piece; the epilogue tableau | Tier 5 (domain sponsorship + presentable standing). Indirect, mediated recognition — the honoured ceiling. |

## 1.8 Cast

Grouped by faction and area. Most NPCs do **double duty** — a gatekeeper *and* a story thread in the same
beat — to keep the web legible.

### Estate (main) — the Kurosawa household & retainers

| NPC | Role | Function |
|---|---|---|
| **Lord Kurosawa Munenori** | Head of the house, late 50s; weary, decent, stiff-backed pride papering over shame. | **Apex rank-gatekeeper** — upper-rung promotions need his explicit recognition. His approval *is* the main quest's measure. Believes ledgers, not omens; to him the protagonist is "a farmhand we took in." |
| **Kurosawa Naoyuki** | The lord's son and heir, ~22; talented, restless, chafing at genteel poverty. | Early-game **rival inside the household** (gatekeeps the mid rungs); the talent-foil *inside* the family until the protagonist's grind outpaces his coasting. Arc: rivalry → grudging respect → brotherhood; converted-talent, not innate gift. |
| **Lady Kurosawa Chiyo** | The lord's wife, ~50; manages the inner household and its meagre purse. | Gatekeeps **houseman access (Rank 3)** and the domestic economy (textiles, kitchen, hospitality); winning her regard unlocks indoor work and influence-entertaining systems. |
| **Dowager Kurosawa Toku** | The lord's mother, ~75; sharp-memoried; the only one who lived through the fall as an adult. | Living **backstory keeper** — slowly parts with why the house declined (grandfather Sadamune's flood-venture). Embodies "no shortcuts." |
| **Chief Steward Genemon** | Runs the estate day to day, ~60; dry, overworked, fiercely loyal. | The **spine's primary rank-gatekeeper and quest-giver** — first calls him "another mouth," assigns nearly all early labour, grants the rung-by-rung promotions. Arc: grudging tolerance → reliance → naming him deputy and successor. The old rice-debt records pass through him. |
| **Tanomo** | Estate accountant/clerk, ~45. | Gatekeeps the *koku*/economy and debt-repayment systems; the in-house thread into the ledger/debt mystery. |
| **Jūbei** | Aging master-at-arms / drillmaster; competent-but-never-great old foot-soldier. | **The mentor** and combat/training gatekeeper — "Talent is a story the lucky tell. You are not lucky. So you will work." Gates the entire training/idle-combat suite after the humbling first fight. |
| **Saburozaemon** | Stern senior retainer, ~55; traditional, exacting. | Gatekeeps respect at the retainer rungs; warms last and means it most. |
| **Heisuke** | Friendly peer retainer, ~30; open-handed. | Shows the ropes of retainer life; low-friction quest-giver and morale anchor. |
| **Kanbei** | Jealous middling retainer, ~35; cornered and proud, not evil. | **In-household antagonist-rival** who sees the rising stray as a threat; sabotages and spreads doubt. Player-influenceable detente or self-inflicted washout. |
| **Tokujirō** | Green recruit, ~16; joins after the protagonist has risen. | The mirror that proves the protagonist's growth; seeds the late-tier **"you now teach others from zero"** layer (re-homes the old reset's teaching idea). |
| **Oai** | Head maidservant, ~40; runs the indoor staff and the servant-gossip network. | Quest-giver and information broker inside the house. |
| **Kyūsuke** | Estate cook, ~50; warm comic relief. | Runs the food/provisioning sub-economy; a soft daily-life anchor. |
| **Sota & Mago** | A grizzled groom and a cheeky teen field-labourer — the bottom-rung peers. | The field/stable labour loop and honest friendship at the floor of the ladder. |
| **Ranpo** | Estate physician, ~55; rational, plain-spoken. | Dresses the healing scalp wound (grounding the mundane amnesia), names symptoms not visions, gates healing/medicine; flatly disbelieves the kami story. |

### Village (side) — Asagiri

| NPC | Role | Function |
|---|---|---|
| **Headman Yagoemon** | Village headman (*shōya/nanushi*); juggles *nengu* quotas, *corvée*, disputes, relief. | The **Village Chief reputation gatekeeper** AND the humanly-reachable culprit of the lost-child mystery (a frightened middle-man who doctored ledgers). Warm civic quest-giver up front; never a monster. |
| **Sayo** | The headman's daughter, ~16; sharp, kind, keeper of the valley's news. | The village's main quest-giver and the **living heart of the red herring** — names him "Tama" on sight and needs him to be her lost friend. Tutorializes the village/trade loop; the person the truth most hurts and most frees. |
| **Obaa Sato** | Village herbalist / wise-woman. | The village's **folklore-keeper** — narrates the *kamikakushi* legend sympathetically while knowing it is coping; teaches foraging/village-craft. |
| **Priest Ryōa** | Shrine/temple keeper; runs the soul-calling rite and a register of the vanished. | Folklore-atmosphere quest-giver whose records become **hard evidence** in the lost-child thread. |
| **Smith Gonta** | Gruff village blacksmith. | Tools and later spearheads — gates metalcraft; values shown effort over flash. |
| **Carpenter Risuke** | Village carpenter/builder. | Repairs and construction — gates building systems used to rebuild and expand the estate. |
| **Weaver Onatsu** | Village weaver, a sharp widow. | Cloth/textile trade — ties into Lady Chiyo's household economy and origin-town routes. |
| **Brewer Tokuemon** | Village sake brewer, jovial. | The village's festival/social hub; his brew greases reputation. |
| **Innkeeper Sukezō** | Runs the village inn and the **rumours board**. | The dedicated delivery vector for optional light-folklore side-quests; information broker. |
| **Peddler Sokichi** | Itinerant medicine-seller / peddler. | The **bridge** that lets the player chase clues and trade beyond the village (toward the origin town and the region tier); grounded source of yokai tales; helped the real Tama flee (a lost-child clue). |
| **Foreman Magobei** | A skimming village foreman — the "tanuki" of the rumours board. | Ordinary-villager-turned-petty-antagonist; his theft is the first hard thread into the rice-quota racket. Reachable and human. |

### Origin (side) — Sawatari-juku & Kuzuhara

| NPC | Role | Function |
|---|---|---|
| **Oyuki** | Tahei's widowed mother, ~45. | Emotional core of the origin thread — grieved him as dead; the reunion is the warm payoff, kept earned and a little costly (she is furious he was written off; he barely remembers her). |
| **Okimi** | Tahei's elder sister, ~20; married into a Magome trading family. | The concrete **trade-tie** that lets the origin town supply and route goods for the estate's expansion. |
| **Master Denbei** | Tahei's old employer, ~55; runs the transport-and-goods house. | Supplies porter/logistics know-how and legitimate manifests; the grounded source of the porter's-knot identity (he taught it — **ZERO bonus**). |
| **Kanta** | Tahei's childhood best friend and fellow porter, ~18. | Comic-warm friendship rekindled; an ally recruitable to the expansion. |
| **Ohana** | A sweetheart Tahei half-remembers, ~17. | Optional relationship thread the dream surfaces; grounded and gentle, no melodrama. |
| **Guildmaster Zenroku** | The transport-guild boss who wrote Tahei off, ~50. | The origin faction's **antagonist** — abandoned a missing porter to hide that his caravan ran short-weighted/contraband cargo; reachable later as witness/culprit, tying the origin into the rice-quota racket. |
| **Oharu (the real Tama)** | The "spirited-away" child, alive and grown in the post-town. | Mystery payoff & living proof — a girl who ran from a violent stepfather and a near-sale for debt. Reunion kept **costly and incomplete** (she may not forgive). Connects the lost-child thread to the estate's old rice-debt cover-up. |

### Region / Domain / Edo — antagonists, rivals & apex authority

| NPC | Role | Function |
|---|---|---|
| **Tedai Kuroiwa** | The deputy magistrate's agent (*tedai*) — polite, patient, dangerous. | The **primary human antagonist** of the regional tiers — architect of the tax-quota cover-up and racket; opposes the estate's rise because a rising house asks questions. **Defeated by evidence, not violence.** |
| **Hanzaki** | A scarred *rōnin* enforcer — the "one-eyed mountain god" of the pass. | Recurring physical threat and the **talent-gone-rotten mirror** — his edge is **trained and brutal, never innate**; survived by labour-built endurance, never out-talented. |
| **Clerk Naozane** | A guilt-sick junior clerk in the magistrate's office. | The crack in the cover-up; supplies documentary proof; a reachable conscience. |
| **Rival House Tomita** | A competing *goshi*/merchant house that prospered as the Kurosawa fell. | The inter-house **rival** on the regional/domain tiers — a status competitor to out-maneuver, not kill; talent + luck + ruthlessness against the Kurosawa's earned comeback. |
| **The Touring Inspector** | A senior domain/Edo official. | The **apex authority** reached only at the top tiers — the figure to whom the *osso*-style petition is made and before whom the house's standing is contested. Embodies the honoured ceiling. |

## 1.9 Side-threads — identity, origin & the dream rule

Two grounded side-threads run quietly beneath the estate-rise spine; both pay off only in **feeling,
allies, and flavour, never power**, and both resolve to human causes with no magic.

**(A) The Tama-vs-farmhand allegiance.** The valley grieves a child, **Tama**, "spirited away by the kami"
ten years ago; a half-drowned, memoryless young man washing up below the estate reads to them as the kami
giving Tama back. The estate flatly disbelieves it. This split powers the continuous **allegiance leaning**
(§1.5.4): it shifts standing-gain rates, flavour, and which dialogue/quest-givers open first — **never**
stats, drops, production, or availability. He may stay ambivalent the whole game (a valid stance: he
genuinely doesn't know). This is the mechanical home of the locked **"who you are is a side thread,
roleplay not creator"** decision.

**The grounded lost-child truth (the village's deepest optional segment — open-ended, not a checklist).**
"What happened to Tama?" is a **suggestion + a story the player pulls on and discovers in the world** —
clues stumbled upon through labour, travel, and rising trust (a child's straw sandal left yearly at the
shrine; a household that flinches at her name; the legend "remembering" a boy when an old woman
misremembers "she"; a midwife's reluctance; a debt-ledger mention; a post-town sighting). **The truth:**
Tama was a **girl** (the gender-drift is the fair clue) who **ran** from a violent stepfather and a
household about to **sell her into service** to clear a rice debt owed to the Kurosawa estate; a midwife
and the peddler Sokichi helped her flee; she has been **alive and grown the whole decade** in the
down-valley post-town (under the name **Oharu**), too ashamed to return. The adults let "the kami took her"
stand because a comforting miracle was easier than "we were about to sell a child." Resolution is grounded
and **partial** — reuniting the valley with the living, grown Tama is costly and incomplete (she may not
forgive). Notably, the **same rice debt-and-quota machine** that nearly sold Tama menaces the village and
wrote off Tahei's caravan, and traces back to the Kurosawa grandfather's covered-up disaster — **one
rotten root** under the side-mysteries, the origin, and the house's backstory.

**(B) The grounded true-origin thread (faction 3).** His real past is mundane and, per the locked "they
support him" direction, **not a dead end**: his true name is **Tahei**, a young porter/errand-hand for a
small transport-and-goods house in **Sawatari-juku**. His **living** family and friends are there (mother
**Oyuki**, sister **Okimi**, employer **Denbei**, friend **Kanta**, sweetheart **Ohana**, his
porter-guild mates). As memory returns he re-engages them; seeing what he is rebuilding at the estate, they
back him with pride, allies, resources, and trade ties. Recovering who he was literally expands the house —
but via **access only**, never a mechanical gift.

**The grounded origin story (no magic).** Tahei left Sawatari-juku on a mundane errand — escorting a goods
consignment over the mountain pass for Denbei. A flash flood (a neglected upstream embankment failing) and
rockfall on the fog-blind pass struck the small caravan; he was struck, half-drowned, swept downriver, and
snagged at a weir below the Kurosawa estate. His amnesia is ordinary head trauma + near-drowning +
exposure — **no magic.** Physician Ranpo dresses his healing scalp wound, names symptoms not visions, and
flatly disbelieves the kami story. (Guildmaster Zenroku wrote him off as dead to hide short-weighted /
contraband cargo, tying the origin into the same racket.)

**The dream rule (enforced in writing *and* code).** The recurring dream is **returning autobiographical
memory only** — never clairvoyance, never a psychic tether, **ZERO mechanical bonus.**

- **Memory-only.** The dream returns only things he actually lived (his name Tahei, a face, a road, the
  smell of paddy-mud, the porter's-knot habit's origin, Sawatari-juku, a person's voice in the water). It
  **never** surfaces external facts he could not have known firsthand — no precognition. The "voice in the
  water" is a real person he heard and is now recalling, not a spirit.
- **Zero mechanical bonus.** A returning memory or instinctive habit never grants a starting stat, recipe,
  tool, or combat edge. What memory grants is **access**: origin nodes/allies/quests unlock narratively,
  and the assets must still be grind-built.
- **Guaranteed cadence.** At least one origin/dream fragment is delivered within a capped number of in-game
  days OR a skill/standing threshold, and at least one origin beat is always available **without**
  reputation-gating, so the thread never goes cold. Each fragment is a short authored sensory beat in the
  event log; all variance flows through the one seeded RNG, and the cadence is headlessly
  regression-testable (force a late standing, fast-forward days, assert a fragment fired within N days AND
  that no stat/recipe was granted).

## 1.10 Folklore & quest-design philosophy

**Folklore is light flavour, not the spine** — the estate-rise is the spine. The campaign is **NOT** built
around named yokai; folklore arrives occasionally as small, light-hearted optional tidbits, concentrated in
one diegetic hub: the village **inn's rumours board.** Each rumour is a lightweight yokai story the player
**may** go investigate, open-endedly, out in the world (kappa at the ford, tanuki stealing rice, fox-fire
on the ridge, a one-eyed mountain god of the pass, *yamanba* of the high woods, *tengu* of the high
cedars).

**Hard rule:** every rumour-quest is **optional** and **none** gate main-quest tier progression. Every
folk belief is introduced as genuine, respected village dread first, investigated through ordinary work,
and resolved one-to-one to a concrete human/natural cause via a belief→cause table — but the game
**lingers in the unease before resolving**, and debunks with **dawning dread, never a Scooby-Doo
unmasking.** The master belief, *kamikakushi*, is itself a comforting lie covering a human truth (people
who fled debt/violence/conscription, or died on a lethal fog-blind road — and the protagonist's own flood
trauma); handled as grief-coping, not superstition to mock.

**Residual ambiguity is hard-capped at ≤1** unresolved, off-screen, mundane-readable beat (the
recommended one: the unidentified-hand offering at the boundary-stone where he was found). The "helpful
fox" is de-fanged to flatly explicable behaviour. **Nothing is ever confirmed supernatural; nothing is
mechanized; there is never player magic.** Folk-religion texture is specific and respectful, distinguishing
**Shinto** (shrine, *shimenawa*, boundary/mountain kami, the soul-calling rite) from **Buddhist** elements
(roadside/boundary *jizō* as guardians of children and travellers — fitting both the lost child and the
protagonist found at a boundary-stone — Bon offerings, the temple register of the vanished that becomes
hard evidence) rather than blurring into generic "Shinto magic." No rite ever mechanically "works."

**Quest design — open-ended, not hand-holdy.** A quest is a **suggestion + a story you go find out in the
world**, never an A→B→C waypoint checklist. There are **fewer checklists overall**; the dominant
minute-to-minute behaviour is the **incremental grind — the hero getting better at what he does.**

**Fractal incrementality (restated).** Every new zone/area/faction is itself incremental: you arrive
minimal, slowly learn its people/places/systems, and never get overloaded. The whole-game UI-reveal motion
repeats in miniature at every frontier — everything unlocks.

## 1.11 Endgame — restore & surpass

The endgame is **restore *and* surpass**, climaxing in **indirect recognition at Edo** — honoured as
historically grounded, not a power fantasy. The protagonist, now the lord's right hand and the architect of
the revival, completes the influence climb: the Kurosawa, hauled from near-foreclosure, stand restored
**beyond** the grandeur they held three generations ago (before grandfather Sadamune's failed flood-venture
and cover-up broke them).

"Recognition at Edo" is reached as **indirect, mediated standing** — any of: the house's renowned domain
product (built from the *shinden*/cash-crop/sericulture economy) celebrated in Edo's markets via
*sankin-kōtai* supply chains; the protagonist's labour materially lifting the **lord's** standing during
his Edo attendance so the **house** gains face; and/or a rare, hard-won merit commendation/appointment
earned by distinguished, documented service. **Crucially**, the protagonist does **not** personally become
a *hatamoto*, is **not** received by the shogun, and there is **no rags-to-daimyo arc** — the realistic
ceiling is the emotional thesis made structural: effort takes a nobody and a dying house astonishingly far,
then meets a wall the truly powerful built.

This mirrors the side-mysteries' **partial justice** (the reachable culprits — Magobei, Yagoemon, Zenroku,
eventually Kuroiwa — answer; the untouchable magistrate largely escapes; the *osso* petition wins partial
redress at terrible, deadly risk, never a clean courtroom victory). **There is no reset of any kind:** the
tier climb *is* the ending, and everything built persists. The teaching/management layer an earlier design
routed through a reset is **re-homed** onto green recruit **Tokujirō** and recruited origin friends — "a
man who climbed once now starting others from zero." The epilogue is a tableau of everything built: the
restored house seal, the reclaimed fields, the resettled Kuzuhara, the named drowned, the freed and
self-determining Oharu, the recovered family proud behind him, and a true name (Tahei) and a life he built
by hand.

## 1.12 How §1 paces the incremental unlocks

The estate-rank climb is the **dominant driver** of the UI-as-progression reveal, with House Influence as
the underlying gate-currency, so **"numbers go up" and "the world enlarges" are one motion.**

**Spatially:** the player starts trapped in one storehouse room (one verb) and earns the rest of the estate
room by room (the rank ladder made of doors), then the village (errands at Rank 3+), then the wilderness
(by conditioning), then his own past (by memory), then the region, the castle-town, and finally Edo.
Because each tier opens a fresh, larger canvas with bigger numbers and **no reset**, the map physically
embodies the tier escalation.

**Systemically:** each rank-up fires through the universal rewards/unlock bus as **one** event that
simultaneously pushes a diegetic log line, reveals the next panel/tab/resource/area, grants the perk, and
advances a story flag — so feature unlocks read as plot, never silent menu growth. Concretely:

- **Rank 0** — body/rest bar + rice counter.
- **Rank 1** — labour loop + paddies + *koku*.
- **Rank 2** — Skills tab + foraging/woodcutting.
- **Rank 3** — main house + village tier + the drill yard / idle-combat (after the humbling fight).
- **Rank 4** — the assignment/management panel + labour-gang.
- **Rank 5** — the House Influence macro-resource made visible + cash-crop/proto-industry levers.
- **Rank 6** — the ledgers + the tier-expansion map.
- **Rank 7 (capstone)** — the estate gate to the wider world and the bridge to the higher tiers.

Every reveal carries an Influence-band (plus flag/skill) predicate, so the macro spine literally paces the
UI. The three faction tracks differ in **shape** to keep pacing varied: the estate's **steep geometric**
rank gates space the big promotions (interleaved with smaller responsibility/perk drips so the climb has
texture between gates — never letting the next goal exceed ~2–3× the prior); the village's **gentle
per-node** meters give frequent small dopamine; the origin's **discrete memory milestones** are chunky
one-time unlocks on a guaranteed cadence (foreshadowed for hours so its absence reads as anticipation). The
side factions act as Influence **multipliers** (tuned so weaving them in roughly halves time-to-next-tier
— *felt, never a wall*), so a curious player paces faster and a spine-only player still finishes, just
slower and lonelier. The folklore rumours stay strictly optional and never gate tier progression.
Everything is data-driven (areas/panels/resources as registries with unlock predicates over GameState),
deterministic under the one seeded RNG, with balance/unlock tables generated into `docs/` and headlessly
regression-testable via the DEV play API.

## 1.13 Risks & guardrails (from the adversarial verify)

The adversarial review credited the design's hard constraints as **honoured and in several places
exceeded** (no overt/player magic; no-hidden-edge protagonist; identity-as-side-thread; three distinct
faction shapes; *shōya*-headman authenticity; folklore-as-light-flavour; cultural sensitivity). It **failed
the section as "canonical" on process and two authenticity points** — folded in here as guardrails:

- **Lock the reversing ADRs before treating this as canon.** Four direction-changing calls contradict the
  still-live locked ADRs and must be re-locked with the human first (see §1.14): reverse the reset (D-004),
  broaden the origin to living family, cap the Edo ceiling, and reconfirm/soften the true-name reveal
  (D-006). Until then, `prd.md` §1 is **draft**, and the old ADRs still encode the opposite.
- **Keep the world generic-rural — no real place-names.** The post-town was renamed from a real, famous
  Nakasendō *shukuba* to the **invented Sawatari-juku** on an unnamed *kaidō*, restoring the guardrail.
  Confirm canonical place/house names and resolve any remaining collisions.
- **Residual-ambiguity cap = ≤1.** Tightened from the facet's loose "~1–2" back to **≤1** unresolved,
  off-screen, mundane-readable token, matching the locked folklore decision.
- **State the protagonist age band.** Replaced the silently-dropped "17-year-old" / vague "young man" with
  an explicit **~18–20** self-made young adult, so downstream dialogue/art authoring is consistent.
- **Keep the top title authentic.** The top rung is "chief steward / the lord's right hand"; *karō*/*karō-kaku*
  and "symbolic adoption into the house name" are **aspirational narration only**, flagged for the §4/§5
  research-harden so a modest *goshi* house stays historically defensible.
- **Commit to a decadal/generational timescale** for the upper-tier climb (T3→5), so the
  restore-and-surpass arc reads as earned over years, not a few seasons.
- **No-mechanical-bonus discipline holds at the faction-3 fusion.** Making the origin town a macro asset
  must stay **access-only**; every asset is still grind-built (binds the dream rule).
- **Estate-restoration must not drift into city-builder/4X tedium** — Influence stays diegetic and
  story-framed; the cozy daily-labour texture and grounded character story remain the core.
- **Number-range / scope guard.** Five order-of-magnitude tiers risk balance blowup and scope explosion;
  define a v1 vertical slice (see §1.14) and confirm whether big-number formatting is needed.
- **Talent-foils stay made, not born; partial justice stays deliberate; debunk with dread, not gotcha.**
  Inherited from the prior review and still binding.
- **Romanization policy:** pick one macron convention project-wide (e.g. *Yagōemon* vs *Yagoemon*).

## 1.14 §1 decisions to lock

> Marked **DRAFT — in review.** The previously locked §1 ADRs (D-001…D-006) were written against the
> earlier lost-child-mystery spine. **The reset decision is REVERSED** by the new direction, and several
> others are amended. New superseding ADRs are flagged below for the human to weigh in on.

| Decision | Resolution / recommendation | ADR action |
|---|---|---|
| **The estate-rise spine** | Adopt the estate-restoration / rank-ladder / five-tier influence climb as the canonical spine. | **New ADR** (supersedes the old mistaken-identity spine framing). |
| **Three-faction structure** | Estate (gated rank ladder, main) + Village (multi-node reputation web, side) + Origin (memory-gated support track, side); coupled by separate currencies feeding one House Influence macro-resource. | **New ADR.** |
| **Reverse the reset (was ADR D-004)** | **Reverse D-004:** the tier climb (estate→village→region→domain→Edo) replaces prestige; **NO reset of any kind**; everything persists as the canvas grows. The teaching layer re-homes onto Tokujirō + recruited origin friends. | **Mark D-004 ⛔ REVERSED**; write the superseding ADR. |
| **Broaden the origin (faction 3)** | Broaden from "family dead / drowned hamlet" to **living** kin, employer, friends, sweetheart, and guild in the post-town, with Kuzuhara as a re-foundable region node; keep a bittersweet edge (he was written off; some won't easily forgive). | **New ADR** (supersedes the family-death canon). |
| **Cap the Edo ceiling** | Frame "recognition at Edo" as **indirect/mediated** (famous *meibutsu* + lord's lifted standing + a rare merit appointment); the protagonist never personally becomes *hatamoto* / is received by the shogun. | **New ADR** (touches the locked ambition). |
| **Protagonist identity (amend D-006)** | Keep **fixed male, no rename**, "Tama" borrowed name, true name **Tahei**; but **soften** the true-name reveal from spine-climax to a **de-emphasised late side beat** (identity is explicitly a side thread). State age band **~18–20**. | **Amend/reconfirm D-006.** |
| **Folklore = belief→cause** | Every belief resolves to a human/natural cause; residual ambiguity capped at **≤1** off-screen beat; the fox de-fanged; folklore is light flavour via the inn's rumours board. | **Reconfirm** (matches the locked folklore decision; tighten the cap wording). |
| **Mediocre-start contract** | No-hidden-edge rules binding on writing *and* code; refined to **weak/slow, not bedridden invalid**; porter's-knot and dream = **zero bonus, access-only**. | **Reconfirm/amend** the locked mediocre-start ADR. |

**Estate-rank count & shape (recommend lock):** **eight ranks** (Stray → chief steward) at the local tier;
higher tiers track House Influence and outward expansion rather than a fresh personal rank ladder. *Exact
count is a balance/pacing call to confirm.*

**Side-faction multiplier (recommend lock intent, tune later):** **moderate** — weaving both side factions
in roughly **halves** time-to-next-tier; felt, never a hard wall.

**v1 launch scope (a §7 decision, gated on human review):** Tiers **1–2 complete** (estate + village), Tier
3 stubbed as the cliff-hanger; Tiers 4–5 as roadmap.

### Open questions (surfaced for the human)

- **Tier count and naming** — are exactly five tiers right, or should "region" and "domain" merge / a
  "province" tier be added? Needs a balance/pacing pass.
- **Influence band thresholds & conversion-ledger weights** — how much Influence a *shinden* plot vs. a
  paid debt vs. a won petition is worth. Defer to the balance facet / §4.
- **Influence decay or only stall?** Recommend: never decays passively; a small set of scripted,
  recoverable dents only. Confirm against the "no wipe" feel.
- **Big-number formatting** — does the *koku*/Influence economy reach magnitudes across five tiers needing
  scientific/abbreviated formatting?
- **Pacing lock** — do the side-mysteries (lost-child, origin) and the tier climb climax **together** at
  Tier 5/Edo, or resolve around Tier 3–4 with Tier 5 as a quieter restoration victory lap?
- **Allegiance shape** — is Tama-vs-farmhand a continuous slider or discrete leanings, and can it be freely
  re-swung or does it harden after key beats?
- **Estate-vs-village penalty** — does the estate actively penalise high village standing
  (jealousy/split-loyalty) as a live mechanic, or is that purely narrative flavour?
- **Origin unlock timing & dream cadence cap** — where on the memory/tier timeline does the origin track
  open, and what is the exact cadence cap (in-game days or skill/standing threshold)?
- **Seconded allies cost** — do village allies seconded to the estate count against village production (a
  real loan with a cost), or are they free helpers?
- **Top-title authenticity** — chief steward (*karō*-equivalent) vs. a humbler *yōnin*/steward title for a
  *goshi* house? An authenticity-vs-legibility call on vocabulary.
- **Canonical setting template** — which decade/sub-period and domain archetype (keep fictional but pick a
  template) to sharpen the rise-levers, the *meibutsu* product, and the *goshi*-treatment model.
- **Adoption/marriage-up** — an actual late-game mechanic (the most authentic top-rung lever) or narrative
  flavour, given it introduces relationship/family-line systems that may exceed v1 scope?
- **Whose neck is on the line in the *osso* petition** — the protagonist, an ally, or a *gimin*-style
  martyr NPC? The most affecting option is real personal risk; reconcile with the partial-justice
  guardrail.
- **Estate room-unlock granularity** — six separate reveals, or fold stables/woodlot into the forecourt to
  avoid early reveal fatigue?
- **Macro-tier spatiality** — do region/domain/Edo get full sub-area maps or more abstract
  "holdings/influence" boards over a thinner location set?
- **Inn rumour-quest count** — how many ship, and confirm the hard rule that all are optional and none
  gate tier progression.
- **Canonical place/house names** — confirm estate = Kurosawa, valley = Asagiri-dani, origin post-town =
  the invented **Sawatari-juku**; resolve remaining name collisions (sister renamed **Okimi** to avoid the
  superseded survivor "Kiku"; confirm whether any old-canon Kiku material salvages into the
  Kuzuhara/origin thread).
- **True-name reveal reconciliation** — does the late **Tahei** reveal and its timing survive the reframe
  now that identity is explicitly a side thread, softened/optional rather than a spine climax? Reconcile
  with D-006.

---

_§§2–7 to be authored after §1 is approved._

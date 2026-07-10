# §3 — Incremental Unlock Ladder (UI-as-progression)

This section makes the **signature feature** concrete: it specifies the **ordered
reveal of every panel, tab, screen, system, resource-row, and area** across the
game. There are **SEVEN tiers (T0–T6)**, and **each tier is its own unbroken
`R0→R7` career** — one uniform rung scheme, never a fresh `V*`/`G*`/`R8–R15`
numbering per tier (that old numbering is **dead everywhere**; ADR-152,
[`03-tiers.md`](../../story-bible/03-tiers.md)). **T0–T3 are authored in full**
here; **T4/T5/T6** are the forward frontiers, scoped in shape. The tiers are the
tier→map ladder: **T0** the Estate (household) · **T1** the Estate (land) · **T2**
the Valley · **T3** the Region · **T4** the Castle Town · **T5** the Domain · **T6**
Edo (its rungs the HOUSE's Edo standing, `H0→H7`). It references the §2 systems by
name and defers all exact numbers to §4 (thresholds, costs, curves, the fixed
coin-denomination rates).

**Design constraints honoured throughout §3.** grounded / no-magic; a
mediocre-start protagonist (no hidden edge of **birth, gift, or memory** — but
**trained labour skills DO** grant small, bounded combat perks); **the core loop is
the MC's own actions, NOT a management sim**; the four-pillar House Influence (**Estate** 家産
[trade ≤⅓] · **Arms** 武威 · **Office** 官威 · **Name** 家格 — ADR-159) with
**achievement-jumps + per-season judged results**, **up-only with minor recoverable
dents** (a small below-high-water seasonal **self-heal** that never advances the
high-water); the tier-up gate is the **scaled grade-gate** (`1 EXCELLENT + 1 GREAT +
(N−2) GOOD` over the N revealed pillars, all ≥ GOOD; T0 collapses to a single
EXCELLENT; **NO overflow**); progression is **SEQUENTIAL per tier** — climb the
rungs (**Phase 1**), THEN grind the estate's pillars (**Phase 2**), THEN tier-up
(§3.0.1); combat is **THREE clean separately-stored tracks** (character level · the
Arms pillar · the Combat Rank rung-meter — §2.8.1/§3.0.1) and **INCREMENTAL** (T0
starts with the carrying-pole, a growing **~9–10**-weapon roster, +2/+3/+4 per tier,
surfaced one-at-a-time on the **combat-reveal ladder** §3.5.1); combat is
first-class & **EARLY (T0-R3)**, satiety-throttled ("eat before you fight"); tiers
**T0–T6** with per-tier story gates; a **fresh `R0→R7` ladder PER TIER** (one
uniform rung scheme, never `V*`/`G*` numbering); **full maps
every tier**; the world is **SPATIAL** — every labour and foe is bound to a map
node and you **walk to your work**; **active-only / no offline** (the "leave it
running, check the progress" feel = **tab-open auto-resolve + auto-repeat labour**);
an abstract clock; **fractal incrementality** with **design-staggered
one-at-a-time** reveals (the schedule is *authored*; there is **no runtime
reveal-queue**); LEAN / high-impact, immediate-vs-later; **auto-producers T4+
only**; the **~28.5 h v1 budget is a FLOOR/minimum**, a long OSRS-rough grind; rich
attributes; **soft** stamina; **hybrid** crafting; **K/M/B** number formatting;
**macron** romanization; names per canon.

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
| **RANK** | a **Phase-1 rung** reached (a fresh `R0–R7` ladder per tier — the uniform rung scheme for every tier; T6's rungs are the HOUSE's Edo standing, `H0–H7`) | the rung's **authored hidden REQUIREMENT list** 100% done (**FB-121/ADR-137** — the old meter/threshold/storyGate AND-gate is **deleted**; requirements are authored in `narrative/requirements.md` → `content/requirements.ts`, and the player reads a rounded **% bar**, never the list). Requirements are **curated, story-consistent acts** — *never* raw XP/kills/deeds (those feed the character level / the pillars). Every RANK promotion is a **player-TRIGGERED, ignorable full-screen VN story beat** (choices remembered; not every rung a perk — **ADR-110** / §1.6.4(1) / §3.0.1(1)). |
| **PILLAR** | the **Phase-2 TIER-UP gate** cleared — the **scaled grade-gate** over the tier's **revealed** pillars (**Estate** 家産 [trade ≤⅓] · **Arms** 武威 · **Office** 官威 · **Name** 家格 — ADR-159) | the **scaled grade-gate** distribution (`1 EXC + 1 GRT + (N−2) GOOD` over the revealed pillars, all ≥ GOOD; NO overflow; §2.16/§4 — numbers → §4). Pillar **DEEDS accrue in PHASE 2 only** (post-final-rung), so PILLAR gates the **tier-up**, never an individual rung. |
| **STORY** | a story / quest / dialogue flag set | a `flagsSet` from a quest or `TextLine` (§2.12) |
| **FIRST-USE** | first acquisition / first action / discover-by-doing | first resource gained, first XP in a skill, first entry into an area/danger ring (§2.4, §2.7, §2.9) |

> **The THREE combat-fed tracks (never one fused bar — §2.8.1/§3.0.1).** Wherever a combat reveal
> appears below, keep them distinct: **one kill** writes **combat-XP → the character (combat) level** (HP +
> attribute points + satietyMax); **one recognised martial DEED** writes **→ the Arms pillar** (House Influence,
> **Phase-2-gated**); **one curated per-rung activity** writes **→ the Combat Rank rung-meter** (the Phase-1
> martial rung-gate). Reconflating these three is the single likeliest regression — they stay separate by design.

**Reading the tables.** Each tier is **one coherent ladder table** (a *fresh* ladder, never a continuation;
§1.5.1). Rows are in **reveal order**. Each reveal gives: the **trigger**, **what becomes
visible**, and the **diegetic event-log line** that announces it (the `revealLogLineId` copy; final wording is a
§5 authenticity-pass concern, but the substance is fixed here).

**Four cross-cutting rules that shape the whole ladder:**

1. **Fractal incrementality (§1.2 pillar 2).** Nothing is dumped. A composite system reveals **one piece at a
   time**: the drill yard reveals one post → one rack → sparring slots; a new region reveals one road → one
   threat → one contact; the four-bar Influence panel reveals **bar-by-bar** as each pillar is first revealed,
   not all four at once.
2. **The multi-screen UI appears single-screen early (§2.1b, §1.12).** v1 begins as **one screen** (a
   single column: event log + one verb). **Navigation chrome and additional screens unlock progressively** — the
   first nav tab appears only when there is a second place to go. The player UI is a **SEVEN-TAB set — Work · Map ·
   Estate · Inventory · Character · Combat · Quests — each revealed only as it unlocks** (**ADR-119**, reinstating
   Quests' own tab (**ADR-037**) and superseding **ADR-112**'s six-tab lock; the earlier "every distinct activity its
   own tab" sketch stays superseded): **one capability per thematic tab** (labour → **Work**;
   walk-to / who's-here / talk-to → **Map**; house upgrades → **Estate**; storehouse + belongings → **Inventory**;
   attributes / skills / bestiary → **Character**; the fight loop + stance → **Combat**; the undertakings / quest
   log → **Quests** (glyph 用, provisional)), with the **rung in the header** (§1.6.4), not a tab. **Crafting
   stays a SECTION, not a tab** (ADR-119). The tab-reveal cadence (ADR-119): **Work R0 · Map + Estate R1 · Character
   R2 · Combat + Inventory R3 · Quests R5** — Inventory is **staggered to R3** (the old R1 triple-reveal is gone),
   and **Quests reveals at R5** as its own quest-log beat (ADR-037's cadence), not batched into the R3 combat wave. The "screen / nav reveals" are called out explicitly in §3.5 (the navigation
   reveal track) so the shell's growth is legible as its own ladder; the **tab set + its incremental-reveal
   gating are `ui-design.md`'s domain** (this §3 owns the reveal *order*, not the tab layout).
3. **The world is SPATIAL — you walk to your work (§2.9).** Every labour and every enemy is bound to a **map
   node**; there is **no default node** — you **move to** the node to work a labour or fight a foe, and the
   storehouse (the bank) is at the **kura** (storing rice there now **carries a cost** — **ADR-118**, mechanism
   TBD). The estate becomes a small **walkable map** from the moment a
   second node opens (the paddies, at R1); the map grows a node at a time and, at each tier seam, a **road out**
   to the next, larger canvas. Walking is load-bearing — richer forage and the boar's den sit one hill deeper,
   so the map earns its walk.
4. **Reveals are DESIGN-staggered one-at-a-time — the schedule is AUTHORED, not a runtime queue.** The unlock
   *schedule* is hand-authored so beats arrive **singly** — there is **no `revealQueue` field in `GameState`**;
   staggering is a **design property** of the authored ladder, not stored runtime state (§2.1/§6.4). The general
   **NO-UI-DUMPS** principle (stagger everything, slowly and gently) is honoured by *authoring*, never by a
   runtime serializer; a genuine multi-element single-feature reveal (e.g. one new shop row) is a **bespoke
   one-off**. The **incremental skill-unlock ORDER** is itself the real bound on the small, bounded
   **labour→combat per-skill cross-feed** (§2.7.1): skills surface in a designed order, so their few small combat
   perks accrue gradually — and **conditioning stays the separate ZERO-stat enablement gate** (§2.8/§4.5), never
   bypassed by those perks.

---

## 3.0.1 The two-phase per-tier model, the rung-meter law & the Phase-2 tier-gate (the spine every table below builds on)

This makes the progression spine **concrete and cross-cutting before the tier tables.** The canonical
conceptual statement is **§1.6.4**; the system shapes are **§2.15.1 / §2.16 / §2.8.1**; the exact
curves/thresholds are **§4**. Every `R*/V*/G*` row below is read through this model.

**(1) Each tier is climbed in TWO ORDERED PHASES.**

- **Phase 1 — climb the rungs** (`R0→R7`, the same scheme every tier). Each rung promotes when its
  **authored hidden REQUIREMENT list is 100% done** (**FB-121/ADR-137** — the old
  meter/threshold/storyGate AND-gate is deleted): requirements are curated,
  story-consistent acts — a designed **one-to-many** set, NOT a single
  repeat-counter — authored per rung in `narrative/requirements.md` and compiled
  to `content/requirements.ts`; the player reads a rounded **% bar**, never the
  list. **Pillar DEEDS do NOT accrue in Phase 1** — this is the structural fix against a "half the rungs, maxed
  deeds" state. A cleared AND-gate only **readies** the promotion — it **holds** (at the header rung element)
  until the **player triggers** it, and can be **ignored**; triggering plays the rung as a **player-triggered,
  full-screen VN story beat** with remembered choices (`npcMemory`) and only occasional small bonuses — **not
  every rung grants a perk** (**ADR-110** / §1.6.4(1); the VN engine is ADR-104 / §2.12).
- **Phase 2 — grind the house up.** The **capstone (final) rung OPENS Phase 2** — the **estate-influence /
  four-pillar grind** — and the tier's **pillar DEEDS accrue here and ONLY here**. Clearing the tier's
  **hybrid good/great/excellent pillar profile** (below) is then what **tiers up** to the next, larger canvas.
  *(The capstone rung confirms **Phase 1**; the **Phase-2 hybrid pillar gate is the actual tier-gate**, ANDed
  with the capstone rung-meter + story.)* **Phase 2 is NOT a dead consolidation half:** it carries its
  own **authored reveals** — the tier's **estate BUILD** completing (the estate's visible stage advancing per
  tier from **E0→E1 at T0** onward — see each tier's stage span — gated
  on the pillar-Influence floor, **not** the Phase-1 rungs; §2.17/§4.7.5), new **deed categories** opening
  (**Estate at T0, Arms at T1, Office at T2, Name at T3**), and the **cross-pillar combo** unlocking (Model-A; §4.3.1 — **partial Office-pairs at T2 Village**, the **full four-pillar set at T3 Region**) +
  the **per-season seasonal-rotation** lever (§2.14) as the anti-slump reveals. And the **per-pillar
  shortfall is surfaced EARLY + CONTINUOUSLY** from the first Phase-2 season (the lagging bar reads plainly, e.g.
  *"Name is behind"*) so a breadth shortfall is **never an end-of-Phase-2 surprise** (§2.16(b)).

**(2) The requirement law (ADR-137, replacing the retired meter law).** Each rung's
requirement counts are **provisional fun-first drafts**, tuned edit →
`gen:narrative` → sim (ADR-132 — no `balance.ts` mirror); the pacing floor is
enforced by **measurement** (the ADR-132 sim + `docs/content/t0-pacing.md`), not
by a back-solved threshold — the **≥30-min-per-rung floor binds from T1** (T0 is
tutorial-paced). Kills feed the **character (combat) level**, never rung progress,
except where a rung's authored requirement names a fight (§2.8.1); the three
combat-fed tracks stay separately stored (§2.20).

**(3) The Phase-2 scaled grade-gate.** Phase 2 tiers up on the
**scaled grade-gate over the pillars REVEALED by that tier** — exactly **`1 EXCELLENT + 1 GREAT + (N−2) GOOD`**
for **N** revealed pillars, all **≥ GOOD**, **NO overflow** (a surplus in one pillar can never substitute for a
deficit in another). The **revealed-pillar set grows one per tier**: **T0 = 1** (Estate — the gate
**collapses to a single EXCELLENT**), **T1 = 2** (+ Arms — **1 GREAT + 1 EXCELLENT**), **T2 = 3** (+ Office —
**1 EXC + 1 GRT + 1 GOOD**), **T3 = 4** (+ Name — **1 EXC + 1 GRT + 2 GOOD**) — and the gate is **only ever
checked against revealed pillars** (never against an unrevealed one). The only structural cap that survives is **trade ≤⅓ of Estate &
Wealth**, with cross-pillar combos computed **post-clamp** and excluded from the gate-check (§2.16/§4.3.1). The
per-pillar-per-tier thresholds are back-solved against the fixed §4.2.1 deed inventory —
**numbers → §4**.

**(4) The THREE clean combat tracks.** As §3.0 notes: **one kill → character-level combat-XP**
(scales HP / satietyMax / attribute points); **one recognised deed → the Arms pillar** (Phase-2 gated); **one
curated rung activity → the Combat Rank rung-meter** (the Phase-1 martial gate). `character.level` is the only
one of the three that scales personal power; the other two are *standing*/*gate* meters.

**(5) NO stored "phase" flag.** The current phase is **derivable from the current rung** (pre-capstone = Phase 1;
post-capstone = Phase 2) — no extra `GameState` field (§6.4).

**(6) Budget = a FLOOR; the loop is active-only.** The per-tier hour budgets (**§4.8** — **T0 is
floor-exempt** (a ~10–15 min/rung tutorial ramp), the **≥30-min-per-rung floor binding from T1**; **~28.5 h v1
FLOOR**) and the ≥30-min-per-rung floor are **minimums/FLOORS, never ceilings** — pushing 1–2 pillars
to *great/excellent* in Phase 2 **extends** Phase 2 beyond its floor by design. The "leave it running, check the
progress" feel comes from **tab-open auto-resolve combat + auto-repeat labour** (active-only), **not**
from offline accrual or early idle producers (auto-producers are T4+ only, §2.5).

So, read every tier table below as: **climb the rungs (Phase 1: rung-meter + story AND-gate) → the capstone opens
Phase 2 → grind the REVEALED pillars to the hybrid profile → tier-up.**

---

## 3.0.2 Capstone branches — the tier-seam CHOICE (the reusable pattern · ADR-125)

A tier's **capstone rung** (the final Phase-1 rung — **R7**) MAY carry a
**forking values CHOICE**: each option **keeps** its relationship memory (`regard`
+ NPC warmth) **AND** unlocks a **unique NEXT-TIER side quest** giving **(1) a
unique equippable ITEM + (2) a separate UNLOCK**. **One choice per playthrough** →
one path; the others **lock out** (a replay driver). **Ascension is NEVER a reset**
— everything carries forward; the branch *colours* the next tier, it doesn't
restart it.

**The forking capstone is a reusable PATTERN, not a fixture of every tier**
(ADR-125). Under the storywave canon it is **superseded for T0** (HD-29 default):
**T0-R7 is the linear use-name beat** — Genemon writes GONBEI in the day-book, and
**the lord is never met in T0** (§3.2 R7). The pattern itself is **not revoked** —
a real forking capstone is kept for **T1**, reworked later against
[`tiers/t1.md`](../../story-bible/tiers/t1.md). When a tier readopts it, follow
this template:

- **The "quest + X" palette** (the "X" the unlock draws from): a unique
  **character** · **location** (a new map node) · **combat enemy** · **activity /
  skill** (existing skill system) · **crafting recipes** · **shop** · **reputation
  / perk** · **reputation micro-faction** (levels up) · **equippable item** — or any
  balanceable combo.
- **Out of scope** (too hard to balance): new **deeds**; novel new UI **surfaces**
  (a new node / a skill in the *existing* systems is fine — reuse, don't invent a
  paradigm); a parallel **"standing" advancement lane** (a small micro-faction rep
  IS fine); a new **system** (helper / auto-labour); a whole new **crafting branch**
  (recipes + narrow refinements like "silver-inlaid armor" are fine).
- **Balance philosophy:** the options **need not be equal** — a best / an
  overpowered / a narrative-only / a **5-min** / an **hours-of-grind** (RS-style xp)
  option is all fine. **Range is a feature**, not a bug.

### The worked example — deferred to T1

> **The former T0 worked example is VOID (storywave / HD-29).** The old R7 capstone
> board (*"How do you answer the lord?"* — devoted / ambitious / humble, a 3×3
> diverge unlocking heirloom blades / rival spars / a craft-tool) is **dead**:
> under the bible canon **T0-R7 is the non-forking use-name beat** and **the lord
> is never met in T0**. HD-29's default keeps a **real forking capstone for T1**,
> reworked later against [`tiers/t1.md`](../../story-bible/tiers/t1.md); its worked
> design will be authored with that tier. The **pattern and its balance philosophy
> above stand** — options need not be equal (a best / a narrative-only / a 5-min /
> an hours-of-grind option are all fine; **range is a feature**). **ADR-125** owns
> the pattern; the T0 tier-up gate itself is **ADR-159 / §1.6** (the single-Estate
> EXCELLENT collapse), not a fork.

---

## 3.1 The cold open — minute one (T0, before R0)

The lone hand-authored, pre-ladder state — **one verb and a log**, no nav, no
tabs, no map (the map opens as you earn the ground to walk). *(The step-by-step
script table that lived here was struck 2026-07-10, ADR-168 — it quoted the
pre-storywave cold open wholesale, kura-first; the shipped open begins at the
**weir** — the river gives him up — then the sickroom, three days lost, the
day-book.)* The cold open is authored in
[`narrative/cold-open.md`](../../../src/core/content/narrative/cold-open.md) +
`intro.md` (the Sōan examination scene, the You:→Nameless: flip, the R0
decision) and compiled by `gen:narrative`; **read the shipped script in
[`docs/content/t0-story.md`](../../content/t0-story.md)**. What stands as
design intent: launch shows the persistent event log and a single verb; the
body/rest readouts and the rice/coin rows light on first use through the
reveal engine (§2.1); the first dream-fragment seeds the Origin thread as a
log line with ZERO mechanical effect; after the examination scene the player
is at **R0** and the T0 ladder (§3.2) takes over.

---

## 3.2 T0 — Estate-tutorial ladder (full; v1) — `R0 → R7`

> **T0 is the TUTORIAL tier** — the **showcase-in-miniature** first half of the estate: a tutorial **T0
> `R0→R7`** followed by a full-estate **T1 `R0→R7`** (§3.3.5 — its own fresh ladder). T0 reveals each system **in
> miniature** and is **floor-exempt** (a gentle ~10–15 min/rung ramp); the real ≥30-min-per-rung grind binds from
> **T1**. **T0 reveals ONE pillar — Estate 家産** (Arms reveals at T1); its tier-up gate **collapses to a single
> EXCELLENT in Estate**, and the **first ascension (T0→T1) always lands BIG** regardless of grade.

**All of T0 is PHASE 1** (climb the rungs `R0→R7`); the **capstone R7 OPENS PHASE 2**
(the estate-influence / **Estate-pillar** grind, where the tier's pillar DEEDS first accrue — the **Estate**
pillar; Arms reveals at T1). One declining hill estate
(the Kurosawa *gōshi* house), **unlocked room by room** — and T0 room/area reveals are **separate**:
stables, woodlot edge, and drill yard each reveal individually, never folded into the forecourt. **T0 is
spatial**: every labour and every foe is bound to a **map node**, and you **walk (move to the node)** to work or
fight — the weir gives you up at the cold open, then you walk out to the paddies to farm, the forecourt
to haul, the woodlot to cut and forage; banking is at the kura. **Combat surfaces EARLY at R3** (the humbling first fight) and then
deepens **incrementally** along the **combat-reveal ladder** (§3.5.1) — never a one-beat dump. Each rung
promotes when its **authored hidden requirement list is 100% done** (ADR-137; the
player reads a rounded % bar — T0 is **floor-exempt**, tutorial-paced; the
≥30-min floor binds from T1). Requirements are **curated, story-consistent acts**,
**never** raw XP/kills/deeds. **No auto-producers appear** (early game is the MC's
own active grind). The **House-Influence panel TEASES from R3** (the build's
`panel-house-influence` unlock, on the Estate tab — its single **Estate** bar lit,
the other three **locked silhouettes**), and **R7 (`t0-capstone`) is what OPENS
Phase 2**: the player *climbs the rungs first*, then *grinds and sees* the
standing he builds (the **Estate** pillar's deeds accrue only from R7 on; Arms
reveals at T1).

Estate stage span this tier: **E0 Foreclosure's Edge → E1 Stabilising**
([`tiers/t0.md`](../../story-bible/tiers/t0.md)) — the zones reveal across
Phase 1, while the **staged U1–U4 kura-works build** runs alongside (ADR-145;
coin-gated as shipped, the deed reframe pending; the shipped stage log-lines
carry the condition names — *U1 Stabilising → U2 Recovering → U3 Prosperous →
U4 the reclamation capstone* — see §2.17's generated works table).

<!-- gen:begin t0-rung-titles (pnpm run gen:prd-regions — do not edit inside) -->
> **The T0 rung titles, as the build ships them** — GENERATED from `RANKS`
> ([`ranks.ts`](../../../src/core/content/ranks.ts)) by `pnpm run
> gen:prd-regions`; **do not edit between the markers**. These are the
> **mechanical** rung labels the running game uses. The richer *narrative*
> titles in the §3.2 ladder table below are reconciled to these by the T0
> compression sweep (Flow 2, gated on R1 — `/prd-compress`), not here.
> Editing a title in `RANKS` without regenerating turns the
> `gen-prd-regions` gate RED.
>
> | Rung | Title (build) | 漢字 |
> |---|---|---|
> | R0 | The man from the weir | 無名 |
> | R1 | The day-hand | 日雇 |
> | R2 | The yard-hand | 庭男 |
> | R3 | The grain-watch | 蔵番 |
> | R4 | The pupil | 弟子 |
> | R5 | The accused | 咎人 |
> | R6 | The trusted hand | 用人 |
> | R7 | The named hand | 名代 |
<!-- gen:end t0-rung-titles -->

| Rung | Title | The beat (bible `tiers/t0.md`) |
|---|---|---|
| **R0** | The man from the weir | Cold open; the speaker flip (`You:` → `Nameless:`), witnessed — the forced beat where he asks his own name and Sōan answers he has none |
| **R1** | The day-hand | Kept by arithmetic; Genemon states the terms at the board, witnessed |
| **R2** | The yard-hand | The silent rung — a task simply not taken back; the **seasons unlock** here (R0–R1 show only the day of the week) |
| **R3** | The grain-watch | The wolf — **survived, not won**; the rice untouched, ribs cracked |
| **R4** | The pupil | He confesses the granary loss, then **BEGS Kihei for drills**; the creed, on-screen once; the drill yard opens |
| **R5** | The accused | The Count night — the day-book clears him; no apology |
| **R6** | The trusted hand | The first coin errand — Yohei's stall at the gate, the house's small purse counted back to the mon under Genemon's finger |
| **R7** | The named hand *(capstone — the USE-NAME beat; the lord is NOT met in T0)* | Genemon opens the day-book and writes the hand-me-down name **GONBEI** — "the house's name for you; earn a better." Sleep; the first dream |

> **The per-rung REVEAL cadence** — what each rung unlocks (panels, tabs, areas,
> combat, and the House Influence panel at R7) — is specified by trigger in the
> tracks that cross-cut this ladder: room/area reveals in **§3.3**, the nav shell in
> **§3.5**, combat + the weapon roster in **§3.5.1**, and the two-phase model in
> **§3.0.1**. This table fixes the **fiction** of each rung (bible
> [`tiers/t0.md`](../../story-bible/tiers/t0.md)); those tracks fix the mechanics.
> **R7 is the NON-forking capstone** — the use-name beat that OPENS Phase 2 (the
> single-Estate-pillar EXCELLENT grind; §3.0.1, §1.6), **not** a values fork
> (§3.0.2). The mechanical rung LABELS the built game ships are the gen-region
> table above (`RANKS`); the richer narrative titles here are reconciled to them by
> the T0 compression sweep, not by hand.

> **T0 deliberately withheld (fractal discipline):** the **full-estate grind** — the **Arms pillar**, the **2nd
> weapon line (sword)**, the first paid retinue, and the rice-and-coin flywheel branching into LAND/TREASURY/TRADE — is
> **T1** (§3.3.5); the **TRADE strand + coin's higher denominations** (a **T2** reveal — coin (*mon* 文) is a
> resource row from T0, but there is **no *trade engine* in T0**, so **no TRADE strand at T0**, and the higher
> denominations (**monme**, then **ryō**) surface only as wealth grows, §2.4; a small capped **provisioning shop**
> where the player buys goods for his own character is a **personal COIN sink** and is legitimate from T0 — a
> **personal koku stipend** is a **T4+** reveal, the House-only koku standing carries no personal purse before
> then); the inn & **rumours board** / folklore (**T2**, §2.13); the
> **component/quality** crafting system (**T2+** — T0 is *simple* recipes only, §2.11); seasons/weather/**festivals**
> as a live *mechanical* layer (the *clock* shows at R1; the **bounded ±10% weather/festival** layer first
> reveals at **T2**, §2.14); **auto-producers** (**T4+**, §2.5); the **origin** track (**T3**, §2.15). The **pillar
> grind itself is Phase 2** (post-R7). Holding these back keeps the screen lean.

> **T0 Phase 2 — what the back half REVEALS (not a dead consolidation half). BUILT (ADR-145).**
> Post-R7 (the **Estate** Influence bar live) is itself a **reveal cadence**, not just a number-climb. The
> back half is a **multi-source deed economy** (the table below) driving a **staged U1–U4 estate build**:
> each stage needs banked Estate standing beside its coin cost, so the build lands as **paced Phase-2
> beats** across the deed climb — each deed source fires a one-time reveal beat on its first bank (the
> *shinden* paying out, the workshop's first recorded yield, the granary stocked), and **the E1
> "Stabilising" estate BUILD completes** at the final stage as the back half's payoff beat (gated on the
> staged build's standing gates, **not** the Phase-1 rungs; §3.3/§2.17/§4.7.5 · ADR-145).

<!-- gen:begin t0-deed-sources (pnpm run gen:prd-regions — do not edit inside) -->
> **The T0 Phase-2 Estate deed sources, as the build ships them (ADR-145)** — GENERATED
> from `ESTATE_DEED_SOURCE_MULT` + the `ACTIVITIES` `deedSource` bindings
> ([`balance.ts`](../../../src/core/content/balance.ts) /
> [`activities.ts`](../../../src/core/content/activities.ts)) by `pnpm run gen:prd-regions`;
> **do not edit between the markers**. Identity only — the per-source multipliers are
> §4 tuning (provisional, sim-owned — ADR-132). Estate-relevant work ONLY banks (ADR-145 Q4):
> woodcut/forage carry no source. Each source fires a one-time reveal beat on first bank.
>
> | Source | Banks from |
> |---|---|
> | fields | the shinden/paddy labour (`farm_paddy`) |
> | stores | hauling + a rice deposit at the kura (`haul_stores`) |
> | workshop | a workshop craft (`craft_weapon`) |
> | watch | a WON grind fight (the house is safer) |
> | treasury | a rice sale into the house books |
<!-- gen:end t0-deed-sources -->
 Because **T0 reveals a single pillar (Estate)**, the tier-up gate **collapses
> to EXCELLENT in Estate** — and the **shortfall is surfaced from the FIRST Phase-2 season** (the Estate bar
> reads plainly, e.g. *"Estate is still short"*), so the floor is **never an end-of-phase surprise**
> (§2.16(b)). Clearing the 1-pillar gate (EXCELLENT in Estate) → **T1, the full-estate
> recovery** — where the **Arms pillar reveals** and the first 2-pillar gate begins; the **first ascension always
> lands BIG**.

### 3.2.1 The earned-transition spine — *why* each promotion happens

> **Audit rule: no rung is granted for free.** Each promotion has a concrete in-game **trigger** (what you
> did), an in-fiction **reason** (why the house grants it), and a **named granter** — and the granters are
> the house's **own people** (the steward **Genemon**, the drillmaster **Kihei**), **never a lord** —
> **the lord is not met in T0**.
>
> **The trigger mechanism (BUILT, ADR-137/FB-121):** each T0 rung carries a finite **authored list of
> hidden requirements** (counted acts, quest-token goals, economy/state predicates, story flags —
> order-free), authored in `src/core/content/narrative/requirements.md` and compiled by gen-narrative;
> the readable lists live in [`docs/content/t0-story.md`](../../content/t0-story.md) § "The hidden rung
> requirements" (generated — never re-typed here). The player sees only a **rounded integer % bar**;
> every completion fires a diegetic flavor line, and **100% alone** opens the player-triggered rung
> beat (ADR-110). The former **rung-meter + storyGate AND-gate is deleted** — story preconditions are
> requirements IN the list. The table below is the per-rung **fiction intent** those lists realise.

Two engines make a rise from "another mouth" to the house's **named hand** (Gonbei) believable inside one
tier:

- **The house is dying and short-staffed.** The Kurosawa are a broke *gōshi* household of ~a dozen people,
  buried in inherited debt ([`tiers/t0.md`](../../story-bible/tiers/t0.md)), with a rusty door-bar for defence. A house this thin **can't be
  choosy** — it spends its scarce trust on whoever keeps proving capable. Every promotion below is that
  necessity in action.
- **You earn it on merit; identity is a later, lighter thread.** Across T0 you rise purely on demonstrated
  work — labour, grit, honesty, restoring the land. The "are you the lost *Tama*?" question is only
  **foreshadowed** here (the dream, the porter's-knot); **no one at the estate ever speaks the name "Tama."**
  To the house you are simply a hand who keeps earning his place. The legend only **ignites in T2**, when the
  village (Sayo) names you Tama on sight (§3.4, T2-R0) — and the estate's plain "we only ever saw a hand"
  *becomes* the counterweight to the village's certainty. (Allegiance goes live at T2; grounded, partial
  payoff on the **T3 spine** (the Otsuru truth). Kept **light** — narrative-only, never gates stats/availability.)

| Promotion | Earned by (the fiction the requirement list realises) | Why the house grants it | Granter |
|---|---|---|---|
| **R0 → R1** | Complete the cold-open work (rake, haul water); the rest-bar recovers enough to labour (the requirement list + story) | Charity bought a pallet, not a place — and two hands have just quit for the lowlands. Raking proves he'll work despite his state → casual day-labour, kept "by arithmetic" | Genemon *(states the terms at the board)* |
| **R1 → R2** | A stretch of reliable labour, never shirking (the requirement list); **the silent rung** — a task simply not taken back | A day-hand is a transient the house owes nothing. Reliable work no one has to re-assign proves he can be left to it → the yard's round quietly becomes his. *(Porter's-knot beat foreshadows the Origin thread.)* | *(no one — the silent rung; the house simply stops watching)* |
| **R2 → R3** | Stand the grain-store's **night watch** (the requirement list puts him at the post where the danger is) | The thin, undefended house has no guard; the willing hand holds the store at night → he is set the **grain-watch** | Kihei *(sets the watch)* |
| **R3 → R4** | Survive the **wolf** (survived, not won); then **confess the loss** at the board and **BEG Kihei for drills** | Shamed at being thrashed and honest about the loss, he asks to be trained; an understaffed house that can't hire a guard drills the willing hand it has → he becomes **the pupil** | Kihei *(the drill yard opens as his need)* |
| **R4 → R5** | Earn a place near the household's affairs — the requirement list + the **Count-night** story (Toku's packet missing) | Trusted enough to stand near the house's small valuables, he is **accused** when a packet goes missing — and the **day-book clears him**, on the record, no apology | Genemon *(the record clears him)* |
| **R5 → R6** | Proven honest at the Count — the requirement list; the first coin errand run clean | A broke house needs an honest hand at its purse more than another field-hand. Cleared and reliable, he is sent to **Yohei's stall with the house's small purse, counted back to the mon** → the **trusted hand** | Genemon *(hands him the purse)* |
| **R6 → R7** | A full career of proven work — labour, the watch, honesty, the counted purse — the requirement list **+ story** — **NOT** a pillar threshold; the **Phase-2 EXCELLENT-in-Estate gate (the 1-pillar collapse) is the separate T0→T1 tier-up** | The house has learned his hands over a whole tier. It marks that trust the only way it keeps names: **Genemon opens the day-book and writes him a use-name — GONBEI** — the hand-me-down name every Kurosawa hired man has carried — *ending Phase 1*. *(The lord is **never met** in T0: no bailiff-naming, no lord scene — the house's own steward confers the name.)* | **Genemon** *(the day-book's use-name page)* |

The capabilities **stack** (labour → reliability → the watch → honesty → the counted purse → a full career)
and the granters stay **house-side** (Genemon and Kihei — **never a lord**; the lord is not met in T0) — so at
every rung the player knows exactly *what they did* to rise. **The R7 capstone ends Phase 1** (Genemon writes
the use-name Gonbei); the
**Phase-2 Estate grind** (raise the Estate pillar to EXCELLENT — the 1-pillar collapse) is what then **tiers up
to T1** (the full-estate recovery, where Arms reveals), so the
capstone reads as earned *and* the tier-up is a distinct, deeds-driven beat.

---

## 3.3 T0 estate growth — room-by-room reveals (the separate-reveal rule, expanded)

A focused expansion of the **separate T0 room/area reveals** (bible
[`tiers/t0.md`](../../story-bible/tiers/t0.md)): the estate dashboard
**grows room by room**, each room its own reveal beat on its own trigger — never a single "estate unlocked"
dump. This is the same data (`RevealableEntry kind:'area'`) as the rungs above, surfaced here as one view so the
"rank ladder made of doors" (§1.12) is legible.

The room-by-room table is generated from the build (zones + the rung each inks
in at); the **diegetic reveal lines** are canon — read them in
`docs/content/t0-story.md` — and the estate **BUILD ladder** (the E-stages /
U-works, whose U4 completion beat lands post-R7) is §2.17's domain (ADR-145).

<!-- gen:begin t0-zone-reveals (pnpm run gen:prd-regions — do not edit inside) -->
> **The T0 zones and when each inks in, as the build ships them** — GENERATED from
> `AREAS` × `RANKS` `room-*` unlocks ([`areas.ts`](../../../src/core/content/areas.ts) /
> [`ranks.ts`](../../../src/core/content/ranks.ts)) by `pnpm run gen:prd-regions`;
> **do not edit between the markers**. Identity + reveal binding only — the diegetic
> reveal lines are canon (`t0-story.md`), kept out. Adding a zone or moving a reveal
> without regenerating turns the `gen-prd-regions` gate RED.
>
> | Zone | Label | Revealed |
> |---|---|---|
> | `weir` | The weir & riverbank | on the board from the open |
> | `weir-reeds` | The weir reeds | inks in at **R3** |
> | `gate` | The gate & gateyard | inks in at **R1** |
> | `forecourt` | The forecourt | on the board from the open |
> | `woodshed` | The woodshed | inks in at **R1** |
> | `kitchen` | The kitchen threshold | on the board from the open |
> | `shrine` | The shrine-alcove corridor | inks in at **R5** |
> | `kura` | The kura & grain-store | inks in at **R3** |
> | `sickroom` | Sōan's sickroom | on the board from the open |
> | `drill-yard` | The drill yard | inks in at **R4** |
> | `paddies` | The home paddy & vegetable rows | inks in at **R1** |
> | `field-margins` | The field margins | inks in at **R2** |
> | `woodlot` | The woodlot edge | inks in at **R2** |
> | `ruined` | The ruined compound | locked scenery (visible, never walkable) |
> | `orchard` | The overgrown orchard | inks in at **R5** |
> | `grove` | The bamboo grove | inks in at **R7** |
<!-- gen:end t0-zone-reveals -->

> **Binding:** each is a diegetic beat; building/recruiting is **flavour / light systems wired to the reveal bus
> — NOT a people-management sim** (no assignment panel, no labour-gang; §2.17). A **first hired hand**
> joins at the E1 seam as a **light roster card** (the future "teach from zero" mirror), announced as a beat, not
> a managed unit (cast per [`04-cast.md`](../../story-bible/04-cast.md)). The kura is also the **storehouse / bank**: **coin and rice** split **carried** (on your person, at risk
> to a lost fight's bite) vs **banked** (sheltered in the kura, safe from the bite — the kura shelters both coin and stored rice, though **storing rice there now carries a cost**: **ADR-118**, mechanism TBD). Once combat makes a loss bite carried
> coin (R3), you **deposit / withdraw at the kura** — only while standing there — to shelter it; the balance
> shows everywhere (your safe reserve is worth seeing on the road), but the action is **kura-only**, so fighting
> far from home with a full purse is the gamble.

---

## 3.3.5 T1 — The estate's full recovery — `R0 → R7` (its own fresh ladder)

> **What this tier IS.** T1 is the **full-estate grind** — the estate's LAND, the second half following the
> household T0 (§3.2). It runs its **own fresh `R0→R7` ladder** (the old `R8–R15` numbering is dead
> everywhere). Where T0 showed each system **in miniature** and was **floor-exempt**, T1 is the **real
> grind**: the **≥30-min-per-rung floor binds from here**. The estate climbs **E1 Stabilising → E2
> Recovering**. **The first ascension (T0→T1) always lands BIG**, regardless of grade. Full detail — beats,
> cast, and the register / Munemasa spine — lives in the bible sheet
> [`tiers/t1.md`](../../story-bible/tiers/t1.md).

> **The pillar reveal — Arms 武威 joins.** T1 is where the **Arms pillar reveals** and its **DEEDS first
> bank** (Phase 2). Combat-as-*activity* already lived in T0 (the humbling R3 fight); now the **recognised
> martial DEED** counts toward a standing for the first time. So T1's Phase-2 gate is the **first 2-pillar
> profile** — the scaled grade-gate over **Estate + Arms** (**1 GREAT + 1 EXCELLENT**, both ≥ GOOD).
> Office/Name stay **locked silhouettes** (Office reveals at T2, Name at T3).

**T1 is the SAME two-phase motion as T0 (§3.0.1).** **Phase 1** = climb `R0→R7`, each rung an **AND-gate**:
the per-rung rung-meter / requirement list **AND** the rung's story milestones; **pillar DEEDS do NOT accrue in
Phase 1**. The capstone **R7 OPENS Phase 2** — the **Estate + Arms** grind to the 2-pillar hybrid gate — and
**clearing it opens the valley (T2 / §3.4)**.

**T1's reveals:** the **Arms pillar 武威** + its **DEEDS** (Phase 2); the **2nd weapon LINE — the sword** on a
Combat-Rank rung (roster **+3 across the tier**; a house achievement, not a market buy); the **rice-and-coin
flywheel branches** into **LAND / TREASURY / TRADE** (trade **≤⅓**; the concrete village silk-market waits for
T2); the **first paid retinue** as a light roster card; the **DEBT PANEL unlocks** on the tally-keeper rung
(the number that has ruled every scene since T0-R1, finally seen); the estate **build advances E1→E2
"Recovering"** as a Phase-2 beat (gated on the pillar-Influence floor, not the rungs; §2.17/§4.7.5).

| Rung | Title | The beat (bible `tiers/t1.md`) |
|---|---|---|
| **R0** | The field-hand | Out the gate with the paid crews — land beyond the yard; his wage now one line among many |
| **R1** | The terrace-hand | The upper paddies his round — earned by a terrace wall re-stacked unasked after the thaw |
| **R2** | The woodcutter | The lot and the charcoal clamp; his charcoal the first thing the house SELLS that his hands made |
| **R3** | The kura-warden | **THE KEY** — the first he has held; the memorial alcove kept wrong; **Toku at the alcove**, the real meeting |
| **R4** | The works-hand | The weir and the OLD BREACH under his hands; sent tool-first into the east wing — finds **O-Hisa** airing a room that was hers |
| **R5** | The tally-keeper | The tallies pass to him; **the DEBT PANEL unlocks** — the number that has ruled every scene since T0-R1 |
| **R6** | The foreman | The first hiring — HE states terms at the board (T0-R1 mirrored); finds **Naoyuki** among his brother's things; on the boundary fields **the wolf returns** (a DECIDE) |
| **R7** | The registered man *(capstone)* | The shoin restored board by board; **Munemasa's only scene** — the dying lord's LAST ENTRY writes him into the register; the lord dies at the seam. The **Estate + Arms** 2-pillar gate is the T1→T2 tier-up → the valley opens |

> **Milestone-level authoring of T1 — the per-rung story beats and log lines — lives in the bible sheet
> [`tiers/t1.md`](../../story-bible/tiers/t1.md) and the roadmap
> ([`../roadmap.md`](../roadmap.md), Tier T1).** What §3 fixes here: T1 = `R0→R7`, the **two-track AND-gate**,
> the **Arms-pillar reveal**, the **2nd weapon line (sword, roster +3)**, the **first retinue**, the **debt
> panel**, the **E1→E2** build, and the **capstone-opens-valley** spine.

> **Dream / mystery cadence.** A **dream/mystery beat fires at every tier seam** (T0→T1, T1→T2, …); the **full
> origin payoff stays at the Region (T3)** — the Otsuru/Tama truth (§3.6).

---

## 3.4 T2 — The estate's domain expands into the Valley (`R0 → R7`, its own fresh ladder)

> **What this tier IS.** T2 is **not** "the village track" — it is the **HOUSE rising**: its own fresh
> `R0→R7` ladder (the old `V0–V7` numbering is dead everywhere) on which the Kurosawa estate carries its name
> into the **Valley** below (the village **Asagiri**, kept — HD-27). It is **lordless** (the regency; Munemasa
> died at the T1 seam). The valley's figures **acknowledge** the estate's growing role — **the house promotes,
> never the village.** Full detail — beats, cast, the reveal — lives in the bible sheet
> [`tiers/t2.md`](../../story-bible/tiers/t2.md) (half detail).

> **The reveal + the map re-label.** THE REVEAL lands early this tier (three signals): the
> guest-house/ruin truth surfaces and the **map RE-LABELS its two labels** — *Main house → Guest house; the
> ruin → the Main house* — one log line in the day-book's voice (docket #6 / ADR-157; the nav entry is in §3.5).
> The **village reputation track opens at zero** (a parallel OPTIONAL accelerant, never the gate; docket #9 /
> §2.15). The **bandit camp** is the valley's trouble, and **T2-R5 is the first MAN the MC ever fights** — a
> staged threshold beat.

> **Inside/outside alternation — a HARD LOCK in T2 (docket #3 / ADR-154).** Every other rung the MC is
> **inside** the estate (⌂), every other **outside** in the valley (⛩). In **T2 the alternation is a hard
> lock**: an inside rung locks the world out (the estate map only); an outside rung locks the estate closed
> until the objective is done. **T2-R5 is the ONE authored crossing** — the bandits hitting the works, the
> outside forcing itself in, IS the beat. (The lock drops at T4.)

**T2 is the SAME two-phase motion (§3.0.1).** **Phase 1** = climb `R0→R7`; the capstone **R7 OPENS Phase 2** —
the pillar grind over **THREE revealed pillars: Estate + Arms + Office** (the **Office bar reveals in Phase 1**
as a story beat, but **Office DEEDS accrue only in Phase 2**). Clearing the 3-pillar gate → **T3**. The bounded
**±10% weather/festival mechanical layer** (§2.14), the **component/quality crafting** system, the **inn
rumours board**, and the **silk/sericulture *meibutsu*** market first appear this tier. Estate stage: **E1
Stabilising → E2 Recovering**.

| Rung | ⌂/⛩ | Title (bible `tiers/t2.md`) | The beat |
|---|---|---|---|
| **R0** | ⛩ | The messenger | Sent to the village with the house's name in his mouth; the well goes quiet (the stranger's surcharge); **Sayo** stops dead — "Tama? You're alive?" — the Tama thread ignites; the reputation track opens at zero |
| **R1** | ⌂ | The works-hand of the outer court | The ruin's outer domain opens as a WORK SITE — clearances, the gatehouse scaffolded |
| **R2** | ⛩ | The dues-carrier | The payment road; sealed among the dues, **Genemon's silver** — his T1 tally-eye notices the line that doesn't map |
| **R3** | ⌂ | The steward's shadow | Genemon folds him into the stewardship proper (the T5 succession's long root); the missing-years stubs sit in reach, unexplained |
| **R4** | ⛩ | The market-man | The house sells through him — charcoal, terrace surplus; each honest deal shaves the surcharge |
| **R5** | ⌂→⛩ | The works-master | The gatehouse RAISED; **bandits hit the works — the first MAN he ever fights** (the alternation's one authored crossing) |
| **R6** | ⛩ | The house's voice | He speaks for the house at the headman's table; the bandit camp is answered as a CAMPAIGN |
| **R7** | ⌂ | The yard-officer *(capstone)* | Daily operations his; the regency leans on him in fact; the house has bones again. The **Estate + Arms + Office** 3-pillar gate is the T2→T3 tier-up → the Region opens |

> **Earned-transition spine (T2).** As at T0 (§3.2.1), no rung is granted for free: each is a rung-meter /
> requirement + story AND-gate, the **granters are HOUSE-side** (the regency / **Genemon**), the valley's
> figures merely **acknowledge**. The per-rung why-it-happens fiction lives in the bible sheet
> [`tiers/t2.md`](../../story-bible/tiers/t2.md). The **village reputation web** runs alongside as a parallel
> **optional** accelerant (~10–15% off the climb; §2.15) — it **never** gates the spine.

---

## 3.5 The navigation / screen-reveal track (the multi-screen shell, made explicit)

The UI shell **appears single-screen and grows into multi-screen navigation** (§2.1b; §1.12). Because
this is the *signature* "UI as progression" feature, the nav chrome itself is laddered here as its own reveal
sequence (data: `RevealableEntry kind:'navLink'|'screen'`). It cross-cuts the tier ladders above. The tab set
is the **seven-tab IA — Work · Map · Estate · Inventory · Character · Combat · Quests** (**ADR-119**, reinstating
Quests' own tab (**ADR-037**) and superseding **ADR-112**'s six-tab lock; one capability per thematic tab, the
earlier per-activity-tab framing still superseded — and **Crafting stays a SECTION, not a tab**) — and each tab
is its **own one-per-beat reveal**, never batched (the tab layout + each capability's home are `ui-design.md`'s
domain; §3 owns the reveal order).

| Nav / screen reveal | Trigger | What appears | Diegetic event-log line |
|---|---|---|---|
| **(none) — single column** | cold open → R1 | Just the event log + verb(s) + the two readouts. **No nav exists yet.** | *(no nav line — there is only one place to be)* |
| **The nav appears: Map + Estate** | `RANK` R1 (`room-gate` / `panel-estate`) | The **first navigation appears** — *Work* is joined by the **Map** (the walkable node-map, nav's sole home) and the **Estate** improve card, the moment ≥2 tabs qualify. | *(diegetic lines are canon — `t0-story.md`)* |
| **"Character" tab** | `RANK` R2 (`tab-skills`, §2.7) | The **Character** tab joins — **Skills first** (a Character *section*, not its own tab); attributes, the combat level and the Bestiary split in at R3. | *(canon — `t0-story.md`)* |
| **"Combat" / "Yard" tab** | `RANK` R3 (Combat panel, §2.8) | A **Combat** nav node joins Work + Skills (drill yard + Bestiary live under it). | *"There is fighting to track now, too."* |
| **"Inventory" tab** | `RANK` R3 (Equipment & belongings, §2.10) | A **top-level Inventory** tab joins the R3 wave — the storehouse + equipment + belongings (**staggered to R3** per **ADR-119**; no longer sharing R1 with Map/Estate). | *"What you carry — and what you've stored — now has a page."* |
| **"Quests" tab** | `RANK` R5 (Quest log, §2.12 — **ADR-119**, Quests regains its own tab) | A **top-level Quests** nav tab opens as **its own R5 beat** (kept out of the R3 combat wave — ADR-037's cadence) — the quest log, its own page; the T0 starter set (PEST/HUNT/CLEAR/DEFEND — a starter set, not a cap) fills out here. | *"The work that finds you now has a page of its own: jobs taken, jobs done."* |
| **Crafting SECTION** | `RANK` R4 (Crafting, §2.11) | The **Crafting SECTION** opens — a **section, NOT a top-level tab** (**ADR-119**) — the simple loot→craft loop at the estate forge, living under an existing tab (its home is `ui-design.md`'s call). | *"A bench, a hammer, a handful of stock. A place for making things appears."* |
| **The map fills in** | `RANK` R1→R7 (`room-*` reveals) | The **Map tab is live from R1** (the survey-sheet ezu — ADR-151); zones **ink in rung by rung** per the generated §3.3 table, the road past the gate arriving with the late rungs (the tier-expansion seed toward the valley). | *(canon — `t0-story.md`)* |
| **House-Influence panel (on Estate)** | `RANK` R3 tease (`panel-house-influence`) → **R7 opens Phase 2** (`t0-capstone`) | The **House-Influence panel joins the Estate tab at R3** — the **Estate** bar lit, the other three **locked silhouettes** (no dedicated House screen ships). The **R7 capstone opens Phase 2**: the Estate pillar's deeds start accruing and the same panel becomes the page on which you **raise the house itself** (Arms joins at T1). | *(canon — `t0-story.md`)* |
| **Map RE-LABEL — the guest-house/ruin reveal** | `STORY` T2 (the third signal; docket #6 / **ADR-157**) | The **map redraws its two labels** — *Main house → Guest house; the ruin → the Main house* — a watched surface changed once, composed (TST2). No new screen; the existing Map re-renders in the day-book's voice. | *"The day-book, in its own hand: what we called the main house was only ever the guest house. The ruin on the hill is the house."* |
| **"Village" screen** | `RANK` T2-R0 (T2 opens) | A **Village** screen (shop row, reputation web, inn) joins the nav. | *"A new page: Asagiri, and everyone in it."* |
| **"Region" screen** | `RANK` T2-R7 / `STORY` T2→T3 | A **Region** screen (the cluster map, the post-town, the roads) joins the nav. | *"The map grows a page wider: the region."* |
| **"Ties" / Origin screen** | `STORY`+`PILLAR` T3-R2 Origin side-track opens (doubly-earned) | An **Origin / Ties** screen (the Sawatari-juku contacts + the **Origin reputation side-track**, §3.6). | *"A page you didn't know you'd been missing: people who knew your name."* |
| **"Castle-town" screen** | `STORY` T3→T4 *(stub in v1)* | A **Castle-town** screen **stub** — the **Daikan's-Office / castle-town first-contact cliff-hanger** (the racket's nerve-centre teased, no porter-guild framing). This **stub is the bounded "v1 complete" ending surface** (§3.7.0) — after it, free-play continues (tier HELD at T3-complete; no empty T4). | *"A page opens onto stone walls and a magistrate's seal — the castle-town invites the house in — and then the story pauses."* |

> **Responsive note (§6.9):** on mobile the same nav reveals collapse into a bottom tab-bar / drawer
> that **grows the same number of entries in the same order** — **not** hover-dependent. The reveal *data* is
> shared; only the chrome differs (§6.9).

### 3.5.1 The combat-reveal ladder (combat functionality + the weapon roster, staggered)

Combat is a real **incremental progression surface**, not a single switch flipped at T0 — so its functionality
and its weapon roster reveal on their **own laddered track** (parallel to §3.5's nav track), **one reveal per
beat**. Numbers/params → §4.6; the roster table lives at §2.10.1 / §4.6.9 / `content/items.ts` (§6.5).

**(a) The functionality-reveal cadence (one beat at a time):**

| Beat | Trigger KIND | What reveals |
|---|---|---|
| **R3** | combat rung (`STORY`/`RANK`) | The **carrying-pole** (your crude improvised starting weapon) + the **auto-resolve HP-attrition loop** — **HP ACCUMULATES between fights, NO auto-heal; you mend only by EATING** — in **two auto-modes per foe** (**fight-to-death** / **auto-retreat @~20% HP**; a flee costs nothing but you're hurt and the autopilot stops) + the **loss bite** (0 HP → HP→1, ~20% of carried **coin** + ~⅓ of carried materials lost — the **koku standing is immune** — **coin and rice banked in the kura are safe**, autopilot stops) + the **Bestiary**. The character (combat) **level** begins (kills → combat-XP only). Combat stats start near-zero. The **satiety→combat throttle** ("eat before you fight") is live from here. |
| **R4** | loot→craft loop (`RANK`) | **Graded weapon-durability bands** surface with the simple Crafting loop (shown in the **Inventory/Equipment** tab already opened at R3, §2.10) — a **4-band** scale (75%+ / 50%+ / 1%+ / 0 → multipliers per §4.6.1c); a weapon degrades but is **NEVER auto-unequipped**. The **first found/crafted weapon** joins the roster here. |
| **R5** | combat rung (`RANK` Combat Rank) | The **stance** slot on the Combat panel — the **glass-cannon ↔ tank** choice (aggressive: deal more, take more; defensive: take less, deal less). *(Curated combat activities now feed the **Combat Rank** rung-meter; the **Arms PILLAR deeds do NOT accrue yet** — Phase 2.)* |
| **First weapon-line L10 milestone** | weapon-skill milestone (`FIRST-USE`/`STORY`) | The **ability + item** intervention slots unlock. |
| **T1** (a full-estate combat rung) | combat rung (`RANK` Combat Rank) | The **2nd archetype line — the sword** opens on a Combat Rank rung-gate. |
| **T2** (a Valley combat rung) | combat rung (`RANK` Combat Rank) | The **3rd archetype line — the Staff / polearm** opens (**T3 Region adds no new line, only depth**). |

**(b) The weapon roster growth.** New weapons are **FOUND and CRAFTED, never gifted**, and reveal
one at a time on the cadence above. **T0 ships THREE weapons — the carrying-pole you start with, plus 2 more
found/crafted across the tier** (at least one craftable); the roster grows **+3 at T1** (the full estate — the
**sword** line) and **+4 at T2** (the Village — the **Staff** line; **T3 Region adds no new line, only combat
depth**) — **~9–10 weapons across v1**, spread over **3 archetype lines**, each weapon an **archetype** (its
`baseSpeed` / `reach` / `targetCount` / `attackProfile`) **+ a signature ability** (the crude **carrying-pole is
the 0th IMPROVISED starter**, not a line; §2.10.1). Signature abilities deepen at higher weapon-line milestones
(~L25 / L50).

| Reveal point | Roster growth | Trigger KIND |
|---|---|---|
| **T0-R3** | you fight with the **carrying-pole** (the improvised starter) | combat rung (story) |
| **T0-R4** (loot→craft loop) | **+1** — the first **found/crafted weapon** (at least one T0 weapon is craftable; §7.2.0) | loot→craft loop (`RANK`) |
| **T0-R6** + a 2nd T0 beat | **+1** more — the **3rd T0 weapon** (completing T0's roster of three) | character-level / weapon-skill milestone |
| **T1 (full estate, a combat rung)** | the **2nd archetype LINE — the sword**; **+3** across the tier's rungs | combat rung (Combat Rank) |
| **T2 (the Valley, a combat rung)** | the **3rd archetype LINE — the Staff / polearm**; **+4** across the tier's rungs | combat rung (Combat Rank) |

These feed the **THREE clean tracks** (§2.8.1/§3.0.1), never one fused bar: a weapon improves the **character
(combat) level**'s damage and enables more **Arms** deeds (Phase 2), while the **Combat Rank rung-meter** is fed
only by curated per-rung activities. The **T0-starts-with-the-pole / +2/+3/+4 cadence, the 3-line shape, the
FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are canon, not levers (§4.6.9).

---

## 3.6 T3 — The estate's domain expands to the Region (`R0 → R7`, its own fresh ladder)

> **What this tier IS.** Like T2, T3 is the **HOUSE rising** — its own fresh `R0→R7` ladder (the old `G0–G7`
> numbering is dead everywhere) on which the estate's standing climbs to leading a **Region** (a cluster of
> valleys, the post-town **Sawatari-juku**, the upstream ruins, the roads & *sekisho*). The house promotes;
> the region's figures **acknowledge, contend with, and cede**. The alternation **HARD LOCK still holds**
> (docket #3). Full detail — beats, cast, the rivals — lives in the bible sheet
> [`tiers/t3.md`](../../story-bible/tiers/t3.md) (half detail).

> **The origin, and the Tama payoff.** T3 carries the ORIGIN mainline: the MC is **Tahei**, a kaidō porter a
> **landslide** took into the river — no flight, no guilt, no grave; his family assumed him **missing, never
> dead**, his origin register entry **kept open** by their refusal (the second unstruck line, mirroring
> Katsuhide's upstairs). The **Otsuru/Tama truth resolves on the SPINE** (guaranteed for every player — Tama
> was a girl who ran, found grown as Otsuru; the MC is **not** her).

**T3 is the SAME two-phase motion (§3.0.1).** **Phase 1** = climb `R0→R7`; the capstone **R7 OPENS Phase 2** —
the four-pillar grind over the **revealed** pillars (**Name** reveals at T3, joining Estate + Arms + Office),
drifting toward **Estate + Office** dominant (the "win it socially" steepening, §4.1). Clearing it → **T4**.
Estate stage: **E2 Recovering → E3 Prosperous**.

| Rung | ⌂/⛩ | Title (bible `tiers/t3.md`) | The beat |
|---|---|---|---|
| **R0** | ⛩ | The road-guard | The house's surplus pushed past the valley; the region's roads to secure |
| **R1** | ⌂ | The quartermaster | The house's far-supply held from inside |
| **R2** | ⛩ | The caravan-master | The post-town trade; the **origin reputation side-track OPENS here** (below) |
| **R3** | ⌂ | Keeper of the far-ledger | The region's accounts kept under the house's seal |
| **R4** | ⛩ | The rumor-follower *(the origin mainline)* | The threads of the region — and of Tahei — followed |
| **R5** | ⌂ | The inner-wing warden | **The ruin's inner domain opens — the sealed storerooms: the BURIED TRUTH reachable** |
| **R6** | ⛩ | The expedition-leader | The region led in the field; the **Otsuru/Tama truth resolves on the spine** |
| **R7** | ⌂ | The house's factor *(capstone)* | The house recognised as the region's leading house; the **Estate + Arms + Office + Name** 4-pillar gate is the T3→T4 tier-up → the castle town invites the house in |

> **SIDE-TRACK — the origin reunion at Sawatari-juku (OPTIONAL; docket #9 / ADR-160).** Tahei's **living**
> origin community is a **reputation side-track**, **NOT a parallel rung ladder** — the old `O0–O5` rung track
> is dead; the origin is a **reputation track** like the village's. It **opens at R2** (doubly-earned:
> dream-memory **AND** travel-standing), is fully completable, an accelerant, and **NEVER gates the spine**.
> **Returning MEMORY grants ZERO retroactive bonus** (access only); the present-day relationships built — the
> pride/morale buff, the origin trade-ties (~10–15% speedup) — are earned mechanics that stay. The **reunions**
> (father **Jinpachi** among them) and **Tahei's name-reclaim** land on **this** track — **earned and
> MISSABLE**; a player who skips it still gets the spine's Otsuru truth at R6, but never the name-reclaim or
> the buff. Full arc: [`tiers/t3.md`](../../story-bible/tiers/t3.md).

> **Earned-transition spine (T3).** As at T0/T2, no rung is granted for free; the granters stay **HOUSE-side**
> (Genemon / the regency), the region's figures acknowledge and cede. The village web (T2) and the origin
> side-track run alongside as **optional** accelerants — neither ever gates the spine.

---

## 3.7 T4 / T5 / T6 — the forward frontiers (stub + roadmap)

Per v1 scope, **T4 is a stub cliff-hanger** and **T5 / T6 are the forward roadmap frontiers.** Each is its own
fresh `R0→R7` ladder (T6's rungs the HOUSE's Edo standing, `H0→H7`); the later reveals (**auto-producers**, the
**marriage/adoption lever**, the **national *banzuke***) have an explicit home, and the detailed rung authoring
belongs to those tiers' bible sheets ([`tiers/t4.md`](../../story-bible/tiers/t4.md) ·
[`tiers/t5.md`](../../story-bible/tiers/t5.md) · [`tiers/t6.md`](../../story-bible/tiers/t6.md)).

> **Same spine, three more frontiers.** T4–T6 carry the **same SEQUENTIAL two-phase per-tier motion** as T0–T3
> (§3.0.1): the **estate's domain expands again** — **+ the castle town** (T4) → **the domain / han** (T5) →
> **Edo / national** (T6) — and **every rung stays in the house's theme** (the house becoming a castle-town
> power, then a domain steward's seat, then a nationally-ranked house — **NOT** the MC climbing those societies;
> their figures **acknowledge, contend with, and cede**), and **only the estate spine gates tiers**. The
> **estate-rep arc**: **honorary member** (entering T4) **→ chief steward / *yōnin*** (T4 — the MC's personal
> **CEILING**), and it **stays there**: at T5–T6 the arc is the **HOUSE's** standing — mediated, the *house*
> ranked, **never** a personal *hatamoto* / shogunal rise. **The inside/outside HARD LOCK DROPS at T4** — free
> travel everywhere from here (docket #3).

### 3.7.0 The v1 ending — a bounded "v1 complete" surface, THEN free-play

> **v1 terminates on a real, bounded closure — not a dead cliff-hanger.** When **T3's Phase-2 hybrid profile
> clears**, the **castle-town first-contact** (the "stone walls" beat — the **Castle-town screen STUB**, §3.5 /
> §3.6 R7) renders as an explicit, authored **"v1 complete" ending surface**: it **acknowledges the run has
> reached its v1 frontier** (the house leads its region; the castle-town confers regional leadership and invites
> it in; *"the story pauses here — for now"*). The cliff-hanger becomes a **surface, not a stat-wall.**
>
> **THEN free-play continues (the active loop keeps running).** After the v1-complete surface, **play does not
> stop**: the tab-open auto-resolve + auto-repeat loop runs on, and the **tier is HELD at T3-complete** — the
> player may **finish the side-tracks** (the village reputation web, the origin reputation side-track incl. the
> missable name-reclaim), **push pillars past their gate floors** (the FLOOR-not-ceiling design, §3.0.1(6)), and complete
> the bestiary / weapon roster. The **post-gate clock/accrual policy is defined**: the world-clock keeps ticking,
> deeds still accrue, **NO decay-tax, NO reset** (§3.0.1(6)).
>
> **v1 commits NO empty T4.** §3.7.1–§3.7.3 below are **forward shape only** — the T4/T5/T6 `R0→R7` (and T6's
> `H0→H7`) ladders are roadmap *shape*, never shipped-empty content; v1 does **not** open a playable-but-hollow
> T4. v1 terminates on a
> **reachable closure** with a **defined post-gate clock/accrual policy** (above), not merely the absence of T4.

### 3.7.1 T4 — The Castle Town: the campaign (stub; `R0 → R7`, forward)

> **What this tier IS (sketch).** T4 is the **HOUSE rising** into a **castle-town power** — its own fresh
> `R0→R7` ladder (the old `C0–C7` sketch numbering is dead). It is the tier with a **FACE for an enemy**:
> **Lord TOMITA**, the martial castle-town lord whose hands are in the house's old wounds. **Katsuhide is
> found** and renounces in writing (R3–R4, the finder → the witness); **Shinnosuke** is named heir; the
> campaign ends with the house **TAKING the castle town**. The inside/outside **hard lock DROPS** — free travel
> from here. **v1 ends on the ENTRY to this tier** — the castle-town first-contact cliff-hanger (§3.7.0). The
> MC's estate standing climbs **honorary member → chief steward / *yōnin*** (his personal CEILING). Full
> sketch: [`tiers/t4.md`](../../story-bible/tiers/t4.md) (quarter detail).

Ladder shape (forward): **envoy → petitioner (the humiliation rung) → … → breaker → the under-steward** (the
town's charge held; the R7 capstone). Required pillars drift to **Office + Name dominant** (the takeover is
**won socially**; Arms/Estate as leverage) — a **MULTI-ROUTE** takeover (office / economy / **marriage** /
out-maneuvering rivals **and** martial-security leverage); "taking over" = becoming the **dominant house
holding key domain offices**, **never rebellion**. **AUTO-PRODUCERS first appear** here (§2.5, T4+ only — light
roster cards, no assignment panel) and **THE MARRIAGE / ADOPTION lever** (§2.16.1, T4+ only — a one-time Office
+ Name jump and a takeover route, not a relationship sim). The Phase-2 Office+Name hybrid profile is the T4→T5
tier-up.

### 3.7.2 T5 — The Domain: the audience-day inversion (NEW; roadmap; `R0 → R7`, forward)

> **What this tier IS (sketch).** T5 is the **HOUSE** administering a broken **Domain (han)** as caretaker —
> its own fresh `R0→R7` ladder. **THE RUNG-UP INVERTS:** where every prior tier sent the MC OUT to earn a
> rung, here **each rung is an AUDIENCE-DAY in the restored audience hall — the domain summoned to HIM**, a
> widening circle of petitioners (the petition is the content). Beneath it: the **stewardship succession** —
> Genemon failing, the handover, the chair — and **Shinnosuke's** formation (adopted, learning, nearly ready).
> It ends at **THE STEWARD** (the chair; the silver-secret formally handed over). Full sketch:
> [`tiers/t5.md`](../../story-bible/tiers/t5.md) (fifth detail).

Ladder shape (forward, the inverse rung): **surveyor → deputy-steward → bearer of rice → keeper of the
day-book (Genemon hands him the book) → hearer of the near villages → the right hand of the regency → hearer of
the domain → THE STEWARD** (R7 capstone). The MC **stays *yōnin*** (his ceiling, reached at T4); what climbs is
the HOUSE's standing. Zones: the castle town (home-adjacent), the port town, the mountain town, 20+ named
villages (a handful visitable).

### 3.7.3 T6 — Edo: the house's ladder (reserved; `H0 → H7`)

> **What this tier IS (reserved).** T6 is **deliberately RESERVED** — the game-within-a-game, the no-prestige
> pseudo-prestige act; nothing has crept in. Personal rungs retire: **the rungs become the HOUSE's Edo
> standing, `H0→H7`** (H0 = a name nobody in Edo reads; H7 = the provincial house recognised at the capital).
> **Shinnosuke is lord**; the MC remains the house's architect, off-stage from any shogunal audience (the
> indirect / mediated ceiling — the *house* ranked on the national *mitate* / parody *banzuke*, never a
> personal *hatamoto* rise; §2.18). Full (reserved) sketch:
> [`tiers/t6.md`](../../story-bible/tiers/t6.md).

> **The whole ladder is the same motion, seven times:** arrive minimal → the world fades in one
> panel/area/system at a time, each a logged plot beat → climb the rungs (Phase 1) → grind the house's pillars
> (Phase 2) → the canvas and the numbers enlarge together → a fresh `R0→R7` ladder is minted for the next,
> larger frontier (its subject the HOUSE's own standing by T6). **No reset, ever.**

---

## 3.8 Cross-references & deferrals

- **Numbers → §4** (combat/progression/balance): every rung threshold, pillar threshold, the fixed
  coin-denomination rates, cost
  curve, soft-stamina rate, market-saturation rate, and the **K/M/B** formatting rules are deferred. §3 fixes the
  **order and the triggers' kinds**, never the values. Specifically deferred to §4:
  - the **rung-meter accrual curve + the per-rung thresholds** (per-rung-reset; back-solved from the ≥30-min
    floor × each rung's curated-activity rate) — **§4.1.1**;
  - the **fixed coin-denomination rates** (one underlying base unit **mon** 文: **1 monme = 80 mon**,
    **1 ryō = 50 monme = 4,000 mon**; no moneychanger, no floating forex) + the wealth thresholds at which each
    higher denomination (monme → ryō) is first **revealed** — **§4**;
  - the **koku-standing assessment function** (`seasonalJudge` — the House's four-pillar Influence re-expressed
    as a kokudaka-like **koku score**, never spent, not an income multiplier; re-assessed each season and, with
    the "the assessors arrive" event, at each tier jump) + the **tier→koku ladder bands** (provisional/liquid) —
    **§4**;
  - the **rice season-price curve** — the seasonal swing in the coin price rice sells for (rice is a real
    resource: eaten for satiety, stored in the kura, or sold for coin) — **§4**;
  - the **Phase-2 HYBRID tier-gate thresholds**, per-pillar-per-tier (the good/great/excellent bands + the
    great/excellent counts; T0 the 1-pillar special case — the gate collapses to one EXCELLENT; **NO overflow**) — **§4.1**;
  - the **combat-reveal-ladder weapon params + signature abilities** (per-weapon `baseSpeed`/`reach`/
    `targetCount`/`attackProfile` + signature; the +2/+3/+4 roster, ~9–10 across v1) — **§4.6.9**;
  - the **graded durability bands** (the 4-band multipliers, fixed wear-per-fight, never auto-unequip) —
    **§4.6.1c**, and the **satiety→combat throttle** coefficient — **§4.6.1b**;
  - the **character (combat) level curve** (`hpMax = 40 + 8·characterLevel`, satietyMax growth, +1 attr/2 lvl,
    on-kill XP = `MobDef.level·COMBAT_XP_K`) — **§4.4/§4.6.1/§4.6.5**.
  - **Determinism:** any §3-implied curve obeys the **`Math.pow` ban in core (integer-pow only)** so reveals fire
    byte-identically cross-engine (§6).
- **Final log-line wording → §5 authenticity pass** (macron romanization). The **Office** pillar's (ADR-159 rename from "Standing & Office")
  kanji is **官威 (*kan'i*)**. §3 fixes the **substance** of each `revealLogLineId`;
  copy may be polished. *("Standing" means the 官威 pillar; the martial rung-meter is **Combat Rank**.)*
- **Data shapes → §2 / §6:** every reveal is a `RevealableEntry` with a pure `unlockPredicate` over `GameState`,
  fired via the `process_rewards` bus as one event (§2.1, §6.3); the renderer does one `render(state)`
  reconciliation showing only unlocked entries (§6.9); every reveal is **headlessly regression-testable** via
  the DEV play API (`window.__qa`, §2.20, §6.10) — the unlock ladder is a generated/verifiable table (§6.6).
  **There is NO `revealQueue` field in `GameState`** — staggering is a design property of the authored schedule,
  not stored runtime state (§2.1/§6.4).

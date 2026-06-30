# §3 — Incremental Unlock Ladder (UI-as-progression)

> **PRD V2.3 — reshaped per the V2 decisions (D-022 governing; Block L `Q1–Q56` + Block M `FU1–FU23`).** Authored
> end-to-end from the LOCKED CANON
> ([`locked-decisions.md`](../../../project/brainstorms/2026-06-25-locked-decisions.md), incl. all
> three "Updated 2026-06-25" header blocks), the merged PRD §1, §2, §5, §6, **and the 79 human-signed V2
> decisions**. This section makes the **signature feature** concrete: it specifies the **ordered reveal of every
> panel, tab, screen, system, resource-row, and area** across the game — **T0–T3 in full (v1)** (the old Estate
> tier **SPLITS** into a **tutorial T0 `R0→R7`** + a **full-estate T1 `R8→R15`**; T2 = the Village `V0→V7`, T3 =
> the Region `G0→G7` — D-048). T0/T2/T3 are authored in full here; **new-T1 `R8→R15` is established as a forward
> sketch with placeholder rung titles** (full rung-copy deferred), with **T4/T5 sketched**. It references the §2
> systems by name and **defers all exact numbers to §4** (thresholds, costs,
> curves, conversion weights) *(proposed v1 balance)*.
>
> **Canon honoured throughout:** grounded / no-magic; mediocre-start (no hidden edge of **birth, gift, or
> memory** — but **trained labour skills DO** grant small, bounded combat perks, Q6/FU8); **the core loop is the
> MC's own actions, NOT a management sim**; the four-pillar House Influence (Arms / Estate & Wealth [trade ≤⅓] /
> Standing & Office / Name & Honour) with **achievement-jumps + per-season judged results**, **up-only + minor
> recoverable dents** (with a small below-high-water seasonal **self-heal** that never advances the high-water,
> Q32); the tier-up gate is the **scaled grade-gate** (`1 EXCELLENT + 1 GREAT + (N−2) GOOD` over the N revealed
> pillars, all ≥ GOOD; T0 collapses to a single EXCELLENT; **NO overflow** — the old "simple per-tier
> required-pillar thresholds" framing is **superseded**, Q7/FU10/D-028 scaled by D-049); progression is **SEQUENTIAL per tier**
> — climb the rungs (**Phase 1**), THEN grind the estate's pillars (**Phase 2**), THEN tier-up (§3.0.1, FU7);
> combat is **THREE clean separately-stored tracks** (character level · the Arms pillar · the Combat Rank
> rung-meter — §2.8.1/§3.0.1, FU14) and **INCREMENTAL** (T0 starts with **one weapon**, a growing **~9–10**
> roster, +2/+3/+4 per tier, surfaced one-at-a-time on the **combat-reveal ladder** §3.5.1 — Q15/FU13); combat
> first-class & **EARLY (T0-R3)**, satiety-throttled ("eat before you fight", Q31/FU16); tiers **T0–T5** with
> per-tier story gates; a **fresh rank ladder PER TIER**; **full maps every tier**; **active-only / no offline**
> (the "leave it running, check the progress" feel = **tab-open auto-resolve + auto-repeat labour**, FU23);
> abstract clock; **fractal incrementality** with **design-staggered one-at-a-time** reveals (the schedule is
> *authored*; there is **no runtime reveal-queue** — FU4 supersedes Q17's "serialize into a queue"); LEAN /
> high-impact, immediate-vs-later; **auto-producers T4+ only**; the **~28.5 h v1 budget is a FLOOR/minimum**, a
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
| **RANK** | a **Phase-1 rung** reached (a fresh ladder per tier: T0 `R0–R7` (tutorial), T1 `R8–R15` (full estate), T2 `V0–V7`, T3 `G0–G7`) | the rung's **per-rung-reset rung-meter** — **Estate Service** (labour) or **Combat Rank** (martial; *renamed from "Combat Standing"*, Q9) — crossing its threshold (back-solved from the **≥30-min-per-rung floor** × that rung's curated-activity rate) **AND** the rung's **story milestones** (an **AND-gate**, §2.15.1 / §3.0.1). The meter is fed by **curated per-rung activities** — *never* raw XP/kills/deeds (those feed the character level / the pillars). |
| **PILLAR** | the **Phase-2 TIER-UP gate** cleared — the **scaled grade-gate** over the tier's **revealed** pillars (Arms / Estate & Wealth / Standing & Office / Name & Honour) | the **scaled grade-gate** distribution (`1 EXC + 1 GRT + (N−2) GOOD` over the revealed pillars, all ≥ GOOD; NO overflow; §2.16/§4 — numbers → §4). Pillar **DEEDS accrue in PHASE 2 only** (post-final-rung; FU7), so PILLAR gates the **tier-up**, never an individual rung. |
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
  own **authored reveals** — the tier's **estate BUILD** completing (the estate's visible stage advancing per
  tier from **E0→E1 at T0** onward — see each tier's stage span — gated
  on the pillar-Influence floor, **not** the Phase-1 rungs; §2.17/§4.7.5/D-Q-B2), new **deed categories** opening
  (**Estate at T0, Arms at T1, Office at T2, Name at T3**), and the **cross-pillar combo** unlocking (Model-A; §4.3.1 — **partial Office-pairs at T2 Village**, the **full four-pillar set at T3 Region**) +
  the **per-season seasonal-rotation** lever (§2.14) as the anti-slump reveals. And the **per-pillar
  shortfall is surfaced EARLY + CONTINUOUSLY** from the first Phase-2 season (the lagging bar reads plainly, e.g.
  *"Name is behind"*) so a breadth shortfall is **never an end-of-Phase-2 surprise** (§2.16(b)/D-Q-breadth-wall).

**(2) The rung-meter accrual law (D-024/FU6).** Both meters are **numeric and PER-RUNG-RESET** (each rung starts
at 0). Each rung's threshold = **(the ≥30-min-per-rung FLOOR × that rung's eligible curated-activity rate)** —
**back-solved from the SAME ≥30-min floor** the §4.8 pacing model and the §6.6 gate-monotonicity verifier use, so
the meter and the floor stay in lockstep (race the curated activities and the meter is *still* short of
threshold — you cannot skip the floor). The **Combat Rank** meter is fed by **per-rung CURATED combat
activities, NOT raw kills/XP** (FU14) — kills feed the character (combat) level instead (§2.8.1). Double-counting
across streams is allowed, but **each stream sums independently** (verifier-asserted, §2.20).

**(3) The Phase-2 scaled grade-gate (D-028 hybrid gate, scaled by D-049/Q7/FU10).** Phase 2 tiers up on the
**scaled grade-gate over the pillars REVEALED by that tier** — exactly **`1 EXCELLENT + 1 GREAT + (N−2) GOOD`**
for **N** revealed pillars, all **≥ GOOD**, **NO overflow** (a surplus in one pillar can never substitute for a
deficit in another). The **revealed-pillar set grows one per tier** (D-048): **T0 = 1** (Estate — the gate
**collapses to a single EXCELLENT**), **T1 = 2** (+ Arms — **1 GREAT + 1 EXCELLENT**), **T2 = 3** (+ Office —
**1 EXC + 1 GRT + 1 GOOD**), **T3 = 4** (+ Name — **1 EXC + 1 GRT + 2 GOOD**) — and the gate is **only ever
checked against revealed pillars** (never against an unrevealed one). The only structural cap that survives is **trade ≤⅓ of Estate &
Wealth**, with cross-pillar combos computed **post-clamp** and excluded from the gate-check (§2.16/§4.3.1). The
per-pillar-per-tier thresholds are a **full §4 overhaul** back-solved against the fixed §4.2.1 deed inventory —
**numbers → §4** *(proposed v1 balance)*.

**(4) The THREE clean combat tracks (D-025/FU14/Q1).** As §3.0 notes: **one kill → character-level combat-XP**
(scales HP / satietyMax / attribute points); **one recognised deed → the Arms pillar** (Phase-2 gated); **one
curated rung activity → the Combat Rank rung-meter** (the Phase-1 martial gate). `character.level` is the only
one of the three that scales personal power; the other two are *standing*/*gate* meters.

**(5) NO stored "phase" flag.** The current phase is **derivable from the current rung** (pre-capstone = Phase 1;
post-capstone = Phase 2) — no extra `GameState` field (§6.4).

**(6) Budget = a FLOOR; the loop is active-only.** The per-tier hour budgets (**re-mapped onto the 6-tier spine
and re-derived across the 4 v1 tiers T0–T3 at §4.8** — **T0 is floor-exempt** (a ~10–15 min/rung tutorial ramp),
the **≥30-min-per-rung floor binding from T1**; **~28.5 h v1 FLOOR**) and the ≥30-min-per-rung floor are **minimums/FLOORS, never ceilings** (FU18) — pushing 1–2 pillars
to *great/excellent* in Phase 2 **extends** Phase 2 beyond its floor by design. The "leave it running, check the
progress" feel comes from **tab-open auto-resolve combat + auto-repeat labour** (active-only — FU23), **not**
from offline accrual or early idle producers (auto-producers are T4+ only, §2.5).

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

## 3.2 T0 — Estate-tutorial ladder (full; v1) — `R0 → R7`

> **T0 is the TUTORIAL tier** — the **showcase-in-miniature** half of the old single Estate tier, which **SPLITS**
> (D-048) into a tutorial **T0 `R0→R7`** and a full-estate **T1 `R8→R15`** (§3.3.5). T0 reveals each system **in
> miniature** and is **floor-exempt** (a gentle ~10–15 min/rung ramp); the real ≥30-min-per-rung grind binds from
> **T1**. **T0 reveals ONE pillar — Estate 家産** (Arms reveals at T1); its tier-up gate **collapses to a single
> EXCELLENT in Estate**, and the **first ascension (T0→T1) always lands BIG** regardless of grade (D-062).

**All of T0 is PHASE 1** (climb the rungs `R0→R7`); the **capstone R7 OPENS PHASE 2**
(the estate-influence / **Estate-pillar** grind, where the tier's pillar DEEDS first accrue — the **Estate**
pillar; Arms reveals at T1). One declining hill estate
(the Kurosawa *gōshi* house), **unlocked room by room** — and T0 room/area reveals are **SEPARATE** (LOCKED):
stables, woodlot edge, and drill yard each reveal individually, never folded into the forecourt. **Combat
surfaces EARLY at R3** (the humbling first fight) and then deepens **incrementally** along the **combat-reveal
ladder** (§3.5.1) — never a one-beat dump. Each rung promotes on the **per-rung RUNG-METER** — **Estate Service**
(labour rungs) or **Combat Rank** (martial rungs), each **per-rung-reset**, its threshold back-solved from the
**tutorial ramp** (T0 is **floor-exempt** — a gentle ~10–15 min/rung; the ≥30-min floor binds from T1) — **AND** the rung's story milestones (the AND-gate; §3.0.1, FU6/Q30). The meter is fed by
**curated per-rung activities** (a one-to-many set), **never** raw XP/kills/deeds. **No auto-producers appear**
(canon §G — early game is the MC's own active grind). The **House Influence panel reveals at R7** (its single **Estate**
bar — T0 reveals one pillar; the other three stay **locked silhouettes**) — and
that reveal is **ENTRY TO PHASE 2**: the player *climbs the rungs first*, then *grinds and sees* the standing he
builds (the **Estate** pillar's deeds accrue only from R7 on; Arms reveals at T1).

Estate stage span this tier: **E0 Foreclosure's Edge → E1 Stabilising** (§1.5.1, §5 T0.4) — the rooms reveal
across Phase 1, but **the E1 "Stabilising" BUILD COMPLETES as a Phase-2 beat** (gated on the pillar-Influence
floor, not the rungs; §3.3/§2.17/D-Q-B2).

| Rung | Trigger (rung gate) | What this rung REVEALS (in fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **R0 — Stray ("another mouth")** | `STORY` (met at the open; cold-open §3.1 complete) | The bare **diegetic estate dashboard** as a single screen (the *kura* room readout); the body/rest bar + rice counter carried from the cold open. | *"You can stand. Barely. The household calls you nothing yet — 'another mouth.'"* |
| **R1 — Day-labourer (*hiyatoi*)** | `RANK` Estate Service (complete the spilled-rice task; Chief Steward **Genemon** assigns first real work) | **The Gate & Forecourt (*genkan*)** area (the promotions stage); **The Home Paddies & Dry Fields** area; the **basic labour loop** (Farming via §2.6); the **world-clock display** (day/season tag, §2.2) appears with the *koku* heartbeat; a **sleeping-place** (rest is now safe). | *"A door slides. Genemon, dry as a husk: 'Another mouth — soft, clumsy. Earn your sleep.' He points you to the paddies. The seasons begin to turn."* |
| **R2 — Bonded hand (*genin*)** | `RANK` Estate Service (a season of reliable labour; Genemon enters you on the books) | The **Skills tab** (§2.7) — first nav tab; surfaces by-doing as XP lands (Farming first, then **Foraging / Woodcutting / Hauling**); **each skill carries a small perk track revealed by levelling it** (§2.7.1 — the bounded labour→combat channel, Q6/FU8; the incremental skill-unlock **order** is what paces it, and **conditioning stays the separate ZERO-stat gate**); **The Stables & Woodlot Edge** area (revealed *separately*); **The Near Satoyama** wilderness ring (first danger ring, conditioning-gated, §2.9 — its actual surfacing is the `FIRST-USE` reveal at the conditioning floor, see §3.3); new resource rows light as gathered (wood, *sansai*). The **porter's-knot beat** fires (Origin clue, **ZERO bonus**). | *"Your name goes on the household books. You forage the near hills, fell timber, haul loads. A groom grunts: 'Huh — you've tied that knot before.' (You don't know why.)"* |
| **R3 — Yard-hand under arms (*buke-hōkōnin*)** | `STORY` the **humbling, near-fatal first fight** (a wolf at the grain store — survived by luck, **never rescued, never skill**), THEN beg drillmaster **Kihei** for drills | **COMBAT GOES LIVE (EARLY) — but staggered, one reveal per beat** (§3.5.1, FU12; the old "drill yard + Combat panel + every slot at once" dump is retired). R3 reveals **only**: **The Drill Yard** area (one post → Kihei's rack → sparring slots); the **Combat panel** (§2.8) with the **BARE auto-resolve loop + RETREAT** (a clean escape valve — keep HP + loot, pay a modest clock cost, **never dents Influence**; Q16) — framed as the active-only **"leave it running, check the progress"** loop (FU23); the **single starter weapon** (T0 starts with **exactly one** — Q15/FU13) + **Equipment & Inventory** panels (§2.10); the **Bestiary** panel (§2.9, fills by-encounter; the **wild boar** is the first grindable threat). **"Eat before you fight":** the **satiety→combat throttle** (Q31/FU16) surfaces here — combat is satiety-gated, the first fight measured **at adequate satiety (≥~0.7)** (§4.6.6). Combat stats start near-zero; combat/weapon **skills surface** in the Skills tab. **(Stance / ability / item slots reveal LATER — R5 and the L10 milestone; §3.5.1.)** The character (combat) **level** begins here (kills → combat-XP only). | *"The wolf left you in the dirt — ribs cracked, alive only by luck. You crawl to Kihei. 'Talent is a story the lucky tell. You are not lucky. So you will work.' The drill yard opens. (Eat first, Kihei says. A starving man swings like a child.)"* |
| **R4 — Trusted hand & houseman** | `RANK` Estate Service (win **Lady Chiyo's** regard for indoor work + heir **Naoyuki's** grudging vouch — seeding the rivalry→respect arc; authored trust beats) | **The Main House / *Omoya*** interior area (kitchen, inner rooms, household shrine); the **household domestic economy** rows (textiles, kitchen, provisioning — feeds **Cooking** §2.6 and the satiety loop §2.3); the **first *shinden* reclamation** begins (a LAND lever — its recognised yield is a **Phase-2 Estate deed**, not yet accruing); the **Crafting tab** — a **TOP-LEVEL nav tab** (Q10), revealed as its own beat (§2.11, hybrid — *simple recipes first*) with the early **loot→craft loop** (Smith **Gonta**, §2.10/§2.11); **graded weapon-durability bands** surface here with that loop (a **4-band** scale; a weapon degrades but is **NEVER auto-unequipped**; Q33/FU17 — §3.5.1). **[THREAD: Tama — seed only]** the house simply sees a proven, honest hand; **no one speaks the name "Tama"** yet (the village ignites the legend at T2-V0). | *"Lady Chiyo nods you indoors. Naoyuki, bored: 'He'll do.' The inner rooms open; the first fallow plot is yours to bring back; Gonta hands you a hammer. You earned this with honest hands."* |
| **R5 — Gate-guard (*monban*)** | `RANK` Combat Rank (stand a real watch; clear first pest/animal threats; weapon-skill milestones — conditioning floor at R3) | The **Quest log** — a **TOP-LEVEL nav tab** (Q10) — opens with the **T0 CORE / starter quest set**, revealed as each is first taken: **PEST CONTROL → HUNT → CLEAR → DEFEND** (this is the *starter set, **NOT a cap*** — author whatever quest types fit each later stage; Q23). The **stance slot** unlocks on the Combat panel (§3.5.1, FU12). **DEFEND** is the activity that *will* earn **Arms** — but the **Arms pillar is not revealed until T1** (the full estate); in T0, R5 combat feeds the **character (combat) level** + the **Combat Rank rung-meter** (curated activities) only, **not** the Arms pillar yet. | *"You stand the gate, and the work finds you: vermin in the stores, a boar in the paddies, a night-watch to hold. Your sword starts to matter — not just your back."* |
| **R6 — Foreman of works (*kogashira*)** | `RANK` Estate Service (drive the *shinden* + workshops to recorded yield; house edging toward solvency) | The **Workshops** and **Granary** areas; **proto-industry levers** (the LAND/TREASURY strands whose recorded yields become **Phase-2 Estate deeds**); the **low palisade** (martial fabric); the **2nd starter-line weapon** unlocks (the T0 roster grows **+2 total** across the tier — Line 1 only; §3.5.1/§2.10.1); **errands beyond the estate are authorised — the FULL-ESTATE recovery (T1) opens after tier-up; the VILLAGE (T2) opens later, at T1's capstone** (the **tier-expansion map** seed + the road out). *(No pillar standing is "recorded" here — **Estate DEEDS do not accrue until Phase 2, post-R7**; the **Arms pillar waits for T1**; FU7.)* | *"The frame of a workshop is raised; the granary takes shape; the ledger is no longer only red. Genemon, grudging: 'Carry the house's business down to the village.' A road opens past the gate — once the house itself is set right."* |
| **R7 — Bailiff of the home fields (*jikata-yaku*)** *(capstone — END of PHASE 1 / ENTRY to PHASE 2)* | `RANK` Estate Service rung-meter **+ STORY** (first reclamation recorded; the lord names the bailiff) — **rung-meter + story ONLY**; the **Estate PILLAR profile (EXCELLENT — the 1-pillar collapse) is the SEPARATE Phase-2 tier-up gate** (below) | The **lord's study** (ledgers) in the Main House; **jobs-as-offices** begin (field administration framed as **the MC's own quests/offices — NOT a management layer**, §2.6); **THE HOUSE INFLUENCE PANEL becomes visible** (§2.16) — and its reveal **OPENS PHASE 2**: the tier's pillar **DEEDS now start accruing** (**Estate** from the *shinden*/solvency — **T0 reveals one pillar**). The panel lights only the **T0-revealed pillar** — **Estate** — its bar, the other three as **locked silhouettes** (Arms/Office/Name not yet revealed, never checked — Arms joins at T1); **cash-crop levers**; the **per-tier domain ranking** read (§2.18) first appears here as "unranked." **The T0→T1 TIER-UP** is the **Phase-2 gate** (the **1-pillar special case**: the gate **collapses to EXCELLENT in Estate**; numbers → §4) — cleared by grinding Phase-2 Estate deeds, **then T1 — the full-estate recovery — opens** (the **first ascension lands BIG** regardless of grade, D-062; the valley opens later, at T1's capstone). | *"The lord enters your name in his own ledger — bailiff of the home fields. The rungs are climbed. Now he points past them: 'The house is off the cliff. Make it *rise*.' For the first time you see what the house can become — a standing to raise. (Then: the full recovery — and, beyond it, the valley.)"* |

> **T0 deliberately withheld (fractal discipline):** the **full-estate grind** — the **Arms pillar**, the **2nd
> weapon line (sword)**, the first paid retinue, and the koku flywheel branching into LAND/TREASURY/TRADE — is
> **T1** (§3.3.5); coin/*mon* (a **T2** reveal — there is **no market in T0**, so **no TRADE strand at T0**
> either; Q29); the inn & **rumours board** / folklore (**T2**, §2.13); the
> **component/quality** crafting system (**T2+** — T0 is *simple* recipes only, §2.11); seasons/weather/**festivals**
> as a live *mechanical* layer (the *clock* shows at R1; the **bounded ±10% weather/festival** layer first
> reveals at **T2**, §2.14/Q35); **auto-producers** (**T4+**, §2.5); the **origin** track (**T3**, §2.15). The **pillar
> grind itself is Phase 2** (post-R7). Holding these back keeps the screen lean (canon §G, lean discipline).

> **T0 Phase 2 — what the back half REVEALS (not a dead consolidation half; D-Q4/D-Q-B2/D-Q-breadth-wall).**
> Post-R7 (the **Estate** Influence bar live) is itself a **reveal cadence**, not just a number-climb. As **Estate
> deeds** accrue, authored beats fire: **the E1 "Stabilising" estate BUILD completes** as a Phase-2 beat — the
> *shinden* paying out, the workshop's first recorded yield, the granary stocked, the house off the cliff (the
> estate fabric *finishing* on the influence track, gated on the pillar-Influence floor, **not** the Phase-1
> rungs; §3.3/§2.17/§4.7.5/D-Q-B2). Because **T0 reveals a single pillar (Estate)**, the tier-up gate **collapses
> to EXCELLENT in Estate** — and the **shortfall is surfaced from the FIRST Phase-2 season** (the Estate bar
> reads plainly, e.g. *"Estate is still short"*), so the floor is **never an end-of-phase surprise**
> (§2.16(b)/D-Q-breadth-wall). Clearing the 1-pillar gate (EXCELLENT in Estate) → **T1, the full-estate
> recovery** — where the **Arms pillar reveals** and the first 2-pillar gate begins; the **first ascension always
> lands BIG** (D-062).

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
  To the house you are simply a hand who keeps earning his place. The legend only **ignites in T2**, when the
  village (Sayo) names you Tama on sight (§3.4 V0) — and the estate's plain "we only ever saw a hand"
  *becomes* the counterweight to the village's certainty. (Allegiance goes live at T2; grounded, partial
  payoff at T3-G6. Kept **light** — narrative-only, never gates stats/availability, canon §C.)

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it | Granter |
|---|---|---|---|
| **R0 → R1** | Complete the spilled-rice task; the rest-bar recovers enough to work (Estate-Service rung-meter + story) | Charity bought you a pallet, not a place. Raking the rice proves you'll work despite your state → casual day-labour ("earn your sleep") | Genemon |
| **R1 → R2** | A full **season** of reliable labour to the Estate-Service **rung-meter** threshold, never shirking | A casual *hiyatoi* is a transient the house owes nothing. A whole season of reliable work proves you're worth keeping → your name goes on the books (*genin*). *(Porter's-knot beat foreshadows the Origin thread.)* | Genemon |
| **R2 → R3** | Working the wild **Near Satoyama** (an exposure/conditioning threshold) **triggers** the wolf-at-the-grain-store incident; you survive by luck, then beg Kihei (the **Combat Rank** rung-meter starts here + the survival story-flag) | The undefended house is exposed; the attack proves it. Shamed at being thrashed, you beg for drills; an understaffed house that can't hire a guard trains the willing hand it has | Kihei |
| **R3 → R4** | An authored **trust beat** — return the mislaid **debt-ledger** you could have pocketed; keep your head in the grain-store scare — plus the Estate-Service rung-meter | A broke house needs an **honest** hand near its dwindling affairs (the debt, the pawnable valuables) more than another field-hand. You've proven reliable, capable, **and** honest → Lady Chiyo brings you into the *Omoya*, strictly as a trusted servant | Lady Chiyo (+ heir **Naoyuki's** grudging vouch — seeds the rivalry→respect arc) |
| **R4 → R5** | The **Combat Rank** rung-meter — weapon-skill milestones from drilling + clearing the first pest/animal threats (curated combat activities) | You've drilled (R3) and you're trusted (R4), and the threats keep coming with still no real guard. Drilling earns a real night-watch post. *(R5 combat feeds the character level + the Combat Rank meter; the **Arms pillar reveals only at T1**, the full estate.)* | Kihei + Genemon |
| **R5 → R6** | The **Estate-Service** rung-meter — drive the first *shinden* reclamation + restart a workshop to a **recorded yield** (curated labour activities) | Solvency is the house's only survival path, Genemon is aging, and there's no coin to hire an overseer. You're the only proven **all-rounder** (labour + arms + trust) → he makes you foreman of the recovery; there is no one else, and the stakes are existential | Genemon |
| **R6 → R7** | The **Estate-Service** rung-meter **+ story** (first *shinden* recorded; the lord names the bailiff) — **NOT** a pillar threshold; the **Phase-2 EXCELLENT-in-Estate gate (the 1-pillar collapse) is the separate T0→T1 tier-up** | The works **succeed** — the house is off the foreclosure cliff, and it's materially your doing. The **Lord himself**, roused from despair, enters your name in his own ledger as **bailiff** — *ending Phase 1* — and points at **raising the house's own standing** (Phase 2 opens), then, once it has risen, at the next horizon: *"Now — make the house RISE."* (T1, the full recovery; the valley itself opens after it) | **Lord Shigemasa** |

The capabilities **stack** (labour → reliability → arms → honesty → a real post → driving the recovery →
restoring the estate) and the granters **climb** (Genemon → Kihei → Chiyo → the Lord) — so at every rung the
player knows exactly *what they did* to rise. **The R7 capstone ends Phase 1** (he names the bailiff); the
**Phase-2 Estate grind** (raise the Estate pillar to EXCELLENT — the 1-pillar collapse) is what then **tiers up
to T1** (the full-estate recovery, where Arms reveals), so the
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
| **The Workshops & Granary** | E1 (build continues) | `RANK` R6 | *"A workshop frame; a granary rising. The Kurosawa works begin."* (E1→E2 itself lands in **T1**, the full estate) |
| **The lord's study** (ledgers) | E1 | `RANK` R7 | *"You are called to the lord's study, where the ledgers live."* |
| **E1 "Stabilising" — the estate STANDS (build complete)** | **E1 (build)** | **`PILLAR` (Phase 2, post-R7; the pillar-Influence floor + low rank floor — D-Q-B2/§2.17)** | *"The frames are filled, the fields bear, the ledger steadies. The house no longer falls — the first build stands."* |

> **Binding:** each is a diegetic beat; building/recruiting is **flavour / light systems wired to the reveal bus
> — NOT a people-management sim** (no assignment panel, no labour-gang; §2.17, canon §G). Recruit **Tokujirō**
> joins at the E1 seam as a **light roster card** (the future "teach from zero" mirror), announced as a beat, not
> a managed unit.

---

## 3.3.5 T1 — The estate's full recovery — `R8 → R15` (a FRESH ladder; forward sketch + placeholder rung titles)

> *(Numbered **3.3.5** — inserted between the T0 estate content (§3.2/§3.3) and the now-T2 Village ladder (§3.4)
> so the established §3.4+ anchors and their cross-file references are **not** renumbered. These 8 rungs are
> **net-new** to the reshape (D-048); their titles are **placeholders** (fork#3) and full rung-copy is
> **deferred**, like the §3.7 forward sketches.)*

> **What this tier IS.** T1 is the **full-estate grind** — the second half of the old single Estate tier, split
> off from the **tutorial T0** (§3.2, D-048). Where T0 showed each system **in miniature** and was **floor-exempt**,
> T1 is the **real grind**: the **≥30-min-per-rung floor binds from here** (D-049/D-056). The estate climbs
> **E1 Stabilising → E2 Recovering** (fork#2) — from "off the cliff" to genuinely **recovering**. **The first
> ascension (T0→T1) always lands BIG** on first contact, regardless of grade (D-062) — the title card, the
> silhouettes stir, a dream beat, the music swells.

> **The pillar reveal — Arms 武威 joins (P2).** T1 is where the **Arms pillar reveals** and its **DEEDS first
> bank** (Phase 2). Combat-as-*activity* already lived in T0 (the humbling R3 fight); now the **recognised
> martial DEED** counts toward a standing for the first time. So T1's Phase-2 gate is the **first 2-pillar
> profile** — the scaled grade-gate over **Estate + Arms**: **1 GREAT + 1 EXCELLENT**, both ≥ GOOD (D-049).
> Office/Name stay **locked silhouettes** (Office reveals at T2, Name at T3).

> **Diegetic mentor (no popups; reveal-as-plot, D-015/D-064/D-063).** T1's new systems are taught **in-world** by
> the domain-split cast: **Kihei** (arms / combat — introduced in earnest here) carries the Arms pillar + the 2nd
> weapon line; **Genemon** (labour / koku) carries the deepening estate economy; **Sōan** (healing) is already in
> the cold open. Each reveal is a **logged plot beat**, never a tutorial popup.

**T1 is the SAME two-phase motion as T0 (§3.0.1).** **Phase 1** = climb `R8→R15`, each rung an **AND-gate**: the
per-rung **Estate Service** / **Combat Rank** rung-meter (per-rung-reset, threshold back-solved from the ≥30-min
floor) **AND** the rung's story milestones; **pillar DEEDS do NOT accrue in Phase 1**. The capstone **R15 OPENS
Phase 2** — the **Estate + Arms** grind to the 2-pillar hybrid gate — and **clearing it opens the valley (T2 /
§3.4)**.

**Net-new T1 reveals (re-placed onto the new spine per the ripple spec §3):**
- the **Arms pillar 武威** (P2) reveals + its **DEEDS begin to bank** (Phase 2);
- the **2nd weapon LINE — the sword** — opens on a Combat-Rank rung (roster **+3 across R8→R15**; §3.5.1/§2.10.1),
  **pulled back from the old village tier** so the blade is a full-estate, not a market, reveal;
- the **koku flywheel branches** from its T0 *linear taste* into the **LAND / TREASURY / TRADE** sub-engines
  (trade **≤⅓** preserved; the *concrete* village silk-market *meibutsu* still waits for T2, §3.4-V3);
- the **first paid retinue — Gohei & Yatarō** — joins as a **light roster card** (fork#2; deployed/expanded,
  not "first," at T2);
- the estate **build advances E1→E2 "Recovering"** as a Phase-2 beat (gated on the pillar-Influence floor, not
  the rungs; §2.17/§4.7.5/D-Q-B2).

| Rung (R8→R15) | Placeholder title (fork#3) | Provisional meter-track |
|---|---|---|
| **R8** | Kura Warden | Estate Service |
| **R9** | Field Reeve | Estate Service |
| **R10** | Drill-yard Hand *(Kihei; the **2nd weapon line / sword** opens around here)* | Combat Rank |
| **R11** | Stable & Woodlot Master | Estate Service |
| **R12** | Ledger-hand | Estate Service |
| **R13** | Armsman of the House | Combat Rank |
| **R14** | Under-steward | Estate Service |
| **R15** | Trusted Man of the House *(capstone — ends Phase 1; the **Estate + Arms** 2-pillar Phase-2 gate is the **T1→T2 tier-up → the valley opens**)* | Estate Service |

> **Titles, track-assignments, story milestones, and diegetic log lines are PLACEHOLDERS** (fork#3) — full
> rung-copy is **deferred** to authoring, exactly as the §3.7 T4/T5 sketches defer theirs. What is **locked**
> here: T1 = `R8→R15`, the **two-track AND-gate**, the **Arms-pillar reveal (P2)**, the **2nd weapon line (sword,
> roster +3)**, the **first retinue**, the **E1→E2** build, and the **capstone-opens-valley** spine.

> **Dream / mystery cadence (D-055).** A **dream/mystery beat fires at the T0→T1 transition AND the T1→T2
> transition** (every tier seam carries one); the **full origin payoff stays at the Region (T3)** — the
> Otsuru/Tama truth (§3.6).

---

## 3.4 T2 — The estate's domain expands into the valley (full; v1) — `V0 → V7` (a FRESH ladder)

> **What this tier IS (read this first).** T2 is **not** "the village track." It is the **HOUSE rising** —
> a **fresh per-tier rank ladder** (canon §C, §I) on which the Kurosawa estate's standing climbs from
> **friendly → TRUSTED** and its **domain expands** from bare *survival* (T0–T1, the estate itself) to **the estate effectively
> anchoring / overseeing its valley** (T2). Every rung is still a **rank within the house's theme**; at every
> rung you act **FOR THE ESTATE**, carrying its business and its authority across the **village, the estate,
> and the surrounding satoyama/roads**. The valley's figures (headman **Yagōemon**, the shops, the inn)
> **acknowledge** the estate's growing role; they do not promote you — **the house does** (§3.4.1). *(Carried
> forward: **T3** is the domain expanding **again — to the Region**; §3.6.)*

**T2 is the SAME two-phase motion as T0/T1 (§3.0.1).** **Phase 1** = climb `V0→V7` (each rung an **AND-gate**:
the per-rung **Estate Service** / **Combat Rank** rung-meter + the rung's story milestones; **pillar DEEDS do NOT
accrue**). The capstone **V7 OPENS Phase 2** — the four-pillar grind — and **Phase 2** = grind the **revealed**
pillars to **T2's scaled grade-gate**, now over **THREE revealed pillars: Estate + Arms + Office** (**1 EXC +
1 GRT + 1 GOOD**; numbers → §4). The **Office BAR reveals during Phase 1** (V4, as a story beat) but
**Office DEEDS accrue only in Phase 2** (FU7), exactly like Arms/Estate. The bounded **±10% weather/festival
MECHANICAL layer** (§2.14/Q35) first reveals this tier, modulating labour/combat rates and the seasonal judged
results.

**Two parallel tracks (one gates, one accelerates):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `V0→V7` ladder below (Phase 1), then the Phase-2
  pillar grind. Clearing **both** is the **gate to T3 / Region**. Rising it raises **House Influence** and grows
  the estate's reach over the valley. Labour and combat keep interleaving, now past the estate gate; the
  **four-pillar Influence panel already exists** (Estate from R7, Arms from T1) and T2 **lights its Office bar** for the first time.
- **(SIDE-TRACK) Village reputation web — an OPTIONAL accelerant.** A **second, parallel reputation** (§2.15):
  how the **villagers personally regard you** — per-shop "patron/regular" meters, the headman's **personal**
  regard, the inn/rumours social web, and the **Tama-vs-farmhand allegiance**. It is **fully completable** and
  shaves **~10–15%** off time-to-T3 (§1.5.4), but it **NEVER gates the spine** — ignoring it leaves you only
  poorer and lonelier, never walled. **Estate-rep advances the main quest; village-rep is a full optional
  side-quest layer.** *(The two reputations are deliberately distinct in shape — a steep gated ladder vs. a
  gentle multi-node web — so they never read as one bar painted twice; §2.15.)*

Estate stage span: **E1 Stabilising → E2 Recovering** (§5 T1.4) — as at T0, **the E2 "Recovering" BUILD
COMPLETES as a Phase-2 beat** (gated on the pillar-Influence floor, not the V-rungs; §2.17/§4.7.5/D-Q-B2). Coin (*mon*), the **component/quality**
crafting system, the **inn rumours board**, the **bounded ±10% weather/festival mechanical layer**, and the
**silk/sericulture *meibutsu*** sub-engine — the **concrete village silk market** (the abstract **TRADE strand**
of the koku flywheel already opened at **T1**; the market itself is **T2**, never T0) — all first appear this
tier.

| Rung | Trigger (rung gate) | What this rung REVEALS (fractal order) | Diegetic event-log line(s) |
|---|---|---|---|
| **V0 — Errand-runner FOR the house, in the valley** | `STORY` (T0 authorised it; first village errand) | The house pushes its first business past its own gate — **The Market / Shop Row** area opens (**ONE shop first** — Smith **Gonta's** forge — then fractally adds **Obaa Kuni's** herb stall, Tokuemon's brewery, Onatsu's silk); **coin (*mon*)** resource row appears (§2.4). **[SIDE-TRACK]** the **village reputation web** seeds here — **per-shop "patron/regular" meters** begin (§2.15, gentle curves; optional accelerant, never the gate). **[THREAD: Tama]** headman's daughter **Sayo** names him "Tama" on sight — the legend **ignites** (allegiance goes live this tier; §1.5.4). | *"You carry the house's business into Asagiri. A girl, Sayo, stops dead: 'Tama? You're alive?' The shop row — and coin — opens to you."* |
| **V1 — Recognised hand of the house** | `RANK` Estate Service rung-meter + story (the valley begins to know the house's man; shop + headman acknowledgment) | The house's reach widens: **The Chief's House** area (Yagōemon's receiving room, where the headman **acknowledges** the estate's man); **deeper satoyama rings** (combat keeps pace on valley pests, securing the estate's near-ground). **[SIDE-TRACK]** **The Inn & Rumours Board** area — the **rumours board** (§2.13) goes live with its **first optional folklore tidbit** (the "kappa" of the ford; look, or not), and the **bounded ±10% weather/festival mechanical layer** (§2.14/Q35) becomes felt. | *"The headman receives the house's man. At the inn, Sukezō taps a board of rumours: 'Folk say a* kappa *takes children at the ford…' (You may look, or not.) The weather begins to bite at the day's work."* |
| **V2 — Road-warden (*michi-ban*) for the house** | `RANK` Combat Rank rung-meter + story (make a stretch of valley road / the ford safe **in the estate's name**; survive a real bandit/animal clear — curated combat activities) | The estate's writ now reaches the **roads** — **HUNT / CLEAR at valley scale**; **The River, Ford & Weir** and **The Foothills & Charcoal Grounds** wilderness rings open (§2.9, ring 2); **better loot / craft tiers**; the **3rd weapon LINE opens** — the **Staff / polearm line** (Bō・Naginata・Kanabō・Tetsubō), **pulled forward from the old Region tier** into the Village (a Combat Rank rung-gate; the roster grows **+4 across T2**, completing the ~9–10-weapon roster by **end-of-T2**, §3.5.1/§2.10.1). *(V2 combat feeds the **character (combat) level** + the **Combat Rank rung-meter**; the **Arms-pillar DEEDS** for these valley clears accrue in **T2's Phase 2**, not on the rungs; FU7.)* | *"You clear the ford road for the house. 'The road is declared safe — it's in the village book.' A new class of hafted weapon — the staff and the naginata — comes within reach. The Kurosawa name reaches past their own gate now."* |
| **V3 — The house's steward of the valley economy** | `RANK` Estate Service rung-meter + story (bring the valley economy + the estate's cash-crops to a recorded seasonal result) | The estate's domain grows to **the valley's livelihood** — the **TRADE sub-engine** of Estate & Wealth surfaces as its **concrete village market** (the abstract strand opened at **T1**; the silk market is **T2**, never T0): the **silk / sericulture *meibutsu*** (LOCKED) under weaver **Onatsu** (cocoon → reeled silk → woven textile rows, §2.11); the **component/quality crafting system** unlocks (hybrid → component chains, §2.11); **broker meters** appear; the **market-saturation damper** becomes visible (§2.4). **(Trade hard-capped ≤⅓ of Estate & Wealth — §2.16; its DEEDS accrue in Phase 2.)** | *"Onatsu shows you the reeling-frame: 'Silk pays, if you're patient.' The first bolt is graded and sold under the house's name. (Trade is one strand of one pillar — no more.)"* |
| **V4 — Trusted of the headman** (the house's hand puts a valley fire out) | `STORY` (resolve a village-affecting threat **on the estate's behalf** — **Magobei's** rice-skim surfaces; the headman's **personal** regard is earned as a SIDE accelerant) | The estate's **authority over valley affairs** is recognised in office: the **Standing & Office BAR reveals for the FIRST time** on the four-bar panel as this story beat lands (the skim resolved) — but **Office DEEDS accrue only in T2's Phase 2** (FU7), like every pillar; the **headman's roll-up quest** node; the **[MOTIF: rigged box]** doctored-*masu* thread (optional through-line). **[SIDE-TRACK]** Yagōemon's **personal** regard rises on the village web (optional). | *"You set the doctored measuring-box on the table. The skim ends; the valley breathes. For the first time a fourth standing — the* house's *office — appears on the panel, waiting to be earned."* |
| **V5 — Sworn man-at-arms of the house** (valley defence) | `RANK` Combat Rank rung-meter + story (stand a real watch **for the valley, in the house's name**; survive the first dangerous-road encounter; weapon-line milestones) | The estate becomes the **valley's shield** — the **first paid martial outsiders** (**Gohei & Yatarō**) join as a **light flavour retinue** (E2 rota, §2.17 — roster cards, **not** managed units); valley-defence **DEFEND** quests; festivals/seasonal social beats deepen (§2.14, e.g. Brewer **Tokuemon's** festival hub). **[NAOYUKI BEAT — narrative-only, ZERO mechanical effect]** heir **Naoyuki**, who vouched for you grudgingly at R4, rides out beside you on a valley watch and — for the first time — concedes you've outworked him; the rivalry tips toward **grudging respect** (seeding the earned **G5 ally-flip** against Tomita; Q26). | *"Two old* ashigaru *take the house's coin and stand its watch. Naoyuki, reining in beside you after a long night: 'You don't quit. I'll give you that.' The valley starts calling it 'the Kurosawa works.'"* |
| **V6 — Right-hand-in-waiting** (the house's agent over the valley) | `RANK` Estate Service rung-meter + `STORY` (Lord **Shigemasa** first believes the house's impact *beyond* the estate is possible) | The estate now effectively **runs much of the valley** through its agent — **authority across the valley**; the **alliance / standing levers** that point the house toward the region; the **region map seed** appears on the horizon of the tier-expansion map. | *"Shigemasa, watching the valley settle around the house: 'Perhaps… beyond this estate.' A far ridge, and a wider road, appear on the map."* |
| **V7 — Agent of the house, the valley anchored** *(capstone — END of PHASE 1 / ENTRY to PHASE 2)* | `RANK` Estate Service rung-meter **+ STORY** (the **"clean your room"** beat: the **estate** healthy, the **valley** anchored under it, immediate fires out) — **rung-meter + story ONLY**; the **Estate+Arms+Office hybrid profile is the SEPARATE Phase-2 T2→T3 tier-up gate** | The estate's domain is **secured at valley scale**; its standing is now **TRUSTED**. The capstone **OPENS T2's Phase 2** (the pillar grind across **Estate + Arms + Office**); the **REGION map** fully opens; the **T2→T3 quest** to grow the house's *regional* influence begins; **rival samurai houses appear** on the horizon (Tomita / Akagi as distant names); the **domain-ranking** read updates. **Clearing T2's Phase-2 hybrid profile → T3** (the domain expands again, to the Region). | *"The room is clean — house, valley, all of it. The lord: 'Now raise the house's name across all of it — then, the region.' Two rival names surface from beyond the ridge: Tomita. Akagi."* |

> **T2 deliberately withheld:** the **origin** track (still dark/foreshadowed by the dream — opens at T3); the
> *sekisho* / pass-tier travel layer; region-scale combat (the pass, rōnin/bandits as a population); **marriage
> / adoption** (T4+, §2.16.1); **auto-producers** (T4+). *(The roster is now **complete** — Line 3 / Staff opened
> at V2 this tier; **T3 Region adds no new line, only combat depth**.)* Folklore rumours unlock
> **organically and per-tier** (§2.13), and the **±10% weather/festival mechanical layer** (Q35) is itself a T2
> reveal — never an all-at-once dump. The **four T0 quest types are a STARTER set, not a cap** — more and varied
> quest types are authored as each later stage fits them (Q23).

> **T2 Phase 2 — what the back half REVEALS (D-Q4/D-Q-B2/D-Q-breadth-wall).** After V7 opens Phase 2, the grind
> over **Estate + Arms + Office** keeps revealing — it is not a flat number-climb: **the E2 "Recovering" estate
> BUILD completes** as a Phase-2 beat (the second workshop, the granary filled, the palisade raised into a real
> perimeter — estate fabric *finishing* on the influence track, post-V7, gated on the pillar-Influence floor,
> **not** the rungs; §2.17/§4.7.5/D-Q-B2); **Office DEEDS begin to count** for the first time (the bar *revealed*
> at V4 now *fills* — a new deed category opening mid-grind); the **PARTIAL cross-pillar COMBO set unlocks** — the
> **Office-pairs** (Arms×Office, Estate×Office), now that Office is revealed (Model-A, computed **post-clamp**,
> **excluded from the gate-check AND the trade-⅓ denominator**; §4.3.1/D-031 — the **full four-pillar combo set
> waits for T3 Region**, when Name reveals); and the **TRADE strand's first graded *meibutsu*
> payout** lands as an Estate-pillar beat (the silk bolt sold under the house's name, **≤⅓-capped**; §2.16). The
> **per-pillar shortfall is surfaced from the first Phase-2 season** (e.g. *"Office is behind"*), continuously,
> so the 3-pillar breadth gate is **never an end-of-phase wall** (§2.16(b)/D-Q-breadth-wall; no overflow).
> Clearing the 3-pillar scaled grade-gate (1 EXC + 1 GRT + 1 GOOD) → **T3.**

### 3.4.1 The earned-transition spine — *why* each promotion happens (T2)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out in the valley — a **rung-meter + story** AND-gate), an
> in-fiction **reason** (why the *house's domain* expands), and a **named granter** — and **the GRANTERS are
> HOUSE-side** (the **Lord Shigemasa** / chief steward **Genemon**), with the valley's figures (headman
> **Yagōemon**) **acknowledging** the estate's growing role, never conferring rank. The throughline: **the
> estate's domain expands because you, its agent, deliver results in the valley** — survival (T0–T1) becomes *the
> estate anchors its valley* (T2), standing **friendly → TRUSTED**.

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it (its domain expands) | Granter |
|---|---|---|---|
| **V0 → V1** | Run the house's first errands into Asagiri to an Estate-Service **rung-meter** threshold; open shop dealings (Gonta first) and survive valley pests on the near satoyama | The house, off the foreclosure cliff, must now **operate** in the valley, not just survive on its own land. A man who can carry its business and hold its near-ground is worth recognising → the valley starts knowing "the house's man" | Genemon *(Yagōemon **acknowledges** him at the receiving room — does not promote)* |
| **V1 → V2** | A **Combat Rank** rung-meter threshold — make a stretch of valley road / the ford safe in the estate's name; survive a real bandit/animal clear | The estate's reach can't stop at its gate while its own road is unsafe. Proving you can **secure the valley's roads** extends the house's writ past its fence → it names you its **road-warden** | Genemon (in the **Lord's** name) |
| **V2 → V3** | An **Estate-Service** rung-meter threshold — bring the valley economy + the estate's cash-crops to a **recorded seasonal result**; the silk *meibutsu* comes online | Solvency must scale beyond the home fields. You've proven you can run not just the estate's land but **the valley's livelihood** → the house makes you its **steward of the valley economy** | Genemon *(weaver **Onatsu** vouches for the silk hand)* |
| **V3 → V4** | A **STORY** trust beat — surface and end **Magobei's** rice-skim (the doctored *masu*) on the estate's behalf | A house that puts out the valley's fires is owed a voice in the valley's affairs. Resolving the skim **reveals the house's Office BAR** on the panel → the lord acknowledges the house holds an office's regard (the **Office DEEDS to fill that bar accrue in T1's Phase 2**, FU7) | **Lord Shigemasa** *(Yagōemon, the reachable culprit's patron, **acknowledges** the house's standing in disgrace)* |
| **V4 → V5** | A **Combat Rank** rung-meter threshold — stand a real watch for the valley in the house's name; survive the first dangerous-road encounter; weapon-line milestones; the first paid retinue (Gohei & Yatarō) stands up | The estate has become the thing the valley leans on for safety. A house that **shields its valley** needs sworn arms → the Lord swears you its **man-at-arms** and funds the first (light, flavour) retinue *(and heir **Naoyuki** first concedes grudging respect — the narrative-only beat seeding the G5 ally-flip)* | **Lord Shigemasa** + Genemon |
| **V5 → V6** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — the valley visibly settles **under the house**; the alliance/standing levers come into reach | With the valley anchored, the Lord — for the first time — believes the house's impact can reach **beyond** the estate. You are the only agent who has run all of it (errands, roads, economy, office, arms) → he makes you his **right-hand-in-waiting** | **Lord Shigemasa** |
| **V6 → V7** | The **capstone** — the **"clean your room"** beat (estate healthy, **valley anchored under the house**, immediate fires out): the Estate-Service rung-meter **+ story** — **ends Phase 1**. The **Estate + Arms + Office Phase-2 hybrid profile is the separate T2→T3 tier-up.** | The estate's domain is **secured at valley scale** and its standing is now **TRUSTED**. The Lord names you the house's **agent over the valley** (ends Phase 1) and points at **raising the house's standing across all of it** (Phase 2 opens) — then, once it has risen, the domain must expand **again — to the Region** → the **T2→T3 quest** opens; Tomita & Akagi surface as distant rivals | **Lord Shigemasa** *(capstone — "Raise the house's name; then, the region.")* |

The capabilities **stack** (operate in the valley → secure its roads → run its economy → hold an office in its
affairs → shield it → run all of it → anchor it) and the granters stay **HOUSE-side and climb** (Genemon → the
Lord), with the valley **acknowledging** rather than conferring — so the tier reads, start to finish, as **the
estate's domain expanding into the valley**, not as climbing village society. **V7 ends Phase 1** ("clean your
room"); the **Phase-2 grind** (raise Estate + Arms + Office to the hybrid profile) is the actual T2→T3 tier-up,
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
| **"House" / Influence screen** | `RANK` R7 (Influence panel, §2.16 — **ENTRY to PHASE 2**) | A dedicated **House** screen (the Influence pillars — **Estate lit, the other three as locked silhouettes** — + the domain-ranking read, §2.18) — its reveal **opens Phase 2**, the page on which you now **raise the house itself** (the Estate pillar's deeds start accruing; Arms joins at T1). | *"A page for the house itself — not what *you* are, but what it can *become*. Now: raise it."* |
| **"Village" screen** | `RANK` V0 (T2 opens) | A **Village** screen (shop row, reputation web, inn) joins the nav. | *"A new page: Asagiri, and everyone in it."* |
| **"Region" screen** | `RANK` V7 / `STORY` T2→T3 | A **Region** screen (the cluster map, the post-town, the roads) joins the nav. | *"The map grows a page wider: the region."* |
| **"Ties" / Origin screen** | `STORY`+`PILLAR` T3-G2 Origin track opens (doubly-earned) | An **Origin / Ties** screen (the Sawatari-juku contacts + the **`O0→O5` Origin reputation ladder**, §3.6.2). | *"A page you didn't know you'd been missing: people who knew your name."* |
| **"Castle-town" screen** | `STORY` T3→T4 *(stub in v1)* | A **Castle-town** screen **stub** — the **Daikan's-Office / castle-town first-contact cliff-hanger** (Q24/D-040; the racket's nerve-centre teased, no porter-guild framing). This **stub is the bounded "v1 complete" ending surface** (§3.7.0/D-Q-B11) — after it, free-play continues (tier HELD at T3-complete; no empty T4). | *"A page opens onto stone walls and a magistrate's seal — the castle-town invites the house in — and then the story pauses."* |

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
| **T1** (an R8–R15 full-estate rung) | combat rung (`RANK` Combat Rank) | The **2nd archetype line — the sword** opens on a Combat Rank rung-gate. |
| **T2** (a Village V-rung, e.g. V2) | combat rung (`RANK` Combat Rank) | The **3rd archetype line — the Staff / polearm** opens (pulled forward from the old Region tier; **T3 Region adds no new line, only depth**). |

**(b) The weapon roster growth (Q15/FU13).** New weapons are **FOUND and CRAFTED, never gifted**, and reveal
one at a time on the cadence above. **T0 starts with EXACTLY ONE** weapon and unlocks **+2 across the tier**
(the starter line); the roster grows **+3 at T1** (the full estate — the 2nd/**sword** line) and **+4 at T2**
(the Village — the 3rd/**Staff** line, pulled forward from the old Region; **T3 Region adds no new line, only
combat depth**) — **~9–10 weapons across v1**, spread over **3 archetype lines**, each weapon an **archetype** (its `baseSpeed` / `reach` /
`targetCount` / `attackProfile`) **+ a signature ability** (the crude **carrying-pole is a 0th IMPROVISED
weapon**, not a line; §2.10.1). Signature abilities deepen at higher weapon-line milestones (~L25 / L50 —
*proposed v1 balance*).

| Reveal point | Roster growth | Trigger KIND |
|---|---|---|
| **T0-R3** | the **single starter weapon** (Line 1) | combat rung (story) |
| **T0-R4** (loot→craft loop) | **+1** — the found/crafted **2nd weapon** (§7.2.0) | loot→craft loop (`RANK`) |
| **T0-R6** + a 2nd T0 beat | **+1** more — the **3rd weapon** (completes Line 1 by end-T0) | character-level / weapon-skill milestone |
| **T1 (full estate, from an R8–R15 rung)** | the **2nd archetype LINE — the sword**; **+3** across the R8–R15 rungs | combat rung (Combat Rank) |
| **T2 (Village, from V2)** | the **3rd archetype LINE — the Staff / polearm** (pulled forward from the old Region); **+4** across the V-rungs | combat rung (Combat Rank) |

These feed the **THREE clean tracks** (§2.8.1/§3.0.1), never one fused bar: a weapon improves the **character
(combat) level**'s damage and enables more **Arms** deeds (Phase 2), while the **Combat Rank rung-meter** is fed
only by curated per-rung activities. The **T0-starts-1 / +2/+3/+4 cadence, the 3-line shape, the
FOUND/CRAFTED-not-gifted rule, and one-reveal-per-beat** are **canon, not levers** (§4.6.9).

---

## 3.6 T3 — The estate's domain expands to the region (full; v1) — `G0 → G7` (a FRESH ladder)

> **What this tier IS (read this first).** Like T2, T3 is **not** "the region track" — it is the **HOUSE
> rising**, a **fresh per-tier rank ladder** (canon §C, §I) on which the Kurosawa estate's standing climbs from
> **TRUSTED → HONORARY MEMBER of the house** (you stop being merely the lord's reliable agent and become
> *family in all but blood* — the house's name spoken in the same breath as yours) and its **domain expands
> again** — from anchoring its own valley (T2) to the estate **effectively leading a region** (T3). Every rung
> is still a **rank within the house's theme**; at every rung you act **FOR THE ESTATE**, carrying its business,
> its arms, and its authority across **all three** scales at once: **the estate, the village, and the region**
> (a cluster of valleys, the post-town **Sawatari-juku**, the upstream **Kuzuhara** ruins, the roads &
> *sekisho*). Region figures — the post-town *toiya*, neighbouring headmen, the castle-town's distant officials,
> and the **rival samurai houses Tomita & Akagi** — **acknowledge, contend with, and finally cede to** the
> house's rise; they do not promote you — **the house does** (§3.6.1), and at the very top the castle-town
> authorities **confer regional leadership** and **invite the house in**. *(Carried forward: **T4** is the
> domain expanding **again — to the castle-town**; §3.7.1.)*

**T3 is the SAME two-phase motion as T0/T1/T2 (§3.0.1).** **Phase 1** = climb `G0→G7` (each rung an **AND-gate**:
the per-rung **Estate Service** / **Combat Rank** rung-meter + the rung's story milestones; **pillar DEEDS do
NOT accrue**). The capstone **G7 OPENS Phase 2** — and **Phase 2** = grind the **revealed** pillars to **T3's
scaled grade-gate**, now over **4 revealed pillars** (Estate + Arms + Office, with **Name** revealing at T3): **1 EXC +
1 GRT + 2 GOOD**, **NO overflow** (numbers → §4). The required pillars **drift**
toward **Estate + Office great/excellent, Arms good** — the **"win it socially"** steepening (§4.1) — so the
Office grind is a **Phase-2 emphasis** this tier.

**THREE parallel reputation tracks (only one gates the tier):**

- **(SPINE) Estate domain & standing — the MAIN QUEST.** The `G0→G7` ladder below (Phase 1), then the Phase-2
  pillar grind. **Both** gate **T4 / the castle-town** (canon §"Reputation systems model"). Rising it raises
  **House Influence** and grows the estate's reach to **region** scale. Labour and combat keep interleaving at
  region scale; the four-pillar panel exists from T0-R7 (Estate; Arms from T1, Office from T2), and T3 lights its
  **Name** bar and drives **Office** to the fore (the "win it socially" steepening, §4.8.3). Estate standing climbs **trusted → HONORARY MEMBER of the house**.
- **(SIDE-TRACK A) Village reputation web — carried from T2, still OPTIONAL.** The Asagiri per-shop / per-family
  meters, the headman's **personal** regard, the inn/rumours web, and the **Tama-vs-farmhand allegiance**
  (§1.5.4, §2.15) persist as a fully-completable accelerant — it shaves **~10–15%** off time-to-T4 but
  **NEVER gates the spine**.
- **(SIDE-TRACK B) Origin reputation — NEW this tier (`O0→O5`; see §3.6.2).** Tahei's **living** origin
  community at **Sawatari-juku** is **a proper one-tier standalone reputation side-track with its OWN rung
  ladder** (elaborates D-009 / canon §"Reputation systems model"). It **opens at G2** (doubly-earned:
  dream-memory **AND** travel-standing), is **optional, fully completable, an accelerant, narrative-only with NO
  retroactive gift from remembering** (the present-day relationships it builds — the morale buff + trade-tie
  ~10–15% speedup — **do** stay; Q12), and **NEVER gates the spine**. The **reunions** and **Tahei's
  name-reclaim** land on *this* track; the **Otsuru/Tama truth** lands on the **spine** at G6 (guaranteed).

> **Only the estate spine (the `G0→G7` rungs + their Phase-2 pillar profile) gates T3→T4.** Village and Origin
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
| **G0 — The house's valley-envoy** | `STORY` (T2→T3 quest; broker the estate's surplus beyond Asagiri) | The estate pushes its business past the valley — the **trade backbone** opens **minimally** (one route, one porter, one verb): friend **Kanta** runs the house's first consignment off the books (§1.7.1, the Kaidō Porters' & Transport Guild seed). **[RIVALS]** the names **Tomita** and **Akagi** harden from distant rumour into the region's **two incumbent samurai houses** — Tomita's agent **Yasubei** is already brokering the route you want. **[THREAD: Origin]** first origin contact made (the `O0→O5` track still closed). | *"You carry the house's surplus past the ridge — and find the road already worked. 'Tomita's man bought that consignment yesterday,' says a familiar face: Kanta. 'I'll run yours, for old times' sake.' One route. One load. (Why does his face ache to remember?)"* |
| **G1 — Road-captain of the cluster (for the house)** | `RANK` Combat Rank rung-meter + story (secure the cluster's roads **in the estate's name**; first *sekisho* turn-back → obtain a pass under the house's seal — curated combat activities) | The estate's writ reaches the **region's roads** — the ***sekisho* / pass-tier travel layer** (travel-standing made felt); **region-scale combat rings** (the pass; **rōnin / bandits / smugglers** as grindable human mobs, §2.9); combat **DEEPENS** here — **no new weapon line** (the roster completed at T2 Village; T3 adds region-scale foes, higher durability tiers, and signature-ability milestones, §3.5.1/§2.10.1); rumours of the **"one-eyed mountain god"** (= **Hanzaki** + fog-blind terrain) surface on the board. **[RIVALS]** the unsafe roads are partly **Tomita's** doing (their muscle-for-hire, often **Hanzaki**). *(G1 combat feeds the **character (combat) level** + the **Combat Rank rung-meter**; the **Arms-pillar DEEDS** accrue in T3's **Phase 2**, FU7.)* | *"The barrier-guard turns you back — then, seeing the Kurosawa seal, waves you through. The cluster's roads are the house's to keep now. The pass demands more of every weapon you carry. The brigands who skip Tomita's wagons and hit yours whisper of a one-eyed god on the pass."* |
| **G2 — Broker of the post-town trade (the house's factor)** *(the Origin side-track OPENS here — §3.6.2)* | `RANK` Estate Service rung-meter **+ STORY** (register the house at the *toiya*) — **the RUNG promotion gates on rung-meter + story only.** *(SEPARATELY: the **Origin SIDE-TRACK opens** on its own **doubly-earned** condition — **STORY** the dream returned enough memory **AND** **PILLAR** travel-standing to walk the checkpointed *kaidō*; §1.5.3/FU11. This is a side-track unlock, **NOT** a four-pillar tier-gate and **NOT** the rung trigger.)* | **Sawatari-juku** post-town area opens; the **toiya** transport office registers **the estate** as a regional factor (the export ramp to T4); **the ORIGIN reputation side-track opens at `O0`** (§3.6.2) — the **Origin / Ties screen** (§3.5). **[RIVALS]** at the *toiya* the Kurosawa factor sits **below Tomita's** established berth and **outside Akagi's** old precedence — the regional pecking order is now visible and contestable. | *"You register the house's mon at the Sawatari-juku* toiya *— third behind Tomita and Akagi. Then the street stops: an old woman drops her basket. 'Tahei…?' The name lands like a stone in still water. Your own past opens."* |
| **G3 — Arbiter between valleys (for the house)** | `RANK` Estate Service rung-meter + story (court / supply / arbitrate the two neighbouring valleys **on the estate's behalf**) | The estate's authority extends over **The Neighbouring Valleys** — **Hibara** + **Tōge-mura** (hard-capped at exactly two, §1.7.1), Asagiri fractally replicated, slimmer. **[RIVALS]** both valleys are **already courted by Tomita** (cheaper grain) and watched by **Akagi** (older ties); you win them by **out-supplying and out-arbitrating** — contested meters flip your way, **never by force** (canon §B). The two rivals can be **played against each other** (money vs precedence). | *"Two valleys, weighing the houses courting them. Tomita undercuts you on rice; Akagi sniffs that the Kurosawa are upstarts. You arbitrate, you supply, you out-give — and the valleys lean the house's way."* |
| **G4 — Recognised regional retainer of the house** | `RANK` Estate Service rung-meter **+ STORY** (reach Kuzuhara with conditioning + standing; the house takes on a region-scale work) | The house's name attaches to **Kuzuhara** — the drowned upstream hamlet (the Kurosawa's own **root-sin**: ancestor Sadamune's neglected flood-works); a multi-stage **river-works (*seki*)** project (a LAND mega-lever) — **committed here (Phase 1), but the E3 "Prosperous" estate BUILD it drives COMPLETES as a Phase-2 beat** (gated on the pillar-Influence floor, not the G-rungs; §2.17/§4.7.5/D-Q-B2) (Q8: the river-works/resettlement is the E3-stage estate-fabric lever); **resettlement** re-founds the hamlet as a region node; **the drowned are named** (grief-work + temple register — **not a rite**). **[RIVALS]** the works the rivals never bothered with become the region's proof the **Kurosawa** lead by *building*, not just trading. | *"The broken embankment; the empty houses underwater; Dowager Toku's shame made real. Neither Tomita nor Akagi ever touched it. You begin to raise the* seki *under the house's name — and to name the drowned. The Kurosawa works stand whole again."* |
| **G5 — Captain of the house's road-security detail** | `RANK` Combat Rank rung-meter + story (break the brigand roost; secure the trade pass **for the region, in the house's name** — curated combat activities) | The estate becomes the **region's shield** — a **hard-capped 2–3-man detail** (martial scale capped, canon §E; §2.17); escalating **Hanzaki** encounters (**survived, not won** — trained, never gifted); a **CLEAR/CAPTURE-with-mercy** branch (a famine-band can be fed/resettled, not killed). **[RIVALS]** breaking the roost cuts off **Tomita's** hired teeth — Hanzaki is exposed as their muscle. *(G5 combat feeds character level + the Combat Rank meter; Arms DEEDS accrue in Phase 2.)* **[NAOYUKI]** heir **Naoyuki** — turned to grudging respect at T2-V5 — now rides as your **ally against Tomita** (the earned flip; Q26). | *"You and two others hold the pass for the house. Hanzaki — Tomita's hired edge — tests you, and you live: endurance, not talent. Naoyuki at your shoulder now, not your throat. With the roost broken, the safe road is the Kurosawa's, not theirs."* |
| **G6 — The house's alliance-broker** *(the Otsuru TRUTH resolves on the SPINE — guaranteed for every player; the reunions + name-reclaim are on the optional Origin track §3.6.2)* | `RANK` Estate Service rung-meter **+ STORY** (broker the region's alliances; the rivals' contest tips; the Otsuru truth lands) — **rung-meter + story; the win-the-region PILLAR profile is the SEPARATE Phase-2 tier-up** | **[RIVALS]** the house brokers the region's alliances over the rivals' heads: **Akagi** is settled by *restoring its old precedence* (the proud line gets its honour back and stands with you), isolating **Tomita** commercially — the détente that sets up G7. **[THREAD: Tama] — PAYOFF (SPINE — guaranteed at G6 for EVERY player):** the living, grown **Otsuru** is found — Tama was a **girl** who **ran**; the MC is **not** her (grounded + **partial**; she may not forgive). **[THREAD: Origin — OPTIONAL track O5, DEEPENS this beat, NEVER gates it]:** *on the Origin track* the reunions complete (incl. father **Jinpachi**) and **Tahei reclaims his true name** at **O5** — **earned and MISSABLE** (a player who skipped the Origin track gets the Otsuru truth here regardless, but **never** the name-reclaim or the morale buff). The Origin **pride/morale** buff (a *present-day relationship*) lands on that track, **never** a retroactive gift from remembering. | *"You broker the region's alliances over the rivals' heads — Akagi at your side, Tomita boxed in. And down-valley: she is real, and grown, and not you. 'Tama ran. Tama lived.' You pick the house's work back up."* |
| **G7 — Leading house of the region** *(capstone — END of PHASE 1 / ENTRY to PHASE 2; the rivals DETHRONED)* | `RANK` Estate Service rung-meter **+ STORY** (**win the region's leadership**: rivals no longer the leaders) — **rung-meter + story ONLY; the Estate+Arms+Office+Name Phase-2 hybrid profile is the SEPARATE T3→T4 tier-up gate** | The capstone **OPENS T3's Phase 2** (the four-pillar grind to the hybrid profile over the **revealed** pillars — Estate + Office great/excellent, Arms good, Name revealing at T3). The **rival houses Tomita & Akagi are surpassed** (Akagi allied with restored precedence; **Tomita** out-competed into commercial détente — **never killed**, canon §B). The estate's standing is now **HONORARY MEMBER of the house**; the **region domain-ranking** read shows the Kurosawa **leading**; the castle-town rulers **confer regional leadership** and **invite** the house in; the **Castle-town screen STUB** (§3.5) appears as the **T4 cliff-hanger first-contact**. **Clearing T3's Phase-2 hybrid profile → T4 (stub; the domain expands again, to the castle-town).** | *"The region's leading house is the Kurosawa now — Tomita and Akagi behind them. A messenger in finer cloth than you've seen: 'The castle-town confers the region on your house, and invites it in.' Raise the house's standing to meet it — and the page turns onto stone walls, where the story pauses."* |

> **T3 honours the dream rule (binding):** the returning **memory / backstory reveal** grants **access only**
> (new nodes/allies/quests) and **NO retroactive stat/recipe/tool/combat bonus**; the present-day relationships
> you then build (the morale buff + the ~10–15% trade-tie speedup) **are** legitimate mechanics that stay (Q12,
> §1.5.3). At least one Origin beat is always available **without** reputation-gating so the thread never stalls
> (§5 T2.2). **Belief-creatures stay out of spawn tables** — the "one-eyed mountain god" is an
> **INVESTIGATE-then-confront one-shot** (Hanzaki + terrain), never a population (canon §E; §2.9, §2.13).

> **T3 deliberately withheld** (fractal discipline): **auto-producers** (T4+, §2.5 — Kuzuhara's first returnee
> producer is the *latest-game* exception); the **marriage / adoption** lever (T4+, §2.16.1); the castle-town
> *daikan*/*tedai* officialdom and inter-*han* markets (the T4 stub only teases them, §3.7.1). Folklore rumours
> keep unlocking **organically and per-tier** (§2.13) — never an all-at-once dump. The four T0 quest types stay
> a **starter set, not a cap** — region-scale quest types (escort/patrol/bounty/duel/investigate/…) are authored
> wherever they fit (Q23).

> **T3 Phase 2 — what the back half REVEALS (the richest Phase 2; D-Q4/D-Q-B2/D-Q-seasonal-rotation/D-Q-breadth-wall).**
> T3's Phase 2 is the longest grind, so it carries the **most** anti-slump reveals — it is explicitly **not** a
> dead consolidation half: **the E3 "Prosperous" estate BUILD completes** as a Phase-2 beat (the river-works
> committed at G4 pays out, the third workshop + full granary stand, the perimeter closes — the house visibly
> back on its feet, gated on the pillar-Influence floor, **not** the G-rungs; §2.17/§4.7.5/D-Q-B2); **Name DEEDS
> begin to count** for the first time (the fourth/Name pillar surfacing as a new deed category mid-grind, the
> seasonal-honour deeds; §4.1/D-Q3); the **FULL four-pillar cross-pillar COMBO set unlocks** (the **partial
> Office-pairs already opened at T2 Village**; now that **Name reveals**, the full four-pillar set lands — Model-A,
> a combo credits **both** paired pillars but its bonus is excluded from the gate-check + the trade ≤⅓ denominator;
> §4.3.1/D-Q5/D-Q-meibutsu/D-031) as the **1st** late-game anti-slump lever; and the **per-season SEASONAL-ROTATION** (a per-season featured
> deed/bonus; §2.14/D-Q-seasonal-rotation) is the **2nd**, so the back half never flattens into one optimal loop.
> The **per-pillar shortfall is surfaced from the first Phase-2 season** — with required pillars drifting toward
> **Estate + Office** great/excellent (the "win it socially" steepening, §4.1), the lagging bar reads plainly
> (e.g. *"Name is behind"*), continuously, so the breadth gate is **never an end-of-phase surprise**
> (§2.16(b)/D-Q-breadth-wall; no overflow/substitution). Clearing T3's hybrid profile over the revealed pillars →
> the **v1-complete surface** (§3.7.0), **then** T4 (stub).

### 3.6.1 The earned-transition spine — *why* each promotion happens (T3)

> **Audit rule: no rung is granted for free** (mirrors §3.2.1 / §3.4.1). Each promotion has a concrete in-game
> **trigger** (what you did **for the house**, out across the region — a **rung-meter + story** AND-gate, never a
> pillar threshold), an in-fiction **reason** (why the *house's domain* expands to region scale), and a **named
> granter** — and **the GRANTERS stay HOUSE-side and escalate** (chief steward **Genemon** → the **Lord
> Shigemasa** / heir **Naoyuki**), with the region's figures (the *toiya*, neighbouring headmen, the **rival
> houses Tomita & Akagi**) **acknowledging, contending with, and finally ceding to** the house — never
> conferring rank — until the **capstone**, where the **castle-town authorities** confer regional leadership and
> invite the house in (after the Phase-2 grind, the T3→T4 gate). The throughline: **the estate's domain expands
> to region scale because you, its agent, deliver** — *the estate anchors its valley* (T2) becomes *the estate
> leads its region* (T3); standing **TRUSTED → HONORARY MEMBER of the house**.

| Promotion | Earned by (trigger — rung-meter + story) | Why the house grants it (its domain expands to region scale) | Granter |
|---|---|---|---|
| **G0 → G1** | Run the house's first surplus past the valley (Kanta's off-books route) **and** survive the region's roads where **Tomita's** brokers already operate (Combat Rank rung-meter + story) | The house, having anchored its valley, must now **trade and travel at region scale** — but the roads are unsafe and the rivals already worked. A man who can carry its business and hold the cluster's roads is worth raising → it names him **road-captain** | Genemon *(the *toiya* and Tomita's agent **Yasubei** merely **note** the new Kurosawa man)* |
| **G1 → G2** | A **Combat Rank** rung-meter threshold + story — secure the cluster's roads in the estate's name; earn the first *sekisho* pass under the house's seal | The estate's writ can't reach the region while its caravans are turned back at the barriers and harried on the pass. Proving you can move the house freely and safely earns it a **factor's** standing at the post-town → it makes you its **broker** *(SEPARATELY, the **doubly-earned** dream + travel-standing conjunction opens the Origin SIDE-TRACK, §3.6.2 — narrative-only, **NOT** a promotion trigger and **NOT** a pillar gate)* | Genemon (in the **Lord's** name) *(the **toiya** registers the house — third behind **Tomita & Akagi**)* |
| **G2 → G3** | An **Estate-Service** rung-meter threshold + story — court, supply, and arbitrate **Hibara** + **Tōge-mura** on the house's behalf, out-supplying **Tomita** and out-precedence-ing **Akagi** | Region leadership means the neighbouring valleys lean on **your** house, not the rivals'. Winning them by giving more (never force) proves the estate can **govern beyond its own valley** → it makes you its **arbiter between valleys** | **Lord Shigemasa** *(the two valleys **lean** the house's way; the rivals **contest** but cede)* |
| **G3 → G4** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — reach Kuzuhara with conditioning + standing and commit the house to the multi-stage **river-works (*seki*)** the rivals never touched (this lands estate stage **E3 Prosperous**, Q8) | A house that **builds** what others wouldn't — atoning for its own root-sin while re-founding a region node — earns recognition as a true regional retainer, not just a trader. The works are the region's proof the **Kurosawa lead by building** → the Lord recognises you as his **regional retainer** | **Lord Shigemasa** *(Dowager **Toku** and carpenter **Risuke** vouch; the region marks that **neither rival** did this)* |
| **G4 → G5** | A **Combat Rank** rung-meter threshold + story — break the brigand roost and secure the trade pass for the region, exposing **Hanzaki** as **Tomita's** hired teeth | The region now leans on the house for **safety**, not just supply. A house that **shields the region's roads** — and cuts off a rival's muscle doing it — needs a sworn captain → the Lord names you captain of its **road-security detail** (hard-capped, canon §E) | **Lord Shigemasa** + Genemon *(heir **Naoyuki** now rides as **ally against Tomita** — the flip earned by the T2-V5 respect beat)* |
| **G5 → G6** | An **Estate-Service** rung-meter threshold **+** a **STORY** beat — broker the region's alliances over the rivals' heads: settle **Akagi** by restoring its precedence and isolate **Tomita** commercially | With supply, build, and arms all carrying the house's name, it can now **broker the region's alliances itself** — turning a proud rival into a partner and boxing in the other. You are the only agent who has run all of it → he makes you the house's **alliance-broker** *(the **Otsuru truth** resolves on the **SPINE** at G6 — guaranteed for every player; the family **reunions** + the **name-reclaim** deepen it on the optional Origin track §3.6.2, **NOT** a trigger)* | **Lord Shigemasa** *(Akagi's **Gennai** allies; **Tomita's Sōzaemon** concedes ground)* |
| **G6 → G7** | The **capstone** — **win the region's leadership** (rivals no longer the leaders): the Estate-Service rung-meter **+ story** — **ends Phase 1**. The **Estate + Arms + Office + Name Phase-2 hybrid profile is the separate T3→T4 tier-up.** | The capstone names the Kurosawa the region's **leading house** (Akagi allied, Tomita out-competed into détente — never killed). The estate's standing is now **HONORARY MEMBER of the house**. Once the **Phase-2 grind** raises the house's standing to the hybrid profile, the **castle-town authorities confer regional leadership** and **invite the house in** → the **T3→T4 quest** opens; the domain must expand **again — to the castle-town** | **Lord Shigemasa** (house-side rank) *+ the **castle-town authorities** (confer regional leadership / invite the house in) — capstone: "the castle-town invites your house."* |

The capabilities **stack** (trade the region → secure its roads → broker its post-town → arbitrate its valleys
→ build its works → shield its roads → broker its alliances → lead it) and the granters stay **HOUSE-side and
climb** (Genemon → the Lord / Naoyuki), with the region (the *toiya*, the valleys, **Tomita & Akagi**)
**acknowledging, contending, and ceding** rather than conferring — until the **castle-town** confers regional
leadership at the top. So the tier reads, start to finish, as **the estate's domain expanding to the region**,
not as climbing region society. **G7 ends Phase 1** (**rivals dethroned; region led**); the **Phase-2 grind**
(raise Estate + Arms + Office, Name revealing, to the hybrid profile) is the actual T3→T4 tier-up → the
castle-town invites the house in → **T4 opens**. *(The **village web** and the new **Origin track** (§3.6.2) run
alongside as **optional** accelerants — neither ever appears as a trigger above; canon §"Reputation systems
model".)*

### 3.6.2 SIDE-TRACK B — the Origin reputation ladder (`O0 → O5`, a one-tier standalone track)

> **What this is.** Tahei's **living** origin community at **Sawatari-juku** — a **proper one-tier standalone
> reputation side-track with its OWN rung ladder** (elaborates D-009 / canon §"Reputation systems model"). It
> mirrors how T2's village web is a parallel side-track, but shaped as a **short laddered arc** (the reunion *is*
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
| **O4 — The father returns** | `RANK` Origin Ties (the deepest tie; opens late on the track) | Father **Jinpachi** — grieved as away/lost — returns. A **clean, warm, un-stacked** reunion (NOT a third debt-bondage arc; the source of the porter's-knot lineage, **ZERO retroactive bonus**). Optional later T5 callback. | *"Jinpachi, older, leaner: 'They said the pass took you.' A long silence. Then: 'Tie off that load properly, boy.' It is the most he can say, and it is everything."* |
| **O5 — His name set down (the reunions complete)** *(Origin capstone — coincides with & DEEPENS the spine G6 beat; the **Otsuru truth-reveal is spine-guaranteed at G6, NOT gated here**; the **name-reclaim is EARNED + MISSABLE**, Q5/Q25/Q40)* | `RANK` Origin Ties (the track completes; coincides with the G6 spine beat) | **[THREAD: Origin] — PAYOFF:** with the **Otsuru truth already landed on the spine at G6**, the present-day family reunions complete and **Tahei sets his true name down** among his own people. The Origin **pride/morale** buff lands (a present-day relationship; **no retroactive gift from remembering** — but an earned mechanic that **stays**, Q12). *(A player who **skips the Origin track** still gets the G6 Otsuru truth-reveal on the spine — they only miss the reunions, the **name-reclaim**, and the buff; the name "Tahei" may **never** be reclaimed.)* | *"You have a name again: Tahei. You set it down quietly among your own people — and pick your work back up."* |

> **Why `O0→O5` and not `O0→O7`:** the Origin track is a **support arc, not a frontier** — a short reunion
> sequence, kept light so it never competes with the estate spine for the player's attention or reads as a
> second main quest (canon §C, lean discipline). It runs **entirely inside T3** (G2 → G6), is fully completable,
> and shaves a felt-but-small slice off the climb (folded into the ~10–15% side-faction speedup, §1.5.4) —
> **never required, never a wall.** *(Place names stay fictional; **Nihonbashi** is the lone explicitly
> allow-listed real place, surfacing only at the T5 Edo conduit, not here; Q12.)*

---

## 3.7 T4 / T5 — sketched ladders (forward; stub + roadmap)

Per v1 scope (canon §I), **T4 is a stub cliff-hanger** and **T5 is a roadmap**. Their fresh ladders are
**scoped forward** here — *shape only*, not authored rung-copy — so the per-tier-ladder motion is legible and so
the later reveals (**auto-producers**, the **marriage/adoption lever**, the **national *banzuke***) have an
explicit home. Full authoring deferred.

> **Same spine, two more frontiers (canon §"Reputation systems model").** T4/T5 carry the **same model as
> T0–T3** — including the **SEQUENTIAL two-phase per-tier motion** (Phase 1 climb the rungs on rung-meter +
> story; Phase 2 grind the revealed pillars to the hybrid gate, then tier-up; §3.0.1/FU7): the **estate's domain
> expands again** — **+ the castle-town** (T4), then **+ Edo / national** (T5) — and **every rung stays in the
> house's theme** (the house becoming a castle-town power, then a nationally-ranked house — **NOT** the MC
> climbing castle-town / Edo society; the castle-town & Edo figures **acknowledge, contend with, and cede**, and
> **only the estate spine gates tiers**). The **estate-rep arc continues**: **honorary member** (entering T4)
> **→ chief steward / *yōnin*** (T4 — the MC's personal **CEILING**) **→ T5: the MC STAYS *yōnin*; the arc
> shifts to the HOUSE's national standing** — the indirect / mediated Edo ceiling, the *house* ranked, never a
> personal *hatamoto* / shogunal rise (canon §F / §I, D-010).

### 3.7.0 The v1 ending — a bounded "v1 complete" surface, THEN free-play (D-Q-B11)

> **v1 terminates on a real, bounded closure — not a dead cliff-hanger.** When **T3's Phase-2 hybrid profile
> clears**, the **castle-town first-contact** (the "stone walls" beat — the **Castle-town screen STUB**, §3.5 /
> §3.6 G7) renders as an explicit, authored **"v1 complete" ending surface**: it **acknowledges the run has
> reached its v1 frontier** (the house leads its region; the castle-town confers regional leadership and invites
> it in; *"the story pauses here — for now"*). The cliff-hanger becomes a **surface, not a stat-wall.**
>
> **THEN free-play continues (the active loop keeps running).** After the v1-complete surface, **play does not
> stop**: the tab-open auto-resolve + auto-repeat loop runs on, and the **tier is HELD at T3-complete** — the
> player may **finish the side-tracks** (the village reputation web, the Origin `O0→O5` ladder incl. the missable
> name-reclaim), **push pillars past their gate floors** (the FLOOR-not-ceiling design, §3.0.1(6)), and complete
> the bestiary / weapon roster. The **post-gate clock/accrual policy is defined**: the world-clock keeps ticking,
> deeds still accrue, **NO decay-tax, NO reset** (canon §B; §3.0.1(6)).
>
> **v1 commits NO empty T4.** §3.7.1 / §3.7.2 below are **forward sketch only** — the `C*` / `E*` ladders are
> roadmap *shape*, never shipped-empty content; v1 does **not** open a playable-but-hollow T4. The **M6 milestone
> carries a PLAYER-FACING terminal assertion** (reachable closure + a defined post-gate clock/accrual policy),
> **not** merely the "no-T4" negative test (D-Q-B11).

### 3.7.1 T4 — The estate's domain expands to the castle-town (stub; `C0 → C7`, forward)

> **What this tier IS (sketch).** Like T2/T3, T4 is **not** "the castle-town track" — it is the **HOUSE
> rising**, a **fresh per-tier ladder** (climbed in the same **two phases**, §3.0.1) on which the Kurosawa
> estate's **domain expands again** (from leading its region in T3 to the house **becoming a castle-town power
> that holds key domain offices** in T4), and the MC's estate standing climbs **HONORARY MEMBER → chief steward
> / *yōnin*** (his **personal CEILING**, canon §I). Every rung stays **in the house's theme**; the castle-town's
> figures (the *daikan* / *tedai* officialdom, the rival merchant houses) **acknowledge, contend with, and
> finally cede to** the house — they do not promote you; **the house does**. **v1 ends on the entry to this
> tier** — the **Daikan's-Office / castle-town first-contact cliff-hanger** (Q24/D-040), no porter-guild
> framing. *(Carried forward: **T5** is the domain expanding **again — to Edo / the nation**, where the MC
> **stays *yōnin*** and the arc becomes the **HOUSE's**; §3.7.2.)*

Required pillars drift to **Office + Name dominant** (the takeover is **won socially**; Arms/Estate as
leverage). **MULTI-ROUTE takeover** (peaceful: office / economy / **marriage** / out-maneuvering rivals; AND
assertive: martial-security leverage) — "take over" = becoming the **dominant house holding key domain
offices**, **never rebellion** (canon §B).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **C0 — The house's envoy at the castle-town gate** | The **Castle-town map / screen** proper (beyond the T3 first-contact stub); the *daikan* / *tedai* officialdom layer the house must now operate within. | `STORY` T3→T4 (the castle-town confers regional leadership / invites the house in — the v1 stub cliff-hanger, Q24) |
| **C1–C2 — The house's office-seeker & inter-*han* factor** | **AUTO-PRODUCERS first appear** (§2.5, T4+ ONLY) — seconded / recruited helpers as **light roster cards** trickling a resource (no assignment panel, ever); inter-*han* market rows as the house pushes its trade to castle scale. | `RANK` (Phase 1) + Phase-2 `PILLAR` Office |
| **C3–C4 — The house holds a minor domain office** | **Jobs-as-offices at castle scale**; the **debt-restructuring / *goyōkin* TREASURY mega-lever** (Marutaya / *fudasashi* network, §1.7.1). | `PILLAR` Office (Phase 2) |
| **C5 — The house's alliance-maker** | **THE MARRIAGE / ADOPTION lever** (§2.16.1, T4+ ONLY) — a brokered **Standing & Office + Name & Honour** one-time jump and a **takeover route** for the house (NOT a relationship sim). | `STORY` + `PILLAR` Name |
| **C6 — The house eclipses its rivals** | The **antagonist Tedai Kuroiwa** ("the gracious door") arc; the racket's nerve-centre (the *Daikan's* Office, §1.7.1) out-maneuvered — **never rebellion** (canon §B). | `STORY` |
| **C7 — The dominant house of the castle-town; the MC made chief steward / *yōnin*** *(capstone — ends Phase 1; the Phase-2 Office+Name hybrid profile is the T4→T5 tier-up)* | The **domain *banzuke*** shows the house atop the castle-town (holding the key offices); the MC's estate standing reaches its **CEILING — chief steward / *yōnin*** (canon §I); the **T4→T5 "taste of Edo"** (the house called to staff & run the *domain's* Edo establishment — the *rusui-yaku* under the daimyō's *sankin-kōtai*, never its own). | `RANK` (capstone) + Phase-2 `PILLAR` |

> **T4 side-tracks (forward — sketch only):** the **village web** (T2) and the **Origin track** (T3) persist as
> fully-completable optional accelerants (never gating). T4 *may* seed a **new optional castle-town side-track**
> (a merchant / official rep web — e.g. the Marutaya factor or a *tedai* contact) — **forward note only, never a
> gate**; full authoring deferred with the tier.

### 3.7.2 T5 — The HOUSE's standing expands to the national stage (roadmap; `E0 → E7`, forward)

> **Note — label namespace:** these `E#` are **Edo rung labels** (the R/V/G/C/E per-tier rung scheme),
> distinct from the estate physical **stages** `E0–E5` (Foreclosure's Edge → Restored) used in
> §3.2/§3.3/§4.7.5. **E3 "Prosperous" is now authored in v1** (§3.6/Q8); **E4–E5 stay parked.** Context
> disambiguates the two `E#` uses; a rename candidate if T5 is ever fully authored.

> **What this tier IS (sketch).** T5 is the **same spine, last frontier** (same two-phase motion) — the estate's
> **domain expands to the national stage** — **but the arc is now the HOUSE's, not the man's.** The MC **stays
> *yōnin*** (his ceiling, reached at T4); what climbs at T5 is the **HOUSE's national standing**, recognised
> **indirectly / mediated** through the Edo conduit — the *house* is ranked on the national *banzuke*, **never**
> a personal *hatamoto* / shogunal rise (the indirect Edo ceiling; canon §F / §I, D-010). The capital's figures
> (the rusui's counterparts, the *fudasashi*, a touring inspector) **acknowledge and rank** the house; the MC
> remains its **architect**, off-stage from any shogunal audience.

Required pillars: **Name + Office** (the **national *banzuke*** on all four pillars). The **indirect/mediated
ceiling** holds — the **HOUSE** is recognised; the MC's personal ceiling stays **chief steward / *yōnin***
(no *hatamoto* / shogunal audience; canon §F, §I; §2.18).

| Forward rung (sketch) | First-reveal of note | Trigger kind |
|---|---|---|
| **E0–E2 — The *domain's* Edo *yashiki* conduit (worked by the house)** | The **Edo screen / map** (one cluster); the **rusui Mukai** *(invented surname — the real "Konoe" is a regent-house name, removed per Q27)* + the **daimyō's** *sankin-kōtai* mediated conduit (§1.7.1) — the house reaches the capital **through** the domain's rusui, **staffing the domain's establishment (never its own)**; the MC works the conduit, never attends a shogunal audience (the indirect ceiling). | `STORY` T4→T5 |
| **E3–E5 — The house's national trade & finance reach** | The **Osaka / Edo *fudasashi*** top of the finance network; the full silk *meibutsu* prestige payload carries the house's name to the capital (still trade ≤⅓). | `PILLAR` |
| **E6 — The touring-inspector set-piece** | The impartial-test antagonist beat *(senior shogunal inspector — surname **Hayami**, invented; the real "Toyama" removed per Q27)*; the **HOUSE's Name & Honour** climax via an inspector's national report. | `STORY` |
| **E7 — The HOUSE ranked at the capital** *(authored ending)* | **THE NATIONAL *MITATE* / PARODY *BANZUKE*** broadsheet (§2.18) — sumo-rank vocabulary: **Maegashira / Komusubi** attainable band, **Ōzeki / Yokozuna** the **structurally sealed top**; the **house** climbs from "the chart that omits you" into the attainable band (the MC stays *yōnin* — its architect, never personally ennobled); **post-game free-play, NO reset**; defend-the-spot on the biennial heartbeat (recoverable, **never a decay-tax**). | `PILLAR` Name + Office |

> **The whole ladder is the same motion, six times:** arrive minimal → the world fades in one panel/area/system
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
    great/excellent counts; T0 the 1-pillar special case — the gate collapses to one EXCELLENT; **NO overflow**) — **§4.1** (Q7/FU10);
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
   capstone *opens*). So R7/R15/V7/G7 are **RANK (rung-meter + story)** to end Phase 1, and the **PILLAR** check is
   the Phase-2 tier-up — no longer a mixed RANK+PILLAR rung gate. Exact thresholds → §4 *(proposed v1 balance)*.
2. ~~**Navigation-reveal granularity (§3.5).**~~ **RESOLVED:** **one nav entry at a time** (first tab at R2) is
   the locked grain; **distinct activities are TOP-LEVEL tabs** (Skills/Combat/Crafting/Quests/…; Q10) — the
   signature progressive-reveal feel.
3. ~~**R5 bundles too much.**~~ **RESOLVED & re-confirmed under the combat-reveal ladder (FU12):** R5 reveals
   only the **Quests tab + stance slot**; the simple Crafting tab + loot→craft loop + durability bands sit at
   **R4**; the first combat-earned **Arms** standing no longer "records" mid-climb at all (**pillar deeds are
   Phase-2 only**, FU7). Each rung reveals less (one-at-a-time grain).
4. ~~**T3-G2 double-gate (Origin opens).**~~ **RESOLVED:** the **Origin SIDE-TRACK** opens on **BOTH** STORY
   (dream returned enough memory) **AND** PILLAR (travel-standing) — **disentangled** from the G2 *rung* gate
   (which is rung-meter + story) and from any four-pillar tier-gate (§3.6 G2). The warmest payoff stays doubly
   earned (§1.5.3).
5. ~~**T4/T5 late first-reveal placement.**~~ **RESOLVED (confirmed as sketched):** **auto-producers at T4-C1**,
   the **marriage/adoption lever at T4-C5**, the **national *banzuke* at T5-E7**. Full rung-copy deferred with T4/T5.
6. **NEW — the combat-reveal-ladder cadence (FU12/Q15/FU13).** Confirm the staggered combat reveals read right:
   R3 (starter weapon + bare auto-resolve + retreat + bestiary) → R4 (durability bands) → R5 (stance) → first
   weapon-line L10 (ability + item slots) → 2nd line (sword) at T1 (full estate) → 3rd line (Staff) at T2 (Village, pulled forward; T3 Region adds no new line, only depth); roster +2/+3/+4, ~9–10 across v1.
   *(Cadence and the FOUND/CRAFTED-not-gifted rule are canon; placement of individual weapon reveals → §4.6.9.)*
7. **NEW — the Phase-2 grind length under the FLOOR budget (FU18).** Confirm the Phase-2 pillar grind (the
   deeds→hybrid-profile window) per tier reads as a **generous OSRS-rough FLOOR**, not a ceiling: pushing 1–2
   pillars to great/excellent **extends** Phase 2 beyond its minimum by design (§4.8 — *proposed v1 balance*).
8. **NEW — the three combat tracks stay legible in the UI (FU14/Q1).** Confirm the reveal copy never implies
   one kill feeds Arms or the Combat Rank meter, or that the rung-meter is fed by raw XP — the three tracks
   (character level / Arms pillar / Combat Rank rung-meter) must read as **separately-stored** wherever combat
   reveals appear (§2.8.1/§3.0.1).


---

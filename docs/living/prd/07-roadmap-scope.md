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

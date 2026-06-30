# §7 — Milestone Roadmap, v1 Scope & Deployment

> **PRD V2.3 — reshaped from the 79 human-signed V2 decisions (Block L `Q1–Q56` + Block M `FU1–FU23`); per
> ADR D-022 (governing) these supersede any conflicting prior lock, most-recent-wins, annotate-don't-delete.**
> Authored end-to-end from the LOCKED CANON
> ([`locked-decisions.md`](../../../project/brainstorms/2026-06-25-locked-decisions.md), incl. its
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
> catch-up — auto-producers stay T4+, §4.7.4/§2.5); **no people-management sim** (building/recruiting are flavour
> wired to the reveal bus, §1.5.1); **combat first-class & EARLY, INCREMENTAL, and feeding THREE clean tracks**
> (character (combat) level · the Arms pillar · the Combat Rank rung-meter — §1.6.4, §2.8, §4.6); **no magic /
> grounded** (§1.2 pillar 7); **K/M/B** number display + **macron** romanization (§6.9, §6.6); **no reset, ever**
> (§1.2 pillar 1). The pacing shape (saga ≈ 28.5 h across the 4 v1 tiers, new T0–T3; T0 floor-exempt, the ≥30-min per-rung floor binding from T1) is
> **LOCKED by human 2026-06-25 as a FLOOR / minimum** (canon §I-bal, annotated by FU18) — the game can and should
> run **longer** (a long, OSRS-rough grind); the M6 regression fails on **undershoot only** (§7.1.2).

## §7.0 How to read this section

§7 turns the design (§§1–6) into a **build plan**. It has four parts:

1. **§7.1 v1 scope (definitive)** — exactly what ships, the lean cut-set, the locked pacing floor, the
   sequential per-tier shape, and an explicit PARKED/CUT list (so "what's *not* in v1" is as legible as what is).
2. **§7.2 Milestone roadmap** — now a **delegation pointer**: the M0…M-series build order lives in the living
   [`roadmap.md`](../roadmap.md) (the single source — generate-don't-duplicate, D-021/D-059/DS#9). §7.2 keeps only
   the rules that govern it (milestone-integrity D-054; carry-forward-and-retune M0–M2b DS#19; the save-WIPE at
   the schema bump DS#15).
3. **§7.3 Deployment** — the static itch.io build, the multi-backend + export/import save path, the bundled
   asset set, the About/Credits + license + content descriptors, the `npm run verify` release gate, and a brief
   "how to ship."
4. **§7.4 Risk register + scope-risk posture** — the top risks and how we hold scope. **v1 = full T0–T3,
   non-negotiable (no pre-planned descope).**

**The cardinal build rule (from CLAUDE.md + §6):** every milestone is a *vertical slice* — it touches
core + content + renderer + tests together and **leaves `npm run verify` green and the game playable** to
its current frontier. We never build a horizontal layer (e.g. "all of combat") in isolation; we build the
**next playable beat** end-to-end. This is the agentic working cadence (*pick → build → verify → commit →
journal → repeat*) made into a roadmap.

---

## §7.1 v1 scope (definitive)

### §7.1.1 What v1 IS

**v1 = Tiers 0–3 complete** (canon §I, re-cut to the 6-tier spine — D-048): the **Estate** as **two tiers**
(**T0** tutorial + **T1** full), the **Village** of Asagiri (**T2**), and the **Region** (**T3**) **including
the T3 personal-mystery payoff** — the lost-child **Otsuru** resolution (the **TRUTH** that the MC is *not*
Tama; the real Tama is Otsuru, alive and grown) is **spine-guaranteed at G6 for every player** (§1.5.3, §3.6
G6, §5 T3), while reclaiming the MC's true name — **"Tahei"** — is **earned and *missable*** on the optional
**Origin** side-track's **O5** capstone (a player who skips the Origin thread may finish without it; Q5/D-036),
and the **Origin** reunions incl. father **Jinpachi** land across T3. **T4 Castle-town ships only as a STUB
cliff-hanger** — the **castle-town / Daikan's-Office first-contact** beat at the G7 capstone (Q24; the §3.7.1
first-contact screen — "the page turns onto stone walls, and the story pauses"; the old "Porter / Kaidō-guild
first-contact" framing is dropped because it re-ran spent T3 content); **T5 Edo is roadmap only** (sketched in
§3.7.2, not built).

**The lean cut-set (canon §I; §1.2 pillar 3) — what "complete" means per tier:**

| Dimension | v1 cut-set | Source |
|---|---|---|
| **Rank ladders** | a **fresh ~8-rung ladder per tier** × 4 v1 tiers: T0 `R0–R7` (Estate tutorial), T1 `R8–R15` (Estate full — the **two-track** Estate-Service + Combat-Rank rung-meters, promote on the AND-gate), T2 `V0–V7` (Village), T3 `G0–G7` (Region) — **32 rungs total**. **Each tier is climbed in TWO SEQUENTIAL PHASES** — **Phase 1**: climb the ~8 rungs, each promoting on a **numeric per-rung-reset rung-meter** (FU6, §4.1.1) **AND** that rung's story milestone (an **AND-gate**, Q30); **Phase 2**: the estate-influence / four-pillar **grind unlocks after the final rung** (the capstone OPENS it). | §1.6.4, §3.2 / §3.4 / §3.6, §2.15.1 |
| **Bestiary** | **~5 grounded mobs** core (boar, wolf, monkey, bandit, rōnin/smuggler), each carrying a **`MobDef.level`** (FU15) — NO belief-creatures in spawn tables | §4.6, §6.5 `enemies.ts`, canon §E |
| **Quest types** | the **4 STARTER types**: PEST-CONTROL · HUNT · CLEAR · DEFEND (DEFEND is the Arms-deed earner) — a **taxonomy, not a count budget** (Q23 supersedes D-012's "lean 4"): author whatever quests fit each stage, more / more-interesting welcome, especially at later tiers | §2.12, §3.2 R5, canon §I |
| **World** | **full walkable maps T0–T3** within a **~6–8-node-per-tier** cut-set (canon: full maps every tier, not abstract boards) | §1.7, §3, canon §I |
| **Skills (LOCKED v1 set)** | **farming · foraging · woodcutting · fishing · smithing · cooking** + **conditioning** + the **incremental weapon roster** (below). Each skill (labour included) carries a bounded **per-skill PERKS** track — ~2–8 small, stackable labour→combat bonuses, no global cap, each small-magnitude (Q6/FU8); **conditioning stays the ZERO-stat enablement gate**, orthogonal to and never bypassed by the perks. (Fishing surfaces at T2 — the Village, Q4.) | §1.5.1, §2.7/§2.7.1, §4.5/§4.5.4, canon §G |
| **Combat** | an **idle/auto-resolve auto-battler** (active-only; tab-open auto-resolve + auto-repeat) revealed **INCREMENTALLY** on the **combat-reveal ladder** (FU12: R3 starter weapon + auto-resolve loop + retreat → R4 graded durability bands → R5 stance → first weapon-line L10 ability/item slots → 2nd combat line at T1 → 3rd at T2; one reveal per beat); **satiety-throttled** (FU16); **graded 4-band durability** (FU17, never auto-unequipped); feeding **THREE clean separately-stored tracks** — kills/combat-XP → the **character (combat) level**, recognised deeds → the **Arms pillar** (Phase-2-gated), per-rung curated activities → the **Combat Rank rung-meter** (FU14) | §1.6.4, §2.8/§2.8.1/§2.8.2, §4.6 |
| **Weapon roster (incremental)** | a **growing ~9–10-weapon roster** across **3 archetype lines** (spear T0 · sword T1 · the **Staff/polearm line PULLED FORWARD to T2 Village**) — **T0 starts with exactly ONE weapon** and unlocks **+2** across the tier; **+3 at T1**, **+4 at T2** → **roster complete by end-of-T2**; **new-T3 Region adds combat DEPTH, no new line** (each weapon an **archetype** — per-weapon `baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability**; FOUND and CRAFTED, never gifted) | §2.8.2, §2.10.1, §4.6.9 |
| **Estate stages** | **E0 → E1 → E2 → E3** (Foreclosure's Edge → Stabilising → Recovering → **Prosperous**) — E3 authored in v1 (Q8, folded into the G-tier koku/Arms spend, §4.7.5); **E4–E5 parked** | §1.5.1, §4.7.5 |
| **House Influence** | the **four pillars** (Arms / Estate & Wealth [trade ≤⅓] / Standing & Office / Name & Honour), the four-bar panel revealing **bar-by-bar** as each pillar first scores; achievement-jump (**≈70%**) + seasonal-judged-on-high-water-mark (**≈30%**) accrual, **pillar DEEDS gated to PHASE 2**; the tier-gate is the **scaled grade-gate** (D-049: `1 EXCELLENT + 1 GREAT + (N−2) GOOD` for N *revealed* pillars, all ≥ GOOD; **NO overflow**; **T0 collapses to a single EXCELLENT** — T0 is now a **1-pillar** tier, Estate only) — a **per-pillar-per-tier overhaul**, not simple ratios (Q7/FU10/D-049) | §1.6, §2.16, §4.1–§4.2 |
| **Crafting** | **hybrid**: simple recipes from T0-R4; the component/quality system from T2-V3 (the Village). **Crafting and Quests surface as their OWN top-level nav tabs** (Q10), not nested panels | §4.7.2, §2.11/§2.12, §3.4 |
| **Save** | **MULTI-BACKEND redundant atomic save** — IndexedDB + localStorage + sessionStorage, written to all available backends per autosave; an **app-identity magic field** (`app:'kami-kakushi'`, reject-to-recovery on mismatch); a **monotonic save-counter newest-wins selector** (the save-layer **timestamp is only the tiebreaker** — a documented core-lint exemption, metadata not game logic); an **additive backwards-compatible schema** (never remove/repurpose a field) + ordered migrations + raw backup; **base64 export/import** retained as the portable backstop | §2.19/§2.19.1, §6.8/§6.8.1/§6.8.2 |

### §7.1.2 The locked pacing FLOOR (acceptance criterion = a minimum, not a ceiling)

Per canon **§I-bal** (human-signed), **annotated by FU18 (D-016-as-annotated)** and §4.8: the v1 saga budget —
**v1 total ≈ 28.5 h** of active play across the **4 v1 tiers (new T0–T3)**, with **T0 (the Estate-tutorial)
floor-EXEMPT** (a gentle ~10–15 min/rung ramp) and a **≥ ~30-min-per-rung floor binding from T1** — is a
**FLOOR / minimum, not a ceiling.** *(The old single-Estate 4.5 h splits across new-T0 tutorial + new-T1
full-estate; the old Village 8 h → new-T2; the old Region 16 h → new-T3; the precise per-tier magnitudes are
**LIQUID** — forks #1/#5, D-059 — re-derived at the balance milestone.)* The game **can and should run longer** (a long, OSRS-rough
grind you *leave auto-running, checking the progress*, FU18/FU23); content interleaves richly rather than
brick-walling. (The canon "≈ 32 h" figure includes the post-T3 stub runway / free-play tail; the *built*
content floor sums to ≈ 28.5 h — §4.8.4.) The **balance pass** (now scheduled in [`roadmap.md`](../roadmap.md)) treats the per-tier hour budgets and
the ≥30-min floor as **verify-gate-enforced minimums** — but the regression **fails on UNDERSHOOT only**: a
headless playthrough that clears any **floor-bound grind** rung (from T1: R8–R15, plus the V0–V7 / G0–G7
equivalents; the **R0 cold-open story rung AND the whole floor-exempt T0 tutorial ladder R1–R7 are exempt**
per §4.8.1) in **< ~28 min**, or completes a tier in **under its hour floor**,
**fails the pacing test** (too fast). **Overshooting the floor is fine and desired** — a longer grind never
fails the gate. The §4.8 curve is a **minimum-grind model**: tuning lengthens the grind / interleaves content
to clear the floor, never retunes the floor itself. The **auto-resolve combat + auto-repeat labour** loop
(tab-open, active-only) is what makes the longer grind palatable.

### §7.1.3 PARKED / CUT for v1 (designed, not deleted — "park, don't delete")

Per the lean discipline (§1.2 pillar 3, §1.7.1). **Parked = reintroduce later, deliberately**; nothing
here is a design hedge — the *shape* is decided, only the *authoring* is deferred.

| Parked item | Where it returns | Source |
|---|---|---|
| **Estate stages E4–E5** (fortified seat → restored-and-surpassed) — E0→E3 **ships in v1** (E3 authored in the late-v1 Region milestone, see roadmap.md) | T4+ | §1.5.1 |
| **The Matagi hunters, the Pilgrimage Order, the Scholars-&-Physicians *network*** (keep Sōan / Obaa Kuni as seeds only) | T4+ | §1.7.1 |
| **Auto-producers** (any idle/seconded-helper layer) — **v1 is active-only, no idle layer** (the "leave it running" feel comes from tab-open auto-resolve/auto-repeat, NOT offline progress) | T4-C1 first; scaffold only in v1 | §4.7.4, §2.5, canon §G/§H |
| **The marriage / adoption status lever** (a real T4/T5 alliance lever; numbers deferred) | T4-C5 | §1.7.1, §2.16.1, §4.3 |
| **Deeper upper-tier world nodes** (the *Daikan's* office depth, the Edo *yashiki* / rusui conduit, the full finance network, the High Mountains & Pass) | T4 / T5 | §1.7.1 |
| **The national *mitate* / parody-*banzuke*** (the Edo finale presentation) | T5-E7 | §3.7.2 |
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
  "half the rungs, maxed deeds" exploit. Clearing the tier's **scaled grade-gate**
  (§4.1 / D-049: `1 EXCELLENT + 1 GREAT + (N−2) GOOD`, all ≥ GOOD, NO overflow) against the tier's
  **revealed-pillar set** — **T0 = 1** (Estate; collapses to a single EXCELLENT) · **T1 = 2** (+ Arms) ·
  **T2 = 3** (+ Office) · **T3 = 4** (+ Name surfacing) — is then what **tiers up** to the next canvas. (A
  pillar **not yet revealed** for a tier is **never** part of its gate.)
- **The three clean combat tracks** thread through both phases and never collapse into one bar: **kills /
  combat-XP → the character (combat) level** (which scales HP, attribute points, and `satietyMax`); **recognised
  martial DEEDS → the Arms pillar** (Phase-2-gated, the influence economy); **per-rung curated activities → the
  Combat Rank rung-meter** (the Phase-1 martial rung-gate). One kill writes to your **level**; one recognised
  deed writes to **Arms**; one curated rung activity writes to the **meter** (§1.6.4, §2.8.1, §4.0.1).

This per-tier shape is the build skeleton the milestone roadmap (now the living [`roadmap.md`](../roadmap.md))
hangs on: each v1 tier (new T0–T3) stands up its Phase-1 rung-meter climb, then its Phase-2 four-pillar grind +
the scaled grade-gate → tier-up.

---

## §7.2 Milestone roadmap → `docs/living/roadmap.md`

> **The milestone roadmap has MOVED — it is no longer restated here.** The ordered M0…M-series build order
> — each milestone a verifiable **vertical slice** with a crisp definition-of-done, sequenced to the §3
> reveal ladder and the §6 architecture — now lives in the **living [`roadmap.md`](../roadmap.md)** as the
> **single source of truth** (generate-don't-duplicate — D-021 / D-059 / DS#9). §7 keeps only the
> **locked v1 scope** (§7.1), the **deployment** path (§7.3), and the **risk register** (§7.4); the
> *route* through the milestones is re-planned after each playtest, so freezing it here as a second, drifting
> copy is exactly what D-021 forbids.

The roadmap is governed by three rules this section **references but does not restate**:

- **Milestone-integrity (D-054).** A milestone closes only when **every** definition-of-done item is met **or**
  the gap is explicitly **ADR-amended** — no silent partial-done. The rule is machine-checked by the **CI
  milestone-manifest check** (wired in Part 2 / the build).
- **Carry-forward-and-retune M0–M2b (DS#19).** The already-built, verify-green **M0–M2b** slices are **kept
  and retuned** onto the reshaped 6-tier spine (the Estate split into new-T0 tutorial + new-T1 full), **not**
  rebuilt from scratch — the labour / combat spine carries forward; the rung labels, the pillar-reveal
  schedule, and the pacing floors re-derive.
- **Save-WIPE at the schema bump (DS#15).** The reshape bumps the save schema; because there is **no shipped
  player base** to migrate, pre-reshape saves are **WIPED** at that bump (a clean pre-release break, not a
  migration), and the multi-backend save layer (§6.8) starts fresh on the new shape.

The cardinal build rule is unchanged (§7.0): every milestone is a **vertical slice** that leaves
`npm run verify` green and the game playable to its current frontier.

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
| **R1 — Scope creep on T3** (the widest, warmest tier: region map + Origin faction + two payoffs + Kuzuhara + rivals) blows the timeline | **High / High** | Hold the **~6–8-node** cut-set and the **hard caps** (exactly 2 neighbouring valleys; 2–3-man detail; ~5 mobs) as *invariants*, not suggestions; build T3 **rung-by-rung** (the Region milestones, see roadmap.md) so progress is always verify-green; park anything not on the §1.7.1 spine list. **v1 ships full T0–T3 — no pre-planned descope (§7.4.2)**; if genuinely blocked, the forward-migratable multi-backend save (§6.8) lets a later update add tiers. **Caught at:** the Region milestones (rung-by-rung, verify-green — roadmap.md). |
| **R2 — Balance-tuning time to the FLOOR** (lengthening the grind to **at least** the per-tier hour minimums (re-derived across new T0–T3) + the ≥30-min floor (from T1) + ≈70/30 split across the 32 v1 rungs) is open-ended | **High / Medium** | The §4.8 curve is a **minimum-grind model** derived to be **AT LEAST** the floor, so M6 tunes *yields* to clear a fixed target — **lengthening / interleaving** the grind, never chasing a fixed total nor retuning the floor; the **headless pacing regression** makes **undershoot** (too fast / under budget) a `verify`-gate failure while **overshoot never fails** (§4.8.4) — tuning is measured, not vibes; every number lives in `balance.ts` (§6.4) and reflows with **no save migration**. **Caught at:** M6 (undershoot-only pacing gate). |
| **R3 — Save migration / save-loss** (a stored-shape change orphans saves; the itch iframe partitions storage) | **Medium / High** | Store **only non-derivable state** (§6.4) so the migratable surface is minimal; the **multi-backend redundant write** (IndexedDB + localStorage + sessionStorage) + the **magic-field reject-to-recovery** + the **monotonic-counter + timestamp newest-wins** selector + the **additive backwards-compatible schema** (never remove/repurpose) + **ordered, unit-tested migrations** + a **pre-migration raw backup** + **base64 export**; degrade gracefully on a bad save. The stored/computed split means balance retunes **never** migrate. **Caught at:** M0 (built complete) + M7 (cross-origin-iframe survival test, Chromium + WebKit). |
| **R4 — Art / feel** (inline SVG + emoji + CSS + a small audio set + self-hosted fonts must read as a *coherent woodblock world*, not a spreadsheet) | **Medium / Medium** | The register is a **small curated asset set** — inline-SVG load-bearing motifs + a synth/CC0 audio set + self-hosted OFL fonts (§7.3.1), **low-risk** (no heavy asset pipeline); a dedicated **M6 polish pass** + a **`capture-game-states` audit** sweep catch feel regressions; the diegetic event log carries most of the "feel," so feel scales with *writing* (a known quantity) more than with art production. **Caught at:** M6 (polish pass + audit sweep). |
| **R5 — The combat slice is the densest stretch** and could stall the whole roadmap | **Medium / Medium** | **M2a / M2b are fixed milestones** split up front at the R3→R4 seam (M2a = auto-resolve + first fight; M2b = bestiary/gear), so the combat slice is two shippable, verify-green checkpoints by design; the deterministic seeded auto-battler is **unit-testable in isolation** (§6.7) before it's wired to the UI; the first-fight win-rate band (20–35% at adequate satiety) and soft-setback shape are **LOCKED**, so the target is fixed. **Caught at:** M2a / M2b (the fixed split). |
| **R6 — Fun** (the LOCKED grind ships *balanced* but reads as a *slog* — Q4) | **Medium / High** | The **fun-proxies** are instrumented **report-only at M1/M3a** and **promoted to a GATING check at M6** (Q4/FU9: dead-time, reward/unlock cadence, always-a-visible-next-goal, the first-5-min hook, the tier-relative deed-cadence (re-derived across the new T0–T3 spine per `fun-factor.md`, Q20), and the win-rate bands [§4.6.6]) — **failing on undershoot of the fun floor**; FU18's *interleave-don't-brick-wall* + the **tab-open auto-resolve / auto-repeat** "leave it running, check the progress" loop (FU23) keep the long grind palatable. **Caught at:** M6 (fun-proxy gate). |
| **R7 — Perf / memory** (long active sessions + a large multi-backend save) | **Medium / Medium** | **Interim budgets are set after M0/M1 profiling** and then promoted to a **build-failing M6 perf GATE** — like the pacing/fun gates (D-Q-perf/Q15 + Q56): **save-envelope ≤ ~64 KB** (§6.6.1), **event-log node-count ≤ the `LOG_RING_MAX` ring cap** (§6.9), **bounded tick-loop allocation** (no per-tick garbage growth), and a **long-run memory ceiling** over an hours-long unattended run — the build **FAILS on a breach** (no longer just deferred intent). The pure-core / **derived-not-stored** split (§6.4) keeps the stored save minimal (weather/lunar re-derived, not persisted). **Caught at:** M0/M1 profiling (set budgets) → **M6 (build-failing perf gate)** + M7 fresh-browser smoke. |
| **R8 — Bounded per-skill perks + the combat reveal-ladder spread** (per-skill perks have **no hard global cap**; the combat surface spreads across M2a→M5) | **Medium / Medium** | The per-skill perks carry **accepted** balance risk (FU8: no global cap, each small-magnitude) bounded by **holistic** scaling (gear / level / attrs / enemy-scaling grow together) — mitigated by the **§6.6.1 per-perk-magnitude verifier bound** (each perk *small*, **conditioning == 0**); the incremental combat reveal stays **one-per-beat** (no UI-dump) via the **FU12 design-staggered** schedule (now mapped in [`roadmap.md`](../roadmap.md)) spread across M2a→M5. **Caught at:** M6 (verifier perk-magnitude bound) + M2a→M5 (the one-per-beat schedule). |
| **R9 — Mobile / touch scope** (v1 is desktop-first; some players will try it on a phone) | **Low / Low** | v1 is **DESKTOP-FIRST**: mobile = **best-effort responsive, NOT a v1 target** (Block N.1 #2). Touch targets meet the **a11y minimum** (§6.11) but there is **no dedicated mobile layout and no mobile leave-and-return** story — consistent with **multi-tab being unsupported** (§6.8). A dedicated mobile pass is **post-v1**. **Caught at:** M6 (a11y acceptance — touch-target minimums); otherwise not a v1 gate. |

### §7.4.2 Scope-risk posture — no pre-planned descope

**v1 = full T0–T3, non-negotiable.** The human chose **not** to pre-plan a reduced-scope cut (no "minimum
shippable T0–T2" fallback, no cut-down ladder) — we build to the full T0–T3 target and ship it complete (plus the
§3.7.1 T4 stub cliff-hanger). We do **not** design a T0–T2 fallback.

> **Holding scope:** every milestone stays **verify-green, deterministic, and a complete playable arc to its
> frontier**, and we hold the §7.1 cut-set + hard caps as *invariants* (this is how we protect the FLOOR — by
> trimming *breadth within a tier*, never by dropping a tier, and never by undershooting the grind). If a
> milestone is **genuinely blocked**, the forward-migratable multi-backend save (§6.8) plus **no reset** means a
> later update can add tiers without orphaning anyone — but that is a recovery path, not a plan: **v1 ships
> complete T0–T3.**

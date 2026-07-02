# §7 — v1 Scope, Deployment & Risk

§7 is the **definitive statement of what v1.0.0 ships** — the locked scope across
the four tiers **T0–T3**, the pacing floor, the deployment path to itch.io, and the
risk posture. It references the other sections by number and **defers all magnitudes
to §4**; the ordered build sequence lives in the living
[`roadmap.md`](../roadmap.md).

**Cross-cutting invariants** (specified in full across §§1–6, gathered here): the
game is **pure-core / deterministic** — one seed with per-named-stream persisted
cursors `{ seed, cursors: { combat, loot, seasonal, worldgen } }` plus a stateless
day-keyed weather/lunar derivation (derived-not-stored) and integer-only core math,
so a fixed seed replays byte-identically across engines (§6.1, §6.2, §6.7, §6.7.1).
v1 is **active-only — NO idle/offline layer**; with the tab **OPEN**, a tick-driven
**auto-resolve combat + auto-repeat labour** loop gives the "leave it running, check
the progress" feel (auto-producers stay a forward-tier concern — §4.7.4, §2.5).
There is **no people-management sim** (building / recruiting are flavour wired to the
reveal bus, §1.5.1). **Combat is first-class and EARLY**, revealed incrementally,
and feeds **THREE clean tracks** — the character (combat) level, the Arms pillar,
and the Combat Rank rung-meter (§1.6.4, §2.8, §4.6). The world is **grounded — no
magic** (§1.2 pillar 7); **koku standing & counts** display in **K/M/B**, while
**coin** displays in fixed mixed denominations **mon → monme → ryō** (revealed
incrementally as wealth grows — a **fixed rate, no forex**), all with **macron**
romanization (§6.6, §6.9); there is **no reset, ever** (§1.2 pillar 1). The pacing shape — the
≈ 28.5 h saga across the four v1 tiers, **T0 floor-exempt** with the **≥ 30-min-
per-rung floor binding from T1** — is a **FLOOR / minimum, not a ceiling**: the game
can and should run **longer** (a long, OSRS-rough grind), and the pacing regression
fails on **undershoot only** (§7.1.2).

## §7.0 How to read this section

§7 has four parts:

1. **§7.1 v1 scope (definitive)** — exactly what ships: the lean cut-set, the locked
   pacing floor, the sequential per-tier shape, and an explicit PARKED/CUT list (so
   "what's *not* in v1" is as legible as what is).
2. **§7.2 Milestone roadmap** — a pointer to the living
   [`roadmap.md`](../roadmap.md), which owns the ordered build sequence (the single
   source).
3. **§7.3 Deployment** — the static itch.io build, the multi-backend + export/import
   save path, the bundled asset set, the About/Credits + license + content
   descriptors, and the `npm run verify` release gate.
4. **§7.4 Risk register + scope-risk posture** — the top risks, the gates that catch
   them, and how scope is held. **v1 = full T0–T3, non-negotiable (no pre-planned
   descope).**

---

## §7.1 v1 scope (definitive)

### §7.1.1 What v1 IS

**v1 = Tiers 0–3 complete:** the **Estate** as **two tiers** (**T0** tutorial +
**T1** full), the **Village** of Asagiri (**T2**), and the **Region** (**T3**)
**including the T3 personal-mystery payoff** — the lost-child **Otsuru** resolution
(the **TRUTH** that the MC is *not* Tama; the real Tama is Otsuru, alive and grown)
is **spine-guaranteed at G6 for every player** (§1.5.3, §3.6 G6, §5 T3), while
reclaiming the MC's true name — **"Tahei"** — is **earned and *missable*** on the
optional **Origin** side-track's **O5** capstone (a player who skips the Origin
thread may finish without it), and the **Origin** reunions incl. father **Jinpachi**
land across T3. **T4 Castle-town ships as a STUB cliff-hanger** — the **castle-town /
Daikan's-Office first-contact** beat at the G7 capstone (the §3.7.1 first-contact
screen — "the page turns onto stone walls, and the story pauses"); **T5 Edo is
roadmap only** (sketched in §3.7.2, not built).

**The lean cut-set (§1.2 pillar 3) — what "complete" means per tier:**

| Dimension | v1 cut-set | Source |
|---|---|---|
| **Rank ladders** | a **fresh ~8-rung ladder per tier** × 4 v1 tiers: T0 `R0–R7` (Estate tutorial), T1 `R8–R15` (Estate full — the **two-track** Estate-Service + Combat-Rank rung-meters, promote on the AND-gate), T2 `V0–V7` (Village), T3 `G0–G7` (Region) — **32 rungs total**. **Each tier is climbed in TWO SEQUENTIAL PHASES** — **Phase 1**: climb the ~8 rungs, each promoting on a **numeric per-rung-reset rung-meter** (§4.1.1) **AND** that rung's story milestone (an **AND-gate**); **Phase 2**: the estate-influence / four-pillar **grind unlocks after the final rung** (the capstone OPENS it). | §1.6.4, §3.2 / §3.4 / §3.6, §2.15.1 |
| **Bestiary** | **~5 grounded mobs** core (boar, wolf, monkey, bandit, rōnin/smuggler), each carrying a **`MobDef.level`** — NO belief-creatures in spawn tables | §4.6, §6.5 `enemies.ts` |
| **Quest types** | the **4 STARTER types**: PEST-CONTROL · HUNT · CLEAR · DEFEND (DEFEND is the Arms-deed earner) — a **taxonomy, not a count budget**: author whatever quests fit each stage, more / more-interesting welcome, especially at later tiers | §2.12, §3.2 R5 |
| **World** | **full walkable maps T0–T3** within a **~6–8-node-per-tier** cut-set (full maps every tier, not abstract boards) | §1.7, §3 |
| **Skills (LOCKED v1 set)** | **farming · foraging · woodcutting · fishing · smithing · cooking** + **conditioning** + the **incremental weapon roster** (below). Each skill (labour included) carries a bounded **per-skill PERKS** track — ~2–8 small, stackable labour→combat bonuses, no global cap, each small-magnitude; **conditioning stays the ZERO-stat enablement gate**, orthogonal to and never bypassed by the perks. (Fishing surfaces at T2 — the Village.) | §1.5.1, §2.7/§2.7.1, §4.5/§4.5.4 |
| **Combat** | an **idle/auto-resolve auto-battler** (active-only; tab-open auto-resolve + auto-repeat) revealed **INCREMENTALLY** on the **combat-reveal ladder** (R3 starter weapon + auto-resolve loop + retreat → R4 graded durability bands → R5 stance → first weapon-line L10 ability/item slots → 2nd combat line at T1 → 3rd at T2; one reveal per beat); **satiety-throttled**; **graded 4-band durability** (never auto-unequipped); feeding **THREE clean separately-stored tracks** — kills/combat-XP → the **character (combat) level**, recognised deeds → the **Arms pillar** (Phase-2-gated), per-rung curated activities → the **Combat Rank rung-meter** | §1.6.4, §2.8/§2.8.1/§2.8.2, §4.6 |
| **Weapon roster (incremental)** | a **growing ~9–10-weapon roster** across **3 archetype lines** (spear T0 · sword T1 · the **Staff/polearm line at T2 Village**) — **T0 starts with the carrying-pole and unlocks +2 across the tier** (at least one of the two craftable); **+3 at T1**, **+4 at T2** → **roster complete by end-of-T2**; **T3 Region adds combat DEPTH, no new line** (each weapon an **archetype** — per-weapon `baseSpeed` / `reach` / `targetCount` / `attackProfile` — **+ a signature ability**; FOUND and CRAFTED, never gifted) | §2.8.2, §2.10.1, §4.6.9 |
| **Estate stages** | **E0 → E1 → E2 → E3** (Foreclosure's Edge → Stabilising → Recovering → **Prosperous**) — the narrative CONDITION ladder; E3 authored in v1 (folded into the G-tier coin/Arms spend, §4.7.5); **E4–E5 parked** | §1.5.1, §4.7.5 |
| **House Influence** | the **four pillars** (Arms / Estate & Wealth [trade ≤⅓] / Standing & Office / Name & Honour), the four-bar panel revealing **bar-by-bar** as each pillar first scores; achievement-jump (**≈70%**) + seasonal-judged-on-high-water-mark (**≈30%**) accrual, **pillar DEEDS gated to PHASE 2**; the tier-gate is the **scaled grade-gate** (`1 EXCELLENT + 1 GREAT + (N−2) GOOD` for N *revealed* pillars, all ≥ GOOD; **NO overflow**; **T0 collapses to a single EXCELLENT** — T0 is a **1-pillar** tier, Estate only) — a **per-pillar-per-tier overhaul**, not simple ratios | §1.6, §2.16, §4.1–§4.2 |
| **Crafting** | **hybrid**: simple recipes from T0-R4; the component/quality system from T2-V3 (the Village). **Crafting and Quests surface as their OWN top-level nav tabs**, not nested panels | §4.7.2, §2.11/§2.12, §3.4 |
| **Save** | **MULTI-BACKEND redundant atomic save** — IndexedDB + localStorage + sessionStorage, written to all available backends per autosave; an **app-identity magic field** (`app:'kami-kakushi'`, reject-to-recovery on mismatch); a **monotonic save-counter newest-wins selector** (the save-layer **timestamp is only the tiebreaker** — a documented core-lint exemption, metadata not game logic); an **additive backwards-compatible schema** (never remove/repurpose a field) + ordered migrations + raw backup; **base64 export/import** retained as the portable backstop | §2.19/§2.19.1, §6.8/§6.8.1/§6.8.2 |

### §7.1.2 The locked pacing FLOOR (acceptance criterion = a minimum, not a ceiling)

The v1 saga budget — **v1 total ≈ 28.5 h** of active play across the **four v1 tiers
(T0–T3)**, with **T0 (the Estate-tutorial) floor-EXEMPT** (a gentle ~10–15 min/rung
ramp) and a **≥ ~30-min-per-rung floor binding from T1** — is a **FLOOR / minimum,
not a ceiling** (§4.8). The precise per-tier hour magnitudes stay **LIQUID**,
re-derived at the balance pass; the game **can and should run longer** (a long,
OSRS-rough grind you *leave auto-running, checking the progress*), and content
interleaves richly rather than brick-walling. (The "≈ 32 h" figure includes the
post-T3 stub runway / free-play tail; the *built* content floor sums to ≈ 28.5 h —
§4.8.4.) The **balance pass** treats the per-tier hour budgets and the ≥30-min floor
as **verify-gate-enforced minimums** — but the **pacing regression fails on
UNDERSHOOT only**: a headless playthrough that clears any **floor-bound grind** rung
(from T1: R8–R15, plus the V0–V7 / G0–G7 equivalents; the **R0 cold-open story rung
AND the whole floor-exempt T0 tutorial ladder R1–R7 are exempt** per §4.8.1) in
**< ~28 min**, or completes a tier in **under its hour floor**, **fails the pacing
test** (too fast). **Overshooting the floor is fine and desired** — a longer grind
never fails the gate. The §4.8 curve is a **minimum-grind model**: tuning lengthens
the grind / interleaves content to clear the floor, never retunes the floor itself.
The **auto-resolve combat + auto-repeat labour** loop (tab-open, active-only) is what
makes the longer grind palatable.

### §7.1.3 PARKED / CUT for v1 (designed, not deleted — "park, don't delete")

Per the lean discipline (§1.2 pillar 3, §1.7.1). **Parked = reintroduce later,
deliberately**; nothing here is a design hedge — the *shape* is decided, only the
*authoring* is deferred.

| Parked item | Where it returns | Source |
|---|---|---|
| **Estate stages E4–E5** (fortified seat → restored-and-surpassed) — E0→E3 **ships in v1** (E3 authored in the Region tier; see [`roadmap.md`](../roadmap.md)) | T4+ | §1.5.1 |
| **The Matagi hunters, the Pilgrimage Order, the Scholars-&-Physicians *network*** (keep Sōan / Obaa Kuni as seeds only) | T4+ | §1.7.1 |
| **Auto-producers** (any idle/seconded-helper layer) — **v1 is active-only, no idle layer** (the "leave it running" feel comes from tab-open auto-resolve/auto-repeat, NOT offline progress) | T4; scaffold only in v1 | §4.7.4, §2.5 |
| **The marriage / adoption status lever** (a real T4/T5 alliance lever; numbers deferred) | T4 | §1.7.1, §2.16.1, §4.3 |
| **Deeper upper-tier world nodes** (the *Daikan's* office depth, the Edo *yashiki* / rusui conduit, the full finance network, the High Mountains & Pass) | T4 / T5 | §1.7.1 |
| **The national *mitate* / parody-*banzuke*** (the Edo finale presentation) | T5 | §3.7.2 |
| **No respec** (attributes & skill-milestone choices committed — explicitly out of v1) | post-v1, reconsider | §4.4, §4.5 |
| **Dedicated mobile layout / mobile leave-and-return** — v1 is **DESKTOP-FIRST**; mobile is **best-effort responsive only** (touch targets meet the a11y minimum, but no mobile-specific layout and no mobile leave-and-return story — consistent with multi-tab being unsupported) | post-v1 mobile pass | §6.11 |

> **Hard guardrails that v1 must NOT violate** (machine-checked by the content
> verifier — §6.6/§6.6.1): no belief-creature in any spawn table; **trade ≤⅓ of
> Estate & Wealth** (a HARD structural cap — and the broadened **cross-pillar
> combos** are computed **POST-clamp**, **excluded** from the gate-threshold check,
> and the verifier proves a combo can **never** breach ⅓ nor satisfy a required
> pillar); ≤1 residual-ambiguity token; **bounded labour→combat ONLY via small
> per-skill perks** (no global cap, each small-magnitude — the verifier asserts
> *each perk is small*, **not** `== 0`) with **conditioning kept as the ZERO-stat
> enablement gate** (weak→capable; never bypassed by the perks); no passive
> Influence trickle (jumps + seasonal-judged only); no permanent holding-loss / no
> Influence wipe; **force-fictionalised real names** (a §6.6 real-name denylist
> lint); macron romanization; hard-capped martial scale (a small named retinue,
> never a standing army).

### §7.1.4 Per-tier shape (Phase 1 → Phase 2) — the sequential progression model

Every content tier is internally **SEQUENTIAL, in two phases** (§1.6.4, §2.15.1):

- **Phase 1 — climb the rungs.** Two **rung-meters** drive the ~8-rung ladder in
  parallel: **Estate Service** (the labour rung-meter) and **Combat Rank** (the
  martial rung-meter; "Standing" is reserved for the **官威** *Standing & Office*
  pillar). Each rung promotes on a **numeric per-rung-reset rung-meter** — a real
  §4.1.1 curve whose threshold is **back-solved from the SAME ≥30-min floor §4.8
  pacing uses** × that rung's eligible-activity rate — **AND** the rung's **story
  milestone** (an **AND-gate**; the UI reads "awaiting X" when one lags). The meter
  is fed by **curated, story-consistent per-rung activities** (a designed
  *one-to-many* set, **NOT** a single repeat-counter). A **pre-R3 taste of variety
  is FRONT-LOADED** into Phase 1's first hour: a small log-driven hazard/skirmish
  beat (or extra loop) **without the full combat UI**, so first-session retention
  isn't riding on labour alone before combat opens at R3.
- **Phase 2 — grind the house up.** **After the final rung** of the tier, the
  **estate-influence / four-pillar grind unlocks** (the capstone rung **OPENS**
  Phase 2; it does not merely confirm it). The tier's **pillar DEEDS accrue here and
  only here** — they do **not** accrue while climbing the rungs, which prevents the
  "half the rungs, maxed deeds" exploit. Clearing the tier's **scaled grade-gate**
  (§4.1: `1 EXCELLENT + 1 GREAT + (N−2) GOOD`, all ≥ GOOD, NO overflow) against the
  tier's **revealed-pillar set** — **T0 = 1** (Estate; collapses to a single
  EXCELLENT) · **T1 = 2** (+ Arms) · **T2 = 3** (+ Office) · **T3 = 4** (+ Name
  surfacing) — is then what **tiers up** to the next canvas. (A pillar **not yet
  revealed** for a tier is **never** part of its gate.)
- **The three clean combat tracks** thread through both phases and never collapse
  into one bar: **kills / combat-XP → the character (combat) level** (which scales
  HP, attribute points, and `satietyMax`); **recognised martial DEEDS → the Arms
  pillar** (Phase-2-gated, the influence economy); **per-rung curated activities →
  the Combat Rank rung-meter** (the Phase-1 martial rung-gate). One kill writes to
  your **level**; one recognised deed writes to **Arms**; one curated rung activity
  writes to the **meter** (§1.6.4, §2.8.1, §4.0.1).

This per-tier shape is the skeleton the milestone roadmap
([`roadmap.md`](../roadmap.md)) hangs on: each v1 tier (T0–T3) stands up its
Phase-1 rung-meter climb, then its Phase-2 four-pillar grind + the scaled grade-gate
→ tier-up.

---

## §7.2 Milestone roadmap → [`roadmap.md`](../roadmap.md)

The ordered build sequence that stands this scope up — each milestone a verifiable
**vertical slice** (core + content + renderer + tests together, leaving
`npm run verify` green and the game playable to its frontier), sequenced to the §3
reveal ladder and the §6 architecture — lives in the living
[`roadmap.md`](../roadmap.md) as the **single source of truth**
(generate-don't-duplicate). §7 owns the *what* (the locked v1 scope §7.1, deployment
§7.3, and the risk register §7.4); the roadmap owns the *how / the order* — including
the milestone-integrity rule, the carry-forward policy, and the save-schema
lifecycle — and is re-planned after each playtest. On any conflict: **§7 wins on
locked scope & shape; the roadmap wins on sequence.**

---

## §7.3 Deployment & assets

**No backend. Fully static.** Per §6.1: `vite build` emits a static `dist/` (a
**single HTML bundle** + hashed JS/CSS + the **bundled asset set**, §7.3.1), zipped
(contents-at-root) and uploaded to **itch.io**.

- **Static itch.io build.** `npm run build:itch` = `vite build` + zip **the
  *contents* of** `dist/` (so `index.html` sits at the **archive root**, never
  nested under a `dist/` folder — itch.io requires `index.html` at the zip root or
  the embed shows a blank frame). itch.io serves the unzipped bundle from a project
  subpath, so Vite's **`base`** must be a **relative base** (`base: './'`) so asset
  URLs resolve under itch's served path — the single most common static-host break,
  pinned in `vite.config.ts`. The DEV play API and any dev-only helpers are stripped
  via `import.meta.env.DEV` (dead-code-eliminated), so the shipped bundle carries
  **no** `__qa` surface.
- **The multi-backend save path.** Persistence is the **multi-backend redundant
  atomic save** — IndexedDB + localStorage + sessionStorage, written to all
  available backends per autosave; the **app-identity magic field** (reject-to-
  recovery on mismatch); the **monotonic save-counter newest-wins selector** (the
  timestamp is only the tiebreaker — a documented core-lint exemption); the
  **additive backwards-compatible schema** + ordered migrations + raw backup —
  **plus base64 export/import** as the portable backstop (§6.8). Because itch.io
  serves the game inside a **cross-origin iframe** with no server, the redundant
  multi-backend write is the defence against the embed's storage partition/eviction,
  and the base64 export is the player's own safety net — its **cross-origin-iframe
  survival is tested on Chromium AND WebKit**. Import validates + migrates
  (versioned, ordered, pre-migration raw backup; a corrupt save degrades gracefully,
  never a "save is kill" wall).
- **The `npm run verify` release gate.** The **same** one-command gate that guards
  every commit (§6.1) is the release gate: `tsc --noEmit && eslint . &&
  prettier --check . && vitest run && verify-content && gen:docs --check` — i.e.
  **typecheck + unit tests + the content-verifier (incl. the number-format checks —
  K/M/B for koku standing + the mon/monme/ryō coin denominations — plus macron + the
  canon-invariant machine checks) + lints**, **plus the §4.8 headless pacing
  regression, the fun-proxy gate, AND the build-failing perf gate**. A release
  artifact is **only ever cut from a verify-green commit**; `verify` is run
  **locally** as the pre-push / release gate (**no hosted CI, no deploy
  automation**).
- **How to ship to itch.io (brief).** (1) `npm run verify` green; (2)
  `npm run build:itch` → a zipped `dist/` (contents at root); (3) on itch.io, create
  / edit the project, set **Kind = HTML**, upload the zip, tick **"This file will be
  played in the browser,"** set the viewport (a sensible default frame; the layout
  is responsive per §6.9), set pricing to **free / pay-what-you-want**, **and declare
  the content descriptors** (§7.3.2); (4) run the deploy-checklist gates — **fonts
  self-hosted** (no Google / no network), the **About/Credits + commit-SHA stamp**
  present, the **LICENSE** file exists, and the **multi-backend save-survival smoke**
  green on Chromium + WebKit; (5) save as a draft, open the draft URL, run the
  **fresh-browser smoke test** (load < 5 s to first interactable; rake rice; reload
  → autosave persists; export → clear store → import → identical); (6) publish.

> **Out of scope for v1 deployment:** any server, account system, cloud save,
> analytics backend, or network call. The game is wholly client-side and
> **offline-capable after first load** (active-only; no offline *progress*, but it
> runs with no network — **fonts / audio / SVG are all self-hosted**, §7.3.1).

### §7.3.1 Assets (the acknowledged small set)

v1 ships **one small, curated, fully-bundled asset set** — no CDN, no network.

- **Self-hosted OFL fonts.** The period-evoking display + body fonts are **SIL
  OFL**, **self-hosted** (Google dynamic-subsetting removed — it breaks offline play
  + the itch relative-base), with the **OFL license bundled** and the
  **Reserved-Font-Name** rule honoured. The offline smoke confirms **zero font
  network calls**.
- **Inline-SVG load-bearing motifs.** The **pillar / season / rarity** marks (and
  the other load-bearing period motifs) are **inline SVG** so they render
  **identically across OSes**; **emoji are cosmetic-only**, never load-bearing.
- **A small curated audio set.** Light ambient beds + UI/event SFX as a mix of
  **synthesized Web Audio** + **original / CC0 samples** — the one acknowledged
  curated audio set — all behind the **mute** toggle.
- **Build stamp.** The build injects the **commit-SHA / version** stamp into the
  About/Credits surface (§7.3.2) so any shipped zip is traceable to the commit it
  was cut from.

All of it is bundled into `dist/`; the offline smoke asserts **zero network calls**.

### §7.3.2 About/Credits, licensing & content rating

- **About/Credits surface.** A small in-product **About/Credits** screen
  (content/surfaces.ts, §6.5 / §2.21) carrying **authorship**, the **commit-SHA
  build stamp**, **font/audio attributions** (the OFL fonts + the CC0 samples), a
  **clean-room attestation**, and pointers to the license + content descriptors.
- **Licensing.** A **LICENSE** file ships with the build: **permissive code** (MIT /
  Apache-2.0) **+ reserved game content** (all-rights-reserved or CC-BY-NC) — the
  split is surfaced in About/Credits. The bundled **OFL** license covers the fonts
  (§7.3.1).
- **Content rating (itch descriptors).** The itch.io page declares the **content
  descriptors** for the game's **mild thematic** content — **child-disappearance,
  drowning, debt** — as a deploy-checklist step. (No graphic violence, no sexual
  content; the register stays restrained.)
- **World registry.** The world-sim content lives in a **`content/world.ts`**
  data-as-code registry, id-resolved by the content verifier — the single source for
  the world-facing content that About/Credits + the descriptors describe.

---

## §7.4 Risk register + scope-risk posture

### §7.4.1 Top risks

| # | Risk | Likelihood / impact | Mitigation (+ the gate that catches it) |
|---|---|---|---|
| **R1 — Scope creep on T3** (the widest, warmest tier: region map + Origin faction + two payoffs + Kuzuhara + rivals) blows the timeline | **High / High** | Hold the **~6–8-node** cut-set and the **hard caps** (exactly 2 neighbouring valleys; 2–3-man detail; ~5 mobs) as *invariants*, not suggestions; build T3 **rung-by-rung** so progress is always verify-green; park anything not on the §1.7.1 spine list. **v1 ships full T0–T3 — no pre-planned descope (§7.4.2)**; if genuinely blocked, the forward-migratable multi-backend save (§6.8) lets a later update add tiers. **Caught by:** the cut-set invariants + a verify-green tree at every rung (§7.4.2). |
| **R2 — Balance-tuning time to the FLOOR** (lengthening the grind to **at least** the per-tier hour minimums + the ≥30-min floor (from T1) + ≈70/30 split across the 32 v1 rungs) is open-ended | **High / Medium** | The §4.8 curve is a **minimum-grind model** derived to be **AT LEAST** the floor, so tuning adjusts *yields* to clear a fixed target — **lengthening / interleaving** the grind, never chasing a fixed total nor retuning the floor; the **headless pacing regression** makes **undershoot** (too fast / under budget) a `verify`-gate failure while **overshoot never fails** (§4.8.4) — tuning is measured, not vibes; every number lives in `balance.ts` (§6.4) and reflows with **no save migration**. **Caught by:** the pacing gate (undershoot-only). |
| **R3 — Save migration / save-loss** (a stored-shape change orphans saves; the itch iframe partitions storage) | **Medium / High** | Store **only non-derivable state** (§6.4) so the migratable surface is minimal; the **multi-backend redundant write** (IndexedDB + localStorage + sessionStorage) + the **magic-field reject-to-recovery** + the **monotonic-counter + timestamp newest-wins** selector + the **additive backwards-compatible schema** (never remove/repurpose) + **ordered, unit-tested migrations** + a **pre-migration raw backup** + **base64 export**; degrade gracefully on a bad save. The stored/computed split means balance retunes **never** migrate. **Caught by:** the cross-origin-iframe save-survival test (Chromium + WebKit, §7.3). |
| **R4 — Art / feel** (inline SVG + emoji + CSS + a small audio set + self-hosted fonts must read as a *coherent woodblock world*, not a spreadsheet) | **Medium / Medium** | The register is a **small curated asset set** — inline-SVG load-bearing motifs + a synth/CC0 audio set + self-hosted OFL fonts (§7.3.1), **low-risk** (no heavy asset pipeline); a dedicated **polish pass** + a **`capture-game-states` audit** sweep catch feel regressions; the diegetic event log carries most of the "feel," so feel scales with *writing* (a known quantity) more than with art production. **Caught by:** the `capture-game-states` visual audit sweep. |
| **R5 — The combat slice is the densest stretch** and could stall the whole roadmap | **Medium / Medium** | The combat surface is split at the R3→R4 seam into fixed, shippable checkpoints (auto-resolve + first fight, then bestiary/gear), so it lands as verify-green increments by design; the deterministic seeded auto-battler is **unit-testable in isolation** (§6.7) before it's wired to the UI; the first-fight win-rate band (**20–35%** at adequate satiety) and soft-setback shape are **LOCKED**, so the target is fixed. **Caught by:** the deterministic combat unit tests + the LOCKED 20–35% first-fight band (verify gate). |
| **R6 — Fun** (the LOCKED grind ships *balanced* but reads as a *slog*) | **Medium / High** | The **fun-proxies** are instrumented (dead-time, reward/unlock cadence, always-a-visible-next-goal, the first-5-min hook, the tier-relative deed-cadence [re-derived across the T0–T3 spine per `fun-factor.md`], and the win-rate bands [§4.6.6]) and enforced as a **GATING** check that **fails on undershoot of the fun floor**; the *interleave-don't-brick-wall* discipline + the **tab-open auto-resolve / auto-repeat** "leave it running, check the progress" loop keep the long grind palatable. **Caught by:** the fun-proxy gate. |
| **R7 — Perf / memory** (long active sessions + a large multi-backend save) | **Medium / Medium** | Budgets are set from profiling and enforced by a **build-failing perf GATE** — like the pacing/fun gates: **save-envelope ≤ ~64 KB** (§6.6.1), **event-log node-count ≤ the `LOG_RING_MAX` ring cap** (§6.9), **bounded tick-loop allocation** (no per-tick garbage growth), and a **long-run memory ceiling** over an hours-long unattended run — the build **FAILS on a breach**. The pure-core / **derived-not-stored** split (§6.4) keeps the stored save minimal (weather/lunar re-derived, not persisted). **Caught by:** the build-failing perf gate + the fresh-browser smoke. |
| **R8 — Bounded per-skill perks + the combat reveal-ladder spread** (per-skill perks have **no hard global cap**; the combat surface spreads across the reveal ladder) | **Medium / Medium** | The per-skill perks carry **accepted** balance risk (no global cap, each small-magnitude) bounded by **holistic** scaling (gear / level / attrs / enemy-scaling grow together) — mitigated by the **§6.6.1 per-perk-magnitude verifier bound** (each perk *small*, **conditioning == 0**); the incremental combat reveal stays **one-per-beat** (no UI-dump) via the design-staggered schedule (mapped in [`roadmap.md`](../roadmap.md)). **Caught by:** the content-verifier's per-perk-magnitude bound (verify gate) + the one-per-beat reveal schedule. |
| **R9 — Mobile / touch scope** (v1 is desktop-first; some players will try it on a phone) | **Low / Low** | v1 is **DESKTOP-FIRST**: mobile = **best-effort responsive, NOT a v1 target**. Touch targets meet the **a11y minimum** (§6.11) but there is **no dedicated mobile layout and no mobile leave-and-return** story — consistent with **multi-tab being unsupported** (§6.8). A dedicated mobile pass is **post-v1**. **Caught by:** the a11y gate (touch-target minimums). |

### §7.4.2 Scope-risk posture — no pre-planned descope

**v1 = full T0–T3, non-negotiable.** There is no pre-planned reduced-scope cut — no
"minimum shippable T0–T2" fallback, no cut-down ladder. v1 is built to the full
T0–T3 target and ships complete (plus the §3.7.1 T4 stub cliff-hanger); there is no
T0–T2 fallback design.

> **Holding scope:** every milestone stays **verify-green, deterministic, and a
> complete playable arc to its frontier**, and the §7.1 cut-set + hard caps hold as
> *invariants* (this is how the FLOOR is protected — by trimming *breadth within a
> tier*, never by dropping a tier, and never by undershooting the grind). If a
> milestone is **genuinely blocked**, the forward-migratable multi-backend save
> (§6.8) plus **no reset** means a later update can add tiers without orphaning
> anyone — but that is a recovery path, not a plan: **v1 ships complete T0–T3.**
</content>
</invoke>

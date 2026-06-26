# Kamikakushi PRD — MASTER Decision Sheet (priority-ranked)

**Date:** 2026-06-26 · **56 decisions (Q1–Q56) + PD-1 (approved → ADR D-021)** · ranked by a 5-lens impact panel (architect / designer / build-lead / risk-QA / holistic), dependency-corrected. Tiers: **P0=6, P1=9, P2=22, P3=19**. Full context per decision = the [battery report](2026-06-26-prd-battery-review.md); raw findings in [`raw/`](raw/).

> **The process (human-signed).** `resolve these decisions → PRD **V2** → build M0/M1 → playtest → resteer → PRD **V3** → build → …`. We settle the design forks into a strong V2 **before** code. Per ADR D-021, the §4 numbers / §7 M2–M7 detail stay *provisional* (they evolve into V2/V3); the §1 vision + signed acceptance criteria + T0–T2 scope are locked.

> **How we work the queue.** Tier by tier, top down; one decision at a time. Each gets a **dynamic-depth brief** — `●` one-liner (obvious, confirm the rec) · `●●` short (question + just-enough context) · `●●●` full (real fork, options + trade-off). The ranking is a *recommendation* — challenge any placement.

---

## ⚡ Decide-first & how they cluster

**P0 must-decide-first (6):** **Q1**, **Q2**, **Q3**, **Q6**, **Q30**, **Q34** — foundational data-model / determinism / core-invariant / progression-mechanism. Nothing downstream is safe to author until these land.

**Decide-as-a-batch / dependency clusters:**
- **Combat/attribute spine:** `Q1` → Q6 (conditioning), Q15/Q16 (combat content), Q31 (stamina).
- **Save/determinism spine:** `Q2` → Q34 → Q44 → Q45/Q46; and Q2 → Q36/Q33.
- **T0 economy (one sitting):** `Q7` → Q14 → Q29 (the impossible-gate fix must precede the tie-outs).
- **G6 climax / name (MERGE into one):** `Q5` → Q25 → Q40 (Q25 even *contradicts* Q40 — settle as a batch).
- **itch storage (MERGE — duplicates):** `Q37` = `Q43`. · **rung gating** `Q30` → Q10. · **stamina** `Q31` → Q17/Q47. · **weather** `Q35` → Q55.

**⚠ Low panel-agreement (rankers diverged sharply → most genuinely *your* taste call):** Q5, Q24, Q25, Q22, Q11, Q26, Q20, Q21.

---

## The ranked queue

*(`Rec` = my recommendation; `→` = depends on / decide after.)*


### TIER P0 — foundational · decide FIRST (everything builds on these)

| # | | Q | Decision | Rec | Notes |
|--:|:--:|:--|:--|:--|:--|
| 1 | ●●● | **Q1** | Define the level model and the attribute system, and close the labour→combat back door. (a) How does | Make character level its own stored track but source it from combat/deeds-inclusive XP (not raw |  |
| 2 | ●●● | **Q2** | Pin the RNG sub-stream model and persisted shape. Canon D-013a/H4 lock 'splitmix64 + named sub-strea | Adopt per-named-stream cursors derived as splitmix64(hash(seed, name)) with each cursor monoton |  |
| 3 | ●●● | **Q3** | Reconcile the persisted surface and content catalog. For each of {market-saturation state, estate st | Store market saturation (clearly non-derivable) and durability; derive weather from the day-key | → Q2 |
| 4 | ●●● | **Q6** | What is 'conditioning', exactly — a single labour-built enablement gate granting ZERO combat stats,  | Option (a) or (c): keep conditioning as a labour-built ZERO-bonus gate and, if a combat-drill s | → Q1 |
| 5 | ●●● | **Q30** | How is an estate-ladder rung promotion gated? Pick ONE: (A) numeric meter — rungs flip when a stored | B (flag/event-gated) for T0 — the §3.2.1 triggers map straight to flags, nothing new to balance |  |
| 6 | ●●● | **Q34** | Resolve the persisted data-model gaps in §6.4 against the §2 type sketches: (a) how to store the est | Minimal: store subEngines (with per-strand high-water) on the estateWealth entry, sketch Combat | → Q2,Q3 |

### TIER P1 — high-impact · the economy spine, the climax, the save/determinism shape

| # | | Q | Decision | Rec | Notes |
|--:|:--:|:--|:--|:--|:--|
| 7 | ●●● | **Q7** | Fix the T0 balance gates and the tier-pillar-count framing. (a) What should the E2/R6 Estate floor b | Set E2/R6 Estate floor ≈ 0.6K. Keep three pillars (matches the authored deed budgets) and tight |  |
| 8 | ●●● | **Q14** | Make the T0 accrual ledger tie out. (1) What are the actual T0 koku sinks that take ~21.5K produced  | Pick the 'yields already net' model (simplest, kills the double-count) and restate the §4.0 hel | → Q7 |
| 9 | ●●● | **Q5** | Is the Tama/Otsuru truth reveal + Tahei claiming his true name SPINE-GUARANTEED at G6 for every play | Make it spine-guaranteed at G6 (protect the game's emotional heart for all players); recast O5  | ⚠ your call |
| 10 | ●●● | **Q29** | Fix the two broken halves of the T0 economic proof. (A) The T0 Estate ≥0.8K gate proof spends 72/560 | Re-itemize the T0 Estate 560 with LAND/TREASURY deeds (preserves the locked 'no market in T0'), | → Q7 |
| 11 | ●● | **Q36** | Determinism policy for growth-curve powers: (a) mandate integer-power-by-repeated-multiplication for | (a) — every exponent is an integer so repeated multiplication is fully deterministic and nearly | → Q2 |
| 12 | ●● | **Q44** | How should a FAILED autosave WRITE be handled? §6.8/§2.19 robustness language is entirely LOAD-side; | (A) — atomicity guarantee is non-negotiable on a single-slot autosave; the calm notice matches  | → Q3,Q34 |
| 13 | ●● | **Q13** | What are the v1 market/coin numbers? Specifically: (a) the koku↔coin sell/buy spread (broker convers | Strike '+ caps' (unbounded counts, consistent with exponential koku and the counts-only GameSta | → Q3 |
| 14 | ●●● | **Q24** | What does v1 actually ship as the T3 cliff-hanger stub node — the castle-town/Daikan first-contact ( | Ship the castle-town/Daikan first-contact (overwhelming doc-weight, and it opens a genuinely ne | ⚠ your call |
| 15 | ●● | **Q31** | Specify the soft-stamina/satiety system and whether it throttles combat. (A) Magnitudes: the rate-mu | Gentle curve, high floor, labour-only throttle — matches the 'never a wall, paces the day' inte | → Q1 |

### TIER P2 — real but contained · system specs, scope picks, save/UX hardening

| # | | Q | Decision | Rec | Notes |
|--:|:--:|:--|:--|:--|:--|
| 16 | ●● | **Q28** | Harden the sole release gate (§6.6 verifier) against the bug classes humans keep catching by hand. A | Add the gate-monotonicity/ceiling check and the real-name lint now (cheap, catch the exact recu | → Q7,Q14,Q27 |
| 17 | ●● | **Q4** | Wire FUN into §7 and assign the unowned locked systems. Should §7 add (a) a risk row 'R6 — the locke | Add the fun risk row and fun-proxy tasks; resolve fishing to T1-V2 (where the ford actually ope |  |
| 18 | ●● | **Q10** | Settle the progression-ladder reveal/gate spec. (a) Are the R4 Crafting tab and R5 Quest log new top | Treat Crafting/Quests as nested panels (soften §3.2 wording); reword R6/V3 spines to 'Estate-Se | → Q30 |
| 19 | ●● | **Q15** | Combat build content: which 2-3 weapon lines ship in v1, what gives each a distinct mechanical ident | Ship 3 lines (spear/sword/staff) with a light archetype profile (base-speed/reach/targetCount e | → Q1 |
| 20 | ●● | **Q25** | At the G6 climax, should a player who SKIPS the optional Origin track still reclaim the titular name | Option A — strip the name clause from the G6 spine line so the spine carries only the Otsuru tr | → Q5 · ⚠ your call |
| 21 | ●● | **Q37** | What storage-survival posture should v1 commit to for itch.io's cross-origin game iframe (third-part | matrix+nudge: make base64 export a periodically-nudged first-class backup (low cost, high payof |  |
| 22 | ●● | **Q16** | Combat resolution & difficulty rules: (1) What does a successful retreat resolve to mechanically — c | Make retreat a clean escape valve (carry HP/loot, modest clock cost, never dents Influence — an | → Q1 |
| 23 | ●● | **Q35** | For v1, do weather hazards and festivals carry MECHANICAL effects (needing §4 magnitudes AND a persi | If shipping the 'living world' pillar, go mechanical with bounded (±10%) modifiers + day-keyed  | → Q3 |
| 24 | ●● | **Q32** | How does a dented pillar's value return to its untouched highWater? The seasonal appraisal increment | Option (a) — a small below-high-water restore branch that does NOT advance highWater preserves  |  |
| 25 | ●● | **Q22** | The fun-doc (§5d/§7) promises a four-part T2 anti-slump 'package', but only two parts are authored ( | Author the seasonal-reward-rotation (high leverage, low §4.3 conflict) into §4.2.2/§4.8.3, and  | ⚠ your call |
| 26 | ●● | **Q17** | Two missing pacing-engine rules: (1) Define the soft-stamina/satiety→rate-multiplier function in §4  | Set STAMINA_RATE_FLOOR ≈ 0.3× with a flat-then-knee curve (only deep depletion bites) and add i | → Q31 |
| 27 | ●● | **Q43** | What storage-durability posture does v1 commit to for itch.io's cross-origin iframe embed, and shoul | (b) — it is the only path that actually catches silent autosave loss for most players and fixes | → Q37 |
| 28 | ●● | **Q33** | Define the durability wear/break model so M2b's deterministic reduce can apply it: (1) wear rate per | Binary (fixed wear, auto-unequip at 0, full-until-break) — simplest, most legible, avoids a sta | → Q2 |
| 29 | ●● | **Q19** | Three UX/data hardening calls: (1) Mobile IA — for the 3-5-slot bottom tab-bar, which screens are 'p | Mobile: per-tier primary rule (current-tier core on the bar, older to drawer in reveal order).  |  |
| 30 | ●● | **Q45** | Define the migration / pre-migration-backup lifecycle for §6.8. The spec says only 'a backup of the  | In-memory single atomic commit; raw bytes under a separate never-autosaved key; auto-rollback w | → Q44 |
| 31 | ●● | **Q40** | Resolve the diegetic-register and climax-duplication prose issues (§3). The load-bearing one: the gu | naming-on-spine: keep the naming on the guaranteed G6 spine (every player should reclaim the na | → Q5,Q25 |
| 32 | ●● | **Q8** | Does v1's T2 reach the start of E3 (requires authoring an E3 estate stage + a §4.7.5 cost and removi | Cap v1 at E2 Recovering (matches the only authored cost table and locked scope); change 'early  |  |
| 33 | ●● | **Q47** | satietyMax has no formula while its sibling hpMax does (40 + 8·characterLevel + 2·STR + gearHp), yet | (B) a flat stub for M1 to unblock the build, with a noted intent to promote to the (A) scaling  | → Q31 |
| 34 | ●● | **Q27** | Fix three authenticity issues that breach the human-locked 'fictionalise real names' canon (§1.13/A6 | Swap both surnames for invented ones (the leaks are conspicuous and on apex characters; don't r |  |
| 35 | ●● | **Q55** | Where should the §2.14(c) world-sim content (SeasonRules, Festival, WeatherHazard) be authored, and  | (c) — Festival is the only true keyed-entity gap; add a content/festivals.ts row to §6.5 and re | → Q35 |
| 36 | ●● | **Q18** | Accessibility completeness — pin four things the spec leaves open: (1) Where do colourblindMode/mute | Do the low-cost correctness items now (scope the live region to narration+milestone-only at ari |  |
| 37 | ●● | **Q38** | Resolve two un-audited presentation/asset risks for v1. (A) Emoji are load-bearing aesthetic carrier | Replace the load-bearing period motifs (pillar/season/rarity marks) with inline SVG and reserve |  |

### TIER P3 — clear-default / tune-later / release-only (mostly one-liners)

| # | | Q | Decision | Rec | Notes |
|--:|:--:|:--|:--|:--|:--|
| 38 | ●● | **Q11** | Settle the narrative canon loose ends. (a) Was the protagonist found at the weir or the village boun | Co-locate the boundary-jizō at the weir/ford; pick 'presumed dead → back from the dead' (higher | ⚠ your call |
| 39 | ●● | **Q26** | The locked Naoyuki rivalry→respect→brotherhood arc is heavily seeded in T0 but appears ZERO times in | Add one low-cost interstitial beat in T1 or early T2 — it protects the emotional payoff of a lo | ⚠ your call |
| 40 | ● | **Q46** | Should the save import/load path add (1) a constant game-identity/magic field (e.g. app:"kami-kakush | Add the magic field (cheap fast-reject); for stale ids prefer (a) reject-to-recovery — silent i | → Q44 |
| 41 | ● | **Q9** | Resolve terminology and romanization. (a) The word 'Standing' labels three mechanics (the 官威 'Standi | Rename the Arms rank-gate to 'Combat Rank' (cheapest disambiguation); macronize gōshi project-w |  |
| 42 | ● | **Q48** | --ink-faint #7A6C59 fails WCAG AA (4.5:1) on all three paper surfaces (4.23/3.66/3.31:1) yet carries | (b) — move functional hint/reason text to --ink-soft (passes on every surface) and keep --ink-f |  |
| 43 | ● | **Q52** | Lock the font delivery + licensing approach. The DRAFT stack is all SIL OFL Google Fonts; (a) Option | Lock Option B (kill Option A as network/GDPR-incompatible), rename the subset name table to cle |  |
| 44 | ● | **Q42** | Are these two genre-convention surfaces in scope for lean v1? (a) Bulk affordances — sell-N/sell-all | Decide the damper bulk-application rule now (progressive per-unit walk-down, so the damper stay | → Q13 |
| 45 | ● | **Q49** | Should irreversible/destructive in-game actions (material-consuming craft, sell, committed attribute | (a) — guard only the genuinely unrecoverable, rare actions (allocation, narrative-route, rare-m |  |
| 46 | ● | **Q50** | Audio (§2.21(a)/§6.9/M6) is the only v1 element outside the 'text + emoji + CSS' register, yet R4 ra | (C) synthesized Web Audio if the feel allows (kills the licensing/bundle/credits exposure outri |  |
| 47 | ● | **Q23** | The v1 quest-type budget is stated two ways: §7.1.1/§2.12/§1.11/D-012 say 'the 4 types' (PEST-CONTRO | Keep '4' as the repeatable-grind cut-set and add the one-line one-shot note + reword 'parked fo |  |
| 48 | ● | **Q21** | Reconcile two UI-bible palette/rate conflicts on the signature four-pillar panel (both fixes in ui-d | Fix the rate demo to a resource and have pillar bars show distance-to-next-gate. For the flash, | ⚠ your call |
| 49 | ● | **Q20** | The fun-factor reward-cadence proxy cites a 'recognised deed every ~4.5–5 min' as the untiered deed- | Make the deed cadence tier-relative and let the broad reward/number-jump clause (koku/XP/loot b | ⚠ your call |
| 50 | ● | **Q41** | Harden the single-source-of-truth doc surfaces (all low, no live drift today): (a) Name's per-deed-c | Lightweight now (tag derived values, choose Name's §4.0 display band-top + fix the gate gloss,  |  |
| 51 | ● | **Q56** | Do you want a minimal sustained-runtime perf/memory acceptance criterion (per-tick + render ms budge | (B) for now, with a noted intent to add the R7 row once the first M0/M1 profiling run gives rea |  |
| 52 | ● | **Q54** | Should the game define an in-product Credits/About surface (carrying authorship, the planned commit- | (a) — define the About/Credits subsection (small scope, pre-satisfies attribution + gives the b |  |
| 53 | ● | **Q12** | Low-severity canon/fun calls: (a) Rescope the Origin track's 'ZERO mechanical gift' phrasing (3 occu | Rescope the ZERO-gift phrase to the identity reveal; add Nihonbashi to the allow-list (or gener |  |
| 54 | ● | **Q39** | Authorial naming/cast hygiene (all low, several touch LOCKED canon). (a) Rename the non-locked T3 cl | Minimal: rename the two non-locked names (Naozane, Obaa Sato), re-glyph AGI→敏, add a Konoe row, |  |
| 55 | ● | **Q51** | Before any public release / itch.io upload (M7), what license(s) does the project adopt? There is no | Decide before M7; a split of permissive code (MIT/Apache-2.0) + proprietary-or-CC-BY content is |  |
| 56 | ● | **Q53** | What content rating and content-warning descriptors should the itch page declare, given themes of ch | (B) — near-zero cost, improves expectation-setting; add as a deploy-checklist step in §7.3/M7. |  |

---

## Already fixed (no decision needed)

**42 fixes applied this session** (clerical + the unambiguous defects: the two impossible-gate deadlocks Estate 1K→0.6K & Arms 0.4K→0.3K; the double-gated climax → spine-guaranteed; stale numbers synced; cut-canon propagated; save/GameState gaps; +more), each verified byte-exact and **re-verified in round 4** (1 regression caught & fixed). Detail: report §B / R2·C / R3·B / R4·D.

## Resolution log

*(Decisions made with the human, in order. This log → the PRD-improvement plan → the V2 reshape. ⚠ = changes a locked decision / adds scope, needs an ADR in V2.)*

> **Governing rule (ADR D-022):** these V2 Q&A decisions are AUTHORITATIVE — where one conflicts with a prior ADR / canon / K-item / lock, the V2 decision **supersedes** it (prior decisions annotated, not deleted).

### P0 — RESOLVED ✅ (2026-06-26)
- **Q1 — Character level = its own stored track, fed by COMBAT only.** Deeds/labour/non-combat actions NEVER raise it; HP + attribute points scale off it. (No labour→combat back door via the level/attribute economy.)
- **Q2 — RNG = per-named-stream persisted cursors** `{ seed, cursors: {combat,loot,seasonal,world-gen} }`; `tick()` takes **whole-integer dtTicks** (remainder app-side). Honours the canon "named sub-streams never perturb each other" + byte-identical replay.
- **Q3 — Persist market-saturation only**; flag-encode estate stage; **derive** weather/lunarPhase from a day-keyed RNG sub-stream; belief-beasts get their own `content/beliefBeasts.ts`. Honours "store only non-derivable."
- **⚠ Q6 — RELAX the no-labour→combat lock (D13) into a BOUNDED cross-feed.** EVERY skill (labour included) grants a **small, capped** combat bonus (per-level or per-milestone ~every 3–5 levels); balanced via differential level-speed + a level-cap on the combat benefit. Conditioning = the labour/combat **capability gate** (weak→capable). Big combat power stays combat-only (Q1); skills add bounded *texture*. → **ADR D-022 relaxes D13**; bonus size/cadence/caps are §4 numbers tuned in V2/playtest.
- **⚠ Q34 — Feature-rich data model: intra-line dialogue branching IS in v1** (`choices[]` + `ChoiceId`). Plus nest `estateWealth.subEngines{land,treasury,trade}` so the trade-≤⅓ clamp has storage, and sketch `CombatEncounterState`.
- **⚠ Q30 — Numeric rung meter (a real §4 curve), gated by BOTH meter AND story.** A rung advances only when **(a)** its numeric EstateService/CombatStanding **meter** clears a per-rung threshold **AND (b)** its **story milestones** are met. The meter is incremented by **rung-specific, story-consistent activities** (not all actions bump it). The four **Influence pillars are a separate track**; an influence threshold MAY be one criterion for some rungs. **Double-counting allowed** (one deed → rung meter + pillars + house). → §4 gains a third balance curve (rung meter · pillars · XP).

| Q | Decision made | Rationale | Date |
|:--|:--|:--|:--|
| _(P1 next)_ | | | |

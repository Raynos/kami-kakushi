# PRD Battery & Stress-Test — Findings & Decision Report

**Date:** 2026-06-26  ·  **Target:** `docs/prd.md` (4,833 lines) + canon/ADR/intent cross-docs  
**Method:** a 3-phase multi-agent workflow — **14 independent hostile-auditor lenses** attacked the PRD in
parallel; **every finding was handed to an independent skeptic** that re-read the source to refute or confirm
it; a synthesis pass deduped across lenses and split clerical fixes from design decisions.  
**Scale:** 93 agents · 78 raw findings → **60 confirmed** after adversarial verification (18 refuted/dropped).  
**Raw snapshot:** [`brainstorms/raw/2026-06-26-prd-battery-review.json`](raw/2026-06-26-prd-battery-review.json) (verbatim insurance).

> **TL;DR.** The PRD is in strong shape — internally serious, canon-aware, and mostly self-consistent. The
> audit found **no story/vision drift** from your `prd_human_feedback.md` intent (the no-magic, mediocre-start,
> no-management-sim, trade-≤⅓, active-only, 70/30, ≥30-min-floor constraints all hold). The real issues are
> **(1) an undefined character-level model** that blocks combat, **(2) three disagreeing save/persistence
> enumerations**, **(3) the RNG sub-stream spec contradicting its own locked determinism canon**, **(4) fun
> never wired into the milestone plan**, **(5) the T2 emotional climax gated two incompatible ways**, and
> **(6) one logically-impossible T0 balance gate**. I applied **22 clerical fixes directly**; the **12
> questions below** are the ones that need you.

---

## A. Cross-cutting risks (the systemic themes)

1. The level/XP model is the single biggest systemic hole: 'character level', 'Combat Level', and 'mobLevel' are all referenced but undefined and (for the first two) unstored, yet they feed HP, the attribute-point economy, combat XP, and a global skill-XP multiplier — and the undefined XP source is a potential labour→combat back door that the §4.5.3 type-wall and the locked mediocre-start invariant don't cover. Blocks M2.

2. Three 'persisted surface' enumerations (§2.19 prose, §6.4 typed GameState, §6.8 save list) are mutually inconsistent and omit non-derivable state (location, market saturation, estate stage/roster, weather, durability, dents, tier, live combat, log, vitals) — a structural save/resume risk that recurs across ~10 findings; §6.4's own 'store only non-derivable state' rule is violated.

3. The locked determinism guarantee (splitmix64 named sub-streams that never perturb each other) is contradicted by the actual §6.7 single-counter / split-from-parent spec, a stale mulberry32 option, and an unspecified tick-quantization model — putting byte-identical replay and forward-stable saves at risk.

4. Pervasive 'summary/dashboard vs authoritative table' drift (Name JUDGE_K, XP-curve figures, E3 stage names, kanji 政威, Arms-gate framing, two-vs-three pillar counts) — the doc duplicates derived data instead of generating it, violating the project's 'single source of truth — generate, don't duplicate' rule, so multiple places silently diverge from source.

5. Fun — the project's explicitly #1 quality bar — is owned only by living docs and is never wired into the §7 milestone plan or risk register; the locked ~28.5h grind could pass every verify-green pacing/visual gate while shipping 'balanced but a slog', with several locked systems (attributes, fishing, Name bar) also unassigned to any build phase.

6. Stale superseded-spine remnants leak cut canon back in (Kuzuhara personal tie/birthplace, the Jūbei 'rescue', the rejected 政威 glyph) — a builder reading any one summary in isolation could reintroduce content the human explicitly rejected; the locked decisions are correct but the propagation is incomplete.

---

## B. Trivial fixes — APPLIED DIRECTLY (22)

These were clerical/safe (typos, broken links, stale numbers that contradict an authoritative table in the
same doc, stale status markers, and propagation of **already-locked** canon). Each `old_string` was re-verified
byte-exact and each number re-derived before applying. **All land in this commit — review and revert any you dislike.**

| # | Finding | File | What changed |
|---|---|---|---|
| 1 | `numbers-balance-2` | `prd.md` | §4.9 dashboard Name JUDGE_K is stale; the authoritative §4.2.2 derivation (0.30·TIER_REF_NAME = 15K/140K) gives 4,500/42,000. Arms/Estate/Office already match. |
| 2 | `numbers-balance-3` | `prd.md` | Illustrative cumulative-XP figures recomputed from the stated authoritative formula (XP_BASE=50, XP_GROWTH=1.18): L10=1,176, L25=17,130, L50=1,090,653. |
| 3 | `combat-math-6` | `prd.md` | §4.6.1's formula makes baseSpeed the SPD-0 anchor; §4.6.2 mis-attributed the unmodified 1.0 to SPD 5. |
| 4 | `combat-math-7` | `prd.md` | §4.4 STR cell omits STR's defense and hpMax contributions that §4.6.1 implements. CORRECTED to a cell-level replacement (the finding's original new_string was a full table row, which would duplicate the row prefix). |
| 5 | `narrative-canon-1` | `prd.md` | Line 463 reattaches the MC's near-death disaster + lost-child resolution to Kuzuhara, contradicting LOCKED canon (Kuzuhara = region node only, no personal tie; survivor NPC CUT). Reconstructed from the verdict and verified verbatim against  |
| 6 | `narrative-canon-2` | `prd.md` | 'birthplace' (§1.5.3) asserts an MC origin tie to Kuzuhara, contradicting the no-personal-tie canon; 'hamlet' is the canon term. |
| 7 | `vision-pillars-3` | `prd.md` | §5 first-fight beat made Jūbei's arrival a rescue cause, contradicting the canon 'never rescued, then beg Jūbei' mediocre-start beat (§2.8, §3.2) and its own next sentence. |
| 8 | `tech-architecture-1` | `prd.md` | §6.4 GameState had no current-location field though the travel intent writes it and §2.19 persists it. (Dedup: same issue as save-determinism-3, which proposed `location: AreaId` after the unlocked line — applied once here to avoid adding t |
| 9 | `tech-architecture-5` | `prd.md` | The Influence type's own comment says 'dents recorded here' but had no dent field; §6.8/§2.19 persist dents and §4.2.4 mandates ≤1 active dent per pillar (Dent / null). |
| 10 | `save-determinism-5` | `prd.md` | Equipment referenced ItemInstanceId with no instance store and inventory is counts-only, so per-instance durability (§2.10 EquipState; persisted per §2.19) had no home. Mirrors the canonical §2.10 EquipState shape. |
| 11 | `save-determinism-2` | `prd.md` | §6.8 save list omitted stored fields §6.4 mandates: current vitals, tier (locked stored per §6.13 #4), the live combat encounter (§6.4 mid-fight resume), and the event log. CORRECTED to a block-level old_string verified against lines 4170-4 |
| 12 | `systems-catalog-6` | `prd.md` | §6.5's 'one shape everywhere' Rewards object omits pillarDeltas, though §2.1/§2.12/§7 route pillar accrual through that bus. CORRECTED to an inner-braces replacement (the finding's original new_string re-wrapped the whole `Rewards object (. |
| 13 | `tech-architecture-4` | `prd.md` | §6.7 offered 'mulberry32 or splitmix64' as an open choice though splitmix64 is locked (§6.13 #2, H4, D-013). Pins the algorithm; the sub-stream model itself is a separate human question. |
| 14 | `scope-pacing-r0-1` | `prd.md` | Scopes the pacing test to grind rungs (exempts the ~5-min R0 cold-open per §4.8.1) and relabels 'CI-enforced' as 'verify-gate-enforced' to match the locked no-hosted-CI constraint (§7.3). |
| 15 | `cross-references-1` | `prd.md` | From docs/prd.md the canon doc is one level up; the §3/§4/§7 preambles over-climb with '../../' (404). APPLY TO ALL OCCURRENCES — this substring appears 6× across lines 1715/2225/4319 (needs replace-all); the already-correct line 34 uses '. |
| 16 | `cross-references-2` | `prd.md` | §4 preamble's ADR-log link over-climbs to repo-root/history (404); from docs/prd.md the correct path is history/decisions.md (matching the working line-4 form). CORRECTED to a path-only swap (the finding's original new_string also pulled in |
| 17 | `cross-references-3` | `prd.md` | §1.5.2 is the Village reputation web; the estate-stage parking lives in §1.5.1 (cited two words earlier on the same line). |
| 18 | `endgame-coherence-2` | `prd.md` | §5 T3.1 names E3 'Prosperous' / E4 'Fortified Seat', but the E3-E5 range gloss starts at E4's name. NOTE: the same gloss also appears at §1.5.1 (~L261) and §5 T2.4 (~L3561) and needs the same edit — exact strings for those two not captured  |
| 19 | `endgame-coherence-3` | `decisions.md` | ADR D-008 still lists the rejected coinage 政威; the §5 authenticity pass resolved it to 官威 throughout prd.md. Annotates (don't-delete convention) rather than silently swapping. Covers cross-references-6. NOTE: decisions.md line text not re-v |
| 20 | `intent-fidelity-2` | `prd_human_feedback.md` | H2 still marked deferred (⏳) though J4 marks the same pass RESOLVED and it is fully applied in prd.md. Stale status marker in the intent record. NOTE: prd_human_feedback.md line text not re-verified in this pass. |
| 21 | `endgame-coherence-2`(+) | `prd.md` | Propagated the E3-name gloss fix to the 2 further occurrences (§1.5.1 L261, §5 T2.4 L3561) the synthesis flagged but didn't capture. |
| 22 | `cross-references-1` | `prd.md` | The broken `../../brainstorms/...` canon link fixed at **all 6** occurrences (replace-all). |

**Two of these touch record files, not the PRD** — flagged for your eyes: `endgame-coherence-3` annotates ADR
D-008 in `decisions.md` (政威→官威, annotate-don't-delete), and `intent-fidelity-2` flips your `prd_human_feedback.md`
H2 marker from ⏳ to ✅ (it contradicted J4 in the same file). Revert if you'd rather keep those as-is.

---

## C. Decision queue — 12 questions for you

Ordered by severity. Each is a real design/balance/story/scope fork the audit could not resolve without you.
I've given a recommendation on each; **"go with your recs" is a valid answer** and I'll apply them.

### Q1. [HIGH] Define the level model and the attribute system, and close the labour→combat back door. (a) How does 'character level' accrue and on what curve (its own XP track + GameState field, or DERIVED from total skill XP)? It drives hpMax (§4.6.1), +1 attribute point per 2 levels (§4.4), and a 'compounding skill-XP multiplier' (§2.7) — none of which are computable today. (b) Is the §2.8 'character Combat Level' (CombatDeedsPool) a distinct mechanic (needs curve/effect/stored combatXp), a synonym for character level, or just framing for Arms accrual? (c) Where does mobLevel come from for the §4.6.5 combat-XP formula (an authored MobDef.level vs derived from dangerRing)? (d) May freely-allocatable per-level attribute points fund combat-feed STR/AGI if labour XP feeds the level (the §4.5.3 wall doesn't cover them)? (e) Should INT's '+0.5% damage vs bestiary' be wired into §4.6 or struck from §4.4 (it's currently a combat dump-stat under no-respec)? (f) Which milestone builds the attribute system + character-XP loop + allocation UI, since M2a consumes it but no phase builds it?

**Context.** Three undefined 'levels' (characterLevel, Combat Level, mobLevel) are load-bearing for HP, the build economy, combat XP, and a global multiplier; the gap blocks M2 and threatens the locked no-labour→combat-cross-feed invariant. Pick one canonical name per concept and add the missing stored fields to §6.4.

**Options:**
- Character level DERIVED from total skill XP (remove from §2.19/§6.4 'stored', add derivation + multiplier formula)
- Character level as its own STORED combat-sourced XP track (add field + curve; ties HP/builds to combat, cuts against peaceful-labour texture)
- Merge 'Combat Level' into character level and delete the redundant term

**My recommendation.** Make character level its own stored track but source it from combat/deeds-inclusive XP (not raw labour) so labour-funded points can't silently raise STR/AGI; define the multiplier magnitude; add MobDef.level; assign the build to M1 (store + loop) with the allocation/combat read at the head of M2a.

<sub>Related findings: `combat-math-2`, `systems-catalog-1`, `systems-catalog-2`, `vision-pillars-2`, `combat-math-4`, `combat-math-3`, `scope-attributes-1`</sub>

### Q2. [HIGH] Pin the RNG sub-stream model and persisted shape. Canon D-013a/H4 lock 'splitmix64 + named sub-streams (combat/loot/seasonal/world-gen) that never perturb each other' and 'persist seed + stream cursors' (plural), but §6.7 specifies a single `{ seed, counter }` whose children are 'split from the parent counter' (order-dependent; couples the streams; one counter can't hold four cursors). Which scheme? Also confirm the fixed-timestep tick model: does the app loop call tick() only with whole-integer dtTicks (remainder kept app-side) so live play is frame-rate-independent and the byte-identical guarantee is over the recorded (intents, integer-tick) script?

**Context.** The whole 'byte-identical replay / saved fight resumes identically' promise and forward-stability across content additions rest on this. Then update §6.7/§6.4/§6.8/§2.19 to match.

**Options:**
- Each named stream carries its own persisted cursor in GameState (RngState = { seed, cursors: Record<StreamName, number> }); matches canon literally
- Streams re-derived deterministically per (name, epoch) and consumed within one tick, so only the master cursor + combat's CombatEncounterState cursor persist (simpler save)

**My recommendation.** Adopt per-named-stream cursors derived as splitmix64(hash(seed, name)) with each cursor monotonic and persisted; keep mid-fight combat RNG in CombatEncounterState. Add the integer-dtTicks accumulator sentence to §6.3/§6.9.

<sub>Related findings: `tech-architecture-3`, `save-determinism-1`, `save-determinism-6`</sub>

### Q3. [HIGH] Reconcile the persisted surface and content catalog. For each of {market-saturation state, estate stage/built-structures/roster, current weather + lunarPhase}, is it a STORED non-derivable field to add to §6.4/§6.8, or DERIVED/flag-encoded and struck from §2.19? (Market saturation and durability look clearly stored — durability is being applied as a trivial fix; weather and estate-stage are the genuine calls.) Separately, where does the canon-mandated SEPARATE belief-beast/rumour registry live in §6.5's catalog (one combined module vs one-type-per-module rows)?

**Context.** §6.4's 'store only non-derivable state' rule is contradicted by §2.19/§6.8: market saturation evolves per-day and has nowhere to live; estate/weather may be derivable. §6.5 omits the belief-beast registry that the 'no belief-creature in spawn tables' type-guard depends on.

**Options:**
- Add `market: MarketState` + `estate: EstateStage`(+roster) to §6.4/§6.8 (store)
- Encode estate state in flags/producers and re-derive weather from a day-keyed RNG sub-stream (derive; remove from §2.19)

**My recommendation.** Store market saturation (clearly non-derivable) and durability; derive weather from the day-keyed RNG sub-stream; decide estate-stage explicitly (flag-encoded is cleanest) — then make all three lists agree. Add a `content/beliefBeasts.ts` row (or a lore module) tagged as the source the §6.6 verifier reads.

<sub>Related findings: `tech-architecture-2`, `save-determinism-4`, `systems-catalog-5`</sub>

### Q4. [HIGH] Wire FUN into §7 and assign the unowned locked systems. Should §7 add (a) a risk row 'R6 — the locked ~28.5h grind ships balanced but reads as a slog / has dead-time / no visible next goal' and (b) explicit fun-proxy instrumentation tasks (dead-time, reward/unlock cadence, always-a-visible-next-goal, first-5-min hook) in M1/M3/M6 alongside the pacing harness, cross-referencing fun-factor.md and qa-playtesting.md? And: which tier/milestone owns fishing (the §2.6 T0-R5/R6 vs roadmap T1-V2 contradiction), and does M4 own the Name & Honour bar's first-light (it first scores at the first T1 season per §4.2.2)?

**Context.** Fun is the project's #1 stated quality bar (CLAUDE.md, prd_human_feedback K2/K3) but is owned only by living docs and never gated by the milestone plan. Fishing (a locked skill) and the Name bar's reveal have no owning phase.

**Options:**
- Amend §7 to own fun-proxies + a fun risk row, and assign fishing/Name explicitly
- Leave fun to living docs only and accept it isn't milestone-gated

**My recommendation.** Add the fun risk row and fun-proxy tasks; resolve fishing to T1-V2 (where the ford actually opens) and correct §2.6; give M4 the Name bar first-light test.

<sub>Related findings: `scope-fun-1`, `scope-fishing-1`, `scope-name-pillar-1`</sub>

### Q5. [HIGH] Is the Tama/Otsuru truth reveal + Tahei claiming his true name SPINE-GUARANTEED at G6 for every player, or genuinely GATED behind completing the optional Origin track (O5) and therefore officially missable?

**Context.** This is the stated emotional peak of T2. §3.6 G6 narrates it for everyone, but §3.6.2/M6 gate it on the optional Origin-Ties meter; a min-maxer hits G6 without O5. A builder cannot implement both, and it determines whether the warmest payoff is guaranteed or skippable.

**Options:**
- Spine-guaranteed at G6; Origin track only adds depth/warmth (reunions, Osen, Jinpachi)
- Origin-gated at O5; officially missable

**My recommendation.** Make it spine-guaranteed at G6 (protect the game's emotional heart for all players); recast O5 as the Origin REUNION completing (warmth/buff) that echoes the beat. Then align §1.5.3, §3.6, §3.6.2, §5 T2.2/T2.7, and the M6 verifier, and ensure it fires exactly once.

<sub>Related findings: `player-experience-1`</sub>

### Q6. [HIGH] What is 'conditioning', exactly — a single labour-built enablement gate granting ZERO combat stats, or a combat drill skill that grants STR/AGI, or two distinct things? §1/§2.8 call it labour-built with ZERO combat bonus while §4.5.3's type-wall lists 'conditioning's combat facet' as granting STR/AGI.

**Context.** This is the load-bearing mediocre-start / no-hidden-edge invariant (A3, D-011). The contradiction would let a builder type conditioning as 'combat' and re-open the exact labour→combat cross-feed the PRD says it killed.

**Options:**
- Single labour-built ZERO-bonus gate — drop 'conditioning's combat facet' from §4.5.3's STR/AGI list and type it non-combat
- A combat drill skill that grants STR/AGI — stop calling it 'labour-built' in §1/§2.8
- Two separately-named things: a labour capacity gate + a combat drill skill

**My recommendation.** Option (a) or (c): keep conditioning as a labour-built ZERO-bonus gate and, if a combat-drill stat path is wanted, give it a distinct name so the type-level wall is unambiguous.

<sub>Related findings: `vision-pillars-1`</sub>

### Q7. [HIGH] Fix the T0 balance gates and the tier-pillar-count framing. (a) What should the E2/R6 Estate floor be? It's set at 1K but Estate accrual over all of T0 maxes at 0.8K (the next-rung T0→T1 gate), making E2 unbuildable and R6 unleaveable — Arms' R6 floor is 80% of its gate, which for Estate gives ~0.64K. (b) Do the T1→T2 and T2→T3 gates require THREE pillars (the §4.1 table: +Office, +Arms 30K — already assumed by the deed budgets and M5) or TWO (per the §1.6.3 'one or two pillars / Arms secures roads' framing)? (c) How do the 30 T0 Arms deeds (350 ip) distribute across R5/R6/R7, and is R5's 'Arms→~0.25K' snapshot a typo (~6 deeds at 8-20 ip give only ~120 ip)?

**Context.** (a) is logically impossible as written and would deadlock a CI pacing run. (b) a hard Arms ≥30K gate forces even a pure peaceful/commercial route to grind martial deeds, cutting against the 'win it your own way' philosophy; but removing it voids the §4.8.3 21K-Arms-deed budget.

**Options:**
- Lower E2/R6 Estate floor to ~0.5-0.6K (apply at §4.7.5 and §4.8.1)
- Keep 3 required pillars and reword §1.6.3/§2.16 framing to 'two or three' (naming Arms as a T2 gate)
- Drop the Arms 30K / Office 2K thresholds to honour the 2-pillar framing (re-derive §4.8 pacing)

**My recommendation.** Set E2/R6 Estate floor ≈ 0.6K. Keep three pillars (matches the authored deed budgets) and tighten the §1.6.3/§4.8.3 prose to stop implying only two. Fix R5's Arms snapshot to ~0.1K and enumerate the R5/R6/R7 Arms-deed split.

<sub>Related findings: `numbers-balance-1`, `endgame-coherence-1`, `numbers-balance-4`, `intent-fidelity-1`</sub>

### Q8. [MEDIUM] Does v1's T2 reach the start of E3 (requires authoring an E3 estate stage + a §4.7.5 cost and removing E3 from the parked list), or does v1 cap the estate at E2 with E3-E5 fully parked (then drop 'early E3' from §3.6/§5 T2)? And confirm the canonical E3-E5 names (likely E3 Prosperous, E4 Fortified Seat, E5 Restored-and-Surpassed) so the three range glosses can be aligned.

**Context.** §3.6/§5 T2 promise 'early E3' but §2.17/§7.1.2/§4.7.5 lock E0-E2 with no authored E3 cost — a builder following the locked scope ships E2. The E3-E5 glosses also mislabel E3's slot with E4's name.

**Options:**
- Cap at E2; drop 'early E3' phrasing
- Author an E3 stage + cost; un-park E3

**My recommendation.** Cap v1 at E2 Recovering (matches the only authored cost table and locked scope); change 'early E3' to 'E2 Recovering' in §3.6/§5 T2; keep E3-E5 as parked T3+ flavour with corrected names.

<sub>Related findings: `progression-ladder-1`, `cross-references-4`, `endgame-coherence-2`</sub>

### Q9. [MEDIUM] Resolve terminology and romanization. (a) The word 'Standing' labels three mechanics (the 官威 'Standing & Office' pillar, the Arms rank-gate 'Combat Standing', and 'Arms standing' deeds) — which keeps 'Standing' and what do the others become? (b) Romanization policy: normalize 郷士 to 'gōshi' project-wide (incl. frozen ADR/brainstorm canon) per the macron lock, or bless 'goshi' as an exception? Pick one canonical form for 'ronin'/'rōnin' too. (c) Is an in-game glossary/codex or a §6.6 'gloss-on-first-use' verifier needed for Edo terms (goyōkin, sankin-kōtai, han — all T3/T4 content)?

**Context.** The §6.6 macron-lint is blind to allow-listed terms, so gōshi/ronin drift will silently ship. The 'Standing' overload sits on the four-pillar hero scoreboard.

**Options:**
- Rename the Arms rank-gate 'Combat Standing' → 'Combat Rank'/'Martial Prowess' so 'Standing & Office' owns the word
- Rename the 官威 pillar's English label instead
- Macronize gōshi/rōnin everywhere
- Add a gloss-on-first-use rule or in-game codex

**My recommendation.** Rename the Arms rank-gate to 'Combat Rank' (cheapest disambiguation); macronize gōshi project-wide and pick one ronin form; defer glossary to when T3/T4 is built (v1 terms are already glossed).

<sub>Related findings: `terminology-standing-collision`, `terminology-romanization-goshi`, `terminology-romanization-ronin`, `terminology-glossary-accessibility`</sub>

### Q10. [MEDIUM] Settle the progression-ladder reveal/gate spec. (a) Are the R4 Crafting tab and R5 Quest log new top-level nav nodes (add to the §3.5 ladder) or panels nested under an existing screen (soften §3.2's 'tab'/'log' wording)? (b) Are R5→R6 and V2→V3 gated by the Estate-Service RANK meter (reword the §3.2.1/§3.4.1 spines) or the Estate & Wealth PILLAR (promote them in §3.9)? (c) Is the tier-expansion map one object at R6 (fix §1.5.1/§1.12) or a distinct R7 strategic map? (d) How is `state.tier` committed — an explicit `advance_tier` intent or an auto-commit in reduce when thresholds+story-gate are met?

**Context.** These are spec-clarity inconsistencies between the detailed §3 ladder and the §1 summaries / §6 contract; (d) changes the reducer contract and DEV-API surface.

**My recommendation.** Treat Crafting/Quests as nested panels (soften §3.2 wording); reword R6/V3 spines to 'Estate-Service threshold' (match the RANK tags + §3.9); place the map at R6 in all four spots; and make tier-up an auto-commit in reduce when the story-gate flag + thresholds are met, removing the 'tier-up intent' wording.

<sub>Related findings: `progression-ladder-2`, `progression-ladder-3`, `progression-ladder-4`, `tech-architecture-6`</sub>

### Q11. [MEDIUM] Settle the narrative canon loose ends. (a) Was the protagonist found at the weir or the village boundary-stone/jizō (both tagged 'where he was found'; the lone residual-ambiguity offering is anchored to the boundary-stone)? (b) Did the origin family believe Tahei DEAD (§1.8) or AWAY/LOST (§3.6.2/§5)? (c) Rename the T0 field-lad 'Mago' to remove the prefix collision with locked antagonist 'Magobei'? (d) Confirm the Kuzuhara no-personal-tie rewrite (applied as a trivial fix).

**Context.** (a) destabilises the single A2 ambiguity beat; (b) is the difference between 'back from the dead' and 'long-absent returned' for the game's warmest payoff; (c) risks conflating a friendly peer with a named antagonist.

**Options:**
- Co-locate the jizō at the weir (one find-spot)
- Pick one grief register and apply across §1.8/§3.6.2/§5
- Rename the field-lad (e.g. Tasuke/Kuma/Hachi)

**My recommendation.** Co-locate the boundary-jizō at the weir/ford; pick 'presumed dead → back from the dead' (higher catharsis) and apply consistently; rename the field-lad.

<sub>Related findings: `narrative-canon-3`, `narrative-canon-5`, `narrative-canon-4`, `narrative-canon-1`</sub>

### Q12. [LOW] Low-severity canon/fun calls: (a) Rescope the Origin track's 'ZERO mechanical gift' phrasing (3 occurrences) to mean only 'no retroactive stat/recipe/tool/combat bonus from the backstory reveal' — since the track DOES grant the ~10-15% speedup and a 'modest global skill-XP buff'; confirm the skill-XP-buff framing is intended. (b) Add 'Nihonbashi' to the §6.6 allow-list (a district of already-allowed Edo) or genericize it to 'the capital's banzuke'? (c) Do T2's brokering/diplomacy/arbitration verbs need a distinct 'contested meter' mechanic spec (§2.15), or do the existing rivals-tradeoff choice + §5d anti-slump levers suffice?

**Context.** These are contained flavour/scope nits, but (a) feeds the §6.6 machine-checked invariants and (c) touches the longest tier's freshness.

**My recommendation.** Rescope the ZERO-gift phrase to the identity reveal; add Nihonbashi to the allow-list (or genericize); accept T2's social verbs as deed-framed but rely on the rivals-tradeoff + seasonal/cross-pillar levers (no new mechanic required).

<sub>Related findings: `vision-pillars-4`, `vision-pillars-5`, `player-experience-5`</sub>

---

## D. Full findings catalog (60 confirmed, by cluster)

For traceability. Every confirmed finding, grouped under its synthesis cluster (ranked by severity). `[T]` =
a trivial fix already applied (§B); `[H]` = feeds a question (§C).

### [HIGH] Undefined level model blocks combat HP, the attribute-point economy, and a locked anti-cross-feed invariant

*Sections: §2.7, §2.8, §4.4, §4.5, §4.6, §6.4*  
Three load-bearing 'levels' are referenced but never defined or stored. `characterLevel` drives hpMax (§4.6.1) and the attribute-point cadence (§4.4: +1/2 levels) plus a 'compounding skill-XP multiplier' (§2.7), yet §4.5 defines only per-SKILL curves and §6.4's GameState stores no level/xp field — while §2.7c/§2.19 say it IS stored. A separate 'character Combat Level' (CombatDeedsPool, §2.8) is named in §1/§2 but absent from §4 and §6.4. `mobLevel` (§4.6.5 combat-XP) has no field in MobDef (§2.9c). Because the character-level XP source is undefined, freely-allocatable per-level attribute points are a potential labour→combat back door (vision-pillars-2) that the §4.5.3 type-wall doesn't cover. This blocks M2 combat and the whole build economy.

- **`combat-math-2` [H]** — _high_ — hpMax and the attribute-point economy depend on 'characterLevel', but no character-level XP curve/accrual is defined (only per-skill curves) — and the term collides with 'Combat Level' / 'combatLevel'  
  <sub>docs/prd.md §4.6.1 line 2765; §4.4 line 2661; §2.7 line 1063; §4.5 (lines 2683-2696); §2.8 line 1098; §4.3 line 2621</sub>  
  Evidence: §4.6.1: "hpMax = 40 + 8·characterLevel + 2·STR + gearHp". §4.4: "**Attribute points:** **+1 point every 2 character levels**". §2.7: "Character level + XP grants HP, satiety capacity, attribute points...". But §4.5 (the only XP-curve section) defines exclusively PER-SKILL curves: "xpForLevel(L) = round( XP_BASE * XP_GROWTH^(L-1) )" for skills — there is NO character-level curve, no statement of what feeds character XP, nor its value at any rank (R3's characterLevel is unstated). Separately, §2.8 calls it "a **character Combat Level** (a Combat Deeds pool: combat-XP + a deed-count...)" and §4.3  
  → Q: "Character level" is load-bearing for two core systems — hpMax (§4.6.1: 40 + 8·characterLevel + …) and the attribute-point economy (§4.4: +1 point per 2 character levels) — but it is never defined: §4.5 gives only per-skill XP curves, §6.4's stored GameState has no character-xp/level field, and canon only ever named a "character COMBAT level." Three questions: (1) How is character level earned and  

- **`systems-catalog-1` [H]** — _high_ — "Character level" is load-bearing but its XP source / level curve is never defined, and the §6.4 GameState omits it  
  <sub>docs/prd.md §2.7 (line 1063), §4.4 (line 2661), §4.6.1 (line 2765), §6.4 (lines 4048-4049); §2.19 (line 1604)</sub>  
  Evidence: §4.6.1 line 2765 makes character level a combat input: `hpMax = 40 + 8·characterLevel + 2·STR + gearHp`. §4.4 line 2661: "**Attribute points:** **+1 point every 2 character levels**, plus milestone grants." §2.7 line 1063: "Character level + XP grants HP, satiety capacity, attribute points, and a compounding skill-XP multiplier." But §4.5 ("Per-skill XP curves") defines ONLY per-skill curves — there is no curve, XP source, or formula anywhere for *character* level or for the promised "compounding skill-XP multiplier." Worse, the canonical GameState (§6.4 lines 4048-4049) stores `character: { h  
  → Q: How does 'character level' accrue and on what curve? §4.5 only defines per-SKILL curves, yet §4.6.1 (hpMax = 40 + 8·characterLevel), §4.4 (+1 attribute point per 2 character levels) and §2.7 (HP/satiety-cap/skill-XP-multiplier per level) all depend on it. Is it (a) derived from total skill XP — so it must leave the §2.19/§6.4 save and gain a derivation rule — or (b) its own stored XP track needing  

- **`systems-catalog-2` [H]** — _medium_ — "Combat Level" (a CombatDeedsPool) is introduced in §2.8/§1 but never defined in §4 and not stored in §6.4 — and is ambiguous against "character level"  
  <sub>docs/prd.md §2.8 (lines 1098, 1124); §1 (line 93); §6.4 (line 4060); §4 (absent)</sub>  
  Evidence: §2.8 line 1098: "It carries a **character Combat Level** (a Combat Deeds pool: combat-XP + a deed-count of kills / clears / defends)" and line 1124: "`CombatDeedsPool { combatXp, deedCounts (kills/clears/defends), perEventCap }` → the Combat Level and a gated **Arms** contribution." §1 line 93 lists it as a carried element distinct from "weapon/martial skills." Yet the term "Combat Level" appears NOWHERE in §4 (no curve, no derivation, no mechanical effect), and §6.4 stores no `combatXp`/deeds pool — only `counts: Record<CountId, number>` (line 4060: "kills, clears, harvests"). It is also uncl  
  → Q: Is 'character Combat Level' (§2.8, from a CombatDeedsPool of combat-XP + kill/clear/defend counts) a distinct mechanic, or terminology for character level / weapon-skill level / Arms accrual? §4 never defines it and §6.4 stores no combatXp pool. If real, define its curve, effect, and stored field; if not, remove the term and re-point §2.8/§1.  

- **`vision-pillars-2` [H]** — _medium_ — Undefined "character level" XP source + freely-allocatable attribute points = an unclosed labour→combat back door the §4.5.3 wall doesn't cover  
  <sub>docs/prd.md §2.7 line 1063, §4.4 line 2661 vs §2.8 line 1098; §4.5 (no character-XP curve)</sub>  
  Evidence: §2.7(a) L1063: "**Character level + XP grants HP, satiety capacity, attribute points**, and a compounding skill-XP multiplier." §4.4 L2661: "**Attribute points:** **+1 point every 2 character levels**, plus milestone grants" — with no constraint on allocating them to combat-feed STR/AGI. The no-cross-feed wall (§4.5.3 L2723-2731) only constrains MILESTONE grants and the labour-skill→attribute field; it never touches these free per-level points. Crucially, the PRD never defines how this "character level" gains XP: §4.5 defines only per-SKILL curves, and §2.8 L1098 separately defines a combat-so  
  → Q: The "character level" that grants +1 attribute point every 2 levels (§2.7a/§4.4 L2661) has no defined XP source, and is named differently from the combat-sourced "character Combat Level" (§2.8 L1098). Decide: (1) Is there ONE character level or TWO (a general one + the Combat Deeds pool)? (2) What feeds the attribute-point-granting character level — combat XP only, or an aggregate that includes la  

- **`combat-math-4` [H]** — _medium_ — On-kill Combat-XP formula uses 'mobLevel', but MobDef (§2.9c) has no level field — undefined variable  
  <sub>docs/prd.md §4.6.5 line 2798 vs §2.9(c) line 1159</sub>  
  Evidence: §4.6.5: "**Combat XP** = `mobLevel · COMBAT_XP_K`, then per-event capped (§4.5.2). `COMBAT_XP_K = 12`". The MobDef data shape in §2.9(c) is "`MobDef { id, kind (...), dangerRing, stats (Combatant base), lootTableId, spawnWeightByRing, isGrindable (true), bestiaryEntryId }`" — it has no `level` field. So `mobLevel` is referenced by the XP formula but never defined in the mob data model (nor derived from dangerRing anywhere).  
  → Q: Combat XP per kill (§4.6.5) is defined as `mobLevel · COMBAT_XP_K`, but `mobLevel` is never defined: MobDef (§2.9c) carries `dangerRing` and `stats (Combatant base)` but no `level`, and the Combatant shape has no level either. How should a mob's level be sourced for the XP formula? Options: (a) add an explicit authored `level` field to MobDef (most control, more to hand-author per bestiary entry);  

### [HIGH] Three 'persisted surface' enumerations (§6.4 GameState / §6.8 save list / §2.19) disagree and omit non-derivable state

*Sections: §6.4, §6.8, §2.19, §2.4, §2.10, §2.17, §2.2*  
§6.4's typed GameState, §6.8's save list, and §2.19's prose persist-list contradict each other and drop fields that §6.4's own 'store only non-derivable state' rule requires: current location/area (set by the travel intent), market-saturation state (§2.4 MarketState), estate stage/built-structures/roster (§2.17), current weather/lunarPhase (§2.2), per-instance equipment durability (§2.10 — equipment is stored as a bare ItemInstanceId with no instance store), the active-dent slot (§6.4's own comment says 'dents recorded here' but the type has none), and §6.8 also omits stored tier, the live combat encounter, the event log, and current vitals. As written, market damper, estate build state, durability, dents, and location reset on reload or are unrepresentable. Several are clean clerical adds (location, dent slot, durability via EquipState, §6.8 list, Rewards bus); market-saturation/estate-stage/weather stored-vs-derived is a genuine design call.

- **`tech-architecture-2` [H]** — _high_ — §6.4/§6.8 stored surface omits non-derivable state that §2.19 explicitly persists (market saturation, estate stage/structures/roster, weather, equip durability)  
  <sub>docs/prd.md §6.4 (lines 4041-4065) & §6.8 persist list (lines 4169-4173) vs §2.19 (lines 1603-1608), §2.4 (line 974), §2.17 (lines 1536-1542), §2.2 (line 911)</sub>  
  Evidence: Three sections claim to enumerate the persisted surface and disagree. §2.19 (lines 1603-1608) persists "...equip state + durability... reputation/meters... estate stage + built structures + roster, market saturation state". §2.4 defines `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` (line 974) and §6.3 (line 4016) recovers "the market-saturation damper" per-day — path-dependent, non-derivable. §2.2 (line 911) defines `WorldClock { ... lunarPhase, weather }`. But §6.4's GameState has no market field, no estate-stage/structures/roster field, no weather field, and no per-inst  
  → Q: Which of {market-saturation state, estate stage/built-structures/roster, current weather, equipped-item durability} are truly STORED non-derivable fields (and must be added to §6.4/§6.8), versus derivable/encoded-by-flags (and should be struck from §2.19's persist list)? The three 'stored surface' enumerations currently contradict each other.  

- **`save-determinism-4` [H]** — _high_ — §6.4 GameState has no home for MarketState (saturation) or estate stage/structures/roster — both treated as live, persisted, non-derivable state elsewhere  
  <sub>docs/prd.md §6.4 L4041-4065 vs §2.4 L974, §6.3 L4016, §2.17 L1536, §2.19 L1607-1608</sub>  
  Evidence: §2.19 L1607-1608 persists "estate stage + built structures + roster, market saturation state". §2.4 L974 defines `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` and §6.3 L4016 runs "the market-saturation damper recovering" per-day — i.e. an evolving, non-derivable value. §2.17 L1536 defines `EstateStage { id, econFabric[], martialFabric[], rosterCards[], pillarFloor, rankFloor … }`. The §6.4 GameState interface (L4041-4065) contains NO field for either MarketState or EstateStage/roster (grep of L4031-4078 finds no 'market'/'saturation'/'estate'/'roster').  
  → Q: §6.4's GameState interface is meant to be the single authoritative "store only non-derivable state" save shape, but it omits two things §2.19 says must persist: (1) market-saturation state (`MarketState{perGoodPriceIndex, saturationByGood, recoveryRate}` from §2.4 — a per-day-evolving, history-dependent, non-derivable value per §6.3), and (2) estate stage + built structures + roster (`EstateStage`  

- **`tech-architecture-1` [T]** — _medium_ — GameState has no current-location field, yet the `travel` intent writes it and §2.19 persists it  
  <sub>docs/prd.md §6.4 GameState interface (lines 4041-4065); cf. §6.3 Intent line 3990, §2.19 line 1605</sub>  
  Evidence: The stored `GameState` (§6.4, lines 4041-4065) enumerates clock, resources, producers, skills, character, inventory, equipment, influence, tier, ranks, reputation, allegiance, flags, unlocked, quests, counts, effects, combat?, log, settings — but there is NO `currentArea`/`location` field. `unlocked: Set<SurfaceId>` is only "panels/screens/areas the player has earned" (line 4058), i.e. WHICH areas are reachable, not WHERE the player currently is. Yet §6.3 defines `/ { type: 'travel'; areaId: AreaId }` (a verb whose entire job is to change current location), and §2.19's persist list (line 1605)  
  → Fix: Add a `currentArea: AreaId` (set by the `travel` intent) to the stored GameState in §6.4 (and to the §6.8 persist list).  

- **`save-determinism-3` [T]** — _medium_ — §6.4 GameState has no field for the player's current location/area, which §2.19 lists as persisted non-derivable state  
  <sub>docs/prd.md §6.4 L4041-4065 (no location field) vs §2.19 L1606</sub>  
  Evidence: §2.19's persist list (L1603-1608) includes "current location" as non-derivable state to save. The §6.4 GameState interface (L4041-4065) has NO `location`/`currentArea` field — it stores `clock`, `resources`, ... `unlocked: Set<SurfaceId>` (panels/areas earned), `quests`, `counts`, etc., but nothing recording WHERE the player currently is. The `travel` intent (§6.3 L3990 `{ type: 'travel'; areaId: AreaId }`) mutates location, so it is genuinely non-derivable; `unlocked` only records which areas are reachable, not the current one. A grep of §6.4 (L4031-4078) finds no `location`/`area:`/`currentA  
  → Q: How should current position be modelled in GameState — a single `location: AreaId`, or a richer travel/position state (e.g. mid-travel between areas)? It is missing entirely from §6.4 despite §2.19 persisting it; pick the representation and add it to the stored surface.  

- **`tech-architecture-5` [T]** — _medium_ — §6.4 Influence type `{ value, highWater }` omits the dent field its own comment and §6.8/§2.19 say is stored  
  <sub>docs/prd.md §6.4 line 4052 vs §6.8 line 4170, §2.19 line 1606, §2.16 line 1475, §4.2.4 (lines 2601-2606)</sub>  
  Evidence: §6.4 line 4052: `influence: Record<PillarId, { value: number; highWater: number }>;  // 4 pillars; dents recorded here` — the inline comment says "dents recorded here" but the type has no dent field. §6.8 line 4170 persists "influence pillars (value + high-water + **dents**)"; §2.19 line 1606 persists "Influence pillar values + **dents** + high-water marks"; §2.16(c) defines `Dent { pillar, amount, scriptedSourceId, recoverable }` (line 1475); and §4.2.4 (line 2602) requires "**max one dent active per pillar**" — which is unrepresentable without storing whether a dent is currently active.  
  → Fix: Add an active-dent slot to the stored Influence record to match §6.8/§2.19/§4.2.4.  

- **`save-determinism-2` [T]** — _medium_ — §6.8 (and §2.19) persisted-surface list omits stored fields §6.4 mandates: tier, the live combat encounter, the event log, and current vitals  
  <sub>docs/prd.md §6.8 L4169-4173 vs §6.4 L4048-4049, L4053, L4062, L4063; corroborated by §6.13 resolution #4 L4309-4312; §2.19 L1603-1608</sub>  
  Evidence: §6.8 L4169-4173 declares "The save is the **stored** surface of `GameState`:" then enumerates "schemaVersion, RNG (seed + counter), clock, resources, producer counts, skill xp, base attributes, inventory, equipment, influence pillars (value + high-water + dents), ranks, reputation, allegiance, flags, unlocked surfaces, quest status, counts, active-effect remainders, settings." This omits four NON-derivable fields the §6.4 interface stores: (a) `tier: TierId` (L4053) — and §6.13 resolution #4 L4309-4312 explicitly locks tier as STORED, 'rather than re-deriving tier purely from pillars on every   
  → Fix: Make §6.8's enumeration a faithful mirror of §6.4's stored interface by adding stored tier, the live combat encounter (when a fight is in progress), the capped event log, and current vitals (hp/satiety/attribute-points). Same fix for §2.19's list.  

- **`save-determinism-5` [T]** — _medium_ — Equipment references `ItemInstanceId` but no instance store exists for durability/quality; inventory is counts-only — durability has no persisted home  
  <sub>docs/prd.md §6.4 L4045/L4051 vs §2.10 L1192-1196, §2.19 L1606</sub>  
  Evidence: §6.4 L4051 equips by instance id: `equipment: Partial<Record<EquipSlot, ItemInstanceId>>`, and L4045 stores inventory as counts only: `inventory: Record<ItemId, number>; // counts (quality folded into the item key)`. There is NO `instances: Record<ItemInstanceId, …>` map anywhere in GameState (grep finds `ItemInstance` only at L4051). Yet §2.10 L1192-1196 defines per-instance, continuously-varying durability (`EquipDef { … durabilityMax … }`, `EquipState { slot → { equipDefId, durability, qualityTier } }`, `Durability { current, max, repairCost }`) and §2.19 L1606 persists "equip state + durab  
  → Q: How are durability-bearing equipment instances modelled in GameState — a separate `instances` map keyed by ItemInstanceId, or an EquipState carrying durability per slot? §6.4 references ItemInstanceId with no backing store while inventory is counts-only; pick the model so durability (§2.10/§2.19) can persist.  

### [HIGH] RNG sub-stream + tick model contradicts the locked named-sub-stream determinism canon

*Sections: §6.7, §6.4, §6.8, §6.3, §6.9*  
Canon D-013a/H4 locks 'splitmix64 + named sub-streams (combat/loot/seasonal/world-gen) that never perturb each other' and 'persist seed + stream cursors' (plural). But §6.7 specifies a single `{ seed, counter }` whose children are 'split from the parent counter' — order-dependent, couples the streams, and cannot hold four independent cursors (only combat has its own persisted cursor). §6.7 also still offers 'mulberry32 or splitmix64' as an open choice though splitmix64 is locked (trivial). Separately, dtTicks integer-quantization / app-layer accumulator is unspecified, so the byte-identical-replay guarantee implicitly depends on a recorded tickScript. Live single-runs are still deterministic; the risk is forward-stability across content additions and reload-exact sub-stream resume.

- **`tech-architecture-3` [H]** — _medium_ — RNG sub-stream model in §6.7 (split from a single parent counter) contradicts the locked 'named sub-streams that never perturb each other' canon  
  <sub>docs/prd.md §6.7 (lines 4143, 4146, 4151-4152), §6.4 (line 4042), §6.8 (line 4170) vs canon D-013 (docs/history/decisions.md:138) & §6.13 #2 (line 4304)</sub>  
  Evidence: Canon D-013 locks: "One seeded RNG = splitmix64 ... drawn through **named sub-streams** (combat / loot / seasonal / world-gen) **so systems never share or perturb each other's draws**" (decisions.md:138; echoed H4 / §6.13 #2 line 4304 "splitmix64 + named sub-streams"). But §6.7 (lines 4151-4152) says: "For independent sub-streams ... we **derive child RNGs by splitting from the parent counter**". Splitting from a single shared parent counter is order-dependent: drawing from combat advances the parent and therefore changes what weather/loot draw — the exact 'perturb each other's draws' the cano  
  → Q: The locked canon (D-013a) requires "named sub-streams (combat/loot/seasonal/world-gen) that never perturb each other's draws" and "persist stream cursors", but §6.7 specifies a single `{ seed, counter }` persisted state with child RNGs "split from the parent counter" (order-dependent; non-combat streams would share one cursor). Which scheme do you want pinned? (a) Each named stream carries its own  

- **`save-determinism-1` [H]** — _high_ — Persisted RNG shape `{ seed, counter }` cannot represent the canon's named sub-streams — reload and repeated encounters are non-reproducible  
  <sub>docs/prd.md §6.7 L4146 + L4151-4152; §6.4 L4043; §6.8 L4170; vs canon docs/history/decisions.md L138/L140 (D-013a) and prd_human_feedback.md H4 L268-269</sub>  
  Evidence: §6.7 L4146 pins the persisted shape to a SINGLE scalar counter: "(`state.rng = { seed, counter }`) and is **saved & loaded**". §6.7 L4151-4152 then derives sub-streams by drawing from that one counter: "For independent sub-streams (e.g. a fight's rolls vs. weather) we **derive child RNGs by splitting** from the parent counter, so each subsystem is reproducible without coupling". But the LOCKED canon (D-013a, decisions.md L138) mandates "drawn through **named sub-streams** (combat / loot / seasonal / world-gen) so systems never share or perturb each other's draws" and its consequence (L140) is   
  → Q: Canon D-013a/H4 locks "splitmix64 + named sub-streams (combat/loot/seasonal/world-gen) that never perturb each other" and "persist seed + stream cursors" (plural), but PRD §6.7 currently describes a single `{ seed, counter }` whose children are "split from the parent counter" (which couples the streams and contradicts the independence guarantee). To conform the PRD, confirm the intended persisted   

- **`tech-architecture-4` [T]** — _low_ — §6.7 still offers 'mulberry32 or splitmix64' as an open choice, but splitmix64 is LOCKED  
  <sub>docs/prd.md §6.7 line 4143 vs §6.13 #2 (line 4304), H4 (prd_human_feedback.md:269), canon D-013 (decisions.md:138)</sub>  
  Evidence: §6.7 line 4143: "A small, fast, well-distributed generator (e.g. **mulberry32** or **splitmix64**), seeded at new-game from a stored seed." But §6.13 #2 (line 4304) records "RESOLVED: RNG algorithm → splitmix64 ... locked as **splitmix64** with named sub-streams", H4 (feedback line 269) "RNG = splitmix64", and canon D-013 (decisions.md:138) "One seeded RNG = splitmix64". Offering mulberry32 as a live option contradicts the lock.  
  → Fix: State splitmix64 as fixed (the lock), drop mulberry32 as an option.  

- **`save-determinism-6` [H]** — _low_ — dtTicks integer-quantization / app-layer accumulator is unspecified — live play is frame-rate-dependent and the 'byte-identical replay' guarantee silently depends on a recorded tickScript  
  <sub>docs/prd.md §6.3 L4004-4005, L4021-4023, L4025-4027; §6.9 L4215-4217</sub>  
  Evidence: §6.3 L4004-4005 types `tick(state, dtTicks: number)` with the comment "dtTicks is ABSTRACT (active-play ticks)", and L4021 says "`dtTicks` is computed by the **app-layer** loop from real elapsed time *while the tab is active*" (echoed §6.9 L4216 "computes `dtTicks` from elapsed active time"). Nothing states dtTicks is an integer tick count, nor that an app-layer accumulator carries the fractional remainder so that two machines at different frame rates over the same active wall-time converge on the same integer tick total. The determinism guarantee L4025-4027 is `replay(initialState, [intents…]  
  → Q: Confirm the fixed-timestep model: the active loop accumulates real elapsed time and calls `tick` only with whole-integer dtTicks (remainder kept app-side, not persisted), making live play frame-rate-independent. Should this accumulator semantics be written into §6.3/§6.9?  

### [HIGH] §7 milestone roadmap omits the FUN quality bar and gives no build task to several locked v1 systems

*Sections: §7.0-§7.4, §7.4.1, §2.6, §2.7, §4.2.2*  
§7 instruments PACING and VISUALS exhaustively but never the FUN-proxies (dead-time, reward/unlock cadence, always-a-visible-next-goal, first-5-min hook), and the §7.4.1 risk register (5 rows) never names 'the locked ~28.5h grind ships balanced but reads as a slog' — contradicting CLAUDE.md and prd_human_feedback K2/K3 which call fun the #1 gap. Three locked v1 systems also have no owning phase: the rich attribute system + character level + allocation UI (consumed by M2a combat but never built), fishing (a locked skill with contradictory T0-R5/R6 vs T1-V2 introduction), and the Name & Honour bar's first-light beat (Estate/Arms/Office each have one; Name does not).

- **`scope-fun-1` [H]** — _high_ — §7 milestones + risk register entirely omit the FUN dimension and its fun-proxy instrumentation, despite fun being a first-class v1 quality bar  
  <sub>docs/prd.md §7.0–§7.4 (lines 4338–4799); risk register §7.4.1 (4781–4787)</sub>  
  Evidence: A full-text scan of §7 (lines 4316–4833) finds ZERO occurrences of 'fun', 'dead-time', 'engagement', 'slog', 'playtest', 'fun-factor', 'qa-playtesting', 'reward cadence', or 'always-a-visible-next-goal'. §7 instruments PACING exhaustively (M1 'per-rung ≥30-min-floor pacing instrumentation', M6 'headless pacing-instrumentation harness') but never the FUN-PROXIES. The risk register §7.4.1 lists exactly five rows — R1 scope-creep, R2 balance-tuning-time, R3 save-migration, R4 art/feel, R5 combat-density — none covering 'the 28.5 h of grind ships balanced but reads as a slog / has dead-time / no v  
  → Q: §7's milestone roadmap (esp. M6) and the §7.4.1 risk register instrument PACING (time budgets) and VISUALS (capture-game-states sweep) but never the FUN-proxies (dead-time, reward/unlock cadence, always-a-visible-next-goal, first-5-min hook) that prd_human_feedback K2/K3 and CLAUDE.md make a first-class v1 bar — and fun is never named as a risk. Should §7 be amended to (a) add a risk row 'R6 — the  

- **`scope-attributes-1` [H]** — _medium_ — The rich attribute system (STR/AGI/INT/SPD/LUCK + character level + attribute-point allocation) is consumed by combat in M2a but never explicitly built by any milestone phase  
  <sub>docs/prd.md §7.2 M1 phase 2 (4495) & M2a phases 1/3 (4526, 4528); cf. §2.7 (1057–1088), §4.4 (2643–2661)</sub>  
  Evidence: The attribute system is load-bearing (D13; §2.7 'the rich attribute system… STR/AGI/INT/SPD/a luck stat'; §2.7(e) line 1086 'T0 — attributes exist from the open'; §4.4 line 2661 '+1 point every 2 character levels'). M1 'Lands' nominally cites §2.7, but its phases build only SKILLS: phase 2 'grants per-skill XP… derives **levels** from the §4.5.1 curve' (line 4495) — skill levels, not character level/attributes. M2a then CONSUMES attributes as a combat input without building them: phase 1 'baseSpeed + SPD coefficient' / phase 3 'a post-drills MC (~weaponSkill 5 / **attrs 10**)' (lines 4526, 452  
  → Q: §2.7/§4.4's attribute system (5 attributes, character level, +1pt/2 levels, allocation UI, milestone perks) is assumed by M2a's combat numbers but never built in any milestone's phases. Which milestone should own it — M1 (attributes exist from T0) or the head of M2a (combat's first consumer) — and should the allocation/perk surface ship then too?  

- **`scope-fishing-1` [H]** — _medium_ — Fishing — a LOCKED v1 skill — has no milestone that builds it, and its introduction timing is contradictory (§2.6 says T0 R5–R6; the ford only opens at T1-V2)  
  <sub>docs/prd.md §7.1.1 (4378), §7.2 M1 phase 1 (4494) & M4 phase 2 (4615); cf. §2.6 (1051), §3.2 R2 ladder (no ford in T0)</sub>  
  Evidence: §7.1.1 (line 4378) lists 'farming · foraging · woodcutting · **fishing** · smithing · cooking' as the LOCKED v1 skill set. But no milestone phase introduces fishing: M1's registries author 'the ~4 T0 labour skills' and its labour loop is explicitly 'farming → foraging → woodcutting → hauling' (lines 4478, 4494) with areas 'Kura, Gate & Forecourt, Home Paddies, Stables & Woodlot Edge, Near Satoyama' — no ford. M2a/M2b are combat; M3 (R4–R7) covers cooking and smithing but never fishing. The fishing node first appears in the roadmap at M4 phase 2: 'V2 … opens the Ford/Weir' (line 4615). Yet §2.6  
  → Q: Fishing is a locked v1 skill but no milestone builds it, and §2.6 (T0 R5–R6) conflicts with the roadmap (Ford/Weir opens at T1-V2). Where does fishing come online — T0 (add the ford to M3) or T1 (fix §2.6 and keep it in M4-V2) — and which milestone phase owns it?  

- **`scope-name-pillar-1` [H]** — _low_ — The fourth Influence pillar (Name & Honour) has no milestone that owns its 'bar first lights/scores' reveal, though the four-bar panel is defined to reveal bar-by-bar  
  <sub>docs/prd.md §7.2 M3 phase 5 (4587) & M4 DoD (4609) / M4 phase 6 (4619); cf. §4.2.2 (2479, 2510)</sub>  
  Evidence: §7.1.1 (line 4380) ships 'the four pillars… the four-bar panel'. M3 phase 5 (line 4587) reveals the panel 'revealing ONE bar at a time as each pillar first scores (Estate from the shinden, Arms from R6's recorded standing, **Office/Name shown faint/not-yet-scored**)'. Office's first-light is then explicitly owned by M4 ('the Office bar first lights at V4', line 4609; M4 phase 6 'the Standing & Office bar lights', line 4619). But NO milestone assigns Name & Honour's first-light moment. Per §4.2.2 (line 2510) Name's seasonal budget is JUDGE_K = 4,500 at T1 (0 at T0), and Name = sqrt of (armsHW+e  
  → Q: The four-bar panel reveals bar-by-bar 'as each pillar first scores', but only Estate/Arms (M3) and Office (M4-V4) have a defined first-light beat. §4.2.2 has Name & Honour first scoring at the first T1 season — should M4 explicitly own the Name bar's first-light (and assert it), or is Name intended to stay 'faint' through v1?  

### [HIGH] Emotional climax (Tama/Otsuru reveal + true name) gated two incompatible ways

*Sections: §3.6, §3.6.2, §5, §7-M6*  
The game's stated emotional peak is documented as BOTH a guaranteed spine beat fired at G6 for every player (§3.6 G6 log line, §5 T2.2/T2.7 main-quest 'PAYOFF') AND a payoff that lands only on the fully-optional, skippable Origin track's O5 capstone (§3.6.2, gated on the Origin Ties meter; M6 verifier asserts Origin 'NEVER' gates the spine). A min-maxing spine-only player reaches G6 without O5. Determines whether the climax is guaranteed or officially missable; a builder cannot implement both.

- **`player-experience-1` [H]** — _high_ — The emotional climax (Tama/Otsuru + Tahei's true name) is documented as BOTH a guaranteed spine beat AND a payoff that only lands on the fully-optional, skippable Origin track  
  <sub>docs/prd.md §3.6 (line 2027), §3.6.2 (lines 2088, 2097), §5 T2.2 (line 3491), §5 T2.7 (line 3628), §7 M6 (line 4658)</sub>  
  Evidence: §3.6.2 line 2088: "The **Tama-payoff** (Otsuru) and **Tahei claiming his true name** land on this track's capstone." and the O5 row (line 2097) gates it on "`RANK` Origin Ties (the track completes; coincides with the G6 spine beat)" — i.e. the OPTIONAL Origin meter being maxed. The milestone (line 4658) demands the verifier assert the Origin track "NEVER appears as a spine trigger". BUT §5 T2.7 line 3628 calls it "**[THREAD: Tama]** — the spine's personal payoff (also a main-quest beat...)" and §5 T2.2 line 3491 lists "**The lost-child truth resolves (alliance-broker). [THREAD: Tama] — PAYOFF.  
  → Q: The Tama/Otsuru truth reveal and Tahei claiming his true name is the stated emotional climax of T2, but the PRD gates it two incompatible ways. Decide ONE and make §1.5.3, §3.6 (overview + G6 row), §3.6.2 (line 2088 + O5 row), §5 T2.2 beat 7, §5 T2.7, and the M5/M6 verifier rule all agree: (A) SPINE-GUARANTEED — the Otsuru reveal + name-claim fire at G6 on the Office/Story gate for every player re  

### [HIGH] 'Conditioning' breaks the locked no-labour→combat-cross-feed invariant

*Sections: §1.2, §1.5.1, §2.8, §1.13, §4.5.3*  
§1.2/§1.5.1/§2.8/§1.13 repeatedly fix conditioning as labour-built with ZERO combat stat bonus (the load-bearing mediocre-start / A3 / D-011 invariant), but §4.5.3's type-level no-cross-feed wall lists 'conditioning's combat facet' as a combat-skill milestone that may grant STR/AGI. Either reading contradicts a binding constraint; a builder encoding §4.5.3 could silently re-open the exact cross-feed the doc says it killed.

- **`vision-pillars-1` [H]** — _high_ — "Conditioning" is called labour-built / ZERO-combat-bonus in §1, but §4.5.3 lets its "combat facet" grant STR/AGI — the killed cross-feed reappears  
  <sub>docs/prd.md §1.5.1 line 202, §2.8 line 1104, §1.13 line 1364 vs §4.5.3 line 2730</sub>  
  Evidence: Pillars/contract repeatedly fix conditioning as labour-built and combat-stat-free: §1.5.1 L202 "**Labour conditioning is a one-way enablement gate** on combat rungs (it unlocks them; it grants ZERO combat stat bonus)"; §2.8 L1104 "gated behind labour-built **conditioning** (a one-way enablement gate that grants **ZERO combat stat or training-rate bonus**)"; §1.2 pillar 4 L96 "capacity is earned through labour-built conditioning, with **no labour→combat training-rate cross-feed**." But §4.5.3 L2730 classifies conditioning as a COMBAT skill that may grant combat attributes: "Only **combat-skill*  
  → Q: What is "conditioning," exactly? Option (a): a SINGLE labour-built enablement gate that grants ZERO combat stats — in which case §4.5.3 L2730 must drop "conditioning's combat facet" from the STR/AGI grant list, leaving only "weapon lines," and conditioning must be typed non-combat in the no-cross-feed wall. Option (b): a combat-category drill skill that legitimately grants STR/AGI — in which case   

### [HIGH] T0 balance gates are internally impossible / inconsistent

*Sections: §4.7.5, §4.8.1, §4.1, §4.2.1*  
R6/E2 require Estate Influence ≥ 1K, but Estate accrual over all of T0 tops out at exactly 0.8K (the T0→T1 gate, reached only at R7). On an up-only curve the player hits the 0.8K tier gate before ever reaching 1K, so E2 is unbuildable and R6 unleaveable — a CI/verify pacing test driving the spine would deadlock. Mirroring Arms' R6 floor (80% of gate) suggests Estate ≈ 0.5-0.6K. Separately the §4.8.1 R5 'Arms→~0.25K' snapshot can't be produced by ~6 deeds at 8-20 ip (~120 ip max), and the 30 Arms deeds' distribution across R5-R7 is under-specified vs the 'evenly ~9-10 min per pillar' claim.

- **`numbers-balance-1` [H]** — _high_ — R6/E2 require Estate Influence ≥ 1K, which EXCEEDS the T0→T1 Estate gate of 0.8K (the very next rung) — impossible on an up-only curve  
  <sub>docs/prd.md §4.8.1 line 2960 (R6) and §4.7.5 line 2904 (E2); vs §4.1 line 2316 / §4.8.1 line 2961 (T0→T1 gate)</sub>  
  Evidence: R6 (line 2960): "**2K koku** (build E2); **Estate ≥ 1K** + Arms ≥ 0.4K". E2 gate (line 2904): "**Estate ≥ 1K** + Arms ≥ 0.4K, rank ≥ R6". But the T0→T1 gate one rung LATER (R7, line 2961) is "**Arms ≥ 0.5K · Estate ≥ 0.8K** (the §4.1 gate)", and §4.1 line 2316 = "Estate ≥ 0.8K ip". The §4.2.1/§4.2.2 accrual delivers EXACTLY 0.8K Estate over all of T0 (560 deed-ip + 240 seasonal-ip = 800), reached only at the R7 capstone (final autumn, season 8). Because Estate is up-only/monotone, the player hits the 0.8K tier gate BEFORE ever reaching 1K — so R6 can never be left as written, and the 1K floor   
  → Q: E2/R6 require Estate Influence ≥ 1K, but the next rung (R7) is the T0→T1 gate at Estate ≥ 0.8K, and §4.2.1/§4.2.2 deliver exactly 0.8K Estate over all of T0 (only reached at R7). On an up-only curve the player reaches the 0.8K gate before 1K, so R6 is unleaveable. What should the E2/R6 Estate floor be? (Arms' R6 floor is 0.4K = 80% of its 0.5K gate; mirroring that gives Estate ≈ 0.5–0.6K.)  

- **`intent-fidelity-1` [H]** — _low_ — §4.8.1 T0 pacing table: per-rung Arms-deed counts cannot produce the stated Arms ip or the claimed 30-Arms total (Arms-accrual onset vs cadence are internally inconsistent)  
  <sub>docs/prd.md §4.8.1, lines 2959, 2966 (cross §4.2.1 lines 2412-2413, line 2408)</sub>  
  Evidence: §4.8.1 R5 row (line 2959): "/ **R5 Gate-guard** ... / **first DEFEND deed (20 ip)** + ~6 Arms deeds (Arms→~0.25K); ~5 Estate deeds; Combat Standing x2 / ~80 koku/min / **~40 min** /". The table also asserts Arms deeds only START at R5 (line 2959: "**Arms deeds BEGIN accruing**"; standing recorded at R6) yet claims the T0 total is "**30 Estate + 30 Arms** = ~56–60 total recognised deeds, one act every ~4.5–5 min (**≈9–10 min per individual pillar**)" (line 2966). The authoritative §4.2.1 itemization (lines 2412-2413) makes T0 Arms = 350 ip from 30 deeds (20 minor@8 + 5 road@18 + 5 defend@20). A  
  → Q: §4.8.1 says Arms deeds begin at R5 but the T0 total must be 30 Arms deeds / 350 ip. How should the 30 Arms deeds spread across R5/R6/R7 (and is R5's 'Arms→~0.25K' the intended snapshot, since ~6 deeds at 8–20 ip can only give ~120 ip)? This is a balance-distribution call, not a clerical fix.  

### [MEDIUM] Tier-gate framing: two-vs-three required pillars (is Arms a hard gate or 'secures roads'?)

*Sections: §1.6.3, §2.16, §4.1, §4.8.3*  
§1.6.3/§2.16/§4.1-prose frame gating as 'the one or two pillars' (early=Arms+Estate, upper=Office+Name) and call T2's Arms merely 'secures roads', but the §4.1 gate TABLE lists THREE hard thresholds at both middle gates (T1→T2 Arms 5K+Estate 8K+Office 2K; T2→T3 Estate 60K+Office 50K+Arms 30K), and §4.8.3's deed budget fully derives Arms 30K. An implementer can't tell if Arms ≥30K is a hard blocker into the castle-town; it also conflicts with the peaceful/commercial-route philosophy. (Held numbers-balance-4's prose fix out of trivial-apply pending this design call.)

- **`endgame-coherence-1` [H]** — _medium_ — Tier-gating spec contradicts itself: '§1.6.3 one or two required pillars' vs §4.1 three-threshold T1→T2 and T2→T3 (the v1 end-gate into the castle-town)  
  <sub>docs/prd.md §1.6.3 (lines 408-411, 421) vs §4.1 (lines 2306, 2318, 2330-2336); reaffirmed in §7.2 M5 (line 4657)</sub>  
  Evidence: §1.6.3 line 408-411 states the gating model: "each tier names the one or two pillars that must clear a stated threshold to advance, and the required pillars drift per tier — early tiers require Arms + Estate ('survive and get strong'); upper tiers require Office + Name ('win it socially')". §1.6.3 T2 row (line 421) lists only "Estate + Office rising; Arms secures roads" (Arms framed as supporting, not a gate). §4.1 line 2306 repeats the pair-framing: "The required pillars drift per tier (early = Arms+Estate; upper = Office+Name)". But the §4.1 gate TABLE lists THREE hard thresholds at the two   
  → Q: Should the T1→T2 and T2→T3 gates require THREE pillars (the §4.1 table: Arms+Estate+Office, then Estate+Office+Arms) or TWO (per the §1.6.3 'one or two pillars / Arms+Estate / Office+Name' framing)? Trade-off: a hard Arms ≥ 30K gate at T2→T3 forces every player — including the peaceful/commercial route — to grind martial deeds before reaching the castle-town, which tightens difficulty but cuts aga  

- **`numbers-balance-4` [T]** — _low_ — Arms ≥ 30K is a hard required gate at T2→T3, but §4.8.3 and §1.6.3 frame the T2 required pillars as 'Estate + Office' with 'Arms secures roads'  
  <sub>docs/prd.md §4.1 line 2318 & §4.8.3-G7 line 3018 (gates) vs §4.8.3 header line 3007 & §1.6.3 line 421 (framing)</sub>  
  Evidence: §4.1 (line 2318) T2→T3 gate: "Estate ≥ 60K · Office ≥ 50K · **Arms ≥ 30K**"; §4.8.3 G7 (line 3018) repeats "Estate ≥ 60K · Office ≥ 50K · **Arms ≥ 30K** (§4.1 v1 end-gate)". Yet §4.8.3's header (line 3007) says "Required pillars drift to **Estate + Office** (Arms secures roads)" and §1.6.3 (line 421) lists the T2 required pillars as "**Estate + Office** rising; **Arms** secures roads". So Arms is a third hard threshold at the v1 end-gate, but the narrative framing presents it as supporting, not required.  
  → Q: At T2→T3 (the v1 end-gate), is Arms ≥ 30K a hard co-required threshold (3 required pillars, as §4.1 and §4.8.3-G7 both list) or merely supporting (the 'Arms secures roads' / 'drift to Estate+Office' framing)? If hard, the descriptive prose should stop implying only 2 required pillars; if supporting, Arms should be removed from the gate tables.  

### [MEDIUM] Stale superseded-spine: Kuzuhara reattaches the MC's personal tie / birthplace (violates locked 'region node only')

*Sections: §1.7, §1.5.3, §5*  
§1.7 world table (line 463) says the drowned Kuzuhara hamlet is 'the disaster that nearly killed Tahei' and that 'the backstory and lost-child evidence resolve here', and §1.5.3 calls Kuzuhara the MC's 'birthplace' — both directly contradict the locked canon (restated 4+ times in §5 and prd_human_feedback) that Kuzuhara is a region node with NO personal tie; the MC's caravan died at the Pass and his origin resolves via the Sawatari-juku family. Timeline also rules it out (Kuzuhara drowned ~50y ago vs the MC ~18-20). Fix direction is locked, so applied as trivial.

- **`narrative-canon-1` [T]** — _high_ — §1.7 world table reattaches the MC's origin to Kuzuhara — violates the locked 'no personal tie to Kuzuhara'  
  <sub>docs/prd.md:463</sub>  
  Evidence: §1.7 world table line 463: "**Kuzuhara — re-foundable upstream hamlet & embankment river-works** / T2 / **Spine.** The faction-3 fusion: the drowned hamlet (the disaster that nearly killed Tahei) becomes a resettlement node ... Access-only, grind-built; the backstory and lost-child evidence resolve here." This directly contradicts the locked canon, repeated 4+ times: §5 T2.2 line 3485-3487 "*(Kuzuhara is a region node with **no personal tie to the MC's identity** — his origin/backstory and the lost-child evidence resolve through the **dream → the Sawatari-juku family** (beats 3 & 7), not here.  
  → Q: Confirm the Kuzuhara framing is a region node with NO personal tie to the MC (his caravan died at the Pass; his backstory + the lost-child evidence resolve via the Sawatari-juku family). May §1.7 line 463 drop '(the disaster that nearly killed Tahei)' and 'the backstory and lost-child evidence resolve here', replacing them with the Sadamune root-sin / name-the-drowned framing used in §5?  

- **`narrative-canon-2` [T]** — _medium_ — §1.5.3 calls Kuzuhara the MC's 'birthplace' — stale, contradicts the no-personal-tie canon  
  <sub>docs/prd.md:317</sub>  
  Evidence: §1.5.3 line 317: "(The re-foundable **Kuzuhara** birthplace and the wider post-town commercial region are T2+ expansion nodes — see §1.7.1.)" Calling Kuzuhara a 'birthplace' asserts a personal/origin tie to the MC, contradicting §5 T2.5 line 3591 "the MC has **no personal tie to Kuzuhara**" and prd_human_feedback.md line 129 "Kuzuhara = a region node only". 'birthplace' appears nowhere else in the PRD (grep confirms a single occurrence).  
  → Fix: Drop 'birthplace' — Kuzuhara is a re-foundable hamlet, not the MC's birthplace.  

### [MEDIUM] Narrative canon: find-spot, grief register, and name-collision inconsistencies

*Sections: §1.7, §1.8, §3.6.2, §5*  
Two zones are both tagged 'where he was found' (the weir vs the village boundary-stone/jizō) — destabilising the lone residual-ambiguity beat anchored to the find-spot. The origin family's grief register is 'dead' in §1.8 but 'away/lost' in §3.6.2/§5. The T0 field-lad 'Mago' is an exact prefix of locked T1 antagonist 'Magobei' (the doc de-collides similar names elsewhere). The §5 first-fight beat says he survives 'by Jūbei's arrival', contradicting the canon 'never rescued' mediocre-start beat (fixed as trivial).

- **`narrative-canon-3` [H]** — _medium_ — Two different locations are both labelled 'where he was found' — the weir vs the boundary-stone/jizō  
  <sub>docs/prd.md:450,452</sub>  
  Evidence: §1.7 world table places the find-spot in two different zones, both 'where he was found': line 450 "**The Boundary-Stone / Jizō** / Village of Asagiri (T1) / Village / neutral / ... Where he was found — the **one** capped residual-ambiguity beat"; line 452 "**The River, Ford & Weir** / Satoyama & Mountains (shared, T0–T2) / Shared wilderness / ... the weir where he was found". Repeated in §5: line 3383 "**The Boundary-Stone / Jizō** — where he was found" and line 3385 "the weir where he was found". The cold open and origin canon pin it to the weir: line 3109 "pulled from the weir"; line 575 "sn  
  → Q: Was the protagonist found at the weir or at the village boundary-stone/jizō? The origin/cold-open canon says the weir, but the lone residual-ambiguity beat (the unknown-hand offering) is anchored to the boundary-stone, and both are tagged "where he was found" in two different map zones. Choose one: (a) state that the boundary-jizō stands at the weir/ford and marks the find-spot (co-locate, keeping  

- **`narrative-canon-5` [H]** — _low_ — Origin family's grief-belief about the MC: 'dead' (§1.8) vs 'away/lost' (§3.6.2 & §5)  
  <sub>docs/prd.md:533,534</sub>  
  Evidence: §1.8 cast: line 533 Jinpachi "Grieved him as dead"; line 534 Oyuki "grieved him as dead". §3.6.2 Origin ladder: line 2093 O1 "grieved-as-lost, now home"; line 2096 O4 "Father **Jinpachi** — grieved as away/lost — returns". §5 T2.5 line 3567 "The family grieved him as away/lost". So §1.8 frames the family as believing Tahei dead, while §3.6.2/§5 frame them as believing him merely away/lost.  
  → Q: Origin-family grief register: did Tahei's family at Sawatari-juku believe him DEAD (§1.8 lines 533-534, consistent with the O4 log "They said the pass took you") or merely AWAY/LOST (§3.6.2 O1/O4 and §5 T2.5)? Pick one canonical framing and apply it across all three sections. Trade-off: "presumed dead / back from the dead" is the higher-stakes, more cathartic register; "away/lost" is gentler and s  

- **`narrative-canon-4` [H]** — _low_ — Name near-collision: T0 field-lad 'Mago' vs T1 antagonist 'Magobei' — left unresolved  
  <sub>docs/prd.md:503,527</sub>  
  Evidence: §1.8 line 503: "**Sota & Mago** / A grizzled groom and a cheeky teen field-labourer — the bottom-rung peers." (also line 3189 "field-lad **Mago**"). §1.8 line 527: "**Foreman Magobei** / A skimming village foreman — the 'tanuki' of the rumours board. / The **T1 antagonist** ...". 'Mago' is an exact prefix of 'Magobei'. The PRD elsewhere explicitly resolves such collisions: sweetheart Ohana→Osen and Osen/Otsuru de-rhyming (line 3859-3861), father Kuranosuke→Jinpachi (line 746-747).  
  → Q: The T0 field-lad "Mago" (a flavour roster peer, never appears in dialogue — prd.md:503, 3189) shares an exact name prefix with the locked T1 antagonist "Foreman Magobei." The PRD already de-collides similar names elsewhere (Kuranosuke→Jinpachi; sweetheart→Osen vs Otsuru). Rename the field-lad to remove the prefix collision (e.g. Tasuke / Kuma / Hachi), or accept the overlap as harmless since Mago   

- **`vision-pillars-3` [T]** — _medium_ — §5 first-fight beat is survived "by Jūbei's arrival" — contradicts the canon "never rescued" mediocre-start beat  
  <sub>docs/prd.md §5 T0.2 line 3141 vs §2.8 line 1102 and §3.2 line 1801</sub>  
  Evidence: §5 T0.2 beat 4 L3141: "is thrashed — disarmed, ribs cracked, left in the dirt — surviving **only** by luck / by drillmaster **Jūbei's** arrival, **never by skill.**" — making Jūbei's arrival a survival/rescue cause. But §2.8 L1102 fixes the opposite as canon: "never *rescued*: you survive it, THEN beg Jūbei for drills"; and §3.2 R3 L1801: "a wolf at the grain store — survived by luck, **never rescued, never skill**". The §5 line also self-contradicts its own next sentence ("The shame of limping home to confess drives him to beg Jūbei" — implying he was alone, not rescued).  
  → Fix: Bring §5 in line with the 'never rescued' canon — drop Jūbei's arrival as a survival cause.  

### [MEDIUM] v1 estate scope: 'early E3' vs locked E0-E2, plus E3 stage naming and a mis-pointed park reference

*Sections: §3.6, §5, §2.17, §7.1.2, §7.1.3, §4.7.5, §1.5.1*  
§3.6/§5 T2 say the estate fabric reaches 'early E3', but §2.17/§7.1.2/§4.7.5 lock v1 at E0-E2 with E3-E5 parked and no authored E3 cost. Separately, E3 is named 'Prosperous' in §5 T3.1 but the E3-E5 range glosses (§1.5.1 L261, §5 T2.4 L3561, §7.1.3 L4401) start the span at 'fortified seat' (E4's name), dropping 'Prosperous'. And §4.7.5 parks E3-E5 with a pointer to §1.5.2 (the Village web) instead of §1.5.1.

- **`progression-ladder-1` [H]** — _medium_ — §3.6/§5 say T2 reaches "early E3"; §2.17/§7.1.2/§4.7.5 lock v1 at E0–E2 with E3–E5 parked  
  <sub>docs/prd.md §3.6 (line 2013) and §5 T2.1/T2.4 (lines 3452, 3541, 3553) vs §2.17 (1524), §7.1.2 (4379), §4.7.5 (2895)</sub>  
  Evidence: §3.6 line 2013: "Estate stage span: **E2 Recovering → early E3** (estate fabric runs *ahead* of top personal rank...)" and §5 T2.4 line 3541: "Estate roster & buildings growing (E2 → early E3)". But §2.17 line 1524: "**v1 covers stages E0–E2** (E0 Foreclosure's Edge → E1 Stabilising → E2 Recovering); **E3–E5 parked.**"; §7.1.2 line 4379: "**Estate stages** / **E0 → E1 → E2** ...; E3–E5 parked"; and §4.7.5 line 2895 only authors "Building / upgrade costs (estate stages E0→E2, v1)" — there are NO E3 build costs.  
  → Q: Does v1's T2 reach "early E3" (needs an E3 stage + §4.7.5 cost), or does v1 cap the estate fabric at E2 with E3–E5 fully parked (then "early E3" in §3.6/§5 T2 is wrong)?  

- **`cross-references-4` [H]** — _low_ — Estate-stage E3 named both "Fortified Seat" (§1.5.1/§7.1.3) and "Prosperous" (§5)  
  <sub>docs/prd.md lines 261–262 (§1.5.1) and 4401 (§7.1.3) vs lines 3668 / 3704 (§5 T3) and 3800 (§5 T4)</sub>  
  Evidence: §1.5.1 line 261–262: "Stages E3–E5 (fortified seat → restored-and-surpassed) are parked"; §7.1.3 line 4401 repeats "Estate stages E3–E5 (fortified seat → restored-and-surpassed)". But §5 names the stages individually and consistently otherwise: line 3668 "Estate stage span: E3 Prosperous → E4 Fortified Seat", line 3704 header "E3 → E4", line 3800 "E5 Restored-and-Surpassed". So per §5 the full set is E0 Foreclosure's Edge / E1 Stabilising / E2 Recovering / E3 Prosperous / E4 Fortified Seat / E5 Restored-and-Surpassed — meaning the E3–E5 span starts at "Prosperous", not "Fortified Seat". The ra  
  → Q: What are the canonical names of estate stages E3–E5? §5 explicitly names E3 "Prosperous" and E4 "Fortified Seat", but the §1.5.1 / §7.1.3 range summaries call the start of E3–E5 "fortified seat". Confirm the per-stage names so the descriptors can be aligned (likely: E3 Prosperous, E4 Fortified Seat, E5 Restored-and-Surpassed).  

- **`endgame-coherence-2` [T]** — _low_ — Estate stage E3 named 'Prosperous' in §5 T3.1 but the E3–E5 range glosses label E3's slot 'fortified seat' (E4's name)  
  <sub>docs/prd.md §5 T3.1 (line 3668) vs §1.5.1 (line 261), §5 T2 (line 3561), §7.1.3 (line 4401)</sub>  
  Evidence: §5 T3.1 line 3668 gives the explicit per-stage names: "Estate stage span: E3 Prosperous → E4 Fortified Seat." §5 T4.4 line 3800 confirms "E5 Restored-and-Surpassed." So the parked stages are E3 Prosperous, E4 Fortified Seat, E5 Restored-and-Surpassed. But every summary gloss of the E3–E5 range omits 'Prosperous' and labels the low end with E4's name: §1.5.1 line 261 "Stages E3–E5 (fortified seat → restored-and-surpassed) are parked"; §5 T2 line 3561 "(fortified seat → restored-and-surpassed) are parked for the T3/T4 build"; §7.1.3 line 4401 "Estate stages E3–E5 (fortified seat → restored-and-s  
  → Fix: Update the three E3–E5 range glosses (lines 261, 3561, 4401) to read 'prosperous → fortified seat → restored-and-surpassed' (or 'prosperous → restored-and-surpassed') so they match the per-stage names in §5 T3.1 (E3 = Prosperous, not Fortified Seat).  

- **`cross-references-3` [T]** — _low_ — §4.7.5 parks estate stages E3–E5 with a pointer to §1.5.2 (the Village web), not the estate section  
  <sub>docs/prd.md line 2911 (§4.7.5 building costs)</sub>  
  Evidence: Line 2911: "...keep building gated on standing, never the capstone (§1.5.1). E3–E5 parked (§1.5.2). **Levers:** ...". §1.5.2 is "VILLAGE of Asagiri (SIDE — a static reputation web)" (line 265) — it has nothing to do with estate physical stages. The E3–E5 parking and the estate-growth rule live in §1.5.1 (line 261: "Stages E3–E5 ... are parked (§1.7.1)") — which line 2911 even cites two words earlier — and §7.1.3 line 4401 parks them via §1.5.1.  
  → Fix: Point the parking note at §1.5.1 (the estate section that defines and parks the stages), matching the adjacent citation on the same line.  

### [MEDIUM] Terminology overload and romanization inconsistency

*Sections: §1.6.1, §6.6, §3, §1.5*  
'Standing' labels three distinct mechanics on the hero scoreboard: the 官威 pillar ('Standing & Office'), the Arms-pillar rank-gate ('Combat Standing'), and Arms deeds ('Arms standing'). Romanization drifts: 郷士 ships as 'goshi' 10× (should be 'gōshi' per the locked macron convention; also in frozen ADR/brainstorm canon), and 'ronin' vs '*rōnin*' is used inconsistently (~13×) — the §6.6 macron-lint is blind to both because they sit on the allow-list. No glossary/codex exists and several Edo terms (goyōkin, sankin-kōtai, han) are never glossed (all in deferred T3/T4 content).

- **`terminology-standing-collision` [H]** — _medium_ — "Standing" is overloaded: the pillar "Standing & Office" (官威) vs the rank-gate "Combat Standing" vs "Arms standing"  
  <sub>docs/prd.md — pillar name: 378, 1436; "Combat Standing" rank-gate: 223, 1803, 1908, 1933, 3012; "Arms standing": 1804, 1908</sub>  
  Evidence: Pillar (378): "**Standing & Office** (political/territorial) / 官威 *kan'i*". Rank-gate of a DIFFERENT pillar (1803): "/ **R5 — Gate-guard (*monban*)** / `RANK` Combat Standing (stand a real watch…)" — "Combat Standing" is the rung-gate type feeding the Arms (武威) pillar, e.g. (1908) "combat-earned Arms standing at valley scale". So one pillar is literally named "**Standing** & Office" (官威) while the *other* combat pillar's promotion requirement is "Combat **Standing**" and its deeds are "Arms **standing**" — three distinct mechanics sharing the word, plus the generic "recognized standing"/"estat  
  → Q: The word "Standing" currently labels three distinct mechanics: the 官威 pillar ("Standing & Office", a hero-scoreboard bar), the Arms-pillar rank-gate meter ("Combat Standing", lines 200/223/1908), and Arms deeds ("Arms standing", line 1908) — plus generic uses ("house's standing", "broker standing"). On the four-pillar scoreboard a reader can't tell whether "Combat Standing" feeds Arms or the pilla  

- **`terminology-romanization-goshi` [H]** — _low_ — "goshi" (郷士) ships with no macron — violates the LOCKED proper-Hepburn convention and the §6.6 macron-lint  
  <sub>docs/prd.md lines 46, 185, 755, 804, 1787, 1821, 3108, 3511 (10 occurrences; 0 with macron); also ADR D-007 (decisions.md:74) and brainstorms/2026-06-25-locked-decisions.md:40,204,292</sub>  
  Evidence: §1.5.1 header (185): "### 1.5.1 ESTATE — the Kurosawa *goshi* household"; §1.4 (46): "lower-samurai (*goshi*) house two generations past its grandeur". The macron lock (805): "Romanization convention = macrons (proper Hepburn) project-wide (LOCKED — Tōkichi, Yagōemon, Jūbei…)" and the §6.6 lint (4125-4128): "the verifier flags plain-ASCII romaji that should carry a macron… Allow-list: …shogun, ronin, yokai, samurai, Osaka, daimyō". 郷士 is *gōshi* (long ō); "goshi" is a plain-ASCII slip and is NOT on the allow-list — exactly what the lint is meant to catch. The term appears 10× in prd.md, always  
  → Fix: replace_all "*goshi*" → "*gōshi*" across docs/prd.md (10 occurrences), and sweep the same fix into ADR D-007 (decisions.md) and brainstorms/2026-06-25-locked-decisions.md so canon matches. (Alternative, if the team prefers the un-macroned form: add "goshi" to the §6.6 allow-list — but that needs a h  

- **`terminology-romanization-ronin` [H]** — _low_ — "ronin" vs "*rōnin*" used inconsistently; the macron-lint cannot catch the drift  
  <sub>docs/prd.md — plain "ronin": 1172, 1916, 2022, 3012, 4095, 4375, 4629, 4655; macron+italic "*rōnin*": 545, 1180, 1205, 3509, 3616; allow-list: 4127-4128</sub>  
  Evidence: Allow-list (4127-4128): "naturalized English exonyms — *shogun, ronin, yokai, samurai, Osaka, daimyō*… are exempt and may stay in their common English form." Yet cast/bestiary prose uses the macron form: (545) "A scarred *rōnin* enforcer", (3616) "Masterless *rōnin* / road toughs", while mechanical/table prose uses plain: (1172) "human bandits/ronin (T2)", (4095) "boars/wolves/monkeys/bandits/ronin/smugglers". Because "ronin" is allow-listed, BOTH "ronin" and "rōnin" pass the §6.6 lint, so the inconsistency will silently propagate into shipped text.  
  → Q: "ronin" appears 8x as plain ASCII (mechanical/table prose) and 5x as italic *rōnin* (cast/bestiary flavour prose); the macron lint is blind to it because "ronin" is on the §6.6 allow-list. Should "ronin" be (a) a naturalized English exonym — normalize all occurrences to plain "ronin" (consistent with its allow-list siblings yokai/samurai), or (b) an in-world romaji term — normalize to italic *rōni  

- **`terminology-glossary-accessibility` [H]** — _low_ — No glossary anywhere, and several Edo-domain terms are never glossed for a non-Japanese player  
  <sub>docs/prd.md — no glossary section exists (grep "glossary/codex/lore-book" = 0 hits in prd.md); unglossed terms: goyōkin (377), sankin-kōtai (423, 470), inter-han (422), satoyama (220, 237); imprecise gloss: meibutsu (37, 377)</sub>  
  Evidence: §1.6.1 (377): "TREASURY (debt→solvency→creditworthiness, *goyōkin*)" — *goyōkin* (a forced domain levy/loan) is never defined. §1.5 (423): "the *rusui-yaku* under the daimyō's *sankin-kōtai*" — *sankin-kōtai* (alternate-attendance) is used as if known. §1.5 (422): "inter-*han* markets" — *han* (domain/fief) never glossed. §1.5 (220): "the near-satoyama" never glossed. *meibutsu* is only ever equated to its value ("*meibutsu* = silk / sericulture", 37/377), never defined as "a region's signature product." The accessibility plan (§2.21 / §6.11) covers UI a11y (text scale, colourblind, keyboard)   
  → Q: For non-Japanese players, how should Edo-domain vocabulary be made legible — and is anything needed for v1? Note the opaque terms (goyōkin, sankin-kōtai, inter-han) are all T3/T4 roadmap/stub content, while v1's live terms (koku, mon, genin, monban, satoyama, meibutsu) are already glossed inline or in-world. Options: (a) do nothing for v1 and add a one-line in-world gloss to each upper-tier term w  

### [MEDIUM] Progression-ladder reveal / gate-kind / tier-up mechanism inconsistencies

*Sections: §3.2, §3.4, §3.5, §1.5.1, §1.12, §6.3, §6.13, §2.16*  
§3.5's nav-reveal ledger omits the R4 Crafting tab and R5 Quest log that §3.2 reveals (nav node vs nested panel?). R5→R6 and V2→V3 are tagged RANK 'Estate Service' in the ladder but 'Estate & Wealth' PILLAR in the earned-transition spines. The tier-expansion map is placed at R6 in §3.2/§3.5 but R7 in §1.5.1/§1.12. And how `state.tier` advances is unspecified: §6.13 says 'set by the tier-up intent' but the §6.3 Intent union has no such verb and §6.3/§2.16 describe it as automatic.

- **`progression-ladder-2` [H]** — _low_ — §3.5 nav-reveal ladder omits the R4 "Crafting tab" and R5 "Quest log" that §3.2 reveals as UI surfaces  
  <sub>docs/prd.md §3.5 (lines 1955–1967) vs §3.2 R4/R5 (lines 1802–1803)</sub>  
  Evidence: §3.2 R4 line 1802 reveals "the **simple Crafting tab** (§2.11...) opens"; §3.2 R5 line 1803 reveals "The **Quest log** (§2.12) + the four v1 quest types". §3.5 declares it ladders "the nav chrome itself ... as its own reveal sequence (data: RevealableEntry kind:'navLink'/'screen')" (line 1955) but its table jumps Skills(R2) → Combat(R3) → **Map(R6)** → House(R7) — no entry at R4 or R5. The Skills "tab" and Combat "tab" ARE listed; the Crafting "tab" (same wording) is not.  
  → Q: Are the R4 Crafting surface and R5 Quest log new top-level nav entries (then §3.5 must list them) or panels nested under an existing screen (then §3.2's "tab"/"log" wording should be softened)?  

- **`progression-ladder-3` [H]** — _low_ — R5→R6 and V2→V3: ladder table tags them RANK (Estate Service) but the earned-transition spine names an "Estate & Wealth" PILLAR threshold  
  <sub>docs/prd.md §3.2 R6 (1804) vs §3.2.1 R5→R6 (1840); §3.4 V3 (1909) vs §3.4.1 V2→V3 (1934); cf. §3.9 item 1 (2204–2206)</sub>  
  Evidence: §3.2 R6 trigger col (1804): "`RANK` Estate Service (drive the *shinden* + workshops to recorded yield...)" — but §3.2.1 R5→R6 "Earned by" (1840): "**Estate & Wealth** thresholds — drive the first *shinden* reclamation...". Same split at V3: §3.4 (1909) "`RANK` Estate Service (...recorded seasonal result)" vs §3.4.1 (1934) "An **Estate & Wealth** threshold...". §3.0 (1743–1744) defines RANK = the Estate Service/Combat Standing meters and PILLAR = an Influence-pillar threshold — distinct kinds. §3.9 item 1 (2206) lists only "R7, V4, V7, G2, G6, G7" as the PILLAR-mixed rungs, deliberately excludi  
  → Q: Are R5→R6 and V2→V3 gated by the Estate-Service RANK meter (as the ladder tables and §3.9 imply) or by the Estate & Wealth PILLAR (as the §3.2.1/§3.4.1 spines say)? Both tables must then match.  

- **`progression-ladder-4` [H]** — _low_ — The "tier-expansion map" reveal is placed at R6 in §3.2/§3.5 but at R7 in §1.5.1/§1.12  
  <sub>docs/prd.md §3.2 R6 (1804) + §3.5 Map screen (1962) vs §1.5.1 R7 (225) + §1.12 R7 (707)</sub>  
  Evidence: §3.2 R6 (1804): reveals "the **tier-expansion map** seed + the road out"; §3.5 (1962): "**"Map" screen** / `RANK` R6 ... The **first map screen** (the estate, with a road leading out)". But §1.5.1 R7 (225) lists among R7 unlocks "cash-crop levers; the **tier-expansion map**. The capstone bridge to T1." and §1.12 R7 (707): "+ the tier-expansion map (capstone bridge to T1)."  
  → Q: The detailed §3 ladder (§3.2/§3.5) reveals the tier-expansion map at R6 (the village tier opens there), but the §1.5.1/§1.12 pacing summaries list "the tier-expansion map" as an R7 reveal. Are these the same object placed inconsistently (fix: move the map mention from R7 to R6 in §1.5.1/§1.12, or note "seed at R6, full at R7"), or are there two distinct maps — an estate map with the road out at R6  

- **`tech-architecture-6` [H]** — _low_ — How `tier` advances is under-specified: §6.13 says 'set by the tier-up intent', but the Intent union has no such verb and §6.3/§2.16 describe it as automatic  
  <sub>docs/prd.md §6.13 #4 (lines 4309-4312), §6.3 Intent union (lines 3985-3998) & reduce text (lines 4008-4011), §2.16(b) (lines 1466-1468)</sub>  
  Evidence: §6.13 #4 (line 4310-4311): "Store `tier` as the committed value (**set by the tier-up intent**) and treat threshold-progress as derived". But the enumerated Intent union (§6.3 lines 3985-3998) lists no `tier_up`/`advance_tier` variant (it has rake_rice, do_activity, travel, buy_producer, equip, set_stance, use_item, combat_action, advance_dialogue, accept_quest, read_scroll, set_allegiance + "...one variant per verb"). Meanwhile §6.3 reduce (lines 4010-4011) says it "re-checks unlock and **tier-threshold predicates** so newly-earned surfaces flip to unlocked", and §2.16(b) (lines 1467-1468) de  
  → Q: How is state.tier committed, and which contract element writes it? Option A: add an explicit `advance_tier`/`confirm_promotion` variant to the §6.3 Intent union — reduce only computes tier-threshold PROGRESS, and the player explicitly confirms the promotion (gives a deliberate story beat + DEV-API hook). Option B: no dedicated intent — reduce auto-commits the next tier the moment required-pillar t  

### [LOW] Combat attribute wiring gaps (INT/SPD effects, STR row, baseSpeed anchor)

*Sections: §4.4, §4.6*  
§4.4 promises INT '+0.5% damage vs known bestiary' and SPD 'turn-order/first-strike', but neither appears in any §4.6 formula (the turnless sub-tick sim has no first-strike; INT is a combat dump-stat in the math) — a problem under no-respec. §4.4's STR row omits STR's defense and hpMax contributions that §4.6.1 implements (trivial). §4.6.2 anchors 'baseSpeed = 1.0 at SPD 5', but the formula makes 1.0 the SPD-0 value (trivial).

- **`combat-math-3` [H]** — _low_ — INT's and SPD's stated combat effects in §4.4 are not wired into any §4.6 combat formula — INT is a combat dump-stat in the actual math  
  <sub>docs/prd.md §4.4 lines 2655-2656 vs §4.6.1-§4.6.4 lines 2758-2791</sub>  
  Evidence: §4.4 claims INT has combat value: "`+0.5%` damage vs known bestiary entries; better stance/ability effects", and SPD: "...turn-order/first-strike". But the §4.6 combat formulas contain no INT term and no turn-order/first-strike mechanic: damage is "rawDamage = attackPower · rngVariance(0.85 … 1.15)" then "damage = max( DAMAGE_FLOOR, rawDamage − defense )" — INT appears nowhere; the sim is a sub-tick accumulator with no first-strike/turn-order step. So INT contributes zero in combat per §4.6, contradicting §4.4 and the §4.4 promise that every attribute "is never a dump stat" (and the no-respec   
  → Q: Should INT's '+0.5% damage vs known bestiary entries' and SPD's 'turn-order/first-strike' be implemented as real terms in the §4.6 combat math (and where in the damage pipeline), or removed from §4.4? As written they are promised in §4.4 but absent from every §4.6 formula, making INT a combat dump-stat despite the no-dump-stat / no-respec locks.  

- **`combat-math-7` [T]** — _low_ — §4.4 STR row omits STR's defense and hpMax contributions that §4.6.1 actually implements  
  <sub>docs/prd.md §4.4 line 2653 vs §4.6.1 lines 2762,2765</sub>  
  Evidence: §4.4's STR combat-effect cell lists only "`attackPower += 1.2·STR` (melee); raises carry/durability damage". But §4.6.1 gives STR two further combat roles: "defense = gearDef + 0.5·STR + stance.defMod" and "hpMax = 40 + 8·characterLevel + 2·STR + gearHp". The attribute table (the player-facing/derivation summary) therefore under-states STR's combat footprint.  
  → Fix: Add STR's defense and hpMax contributions to the §4.4 STR combat-effect cell, cross-referencing §4.6.1.  

- **`combat-math-6` [T]** — _low_ — §4.6.2 cadence: 'baseSpeed = 1.0 swing per 20 sub-ticks at SPD 5' contradicts the attackSpeed formula (1.0 base is at SPD 0; SPD 5 gives 1.025)  
  <sub>docs/prd.md §4.6.2 lines 2770-2771 vs §4.6.1 line 2759</sub>  
  Evidence: §4.6.1: "attackSpeed = baseSpeed · (1 + 0.005·SPD) · stance.speedMod" with baseSpeed = 1.0 — so at SPD 0 attackSpeed = 1.0 and at SPD 5 it is 1.0·(1+0.025) = 1.025. But §4.6.2 says "`baseSpeed = 1.0` swing per **20 combat sub-ticks** at SPD 5", attributing the unmodified 1.0 to SPD 5 rather than SPD 0 (off by the +0.5%·SPD multiplier).  
  → Fix: Tie the 1.0/20-sub-tick anchor to SPD 0 (the formula's base), noting the starting SPD-5 character swings ~1.025× that.  

### [LOW] Stale derived/duplicate numbers diverging from authoritative tables

*Sections: §4.9, §4.2.2, §4.5.1*  
§4.9's levers dashboard lists Name JUDGE_K as 3,000/24,000, but the §4.2.2 derivation (0.30·TIER_REF_NAME) gives 4,500/42,000 (Arms/Estate/Office all match; only Name is stale). §4.5.1's illustrative cumulative-XP figures (L10 ~2.1K, L25 ~41K, L50 ~1.5M) don't match the stated formula (should be ~1.2K / ~17K / ~1.1M). Both are clerical syncs to the authoritative source.

- **`numbers-balance-2` [T]** — _medium_ — §4.9 levers index lists Name JUDGE_K as 3,000 (T1) / 24,000 (T2), contradicting the §4.2.2 derivation of 4,500 / 42,000  
  <sub>docs/prd.md §4.9 lines 3055–3056; vs §4.2.2 lines 2502 & 2510</sub>  
  Evidence: §4.9 (lines 3055–3056): "...Office 600 / Name **3,000** · T2 Arms 9,000 / Estate 18,000 / Office 15,000 / Name **24,000**". But §4.2.2 states JUDGE_K[Name] = 0.30·TIER_REF_NAME with TIER_REF_NAME = armsGate+estateGate+officeGate = **15K (T1) / 140K (T2)** (line 2502), giving Name T1 = 0.30·15,000 = **4,500** and T2 = 0.30·140,000 = **42,000** — exactly what the §4.2.2 table (line 2510) lists. The Arms/Estate/Office values in §4.9 all match §4.2.2; only Name is stale (3,000 = 0.30·10,000 and 24,000 = 0.30·80,000 do not derive from any current TIER_REF_NAME). §4.9's own stated formula 'JUDGE_K =  
  → Fix: Update the §4.9 Name JUDGE_K values to match the authoritative §4.2.2 derivation (4,500 / 42,000).  

- **`numbers-balance-3` [T]** — _low_ — §4.5.1 XP-curve example figures (L10 ~2.1K, L25 ~41K, L50 ~1.5M) do not match the stated formula (XP_BASE=50, XP_GROWTH=1.18)  
  <sub>docs/prd.md §4.5.1 line 2693</sub>  
  Evidence: Line 2693: "`XP_BASE = 50`, `XP_GROWTH = 1.18`. So L1→L2 costs 50 xp, L10 cumulatively ~**2.1K**, L25 ~**41K**, L50 ~**1.5M** xp." Computing totalXpForLevel(L) = Σ round(50·1.18^(i-1)) from the stated formula gives L10 = 1,176 (~1.2K), L25 = 17,130 (~17K), L50 = 1,090,653 (~1.1M). The stated examples are off by 1.78× / 2.4× / 1.38× (inconsistent factors, i.e. not a uniform rescale — the '~41K' is actually the L30 value, 39,546). Orders of magnitude vs the §4.0 koku spine remain fine; only the illustrative numbers are wrong.  
  → Fix: Recompute the illustrative cumulative-XP figures from the stated formula: L10 ~1.2K, L25 ~17K, L50 ~1.1M.  

### [LOW] Architecture catalog gaps: belief-beast registry and the universal Rewards object

*Sections: §6.5, §2.9, §2.13*  
§2.9/§2.13/§2.22#5 mandate a SEPARATE belief-beast/rumour registry (the type-level guard behind 'no belief-creature in spawn tables'), but §6.5's content-registry catalog has no such module (a design call on one-type-per-module). And §6.5's 'one shape everywhere' Rewards object omits `pillarDeltas`, though §2.1/§2.12/§7 route pillar accrual — the macro spine — through that bus (trivial).

- **`systems-catalog-5` [H]** — _low_ — §2.9/§2.13 mandate a SEPARATE belief-beast registry, but the §6.5 content-registry catalog has no such module  
  <sub>docs/prd.md §2.9(c) (lines 1162-1163), §2.13(c) (lines 1305-1307); §6.5 registry table (lines 4089-4104)</sub>  
  Evidence: §2.9(c) line 1162-1163: "`BeliefBeast { id, rumourQuestId, resolvesToCause (human/animal/natural), oneShot: true }` — kept in a **separate registry** from grindable mobs (enforces the canon rule at the type level)." §2.13(c) line 1305 reiterates "`BeliefBeast` (shared with 2.9's separate registry)" plus the `BeliefCauseTableEntry` belief→cause table, and §2.20 line 1636 has the verifier assert the table's ≤1-ambiguity cap. But §6.5's content-registry catalog (lines 4089-4104) lists `content/enemies.ts` (grounded, "NO belief-creatures in spawn tables"), `quests.ts`, `scrolls.ts`, etc. — and NO   
  → Fix: Add a `content/beliefBeasts.ts` (or `rumours.ts`) registry row to §6.5 holding the belief-beast one-shots + the belief→cause table, kept apart from `enemies.ts`.  

- **`systems-catalog-6` [T]** — _low_ — §6.5's universal `Rewards` object omits `pillarDeltas`, though §2.1/§2.12 and §7's own applyRewards route pillar accrual through that bus  
  <sub>docs/prd.md §6.5 (line 4107); cf. §2.1(c) (lines 879-880), §2.12(d) (line 1270), §7-M2d (line 4583)</sub>  
  Evidence: §2.1(c) line 879-880 defines the universal bundle WITH pillars: "`RewardBundle { items?, xp?, coin?, koku?, materials?, ... pillarDeltas? }` — the universal object every dialogue/quest/threshold/combat-deed can emit," and §2.12(d) line 1270: "The reward bus can carry `pillarDeltas` for recognized completions (achievement jumps...)." §7-M2d line 4583 likewise: "applyRewards' pillarDeltas produce capped achievement JUMPS." But §6.5 line 4107 states "Rewards are one shape everywhere" and gives `{ items?, xp?, resources?, unlocks?, areas?, recipes?, quests?, flags?, dialogues? }` — with NO pillar/  
  → Fix: Add the pillar field to the §6.5 Rewards object to match §2.1's RewardBundle.  

### [LOW] Stale ADR / intent-record status markers

*Sections: decisions.md D-008, prd_human_feedback.md H2/J4*  
ADR D-008 (decisions.md) still records the rejected coinage 政威 for the Standing & Office pillar, which the §5 authenticity pass resolved to 官威 (kan'i) everywhere in prd.md. And prd_human_feedback H2 is still marked deferred (⏳) although J4 marks the same §5 authenticity pass RESOLVED and it is fully applied in prd.md. Both are clerical status-marker fixes in canon/record files.

- **`endgame-coherence-3` [T]** — _low_ — ADR D-008 still lists the rejected coinage 政威 for the Standing & Office pillar (resolved to 官威 at the §5 authenticity pass)  
  <sub>docs/history/decisions.md D-008 (line 81); cf docs/prd.md §1.6.1 (lines 378, 386-388), §5 (line 3839)</sub>  
  Evidence: decisions.md D-008 line 81 lists the four pillars as "Arms (武威) · Estate & Wealth (家産) · Standing & Office (政威) · Name & Honour (家格)". But the §5 authenticity pass resolved this kanji and rejected 政威: prd.md line 386-388 "the Standing & Office pillar's kanji is RESOLVED = 官威 (kan'i)... the earlier coined 政威 was rejected", and line 3839 "the Standing & Office pillar kanji is set to 官威 (kan'i)... (coined 政威 rejected)". The locked-decisions canon (line 287-288) also fixes 官威. The four-pillar identity used by the national banzuke (§2.18) thus carries a stale kanji in the ADR that drove it.  
  → Fix: Per the ADR 'don't delete, annotate' convention, mark the superseded coinage rather than silently swapping it: keep 政威 visible with a forward note to 官威 and the §5 authenticity pass date.  

- **`cross-references-6` [T]** — _low_ — ADR D-008 still records the rejected kanji 政威 for the Standing & Office pillar (PRD uses 官威)  
  <sub>docs/history/decisions.md line 81 (D-008 Decision) vs docs/prd.md §1.6.1 line 378/386 and §5/§3 (官威 everywhere)</sub>  
  Evidence: The PRD is internally consistent that the Standing & Office kanji is 官威 (kan'i) and repeatedly notes "the earlier coined 政威 was rejected" (prd.md lines 378, 386–387, 752, 801, 1702, 2191, 3839, 3850). The PRD's §1 decisions explicitly map to D-008. But the cited ADR, decisions.md D-008 line 81, still reads "**Standing & Office (政威)**" with no amendment note — unlike D-009, which got an explicit amendment line (decisions.md line 91) for its own renames. So the cited ADR's literal text contradicts the PRD claim it underpins.  
  → Fix: Add an amendment note to D-008 mirroring D-009's pattern, recording 政威 → 官威 and pointing to PRD §1.6.1 for current kanji.  

- **`intent-fidelity-2` [T]** — _low_ — prd_human_feedback.md H2 still marked deferred (⏳) although J4's §5 authenticity pass is RESOLVED and now fully applied in prd.md  
  <sub>docs/prd_human_feedback.md line 265 (H2) vs lines 321-324 (J4) and prd.md lines 378, 386, 1805, 423</sub>  
  Evidence: H2 (line 265) reads: "- **H2. §5 authenticity pass kept deferred** (Standing & Office kanji + martial/office titles → a later focused pass). ⏳". But J4 (line 321) marks it "**RESOLVED (2026-06-25)**" and the resolutions ARE now in prd.md — confirmed by grep: 官威 *kan'i* (lines 378, 386), R7 = *jikata-yaku* (line 1805), *michi-ban* diegetic-only (line 3840), and the T4 *rusui-yaku* reframe (line 423). The intent doc's own H2 status marker is therefore stale (still ⏳ for work that is done and applied).  
  → Fix: Update H2's marker to ✅ and point it at J4, noting the pass is applied in prd.md.  

### [LOW] Broken in-doc cross-reference links (over-climbing relative paths)

*Sections: §3, §4, §7 preambles*  
The §3/§4/§7 'see canon' preambles link `../../brainstorms/2026-06-25-locked-decisions.md` (one ../ too many; 404) when the working form is `../brainstorms/...` (line 34). The §4 preamble's ADR-log link uses `../history/decisions.md` (404) vs the working `history/decisions.md` (line 4). Pure clerical path fixes.

- **`cross-references-1` [T]** — _medium_ — Three canon-doc links over-climb the path (../../brainstorms) and 404  
  <sub>docs/prd.md lines 1715, 2225, 4319 (the §3 / §4 / §7 preamble "see canon" links)</sub>  
  Evidence: prd.md sits at docs/prd.md; the canon doc sits at brainstorms/2026-06-25-locked-decisions.md (repo root), so the correct relative path is ../brainstorms/... . Line 34 proves the author knows this: it correctly links `[`../brainstorms/2026-06-25-locked-decisions.md`](../brainstorms/2026-06-25-locked-decisions.md)`. But lines 1715, 2225, 4319 each write `[`../../brainstorms/2026-06-25-locked-decisions.md`](../../brainstorms/2026-06-25-locked-decisions.md)` — one ../ too many. Verified: `ls docs/../../brainstorms/2026-06-25-locked-decisions.md` → No such file or directory.  
  → Fix: Replace every `../../brainstorms/2026-06-25-locked-decisions.md` (both the backtick display text and the href, 6 substrings across the 3 lines) with `../brainstorms/2026-06-25-locked-decisions.md`. The already-correct line 34 (`../brainstorms/...`) is untouched because it does not contain the `../..  

- **`cross-references-2` [T]** — _low_ — ADR-log link in §4 preamble over-climbs the path (../history/decisions.md) and 404s  
  <sub>docs/prd.md line 2223 (§4 preamble)</sub>  
  Evidence: decisions.md sits at docs/history/decisions.md, so from docs/prd.md the correct relative path is `history/decisions.md` (as the §1 preamble at line 4 correctly does: `[`history/decisions.md`](history/decisions.md)`). Line 2223 instead writes `recorded as an ADR in [`../history/decisions.md`](../history/decisions.md).` — `../history/` resolves to repo-root/history, which does not exist. Verified: `ls docs/../history/decisions.md` → No such file or directory.  
  → Fix: Drop the leading `../` on both the display text and the href so it matches the working line-4 form.  

### [LOW] R0 pacing-test exemption omitted and local gate mislabelled 'CI'

*Sections: §7.1.2, §4.8.1, §7.3*  
§7.1.2's pacing acceptance criterion ('any rung in < ~28 min fails') would falsely FAIL the human-blessed ~5-min R0 cold-open (exempt per §4.8.1), and labels the gate 'CI-enforced' despite the locked 'no hosted CI' constraint (it is the local verify run). Clerical alignment to already-locked decisions.

- **`scope-pacing-r0-1` [T]** — _low_ — §7.1.2 pacing acceptance criterion omits the human-blessed R0 cold-open exemption (would falsely FAIL the pacing test) and labels the local gate 'CI' despite the locked 'no hosted CI' constraint  
  <sub>docs/prd.md §7.1.2 (lines 4387–4392)</sub>  
  Evidence: §7.1.2 states the floor as '≥ ~30-min-per-rank floor (no single rung advances faster)' and the test as 'a headless playthrough that clears any rung in < ~28 min … fails the pacing test'. But §4.8.1 (lines 2972–2977) explicitly carves out R0: 'The ≥30-min per-rank floor… applies to the 7 grind rungs R1–R7; R0 is the exempt ~5-min cold-open story rung', and §4.8.1's R0 row is '~5 min'. Taken literally, the §7.1.2 test ('any rung in < ~28 min … fails') would FAIL on R0 (~5 min). Separately, 'CI-enforced acceptance criteria' contradicts H7 / §7.3 (line 4763: 'no hosted CI, no deploy automation') a  
  → Fix: Scope the pacing test to grind rungs (R1–R7 / V0–V7 / G0–G7), exempt R0 per §4.8.1, and relabel 'CI-enforced' as 'verify-gate-enforced' to match §7.3.  

### [LOW] Low-severity canon/fun loose ends (Origin 'ZERO gift' over-scope, Nihonbashi, T2 'new verbs')

*Sections: §3.6.2, §1.7.1, §5, §6.6, fun-factor.md*  
The Origin track is called 'an accelerant ... with ZERO mechanical gift' in the same clause that grants a ~10-15% speedup and a 'modest global skill-XP buff' — the ZERO-gift scope should be limited to the backstory/identity reveal (3 occurrences). 'Nihonbashi' (a real Edo district) appears in T4 prose but isn't on the §6.6 fictional-setting allow-list. T2's headline 'new verbs' (brokering/diplomacy/arbitration) are specified mostly as deed→ip reskins, risking the 'same loop, bigger numbers' slump the fun doc warns against (though a real rivals-tradeoff choice and §5d anti-slump levers exist).

- **`vision-pillars-4` [H]** — _low_ — Origin side-track is called "an accelerant ... with ZERO mechanical gift" in the same binding clause — a literal contradiction  
  <sub>docs/prd.md §3.6.2 line 2082 (also §3.6 line 2006, §3.6.1 line 299); cf. lines 2085, 2102</sub>  
  Evidence: §3.6.2 "Hard rules (binding)" L2081-2082: "The Origin track is **OPTIONAL, fully completable, an accelerant, narrative-only with ZERO mechanical gift**, and **NEVER gates the spine**". Yet the same track "shaves a felt-but-small slice off the climb (folded into the ~10–15% side-faction speedup)" (L2102) and yields a "pride/morale buff" (L2085). A ~10–15% time-to-tier accelerant plus a morale buff IS a mechanical effect, so "an accelerant ... with ZERO mechanical gift" is self-contradictory. The intended scope is ZERO gift FROM THE BACKSTORY/identity reveal (L2086: "never a retroactive gift fro  
  → Q: The Origin track is repeatedly called "an accelerant ... with ZERO mechanical gift," yet it grants the ~10-15% side-faction speedup (§1.5.4) and "a modest global skill-XP buff" (§1.5.3) — both mechanical. Confirm the intended scope: the track DOES grant the earned present-day speedup + skill-XP/morale buff, and "ZERO mechanical gift" means only "no retroactive stat/recipe/tool/combat bonus from th  

- **`vision-pillars-5` [H]** — _low_ — Real Edo district "Nihonbashi" used in T4 prose — a real place name not on the §6.6 fictional-setting allow-list  
  <sub>docs/prd.md §1.7.1 line 470 and §5 T4.2 line 3772 vs A6/§1.3 line 133 and §6.6 allow-list line 4127-4128</sub>  
  Evidence: A6/§1.3 L133-134: setting "kept **fictional** — no real place or daimyō names." §6.6 L4127-4128 enumerates the exact naturalized exonyms exempted: "*shogun, ronin, yokai, samurai, Osaka, daimyō*" — Edo (the era/ceiling anchor) and Osaka are deliberately allowed, but "Nihonbashi" is NOT listed. Yet T4 prose uses it twice: §1.7.1 L470 "the **Nihonbashi/*banzuke*** payoff"; §5 T4.2 L3772 "a Nihonbashi *tonya* sends a single trial order." Nihonbashi is a specific real Edo district, a finer-grained real place name than the macro anchors the allow-list sanctions.  
  → Q: "Nihonbashi" (a real Edo district) appears in two T4 prose beats but is not on the §6.6 exonym allow-list, which currently sanctions Edo and Osaka as real macro anchors. Since Nihonbashi is a district of the already-allowed Edo, do you want to (a) add "Nihonbashi" to the §6.6 allow-list and treat it as a macro anchor like Edo/Osaka, or (b) genericize it ("a capital tonya" / "the capital's banzuke"  

- **`player-experience-5` [H]** — _low_ — T2's promised 'new verbs' (brokering / diplomacy / arbitration) are specified only as narrative reskins of the deed→ip loop — risking the 'same loop, bigger numbers' fun-killer the doc names as the slump  
  <sub>docs/prd.md §3.6 G3–G6 (lines 2024–2027), §4.8.3 (line 3017); docs/fun-factor.md §5b (lines 221–224), §7 T2 (line 291)</sub>  
  Evidence: fun-factor §5b line 221–222: "**Layers are new VERBS, not bigger numbers.** Each tier must hand the player a new *thing to do*, not a ×10 version of the old thing... If a tier is 'same loop, bigger numbers,' that *is* the slump." T2 names its new verbs as "brokering/diplomacy verbs + the rival contest" (fun §7 T2, line 291), but §3.6's G3–G6 (arbitrate valleys, river-works, break roost, broker alliances) are described narratively, and §4.8.3 reduces them to ip-bearing deeds (e.g. line 3017 G6: "alliance Office/Name deeds"). No §3/§4 text establishes that brokering/arbitration are a mechanicall  
  → Q: For T2's social headline verbs (brokering / diplomacy / arbitration), do we want a distinct systems-level interaction — e.g. a defined "contested meter" resolution where supplying a valley vs restoring Akagi's precedence are competing spends with real trade-offs — or do we accept they resolve as Office/Estate deeds (§4.8.3) and rely on the already-specified play-rivals-against-each-other choice (m  

---

## E. Coverage & limitations

"Audit operated on docs/prd.md text plus cross-doc canon (decisions.md, prd_human_feedback.md, brainstorms locked-decisions). No code exists yet (pre-M0), so all save/RNG/level/architecture findings are spec-level and could not be validated against an implementation. CORRECTIONS MADE DURING SYNTHESIS: (1) Three findings shipped malformed old/new fields (old=fragment, new=full block) that would corrupt the file if applied verbatim — combat-math-7 (cell vs full row), systems-catalog-6 (inner-braces vs whole clause), and cross-references-2 (path vs surrounding prose); all three were corrected to clean replacements and the load-bearing ones verified against the file (lines 2653, 4107, 2223). (2) save-determinism-2's single-line old_string did not match the file's line-broken §6.8 list (lines 4170-4172); reconstructed as a verified block-level edit. (3) narrative-canon-1 shipped EMPTY structured old/new fields (strings were trapped in verdict prose); reconstructed and verified verbatim against line 463 — included despite being a substantive prose rewrite because it only propagates LOCKED canon. (4) tech-architecture-1 and save-determinism-3 are the same missing-current-location issue with two different field names/positions; applied once (tech-architecture-1, currentArea after the clock line) to avoid adding the field twice. DEFERRED/UNVERIFIED IN THIS PASS: numbers-balance-4 is class trivial-apply but was withheld from trivial_fixes and routed to Q7, because endgame-coherence-1 frames the same Arms-gate as an open 2-vs-3-pillar design fork — applying its directional prose fix would prejudge the human decision. The E3-naming gloss fix (endgame-coherence-2) only covers the §7.1.3 occurrence (line 4401); the identical 'fortified seat → restored-and-surpassed' gloss also appears at §1.5.1 (~L261) and §5 T2.4 (~L3561) and needs the same edit, but exact strings for those two were not captured. cross-references-1's path fix occurs 6× (lines 1715/2225/4319) and requires replace-all, but the trivial_fixes schema has no replace_all flag. The kanji ADR fix (endgame-coherence-3) and the H2 marker fix (intent-fidelity-2) target docs/history/decisions.md and docs/prd_human_feedback.md respectively; their exact line text was not re-verified against those files in this pass. Several other passed-through trivial strings (numbers-balance-2/3, combat-math-6, tech-architecture-4/5, save-determinism-5, scope-pacing-r0-1, narrative-canon-2, vision-pillars-3, cross-references-3) were trusted from high-confidence lenses but only a subset were re-read against the file. NOT INDEPENDENTLY RE-VERIFIED: the arithmetic in numbers-balance-1/3 and intent-fidelity-1, and all claims about the fun-factor.md / qa-playtesting.md living docs (only their existence and the §7 omission were checked)."

**Not in scope of this pass (by design):** no code exists yet (pre-M0), so all save/RNG/level/architecture
findings are spec-level. §4 numbers are mostly tagged *proposed* and delegated to the M6 balance pass (J8) —
the audit only flagged numbers that are *internally contradictory*, not ones that are merely untuned.

# PRD Battery & Stress-Test — Findings & Decision Report

> **⟳ LIVING REPORT — autonomous multi-round battery.** Rounds complete: **4 (SATURATED — battery closed)** · Confirmed findings: **162** (60+37+39+26) · Fixes applied: **42** · **Decision queue: Q1–Q56 + PD-1**. **See the consolidated [MASTER decision sheet](2026-06-26-prd-decisions-master.md) for the prioritized, build-gating cut.** More rounds running back-to-back; this report + queue keep growing. Round-1 detail below; **Round 2 (Q13–Q28)** appended at the end. **§P — Process decision PD-1** (freeze-vs-steer) — ✅ APPROVED, wired as ADR D-021 across 6 docs.

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

## P. PROCESS DECISIONS (higher-order than the Q-items)

### PD-1. [PROCESS · high] Reconcile K3 (steer-by-playtest) with K5 (freeze + explode) — scope "freeze" to LOCKED INTENT, not the plan.

**Context.** `prd_human_feedback.md` asserts BOTH **K3** ("fun is a hypothesis tested by play; the human makes the higher-level fun call") and **K5** ("freeze `prd.md` as the vision, then explode into living docs") without reconciling them. A hard freeze of the §4 balance + §7 M2–M7 plan would directly contradict K3 — you cannot steer-by-playtest a frozen plan.

**Battery evidence (the decisive data point).** Across **97 findings in 2 rounds**, the split is stark:
- The **VISION layer** (§1 pillars, story spine, the locked human constraints — no-magic, mediocre-start, trade ≤⅓, active-only, the four pillars, the estate spine) had **ZERO intent-drift** — round-1's intent-fidelity lens confirmed the PRD honours every human steer. This layer **survived adversarial audit; it is freezable.**
- **EVERY** gap / under-specification / bug clusters in the **PLAN layer**: the §4 number-spine "calls itself frozen but is materially under-specified" (round-2 risk #1), §2 system specifics, §7 milestone detail. This layer is **hypotheses with holes** — exactly what must stay liquid and resolve via playtest.
→ The data says: **freeze what survived the battery; keep liquid what's full of holes.**

**Sharper framing than "vision vs plan".** The real freeze line is **LOCKED INTENT vs PROVISIONAL IMPLEMENTATION**:
- **Frozen (locked intent):** §1 vision + the hard constraints + the human-SIGNED *acceptance criteria* (≥30-min floor, 70/30 deeds/seasonal, ~28.5h budget, the tier-gate **targets**). These are the *destinations*.
- **Liquid (provisional implementation):** the yields, levers, milestone detail, and balance numbers that HIT those targets — already tagged **"proposed v1 balance"** throughout §4. These are the *route*.
The levers move; the locked targets don't. This keeps the steer-loop alive **without infinite churn** (the risk the original analysis under-weighted: "keep the plan liquid" needs the signed acceptance criteria as an anchor, or M2–M7 re-plans forever and never ships).

**Recommendation.**
1. **Build M0+M1 against the CURRENT `prd.md`** (round-3's impl-readiness lens is checking it's buildable as-spec), **playtest, THEN explode** — reorganise once, on validated ground (lower overhead now; K5 says "hold until sign-off" and sign-off can legitimately come *after* the first build-and-play cycle).
2. **When you explode:** freeze ONLY §1 + constraints as a tagged vision snapshot; move §7 roadmap to a **living** `docs/roadmap.md` (banner: "M0–M1 committed; M2–M7 provisional, re-planned after each playtest"); move §4 balance to **generated** `docs/content/` — *generate-don't-duplicate is what makes post-playtest re-tuning cheap* (rounds 2–3 keep flagging hand-typed derived tables that silently drift; **that pain IS the argument** for generating balance).
3. **Never freeze M2–M7 as locked canon** — that is the actual mistake to reject, not the multi-doc structure.

**✅ APPROVED & WIRED (2026-06-26).** The human signed both (a) the *build-M0/M1 → playtest → then explode* sequencing and (b) the *locked-intent-vs-provisional-implementation* freeze line. Recorded as **ADR D-021** (refines D-020) and propagated across 6 canonical docs (canon K2/D-020 row, intent-log **K7**, `memory/project-status.md`, `CLAUDE.md`, the `prd.md` read-me preamble, `docs/README.md`). The docs are **not** exploded yet — that waits for the post-M0/M1 playtest, by design.

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


---

# ROUND 2 — deeper / fresh-angle battery (2026-06-26)

**Scale:** 92 agents · 78 raw findings → **37 confirmed** (5 high · 19 medium · 13 low). 13 lenses ran (onboarding came back **clean** — 0 confirmed). **Applied this round:** 6 fixes (4 clerical + the **Arms-floor deadlock completion** + an autumn-season label). **New decisions:** **Q13–Q28** (16). Raw snapshot: [`raw/2026-06-26-prd-battery-review-r2.json`](raw/2026-06-26-prd-battery-review-r2.json).

> **Round-2 headline.** Round 2 went after the **number spine, the satellite docs, and build-time specifics** — and found §4 defers load-bearing numbers (market/coin, soft-stamina floor, win-rates, weapon/stance rosters) with `(numbers → §4)` cross-refs that dangle, the satellite docs (fun-factor/qa-playtesting/ui-design) have **drifted** from the PRD, and combat — a first-class pillar — is the least-specified system. A devil's-advocate pass also caught that **both round-1 fixes were incomplete** (now fixed).

## R2·A — Devil's-advocate verdicts on Round 1

- **No round-1 finding was a false positive** — the adversarial verification held up.
- **Two round-1 fixes were INCOMPLETE — both addressed this round:**
  1. *Impossible-gate fix* only lowered the E2/R6 **Estate** floor; the adjacent **Arms ≥0.4K** floor at R6 is *also* unreachable (~0.36K). **Fixed:** Arms 0.4K→**0.3K** at §4.7.5 + §4.8.1.
  2. *Climax fix* made the **Otsuru truth** spine-guaranteed but left the **name-reclamation** half contradictory (G6 gives 'Tahei' to all; §1.4/D-006 + O5 gate it to the optional Origin track). **Queued as Q25.**
- **Down-weighted overstatements:** the 'unbounded money loop' is refuted by the trade-≤⅓ hard invariant + saturation damper (→ LOW gap); '0/4 anti-slump devices authored' is partly false (2 of 4 exist).

## R2·B — Cross-cutting risks (round 2)

1. The §4 'number spine' is the single biggest systemic hole: multiple independent lenses found that promised numbers — market/coin exchange rate & prices, the soft-stamina floor, the ~16K of T0 held-koku sinks, per-rung combat win-rates, weapon-line/stance content — are deferred to §4 with '(numbers → §4)' cross-refs that dangle, while §4.0 simultaneously describes itself as 'reconciled/frozen'. Balance is materially under-specified relative to the doc's own confidence.

2. The sole release gate (§6.6 verifier) checks ids/flags/lint but no numeric or structural invariants, so the impossible-gate and accrual-arithmetic bug classes — and the hard-locked 'fictionalise real names' canon — can only be caught by humans reading, which is exactly why bugs and name-leaks recur across both rounds. The 'generate, don't duplicate' convention is also not applied to §4's own hand-typed derived tables.

3. Combat — a first-class v1 pillar — is the least-specified system: weapon lines, stance roster, retreat resolution, difficulty past R3, and the 25%→85% recovery location are all undefined or self-contradictory. This is a coherent block of M2 build-blockers, not scattered nits.

4. The satellite docs (fun-factor.md, qa-playtesting.md, ui-design.md) have drifted from the PRD body in both directions: the QA harness cites API methods the spec doesn't expose, the fun-proxies are mis-calibrated to T0-only numbers that false-fail the locked T2 tier, and ui-design palette/rate rules contradict canon invariants. The very layer meant to let the project self-test for fun/pacing is internally inconsistent with the spec it measures.

5. Accessibility and save-safety are asserted as locked/'cannot be an afterthought' but lack the wiring and QA to guarantee them: no reachable a11y entry point at cold open, an un-scoped 5-channel ARIA live region with no screen-reader acceptance test, bare-CJK readouts for AT, no large-textScale reflow check, and a single-autosave slot with no destructive-action confirm or pre-overwrite backup on a no-reset ~28.5h saga.

6. Narrative integrity fails on the most load-bearing beats: the v1 cliff-hanger node is doubly-defined (would ship a rerun), the titular G6 name-reclamation contradicts locked canon, and the locked Naoyuki arc disappears for an entire tier — the emotional spine has gaps precisely at the climax and ending.

## R2·C — Fixes applied (round 2, in this commit)

| Finding | File | What changed |
|---|---|---|
| `build-diversity-6` | `prd.md` | Added missing `defMod` to the `Stance` type (§4.6.1 reads `stance.defMod`; the type lacked it — wouldn't compile). |
| `cross-doc-satellite-1` | `prd.md` | Added `pacing()`/`reveals()`/time-compression to the `window.__qa` contract (§6.10) the qa-playtesting harness already assumes. |
| `devils-advocate-4 + L2491` | `prd.md` | Fixed §4.2.2 autumn-season labels: season 8 = final WINTER; autumn bump = seasons 3 & 7 (matches the doc's own Sp→Su→Au→Wi ×2 order). |
| `devils-advocate-2` | `prd.md` | Completed the impossible-gate fix: E2/R6 Arms floor 0.4K → 0.3K (0.4K unreachable at R6, ~0.36K). |
| `cross-doc-satellite-4` | `fun-factor.md` | Floor-proxy now exempts the blessed ~5-min R0 cold-open (grind rungs R1–R7 only). |

## R2·D — New decisions Q13–Q28 (16)

Continuing the master queue (Q1–Q12 from round 1). Ordered by severity.

### Q13. [HIGH] What are the v1 market/coin numbers? Specifically: (a) the koku↔coin sell/buy spread (broker conversion), (b) at least one coin-denominated sink (shop goods/gear/repair, or a coin component on E1/E2 building costs which §2.17 already reserves a slot for), and (c) the MarketState numbers (base price index per good, saturation increment per sale, recovery rate/day, how shop standing softens the cras

**Context.** §2.4(c) and §3.8 twice promise these numerics '→ §4' but §4.7 defines none; coin is gathered but unspendable in the numbers, so the T1 market (the headline 'coin row lit' reveal) cannot be implemented or balanced. The unbounded-loop risk is already structurally bounded by the trade ≤⅓ hard invariant and the saturation damper, so this is a completeness gap. §6.5 lists resource 'caps' but ResourceDef/GameState store uncapped counts with no cap value or overflow rule.

**Rec.** Strike '+ caps' (unbounded counts, consistent with exponential koku and the counts-only GameState) now, and add a short §4 market subsection at M4 authoring time with the exchange rate, one coin sink, and MarketState numbers — flagging coin/market as a known v1-balance hole rather than a frozen spec so the cross-refs resolve.

<sub>Findings: `exploit-degenerate-6`, `economy-simulation-1`, `failure-states-4`</sub>

### Q14. [HIGH] Make the T0 accrual ledger tie out. (1) What are the actual T0 koku sinks that take ~21.5K produced down to the asserted 3–5K held? Only 2.4K (E1+E2) is currently priced; food/tools/crafting are koku-free and debt clearance ADDS Influence — so either enumerate the missing sinks (and recompute affordability against HELD, with a soft-lock check: held ≥ E2's 2K at R6 while sustaining upkeep), or decl

**Context.** §4.0/§4.7.1 assert 21K→3–5K held implying ~16–18K sinks that don't exist as numbers, and the per-rung throughput is labelled 'net' then re-deducted as gross. Round-1's impossible-gate fix only audited E2's Estate column; the same gate's Arms floor is unreachable on the §4.8.1 ramp. Numbers are 'proposed' so this is a retune, but the master bookkeeping is self-inconsistent and could wall the player at R6.

**Rec.** Pick the 'yields already net' model (simplest, kills the double-count) and restate the §4.0 held band; separately lower the R6/E2 Arms floor to ~0.35K or pull Arms-deed onset to R4, then re-derive the §4.2.1 Arms itemization against the rung schedule. Confirm R7's Arms-deed count so the 30-deed claim can be re-checked.

<sub>Findings: `economy-simulation-2`, `devils-advocate-2`, `devils-advocate-4`</sub>

### Q24. [HIGH] What does v1 actually ship as the T3 cliff-hanger stub node — the castle-town/Daikan first-contact (which G7, §3.5, §3.7.1 C0, and §5 T3.2 all describe), or the Porter-Guild first-contact (which the §5 T3 header alone claims, but which is already spent at T2-G0/G1)? If the castle-town (recommended), the §5 T3 header must be rewritten so the v1 ending opens a new frontier rather than rerunning the 

**Context.** This is the single most load-bearing emotional moment of the release — the cliff-hanger that decides whether v1 lands as a satisfying 'to be continued.' A builder reading the stale §5 T3 header would ship a stub re-running content the player already did at the start of T2.

**Rec.** Ship the castle-town/Daikan first-contact (overwhelming doc-weight, and it opens a genuinely new frontier). Rewrite the stale §5 T3 header to describe the castle-town stub and delete the porter-guild framing.

<sub>Findings: `narrative-pacing-emotion-1`</sub>

### Q27. [HIGH] Fix three authenticity issues that breach the human-locked 'fictionalise real names' canon (§1.13/A6). (1) The T4 inspector 'Junkenshi Toyama Saemon-no-jō' is the real Edo magistrate Tōyama Kagemoto ('Tōyama no Kin-san'), in his real wise-judge role — was a Kin-san homage intended (cf. the possibly-deliberate 'Kurosawa' house), or swap the surname 'Toyama' for an invented one (keeping the generic 

**Context.** A6 is a hard, human-locked constraint and these sit on apex endgame characters; Konoe saturates the whole T4 tier as the sole recurring capital face. Round-1 already caught Nihonbashi. Intent (homage vs leak) is genuinely ambiguous for Toyama, hence a human call; the office 'junkenshi' and titles 'Saemon-no-jō'/'Settsu-no-suke' are generic and fine — only the surnames leak.

**Rec.** Swap both surnames for invented ones (the leaks are conspicuous and on apex characters; don't rely on an ambiguous homage), keeping the generic offices/titles, and correct the broker line to 'Osaka kuramoto/kakeya → Edo fudasashi'. Pair with the Q28 real-name lint so this stops recurring.

<sub>Findings: `theme-authenticity-sensitivity-1`, `theme-authenticity-sensitivity-2`, `theme-authenticity-sensitivity-6`</sub>

### Q15. [MEDIUM] Combat build content: which 2-3 weapon lines ship in v1, what gives each a distinct mechanical identity, and what is the concrete v1 stance roster? For weapons: name the lines (e.g. yari/spear, uchigatana/sword, kodachi/staff) and decide whether per-line archetype (reach/targetCount/base-speed) lives in extended EquipDef.statMods, the skill line, or per-line L50 milestone perks — currently weapon 

**Context.** §7.1.1/§2.7(e) LOCK '2-3 weapon lines' and M2a phase 1 asserts 'stances are defined', but neither is enumerated and the combat math treats every weapon skill identically. The Stance type vs formulas also disagree (defMod read but undeclared — see trivial fix; attackMod declared but unused). Non-blocking for M2a (crude-pole-only) but required before M2b authors weapon-line/stance content.

**Rec.** Ship 3 lines (spear/sword/staff) with a light archetype profile (base-speed/reach/targetCount expressed in equipment data) plus distinct L50 signature abilities, and defer true multi-target resolution with a note. Author a small stance roster (Aggressive +attack −evasion; Defensive +def/+evasion −rate; Even) and reconcile the type/formula fields exactly. Lock before M2b.

<sub>Findings: `build-diversity-3`, `build-diversity-4`</sub>

### Q16. [MEDIUM] Combat resolution & difficulty rules: (1) What does a successful retreat resolve to mechanically — clock cost, whether HP/injury/loot carry, where the MC returns, and crucially whether retreat ever counts as a loss for the Arms dent (e.g. abandoning a defence-deed)? (2) Do you want an explicit win-rate-vs-rung band at the key combat rungs (R3, V2, V5, G1, G5) headless-tested like the R3 wolf, or l

**Context.** Retreat is a first-class verb (§2.8/§6.3) but §4.6 only specifies win and loss — a builder must invent semantics, and mis-routing it as a loss-with-dent breaks the soft-setback/escape-valve intent. Difficulty is calibrated/CI-tested at exactly one point (R3 wolf); ~8 later rungs/~12 mobs have no win-rate target, so a spike/trough would ship silently. And the headline 25%→85% recovery is arithmetically impossible inside R3 (needs R4 crafting + ~R5 weaponSkill 5).

**Rec.** Make retreat a clean escape valve (carry HP/loot, modest clock cost, never dents Influence — and decide defence-deed abandonment counts as a failed defence). Add a win-rate band at R3/V2/V5/G1/G5 as a second fun-proxy row (combat is a first-class pillar and §4.8's philosophy is regression-tested pacing). Correct §4.6.6 to locate the 85% recovery at R3–R5 rather than raising R3's budget.

<sub>Findings: `failure-states-3`, `difficulty-curve-1`, `difficulty-curve-5`</sub>

### Q17. [MEDIUM] Two missing pacing-engine rules: (1) Define the soft-stamina/satiety→rate-multiplier function in §4 and add it to the §4.9 levers index — what is STAMINA_RATE_FLOOR (the minimum labour/combat-speed multiplier at zero satiety that realizes 'never to zero', proposed ~0.25–0.5×) and the curve shape (linear vs flat-then-knee)? (2) When ≥2 reveal predicates flip true on the same reduce/tick, should rev

**Context.** 'Soft stamina never to zero' has no realizing floor constant anywhere in §4 (absent even from the §4.9 levers index), so a naive satiety/satietyMax implementation hits 0 — the crawl-to-halt the system forbids. And §6.3 reduce lets plural surfaces flip true on one tick with no ordering, which can stack multiple panels/log lines and undermine the signature 'act → ONE thing fades in' cadence.

**Rec.** Set STAMINA_RATE_FLOOR ≈ 0.3× with a flat-then-knee curve (only deep depletion bites) and add it to the §4.9 index. Serialize simultaneous reveals into a one-per-beat queue with a deterministic order (registry/reveal-order index, then trigger-kind priority) to keep both the cadence and replay determinism.

<sub>Findings: `failure-states-1`, `failure-states-6`</sub>

### Q18. [MEDIUM] Accessibility completeness — pin four things the spec leaves open: (1) Where do colourblindMode/mute/pause/textScale live so they are reachable at the bare cold open (a persistent header gear exempt from progressive reveal, a quieter overflow entry, or accept OS/browser backstops + defer)? (2) ARIA live-region politeness/scope — which of the 5 log channels announce and at what level (proposed: nar

**Context.** A11y is locked canon (D16) and asserted 'cannot be an afterthought', but Settings is absent from the nav-reveal ladder, the 5-channel log is one un-scoped live region with no SR test, meaning rides on bare CJK glyphs with emoji aria-hidden, and textScale is offered with no reflow QA and a vw-based font clamp that bypasses it. Each is a UX judgement with a real trade-off (e.g. a header gear conflicts with the deliberately empty cold-open ma; per-label accessible names add authoring overhead vs the kanji-first aesthetic).

**Rec.** Do the low-cost correctness items now (scope the live region to narration+milestone-only at aria-live=polite, add a large-textScale reflow case + a screen-reader acceptance pass, rem-anchor the §3.3 display clamp) and add a single persistent-but-quiet a11y entry affordance present from minute one. Scope kanji accessible-names/lang to the pillar panel + primary vitals first; defer full coverage to a later hardening pass with a note.

<sub>Findings: `accessibility-ux-1`, `accessibility-ux-4`, `accessibility-ux-5`, `accessibility-ux-6`</sub>

### Q19. [MEDIUM] Three UX/data hardening calls: (1) Mobile IA — for the 3-5-slot bottom tab-bar, which screens are 'primary' when ~8 are revealed by T2, and what rule governs the primary/overflow split (and the slide-in reveal beat for entries that land in the drawer)? (2) Save safety — on a no-reset ~28.5h saga with a single autosave slot, require an explicit destructive-action confirm on import and 'fresh start'

**Context.** Mobile is a first-class target but the primary/overflow model is undefined (the most-used screens could be buried). A single slot + no required confirm + no pre-overwrite backup makes any accidental import/fresh-start catastrophic and unrecoverable. §2.21(c) drifts from authoritative §6.4: spelling (colorblindMode vs colourblindMode, reduceMotion vs reducedMotion — a silent key-mismatch bug), a persisted 'paused' that would reload into a frozen game, and over-scope volume sliders vs the locked mute toggle.

**Rec.** Mobile: per-tier primary rule (current-tier core on the bar, older to drawer in reveal order). Save: require the destructive confirm AND auto pre-overwrite snapshot — cheap insurance on an unrecoverable saga. Settings: drop persisted 'paused', collapse AudioSettings to {muted}, and apply the spelling fix to match the locked mute-only scope.

<sub>Findings: `accessibility-ux-3`, `accessibility-ux-7`, `accessibility-ux-8`</sub>

### Q20. [MEDIUM] The fun-factor reward-cadence proxy cites a 'recognised deed every ~4.5–5 min' as the untiered deed-stream sizing target and reward-desert guardrail, but that figure is T0-only (§4.8.1); the locked T2 budget deliberately spaces deeds to ~13 min/deed. Should the deed-cadence proxy be (a) re-expressed as tier-relative (T0 ~5 / T1 ~7–8 / T2 ~13 min) with the broad 'reward/number-jump every ~X min' cl

**Context.** A literal reading false-fails the entire 16h T2 tier — the doc's named mid-game slump zone, where accurate fun measurement matters most. The dense koku/XP/loot stream between deeds plausibly guards against reward-deserts while deed-jumps legitimately space out at higher tiers. Fix lives in fun-factor.md §2.1/§3/§6.

**Rec.** Make the deed cadence tier-relative and let the broad reward/number-jump clause (koku/XP/loot between deeds) carry the reward-desert guard — the locked T2 budget is intentional and shouldn't be re-opened. Amend fun-factor.md §2.1 (L68), §3 (L155), §6 (L257).

<sub>Findings: `cross-doc-satellite-2`</sub>

### Q21. [MEDIUM] Reconcile two UI-bible palette/rate conflicts on the signature four-pillar panel (both fixes in ui-design.md; the PRD is correct). (1) §5.3 demos 'always show the rate next to the total' on the House-Influence roll-up (家威 +12/koku) — re-illustrate with a resource that actually flows (koku/coin), and specify what the event-driven pillar bars show instead (distance-to-next-gate and/or last deed-jump

**Context.** Influence canon forbids any time-trickle/per-action rate, so a '+12/koku' demo on 家威 is a wrong example implying a banned trickle. The §6.3 flash spends the reserved seal colour on ~70% routine deeds and uses --ai (the §2 gain colour) for losses, making gain-vs-loss ambiguous — the exact colour-misuse the bible exists to prevent.

**Rec.** Fix the rate demo to a resource and have pillar bars show distance-to-next-gate. For the flash, align §6.3 to the §2 delta tokens (gain=--ai, loss=--beni) and keep vermilion exclusive to rank-up/seal beats — preserving the 'stamp not paint' seal discipline on the highest-frequency surface.

<sub>Findings: `cross-doc-satellite-3`, `cross-doc-satellite-5`</sub>

### Q22. [MEDIUM] The fun-doc (§5d/§7) promises a four-part T2 anti-slump 'package', but only two parts are authored (front-loaded G0 trade verb; fractal re-run of village loops at region scale). The other two are unbuilt: no 'seasonal-twist that rotates the optimal strategy' (§4.2.2/§4.8.3 judge all four pillars identically every season), and no 'combinatorial cross-pillar combos' — which §4.3 explicitly forbids (

**Context.** T2 is the doc's named biggest fun risk (the 16h slump); it has correctly diagnosed the cure but written half of it only as intent. The combos promise directly contradicts the §4.3 no-leakage invariant, which must be adjudicated either way.

**Rec.** Author the seasonal-reward-rotation (high leverage, low §4.3 conflict) into §4.2.2/§4.8.3, and either drop the cross-pillar-combo promise or carve a narrow explicit §4.3 exception for it — don't leave the §4.3 contradiction unresolved.

<sub>Findings: `content-volume-2`</sub>

### Q25. [MEDIUM] At the G6 climax, should a player who SKIPS the optional Origin track still reclaim the titular name 'Tahei'? The G6 spine event-log line currently hands the name to every player, but the same cell's structured field, the O5 capstone, and LOCKED canon §1.4/D-006 all place name-reclamation on the optional Origin track only.

**Context.** This is the thematic core of a game literally titled Kami-kakushi. The round-1 'climax→spine' fix correctly moved the Otsuru truth to the spine but left the name clause in the spine prose — now self-contradictory. An implementer cannot tell whether to show 'You have a name again: Tahei' to a skip-Origin player.

**Rec.** Option A — strip the name clause from the G6 spine line so the spine carries only the Otsuru truth, keeping 'Tahei sets his true name down' on the optional Origin track. Honours the locked 'identity is a side thread, not the spine's climax' decision without reopening canon.

<sub>Findings: `devils-advocate-1`</sub>

### Q26. [MEDIUM] The locked Naoyuki rivalry→respect→brotherhood arc is heavily seeded in T0 but appears ZERO times in all of T1 (~8h) and gets only one v1 beat (the G5 ally-flip), with brotherhood cut to T4. Add an interstitial Naoyuki beat in v1 (a T1 or early-T2 moment where the rivalry visibly thaws toward grudging respect) so the G5 flip reads as earned, or accept 'seed → ally-flip → brotherhood-deferred' as t

**Context.** For a deferred arc whose payoff is cut to a T3-stub release, the T0–T2 portion must satisfy on its own. As written the character disappears for the entire middle tier, the 'respect' stage is never beated, and the relationship jumps straight to 'ally against Tomita' with no connective tissue — likely reading as unearned.

**Rec.** Add one low-cost interstitial beat in T1 or early T2 — it protects the emotional payoff of a locked character arc for minimal authored content and removes the 'rival who suddenly cooperates' read.

<sub>Findings: `narrative-pacing-emotion-3`</sub>

### Q28. [MEDIUM] Harden the sole release gate (§6.6 verifier) against the bug classes humans keep catching by hand. Add: (1) static balance invariants asserted from the registries — gate monotonicity & ceiling (no rung demands more Influence than its tier can grant) and accrual-arithmetic tie-out (deed inventories sum to the locked ~70% gate share, deed bases ≤ their 0.04·band-top cap, per-rung costs sum to the lo

**Context.** verify is the only gate (no hosted CI). The two most design-breaking round-1 bugs (impossible R6 gate; T0 deed-count mismatch) and the round-1+2 real-name leaks (Nihonbashi, Toyama, Konoe) are all statically machine-checkable yet none are in the verifier. The '70/30 split' is a 'tunable proposed realisation' so a hard-equality assert risks brittleness (needs a tolerance), and the real-name lint needs a curated allow-list and an owner.

**Rec.** Add the gate-monotonicity/ceiling check and the real-name lint now (cheap, catch the exact recurring failure classes), with the accrual tie-out as a tolerance-based check; for §4 derived tables, mark them illustrative-of-formula pointing to generated docs/balance/ as canonical rather than hand-maintaining them. Decide whether current T4 names are grandfathered or fictionalised (see Q27).

<sub>Findings: `test-harness-adversarial-1`, `test-harness-adversarial-2`, `theme-authenticity-sensitivity-3`</sub>

### Q23. [LOW] The v1 quest-type budget is stated two ways: §7.1.1/§2.12/§1.11/D-012 say 'the 4 types' (PEST-CONTROL/HUNT/CLEAR/DEFEND) with others 'parked for T2+', but v1 = T0–T2 and T2 authors DUEL (Hanzaki), BOUNTY (poacher), and INVESTIGATE one-shots. Keep '4' as the repeatable-grind cut-set and clarify that bounty/duel/investigate reappear at T2 only as bespoke one-shots (rewording 'parked for T2+'→'post-v

**Context.** Engineering scoping off '4 types' would under-build T2; but the doc consistently distinguishes the 4 repeatable standing-earners from the parked types reintroduced as bespoke set-pieces. Either way the phrase 'parked for T2+' literally collides with v1 = T0–T2.

**Rec.** Keep '4' as the repeatable-grind cut-set and add the one-line one-shot note + reword 'parked for T2+'→'post-v1' — preserves the lean-scope headline while removing the literal contradiction.

<sub>Findings: `content-volume-3`</sub>

## R2·E — Full round-2 findings catalog (37, by cluster)

### [HIGH] Economy/market §4 number-spine is incomplete (coin is a dead-end currency; market engine has zero numbers; resource caps undefined)
*§2.4(b)(c)(e), §3.8, §4.7* — Three lenses converge: §2.4(c) and §3.8 twice promise the market numerics (koku↔coin exchange rate, per-good buy/sell prices or spread, saturation/recovery rates) '→ §4', but §4.7 defines none — coin appears only as flavour, has sources (trade surplus, loot) but no priced sink, and the T1 market that the whole trade economy hangs off cannot be implemented or balanced. Separately §6.5 claims resources carry 'caps' but ResourceDef/GameState store uncapped counts with no cap value or overflow rule. The exploit-loop framing is structurally bounded by the trade ≤⅓ hard invariant and the saturation damper, so this is a completeness gap, not a live exploit — but coin/market/caps are all unspecified balance/data.

- **`exploit-degenerate-6` [Q]** _low_ — The market/economy numbers (koku↔coin rate, buy-side prices, saturation) are promised in §4 but never defined — an unbounded craft/arbitrage money loop cannot be ruled out  
  <sub>docs/prd.md §2.4(c) line 974 ("numbers → §4"); §2.4(b) line 966 (sell-side only); §4.7 lines 2827-2911 (no market table); §4.7.2 lines 2872-2874 (craft value st</sub>  
  §2.4(c) line 974 defines `MarketState { perGoodPriceIndex, saturationByGood, recoveryRate }` and promises "**(numbers → §4)**" — but §4.7 (the producer/cost section) defines gathering yields, crafting, loot, and building costs and contains NO koku↔coin exchange rate, NO buy-side prices, and NO bid-ask spread. The saturation damper is sell-side ONLY (§2.4b line 966: "depresses **sell** prices when one good is flooded"  

- **`economy-simulation-1` [Q]** _high_ — Coin (mon) is a dead-end currency: canon T1 currency with sources but no priced sink, no koku↔coin exchange rate, and a market engine with zero numbers  
  <sub>docs/prd.md §2.4(b)(c)(e) L963-984; §4.7.5 L2900-2911; §3.8 L2187-2188; §4 (L2265-3100, grep-confirmed: coin appears only as flavour)</sub>  
  §2.4(b) L963-967: "convert surplus to coin via trade (brokers/shops); spend koku/coin/materials on crafting, gear, building, and tier-expansion … A market-saturation damper (2.11/2.15) depresses sell prices". §2.4(c) L974: "MarketState { perGoodPriceIndex, saturationByGood, recoveryRate } (numbers → §4)." §2.4(e) L983-984: "Coin (mon) reveals at T1 when the village market/shop row opens." §3.8 L2187-2188 defers "mark  

- **`failure-states-4` [Q]** _low_ — Resources: §6.5 says resources carry "caps" but the ResourceDef shape has none and §6.4 stores uncapped counts — overflow/hard-cap behavior is undefined  
  <sub>docs/prd.md §6.5 registry table L4090 vs §2.4(c) ResourceDef L970-971 vs §6.4 GameState L4046 / L4051</sub>  
  §6.5 L4090: "/ `content/resources.ts` / resources (koku, coin, wood, fish, materials…) + display/emoji + **caps** / `ResourceId` /". But §2.4(c) L970-971 ResourceDef enumerates its fields with no cap: "`ResourceDef { id, name, kind (...), revealPredicate, stackable, perishable?, spoilTicks? }`". And §6.4 stores them uncapped: L4046 "resources: Record<ResourceId, number>", L4051 "inventory: Record<ItemId, number>". No  

### [HIGH] Accrual & gating arithmetic does not tie out (T0 held-koku ledger; R6/E2 Arms floor unreachable; §4.2.2 autumn-season prose vs table)
*§4.0, §4.2.1, §4.2.2, §4.7.1, §4.7.5, §4.8.1* — §4.0/§4.7.1 assert ~21K koku produced → 3–5K held, implying ~16–18K of sinks, but the only koku-denominated sinks in §4 total 2.4K (E1+E2); food/tools/crafting are koku-free and debt clearance is an Influence GAIN — and the per-rung throughput is labelled 'net' then re-deducted as gross (double-count). Round-1's impossible-gate fix only audited E2's Estate side; the same gate's Arms ≥0.4K floor is unreachable on the §4.8.1 schedule (~0.36K reached at R6). And §4.2.2's worked tie-out prose mislabels seasons 4 & 8 as the autumn harvest-bump seasons when the table marks 3 & 7 (season 8 is winter) — an off-by-one in the canonical regression-tested example (trivially fixable). The master bookkeeping is internally inconsistent.

- **`economy-simulation-2` [Q]** _high_ — The T0 held-koku ledger does not close: ~16K of koku sinks are asserted but never priced, so affordability/soft-lock can't be verified (and 'net' throughput is deducted twice)  
  <sub>docs/prd.md §4.7.1 L2852-2858; §4.0 L2282-2284; §4.7.5 L2906-2909; §4.2.1 L2397</sub>  
  §4.0 L2284 and §4.7.1 L2858 both assert T0 = "~21K produced (~3–5K held)" / "lifetime-produced koku over T0 ≈ 21K (held ≈ 3–5K after spend)". Going from 21.5K produced to 3-5K held requires ~16-18K koku of sinks. But the ONLY koku-denominated sinks defined anywhere in §4 are E1 (400 koku) + E2 (2K koku) = 2.4K (§4.7.5 L2903-2904). Food has no koku price (§2.3 FoodItem L942 = restoreSatiety only); crafting costs are m  

- **`devils-advocate-2` [Q]** _medium_ — Round-1's impossible-gate fix only audited the ESTATE side of the R6/E2 gate — the ARMS side (Arms ≥ 0.4K at R6) is unreachable on the §4.8.1 schedule, and intent-fidelity-1 is understated as a result  
  <sub>docs/prd.md §4.7.5 line 2904 / §4.8.1 R5-R6 lines 2959-2960 vs §4.2.1 Arms deed cap line 2381 + Arms itemization lines 2412-2413 / seasonal Δs line 2539</sub>  
  Round-1 numbers-balance-1 fixed E2's ESTATE floor (1K→0.6K) but never checked E2's ARMS floor on the same gate: line 2904 E2 = 'Estate ≥ 0.6K + Arms ≥ 0.4K, rank ≥ R6'. Tracing the §4.8.1 Arms accrual: Arms deeds 'BEGIN accruing' only at R5 (line 2959: 'first DEFEND deed (20 ip) + ~6 Arms deeds (Arms→~0.25K)'); R6 adds '~5 Arms deeds' (line 2960). Each T0 Arms deed is capped at 20 ip (line 2381), so R6's 5 deeds add   

- **`devils-advocate-4` [applied]** _low_ — §4.2.2 internally disagrees on WHICH seasons are autumn — the worked tie-out marks seasons 3 & 7 as Au, but the prose says the autumn bump lands on '(4 & 8)' and calls season 8 'the final autumn' (it is winter)  
  <sub>docs/prd.md §4.2.2 line 2519-2520 vs table lines 2531 & 2535 and ordering line 2523</sub>  
  Line 2523 fixes the order 'Seasons read Sp→Su→Au→Wi ×2', and the worked table marks season 3 ('3 **Au**', line 2531) and season 7 ('7 **Au**', line 2535) as the autumns; season 8 is '8 Wi' (line 2536), i.e. winter. But the prose immediately above contradicts the table twice: line 2519 says the basis reaches '100 % (season 8, the final autumn)' — season 8 is winter, not autumn — and line 2520 says 'Estate's autumn sea  

### [HIGH] v1 narrative integrity at the climax/ending is contradictory or starved
*§1.4, §1.8, §3.5, §3.6, §3.6.2, §5 T3/T4, D-006* — The single most load-bearing beats are broken. (1) The v1 T3 cliff-hanger stub is doubly-defined: the §5 T3 header alone says it is the Porter-Guild first-contact (already spent at T2-G0/G1), while every other section (G7, §3.5, §3.7.1 C0, §5 T3.2) opens onto the castle-town/Daikan — a builder following the header would ship a confused rerun. (2) The round-1 'climax→spine' fix is incomplete: the G6 spine event-log line hands the titular name 'Tahei' to every player, but the same cell's structured field, O5, and LOCKED §1.4/D-006 gate name-reclamation to the optional Origin track — self-contradictory at the emotional climax of a game titled Kami-kakushi. (3) The locked Naoyuki rivalry→respect→brotherhood arc vanishes for all of T1 (~8h); 'respect' is never beated and v1 jumps straight to a G5 ally-flip — likely reading as unearned.

- **`narrative-pacing-emotion-1` [Q]** _high_ — The v1-ending cliff-hanger is doubly-defined: §5 T3 calls the buildable stub the Porter-Guild first-contact, but that is a T2-G0/G1 beat — every other section makes the stub the castle-town  
  <sub>docs/prd.md §5 T3 header line 3653-3656 vs §3.6 G0/G1 (lines 2021-2022), G7 diegetic (line 2028), §3.5 (line 1967), §3.7.1 C0 (line 2142), §5 T3.2 beat 1 (line </sub>  
  §5 T3 (3653): "The single buildable T3 node for v1 is the **Kaidō Porters' & Transport Guild first-contact** (Kanta's favour run + the first *sekisho* turn-back)... The T2 capstone opens onto exactly this one teaser, then ends." But those beats are already spent IN T2: §3.6 G0 (2021) "friend **Kanta** runs the house's first consignment off the books"; §3.6 G1 (2022) "first *sekisho* turn-back → obtain a pass". And th  

- **`narrative-pacing-emotion-3` [Q]** _medium_ — The Naoyuki rival→respect→brotherhood arc is starved in v1: he vanishes for all of T1 (~8h), the 'respect' stage is never beated, and v1 delivers only a single G5 ally-flip before the brotherhood payoff is cut to T4  
  <sub>docs/prd.md §1.8 (line 497), §5 T0.5 (lines 3212-3213), §3.6.1 G4→G5 (line 2059), §5 T4.5 (line 3805); NO Naoyuki mention anywhere in T1 (§3.4 V0-V7 lines 1906-</sub>  
  The arc is seeded as three stages — §1.8 (497) 'Arc: rivalry → grudging respect → brotherhood'; §5 T0.5 (3213) 'grudging vouch in T0 that plants the rivalry → respect → brotherhood arc.' A grep for 'Naoyuki' returns hits in T0 (R4 vouch) and T2 (G5) and T3/T4 — but ZERO hits anywhere in T1's 8 hours. The sole v1 development is the abrupt G5 flip: §3.6.1 (2059) 'heir **Naoyuki** now turns from internal rival into **al  

- **`devils-advocate-1` [Q]** _medium_ — Climax fix is INCOMPLETE: the round-1 'climax→spine-guaranteed' fix put the name-reclamation onto the SPINE event-log line, contradicting the locked §1.4/D-006 canon that the name is a side-thread beat (and the same cell's own Origin gating)  
  <sub>docs/prd.md §3.6 G6 cell line 2027 + §3.6.2 O5 line 2097 vs §1.4 lines 148-149 / D-006 line 771</sub>  
  The round-1 fix correctly moved the Otsuru/Tama truth to the spine, but its G6 SPINE event-log copy (line 2027) — the rung's own diegetic line shown to EVERY player — reads: "...And down-valley: she is real, and grown, and not you. 'Tama ran. Tama lived.' You have a name again: Tahei. You set it down quietly, and pick the house's work back up." That asserts the name-reclamation for all players. Yet the SAME cell's st  

### [HIGH] Authenticity: real-name leaks & period/terminology slips break the hard-locked 'fictionalise real names' canon
*§1.7.1, §1.8, §1.13, §3.7, §5 T4* — Two famous real-person/house names appear at the endgame: 'Junkenshi Toyama Saemon-no-jō' is the documented formal name of Tōyama Kagemoto ('Tōyama no Kin-san'), cast in his real wise-judge role and a period slip; and 'Rusui Konoe' uses a premier go-sekke regent court-noble house name on a minor samurai functionary (status anachronism), saturating the entire T4 tier as the sole recurring capital face. Both violate the human-locked A6/§1.13 'no real place/daimyō/house names' rule (round-1 caught Nihonbashi; these are fresh leaks). Plus a low terminology slip: 'Osaka fudasashi' conflates Edo-specific stipend brokers with Osaka's kuramoto/kakeya (§1.7.1 L466 / §3.7 L2175, trivially correctable).

- **`theme-authenticity-sensitivity-1` [Q]** _high_ — Touring Inspector 'Toyama Saemon-no-jō' is a real historical magistrate — a real-name leak beyond round-1's Nihonbashi  
  <sub>docs/prd.md §1.8 line 551; §5 T4.2 lines 3782-3783; §5 T4.3 line 3795</sub>  
  §1.8 L551: "**Junkenshi Toyama Saemon-no-jō (the Touring Inspector)** / A senior shogunal inspector." Repeated at L3782-3783 ("**Junkenshi Toyama / Saemon-no-jō** will survey the domain") and L3795 ("**The Touring Inspector (Toyama Saemon-no-jō)**"). 'Tōyama Saemon-no-jō' is the documented formal name of Tōyama Kagemoto (遠山左衛門尉景元, 1793–1855), the famous Edo machi-bugyō universally known in jidaigeki as 'Tōyama no Kin  

- **`theme-authenticity-sensitivity-2` [Q]** _high_ — Recurring T4 face 'Rusui Konoe' uses a real premier court-noble (sekke) house name and creates a status anachronism  
  <sub>docs/prd.md §1.7.1 line 470; §1.11 lines 640/668; §3.7-area line 2174; §5 T4.1/T4.2 lines 3755/3771/3774/3780/3788; §5 T4.4 line 3802</sub>  
  §1.7.1 L470: "the house **staffs & runs the domain's establishment** (rusui **Konoe**)"; §5 T4.4 L3802: "**Rusui Konoe Settsu-no-suke** (the MC's sole pen-pal proxy in the capital)". 'Konoe' (近衛) is one of the five sekke regent houses of the court nobility (and the surname of 20th-c. PM Konoe Fumimaro) — among the most recognisable real Japanese house names. It is used here, 8+ times, for a provincial domain's *rusui  

- **`theme-authenticity-sensitivity-6` [Q]** _low_ — 'Osaka fudasashi' is a terminology slip — fudasashi were Edo-specific; Osaka's rice-finance brokers were kuramoto/kakeya  
  <sub>docs/prd.md §1.7.1 line 466 (and §3.7 line 2175)</sub>  
  §1.7.1 L466: "village broker → regional warehouse → *Marutaya* debt-restructuring → *goyōkin* → Osaka/Edo *fudasashi*." §3.7 L2175 repeats "The **Osaka / Edo *fudasashi***". *Fudasashi* (札差) were specifically the Edo (Asakusa) stipend-rice brokers for hatamoto/gokenin; Osaka's rice-market intermediaries for daimyō kurayashiki were *kuramoto* (warehouse managers) and *kakeya* (financial agents). 'Osaka fudasashi' conf  

### [MEDIUM] Combat system underspecified for build (weapon lines, stance roster, retreat, difficulty calibration, recovery location)
*§2.7, §2.8, §4.6, §4.8, §7.2 M2* — Combat is a first-class pillar but the least-specified system. The LOCKED '2-3 weapon lines' are never enumerated or differentiated (combat math treats every weapon skill identically — a pure reskin). Stances exist only as a TYPE with no concrete roster, and the type vs formulas disagree: defense reads stance.defMod (not declared — trivially addable), attackPower ignores the declared stance.attackMod, and targetCount has no multi-target resolution. Retreat is a first-class verb but its resolution (clock/HP/loot/Arms-dent) is undefined. Difficulty is calibrated/CI-tested at exactly one point (R3 wolf); ~8 later rungs and ~12 mobs have no win-rate target. And the headline 25%→85% recovery is mislocated: §4.6.6 says it happens 'over real R3 play' but the 85% endpoint needs weaponSkill 5 + a crafted blade, both gated to R4–R5.

- **`failure-states-3` [Q]** _medium_ — Combat has three player exits (win / loss / retreat) but only win and loss are specified — retreat's resolution is undefined  
  <sub>docs/prd.md §2.8(a) L1097 / §2.8(b) L1110 / §2.8(c) L1123 and §6.3 Intent L3993, vs §4.6.5 (win) L2796-2802 and §4.6.6 (loss) L2804-2823</sub>  
  Retreat is a first-class verb: §2.8(a) L1097 "the player intervenes with stance / ability / item / **retreat**"; §6.3 L3993 "{ type: 'combat_action'; action: CombatAction } // ability/item/**retreat**". But §4.6.5 defines only the on-kill (win) path and §4.6.6 is titled "the soft-setback-on-**loss** rule" — there is no §4 rule for what a retreat does (clock cost? HP carried out? loot kept/dropped? does it count as a   

- **`build-diversity-3` [Q]** _medium_ — The 2-3 weapon lines are named LOCKED v1 content but never enumerated or mechanically differentiated; the combat math treats every weapon skill identically  
  <sub>docs/prd.md 7.1.1 line 4380 + 2.7(e) line 1088 (LOCKED '2-3 weapon lines') vs 4.6.1 lines 2758/2761 (generic weaponSkill terms)</sub>  
  Line 4380 lists the LOCKED v1 skill set including '2-3 weapon lines' and line 1088 repeats it, but nowhere does the PRD say WHAT the lines are or how they differ. The only weapon-line hooks in the combat math are generic: attackPower's skillBonus = 0.3*weaponSkillLevel (line 2758) and accuracy = 10 + 0.4*AGI + 0.3*weaponSkillLevel (line 2761). There is no per-line speed/reach/damage/targetCount archetype (no fast-low  

- **`build-diversity-4` [Q]** _medium_ — Stances - a core build/intervention axis - have no defined roster, and the Stance type vs the combat formulas disagree on which fields exist  
  <sub>docs/prd.md 2.8(c) line 1122 (Stance type) vs 4.6.1 lines 2758-2762 (formula field usage); M2a phase 1 line 4529 ('stances are defined')</sub>  
  Stance is defined only as a TYPE: Stance { attackMod, speedMod, evasionMod, targetCount } (line 1122). No concrete stances (e.g. aggressive/defensive/guard) with values are ever specified anywhere in 4.6 or 4.x, yet M2a phase 1 (line 4529) asserts 'stances are defined.' Worse, the type and the formulas are mutually inconsistent: defense = gearDef + 0.5*STR + stance.defMod (line 2762) reads a defMod field that the Sta  

- **`build-diversity-6` [applied]** _low_ — Stance type omits the defMod field that the defense formula reads (undefined field reference)  
  <sub>docs/prd.md 2.8(c) line 1122 (Stance type) vs 4.6.1 line 2762 (defense formula)</sub>  
  Line 2762: defense = gearDef + 0.5*STR + stance.defMod. Line 1122 declares Stance { attackMod, speedMod, evasionMod, targetCount } - no defMod. The defense formula references a field the type does not declare. Grep confirms line 1122 is the only Stance type shape and 'defMod' appears only in the formula at line 2762.  

- **`difficulty-curve-1` [Q]** _medium_ — The combat difficulty curve is calibrated at exactly ONE point (R3 wolf); every later mob/rung win-rate is unspecified and the pacing/fun regression only measures economy + the first fight  
  <sub>docs/prd.md §4.8.1–§4.8.3 (lines 2952-3026), §4.6.6 (lines 2806-2814), §7.2 M5 line 4692, M2a lines 4520-4522; docs/fun-factor.md line 160</sub>  
  The ONLY combat-difficulty anchor in the whole spec is the R3 wolf: §4.6.6 'wins only ~20–35% of the time' rising to '~85%+'. fun-factor.md line 160's combat proxy is identical and first-fight-only: 'Combat tension band / First-fight win ~20–35%; climbs to ~85% over the rung (§4.6.6)'. The §4.8.1-3 pacing tables track only 'Gating cost' (koku/deeds/ip) and 'wall-clock' — never a win-rate. The headless regression test  

- **`difficulty-curve-5` [Q]** _medium_ — The 25%→85% recovery is mislocated: §4.6.6 says it happens 'over real R3 play', but 85% needs weaponSkill 5 + a crafted blade, while R3 reaches only weaponSkill 3 and crafting opens at R4  
  <sub>docs/prd.md §4.6.6 lines 2811-2814 vs §4.8.1 R3 line 2957 & §3.2 R4 line 1802 / §2.10 line 1181</sub>  
  §4.6.6: 'After ~a season of drills (weaponSkill ~5, attrs ~10, a smith-forged blade), win-rate against that same wolf is ~85%+ ... "~a season of drills" is now ~30–40 min of real R3 play (the per-rank floor) — the climb from ~25 % to ~85 % is felt as earned over real time'. But R3's own gating budget (§4.8.1 line 2957) only reaches 'weaponSkill→~3', not 5; the crafted/smith-forged blade requires the 'simple Crafting   

### [MEDIUM] Pacing-engine rules missing: soft-stamina floor and simultaneous-reveal serialization
*§2.1, §2.3, §4.7.1, §4.9, §6.3* — Two engine-level pacing contracts have no realizing rule. The 'soft stamina never to zero' guarantee has no floor constant or satiety→rate curve anywhere in §4 (it is even absent from the §4.9 levers index), so a naive implementation can asymptote the labour/combat-speed multiplier toward 0 — the crawl-to-halt the system explicitly forbids. And the signature 'act → ONE thing fades in' reveal cadence is undefined at simultaneity: §6.3 reduce lets plural surfaces flip true on one tick with no queue/ordering, so ≥2 predicates can stack multiple panels/log lines at once.

- **`failure-states-1` [Q]** _medium_ — "Soft stamina never to zero" has no realizing floor constant — the low-satiety rate can asymptote to a halt  
  <sub>docs/prd.md §2.3(c) L940-941 and §4.7.1 L2837 (and the whole of §4 — no constant exists)</sub>  
  §2.3(c) L940-941: "a soft-throttle function maps low satiety → a *rate multiplier* on labour/combat speed (never to zero)." The only place the multiplier appears in the balance section is §4.7.1 L2837: "yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · (soft-stamina rate)". No SATIETY/STAMINA floor value, curve, or minimum multiplier is defined anywhere in §4 (the throughput tie-out at L285  

- **`failure-states-6` [Q]** _low_ — Two surfaces unlocking on the same reduce/tick has no defined serialization — the signature "one reveal at a time" pacing is undefined at simultaneity  
  <sub>docs/prd.md §2.1(a) L862-865 / §2.1(b) and §6.3 reduce L4009-4011</sub>  
  §2.1(a) L862-865 frames each reveal as a single beat ("one event that simultaneously: pushes a diegetic log line, reveals the next panel/tab/resource/area...") and §2.1(b) as fractal/one-at-a-time ("things *appear*, each announced in-fiction"). But §6.3 reduce L4009-4011: "re-checks unlock and tier-threshold predicates so **newly-earned surfaces** flip to unlocked and push their diegetic log line" — plural surfaces c  

### [MEDIUM] Accessibility & UX gaps (entry point, mobile IA, ARIA live region, kanji labels, textScale, save-loss, settings drift)
*§2.21, §3.5, §6.4, §6.8, §6.11; ui-design §3.3/§5/§8; qa-playtesting* — A11y is asserted as 'cannot be an afterthought' but lacks the wiring/QA to guarantee it. Settings has no always-available entry point at the bare cold open (colourblindMode/mute/pause unreachable). Mobile bottom-bar (3-5 slots) vs ~8-9 revealed nav surfaces has no primary/overflow rule. The 5-channel event log as one ARIA live region has unspecified politeness/scope (would flood AT) and the a11y acceptance runs keyboard+touch only, never a screen reader. Kanji-only labels + aria-hidden emoji + K/M/B abbreviations leave AT users with bare CJK and ambiguous numbers. textScale is offered but no QA tests large-scale reflow and the §3.3 display clamp uses vw units that bypass root-font scaling. Single autosave + import/'fresh start' overwrite with no required confirm or pre-overwrite backup on a no-reset ~28.5h saga. And §2.21(c) settings shapes drift from §6.4 (colorblindMode vs colourblindMode, reduceMotion vs reducedMotion — a silent key-mismatch build bug — plus a persisted 'paused' and over-scope volume sliders).

- **`accessibility-ux-1` [Q]** _medium_ — Accessibility/audio controls have no always-available entry point — Settings is absent from the nav-reveal ladder, so textScale/colourblindMode/mute/pause are unreachable at the cold open when an a11y-dependent player needs them first  
  <sub>docs/prd.md §3.5 nav-reveal (lines 1957-1967) & §6.9 (line 4205); docs/ui-design.md §5.6 (line 376); §6.11 (line 4257)</sub>  
  §6.11 promises a11y basics are 'wired so they cannot be an afterthought' (line 4257), including a `textScale` setting, `colourblindMode`, a `mute` toggle and a `pause`. But the entry points are never made always-available. The §3.5 nav-reveal table (lines 1959-1967) ladders the nav as: '(none) — single column' → Skills → Combat → Map → House → Village → Region → Ties → Castle-town — **with no Settings row at all**. u  

- **`accessibility-ux-3` [Q]** _low_ — Mobile information architecture at T2 is undefined: ~8-9 revealed nav surfaces vs a 3-5-slot bottom tab-bar, with no rule for the primary/overflow split — and in tension with 'same entries, same order, both layouts'  
  <sub>docs/ui-design.md §8 (lines 485-487) vs §3.5 nav ladder (lines 1959-1967)</sub>  
  ui-design §8 (line 485) states 'Desktop nav rail and mobile bottom-bar/drawer grow the same number of entries in the same order', then (lines 486-487) 'Mobile: bottom tab-bar for the 3–5 primary areas (thumb reach); secondary/overflow in a drawer/sheet'. But by T2 the §3.5 nav ladder reveals Skills, Combat, Map, House, Village, Region, Ties, plus the Castle-town stub — roughly 8-9 surfaces. A bottom bar capped at '3–  

- **`accessibility-ux-4` [Q]** _low_ — ARIA live-region scope/politeness is unspecified — the whole 5-channel event log as one live region would flood assistive tech with combat/reward/system noise; and the a11y acceptance only runs keyboard+touch, never a screen-reader pass  
  <sub>docs/prd.md §6.11 (line 4268) & §7.2 M7 phase 6 (line 4697); docs/ui-design.md §5.1 (lines 312-322)</sub>  
  §6.11 (line 4268): 'the event/story log is an ARIA live region so reveals/important events are announced to assistive tech'. ui-design §5.1 (line 312) repeats it, but the same log carries FIVE channels (lines 316-322): narration, reward (every `+N`), combat (every fight outcome / `⚔️` line), system (restocks, saves — 'the quietest tier'), and milestone/reveal. Nothing specifies the live-region politeness level (polit  

- **`accessibility-ux-5` [Q]** _low_ — Kanji-only labels with aria-hidden emoji give screen-reader users bare CJK glyphs (pillars, rank names, season tags) with no romaji/English accessible name or lang tag; K/M/B numbers are also unexpanded for AT  
  <sub>docs/ui-design.md §7 (line 455), §5.3 pillar table (lines 344-350), §5.7 (lines 382-389); docs/prd.md §6.11 (line 4269)</sub>  
  ui-design §7 (line 455): 'Emoji are decorative (aria-hidden="true"); the kanji/word always carries the meaning.' The four-pillar panel (§5.3, lines 344-350) renders each pillar as a kanji label (武威 / 官威 / 家産 / 家格 / 家威) + an aria-hidden emoji + a colour; rank cards (§5.4) show kanji titles; season tags are 春/夏/秋/冬. With the emoji hidden and meaning carried 'by the kanji', a non-Japanese screen-reader user is left with  

- **`accessibility-ux-6` [Q]** _medium_ — textScale is offered as the core a11y lever but no acceptance/QA criterion tests that the dense multi-screen layout reflows at large text scale, and the display type scale uses `vw` units that bypass the root-font scaling model  
  <sub>docs/prd.md §6.11 (line 4259); docs/ui-design.md §8 (line 494) & §3.3 (line 161); docs/plans/qa-playtesting.md (line 157)</sub>  
  §6.11 (line 4259): 'Scalable text (a `textScale` setting on `GameState.settings`, applied via CSS custom property; respects the browser/root font size).' But the 'states that break layouts' checklists never include large textScale: ui-design §8 (line 494) lists 'K/M/B growth (test 999B), long logs, many revealed tabs, and the smallest viewport'; qa-playtesting line 157 lists 'K/M/B number growth ..., long event logs,  

- **`accessibility-ux-7` [Q]** _medium_ — Single autosave + import/'fresh start' overwrite the one slot with no required confirm and no pre-import backup — real save-loss/accidental-overwrite anxiety over a no-reset ~28.5h saga  
  <sub>docs/prd.md §6.8 (lines 4164, 4169, 4179-4181); docs/ui-design.md §5.10 (line 407)</sub>  
  §6.8 (line 4164): 'A single object store holds one autosave slot (canon: single autosave).' Import is specified as '(line 4169) The same serialized save is base64-encoded ... and import — the player's portable backup ... Import validates + migrates.' — i.e. import overwrites the single live slot with no stated confirm and no automatic pre-import backup. The graceful-degrade path (lines 4179-4181) offers, on a corrupt  

- **`accessibility-ux-8` [Q]** _low_ — §2.21(c) settings data shapes are out of sync with §6.4 — field-name drift (colorblindMode/reduceMotion vs colourblindMode/reducedMotion), a persisted `paused`, and ambient/sfx volume fields that exceed the locked 'mute toggle'  
  <sub>docs/prd.md §2.21(c) (lines 1667-1668) vs §6.4 (line 4065) & §6.11 (lines 4262, 4265)</sub>  
  §2.21(c) line 1667: '`A11ySettings { textScale, colorblindMode, reduceMotion, paused }` (persisted)' and line 1668: '`AudioSettings { ambientVolume, sfxVolume, muted }`'. §6.4 line 4065 stores: '`settings: { textScale: number; colourblindMode: boolean; reducedMotion: boolean; muted: boolean }`'. §6.11 uses `colourblindMode` (line 4262) and `reducedMotion` (line 4265). As literal TS field names these collide: `colorbl  

### [MEDIUM] QA harness & fun-proxy drift from the PRD spec
*§2.20, §6.10; fun-factor §2.1/§3/§6; qa-playtesting §1/§3* — The measurement layer the project self-tests with is inconsistent with the spec it measures. The canonical __qa/QaApi contract (§6.10/§2.20) omits pacing() and reveals() — the exact telemetry methods the fun-proxy regression suite and reveal-cadence proxy are built on (additive, trivially fixable). fun-factor's 'recognised deed every ~4.5-5 min' cadence is a T0-only figure stated as the global proxy/reward-desert guardrail, but the locked T2 budget deliberately delivers ~13 min/deed — a literal reading false-fails the doc's own named slump zone. And the ≥30-min floor proxy says 'a rung' not 'a grind rung', false-failing the blessed ~5-min R0 cold open (trivially qualifiable, and qa-playtesting already scopes it correctly).

- **`cross-doc-satellite-1` [applied]** _medium_ — The DEV play API (§6.10 / §2.20) omits pacing() and reveals() — the exact methods the QA harness and fun-factor measurement are built on  
  <sub>docs/prd.md §6.10 (window.__qa block, lines 4232-4244) and §2.20 QaApi (line 1639); vs docs/plans/qa-playtesting.md §1 (lines 50-52) and docs/fun-factor.md §3 (</sub>  
  qa-playtesting.md §1 lists three Observe methods as the harness's primary interface: `state()`, `pacing()` ("pacing/telemetry object — Proxy metrics accumulated this run (§3)") and `reveals()` ("revealed-entry log — What's been unlocked + when (tick/season) — verifies the reveal cadence"), plus Drive helpers `advanceSeason()/toRung(id)/toTier(n)`. fun-factor.md §3 says the fun targets are measured by "the auto-player  

- **`cross-doc-satellite-2` [Q]** _medium_ — fun-factor's "recognised deed every ~4.5-5 min" cadence is a T0-only figure but is stated as the global reward-cadence proxy — the locked T2 budget delivers ~13 min/deed  
  <sub>docs/fun-factor.md §3 (line 155), §2.1 (line 68), §6 reward-deserts (line 257); vs docs/prd.md §4.8.3 (line 3021) and §4.8.1 (line 2966)</sub>  
  fun-factor.md states the reward-cadence proxy threshold as "A reward/unlock/number-jump at least every ~X min; a recognised deed every ~4.5–5 min (§4.8.1)" (§3), repeats it as "the texture is 'a recognised act every ~4.5–5 min' (§4.8.1)" (§2.1) and as the reward-desert guardrail "the ~70% deed stream sized to 'a recognised act every ~4.5–5 min' (§4.8.1)" (§6) — all unqualified by tier. But the cited §4.8.1 is explici  

- **`cross-doc-satellite-4` [applied]** _low_ — fun-factor's ≥30-min-floor proxy says "a rung" not "a grind rung" — it would false-fail the blessed ~5-min R0 cold open, diverging from qa-playtesting which correctly scopes it  
  <sub>docs/fun-factor.md §3 (line 158); vs docs/plans/qa-playtesting.md §3 (line 124) and docs/prd.md §4.8.1 R0 carve-out (lines 2972-2977)</sub>  
  fun-factor.md §3 states the proxy as "Optimal bot can't clear a rung < ~28 min (§4.8); casual bot never *stuck*" — unqualified, so it covers R0. But the PRD blesses an R0 exemption: "R0 floor carve-out — blessed by the human (2026-06-25). The ≥30-min per-rank floor ... applies to the 7 grind rungs R1–R7; R0 is the exempt ~5-min cold-open story rung" (§4.8.1), and §4.8.4 enforces the CI floor only on rungs that should  

### [MEDIUM] UI-design palette/rate rules contradict PRD canon and the bible's own §2 tokens
*ui-design §2/§5.3/§5.7/§6.3; prd §1.6.2/§2.16/§4.9* — The UI bible has two internal/canon palette conflicts on the signature four-pillar panel. §5.3 illustrates 'always show the rate next to the total' on the House-Influence roll-up (家威 +12/koku), implying the very time-trickle the PRD HARD INVARIANT forbids for Influence. And §6.3's pillar number-jump flashes 'toward --shu on gain / --ai on loss', which spends the reserved vermilion seal colour on ~70% routine deeds and uses --ai (the §2 gain colour) for losses — flatly inverting/colliding with the §2 delta tokens (gain=--ai, loss=--beni) and §6's 'routine ticks stay quiet' rule. Both fixes live in ui-design.md; the PRD body is correct.

- **`cross-doc-satellite-3` [Q]** _low_ — ui-design shows a continuous rate readout on the House-Influence roll-up (家威 +12/koku), contradicting the canon no-time-trickle accrual invariant  
  <sub>docs/ui-design.md §5.3 (line 339); vs docs/prd.md §1.6.2 / §2.16 / §4.9 hard invariant (line 3079-3081)</sub>  
  ui-design §5.3 illustrates the meter rate-display rule on the Influence roll-up: "Always **show the rate next to the total**: `家威 4.20K (+12/koku)`." But the PRD's HARD INVARIANT (§4.9) is "accrual = jumps + seasonal-judged-on-high-water-mark only (no time-trickle, no flat per-action)"; §2.2(d) "It never grants Influence by itself (no time-trickle)"; §6.6 verifier "no Influence path is a passive per-tick trickle or f  

- **`cross-doc-satellite-5` [Q]** _medium_ — ui-design §6.3 pillar-jump colour-flash (--shu gain / --ai loss) contradicts the §2 delta tokens (--ai gain / --beni loss) and spends the reserved seal colour on routine ticks  
  <sub>docs/ui-design.md §6.3 (line 439); vs §2 palette tokens (lines 75-76, 93, 96) and the §6 motion rule (line 416)</sub>  
  §2 fixes the delta semantics as the source of truth: "--delta-pos: var(--ai); /* gains = indigo */", "--delta-neg: var(--beni); /* losses = beni */", and "Deltas use indigo/beni... Gains in --ai, losses in --beni." §2 also reserves vermilion: "The vermilion (--shu) is a stamp, not a coat of paint. It appears on the House seal/crest, the single primary CTA..., and the rank-up beat." But §6.3 (the pillar number-jump, t  

### [MEDIUM] Content scope reconciliation: T2 anti-slump package and quest-type budget
*§1.11, §2.12, §2.13, §3.6, §4.2.2, §4.3, §4.8.3, §7.1.1, D-012; fun-factor §5d/§7* — Two scope mismatches between intent and authored content. The fun-doc's four-part T2 anti-slump 'package' is only half-authored: the front-loaded G0 verb and the fractal re-run-at-scale ARE present, but the seasonal-twist strategy-rotation and the combinatorial cross-pillar combos are unwritten — and the combos directly conflict with §4.3's 'no cross-pillar leakage' invariant. Separately the quest-type budget is self-contradictory: locked at '~4 v1 quest types' with bounty/duel/investigate 'parked for T2+', yet v1 = T0–T2 and T2 authors all three (Hanzaki DUEL, poacher BOUNTY, INVESTIGATE one-shots) — so v1 ships ~7 archetypes while the cut-set advertises 4.

- **`content-volume-2` [Q]** _medium_ — The fun-doc's prescribed T2 anti-slump package is NOT authored anywhere in the PRD content tables — the named cure for the named danger is unwritten  
  <sub>docs/fun-factor.md §5d L231-239 & §7 T2 L299-303 vs docs/prd.md §3.6 G0–G7 L2021-2028, §4.8.3 L3003-3026, §5 T2.* L3435-3647 (grep for seasonal-twist/re-run/ref</sub>  
  fun-factor.md §5d lists four CONCRETE counters "all scheduled into T2": (1) "Front-load T2's biggest new verb … at G0, so the longest tier *opens* with its freshest system"; (2) "Seasonal twists rotate the optimal strategy — change what the seasonal judge rewards each cycle"; (3) "Force re-engagement with early loops at new scale — a T2 reform that lets you re-run estate/village deeds for a new resource"; (4) "The cr  

- **`content-volume-3` [Q]** _low_ — Quest-type budget is self-contradictory: locked at "~4 v1 quest types" yet T2 authors BOUNTY, DUEL, and INVESTIGATE as v1 content  
  <sub>docs/prd.md §2.12(a) L1251-1252 & §2.12(e) L1276; D-012 L777; §1.11 L623; vs T2.6 Hanzaki L3618, T2.7 poacher L3638, §2.13 one-shots L1295-1298, M7 build L4658</sub>  
  §2.12(a): "**~4 v1 quest types** … PEST CONTROL, HUNT, CLEAR, DEFEND. Escort/patrol/bounty/duel/expedition/siege/relief/investigate are **parked for T2+**." D-012 codifies the same lean cut-set: "~5 mobs, ~4 quest types, ~6–8 nodes." But v1 = T0–T2, so "parked for T2+" reintroduces them INSIDE v1 — §2.12(e): "Parked quest types reintroduce at T2+." And T2 indeed authors them: Hanzaki is "The recurring DUEL nemesis" (  

### [MEDIUM] Verifier & generate-don't-duplicate coverage gaps (the sole release gate misses balance + real-name invariants)
*§1.13, §2.20(c), §6.6; decisions.md* — verify is the only release gate (no hosted CI), yet §6.6 checks only ids/flags/lint — no gate-threshold monotonicity/reachability and no accrual-arithmetic tie-out, so the impossible-gate and deed-count bug classes (found only by human reading across both rounds) slip through automatically. The hard-locked 'fictionalise real names' canon is the one invariant NOT machine-checked — the structural reason real names keep leaking (round-1 Nihonbashi, round-2 Toyama/Konoe). And generate-don't-duplicate is not applied to §4 itself: gen-docs writes only docs/balance/+docs/content/, never the PRD's own hand-typed derived tables (JUDGE_K, deed-sums, XP points), where round-1 found JUDGE_K/XP drift.

- **`test-harness-adversarial-1` [Q]** _medium_ — The §6.6 verifier checks ids + canon flags but ZERO numeric/structural balance invariants — so the only release gate cannot catch the round-1 impossible-gate OR the deed-count inconsistency  
  <sub>docs/prd.md §6.6 lines 4119-4130 (machine-check list) & §2.20(c) line 1640 (VerifyReport)</sub>  
  §6.6's enumerated machine checks are entirely id/flag/lint shaped: belief-creature-not-in-spawn (4121), trade ≤⅓ (4122), ≤1 ambiguity (4123), 'no Influence path is a passive per-tick trickle or flat per-action increment' (4124), 'no content grants a combat stat/training-rate bonus from labour conditioning' (4125), macron lint (4126-4130). There is NO check that gate thresholds are ordered/reachable, and NO check that  

- **`test-harness-adversarial-2` [Q]** _medium_ — generate-don't-duplicate structurally cannot cover the PRD's own §4 — gen-docs writes only docs/balance/+docs/content/, never docs/prd.md, so every hand-typed derived number in §4 drifts undetected  
  <sub>docs/prd.md §6.6 lines 4132-4137 (gen-docs targets) vs §4.9 JUDGE_K table (3054-3056), §4.2.1 itemizations (2408-2429), §4.5.1 XP figures (2692-2693)</sub>  
  §6.6: gen-docs 'writes balance/content tables into docs/ (e.g. docs/balance/curves.md, docs/content/bestiary.md, docs/content/areas.md, docs/content/ranks.md, docs/content/influence.md). Run with --check ... to fail the build if the committed docs drift from the data.' The generated targets are NEW files under docs/balance/ and docs/content/ — gen-docs never touches docs/prd.md. But §4 of the PRD is itself dense with  

- **`theme-authenticity-sensitivity-3` [Q]** _medium_ — The 'fictionalise real names' canon rule is the one canon invariant the §6.6 verifier does NOT machine-check — the structural reason real names keep leaking  
  <sub>docs/prd.md §6.6 lines 4119-4130 (invariant list) vs §1.13 line 744 + docs/history/decisions.md line 112</sub>  
  §6.6 asserts the canon invariants 'as machine checks so they cannot silently rot' and enumerates them (L4121-4130): no belief-creature in spawn tables; trade ≤⅓; ≤1 ambiguity token; no passive Influence trickle; no labour→combat cross-feed; and a *macron* lint. The 'fictionalise real names' rule — explicitly canon at §1.13 L744 ('no real place/daimyō/house names') and decisions.md L112 ('fictionalise real names') — i  


---

# ROUND 3 — specialized / deep-method battery (2026-06-26)

**Scale:** 84 agents · 71 raw → **39 confirmed** (3 high · 12 medium · 24 low). 12 deep-method lenses (T0 numeric sim, system-interaction matrix, type-level data-model, number-spine re-derivation, naming concordance, impl-readiness, inspiration-genre-gap, prose/tone, T3/T4 coherence, generate-don't-duplicate, determinism-replay, completeness-critic). **Applied:** 6 clerical fixes. **New decisions:** **Q29–Q42** (14). Raw: [`raw/2026-06-26-prd-battery-review-r3.json`](raw/2026-06-26-prd-battery-review-r3.json).

> **Round-3 headline.** The deep methods hit the **T0 economic proof** (the gate proof spends 72 ip on trade deeds that can't exist in T0 — trade is a locked T1 reveal; and koku held-vs-produced is a net/gross double-count), the **§2-type-sketch vs §6.4-persisted-state** gap, the **levers-index** omissions, and — newly owned — the **itch.io deploy target** (cross-origin-iframe IndexedDB can silently wipe the single 28.5h save; emoji render per-OS; audio has no licensing). **Per PD-1/D-021 these §4/§6/§7 items are PROVISIONAL-PLAN — resolve during the M0/M1 build & playtest, not pre-build blockers.**

> **⚠ Cross-round conflict to resolve:** **Q40** (round 3, prose-tone) recommends keeping the Tahei name-reclamation on the **guaranteed G6 spine**; **Q25** (round 2, devil's-advocate) recommends **stripping** it to the optional Origin track. Same beat, opposite recs — a genuine taste call for you. (Both honour 'Otsuru truth = spine'; they differ only on whether reclaiming the *name* is guaranteed or earned.)

## R3·A — Cross-cutting risks (round 3)

1. The T0 economic spine's own proofs are internally invalid: the Estate gate is unreachable as itemized (trade deeds that can't exist in T0) and the koku held-vs-produced accounting is self-contradictory, so the affordability/soft-lock guarantees rounds 1-2 relied on are unproven. This is the single highest-leverage systemic theme.

2. Pervasive 'declared in §2, deferred to §4, never delivered' pattern: rung-meter accrual, soft-stamina throttle magnitudes + its combat applicability, dent self-heal, durability wear, and weather/festival modifiers are all type-backed and milestone-scheduled but lack the rule or numbers needed to implement and test them — directly blocking M1/M2b/M5 and undermining the single-source-of-truth contract.

3. The persisted data model (§6.4) is systematically narrower than the §2 type sketches: no field for the estateWealth sub-engines the ≤⅓ invariant reads, no CombatEncounterState shape for the one must-persist mid-fight blob, and no home for live weather — each threatens the save/byte-identical-resume and the machine-checked invariants.

4. Deploy-target reality (itch.io) was never audited by any lens across three rounds: cross-origin-iframe storage partitioning can silently wipe the single 28.5h autosave, cross-platform emoji variance defeats the anti-AI-slop aesthetic pillar, audio has no licensing/credits, and the zip layout breaks the upload — a whole category of real launch defects.

5. Over-claimed guarantees vs their enforcement: the cross-machine 'byte-identical replay' promise is contradicted by un-linted Math.pow in every growth curve; the 'robust/durable' save claim is inverted by the locked host; the 'no asset pipeline' claim ignores audio. Promises and their guardrails are drifting apart.

6. Documentation drift / SSOT erosion: the §4.9 'complete' tuning dashboard omits whole lever families (§4.3 conversion weights, §4.6.1 combat constants), derived numbers are hand-restated in 4-6 places, the pillar table is duplicated, and a CLAUDE.md vs PRD output-path conflict — all latent maintenance traps on a doc that bills itself as single-source-of-truth.

7. Authorial-voice register leaks: design-meta shorthand ('clean your room'), mechanics, and UI instructions surface in diegetic event-log copy, and the emotional-climax beat is duplicated with a payoff-ownership contradiction — small individually but collectively erode the 'grounded Edo, not AI-doc filler' tone bar.

## R3·B — Fixes applied (round 3, this commit)

| Finding | What changed |
|---|---|
| `sim-t0-first-reveal-skills-1` | §4.8.0's 'first reveal <30s' example names the Skills tab, which is an R2 reveal (tens of minutes in); the actual sub-30s reveal is the koku panel from the §3.1 cold open. The binding measurement colu |
| `number-spine-rederive-2` | The §4.9 'levers index' omits the §4.3 conversion-weight coefficients that §4.3 itself declares are levers; clerical cross-reference append of existing values. |
| `number-spine-rederive-3` | The §4.9 Combat lever line omits the §4.6.1 base constants (incl. hpMax base/slope that the wolf win-rate calibration depends on) that M6.2 must tune via §4.9 only; clerical append of existing constan |
| `type-data-model-7` | RungId is referenced only here and never defined; the canonical id for a rung is RankId (§6.4/§6.5). Dead type drift that fails strict tsc; pure rename. |
| `inspiration-genre-gap-3` | 'achievements' as a player feature appears only in this comment and no achievements registry/screen/milestone exists; v1 milestones never include the feature, so this is loose shorthand. Reword kills  |
| `completeness-critic-4` | itch.io's HTML host needs index.html at the archive root; 'zip dist/' read literally nests it and yields a blank-frame upload. Factual clarification, no design judgement. |

## R3·C — New decisions Q29–Q42 (14)

Per PD-1, §4/§6/§7 items here are **provisional-plan revisions** (resolve during build/playtest), not must-fix-now. Ordered by severity.

### Q29. [HIGH] Fix the two broken halves of the T0 economic proof. (A) The T0 Estate ≥0.8K gate proof spends 72/560 deed-ip on 'sealed trade contracts' at T0, but TRADE is a LOCKED T1 reveal ('no market in T0') — should T0 open a limited rice-sale/barter strand, or be re-itemized using only LAND/TREASURY deeds (e.g. +3 solvency @26 or +5 yield @16)? (B) Is the per-rung koku throughput GROSS o

**Context.** These are the centrepiece T0 balance proofs that rounds 1-2 treated as sound. As itemized, the Estate gate reaches only 728<800, and the held-koku trajectory that affordability/soft-lock depend on is modelled nowhere — so a R6 soft-lock on the gating E2 build cannot be ruled out.

**Rec.** Re-itemize the T0 Estate 560 with LAND/TREASURY deeds (preserves the locked 'no market in T0'), and declare throughput GROSS + author a minimal held-koku ledger so E2@R6 affordability is verified from held — both are needed to close the soft-lock risk.

<sub>Findings: `sim-t0-trade-deeds-1`, `sim-t0-koku-net-gross-1`</sub>

### Q30. [HIGH] How is an estate-ladder rung promotion gated? Pick ONE: (A) numeric meter — rungs flip when a stored estateService/combatStanding meter crosses a threshold, requiring §4 to add the accrual rule (what increments it, by how much, on the 'steep geometric' curve) and a per-rung threshold table; or (B) event/flag-gated — rungs flip on the §3.2.1 narrative triggers (spilled-rice done

**Context.** M1 phase 4 requires the meter to accrue from recognized labour, cross R0→R1→R2, and be Vitest-asserted at the intended GameState — currently unwritable. §3.2.1 supplies codeable narrative triggers, so R0→R1 is implementable today; the missing piece is the meter accrual law + numeric thresholds the prose references.

**Rec.** B (flag/event-gated) for T0 — the §3.2.1 triggers map straight to flags, nothing new to balance, and M1 phase 4's descriptions are already flag-shaped; keep the meters as a smoothed display.

<sub>Findings: `impl-readiness-1`</sub>

### Q37. [HIGH] What storage-survival posture should v1 commit to for itch.io's cross-origin game iframe (third-party IndexedDB is partitioned on Chrome/Firefox, blocked-by-default on Safari/WebKit), and what must M7's done criteria require? The single autosave's only backup (base64 export) is opt-in.

**Context.** §6.8's 'robust, durable' single IndexedDB autosave can be silently wiped on Safari/private-mode, and M7's smoke test names no browser matrix — a 28.5h save loss is a real launch defect in a category no prior lens audited. (Note: itch fullscreen does NOT change the storage partition, so that mitigation is moot.)

**Rec.** matrix+nudge: make base64 export a periodically-nudged first-class backup (low cost, high payoff for a single-slot 28.5h game) AND add the WebKit/Safari + embedded-iframe line to M7's done criteria; the writability probe is a worthwhile stretch.

<sub>Findings: `completeness-critic-1`</sub>

### Q31. [MEDIUM] Specify the soft-stamina/satiety system and whether it throttles combat. (A) Magnitudes: the rate-multiplier curve as a function of satiety %, its non-zero floor, per-action satiety drain + default staminaCost per node, and rest-recovery per tick. (B) Scope: does low satiety throttle combat (add a satiety term to §4.6.1 — which stat(s), enemy symmetry, floor; may shift the LOCK

**Context.** §4.7.1's yield formula multiplies by an undefined '(soft-stamina rate)' and M1 phases 2-3 must implement + test it; §2.3(c)/§6.3 say the throttle hits 'labour/combat speed' but §4.6.1 has no satiety term while §4.7.1 does.

**Rec.** Gentle curve, high floor, labour-only throttle — matches the 'never a wall, paces the day' intent and leaves the LOCKED first-fight win-rate untouched; satiety still drains in combat and is managed via rest/eat between fights (§2.8c). Register the four magnitudes as §4.9 levers.

<sub>Findings: `impl-readiness-2`, `system-interaction-matrix-3`</sub>

### Q32. [MEDIUM] How does a dented pillar's value return to its untouched highWater? The seasonal appraisal increments value only when seasonalScore > highWater; after a dent (HW unchanged) that condition never fires, so the §4.2.4 'self-heals via the appraisal / within 1-2 seasons' promise cannot work. Either (a) add an explicit below-high-water restore branch (a bounded maintenance award, whi

**Context.** 'Recoverable dent, never a wipe, self-heals' is canon (ADR D-015). The only un-gated heal path today is fresh achievement jumps, i.e. re-grinding — which contradicts 'self-heals as play resumes the appraisal' and risks a player who exhausted a tier's deed inventory being stuck below earned standing.

**Rec.** Option (a) — a small below-high-water restore branch that does NOT advance highWater preserves the 'self-heals, never a wipe' canon with a tightly-scoped exception; (b) risks dead-ending a tier whose authored deed inventory is spent.

<sub>Findings: `system-interaction-matrix-1`</sub>

### Q33. [MEDIUM] Define the durability wear/break model so M2b's deterministic reduce can apply it: (1) wear rate per combat hit / per labour action (constant or scaled by damage/tier); (2) at-zero behaviour (auto-unequip, function at base stats, or stay equipped contributing zero); (3) stat scaling (continuous falloff with durability, or full-until-break binary).

**Context.** §2.10/§6.4 store durability and prose says it 'wears', but no rule exists; M2b phase 2 requires reduce to apply wear immutably inside the deterministic core. An ad-hoc rule would be determinism-affecting.

**Rec.** Binary (fixed wear, auto-unequip at 0, full-until-break) — simplest, most legible, avoids a stat branch in the deterministic combat fold; document in §2.10 with numbers as §4.9 levers.

<sub>Findings: `impl-readiness-4`</sub>

### Q34. [MEDIUM] Resolve the persisted data-model gaps in §6.4 against the §2 type sketches: (a) how to store the estateWealth land/treasury/trade sub-engines the ≤⅓ clamp reads (nest on the pillar entry, a parallel subEngines map, or derive the pillar total from stored sub-engines); (b) sketch CombatEncounterState's fields (combatants/HP/statuses, rngCursor, subTickAccumulator, mobDefId) and u

**Context.** §6.4 stores one scalar per pillar (no sub-engine field for the hardest invariant), never sketches the one must-persist mid-fight blob, and carries two undeclared id types (EquipDefId, ChoiceId) plus a verb-name drift — all load-bearing for save/determinism and the M2b clamp tests.

**Rec.** Minimal: store subEngines (with per-strand high-water) on the estateWealth entry, sketch CombatEncounterState explicitly, collapse equipment to ItemId, and branch dialogue via locksLineIds[] (drop choiceId) unless intra-line choices are genuinely wanted in v1.

<sub>Findings: `type-data-model-1`, `type-data-model-4`, `type-data-model-6`, `type-data-model-9`</sub>

### Q35. [MEDIUM] For v1, do weather hazards and festivals carry MECHANICAL effects (needing §4 magnitudes AND a persisted home), or are they cosmetic-only with effects parked post-v1? If mechanical: add a bounded weatherMult to §4.7.1 + a combat-rate modifier to §4.6 (e.g. within ±10% so the locked first-fight/throughput bands hold), festival vendorRestock%/reputation-ip tables, a §4.9 lever en

**Context.** §2.14/§6.4/§6.7/M5 type weather with labour/combat rateModifiers, schedule it, and reserve it an RNG sub-stream, yet §4 has zero magnitudes and no formula hook, and §6.4 gives the live per-day weather draw no persisted field (breaking byte-identical resume).

**Rec.** If shipping the 'living world' pillar, go mechanical with bounded (±10%) modifiers + day-keyed deterministic weather; otherwise explicitly downgrade to cosmetic-v1 so §4 owes nothing — pick one rather than leaving it half-specified.

<sub>Findings: `number-spine-rederive-1`, `type-data-model-8`</sub>

### Q36. [MEDIUM] Determinism policy for growth-curve powers: (a) mandate integer-power-by-repeated-multiplication for all r^n curves AND extend the §6.1 core lint to ban Math.pow/exp/log/trig (whitelisting Math.sqrt), making byte-identical replay hold across machines/builds; or (b) accept that byte-identical replay is guaranteed only within one JS-engine build and re-word the §6.1/§6.7/§6.12 pr

**Context.** All growth curves use integer-exponent `^`; ECMAScript guarantees correct rounding only for +−×÷ and sqrt, so Math.pow can differ by a ULP across engines and a round() near x.5 flips an integer level/cost threshold, desyncing exported saves reloaded under a different engine. CI runs one engine, so the practical break is cross-engine save portability + an overclaimed promise.

**Rec.** (a) — every exponent is an integer so repeated multiplication is fully deterministic and nearly free; extending the lint closes the one cross-machine hole and keeps the LOCKED determinism principle honest.

<sub>Findings: `determinism-replay-deep-1`</sub>

### Q38. [MEDIUM] Resolve two un-audited presentation/asset risks for v1. (A) Emoji are load-bearing aesthetic carriers but render as different per-OS artwork / tofu where no colour-emoji font exists, defeating the 'consistent woodblock, not AI-slop' pillar that one CSS filter can't rescue — bundle a controlled emoji font subset (reintroduces an asset pipeline), replace the load-bearing motifs w

**Context.** D-013 locks TEXT+EMOJI+CSS and §2.21 makes emoji carry pillar/season/rarity identity (emoji are aria-hidden so meaning is carried by kanji/word — no functional break, purely aesthetic). Audio licensing on a public PWYW release is real legal exposure; the PRD is otherwise meticulous about provenance but silent here. Both sit in the deploy/asset-reality category no lens owned.

**Rec.** Replace the load-bearing period motifs (pillar/season/rarity marks) with inline SVG and reserve Unicode emoji for cosmetically-harmless roles; use original/CC0 audio (or add a one-line Credits surface if any third-party asset is used). Add a cross-platform emoji-rendering check to the capture-game-s

<sub>Findings: `completeness-critic-2`, `completeness-critic-3`</sub>

### Q40. [MEDIUM] Resolve the diegetic-register and climax-duplication prose issues (§3). The load-bearing one: the guaranteed G6 spine line and the optional O5 Origin capstone share four near-verbatim sentences and fire at the same moment, and the G6 spine already speaks the 'Tahei' naming that §3.6.2 reserves for the Origin track — who owns the naming? Also: re-cast the V7 'The room is clean' 

**Context.** O5 is meant to DEEPEN G6, not echo it; as written an Origin-completing player reads a doubled log entry, and a non-Origin player still receives the naming the spec reserves for O5 — a payoff-ownership contradiction at the game's emotional peak. The other three are low tone-polish on illustrative spec copy.

**Rec.** naming-on-spine: keep the naming on the guaranteed G6 spine (every player should reclaim the name) and rewrite O5 to genuinely deepen rather than restate; apply the trivial tone fixes (V7 concrete recast, strip the two parentheticals, re-aim the G0 ache). Confirm whether 'clean your room' is ever me

<sub>Findings: `prose-tone-1`, `prose-tone-2`, `prose-tone-3`, `prose-tone-6`</sub>

### Q39. [LOW] Authorial naming/cast hygiene (all low, several touch LOCKED canon). (a) Rename the non-locked T3 clerk Naozane off 'Nao-' to separate him from heir Naoyuki, and the herbalist 'Obaa Sato' off 'Sa-' to separate from Sayo? (b) The Kuroiwa/Kurosawa stem overlap — rename the antagonist (touches locked roster + ~10 uses) or accept as authentic? (c) Re-glyph AGI 体→敏 (or 技) so it matc

**Context.** §1.8 is the cited cast concordance anchor; the collisions co-occur in the same scenes in a text-dense log UI. Most are mild and several names are LOCKED, so renames reopen locked decisions — these are taste calls only the human arbitrates.

**Rec.** Minimal: rename the two non-locked names (Naozane, Obaa Sato), re-glyph AGI→敏, add a Konoe row, and reword Kanbei to a static flavour card (drop 'player-influenceable'); leave the locked names and the authentic -emon cluster alone.

<sub>Findings: `naming-concordance-1`, `naming-concordance-2`, `naming-concordance-3`, `naming-concordance-4`, `naming-concordance-5`, `t3t4-coherence-4`</sub>

### Q41. [LOW] Harden the single-source-of-truth doc surfaces (all low, no live drift today): (a) Name's per-deed-cap band-top (10K/80K) conflicts with its seasonal normalizer TIER_REF_NAME (15K/140K) and the cap formula cites a §4.1 gate Name lacks in v1 — pick one Name band-top and fix the '(= its §4.1 gate threshold)' gloss; (b) the per-deed cap (0.04·band-top) and the four-pillar table ar

**Context.** These are latent drift traps and a cross-doc path contradiction the 'generate, don't duplicate' convention targets; currently consistent but each requires lockstep hand-edits on any retune.

**Rec.** Lightweight now (tag derived values, choose Name's §4.0 display band-top + fix the gate gloss, update CLAUDE.md to docs/balance/ + docs/content/), add the §6.6 verifier assertion when balance.ts lands; full generation is premature for content that isn't yet game data.

<sub>Findings: `generate-dont-duplicate-2`, `generate-dont-duplicate-4`, `generate-dont-duplicate-5`, `generate-dont-duplicate-6`</sub>

### Q42. [LOW] Are these two genre-convention surfaces in scope for lean v1? (a) Bulk affordances — sell-N/sell-all/sell-to-floor on the broker and craft-N on stations — and critically, how does the market-saturation damper apply across a bulk sale (progressive per-unit walk-down vs single pre-sale price)? (b) An in-game changelog/'What's new' panel matching both inspirations.

**Context.** Both are near-universal idle/incremental conventions, but TRADE is a deliberately hard-capped ≤⅓ minor strand and koku is not stack-sold, so bulk payoff is limited to trade goods; itch.io provides native devlogs as the conventional out-of-game changelog channel. The damper-vs-bulk rule is a genuine undecided balance invariant regardless of UI.

**Rec.** Decide the damper bulk-application rule now (progressive per-unit walk-down, so the damper stays legible) as it's a balance invariant; treat bulk UI as an implementation nicety and rely on itch.io devlogs for the changelog given lean-v1 discipline.

<sub>Findings: `inspiration-genre-gap-2`, `inspiration-genre-gap-5`</sub>

## R3·D — Round-4 target (completeness-critic)

"Round-3 verified findings concentrated in: T0 economic proofs (sim-t0 lens), the §2-vs-§6 data model, the number spine / levers index, naming/prose, and — newly — the deploy target. Items NOT yet verified or modelled and that remain open: (1) the held-koku per-rung trajectory is asserted but never computed, so E2@R6 soft-lock is unresolved pending Q29; (2) weather/festival magnitudes and persistence are entirely absent (Q35); (3) the rung-meter accrual law and soft-stamina/durability numbers are undefined (Q30/Q31/Q33) — no balance.ts exists yet to cross-check, so these are spec-only judgements; (4) cross-platform emoji fidelity and itch-iframe storage have NOT been empirically tested (the capture-game-states sweep samples one platform); (5) audio provenance is unstated. The completeness critic's recommended ROUND-4 TARGET is the deploy-target / host-and-browser reality matrix that no lens has owned: an actual itch.io cross-origin-iframe build smoke-tested on Chromium AND WebKit/Safari for IndexedDB save survival, cross-platform emoji rendering, bundle size against the <5s load budget, and audio licensing/credits — plus the adjacent un-owned categories of accessibility/screen-reader behaviour of the text-only UI, save-schema migration robustness, and legal/attribution surface. Secondary round-4 candidate: a held-koku ledger simulation to close the T0 affordability/soft-lock qu

## R3·E — Full round-3 findings catalog (39, by cluster)

### [HIGH] T0 balance-proof integrity: the centrepiece gate proofs are internally invalid
*§4.2.1, §4.7.1, §4.7.5, §4.8.1, §4.0, §3.2* — The two pillars of the T0 economic proof are broken. (1) The T0 Estate ≥0.8K gate proof spends 72 of its 560 deed-ip (12.9%) on 6 'sealed trade contracts', but the TRADE strand is a LOCKED T1 reveal ('no market in T0') — removing them drops the gate to 728 < 800, so the proof rounds 1-2 trusted is unreachable as itemized. (2) The per-rung koku throughput is labelled both NET (after food/re-investment → ~19K held) and GROSS (lifetime-produced → 3-5K held); the two readings are mutually exclusive, the held trajectory is modelled nowhere, and §4.7.5 proves E2@R6 affordability against lifetime-produced rather than held, so a R6 soft-lock cannot be ruled out.

- **`sim-t0-trade-deeds-1` [Q]** _high_ — T0 Estate gate's 70% proof spends 72 ip on TRADE contracts that cannot exist in T0 (trade strand opens at T1-V3; 'no market' in T0)  
  <sub>docs/prd.md §4.2.1 lines 2398 & 2410 vs §3.2 line 1807 / §4.8.2 line 2990 / §1.7 line 446</sub>  
  §4.2.1's T0 Estate 70%=560 itemization (line 2410): '...+ 6 trade contracts (6×12 = 72) = 30 + 224 + 234 + 72 = 560 ✔. (Trade = 72 ip = 12.9 %...)', and the deed table (line 2398) gives the 'Sealed trade contract (TRADE strand — ≤⅓ capped)' a T0 base of 12. But trade/market does not exist in T0: §3.2 line 1807 lists 'coin/*mon* (a T1 reveal — there is no market yet)' as deliber  

- **`sim-t0-koku-net-gross-1` [Q]** _medium_ — Koku held-vs-produced is self-contradictory: throughput is defined NET of food/re-investment, which makes held ≈19K, yet the PRD asserts held ≈3-5K and proves affordability off lifetime-produced (double-count)  
  <sub>docs/prd.md §4.7.1 lines 2854-2858, §4.7.5 lines 2906-2909, §4.0 line 2284</sub>  
  §4.7.1 (line 2855-2858) defines the rung rates as 'the *net koku-equivalent throughput* (after stamina, food, and re-investment)' and says 'lifetime-produced koku over T0 ≈ 21K (held ≈ 3–5K after spend)'. If the 21.5K is already NET of food/re-investment, the only remaining sink is E1+E2 = 400+2,000 = 2,400 koku, so held = 21,500 − 2,400 ≈ 19,100 — not 3–5K. To land at 3–5K hel  

### [HIGH] Implementation-blocking mechanic gaps: rules/magnitudes deferred to §4 but never delivered (M1/M2b blockers)
*§2.3, §2.15, §4.6.1, §4.7.1, §2.10, §4.2.2, §4.2.4, §6.4, §7.2 M1/M2b* — Several core mechanics are declared in §2 and required by milestone DoD but have no codeable rule. (a) The Estate Service / Combat Standing rank-meters have no accrual rule and no per-rung crossing thresholds, yet M1 phase 4 must test rung flips — the T0 spine advance condition is unwritable. (b) The soft-stamina throttle function, per-action staminaCost, satiety drain, and rest recovery are all deferred to §4 and never defined, though §4.7.1's yield formula multiplies by '(soft-stamina rate)'. (c) §2.3/§6.3 say low satiety throttles combat, but §4.6.1's combat math has no satiety term (labour does) — affecting the LOCKED first-fight win-rate. (d) Equipment durability is stored and 'worn' but wear rate, at-zero behaviour, and stat scaling are undefined (M2b blocker). (e) The promised dent self-heal is mechanically impossible: the seasonal appraisal only fires on a strictly-new high-water, so a dented value (HW unchanged) can never refill via the appraisal as §4.2.4 claims.

- **`impl-readiness-1` [Q]** _high_ — M1 BLOCKER: the Estate Service / Combat Standing rank-meters have no accrual rule and no per-rung crossing thresholds — the entire T0 spine has no codeable rung-flip condition  
  <sub>docs/prd.md §2.15(c) line 1402; §6.4 line 4055; §4.8.1 lines 2955-2961; §7.2 M1 phase 4 line 4503</sub>  
  The estate spine flips rungs on two meters: §2.15(c) (1402) declares only a SHAPE — "Two meters: `EstateService` (steep geometric), `CombatStanding`." §6.4 (4055) stores them as bare numbers — "ranks: Record<TierId, { estateService: number; combatStanding: number; rung: RankId }>" — but NOTHING in §4 says how `estateService` increments per labour action/deed, nor what value fli  

- **`impl-readiness-2` [Q]** _medium_ — M1 BLOCKER: the soft-stamina throttle function and the staminaCost / drain / rest-recovery numbers are explicitly deferred to §4 but never defined there  
  <sub>docs/prd.md §3.8 line 2188; §4.7.1 line 2837; §2.3(c) lines 940-941; §4.9 levers index lines 3047-3069; §7.2 M1 phases 2-3 lines 4501-4502</sub>  
  §3.8 (2188) defers it: "Numbers → §4 ... soft-stamina rate ... are deferred." The §4.7.1 yield formula (2837) then embeds the factor without ever defining it: "yieldPerAction = baseYield · (1 + 0.04·skillLevel) · toolMult · seasonMult · (soft-stamina rate)". §2.3(c) (940-941) gives only prose: "a soft-throttle function maps low satiety → a *rate multiplier* on labour/combat spe  

- **`impl-readiness-4` [Q]** _medium_ — M2b BLOCKER: durability is stored and 'worn' but its wear rate, zero-durability/break behaviour, and stat effect are undefined  
  <sub>docs/prd.md §2.10(c) lines 1192-1196; §6.4 line 4052; §7.2 M2b phase 2 line 4559 and phase 6 line 4563</sub>  
  §2.10(c) (1196) gives only "Durability { current, max, repairCost }" and (1186) the prose "durability that wears and is repaired/re-crafted". §6.4 (4052) stores per-slot "{ equipDefId; durability; qualityTier }". But the spec never says how MUCH durability is lost per swing/fight, what happens at durability 0 (does the item stop working, drop to base, become unequippable?), or   

- **`system-interaction-matrix-1` [Q]** _medium_ — Dents × seasonal high-water gating: the stated dent self-heal is mechanically impossible  
  <sub>docs/prd.md §4.2.4 (lines 2599, 2602-2604) vs §4.2.2 (lines 2443-2444, 2456)</sub>  
  §4.2.4 promises a dent 'never touches `highWater` (so it self-heals as play resumes the appraisal)' (line 2599) and that '`value` regrows toward `highWater` at the normal accrual rate — clawed back within ~1–2 seasons by design' (lines 2602-2603). But §4.2.2 gates the seasonal stream strictly: it 'raises the pillar only if the score exceeds its stored `highWater`' and 'If the s  

- **`system-interaction-matrix-3` [Q]** _medium_ — Soft-stamina × combat: §2.3 says low satiety slows combat, but the §4.6 combat math has no satiety term  
  <sub>docs/prd.md §2.3 (lines 931, 941) · §4.6.1 (lines 2758-2766) · §4.7.1 (line 2837) · §6.3 (line 4014)</sub>  
  §2.3(b): 'As the MC labours or fights, satiety/energy drains; depleted, actions get slower / less efficient' (line 931), and §2.3(c): 'a soft-throttle function maps low satiety → a rate multiplier on labour/combat speed (never to zero)' (line 941). §6.3 confirms satiety drains during the per-tick combat sub-step (line 4014). But the §4.6.1 combat formulas — `attackSpeed = baseS  

### [HIGH] Deploy-target / hosting reality (itch.io) never audited
*§6.8, §2.19, §2.21, §6.9, §7.3, §7.4.1, M6/M7, ui-design §7* — The locked deploy target collides with locked design choices in a category no prior lens owned. (a) The 'robust' single IndexedDB autosave runs in itch's cross-origin iframe where third-party storage is partitioned (Chrome/Firefox) or blocked-by-default (Safari/WebKit), and the only backup (base64 export) is opt-in — a 28.5h save can be silently lost on Safari; M7's smoke test names no browser matrix. (b) Load-bearing system emoji render as different artwork per OS / as tofu where no colour-emoji font exists, defeating the 'consistent woodblock, not AI-slop' pillar that one CSS filter cannot rescue. (c) Audio is a real asset pipeline with no stated licensing/credits surface (legal exposure on a public release), contradicting the 'no asset pipeline' R4 claim. (d) 'zip dist/' read literally nests index.html under a folder → blank-frame itch upload (clerical clarify).

- **`completeness-critic-1` [Q]** _high_ — The chosen save stack (IndexedDB, single autosave) is unreliable in itch.io's cross-origin game iframe — the deploy target no lens audited  
  <sub>§6.8 (docs/prd.md:4160-4167), §2.19 (1592-1595), §7.3 deploy (4749-4779), M7 (4704-4726)</sub>  
  §6.8 picks IndexedDB "chosen over `localStorage` for robustness and capacity" and §7.3 ships "`vite build` emits a static `dist/`… zipped and uploaded to **itch.io**". But itch.io serves HTML games inside a SANDBOXED CROSS-ORIGIN iframe (html-classic.itch.zone) embedded on the itch.io page. Modern browser storage partitioning makes third-party-iframe IndexedDB/localStorage eith  

- **`completeness-critic-2` [Q]** _medium_ — Emoji are a load-bearing art element but render completely differently per OS/browser — the locked register fights the locked anti-slop aesthetic  
  <sub>D-013 art register (§1.14:778), §2.21 (1654-1659), §6.9 (4210-4212), ui-design §7 (docs/ui-design.md:451-477)</sub>  
  D-013 locks "Art register = TEXT + EMOJI + CSS" and §2.21/§6.9 make emoji a carrier of pillar identity, season tags, rarity, and log bullets. ui-design.md §7 locks a set (🏯 ⛩️ 🎐 🍁 🍶 🏮 …) and tames them with one CSS filter: ".emoji { filter: sepia(.25) saturate(.7) brightness(.95) contrast(1.05); }". But a single emoji codepoint renders as entirely different artwork on Apple vs   

- **`completeness-critic-3` [Q]** _low_ — Audio is a real asset pipeline with no licensing/credits, no autoplay-gesture handling, and contradicts the 'no-asset-pipeline' risk claim  
  <sub>§2.21 audio (docs/prd.md:1658-1663), M6 phase 7 (4701), §7.4.1 R4 (4792)</sub>  
  §2.21 canon: "Audio (canon): light ambient beds + UI/event SFX + mute toggle"; M6 phase 7 requires "a light ambient audio bed + UI/event SFX (all behind mute)". Three unowned problems: (1) PROVENANCE/LICENSING — the PRD never says where the audio comes from, under what license, or that a credits/attribution surface exists (grep: zero hits for credits/attribution/royalty/CC-BY/c  

- **`completeness-critic-4` [applied]** _low_ — `zip dist/` as written produces a broken itch.io upload (index.html must be at the archive root)  
  <sub>§7.3 (docs/prd.md:4754), also §6.1 (3931), M7 (4708, 4722)</sub>  
  §7.3: "`npm run build:itch` = `vite build` + zip `dist/`. itch.io serves the unzipped bundle from a project subpath". itch.io's HTML-game host requires `index.html` at the ROOT of the uploaded zip; if the archive contains a top-level `dist/` folder (i.e. you zip the folder rather than its contents) the embed loads a blank frame and the game appears broken. The phrasing "zip `di  

### [MEDIUM] Persisted data model is narrower than the §2 type sketches; id-identity drift
*§6.3, §6.4, §6.5, §6.10, §2.8, §2.10, §2.12, §2.16* — The canonical persisted shape (§6.4) cannot hold what the §2 systems declare. (a) influence stores one scalar per pillar, so the estateWealth land/treasury/trade sub-engines that the ≤⅓ clamp reads have no field. (b) CombatEncounterState — the one must-persist non-derivable mid-fight blob — is sketched nowhere, and the mid-fight verb payload is named two ways (CombatAction vs CombatInterventionIntent). (c) equip is dispatched with ItemId but stored as the undeclared EquipDefId with no mapping. (d) advance_dialogue references choiceId/ChoiceId but the dialogue-line type has no choices field. (e) toRung uses an undeclared RungId where the model uses RankId (clerical).

- **`type-data-model-1` [Q]** _medium_ — GameState.influence shape cannot store the estateWealth sub-engines (land/treasury/trade) that §2.16 declares and the trade ≤⅓ verifier reads  
  <sub>docs/prd.md §6.4 line 4053 vs §2.16(c) line 1472 and §6.6 line 4122</sub>  
  §6.4 types influence as `influence: Record<PillarId, { value: number; highWater: number; dent: Dent / null }>` — each pillar is one scalar `value`. But §2.16(c) declares `Influence { arms, estateWealth (subEngines: { land, treasury, trade(≤⅓ cap enforced) }), office, name }`, and §6.6's verifier asserts "the **trade** sub-engine of Estate & Wealth is capped at **≤⅓** of that pi  

- **`type-data-model-4` [Q]** _low_ — Type-identity drift: equip is dispatched with ItemId but stored as EquipDefId, with no declared mapping between the two id spaces  
  <sub>docs/prd.md §6.3 line 3990, §6.4 line 4052, §2.10(c) lines 1192-1194, §6.5 line 4094</sub>  
  The equip intent is `{ type: 'equip'; itemId: ItemId; slot: EquipSlot }` (line 3990) and inventory is `Record<ItemId, number>` (line 4051). But the stored equipment slot is `{ equipDefId: EquipDefId; durability; qualityTier }` (line 4052) and §2.10(c) `EquipState { slot → { equipDefId, … } }`. Meanwhile §6.5 lists ONE registry `content/items.ts … keyed by ItemId` that holds 'it  

- **`type-data-model-6` [Q]** _medium_ — Live-combat state type CombatEncounterState has no field sketch, and combat_action's payload type (CombatAction) drifts from §2.8's CombatInterventionIntent  
  <sub>docs/prd.md §6.4 line 4063, §7 M2a line 4532, §6.3 line 3993, §2.8(c) lines 1122-1124</sub>  
  §6.4 stores `combat?: CombatEncounterState` and M2a (line 4532) lists CombatEncounterState as a type core/combat 'exports', but §2.8(c) only sketches `Combatant`, `Stance { attackMod, defMod, speedMod, evasionMod, targetCount }`, `CombatDeedsPool`, `InjuryState`, and `CombatSim` — CombatEncounterState's fields (current HP/positions/statuses, consumed RNG cursor, which mob, sub-  

- **`type-data-model-7` [applied]** _low_ — RankId vs RungId: the DEV API's toRung helper uses an undeclared RungId while the rest of the model uses RankId  
  <sub>docs/prd.md §6.10 line 4245 vs §6.4 line 4055 / §6.5 line 4102</sub>  
  §6.4 types the per-tier rung as `rung: RankId` and §6.5's ranks.ts registry is keyed by `RankId`. The DEV API declares `toRung(id: RungId): void` (line 4245). `RungId` appears nowhere else (grep: single hit) and is never defined; the canonical id for a rung/rank is `RankId`.  

- **`type-data-model-9` [Q]** _low_ — advance_dialogue references choiceId/ChoiceId, but the Dialogue/TextLine type declares no choices field  
  <sub>docs/prd.md §6.3 line 3994 vs §2.12(c) line 1261</sub>  
  The intent is `{ type: 'advance_dialogue'; lineId: DialogueLineId; choiceId?: ChoiceId }` (line 3994), but §2.12(c) types a dialogue line as `Dialogue/TextLine { id, speaker, text, displayConditions (predicate), rewards: RewardBundle, locksLineIds[] }` — there is no `choices` / `choiceId` field on the line, and `ChoiceId` is referenced only here and never defined. So the verb a  

### [MEDIUM] World-sim weather/festival: declared, type-backed, RNG-backed, milestone-scheduled — but no magnitudes, no formula hook, and no persisted home
*§2.2, §2.14, §4.6, §4.7.1, §6.4, §6.7, §7.2 M5* — Weather rate-modifiers and festival economic effects are promised v1 (T1) mechanics but §4 delivers zero magnitudes and the §4.7.1 yield / §4.6 combat formulas have no weather term, so M5 cannot implement them from the balance model. Separately, the current day's weather is a stochastic per-day draw that modifies live rates but has no field in GameState.clock — on active-only reload it is lost or re-rolled, breaking byte-identical resume. Both resolve together: is weather mechanical (needs magnitudes + persistence) or cosmetic-only in v1?

- **`number-spine-rederive-1` [Q]** _medium_ — Weather rate-modifiers and festival economic effects are promised v1 (T1) world-sim numbers but §4 delivers ZERO of them, and §4.7.1's yield formula has no weather term  
  <sub>docs/prd.md §4.7.1 line 2837 (yield formula); §2.14(c) lines 1335-1338; §6.4 line 4019; §6.7 lines 4150-4152; §7 M5 line 4625</sub>  
  §4 claims (preamble, line 2247) it is 'where the parked balance numbers from §§1–2 finally land.' §2.14 ships weather + festivals in T1/v1 (line 1346 'T1 brings seasons/weather/festivals to life') and types them as live mechanics: `WeatherHazard { kind, rateModifiers (labour/combat) }` (line 1338) and `Festival { ... effects (vendorRestock / socialBeat / reputationOpportunity)   

- **`type-data-model-8` [Q]** _medium_ — GameState.clock drops the lunarPhase and weather fields that §2.2 WorldClock declares; live weather has no persisted home  
  <sub>docs/prd.md §6.4 line 4044 vs §2.2(c) line 911 and §2.14(c) lines 1335-1338</sub>  
  §2.2(c): `WorldClock { tick, day, season, year, lunarPhase, weather }`, and §2.14(c) 'Reuses WorldClock + Scheduler + SeasonalAppraisalState from 2.2'. §6.4 stores only `clock: { tick: number; day: number; season: Season; year: number }` — lunarPhase and weather are dropped. lunarPhase is a pure function of `day` (correctly derivable, fine to omit), but weather is a stochastic   

### [MEDIUM] Determinism guarantee has a Math.pow-sized hole the lint does not cover
*§6.1, §4.5.1, §4.7, §6.7, §6.12* — All growth curves use integer-exponent powers (XP_GROWTH^(L-1), r^owned, 1.25^tier), but ECMAScript guarantees correctly-rounded results only for +−×÷ and sqrt — Math.pow can differ by a ULP across engines/builds and a round() near x.5 then flips an integer level/cost threshold, desyncing the 'byte-identical cross-machine replay' promise. The §6.1 determinism lint bans nondeterministic inputs but not Math.pow/exp/log/trig. Practical break is limited to cross-engine save portability + an overclaimed promise (CI runs one engine).

- **`determinism-replay-deep-1` [Q]** _medium_ — Growth curves use `^` (power), which ECMAScript does NOT guarantee correctly-rounded — cross-machine/cross-build byte-identical replay is unprovable, and the §6.1 determinism lint has a matching hole  
  <sub>docs/prd.md §6.1 lint (lines 3903-3907); §4.5.1 line 2688; §4.7 lines 1008, 2887, 2873-2874; promise sites §6.1 line 3901, §6.3 lines 4025-4027, §6.7 </sub>  
  The headline determinism promise is cross-machine/cross-build: §6.1 line 3901 'a fixed seed + a fixed intent/tick script produces a byte-identical GameState'; §6.12 line 4282 'Replays are byte-identical (Vitest-asserted)'; qa-playtesting.md line 23 'a fixed (seed, intent-script) reproduces byte-identically — every bug is reproducible'. The §6.1 determinism lint bans only nondet  

### [MEDIUM] Diegetic prose register & emotional-climax duplication
*§3.4, §3.6, §3.6.2* — Design-doc meta-voice and mechanics leak into in-fiction event-log copy, and a climax beat is duplicated. The V7 tier-capstone line says 'The room is clean' (the internal 'clean your room' design shorthand) as literal narration. Two T1 lines append non-diegetic parentheticals ('You may look, or not.'; 'Trade is one strand of one pillar — no more.'). The G6 spine line and the O5 Origin capstone share four near-verbatim sentences and fire at the same moment (O5 should DEEPEN, not echo), and the guaranteed G6 spine already speaks the 'Tahei' naming that §3.6.2 reserves for the optional Origin track — a payoff-ownership contradiction. The G0 dream-aside misattributes the ache-to-remember to Kanta's face rather than the MC.

- **`prose-tone-1` [Q]** _low_ — The signature gate line surfaces the 'clean your room' design-meta as literal in-fiction narration  
  <sub>docs/prd.md:1913 (§3.4 V7 diegetic event-log line)</sub>  
  V7's player-facing log line reads: *"The room is clean — house, valley, all of it. The lord: 'Now, the region.' Two rival names surface from beyond the ridge: Tomita. Akagi."* — "clean your room" is a design shorthand used internally ~9 times (lines 421, 1462, 1944, 2317, 3275, etc.) as the gate label; here the metaphor leaks verbatim into the diegetic narration even though not  

- **`prose-tone-2` [Q]** _low_ — Mechanics / UI-instruction parentheticals leak into diegetic event-log lines, breaking register  
  <sub>docs/prd.md:1907 (§3.4 V1) and docs/prd.md:1909 (§3.4 V3)</sub>  
  V1 ends its in-fiction line with a UI affordance instruction: *"…'Folk say a kappa takes children at the ford…' (You may look, or not.)"*. V3 ends with a balance-cap reminder: *"…The first bolt is graded and sold under the house's name. (Trade is one strand of one pillar — no more.)"* — the latter literally restates the ≤⅓ Estate & Wealth hard-cap that is already given in the s  

- **`prose-tone-3` [Q]** _medium_ — G6 (spine) and O5 (Origin) climactic lines are near-duplicates that fire at the same moment  
  <sub>docs/prd.md:2027 (§3.6 G6) and docs/prd.md:2097 (§3.6.2 O5)</sub>  
  G6: *"…And down-valley: she is real, and grown, and not you. 'Tama ran. Tama lived.' You have a name again: Tahei. You set it down quietly, and pick the house's work back up."* O5: *"She is real, and grown, and not you. 'Tama ran. Tama lived.' And you have a name again: Tahei. You set it down quietly — and pick your work back up."* — they share the same four sentences nearly ve  

- **`prose-tone-6` [Q]** _low_ — G0 dream-thread aside is a muddled/over-reaching image  
  <sub>docs/prd.md:2021 (§3.6 G0 diegetic line)</sub>  
  G0 closes: *"…'I'll run yours, for old times' sake.' One route. One load. (Why does his face ache to remember?)"* — 'his face ache to remember' attributes the aching/remembering to Kanta's face rather than to the MC who half-recognizes it.  

### [LOW] Tuning-dashboard & single-source-of-truth doc drift
*§4.9, §4.3, §4.6.1, §4.2.1, §4.8.2/3, §6.6, §7 M4/M6/M7, §1.6.1, §2.16, §4.8.0, CLAUDE.md* — Documentation-completeness/drift surfaces. The §4.9 'complete tuning dashboard' omits the §4.3 conversion-weight coefficients and the §4.6.1 combat base constants (hpMax base/slope, skillBonus, accuracy/crit bases) that M6.2 must tune 'via §4.9 only' (both clerical cross-ref appends). The per-deed cap (0.04·band-top) and the four-pillar table are hand-restated in 4-6 places (latent drift traps); Name's per-deed-cap band-top (10K/80K) conflicts with its seasonal normalizer (15K/140K) and the cap formula cites a §4.1 gate Name lacks in v1; §6.6/§7 emit balance tables to docs/balance/ while CLAUDE.md says docs/content/; and the §4.8.0 'first reveal <30s' example names the R2 Skills tab instead of the koku panel (clerical).

- **`number-spine-rederive-2` [applied]** _low_ — §4.9 levers index (the 'complete tuning dashboard') omits the entire §4.3 conversion-weight coefficient set  
  <sub>docs/prd.md §4.9 lines 3049-3069 (index) vs §4.3 lines 2619-2638</sub>  
  §4.9 bills itself as 'Levers index (the tuning dashboard)' enumerating every tunable, and §4 preamble (line 2233) says 'every value lives in core/content/balance.ts (the single home for tunables).' §4.3 defines six pillar-conversion-weight coefficients used to scale every deed base — `1.0 + 0.05·combatLevel + 0.10·dangerRingClearedAbove` (line 2621), `0.04·skillLevel` (2622), `  

- **`number-spine-rederive-3` [applied]** _low_ — §4.9 levers index omits the §4.6.1 combat-model base constants (hpMax base/per-level, skillBonus, accuracy base, crit base)  
  <sub>docs/prd.md §4.9 line 3065 (Combat lever line) vs §4.6.1 lines 2758-2766</sub>  
  §4.6.1 introduces global combat constants that are NOT in the §4.4 attribute table and NOT in the §4.9 index: `skillBonus = 0.3·weaponSkillLevel` (line 2758), `accuracy = 10 + ...` (base 10, line 2761), `critChance = 0.02 + ...` (base 0.02, line 2763), and `hpMax = 40 + 8·characterLevel + 2·STR` (base 40 and the per-level coefficient 8, line 2765). The §4.9 'Combat:' line (3064  

- **`generate-dont-duplicate-2` [Q]** _low_ — Name's per-deed cap (§4.2.1) uses a band-top of 10K/80K, but its seasonal normalizer TIER_REF_NAME (§4.2.2) uses 15K/140K — two conflicting 'band-tops' for the same pillar/tier, and the cap formula's stated basis is undefined for ungated Name  
  <sub>docs/prd.md §4.2.1 (L2381-2382, L2401-2402) vs §4.2.2 (L2479, L2502) and §4.1 (L2316-2318)</sub>  
  §4.2.1: the per-deed cap is computed against "that pillar's own band-top for the current tier (= its §4.1 gate threshold)" (L2381). But §4.1's gate table names Name only at T3 (≥500K) / T4 (≥6M) — Name is UNGATED in v1 (T0–T2), so 'its §4.1 gate threshold' does not exist. The Name rows give caps T0 40 · T1 400 · T2 3.2K (L2401-2402) = 0.04 × {1K, 10K, 80K} (the §4.0 display-ban  

- **`generate-dont-duplicate-4` [Q]** _low_ — The per-deed cap (= PER_EVENT_CAP_FRACTION · band-top) is a pure derivation hand-typed in four places — the structural twin of the JUDGE_K drift round 2 already caught  
  <sub>docs/prd.md §4.2.1 table+prose (L2390-2402, L2381-2382), §4.8.2 (L2998), §4.8.3 (L3022)</sub>  
  The cap is defined once as a formula — `jump = min(deedBaseValue, PER_EVENT_CAP_FRACTION * tierPillarBandTop(...))`, `PER_EVENT_CAP_FRACTION = 0.04` (L2374, L2377) — then the resulting numbers are written out by hand at least four times: §4.2.1 prose "T0 Estate cap = 0.04·0.8K = 32 ip, T0 Arms = 0.04·0.5K = 20 ip, T1 Office = 0.04·2K = 80 ip, T2 Arms = 0.04·30K = 1.2K, T2 Offic  

- **`generate-dont-duplicate-5` [Q]** _low_ — §6.6/§7 emit balance tables to docs/balance/, but the CLAUDE.md convention says generated content/balance tables land under docs/content/  
  <sub>docs/prd.md §6.6 (L4133), §7.2 M4 (L4620), §7.2 M6 (L4690), §7.2 M7 (L4698) vs CLAUDE.md Layout</sub>  
  CLAUDE.md (project instructions, Layout/Conventions): "Generated content/balance tables will land under `docs/content/`." But §6.6 writes "`docs/balance/curves.md`" (L4133) and the milestones repeatedly reference the `docs/balance/` directory: M4 "the regenerated ranks/areas/influence/balance docs" (L4620), M6 "the generated docs (`docs/balance/`, `docs/content/`) are current"   

- **`generate-dont-duplicate-6` [Q]** _low_ — The four-pillar table (kanji + domain + grows-on) is hand-duplicated in full in §1.6.1 and §2.16 (plus partial restatements in §1.13/§1.14/§2.22/§5) — a duplication surface with no canonical source  
  <sub>docs/prd.md §1.6.1 (L374-379) and §2.16 (L1432-1437); restatements at L752-753, L801-802, L1702-1703, L3838-3839</sub>  
  §1.6.1 (L374-379) and §2.16 (L1432-1437) carry near-identical pillar tables — Arms 武威 / Estate & Wealth 家産 / Standing & Office 官威 / Name & Honour 家格, each with protagonist domain and 'grows on' text. The Standing & Office kanji resolution (官威, rejecting 政威) is then re-asserted at L752-753, L801-802, L1702-1703, L2191, L3838-3839, L3850. They are currently all consistent (官威 eve  

- **`sim-t0-first-reveal-skills-1` [applied]** _low_ — §4.8.0 'first meaningful reveal < 30 s' example names the Skills tab, but the Skills tab is an R2 reveal (~35-65 min); the sub-30s reveal is the koku panel  
  <sub>docs/prd.md §4.8.0 line 2930 vs §3.1 line 1776 / §3.2 line 1800 / §3.5 line 1960 / §7.2 lines 4492,4506</sub>  
  §4.8.0 (line 2930): 'First meaningful reveal / < 30 s (rice counter ticks → Skills tab fades in) / proposed / first `unlock` event'. But the Skills tab is unambiguously an R2 reveal everywhere else: §3.2 R2 (line 1800) 'The Skills tab (§2.7) — first nav tab'; §3.5 (line 1960) 'First tab: "Skills" / RANK R2'; §7.2 M1 DoD (lines 4492, 4506) 'a headless run via __qa reaches R2, th  

### [LOW] Narrative naming, kanji glyph, cast roster & loose thread hygiene
*§1.8, §1.11, §4.4, §5* — Authorial naming/concordance nits, all low. Near-collisions co-occurring in the same scenes: antagonist Kuroiwa vs house Kurosawa (both Kuro-); legend-women Sayo/Obaa Sato; heir Naoyuki vs clerk Naozane (Nao-), plus Kageyuki/Naoyuki (-yuki) and Sōzaemon/Sōbei (Sō-). AGI is glyphed 体 ('body', a constitution semantic) where all its effects are dexterity (recommend 敏). §1.8 — the cited cast concordance anchor — omits recurring T4 spine figure Konoe (and others). Kanbei's v1-seeded 'player-influenceable détente/washout' has no resolution beat and no host system. Note several names sit in LOCKED canon, so renames reopen locked decisions.

- **`naming-concordance-1` [Q]** _low_ — Near-collision: T3 antagonist "Tedai Kuroiwa" vs the protagonist house "Kurosawa"  
  <sub>docs/prd.md §1.8 line 548; §1.11 line 639; §5 T3.3 lines 3690-3702 (Kuroiwa: 12 uses); "Kurosawa" used 54× throughout</sub>  
  §1.8 L548: "**Tedai Kuroiwa** / The magistrate's agent (*tedai*) — the gracious facilitator who *records* your achievements." The house is "the **Kurosawa**" everywhere (L185 "The **Kurosawa** hold a modest hill estate"). In all T3 material both appear together (e.g. §5 T3.3 repeatedly says "Kuroiwa" while the tier-wide subject is "the Kurosawa"). "Kuroiwa" and "Kurosawa" share  

- **`naming-concordance-2` [Q]** _low_ — Near-collision: village legend-women "Sayo" and "Obaa Sato" (both folklore-central, near-identical names)  
  <sub>docs/prd.md §1.8 lines 518-519; §5 T1.5 lines 3354-3360</sub>  
  §1.8 L518: "**Sayo** / The headman's daughter, ~16 … names him \"Tama\" on sight … the **living heart of the legend**." L519: "**Obaa Sato** / Village herbalist / wise-woman … the village's **folklore-keeper** — narrates the *kamikakushi* legend." Both are Asagiri women whose entire function is the Tama/kamikakushi legend; their bare names "Sayo" / "Sato" are two syllables, sha  

- **`naming-concordance-3` [Q]** _low_ — Kanji/romaji mismatch: AGI assigned 体 ("body"), not an agility glyph  
  <sub>docs/prd.md §4.4 line 2654</sub>  
  L2654: "/ **AGI** (体) / `evasion += 0.6·AGI`; `critChance += 0.2%·AGI`; hit-accuracy `+0.4·AGI` / gathering speed `+0.6%·AGI` (forage/fish); craft success `+0.3%·AGI` /". The glyph 体 reads *tai/karada* = "body/physique" (a constitution stat), but AGI = "agility" and its listed effects are all dexterity/finesse (evasion, crit, accuracy, gather speed, craft success). HP/constitut  

- **`naming-concordance-4` [Q]** _low_ — §1.8 cast roster omits several named NPCs that the narrative actually uses (Tōkichi, Konoe, et al.)  
  <sub>docs/prd.md §1.8 lines 486-552 (cast table) vs §1.11/§5 usages</sub>  
  Named, used NPCs absent from the §1.8 cast tables: T0 personification **Moneylender Tōkichi** (defined only in §1.11 L636 and §5 T0.3 L3169-3170, yet a v1-active T0 figure); the T4 through-line face **rusui Konoe** ("the single recurring T4 through-line face", §5 T4.4 L3802; used 10×, in §1.7.1/§1.11 but not the §1.8 region cast L541-552); and §5-only T3/T4 NPCs **Proprietress   

- **`naming-concordance-5` [Q]** _low_ — "Nao-" front-collision (heir Naoyuki vs clerk Naozane) plus a wider rhyming-name cluster  
  <sub>docs/prd.md §1.8 lines 497 (Naoyuki), 546 (Kageyuki), 550 (Naozane), 552 (Sōbei); §2.5 retainer Kanbei L511</sub>  
  Naoyuki (Kurosawa heir, 23×, §1.8 L497) and Naozane (guilt-sick T3 clerk, 6×, §1.8 L550) share the distinctive "Nao-" onset and both surface in T3 (§5 T3.5 L3719-3720 names "Naoyuki" and "Clerk Naozane" in adjacent clauses). Adjacent rhyming pairs also exist: rival heir **Kageyuki** vs Kurosawa heir **Naoyuki** (both -yuki, both "the heir", co-located in T2 §5 L3528-3539); **Sō  

- **`t3t4-coherence-4` [Q]** _low_ — Kanbei's in-household rival thread is introduced in v1 but never resolved or handed off  
  <sub>docs/prd.md §1.8 cast (line 511) & §5 T2.4 (line 3545); absent from §5 T3.4/T3.5 roster (lines 3704-3721) and §5 T4.4 (lines 3800-3811)</sub>  
  §1.8 line 511: 'Kanbei (later) / Jealous middling retainer ... In-household antagonist-rival who sees the rising stray as a threat; player-influenceable détente or self-inflicted washout. / T2+'. §5 T2.4 line 3545 confirms he 'joins this tier' (T2/v1): 'Kanbei (jealous middling retainer — an in-household antagonist-rival, player-influenceable détente or self-inflicted washout,   

### [LOW] Genre-convention coverage vs the named inspirations
*§2.4, §2.11, §6.4, §6.9, §7.2 M7* — Near-universal idle/incremental conventions both inspirations ship are absent: no bulk/sell-all/sell-to-floor or craft-N affordance (and no stated rule for how the saturation damper applies across a bulk sale), no player-facing achievements/career-stats surface (yet §6.4's counts comment says 'drive achievements' — a dangling reference; reword is clerical), and no in-game changelog/'what's new' panel (only an engineering commit-SHA stamp).

- **`inspiration-genre-gap-2` [Q]** _low_ — No bulk / sell-all / craft-batch affordance for trade and crafting — a near-universal genre convention both inspirations provide  
  <sub>docs/prd.md §2.4 lines 963-967, §2.11 lines 1217-1219; grep for sell-all/buy-max/batch/queue returns nothing</sub>  
  Trade is described as "convert surplus to coin via trade (brokers/shops)" with a "market-saturation damper [that] depresses sell prices when one good is flooded, recovering over in-game days" (§2.4 lines 963-967). Crafting is "gather inputs, craft a tool/item at a station" (§2.11 line 1217). With koku/material counts climbing into the tens-of-thousands→millions (§4.0 lines 2282  

- **`inspiration-genre-gap-3` [applied]** _low_ — No achievements / career-stats surface, yet GameState.counts is documented as 'drive achievements' — a dangling feature reference and a genre-expected page that is absent  
  <sub>docs/prd.md §6.4 line 4061 (`counts` comment), §6.9 line 4203 (screen list), §2.18 banzuke</sub>  
  §6.4 stores `counts: Record<CountId, number>; // kills, clears, harvests — drive achievements/quests` (line 4061) — the only use of 'achievements' as a *player feature*; everywhere else 'achievement' means the pillar-accrual 'achievement JUMPS'. No achievement registry, no achievement type/screen, and no career-stats/totals page exists anywhere. The renderer screen list is "Est  

- **`inspiration-genre-gap-5` [Q]** _low_ — No in-game changelog / patch-notes surface — only an engineering commit-SHA stamp; both inspirations ship a changelog  
  <sub>docs/prd.md §7.2 M7 line 4722; grep for changelog/patch-note/what's-new returns only schemaVersion engineering uses</sub>  
  The only versioning surface is engineering provenance: the build "stamps the source commit SHA / version into the Settings/About surface so any shipped zip is traceable to the commit" (line 4722). Grep for `changelog/patch note/what's new` finds no player-facing changelog anywhere; all other 'version' hits are `schemaVersion`/save-migration internals. proto23 (inspiration #1) k  


---
# ROUND 4 — targeted high-value battery + CONVERGENCE (2026-06-26)

**Scale:** 58 agents · 49 raw → **26 confirmed** (0 high · 14 medium · 12 low — the declining, lower-severity yield is the saturation signal). 8 targeted lenses (fix-reverification, deploy-host-matrix, m0m1-blocker-triage, save-migration, a11y-text-ui, legal-attribution, least-audited-deep, convergence-critic). **Applied:** 6 fixes (incl. a **regression** the re-verification caught). **New decisions:** **Q43–Q56** (14). Raw: [`raw/2026-06-26-prd-battery-review-r4.json`](raw/2026-06-26-prd-battery-review-r4.json).

> **🛑 CONVERGENCE VERDICT: STOP + CONSOLIDATE.** STOP + CONSOLIDATE — the doc-level audit has saturated. Round 4's targeted lenses are now surfacing single-token casing typos (tICK at line 898) and clerical list-omissions rather than structural intent or balance defects, which is the convergence-critic's own stated saturation signal. The remaining genuinely un-owned areas (sustained-runtime perf/memory, the numeric balance.ts simulation, build correctness) are BUILD-gated, not doc-gated — no further round of doc review can close them; they only yield signal from running M0/M1. Do NOT run another full review round. SINGLE HIGHEST-VALUE NEXT ACTION: apply the 6 trivial fixes (especially the fix-reverification-1 regression on the §6.8 persist list and the M0 surface-list type drift), get the ~3 M0 save-spine human decisions (Q44/Q45/Q46) answered alongside the version-ceiling hardening, then START M0 and let the first build/profiling pass resolve the build-to-learn residuals.

## R4·A — Regression caught & fixed (QA on this session's own edits)

- fix-reverification-1 (HIGH, INCOMPLETE applied fix): This session's own change added `currentArea: AreaId` to §6.4 GameState (line 4061) and simultaneously rewrote the §6.8 persisted-surface enumeration (lines 4186-4191) to add tier/live-combat/event-log/vitals — but did NOT add 'current area' to that enumeration. §2.19 (line 1621) and §6.4 both promise the player's location is non-derivable and persisted, yet the authoritative §6.8 serialization list (which the M0 save spine builds against) omits it; a literal serializer would silently reset the player to the start area on save/load. Correct via the trivial edit in trivial_fixes: insert 'current area' after 'clock' in the §6.8 list.

## R4·B — Cross-cutting risks (round 4)

1. DATA LOSS is the dominant cross-cutting risk and recurs across four independent lenses (save-migration, deploy-host-matrix, a11y, convergence): a no-reset 28.5h-progression game stakes everything on ONE continuously-overwriting autosave, yet write-failure, future-version downgrade, backup lifecycle, import integrity, third-party-iframe partition/eviction, and the unsurfaced base64 backstop are each individually under-specified. Any one can silently destroy the entire pitch (the long climb). These should be resolved as a single coherent persistence-hardening pass, not piecemeal.

2. The base64 export is simultaneously named as the load-bearing safety net (§7.3) AND left undiscoverable (no revealed surface, no prompt, Settings absent from the §3.5 reveal ladder) — it is the connective tissue between the storage-durability finding, the export-discoverability finding, the write-failure finding, and the Credits/About-surface finding. Defining the Settings/About surface and placing it on the reveal ladder unblocks several findings at once.

3. The 'no asset pipeline → low-risk' framing (R4) is quietly false in two places: audio (sourced clips, licensing, bundle, autoplay) and self-hosted fonts (OFL redistribution + Reserved Font Name). The PRD's risk posture and M7 acceptance gate both rest on a premise the content actually violates.

4. M7 acceptance gates systematically under-test the hard cases: same-session/Chromium-only/raw-URL save smoke (misses real durability), keyboard-SR run scoped to cold-open+one-rung (misses the dense UI), zero audio criteria, and load-only perf gates (no sustained runtime). The release gate can go green while the riskiest surfaces are unverified.

5. Locked decisions (D-018 palette, §4.4 no-respec, §6.8 single autosave, zero-network-calls) collide with newly-surfaced accessibility/durability needs (ink-faint AA contrast, no-undo on irreversible actions, font Option A). Several findings are genuinely human taste/policy calls precisely because the obvious technical fix would breach a locked decision.

## R4·C — M0 / M1 build-blocker checklist (the actionable bridge to building)

- RESOLVE-BEFORE-M0 (ordered):
- 1. [trivial-apply] fix-reverification-1 — add 'current area' to the §6.8 persist enumeration so the M0 save spine round-trips player location (regression from this session's own incomplete fix). Save spine is the actionable build target.
- 2. [trivial-apply] m0m1-blocker-triage-7 — repoint the M0 phase-2 surface list at the real §6.4 `character {hp, satiety, attributePoints}` field; there is no top-level `vitals` field. First type M0 builds.
- 3. [trivial-apply] save-migration-future-version-1 — add the version-ceiling guard to §6.8 so a future-version save degrades gracefully instead of silently downgrading (built into the M0 save spine / migration chain, M0 phase 5).
- 4. [needs-human, decide while building M0 save spine] Q44 save-write-failure-quota-1 (atomic single-put + write-failure notice), Q45 save-migration-atomicity-backup-1 (backup lifecycle + post-chain version assertion), Q46 save-game-identity-integrity-1 (magic field + import registry-integrity) — all shape the M0 persistence layer (phase 5); pick policies before that phase lands.
- RESOLVE-BEFORE-M1 (ordered):
- 1. [needs-human] Q47 m0m1-blocker-triage-2 — commit a satietyMax value (flat M1 stub recommended); M1 phase 3 builds the satiety bar / soft-stamina throttle and cannot render or test without a cap.
- NOT M0/M1 BLOCKING (deferred): all a11y deep findings (M6/M7), all legal/licensing/audio (M7), the world-sim registry (M4), and perf/memory (build-to-learn) — schedule against their milestones, do not gate the build start on them.

## R4·D — Fixes applied (round 4, this commit)
| Finding | What changed |
|---|---|
| `fix-reverification-1` | This session added currentArea to §6.4 (persisted, non-derivable) and rewrote the §6.8 persist enumeration in the same pass, but omitted 'current area' from that enumeration. A literal §6.8  |
| `m0m1-blocker-triage-7` | The M0 phase-2 surface list names a 'vitals' field that the canonical §6.4 GameState lacks (hp/satiety/attributePoints live under 'character'). Pointing the M0 line at the real §6.4 field pr |
| `save-migration-future-version-1` | Forward-only migration chain no-ops on a future-version save (CDN-stale/PWA/re-imported newer backup), risking a silent downgrade that violates the locked 'never wipe Influence/holdings' inv |
| `a11y-text-ui-deep-1+a11y-text-ui-deep-7 (merged — same §6.11 bullet)` | MERGE of two findings that both rewrite the same §6.11 bullet (would otherwise conflict). a11y-text-ui-deep-7 adds accessible-named log + named landmarks + skip-link; a11y-text-ui-deep-1 add |
| `a11y-text-ui-deep-8 (supersedes convergence-critic-4)` | Adds the 5th 'milestone' channel that ui-design §5.1's table defines (so per-channel ARIA politeness can route reveals as assertive) AND fixes the unique tICK->tick casing typo. This single  |
| `a11y-text-ui-deep-6` | The keyboard/SR operability gate covers only cold-open + one rung; the hard surfaces (combat verbs, four-bar Influence, modals, map) are never operability-verified, so the gate can pass with |

## R4·E — New decisions Q43–Q56 (14)

### Q43. [HIGH] What storage-durability posture does v1 commit to for itch.io's cross-origin iframe embed, and should it become M7 verify-gate acceptance criteria? The single autosave is the only copy of up to 28.5h of no-reset progress, living in third-party partitioned IndexedDB (Chrome/Firefox partition, WebKit ITP eviction) that the current same-sess

**Context.** Provisional §7/M7 plan item (D-021). deploy-host-matrix-1 + deploy-host-matrix-2. §6.8 locks a single autosave with no write-probe/fallback. The export's home depends on accessibility-ux-1 (Settings missing from the §3.5 reveal ladder).

**Rec.** (b) — it is the only path that actually catches silent autosave loss for most players and fixes the unsurfaced-backstop gap, at the cost of a WebKit/embed QA matrix the Chromium-only tooling does not cover plus a new §6.8 detection/fallback code path.

<sub>Findings: `deploy-host-matrix-1`, `deploy-host-matrix-2`</sub>

### Q44. [HIGH] How should a FAILED autosave WRITE be handled? §6.8/§2.19 robustness language is entirely LOAD-side; a rejected IndexedDB put (QuotaExceeded, transaction abort, private-mode unavailability) or a torn beforeunload commit has no spec, and nothing guarantees the write is atomic.

**Context.** §6 tech-spec gap, does not block M0 but informs the M0 save spine (phase 5). save-write-failure-quota-1. Silent write failure is worse than a load error — the player keeps playing believing they are saved, then loses everything on reload.

**Rec.** (A) — atomicity guarantee is non-negotiable on a single-slot autosave; the calm notice matches the existing 'never a scary wall' ethos without the intrusiveness of (C). Confirm notice loudness.

<sub>Findings: `save-write-failure-quota-1`</sub>

### Q45. [MEDIUM] Define the migration / pre-migration-backup lifecycle for §6.8. The spec says only 'a backup of the raw bytes is kept' — leaving atomicity, backup location, retention, restore trigger, and a post-chain version assertion all undefined.

**Context.** §6 tech-spec gap (D-021), bounded, does not block M0. save-migration-atomicity-backup-1. The debounced autosave fires on a tick interval, so a backup sharing the single autosave slot would be clobbered; a per-step write-back corrupts the very save the backup protects.

**Rec.** In-memory single atomic commit; raw bytes under a separate never-autosaved key; auto-rollback with the calm recovery UI; add the post-chain version assertion.

<sub>Findings: `save-migration-atomicity-backup-1`</sub>

### Q47. [MEDIUM] satietyMax has no formula while its sibling hpMax does (40 + 8·characterLevel + 2·STR + gearHp), yet §2.7 promises satiety capacity grows with level. Pick a committed value for M1.

**Context.** Provisional §4 balance item (D-021); a true M1 blocker — M1 phase 3 builds the satiety bar / soft-stamina throttle and needs a cap to render, compute the throttle fraction, and write the test. m0m1-blocker-triage-2.

**Rec.** (B) a flat stub for M1 to unblock the build, with a noted intent to promote to the (A) scaling formula by M6 — consistent with §4's provisional-numbers philosophy.

<sub>Findings: `m0m1-blocker-triage-2`</sub>

### Q48. [MEDIUM] --ink-faint #7A6C59 fails WCAG AA (4.5:1) on all three paper surfaces (4.23/3.66/3.31:1) yet carries load-bearing affordance text — locked-rung unlock hints (§5.4), the disabled-button 'why' reason (§5.5), captions/system-log. (Also --beni text ~4.0:1 on shade/deep cards, and the --ai-soft meter fill vs --washi-deep track 2.44:1, below th

**Context.** ui-design.md locked palette (D-018). a11y-text-ui-deep-2. Does not block M0/M1.

**Rec.** (b) — move functional hint/reason text to --ink-soft (passes on every surface) and keep --ink-faint purely decorative; separately switch the meter fill to --ai #27496D (or a darker track) to clear the 3:1 non-text floor.

<sub>Findings: `a11y-text-ui-deep-2`</sub>

### Q50. [MEDIUM] Audio (§2.21(a)/§6.9/M6) is the only v1 element outside the 'text + emoji + CSS' register, yet R4 rates art-risk low on the premise of 'no asset pipeline' and M7 ships with zero audio acceptance criteria (no licensing/credits surface, no bundle/lazy-load budget against the <5s load, no autoplay-gesture gating). Park audio, or scope it as 

**Context.** Provisional §7/M7 plan item (D-021); also corrects an internal inconsistency in §7.4.1 R4. deploy-host-matrix-4. Unlicensed audio is a takedown exposure on a public PWYW page.

**Rec.** (C) synthesized Web Audio if the feel allows (kills the licensing/bundle/credits exposure outright); else (B). Either way correct R4 to acknowledge audio as the one asset outside text+emoji+CSS.

<sub>Findings: `deploy-host-matrix-4`</sub>

### Q52. [MEDIUM] Lock the font delivery + licensing approach. The DRAFT stack is all SIL OFL Google Fonts; (a) Option A (Google dynamic subsetting) violates the LOCKED zero-network-calls criterion (§7.3) and adds GDPR IP-disclosure; (b) the recommended self-hosted Option B redistributes the .woff2 with no OFL.txt/copyright bundled (OFL breach) and (c) kee

**Context.** Provisional §7/M7 + ui-design.md §3.2 (font deferred to M1, flagged for human). legal-attribution-2 + -3 + -4. Not M0/M1 blocking but the first itch zip is non-compliant without it.

**Rec.** Lock Option B (kill Option A as network/GDPR-incompatible), rename the subset name table to clear the RFN rule, and add the OFL-bundling deploy step + a one-line 'all families OFL' note in §3.1. All three together.

<sub>Findings: `legal-attribution-2`, `legal-attribution-3`, `legal-attribution-4`</sub>

### Q55. [MEDIUM] Where should the §2.14(c) world-sim content (SeasonRules, Festival, WeatherHazard) be authored, and how should §6.5 reflect it? The registry catalog currently has no home for these mechanical (vendorRestock/reputationOpportunity + revealPredicate) shapes that M4 must author as data.

**Context.** §6.5 registry / M4 content (D-021), medium, not M0/M1 blocking. least-audited-deep-4. The §6.6 verifier needs to cross-check festival effect/reveal ids.

**Rec.** (c) — Festival is the only true keyed-entity gap; add a content/festivals.ts row to §6.5 and reference it in M4 phase-1's registry list, leaving season/weather modifiers in balance.ts/activities.ts where they partly live already.

<sub>Findings: `least-audited-deep-4`</sub>

### Q56. [MEDIUM] Do you want a minimal sustained-runtime perf/memory acceptance criterion (per-tick + render ms budget, bounded steady-state heap) plus a new perf/memory risk row in §7.4, or treat perf/memory purely as build-to-learn (keep load<5s as the only committed perf gate until profiling surfaces a real need)?

**Context.** Provisional §7 item (D-021); does NOT block STARTING M0. convergence-critic-2. The big risks are already design-mitigated (active-only loop, no offline catch-up, capped ring-buffer log); residual is only knowable by profiling via the existing chrome-devtools/capture-game-states harness. NOTE: the new risk row should be R7, not R6 — R6 is already proposed for the fun-slog risk.

**Rec.** (B) for now, with a noted intent to add the R7 row once the first M0/M1 profiling run gives real numbers — avoids inventing a budget before there is code to measure.

<sub>Findings: `convergence-critic-2`</sub>

### Q46. [LOW] Should the save import/load path add (1) a constant game-identity/magic field (e.g. app:"kami-kakushi") that import must match, and (2) a referential-integrity pass over stored ids (ItemId/QuestId/ProducerId/equipDefId/SurfaceId) against the live registries?

**Context.** §6 tech policy (D-021), low severity. save-game-identity-integrity-1. Mainly bites hand-edited/foreign imports and unversioned content edits, since normal content changes ship with a unit-tested migration; the §6.6 verifier runs at test time only.

**Rec.** Add the magic field (cheap fast-reject); for stale ids prefer (a) reject-to-recovery — silent item/quest loss is worse than a recovery prompt for a no-reset game.

<sub>Findings: `save-game-identity-integrity-1`</sub>

### Q49. [LOW] Should irreversible/destructive in-game actions (material-consuming craft, sell, committed attribute-point allocation — §4.4 no-respec is LOCKED, and later T3 narrative-route commitments) require a confirm step or a brief undo window, given the single continuously-overwriting autosave provides no 'reload last save' recovery?

**Context.** §2.19/§6.11 UX policy, low severity, does not block M0/M1. a11y-text-ui-deep-10. WCAG 2.2 3.3.4/3.3.6. The 'dents not wipes' philosophy softens economic stalls but not an in-the-moment destructive misclick.

**Rec.** (a) — guard only the genuinely unrecoverable, rare actions (allocation, narrative-route, rare-material consume) and record the action-class policy in §2.19/§6.11; keeps the fast loop frictionless.

<sub>Findings: `a11y-text-ui-deep-10`</sub>

### Q51. [LOW] Before any public release / itch.io upload (M7), what license(s) does the project adopt? There is no LICENSE file and no declared license anywhere, so the default is all-rights-reserved on a PWYW public-style repo.

**Context.** Legal, low severity, M7-only (not M0/M1 blocking). legal-attribution-1. Affects what the PWYW community may do, whether the repo can be public, and what notice the itch page must carry.

**Rec.** Decide before M7; a split of permissive code (MIT/Apache-2.0) + proprietary-or-CC-BY content is the common fit for a 'built agentically, inspired by two OSS games' ethos. Once decided the fix is clerical (add LICENSE + README note + itch page reference).

<sub>Findings: `legal-attribution-1`</sub>

### Q53. [LOW] What content rating and content-warning descriptors should the itch page declare, given themes of child-disappearance (kamikakushi), drowning/death imagery, grief, debt, and on-screen combat?

**Context.** Provisional §7/M7 deploy-runbook item (D-021), low severity, human classification call. legal-attribution-5. itch does not mandate ratings for mild folklore/violence, but the uploader is prompted for them.

**Rec.** (B) — near-zero cost, improves expectation-setting; add as a deploy-checklist step in §7.3/M7.

<sub>Findings: `legal-attribution-5`</sub>

### Q54. [LOW] Should the game define an in-product Credits/About surface (carrying authorship, the planned commit-SHA stamp, and font/asset attributions + license links), and add a pre-release check of the two named inspiration repos' licenses / no-copy confirmation?

**Context.** §6.9 + legal, low severity, M7-ish. legal-attribution-6 + legal-attribution-7. The 'Settings/About' surface is alluded to (commit-SHA stamp only) but never defined or placed on the reveal ladder; README cites two inspiration repos with no recorded license check.

**Rec.** (a) — define the About/Credits subsection (small scope, pre-satisfies attribution + gives the build stamp a home) and record the clean-room attestation; it also resolves the half-referenced surface.

<sub>Findings: `legal-attribution-6`, `legal-attribution-7`</sub>

## R4·F — Full round-4 findings catalog (26, by cluster)

### [HIGH] Save-spine serialization correctness (M0 first artifact)
*§6.8, §6.4, §2.19, §7.2 M0 phase 2* — Two clerical inconsistencies sit on the very first thing M0 builds (GameState + its stored surface). (1) This session ADDED currentArea to §6.4 and rewrote the §6.8 persist enumeration in the same pass but never added 'current area' to that enumeration — so the authoritative serialization list the M0 save spine builds against would silently drop player location on save/load, contradicting §6.4/§2.19. (2) The M0 phase-2 surface list names a 'vitals' field that the canonical §6.4 GameState does not have (hp/satiety/attributePoints live under 'character'). Both are safe clerical edits and should be applied before/at the start of M0.

- **`fix-reverification-1` [applied]** _medium_ — This session added currentArea to §6.4 GameState (and the DEV API) but the §6.8 persisted-surface list it rewrote in the SAME pass omits it  
  <sub>docs/prd.md §6.8 persist list lines 4186-4191; vs §6.4 line 4061 (currentArea) and §2.19 line 1621</sub>

- **`m0m1-blocker-triage-7` [applied]** _low_ — 'vitals' vs 'character' field-name drift — M0 builds GameState against a field §6.4 doesn't have  
  <sub>docs/prd.md §7.2 M0 phase 2 (L4490) + §6.8 (L4187) + §2.3 (L954) vs §6.4 GameState (L4065)</sub>

### [HIGH] Save robustness & data durability on a backend-free static host
*§6.8, §6.4, §2.19, §3.5, §7.2 M7, §7.3* — The single continuously-overwriting autosave is the only copy of up to 28.5h of no-reset progress, and its robustness story has systematic holes — all on the LOAD side, none on WRITE or durability. (a) Write failures (QuotaExceeded, transaction abort, torn beforeunload commit) have zero handling and no atomicity guarantee — silent data loss. (b) The forward-only migration chain no-ops on a FUTURE-version save (CDN-stale/PWA/re-imported newer backup), risking a silent downgrade that violates the locked 'never wipe Influence/holdings' invariant — this one is a safe-default hardening (trivial-apply). (c) The pre-migration raw-backup lifecycle (atomicity, where it lives vs the single autosave slot, retention, restore trigger, post-chain version assertion) is entirely unspecified. (d) No game-identity tag / import-time registry referential-integrity check. (e) itch serves the game in a cross-origin iframe where IndexedDB is partitioned/ITP-evicted; the M7 smoke is same-session, Chromium-only, never run in-embed or on WebKit/mobile, so it can certify 'save works' while most players lose progress. (f) The base64 export — the documented ONLY backstop — is never placed on a revealed surface and the player is never prompted to back up.

- **`save-write-failure-quota-1` [Q]** _medium_ — Save-WRITE failures (quota-exceeded, transaction abort, torn mid-autosave) have no handling — graceful-degrade only covers READ  
  <sub>docs/prd.md §6.8 lines 4180-4183 (Primary store: IndexedDB / autosave cadence)</sub>

- **`save-migration-future-version-1` [applied]** _medium_ — Forward-only migration chain has no guard for a FUTURE-version save (downgrade) opened by an older build  
  <sub>docs/prd.md §6.8 lines 4192-4194 (Versioned with ordered migrations)</sub>

- **`save-migration-atomicity-backup-1` [Q]** _medium_ — Raw pre-migration backup lifecycle is undefined — atomicity of the multi-step chain, where the backup lives, when it's deleted, and how restore is triggered are all unspecified  
  <sub>docs/prd.md §6.8 lines 4196-4197 (Validate + degrade gracefully)</sub>

- **`save-game-identity-integrity-1` [Q]** _low_ — No game-identity tag and no save↔registry referential-integrity check — a foreign or edited import can pass and corrupt the run  
  <sub>docs/prd.md §6.4 GameState lines 4057-4082 (envelope) + §6.8 line 4185 (Import validates)</sub>

- **`deploy-host-matrix-1` [Q]** _medium_ — M7 save-survival smoke tests never exercise the itch cross-origin EMBED, WebKit, or mobile-in-frame — and a same-session reload can't detect third-party partition/eviction; the single 28.5h autosave can silently vanish for real players while the gate stays green  
  <sub>docs/prd.md §7.2 M7 Definition-of-done (lines 4733-4736) + M7 phase 4 (line 4743) + phase 6 (line 4745); §7.3 (lines 4781-4785); §6.8 (lines</sub>

- **`deploy-host-matrix-2` [Q]** _medium_ — The base64 export — the ONLY real backstop against silent storage loss on itch — is never surfaced on a revealed screen and the player is never prompted to back up  
  <sub>docs/prd.md §2.19(b) (lines 1613-1616); §7.3 (lines 4781-4785); §6.8 (line 4184-4185)</sub>

### [MEDIUM] Accessibility deep gaps (screen-reader / keyboard / contrast)
*§6.11, §2.1c, §7.2 M7; ui-design §2/§3.2/§5.1/§5.4/§5.5* — Six distinct a11y gaps in a text-first UI whose labels ARE the information architecture. Trivial-apply: (1) Japanese-script runs are never lang-tagged (WCAG 3.1.2) so kanji pillar/rank/season labels read as glyph names or are skipped; (7) no skip-link and no NAMED landmarks, so keyboard/SR users tab the header vitals + the growing ~9-entry nav before the hero log on every screen; (8) LogMessage.channel enum (4 values) omits the 'milestone/reveal/rank-up' tier that ui-design §5.1 defines as a 5th channel — the one line that must be announced assertively (this edit also fixes the tICK->tick typo, subsuming convergence-critic-4); (6) the M7 keyboard/SR operability gate covers only cold-open + one rung, never the combat panel / four-bar Influence / modals / map. Needs-human: (2) --ink-faint #7A6C59 fails AA contrast (4.23/3.66/3.31:1) on all three paper surfaces yet carries locked-rung hints + disabled-reason text (+ --beni text ~4.0:1, --ai-soft meter 2.44:1) — the palette is locked under D-018 so it's a taste call; (10) no confirm/undo on irreversible actions given the single autosave removes the universal 'reload last save' recovery.

- **`a11y-text-ui-deep-1` [applied]** _medium_ — Japanese-script runs are never lang-tagged — kanji/macron terms read as Unicode names or garbage to a screen reader (WCAG 3.1.2)  
  <sub>docs/prd.md §6.11 (lines 4274-4289); docs/ui-design.md §3.2/§3.3/§5.3 (lines 137, 175-176, 344-350)</sub>

- **`a11y-text-ui-deep-7` [applied]** _low_ — No skip-link and no named landmarks — keyboard/SR users tab through the header vitals + the growing (~9-entry) nav rail to reach the hero log on every screen  
  <sub>docs/prd.md §6.9 (lines 4218-4221), §6.11 (line 4288); docs/ui-design.md §4.1 (lines 198-203), §5.6 (line 376)</sub>

- **`a11y-text-ui-deep-8` [applied]** _low_ — LogMessage's 4-value `channel` enum omits the milestone/reveal/rank-up tier — the one line class that MUST be assertively announced has no channel to route politeness on  
  <sub>docs/prd.md §2.1c (line 898); docs/ui-design.md §5.1 (lines 316-322)</sub>

- **`a11y-text-ui-deep-6` [applied]** _medium_ — The keyboard-only / screen-reader acceptance test covers only the cold-open + one rung — the dense late UI (combat panel, four-bar Influence, map, modals, tooltips) is never operability-verified  
  <sub>docs/prd.md §7.2 M7 (line 4719; also line 4708)</sub>

- **`a11y-text-ui-deep-2` [Q]** _medium_ — `--ink-faint` text role fails WCAG AA contrast on all three paper surfaces — and it carries the locked-hint / disabled-reason / caption text  
  <sub>docs/ui-design.md §2 palette (lines 46, 65-77), §5.4 (line 361), §5.5 (line 369), §3.3 (line 166)</sub>

- **`a11y-text-ui-deep-10` [Q]** _low_ — No confirm/undo on irreversible in-game actions, and the single continuously-overwriting autosave removes the universal 'reload last save' recovery — a cognitive-accessibility risk  
  <sub>docs/prd.md §6.8 (lines 4189-4199), §2.19; docs/ui-design.md §5.10 (lines 405-408)</sub>

### [MEDIUM] Legal / licensing / attribution / deploy-page hygiene
*README, §7.3, §7.2 M7, §7.4.1 R4, §6.9, §2.21; ui-design §3.1/§3.2* — A cluster of pre-publish (M7) legal/hygiene gaps, none blocking M0/M1. (1) No LICENSE file / declared license at all (defaults to all-rights-reserved) on a PWYW public release. (2/3/4) Fonts: licenses never recorded (all are SIL OFL); the recommended self-hosted Option B redistributes the .woff2 with no OFL.txt/copyright bundled (OFL breach) and keeps the Reserved Font Name on a subset (OFL §3 breach); the still-open Option A (Google dynamic subsetting) directly violates the LOCKED zero-network-calls criterion and adds GDPR IP-disclosure exposure. (5) No itch content rating/warnings despite child-spiriting, drowning, grief, debt, violence themes. (6) The half-referenced 'Settings/About' surface is undefined and absent from the reveal ladder — nothing owns in-product credits/attribution. (7) Two named inspiration repos with no recorded license-compatibility / no-copy check. (deploy-host-matrix-4) Audio re-introduces the exact 'asset pipeline' that R4 claims absent to justify its low-risk art rating — no licensing/credits surface, no bundle/lazy-load budget against <5s, no autoplay-gesture gating, zero M7 audio acceptance criteria.

- **`legal-attribution-1` [Q]** _low_ — Repo/game has no LICENSE file and no declared license, yet ships PWYW on itch from a public-style repo (rights ambiguous)  
  <sub>README.md (whole file, 24 lines); CLAUDE.md; repo root (find -iname 'LICENSE*' returns nothing); docs/prd.md §7.3 line 4795</sub>

- **`legal-attribution-2` [Q]** _medium_ — Display fonts: license never specified and OFL distribution obligations (bundle OFL.txt + retain copyright) are absent from the build/deploy plan  
  <sub>docs/ui-design.md §3.1 lines 116-119 and §3.2 lines 142-144; docs/prd.md §7.3 line 4776 (build:itch)</sub>

- **`legal-attribution-3` [Q]** _low_ — Subsetting an OFL font but keeping its Reserved Font Name ('Shippori Mincho') likely breaches OFL clause 3  
  <sub>docs/ui-design.md §3.2 lines 147-149</sub>

- **`legal-attribution-4` [Q]** _low_ — Font delivery 'Option A' (Google dynamic subsetting) contradicts the LOCKED 'zero network calls' deploy criterion and adds a GDPR exposure  
  <sub>docs/ui-design.md §3.2 line 140 and open-choice #2 lines 593-594; docs/prd.md §7.3 lines 4743 and 4745</sub>

- **`legal-attribution-5` [Q]** _low_ — No content rating / content warnings planned for itch despite child-spiriting, drowning, grief, debt and violence themes  
  <sub>docs/prd.md §7.3 lines 4794-4795 (itch page setup) and §7.2 M7 step 5 line 4744; §1 premise (e.g. §1.3/§1.7 the weir where he was 'found', §</sub>

- **`legal-attribution-6` [Q]** _low_ — No in-game Credits / Attribution surface is specified; the half-referenced 'Settings/About' surface is undefined and absent from the nav-reveal ladder  
  <sub>docs/prd.md §6.9 lines 4218-4219 (nav list) vs §7.2 M7 step 2 line 4741</sub>

- **`legal-attribution-7` [Q]** _low_ — Two named inspiration repos in README — no recorded license-compatibility check before reusing any of their structure/code  
  <sub>README.md lines 19-23</sub>

- **`deploy-host-matrix-4` [Q]** _medium_ — Audio is an unaccounted ASSET PIPELINE: risk-register R4 justifies 'low-risk art' by claiming 'no asset pipeline', yet §2.21/§6.9/M6 ship ambient beds + SFX with no licensing/credits surface, no bundle/load budget, and no autoplay-gesture handling — and M7 has zero audio acceptance criteria  
  <sub>docs/prd.md §7.4.1 R4 (line 4814); §2.21(a) (lines 1670-1675); §6.9 (line 4226-4228 / M6 phase 7 line 4720); §6.11 (line 4289); M7 (lines 47</sub>

### [MEDIUM] M1 balance gap — satietyMax has no formula
*§2.3, §2.7, §4 (missing), §7.2 M1 phase 3* — satietyMax appears only as a 'derived cap' in the Vitals struct and §2.7 promises satiety capacity scales with level, but no formula exists anywhere in §4 (whereas its sibling hpMax does: 40 + 8·characterLevel + 2·STR + gearHp). M1 phase 3 builds the satiety bar / soft-stamina throttle, which needs a committed cap to render, compute the throttle fraction, and write the test. Needs a committed value (scaling formula vs flat M1 stub) before M1.

- **`m0m1-blocker-triage-2` [Q]** _medium_ — satietyMax has no formula anywhere — M1's satiety bar has no defined cap  
  <sub>docs/prd.md §2.3 (L954) + §2.7 (L1079) + §4 (no formula); needed by §7.2 M1 phase 3 (L4521)</sub>

### [MEDIUM] World-sim content has no registry home (M4)
*§2.14(c), §6.5, §7.2 M4* — §2.14(c) declares typed world-sim shapes (SeasonRules, Festival{effects: vendorRestock/reputationOpportunity, revealPredicate}, WeatherHazard) and M4 must author the festival/seasonal social layer as data, but the §6.5 one-module-per-type registry catalog has no season/festival/weather module — so M4 cannot author it as data-as-code and the §6.6 verifier cannot cross-check its ids. Structural gap (missing registry), distinct from the known weather-numbers and belief-beast-registry gaps. Not M0/M1-blocking.

- **`least-audited-deep-4` [Q]** _medium_ — World-sim content (SeasonRules / Festival / WeatherHazard) has typed shapes in §2.14 but no registry module in the §6.5 catalog  
  <sub>docs/prd.md §2.14(c) lines 1351-1354; vs §6.5 registry catalog lines 4104-4121; M4 lines 4627 & 4644</sub>

### [MEDIUM] Build-to-learn residuals & audit convergence
*§7.2 M0 DoD, §7.4.1 risk register, §4.0* — convergence-critic-2: three genuinely un-owned areas remain after 4 rounds but are BUILD-gated, not doc-gated — sustained-runtime perf/memory (every perf gate is a one-time LOAD gate; no per-tick/render budget, no steady-state heap bound, no perf/memory row in §7.4.1 R1-R5), the numeric balance.ts simulation (deferred to code that doesn't exist), and build correctness (no src/ yet). All only yield signal from running M0/M1; record as build-to-learn, not doc-audit debt. convergence-critic-4: the tICK casing typo at line 898 — that round 4 is surfacing single-token typos rather than structural defects is itself the saturation signal (this typo is folded into the a11y-text-ui-deep-8 edit).

- **`convergence-critic-2` [Q]** _medium_ — Genuinely un-owned after 4 rounds, but BUILD-gated not doc-gated: sustained-runtime perf/memory profile, the numeric balance.ts simulation, and build correctness  
  <sub>docs/prd.md:4480-4485 (M0 DoD), 4805-4815 (§7.4 risk register R1-R5), 2204 (§4.0 numbers deferred)</sub>

- **`convergence-critic-4` [applied]** _low_ — NEW trivial: LogMessage type field `tICK` is a casing typo for `tick` (saturation signal — round 4 is now surfacing char-level errors)  
  <sub>docs/prd.md:898</sub>

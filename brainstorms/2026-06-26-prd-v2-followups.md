# Kamikakushi PRD V2 — Wave-2 follow-up questions

**Date:** 2026-06-26 · Source: a 9-lens read of the PRD + full feedback + the 56 V2 decisions ([raw](raw/2026-06-26-prd-v2-followups.json)). These are the **second-order** questions the 56 decisions opened up — answer these, then we write the PRD-V2 plan. Each has my **proposed answer (lean)**; 'accept' is a valid response.

> Priority: **P0** = blocks starting M0 (toolchain+save+cold-open) · **P1** = blocks M1 (T0 labour loop) · **P2** = needed to author V2 (not the first code) · **P3** = tune during build/playtest.


## [P0-blocks-M0] Save & persistence layer — M0 scope and the determinism-safe save selector

### FU1. Does M0 build the FULL multi-backend save layer (IndexedDB + localStorage + sessionStorage redundant write, atomic write, app-identity magic field, reject-to-recovery), or ship single-IndexedDB now and add fallbacks + arbitration later?

*Why:* Persistence is an M0 deliverable with its own boundary + round-trip/determinism tests; retrofitting multi-backend write and magic-field reject-to-recovery later re-touches the save contract and its tests.

**Proposed (lean):** Build the backend-abstraction + atomic write + magic field + newest-wins selector in M0 (cheap at the boundary, the tests want it once); defer ONLY the itch cross-origin-iframe survival TEST to M7.

<sub>relates: Q37, Q44, Q45, Q46</sub>

### FU2. How is the latest save selected without violating the no-wall-clock rule? Pin: timestamp source (a documented save-layer Date.now exemption?), the real selector (monotonic save-counter vs raw timestamp), the equal/skewed-clock tiebreaker, and forward-schema-version behaviour.

*Why:* 'Newest-timestamp-wins' is a wall-clock-dependent, non-deterministic selector layered onto a determinism-first core (Date.now is lint-banned in core); the equal/skewed/cross-version cases are exactly where players silently lose progress, and M0 ships this load path.

**Proposed (lean):** Source the timestamp in the save layer (a documented core-lint exemption); use a monotonic save-counter as the real selector with timestamp only as tiebreaker; never load a forward-version backend — fall through to the newest READABLE backend, then reject-to-recovery.

<sub>relates: Q37, Q2, Q44, Q45, Q46</sub>


## [P0-blocks-M0] Determinism core — RNG stream set, reveal queue, and the M0 stored-state skeleton

### FU3. What is the canonical M0 RNG shape and helper API that serves BOTH persisted-monotonic-cursor streams (combat/loot/seasonal/worldgen) AND stateless day-keyed derivations (weather/lunar)? Is day-keyed weather a 5th named stream or a pure (seed,'weather',day)->value function outside GameState.rng, and where does the fractional dtTicks remainder accumulate?

*Why:* M0 builds GameState.rng + the tick contract on day one; the old §7 single-cursor text is superseded by Q2/Q3 and the dual pattern changes the rng field shape — createInitialState()/tick() can't be written without it.

**Proposed (lean):** rng = { seed, cursors:{combat,loot,seasonal,worldgen} }; weather/lunar = a pure stateless deriveDayKeyed(seed,'weather',day) helper (NOT a persisted cursor); the dtTicks remainder accumulates in the app tick loop so tick() only ever receives whole integer ticks.

<sub>relates: Q2, Q3, Q35</sub>

### FU4. What is the reveal-queue contract? Does the pending-reveal queue live in STORED GameState (so a mid-queue save replays byte-identically), what 'beat' dequeues the next reveal (a tick? a player action?), and does the queue gate the sim or only pace presentation/chrome?

*Why:* Q17 changed the reveal engine — the game's spine, built in M0 — from synchronous one-shot to a paced deterministic queue; both M0 DoD bars (byte-identical determinism + save round-trip) require its storage and dequeue rule pinned before it's coded.

**Proposed (lean):** Queue lives in stored state (revealQueue[] in GameState); dequeue one per tick-beat; it paces presentation only and never blocks the sim — keeps determinism and save-resume trivial.

<sub>relates: Q17, Q34</sub>

### FU5. What goes in the M0 stored-state skeleton beyond {hp, satiety, attributePoints}? Specifically: add character.level (Q1, combat-fed) with initial floor value 1 and its satietyMax-at-floor (Q47); and do we PRE-DECLARE Q34's nested shapes (subEngines, CombatEncounterState, dialogue choices[]) or add them additively at M3/M5?

*Why:* M0 freezes the stored surface and the determinism test hashes it; a wrong field set forces an early migration. Q1/Q47 add fields §7 omits and Q34/Q45 leave pre-declare-vs-additive open — a day-one data-model call.

**Proposed (lean):** Add character.level (floor 1) to the M0 surface; rely on Q45's additive schema — do NOT pre-declare subEngines/CombatEncounterState/dialogue; add them as optional fields at M3/M5, keeping the M0 skeleton minimal with no speculative storage.

<sub>relates: Q1, Q47, Q34, Q45</sub>


## [P1-blocks-M1] Rung-meter accrual law — the missing third balance curve + R0-R2 gates

### FU6. What is the numeric rung-meter law and the R0/R1/R2 thresholds? Pin: per-crossing increment, the per-rung threshold CURVE (H5's 'front-loaded-then-ramp', unquantified), per-rung-reset vs cumulative-lifetime, how it's back-solved against the LOCKED >=30-min-per-rung floor, and the R0-R2 story-milestone set + the AND-composition behaviour when meter and story are out of sync.

*Why:* Q30 took the HARD option (numeric meter + story) and adds a third §4 balance curve that simply does not exist; M1's whole job is the R0->R2 ladder, which can't be coded against the stale §2.15 single-meter text, and the §6.6 gate-monotonicity verifier has no rung target without it.

**Proposed (lean):** Per-rung-reset meter; each rung's threshold = (>=30-min floor x that rung's eligible-activity rate), derived the SAME way the koku column already is in §4.8.1 so meter and floor stay in lockstep; thresholds provisional in balance.ts; AND-gate = promote only when meter>=threshold AND all story flags set, surfacing an 'awaiting X' read when one side lags.

<sub>relates: Q30, Q9, Q28, Q10</sub>

### FU7. What fuels the rung-meter — the SAME §4.2.1 pillar-deed inventory (tagged per-rung) or a SEPARATE authored per-rung activity set? And when a deed double-counts (Q30 allows meter + pillars + house), is its meter contribution an INDEPENDENT budget or literally the same ip already in §4.2.1?

*Why:* Q30's 'rung-specific, not all actions bump it' qualifier implies a subset/parallel inventory; if it needs its own per-rung activity list that is net-new authoring for every rung (R0-G7), and the shared-vs-independent-budget choice changes the §4.8.1 pacing and the Q28 tie-out completely.

**Proposed (lean):** Reuse the §4.2.1 deeds as meter fuel but tag each with the rung(s) it advances (a rungActivityTags field) and let it double-count into an INDEPENDENT meter budget — avoids authoring a parallel inventory while honouring 'not all actions bump it'.

<sub>relates: Q30, Q28, Q23</sub>


## [P1-blocks-M1] Labour->combat bounded cross-feed — channel, cap, and the inverted verifier

### FU8. Fully spec the bounded cross-feed: through what NEW channel does a labour skill's bonus enter combat without routing through attributes (the banned §4.5.3 edge) or character level (Q1) — a separate additive skillCombatBonus term? Which combat quantity, what magnitude + cadence (per-level vs ~every-5-level milestone), capped against what (flat ceiling vs a fraction of combat-derived power), pooled or per-skill, and does conditioning stay the ZERO-stat enablement gate? And which of §4.4 / §4.5.3 type-wall / §4.9 invariant lines get rewritten, with the §6.6 verifier flipped from '== 0' to '<= CAP'?

*Why:* This is a direct contradiction, not under-spec: Q6/D-022 supersedes a rule stated three times as canon and machine-checked by the verifier as exactly zero. M1 authors skills.ts/skill-XP, so whether it carries a combatBonus field and how it's capped is a day-one data-model call, and the M2a DoD assertion + Q28 invariant now assert the OPPOSITE of the governing decision.

**Proposed (lean):** A separate effectiveStats addend (labourSkillCombatBonus — NOT an attribute, NOT level), granted at ~every-5-level milestones, with a HARD global cap (~10-15% of combat-derived power) so big power stays combat-only per Q1; conditioning stays the ZERO-stat gate; replace the §4.5.3/§4.9 absolute wall with a 'bounded <= CAP' verifier assertion.

<sub>relates: Q6, Q1, Q28</sub>


## [P1-blocks-M1] Fun-proxy instrumentation at M1 — set, thresholds, report-only vs gating

### FU9. Which fun-proxies are instrumented at M1 (dead-time, reward/unlock cadence, always-a-visible-next-goal, first-5-min hook), what are their T0 pass thresholds, and are they REPORT-ONLY at M1 or already gating the build?

*Why:* Q4 adds an M1 task not in the current §7 phase list; the M1 author needs the proxy set, thresholds, and fail-the-build vs measurement-tool answer to know what they're building.

**Proposed (lean):** Instrument at M1 as REPORT-ONLY (mirror the >=30-min pacing harness: exists at M1, gates at M6); take the proxy set + thresholds from fun-factor.md with deed-cadence T0 ~5 min.

<sub>relates: Q4, Q20, Q16</sub>


## [P2-blocks-V2-author] Hybrid tier-gate (Q7) — thresholds, per-tier pillar set, and gate composition

### FU10. Publish the good/great/excellent ip triples per pillar per tier that replace the §4.1 simple-threshold table, the exact counts (great in 2 or 3, excellent in 1 or 2), the per-tier REVEALED-pillar set (T0=2 Arms+Estate, T1=3, T2=3), the T0 2-pillar special case, whether overflow-substitution is allowed, and which of §4.1 / §2.16 / §1.6.3 becomes canonical.

*Why:* Q7 reverses 'simple thresholds, no floor/overflow' (D-016) but three sections still call that formula REJECTED and the hybrid distribution is undefined for a 2-pillar T0; the whole §4.8 pacing tie-out and the §4.2.1/§4.2.2 70/30 back-solve depend on these magnitudes, so V2 can't re-derive pacing until the bands and pillar sets exist.

**Proposed (lean):** Map the existing §4.1 named-pillar threshold to 'excellent', set 'great'~0.5x and 'good'~0.2x of it; require excellent in the tier's 1-2 named pillars + good in all REVEALED pillars; T0 = the 2-pillar special case ('good in both + excellent in 1', no phantom 3rd); NO overflow-substitution (floor only); make §4.1 canonical and rewrite §2.16/§1.6.3.

<sub>relates: Q7, Q30</sub>

### FU11. How do the three progression currencies compose AT the capstone? Is tier-up = (capstone rung-meter cleared AND its story milestone) AND-separately (the Q7 hybrid pillar profile), or are pillar thresholds folded INTO the capstone rung criteria? Is the capstone the GATE or merely the §2.15 'confirmation'? And do the ~6 pure-RANK mid-rungs (R1/R2/R4/R6, V1/V3, G3) gain a story-milestone requirement, or only capstones?

*Why:* Q30 (rungs gate on meter+story), §2.15 (capstone confirms, pillars gate in parallel), and Q7 (the tier gate is now a hybrid pillar distribution) give three different answers for the single most important transition each tier; the V2 author cannot write the gate predicate, and the build cannot evaluate a tier transition deterministically, until this is closed.

**Proposed (lean):** Rung-meter + story = the per-rung gate (story only at capstones; mid-rungs stay RANK-only); the Q7 hybrid pillar distribution is a SEPARATE capstone-only tier-gate, both ANDed (so the rung 'confirms' per §2.15 and the pillar-hybrid is the actual T-gate); double-counting allowed but the verifier asserts each stream sums independently.

<sub>relates: Q30, Q7, Q1</sub>


## [P2-blocks-V2-author] Combat progression ladder (Q15) — reveal schedule and the three weapon lines

### FU12. Author the T0-T2 staggered combat-reveal ladder: the rung-by-rung order in which stance / ability slot / item slot / retreat / status effects / multi-target / auto-continue / durability bands / 2nd & 3rd weapon lines reveal (one per beat, no UI-dump), what slips to T1/T2, and the TRIGGER kind per step (combat rung / combat-level / weapon-skill milestone / story). Rewrite §3.2's R3 row and §2.7/§2.8 'weapon lines at R3' which currently dump the whole combat system at once.

*Why:* Q15 (incremental, exactly one weapon at T0) + Q17 (no UI-dumps) demand a staggered schedule the PRD lacks — §3.2's R3 row and the M2a 'Lands' list dump panel+stance+ability+item+retreat+weapon+Equipment+Inventory+Bestiary in one beat; the V2 author can't rewrite the reveal rows and the coder can't author the M2a/M2b unlock predicates without it.

**Proposed (lean):** R3 = the single starter weapon + bare auto-resolve loop + retreat only; stance slot at R5 (when real watches start); ability/item slots at the first weapon-line L10 milestone; durability bands surface with the loot->craft loop at R4; one new line per tier gated on a Combat Standing rung, its signature ability gated on a weapon-skill milestone (L25/L50); rewrite §2.7/§2.8 to 'first line at R3'.

<sub>relates: Q15, Q17, Q33, Q16, Q30, Q1</sub>

### FU13. Specify the 3 weapon lines (spear/sword/staff): each line's distinguishing §4.6 auto-battler params (baseSpeed / reach-or-targetCount / attack profile) and its signature L50 ability — and is the M2a 'crude carrying-pole' fixture a 0th improvised weapon or IS it line 1? Reconcile §2.7e/§2.8's '2-3 weapon lines at T0' down to Q15's 'exactly one'.

*Why:* Q15 mandates 3 archetype-distinct lines each with a signature ability, but §2.8's Combatant model carries attackSpeed/targetCount only via STANCE (no per-line archetype data), the 3 signatures are unnamed, and the PRD never says whether the crude pole is a line — a coder can't build the weapon/skill registry or differentiate combat feel without this.

**Proposed (lean):** Crude pole = a 0th improvised weapon (not a line); spear = first real line at the R3 drills (reach, multi-target lean, signature sweep); sword arrives at T1 (balanced, crit-lean, iai strike); staff at T2 (fast, stagger/defensive, guard-break); reconcile §2.7e/§2.8 wording to 'one weapon at T0'.

<sub>relates: Q15</sub>


## [P2-blocks-V2-author] Combat numeric tracks & throttles — character level, mobLevel, satiety, durability

### FU14. Define the character Combat Level XP->level curve (Q1: own stored track, combat-fed, HP + attribute points scale off it) and disambiguate the THREE combat-fed tracks — character Combat Level (Q1), the Combat Standing rung-meter (Q30), and the Arms pillar (§4.2.1) — stating exactly what one kill writes to each. Reconcile §2.8's 'Combat Level = CombatDeedsPool (XP + deed-count)' with Q1's 'XP only', and pin the §2.7a 'compounding skill-XP multiplier' (or scope it out).

*Why:* hpMax = 40 + 8*characterLevel and '+1 attribute point per 2 levels' both depend on a characterLevel curve that §4 does not define (only per-SKILL XP exists); the M2a ~85% post-drills win-rate test needs a leveled MC; and §2.8 conflates Level with a deeds pool that Q1/Q30 both cut against — left unspecified, combat power, rung promotion, and Arms accrual silently couple.

**Proposed (lean):** Three distinct stored fields; one kill writes all three via INDEPENDENT curves: a geometric combat-XP->characterLevel curve (reuse the §4.5.1 shape, slower, fed by combat ONLY); the deed-count feeds Combat Standing + Arms, NOT level; rewrite §2.8 to stop conflating Level with the deeds pool; keep the skill-XP multiplier tiny or scope it out of v1 to avoid an unintended combat->labour loop.

<sub>relates: Q1, Q30, Q47</sub>

### FU15. Where does mobLevel come from for the §4.6.5 on-kill XP path? MobDef (§2.9c) has no level field (only stats, dangerRing, spawnWeights) — is mobLevel authored per-mob, derived from dangerRing, or computed from the stat budget?

*Why:* The on-kill XP path (feeding both character level and weapon-skill XP) is built in M2a and the enemy registry is authored in M2b; the coder can't implement the XP formula or author content/enemies.ts with a referenced field that has no defined origin.

**Proposed (lean):** Author mobLevel as an explicit per-mob field on MobDef (most legible, hand-tunable bestiary/danger-gradient), defaulting to roughly the dangerRing's expected character-level so XP scales with the gradient.

<sub>relates: Q1, Q15</sub>

### FU16. Specify the satiety->combat throttle Q31 adds to §4.6.1 (which stats it multiplies — attackPower? attackSpeed?, the curve shape, floor ~0.5), the numeric 'adequate satiety' reference at which the LOCKED 20-35% first-fight win-rate is re-measured, whether it shares the §2.3/Q17 labour STAMINA_RATE_FLOOR or is a separate combat coefficient, and a bound so the floor never pushes win-rate below ~15%.

*Why:* Q31 perturbs a human-LOCKED acceptance criterion (D-022) and adds a term §4.6.1 lacks; the M2a win-rate test is now under-defined (20-35% at WHAT satiety?), Q47 ties satietyMax to the combat-only level so a fresh R3 MC may have a trivially small satietyMax, and the coder can't write the combat math or the test without the term and reference point.

**Proposed (lean):** A single satietyRate multiplier on attackPower (lighter one on attackSpeed), flat above ~0.7 satietyMax kneeing to a 0.5 floor; 'adequate satiety' = the flat region (>=~0.7); a SEPARATE combat coefficient (not the labour floor) so they tune independently; bound the throttle so the floor costs only a few win-rate points (never below ~15%); tag the 20-35% as 'at adequate satiety'.

<sub>relates: Q31, Q47, Q17, Q16</sub>

### FU17. Define the graded durability model (Q33: bands, no auto-unequip, never weaponless): the band thresholds + stat multipliers, which stats each band multiplies (weapon attackPower only, or all statMods; do armour/non-weapon slots band too?), the wear RATE (per swing / per fight / per deed), and the repair/re-craft restore path.

*Why:* Q33 reverses the binary-unequip recommendation into graded bands with zero numbers in §2.10/§4; the M2b DoD applies durability wear in the §4.6 math and the wear must be deterministic-friendly for byte-identical replay — a coder can't implement stepped wear without thresholds, multipliers, scope, and rate.

**Proposed (lean):** 4 integer bands on the weapon's attackPower only (75+/50+/1+/0 -> 1.0/0.9/0.75/0.55), FIXED wear per fight (not per swing — cheap ticks + replay-stable), armour bands identically on defense; repair/re-craft restores to max; author all values in balance.ts as levers.

<sub>relates: Q33, Q2, Q36</sub>


## [P2-blocks-V2-author] Scope/budget reconciliation — §7 milestone re-cut under E3 + more quests + combat ladder

### FU18. Is the LOCKED per-tier hour budget (T2~16h, total ~28.5h) a CEILING or a FLOOR under the scope growth from Q8 (author E3), Q23 (more quests), Q34 (intra-line dialogue), and Q15 (incremental combat)? And in the §7 re-cut: which milestone authors E3 and where does its §4.7.5 cost row / pillar-rank floor sit (inside a G-rung's spend or a new rung), do M4 and M5 each gain a combat-progression sub-slice, and is ~28.5h still purely play-TIME (adds = build cost only)?

*Why:* §7's scope table and milestone map now literally contradict Q8 (E3 still 'parked') and structurally no longer contain Q15 (combat spread across M1-M5) or Q23; the V2 author re-authoring §4.7.5/§4.8.3/§7 must know whether to compress per-deed throughput or extend wall-clock (cannot do both), with E3 the one real play-time risk.

**Proposed (lean):** Budget is a CEILING: ~28.5h play-time stays LOCKED and all adds are build/authoring cost; reconcile §7.1.1 to E0->E3 with E3 authored in M5 as an extra koku/Arms sink folded into G4-G7 (NO new rung); add small combat-progression sub-slices to M4/M5 while keeping M2a/M2b as the combat-ENGINE milestones; retune throughput, never the hours.

<sub>relates: Q8, Q23, Q34, Q15, Q37</sub>


## [P3-tune-later] Tune-later — per-rung win-rate bands and T2 cross-pillar combos

### FU19. Define the target headless win-rate bands at V2 / V5 / G1 / G5 (R3's 20-35% fresh / ~85% post-drills is already set) — the fresh-at-rung and geared/trained-at-rung targets against each tier's representative threat — so Q16's 2nd pacing proxy can be instrumented.

*Why:* Q16 mandates win-rate bands at R3/V2/V5/G1/G5 as a regression-tested combat-difficulty proxy, but only R3 has numbers; the four later rungs are unanchored so the proxy can't be wired and the T1-T2 difficulty curve is untuned.

**Proposed (lean):** Keep each 'first encounter at a combat rung' humbling-but-winnable (~30-45% fresh) and each 'after that rung's intended training/gear' comfortable (~80%+), tightening slightly per tier; wire the bands into the M3/M6 fun-proxy harness alongside the pacing floor.

<sub>relates: Q16, Q31, Q4</sub>

### FU20. Spec the Q22 T2 cross-pillar combos (the anti-slump 'narrow §4.3 no-leakage exception'): which pillar pairs combo, the magnitude, and the proof they don't breach the LOCKED invariants — counted inside or on top of the 70/30 deeds/seasonal split and the 0.04 per-event cap, kept below the trade-<=1/3 ratio, and EXCLUDED from the Q7 gate-threshold check so a combo can't substitute for being 'good in ALL'.

*Why:* Q22 carves an exception into the exact invariants (trade cap, no-leakage, no-overflow) that the §6.6 verifier and the Q7 gate model rely on; if the bonus lands outside the 70/30 envelope or 0.04 cap every §4.2 tie-out breaks for T2, and an unbounded combo silently re-opens the trade-carries-a-gate hole.

**Proposed (lean):** Spec combos as a capped FLAT bonus to a THIRD pillar (Name) only, computed AFTER the trade-clamp, counted INSIDE the 70% deeds budget and still subject to 0.04, and EXCLUDED from gate-threshold checks — a flavour/anti-slump rebate that speeds play without ever satisfying a required pillar or moving the trade ratio.

<sub>relates: Q22, Q7, Q6</sub>


## [P1] Known gaps (under-questioned by the lenses — folded in)

### FU21. The LABOUR satiety throttle shape (§2.3) — the satiety→labour-rate curve, STAMINA_RATE_FLOOR, drain-per-action + rest-recovery rates, and how satietyMax-grows-with-level (Q47) interacts with the T0 labour loop. (M1's core loop formula.)
**Proposed (lean):** flat above ~0.7 satietyMax, knee to the ~0.5 floor; modest drain per labour action, rest fully refills; satietyMax = base + small per-level growth.

### FU22. Intra-line dialogue AUTHORING (Q34): the data shape (choices[]/ChoiceId, line-locks) and how branches are authored in content/ — is it a small branch tree per conversation, and how does it stay deterministic + save-light?
**Proposed (lean):** a flat choice list per dialogue node with locksLineIds[] effects; branches are data, no scripting; deterministic (no RNG); only the chosen-flags persist.

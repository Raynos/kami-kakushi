---
name: v03-roadmap-respect-verify
description: Does the built v0.3 respect the roadmap? Per-T0-milestone DoD fidelity + milestone-integrity (D-054)
metadata:
  type: audit
  movement: v0.3-part2-verification
---

# v0.3 roadmap-respect verification (T0 M0–M4)

> **What this is.** The milestone-integrity gate (D-054): does the BUILT v0.3 respect the roadmap's T0 DoD?
> A 6-agent fidelity Workflow (`wf_6f92d6ba-ac9`) audited each T0 milestone against the current `src/` + tests,
> classifying every DoD line ✅ shipped (built + a real test/tool) · 🟡 partial · 🔴 not-built, + a headless
> spine playthrough (`project/audit/screens/diverge-influence/play-*.png`). Raw verbatim:
> [`../../brainstorms/raw/2026-06-29-v03-roadmap-respect-verify.json`](../../brainstorms/raw/2026-06-29-v03-roadmap-respect-verify.json).

Verified: spine test files exist (`pillars.test.ts`, `ascension.test.ts`, `migrate.test.ts`), `crafting.ts`/`dialogue.ts`/quest/market/map modules absent, DEMO/REAL fork intact at `balance.ts:50-53`, DEV guard at `main.ts:281`. The audit's load-bearing claims hold. Report follows.

---

## Verdict

The built v0.3 **respects the roadmap's locked spine intent**: the macro engine (T0-M3) is genuinely DONE and closes end-to-end — re-baselined T0-M1/M2 combat-correctness, the Estate House-Influence pillar at the R7 capstone, the 70/30 seasonal judge, and the manual T0→T1 ascension with a real `migrate()` path are all built and strongly unit-tested (`pillars.test.ts`, `ascension.test.ts`, `migrate.test.ts` — full suite 139/139 green). What is **not** yet honored is T0-M4 *breadth* (the found/crafted weapon, mentor dialogue, quests, walkable map, market, stance/ability reveal-beats) plus two cross-cutting items (DEV speed/teleport, DEMO/REAL fork retirement) — and critically, every one of those is **deferred-by-design** under the project's own LOCKED spine-first build order (roadmap.md:126-134, D-018/D-052), not a contradiction or an over-claim. The build never claims a slice it didn't ship. **Headline: 11 ✅ shipped, 6 🟡 partial, 5 🔴 not-built across 22 DoD lines.**

## Tally

| Milestone | Verdict | #✅ | #🟡 | #🔴 |
|---|---|---|---|---|
| T0-M1 — Waking on the estate (the hook) | mostly-respects | 2 | 1 | 1 |
| T0-M2 — First blood (the humbling) | mostly-respects | 2 | 2 | 0 |
| T0-M3 — The spine awakens (macro engine) | **respects (DONE)** | 3 | 0 | 0 |
| T0-M4 — The showcase in miniature (breadth) | partial (~1/5) | 1 | 1 | 3 |
| CROSS — Cross-cutting + build integrity | partial | 3 | 2 | 1 |
| **Total** | **spine-DONE, breadth-deferred** | **11** | **6** | **5** |

## Per-milestone

### T0-M1 — Waking on the estate (the hook)

| DoD line | Status | Evidence (file:line + test) | Note |
|---|---|---|---|
| F1 Cold open & first rake (<5s interactable; rake→koku→log; cascade) | ✅ | `coldOpen.ts:8-23` (COLD_OPEN + rakeLine); `engine.test.ts:28-49`. <5s proxy: `playcheck.ts:34` FIRST_ACTION_CAP_MS=5000 + `playcheck.test.ts:20` (RED-on-blow) with a committed-baseline ratchet. Cascade: `render.ts:441-444,985-1053` (LOG_STAGGER_MS=240). | rake→koku→log and the <5s gate are test-covered. The log-cascade *animation* has no DOM test (cascade wired+exercised, visual timing unasserted). |
| F2 Labour loop, estate inks in R0→R2 (AND-gate; reveal stagger; G-NO-DEAD-VALUES) | ✅ | AND-gate: `ranks.ts:28,45` (meter ≥ threshold AND storyGate); `m1.test.ts:45-77` (R0→R1 7×rake, R1→R2 farm, no-advance-without-combat-gate). Reveal set asserted `m1.test.ts:52-68`. Dead-values: `integrity.test.ts:55`. | Rung-gated reveal *sequence* covered via unlock assertions; the per-beat log-line stagger animation is untested at DOM level. AND-gate + dead-values guard first-class tested. |
| F3 Meet your mentor Genemon (diegetic data-not-script dialogue; no popups) | 🔴 | `src/core/content/dialogue.ts` does NOT exist (verified: ls returns no file); no Dialogue type, no greeting. "Genemon" is only a static label `names.ts:11`. Cold-open's lone NPC line is physician Sōan (`coldOpen.ts:10`), not the labour mentor. No test, no diverge. | Roadmap marks F3 🆕 (pending) → no over-claim, but the slice is genuinely unstarted. **Deferred breadth** (the mentor lore-talk overlaps T0-M4-F3). |
| F4 Juice + dev-tools (traditional SFX; DEV 2×/4×/8× speed + jump-to-rung/tier teleport, prod-stripped) | 🟡 | SFX shipped+tested: `sfx.ts` (taiko/koto/suzu; MASTER_GAIN 0.15; mute + honorReducedMotion); `sfx.test.ts` (7 tests). Wired: `main.ts:101,164`, `render.ts:978,1059,1080`. Dev API prod-stripped: `main.ts:281` `if (import.meta.env.DEV)` (verified), `toRung()` `main.ts:288`. | GAPS: no 2×/4×/8× speed toggle; no jump-to-TIER teleport (`tier()` hardcoded 0); palette 3/4 (no shakuhachi); `__qa`/`toRung` have ZERO test coverage; render-side reward/rankUp wiring untested (render.test stubs sfx). Only the SFX module half is fully test-backed. |

### T0-M2 — First blood (the humbling)

| DoD line | Status | Evidence (file:line + test) | Note |
|---|---|---|---|
| F1 Grain-store wolf @R3 (20–35% first-foe WR; G-CURVE; DISPLAYED==TESTED) | ✅ | Scripted wolf `fight.ts:119` applyScriptedWolf, wired `intents.ts:160-164`, opens R3 (`ranks.ts:79`); `m2.test.ts:306`. Band: `balance.ts:215` 0.2/0.35; `m2.test.ts:52`. G-CURVE block `m2.test.ts:51-174`. DISPLAYED==TESTED: `render.ts:861` paints `foeForecasts().winRate`, same pure fn (FORECAST_SEED, `combat.ts:217-231`); `render.test.ts:139`. | Solid. Band measured on first GRINDABLE foe (monkey @L1); scripted wolf is the guaranteed-survival beat — matches intent. DISPLAYED==TESTED holds structurally. |
| F2 Gear, durability & the 2nd weapon (4-band durability; repair wood-sink; **2nd weapon FOUND/CRAFTED, RETIRES grant D-052**) | 🟡 | 4-band durability shipped: `balance.ts:172-177`, `combat.ts:90`; `m2.test.ts:228-233`. Repair wood-sink shipped+wired: `intents.ts:180` (COST=5), `render.ts:809-814`, `integrity.test.ts:32`. **BUT** loot→craft absent: `crafting.ts` does NOT exist (verified); zero loot/recipe code; `wood_axe` STILL granted by drillmaster `fight.ts:62-73` (the path D-052 said to retire), with NO covering test. | 2 of 3 clauses ship; the headline reshape absent. Loot→craft loop + DIVERGE craft panel **DEFERRED** (T0-M4-style breadth after spine). Adversarial flag: the un-retired grant is also UNTESTED (no test exercises axe-offer or `equip_weapon` `intents.ts:195`). |
| F3 Combat becomes a real decision (HP carries + eat-to-heal D-050; NO-STANCE-DOMINATED; touch-legible wear; combat SFX) | 🟡 | HP-carry+eat shipped: `combat.ts:117`, `fight.ts:104,53`, `intents.ts:204-213`; `m2.test.ts:180-220`. NO-STANCE-DOMINATED: `m2.test.ts:127` over STANCE_MODS `balance.ts:198`. Wear pips touch-legible: `render.ts:840-853` (visible + aria-label); axis `m2.test.ts:154-173`. Combat SFX PARTIAL: `main.ts:163-164` fires the shared generic taiko cue ("per-strike out of this minimal pass"); fight→hit wiring untested. | 3 of 4 clauses ship and are tested; generic-only combat SFX keeps it from ✅. Minor: the wear PIPS (`render.ts:853`) have no direct render-test (only foe-fog % covered); the wear AXIS mechanic is tested. |
| F4 Keep the bite within guardrails (don't smooth; winnable/soft-setback/no-permanent-loss/no-dead-ends; no-stranding test) | ✅ | Bite kept: `balance.ts:178` wear/fight (stance-scaled `fight.ts:28-38`); satiety throttle `combat.ts:83`; `m2.test.ts:116`. Soft-setback/no-permanent-loss: `fight.ts:101-114` SETBACK_HP; `m2.test.ts:250,258`. No-stranding D-061: `m2.test.ts:270` across 8 seeds; R3 dead-end fixed (`ranks.ts` R3 storyGate). | Strong guardrail coverage. Caveat: the no-stranding test MODELS the eat/repair loop abstractly (sets durability=max + adds COOK_HP_RESTORE directly rather than dispatching the intents) — a real multi-seed invariant, not an end-to-end intent replay. |

### T0-M3 — The spine awakens (the macro engine — ONE pillar)  [DONE]

| DoD line | Status | Evidence (file:line + test) | Note |
|---|---|---|---|
| F1 Estate pillar goes live (un-grey active + UNNAMED silhouettes D-055; R7 capstone opens Phase 2; pillarDeltas accrue ONLY post-R7; additive {value,highWater}; DIVERGE) | ✅ | Core tested: phaseOf `ranks.ts:62` + `content/ranks.ts:196-214` (R7→'t0-capstone'); `m1.test.ts` capstone→phaseOf===2. Phase-2 accrual `pillars.ts:55` wired `intents.ts:152`; `pillars.test.ts` (no-op Phase 1; banks in Phase 2). Additive state `state.ts:38/46/111/148`; `migrate.test.ts`. Panel `render.ts:537` + silhouettes `render.ts:525`. DIVERGE: `project/audit/screens/diverge-influence/` (A vs B, DECISION.md, contact sheet). | Headline `renderHouseInfluence` UI has NO DOM unit test — evidenced only by diverge/play screenshots (`play-1-ascend-ready.png`). "pillarDeltas" is direct `applyEstateDeed` reducer wiring, not a RewardBundle field (functionally equivalent, Phase-2-gated). State adds `judged` beyond the named pair. Diverge folder-preserved (shared tree) per DECISION.md. |
| F2 Seasonal judged result (onSeasonBoundary on NEW high-water only; ±10% day-keyed sub-stream; 70/30 split) | ✅ | `step.ts:15` onSeasonBoundary (Phase-2-gated, new-high-water via `pillars.ts:69` highWater>judged). Day-keyed: `step.ts:22` deriveDayKeyed, cursor-free `rng.ts:130` swing [0.9,1.1]. 70/30: `pillars.ts:76-79` growth·3/7. `pillars.test.ts`: fires-only-on-new-high-water, ~3/7 share, ±10% never-net-negative + advances judged, clock-wired Phase-2-only. | Fully unit-tested end-to-end through advanceClock. Only nuance: no test asserts the literal 'seasonal-estate' RNG label (determinism exercised via clock-fire). Cursor-free sub-stream matches intent. The solidest of the three. |
| F3 The BIG ceremonial T0→T1 (manual opt-in; hybrid gate T0=EXCELLENT; overshoot→better boon; tier 0→1 stored; SCHEMA bump→dev wipe + real migrate(); dream beat; DIVERGE) | ✅ | `ascension.ts:22/27/33` reachable `intents.ts:258`. Gate=tier0 && phaseOf===2 && EXCELLENT; tier `state.ts:109/147`. SCHEMA_VERSION=2 `constants.ts:11`; migrate v1→v2 `migrate.ts:18-23` wired `validate.ts:48-62`+`saveManager.ts:125-155`. Dream `ascension.ts:55-58`. `ascension.test.ts` (closed<EXCELLENT, opens-at-EXCELLENT, never-auto-advances, tier 0→1 + boon + dream, overshoot=bigger, "spine CLOSES end-to-end"); `migrate.test.ts:21`. | Core fully tested. Gaps: (1) `showAscension` `render.ts:1079` (wired :1122) has NO DOM test — screenshot-only (`play-2-ceremony.png`); (2) the F3 DIVERGE was the panel diverge; ceremony deliberately reuses the rank-up seal (scaled+gold, D-062); (3) "dev save-wipe" D-067 is policy/comment, not executable wipe — the real engineering is the tested forward-migrate. T0 "hybrid gate" = single Estate≥EXCELLENT (richer hybrid is a future-tier concern). |

### T0-M4 — The showcase in miniature (the breadth — R4→R7)

| DoD line | Status | Evidence (file:line + test) | Note |
|---|---|---|---|
| F1 Your first quest (one PEST/HUNT/CLEAR end-to-end; top-level Quests tab D-037) | 🔴 | No `quests.ts` (verified: find returns nothing); no quest in Intent union `intents.ts:44-59`; Tab type is exactly `'work'|'skills'|'combat'` `render.ts:105` (assembled :454-456). Only stale forward comments `state.ts:5`, `rewards.ts:2-3`. No test, no machinery. | **Deferred breadth** — scheduled AFTER the spine (roadmap.md:126 locked spine-first order, D-052). Not contradicted, just not started. |
| F2 Koku flywheel taste (LINEAR upgrade raises yield → compounds; E1→E3 yield-bearing D-051; G-NO-DEAD-VALUES) | ✅ | yieldBonusNum E1/E2/E3 `estate.ts:16,27,37,47` (+15/20/30); selector `selectors.ts:46-50`; WIRED into labour `intents.ts:131,137`; sink `improve_estate` `intents.ts:226-236` reachable `render.ts:513-518`. `economy.test.ts:73-93` (COMPOUNDS) + :146-176 (sink); 12/12 pass. Dead-values: `integrity.test.ts:55-62`. | The one breadth slice actually built (rode the economy/spine work). Minor: the estate card (`render.ts:501-523`) shows blurb/cost but never surfaces the "+15% yield" raise — compounding real+tested but not legible in-panel. |
| F3 Talk & a tiny market (mentor lore-talk data-not-script; capped koku-sink market; DIVERGE) | 🔴 | No `market.ts` (verified); no buy/sell/talk intent (`intents.ts:44-59` has none); no lore-talk system. Only mentor content is the cold-open physician one-shot `coldOpen.ts:3` (linear scripted, not data-not-script per D-039). No DIVERGE artifacts. No test. | **Deferred breadth** (after-spine). DIVERGE ritual not run. (Overlaps the absent T0-M1-F3 mentor dialogue.) |
| F4 A small WALKABLE map (estate becomes areas you MOVE between D-065; pinned-node ceiling; reveal-per-beat; DIVERGE) | 🔴 | Headline (movement) absent: no `currentArea` in GameState `state.ts:72-112`, no moveTo/travel intent `intents.ts:44-59`, no map UI in `render.ts`. What exists is what the DoD *excludes*: `areas.ts` labels used as activity tags `activities.ts:17` + `room-*` reveal panels `surfaces.ts:85-123`. No node ceiling, no walkable surface, no DIVERGE. | **Deferred** — roadmap (roadmap.md:124,130-134) calls this "the heaviest new T0 build" and deliberately sits it AFTER the spine. The room scaffolding is pre-existing M1 organizational grouping, NOT the F4 walkable map. |
| F5 Stance & ability reveals (stance slot + ability/item slots reveal one-per-beat at R5/weapon-L10; touch-legible) | 🟡 | Stance slot exists + touch-legible: `render.ts:832-857` (segmented control, kanji+gloss, wear pips; :839 "not hover-only, touch-legible"); `set_stance` gated on tab-combat `intents.ts:175-179`. BUT built in M2, revealed wholesale with the combat tab — NOT one-per-beat at R5/weapon-L10 (no stance/ability ids in `surfaces.ts`). NO ability/item slots. Tested only for balance (`m2.test.ts:127`), not any reveal beat. | Partial: the pre-existing M2 stance slot satisfies "stance slot + touch-legible," but the F5-specific reveal-beat AND ability/item slots are unbuilt (**deferred breadth**). |

### CROSS — Cross-cutting + build integrity

| DoD line | Status | Evidence (file:line + test) | Note |
|---|---|---|---|
| DEV tools: 2×/4×/8× speed toggle + jump-to-rung/tier teleport, DEV-only (prod-stripped) | 🟡 | `main.ts:288` `toRung` inside `if (import.meta.env.DEV)` `main.ts:281` (verified) → prod-stripped, but UNTESTED (grep `__qa`/`toRung`/`.speed(` across tests+playcheck = ZERO). No 2×/4×/8× toggle anywhere (grep timescale/2x/4x/8x/setSpeed empty). No tier teleport: `tier()` `main.ts:376` hardcoded `() => 0`. | The two headline instruments (speed toggle D-056/D-067, tier teleport) entirely unbuilt; only an untested jump-to-rung exists. **Deferred** past the M2·1–M2·6 spine (origin T0-M1-F4 dev-tools). |
| Save policy: dev/v0.2 wiped on schema bump + real migrate() path test-covered | ✅ | `constants.ts:11` SCHEMA_VERSION=2; `migrate.ts:18-23` real v1→v2 additively hydrates tier:0 + influence.estate; `migrate.test.ts:21` (hydrate + carry-forward) + :9/12/15/30 (chain/no-op/gap/identity). Wired into load via `validate.ts`. | migrate() path genuinely built + tested (the load-bearing half). The "wipe" is subsumed by the safer forward-migrate (pre-launch, no users) per D-067; consolidated end-to-end exercise deferred to Ship-M2-F1. |
| DEMO/REAL pacing-profile fork RETIRED (D-056 — real D-049 the only profile) | 🔴 | NOT retired (verified): `main.ts:39-58` resolveBootProfile resolves demo\|real, default 'demo' (:57); `balance.ts:50` `type BalanceProfile = 'demo'\|'real'`; `:53` DEFAULT='demo'; `:61-67` RUNG_METER_THRESHOLDS carries BOTH maps. No single-profile test (it isn't one). | Direct DoD miss. D-056 (decisions.md:488-494) is LOCKED but marked "code application PENDING"; `balance.ts:64` comment says the fork retires "in M2·8." Consistent with MEMORY "no parallel build during ripple." Shipped default still DEMO, not real D-049. |
| Milestone-integrity D-054: every DoD instrument resolves to a real test/tool | 🟡 | SPINE genuinely covered: `pillars.test.ts:29-112`, `ascension.test.ts:28-90`, `migrate.test.ts`. Full suite green 139/17. BUT no D-054 CI-manifest gate in verify (the 9 gates are tsc/eslint/prettier/vitest/verify-content/verify-prd/gen-docs/pacing/playcheck — no milestone-integrity manifest); two DoD instruments (speed toggle, profile-retirement) resolve to NO test (unbuilt). | The spine passes the integrity bar; the milestone as a whole does not satisfy D-054 "every line met OR ADR-amended-as-done." The CI manifest check that would ban a "SHIPPED (slice)" claim is not wired into verify. |
| Diverge gate honored for the new influence surface | ✅ | `project/audit/screens/diverge-influence/DECISION.md` (A continuous ink grade-bar WINNER vs B segmented; committed contact sheet A-{1,2,3}/B-{1,2,3}; self-pick + folder-preserve, zero main flag-debt). R-item `project/human-in-the-loop/review.md:27` `R2 🔲 diverge pick`. Shipped commit cf3c1cb. | Tool backing = the `diverge` skill + committed artifacts + R2 (the D-073 process-gate instrument), not a unit test. Fully satisfies the diverge contract for the one new surface. |
| The verify gate: npm run verify green (9 gates) | ✅ | `npm run verify` → "verify OK — 9 gates in 1.88s"; `npx vitest run` → "17 passed / 139 passed". package.json verify:seq enumerates exactly the 9 gates. | Green across all 9. The per-commit build-integrity half (D-054 light gate) holds for the just-built spine. |

## Milestone-integrity (D-054)

**Does every *shipped* DoD instrument resolve to a real test/tool? Mostly — with one structural carve-out.** Every ✅ on the **spine** resolves to a real automated test, and the new spine test files are:

- **`src/core/pillars.test.ts`** — Estate pillar grade bands, per-deed cap, Phase-2 gating, the 70/30 seasonal judge (±10% day-keyed, never-net-negative, advances judged), and clock-wiring (fires Phase 2 / silent Phase 1).
- **`src/core/ascension.test.ts`** — gate closed `<EXCELLENT`, opens at EXCELLENT in Phase 2 / tier 0, never-auto-advances, tier 0→1 + grade-scaled boon + porter's-knot dream beat, overshoot=bigger boon, and the reducer-driven **"the spine CLOSES end-to-end"** test.
- **`src/persistence/migrate.test.ts`** — the real v1→v2 step hydrating the tier spine, plus ordered-chain / no-op / gap / identity coverage.

These join the re-baselined `m1.test.ts` (R0→R7 ladder + capstone→Phase 2), `m2.test.ts` (combat curve, durability, HP-carry, no-stranding), `economy.test.ts` (the F2 flywheel), and `integrity.test.ts` (G-NO-DEAD-VALUES) — full suite **139/139 green, 17 files**.

**✅-claimed lines that lean on a tool/screenshot rather than an automated test (flagged, not failures):**
- **T0-M3-F1 / F3 UI** — `renderHouseInfluence` (`render.ts:537`) and `showAscension` (`render.ts:1079`) have **NO DOM unit test**; they rest on the diverge/play screenshots (`play-1-ascend-ready.png`, `play-2-ceremony.png`) — a *tool*, but static, not regression-catching. The underlying pure logic IS tested; only the render binding is screenshot-only.
- **Diverge DoD** — backed by the `diverge` skill artifacts + the R2 R-item (the D-073 process instrument), not a unit test. Acceptable by design.

**Structural gap in the gate itself:** there is **no D-054 CI-manifest check wired into `npm run verify`** (the 9 gates are tsc/eslint/prettier/vitest/verify-content/verify-prd/gen-docs/pacing/playcheck). Nothing mechanically bans a future "SHIPPED (slice)" over-claim — the integrity bar is currently enforced by audit, not by a red-or-green gate. Per the "push each rule to the highest rung" convention, this is the one milestone-integrity instrument that should graduate from norm → gate.

**No ✅-claimed *gameplay/spine* line lacks a test.** Two CROSS DoD instruments (speed toggle, profile-retirement) resolve to no test **because they are unbuilt** — correctly carried as 🟡/🔴, not as a false ✅.

## Remaining to fully respect the roadmap

Ordered backlog of the 6 🟡 + 5 🔴 lines. The fun-slices below are **DEFERRED-by-design** under the LOCKED spine-first build order (roadmap.md:126-134, D-018/D-052: build the spine spike on minimal content FIRST, THEN fill T0-M4 breadth) unless flagged as a **genuine gap**.

1. **DEMO/REAL fork retirement (CROSS, 🔴)** — *genuine, near-term gap, but ripple-blocked.* Retire `resolveBootProfile` (`main.ts:39-58`), `BalanceProfile`/`DEFAULT_BALANCE_PROFILE` (`balance.ts:50-53`), and the dual `RUNG_METER_THRESHOLDS` maps (`balance.ts:61-67`); leave the real D-049 profile as the only world; add a single-profile assertion test. D-056 is locked but "code application PENDING" (slotted M2·8); paused under the MEMORY "no parallel build during ripple" note. **Do this first once the ripple clears** — it is the only locked-ADR contradiction in the build.

2. **DEV 2×/4×/8× speed toggle + jump-to-TIER teleport (T0-M1-F4 / CROSS, 🟡)** — *deferred tooling.* Add a DEV speed multiplier (currently only a raw `__qa.tick(dt)`) and a `toTier` teleport (`tier()` is hardcoded `() => 0` at `main.ts:376`); test the `__qa`/`toRung`/`toTier`/speed surface (currently zero coverage). Needed to make the deeper-tier spine testable by hand.

3. **T0-M2-F2 found/crafted 2nd weapon + craft DIVERGE (🟡)** — *deferred breadth + adversarial flag.* Build `crafting.ts` (loot→recipe→craft), retire the drillmaster `wood_axe` grant (`fight.ts:62-73`) per D-052, and run a DIVERGE on the craft panel. **Even before the reshape, add a test for the current axe-offer / `equip_weapon` reducer (`intents.ts:195`)** — the live grant path is currently untested.

4. **T0-M1-F3 / T0-M4-F3 mentor Genemon dialogue + lore-talk (🔴)** — *deferred breadth.* Create `dialogue.ts` (diegetic, data-not-script, no popups per D-039/D-015): Genemon greets + teaches the labour loop (M1-F3) and a lore-talk line (M4-F3). Currently nonexistent (only the static `names.ts:11` label + the physician one-shot). DIVERGE a dialogue panel.

5. **T0-M1-F4 SFX completion (🟡, sub-item)** — *small gap.* Add the missing shakuhachi voice (palette is 3/4; module says "Three cues only") and test the render-side reward/rankUp wiring (`render.ts:978,1059,1080`, currently stubbed as no-ops in render.test).

6. **T0-M2-F3 per-strike combat SFX (🟡, sub-item)** — *deferred polish.* Replace the shared generic taiko deed cue with per-strike combat SFX and test the fight→hit wiring (`main.ts:163-164`).

7. **T0-M4-F1 first quest + Quests tab (🔴)** — *deferred breadth.* One PEST/HUNT/CLEAR order-free quest end-to-end, a top-level Quests tab (D-037), and a covering test. Net-new `quests.ts`, Intent union extension, Tab type extension.

8. **T0-M4-F3 tiny capped market (🔴)** — *deferred breadth.* A capped koku-sink market (the TRADE taste): `market.ts`, buy/sell intent, DIVERGE. Pairs with the lore-talk in #4.

9. **T0-M4-F4 walkable map (🔴)** — *deferred breadth; "the heaviest new T0 build."* True movement between areas (D-065): `currentArea` state, moveTo/travel intent, map UI, pinned-node ceiling, reveal-per-beat, DIVERGE. The existing `areas.ts`/`room-*` panels are M1 organizational grouping, explicitly NOT this.

10. **T0-M4-F5 stance/ability reveal-beat + ability/item slots (🟡)** — *deferred breadth.* Add a one-per-beat reveal at R5/weapon-L10 (entries in `surfaces.ts`) plus the absent ability/item slots; test the reveal beat. The M2 stance slot already satisfies "stance slot + touch-legible."

11. **Render-layer DOM tests for the spine UI (T0-M3-F1/F3, 🟡 follow-up)** — *test-debt, not a feature gap.* Add DOM assertions for `renderHouseInfluence` and `showAscension` so the shipped spine UI is regression-caught, not screenshot-only.

12. **Wire the D-054 milestone-integrity manifest into `verify` (CROSS, 🟡)** — *graduate the rule to a gate.* A CI manifest check that resolves every shipped DoD line to a test/tool and bans "SHIPPED (slice)" over-claims — the missing highest-rung enforcement for D-054.

**Bottom line for the human:** the build honors the roadmap's spine in full (T0-M1/M2 re-baselined, T0-M3 closed end-to-end) and faithfully follows its own locked spine-first sequencing; the outstanding 6 🟡 + 5 🔴 are the T0-M4 breadth fun-slices plus two cross-cutting items, all deferred-by-design except item #1 (the DEMO/REAL retirement, a locked-but-unapplied ADR) and the small test-debt items #3/#11/#12.
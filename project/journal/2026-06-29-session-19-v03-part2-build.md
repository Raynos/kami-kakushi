# Session 19 — 2026-06-29 — v0.3 Part 2: the build (re-baseline → T0-M3 spine → T0-M4 breadth)

## ☀️ SUMMARY (read this first)

> This file is **HISTORY** (how it got here), not live state — the live snapshot is
> [`../status/project-status.md`](../status/project-status.md).

The human gave a full mandate: **implement `path-to-v0.3` Part 2 end-to-end** — Movement 1 (re-baseline the
shipped T0-M1/M2 against the current 6-tier PRD), Movement 2 (the **T0-M3 spine**: live Estate pillar + the BIG
T0→T1 ascension), Movement 3 (the **T0-M4 breadth**: quest, koku flywheel, market, walkable map, found/crafted
2nd weapon) — **and verify the v0.3 build respects the roadmap**. Running autonomously: many small verify-green
commits, `diverge` on new UI surfaces, milestone-integrity (D-054) so every DoD line resolves to a real test.

**Where it stands:** Movement-1 **audit is done** (the gate for everything downstream). A 21-agent source-code
fidelity Workflow + a headless built-game pass produced the
[gap report](../audit/reports/2026-06-29-t0-m1-m2-rebaseline.md): **27 🟢 / 10 🟡 / 14 🔴 across 51 DoD lines**,
zero NEEDS-HUMAN conflicts. Verdict: the **foundation is PRD-faithful** (cold-open, labour ladder, signed
20–35% first-fight band, DISPLAYED==TESTED — all clean), the **spine/combat-correctness contracts are not**
(HP-carry D-050 absent, 2nd weapon still a grant, no-stance-dominated test missing, no-stranding property
*violated* 8/8 seeds, estate sink power-neutral, mentor/dialogue + SFX wholly unbuilt). The report cleanly
splits **true re-baseline gaps** (fix in 0c) from **expected v0.3 mutation targets** (influence state = M2,
yield-estate = M3).

---

## 1 · Movement 1 · audit (0a source-code + 0b built-game) — DONE

**0a — source-code fidelity (Workflow `wf_9a2f2c37-20a`).** 21 agents (10 per-slice auditors + 10 adversarial
verifiers + 1 convergence critic), 1.16M tokens, 357 tool uses, ~13.5 min. Each fun-slice audited against its
exact roadmap DoD + governing ADR, every line classified 🟢/🟡/🔴 with `file:line` evidence; the verifier
independently tried to refute each gap *and* each clean claim (the audit-theatre mitigation). Raw verbatim
snapshot: `project/brainstorms/raw/2026-06-29-t0-m1-m2-rebaseline-audit.json` (206 KB).

**0b — built-game (headless).** Drove the running dev build through the cold-open→labour→first-wolf→gear arc
via `qa-shots.mjs`; reviewed each screenshot with vision. Look holds (woodblock/ink, no console errors); the
three felt gaps confirmed = **silent (no SFX)**, **no visible HP / HP doesn't carry**, **mentors are prose not
a dialogue system**. Folded into the gap report's 0b section (also feeds R1).

**Deliverable:** [`project/audit/reports/2026-06-29-t0-m1-m2-rebaseline.md`](../audit/reports/2026-06-29-t0-m1-m2-rebaseline.md)
— the 10-priority re-implementation backlog. Movement-1 0c scope = P1 HP-carry, P2 no-stance-dominated, P3
found/crafted weapon, P4 no-stranding bug+test, P7 mentor/dialogue, P8 SFX+DEV-speed, P9 wear-axis, P10 doc
reconcile. (P5 yield-estate → M3 T0-M4-F2; P6 influence state → M2 T0-M3-F1.)

---

## 2 · Movement 1 · 0c · P1 — HP-carry spine (D-050) — DONE (core)

Re-baselined combat to the D-050 contract: **HP carries between fights and heals ONLY by eating.**
- `combat.ts` — `mcCombatStats` now reads **carried** `c.hp` (clamped to hpMax), not a free full refill. Since
  the forecast shares `mcCombatStats`, a hurt fighter now forecasts strictly lower — the legible "eat first" cue.
- Removed all **three** non-eating heals (the verifier-found set): the loss full-heal (`fight.ts` — you now limp
  away at `SETBACK_HP`, still no permanent loss), the level-up heal (`fight.ts`), and the rung-promotion HP
  refresh (`ranks.ts` — promotion still refills the *belly*/satiety, not wounds, so it can't be farmed as a heal).
- Added the eat→HP path: `cook_meal` now restores `COOK_HP_RESTORE=14` HP (capped at hpMax) alongside satiety,
  coupling combat ↔ the cook sink.
- Tests: new `m2.test.ts` "HP carries / heals only by eating (D-050)" block (carry read, loss=SETBACK_HP,
  promotion-no-heal, cook-heals). Updated the `mc()` curve helper to seed full HP so the canonical curve is
  unchanged while the live forecast reflects carried HP. **45/45 affected tests green.**

⚠️ **Cross-agent event:** another live session `git stash`ed this working tree mid-edit and restored it; P1
verified intact and committed immediately to protect it. (The `git add -A` guard doesn't stop `git stash` — keep
commits frequent while other sessions are active.)

## 3 · Movement 1 · 0c · P2 + P4 — combat-correctness invariants — DONE

- **P2 no-stance-dominated** (`m2.test.ts`): replaced the dominance-ENSHRINING test (asserted jodan strictly
  out-win-rates chudan) with a **no-Pareto-domination** invariant on the three decision levers (offense=atkMult,
  HP-retention=−takenMult, durability=−wearMult). TDD surfaced a real subtlety: empirical win-rate at one foe
  conflates offense+defense (gedan *out-wins* chudan at the humbling first fight purely on survival → would make
  chudan a trap). The lever test is the robust altitude; a span check keeps stance a real choice. No mod change.
- **P4 no-stranding** (`m2.test.ts`): added the gap report's *violated* property. With HP-carry the old
  pure-fight framing is moot; the faithful contract = the **eat+repair recovery loop always reaches combat-L2**
  (never a wall, never a Broken-blade dead-end). Converges across 8 seeds with **no balance retune** — HP-carry +
  the recovery loop already resolve the stranding the v0.2 build had.

## Parallelism (human ask) — IN FLIGHT

Launched a background **scatter-gather Workflow** (`wf_b1d7598e-9c6`): 6 read-only agents authoring the disjoint
NEW leaf modules in parallel (`ui/sfx.ts`, `core/content/{dialogue,quests,crafting,map,market}.ts`) + their
tests, returning verbatim source + integration notes. Rationale: this codebase funnels through a few shared
files (`render.ts`/`intents.ts`/`state.ts`/`balance.ts`), so feature-branch parallelism would merge-conflict
badly — and another agent is live on the tree. Read-only authoring → zero contention; **I keep the coupled
integration spine on the main line** and wire each leaf in at its point.

## 4 · Movement 2 · M2·1 — schema scaffold (tier + influence + migrate v1→v2) — DONE

The macro-spine foundation: added `tier: number` (0..5, D-048) + `influence: { estate: { value, highWater } }`
(D-049/D-055) to `GameState` + `createInitialState`; bumped `SCHEMA_VERSION` 1→2; registered the **real**
v1→v2 `migrate` step (additive hydrate — old saves load as a fresh-spine T0 with progress intact; dev/v0.2
saves WIPED per D-067 but this is the genuine forward path) + a `migrate.test.ts` case; extended `validate.ts`
(the compile-time `_Handled` exhaustiveness ledger forced handling both keys — added a coercing `validateInfluence`
that holds highWater ≥ value); exported `PillarState`/`Influence` from core. `verify` green (9 gates).

## Leaf-module fan-out — RETURNED (6/6), staged for integration

The background scatter-gather Workflow returned all 6 modules + tests + integration notes (raw snapshot:
`project/brainstorms/raw/2026-06-29-v03-leaf-modules-authoring.json`; staged in `tmp/fanout/`). To integrate:
M1 leaves — **sfx** (P8), **dialogue** (P7), **crafting** (P3); M4 leaves (after spine closes) — **quests**,
**map**, **market**. Each is self-contained; I verify + wire each on the main line.

## 5 · Movement 2 · M2·2 — R7 capstone (thin R4→R7, fix R3 dead-end) — DONE

Closed the T0 rung ladder: authored **R4 Kura-warden / R5 House-servant / R6 Steward's man / R7 Trusted of the
house** (thin — threshold + a reveal-as-plot log, reusing the labour verbs); fixed R3's dead-end
`storyGate:()=>false` → opens R3→R4 on a new `combat-blooded` flag (set on any grind fight = you've stood real
gate-watch duty). **R7 sets `t0-capstone`**, so `phaseOf()` flips to **2** — the macro engine opens. Added R4–R7
thresholds to both balance profiles (over-satisfy the floor; M2·8 re-derives to the single ~10–15 min/rung
profile). New `m1.test.ts` block: ladder is contiguous R0…R7, R3→R4 needs combat-blooded, the climb reaches R7
and opens Phase 2. Regenerated `docs/content/t0-content.md`. `verify` green (9 gates).

## 6 · Movement 2 · M2·3 + M2·4 — the macro engine (pillars + seasonal judge) — DONE

New `pillars.ts` — the House-Influence (家威) engine:
- **Grade bands** Estate GOOD/GREAT/EXCELLENT (provisional T0, liquid D-059); `gradeOf` (the ascension gate).
- **Deeds** `applyEstateDeed` — **Phase-2-gated** (no-op until `phaseOf===2`, i.e. post-R7 capstone, FU7),
  **per-deed capped** (0.04·GOOD, anti-spike). Wired into the labour reducer so estate work banks standing
  once the tutorial ladder is climbed. (Implemented as a reducer-level call, not `RewardBundle.pillarDeltas` —
  avoids a `rewards`→`ranks` import cycle; same contract.)
- **Seasonal judge** `seasonalJudge` — on a NEW high-water (`highWater > judged`) pays the **30% seasonal
  share** (`growth·3/7`, the 70/30), swung ±10%, never net-negative (D-061); advances the `judged` baseline.
  Wired into `step.ts onSeasonBoundary` via the day-keyed `seasonal` substream (`deriveDayKeyed`) — deterministic,
  no cursor mutation; folds per-day so multi-season jumps fire each judge in turn. Diegetic 家産 log beat.
- Schema: `PillarState` gained a `judged` field (the seasonal baseline) — rippled through migrate/validate.

`pillars.test.ts` (11): bands, per-deed cap, Phase-2 gating (direct + via reducer), seasonal new-high-water-only,
the 3/7 share, ±10% swing, and the clock-wired judge (fires at a season boundary in Phase 2, not Phase 1).
`verify` green (9 gates). **The spine's two halves now exist — M2·5 ascension closes the loop.**

## 7 · Movement 2 · M2·5 — ascension (T0→T1) — DONE — **THE SPINE CLOSES** ✅

New `ascension.ts` — the manual opt-in tier ascension (D-049/D-062/D-013a):
- `ascensionAvailable` = the gate (Estate ≥ EXCELLENT, Phase 2, tier 0) — unlocks the OPTION only, **never
  auto-advances** (tested: a normal reduce doesn't ascend; only the explicit `ascend` intent does).
- `ascend` bumps `tier` 0→1, grants a **grade-scaled permanent boon** (attribute points — always-big base D-062
  + overshoot buys more), fires the **dream beat** that READS the porter's-knot mystery flag (no longer
  write-only — fixes the v0.1 bug) + the ceremonial milestone cascade the UI will render.
- `ascend` intent wired into the reducer (gate-checked inside — a no-op when not ready).

`ascension.test.ts` (7) — incl. **the spine-closure proof**: drive the real reducer from the R7 capstone →
grind Estate deeds to EXCELLENT → `ascend` → **tier 1**, boon granted, can't re-ascend. The macro loop
demonstrably CLOSES on thin content (decision #18 spine-first, proven before M4 breadth). `verify` green.

## 8 · Movement 2 · M2·6 — live-Estate UI + ascension ceremony (DIVERGE) — DONE

Mutated `renderHouseInfluence` from the static locked teaser into the **live macro surface**: phase-gated —
pre-capstone shows unnamed silhouettes ("earn the house's trust"); in **Phase 2** the active **Estate 家産**
pillar with a grade bar (ticks at Good/Great/Excellent, indigo→gold), the season high-water readout, **3 unnamed
silhouettes** (D-055), and the **vermilion Ascend CTA** when Estate ≥ EXCELLENT. Added the **ascension ceremony**
(`showAscension`, fired on tier change — a bigger/gold rank-up seal, D-062). Retired the old 4-named-pillar
`PILLARS` const.

**Diverge (D-073):** explored 2 distinct approaches headless (`tmp/shot-influence.mjs` → `forceState`) — **A
continuous ink grade-bar (WINNER)** vs B segmented boxes (clunkier + a fill bug). Picked A flag-free; contact
sheet + `DECISION.md` in `project/audit/screens/diverge-influence/`; **R2** filed (non-blocking override).
*Branch-preservation → folder-preservation* because the tree is shared with another live agent (a `git switch`
would clobber their WIP — CLAUDE.md shared-tree rule). `verify` green; no console errors.

## 9 · Movement 1 · 0c · P8 — SFX juice (integrate the leaf module) — DONE

Integrated the first leaf module from the scatter-gather fan-out: `src/ui/sfx.ts` (+ its 7-test jsdom suite) — a
lazy, synth-only Web-Audio engine (taiko hit / shamisen-koto reward / suzu temple-bell rank-up), mute-safe +
reduced-motion-aware, no-op when AudioContext is absent. Wired per the module's integration notes: app owns the
one instance (`main.ts`, `honorReducedMotion`), threaded via `AppHooks.sfx`; cues fire at **reward**→`flashTally`,
**rankUp**→`showRankUp`+`showAscension`, **hit**→player deed/fight dispatch; a **Sound on/off** toggle joins the
Settings comfort row (default on — the ship default is the R1 taste call). No DIVERGE (one-line control). The
build is no longer silent. `verify` green; headless qa-shots **no console errors**.

## 10 · Movement 1/3 · P5 flywheel + P1c auto-heal + P9 wear-axis — DONE

Three lower-friction gap-report fixes (no diverge):
- **P5 — the koku flywheel COMPOUNDS** (T0-M4-F2/D-051): `EstateStageDef` gains `yieldBonusNum` (E1 +15% / E2
  +35% / E3 +65% cumulative); new `estateYieldNum` selector (identity at E0); applied in the labour yield loop so
  work→koku→upgrade→more output. Fixes the gap report's "power-neutral estate" (P5). `economy.test.ts` proves the
  mechanism strictly compounds + end-to-end teeth.
- **P1c — auto-loop eat-to-heal** (`main.ts`, D-050): when auto-fighting and HP < 55% of hpMax, the loop cooks
  (or forages for greens), and STOPS rather than grind at low HP — so HP-carry actually works unattended.
- **P9 — touch-legible wear axis** (P9/D-050): the per-stance blade-wear (jodan 3 / chudan 2 / gedan 1) now shows
  as visible `wear ◆◆◆` pips + an aria-label on the stance control, not a hover-only title.

`verify` green (9 gates). **Movement-1 0c is now substantially closed** — remaining: P3 found/crafted weapon, P7
mentor dialogue (both DIVERGE surfaces), P10 doc reconcile.

## 11 · OVERNIGHT (autonomous /loop) — verification + DEV playtest tools

The human set an overnight /loop: finish T0-M3/M4, audit/battery for PRD/human-feedback/ADR fidelity, leave a
playtestable v0.3, rewrite R1 → a T0 M0–M4 review. Durable plan: `docs/plans/2026-06-29-overnight-v03-completion.md`.

- **Roadmap-respect verification** (6-agent Workflow + spine playthrough) → `project/audit/reports/2026-06-29-v03-roadmap-respect.md`:
  **the build respects the roadmap's spine in full** (T0-M3 DONE end-to-end, T0-M1/M2 re-baselined), **11✅ / 6🟡 /
  5🔴**, 139/139 tests green. Remaining = T0-M4 breadth + cross-cutting, deferred-by-design except the DEMO/REAL
  fork (the one locked-ADR contradiction). That report is the overnight backlog.
- **DEV playtest tools** (part of M2·8, DS#1/DS#16/D-067, DEV-only/prod-stripped): `__qa.speed(2/4/8)` (N auto-steps
  per tick, via a refactored `autoStep`), `__qa.jumpToPhase2()`, `__qa.jumpToAscension()` (→ R7/Phase-2/EXCELLENT,
  Ascend live in one call), `__qa.toTier()`; fixed `selectors.tier` (was hard-coded 0). Smoke-tested headless, no
  console errors. These let the human reach the spine/ascension/breadth fast in the playtest.

## 12 · OVERNIGHT — T0-M4 breadth integration (running)

Wiring the authored leaf modules into the spine, each verify-green + tested:
- **P7 mentor dialogue (Genemon) — DONE** (T0-M1-F3/D-039). `dialogue.ts` data-not-script registry + pure cursor;
  Genemon greets on waking + teaches rake→koku as STORY routed into the **log** (not a popup → no new surface →
  no diverge); gated acknowledgment lands reveal-as-plot after the first rake. New `deliveredDialogue` state
  (additive). 9 module tests + 2 integration. Screenshot `breadth/genemon-greet.png`. (Cold-open is now text-heavy
  — flag for R1.)

- **P3 found/crafted 2nd weapon — DONE** (T0-M2-F2/D-052). Integrated `crafting.ts` (materials + recipe + seeded
  loot rolls). **Retired the drillmaster axe grant** in `fight.ts`; materials now drop off felled foes (the seeded
  `loot` stream), the wood_axe is forged via a new `craft_weapon` intent (consumes inputs + equips), and a craft
  panel surfaces in the combat tab once you've looted (discover-by-doing → no new latched surface = no diverge).
  `equip_weapon` re-gated on the `crafted-wood_axe` flag. 24 module tests + 3 m2 integration (grant-retired,
  materials-drop, craft-consumes-and-equips). Screenshot `breadth/craft-panel.png`. verify green.

- **T0-M4-F1 first quest + Quests tab — DONE** (D-037). Integrated `quests.ts` (order-free advance-event sets) +
  a new `quest-engine.ts` glue (accept + `applyQuestEvent`, in its own module so both fight.ts and intents.ts can
  emit tokens without a cycle). New `quests` state (additive). The fight reducer emits `kill:<mob>`, labour emits
  `gather:<resource>`; the crop-raider PEST quest (rout-monkey / down-boar / mend-fence) completes in any order →
  +30 koku once (double-grant-guarded). New **top-level Quests 用 tab** (D-037, not nested) with per-step
  checkmarks. 7 module tests + 3 reducer integration. Screenshot `breadth/quests-tab.png`. verify green.

- **T0-M4-F3 tiny market — DONE** (D-008). Integrated `market.ts` (4 modest goods, each a small per-run
  `stockCap`). New `marketBought` state (additive). `buy_item` intent (koku→resource, capped — the minority-lane
  clamp), gated on the estate economy (`panel-estate`). A small market panel in the Work tab (derived visibility,
  no new latched surface → no diverge). 10 module tests + 2 reducer integration (buys + caps + gated). verify green.

- **T0-M4-F4 walkable map — DONE** (D-065). Integrated `map.ts` (6-node estate graph, ceiling 7; nodes reuse the
  EXISTING room-unlock surface ids → a node inks in on its room's beat, zero extra reveal wiring). New `location`
  state (additive, default kura). `move_to` intent (adjacent + revealed + the conditioning danger-gate for the
  satoyama). New top-level **Estate 地図 tab** — a "you are here + paths" walk surface. **Full DIVERGE** (A focused
  walk-affordances WON vs B whole-map grid; `audit/screens/diverge-map/` + DECISION.md; **R3** filed). 20 module
  tests + 1 reducer integration. verify green. **All 5 breadth modules now wired** (dialogue/crafting/quests/
  market/map); the leaf scatter-gather is fully integrated.

## 13 · OVERNIGHT — fidelity battery (running) + the playtest hand-off

- **Fidelity BATTERY launched** (`wf_4010f653-0fb`, via the `battery` skill): 8 cold-read lenses — **prd-faithful,
  human-feedback, adr-faithful** (the human's 3 explicit lenses) + fun · ui-polish · incremental · economy-arithmetic
  (fresh-on-build) · laziness — → a convergence critic + scorecard. Auditing whether what's BUILT is FAITHFUL (the
  roadmap-respect report already maps shipped-vs-deferred). Report will land in `project/audit/reports/`.
- **R1 rewritten → the v0.3 T0 M0–M4 playtest review** (`human-in-the-loop/review.md`): the full arc (cold-open
  Genemon onboarding → R0–R7 labour → humbling combat + HP-carry + loot-craft → the macro spine → the BIG T0→T1
  ascension → quest/market/map breadth) + the **DEV-tools playbook** (`__qa.speed(8)`, `jumpToPhase2()`,
  `jumpToAscension()`, `toRung()`) so the human can playtest fast. Flags: cold-open length, the pending fork.
- **v0.3 gallery captured** (`project/audit/screens/v03-gallery/01..08`): cold-open+Genemon, the live Phase-2 spine,
  ascension-ready + the ceremony, quests, combat+craft, the market, the walkable map. No console errors.

## 14 · OVERNIGHT — battery self-resolvable fixes applied (5)

The fidelity battery landed (`project/audit/reports/2026-06-29-v03-fidelity-battery.md`; scorecard prd 9 / adr
8.5 / human-fb 8). Per the battery skill's **self-resolution boundary**, I applied only the findings that need
no human design call — the rest are routed to **R4** (the 6-item judgment queue). The 5 applied, all verify-green:

- **`fun` MAJOR — cold-open over-teaching (reveal-as-plot violation).** Genemon dumped 5 estate lines on the
  first wake. **Fix:** gated `gen-rake` (the koku-teaching) + `gen-keep` (the promise) on `flags.raked` so the
  wake now delivers only **greet + the stakes** (`gen-greet` + `gen-stores`); the koku lesson + acknowledgment
  land as the first **+koku** shows (`src/core/content/dialogue.ts`). m1 mentor test rewritten to assert the lean
  hook on wake + the full teach-after-rake (`m1.test.ts`); `dialogue.test.ts` is derived-generic → still green.
  *(R4 notes this as "the agent applied the suggested fix — confirm the new sequencing reads right.")*
- **`ui-polish` — ascension seal had no scrim (the "doubled text" the battery confirmed REAL, not a test artifact).**
  Added the dark scrim + a washi seal-inner card behind the T0→T1 ceremony seal (`src/ui/styles.css`).
- **`laziness` / `test-integrity` — seasonal-judge geometric inflation.** `seasonalJudge` advanced `judged` to the
  PRE-bonus high-water → it re-judged its own payout every season. **Fix:** baseline now advances to the POST-bonus
  high-water (`pillars.ts`); added a RED-able "does NOT re-judge its own payout without new deeds" test (`pillars.test.ts`).
- **`laziness` — dead-value ratchet blind to the new loot currencies.** `integrity.test.ts` didn't surface the
  craft materials → a new dead value could slip the ratchet. **Fix:** `...MATERIAL_IDS` added to SURFACED_CURRENCIES +
  hardwood/beast_sinew ledgered → `craft_weapon`.
- **`test-integrity` — tautological no-stranding test.** `m2.test.ts` asserted on a directly-mutated `foughtBroken`
  (couldn't go RED). **Fix:** rewritten to drive the real `reduce` durability path (repair/cook/woodcut/forage intents).

## Next intended steps (current)
1. **Battery completes → synthesize the report + act on self-resolvable findings; route the rest to ADRs/H-R items.**
2. Then: project-status current → final journal → checkpoint-push. (Deferred-by-design + the M2·8 fork retirement
   remain the documented post-playtest backlog.)
   **M2·6 live-Estate UI** (mutate `renderHouseInfluence` → active Estate bar + locked silhouettes + Ascend CTA +
   the T0→T1 ceremony; **mandatory `diverge`**) → **M2·8** retire DEMO/REAL fork + DEV speed/teleport.
2. **Integrate the M1 leaf modules** (sfx P8, dialogue P7, crafting P3) — Movement-1 0c remainder.
3. **Movement 3** (T0-M4 breadth: quests/map/market leaves + flywheel + stance reveals) → roadmap-respect verify.
2. **Integrate the leaf modules** as the Workflow returns: M1 leaves (sfx P8, dialogue P7, crafting P3) into
   Movement-1; M4 leaves (quests, map, market) AFTER the spine closes (spine-first).
3. **P1c** auto-loop eat-to-heal (`main.ts`), **P9** touch-legible wear axis (`render.ts`), **M2·8** retire
   DEMO/REAL fork + DEV speed/teleport.
4. Then Movement 3 (T0-M4 breadth) → roadmap-respect verification.

## Landmines (current)
- **P4 no-stranding is a real BUG, not just a missing test** — fresh-L1/no-wood strands at Broken before L2 on
  8/8 seeds. The retune (durabilityMax / wear / XP-gap / starting-wood) must make the property hold, not just
  assert it.
- **HP-carry has THREE reset sites**, not one: loss-branch `fight.ts:112-115`, level-up `fight.ts:54`, AND rank
  promotion `ranks.ts:51-54` (verifier-found). All three full-heal — re-evaluate each against D-050.
- **DISPLAYED==TESTED is defined on the SAMPLED forecast** (analytic monkey@L1=0.447 is out-of-band; the band
  is on `foeForecasts` sampled=0.320). Don't "fix" combat against the analytic number.
- Dev server runs in background on :5174 (HMR) — restart after schema bumps if saved state breaks.

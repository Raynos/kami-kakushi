# Session 19 — 2026-06-29 — v0.3 Part 2: the build (re-baseline → T0-M3 spine → T0-M4 breadth)

## ☀️ SUMMARY (read this first)

> This file is **HISTORY** (how it got here), not live state — the live snapshot is
> [`../status/project-status.md`](../status/project-status.md).

The human gave a full mandate: **implement `path-to-v0.3` Part 2 end-to-end** — Movement 1 (re-baseline the
shipped T0-M1/M2 against the current 6-tier PRD), Movement 2 (the **T0-M3 spine**: live Estate pillar + the BIG
T0→T1 ascension), Movement 3 (the **T0-M4 breadth**: quest, koku flywheel, market, walkable map, found/crafted
2nd weapon) — **and verify the v0.3 build respects the roadmap**. Running autonomously: many small verify-green
commits, `diverge` on new UI surfaces, milestone-integrity (D-054) so every DoD line resolves to a real test.

**Where it ended (⭐ v0.3 is BUILT + PLAYTESTABLE):** all three movements shipped to `origin/main`, **220 tests
green**, every commit verify-green. **Movement 1** re-baselined combat (HP-carry/heal-by-eating D-050,
no-stance-dominated, no-stranding). **Movement 2** built the macro spine that **demonstrably CLOSES** — R7
capstone → Phase 2 → Phase-2-gated capped Estate deeds → the 70/30 ±10% seasonal judge → the **BIG T0→T1
ascension** (proven by a reducer test AND a headless UI playthrough: the ceremony fires, tier 0→1). **Movement 3**
wired all 5 breadth leaves (diegetic dialogue mentor · loot→craft 2nd weapon · quests · market · walkable map),
2 of them via full `diverge`. Then an **8-lens fidelity battery** (the human's 3 explicit lenses — prd/adr/human-fb
— + fun/ui/incremental/economy/laziness) returned **prd 9 / adr 8.5 / human-fb 8**: *the game the PRD promised is
built and honest; the first-10-min FEEL isn't tuned yet.* **7 self-resolvable findings applied** (cold-open
reveal-as-plot gating, ascension seal scrim, seasonal-judge geometric-inflation fix, dead-value ratchet covers
loot mats, no-stranding de-tautologised, +2 RED-able guards). The **6 design/taste calls** the battery surfaced
are routed to **R4** (incl. the deferred D-056 DEMO/REAL fork retirement — needs the human's pacing-number
sign-off, not a unilateral call). **R1 is now the T0 M0–M4 playtest review** with a DEV-tools playbook + the
curated `v03-gallery/`. *(The original mid-session "where it stands" — Movement-1 audit only — is preserved in §1
below as the historical gate.)*

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

Then two **cheap RED-able coverage guards** the battery named (#16, #17 — engineering lane, pure test additions,
zero production change, hardening LOCKED criteria):

- **#16 D-052 equip "never-gifted" gate had ZERO coverage.** Added an `m2.test.ts` reduce-level test: `equip_weapon
  wood_axe` is a structural no-op (`=== state`) without `crafted-wood_axe`, and succeeds only after `craft_weapon`
  sets it — a regression re-allowing the un-forged axe now goes RED.
- **#17 porter's-knot "ZERO mechanical bonus" honored but not RED-able.** Added an `m1.test.ts` invariant: two states
  differing ONLY in the knot/dream flags produce byte-identical `mcCombatStats` + `hpMax` + labour koku yield — locks
  the no-magic / mediocre-start acceptance criterion against anyone wiring the dream to a stat.

## 15 · SESSION CLOSE — ⭐ v0.3 shipped & playtestable; the ball is in the human's court

The overnight mandate is **DONE**. The v0.3 T0 M0–M4 arc is built, fidelity-battered, and on `origin/main`
(220 tests green, all verify-green). Final wrap actions this close:
- **Battery report synthesized** + **7 self-resolvable findings applied** (§14): 5 fixes + 2 RED-able guards.
- **Gallery refreshed:** re-captured `v03-gallery/01-cold-open-genemon.png` (the now-lean Genemon hook) +
  `04-ascension-ceremony.png` (the seal-scrim fix) — the 2 shots the fixes invalidated. No console errors.
- **R1 reconciled** to the post-fix reality + pointed at the curated `v03-gallery/` (START HERE).
- **Live snapshot** (`project-status.md`) + this journal updated; every checkpoint pushed to `main`.

**What's left is the HUMAN's, not the agent's** (all non-blocking, all in `human-in-the-loop/review.md`):
- **R1** — play the T0 M0–M4 build (DEV playbook: `__qa.speed(8)`, `jumpToPhase2()`, `jumpToAscension()`,
  `toRung()`); the fun/pacing/look taste verdict.
- **R4 — the 6 design/taste calls** the battery surfaced. The load-bearing one is **#2: retire the DEMO/REAL
  fork + sign off re-derived T0 pacing** (M2·8 — deliberately NOT done unilaterally; it's a 13-file pacing-gate
  refactor that needs the human's number sign-off on ~10–15 min/rung + the ≥30-min floor gated from T1). Also:
  #1 D-053 wall-time clock (an ADR self-contradiction only the human can resolve), #3 auto-combat tension, #5
  breadth-as-chrome, #6 koku↔win-condition coupling.
- **R2 / R3** — override-or-confirm the diverge self-picks (influence panel / breadth surfaces).

**The agent's stopping point is correct:** everything past here changes *what the game is* (locked pacing intent,
ADR contradictions, design forks) — CLAUDE.md's "stop and ask" boundary. Next session resumes from R1/R4 verdicts.

## 16 · OVERNIGHT (2nd pass) — autonomous-safe polish: variants-log backfill + a hands-on QA sweep

The `/loop` re-fired, so I kept going on the **autonomous-safe** lane (no design calls): two quick wins + a
hands-on visual QA pass of the *running* build (distinct from the cold-read battery — this drives every surface
and reviews the actual pixels).

- **D-073 variants-log backfill** (battery §72 — the registry was EMPTY despite 5 diverge runs). Recorded the 2
  full diverges (influence panel → R2, walkable map → R3; winner **A** both, folder-preserved on the shared tree)
  in the Closed crosswalk + a note on the 3 diverge-LITE breadth panels. Doc-hygiene, self-resolvable.
- **QA visual sweep** (`project/audit/screens/2026-06-29-v03-qa-sweep/`, 15 surfaces): cold-open lean hook,
  post-rake reveal, labour, skills, combat+forecasts, craft, quests, map, market, the **live influence panel at
  Good / Great / Excellent + the Ascend CTA**, the ascension ceremony, post-ascension, mobile. **Zero console
  errors across all 15.** Reviewed each with my own vision:
  - **Found + FIXED 1 real visual bug:** the map node header read "You stand at **the the** grain-store (kura)" —
    the template prepended "the" onto a label already starting with "The". Fixed in `render.ts` (strip a leading
    article). Re-captured clean.
  - **Confirmed the battery fixes read right in-pixels:** the cold-open koku-teaching now lands exactly as the
    **+3 koku** shows (reveal-as-plot); the ascension seal AND the rank-up seals all have the scrim now.
  - **Verdict: the macro-spine UI is solid** — the continuous ink grade-bar fills Good(⅓)→Excellent(full gold),
    the 3 D-055 silhouettes stay unnamed, the vermilion Ascend CTA appears only at Excellent. Clean & woodblock.
  - **One observation for the human (not a bug → R4#5):** after the T0→T1 ascension the influence panel still
    shows the stale T0 framing ("Reach Excellent to ascend 480/480") — that's the thin-T1-content edge (T1 isn't
    built), a depth/design call, NOT a visual fix to make unilaterally.

## 17 · M2·8 — DEMO/REAL fork RETIRED (D-056) — the human steered this in mid-loop

The human woke, asked if M2·8 was done, and clarified **"the DEV tools are permanent until the game is
complete."** That + **D-056** (a LOCKED ADR: *"Real D-049 pacing ships as the default; a DEV-only speed toggle
replaces the DEMO/REAL profile fork"*) removed the blocker I'd been deferring — retiring the fork is now
*executing a signed decision*, not making a new one. So I did it (the human said "continue the loop").

- **One shipped profile, re-derived to the LOCKED T0 targets.** `RUNG_METER_THRESHOLDS` collapsed from a
  `{demo,real}` map to a single `Partial<Record<RankId,number>>`: **R0 1100 (≈5-min cold-open, D-022) · R1 2150
  (≈10m) · R2 2600 (≈12m) · R3–R7 2800→3400** (a gentle ramp; the sim stops at the R3 combat gate). The pacing
  sim **verified R0=4.88 / R1=10.0 / R2=12.1 min** — dead on target. Review velocity now comes from the **DEV
  speed toggle** (kept), not a fast profile.
- **T0 is ≥30-floor-EXEMPT** (the reshape: "quick but not easy"; the ≥30-min/rank floor gates from T1). The
  pacing gate became a sane **T0 band [3,22] min** (`T0_PACING_BAND_MIN/MAX`) — RED-able, catches both
  DEMO-trivial (0.06m) and runaway-grind regressions. `pacing.test.ts` rewritten to it.
- **Fork plumbing removed across 14 files** — `BalanceProfile` type + `DEFAULT_BALANCE_PROFILE`, the
  `balanceProfile` GameState field (validate now drops a legacy save's stray field), `createInitialState(seed,
  profile)` → `(seed)`, the `?balance=`/`VITE_BALANCE_PROFILE`/localStorage boot resolver, the `__qa.setProfile`/
  `profile` DEV methods, the `--profile` CLI + `pacing:demo` script, the gen-docs demo/real columns, the
  verify-content drift guard. **DEV speed toggle + teleports KEPT** (the human's permanent review harness).
- **Tests that hard-coded the tiny DEMO act-counts** (e.g. "7 rakes = R1") were the only breakage — fixed by
  deriving the count from `rungThreshold` (the meter is flat-per-act, satiety-independent). m1/economy updated.
- **playcheck re-blessed** (the display `minutesPerRung` + the stale `combatWinCurve` from the earlier combat
  re-baseline now reflect reality; the gated hook/dead-time proxies were unchanged at 480ms). Docs regenerated.
- **Verified:** `npm run verify` GREEN (9 gates, 226 tests) + a headless smoke (`tmp/smoke-devtools.mjs`): kept
  DEV tools intact, `setProfile`/`profile` gone, `toRung('R1')` reaches R1 on the new threshold, **0 console errors.**
- **Liquid (D-059):** these are provisional magnitudes — the human tunes the final feel by playtest.

## 18 · OVERNIGHT — end-to-end T0-arc proof (the strongest "playtestable" guard)

The arc was proven in FRAGMENTS (ladder via forced flags, combat survival, pillars, ascension — each
isolated). Added **`src/core/t0-arc.test.ts`** — a single auto-pilot that drives the **real reducer** from the
cold open all the way to the T0→T1 ascension with **NO forced flags**, so it proves the *seams* hold: real
combat actually sets the flags the ladder gates on (`first-fight-survived` from the scripted wolf, `combat-blooded`
from a real grind fight), real Phase-2 labour actually banks Estate deeds to **EXCELLENT**, and the **ascension
fires to tier 1**. Policy mirrors the production auto-loop + reuses the shared `focusedOptimalIntent`. It runs the
**whole arc in 32 ms** (pure reduces) and is deterministic. RED-able: any dead-end (a rung that won't promote,
combat that won't blood, deeds that won't reach the gate, an ascension that won't fire) trips the guard. **231
tests green.** This is the capstone of the overnight loop — the v0.3 spine demonstrably CLOSES under real play,
not just teleports.

## 19 · OVERNIGHT — adversarial re-audit of the M2·8 build (the battery ran PRE-M2·8)

The fidelity battery ran before M2·8, so the build the human will playtest hadn't been audited as a whole since
the fork retirement. Ran a focused **3-lens adversarial-verification Workflow** (`wf_36ff18f2-f58`; raw snapshot
`project/brainstorms/raw/2026-06-30-v03-overnight-adversarial-verify.json`) over the overnight diff — **regression**
from the ~80× threshold jump, **test-integrity** of the new tests, **fidelity-vs-D-056 + laziness** — into a
convergence critic. **Verdict: the M2·8 build is functionally CLEAN.** All three lenses came back NEGATIVE on every
behavioral-regression probe: no phantom threshold magic-numbers, no teleport-guard blowout, no UI overflow at 1100+,
no dead-ended R7/ascension, no masked playcheck regression (re-bless only refreshed DISPLAY-only fields that never
enter the gated `evaluate()`), and the new t0-arc / save-round-trip / pacing tests are genuinely **RED-able** (not
vacuous). 16 raw findings → **2 real & actionable, all doc-hygiene, zero human-gated.** Applied all 3 (comment
truthfulness, no runtime change): the `validate.ts` comment falsely claimed a legacy `balanceProfile` is "dropped"
(the `...base` spread is additive-tolerant — it rides through inertly as harmless dead data; **caught by 2 lenses**)
→ corrected; a `pacing-report.ts` `//` comment had `${...}` template syntax that never interpolates → hardcoded
`[3,22]`; a `playcheck.ts` header still labelled `minutesPerRung` the "≥30-min floor" proxy → re-labelled (T0 is
floor-exempt now). verify GREEN. **The overnight v0.3 work is independently confirmed ship-quality.**

## 20 · OVERNIGHT — prod-build ship-readiness + a deploy-gate DEV-strip guard

The dev server works, but the **production build** (what a gh-pages deploy serves) hadn't been verified since M2·8.
Ran `npm run build` → **clean** (48 modules, 207ms; JS 81 KB / **gz 29 KB** — bigger than the old ~42 KB note,
which predates the v0.3 breadth+spine; still tiny + itch-ready). Verified **D-067's claim that the DEV tools are
prod-stripped is TRUE**: the `__qa` install is gated on `import.meta.env.DEV` (`main.ts:260`) so Vite
dead-code-eliminates it — the prod bundle has **0 occurrences** of `__qa`/`jumpToPhase2`/`jumpToAscension`/
`forceState`/`faceWolf`. So the human can deploy v0.3 for playtest with the DEV cheats safely absent.
- **Pushed the norm up to a GATE** (CLAUDE.md: gate > hook > norm): added a **ship-hygiene check to
  `src/scripts/gh-pages.sh`** (step 1b) — after the build, it greps the bundle for `__qa` and **refuses to deploy**
  if the DEV play-API leaked (a leaked `__qa` would ship speed-cheats + teleports to players). Tested both ways:
  passes the current clean bundle, aborts on a planted leak. verify GREEN.

## 21 · OVERNIGHT — breadth-seam e2e coverage (quest/market/map under real play)

The §18 t0-arc test proves the SPINE closes; the T0-M4 **breadth** was reducer-tested in isolation but not
proven to integrate with a real playthrough. Added **`src/core/breadth-arc.test.ts`** (3 tests) driving the
breadth via real intents from a combat-ready R3 state: (1) the **crop-raiders quest** driven to completion by
**real fights + labour** — `applyGrindFight('monkey'/'boar')` emit `kill:<mob>` and `do_activity('woodcut_edge')`
emits `gather:wood`, advancing the three order-free steps; the quest then **pays its 30 koku once** and **never
double-pays** (a replayed kill banks no further reward — `completed` stays a singleton); (2) the **market** as a
real capped koku-sink (8 buy attempts → exactly `stockCap`=5 land; koku −50, sansai +15); (3) the **walkable map**
(`move_to` crosses to an adjacent revealed node, refuses a non-adjacent hop). Proves the breadth seams hold WITHIN
the combat/labour spine, not just in isolation. **234 tests green.** Fast (3 ms) + RED-able.

## Landmines (current)
- **P4 no-stranding is a real BUG, not just a missing test** — fresh-L1/no-wood strands at Broken before L2 on
  8/8 seeds. The retune (durabilityMax / wear / XP-gap / starting-wood) must make the property hold, not just
  assert it.
- **HP-carry has THREE reset sites**, not one: loss-branch `fight.ts:112-115`, level-up `fight.ts:54`, AND rank
  promotion `ranks.ts:51-54` (verifier-found). All three full-heal — re-evaluate each against D-050.
- **DISPLAYED==TESTED is defined on the SAMPLED forecast** (analytic monkey@L1=0.447 is out-of-band; the band
  is on `foeForecasts` sampled=0.320). Don't "fix" combat against the analytic number.
- Dev server runs in background on :5174 (HMR) — restart after schema bumps if saved state breaks.

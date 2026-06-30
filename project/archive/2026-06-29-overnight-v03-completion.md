# Overnight v0.3 completion plan (session-19, autonomous)

> **Mandate (human, going to sleep):** implement the v0.3 plan — the **T0-M3 + T0-M4 roadmaps**; then
> **audit/review/battery** the whole v0.3 game for fidelity to the **PRD, human feedback, and the ADRs**; leave a
> **playtestable v0.3**; and **rewrite R1 → a T0 M0–M4 review** for manual playtesting. Self-paced overnight loop.

## Done before this plan (session-19, all verify-green, pushed up to the spine)

- **Movement 1 re-baseline:** gap report; P1 HP-carry/heal-by-eating (D-050); P2 no-stance-dominated; P4
  no-stranding; P5 koku flywheel; P8 SFX; P9 wear-axis; P1c auto-heal.
- **Movement 2 spine (CLOSES):** M2·1 schema · M2·2 R7 capstone · M2·3 pillars · M2·4 seasonal judge · M2·5
  ascension · M2·6 live-Estate UI (diverge). Proven by unit tests **and** a headless UI playthrough (tier 0→1).

## Remaining work — ordered for the night

### A. Verification report (in flight: wf `wf_6f92d6ba-ac9`)
Synthesize the roadmap-respect verification → the done-vs-remaining map. Snapshot raw + write to
`project/audit/reports/`. Commit.

### B. Finish T0-M4 breadth + Movement-1 0c remainder (the leaf modules are AUTHORED in `tmp/fanout/` + the raw
snapshot `project/brainstorms/raw/2026-06-29-v03-leaf-modules-authoring.json`; wire each into state/intents/render/index)
1. **P3 — found/crafted 2nd weapon** (T0-M2-F2/D-052): integrate `crafting.ts`; retire the `fight.ts` Lv2 axe
   grant; add material drops to enemies + a `craft_weapon` intent; **craft panel → DIVERGE**.
2. **P7 — mentor dialogue** (T0-M1-F3/D-039): integrate `dialogue.ts`; a `deliveredDialogue` state field; route
   Genemon's greet on the cold-open/R0 beat; **dialogue panel → DIVERGE**.
3. **T0-M4-F1 — first quest** (D-037): integrate `quests.ts`; quest state + a top-level **Quests tab**; accept/
   track intents; emit quest events from the fight/labour reducers.
4. **T0-M4-F3 — tiny market** (D-008): integrate `market.ts`; a `buy_item` intent + bought-count state; **market
   panel → DIVERGE**. (mentor lore-talk line rides on the P7 dialogue system.)
5. **T0-M4-F4 — walkable map** (D-065): integrate `map.ts`; a `location` state field + `move_to` intent; **map
   surface → DIVERGE**.
6. **T0-M4-F5 — stance & ability reveals**: reveal the stance slot + an ability/item slot one-per-beat (R5 /
   weapon-L10); touch-legible.
7. **P10 — doc reconcile**: roadmap.md "one-per-beat" wording → "reveal-per-promotion" (one line).

### C. M2·8 — retire the DEMO/REAL fork + DEV tools
Remove `BalanceProfile`/`?balance=`/the profile map; re-derive T0 thresholds to the single real D-049 profile
(T0 floor-EXEMPT — `pacing:check` must exempt T0). Add DEV `__qa.speed(mult)` + extend `toRung` into a true
jump-to-rung/tier teleport (DEV-only, prod-stripped). Re-derive `pacing`/`playcheck` baselines.

### D. The battery — PRD / human-feedback / ADR fidelity
Run the **`battery`** skill (multi-lens fresh-eyes stress-test) over the whole v0.3 build with lenses:
**PRD-faithful**, **human-feedback-faithful** (Block N + the decision-session + forks ledgers), **ADR-faithful**
(D-001…D-074), plus Fun/UI/Incremental. Adversarially grounded + de-duplicated → a scored report in
`project/audit/reports/`. Act on the top findings (verify-green commits).

### E. Hand-off for manual playtesting
- Refresh the QA gallery (`qa-shots.mjs`) + capture the new surfaces (Phase-2 spine, ascension, quests, map,
  market, craft) for the human to skim.
- **Rewrite R1 → a T0 M0–M4 review** (`project/human-in-the-loop/review.md`): the full cold-open→labour→combat→
  spine→ascension→breadth arc, how to drive it (`npm run dev` + `__qa`), the diverge R-items, what to judge.
- Bring `project/status/project-status.md` current; final journal entry; **checkpoint-push `main`**.

## Rules for the night
- Every commit `verify`-green; explicit-path staging only (**shared tree** — another agent may be active).
- DIVERGE for new UI surfaces (branch-preservation → folder-preservation here, D-073 — no `git switch` on a
  shared tree). Each integrated module needs a real test (milestone-integrity, D-054).
- Balance stays liquid (D-059). Spine-first already held (M3 closed before M4 breadth).
- Leave it resumable: this plan + the journal + project-status + the task list.

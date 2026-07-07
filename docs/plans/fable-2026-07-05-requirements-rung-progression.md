# Requirements-based rung progression (FB-121) — implementation plan

**Status:** 🔨 IN-PROGRESS (Fable session, started 2026-07-07) — design locked
2026-07-05.
**Build decisions (human, 2026-07-07):** flavor lines diverge as **per-rung
bundles** (8 bundles, 3 blind takes each, ADR-139); build **now, independent**
of the pending story-quality-ladder plan; Phase-2 sign-off is **async**
(reading-queue the t0-story section, keep building); **all phases in this
Fable session**.
**ADR:** ADR-137. **Source:** playtest capture FB-121 + the grilled brainstorm
[`project/brainstorms/2026-07-05-requirements-based-rung-progression.md`](../../project/brainstorms/2026-07-05-requirements-based-rung-progression.md).

## Who builds this — Fable or Opus?

**Confidence: ( 70% Opus, 30% Fable ).** The design is fully locked below, so
the build is careful execution against a spec — Opus territory. Judgment
concentrates in two places: **Phase 2** (the requirements grammar — a new FB-5
markdown dialect must stay small and not grow into a DSL) and **Phase 5** (the
sim's requirement-driving policy + band re-derivation — a wrong bot policy
silently re-signs pacing). If either fights back, route that phase to Fable
rather than improvising; everything else is Opus-safe.

## The locked design (what the human decided, 2026-07-05)

1. **Full replace.** The points model dies: `RUNG_POINTS_PER_ACT`, the
   `RUNG_METER_THRESHOLDS` table, `rungThreshold()`, and `state.rungMeter` are
   deleted, not wrapped. Each rung R0–R7 has a finite, authored list of
   **hidden requirements**, completable in any order. Progress = requirements.
2. **A requirement can be anything** internally consistent with the game and
   the story: counted acts ("rake 500 spilled rice"), one-shot event goals
   ("put down a boar" — the existing quest `'kill:boar'` tokens), economy /
   state predicates ("hold 200 mon"), story/social beats ("speak with the
   steward"). It is *not a score* — every requirement is a meaningful step of
   levelling within the rung.
3. **The player sees only a rounded percentage bar.** No checklist, no task
   list, no HUD of goals — you play, and play moves the bar. The bar renders
   whole integers only (55%, 56% — never fractional). A **counted** requirement
   updates the bar in **5–10 quantized chunks** across its span (incremental
   feedback without 500 micro-ticks); an **atomic** requirement lands its whole
   weight as one satisfying jump.
4. **Every completion gets flavor text** — a diegetic log line in the story
   voice ("The steward marks how the yard stays swept.") so the jump has a
   cause the player can feel (T3/T4) without naming a checklist item.
5. **100% alone unlocks the story gate.** `RankDef.storyGate` is deleted; any
   story precondition that mattered becomes a requirement IN the list. At 100%
   the rung beat unlocks (the existing ADR-110 hold: nothing advances until the
   player triggers + completes the beat), and the beat ends in the rung-up
   screen — the story explains *why* you were promoted.
6. **Pacing re-derives.** Requirements are authored for fun/fiction first; the
   FB-4 sim then measures the new time-to-rung and the band numbers re-derive
   from what the model actually produces (the current thresholds are not a
   constraint to preserve). Human sign-off on the new bands per ADR-056/ADR-059.
7. **Authored in narrative markdown** — a new `requirements.md` in the FB-5
   pipeline (`src/core/content/narrative/`), gen'd to `requirements.gen.ts`.
   Counts are tunable numbers in the md; **no balance.ts mirror** — the old
   cockpit rung-pacing sliders retire with the points model, and rung tuning
   becomes edit → `gen:narrative` → sim.
8. **Scope: all eight rungs (R0–R7) in one pass.** No half-migrated ladder.
9. **Deferred (parked, not designed here):** an optional player-facing hint
   system for when the hidden requirements get too opaque. A **DEV-only
   cheatlist** ships NOW (Phase 4) so the human can always see the live lists.

## Phases

### Phase 1 — pure-core requirements engine (TDD)

New `src/core/requirements-engine.ts` (mirroring `quest-engine.ts`'s pure
shape) + the requirement types. A requirement def is one of:

- `count` — N occurrences of an advance token (`'act:rake_rice'`,
  `'kill:boar'`, `'gather:wood'` — ONE token grammar shared with quests).
- `state` — a predicate over GameState snapshots (mon held, item owned),
  expressed in a tiny declared grammar with the FB-5 `native:` escape hatch for
  anything it can't say.
- `flag` — a story flag turning true (absorbs the old `storyGate` milestones).

State: replace `state.rungMeter: number` (`src/core/state.ts:160`) with a
per-requirement progress map for the CURRENT rung (reset on promotion, exactly
like the meter today). Selectors:

- `rungPercent(state): number` — **rounded integer 0–100**; counted reqs
  contribute quantized to ceil(span/chunks) steps (5–10 chunks per req, the
  chunk count derived, not authored); atomic reqs contribute all-or-nothing.
- `promotionReady(state)` — ALL requirements done (replaces meter ≥ threshold
  AND storyGate in `src/core/ranks.ts:28-46`).

Glue per AC-20: labour/fight/economy reducers already emit quest advance tokens
(`src/core/fight.ts:131`); requirements consume the SAME stream through shared
glue — never reducer→reducer. Audit `RankDef.eligible` consumers: it currently
feeds only `accrueRungMeter` (which dies) — keep it only if the UI/act
availability still reads it; delete if orphaned.

**DoD:** engine unit tests (fixtures derived from the gen'd registry, never
magic numbers); `applyPromotion` reset behavior proven; the R2
`first-fight-survived` special-case in `src/core/autoplay.ts:147` reworked.

### Phase 2 — the `requirements.md` grammar + gen + authoring

Extend `src/scripts/gen-narrative.ts` with `requirements.md →
requirements.gen.ts` (spec added to the narrative README, byte-compare gate as
with the other four files). Grammar sketch (keep it THIS small):

```markdown
## rung R0 · requirements
### req rake-100 · count act:rake_rice 100
flavor: Genemon counts the swept rows without a word.
drive: rake_rice
### req steward-word · flag steward-spoken
flavor: The steward marks how the yard stays swept.
drive: talk steward
```

`drive:` is a machine-readable hint for the Phase 5 sim bot (how a bot
satisfies this requirement) — part of the grammar from day one so authoring
and simulability can't drift apart. Real logic beyond the grammar uses
`native:` per FB-5, never a grammar extension.

Author all eight lists (R0–R7), internally consistent with the existing story
(R0 stays rake-centred per the human's worked example; R2 absorbs the
`first-fight-survived` gate as a requirement; R3+ lean on combat/economy/quest
tokens). Also compile the lists into `docs/content/t0-story.md`'s reading
script — that section is the human's **sign-off artifact** for the authored
lists (reading-queue it when it lands).

**DoD:** `gen-narrative --check` gate green; all 8 lists authored; the
t0-story section renders readable prose.

### Phase 3 — wire the model through ranks/intents/saves/fixtures

- `src/core/ranks.ts`: `accrueRungMeter` → requirement advance; delete
  `storyGate` from `RankDef` (`content/ranks.ts:27` + all 8 rank entries);
  `rungProgress()` returns the percent read.
- Save migration: version bump; old saves' `rungMeter` drops (progress within
  the current rung restarts — acceptable, note in CHANGELOG on ship).
- `src/fixtures/specs.ts` waypoints that drive to rung boundaries re-derive
  automatically (they drive the REAL engine) — `fixtures:regen` + eyeball.
- `src/sim/personas.ts` + `src/core/autoplay.ts` consume `promotionReady`.

**DoD:** full `pnpm run verify` green; `save-smoke.mjs` passes migration.

### Phase 4 — UI: the % bar, flavor lines, DEV cheatlist

- `src/ui/render.ts:673-691` (rung-head): fill = `rungPercent`; the
  `.rung-head-card` readout drops `476/1100` for the rounded percent; the
  "meter full but story blocked" cue state dies with the AND-gate (100% IS
  ready — cue shows "Answer the summons ›" as today).
- Flavor lines: requirement completion emits a story-channel log line (the
  authored `flavor:`), through the same log path the reducers use.
- **DEV cheatlist** (DEV panel, `import.meta.env.DEV`, strip-gated like the
  Scenarios tab): the current rung's full requirement list with live
  progress — the human's debugging window; NOT a player surface.
- **Not a ADR-075 diverge** — the bar stays a bar (same surface, new data
  source); this is below the "majorly restyled" bar. The **taste-scorecard
  two-pass (FB-10) still fires**; Pass 1 brief: T1 one home (the rung-head stays
  the single progress surface), T2 no ground-yank (the bar transitions, never
  resets mid-watch; quantized steps mean it only ever moves forward), T3 the
  fiction causes it (flavor line lands WITH the jump), T4 no guessing (every
  jump has a visible cause in the log; rounded % is the single number).

**DoD:** capture-game-states screenshots of R0 start → mid → 100% → beat;
Pass 2 scorecard attached to the HR-item.

### Phase 5 — sim rework + band re-derivation (ADR-132)

- **Step 0 (FB-8):** read `project/telemetry/` reports first; quote
  attended-vs-sim for R0–R2 in the commit body.
- `src/scripts/balance-sim.ts` + the autoplay policy complete requirements via
  their `drive:` hints (the greedy/casual personas map a hint to an intent
  sequence). The `rungThreshold`-moved guard (`balance-sim.ts:293`) rewires to
  the new lever (an authored count moved outside signed intent).
- Run the sim → **re-derive** the per-rung band numbers from measured
  time-to-rung; the human signs the new bands (HD-item if they shift far from
  today's R0≈5min / climb≈10–15min targets, else note-and-proceed per R4/ADR-059).
- `pnpm run verify:balance` + `pnpm run balance:report`; commit the regenerated
  `docs/content/t0-pacing.md` with the change; paste `balance-sim --summary`.

**DoD:** verify:balance green against the re-derived bands; pacing doc diff
committed with the sim summary in the commit body.

### Phase 6 — tier tests (ADR-088)

- Update the T0 full-arc e2e to climb via requirements (it must break if the
  glue drops a token — could-go-RED, R3).
- Invariants test: percent is monotonic within a rung, always an integer in
  [0,100], resets to 0 on promotion, and 100 ⟺ promotionReady.

**DoD:** both named tests resolve in the milestone-integrity gate.

### Phase 7 — docs + PRD ripple (explicitly in-scope per the human)

- **ADR ADR-137** (lands with this plan) — the design record.
- **PRD:** run `/prd-ripple` — this is a **system change**: §3.2.1 / §4.1.1 /
  FU6 / FU7 (the rung-meter + AND-gate language) get a targeted ripple;
  `pnpm run prd:drift` + `gen-prd-regions` afterwards.
- `docs/living/ui-design.md` §5.3 (the distance-to-next-gate read) → the
  rounded-% read + flavor-line pattern.
- `docs/living/fun-factor.md` if the hidden-requirements loop earns a line;
  `docs/living/roadmap.md` slice status; brainstorm already carries the grill
  record. CHANGELOG section on the ship that carries it.

**DoD:** prd:drift clean; no doc references `rungThreshold` /
`RUNG_POINTS_PER_ACT` outside history/archive.

## Phase-3 cutover worksheet (surveyed 2026-07-07 — the atomic commit's touch list)

Every consumer of the dying model, from a full-tree grep; the cutover lands as
ONE verified commit (plus test-fixture re-derives):

- `state.ts:160,223` — `rungMeter: number` → `rungReqs:
  Readonly<Record<string, number>>` (init `{}`).
- NEW `core/progress-events.ts` (AC-20 glue) — `applyProgressEvent(state,
  token)` = quests + requirements advance + flavor narration lines;
  `settleRequirements(state)` for the atomic (state/flag) pass at the reduce
  tail.
- `core/ranks.ts` — delete `accrueRungMeter`; `rungProgress` → `{percent,
  ready}` via the engine; `applyPromotion` resets `rungReqs: {}`.
- `content/ranks.ts` — delete `meterThreshold` + `storyGate` + `advanceHint`
  (the "meter full but blocked" cue dies — 100% IS ready). KEEP `eligible`
  (balance-sim §61 + the interim autoplay still read it; re-audit in Phase 5).
- `intents.ts` (CONTESTED — after the economy WIP lands) — both
  `accrueRungMeter` sites → `applyProgressEvent('act:…')`; `gather:` /
  `kill:` quest-token sites route through the same glue; `repair_weapon`
  emits `act:repair_weapon`; settle pass at the reduce tail.
- `fight.ts:132` — `applyQuestEvent` → `applyProgressEvent`.
- `autoplay.ts` — R2 special-case (§147) + `cheapestEligibleGlobal` →
  requirement-driven: unfinished `count act:*` → walk-to + do that labour;
  the R2 flag req → `face_wolf`; `kill:*` → walk-to + fight (R3+); state-pred
  driving stays Phase 5 (harness reach today is R0→R3, act/flag/kill only).
- `personas.ts:270` + `fixtures/specs.ts:156` — "meter full → wolf" reads →
  "only the flag req remains".
- `playcheck.ts:80,86`, `sim/metrics.ts:138,179`,
  `telemetry/milestones.ts:89-91` — meter reads → `rungPercent` (milestone
  "meter-full moment" = percent hitting 100).
- `persistence/validate.ts:190,266` — SCHEMA_VERSION bump; migration drops
  `rungMeter`, seeds `rungReqs: {}`.
- `render.ts:692,1338,2661` — percent fill + drop the `476/1100` readout;
  advanceHint branch dies; the rake-auto reveal (§2661,
  `RAKE_AUTO_REVEAL_METER`) re-keys on the rake req's count progress.
- `dev-cockpit.ts` — retire the Rung-pacing slider group (§200-256, §585) per
  the locked design; the Phase-4 cheatlist replaces the readout.
- `balance.ts` (CONTESTED) — delete `RUNG_POINTS_PER_ACT`,
  `RUNG_METER_THRESHOLDS`, `rungThreshold` + their cockpit getter cases.
- `verify-content.ts:58-62` — delete the threshold-mirror check.
- `pacing-report.ts` + `balance-sim.ts:50,61,293` — compile-true rework
  (percent targets); the real sim policy + band re-derive stays Phase 5.
- `gen-docs.ts:71` — the t0-content rank table drops meterThreshold (regen).
- `core/index.ts:106` — export swap. Tests importing `rungThreshold`
  (`economy.test`, `m1.test`, `rung-beats.test`, `pacing.test`,
  `invariants.test`, `dev-cockpit.test`, `render.test`,
  `sim/pacing-envelope.test`, `save.test`, `milestones.test`) — re-derive
  fixtures from the gen'd registry.

## Sequencing & landmines

- Phases run 1→7; 2 can start alongside 1 (grammar spec needs the type shapes
  early — agree the registry interface first).
- **Biggest risk is Phase 5**: a bot that can't satisfy a requirement reads as
  a pacing regression when it's a policy gap. The `drive:` hint in the grammar
  exists to kill this class; if a requirement can't state a drive hint, it
  probably shouldn't be authored yet.
- The old model is load-bearing in tests: `economy.test.ts`, `m1.test.ts`,
  `rung-beats.test.ts` import `rungThreshold` — re-derive their fixtures from
  the new registry (never freeze old numbers into them, ADR-086).
- Shared tree: this touches high-traffic files (`render.ts`, `balance.ts`,
  `ranks.ts`) — coordinate via project-status before starting while the UI-v2
  Andon migration plan is live (it owns `render.ts` restyling; this plan
  changes the rung-head's DATA, that one its LOOK — land whichever goes
  second as a rebase-aware pass).
- Old saves lose in-rung progress at migration — deliberate, note it.

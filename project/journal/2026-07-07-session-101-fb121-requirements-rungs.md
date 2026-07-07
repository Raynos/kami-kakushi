# Session 101 — 2026-07-07 — FB-121 requirements-based rung progression (build)

## ☀️ SUMMARY (read this first)

Building the LOCKED plan
[`docs/plans/fable-2026-07-05-requirements-rung-progression.md`](../../docs/plans/fable-2026-07-05-requirements-rung-progression.md)
(ADR-137): the points/meter model is replaced by authored hidden requirement
lists per rung, a rounded-% bar, flavor lines, and re-derived pacing bands.
Four build decisions locked by the human at session start (recorded in the
plan's header): per-rung flavor diverge bundles (ADR-139), build now
independent of the story-quality-ladder plan, async Phase-2 sign-off, all
phases in this Fable session. Live snapshot: `project/status/project-status.md`.
This file is HISTORY, not live state.

Shared-tree note: the Phase-2 economy redesign build is running IN PARALLEL in
another session — Phase 5 here (balance-sim + bands) re-derives against
whatever economy has landed by then; contested files rebase-aware.

---

## 1 · Phase 1 — pure requirements engine (TDD)

- `src/core/requirements-engine.ts` — NEW: the pure engine mirroring
  quest-engine's shape. Requirement defs (`count` token/target, `state`
  tiny-grammar predicate + `native:` escape hatch, `flag`), latching progress
  map, `advanceOnToken` / `settleOnState` (both return what completed, so
  flavor fires exactly once), quantized `rungPercentOf` (equal weight per req;
  counted reqs step in derived ≤10 chunks; integer 0–100 with a 99-clamp so
  100 ⟺ ALL done), `chunkCount` derived never authored.
- `src/core/requirements-engine.test.ts` — NEW: 7 engine-contract tests
  (synthetic defs on purpose — content-derived fixtures come with the gen'd
  registry in later phases): token routing + no-op identity, complete-once
  latching, state/flag settle + no-regression latch, quantized monotonic
  integer percent, the 99-clamp (a 20-req list where rounding WOULD lie),
  chunk derivation, loud unknown-native error.

## 2 · Phase 2 — the `requirements.md` grammar + gen + authored lists

- `src/scripts/narrative/parse.ts` — `## requirements R<n>` block kind +
  `### req <id> · <spec>` entries; the CLOSED spec grammar (`count`, `flag`,
  `state resource|banked|belonging|skill`, `native`) parsed by `parseReqSpec`
  with authoring-line errors; `flavor:`/`drive:` annotations (both required by
  the structural floor).
- `src/scripts/narrative/emit.ts` — `emitRequirements` → the
  `RUNG_REQUIREMENTS` registry literal (NAMES interpolation in flavor lines).
- `src/scripts/narrative/validate.ts` — exactly-eight-rungs completeness, no
  dup lists/req-ids, flavor text resolution.
- `src/scripts/narrative/story-doc.ts` — t0-story.md gains "The hidden rung
  requirements" (flavor first, mechanics as small print) — the human's
  sign-off artifact, reading-queued.
- `src/core/content/narrative/requirements.md` — NEW: all 8 lists authored
  (R0 rake-centred; R2 absorbs `first-fight-survived`; R3+ combat/economy;
  R6 exercises the `native estate-u1` hatch; counts scaled to the old meter's
  act-equivalents, sim-tuned in Phase 5). Draft flavor lines — the ADR-139
  per-rung diverge bundles run as a later pass (human call: bundles, async).
- `src/core/content/requirements.ts` + `requirements.gen.ts` — the wrapper +
  generated registry; `NATIVE_PREDICATES['estate-u1']` in the engine.
- Tests: `src/scripts/narrative/requirements.test.ts` (grammar contract) +
  `src/core/content/requirements.test.ts` (registry-consistency invariants —
  every count token resolves to a reducer-emitted token, every predicate to
  real vocabulary; derives from ACTIVITIES/MOBS/BELONGINGS/SKILLS/RANKS).

**Shared-tree hold:** the parallel economy build has uncommitted WIP in
`intents.ts`/`pillars.ts`/`balance.ts` (tree-red typecheck). Phase 2 commit
waits for their green; the Phase 3 cutover waits for their `intents.ts`/
`balance.ts` to land (pathspec commits sweep whole files — no interleaving).

## 3 · Phase 3 — the atomic cutover (the points meter dies)

Landed as ONE commit (all 854 tests green): `state.rungMeter` →
`rungReqs` map (SCHEMA_VERSION 8, v7→v8 migration drops in-rung progress —
deliberate); `progress-events.ts` NEW (AC-20 glue: one token stream → quests +
requirements + flavor narration; settle pass at the reduce tail);
ranks.ts percent/ready reads (+`remainingRequirements`); `RankDef` loses
meterThreshold/storyGate/advanceHint (eligible KEPT — sim/autoplay pool);
balance.ts loses RUNG_POINTS_PER_ACT / RUNG_METER_THRESHOLDS / rungThreshold +
cockpit rung sliders retired; intents/fight route through the glue
(`act:`/`gather:`/`kill:` + `act:repair_weapon`); autoplay + idler persona are
requirement-driven (incl. state-pred drivers pulled forward from Phase 5 —
sell/deposit/buy/improve + a mend-to-full + level-ladder fight policy); render
% bar; ~10 test files re-derived from the gen'd registry.

**Finding 1 — combat walls (kills parked above R3).** Sim-measured: wolf
≈0.2% in-loop win rate (2,978 fights → 5 wins; satiety/durability decay
collapses the probe's 5–23%), bandit 0% at every T0 level, the axe recipe
needs boar-dropped hardwood (chicken-and-egg). The R4–R7 predator-kill reqs
were walls for real players too → PARKED (noted in requirements.md); kills
stay only at R3 (rats/monkey, measured fine). The fiction returns when combat
tuning matures.

**Finding 2 — counts sim-tuned to the signed bands.** After parking, the climb
was 44min vs Phase-2 80min (ratio 1.8 RED) → counts re-scaled: R0 4.5 / R1 9.5
/ R2 10.6 / R3 10.7 / R4 12.7 / R5 10.8 / R6 10.3 min (all in [3,22]); ratio
1.15 (in [0.8,1.2]). Formal ADR-132 re-derive + report still owed (Phase 5).

Also: playcheck's dead-time wealth proxy widened to wood/sansai (450-woodcut
requirement stretches read as "dead" while the player watches +3 wood land
per act); the worn-weapon fixture stores its wood pile before grinding to
Battered (the new climb arrives wood-rich).

## Next intended steps

1. Phase 2 — `requirements.md` grammar in gen-narrative (parse/emit/validate),
   author all 8 rung lists, registry `requirements.gen.ts` + t0-story section
   (reading-queue it).
2. Phase 3 — the full cutover: state field swap (`rungMeter` →
   `rungReqs`), ranks.ts rewire, delete `storyGate` + points constants, save
   migration, fixtures regen.
3. Phases 4–7 per the plan.

## Landmines

- The state cutover CANNOT land halfway — `rungThreshold` has ~27 consumer
  files; the delete + rewire goes in one verified commit (plan: no
  half-migrated ladder).
- Flavor completion lines: permanent `narration`-channel, `narrator` voice
  (log channels are `narration|reward|combat|system|milestone` — no dedicated
  story channel; rung beats use narration too).

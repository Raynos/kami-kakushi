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

## 4 · Phases 4–7 — UI, sim verdict, tier tests, docs

- **Phase 5 verdict committed** (5979fb4): t0-pacing regen; all rungs in
  [3,22], ratio 1.15 in [0.8,1.2] — note-and-proceed, no HD-item. FB-8 step 0:
  no usable untainted rung telemetry (all short DEV sittings).
- **Phase 6** (3e19f35): percent invariants over the real arc (integer,
  monotonic-within-rung, count-reset on promotion + the legitimate atomic
  pre-latch, 100 ⟺ ready).
- **Phase 4**: DEV **Rungs cheatlist** tab (e6d5baf); five capture-game-states
  waypoints in `project/audit/screens/2026-07-07-fb121-requirements/`
  (git-ignored, local); **HR-12** filed with the Pass-2 scorecard (16✔/0✘/5—,
  P16 routing judgment flagged) (89d3121).
- **Phase 7**: PRD ripple — §3.2.1 trigger mechanism → requirement lists
  (fiction table kept as intent), §4.1.1 superseded-for-T0 banner (threshold
  model stays T1+ frontier), 01-vision Phase-1 mechanism ×4 sites, 06-tech
  core/ranks + state rows; ui-design §5.4 (the % read); fun-factor §2.2 (the
  bar is a requirement read). `prd:drift` CLEAN; gen-prd-regions in sync.
  ADR-137 pre-existed (design lock) — no new ADR needed.

## 5 · The ADR-139 flavor diverge (blind takes → per-rung picks)

Three blind agents (distinct briefs: A the-house-notices · B the-work-speaks ·
C a-word-let-drop, none saw canon or each other) each authored all 23 lines;
self-picked PER RUNG (the human's bundle call): R0 C · R1 A · R2 B · R3 C ·
R4 A · R5 A · R6 C · R7 C — spoken registers land where a granter leans in.
Canon-order slips in the blind takes (Tōzō/Kihei/Chiyo observed before their
story introduction) disqualified per line. Picks transcribed to canon
(4f01080); bundle + alternates in
`project/human-in-the-loop/fb121-flavor-takes.md` (**HR-13** — incl. the
flagged live-swap deviation).

## 6 · Live review session — HR-12/HR-13 closed + the DEV review surface hardened

The human reviewed live in-session. Outcomes, in order:

- **HR-12 CLOSED** (signed as-is; flavor stays Story/narration — the P16 call).
- **R0 experience gap → STAGED MILESTONES** (human spec: rake 100/200/500):
  same-token count reqs complete cumulatively; all long stretches staged; 8
  early-stage lines authored in the picked registers (7b1d850).
- **≥3 requirements per rung, HARD** — gen-narrative validator ERRORS +
  registry test + a could-go-RED validator test (same commit).
- **t0-story signed** (read = sign-off) → reading queue cleared.
- **Review-surface rules (feedback, memorised):** no ad-hoc files in
  `project/human-in-the-loop/` (queue only — the stray bundle doc deleted);
  ALL narrative diverges review LIVE in the DEV menu (doc-only is not a
  review) — takes/README + narrative-diverge SKILL + AGENTS.md now say so.
- **The wiring built** (0952280 → 55ba8bf): req-flavor takes swap through a
  CORE overlay (`__setRequirementFlavorOverride`, the balance-lever pattern —
  future emissions only, T2); ONE explore page per diverge (openStoryReader
  takes a single bundle); per-unit override pills moved onto the explore page;
  canon pill labeled via new `canon:` bundle meta; the FB-121 page groups
  per-rung in registry order with canon-only rows shown.
- **HR-13 CLOSED** — canon locked as picked; the fb121-req-flavor bundle dir
  pruned per the takes contract (b183e73).

## Next intended steps

1. FB-121 is FULLY CLOSED: build ✅ · HR-12 ✅ · HR-13 ✅ · t0-story signed ✅ ·
   pushed ✅. Nothing in-flight.
2. The one FB-121 residue: the parked R4+ predator-kill requirements — they
   return when the combat curve is retuned (wolf ≈0.2% in-loop, bandit 0%;
   candidate for its own plan).
3. Elsewhere: the story-quality-ladder plan awaits the human's read; HR-1/2/
   5/6/7/8/9/11 remain open in the queue.

## Landmines

- The state cutover CANNOT land halfway — `rungThreshold` has ~27 consumer
  files; the delete + rewire goes in one verified commit (plan: no
  half-migrated ladder).
- Flavor completion lines: permanent `narration`-channel, `narrator` voice
  (log channels are `narration|reward|combat|system|milestone` — no dedicated
  story channel; rung beats use narration too).

# Session 69 — 2026-07-04 — F4 Ph1: persona-bot balance sim (harness + greedy + report)

**Summary:** Built F4 Phase 1 (`fable-process-F4-balance-sim-gates.md`): the
`src/sim/` harness, the greedy-grinder persona (the shared
`focusedOptimalIntent` extended with the real R3 combat leg — real `fight`
intents through the spatial + `tab-combat` gates, no `applyGrindFight`
shortcut), the RunMetrics collector, and the generated
`docs/content/t0-pacing.md` report. All Ph1 DoD checks pass via
`npm run balance:selftest`: greedy's R0–R2 buckets equal `walkPacing()`
EXACTLY on seed 20260626 (550/59/1, 1075/175/0, 1300/213/1), same-seed runs
are byte-identical, and the full arc ascends (tier 0→1) on all five
`SIM_SEEDS`. The human confirmed the plan's §8 defaults before the build:
Phase-2 band report-only + H-item, `--check-fresh` as a pre-commit WARN
first, shared-file edits deferred behind the F3 agent's in-flight work, all
four phases autonomous.

## What changed

- `src/sim/seeds.ts` — `SIM_SEEDS` (canonical 20260626 + 1/7/11/13) +
  deterministic `fuzzSeeds` via the core's `deriveDayKeyed`.
- `src/sim/personas.ts` — the `Persona` contract, the `ALL_INTENTS`
  compile-time exhaustiveness map (`satisfies Record<IntentType, true>` —
  a new intent type goes RED in tsc until mapped), the skip-list helper,
  and the greedy persona (readiness sub-policy: repair on Battered/Broken,
  cook under half HP, rest below the STAMINA_FLAT_ABOVE knee, then fight
  the monkey until `combat-blooded`).
- `src/sim/metrics.ts` — `RunMetrics` + the collector: per-rung
  walkPacing-compatible buckets PLUS all-dispatch intent counts (the
  truthful wall model), economy samples/first-coin/Phase-2 window, combat
  W/L/R + loss bleed, starvation/durability counters, and the
  max-intents-without-progress number the Ph3 soft-lock detector will be
  calibrated against.
- `src/sim/run.ts` — `runPersona` (real `createInitialState` + `reduce`
  loop, 1M-intent guard).
- `src/scripts/balance-sim.ts` — CLI: table · `--report` · `--selftest`
  (the machine-checkable Ph1 DoD) · `--fuzz N` (structural-only).
- `docs/content/t0-pacing.md` — the generated report, committed (regen is
  idempotent; diffing it IS the before/after of a balance change).
- `package.json` — `balance:sim` / `balance:report` / `balance:selftest`.
- `project/status/project-status.md` — checkpoint regen (resume-journal
  region → this file).

## Findings (the report's day-one signal)

- **The Phase-2 anticlimax is REDISCOVERED** (the credibility test): the
  capstone→ascension window is ~48 intents ≈ 0.4 modeled minutes against
  an ~84-min full arc — matches the economy balance-watch's finding.
- **Greedy never earns coin** (first-coin = never, end coin 0): the
  optimal rung path is farm_paddy-only; the whole coin economy (haul,
  sell_rice, market, estate stages) is off the optimal path. Expected for
  a meter-optimal bot, but a real breadth gap the explorer persona (Ph3)
  will cover.
- **The blooding fight was LOST on all 5 seeds** (~29% win forecast;
  0.71⁵ ≈ 18% — plausible, worth re-checking when idler/explorer land),
  bleeding ~1739 carried rice per run (the D-113 loss bite).
- Matrix runtime is a non-issue: 5 full-arc runs ≈ 0.3 s (the plan's
  ~15–30 s estimate was ~100× conservative) — the Ph2 gating matrix and
  the vitest tripwire have huge headroom.

## Next intended steps

1. Ph2 — `envelopes.ts` (bands from `balance` only), `--check` gating
   matrix, `--check-fresh` fingerprint, the slim vitest tripwire, margins
   beside every band; DoD: RED-able via a local R5-threshold flip.
2. Ph3 — extract `autoModeIntent`, idler + explorer, soft-lock detector.
3. Ph4 — pre-commit WARN, `--summary`, docs/ADR/H-items, archive the plan.

## Landmines

- The F4 plan's Status line still reads 📋 PROPOSED: flipping it stales
  the `active-plans` gen-region, whose regeneration would sweep the F3/F2
  agent's UNCOMMITTED archival move into my commit (the committed-red
  trap). Flip it + regenerate once the co-agent's F2 archival lands.
- `docs/plans/README.md`, `project/todo-human.md`, the F2 plan
  deletion/archive copy, and `project/playtest-inbox/` are the co-agent's
  in-flight WIP — left strictly untouched.
- The greedy persona's readiness knobs (`GREEDY_MEND_HP_FRAC` etc.) are
  PLAYER-MODEL knobs, not canon — envelopes must never fixture on them.

---

## 2 · Ph2 + Ph3 (same session, appended)

**Ph2 — envelopes + gates.** `src/sim/envelopes.ts` (bands read from
`balance`/`RANKS` only — zero magic numbers), `balance-sim --check`
(= `npm run verify:balance`: greedy per-rung bands with min/max margins
printed beside every band + structural gates for every persona × seed +
freshness), `--check-fresh` (= `npm run balance:fresh`: a sorted-JSON
sha256 of the EVALUATED design inputs — balance exports, RANKS
thresholds, ACTIVITIES/MOBS/WEAPONS/ESTATE_STAGES/market/recipes — vs the
report header; values not text, so comments never fire it), and the slim
vitest tripwire `src/sim/pacing-envelope.test.ts` (~40 ms in-gate).
**RED-ability proven live:** flipping `RUNG_METER_THRESHOLDS.R5` 3100→9300
turned the gate, the tripwire AND the freshness check RED, each naming R5
(43.4 min vs [3, 22]); reverting restored green. All current climb rungs
sit IN band with visible margin — the only day-one finding is the known
Phase-2 anticlimax → **H19** filed (recommend deferring the band until the
Phase-2 redesign); **H20** filed (WARN→gate promotion, parked per plan).
Matrix runtime 1.0 s (target <30 s); `verify:budget` median 3.32 s.

**Ph3 — idler + explorer + soft-lock detector.** Extracted the app loop's
inline auto-mode decision into the pure `autoModeIntent` in
`core/autoplay.ts` — `main.ts`'s `autoStep` is now DOM-guards + dispatch
only, and the idler consumes the SAME function (the focusedOptimalIntent
no-desync move). The idler arms `set_auto_rake`/`set_auto`/
`set_auto_combat` at sparse check-ins and otherwise replays the shipped
auto-loop verbatim; the explorer prefers any legal never-yet-issued
(type, payload) pair in fixed registry order (topics, nodes, every verb),
falling back to greedy. **Contract deviation (self-picked):**
`decide(s, issued)` — the runner passes the issued-key digest, because
GameState deliberately doesn't store intent history and a stateful
persona would break reproducibility. Soft-lock detector:
`SIM_SOFTLOCK_INTENTS = 500` (~45× the worst green ceiling — measured
maxNoProgress: greedy 3, idler 4, explorer 11), proven to fire on a
manufactured stall in `src/sim/sim.test.ts` (which also pins the
autoModeIntent decision order — the extraction's equivalence proof — and
idler/explorer determinism). All 15 gating runs green; all 660+11 tests
green.

**Report findings (all three personas):** idler ascends in ~84.2 min
(nearly identical to greedy's 83.9 — auto-modes are that close to
optimal); explorer ~81.7 min, is the ONLY persona to touch coin (3 682
end coin, first coin at 5.1 min), and loses 3 fights (wolf/boar tastings)
bleeding 3 511 coin + 4 484 rice. Blooding-fight losses on all seeds for
all personas remain a watch item.

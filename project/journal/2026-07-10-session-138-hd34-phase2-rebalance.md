# Session 138 — 2026-07-10 — HD-34 ruled & applied: Phase 2 back to ≈1:1, idler promise re-signed

**Summary:** The human ruled HD-34 (both recommended options via AskUserQuestion):
Phase 2 re-tunes to the signed ≈1:1 law and "an idler ascends T0" is NOT a design
promise. Applied as **ADR-170** — `ESTATE_DEED_PER_ACT` 0.05 → 0.22 (ratio
[0.84–1.17] ∈ [0.8, 1.2]; greedy T0 ≈ 22 h → ≈ 8 h wall), the sim gains per-persona
promises ('ascend' | 'ladder'), the ADR-148-interim ratio-gate suspension is lifted,
and the R3-band remainder is filed as **HD-35**.

## What changed

- `src/core/content/balance.ts` — ESTATE_DEED_PER_ACT 0.05 → 0.22 (ADR-170 note in
  the doc comment); sim-verified against the ratio band.
- `src/sim/personas.ts` — `Persona.promise?: 'ascend' | 'ladder'`; idler declares
  `'ladder'` (Phase 2 is attention-priced — ascension deliberately not its promise).
- `src/sim/run.ts` — a 'ladder'-promise run ends CLEANLY on reaching the top rung
  instead of burning 1M intents to the runaway guard (verify:balance 15+ min → 0.9 s).
- `src/sim/metrics.ts` — `finish()` touches the final rung so a run that ends on the
  promoting intent still shows R7 to the fullLadder verdict.
- `src/sim/envelopes.ts` — `phase2RatioVerdict` now measures the ADR-148 TIMED wall
  (R7 residence / climb wall; the old wall≈intents shortcut died with timed actions);
  `structuralVerdict(m, promise)` is promise-aware; interim note updated (ratio gate
  re-enabled, R3–R6 band scope → HD-35).
- `src/sim/pacing-envelope.test.ts` — the real-arc ratio assert RE-ENABLED (was
  .skip since ADR-148 interim); ratio stubs rebuilt wall-based.
- `src/sim/sim.test.ts` — idler determinism test re-enabled under the ladder promise
  (asserts fullLadder + NOT ascended + byte-identical).
- `src/scripts/balance-sim.ts` — structural check + report honor the promise (the
  idler row prints "— ladder ✓ (ascension not promised)", not a RED-looking ❌);
  Phase-2 window prints in timed wall-min.
- `docs/content/t0-pacing.md` — regenerated (the diff IS the before/after: greedy
  1347→443 min, Phase 2 1144→237 min; idler 1M-guard rows → clean ladder closes).
- `src/fixtures/saves/pre-ascension.json` + `wealthy-idler.json` — regenerated (the
  deed retune moves the engine-driven waypoints).
- `docs/living/decisions.md` — **ADR-170** appended.
- `project/human-in-the-loop/decisions.md` — HD-34 resolved & removed; **HD-35**
  filed (restore R3–R6 band verdicts — R3's timed wall ~146–221 min vs [3, 22]).
- `project/human-in-the-loop/archive.md` — HD-34 row added.
- `project/feedback-human/2026-07-10-hd34-phase2-rulings.md` — verbatim rulings.

## Verification

- `verify:balance` GREEN (3 personas × 5 seeds, 0.9 s): ratio [0.84–1.17] in band,
  all structural gates ✓, report fresh.
- Full vitest suite: 83 files / 1018 tests pass (ratio + idler tests re-enabled).
- `fixtures:check` green after regen.

## Next intended steps

1. HD-35 sits with the human (feel R3 on the live build first — it's ~10× over the
   [3, 22] band in timed wall).
2. B8 stays no-action; mechanism options remain if the human's play feels the free
   season-turn refill cheap.

## Landmines

- Session 137 (telemetry retention) is a CO-AGENT in this shared tree — this session
  committed strictly by pathspec around its uncommitted telemetry/capture edits.
- The idler's pacing report rows now END at reaching R7 (that's the promise) — its
  R7 row shows 0 intents by design; don't read that as a missing measurement.
- ESTATE_STAGE_DEED_GATES were untouched: U-stage build beats now arrive ~4.5× sooner
  in wall terms, consistent with the re-signed ≈1:1 Phase 2 — but if a future feel
  pass wants the U-beats spread across Phase 2, that's a separate (sim-owned) tune.

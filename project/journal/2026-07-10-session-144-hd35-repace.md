# Session 144 — 2026-07-10 — HD-35: re-pace R3/Phase-2 into band, full-ladder verdicts live

**Summary:** The human ruled HD-35 **(a) re-pace** — and widened it: "re-pace
R0–R7 and update the verify script so it can verify R0–R7 and it shouldn't go
red." Two fork asks locked the shape (R7 stays on the ADR-133 ratio law, not the
per-rung band; any lever with the night-watch fiction intact). A throwaway
per-intent wall breakdown (`tmp/r3-wall-breakdown.ts`) showed R3's 163 min was
**not** the fights (0.8 min) but the life-support loop around them — 526 cooks
(70 min), 379 walks (32 min), 158 forages (21 min) — and R7's 237 min was the
ADR-133 mirror of that bloat. Three sim-owned constants moved; the
ADR-148-interim scope in `envelopes.ts` deleted as its comment promised. Full
`verify:balance` matrix green: R0–R6 in [3, 22] on all 5 seeds (R3 **20.0
[19.0–20.3]**, was 163 [146–221]), ratio **[0.95–0.97]** ∈ [0.8, 1.2], 20-seed
fuzz clean. Total greedy T0 ≈ **2.5 h** sim wall, down from ≈ 7.7 h. → ADR-172.

## What changed
- `src/core/content/balance.ts` — `COMBAT_XP_K` 5 → 20 (~5 kills to the R3
  gate, was ~19), `COOK_HP_RESTORE` 14 → 35 (two meals ≈ a full mend),
  `ESTATE_DEED_PER_ACT` 0.22 → 0.6 (the ≈1:1 law rescales Phase 2 to the
  shrunk climb). Comments re-derived (the ≈19-kill note, the deed-base
  history).
- `src/sim/envelopes.ts` — `ADR148_INTERIM_BAND_RUNGS` **deleted**;
  `greedyBandVerdicts` covers all of CLIMB_RUNGS (R0–R6). R7 residence stays
  the ratio gate (HD-19/ADR-133).
- `src/sim/personas.ts` — the idler's kill-req branch gained the
  forage-for-sansai mend fallback (mirrors the night-round branch): the
  re-tune exposed a genuine loss-loop (hp=1, sansai=1 < COOK_SANSAI_COST,
  arming the watch and losing to the sickroom forever) on seeds 1/7.
- `src/core/pillars.test.ts` — deed-banking asserts whole+frac TOTAL (a
  magnitude ≥ 1 koku banks its whole part; workshop is now 0.6×2 = 1.2).
- `src/core/invariants.test.ts` — arc-length floor re-derived 2000 → 1000
  (the re-paced greedy arc is ~1.3k dispatches, was ~3.6k).
- Regenerated: `docs/content/t0-pacing.md` (the before/after diff),
  `src/fixtures/saves/*` (17 files), `docs/content/t0-content.md`.
- Paperwork: **ADR-172**; HD-35 closed → archive row; verbatim intent in
  `project/feedback-human/2026-07-10-hd35-repace-ruling.md`.

## Shared-tree coordination (w1:p3, the HD-37 cold-open rearc)
The co-agent's cold-open sources were live in the tree during my fixture/report
regen, so those artifacts embed BOTH change-sets — consistent only once both
source sets are committed. Coordination message sent (herdr, queued): they land
their sources+artifacts, I hold the **push** until both commits are in, then
final-regen if needed and push. My commit stays local until then.

## Next intended steps
- After w1:p3 lands: re-run `pnpm run verify`, regen fixtures/report if their
  final intro differs from what my artifacts embed, then checkpoint (push).
- HR-1's live playthrough now plays a ~2.5 h-sim T0 — the attended-vs-sim
  calibration (attended ran ~5× sim on R0) is the open watch-point; fresh
  telemetry will speak to whether [3, 22] sim-min is the right *felt* band.

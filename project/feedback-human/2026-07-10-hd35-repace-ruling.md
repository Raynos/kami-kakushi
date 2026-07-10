# HD-35 ruling — re-pace R0–R7 into verified bands (2026-07-10)

Captured verbatim from the in-session steer (w2:p5, ruled same-day via chat +
AskUserQuestion; graduated to **ADR-172**).

## The verbatim intent

> "I definitely think we need A) re-pace R3
>
> I think we need to re-pace R0-R7 and we need to update the verify script so
> it can verify R0-R7 and it shouldnt go red."

## The fork answers (AskUserQuestion, same session)

- **R7 target:** **Keep ADR-133 ratio** — R7 ≈ the re-paced climb total,
  verified by the existing ratio gate; only R3 needed re-pacing among the
  climb rungs. Verify covers R0–R7 green: R0–R6 by the [3, 22] band, R7 by
  the [0.8, 1.2] ratio.
- **R3 levers:** **Any lever, keep the fiction** — the agent picks the levers
  to hit the band, the night-watch fiction stays intact, the before/after sim
  diff is the review artifact.

## What landed (ADR-132 machine verdict)

- `COMBAT_XP_K` 5 → 20 · `COOK_HP_RESTORE` 14 → 35 → R3 20.0 [19.0–20.3] min.
- `ESTATE_DEED_PER_ACT` 0.22 → 0.6 → ratio [0.95–0.97].
- `ADR148_INTERIM_BAND_RUNGS` deleted — full R0–R6 band verdicts live.
- Total greedy T0 ≈ 2.5 h sim wall (was ≈ 7.7 h).

Detail + rationale: **ADR-172** in `docs/living/decisions.md`.

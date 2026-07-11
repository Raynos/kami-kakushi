# 2026-07-11 — session 179 — PRD ripple: arriveAt + §6 AND-gate text-sync

## What happened

`/prd-ripple` over the four src commits since the last ripple (`a165bd68`,
ADR-179 → §6). Classified per Flow 1:

- `09c04284` (travel ×2, porter lands) — **balance number**: no §4 edit; the
  regenerated `t0-pacing.md` landed with the change (ADR-132). Nothing owed.
- `0fdf3d14` (fog fix) · `29e3ec30` (food-verb re-home) — UI fix / UI
  placement below PRD altitude; the re-home is already owned by ADR-178.
- `4bb513eb` (`RankDef.arriveAt` — the R0→R1 beat stands you at the
  forecourt) — **system class**: recorded **ADR-181** and rippled §6.

## Ripple edits

- `docs/living/prd/06-tech-architecture.md` — the Phase-1 bullet and the
  `content/ranks.ts` catalogue row still described the meter/threshold
  AND-gate that FB-121/ADR-137 deleted (verified against the build: no
  `rungMeter`/threshold survives in the rank code; `content/requirements.ts`
  ships). Re-worded both to the requirements model + documented `arriveAt`;
  dropped the stale "rung-meter thresholds" item from the `balance.ts` row.
- `docs/living/decisions.md` — **ADR-181** (promotion beat can relocate you).

`prd:drift` CLEAN before and after.

## Deliberately NOT touched

§3/§4 still speak rung-meter language throughout (~20 hits, incl. §4.1.1 "the
rung-meter accrual law"). Per §6's own state table, the two-meter
`ranks[tier]` shape is **T1+ frontier** — so much of that prose is forward
design (Q1), not drift, and a blanket sweep risks deleting intended frontier
canon. Left for a deliberate pass (likely the T0 compression event / a
human-steered text-sync) rather than this targeted ripple.

## Next intended steps

- None owed from this ripple. The §3/§4 meter-language question above is the
  one open thread if anyone wants it.

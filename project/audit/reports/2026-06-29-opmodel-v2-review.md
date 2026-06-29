# Op-model v2 FINAL — adversarial review of the A/B/D/C infra (2026-06-29)

**Method.** A `Workflow` (4 review lenses → each finding adversarially verified by a skeptic) over the committed
op-model infra: the bash hooks, `verify-budget.ts`, `playcheck.*`, and the `diverge` skill. **15 findings
confirmed/partial, 0 refuted.** Raw verbatim snapshot:
[`project/brainstorms/raw/2026-06-29-opmodel-review.json`](../../brainstorms/raw/2026-06-29-opmodel-review.json).
All fixes landed in commit *(this batch)* — every finding sits in a conflict-free file (no roadmap-doc overlap).

## Gate infra — `verify-budget.ts` + `.githooks/pre-commit`

| # | Sev | Finding | Disposition |
|---|---|---|---|
| 1 | low | Journal gate: `set -o pipefail` + `grep -q` → SIGPIPE (141) on a >64KB staged-file list falsely blocks a valid commit | **FIXED** — match via here-string `grep -qE … <<<"$staged"` (no pipe producer, no SIGPIPE). |
| 2 | med | `verify-budget` median loop's `execSync` is uncaught → a flaky gate throws Node **exit 1**, colliding with the OVER-BUDGET code | **FIXED** — wrapped in try/catch → **exit 2** ("verify red"), matching the breakdown phase. |
| 3 | med | Non-numeric `VERIFY_BUDGET_MS` (e.g. `5s`) → NaN → `median > NaN` always false → the hard-fail guard silently becomes an **always-pass** | **FIXED** — validate `Number.isFinite && > 0`, else exit 2. Verified: `VERIFY_BUDGET_MS=5s` now exits 2. |

## `playcheck.*`

| # | Sev | Finding | Disposition |
|---|---|---|---|
| 4 | med | `firstActionMs` had only the 5s cap (no ratchet) → a ~10× regression (480ms→4.9s) passed green | **FIXED** — added a `3× baseline / 2s floor` ratchet **and** the cap; `base.firstActionMs` is now read. |
| 5 | med | `maxDeadTimeMs` ratchet inert: the 3s floor dominated `1.5×·baseline`, tolerating a ~6× regression | **FIXED** — `RATCHET_MULT=3`, `RATCHET_FLOOR_MS=2000`; the ratchet now binds (fails ~>4–5 reward-less intents). |
| 6 | low | `baseline.json` fields stored-but-unread (only `maxDeadTimeMs` read) | **FIXED (mostly)** — `firstActionMs` now read (#4); added a `base.seed != SEED` staleness guard. `combatWinCurve`/`minutesPerRung` are *intentionally* display-only (owned by m2.test / pacing:check). |
| 7 | med | The "passes its own baseline" test was tautological (`base` derived from the live vector) | **FIXED** — the test loads the **committed** `playcheck.baseline.json`; now a real drift check. |
| 8 | low | Teeth test never exercised the ratchet boundary (only values far past cap/floor) | **FIXED** — added boundary cases: 2.1s (RED, trips ratchet) vs 1.9s (GREEN, no false alarm). |
| 9 | low | Reward proxy watched koku/meter/reveal, blind to a hypothetical XP-only labour | **FIXED** — added `level↑`; commented that new reward currencies must extend the signal. |
| 10 | low | `nextIntent` copy-pasted `walkPacing`'s policy → silent desync risk | **FIXED** — extracted `focusedOptimalIntent()` in `pacing-report.ts`; **both** call it (single source). `pacing:check` confirms identical numbers post-refactor. |

## `diverge` skill (process-doc inconsistencies)

| # | Sev | Finding | Disposition |
|---|---|---|---|
| 11 | low | At-cap ladder step 2 said "untouched R-item", but §6's half-life rewording *touches* it → the 7–14d mid-band was uncovered | **FIXED** — redefined as "no **human verdict** yet" (the automated rewording doesn't count). |
| 12 | med | §2 procedure never built the §0 infra it depends on → the first diverge silently breaks | **FIXED** — §2 step 0: build §0 infra on the first-ever diverge. |
| 13 | med | `blend A+C` then silence auto-confirmed back to the *original* self-pick, contradicting the blend | **FIXED** — blend is promoted to `main` as the new default + becomes the R-item's self-pick + TTL reset. |
| 14 | med | Single-idea mode shipped a mandatory-diverge surface with no R-item/tracker → "diverge later" unenforced | **FIXED** — files a `deferred-single-idea` registry row the sweep re-offers when a slot frees. |
| 15 | med | `keep-flags` at the cap-2 kept-flags table was undefined → a human could exceed a "hard" cap | **FIXED** — at cap, the agent refuses to silently exceed; asks the human to resolve/unpin one first. |

## Verification
`npm run verify` PASS (104 tests — +1 boundary teeth test); `pacing:check` identical numbers post-refactor;
`VERIFY_BUDGET_MS=5s npm run verify:budget` → exit 2 (guard works). No findings deferred.

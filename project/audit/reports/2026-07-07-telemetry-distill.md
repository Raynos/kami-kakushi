# FB-8 telemetry distill — the corpus before timed actions (2026-07-07)

**Status:** 📓 diary-rule distillation (telemetry README §3): the pacing
conclusions from `project/telemetry/` as of 2026-07-07 evening, with the
numbers quoted. The raw reports are git-ignored local sensor data; this note
is the repo's memory of them. Read alongside the ADR-148 economy-rebalance
deferral (the timed-actions plan, `project/archive/`).

## Corpus shape — 82 reports, ~18 human sittings

- **82 report files** (mtimes 2026-07-06 → 07-07). The `20260626-` filename
  prefix is the fixed RNG **seed**, not a date; the suffix is run-start epoch
  seconds.
- **74 tainted / 8 untainted; 54 report Σ 0.0 attended min.** The bulk carry
  `fixture` / `qa-drive` / `forceState` taints — **agent QA harness runs**,
  not human play: every `__qa.loadFixture()` starts a fresh run identity and
  every run auto-drops its own file on segment close. The 2026-07-06 evening
  burst (~40 stubs, seconds apart) is one agent sweeping the fixture library.
- **Human reloads do NOT fragment** — the FB-5 `resume` path continues the
  newest stored run for the seed. The human's full 2026-07-07 play day
  (10:28→16:41Z, 50 segments) is correctly ONE file.
- Real human sittings ≈ 8 untainted + ~10 DEV-tool-tainted (`save-import`,
  `speed>1`, `toRung`) ≈ **18** — matching the human's own "maybe 20" count.

## What the untainted data says — almost nothing

The 8 untainted runs (all 2026-07-06, v0.3.8, the steel-palette review
sittings) total **Σ ≈ 14.4 attended min** (0.1 · 0.5 · 2.5 · 2.6 · 0.7 ·
0.3 · 3.1 · 4.6) with **zero rung-ups** — blur-heavy segment logs, i.e.
UI-review dips, not playthroughs. **The attended-vs-sim per-rung comparison
has no untainted rows at all.** The pacing triangle's reality leg
(sim theory · design bands · real play) is currently starved.

## The one real playthrough datapoint (tainted, use with care)

Run `20260626-1783420086` (2026-07-07, v0.3.9 39f61ab, `save-import` taint):
**Σ 17.2 attended min** across 50 segments spanning a whole day of dips;
**R0 rung-up at 6.2 attended min** (96 ticks, rice 84+0) — **inside the
[3, 22] band**, toward the fast end. Single point, taint-excluded from
vs-sim by contract, quoted here for the diary only.

## Conclusions

1. **This entire corpus is a PRE-timed-actions baseline.** The newest build
   sha in any report (39f61ab) is the timed-actions *plan-lock* commit —
   every report predates the ADR-148 Phase 1+ build that changed the
   interaction model (durations + cooldowns). None of this data should tune
   the post-ADR-148 economy; it's the "before" picture only.
2. **The R0 pacing signal, weak as it is, raises no alarm:** 6.2 attended
   min for R0 sits in-band. No untainted or multi-rung evidence exists for
   R1+.
3. **The human's real play is systematically tainted.** Their genuine
   sessions start by importing a save or touching DEV tools (`toRung`,
   `speed>1`), and taints are run-scoped and sticky — so the most real data
   is excluded from vs-sim while the untainted residue is 30-second UI
   checks. If the reality leg should ever gate anything, the taint model
   (or the human's play habits on a clean profile) has to change first.
4. **The file flood is QA exhaust, not fragmentation.** Fixture/qa-drive
   runs mint one stub file each (54 zero-minute stubs of 82). Proposed:
   suppress the report-file drop for harness-tainted runs
   (`fixture`/`qa-drive`/`forceState`) — the localStorage ring still
   buffers them; human DEV-tool taints keep dropping files. **APPLIED
   2026-07-07 (human go-ahead, this session):** `src/telemetry/taints.ts`
   taxonomy + the auto-drop guard; the 59 existing harness stubs swept.
   Same sign-off also SOFTENED `save-import` to an origin MARK (clock
   honest → vs-sim comparison kept; economy columns read unknown-origin) —
   addressing conclusion 3's starvation for the import case.
5. **For the deferred ADR-148 rebalance:** fresh attended-time data on the
   timed-actions build is the input that matters; this corpus is the
   before/after baseline to quote against it.

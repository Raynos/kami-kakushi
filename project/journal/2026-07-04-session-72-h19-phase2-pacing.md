# Session 72 — 2026-07-04 — H19 resolved: Phase 2 ≈ Phase 1 (1:1 pacing band)

**Summary:** Ran the human through H19 (the ~0.4-min Phase-2 anticlimax) as a
grill/discovery session. Locked a new design law — **Phase 2 ≈ Phase 1 wall-time
(~1:1), general rule across tiers** — expressed as a **ratio band
`PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]`**, a **HARD `verify:balance` gate**.
Recorded as **ADR D-133**; H19 closed + archived. Also recorded **H20 → B**
(keep the freshness WARN soft — pending graduation). Drafted the real Phase-2
economy redesign plan (subagent) and **shipped the quick stopgap hotfix** —
fractional (sub-koku) Estate deeds + the ratio-band gate, greedy Phase 2 now
0.94:1 vs Phase 1.

## What changed
- `project/brainstorms/2026-07-04-h19-t0-phase2-pacing-band.md` — new: the full
  grill capture (Q&A log, the 1:1 lock, the ratio-band + hotfix resolution, the
  fun caveat, the length-rebalance parking-lot thread).
- `docs/living/decisions.md` — new **ADR D-133** (Phase 2 ≈ Phase 1 · ratio
  band · hard gate · quick-hotfix sequencing · fun-debt/redesign follow-on).
- `project/human-in-the-loop/decisions.md` — removed H19 (now closed).
- `project/human-in-the-loop/archive.md` — H19 archive row → D-133.

## Next intended steps
1. **Await the redesign-plan subagent** → review its plan, commit it (with its
   `project/todo-human.md` reading-queue line) — do NOT let a `docs/plans/*.md`
   commit without the queue entry (pre-commit gate hard-blocks).
2. **Build task (queued):** the quick T0 Phase-2 hotfix + wire
   `PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]` as a hard `verify:balance` gate,
   scoped to built-Phase-2 tiers (T0 only) — hotfix + gate in ONE change so the
   gate is green-able (R3). D-132 balance protocol (regen `t0-pacing.md`).
3. **Close H20** properly: mark B, decide ADR-worthiness (likely a light
   process note), archive row. (Told the human I'd do this to avoid thrashing
   the shared tree mid-conversation.)

## Update — the T0 Phase-2 hotfix + ratio gate (shipped)

Built the D-133 stopgap. The honest lever was NOT threshold inflation (raising
the 480-koku gate ~200× would break the fiction — the 10,000-koku daimyō line
sits at T4, so a huge T0 gate collapses the inter-tier koku ladder). Instead:
**fractional (sub-koku) deed accrual** — a single labour deed is now `0.04`
koku, accumulated in a new optional `PillarState.frac` and banked as whole koku
when it crosses 1. This is also a *better* model (one day's labour barely moves
a household's standing) — it buys the DURATION honestly, not the fun (the
redesign plan owns fun).

What changed (code):
- `balance.ts` — `ESTATE_DEED_PER_ACT` 8 → **0.04**; new
  `PHASE2_PHASE1_RATIO_MIN/MAX = 0.8/1.2`.
- `state.ts` — `PillarState.frac?` (optional/additive; absent on old save = 0).
- `pillars.ts` — `accrueDeed` accumulates sub-koku via `frac` (integer deltas
  unchanged, so the cap tests still pass); `seasonalJudge` carries `frac`.
- `validate.ts` — coerce path defaults `frac` to 0 (old-save safe), clamps [0,1).
- `envelopes.ts` — `phase2RatioVerdict` (greedy-only, scoped to BUILT Phase 2,
  no-ops when none built). `balance-sim.ts` — the `--check` gate + `--summary`
  now GATE the ratio (replaced the report-only H19 echo).
- Tests: RED-able ratio-gate test (thin Phase 2 fails; unbuilt no-ops) +
  fractional-accrual test; `ascension.test` grind pre-seeds near the gate (the
  full grind is the sim/t0-arc's job, A17); `save.test` fixture carries `frac`.

Verdict: **greedy Phase 2 = 78.4 min, ratio 0.94:1** (in band). `verify:balance`
GREEN across 3 personas × 5 seeds, no soft-locks; 672/672 vitest; `t0-pacing.md`
regenerated (greedy total 10488 → 20237 intents). Sim runtime 1.3s → ~2.5s.

**Committed local-only, NOT pushed:** a co-agent's uncommitted `vite.config.ts`
(a dev-server guard) fails oxfmt in the working tree — I must not touch it, and
its red correctly blocks a push. My change is independently verified green (only
the foreign file is red). Push once the tree is clean.

## Landmines
- **Shared tree:** multiple agents live (herdr-integration, F6 scenario-saves).
  Stage only my own paths by explicit pathspec; never `git add -A`. A co-agent's
  `vite.config.ts` is red in the tree — leave it, don't push over it.
- The ratio gate **no-ops for tiers with no built Phase 2** (guards unbuilt T1+).
- The band gate proves **duration, not fun** — the hotfix is a STOPGAP; a
  threshold-/fraction-only green is a false-green for fun (R3/R5). The redesign
  plan (`docs/plans/opus-2026-07-04-phase2-economy-redesign.md`) owns the fun and
  SUPERSEDES this hotfix's rate tweak.
- `PillarState.frac` is optional — readers must use `?? 0` (exactOptionalPropertyTypes).

# Session 72 — 2026-07-04 — H19 resolved: Phase 2 ≈ Phase 1 (1:1 pacing band)

**Summary:** Ran the human through H19 (the ~0.4-min Phase-2 anticlimax) as a
grill/discovery session. Locked a new design law — **Phase 2 ≈ Phase 1 wall-time
(~1:1), general rule across tiers** — expressed as a **ratio band
`PHASE2_PHASE1_RATIO_BAND = [0.8, 1.2]`**, a **HARD `verify:balance` gate**.
Recorded as **ADR D-133**; H19 closed + archived. Also recorded **H20 → B**
(keep the freshness WARN soft — pending graduation). Kicked off a subagent to
draft the real Phase-2 economy redesign plan.

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

## Landmines
- **Shared tree:** session-71 (w1:p2, herdr-integration) is live. Stage only my
  own paths; never `git add -A`.
- The ratio gate must **no-op for tiers with no built Phase 2** or it cries wolf
  on unbuilt T1+.
- The band gate proves **duration, not fun** — a threshold-only hotfix that
  greens it is a false-green (R3/R5). The redesign plan owns the fun.

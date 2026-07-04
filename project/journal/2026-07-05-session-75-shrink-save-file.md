# Session 75 — shrink the save file (plan)

**Date:** 2026-07-05
**Focus:** Answer "can we make save files smaller by dropping the log?" → a
measured plan.

## What happened

The human asked whether saves can be shrunk by removing the full log, and how the
log would then render on load/refresh.

Investigated the save/log/determinism/render paths (Explore agent + direct
reads). Key finding: **the log is the only unbounded field** — a 300-entry prose
ring (`state.log`, `src/core/state.ts:118`), ~57% of the save. There is **no
persisted intent history**, so the run is not replayable as-is.

Ran through options with the human (A compress · C log-descriptors · D
seed+intent-trace+replay). Initially planned the full event-sourced answer
(A+C+D) at the human's request — then **measured real fixture saves**, which
killed D:

| Fact | Value |
| --- | --- |
| Log as % of save | 57–60% |
| Non-log state (snapshot) | 1.1–2.4 KB |
| Current save gzipped | 48 KB → **3.65 KB (13×)** |
| Descriptors (C) gzipped | → 2.68 KB (18×) |
| C's marginal gain over A | ~1 KB |

The human correctly pushed: the intent trace only avoids re-storing the ~2 KB
snapshot (nothing to reclaim) and doesn't even rebuild the log — the log rebuilds
trivially from an **ordered descriptor array** (C), no replay. **D dropped.**

## Outcome

- Plan: `docs/plans/opus-2026-07-05-shrink-save-file.md` — **A (compression) is
  the plan of record; C optional (architectural, not size); D dropped.** The plan
  records the measurement and why D is out.
- Added to the human reading queue (`project/todo-human.md`): pick A only vs A+C.

## Next intended steps

- Human picks A-only or A+C.
- If A: implement the sync-LZ + magic-byte codec wrapper in
  `src/persistence/codec.ts`; round-trip + backward-compat + size tests.

## Note

Committed only my own files by explicit path (shared tree — w1:p2/p3 live).
The plan file was untracked while a co-agent's regenerated `docs/plans/README.md`
already referenced it (dead-link RED on CI); this commit greens that.

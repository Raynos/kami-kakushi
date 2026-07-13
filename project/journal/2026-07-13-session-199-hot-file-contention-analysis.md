# Session 199 — 2026-07-13 — measuring multi-agent hot-file contention

**Summary:** The human asked how to detect commit contention /
multi-agent thrash on hot files, and whether splitting large hot
files would help. Ran the first measured pass (git heat + rapid
re-touch windows + transcript collision-marker grep) and wrote the
analysis + verdict to
`project/brainstorms/2026-07-13-hot-file-contention-analysis.md`.
Read-only session — no code touched.

## What changed
- `project/brainstorms/2026-07-13-hot-file-contention-analysis.md` —
  the analysis: method, numbers (72/548 sessions hit a git
  collision; 218 push rejects; render.ts = 6.7k lines / 183
  commits / 30 cross-scope rapid re-touches), and the verdict
  (splitting helps the file-level commit class, not the push/lock
  class; recommend checkpoint-claim protocol first, render split
  second).
- `tmp/hotfiles.py` — throwaway analysis script (git-ignored).

## Next intended steps
1. Human rules on direction: checkpoint/push claim protocol and/or
   the render.ts split. If either is a go, it gets a `docs/plans/`
   plan (neither is started).

## Landmines
- The cross-scope re-touch metric is a PROXY for distinct agents;
  the rigorous version (commit→session join via journal files) is
  described in the brainstorm's Method §4 and not yet built.

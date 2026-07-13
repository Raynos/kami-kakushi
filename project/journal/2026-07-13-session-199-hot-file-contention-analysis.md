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
1. ~~Human rules on direction~~ **DONE same session** — a grill-me
   pass walked the whole tree and locked **ADR-196** (hybrid tree ·
   push mutex · prepare-to-exit lock · sweep-guard tighten+ledger ·
   decisions.md shard + ADR-number claim · the Fable-overnight
   split job). Capture:
   `project/brainstorms/2026-07-13-multi-agent-contention-fixes.md`.
2. ~~Author the THREE plans~~ **DONE** — all three landed template-
   green in `12db82cb` (locks · adr-shard · render-split) and are
   queued. NOTE: the untracked scaffolds briefly REDed the shared
   checkpoint gate for co-agents (README active-plans region went
   stale on disk) — w2:p5 was held behind it; resolved by landing
   the plans + regenerated README together. Lesson: scaffold and
   commit plans in ONE sitting, or scaffold in `tmp/`.
3. Next: an agent picks up the locks plan (Opus-buildable); the
   shard waits for a quiet moment on decisions.md; the split waits
   for the human's overnight go.

## Landmines
- The cross-scope re-touch metric is a PROXY for distinct agents;
  the rigorous version (commit→session join via journal files) is
  described in the brainstorm's Method §4 and not yet built.

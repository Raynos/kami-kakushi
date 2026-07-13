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
3. ~~An agent picks up the locks plan~~ **BUILT this session** (the
   human re-routed: run it here, after a 3-question design Q&A —
   wrapper + bare-push block · five destructive verbs worktree-
   exempt no-escape · ledger auto-committed by post-commit, since a
   pathspec commit's temp index can't be amended by pre-commit).
   Shipped: `tree-claim.ts` (+7 tests, push/exit mutex + ADR
   allocator — its first live run correctly reserved above a
   co-agent's ADR-197 written DURING the build), `push-main.sh` +
   `pnpm run push`, `guard-bash-safety.sh` (push block, 5
   tree-wide destructive blocks incl. the env-prefix evasion fix,
   27-case proof matrix in `tmp/guard-proof.sh`),
   `guard-git-add-all.sh` (escape tightened to real env-prefix
   only + ledger append, 4-case proof in `tmp/escape-proof.py`),
   `.githooks/post-commit` (ledger auto-commit), prepare-to-exit
   step 0, docs ripple (AGENTS.md displaced to its 500 cap).
4. Code batch committed in the next GREEN window (tree red from
   the sickroom build's mid-flight WIP at writing time — their
   red, not ours); docs batch commits now under the docs lane.
5. Still queued: the shard plan (quiet moment on decisions.md);
   the render split (human's overnight go).

## Landmines
- The cross-scope re-touch metric is a PROXY for distinct agents;
  the rigorous version (commit→session join via journal files) is
  described in the brainstorm's Method §4 and not yet built.

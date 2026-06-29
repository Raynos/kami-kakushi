# Session 07 — 2026-06-29 — doc hygiene: date-prefix the v2-lite reel-back + archive the completed tdd proposal

**Summary:** Two human-directed hygiene tasks. (1) Renamed the op-model **v2-lite reel-back** to the
date-prefixed convention matching its `docs/plans/` siblings; (2) archived the **tdd skill integration
proposal** (complete — the skill was greenlit + integrated earlier 2026-06-29). All cross-references
fixed; no content changed. No ADR/doc-of-record semantics altered.

## What changed
File moves (via `git mv`, history preserved):
- `docs/plans/operating-model-v2-lite-reelback.md` → `docs/plans/2026-06-29-operating-model-v2-lite-reelback.md` — date-prefix to match dated siblings.
- `docs/plans/2026-06-29-tdd-skill-integration-proposal.md` → `project/archive/2026-06-29-tdd-skill-integration-proposal.md` — archived; the tdd skill is built & adopted, so the proposal is finalized (archive, don't delete).

Reference fixes (basename-only swap for the reel-back; path swap for the archived proposal — no prose meaning changed):
- `docs/plans/2026-06-29-path-to-v0.3.md`
- `project/docs-to-read-for-human.md`
- `project/journal/2026-06-29-session-04-decision-session.md`
- `project/journal/2026-06-29-session-05-tdd-skill.md` — repointed the tdd "Adoption record" link `docs/plans/` → `project/archive/`.
- `project/human-feedback/2026-06-29-decision-session.md`
- `project/status/pending-prd-reshape.md`
- `project/status/project-status.md`

## Next intended steps
1. **The session brief is now stale.** A concurrent agent's commit `64ad701` resolved **H7/H9/H10 → ✅**
   (op-model v2 *deferred*, no longer ⛔ blocking; added the lean pre-commit gate). Re-run
   `bash src/scripts/session-brief.sh` next session — the H-item queue has collapsed.
2. Downstream (no longer gated on H10): ADRs **D-056+**, split `prd.md` into per-section files, ripple the
   6-tier reshape (D-048…D-055) into PRD/docs/code, then build (carry-forward + retune T0, spine-first).

## Landmines
- **The doc-hygiene changes are in commit `64ad701`, NOT a standalone hygiene commit.** A *concurrent* agent
  ran `git commit 64ad701` ("H-item decisions — defer op-model v2, add a lean pre-commit gate") while my
  renames were staged + my ref-fixes were in the working tree, so its commit **absorbed all my hygiene work**
  (both `git mv` renames + all 7 ref-fix edits). Verified intact in HEAD: reelback is dated, tdd is archived,
  old paths are gone, no stale `…reelback.md` refs in tracked files. My intended *scoped pathspec* commit was
  pre-empted — this session-07 journal is the only file that landed as its own checkpoint commit.
- **Why no separate hygiene commit:** by the time I went to commit, the work was already in `64ad701`; a
  history rewrite to split it back out would disrupt the concurrent agent (it may already be building on that
  commit), so the bundling is left as-is.
- The bare tree-label `operating-model-v2-lite-reelback` (no `.md`) in `docs-to-read-for-human.md`'s ASCII tree
  was intentionally left un-dated (it's a display label, not a link); the actual queue link was updated.
- One `…-operating-model-v2-lite-reelback.md` mention remains in `2026-06-29-session-06-h-item-decisions.md`
  (the concurrent agent's journal) — prose narrative, now slightly stale, deliberately **not** edited (another
  agent's log).

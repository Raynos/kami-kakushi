# Session 25 — 2026-06-30 — history rewrite (scrub raw JSON + Assisted-by)

**Summary:** Executed the heavier half of the human's raw-dump TODO — a full
`git filter-repo` rewrite of all 269 commits on `main`, human-approved end to
end. One pass did two things: (1) **scrubbed** the 58
`project/brainstorms/raw/*.json` blobs from all history, and (2) **converted**
every AI `Co-Authored-By` trailer to the new `Assisted-by:` trailer
(Option A — mechanical swap). Force-pushed `c5e2a67…839f98d` to `origin/main`
(pre-push gate green), confirmed in sync, then deleted backups on the human's
OK. Trailer/banner conventions (sessions 22–23) are now retroactive across the
whole history, and the repo no longer carries the verbatim workflow dumps.

## What changed
- **History rewrite** (`git filter-repo`, single pass, 269 commits, 0 pruned):
  - `--path-glob 'project/brainstorms/raw/*.json' --invert-paths` → 58 JSON
    blobs gone from all history (they were already git-ignored since session-21;
    this removes the past blobs too).
  - `--message-callback` (`tmp/msg-callback.py`, git-ignored scratch): drops any
    real `Co-Authored-By: … noreply@anthropic.com` trailer line and appends
    `Assisted-by: Claude Code:claude-opus-4-8[…]`. Preserved the 1M distinction —
    **194** `[1m]` + **55** plain. Prose mentions of "Co-Authored-By" and the ~20
    untagged/human commits were left untouched; the 15 pre-existing `Assisted-by`
    commits weren't double-tagged.
- **Verification before push:** 0 `Co-Authored-By` trailers left, JSON fully
  scrubbed, trailers blank-line-separated, `npm run verify` green. `gh-pages`
  carried no dumps (built site) — left as-is.
- `docs/plans/2026-06-30-history-rewrite.md` — marked **✅ DONE** with the
  outcome + aftermath (re-sync command for other clones).
- `project/todo-human.md` — removed the now-finished raw-dump TODO (and earlier
  in the session, trimmed two stale `[x]` done items per the human's
  "done items are removed, not kept" rule).
- Backups (`backup/pre-rewrite-2026-06-30` branch + `../kami-kakushi-backup.git`
  mirror) created before the rewrite, **deleted** after the human confirmed
  healthy.

## Landmines
- **All SHAs on `main` changed.** Any *separate* clone (other agent on another
  checkout, CI, another machine) must `git fetch origin && git reset --hard
  origin/main` before doing more work — otherwise its next push re-introduces the
  old commits. A clone sharing this `.git` is already on the rewritten history
  (filter-repo reset it in place; tree was clean, nothing lost).
- **GitHub may cache** the old commits/blobs for a while (API/cached views).
  Fine here — the dumps were bulky, not secret; a true purge would need a GitHub
  support request.
- The old `Co-Authored-By` trailers are **gone from history** now — the earlier
  caveat in CLAUDE.md ("existing history still carries the old trailers") is
  stale and could be trimmed on a future docs pass.

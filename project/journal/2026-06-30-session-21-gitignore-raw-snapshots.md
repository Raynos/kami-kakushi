# Session 21 — 2026-06-30 — git-ignore the raw workflow-output snapshots

**Summary:** Deployed `gh-pages` (site @ main `e4e1bbf`), then started the human's TODO #2 the
light way: added `project/brainstorms/raw/*.json` to `.gitignore` and `git rm --cached`'d the 57
tracked snapshots (kept on disk). This stops new snapshots bloating the tree going forward; it does
**not** rewrite history (the blobs still live in past commits — the heavier `git filter-repo`
option remains open for the human). Noted the durability caveat in `raw/README.md`.

## What changed
- `.gitignore` — added `project/brainstorms/raw/*.json` (raw snapshots no longer tracked; kept on
  disk). `raw/README.md` stays tracked.
- Untracked 57 `*.json` snapshots via `git rm --cached` (working-copy files untouched).
- `project/brainstorms/raw/README.md` — added a "Git-ignored" callout: these now live on local
  disk only — they survive session end (the point of snapshotting) but no longer reach the remote,
  so they're lost on machine loss. The committed distillation in `../` / `../../docs/` stays the
  source of truth.

## Next intended steps
1. Human TODO #2 has a heavier half left: decide whether to scrub the existing blobs from *history*
   (`git filter-repo`) given the shared-tree / remote constraints — still open.
2. Human TODO #1 (`claude` committer) and #3 (commit-message conventions) — I offered to do the
   legwork; awaiting a pick.

## Followup (same session) — documented the tradeoff
Human asked to document the durability tradeoff in the conventions (not just flag it):
- `CLAUDE.md` "Durable capture" convention rewritten into **two explicit tiers**: (1) raw `.json` =
  git-ignored, local-disk-only, **session-resume insurance only** (internet drop / bug / accidental
  `Ctrl+C`) — lost on machine loss; (2) the **markdown distillation** is the durable, committed
  source of truth — anything that must survive *must* be markdown, and it must be **far smaller**
  than the `.json` ("if it isn't smaller, you haven't distilled — you've copied").
- `raw/README.md` callout updated to match (local-resume purpose + markdown-is-durable rule).

## Landmines
- Behavior change to the **"Durable capture"** convention: snapshots are now local-only insurance,
  not remote-durable. `snapshot-research.sh` still writes silently git-ignored files — the
  `raw/README.md` + `CLAUDE.md` tiers are the guard against an agent assuming a snapshot is safe on
  the remote.

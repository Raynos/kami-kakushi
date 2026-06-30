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

## Landmines
- This is a behavior change to the **"Durable capture"** convention in `CLAUDE.md`: snapshots are
  now local-only insurance, not remote-durable. `snapshot-research.sh` will keep writing files that
  are silently git-ignored — the `raw/README.md` callout is the only guard against an agent assuming
  a snapshot is safe on the remote. The CLAUDE.md convention text itself was left as-is (flagged to
  the human rather than unilaterally rewritten).

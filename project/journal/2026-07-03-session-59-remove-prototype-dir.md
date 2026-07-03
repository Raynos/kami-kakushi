# Session 59 — 2026-07-03 — remove the `prototype/` dir from git

**Summary:** The human called the `prototype/` UI-v2 exploration done and asked
to `git rm` it. Removed all 20 tracked files under `prototype/`, then (on a second
ask) deleted the whole dir from disk including the untracked local `.vercel` link
folder, and dropped the now-dead `prototype` line from `.prettierignore`. Fixed the
one dangling doc reference. Historical references (journal, archive, brainstorms)
are left intact — they're the append-only record of how the prototype came to be.

## Context
`prototype/` held Fable's session-46 UI-v2 exploration (seven standalone
`NN-slug.html` frames + briefs + gallery). The human reviewed them in session
47, found them novel-but-not-the-direction, and the work graduated into the
`ui-demos/` remaster track. With that superseded, the human called the dir done.

## What changed
- `prototype/**` — **removed** (20 tracked files: 7 concept HTML frames,
  `index.html` gallery, `README.md`, 9 `briefs/`, `.gitignore`) via `git rm -r`.
- `ui-demos/README.md` — fixed the dangling analogy ("Excluded from Prettier +
  ESLint like `prototype/` and `tmp/`" → "like `tmp/`").
- `.prettierignore` — **dropped the `prototype` line.** (First commit `3afe875`
  kept it while the local `.vercel` folder still sat under `prototype/` — dropping
  it then made prettier choke on `prototype/.vercel/project.json`, a RED gate. Once
  the human re-asked and the whole dir was deleted from disk, the line became dead
  and was removed.)
- `prototype/` (dir on disk, incl. untracked `.vercel`) — **deleted** via `rm -r`.

## Landmines
- **Historical references were intentionally NOT touched** — the session-46/47/49/53
  journals, `project/archive/2026-07-02-ui-remaster-variants.md`, and the
  `2026-07-02-ui-v2-fable-session.md` brainstorm still mention `prototype/`. That's
  correct: the journal/archive/brainstorm record is append-only history and
  legitimately references the dir as it existed at the time.

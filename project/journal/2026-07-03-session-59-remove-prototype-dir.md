# Session 59 — 2026-07-03 — remove the `prototype/` dir from git

**Summary:** The human called the `prototype/` UI-v2 exploration done and asked
to `git rm` it. Removed all 20 tracked files under `prototype/` and fixed the
one dangling doc reference. Historical references (journal, archive, brainstorms)
are left intact — they're the append-only record of how the prototype came to be.
The untracked local `prototype/.vercel` link folder stays on disk (removal
declined), so `.prettierignore` keeps its `prototype` line to skip that stray file.

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
- `.prettierignore` — **left the `prototype` line in place** (see landmine): the
  untracked local `.vercel` folder still sits under `prototype/`, and dropping the
  line made prettier choke on `prototype/.vercel/project.json` (RED gate).

## Landmines
- The untracked, git-ignored `prototype/.vercel` local link folder was **left on
  disk** — two `rm -rf` attempts were declined. It's not tracked by git, so it's
  irrelevant to the repo and absent from any fresh clone / CI. But because it's
  physically present in *this* working tree, `.prettierignore` must keep its
  `prototype` entry or the prettier gate goes RED locally. Delete the folder
  manually (`rm -rf prototype/`) to fully retire the dir and that ignore line.
- **Historical references were intentionally NOT touched** — the session-46/47/49/53
  journals, `project/archive/2026-07-02-ui-remaster-variants.md`, and the
  `2026-07-02-ui-v2-fable-session.md` brainstorm still mention `prototype/`. That's
  correct: the journal/archive/brainstorm record is append-only history and
  legitimately references the dir as it existed at the time.

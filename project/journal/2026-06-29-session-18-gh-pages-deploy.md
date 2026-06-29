# Session 18 — 2026-06-29 — gh-pages deploy command

**Summary:** Added a one-shot `pnpm run gh-pages` publish command (build → sync → commit → push) backed by an orphan `gh-pages` worktree, and pushed the branch live for GitHub Pages.

## What changed
- `src/scripts/gh-pages.sh` — new publish script: typecheck+`vite build` → `rsync --delete` dist/ into the gh-pages worktree root → `.nojekyll` → commit + `git push origin gh-pages`. Worktree path overridable via `GH_PAGES_WORKTREE`.
- `package.json` — added `"gh-pages": "bash src/scripts/gh-pages.sh"`.
- Created orphan `gh-pages` branch in a sibling worktree at `../gh-pages-kami-kakushi` (outside the repo, untracked).
- Pushed `gh-pages` to `origin` (first deploy, root-commit `1fb551c`).

## Next intended steps
1. Human: Settings → Pages → Deploy from a branch → `gh-pages` / `/ (root)`. Site → https://raynos.github.io/kami-kakushi/
2. Re-run `pnpm run gh-pages` after any build change to republish.

## Landmines
- GitHub Pages branch deploy only serves from `/ (root)` or `/docs` — **not** `/dist`. We serve from the worktree root, so the gh-pages branch root *is* the site.
- `vite.config.ts` already uses `base: './'` (for itch.io) — that relative base is also what makes the `/kami-kakushi/` project-page subpath work with no extra config. Don't change it to an absolute base.
- The worktree lives at `../gh-pages-kami-kakushi` (sibling, untracked). If cloned fresh, recreate with `git worktree add --orphan -b gh-pages ../gh-pages-kami-kakushi`.
- Orphan-branch detection uses `git symbolic-ref --short HEAD` (works pre-first-commit); `rev-parse --abbrev-ref HEAD` does **not**.
- QA screenshots under `project/audit/screens/latest/` were dirty in the working tree at session start — not touched by this work, left unstaged.

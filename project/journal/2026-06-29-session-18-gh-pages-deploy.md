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

## Addendum — pre-push hard gate for main
- `.githooks/pre-push` — added a HARD GATE: a push that updates `refs/heads/main` now runs `npm run verify` and **blocks on red** (`SKIP_VERIFY=1 git push` overrides). Scoped to main only (feature branches + the gh-pages site push are not gated). The budget readout stays non-blocking below it. Rationale: pre-commit already gates verify, but its `SKIP_VERIFY=1` escape (used for intentional-WIP / audit checkpoints like `abb4b72`) lets a red commit sit on local main; main is the published branch (gh-pages deploys from it), so it needs a push-time backstop.
- Note: pre-commit was **already** correct — it runs the full 9-gate verify incl. vitest and blocks red (`.githooks/pre-commit:30`). No change needed there.
- False-alarm corrected: `origin/main` @ `abb4b72` is GREEN (104/104). The vitest red seen this session is the uncommitted re-baseline WIP (combat/fight/ranks/balance/intents + m2.test.ts), not committed code.

## Addendum — "checkpoint" formalized as a named behavior
- `CLAUDE.md` + `project/status/working-agreements.md` — defined **Checkpoint** = the resumability ritual: commit (own files, by explicit path) → stage journal → bring `project-status.md` current → **`git push origin main`** (fires the pre-push green gate) → confirm clean. Pushing main is now a **standing-approved part of a checkpoint**, overriding the generic "never push without approval" default for the routine main push (deploy/delete/force-push still need sign-off). Baked in three hard-won rules: **verify-before-claiming**, **shared-tree safety** (never stash/restore another agent's WIP; stage own files by path), **don't fight someone else's red** (their in-flight red WIP correctly blocks your push — leave the commit local, never SKIP_VERIFY a red tree onto the remote).

## Addendum — pre-push simplified to every-push/all-branches
- `.githooks/pre-push` — dropped the stdin/branch-detection complexity. Now simply: run `npm run verify` on **every push, all branches**, block on red (`SKIP_VERIFY=1` overrides). Also removed the old non-blocking budget readout (it re-ran verify 3× — wasteful once the gate runs verify once; budget drift is still tracked at commit time by pre-commit). CLAUDE.md + working-agreements.md updated from "scoped to main" → "every push".

## Landmines
- GitHub Pages branch deploy only serves from `/ (root)` or `/docs` — **not** `/dist`. We serve from the worktree root, so the gh-pages branch root *is* the site.
- `vite.config.ts` already uses `base: './'` (for itch.io) — that relative base is also what makes the `/kami-kakushi/` project-page subpath work with no extra config. Don't change it to an absolute base.
- The worktree lives at `../gh-pages-kami-kakushi` (sibling, untracked). If cloned fresh, recreate with `git worktree add --orphan -b gh-pages ../gh-pages-kami-kakushi`.
- Orphan-branch detection uses `git symbolic-ref --short HEAD` (works pre-first-commit); `rev-parse --abbrev-ref HEAD` does **not**.
- QA screenshots under `project/audit/screens/latest/` were dirty in the working tree at session start — not touched by this work, left unstaged.

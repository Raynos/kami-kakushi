# Session 47 — 2026-07-02 — gh-pages `--force` redeploy flag

**Summary:** Added a `--force` / `-f` flag to the `gh-pages` deploy script so a
byte-identical rebuild can still be published via an empty commit — needed when
GitHub Pages won't re-run its build without a new commit on the branch. No game
or design change; pure deploy tooling.

## What changed
- `src/scripts/gh-pages.sh` — parse `--force` / `-f` (reject unknown args). When
  the freshly-built site is byte-identical to what's published, the flag makes an
  empty commit (`git commit --allow-empty`) and pushes anyway; the default (no
  flag) still exits early with `✓ no site changes to publish` (now hinting at
  `--force`). Header usage comment updated. The DEV-marker strip gate and
  worktree sanity checks still run first — a leaked `__qa`/variant bundle refuses
  to deploy, force or not.

## Next intended steps
1. None for this thread — resume the active plans (koku-economy-t0-build,
   ia-tab-reorg-build) per `project-status.md`.

## Landmines
- Invoke through npm's arg passthrough: `npm run gh-pages -- --force` (the `--`
  is required; `--force` after it reaches the script as `$1`).
- `before.png` sits untracked at repo root — not authored this session; left
  untouched (shared-tree safety).

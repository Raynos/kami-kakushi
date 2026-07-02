# Session 48 — 2026-07-02 — screenshots off git + lossless capture compression

**Summary:** The repo had ballooned to **252MB** (177MB `.git`, 68MB working
tree) — ~95% of it committed QA screenshots (154MB of `.png` blobs across
history, dominated by `screens/latest/` being re-snapshotted and re-committed
every QA sweep). Stopped the bleed: only `screens/latest/` stays tracked now,
and every capture is losslessly shrunk on write (~33% off). Does **not** reclaim
the existing 177MB `.git` — that needs a history rewrite (force-push, separate
human sign-off; see "Next").

## What changed
- `.gitignore` — ignore `project/audit/screens/*` except `!.../latest/`. Only the
  live gallery is tracked; sweep/gallery folders are local-only from here on.
- Untracked **57** non-latest screens via `git rm --cached` (kept on disk, now
  gitignored) — the tracked screen set dropped 68 → 11 files.
- `src/scripts/qa-shots.mjs` — post-capture step runs `oxipng -o max --strip safe`
  over the fresh PNGs. Lossless (re-packs DEFLATE + row filters, pixels untouched;
  verified `magick compare -metric AE` = 0). Skips with a `brew install oxipng`
  hint if the binary is absent, so a QA run never fails on it.
- Compressed the existing `latest/` gallery in place: **10.5M → 7.0M** (33% off),
  pixel-identical.

## Why oxipng (not WebP / ImageMagick)
Benchmarked on real screenshots: oxipng ~64% of orig, WebP-lossless ~66% (but
`.webp` format churn), ImageMagick PNG ~98% (no gain — Playwright's PNG is
already decently packed). oxipng wins on ratio **and** keeps `.png`, so zero
harness/viewer/tooling churn. Installed via `brew install oxipng`.

## Next intended steps
1. **(needs human sign-off — destructive)** Reclaim the 177MB `.git` by stripping
   historical screenshot blobs (`git filter-repo` / BFG) + force-push. Rewrites
   every commit hash; anyone with a clone must re-clone. Clone would drop to ~5MB.

## Landmines
- oxipng is a **brew binary, not an npm dep** — a fresh clone won't have it; the
  harness degrades gracefully (uncompressed + a hint), it does not hard-fail.
- The 57 untracked screens still occupy 68MB **on disk** (working tree) — only
  removed from git tracking, not deleted. `du -sh project/audit/screens` = 68M.
- To keep a curated non-latest screenshot tracked, `git add -f` it past the ignore.
- `npm install` (needed for `tsx`/verify) rewrote `package-lock.json` (version
  `0.0.0`→`0.3.4` + `peer` normalization); restored it to keep this commit focused.
  That version-sync is a real latent lockfile staleness worth a separate look.

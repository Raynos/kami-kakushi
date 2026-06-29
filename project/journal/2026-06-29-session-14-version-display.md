# Session 14 — 2026-06-29 — wire a real version string into the Settings panel

**Summary:** Human asked what version the running game reports. Found the Settings panel's build stamp
(`render.ts`) was hard-stuck at `build dev · dev` — `__BUILD_SHA__`/`__BUILD_DATE__` defaulted to the literal
`'dev'` and the `build` script never set the backing env vars, so dev *and* the committed `dist/` both showed
`dev`, and no human-readable version (`v0.2`) appeared anywhere player-facing. Wired the stamp to resolve from
git at vite config-load time. Human picked the **clean-tag + full-describe** display shape.

## What changed
- `vite.config.ts` — resolve build identity from git at config load (works for both `vite` dev and `vite build`,
  no env wiring needed). Env vars still win when set (CI/reproducible builds); git is the fallback; `'dev'` only
  if git is unavailable. New `__VERSION__` (`git describe --tags --abbrev=0` → `v0.2`), `__BUILD_SHA__` now full
  `git describe --tags --dirty` (`v0.2-57-g5be5943-dirty`), `__BUILD_DATE__` now `git log -1 --format=%cs` (last
  commit date) instead of literal `'dev'`.
- `src/vite-env.d.ts` — declare `__VERSION__`; document the three stamps.
- `src/ui/render.ts:303` — panel now renders `Built agentically with Claude Code · {__VERSION__} · build
  {__BUILD_SHA__} · {__BUILD_DATE__}`.

## Verified
- `npm run verify` — all 9 gates green (4.35s).
- `npm run build` then grepped the bundle: `Built agentically with Claude Code · v0.2 · build
  v0.2-57-g5be5943-dirty · 2026-06-29`. (`-dirty` = uncommitted tree at build time; clears after commit.)

## Notes / next
- The stamp predates the git tags (speced under PRD §6.1.1 / Q54). A player-facing version display arguably wants
  an ADR / PRD acknowledgement, but this was treated as a small wiring fix, not a design change — flag for the
  ripple if the human wants it formalized.
- `-dirty` suffix is intentional signal (uncommitted build); a clean tagged build of `v0.2` would read just `v0.2`.

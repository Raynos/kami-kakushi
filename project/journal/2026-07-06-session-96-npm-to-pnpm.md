# Session 96 — 2026-07-06 — Switch tooling from npm to pnpm

**Summary:** The lockfile was already switched (commit eed79c6 dropped
`package-lock.json` for `pnpm-lock.yaml`), but the surrounding tooling still
invoked `npm`. This session completes the switch across CI, git hooks, and
release/dev scripts so the toolchain actually runs on pnpm.

## What changed
- `package.json` — add `"packageManager": "pnpm@10.33.0"`; `build:itch` now
  calls `pnpm run build`.
- `.github/workflows/{verify,lint,test,build,typecheck,e2e,verify-nightly}.yml`
  — add `pnpm/action-setup@v4` before `setup-node`, switch `cache: npm →
  pnpm`, `npm ci --no-audit --no-fund → pnpm install --frozen-lockfile`, and
  `npm run/npm test/npx → pnpm run/pnpm test/pnpm exec` (incl. the commented
  future nightly tenants).
- `.githooks/{pre-commit,pre-push}` — `npm run --silent verify → pnpm run`,
  `npx tsx → pnpm exec tsx`, and the human-facing guidance echoes to `pnpm run`.
- `src/scripts/ship.sh` — **functional fix:** the deps cache hashed
  `package-lock.json` (now gone, would abort under `set -e`) → hashes
  `pnpm-lock.yaml`; `npm ci → pnpm install --frozen-lockfile`; `npm pkg set →
  pnpm pkg set`.
- `src/scripts/gh-pages.sh` — `npm run build → pnpm run build` + comment sync.
- `src/scripts/herdr-dev-space.sh`, `src/scripts/session-brief.sh`,
  `vite.config.ts`, `.claude/hooks/enforce-headless-qa.sh` — `npm run dev` /
  `npm install` guidance strings → pnpm.

## Verification
- `pnpm install --frozen-lockfile` clean (wires hooks via `prepare`).
- `pnpm run verify` — all 17 gates green (7.1s).

## Next intended steps
1. (Optional) Cosmetic sweep of the remaining `npm run X` mentions in
   `.ts` source comments / error-message strings — they still work (npm is
   still present) but read stale. Many live in generated `*.gen.ts` headers, so
   that sweep edits the generators + regenerates, not the `.gen.ts` directly.

## Landmines
- CI order matters: `pnpm/action-setup` MUST precede `setup-node` or
  `cache: pnpm` fails (pnpm not yet on PATH). Kept that order.
- `pnpm run verify -- --flags` vs `pnpm run verify --flags`: pnpm forwards args
  without the `--`; `verify-run.ts` help already documents both forms.

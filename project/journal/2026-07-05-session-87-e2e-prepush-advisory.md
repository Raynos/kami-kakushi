# Session 87 — 2026-07-05 — pre-push e2e blast-radius advisory

**Summary:** The Playwright e2e lane gates only in CI (D-072 keeps it out of
`verify`'s 5s roster), so an agent pushing a mobile-UI or fixture change only
learned of an e2e red ~10 minutes later when `e2e.yml` failed. Added a loud,
never-blocking advisory to `.githooks/pre-push`: when the pushed range touches
the lane's covered surface (`e2e/`, `playwright.config.ts`, `src/fixtures/`,
`src/ui/styles.css`), it names the files and nudges a local
`npm run test:e2e` (~12s) before the push's CI run finds it. Advisory rung on
purpose — running the suite in the hook would blow the D-072 budget; a path
check costs ~nothing and can't cry wolf about anything but relevance.

## What changed
- `.githooks/pre-push` — capture the ref lines git feeds on stdin; after a
  green verify, diff each pushed range (`remote_sha..local_sha`; new refs use
  `merge-base` vs `origin/main`; ref deletes skipped) and warn if any file
  matches the e2e blast radius. `SKIP_E2E_WARN=1` silences; `SKIP_VERIFY=1`
  (emergency path) skips it along with everything else.
- `docs/living/qa-playtesting.md` — one sentence in the e2e lane's "Where it
  gates" paragraph documenting the advisory + its path list.

## Verification
- Hook exercised directly with stubbed `npm` and synthetic stdin: warn fires on
  a range containing `e2e/` changes (named all five touched files), stays
  silent on a docs-only range, and is a clean no-op on ref deletes, new
  branches at `origin/main`, empty stdin, and under `SKIP_E2E_WARN=1` — always
  exit 0.

## Next intended steps
1. None — self-contained. If `src/ui/` component changes start breaking
   journeys (not just layout CSS), widen the path list then; deliberately kept
   narrow now so the warn stays meaningful.

## Landmines
- The path list in the hook is hand-maintained; a new e2e-covered surface
  (e.g. a second stylesheet) needs adding to `_e2e_paths` AND the
  qa-playtesting.md sentence.
- The advisory reads stdin at the top of the hook — any future edit that moves
  `_push_refs="$(cat)"` below a command that consumes stdin will silently kill
  the warn (it can't go red; it just never fires).

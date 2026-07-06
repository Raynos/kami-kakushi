# Session 89 — 2026-07-06 — stop the e2e lane polluting the telemetry sensor

**Summary:** The 120 "real-play" telemetry reports the session brief flagged
were NOT human play — they were the `test:e2e` lane dropping a machine-time
report on every page teardown (F8 auto-drops on segment close, and telemetry
init is deliberately outside the `?dev=no` gate). Nuked the last-8h reports (89
files, git-ignored) and added a `?telemetry=no` opt-out flag the e2e lane now
passes on every boot. Proved zero drops across a full 73-test run.

## What changed
- `src/app/main.ts` — new `telemetryOff` flag parsed like `devOff`
  (`?telemetry=no|0|off|false`); telemetry init now gates on
  `import.meta.env.DEV && !telemetryOff`. Human `?dev=no` attended playtests
  still measure (the flag is opt-in), automated runs don't.
- `e2e/helpers.ts` — `boot()` appends `&telemetry=no` to every URL.
- `e2e/warm.ts` — the recycled `workerPage` boots `/?dev=no&telemetry=no`.
- `e2e/persistence.spec.ts` — the 3 direct `page.goto` navigations
  (reload-resume, export/import fresh profile, mid-intro refresh) carry
  `telemetry=no`.
- Deleted 89 `project/telemetry/*.md` reports from the last 8h (git-ignored
  local sensor data; README/.gitignore preserved).

## Next intended steps
1. None required — fix is complete and verified. If balance work resumes, the
   telemetry folder is now trustworthy again (only real attended play lands).

## Landmines
- Telemetry init is intentionally OUTSIDE the `if (dev)` / `?dev=no` gate
  (`?dev=no` human playtests ARE the sessions worth measuring). Don't "simplify"
  by folding it back into the dev gate — that would silently drop human data.
  The `telemetry=no` opt-out is the correct seam for machine runs.
- Verified by count-before/count-after around `npm run test:e2e`: 73 passed,
  DELTA 0. That is the proof the flag actually holds — re-run it if the boot
  path changes.

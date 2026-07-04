# Session 67 — 2026-07-04 — verify introspection flags

**Summary:** Added `--help`, `--verbose`, `--debug`, and `--performance`
introspection flags to `npm run verify` (the parallel gate runner). Previously
the runner captured every gate's output but only surfaced it on failure, and had
no usage/help — you couldn't see what it was doing or get the details on a green
run. No ADR (a dev-tooling ergonomics change, not a design change).

## What changed
- `src/scripts/verify-run.ts` — new flag layer on the runner:
  - `--help`, `-h` — usage + the full 15-gate roster (name/scope/cmd) + env
    knobs, then exit 0.
  - `--verbose`, `-v` — print **every** gate's captured stdout/stderr (pass and
    fail), plus a per-gate timing table.
  - `--debug` — implies `--verbose`; also prints the resolved config up front
    (concurrency, scope flags, PATH prepend, the exact roster).
  - `--performance`, `--perf` — a real pass/fail run **plus** the per-gate
    critical-path timing table (distinct from `--budget`, which is
    median-of-RUNS + the hard 5s check).
  - **Unknown flags now hard-fail** (exit 2, pointer to `--help`) instead of
    being silently ignored — makes the flag surface discoverable.
  - Extracted an `indent()` helper (was inline in the failure path), reused by
    the verbose dump.
  - Header-comment "Modes" block updated to list all the new flags.

## Next intended steps
1. (optional) Mirror a couple of the flags as npm aliases if the `--` passthrough
   friction proves annoying (`npm run verify -- --verbose`). Not done — pnpm
   forwards args directly, and `--help` documents the passthrough.

## Landmines
- Shared tree this session: another agent had in-flight WIP (an oxfmt/oxlint
  tooling migration touching `package.json`/`package-lock.json` + new
  `.oxfmtrc.json`/`.oxlintrc.json`, and a PRD ripple touching
  `docs/living/prd/02-systems.md`, `docs/living/prd/05-narrative.md`,
  `src/scripts/gen-prd-regions.ts`). I committed **only** `verify-run.ts` by
  explicit path and left all of that untouched.
- npm swallows bare args, so the flags need `npm run verify -- --flag`; pnpm
  forwards them directly. `--help` spells this out.

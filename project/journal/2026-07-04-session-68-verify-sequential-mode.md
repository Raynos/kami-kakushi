# Session 68 — 2026-07-04 — verify --sequential (retire drifted verify:seq)

**Summary:** Replaced the hand-maintained `verify:seq` npm script with a
`--sequential` mode on the parallel gate runner. `verify:seq` was an `&&` chain
that duplicated the `gates.ts` roster by hand and had **drifted** — it listed
only 10 of the 15 gates (missing `gen-prd-regions`, `milestone-integrity`,
`verify-changelog`, `doc-budgets`, `checkpoint`), so `npm run verify:seq` would
report green while silently skipping 5 real gates: a false-green (R3) waiting to
bite anyone who leaned on it for a debug run. No ADR (dev-tooling ergonomics +
a drift fix, not a design change); annotated the D-131 ADR that referenced the
now-removed script.

## Why

Found while auditing which package.json scripts run inside `verify` vs. float
outside it. `verify:seq` was the one genuinely-stale duplicate. It violated the
repo's "generate, don't duplicate — single source of truth" convention: the
roster lives in `gates.ts` and every other mode (default, `--budget`, the
introspection flags) reads it, but `verify:seq` re-typed it and rotted.

## What changed

- `src/scripts/verify-run.ts` — new `--sequential` (alias `--seq`) mode:
  - Runs the gates **one at a time in roster order**, streaming each gate's
    output **live** (`stdio: 'inherit'`) with a `▶ <name> (<cmd>)` header — the
    clean single-stream debug view `verify:seq` existed to give.
  - Reads the roster from `gates.ts` like every other mode, so it **can't
    drift** again. Respects the `SKIP_CODE_VERIFY` / `SKIP_DOCS_VERIFY` lane
    flags (loud scoped-run note) and the all-skipped guard.
  - **Not fail-fast** (the old `&&` chain stopped at the first red): runs the
    whole roster and summarises, which is strictly more informative for a debug
    pass, and a hang is obvious from which header printed last.
  - Extracted a shared `noteScope()` helper (the "loud, never-silent" scoped-run
    line), reused by both the sequential and parallel paths.
  - `--help` + the header "Modes" comment document the new mode.
- `package.json` — removed the `verify:seq` script.
- `docs/living/decisions.md` — appended a dated note under D-131 (which named
  `verify:seq` in its "swap tsc→tsgo" decision) recording the removal + the
  `--sequential` replacement, so the ADR stays accurate.

## Verification

- `npx tsx src/scripts/verify-run.ts --sequential` drives all **15** gates in
  roster order with live output and a timing table — proven RED-able (it
  correctly reported the pre-existing `checkpoint` failure below).
- Full parallel `verify` is green **except** `checkpoint`, whose two complaints
  are entirely another agent's in-flight WIP (`docs/plans/README.md` stale
  region + an `IN` status token in the staged `F3` plan) — **not** my change.
  My three files pass the full roster.

## Shared-tree note

Committed only my own files by explicit pathspec; left the other agent's staged
`F3` / `README` / `todo-human` WIP untouched. Did **not** push — the working
tree carries that agent's `checkpoint` red, and per the working agreements you
don't fight someone else's red onto the remote. Commit is local; push when the
tree is green.

## Next intended steps

1. (none required) — if the sequential view proves a common debug entry point,
   consider a `verify:seq` npm alias pointing at `verify-run.ts --sequential`
   (an alias to the runner, **not** a re-typed roster — the whole point).

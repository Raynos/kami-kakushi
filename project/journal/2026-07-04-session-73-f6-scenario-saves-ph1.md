# Session 73 — 2026-07-04 — F6 scenario-save library, Ph1

**Summary:** Built F6 Ph1 (fable-process-F6-scenario-saves) — the generated
scenario-save library's first slice: the spec model + shared drive loop, the
`gen-fixtures` generator (gen-docs `--check` idiom), the first two fixtures
(`fresh-R3-pre-wolf`, `pre-ascension`), and the `__qa.loadFixture`/`__qa.fixtures`
loader (backup-first). All four plan open-questions were confirmed at the
recommended defaults via AskUserQuestion (kept the six-fixture set, gate in the
verify roster with demote-on-breach, `?fixture=` in Ph2, prod console = no). Two
plan-vs-reality drifts caught and corrected (R2).

## What changed
- `src/fixtures/specs.ts` (new) — `FixtureSpec` model, `must()` assert, the shared
  `drive(s0, stop)` loop (a faithful mirror of `t0-arc.test.ts`'s `playToAscension`
  with a peek-and-stop predicate), `FIXTURE_SPECS` (2 specs), `buildFixtureState`.
- `src/fixtures/index.ts` (new) — DEV registry: `import.meta.glob` joins each spec
  to its generated envelope; `FIXTURES`, `getFixture`, `FIXTURES_SENTINEL` (strip
  gate, wired in Ph3).
- `src/scripts/gen-fixtures.ts` (new) — the generator: drive → assert `expect` →
  `makeEnvelope(state, 0, 0)` → pretty JSON; bare run writes + cleans orphans,
  `--check` byte-compares. Byte-stability proven (regen twice, identical sha).
- `src/fixtures/saves/fresh-R3-pre-wolf.json`, `pre-ascension.json` (new, generated).
- `src/app/main.ts` — import `toBase64` + `{ FIXTURES, getFixture }`; added
  `__qa.loadFixture` (backup-first → `qa.load(toBase64(JSON.stringify(env)))`) and
  `__qa.fixtures()` next to `load`.
- `src/persistence/index.ts` — re-export `toBase64` (additive).
- `package.json` — `fixtures:regen` / `fixtures:check` scripts.
- `.oxfmtrc.json` — ignore `src/fixtures/saves` (the generator is the SOLE formatter
  of those bytes; byte-stability needs exactly one writer).

## Plan-vs-reality drifts corrected (R2)
1. The gate roster is now `src/scripts/gates.ts` (extracted from `verify-run.ts`);
   the plan said `verify-run.ts` GATES. The Ph3 gate goes in `gates.ts`.
2. The formatter is **oxfmt** (`.oxfmtrc.json`), not prettier; the plan said
   `.prettierignore` (there is none). The ignore went in `.oxfmtrc.json` — exact
   precedent: `playcheck.baseline.json` is ignored there.

## Verification (Ph1 DoD)
- Byte-stable: `fixtures:regen` twice → identical sha; `fixtures:check` clean.
- Headless drive (tmp/drive-f6.mjs, playwright): `__qa.fixtures()` lists both;
  `loadFixture('fresh-R3-pre-wolf')` → R2 / kura / meter-full / wolf-unfought;
  `restoreBackup()` returns to the pre-load run (backup-first); `loadFixture(
  'pre-ascension')` → tier 0 / R7 / capstone / estate 480 EXCELLENT; unknown
  fixture → clean `{ok:false}`; zero page errors.
- My slice is green in isolation (tsgo my-files-clean, oxlint/oxfmt clean).

## Landmines
- **Shared-tree red (NOT mine):** another agent's uncommitted WIP on
  `src/core/pillars.ts` + `src/scripts/balance-sim.ts` (the H19/D-133 sub-koku
  `frac` deed work) makes tsgo + 3 vitest tests (`pillars.test`, `ascension`
  Phase-2, `save.test` populated round-trip) RED. That is THEIR red — do not touch
  those files, and do NOT push until the tree is green. This Ph1 commit is LOCAL
  only; `SKIP_VERIFY=1` was used to commit past their red (never for pushing).
- The DEV registry's prod-strip (FIXTURES_SENTINEL + gh-pages grep) is Ph3; Ph1
  relies on the same DEV-branch-only reference + tree-shake path as `ui/dev.ts`,
  to be PROVEN by a real build+grep in Ph3.

## Next intended steps
1. Ph2 — DEV panel "Scenarios" sub-tab + the remaining 4 specs (`rung-beat-ready`,
   `post-loss-broke`, `worn-weapon-no-wood`, `wealthy-idler`) + `?fixture=` boot param.
2. Ph3 — `fixtures.test.ts` round-trip + `fixtures:check` into `gates.ts` +
   `verify:budget` + gh-pages strip-grep + docs.

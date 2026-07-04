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

## Ph2 (same session) — DEV Scenarios tab + 4 fixtures + ?fixture=

**Summary:** Shipped the remaining 4 fixtures, the DEV panel "Scenarios" sub-tab,
and the `?fixture=` boot param. An exploration probe (`tmp/explore-f6.ts`) drove the
real engine to design each waypoint against REAL numbers — which caught more plan
drift (R2).

### What changed
- `src/fixtures/specs.ts` — `walkTo`, `grindUntil`, `bandName`, `WEALTHY_COIN_THRESHOLD`
  helpers; the 4 new specs (`rung-beat-ready`, `post-loss-broke`, `worn-weapon-no-wood`,
  `wealthy-idler`).
- `src/fixtures/saves/{rung-beat-ready,post-loss-broke,worn-weapon-no-wood,wealthy-idler}.json`
  (new, generated).
- `src/ui/dev.ts` — third "Scenarios" sub-tab (generalised the 2-tab selectTab to
  3); one row per fixture (name · blurb · Load, backup-first → enableRestore); the
  pane stamps `FIXTURES_SENTINEL` for the Ph3 strip gate.
- `src/ui/dev.test.ts` — both `stubQa` mocks gain `loadFixture`/`fixtures` (DevQa grew).
- `src/app/main.ts` — `?fixture=<name>` DEV boot param (backup-first → import → adopt).

### Plan-vs-reality drifts corrected (R2)
3. **The bandit is `minTier:2` — GATED OUT of any T0 fight.** The plan's `post-loss-broke`
   said "walk to the bandit, lose." Reality: the focused-optimal arc leaves the MC at
   LEVEL 1 (it barely fights), so it loses to the **monkey** deterministically — used
   that instead. `wolf`/`boar` are danger-gated (unreachable without conditioning).
4. The economy is **rice-based** (rice≈17k carried, coin≈0), not coin — so bleeds/banking
   run through `sell_rice`. Dearest estate cost is **1400** → wealthy threshold 2800.

### Verification (Ph2 DoD)
- All 6 regen byte-stable; `fixtures:check` clean; each waypoint asserted at gen-time.
- Headless panel drive (`tmp/drive-f6-ph2.mjs`): Scenarios tab + 6 Load rows; every
  fixture loads via a REAL panel click onto its waypoint; "↩ last backup" enables +
  restores after a load; `?fixture=post-loss-broke` boots into the rout (hp 1, banked
  rice 120 sheltered). Zero page errors.
- `post-loss-broke` nails the D-113 story: hp→1, carried rice bled, banked rice 120 safe.

## Ph3 (same session) — teeth + strip + docs (F6 DONE)

**Summary:** Shipped the round-trip test, the `fixtures` verify gate, the prod strip
proof, and the docs. The strip gate caught a REAL prod leak (R2/R3 payoff) and I
fixed it. F6 is done; full `npm run verify` GREEN (16 gates, 4.24s).

### What changed
- `src/fixtures/fixtures.test.ts` (new) — registry↔disk parity + `validateEnvelope`
  (with `migrate`) + each waypoint's `expect` (the teeth). 7 tests, ~2ms.
- `src/scripts/gates.ts` — added the `fixtures` gate (`gen-fixtures.ts --check`,
  scope code). `verify:budget` median 4.12s (0.88s headroom) → STAYS in the roster,
  no demotion. checkpoint regenerated the 15→16 gate-count regions (project-status,
  working-agreements) + the plans list (docs/plans/README.md after the archive move).
- `src/scripts/verify-dev-strip.sh` — added `__KAMI_FIXTURES__` + a fixture-name
  marker to the deploy strip grep.
- `src/fixtures/index.ts` — **made the registry LAZY (`getFixtures()`)**. The strip
  proof (real `npm run build` + grep) caught the fixture NAME + glob'd JSON leaking
  into prod: a top-level `FIXTURE_SPECS.map(… throw …)` const is a module side effect
  Rollup can't prove pure, so it pinned the DEV-only registry into the bundle despite
  every caller being behind `import.meta.env.DEV`. Computing inside a function makes
  the module side-effect-free → it dead-code-eliminates. Re-proven: zero sentinel /
  name / blurb bytes in `dist/`. main.ts + fixtures.test.ts updated to `getFixtures`.
- Docs: qa-playtesting.md §1 (loadFixture/fixtures row + a scenario-library subsection);
  repo-map.md (`src/fixtures/` entry).
- Plan graduated: Status ✅ DONE; `git mv` to `project/archive/`; reading-queue item
  removed from todo-human.md (D-089, human-directed build).

### Verification (Ph3 DoD)
- `verify` GREEN — 16 gates, 4.24s; round-trip test green; `verify:budget` 4.12s.
- Real build + `verify-dev-strip.sh`: zero fixture bytes in the prod bundle (the leak
  the gate caught is fixed and re-proven).
- The `fixtures` gate is RED-able: hand-edit a save → `--check` names the `.md` to regen.

## F6 — DONE. Landmine for the next agent
- **Still LOCAL only.** Ph1/Ph2 were committed with `SKIP_VERIFY=1` past another
  agent's then-red tree; Ph3 commits on a now-GREEN tree. If the tree is green at
  checkpoint, push; otherwise leave local and note it (the co-agents' capture.ts /
  AGENTS.md WIP is uncommitted — untouched by me).

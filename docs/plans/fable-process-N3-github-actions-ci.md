# GitHub Actions CI — parallel jobs, ~5-min budget, fast-lint groundwork

**Status: 📋 PROPOSED — awaiting human read.**

## Who builds this — Fable or Opus?

**Confidence: ( 70% Opus, 30% Fable )** — Ph3's lint/format cutover
guards the pure-core boundary rules; a missed parity gap is a silent
canon hole, so doubt routes Ph3 to Fable.

**Opus builds Ph1 + Ph2; Ph3 (the oxlint/oxfmt swap) is Fable-preferred.**
Ph1/Ph2 are mechanical YAML + shell against explicit, self-verifying DoDs
(a green run on a real push AND a deliberate could-go-RED proof). Ph3 is
where judgment bites: deciding the two-tier linter split still holds the
pure-core boundary bit-exactly, and triaging week-one false positives —
mis-calling either pollutes the gate roster (gates never cry wolf). A
careful Opus CAN run Ph3 because the parity DoD is procedural (§Ph3), but
any parity surprise should get a Fable-or-human read before cutover.

## Context — why now, what exists

- `src/scripts/verify-run.ts` is the single source of truth for the 12-gate
  roster and already runs them in parallel. Measured TODAY (2026-07-03,
  `npm run verify:budget`): **median 4.59 s, 0.41 s headroom** under the 5 s
  budget. Critical path: vitest 4.38 s · prettier 4.17 s · eslint 4.06 s ·
  tsc 3.89 s (under 12-way contention); all eight script gates ≤ 0.72 s.
- `.githooks/pre-commit` + `pre-push` already run full verify. CI's UNIQUE
  value, stated plainly:
  1. **It verifies the COMMITTED tree on a clean checkout** — this repo runs
     multiple concurrent agents in one shared dirty worktree; a recent
     incident briefly made origin/main link-dead while local verify stayed
     green. CI on a clean clone catches exactly that class.
  2. **A rung for slow suites** — the balance-sim plan
     (`docs/plans/fable-process-S4-balance-sim-gates.md` §5a) names
     CI-nightly as `verify:balance`'s first tenant, "if CI ever lands".
  3. **Prod build + DEV-strip grep on every push** — today that gate runs
     only at deploy time (`src/scripts/gh-pages.sh` step 1b).
- Repo is **PUBLIC** (`Raynos/kami-kakushi`) → Actions standard runners are
  free and unlimited, and public-repo `ubuntu-latest` has 4 vCPU.
- **No browser needed in CI.** All 12 gates are Node-pure: playcheck imports
  core + `node:fs`; vitest runs `environment: 'node'` (jsdom via npm, per-file
  pragma); md-links skips `http(s):` links entirely. The installed
  `playwright@1.61` npm package has **no install/postinstall script**, so
  `npm ci` never downloads browsers — the only rule is: never run
  `npx playwright install` in CI. Playwright is used solely by the manual QA
  scripts (`src/scripts/qa-shots.mjs`, `playtest.mjs`), which are not gates.
- All 12 gates are network-free and shallow-clone-safe (no gate shells out
  to git; `vite.config.ts` only needs `rev-parse --short HEAD` /
  `log -1 --format=%cs`, both fine at depth 1, and honors
  `BUILD_VERSION/BUILD_SHA/BUILD_DATE` env "CI / reproducible builds").
- Node: **no `.nvmrc`, no `engines`** today; local is v24.14.1 (active LTS).
  Pin it — node drift between agents/CI is a silent gate-divergence source.

## Design

### 1 · Workflow topology — two parallel push jobs + one nightly

Numbers first. Per-job FIXED cost on `ubuntu-latest` (estimates; Ph1's DoD
replaces them with measured values):

| step                              | est.            |
| --------------------------------- | --------------- |
| checkout (depth 1)                | ~5 s            |
| setup-node + npm cache restore    | ~10 s           |
| `npm ci --no-audit --no-fund`     | 15–40 s         |
| `npm run verify` (4 vCPU)         | 15–30 s         |
| `npm run build` + strip grep      | 15–25 s         |

The honest reading: **setup dominates**. A 6-way split (lint / format /
typecheck / test / content-gates / build) pays ~35–55 s of setup SIX times
to run gates that total ~5 s of work — the wall-clock is the same ~70–90 s
(setup-bound), the billed minutes triple (free here, but 6× the npm-registry
flake surface), and worst of all it **forks the gate roster into YAML**,
where it will drift from `verify-run.ts`. Reusing `npm run verify` means the
Ph3 lint swap — and every future gate — lands in CI with zero workflow
edits. The 12 gates already run 12-wide *inside* the job.

So `verify.yml` gets exactly the two genuinely different workloads, run in
parallel:

- **job `verify`** — `npm ci` + `npm run verify` — est. **50–85 s**
- **job `build-strip`** — `npm ci` + `npm run build` + DEV-strip grep —
  est. **55–90 s**

Parallel wall-clock ≈ **1.5 min worst case** → the 5-min target is met with
>3× margin. "Multiple jobs in parallel" is satisfied where it is honest.

```yaml
# .github/workflows/verify.yml (shape, not verbatim)
on:
  push: { branches-ignore: [gh-pages] }
  workflow_dispatch: {}
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true      # agents push often; newest commit wins
jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci --no-audit --no-fund
      - run: npm run verify
  build-strip:
    # same setup; then: npm run build && src/scripts/verify-dev-strip.sh
```

Trigger recommendation: **push on all branches except gh-pages** (worktree
branches get the same clean-room check; gh-pages carries no workflows
anyway), plus `workflow_dispatch`. No time-based gate in CI — the 5 s budget
is a LOCAL drift instrument; runner timing differs run-to-run and a
wall-clock assertion in CI would cry wolf. No auto-retries: the gates are
deterministic, and a retry that launders a real flake is the mirror image of
crying wolf.

### 2 · Caching

- `actions/setup-node` with `cache: npm` keyed on `package-lock.json`
  (caches `~/.npm` tarballs; saves ~10–20 s of `npm ci`).
- **Playwright browsers: nothing to install, nothing to cache** (verified
  above — the single biggest potential time sink simply does not apply).
- tsc/vite caches: **skip**. tsconfig isn't `incremental`, a cold tsc is
  seconds on the runner, and cache restore would cost what it saves.
  Revisit only if `build-strip` ever exceeds ~2 min.

### 3 · Nightly stub — `verify-nightly.yml`

`schedule: cron '17 3 * * *'` (off the hour — GitHub delays on-the-hour
crons). Thin on purpose:

- full `npm run verify` + prod build + strip on a scheduled clean clone
  (a daily canary even on push-free days);
- a **commented placeholder block** naming the intended tenants —
  `npm run verify:balance` matrix + fuzz (the balance-sim plan §5a moves in
  when built), future soak suites. Deliberately NOT a silently-skipping
  step: a step that no-ops when a script is missing is a gate that cannot
  go red. The balance-sim plan edits this file when its Ph lands.

### 4 · The perf swaps — grounded verdicts (R2: verified, not vibes)

**The acceptance test** is the pure-core boundary in `eslint.config.js`
(PRD §6.1/§6.2), four rules scoped to `src/core/**/*.ts`:

1. `no-restricted-globals` — 15 DOM/net globals banned;
2. `no-restricted-properties` — `Math.random`, 21 transcendental `Math.*`,
   `Date.now`, `performance.now`;
3. `no-restricted-syntax` — `new Date()` via the esquery selector
   `NewExpression[callee.name='Date']`;
4. `no-restricted-imports` — patterns `**/ui`, `**/app`, `**/persistence`.

**eslint → oxlint: TWO-TIER, not full swap.** Grounded (July 2026):

- oxlint implements `no-restricted-globals` (per-global messages),
  `no-restricted-imports` (paths + patterns) and — since v1.63.0 —
  `no-restricted-properties`. Three of four express directly.
- oxlint does **NOT** implement `no-restricted-syntax` with esquery
  selectors — the request (oxc discussion #11649, June 2025) was still
  unanswered as of June 2026. That is the `new Date()` ban.
- oxlint JS plugins (ESLint-compatible custom-rule API) shipped **alpha**
  March 2026 — not gate-grade for the crown jewels yet.
- 2026 bug reports against `no-restricted-imports` (#19237 namespace-import
  false flags, #19956 side-effect-import false negatives, #21920 duplicate
  reports) argue against moving the boundary rules even where supported.

The two-tier split, exactly:

- gate `oxlint` = `oxlint .` — repo-wide fast 95%: correctness category +
  rules matching `js.configs.recommended` / `tseslint.recommended` +
  `no-unused-vars` with the `^_` ignore patterns, in `.oxlintrc.json`.
- gate `eslint-core` = `eslint src/core` — the EXISTING flat config,
  untouched, scoped to ~30 core files. All four boundary rules keep
  bit-exact eslint semantics at ~1–1.5 s (startup-bound, no typed rules).

Footnote for a later full exit: `src/core` uses no `Date` at all today, so
banning the `Date` GLOBAL outright (oxlint `no-restricted-globals`) would
subsume both `new Date()` and `Date.now` — park until JS plugins stabilize.

**prettier → oxfmt: ADOPT IN PH3 BEHIND A PARITY PROOF; fallback
`prettier --check --cache`.** Grounded: oxfmt alpha was announced Jan 2026
(InfoQ/VoidZero); by mid-2026 the oxc docs present it as the recommended
dedicated formatter, claiming 100% of Prettier's JS/TS conformance tests and
~30× Prettier's speed, covering every type this repo formats (ts/js/json/
html/css; `*.md` is prettierignored). A migrate-from-prettier guide exists
but "some defaults and CLI options differ" — so parity is PROVEN on this
tree, never assumed: `oxfmt --check` must be green AND write-mode oxfmt on a
scratch copy must yield **zero `git diff`** against the prettier-formatted
tree. Any diff → defer the swap and land `--cache` on the prettier gate
instead (repeat local runs drop to well under 1 s; CI is cold either way).
Biome and dprint were considered and passed over: lower/unknown Prettier
conformance on this tree plus config migration; oxfmt is the natural pick.

**Expected local verify win** (baseline median 4.59 s): prettier 4.17 s →
~0.1 s; eslint 4.06 s → oxlint ~0.1 s + eslint-core ~1–1.5 s. Two of the
four heavies leave the pool, so tsc/vitest also shed contention. Estimated
new median **~3.5–4.0 s** (headroom 1.0–1.5 s vs 0.41 s today). Honest cap:
vitest (4.38 s) remains the critical path — this buys headroom, not a new
floor. CI inherits the whole swap for free because CI runs `npm run verify`.

### 5 · Failure surfacing — minimal set

1. **README badge** for verify.yml (one line, above the seed-prompt note).
2. **session-brief.sh**: one guarded line, inside the brief's ≤5 s budget —
   `timeout 2 gh run list -L1 -b main -w verify.yml --json conclusion …`
   with a hard fallback of `(CI: status unavailable)` when gh/network fails.
3. **Email**: GitHub already mails the pushing account on workflow failure
   by default. Keep it; wire nothing else.

### 6 · Branch/PR story — post-push verification, honestly

This repo commits straight to main (no PRs), so CI **cannot prevent** a red
main — it can only surface one in ~90 s. That is acceptable and by design:
the pre-push hook is the prevention layer; CI is the clean-room double-check
that catches what the shared dirty worktree hides. No PR gates until PRs
exist.

**Deploy composition (stub only — NOT owned here).** The sibling /ship
release-skill plan (`docs/plans/fable-process-N10-ship-skill.md`) owns
deploy. Hook points left for it: `verify.yml` has `workflow_dispatch`; Ph2
extracts the strip gate into `src/scripts/verify-dev-strip.sh` so
gh-pages.sh, CI, and a future `deploy.yml` (building from clean HEAD) all
run the IDENTICAL gate. A gh-pages deploy job lives in that plan, not this
one.

## Phases

### Ph1 — `verify.yml`, green AND provably RED-able

Steps: add `.nvmrc` (`24`); add `.github/workflows/verify.yml` with the
`verify` job only (checkout depth 1 → setup-node `node-version-file` +
`cache: npm` → `npm ci --no-audit --no-fund` → `npm run verify`);
concurrency-cancel per ref; `timeout-minutes: 10`.

DoD:

- Green run on a real push; wall-clock + `npm ci` timing recorded in the
  journal (replacing this plan's estimates).
- **Could-go-RED proof (R3)**: a scratch commit with a deliberate lint
  violation goes RED in Actions, then is reverted.

### Ph2 — build+strip job, nightly stub, surfacing

Steps: extract gh-pages.sh step 1b into `src/scripts/verify-dev-strip.sh`
(gh-pages.sh calls it; behavior identical — greps `__qa` and
`__KAMI_DEV_PANEL__` in `dist/assets/*.js`); add the `build-strip` job; add
`verify-nightly.yml` (schedule + the placeholder tenant block); README
badge; session-brief CI line.

DoD:

- Both push jobs green in parallel; total wall-clock recorded (< 2 min
  expected).
- Strip gate RED proof: plant `__qa` in a dist asset locally → script
  exits 1.
- `npm run gh-pages` still works end-to-end (no deploy behavior change).
- session-brief completes < 5 s with network unavailable (fallback line
  exercised).

### Ph3 (optional, separately committable) — oxlint two-tier + oxfmt

Steps: add `oxlint` + `.oxlintrc.json`; change `verify-run.ts` GATES:
`eslint .` → `oxlint .` + `eslint src/core`; keep a `lint:eslint-full`
escape-hatch script for the side-by-side week. Then oxfmt: run the parity
proof; if clean, swap the prettier gate + `format`/`format:check` scripts;
if not, land `prettier --check --cache` and file the diff upstream.

DoD:

- **Boundary-parity proof**: a scratch file in `src/core` containing all
  four violation classes (`window`, `Math.pow`, `new Date()`, an import
  from `../ui`) — OLD full eslint and the NEW two-tier gate set BOTH report
  all four; zero missed violations before cutover.
- oxfmt zero-diff parity (or the documented fallback taken).
- `verify:budget` before/after recorded; expected median ≤ 4.0 s.
- One week of zero false-positive gate failures before deleting
  `lint:eslint-full`.

## Risks (each with a proposed default)

- **Minutes cost**: $0 while public. If ever private: 2 jobs × ~1.5 min ×
  20–40 agent pushes/day ≈ 60–120 min/day → blows the 2000/mo free tier.
  Default: fine now; revisit on any visibility change.
- **npm-registry flake → false red.** Default: npm cache + NO auto-retry
  (retries launder real flakes); manual re-run; if > 1 false red/week, add
  one retry on the `npm ci` step ONLY.
- **Node version drift** (local 24.14.1 vs runner). Default: `.nvmrc` is
  the single pin; setup-node reads it; 24.x minor skew is acceptable.
- **oxlint rule gaps / false positives** (no `no-restricted-syntax`; known
  `no-restricted-imports` bugs). Default: boundary rules never leave eslint
  (two-tier); pin oxlint to an exact version; week-one watch before
  deleting the full-eslint escape hatch.
- **verify-run on 4 vCPU**: pool = `cpus().length` = 4, gates queue; worst
  case ~2× local wall (still ≤ ~30 s). Default: nothing — the pool adapts.
- **Scheduled workflows auto-disable** after 60 days of repo inactivity.
  Default: accept (repo commits daily).
- **cancel-in-progress** could cancel the only run of a commit that later
  becomes HEAD again. Default: accept — the next push re-verifies; nobody
  force-pushes main.

## Open questions

1. Push CI on ui-demos-/docs-only commits? Default: **yes** — runs are
   cheap and path filters add a silent-skip class of bugs.
2. Badge atop README (a preserved historical artifact)? Default: yes, one
   line above the note.
3. Should nightly also sweep md-links over history/scratch dirs (unscanned
   by design, A22)? Default: no — their staleness is deliberate.
4. oxfmt/oxlint version bump cadence. Default: exact pins, bumped
   deliberately with a verify:budget re-measure.

## Grounding (verified 2026-07-03)

- oxlint `no-restricted-globals`:
  <https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-globals>
- oxlint `no-restricted-imports` (+ 2026 bug reports #19237/#19956/#21920):
  <https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports>
- oxlint `no-restricted-properties` (added v1.63.0):
  <https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-properties>
- `no-restricted-syntax` unsupported (open, unanswered):
  <https://github.com/oxc-project/oxc/discussions/11649>
- oxlint JS plugins alpha (2026-03-11):
  <https://oxc.rs/blog/2026-03-11-oxlint-js-plugins-alpha>
- oxfmt status + conformance claims:
  <https://oxc.rs/docs/guide/usage/formatter.html> ·
  <https://www.infoq.com/news/2026/01/oxfmt-rust-prettier/> ·
  <https://oxc.rs/docs/guide/usage/formatter/migrate-from-prettier>
- Local measurements: `npm run verify:budget` (this session): median 4.59 s;
  playwright@1.61 package has no install script (checked in node_modules);
  repo visibility PUBLIC via `gh repo view`.

---
name: kami-build-and-env
description: >-
  The kami-kakushi build system and environment runbook: fresh
  clone→running, the verify anatomy (gates.ts roster, parallel runner,
  the 5s-soft/8s-HARD commit budget, commit vs push lanes, @slow,
  VERIFY_FULL), the execution truth table (dev loop / commit / push /
  CI / nightly), the CI workflow map, and the dev-server law (:5264
  shared, :5265 e2e). Load when: setting up or resuming this repo cold;
  asking "how do I run / build / test / verify this"; deciding where a
  check RUNS or why the verify budget exists (commit
  vs push vs CI vs nightly); the dev server seems down or you're
  tempted to start one; wondering why "pnpm version" is banned or what
  tsgo is; or CI is red and you need to know which workflow saw what.
---

# kami-build-and-env — build, verify, and environment runbook

The operational ground truth for building and running kami-kakushi.
Per-gate RED-fix detail lives in **kami-verify-gates**; the full
SKIP_*/env-flag catalog lives in **kami-config-and-flags**. This skill
owns the *shape* of the system: what runs where, when, and why.

## 1. Fresh clone → running

| # | Step | Evidence |
|---|---|---|
| 1 | Node **24** (`nvm use` reads `.nvmrc`); pnpm **10.33.0** (corepack honors `packageManager`) | `.nvmrc`; package.json:8 |
| 2 | `pnpm install --frozen-lockfile` (the CI form, verify.yml:32). The `prepare` script auto-runs `git config core.hooksPath .githooks` | package.json:10 |
| 3 | If prepare didn't run (e.g. install was skipped): `git config core.hooksPath .githooks` — hooks are load-bearing here, not optional | AGENTS.md; every hook header |
| 4 | `pnpm run verify` — the full gate roster in parallel; commit lane ~3s | package.json:44 |
| 5 | Reach the running game: `http://localhost:5264` — the SHARED herdr-pane dev server. **Never start your own** (see §5) | vite.config.ts:118 |

There is no separate vitest/eslint/prettier config: vitest config is
inside `vite.config.ts` (`test:` block), lint is `.oxlintrc.json`,
format is `.oxfmtrc.json`, typecheck is `tsconfig.json` — all at repo
root.

```bash
pnpm run build        # tsgo --noEmit && vite build → dist/  (package.json:12)
pnpm test             # vitest run — whole suite, no lanes    (package.json:16)
pnpm run test:e2e     # Playwright, self-managed server :5265 (package.json:18)
pnpm run verify:budget # median-of-3 timing + per-gate breakdown (package.json:45)
```

## 2. Verify anatomy

- **`src/scripts/gates.ts` is the SINGLE source of truth** for the
  gate roster (its header says so; checkpoint.ts regenerates the
  gate-count doc regions from it via `pnpm run checkpoint`). Add or
  remove a gate THERE and nowhere else. **Never hand-type the gate
  count** — count it:

  ```bash
  grep -c "name: '" src/scripts/gates.ts   # 21 as of 2026-07-18
  ```

  (The roster is never forked into YAML — verify.yml just runs
  `pnpm run verify`.)

- **Parallel runner** (`src/scripts/verify-run.ts`): worker pool,
  default = CPU count, `VERIFY_CONCURRENCY` overrides
  (verify-run.ts:147). Modes: `--sequential` (live-streamed serial
  debug view — reads the same roster, so it can't drift; the old
  hand-maintained `verify:seq` drifted to 10/15 gates and was killed,
  ADR-131 update note), `--verbose`, `--debug`, `--performance`,
  `--budget`, `--help`.

- **Budget — 5s soft / 8s HARD (ADR-176, refining ADR-072)**: the
  pre-commit hook times verify; >5s warns, **>8s BLOCKS the commit**
  (.githooks/pre-commit:33-34,65-73). Escape for a genuinely loaded
  box: `SKIP_BUDGET=1`. The cure for a slow suite is `// @slow`
  tagging, never widening the budget. Timings log to
  `tmp/precommit-timings.tsv` (pre-commit:63).

- **Commit lane vs push lane (the `vitest` gate)**: at commit,
  `src/scripts/vitest-verify.ts` runs every `*.test.ts` EXCEPT files
  carrying a `// @slow` pragma in their first 2048 bytes (regex
  `/^\s*\/\/\s*@slow\b/m`, vitest-verify.ts:45-48). No hand-maintained
  exclude list — the scanner finds them. `VERIFY_FULL=1` runs
  everything (vitest-verify.ts:32); pre-push and CI set it, so nothing
  @slow leaves the machine unverified. Count the current @slow set:

  ```bash
  grep -rlE '^\s*//\s*@slow' src --include='*.test.ts' | wc -l   # 12 as of 2026-07-18
  ```

- **Scope lanes**: each gate declares `scope: 'code'|'docs'|'both'`
  (gates.ts:11-13). `SKIP_CODE_VERIFY=1` (docs-only commit; docs
  gates still run ~1s) and `SKIP_DOCS_VERIFY=1` are **commit-time
  only** — pre-push force-unsets both (`env -u`, .githooks/pre-push:36)
  and `--budget` ignores them. Full flag semantics:
  **kami-config-and-flags**.

## 3. Execution truth table

| Context | Command | What runs | Duration / cap |
|---|---|---|---|
| Dev loop (manual) | `pnpm test` | all `*.test.ts`, no lanes | uncapped |
| Commit (pre-commit hook) | `pnpm run verify` (automatic) | full roster in parallel; vitest COMMIT lane (no @slow) | ~3s; 5s soft / **8s HARD** (ADR-176) |
| Push (pre-push hook) | `env -u SKIP_CODE_VERIFY -u SKIP_DOCS_VERIFY VERIFY_FULL=1 pnpm run --silent verify` (pre-push:36) | full roster incl. @slow; RED blocks the push | ~30-40s, deliberately unbudgeted (verify-run.ts header) |
| CI, every push | 6 workflows (see §4) | verify (VERIFY_FULL=1) + atomic checks + e2e | 10 min timeouts (e2e 15) |
| Nightly | verify-nightly.yml, cron `17 3 * * *` | clean clone → full verify → prod build → dev-strip proof → `verify:tooling` | 15 min |
| E2E local | `pnpm run test:e2e` | Playwright, 3 projects, own server :5265 | **~50s local** (qa-playtesting.md:212) |
| On-demand budget check | `pnpm run verify:budget` | median-of-3 full-roster timing + per-gate critical path | ~30s |

## 4. CI workflow map (.github/workflows/)

| Workflow | Steps | Why it exists |
|---|---|---|
| verify.yml | `pnpm run verify` with `VERIFY_FULL: 1` (verify.yml:36-38) | the authoritative "everything passed" backstop |
| test.yml | `pnpm test` | atomic vitest, readable at a glance |
| typecheck.yml | `pnpm run typecheck` (tsgo) | atomic |
| lint.yml | `pnpm run lint` + `pnpm run format:check` | atomic |
| build.yml | `pnpm run build` + `verify-dev-strip.sh` (build.yml:26-27) | prod bundle + proof `__qa`/DEV panel are stripped |
| e2e.yml | `playwright install --with-deps chromium webkit` → `pnpm run test:e2e` | the Playwright lane — **CI-only by budget** (ADR-072); no local hook runs it |
| verify-nightly.yml | clean clone → `VERIFY_FULL=1 verify` → build → dev-strip → `verify:tooling` | daily RED-able canary even on push-free days |

Notes:

- `verify:tooling` (the process-scaffolding meta-suite: git hooks,
  guards, brief probes) is **nightly-only on purpose** — it spawns
  dozens of processes (verify-nightly.yml comment).
- verify-nightly.yml keeps future tenants (`verify:balance`, fuzz,
  soak) **commented out, not present-but-skipping** — a silently
  no-op step can never go RED (PH3; the comment block says exactly
  this).
- **ADR-189 — CI's answer is READ, not re-derived**: the e2e lane is
  the one check nothing local sees, so `session-brief.sh` fetches
  main's latest verify.yml + e2e.yml conclusions via `gh run list`
  (time-boxed 2s; session-brief.sh:292-330) and shouts a red e2e as
  the first thing a session sees. The incident: e2e sat RED on main
  for two unread CI runs (a4863592 → 8f746f54). If the brief shows
  e2e red, reproduce with `pnpm run test:e2e` BEFORE new work.

## 5. Dev-server law

- **One dev server, the shared one, on :5264** ("KAMI" on a phone
  keypad; port chosen 2026-07-17 after other prototypes' vite
  cascades kept stealing 5173 — vite.config.ts:115-118). It runs in a
  dedicated herdr pane; every agent points headless drivers at
  `http://localhost:5264` and REUSES it. **Never `pnpm run dev` your
  own, never kill the holder** — a vite-level `singleServerGuard`
  (vite.config.ts:120) and the `guard-dev-server.sh` PreToolUse hook
  both block it. If :5264 is genuinely dead, **ask the human** to
  relaunch the pane. (AGENTS.md "One dev server"; the law dates from
  2026-07-10 when the port was still :5173.)
- **The e2e lane manages its OWN server on :5265**
  (playwright.config.ts:18) — its webServer command is
  `KAMI_ALLOW_MULTI_DEV=1 pnpm exec vite --port 5265 --strictPort`
  (playwright.config.ts:40), which is the sanctioned use of that
  escape. Incident behind the port: another repo squatted the old
  5199 and `reuseExistingServer` drove the WRONG game — 115 red
  tests (playwright.config.ts:14-17, 2026-07-17).
- **No auto-reload, ever** (TST2 — never yank the ground from under
  the player): `hmr: false` (vite.config.ts:278) + an inert
  `/@vite/client` stub + `watch: { usePolling: true, interval: 250 }`
  (vite.config.ts:281) so a manual F5 always serves fresh code.
  Don't "fix" HMR being off — it's a design decision with two
  recorded incidents behind it (vite.config.ts:220,273 comments).
- Solo fresh clone (no herdr, port free): `pnpm run dev` serves
  :5264 with `strictPort: true` (vite.config.ts:257) — it never
  cascades to another port.

## 6. Known traps

1. **`pnpm version x.y.z` is BANNED in this shared tree** — it
   bare-commits the shared index (sweeping co-agents' staged work).
   Releases go through **`/ship`** (human-invoked only), which does
   the safe explicit equivalent — `pnpm pkg set` → pathspec commit →
   `git tag` — and builds from an isolated detached worktree
   `tmp/ship/wt` so co-agent WIP can't leak into a deploy (AGENTS.md
   "Keep a CHANGELOG" bullet; src/scripts/ship.sh header).
   UNVERIFIED: AGENTS.md:277 also blames a "pinned-at-`0.0.0`
   lockfile root"; the current pnpm-lock.yaml (lockfileVersion 9.0)
   has no root version field — the shared-index sweep is the
   verified reason.
2. **tsgo is the typecheck compiler, and it's a preview** —
   `typecheck`/`build` run `tsgo --noEmit`
   (`@typescript/native-preview`), swapped from tsc for a ~3.15s →
   ~0.39s gate (ADR-131, decisions/100.md:804). The `typescript`
   devDep is kept deliberately as the escape hatch: if tsgo ever
   mis-types, the bail-out is one line — `tsgo --noEmit` back to
   `tsc --noEmit` in gates.ts.
3. **Markdown is excluded from the formatter** — `.oxfmtrc.json`
   ignores `*.md`, `docs`, journal/brainstorm/archive/audit dirs,
   `tmp`, `project/prototypes`, `src/fixtures/saves`,
   `project/playtest-inbox`. So `pnpm run format` never touches
   prose; the ~72-char wrap is a soft norm (AGENTS.md), and
   `pnpm run md:wrap` exists for it.
4. **The pure-core boundary is a LINT rule, not just a norm** —
   `.oxlintrc.json:27-34` bans `window`/`document`/`localStorage`/etc.
   as `no-restricted-globals` errors in `src/core/**/*.ts`
   (non-test). A DOM import in core fails the oxlint gate.
5. **Hooks silently absent = no gates at all.** If commits succeed
   with zero gate output, check `git config core.hooksPath` — it must
   print `.githooks`. The `prepare` script sets it on install, but a
   clone that never ran `pnpm install` has no hooks.
6. **Editing anything vite.config.ts imports restarts the server
   in-process** (playtest-inbox.ts, telemetry-drop.ts). The guard's
   self-pid exemption exists because without it the server killed
   itself on every such edit (vite.config.ts:108-113). Expect a brief
   restart, not a dead server.
7. **verify green ≠ e2e green.** The Playwright lane gates only in
   CI; commit + push hooks are all green while e2e.yml rots. The
   pre-push blast-radius advisory names pushed files matching
   `^src/tests/e2e/|^playwright\.config\.ts$|^src/fixtures/|^src/ui/styles\.css$`
   (pre-push:52) — when it fires, run `pnpm run test:e2e` locally
   before pushing.

## When NOT to use this skill

- A specific gate is RED and you need its fix recipe →
  **kami-verify-gates** (owns all per-gate what/why/RED-fix detail).
- You need a SKIP_*/env flag, URL param, or vite define →
  **kami-config-and-flags** (owns the catalog + add-a-flag
  checklist; this skill names lane flags only where the lane shape
  requires it).
- Deciding whether a change needs human sign-off or which procedure
  applies → **kami-change-control**.
- Driving/observing the running game (`window.__qa`, screenshots,
  symptom triage) → **kami-debugging-playbook**; visual capture →
  the existing `capture-game-states` skill.
- Cutting a release → the existing `/ship` skill (human-invoked).
- Ending a session cleanly (commit → journal → snapshot → push) →
  the existing `/prepare-to-exit` skill.
- Writing tests correctly (RED-ability, fixtures-from-source,
  @slow etiquette) → the existing `tdd` skill + AGENTS.md's
  test-discipline bullet.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (a co-agent
had uncommitted talk-system WIP in the working tree; all facts here
were checked against committed canon or config files that WIP does
not touch). Volatile facts are date-stamped inline. Re-verify:

```bash
cat .nvmrc                                    # node version (24)
grep packageManager package.json              # pnpm version (10.33.0)
grep -c "name: '" src/scripts/gates.ts        # gate count (21)
grep -rlE '^\s*//\s*@slow' src --include='*.test.ts' | wc -l  # @slow count (12)
grep -n 'DEV_PORT' vite.config.ts             # dev port (5264)
grep -n 'const PORT' playwright.config.ts     # e2e port (5265)
grep -n 'SOFT_S\|HARD_S' .githooks/pre-commit  # budget (5/8; pre-commit only)
ls .github/workflows/                         # CI workflow set (7 files)
git config core.hooksPath                     # must print .githooks
```

(The 4bfb3ba3-era stale-comment corrections — verify.yml "15
gates", pre-push "~12s", vite.config.ts "5199" — were deleted from
this skill 2026-07-18 after `919c2c61` fixed the comments in place,
per the original drift-watch note.)

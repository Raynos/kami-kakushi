<!-- ONE file per session. Chronological LOG (history), not live state. -->

# Session 66 — 2026-07-04 — F2 GitHub Actions CI (Ph1 + Ph2)

**Summary:** Built the Opus-owned half of
[`fable-process-F2-github-actions-ci.md`](../../docs/plans/fable-process-F2-github-actions-ci.md)
— Ph1 (`verify.yml`) + Ph2 (build-strip job, nightly canary, strip-gate
extraction, failure surfacing). Ph3 (oxlint/oxfmt swap) is deliberately left
for a Fable-routed follow-up per the plan's "Who builds this" (70/30 → Ph3
Fable). The internals were built by three parallel subagents (disjoint
file-lanes), then integrated + verified here. Live snapshot:
[`project-status.md`](../status/project-status.md).

## What changed
- `.nvmrc` — **new.** Single Node pin (`24`); setup-node reads it via
  `node-version-file`. Kills node drift between agents/CI as a silent
  gate-divergence source.
- `.github/workflows/verify.yml` — **new.** Two parallel push jobs — `verify`
  (`npm ci` + `npm run verify`) and `build-strip` (`npm ci` + `npm run build`
  + the extracted strip gate). `push` on all branches except `gh-pages`, plus
  `workflow_dispatch`; concurrency-cancel per ref (newest push wins);
  `timeout-minutes: 10`. Deliberately reuses `npm run verify` so the gate
  roster never forks into YAML (it stays in `src/scripts/verify-run.ts`).
- `.github/workflows/verify-nightly.yml` — **new.** Scheduled clean-clone
  canary (`cron '17 3 * * *'`, off-the-hour) — full verify + build + strip on
  push-free days. Carries a **commented** future-tenant block (F4
  `verify:balance` matrix + fuzz, soak) — commented, not present-but-skipping,
  so it can't be a gate that never goes red.
- `src/scripts/verify-dev-strip.sh` — **new, executable.** The D-067/D-075
  ship-hygiene gate extracted verbatim from `gh-pages.sh` step 1b (greps
  `__qa` + `__KAMI_DEV_PANEL__` in `dist/assets/*.js`, exit 1 on leak).
  Self-locating `REPO_ROOT` so it runs standalone, from gh-pages.sh, and in
  CI. One source of truth for gh-pages, CI, and a future `deploy.yml` (F9).
- `src/scripts/gh-pages.sh` — step 1b body replaced by a single call to the
  new script; behavior byte-identical; step comment header kept.
- `README.md` — CI status badge for `verify.yml`, one line above the
  preserved seed-prompt note.
- `src/scripts/session-brief.sh` — one time-boxed (2s) guarded line surfacing
  main's latest CI conclusion; hard fallback to "status unavailable" so
  gh/network failure never hangs or aborts the ≤5s brief.

## Verification (done is earned — R3)
- **Local `npm run verify` green** — 15 gates, 3.85s (working tree, including
  another agent's in-flight F1b archival, was green).
- **Strip gate proven RED-able** on a *real* prod build: green on clean
  bundle → planted `__qa` in a dist asset → **exit 1** → rebuilt → green
  again. `npm run build` works end-to-end.
- **session-brief** completes in 0.4s with the CI probe unresolved (fallback
  line exercised) — inside the ≤5s budget.
- **CI green-run (Actions) ✅** — pushed `9d1ea3c` to main; run 28712361436
  went **green on both jobs on a real push**. Measured (replaces the plan's
  estimates): `npm ci` **~3–4 s** (cold, no cache yet — small dep tree),
  `npm run verify` **18 s**, `npm run build` **4 s**, strip gate **<1 s**.
  Job wall-clock: verify **~27 s**, build-strip **~11 s** → parallel
  **~27 s total**, ~11× under the 5-min target. (Faster than the plan's
  50–90 s guess — the ubuntu runner + tiny deps beat the estimate.)
- **Could-go-RED proof (Actions) ✅** — an isolated linked worktree
  (`git worktree add`, so the shared main tree was never switched) on a
  throwaway `ci-red-proof` branch with a deliberate tsc type error, pushed
  with `SKIP_VERIFY=1`. Run 28712415831 went **RED on both jobs**. Branch +
  remote ref + worktree all deleted after. Red never touched `main`.

## Result
**F2 Ph1 + Ph2 are DONE and verified on the remote.** Ph3 (oxlint two-tier +
oxfmt swap) is a deliberate, separately-committable Fable-routed follow-up
(D-124: no Opus→Fable without a human steer).

## Next intended steps
1. Ph3 (oxlint two-tier + oxfmt) — Fable-routed, when the human routes it.
2. F2 unblocks Wave 1: F3 (lane A) and F4 (lane B) can now build in parallel
   (F4 Ph3 touches `main.ts`, so dodge the F3 lane there — per the master
   plan).

## Landmines
- **Shared tree:** another agent's F1b→archive WIP (`docs/plans/README.md`,
  the F1b plan delete/move, `todo-human.md`, the session-65 journal) was
  uncommitted during this build. I staged **only my six paths** and never
  touched theirs. If their tree goes red before I push, my push (pre-push
  gate verifies the working tree) will correctly block — leave my commits
  local and note it here, don't override a red push.
- The badge shows "no runs" / the brief shows "status unavailable" until
  `verify.yml` actually lands on the remote and runs once — expected.

---

## F2 Ph3 — ESLint→oxlint + Prettier→oxfmt FULL swap (D-130)

**Human-authorized mid-session** ("I authorize you to rewrite the repo from
eslint/prettier to oxlint/oxfmt") — this overrides the plan's Fable routing
for Ph3 (D-022, human intent is canon). Done as a **full replacement**, not
the plan's two-tier (no `eslint src/core` kept). Rationale + parity proofs:
**D-130**.

### What changed
- `src/scripts/gates.ts` — `eslint .`→`oxlint`, `prettier --check .`→`oxfmt --check`.
- `.oxlintrc.json` — **new.** Repo-wide correctness + `no-unused-vars` (`^_`),
  and the pure-core boundary as a `src/core/**` override (the boundary's "one
  home" moved here from `eslint.config.js`).
- `.oxfmtrc.json` — **new**, via `oxfmt --migrate=prettier` (faithful copy of
  `.prettierrc.json` + `.prettierignore` scope).
- `package.json` — `lint`/`format`/`format:check`/`verify:seq` scripts swapped;
  removed `eslint`, `@eslint/js`, `typescript-eslint`, `prettier`, `globals`
  devDeps; added pinned `oxlint@1.72.0` + `oxfmt@0.57.0`. Lockfile pruned.
- Deleted `eslint.config.js`, `.prettierrc.json`, `.prettierignore`.
- `tsconfig.json` — dropped the deleted `eslint.config.js` from `include`.
- Doc/comment sync: `src/core/math.ts` + `src/core/index.ts` ("ESLint-enforced"
  → "oxlint-enforced"), `AGENTS.md`, PRD `06-tech-architecture.md` +
  `07-roadmap-scope.md`, `qa-playtesting.md`, the regenerated gate-roster region
  in `working-agreements.md`, and the ADR D-130 in `decisions.md`.

### Verification (R3)
- **Boundary parity PROVEN**: a scratch `src/core` probe with all violation
  classes → OLD eslint and NEW oxlint both flag the identical 7 (`window`,
  `Math.pow`, `Math.random`, `new Date()`, `Date.now`, `performance.now`,
  `../ui` import); neither flags allowed `Math.sqrt`. The `new Date()` +
  `Date.now` coverage comes from banning the **`Date` global** (oxlint has no
  `no-restricted-syntax`); `performance.now` from banning the `performance`
  global.
- **oxfmt parity**: `--list-different` = zero reformatting on the committed tree.
- `npm run verify` green (15 gates); `verify:budget` median **3.48 s** (was
  4.59 s), 1.52 s headroom (was 0.41 s). oxlint 0.16 s, oxfmt 0.42 s.

### Landmines
- The oxlint boundary is slightly **stricter**: whole `Date`/`performance`
  globals banned in core (not just `.now`). No false positives today (core uses
  neither). `src/persistence` is unaffected — the override is `src/core/**` only.
- Done during heavy concurrent shared-tree churn (another agent rippling the
  PRD + refactoring `verify-run.ts`). Staged only my own paths; `gates.ts` was
  untouched by them. The F2 plan is now ✅ DONE (archivable, not yet moved).
- **Next (this session):** swap `tsc` → `tsgo` (human-asked) as its own change.

---

## Bonus — `tsc` → `tsgo` swap (D-131, human-asked mid-session)

Human: "let's move from tsc to tsgo right now, that's a quick win." Swapped the
typecheck gate + `build` + `verify:seq` from `tsc --noEmit` to `tsgo --noEmit`
(`@typescript/native-preview` 7.0.0-dev, exact-pinned). Kept the `typescript`
devDep (Vite/editor + escape hatch — tsgo is a preview).

- **Parity proven (R3):** `tsgo --noEmit` green on the clean tree; a deliberate
  `TS2322` → exit 1 (same code as tsc); green again after removal.
- Typecheck **~3.15 s → ~0.39 s**. Gate renamed `tsc`→`tsgo` in the roster.
- Files: `gates.ts`, `package.json` (build + verify:seq), PRD §6/§7 +
  qa-playtesting command examples, ADR D-131, regenerated gate-roster region.
- Escape hatch if tsgo ever mis-types: one line back to `tsc --noEmit`.

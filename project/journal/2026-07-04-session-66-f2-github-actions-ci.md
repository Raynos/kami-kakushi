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
- **CI green-run + could-go-RED proof (Actions):** _appended below after the
  push._

## Next intended steps
1. Push main → confirm both `verify.yml` jobs go green on a real push; record
   wall-clock + `npm ci` timing here (replaces the plan's estimates).
2. Could-go-RED proof: a deliberate-violation scratch branch goes RED in
   Actions (pushed with `SKIP_VERIFY=1` so the pre-push gate doesn't block the
   intentional red), then delete the branch. Keeps red off `main`.
3. Ph3 (oxlint two-tier + oxfmt) — **Fable-routed**, separate follow-up; not
   this session (D-124: no Opus→Fable without a human steer).

## Landmines
- **Shared tree:** another agent's F1b→archive WIP (`docs/plans/README.md`,
  the F1b plan delete/move, `todo-human.md`, the session-65 journal) was
  uncommitted during this build. I staged **only my six paths** and never
  touched theirs. If their tree goes red before I push, my push (pre-push
  gate verifies the working tree) will correctly block — leave my commits
  local and note it here, don't override a red push.
- The badge shows "no runs" / the brief shows "status unavailable" until
  `verify.yml` actually lands on the remote and runs once — expected.

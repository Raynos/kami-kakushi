---
name: ship
description: Ship a release — bump, CHANGELOG, verify, isolated build of HEAD, deploy, live-site proof, record. User-invoked only; the invocation is the human sign-off.
argument-hint: "[patch | minor | x.y.z] (default patch)"
disable-model-invocation: true
---

# /ship — the release train

One invocation runs the whole train. **User-invoked only** — an agent never
runs `/ship` or `src/scripts/ship.sh` autonomously (a deploy is
outward-facing; the invocation IS the sign-off). Exactly **one** mid-train
question: the payload confirm (step 3). The mechanical middle lives in
`src/scripts/ship.sh` — the single source for build/deploy/proof; this file
holds only the judgment steps. Plan + rationale:
`docs/plans/fable-process-F9-ship-skill.md`.

## Steps

**0 · Preflight.** `git fetch origin` must succeed and the gh-pages worktree
must exist (`../gh-pages-kami-kakushi`, branch `gh-pages`). Report shared-tree
dirt informationally (`git status --porcelain` summary) — NEVER touch other
agents' files. If the tree looks red (a co-agent's WIP), surface it now: it
will block step 4's pre-commit verify ("don't fight someone else's red").

**1 · Bump.** Args: `patch` (the default when absent) · `minor` · or an
explicit `x.y.z`. Never ask which — the human overrides by re-invoking.
Compute `NEW` from `package.json`; bump with `npm pkg set version=$NEW`
(touches `package.json` only; the lockfile root stays `0.0.0`).

**2 · CHANGELOG.** Find the newest `## [x.y.z]` heading; draft
`## [NEW] — <today>` from `git log <that release's sha>..HEAD --oneline` in
Keep-a-Changelog categories (Added/Changed/Fixed), newest-first insertion.
**Player-facing prose in the house voice** — the 0.3.4/0.3.5 sections are
the exemplars — not a commit-log dump. Wrap ~80.

**3 · Payload confirm (the one question).** Show the version, the drafted
section verbatim, and the SHA that will ship. If the drafted section reads
heavier than the bump class (a fat Added list on a patch), SAY so and suggest
the alternative — but the human decides; never re-bump unasked. On "no":
revert your own two unstaged edits by path (`git checkout -- package.json
CHANGELOG.md` ONLY if you authored both changes this run) and report
"aborted, nothing shipped".

**4 · Release commit.** Pathspec commit of exactly
`package.json CHANGELOG.md`; message `chore(release): vX.Y.Z — <highlights>`
(50/72 body + `Assisted-by:` trailer); `SKIP_JOURNAL=1` (the journal lands at
step 9, AFTER the proof — you can't record "live-verified" before it's
verified). Pre-commit verify + the `verify-changelog` gate run here.

**5 · Push main.** `git push origin main` — standing-approved; pre-push
verify fires. The deploy must ship a publicly-reachable SHA (ship.sh
enforces this with an ancestor check).

**6–7 · Build, deploy, prove.** Run `bash src/scripts/ship.sh` and relay its
report. It builds a detached temp worktree of HEAD (`tmp/ship/wt`) →
`npm ci` → `npm run verify` in isolation → the temp copy of `gh-pages.sh`
(build + DEV-strip gate + rsync + push) → polls the live site until it
serves BOTH the new `__VERSION__` and the release `__BUILD_SHA__`.
**Exit 0 = proven live. Nonzero "UNPROVEN" = pushed but not yet proven** —
re-poll with `bash src/scripts/ship.sh --verify-live`; do NOT proceed to
step 9 until the proof passes (R3).

*(itch is OUT of the train — ratified 2026-07-05. `npm run build:itch` +
manual upload stay a separate path, D-016.)*

**9 · Record + ripple.** Journal entry (house shape): version, release SHA,
gh-pages deploy SHA, the live-fetched proof line verbatim. Refresh the
deployed-version mentions in `project/status/project-status.md`
(`npm run checkpoint` regenerates the derivable regions). Pathspec commit +
push. Report done — quoting the proof.

## Resume rules (re-invoking after any failure is safe)

Each step checks whether its outcome already exists and skips forward —
never redo, never re-draft:

- version already bumped + CHANGELOG section present → skip to step 3
  (confirm the existing payload; don't draft a second section).
- release commit exists but not on origin → step 5.
- pushed but site unproven → `ship.sh --verify-live`, then step 9.
- `ship.sh` red in the temp worktree → HEAD itself is bad: fix FORWARD with
  a new commit (no version re-bump — nothing shipped, `verify-changelog`
  still satisfied), then re-invoke; the fix SHA becomes `__BUILD_SHA__`.

## Never

Autonomous invocation · force-push (either branch) · git tags (H1:
`package.json` is the single version source) · stash/checkout/restore of
files this skill didn't author · declaring "shipped" on an UNPROVEN deploy.

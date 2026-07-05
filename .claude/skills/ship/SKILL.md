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

**4 · Release commit + tag.** Pathspec commit of exactly
`package.json CHANGELOG.md`; message `chore(release): vX.Y.Z — <highlights>`
(50/72 body + `Assisted-by:` trailer); `SKIP_JOURNAL=1` (the journal lands
at step 9). Pre-commit verify + the `verify-changelog` gate run here. Then
**tag the release commit: `git tag "v$NEW"`** — the tag is what makes
`git describe` version the gh-pages deploy messages. *(Why not
`npm version`, which would bump+commit+tag in one move? It bare-commits the
SHARED index — sweeping co-agents' staged files — and rewrites the lockfile
root version this repo pins at `0.0.0`. These explicit steps are its safe
equivalent; plain `npm version` is fine in a single-agent clone.)*

**5 · Push main + tag.** `git push origin main "v$NEW"` —
standing-approved; pre-push verify fires. The deploy must ship a
publicly-reachable SHA (ship.sh enforces this with an ancestor check).

**6–7 · Build + deploy.** Run `bash src/scripts/ship.sh` and relay its
report. It snaps the persistent temp worktree (`tmp/ship/wt`) to HEAD →
`npm ci` ONLY when the lockfile hash changed (node_modules is reused
between ships) → the temp copy of `gh-pages.sh` (build + DEV-strip gate +
rsync + push, deploy message versioned via `git describe --tags`). No
verify step — pre-commit + pre-push already ran the full roster against
the release commit — and NOTHING waits on GitHub Pages: **exit 0 = the
deploy is PUSHED — that's done** (ratified 2026-07-05). Curious whether
it's serving yet? `bash src/scripts/ship.sh --verify-live` is a single
bounded check (never a poll loop).

*(itch is OUT of the train — ratified 2026-07-05. `npm run build:itch` +
manual upload stay a separate path, D-016.)*

**9 · Record + ripple.** Journal entry (house shape): version, release SHA,
gh-pages deploy SHA — recorded as **"pushed @ <sha>"**, never
"live-verified" (that claim needs a `--verify-live` pass; quote its output
if one ran). Refresh the deployed-version mentions in
`project/status/project-status.md` (`npm run checkpoint` regenerates the
derivable regions). Pathspec commit + push. Report done.

## Resume rules (re-invoking after any failure is safe)

Each step checks whether its outcome already exists and skips forward —
never redo, never re-draft:

- version already bumped + CHANGELOG section present → skip to step 3
  (confirm the existing payload; don't draft a second section).
- release commit exists but no `v$NEW` tag → tag it (step 4), then step 5.
- release commit + tag exist but not on origin → step 5.
- deployed but step 9 not recorded → just do step 9 (`--verify-live` is
  optional, never a prerequisite).
- `ship.sh` red in the temp worktree → HEAD itself is bad: fix FORWARD with
  a new commit (no version re-bump — nothing shipped, `verify-changelog`
  still satisfied), then re-invoke; the fix SHA becomes `__BUILD_SHA__`.

## Never

Autonomous invocation · force-push (either branch) · `npm version` in the
shared tree (bare-commits the shared index; step 4 explains the safe
equivalent) · stash/checkout/restore of files this skill didn't author ·
claiming "live-verified" without a `--verify-live` pass ("pushed" is the
honest claim) · any poll loop (checks are single-shot and bounded).

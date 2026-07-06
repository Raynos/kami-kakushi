---
name: ship
description: Ship a release — draft the CHANGELOG section, then one script does everything (bump, commit, tag, push, build, deploy). User-invoked only.
argument-hint: "[patch | minor | x.y.z] (default patch)"
disable-model-invocation: true
---

# /ship

Two moves. No confirms, no journal, no snapshot ripple — the tag +
CHANGELOG + the versioned gh-pages deploy commit ARE the release record.

**1 · Draft the CHANGELOG section** (the only judgment step). Compute the
new version from `package.json` + the arg (`patch` default / `minor` /
explicit `x.y.z`; if the current version has no `v<cur>` tag, a previous
run half-finished — the version IS `<cur>`, don't re-bump). Insert
`## [x.y.z] — <today>` newest-first: Added/Changed/Fixed, player-facing
house voice (0.3.4–0.3.7 are exemplars), ~80 wrap. Don't commit it.

**2 · Run** `bash src/scripts/ship.sh <same arg>` and relay its report.
The script refuses to release without the section, then does everything:
bump → pathspec release commit → `git tag vX.Y.Z` → push main+tag
(pre-push verify is the release gate) → isolated worktree build →
DEV-strip gate → gh-pages push, deploy message versioned by
`git describe`. Fast (~30s warm), bounded, resumable — re-run it after
any failure; each step skips what already exists.

Curious if it's serving yet? `bash src/scripts/ship.sh --verify-live`
(one bounded check, never a loop).

**Never:** agent-initiated invocation or running `ship.sh` autonomously ·
force-push · `pnpm version` in the shared tree (bare-commits the shared
index; the script's pathspec commit is the safe equivalent) · touching
files you didn't author.

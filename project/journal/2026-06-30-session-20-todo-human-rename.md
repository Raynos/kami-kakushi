# Session 20 — 2026-06-30 — rename the human reading queue → `todo-human.md` (+ TODO section)

**Summary:** Renamed `project/docs-to-read-for-human.md` → `project/todo-human.md` (the `todo-`
prefix sorts clear of the two `human-`prefixed folders) and gave it two sections
(`## TODO` + `## Reading queue`); seeded the TODO section with three human-owned tasks. Made
`session-brief.sh` section-aware so both surface separately at session start. No ADR (pure
ops-hygiene, human-directed).

## What changed
- `project/docs-to-read-for-human.md` → `project/todo-human.md` (`git mv`) — restructured into a
  `## TODO` section + a `## Reading queue` section; reworded the intro to cover both.
- TODO section seeded with three human tasks: (1) investigate why GitHub shows `claude` as a
  committer; (2) consider scrubbing the raw JSON dumps (`project/brainstorms/raw/`) from git
  history; (3) look into commit-message best practices.
- `src/scripts/session-brief.sh` — added a `section_items()` awk helper that extracts top-level
  `- [ ]` items under a named `## ` heading; the brief now emits a "✅ TODO" group and the
  "📋 Reading queue" group from the one file. Updated the header comment + the `READING` →
  `HUMAN_TODO` variable.
- `CLAUDE.md` (×2 refs) + `project/status/project-status.md` (live forward-pointer) — repointed to
  the new filename. Historical journal refs to the old name left as-is (history).

## Next intended steps
1. The two new TODOs are human-owned — surface them in the session brief (done automatically now).
2. Human R1/R4 reviews on v0.3 still the headline open work.

## Landmines
- Another agent had a **staged rename** in flight (`docs/plans/.../path-to-v0.3.md` →
  `project/archive/`) — left untouched; committed only my own files by explicit path. The plan is
  being archived, so I **dropped it from the reading queue** entirely (no dangling link to repoint).
- `session-brief.sh` parsing depends on the exact headings `## TODO` and `## Reading queue` — rename
  a section heading in `todo-human.md` and that group silently empties.

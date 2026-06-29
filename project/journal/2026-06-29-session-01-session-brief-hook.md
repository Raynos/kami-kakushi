# Session 01 — 2026-06-29 — SessionStart hook surfaces the human queue

**Summary:** Added a `SessionStart` hook that auto-prints the human's open queue (reading queue +
`H`/`R` items) at the start of every session, so blocking sign-offs (esp. ⭐ H10 / the tier reshape)
get surfaced without being asked. Wired in `.claude/settings.json` + documented in CLAUDE.md.

## What changed
- `src/scripts/session-brief.sh` — **new.** Pure-read script: prints unticked items from
  `project/docs-to-read-for-human.md` + open `🔲` H-items (decisions.md) + R-items (review.md).
  Filters out the `{placeholder}` template lines in HTML comments. Resolves repo root from
  `BASH_SOURCE` so it runs from any CWD.
- `.claude/settings.json` — added `hooks.SessionStart` → `bash src/scripts/session-brief.sh`.
- `CLAUDE.md` — new "Session start → surface what's waiting on the human" bullet in *How to work here*;
  Layout now references `docs-to-read-for-human.md` (the reading queue) + `session-brief.sh`.

## Next intended steps
1. Still blocked on the human: ⭐ H10 (Operating Model v2 sign-off) gates the next build phase (S2 macro
   engine); the tier reshape (D-048…D-055) is locked but NOT yet applied to the PRD.

## Landmines
- The hook output is injected into Claude's context (not shown directly to the human) — relaying it is
  Claude's job, per the CLAUDE.md bullet.
- `session-brief.sh` parses markdown by convention (`- [ ]` checkboxes, `### … 🔲` headings). If those
  formats change in the queue files, update the greps/seds.

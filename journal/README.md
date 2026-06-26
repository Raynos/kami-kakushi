# journal/

**One file per work session** (`YYYY-MM-DD-session-NN[-topic].md`). The journal is a **chronological LOG —
history, "how it got here" — NOT a live snapshot.** (The live "current state / how to resume" lives in
[`memory/project-status.md`](../memory/project-status.md); keep *that* current, not the journal.)

## The convention (so the log stays coherent)
- **Summary at the TOP** — a "read this first" entry point; the one part you keep current as the session grows.
- **Append new entries at the BOTTOM, in chronological order (oldest→newest). NEVER prepend.** A long
  `/loop` session becomes `Summary → entry 1 → entry 2 → …`, read top-to-bottom like a story.
- **No stale "current state" block** inside the journal — forward-looking notes ("next steps", "landmines")
  live in the *latest* entry and in `project-status.md`. Don't leave an old snapshot pretending to be live.
- **Short session** → the plain template (Summary / What changed / Next / Landmines), one coherent entry.
  **Long /loop session** → summary-at-top + numbered chronological entries appended below.
- **Split** a long or multi-topic session into multiple files (`…-session-NN-{topic}.md`) rather than growing
  one giant file.

See [`_TEMPLATE.md`](_TEMPLATE.md) for both shapes. Every commit stages a journal change (the
`.githooks/pre-commit` gate).

> **Anti-pattern (do not repeat):** prepending "checkpoint" blocks to the top of a file on top of a snapshot
> that never gets updated → reverse-chronological fragments above a stale block. Append at the bottom instead.

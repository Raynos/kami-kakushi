---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Handoff

> **Adapted for kamikakushi — kept as close to the [source skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) as possible.** Frontmatter (`name` + `description`, plus `argument-hint` / `disable-model-invocation`) is unchanged. Only two things are adapted because they don't fit this repo:
>
> 1. **Save location.** Upstream says "save to the temporary directory of the user's OS." This repo's convention (`CLAUDE.md`) is the **repo-local, git-ignored `tmp/`** — explicitly *not* the global system scratchpad — so the handoff doc goes in `tmp/`. (That dir is inside the repo but git-ignored, so it still isn't committed.)
> 2. **Relation to existing resumability machinery.** A handoff here overlaps with how this repo already stays resumable: the chronological session **LOG** in `project/journal/` (summary at top, entries appended at the BOTTOM — never prepend) and the **live snapshot** `project/status/project-status.md` (the "Leave it resumable" working agreement). This handoff doc is a *transient* `tmp/` artifact aimed at one fresh agent for one specific continuation — it does **not** replace the journal/status. If what you're capturing is durable project progress, write it to `project/journal/` + `project/status/project-status.md` instead of (or in addition to) the handoff doc, and reference those by path from the handoff.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to the repo-local, git-ignored `tmp/` directory (per `CLAUDE.md`) — not the global system scratchpad, and not anywhere that gets committed.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, the journal, the status snapshot, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

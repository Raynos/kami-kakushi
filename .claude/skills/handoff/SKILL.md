---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Handoff

> **Adapted for kamikakushi — kept as close to the [source skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/handoff) as possible** (frontmatter unchanged). Two adaptations:
>
> 1. **Save location:** the repo-local, git-ignored `tmp/` (per `CLAUDE.md`) — not the OS temp dir, not the global scratchpad, not anywhere that gets committed.
> 2. **Relation to the repo's resumability machinery:** the handoff doc is a *transient* `tmp/` artifact aimed at one fresh agent for one specific continuation — it does **not** replace `project/journal/` or `project/status/project-status.md`. Durable project progress goes there (instead of, or in addition to, the handoff doc), referenced by path from the handoff.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to the repo-local, git-ignored `tmp/`.

Include a "suggested skills" section in the document, which suggests skills that the agent should invoke.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, the journal, the status snapshot, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

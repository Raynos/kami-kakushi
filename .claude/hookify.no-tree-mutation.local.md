---
name: no-tree-mutation
enabled: true
event: bash
pattern: git\s+stash\b|git\s+restore\b|git\s+checkout\s+(?!-b\b|-B\b)
action: warn
---

🌲 **Shared-tree safety — don't mutate files you didn't author**

`git stash` / `git restore` / `git checkout <path|branch>` can discard or
hide another agent's in-flight WIP in this shared working tree.

CLAUDE.md: **NEVER** stash, checkout, or restore files you didn't author.
If you only need to inspect, use a read-only command (`git show`,
`git diff`) instead. Branch creation (`git checkout -b`) is exempt and
not flagged.

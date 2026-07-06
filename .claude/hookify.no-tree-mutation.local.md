---
name: no-tree-mutation
enabled: true
event: bash
pattern: git\s+stash\b|git\s+restore\b|git\s+checkout\s+(?!-b\b|-B\b)|git\s+switch\s+(?!-c\b|-C\b)|git\s+reset\s+--hard\b|git\s+clean\s+(-[A-Za-z]*f[A-Za-z]*\b|--force\b)
action: warn
---

🌲 **Shared-tree safety — don't mutate files you didn't author**

`git stash` / `git restore` / `git checkout <path|branch>` /
`git switch <branch>` / `git reset --hard` / `git clean -f` can discard or
hide another agent's in-flight WIP in this shared working tree.

CLAUDE.md: **NEVER** stash, checkout, restore, hard-reset, or clean files
you didn't author. If you only need to inspect, use a read-only command
(`git show`, `git diff`) instead. Branch creation (`git checkout -b`,
`git switch -c`), soft resets, and `git clean -n` (dry run) are exempt
and not flagged.

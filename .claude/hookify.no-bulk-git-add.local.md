---
name: no-bulk-git-add
enabled: true
event: bash
pattern: git\s+add\s+(-A\b|--all\b|\.(?=\s|$))|git\s+commit\s+-(?!-)[a-z]*a
action: warn
---

🌲 **Shared-tree safety — don't bulk-stage**

`git add -A` / `git add .` / `git commit -a` stage **every** dirty file,
including WIP authored by another agent sharing this working tree.

CLAUDE.md is explicit: **stage only your own files, by explicit path**
(`git add path/a path/b`), and leave everyone else's uncommitted work
untouched. Re-run with the specific paths you authored.

(`git commit --amend` is fine — this only catches single-dash `-a`-style
commit flags and the all-staging `add` forms.)

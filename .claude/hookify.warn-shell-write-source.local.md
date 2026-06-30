---
name: warn-shell-write-source
enabled: true
event: bash
pattern: (cat|echo|printf|tee)\b[^|]*>>?\s*'?src/
action: warn
---

🪵 **Writing a source file via the shell — use Write/Edit instead**

You're using `cat`/`echo`/`printf`/`tee` redirection to create or append a file
under `src/`. Author source with the **Write** (new file) or **Edit** (change)
tools, not shell redirection.

**Why:**

- A `cat >>` can append to a file you haven't fully Read → malformed source (the
  Read-before-edit safety exists for exactly this).
- Write/Edit produce a reviewable diff; a shell heredoc doesn't.
- On this shared working tree, a blind redirect can clobber another agent's edits.

Scratch files under `tmp/` are exempt — redirect there freely. This fires on
`src/` only (the clearly-wrong case), so it won't nag on report assembly in
`project/`.

_Grounded in this session: the overnight build ran `cat >> src/core/economy.test.ts <<'EOF'`._

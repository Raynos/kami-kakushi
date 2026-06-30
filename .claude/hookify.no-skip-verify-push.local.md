---
name: no-skip-verify-push
enabled: true
event: bash
pattern: SKIP_VERIFY=\S+.*git\s+push|git\s+push.*SKIP_VERIFY=\S+
action: block
---

🚫 **Never push red — `SKIP_VERIFY=1` is not for pushing**

CLAUDE.md: `SKIP_VERIFY=1` is **only** for *committing* your own isolated
change locally — **never** for pushing red to `main`. The pre-push gate
runs `npm run verify` on every push and **refuses any red push**; a green
`origin/main` is the proof a checkpoint is real.

If the tree is red because of **another agent's** in-flight WIP, that's
expected: leave your commit local, note it in
`project/status/project-status.md`, and do **not** override onto the
remote. Drop the `SKIP_VERIFY` and let the gate run.

---
name: prepare-to-exit
description: Checkpoint the session and prepare to exit — commit own work, journal, bring the live snapshot current, push main (fires the verify gate), and confirm the tree is clean. User-invoked only.
disable-model-invocation: true
---

# Prepare to exit

Run the repo's **checkpoint ritual** — make the work resumable from disk *and on
the remote*, right now — then report the final state so the user can leave safely.

This is the canonical "checkpoint" from
[`project/status/working-agreements.md`](../../../project/status/working-agreements.md)
("Checkpoint (the resumability ritual)") and `AGENTS.md` ("Checkpoint ="). That
doc is the source of truth; this skill is the runnable form. **Do the steps in
order; don't skip the push or the confirm.**

## Steps

1. **Commit completed work.** Stage **only your own files by explicit path**
   (`git add path/a path/b`) — **never** `git add -A` / `git commit -a` (the tree
   may be shared with another live agent). Each commit needs the `Assisted-by:`
   trailer (the `commit-msg` gate enforces it).
2. **Journal.** Stage a `project/journal/` entry for the session (summary at top,
   entries appended at the **bottom** — never prepend). The pre-commit gate
   requires a staged journal entry (`SKIP_JOURNAL=1` only for a trivial commit).
3. **Live snapshot.** Bring
   [`project/status/project-status.md`](../../../project/status/project-status.md)
   current — it (not the journal) is the resume point. Add a one-paragraph
   "Phase update" for this session and refresh the "How to resume → Next" block.
4. **Push `main`.** `git push origin main`. This fires the **pre-push gate**
   (`.githooks/pre-push` → `npm run verify` on every push, **blocks on red**). A
   green `origin/main` is the proof the checkpoint is real — the push is *part of*
   the checkpoint, a standing approval, not a separate ask.
5. **Confirm — verify before you claim.** Check `git status` is clean and
   `git log origin/main..main` is empty (the push actually succeeded). If
   anything is intentionally left local, say **exactly** what and why.

## Non-negotiables (learned the hard way)

- **Verify before you claim.** Never report *pushed / green / done* without
  actually checking — a clean tree can go dirty a moment later.
- **Shared-tree safety.** More than one agent may be editing the tree. **NEVER**
  `git stash` / `checkout` / `restore` / otherwise mutate files you didn't
  author. Stage only your own files by explicit path; leave others' WIP untouched.
- **Don't fight someone else's red.** The pre-push gate verifies the *working
  tree*, so another agent's in-flight red WIP will (correctly) block your push.
  Expected — leave your commit **local**, note it in `project-status.md`, and
  **never** `SKIP_VERIFY=1`-override a red tree onto the remote. (`SKIP_VERIFY=1`
  is only for *committing* your own isolated change locally, never for pushing
  red to `main`.)

## Final report to the user

End with a short, factual status: what was committed/pushed, the `origin/main`
SHA, the verify result, and anything intentionally left behind. That readout is
how the user knows it's safe to exit.

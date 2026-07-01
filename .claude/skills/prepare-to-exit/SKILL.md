---
name: prepare-to-exit
description: Checkpoint the session and prepare to exit — run the repo's canonical Checkpoint ritual, then report state. User-invoked only.
disable-model-invocation: true
---

# Prepare to exit

> **⚠ Do NOT kill running subagents or workflows to "prepare to exit."** A checkpoint makes the
> *committed* state resumable; it does **not** tear down live background work. A running `Workflow` /
> `Agent` is doing useful work whose results notify the loop when they finish — stopping it orphans that
> work for no gain. **Leave it running** (note it as in-flight in your report), or, only if the user
> *explicitly* asks, `TaskStop` it (and you can `resumeFromRunId` a workflow later — completed agents
> return cached). The checkpoint is orthogonal to and safe alongside in-flight background work. (Full
> rule: `working-agreements.md` → Checkpoint → the four rules.)

> **⚠ Don't over-ask on the reading-queue step.** Reconcile **only** docs the human
> actually read or discussed *this session*. A queue doc nobody touched this session
> **stays in the queue — do NOT `AskUserQuestion` about it** (asking "sign off Plan X?"
> when the session never mentioned Plan X is the over-ask to avoid). If nothing was
> engaged, make **zero** queue prompts — just report the queue as-is. (Source: `working-
> agreements.md` → Checkpoint → step 4 / D-089.)

1. **Read the current ritual.** Open
   [`working-agreements.md` → "Checkpoint"](../../../project/status/working-agreements.md)
   — that section is the **single source of truth** for the steps *and* the
   safety rules (verify-before-claim, shared-tree safety,
   don't-fight-someone-else's-red, **don't-kill-running-subagents/workflows**). It
   may have grown a step since you last saw it; trust the file, not your memory.
2. **Execute it, in order, as written there.** Don't paraphrase or shortcut —
   the point of reading it first is to run whatever it says *today*.
3. **Report.** End with a factual readout — what was committed/pushed, the
   `origin/main` SHA, the verify result, and anything intentionally left local
   (incl. any workflow/subagent still running) — so the user knows it's safe to exit.

> This skill deliberately holds **no copy** of the checkpoint steps: if the ritual
> evolves, edit `working-agreements.md` only and this skill follows automatically.
> Keep it that way.

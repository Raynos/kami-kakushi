---
name: prepare-to-exit
description: Checkpoint the session and prepare to exit — run the repo's canonical Checkpoint ritual, then report state. User-invoked only.
disable-model-invocation: true
---

# Prepare to exit

1. **Read the current ritual.** Open
   [`working-agreements.md` → "Checkpoint"](../../../project/status/working-agreements.md)
   — that section is the **single source of truth** for the steps *and* the
   safety rules (verify-before-claim, shared-tree safety,
   don't-fight-someone-else's-red). It may have grown a step since you last saw
   it; trust the file, not your memory.
2. **Execute it, in order, as written there.** Don't paraphrase or shortcut —
   the point of reading it first is to run whatever it says *today*.
3. **Report.** End with a factual readout — what was committed/pushed, the
   `origin/main` SHA, the verify result, and anything intentionally left local —
   so the user knows it's safe to exit.

> This skill deliberately holds **no copy** of the steps: if the checkpoint
> ritual evolves, edit `working-agreements.md` only and this skill follows
> automatically. Keep it that way.

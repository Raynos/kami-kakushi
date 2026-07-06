---
name: prepare-to-exit
description: Checkpoint the session and prepare to exit — run the repo's canonical Checkpoint ritual, then report state. User-invoked only.
disable-model-invocation: true
---

# Prepare to exit

Run the repo's **Checkpoint** ritual, then report. The steps are the single source of truth in
[`working-agreements.md` → Checkpoint](../../../project/status/working-agreements.md)
(commit-by-path → journal → snapshot → reading-queue → push → confirm, plus the safety rules). Read it fresh —
it may have grown a step — and execute in order; don't paraphrase or shortcut.

The snapshot/queue step is now half mechanical: **`pnpm run checkpoint`** regenerates the derivable process-doc
regions (gate roster, active-plans list) and graduates any DONE plan to `project/archive/` — run it, then finish
the judgment half by hand (snapshot prose, clearing engaged reading-queue items).

Two guardrails up front:
- **Don't kill running subagents / workflows to exit.** A checkpoint resumes *committed* state; it doesn't tear
  down live work (results notify the loop when done). Leave it running (note it in-flight); `TaskStop` only if
  the user asks.
- **Don't over-ask the reading-queue step.** Reconcile only docs engaged *this session*; never `AskUserQuestion`
  about an untouched queue doc. If none were engaged, ask nothing — just report the queue.

**Report** at the end: what was committed/pushed, the `origin/main` SHA, the verify result, and anything left
local (incl. any workflow still running) — so the user knows it's safe to exit.

> Holds no copy of the steps by design — if the ritual changes, edit `working-agreements.md` only.

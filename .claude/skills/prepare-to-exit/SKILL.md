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

Three guardrails up front:
- **Don't kill running subagents / workflows to exit.** A checkpoint resumes *committed* state; it doesn't tear
  down live work (results notify the loop when done). Leave it running (note it in-flight); `TaskStop` only if
  the user asks.
- **Don't over-ask the reading-queue step.** Reconcile only docs engaged *this session*; never `AskUserQuestion`
  about an untouched queue doc. If none were engaged, ask nothing — just report the queue.
- **The push is BEST EFFORT (human, 2026-07-12).** Try it. If the pre-push gate blocks you on a **co-agent's**
  red WIP — their dirty/untracked files, not yours — that is the shared tree working as designed, **not** a
  failed checkpoint: leave the commit local, note it in the report, move on. **Never** `SKIP_VERIFY=1` past it.
  A blocked push only *matters* when nobody is left to carry the commit out — so check `herdr agent list`: if
  **other agents are live**, a blocked push is a **non-event** (they'll push it out with their next green
  push). If **you are the only / last agent**, an unpushed commit strands the work — that one is a real
  failure, and it's an OOPS.

**Report** at the end: what was committed/pushed, the `origin/main` SHA, the verify result, and anything left
local (incl. any workflow still running) — so the user knows it's safe to exit.

## Last step — the sign-off banner (MANDATORY, ALWAYS)

The **final thing in your final message**, after the report, is **one** of the two banners below — printed
**verbatim, inside a fenced code block**, as the last lines you emit. Nothing follows it: no sign-off prose,
no "let me know if…", no further tool calls.

**A banner ALWAYS prints. There is no path through this skill that ends without one.** Its job is to answer
*"did this session run prepare-to-exit?"* from across the room: the human scans a grid of idle panes and reads
the answer off the **silhouette alone**, before reading a word. A silent failure looks exactly like a session
that never ran the skill — which is the one outcome that breaks the signal. So a failed checkpoint doesn't
*suppress* the banner, it **switches** it.

Which one:
- **BYE** — the checkpoint is clean: your work is committed, your gates are green, and the push either
  **succeeded** *or* was blocked by a **co-agent's** red **while other agents are still live** (best-effort;
  a non-event per the guardrail above — just say so in the report).
- **OOPS** — anything else: your own work is uncommitted or red, the checkpoint couldn't complete, or the push
  failed **and you are the only / last agent** (the commit is stranded). Never print BYE over this — a BYE on a
  half-finished checkpoint is a false green (PH3), and it is the *report*, not the banner, that carries the
  detail.

Both are **fixed, byte-stable signals**, not decoration — they only work if they are **always the same**. Copy
them character-for-character: don't retype from memory, don't restyle, don't personalize, don't append a run
summary inside the box, don't swap the block letters. The two are deliberately distinguishable when blurred or
squished: BYE is light-bordered and 4 glyphs, OOPS is heavy double-bordered and squarer.

**BYE — checkpoint clean:**

```
   ┌──────────────────────────────────────────────────────────────┐
   │  ██████╗ ██╗   ██╗███████╗██╗                                │
   │  ██╔══██╗╚██╗ ██╔╝██╔════╝██║  prepare-to-exit is complete.  │
   │  ██████╔╝ ╚████╔╝ █████╗  ██║  committed - verified - pushed │
   │  ██╔══██╗  ╚██╔╝  ██╔══╝  ╚═╝                                │
   │  ██████╔╝   ██║   ███████╗██╗  you may close this session.   │
   │  ╚═════╝    ╚═╝   ╚══════╝╚═╝                                │
   └──────────────────────────────────────────────────────────────┘
```

**OOPS — prepare-to-exit ran, but did NOT finish clean:**

```
   ╔═══════════════════════════════════════════════════════════════════╗
   ║   ██████╗  ██████╗ ██████╗ ███████╗                               ║
   ║  ██╔═══██╗██╔═══██╗██╔══██╗██╔════╝  prepare-to-exit ran, but     ║
   ║  ██║   ██║██║   ██║██████╔╝███████╗  it did not finish clean.     ║
   ║  ██║   ██║██║   ██║██╔═══╝ ╚════██║                               ║
   ║  ╚██████╔╝╚██████╔╝██║     ███████║  work is LOCAL - read the     ║
   ║   ╚═════╝  ╚═════╝ ╚═╝     ╚══════╝  report above before closing. ║
   ╚═══════════════════════════════════════════════════════════════════╝
```

> Holds no copy of the steps by design — if the ritual changes, edit `working-agreements.md` only. The banners
> are the one exception: they live here because they must be reproduced byte-for-byte.

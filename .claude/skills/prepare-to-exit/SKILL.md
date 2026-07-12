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

Four guardrails up front:
- **Don't kill running subagents / workflows to exit.** A checkpoint resumes *committed* state; it doesn't tear
  down live work (results notify the loop when done). Leave it running (note it in-flight); `TaskStop` only if
  the user asks.
- **Don't over-ask the reading-queue step.** Reconcile only docs engaged *this session*; never `AskUserQuestion`
  about an untouched queue doc. If none were engaged, ask nothing — just report the queue.
- **Leftover work needs a QUEUE, not a record (human, 2026-07-12).** Step 4 of the ritual is the
  **leftover-work sweep**, and it is the step most likely to be skipped because everything *looks*
  clean. Anything this session **ruled, discovered, deferred, or decided but did not build** must
  land in **`docs/plans/`** (an agent picks it up — use `/write-plan`), an **HR/HD item** (only the
  human can call it), or **`BACKLOG.md`** (parked). An **ADR bullet, a journal line, or a snapshot
  sentence is a RECORD, not a QUEUE** — the session brief starts from `docs/plans/`, so work parked
  anywhere else is read but never resumed. The human's words, after this exact failure: *"if it's
  not in `docs/plans/` it will be lost and not built … it just vanishes into the 100s of commits."*
  The `deferred-work` gate catches the **shouted** case (a `NOT built` in canon/snapshot with no
  home); **the quiet case is yours to catch** — a gate cannot read your intent, which is why it is
  a banner precondition below.
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

The two banners answer **one** question, and it is not "did the git commands succeed" — it is:

> **Is it safe to KILL this pane right now?**

- **BYE — safe to close.** The checkpoint is done and there is **nothing left in this session**: your work is
  committed, your gates are green, the session is at a coherent stopping point, the push either
  **succeeded** *or* was blocked by a **co-agent's** red **while other agents are still live** (best-effort;
  a non-event per the guardrail above — just say so in the report), **and the leftover-work sweep is done —
  every ruling, finding and deferral this session produced has a home in `docs/plans/` / an HR-HD item /
  `BACKLOG.md`, not merely a mention in an ADR, a journal or the snapshot.** A BYE is a claim that nothing
  here will be lost; work recorded only in prose *will* be.
- **OOPS — do NOT close.** Either of these, and they weigh the same:
  1. **Something is wrong.** Not green, broken, a gate you couldn't fix, a push that stranded the work because
     you're the last agent — or you simply **don't know** whether it's sound. Uncertainty is an OOPS: the
     banner is a safety signal, so it fails *loud*, not *optimistic*.
  2. **Leftover work has no queue.** Something this session ruled, found or deferred lives only in an ADR
     bullet, a journal entry, a snapshot line or a chat message — and not in `docs/plans/`, an HR/HD item, or
     `BACKLOG.md`. It will vanish into the commit log. Write the plan (it is ten minutes) and *then* BYE; if
     you cannot, OOPS and name it.
  3. **The session is half-built.** `/prepare-to-exit` was run **too early** — the work is mid-implementation,
     a plan is stopped between steps, a feature is wired but unreachable, a refactor landed on one side only.
     **A clean `git status` does NOT mean done.** Ask it straight: *if this pane were killed right now, would
     anything be left half-implemented?* If yes → **OOPS**, and the report names exactly what's half-done and
     where to resume. Committing half-finished work does not launder it into a BYE.

Never print BYE over either case — a BYE on a half-finished session is a false green (PH3), and it is the
*report*, not the banner, that carries the detail.

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

**OOPS — prepare-to-exit ran, but this session is NOT safe to close:**

```
   ╔═════════════════════════════════════════════════════════════════════╗
   ║   ██████╗  ██████╗ ██████╗ ███████╗                                 ║
   ║  ██╔═══██╗██╔═══██╗██╔══██╗██╔════╝  prepare-to-exit ran, but       ║
   ║  ██║   ██║██║   ██║██████╔╝███████╗  this session is NOT done.      ║
   ║  ██║   ██║██║   ██║██╔═══╝ ╚════██║                                 ║
   ║  ╚██████╔╝╚██████╔╝██║     ███████║  something is red or half-done  ║
   ║   ╚═════╝  ╚═════╝ ╚═╝     ╚══════╝  read the report; DON'T close.  ║
   ╚═════════════════════════════════════════════════════════════════════╝
```

> Holds no copy of the steps by design — if the ritual changes, edit `working-agreements.md` only. The banners
> are the one exception: they live here because they must be reproduced byte-for-byte.

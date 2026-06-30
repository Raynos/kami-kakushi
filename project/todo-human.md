# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs **you haven't read or discussed yet**. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.
>
> **You never manually sign these off** (D-089). **Sign-off is implicit** — once you've read a
> reading-queue doc, or we discuss / work on it together, the agent treats that as signed off and
> **clears it for you**. The agent owns keeping this list clean (no stale-triage chore for you);
> the `/prepare-to-exit` ritual reconciles the queue and asks you (via AskUserQuestion) to confirm
> any removals it's unsure about.

## TODO

_(none open)_ <!-- veto pass DONE 2026-06-30: all 16 propose-then-veto items approved + landed -->

## Reading queue

> Durable docs **you haven't opened or discussed yet** — the agent's way of surfacing the markdown
> it generated (in agentic / loop / ultracode runs) so nothing it made goes unseen.
>
> **What belongs here** — any durable doc whose *purpose is for you to read / review / sign off*: a **plan**
> (`docs/plans/`), a **brainstorm / retrospective put up for adoption** (`project/brainstorms/`), an **audit /
> battery report** or **changelog** (`project/audit/reports/`), or a **design doc awaiting a taste call**. Added
> in the same commit it's authored; a pre-commit gate hard-blocks a new `docs/plans/` doc missing from this list
> and loud-warns on the rest (CLAUDE.md "Reading queue").
>
> **Lifecycle (D-089) — sign-off is implicit, the agent keeps the list clean.** You never tick these off.
> The moment you read a doc, or we discuss / work on it together, the agent treats it as signed off and removes
> it. `/prepare-to-exit` reconciles the whole queue and asks you (AskUserQuestion) to confirm any removal it
> can't infer on its own.

_(none open)_

> **Signed off / closed this session:** `project/brainstorms/2026-06-30-v03-process-learnings.md`
> — read + adopted (D-086…D-088 + norms). The skill shelf-ware audit report was **retired** (no
> remaining actions); its findings live in
> `project/human-feedback/2026-06-30-process-learnings-decisions.md`.

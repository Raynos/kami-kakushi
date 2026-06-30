# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in `project/human-in-the-loop/` (`H`-decisions +
> `R`-reviews): the **TODO** section holds loose human-owned tasks, the **Reading queue** holds
> docs awaiting your **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> `src/scripts/session-brief.sh`.

## TODO

_(none open)_ <!-- veto pass DONE 2026-06-30: all 16 propose-then-veto items approved + landed -->

## Reading queue

> Docs still awaiting your **"read & reviewed"** sign-off.
>
> **What belongs here** — any durable doc whose *purpose is for you to read / review / sign off*: a **plan**
> (`docs/plans/`), a **brainstorm / retrospective put up for adoption** (`project/brainstorms/`), an **audit /
> battery report** or **changelog** (`project/audit/reports/`), or a **design doc awaiting a taste call**. Added
> in the same commit it's authored; removed when you sign off. A pre-commit gate hard-blocks a new `docs/plans/`
> doc missing from this list and loud-warns on the rest (CLAUDE.md "Reading queue").

- [ ] `project/audit/reports/2026-06-30-stale-markdown-sweep.md` — *repo-wide stale-markdown sweep + the full apply pass*
  - 21 grounded findings, all applied (the D-048 6-tier ripple finished into the PRD spine, the
    D-053→D-079 clock supersession, built-features-described-as-unbuilt, a new md-links verify gate
    that caught 8 dead links). **Eyeball the rebuilt §1.5.1 T1 Estate-full section + the new T1
    antagonist row** (reconstructed from §1.6.3 + §3 canon).

> **Signed off / closed this session:** `project/brainstorms/2026-06-30-v03-process-learnings.md`
> — read + adopted (D-086…D-088 + norms). The skill shelf-ware audit report was **retired** (no
> remaining actions); its findings live in
> `project/human-feedback/2026-06-30-process-learnings-decisions.md`.

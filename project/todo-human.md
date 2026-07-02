# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`H`-decisions + `R`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet (how the
>   agent surfaces the markdown it generated, so nothing goes unseen).
>
> **Sign-off is implicit — you never tick anything off (D-089).** Reading a doc,
> or discussing / working on it together, counts as sign-off: the agent then
> clears it and keeps this list clean for you. `/prepare-to-exit` reconciles the
> queue and asks (via AskUserQuestion) to confirm any removal it can't infer.

## TODO

_(none open)_

## Reading queue

> **What belongs here** — a durable doc whose purpose is for you to read or sign
> off: a **plan** (`docs/plans/`), a **brainstorm / retrospective for adoption**
> (`project/brainstorms/`), an **audit / battery report** (`project/audit/reports/`),
> or a **design doc awaiting a taste call**. Added in the commit that authors it
> (a pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).

- [ ] `docs/plans/2026-07-02-koku-economy-t0-build.md` — **Plan B: the T0 build**
  (koku→coin rename, rice-as-resource, mon→monme→ryō formatter, koku-as-standing,
  status tokens). **UNBLOCKED** (Plan A landed); for another agent; coordinate on
  render.ts. _(Plan A, the doc ripple, is DONE — archived.)_
- [ ] `docs/plans/2026-07-02-append-only-rendering-engine.md` — **rendering-engine
  migration**: generalize the intro's proven append-only render to kill the whole
  flash/repaint class across the app. **Scope call** — 5 open questions await your
  answer before build.
- [ ] `docs/plans/2026-07-02-rung-up-story-transitions.md` — **rung-ups as VN story
  beats** (F97/F99/F103): a rung-up becomes a player-initiated story beat that
  motivates the unlocks + entity discovery. **Scope call**; ties D-104.
- [ ] `project/brainstorms/2026-07-02-narrative-coherence-home-belongings.md` —
  **home / belongings / furniture design** (F89): narrative coherence for the
  estate's rooms + owned items. **Scope call.**

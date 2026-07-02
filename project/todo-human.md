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

- [ ] `docs/plans/2026-07-02-economy-koku-rediagnosis.md` — **economy
  re-diagnosis**: koku is mis-cast as a generic coin (you rake rice → "+3 koku"),
  and the same variable is labelled both "koku" and "rice". Recommends a
  rice / coin(mon) / koku-as-assessment split (Option A) with 6 open design
  calls. Rests on the koku research brainstorm. **Awaits your taste call.**
- [ ] `docs/plans/2026-07-02-interactive-intro-dialogue.md` — the **interactive
  intro** design (F13/F12/F15/F19/F23/F26): VN click-to-continue, 3 balanced
  choice beats, per-NPC memory, a speaker/voice-colour model, 3 presentation
  variants. **Carries ADR-worthy calls + 6 open questions** for you.
- [ ] `docs/plans/2026-07-02-multi-panel-layout.md` — the **multi-panel** design
  (F11): 5 reveal-gated panels, sparse→filling, 3 variants. **Touches the §4.7
  centered-column rule (widen the shell = an ADR)** + 4 open questions.
- [ ] `docs/plans/2026-07-02-npc-dialogue-tree.md` — the **Fallout-style dialogue
  tree** (F47): meet→ask→decide, reuses the intro beats as DialogueScenes,
  Sōan/Genemon topics, SCHEMA 3→4 migration. Key forks already answered
  (context-dependent topic counts, dimmed re-askable, voiced player questions).

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
  rice / coin(mon) / koku-as-assessment split (Option A), now with **all decisions
  made** (§9–§14): tiered mon→monme→ryō display, koku as House standing, tier→koku
  ladder, T5 office track, status tokens. **4 round-4 defaults await your override.**
- [ ] `docs/plans/2026-07-02-koku-ripple-docs.md` — **Plan A: the PRD/doc ripple**.
  From a 12-doc audit workflow: 81 contradictions + 16 renames + 70 enrichments +
  ~12 ADRs to supersede. Per-doc edit checklist + a new master ADR (≈D-107).
  **Docs-only; sequenced FIRST.**
- [ ] `docs/plans/2026-07-02-koku-economy-t0-build.md` — **Plan B: the T0 build**
  (koku→coin rename, rice-as-resource, mon→monme→ryō formatter, koku-as-standing,
  status tokens). **Gated on Plan A; for another agent; coordinate on render.ts.**
- [ ] `project/brainstorms/2026-07-02-edo-social-political-research.md` — **social /
  political research** (status mobility, giri/on, village collective-liability,
  patronage/Tanuma, factional risk, Tenmei famine). Feeds the T2+ layer of the
  economy plan. **Reference read.**

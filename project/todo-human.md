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

- [ ] `docs/plans/2026-07-02-koku-economy-t0-build.md` — **Plan B: the T0 economy
  build** (koku→coin rename, rice-as-resource, mon→monme→ryō formatter,
  koku-as-standing, status tokens). Scope LOCKED (D-107/108/109 + D-113); **being
  implemented now by the main session** (verified GO, file map corrected).
- [ ] `docs/plans/2026-07-02-rung-up-story-transitions.md` — **rung-ups as VN story
  beats** (F97/F99/F103). Scope LOCKED (D-110 — every rung a player-triggered beat).
  **Carries a PROPOSED CAST (§6.5) for your review/edits** before the beats ship.
- [ ] `docs/plans/2026-07-02-deep-housing-build.md` — **deep housing build** (D-111):
  furnishable home that grows with rung + a belongings inventory + comfort/
  status-mirror bonuses. The build approach, for your review.
- [ ] `docs/plans/2026-07-02-ia-tab-reorg-build.md` — **6-tab IA reorg build** (D-112/
  114/116): panel→tab map, incremental reveal order, vendors-as-people model. **Two
  forks to confirm**: no Quests tab (default: fold into Character as "Undertakings"),
  the R1 triple-reveal pacing, and the koku-panel home.
- [ ] `project/brainstorms/2026-07-02-emergent-node-actions.md` — **emergent node
  actions** (parked idea, D-116-adjacent): you *discover* what to do at a map node
  via rumours / low-chance events / description hints, not a static list. T0-later/T1,
  for eventual adoption.
- [ ] `project/audit/reports/2026-07-02-economy-balance-watch.md` — **economy balance
  watch** (from the re-core audit): 4 liquid tuning items for your playtest — rice
  out-produces its sinks (coin too abundant), season store/sell dominated, eat-rice
  dominated by rest, and the koku capstone reached too fast. **Balance is your feel-call
  — I did NOT silently re-tune.** Play + tune by feel.

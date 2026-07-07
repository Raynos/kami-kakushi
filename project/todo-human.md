# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck — git
> history is the record. This is separate from `project/human-in-the-loop/`
> (`HD`-decisions + `HR`-reviews); both sections here are auto-surfaced at session
> start by `src/scripts/session-brief.sh`. Work the human has deliberately
> parked lives in [`BACKLOG.md`](BACKLOG.md), which the brief never nags.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet (how the
>   agent surfaces the markdown it generated, so nothing goes unseen).
>
> **Sign-off is implicit — you never tick anything off (ADR-089).** Reading a doc,
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
>
> **An ARCHIVED doc (`project/archive/`) NEVER belongs here** — archiving means it's
> done/superseded, and git history + `decisions.md` + the journal are its record.
> When a plan/doc is archived, remove its queue entry in the same move (any still-owed
> bit lives as an HR-item in `human-in-the-loop/review.md`, not here).


- [ ] `docs/story-bible/README.md` — **the finished story bible, whole-read
  → BIBLE DONE**: workstream A completed with you in s109 (all 7 tier
  sheets · full cast · origin relocked warm · names · register rules · the
  fall). Your end-to-end read + blessing is the one remaining gate; the
  unreviewed cast portraits (edge → T1 → T2 → T3 → T4/T5) ride this read —
  redline anything, workstream B opens on your word.
- [ ] `docs/plans/fable-2026-07-07-story-salvage.md` — the **story salvage
  doc**: the slop-audit findings/fixes condensed live (THE substance you
  asked not to lose) + the mostly-superseded 19 ladder answers as record;
  defines what the reboot's informed pitch agents receive.
- [ ] `project/brainstorms/2026-07-07-salvage-audit-vs-bible-crosscheck.md`
  — the **salvage/audit vs bible cross-check** (a whole-read companion):
  the bible absorbed the audit almost completely — verdict up top, then
  six small residue items (three are one-line bible candidates you can
  rule on during the read: the anti-thermometer decide rule · the
  "…"-react owner · D5's per-tier want, dropped silently).
- [ ] `docs/plans/fable-2026-07-07-t0t1-map-rebuild.md` — the **T0/T1 map
  rebuild plan**: what the blind-agent audit found wrong with the two DEV
  reference maps (canon + quality + code), the build steps, and the one
  surfaced fork (night-indigo vs warm-washi substrate — default is night).
- [ ] `docs/plans/fable-2026-07-07-t0t1-map-spec.md` — the **map baseline
  spec**: the super-detailed description of what the T0/T1 sheets should
  depict (one master geography, drawn wrong-things, the AA look bar) + the
  blind-reader rubric the rebuild iterates against.
- [ ] `project/brainstorms/2026-07-07-t0t1-map-review-next-level.md` — the
  **map-rebuild fresh-eyes review**: implementation/tooling/output verdicts
  (incl. a capture bug that hid the zoom-detail layer from every blind
  pass) + the ranked next-level phases; pairs with your HR-12 taste call.

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

- [ ] Use Fable to get a guide & a set of skills for making and editing maps
  using the new map sheet UI library tools etc.

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


- [ ] `docs/plans/fable-2026-07-07-storywave-docs.md` — **storywave Plan A
  (DOCS)**: the docs/PRD/ADR ripple to the blessed bible — the ten-ADR
  engine docket (A0, ready-to-paste), PRD §5 rewrite + banner, targeted
  §1/§3 ripples, roadmap reshape; open questions at the bottom (pillar
  model, v1 scope, +3). Executes in parallel with Plan B per the §S seam.
- [ ] `docs/plans/fable-2026-07-07-storywave-game.md` — **storywave Plan B
  (GAME)**: re-implement T0 in src/ to the bible — six-season calendar,
  night rounds, coin lanes, 17-node map, speaker ladder, scene machinery,
  the t0v2 prose migration (ONE version ships, per your 2026-07-08
  ruling), clean-break ship; 11 open questions at the bottom.
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
- [ ] `project/brainstorms/2026-07-07-t0-map-rung-reveal.md` — the
  **rung-reveal illustration** you asked for: T0R1/R3/R5/R7 renders (fog =
  unsurveyed paper, 未 ghost chips, rumor notes; images in
  `project/audit/screens/2026-07-07-t0-rung-reveal/`) + the design calls it
  takes and the fork it surfaces (sheet vs 地図 as the one unlock source).

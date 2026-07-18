# Human TODO — tasks + reading queue awaiting the human

> **Live queue, open items only.** Closed items are removed, not struck
> — git history is the record. This is separate from
> `project/human-in-the-loop/` (`HD`-decisions + `HR`-reviews); both
> sections here are auto-surfaced at session start by
> `src/scripts/session-brief.sh`. Work the human has deliberately parked
> lives in [`BACKLOG.md`](BACKLOG.md), which the brief never nags.
>
> - **TODO** — loose tasks only you can do.
> - **Reading queue** — durable docs you haven't read or discussed yet
>   (how the agent surfaces the markdown it generated, so nothing goes
>   unseen).
>
> **Sign-off is implicit — you never tick anything off (ADR-089).**
> Reading a doc, or discussing / working on it together, counts as
> sign-off: the agent then clears it and keeps this list clean for you.
> `/prepare-to-exit` reconciles the queue and asks (via AskUserQuestion)
> to confirm any removal it can't infer.

## TODO

- [ ] https://x.com/PrajwalTomar_/status/2074810260271800596
- [ ] https://raft.build/

## Reading queue

- [ ]
  [`project/brainstorms/2026-07-12-quest-shapes-that-emerged.md`](brainstorms/2026-07-12-quest-shapes-that-emerged.md)
  — the four quest shapes ADR-184's reveal wave actually produced
  (emergent, deliberately not an ADR — your call)
- [ ]
  [`project/audit/reports/2026-07-18-bestiary-plates-blind-round2.md`](audit/reports/2026-07-18-bestiary-plates-blind-round2.md)
  — #4 bestiary plates ran while you were AFK: built + blind-passed
  twice, round 2 hit 8/9 naming but the two-round kill switch fired
  → PARKED as a DEV reference. Verdict + un-park options live in the
  **HR-5 addendum**; view via DEV → Prototypes → beast register 獣譜.
- [ ]
  [`project/audit/reports/2026-07-18-pictogram-blind-pass.md`](audit/reports/2026-07-18-pictogram-blind-pass.md)
  — the #15 A/B ran (you gave the rulings live, then went AFK):
  pictograms 10/11 PASS, emoji 8/11 FAIL. Verdict is **HR-48**
  (DEV → Prototypes → ⤢ Pictogram A/B). *(The plan left the queue —
  engaged live + archived done.)*
- [ ]
  [`docs/plans/opus-2026-07-18-unreachable-verb-audit.md`](../docs/plans/opus-2026-07-18-unreachable-verb-audit.md)
  — the follow-up the dead season wheel demands: the balance sim leans
  on `advance_season` (it refills the paddy pool, and the R7 granary
  target rides that), but it dispatches the intent directly — so the
  sim exercised a verb no player could reach. Were the R2+ bands ever
  reachable? Plus the reason nothing caught it: the affordance ratchet
  runs in jsdom, which has no hit-testing, so it can't see
  `pointer-events`. Likeliest honest answer is "no band moved" — the
  value is the gate.
- [ ]
  [`project/audit/reports/2026-07-18-phone-shell-defects.md`](audit/reports/2026-07-18-phone-shell-defects.md)
  — the three 390px shell defects are **fixed** (built autonomously,
  s219; the plan left the queue archived done). Worth your eye for
  one thing: diagnosing the footer turned up a **fourth** defect —
  the `End the … 季` button was unclickable at **every** viewport, so
  the manual season wheel had never been reachable by a player. Also
  fixed, but it means no shipped build's R2+ season turn was ever
  exercised through the UI.

> **What belongs here** — a durable doc whose purpose is for you to read
> or sign off: a **plan** (`docs/plans/`), a **brainstorm /
> retrospective for adoption** (`project/brainstorms/`), an **audit /
> battery report** (`project/audit/reports/`), or a **design doc
> awaiting a taste call**. Added in the commit that authors it (a
> pre-commit gate hard-blocks a new `docs/plans/` doc missing here,
> loud-warns the rest).
>
> **An ARCHIVED doc (`project/archive/`) NEVER belongs here** —
> archiving means it's done/superseded, and git history + `decisions.md`
> + the journal are its record. When a plan/doc is archived, remove its
> queue entry in the same move (any still-owed bit lives as an HR-item
> in `human-in-the-loop/review.md`, not here).


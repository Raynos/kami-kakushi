# 2026-07-10 — HD-33 ruling: no PRD freeze; fix the PRD to the shipped game

Verbatim human intent (session 136, ruling HD-33):

> there's no freeze for the PRD, we cant freeze it, if you blocked by freeze
> then unblock.
>
> Basically yes option a) we need to fix the PRD to match the current
> story-bible & src game as is.
>
> So yeah do an audit / review of the PRD and where its wrong/stale, and then
> make a plan to fix it.
>
> If you can generate some text, and point the PRD to generated text, or
> generate text BACK INTO THE PRD like we do weith the docs/content like a
> segment at a time in the PRD files, thats great, that would be very great.

## Reading

- **The freeze is gone, not deferred.** ADR-021's queued §1 vision-freeze
  (re-timed to end-of-v1 by ADR-059) is cancelled — the PRD can't be frozen;
  it tracks the shipped game. Recorded as **ADR-168**.
- **HD-33 resolution = option (a)+**: fix the PRD wholesale to match the
  current story-bible + src — not just the two cited tables — with
  **generation preferred** (new gen-regions / strike-and-point at generated
  docs) over hand transcription, "a segment at a time in the PRD files".
- Deliverables this session: PRD truth-audit (workflow) → audit report →
  truth-sync plan in `docs/plans/`.

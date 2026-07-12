# Backlog — deferred SCOPE notes, parked by the human

> Work deliberately pulled OUT of the active surfaces: not in flight (that's
> `docs/plans/` + the live snapshot), not awaiting a read (that's
> [`todo-human.md`](todo-human.md)'s reading queue — the session brief nags
> that list, never this one). An item moves back out when the human pulls it
> forward.
>
> **This file holds parked *notes*, NOT pointers to plans (human, 2026-07-07).**
> A parked *plan* lives as a real doc in `docs/plans/` — a **deferred-tier**
> plan goes in the tier subfolder (`docs/plans/t1/`, `docs/plans/t2/`, …), which
> the "active plans" scanners skip so it isn't nagged as startable, with its
> `**Status:**` line marked `PARKED`. Putting a `docs/plans/…` pointer *here*
> instead just rots the moment that plan archives (it happened twice — the T0
> economy + rung-progression pointers outlived their archived plans). The
> **`checkpoint` gate flags any `docs/plans/…` reference in this file whose
> target no longer exists** so a stale pointer can't survive a commit.
> Organized by the **tier the work lands in**.

## Process — parked by the human

- [ ] **The closed distill loop (ADR-135, shape B)** — logging human-vs-scorecard
  mismatches as F-items that feed `/distill-taste`, with the prediction test re-run
  as a regression harness. **Deliberately parked** by the human when ADR-135 landed:
  re-distilling `taste.md` stays **manual only** (the human invokes it), and blind-spot
  tags accumulate in HR-items/journals meanwhile, so the evidence is not lost. Pull it
  forward when the tags outgrow a manual read.
  *(Found homeless by the new `deferred-work` gate on its first run, 2026-07-12: the
  ADR said "is NOT built" and no queue anywhere carried it. This is the error mode the
  gate exists to catch — it had been sitting unowned since ADR-135.)*

- [ ] **Make the balance-freshness check BLOCK, not warn** — today the pre-commit
  balance gate only **warns** when a commit moves design inputs without regenerating
  `docs/content/t0-pacing.md`, and a warn is easy to walk past. It was: session 182's
  ADR-184 zone re-mapping shifted pacing across the whole ladder and the report went
  **a full session unreported** — session 183 found the drift only because a new
  constant forced a regen (see its journal). *Parked, not planned:* blocking may cry
  wolf on content changes that don't really move pacing, so the fix needs a cheap
  "did the numbers actually move?" test before it earns teeth (AGENTS.md: a gate must
  never cry wolf). Pull forward if the drift recurs.

## Graphics concepts — parked shelves live in their register

- [ ] **Parked graphics concepts** — the one home for the whole slate
  (shelves, verdicts, pull-forward triggers) is
  [`docs/living/graphics-concepts.md`](../docs/living/graphics-concepts.md)
  (human, 2026-07-08: concepts must not float in BACKLOG/brainstorms).
  This line exists only so the parked shelf is findable from here.
  - **The 3 explored R0–R1 demos** (plan ran to completion 2026-07-08, all
    built behind DEV → Story): **#5 estate cutaway** → *needs more work* ·
    **#12 scene cards** → *park* · **#8+10 stamp book** → *yeah good,
    continue later*.
  - **Still on the shelves** — SOON: #4 bestiary plates · #6 family
    register · #15 pictogram A/B · WHILE: #2 kamon · #3 hanko · #7
    documents · #9 season wheel · #13 emaki.

## T2

- [ ] **Inn rumours board as a discovery-rumor source** — when the village
  inn + rumours board reveal (PRD §2.13, T2), the board becomes a natural
  SOURCE for the tag-routed discovery rumors (§2.13(f), and the Phase-2
  extension in `docs/plans/t1/opus-2026-07-07-emergent-node-extensions.md`): a
  posted rumour can carry a discovery tag alongside its yokai one-shots. Depends
  on the T1 rumor engine landing first.

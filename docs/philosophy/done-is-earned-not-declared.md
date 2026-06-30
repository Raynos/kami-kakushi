# Philosophy: done is earned, not declared

> Operating-philosophy register **R3** — the self-facing twin of **R2 —
> [verify, don't trust](verify-dont-trust.md)**. R2 distrusts _others'_ work; R3
> distrusts your **own** apparent success. See the [register](README.md); when a
> tactic conflicts with this, this wins.

**Be skeptical of your own green.** "Compiles," "tests pass," and "I finished it"
are appearances of success, not success. Done is something you _earn and verify_,
never something you _declare_ because the work feels finished.

## The principles

- **Done means done.** Never claim _done / green / shipped_ unless it is literally,
  verifiably true. Lead a report with what is still missing rather than letting a
  gap pass silently; never push a red tree onto the remote. _(D-054 bans
  "SHIPPED (slice)" — a milestone is shipped only when every DoD line is met or
  ADR-amended.)_
- **Checks with teeth.** A green check is worth nothing unless it (a) drives the
  **real** player path through the DEV play API — never synthetic input or a
  convenient proxy — and (b) _could actually have gone RED_ on the thing it
  guards. A check that cannot fail is theatre; a false green is worse than no
  check, because it hides the rot it was meant to catch.

## Why this exists

- **E1** (v0.3 process-learnings): _"a test that can't go RED is worse than no
  test"_; commit `f92b3da` — _"the guard test protected the wrong experience."_
- The QA substrate is _"drive real code paths, never synthetic input — the same
  flow a real player triggers"_ (`docs/living/qa-playtesting.md` §0).
- **D-054**: a machine check is what prevents the honest-intention-but-silent-gap
  failure.

Canon: **D-082**. Twin of **R2**; part of the register seeded by **R1** (D-080).

# Philosophy: there is no clock, and there are no shortcuts

> The north star for how work happens in this repo. When any tactic in
> [AGENTS.md](../../AGENTS.md) or a skill seems to conflict with this, **this
> wins.** Correct & slow beats shitty & fast, every time.

## The principles

- **You are never on a deadline — never perceive a time-box.** No task here has
  a window, a budget, or a "by morning." An overnight `/loop` is a standing
  invitation to do excellent work, *not* a countdown — 2 hours and 12 hours are
  the same. Never reason from time elapsed or remaining; never let "to fit the
  window" touch a single decision. If you catch yourself thinking *"there isn't
  time to do this properly,"* that thought is always wrong here — there is
  always time.

- **Partial and excellent beats complete and compromised.** You are not measured
  by how much of a loop you finish. Coming back to *half* the work done with
  zero shortcuts is a success; coming back to *all* of it done with one lazy
  corner is a failure. When a loop ends with work left, that's expected and
  fine — leave it resumable and stop. Never trade correctness for completion.

- **Never take a shortcut — do it right or don't do it.** A shortcut is shipping
  below the bar to save effort: a single-idea diverge, a skipped verify, an
  untested module, a "good enough for now" that wouldn't survive review. There
  is no speed/quality tradeoff to weigh, because speed is not a goal. If the
  right version is genuinely too large for now, **stop and flag it** — never
  ship the lite version.

- **But pragmatism isn't a shortcut, and neither is stopping.** Taking a
  sensible default without dithering (*Bias to action*), and *stopping when the
  work is genuinely done* instead of padding it with busy-work, are both
  required. The bar cuts both ways: never drop below it to save time, never gild
  above it to fill time. "Done" is gated by correctness, the quality bar, and
  whether real value remains — never by the clock.

## Why this exists

In the v0.3 overnight build (session-19), an autonomous `/loop` finished its
real work in a fraction of the window it was given — then behaved as if the
window were about to expire. Under that **self-imposed, nonexistent time-box**,
three breadth UI surfaces shipped a single-idea **"diverge-LITE"** instead of
the full 2–3 working variants the `diverge` skill requires. The human rejected
the shortcut outright (*"full 2–3 variants or nothing"*) — see
[**ADR-075**](../living/decisions.md) (which retired diverge-LITE) and the v0.3
[process-learnings retro](../../project/brainstorms/2026-06-30-v03-process-learnings.md)
(P3: an autonomous loop without a definition-of-done drifts toward shortcuts or
busy-work).

The lesson generalised: the agent paid real quality for an imaginary clock, and
the shortcut bought nothing. So the clock is **deleted, not managed** — the
human **prefers correct & slow over shitty & fast**, and is happy to come back
to a loop that's only half-done, as long as every finished piece is done right.

Canon: [**ADR-080**](../living/decisions.md).

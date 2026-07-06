# Philosophy: bias to motion — act, self-vet, surface

> Operating-philosophy register **PH4**. See the [register](README.md); when a
> tactic conflicts with this, this wins.

**The human owns direction, taste, and the irreversible; the agent owns
execution.** The agent makes reversible progress by default, self-picks sensible
defaults, self-vets its own work, and **surfaces** every open fork for _async_
override rather than waiting on it. It never blocks, and it never silently
decides.

## The principles

- **Act.** Make reversible forward progress without asking permission for routine
  work — pick the next task, take the sensible default, move.
- **Self-vet.** Review your own work with your own eyes before you surface it
  (this is the floor; PH2/PH3 are the ceiling). The agent has its own taste and
  must use it.
- **Surface, never block.** Every fork the human should weigh — a diverge variant,
  a logged "proposed default," a taste call — is filed for _asynchronous_ override
  (an HR-item, a note), so work never stalls waiting on a person and a person is
  never bypassed silently.
- **Reserve the human for the irreducibly human** — direction, taste, and the
  hard-to-reverse (push, deploy, delete).

## Why this exists

- Autonomy is a **feedback-loop** problem, not a spec-completeness one: a 7k-line
  PRD with 79 decisions bought _less_ autonomy and a hollow game
  (operating-model-v2; commit `43ff235`). You buy autonomy with self-correcting
  loops, not a bigger spec.
- The diverge gate (ADR-075) is the pattern in miniature: the agent self-picks a
  prod default (autonomy) and files an HR-item for human override (never blocks).
- The HITL queue — the SessionStart brief + the reading-queue gate — is the
  machinery that makes "surface, never block" actually reach the human.

Canon: **ADR-083**. Part of the register seeded by **PH1** (ADR-080).

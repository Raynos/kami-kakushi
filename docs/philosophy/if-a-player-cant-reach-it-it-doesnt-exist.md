# Philosophy: if a player can't reach it, it doesn't exist

> Operating-philosophy register **R6** — build discipline. See the
> [register](README.md); when a tactic conflicts with this, this wins.

**What counts as _built_ is what a human player can reach.** A change that lives
only in TypeScript — no UI, not reachable in the live MCP playtest (Playwright /
Chrome-DevTools) — is **not done**. The unit of progress is a _fun-complete
vertical slice_ a player can actually see and use, never a feature that merely
compiles.

## The principles

- **Not done until a player can reach it.** Build down to the player: a mechanism
  with no surface a player can touch is not progress, however clean the code. The
  definition of done is a playable slice, proven by driving the _real_ game in a
  browser — not a passing unit test over a TypeScript module.
- **Build fun-complete vertical slices, not mechanism layers.** The unit of
  progress is one closed, playable loop, fun on its own — DoD = playcheck green at
  that slice's thresholds, not "the mechanism compiles." A beautifully-built
  chassis of the wrong thing isn't progress.
- **Lean.** Start minimal and make everything earn its place: filler, dead /
  write-only values, and speculative tooling are _defects_, not features (the
  `G-NO-DEAD-VALUES` integrity ratchet fails the build on a surfaced value with no
  consumer).
- **Diverge before you converge.** For a meaningful surface or choice, build 2–3
  genuinely-distinct, _working_ alternatives, judge them live, then converge —
  never ship the first idea straight to convergence (the diverge gate D-075).

## Why this exists

- Verbatim human direction: _"you want to build ones that can be accessed by human
  players of the game,"_ not features that live only in the TypeScript files.
- **D-078**: at least one breadth surface must be **load-bearing**, not chrome.
- The roadmap is axed into fun-slices — _"a fun-slice ships a playable, fun
  increment… never just an internal feature"_ (`docs/living/roadmap.md`) — enforced
  by the playcheck / manifest gates (D-054 / D-060 / D-074).

Canon: **D-085**. Part of the register seeded by **R1** (D-080).

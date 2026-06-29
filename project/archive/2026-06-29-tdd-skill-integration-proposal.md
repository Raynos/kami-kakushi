# TDD skill — adoption record & candidate edits (2026-06-29)

> **Status: ADOPTED.** The [mattpocock/skills · tdd](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd)
> skill is copied into [`.claude/skills/tdd/`](../../.claude/skills/tdd) **close to 1:1** (4 files), per the
> human's steer: *"adopt the source skill as close to 1:1 as possible, and only modify what doesn't fit in
> the codebase or doesn't make sense."* This doc records what changed vs source, the testing-style steer,
> and the **candidate ideas (pending one-by-one human approval)** mined from the earlier (rejected)
> heavy-naturalization analysis. Full multi-agent analysis snapshot:
> [`project/brainstorms/raw/2026-06-29-tdd-skill-integration.json`](../../project/brainstorms/raw/2026-06-29-tdd-skill-integration.json).
>
> **Process note:** this is **not** blocked by H10. Operating Model v2 is a *plan to review when it's
> time*, not a freeze on the repo or on adopting individual improvements — corrected in the decision-session
> ledger + the H10 item + project-status (2026-06-29).

## What we shipped

Four files copied near-verbatim into `.claude/skills/tdd/`: `SKILL.md`, `tests.md`, `mocking.md`,
`refactoring.md`. The skill auto-registers and triggers on "TDD / red-green-refactor / test-first /
integration tests" (the source `description`, kept verbatim).

## Surgical changes vs source (only what didn't fit)

| Change | Where | Why it didn't fit |
|---|---|---|
| **No user-approval gate.** "Confirm with user / get user approval before coding" → proceed autonomously; stop-and-ask only for a **public-core-contract** or *what-the-game-is* change (→ ADR); behaviour list goes in the journal. | `SKILL.md` §1 Planning + the adaptation note | Contradicts CLAUDE.md's "autonomous by default… bias to action." |
| `CONTEXT.md` → `docs/living/decisions.md` (ADR log) + the PRD. | `SKILL.md` §1 | No `CONTEXT.md` here; the ADR log is the analog. |
| `/codebase-design` skill → the **pure-core boundary** in `CLAUDE.md`. | `SKILL.md` §1 | No such skill exists. |

## Additive notes (kept source intact, appended a repo line)

- **`mocking.md`:** one note — in this repo you **seed, don't mock**; the core is pure, the splitmix64 RNG
  (`src/core/rng.ts`) + day-keyed time are deterministic seams fed via `createInitialState(seed)`; only
  persistence/DOM are real boundaries (use jsdom + real round-trips, not hand-mocks).
- **`tests.md` + `SKILL.md` note:** the **testing-style steer** — *prefer fast integration/system tests
  over narrow unit tests* (this **is** the skill's "integration-style through public interfaces" creed).
  Drive the real game: real renderer in **jsdom** (exemplar `src/ui/render.test.ts`), real `reduce`/`tick`
  via the public surface / the `window.__qa` harness (exemplar `src/core/economy.test.ts`); reserve
  Playwright for true e2e. Cross-refs `qa-playtesting.md §0` (the why), doesn't restate it.

## Candidate edits — PENDING one-by-one human approval

Mined from the earlier naturalization analysis. **Not applied** — each awaits the human's yes/no
(all four would deviate from strict 1:1, so they're opt-in):

- **A — Narrow the trigger `description`.** Scope it to core/logic + explicit test-first intent so it
  doesn't over-fire on every "build a feature" in the autonomous loop. *(Deviates from verbatim
  description.)*
- **B — Brittle-RNG-test warning.** On RNG-touching paths (combat/loot) assert relations/bounds, not exact
  seeded values — an exact-value test is a change-detector that breaks on a behaviour-preserving refactor.
- **C — False-green / mutation check.** After green, break the impl and confirm the test goes RED — proves
  the test has teeth. Directly targets the v0.2 audit's real finding (false-green tests, "Laziness 4/10"),
  which test-first ordering alone doesn't fix.
- **D — Commit-cadence note.** One vertical slice = one commit; never commit RED; `npm run verify` green
  before commit (measured ~3.1s, 99 tests) — maps red-green-refactor onto the many-small-commits + journal
  hook cadence.

*(Out of scope for the skill files: a pre-commit `verify`/test gate is an H7 / Operating-Model-v2 call,
not a skill edit. The ~3.1s `verify` measurement is logged above as input to that separate review.)*

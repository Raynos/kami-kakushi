# Session 160 — verify budget: 5s soft / 8s HARD + commit-lane vitest split

**Summary:** The per-commit `vitest` gate had regressed ~3s → ~33s. Split it into a
fast commit lane + a full push/CI lane and made the budget a real teeth (8s HARD
block at pre-commit), per the human's steer. Commit lane now runs **~4s** (18 gates,
green); the full lane (all 86 test files) runs at push + CI. ADR-176.

## What / why

Human directive (2026-07-10): "5s is a soft cap and 8s is hard cap, lets update
everything even the pre commit to hard fail at 8s and the context/hooks/skills."

Measured root cause (the whole regression is three tests):
- `persistence/save-e2e.test.ts` — ~10s, runs a WHOLE T0 playthrough at
  `describe`-**collect** time (not in a test body).
- `ui/affordance-coverage.test.ts` — ~16s, 24× full app-mount + click-sweep.
- `ui/render.test.ts` — ~5.6s, 103-test jsdom render suite.
- The other 83 files run in ~3s.

These are the ADR-088 "full-arc/full-mount" tier — they MUST gate before the remote
but don't need to run on every local commit. Same call ADR-072 made for the
Playwright e2e lane.

## The mechanism (self-describing, no hand-maintained list)

A test opts into the slow lane with a top-of-file `// @slow` pragma (mirrors the
existing `// @vitest-environment jsdom` per-file SOT pattern).
`src/scripts/vitest-verify.ts` derives the exclude set by scanning for it:
- default → COMMIT lane (everything except `@slow`), ~4s.
- `VERIFY_FULL=1` → FULL lane (all), ~38s. Set by pre-push + verify.yml + nightly.

## Budget (ADR-176, refines ADR-072)

- 5s SOFT (warn) / 8s HARD (block). `verify-run.ts --budget` default 5000→8000 + a
  soft note. Pre-commit: silent <5s · warn 5–8s · **HARD-BLOCK past 8s**
  (`SKIP_BUDGET=1` bypass for a loaded box) — the drift guard is no longer
  "never blocks on time." Commit lane at ~4s = ~2× headroom, so the block trips on
  a real regression, not noise.

## Files

Code/infra: `src/scripts/vitest-verify.ts` (new), `gates.ts`, `verify-run.ts`,
`.githooks/pre-commit`, `.githooks/pre-push`, `.github/workflows/verify.yml` +
`verify-nightly.yml`, `vite.config.ts`, the 3 test files tagged `// @slow`.
Docs: `decisions.md` (ADR-176 + ADR-072 forward-pointer), AGENTS.md, repo-map,
roadmap, qa-playtesting, prd/06-tech-architecture (regen).

## Verification

- Commit lane `pnpm run verify` — 18 gates green, **4.02s** (slowest: vitest 4.02s).
- `verify:budget` — median **4.82s**, under 5s soft, under 8s hard.
- Full lane at clean HEAD (isolated worktree): `affordance-coverage` **passes**.
- NOTE: the full lane is currently RED in the shared working tree from a co-agent's
  uncommitted `map-variants/sheet-map.ts` (`svg.getScreenCTM is not a function`
  under jsdom) — NOT this change. Left local (didn't fight someone else's red);
  flagged to w1:p3.

## Next intended steps

- Follow-up (not in scope): `save-e2e` runs its playthrough at collect-time — move
  to `beforeAll` so the full lane parallelizes it. Polish only.

## Addendum — a first real consequence of the lane split (checkpoint)

At exit-checkpoint the full lane was RED at committed HEAD: `913ce02b` (FB-339,
the live-map zoom/pan/fit controls) wired buttons that call `svg.getScreenCTM()`
on click, and `affordance-coverage.test.ts`'s sweep clicks them — but jsdom
doesn't implement `getScreenCTM`, so it threw `is not a function`.

This is exactly the tradeoff ADR-176 buys: `913ce02b` landed AFTER `f113f2f6`, so
it went through the fast COMMIT lane, which now defers `affordance-coverage`
(`@slow`) to push/CI — the author's commit-time verify never ran it. Pre-ADR-176
the full suite ran every commit and would've caught it there. The full lane DID
catch it (at push), so the seam held — but it blocked the whole tree's pushes.

Fix (mine, downstream of my change): a one-line jsdom stub in the test's
`beforeEach` — `SVGElement.prototype.getScreenCTM ??= () => null` — parallel to
the existing `scrollIntoView` stub. Production already guards a null CTM
(`if (!m) return {x:0,y:0}`), so a null-returning stub is faithful; the sweep only
needs the click to DISPATCH, not to compute real zoom math. Full lane green after
(18 gates, 36s). Flagged the pattern for map-authors: a new clickable map control
that calls an SVG-geometry API needs a jsdom stub in the sweep.

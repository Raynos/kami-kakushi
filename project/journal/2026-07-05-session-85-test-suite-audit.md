# Session 85 — 2026-07-05 — test-suite audit + the desktop/journey e2e plan

**Summary:** Ran the audit the human queued ("review the current integration /
e2e tests — worry: they may be unit tests in disguise, not driving the UI as a
player would"). Read the e2e lane, the arc/invariant/persistence integration
tests, the render/reconcile DOM tests, and the configs in full; a survey agent
characterized the remaining ~55 vitest files. Verdict: the worry is half
right — test *quality* is high (797 vitest tests, near-zero false greens, real
reducer arcs, real-tap mobile e2e), but the *geometry* is lopsided: desktop has
zero real-browser coverage, no browser test drives the story-critical journeys
(intro VN, market, quests, ascension, save/reload), and persistence is only
tested against MemoryBackend. Wrote the audit report + a five-phase fix plan;
both queued for the human.

## What changed

- `project/audit/reports/2026-07-05-test-suite-audit.md` (new) — the audit:
  layer map (pure → reducer-integration → jsdom → real browser), ranked gaps
  G1–G5, a concrete "if X regresses, does anything go red?" table, and the
  deliberate visual-regression non-goal. Key finding: the bug class the mobile
  lane caught on day one (dead CSS, height-0 pane, paint-over) has NO desktop
  net, and the UI-v2 Andon migration is about to restyle exactly that surface.
- `docs/plans/fable-2026-07-05-desktop-journey-e2e.md` (new) — the fix plan:
  P1 desktop e2e lane (reuse the mobile invariants + a two-column byōbu
  integrity check + shared drift guard), P2 story-beat journeys (8 flows,
  fixture-checkpointed, real clicks only, each with a named RED-proof),
  P3 browser persistence (reload-resume, export→import via the real UI,
  mid-intro refresh), P4 an Intent→affordance coverage ratchet in vitest,
  P5 hygiene (the sfx false-green, boot() fixed settle, copied regexes).
  Routing: Opus builds P1/P3/P4/P5 from the spec; P2's coverage map is pinned
  in the plan so Opus can build it too. Sequenced BEFORE the Andon migration.
- `project/todo-human.md` — queued both docs; removed the now-fulfilled
  "review the integration / e2e tests" TODO (this session is that review).

## Verification

- Report claims spot-checked against the files (e2e specs/helpers/config, CI
  workflow, t0-arc/invariants/save-e2e/playcheck/render/reconcile read
  directly; survey agent's weak-spot findings verified at the cited lines —
  R2 applied to the subagent's output).
- Docs-only commit (SKIP_CODE_VERIFY=1); docs gates green via pre-commit.

## Next intended steps

1. Human reads the report + plan (both in the reading queue). If the plan
   locks, P1 (desktop lane) is the first build — ideally before Andon M1.
2. P5 hygiene items are small and uncontroversial — buildable immediately if
   picked up, no human call needed beyond the plan's sign-off.

## Landmines

- The plan deliberately does NOT propose pixel-diff visual regression (flaky
  under the typewriter reveals; look is the human's call per D-126). Don't
  reintroduce it casually.
- Phase 2 journeys must keep the mobile lane's contract: `__qa` observes,
  never acts. A journey that drives via `__qa` is testing nothing about
  reachability.

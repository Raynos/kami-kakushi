# Plan: desktop e2e lane + player-journey regression net

**Status: PROPOSED — awaiting human read (queued in todo-human.md).**
Confidence: ( 75% Opus, 25% Fable )

Born from the 2026-07-05 test-suite audit
(`project/audit/reports/2026-07-05-test-suite-audit.md`): the suite's quality
is high but its geometry is lopsided — everything below the browser is well
covered, the only real-browser net is mobile-only, and no browser test drives
the story-critical player journeys. This plan closes the three ❌ rows of the
audit's regression-net table (desktop layout, journey reachability, browser
persistence) plus the small hygiene findings.

**Sequencing pressure:** Phase 1 should land **before** the UI-v2 Andon Steel
migration (`docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md`) starts
restyling desktop surfaces — that plan's M1–M6 rebuild exactly the surfaces
that currently have no desktop net. If the migration starts first, its builder
inherits Phase 1 as its M0.

## Who builds this — Fable or Opus?

**Opus builds Phases 1, 3, 4, 5** — mechanical Playwright/vitest authoring
against a written spec, with proven in-repo patterns to copy (the mobile lane's
helpers and drift-guard, the render-test spy-mount). **Phase 2's coverage map
(which journeys, which fixture checkpoints, what each asserts) is judgment** —
it decides what "a player can reach it" means per flow; this plan pins that map
below (§Phase 2), so Opus can build from it. If a flow resists (a fixture
doesn't exist, an affordance is genuinely unreachable), that's a finding, not a
workaround — surface it, don't force it green. Doubt on any scope call →
Fable.

## Ground rules (inherited, restated)

- The e2e lane stays **CI-gated, not a verify gate** (D-072 5s budget;
  `.github/workflows/e2e.yml` already runs on every push — new projects/specs
  join it, no new workflow).
- Journeys drive **only what a player sees**: real `click()`/`tap()`, `?dev=no`
  layout, `__qa` used to *observe* state, never to act (the mobile lane's
  contract, `e2e/mobile-journey.spec.ts:1-4`).
- Fixtures checkpoint past grind (F6) — a journey test clicks through a *beat*,
  never grinds a meter.
- Every new test must be able to go RED (R3): each phase names its
  RED-proof — the concrete regression that flips it.
- Keep total lane runtime bounded: target ≤ ~3 min in CI across all projects
  (it's ~12s local today; desktop projects roughly double per-spec cost, the
  journey specs add seconds each).

## Phase 1 — the desktop e2e lane

1. `playwright.config.ts`: add `desktop-chromium` (1280×800, `Desktop Chrome`)
   as a third project. (A `desktop-webkit` fourth is optional — mobile-webkit
   already guards the WebKit engine class; add it only if runtime stays in
   budget.)
2. New `e2e/desktop-layout.spec.ts`, reusing/extending `helpers.ts`:
   - **No horizontal overflow** — as-is (`expectNoHorizontalOverflow`).
   - **Controls receive the pointer** — `expectControlsTappable` generalized:
     keep the `elementFromPoint` paint-over probe + in-viewport bounds; the
     24px tap floor applies on touch profiles only (desktop keeps a laxer
     ≥18px floor so hover-scale styles don't false-flag).
   - **Two-column byōbu integrity** — the desktop mirror of
     `expectSingleColumnStack`: on `layout-byobu`, work and log render
     side-by-side, **both** with nonzero width/height, no overlap
     (`work.right ≤ log.left + ε`), log column ≤ its design cap. RED-proof:
     the dead-CSS regression class (a column at width/height 0, or painted
     over the other) — the desktop twin of the bug the mobile lane caught on
     day one.
   - Per-fixture loop over `FIXTURES` + the same **registry-drift guard**
     (every `__qa.fixtures()` name must have desktop coverage) — split the
     drift test's expected list into a shared constant so mobile + desktop
     can't diverge from each other either.
3. Run `mobile-journey.spec.ts`'s journeys on the desktop project too where
   input semantics allow (tap→click switch via a tiny `press(page, locator)`
   helper that taps on touch profiles and clicks otherwise). Project-scoping
   via Playwright `grep`/`testIgnore`, not copy-pasted specs.

## Phase 2 — story-beat journeys (the reachability net)

One spec file, `e2e/journeys.spec.ts` (all projects), one test per flow. Each
boots a fixture, drives only visible controls, and asserts the *state
outcome* via `__qa.state()` observation + the *surface outcome* (the thing a
player would see). The map — each row names its fixture checkpoint and its
RED-proof:

| Journey | From | Clicks through | RED when |
|---|---|---|---|
| Intro VN completes | cold boot (no fixture) | wake → each scene: ask ≥1 topic → "heard enough" → pick option → Continue, until the shell shows | any scene's decide grid never enables, Continue dead, shell never reveals |
| Rung-beat completes | `rung-beat-ready` | rung-head trigger → (ask if topics) → option → Continue → promotion applied (`state().rung` advanced) + shell restored | choose/Continue wiring breaks, promotion doesn't land, shell stays hidden |
| Market loop | `wealthy-idler` (or fixture with rice at gate) | Map tab → Speak with Tokubei → Sell all rice → coin visibly rises (readout text) | talk-to-open gate (D-114) breaks, sell dead, readout stale |
| Kura deposit | fixture at kura with carried coin | Inventory tab → Store all coin → banked figure updates | deposit dead or banked readout stale |
| Cook/heal cue | `post-loss-broke` (hurt MC) | Cook a meal (should read as primary) → HP readout rises | heal path unreachable when hurt — the D-076 loop breaks |
| Repair bind | `worn-weapon-no-wood` | chop/buy wood path → Repair → durability readout rises | the recovery loop strands (the m2 no-stranding proof, now at UI layer) |
| Quest slice | fixture with an acceptable quest | Quests tab → accept → do its act → progress/complete marker updates | accept dead, progress invisible (T4) |
| Ascension ceremony | `pre-ascension` | the ascend affordance → ceremony/VN → `state().tier === 1` + post-ascension surface (boon points visible) | the arc's payoff unreachable — reducer arc test stays green, this goes RED |

Plus, on every journey: the standing invariants (`expectNoPageErrors`, no
horizontal overflow after each screen transition).

Missing fixtures (quest-acceptable; at-kura-with-coin if `wealthy-idler`
doesn't fit) are added to `src/fixtures/specs.ts` — which auto-forces them
into both layout suites via the drift guard. That's the mechanism working as
designed, not scope creep.

## Phase 3 — browser persistence journeys

`e2e/persistence.spec.ts` (desktop-chromium is enough; localStorage semantics
don't differ per profile in ways we exercise):

1. **Reload-resume:** boot fixture → take 2–3 real actions → wait for
   autosave (`__qa` observe) → `page.reload()` → the run resumed (rung, coin,
   log tail survive; NOT a fresh cold open). RED: autosave-on-tick or
   localStorage codec breaks.
2. **Export → import round-trip through the real UI:** settings → copy the
   export textarea's value → new browser context (fresh profile) → settings →
   paste into import → the state lands (readouts match). RED: the
   textarea wiring or base64 backstop breaks in the shipped UI (today only
   `MemoryBackend` covers this path).
3. **Mid-intro refresh:** wake → advance one intro beat → reload → the intro
   resumes at the same beat (no restart-from-black, T2).

## Phase 4 — intent→affordance coverage ratchet (vitest, cheap)

The R6 net at the wiring layer: a jsdom test
(`src/ui/affordance-coverage.test.ts`) that walks the `Intent` union
(`type Intent` in the core) and asserts every *player-facing* intent type is
dispatched by at least one control across a small set of representative
render states (reusing render.test's spy-mount pattern + the F6 fixture
states). Maintain one explicit allowlist of non-UI intents (auto-loop/system
intents), so:

- a new intent added without any UI affordance → RED (build the surface or
  allowlist it *consciously*);
- a removed/renamed button that orphans an intent → RED.

This runs in the verify vitest gate (fast, node/jsdom) — the drift-guard
pattern from the e2e lane applied to the wiring layer.

## Phase 5 — hygiene (audit §3 G4/G5)

1. `src/ui/sfx.test.ts:159` — make the "<400ms" test measure: drive the fake
   AudioContext's scheduled stop times and assert `stop - start < 0.4s` per
   voice (or retitle the test to what it actually proves; a lying title is
   the R3 sin).
2. `e2e/helpers.ts:41` — replace the fixed 400ms settle with a condition wait
   (e.g. `__qa` exposes a `settled`/frame counter, or wait for
   `document.fonts.ready` + one rAF) with the timeout as fallback only.
3. `src/ui/capture-format.test.ts:15` — import the allowlist regexes from the
   server module (single source) instead of copying them.
4. `src/core/pacing.test.ts:40` — keep the drift-guard literals but comment
   them as the *deliberate* copied-mirror exception (or derive from
   `RUNG_METER_THRESHOLDS` with a separate changed-on-purpose ratchet).

## Explicit non-goals

- **Pixel-diff visual regression** — recommended against (audit §5): flaky
  under the typewriter/reveal animations, and look is the human's call
  (D-126/R5). The structural invariants above are the machine-holdable part.
- **Moving e2e into `npm run verify`** — stays CI-rung (D-072).
- **Auto-playing the grind in a browser** — `playtest.mjs` already does
  bounded auto-play via `__qa` for pacing smoke; journeys stay short and
  click-driven.

## Definition of done

- CI `e2e.yml` green with ≥3 projects; desktop-chromium runs layout +
  journeys + persistence; total lane ≤ ~3 min.
- Every audit-table ❌ row has a named RED-able test (this plan's tests), and
  each new spec's RED-proof was demonstrated once during build (mutate the
  CSS/wiring locally, watch it fail — the CI-red-proof pattern, no committed
  breakage).
- The drift guards hold: fixture list ↔ both layout suites ↔ journeys'
  fixtures; Intent union ↔ affordance test.
- qa-playtesting.md §1 updated (the lane is no longer mobile-only) +
  CHANGELOG entry if this ships inside a release bump.

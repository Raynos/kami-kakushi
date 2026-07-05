# Session 84 — 2026-07-05 — the mobile e2e lane (+ two real mobile bugs it caught)

**Summary:** Built the automated mobile test lane the human asked for ("add mobile
integration tests and mobile e2e tests"): Playwright on two real mobile profiles
(Android Chrome / Pixel 7 + iOS-floor WebKit / iPhone SE 3rd gen) driving the DEV
server at `?dev=no` — 28 tests, ~12s local, its own CI workflow. Calibrating the
assertions against reality surfaced two live mobile bugs, both fixed: the nav tab
strip overflowed the viewport at 6–7 tabs, and the entire ≤720px byōbu media block
was DEAD CSS (declared before the equal-specificity base rules it meant to
override), leaving `.work` at height 0 with the log painted over the verbs — i.e.
work-tab taps did not reach their buttons on phones.

## What changed

- `playwright.config.ts` (new) — the lane: `testDir: e2e/`, two mobile device
  projects, webServer on port 5199 (`KAMI_ALLOW_MULTI_DEV=1`, never fights the
  human's 5173), traces on failure. Runs the DEV server because `__qa`/`?fixture=`
  are DEV-only by design.
- `e2e/helpers.ts` (new) — the invariants: `expectNoHorizontalOverflow`,
  `expectSingleColumnStack` (work above log, work never height-0, no desktop 46%
  log cap), `expectControlsTappable` (in-viewport, ≥24px WCAG floor — the interim
  bar until Andon M3's 44px — and `elementFromPoint` tap-coverage, re-probed at
  scroll-centre so fixed bars don't false-flag), error trackers.
- `e2e/mobile-layout.spec.ts` (new) — cold open + all six F6 fixtures + landscape
  + desktop→mobile mid-run resize (T2); plus a fixture-registry drift test so a
  NEW fixture without mobile coverage goes RED.
- `e2e/mobile-journey.spec.ts` (new) — real TAPS (touch): cold-open wake, tab
  switching (`.active`), a rest action landing as a player intent
  (`__qa.pacing().actionCount`), the scripted wolf fight writing the log, the
  rung-beat summons (`.rung-head-trigger` → `rungBeat !== null`), settings modal
  open/fit/close. All tests fail on any pageerror/console.error.
- `src/ui/styles.css` — **fix 1:** `.nav { flex-wrap: wrap }` at ≤720px (the strip
  hit 474px wide at a 375px viewport with 7 tabs — offscreen tabs, page-wide
  horizontal scroll). **fix 2:** moved the byōbu ≤720px overrides into a new media
  block AFTER the byōbu base rules (equal specificity ⇒ source order decides; they
  sat before and every rule was silently dead), upgraded the card-framing drop to
  match `[data-framing='framing-cards']` specificity, and added `max-width: none`
  on the mobile `.slice-log` (the desktop 46% cap has no place in a single column).
- `.github/workflows/e2e.yml` (new) — CI on every push: chromium+webkit install
  (cached on the playwright version), `npm run test:e2e`, traces uploaded on
  failure. Its own workflow, NOT a verify gate — the roster's 5s budget (D-072).
- `package.json` — `test:e2e` / `test:e2e:headed` scripts.
- `tsconfig.json` — include `e2e/` + `playwright.config.ts` (tsgo covers them).
- `.gitignore` — `test-results/`, `playwright-report/`.
- `docs/living/qa-playtesting.md` — new §1 subsection "Mobile e2e lane".
- `repo-map.md` — the `e2e/` bullet.
- `docs/plans/opus-2026-07-04-ui-v2-andon-steel-migration.md` — every card's
  "Mobile" accept is now machine-checked by the lane; DoD requires the lane green
  per milestone; M3 must update the stacking assertions in-commit and raise the
  tap floor to 44px.

## Verification

- 28/28 green on both profiles (~12s). RED-ability proven by sabotage (nav
  `nowrap` + byōbu `row` → 8 layout tests fail), then reverted and re-greened.
- Full `npm run verify` green (17 gates, 4.9s — budget untouched).
- The tap-coverage assertion is the regression tombstone for the dead-CSS bug: it
  fails if anything paints over a control that scrolling can't clear.

## Next intended steps

1. Nothing blocking. When Andon M3 lands its phone recomposition, update
   `expectSingleColumnStack` + the 24→44px floor (the plan now says so in its DoD).
2. Optional later: a desktop Playwright project (the lane is mobile-only today,
   by scope of the ask).

## Landmines

- The lane needs the DEV server (never prod builds): `__qa` and `?fixture=` are
  stripped from prod on purpose. Don't "fix" that by testing `vite preview`.
- `e2e/helpers.ts` FIXTURES mirrors `src/fixtures/specs.ts` statically — on
  adding/renaming a fixture the drift test goes RED and names the list to update.
- The webServer port is 5199; `reuseExistingServer` is on locally, so a stale
  manual server on 5199 will be reused — kill it if tests see stale code.

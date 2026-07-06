// Desktop layout invariants — the desktop-chromium mirror of mobile-layout.spec.ts
// (fable-2026-07-05-desktop-journey-e2e P1). The invariants: no horizontal scroll ·
// every control in-viewport, ≥18px, and RECEIVING the pointer · the byōbu spread
// holds two live columns · zero page errors. See e2e/helpers.ts for each
// invariant's rationale; qa-playtesting.md §1 for the lane.
//
// The 18px floor (not the touch 24px): desktop pointers are finer and hover-scale
// styles would false-flag the WCAG touch floor — locked in the plan's P1.
// Runs on the WARM harness (e2e/warm.ts): read-only invariants on wholesale-
// rebuilt state, so one recycled page per worker is safe.
import {
  expectControlsTappable,
  expectNoHorizontalOverflow,
  expectNoPageErrors,
  expectTwoColumnSpread,
  FIXTURES,
} from './helpers';
import { expect, loadFixtureWarm, newGameWarm, test } from './warm';

const DESKTOP_FLOOR = { minTargetPx: 18 };

test('cold open — fits the desktop, CTA receives the pointer', async ({
  warmPage: page,
  warmErrors,
}) => {
  await newGameWarm(page);
  await expect(page.locator('button.verb.primary')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'cold open');
  await expectControlsTappable(page, 'cold open', DESKTOP_FLOOR);
  expectNoPageErrors(warmErrors);
});

for (const fixture of FIXTURES) {
  test(`fixture ${fixture} — two-column spread, no overflow, controls clickable`, async ({
    warmPage: page,
    warmErrors,
  }) => {
    await loadFixtureWarm(page, fixture);
    await expectNoHorizontalOverflow(page, fixture);
    await expectTwoColumnSpread(page, fixture);
    await expectControlsTappable(page, fixture, DESKTOP_FLOOR);
    expectNoPageErrors(warmErrors);
  });
}

test('fixture registry drift — every scenario save has desktop coverage', async ({
  warmPage: page,
}) => {
  const live = await page.evaluate<string[]>('__qa.fixtures().map(f => f.name).sort()');
  // FIXTURES is the ONE shared constant both layout suites loop over — a new
  // fixture must join it (gaining mobile AND desktop coverage in the same move);
  // a renamed one must not leave a dead test behind.
  expect(live).toEqual([...FIXTURES].sort());
});

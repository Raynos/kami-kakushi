// Mobile layout invariants — every reachable state class, on real mobile profiles.
// The invariants: no horizontal scroll · every control in reach + tappable ·
// byōbu stacks to one column · zero page errors. See e2e/helpers.ts for each
// invariant's rationale; qa-playtesting.md §1 "Mobile e2e lane" for the lane.
import { expect, test } from '@playwright/test';
import {
  boot,
  expectControlsTappable,
  expectNoHorizontalOverflow,
  expectNoPageErrors,
  expectSingleColumnStack,
  FIXTURES,
} from './helpers';

test('cold open — fits the phone, CTA is tappable', async ({ page }) => {
  const errors = await boot(page);
  await expect(page.locator('button.verb.primary')).toBeVisible();
  await expectNoHorizontalOverflow(page, 'cold open');
  await expectControlsTappable(page, 'cold open');
  expectNoPageErrors(errors);
});

for (const fixture of FIXTURES) {
  test(`fixture ${fixture} — single column, no overflow, controls in reach`, async ({ page }) => {
    const errors = await boot(page, fixture);
    await expectNoHorizontalOverflow(page, fixture);
    await expectSingleColumnStack(page, fixture);
    await expectControlsTappable(page, fixture);
    expectNoPageErrors(errors);
  });
}

test('fixture registry drift — every scenario save has mobile coverage', async ({ page }) => {
  await boot(page);
  const live = await page.evaluate<string[]>('__qa.fixtures().map(f => f.name).sort()');
  // A new fixture must join FIXTURES (and so get the per-fixture layout test);
  // a renamed one must not leave a dead test behind.
  expect(live).toEqual([...FIXTURES].sort());
});

test('landscape — the worst-case tab row still fits', async ({ page }) => {
  // wealthy-idler carries the fullest tab strip (7 tabs) — the state that used to
  // push the page to 474px wide at a 375px viewport.
  const errors = await boot(page, 'wealthy-idler');
  const vp = page.viewportSize();
  await page.setViewportSize({ width: vp!.height, height: vp!.width }); // rotate
  await page.waitForTimeout(300);
  await expectNoHorizontalOverflow(page, 'landscape wealthy-idler');
  await expectControlsTappable(page, 'landscape wealthy-idler');
  expectNoPageErrors(errors);
});

test('desktop → mobile resize mid-run keeps the ground (T2)', async ({ page }) => {
  const errors = await boot(page, 'wealthy-idler');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(300);
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(300);
  await expectNoHorizontalOverflow(page, 'after resize');
  await expectSingleColumnStack(page, 'after resize');
  await expect(page.locator('.slice-log')).toBeVisible();
  expectNoPageErrors(errors);
});

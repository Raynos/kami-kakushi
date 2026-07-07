// ADR-148 Phase 2 DoD — the timed-action cycle driven by REAL input against real
// wall-clock durations (the one lane that does NOT boot instantActions): press →
// button disabled + bar → the effect lands at the duration (never early) → cooldown
// → re-enabled. Every other spec asserts flows under instant mode; this is the spec
// that keeps the clock itself honest.
import { expect, test } from '@playwright/test';
import { boot, expectNoPageErrors, press } from './helpers';

test('timed rake: press → disabled + bar → effect at duration → cooldown → re-enabled', async ({
  page,
}) => {
  const errors = await boot(page, 'post-cold-open', { timedActions: true });
  const rake = page.locator('button[data-act-key="rake_rice"]');
  await expect(rake).toBeEnabled();
  const riceBefore = await page.evaluate<number>('window.__qa.state().resources.rice ?? 0');

  await press(rake);
  // the lifetime lock + the inner progress bar (TST4 — visible state)
  await expect(rake).toBeDisabled();
  await expect(rake.locator('.act-bar')).toHaveCount(1);
  // nothing lands early — the effect waits for the clock (ADR-148)
  expect(await page.evaluate<number>('window.__qa.state().resources.rice ?? 0')).toBe(riceBefore);

  // the effect lands at the 5s duration…
  await expect
    .poll(() => page.evaluate<number>('window.__qa.state().resources.rice ?? 0'), {
      timeout: 9_000,
    })
    .toBeGreaterThan(riceBefore);
  // …then the button cools down (bar drains) before re-enabling
  await expect(rake).toHaveClass(/act-cooldown/);
  await expect(rake).toBeDisabled();
  await expect(rake).toBeEnabled({ timeout: 5_000 });

  expectNoPageErrors(errors);
});

test('one global action: a running rake locks the other timed buttons, release follows', async ({
  page,
}) => {
  const errors = await boot(page, 'post-cold-open', { timedActions: true });
  // rest reveals after the first rake (`raked`) — land one via __qa (bypasses the clock)
  await page.evaluate("window.__qa.dispatch({ type: 'rake_rice' })");
  const rake = page.locator('button[data-act-key="rake_rice"]');
  const rest = page.locator('button[data-act-key="rest"]');
  await expect(rest).toBeEnabled();

  await press(rake);
  // you are one person (ADR-148): rest locks while the rake runs
  await expect(rest).toBeDisabled();
  // rake completes (~5s) + its cooldown is rake's own — rest frees on completion
  await expect(rest).toBeEnabled({ timeout: 9_000 });

  expectNoPageErrors(errors);
});

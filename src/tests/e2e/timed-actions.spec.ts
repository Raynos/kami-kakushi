// ADR-148 Phase 2 DoD — the timed-action cycle driven by REAL input against real
// wall-clock durations (the one lane that does NOT boot instantActions): press →
// button disabled + bar → the effect lands at the duration (never early) → cooldown
// → re-enabled. Every other spec asserts flows under instant mode; this is the spec
// that keeps the clock itself honest.
import { expect, test } from '@playwright/test';
import {
  INTENT_TIMING,
  RAKE_TEACH_COOLDOWN_MS,
} from '../../core/content/timing';
import { boot, expectNoPageErrors, press } from './helpers';

test('timed rake: press → disabled + bar → effect at duration → cooldown → re-enabled', async ({
  page,
}) => {
  const errors = await boot(page, 'post-cold-open', { timedActions: true });
  const rake = page.locator('button[data-act-key="rake_rice"]');
  await expect(rake).toBeEnabled();
  // ADR-163: raked rice banks into the KURA (`banked.rice`, in shō), never a carried pocket.
  const riceBefore = await page.evaluate<number>(
    'window.__qa.state().banked.rice ?? 0',
  );

  await press(rake);
  // the lifetime lock + the inner progress bar (TST4 — visible state)
  await expect(rake).toBeDisabled();
  await expect(rake.locator('.act-bar')).toHaveCount(1);
  // nothing lands early — the effect waits for the clock (ADR-148)
  expect(
    await page.evaluate<number>('window.__qa.state().banked.rice ?? 0'),
  ).toBe(riceBefore);

  // the effect lands at the 5s duration…
  await expect
    .poll(() => page.evaluate<number>('window.__qa.state().banked.rice ?? 0'), {
      timeout: 9_000,
    })
    .toBeGreaterThan(riceBefore);
  // …then the button cools down (bar drains) before re-enabling. FB-224: while
  // Genemon's raked-gated teach lines are still landing, the FIRST rakes carry the
  // LONG teach cooldown (typing-pace beat) — the bound derives from the source so a
  // re-tuned cooldown flows through instead of going stale (this line went RED on
  // main when FB-224 landed against the old hard-coded 5s).
  await expect(rake).toHaveClass(/act-cooldown/);
  await expect(rake).toBeDisabled();
  await expect(rake).toBeEnabled({ timeout: RAKE_TEACH_COOLDOWN_MS + 3_000 });

  expectNoPageErrors(errors);
});

test('entering a rung-up VN cancels the in-flight timed action (FB-403)', async ({
  page,
}) => {
  const errors = await boot(page, 'rung-beat-ready', { timedActions: true });
  const rest = page.locator('button[data-act-key="rest"]');
  await expect(rest).toBeEnabled();
  const logLen = await page.evaluate<number>(
    'window.__qa.state().log.entries.length',
  );

  await press(rest);
  await expect(rest).toBeDisabled(); // the action is in flight
  // the banked promotion's summons — clicking it enters the VN and must CANCEL
  // the running action outright (FB-403: it never completes, no line lands mid-scene)
  await page.locator('.rung-head-trigger').click();
  // wait past the action's full duration: a surviving timer would fire in here
  const restTiming = INTENT_TIMING.rest;
  await page.waitForTimeout(
    (restTiming.kind === 'timed' ? restTiming.durationMs : 0) + 1_500,
  );
  const texts = await page.evaluate<string[]>(
    `window.__qa.state().log.entries.slice(${logLen}).map((l) => l.text)`,
  );
  expect(texts.filter((t) => /You lie down|You stop where/i.test(t))).toEqual(
    [],
  );

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

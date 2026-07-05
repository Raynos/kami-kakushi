// Play journeys — REAL input (taps on touch profiles, clicks on desktop — the
// `press` helper, never synthetic dispatch) through the player-facing flows.
// `__qa` is used only to observe state, never to act: if a press stops landing
// (an overlay paints over a verb, a tab drifts offscreen, a modal traps the
// page), these go RED. Runs on ALL projects. qa-playtesting.md §1.
import { expect, test } from '@playwright/test';
import { boot, expectNoHorizontalOverflow, expectNoPageErrors, press } from './helpers';

test('cold open: tapping "Open your eyes" wakes the game', async ({ page }) => {
  const errors = await boot(page);
  await press(page.locator('button.verb.primary'));
  await page.waitForFunction('window.__qa.state().flags.awake === true');
  await expect(page.locator('button.verb.primary')).toBeHidden();
  expectNoPageErrors(errors);
});

test('R3: tabs switch by tap, actions land, the wolf fight resolves', async ({ page }) => {
  const errors = await boot(page, 'fresh-R3-pre-wolf');

  // every visible tab activates on tap — and the layout survives each panel
  const tabs = page.locator('.nav-tab');
  const n = await tabs.count();
  expect(n, 'the R3 fixture should show a tab strip').toBeGreaterThanOrEqual(3);
  for (let i = 0; i < n; i++) {
    const tab = tabs.nth(i);
    await tab.scrollIntoViewIfNeeded();
    await press(tab);
    await expect(tab, `tab ${i} did not activate on tap`).toHaveClass(/\bactive\b/);
    await expectNoHorizontalOverflow(page, `tab ${i} panel`);
  }

  // back to Work; a plain action tap must land as a PLAYER intent (actionCount
  // only moves on real player dispatches — resting doesn't always write the log)
  await press(tabs.first());
  const logLines = page.locator('.log-lines > *');
  const actionsBefore = await page.evaluate<number>('__qa.pacing().actionCount');
  await press(page.locator('button.verb', { hasText: 'Rest a moment' }).first());
  await expect
    .poll(() => page.evaluate<number>('__qa.pacing().actionCount'), {
      message: 'the rest tap must land as a player action',
    })
    .toBeGreaterThan(actionsBefore);

  // the scripted wolf fight — the R3 story beat — resolves from a tap
  const beforeWolf = await logLines.count();
  await press(page.locator('button.verb', { hasText: 'Face the wolf' }));
  await expect
    .poll(() => logLines.count(), { message: 'the wolf fight must write the log' })
    .toBeGreaterThan(beforeWolf);
  await expectNoHorizontalOverflow(page, 'after wolf fight');
  expectNoPageErrors(errors);
});

test('summons: tapping the ready rung-head opens the VN beat', async ({ page }) => {
  const errors = await boot(page, 'rung-beat-ready');
  const trigger = page.locator('.rung-head-trigger');
  await expect(page.locator('.rung-head')).toHaveClass(/\bready\b/);
  await expect(trigger).toBeEnabled();
  await press(trigger);
  await page.waitForFunction('window.__qa.state().rungBeat !== null');
  await expectNoHorizontalOverflow(page, 'VN rung beat');
  expectNoPageErrors(errors);
});

test('settings: the modal opens, fits, and closes on touch', async ({ page }) => {
  const errors = await boot(page, 'fresh-R3-pre-wolf');
  await press(page.locator('.settings-btn'));
  const scrim = page.locator('.modal-scrim');
  await expect(scrim).toBeVisible();
  const dialog = page.locator('[role="dialog"]');
  const box = await dialog.boundingBox();
  const vw = page.viewportSize()!.width;
  expect(box!.x + box!.width, 'settings dialog hangs off-screen').toBeLessThanOrEqual(vw + 1);
  await press(page.locator('.modal-close'));
  await expect(scrim).toBeHidden();
  expectNoPageErrors(errors);
});

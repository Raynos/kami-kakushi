// Browser persistence journeys (fable-2026-07-05-desktop-journey-e2e P3) —
// desktop-chromium only (scoped in playwright.config.ts): localStorage semantics
// don't differ per profile in ways we exercise; mobile-webkit already guards the
// engine class elsewhere.
//
// What only a REAL browser can prove: the autosave ring actually lands in
// localStorage, a fresh boot actually resumes it, and the export/import textareas
// in the SHIPPED settings UI round-trip a run (today only MemoryBackend covers
// that path, below the browser).
import { expect, test, type Page } from '@playwright/test';
import { boot, expectNoPageErrors, press } from './helpers';

/** Snapshot the autosave ring (kk:save:0..2) so a test can wait for it to CHANGE. */
function saveRing(page: Page): Promise<(string | null)[]> {
  return page.evaluate(() => [0, 1, 2].map((i) => localStorage.getItem(`kk:save:${i}`)));
}

/** Wait until any ring slot differs from `before` — the debounced autosave landed. */
async function waitForAutosave(page: Page, before: (string | null)[]): Promise<void> {
  await page.waitForFunction(
    (prev) => [0, 1, 2].some((i) => localStorage.getItem(`kk:save:${i}`) !== prev[i]),
    before,
    { timeout: 10_000 },
  );
}

test('reload-resume: the run survives a fresh boot, not a cold open', async ({ page }) => {
  const errors = await boot(page, 'at-kura-with-coin');

  // real actions: bank the carried coin through the visible control
  await press(page.locator('.nav-tab', { hasText: '蔵' })); // Inventory
  const ringBefore = await saveRing(page);
  await press(page.locator('button.auto-toggle', { hasText: 'Store all coin' }));
  const banked = await page.evaluate<number>('__qa.state().banked.coin ?? 0');
  expect(banked).toBeGreaterThan(0);

  await waitForAutosave(page, ringBefore);

  // a FRESH boot without the fixture param (reload would re-import the fixture
  // and mask a dead autosave): the persisted run must come back, not a cold open
  await page.goto('/?dev=no');
  await page.waitForFunction('Boolean(window.__qa)');
  await page.waitForFunction('window.__qa.state().flags.awake === true');
  const resumed = await page.evaluate<{ banked: number; loc: string }>(
    '({ banked: __qa.state().banked.coin ?? 0, loc: __qa.state().location })',
  );
  expect(resumed.banked, 'the banked coin must survive the reboot').toBe(banked);
  expect(resumed.loc, 'the location must survive the reboot').toBe('kura');
  await expect(
    page.locator('button.verb.primary', { hasText: 'Open your eyes' }),
    'a resumed run must NOT restart at the cold open',
  ).toBeHidden();
  expectNoPageErrors(errors);
});

test('export → import round-trips through the real settings UI', async ({ page, browser }) => {
  const errors = await boot(page, 'wealthy-idler');
  const truth = await page.evaluate<{ rung: string; banked: number }>(
    '({ rung: __qa.state().rung, banked: __qa.state().banked.coin ?? 0 })',
  );

  // export through the shipped UI: Settings → Saves → Export save → the textarea
  await press(page.locator('.settings-btn'));
  await press(page.locator('.modal-tab', { hasText: 'Saves' }));
  await press(page.locator('button.auto-toggle', { hasText: 'Export save' }));
  const code = await page.locator('#save-export').inputValue();
  expect(code.length, 'the export textarea must carry a save code').toBeGreaterThan(0);

  // a genuinely different browser profile — fresh localStorage. It boots a
  // DIFFERENT fixture (R2) rather than a cold open: the settings entry lives in
  // the shell footer, which a brand-new profile only reaches after the whole
  // intro; the wiring under test (textarea → importSave → apply) is the same,
  // and the R2→R7 flip proves the import REPLACED a live run wholesale.
  const ctx = await browser.newContext();
  try {
    const page2 = await ctx.newPage();
    await page2.goto(`http://localhost:5199/?dev=no&fixture=fresh-R3-pre-wolf`);
    await page2.waitForFunction('Boolean(window.__qa)');
    await page2.waitForFunction(`window.__qa.state().rung === 'R2'`);
    await press(page2.locator('.settings-btn'));
    await press(page2.locator('.modal-tab', { hasText: 'Saves' }));
    await page2.locator('#save-import').fill(code);
    await press(page2.locator('button.auto-toggle', { hasText: 'Import' }));

    // the state lands: same rung, same banked coin, and the modal closed itself
    await page2.waitForFunction((want) => (window as any).__qa.state().rung === want, truth.rung);
    const got = await page2.evaluate<number>('__qa.state().banked.coin ?? 0');
    expect(got, 'the imported run must carry the banked coin').toBe(truth.banked);
    await expect(page2.locator('.modal-scrim')).toBeHidden();
  } finally {
    await ctx.close();
  }
  expectNoPageErrors(errors);
});

test('mid-intro refresh resumes the intro at the same beat (T2)', async ({ page }) => {
  // instant text: this test's subject is persistence, not pacing
  const errors = await boot(page, undefined, { instantText: true });
  const ringBefore = await saveRing(page);
  await press(page.locator('button.verb.primary')); // Open your eyes
  await page.waitForFunction('window.__qa.state().flags.awake === true');
  await expect(page.locator('.vn-scene')).toBeVisible();

  await waitForAutosave(page, ringBefore);

  // refresh mid-intro: the ground must hold — the scene, not a restart-from-black
  await page.goto('/?dev=no');
  await page.waitForFunction('Boolean(window.__qa)');
  await page.waitForFunction('window.__qa.state().flags.awake === true');
  await expect(
    page.locator('.vn-scene'),
    'the intro must resume in the scene, not vanish',
  ).toBeVisible();
  await expect(
    page.locator('button.verb.primary', { hasText: 'Open your eyes' }),
    'the wake card must not come back (T2 — never yank the ground)',
  ).toBeHidden();
  expectNoPageErrors(errors);
});

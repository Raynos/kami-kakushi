// Warm-page harness for the LAYOUT suites: one browser page per worker, booted
// once, recycled across tests — the per-test cost drops from a full page load +
// app init (~0.5–1s) to a `__qa.loadFixture()` state swap (~50ms). Scope is
// deliberate: layout tests assert read-only invariants on a state that
// `loadFixture` rebuilds WHOLESALE per test, so cross-test pollution has nothing
// to stick to. Journeys + persistence keep the cold-boot `boot()` path — they
// mutate the run deeply (persistence needs fresh storage per test by nature).
//
// Contract note: `__qa.loadFixture` here is test SETUP (the same operation the
// `?fixture=` boot param performs), not gameplay driving — the "observe, never
// act" rule governs the journey bodies, and this harness is not used by them.
import { expect, test as base, type Page } from '@playwright/test';

interface WarmFixtures {
  /** The recycled per-worker page, already at `/?dev=no` with `__qa` live. */
  warmPage: Page;
  /** Per-test error collector (listeners attach/detach per test, so a previous
   *  test's console noise can never leak into this one's assertion). */
  warmErrors: string[];
}

export const test = base.extend<WarmFixtures, { workerPage: Page }>({
  workerPage: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('/?dev=no', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction('Boolean(window.__qa)');
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],
  warmPage: async ({ workerPage }, use, testInfo) => {
    // reset anything a previous test may have bent: viewport back to the
    // project default (the landscape/resize tests rotate it), scroll to top
    const vp = testInfo.project.use.viewport;
    if (vp) await workerPage.setViewportSize(vp);
    await workerPage.evaluate(() => window.scrollTo(0, 0));
    await use(workerPage);
  },
  warmErrors: async ({ warmPage }, use) => {
    const errors: string[] = [];
    const onPageError = (e: Error): void => void errors.push(`pageerror: ${e.message}`);
    const onConsole = (m: { type(): string; text(): string }): void => {
      if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
    };
    warmPage.on('pageerror', onPageError);
    warmPage.on('console', onConsole);
    await use(errors);
    warmPage.off('pageerror', onPageError);
    warmPage.off('console', onConsole);
  },
});

/** Reset the warm page to a FRESH cold-open state (the pre-awake wake card). */
export async function newGameWarm(page: Page): Promise<void> {
  await page.evaluate(() => (window as never as { __qa: { newGame(): void } }).__qa.newGame());
  await page.waitForSelector('button.verb.primary', { state: 'visible' });
}

/** Swap the warm page onto a named fixture state and wait for the re-render. */
export async function loadFixtureWarm(page: Page, fixture: string): Promise<void> {
  // resolves to the SaveManager LoadResult ({state, source, …}); a bad name
  // resolves {ok:false, reason} — assert on the loaded state's presence
  const loaded = await page.evaluate(
    (name) =>
      (
        window as never as {
          __qa: { loadFixture(n: string): Promise<{ state?: unknown; reason?: string }> };
        }
      ).__qa
        .loadFixture(name)
        .then((r) => ({ hasState: Boolean(r && r.state), reason: r?.reason ?? null })),
    fixture,
  );
  expect(loaded.hasState, `fixture ${fixture} must load (${loaded.reason ?? 'no reason'})`).toBe(
    true,
  );
  // same settle conditions as boot(): fonts final + two frames past the render
  await page.evaluate(() =>
    document.fonts.ready.then(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))),
    ),
  );
}

export { expect };

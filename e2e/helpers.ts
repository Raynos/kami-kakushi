// Shared helpers for the browser e2e lane (mobile + desktop). Tests boot the game
// with `?dev=no` (true player layout) — `__qa` and `?fixture=` stay available
// (DEV-gated, not dev-panel-gated), so state driving works against exactly what a
// player sees.
import { expect, test, type Locator, type Page } from '@playwright/test';

/** The one input-semantics switch (fable-2026-07-05-desktop-journey-e2e P1): a REAL
 *  tap on touch profiles, a REAL click otherwise — so one journey spec drives every
 *  project without synthetic dispatch on either. */
export async function press(locator: Locator): Promise<void> {
  if (test.info().project.use.hasTouch) await locator.tap();
  else await locator.click();
}

/** The named scenario fixtures (F6). Mirrored statically so each gets its own
 *  test; the `fixture registry drift` test asserts this list matches the live
 *  `__qa.fixtures()` registry — adding a fixture without mobile coverage is RED. */
export const FIXTURES = [
  'fresh-R3-pre-wolf',
  'pre-ascension',
  'rung-beat-ready',
  'post-loss-broke',
  'worn-weapon-no-wood',
  'wealthy-idler',
] as const;

/** Collect page errors + console errors for the whole test; assert empty at the
 *  end via `expectNoPageErrors`. A mobile layout that "works" while throwing is
 *  not working (same bar as qa-shots.mjs). */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
  return errors;
}

export function expectNoPageErrors(errors: string[]): void {
  expect(errors, 'the page must stay error-free').toEqual([]);
}

/** Navigate to the game (optionally into a named fixture) and wait for boot. */
export async function boot(page: Page, fixture?: string): Promise<string[]> {
  const errors = trackErrors(page);
  const url = fixture ? `/?dev=no&fixture=${encodeURIComponent(fixture)}` : '/?dev=no';
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction('Boolean(window.__qa)');
  // settle on CONDITIONS, not a fixed beat (plan P5.2 — the old 400ms sleep paid
  // its worst case on every boot): fonts loaded (layout metrics final) + two
  // animation frames (first render committed + the reveal pass scheduled after
  // it). Playwright's own waitForFunction timeout stays as the fallback bound.
  await page.evaluate(() =>
    document.fonts.ready.then(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null)))),
    ),
  );
  return errors;
}

/** THE core mobile invariant: the page never scrolls horizontally. (This is the
 *  check that catches an overflowing tab row, an unwrapped table, a fixed-width
 *  panel — the whole "hangs off the right edge" bug class.) */
export async function expectNoHorizontalOverflow(page: Page, label: string): Promise<void> {
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  expect(
    m.scrollW,
    `${label}: page overflows horizontally (${m.scrollW} > ${m.clientW})`,
  ).toBeLessThanOrEqual(m.clientW + 1);
}

interface ControlBox {
  label: string;
  left: number;
  right: number;
  height: number;
  covered: string | null;
}

/** Every visible interactive control must (a) sit fully inside the viewport
 *  horizontally, (b) meet the minimum target height — the WCAG 2.2 24px floor on
 *  touch profiles (the floor the repo's own `--tap-min: 28px` token cites); a laxer
 *  18px on desktop, where the pointer is finer and hover-scale styles would
 *  false-flag the 24px floor — and (c) actually RECEIVE the pointer —
 *  elementFromPoint at its centre resolves to the control, not something painted
 *  over it (the bug class where the log column overlapped the work verbs). */
export async function expectControlsTappable(
  page: Page,
  label: string,
  opts: { minTargetPx?: number } = {},
): Promise<void> {
  const minTargetPx = opts.minTargetPx ?? 24;
  const boxes: ControlBox[] = await page.evaluate(() => {
    const sel = 'button.verb, .nav-tab, .settings-btn, .rung-head-trigger:not([disabled])';
    const out: ControlBox[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue; // hidden / collapsed
      const probe = (): string | null => {
        const b = el.getBoundingClientRect();
        const cx = b.x + b.width / 2;
        const cy = b.y + b.height / 2;
        // offscreen (scrolled-away) centres are fine — the player scrolls to them
        if (cy < 0 || cy > window.innerHeight || cx < 0 || cx > window.innerWidth) return null;
        const top = document.elementFromPoint(cx, cy);
        if (!top || top === el || el.contains(top) || top.contains(el)) return null;
        return `${top.tagName}.${(top as HTMLElement).className}`;
      };
      let covered = probe();
      if (covered !== null) {
        // Content legitimately passes UNDER fixed bars (footer/header) while
        // scrolling — a control only counts as covered if it STAYS covered when
        // scrolled to the viewport centre (the in-flow overlap bug class).
        el.scrollIntoView({ block: 'center' });
        covered = probe();
      }
      out.push({
        label: (el.textContent ?? '').trim().slice(0, 24) || el.className,
        left: Math.round(r.left),
        right: Math.round(r.right),
        height: Math.round(r.height),
        covered,
      });
    }
    window.scrollTo(0, 0);
    return out;
  });
  const vw = page.viewportSize()?.width ?? 0;
  for (const b of boxes) {
    expect(b.right, `${label}: "${b.label}" hangs off the right edge`).toBeLessThanOrEqual(vw + 1);
    expect(b.left, `${label}: "${b.label}" hangs off the left edge`).toBeGreaterThanOrEqual(-1);
    expect(
      b.height,
      `${label}: "${b.label}" is under the ${minTargetPx}px target floor`,
    ).toBeGreaterThanOrEqual(minTargetPx);
    expect(b.covered, `${label}: "${b.label}" is painted over by ${b.covered}`).toBeNull();
  }
}

/** On narrow screens the byōbu spread must stack into ONE column: the work fold
 *  above the log, both full-width, work at natural height (the dead-CSS regression
 *  left `.work` at height 0 with the log painted over it — this is its tombstone). */
export async function expectSingleColumnStack(page: Page, label: string): Promise<void> {
  const m = await page.evaluate(() => {
    const ws = document.querySelector('.workspace');
    if (!ws || ws.getAttribute('data-layout') !== 'layout-byobu') return null;
    const work = ws.querySelector('.work');
    const log = ws.querySelector('.slice-log');
    if (!work || !log) return null;
    const wr = work.getBoundingClientRect();
    const lr = log.getBoundingClientRect();
    return {
      dir: getComputedStyle(ws).flexDirection,
      workHeight: Math.round(wr.height),
      workBottom: Math.round(wr.bottom),
      logTop: Math.round(lr.top),
      logWidth: Math.round(lr.width),
      workWidth: Math.round(wr.width),
    };
  });
  if (m === null) return; // pre-byōbu states (cold open, intro) have no spread to stack
  expect(m.dir, `${label}: byōbu must collapse to a column on mobile`).toBe('column');
  expect(m.workHeight, `${label}: the work fold collapsed to zero height`).toBeGreaterThan(0);
  expect(
    m.logTop,
    `${label}: the log must stack BELOW the work fold, not over it`,
  ).toBeGreaterThanOrEqual(m.workBottom - 1);
  // full width within a few px of each other — no desktop 46% log cap leaking in
  expect(
    Math.abs(m.logWidth - m.workWidth),
    `${label}: work/log widths diverge`,
  ).toBeLessThanOrEqual(8);
}

/** The desktop mirror of `expectSingleColumnStack` — the byōbu SPREAD: work and log
 *  side-by-side, BOTH alive (nonzero width AND height), no overlap, and the log
 *  held to its design cap (46% of the workspace, styles.css F117). RED-proof: the
 *  dead-CSS regression class — a fold at zero size, or painted over the other —
 *  the desktop twin of the day-one mobile bug (see the ≤720px block's comment). */
export async function expectTwoColumnSpread(page: Page, label: string): Promise<void> {
  const m = await page.evaluate(() => {
    const ws = document.querySelector('.workspace');
    if (!ws || ws.getAttribute('data-layout') !== 'layout-byobu') return null;
    const work = ws.querySelector('.work');
    const log = ws.querySelector('.slice-log');
    if (!work || !log) return null;
    const wr = work.getBoundingClientRect();
    const lr = log.getBoundingClientRect();
    return {
      dir: getComputedStyle(ws).flexDirection,
      workWidth: Math.round(wr.width),
      workHeight: Math.round(wr.height),
      workRight: Math.round(wr.right),
      logLeft: Math.round(lr.left),
      logWidth: Math.round(lr.width),
      logHeight: Math.round(lr.height),
      wsWidth: Math.round(ws.getBoundingClientRect().width),
    };
  });
  if (m === null) return; // pre-byōbu states (cold open, intro) have no spread yet
  expect(m.dir, `${label}: byōbu must be a two-fold ROW spread on desktop`).toBe('row');
  expect(m.workWidth, `${label}: the work fold collapsed to zero width`).toBeGreaterThan(0);
  expect(m.workHeight, `${label}: the work fold collapsed to zero height`).toBeGreaterThan(0);
  expect(m.logWidth, `${label}: the log fold collapsed to zero width`).toBeGreaterThan(0);
  expect(m.logHeight, `${label}: the log fold collapsed to zero height`).toBeGreaterThan(0);
  expect(
    m.workRight,
    `${label}: the work fold must sit LEFT of the log, not under it`,
  ).toBeLessThanOrEqual(m.logLeft + 1);
  expect(m.logWidth, `${label}: the log fold overruns its 46% design cap`).toBeLessThanOrEqual(
    Math.ceil(m.wsWidth * 0.46) + 1,
  );
}

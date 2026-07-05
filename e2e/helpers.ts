// Shared helpers for the mobile e2e lane. Tests boot the game with `?dev=no`
// (true player layout) — `__qa` and `?fixture=` stay available (DEV-gated, not
// dev-panel-gated), so state driving works against exactly what a player sees.
import { expect, type Page } from '@playwright/test';

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
  // one settle beat: fixture import + first render + reveal pass
  await page.waitForTimeout(400);
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
 *  horizontally, (b) meet the WCAG 2.2 24px minimum target height (the floor the
 *  repo's own `--tap-min: 28px` token cites), and (c) actually RECEIVE the tap —
 *  elementFromPoint at its centre resolves to the control, not something painted
 *  over it (the bug class where the log column overlapped the work verbs). */
export async function expectControlsTappable(page: Page, label: string): Promise<void> {
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
      `${label}: "${b.label}" is under the 24px WCAG tap floor`,
    ).toBeGreaterThanOrEqual(24);
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

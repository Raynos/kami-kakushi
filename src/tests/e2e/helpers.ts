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

/** The named scenario fixtures (FB-6). Mirrored statically so each gets its own
 *  test; the `fixture registry drift` test asserts this list matches the live
 *  `__qa.fixtures()` registry — adding a fixture without mobile coverage is RED. */
export const FIXTURES = [
  'post-cold-open',
  'fresh-R3-pre-wolf',
  'pre-ascension',
  'rung-beat-ready',
  'post-loss-broke',
  'worn-weapon-no-wood',
  'wealthy-idler',
  // ADR-177 — the works-chain waypoints (were missing here; the drift test was RED)
  'works-u1-priced',
  'works-u1-underway',
  'rice-at-gate',
  'at-kura-with-coin',
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

/** Navigate to the game (optionally into a named fixture) and wait for boot.
 *  `instantText` boots with the DEV `?instanttext=1` affordance — zero narrative
 *  pacing, for journeys whose runtime would otherwise be the typewriter's (the
 *  hurry-click player path stays covered by the tests that DON'T set it). */
export async function boot(
  page: Page,
  fixture?: string,
  opts: { instantText?: boolean; timedActions?: boolean } = {},
): Promise<string[]> {
  const errors = trackErrors(page);
  // `telemetry=no`: automated runs must NOT drop machine-time reports into
  // project/telemetry/ — that folder is the human's attended-play sensor (FB-8).
  const flags = `&telemetry=no${opts.instantText ? '&instanttext=1' : ''}`;
  const url = fixture
    ? `/?dev=no&fixture=${encodeURIComponent(fixture)}${flags}`
    : `/?dev=no${flags}`;
  // 'domcontentloaded', NOT 'networkidle': networkidle's built-in 500ms quiet
  // window taxed every boot; the __qa wait + the settle conditions below are the
  // real readiness signal (they gate on the app, not the network).
  await page.goto(url, { waitUntil: 'domcontentloaded' });
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
  // ADR-148 — journeys assert FLOWS, not pacing: timed actions complete instantly so a
  // 5s rake doesn't stretch every spec. The timed path itself is covered explicitly by
  // the specs that boot `{ timedActions: true }` (real durations, the Phase-2 DoD e2e).
  if (!opts.timedActions) await page.evaluate('window.__qa.instantActions(true)');
  return errors;
}

/** Walk the survey sheet through the REAL map, one adjacency hop at a time (ADR-151: each
 *  zone's seal is an SVG travel control, not a <button>; move_to is single-hop). Each hop
 *  waits for the ARRIVAL, then lets headless webkit's compositor CATCH UP before the next
 *  tap: rapid instant-action arrivals re-render the sheet faster than it repaints, and its
 *  SVG hit-test region goes stale mid-chain — elementsFromPoint skips the svg entirely at a
 *  point inside a painted node, so the tap "lands" on the scroll container, and the tap's
 *  own retry loop (scroll-into-view every attempt) keeps re-wedging it, forever. A double-rAF
 *  does NOT clear it (rAF fires off the main thread's clock, not the compositor's); a real
 *  settle does (probed: tap-after-1200ms succeeds where 30s of retries never do). Surfaced
 *  when the wealthy-idler fixture moved to a spring boot (ADR-170 re-rolled its season/day)
 *  and under parallel-suite load on the other walks. */
export async function walkSheet(page: Page, nodes: readonly string[]): Promise<void> {
  // 2026-07-11 — the walk table slowed ×5 (real hops are 15–35s now): compress the
  // ActionClock through the DEV speed multiplier so the e2e drives the SAME UI path
  // (press → timer → arrival) without waiting real journey time.
  await page.evaluate('window.__qa.speed(8)');
  try {
    for (const node of nodes) {
      await press(page.locator(`.map-nav [data-node="${node}"]:not([data-locked])`));
      await page.waitForFunction(`window.__qa.state().location === '${node}'`);
      await page.waitForTimeout(1200);
    }
  } finally {
    await page.evaluate('window.__qa.speed(1)');
  }
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
 *  horizontally, (b) meet the minimum target height — the Andon language's 44px
 *  floor on touch profiles (M3: the phone recomposition raises `--tap-min` to
 *  44px, replacing the interim WCAG 24px floor); a laxer 18px on desktop, where
 *  the pointer is finer — and (c) actually RECEIVE the pointer —
 *  elementFromPoint at its centre resolves to the control, not something painted
 *  over it (the bug class where the log column overlapped the work verbs). */
export async function expectControlsTappable(
  page: Page,
  label: string,
  opts: { minTargetPx?: number } = {},
): Promise<void> {
  const minTargetPx = opts.minTargetPx ?? 44;
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

/** M3 (Andon phone recomposition): on narrow screens the shell grid stacks ONE
 *  column — the work desk above the log BAND, both alive and full-width, with
 *  the tab BAR at the bottom (below the log). The log is a SHELL sibling now
 *  (`.shell > .log`), not a workspace fold — the dead-CSS/overlap bug class this
 *  guards is unchanged (a pane at zero size, or painted over another). */
export async function expectSingleColumnStack(page: Page, label: string): Promise<void> {
  const m = await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('.shell');
    if (!shell || shell.hidden || shell.getAttribute('data-layout') !== 'layout-byobu') return null;
    const ws = shell.querySelector('.workspace');
    const log = shell.querySelector(':scope > .log');
    const nav = shell.querySelector<HTMLElement>(':scope > .nav');
    if (!ws || !log) return null;
    const wr = ws.getBoundingClientRect();
    const lr = log.getBoundingClientRect();
    const nr = nav && !nav.hidden ? nav.getBoundingClientRect() : null;
    return {
      workHeight: Math.round(wr.height),
      workBottom: Math.round(wr.bottom),
      logTop: Math.round(lr.top),
      logHeight: Math.round(lr.height),
      logWidth: Math.round(lr.width),
      workWidth: Math.round(wr.width),
      navTop: nr ? Math.round(nr.top) : null,
      logBottom: Math.round(lr.bottom),
    };
  });
  if (m === null) return; // pre-shell states (cold open, intro) have nothing to stack
  expect(m.workHeight, `${label}: the work desk collapsed to zero height`).toBeGreaterThan(0);
  expect(m.logHeight, `${label}: the log band collapsed to zero height`).toBeGreaterThan(0);
  expect(
    m.logTop,
    `${label}: the log band must stack BELOW the work desk, not over it`,
  ).toBeGreaterThanOrEqual(m.workBottom - 1);
  if (m.navTop !== null)
    expect(
      m.navTop,
      `${label}: the tab bar must sit BELOW the log band (bottom bar)`,
    ).toBeGreaterThanOrEqual(m.logBottom - 1);
  // full width within a few px of each other — no desktop log column leaking in
  expect(
    Math.abs(m.logWidth - m.workWidth),
    `${label}: work/log widths diverge`,
  ).toBeLessThanOrEqual(24); // the log band keeps a small side margin
}

/** The desktop mirror of `expectSingleColumnStack` — the byōbu SPREAD: work and log
 *  side-by-side, BOTH alive (nonzero width AND height), no overlap, and the log
 *  held to its design cap (46% of the workspace, styles.css FB-117). RED-proof: the
 *  dead-CSS regression class — a fold at zero size, or painted over the other —
 *  the desktop twin of the day-one mobile bug (see the ≤720px block's comment). */
export async function expectTwoColumnSpread(page: Page, label: string): Promise<void> {
  const m = await page.evaluate(() => {
    const shell = document.querySelector<HTMLElement>('.shell');
    if (!shell || shell.hidden || shell.getAttribute('data-layout') !== 'layout-byobu') return null;
    const ws = shell.querySelector('.workspace');
    const log = shell.querySelector(':scope > .log');
    if (!ws || !log) return null;
    const wr = ws.getBoundingClientRect();
    const lr = log.getBoundingClientRect();
    return {
      workWidth: Math.round(wr.width),
      workHeight: Math.round(wr.height),
      workRight: Math.round(wr.right),
      logLeft: Math.round(lr.left),
      logWidth: Math.round(lr.width),
      logHeight: Math.round(lr.height),
      shellWidth: Math.round(shell.getBoundingClientRect().width),
    };
  });
  if (m === null) return; // pre-shell states (cold open, intro) have no frame yet
  expect(m.workWidth, `${label}: the work desk collapsed to zero width`).toBeGreaterThan(0);
  expect(m.workHeight, `${label}: the work desk collapsed to zero height`).toBeGreaterThan(0);
  expect(m.logWidth, `${label}: the log window collapsed to zero width`).toBeGreaterThan(0);
  expect(m.logHeight, `${label}: the log window collapsed to zero height`).toBeGreaterThan(0);
  expect(
    m.workRight,
    `${label}: the work desk must sit LEFT of the log window, not under it`,
  ).toBeLessThanOrEqual(m.logLeft + 1);
  // the Andon log window is capped at 38% of the shell (styles.css M3 grid)
  expect(m.logWidth, `${label}: the log window overruns its 38% design cap`).toBeLessThanOrEqual(
    Math.ceil(m.shellWidth * 0.38) + 1,
  );
}

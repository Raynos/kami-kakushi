// Headless capture of the T0/T1 map sheets (src/ui/map-sheets/) for the
// blind-reader verification loop (spec §5 rubric — the map baseline spec) and
// visual review. Follows the qa-shots.mjs idiom (headless-only QA).
//
// Graduated from tmp/ 2026-07-07 (session 115) with the data-zoom fix: setting
// the viewBox directly bypasses the shell's zoom handler, so this script must
// also flip the `data-zoom` near/far attribute the way sheet.ts does
// (vb.w <= frame.w * 0.62 → 'near'), or the CSS-gated `.ms-fine` register
// (rake arcs, room captions, terrace numerals — spec L10) is invisible in
// every shot. That exact bug hid the fine layer from the iter1–5 blind passes.
//
// Usage: QA_URL=http://localhost:5173/ node src/scripts/map-audit-shots.mjs [outdir]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.QA_URL || 'http://localhost:5173/';
const OUT =
  process.argv[2] ||
  `project/audit/screens/${new Date().toISOString().slice(0, 10)}-t0t1-map-shots`;
mkdirSync(OUT, { recursive: true });

// The sheet frames (world units — layout.ts: T0_WINDOW and WORLD; valley.ts: VALLEY).
const FRAME = {
  T0: { x: 430, y: 330, w: 2220, h: 1480 },
  T1: { x: 0, y: 0, w: 3200, h: 2100 },
  T2: { x: 0, y: 0, w: 3200, h: 4300 },
};

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1680, height: 1050 },
    deviceScaleFactor: 2,
  });
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa), { timeout: 8000 });

  /** open a tier map via direct module import (vite serves the TS transformed) */
  const openMap = async (tier) => {
    await page.evaluate(async (t) => {
      const m = await import('/ui/map-sheets/sheet.ts');
      window.__mapScrim = m.openTierMap(t);
    }, tier);
    await page.waitForTimeout(700);
  };
  const closeMap = async () => {
    await page.evaluate(() => {
      window.__mapScrim?.querySelector('.modal-close')?.click();
      window.__mapScrim = undefined;
    });
    await page.waitForTimeout(200);
  };
  /** set the view AND the LOD register, exactly as the shell's zoom would */
  const setView = async (tier, x, y, w, h) => {
    await page.evaluate(
      ([vx, vy, vw, vh, frameW]) => {
        const svg = document.querySelector('.t0v2-card svg');
        svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
        svg.setAttribute('data-zoom', vw <= frameW * 0.62 ? 'near' : 'far');
      },
      [x, y, w, h, FRAME[tier].w],
    );
    await page.waitForTimeout(120);
  };
  const shotSvg = async (name) => {
    await page.locator('.t0v2-mapwrap').screenshot({ path: `${OUT}/${name}.png` });
    console.log('shot', name);
  };
  const shotFull = async (name) => {
    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log('shot', name);
  };

  /** the standard review set: modal chrome, fit, four quadrants, deep zoom */
  const sweep = async (tier, deep) => {
    const f = FRAME[tier];
    const t = tier.toLowerCase();
    await openMap(tier);
    await shotFull(`${t}-00-modal`);
    await setView(tier, f.x, f.y, f.w, f.h);
    await shotSvg(`${t}-01-fit`);
    const hw = f.w / 2;
    const hh = f.h / 2;
    await setView(tier, f.x, f.y, hw, hh);
    await shotSvg(`${t}-02-nw`);
    await setView(tier, f.x + hw, f.y, hw, hh);
    await shotSvg(`${t}-03-ne`);
    await setView(tier, f.x, f.y + hh, hw, hh);
    await shotSvg(`${t}-04-sw`);
    await setView(tier, f.x + hw, f.y + hh, hw, hh);
    await shotSvg(`${t}-05-se`);
    await setView(tier, ...deep);
    await shotSvg(`${t}-06-centre-deep`);
    await closeMap();
  };

  // deep zoom on the guest-house compound (fine register ON via the fix)
  await sweep('T0', [1850, 1000, 700, 467]);
  await sweep('T1', [1850, 1000, 900, 590]);
  // T2: deep zoom on the ESTATE compound — the demotion + the reveal is T2's
  // headline (the robbed precinct ring, the ruin the valley's largest mass, the
  // tiny guest house in its SE corner). The village reads from the SW/SE quadrants.
  await sweep('T2', [1040, 440, 1500, 2016]);
} finally {
  await browser.close();
}
if (errors.length) {
  console.error('console errors:', errors.join('\n'));
  process.exit(1);
}
console.log('done →', OUT);

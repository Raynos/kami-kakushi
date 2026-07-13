// Headless QA screenshot harness (PRD §6.10 / qa-playtesting.md §4). Drives the DEV
// __qa API to a sequence of states and screenshots each — fully headless (no GUI).
// Usage: QA_URL=http://localhost:5174/ node src/scripts/qa-shots.mjs
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const URL = process.env.QA_URL || 'http://localhost:5174/';
const OUT = 'project/audit/screens/latest';

// Each step: optional `run` (a JS expression string evaluated in the page) or `fn`
// (an async (page) => {} driven from node) + a screenshot name.
const clickTab = (label) =>
  `[...document.querySelectorAll('.nav-tab')].find(b=>b.textContent.includes('${label}')).click()`;

// The intro VN gates the shell (toRung teleports rungs but never plays the intro),
// so play it like a player — hurry the typewriter, ask/decide/Continue, scene by
// scene — until the VN yields. Mirrors src/tests/e2e/helpers.ts (playVnScene),
// minus the test assertions: a missing control here just falls through.
async function hurryTypewriter(page) {
  const controls = page.locator(
    'button.intro-ask:visible, button.intro-done:visible, button.intro-choice:visible, button.intro-continue:visible',
  );
  for (let i = 0; i < 60; i++) {
    if ((await controls.count().catch(() => 0)) > 0) return;
    await page
      .locator('.vn-story')
      .click({ position: { x: 20, y: 20 } })
      .catch(() => {});
    await page.waitForTimeout(40);
  }
}

async function playIntro(page) {
  for (let scene = 0; scene < 12; scene++) {
    if (
      !(await page
        .locator('.vn-scene')
        .isVisible()
        .catch(() => false))
    )
      return;
    await hurryTypewriter(page);
    const ask = page.locator('.vn-ask button.intro-ask:not(.asked):visible').first();
    if (await ask.isVisible().catch(() => false)) {
      await ask.click();
      await hurryTypewriter(page);
    }
    const done = page.locator('button.intro-done:visible').first();
    if (await done.isVisible().catch(() => false)) await done.click();
    const choice = page.locator('button.intro-choice:visible').first();
    if (await choice.isVisible().catch(() => false)) {
      await choice.click();
      await hurryTypewriter(page);
    }
    const cont = page.locator('button.intro-continue:visible').first();
    if (await cont.isVisible().catch(() => false)) await cont.click();
    const ceremony = page.locator('.vn-rung-ceremony button.intro-continue');
    if (await ceremony.isVisible().catch(() => false)) await ceremony.click();
    await page.waitForTimeout(200);
  }
}

const steps = [
  { name: '01-cold-open' },
  { name: '02-awake', run: `__qa.dispatch({type:'open_eyes'})` },
  // Play the whole intro VN (ask → decide → Continue, every scene) so the shell mounts.
  { name: '02b-intro-played', fn: playIntro, wait: 400 },
  { name: '03-r1', run: `__qa.toRung('R1')`, wait: 2200 },
  { name: '04-r2-work', run: `__qa.toRung('R2')`, wait: 2200 },
  // IA reorg (ADR-112): skills is a section of the Character 己 tab (present from R2).
  { name: '05-r2-skills', run: clickTab('Character') },
  { name: '06-map', run: clickTab('地図') },
  {
    // Step 5b: foes are spatial — stand on the grove (the monkey troop's ground in the shipped
    // roster) so the watch has foes to show (toRung ends where the climb left the MC; the kura's
    // foes are night-round-only, so its day watch is empty by design).
    name: '07-r3-combat',
    run: `__qa.toRung('R3'); __qa.goto('grove'); ${clickTab('Combat')}`,
    wait: 2200,
  },
  {
    name: '08-after-fights',
    run: `__qa.fight('monkey'); __qa.fight('monkey')`,
  },
  // IA reorg (ADR-112): skills/attrs/bestiary live on the Character 己 tab (present from R3).
  { name: '08b-character', run: clickTab('Character') },
  { name: '09-settings', run: `document.querySelector('.settings-btn').click()` },
  {
    name: '10-rankup-seal',
    fn: async (page) => {
      await page.evaluate(
        `document.querySelector('.modal-close').click(); __qa.newGame(); __qa.dispatch({type:'open_eyes'})`,
      );
      await playIntro(page); // a fresh game re-raises the intro over the shell
      await page.evaluate(`for(let i=0;i<7;i++)__qa.dispatch({type:'rake_rice'})`);
    },
    wait: 300,
  },
];

const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 980, height: 740 },
    deviceScaleFactor: 2,
  });
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa), { timeout: 8000 });

  for (const step of steps) {
    if (step.run) await page.evaluate(step.run);
    if (step.fn) await step.fn(page);
    await page.waitForTimeout(step.wait ?? 350);
    await page.screenshot({ path: `${OUT}/qa-${step.name}.png` });
    console.log('shot', step.name);
  }

  // mobile bottom-bar layout at the richest state
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 780 },
    deviceScaleFactor: 2,
  });
  await mobile.goto(URL, { waitUntil: 'networkidle' });
  await mobile.waitForFunction(() => Boolean(window.__qa), { timeout: 8000 });
  await mobile.evaluate(`__qa.dispatch({type:'open_eyes'})`);
  await playIntro(mobile); // the intro gates the shell on mobile too
  await mobile.evaluate(`__qa.toRung('R2')`);
  await mobile.waitForTimeout(350);
  await mobile.screenshot({ path: `${OUT}/qa-06-mobile-r2.png` });
  console.log('shot 06-mobile-r2');
} finally {
  await browser.close();
}

// Losslessly shrink the freshly-captured PNGs on disk (~33% off). oxipng only
// re-packs the DEFLATE stream + row filters — pixels are byte-for-byte identical.
// Optional: if oxipng isn't installed the QA run still succeeds, just uncompressed.
const pngs = readdirSync(OUT)
  .filter((f) => f.endsWith('.png'))
  .map((f) => `${OUT}/${f}`);
try {
  execFileSync('oxipng', ['-o', 'max', '--strip', 'safe', '-q', ...pngs], { stdio: 'inherit' });
  console.log(`optimized ${pngs.length} screenshots (oxipng, lossless)`);
} catch (e) {
  if (e.code === 'ENOENT')
    console.log(
      'note: oxipng not found — `brew install oxipng` to shrink screenshots ~33% (lossless)',
    );
  else throw e;
}

if (errors.length) {
  console.log('\nCONSOLE ERRORS:');
  for (const e of errors) console.log('  - ' + e);
  process.exitCode = 1;
} else {
  console.log('\nno console errors.');
}

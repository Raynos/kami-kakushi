// Headless QA screenshot harness (PRD §6.10 / qa-playtesting.md §4). Drives the DEV
// __qa API to a sequence of states and screenshots each — fully headless (no GUI).
// Usage: QA_URL=http://localhost:5174/ node src/scripts/qa-shots.mjs
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const URL = process.env.QA_URL || 'http://localhost:5174/';
const OUT = 'project/audit/screens/latest';

// Each step: optional `run` (a JS expression string evaluated in the page) + a screenshot name.
const clickTab = (label) =>
  `[...document.querySelectorAll('.nav-tab')].find(b=>b.textContent.includes('${label}')).click()`;

const steps = [
  { name: '01-cold-open' },
  { name: '02-awake', run: `__qa.dispatch({type:'open_eyes'})` },
  { name: '03-r1', run: `__qa.toRung('R1')`, wait: 2200 },
  { name: '04-r2-work', run: `__qa.toRung('R2')`, wait: 2200 },
  // The Estate card is live from ~R1; the survey-sheet map (ADR-151) from R1's gate reveal.
  { name: '05-r2-estate', run: clickTab('Estate') },
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
    run: `document.querySelector('.modal-close').click(); __qa.newGame(); __qa.dispatch({type:'open_eyes'}); for(let i=0;i<7;i++)__qa.dispatch({type:'rake_rice'})`,
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

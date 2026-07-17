// Headless browser smoke for the shrink-save-file work (qa-playtesting.md §0: HEADLESS ONLY).
// Drives the REAL app: load a rich fixture (keyed log entries) → confirm it persisted to
// localStorage as a GZIPPED descriptor blob (KKgz1:) → reload from storage → assert the log
// rehydrated byte-identically. Exercises the real encodeStore→localStorage→decodeStore→render path.
import { chromium } from 'playwright';

const BASE = process.env.QA_URL || 'http://localhost:5264';
const browser = await chromium.launch({ headless: true });
const errors = [];
let failed = false;
const fail = (m) => {
  failed = true;
  console.error('  ✗ ' + m);
};
const ok = (m) => console.log('  ✓ ' + m);

try {
  const page = await browser.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  // 1) Load a rich fixture — it is adopted + saved to localStorage via the real SaveManager.
  await page.goto(`${BASE}/?fixture=wealthy-idler`, {
    waitUntil: 'networkidle',
  });
  await page.waitForFunction(() => Boolean(window.__qa), { timeout: 10000 });
  await page.waitForTimeout(300); // let the debounced autosave flush

  const before = await page.evaluate(() => {
    const es = window.__qa.state().log.entries;
    return {
      count: es.length,
      keyed: es.filter((e) => e.contentKey !== undefined).length,
      // a compact fingerprint of the whole log: [key, contentKey|'', text]
      sig: es.map((e) => [e.key, e.contentKey ?? '', e.text]),
    };
  });

  // 2) Prove the NEW gzip+descriptor codec actually ran in the browser: the stored blob is
  //    gzip-magic-prefixed, and a keyed entry has NO text in storage (it's re-derived on load).
  const stored = await page.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('kk:save:')) return localStorage.getItem(k);
    }
    return null;
  });
  if (!stored) fail('no kk:save: blob in localStorage');
  else if (!stored.startsWith('KKgz1:'))
    fail(`stored blob is not gzipped (starts "${stored.slice(0, 12)}")`);
  else ok(`stored save is a gzipped descriptor blob (${stored.length} B)`);

  if (before.keyed === 0)
    fail('fixture produced no keyed log entries — smoke proves nothing');
  else ok(`${before.count} log entries, ${before.keyed} keyed (descriptors)`);

  // 3) Reload from localStorage (NO ?fixture=) — boot() runs the real load path (gunzip + rehydrate).
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa), { timeout: 10000 });
  await page.waitForTimeout(200);

  const after = await page.evaluate(() => {
    const es = window.__qa.state().log.entries;
    return {
      count: es.length,
      sig: es.map((e) => [e.key, e.contentKey ?? '', e.text]),
    };
  });

  // 4) The log rehydrated identically — same entries, same order, same (re-derived) text.
  if (JSON.stringify(after.sig) === JSON.stringify(before.sig)) {
    ok(
      `log rehydrated byte-identically across reload (${after.count} entries)`,
    );
  } else {
    fail(
      `log differs after reload (before ${before.count}, after ${after.count} entries)`,
    );
    // show the first divergence
    const n = Math.max(before.sig.length, after.sig.length);
    for (let i = 0; i < n; i++) {
      const b = JSON.stringify(before.sig[i]);
      const a = JSON.stringify(after.sig[i]);
      if (a !== b) {
        console.error(
          `    first diff @${i}:\n      before: ${b}\n      after:  ${a}`,
        );
        break;
      }
    }
  }

  // 5) The DOM actually painted the restored log (not a blank hero surface).
  const painted = await page.evaluate(() => document.body.innerText.length);
  if (painted > 200)
    ok(`UI painted the restored state (${painted} chars of text)`);
  else fail(`UI looks blank after reload (${painted} chars)`);
} catch (e) {
  fail('smoke threw: ' + (e && e.message ? e.message : String(e)));
} finally {
  await browser.close();
}

if (errors.length) {
  console.error('  ⚠ console/page errors during smoke:');
  for (const e of errors.slice(0, 10)) console.error('      ' + e);
  // page errors are a real failure signal for a save/load smoke
  failed = true;
}

console.log(failed ? '\nSAVE-SMOKE: FAIL' : '\nSAVE-SMOKE: PASS');
process.exit(failed ? 1 : 0);

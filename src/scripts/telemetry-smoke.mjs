// Headless telemetry smoke (F8 Ph2 DoD, qa-playtesting.md §0: HEADLESS ONLY). Drives the REAL
// app through a compressed 5/20/5 script — real pointer events, visibility driven by
// overriding document.visibilityState/hidden + dispatching a real visibilitychange — and
// proves the attended total is the SCRIPTED play time, not the wall total; that the hidden
// span advanced ZERO game ticks (the D-079 cross-check); that the run persisted to the
// localStorage ring across a reload; and that __qa driving tainted the run.
//
// Run with a dev server up:  pnpm run dev  →  node src/scripts/telemetry-smoke.mjs
// (QA_URL overrides the target, like save-smoke.mjs.)
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const BASE = process.env.QA_URL || 'http://localhost:5173';
const browser = await chromium.launch({ headless: true });
let failed = false;
const fail = (m) => {
  failed = true;
  console.error('  ✗ ' + m);
};
const ok = (m) => console.log('  ✓ ' + m);

// The compressed timeline (ms): play A → hidden B → play C. Wall = A+B+C; attended must ≈ A+C.
const PLAY_A = 1500;
const HIDDEN_B = 2000;
const PLAY_C = 1000;

try {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa?.telemetry), { timeout: 10000 });

  // Shrink the constants so seconds-scale spans classify like minutes-scale ones; throttle 0
  // so every real pointer event reaches the sessionizer; huge sleep factor so scripted waits
  // can never trip the watchdog on a slow runner.
  await page.evaluate(() => {
    window.__qa.telemetry.configure({
      inputRecencyMs: 400,
      idleTtlAutosMs: 800,
      idleTtlStaticMs: 800,
      heartbeatMs: 200,
      heartbeatGapFactor: 1000,
      inputThrottleMs: 0,
    });
    // Open the cold open + arm auto-rake so game ticks flow while visible (and taint the run).
    window.__qa.dispatch({ type: 'open_eyes' });
    window.__qa.dispatch({ type: 'set_auto_rake', on: true });
  });

  // ── Phase A: real hands-on play (pointer moves every 150 ms) ──
  const ticks0 = await page.evaluate(() => window.__qa.pacing().ticks);
  const tA0 = Date.now();
  while (Date.now() - tA0 < PLAY_A) {
    await page.mouse.move(200 + Math.random() * 200, 200 + Math.random() * 200);
    await page.waitForTimeout(150);
  }
  const ticksAfterA = await page.evaluate(() => window.__qa.pacing().ticks);
  if (ticksAfterA > ticks0) ok(`game ticks flowed while visible (+${ticksAfterA - ticks0})`);
  else fail('no game ticks during visible play — the D-079 cross-check would be vacuous');

  // ── Phase B: hide the tab (the DoD's real visibilitychange, not a synthetic sessionizer poke) ──
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(HIDDEN_B);
  const ticksAfterB = await page.evaluate(() => window.__qa.pacing().ticks);
  if (ticksAfterB === ticksAfterA) ok('hidden span advanced ZERO game ticks (D-079 holds)');
  else fail(`hidden span advanced ${ticksAfterB - ticksAfterA} ticks — the loop ignored hidden`);

  // ── Phase C: back + more play ──
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const tC0 = Date.now();
  while (Date.now() - tC0 < PLAY_C) {
    await page.mouse.move(300 + Math.random() * 200, 300 + Math.random() * 200);
    await page.waitForTimeout(150);
  }

  // Close the open segment with a real blur so segments() carries the whole story.
  const result = await page.evaluate(() => {
    window.dispatchEvent(new Event('blur'));
    const segs = window.__qa.telemetry.segments();
    return {
      segments: segs.map((s) => ({ closer: s.closer, ms: s.activeMs + s.idleMs })),
      attended: segs.reduce((a, s) => a + s.activeMs + s.idleMs, 0),
      summary: window.__qa.telemetry.summary(),
    };
  });

  const wall = PLAY_A + HIDDEN_B + PLAY_C;
  const scripted = PLAY_A + PLAY_C;
  // Generous slack (throttled event edges + runner jitter), but the wall total MUST be ruled
  // out: attended must miss at least half the hidden span.
  if (result.attended >= scripted * 0.5 && result.attended <= wall - HIDDEN_B / 2) {
    ok(
      `attended ${result.attended}ms ≈ scripted play ${scripted}ms (wall ${wall}ms excluded the hidden ${HIDDEN_B}ms)`,
    );
  } else {
    fail(`attended ${result.attended}ms — expected ≈${scripted}ms, NOT the wall ${wall}ms`);
  }
  if (result.segments.some((s) => s.closer === 'hidden')) ok("segment closed by 'hidden'");
  else fail(`no hidden-closed segment (closers: ${result.segments.map((s) => s.closer)})`);
  if (result.summary.taints.includes('qa-drive')) ok('__qa driving tainted the run');
  else fail(`run not tainted by __qa drive (taints: ${result.summary.taints})`);

  const runId = result.summary.runId;

  // ── Reload: the ring must have persisted the run (the hide-edge sync write) ──
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__qa?.telemetry), { timeout: 10000 });
  const persisted = await page.evaluate(
    (id) => window.__qa.telemetry.runs().find((r) => r.runId === id),
    runId,
  );
  if (persisted && persisted.segments.length >= 1) {
    ok(
      `run ${runId} recovered from localStorage after reload (${persisted.segments.length} segments)`,
    );
  } else {
    fail(`run ${runId} not found in the ring after reload`);
  }

  // ── F5-resume: a reload with an existing save CONTINUES the run (same runId, carried
  //    segments) — the human F5s a lot; reloads must never fragment the history. ──
  const resumed = await page.evaluate(() => window.__qa.telemetry.summary());
  if (resumed.runId === runId && resumed.segments >= 2) {
    ok(
      `reload RESUMED run ${runId} (carried ${resumed.segments} segments, ${resumed.attendedMin} min)`,
    );
  } else {
    fail(
      `reload minted a new run (${resumed.runId} vs ${runId}, ${resumed.segments} segments) — F5 fragments history`,
    );
  }

  // ── Ph4: the session-end auto-drop landed a report FILE in project/telemetry/ ──
  // (Only provable when the target is the local dev server serving THIS tree.)
  if (BASE.includes('localhost')) {
    const dropPath = fileURLToPath(new URL(`../../project/telemetry/${runId}.md`, import.meta.url));
    if (existsSync(dropPath)) {
      const body = readFileSync(dropPath, 'utf-8');
      if (body.includes(runId) && body.includes('segments:')) {
        ok(`auto-drop landed project/telemetry/${runId}.md (${body.length} B, report-shaped)`);
      } else {
        fail(`dropped file exists but isn't report-shaped (${body.slice(0, 60)}…)`);
      }
    } else {
      fail(`no auto-dropped report at project/telemetry/${runId}.md`);
    }
  }

  if (pageErrors.length) fail('page errors: ' + pageErrors.slice(0, 3).join(' | '));
} catch (e) {
  fail('smoke threw: ' + (e && e.message ? e.message : String(e)));
} finally {
  await browser.close();
}

console.log(failed ? '\nTELEMETRY-SMOKE: FAIL' : '\nTELEMETRY-SMOKE: PASS');
process.exit(failed ? 1 : 0);

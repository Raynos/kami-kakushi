// Playwright config — the browser e2e lane (qa-playtesting.md §1 "Browser e2e lane").
//
// Why a separate lane and not a verify gate: verify's roster lives under a hard 5s
// budget (D-072) and a real-browser suite is orders of magnitude past it. This lane
// runs as its own CI workflow (.github/workflows/e2e.yml) on every push — same
// RED-able backstop, right rung for its cost. Locally: `pnpm run test:e2e`.
//
// The suite drives the DEV server (never a prod build): the `__qa` play API and the
// `?fixture=` boot param are DEV-only by design (verify-dev-strip.sh PROVES prod
// strips them), and `?dev=no` gives the true player layout with `__qa` still live —
// so tests see exactly what a player sees while staying drivable.
import { defineConfig, devices } from '@playwright/test';

const PORT = 5199; // NOT 5173 — never fights the human's live dev server

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // 60% of cores (human, 2026-07-06): 75% pinned every core at 100% — spooky on
  // a laptop; 60% keeps headroom while still beating the 50% default. CI keeps
  // the default (its runners have 2–4 cores; oversubscribing thrashes).
  ...(process.env.CI ? {} : { workers: '60%' }),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    // KAMI_ALLOW_MULTI_DEV bypasses the single-dev-server guard (which watches 5173
    // regardless of our port); --strictPort keeps this lane from cascading either.
    command: `KAMI_ALLOW_MULTI_DEV=1 pnpm exec vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  // Two real mobile profiles: Android Chrome (chromium) + the iOS floor (webkit,
  // 375px — the width every Andon build card's "Mobile" accept names). WebKit is
  // deliberate: iOS Safari is where mobile layouts actually break (dvh, -webkit-mask).
  // Plus the desktop lane (fable-2026-07-05-desktop-journey-e2e): desktop-chromium
  // ONLY — no desktop-webkit (locked; mobile-webkit already guards the engine class).
  // Scoping is per-project testIgnore, never copy-pasted specs: layout suites are
  // profile-specific; journeys run everywhere; persistence is desktop-only
  // (localStorage semantics don't differ per profile in ways we exercise).
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testIgnore: [/desktop-layout/, /persistence/],
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone SE (3rd gen)'] },
      testIgnore: [/desktop-layout/, /persistence/],
    },
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
      testIgnore: [/mobile-layout/],
    },
  ],
});

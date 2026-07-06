# Session 91 — 2026-07-06 — ship client-side DEV tools into the T0 gh-pages bundle

**Summary:** implemented D-138 — during T0 the client-side DEV tools (`__qa`, DEV
panel + variant harness, balance cockpit, F6 fixtures) now compile INTO the prod
gh-pages bundle, default-OFF, opt-in via `?dev=yes`; local dev keeps `?dev=no`
opt-out. Server-coupled telemetry + playtest-capture stay stripped. Direction
locked by the human via AskUserQuestion (scope = client-side only; gate = invert
under a build flag + ADR). New ADR D-138, plan doc, RED-able unit matrix.

## What changed
- `src/app/dev-gating.ts` — NEW pure `resolveDevGating(isDev, hasTools, search)`
  → `{ qa, panel }`; the two-axis runtime gate.
- `src/app/dev-gating.test.ts` — NEW 18-case truth-table (proves prod default-off
  / `?dev=yes`-on — the rows the dev-server e2e lane can't reach).
- `vite.config.ts` — `SHIP_DEV_TOOLS` env (default on = T0) →
  `__DEV_TOOLS__: command === 'serve' || SHIP_DEV_TOOLS` define.
- `src/vite-env.d.ts` — `declare const __DEV_TOOLS__: boolean`.
- `src/app/main.ts` — rewired: compute `gating` once at boot; `__qa`/cockpit/
  fixtures/panel block gated on `__DEV_TOOLS__ && gating.qa` (panel sub-gated on
  `dev`); `mountCapture` pulled out into its own `import.meta.env.DEV` block
  (server-coupled, always stripped).
- `src/scripts/verify-dev-strip.sh` — two-mode (follows `SHIP_DEV_TOOLS`): ship →
  client markers present + server absent; strip → all absent (the D-067 gate).
  Verified to go RED against the wrong build in both modes.
- `docs/living/decisions.md` — ADR D-138 (limits D-067 to post-T0).
- `docs/plans/opus-2026-07-06-ship-dev-tools-t0.md` — plan + reading-queue entry.
- `project/todo-human.md` — queued the plan.

## Verified
- `npm run verify` — 17 gates green.
- Prod preview (T0 build) headless probe: `/` → `{qa:false, panel:false}`;
  `/?dev=yes` → `{qa:true, panel:true}`; `/?dev=no` → off. Exactly the ask.
- Strip gate green in both modes vs matching builds; RED vs mismatched builds.

## Next intended steps
1. Human reads the plan / signs the ADR (it's already live canon; direction was
   locked in-session).
2. Post-T0: `SHIP_DEV_TOOLS=0` on the build + the strip gate restores the hard
   D-067 strip — one switch.

## Landmines
- Shared tree: main.ts was mid-flight (w6 telemetry fix, now committed 973b996);
  my working-tree diff sits cleanly on top (6 hunks, all dev-gating). Staged only
  my own paths — left pnpm-lock.yaml + the narrative-diverge brainstorm untouched.
- The cockpit imports the `/__playtest-capture` endpoint STRING, so that literal
  rides the T0 bundle (POST 404s inertly on gh-pages) — reclassified as a client
  marker in the gate; the real overlay sentinel `__KAMI_PLAYTEST_CAPTURE__` stays
  absent.
- QA is headless-only in this repo — the playwright-navigate MCP is hook-blocked;
  drive via a headless node script instead.

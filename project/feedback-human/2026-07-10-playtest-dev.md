# Playtest feedback — 2026-07-10 (async inbox capture, `dev` bucket)

Source: the in-game capture inbox (`project/playtest-inbox/`), **dev** bucket —
drained via `/drain-inbox` (lane claimed per ADR-171; this pass owns **FB-264**,
the claim's reserved block for the one unstamped capture).
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

## Dev tooling (bucket `dev`, session of 2026-07-10 11:32)

### FB-264 · DEV action hover-detail toggle (cost / rewards / timing) — ✅
**Verbatim:** _"Add a dev only toggle under settings to have a detailed hove
description of each action including cost and rewards as well as timing."_
**Reading:** a DEV inspector: while tuning, the human wants to hover any action
button and see exactly what it pays and costs — the effective numbers, not the
base table — plus its ADR-148 timing, without opening the balance docs.
**Fixed in:** three seams, the human's go-ahead picked the full AC-6 version:
- **`activityForecast(state, act)`** (new, `src/core/selectors.ts`) — the
  `do_activity` reward math (G3 work-rate throttle × autumn × skill × estate
  over the ADR-163 site-pool draw, xp rounding) EXTRACTED from the reducer;
  `do_activity` now calls it, so the hover forecast and the real payout share
  one function (AC-6, like `mcCombatStats`). RED-able equality tests in
  `economy.test.ts` drive the real reducer across six states (hungry, hurt,
  autumn, skilled, worked-out pool, coin-pocket) and compare deltas.
- **`.dev-act-card`** (render.ts, `__DEV_TOOLS__`-stripped) — one singleton
  fixed-position hover card on every `data-act-key` button: labour acts get
  effective yields + xp + satiety cost + timing; other timed actions get the
  timing line. `pointer-events: none`, no layout shift — a DEV tool that
  observes must not perturb (FB-215..257 law).
- **DEV panel → Settings → Inspect → "action detail: on/off"** — persisted as
  `kk.dev.actionHover` on the `ui-prefs.ts` seam (round-trip tested); applies
  `body[data-dev-act-hover]`. Default OFF.
Verified headlessly (rung-R2 fixture): toggle round-trips, card shows
`+0 shō (kura)` on a worked-out winter paddy (the forecast telling the truth),
`+5 farming xp · −3 satiety`, `8s work · 2s cooldown`; `rest` shows the
timing-only card; toggle-off hides it.
**Scope note (v1):** instant actions (trade, collect-wage) carry no
`data-act-key`, so they show no card yet — extendable if wanted.

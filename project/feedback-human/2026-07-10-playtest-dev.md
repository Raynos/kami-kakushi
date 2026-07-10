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

### FB-298 · DEV menu should default to Settings — ✅
**Verbatim:** _"When you open the dev menu it should default to settings."_
**Reading:** the panel opened on Variants (the old review focus); the human's
working pane is Settings.
**Fixed in:** `dev.ts` — `selectTab('settings')` at mount (was `'variants'`).

### FB-299 · Action detail card: name the act + needs/produces everywhere — ✅
**Verbatim:** _"Action detail is not fully implemented yet, it just says the
time, it doesn't say 'what the action is' it just says 'work' and 'cooldown' it
doesnt say what it needs and what it produces etc. ( Does raking still produce
+2rice?)"_
**Reading:** the FB-264 v1 gave non-labour actions a timing-only card; the
human wants every timed action to read like the labour ones — title + needs +
produces. (Answer: yes — raking pays +2 shō, costs 2 satiety.)
**Fixed in:** `render.ts` — the card now leads with a TITLE line (the button's
own label) and a per-intent detail line, every number from the same balance
constants / selectors the reducer spends (AC-6, never re-typed): rake
(`+RICE_PER_RAKE shō · −SATIETY_PER_ACT satiety`), rest (`+SATIETY_PER_REST +
homeRestBonus`), cook (`−sansai · +hp`), eat (`−shō · +satiety`), repair
(wood + waivable coin fee), craft (recipe inputs → weapon), improve estate
(next stage's coin cost), move (destination). Verified headlessly: rest
`+18 satiety`, eat `−2 shō · +30 satiety`, cook `−2 sansai · +35 hp`, rake
`+2 shō · −2 satiety`; the panel opens on Settings.

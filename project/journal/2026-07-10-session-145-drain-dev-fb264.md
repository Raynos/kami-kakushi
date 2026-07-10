# Session 145 — 2026-07-10 — drain the `dev` bucket: the FB-264 action hover inspector

**Summary:** Drained the `dev` lane's one open capture (FB-264 — "a dev only
toggle under settings" for a detailed action hover with cost, rewards and
timing). The human picked the full AC-6 build over static base values, so the
headline is a core extraction: the `do_activity` reward math now lives in a
shared **`activityForecast`** selector the reducer *calls*, and the new DEV
hover card reads the same function — forecast == reality by construction. Lane
claimed and released per ADR-171; bucket archived.

## What changed
- `src/core/selectors.ts` — **new `activityForecast(state, act)`**: the G3
  work-rate throttle × autumn × skill × estate chain over the ADR-163 site-pool
  draw + xp rounding, extracted verbatim from the `do_activity` reducer.
- `src/core/intents.ts` — `do_activity` keeps only the state writes; the math
  is one call. Byte-identical behavior (the whole economy suite stays green
  untouched).
- `src/core/economy.test.ts` — a RED-first equality suite: six states (fresh,
  hungry, hurt, autumn, skilled, worked-out pool) + a coin-pocket act, each
  driving the REAL reducer and comparing deltas to the forecast.
- `src/ui/render.ts` — the `__DEV_TOOLS__`-stripped `.dev-act-card`: one
  singleton, fixed-position, `pointer-events:none` hover card on every
  `data-act-key` button (labour = yields/xp/satiety + timing; other timed
  actions = timing). Observes, never perturbs.
- `src/ui/dev.ts` — Settings pane, new **Inspect** section: "action detail:
  on/off", gold-active idiom, default OFF.
- `src/ui/ui-prefs.ts` (+ tests) — `kk.dev.actionHover` persistence on the
  established device-pref seam.
- `project/feedback-human/2026-07-10-playtest-dev.md` — the FB-264 record.

## Verification
- `economy.test.ts` RED first (missing selector), then green; `ui-prefs` +
  full `src/ui` lanes green; typecheck clean.
- Headless Playwright against the live DEV server (rung-R2 fixture): toggle
  round-trips + persists; the card shows the honest `+0 shō` on a worked-out
  winter paddy, `+5 farming xp · −3 satiety`, `8s work · 2s cooldown`; `rest`
  gets the timing-only card; toggle-off hides it.

## Next intended steps
- The `r0` and `the-log` buckets remain in `pending/` (16 captures share a
  `log-panel` fix surface — a cluster lane for whoever claims them).
- v1 scope note: instant actions (trade/collect-wage) show no card (no
  `data-act-key`); extend if the human wants them covered.

## Addendum — second pass: FB-298 + FB-299 (same session)

The human's live session refilled the bucket (FB-298–307) and picked the
action-detail pair only. Landed: the DEV panel opens on **Settings** (FB-298),
and the hover card now leads with the action's **title** plus a per-intent
needs/produces line for every timed action — rake/rest/cook/eat/repair/craft/
improve-estate/move — each number read from the balance constants / selectors
the reducer spends (FB-299, AC-6). Verified headlessly (rest `+18 satiety`,
eat `−2 shō · +30 satiety`, cook `−2 sansai · +35 hp`, rake `+2 shō · −2
satiety`). FB-300–307 (the DEV-panel reorg batch) stay open in `pending/`.

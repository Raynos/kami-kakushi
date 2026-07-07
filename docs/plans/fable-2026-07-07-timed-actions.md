# Timed actions — duration + cooldown on every action (FB-174)

**Status: IN-PROGRESS** — all decisions settled with the human (ADR-148 + the
two walkthrough waves below); Phase 1 (timing data) landed 2026-07-07; next is
Phase 2 (shell clock + the action-row diverge).

- **Confidence:** ( 70% Opus, 30% Fable ) — the mechanism is mostly plumbing
  once the seams are locked; judgment concentrates in the pacing/balance
  ripple and the button-feel taste pass.
- **Source:** playtest capture 2026-07-07 (FB-174), direction locked with the
  human during the drain (AskUserQuestion, 2026-07-07).

## Who builds this — Fable or Opus?

**Resolved (human, 2026-07-07 walkthrough):** built on **Fable 5 (medium)** —
the session that authored the plan. The original Opus-for-plumbing proposal
is superseded by the human's routing call (D-124 satisfied — human-approved).

## Build decisions (human, 2026-07-07 plan walkthrough)

The second decision wave — the plan's remaining judgment calls, closed via
AskUserQuestion:

1. **Progress bar: inside the border, bottom edge** — a thin fill hugging
   the button's inner bottom edge; the button never resizes.
2. **Cooldown is per-action data** — `cooldownMs` in each timing entry,
   seeded 2000 everywhere; tunable per action later without a schema change.
3. **FULL diverge on the action row (ADR-075)** — the whole button + auto +
   progress + cooldown-state treatment ships as 2–3 complete working
   variants behind the DEV toggle; the human picks live. This is Phase 2's
   shape, not an optional extra.
4. **Sequencing: starts NOW**, parallel with the in-flight emergent-node-
   actions build (ADR-146) — Phase 1 is registry-additive; the shared
   Work-tab surface coordinates via commits.
5. **Travel: bar only, no forecast** — walk time is discovered by walking
   (the same in-button bar); the map stays clean of numbers.
6. **Auto stall: pause, resume when legal** — the toggle stays ON and
   visibly idles (e.g. "waiting — no wood"), re-firing the moment the
   action is legal again.
7. **Pacing anchor: hold rung minutes, boost yields.** Today's auto
   heartbeat is 480ms/action; the fast-idle band is ~15–25× slower per
   action. "Pacing-neutral" anchors at the RUNG level: Phase 4 keeps the
   current per-rung wall-time targets (t0-pacing / G-PACING) and scales
   per-action yields/requirements so fewer, slower actions reach the same
   rung in the same minutes. The band never compresses.

## The locked direction (human, 2026-07-07 drain)

1. **Core owns duration DATA; the shell owns the CLOCK.** The pure core
   stays wall-clock-free and deterministic. Durations/cooldowns are content
   data (tunable, single-sourced); the UI runs the actual timer and
   dispatches the intent when it completes. The sim + pacing reports convert
   action-counts → seconds through the SAME table (AC-6-style: one source
   feeds both the felt game and the measurement).
2. **Scope:** labour activities + meta verbs (rake, rest, repair, cook…),
   **travel** (`move_to` — distance becomes felt time), **craft + eat**.
3. **An explicit `instant` class.** Buy/sell (the pedlar trade) and other
   zero-second actions are declared `instant` — noted in the data, skipping
   the timer/cooldown machinery entirely. Makes the taxonomy total: every
   action is either `timed {duration, cooldown}` or `instant`.
4. **Combat is OUT of scope** — too nuanced; the human reviews it
   separately. `face_wolf` / fight flow keep today's behavior.
5. **Magnitudes: fast idle.** Small verbs 3–5s, standard labour 5–10s, big
   actions 30–90s, cooldown ~2s baseline. Seeds only — the human tunes via
   the balance cockpit (ADR-134: the agent transcribes, never slides).

## Interaction spec (from the capture, verbatim intent)

- Press → the timer starts; the button is **disabled for the action's
  lifetime**; a small progress bar lives at the button's bottom edge
  (inside the border), filling left→right over the duration.
- Completion → the action's effect lands (the existing intent dispatches);
  the button enters **cooldown** (~2s): the bar drains right→left; the
  button stays disabled until it empties.
- **Auto** = "on cooldown complete, go again" — the auto toggle re-presses
  the button in a loop, replacing today's fixed `AUTO_REPEAT_MS` heartbeat
  as the pacing source for auto'd actions.

## Design seams

- **Data:** each activity/verb entry gains `timing: { kind: 'timed',
  durationMs, cooldownMs } | { kind: 'instant' }` in
  `src/core/content/` (single source; the balance cockpit exposes the
  numbers). The type makes "forgot to classify" a compile error.
- **Shell clock:** one small `ActionClock` in the UI layer (like the FB-115
  expiry clock): tracks at most one in-flight action + per-action cooldown
  stamps, drives the button bars, dispatches on completion. No core import
  of the clock; the core never sees time.
- **Auto:** `autoModeIntent` stays the single decision function; the shell
  clock asks it "what next" only when the previous action's cooldown ends.
  The DEV speed multiplier (`__qa.speed`) scales the clock, not the core.
- **QA/headless:** `__qa` gets an instant-complete switch (the e2e/sim path
  must not wait wall-clock) — same pattern as `QA_INSTANT_TEXT`.

## Open questions — CLOSED (human, 2026-07-07, ADR-148)

1. **Mid-action interruption → DROP.** Save/reload or tab-hide while an
   action is in flight: the action simply never happened — no partial
   credit, nothing persisted (active-only per PRD §6.9).
2. **Concurrency → ONE GLOBAL.** Starting any timed action disables all
   other timed buttons until its cooldown ends (you are one person).
3. **Travel durations → PER-EDGE DATA.** Each map edge declares its own
   walk time from day one — distance texture is content, not a constant.
4. **Seed table → PACING-NEUTRAL.** Each action's seconds derive from the
   current pacing sim so total rung wall-times stay ~what they are today
   with auto running; the human tunes feel from there, not schedule.
5. **What the wolf does meanwhile** — scripted beats that today interleave
   with instant actions get their triggers re-checked against a world where
   actions take seconds: the Phase-4 audit pass (unchanged).

## Phases

- **Phase 1 — the data.** `timing` field + the total classification of every
  existing action; gen-docs table so `docs/content/` shows the timings.
  DoD: typecheck forces every action classified; a unit test derives the
  classification list from the registry (no copied magic numbers, ADR-086).
- **Phase 2 — the shell clock + the action-row DIVERGE.** ActionClock,
  disabled states, the inner-bottom-edge progress bar (fill → drain),
  per-action cooldown; the `instant` class bypasses; auto pauses-and-resumes
  on an illegal action (visible idle reason). Taste-scorecard Pass 1 BEFORE
  building (ADR-135), then a **FULL ADR-075 diverge**: 2–3 complete working
  treatments of the action row (button + auto + bar + cooldown states)
  behind the DEV toggle, one HR-item per variant, self-picked prod default.
  DoD: headless e2e — press → disabled → effect at duration → cooldown →
  re-enabled; auto loops through the clock and pauses/resumes across a
  legality gap; `__qa` instant mode.
- **Phase 3 — travel + craft/eat.** The same machinery over `move_to`
  (per-edge walk seconds, bar only — no map forecast), crafting, eating;
  trade declared `instant`.
  DoD: walk-somewhere e2e under the clock; trade stays zero-second.
- **Phase 4 — pacing reconciliation.** The sim/pacing lane converts
  action-counts → wall-seconds via the timing table; G-PACING + the ADR-132
  balance flow re-baselined; `project/telemetry/` attended-time re-read
  (FB-8 step 0) before locking numbers; regenerate `docs/content/t0-pacing.md`.
  DoD: `pnpm run verify:balance` green on the new model; the pacing report
  quotes seconds, not clicks.

## Out of scope

- Combat timing (human reviews separately — the locked exclusion).
- Offline/away progress (PRD §6.9 stays active-only).
- Any slider-tuning of the seeded magnitudes (ADR-134 — human-only).

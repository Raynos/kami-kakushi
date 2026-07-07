# Timed actions — duration + cooldown on every action (FB-174)

**Status: LOCKED** — direction AND all four open questions settled with the
human (2026-07-07 drain, AskUserQuestion) — recorded as **ADR-148**. Ready to
build.

- **Confidence:** ( 70% Opus, 30% Fable ) — the mechanism is mostly plumbing
  once the seams are locked; judgment concentrates in the pacing/balance
  ripple and the button-feel taste pass.
- **Source:** playtest capture 2026-07-07 (FB-174), direction locked with the
  human during the drain (AskUserQuestion, 2026-07-07).

## Who builds this — Fable or Opus?

Opus builds Phases 1–3 (data plumbing, the shell clock, the button UI) — the
seams below are explicit and the tests are mechanical. Fable (or Opus with
the human in the loop) takes Phase 4 (pacing/balance reconciliation): that's
where a wrong call silently changes what the game feels like. Routing is a
proposal for the human to approve (D-124 — no self-serve lateral switches).

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
- **Phase 2 — the shell clock + button UI.** ActionClock, disabled states,
  the in-button progress bar (fill → drain), cooldown; the `instant` class
  bypasses. Taste-scorecard Pass 1 BEFORE building the bar (ADR-135); the
  bar itself is a minor restyle of an existing surface (no diverge needed —
  confirm at build time against ADR-075's "majorly restyled" bar).
  DoD: headless e2e — press → disabled → effect at duration → cooldown →
  re-enabled; auto loops through the clock; `__qa` instant mode.
- **Phase 3 — travel + craft/eat.** The same machinery over `move_to`,
  crafting, eating; trade declared `instant`.
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

# Session 105 — inbox drain (F173–F177) + the timed-actions plan

- **Date:** 2026-07-07
- **Agent:** Claude Code (claude-fable-5)
- **Focus:** drain the 7-capture playtest inbox session (2026-07-07T09-03-29);
  land the 4 small fixes; turn the timed-actions redesign into a plan doc
  built interactively with the human.

## What happened

Drained `project/playtest-inbox/pending/2026-07-07T09-03-29-855814.md`
(7 captures → 5 items). Human steered the whole pass interactively
(AskUserQuestion): small fixes land now, the timed-actions redesign gets its
own plan; core owns duration DATA / the shell owns the CLOCK; scope = labour +
meta verbs + travel + craft/eat, with an explicit **instant** class (trade);
combat deferred to its own review; fast-idle magnitudes.

- **F173 · clock-dock "stick"** — pre-unlock the calendar inside
  `.clock-dock` is `[hidden]` but the dock still painted its padding +
  1px gold border-right: a stray ~14px hairline above the version button
  (FB-172 regression). Fix: `:has(> .clock[hidden])` hides the empty dock.
  Verified headlessly at post-cold-open (gone) and rung-R3 (dock still
  renders once the clock unlocks).
- **F175 · Now activity lamp** — the Now tab now carries a warm-gold `live`
  tint while fleeting text landed in the last 10s (NOT the shu unread dot —
  Now self-fades, FB-53). Driven by the existing `nowSeen` stamps + the same
  500ms expiry clock; verified on (auto-rake) and off (12s quiet).
- **F176 · Now stands alone** — the Now button moved to the bar's LEFT as a
  standalone element; the six channel tabs join inside a new
  `.log-filter-group` (segmented variant preserved per-group).
- **F177 · fresh-divider outlived by the typewriter** — root-caused with a
  live instrumented repro: the `新 · new` divider armed its 4.5s fade at
  batch ARRIVAL, but the typewriter cascade types a batch out over many
  seconds (one long line alone took ~9s), so lines kept landing after the
  divider faded. Fix: the fade re-arms on every appended/typed line and the
  countdown defers while the cascade is still busy — it now fades 4.5s after
  the LAST written line. Verified: divider present across the full 19s
  cascade window that previously failed.
- **F174 · timed actions** — the big capture (a full design proposal): every
  action becomes a timed action with progress + cooldown; auto = re-trigger
  on cooldown end. Routed to a plan doc
  (`docs/plans/fable-2026-07-07-timed-actions.md`) built with the human —
  see the plan for the locked direction.

## Notes

- The shared tree was red on another agent's untracked DRAFT plan
  (`docs/plans/fable-2026-07-07-story-reboot.md` — status token outside the
  closed set + stale plans README gen-region). Not mine; commits here use the
  lane flags (`SKIP_DOCS_VERIFY=1` for the code commit) rather than fighting
  it; push waits for a green window.
- Captures were already auto-committed on write (FB-3), so no separate
  intake commit was needed.

## Next intended steps

- Human reviews the timed-actions plan → build it.
- Remaining inbox: 0 captures after this drain.

## Addendum — the plan LOCKED in-session (ADR-148)

The human closed the plan's four open questions in the same sitting
(AskUserQuestion): interruption **drops** the in-flight action; **one
global** action at a time; travel is **per-edge data** from day one; the
seed table is **pacing-neutral** (derived from the pacing sim so rung
wall-times hold). Recorded as **ADR-148** (renumbered from 147 — a parallel
session minted ADR-147 for the story-reboot lock mid-drain); the plan
flipped LOCKED and left the reading queue (ADR-089 — built together counts
as read). Next: build Phases 1–4, routing per the plan's "Who builds this".

## Addendum 2 — the build-decision wave (plan walkthrough)

The human walked the LOCKED plan and closed the remaining judgment calls
(AskUserQuestion): routing = **this Fable 5 (medium) session builds it**
(supersedes the Opus proposal); progress bar **inside the border, bottom
edge**; **per-action `cooldownMs`** (2s seed); a **FULL ADR-075 diverge on
the action row**; **starts now** in parallel with ADR-146; travel shows
**bar only, no map forecast**; auto **pauses and visibly resumes** across
legality gaps. Plan updated (§Build decisions); Phases 2–3 reshaped
accordingly. Build begins with Phase 1 (the timing data).

## Addendum 3 — pacing anchor closed; Phase 1 built

Surfaced a real conflict before writing data: today's auto heartbeat is
AUTO_REPEAT_MS = 480ms/action, so the fast-idle band is ~15–25× slower per
action — "pacing-neutral" couldn't mean per-action seconds. Human's call:
**hold rung minutes, boost yields** (Phase 4 re-baselines yields/requirements
to the existing t0-pacing targets; the band never compresses). Recorded as
plan §Build decisions (7).

**Phase 1 landed:** `src/core/content/timing.ts` — `ActionTiming`
(timed{durationMs,cooldownMs} | instant), `ACTIVITY_TIMING` total over
ActivityId, `INTENT_TIMING` total over IntentType (a new intent can't ship
unclassified — compile error), `timingFor()` routing, band seeds (rake 5s per
the capture; big actions 45–60s; trade/combat/VN instant). Tests derive from
the registries (5 passing; dropped a seed-uniformity ratchet that would cry
wolf on legitimate cockpit tuning); gen-docs gains the "Action timing" table.
A new FILE keeps the parallel ADR-146 lane collision-free. Plan flipped
IN-PROGRESS.

## Addendum 4 — Phase 2 built: the ActionClock + the action-row diverge

`src/app/action-clock.ts` (injected-timer, 7 tests): one global in-flight,
per-key cooldowns, cancel-drops-without-dispatch, instant mode. main.ts gains
the ONE timed-dispatch gate (player presses + the auto heartbeat both press
the same clock; `__qa.dispatch` bypasses); `__qa.instantActions`; tab-hide /
every state swap cancels (drop-on-interrupt). render.ts paints every stamped
`data-act-key` button from the clock (phase classes + the shared `.act-bar`,
CSS-transition motion, availability-aware locking); an armed auto visibly
"⏸ waiting" when its activity goes illegal. Three ADR-075 variants (inner
hairline / ink wash / etched gauge) behind the DEV toggle → HR-14 with
per-variant scorecards. e2e: journeys boot instantActions; a new
timed-actions spec drives the REAL 5s cycle (6 pass on 3 profiles). Verified
live headlessly: press→lock→bar→effect@5s→cooldown→re-enable, and auto
0→10 rice over 40s through the clock.

## Addendum 5 — Phase 3: per-edge travel

`EDGE_WALK_MS` in timing.ts — every T0 map edge declares its walk seconds
(4–8s, deep-satoyama the longest hop); undirected `edgeKey`; `walkMs` with a
TRAVEL_SEED_MS fallback; `timingFor('move_to')` routes per-edge with NO
cooldown (arrive and keep moving — per-action data if that ever changes).
main.ts threads `from: state.location`; the map variants' shared `wireTravel`
stamps `data-act-key` so the walk paints ON the clicked node (all 5 variants,
one helper); the paint pass covers non-button controls (class + aria — the
clock's press refusal is the enforcement). Edge coverage test derives from
MAP_NODES (a new edge without a time is RED). Verified live: kura→gate walk
takes the edge's 4s with the bar on the node, then arrives.

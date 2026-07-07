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

# Playtest feedback — 2026-07-10 (async inbox capture, `work-actions` lane)

Cross-bucket cluster lane (ADR-171 regroup): one r0 + one r1 capture sharing
the work-actions fix surface, drained by the w6:p1 r0+dev pass.
Status legend: 🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬 needs-discussion.

### FB-334 · "+18 satiety" is not a player word — ✅
**Verbatim:** _"What the hell does it mean for rest to increase +18 satiety ? /
It should increase +18 stamina or whatever the unit of body is for doing
actions."_
**Reading:** the DEV action-detail hover card (FB-264/FB-299) leaked the
internal field name "satiety" in four lines (labour, rake, rest, eat-rice);
the visible meter is named **body**.
**Distilled rule:** UI copy names the unit by its on-screen meter name, never
the state field (TST4 — the player never guesses state).
**Fixed in:** this commit — all four card lines read "body"; the dev-cockpit
Balance lever labels keep the constant names (dev-facing, deliberately).

### FB-324 · cap the rice-raking — ✅
**Verbatim:** _"To avoid 'forever grinding' should we set a max actions at
raking the spilled rice to 50. / And then a flavor text saying something along
the lines of 'all the rice has been raked for today, there's nothing left, or
you've done a good job etc.' / Then you don't grind it 1000s of times."_
**Reading:** rake is R0-only but unbounded — an auto-rake left running banks
+2 shō forever. The human proposed the cap AND the flavor beat.
**Human pick (fork):** 50 TOTAL for the run (over 50/day — R0 is one short
stretch; a daily reset just re-opens the grind each dawn).
**Line pick:** take (a) of the three offered — _"The spilled rice is raked to
the last grain. There is nothing left on the boards."_ (narrator, spoken once,
on the rake that clears the spill); alternates recorded in the drain thread.
**Distilled rule:** a bounded faucet needs its bound IN the fiction — the cap
line + the disabled button's why land together (TST3/TST4, the FB-265 pattern).
**Fixed in:** this commit — `balance.RAKE_CAP` (cockpit-settable) ·
`state.rakesDone` (additive, validate defaults 0 — old saves fine) · reducer
refuses past the cap (`rakeExhausted`, the AC-6 shared predicate) · the capping
rake still pays and speaks the line once · the button disables with "Nothing
left to rake — the boards are clean." · auto-rake disarms instead of spinning.
RED-proven core test derives its fixtures from RAKE_CAP itself. Fixtures
regenerated (state grew `rakesDone`); `verify:balance` GREEN, pacing report
fingerprint-only diff (Δ 0.0 all rungs — the sim promotes at ~7 rakes, far
under the cap). Telemetry step 0: the 2026-07-10 reports carry no completed
R0→R1 climbs to compare against (short attended segments, no rung-ups).

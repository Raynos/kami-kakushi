# Session 178 — 2026-07-11 — inbox drain: the-log + r1 lanes (FB-398…FB-410)

**Summary:** All-13-capture drain of the `the-log` and `r1` buckets under an
ADR-171 claim (both lanes, no collisions). Human approved the wholesale
proposal with steers: R0 starts at the forecourt (FB-401), the woodshed
becomes the sited home-rest zone (FB-409), a wait-a-day plan + a zone→rung
rebalance plan get written, and the zone section gets a FULL ADR-075 diverge
(FB-410). Fixes land one commit per entry below.

## Entries

- **FB-404 + FB-405** — `.vitals` header strip aligned `baseline` → `center`
  (styles.css): the FB-387 bar-stack and the 黒沢家 house-mark hugged the top
  while the rung element centered; baseline lost its meaning when the stack
  hid its numerals. Verified with a headless before/after shot.

- **FB-398** — restored the spoken-line indent inside 幕 cards: composed
  `.log-line.scene-line.spoken` padding (card + speech) so FB-262's card
  padding no longer overrides FB-228's speech indent. Verified headlessly.

- **FB-403** — a VN entry (`begin_rung_beat`/`begin_scene`) now
  `clock.cancelAll()`s the in-flight timed action (main.ts playerDispatch) —
  it never completes under the card. New e2e case (timed-actions.spec.ts),
  proven RED without the fix.

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

- **FB-399** — `label-nameless` now latches BEFORE the sickroom scene's
  ask/decide say-lines are emitted (intents.ts), matching intro.md's flip
  comment; the end-of-scene latch was deleted (single source). New test.

- **FB-406** — `move_to` no longer emits the arrival flavor line (ADR-116's
  (b) half retired, struck in decisions.md); the Map tab's you-are-here card
  stays the one home for the seasonal zone read. Render tests rewritten.

- **FB-401** — answered the three R0 reveal messages (body readout · rice
  readout · the forecourt zone) and fixed the ground: the run starts at the
  FORECOURT now (state.ts + validate.ts clamp), so the rake fiction and the
  reveal line agree. Tests re-anchored (breadth-arc, combat-rework's
  economyReady pins the kura for the deposit gate, rung-beats FB-388 steps
  off the arriveAt first). Fixtures regenerated.

- **FB-408** — the gate's absent-merchant affordance: `peopleAwayHere`
  (selectors.ts) + `awayTell` (people.ts, kanji derived via marketDaysKanji,
  AC-21) render a dimmed button-less schedule row in who's-here. Tests in
  people.test.ts. Market-day facts answered in the F-entry; the wait-a-day
  lever routed to its own plan.

- **FB-400** — chat runs now group as the SAME 幕 card as VN scenes
  (render.ts stampSceneGroup keyed `chat:<partner>`, opener label as lintel);
  the F127 inline chat-kicker rule is retired (styles.css). Test added;
  verified headlessly.

- **FB-402 + FB-409** — rest is SITED: home lines + comfort bonus only when
  resting AT the woodshed (intents.ts, selectors.ts homeRestBonus; new
  cornerRestBonus property feeds the Inventory tallies); away-rests emit the
  new `restOpen` flavor line — ADR-139 bundle `fb402-rest-open` (3 blind
  takes, pick = C "the tool set down", HR-31 filed; live-swappable via
  __setRestOpenLineOverride). Balance flow ADR-132 run: Δ ~0, in band.

- **Plans** — two human-requested plans authored + queued: the wait-a-day
  lever (FB-408; option map A–F, recommendation D "sleep until morning" +
  F "wait for the market day", priced by the existing day-boundary sink)
  and the zone→rung rebalance ("too many zones in R1"; gate→R2,
  kitchen→R2, woodshed→R4-with-the-home proposed). Both Phase-0 gated on
  the human's pick.

- **FB-410** — the Zone do-panel FULL diverge (ADR-075): A "zone placard"
  ships inline (render.ts — node kanji + label above the verb groups, guarded
  for off-map fixtures); B "worktable ledger" + C "ink-scene banner" live in
  ui/dev.ts behind the SURFACES toggle (surface id `zone`), driving the real
  intents with sig-guarded rebuilds. Routing tests in dev.test.ts; headless
  shots of all three in tmp/drain-shots/FB-410-zone-*.png; HR-32 filed with
  the Pass-1 brief + per-variant scorecards; DEV_SENTINEL strip-proof 0 hits.

## Close of pass

Both lanes fully drained and archived (the-log 7/7 · r1 6/6 — `pending/` is
empty). FB range FB-398…FB-410 (all capture-stamped; no reserved block).
Forks surfaced for the human: HD — none new (the two plans carry their own
Phase-0 picks in the reading queue); HR — HR-31 (open-rest line takes) +
HR-32 (Zone do-panel variants). Claims released at end of pass.

## Next intended steps
1. Human: read the two plans (wait-a-day · zone-rung rebalance) — each Phase 0
   is a pick; then HD-38 still blocks the re-voice plan's Wave 0.
2. Human: toggle HR-31/HR-32 takes in the DEV panel when playing next.
3. Agent: on the rebalance pick, apply the ranks.ts mapping (Opus-safe).

## Landmines
- The FB-402/409 rest siting means comfort tallies use `cornerRestBonus`
  (property) vs `homeRestBonus` (sited live value) — don't merge them back.
- `?zone=zone-b|c` boots the Zone variants only with the DEV harness ON
  (`?dev=no` disables the whole variant machinery).

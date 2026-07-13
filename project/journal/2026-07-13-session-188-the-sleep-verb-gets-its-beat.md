# Session 188 — 2026-07-13 — the sleep verb gets its beat (ADR-187 follow-up)

**Summary:** Executing
`docs/plans/opus-2026-07-12-sleep-announce-beat.md` after the human
ruled its forks live: **(a) narration beat** locked, **Fable
end-to-end** (routing split overridden), start **now** (the w6 re-voice
seam is stale — that plan archived at `80389d75`), and the **no-beat
fallback stands** if every take reads as tutorial.

## 1 · The rulings, and the seam check

Ran the plan's decision walk with the human (AskUserQuestion): beat
weight → (a) the works.ts seen-flag narration idiom, no screen takeover;
routing → Fable for both phases; sequencing → now (verified:
`src/core/content/narrative/` is clean in git, the T0 re-voice plan is
archived DONE, and `herdr agent list` shows only w1:p3 (hd41-rewards,
idle) besides this session); fallback → no-beat is a valid outcome. Plan
Status line updated in place.

## 2 · Taste-scorecard Pass 1 — the constraint brief (BEFORE any prose)

The plan's own post-mortem: session 183 skipped Pass 1 on the sleep
button and the P9 ✘ is why this plan exists. So the brief comes first.
Full 21-walk:

- **P1 (one home)** ✦ — the line's canon lives in FLAVOR
  (`sleepAnnounce`), nowhere else; the trigger lives in ONE settle-pass
  site.
- **P2 (one primitive per idiom)** ✦ — reuse the existing idioms
  end-to-end: the works seen-flag latch, the FLAVOR registry +
  `flavor.<key>` contentKey namespace (log-render resolves it already),
  the declaring-module DEV setter (`restOpenLine` pattern), the takes/
  bundle grammar. NO new mechanism.
- **P3 (voice at source)** ✦ — emitted from pure-core with `voice:
  'narrator'` + a contentKey, so the renderer voices it and a reword
  reaches old saves.
- **P4 (append-only)** ✦ — a pushLog line; nothing rebuilds.
- **P9 (discover, don't spawn)** ✦ THE POINT — the beat fires the first
  time the player STANDS in the corner with the verb live (`canSleep`
  true), never on the rung-up grant. Discovery in place, not a promise
  in advance.
- **P10 (story promises are contracts)** ✦ — the beat implies the day
  can end here; `canSleep(state)` in the trigger condition guarantees
  the Sleep button is genuinely present in the same view. The line must
  promise nothing else.
- **P12 (typewriter contract)** ✦ — free via the shared log primitive;
  do not fork rendering.
- **P13 (rewards diegetic)** ✦ — this is NOT a learned-box reward; it
  must stay a narration beat: no button name, no mechanics dump, no stat
  syntax.
- **P16 (route by narrative weight)** ✦ — `narration` channel (the works
  sighting precedent): a one-off discovery line is story-adjacent, not
  Progress, not Now-fleeting.
- **V-derived (TST3) — the fiction causes the verb** ✦ — the line's
  content must locate the capability in the BED (the mat that is yours),
  so sleeping till morning follows from the fiction. Reuse or
  deliberately avoid the three canon props (mat · bowl · nail —
  ADR-184's grant, already load-bearing in the slept-day line
  `FLAVOR.sleep`); never contradict them. The register bar: "the day is
  now yours to end" understood, with zero tutorial voice.
- n/a (silently walked): P5–P8, P11, P14, P15, P17–P21.

**Compressed brief (carried to the HR-item):** P9 fires standing in the
room, never at the grant · P10 the button is live in the same view
(`canSleep` in the trigger) · P13 no button name, no mechanics voice ·
P16 narration channel · P2/P3 existing idioms only (seen-flag latch,
FLAVOR key, narrator voice, contentKey) · TST3 the bed causes the verb;
mat/bowl/nail canon respected.

## 3 · The diverge, the build, and the PH6 proof

Three blind agents authored under three briefs (ownership / the house's
indifference / the body meets the bed). Pass 2: A 20✔·0✘·1—, B 19✔·1✘
(blind spot: "Dusk settles" asserted an hour — the beat can fire in the
morning; fixed to future tense), C 19✔·1✘ (briefed: ~2× the ruled
weight; opener trimmed). **Pick: A** — legible + time-proof
+ at the ruled weight; "the house keeps its hours" foreshadows the
  slept-day line without stealing it.

Built (all idioms existing, nothing new): `FLAVOR.sleepAnnounce` canon
in `flavor.md` · `sleepAnnounceLine()` + the DEV setter (flavor.ts, the
restOpen pattern) · the trigger in `revealsPass` —
`!hasFlag('sleep-announced') && canSleep(state)` (announced ==
available; fires on arrival, never the promotion tick — mid-rungBeat
`canSleep` is false) · the dev.ts switcher forward · takes bundle
`takes/sleep-announce/` · 6 new tests in `reveals.test.ts` (once-ever,
not-below-R4, not-elsewhere, arrival-not-promotion, announced ==
available, contentKey re-renders from canon). Fixtures regenerated (the
beat changes R4+ waypoint logs).

**PH6 (tmp/ph6-sleep-announce.mjs, headless at the shared :5173):**
rung-R4 fixture → walk to woodshed → the line lands exactly ONCE with
the Sleep button in the same view; walk away + back → silent. PASS.

Paperwork: **HR-40** filed (brief + 3 scorecards + live-review path +
the approved no-beat fallback); HR-39 got the P9-closed crosswalk;
ADR-187's FOLLOW-UP bullet flipped to BUILT (and its wrong "needs a new
write-once flag" claim corrected); plan archived to `project/archive/`.

## 4 · The crowded tree

Four agents mid-session (w1:p2 wrap-72, w1:p3 hd41-rewards, w6:p1
adr-plan, me). w1:p3's HD-41 work interleaved with mine in flavor.md /
flavor.gen.ts / dev.ts / storyTakes.gen.ts. Coordinated via herdr: **I
land first**, folding their INERT hunks file-level with credit (their
earnedEntry flavor key + dev.ts SURFACES entry +
takes/hd41-earned-entry/ — all dead code without their render.ts); they
land render.ts + log-filter.* + styles right after in the green window.
Journal renamed 185→186 (number collision with their session).

## Next intended steps

1. Commit (pathspec, their hunks folded with credit) → ping w1:p3.
2. Checkpoint (journal + snapshot + push) once the tree is green.

## Landmines

- `gen:narrative` compiles the whole tree — w1:p3's
  takes/hd41-earned-entry/ must fold into storyTakes.gen.ts in MY commit
  (they asked for this); re-run gen:narrative immediately before
  committing.
- The beat must NOT fire during the cold open / intro — `canSleep`
  already excludes `introActive` + active scenes/beats; that IS the
  condition.
- tmp/ph6-sleep-announce.mjs is the reusable PH6 driver (git-ignored
  tmp/).

# Session 134 — 2026-07-09 — storywave closure: rulings + execution begins

**Summary:** the human read the closure plan
(`docs/plans/fable-2026-07-09-storywave-closure.md`), ruled every surfaced
fork live via AskUserQuestion, and went AFK with this Fable session executing
the whole plan (C0→C5) end-to-end autonomously. C0 pre-flight landed: every
B-finding re-verified live against the tree (none pre-fixed; line refs hold),
both design forks recorded as ADRs, the plan annotated + flipped IN
EXECUTION.

## The rulings (verbatim record: `project/feedback-human/2026-07-09-storywave-closure-rulings.md`)

- **HD-31 → the REFUSING gate (ADR-166)** — reverses the plan's keep-as-built
  default: Autumn's exit refuses until that year's nengu is reckoned; the
  refused attempt triggers the nengu scene; completion reckons (kura draw +
  flag latches); annual re-arm; the latched `nengu-reckoned` still serves R7.
- **HD-32 → the FULL fiction wave now (ADR-167)** — units 1–5 incl.
  per-season node flavor at PER-SEASON diverge units (6 units × 3 takes).
- **Routing** — Fable executes the whole plan this session (overrides the
  plan's 80%-Opus table for this execution).
- **C3 gate scope** — WIDEN the prd-drift retired-terms scan to
  `fun-factor.md` / `ui-design.md` / `qa-playtesting.md` (allowance rows).
- Standing steers: adjacent misses the plan didn't catch are in scope
  (mechanical on sight; design-shaped → HD/HR-items); no blocking asks for
  the rest of the session — defaults + async-override items instead.

## What changed (C0)

- `docs/living/decisions.md` — ADR-166 (refusing gate) + ADR-167 (fiction
  wave in full).
- `project/human-in-the-loop/archive.md` — HD-31/HD-32 rows (ruled same-day,
  never sat open).
- `project/feedback-human/2026-07-09-storywave-closure-rulings.md` — NEW.
- `docs/plans/fable-2026-07-09-storywave-closure.md` — Status → IN EXECUTION;
  ruling annotations at C0.2/C0.3, C1.4's gate block, C3's scope check, C5a's
  options, the routing section.
- `project/status/project-status.md` — resume block points at this execution.
- This journal.

## C0 verification notes (PH2)

- B1: `O-Sato` ×4 in `src/ui/map-sheets/nodes.ts:122,133,491,508` — confirmed,
  and confirmed absent elsewhere in `src/`.
- B2: `night-rounds.ts` FALL still skips the bleed (comment still says
  "DORMANT"); `fight.ts:166-179` carries the bleed + the dead `lostRice` read
  (B5). B4: `autoplay.ts:405` reads `resources.rice`. B6/B7: reducer guards
  absent as reported; `season.test.ts` does not exist; `step.ts` auto-reckons
  the nengu in `advanceSeason` (the ADR-166 target). Combat-rework debt: 3
  `it.skip` + TODO(g4-tests) patches confirmed.
- ADR-166 implementation note discovered in pre-flight: `nengu-reckoned`
  latches ONCE but Autumn recurs — the refusing gate must key on a per-year
  seam (e.g. the seasonsPassed of the last reckoning), not the latched flag,
  which keeps serving R7 unchanged.

## Next intended steps

C1 (build fixes, one commit per step) → C2 (docs sweep) → C3 (gate hardening,
RED-proof vs pre-C2 tree) → C4 (wire the dark world) → C5a (fiction wave,
ADR-139) + C5b (balance re-baseline). Each phase checkpoints (commit →
journal append → snapshot → push).

---

## C1.1 — B1 name-sync (O-Sato → O-Hisa)

Four player-visible `who:` strings in `src/ui/map-sheets/nodes.ts` carried the
bible-retired "O-Sato" (→ O-Hisa). Fixed; side-panel text only, no geometry,
no pin regen. Durable guard: `names.ts` gains `RETIRED_NAMES` (the content-side
single source — O-Sato, Oyuki, Okimi, Jinbei, Akagi, Shigemasa, Tokubei) and
the map-sheets integrity test sweeps every node's content strings against it —
seen RED against the pre-fix tree (all four hits), GREEN after. Adjacent-canon
check: "Heikichi" in a nodes action string verified bible-canon (04-cast).
Note: the C0 push was blocked by the co-agent's (w2:p5) unformatted WIP —
left local per "don't fight someone else's red"; cleared later this session.

## C1.2 — B2/B3 night-round fall bleed fold

`applyCarriedLossBleed` extracted to `defeat.ts` (one home); fight loss +
night-round fall both call it; dead `lostRice` read deleted (rice kura-only —
cannot bleed by construction); the fall now logs via the same `combat.loss`
key. B3: the test sweeps the REAL `NIGHT_ROUNDS` registry (materials-only
rewards across seeds; fall bleeds the constant-derived slice) — RED-proven
against the HEAD engine. Fixtures regenerated (loss path feeds waypoints).
ADR-132: `t0-pacing.md` was STALE since the rewrite (fingerprint 64b47624 →
780ad790); regenerated. Sim verdict: 6 RED (idler R1 soft-lock ×5 + Phase-2
ratio ~7–8.7 vs [0.8,1.2]) — verified PRE-EXISTING at HEAD by swapping the
diff out; the bleed fold is sim-neutral; the reconciliation is C5b's owed
re-baseline. All 24 telemetry reports are v0.3.x/tainted → C5b distill.

## C1.3 — B4 dead autoplay branch re-pointed to the kura

The Phase-2 steward's sell-rice lever read `resources.rice` (never written
post-G4.5) so it never fired. The intent ladder's own step-2b comment ("Rice
is sold first (above)") shows the lever is MEANT to fire — re-pointed to
`banked.rice` and gated on `isMarketDay` (mirrors the reducer's no-op guards
so a shut stall can't stall the policy loop; the sell terminates by shrinking
the pile). ADR-132: Phase-2 ratio nudged [7.33–8.65]→[7.24–8.54] (the lever
now fires; still the pre-existing C5b band breach), idler REDs unchanged;
report + fixtures regenerated.

## C1.4 — B7/ADR-166: the Autumn refusing gate + season.test.ts + B6

The big one. `advance_season` is ENGINE law now (refused during intro/scene,
refused pre-R2 — mirrors the vitals gate), and Autumn's exit is the TRUE
refusing gate the human ruled: unreckoned attempt → refused + the nengu
scene enqueues (`trigger: scripted` now — re-keyed in scenes.md); scene
completion performs the reckoning (new `src/core/nengu.ts` — AC-20 glue:
kura draw + `nengu-reckoned` + `nengu-short` + the per-year re-arm flag
`nengu-reckoned-y<N>`); next attempt exits. `onNengu` deleted from the exit
pipeline (step.ts). Scene engine: completion effects fire from BOTH
terminals (scenes.ts `applySceneCompletionEffects`); `enqueueScene`'s
replay-block now keys on `def.once` — it silently blocked EVERY played id,
making the "absent ⇒ repeatable" SceneDef contract false (latent bug); the
nengu frame is repeatable (annual). Autoplay unchanged in policy (the (a0)
scene drain self-resolves the refusal); its pre-R2 wheel-turn is guarded.
B6 same commit: `fight` + `set_auto_combat` refuse `nightRoundOnly` foes
(engine law, was UI-only); registry-derived invariant added.
`season.test.ts` finally exists: wheel order from SEASONS, pool refill from
refillSitePools, the three guards, the refusal flow, shortfall, annual
re-arm (8 tests; the refusal/re-arm cases fail BY CONSTRUCTION against the
old auto-reckon engine). m1/economy suites re-seamed to R2 (they tested
their own levers standing on now-illegal R0 ground); scenes.test's
once-scan filtered to `once` defs. KNOWN EDGE: a v0.4.0 save mid-Autumn
that already auto-reckoned will re-play the frame and pay once more that
autumn (year-flag absent) — accepted, dev-stage, self-heals at the turn.

## C1.5 — B5 remnants + combat-rework debt (+ adjacent finds)

- `main.ts` stale INTERIM-placeholder comment rewritten (the notice IS the
  HD-30 prose). `combat.win` no longer renders a dead "+0" coin token
  (coin conditional like loot); tests assert the coinless form + that wins
  mint no coin. The 3 `it.skip` dead tests deleted (A9 roster + 2 scripted-
  wolf — retired at G4.3; history is the archive). The retreat-sweep's
  string-swapped 'wolf' re-derived to 'badger' (the wolf is nightRoundOnly
  — B6 makes it engine-illegal by day; badger is the heavy DAY foe).
- Adjacent (plan-missed, human grant): dead `combat.wolfScripted` +
  `combat.drillmaster` log keys deleted (orphaned since G4.3, only test
  fixtures referenced them); home.test's tautological PRE_HOME_REST_LINE
  capture re-anchored on the real woodshed-corner siting words; m1.test's
  DEAD empty-array voice loop now derives the readout reveal prose from
  the SURFACES registry.

## C1 DoD closed

- **B1 player-visible proof:** headless capture of the T0 sheet's woodshed +
  kitchen detail panes — "WHO'S THERE: O-Hisa …", O-Sato absent (verified by
  page-text scan both ways). Shots in
  `project/audit/screens/2026-07-09-closure-c1/` (git-ignored dir — local
  evidence; this journal line is the record).
- **e2e:** GREEN in CI at `20cd708` (the authoritative Linux lane). Two
  mobile-webkit specs (journeys repair-bind + quest-slice) fail LOCALLY on
  macOS WebKit — bisected in an isolated worktree to PRE-EXISTING at
  `f0c954f`, where CI is also green: a local-env rendering artifact (the
  woodlot seal falls under the section fold on macOS metrics), not a
  regression from this work. Left as a known local quirk.
- Adjacent find parked for C2/D3: `src/scripts/qa-shots.mjs` still drives
  the RETIRED `home-paddies` node id (+ boar-era comments) — it rides the
  D3 goto-roster sweep.
- Sim: the 6 pre-existing REDs stand (C5b's re-baseline); every C1 commit
  carried its ADR-132 verdict.

## C2 — the docs sweep (D1–D8)

Per-file commits. 02-systems (D1 §2.2 stored wheel + ADR-166 gate · D2
addenda re-titled BUILT-at-T0 · in-file D3 zone prose · D5 O-Nobu/Suzu +
adjacent Yagōemon→Mohei) · 03-unlock-ladder + 06-tech + 01-vision +
04-combat-balance (D3/D6: 16-zone roster, stored season in the state shape,
judge-rides-exit, tier enum 0..6, rice kura-only in the carried-wealth line,
ADR-118 'mechanism TBD' → shipped ADR-163) · fun-factor (D4: canon
antagonist ladder — T3 = the Lord Tomita campaign, Akagi cut; 28-day echoes)
· ui-design §5.11 · qa-playtesting (the goto() roster = the REAL 16 zones;
toRung documented as the teleport it is + its does-NOT-play-the-intro trap).
**HD-33 filed:** §1.5's rung table + §4.8's hand pacing table are pre-reboot
WHOLESALE — inside the frozen §1, so only the cited map tokens were fixed;
the table-level fix is the human's call (recommend single-sourcing at §5 /
the generated report). **Adjacent:** `qa-shots.mjs` is BROKEN since the
reboot (no Skills tab; a fresh drive never leaves the intro shell —
`planRungJump` teleports rungs but the intro stays live). Mechanical id
fixes landed; the real repair (an intro-drain drive) queued into C4. D8:
AGENTS.md now states the real gate-wall shape (vitest-dominated ~30–60 s;
the 5 s budget is aspirational).

## C3 — prd-drift hardened (D7) + RED-proof

RETIRED terms extended (satoyama · 28-day · akagi[→tomita] · oyuki[→o-nobu]
· okimi[→suzu] · o-sato[→o-hisa] · tokubei[→yohei]; shigemasa verified
already present); the scan WIDENED per the human ruling to fun-factor.md /
ui-design.md / qa-playtesting.md (presence stays PRD-only; decisions.md's
append-only history stays out of scope). The scan also went WHOLE-WORD —
plain includes() false-fired 'oyuki' inside every "Naoyuki". The widened
gate immediately caught residuals the hand sweep missed (§1.7's zone-table
satoyama rows + the §1 reveal list) — swept in the same commit
(re-voiced to the shipped woodlot vocabulary; the region label reads
"Wilderness & Mountains"). **RED-proof (isolated worktree at pre-C2
170280e, new gate copied in): 37 drift items** — the full D3 satoyama
cluster incl. 2 hits in qa-playtesting + 1 in ui-design + 2 in fun-factor
(exactly the widened class), the D1/D6 28-day cluster, D5's oyuki/okimi.
Gate CLEAN on the swept tree.

## C4.1 + C4.4 + C4.8 — the dark side-beats wired; night rounds voiced + grow

The scenes.md author NOTES carried the firing moments all along — transcribed,
never invented: sb-grove fires on a grove arrival R2–R4 (move_to); sb-crest at
the kura R4+ (move_to); sb-lease on the first season turn at R3+
(advance_season); sb-dog re-keyed to the REAL quest flag
(`quest_orchard_chain_done` — the authored `orchard-reclaimed` had no setter;
the narrative flag grammar widened to allow snake_case so triggers can name
engine flags); sb-dog-coda re-keyed scripted, enqueued by the night-round
begin on a NEW-MOON night with the dog fed (a bare flag trigger fired ahead
of its own fiction). BONUS dark beat the review missed: `count-resolve` (the
Count's chained second half) had no enqueuer — completing `count` now queues
it (the completion-effects glue). Durable guard: the C4.1 reachability sweep
in scenes.test.ts — scripted ids must appear at a literal enqueueScene call
site, flag triggers must name a flag a quest reward / scene option / setFlag
literal produces (all source-derived); it was RED mid-build the moment
sb-dog-coda went scripted before its enqueuer existed (the exact class).
C4.4: u3-B's staged native log lines (THE PICK; the "later chunk" HD-30
noted) migrated VERBATIM to FLAVOR nightRound* keys — the watch-post read on
begin, per-stage aftermaths (rats/marten), the wolf ENCOUNTER read on the
survive stage (the beat the code named and never emitted), the hooded-lantern
new-moon sighting (suppressed the round the dog-coda VN plays — one lantern
moment), the sickroom-wake fall read. `isNewMoon` selector added (±~1 day
window on the real ephemeris). C4.8: the post-climax `grain-watch` round
(rats + marten, NO wolf — it returns in T1, locked canon); the gate post
serves it once `wolf-survived-not-won` latches. C4.5 tail: the scene modules'
"STUB/DORMANT/empty registry" headers rewritten to the live truth. Sim: the
6 pre-existing REDs unchanged; report + fixtures regenerated.

## C4.2 + C4.3 — the cast speaks; the log breathes

C4.2 (taste Pass-1 brief: TST1 — reuse the deliverDialogue cursor + the log,
no new popup surface; TST2 — person rows patch in place, log appends; TST3 —
the lines are migrated §04-cast canon, gate/memory-aware; TST4 — nameplate +
voice colour carried, "Speak with X" → "Ask X more"): the new `talk_to`
intent delivers a vn person's next gate-satisfied u9-* line into the Story
log — ONE line per ask ("one teach per moment"), presence engine-checked
(peopleHere), exhausted/absent = clean no-op. O-Ume, Matsuzō, O-Yae, Toku,
Iori, Genemon, Kihei, Sōan, O-Hisa, Shinnosuke, Naoyuki become people, not
scenery (~40 authored lines now reachable). Guards in talk.test.ts (4 tests,
registry-derived, incl. every vn sceneId resolving to a real dialogue).
C4.3: `src/core/texture.ts` — the ambient emitter for the 40+ dark
season/weather/gossip lines: day boundary rolls a season/weather line
(TEXTURE_DAY_CHANCE), market days gossip first (TEXTURE_MARKET_CHANCE), the
season turn always announces the incoming season; all on the previously
UNUSED `worldgen` stream (no schema change, replays untouched — asserted);
lines are ephemeral (Now view, FB-53). Cadence = cockpit levers (ADR-132,
sim-owned). texture.test.ts: 6 tests (pools registry-derived, lever gates,
determinism + own-stream isolation, pre-wake silence). Sim: 6 pre-existing
REDs unchanged.

## C4.6 + C4.7 + C4.9 — one home for wrong-things; six-step grades; the legacy intro retired

C4.6: `FLAVOR.nodeXWrong` (15 authored lines, all dead) is now THE single
source: `MapNode.wrong` wires them into core; the play node card renders the
wrong line (new `.map-wrong` register, 怪 + muted shu); the survey-sheet's
private paraphrases (one even broke fiction voice with "has an authored
answer, revealed in a later tier") are replaced by the same FLAVOR refs.
Woodshed + night-rounds keep their local lines (no FLAVOR source authored —
nothing invented). C4.7: `Grade` widened to the LOCKED six-step ladder
(ADR-159 — FAIL·BAD·OK·GOOD·GREAT·EXCELLENT, worn as the classical
不可·劣·可·良·優·秀); ESTATE_BANDS gains bad/ok (80/160 — sim-owned
intermediates; the EXCELLENT=480 T0 gate untouched); cockpit + canon + CSS
rows follow; PRD §1.6 verified already six-step (no edit). Per-grade judge
LINE variety = C5a unit 4. C4.9: the legacy pre-reboot intro scenes (dream +
genemon) DELETED — intro.md's own comments confirmed take-a's fused soan
scene carries their threads (the r0-knot option IS the porter/dream fork);
INTRO_SCENE_ORDER → ['soan']; the intro is ONE scene. Tests re-anchored on
soan (the gate machinery now exercised on a constructed scene — no gated
topic ships); the cold-open fixture spec asks Sōan twice instead of
one-per-character; the render 'decision-only scene' test left with the
content that drove it. Sim: 6 pre-existing REDs unchanged.

## C4 DoD closed (+ the qa-shots harness lives again)

- **Headless proof captures** in `project/audit/screens/2026-07-10-closure-c4/`
  (git-ignored dir; this entry is the record): `c4-sb-crest-fires.png` — walking
  to the kura at R4 queues + auto-opens the sb-crest VN (and the regenerated R4
  fixture's own `scenesPlayed` = [r2-yard-hand, sb-lease, sb-bon,
  nengu-autumn-frame] proves the C4.1 wiring fires inside the REAL arc drive);
  `c4-talk-ohisa.png` — Speak with O-Hisa delivers her authored u9 line into the
  Story log ("The shoulder seam was going. It's done now…"); ambient texture —
  three authored gossip lines emitted across ~14 ticked days (matchmaker /
  lowland wages / Ganzō at the well).
- **qa-shots.mjs runs GREEN end-to-end for the first time since the reboot**
  (15 shots, zero console errors): the one-scene intro drains via two DOM
  clicks (02b/02c), skills shoot on the Character tab (R2), the map + a
  post-fight Character shot joined the gallery. `screens/latest/` refreshed.
- The sb-grove capture attempt surfaced a REAL fact, not a bug: the grove sits
  behind the conditioning danger ring, so the R2–R4 window beat requires a
  drilled MC — reachable, by design (the sim's t0-arc drives drills).

## C5b — the balance re-baseline

**Telemetry diary (step 0, the folder README's rule):** 24 reports read; 9
untainted, ALL v0.3.8/v0.3.9 (pre-rewrite) — none can bind the v0.4.0 build.
The one deep untainted run (20260626-1783420086, 49 attended min) covers R0
only: 6.2 attended vs 4.3 sim-greedy min, in band (~1.4× sim — the old
build's known slow-vs-sim lean). Conclusion: NO usable post-rewrite attended
data exists yet; the human's v0.4.x rung-by-rung QA will grow it.
**The idler soft-lock (5 seeds, R1) — ROOT-CAUSED + FIXED (sim-side, real
bugs not band fudges):** the rewrite added verbs the idler persona never
learned. Four repairs in `src/sim/personas.ts`: (1) it skipped
`begin_rung_beat` for BEATLESS rungs — the reducer promotes silent rungs
straight through, so a ready R1→R2 promotion sat forever while the auto-loop
ground haul_stores ×24k; (2) the manual wheel (ADR-153) made `advance_season`
a survival verb — a dry (site, season) pool yields nothing, and the idler cut
wood 27k times against a dead pool; it now ends the season when its labour
farms a dead pool (rung-guarded like the vitals gate); (3) the ADR-166
refusing gate queues the nengu VN — the idler gained autoplay's (a0) scene
drain (it looped 59k no-op advance_seasons against the refused Autumn exit);
(4) the R3 wolf lives inside the night round — the idler now posts the watch
once the countable work is done, with the focused driver's prep (cook/forage
mend, rest to 90%, sound blade). **Verdict after:** idler fullLadder=TRUE on
all 5 seeds (was R1 soft-lock); Phase-2 ratio [4.04–4.86] vs [0.8,1.2] and
idler-ascension remain RED — genuinely design-gated, filed as **HD-34** with
the evidence (incl. the B8 measurement note: the greedy sim already exploits
the free pool refill and the per-rung bands still hold). t0-pacing.md
regenerated + committed.

## C5a (part 1) — the fiction wave: overlays · discoveries · judge lines

The ADR-139 flow ran as a 54-agent workflow (27 blind takes × 27 taste-Pass-2
judges; raw snapshot `project/brainstorms/raw/2026-07-10-c5a-fiction-wave.json`).
Pass-1 constraint brief bound all takes (§0.5 + the four values + length
discipline). **Unit 1 (five season overlays): TAKE C picked** ("the land
first"; 18✔2✘ — best craft by a wide margin); Pass-2 redlines applied
(one stacked spring ornament trimmed; the 5/5 season-handoff closing template
broken by deletion in 3 scenes). Lands as `turn-*` scene-defs (season-exit
triggers, once, narration-only) — engine cost zero. **Unit 2 (the three
discoveries): TAKE A** ("found by hand"; 11✔1✘; the settFound rope-maxim
cut). Registry: `disc-weir-bundle` (reveals the new `search_reeds` verb),
`disc-woodlot-sluice` (reveals `clear_sluice`), `disc-margins-sett` —
SEED-ONLY (DiscoveryDef.reveals went optional; the payoff is T2's). Two new
activities with sim-owned modest magnitudes. **Unit 4 (judge lines): TAKE C**
("as the valley sees it") over the tied take B on TST3 — koku standing IS
outside regard; the counted-twice canon echo redlined one-word. Wired: the
per-grade `judgeLine(grade)` in flavor.ts with `__setJudgeFlavorOverride`
(the declaring-module pattern), emitted by step.ts onReckoning; the DEV
switcher forwards flavor takes to it (live-swap ✓); the legacy
season.reckoned template kept for persisted entries. Alternates live in
`takes/c5a-{overlays,discoveries,judge}/` (4 open bundles compile). Tests
re-derived (the ascension judge-line assertion; the lacquer-path hint check
now that the woodlot holds a second secret).

## C5a (part 2) — the per-season node reads land; HR-18…HR-21 filed

**Unit 5 (16 zones × 6 seasons, per-season units per the human's ruling):**
picks Winter A (work-first 14✔2✘) · New Year B (senses 12✔4✘) · Spring B
(senses 14✔2✘) · Summer A (work 11✔5✘) · Bon B (senses 12✔4✘) · Autumn B
(senses 11✔5✘). All 22 Pass-2 flagged units redlined before landing — the
systemic finding was anchor-span duplication (the canon base blurb's signature
clauses re-typed inside seasonal variants; "This is where they pulled you
out." appeared in four seasons' weir reads and now appears in none — the base
blurb owns it). Engine: `MapNode.blurbStem` + `nodeSeasonalBlurb(node,
season)` (map.ts) — the you-are-here card (render, DEV-swappable by key) and
the arrival line (move_to) read the season's variant; the survey SHEET stays
static (a drawn document does not change with the weather). The key contract
is gated: map.test walks all 16 stems × 6 seasons (RED on a missing/typo'd
key, and the variant must differ from the static line). Alternates in six
`takes/c5a-nodes-<season>/` bundles (10 open bundles compile). Tests
re-derived (arrival-line + flavor-card assertions read nodeSeasonalBlurb).
**HR-18…HR-21 filed** (review.md): overlays · discoveries · judge lines ·
the six node-season bundles — each with the live DEV-switcher review path
(ADR-143), per-take scorecards, and pick rationales. NOTE: `verify:balance`
now runs ~17 min — the repaired idler plays to the 1M-intent guard on every
seed (the HD-34 expectation question); the report regen rides the next
commit.

## CLOSED — the plan is DONE

The review report carries the closing addendum (finding → fixing commit);
the plan flipped ✅ DONE and archived to `project/archive/`; the snapshot
resume block now points at T2 rungs/fog + the inbox as the frontier.
**Waiting on the human:** HR-1 (the big fun/pacing pass) · HR-18…HR-21 (the
C5a picks, live in DEV → Story) · HD-33 (the frozen §1's pre-reboot tables)
· HD-34 (the three balance design calls). The one-line truth this session
bought: *"the shipped T0 plays the bible canon"* — with no known asterisks
beyond that human-gated queue.

## Post-close e2e red → fixed (the fixture VN-drain)

CI e2e went red on the final push: the C5a-regenerated fixture drives walk
THROUGH the kura at R4+, queuing sb-crest (C4.1's arrival wiring, working as
designed) — and a fixture booting with a queued scene hands the VN the whole
surface (nav invisible → tap timeouts on ALL projects). `buildFixtureState`
now drains pending/live scenes after the drive (a fixture is a START-STATE);
the full e2e lane is 82/82 locally — INCLUDING the two mobile-webkit journeys
specs earlier bisected as a local quirk (the queued-scene geometry was a
component of that too).

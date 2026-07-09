# Storywave closure — finish the rewrite cleanly

**Status: IN-PROGRESS (2026-07-09, session 134) — the human read the plan
and ruled every surfaced fork via AskUserQuestion (see
`project/feedback-human/2026-07-09-storywave-closure-rulings.md`): HD-31 →
the REFUSING gate (ADR-166, reverses this plan's default) · HD-32 → the
FULL fiction wave now incl. unit 5 at per-season units (ADR-167) · routing
→ Fable executes C0–C5 in one session · C3 → the prd-drift scan set WIDENS
to the living docs. Executing autonomously end-to-end; adjacent misses the
plan didn't catch are in scope (human grant).**
**Confidence: ( 80% Opus, 20% Fable )** — the fix work is mechanical or
engine-shaped against a written findings list (Opus); only the C5a prose wave
(fiction authoring) and any C4 taste-adjacent depth work concentrate
Fable-grade judgment.

The follow-up to the four-agent post-ship review
(`project/audit/reports/2026-07-09-storywave-post-ship-review.md` — READ IT
FIRST; every finding id below (B1–B8, D1–D8) resolves there with file:line
evidence). Goal: close every defect and recorded divergence the storywave
ship left behind, so the bible → build claim ("the shipped T0 plays the
bible canon") is true without asterisks.

## Who builds this — Fable or Opus?

> **RULED — 2026-07-09 (closure-rulings #3): Fable executes the whole plan
> in one session.** The routing below stands as the record of what the
> plan proposed.

- **C0–C3 · Opus.** Transcription-grade fixes against a verified findings
  list: name-syncs, an engine fold that reuses existing constants, doc sweeps
  to shipped reality, test authoring to stated invariants, gate hardening.
  No taste calls; every fork is pre-surfaced as an HD-item with a default.
- **C4 · route per finding** when the spirit-pass reports land — mechanical
  wiring gaps go Opus; anything needing NEW fiction or a depth/taste judgment
  goes Fable (+ the human where canon moves).
- **C5a · Fable + human.** A prose mini-wave is fiction authoring under
  ADR-139 (the ADR-162 one-version exception was wave-scoped and is spent).
- **C5b · Opus.** Balance re-baseline is sim-owned mechanics (ADR-132);
  the agent transcribes machine verdicts, never feel-tunes (ADR-134).

## Context a fresh executor needs (read in order)

1. The review report (above) — the findings ARE the spec; verify each
   against the tree before fixing (PH2: line refs may drift).
2. `docs/story-bible/tiers/t0.md` + `05-world.md` + `01-laws.md` §0.5 —
   the canon the fixes serve. **Never edit `docs/story-bible/**`** (ADR-150);
   a canon problem is an HD-item.
3. The archived storywave plans (`project/archive/fable-2026-07-07-storywave-{game,docs}.md`)
   — only for the cited specs (ADR-164 bleed, G1 calendar, A5 scope).
4. `docs/guides/qa-playtesting.md` §2 (ADR-132 balance flow) — binds C1.2
   and C5b. Step 0: `project/telemetry/` (24 unread reports at authoring).
5. Conventions: shared-tree pathspec-only commits; `SKIP_CODE_VERIFY=1` for
   docs-only commits; full `pnpm run verify` at every code commit; journal +
   snapshot per session; `Assisted-by:` trailer with the ACTUAL model id.

## Sequencing

C0 → C1 → C2 → C3 land in order (C2/C3 are ordered: sweep the docs BEFORE
hardening the gate, and prove the gate RED against the pre-sweep tree).
C4 inserts after C1 once its findings are triaged (same executor or a
follow-on session). C5a/C5b are independent tails — human-gated and
sim-gated respectively — and may run parallel to C2–C4 in a separate
session. Each phase is a checkpoint (commit → journal → snapshot →
push → confirm clean).

---

## C0 · Pre-flight + surface the design forks (½ sitting)

1. Re-verify every C1/C2 finding against the current tree (PH2) — the
   review's line refs were taken 2026-07-09; locate by quoted text if
   drifted. Anything already fixed: strike it in the working copy of this
   plan, note in the journal.
2. **File HD-31 — the Autumn exit-gate semantics fork** in
   `project/human-in-the-loop/decisions.md`:
   - Context: the G1 spec said a gated season exit is REFUSED until its
     predicate holds (Autumn: the nengu scene sets `nengu-reckoned`); the
     build auto-reckons the nengu *inside* every Autumn exit
     (`step.ts:72-93`) and no exit is ever refused. Functionally sound —
     R7 still gates on the flag — and shipped in v0.4.0.
   - Options: ~~**(a) keep the as-built auto-reckon**~~ · (b) implement
     the refusing gate per the G1 spec.
   - **RULED (b) — 2026-07-09, ADR-166** (never sat open): refusal +
     scene-completion reckoning + annual re-arm; `season.test.ts` asserts
     the refusing semantics. C1.4 implements it.
3. **File HD-32 — the five missing season VN overlays** (see C5a for the
   full ask). **RULED — 2026-07-09, ADR-167** (never sat open): the FULL
   wave ships now, incl. unit 5 at per-season diverge units.

**DoD:** both HD-items filed with defaults; findings re-verified; label set.
Docs-only commit (pathspec: `project/human-in-the-loop/decisions.md` +
journal + snapshot).

## C1 · Build fixes (src/) — one sitting, one commit per numbered step

**C1.1 · B1 — O-Sato → O-Hisa (mechanical name-sync).**
`src/ui/map-sheets/nodes.ts:122,133,491,508` (`who:` arrays; two T0 nodes,
two T1). Diverge-exempt per the storywave plan's own §S note (bible-name
drift in `nodes.ts` content strings). The `who:` panel is side-panel text,
not sheet geometry — no pin regen; do NOT touch the drawn sheet. Grep the
file for any fifth occurrence. Extend the retired-names grep list used by
future sweeps (see C3) with `O-Sato`.
**Test:** add the token to the roster↔layout integrity test's retired-name
list if it has one; else a one-line assertion in the map-sheets test that
no `T0_NODES`/`T1_NODES` `who:` entry matches a RETIRED_NAMES list derived
from `names.ts` history (RED today, GREEN after the fix — note the RED run
in the commit body).

**C1.2 · B2 — fold the ADR-164 carried-loss bleed into night-round fall.**
`src/core/night-rounds.ts:97-99` currently: `setHp(SETBACK_HP)` →
`applyDefeatConsequences` (days + `soanLedger`) only. The grind-fight loss
(`src/core/fight.ts:166-179`) additionally bleeds carried coin + materials
via `LOSS_COIN_FRAC`/`LOSS_MATERIAL_FRAC`.
- Extract the bleed into a shared helper in `src/core/defeat.ts` (the
  module that already owns `applyDefeatConsequences`) and call it from BOTH
  loss paths — one home (TST1), no copied fractions. While there, delete the
  dead `lostRice` read + stale comment (`fight.ts:171`, B5) — rice is
  kura-only and cannot bleed by construction; keep the invariant test.
- Magnitudes unchanged (same fractions) — but this is a defeat-economy
  mechanism change, so run the ADR-132 flow: step 0 read
  `project/telemetry/` (quote attended-vs-sim for any touched rung in the
  commit body if untainted reports exist), then `pnpm run verify:balance`
  → `pnpm run balance:report`; commit `docs/content/t0-pacing.md` with the
  change iff it moved, `balance-sim --summary` in the commit body.
**Test (B3, same commit):** rewrite the coin-freedom + bleed assertions in
`src/core/night-rounds.test.ts` to sweep the REAL `NIGHT_ROUNDS` registry
(every stage of every round: rewards carry no coin; a losable stage's fall
applies the same bleed the fight path applies — derive from
`LOSS_COIN_FRAC`, never copied fractions). Fix the stale "ships EMPTY at
G2" header. The registry sweep is the durable guard — a future coin reward
or bleed regression REDs.

**C1.3 · B4 — the dead autoplay branch.** `src/core/autoplay.ts:405` reads
`s.resources.rice` (never written post-G4). Decide by reading the
surrounding Phase-2 intent ladder: either re-point to the kura
(`s.banked.rice >= PHASE2_SELL_RICE_AT` — if the Phase-2 steward SHOULD
sell surplus) or delete the branch (if the `earnCoin` path at `:219`
already covers the need). Whichever way, `pacing`/`playcheck` gates decide:
if bands move, re-baseline per ADR-132 with the verdict in the commit.

**C1.4 · B7 — `season.test.ts` + the reducer guard.**
- **C `src/core/season.test.ts`** (the plan-named suite, finally): wheel
  order derived from `SEASONS` itself (never string literals); one
  `advance_season` runs the full exit pipeline exactly once
  (judge → nengu-if-Autumn → spoilage → exit-scene enqueue → turn +
  `seasonsPassed++` + pool refill — assert order where observable);
  Autumn exit auto-reckons `nengu-reckoned` (the HD-31 as-built semantics;
  flip this block if (b) rules); pools refill on turn; `seasonsPassed`
  monotonic. Consolidate: point the scattered coverage notes in
  `m1.test.ts:424`/`economy.test.ts:698`/`pillars.test.ts:121` at the new
  suite where they duplicate (delete only true duplicates — every kept
  test must still be RED-able on its own lever).
- **Reducer guard:** `advance_season` (`intents.ts:1083-1088`) refuses
  when `introActive` or `activeScene` is set (matches `begin_rung_beat`'s
  existing guard pattern) and before the `readout-seasons` surface unlock
  (R2) — the R2 rule becomes engine law, not render law. **Risk:** the
  autoplay/sim fires `advance_season` (`autoplay.ts:328,411`) — confirm it
  only fires post-R2 with no scene active (t0-arc drives the real reducer,
  so a violation REDs loudly); if pacing bands shift, ADR-132 verdict.
- **B6 (same commit):** `fight` reducer (`intents.ts:680-685`) rejects a
  `nightRoundOnly` foe outside a night round — the "wolf is survived,
  never won" invariant becomes engine law. Add the registry-derived
  assertion to `invariants.test.ts` (every `nightRoundOnly` foe is
  un-fightable via the day `fight` intent).

**C1.5 · B5 remnants + combat-rework debt.**
- `src/app/main.ts:118-119` — delete the stale "INTERIM placeholder"
  comment block (the real HD-30 prose ships at `:124`).
- `src/core/combat-rework.test.ts` — delete the 3 `it.skip` dead tests
  (295, 343, 349 — retired roster; git history is the archive); resolve
  the ~9 `TODO(g4-tests)` inline patches by rewriting each assertion
  against the new-arc fixture it actually drives (derived values, no
  string-swapped literals).
- The `+0 coin` win-line wart (`:60`): combat is materials-only, so the
  win log line should not render a zero-coin token. This is a log-string
  change in `render.ts`/the combat log formatter — one-line, prose-law
  compliant (mechanical copy, no new fiction). Update the test to assert
  the coin token is ABSENT on a coinless win (RED-able both ways).

**C1 DoD:** full `pnpm run verify` green at every commit; the B1 name gone
player-visibly (screenshot the woodshed/kitchen "Who's there" panel via the
capture harness for the journal); night-round fall costs ≥ a day-fight loss
in like state (sim evidence in the commit body); `season.test.ts` exists
and its guard/refusal cases could each go RED; zero `it.skip` in
combat-rework; e2e lane (`pnpm run test:e2e`) green if any touched surface
renders differently.

## C2 · Docs — actually finish A5 (one docs sitting)

Sweep order is per-file (one commit per file or tight group), each
`SKIP_CODE_VERIFY=1` + pathspec. The bible + the BUILD are the sources;
where they name a fact, transcribe — never author new design prose.

1. **D1 — `docs/living/prd/02-systems.md` §2.2** (~L97–139): the "as the
   BUILT game ships it" paragraph flips to the six-season stored manual
   wheel (transcribe from ADR-153 + `constants.ts:68`/`selectors.ts:126`);
   the 28-day derived-clock text moves to one "previously" sentence or
   goes entirely. Sweep the §2.2 echoes at `:154,967` in the same pass.
2. **D2 — `02-systems.md:1297` addenda block**: retitle/rescope — the T0
   halves of economy (ADR-158/163), defeat-sickroom (ADR-155/164), night
   rounds (ADR-156) and the speaker ladder (ADR-157) are BUILT (point at
   the code + §5.6's shipped note); only the genuinely-unbuilt halves stay
   forward-spec (T2 map re-label, T2+ rep tracks, T2/T3 alternation lock),
   each with an honest banner naming its build tier.
3. **D3 — the satoyama/7-node map cluster**: rewrite to the shipped
   16-zone estate map (`areas.ts` is the roster): `02-systems.md:339,362,
   371,374,620,673-674` · `03-unlock-ladder.md:266,437` ·
   `06-tech-architecture.md:268,398` ("7 NODES over 6 AreaDefs" → the real
   shape) · `01-vision.md:305` · `04-combat-balance.md:477,1507` (also the
   28-day echoes) · `docs/living/ui-design.md:252` ·
   `docs/guides/qa-playtesting.md:96,111` — the `goto()` roster lists the
   REAL zone vocabulary (spot-check each named node against
   `map.ts`/`__qa` before writing it). Keep the four gen-region marker
   pairs byte-intact; run `pnpm run gen:prd-regions -- --check` per commit.
4. **D4 — `docs/living/fun-factor.md:378`**: the §T3 antagonist line
   rewrites to the canon ladder (the debt → Lord Tomita/the campaign →
   the inherited domain → the house's Edo ladder); sweep the `:139,290`
   28-day echoes.
5. **D5 — `02-systems.md:1040`**: Oyuki → O-Nobu, Okimi → Suzu.
6. **D6 — `06-tech-architecture.md:288`**: drop the dangling "FORWARD SPEC
   above" pointer + the "until the storywave game plan lands" clause;
   state the shipped truth (enum target 0..6 per ADR-152; T0 reachable
   today). `roadmap.md:158` stays untouched (frozen shipped-milestone
   history — append-only law).
7. **D8 — `AGENTS.md` gate-budget prose**: fix the "comfortably under the
   soft 5s drift budget" clause to the real shape (read
   `src/scripts/gates.ts` + `verify:budget` first and state what the
   budget actually measures — likely per-gate/non-vitest budget vs the
   ~60s vitest wall; PH2, don't guess).

**C2 DoD:** every D-item's quoted stale line gone; `pnpm run prd:drift`
clean; `gen:prd-regions --check` green; the docs claim nothing unbuilt as
built and nothing built as unbuilt (re-read each edited section whole —
not just the changed line — before committing it).

## C3 · Gate hardening — make the A5 class of miss RED (½ sitting)

**D7 — extend `src/scripts/prd-drift.ts` RETIRED terms** with:
`satoyama` · `28-day` · `Akagi` · `Oyuki` · `Okimi` · `O-Sato` ·
`Shigemasa` (verify it's already there) · `Tokubei`. Rules of the file
govern (documented-rename allowances for §5.6-style ledger lines).
- **RED-proof (PH3):** before C2 lands — or against a pre-C2 worktree
  commit if C2 already merged (`ci-red-proof` memory: isolated worktree,
  never the shared tree's branch) — run the extended gate and record it
  catching the D3/D4/D5 lines. A gate that never went RED proves nothing;
  paste the RED output in the commit body.
- Scope check: `prd-drift` scans `docs/living/prd/*.md` only — confirm the
  terms won't cry wolf on decisions.md history (out of scope) or the §5.6
  rename ledger (allowance rows). If `fun-factor.md`/`ui-design.md`/
  `qa-playtesting.md` are OUT of its scan set, say so in the commit body
  ~~and leave them to the norm — do NOT widen the gate's file set in this
  plan (a scope widening is its own fork; surface it as a one-line HD
  option instead).~~ **RULED — 2026-07-09 (closure-rulings #4): WIDEN the
  scan set to `fun-factor.md` / `ui-design.md` / `qa-playtesting.md`, with
  allowance rows so it never cries wolf.**

**C3 DoD:** gate green on the swept tree; RED-proof recorded; verify green.

## C4 · Spirit-pass fixes — switch the written world on (1–2 sittings)

From the two depth reports (session 133, appended to the review report).
Their verdict: the R0→R7 spine is rich, on-bible, and reachable — real
craft, not a facade — but the AMBIENT half of the bible's T0 (side-beats,
cast dialogue, log texture, discoveries) is largely *authored and dark*:
written content no code path delivers. C4 wires it up. **Three agent
claims were corrected by direct verification — trust these, not the raw
reports:** (1) `NIGHT_ROUNDS` holds ONE round (`first-night-round`,
3 stages) — earlier "7 rounds" claims counted stage/ids; (2) the pillar
`Grade` ladder is 4-step (`pillars.ts:26`) vs ADR-159's locked six-step —
a real build divergence (the PRD §1.6 already speaks six-step: the docs
are AHEAD of the build here, the inverse of A5); (3) the You:→Nameless:
label flip WORKS (`intents.ts:411` latches `label-nameless` from the
`soan` scene) — the spirit report's worry was wrong.

**C4.1 · Wire the four dark side-beats (Opus).** `scenes.md` authors five
side-beats; only `sb-bon` (season-exit trigger) can fire. `sb-grove`,
`sb-lease`, `sb-crest` are `trigger: scripted` with NO enqueue site
(the only scripted enqueues are `count` + `r7-dream`, `intents.ts:303-304`);
the `sb-dog` chain gates on `flag orchard-reclaimed`, which no reducer
sets (the orchard quest sets `quest_orchard_chain_done`).
- Derive each beat's firing moment from `tiers/t0.md`'s side-beat roster
  (the sheet is the spec); re-key `scripted` to real triggers
  (`rung`/`flag`/`verb`) or add the missing enqueue/`setFlag` call sites.
  The dog chain: latch `orchard-reclaimed` where the orchard reclamation
  actually completes (read `estate.ts`/the quest chain and pick the site
  the fiction means). Where t0.md is silent on timing, that beat's trigger
  is a fork → HD-item with a default; never invent a moment.
- **Test (the durable guard):** a reachability sweep in
  `src/core/scenes.test.ts` — every `SCENES` entry's trigger is live:
  non-`scripted` kinds fire from engine data; every `scripted` id appears
  in a known-enqueuer list derived from the code (RED when someone ships
  an authored scene with no path to the player — exactly this class).

**C4.2 · Make the cast conversable (Opus; taste Pass-1 brief first).**
~40 authored dialogue lines (`dialogue.md` u9-*) are placed on people via
`sceneId` but the talk affordance never dispatches it
(`render.ts:5007` only toggles `openPersonId`; `people.ts:14` admits
"a later chunk"). Wire `vn`-depth talk to `begin_scene(sceneId)` through
the one VN modal (TST1). O-Ume, Matsuzō, O-Yae, Toku, Iori (already
correctly season-placed) become people, not scenery. Reshape of an
existing surface — no diverge; run the FB-10 Pass-1 brief + Pass-2
scorecard.

**C4.3 · The ambient log-texture emitter (Opus; cadence sim-owned).**
40+ authored `season*/weather*/gossip*` keys (`flavor.md:238-375`) have
ZERO consumers — the bible §0.5 "flavor in the log" half is silent. Build
a small emitter: roll a texture line on day-boundary / season-turn /
market-day through the seeded RNG (its own named stream), cadence
constants in `balance.ts` (cockpit lever; magnitudes sim-owned, ADR-132).
Law check: texture goes to the LOG, never the VN.

**C4.4 · The wolf-flees / new-moon beat (Opus wiring; fiction gated).**
`night-rounds.ts:77` names the beat then returns without a line. Search
`t0v2/flavor` + the HD-30 wave for a source line; if one exists, emit it
on the `survive` stage (+ the hooded-lantern line on new-moon rounds via
`lunarPhase()`); if none exists, it joins HD-32's fiction ask — the stage
stays silent rather than shipping invented prose (§0.5).

**C4.5 · Stale-comment sweep (Opus, trivial).** Rewrite the lying
"DORMANT / empty at G2" headers to the live truth: `night-rounds.ts:10-11`,
`content/scenes.ts:13,50-52`, `intents.ts:1096,1123` (+ the C1.5 items).
Zero behavior change; commit with C1.5 if convenient.

**C4.6 · Wrong-things get one home (Opus; TST1).** 16 authored
`nodeXWrong` keys in `flavor.md` are dead; the survey-sheet modal renders
its OWN private copy (`map-sheets/nodes.ts` via `sheet.ts:370`); the play
node card (`render.ts:5088`) shows neither. Make `FLAVOR.nodeXWrong` the
single source: render it on the play node card AND feed the sheet modal
from it; delete the map-sheets duplicate strings. (A data-source swap
inside `map-sheets/`, not geometry — note it under the map-sheets skill's
edit lens; no pin regen.)

**C4.7 · The grade ladder honors ADR-159 (Opus; lines gated).** Widen
`Grade` (`pillars.ts:26`) from 4-step to the locked six-step
FAIL·BAD·OK·GOOD·GREAT·EXCELLENT (F·D·B·A·A+·S). T0's gate stays "top
grade = EXCELLENT" (unchanged); intermediate thresholds are sim-owned
(ADR-132 verdict with the commit); tests re-derive from the `Grade` source.
The day-book judge currently ships ONE grade line (`log-content.ts:22`) —
per-grade line VARIETY is fiction → HD-32. PRD §1.6 needs no edit (it
already speaks six-step — verify, don't re-write).

**C4.8 · Night rounds grow (Opus; sim-verdicted).** One round exists;
the bible + G2 spec promise pre-R3 → R3 → post-R3 repeatable escalations.
Add the post-R3 escalation round(s) with stage rosters derived from
t0.md's "Combat structure & enemies" ladder and the existing foe registry
(no new fiction needed if stage narration reuses authored flavor; any new
line → HD-32). Difficulty/rewards ride `verify:balance` (ADR-132).

**C4.9 · Retire the legacy intro scaffolding (Opus, migration
completion).** Two pre-reboot intro scenes (`dream`, `genemon` —
`intro.md:140,179`) still ship inside `INTRO_SCENE_ORDER` as off-bible
filler. Verify against `t0v2/u0`'s VERDICT chain: if the pick's intro
chain excludes them, delete them and reshape the order to the pick
(the G4.1 reshape, finished); if the VERDICT is ambiguous about the
chain, HD-item — never guess canon.

**C4 DoD:** every authored-but-dark element either reaches the player or
is explicitly HD/HR-queued; the C4.1 reachability test is green AND was
seen RED against the pre-fix tree (paste in the commit body); a headless
playthrough capture (capture-game-states) showing one side-beat firing,
one cast conversation, and one ambient log line lands in
`project/audit/screens/` and is cited in the journal; full verify green;
e2e green.

## C5 · The human-gated + sim-gated tails

**C5a · The supplemental fiction wave (HD-32 — Fable + human).**
The consolidated ask, expanded by the spirit pass. Units, in priority
order (each under ADR-139 3-take diverge law — the ADR-162 one-version
exception was wave-scoped and does not extend — judge VERDICT per unit,
live DEV Story-switcher review per ADR-143, human sign-off via HR-item):
1. **The five season VN overlays** — `05-world.md` locks a per-season
   overlay on the manual season change; the build ships Autumn (nengu) +
   the Bon side-beat only; `scenes.md:23-24` records the other five as
   DEFERRED for lack of source takes. Engine cost zero (the `season-exit`
   trigger + gen unit exist).
2. **The three named hidden discoveries** — weir-reeds bundle (the
   water-ruined paper: a MYSTERY SEED, not just an activity), the silted
   woodlot sluice, the sett under the ruined wall (`tiers/t0.md`; only an
   off-list lacquer entry exists today, `discoveries.ts:60`). Short
   discovery fiction + ADR-146 hint lines; registry wiring is mechanical
   and rides the same commit.
3. **The wolf-flees / new-moon crossing line** — if C4.4's source search
   comes up empty.
4. **Per-grade day-book judge lines** — variety for C4.7's six-step
   ladder (today: one string, `log-content.ts:22`).
5. **Per-season node flavor** — `map.ts` blurbs are static; the bible
   wants nodes to breathe by season. LARGE (≈15 nodes × 6 seasons): the
   human scopes which slice ships now vs riding the T1 wave — present
   the size honestly in the HD-item, don't default to "all".
~~Options on the HD-item: (a) run units 1–4 now, scope 5 (recommended —
they are the shipped game's visible canon gaps) · (b) defer the whole
wave to T1 (the gaps persist through the human's rung-by-rung v0.4.x QA).~~
**RULED — 2026-07-09, ADR-167: everything now, units 1–5; unit 5 at
per-season diverge units (6 units × 3 takes, each take one season's
atmosphere across all ~15 nodes).**

**C5b · The owed balance re-baseline (Opus, ADR-132).**
- Step 0: read ALL unread `project/telemetry/` reports (24 at authoring);
  distill pacing conclusions into a committed note per the folder README's
  diary rule (attended-vs-sim per rung).
- Re-run `verify:balance` + `balance:report`; reconcile the bands against
  real-play data; regenerate + commit `docs/content/t0-pacing.md`.
- **B8 in scope here:** the zero-cost season-turn pool refill — measure in
  the sim whether early-game wheel-spinning beats intended pacing; if it
  does, the MECHANISM options (a refill lag, a turn cost, spoilage
  scaling) are a design fork → HD-item with the sim evidence attached;
  magnitudes stay sim-owned either way.

## Definition of done (the whole plan)

- Every B-finding fixed or explicitly ruled (HD-31), every D-finding
  swept, C3's gate provably RED-able, C4 filled and executed (or its
  items ruled/queued), HD-32 ruled and — if (a) — the overlay wave
  shipped through its HR-item, C5b's re-baseline committed with verdicts.
- The review report gets a closing addendum mapping finding → fixing
  commit; this plan's Status flips DONE and it archives to
  `project/archive/`.
- The one-line truth this buys: *"the shipped T0 plays the bible canon"*
  holds with no known asterisks beyond human-gated HR queue items.

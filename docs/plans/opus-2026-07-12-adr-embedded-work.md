# Drain the work embedded in the ADR log into a real queue

**Status:** 📋 PROPOSED (2026-07-12, session-184 · every HIGH/MEDIUM claim
re-verified against `src/` 2026-07-13 — all hold; line refs corrected)
**Confidence:** ( 80% Opus, 20% Fable ) — mechanical build + doc-truth work; the
one fiction-voiced item (the sickroom mend beat) is Fable's.
**Template:** build

## Who builds this — Fable or Opus?

**Opus for everything except S3's prose.** The work is engine plumbing (an HP-mend
lane, an economy cap, a save-integrity fix), doc-truth reconciliation, and queue
hygiene — judgment sits in *reading the code honestly*, not in taste. The single
exception is the **sickroom treatment / rest beat's fiction** (S3): a treatment
action needs a diegetic line, which is fiction-voiced text → **ADR-139 3-take
diverge, Fable-routed**, per the standing law.

## Why

The human's read (2026-07-12): *"I'm worried other agents used decisions.md as a
TODO list or TASK list or ROADMAP or alternative to writing concrete plans."*

He is right, and this is the **undeclared twin** of the failure the brand-new
`deferred-work` gate was built for. That gate (`src/scripts/verify-deferred-work.ts`,
landed as the 19th gate, `8f50a09f`) catches the **shouted** case — a capitalised `NOT BUILT` in
canon that names no home. Its own header concedes the rest:

> "The UNdeclared case — work that lives only in a journal's 'next steps' and is
> never shouted anywhere — is not mechanically detectable."

That undeclared case is **exactly what this plan drains**. A full read of all 3,709
lines of `decisions.md` (ADR-001 → ADR-187) found build work buried in **Consequences**
bullets, in `- **BUILD TODO (v0.3.2)**` lines, in "Future work:", "Known limit.",
"Deferred:", and "Follow-up (not in scope)" — none of it shouted, none of it in
`docs/plans/`, and therefore none of it startable. It vanished into the commit log
exactly as the human predicted.

The finding that matters most: **the ADR log is not merely a queue, it is in places
an inaccurate one.** Four ADRs carry loud `BUILD TODO` markers for work that was
*silently completed* (ADR-098/100/101/102), while three ADRs marked ✅ describe
mechanisms that **do not exist in the code** (ADR-068's audio, ADR-164's HP-mend
lane, ADR-184's sited cooking). Reading the log to find work therefore misleads in
*both* directions — which is why the answer is a plan, not a better-annotated ADR log.

## What exists today

**Survey date: 2026-07-12 (session-184); re-verified 2026-07-13.** Every
verdict below was checked against `src/` by five parallel read-only agents
(PH2 — the build is the territory; the ADR is a claim to verify), then every
HIGH and MEDIUM claim was independently re-checked the next day. All hold;
the re-check corrected four drifted line refs (noted in place).

### 🔴 HIGH CONFIDENCE — real work, not built, no home

| # | Source | The gap (source-verified) |
|---|---|---|
| H1 | **ADR-164** (human-ruled, 2026-07-08) | **The HP-mend lane was never built.** ADR-164 locked: HP has *no* auto-trickle; it mends via a **paid treatment action** at the sickroom, or a free manual **"rest at sickroom"** trickle — and *"food stays satiety-only"*. Neither verb exists: no `treat`/sickroom intent in the `Intent` union (`src/core/intents.ts`), no sickroom entry in `activities.ts`. The **only** HP mend in the game is `cook_meal` (`intents.ts:920-922`, `COOK_HP_RESTORE`) — i.e. food *is* the healer, precisely what the ADR retired. Worse, the code contradicts *itself*: `defeat.ts:7-8` and `fight.ts:190` assert the ADR-164 model as if it shipped, while `combat.ts:140` says *"the only mend is eating (cook)"*. **How it was lost:** the verbs *had* a home — ADR-164's consequences assigned them to the storywave plan's "G4 sickroom content" chunk — but that plan shipped its other chunks and was archived 2026-07-09 with these verbs unbuilt. Archiving a plan can orphan its sub-items; that's the mechanism this whole sweep exists to catch. |
| H2 | **ADR-163** §5 (human-ruled) | **Yohei's purse is not finite per visit.** The ADR relies on a finite purse as a soft cap. `intents.ts:986` clamps each **transaction** to `YOHEI_PURSE_MON`, and no `GameState` field tracks purse spend — so repeated `sell_rice` calls on the same market day each draw a *fresh* 120-mon purse. The cap does not hold; this is an unbounded coin faucet. |
| H3 | **ADR-163** §2/§6 (human-ruled) | **The withdraw verb still exists and is wired**, against *"rice is never pocketed"* + *"one-way barn-filling at T0, no withdrawal verb"*. `intents.ts:1267-1287` `case 'withdraw'` is resource-generic and moves `banked.rice` into carried `resources.rice`; `render.ts:5396` binds a live button. `render.ts:5410-5412` **admits it**: *"the deposit/withdraw rice rows are vestigial under the one-way barn-filling model; the full render sweep retires them in a later chunk."* That chunk never came. |
| H4 | **ADR-186** "Known limit" | **A live save-integrity bug with a named fix and no home.** `greeting.<i>` / `stage.<i>` log descriptors are **positional, not id-keyed** (`log-render.ts:80` + `:122` — two resolvers match `/^greeting\.(\d+)$/`). Re-ordering a scene's greeting lines in the narrative `.md` silently re-points an old save's log line to its neighbour — and the orphaned-id sensor **cannot see it** (the index still resolves). The ADR names the fix: *"Giving greeting lines authored ids would close it."* |
| H5 | **ADR-068** ✅ vs the build | **The game ships silent, and the reversal is un-ADR'd.** The Web Audio SFX engine is fully built and tested (`src/ui/sfx.ts`, 215 lines — taiko/shamisen/suzu; `sfx.test.ts`), wired at four call sites — then **globally muted at mount**: `render.ts:520-524`, *"Sound removed for now (human call, 2026-07-07 — the synth cues read too comedic)."* ADR-068's actual requirement is *"a minimal SFX pass lands **before the R1 taste call**"* — **HR-1 is still open**, so the human will judge a silent game against an ADR that says otherwise. `decisions.md` records the mute **nowhere**. |
| H6 | **ADR-041** | **No `LICENSE` file at repo root**, while the About modal tells every player *"Code: MIT"* (`render.ts:625`). ADR-041 put LICENSE in scope. The other three items (build stamp, About/Credits, itch descriptors) are built or correctly roadmap-owned. |
| H7 | **ADR-184** ✅ vs the build | **"Cooking is SITED" is false.** `cook_meal` never calls `canCookHere` — the gate exists (`selectors.ts:140`) but its only consumer is a Home-tab UI row. `intents.ts:909-917` says so plainly: *"cooking is NOT yet sited… turning it on is exactly one line HERE. It is held because the sim priced it."* The build is **correctly** held (it blows the pacing band → escalated as **HD-40**, open). What is wrong is the record: the ADR claims it shipped, and `reveals.ts:50-51` carries a stale comment asserting the same. |

### 🟡 MEDIUM CONFIDENCE — real, but either T1-scoped or "is this still wanted?"

| # | Source | The gap | Read |
|---|---|---|---|
| M1 | **ADR-148** | **Combat is still excluded from the timed-action model *"pending its own review"*** (`src/core/content/timing.ts:143`, `fight: INSTANT`). That review never happened. Every other act is timed (labour 5–9s, night round 30s, craft 45s) while a fight resolves in **zero wall-time** — a felt inconsistency the human has not been asked about. | An open **design review**, not a build. Best filed as an HD-item. |
| M2 | **ADR-157**(b) | **The map re-label data shape never landed** — and the ADR explicitly said it *"should land **now**"* so the sheet-map work (ADR-151) could carry it. Neither `MapNode` (`content/map.ts:15-42`) nor `SheetNode` (`map-sheets/nodes.ts:12-22`) has any rename/alias field. T2 instead **duplicates the roster** (`nodes.ts:764`, `rosterFor()` swaps wholesale). | The window was missed. The duplicate-roster approach may be *fine* — but that is a T2 design call nobody made. |
| M3 | **ADR-152** | **There is no `TierId` type.** `state.ts:239` is a bare `readonly tier: number` whose *comment* claims "0..6". The ADR's headline change ("the enum widens 0..5 → 0..6") was a prose edit to a comment on a `number`. No tier display-name table; `RankDef.tier` is hard-typed to the literal `0`. | Cheap to fix, and a genuine single-source gap — but it buys nothing until T1. |
| M4 | **ADR-183** (HD-39) | The T1+ both-tracks rule is, in its own words, **"canon without teeth"**. Both prerequisites are absent: `RequirementDef` has no `track` field (`requirements-engine.ts:32-40`), and there is no `verify-content` invariant for it. | **Correctly** deferred (a check with no T1 rungs is a vacuous green — PH3). But it has **no home in `docs/plans/t1/`**. |
| M5 | **ADR-159** | The multi-pillar tier-up predicate (*"every revealed pillar ≥ GOOD, exactly one EXCELLENT + one GREAT"*) **is not written** — only the degenerate T0 case (`ascension.ts:22`, `estateGrade === 'EXCELLENT'`). Nothing will enforce the rule when Arms lands. | T1 work, unhomed. |
| M6 | **ADR-104** | The **reusable "meet an NPC" first-encounter VN trigger** — named as *"Future work"* — was never built. `SceneTrigger` kinds are `rung \| season-exit \| flag \| verb \| scripted` (`scenes.ts:31-36`); there is no `meet`/first-encounter kind, so every NPC meeting is hand-wired. | Pays for itself the moment T1's cast lands. |
| M7 | **ADR-143** | **Dialogue is still reader-only** in the DEV Story switcher — `LIVE_UNITS` (`dev.ts:2731`) covers rung/intro/scene/flavor/cold-open, and there is no `subDialogue`. ADR-143's lock says wiring the live-swap is **part of** the first diverge that touches it. | Latent, correctly. Triggered by the next dialogue diverge — worth knowing *before* one starts. |
| M8 | **ADR-176** | **`save-e2e` still runs its playthrough at describe-collect time** (`src/persistence/save-e2e.test.ts:44`), the named *"Follow-up (not in scope)"*. Costs parallelism in the full lane. | Honest, un-discharged, tiny. |
| M9 | **ADR-111** | Home tiers **growing with rung** — explicitly a *"deferred T1+ seam"*, and correctly marked as such in code (`render.ts:5594-5596`, `home.ts:19`). Belongings + set/synergy bonuses **are** built. | Correctly deferred; unhomed. |

### ⚪ LOW CONFIDENCE — the ADR is yapping; not relevant to v0.4.1

Recorded so the next sweep doesn't re-litigate them. **No action.**

- **ADR-098 / ADR-100 / ADR-101 / ADR-102 — the four loud `BUILD TODO (v0.3.2)` lines are ALL STALE.** Every one shipped: the `U1–U4` rename (`render.ts:280-290`), the full 5-attr `str/agi/int/spd/luck` + accuracy/evasion resolution (`balance.ts:197`, `combat.ts:73-76`), the atk/taken stance axis with `wearMult` gone from the tree entirely, and the 3rd T0 weapon (`weapons.ts` — pole/axe/yari). *The markers are the misleading part, not the work.*
- **ADR-099** — player-vs-estate finance lanes: **superseded by ADR-163**, which reframed `banked` as house stores. The "reconcile" TODO was answered by a later decision, not by a build.
- **ADR-094** — `PHASE2_JUDGE_INTERVAL_DAYS` was **deleted**; ADR-153's season-exit judge won (`step.ts:27-29` tombstone). A stale ADR, no dead code.
- **ADR-103** (interactive combat), **ADR-125** (R7 capstone side quests), **ADR-154** (T2/T3 alternation lock), **ADR-160** (parallel rep tracks), **ADR-169** (T2 village web), **ADR-109** (T4 stipend / T5 office) — all **correctly deferred** to unbuilt tiers. PH6: don't build what no player can reach.
- **ADR-106** (multi-panel matrix) — moot; superseded by ADR-144's shipped Andon Steel shell.
- **ADR-127**'s "still-open variant picks (R2/R5/R6/R7)" — those are **HR-2A/2B/5/6**, already live in the human queue. Human-queue hygiene, not build work.
- **ADR-135** (closed distill loop) — already parked in `BACKLOG.md`; **ADR-146** Phase-3 rumors — already homed in `docs/plans/t1/`; **ADR-187**'s sleep-announce beat — already a live plan. *The system works when it's used.*

### Doc hygiene found in passing

- **ADR-147 does not exist** — the log jumps ADR-146 → ADR-148.
- **ADR-179 is still marked ▶️ IN PROGRESS** but is **fully built** (`state.unlocked` is gone from the save; `revealSurface`/`revealPass` deleted; `announcePass` at the same call sites; v10→v11 migration seeds `seenReveals`; `SCHEMA_VERSION = 11`). Only its S7 PRD ripple is owed → `docs/living/prd/06-tech-architecture.md`.
- **ADRs 183/186/184/185/187 sit out of numeric order** in the file.

## Steps

Each step is independently committable and `verify`-green. **S1 first** because it is
the cheapest and it stops the log from lying to the *next* reader while the rest lands.

- **S1 · Tell the truth in the log (docs-only).** Annotate, never delete (ADR-022,
  append-only). Strike the four stale `BUILD TODO (v0.3.2)` lines in ADR-098/100/101/102
  with a ✅-shipped forward pointer. Mark **ADR-094** superseded by ADR-153, **ADR-099**
  superseded by ADR-163. Flip **ADR-179** ▶️ → ✅ (leaving its S7 PRD ripple named).
  Correct **ADR-184**'s "cooking is SITED" to *held, pending HD-40*, and fix the stale
  `reveals.ts:50-51` comment. Record the **ADR-068 audio mute** as a real ADR (an
  un-ADR'd reversal of a ✅ decision is exactly the drift PH2 exists to catch). Note the
  ADR-147 gap.
- **S2 · The economy contradictions (H2, H3).** Give Yohei a **per-market-day purse
  ledger** in `GameState` so `YOHEI_PURSE_MON` is a real per-visit cap, not a
  per-transaction clamp. **Retire the rice withdraw path** — `intents.ts` `case 'withdraw'`
  and the `render.ts:5396` row — so `banked` is genuinely one-way at T0. Both are
  balance-touching → **ADR-132 flow**: `verify:balance` → `balance:report`, commit the
  regenerated `docs/content/t0-pacing.md` as the before/after, `--summary` in the body.
- **S3 · The HP-mend lane (H1).** Build what ADR-164 ruled: a **paid treatment action**
  at the sickroom (costs mon once waged, else a day) and a free manual **"rest at
  sickroom"** trickle; sever `cook_meal`'s HP restore so food is satiety-only. Fix the
  three contradicting comments (`defeat.ts:7-8`, `fight.ts:190`, `combat.ts:140`). The
  verbs are fiction-voiced → **ADR-139 3-take diverge** (Fable), live in the DEV Story
  switcher (ADR-143), HR-item on sign-off. Magnitudes sim-owned (ADR-132).
- **S4 · Greeting-line ids (H4).** Give greeting lines authored ids in the FB-5 narrative
  grammar (`src/core/content/narrative/`), route `log-render.ts`'s `greeting.<i>` resolver
  off the positional index, and migrate. Closes the ADR-186 known limit — a real
  save-integrity fix, not a nicety.
- **S5 · `LICENSE` + the audio call (H6, H5).** Add the root `LICENSE` (MIT — matching
  what the About modal already tells players). Then put the audio question to the human as
  an **HD-item**: ADR-068 is ✅ canon and demands a minimal SFX pass **before HR-1**, but
  the build is muted on his own 2026-07-07 call. Either the palette is re-done so it
  doesn't read comedic, or **ADR-068 is formally retired** — but HR-1 must not be judged
  against a silent game by accident.
- **S6 · Home the MEDIUM items (docs-only).** File **M1** (combat-timing review) and the
  audio call as **HD-items**. Move **M2/M4/M5/M6/M9** into `docs/plans/t1/` (or `t2/`) as
  PARKED-status plans so the tier-planning pass inherits them instead of re-deriving them.
  Land **M8** (`save-e2e` → `beforeAll`) as a one-line commit. **M3** (`TierId`) and **M7**
  (dialogue live-swap) become notes on the T1 plan they gate.

## Verification

- **S2:** a RED-able `economy.test.ts` case — N `sell_rice` calls on one market day must
  draw **at most** `YOHEI_PURSE_MON` in total (today it draws N×). And an
  `intents.test.ts` case: `withdraw` of rice is refused / the intent is gone. `verify:balance`
  green with the regenerated pacing report as the diff.
- **S3:** RED-able `defeat.test.ts` / `intents.test.ts` — `cook_meal` restores **zero** HP;
  the treatment action restores HP and debits mon; rest-at-sickroom trickles. Derive
  fixtures from `balance.ts`, never copied magic numbers (AGENTS.md test discipline).
- **S4:** a RED-able codec test — re-ordering greeting lines in a narrative `.md` must
  **not** re-point an existing save's log line. This is the test that could not exist
  before, and it is the whole point of the step.
- **S1/S6:** the `deferred-work` gate + `verify-plan-template` + the docs lane must stay
  green. Every claim in S1 is a doc edit backed by the file:line evidence in this plan.
- **Player-reach proof (PH6):** drive the live `:5173` build headlessly — take a fight to
  defeat, land in the sickroom, pay for treatment, watch HP return; then eat and watch HP
  **not** move. That is the slice a player actually touches.

## Sync ripple

- **PRD:** `docs/living/prd/06-tech-architecture.md` — the ADR-179 S7 unlock-latch ripple
  (owed, unbuilt). `04-combat-balance.md` — the HP-mend lane (S3) changes how HP recovers.
  Via `/prd-ripple`, then `pnpm run prd:drift`.
- **Story-bible:** `tiers/t0.md` — the sickroom's treatment/rest verbs are the bible's own
  "Sōan's closed ledger grows" made mechanical. `04-cast.md` untouched.
- **Living docs / registries:** `docs/content/t0-pacing.md` regenerated with S2 and S3
  (ADR-132). `gen:narrative` re-runs for S3's beat + S4's greeting ids. Fixtures regenerate
  (`fixtures:regen`) — S4 changes the save's log descriptors.
- **CHANGELOG:** none — no version bump ships this plan.

## Human-in-the-loop

- **Files:** an **HD-item** for the combat-timing review (M1); an **HD-item** for the audio
  call (H5/S5); an **HR-item** for S3's 3-take sickroom-beat diverge (ADR-139).
- **Blocks on nothing.** S1, S2, S4, S6 are agent-safe and start now. **S3's build** is
  agent-safe; only its *prose* waits on the diverge, and the diverge does not block the
  mechanism.
- **Already open, do not re-file:** **HD-40** (kitchen-only pot) owns H7's build — this
  plan only corrects the record while that decision sits. **HR-1** (the live T0 taste call)
  is what the audio question is *for*.
- **Taste scorecard:** S3's sickroom verbs are a new player-facing surface → Pass 1 brief
  before building, Pass 2 per-variant after (ADR-135).

## Non-goals

- **Not building any LOW-confidence item.** They are correctly deferred to unbuilt tiers
  (PH6) or already superseded — listed above so the next sweep does not re-derive them.
- **Not building H7 (sited cooking).** It is *deliberately* held: the sim priced the walk
  out of the pacing band, and the fork is **HD-40**, the human's. This plan fixes only the
  ADR text and the stale code comment that claim it shipped.
- **Not touching the four stale `BUILD TODO`s as code.** They are done; S1 fixes the
  markers, nothing else.
- **Not re-litigating the ADR log's format.** The fix for "the log became a queue" is a
  *plan* (this one) plus the `deferred-work` gate already landing — not a new tracker file
  (AC: avoid new hand-maintained files).

## Risks

- **Shared tree — multiple agents live (the roster churns; re-check with
  `herdr agent list` at pickup, don't trust this snapshot).** **Seam:** S2/S3
  own `src/core/intents.ts`, `defeat.ts`, `fight.ts`, `combat.ts`,
  `content/market.ts`; S4 owns `content/log-render.ts` + the narrative
  grammar. **Known live overlap:** the HD-41 build plan
  (`opus-2026-07-12-rung-reward-legibility.md`, active build-first since
  `48381097`) also touches `src/core/intents.ts` + `src/ui/render.ts` —
  coordinate before S2/S3 start. Commit **by explicit file-level pathspec**
  (never a dir pathspec, never `git add -A`), and re-check
  `git diff --cached --name-only` immediately before each commit.
- **S3 changes how HP recovers — a live balance lever.** Severing `cook_meal`'s HP restore
  removes the *only* current mend; if the treatment action is mispriced the arc can
  soft-lock (exactly the failure ADR-092's soft-fee was designed around). **Mitigation:**
  the sim's no-stranding detector must stay green, and the free rest-at-sickroom trickle is
  the floor that makes a broke player never stranded. Ship the trickle **with** the paid
  action, never after it.
- **S4 touches the save format.** Greeting ids re-key existing descriptors. Old saves must
  still load (ADR-186: a keyless legacy entry rehydrates verbatim). A schema bump +
  migration may be required; the ADR flags this as a content *restructure* needing one.
- **S1's ADR-068 entry is a reversal of a human-signed ✅.** It must be recorded as the
  human's own call (2026-07-07), not as an agent overriding canon.

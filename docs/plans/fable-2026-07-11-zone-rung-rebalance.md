# A zone opens only in a VN — the reveal law + the T0 zone re-mapping

**Status:** 🔒 LOCKED (mapping signed by the human 2026-07-12, session 180) —
ready to build, staged. Supersedes the 2026-07-11 PROPOSED draft (git history),
whose scope was "re-time three reveals"; the human's sign-off pass turned it into
a reveal-architecture change.
**Confidence:** ( 100% Opus, 0% Fable ) — human steer 2026-07-11 routes all
subagents/workflows to Opus while Fable sits near its cap.
**Template:** build

## Who builds this — Fable or Opus?

**Opus, throughout** (human, 2026-07-12). The design calls that made this
Fable-weighted are now *signed* — what remains is mechanical rewiring plus a
narrative wave, and the standing routing steer (2026-07-11) keeps subagents on
Opus. Subagents inherit; no lateral switch without a fresh steer.

## Why

Human, 2026-07-11: _"Kitchen does not hit in R1 lol. Which zones fit in which
rungs is totally open to rebalance and polish; theres too many zones unlocking in
R1."_ The captures behind it: FB-407 (kitchen threshold "has no purpose … it
should go to a different rung when it has purpose, actions or main question
impact"), FB-409 (woodshed "serves no purpose"), FB-408 (the gate is empty 5 days
of 7).

On the sign-off pass (2026-07-12) the human raised the ceiling from a re-timing
to a **law**:

> _"A zone should open up only in a VN — let's lock that in as a guideline. We
> can unlock a max of two zones per rung-up VN. If for a zone it's better to
> reveal it through a side quest with its own VN, I'm more than happy to do
> that."_ … _"The more side quests the better."_

And the diagnosis underneath the kitchen call — worth recording, because it
outlives this plan:

> _"Opening the kitchen zone in the R0→R1 rung-up because meals are promised is a
> bit weak gameplay-wise. There's nothing there in R1 — I know there are people
> there, but the people and the talking is also weak as implemented in R1; it's
> pure flavor with no gameplay/story purpose atm."_

So the rule this plan encodes is no longer "a zone unlocks at the rung where it
has purpose" but the stronger, checkable form: **a zone opens only inside a VN,
and a rung-up VN may open at most two.** Everything else earns its reveal from
the fiction.

## What exists today

Survey date 2026-07-12, source-verified this session at HEAD (`0cabf1a3`).

### Reveals per rung-up (`src/core/content/ranks.ts`)

| Rung | Zones revealed | vs. the ≤2 law |
|---|---|---|
| R1 | gate, paddies, woodshed, kitchen | **4 — over by 2** |
| R2 | woodlot, field-margins | 2 — legal |
| R3 | kura, weir-reeds, sickroom | **3 — over by 1** |
| R4 | drill-yard | 1 |
| R5 | shrine, orchard | 2 — legal |
| R6 | *(none)* | 0 |
| R7 | grove | 1 |

Two zones already reveal from **fiction, not rung** — the pattern this plan
generalises: `room-forecourt` (`unlock: awake && !introActive`, ADR-179) and
`room-weir` (`unlock: hasFlag('works-named-weir')`, ADR-177/TST3).

### The corrections this survey made to the superseded draft

The old draft's "what exists" table was right about siting but its **risk model
was inverted**, and two claims in the tree are stale. Recorded because each one
changed a decision:

1. **`ranks.ts:60` is WRONG.** Its comment says R1 opens the gate "for haul +
   Yohei's stall". `haul_stores` sites at the **forecourt**
   (`activities.ts:62`), not the gate. Moving the gate therefore does **not**
   endanger the R1→R2 requirement. *Delete that comment as part of Stage 2.*
2. **Zone access is NOT a latched save fact** (correction from the concurrent
   save-format session, re-verified here). `unlock.ts:6`: *"The save's only
   reveal-shaped field is `seenReveals`."* Access derives from `grantedByRung()`
   (`unlock.ts:31`) recomputed every move via `visibleSet()`; travel is gated by
   `canMove(from, to, visibleSet(next))` (`intents.ts:1164`). So an old save
   **loses** a zone we re-rung later — it snaps to the new pacing for free.
   **There is no save migration to do**, and the hand-off to the save-format plan
   dissolves. The real residual is the *opposite* of the draft's: `seenReveals`
   never un-latches (`unlock.ts:124`), so a zone moved R1→R4 **silently**
   re-grants with no ceremony. Stage 1 fixes exactly that.
3. **`verb-cook` already exists** — `unlock.ts:71` gates it on `row-sansai` (the
   forage fact); `intents.ts:819` implements it; `surfaces.ts:242` declares it.
   The cooking loop is **built but homeless**. The kitchen work is therefore
   *siting an existing verb + authoring its VN*, not building a feature.
4. **The kitchen is the densest talk node in the game** — three people, not the
   draft's two: O-Hisa, Shinnosuke, **and O-Yae** the scullery day-girl
   (`people.ts:196`). The gate has a second occupant too: Iori the monk, New Year
   and Bon only (`people.ts:218`) — so at R1 the gate is Yohei 2 days in 7 plus a
   monk twice a year.

## The signed mapping

### Rung-up VNs — every rung now legal under the ≤2 law

| Rung | Zones revealed |
|---|---|
| R1 | paddies |
| R2 | woodlot |
| R3 | kura |
| R4 | drill-yard, **woodshed** |
| R5 | shrine, orchard |
| R6 | *(none — legal; no floor)* |
| R7 | grove |

**No floor** (human, signed): the rung-up VN is a story beat, not a reward
dispenser. A lean promotion is correct; the world grows through discovery.

**Requirement-safe — verified, not assumed.** Every rung-up requirement stays
reachable the moment you are promoted: `farm_paddy`→paddies (R1),
`haul_stores`→forecourt (intro-done), `woodcut_edge`+`forage_satoyama`→woodlot
(R2) — `activities.ts:51,62,75,85`. This is an **invariant the plan must test**,
not a fact to re-check by hand (see Verification).

### VN reveals — the five that leave the rung schedule

Each becomes a fact/quest predicate in `surfaces.ts`, exactly as `room-weir`
already is. "The more side quests the better" (human).

| Zone | Fires from | Why it earns the reveal |
|---|---|---|
| **gate** | a *first market day* side-quest VN | You finally have surplus to sell; Yohei's purse is the mon-inflow cap. At R1 you had nothing to trade. |
| **kitchen** | a *learn-to-cook* side-quest VN, after foraging | The existing `verb-cook` (gated on `row-sansai`) gets its home. The chain reads: R2 → woodlot → forage → the cook VN → the kitchen. |
| **field-margins** | the tanuki/badger *pest* beat | It is already a beat; make the beat the reveal. |
| **sickroom** | first *hurt* discovery | FB-382's own stated intent — "the sickroom reveals when hurt starts existing" — made literal. |
| **weir-reeds** | Matsuzō's *leased-screen / rat pest* beat | Chains off `room-weir`, itself already fact-revealed. |

**The woodshed is the one zone that MOVES rather than leaves.** Its ceremony line
— *"a mat, a bowl, a nail for the coat: yours"* — is currently a **lie**: ADR-177
moved the home grant to R4 (`tab-inventory`), so R1 promises a home you don't
receive for three rungs. Riding the zone to R4 makes the line **true the moment
it is spoken**. R1 consequently never says where you sleep; the human signed that
as intentional (you are a nobody; you have no bed).

### Cap scope

The ≤2 cap binds **rung-up VNs only** (human, signed). A side-quest VN is bought
with the player's own action — it earns whatever it reveals (in practice, one
each).

## Steps

Staged; **one plan, nothing lands until the VNs are authored** (human, signed).

**Stage 0 — the law + its gate.**
- ADR in [`decisions.md`](../living/decisions.md): *a zone opens only in a VN; a
  rung-up VN opens at most 2*. Cite ADR-177/ADR-179 (the fact-reveal precedent)
  and TST3.
- A **verify gate** (`src/scripts/gates.ts` roster): count `room-*` entries per
  rung's `rewardOnReach.unlock` in `ranks.ts`; **>2 is RED**. Mechanically exact,
  cannot cry wolf — the highest rung the rule can soundly hold.
- Prove it can go RED (add a 3rd zone to a rung, watch it fail, revert).

**Stage 1 — the derived reveal re-arm** (`src/core/unlock.ts`).
- On load, drop from `seenReveals` any **`room-*`** id that is no longer in the
  current visible set. Zero new save fields; **self-healing for every future
  re-mapping**; no collision with the concurrent save-format rework.
- Safe by construction: every `room-*` surface is either a pure rung grant
  (`unlock: () => false`) or has a **permanently-latching** predicate (forecourt:
  post-intro; weir: `works-named-weir`), so nothing un-reveals for an innocent
  reason. Scope the rule to `room-*` so verbs/panels/readouts are untouched.

**Stage 2 — rewire the schedule** (`ranks.ts`, `surfaces.ts`).
- `ranks.ts`: unlock lists collapse to the signed table. Delete the stale `:60`
  comment (correction 1).
- `surfaces.ts`: the five VN-revealed zones swap `unlock: () => false` for their
  fact predicates.
- Moved ceremony lines get an **ADR-139 mini-diverge** (3+ takes each, human,
  signed) — the woodshed's line especially, since it is finally *true* at R4.

**Stage 3 — the five VN reveals** (the content wave).
- Each is an ADR-139 narrative diverge: 3+ distinct takes by independent blind
  agents, per-option taste scorecard, self-picked, alternates DEV-only behind the
  **Story switcher** until sign-off. One HR bundle, coherent — never 15 atomized
  taste calls.
- **Quest types are mixed by design** (human): Main Story (VN) · Side Quest (VN)
  · Discovery (VN), single- or multi-step. **The Quests tab stays at R5** and
  shows completed quests retroactively once it opens — a quest firing at R2 is
  simply not tracked in a UI that doesn't exist yet.
- Taxonomy is **emergent, not pre-declared** (human, signed): author the five,
  then record the shapes that actually emerged as a **brainstorm doc** in
  `project/brainstorms/` — *not* an ADR (human's call: too early for canon).

**Stage 4 — site the cook verb at the kitchen.** `verb-cook` exists and works;
give it its home so the kitchen has a verb, not just three people.

**Stage 5 — R1 terms-beat prose surgery.** The beat currently NAMES the kitchen
("Meals at the threshold, morning and evening") and the woodshed corner. Those
promises must go. **Mechanical deletion only** — no new prose authored (human,
signed: "land mapping now, mechanical prose only"); the T0 re-voice plan
(blocked on HD-38) fills the gap with real prose when it runs.

**Stage 6 — the sweeps.** Fixtures regen; ADR-132 balance pass; map fog frontier;
PRD ripple; story-bible tier sheet; the quest-shapes brainstorm doc.

## Verification

- **Gate (could go RED):** the ≤2 law, proven RED-able in Stage 0.
- **Unit (could go RED, derived — no copied lists):**
  - Per-rung reveal sets derive from `RANKS[..].rewardOnReach.unlock` (source of
    truth). **Fixtures from the source, never magic numbers** (ambient rule).
  - **The requirement-reachability invariant:** for every rung, each activity in
    the next rung's `eligible` list sites in a zone visible **at** that rung.
    This is the invariant that would have caught the `ranks.ts:60` confusion —
    assert the *mechanism*, not a snapshot.
  - The woodshed reveal asserts `panel-home` is visible in the **same** rung —
    the ADR-177 incoherence can never re-open.
  - The re-arm: a save that saw the woodshed at R1, loaded against the new
    schedule, has the latch dropped and **re-announces** at R4.
- **Edge case found this session:** `canMove` (`map.ts:294`) checks only that the
  *destination* is revealed, not the origin — so a player standing in the kitchen
  when it de-reveals can still walk out to the forecourt. No soft-lock, but they
  are briefly standing in a zone absent from their map. **Test it.**
- **Sim:** `verify:balance` GREEN; the `t0-pacing.md` diff commits with the change
  (ADR-132), `balance-sim --summary` pasted into the commit body. Read the 6
  untainted telemetry reports in `project/telemetry/` first (§2 step 0).
- **Player-reach (PH6):** drive R0→R4 headlessly (`__qa` + fixtures) — at R1 the
  map shows exactly forecourt + paddies; each VN reveal inks its zone in when its
  fiction fires; the woodshed arrives at R4 *with* the home. Screenshots per rung
  for the review. **A change reachable only in TypeScript is not done.**

## Sync ripple

- **PRD:** §7's per-rung reveal detail is provisional (ADR-168) — targeted
  `/prd-ripple` after landing; `pnpm run prd:drift` for the punch-list.
- **Story-bible:** `docs/story-bible/tiers/t0.md` names zones per rung beat — the
  moved zones' rows update in the same commit (separate-reveal rule, canon §I).
- **Living docs:** fixtures regen; `docs/content/t0-pacing.md` (ADR-132); the T0
  map sheet's fog frontier derives from reveals — no hand edit, but the golden pin
  may need a deliberate regen if the default capture rung shows different ink
  (`map-blind-pass` on T0 if the look moves).
- **CHANGELOG:** rides the next version bump; none now.

## Human-in-the-loop

- **The mapping is SIGNED** (2026-07-12) — Stage 0's ADR records it. No further
  gate on the structure.
- **HR bundle (Stage 3):** the five VN reveals + the moved ceremony lines, as one
  coherent review in the DEV Story switcher. Live review, not a doc read
  (human, 2026-07-07).
- **Taste scorecard:** Pass 1 constraint brief before Stage 3's authoring; Pass 2
  per-option after. No new UI *surface* here — the Do-panel's look belongs to the
  FB-410 diverge, not this plan.

## Non-goals

- **No Do-panel redesign** — that's the FB-410 zone-section diverge (separate).
- **No wait-a-day lever** — sibling plan `fable-2026-07-11-wait-a-day.md` prices
  the waiting; this plan reduces how much empty ground exists to wait in.
- **No save-migration framework** — dissolved by correction 2; access already
  derives from the rung schedule.
- **No quest-taxonomy ADR** — deliberately emergent (Stage 3); a brainstorm doc,
  not canon.
- **No fix for "R1 talk is pure flavor"** — the human's sharpest diagnosis, but it
  indicts the *talk system*, not the zone map. Parked as its own thread; do not
  smuggle it in here.

## Risks

- **Fiction ripples.** The R1 terms beat names the kitchen and the woodshed;
  story promises are contracts (taste P10). Stage 5 deletes the promises
  mechanically. The T0 re-voice plan
  (`fable-2026-07-11-t0-narrative-revoice.md`, blocked on HD-38) rewrites these
  same beats — **land this mapping BEFORE that re-voice, never interleaved**, so
  the beats are authored once.
- **The R1 world gets very small** — forecourt + paddies. That is the *point*
  (the human called R1 "too many, too thin"), but it is the opposite failure mode
  if it overshoots. **HR-1's live playtest is the check**; watch the R0→R2 pacing
  in the telemetry after landing.
- **Five VNs is the real cost.** Stage 3 is the bulk of this plan. Staging it
  behind a signed law + a mechanical rewire means Stages 0–2 are cheap and
  verifiable on their own — but nothing ships until Stage 3 lands (human's "one
  plan" call). Do not let a half-authored wave sit on `main`.
- **Seam.** This plan owns `ranks.ts`, `surfaces.ts`, `unlock.ts` (the re-arm),
  and the per-rung reveal tests. Neighbours: the FB-410 diverge owns the Do-panel
  render; the **save-format-streamline** plan owns the save shape (this plan adds
  **no** save field — deliberately, to stay out of its way); the wait-a-day plan
  may site a button on the gate's away row (it lands after this, so the gate's
  reveal is settled). **Re-check for live herdr peers on these files before each
  stage** — three other agents share this tree.

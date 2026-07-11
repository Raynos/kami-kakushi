# Re-map the zone→rung unlocks so every zone opens WITH its purpose

**Status:** 📋 PROPOSED (2026-07-11, session 178)
**Confidence:** ( 20% Opus, 80% Fable ) — the mapping is a design/pacing call
(what each rung's world feels like); the edits themselves are mechanical
once the mapping is signed.
**Template:** build

## Who builds this — Fable or Opus?

- **Phase 0: the mapping sign-off** — human decision over the table below
  (it changes the reveal pacing of the whole T0 world; lock as an ADR).
- **Phase 1: apply the mapping** — mechanical (`ranks.ts` unlock lists +
  ceremony labels + tests + fixtures regen); **Opus-safe**. The only
  taste-bearing piece is re-wording any moved ceremony line (ADR-139
  mini-diverge per changed line).

## Why

Human, 2026-07-11 (this session, steering the FB-407 drain item): _"Kitchen
does not hit in R1 lol. Which zones fit in which rungs is totally open to
rebalance and polish; theres too many zones unlocking in R1."_ The captures
behind it: FB-407 (kitchen threshold "has no purpose … it should go to a
different rung when it has purpose, actions or main question impact"),
FB-409 (woodshed "serves no purpose" — partially fixed by the FB-409 rest
siting, but the comfort it sites only arrives with the home), FB-408 (the
gate is empty 5 days of 7 — softened by the dimmed stall row, `07d1523d`).

The rule this plan encodes (the human's own words): **a zone unlocks at the
rung where it has purpose — actions, people, or main-question impact.**

## What exists today

Survey date 2026-07-11 (HEAD `c6c6cb26`), source-verified this session in
`src/core/content/ranks.ts` (unlock lists), `activities.ts` (verb siting),
`people.ts` (who stands where), `surfaces.ts` (ceremony labels):

| Zone | Opens | Purpose at that rung (verified) |
|---|---|---|
| forecourt | intro-done | rake + `haul_stores` + Genemon (vn) — rich |
| paddies | R1 | `farm_paddy` (the R1→R2 requirement) — right |
| gate | R1 | Yohei only, 2 of 7 days (dimmed row otherwise) — thin |
| woodshed | R1 | NOTHING until the home lands at R4 (ADR-177 moved `panel-home` to `tab-inventory`; the R1 ceremony still says "a mat, a bowl … yours" — a live fiction incoherence) |
| kitchen | R1 | talk only (O-Hisa, Shinnosuke); meals are automatic; `verb-cook` derives from `row-sansai` (~R2 forage), not from the kitchen |
| woodlot, field-margins | R2 | woodcut/forage/foes — right |
| kura, weir-reeds, sickroom | R3 | deposit/watch · rat pest · defeat-carry — right |
| drill-yard | R4 | Kihei's ground — right |
| shrine, orchard | R5 | Toku · feral dogs — right |
| grove | R6 | side-beat ground — right |

So R1 opens **4 zones + the forecourt**, of which two (woodshed, kitchen)
have no verb and one (gate) is mostly-empty — exactly the "too many, too
thin" the human called.

## The proposed re-mapping (Phase 0 — for sign-off)

- **paddies — stays R1.** The R1→R2 requirement labour lives here.
- **gate — move to R2.** Selling surplus is an R2+ economy beat (Yohei's
  purse is the mon-inflow cap); at R1 you have nothing to sell. The R2
  ceremony ("the wider estate") absorbs its line. *Alternative kept open:
  stay R1 for map-shape reasons — the dimmed stall row now explains the
  emptiness honestly.*
- **woodshed — move to R4, WITH the home grant.** ADR-177 already moved the
  home to R4 (`tab-inventory`); the zone should arrive with its purpose —
  and its ceremony line ("a mat, a bowl … yours") becomes TRUE the moment
  it's spoken, healing the current incoherence. Rest-away still works
  everywhere via the FB-402 open-rest line.
- **kitchen — move to R2, tied to the talk content it hosts.** O-Hisa and
  Shinnosuke are its purpose (the board where the household's shape is
  overheard — main-question impact, not verbs); R2 is where the estate's
  people open up. *Alternative: gate it on `verb-cook`'s fact
  (`row-sansai`) so it opens with the hot-meal loop — stronger
  purpose-coupling, fuzzier fiction (cooking is learned in the woodlot?).*
- **R1 after the change: forecourt + paddies** — small, dense, every zone
  carrying the rung's own requirement. The R1 world grows at R2 into
  people + trade + the wider grounds.

## Steps

1. **Human signs the mapping** (or edits it per-zone above) — locked as an
   ADR (HD flow; this is reveal-pacing canon).
2. **Apply to `ranks.ts`** — move `room-gate` + `room-kitchen` into R2's
   unlock list, `room-woodshed` into R4's (beside `tab-inventory`), each
   ceremony label riding to its new rung; re-word moved lines only if the
   new context demands (ADR-139 mini-diverge per changed line).
3. **Tests + fixtures** — update the unlock/roster tests that pin the R1
   set (`unlock.test.ts`, `map.test.ts`, roster↔layout integrity), regen
   fixtures (`fixtures:regen` — rung fixtures embed reveal flags).
4. **Balance/pacing pass** — ADR-132: `verify:balance` + `balance:report`;
   the map-sheet fog frontier shifts with the reveals (map-sheets integrity
   test must stay green; a `map-blind-pass` on T0 if the sheet's look
   changes).

## Verification

- Unit (could go RED): per-rung reveal-set tests derive from `RANKS[..]
  .rewardOnReach.unlock` (source of truth, no copied lists); the woodshed
  reveal asserts `panel-home` is visible in the SAME rung (the incoherence
  can't re-open).
- Sim: `verify:balance` GREEN; t0-pacing.md diff committed with the change.
- Player-reach (PH6): drive R0→R2 headlessly (`__qa` + fixtures): at R1 the
  map shows exactly forecourt+paddies(+start spine); at R2 the gate/kitchen
  ink in with their ceremony lines; capture screenshots per rung for the
  review.

## Sync ripple

- **PRD:** §7's per-rung reveal detail is provisional (ADR-168) — targeted
  ripple via `/prd-ripple` after landing; `pnpm run prd:drift` for the
  punch-list.
- **Story-bible:** `docs/story-bible/tiers/t0.md` names zones per rung beat
  — the moved zones' rows update in the same commit (separate-reveal rule,
  canon §I).
- **Living docs / registries:** fixtures regen; `docs/content/t0-pacing.md`
  (ADR-132); the T0 map sheet's fog frontier derives from reveals — no
  hand edit, but the golden pin may need a deliberate regen if the default
  capture rung shows different ink.
- **CHANGELOG:** rides the next version bump; none now.

## Human-in-the-loop

- **The mapping sign-off** (Phase 0) — this plan is the decision surface;
  per-zone alternatives are inline above. On your read: sign, edit, or
  bounce per zone. Locks as an ADR.
- Moved ceremony lines that need re-wording → ADR-139 takes + an HR bundle
  (Phase 1).
- No taste-scorecard Pass 1 yet — no UI surface changes until Phase 1 (and
  the Do-panel's look belongs to the FB-410 diverge, not this plan).

## Non-goals

- **No new zone content** — this plan only re-times reveals; giving the
  kitchen a verb (a morning-meal beat?) or the gate more market texture is
  future content work, deliberately parked.
- **No Do-panel redesign** — that's the FB-410 zone-section diverge
  (running separately).
- **No wait-a-day lever** — sibling plan `fable-2026-07-11-wait-a-day.md`
  prices the waiting; this plan reduces how much empty ground exists to
  wait in.

## Risks

- **Fiction ripples:** the R1 terms beat currently NAMES the kitchen
  ("meals at the threshold") and the woodshed corner — moving those zones
  means the beat's prose must stop promising them now (story promises are
  contracts, taste P10). The re-voice rides the same commit; the T0
  narrative re-voice plan (`fable-2026-07-11-t0-narrative-revoice.md`,
  blocked on HD-38) touches the same beats — **land this mapping BEFORE or
  INSIDE that re-voice**, never interleaved.
- **Old saves:** reveal flags are latched facts — an existing save that
  already saw R1's four zones keeps them (announce-once + fact derivation);
  only fresh runs feel the new pacing. State that in the review so a
  playtest on an old save doesn't read as "the plan didn't land".
- **Seam:** this plan owns `src/core/content/ranks.ts` + `surfaces.ts`
  (ceremony labels) + the per-rung reveal tests. Neighbours: the FB-410
  diverge owns the Do-panel render; the wait-a-day plan may site a button
  on the gate's away row (it lands after this re-mapping so the gate's rung
  is settled). No live herdr peer holds these files.

# The Estate section + upgrades redesign — feedback → plan

**Status:** PROPOSED — awaiting the human's read (reading queue) + the Phase-0
direction lock. Nothing builds before Phase 0 closes.
**Confidence:** ( 35% Opus, 65% Fable ) — the load-bearing work is fiction +
taste judgment (Phases 1–2); the mechanical tail (Step 0, Phase 3 transcription)
is Opus-safe.
**Sources:** `project/brainstorms/2026-07-10-estate-upgrades-redesign.md` (the
parked direction note this plan supersedes) + the estate-related playtest-inbox
feedback gathered below.

## Who builds this — Fable or Opus?

- **Phase 0 (direction lock)** — the *human* decides; either model can run the
  sitting. Judgment concentrates in framing the forks well, not in code.
- **Phase 1 (fiction repair)** — **Fable-leaning.** A narrative-diverge whose
  whole value is dramatic-register judgment (ADR-139 blind takes help, but the
  brief-writing + self-pick carry taste risk).
- **Phase 2 (surface redesign)** — **Fable-leaning.** A full ADR-075 diverge of
  a surface the human has now bounced twice (FB-157, this steer); the taste bar
  is the risk, not the wiring.
- **Step 0 + Phase 3** — **Opus-safe.** A lock-schedule triage and an ADR-132
  transcription/balance pass are mechanical.

Per D-124 this section *proposes* routing for the human to approve; the
building session inherits its own model unless the human routes otherwise.

## The feedback corpus (what the players' record actually says)

Pending inbox (r1 bucket — NOT drained by this plan; the r1 drain lane still
owes their sidecar stamps):

- **FB-338** (Question, 18:38) — _"I honestly don't know what to do with this
  estate section, there's not enough story context for why it's here in R1.
  Why are you mending the weir screens, who told you about the weirs, why did
  you notice they are broken, its just not mentioned, its random."_
- **FB-342** (Bug, 18:46) — _"Why can you move to the weir in R1? I thought
  that was still locked."_

Drained today (context, already actioned in their lanes):

- **FB-274** (log-panel lane) — the `panel-estate` reveal line ("The estate's
  own state of repair is yours to tend now…") was STRUCK on the human's order:
  _"it's obvious by the time you get to the Estate section and I need to think
  harder about the Estate section TBH."_ The one line that tried to give the
  section a cause was judged unearned — the cause has to be real, not a log
  sentence.
- **Session-156 steer** — V0A (estate-a) + V1A (tracker-a) locked _"for now"_;
  _"Honestly the whole estate section and upgrades needs a lot of love and
  thought."_ (HR-9/HR-11 archived as INTERIM; DEV alternates kept.)

Standing record folded in:

- **FB-157** — "border soup": the quick-fix that produced estate-a re-skinned
  the card, not the shape.
- **HR-16** (archive) — the E1 okoshi-ezu cutaway: two blind-pass-green
  variants judged _"needs more work"_; parked, still in `src/ui/estate-sheet/`
  behind DEV.
- **HD-34 / ADR-172** — the Phase-2 deed economy re-tuned
  (`ESTATE_DEED_PER_ACT` 0.22→0.6, ratio back in [0.8, 1.2]); ascension is
  attention-priced. These numbers STAND unless Phase 0 reopens them.

## What the build is today (source-verified 2026-07-10)

- **The ladder** (`src/core/content/estate.ts`): four repair/reclamation
  projects, U1→U4 — *Mend the weir screens* (100 coin) → *Reclaim the orchard*
  (300) → *Raise the granary* (700) → *Set the house in order* (1400) — each
  granting +satietyMax and a cumulative labour-yield bonus (the ADR-051
  flywheel, +15/35/65/95%). Deed gates `[0, 90, 220, 380]` mean U2+ are
  effectively Phase 2; **U1 is affordable and un-deed-gated in R1**.
- **The section** (Estate 家 tab, `panel-estate` unlocks ~R1): the improve card
  (estate-a) + tracker-a + the HOUSE_ROOMS flavour rows (R4/R6/R7 reveals),
  sharing the tab with market, storehouse, belongings, and (R3+) the
  House-Influence pane — six panes stapled into one tab.
- **The weir exists twice**: as U1's fiction (the screens) and as a map node
  (堰) — FB-342 says the node is walkable in R1 when the human expected it
  locked, and FB-338 says the project names it with zero story introduction.

## Diagnosis — three braided problems

1. **Fiction (TST3 — the fiction must cause the mechanics).** The projects are
   *spawned, not discovered*: "Mend the weir screens" appears as a buyable in
   R1 with no one having told you the screens exist, are leased, or are
   broken. FB-274 proved a log line can't paper over this — the cause was
   struck as unearned. This is FB-338 verbatim.
2. **Anatomy (TST1 — one home for everything).** The Estate tab is a staple of
   six panes, not a designed home. HR-9's diverge re-presented the improve
   card; the human's "border soup" complaint was about the *shape*, and the
   shape never changed. The natural anchor for a reclamation fiction — the
   estate itself, seen (HR-16's cutaway) — is parked.
3. **Upgrades (PH5 — if it isn't fun, it isn't finished).** Advancing reads as
   buying stat lines: coin → "+20 satiety max" (a stat the human separately
   flagged as conflated with stamina — FB-334/FB-345, adjacent not owned
   here). The flywheel (+yield%) is the actual fun engine and it's the least
   legible part of the card. Dual coin+deed gates are invisible until they
   block you.

## The plan

### Step 0 · Triage FB-342 (standalone, before or during anything)

Reproduce from `r1/2026-07-10T18-46-13.json`; diff the weir node's reveal/lock
schedule against intent (was it meant to open with U1? with a rung?). Fix or
file. **Owner note:** FB-338/FB-342 belong to the r1 drain lane — whoever picks
this up claims the lane (ADR-171) or coordinates with its claimant; this plan
does not stamp their sidecars.

### Phase 0 · Direction lock — the human decides what the estate IS

A grill-me / AskUserQuestion sitting over five forks. Output: an ADR + a signed
**Direction** section appended to this plan. Per the standing steer
(lock-direction-before-building), no Phase 1–3 work starts before this closes.

- **F1 · When does the section earn its reveal?** R1 as now but with a real
  cause · deferred to the rung where its fiction can fire · R1 as a
  teaser-silhouette that fills later.
- **F2 · What causes each project?** The lease/day-book assigns it (Genemon or
  the ledger names the broken screens) · an NPC beat per project · **discovered
  by walking** — you visit the weir node and *see* the gnawed screens, and only
  then does the project exist (ties F2 to FB-342's node question).
- **F3 · Are upgrades more than coin→stage?** Keep coin+deed as-is, fix only
  legibility · add material inputs (wood is already in the economy) · give each
  project real requirements tied to zones/acts (repair verbs, not purchases).
- **F4 · What is the Estate tab's one home?** Keep the pane-stack but design it
  as one surface · make the estate *itself* the home (the E1 sheet/cutaway as
  anchor, projects read off the drawing) · split economy panes (market/
  storehouse) out to end the staple.
- **F5 · HR-16's cutaway disposition.** Anchor of the redesign (pull forward) ·
  its own later track · stays parked.

### Phase 1 · Fiction repair (after Phase 0; ADR-139)

Per the F1/F2 rulings: a narrative-diverge (3+ blind takes per unit) for the
estate-intro beat + a per-project cause line/beat for U1–U4, wired
discovered-not-spawned (reveal follows the story beat, TST3). Reviews LIVE in
the DEV Story switcher; HR-item with taste scorecards per take.

### Phase 2 · Surface redesign (after Phase 0/1; ADR-075)

A FULL diverge — 2–3 genuinely-distinct *working* takes on the F4 answer, not
another card re-skin. Taste two-pass (constraint brief before, 21-walk
scorecard after, per variant); each variant its own HR-item line; self-picked
prod default. **This supersedes the interim V0A/V1A pick and retires
estate-a/b/c + tracker-a/b/c** (strip on sign-off, zero flag-debt — they were
kept precisely to die here).

### Phase 3 · Upgrade-economy pass (only what F3 rules)

If F3 keeps the shape: a legibility-only pass (show the flywheel, name the
deed gate before it blocks). If F3 adds inputs/requirements: core work under
the ADR-132 flow — telemetry step 0, `verify:balance` → `balance:report`,
regenerated `t0-pacing.md` in the same commit, sim summary in the body. ADR-172
magnitudes stand unless the sim says the new inputs moved them.

## DoD

- Step 0: FB-342 reproduced + resolved (fix landed or filed with a verdict).
- Phase 0: ADR logged; Direction section signed here.
- Phase 1: cause beats in canon via ADR-139; no project appears before its
  fiction fires; FB-338's question answerable in-game.
- Phase 2: diverge shipped behind DEV, HR-items filed, prod default picked;
  interim variants retired on sign-off.
- Phase 3: sim verdict in-band; balance report committed with the change.

## Non-goals

- The estate **map** (絵図 survey sheet) — resolved (HR-7), untouched here.
- The satiety/stamina split (FB-334/FB-345) — real, adjacent, owned by its own
  drain thread; this plan only avoids making it worse.
- The ADR-172 pacing re-tune — stands; not relitigated outside F3's scope.

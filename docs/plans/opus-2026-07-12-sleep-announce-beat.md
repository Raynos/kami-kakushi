# Announce the sleep verb where it lives — a beat at your own corner

**Status:** 📋 PROPOSED (2026-07-12, session 183)
**Confidence:** ( 35% Opus, 65% Fable ) — the mechanism is small and already
built (a condition in `revealsPass` + a scene def); the whole risk is the
**prose**: a beat that says "you may end a day here" without reading as a
tutorial pop-up. That is a taste call, so it leans Fable.
**Template:** build

## Who builds this — Fable or Opus?

- **Phase 1 (the trigger + the scene wiring):** mechanical — one condition in
  an existing pass, one scene def, tests. **Opus-safe.**
- **Phase 2 (the beat itself):** the taste-bearing phase. It is fiction-voiced
  text at the moment a capability arrives, which is the hardest register in the
  game to get right (too explicit = a tutorial; too oblique = the player still
  does not learn the verb). **Route to Fable** for the ADR-139 3-take diverge;
  Opus can run the mechanics and hand the diverge over.

## Why

**ADR-187 shipped the `sleep` verb unannounced.** The R4 rung-up grants the
woodshed corner ("a mat, a bowl, a nail for the coat: yours"), and the **Sleep
till morning** button then simply *appears* in the verb row beside Rest. Nothing
in the fiction ever says the day is now yours to end.

- The record: the **ADR-135 taste scorecard** run on the shipped surface
  (session 183, attached to **HR-36**) scored 14 ✔ · 1 ✘ · 6 —. The single ✘ is
  **P9 (discover, don't spawn)**: *"Nothing tells the player the verb exists."*
- **Why it actually matters, not just on the card:** the verb exists to answer
  **FB-408** (*"Should we implement a wait a day button?"* — asked while standing
  in a zone whose content sits elsewhere in **time**). A lever the player never
  learns about does not answer the complaint that produced it. This is the same
  failure class as PH6 — reachable, but effectively invisible.
- **The human ruled the fix (2026-07-12):** *its own tiny beat at the corner* —
  a one-off moment the first time you stand in your corner after R4, so the verb
  is **discovered in place** rather than **promised in advance** on the grant
  line. Recorded as the FOLLOW-UP bullet on
  [ADR-187](../living/decisions.md) (`decisions.md:3688`).
- The rejected alternative (offered, declined): bolting a clause onto the R4
  grant line. It would have *promised* the verb three rungs' worth of ceremony
  before the player ever stands in the room — the opposite of discovery.

## What exists today

Survey date **2026-07-12**, HEAD `e565ce30`, all source-verified this session:

- **The verb ships and works.** `sleep` is an intent
  (`src/core/intents.ts`), gated by `canSleep` (`src/core/selectors.ts`) on
  `isUnlocked(HOME_SURFACE)` **and** `location === HOME_NODE` — i.e. the woodshed
  corner, from **R4** (`panel-home` chains to `tab-inventory`, whose rung is R4 in
  `src/core/content/ranks.ts`). Its button rides the meta-verb row in
  `src/ui/render.ts` (`META_LABELS`), beside Rest. Landed `ca582470`.
- **The trigger machinery already exists, and it is the right one.**
  `revealsPass` (`src/core/reveals.ts`, ADR-184) runs inside the settle pass and
  **enqueues a scene the tick its fictional moment arrives** — its existing
  conditions are exactly this shape (`rung >= 2 && location === 'forecourt' &&
  coin >= CHEAPEST_STALL_ITEM_COST`). It is the AC-20 glue module, so adding a
  condition there is additive, not a new pattern.
- **The write-once latch comes FREE.** `enqueueScene` (`src/core/scenes.ts`)
  **once-guards a played `once` def** — the module's own header says a satisfied
  condition re-fires nothing. So this plan needs **no new flag and no schema
  bump**: the scene's `once` latch IS the "first visit" memory. *(This is the
  main thing the ADR-187 follow-up bullet got wrong — it assumed a new
  write-once flag was needed. It is not.)*
- **The lighter alternative also exists** — `src/core/works.ts` carries a
  per-node **seen-flag one-off narration** pattern (`{ node: 'woodshed', seenFlag:
  'works-seen-woodshed' }`), which emits a log line rather than a VN. See Steps §1
  for the fork and the self-pick.
- **Scene prose is authored, not hand-written:**
  `src/core/content/narrative/scenes.md` → `scenes.gen.ts` via
  `pnpm run gen:narrative` (**never edit the `.gen.ts`**). Takes bundles live in
  `narrative/takes/`, and the DEV → Story switcher swaps them live.

## Steps

> Step 1 settles the shape; 2–4 build it. Each is independently committable and
> verify-green.

1. **Pick the beat's WEIGHT (self-picked default; the human overrides freely).**
   - **(a) A narration beat at the corner — the self-pick.** A one-off log beat
     (the `works.ts` seen-flag idiom) the first time you stand in your corner at
     R4+. It matches the human's word — *"a **tiny** beat"* — and it does not
     seize the screen to teach a convenience verb.
   - (b) A full VN scene via `revealsPass` + `enqueueScene`. Correct for a
     *story* moment (ADR-184's zone reveals), but a full-screen takeover to say
     "you may sleep here" is ceremony the beat has not earned.
   - The mechanism is nearly the same either way; **(a)** is the default and the
     rest of this plan assumes it. If the human wants (b), swap the emitter — the
     trigger condition is identical.
2. **The trigger.** Add the first-visit-at-the-corner condition (`rung >= 4 &&
   location === HOME_NODE && canSleep(state)`) to the settle pass, with its
   write-once latch (the `works.ts` seen-flag pattern, or `enqueueScene`'s `once`
   guard under option (b)). It must fire on ARRIVAL, not on the rung-up — the
   whole point is that the player is standing in the room.
3. **The beat's prose — ADR-139, 3 blind takes (the taste-bearing step).** Author
   in `narrative/` (never the `.gen.ts`), canon + alternates as a `takes/` bundle,
   swappable live in DEV → Story. **The brief for the authors:** the line must
   make the player understand the day is now theirs to end, *without* reading as
   a tutorial and *without* naming a button. The corner's three props (mat, bowl,
   nail) are canon and already load-bearing in the slept-day line — reuse or
   deliberately avoid, but do not contradict.
4. **Tests + player-reach (PH6) + the HR bundle.** See Verification.

## Verification

- **Unit (could go RED):** the beat fires **exactly once** (a second visit to the
  corner emits nothing); it does **not** fire below R4; it does **not** fire
  anywhere but the corner; it fires on **arrival**, not on the promotion tick.
  Each of these is a real refusal — deleting the latch or the location check reds
  a named test.
- **Player-reach (PH6) — the proof that matters, and the one this plan exists
  because we skipped:** drive the REAL game headlessly at `:5173` (the shared
  server — never spawn one) from the `rung-R4` fixture, **walk to the woodshed**,
  and assert the beat lands in the log **and** that the Sleep button is present in
  the same view. A unit test cannot prove the player learns the verb; standing in
  the room and reading the log can.
- **The regression this closes:** re-run the **taste scorecard** on the surface and
  the **P9 ✘ must flip to ✔** (HR-36's card is the before-state). If it does not,
  the beat did not do its job and the prose is wrong.

## Sync ripple

- **PRD:** none — §6.3 already carries the `sleep` intent and its classification
  (rippled in `14c53a9b`). A beat that *announces* an existing verb changes no
  PRD fact.
- **Story-bible:** none — this is a mechanics-announce beat at an existing node,
  not new world canon. It leans on ADR-184's already-signed corner fiction rather
  than adding to it.
- **Living docs / registries:** `pnpm run gen:narrative` regenerates
  (`scenes.gen.ts` / `flavor.gen.ts` + `storyTakes.gen.ts` + `docs/content/t0-story.md`)
  — the authored `.md` is the source. **No balance change → no ADR-132 report
  regen** (the beat emits prose, not numbers; the sim stays skip-blind per ADR-187).
- **decisions.md:** flip ADR-187's FOLLOW-UP bullet from "RULED BUT NOT YET BUILT"
  to built, and **correct its claim that a new write-once flag is needed** — it is
  not (see What exists today).
- **CHANGELOG:** none now — rides the next version bump's section.

## Human-in-the-loop

- **Taste-scorecard Pass 1 BEFORE a line is written** (ADR-135). Non-negotiable
  here of all places: **this plan exists because session 183 skipped Pass 1 on the
  sleep button and only found the gap afterwards.** Running it late is what
  produced this work; running it late again would be the same mistake twice.
- **A new HR-item** for the 3-take beat bundle (ADR-139), reviewed **live in the
  DEV → Story switcher** — a doc-only review is not a review (human, 2026-07-07).
- **Open question, with a default so it never blocks (PH4):** the beat's weight —
  narration beat (self-pick) vs full VN. Step 1 carries the argument; the plan
  proceeds on the default unless the human says otherwise.
- **Closes:** the P9 ✘ on **HR-36**'s scorecard.

## Non-goals

- **No change to the sleep mechanic.** The teeth, the siting, the one-day-per-press
  grain and the skip-blind sim are ruled and shipped (ADR-187). This plan adds an
  announcement and nothing else.
- **No lever for the R1 player.** FB-408 asked at R1 and stays unserved by design
  (a nobody has no bed — ADR-184/ADR-187). That itch is **content's** job — the
  zone-rung rebalance — not this beat's.
- **No clause on the R4 grant line.** Considered and declined by the human: it
  would promise the verb long before the player can use it.

## Risks

- **The tutorial smell is the whole risk.** A beat that announces a *convenience
  verb* is one bad sentence away from reading like a pop-up tip in a game whose
  entire register is against that. Mitigation: 3 blind takes + Pass 1 + the human's
  live read. If all three takes read as tutorial, the honest fallback is **(b) do
  nothing** and let the button be found — say so rather than shipping a bad beat.
- **SEAM — `narrative/scenes.md` is HOT.** The herdr peer **`w6:p1`** is running the
  **T0 re-voice** (`docs/plans/fable-2026-07-11-t0-narrative-revoice.md`, ADR-185)
  and is actively editing `src/core/content/narrative/scenes.md` + `intro.md` —
  the same files a VN beat (option b) would touch, and adjacent to the flavor file
  a narration beat (option a) would touch. **Land AFTER their wave, or coordinate
  the file.** Do not regenerate `*.gen.ts` while their `.md` edits are uncommitted:
  `gen:narrative` compiles the whole working tree, so a regen sweeps their
  in-progress prose into your commit (this bit session 183 — see its journal).
- **Files this plan owns:** the settle-pass trigger (`src/core/reveals.ts` **or**
  `src/core/works.ts`, per Step 1), the beat's prose in
  `src/core/content/narrative/` + its `takes/` bundle, and a new core test. It
  reads `selectors.ts` (`canSleep`) read-only.
- **Rollback is trivial:** the beat is additive and once-latched. Deleting the
  trigger removes it with no state migration (no new stored field — the latch
  reuses an existing flag mechanism).

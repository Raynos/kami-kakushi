# Rung-up story transitions — the promotion beat (F97 + F99 + F103)

**Status:** 🆕 proposal — awaiting human scope call; **no code changed yet**.
**Source steers:** playtest **F97** (rung-up must be a player-initiated story
beat that motivates the unlocks) + coordinator relay **F99** (entities/NPCs like
the pedlar must be *discovered*, not silently popped in) + **F103** (the R1
promotion gave ONLY one log line, mis-routed to Progress — the story prose
belongs in the Story channel). Ties **D-104** (the full-screen VN scene for
story-significant NPCs) and **F89** (narrative ↔ mechanical coherence).

---

## 1 · The problem (verbatim)

> _"Hitting day labourer 1100 / 1100 just goes instantly to R1, it shows the R1
> icon and prints some flavor text to the combat log. No that's not how we rank
> up. When we rank up we want there to be a UI option to do something, to start
> another story beat; starting a story beat will start a new question or new
> interaction; all the interactions for introducing new characters can be in the
> big modals like intro. It's completely missing the story transition — Why is
> the gate & forecourt open. Why are the paddies open. Why can you contribute to
> repairs of the estate."_ (F97)

> _"Why did the pedlar just appear, there needs to be a reason, you need to
> discover him instead."_ (F99)

> _(On the R1 promotion, the player got ONLY this one line — in the **Progress**
> channel:)_ _"❖ Genemon the elder watches you clear the stores without being
> told twice. 'The house is short of hands and shorter of trustworthy ones. Stay.
> Earn your rice.' You are taken on as a kept hand."_ — _"This R1 flavor text was
> all we got for the story of the rung up… That does not belong in progress
> that's part of the story."_ (F103)

These are one principle: **a new capability, area, panel, OR person must be
earned through a story transition that motivates it — never a silent number-fill
+ a single mis-channeled log line.** The mechanical reveal must *follow* the
story, not the other way round. F103 pins two concrete current-state defects the
redesign fixes: (a) the rung-up **story prose is routed to Progress**, when
diegetic prose belongs in the **Story** channel (narration); and (b) **one log
line is not a rung-up** — the whole "story of the rung up" was that single line.

---

## 2 · How it works today (investigation, cited)

### 2.1 The promotion is instant, silent, and on the hot path

- `accrueRungMeter` (`src/core/ranks.ts:18`) adds `RUNG_POINTS_PER_ACT` per
  eligible action while at the current rung.
- **Every** `reduce` ends in `finish()` (`src/core/intents.ts:117-119`), which
  runs `revealPass(promoteRungs(state))`.
- `promoteRungs` (`src/core/ranks.ts:37-59`) is a **while-loop**: as long as the
  AND-gate is open (`rungMeter ≥ threshold && storyGate(flags)`), it bumps
  `rung`, resets `rungMeter` to 0, applies `rewardOnReach`, and refills satiety —
  **all in the same tick the meter fills**, with no player action. It can even
  climb multiple rungs in one call.
- `rewardOnReach` (`src/core/content/ranks.ts:55-237`) fires through
  `applyRewards` (`src/core/rewards.ts:27`): it sets the `rank-rN` flags, reveals
  every `unlock` surface (each pushing its own `revealLine`), and pushes the
  rung's own milestone log line.

So promotion is a pure-core side effect of *any* eligible action — no UI
affordance, no interaction, no chance for the player to "do something".

### 2.2 CHANNEL DEFECT — the rung-up STORY prose is mis-routed to Progress (F103)

Every rung's `rewardOnReach.log` uses `channel: 'milestone'`
(`src/core/content/ranks.ts:71, 103, 142, …`), which maps to the **Progress**
filter (`src/ui/log-filter.ts:29`), *not* the **Story** filter (`narration`,
`log-filter.ts:26`). But the R1 line quoted in §1 is **diegetic story prose** —
Genemon speaking, the fiction of being taken on as a kept hand. **F103 is
explicit: _"That does not belong in progress — that's part of the story."_**

So the concrete current-state defect is a **channel mis-route**: the promotion's
**story prose** belongs on the **Story channel** (`narration`), while at most a
terse **mechanical marker** (_"Rank ↑ — Kept hand 下人"_) may stay on Progress.
Today the whole prose paragraph lands on Progress, so a player reading the
**Story** view sees *nothing* for their promotion. (This also explains the
human's "combat log" phrasing in F97 — the prose is simply in the wrong,
non-Story tab.)

**Two-part fix:**
- **Small pure-core fix, could land AHEAD of the full beat:** re-channel the
  rung-up prose from `milestone` → `narration` (split off an optional terse
  Progress marker if the human wants the mechanical "Rank ↑" record kept there).
  This is a data-only change in `ranks.ts` `rewardOnReach.log` — low-risk, and it
  fixes the "story in Progress" defect immediately even before the beat ships.
- **Full fix (this plan):** the beat's narrative plays **in the VN modal**, so it
  never lands passively in any log tab at all; the modal *is* the story surface,
  and only the mechanical marker (if any) drops to the log on apply.

### 2.3 The motivation copy already exists — it's the *delivery* that's wrong

The "why" lines the human is asking for are **already authored** — they just fire
instantly and passively into the log:

- `room-gate-forecourt` reveal (`src/core/content/surfaces.ts:95-101`): _"The
  gate and the swept forecourt are yours to work now — stores come and go here."_
- `room-home-paddies` (`surfaces.ts:102-107`): _"The terraced home paddies open
  to you — the rice that feeds the house."_
- `panel-estate` (`surfaces.ts:78-84`): _"The estate's own state of repair is
  yours to tend now — spend the house's surplus to shore it up."_
- Plus each rung's milestone line (the granter's voice — Genemon at R1, etc.).

**Implication:** a large fraction of this work is **re-routing existing copy into
a player-initiated beat**, not writing it from scratch. The new authoring is the
*interactive* layer (topics + choices) and the *new-character* meets.

### 2.4 The reveal engine

Surfaces (`src/core/content/surfaces.ts`) are data with an `unlock` predicate.
Most rung surfaces are `unlock: () => false` and are revealed **explicitly** by a
rung's `rewardOnReach.unlock` (via `revealSurface`, `src/core/unlock.ts:19`); a
few are **state-predicate** back-reveals keyed to a latched surface (e.g.
`panel-estate` keys off `panel-rung-ladder`, `surfaces.ts:78-80`; the **pedlar
market** rides on `panel-estate`, `src/ui/render.ts:2789`). `revealPass`
(`unlock.ts:42`) latches newly-earned surfaces write-once, so a reload never
re-spams reveals.

**Key constraint:** several later surfaces read the **latched `rank-rN` flags**
(e.g. `dream-2` reads `rank-r3`, `surfaces.ts:280`). Those flags must still be
set — just at **beat completion**, not at raw meter-fill.

### 2.5 The VN scene infrastructure to reuse (D-104, just rebuilt append-only)

- **Data:** `DialogueScene` (`src/core/content/intro.ts:69-76`) = `greeting[]` +
  `topics[]` (the ask-hub) + `decision` (the balanced `IntroOption[]` closer).
  `DIALOGUE_SCENES` holds the 3 intro scenes; `introSceneAt`/`availableTopics`/
  `introTopic`/`introSceneOption` (`intro.ts:364-382`) read them.
- **State:** the `introBeat` cursor (`src/core/state.ts:127`, `-1`=pre-wake,
  `0..N-1`=at scene i, `N`=done). `open_eyes` sets it to 0; the decisions advance
  it. `npcMemory` (`state.ts:122`) is per-NPC and persists across ascension.
- **Reducers:** `advance_intro` / `ask_topic` / `choose_intro`
  (`src/core/intents.ts:227-299`) reveal greeting/answers/reactions, apply the
  ±1/∓1 stat + memory + perk line, and advance the cursor via `enterNextBeat`.
- **Renderer:** `syncIntroScene` (`src/ui/render.ts:1606`) mounts a **full-screen
  washi surface on `root` that HIDES the shell**; `buildIntroShell` builds once
  per scene, `reconcileIntro` (`render.ts:1567`) is **append-only** (F81) — the
  world inks in *after* the scene ends. The renderer gates the whole thing on
  `introActive(state.introBeat)` (`render.ts:2636, 3001`).

This is exactly the "reusable meet-an-NPC dialogue trigger" D-104 named as future
work. The rung beat **generalizes** it. ⚠️ The append-only VN engine was *just
rebuilt* (`docs/plans/2026-07-02-append-only-rendering-engine.md`, active) —
**build ON it, do not fork it.**

---

## 3 · The model — pending promotion → player-initiated beat → apply + reveal

Replace the instant hot-path promotion with a three-state machine:

```
meter fills + storyGate met  →  PROMOTION READY (pending, not applied)
        │  player clicks "Begin the beat" (a UI affordance, never auto)
        ▼
   VN BEAT PLAYS (full-screen modal, reusing the D-104 scene)
        │  the beat narratively motivates the new unlocks (+ any new NPC/entity)
        │  player continues / asks / chooses to the terminal node
        ▼
   APPLY: bump rung, reset meter, set rank-rN flags, reveal the now-motivated
          surfaces, refill satiety  →  the world inks in the new panels
```

### 3.1 Core changes (pure, deterministic — keep the core/UI boundary)

1. **Stop auto-applying on the hot path.** `finish()` (`intents.ts:117`) drops
   `promoteRungs`; it becomes `revealPass(state)` only. The meter simply **holds
   at `ready`** (it already caps visually — the ladder clamps the fill to 92% and
   shows _"Ready to advance."_, `render.ts:848-865`).
2. **Extract the apply.** Split `promoteRungs` into:
   - `applyPromotion(state)` — the current promote body (bump rung, reset meter,
     `applyRewards(rewardOnReach)`, refill satiety) for **exactly one** rung.
   - `promotionReady(state)` — thin wrapper over the existing
     `rungProgress(state).ready` (`ranks.ts:25-34`).
3. **New cursor + intents** (mirror the intro's, reusing its reducer helpers):
   - State: a `rungBeat` cursor (or `activeRungBeat: RankId | null`) —
     additive field, defaults inert.
   - `begin_rung_beat` — guard: `promotionReady && no beat active && not in
     intro`. Opens the target rung's scene (reveals its greeting).
   - `advance_rung_beat` / `ask_rung_topic` / `choose_rung_option` — reuse the
     `advance_intro`/`ask_topic`/`choose_intro` logic. On the **terminal node**,
     call `applyPromotion` + clear the cursor.
4. **One rung per beat.** The old while-loop could skip multiple rungs silently;
   the beat model gives **one story transition per rung** — exactly the ask.

### 3.2 Reuse vs generalize the VN scene (two implementations to pick between)

- **(a) Parallel registry, shared type + renderer (LOWER RISK — recommended).**
  Keep `DIALOGUE_SCENES` (intro) untouched; add a `RUNG_BEATS: Record<RankId,
  DialogueScene>` (or a lighter `NarrationBeat` for thin rungs). Add a `rungBeat`
  cursor beside `introBeat`. Generalize the renderer's gate from
  `introActive(introBeat)` to `vnActive(state)` (intro OR rung beat) and point
  `syncIntroScene` at "the active scene, whichever registry". The append-only
  machinery (`buildIntroShell`/`reconcileIntro`) is scene-source-agnostic already.
- **(b) Unify into one `SCENES` registry + one `activeScene` cursor (CLEANER,
  MORE CHURN).** Fold intro scenes and rung beats into one registry with a single
  cursor and a `trigger` predicate per scene. Truest to D-104's "reusable
  meet-an-NPC trigger", but touches the just-rebuilt engine + the intro migration
  more.

**Recommendation: (a)** — build ON the append-only engine with minimal churn;
promote to (b) later if more scene sources appear.

### 3.3 The UI affordance (never auto)

The rung ladder card already renders _"Ready to advance."_ when
`rungProgress().ready` (`render.ts:864`). Turn that into a **button** —
_"Begin the beat"_ / _"Answer the summons"_ — that dispatches `begin_rung_beat`.
(See open question 7 for placement alternatives: ladder card vs HUD prompt vs
log affordance.)

---

## 4 · Scope options (diverge — the human picks)

Every option fixes the silent pop-in. They differ in **how interactive** each
rung beat is and **which rungs get a full character VN vs a light narration
beat**. All reuse the `DialogueScene` type + the append-only renderer (§3.2a).

### Option 1 — Minimal: a narration beat per rung

- **What it adds:** every rung R1→R7 gets a **greeting-only** scene (topics `[]`,
  a decision with zero options → the existing `advance_intro` "Continue" path).
  The granter narrates the promotion + the "why" of each unlock (re-routing the
  §2.3 copy into the modal, spoken by the rung's `granter`). One "Continue" →
  `applyPromotion`.
- **Build cost:** **LOW.** One `pendingPromotion` flag + `rungBeat` cursor + the
  begin/advance intents + one button + re-routing existing copy. Little new prose.
- **Rung treatment:** all rungs identical (narration only).
- **Fun:** fixes the pop-in and gives each promotion weight + a click, but **no
  interactivity** — it reads as a "press to continue" cutscene.
- **Risk:** LOW. Mostly plumbing + copy-move. No new dialogue trees.

### Option 2 — Fuller: character VN at milestone rungs, narration between (RECOMMENDED DEFAULT)

- **What it adds:** the rungs that introduce a **new granter or a major
  capability** get a **full VN meet** (greeting → ask-hub → a balanced choice,
  like the intro), reusing `DialogueScene` verbatim; the "thin" rungs get an
  Option-1 narration beat. Split (proposal, see OQ2):
  - **Full VN meets:** **R3 Kihei** (the drillmaster — a NEW character; combat
    goes live), **R6 Chiyo** (Lady Chiyo — named granter, not yet met),
    **R7 the lord Shigemasa** (the capstone meet).
  - **Narration beats:** **R1, R2, R4, R5** (Genemon — already met in the intro,
    so these deepen a known relationship rather than introduce one).
- **Build cost:** **MEDIUM.** 3 dialogue trees (topics + a balanced choice each) +
  4 narration beats + the plumbing. Each choice can grant a small perk/attr lean
  (reuse `IntroOption`/`applyIntroStat`/`introPerkLine`) or be flavor-only (OQ).
- **Fun:** **HIGH.** New characters land with real weight (D-104's intent), each
  milestone promotion is a genuine interaction, and the thin rungs still get
  motivated without bloating the fast idle climb.
- **Risk:** MEDIUM. Content authoring + choosing whether milestone choices carry
  mechanics. Honors D-104's "reserve the full VN so it never becomes wallpaper".

### Option 3 — Deepest: every rung a full branching choice beat

- **What it adds:** all 7 rungs are full VN scenes with topics + a balanced
  perk-granting choice + per-NPC memory writes, plus dedicated **entity-discovery
  VN beats** for vendors. A true parallel to the intro's 3 scenes, ×7.
- **Build cost:** **HIGH.** 7 dialogue trees + 7 balanced perk sets to author &
  balance + pacing work.
- **Fun:** HIGH ceiling, but **real risk the pattern becomes wallpaper** (D-104
  explicitly warns against this) and that a full modal on *every* rung breaks the
  flow of a fast idle climb.
- **Risk:** HIGH. Most content + balance surface; most likely to over-serve.

---

## 5 · Entity discovery (F99) — folded into the same design

Generalize "motivate the unlocks" to **"motivate the unlocks AND the people /
vendors."** Reuse the **D-104 split**:

- **Ambient entity (no story weight, no real choices)** → a **one-line discovery
  reason**, woven into the motivating rung beat (or a tiny standalone narration
  the first time it becomes available). **Not** a full VN modal.
- **Character who matters (story weight / can be answered)** → a **full VN meet**,
  same as a milestone-rung granter.

### 5.1 The pedlar — worked example

Today the pedlar market rides on `panel-estate` and simply appears at R1
(`render.ts:2787-2803`), with a passive blurb (_"A pedlar passes now and then…"_).
Under the redesign the pedlar is **discovered**, not popped in:

- **Who / why:** he is an **ambient vendor** → no VN modal. His arrival is
  **motivated by the R1 gate & forecourt unlock** — the R1 beat already says
  _"the gate and swept forecourt are yours to work now — stores come and go
  here."_ Add one line (narration or Genemon): now that the forecourt is tended,
  a **travelling pedlar stops by**, and you may spend **your own coin** with him.
  One beat covers the area **and** the vendor — no separate silent panel.
- **Result:** the pedlar panel reveals **as part of the R1 beat's apply step**,
  with an in-fiction reason, instead of blinking into existence beside the estate
  panel.

### 5.2 The general rule

Any surface that represents a **person or a place with a face** (a merchant, a
future NPC, a named location) reveals **through a beat that names why it's now
there** — a one-line reason for ambient entities, a full VN meet for characters
who matter. Purely mechanical surfaces (a readout, a skill row) can still reveal
inline as today; the discipline is specifically for **entities and areas the
player would ask "why is this here?" about.**

---

## 6 · Unlock → rung → motivator map

From `src/core/content/ranks.ts` `rewardOnReach` + the surface reveal lines:

- **R1 · Kept hand — Genemon** (narration beat) — ⭐ **the worked first example
  (F103).** Today R1 (day-labourer → kept hand) gives the player *only* the one
  Genemon line from §1, mis-routed to Progress — no interaction, no motivation
  for the four things it silently unlocks. Under the redesign this becomes the
  **first player-initiated beat**: the player clicks "begin the beat" when the
  meter is ready; Genemon speaks (in the VN modal, Story channel) and motivates
  each unlock as he grants it — the **gate & forecourt** (_"stores come and go
  here"_), the **home paddies** (_"the rice that feeds the house"_), farm/haul
  verbs, the clock + stamina readouts, the **estate-repairs panel** (_"the
  estate's own state of repair is yours to tend now"_), **and the pedlar** (F99,
  §5.1). On completion, the promotion applies and those panels ink in. This one
  rung is the smallest end-to-end proof of the whole model — a good first build
  target.
- **R2 · Trusted hand — Genemon** (narration beat). Motivates: the **Skills**
  tab, the woodlot + near/deep satoyama rooms, woodcut/forage verbs, conditioning,
  **+ the wolf hook** (_"a wolf has been at the grain stores…"_).
- **R3 · Gate-watch — Kihei the drillmaster** (⭐ FULL VN meet — new character).
  Motivates: the **Combat tab**, the **drill yard**, the weapon + fight loop, the
  **Bestiary**, the House-Influence teaser. _"There is a soldier in you under the
  farmhand."_
- **R4 · Kura-warden — Genemon** (narration beat). Motivates: weapon
  **durability** + **repair** + the **Equipment/craft** loop, the **omoya**
  (main house) reopening. _"Mind the stores as if the rice were your own."_
- **R5 · House-servant — Kihei or Genemon** (narration beat; note the reward log
  is Genemon's but the unlocked **stance control** is a *combat* teach → the beat
  could have **Kihei** teach the stance while Genemon confers the standing —
  resolve in OQ2). Motivates: the **stance control**.
- **R6 · Steward's man — Lady Chiyo** (⭐ FULL VN meet candidate — named granter,
  not yet met). Motivates: the **workshops** + the **second granary**.
- **R7 · Trusted of the house — the lord Shigemasa** (⭐ FULL VN meet — the
  capstone). Motivates: the **lord's study**, and sets `t0-capstone` (opens
  Phase 2). _"You came to us with no name and nothing in your hands. Look what
  those hands have done."_

---

## 7 · Recommended default (bias to motion — the human decides)

**Option 2** (§4): full VN meets at the **new-character / major-capability**
rungs (**R3 Kihei, R6 Chiyo, R7 the lord**), light narration beats at the Genemon
rungs (**R1, R2, R4, R5**); the **pedlar discovered as a one-line reason inside
the R1 beat** (§5.1). Implementation **§3.2(a)** — a parallel `RUNG_BEATS`
registry reusing the `DialogueScene` type + the append-only renderer, one
`rungBeat` cursor, `applyPromotion` on the terminal node.

Why this default: it fixes the silent pop-in **everywhere** (every rung gets at
least a motivated beat + the pedlar gets a reason), lands the new granters as real
meetings per **D-104**, honors D-104's "reserve the full VN so it never becomes
wallpaper", and adds the least risk to the *just-rebuilt* append-only engine. The
milestone choices can start **flavor-only** (no attr lean) and gain mechanics
later if the human wants — keeping the first build lean.

---

## 8 · Open questions for the human

1. **Scope / depth** — Option **1 / 2 / 3**? (default: **2**.)
2. **NPCs per rung** — accept the §6 mapping (Kihei R3, Chiyo R6, lord R7 full;
   Genemon R1/R2/R4/R5 light)? In particular, **who teaches the R5 stance** —
   Kihei (combat teach) or Genemon (the standing)?
3. **Skippable or blocking?** Is the beat **mandatory** to advance (progress
   holds at "ready" until you play it — recommended, it's the whole point), and
   should the modal be **fast-forwardable / skippable** on replays? Can the
   player **bank** a ready promotion and trigger it later, or does "ready" nag?
4. **Every rung, or only milestone rungs?** Do the thin rungs get a (short)
   beat too (recommended — else they're still silent pop-ins), or do only the
   milestone rungs get a beat while the rest keep a bare log line?
5. **Entity discovery granularity (F99)** — reuse the D-104 split: **ambient
   entities** (the pedlar) get a **one-line reason**, **characters who matter**
   get a **full VN meet**. Confirm the pedlar is ambient (one-liner), and name
   any vendor/NPC that instead deserves a full meet.
6. **Sequencing vs the economy re-core + home/belongings work.** The RICE / COIN
   / KOKU re-core (**D-107–D-109**) is in flight and will rescope the pedlar's
   _"your own koku"_ copy to **coin** (`src/core/content/market.ts`). Build the
   beat framework **now** (copy rescoped later by the economy ripple), or **wait**
   for the economy to land first? (Memory: *no parallel build during a ripple.*)
7. **Affordance placement** — the "begin the beat" trigger as a **button in the
   rung-ladder card** (Progress slice; the ladder already shows "Ready to
   advance." — recommended), a **HUD / top-bar prompt**, or a **log affordance**?
8. **Mechanical marker on Progress (F103)?** Once the story prose moves to the
   Story channel / the modal, should a **terse "Rank ↑ — Kept hand 下人"** marker
   still drop on the **Progress** channel as the mechanical record (recommended —
   keeps a scannable progression log), or does nothing land in the log at all?
   And should the small channel re-route (prose → Story) land **ahead of** the
   full beat as an independent quick fix?

---

## 9 · Risks & notes

- **Build ON the append-only VN engine, don't fork it.** It was *just* rebuilt
  (`docs/plans/2026-07-02-append-only-rendering-engine.md`, active; scene at
  `render.ts:488-1586`). §3.2(a) reuses `buildIntroShell`/`reconcileIntro`
  unchanged and only generalizes the **active-scene gate** (`introActive` →
  `vnActive`) + the scene source. Coordinate landing order with that plan.
- **Core/UI boundary.** The promotion **state machine** (pending → apply) is
  **pure core** (`ranks.ts`/`intents.ts`/`state.ts`); the **beat presentation**
  is **UI** (`render.ts`). Route the beat's derived text through the same content
  the apply uses (the `rewardOnReach` copy) so preview and reality never drift.
- **`promoteRungs` refactor breaks the test + sim surface.** `promoteRungs` is
  called directly by `autoplay.ts` (`focusedOptimalIntent`) and asserted in
  `m1.test.ts` (:103-122), `m2.test.ts` (:225), plus `combat-reveal.test.ts` /
  `estate-reveal.test.ts` read `rewardOnReach`. Extracting `applyPromotion` and
  moving the trigger to a beat means the harness must **drive the beat** (or call
  `applyPromotion` directly) and the tests must assert the new flow. Plan the
  fixtures from source-of-truth (`rungThreshold`, the `rank-rN` flags), not magic
  numbers. Per **D-088** the tier needs a full-arc e2e that walks a promotion
  **through the beat**, and an invariant that no rung advances without its beat.
- **Reveal-gating must fire on beat completion, not raw rung.** The latched
  `rank-rN` flags that later surfaces read (e.g. `dream-2` ← `rank-r3`,
  `surfaces.ts:280`) must still be set — they will be, since `applyRewards` runs
  at `applyPromotion` (beat end), same as today. Verify the `revealPass` timing:
  the new panels should ink in **after** the modal tears down (the intro already
  does exactly this — the world reveals post-scene).
- **Migration.** Additive `rungBeat` cursor ⇒ bump `SCHEMA_VERSION` (currently
  `4`, `src/core/constants.ts:14`). A mid-game save that *already* promoted is
  unaffected (rung + reward already applied); a save sitting at "ready" simply
  shows the button on load; new field defaults inert. Low migration risk — no
  restructuring of existing state.
- **Channel mis-route (F103) — a real defect, not a mis-observation.** The rung
  story prose is on `milestone`/Progress but is **narration/Story** content
  (§2.2). This is a **small, independent pure-core fix** (re-channel in
  `ranks.ts`) that can land **ahead of** the full beat and immediately fixes
  "story shows up in Progress / nothing in Story". Decide whether a terse
  mechanical "Rank ↑" marker is kept on Progress (OQ8). The full beat then moves
  the prose into the modal entirely.
- **Don't let the beat stall a fast idle climb.** If several rungs come ready in
  quick succession (auto-labour), the player shouldn't face a modal every few
  seconds. The one-rung-per-beat + player-initiated trigger already gates this,
  but pacing is a fun-QA check (OQ3/OQ4 interact here).

---

## 10 · Follow-through (on sign-off)

- This plan is a **`docs/plans/` proposal** → it belongs on the **human reading
  queue** (`project/todo-human.md`). *The main session wires that up — this
  investigation does not edit the queue file.*
- Distilled standing rule (already staged in the F97 feedback entry, for
  `ui-design.md` / `fun-factor.md`): _"A rung promotion is an earned STORY
  TRANSITION, not a silent number-fill — player-initiated, played in the VN
  modal, and it narratively motivates each unlock (area, panel, verb, **or
  person**) it grants; the UI reveal follows the story, not the other way
  round."_ Plus the channel corollary (F103): _"Diegetic story prose belongs on
  the **Story** channel; the **Progress** channel is for terse mechanical markers
  only — never route a narrative paragraph to Progress."_

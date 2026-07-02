# Rung-up story transitions — the promotion beat (F97 + F99 + F103)

**Status:** ✅ scope LOCKED (human, 2026-07-02 — **D-110**); **no code changed
yet** — spec-ready for build. The chosen model is **NOT** the earlier "Option 2
default"; see the scope banner below.
**Source steers:** playtest **F97** (rung-up must be a player-initiated story
beat that motivates the unlocks) + coordinator relay **F99** (entities/NPCs like
the pedlar must be *discovered*, not silently popped in) + **F103** (the R1
promotion gave ONLY one log line, mis-routed to Progress — the story prose
belongs in the Story channel). Ties **D-104** (the full-screen VN scene for
story-significant NPCs) and **F89** (narrative ↔ mechanical coherence).

---

## 0 · LOCKED scope (human, 2026-07-02 — D-110)

The human's scope call **supersedes the "Option 2 default" recommendation in §4/§7**
(which are kept below as the option-map that led here). The locked model:

- **EVERY rung is a full, player-TRIGGERED VN story beat** — there is a story
  element at **every** rung. **SOME** rungs introduce a **new character**, others
  deepen a known one; **no rung is a silent number-fill**. (This is the plan's
  Option 3 *shape* — every-rung beats — **without** its every-rung-a-perk payload.)
- **NOT every rung grants a perk.** The three intro perks were a **one-time intro
  boost**, not the standing pattern. Rung beats do **not** each hand out a perk.
- **The beat is player-triggered and ignorable.** A ready promotion **holds**; the
  player must manually **stop grinding, navigate, and trigger** the rung-up story.
  They may **ignore** it and grind combat forever — advancement is **never forced**.
- **Choices are remembered.** Beats carry **CHOICES**; **NPCs REMEMBER** them
  (per-NPC relationships + story flags, persisting across ascension — `npcMemory`).
- **Payload = relationships + flags, with OCCASIONAL small varied bonuses.** Choices
  **mainly** move relationships + story flags; only **every now and then** does a
  choice grant a **small, VARIED** bonus — which can be a **story** bonus, not just a
  flat stat, and is **smaller** than the intro perks. Bonuses are a delight, not an
  expectation.

**Trigger UX (F106).** The "ready to advance" prompt lives on the **header rung
element (F106)** — the compact rung name + progress bar, top-right. When the meter
is ready, that header element becomes the affordance ("Answer the summons" / "Begin
the beat"); **triggering navigates to the beat** (the full-screen VN scene). This
replaces §3.3's ladder-card button as the trigger home (the OQ7 placement question
is resolved to the header).

Everything below (§1–§9) is the investigation + option-map that led to this call;
read §3 (the state machine) and §5/§6 (entity discovery + the unlock→rung map) as
the build spec, with the payload/every-rung rules above overriding the §4/§7
"Option 2" recommendation.

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

### 3.3 The UI affordance (never auto — LOCKED to the header, F106)

The trigger lives on the **header rung element (F106)** — the always-visible rung
name + progress bar, top-right. When `rungProgress().ready`, that element becomes
the affordance — _"Answer the summons"_ / _"Begin the beat"_ — which dispatches
`begin_rung_beat` and **navigates to the beat** (the full-screen VN scene). A ready
promotion **holds/banks** there (never auto-applies, never nags); the player may
ignore it and keep grinding indefinitely (§0). *(The rung ladder card's existing
_"Ready to advance."_ text at `render.ts:864` becomes a secondary cue; OQ7 is
resolved to the header — see §0/§8.)*

---

## 4 · Scope options (diverge — DECIDED, kept as the option-map)

> ⚠️ **RESOLVED by §0 (D-110).** The human picked **every-rung player-triggered
> beats** (Option 3's *every-rung shape*) but **without every-rung perks** — the
> payload is relationships + flags with only occasional small varied bonuses. The
> "Option 2 (RECOMMENDED DEFAULT)" tag below is **superseded**; these options are
> retained only as the reasoning that led to the call.

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

### Option 2 — Fuller: character VN at milestone rungs, narration between (was recommended; SUPERSEDED by §0)

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

### Option 3 — Deepest: every rung a full branching choice beat (CHOSEN SHAPE — see §0)

> ✅ The human picked **this every-rung shape** — but with a **lighter payload** than
> written here: **NOT** "7 balanced perk sets." Choices move **relationships +
> story flags**, with only **occasional small varied bonuses** (which can be story
> bonuses, not just stats). The wallpaper/pacing risk below is answered by the
> **player-triggered + ignorable** trigger (a ready promotion holds; the player
> chooses when to play it), not by cutting rungs.

- **What it adds:** all 7 rungs are full VN scenes with topics + a balanced
  choice + per-NPC memory writes, plus dedicated **entity-discovery
  VN beats** for vendors. A true parallel to the intro's 3 scenes, ×7. **Per §0**
  the choices carry relationship/flag payloads (occasional small varied bonuses),
  **not** a perk per rung.
- **Build cost:** **HIGH** — but lighter than "7 perk sets": 7 dialogue trees +
  relationship/flag writes + a *sparse* set of small bonuses to place & balance +
  pacing work.
- **Fun:** HIGH ceiling; the **wallpaper / fast-climb** risk is mitigated by the
  **player-triggered, ignorable** trigger (§0) — no forced modal, the player banks a
  ready promotion and plays it when they choose.
- **Risk:** MEDIUM–HIGH. Most content surface; the payload discipline (flags first,
  bonuses rare) is what keeps it from over-serving.

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

**Vendor model (D-114).** Every vendor is a **person on a spectrum** — **(a)** a
full VN character (D-104 modal + quests + dialogue), **(b)** a small person (a line
or two + a trade), or **(c)** a tiny trader (zero questions, straight to the trade
menu) — **plus an optional place-gate** (reach/build the location first, e.g. the
smithery before the smith). The pedlar is a **(b)/(c)** ambient trader discovered
via the R1 forecourt beat (§5.1); a vendor who carries story is an **(a)** full VN
meet like a milestone granter. See **D-114** for the full model.

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

## 6.5 · Proposed cast (DRAFT — for human review, D-110)

> **This is an agent DRAFT for the human to approve / edit** — names, roles, which
> rung introduces whom, and a personality sketch, grounded in the **Kurosawa house,
> 1780 (An'ei 9)** fiction (**D-105**). Canonical names come from
> `src/core/content/names.ts` (the single source of truth); **proposed new faces**
> are flagged **⭐ NEW-PROPOSED** and are the parts most open to the human's pen.
> Per D-110, **some** rungs introduce a new character, others deepen a known one.

**Established (canonical, from `names.ts` + the intro):**

- **Genemon** (`elder`) — chief steward of the Kurosawa house; the **first granter**,
  already met in the intro. *Personality:* gruff, fair, watchful; measures you by
  work done "without being told twice." He deepens across R1/R2/R4/R5 — a wary
  keeper who slowly extends trust.
- **Kihei** (`drillmaster`) — master-at-arms. *Personality:* blunt, economical of
  speech, sees the soldier under the farmhand ("there is a soldier in you"). The
  house's hard edge.
- **Lady Chiyo** (`steward`) — the house's inner authority. *Personality:* gracious
  but exacting; runs the household's real machinery; her regard is earned, not given.
- **Shigemasa** (`lord`) — the aging lord of the Kurosawa house. *Personality:*
  weary, dignified, long-sighted; speaks rarely and weightily.
- **Sōan** (`physician`) — the debunker-physician (met in the cold-open); stays
  **talkable** (F110), not consumed after the intro.

**Rung-by-rung cast (which beat introduces / deepens whom):**

| Rung | Granter | New or deepen | Personality beat (draft) |
|---|---|---|---|
| **R1 · Kept hand** | Genemon | deepen (intro-met) | Wary acceptance — "Stay. Earn your rice." Motivates gate/forecourt, paddies, the pedlar. |
| **R2 · Trusted hand** | Genemon | deepen | Grudging warmth; hands you the woodlot + the wolf hook. Could introduce a **⭐ NEW-PROPOSED fellow kept-hand** (see below) for camaraderie. |
| **R3 · Gate-watch** | **Kihei** | ⭐ NEW meet (full VN) | The drillmaster sizes you up; combat goes live. Blunt, testing. |
| **R4 · Kura-warden** | Genemon | deepen | Trust deepens — "Mind the stores as if the rice were your own"; hands you the kura key. |
| **R5 · House-servant** | Genemon **+** Kihei | deepen | Genemon confers the standing; **Kihei teaches the stance** (combat teach). Resolve the two-voice split (OQ2) — draft: Kihei teaches, Genemon witnesses. |
| **R6 · Steward's man** | **Lady Chiyo** | ⭐ NEW meet (full VN) | First meeting with the house's inner authority; opens the workshops + second granary. Exacting, gracious. |
| **R7 · Trusted of the house** | **Shigemasa** | ⭐ NEW meet (full VN, capstone) | The lord calls you to the inner rooms — "You came to us with no name… look what those hands have done." Opens Phase 2. |

**Proposed new faces (⭐ agent invention — most open to edits):**

- **⭐ A fellow kept-hand** (unnamed draft — propose **e.g. "Rokusuke"**, a
  plain servant's name) — introduced around **R2** as a peer: someone who was kept on
  before you, half-friend / half-rival, giving the early climb a human companion and
  a voice for house gossip (the wolf, the pedlar's rumours). *Purely a proposal — cut
  or rename freely.*
- **⭐ The pedlar** (ambient, F99/§5.1) — a **travelling trader**, discovered via the
  R1 forecourt beat, not a full VN character (a D-114 "(b) small person" or "(c) tiny
  trader"). Propose **"the Ōmi pedlar"** as a regional flavour tag, and — optionally —
  a personal name **⭐ "Tokubei"** for when the R2 gossip beat wants to *name* him. A
  name is entirely optional; cut it and he stays "the pedlar."
- **⭐ The smith** (unnamed draft — propose **e.g. "Tōzō"**, a plain forge-hand's
  name) — introduced at **R4** when the **woodlot smithy** opens (`panel-equipment` /
  `verb-repair`): a gruff old craftsman who teaches you to read a blade's wear, strip
  the carcasses, and forge/repair an edge. A D-114 "(b) small person" tied to the
  smithy **place-gate**, not a full milestone VN meet. *Rename or fold into Kihei
  freely.*
- **Naoyuki** (`heir`, canonical but unused in the rung beats) — the lord's heir. A
  candidate to seed at **R6/R7** as a younger, warier counterweight to Shigemasa, if
  the human wants a Phase-2 hook. *Held, not scheduled — flag for the human.*

**Open cast questions for the human:** (1) approve/rename the ⭐ new faces; (2)
confirm the R5 two-voice split (Kihei teaches the stance, Genemon confers standing);
(3) decide whether Naoyuki appears in T0 rung beats or waits for Phase 2.

---

## 6.6 · Full R0→R7 rung-beat outline (DRAFT — for human review)

> **Agent DRAFT for the human's async sign-off** (per D-110's "surface story/cast").
> The **shape** is spec — every rung is a player-triggered VN beat that *motivates*
> its unlocks (§0/§7) — but the **prose, choices, and new faces are proposals**,
> most open to the human's pen. Legend: **canon** names come from `names.ts`
> (Genemon, Kihei, Chiyo, Shigemasa, Sōan, Naoyuki); **⭐ = agent-invented**, approve
> or rename freely. **Payload discipline (§0):** choices move **relationships +
> flags**; a **small varied bonus** rides along only where marked *[bonus]* — rare,
> smaller than the intro perks, and often a *story* flag rather than a stat. Each
> beat's per-rung unlocks are pulled verbatim from `ranks.ts` `rewardOnReach`; the
> "why" prose reuses the already-authored `surfaces.ts` reveal lines (§2.3), now
> *spoken in the beat* instead of dumped to the log.
>
> **Build note (relationships):** new remembered NPCs (`chiyo`, `shigemasa`,
> `rokusuke`, the smith) need `NpcId` entries in `voices.ts` + `npcMemory` keys —
> Kihei is already wired. This is flagged, not scoped, here.

### R0 · Day-labourer 日雇 — *the intro IS the beat (no new trigger)*

- **Unlocks (mechanical):** the cold-open verbs — `verb-open-eyes`, `verb-rake`
  (rake the spilled stores), `verb-rest` — and the body + rice readouts. These
  reveal through the **cold open**, not a rung reward, so R0 has no `rewardOnReach`.
- **Beat — *no promotion into R0*:** you *land* here at the close of the intro's
  three VN scenes (Sōan → the dream → Genemon). The intro's **Genemon scene already
  IS the R0 beat** — he watches you reach for the spilled rice and sets you to raking
  as a day-hired hand. **Why you rake:** the stores spilled and the house is "short
  of hands." **No new modal** — a second Genemon meet moments after the intro's
  Genemon scene would be redundant; **R1 is the first *new* player-triggered beat.**
- **Choice:** carried by the intro's existing Genemon decision (earnest / wary /
  silent → `genemon` memory). No new choice.
- **New face:** none — Sōan + Genemon already met in the cold open.

### R1 · Kept hand 下人 — Genemon *(deepen; light-VN)*

- **Unlocks:** `room-gate-forecourt`, `room-home-paddies`, `verb-farm`, `verb-haul`,
  `readout-clock`, `readout-stamina`, `panel-rung-ladder` (→ back-reveals
  `panel-estate` = the kura-repairs sink, and the **pedlar market**); `readout-coin`
  back-reveals on your first porter's wage. Flag `rank-r1`.
- **Beat — Genemon, dawn at the gate & swept forecourt:** you've raked the stores
  clean "without being told twice," so Genemon keeps you on — no longer day-hired.
  **Why the unlocks:** he gives you the run of the **gate & forecourt** ("stores come
  and go here"), the **home paddies** ("the rice that feeds the house"), and — because
  a watched, tended forecourt draws trade — a **travelling pedlar** (⭐ the Ōmi pedlar)
  now stops his mat by the gate; you may spend your own coin with him (F99 discovery,
  woven into this beat, **not** a silent panel). He also lets you put the house's small
  surplus toward **shoring up the kura** (`panel-estate`).
- **Choices — how you take the keeping:**
  1. **"The house has my hands."** Dutiful. → `genemon` warmth +1; flag `r1-dutiful`.
  2. **"A roof and rice is a fair trade."** Practical, transactional-but-honest. →
     `genemon` neutral; flag `r1-practical`.
  3. **"I mean to rise past a kept hand."** Hungry, ambitious — he's wary of ambition
     in a new hire. → `genemon` warmth −1, regard `ambitious`; flag `r1-ambitious`
     (seeds later beats). *Relationship/flag only — R1 stays lean, no bonus.*
- **New face:** **⭐ the Ōmi pedlar** — ambient trader, road-worn and shrewd; a line
  or two + a trade, not a VN meet. *Voice:* "A tended gate's a lucky gate for a man
  with a pack — mind if I lay my mat here a while, young master?"

### R2 · Trusted hand 手代 — Genemon *(deepen)* + ⭐ Rokusuke *(new peer)*

- **Unlocks:** `tab-skills`, `room-woodlot-edge`, `room-near-satoyama`,
  `room-deep-satoyama`, `verb-woodcut`, `verb-forage`, `verb-face-wolf`, `row-wood`,
  `row-sansai`, `skill-conditioning`; flags `rank-r2`, `porters-knot` (→ later feeds
  the `dream-2` payoff). The narrator's porter's-knot beat rides the apply step.
- **Beat — Genemon at the woodlot edge, with a fellow hand:** you can be set a task
  and trusted to finish it unsupervised, so Genemon gives you the run of the **woodlot
  + near hill**. **Why the wider estate:** the house needs fuel and forage, and it now
  trusts you off the forecourt. He introduces (or you simply meet) **⭐ Rokusuke**, a
  kept-hand from two winters back, who shows you the woodlot and passes house gossip —
  and the hook: **a wolf has been at the grain stores in the night** (`verb-face-wolf`;
  the R2→R3 story-gate). "Someone must face it — and there is no one else to send."
- **Choices — how you take the wolf rumour / regard Rokusuke:**
  1. **"The stores are the house's life — I'll face it."** Duty first. → `rokusuke`
     regard `respected`; flag `r2-wolf-heeded`.
  2. **"Trade the gossip — learn the house through him."** Camaraderie. → `rokusuke`
     warmth +1; flag `r2-rokusuke-friend`. *[bonus]* he tips you to the pedlar's
     softer prices — a small **story flag** the market read can later honour.
  3. **"Keep to myself — the work's enough."** Self-reliant. → `rokusuke` warmth −1;
     flag `r2-solitary`.
- **New face:** **⭐ Rokusuke** — plain, wry, half-friend/half-rival; the early
  climb's human companion and gossip-voice. *Voice:* "Do the work, keep your head
  down, and don't let the old steward catch you idle — that's the whole of it."

### R3 · Gate-watch 門番 — ⭐ Kihei *(NEW · full VN meet — combat goes live)*

- **Unlocks:** `tab-combat`, `panel-drill-yard`, `readout-combat-level`,
  `panel-bestiary`, `panel-house-influence` (the macro teaser); flags `rank-r3`,
  `combat-unlocked`. Story-gate to reach it: `combat-blooded` (you've stood a real
  watch). Later, gated on combat level: the `screen-demo-frontier` capstone + `dream-2`.
- **Beat — Kihei, first light in the drill yard *(first appearance — a full D-104
  meet: greeting → ask-hub → balanced choice)*:** you've blooded the blade against the
  grain-store wolf, and the master-at-arms takes you on as **gate-watch**. **Why combat
  opens:** he sees "a soldier in you under the farmhand" — he hands you a weapon, a
  **yard to train in**, and the estate's **defence** (pests, beasts, the masterless men
  on the woodlot road). He sets you to keep a **bestiary** (field-guide, fogged until
  faced); and standing in the yard you first glimpse how a house is truly *weighed*
  (`panel-house-influence`), a reckoning "far above a gate-watch."
- **Ask-hub topics (draft):** "Why set me to the blade?" · "What's out on the woodlot
  road?" · "Who are you, drillmaster?" (Kihei's own past — the house's hard edge).
- **Choices — how you take up the blade:**
  1. **"Show me how to end a fight fast."** Eager for the kill — he distrusts
     glory-hunger. → `kihei` regard `eager`, warmth −1; flag `r3-aggressive`.
  2. **"Teach me to stand a watch."** Disciplined, steady. → `kihei` warmth +1; flag
     `r3-disciplined`. *[bonus]* Kihei drills you an extra dawn — a small,
     **combat-flavoured** edge (a named starting-form flag, smaller than an intro perk).
  3. **"I'd rather the paddies — but the house needs it."** Reluctant, honest. →
     `kihei` regard `reluctant`; flag `r3-duty-not-glory`. *[bonus]* he respects the
     honesty — a small **story** flag Kihei's later lines read.
- **New face:** **Kihei** *(canon)* — blunt, economical of speech, the house's hard
  edge. *Voice:* "There's a soldier in you under the farmhand. We'll find the rest of
  it yet."

### R4 · Kura-warden 蔵番 — Genemon *(deepen)* + ⭐ the smith *(new, at the smithy)*

- **Unlocks:** `readout-durability`, `panel-equipment` (the woodlot smithy — strip
  carcasses, forge/equip), `verb-repair`, `house-omoya` (the main house reopens); flag
  `rank-r4`.
- **Beat — Genemon at the kura, then the woodlot smithy:** Genemon hands you the
  **kura key** — "Mind the stores as if the rice were your own. The house is forgetting
  you were ever a stranger." **Why craft/repair opens:** the **woodlot smithy** is now
  yours to use, and **⭐ the smith (Tōzō)** teaches you to read a blade's wear, strip
  what the carcasses give up, and forge/keep an edge. **Why the omoya:** the main
  house's shuttered rooms — closed since the lean years — are aired and swept as the
  house's fortunes (and your standing) rise; "you walk floors the family walks."
- **Choices — how you hold the kura key & the surplus:**
  1. **"Every grain accounted."** Thrifty steward. → `genemon` warmth +1; flag
     `r4-thrifty`.
  2. **"Spend it on the house's needs."** A mended kura feeds everyone. → `genemon`
     neutral, `smith` warmth +1; flag `r4-generous`. *[bonus]* the smith, seeing you
     invest in the forge, gifts a small edge — a modest **durability/repair** flavour
     (occasional, smaller than an intro perk).
  3. **"Keep a little back for myself."** Self-interest, remembered. → `genemon`
     warmth −1 (a crack of doubt); flag `r4-self-keeping`.
- **New face:** **⭐ the smith (Tōzō)** — gruff, exacting about tools; tied to the
  smithy place-gate. *Voice:* "A blade you don't tend turns on you. Bring me the hides
  and the iron; I'll show you what an edge wants."

### R5 · House-servant 家人 — Genemon *confers* + Kihei *teaches* *(two-voice; OQ2)*

- **Unlocks:** `stance-control` (glass-cannon ↔ tank, the last staggered combat
  surface); flag `rank-r5`.
- **Beat — the omoya, then the drill yard *(two-voice — draft resolution of OQ2)*:**
  **Genemon confers the standing** in the omoya — "no longer a season-hired hand, but
  one who answers to the house day and night. The work is the same; the standing is
  not." Then, because that standing carries the trust to make your own tactical calls,
  **Kihei teaches the stance** at the yard — "set your stance before a foe... the call
  is yours, fight by fight." *(Draft: Kihei teaches the combat surface, Genemon
  witnesses/confers — resolve the split with the human; see §8 OQ2.)*
- **Choices — your stance philosophy (ties to the `stance-control` you just gained):**
  1. **"Press every fight — end it, don't outlast it."** → `kihei` regard
     `aggressive`; flag `r5-stance-aggressive`. *[bonus]* sets your **default stance**
     flavour to attack (a *story* default, not a raw stat).
  2. **"Guard first — a live watchman beats a dead hero."** → flag `r5-stance-guard`;
     default stance guard.
  3. **"Read the foe — the call changes fight by fight."** The wise pick. → `kihei`
     warmth +1; flag `r5-stance-adaptive`.
- **New face:** none — deepens Genemon + Kihei.

### R6 · Steward's man 用人 — ⭐ Lady Chiyo *(NEW · full VN meet)*

- **Unlocks:** `house-workshops`, `house-granary`; flag `rank-r6`.
- **Beat — Lady Chiyo, the omoya's formal room *(first meeting — full VN meet)*:** the
  house's inner authority sets you to the **steward's errands** — ledgers carried,
  messages run, the house's small business in your hands. "They are weighing you for
  something larger than a servant." **Why the workshops + granary:** the house's risen
  fortunes wake the **workshops** (a smith's forge, a joiner's bench) and raise a
  **second granary** (the itakura); Chiyo puts these under your oversight.
- **Ask-hub topics (draft):** "What does the inner house need?" · "Why trust an
  outsider?" · "The lord — is he well?" (a Shigemasa/Naoyuki hook toward R7; see OQ).
- **Choices — how you serve the inner house:**
  1. **"The house's name is my name now."** Loyal. → `chiyo` warmth +1; flag
     `r6-loyal`.
  2. **"I'd carry more than errands."** Ambitious — seeds Phase-2. → `chiyo` regard
     `ambitious`; flag `r6-ambitious`.
  3. **"A steward's man keeps the house's silences."** Discreet — she prizes it. →
     `chiyo` warmth +1; flag `r6-discreet`. *[bonus]* Chiyo's confidence — a small
     **story** flag that opens a later inner-house thread.
- **New face:** **Chiyo** *(canon)* — gracious but exacting; runs the household's real
  machinery, her regard earned not given. *Voice:* "The steward keeps the house's back;
  I keep its books and its name. Serve me well and the house will not forget it."

### R7 · Trusted of the house 内衆 — ⭐ Shigemasa *(NEW · full VN meet — capstone)*

- **Unlocks:** `house-study` (the shoin — the lord's writing-room); flags `rank-r7`,
  `t0-capstone` (opens **Phase 2** + the House-Influence measure).
- **Beat — the lord Shigemasa, the inner rooms *(the capstone meet)*:** the lord
  himself calls you in — "You came to us with no name and nothing in your hands. Look
  what those hands have done." For the first time the house reckons your worth not as a
  servant but as a man who might one day carry its **standing**. **Why the study
  opens:** the lord admits you to the **shoin**, where the house's real business is
  done — "few servants ever cross that threshold." `t0-capstone` fires: the measure of
  the House takes shape before you.
- **Ask-hub topics (draft):** "How is a house weighed?" (the House-Influence measure) ·
  "What would you have of me?" · "And your heir?" (a Naoyuki seed — OQ).
- **Choices — how you answer the lord *(the capstone; colours the Phase-2 framing —
  its one varied payload):***
  1. **"I'll carry the Kurosawa name as far as it can go."** Devotion to the house. →
     `shigemasa` regard `devoted`; flag `r7-devoted`. *[bonus]* a capstone **story**
     flag tilting Phase 2 toward the house's rise.
  2. **"A name can be *made* as well as served."** Ambition. → `shigemasa` regard
     `ambitious`; flag `r7-ambitious`. *[bonus]* colours Phase 2 toward your own rise.
  3. **"I only did the work in front of me."** Humility. → `shigemasa` warmth +1; flag
     `r7-humble`. *[bonus]* a small **story** flag the lord's later lines honour.
  *(`t0-capstone` fires regardless of the pick; the choice only colours the framing.)*
- **New face:** **Shigemasa** *(canon)* — weary, dignified, long-sighted; speaks rarely
  and weightily. *Voice:* "Look what those hands have done."

### Beat-outline open questions (BQ — for the human; distinct from §8's build OQs)

- **BQ1 · New-face count.** This outline introduces **three ⭐ invented faces** —
  **the Ōmi pedlar** (R1), **Rokusuke** (R2), **the smith / Tōzō** (R4) — plus the four
  canon meets (Kihei R3, Chiyo R6, Shigemasa R7; Genemon throughout). Is three new
  invented faces the right *density*, or should any (esp. the smith) fold into an
  existing character (e.g. Kihei covering the forge)?
- **BQ2 · Bonus placement.** Small varied bonuses are marked *[bonus]* on **six**
  branches (R2 friend, R3 disciplined + reluctant, R4 generous, R5 stances, R6 discreet,
  R7 all three). Is that the right *rarity* (they're meant to be a delight, not an
  expectation — §0), and should any be cut to keep the ladder flatter?
- **BQ3 · R5 two-voice.** The draft resolves OQ2 as **Kihei teaches the stance,
  Genemon confers the standing** in one two-part scene. Confirm, or make it a single
  voice (whose?).
- **BQ4 · Capstone choice weight.** Should the R7 choice's Phase-2 *colour* (devoted /
  ambitious / humble) actually **branch anything** in Phase 2, or stay a remembered
  flag + a line of flavour for now?
- **BQ5 · Naoyuki.** Seed the heir as a topic-line at **R6/R7** (a warier counterweight
  to Shigemasa, a Phase-2 hook), or hold him entirely for Phase 2? *(Mirrors §6.5's
  cast-Q3 and §8 OQ — one call covers both.)*
- **BQ6 · Naming the pedlar.** Keep him "the Ōmi pedlar" (ambient, unnamed), or promote
  him to a named **⭐ Tokubei** once the R2 gossip beat references him by name?

---

## 7 · Chosen scope (LOCKED — human, 2026-07-02, D-110)

> This section originally recommended Option 2; the human's call is recorded in §0
> and **D-110**. The chosen scope, restated:

**Every rung is a full, player-triggered VN beat** (§0). Every R1→R7 rung gets a
beat — **some introduce a new character** (e.g. **R3 Kihei**, **R6 Chiyo**, **R7 the
lord** as the plan's §6 map already flags), others deepen a known one (the Genemon
rungs). Choices are **remembered** (relationships + story flags); the payload is
**relationship/flag-first**, with only **occasional, small, varied** bonuses (which
can be story bonuses, not just stats — smaller than the intro perks). **Not every
rung grants a perk.** The beat is **player-triggered from the header rung element
(F106)** and **ignorable** — a ready promotion holds; grinding never forces it.

Implementation **§3.2(a)** — a parallel `RUNG_BEATS` registry reusing the
`DialogueScene` type + the append-only renderer, one `rungBeat` cursor,
`applyPromotion` on the terminal node.

Why this shape: it fixes the silent pop-in **everywhere** (every rung is motivated +
the pedlar gets a reason, §5.1), lands the new granters as real meetings per
**D-104**, and answers D-104's "never let the VN become wallpaper" not by cutting
rungs but via the **player-triggered, ignorable** trigger. Keeping bonuses
occasional/varied (mostly relationship + flag writes) keeps the first build lean and
the ladder free of per-rung power creep.

---

## 8 · Open questions for the human

> **Resolved by §0 / D-110:** OQ1 (every rung — Option 3 shape, minus per-rung
> perks), OQ3 (player-triggered + **ignorable**; a ready promotion **banks** and
> waits — never nags/forces), OQ4 (**every** rung gets a beat), and OQ7 (trigger
> lives on the **header rung element F106**). OQ2/5/6/8 remain build details.

1. ~~**Scope / depth** — Option **1 / 2 / 3**?~~ **RESOLVED (§0):** every rung a
   full player-triggered beat (Option 3 *shape*), payload = relationships + flags
   with occasional small varied bonuses (**not** a perk per rung).
2. **NPCs per rung** — accept the §6 mapping (Kihei R3, Chiyo R6, lord R7 full;
   Genemon R1/R2/R4/R5 deepen a known relationship)? In particular, **who teaches
   the R5 stance** — Kihei (combat teach) or Genemon (the standing)? *(Still open —
   note every rung is a beat now; the split is character, not beat-vs-no-beat.)*
3. ~~**Skippable or blocking?**~~ **RESOLVED (§0):** the beat is **player-triggered
   and ignorable** — a ready promotion **holds/banks** and does **not** nag; the
   player advances only by choosing to. *(Still a build detail: whether the modal is
   fast-forwardable on replays.)*
4. ~~**Every rung, or only milestone rungs?**~~ **RESOLVED (§0):** **every** rung
   gets a full beat (no bare-log-line rungs).
5. **Entity discovery granularity (F99)** — reuse the D-104 split: **ambient
   entities** (the pedlar) get a **one-line reason**, **characters who matter**
   get a **full VN meet**. Confirm the pedlar is ambient (one-liner), and name
   any vendor/NPC that instead deserves a full meet.
6. **Sequencing vs the economy re-core + home/belongings work.** The RICE / COIN
   / KOKU re-core (**D-107–D-109**) is in flight and will rescope the pedlar's
   _"your own koku"_ copy to **coin** (`src/core/content/market.ts`). Build the
   beat framework **now** (copy rescoped later by the economy ripple), or **wait**
   for the economy to land first? (Memory: *no parallel build during a ripple.*)
7. ~~**Affordance placement**~~ **RESOLVED (§0):** the trigger lives on the
   **header rung element (F106)** — the top-right rung name + progress bar. When the
   meter is ready it becomes the "begin the beat" affordance, and **triggering
   navigates to the beat**. (Supersedes the §3.3 rung-ladder-card button.)
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

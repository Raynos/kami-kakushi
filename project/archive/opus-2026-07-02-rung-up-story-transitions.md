# Rung-up story transitions — the promotion beat (F97 + F99 + F103)

> **📦 ARCHIVED 2026-07-03 — BUILT & verified** (commits `6bf861f` / `592ec79`).
> Cast + rewards ratified in the agent-default audit (keep Tokubei/Rokusuke/Tōzō;
> keep the rare +1 AGI; Naoyuki stays offstage). One **override** — the **R7
> capstone must matter mechanically** — is in
> [`../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md`](../../docs/plans/opus-2026-07-03-v0.3.5-build-plan.md)
> §7. The Status line below is stale.

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
rebuilt* (`docs/plans/opus-2026-07-02-append-only-rendering-engine.md`, active) —
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

> ⭐ **RESOLVED (agent, 2026-07-02) — see BQ1/BQ3/BQ5 + §7.1:** (1) new faces kept &
> named — **Tokubei** (Ōmi pedlar, R1), **Rokusuke** (R2), **Tōzō** (smith, R4); (2)
> two-voice R5 confirmed; (3) **Naoyuki is mentioned-but-unseen** in T0 (gated ask-hub
> lines at R6/R7 only), held for Phase 2.

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

### Beat-outline open questions (BQ — RESOLVED by the agent, 2026-07-02)

> The human is away and delegated these calls (autonomy contract). Each BQ carries a
> **⭐ agent-decided** resolution below, grounded in §0's locked scope, for the human's
> **async review** (override freely). **§7.1's `RUNG_BEATS` is the authoritative,
> copy-ready spec**; where it and §6.6's earlier draft prose differ, §7.1 wins.

- **BQ1 · New-face count.** This outline introduces **three ⭐ invented faces** —
  **the Ōmi pedlar** (R1), **Rokusuke** (R2), **the smith / Tōzō** (R4) — plus the four
  canon meets (Kihei R3, Chiyo R6, Shigemasa R7; Genemon throughout). Is three new
  invented faces the right *density*, or should any (esp. the smith) fold into an
  existing character (e.g. Kihei covering the forge)?
  - ⭐ **RESOLVED (agent):** **Keep all three** invented faces + the four canon meets —
    3 of 7 rungs introduce a face, 4 deepen a known one (moderate density, per §0's
    "some rungs a new face"). **Do NOT fold the smith into Kihei:** the forge is a
    distinct *craft-teacher* role tied to its own **place-gate** (the smithy), whereas
    Kihei is the *yard / blade-use* teacher — merging them muddies both roles and the
    R4 loot→craft beat's legibility. Tōzō stays a D-114 "(b) small person."
- **BQ2 · Bonus placement.** Small varied bonuses are marked *[bonus]* on **six**
  branches (R2 friend, R3 disciplined + reluctant, R4 generous, R5 stances, R6 discreet,
  R7 all three). Is that the right *rarity* (they're meant to be a delight, not an
  expectation — §0), and should any be cut to keep the ladder flatter?
  - ⭐ **RESOLVED (agent):** **Cut six → a rare, varied THREE**, one per bonus flavour:
    **(1) story-flag** — R2 "trade the gossip" sets `pedlar-favour` (Tokubei's
    friend-price); **(2) small stat nudge** — R3 "stand a watch" grants a one-time
    **+1 AGI**; **(3) keepsake** — R4 "spend on the house" earns the `smith-whetstone`
    flag (a small repair/durability edge). The §6.6 *[bonus]* tags on **R3-reluctant,
    R5 stances, R6 discreet, and R7** are **SUPERSEDED** — those become plain
    relationship + flag writes (R5's stance pick sets a *story-DEFAULT* stance, not a
    bonus; R7's colour is the normal capstone flag). See §7.1 (authoritative).
- **BQ3 · R5 two-voice.** The draft resolves OQ2 as **Kihei teaches the stance,
  Genemon confers the standing** in one two-part scene. Confirm, or make it a single
  voice (whose?).
  - ⭐ **RESOLVED (agent):** **Confirmed — two-voice.** Genemon confers the standing,
    Kihei teaches the stance, in **one** scene: the greeting carries **both** voices
    (per-line `voice`/`speaker` already supports this — no engine change), and the
    **decision reacts in Kihei's voice** (the choice is a combat/stance teach). Scene
    `speaker: 'kihei'`.
- **BQ4 · Capstone choice weight.** Should the R7 choice's Phase-2 *colour* (devoted /
  ambitious / humble) actually **branch anything** in Phase 2, or stay a remembered
  flag + a line of flavour for now?
  - ⭐ **RESOLVED (agent):** **Light branch.** The R7 pick sets a remembered colour
    flag (`r7-devoted` / `r7-ambitious` / `r7-humble`) + a line of Shigemasa flavour,
    **wired so Phase 2 CAN read it later** — but it does **not** hard-branch any
    Phase-2 mechanic now (Phase 2 is unbuilt). `t0-capstone` fires regardless of pick.
- **BQ5 · Naoyuki.** Seed the heir as a topic-line at **R6/R7** (a warier counterweight
  to Shigemasa, a Phase-2 hook), or hold him entirely for Phase 2? *(Mirrors §6.5's
  cast-Q3 and §8 OQ — one call covers both.)*
  - ⭐ **RESOLVED (agent):** **Seed as mentioned-but-unseen.** Naoyuki appears only as
    a **gated ask-hub answer** — Chiyo's `chiyo-lord` topic (R6) and Shigemasa's
    `shigemasa-heir` topic (R7) name him a young, wary heir (a Phase-2 hook). He
    **never appears on-screen in T0** (no beat, no NpcId). Covers §6.5's cast-Q3 too.
- **BQ6 · Naming the pedlar.** Keep him "the Ōmi pedlar" (ambient, unnamed), or promote
  him to a named **⭐ Tokubei** once the R2 gossip beat references him by name?
  - ⭐ **RESOLVED (agent):** **Name him — Tokubei, the Ōmi pedlar** — from R1. He is a
    **named** ambient trader (D-114 "(b)/(c)") but takes **no `NpcId` / `npcMemory`
    slot** (his one lever is the `pedlar-favour` flag). The smith is **Tōzō** (R4).
    Both added to `names.ts` `NAMES` as canonical (§7.2).

---

## 7 · Chosen scope + BUILD-READY BEAT SPEC (LOCKED — D-110)

> §7.0 restates the locked scope; **§7.1–§7.6 are the build-ready spec** the code lane
> follows (agent-authored 2026-07-02, per the autonomy contract — copy-ready, for the
> human's async review). §7.1's `RUNG_BEATS` supersedes §6.6's draft prose.

### 7.0 · Chosen scope (recap)

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

### 7.1 · DATA SHAPE — the `RUNG_BEATS` registry

A new pure-core content module — `src/core/content/rungBeats.ts` — parallel to
intro's `DIALOGUE_SCENES`. It **reuses** intro's payload-free types (`IntroSetupLine`,
`DialogueTopic`, and their selectors `availableTopics` / a topic-finder) and adds a
**rung-flavoured option** (relationship + flag first, no required perk / no required
net-zero swap — the intro's `IntroOption` requires both, so it does *not* fit here):

```ts
// src/core/content/rungBeats.ts
import type { AttrId } from './balance';
import type { NpcId, VoiceCategory } from './voices';
import type { RankId } from './ranks';
import type { IntroSetupLine, DialogueTopic } from './intro'; // reused verbatim

/** A rung-beat decision option: relationship + story-flag first (§0). Perk/stat are
 *  NOT required (unlike intro's IntroOption). A `statBonus` is the rare exception. */
export interface RungOption {
  readonly id: string;          // stable, globally unique, e.g. 'r1-dutiful'
  readonly label: string;       // the button copy (diegetic)
  readonly say: string;         // the MC's spoken reply → Story, voice 'player'
  readonly react: string;       // the speaker's reaction → Story, voice = scene.voice
  /** ACCUMULATING relationship write(s) — an array so a two-voice beat can touch two
   *  NPCs (R4 Genemon+Tōzō, R5 Genemon+Kihei). `warmthDelta` ADDS (clamped -3..+3);
   *  `regard` updates only when present. Absent ⇒ no memory touch. */
  readonly memory?: readonly {
    readonly npc: NpcId;
    readonly warmthDelta: number;
    readonly regard?: string;
  }[];
  /** Story flags this choice sets — the durable record of the pick + any flag-backed
   *  bonus (`pedlar-favour`, `smith-whetstone`). Read by later beats/surfaces. */
  readonly flags?: readonly string[];
  /** The RARE small stat nudge (§0/BQ2) — a modest one-time +attr, smaller than an
   *  intro perk. Present on EXACTLY ONE option (R3 'disciplined'); everything else
   *  omits it. `note` is the delight line shown after the pick. */
  readonly statBonus?: { readonly attr: AttrId; readonly amount: number; readonly note: string };
  /** For R5 only: the opening stance this pick makes your default (a story-DEFAULT,
   *  NOT a bonus). Absent elsewhere. */
  readonly setStance?: 'jodan' | 'chudan' | 'gedan';
}

export interface RungDecision {
  readonly prompt: string;
  readonly options: readonly RungOption[];
}

/** One rung beat. Mirrors `DialogueScene` but with `RungDecision`. `topics: []` ⇒ a
 *  light-VN beat (greeting + decision, no ask-hub); a non-empty `topics` ⇒ a full VN
 *  meet (R3/R6/R7). The greeting's per-line `voice`/`speaker` carry two-voice beats. */
export interface RungScene {
  readonly id: string;            // 'rung-r1' … 'rung-r7'
  readonly rank: RankId;          // the TARGET rank this beat promotes INTO
  readonly voice: VoiceCategory;  // the react/nameplate colour of the decision
  readonly speaker?: NpcId;       // the primary speaker (react nameplate)
  readonly greeting: readonly IntroSetupLine[];
  readonly topics: readonly DialogueTopic[]; // [] ⇒ light beat; else the ask-hub
  readonly decision: RungDecision;
  /** DOC/echo cross-check: the rewardOnReach.unlock ids this beat narrates (a
   *  verify-content assert can pin beat↔unlock coherence, mirroring the surface check). */
  readonly motivates: readonly string[];
}

/** Keyed by TARGET rank. R0 has NO beat — the intro's Genemon scene IS the R0 beat
 *  (§6.6 R0); you never "promote into R0". Partial ⇒ begin_rung_beat no-ops on a miss. */
export const RUNG_BEATS: Partial<Record<RankId, RungScene>> = { /* R1…R7 below */ };
```

**The copy-ready prose** (Kurosawa house, 1780 — the intro's voice). `[narrator]` =
ambient prose (no nameplate); named lines carry `speaker` + `voice`. Each beat's
`motivates` list is verbatim from `ranks.ts` `rewardOnReach.unlock`; the "why" prose
folds in the already-authored `surfaces.ts` reveal lines (§2.3), now *spoken*.

**R1 · Kept hand 下人 — Genemon** *(deepen; light-VN, `topics: []`)*
`motivates:` room-gate-forecourt, room-home-paddies, verb-farm, verb-haul,
readout-clock, readout-stamina, panel-rung-ladder (→ panel-estate + the pedlar market).

- greeting:
  - `[narrator]` "Dawn at the gate. The forecourt is swept clean — your doing — and Genemon waits by the posts, watching you the way a man watches weather."
  - `[Genemon]` "You cleared the stores without being told twice. The house is short of hands and shorter of trustworthy ones. Stay — you're no day-hire now. Earn your rice."
  - `[Genemon]` "The gate and the swept forecourt are yours to work now; stores come and go here. The home paddies too — the rice that feeds the house. And the kura's own repair is yours to tend: spend the house's small surplus to shore it up."
  - `[narrator]` "A pack-laden stranger has laid a mat in the lee of the gate-post — an Ōmi pedlar, come because a tended gate draws trade. He lifts a hand as you pass."
  - `[Tokubei]` "A tended gate's a lucky gate for a man with a pack. Tokubei, of Ōmi — mind if I keep my mat here a while, young master? Coin of your own spends as well as any lord's."
- decision — prompt: "How do you take the keeping?"
  1. `r1-dutiful` — "The house has my hands." → react `[Genemon]` "...Good. Hands that don't need watching are the rarest thing I keep." · memory `[{genemon,+1,'dutiful'}]` · flags `['r1-dutiful']`
  2. `r1-practical` — "A roof and rice is a fair trade." → react `[Genemon]` "Honest, and cold. A fair trade it is — see that you hold your half." · memory `[{genemon,0}]` · flags `['r1-practical']`
  3. `r1-ambitious` — "I mean to rise past a kept hand." → react `[Genemon]` "...Ambition, in a hand kept a day. Mind it doesn't outrun your worth." · memory `[{genemon,-1,'ambitious'}]` · flags `['r1-ambitious']` *(seeds later wary lines)*

**R2 · Trusted hand 手代 — Genemon** *(deepen)* **+ ⭐ Rokusuke** *(new peer; light-VN, `topics: []`)*
`motivates:` tab-skills, room-woodlot-edge, room-near-satoyama, room-deep-satoyama,
verb-woodcut, verb-forage, verb-face-wolf, row-wood, row-sansai, skill-conditioning.

- greeting:
  - `[narrator]` "The near hill in first light. Genemon leads you past the forecourt for the first time, out to where the woodlot meets the wild edge of the satoyama."
  - `[Genemon]` "You can be set a task and trusted to finish it out of my sight — worth more than a strong back. The woodlot and the near hill are yours to work now; the house needs fuel and forage, and it trusts you to bring them in."
  - `[Genemon]` "One more thing, and not a small one. A wolf's been at the grain stores in the night. Someone must face it — and there is no one else to send. Think on it."
  - `[narrator]` "A lean man about your own age ambles up from the wood-stack, an axe on one shoulder, grinning as if you two already share a joke."
  - `[Rokusuke]` "Rokusuke — kept on two winters back, so I know where the bodies are buried. Do the work, keep your head down, don't let the old steward catch you idle. That's the whole of it."
  - `[narrator]` "Knotting a load for the woodlot, your fingers tie a porter's knot you never learned — quick, certain, a stranger's habit in your own hands. It means nothing. It will not leave you." *(the porters-knot beat, moved off `ranks.ts` — §7.4)*
- decision — prompt: "The wolf, and the man beside you — how do you take them?"
  1. `r2-wolf-heeded` — "The stores are the house's life. I'll face it." → react `[Rokusuke]` "...Huh. Most men find a reason to be elsewhere. You might do." · memory `[{rokusuke,0,'respected'}]` · flags `['r2-wolf-heeded']`
  2. `r2-rokusuke-friend` — "Tell me how the house really runs." → react `[Rokusuke]` "Now you're talking. Stick with me and you'll know which pedlar cheats and which steward's watching. Speaking of — old Tokubei keeps a softer price for a friend. Tell him I sent you." · memory `[{rokusuke,+1,'friend'}]` · flags `['r2-rokusuke-friend','pedlar-favour']` **⭐ story-flag bonus** (the market read honours `pedlar-favour`)
  3. `r2-solitary` — "The work's enough. I keep to myself." → react `[Rokusuke]` "Suit yourself. Offer stands, if you tire of your own company." · memory `[{rokusuke,-1,'solitary'}]` · flags `['r2-solitary']`

**R3 · Gate-watch 門番 — ⭐ Kihei** *(NEW · full VN meet; combat goes live)*
`motivates:` tab-combat, panel-drill-yard, readout-combat-level, panel-bestiary,
panel-house-influence.

- greeting:
  - `[narrator]` "The drill yard behind the omoya, first light. You've stood over the grain-store wolf's carcass; word travels. A hard-faced man is already there, a bokken in each hand — and he throws you one without a word of greeting."
  - `[Kihei]` "So. You put down the thing that had the run of our stores. Farmers don't do that. There's a soldier in you under the farmhand — I've watched it a week and I'm done pretending I haven't."
  - `[Kihei]` "You're gate-watch now: a weapon, a yard to train in, and the estate's defence on your shoulders — pests, beasts, and the masterless men who drift down the woodlot road. Keep a field-guide of what you face; a soldier who knows his enemy outlives one who doesn't."
- topics (ask-hub):
  - `kihei-why-blade` — "Why set me to the blade?" → `[Kihei]` "The house has walls and no one to stand on them. A great name with an empty granary draws wolves of both kinds. I'd sooner the man holding the gate be one who chose to."
  - `kihei-road` — "What's out on the woodlot road?" → `[Kihei]` "Boar and wolf in season. And men — ronin, deserters, the leavings of every lord's quarrel — who'll take rice off a house too weak to keep it. That last is why you're really here."
  - `kihei-who` — "Who are you, drillmaster?" *(gate: `asked.has('kihei-why-blade')`)* → `[Kihei]` "A man who soldiered for a house that no longer exists. Genemon kept the granary; I kept the walls. Ask me the rest when you've bled for the place."
- decision — prompt: "How do you take up the blade?"
  1. `r3-aggressive` — "Show me how to end a fight fast." → react `[Kihei]` "Fast, he says. Fast gets you a spear in the back. But there's fire in it — we'll aim it before it burns you." · memory `[{kihei,-1,'eager'}]` · flags `['r3-aggressive']`
  2. `r3-disciplined` — "Teach me to stand a watch." → react `[Kihei]` "...Good answer. A wall that holds is worth ten swords that swing wild. Come at dawn — before the others." · memory `[{kihei,+1,'disciplined'}]` · flags `['r3-disciplined']` · **⭐ statBonus** `{attr:'agi',amount:1,note:"Kihei drills you an extra dawn; your feet learn the watch. (+1 AGI)"}`
  3. `r3-duty-not-glory` — "I'd rather the paddies — but the house needs it." → react `[Kihei]` "Honest. I trust a man who'd rather not more than one who's hungry for it. The house is lucky in you." · memory `[{kihei,+1,'reluctant'}]` · flags `['r3-duty-not-glory']`

**R4 · Kura-warden 蔵番 — Genemon** *(deepen)* **+ ⭐ Tōzō** *(new smith; light-VN, two-voice, `topics: []`)*
`motivates:` readout-durability, panel-equipment (the woodlot smithy), verb-repair,
house-omoya.

- greeting:
  - `[narrator]` "Genemon meets you at the kura door with an iron key on a cord, worn smooth by other hands before yours."
  - `[Genemon]` "The kura key. Mind the stores as if the rice were your own — from today it half is. The house is forgetting you were ever a stranger. So am I."
  - `[narrator]` "He walks you on to the woodlot smithy, where a bent old man coaxes an edge back onto a mattock. He doesn't look up."
  - `[Tōzō]` "Tōzō. I keep the estate's iron. A blade you don't tend turns on you — bring me the hides and the metal off what you kill, and I'll show you what an edge wants. The forge is yours to use now; try not to ruin my fire."
  - `[Genemon]` "And the omoya's shuttered rooms are aired and swept — the house rises, and you'll walk floors the family walks. Don't let it turn your head."
- decision — prompt: "How do you hold the key, and the house's surplus?"
  1. `r4-thrifty` — "Every grain accounted." → react `[Genemon]` "Spoken like a steward. Good — the house was bled white once by hands that weren't." · memory `[{genemon,+1,'thrifty'}]` · flags `['r4-thrifty']`
  2. `r4-generous` — "Spend it on the house's needs — a mended kura feeds everyone." → react `[Tōzō]` "Hah — the lad'd sooner fix the roof than count the rice. Here: a whetstone that's outlived three wardens. Keep your edge keen and it'll keep you." · memory `[{genemon,0},{tozo,+1,'friend'}]` · flags `['r4-generous','smith-whetstone']` **⭐ keepsake bonus** (the repair loop reads `smith-whetstone`)
  3. `r4-self-keeping` — "Keep a little back for myself." → react `[Genemon]` "...I'll pretend I didn't hear that. See that I go on not hearing it." · memory `[{genemon,-1,'self-keeping'}]` · flags `['r4-self-keeping']`

**R5 · House-servant 家人 — Genemon confers + Kihei teaches** *(deepen; light-VN, two-voice, `topics: []`; BQ3)*
`motivates:` stance-control. Scene `speaker: 'kihei'`, `voice: 'arms'` (the decision is
the stance teach).

- greeting:
  - `[narrator]` "Genemon calls you to the omoya's inner room — a place season-hands never see."
  - `[Genemon]` "No longer a season-hired hand. From today you answer to the house day and night, and it answers for you. The work is the same. The standing is not."
  - `[narrator]` "Then he walks you out to the yard, where Kihei waits with two bokken and something that might, on another man, be a smile."
  - `[Kihei]` "The standing means the house trusts your judgment now — so I'll trust you with the last of it. Set your stance before a foe: press to end it fast, or guard to outlast it. The call is yours, fight by fight. Show me you understand the choice."
- decision — prompt: "What stance do you make your own?"
  1. `r5-stance-aggressive` — "Press every fight — end it, don't outlast it." → react `[Kihei]` "The tiger's way. Fast and final. It'll serve — until the day it doesn't. Mind that day." · memory `[{kihei,0,'aggressive'}]` · flags `['r5-stance-aggressive']` · `setStance:'jodan'`
  2. `r5-stance-guard` — "Guard first — a live watchman beats a dead hero." → react `[Kihei]` "The bear's way. Unglamorous. It's also why I'm old enough to teach you." · memory `[{kihei,+1,'steady'}]` · flags `['r5-stance-guard']` · `setStance:'gedan'`
  3. `r5-stance-adaptive` — "Read the foe — the call changes fight by fight." → react `[Kihei]` "...The answer I hoped for and rarely get. There's a swordsman in you now, not just a gate-watch. Chūdan — the middle. Everything opens from it." · memory `[{kihei,+1,'adaptive'}]` · flags `['r5-stance-adaptive']` · `setStance:'chudan'`

**R6 · Steward's man 用人 — ⭐ Lady Chiyo** *(NEW · full VN meet)*
`motivates:` house-workshops, house-granary.

- greeting:
  - `[narrator]` "The omoya's formal room. Lady Chiyo sits behind a low table stacked with the house's ledgers, and studies you the way she'd study a column of figures that doesn't yet add up."
  - `[Chiyo]` "So you are the river's foundling Genemon would not stop mentioning. Sit. I've errands that need a hand I can trust with more than a hoe — ledgers carried, messages run, the house's small business held close."
  - `[Chiyo]` "The workshops wake again on the strength of your work — a forge, a joiner's bench — and a second granary rises behind the kura. They fall under your oversight now. You are being weighed for something larger than a servant. Do not disappoint the scales."
- topics (ask-hub):
  - `chiyo-need` — "What does the inner house need?" → `[Chiyo]` "Order. A great name is a heavy thing to carry with an empty purse — I keep the two from crushing us. I need a man who does what's asked and asks nothing back he hasn't earned."
  - `chiyo-trust` — "Why trust an outsider?" → `[Chiyo]` "An outsider owes no old faction and carries no old grudge. You are loyal to this house or to nothing — and a man loyal to nothing is easy to read. I prefer easy to read."
  - `chiyo-lord` — "The lord — is he well?" *(gate: `asked.has('chiyo-need')`)* → `[Chiyo]` "Shigemasa is old, and tired, and prouder than either. His heir **Naoyuki** is young and wary and not yet ready to carry it. Between them the house needs steady hands more than another sword. Remember that when the drillmaster fills your head." *(⭐ Naoyuki seed — BQ5)*
- decision — prompt: "How do you serve the inner house?"
  1. `r6-loyal` — "The house's name is my name now." → react `[Chiyo]` "A large thing to say. Larger to mean. We shall see which you've done." · memory `[{chiyo,+1,'loyal'}]` · flags `['r6-loyal']`
  2. `r6-ambitious` — "I'd carry more than errands." → react `[Chiyo]` "Ambition. I neither trust it nor waste it. Carry the errands first; the more comes to those who don't ask for it." · memory `[{chiyo,0,'ambitious'}]` · flags `['r6-ambitious']`
  3. `r6-discreet` — "A steward's man keeps the house's silences." → react `[Chiyo]` "...Yes. That, more than the errands, is the post. You understand it already. Good." · memory `[{chiyo,+1,'discreet'}]` · flags `['r6-discreet']`

**R7 · Trusted of the house 内衆 — ⭐ Shigemasa** *(NEW · full VN meet — capstone)*
`motivates:` house-study. `rewardOnReach.flags` also sets `t0-capstone` (opens Phase 2)
— fired by `applyPromotion` **regardless of pick** (BQ4).

- greeting:
  - `[narrator]` "The shoin — the lord's own writing-room, where the house's real business is done and few servants ever cross the threshold. Shigemasa is smaller than his name, and older, and his eyes miss nothing."
  - `[Shigemasa]` "Come in. Sit — no, closer. I would see the man Chiyo and Genemon and even that flint Kihei agree upon, which they have not done in twenty years."
  - `[Shigemasa]` "You came to us with no name and nothing in your hands. Look what those hands have done — the kura full, the walls kept, the workshops loud again. I admit you to this room. The measure of the House itself takes shape before you now. Few servants ever stand where you stand."
- topics (ask-hub):
  - `shigemasa-house` — "How is a house weighed?" → `[Shigemasa]` "Not in koku alone, though the granary matters. In its name, its arms, its office, the memory it leaves. I have spent my life keeping one pillar from pulling down the rest. Soon that reckoning will lie open before you — and you will see how far a house can yet rise."
  - `shigemasa-of-me` — "What would you have of me?" → `[Shigemasa]` "More than I have the right to ask of a servant, and less than I suspect you'll one day give. For now — carry the house's standing as if it were your own name. Perhaps, in time, it will be."
  - `shigemasa-heir` — "And your heir?" *(gate: `asked.has('shigemasa-house')`)* → `[Shigemasa]` "**Naoyuki.** He is young, and he watches you already — not all of it kindly. A house has room for an heir and an able man both, if both are wise. See that you are the wise one; I cannot always be here to remind him." *(⭐ Naoyuki seed — BQ5)*
- decision — prompt: "How do you answer the lord?" *(the capstone colour — light branch, BQ4)*
  1. `r7-devoted` — "I'll carry the Kurosawa name as far as it can go." → react `[Shigemasa]` "The house before the man. It is what I would have said at your age. Whether it was wisdom or only habit, I have never decided." · memory `[{shigemasa,+1,'devoted'}]` · flags `['r7-devoted']`
  2. `r7-ambitious` — "A name can be made as well as served." → react `[Shigemasa]` "...Bold. To my face, no less. I'll not pretend it pleases me less than the safe answer would have." · memory `[{shigemasa,0,'ambitious'}]` · flags `['r7-ambitious']`
  3. `r7-humble` — "I only did the work in front of me." → react `[Shigemasa]` "And that, I think, is why it came to so much. Remember it when louder men tell you otherwise." · memory `[{shigemasa,+1,'humble'}]` · flags `['r7-humble']`

### 7.2 · STATE / ENGINE extensions (pure-core vs UI, explicit)

**PURE CORE — the promotion state machine + the beat reducers.**

1. **New state field** (`src/core/state.ts`): `readonly rungBeat: RankId | null` — the
   active rung beat's **target** rank, or `null` when no beat is live. Additive;
   `createInitialState` defaults it `null`. (A single nullable rank suffices — unlike
   the intro's 3-scene numeric `introBeat`, a rung beat is **one** scene: greeting →
   optional ask-hub → one decision → apply.) The ask-hub DIM/gate state **reuses the
   existing `askedTopics`** (ids are globally unique — no new field); story flags
   **reuse the existing `flags`** store; relationships **reuse `npcMemory`**. So the
   *only* new stored field is `rungBeat`.
2. **Schema bump** (`src/core/constants.ts`): `SCHEMA_VERSION` **5 → 6** (additive
   `rungBeat`; note the plan §9 "currently 4" is stale — it is **5** today). A save
   mid-"ready" simply shows the header affordance on load; a save that already promoted
   is unaffected (rung + reward already applied); the new field defaults inert.
3. **Split `promoteRungs`** (`src/core/ranks.ts`) into pure fns:
   - `applyPromotion(state, target: RankId): GameState` — the current promote body for
     **exactly one** rung: bump `rung` → target, reset `rungMeter` 0,
     `applyRewards(getRank(target).rewardOnReach)`, refill satiety. **Plus** emit the
     generated terse marker (§7.4).
   - `promotionReady(state): boolean` — thin wrapper over `rungProgress(state).ready`.
   - `pendingPromotionTarget(state): RankId | null` — `promotionReady(state) ?
     nextRankId(state.rung) : null`.
   - **Retire the auto-promote loop from the hot path:** `finish()`
     (`intents.ts:122`) becomes `revealPass(state)` only (drop `promoteRungs`). The
     meter now **holds at ready** (the ladder already clamps the fill visually). Keep a
     one-rung `promoteRungs`-shaped path ONLY for the dev rung-seek in `app/main.ts`
     (call `applyPromotion` in its loop) — see §7.5.
4. **New reducer helper** (`src/core/state.ts`): `deepenNpc(state, npc, {warmthDelta,
   regard?})` — **accumulating** relationship write: `warmth = clamp(prior.warmth +
   warmthDelta, -3, +3)`; `regard` overwrites only when present. (Distinct from the
   intro's overwrite-only `rememberNpc`, so Genemon's trust visibly *deepens*
   R1→R2→R4→R5 rather than being re-stamped each rung.)
5. **New intents** (`src/core/intents.ts` — reuse the intro reducers' shape):
   - `begin_rung_beat` — guard: `promotionReady(state) && state.rungBeat === null &&
     !introActive(state.introBeat)`. Sets `rungBeat = pendingPromotionTarget(state)`
     and reveals `RUNG_BEATS[target].greeting` into the **Story** channel (a
     `revealRungBeat` helper mirroring `revealIntroBeat`). No-op if the target has no
     registered beat (Partial map).
   - `ask_rung_topic` — mirrors `ask_topic` against `RUNG_BEATS[state.rungBeat]`:
     emit the player question + the answer line(s) to Story, `markTopicAsked`. No stat,
     no memory, no advance (re-askable). Respects `topic.gate` over `askedTopics`.
   - `choose_rung_option` — the **terminal** node. In order: **(a)** emit `say`
     (`player`) + `react` (scene voice) to Story; **(b)** for each `memory` entry,
     `deepenNpc`; **(c)** `setFlag` each `option.flags`; **(d)** `statBonus` →
     add-attr + emit its `note` line; `setStance` → set `state.stance`; **(e)**
     `applyPromotion(state, state.rungBeat)` — **this is the sole place `rewardOnReach`
     applies** (rank-rN flags + unlocks + the terse marker); **(f)** clear
     `rungBeat = null`. The world inks in when the modal tears down (§7.4).
   - `advance_rung_beat` — the narration-only "Continue" (inert today: every authored
     beat carries a decision; kept for symmetry with `advance_intro`).
6. **New cast wiring** (`src/core/content/voices.ts` + `names.ts`):
   - `names.ts` `NAMES`: add `rokusuke: 'Rokusuke'`, `smith: 'Tōzō'`,
     `pedlar: 'Tokubei'` (single source; BQ1/BQ6).
   - `NpcId`: add `| 'chiyo' | 'shigemasa' | 'rokusuke' | 'tozo'`. **Tokubei takes no
     `NpcId`** — ambient, his lever is the `pedlar-favour` flag (BQ6).
   - `VoiceCategory`: add `| 'lord'` (Shigemasa's capstone colour). `NPC_VOICE`
     additions: `chiyo:'steward'` (reuse; nameplate distinguishes her from Genemon —
     a distinct `'inner'` colour is an optional UI-lane refinement), `shigemasa:'lord'`,
     `rokusuke:'villager'`, `tozo:'arms'`. `NPC_NAME`: `chiyo:NAMES.steward`,
     `shigemasa:NAMES.lord`, `rokusuke:NAMES.rokusuke`, `tozo:NAMES.smith`. Extend
     `NPC_IDS`.

**UI — the beat presentation** (`src/ui/render.ts`; no game logic).

The presentation **reuses the append-only VN scene wholesale** (§7.3). The header rung
element (F106) is the trigger (§3.3/§0): when `promotionReady(state) && rungBeat ===
null && !introActive`, the top-right rung name+bar becomes the "Answer the summons /
Begin the beat" affordance dispatching `begin_rung_beat` (navigates to the beat). A
ready promotion **banks** there and never nags.

### 7.3 · Renderer reuse — build ON the append-only engine (do NOT fork it)

Per §3.2(a) / §9, reuse `buildIntroShell` + `reconcileIntro` (append-only, F81)
unchanged — only **generalize the active-scene gate + source**:

1. **Gate flip:** replace `introActive(state.introBeat)` at the two render gates
   (`render.ts:3262` and `:3806`, per the current build) with a
   `vnActive(state) = introActive(state.introBeat) || state.rungBeat !== null`. So the
   full-screen washi surface hides the shell during **both** intro and rung beats, and
   the world reveals **post-scene** (the intro already does exactly this).
2. **A normalized active-scene projection** the renderer consumes, source-tagged:

   ```ts
   type ActiveVn = {
     source: 'intro' | 'rung';
     greeting: readonly IntroSetupLine[];
     topics: readonly DialogueTopic[];          // via availableTopics(scene, asked)
     prompt: string;
     options: readonly { id: string; label: string }[];  // buttons only — apply is in the reducer
     voice: VoiceCategory; speaker?: NpcId;
   };
   function activeVn(state): ActiveVn | null // intro (DIALOGUE_SCENES[introBeat]) or rung (RUNG_BEATS[rungBeat])
   ```

   `buildIntroShell`/`reconcileIntro` render from this projection (they only need
   greeting lines, topic labels, the prompt, and `{id,label}` buttons — all common to
   both scene types). `availableTopics` + the topic-finder are **reused verbatim**
   (`RungScene.topics` is the same `DialogueTopic[]`).
3. **Dispatch by `source`:** the button/ask handlers switch on `activeVn().source` —
   `intro` → `ask_topic` / `choose_intro`; `rung` → `ask_rung_topic` /
   `choose_rung_option`. A thin branch; everything else (typewriter, voice colours,
   append-only scrollback) is shared.

### 7.4 · The channel fix (F103) + how the beat gates the reward

**Channel fix (resolves OQ8).** Today each rung's `rewardOnReach.log` is the full story
prose on the `milestone` channel → **Progress**, so the Story view shows nothing and
the prose sits in the wrong tab (§2.2). The redesign:

- **DELETE** the prose `milestone` `log` line from **R1–R7** `rewardOnReach`
  (`src/core/content/ranks.ts`) — the prose now lives in `RUNG_BEATS[*].greeting`,
  spoken in the modal (which writes `narration`/**Story** lines). **Exception — R2's
  second line** (the porters-knot narration) is *already* correctly on `narration`;
  move it into `RUNG_BEATS.R2.greeting` (§7.1's closing narrator line) so all of R2's
  prose lives in one place, then R2's `rewardOnReach.log` is empty too.
- **`applyPromotion` emits a generated terse marker** on `milestone` →
  **Progress**: `` `Rank ↑ — ${rank.title} ${rank.kanji}` `` (single-source from the
  `RankDef` — never hand-typed; A21). This keeps a scannable progression record. So
  `rewardOnReach.log` becomes **empty/omitted** for R1–R7; only the generated marker
  drops to Progress, and the full prose is Story-channel via the beat.

**Reward-gating (beat completion, not raw meter).** `applyRewards(rewardOnReach)` runs
**only** inside `applyPromotion`, called **only** at `choose_rung_option`'s terminal
node. Therefore: the latched `rank-rN` flags + every `rewardOnReach.unlock` surface
apply **after** the beat, never on raw meter-fill. Downstream surfaces that read the
`rank-rN` flags (e.g. `dream-2` ← `rank-r3`, `surfaces.ts:280`) still fire — unchanged
timing vs. today (reward at promote), just now *gated behind the beat*. The **pedlar
discovery** needs **no reveal-engine change**: the panel already back-reveals off
`panel-rung-ladder` → `panel-estate`; the ONLY change is R1's greeting now *names why*
Tokubei is there (F99), and the panel inks in when the R1 modal tears down.

### 7.5 · Tests / sim migration + the tier DoD (D-088)

`promoteRungs` is called by `finish()` (retired) and the dev rung-seek
(`app/main.ts:66`), and asserted in `m1.test.ts` (:103-122) and `m2.test.ts` (:225);
`combat-reveal.test.ts` / `estate-reveal.test.ts` read `rewardOnReach`;
`verify-content.ts` reads `rewardOnReach.unlock` (still valid — `unlock` is untouched).

- **`app/main.ts` rung-seek:** swap its `promoteRungs(...)` loop for `applyPromotion`
  per rung (the seek bypasses the beat by design — a dev jump, not the player path).
- **Existing rung tests:** must now **drive the beat** (`begin_rung_beat` →
  `choose_rung_option`) or call `applyPromotion` directly. Derive fixtures from
  `rungThreshold(id)` + the `rank-rN` flags (source of truth), **not** magic numbers.
- **Per D-088 (name in the first milestone's DoD):**
  - a **full-arc e2e** that walks a promotion **through the beat** — fill meter → header
    ready → `begin_rung_beat` → (ask a topic) → `choose_rung_option` → assert rung
    bumped, `rank-rN` set, the beat's unlocks revealed, the chosen `flags` set, the
    `npcMemory` deepened, and (for R3) the `statBonus` applied.
  - an **invariant:** *no rung advances without its beat* — filling the meter to
    `ready` and calling `finish()`/`revealPass` alone leaves `rung`, `flags`, and
    `unlocked` **unchanged** (a promotion requires `choose_rung_option`). This test
    **could go RED** against the old hot-path auto-promote — that's the point.

### 7.6 · Build order + landing coordination

1. **Land the channel fix first** (§7.4, data-only in `ranks.ts` + the generated
   marker) — a small, independent pure-core step that immediately fixes "story in
   Progress / nothing in Story," even before the beat ships.
2. **Pure core:** the `rungBeat` field + schema bump + `applyPromotion`/`promotionReady`
   split + `deepenNpc` + the four intents + `rungBeats.ts` registry (R1 first — the
   smallest end-to-end proof, §6 R1) + the cast wiring. Migrate the tests (§7.5).
3. **UI:** the `vnActive` gate flip + `activeVn` projection + `source` dispatch + the
   F106 header trigger. Reuse `buildIntroShell`/`reconcileIntro` unchanged.
4. **Coordinate with the append-only engine plan**
   (`opus-2026-07-02-append-only-rendering-engine.md`, active) — build ON it, land after it.
   The **economy re-core (D-107–D-109)** rescopes the pedlar's coin copy separately
   (OQ6 / the "no parallel build during a ripple" memory) — the beat framework is
   copy-agnostic; the pedlar's trade line is one string the economy ripple can retune.

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
  (`docs/plans/opus-2026-07-02-append-only-rendering-engine.md`, active; scene at
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

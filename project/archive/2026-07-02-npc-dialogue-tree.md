# NPC dialogue TREE — meet → ask → decide

**Status:** ✅ DONE (2026-07-02) — built + archived. The ask→decide dialogue tree
(meet → ask topics → decide, dimmed re-askable topics, voiced player questions,
per-NPC memory) ships in the intro VN scene. Live record: the feedback doc
(F47 + F62–F85).
**Created:** 2026-07-02 · **Author:** agent (design/authoring only — no source
touched).
**Cluster:** the story-presentation cluster — playtest **F47** (a better UI for
talking to an NPC; "think Fallout 4"). Builds directly ON the shipped
interactive intro (`docs/plans/opus-2026-07-02-interactive-intro-dialogue.md`,
IMPLEMENTED) and **D-104** (the full-screen VN scene = the canonical frame for
story-significant, interactive NPCs).
**Scope:** REPLACE the linear 3-beat intro flow with a **dialogue-tree** model —
on meeting a story NPC the VN scene shows a HUB of question topics the player can
ASK (exploratory, answered in-scene), then a terminal **"continue the story"
DECISION** that carries the balanced +1/−1 lean + the per-NPC memory write. The
VN-scene presentation (D-104) is REUSED wholesale.

> Queue note: this plan must be added to the human reading queue
> (`project/todo-human.md`) **in the same commit it lands** — the pre-commit gate
> hard-blocks a new `docs/plans/*.md` missing from the queue. Left out of this
> authoring pass on purpose (the task wrote a single file); the committer adds
> the queue line.

---

## 1. Context — what exists today (the linear intro, already built)

The interactive intro shipped. The concrete pieces this plan reshapes:

- **`src/core/content/intro.ts`** — `INTRO_BEATS: readonly IntroBeat[]`, a
  **linear** array of 3 beats (`soan` / `dream` / `genemon`). Each `IntroBeat`
  has `setup[]` (lines revealed when the beat opens), an optional `prompt`, and
  `options: IntroOption[]`. Each `IntroOption` carries `label` / `say` (the MC's
  reply) / `react` (the NPC's reaction) / `stat` (+1 up / −1 down, net-zero) /
  `outcome` (diegetic post-pick flavor) / optional `memory` (per-NPC regard +
  warmth write). Helpers: `introBeatAt`, `introOption`, `introActive`,
  `introOutcomeLine`, `beatReactVoice`/`beatReactSpeaker`, `INTRO_BEAT_COUNT`.
- **`src/core/intents.ts`** — two intents drive it: `advance_intro` (Continue
  past a narration-only beat) and `choose_intro(optionId)` (pick an option at a
  choice beat). The reducer's `choose_intro` pushes `say`+`react` to the log,
  applies the net-zero stat via `applyIntroStat`, writes memory via
  `rememberNpc`, emits the milestone outcome line, then `enterNextBeat`.
  `open_eyes` seeds `introBeat = 0` and reveals beat 0's setup.
- **`src/core/state.ts`** — `introBeat: number` (−1 pre-wake · 0..N−1 at beat i ·
  N done), `npcMemory: Partial<Record<NpcId, NpcMemory>>` (per-NPC `{regard,
  warmth}`, persists across ascension), `rememberNpc`/`npcRegard`.
- **`src/core/content/voices.ts`** — `NpcId` (`soan|genemon|kihei`),
  `VoiceCategory`, `NPC_VOICE`/`NPC_NAME`, `PLAYER_SPEAKER`. `NAMES`: Sōan
  (physician), Genemon (steward/`elder`), Kihei (arms/`drillmaster`).
- **`src/core/content/dialogue.ts`** — `DialogueLine` already has an optional
  `memGate: (mem: NpcMemoryMap) => boolean`; `nextDialogueLines(id, delivered,
  flags, npcMemory)` ANDs the flag gate + `memGate`. This is the per-NPC memory
  READ path (later greetings branch on `npcMemory.soan.regard`).
- **VN scene (D-104)** — currently the DEV-only **variant B** (`intro-scene`) in
  `src/ui/dev.ts` (`renderIntroOverlay`): a full-screen sumi scrim over a centred
  washi card holding `introNameplate` (kanji ink-seal + name, coloured by
  `VOICE_COLOR`), `introLines` (the setup lines, per-voice colour), and
  `introChoices` (the option buttons / a Continue). Per D-104 this variant is
  being **promoted to the sole prod intro presentation** (the inline + dock
  variants are SCRAPPED).
- **Migration** — `src/persistence/migrate.ts` chain, `SCHEMA_VERSION = 3`
  (`src/core/constants.ts`). v2→v3 hydrated `introBeat`/`npcMemory`. The load
  path (`validate.ts` `validateEnvelope`) runs the chain before structural
  validation; additive optional-fields-with-defaults is the primary growth
  mechanism.

**What's missing (F47):** the player can only *answer* an NPC — they can't *ask*.
The intro is a forced march of three one-shot choices. There's no exploration, no
"learn about this person/place before you commit," no Fallout-style hub of
questions that pay off in flavour and then hand you a weighty decision.

---

## 2. Vision (human, 2026-07-02)

> "A better UI for talking to the NPC, think like Fallout 4 — when a new NPC is
> introduced you have the option to go through a dialogue tree and ask some
> questions, and then finally when you're done asking questions you can make the
> decision of how to continue the story."

**Meet → ask → decide**, inside the existing full-screen VN scene:

1. **Meet.** The VN scene opens on the NPC (nameplate + a short greeting), same
   frame as today.
2. **Ask (the HUB).** A list of **question topics** the player can ASK. Clicking
   one reveals the NPC's answer **in the scene** (typewriter), and the answer
   joins a scrollback the player can re-read. Asking is **optional and
   unlimited** (subject to per-topic gating) — pure exploration + flavour.
3. **Decide.** Set apart from the ask hub (a divider / a different heading), the
   **"continue the story" DECISION** — the balanced choice(s) that advance the
   plot. Picking one applies the +1/−1 lean, writes per-NPC memory, and moves the
   intro forward (to the next NPC, or into the game).

The DECISION is the only thing that touches stats + memory-regard; asking is
free. This preserves the net-zero-stat invariant (§ Memory & stats) and makes
the choice feel *informed* — you decide how to answer Genemon *after* you've
learned what the house is and what it wants.

---

## 3. Core model — types + intents + state

All additive/pure-core (no DOM, no `Math`/`Date`), immutable-in/out. The linear
`IntroBeat[]` becomes a sequence of **dialogue SCENES**, each of which is either
an NPC-with-a-question-tree or a topic-less inner beat (the dream). A "scene with
zero topics" degenerates to exactly today's linear choice-only beat — so the
model is a strict *generalization*, and the dream falls out for free.

### 3.1 The tree shape (new — `src/core/content/intro.ts`, reshaped)

Reuse `IntroSetupLine` and `IntroOption` **unchanged** (the option already
carries everything a decision needs). Add the topic node + the scene container:

```ts
/** One askable QUESTION node in an NPC's hub. Exploratory: reveals answer lines,
 *  marks itself asked. Carries NO balanced stat lean (only the decision does). */
export interface DialogueTopic {
  readonly id: string;            // globally unique, e.g. 'soan-kami', 'gen-house'
  readonly label: string;         // the ask-button copy ("Is it true a kami hid me?")
  readonly answer: readonly IntroSetupLine[];  // the NPC's reply line(s) → log/scrollback
  /** Optional: this topic only appears once another has been asked (branching). */
  readonly gate?: (asked: ReadonlySet<string>) => boolean;
  /** Optional exploratory warmth nudge — NEVER a stat lean, NEVER a regard flip.
   *  A curious/kind question may warm the NPC by +1 (see §5 "Memory & stats"). */
  readonly warmth?: number;
  /** One-shot (removed after asking) vs re-askable (stays, dimmed). Default one-shot. */
  readonly reAskable?: boolean;
}

/** The terminal "continue the story" node — the balanced decision (today's beat). */
export interface DialogueDecision {
  readonly prompt: string;               // "What do you say to him?"
  readonly options: readonly IntroOption[];  // the +1/−1 balanced closers (as today)
}

/** One scene of the intro: meet an NPC, ask topics, then decide. A scene with
 *  `topics: []` is a topic-less inner beat (the dream) — no hub, decision only. */
export interface DialogueScene {
  readonly id: string;                   // 'soan' | 'dream' | 'genemon'
  readonly voice: VoiceCategory;         // the nameplate + react colour
  readonly speaker?: NpcId;              // undefined ⇒ narrator/self scene (the dream)
  readonly greeting: readonly IntroSetupLine[];  // shown on entering (today's `setup`)
  readonly topics: readonly DialogueTopic[];     // the ask hub ([] ⇒ decision-only)
  readonly decision: DialogueDecision;   // the terminal balanced choice
  /** Optional gate: a short "wrap-up" line the NPC says when the decision resolves,
   *  distinct from the option's `react` (e.g. a "well then, to work" send-off). */
  readonly closer?: readonly IntroSetupLine[];
}

export const INTRO_SCENES: readonly DialogueScene[];   // replaces INTRO_BEATS
export const INTRO_SCENE_COUNT = INTRO_SCENES.length;  // replaces INTRO_BEAT_COUNT
```

Pure selectors (mirror today's):

```ts
export function introActive(introScene: number): boolean;   // 0..count-1
export function introSceneAt(i: number): DialogueScene | null;
export function introTopic(scene: DialogueScene, id: string): DialogueTopic | undefined;
/** The topics askable RIGHT NOW: gate passes AND (not yet asked OR reAskable). */
export function availableTopics(scene: DialogueScene, asked: ReadonlySet<string>): DialogueTopic[];
export function introOption(scene: DialogueScene, id: string): IntroOption | undefined;
// introOutcomeLine / introStatDelta / introStatLine — unchanged, reused.
```

> **Naming:** keep the state field `introBeat` (see §3.3) to keep the migration
> trivial, but the *unit* is now a "scene." An alternative is to rename the field
> `introScene` and remap in the migration — flagged as **Open Q6**. This plan
> assumes the field name stays `introBeat` and the code/prose calls the unit a
> scene.

### 3.2 State (`src/core/state.ts`)

`introBeat` **keeps its meaning** as the scene cursor (−1 pre-wake · 0..N−1 at
scene i · N done) — the scene array preserves the same 3-scene order, so no
remap. One new field for the ask hub:

```ts
/** Topic ids the player has ASKED (across all scenes; ids are globally unique).
 *  Drives the hub (remove/dim asked one-shots), the branch gates, and the
 *  scrollback. Default []; NEVER cleared on ascension (part of the run's history). */
readonly askedTopics: readonly string[];
```

`createInitialState` seeds `askedTopics: []`. A pure helper mirrors `rememberNpc`:

```ts
export function markTopicAsked(state: GameState, topicId: string): GameState;
// returns state with topicId appended (idempotent — no dup if already present).
```

No explicit "ask phase vs decide phase" flag: the hub and the decision are shown
**together** in the scene (ask above a divider, decide below). Asking is optional
— the decision is always reachable. (Open Q1 weighs a gated "I've said enough"
affordance instead.)

### 3.3 Intents (`src/core/intents.ts`)

One NEW intent + keep the decision intent (renamed for clarity, alias-safe):

```ts
| { type: 'ask_topic'; topicId: string }   // reveal an answer, mark asked (NEW)
| { type: 'choose_intro'; optionId: string }  // the DECISION (unchanged name; see note)
| { type: 'advance_intro' }                // Continue a pure-narration greeting (kept)
```

- **`ask_topic`** (reducer): guard `introActive`; look up the current scene; find
  the topic via `introTopic`; **reject** if the topic isn't on this scene, its
  `gate` fails, or it's already asked and not `reAskable` (no-op — mirrors the
  `choose_intro` guard discipline). Then: (1) push the topic's `answer` lines to
  the log (`voice = scene.voice`, `speaker = NPC_NAME[scene.speaker]`, exactly
  the `revealIntroBeat` shape); (2) `markTopicAsked`; (3) if `topic.warmth`,
  `rememberNpc(state, scene.speaker, { warmth })` **without** touching `regard`
  (a nudge, not a disposition set). **No** stat change, **no** scene advance —
  the player stays in the hub. Optionally also push the MC's *question* as a
  `player`-voice line before the answer (Open Q2 — voiced question vs bare
  button), so the scrollback reads as a two-sided exchange.
- **`choose_intro`** (the DECISION): **unchanged behaviour** — it already reads
  the current node's options, pushes `say`+`react`, applies `applyIntroStat`,
  writes `rememberNpc(regard,warmth)`, emits the milestone `introOutcomeLine`,
  and `enterNextBeat`. The only change is it reads `scene.decision.options`
  instead of `beat.options`. (Kept as `choose_intro` to avoid churn; a rename to
  `decide_scene` is cosmetic and can ride the same commit — Open Q6.)
- **`advance_intro`**: still handles a scene whose greeting is pure narration with
  no immediate decision prompt — but with the ask hub always present, most scenes
  no longer need it. Kept for the dream/self scene if authored as
  greeting-then-decide, and harmless where unused.

Everything routes through the same pure core the renderer reads (A6 / pure-core
boundary) — the log, the attrs, the memory, `askedTopics`.

### 3.4 How it generalizes today's `INTRO_BEATS`

| Today (`IntroBeat`) | Reshaped (`DialogueScene`) |
|---|---|
| `setup[]` | `greeting[]` (renamed) |
| `prompt` + `options[]` | `decision: { prompt, options }` |
| (none) | `topics[]` — the ask hub (NEW) |
| `soan` beat | `soan` scene + 3–4 Sōan topics |
| `genemon` beat | `genemon` scene + 3–4 Genemon topics |
| `dream` beat (no NPC) | `dream` scene, `topics: []` → decision-only inner beat |

The **dream** is a topic-less scene: no `speaker`, `voice: 'narrator'`, an empty
hub, and today's INT↔SPD decision. The UI shows no "Ask" group when `topics` is
empty — it degenerates to exactly today's inner-monologue choice beat. (Open Q3
asks whether the dream could instead grow 1–2 introspective "topics" — e.g.
*dwell on the road* / *reach for the name* — that reveal fragments before the
decision. Default: keep it decision-only, unchanged.)

---

## 4. Content — the topics + decisions

Draft copy (first pass; final voice pass in build Phase 2). Registers held: Sōan
= dry, rational debunker-physician; Genemon = weary, plain-spoken steward of a
fallen samurai house. Mid-Edo grounded, no anachronism. **Decisions REUSE today's
authored options verbatim** (they're already voice-passed) — only the topics are
new.

### 4.1 Scene 1 · Sōan the physician (`voice: physician`, writes `soan`)

**Greeting** (on entering — reuse today's `COLD_OPEN.wake` + `.grounding`):
- narrator: *"You open your eyes. Straw beneath you, the smell of wet rice, a low
  roof you do not know."*
- Sōan: *"You're awake. No kami carried you off, whatever the village wants to
  believe. A flood took you, and a blow to the head took the rest."*

**Ask hub** (topics — the MC asks, Sōan answers; exploratory):

| id | Ask-button label | Sōan's answer (typewriter) |
|---|---|---|
| `soan-what-happened` | *"What happened to me?"* | *"You washed up below the weir three days back, a gash on your scalp and no name to give. The river does that. We fished you out; the rest you'll have to earn back."* |
| `soan-kami` | *"The village says a kami hid me away."* | *"Kami-kakushi — 'spirited away.' It's the tale they tell for every soul that wanders off and every child the river takes. I've tended enough of the 'spirited-away' to know it's water and cold and bad luck, not spirits. Don't let the old women make a haunting of it."* |
| `soan-fragment` | *"There's a road. Grey rain. A name I can't hold."* | *"That's the blow talking, not a ghost. Fragments surface as the swelling goes down — chase them if you must, but a name you have to dig for is rarely one worth keeping."* (plants the dream scene) |
| `soan-mend` | *"How do I get my strength back?"* | *"Rest, rice, and work — in that order at first, then all at once. The body remembers labour before the mind remembers anything. The wits come back last; don't force them."* |

**Decision** (`prompt: "What do you say to him?"` — REUSE today's 3 options):
`soan-grateful` (+1 INT/−1 STR, regard `grateful`) · `soan-curt` (+1 STR/−1 INT,
`curt`) · `soan-worried` (+1 LUCK/−1 AGI, `worried`).

> Note: today's `soan-worried` option's `say` line ("There was a road. Grey
> rain…") now partly overlaps the `soan-fragment` topic. Phase-2 voice pass:
> either keep both (the topic is a question, the decision is a closing stance) or
> re-tune the worried closer so it reads as a *decision* not a re-ask. Flagged in
> Phase 2.

### 4.2 Scene 2 · The dream-fragment (`voice: narrator`, self — no NPC, `topics: []`)

**Greeting** (reuse `COLD_OPEN.dream`):
- narrator: *"Something surfaces and is gone — a porter's knot, a road in grey
  rain, a name you cannot keep hold of."*

**Ask hub:** none (`topics: []`) → the UI shows no "Ask" group.

**Decision** (`prompt: "The fragment tugs. Do you follow it?"` — REUSE today's 3):
`dream-dwell` (+1 INT/−1 SPD) · `dream-shake` (+1 SPD/−1 INT) · `dream-hands`
(+1 STR/−1 LUCK). No memory write (self scene).

### 4.3 Scene 3 · Genemon the steward (`voice: steward`, writes `genemon`)

**Greeting** (reuse `gen-greet` via the dialogue registry, as today):
- Genemon: *"On your feet, then. I am Genemon, steward of this house, and I keep
  the little it has left to keep. The Kurosawa are samurai still — on the lord's
  rolls, if nowhere in the granary."*

**Ask hub:**

| id | Ask-button label | Genemon's answer |
|---|---|---|
| `gen-house` | *"What house is this?"* | *"The Kurosawa. A great name gone to seed — samurai on the rolls, paupers in the granary. I've kept it upright since the last master could not, and I'll keep it upright when you can't either."* |
| `gen-work` | *"What work is there?"* | *"Rice to rake, a paddy to tend, a storehouse standing half-empty. Honest labour and no shortage of it. Earn your keep and there's a dry corner and a bowl in it — that's the whole of what I can promise."* |
| `gen-you` | *"And who are you to me?"* | *"Steward. I run the estate; you'll learn it, or you won't eat. Do as I say on the house's matters and we'll get on well enough."* |
| `gen-danger` | *"Is it safe here?"* (gate: after `gen-work`) | *"Safe as anywhere the lord's men don't ride. There's a wolf gone bold at the grain store, and worse up in the hills. But that's tomorrow's trouble. Today it's rice."* (foreshadows the wolf) |

**Decision** (`prompt: "How do you answer the steward?"` — REUSE today's 3):
`genemon-earnest` (+1 STR/−1 AGI, `earnest`) · `genemon-wary` (+1 AGI/−1 STR,
`wary`) · `genemon-steady` (+1 SPD/−1 LUCK, `steady`).

After Scene 3's decision resolves → `introBeat = INTRO_SCENE_COUNT` → the
intro-complete tail (unchanged: the estate inks in, the rake verb appears,
Genemon's `raked`-gated teaching flows one-per-rake as today).

### 4.4 Content sizing

2–4 topics per NPC (Open Q4). Sōan 4, Genemon 4 as drafted; the dream 0. Ids are
globally unique so `askedTopics` can be a flat set. Topics are DATA (mirrors the
`INTRO_BEATS`/`dialogue.ts` discipline) — no branching script, just gated nodes.

---

## 5. Memory & stats — the invariant holds

- **Only the DECISION moves stats.** `ask_topic` never calls `applyIntroStat`.
  The MC still totals exactly `5 attrs × ATTR_BASE + Σ(net-zero decisions) = 25`
  points after the intro — asking any number of questions changes nothing. This
  is the plan's load-bearing guarantee: exploration is free, so the player is
  never punished (or rewarded with power creep) for being curious.
- **Regard** (the disposition tag later lines gate on) is written **only** by the
  decision's `IntroOption.memory` — one write per NPC, exactly as today. A topic
  never sets `regard`.
- **Warmth** MAY be nudged by a topic (`DialogueTopic.warmth`, optional) — a
  *coarse* +1 for a kind/curious question — but this is deliberately weak: it
  feeds only the later-greeting `memGate`s, never a stat and never the regard
  enum. **Default: no topic sets warmth** (keep the intro's memory 100%
  decision-driven); the field exists for later NPCs who want "asking about their
  late wife warms them." Flagged as **Open Q5** (do questions affect warmth at
  all in the intro?).
- **Independence preserved.** Scene 1 writes only `soan`, Scene 3 only `genemon`;
  the ask hub reads/writes the same per-NPC keys. A player who grills Sōan with
  every question but answers him curtly still gets `soan.regard === 'curt'`.

---

## 6. VN-scene UI — the ask hub → the decision

REUSE the full-screen VN scene (D-104), promoted from DEV variant B
(`renderIntroOverlay` in `dev.ts`) to the **sole prod presentation**
(`src/ui/render.ts`). The scene card grows a two-zone control area beneath the
nameplate + line scrollback:

```
┌────────────────────────────────────────────┐
│  [医] Sōan                                   │  ← introNameplate (voice colour)
│  ──────────────────────────────────────────  │
│  "You're awake. No kami carried you off…"    │  ← greeting + asked answers,
│  You: "The village says a kami hid me?"      │     typewriter-revealed,
│  "Kami-kakushi. It's the tale they tell…"    │     SCROLLBACK (scrolls, re-read)
│                                              │
│  ASK                                         │  ← quiet heading + rule
│  ・ What happened to me?                      │  ← topic buttons (ask style)
│  ・ How do I get my strength back?            │     (asked ones removed / dimmed)
│  ──────────────────────────────────────────  │  ← divider
│  WHAT DO YOU SAY?                            │  ← weighty heading
│  ▸ Thank him — ask how to mend               │  ← decision buttons (primary verb)
│  ▸ Brush it off — ask for work               │
│  ▸ Grasp at the fragment                     │
└────────────────────────────────────────────┘
```

- **Scrollback.** The card's line area accumulates the greeting + every asked
  answer (and, per Open Q2, the MC's voiced question), each in its voice colour,
  typewriter-revealed. It scrolls so the player can re-read — the whole exchange
  is legible before the decision (F9 "story is returnable"). Newest answer
  auto-scrolls into view.
- **Ask group vs decision group read differently.** The **Ask** heading is quiet
  (`--ink-soft`, small caps / a `問` seal), topics are **light/secondary**
  buttons (a `・` or `?` prefix, muted). A **divider rule** separates them from the
  **"What do you say?"** heading (weightier, the scene's voice colour) with the
  decision options as **primary `.verb`** buttons — visually "these commit."
  Reusing `introChoices`' button classes: topics get a new `.intro-ask` class,
  decisions keep `.intro-choice` (the primary style).
- **Asked-topic treatment.** Default **one-shot**: an asked topic is **removed**
  from the hub (its answer lives in the scrollback). `reAskable` topics stay,
  dimmed + tagged "asked." When the hub empties, only the divider + decision
  remain — a natural "you've heard all he'll say; now choose" state. (Open Q1.)
- **Typewriter + reduced-motion.** Reuse the existing story-channel typewriter +
  its reduced-motion guard (instant full line under `.reduced-motion`). Topic
  answers reveal char-by-char like the greeting; the hub buttons are inert until
  the current answer finishes revealing (no click-race).
- **No hub ⇒ no Ask group.** The dream scene (`topics: []`) renders greeting +
  decision only — byte-identical to today's inner beat. Zero special-casing
  beyond "hide the Ask zone when `availableTopics` is empty."
- **Diverge (D-075).** The VN scene itself was already diverged (A/B/C) and
  D-104 LOCKED variant B. Adding the ask-hub *within* that locked frame is an
  extension of an approved surface, not a new surface — but the **hub↔decision
  layout** is a meaningful new sub-surface. Run a **light `diverge`** over the
  hub presentation (e.g. **(A)** two stacked groups with a divider [drafted
  default] · **(B)** an accordion — ask collapses to reveal the decision when the
  player clicks "That's all I wanted to know" · **(C)** a Fallout-style single
  numbered list, topics then decisions inline) behind the DEV toggle, self-pick A,
  one R-item each. Flagged in Phase 3. (Open Q1 overlaps this.)

---

## 7. Build phases

Ordered so a player can reach each increment (R6); each phase is a commit that
passes `npm run verify`; TDD per the always-loaded test discipline (every new
test must be able to go RED; derive fixtures from `INTRO_SCENES` / `ATTR_META`,
never copied magic numbers).

**Phase 1 — Core tree model (pure, no UI yet).** Reshape `intro.ts`:
`IntroBeat`→`DialogueScene` (`setup`→`greeting`, `prompt`+`options`→`decision`),
add `DialogueTopic` + `topics[]`, `INTRO_SCENES`/`INTRO_SCENE_COUNT`, the
selectors (`introSceneAt`, `availableTopics`, `introTopic`). Add
`GameState.askedTopics` + `markTopicAsked` (`state.ts`). Add the `ask_topic`
intent + reducer + guards; point `choose_intro` at `scene.decision.options`.
Keep `INTRO_BEAT_COUNT` as a re-export alias of `INTRO_SCENE_COUNT` so the
migration import doesn't break. *DoD (per D-088 tier e2e + invariants):* unit
tests — `ask_topic` pushes the answer + marks asked + does **not** change attrs
or `askedTopics` idempotency; a one-shot topic is rejected on re-ask; a gated
topic is hidden until its prerequisite is asked; `choose_intro` still writes the
exact ±1/∓1 + regard (net-zero total unchanged); a **full ask→decide e2e** drives
Scene 1 (ask 2 topics → decide) → dream → Scene 3 and lands `introBeat === count`
+ the rake verb; an invariants test asserts total attribute points are constant
across any asking pattern.

**Phase 2 — Content.** Author the final Sōan (4) + Genemon (4) topics + answers
(§4.1/§4.3), the `gen-danger` gate, and reconcile the `soan-worried` decision
copy vs the `soan-fragment` topic (voice pass). Keep the dream decision-only.
Regenerate any content docs if `gen-docs.ts` covers intro/dialogue.

**Phase 3 — VN-scene wiring (the player can reach it).** Promote the VN scene
(dev variant B) to the sole prod intro renderer (`render.ts`); build the ask hub
(topics group) above the divided decision group; wire `ask_topic` /
`choose_intro`; the scrollback (greeting + asked answers, auto-scroll); the
`.intro-ask` (quiet) vs `.intro-choice` (primary) button styles; the typewriter +
reduced-motion reuse; hide the Ask zone when `availableTopics` is empty. Run the
light hub `diverge` (§6) behind the DEV toggle; self-pick A; one R-item per
variant in `review.md`. *DoD:* a headless capture (capture-game-states) shows
meeting Sōan, asking ≥2 topics (answers reveal + accumulate in scrollback), the
divider, then deciding — colours distinguish Sōan / player / narrator; the dream
shows no Ask group; reduced-motion honoured.

**Phase 4 — Migration + docs.** Bump `SCHEMA_VERSION` **3 → 4**
(`constants.ts`); add the v3→v4 migration (§8): hydrate `askedTopics: []`;
`introBeat` carries over **unchanged** (scene order == old beat order). Handle a
save mid-old-linear-intro (`introBeat ∈ {0,1,2}`) — it lands on the same-index
scene with an empty ask hub (they simply won't have asked anything, which is
fine). Update `docs/living/decisions.md` — extend **D-104** (or a new child ADR:
"story NPCs are met via a dialogue TREE: ask hub → balanced decision") and the
F47 row; update `ui-design.md` §5.1 with the ask-hub vs decision styling. Distil
the taste rules.

---

## 8. Migration

`SCHEMA_VERSION 3 → 4`, one new step in `src/persistence/migrate.ts`:

```ts
// v3 → v4 (the dialogue TREE): additively hydrate the ask-hub field. `introBeat`
// is UNCHANGED — the scene array preserves the old 3-beat order (soan/dream/
// genemon → scenes 0/1/2), so an in-flight save resumes at the same index with an
// empty ask hub. npcMemory + introBeat ride along untouched.
3: (s) => ({ ...(s as object), askedTopics: [] }),
```

- **A save mid-old-intro** (`introBeat ∈ {0,1,2}`): lands on the matching scene,
  `askedTopics: []` (nothing asked yet — correct; the player just hasn't used the
  new hub). No player-visible glitch: they see the ask hub appear on the scene
  they were on.
- **A pre-wake save** (`introBeat === -1`): unaffected; the tree runs from
  `open_eyes` as normal.
- **An intro-done save** (`introBeat === count`): unaffected; `askedTopics` is
  cosmetic history at that point.
- Validation (`validate.ts`): add `'askedTopics'` to the `_Handled` ledger with an
  array default (absent ⇒ `[]`), same pattern as `npcMemory`.

---

## 9. Open questions for the human (taste calls)

1. **Ask/decide layout + asked-topic behaviour.** Default: both groups shown
   together (ask above a divider, decide below), asked one-shot topics **removed**
   from the hub. Alternatives (the Phase-3 diverge): an **accordion** ("That's
   all I wanted to know" collapses ask → reveals decide), or a Fallout-style
   **single numbered list**. And: asked topics **removed** vs **dimmed &
   re-askable**? Default removed. Your steer?
2. **Voice the MC's question?** When the player clicks a topic, do we push a
   `player`-voice line of the MC *asking* it (so the scrollback reads two-sided,
   Fallout-style) or just show the NPC's answer? Default: **voice the question**
   (richer scrollback; the `label` doubles as the spoken line, or a separate
   `say` field on the topic).
3. **Does the dream grow topics?** Default: keep it decision-only (topic-less,
   unchanged). Or give it 1–2 introspective "topics" (*dwell on the road* / *reach
   for the name*) that reveal fragments before the INT↔SPD decision?
4. **How many topics per NPC?** Drafted 4 + 4 (+ dream 0). Trim to 2–3 for pace,
   or keep 4? More topics = more flavour but a longer intro before gameplay.
5. **Do questions affect warmth?** Default: **no** — memory stays 100%
   decision-driven in the intro (the `warmth` field exists for later NPCs).
   Or: a curious/kind question nudges warmth +1 (feeds later greetings only, never
   a stat)?
6. **Rename `introBeat` → `introScene` / `choose_intro` → `decide_scene`?** Purely
   cosmetic (the field is now a scene cursor, the intent is now a decision). A
   rename is clean but churns the migration + tests. Default: **keep the names**
   (zero-churn) and document the unit-vs-field-name gap in `intro.ts`.

---

## 10. Risks

- **Reshapes the most-watched moment.** The dialogue tree replaces the shipped
  intro — regression risk on the very first thing a player sees. Mitigate with the
  Phase-1 full ask→decide e2e + a Phase-3 headless capture pass; the decisions
  reuse authored copy, shrinking the change surface to the ask hub + the container
  reshape.
- **Pace vs exploration.** A 4-topic-per-NPC hub could stall "fast to gameplay"
  (a core intro goal). Mitigate: topics are *optional* (the decision is always one
  click away), keep answers to 1–2 sentences, and let Open Q4 trim to 2–3.
- **Net-zero-stat invariant.** The whole design leans on "only the decision moves
  stats." A stray `warmth`/topic that ever touched attrs would break the 25-point
  guarantee — pinned by the Phase-1 invariants test (attribute total constant
  across any asking pattern).
- **Scrollback growth.** Asking every topic makes the scene card tall — needs a
  scroll region with a sane max-height, not an overflowing card. Handle in Phase 3
  (the card already caps at `max-width: 40rem`; add a scrolling line area).
- **Migration coherence.** `introBeat` reuse assumes the scene order == the old
  beat order (it does). If Phase 2 ever reorders/adds scenes before v4 ships, the
  v3→v4 step must remap — noted so it isn't forgotten.
- **Diverge scope.** The hub-layout diverge (§6) is real build cost (D-075 forbids
  LITE) — but it's a *sub*-surface of the already-locked D-104 scene, so scope it
  to the hub↔decision arrangement only, not a full re-theme.
```

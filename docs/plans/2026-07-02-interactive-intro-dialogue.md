# Interactive intro + dialogue system

**Status:** 📝 Proposed — awaiting human review (not yet built).
**Created:** 2026-07-02 · **Author:** agent (design/authoring only).
**Cluster:** the story-presentation cluster — playtest F13, F12, F15, F19,
F23, F26 (`project/human-feedback/2026-07-02-playtest.md`).
**Scope:** the ~3-minute cold-open becomes a VN-style, click-to-continue
interactive intro with 2–3 weighty balanced choices, per-NPC memory, a
speaker/voice model coloured by character category, a GBA typewriter, and a
D-075 diverge over the presentation (3 working variants).

> Queue note: this plan must be added to the human reading queue
> (`project/todo-human.md`) **in the same commit it lands** — the pre-commit
> gate hard-blocks a new `docs/plans/*.md` missing from the queue. Left out of
> this authoring pass on purpose (the task wrote a single file); the committer
> adds the queue line.

---

## 1. Context — what exists today

The cold-open is a one-shot **text dump**. `reduce()`'s `open_eyes`
(`src/core/intents.ts:120`) fires `awake`, pushes three narration lines
(`COLD_OPEN.wake` / `.grounding` / `.dream` from `src/core/content/coldOpen.ts`)
**all at once**, then `deliverDialogue(COLD_OPEN_DIALOGUE_ID)` dumps Genemon's
greet lines. The player never responds; the physician **Sōan** grounds the
folklore in `.grounding` but the player can't answer him (F13). The waking
narration is pre-populated behind the cold-open card, so its cascade is unseen
(F15).

**Cast** (`src/core/content/names.ts`): **Sōan** the debunker-physician (grounds
the cold open), **Genemon** the estate steward (the labour mentor, greets you
and teaches raking), **Kihei** the master-at-arms (arms stub, routed later).
`dialogue.ts` already models mentors as **data** (`DialogueLine { id, speaker,
text, gate }`) with a pure cursor `nextDialogueLines()`; `soan-intro` and
`kihei-intro` are authored-but-not-yet-routed stubs.

**Attributes** (`src/core/content/balance.ts`): five — `str agi int spd luck`,
each base `ATTR_BASE = 5`, driving every derived combat stat. `ATTR_META` holds
label/kanji/gain gloss (`+atk`, `+eva·acc`, `+dmg·known`, `+speed`,
`+crit·luck`) and a diegetic log line. `spend_attribute` already mutates
`character.attrs` immutably — the intro reuses that write path.

**Log** (`src/core/log.ts`): `LogEntry { key, channel, text, tick, count }`;
channels `narration | reward | combat | system | milestone`. **No speaker
field.** The renderer (`src/ui/render.ts` `appendNarration`, ~line 1442) fakes
voice by **regex-detecting quotes** in narration lines and wrapping them in a
`.speech` span coloured `--ai` (indigo) — so **all** speech is one colour, which
F26 rejects. `.speech.player` (→ `--rokusho`) is stubbed in `styles.css:453` but
unused (no player speech exists yet).

**Reveal cascade** (`render.ts` ~1492 `pumpReveal`): new log lines stagger in
one-per-`LOG_STAGGER_MS` (240ms) with a `.reveal` CSS class — a **line-flash**,
not a char-by-char typewriter (F12/F19 want the GBA feel). Reduced-motion is
detected via `matchMedia` + the in-app `.reduced-motion` class.

**Cold-open card**: `render.ts:501` renders a `.coldopen` sibling of `.shell`,
shown until `awake`; the single "Open your eyes" `.verb.primary` dispatches
`open_eyes`.

**Variant registry** (`src/ui/dev.ts`): `SURFACES: SurfaceDef[]` each with
`variants[]`; `variants[0]` is the prod default. `renderVariant()` returns
`false` when the default is selected (caller renders it), else routes to
`renderSurfaceVariant()`. This is where the 3 presentations plug in.

---

## 2. Locked decisions (human, 2026-07-02)

1. **VN-style, click-to-continue.** After "Open your eyes," the intro reveals
   **one beat at a time**; the player clicks **Continue** to advance; choices
   appear at key beats. **2–3 key choice beats total** — tight, fast to
   gameplay, each choice weighty.
2. **Meaningful, BALANCED choices.** Every choice grants a real effect **and** a
   trade-off — a starting-attribute lean where a boost comes **with** a matching
   penalty (**+1 X / −1 Y**, net-zero), never a free boost.
3. **Per-NPC MEMORY, not a global flag.** Each NPC remembers what you said to
   **them** (`npcMemory: Record<NpcId, …>`), set by intro choices, read by that
   NPC's later lines. Answering Sōan curtly changes **Sōan's** later greeting,
   independent of Genemon.
4. **Speaker model + colour-by-CATEGORY.** Log/dialogue lines carry a speaker +
   a character **category**; the renderer colours speech by category so **who**
   is talking reads at a glance. Replaces the render-time quote-detection stopgap
   (all-speech-one-colour).
5. **Presentation = D-075 diverge → 3 WORKING variants.** Three genuinely
   distinct presentations of the same interactive-intro core, live-switchable via
   the DEV panel; agent self-picks a prod default, the other two DEV-only.
6. **Typewriter + reveal timing.** Beats reveal with a GBA char-by-char
   typewriter (**story channel only**; reduced-motion → instant), firing **after**
   the player advances — never pre-run behind a curtain (F15).

---

## 3. Core model (state + types)

All additive, pure-core (no DOM), immutable-in/out. New/changed types:

### 3.1 Speaker / voice (F23/F26)

```ts
// src/core/content/dialogue.ts (or a new src/core/content/voices.ts)
export type NpcId = 'soan' | 'genemon' | 'kihei';           // grows per tier
export type VoiceCategory =
  | 'narrator'    // ambient prose — the muted default
  | 'player'      // the MC's own spoken lines
  | 'physician'   // Sōan (scholar/rational)
  | 'steward'     // Genemon / household
  | 'arms'        // Kihei / drill-yard
  | 'official'    // magistrate / castle voices (future)
  | 'villager';   // Asagiri folk (future)
```

`LogEntry` gains two **optional** fields (back-compat: absent ⇒ today's
behaviour):

```ts
// src/core/log.ts
export interface LogEntry {
  // …existing key/channel/text/tick/count…
  readonly speaker?: string;       // display name or 'You' — for a nameplate (variant B/C)
  readonly voice?: VoiceCategory;  // drives the colour class; absent ⇒ 'narrator'
}
```

`pushLog()` gains optional `speaker`/`voice` params (threaded through
`applyRewards`'s `log:[{channel,text,…}]` shape, which grows `voice`/`speaker`
fields). Coalescing key stays `channel + text` (speech lines rarely repeat, so
this is fine; if two identical-text lines from different speakers ever collide,
add `voice` to the coalesce key — noted as a low risk).

### 3.2 Per-NPC memory (decision 3)

```ts
// src/core/state.ts
export interface NpcMemory {
  /** The disposition tag an intro choice wrote — read by this NPC's later lines. */
  readonly regard: string;   // e.g. 'grateful' | 'curt' | 'worried' (per-NPC enum, string-typed)
  /** Signed warmth, -1|0|+1 — a coarse lever a later line or greeting can read. */
  readonly warmth: number;
}
// GameState gains:
readonly npcMemory: Readonly<Partial<Record<NpcId, NpcMemory>>>;   // default {}
```

`createInitialState` seeds `npcMemory: {}`. A small pure helper:

```ts
export function rememberNpc(state, npc: NpcId, patch: Partial<NpcMemory>): GameState;
export function npcRegard(state, npc: NpcId): string;   // '' when unmet
```

**Why not a global personality flag:** `npcMemory.soan.regard` and
`npcMemory.genemon.regard` are independent keys. Beat 1 writes only `soan`; beat
3 writes only `genemon`. A curt answer to the physician never sours the steward.

### 3.3 Intro state cursor (decision 1)

```ts
// GameState gains one cursor:
readonly introBeat: number;   // -1 = pre-wake; 0..N-1 = at beat i; N = intro done
```

`createInitialState` seeds `introBeat: -1`. `open_eyes` sets it to `0` and
reveals beat 0. Advancing increments it. When `introBeat >= INTRO_BEATS.length`,
the intro is over and the normal Work verbs (rake) appear. (Kept as a plain
integer, not an object — one field, easy to save-migrate; bump `SCHEMA_VERSION`.)

### 3.4 The beat data shape (decision 2)

```ts
// src/core/content/intro.ts  (new — DATA, not script; mirrors dialogue.ts discipline)
export interface IntroOption {
  readonly id: string;               // stable, e.g. 'soan-grateful'
  readonly label: string;            // the button copy the player clicks
  readonly say: string;              // the MC's spoken line → log, voice='player'
  readonly react: string;            // the NPC's immediate reaction → log, voice=beat.voice
  readonly stat: { readonly up: AttrId; readonly down: AttrId };  // +1 up / -1 down (net-zero)
  readonly memory?: { readonly npc: NpcId; readonly regard: string; readonly warmth: number };
}
export interface IntroBeat {
  readonly id: string;
  readonly voice: VoiceCategory;     // who addresses you (setup lines + nameplate)
  readonly speaker?: NpcId;          // undefined ⇒ a narrator/self beat
  readonly setup: readonly { readonly voice: VoiceCategory; readonly text: string }[];
  readonly prompt?: string;          // the choice prompt; absent ⇒ a Continue-only beat
  readonly options?: readonly IntroOption[];   // absent ⇒ pure narration (just Continue)
}
export const INTRO_BEATS: readonly IntroBeat[];
```

Pure selectors: `currentIntroBeat(state): IntroBeat | null`,
`introActive(state): boolean` (`introBeat >= 0 && < length`).

### 3.5 Choice → effect + memory wiring (intents)

Two additive intents (`src/core/intents.ts` `Intent` union):

```ts
| { type: 'advance_intro' }                     // Continue past a narration-only beat
| { type: 'choose_intro'; optionId: string }    // pick an option at a choice beat
```

Reducer sketch (both guard `introActive(state)`; illegal ⇒ no-op):

- **`open_eyes`** (rewritten): set `awake`, set `introBeat = 0`, reveal beat 0's
  `setup` lines (each with its `voice`) **into the log now** (F15 — after the
  click). Do **not** dump grounding/dream/Genemon anymore; those become beats.
- **`advance_intro`**: `introBeat++`; if the new beat exists, reveal its `setup`
  lines; if `introBeat` now `>= length`, fire the **intro-complete** tail (see
  §4.4) — the estate opens, the rake verb appears, Genemon's rake-teaching
  (existing `deliverDialogue`, gated on `raked`) proceeds as today.
- **`choose_intro`**: look up `currentIntroBeat().options` by `optionId`; then
  (1) push the option's `say` line (`voice:'player'`, `speaker:'You'`); (2) push
  its `react` line (`voice: beat.voice`, `speaker: NAMES[...]`); (3) apply the
  stat delta — `attrs[up]+1`, `attrs[down]-1` (reuse the `spend_attribute`
  immutable write, but with no `attributePoints` cost — a dedicated
  `applyIntroStat` helper); (4) if `memory`, `rememberNpc(state, npc, {regard,
  warmth})`; (5) `introBeat++` and reveal the next beat's `setup` (or the tail).

Everything routes through the **same** pure core the renderer reads — the log,
the attrs, the memory. No renderer-side game logic (A6/pure-core boundary).

### 3.6 Reading memory in a later line (decision 3)

`DialogueLine` gains an **optional** memory gate, combined with the existing flag
gate (both must pass):

```ts
export interface DialogueLine {
  // …existing id/speaker/text/gate…
  readonly voice?: VoiceCategory;                  // colour tag (else inferred from speaker)
  readonly memGate?: (mem: Readonly<Partial<Record<NpcId, NpcMemory>>>) => boolean;
}
```

`nextDialogueLines()` gains a fourth arg `npcMemory` and ANDs `memGate` into the
filter. A later greeting is authored as **two mutually-exclusive lines**, one per
regard branch (only one passes its `memGate`) — see §4.5.

---

## 4. Content — the concrete beats

Three weighty beats: **Sōan** (memory + STR↔INT), a **self/dream** beat (no NPC
memory, INT↔SPD lean), **Genemon** (memory + STR↔AGI). Each option is
**net-zero** (+1/−1), so the MC still totals 25 attribute points — the lean is
the point, not power creep. Copy below is a first draft (final voice pass in
build phase 2; keep the weary lower-samurai / rationalist-physician registers).

### 4.1 Beat 1 · Answer Sōan the physician  (voice `physician`, writes `soan`)

**Setup** (revealed on `open_eyes`, after the wake line):
- narrator: *"You open your eyes. Straw beneath you, the smell of wet rice, a
  low roof you do not know."* (= `COLD_OPEN.wake`)
- physician (Sōan): *"You're awake. No kami carried you off, whatever the village
  wants to believe. A flood took you, and a blow to the head took the rest.
  Bodies forget. Given work and rice, they also mend."* (= `COLD_OPEN.grounding`)

**Prompt:** *"What do you say to him?"*

| # | Option (button) | MC says (`player`) | Sōan reacts (`physician`) | Stat | Memory |
|---|---|---|---|---|---|
| A | Thank him; ask how to mend | *"Then I'll trust your craft, not the village's ghosts."* | *"Sense, at last. Rest, eat, and let the swelling go down. The wits come back last — don't force them."* | +1 INT / −1 STR | soan `grateful`, warmth +1 |
| B | Brush it off; ask for work | *"Kami or flood, I'm still breathing. Where's the work?"* | *"...Hm. No patience for a physician. Well — the body heals the same whether you thank me or not."* | +1 STR / −1 INT | soan `curt`, warmth −1 |
| C | Grasp at the fragment | *"There was a road. Grey rain. A name I can't hold. Is that the fever?"* | *"That is the blow talking, not a ghost. It will fade — or it won't. Don't let the old women make a haunting of it."* | +1 LUCK / −1 AGI | soan `worried`, warmth 0 |

STR↔INT is the clean body-vs-mind axis; C is the intuition/omen lean (LUCK) at a
small footwork cost.

### 4.2 Beat 2 · The dream-fragment  (voice `narrator`, self — no NPC memory)

**Setup:**
- narrator: *"Something surfaces and is gone — a porter's knot, a road in grey
  rain, a name you cannot keep hold of."* (= `COLD_OPEN.dream`)

**Prompt:** *"The fragment tugs. Do you follow it?"*

| # | Option | MC says/thinks (`player`) | Beat reaction (`narrator`) | Stat | Memory |
|---|---|---|---|---|---|
| A | Dwell on it | *"Hold the road. The rain. Almost a name."* | *"You chase it inward — and the ache in your skull chases you back. The name stays lost, but the habit of looking sets in."* | +1 INT / −1 SPD | — |
| B | Shake it off | *"Later. The body is here; the past isn't."* | *"You let it go and the room sharpens — the slats of light, the way out."* | +1 SPD / −1 INT | — |
| C | Trust the hands | *"A porter's knot. My hands know this much."* | *"Your fingers move before you decide to — a labourer's memory, still in the muscle."* | +1 STR / −1 LUCK | — |

A self-facing beat (no NPC present) → writes no memory, only the lean. Keeps the
intro to **two** NPC-memory beats (Sōan, Genemon) + one introspective beat.

### 4.3 Beat 3 · Answer Genemon the steward  (voice `steward`, writes `genemon`)

**Setup:**
- steward (Genemon): *"On your feet, then. I am Genemon, steward of this house,
  and I keep the little it has left to keep. The Kurosawa are samurai still — on
  the lord's rolls, if nowhere in the granary."* (= existing `gen-greet`)

**Prompt:** *"How do you answer the steward?"*

| # | Option | MC says (`player`) | Genemon reacts (`steward`) | Stat | Memory |
|---|---|---|---|---|---|
| A | Earnest — point me at the work | *"I'll earn my keep. Point me at it."* | *"...Good. The house has had its fill of hands that don't. We'll see if you mean it."* | +1 STR / −1 AGI | genemon `earnest`, warmth +1 |
| B | Wary — what's in it for me | *"A samurai house with an empty granary. What's in it for me?"* | *"An honest question, and a cold one. Rice and a dry corner — that's the whole of what I can promise. Take it or walk."* | +1 AGI / −1 STR | genemon `wary`, warmth −1 |
| C | Silent — just get to work | *(You say nothing, and reach for the spilled rice.)* | *"...A man who works before he talks. Rare. We'll get on."* | +1 SPD / −1 LUCK | genemon `steady`, warmth +1 |

After beat 3 resolves, `introBeat = 3 (= length)` → the **tail** (§4.4).

### 4.4 The intro-complete tail

On the advance that ends the intro: reveal the closing narration
(`COLD_OPEN.bodyReveal` + `COLD_OPEN.riceReveal`, `voice:'narrator'`) — the
"take stock / rice on the floor" beat that today opens the rake loop — then hand
off to the estate: the rake verb appears (unchanged `availableActions` once
`awake && !rank-r1`), and Genemon's existing rake-teaching lines (`gen-rake` /
`gen-keep` / `gen-kept`, gated on `raked`) proceed exactly as today via
`deliverDialogue`, **now carrying `voice:'steward'`**.

### 4.5 Sample later callback (per-NPC memory read)

The stubbed `soan-intro` dialogue (routed when the healing onboarding lands)
opens with **one of two** mutually-exclusive greeting lines, chosen by
`npcMemory.soan.regard` — proving the memory is per-NPC and durable:

```ts
{ id: 'soan-greet-grateful', speaker: NAMES.physician, voice: 'physician',
  memGate: (m) => m.soan?.regard === 'grateful',
  text: `${NAMES.physician} looks up. "You came back on your own feet — I told you the wits mend last. Sit. Let's see what's still bitter to steep."` },
{ id: 'soan-greet-curt', speaker: NAMES.physician, voice: 'physician',
  memGate: (m) => m.soan?.regard === 'curt' || m.soan?.regard === 'worried',
  text: `${NAMES.physician} does not look up. "Still no patience for a physician, I see. Sit anyway. This will sting, and you'll thank me later — or you won't."` },
```

Independence check: **Genemon's** later lines gate on
`m.genemon?.regard` only. A player who was curt to Sōan but earnest to Genemon
gets Sōan's cool greeting **and** Genemon's warm one — the two never cross-feed,
because they read different keys.

---

## 5. Presentation variants (D-075 diverge — 3 working)

All three drive the **identical** core (`INTRO_BEATS`, `advance_intro` /
`choose_intro`, the typewriter, the voice colours). They differ **only in where
the beat text + Continue/choice controls render**. Registered in `dev.ts`
`SURFACES` as surface id **`intro`**, variants `intro-inline` (default) /
`intro-scene` / `intro-dock`. Self-picked prod default: **A (inline)** — it
reuses the log-as-hero + existing verb column, keeps the story in the returnable
Story tab, and gets the player to the first rake fastest.

### Variant A — Inline in the story-log panel  *(self-picked default)*

Beats reveal as narration lines **in the right-hand story log** (the hero
surface), typewriter-revealed. The **Continue** button and the choice buttons
render in the **left Work column** (where verbs already live), beneath a small
"···" dialogue prompt row. Picking an option pushes the MC's `say` line + the
NPC's `react` line into the log, then the next beat's setup. When the intro ends,
the Work column simply swaps the choice buttons for the rake verb — a seamless
hand-off, no scene transition.
*Pros:* zero new surface; the whole intro is preserved in the Story tab to
re-read (F9 "story is returnable"); fastest to gameplay. *Cons:* less cinematic
than a dedicated scene; choices are visually separated from the log text.

### Variant B — Dedicated full-screen dialogue SCENE

A centered VN panel (a persistent sibling of `.shell`, like today's `.coldopen`
card) shown for the whole intro: a **speaker nameplate** (the NPC's name + a
category-colour ink rule) with a simple **ink-seal "portrait"** — a
category-coloured circle bearing the NPC's initial kanji (Sōan 宗 / Genemon 源;
no art pipeline, pure CSS + type, per the ui-design no-asset rule), the beat text
typewriter-revealed in a wide textbox, and the choices **centered** beneath.
The estate UI is hidden until the intro completes, then the scene fades out and
hands off to the estate shell.
*Pros:* cinematic, focused; matches F14's "atmospheric surfaces keep generous
breathing room." *Cons:* hides the world longest; the fade-in of the estate is an
extra beat to get right.

### Variant C — Bottom "dialogue dock" overlay

The estate shell renders **behind, dimmed and inert**; dialogue plays in a
**fixed bottom dock** (anchored above the app footer, full-width) — a GBA/JRPG
textbox with the speaker nameplate top-left (category-coloured), the beat text
typewriter-revealed, a right-aligned ▸ advance caret, and choices as a compact
vertical menu inside the dock. The world is **visible but quiet** the whole time,
so the hand-off to gameplay is just the dock closing (strongly satisfies F15 —
you watch the world you're about to act in).
*Pros:* keeps the world present; reads as a console RPG; natural mobile fit;
reuses the fixed-footer shell (F5). *Cons:* the dock competes with the footer
controls for the bottom edge; dimming the shell needs care not to look broken.

---

## 6. Build phases

Ordered so a player can reach each increment (R6). Each phase is a commit that
passes `npm run verify`; TDD per the always-loaded test discipline (each new test
must be able to go RED; derive fixtures from `INTRO_BEATS` / `ATTR_META`, never
copied magic numbers).

**Phase 1 — Core model (pure, no UI yet).** Add `NpcId` / `VoiceCategory`,
`LogEntry.speaker?/voice?` (+ `pushLog` params), `NpcMemory` +
`GameState.npcMemory` + `rememberNpc`/`npcRegard`, `GameState.introBeat`, the
`IntroBeat`/`IntroOption` types + a **skeleton** `INTRO_BEATS`, the
`advance_intro`/`choose_intro` intents + reducer wiring + `applyIntroStat`,
selectors `currentIntroBeat`/`introActive`. Bump `SCHEMA_VERSION` + a save
migration (old saves: `introBeat = awake ? length : -1`, `npcMemory = {}`).
*DoD:* unit tests — a `choose_intro` writes the exact +1/−1 attrs (net-zero) and
the exact `npcMemory[npc].regard`; a curt-Sōan choice leaves `genemon` untouched;
`nextDialogueLines` picks the right `memGate` branch; a full 3-beat e2e drives
`introBeat -1→3` and lands the rake verb (per D-088 tier e2e habit).

**Phase 2 — Content.** Write the final `INTRO_BEATS` copy (§4.1–4.4) + the
`soan-greet-*` / `genemon-greet-*` memory-branched callbacks (§4.5). Voice pass
for register. Regenerate any content docs if `gen-docs.ts` covers dialogue.

**Phase 3 — Default presentation (Variant A inline) + typewriter + voice
colours.** Rewrite the `open_eyes`/intro render path: read `currentIntroBeat`,
render Continue/choice `.verb` buttons in the Work column, dispatch the intro
intents. Implement the **char-by-char typewriter** for the **story channel
only** (replace/extend `pumpReveal`: reveal each narration/player/NPC line
letter-by-letter; reduced-motion → instant full line; non-story channels keep
today's flash). Replace `appendNarration`'s fixed-`--ai` quote colour with a
**voice colour class** per line (`voice-physician` → `--ai`, `voice-steward` →
`--ochre`, `voice-player` → `--rokusho`, etc. — §7); player lines get the
reserved `.speech.player` style. Ensure beats fire **after** the advancing click
(F15 — the cascade is never pre-run behind the cold-open card).
*DoD:* a headless play-through (capture-game-states skill, human/agent) shows the
3 beats reveal one at a time, choices work, colours distinguish Sōan / Genemon /
player / narrator, and the typewriter honours reduced-motion.

**Phase 4 — The two alt variants (B scene, C dock).** Build `intro-scene` and
`intro-dock` behind the `dev.ts` `intro` surface toggle (both fully working, no
LITE). File **one R-item per variant** in
`project/human-in-the-loop/review.md`; the human reviews live and overrides the
self-picked default. Zero PROD flag-debt: prod ships only the default until the
human picks.

**Phase 5 — Polish + docs.** Unread-count interplay if intro lines land while on
another log tab (F20, if built); update `docs/living/ui-design.md` §5.1 (the
voice-colour palette + speaker-tagged entries, retiring the quote-detection
stopgap) and the F13/F23/F26 rows; add an **ADR** in
`docs/living/decisions.md` ("the intro is interactive VN dialogue with per-NPC
memory and a speaker/voice model"). Distil the taste rules from the F-cluster.

---

## 7. Voice → colour map (on-palette, decision 4)

| Category | Speaker(s) | Token | Rationale |
|---|---|---|---|
| `narrator` | — (ambient prose) | `--ink-soft` | today's muted narration default |
| `player` | the MC ("You") | `--rokusho` | already reserved as `.speech.player` |
| `physician` | Sōan | `--ai` | cool indigo = the rational/scholar voice |
| `steward` | Genemon | `--ochre` | the estate earth tone (pillar-estate) |
| `arms` | Kihei | `--beni` | the arms crimson (pillar-arms) |
| `official` | magistrate/castle (future) | `--kihada` | officialdom gold |
| `villager` | Asagiri folk (future) | `--gold` | muted folk gold |

The colour comes from `entry.voice` (a `voice-<category>` class on the log line /
speech span), **not** the quote regex. Narrator prose stays `--ink-soft`; a
narration line that also contains a quote keeps italic emphasis on the quoted run
but takes its colour from the speaker's voice. This is the real speaker tag that
retires the stopgap where all speech was `--ai`.

> **Contrast caveat (a11y):** `--kihada` / `--gold` are light earth tones — verify
> each voice colour clears **WCAG AA on `--surface`** (per ui-design §5.3's
> per-token guarantee); darken the token used for text if it doesn't. Sōan `--ai`,
> Genemon `--ochre`, player `--rokusho`, Kihei `--beni` are already used as text
> elsewhere and pass.

---

## 8. Open questions for the human (taste calls)

1. **Beat count — 3 or 2?** This plan proposes **3** (Sōan / self-dream /
   Genemon). If "fast to gameplay" trumps the introspective middle beat, drop
   beat 2 → **2** beats (both NPC-memory), and the dream stays pure narration.
   Which?
2. **Stat lean magnitude.** `+1/−1` (net-zero, proposed) vs `+2/−1` (a slight net
   gain to make choices feel more consequential at the cost of a tiny power
   bump). Locked decision says balanced → `+1/−1`; confirm you don't want the
   punchier `+2/−1`.
3. **Can the player see the trade-off before choosing?** Options: (a) buttons show
   the raw delta ("+1 INT / −1 STR") — legible but breaks diegesis; (b) hidden —
   pure roleplay, discover via the stat panel; (c) a subtle gloss (the `react`
   line hints at the lean). Proposed: **(c)** for immersion, with the delta shown
   in the log's system line after picking. Your call.
4. **Prod default variant.** Self-picked **A (inline)**. B (scene) is more
   cinematic; C (dock) keeps the world present. Confirm A, or steer.
5. **Portrait treatment for variant B/C.** Proposed: a category-coloured ink seal
   with the NPC's initial kanji (no art pipeline). Acceptable, or do you want
   nameplate-only (no seal)?
6. **Does memory persist past T0?** The intro writes `npcMemory` that later T0
   lines read (§4.5). Should it carry across ascension into T1+, or reset each
   tier? (Leaning: persist — it's the MC's history.)

---

## 9. Risks

- **`open_eyes` rewrite touches the most-watched moment.** The intro replaces the
  cold-open dump — regression risk on the very first thing a player sees. Mitigate
  with the full-arc e2e (Phase 1 DoD) + a headless capture pass.
- **Save migration.** `introBeat` + `npcMemory` + `SCHEMA_VERSION` bump; an
  in-flight save must land coherently (`awake` ⇒ intro already done). Test the
  migration explicitly.
- **Typewriter perf / feel.** Char-by-char on the story channel must not lag the
  frame or fight the smooth-scroll (F7). Scope strictly to story lines; reuse the
  reduced-motion guards. A too-slow typewriter drags — expose the per-char ms as a
  tunable and let the human dial it (they approved the GBA feel in F17).
- **Voice-colour proliferation.** Seven categories risk a rainbow; hold the line
  at these seven, one token each, and verify AA (§7 caveat).
- **Log coalesce key.** If a player-`say` line ever byte-matches a narration line,
  the `channel+text` coalesce could merge them; add `voice` to the coalesce key if
  it ever bites (low likelihood — authored copy differs).
- **Variant scope.** Three fully-working presentations is real build cost (D-075
  forbids LITE). Phases 3 and 4 are separately shippable — the default (A) can go
  live and be played while B/C are built behind the toggle.
```

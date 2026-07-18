# Narrative authoring format (FB-5)

The T0 story is authored HERE, as structured markdown — these files are
the **source of truth**; `pnpm run gen:narrative` compiles them into the
generated `*.gen.ts` registries the engine imports (`gen-narrative
--check` is the drift gate). Prose is the visible thing: the file reads
as a script in any markdown preview, and a story edit is a prose edit.

These are **source files, not docs** (they live under
`src/core/content/` on purpose); the compiled one-page reading copy is
`docs/content/t0-story.md`.

## Files

- `rung-beats.md` → `../rungBeats.gen.ts` — the ADR-110 rung-up beats,
  R1→R7 (re-exported by `../rungBeats.ts`, which keeps the types +
  helpers).
- `intro.md` → `../intro.gen.ts` — the three intro VN scenes (`## scene`
  — fixed order soan/dream/genemon; options carry
  `say:`/`stat:`/`perk:`).
- `dialogue.md` → `../dialogue.gen.ts` — teach-by-reveal defs (`##
  dialogue
  <id> · <NAMES-key>`, `### line <id>` with `voice:`/`when:`; an unreferenced
  def must carry `unrouted: <reason>`).
- `cold-open.md` → `../coldOpen.gen.ts` — keyed prose (`## prose
  cold-open`, `### <key>`); `rakeLine` (real logic) stays hand-written.
- `flavor.md` → `../flavor.gen.ts` — fiction-voiced **UI flavor lines**
  the renderer shows OUTSIDE a VN scene (lock-hints, gate explainers),
  keyed prose (`## prose flavor`, `### <key>`). Live-switchable in the
  DEV set-switcher (`dev.subFlavor`) — a diverge on one ships its takes
  as a `takes/` bundle (ADR-143). Re-exported by `../flavor.ts`.
- `scenes.md` → `../scenes.gen.ts` — the **generalized VN scenes**
  (storywave G3.5): scenes NOT tied to a rung promotion (season-exit
  overlays, the nengu ceremony, the R5 Count, authored side-beats), one
  `## scene-def <id>` block each. Re-exported by `../scenes.ts` (which
  keeps the types + `sceneById`). A STUB at G3.5; filled at G4.1.
- `asks.md` → `../asks.gen.ts` — the **everyday-ask registry** (FB-415,
  talk-system redesign): `## ask <id> · <npc>` blocks — meta (`rungs:`
  window `R0+`/`R0–R3`/`R2` · required `label:` — the MC's spoken
  question, quotes verbatim · optional `when:` flag/regard gate ·
  `refresh:` from the CLOSED `../ask-refresh.ts` vocabulary · `native:`
  from `../ask-natives.ts`, the real-logic escape hatch, exclusive with
  prose), then static answer prose (speech/narr lines, each with a
  line-id marker — the takes-overlay address `ask.<id>.<line-id>`).
  Re-exported by `../asks.ts` (the gen→engine mapping); the engine
  (selector + `ask` intent) is `core/asks.ts`. Answers render INLINE in
  the talk surface, never any log channel (D4).
- `requirements.md` → `../requirements.gen.ts` — the **hidden
  rung-requirement lists** (FB-121 / ADR-137), one `## requirements
  R<n>` block per rung R0–R7 (the validator holds the set to exactly all
  eight, each with **≥3 requirements** — the hard minimum, human
  2026-07-07). Each `### req <id> ·
  <spec>` is one requirement; the spec grammar is CLOSED — `count
  <verb:subject> <N>` (the quest token grammar), `flag <id>`, `state
  resource|banked <res> >= <N>`, `state belonging <id>`, `state skill
  <id> >=
  <N>`, or `native <key>` (a hand-written predicate in
  `core/requirements-engine.ts` `NATIVE_PREDICATES` — real logic never
  grows this grammar). Every req carries `flavor:` (the diegetic
  completion line) and `drive:` (the sim bot's satisfaction hint) — both
  required. Re-exported by `../requirements.ts`; counts tune by edit →
  `gen:narrative` → sim (ADR-132; no balance.ts mirror). Flavor diverges
  review LIVE in the DEV Story switcher via a `## prose req-flavor`
  takes unit (see [`takes/README.md`](takes/README.md) — the
  core-overlay pattern).
- All of the above also compile into the one-page reading script
  [`docs/content/t0-story.md`](../../../../docs/content/t0-story.md) —
  the requirements render there as the human's sign-off section.

Ph3 grammar quick-reference (details inline below where shared): `when:
<flag>` gates a dialogue line on a story flag; `when: <npc>.regard
is|not <value>` on per-NPC memory. `@cold-open.<key>` /
`@dialogue.<def>/<line>` REUSE a line (compiled to the same
single-source expression, never a copy). `{key}` interpolates a `NAMES`
entry in any text. `say:` overrides an option label as the MC's spoken
line; `stat: +int -str` is the intro's net-zero lean; `perk: <Name> —
<desc>` the granted perk.

## Grammar

A file is a sequence of **scenes**. `<!-- … -->` comments are authorial
notes, ignored by the compiler (they may span lines).

### Scene heading + meta

```markdown
## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level,
  panel-bestiary, panel-house-influence
```

`## rung <registry-key> · <scene-id>`, then a compact `key: value` meta
block (ends at the first blank line). `speaker` is an NPC id; `voice`
the scene's fallback voice; `motivates` the unlock ids this beat
narrates (comma list; continuation lines indent two spaces).

### Prose

- `> …` — a narrator / stage-direction line (no speaker). Consecutive
  `>` lines are one paragraph.
- `Kihei: "…"` — a speech line. The speaker is a display name resolved
  through the `NPC_NAME` reverse map; its voice defaults to
  `NPC_VOICE[npc]`. A non-NPC (ambient) speaker or a voice override is
  explicit: `Yohei (villager): "…"` (resolved through `NAMES`). The
  quotes are part of the line, verbatim.
- `You: "…"` — the MC speaking (FB-198). Compiles to `voice: 'player'`
  with NO static name — the engine resolves the nameplate at display
  time through the G4.7 speaker ladder (`playerSpeaker`: You → Nameless
  → Gonbei), so the mid-story label flips land without touching the
  authored line. Never takes a `(voice)` override, and a rung-beat react
  can't be one (a react is the NPC's reply).

Hard-wrap prose at ~72 chars; continuation lines are flush-left (speech)
or `> `-prefixed (narrator) and rejoin with a single space — a wrap can
only occur at an existing space, so CJK runs are unbreakable by
construction.

#### Line ids — `<!--#the-slug-->` (REQUIRED on greeting + answer lines)

A **greeting** line and a **topic answer** are the two prose classes the
SAVE's log addresses by name (`greeting.<id>` ·
`topic.<t>.answer.<id>`), so each carries an authored id: an
HTML-comment marker on the line **above** the block.

```markdown
<!--#do-you-know-the-year-->
Sōan: "Do you know the year?"
```

A comment on purpose — it renders as **nothing**, so these files still
read as a script in any markdown preview. **Never renumber, never
reuse:** an id is a line's permanent name. Rename it only when the line
becomes a genuinely *different* line — an old save's entry then falls
back to the prose it stored (the words the player actually read) rather
than silently landing on a NEIGHBOUR, which is what the old positional
addressing did (ADR-186's known limit, closed 2026-07-13).

- **Reorder freely.** The id travels with its line, so moving lines
  changes nothing for an existing save. A REWORD *keeps* the id, and the
  new words reach every save that ever logged it — the whole point, and
  what a text-derived id could not do (it would orphan on exactly that
  edit).
- Compile fails (`file:line`) on a greeting/answer line with **no**
  marker, and on a marker with **no line under it** — a dropped id is a
  log entry that orphans on the next load.
- Everything else a scene holds (an option's `say`/`react`, a dialogue
  line) is already addressed by its OWN id and takes no marker.
- Bulk-fill a NEW story file with `pnpm exec tsx
  src/scripts/narrative-add-line-ids.ts` (`--check` only reports): it
  derives a slug from each un-idded line's opening words. Read the diff
  — the slug is a first draft; a hand-picked name is better.

### Topics (the ask-hub)

```markdown
### ask kihei-who · "Who are you, drillmaster?"
after: kihei-why-blade
```

`### ask <id> · <label>` (label verbatim, quotes included — it is also
the MC's spoken question). The optional `after: <topic-id>` compiles to
the `asked.has(<id>)` gate. Answer lines follow as prose.

### The decision

```markdown
### decide · How do you take up the blade?

#### r3-disciplined · "Teach me to stand a watch."

Kihei: "...Good answer. A wall that holds is worth ten swords that swing wild.
Come at dawn — before the others."

memory: kihei +1 (disciplined)
flags: r3-disciplined
bonus: +1 agi — "Kihei drills you an extra dawn; your feet learn the watch.
  (+1 AGI)"
```

`### decide · <prompt>`, then `#### <option-id> · <label>` per option.
The label doubles as the MC's `say` line (a `say:` annotation overrides
where they differ — the intro). The option's one speech paragraph is the
`react` — and **naming a different speaker is how a two-voice react is
written** (e.g. a second speaker answers a decision the granter owns →
`reactNpc`).

Effect annotations, one per line, order-free, after the react:

| annotation | example | compiles to |
|---|---|---|
| `memory:` | `kihei +1 (disciplined)` · `genemon +0, kihei +1 (friend)` | `memory: [{npc, warmthDelta, regard?}]` |
| `flags:` | `r4-generous, r4-drills-begun` | `flags: […]` |
| `bonus:` | `+1 agi — "…delight line…"` | `statBonus` (the rare BQ2 stat nudge) |
| `stance:` | `chudan` | `setStance` (R5 only) |

Annotation continuation lines indent two spaces.

### The scene-def block (storywave G3.5)

```markdown
## scene-def sb-dog
trigger: flag orchard-reclaimed
once: true
speaker: kihei
voice: arms

> Kihei crosses the cleared ground on his round and stops beside you.

### decide · The dog watches you decide.

#### sb-dog-drive · "The orchard's cleared. All of it."
Kihei: "Cleared is cleared."
memory: kihei +1 (thorough)
flags: sb-dog-driven
```

`## scene-def <id>` compiles to a `SceneDef` (`../scenes.ts`) — a
generalized VN scene fired OUTSIDE the rung ladder. Meta keys:
`trigger:` (required — one of `rung <R#>` / `season-exit <season>` /
`flag <id>` / `verb` / `scripted`), `once:` (optional; presence ⇒
play-once), `voice:` (required — the scene's fallback voice), optional
`speaker:` / `motivates:`, and optional `reading: R<n>` — READING-SCRIPT
placement only (2026-07-18 interleave): the `t0-story.md` emitter files
the def under that rung's ladder heading instead of "Generalized
scenes". Zero runtime meaning — the key never reaches `scenes.gen.ts`;
it restates a code-scripted home (e.g. `count` is enqueued at the R5
ascension in `intents.ts`) so the reading spine stays continuous. R1–R7
only (the intro IS the R0 beat), and a def whose trigger is already
`rung <R#>` must not carry it (one placement source — validate REDs
both). The body reuses the **rung-scene grammar** (greeting + optional
topics + **optional decision**); the `scene` payload is a plain
`RungScene` with no `rank` (non-promotion content).

**The speakerless narration-only beat (ADR-165):** omit the decision
entirely — a narrator-voiced greeting (no granter speaker) with no `###
decide` block. The compiler emits an empty `decision: { prompt: '',
options: [] }` so the engine drives it via its narration-only continue
path. A malformed trigger (unknown kind, `season-exit` with no season,
an unknown season) is a validation error.

## What stays hand-written TS

All interfaces and engine types; the reducers/intents; every
selector/helper (`rungBeatFor`, `nextDialogueLines`, `rakeLine`, …); the
mechanical registries (`ranks`, `surfaces`, `balance`, …). A future beat
that needs real logic uses the **native escape hatch** (plan §8.1):
declare the scene `native:` and keep its data in a `*.native.ts` sidecar
— never grow this grammar toward code.

## Liberties vs the FB-5 plan (documented per the "mostly locked" human call)

- **oxfmt, not prettier** — the plan predates the repo's formatter;
  generated output is piped through oxfmt so it passes the `oxfmt
  --check` gate untouched.
- **Heading lines are exempt from the ~72 wrap** (a heading can't
  continue onto a second line; same class of exception as tables/URLs).

## Machinery

- Compiler: `src/scripts/narrative/parse.ts` (md → AST, per-node
  file:line) + `emit.ts` (AST → TS source) +
  `src/scripts/gen-narrative.ts` (the CLI: bare = write, `--check` =
  byte-compare; mirrors `gen-docs.ts`).
- Errors always cite the **authoring** file:line, never the generated
  file.
- A hand edit to a `*.gen.ts` is drift by definition — the gate goes RED
  with a message naming the `.md` to edit instead.

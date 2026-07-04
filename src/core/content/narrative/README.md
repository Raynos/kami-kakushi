# Narrative authoring format (F5)

The T0 story is authored HERE, as structured markdown — these files are the
**source of truth**; `npm run gen:narrative` compiles them into the generated
`*.gen.ts` registries the engine imports (`gen-narrative --check` is the drift
gate). Prose is the visible thing: the file reads as a script in any markdown
preview, and a story edit is a prose edit.

These are **source files, not docs** (they live under `src/core/content/` on
purpose); the compiled one-page reading copy is `docs/content/t0-story.md`.

## Files

- `rung-beats.md` → `../rungBeats.gen.ts` — the D-110 rung-up beats, R1→R7
  (re-exported by `../rungBeats.ts`, which keeps the types + helpers).
- `intro.md` → `../intro.gen.ts` — the three intro VN scenes (`## scene` —
  fixed order soan/dream/genemon; options carry `say:`/`stat:`/`perk:`).
- `dialogue.md` → `../dialogue.gen.ts` — teach-by-reveal defs (`## dialogue
  <id> · <NAMES-key>`, `### line <id>` with `voice:`/`when:`; an unreferenced
  def must carry `unrouted: <reason>`).
- `cold-open.md` → `../coldOpen.gen.ts` — keyed prose (`## prose cold-open`,
  `### <key>`); `rakeLine` (real logic) stays hand-written.
- All four also compile into the one-page reading script
  [`docs/content/t0-story.md`](../../../../docs/content/t0-story.md).

Ph3 grammar quick-reference (details inline below where shared): `when: <flag>`
gates a dialogue line on a story flag; `when: <npc>.regard is|not <value>` on
per-NPC memory. `@cold-open.<key>` / `@dialogue.<def>/<line>` REUSE a line
(compiled to the same single-source expression, never a copy). `{key}`
interpolates a `NAMES` entry in any text. `say:` overrides an option label as
the MC's spoken line; `stat: +int -str` is the intro's net-zero lean;
`perk: <Name> — <desc>` the granted perk.

## Grammar

A file is a sequence of **scenes**. `<!-- … -->` comments are authorial notes,
ignored by the compiler (they may span lines).

### Scene heading + meta

```markdown
## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level,
  panel-bestiary, panel-house-influence
```

`## rung <registry-key> · <scene-id>`, then a compact `key: value` meta block
(ends at the first blank line). `speaker` is an NPC id; `voice` the scene's
fallback voice; `motivates` the unlock ids this beat narrates (comma list;
continuation lines indent two spaces).

### Prose

- `> …` — a narrator / stage-direction line (no speaker). Consecutive `>` lines
  are one paragraph.
- `Kihei: "…"` — a speech line. The speaker is a display name resolved through
  the `NPC_NAME` reverse map; its voice defaults to `NPC_VOICE[npc]`. A non-NPC
  (ambient) speaker or a voice override is explicit: `Tokubei (villager): "…"`
  (resolved through `NAMES`). The quotes are part of the line, verbatim.

Hard-wrap prose at ~80 chars; continuation lines are flush-left (speech) or
`> `-prefixed (narrator) and rejoin with a single space — a wrap can only occur
at an existing space, so CJK runs are unbreakable by construction.

### Topics (the ask-hub)

```markdown
### ask kihei-who · "Who are you, drillmaster?"
after: kihei-why-blade
```

`### ask <id> · <label>` (label verbatim, quotes included — it is also the MC's
spoken question). The optional `after: <topic-id>` compiles to the
`asked.has(<id>)` gate. Answer lines follow as prose.

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

`### decide · <prompt>`, then `#### <option-id> · <label>` per option. The
label doubles as the MC's `say` line (a `say:` annotation overrides where they
differ — the intro). The option's one speech paragraph is the `react` — and
**naming a different speaker is how a two-voice react is written** (R4: Tōzō
answers a decision Genemon owns → `reactNpc`).

Effect annotations, one per line, order-free, after the react:

| annotation | example | compiles to |
|---|---|---|
| `memory:` | `kihei +1 (disciplined)` · `genemon +0, tozo +1 (friend)` | `memory: [{npc, warmthDelta, regard?}]` |
| `flags:` | `r4-generous, smith-whetstone` | `flags: […]` |
| `bonus:` | `+1 agi — "…delight line…"` | `statBonus` (the rare BQ2 stat nudge) |
| `stance:` | `chudan` | `setStance` (R5 only) |

Annotation continuation lines indent two spaces.

## What stays hand-written TS

All interfaces and engine types; the reducers/intents; every selector/helper
(`rungBeatFor`, `nextDialogueLines`, `rakeLine`, …); the mechanical registries
(`ranks`, `surfaces`, `balance`, …). A future beat that needs real logic uses
the **native escape hatch** (plan §8.1): declare the scene `native:` and keep
its data in a `*.native.ts` sidecar — never grow this grammar toward code.

## Liberties vs the F5 plan (documented per the "mostly locked" human call)

- **oxfmt, not prettier** — the plan predates the repo's formatter; generated
  output is piped through oxfmt so it passes the `oxfmt --check` gate untouched.
- **Heading lines are exempt from the ~80 wrap** (a heading can't continue onto
  a second line; same class of exception as tables/URLs).

## Machinery

- Compiler: `src/scripts/narrative/parse.ts` (md → AST, per-node file:line) +
  `emit.ts` (AST → TS source) + `src/scripts/gen-narrative.ts` (the CLI:
  bare = write, `--check` = byte-compare; mirrors `gen-docs.ts`).
- Errors always cite the **authoring** file:line, never the generated file.
- A hand edit to a `*.gen.ts` is drift by definition — the gate goes RED with a
  message naming the `.md` to edit instead.

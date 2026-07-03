# Narrative authoring format — story as text, registries generated

**Status:** 📋 PROPOSED — awaiting human read.

## Who builds this — Fable or Opus?

**Confidence: ( 60% Fable, 40% Opus )**

**Split.** **Ph1 is Fable** — the format design is a taste call before it
is a tooling call: how the story reads on the page (what is prose, what
is scaffolding, where an annotation may interrupt a scene) decides
whether the reading payoff is real, and the worked example below is a
*proposal* for that taste, not a settled spec. The Ph1 equivalence-proof
design also wants judgment (what "behavior-identical" means for data
that carries closures). **Ph2–Ph4 are Opus** — once the format sample is
locked (ideally after your read of the Ph1 `rung-beats.md` file itself),
the compiler, the validation roster, and the intro/dialogue back-port
are deterministic tooling against explicit DoDs, the same class as
`gen-docs`/`prd-drift` work already routed to Opus. The 60/40 tilt:
Ph1 is the critical path, and a format that reads wrong kills half the
plan's value — when in doubt, Fable.

## Context

All T0 story content is hand-written TypeScript object literals in
`src/core/content/`:

- **`rungBeats.ts`** (655 lines) — the D-110 rung-up beats, R1→R7. Shape:
  `RungScene { id, rank, voice, speaker?, greeting[], topics[],
  decision{prompt, options[]}, motivates[] }`; options carry `say`,
  `react`, `reactNpc?` (two-voice R4), `memory[]` (npc + warmthDelta +
  regard?), `flags[]`, the three rare BQ2 bonuses (`statBonus` on R3,
  flag-bonuses on R2/R4), `setStance` on R5. Topic gates are uniformly
  `(asked) => asked.has('<topic-id>')`.
- **`intro.ts`** (430 lines) — `DIALOGUE_SCENES` (soan/dream/genemon):
  same scene shape, but options carry the net-zero `stat {up,down}`,
  a `perk {name, desc}` (F56), and single-NPC `memory`. The Genemon
  greeting is *reused* from the dialogue registry via
  `getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-greet')`; Sōan's greeting
  reuses `COLD_OPEN.wake`/`.grounding` — cross-file reuse is part of the
  data contract.
- **`dialogue.ts`** (196 lines) — flat teach-by-reveal lines with
  `gate(flags)` / `memGate(npcMemory)` closures (all of the forms
  `flags.x === true`, `m.npc?.regard === 'v'`, `!== 'v'`), display-name
  speakers, `{NAMES.x}` interpolation in prose.
- **`coldOpen.ts`** (32 lines) — keyed prose constants + one real
  function (`rakeLine`) that stays code.

Roughly 85% of these files *is prose* — but today, reading the T0 story
front-to-back means reading TS literals, and authoring a beat means
writing them. Both directions invert with an authoring format:
**(a)** new story is written as text; **(b)** the existing story becomes
readable as clean prose — including for the open **R8** review, which
currently points the human at a plan appendix and `__qa.toRung()`.

The house already has the exact machinery pattern: `gen-docs.ts`
generates `docs/content/*.md` from the registries with a byte-compare
`--check` in the verify roster (12 parallel gates, soft 5 s budget).
This plan mirrors it **inverted**: the text file is the source of truth
and the TS is generated.

## 1 · The format — structured markdown, prose-first

**Decision: structured markdown, not YAML.** The story is full of
double quotes, apostrophes, em-dashes, and CJK; in YAML every line of
dialogue needs quoting or block-scalar scaffolding, and the file reads
as config wrapping prose. In markdown the prose IS the visible thing
(woodblock rule: constraint reads handmade): narrator beats are
blockquotes, speech is `Name: "…"`, scenes are headings, and the file
renders as a readable script in any markdown preview. `*.md` is already
prettier-ignored, so wrapping at ~80 chars is free and CJK-safe. Diffs
read as prose edits.

**Grammar (the whole of it):**

- `## rung R3 · rung-r3` — scene heading (registry key · scene id),
  followed by a compact `key: value` meta block (`speaker:`, `voice:`,
  `motivates:` — continuation lines indent two spaces).
- `> …` — narrator / stage direction (`voice: 'narrator'`, no speaker).
- `Kihei: "…"` — a speech line. Speaker resolves via the `NPC_NAME`
  reverse map; voice defaults to `NPC_VOICE[npc]`. A non-NPC speaker or
  a voice override is explicit: `Tokubei (villager): "…"` (resolved
  through `NAMES`). Hard-wrapped continuation lines rejoin with a
  single space.
- `### ask kihei-who · "Who are you, drillmaster?"` — a topic (id ·
  label verbatim, quotes included); an optional `after: kihei-why-blade`
  line compiles to the `asked.has(…)` gate.
- `### decide · How do you take up the blade?` — the decision prompt.
- `#### r3-disciplined · "Teach me to stand a watch."` — an option
  (id · label). The label doubles as `say` (true for every rung beat);
  a `say:` line overrides where they differ (the intro). The option's
  speech line is the `react` — and *naming a different speaker* is how
  a two-voice react (`reactNpc`, R4) is written.
- Effect annotations, one per line, order-free:
  `memory: kihei +1 (disciplined)` · `flags: r3-disciplined` ·
  `bonus: +1 agi — "…delight line…"` · `stance: chudan` ·
  `stat: +int −str` · `perk: Sōan's Counsel — A mind honed sharper…`.
- `@cold-open.wake` / `@dialogue.genemon-open/gen-greet` — a line whose
  text is a *reference* (compiles to the same single-source reuse the
  hand-written file does today). `{elder}`, `{house}`… interpolate
  `NAMES` keys.

**Worked example — the actual R3 beat, round-trip faithful**
(from `rungBeats.ts` lines 231–330):

```markdown
## rung R3 · rung-r3
speaker: kihei
voice: arms
motivates: tab-combat, panel-drill-yard, readout-combat-level,
  panel-bestiary, panel-house-influence

> The drill yard behind the omoya, first light. You've stood over the
> grain-store wolf's carcass; word travels. A hard-faced man is already
> there, a bokken in each hand — and he throws you one without a word
> of greeting.

Kihei: "So. You put down the thing that had the run of our stores.
Farmers don't do that. There's a soldier in you under the farmhand —
I've watched it a week and I'm done pretending I haven't."

Kihei: "You're gate-watch now: a weapon, a yard to train in, and the
estate's defence on your shoulders — pests, beasts, and the masterless
men who drift down the woodlot road. Keep a field-guide of what you
face; a soldier who knows his enemy outlives one who doesn't."

### ask kihei-why-blade · "Why set me to the blade?"

Kihei: "The house has walls and no one to stand on them. A great name
with an empty granary draws wolves of both kinds. I'd sooner the man
holding the gate be one who chose to."

### ask kihei-road · "What's out on the woodlot road?"

Kihei: "Boar and wolf in season. And men — ronin, deserters, the
leavings of every lord's quarrel — who'll take rice off a house too
weak to keep it. That last is why you're really here."

### ask kihei-who · "Who are you, drillmaster?"
after: kihei-why-blade

Kihei: "A man who soldiered for a house that no longer exists. Genemon
kept the granary; I kept the walls. Ask me the rest when you've bled
for the place."

### decide · How do you take up the blade?

#### r3-aggressive · "Show me how to end a fight fast."

Kihei: "Fast, he says. Fast gets you a spear in the back. But there's
fire in it — we'll aim it before it burns you."

memory: kihei −1 (eager)
flags: r3-aggressive

#### r3-disciplined · "Teach me to stand a watch."

Kihei: "...Good answer. A wall that holds is worth ten swords that
swing wild. Come at dawn — before the others."

memory: kihei +1 (disciplined)
flags: r3-disciplined
bonus: +1 agi — "Kihei drills you an extra dawn; your feet learn the
  watch. (+1 AGI)"

#### r3-duty-not-glory · "I'd rather the paddies — but the house needs it."

Kihei: "Honest. I trust a man who'd rather not more than one who's
hungry for it. The house is lucky in you."

memory: kihei +1 (reluctant)
flags: r3-duty-not-glory
```

A non-coder can read that top-to-bottom as a scene. The two-voice R4
react needs no new syntax — the react speaker just changes:

```markdown
#### r4-generous · "Spend it on the house's needs — a mended kura feeds everyone."

Tōzō: "Hah — the lad'd sooner fix the roof than count the rice. Here:
a whetstone that's outlived three wardens. Keep your edge keen and
it'll keep you."

memory: genemon +0, tozo +1 (friend)
flags: r4-generous, smith-whetstone
```

**Authoring home:** `src/core/content/narrative/` — `rung-beats.md`,
`intro.md`, `dialogue.md`, `cold-open.md`, plus `README.md` (the format
spec). Content stays under `src/core/content/`; the files are *source*,
not docs (docs get the Ph4 reading copy).

## 2 · The compiler — `gen-narrative.ts`, generated `.ts`

**Decision: emit generated TypeScript, not JSON + loader.** Generated
`.ts` keeps literal types (`Partial<Record<RankId, RungScene>>` — an
invalid rank key or attr id is *also* a tsc error, a free second net),
costs nothing at runtime, needs no async loading in the pure core, and
— decisively — can carry the gate **closures** and the cross-file
**reuse imports** (`getDialogueLine`, `COLD_OPEN`, `NPC_NAME.kihei`,
`NAMES.pedlar`) that JSON cannot.

- `src/scripts/narrative/` — `parse.ts` (md → AST with per-node
  file:line), `validate.ts`, `emit.ts` (AST → TS source, formatted via
  the prettier API so the output is byte-stable and passes the prettier
  gate). `src/scripts/gen-narrative.ts` is the thin CLI, mirroring
  `gen-docs.ts`: bare = write, `--check` = regenerate into a buffer and
  byte-compare (a hand-edit to a generated file is drift by
  definition — the error names the `.md` to edit instead).
- Generated files: `rungBeats.gen.ts`, `intro.gen.ts`,
  `dialogue.gen.ts`, `coldOpen.gen.ts` — **data only**, each opening
  with a `// GENERATED by npm run gen:narrative from
  src/core/content/narrative/<file>.md — DO NOT EDIT` header. The
  existing modules keep their names, types, and helpers, and re-export
  the data (`export { RUNG_BEATS } from './rungBeats.gen'`) — **zero
  import churn** anywhere (consumers all go through the module or
  `core/index.ts`).
- npm: `gen:narrative`; verify: a `gen-narrative` entry in
  `verify-run.ts` `GATES` (`--check`). It is string work + one prettier
  format — expected well under the 5 s parallel budget; Ph2 measures it
  with `verify:budget` before the gate is kept.

## 3 · Validation — the gate's teeth

All validations run in `validate.ts` before emit; every error is
reported against the **authoring** file:
`src/core/content/narrative/rung-beats.md:41 — unknown speaker "Kihie"
(known: Sōan, Genemon, Kihei, …)`. Each is RED-able by a unit test with
an inline fixture (test-discipline: fixtures from the source of truth).

1. Every speaker resolves — an `NPC_NAME` reverse hit, or a `NAMES`
   value with an explicit `(voice)`.
2. Every voice is a real `VoiceCategory` — add a runtime
   `VOICE_CATEGORIES` array to `voices.ts` (checked against the union
   with `satisfies`), the one hand-written enabling change.
3. Topic ids and option ids globally unique (today asserted piecemeal
   in `intro.test.ts` — becomes a compile error).
4. `after:` targets resolve to a topic in the same scene, non-self,
   non-cyclic.
5. `memory:` NPCs ∈ `NPC_IDS`; |warmth Δ| ≤ 3.
6. `bonus:` attr ∈ `ATTR_IDS`; `stance:` ∈ `STANCE_ORDER`; intro
   `stat:` up/down ∈ `ATTR_IDS` and distinct (the net-zero invariant).
7. `motivates:` ⊆ `SURFACE_IDS` **and** verbatim-equal to
   `RANKS[target].rewardOnReach.unlock` (the beat↔unlock coherence
   check `rungBeats.ts` line 62 asks for and nothing enforces today).
8. Rung keys ⊆ `RankId`, no R0 beat; intro scene order fixed.
9. Perk shape rules (name/desc non-empty, no `(`, no `±1` — lifted from
   `intro.test.ts`).
10. No orphan defs / dead-end trees: every scene has a decision with
    ≥ 1 option and every option a react; a dialogue def must be routed
    or carry an explicit `unrouted: awaiting-routing` marker (the
    `kihei-intro`/`soan-intro` stubs are kept-on-purpose today).
11. `@reuse` targets and `{name}` interpolations resolve.
12. **WARN** (not error): a speech line whose voice ≠
    `NPC_VOICE[speaker]` — R7 trips this today (`'official'` lines vs
    the resolved `'lord'` voice), see Risks #3.

The compiler imports only the hand-written leaf registries (`voices`,
`names`, `ranks`, `surfaces`, `balance`) for validation — no
chicken-and-egg with the generated modules.

## 4 · Migration — behavior-identical, rung beats first

The shipped T0 content must not churn. **Back-port `rungBeats.ts`
first**: smallest regular shape, exercises nearly every feature (topics,
gates, two-voice, all three BQ2 bonuses, stance), and its prose is the
R8 review subject — moving it into a readable file *helps* that review.

The equivalence proof (the R3 DoD, and the heart of the plan):

1. Write `narrative/rung-beats.md` transcribing `RUNG_BEATS` verbatim.
2. Generate `rungBeats.gen.ts` **alongside** the untouched hand-written
   registry.
3. A temporary `narrative-equivalence.test.ts` proves
   `RUNG_BEATS_GEN` ≡ `RUNG_BEATS`: deep-equal over all serializable
   fields, plus **behavioral** equality for gates (evaluate both
   closures over the empty set and every singleton topic-id set — the
   complete domain of the `asked.has()` form). Byte-identical module
   output is *not* the bar: the hand file uses `narr()`/`says()`
   helpers and comments the emitter should not imitate; deep-equal +
   gate-behavior is the honest proof.
4. Could-go-RED proof: mutate one word in the `.md`, watch the test go
   RED, revert (R3 — a check that cannot fail counts for nothing).
5. Flip: `rungBeats.ts` drops its inline literal and re-exports from
   `rungBeats.gen.ts`. The temporary test retires *at the flip* (it
   would compare a re-export to itself); the standing seal is the
   untouched `rung-beats.test.ts` D-110 e2e suite staying green over
   the generated data.

Intro/dialogue/cold-open follow the same discipline in Ph3 (their extra
features — `stat:`/`perk:`, `@reuse`, `{name}`, `when:` gates over
flags/memory — land then, each with the same deep-equal + behavioral
gate proof; `dialogue`'s gate domain is the flag/regard values named in
the conditions).

**Stays hand-written TS forever:** all interfaces and engine types; the
reducers/intents; every selector and helper (`rungBeatFor`,
`nextDialogueLines`, `introPerkLine`, `rakeLine`, …); the mechanical
registries (`ranks`, `surfaces`, `balance`, …) already covered by
gen-docs; `people.ts` (presence predicates are real logic — its
greeting strings are a *candidate* later target, as are `quests.ts`
blurbs and `map.ts` node blurbs, noted and deliberately out of v1
scope).

## 5 · The reading payoff — `docs/content/t0-story.md`

The authoring files ARE the readable story; Ph4 adds the one-page
compiled script for free (the AST already exists): cold open → intro
scenes → R1…R7 beats in play order, rank titles pulled from `RANKS`,
choices rendered inline with their effect annotations as small print.
Written by `gen-narrative`, joining the same `--check`. This also
becomes the R8 "how to look" pointer — one readable page instead of a
plan appendix + `__qa.toRung()`.

## 6 · Relationship to R8 (the open prose review)

**Default: migrate the structure now; do not wait for R8.** The
equivalence proof guarantees the shipped prose does not change by a
byte, so the migration cannot race the review's *subject* — and after
it, R8's edits land as prose edits in `rung-beats.md` (a strictly
better editing surface for a taste pass; the human can even mark up the
file directly). Update the R8 entry's "how to look" in
`project/human-in-the-loop/review.md` in the Ph4 commit. If the human
reads R8 mid-build and wants prose changes, they land in whichever file
is source-of-truth at that moment — the drift gate makes the answer
unambiguous either way.

## 7 · Phases + DoDs (each committable, verify green)

- **Ph1 — format spec + compiler core + rung-beats back-port.** The
  `narrative/README.md` format spec; `rung-beats.md`; parser + emitter
  (+ prettier-API formatting); `gen:narrative` script; the equivalence
  test. *DoD (R3):* deep-equal + gate-behavior proof green; the
  one-word-mutation could-go-RED proof performed and reverted; flip
  landed with `rung-beats.test.ts` and the full verify green; the
  generated file passes tsc/eslint/prettier untouched.
- **Ph2 — validations + the verify gate.** The §3 roster in
  `validate.ts`, each with a RED unit test; `VOICE_CATEGORIES` in
  `voices.ts`; `--check` joins `verify-run.ts` GATES. *DoD:* every
  validation demonstrably RED-able against a fixture; errors cite
  authoring file:line; hand-editing `rungBeats.gen.ts` turns the gate
  RED with a message naming the `.md`; `verify:budget` median still
  under 5 s.
- **Ph3 — intro + dialogue + cold-open back-port.** `intro.md`,
  `dialogue.md`, `cold-open.md` + the Ph3 grammar (`stat:`, `perk:`,
  `say:`, `@reuse`, `{name}`, `when:` gates); same per-module
  equivalence proof, then flip. *DoD:* `intro.test.ts`,
  `dialogue.test.ts`, `coldOpen.test.ts` pass **unchanged** over the
  generated data; the intro's cross-file reuse still single-source
  (emitted as `getDialogueLine(…)`/`COLD_OPEN.…`, not copied text).
- **Ph4 — the reading doc + retire hand-editing.** `t0-story.md`
  generation + `--check`; GENERATED headers verified on all `.gen.ts`;
  R8 pointer updated; a `narrative/` pointer added to the AGENTS.md
  content conventions + `repo-map.md`. *DoD:* `t0-story.md` regenerates
  byte-stable; deleting it or editing it by hand goes RED; the R8
  review entry points at the readable script.

## 8 · Risks + open questions (defaults — bias to motion)

1. **Format expressiveness ceiling** — a future beat needs real logic
   (a computed gate, a conditional react). *Default:* the **native
   escape hatch** — a scene may be declared `native: <exportName>` in
   the authoring file; its data stays hand-written TS in a
   `*.native.ts` sidecar the generated module imports and merges. The
   `.md` keeps a stub (id + one-line synopsis) so the story doc still
   reads whole, and the drift gate stays byte-exact. Any push to grow
   the gate grammar beyond `after:`/`when:` equality forms routes here
   instead.
2. **R8 race** — see §6. *Default:* migrate now, prose byte-preserved,
   pointer updated; the review gets easier, not raced.
3. **The R7 voice finding** — Shigemasa's greeting/topic lines carry
   `'official'` while `NPC_VOICE.shigemasa` is `'lord'` (voices.ts says
   the 'lord' voice is RESOLVED). *Default:* preserve bytes in the
   migration (the proof demands it), emit the §3 WARN, and surface the
   one-line question to the human alongside R8 — never silently
   "fix" prose-adjacent data mid-migration.
4. **Wrap/rejoin fidelity** — hard-wrapped prose rejoins with single
   spaces; a wrap can only occur at an existing space, so CJK runs are
   unbreakable by construction. *Default:* the deep-equal proof catches
   any mismatch, plus an emit→parse→emit idempotence property test.
5. **Verify budget** — a 13th gate. *Default:* measured in Ph2; it is
   ms-class string work in a parallel roster whose floor is vitest; if
   it somehow isn't, fold it into the `gen-docs` gate's process.
6. **Who may edit the `.md`?** Anyone — that is the point; the human
   editing story prose directly is now safe (validations + drift gate +
   the untouched behavior tests). Prose *typos* are no more caught than
   they are today; the story doc just makes them easier to see.
7. **YAML instead?** Rejected: quoting/escaping scaffolding overwhelms
   prose that is mostly quotation marks and em-dashes, and the file
   stops being readable as a script — which kills value (b), half the
   reason this plan exists.

---

## Critical files for implementation

- `src/core/content/rungBeats.ts` — the first back-port target (+ its
  R7 voice finding, Risks #3)
- `src/core/content/intro.ts` — Ph3 (stat/perk/reuse grammar)
- `src/scripts/gen-docs.ts` — the write/`--check` idiom to mirror
  (inverted: text is source, TS is generated)
- `src/scripts/verify-run.ts` — the gate roster the `--check` joins
- `src/core/content/voices.ts` — gains the runtime `VOICE_CATEGORIES`
  array (the one hand-written enabling change)

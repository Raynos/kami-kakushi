---
name: kami-narrative-grammar
description: >
  The .md→gen narrative authoring SYNTAX reference for kami-kakushi
  (FB-5 pipeline). Load whenever you: edit or add anything under
  src/core/content/narrative/ (rung-beats, intro, dialogue, cold-open,
  flavor, requirements, scenes, asks, takes/); see the gen-narrative
  gate go RED ("out of date (or hand-edited)"); hit a NarrativeError
  ("prose-only gate", "needs a <!--#slug--> id marker", "duplicate ask
  id", "motivates must be verbatim-equal"); need the block-header
  grammar (## rung / ## scene-def / ## dialogue / ## ask / ## prose /
  ## requirements), the effect annotations
  (memory:/flags:/bonus:/stance:/stat:/perk:), the when:/after: gates,
  or the @-reuse and {key} interpolation forms; author a takes bundle
  or wire a new text emitter into the story overlay (contentKey,
  LIVE_UNITS); wonder whether you may rename a <!--#slug--> line id
  (NO — save-facing); or ask "where do I edit story text" / "why
  didn't my .gen.ts change stick". Syntax only — the ADR-139 diverge
  PROCESS lives in the narrative-diverge skill.
---

# kami-narrative-grammar

All fiction-voiced T0 text is authored as markdown under
`src/core/content/narrative/` and COMPILED into `*.gen.ts` registries.
The authoritative spec is that directory's
[`README.md`](../../../src/core/content/narrative/README.md) — read it
alongside this skill; this skill adds the compiler-verified detail,
the traps, and the fences the README doesn't carry.

Process routing first (non-negotiable): **any NEW fiction-voiced text
or feedback-driven story improvement ships from 3+ takes (ADR-139)** —
that procedure is the `narrative-diverge` skill. This skill is the
syntax reference you use INSIDE that process (and for mechanical
edits, which are exempt: typo, name sync, id plumbing).

## 1. Pipeline map

Sources → targets (the TARGETS table,
`src/scripts/gen-narrative.ts:50-89`):

| authored source (edit HERE) | generated (NEVER edit) |
| --- | --- |
| `narrative/rung-beats.md` | `content/rungBeats.gen.ts` |
| `narrative/intro.md` | `content/intro.gen.ts` |
| `narrative/dialogue.md` | `content/dialogue.gen.ts` |
| `narrative/cold-open.md` | `content/coldOpen.gen.ts` |
| `narrative/flavor.md` | `content/flavor.gen.ts` |
| `narrative/requirements.md` | `content/requirements.gen.ts` |
| `narrative/scenes.md` | `content/scenes.gen.ts` |
| `narrative/asks.md` | `content/asks.gen.ts` |
| `narrative/takes/<bundle>/` | `src/ui/storyTakes.gen.ts` |
| all of the above | `docs/content/t0-story.md` (reading script) |

- Compiler: `src/scripts/narrative/parse.ts` (md→AST, every node
  carries its authoring file:line) + `emit.ts` + `validate.ts`
  (whole-set checks) + `takes.ts` + `story-doc.ts`. Commands
  (`package.json:27-28`):

```bash
pnpm run gen:narrative        # write all targets
pnpm run gen:narrative:check  # byte-compare (what the gate runs)
```

- The `gen-narrative` verify gate (`src/scripts/gates.ts:46-47`) runs
  `--check` at commit, push, and CI; its RED message names the `.md`
  to edit. All sources parse FIRST, validate AS A SET (cross-file
  reuse, global id uniqueness), then each emits; emitted TS is piped
  through `oxfmt` so on-disk bytes pass the formatter gate untouched
  (`gen-narrative.ts:92-106`).
- Every `.gen.ts` is DATA ONLY, re-exported by a hand-written sibling
  that keeps types + real logic: `rungBeats.ts`, `intro.ts`,
  `dialogue.ts`, `coldOpen.ts` (keeps `rakeLine`), `flavor.ts`,
  `requirements.ts`, `scenes.ts` (keeps `sceneById`), `asks.ts`,
  `src/ui/storyTakes.ts`.
- Speakers emit as REFERENCES (`NPC_NAME.kihei`, `NAMES.pedlar`),
  `{key}` → `${NAMES.key}` template parts — a rename in `names.ts`
  propagates; never a string copy.
- Regen loop: edit `.md` → `pnpm run gen:narrative` → commit source +
  every regenerated target TOGETHER.

## 2. Shared grammar (compiler = ground truth)

Block/line regexes, verbatim from
`src/scripts/narrative/parse.ts:363-382`:

```
## rung <registry-key> · <scene-id>       rung-beats.md
## requirements R<0-7>                    requirements.md
## scene <id>                             intro.md
## scene-def <id>                         scenes.md
## dialogue <id> · <NAMES-key>            dialogue.md
## ask <id> · <npc>                       asks.md (FB-415)
## prose <id>                             cold-open.md / flavor.md
### ask <id> · <label>                    a topic (label verbatim, incl. quotes)
### decide · <prompt>                     the decision (max one per scene)
### line <id>                             a dialogue line
### req <id> · <spec>                     a requirement
### <key>                                 a prose entry
#### <option-id> · <label>                a decision option
<key>: <value>                            annotation (key must be RESERVED)
Name: "…"  /  Name (voice): "…"           speech (starts uppercase)
You: "…"                                  MC speech (FB-198)
> …                                       narrator line
@cold-open.<key> / @dialogue.<def>/<line> reuse ref (bare line = narrator)
<!--#slug-->                              line id  /^<!--#([a-z0-9][a-z0-9-]*)-->$/
```

Rules that bite:

- **The `·` separator is U+00B7 MIDDLE DOT with spaces**, not a
  hyphen — the regexes match it literally. A hyphen makes the heading
  silently not-a-heading.
- Meta block: `key: value` lines directly under the `##` heading; ends
  at the first blank line. Continuations (of any annotation or meta
  value) **indent two spaces**; flush-left text continues an open
  prose paragraph.
- Consecutive `>` lines are ONE narrator paragraph.
- `You: "…"` emits `voice: 'player'` with NO static name — the G4.7
  speaker ladder (You → Nameless → Gonbei) resolves the nameplate at
  display time. Never takes `(voice)`; a rung-beat react can't be one.
- Reserved annotation keys (never parsed as speech; `parse.ts:336-361`):
  speaker voice title motivates trigger once after when say memory
  flags bonus stance stat perk unrouted flavor objective drive, plus
  the FB-415 ask keys rungs refresh native label.
- Ambient (non-NPC) speakers need explicit `(voice)`:
  `Yohei (villager): "…"` — resolved through `NAMES`.
- HTML comments are authorial notes, skipped (may span lines); ONLY
  `<!--#slug-->` is meaningful.
- `{key}` interpolation: `{[a-zA-Z]+}` only (no dashes/digits);
  validate errors on an unknown `NAMES` key.
- **Wrap law:** hard-wrap prose at ~72 chars; continuations rejoin
  with a single space (CJK runs unbreakable by construction; heading
  lines exempt). Trap: a continuation line that at column 0 would
  re-parse as a marker (`>`/`#`/`<!--`/reserved `key:`/speech shape)
  is RECLASSIFIED — `looksLikeMarker` (`parse.ts:521-527`) defines
  exactly that set; re-break the line so no continuation starts that
  way.

Effect annotations on decision options, order-free after the react:

| annotation | example | compiles to |
| --- | --- | --- |
| `memory:` | `kihei +1 (disciplined)` · `genemon +0, kihei +1 (friend)` | `[{npc, warmthDelta, regard?}]` |
| `flags:` | `r4-generous, r4-drills-begun` | `flags: […]` |
| `bonus:` | `+1 agi — "…note…"` | `statBonus` (em-dash literal) |
| `stance:` | `chudan` | `setStance` (R5 convention) |
| `stat:` | `+int -spd` | intro only — the net-zero lean |
| `perk:` | `The Inward Turn — A mind that…` | intro only (em-dash) |
| `say:` | `say: "The knot. Tied twice."` | overrides the label as the MC line |

- Exactly one `### decide` per rung/intro scene; topics may not follow
  it; every option needs exactly one react paragraph (a SPEECH line by
  an NPC — naming a speaker other than the scene `speaker` is HOW a
  two-voice react is authored, compiling `reactNpc`).
- Topic + option ids are **globally unique across the whole doc set**
  (`validate.ts:202-204`) — the reason R5's beat cannot also exist in
  rung-beats.md (see §4). `after: <topic-id>` gates are in-scene only,
  cycle-checked, and compile to `asked.has('<id>')`.

## 3. The line-id law — `<!--#slug-->` is save-facing

A scene's **greeting** lines and a topic's **answer** lines are the
two prose classes the save's log addresses by name; each carries an
authored id as an HTML-comment marker on the line ABOVE the block.
Enforcement: a greeting/answer line with no id THROWS at emit
(`emit.ts:135-142`, "a greeting / answer line needs a `<!--#slug-->`
id marker"); a marker with no prose line under it fails loud in parse.
Everything else (option say/react, dialogue lines, prose entries) is
addressed by its OWN heading id and takes no marker.

- **Never renumber, never reuse.** An id is a line's permanent name.
  Rename only when the line becomes a genuinely different line — an
  old save then falls back to the prose it stored instead of silently
  landing on a NEIGHBOUR.
- **Reorder freely; REWORD keeps the id** and reaches every save that
  ever logged it — the whole point.
- The incident: before ids, these lines were addressed by INDEX
  (`beat.R3.greeting.2`); reordering re-pointed old saves at the
  neighbour line and the orphan sensor couldn't see it (ADR-186's
  "known limit", closed 2026-07-13). The v11→v12 migration rewrites
  index descriptors to authored ids (`src/persistence/migrate.ts:48-50,
  98-124`). Save-side detail: the `kami-save-and-schema` skill.
- Bulk-fill a NEW story file:
  `pnpm exec tsx src/scripts/narrative-add-line-ids.ts [--check]` —
  idempotent, derives slugs from opening words; read the diff, a
  hand-picked name is better.

## 4. Per-file reference (one verified example each)

**rung-beats.md** — the promotion beats. Real header (lines 22-27):

```markdown
## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: room-paddies, verb-farm, verb-haul, readout-clock, readout-stamina,
  panel-rung-ladder
```

Traps: `voice:` and `motivates:` required; `motivates` must be
VERBATIM-equal to `RANKS.<rung>.rewardOnReach.unlock`
(`validate.ts:445-460`). R0 takes no beat — "the intro IS the R0 beat
(D-110)" (`validate.ts:442`). The file holds R1·R3·R4·R6·R7 only:
R2 plays as the `r2-yard-hand` scene-def and R5 as the `count` /
`count-resolve` scene-def chain in scenes.md (a rung beat can't split
around a mid-scene decision; duplicating their option ids here REDs
the global-unique check).

**intro.md** — three `## scene` blocks, fixed order
`dream → soan → genemon` (`INTRO_SCENE_ORDER`, `validate.ts:56`; HD-37
2026-07-10). ⚠ STALE DOC: `narrative/README.md:17` still says
"soan/dream/genemon" — the validator and intro.md on disk
(dream:37 · soan:79 · genemon:225) are authoritative. Intro-only meta
`title:` (FB-362 act-card label) is required and must be distinct per
scene. Every option requires `stat:` (up ≠ down, the net-zero
invariant, `validate.ts:477-496`) and `perk:` (no `(` or `±1` in the
text — mechanics are appended by code). Real option (lines 46-55):

```markdown
#### dream-dwell · Hold the knot
say: "The knot. Tied twice. Why twice."

> You turn it for as long as the water allows. …

stat: +int -spd
perk: The Inward Turn — A mind that deepens by dwelling, at the price of a
  slower body.
```

**dialogue.md** — teach-by-reveal defs:
`## dialogue genemon-open · elder` then `### line <id>` blocks with
optional `voice:` and `when:` (`when: <flag>` → flag gate;
`when: <npc>.regard is|not <value>` → memory gate). Traps: one
paragraph per line; a def neither `@dialogue.`-referenced nor marked
`unrouted: <reason>` is an ERROR ("dead content must be kept on
purpose or deleted"); `### line` blocks take no `<!--#slug-->`.

**cold-open.md / flavor.md** — keyed prose:
`## prose cold-open` / `## prose flavor`, then `### <key>` entries,
one paragraph each. `@cold-open.<key>` reuse only matches
`[a-zA-Z]+` keys — a dashed key cannot be @-referenced. Flavor is the
fiction-voiced UI micro-copy shown OUTSIDE VN scenes (lock-hints, gate
explainers); live-switchable via the DEV Story switcher.

**requirements.md** — the hidden rung lists (FB-121/ADR-137). Real
req:

```markdown
### req rake-the-first-rows · count act:rake_rice 10

flavor: "So he can work," {elder} says, in the way another man says good morning.
objective: The spill by the granary door lies raked into heaps.
drive: rake_rice
```

The spec grammar is CLOSED: `count <verb:subject> <N>` · `flag <id>` ·
`state resource|banked <res> >= <N>` · `state belonging <id>` ·
`state skill <id> >= <N>` · `native <key>` (resolves in
`NATIVE_PREDICATES`, `src/core/requirements-engine.ts:69-74` — real
logic never grows the grammar). All of `flavor:` / `objective:`
(HD-41) / `drive:` are required (`parse.ts:1196-1205`). The set must
cover exactly R0–R7 with ≥3 reqs each (`MIN_REQS_PER_RUNG`,
`validate.ts:38`, human 2026-07-07). ⚠ gen does NOT registry-check
`count`/`flag`/`drive` tokens (stated in the file's header comment,
requirements.md:30-36) — a typo'd token compiles green; test in-game.
Note for orientation: rung progression IS these authored lists — the
old `rungThreshold` points meter is retired (correction owner:
kami-domain-reference §1).

**scenes.md** — generalized VN scenes: `## scene-def <id>` with meta
`trigger:` (required — `rung R<n>` / `season-exit <season>` /
`flag <id>` / `verb` / `scripted`), optional `once:`, required
`voice:`, optional `speaker:`/`motivates:`. Body = the rung-scene
grammar with an OPTIONAL decide; omitting it authors the ADR-165
narration-only beat (the emitter synthesizes an empty decision).
Legal meta keys are exactly `trigger/once/voice/speaker/motivates`
(`parse.ts:628-639`).

**asks.md** — the everyday-ask registry (FB-415), LANDED 2026-07-18
(commit 353fdacf, talk-plan step 2). Real block:

```markdown
## ask genemon-house-standing · genemon
rungs: R0+
refresh: rung
label: “How do I stand with the house?”

<!--#the-book-says-->
Genemon: “The book says what it says. …”
```

Meta: `rungs:` window (`R0+` open-top / `R0–R3` / `R2`;
`parseRungWindow`, `parse.ts:441-468`), required `label:` (the MC's
spoken question, quotes verbatim), optional `when:` (same WhenGate as
dialogue), `refresh:` from the CLOSED `content/ask-refresh.ts`
vocabulary (currently rung · season · works · health — read the file,
it may grow), `native:` from `content/ask-natives.ts`. `native:` and
prose lines are mutually exclusive, and one is required
(`parse.ts:1172-1186`); emit validates `refresh:`/`native:` keys
against those modules (`emit.ts:453-464`). Ask ids are save keys
(`asksHeard`) and future overlay addresses `ask.<id>.<line-id>` —
globally unique, line slugs unique per ask (`validate.ts:250-263`).
Answers render INLINE in the talk surface, never any log channel (D4).
This is DISTINCT from the in-scene `### ask` topic sub-heading —
both exist; `## ask` is top-level and person-scoped.

## 5. The takes system (ADR-139 review bundles)

Layout: `narrative/takes/<bundle-id>/bundle.md` + one `take-*.md` per
NOT-picked take (standard FB-5 grammar, same compiler). The picked
take lives only in canon; on sign-off the whole bundle dir is DELETED
and the registry regenerated (`takes/README.md`).

`bundle.md` grammar (parsed by `src/scripts/narrative/takes.ts`; real
example: `takes/yohei-stall/bundle.md`):

```markdown
# bundle <id> · <title>
hr: HR-44                       # REQUIRED: HR-<n> OR "none · <why kept>"
rung: other · <reason>          # REQUIRED: R<n> OR "other · <reason>" (FB-312)
review: project/human-in-the-loop/review.md   # optional
rationale: Take C picked — …    # optional; continuations indent 2 spaces
canon: C · the market road      # optional Canon-pill label

## take a · <label>
brief: <the take's dramatic brief>      # REQUIRED per take
scorecard: 17✔ 2✘ 2— [briefed: …]       # optional Pass-2 verdict
file: take-a.md                          # REQUIRED per take
```

⚠ STALE DOC: the `takes/README.md` bundle example omits `hr:` and
`rung:` — `takes.ts:172-197` REQUIRES both (missing `hr:` errors with
"name the review item it awaits"). A bundle kept after sign-off says
`hr: none · <why>`; `rung: other · <reason>` needs a real reason
(FB-312 banned the catch-all group). The `review-link` gate
(`src/scripts/verify-review-link.ts`) binds `hr: HR-<n>` to
`project/human-in-the-loop/review.md` both directions.

**The prose-only hard gate** (session-200; error prefix
`prose-only gate — <unit>: …`, `takes.ts:275`): takes are
canonicalized against canon at gen time into a flat
`contentKey → text` map + narration-run sequences. REDs on: topic or
option COUNT differing from canon, a `bonus:` note on only one side, a
line/prose key canon lacks, a unit id with no canon counterpart.
Free-length is ONLY the narration runs (greeting + topic answers) —
line count is pacing, part of the take's voice. The law
(`takes/README.md`): **a take varies what the player READS, never what
the game DOES** — ids, `flags:`, `memory:`, `bonus:`/`stance:`
identical; swapping takes must never fork state or the RNG stream.

**Runtime — the ONE overlay (ADR-198):** `storyTakes.gen.ts` is
DEV-only (dead-code-eliminated from prod builds). The DEV switcher's
`syncStoryOverlay()` (`src/ui/dev.ts:135-176`) flattens the effective
takes and calls `__setStoryOverlay(text, seq)`
(`src/core/content/story-overlay.ts:29` — a LEAF module); every
reader asks `storyText(key)` / `storySeq(key)` and falls back to
canon. Prod never sets it.

A NEW text emitter becomes take-switchable by exactly three things
(`takes/README.md`): (1) emit its log entry WITH a `contentKey` — the
keyless gate's static half REDs a durable emit with no key unless
annotated `// keyless-ok: <where the key is attached>` within 3 lines
above (`src/core/content/log-keyless.test.ts:134-139`); (2) its key
prefix in `LIVE_UNITS` (`src/ui/dev/story-reader.ts:335-336` —
currently `rung|intro|intro-title|scene|flavor|req-flavor|
req-objective|dialogue` plus `cold-open:lede|cta`; units outside it
render "(reader-only)"; note `ask:` is NOT yet in it); (3) read
through `storyText`/`storySeq`. Nothing needs per-class wiring.

## 6. Fences — what NOT to do

- **Never edit a `*.gen.ts`** or `docs/content/t0-story.md` — the
  gate REDs and names the `.md` to edit.
- **`t0v2/` is staged and INERT.** Its own README: "staged, NOT
  wired… `gen-narrative` does not read this directory; no verify gate
  touches it." Editing t0v2 has no effect on any build. Most picks
  were already migrated into the live sources. Do not edit takes in
  place after a human review opens (redlines become VERDICT revisions).
- **Real logic never grows the grammar.** The three implemented
  escape hatches are the closed TS maps: requirement
  `native <key>` → `NATIVE_PREDICATES`
  (`requirements-engine.ts:69-74`), ask `native: <key>` →
  `NATIVE_ASK_ANSWERS` (`content/ask-natives.ts`), ask `refresh:` →
  `ASK_REFRESH` (`content/ask-refresh.ts`). A SCENE-level `native:`
  sidecar (narrative README "What stays hand-written TS") is design
  intent only — `native` is not a legal scene meta key
  (`parse.ts:628-639` rejects it), and no `*.native.ts` exists.
  Today's real escape for a scene that can't end at one decide is
  splitting at the seam into a chained second beat (the R5
  `count` → `count-resolve` pattern in scenes.md).
- Validation is errors-fail / warnings-pass; the one voice-override
  allowlist entry is `munemasa:official` (`VOICE_OVERRIDE_ALLOWED`,
  `validate.ts:48-50`, human 2026-07-05).
- Known cosmetic defect: the reading script hides R2/R5 under
  "Generalized scenes" (they're scene-defs); the GAME orders
  correctly. Fix is a PROPOSED plan:
  `docs/plans/fable-2026-07-18-reading-script-interleave.md`.

## 7. FB-415 talk-system status (in-flight — re-verify)

The talk-system redesign plan
(`docs/plans/fable-2026-07-17-talk-system-redesign.md`) is
**IN PROGRESS** (session 210). Landed as of 2026-07-18: the `## ask`
grammar + `asks.gen.ts` (commit 353fdacf), `src/core/asks.ts`,
`content/asks.ts` / `ask-refresh.ts` / `ask-natives.ts`. Not yet
verified landed: the later plan steps (UI surface re-homing, the old
`talk_to` cursor retirement, the takes-overlay `ask.` prefix in
`LIVE_UNITS`). Before relying on any of those, check the plan's
Status line and `git log --oneline -- src/core/asks.ts src/ui`.
A co-agent holds uncommitted talk-system WIP in this tree — for any
constant or state fact, prefer `git show HEAD:<path>` over disk.

## When NOT to use this skill

- Authoring or revising story CONTENT (new beats, reworded lines,
  names) → `narrative-diverge` (ADR-139 process; this skill is only
  its syntax reference). UI-surface variants → `diverge`.
- Taste judgment on the words → `taste-scorecard` +
  `docs/living/taste.md`.
- Save/migration mechanics behind line ids and `asksHeard` →
  `kami-save-and-schema`.
- The gen-narrative gate is RED for a non-grammar reason (formatter,
  roster) or another gate is RED → `kami-verify-gates`.
- "Add a quest / action / panel" wiring around a beat →
  `kami-extension-recipes`.
- Story canon (who Genemon IS, the kernel, tier arcs) →
  `docs/story-bible/` (living; point, don't copy) and
  `kami-domain-reference` for the glossary.
- PRD ripple after a shipped narrative change → `prd-ripple`.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (all file:line
citations re-verified at that commit — note commit `2d298b92`
reformatted the tree, so pre-2026-07-18 notes' line numbers differ).
Volatile facts to re-verify before trusting:

```bash
# target table
sed -n '50,90p' src/scripts/gen-narrative.ts
# block regexes + reserved keys
grep -n "^const RE_\|const RESERVED" src/scripts/narrative/parse.ts
# ask refresh/native vocabularies (closed maps — read, never assume)
grep -n "':" src/core/content/ask-refresh.ts src/core/content/ask-natives.ts
# live-switchable unit prefixes
grep -n -A2 "export const LIVE_UNITS" src/ui/dev/story-reader.ts
# open takes bundles
ls src/core/content/narrative/takes/
# talk-plan status (archived to project/archive/ once done)
grep -n "Status" docs/plans/fable-2026-07-17-talk-system-redesign.md
# intro scene order
grep -n "^## scene " src/core/content/narrative/intro.md
```

Stale-doc corrections carried above (re-check whether since fixed):
narrative README:17 intro order; takes/README bundle example missing
`hr:`/`rung:`. (AGENTS.md's old `rungThreshold` exemplar was fixed
in place 2026-07-18 — that correction is retired.)

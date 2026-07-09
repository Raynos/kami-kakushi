# Plan K — the kikigaki (聞書) authored-depth demo: parked route to the identity bet

**Status: 🧊 PARKED — exploration → plan (2026-07-09). Sequenced AFTER v0.4.0
ships; un-park is a human call, never agent-initiated. NOTHING in this plan is
canon — the embedded ADR drafts land only at un-park.**

**Confidence: ( 75% Sonnet 5, 25% Fable )** — written, per the human's explicit
directive, to executable detail so a Sonnet 5 session can build K1–K3 and K6
mechanically; taste concentrates in K0 (canon dossiers + thread kernels) and
K4's visual direction, which route to Fable via narrative-diverge / diverge.

Discovery record (the grill that produced every decision here, D1–D8):
[`2026-07-09-authored-depth-direction.md`](../../../project/brainstorms/2026-07-09-authored-depth-direction.md).

---

## 0 · Why this plan exists — the bet, in one paragraph

The candidate identity bet (D1, **not locked**): kami-kakushi's defining
ambition is **authoring-time density** — a world where vastly more is going on
than the player sees, where every thread they pull has real bottom, because
the canon behind it is actually written, consistent, and reachable. Not
runtime LLM NPCs; compiled, deterministic, fully-gated authored depth at a
scale human teams can't afford. This plan builds the **integrated pitch-slice**
(D6) that proves the *mechanism* inside the real T0 build: a first-class
investigation surface (the **kikigaki**, 聞書 — the "listening-record"
notebook), three threads with real bottom, one villager's decades-deep life,
novella-scale canon through the real FB-5 pipeline. Scale is explicitly NOT
what this demo proves.

## 1 · Who builds this — Sonnet 5 executes, Fable authors the load-bearing text

- **Sonnet 5** (or better): K1 core model · K2 compiler extension · K3 gate +
  fixtures · K5 content *wiring* · K6 proof lane. Every step below names its
  files, types, and tests; no taste calls are hidden inside them.
- **Fable**: K0 (canon dossiers + the 3 thread kernels, via
  [`narrative-diverge`](../../../.claude/skills/narrative-diverge/SKILL.md))
  and K4's Pass-1 visual direction (the register-book idiom). Bulk fact prose
  in K5 is single-take under the gate + sampled audits (D7).
- **Human**: picks the K0 kernels from coherent bundles, reviews the K4
  variants live, and renders the final demo verdict (K6's HR-item).

Safety rails for a non-Fable executor: never edit a `*.gen.ts` (the
`gen-narrative` gate names the `.md` to fix); story text beyond mechanical
copy goes through the K0 dossiers, not invented inline; any balance magnitude
change follows the ADR-132 flow (`pnpm run verify:balance` →
`pnpm run balance:report`, commit the regenerated
[`t0-pacing.md`](../../content/t0-pacing.md) with the change).

## 2 · Context a fresh executor needs (ordered read list)

1. This plan, top to bottom — §3 (contract) and §4 (model) are binding.
2. The discovery record:
   [`2026-07-09-authored-depth-direction.md`](../../../project/brainstorms/2026-07-09-authored-depth-direction.md)
   (D1–D8 are the design authority behind every §3 rule).
3. Story canon: [`00-kernel.md`](../../story-bible/00-kernel.md) (the seven
   fixed points — depth threads may *approach* the kernel, never spend it),
   [`04-cast.md`](../../story-bible/04-cast.md) (the 13 T0 cast — the demo
   threads hang off hooks already written there), and
   [`tiers/t0.md`](../../story-bible/tiers/t0.md).
4. The authoring pipeline:
   [`src/core/content/narrative/README.md`](../../../src/core/content/narrative/README.md)
   (FB-5 grammar), `narrative/requirements.md` (the CLOSED requirement grammar
   this plan extends), and `src/scripts/narrative/{parse,emit,validate}.ts`.
5. The engine seams: `src/core/state.ts` (`GameState`, the helper mutators),
   `src/core/intents.ts` (`Intent` union + `reduce`),
   `src/core/requirements-engine.ts`, `src/core/content/people.ts`
   (`PEOPLE`, `PresenceCtx`), `src/core/content/balance.ts`.
6. The storywave plan
   [`fable-2026-07-07-storywave-game.md`](../fable-2026-07-07-storywave-game.md)
   — this plan assumes its G2 scene-def system (`SceneTrigger`, `sceneQueue`)
   and G3.5 compiler shape are LANDED (they are prerequisites; see §8).
7. Quality rails: [`taste.md`](../../living/taste.md) (TST1–TST4),
   ADR-075 (diverge) + ADR-139 (narrative diverge) in
   [`decisions.md`](../../living/decisions.md), `src/scripts/gates.ts`,
   `src/fixtures/specs.ts`.

## 3 · §C — the depth contract (binding design rules)

- **C1 · Question-accountability (D4).** Every question the game causes the
  player to ask has an authored, reachable answer. A thread may terminate in
  mystery ONLY as **authored ambiguity** — an explicit `bottom · ambiguity`
  with terminal prose — never because nobody wrote the answer. The
  `verify-threads` gate (§6) enforces this structurally.
- **C2 · Ringed authoring (D4).** `ring: core | cast | texture` on every
  thread. Core = full resolution (or an explicit `defers-to: T<n>` kernel
  deferral); cast = deep coherent lives; texture = consistent but deliberately
  shallow. The ring sets how much is written *ahead*; C1 is the floor
  everywhere.
- **C3 · Kernel discipline.** The seven fixed points in
  [`00-kernel.md`](../../story-bible/00-kernel.md) are the bottom of the
  world. A T0 thread may end AT the kernel boundary (deferral marker) but
  never reveals kernel content early and never contradicts it.
- **C4 · Priced in the idle economy (D2).** Every pursue-move costs what the
  loop produces — ticks, coin, warmth thresholds. No free clicks.
- **C5 · Mechanical bite (D2, TST3).** Thread resolutions grant real
  mechanical effects through the same reward path everything else uses
  (`applyRewards`) — a flag, a price, a wage. Depth is load-bearing, never a
  codex.
- **C6 · One home (TST1).** The kikigaki tab is the ONLY surface for
  discovered facts. No second journal, no lore popups.
- **C7 · Deterministic and pure.** No RNG in discovery. Fact availability is
  a pure function of `GameState`; the same selector feeds both the UI
  forecast and the reducer (AC-6).
- **C8 · Diverge the load-bearing, gate the bulk (D7).** Thread kernels,
  bottoms, and the notebook beat get 3+ takes (ADR-139); bulk fact prose is
  single-take under the gate plus sampled human audits. This is the ADR-139
  refinement drafted in §10 — it applies inside this plan only until that
  draft lands.

## 4 · §M — the system model (core)

New content module pair, following the `rungBeats` pattern (hand-written
re-export over a generated registry):

- `src/core/content/threads.ts` (hand-written: types, helpers, re-exports)
- `src/core/content/threads.gen.ts` (GENERATED from `narrative/threads.md`)

```ts
export type ThreadRing = 'core' | 'cast' | 'texture';

export type FactSource =
  | { kind: 'heard'; npc: string }        // an NPC said it (PEOPLE id)
  | { kind: 'seen'; node: string }        // observed at a map node
  | { kind: 'read'; doc: string }         // a document/object
  | { kind: 'inferred' };                 // cross-reference of prior facts

export interface FactDef {
  id: string;
  thread: string;                          // owning ThreadDef.id
  source: FactSource;
  reveal: string[];                        // §5 reveal-condition lines (ALL hold)
  after?: string;                          // prior FactId ordering dependency
  costTicks?: number;                      // default PURSUE_TICKS
  costCoin?: number;                       // default 0
  grants?: { flags?: string[]; coin?: number; warmth?: [string, number] };
  text: string;                            // the journal entry, MC's hand
}

export interface ThreadDef {
  id: string;
  title: string;                           // the question, as MC would write it
  ring: ThreadRing;
  opens: string;                           // FactId whose discovery opens it
  bottom:
    | { kind: 'resolution'; fact: string }
    | { kind: 'ambiguity'; text: string; defersTo?: string }; // e.g. 'T4'
}
```

**State** (additive optional fields with defaults — no `SCHEMA_VERSION` bump,
per the additive-growth rule in `src/persistence/`):

- `knownFacts: string[]` — write-once latch, same discipline as
  `scenesPlayed` (the invariants test extends to it, K6).
- `threadsSeen: string[]` — UI newness latch (TST4 badges), write-once.

**Engine**: `src/core/threads-engine.ts` (pure, no DOM):

- `openThreads(s: GameState): ThreadDef[]` — threads whose `opens` fact is in
  `knownFacts` and whose bottom is not yet latched.
- `factsKnown(s, threadId): FactDef[]` — in discovery order.
- `availableMoves(s): Move[]` where
  `Move = { factId; threadId; costTicks; costCoin; blockedBy: string | null }`
  — a fact is a *move* when its `after` fact is known, all `reveal` lines
  hold (via the requirements engine, §5), and it isn't latched. `blockedBy`
  carries the human-readable unmet condition so the UI can show WHY a move is
  dimmed (same fn feeds forecast and reducer — C7/AC-6).
- `latchFact(s, factId): GameState` — latches, applies `grants` through
  `applyRewards`, appends the fact `text` to the log (`voice: 'narrator'`).

**Intent** (in `src/core/intents.ts`, the standard two-step add):

```ts
| { type: 'pursue_fact'; factId: string }
```

The `case 'pursue_fact'` block: no-op unless the fact is in
`availableMoves(state)`; pays `costCoin` via `withResource(next, 'coin', -c)`,
latches via `latchFact`, then `advanceClock(next, costTicks)`. Passive
latching also exists: scene asks/decisions may carry a `facts:` effect
annotation (K2 grammar extension) so a VN beat can hand the player a fact
directly — same latch path, no cost (the scene already cost the beat).

**Balance constants** (in `src/core/content/balance.ts`, ADR-132 governed):

```ts
export const PURSUE_TICKS = 4;             // default time cost per move
export const PURSUE_WARMTH_MIN = 2;        // default npc-talk threshold
export const SOAN_TRUST_TREAT_DISCOUNT = 0.5;  // bite: thread 2 resolution
export const TOKU_NOTICED_WAGE_BONUS_MON = 1;  // bite: thread 3 resolution
```

## 5 · §G — the authoring grammar (`narrative/threads.md`)

New FB-5 source file `src/core/content/narrative/threads.md`, compiled by
`pnpm run gen:narrative` into `threads.gen.ts` plus a readable compiled copy
`docs/content/t0-threads.md` (the whole web as one reviewable document —
that's how the human samples bulk prose, C8). Grammar, in the house style
(heading + `key: value` meta block ending at the first blank line):

```markdown
## thread soans-ledger · "What does Sōan keep in the grey book?"
ring: cast
opens: soan-ledger-glimpse

### fact soan-ledger-glimpse
source: seen · room-soan
reveal: flag treated-once

> Sōan wrote in the grey book again while he dressed my arm. He stopped
> when I looked, the way a man stops who was not writing about herbs.

### fact soan-ledger-dates
source: heard · soan
after: soan-ledger-glimpse
reveal: warmth soan >= 2
cost: ticks 4
grants: flags soan-dates-hint

> He asked me, offhand, what day I thought it was when he pulled me from
> the weir. I said what everyone says. He wrote down my answer, not the day.

### bottom · resolution soan-ledger-read
```

- `reveal:` lines reuse the CLOSED `requirements.md` grammar (`count`, `flag`,
  `state`, `native`) **extended** with three forms owned by this plan:
  `warmth <npc> >= <N>` (checks `npcMemory[npc].warmth`), `at <node>`
  (current location), and `fact <id>` (dependency on a prior latch). The
  extension lands in `src/core/requirements-engine.ts` + the compiler's
  `validate.ts` — same closed-grammar discipline: an unknown form is a
  compile error, and a real predicate that doesn't fit uses `native <key>`.
- `### bottom · resolution <fact-id>` names the resolving fact;
  `### bottom · ambiguity` is followed by terminal prose (`> …`) and an
  optional `defers-to: T<n>` line (C3 kernel deferral).
- Scene grammar gains one effect key: `facts: <id>[, <id>…]` on ask topics
  and decision options (mirrors the existing `flags:` annotation).

## 6 · §V — the `verify-threads` gate

New script `src/scripts/verify-threads.ts`; roster entry in
`src/scripts/gates.ts`:

```ts
{ name: 'verify-threads', cmd: 'tsx src/scripts/verify-threads.ts', scope: 'code' },
```

Checks (each independently RED-able — this gate is the teeth of C1):

1. **Referential integrity** — every `fact.thread` names a thread; every
   `opens`/`bottom.fact`/`after`/`fact <id>` reveal names an existing fact;
   every `heard · <npc>` is in `PEOPLE_IDS`; every `seen · <node>` /
   `at <node>` exists in `MAP_NODES`; every `warmth <npc>` is a cast id.
2. **Flag closure** — every `flag <id>` consumed by a reveal is produced
   somewhere (scene/quest/fact `grants` — build a producer index across the
   registries; the compiler already knows every `flags:` site).
3. **Acyclicity + reachability** — the `after`/`fact` dependency graph is a
   DAG; from each thread's `opens` fact, its bottom is reachable.
4. **Question-accountability (C1)** — every thread's bottom is a `resolution`
   whose fact exists, or an `ambiguity` with non-empty terminal prose. A
   `core`-ring thread may only be ambiguous with an explicit `defers-to:`.
5. **No orphans** — every fact belongs to exactly one thread and is reachable
   from its `opens`.
6. **Latch soundness** — no fact is granted by `facts:` in a scene AND
   required to be pursued with a cost (double-source ambiguity).

The gate runs in the parallel roster (soft 5s budget, ADR-072) — it is pure
static analysis over generated registries, comfortably sub-100ms.

## 7 · §U — the kikigaki tab (UI) + the notebook beat

> **⚠️ This section is an OPEN problem (2026-07-09, end of session).** FIVE
> feel-tests were built and all failed the human's fun bar — the record
> lives in [`project/prototypes/`](../../../project/prototypes/README.md)
> (`kikigaki-depth` · `the-asking` · `the-album` · `the-noticing`) and the
> round-by-round verdicts in the
> [discovery record](../../../project/brainstorms/2026-07-09-authored-depth-direction.md)
> (Rounds 2–9). Any future §U design must satisfy the converged constraint
> law (never enumerate method · always show progress · never vend knowledge
> through a verb · acquisition lives in the game's own surfaces) — and note
> Round 9's suspicion: interaction shape alone may not produce fun; the
> missing ingredient is likely stakes/material a fragment mock cannot carry
> (Round 4). Do NOT build K4 from this section as written without solving
> that first.

- **Tab**: add `'kikigaki'` to the `Tab` union, `TAB_ORDER`, and `TAB_LABEL`
  (label 聞書) in `src/ui/render.ts`; `tabHasContent` case returns
  `isUnlocked(state, 'panel-kikigaki')`; new pane section gated on
  `activeTab === 'kikigaki'`, with `dev.renderVariant('kikigaki-tab', pane,
  state, dispatch)` as the first line (the ADR-075 seam).
- **Surface**: `panel-kikigaki` added in `surfaces.ts`, unlocked by the
  notebook beat's reward — the fiction causes the tab (TST3): the tab does
  not exist until Sōan hands MC the blank notebook.
- **The notebook beat**: a `## scene-def kikigaki-notebook` in
  `narrative/scenes.md` — proposed `trigger: flag treated-once`, `once: true`,
  `voice: herbs` (Sōan): *"write what you can't keep."* The beat's decision
  grants `panel-kikigaki` + latches the first fact. Beat text is K0
  narrative-diverge material (C8), reviewable live in the DEV Story switcher.
- **The surface itself is a full ADR-075 diverge** (it's a new UI surface):
  3 working variants in `SURFACES` (`src/ui/dev.ts`), e.g. A · register-book
  spreads (facing pages per thread) · B · question-index ledger (dense rows,
  kanji chips) · C · single-scroll timeline (facts in discovery order,
  threads as margin threads). Each variant renders: open questions with
  newness marks (TST4), the thread page (facts in MC's hand, in order), and
  available moves with their tick/coin costs and `blockedBy` reasons — all
  fed from `availableMoves` (C7). Taste-scorecard Pass 1 before, Pass 2 per
  variant after; one HR line item per variant.

## 8 · Prerequisites + sequencing (D5)

- **Hard prerequisites**: v0.4.0 shipped; storywave G2 (scene-defs) and G3.5
  (compiler ownership) landed — this plan's K2 extends that compiler and MUST
  NOT run concurrently with another plan that owns compiler changes.
- **Strongly advised before un-park**: an HR-1-class fun verdict on the idle
  loop — depth wrapped around an unfun loop is the skybox failure this whole
  direction exists to avoid.
- **Un-park is a human act**: the human pulls this plan out of `t0/`, flips
  Status to `✅ LOCKED`, and the §10 drafts go through the normal ADR flow.

## 9 · Milestones

Demo threads are PROPOSALS pinned to hooks already in
[`04-cast.md`](../../story-bible/04-cast.md) — K0 confirms or replaces them.
O-Ume's jizō thread is deliberately NOT used (its reveal is T3 canon).

- **T1 · `the-weir-night`** (ring: core) — "What did Matsuzō see the night I
  came out of the weir?" Resolution: his full account (the *seeing* resolves).
  What it *means* opens a successor thread bottomed as
  `ambiguity, defers-to: T4` — demonstrating both bottom kinds and C3 in one
  arc. Matsuzō's decades-deep life (the "one villager" requirement, D6) hangs
  off this thread as cast/texture facts.
- **T2 · `soans-ledger`** (ring: cast) — "What does Sōan keep in the grey
  book?" Resolution: entries about MC — dates that don't line up with what
  "lost memory" explains. Bite: `soan-trust` flag → treatment coin cost ×
  `SOAN_TRUST_TREAT_DISCOUNT`.
- **T3 · `tokus-purse`** (ring: cast) — "Why does the dowager's purse open
  where the house's books don't?" (Toku secretly pays the living; everything
  she says is dated.) Bite: `toku-noticed` flag →
  `TOKU_NOTICED_WAGE_BONUS_MON` on the day wage
  (`src/core/content/wage.ts` seam).

### K0 · Canon dossiers + thread kernels — **Fable + human**

- **Goal**: the written bottom BEFORE any code. Per-thread dossiers (full
  canon: what is true, who knows what, every fact atom's content) + Matsuzō's
  life dossier, under `docs/story-bible/depth/` (new: `threads-t0.md`,
  `matsuzo-life.md`). The 3 thread kernels + the notebook beat go through
  narrative-diverge (3+ takes each, coherent bundles).
- **DoD**: dossiers committed; kernels picked by the human from bundles;
  every proposed fact atom exists as one dossier line with its intended
  reveal shape. No code.
- **Verify**: docs lane only (`md-links`, `doc-budgets`).

### K1 · Core model + engine — **Sonnet 5**

- **Files**: `src/core/content/threads.ts` (types §4, empty registry),
  `src/core/threads-engine.ts`, `src/core/state.ts` (+2 latch fields, factory
  defaults), `src/core/intents.ts` (`pursue_fact`),
  `src/core/content/balance.ts` (§4 constants).
- **DoD**: engine pure (no DOM imports); illegal `pursue_fact` is a no-op;
  cost is paid exactly once; latch is write-once; grants flow through
  `applyRewards`.
- **Named tests**: `src/core/threads-engine.test.ts` — availability honors
  `after`/`reveal`/latch; cost/clock assertions derive from the balance
  constants (never copied numbers); a RED-able bite test (resolution flag
  changes the treated price / wage output through the real reducers).
- **Verify**: full `pnpm run verify` green; `vitest` gate covers the new file.

### K2 · Grammar + compiler extension — **Sonnet 5**

- **Files**: `src/core/content/narrative/threads.md` (grammar §5, seeded with
  ONE complete thread from K0 as the pipeline proof),
  `src/scripts/narrative/{parse,emit,validate}.ts` (thread/fact/bottom
  blocks; `facts:` effect key; the 3 reveal-grammar extensions),
  `src/core/requirements-engine.ts` (`warmth`/`at`/`fact` forms),
  `src/core/content/threads.gen.ts` (generated), `docs/content/t0-threads.md`
  (generated reading copy), `src/core/content/threads.ts` flips to
  re-exporting the gen registry.
- **DoD**: `pnpm run gen:narrative` emits both outputs; a hand edit to
  `threads.gen.ts` turns the `gen-narrative` gate RED naming `threads.md`;
  an unknown reveal form is a compile error (closed grammar held).
- **Named tests**: parser cases in the existing narrative compiler test home
  (thread block, bottom variants, `facts:` key, each new reveal form,
  rejection of an unknown form).
- **Verify**: `gen:narrative:check` + full verify green.

### K3 · The gate + fixtures — **Sonnet 5**

- **Files**: `src/scripts/verify-threads.ts` (§6), `src/scripts/gates.ts`
  (+1 roster entry), `src/fixtures/specs.ts` (+2 specs: `kikigaki-open` —
  notebook granted, T2 open, nothing pursued; `kikigaki-resolved` — T2 driven
  to bottom through REAL intents), regenerated `src/fixtures/saves/`.
- **DoD**: each §6 check has a proven RED (feed it a deliberately broken
  registry in a test, not by committing red); fixtures load via
  `__qa.loadFixture('kikigaki-open')` and `?fixture=`.
- **Named tests**: `src/scripts/verify-threads.test.ts` (one RED case per §6
  check); fixture `expect` blocks assert thread/latch invariants.
- **Verify**: full verify green incl. the new gate; `pnpm run verify:budget`
  still under budget.

### K4 · The kikigaki surface + notebook beat — **Sonnet 5 build, Fable Pass-1**

- **Files**: `src/ui/render.ts` (tab plumbing §7), `surfaces.ts`
  (`panel-kikigaki`), `src/ui/dev.ts` (`SURFACES` + `kikigaki-tab` with 3
  variants), `narrative/scenes.md` (`scene-def kikigaki-notebook`, prose from
  K0's picked take).
- **DoD**: ADR-075 held in full — 3 WORKING variants, live-switchable, prod
  default self-picked, zero prod flag-debt; the tab does not exist before the
  beat (TST3) and never flashes or rebuilds under the player (TST2); moves
  show cost + blockedBy from the same selector the reducer uses (C7).
- **Named tests**: e2e assertion added in K6; unit: `tabHasContent` gating.
- **Reviews**: taste-scorecard Pass 1 (before) + Pass 2 per variant (after);
  one HR line item per variant.

### K5 · Content cutover + bites — **Sonnet 5 transcribing K0**

- **Files**: `narrative/threads.md` (the full demo web: 3 threads, ~25–30
  fact atoms, transcribed from the K0 dossiers — bulk prose single-take under
  the gate, C8), `src/core/content/wage.ts` + the treatment lane (the two §9
  bites), `balance.ts` magnitudes.
- **DoD**: `verify-threads` green over the full web; both bites reachable in
  play; ADR-132 flow run (`verify:balance` → `balance:report`, regenerated
  `t0-pacing.md` committed with the change, sim summary in the commit body);
  `docs/content/t0-threads.md` regenerated — that document IS the sampled
  human audit surface.
- **Named tests**: bite tests from K1 now run against real content ids.
- **Verify**: full verify + `verify:balance` green.

### K6 · Proof — **Sonnet 5**

- **Goal**: the demo is real by PH6 standards — reachable, end-to-end, in the
  player path.
- **Files**: `e2e/kikigaki-journey.spec.ts` (load `kikigaki-open` → open tab →
  pursue a move → journal entry + cost visible → drive T2 to bottom → bite
  observable), `src/core/invariants.test.ts` (extend `checkState`:
  `knownFacts`/`threadsSeen` write-once, never un-latch),
  `src/core/t0-arc.test.ts` untouched-green (depth never blocks the arc).
- **DoD**: e2e green on both mobile profiles; a playtest capture session
  exists; an HR-item files the demo verdict ("does pulling a thread FEEL like
  the mystery is real?") — the human is the arbiter (PH5).
- **Verify**: full verify + `test:e2e` + CI green.

## 10 · Draft ADRs — DO NOT land while parked

Drafted here so un-park is one motion; they enter
[`decisions.md`](../../living/decisions.md) only when the human un-parks.

- **ADR-draft-K1 · Authored depth is the identity bet (staged).** Kami-kakushi
  is the game whose mystery has real bottom: authoring-time density, compiled
  and gated, is the defining ambition (D1). The bet is staged: proven by this
  plan's pitch-slice before any at-scale authoring. On acceptance: PRD §1
  ripple (intent-class, human-signed), and the depth contract (§3 C1–C7)
  becomes a conventions-level rule.
- **ADR-draft-K2 · ADR-139 refinement — diverge the load-bearing, gate the
  bulk (D7).** At depth scale, 3+ takes per fiction-voiced text is
  arithmetically impossible. Divergence concentrates where taste does: voice
  bibles, thread kernels, bottoms, beats. Bulk fact atoms are single-take
  under `verify-threads` + sampled audits via the generated
  `docs/content/t0-threads.md`. ADR-139 as written stays canon until this
  draft lands.

## 11 · Open questions (for un-park time)

1. **Tab vs. fold-in (TST1 pressure)**: `kikigaki` would be the 8th tab. If
   the tab bar is saturated by then, the fallback home is a Character-tab
   section — K4's diverge should include one folded variant if so.
2. **The notebook trigger**: `flag treated-once` is a proposal; K0's beat
   diverge may relocate it (e.g. after the first rung beat).
3. **Pricing defaults**: `PURSUE_TICKS = 4` is a guess; K5's ADR-132 pass
   owns the real numbers against attended-time telemetry.
4. **The successor-thread mechanic** (T1's ambiguity opening a new thread):
   K2 may need a `spawns:` key on bottoms — decide when the compiler work is
   live, keep the grammar closed until forced.

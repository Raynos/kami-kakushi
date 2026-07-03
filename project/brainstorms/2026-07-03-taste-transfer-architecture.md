# Taste-transfer architecture — distilling feedback so agents build as if you wrote it

**Status: 🧠 PROPOSAL — the strategy answer to the ⭐ "redo taste-distillation
WITH Fable" TODO.** Authored by Fable 5 at the human's opening question
("Zoom out — what's the best way to distill my feedback so future agents
build the game as if I wrote it myself, in gameplay, UI and fun?"). This doc
is the *how*; the rework itself follows once the human blesses the shape.

---

## 1 · The zoom-out: it's a pipeline, not a document

The instinct behind the question is right. A better-worded `taste.md` is not
the goal — the goal is a **taste-transfer pipeline** where feedback flows
from raw verdicts into things that *fire by construction* on future work:

```
raw feedback  →  distillation  →  delivery/enforcement  →  measurement
(F-corpus,        (taste.md         (always-loaded register,   (prediction test,
 append-only)      pyramid)          checklist, scorecards,     repeat-feedback
                                     gates)                     rate)
```

The S2 plan (playtest-capture inbox) industrializes the front of this pipe;
the N7 plan (taste-bar enforcement) is the back, parked until the middle —
this rework — locks. The redo isn't an isolated doc edit; it's the keystone
the other two plans bolt onto.

The deeper reframe: the current draft is **corrective** (22 rules that stop
known mistakes recurring). "As if I wrote it myself" demands a **generative**
standard — one that predicts your verdict in situations *no rule covers*.
Those are different layers:

| Layer | What it is | Count | Transfers to… |
|---|---|---|---|
| Verdicts | F1–F117: "this thing is wrong" | unbounded | nothing (spent) |
| Principles | "this class of thing works this way" | ~22 | similar situations |
| Values | "this is what I care about and why" | ~5–6 | **novel situations** |
| Touchstones | the reference library, in your words | ~5 | everything at once |

The draft has the bottom two. The redo's real work is the top two — plus the
delivery rungs and the measurement loop.

## 2 · State of the first cut (verified, not trusted)

Checked 2026-07-03 against the corpus, per R2:

- **Coverage is near-total.** Of the F-items in
  `project/human-feedback/2026-07-02-playtest.md`, only **F9, F21, F102** go
  uncited in `taste.md` (F9/F21 are plausibly folded into P5/P6's log-filter
  territory; F102 needs a look). One citation, **F72**, appears in taste.md
  but matches no corpus heading — chase it during the rework.
- So the first cut's gap is **architectural, not evidential**: no values
  layer, no touchstones, flat 22-item list with no hierarchy, and scope
  deliberately limited to UI/narrative (its own §Scope punts game-systems
  taste to `prd.md` + ADRs).
- **The wider corpus is undistilled.** taste.md draws on the 2,314-line
  playtest only. Another ~1,400 lines of dated feedback
  (`2026-06-26-prd-human-feedback.md` at 629 lines, the tier-reshape,
  decision-session, r4-playtest and process-learnings docs) carry the
  *gameplay and fun* taste — currently scattered across ADRs, `prd.md` and
  `fun-factor.md` with no single spine. The user's question names gameplay
  and fun explicitly; the redo must sweep these docs too.

## 3 · The target shape — one spine, a pyramid inside it

**No fourth doc** (standing steer: avoid new maintained files). `taste.md`
stays the single spine and becomes a pyramid:

1. **Values (~5–6)** — cross-domain (gameplay + UI + narrative + fun), each
   a paragraph in the human's voice with its *why*, each listing the
   principles it generates. The tie-breaker layer: when principles conflict
   or don't cover, agents reason from here.
2. **Touchstones** — the named references that anchor the sensibility. The
   draft already leans on them implicitly: *GBA-style typewriter*,
   *old-school JRPG "learned" boxes*, *Fallout-style dialogue tree*, *"a
   reference idle-RPG"* for chrome density, *Kurosawa* for the visual house.
   Made explicit, each with one line on *what to take from it* (and what
   NOT to). Only the human can complete this list.
3. **Principles (the ~22, reworked)** — keep the draft's strongest feature:
   falsifiable Do/Don't pairs + F-provenance + home-doc pointers. Regroup
   under their values; merge/split where the re-derivation says so.
4. **Checklist** — unchanged in role; regrouped by value; the player-facing
   items separated from workshop/DEV items so the pre-ship pass stays lean.

Domain detail stays in the bibles — `ui-design.md` owns tokens/components,
`fun-factor.md` owns the fun model and gameplay principles, `prd.md`/ADRs own
system shapes. taste.md's principles *point*, never restate numbers — the
existing "Home:" convention, kept and enforced in review.

### Candidate values (strawman for the grill — YOUR words replace these)

Derived by clustering the 22; offered so the lock session edits rather than
starts blank:

- **V1 · One canonical home for everything.** One tab per capability, one
  shared primitive per behavior (typewriter, divider), one source per value
  (palette, version). Duplication is drift. *(P1, P3, P4, P13, P19, P20.)*
- **V2 · Never yank the ground from under the player.** Continuity of
  surface: nothing flashes, resets, rebuilds or resizes while watched;
  scroll, focus and in-flight animation survive every state tick.
  *(P2, P9, P12, P16-frame.)*
- **V3 · The fiction causes the mechanics.** Nothing appears un-motivated;
  prose promises are contracts (Chekhov audit); rewards are diegetic;
  vendors are people; the UI reveal *follows* the story.
  *(P14, P15, P16, P17, P18-reveal.)*
- **V4 · Two registers, deliberately.** Dense idle-RPG chrome vs generous
  ceremony — know which register a surface is in; size, pace and dress it
  accordingly. Sparse-early is correct; the dashboard and its unlock are one
  design. *(P7, P8, P10, P11, P18.)*
- **V5 · The player never guesses state.** Controls advertise their state;
  lines land on the channel matching their weight; fresh content is marked;
  history reads as history. *(P5, P6, P12, P13, P20.)*
- **V6 · The bar has no backstage.** DEV tooling, error states, modals and
  edge screens are held to the game's own standards — if a playtester can
  see it, it's part of the game. *(P19, P21, P22.)*

Gameplay/fun values are **under-derived** so far (the UI playtest dominates
the distilled corpus). Candidates visible from the wider docs — *distinct
systems keep distinct loops* (F22: stamina ≠ health, each with its own
recovery), *discover, don't spawn* (D-104/D-110, emergent-node-actions
direction) — but Step 1 below re-reads the ~1,400 undistilled lines before
proposing these for real.

## 4 · Delivery — the rungs that make it fire

A doc transfers nothing if it isn't encountered. Per the repo's own rung
rule (gate > hook > skill > norm, at the highest *sound* rung):

- **Rung A — always-loaded register.** A short "taste register" in
  AGENTS.md: the values as one-liners, each pointing into taste.md —
  mirroring exactly the philosophy R1–R6 pattern. AGENTS.md already states
  the rationale verbatim: a standing rule buried in an opt-in doc doesn't
  fire.
- **Rung B — read-at-build-time.** The existing "read taste.md before
  building any surface" convention — already standing in AGENTS.md; kept.
- **Rung C — pre-ship self-scorecards.** The checklist + N7's per-surface
  scorecards attached to R-items. N7's re-plan trigger is literally this
  TODO closing — un-park and rewrite it in full as part of the redo.
  Its second payoff is the flywheel: when the human disagrees with a
  scored surface, the scorecard pinpoints which principle is wrong/vague,
  and that edit graduates back into taste.md.
- **Rung D — mechanical gates for the invariant subset.** Some principles
  are content invariants a gate can hold without crying wolf (A11-safe):
  no `innerHTML =`/container reset in the renderer outside an allowlist
  (P2); no raw hex outside token files (P19); no raw `vw` sizing (P11);
  exactly one typewriter module (P3). Each gate names its principle. Taste
  *judgment* never becomes a gate — that's N7's scorecard territory.

## 5 · Measurement — how we know the transfer worked (R2/R3)

A taste doc needs its own could-have-gone-RED test:

- **Prediction test (at lock).** A fresh-eyes agent, given ONLY the locked
  taste.md + bibles, is shown ~10 *reversed* F-items (the pre-fix state,
  described neutrally) plus a few held-out situations, and asked "what
  would the human say?" Score against the actual verdicts. A miss = a
  missing or too-vague principle; fix the doc, not the test.
- **Repeat-feedback rate (ongoing).** The doc's own promise — "never earn
  the same feedback twice" — becomes measured: every future feedback item
  gets tagged *new-taste* vs *repeat-offense* at capture (the S2 inbox
  format carries the tag). A repeat-offense means the principle existed but
  didn't fire → strengthen the **rung**, not the prose. New-taste → extend
  the doc.

## 6 · Failure modes to design against

1. **Vague-mush compression.** "Make it feel intentional" transfers
   nothing. Every principle keeps a falsifiable Do/Don't; if two reasonable
   agents could disagree on pass/fail, it isn't done.
2. **Rule-count creep.** 22 → 40 turns taste back into noise. New feedback
   lands as *evidence under an existing principle* by default; a genuinely
   new principle needs a value it expresses, or it's a sub-bullet.
3. **Spine/bible drift.** taste.md points, bibles own the numbers — never
   restate a token or threshold in two places.
4. **Gate overreach.** Judgment can't be linted (A11); only content
   invariants graduate to Rung D.
5. **Losing the voice.** Keep verbatim quotes in principles ("funky
   center-wrap", "GBA typewriter") — the phrasing *is* data; paraphrase
   flattens the sensibility the whole exercise exists to transfer.

## 7 · The redo process (proposed)

1. **Independent re-derivation (Fable, autonomous, ~1 session).** Re-read
   the FULL corpus — the 2,314-line playtest AND the ~1,400 lines of other
   feedback docs — and re-derive principles + values from scratch, then
   diff against the first cut (verify-don't-trust: re-derive, don't edit in
   place). Chase F72/F9/F21/F102. Deliverable: a substance-diff + the
   strawman values/touchstones, updated.
2. **The lock (human + Fable, grill-style).** You rewrite the values in
   your own words, name the touchstones, and rule the contested principle
   calls. This is the only layer that MUST be in your voice; it's also the
   direction/taste call that is yours by construction (R4).
3. **Rewrite + ripple.** taste.md becomes the pyramid; ui-design.md
   reconciled against it; the AGENTS.md taste register added; the Rung-D
   gate subset extracted; N7 rewritten in full (its trigger has fired).
4. **Prove it.** Run the prediction test against the locked doc; wire the
   repeat/new tag into the S2 capture format when that plan builds.

## 8 · Open forks for the human (defaults picked, override async — R4)

- **Which idle-RPG is THE chrome-density touchstone?** The corpus says "a
  reference idle-RPG" without naming it. Only you can name it.
- **Touchstones list** — confirm/extend the five inferred above.
- **Gameplay values in taste.md's top layer?** Default: yes — values span
  domains; gameplay *principles* stay in fun-factor.md/prd.md. Override if
  you want taste.md to stay UI-only.
- **DEV/workshop principles (P21/P22)** — default: keep in taste.md under
  V6 but sectioned as "workshop" so the player-facing checklist stays
  lean. Override: move to qa-playtesting.md wholesale.

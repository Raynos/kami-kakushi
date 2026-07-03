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
- ~~**The wider corpus is undistilled.** The redo must sweep the other
  ~1,400 lines of dated feedback docs too.~~ **Superseded (human steer,
  2026-07-03): derive from `2026-07-02-playtest.md` ONLY** — it is the
  first and only playtest. The other dated docs are decision records whose
  outcomes already live in ADRs/PRD; they are not playtest taste.

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
4. ~~**Checklist** — unchanged in role.~~ Superseded by §9: the checklist
   **leaves taste.md** — its operational form is N7's per-surface
   scorecard, generated from the principles, not a doc section.

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

Gameplay/fun values are **under-derived** — and per the human steer, that
is correct for now: the playtest is the only corpus, and it is UI-heavy.
What it does carry (*distinct systems keep distinct loops* — F22; *discover,
don't spawn* — D-104/D-110) folds under V3; a systems-taste layer waits for
a systems playtest.

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
   `2026-07-02-playtest.md` — the whole corpus, per the human steer — and
   re-derive principles + values from scratch, then diff against the first
   cut (verify-don't-trust: re-derive, don't edit in place). Chase
   F72/F9/F21/F102. Deliverable: a substance-diff + the strawman
   values/touchstones, updated — already culled to the §9 budgets.
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
- ~~**Gameplay values in taste.md's top layer?**~~ Settled by the
  corpus steer: values derive from the playtest only; gameplay taste
  appears only where the playtest carries it (folds under V3). A systems
  layer waits for a systems playtest.
- **DEV/workshop principles (P21/P22)** — default: keep in taste.md under
  V6, compressed to a few lines. Override: move to qa-playtesting.md.

## 9 · Bounded, not append-only — budgets + the hard lock (human steer, 2026-07-03)

The human's constraint on the rewrite: lightweight, flexible, high-level
taste hints — **never** hundreds of lines of context spam; the exhaustive
corpus already exists in `project/human-feedback/`. What keeps a living doc
bounded:

**a. Declare both docs snapshot-class.** The repo taxonomy already has two
genres: append-only logs (journal, human-feedback) and replace-in-place
snapshots (`project-status.md`). `taste.md` and `ui-design.md` are
**snapshot-class**: edited in place, never appended; the lossless record is
the F-corpus + git history, so culling is *correct, never a loss*. Each doc
states this in its header.

**b. A hard line budget turns "append" into "displace".** Under a cap, a
new taste hint must beat the weakest existing line — every addition is a
ranking decision. This is the entire editorial mechanism; norms without a
measure get ignored (the snapshot bloated to 326 lines before its gate).

**c. The budgets.** Calibrated on the proven snapshot ratio (~90 real lines
under a 120 cap ≈ 1.33× headroom — generous enough to never cry wolf,
impossible to bloat):

| Doc | Rewrite target | Hard cap |
|---|---|---|
| `docs/living/taste.md` | ~110 | **150** |
| `docs/living/ui-design.md` | ~300 | **400** |
| AGENTS.md taste register | ~10 | 12 (norm only) |

What the targets force: taste.md = values (~6 × 4 lines) + touchstones +
principles compressed to 1–2 memorable lines each with an F-pointer (the
Do/Don't casebooks cull — the corpus holds the examples); the 70-line
pre-ship checklist **leaves taste.md** and becomes N7's per-surface
scorecard, generated from the principles. ui-design.md = the components
section (currently ~400 lines alone) culls to per-component one-liners +
pointers into `src/` (the build is the truth, R2), and hand-maintained
token tables move to **generated** docs (`gen-docs.ts` →
`docs/content/ui-tokens.md`, derived from the CSS custom-properties source
— single-source rule; generated files are exempt from budgets, they can't
rot).

**d. The hard lock — one script, two rungs.** A ~40-line
`verify-doc-budgets.ts` holding the budget table (absorbing the
snapshot's 120 so caps live in ONE place):

1. **Verify gate** (13th roster entry): fires at every commit (via
   `run_verify`), every push (pre-push runs verify on all branches), and
   CI when N3 lands. Objective line count — the highest sound rung, can't
   cry wolf (A11-safe, same class as `verify-changelog`).
2. **Pre-commit standalone call**, outside the `SKIP_VERIFY` path — mirroring
   exactly how the snapshot-shape gate works today. This matters because
   taste/ui-design edits are usually **docs-only commits, which is precisely
   when agents use `SKIP_VERIFY=1`** — without this rung the cap would be
   routinely dodged at commit time and only caught at push. Checks the
   **index blob** (`git show :path`) so it judges what's actually being
   committed, not a co-agent's dirty working tree. Bypass:
   `SKIP_DOCBUDGET=1`, documented as *human-blessed cap raise only* — the
   block message says "cull, don't bypass; displacement is the mechanism."

**e. Genre tripwires (warn rung).** Alongside the cap, the pre-commit warn
that already catches "Phase update —" bullets in the snapshot extends to
these docs: a dated bullet (`(session-NN)`, `— 2026-…`) in taste.md /
ui-design.md is the journal genre leaking in — loud warn, move it.

**f. The flywheel sharpens in place.** N7 scorecard disagreements edit an
existing principle's wording rather than appending a new rule; a genuinely
new principle needs a value it expresses — and a line it displaces.

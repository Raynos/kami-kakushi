# Authored depth — "the game only this can make": Brainstorm / Discovery Notes

Date: 2026-07-09 · Goal: stress-test and lock (or reject) authoring-time density as
kami-kakushi's defining ambition — a world with vastly more going on than the
player sees, every thread with real bottom, ~fifty novels of interlocking canon
compiled into a static, deterministic, fully-gated game — and settle how it
composes with the T0–T5 idle spine, storywave, the story bible, and the fun
question. Candidate ADR-sized direction lock.

## Origin (context)

Came out of the 2026-07-09 "big swings" discussion: the human asked what
separates real frontier-model work from small tickets. Of the swings offered
(ship the whole game · authored depth · studio inversion · thousand playtesters
· catalog), the human picked **authored depth** ("Yeah ok that's big boy
energy"). Key framing from that discussion, kept verbatim:

> The genuinely new capability isn't building the same games faster; it's
> **authored depth that is economically impossible for humans**. Kamikakushi —
> spirited away — is thematically begging for it: a world where vastly more is
> going on than the player sees, and every thread they pull has real bottom.
> Every villager with a coherent decades-long life that intersects yours.
> Secrets nested five layers deep that are all actually written, consistent,
> and reachable. Not runtime LLM NPCs (latency/cost hell, and slop) —
> authoring-time density: fifty novels of interlocking canon compiled into a
> static, deterministic, fully-gated game. No game has ever delivered "the
> mystery is real, not a skybox."

Standing counterweight (also from that discussion, not yet resolved): none of
this escapes the fun question — depth wrapped around an unfun loop is the
world's most elaborate skybox. The fiction must cause the mechanics (TST3).

## Summary / key decisions

_(running synthesis — updated as answers land)_

- **D5 (Q5) — STATUS OF THE WHOLE THREAD: exploration → plan, then PARK.**
  (Human, verbatim-close:) this is an idea to turn into a plan and park. The
  existing storywave is canon, the existing build is canon; the human continues
  v0.4.0 and playtesting the idle gameplay — T0 itself needs much work to
  finish. No demo build yet: the deliverable is a PLAN for how to get a demo,
  **sequenced after v0.4.0 is done**. An ADR may be *drafted* and the spec
  *planned*, but nothing lands as canon — it all stays at the PLAN stage.
  ("Basically 1 & 3" — lock-now-spec-now minus the landing, plus the HR-1-ish
  gate of v0.4.0/playtesting coming first.)
- **D1 (Q1): Identity, staged proof — *as the parked candidate*.** IF adopted,
  authored depth is what kami-kakushi IS (PRD §1 rewrite), proven on T0 first
  (one village, ~13 lives at full depth, secrets that actually resolve) before
  authoring at world scale. Per D5 this is NOT locked — it's the shape the
  parked plan proposes, not current canon. An identity bet you can't demo is
  just a manifesto.
- **D2 (Q2): Investigation lane, priced in the idle economy.** Depth gets a
  first-class verb set + UI surface (evidence, questions, deduction), but its
  actions spend the idle loop's currencies and its discoveries bite back
  mechanically. Combination of "rides the economy" + "first-class lane".
- **D3 (Q3): Knowledge-web.** Discovered facts are discrete authored atoms
  linked into threads; the growing web IS the player's progress (Outer Wilds
  model, no fail state). Rendered in-idiom (register book / evolving scroll,
  not cork-board-and-string). Atoms carry authored reveal conditions →
  deterministic, economy-gateable, and walkable by consistency gates; the web
  doubles as the index into the full canon.
- **D4 (Q4): Depth contract = question-accountability + ringed authoring.**
  (Combination of options 1 & 3.) The invariant everywhere: every question the
  game causes the player to ask has an authored, reachable answer; dangling
  threads exist only as authored ambiguity (marked), never as unwritten canon —
  gate-checkable by walking the knowledge-web. The *proactive* authoring effort
  is ringed by content class: core mystery = full resolution · cast = deep
  coherent lives · world texture = consistent but deliberately shallow. The
  ring sets how much is written ahead; the accountability invariant is the
  floor across all rings (texture must never raise a question it can't answer
  — if it does, that thread gets pulled into a deeper ring).
- **D6 (Q6): Demo = integrated pitch-slice.** In the real T0 build,
  post-v0.4.0: knowledge-web tab in idiom, ~3 threads with real bottom, one
  villager's decades-deep life, novella-scale canon through the real pipeline.
  Proves mechanism + integration, deliberately not scale.
- **D7 (Q7): Diverge the load-bearing, gate the bulk.** ADR-139 refinement
  (draft-only until un-park): 3+ takes for voice bibles / thread kernels / key
  scenes; bulk atoms single-take under consistency gates + sampled audits.
- **D8 (wrap directive): the plan must be Sonnet-5-buildable.** (Human:) "the
  plan needs a lot of detail, I want it written in a way such that sonnet 5
  could build it." So the parked plan is written to executable detail — real
  paths, schemas, gate specs, milestone DoDs with named tests — not a vision
  memo. Creative/taste-concentrated pieces are explicitly carved out for
  Fable routing in the plan's model-routing section.

### Q6 — Demo target (what the parked plan aims at)
- Asked: integrated pitch-slice vs standalone toy vs depth-complete T0 vs
  paper demo?
- Captured: **Integrated pitch-slice** (took the recommendation): in the real
  T0 build — knowledge-web tab in idiom, ~3 pullable threads with real bottom,
  one villager's decades-deep life, novella-scale canon compiled through the
  real narrative pipeline. Proves mechanism + integration + pipeline; scale is
  explicitly NOT what the demo proves.
- Flags: none.

### Q7 — Diverge policy at canon scale (ADR-139 conflict)
- Asked: ADR-139's "3+ takes per fiction-voiced text" is arithmetically
  impossible per-atom at depth scale — where does divergence live?
- Captured: **Diverge the load-bearing, gate the bulk** (took the
  recommendation): 3+ takes where taste concentrates (voice bibles, thread
  kernels, key scenes); bulk atoms single-take under consistency gates +
  sampled human audits.
- Flags: this is an ADR-139 *refinement* — must be written into the draft ADR
  inside the plan, and only lands (as an ADR-139 v2) if/when the plan un-parks.

### Q5 — Sequencing vs storywave / v0.4.0 / fun verdict
- Asked: lock-and-spec now vs build in parallel vs wait for HR-1 vs pivot?
- Captured: **"1 & 3" with a hard reframe** — this whole direction is an
  exploration to be turned into a plan and PARKED. Storywave + current build
  stay canon; the human keeps working v0.4.0 + playtesting idle gameplay; the
  depth demo is sequenced AFTER v0.4.0. ADR draft + spec planning allowed, but
  nothing lands — everything stays at PLAN stage.
- Flags: plan home = `docs/plans/t0/` (tier subfolders are skipped by the
  active-plans scanners — the sanctioned parked home), Status token `🧊 PARKED`,
  reading-queue entry in the authoring commit. NO BACKLOG.md pointer —
  BACKLOG.md bans plan pointers (they rot; the checkpoint gate flags them).
  ADR draft lives INSIDE the plan doc (it must not land in decisions.md while
  parked).

### Q4 — Depth contract
- Asked: what testable promise backs "every thread has real bottom"?
- Captured: **combination of question-accountability (1) and ringed depth
  (3)** — see D4 synthesis above.
- Flags: the gate needs an `authored-ambiguity` marker in the web schema so
  deliberate mystery is distinguishable from unwritten canon.

## Q&A log

### Q3 — Lane shape: knowledge as state
- Asked: knowledge-web (Outer Wilds) vs assert-and-verify (Obra Dinn) vs
  gather-then-confront (Paradise Killer) vs diegetic journal only?
- Captured: **Knowledge-web** (took the recommendation).
- Flags: none.

### Q2 — Player verbs: how depth is engaged
- Asked: is depth engaged through the idle economy's existing verbs, a
  first-class investigation system, ambient attention, or staged?
- Captured: ~~First-class investigation lane~~ (retracted, re-asked) →
  **"A combination of 1 & 2"**: depth rides the idle economy AND gets a
  first-class investigation lane. Synthesis: a dedicated investigation
  surface/verb set (evidence, questions, deduction) whose actions are PRICED in
  the idle loop's currencies (time, standing, favors) and whose discoveries
  feed back mechanically (TST3 bite). Curiosity is what idle surplus buys, but
  it has its own home (TST1: one tab for the capability).
- Flags: shape/reference model of the lane → Q3.

### Q1 — Blast radius of the lock
- Asked: is authored depth the game's identity (PRD §1 rewrite) or a layer on
  the existing idle game?
- Captured: **Identity, staged proof** (took the recommendation). Lock the
  ambition as what the game is; prove it on T0 at full depth before scaling.
  Future tier/system decisions get judged depth-first.
- Flags: PRD §1 rewrite is a ripple obligation once the lock lands as an ADR
  (intent-class change → human-signed, per ADR-117 flow).

## Parking lot (tangents / parallel threads)

- The other 2026-07-09 "big swings" not chosen (ship-the-whole-game · studio
  inversion · thousand model-playtesters · multi-game catalog) — floated in
  the same discussion, not developed. Recallable from this file's Origin
  section if the human ever pulls one forward.

## Open flags (pending input)

- **PRD §1 ripple** — owed only if/when the plan un-parks and ADR-draft-K1
  lands (intent-class change, human-signed). Owner: human + Fable session.
- **ADR-139 refinement** (diverge load-bearing, gate bulk) — drafted as
  ADR-draft-K2 inside the plan; ADR-139 as written stays canon until un-park.

## Outcome (2026-07-09 — session close)

Promoted: the whole grill distilled into
[`docs/plans/t0/fable-2026-07-09-authored-depth-demo.md`](../../docs/plans/t0/fable-2026-07-09-authored-depth-demo.md)
— **Plan K, 🧊 PARKED**, written to Sonnet-5-buildable detail (D8): depth
contract §3, core model §4, `threads.md` grammar §5, `verify-threads` gate §6,
kikigaki tab §7, milestones K0–K6, draft ADRs §10. Nothing landed as canon
(D5): storywave + the current build stay canon; sequenced after v0.4.0;
un-park is the human's move. Reading-queue entry added in the same commit.

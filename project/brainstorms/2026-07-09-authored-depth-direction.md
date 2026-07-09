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

## Feel-test verdict (2026-07-09, human — after playing the prototype)

- Layouts: **ledger/scroll bad, book better** — but the layout isn't the issue.
- **The interaction model FAILED**: visible move-list + priced clicks + warmth
  pumping = "randomly click through and guess everything and get all the
  content… a cheap UI." The depth may exist but is found too easily. This
  indicts Plan K §M's `availableMoves` surface (the checklist) — not the ring
  contract, not the canon model.
- New brief for the surface (human, verbatim-close): make the player WORK for
  it · STUMBLE upon it · no hints/hand-holding, hard work and thought · never
  checklist/chore — curiosity & imagination find it · open-ended · a UI only
  Fable could build (impossible for pre-LLM 2023 HTML5 dev).
- Three replacement top-level UI concepts offered (detailed in chat, to be
  developed on pick): **問 The Asking** (free-text questions → compiled
  authored intent lexicon, answers in-voice per speaker×state, no menus) ·
  **帳 The Papers** (the house's complete REAL document corpus, unmarked
  discrepancies found by actually doing the bookkeeping; rung = clearance;
  gate audits the corpus arithmetic) · **影 The Overheard World** (a
  never-repeating state-true ambient layer + clip-anything + show-any-clipping
  -to-any-person authored reaction matrix; meaning confirmed only by people's
  reactions). Shared spine: open input, intrinsic thought-cost, confirmation
  only through the fiction; all static/deterministic/gate-walkable (C7 holds).

## Round 2 (2026-07-09, later) — Asking picked; Papers/Overheard rejected; 10 more

- **Human verdicts on the three concepts:** The Asking → *build the prototype*
  (built: `project/prototypes/the-asking/`). The Papers → rejected as pitched
  ("how can this be fun, its just 300 pages of dense stuff"). The Overheard
  World → rejected as pitched ("I still don't feel how the UI comes into
  this"). Lesson recorded: a depth concept is only as good as its concrete
  UI + moment-to-moment fun; corpus-scale is not a pitch.
- **The Asking prototype** (feel-test II): free-text question box, 4 NPCs
  answering in voice from a ~40-intent hand-built miniature of the compiled
  lexicon; hidden per-person openness raised by person-directed curiosity
  (no meters shown); per-person authored deflections with a rotating
  true-leak channel (the stumble mechanism); buried aha-chain: Toku dates
  arrival the 14th · Matsuzō anchors Bon lanterns out the 13th · O-Yae knows
  Sōan burned a page · Sōan admits it was written the 10th · asking Sōan why
  the 10th precedes the 14th ⇒ "You were expected." DEV corner has a
  spoiler map for judging coverage after play.
- **10 further concepts offered** (each with UI + why-fun; full text in chat,
  develop on pick): 夢 Dreams (interactive dream vignettes recombining the
  day; carry one symbol out) · 仕草 Stakeout (full authored routines; be
  there, watch; deviations are the clues; watchers get noticed) · 写 The
  Copying (transcription job = fidelity choices; the house reacts to what
  circulates) · 供 The Offerings (wordless object-correspondence at
  significant places) · 咄 The Rumor (say things; claims propagate the
  social graph and return altered) · 絵 The Sketchbook (authored ink
  drawings per place×time×state; compare sketches to see change) · 間 The
  Silences (avoidance performed; record what was NOT said) · 暦 The Almanac
  (a working period calendar genuinely schedules the world; planning is the
  play) · 家訓 The Maxims (reconstruct the ur-text from each speaker's
  corrupted variant; recite it back) · 影 The Double (the house investigates
  you back; read your own evolving dossier).

## Round 3 (2026-07-09, later still) — Asking I fails inverse; the synthesis

- **Human verdict on The Asking (v1):** "no direction, no hints, no guidance,
  all the responses are vague… the book is just literally my vague questions
  and the vague responses. I don't get the point." The inverse failure of the
  kikigaki mock. **The two verdicts triangulate the design target: open input
  on the way in, earned-but-visible accumulation on the way out.** Checklist
  = too legible about METHOD; Asking v1 = illegible about PROGRESS. The
  player must never be told who to ask or what to type, but must SEE clues
  gathering under named open questions.
- Contributing mock-artifact flaw (honest note): a 40-intent miniature makes
  most natural questions hit fallback deflections → everything reads vague.
  A real lexicon is 30–50× denser; feel-tests must be tuned generous.
- **Asking II built** (same file/artifact, v2): free-text in, but authored
  answers now LATCH distilled clue-lines (MC's hand + source) into a
  always-visible book pane of named open questions (the kikigaki "book"
  idiom the human liked); "the book takes a line" gold moment in the
  conversation; thread states open/✒answered; one seeded open question so
  the book is never blank; gates loosened (one personal question opens
  Matsuzō); clue counter in the header. Direction comes from QUESTION
  titles, never methods.

## Round 4 (2026-07-09) — the zoom-out: all 10 were twigs

- **Human verdicts on the 10:** Dreams "cool thing but what's the point" ·
  Stakeout "not really, and hard vs the auto-grinding idle clock" · Copying
  "wtf why would copying be fun" · Offerings "fun little novel thing but how
  does it touch the 50 novels" · Rumor "very subtle and difficult" ·
  Sketchbook "way too hard to draw/render" · Silences "no thanks, a nuance" ·
  **Almanac "could be good, could be fun"** · Maxims "not a description of
  fun" · **Double "novel and fun, but incredibly dynamic and challenging."**
- **The meta-verdict (the real one):** "these are all 10 small boy ideas
  again… we are 5 layers deep into the tree. See the forest through the
  trees — what are we even doing here." The 10 don't answer the ORIGINAL
  prompt's spirit (frontier-model-scale work), they answer layer-5's prompt
  (widget mechanics for a parked feature's tab).
- **Diagnosis banked:** the depth bet is NOT a UI feature and cannot be
  validated by mock fragments — a 40-intent doorknob can't prove a cathedral.
  Depth is a property of the WORLD; the interface is the game the player
  already has; the deliverable that makes it real is the CANON'S HIDDEN
  LAYER — the underside of the story bible (what is true beneath every
  surface, who knows what, where it leaks) — authored at scale,
  kernel-consistent, gate-checked. Form follows material; UI iteration
  before the material exists is doorknob-polishing (this evening proved the
  plan's own PARKED sequencing right).

## Round 5 (2026-07-09) — 10 ZOOMED-OUT prototype ideas (human: "not underside
yet; prototypes serve a purpose; give me 10 way-zoomed-out prototype ideas")

Each is a buildable standalone prototype that tests a TOP-of-tree hypothesis,
not an interaction atom (full text in chat):

1. **The Chapel** — one scene (the weir at dawn) authored to REAL bottom
   (~1,500 nodes, 5+ layers everywhere) — the honest material test.
2. **Knowledge Is the Economy** — clues/insights ARE the incremental resource
   (knowing compounds, insights are multipliers) — tests the genre marriage.
3. **The Interleave Week** — accelerated week of auto-playing idle T0 with
   depth leaking through its normal surfaces — tests attention/pacing.
4. **The Decade Machine** — seasons/years per session; people age and die;
   knowledge outlives its sources — tests TIME as the depth axis.
5. **The Concept Album** — T0→T5 in ~30 min, one compressed scene per tier —
   tests the macro shape (quiet ascent + kamikakushi) before anything else.
6. **The Ending First** — build the LAST hour (T5, truth available, final
   choice) — judge the destination before authoring 50 novels of road.
7. **The Second Playthrough** — NG+ mock: start holding three late truths;
   do early scenes re-read electric? — tests "every line load-bearing."
8. **The Inexhaustible Square** — one square, ~5,000 authored state-true
   lines, never repeats — tests the only-Fable inexhaustibility claim alone.
9. **The Stranger's First Hour** — title → cold open → hour one, judged as a
   stranger would — tests "would anyone play" (the ship-swing as prototype).
10. **The Studio Inversion Pilot** — process prototype: one intent page →
    overnight autonomous run → playable build + 15-min review ritual —
    tests the "agent as studio" swing on this repo.

## Round 6 (2026-07-09) — the blessed one-paragraph spirit + 10 genre-native UI concepts

- Round-5's "zoomed-out prototypes" all rejected ("I asked for fucking UI
  prototypes"). Human asked for the spirit compressed to ONE paragraph, then
  10 UI concepts **from the whole idle/incremental genre vocabulary — no
  1780-Japan diegetic pigeonholing**, mix-&-match encouraged.
- The paragraph (as offered; awaiting explicit edits): the game stays the
  existing idle RPG; a massive authored consistent hidden truth-layer is
  baked in (static, gated, no runtime AI); the UI problem is a bolt-on
  component that makes digging FUN with the tested constraints — never show
  method · always show progress · cost = thought + idle currencies ·
  stumble-able · open-ended · knowledge bites back into the economy.
- The 10 genre-native concepts (full text in chat): 1 Constellation Chart
  (self-drawing truth skill-tree) · 2 Combination Bench (Cultist-Simulator
  card slots) · 3 Sticker Album (??? silhouette sets + set bonuses) ·
  4 Rumor Gacha (location-flavored pulls, rarities, pity) · 5 Excavation
  Grid (minesweeper-ish dig, partial text reveals) · 6 Retainer Dispatch
  (send befriended NPCs on timed investigations) · 7 Murder Board (drag +
  string; right theories "settle" overnight) · 8 Confrontation Bosses
  (Ace-Attorney argument battles spending clue cards) · 9 Idle Scholar
  (research queue that extrapolates from fed clues) · 10 Prestige Retelling
  (knowledge persists through rebirth and rewrites the early run).

## Round 7 (2026-07-09) — Round-6 verdicts → feel-test IV: The Album

- **Human verdicts on the 10 genre-native concepts:** Constellation "messy,
  way too intense, overwhelming at real clue counts" · Combination bench "just
  don't feel like cards/merging" · **Sticker album YES** ("set completion is
  not a bad idea… especially standalone, the whole filling out and unlocking
  end to end") · Gacha no, **but the underlying loop YES** ("idling earns a
  soft currency you spend on the knowledge/clue/question book — a good
  bolt-on interaction") · Excavation grid "too far from the game" · Dispatch
  not for questions, **but estate-worker dispatch at T2+ is a game idea →
  parked** · Murder board "not a fit" · Confrontation boss "could work but
  really hard" · **Idle Scholar "has potential"** · Prestige "hard, skip."
- **The synthesis (agent read, human asked us to choose):** the three yeses
  are ONE economy — idle earns attention → spend on the album → the Scholar
  automates → sets complete → permanent buffs feed the idle loop. Built as
  **feel-test IV: `project/prototypes/the-album/`** — live idle strip (rice/
  coin/attention with visible rates), 4 open sets + 2 gated teasers,
  common/rare/gold silhouette slots (人場物日 glyphs), "Listen 聞 <cost>"
  with rising per-set costs, scholar-only slots ("won't come by listening"),
  one assignable Scholar with progress bar, revelation modal + permanent
  buff per set, ×2-everything finale ("Expected").

## Outcome (2026-07-09 — session close)

Promoted: the whole grill distilled into
[`docs/plans/t0/fable-2026-07-09-authored-depth-demo.md`](../../docs/plans/t0/fable-2026-07-09-authored-depth-demo.md)
— **Plan K, 🧊 PARKED**, written to Sonnet-5-buildable detail (D8): depth
contract §3, core model §4, `threads.md` grammar §5, `verify-threads` gate §6,
kikigaki tab §7, milestones K0–K6, draft ADRs §10. Nothing landed as canon
(D5): storywave + the current build stay canon; sequenced after v0.4.0;
un-park is the human's move. Reading-queue entry added in the same commit.

---
name: kami-research-frontier
description: The kami-kakushi research frontier — the genuinely open, hard
  problems (fun certification, graphics/art direction under CSS-only Andon
  Steel, authored narrative depth at T1+), the process assets worth writing
  up (shared-tree multi-agent protocol, the gate lattice, sim-prices-design,
  the narrative-gen pipeline, the capture→drain loop), the evidence bar any
  claim must clear, and the no-oversell positioning rules. Load when
  choosing what ambitious work to pick up next, when the human asks "what's
  actually hard here / what's novel here / what should we research", when a
  session is about to claim something is "novel", "state of the art",
  "solved", or "publishable", when writing a retro/write-up/positioning doc
  about this repo's methods, when proposing an experiment or a new
  measurement, or when deciding whether an idea is a frontier bet vs
  routine work. Fires on "frontier", "research", "what's hard", "is this
  novel", "write this up", "what would impress", "next big bet".
---

# The research frontier

What is genuinely OPEN and hard in this project, what assets the repo
already holds against each problem, and the evidence bar a claim must
clear before anyone states it. Priority is the human's, verbatim
(2026-07-18): **game first — fun, and "GRAPHICS GRAPHICS GRAPHICS, ART,
DIRECTION, ETC. UI POLISH, HUD POLISH"** — process assets are secondary.
(The quote awaits its committed feedback-human/ADR record — see
kami-cohesion-campaign's Provenance for the record obligation.)
The costliest historical failure class here is slop/taste, so every
frontier bet below is shaped to prevent it, not just to ship.

Glossary for every term of art (rung, blind pass, golden pin, HR/HD,
fingerprint, Andon Steel, …): the `kami-domain-reference` skill.

## §1 · Game frontier (primary)

Each entry: why generic approaches fail → the asset this repo holds →
first concrete steps in-repo → the falsifiable "you have a result when".
An entry is a BET, not a promise — none of these is solved (PH3).

### F-G1 — The fun-certification problem

**The problem.** PH5: fun is a hypothesis tested by play; "proxies prove
its absence, only a human certifies its presence" (AGENTS.md:45).
**HR-1 is OPEN** — the whole-arc R0→R7 fun/pacing/look verdict on live
v0.4.0 (`project/human-in-the-loop/review.md:39`) — and T1 implicitly
waits on it. The human is the scarce resource: one reviewer, async,
~27 open HR items at authoring (derive the live count:
`bash src/scripts/session-brief.sh`). The open question: how much
of the fun verdict can be
*narrowed* (never replaced) by machine evidence, so a human session
spends its minutes on the residue only?

**Why SOTA fails.** Generic playtest automation measures completion and
error rates, which certify function, not fun; LLM-judge "fun scores"
are taste-slop generators — unfalsifiable, uncalibrated, and exactly
the failure class this repo pays most for. Any proxy that claims to
prove fun's *presence* contradicts PH5 and is wrong by construction.

**The asset.** A three-instrument battery no generic project has:
- `playcheck` (verify gate, `src/playcheck.ts`) — the fun-factor §3
  proxies nothing else measures: first-action hook wall-ms + max
  dead-time, ratchet-gated vs a blessed baseline. Caution: its header
  comment still says T0 band "[3,22]" — stale; the signed band is
  `T0_PACING_BAND_MIN=3`/`MAX=28`
  (`src/core/content/balance.ts:100,108`, re-signed via ADR-197).
  Read balance.ts, not comments.
- The balance sim (`src/scripts/balance-sim.ts`) — persona bots over
  the real engine, per-rung wall-time medians vs human-signed bands.
- FB-8 attended-time telemetry (`project/telemetry/`, git-ignored) —
  the human's real sessions; compared against sim, never gating.

**First steps.**
1. Read `docs/living/fun-factor.md` §3 (measurement) + §7 (per-tier
   watch-points) and the HR-1 item itself; list which HR-1 sub-questions
   are already answered by a green proxy and which are proxy-blind
   (e.g. "does the cold open hook" has a playcheck number; "does it
   feel earned" has none).
2. When untainted `project/telemetry/` reports exist, quote
   attended-vs-sim per rung (the qa-playtesting.md §2 step-0 flow) and
   distill the divergences into a committed note — divergence between
   bot-time and human-time is the fun signal proxies can carry.
3. Draft (as a `docs/plans/` plan, via `write-plan`) an "HR-1 evidence
   pack": one page the human reads before playing, listing what is
   machine-green, what moved since her last session, and the 3–5
   residual questions only play can answer.

**You have a result when** the human signs an HR-1-class whole-arc call
with measurably fewer live sessions than the T0 baseline needed — and
no post-sign fun regression surfaces in the next drain. Until then this
is an open problem; never report it as progress on "automated fun".

### F-G2 — Graphics & art direction under CSS-only Andon Steel

**The problem.** Make the game LOOK intentional — art direction, UI
polish, HUD polish — with a hard constraint set: no asset pipeline,
text + emoji + CSS + inline SVG only, no webfonts (ADR-127 lock).

Visual canon is **Andon Steel** — ADR-127, human-locked 2026-07-04;
`docs/living/ui-design.md` is authoritative ("the woodblock grain
died with ADR-127", ui-design.md §9 area). The woodblock bible is
git history; AGENTS.md was synced 2026-07-18 (correction owner:
kami-domain-reference §5).

**Why SOTA fails.** Generic generative approaches produce slop by
default: default gradients, glass/glow, rounded card-grids — the exact
banned list in ui-design.md §9 ("The anti-slop rules", :348). The
repo's own meta-rule names the mechanism: *strong opinionated
constraints read as intentional; defaults read as generated*. An agent
asked to "make it prettier" with no constraint system regresses to the
training-data mean, which is the slop-cannon the human called out
(2026-07-18) as this project's costliest failure.

**The asset.** A working anti-slop production system:
- The anti-slop thesis, four rules (`docs/living/graphics-concepts.md`
  §"The anti-slop thesis"): drawn by code from data · a period document
  genre supplies the constraint · spec-first → golden pin → blind pass ·
  the fiction owns the document (TST3). Plus the placement law (human
  redline, 2026-07-08): a concept with no named UI home is not built.
- Measurement that can go RED: the blind pass (cold-reader description
  judged vs map-spec's rubric) and the two-pass `taste-scorecard`
  (FB-10/ADR-135). Diverge machinery (ADR-075/ADR-139) makes taste an
  A/B the human can override, not a single roll of the dice.
- A triaged, human-verdicted concept slate in
  `docs/living/graphics-concepts.md` — and as of 2026-07-18 the human
  PULLED FOUR FORWARD as 📋 PROPOSED plans in `docs/plans/`:
  `fable-2026-07-18-estate-sheet-craft-pass.md` ·
  `-stamp-book-resume.md` · `-bestiary-plates.md` ·
  `-pictogram-ab.md` (all Status-checked 2026-07-18). This frontier is
  ACTIVE, not parked.

**First steps.**
1. Read `docs/living/ui-design.md` in full (the binding doc) +
   `graphics-concepts.md`; then read the four 07-18 plans' Status
   lines — they, not this skill, say what is startable today.
2. Execute through the campaign, not ad-hoc: the
   `kami-cohesion-campaign` skill owns the decision-gated execution
   shape (every element must serve a game AND story AND fun purpose).
   This skill only frames the research question.
3. For any new concept: anti-slop thesis first, placement law second,
   spec → HR read → build → blind pass, per the slate's own precedent
   (the estate cutaway ran exactly this and still got "needs more
   work" — the pipeline surfacing that verdict cheaply IS the asset).

**You have a result when** blind-pass verdicts and taste-scorecard
passes trend green across concepts AND the human's KEEP rate on
graphics HR items rises above the 07-08 slate baseline (1 "yeah good" /
1 "needs more work" / 1 "park" of 3 built demos, per the slate table).
Human KEEP is the only terminal metric; a scorecard green with a human
"slop" verdict is a FAIL of the scorecard, and gets recorded as such.

### F-G3 — Authored narrative depth at T1+ (the kikigaki bet)

**The problem.** T1 binds the ≥30-min/rung floor for the first time
(`RUNG_WALL_FLOOR_MIN=30`, balance.ts:95; T0 exempt). The fun risk is
that the floor reads as stall, not depth (fun-factor.md §7). The
candidate answer is the identity bet: authored investigation depth —
**Plan K**, the kikigaki (聞書, "listening-record") demo,
`docs/plans/t1/fable-2026-07-09-authored-depth-demo.md` ("the candidate
identity bet (D1, **not locked**)" — plan's own words; do not treat it
as decided).

**Why SOTA fails.** Procedural/LLM-generated narrative filler is the
canonical idle-game answer to long rungs and it is slop by this repo's
kernel: every UI surface must exist in-fiction (kernel #6), every
vanishing has a mundane cause (kernel #1), and prose law caps register
and voice (story-bible 01-laws). Generated filler can't hold those
invariants; authored depth is expensive; the open question is whether
the narrative-gen pipeline (F-P4 below) makes authored depth CHEAP
enough per rung to carry T1–T3.

**First steps.** (1) Read Plan K + `docs/plans/t1/` siblings — this is
parked-until-T1; do not start it before HR-1/T0 closes. (2) Any
authored content goes through `narrative-diverge` (ADR-139, 3+ blind
takes) — never single-draft. (3) The talk-system `## ask` grammar
(FB-415 plan, step 2) is the live pathfinder for "cheap authored
units"; watch its cost-per-line before sizing T1.

**You have a result when** a T1 rung holds the ≥30-min floor with the
human's pacing verdict "depth, not stall" — a verdict only an HR item
can deliver.

## §2 · Process assets (secondary — write-up-able, not build-first)

These are working, gate-enforced systems that are genuinely unusual.
They are assets to MAINTAIN and, when asked, write up — not open
problems. Each is owned in depth by a sibling skill; this table is the
frontier framing only. Per §5, "unusual" is an in-repo observation,
NOT an earned novelty claim: everything here is validated in one repo
with one human, and no external comparison exists.

| Asset | What's unusual here (in-repo evidence) | Depth owner |
|---|---|---|
| Shared-tree multi-agent protocol | N agents, ONE checkout, no default worktrees — built from a MEASURED baseline: 72/548 sessions (13%) hit a hard git collision, push rejects the biggest bucket at 218 (`docs/living/decisions/150.md:1758`; `src/scripts/push-main.sh:4`) → ADR-196/ADR-199 machinery (tree-claim mutexes, pathspec-only commits, guard hooks, sweep ledger, `docs/guides/shared-tree-git.md`) | kami-change-control, kami-build-and-env |
| The gate lattice | 21 parallel verify gates (`grep -c "name: '" src/scripts/gates.ts` → 21; never hand-type the count) under a 5s-soft/8s-HARD budget (ADR-176), with novel gate species: `deferred-work`, `review-link`, `milestone-integrity`, `inbox-ledger` | kami-verify-gates |
| Sim-prices-design | Balance changes get a machine verdict (ADR-132): fingerprinted regenerated report + `balance-sim --summary` in the commit body; design forks priced in sim-minutes — HD-40 is the exemplar, held on a sim price and re-opened when the ground moved (`project/human-in-the-loop/decisions.md:44`) | kami-balance-analysis-toolkit |
| Narrative-gen pipeline + derived log | Prose-first .md → byte-compared `*.gen.ts`; save stores facts, log is a derived view addressed by name (ADR-186, decisions/150.md:1118); DEV take-flip re-renders everything incl. logged lines (ADR-198, 150.md:1826) | kami-narrative-grammar, kami-save-and-schema |
| Capture→drain loop | In-game pick-mode capture → deterministic save sidecar → `/drain-inbox` → FB-nn → plan. FB-415 traversed the FULL pipeline (capture 07-13 → drain 07-17 → grill → template-gated plan → build) with every artifact on disk — a complete auditable feedback-to-build trace | drain-inbox skill, kami-change-control |

Write-up rule: any external-facing description of these MUST cite the
in-repo artifacts (ADR + measurement + guide) and carry the caveat that
they are validated in ONE repo with ONE human — see §5.

## §3 · The evidence bar (methodology for any claim)

Before stating a research-grade claim in any doc, clear all four:

1. **Predict the numbers BEFORE running.** State the hypothesis and the
   expected values first — the repo's instruments are built for this:
   the sim's input fingerprint REDs an unregenerated report
   (`balance-sim --check-fresh`), playcheck ratchets vs a blessed
   baseline, and the taste standard itself was built prediction-tested
   (`distill-taste` SKILL.md, "Prediction test"). A number explained
   only after the run is a story, not evidence.
2. **One mechanism must explain ALL observations, including the
   negatives.** If your explanation covers the green runs but not the
   red seed, it is not the mechanism. Where a doc and the build
   disagree, the build wins (PH2).
3. **Adversarial refutation before belief.** The `battery` skill is the
   standing instrument — cheap modes (diff re-audit, mini battery) are
   self-invokable; run one on any claim you are about to write down as
   settled. A claim that has never faced fresh eyes is a draft.
4. **Could it have gone RED?** (PH3 / the ambient test rule.) A check
   or proxy that cannot fail is not evidence; a false green is worse
   than no check.

## §4 · The idea lifecycle (frontier ideas are not exempt)

Every frontier idea moves through the standard homes — an idea living
only in chat does not exist (AGENTS.md, "Durable by default"):

1. **Brainstorm** → `project/brainstorms/` (via `grill-me` when the
   human is in the loop); raw Workflow output snapshots via
   `src/scripts/snapshot-research.sh` (git-ignored, local-only —
   distilled markdown is the durable tier).
2. **Plan** → `docs/plans/` via the `write-plan` skill (the
   `verify-plan-template` pre-commit gate hard-blocks a malformed new
   plan; new plans join the human's reading queue in the same commit).
3. **Build** → under change control (`kami-change-control` owns the
   routing table); UI ideas through `diverge`, story through
   `narrative-diverge`, graphics through the campaign.
4. **Verdict** → HR/HD item; a locked call becomes an ADR
   (numbers via `tsx src/scripts/tree-claim.ts adr`).
5. **Retirement is documented, never silent** → done plans graduate to
   `project/archive/`; deliberately-parked ideas to `project/BACKLOG.md`
   (never nagged) or a register like `graphics-concepts.md` with the
   human's verbatim verdict kept ("PARK", "ruled OUT"). A killed idea
   with its why on disk is a result; a vanished idea is a loss.

## §5 · Positioning — the no-oversell rules

- **Never claim novelty or SOTA in-repo (or out) without the matching
  falsifiable milestone met** (§1's "you have a result when" lines).
  Until then the honest labels are: open problem · candidate · bet ·
  working asset. PH3: done is earned, not declared — the same rule at
  research scale.
- **The lab notebook is the repo itself.** Reproducibility standard: a
  claim is positioned as reproducible only if its trail exists in
  `project/journal/` (how it happened) + the ADR log (why it was
  decided) + the committed artifacts (plans, reports, generated docs
  whose diffs are the before/after). This trail already exists for the
  §2 assets — cite it instead of re-narrating.
- **Scope caveat, always:** everything here is validated in one repo,
  one game, one human reviewer, one agent stack. Say so in any
  write-up. "Worked here" is the claim; "works" is not yet earned.
- **Fun claims are human-signed or they are absence claims.** A proxy
  may say "not fun yet" (RED); only a closed HR item may say "fun".
- **Never let a write-up route around change control** — a positioning
  doc that promises a capability creates a story promise (TST3-adjacent
  at project scale); promise only what is built and reachable (PH6).

## When NOT to use this skill

- Executing the graphics/cohesion work itself → `kami-cohesion-campaign`
  (owns the campaign); `diverge` / `taste-scorecard` /
  `frontend-design` for the build mechanics.
- Balance/sim mechanics, fingerprints, band law → 
  `kami-balance-analysis-toolkit`.
- What's RED right now / how to drive the game headlessly →
  `kami-debugging-playbook` (owns `window.__qa`).
- "May I change this / who signs off" → `kami-change-control`.
- Authoring the narrative content itself → `kami-narrative-grammar` +
  `narrative-diverge`.
- Running the adversarial audit → the `battery` skill directly.
- The glossary and game math behind any term above →
  `kami-domain-reference`.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (the four
graphics pull-forward plans + reading-script-interleave landed after
the 34661ae3 discovery snapshot). Priorities quoted from the human's
2026-07-18 Phase-1 answers (game first; graphics; slop the costliest
failure class). A co-agent's uncommitted FB-415 talk-system WIP was in
the working tree; all cited facts checked against committed canon.

Volatile facts — re-verify before relying:
- HR-1 still open:
  `grep -n "HR-1 🔲" project/human-in-the-loop/review.md`
- Active plan roster (graphics plans may have started/archived):
  `ls docs/plans/*.md` and read each Status line.
- Gate count: `grep -c "name: '" src/scripts/gates.ts`
  (21 at authoring).
- Pacing band: `grep -n "T0_PACING_BAND" src/core/content/balance.ts`
  (3/28 at authoring; human-signed, may be re-signed).
- Telemetry presence: `ls project/telemetry/`
  (git-ignored, may be empty).
- Open HR/HD counts: `bash src/scripts/session-brief.sh`.

# PRD on a diet: Brainstorm / Discovery Notes

Date: 2026-07-03 · Goal: decide how to shrink what must be hand-maintained /
hand-rippled in the PRD now that the build is the territory — walk the options
(locked-intent-only vs generated sections vs drift-detector vs frontier
compression), weigh pros/cons, and converge on concrete flows.

## Who executes this — Fable or Opus?

(The Q&A session itself is done — this routes the D-117 FOLLOW-UP work.)

- **The T0 compression sweep (the big one): Fable.** Compressing signed
  canon is judgment-dense editorial work — deciding intent vs detail,
  drafting acceptance criteria, preserving meaning while deleting most of
  the words. Errors are subtle (silent meaning-loss) and no gate catches
  them; the human approves the diff either way (Q3), but review is the
  bottleneck, so first-pass quality matters most exactly here.
- **The §4-freeze bookkeeping + gen-region plumbing: Opus 4.8.** Banner
  upkeep and marker machinery are mechanical — and the machinery IS the
  mechanical-checkpoint plan's Phase 1, itself Opus-buildable.
- **The 2 open-flag defaults:** nobody builds those — human overrides (or
  silence adopts the defaults).

## Summary / key decisions

_(running synthesis — updated as answers land)_

- **Q1 settled:** the PRD's primary job is the **forward spec of the
  unbuilt** (T1–T5, endgame). "Complete standalone what" (D-097's framing)
  drops to a secondary job — when the two conflict, forward-spec wins.
- **Q2 settled:** the diet shape is **F + C** — shipped-tier sections
  compress to intent + acceptance criteria + pointers; derivable facts
  become generated regions where build == end-state intent. Refines D-097
  (needs an ADR at promotion).
- **Q3 settled:** compression trigger = **the tier's taste sign-off
  closes** (not code-ship); the agent drafts the compressed diff, the
  **human approves** before it lands.
- **Q4 settled:** demoted detail is **archived verbatim** to
  `project/archive/` with a forward pointer; no new living docs created.
- **Q5 settled (human overrode the recommendation):** interim rule =
  **freeze §4 balance ripple only**; system/narrative ripple continues
  until each tier's compression event. §4 gets a provisional banner.
- **Q6 settled:** compression unit = **one event per tier, surgical
  subsection edits across §2–§6**; future-extension prose stays full-fat.
- Claude's opening recommendation (pre-Q&A, to be tested): **F + C** —
  frontier compression (spec-ahead, compress-behind) plus generated fact
  regions where sound — with a narrow warn-rung drift lint (D) over the
  still-fat frontier sections. Options B and E judged too aggressive; A too
  weak. Hinges on Q1 (what the PRD is *for*).

## Grounding (read from the repo, 2026-07-03)

- PRD = `docs/living/prd.md` stub index (68 lines) + 7 section files under
  `docs/living/prd/` — `01-vision` 1,053 / `02-systems` 1,413 /
  `03-unlock-ladder` 862 / `04-combat-balance` 1,691 / `05-narrative` 1,188 /
  `06-tech-architecture` 902 / `07-roadmap-scope` 318 ≈ **7,500 lines**.
- **D-097** (human, 2026-07-01): PRD is a **standalone END-STATE v1.0.0
  spec** — the clean "what"; ADR log = "why"; roadmap = "how/when"; no inline
  ADR refs or build-nuance. Refines D-021 (freeze = locked intent; §4 balance
  + §7 detail stay provisional).
- **D-022**: the newest human steer supersedes any prior lock — this session
  CAN supersede/refine D-097 if the human so decides.
- The tax (from the 496-commit log analysis): recurring "ripple X to canon"
  commits daily Jun 29–Jul 2 (6-tier reshape, combat rework, koku tighten,
  spatial map, 1780 anchor, koku→coin/rice re-core Plan A, bidirectional
  reconcile passes); one failed monolithic PRD rewrite; 5 audit rounds. Every
  built-system change pays a second write into the PRD, and drift between
  ripples is policed by audits after the fact.
- Key asymmetry: for **built** systems the build + generated docs + ADRs are
  the better truth (R2: the build wins). For **unbuilt** tiers (T1–T5,
  endgame) the PRD is the **only** truth. The PRD's irreplaceable value is
  concentrated in the unbuilt.

## The options (walkthrough presented to the human)

- **A · Status quo + batched ripples.** Keep D-097 fully; ripple at
  milestones instead of per-change. Pros: zero migration; keeps the complete
  spec. Cons: tax deferred, not removed; PRD is false canon between batches;
  big-batch rewrites are exactly what failed once already (V2 attempt 1).
- **B · Deep diet — locked-intent-only.** PRD shrinks to §1 vision +
  acceptance criteria + tier promises; §2–§6 detail demoted to per-concern
  living docs / ADRs; §4 numbers generated; §7 ceded to roadmap.md. Pros: tax
  collapses; the contract stays crisp. Cons: supersedes D-097's "complete
  standalone spec" two days after the human locked it; unbuilt-system design
  detail needs a new home; biggest migration; batteries lose their fidelity
  baseline.
- **C · Generated fact regions.** Keep the shape; derivable facts (rosters,
  tables, numbers, names — some already generated into `docs/content/`)
  become fenced gen-regions inside PRD sections (same marker + `--check`
  machinery the 2026-07-03 mechanical-checkpoint plan proposes). Pros: those
  chunks become drift-proof; composes with any other option. Cons: covers
  facts, not semantic prose; **end-state vs build mismatch** — generated
  facts describe v0.3.x, the PRD describes v1.0.0, so only transclude where
  build == end-state intent (e.g. current-tier balance, explicitly
  provisional per D-021).
- **D · Drift-detector.** Keep hand-written; a checker diffs generated game
  facts vs PRD claims and auto-files the ripple punch-list. Pros: no
  restructure; converts hand-sweeps into a generated list. Cons: unsound on
  prose → partial coverage → false-confidence risk (R3); the tax remains,
  merely scheduled; an end-state spec EXPECTS to differ from the build on
  unbuilt features, so the detector must know the frontier or it cries wolf.
- **E · Retire / invert.** PRD frozen as a historical vision artifact; canon
  = ADRs + living docs + generated content + acceptance criteria. Pros: zero
  ripple forever. Cons: loses the forward spec for unbuilt tiers — the PRD's
  core remaining value; directly contradicts the fresh D-097. Included for
  completeness; recommended against.
- **F · Frontier PRD — spec-ahead, compress-behind.** Full end-state detail
  for UNBUILT territory; once a tier ships and survives playtest, its section
  content compresses to intent + acceptance criteria + pointers to where
  truth now lives (code, generated docs, ADRs, living docs). Ripple becomes a
  once-per-tier compression event, not a per-change tax. Pros: kills the tax
  where it bites (built systems churn daily under playtest); preserves
  forward-design value; compatible with D-021; mostly compatible with D-097
  (still end-state, still standalone — thinner behind the frontier). Cons:
  shipped-tier detail moves out of the PRD (weakens "complete v1.0.0 what"
  for shipped areas); needs a crisp compression ritual + sign-off.

## Flows to figure out (session targets)

1. **Design-change flow (built system):** what gets written where when e.g.
   the economy re-cores again — and when the PRD is/isn't touched.
2. **Tier-ship compression flow (if F):** trigger, sign-off, what survives in
   the compressed section.
3. **Onboarding flow:** what a fresh agent reads, in what order.
4. **Audit/battery fidelity flow:** fidelity against WHAT baseline, per
   territory (built vs frontier).
5. **§4 balance interplay:** how the balance-sim plan's generated pacing
   reports relate to §4's provisional numbers.

## Flows — derived from the locked decisions (Q1–Q6)

### Flow 1 · Day-to-day design change (pre-compression era)

- **Balance-number change** (constants, thresholds, prices, curves): code +
  tests (+ pacing report per the balance-sim plan). **NO §4 edit** — §4
  carries the frozen-provisional banner (Q5). ADR only when the change is a
  design-level re-derivation, not a tuning nudge.
- **System / narrative change in BUILT territory:** code + ADR (the why) +
  PRD ripple **continues** (Q5 status quo) — until that tier's compression
  event retires the ripple for its slices.
- **Intent-level change** (changes what the game IS): human decision → ADR
  + PRD §1 / acceptance criteria. Never autonomous.
- **Frontier (unbuilt) design change:** edit the fat frontier sections
  directly — that's where forward design lives (Q1); full detail welcome.

### Flow 2 · The compression event (once per tier)

1. **Trigger:** the tier's human taste review (R-item) closes (Q3).
2. **Agent drafts** the tier sweep (Q6): surgical subsection edits across
   §2–§6 — each compressed slice becomes intent summary + acceptance
   criteria + pointers (code, generated `docs/content/` tables, ADRs);
   the pre-compression text goes **verbatim** to
   `project/archive/<date>-prd-t<N>-precompression.md` (Q4); gen-regions
   (markers + `--check`, reusing the mechanical-checkpoint machinery) are
   inserted where build == end-state intent (Q2's C half).
3. **Review:** the sweep is filed as a `docs/plans/` reel-back + R-item;
   the **human approves the diff** before it lands (Q3).
4. **Lands as one commit**; the tier's §4 banner slice is superseded by
   pointers; from then on, per-change ripple is retired for the compressed
   slices.

### Flow 3 · Cold-agent onboarding (post-diet read order)

1. PRD stub index (its "How to read" gains a frontier note) → §1 vision
   (always current, always fat).
2. Built territory: compressed intent + acceptance criteria + follow the
   pointers (code, `docs/content/`, ADRs).
3. Frontier: the fat sections — read as the forward spec.
4. Where the frontier IS: `docs/living/roadmap.md` +
   `project/status/project-status.md`.

### Flow 4 · Audit/battery baseline (PROPOSED DEFAULT — pending Q7)

- **Frontier build work:** fidelity audits diff the build against the fat
  frontier sections (unchanged from today).
- **Compressed territory:** fidelity = acceptance criteria + ADRs +
  generated docs; the build is the truth of detail (R2). Batteries stop
  flagging "PRD lacks detail X" for compressed slices — that's by design,
  not drift.

### Proposed default (pending Q7): §6 tech-architecture

§6 describes the build — it is effectively behind the frontier already.
Default: fold §6 into the **T0 compression sweep** (don't special-case an
earlier solo compression).

## Q&A log

### Q1 — the PRD's primary job
- Asked: six months from now, what is the PRD's PRIMARY job (the one that
  wins when jobs conflict)? Offered: forward spec of the unbuilt /
  complete standalone "what" (D-097 as locked) / intent contract (deep
  diet) / audit baseline.
- Captured: **Forward spec of the unbuilt** (human picked the recommended
  option). T1–T5 + endgame design lives nowhere else; the build can't be
  the truth for what doesn't exist yet. The other jobs remain secondary.
- Implication: points at the frontier model (F) — full detail ahead of the
  frontier, thinner behind it. The D-097 "complete standalone what" reading
  is now explicitly SECONDARY to the forward-spec job.
- Flags: none.

### Q2 — the diet shape (the D-097 refinement)
- Asked: what happens to a PRD section once its tier is BUILT and
  playtest-settled? Offered: F+C compress-behind + gen-regions / F only /
  no compression (C+D tooling) / deep diet B now.
- Captured: **F + C** (human picked the recommended option). Shipped-tier
  sections compress to intent + acceptance criteria + pointers, once per
  tier at ship; where build == end-state intent, derivable facts become
  generated regions reusing the mechanical-checkpoint plan's gen-region +
  `--check` machinery. Per-change ripple dies; the frontier stays full-fat.
- Implication: this REFINES D-097 (per D-022 the newest steer governs):
  the PRD remains standalone + end-state framed, but behind the frontier
  the "what" is intent-level with pointers, not full system detail. Needs
  an ADR when promoted.
- Flags: none.

### Q3 — compression trigger + sign-off
- Asked: WHEN does a tier's PRD section compress, and who signs it?
  (Cautionary tale surfaced: T0 "shipped" Jun 29 but its economy was fully
  re-cored Jul 2 — shipped ≠ settled.) Offered: taste-sign-off + human-
  approved diff / agent auto-compress at ship / lag one tier / on-demand.
- Captured: **trigger = the tier's human taste review closes (R1-style),
  NOT code-ship; the agent drafts the compressed section as a reviewable
  diff (docs/plans/ reel-back + R-item); the human approves before it
  lands.** Once per tier, so the ask is cheap; compressing signed canon
  stays a human call (R4).
- Consequence noted: T0's taste review (R1) is still OPEN today, so under
  this trigger nothing compresses yet → raises the interim-rule question
  (Q5).
- Flags: none.

### Q4 — where demoted detail lives
- Asked: WHERE does the fat text go on compression? Offered: archive /
  graduate to per-concern living docs / git-history-only.
- Captured: **archive the fat section** — the pre-compression text
  graduates verbatim to `project/archive/` with a forward pointer from the
  compressed section. Ongoing truth = code + generated `docs/content/` +
  ADRs + existing living docs. Zero new hand-maintained surface; honors
  the append-only "archive, don't remove" norm explicitly.
- Flags: none.

### Q5 — the interim rule (until the first compression)
- Asked: T0 won't compress until R1 closes, but built-T0 systems churn
  daily — keep hand-rippling into the PRD meanwhile? Offered: full ripple
  freeze now (Claude's recommendation) / status quo / freeze §4 only.
- Captured: **freeze §4 balance ripple ONLY** (human chose the narrow
  option, NOT the recommendation). Balance numbers stop rippling now
  (they're already "provisional" per D-021); system/narrative changes KEEP
  rippling per-change until T0's compression event. Smaller relief,
  smaller honesty gap — the human prefers the PRD stay current everywhere
  except the explicitly-provisional numbers.
- Implication: §4 gets a one-line provisional/frozen banner; the full
  ripple relief arrives per-tier, at each compression event.
- Flags: none.

### Q6 — compression granularity
- Asked: PRD sections are per-CONCERN; tiers cut across them — what's the
  compression unit? Offered: tier sweep w/ subsection surgery / whole
  sections only / restructure by tier.
- Captured: **one compression EVENT per tier, executed as surgical
  subsection edits across §2–§6** — §3's T0 rungs, §4's T0 tables, §5's
  T0 beats, §2's now-built system cores; future-extension prose in the
  same sections stays full-fat. One reviewable diff per tier.
- Flags: none.

## Parking lot (tangents / parallel threads)

- The `battery` skill's lens registry may want a frontier-aware fidelity
  lens once T0 compresses (audit compressed territory against acceptance
  criteria + ADRs, not detail-prose) — revisit at the first sweep.
- Sequencing: the mechanical-checkpoint plan's Phase 1 (gen-region markers +
  `--check`) is shared infrastructure for D-117's generated-facts half —
  build it first.

## Open flags (pending input)

_Claude-picked defaults (R4: acted on, surfaced for async override — the
human went to bed before these two were asked):_

- **Audit/battery baseline for COMPRESSED territory** — default adopted
  (Flow 4): acceptance criteria + ADRs + generated docs; batteries stop
  flagging missing detail-prose for compressed slices (that's the design,
  not drift). → human may override.
- **§6 tech-architecture** — default adopted: fold into the T0 compression
  sweep; no early solo compression. → human may override.

## Wrap-up (2026-07-03, autonomous)

Promoted: **ADR D-117** in `docs/living/decisions.md`; the §4 ripple-frozen
banner + the `prd.md` FRAMING-2 frontier note applied in the same commit.
This file + the three process plans queued in `project/todo-human.md`.
Pending: the 2 defaults above; the first compression sweep waits on R1.

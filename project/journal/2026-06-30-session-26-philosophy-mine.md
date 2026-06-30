# Session 26 — 2026-06-30 — repo-wide philosophy mine → register R1–R6

**Summary:** After landing D-080 (no-clock-no-shortcuts), the human asked "what
OTHER philosophies should we add?" (hint: "verify, don't trust"). Ran a 41-agent
`Workflow` mine of the whole repo (ADRs, human-feedback, HITL, 269 commits,
retros/audits, design docs) → 87 raw → 27 clustered + 4 critic-found → **30
adversarially-verified philosophies**. The human then steered the curation across
several rounds (unify + combine; philosophy = *how/why/what to reason*, so
mechanics / git / engineering were demoted to AGENTS.md and game-canon held in the
vision) down to a **6-philosophy register (R1–R6)**, phrases human-chosen — then
**landed** it (see the Landing section below).

## What changed
- `project/brainstorms/2026-06-30-operating-philosophies.md` — **new** proposal:
  the unified 10 (no-clock ✅ · verify-don't-trust · intent-is-canon ·
  human-steers/agent-executes · session-disposable/repo-is-memory · lean ·
  fun-is-the-bar · pure-core · make-quality-structural · diverge-before-converge)
  + a crosswalk mapping all 30 (nothing discarded) + game-design canon held out
  of the 10 (stays in the vision).
- `project/brainstorms/raw/2026-06-30-philosophies-mine.json` — **new**
  git-ignored verbatim workflow snapshot (223 KB; local-disk resume insurance).
- `project/todo-human.md` — reading-queue entry for the proposal.

## Next intended steps
1. Human picks which of the 10 to formalize as `docs/philosophy/*.md` (recommend
   #2 verify-don't-trust first — the explicitly-requested "second seed").
2. Land each blessed one: doc + ADR (D-081+) + a one-line link from the AGENTS.md
   `## Philosophy` lead. One verified commit each.

## Landmines
- **Editorial call to revisit with the human:** the 10 are *operating*
  philosophies only; game-design/world canon (earned-never-given, mundane-real,
  …) is preserved in the crosswalk but deliberately NOT in the 10 (it's already
  locked in PRD/fun-factor). If the human wants creative-law in the 10, re-pick.
- Flagged merges that may get split: #9 (enforcement-ladder + single-source) and
  #4 (5-member bundle).
- Proposal committed locally; **not pushed** (no checkpoint requested).

---

## Landing — the register (R1–R6) built

Curated 30 → **6** (R1 no-clock ✅ · R2 verify-don't-trust · R3
done-is-earned-not-declared · R4 bias-to-motion · R5 if-it-isn't-fun-it-isn't-
finished · R6 if-a-player-can't-reach-it-it-doesn't-exist). Human calls: one ADR
per philosophy; a README index; **a paragraph per philosophy in AGENTS.md** so
none gets lost (R6 applied to the philosophies themselves).

**Built:**
- `docs/philosophy/{verify-dont-trust, done-is-earned-not-declared, bias-to-
  motion, if-it-isnt-fun-it-isnt-finished, if-a-player-cant-reach-it-it-doesnt-
  exist}.md` (R2–R6) + `docs/philosophy/README.md` (the register index).
- ADRs **D-081–D-085** (one per philosophy) under a new group header in
  `decisions.md`.
- AGENTS.md `## Philosophy` rewritten into the R1–R6 register (a paragraph + link
  each) + 3 convention edits for demoted items: intent-is-canon &
  session-is-disposable/repo-is-memory in "How to work here"; "highest rung that
  can _soundly_ hold it — calibrated so a gate never cries wolf" in Conventions.

Demoted to AGENTS.md (not philosophy): intent-is-canon, repo-is-memory,
make-quality-structural, small-commits, good-citizen, pure-core, SSOT. Held out
(game-canon, stays in PRD / fun-factor): the 5 creative-law items.

## Landmines (landing)
- The proposal doc (`…operating-philosophies.md`) still carries the full 30 + the
  crosswalk — keep it as the provenance record; `docs/philosophy/README.md` is the
  live register.
- Landed locally; pushed at the session-26 exit checkpoint (below).

## Checkpoint (session-26 exit)
Live snapshot (`project/status/project-status.md`) brought current with the R1–R6
register. Pushing `main` — 3 commits: `9e6565d` (proposal), `edc1afc` (register),
`fc1dfc3` (queue cleanup); plus this checkpoint commit.

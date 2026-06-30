# Session 26 — 2026-06-30 — repo-wide philosophy mine → the unified 10

**Summary:** After landing D-080 (no-clock-no-shortcuts), the human asked "what
OTHER philosophies should we add?" (hint: "verify, don't trust"). Ran a 41-agent
`Workflow` mine of the whole repo (ADRs, human-feedback, HITL, 269 commits,
retros/audits, design docs) → 87 raw → 27 clustered + 4 critic-found → **30
adversarially-verified philosophies**. The human then steered: **unify + combine,
pick the 10 most important, throw nothing away.** Distilled the 30 into the
**unified 10 operating philosophies** + a full crosswalk + a preserved
game-canon appendix. Proposal awaiting the human's pick-which-to-formalize call.

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

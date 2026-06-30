# Human TODO — tasks + reading queue awaiting the human

> **Live queue.** Open items only — done items are removed (not struck); git history holds the
> record. This is **beyond** the action queue in
> [`project/human-in-the-loop/`](human-in-the-loop) (`H`-decisions + `R`-reviews): the **TODO**
> section holds loose human-owned tasks, the **Reading queue** holds docs awaiting your
> **"read & reviewed"** sign-off. Both are auto-surfaced at session start by
> [`src/scripts/session-brief.sh`](../src/scripts/session-brief.sh).

## TODO

- [ ] **Look at why the GitHub repo says `claude` is a committer** — investigate the commit
  authorship / `Co-Authored-By` trailer showing up as a committer on the remote, and decide
  whether/how to change it.
- [ ] **Consider removing the raw JSON dumps from git history** — the verbatim `Workflow`-output
  snapshots in [`project/brainstorms/raw/`](brainstorms/raw) bloat the repo; weigh a history
  rewrite (e.g. `git filter-repo`) vs. leaving them, given the shared-tree / remote constraints.
- [ ] **Look into best practices for commit messages** — review conventions (Conventional Commits,
  body/footer style, the `Co-Authored-By` trailer) and decide what to standardize on here.

## Reading queue

> Docs still awaiting your **"read & reviewed"** sign-off.

- [ ] **[`project/audit/reports/2026-06-29-v03-fidelity-battery.md`](audit/reports/2026-06-29-v03-fidelity-battery.md)** — *audit (v0.3 fidelity battery)*
  - The full 8-lens battery on the BUILT v0.3: faithful to locked intent (prd **9** /
    adr **8.5** / human-feedback **8**); gaps are 2 known-pending locked-ADR items, 2
    false-green test guards, and the moment-to-moment T0 fun/pacing. The 6 design/taste
    calls it surfaced are the **R4** queue in
    [`human-in-the-loop/review.md`](human-in-the-loop/review.md).
- [ ] **[`project/audit/reports/2026-06-30-v0.3-changelog.md`](audit/reports/2026-06-30-v0.3-changelog.md)** — *the v0.3 release summary (START HERE)*
  - A one-page, human-facing distillation of everything v0.3 adds over v0.2 (the macro
    spine that closes, combat re-baseline, the T0-M4 breadth, the M2·8 fork-retire) + how
    it was vetted (battery + adversarial re-audit + e2e proofs + prod-build check) +
    exactly what's left for you (R1/R4). The fastest way to orient before playtesting.

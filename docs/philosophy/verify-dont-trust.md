# Philosophy: verify, don't trust

> Operating-philosophy register **PH2**. See the [register](README.md); when a
> tactic elsewhere conflicts with this, this wins. The self-facing twin is **PH3 —
> [done is earned, not declared](done-is-earned-not-declared.md)**.

**A maker is blind to their own gaps, and you can't trust provenance you can't
see.** So existing files on disk, written canon, and work other agents did are
_checked, not trusted_ — against independent eyes, the gates, or reality. This is
about work you did **not** author (trusting your _own_ apparent success is PH3).

## The principles

- **Independent, adversarial eyes are the source of truth — not the builder's
  read.** A claim clears a fresh-eyes battery + convergence critic, the diverge
  variants the human picks among, the verify / pre-push gates, or reality at the
  playtest gate. Self-review is necessary, never sufficient.
- **The map is not the territory.** A doc, ADR, or label is a _claim_ about the
  running code, not proof of it; reconcile docs against the build continuously,
  and where they disagree the **build wins** (fix the stale doc).
- **Verify before you claim.** Never say _pushed / green / done_ about anything —
  yours or another agent's — without actually checking it.

## Why this exists

- The battery skill is built on it: _"agents cannot reliably grade their own
  output… there is no self-grading loop here"_ (`.claude/skills/battery/SKILL.md`).
- It is self-demonstrating: an independent 6-agent re-pass found **23 learnings
  the builder's own retro had missed** (commit `7ca6ac2`).
- **ADR-079**: a signed ADR (ADR-053) described the _opposite_ of what the code did,
  and it was resolved by fixing the doc to match the build — canon was a claim,
  the territory was the truth.

Canon: **ADR-081**. Part of the register seeded by **PH1** —
[no clock, no shortcuts](no-clock-no-shortcuts.md) (ADR-080).

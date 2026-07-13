# Session 195 — 2026-07-13 — the session queue reads at 72

**Summary:** The human asked which markdown files, beyond the
`decisions.md` that `c1ccf9b2` had just reflowed, are the ones *they
read by hand*. Answered with a survey, then reflowed the rest of the
session queue to the ~72-char norm — `review.md`, `BACKLOG.md`,
`archive.md`, and a full **rewrite** of `project-status.md` (which
could not be wrapped without displacing content, and whose
rewrite-debt was overdue). No ADRs. The remaining canon
(`docs/living/decisions.md`, the PRD sections) is **NOT** reflowed —
parked in [`BACKLOG.md`](../BACKLOG.md) with the tool that does it.

## What changed

- `project/human-in-the-loop/review.md` + `project/BACKLOG.md` —
  reflowed to 72 (`f8b53975`).
- `project/status/project-status.md` — **rewritten fresh** at 72,
  rewrite-debt `22/20` → `0/20` (`fb2da1d4`).
- `project/human-in-the-loop/archive.md` — header prose reflowed; the
  crosswalk table left alone (`959e23c6`).
- `src/scripts/reflow-md.py` — **new**: the content-preserving markdown
  reflow tool this session's work was done with.
- `project/BACKLOG.md` — parked the remaining-canon reflow.
- `project/todo-human.md` — reflowed but **deliberately left
  uncommitted** for `w1:p3` (see below).

## What happened

**The byte-vs-character trap.** The first survey I gave the human was
wrong: I counted line width with `awk`, which on macOS counts **bytes**.
This repo's prose is dense with em-dashes and CJK (3 bytes each), so
`review.md` read as 199 over-wide lines when the true character count
was **29** — of which 21 were headings that cannot wrap. AC-15 already
says *count by characters, not bytes*; I learned why the hard way, and
had to re-issue the numbers. The rule earns its place.

**The snapshot could not be reflowed — only rewritten.**
`project-status.md` sits pinned at its 120-line hard cap, and the same
prose wrapped at 72 lands at **142 lines**. There is no mechanical path:
buying the width means displacing content, which is exactly what a hard
budget is for. Its rewrite-debt was already `22/20` — the gate had been
asking for a fresh rewrite for a while — so that is what it got. Detail
went down to the canon that already owns it (the seven tier *names* to
the story bible, the `src/core` module list to `repo-map.md`, the
per-decision asides to their ADRs). Debt reset to `0/20`, which
`verify-doc-budgets.ts` explicitly sanctions when the date advances.

**I REDDED the tree for a few minutes.** My first splice script wrote
`project-status.md` to disk *before* its line-cap guard ran, leaving a
141-line file that hard-failed `doc-budgets` and blocked every agent's
push. `w3:p3` caught it and sent a redline; `w1:p3` was blocked behind
it. Fixed within minutes. The lesson is dull and real: **a script that
writes should not print its verdict after the write.** Guard first,
write second.

**Two stale facts fixed on the way past** (PH2 — the build wins):
the snapshot's "Next" list still sequenced `greeting-line-ids`, which
`8fffe8be` had shipped and archived; and an early draft of my rewrite
**resurrected HD-45**, which was closed this session (ADR-189) — I had
taken it from the session brief, which was stale by the time I read it.
`w3:p3` redlined that too. A brief is a snapshot, not a source of truth.

**Shared-tree traffic.** Three other agents were live. `todo-human.md`
turned out to hold `w1:p3`'s uncommitted HD-44 reading-queue entry,
paired with a plan file they had staged — so committing it would have
split their work from its plan. I left it dirty and told them it is
theirs to land; the reflow is content-preserving and the `## TODO`
section came out **byte-identical**, so the human-TODO gate will not
fire on them. `review.md` is now in their hands for the SV-tag
renumber their `adr190-nudge` bundle forces.

## Verification

Every reflow was proven content-preserving the way AC-15 asks: with
blockquote `>` prefixes stripped, the **token stream is identical**
before and after (9798 tokens in `review.md`, 721 in `BACKLOG.md`), and
every output is NUL-free. `review-link` stayed **green** across the
`review.md` reflow — the gate keys off `### HR-n` heading lines and
matches `**SV**n` tags anywhere in a section body, and a tag has no
space to wrap on.

## Next intended steps

- **The remaining canon is NOT reflowed** — `docs/living/decisions.md`
  (1838 real over-wide lines) and the PRD sections (~4300 between them)
  are the only big ones left. Parked in
  [`BACKLOG.md`](../BACKLOG.md); the tool is committed at
  `src/scripts/reflow-md.py`. The human was asked and had not answered
  when the session closed — it is their call, since it is a large diff
  across canon and wants a quiet tree.

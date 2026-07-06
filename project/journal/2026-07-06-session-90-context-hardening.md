# Session 90 — 2026-07-06 — context-hardening build (P1–P4)

## ☀️ SUMMARY (read this first)

The human read + locked the context-hardening plan
(`docs/plans/fable-2026-07-05-context-hardening.md`) via AskUserQuestion, then
green-lit the FULL build in this session (Fable, per the live model switch —
supersedes the plan's Opus routing for P1–P3). Key rescope: P4 cut 1 grew from
two relabels into a repo-wide single-letter-prefix sweep — taste values →
`TST1–TST4` (not the plan's `V#`), philosophies → `PH1–PH6`, everything else
ID-like moves to 2/3-letter prefixes EXCEPT rungs R0–R7 + tiers T0–T5 (the
game's fundamental levels stay single-letter). P3.2 cull nod given; P4 lands
all cuts as individual commits, human reviews diffs after.

This file is HISTORY, not live state — the snapshot is
`project/status/project-status.md`.

---

## 1 · Plan lock + queue clear (932c9b1)

Recorded the four AskUserQuestion calls into the plan (Status → LOCKED),
cleared its reading-queue entry (D-089 implicit sign-off), regenerated the
checkpoint gen-regions. Committed via pathspec — 4 other agents live on the
tree with their own staged work.

## 2 · P1 — wire the floor (hooksPath)

- `package.json` — new `"prepare": "git config core.hooksPath .githooks || true"`
  (npm runs `prepare` on every install → any clone that can build is gated).
- `src/scripts/session-brief.sh` — 🚨 UNGATED CLONE warn at the top of the
  brief when `core.hooksPath` ≠ `.githooks` (belt for clones that never ran
  `npm install`).

DoD proven both directions in a `tmp/p1-clone-sim` scratch clone (deleted
after): fresh clone → hooksPath UNSET + warn fires → `npm install` → hooksPath
`.githooks` + a journal-less commit is BLOCKED by pre-commit; then unset +
`npm pkg delete scripts.prepare` + reinstall → stays UNSET + warn fires (the
check bites). Wired main repo: warn count 0 (no false positive).

## Next intended steps (current)

1. P2 — `verify:tooling` meta-suite (nightly-only), five fixture-driven groups.
2. P3 — no-tree-mutation extension + delete `no-bulk-git-add` + micro-hygiene.
3. P4 cuts 1–4, one commit each (relabel sweep first, map in `tmp/`).

## Landmines (current)

- Shared tree is BUSY (4 other agents) — every commit via explicit pathspec;
  re-check `git diff --cached --name-only` before each.
- P3.3 (`settings.local.json` prune) is HUMAN-owned — do not edit; it was
  surfaced as a reminder.
- The other s89 journal (telemetry-e2e-leak) belongs to w6:p1 — never touch.

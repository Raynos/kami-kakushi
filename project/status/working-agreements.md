---
name: working-agreements
description: How to work on this repo — cadence, autonomy, the commit/journal gate
metadata:
  type: feedback
---

# Working agreements

**Cadence.** Many small commits. Journal each session in [`../journal/`](../journal)
(summary at top, **append at bottom, never prepend**); live state → [`project-status.md`](project-status.md);
durable design → [`../../docs/`](../../docs) (edited in place); ADRs → [`decisions.md`](../../docs/living/decisions.md);
per-fact memory here.

**Commit gate.** Keep the build working; stage a `journal/` change every commit and gate on `npm run verify`
(both enforced by `.githooks/pre-commit`; `SKIP_JOURNAL=1` for trivial commits). The gate roster is owned by
[`verify-run.ts`](../../src/scripts/verify-run.ts) — single source, **11 gates** — so it can't drift here.

**Autonomy.** Pick next → build → verify → commit → journal → repeat. Stop and ask only for (1) decisions that
change what the game *is*, and (2) outward-facing / irreversible actions (deploy, delete, force-push). **Routine
`git push origin main` is standing-approved as part of a checkpoint**, not a per-push ask.

**Loop done-rule (D-087).** In a long `/loop`, when high-value work runs dry, keep finding work rather than
idling — but **flag low-value ticks honestly** (never dress busy-work up as high-value — R3).

**Re-audit the diff before "done" (P1).** After a locked ADR or big refactor, re-pass **just the diff** on the
*current* build (the `battery` skill's diff re-audit, ~3 lenses) — check the delta, not the milestone; if it
touched an approved design/balance pick, flag + offer to revert (P2).

## Checkpoint (run when asked to "checkpoint" or before exiting)

1. **Commit** your own files by explicit path (`git add path/…`, never `-A` / `-a`).
2. **Journal** — stage a `journal/` entry (pre-commit requires it).
3. **Snapshot** — bring [`project-status.md`](project-status.md) current (it, not the journal, is the resume point).
4. **Reading queue (D-089)** — clear from [`../todo-human.md`](../todo-human.md) only docs the human engaged
   *this session* (sign-off is implicit; the agent owns cleanup). **Don't over-ask:** an untouched doc stays —
   never `AskUserQuestion` about a doc the session never mentioned; if none were engaged, ask nothing and just report.
5. **Push** `git push origin main` — fires the pre-push gate (`verify`, blocks red). Green `origin/main` is the proof.
6. **Confirm** — `git status` clean, `git log origin/main..main` empty (or note what's left + why).

Four rules, learned the hard way:
- **Never kill running subagents/workflows to exit.** A checkpoint resumes *committed* state; it doesn't tear
  down live work (results notify the loop when done). Leave it running (note it in-flight); `TaskStop` only if
  the user asks (`resumeFromRunId` returns completed agents cached).
- **Verify before you claim.** Never say *pushed / green / done* without checking (`git status`, the push
  succeeding, `git log origin/main..main`).
- **Shared-tree safety** (>1 agent may edit at once). **Never** `stash` / `checkout` / `restore` / `-A` / `-a`
  or otherwise touch files you didn't author; commit your own by explicit path.
- **Don't fight someone else's red.** Another agent's in-flight red WIP will (correctly) block your push —
  leave your commit local, note it, never `SKIP_VERIFY=1` a red tree onto `main`. (`SKIP_VERIFY=1` is only for
  *committing* your own isolated docs/hooks change locally.)

## Standing rules

- **Pure core.** Game logic in a pure core (no DOM/canvas), deterministic (one seeded RNG), testable; the
  renderer consumes plain data.
- **Milestone integrity (D-054).** A milestone ships only when every DoD line is met OR ADR-amended *before* the
  commit — no footnoting unmet lines; "SHIPPED (slice)" is banned. A CI manifest check asserts every DoD-named
  instrument (test/tool/script) resolves to a real one.
- **Durable by default (D-069).** A plan / brainstorm / analysis is a committed FILE before it's a deliverable
  or implemented — never only in chat or a pointer. Homes: [`../brainstorms/`](../brainstorms) ·
  [`../../docs/plans/`](../../docs/plans) · [`../../docs/`](../../docs). Full convention in CLAUDE.md.
- **Markdown width ~80 (soft norm, not gated).** Wrap prose at ≈80 chars; CJK / long URLs / tables exempt.
  Apply to new/edited docs, don't mass-retrofit; count characters, not bytes.

## Multi-agent coordination (A1/A2)

- **Commit by explicit path, on GREEN — not at a milestone.** A bare `git commit` once swept a co-agent's
  staged deletion; a `stash` nearly ate uncommitted work. Stage by path the moment your slice is green.
- **Scatter-gather only DISJOINT new leaf files** — each independently green, wired into the spine one at a
  time. Keep the coupled core spine single-threaded.
- **A running audit write-locks the tree** — don't edit source mid-scan (findings rot); land edits, then audit.

## Process discipline (v0.3 learnings)

- **Enforcement-ladder calibration (A11).** Push each rule to the highest rung that can *soundly* hold it, by
  base rate: hard-block near-universal, loud-warn mixed, decline redundant guards. Write two-sided exemptions;
  test a gate's false-positive PASS path, not just that it blocks.
- **"Most important" ≠ "safe to do alone" (A13).** If the highest-value item's output is numbers/design the
  human must sign off (and no ADR locks them), park + surface it.
- **Reconcile ADRs vs the build before deferring (A12).** Search the ADR log first (a lock may exist); a signed
  ADR is a claim to verify, not proof (D-053 described the opposite of the code). Trust the build + ADR text, not labels.
- **After any fix, reconcile downstream hand-off artifacts (A23).** A fix can stale screenshots / `review.md` /
  the snapshot — re-sync them in the same pass.
- **A retrospective reads the JSONL, not the compacted window (A7).** Mine the structured log; don't summarise from memory.

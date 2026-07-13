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

**Commit gate.** Keep the build working; stage a `journal/` change every commit and gate on `pnpm run verify`
(both enforced by `.githooks/pre-commit`; `SKIP_JOURNAL=1` for trivial commits). The roster is owned by
[`gates.ts`](../../src/scripts/gates.ts) — the single source, so the count can't drift here:
<!-- gen:begin gate-roster (pnpm run checkpoint — do not edit inside) -->
**20 gates**: tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd,
gen-docs, fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
md-links, milestone-integrity, verify-changelog, doc-budgets,
checkpoint, inbox-ledger, review-link, deferred-work.
<!-- gen:end gate-roster -->
Run `pnpm run checkpoint` after adding / removing a gate to regenerate that list.

**Autonomy.** Pick next → build → verify → commit → journal → repeat. Stop and ask only for (1) decisions that
change what the game *is*, and (2) outward-facing / irreversible actions (deploy, delete, force-push). **Routine
`git push origin main` is standing-approved as part of a checkpoint**, not a per-push ask.

**Deploys = `/ship`, human-invoked (FB-9).** A release/deploy happens ONLY when the human runs `/ship` — the
invocation is the sign-off. Agents never self-invoke it, never run `src/scripts/ship.sh` autonomously, and never
"helpfully" ship at the end of a loop.

**Loop done-rule (ADR-087).** In a long `/loop`, when high-value work runs dry, keep finding work rather than
idling — but **flag low-value ticks honestly** (never dress busy-work up as high-value — PH3).

**Re-audit the diff before "done" (P1).** After a locked ADR or big refactor, re-pass **just the diff** on the
*current* build (the `battery` skill's diff re-audit, ~3 lenses) — check the delta, not the milestone; if it
touched an approved design/balance pick, flag + offer to revert (P2).

## Cross-agent messaging (herdr) — check the target, then ENTER

Messages to a co-agent's pane are THREE commands, not one, and the **first is a
liveness check**:

0. `herdr agent get <pane>` — the target **must** resolve to a live agent. If it
   answers `agent_not_found`, **nobody is home** and you must not send.
1. `herdr agent send <pane> "the message"` — this only **types** the text into
   the target agent's input box. **It does not submit.**
2. `herdr pane send-keys <pane> Enter` — this is the submit.
3. Verify: `herdr agent read <pane>` — delivered means the message shows in the
   transcript area and the `❯` input line is **empty**. If the text still sits
   at the prompt, it was never received.

**Why step 0 exists (learned 2026-07-10, the hard way).** `herdr agent send`
accepts *any* pane id and types **blindly** — it never checks that an agent is
listening. A pane id goes stale the moment that agent exits or restarts, and what
is left behind is a **bash prompt**. So the message gets typed at `$`, and the
step-2 Enter **executes your prose as a shell command**: a lane-coordination
message did exactly this and died on `syntax error near unexpected token '('`.
Step 3 cannot save you — it verifies *after* the Enter has already run.

Two failure modes, both now blocked by the **`guard-herdr-send.sh`** PreToolUse
hook (escape: `SKIP_HERDRGUARD=1`):

- **`agent send` at a pane with no live agent** — the incident above. The hook
  re-prints the live roster so you can retry against a pane that exists *now*.
- **`agent send` at your own pane** — the message lands in your own input box and
  reads back as if the human typed it.

`herdr pane run <pane> <command>` does text+Enter in one move, but it is meant
for shell panes — for agent panes prefer send → send-keys → read, so a
mid-typing collision with the agent's own input is visible before you submit.
(The hook blocks `pane run` at a live agent pane for this reason.)

**Note the CLI's sharp edge:** `herdr agent get` prints its success payload to
**stdout** but its `agent_not_found` error to **stderr**, and exits **0 either
way**. Never branch on `$?` — merge the streams and parse the JSON.

## Checkpoint (run when asked to "checkpoint" or before exiting)

1. **Commit** your own files by explicit **pathspec commit**:
   `git add path/…` for **NEW files only**, then `git commit -m … -- path/…`.
   A BARE `git commit` (or `-A`/`-a`/`-u`) snapshots the SHARED index and sweeps
   whatever a co-agent staged in the window (f84aff9; again `0e10d96`, which
   swept 6 files) — the `--` form commits only your paths (git's `--only`
   semantics). **Don't `git add` a tracked file** — edits don't need staging;
   `git commit -- path` commits the working-tree copy directly. Guard-enforced
   (`guard-git-add-all.sh` blocks bare commits, broad staging, AND `git add` of
   a tracked file; its bare-commit check now isolates the `git commit` segment
   so a ` -- ` in a sibling command or the message can't false-allow). The
   pre-commit hook echoes the staged set as the visibility backstop.
   `SKIP_SWEEPGUARD=1` for a deliberate whole-index commit.
2. **Journal** — stage a `journal/` entry (pre-commit requires it).
3. **Checkpoint the mechanicals, then finish the judgment half.** `pnpm run checkpoint`
   regenerates the derivable regions (gate roster, active-plans) + graduates any DONE plan; then YOU do the
   judgment part — bring [`project-status.md`](project-status.md) current (the resume point, not the journal),
   and clear from [`../todo-human.md`](../todo-human.md) only reading-queue docs the human engaged *this session*
   (ADR-089; sign-off is implicit, the agent owns cleanup). **Don't over-ask:** an untouched doc stays — never
   `AskUserQuestion` about a doc the session never mentioned.
4. **Leftover-work sweep — "if it isn't in the queue, it doesn't exist" (human, 2026-07-12).**
   Name every piece of work this session **ruled, discovered, deferred, or decided but did not
   build** — then give each one a **home the human actually reads**, and cite it:
   - **[`docs/plans/`](../../docs/plans)** — work an agent should pick up. Use
     [`/write-plan`](../../.claude/skills/write-plan/SKILL.md). **This is the only queue the
     session brief starts from.**
   - **`HR-nn` / `HD-nn`** in [`human-in-the-loop/`](../human-in-the-loop) — a call only the
     human can make.
   - **[`BACKLOG.md`](../BACKLOG.md)** — deliberately parked; never nagged.

   **An ADR bullet, a journal "next steps" line, and a snapshot sentence are a RECORD, not a
   QUEUE.** Work parked *only* there is read, never resumed — it vanishes into the commit log.
   This is not hypothetical: session 183 recorded a ruling the human had just made in an ADR
   bullet + the snapshot + the journal + an HR-item, and the human's answer was *"if it's not
   in `docs/plans/` it will be lost and not built."* A plan takes ten minutes; a lost ruling
   costs the decision itself. The **`deferred-work` gate** enforces the shouted case (a
   `NOT built` in canon/snapshot must cite a home); **the undeclared case is on you** — the
   gate cannot read a journal's intent, which is exactly why this step is in the ritual.
5. **Push (BEST EFFORT)** `git push origin main` — fires the pre-push gate (`verify`, blocks red). Green
   `origin/main` is the proof. **A push blocked by a CO-AGENT's red is a non-event, not a failed checkpoint**
   (human, 2026-07-12): leave the commit local, note it, carry on — the next agent to go green pushes it out
   with theirs. It only *matters* if nobody is left to carry it, so check `herdr agent list`: **others live →
   shrug**; **you are the only / last agent → the commit is STRANDED**, say so loudly (and, if the red is your
   own, fix it). Never `SKIP_VERIFY=1` either way.
6. **Confirm** — `git status` clean, `git log origin/main..main` empty (or note what's left + why).

Four rules, learned the hard way:
- **Never kill running subagents/workflows to exit.** A checkpoint resumes *committed* state; it doesn't tear
  down live work (results notify the loop when done). Leave it running (note it in-flight); `TaskStop` only if
  the user asks (`resumeFromRunId` returns completed agents cached).
- **Verify before you claim.** Never say *pushed / green / done* without checking (`git status`, the push
  succeeding, `git log origin/main..main`).
- **Shared-tree safety** (>1 agent may edit at once). **Never** `stash` / `checkout` / `restore` / `-A` / `-a`
  / `-u` or otherwise touch files you didn't author; commit your own by explicit path, and never `git add` a
  tracked file (edits commit directly via `git commit -- path`). `guard-git-add-all.sh` enforces all of this.
- **Don't fight someone else's red.** Another agent's in-flight red WIP will (correctly) block your push —
  leave your commit local, note it, never `SKIP_VERIFY=1` a red tree onto `main`. (`SKIP_VERIFY=1` is only for
  *committing* your own isolated docs/hooks change locally.)

## Standing rules

- **Pure core.** Game logic in a pure core (no DOM/canvas), deterministic (one seeded RNG), testable; the
  renderer consumes plain data.
- **Milestone integrity (ADR-054).** A milestone ships only when every DoD line is met OR ADR-amended *before* the
  commit — no footnoting unmet lines; "SHIPPED (slice)" is banned. A CI manifest check asserts every DoD-named
  instrument (test/tool/script) resolves to a real one.
- **Durable by default (ADR-069).** A plan / brainstorm / analysis is a committed FILE before it's a deliverable
  or implemented — never only in chat or a pointer. Homes: [`../brainstorms/`](../brainstorms) ·
  [`../../docs/plans/`](../../docs/plans) · [`../../docs/`](../../docs). Full convention in CLAUDE.md.
- **Markdown width ~72 (soft norm, not gated).** Wrap prose at ≈72 chars; CJK / long URLs / tables exempt.
  Was 80; cut to 72 on 2026-07-13 (an editor gutter eats ~8 cols, so 80 soft-wraps in an 80-col pane;
  72 also matches the git-commit body width). Apply to new/edited docs, don't mass-retrofit;
  count characters, not bytes.

## Multi-agent coordination (A1/A2)

- **Commit by explicit path, on GREEN — not at a milestone.** A bare `git commit` has swept a co-agent's
  staged work more than once (a staged deletion; `0e10d96` swept 6 files); a `stash` nearly ate uncommitted
  work. Stage new files by path, commit by `-- path`, the moment your slice is green.
- **Scatter-gather only DISJOINT new leaf files** — each independently green, wired into the spine one at a
  time. Keep the coupled core spine single-threaded.
- **A running audit write-locks the tree** — don't edit source mid-scan (findings rot); land edits, then audit.

## Process discipline (v0.3 learnings)

- **Enforcement-ladder calibration (AC-11).** Push each rule to the highest rung that can *soundly* hold it, by
  base rate: hard-block near-universal, loud-warn mixed, decline redundant guards. Write two-sided exemptions;
  test a gate's false-positive PASS path, not just that it blocks.
- **"Most important" ≠ "safe to do alone" (A13).** If the highest-value item's output is numbers/design the
  human must sign off (and no ADR locks them), park + surface it.
- **Reconcile ADRs vs the build before deferring (A12).** Search the ADR log first (a lock may exist); a signed
  ADR is a claim to verify, not proof (ADR-053 described the opposite of the code). Trust the build + ADR text, not labels.
- **After any fix, reconcile downstream hand-off artifacts (A23).** A fix can stale screenshots / `review.md` /
  the snapshot — re-sync them in the same pass.
- **A retrospective reads the JSONL, not the compacted window (A7).** Mine the structured log; don't summarise from memory.

---
name: working-agreements
description: How to work on this repo — cadence, autonomy, the commit/journal gate
metadata:
  type: feedback
---

# Working agreements

**Cadence:** many small commits; journal each session in [`../journal/`](../journal) — a chronological
log (summary at top, **append entries at the bottom, never prepend**; live state lives in
[`project-status.md`](project-status.md), see [`../journal/README.md`](../journal/README.md)); durable design
in [`../docs/`](../../docs) (living docs, edited in place); per-fact memory here. Locked design
decisions are recorded as ADRs in [`../docs/living/decisions.md`](../../docs/living/decisions.md).

**Commit gate:** keep the build working, and stage a `journal/` change every commit (enforced by
`.githooks/pre-commit`; `SKIP_JOURNAL=1` for trivial commits). Gate every commit on `npm run verify`
(tsc + eslint + prettier + vitest + verify-content + gen:docs --check), recorded in
[project-status](project-status.md).

**Autonomy:** pick the next task → build → verify → commit → journal → repeat. Stop and ask only for
(1) decisions that change what the game *is*, and (2) outward-facing / hard-to-reverse actions (deploy,
delete, force-push) — never without explicit approval. **Routine `git push origin main` is the exception:
it's a standing-approved part of every checkpoint** (see below), not a per-push ask. State lives in commits
+ journal so a compaction never loses progress.

**Loop done-rule (D-087):** in a long autonomous `/loop`, when the high-value backlog runs dry, **keep
finding work rather than idling** — but **flag low-value ticks honestly** (name a marginal tick as
marginal; never dress busy-work up as high-value — R3). Motion + honest labelling over a hard stop.

**Re-audit the diff before "done" (P1):** after executing a locked ADR or a large refactor, run a focused
**independent re-pass over just the diff** on the *current* build, before calling it done — the build the
human will actually play often changed since the last full battery, so check the **delta**, not the
milestone. Runnable form: the `battery` skill's **diff re-audit** mode (~3 lenses; if the change touched an
approved design/balance pick, flag + offer to revert per P2). A clean re-pass *is* the deliverable — the
confidence is the point.

**Checkpoint (the resumability ritual — run it when asked to "checkpoint" or before exiting):**
1. **Commit** completed work — stage **only your own files by explicit path** (`git add path/…`), never
   `-A` / `commit -a` (see shared-tree safety below).
2. **Journal** — stage a `journal/` entry (the pre-commit gate requires it).
3. **Live snapshot** — bring [`project-status.md`](project-status.md) current (it, not the journal, is the
   resume point).
4. **Push `main`** — `git push origin main`. This fires the **pre-push gate** (`.githooks/pre-push`), which
   runs `npm run verify` on **every push (all branches)** and **blocks a red build**. A green `origin/main`
   is the proof the checkpoint is real — pushing is *part of* the checkpoint, not a separate approval.
5. **Confirm** — `git status` clean, `git log origin/main..main` empty (or explicitly note what's left and
   why).

Three rules, all learned the hard way:
- **Verify before you claim.** Never report *pushed / green / done* without checking (`git status`, the push
  actually succeeding, `git log origin/main..main`). A tree that's clean one moment can go dirty the next.
- **Shared-tree safety — more than one agent may be editing the working tree at once.** **NEVER** `git stash`,
  `checkout`, `restore`, or otherwise mutate files you didn't author. Commit your own files by explicit path
  and leave everyone else's uncommitted WIP untouched.
- **Don't fight someone else's red.** The pre-push gate verifies the **working tree**, so another agent's
  in-flight red WIP will (correctly) block your push. Expected — leave your commit local, note it in
  `project-status.md`, and never `SKIP_VERIFY=1`-override a red tree onto the remote. (`SKIP_VERIFY=1` is only
  for *committing* your own isolated change locally — e.g. a hooks/docs change while unrelated WIP is red —
  never for pushing red to `main`.)

**Architecture rule:** keep game logic in a **pure core** (no DOM/canvas imports), deterministic
(one seeded RNG) and testable; the renderer consumes it as plain data.

**Milestone-integrity rule (D-054):** a milestone is **SHIPPED only when every DoD line is met OR
formally amended via an ADR *before* the commit** — no shipping with unmet DoD lines footnoted away.
The label **"SHIPPED (slice)" is banned**: a slice is either fully done, or its DoD is ADR-amended down
to what actually shipped first. A **CI manifest check** backstops this by asserting that every
instrument a DoD *names* (a test, tool, or script) resolves to a real test/tool — so an honest-intention
gap can't pass silently behind green CI. This extends the same rigor the engineering gates already carry
to **feature-completeness claims**, keeping the milestone ledger trustworthy into T1+; `roadmap.md` DoDs
are forward contracts. *(The CI manifest check itself is Part-2 build work; this is the process rule.)*

**Durable-by-default (DS#21 / D-069) — already canon in [`../../CLAUDE.md`](../../CLAUDE.md):** a
plan / brainstorm / analysis is a **committed FILE before it's a deliverable or implemented**, never only
in chat or a ledger pointer (session context dies at compaction). Homes:
**[`../brainstorms/`](../brainstorms)** (discovery) · **[`../../docs/plans/`](../../docs/plans)**
(plans / reel-backs) · **[`../../docs/`](../../docs)** (settled). The full convention (incl. durable
capture of workflow / subagent outputs) lives in CLAUDE.md — this is the cross-ref, not a second copy.

**Markdown prose width — wrap at ~80 chars (a SUGGESTION, not a gate):** the human prefers markdown prose
and paragraphs hard-wrapped at **≈80 characters**. It is a **soft norm** — markdown is excluded from Prettier
(`.prettierignore`) and 80 can't be hard-blocked everywhere, so wide CJK glyphs, long URLs/paths, and markdown
**tables** (rows can't wrap — prefer bullet-sections over a wide prose table) are accepted exceptions. Apply to
**new / edited** docs; don't mass-retrofit. Count *characters*, not bytes (CJK inflates a byte count). Full
statement in CLAUDE.md.

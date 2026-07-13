# Hot-file contention & multi-agent thrash — analysis (2026-07-13)

The human asked: can we detect commit contention / multi-agent
thrashing on HOT files from session history, herdr history, and the
git log — and would breaking up large hot files help?

This doc is the first measured pass. Raw method + numbers below;
verdict at the end. Analysis script: `tmp/hotfiles.py` (throwaway,
git-ignored; rerunnable any time).

## Method — where each signal lives

1. **Git log** (`git log --name-only` + timestamps): per-file commit
   heat, and "rapid re-touch" events — the same file landed by two
   commits ≤20 min apart. Cross-SCOPE re-touches (different
   conventional-commit scope on each side) proxy for *two different
   agents* landing on the same file, since one agent's small-step
   commits share a scope.
2. **Session transcripts** (`~/.claude/projects/<repo>/`, 548
   `.jsonl`, 1.8 GB): grep for the literal failure strings a
   collision produces — `index.lock`, `Another git process`,
   `failed to push some refs`, `cannot lock ref`, sweep-guard fires,
   herdr `agent_not_found`.
3. **Herdr history**: `agent_not_found` in transcripts counts
   stale-pane sends (the 2026-07-10 class of incident).
4. **Not yet done (next rung of rigor):** join commits → sessions via
   the journal file each checkpoint commit touches, then measure
   "file landed by ≥2 *distinct sessions* within N minutes" directly
   instead of via the scope proxy; and extract retry-loop length
   (attempts before a commit finally landed) per collision event.

## Findings

Scale: **1,661 commits in 18 days, 227 journal sessions, 548
transcripts.** Peak bursts: 27 commits in one 30-min bucket
(2026-07-10 12:00 — the day both AGENTS.md incident notes date from).

### Collision events (transcript grep, all sessions)

| marker | hits |
|---|---|
| `failed to push some refs` (push race) | 218 |
| `index.lock` mentions | 133 |
| `Another git process` | 54 |
| `cannot lock ref` | 22 |
| `SKIP_SWEEPGUARD` mentions | 708 |
| `guard-git-add` mentions | 1,545 |
| herdr `agent_not_found` (stale-pane send) | 105 |

**72 of 548 sessions (13%) hit at least one hard git collision**
(push reject / index.lock / concurrent git process). The guard
mentions are mostly the hook doing its job (and agents reading about
it), but 708 `SKIP_SWEEPGUARD` strings says the escape hatch is
discussed/used a LOT — worth an audit of its own.

### Hot files — two distinct classes

**Class 1 — coordination docs** (contention is process-inherent:
every checkpoint touches them):

| file | commits | re-touch ≤20min | cross-scope |
|---|---|---|---|
| `project/status/project-status.md` | 312 | 160 | 124 |
| `project/todo-human.md` | 205 | 86 | 71 |
| `docs/living/decisions.md` | 126 | 36 | 28 |
| `project/human-in-the-loop/review.md` | 120 | 40 | 30 |
| `docs/plans/README.md` | 119 | 38 | 25 |

**Class 2 — code hubs** (the "HOT files" in the question's sense):

| file | lines | commits | re-touch | cross-scope |
|---|---|---|---|---|
| `src/ui/render.ts` | 6,669 | 183 | 91 | 30 |
| `src/ui/dev.ts` | 2,774 | 109 | 35 | 17 |
| `src/ui/styles.css` | 3,580 | 106 | 43 | 12 |
| `src/core/intents.ts` | 1,434 | 85 | 27 | 8 |
| `src/core/index.ts` | 412 | 74 | 20 | 12 |
| `src/ui/render.test.ts` | 3,412 | 73 | 23 | 5 |

(The `src/fixtures/saves/*.json` files also rank high but are
generated — regeneration heat, not contention.)

`render.ts` is a god-file by any measure: 6.7k lines and only ~9
top-level functions — the mass is a few giant functions (`mount`)
full of nested closures. That shape matters below.

## Verdict — would splitting hot files help?

**Yes for commit contention, no for push contention.** The two costs
are different and only one is file-shaped:

- **In this shared-tree model the contention unit IS the file.**
  Commits are pathspec'd file-level (working agreement). Two agents
  with edits in the same file literally cannot commit independently —
  one either sweeps the other's hunks or waits. Splitting
  `render.ts` into per-panel/per-surface modules (and `styles.css` +
  `render.test.ts` alongside) turns "same file" into "different
  files" and dissolves that class entirely. The cross-scope re-touch
  numbers (30 on render.ts) say this class is real but not huge —
  call it a couple of collisions a day at current pace.
- **What splitting does NOT fix:** `index.lock` races (one `.git`),
  push rejects (one `main`, and the full-verify pre-push serializes
  long enough for a co-agent to land first — 218 hits, the BIGGEST
  bucket), verify-red-from-any-co-agent-WIP (verify runs the whole
  tree; a red half-edit anywhere blocks everyone's push), and all of
  Class 1 (coordination docs are hot *by design*; the fix there is
  protocol — e.g. an inbox-claim-style checkpoint lock — not file
  layout).
- **Cost side:** `render.ts`'s shape (few giant closures) means a
  split is a real refactor with regression risk on the game's whole
  UI, not a mechanical file shuffle. It has independent merit
  (readability, test surface, edit locality for EVERY session — a
  6.7k-line file also burns agent context to navigate), so it can be
  justified on its own; but sold purely as a contention fix it
  addresses the smaller of the two contention classes.

**Recommended order if we act:** (1) a checkpoint/push claim
protocol (the inbox-claim pattern generalized) — attacks the 218-hit
class; (2) the render.ts split by surface — attacks the file class
and pays context/readability dividends; (3) leave Class 1 docs
alone (their thrash is cheap: tiny files, append/replace, rarely
conflict — the cost is only the lock/push races already covered by
(1)).

Neither is started; direction is the human's call (design/process
fork — lock before building).

---

**Outcome (2026-07-13, session 203):** the render-split plan landed —
render.ts 6,766 → 1,594 (12 view modules), dev.ts 2,774 → 611 (the
dev/ module set), styles.css → a 9-file @import index, render.test.ts
mirror-split. Contention unit is now the surface module, not the
god-file. Re-run `tmp/hotfiles.py` after ~5 days to confirm the heat
actually dispersed.

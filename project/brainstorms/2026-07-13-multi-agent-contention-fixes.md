# Multi-agent contention fixes: Brainstorm / Discovery Notes

Date: 2026-07-13 · Goal: turn the measured hot-file contention
analysis
([2026-07-13-hot-file-contention-analysis.md](2026-07-13-hot-file-contention-analysis.md))
into locked decisions — claim protocol, render.ts split, sweep-guard
escape audit, and whatever else the grilling surfaces.

## Summary / key decisions

All locked with the human 2026-07-13 (promoted to **ADR-196**):

1. **Architecture: HYBRID** — shared tree stays the default;
   sanctioned heavy jobs run in an isolated worktree and land
   atomically.
2. **Push mutex** — commits free; `git push` takes an atomic claim
   (inbox-claim pattern). Lock held → **leave-local immediately**,
   no wait.
3. **/prepare-to-exit lock** — the whole exit ritual is a critical
   section. Lock held → **bounded wait**, timeout exits through the
   ritual's OOPS output.
4. **Sweep-guard tightened + ledger** — SKIP_SWEEPGUARD no longer
   covers restore/checkout/stash or tree-wide targets; named paths
   only; every bypass appends to a committed ledger.
5. **decisions.md shards** → `docs/living/decisions/` band files
   (000/050/100/150…), `decisions.md` becomes the prd-style index;
   plus an atomic **ADR-number claim** (F-number-block pattern).
6. **Big-bang split job** — Fable, overnight, worktree, quiet
   window: render.ts by surface; render.test.ts untouched as the
   net then split to mirror; styles.css per-surface; **dev.ts by
   its 6 tabs with review split variants/story → 7 pane modules +
   shell = 8 files**.
7. **Packaging: THREE plans** — (1) contention locks/protocol,
   (2) ADR shard, (3) the overnight split job.
8. Other coordination docs: leave alone. No retrospective
   sweep-guard audit.

## Q&A log

### Q2 — claim protocol scope
- Asked: push-only mutex vs full checkpoint lock vs retry-wrapper
  vs status quo.
- Captured (their words): **"1 and /prepare-to-exit lock; not a
  full checkpoint lock, but every call to prepare-to-exit can flow
  through a lock. I think prepare to exit if called multiple times
  in parallel session thrashes a bunch."** So: **(a) push-only
  mutex** — commits stay free, `git push` requires an atomic claim
  (inbox-claim pattern, stale timeout, hook-enforced), auto
  `pull --rebase` + retry inside the claim; **(b) a
  /prepare-to-exit lock** — the whole prepare-to-exit ritual is a
  critical section (parallel invocations thrash: they all rewrite
  project-status.md, reconcile todo-human.md, journal, push).
- Flags: implementation defaults (generalize `inbox-claim.ts`,
  pre-push hook enforcement, stale timeout) are agent-pickable at
  plan time.

### Q2b — behavior when the lock is held
- Asked: bounded wait vs leave-local vs herdr queue.
- Captured (their words): **"For pushing leave-local, its fine,
  another push will happen eventually. For the prepare to exit
  protocol we want 1, bounded wait that hits the OOPS output of
  prepare to exit when the wait times out."** So: **push lock held
  → leave-local immediately** (no wait — a later push carries it);
  **prepare-to-exit lock held → bounded wait**, and on timeout the
  ritual exits through its existing OOPS (incomplete/failure)
  output path rather than half-running.

### Q3 — render.ts split: go/no-go + shape
- Asked: big-bang worktree split vs incremental strangler vs no
  split.
- Captured: **Big-bang worktree split** — one worktree job in a
  declared quiet window (co-agent render.ts WIP landed first,
  cede/fold), split by surface/panel, `render.test.ts` as the
  regression net. This is the concrete instance of Q1's "heavy job
  in a worktree, landed atomically."
- Flags: quiet-window mechanics → plan time.

### Q4 — split scope
- Asked: what rides along in the worktree job?
- Captured: **render + tests + styles.** render.ts split by
  surface/panel; `render.test.ts` stays UNTOUCHED during the split
  (it is the regression net), then is split to mirror the new
  modules as a follow-up commit inside the same job; `styles.css`
  splits per-surface in the same job.
- ~~dev.ts explicitly OUT — a separate, later, lighter job~~
  **REVISED by the human mid-session:** dev.ts is IN, split along
  its existing seams — the 6 tabs (`settings, review, scenarios,
  balance, rungs, protos`, dev.ts:1744-1750) with review's two
  halves (`variants` + `story`, dev.ts:1758-1759) as separate
  modules → **7 pane modules + the shell (chrome + tab bar +
  selectTab) = 8 files**. Mechanical split, DEV-only blast radius,
  lands as its own commit inside the same overnight job.

### Q5 — routing + plan packaging
- Asked: who runs the split job, and when?
- Captured: **Fable, overnight, in the worktree** — and (their
  words) *"it should be in its own plan right, separate from
  everything else, so the output of the brainstorm is two plans."*
  → **Two plans**: (1) the locks (push mutex + prepare-to-exit
  lock), buildable now in the shared tree; (2) the big-bang split
  job (render + tests + styles + dev.ts), Fable overnight in a
  quiet window.

### Q6 — SKIP_SWEEPGUARD escape hatch
- Data (measured in-session): the 708 transcript mentions collapse
  to **34 real bypass invocations across 9 sessions** (22 commits,
  11 adds, 1 restore). The restore was
  `SKIP_SWEEPGUARD=1 git restore --staged --worktree .` with a
  `git checkout -- .` fallback — a whole-tree restore under bypass
  in the shared tree, exactly the operation the guard exists to
  stop.
- Asked: tighten the escape hatch?
- Captured: **Tighten + ledger.** Under SKIP_SWEEPGUARD,
  destructive verbs (restore / checkout / stash) and tree-wide
  targets (`.`, `-A`, missing pathspec) stay BLOCKED — bypass
  requires explicit named paths; every bypass appends to a small
  committed ledger so usage is visible. No retrospective audit of
  the 34 historic uses. Ships as part of the locks plan.

### Q7 — coordination docs
- Asked: leave layout alone and let the exit-lock carry them?
- Captured: mostly yes, EXCEPT the human's gut call (their words):
  *"docs/living/decisions.md can be turned into a
  docs/living/decisions/ directory with files like 000.md 050.md
  100.md 150.md."* Verified in-session: 4,070 lines / 224 ADR
  headings (max ADR-195); 313 files reference decisions.md but
  ZERO use `#adr-N` anchors, so no link rot; prd.md (index +
  docs/living/prd/ body) is the in-repo precedent.
- Locked: **Shard + index + number-claim.**
  `docs/living/decisions/` band files (000/050/100/150, ~1k lines
  each), `decisions.md` becomes the prd-style index, and an atomic
  **ADR-number reservation** (the inbox-claim F-number-block
  pattern) joins the locks plan — sharding alone doesn't stop two
  agents taking the same next ADR number in the hot newest band.
- Other coordination docs (snapshot, todo-human, review.md): leave
  alone; the exit-lock serializes their thrash. index.lock retry +
  herdr status quo = agent-pickable details in the locks plan.

### Q1 — architecture fork (shared tree vs worktrees)
- Asked: is the shared tree locked, or are per-agent worktrees on
  the table?
- Captured: **Hybrid** — shared tree remains the default (one dev
  server, live review); isolation via worktree is sanctioned for
  specific heavy jobs, which land atomically. Not per-agent
  worktrees across the board.
- Flags: define what qualifies as a "heavy job" → covered in the
  render.ts-split questions below.

### Q8 — packaging + backstop
- Asked: two plans or three, and anything untouched?
- Captured: **Three plans** (locks/protocol · ADR shard · split
  job). Backstop: **all covered**.

## Parking lot (tangents / parallel threads)

_(none — the session stayed on-thread)_

## Open flags (pending input)

- Plan-time (agent-pickable, no human input needed): stale-claim
  timeout values; lock storage location (git-ignored, mirroring
  `inbox-claim`); index.lock retry mechanics; render.ts target
  module map; quiet-window declaration mechanics (herdr
  announce + WIP-landed check).
- Verify at plan time that `/prepare-to-exit` has the referenced
  OOPS output path and wire the lock timeout into it.

# Parallel `/drain-inbox` — claim protocol, surface re-grouping, durable state

**Status:** proposal, forks open — awaiting human steer
**Occasion:** 2026-07-10. Three agents tagged `drain-inbox` in one shared tree
(`w6:p1` → `cold-open`, `w6:p2` → `feedback-ui`, `w3:p3` → design).

**Human intent (2026-07-10, supersedes the skill's single-lane rule — ADR-022):**

> *"I know the intent of drain-inbox was for me to only run the skill once, but I
> changed my mind. I added buckets and I want to be able to drain buckets in
> parallel. I want agents to tell me 'hey you want me to drain bucket X, other
> agents are working now on Y and Z; there's items in bucket X that will collide —
> what should we do?' I want the drain-inbox to be per bucket, or multiple buckets
> in one agent. If we implement some kind of scan over all buckets/items and
> re-group them by overlap, then the result of that scan should be durable, so
> another agent knows that a feedback item in bucket X was moved to bucket Y and
> doesn't address it multiple times."*

Four requirements fall out: **R1** parallel lanes are the goal, not the exception ·
**R2** claiming announces live lanes + predicted collisions and *asks* · **R3** a
lane is 1..N buckets · **R4** the re-group result is durable and idempotent.

## 0 · What this cancels

`.claude/skills/drain-inbox/SKILL.md` currently forbids this outright: §0
*"one drain lane at a time"*, §8 *"never run two concurrent drains against the
shared tree"*. Its only claim signal is §2's intake commit — *"a second drain
seeing the clean intake at HEAD knows a drain is live."*

That signal is **bucket-blind and already false in practice**: `w6:p1` is draining
`cold-open`, but its intake commit `c3727a0` carried a single **r0** capture. A
second lane reading HEAD learns *"a drain is live"* and nothing about which
bucket — so it must either stand down entirely or proceed blind.

Cancelling the single-lane rule is an **ADR**, not a tweak.

## 1 · Collision inventory — observed, not hypothesised

1. **F-number race — LIVE, ALREADY HAPPENING.** §5 assigns F-numbers as "next
   free after the current max". `w6:p1` consumed **FB-197** (committed `72e1ea1`)
   and **FB-198/199/200** (named in its journal, in flight). `w6:p2` grepped that
   max ~10 min earlier and will pick **FB-198**. Two lanes, one number.
2. **Shared per-day F-log.** §5 appends all entries to one
   `project/feedback-human/2026-07-10-playtest.md`. `w6:p1` is already appending
   to it. A second lane conflicts or clobbers.
3. **Same-bucket double-drain.** Nothing prevents two lanes entering `r0`.
4. **Same fix-surface across different buckets — LIVE.** Speaker/narrator colour
   is complained about in **all three** live buckets: `cold-open` (11:39:11,
   11:43:03), `r0` (11:46:15, 11:51:37, 12:07:46), `feedback-ui` (11:35:21). One
   stylesheet, three lanes. **Buckets are named for capture-time context, not fix
   surface.** This is the collision a lock cannot fix — and it is the reason R4
   exists.
5. **Shared working tree + `verify`.** Every lane runs the full gate against one
   tree. Right now that tree carries `src/core/rewards.ts`, `src/ui/render.ts`,
   `src/tests/e2e/journeys.spec.ts` (modified) and `src/app/freeze-clock.ts`
   (untracked) from *different* lanes. Lane B's gate includes lane A's
   half-written edits. **A lock cannot fix this either** — only worktree
   isolation can. Human deferred it; documented here as accepted risk.
6. **Archive-move / index race.** Mostly handled: `commitCapture`
   (`playtest-inbox.ts:150`) is explicitly fail-soft on a locked index.

## 2 · Ground truth about the files (verified, PH2)

- `writeCapture` (`playtest-inbox.ts:135`) **appends** to `pending/<key>.md`, or
  creates it with a header. It never rewrites it.
- `writeCapture` (`:140`) writes each sidecar `<bucket>/<stamp>.json` **exactly
  once**, keyed by a unique stamp. **A stamp is never rewritten** — a new capture
  is a new stamp.
- `commitCapture` (`:150`) auto-commits the `.md` on every capture, fail-soft.
- `.gitignore:29` ignores **only** `project/playtest-inbox/**/*.png`.

Two consequences, and they decide the whole design:

- **Never put drain state in the `.md`.** An in-place edit races a live append +
  auto-commit from the capture middleware.
- **The `<stamp>.json` is a safe, already-committed, already-per-item home for
  durable drain state.** The middleware writes it once and never returns.

## 3 · The design

The governing split:

> **In-progress is ephemeral → a git-ignored claim, validated by owner liveness.
> Re-grouping and completion are durable → fields on each capture's own
> `<stamp>.json`.
> Nothing new is hand-maintained.**

### 3.1 · Lanes, not buckets (R3)

A **lane** is the unit of work and of claiming: a named set of capture stamps.
By default a lane *is* a bucket. After a re-group scan (§3.3) a lane may be a
**surface cluster** spanning buckets (`speaker-colour`), or an agent may hold
several buckets at once (`claim r0 dev`).

### 3.2 · The claim — ephemeral, liveness-checked (R1, R2)

`project/playtest-inbox/pending/.claims/<lane>.json`, **git-ignored**.

All lanes share one working tree, so an uncommitted file on disk is a perfectly
good mutex — and keeping it out of git costs no commit, no `verify` run, no index
contention. Acquire atomically (`mkdir` is POSIX-atomic), wrapped in
`src/scripts/inbox-claim.sh`:

| command | effect |
| --- | --- |
| `claim <lane...>` | atomically claim 1..N lanes; print the announce report (below); exit 1 on collision |
| `list` | live claims + liveness + F-number high-water mark |
| `release <lane...>` | drop at end of pass |
| `reap` | drop claims whose owner process is dead |

Payload: `{ lanes, agent, pane, herdrSession, pid, started, fbLo, fbHi }`.

**Liveness, not TTL.** `herdr agent list` returns live pane + session ids, so a
claim whose `herdrSession` is absent is *provably* stale and reapable — no
timeout guessing. Fallback where herdr is absent (CI, `HERDR_ENV` unset): PID
check, then TTL + an explicit `--force` steal.

**The announce (R2)** — what `claim` prints, and what the skill must relay to the
human verbatim before draining a single item:

```
CLAIMED  r0                        22 items   FB-225..249
LIVE     cold-open   w6:p1 Fable5   8 remaining
         feedback-ui w6:p2 Opus     3 remaining
COLLISION  3 of your items share a fix surface with a live lane:
  11:46:15  narrator colour   src/ui/styles.css .vn-speech  <- also cold-open (11:43:03)
  11:51:37  Genemon not yellow  src/ui/render.ts            <- also cold-open (11:39:11)
  12:07:46  Genemon not yellow  src/ui/render.ts            <- also cold-open (11:39:11)
ACTION  coordinate, re-lane, or defer these 3. Ask the human.
```

### 3.3 · The re-group scan — durable, idempotent (R4)

A scan tags each capture with the **surface** it will touch, then assigns a
**lane**. Signal available *before* triage: the capture's `**Element:**` selector
(`span.vn-speech`, `panel "log"`, `button "Continue"`) plus the note text. The
speaker-colour cluster is trivially identifiable this way — every member points at
`.vn-speech` or the log panel.

**The scan's output is durable because it is written into each capture's own
`<stamp>.json`** — not into a central ledger. New fields:

```jsonc
{
  // ... existing: save, logTail, context, kind, group, session, build
  "lane":    "speaker-colour",        // re-grouped owner; defaults to the bucket
  "surface": ["src/ui/render.ts", "src/ui/styles.css"],
  "status":  "open",                  // open | done | parked
  "fb":      null,                    // assigned F-number, once logged
  "commit":  null                     // the fix commit — the record
}
```

**Why per-capture and not a central `ledger.json`:** a central ledger recreates
collision #2 — three lanes marking items done all edit one file. One file per
capture means **each lane writes only files it owns; merge conflicts are
structurally impossible.** It also adds no new file class and nothing
hand-maintained: the `<stamp>.json` is already committed, already keyed by item,
already the authoritative repro.

The scan is **idempotent**: it never re-lanes an item whose `status` is `done` or
`parked`. Re-running it after new captures land only fills in the new stamps.
This is exactly the "another agent doesn't address it twice" guarantee.

### 3.4 · F-number blocks (fixes #1)

~~`claim` reserves a contiguous block of F-numbers into the claim file
(`fbLo..fbHi`), sized to the lane's item count.~~ **Superseded during build
(human, 2026-07-10): FB numbers are allocated AT CAPTURE TIME** — the middleware
is a single writer, so stamping `FB-<n>` into the entry heading + sidecar as the
capture lands kills the race by construction instead of coordinating around it
(`stampCapture` / `nextFbNumber`, `playtest-inbox.ts`; the allocator counts live
claims' blocks, so both schemes coexist). The claim's block survives only as the
fallback for legacy unstamped captures. Same day: **a drain pass takes the WHOLE
lane** — the skill's ≤5 batch cap is retired.

### 3.5 · Per-lane F-log (fixes #2)

`project/feedback-human/<date>-playtest-<lane>.md` rather than one shared
`<date>-playtest.md`. No append race; provenance improves.

### 3.6 · Completion and archive

`status: "done"` + `fb` + `commit` on the `<stamp>.json` is completion. The
`pending/ → archive/` `git mv` of a bucket becomes **derived**: a bucket archives
when *all* of its stamps are `done`, even if three different lanes drained them.

## 4 · The cost, stated plainly

The inbox README's proudest property is:

> *"Empty `pending/` = drained. **No status field to go stale** — a session file
> is either in `pending/` (has undrained entries) or in `archive/` (fully
> logged)."*

**This proposal breaks that property, and it must.** Once a lane can span buckets,
file location can no longer encode completion — a bucket file cannot move to
`archive/` while another lane still owns entries inside it. So a per-item `status`
field returns, and with it the risk of going stale.

**Mitigation — push the rule to the highest rung that soundly holds it:** a
`verify` gate (`inbox-ledger`) that cross-checks the fields against disk:

- every capture in `pending/` has a `lane` + `status`;
- no `status: done` item sits in a bucket that still has open siblings *and* no
  fully-`done` bucket sits in `pending/`;
- every `done` item names a real `commit` and a unique `fb`;
- no `fb` is used twice **across the whole corpus** — this is the F-number race
  caught mechanically, not by etiquette.

That gate is a content invariant (it cannot cry wolf), which is the bar this repo
sets for gating. Without it, this proposal is strictly worse than today's design.

## 5 · Scope check

The human chose **"claim protocol only"** (Tiers 1–3), deferring worktree
isolation. **R4 (durable re-group) grew the scope past that choice** — it adds
the scan, the `<stamp>.json` schema change, and the `inbox-ledger` gate. Build
order, smallest useful increment first:

1. `inbox-claim.sh` + `.gitignore` + tests (claim-twice fails; reap-dead
   succeeds) — unblocks parallel lanes today, fixes #1/#2/#3.
2. Per-lane F-log; skill §0/§2/§5/§8 rewrite; the ADR.
3. The re-group scan + `<stamp>.json` fields + the `inbox-ledger` gate — fixes #4.
4. *(deferred)* worktree isolation — the only real fix for #5.

**Accepted risk while #5 is deferred:** a lane's `verify` may go red on another
lane's WIP. The existing "don't fight someone else's red" rule already covers it;
concurrency makes it common rather than rare.

## 6 · Touched by adoption

- `.claude/skills/drain-inbox/SKILL.md` — §0, §2, §5, §8 rewritten (§0 and §8
  currently *forbid* what this enables); a new "announce + ask" step.
- `project/playtest-inbox/README.md` — lifecycle gains claim + lane + scan;
  the "no status field" paragraph is corrected, not deleted.
- `.gitignore` — `project/playtest-inbox/pending/.claims/`.
- `src/scripts/playtest-inbox.ts` — sidecar schema + its test.
- `src/scripts/gates.ts` — the `inbox-ledger` gate.
- New: `src/scripts/inbox-claim.sh`, `src/scripts/inbox-regroup.ts`.
- **ADR** in `docs/living/decisions.md` cancelling the single-lane rule
  (ADR-022: newest human steer wins).

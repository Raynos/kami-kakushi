---
name: drain-inbox
description: Drain the playtest capture inbox — CLAIM a lane first (parallel drains are sanctioned, ADR-171), then drain the WHOLE lane in one pass. Claim 1..N buckets (or a re-grouped cluster lane), relay the announce (live lanes + collisions) to the human, reproduce every capture from its embedded save, propose a fix/route (bug) or answer (question) for all of them in one go, get the human's go-ahead, then log F-entries, stamp the sidecars, and archive. Run as /drain-inbox [lane...]. User-invoked.
argument-hint: [lane...]
disable-model-invocation: true
---

# Drain the playtest capture inbox

Metabolize the DEV capture overlay's output (FB-3). Captures land in
`project/playtest-inbox/pending/` as **one markdown file per BUCKET, or per game
session when ungrouped**: `<key>.md` holds a header plus one `##` **entry** per
capture — `<key>` is a **bucket slug** (`map-feedback.md`) when the human grouped
the capture, else the **session id** (`2026-07-06T11-49-35-2405fe.md`). Each
entry is LEAN (the note + the picked element + a screenshot link + a **Details**
link) and its heading names its **kind** — `Bug ·` (a defect to fix) or
`Question ·` (something the human is exploring, to answer/discuss). The heavy
machine data lives in a sibling folder `<key>/`: `<stamp>.json` (the base64 save
+ recent logs + full context + `kind`/`group`/`session`/`build` — **committed**)
and `<stamp>.png` (the screenshot — git-ignored). The human plays whenever; you
drain whenever.

**Drain your CLAIMED lane(s) — the WHOLE lane in one pass.** Parallel drains are
sanctioned (**ADR-171**): several agents may drain concurrently, each holding its
own **lane** (a bucket, several buckets, or a re-grouped cross-bucket cluster
like `speaker-style`). The claim protocol (§0) is what makes that safe — claim
first, relay the announce to the human, then drain. A pass takes **every open
capture in the lane** (human, 2026-07-10 — the old ≤5 batch cap is retired),
reproduces them all, then **proposes a fix/route/answer for each and waits for
the human's go-ahead** before landing anything (§4). Still a back-and-forth —
one wholesale proposal message, per-item steers welcome — not an autonomous
sweep.

**The capture is a claim, not the truth (PH2).** Reproduce and verify every
capture against the *running* game before you touch code. Where the note and
the build disagree, the build wins.

## 0 · CLAIM your lane(s) before touching anything (ADR-171)

Every drain pass starts by claiming — never drain unclaimed:

```
tsx src/scripts/inbox-regroup.ts scan          # seed fix-surfaces; see cross-bucket clusters
tsx src/scripts/inbox-claim.ts claim <lane...> --pane <your w:p> --agent <model>
```

The claim is a git-ignored `pending/.claims/<lane>.json` (ephemeral — liveness-
checked against the herdr pane roster, so a dead session's claim is reapable via
`… inbox-claim.ts reap`, never a deadlock). It reserves your **F-number block**
(§5) and prints the **announce**: which lanes are LIVE under other agents, and
which of your items **share a fix surface** with another live lane.

**Relay the announce to the human verbatim-in-substance** — and it is
**mandatory when the announce shows a COLLISION**: stop and ask (coordinate /
re-lane the cluster via `inbox-regroup.ts assign` / defer those items) before
draining them. With no collisions, relay the claim line and proceed.

If your claim is refused (lane held): pick another lane, or coordinate with the
holder; if the holder is dead, `reap` and retry. A drain without a claimable
lane is a pass that doesn't happen.

## 1 · Pick the bucket — then take ALL its open entries

The sections below say "bucket" for the common one-bucket lane; a multi-bucket
or cluster lane works the same, scoped to the lane's items. First list the
inbox files: `project/playtest-inbox/pending/*.md` (the README is exempt).
Classify each by filename: the session-id shape `YYYY-MM-DDTHH-MM-SS-<token>`
is an **ungrouped session file**; any other slug (`map-feedback`, `dev-tooling`)
is a **bucket**.

**Choose the bucket to drain:**

- If `/drain-inbox <bucket>` was invoked **with an argument**, use that bucket
  (match by slug; if none match, say so and list what's there).
- Otherwise, if more than one bucket / bucket + ungrouped is present, **ask
  the human with the AskUserQuestion tool: _"Which bucket are we draining?"_** —
  one option per bucket present (plus **"Ungrouped (per-session captures)"** if
  any session files exist). This guard stops one pass from draining every
  bucket at once.
- If only one group is present, drain that without asking.

**Then, within the chosen lane only**, take **every open capture (`##` entry),
oldest-first**: reproduce the whole lane, propose the whole lane in one
wholesale message (§4), land the whole lane on the go-ahead. **Never cross into
a lane you haven't claimed.**

**Empty (chosen bucket, or the whole inbox) → say so and stop** — don't
manufacture work from an empty inbox.

## 2 · Intake-commit (durability before processing)

Commit *all* pending inbox files verbatim in one commit before touching
anything (they are already auto-committed on capture, but re-stage in case any
were hand-touched):

```
git add project/playtest-inbox/pending/*.md
git commit -m "chore(inbox): intake N file(s)" -- project/playtest-inbox/pending
```

This makes the raw bytes durable in git history *before* processing, so the
append-only/lossless norm holds even though each `.md` later moves to
`archive/`. (The `<key>/` screenshot folders are git-ignored — never staged.)

## 3 · Per ENTRY — reproduce, then form a PROPOSAL (don't fix yet)

For each of the lane's entries, oldest first — reproduce it and decide the
fix/route, but **do not touch code or commit yet**; §4 gets the human's
go-ahead before any fix lands.

**Read the WHOLE note first — it is often multi-line.** Read the entire
`**Note:**` block by eye (the `.md` entry, or the `<stamp>.json`'s `note`
field) — **never** triage off a `grep`/`awk` that prints only the first line
(that mis-triaged FB-121, a full design proposal, as "truncated"). If a note
reads as cut-off, re-read the raw entry before you believe it.

**Reproduce (verify the complaint against reality).** Read the entry's note +
its **Details** link → open that `<session>/<stamp>.json` for the full context
(seed, clock, location, rung, variants, viewport) + the `save` (base64) +
recent `logTail`. If the entry has an `**Element:**` line, that's the exact UI
element the note is about (semantic label + selector + on-screen rect; the
screenshot boxes it) — focus the repro there. Drive the game **headlessly**
(never headed — `.claude/hooks/enforce-headless-qa.sh` enforces it):
`pnpm run dev`, navigate with the captured variant/`?dev=no` params,
`__qa.load('<the .json's save>')`, resize to the captured viewport, then
screenshot / observe. Confirm the symptom is real before acting. (The
screenshot is a local aid; the save is authoritative.)

**First read the entry's KIND** (the `## Bug ·` / `## Question ·` heading, also
`kind` in the `.json`) — the human's own signal for what they want back:

- **`Question`** → the human is **exploring interactively**, not reporting a
  defect. Reproduce it, then **answer/discuss** it in the §4 proposal (what you
  found, the trade-off, options) — do **not** reflexively propose a code fix. If
  the answer implies a real change, surface it as its own route (bug fix / taste
  HR-item / design HD-item) for the human to green-light; otherwise the
  deliverable is the answer + an F-entry logged 💬. Use AskUserQuestion freely —
  a question capture is an explicit invitation to a back-and-forth.
- **`Bug`** → a defect to fix; triage by the three routes below. In every case
  you produce a *proposed action*, not a landed change:
  - **(i) Mechanical bug** → propose the fix (root cause + the change you'd
    make), test-first where a test could go RED (the `tdd` skill). Reproduce in
    the running game first so the proposal is grounded, not guessed.
  - **(ii) Taste / UI** → if a settled `ui-design.md` rule covers it, propose
    the fix per the rule. If it's unsettled taste, **don't invent it** — propose
    logging 💬/🅿️ + an HR-item in `project/human-in-the-loop/review.md` or a
    `diverge` lane.
  - **(iii) Design fork (what the game *is*)** → propose surfacing it as an
    **HD-item**, log the FB-nn as 💬 — **never auto-decide** (PH4: surface forks
    async).

## 4 · Propose the lane → get the go-ahead (interactive gate)

**This is the heart of an interactive drain — do not skip it.** Present the whole
lane to the human in one concise message, one short block per item:

- **What** — the capture's **kind** (Bug / Question), the note (paraphrased) +
  the picked element, if any.
- **Repro** — confirmed / couldn't reproduce / needs their input.
- **Proposed action** — for a **Bug**: the fix (root cause + the concrete change),
  or the route (HR-item / HD-item / park) for taste / a design fork. For a
  **Question**: your **answer** (what you found) + any follow-up route it implies.

Then **stop and wait for the human's steer** — e.g. _"yeah sounds good, fix the
5"_, or per-item corrections ("skip #2", "make the delay 300 ms not 450"). **Fix
nothing and commit nothing until they reply.** While proposing, **use the
AskUserQuestion tool freely** — a design fork's direction, an ambiguous repro, a
taste call — drain is *meant* to be a back-and-forth, so ask rather than guess
(PH4).

Only once the human approves (in whole or with edits) do you proceed to §5+ and
land the approved items. Items they defer/reject are left in `pending/` (or
re-routed as they directed), not force-fixed.

## 5 · Log the F-entry + stamp the sidecar

F-numbering is **global**, but you never grep for the max — **the capture
already carries its number**: since ADR-171 the middleware stamps `FB-<n>` into
the entry heading + sidecar **at capture time** (single writer — race-free by
construction). Use that number. Only a legacy **unstamped** capture draws from
your claim's reserved block (`FB-<fbLo>..<fbHi>` from §0), in order; the
`inbox-ledger` verify gate REDs any duplicate above the FB-198 baseline, so a
collision can't reach `main` either way. Append to a **per-lane** drain-day file
`project/feedback-human/<YYYY-MM-DD>-playtest-<lane>.md` (create it with the
standard header if absent, source noted as *"async inbox capture"* — per-lane
so concurrent lanes never contend on one file), using the established per-item
template + status legend (🔲 open · 🔧 in progress · ✅ fixed · 🅿️ parked · 💬
needs-discussion):

```markdown
### F<nn> · <short title> — <status emoji>
**Verbatim:** _"<the capture note, exactly>"_
**Reading:** <interpretation of the intent>
**Doc-update plan:** <which living doc absorbs the taste, if any>
**Distilled rule:** <the general guideline, if any → § Taste distillation>
**Fixed in:** <commit hash — the commit IS the record>
```

**Graduate** distilled taste rules to `ui-design.md` / `fun-factor.md` exactly
as the FB-1–FB-117 loop does; ADR-worthy calls go to `decisions.md` **only with
the human** (via the HD-item).

## 6 · Complete = stamp the sidecar; archive when the whole BUCKET is done

**Per item**, completion is durable on the capture's own `<stamp>.json` sidecar
(never the machine-written `.md` — a `guard-inbox-pending.sh` hook blocks that):
write `status: "done"` + `fb` + `commit` (or `status: "parked"`) into it in the
same commit as the fix. That is what tells every other lane the item is handled
(ADR-171) — a cluster lane stamps items *inside buckets it doesn't otherwise
own*, and the bucket's own lane skips them.

**Per bucket**, archive when **every** sidecar in it is `done` (parked items
hold it open; the `inbox-ledger` gate REDs a fully-done bucket left in
`pending/`). Move the `.md` + the folder's `.json`s (`git mv`; the `.png`s are
git-ignored, plain `mv`):

```
git mv project/playtest-inbox/pending/<key>.md    project/playtest-inbox/archive/<key>.md
git mv project/playtest-inbox/pending/<key>/*.json project/playtest-inbox/archive/<key>/   # metadata (tracked)
mv     project/playtest-inbox/pending/<key>       project/playtest-inbox/archive/<key>       # leftover .pngs (ignored)
```

A live bucket may collect fresh captures after you archive it — that just
re-creates `pending/<key>.md` for the next pass. Archiving is per-pass
completion, not a claim the bucket is closed forever.

## 7 · One commit per entry

For each item the human **approved** in §4: the fix (if any) + the F-entry + a
journal line, staged **by explicit path only** (shared-tree rule — never
`git add -A`; `guard-git-add-all.sh` enforces the no-`-A` half, and the
sweep-guard wants the `git commit … -- <paths>` pathspec form). The `git mv`
(pending → archive) rides the **last** entry's commit for that session. Subject
style:

```
fix(ui): recenter the open-eyes button (FB-118, inbox drain)
```

Full `pnpm run verify` runs per commit as normal. If the shared tree is red on a
co-agent's WIP (not yours), commit locally and leave the push for a green window
— don't `SKIP_VERIFY` a red tree onto the remote.

## 8 · End of run — RELEASE the claim

**Release your lane(s)** (`tsx src/scripts/inbox-claim.ts release <lane...>`) —
holding a claim past the pass starves other agents (liveness only reaps *dead*
sessions, not idle ones). Then journal a summary (items drained, FB range used
from your block, any forks surfaced), and tell the human **how many captures
remain in `pending/`** — if any are left, offer to claim the next lane;
re-claim when you take it. Then the normal checkpoint loop. `pending/` need not
be empty — only the approved items are drained per pass.

Parallel lanes are sanctioned (ADR-171), but the shared tree is still shared:
pathspec commits only, never touch another lane's files, and a red `verify` may
be their WIP — don't fight it, don't `SKIP_VERIFY` past it.

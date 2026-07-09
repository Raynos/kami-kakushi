---
name: drain-inbox
description: Drain the playtest capture inbox — ONE bucket per pass, interactively, in batches of ≤5. Ask which bucket to drain, reproduce each pending capture from its embedded save, propose a fix/route (bug) or answer (question), get the human's go-ahead, then log an F-entry and archive it. Run as /drain-inbox [bucket]. User-invoked.
argument-hint: [bucket]
disable-model-invocation: true
---

# Drain the playtest capture inbox

Metabolize the DEV capture overlay's output (FB-3). Captures land in
`project/playtest-inbox/pending/` as **one markdown file per BUCKET, or per game
session when ungrouped**: `<key>.md` holds a header plus one `##` **entry** per
capture — where `<key>` is a **bucket slug** (`map-feedback.md`, `dev-tooling.md`)
when the human grouped the capture, else the **session id**
(`2026-07-06T11-49-35-2405fe.md`) for ungrouped captures. Each entry is LEAN (the
note + the picked element + a screenshot link + a **Details** link) and its
heading names its **kind** — `Bug ·` (a defect to fix) or `Question ·` (something
the human is exploring, to answer/discuss). The heavy machine data lives in a
sibling folder `<key>/`: `<stamp>.json` (the base64 save + recent logs + full
context + `kind`/`group`/`session`/`build` — **committed**) and `<stamp>.png`
(the screenshot — git-ignored). This skill drains those entries into the
established Fnn → fix → graduate loop, exactly as the human's live playtests do —
the human plays whenever, you drain whenever.

**Drain ONE bucket per pass, interactively and batched.** Buckets exist so a
drain doesn't sweep every kind of feedback at once — so **each pass is scoped to a
single bucket** (§1), takes **at most 5 captures**, reproduces them, then
**proposes a fix/route/answer for each and waits for the human's go-ahead** before
landing anything (§4). It's a back-and-forth — ask questions, take their steer —
not an autonomous sweep.

**The capture is a claim, not the truth (PH2).** Reproduce and verify every
capture against the *running* game before you touch code. Where the note and
the build disagree, the build wins.

## 0 · Stand-down check (shared tree / concurrent drains)

If another drain is in flight — `git status` shows uncommitted `pending/ →
archive/` moves, or an un-pushed `chore(inbox): intake …` sits at HEAD with
pending files still moving — **stop**; one drain lane at a time. Otherwise
proceed.

## 1 · Pick the bucket — then take up to 5 entries from it

**A drain pass is scoped to exactly ONE bucket.** First list the inbox files:
`project/playtest-inbox/pending/*.md` (the README is exempt). Classify each by its
filename: a name matching the session-id shape
`YYYY-MM-DDTHH-MM-SS-<token>` is an **ungrouped session file**; any other slug
(`map-feedback`, `dev-tooling`, `r0-feedback`) is a **bucket**.

**Choose the bucket to drain:**

- If `/drain-inbox <bucket>` was invoked **with an argument**, use that bucket
  (match it against the present buckets by slug; if none match, say so and list
  what's there).
- Otherwise, if there's more than one bucket / bucket + ungrouped present, **ask
  the human with the AskUserQuestion tool: _"Which bucket are we draining?"_** —
  one option per bucket present (plus **"Ungrouped (per-session captures)"** if any
  session files exist). This is the guard that stops one pass from draining every
  bucket at once.
- If only one group is present (one bucket, or only ungrouped files), drain that
  without asking.

**Then, within the chosen bucket only**, take a batch of **at most 5 captures
(`##` entries), oldest-first** — for a bucket that's its one `.md`; for
"Ungrouped" the batch may span several session `.md`s. Never process more than 5
in one pass, and **never cross into another bucket** — the rest wait for the next
pass (the human re-runs the skill / says "next 5" / names another bucket). Drain
is **interactive by design**: 5 is small enough to reproduce, propose, and review
together without overload.

**Empty (chosen bucket, or the whole inbox) → say so and stop** — this is the
per-run stopping condition; don't manufacture work from an empty inbox.

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
`archive/`. (The `<key>/` screenshot folders are git-ignored — never
staged.) This intake commit is also the concurrency claim: a second drain
seeing the clean intake at HEAD knows a drain is live.

## 3 · Per ENTRY — reproduce, then form a PROPOSAL (don't fix yet)

For each of the ≤5 batch entries, oldest first — reproduce it and decide the
fix/route, but **do not touch code or commit yet**. This step produces a
*proposal* per item; §4 gets the human's go-ahead before any fix lands.

**Read the WHOLE note first — it is often multi-line.** A capture note can be a
long, multi-paragraph proposal (line-broken with ` / ` or real newlines).
**Read the entire `**Note:**` block by eye** (Read the `.md` entry, or the
`<stamp>.json`'s `note` field) — **never** triage off a `grep`/`awk` that prints
only the first line after `**Note:**` (that made FB-121, a full design proposal,
look "truncated" — a mis-triage). If a note reads as cut-off, re-read the raw
entry before you believe it; genuine truncation is rare.

**Reproduce (verify the complaint against reality).** Read the entry's note +
its **Details** link → open that `<session>/<stamp>.json` for the full context
(seed, clock, location, rung, variants, viewport) + the `save` (base64) + recent
`logTail`. If the entry has an `**Element:**` line, that's the exact UI element
the note is about (a semantic label + selector + on-screen rect, and the
screenshot boxes it) — focus the repro there. Drive the game **headlessly** (never headed —
`.claude/hooks/enforce-headless-qa.sh` enforces it): `pnpm run dev`, navigate
with the captured variant/`?dev=no` params, `__qa.load('<the .json's save>')`,
resize to the captured viewport, then screenshot / observe. Confirm the symptom
is real before acting. (The entry's screenshot in `<session>/`, if present, is a
local aid; the save is authoritative.)

**First read the entry's KIND** (the `## Bug ·` / `## Question ·` heading, also
`kind` in the `.json`) — it's the human's own signal for what they want back:

- **`Question`** → the human is **exploring interactively**, not reporting a
  defect. Reproduce it, then **answer/discuss** it in the §4 batch (what you
  found, the trade-off, options) — do **not** reflexively propose a code fix. If
  the answer implies a real change, surface it as its own route (bug fix / taste
  HR-item / design HD-item) for the human to green-light; otherwise the
  deliverable is the answer + an F-entry logged 💬. Use AskUserQuestion freely —
  a question capture is an explicit invitation to a back-and-forth.
- **`Bug`** → a defect to fix; triage it by the three routes below.

**Triage → propose** — route by type (this is the established metabolization made
explicit). In every case you produce a *proposed action*, not a landed change:

- **(i) Mechanical bug** → propose the fix (root cause + the change you'd make),
  test-first where a test could go RED (the `tdd` skill). Reproduce in the
  running game first so the proposal is grounded, not guessed.
- **(ii) Taste / UI** → if a settled `ui-design.md` rule covers it, propose the
  fix per the rule. If it's unsettled taste, **don't invent it** — propose
  logging 💬/🅿️ + an HR-item in `project/human-in-the-loop/review.md` or a
  `diverge` lane.
- **(iii) Design fork (what the game *is*)** → propose surfacing it as an
  **HD-item**, log the FB-nn as 💬 — **never auto-decide** (PH4: surface forks
  async).

## 4 · Propose the batch → get the go-ahead (interactive gate)

**This is the heart of an interactive drain — do not skip it.** Present the whole
batch (≤5) to the human in one concise message, one short block per item:

- **What** — the capture's **kind** (Bug / Question), the note (paraphrased) +
  the picked element, if any.
- **Repro** — confirmed / couldn't reproduce / needs their input.
- **Proposed action** — for a **Bug**: the fix (root cause + the concrete change),
  or the route (HR-item / HD-item / park) for taste / a design fork. For a
  **Question**: your **answer** (what you found) + any follow-up route it implies.

Then **stop and wait for the human's steer** — e.g. _"yeah sounds good, fix the
5"_, or per-item corrections ("skip #2", "FB-123 is actually a design fork, don't
fix it", "make the delay 300 ms not 450"). **Fix nothing and commit nothing until
they reply.** While proposing, **use the AskUserQuestion tool freely** — a design
fork's direction, an ambiguous repro, a taste call, "which of these two fixes" —
drain is *meant* to be a back-and-forth, so ask rather than guess (PH4).

Only once the human approves (in whole or with edits) do you proceed to §5+ and
land the approved items. Items they defer/reject are left in `pending/` (or
re-routed as they directed), not force-fixed.

## 5 · Log the F-entry

F-numbering is **global** — the next free number after the current max across
`project/feedback-human/*.md` (grep `\bF[0-9]+\b`). Append to a per-drain-day
file `project/feedback-human/<YYYY-MM-DD>-playtest.md` (create it with the
standard header if absent, source noted as *"async inbox capture"*), using the
established per-item template + status legend (🔲 open · 🔧 in progress · ✅
fixed · 🅿️ parked · 💬 needs-discussion):

```markdown
### F<nn> · <short title> — <status emoji>
**Verbatim:** _"<the capture note, exactly>"_
**Reading:** <interpretation of the intent>
**Doc-update plan:** <which living doc absorbs the taste, if any>
**Distilled rule:** <the general guideline, if any → § Taste distillation>
**Fixed in:** <commit hash — the commit IS the record>
```

**Graduate** distilled taste rules to `ui-design.md` / `fun-factor.md` exactly
as the FB-1–FB-117 loop does; ADR-worthy calls go to `decisions.md` **only with the
human** (via the HD-item).

## 6 · Complete a session = archive (not delete)

A file is done when **every** `##` entry in it is drained. Then move it
from `pending/` to `archive/` along with its sidecar folder — completion is the
archive move, keeping the raw feedback durable long-term (like
`project/feedback-human/`). `<key>` is the bucket slug (or session id). The `.md`
and the folder's `.json`s are tracked (`git mv`); the `.png`s are git-ignored
(plain `mv`):

```
git mv project/playtest-inbox/pending/<key>.md    project/playtest-inbox/archive/<key>.md
git mv project/playtest-inbox/pending/<key>/*.json project/playtest-inbox/archive/<key>/   # metadata (tracked)
mv     project/playtest-inbox/pending/<key>       project/playtest-inbox/archive/<key>       # leftover .pngs (ignored)
```

A live bucket may collect fresh captures after you archive it — that just
re-creates `pending/<key>.md` (header re-written) for the next pass. Archiving is
per-pass completion, not a claim the bucket is closed forever.

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

## 8 · End of run

Journal a summary (items drained, Fnn range, any forks surfaced), then tell the
human **how many captures remain in `pending/`** — if any are left (the batch
capped at 5, or they deferred some), offer the next batch. Then the normal
checkpoint loop. `pending/` need not be empty — only the approved batch is drained
per pass.

Keep a **single drain lane** — never run two concurrent drains against the shared
tree.

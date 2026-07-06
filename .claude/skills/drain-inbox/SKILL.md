---
name: drain-inbox
description: Drain the playtest capture inbox — interactively, in batches of ≤5. Reproduce each pending capture from its embedded save, propose a fix/route, get the human's go-ahead, then log an F-entry and archive it. Run as /drain-inbox. User-invoked.
disable-model-invocation: true
---

# Drain the playtest capture inbox

Metabolize the DEV capture overlay's output (FB-3). Captures land in
`project/playtest-inbox/pending/` as **one markdown file per game session**:
`<session>.md` holds a header plus one `##` **entry** per capture — each entry is
LEAN (the note + the picked element + a screenshot link + a **Details** link).
The heavy machine data lives in a sibling folder `<session>/`: `<stamp>.json`
(the base64 save + recent logs + full context — **committed**) and `<stamp>.png`
(the screenshot — git-ignored). This skill drains those entries into the
established Fnn → fix → graduate loop, exactly as the human's live playtests do —
the human plays whenever, you drain whenever.

**Drain is interactive and batched.** Take **at most 5 captures per pass**,
reproduce them, then **propose a fix/route for each and wait for the human's
go-ahead** before landing anything (§4). It's a back-and-forth — ask questions,
take their steer — not an autonomous sweep.

**The capture is a claim, not the truth (PH2).** Reproduce and verify every
capture against the *running* game before you touch code. Where the note and
the build disagree, the build wins.

## 0 · Stand-down check (shared tree / concurrent drains)

If another drain is in flight — `git status` shows uncommitted `pending/ →
archive/` moves, or an un-pushed `chore(inbox): intake …` sits at HEAD with
pending files still moving — **stop**; one drain lane at a time. Otherwise
proceed.

## 1 · Read the queue — take up to 5 entries this batch

List `project/playtest-inbox/pending/*.md` **oldest-first** (the README is
exempt). Each is a session file with one or more `##` entries.

**Take a batch of at most 5 captures (`##` entries), oldest-first** — a batch may
span several session files, but never process more than 5 in one drain pass.
Drain is **interactive by design**: 5 is small enough to reproduce, propose, and
review together with the human without overload. If the inbox holds more, the
rest wait for the next pass (the human says "next 5" or re-runs the skill).

**Empty → say so and stop** — this is the per-run stopping condition; don't
manufacture work from an empty inbox.

## 2 · Intake-commit (durability before processing)

Commit *all* pending session files verbatim in one commit before touching
anything:

```
git add project/playtest-inbox/pending/*.md
git commit -m "chore(inbox): intake N session(s)" -- project/playtest-inbox/pending
```

This makes the raw bytes durable in git history *before* processing, so the
append-only/lossless norm holds even though each `.md` later moves to
`archive/`. (The `<session>/` screenshot folders are git-ignored — never
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
`.claude/hooks/enforce-headless-qa.sh` enforces it): `npm run dev`, navigate
with the captured variant/`?dev=no` params, `__qa.load('<the .json's save>')`,
resize to the captured viewport, then screenshot / observe. Confirm the symptom
is real before acting. (The entry's screenshot in `<session>/`, if present, is a
local aid; the save is authoritative.)

**Triage → propose** — route by kind (this is the established metabolization made
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

- **What** — the capture note (paraphrased) + the picked element, if any.
- **Repro** — confirmed / couldn't reproduce / needs their input.
- **Proposed action** — the fix (root cause + the concrete change) for a bug, or
  the route (HR-item / HD-item / park) for taste / a design fork.

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
`project/human-feedback/*.md` (grep `\bF[0-9]+\b`). Append to a per-drain-day
file `project/human-feedback/<YYYY-MM-DD>-playtest.md` (create it with the
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

A session file is done when **every** `##` entry in it is drained. Then move it
from `pending/` to `archive/` along with its sidecar folder — completion is the
archive move, keeping the raw feedback durable long-term (like
`project/human-feedback/`). The `.md` and the folder's `.json`s are tracked
(`git mv`); the `.png`s are git-ignored (plain `mv`):

```
git mv project/playtest-inbox/pending/<session>.md   project/playtest-inbox/archive/<session>.md
git mv project/playtest-inbox/pending/<session>/*.json project/playtest-inbox/archive/<session>/   # metadata (tracked)
mv     project/playtest-inbox/pending/<session>      project/playtest-inbox/archive/<session>       # leftover .pngs (ignored)
```

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

Full `npm run verify` runs per commit as normal. If the shared tree is red on a
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

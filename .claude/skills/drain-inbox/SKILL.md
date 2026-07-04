---
name: drain-inbox
description: Drain the playtest capture inbox — reproduce each pending capture from its embedded save, triage it, log an F-entry in the feedback log, and archive the capture. Run as /drain-inbox or under /loop. User-invoked.
disable-model-invocation: true
---

# Drain the playtest capture inbox

Metabolize the DEV capture overlay's output (F3). Captures land in
`project/playtest-inbox/pending/` as **one markdown file per game session**:
`<session>.md` holds a header plus one `##` **entry** per capture (each entry =
a note + at-a-glance context + a base64 save), and `<session>/` is a sibling,
git-ignored folder of that session's screenshots. This skill drains those
entries into the established Fnn → fix → graduate loop, exactly as the human's
live playtests do — the human plays whenever, you drain whenever, nobody waits.

**The capture is a claim, not the truth (R2).** Reproduce and verify every
capture against the *running* game before you touch code. Where the note and
the build disagree, the build wins.

## 0 · Stand-down check (shared tree / concurrent drains)

If another drain is in flight — `git status` shows uncommitted `pending/ →
archive/` moves, or an un-pushed `chore(inbox): intake …` sits at HEAD with
pending files still moving — **stop**; one drain lane at a time. Otherwise
proceed.

## 1 · Read the queue

List `project/playtest-inbox/pending/*.md` **oldest-first** (the README is
exempt). Each is a session file with one or more `##` entries — read them all.
**Empty → say so and stop** — this is the per-run stopping condition; a `/loop`
iteration on an empty inbox is a clean fast no-op (don't manufacture work).

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

## 3 · Per ENTRY — reproduce, then triage

For each `##` entry in each session file, oldest first (a session file may hold
many captures — process every entry):

**Reproduce (verify the complaint against reality).** Read the entry's note +
its `**Where:**` line (seed, clock, location, rung, variants, viewport) + its
`**Save:**` base64. Drive the game **headlessly** (never headed —
`.claude/hooks/enforce-headless-qa.sh` enforces it): `npm run dev`, navigate
with the captured variant/`?dev=no` params, `__qa.load('<the entry's Save
base64>')`, resize to the captured viewport, then screenshot / observe. Confirm
the symptom is real before acting. (The entry's screenshot in `<session>/`, if
present, is a local aid; the save is authoritative.)

**Triage** — route by kind (this is the established metabolization made
explicit):

- **(i) Mechanical bug** → fix now, test-first where a test could go RED (the
  `tdd` skill). Verify the fix in the running game, not just green gates.
- **(ii) Taste / UI** → if a settled `ui-design.md` rule covers it, fix per the
  rule. If it's unsettled taste, **don't invent it** — log 💬/🅿️ and route to
  an R-item in `project/human-in-the-loop/review.md` or a `diverge` lane.
- **(iii) Design fork (what the game *is*)** → surface as an **H-item** in
  `project/human-in-the-loop/`, log the Fnn as 💬 — **never auto-decide** (R4:
  surface forks async). The capture is still archived once logged; the F-entry
  + H-item are the distilled record, the archived `.md` holds the raw save.

## 4 · Log the F-entry

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
as the F1–F117 loop does; ADR-worthy calls go to `decisions.md` **only with the
human** (via the H-item).

## 5 · Complete a session = archive (not delete)

A session file is done when **every** `##` entry in it is drained. Then move it
from `pending/` to `archive/` (and `mv` its git-ignored screenshot folder
alongside) — completion is the archive move, keeping the raw feedback durable
long-term (like `project/human-feedback/`):

```
git mv project/playtest-inbox/pending/<session>.md project/playtest-inbox/archive/<session>.md
mv    project/playtest-inbox/pending/<session>     project/playtest-inbox/archive/<session>   # screenshots (git-ignored)
```

## 6 · One commit per entry

Fix (if any) + the F-entry + a journal line, staged **by explicit path only**
(shared-tree rule — never `git add -A`; `guard-git-add-all.sh` enforces the
no-`-A` half, and the sweep-guard wants the `git commit … -- <paths>` pathspec
form). The `git mv` (pending → archive) rides the **last** entry's commit for
that session. Subject style:

```
fix(ui): recenter the open-eyes button (F118, inbox drain)
```

Full `npm run verify` runs per commit as normal. If the shared tree is red on a
co-agent's WIP (not yours), commit locally and leave the push for a green window
— don't `SKIP_VERIFY` a red tree onto the remote.

## 7 · End of run

Journal a summary (items drained, Fnn range, any forks surfaced), confirm
`pending/` is empty, then the normal checkpoint loop.

## `/loop` guidance

Runnable overnight as `/loop /drain-inbox`. Each iteration: stand-down check →
read `pending/` → **empty ⇒ exit fast** (a no-op tick, no busywork) → else drain
oldest-first as above. Keep a **single drain lane** — never run two concurrent
drains against the shared tree.

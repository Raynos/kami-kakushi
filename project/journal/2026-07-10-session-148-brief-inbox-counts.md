# Session 148 — 2026-07-10 — inbox headline in the session brief

**Summary:** The human wanted to see the feedback-inbox shape at a glance
without asking an agent. The session brief now opens with a one-line headline —
`Inbox: dev 8, r0 22, the-log 4` — counting the OPEN captures per pending
bucket, as its very first line.

## What changed
- `src/scripts/session-brief.sh` — new headline block emitted before the brief
  header. For each `project/playtest-inbox/pending/<bucket>/` (skipping
  `.claims`), counts the `<stamp>.json` sidecars NOT stamped `status: "done"`
  (the drain-inbox completion stamp; `parked` counts as open since it holds a
  bucket open). Silent when nothing is open (the no-cry-wolf norm), same as the
  existing 📥 nudge further down.

## Why sidecars, not `.md` files
The existing 📥 line counts `pending/*.md` (one per bucket) — bucket presence,
not workload. The per-item truth is the sidecar `status` field written by the
drain flow (drain-inbox SKILL §6), so the headline subtracts done items and
reads as remaining work.

## Verification
Ran `bash src/scripts/session-brief.sh` — headline reads
`Inbox: dev 8, r0 22, the-log 4`, matching hand-counted sidecars
(dev 11 total / 3 done, r0 25 / 3, the-log 4 / 0).

## Next intended steps
- None — single-request change, complete.

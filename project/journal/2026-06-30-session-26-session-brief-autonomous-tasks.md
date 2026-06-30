# Session 26 — 2026-06-30 — session-brief: suggest next autonomous work

**Summary:** The human asked the session-start brief to also help identify the
**next autonomous tasks** (up to 3), not just surface the human queue. Final
design — after two course-corrections — is an **investigation nudge**, not a
stored list: `session-brief.sh` points the agent at the sources already kept
current (recent commits, the active plan, project-status, latest journal,
roadmap) and tells it to **propose ≤3 startable tasks, verifying against git**.
No new file, no parsed/maintained task list. Script + this journal only; not a
canon change.

## The two course-corrections (why the final shape)
1. First cut created `project/status/next-tasks.md` — a hand-maintained agent
   queue. Human pushback: "yet another file every agent has to keep up to date."
   **Deleted it** (never committed).
2. Second cut had the script auto-pick "the newest plan in `docs/plans/`" as the
   active one. Human: investigate from the whole repo/commits; **verify, don't
   trust**. Audit proved the heuristic wrong → final investigation-nudge shape.

## What the audit found (verify, don't trust)
- **`docs/plans/` is NOT self-cleaning.** It currently holds 3 plans, 2 finished:
  `2026-06-30-history-rewrite.md` is `✅ DONE`, `2026-06-29-overnight-v03-completion.md`
  is an old finished mandate, only `2026-06-30-v0.3.1-build.md` is `APPROVED …
  not started` (the real active one). So **file order ≠ active** — only each
  plan's own **Status line** is trustworthy. The brief now tags each plan
  DONE-vs-maybe-active from `head -8 | grep Status`, and only ever under-claims
  (no Status line → "maybe active, verify"), never falsely says DONE.
- **`roadmap.md`** has a real status legend (✅ shipped · 🔧 · 🆕 · ⏳); the next
  🆕/⏳ fun-slice is the wider-horizon signal.
- "Next work" genuinely lives across **commits + project-status + active plan +
  journal + roadmap** — no single source, which is why the brief points at all
  of them and asks the agent to synthesise + cross-check.

## What changed
- `src/scripts/session-brief.sh` — after the human queue, a new
  "🤖 Next autonomous work — investigate, then propose up to 3" section. It:
  prints the last 6 commits inline (git is the source of momentum); lists every
  plan in `docs/plans/` tagged ✅DONE / ▶️maybe-active from its Status line;
  points at project-status's "How to resume → Next, in order", the newest
  journal's "Next intended steps", and the roadmap. All paths are computed live
  (newest journal, plan list) so nothing rots; **no stored task list**. Header
  doc-comment updated (source #6). Reused the existing buffer/`add` style.
  Commit `d554db3`.
- `AGENTS.md` — "Session start" bullet now documents that the brief also nudges
  next-autonomous-work (was human-queue-only), incl. the "trust the Status line,
  not the filename" rule. Human asked to push + document.

## Next intended steps
1. Pushed as a checkpoint (human asked). Done.
2. The actual next autonomous work (per the brief itself): v0.3.1 build — but
   the human paused me from starting it this session; awaits their go.

## Landmines
- **Shared tree this session:** a concurrent agent landed `9a505e5`/`9b90d67`/
  `7ca6ac2` + the AGENTS.md "Philosophy" section + `docs/philosophy/…`. Stage
  ONLY my two files by explicit path; never `-A`/`-a`.
- The plan done/active tag is a heuristic (`grep Status`); it's intentionally
  conservative (under-claims), but a plan with no Status line shows "maybe
  active" even if finished (e.g. the overnight-v03 mandate) — the brief tells
  the agent to confirm, by design.

# History rewrite — scrub raw JSON dumps + swap `Co-Authored-By` → `Assisted-by`

**Status: ✅ DONE — executed 2026-06-30** (Option A; human-approved force-push).
Rewrote all 269 commits via `git filter-repo` in one pass: scrubbed 58
`project/brainstorms/raw/*.json` blobs from all history and converted every AI
`Co-Authored-By` trailer to `Assisted-by: Claude Code:claude-opus-4-8[…]`
(194 `[1m]` + 55 plain, preserving the 1M-context distinction; prose mentions
and untagged commits untouched). Force-pushed `c5e2a67…839f98d` to `origin/main`
(pre-push gate green). `gh-pages` carried no dumps — left as-is.

**Backups retained until all clones confirm healthy:** `backup/pre-rewrite-2026-06-30`
branch + mirror clone at `../kami-kakushi-backup.git`.

**Aftermath — every other clone must re-sync** (old SHAs are gone; no
fast-forward across a rewrite): `git fetch origin && git reset --hard origin/main`.

---
_Original plan preserved below for the record._

## Goal

One filter-repo pass over `main` that does two things at once (single SHA churn):

1. **Remove the raw `Workflow`-output JSON from all history** — the verbatim
   snapshots under `project/brainstorms/raw/*.json` (already git-ignored, so only
   in history, not the live tree) bloat the repo.
2. **Rewrite commit messages to the current convention** — strip the old
   `Co-Authored-By: Claude … <noreply@anthropic.com>` trailers and any
   `🤖 Generated with…` emoji banners, replace with the `Assisted-by:` trailer
   (CLAUDE.md already flags this as "a separate, human-approved step").

## Go conditions (blocking precondition — coordination)

A rewrite changes **every commit SHA on `main`**. Any agent with `main` checked
out and unpushed local work will diverge and can lose it. Before execution:

1. **All other agents parked + fully pushed** — no unpushed local work anywhere
   at the moment of rewrite. Everything that must survive has to be on
   `origin/main` first. (At last check there was an unrelated in-flight WIP in
   `project/human-in-the-loop/archive.md` belonging to another agent — that must
   land or be discarded first.)
2. **Human picks message-rewrite scope: A or B** (see below).

## Message-rewrite scope — the decision

**DECIDED: Option A** (human, 2026-06-30).

- **Option A (recommended, CHOSEN) — mechanical trailer swap.** Strip
  `Co-Authored-By: Claude …` + emoji-banner lines via filter-repo
  `--message-callback`; append `Assisted-by: Claude Code:claude-opus-4-8[1m]`.
  The entire history was authored by Opus 4.8, so that exact model string is
  correct for every commit — no `:unknown` needed. Deterministic, scriptable,
  low-risk. Optionally also fix any *subject* that already violates
  Conventional-Commits — but do **not** reflow every body.
- **Option B — full editorial rewrite** (50/72, Conventional subjects,
  intent-led bodies for every commit). Not a regex job; needs an agent per
  commit. High cost, real risk of distorting the historical record. Not
  recommended.

## Procedure (once go conditions met)

0. **Recon (read-only):** `git log --all --oneline | wc -l` (commit count);
   `git log --all --diff-filter=A --name-only -- 'project/brainstorms/raw/*.json'`
   (confirm exactly what's being scrubbed); `git filter-repo --version`
   (install via `brew install git-filter-repo` if missing — use filter-repo,
   **not** the deprecated `filter-branch`, **not** BFG).
1. **Back up first:** `git branch backup/pre-rewrite-2026-06-30` **and** a full
   mirror clone outside the repo (`git clone --mirror . ../kami-kakushi-backup.git`).
   The remote rewrite is irreversible; keep a bail-out.
2. **Rewrite (one pass, path filter + message callback together):**
   `git filter-repo --path-glob 'project/brainstorms/raw/*.json' --invert-paths`
   plus a `--message-callback` performing the Option-A trailer/banner swap.
3. **Re-wire + verify:** filter-repo drops `origin` by design —
   `git remote add origin <url>` back. Run `npm run verify` (green). Spot-check:
   `git log --all -- 'project/brainstorms/raw/*.json'` returns **nothing**; new
   trailers present; blobs gone from `git cat-file --batch-all-objects`.
4. **Force-push (needs explicit human go):**
   `git push --force-with-lease origin main` (`--force-with-lease`, not `--force`
   — refuses if `origin/main` moved, i.e. an agent didn't actually park).
5. **Aftermath:** every other clone (other agents, CI, other machines) must
   `git fetch && git reset --hard origin/main` — old SHAs are gone, no
   fast-forward across a rewrite. Delete the backup branch only once all clones
   confirm healthy.

## Caveats

- **GitHub caches force-pushed commits** for a while (reachable via API/cached
  views). If any dump was *sensitive* (not just bulky), the force-push alone is
  not enough — contact GitHub support. If it's purely housekeeping/bloat, the
  push suffices.
- Anyone who has cloned must re-clone or hard-reset.

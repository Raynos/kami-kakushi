# Session 150 — 2026-07-10 — inbox headline: per-bucket "(N in progress)"

**Summary:** Reshaped the session-brief inbox headline to the exact form the
human asked for so a "gm"/"gn" turn opens with it:
`Playtest inbox - r0 (25 in progress) dev (11 in progress) the-log (4 in progress)`.

## What changed
- `src/scripts/session-brief.sh` — the first-line inbox headline now:
  - renders each bucket as `<bucket> (<n> in progress)` (was `<bucket> <n>`),
    biggest bucket first (numeric desc), space-separated, label
    `Playtest inbox -` (was `Inbox:`);
  - counts **all** capture sidecars in each `pending/<bucket>/`, done or not — a
    mid-drain `status:"done"` stamp no longer subtracts from the count, because
    the bucket stays in progress until it is drained AND archived out of
    `pending/`. This is why the old headline read `dev 8, r0 22` while the buckets
    actually held 11 / 25 captures.
  - Header docstring gains item 0 documenting the headline.

## Follow-up — make the headline AGGRO (agents were dropping it)

The format fix wasn't enough: a co-agent got a "gm" turn and relayed Open
Decisions + Open Reviews but **dropped the `Playtest inbox - …` line entirely**
— it treated the bare first line as ambient preamble. The human (emphatic) wants
it surfaced as reliably as the HD/HR sections. Fix, in three reinforcing places:
- `src/scripts/session-brief.sh` — the inbox line is now wrapped in a loud
  `🚨📥 MANDATORY … MUST OPEN WITH THE EXACT LINE BELOW` box (verbatim, above
  everything), + a second `🚨` reminder line under the brief header. Also: the
  headline now prints even when empty (`empty (all buckets drained ✅)`) so the
  habit holds.
- `AGENTS.md` — the always-loaded "Session start" bullet now mandates the
  `Playtest inbox - …` headline as the FIRST line of the relay, verbatim.

## Next intended steps
1. None — self-contained. Watch the next real "gm"/"gn" turn to confirm the
   headline actually leads the relay; escalate further (a UserPromptSubmit hook
   that injects the line on gm/gn) only if agents STILL drop it.

## Landmines
- The count is now "all sidecars in the bucket", not "not-yet-done sidecars". If
  we ever want a done-vs-open split back, it's the `grep '"status".*"done"'` line
  that was removed.
- Ordering is numeric-desc by count; ties fall back to `sort -rn`'s stable order,
  not alphabetical.

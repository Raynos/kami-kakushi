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

## Next intended steps
1. None — self-contained tweak. Format is verified against a live run.

## Landmines
- The count is now "all sidecars in the bucket", not "not-yet-done sidecars". If
  we ever want a done-vs-open split back, it's the `grep '"status".*"done"'` line
  that was removed.
- Ordering is numeric-desc by count; ties fall back to `sort -rn`'s stable order,
  not alphabetical.

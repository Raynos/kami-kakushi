# Session 157 — inbox brief: pending vs in-progress status

## What & why

The session-brief `Playtest inbox - …` headline labelled **every** pending
bucket "in progress", which read as "an agent is on it" when nobody was. The
human hit this on `gm`: only the `mapsheet` bucket had a live `/drain-inbox`
running, yet all 8 buckets showed "in progress".

Fixed `src/scripts/session-brief.sh` to derive per-bucket status from the
ADR-171 drain-lane claims: a bucket reads **in progress** only when a claim
file (`.claims/<lane>.json`, lane defaults to the bucket name) covers it,
otherwise **pending**. Mirrors the existing claims-line's cheap contract
(claim-file presence; liveness is checked at claim time, not in the brief), so
it stays pure-bash and fast — no `tsx` spawn.

Now: `mapsheet (3 in progress)` and every unclaimed bucket `(… pending)`.

## Next intended steps

- None — self-contained brief fix.

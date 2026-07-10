# Session 141 — 2026-07-10 — parallel inbox drains: claims, capture-time FB numbers, whole-lane passes

**Summary:** The human reversed the drain-inbox single-lane rule — buckets exist
so drains can run in parallel — and asked for an explicit "I am marking this
in-progress" protocol plus a durable re-group ("an item moved from bucket X to
lane Y must not be addressed twice"). Designed and built the whole thing in one
pass (ADR-171): lane claims, capture-time FB allocation, the durable
fix-surface scan, per-lane F-logs, the `inbox-ledger` gate, a pending-`.md`
edit guard, and the skill/README/AGENTS.md rewrite. Also mid-flight: warned the
two live drain lanes (w6:p1 cold-open, w6:p2 feedback-ui) off the F-number race
that was about to double-allocate FB-198, and off the shared VN stylesheet.

## The design (project/brainstorms/2026-07-10-concurrent-drain-safety.md)

The governing split: **in-progress is ephemeral** (git-ignored
`pending/.claims/<lane>.json`, atomic O_EXCL create, validated by owner
LIVENESS via the herdr pane roster — reapable, never a TTL guess, never a
commit per lock) — **completion and re-grouping are durable** (fields on each
capture's own `<stamp>.json` sidecar: `lane`/`surface`/`status`/`fb`/`commit`,
defaults-by-absence so the 40+ existing sidecars need no migration). Sidecars,
not a central ledger, because N lanes marking items done in one file recreates
the very append race being killed; the middleware writes each sidecar exactly
once, so per-item fields are contention-free by construction.

Two human follow-ups mid-build sharpened it:

- **FB numbers allocate at CAPTURE time** — the middleware is the single
  writer, so `stampCapture`/`nextFbNumber` stamp `FB-<n>` into the entry
  heading + sidecar as the capture lands; the claim's reserved block demotes to
  a legacy-only fallback for unstamped captures. Race dead at the source.
- **A pass drains the WHOLE lane** — the ≤5 batch cap is retired; the
  wholesale §4 proposal stays the interactive gate.

## What was built

- `src/scripts/inbox-lanes.ts` (+ 13 tests) — the shared pure core: item
  reading, surface tokens (stable collision KEYS, not file paths), collisions,
  FB allocation parsing (unified F/FB space, template + `(resolved)` excluded,
  FB-198 grandfather baseline), claims, liveness, ledger findings.
- `src/scripts/inbox-claim.ts` — claim / list / release / reap + the announce
  (live lanes + fix-surface collisions to relay to the human).
- `src/scripts/inbox-regroup.ts` — `scan` seeds surfaces + reports cross-bucket
  clusters (on the real inbox: vn-overlay spans 3 buckets, log-panel 2,
  work-actions 2 — the speaker-colour cluster found mechanically); `assign`
  re-lanes durably. Idempotent; done/parked never touched.
- `src/scripts/playtest-inbox.ts` — `stampCapture` + `nextFbNumber` (+ 3
  tests); the handler stamps every new capture.
- `src/scripts/inbox-ledger.ts` — the verify gate (registered in `gates.ts`,
  docs scope): duplicate fb stamps, post-baseline duplicate heading
  allocations, done-without-record, fully-done bucket left in pending/.
  Verified green against the real repo BEFORE registration (other lanes run
  this gate mid-drain).
- `.claude/hooks/guard-inbox-pending.sh` (+ settings.json wiring) — blocks
  hand-edits to machine-written `pending/*.md`; exit-2 path tested.
- `src/scripts/session-brief.sh` — surfaces live lane claims at session start.
- Rewritten: drain-inbox `SKILL.md` (§0 claim step, §5 capture-time numbers,
  §6 sidecar completion, §8 release; whole-lane passes), inbox `README.md`
  lifecycle, the AGENTS.md inbox bullet, `.gitignore` (+`.claims/`), ADR-171.

## Enforcement ladder (the "how do we lock this in" ask)

Gate: `inbox-ledger` (content invariants only — can't cry wolf). Hook:
`guard-inbox-pending.sh` (Edit|Write) + the existing sweep-guard. Skill: the
rewritten drain procedure. Norm: AGENTS.md bullet + README + ADR-171.
Deliberately NOT gated: requiring a claim before an F-allocation commit —
claims are git-ignored ephemera CI can't see, and the human hand-writes
F-entries; the ledger catches the harm (duplicates) rather than the etiquette.

## Deferred / accepted risk

Worktree isolation (the only real fix for two lanes editing one file and
sharing one `verify` tree) — its own future ADR. Until then "don't fight
someone else's red" carries the load. The regroup scan seeded `surface` into
40 real sidecars this session (committed with this work).

## Next intended steps

- The two live lanes finish under warned coordination; the speaker-colour
  cluster (`vn-overlay`) should be claimed as ONE lane by whoever takes it.
- r0 (22 items) + dev (1 item) are unclaimed — first claimant tests the
  protocol end-to-end for real.
- Consider a capture-overlay change so the human can name NEW buckets by fix
  surface at capture time (cuts future regroup work).

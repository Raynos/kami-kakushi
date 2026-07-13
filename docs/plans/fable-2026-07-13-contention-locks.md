# Serialize the shared tree's pushes and exits — the ADR-196 locks

**Status:** ▶️ IN PROGRESS (2026-07-13, session 199 — building)

> **Build-time deltas, human-locked 2026-07-13 (session 199 Q&A):**
> (1) push flow = **wrapper** `pnpm run push` (claim → push →
> release-on-exit) + `guard-bash-safety.sh` BLOCKS bare `git push`
> — a PreToolUse hook can't release a claim, so the plan's
> "hook auto-claims" shape is dead; no new hook file, no
> settings.json edit. (2) claims validate by **liveness + reap,
> not TTL** (the ADR-171 pattern — its design note rejects guessed
> TTLs). (3) destructive hard-block covers **five verbs**
> (restore/checkout/stash + reset --hard + clean -f) in tree-wide
> form, NO env escape (named paths are the escape), isolated
> worktrees exempt; named-path forms keep today's warn. (4) the
> bypass ledger is **auto-staged by pre-commit** whenever dirty.
**Confidence:** ( 70% Opus, 30% Fable ) — the protocol judgment is
already spent (ADR-196 locked every fork with the human); what
remains is careful hook/script mechanics with liveness edge cases.
**Template:** process

## Who builds this — Fable or Opus?

Opus can build it. The design decisions (lock scope, held-lock
behavior, escape-hatch teeth) are all human-locked in ADR-196; the
work left is scripts + hooks in the `inbox-claim.ts` mold, with
tests. Fable only if the claim-liveness edge cases start fighting
back.

## Why

Measured (session 199,
[analysis](../../project/brainstorms/2026-07-13-hot-file-contention-analysis.md)):
**72 of 548 sessions (13%) hit a hard git collision** — 218
`failed to push some refs`, 133 `index.lock`, 54 concurrent-git-
process errors. One transcript shows
`SKIP_SWEEPGUARD=1 git restore --staged --worktree .` — a
whole-tree restore under bypass, the exact operation the sweep
guard exists to stop. The human locked the fixes as **ADR-196**
(grill capture:
[2026-07-13-multi-agent-contention-fixes.md](../../project/brainstorms/2026-07-13-multi-agent-contention-fixes.md)),
including two direct quotes that bind behavior: push lock held →
*"leave-local, its fine, another push will happen eventually"*;
exit lock held → *"bounded wait that hits the OOPS output of
prepare to exit when the wait times out."*

## What exists today

Survey date 2026-07-13, this session, against the live tree:

- `src/scripts/inbox-claim.ts` + `inbox-lanes.ts` — the ADR-171
  claim pattern: git-ignored claim files under
  `pending/.claims/`, owner-pane liveness validation, `reap` for
  dead claims, reserved F-number blocks (`fbAllocations` /
  `fbHighWater`). This is the pattern to generalize, not rebuild.
- `.githooks/pre-push` — unconditional FULL verify on push;
  already prints the herdr peers advisory. No claim/mutex today.
- `.claude/hooks/guard-git-add-all.sh` — blocks `git add -A/-a/-u`,
  adds of tracked files, and stash/checkout/restore of unauthored
  files; `SKIP_SWEEPGUARD=1` currently bypasses ALL of it,
  including tree-wide destructive ops. 34 real bypass uses in 9
  sessions (22 commits, 11 adds, 1 whole-tree restore).
- `.claude/skills/prepare-to-exit/SKILL.md` — has the OOPS output
  contract (lines ~41–80): incomplete/unsound exits report OOPS
  instead of claiming BYE. No lock today; parallel exits thrash
  the snapshot/queues (project-status.md: 312 commits, 124
  cross-scope rapid re-touches ≤20 min).
- `docs/living/decisions.md` — ADR numbers are taken by "next free
  at write time" (ADR-195 note); nothing prevents two live
  sessions taking the same number.

## Steps

1. **`src/scripts/tree-claim.ts`** — generalize the claim core out
   of `inbox-lanes.ts` (shared helpers stay put; no behavior
   change to inbox-claim). Lanes: `push`, `exit`, `adr`. Claims
   are git-ignored files under `project/.claims/` (add to
   `.gitignore`), owner pane + liveness + TTL; `claim / list /
   release / reap` CLI. Unit tests (COMMIT lane — must stay
   milliseconds, ADR-176).
2. **Push lane** — new PreToolUse hook
   `.claude/hooks/guard-push-claim.sh` wired in
   `.claude/settings.json`: intercepts `git push`; if another LIVE
   agent holds `push`, **block with a "left local — holder is
   <pane>" message** (never wait, per ADR-196); else auto-claim.
   Claims expire by TTL + owner liveness (no manual release
   needed; `reap` covers crashes). Escape: `SKIP_PUSHCLAIM=1`.
3. **Exit lane** — `prepare-to-exit/SKILL.md` gains step 0: claim
   `exit` with **bounded wait** (poll ≤5 min); on timeout, exit
   through the existing OOPS output naming the holder; release at
   BYE/OOPS. (Skill-rung: the ritual is agent-run prose, so the
   claim command is a step, not a hook.)
4. **Sweep-guard teeth** — `guard-git-add-all.sh`: under
   `SKIP_SWEEPGUARD=1`, STILL block destructive verbs
   (restore/checkout/stash) and tree-wide targets (`.`, `-A`,
   missing pathspec) — bypass requires explicit named paths; every
   bypass appends one line (date · pane · command) to a committed
   ledger `project/status/sweepguard-ledger.md`.
5. **ADR lane** — `tree-claim.ts adr` reserves the next ADR
   number(s) (F-number-block pattern; high-water read from
   `docs/living/decisions.md`, and from `docs/living/decisions/`
   once the shard plan lands). Norm update in
   `working-agreements.md`: claim before writing an ADR.
6. **Docs ripple** — `working-agreements.md` Checkpoint section +
   AGENTS.md "How to work here" gain the push-flow and exit-lock
   lines; `docs/repo-map.md` gains `project/.claims/` +
   `tree-claim.ts`.

## Verification

- `tree-claim` unit tests: claim/steal/TTL-expiry/liveness-reap,
  ADR high-water arithmetic — each can go RED (assert against a
  fixture claim dir, not the live one).
- Hook RED-ability proven the ci-red-proof way: in a throwaway
  worktree, hold a fake live `push` claim → `git push` must BLOCK;
  drop liveness → must pass. Same for a `SKIP_SWEEPGUARD=1 git
  restore .` → must still block.
- Ledger append proven: one bypass in the worktree → ledger line
  exists.
- Budget: hooks add ~ms to PreToolUse, nothing to the commit lane;
  `pnpm run verify:budget` stays <5s median.

## Sync ripple

- **PRD:** none — process/tooling, no game-facing change.
- **Story-bible:** none — no fiction touched.
- **Living docs / registries:** `working-agreements.md` +
  AGENTS.md + `repo-map.md` per Step 6; no gen registries move.
- **CHANGELOG:** none — no version bump; player-invisible.

## Teeth

- Push mutex: **hook** (PreToolUse) — a gate can't see other
  agents' liveness at verify time; hook is the highest sound rung.
- Exit lock: **skill step** — prepare-to-exit is prose-driven;
  its OOPS path is the enforcement.
- Sweep-guard tightening: **hook** (existing rung, sharpened).
- Bypass ledger: **hook-written, committed file** — visible in
  diffs, greppable, no gate needed (a gate on "ledger current"
  can't be sound: hooks can be bypassed with env vars).
- ADR claim: **norm + script** for now; the shard plan's index
  gate can later check for duplicate ADR numbers (sound: pure
  content invariant).

## Human-in-the-loop

- Files no new HR/HD — every fork was ruled in the 2026-07-13
  grill (ADR-196). Open details are agent-pickable: TTL values
  (default: push 10 min, exit 15 min, adr 24 h), poll cadence.
- If the exit-lock bounded wait proves annoying in practice, that
  is feedback for the human queue, not a silent re-design.

## Non-goals

- No full checkpoint lock — the human explicitly rejected it
  (Q2, grill capture).
- No retrospective audit of the 34 historic sweep-guard bypasses
  (Q6 ruling).
- No index.lock retry wrapper in v1 — leave-local + next push
  covers the pain; parked in the capture's open flags.
- No change to coordination-doc layout (that is the shard plan /
  ADR-196 §5, and only for decisions.md).

## Risks

- **Seam:** owns `.claude/hooks/guard-git-add-all.sh` (edit),
  `.claude/hooks/guard-push-claim.sh` (new),
  `src/scripts/tree-claim.ts` (new), `inbox-lanes.ts` (refactor
  export only), `prepare-to-exit/SKILL.md`,
  `working-agreements.md`, AGENTS.md, `repo-map.md`,
  `.claude/settings.json`. No live plan
  (sickroom / merchant / dialogue-live-swap) touches these; the
  render-split plan depends on the push mutex being live but
  shares no files. `.claude/settings.json` is shared config —
  land that edit in its own small commit inside a watched green
  window.
- Hook false-positives (stale claim blocking pushes) are the
  cry-wolf risk — TTL + liveness reap must be tested first;
  `SKIP_PUSHCLAIM=1` is the escape while trust builds.
- Settings.json hook edits only take effect on session restart
  (global CLAUDE.md gotcha) — announce via herdr after landing.

## Rollback

Remove the two hook entries from `.claude/settings.json` (hooks
become inert), delete `project/.claims/`; the skill step and
guard tightening revert as plain git reverts. Escapes exist per
mechanism: `SKIP_PUSHCLAIM=1`, `SKIP_SWEEPGUARD=1` (now
path-scoped), `SKIP_VERIFY=1` unchanged.

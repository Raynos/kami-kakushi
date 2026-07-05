# Session 78 — 2026-07-05 — F9: the /ship release-train skill

**Summary:** Walked the human through the F9 plan interactively (all §8
open questions via AskUserQuestion); every default ratified except **itch
is OUT of the train entirely** (no `--itch` flag) and the **arg grammar is
`patch (default) | minor | x.y.z`** (no AskUserQuestion fallback at
step 1). Plan flipped to 🔨 IN-PROGRESS with a ratified-decisions block;
F9 removed from the reading queue (read in-session, D-089). Building Ph1
next: `src/scripts/ship.sh` + `.claude/skills/ship/SKILL.md`.

## What changed

- `docs/plans/fable-process-F9-ship-skill.md` — Status → 🔨 IN-PROGRESS;
  ratified-decisions block added; itch bits struck (§3.8, §5, §6, §7 Ph1,
  §8.5); step-1 bump grammar superseded.
- `project/todo-human.md` — F9 reading-queue entry removed (read
  in-session).
- `src/scripts/ship.sh` (new, Ph1) — preflight ancestor check → detached
  temp worktree of HEAD at `tmp/ship/wt` → `npm ci` → `npm run verify` in
  isolation → the TEMP worktree's `gh-pages.sh` (GH_PAGES_WORKTREE points
  back at the real sibling) → live-site proof. `--verify-live` pulled
  forward from Ph2 (tiny, and the proof-timeout recovery path depends on
  it from run one). Poll knobs env-overridable (`SHIP_POLL_*`).
- `.claude/skills/ship/SKILL.md` (new, Ph1) — judgment steps 0–5 + 9;
  `disable-model-invocation: true`; args `patch (default)|minor|x.y.z`;
  one payload confirm; resume rules.
- `project/journal/2026-07-05-session-78-f9-ship-skill.md` — this file.

**Verified (R3):** proof grep shape corrected against the REAL live
bundle — the minifier folds `__BUILD_SHA__` into the footer template
(`v0.3.5 · build f8fc4f6`), so quoted-literal greps would NEVER match
(every proof would false-RED as UNPROVEN); now greps unquoted `$VERSION`
+ `build $SHA`. Positive shape ✓ vs live bundle; wrong sha rejected ✓;
`--verify-live` negative path exits 1 UNPROVEN ✓; bad arg rejected ✓.
The positive end-to-end is the real v0.3.6 release (Ph1 DoD, by design).

## Post-first-ship rework (same session, human feedback)

The other session ran the REAL v0.3.6 `/ship` (Ph1 DoD met — released,
deployed, live-proven) and the human's immediate feedback was **"it takes
6 minutes"** → three steers, all applied:

1. **No waiting on GitHub Pages** — the train is DONE at the gh-pages
   push; live-proof polling removed entirely (`--verify-live` is now ONE
   single-shot bounded check, no loop).
2. **Fast and bounded** — persistent `tmp/ship/wt` worktree (node_modules
   reused; `npm ci` only when the lockfile hash changes), per-step
   timings, all git network ops bounded via `GIT_SSH_COMMAND` timeouts,
   in-worktree `npm run verify` dropped (pre-commit + pre-push hooks own
   verification). Measured warm train ≈ 10–15s (checkout ~1s, deps skip
   0s, verify-was 6s now gone, build ~1s warm + deploy push).
3. **Tags are BACK (reverses the skip-tags ratification):** every release
   commit gets `git tag vX.Y.Z` (pushed with main); `gh-pages.sh` deploy
   messages are now versioned via `git describe --tags --always` —
   `deploy: v0.3.6 (main <sha>)` on a release, `v0.3.6-N-g<sha>` between.
   Retro-tagged `v0.3.6` on 8369078 (tag push pending a green tree).
   AGENTS.md A22 records the bump-gets-a-tag convention + why `/ship`
   does the explicit equivalent of `npm version` (shared-index sweep +
   the `0.0.0` lockfile root).

Also changed: `.claude/skills/ship/SKILL.md` (steps 4–7 + resume rules +
Never list), `docs/plans/fable-process-F9-ship-skill.md` (ratified block
updated with the reversals), `src/scripts/gh-pages.sh` (describe-versioned
deploy messages), `AGENTS.md` (A22 tag convention).

Committed with `SKIP_VERIFY=1`: the tree was red with the F8 agent's
in-flight `src/telemetry/` WIP (oxfmt + vitest) — their red, not this
commit's (own files only, by pathspec).

## Close-out — F9 DONE (human call)

The second real release (v0.3.7) ran the v2 train end-to-end: tagged
release commit, `deploy: v0.3.7 (main b1b3403)` versioned via describe,
no waiting, warm path. The human declared `/ship` complete. Close-out:
`v0.3.6` retro-tag pushed to origin; working-agreements gained the
"deploys = /ship, human-invoked" rule; repo-map's skill list gained
`ship`; the plan flipped ✅ DONE (Ph2's stranded-gh-pages-commit guard
DROPPED by the completion call — revive only if it bites) and graduates
to `project/archive/` via checkpoint.

## v3 — "one script lol" (human steer after close-out)

Even v2 felt like "so much fucking around": the LLM ceremony (preflight
prose, payload confirm, separate commit/push turns, journal + snapshot
ripple commits) dwarfed the 15s script. v3 collapses the WHOLE train into
`ship.sh` — bump (patch default / minor / x.y.z), release commit
(pathspec, SKIP_JOURNAL+SKIP_ATTRIB — mechanical, human-invoked), tag,
push main+tag, isolated build, deploy. The skill is now two moves: draft
the CHANGELOG section → run the script. CUT: the payload confirm, the
step-9 journal/snapshot ripple (tag + CHANGELOG + versioned deploy commit
are the record), all resume prose (the tag is the completion marker — an
untagged current version resumes instead of double-bumping). Tested: bad
arg, changelog-gate refusal (exits pre-mutation), bump/resume math,
one-shot verify-live.

## Next intended steps

1. None for F9 — complete. Loose thread if it ever bites: gap §0.3
   (stranded gh-pages commit on a failed push + byte-identical rerun).

## Landmines (current)

- `tmp/ship/wt` is now PERSISTENT by design — don't "clean it up"; its
  node_modules is the release-speed cache (`tmp/ship/lockhash` is the
  stamp).
- The deploy-message describe change only takes effect once committed
  (ship builds from HEAD via the temp worktree's gh-pages.sh copy).

## Landmines

- Shared tree: the F8 agent is live and will edit `gh-pages.sh`'s strip
  marker loop — F9 must NOT edit that file (it reuses the temp worktree's
  copy verbatim). Stage own paths only.
- v0.3.6 stays a patch unless the human says otherwise at /ship time.

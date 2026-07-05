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

## Next intended steps

1. Human runs `/ship` for the real v0.3.6 — Ph1's DoD (patch by default).
2. Ph2 hardening: stranded gh-pages-commit push (gap §0.3), resume
   detection polish, working-agreements deploy one-liner, repo-map skill
   list entry.

## Landmines

- Shared tree: the F8 agent is live and will edit `gh-pages.sh`'s strip
  marker loop — F9 must NOT edit that file (it reuses the temp worktree's
  copy verbatim). Stage own paths only.
- v0.3.6 stays a patch unless the human says otherwise at /ship time.

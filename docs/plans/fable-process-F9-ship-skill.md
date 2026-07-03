# /ship — the one-command release train (skill + script)

**Status:** 📋 PROPOSED — awaiting human read. No code changed yet. One
user-invoked command — `/ship patch|minor` — runs the whole release train:
bump → CHANGELOG → verify → isolated build → DEV-strip gate → deploy →
**live-site version proof** → record → journal/snapshot ripple. Every piece
exists today as a separate script, gate, or convention; the skill removes the
between-steps friction and the forget-a-step class.

**Reading queue:** this is a new `docs/plans/*.md` proposal, so it must be
added to [`project/todo-human.md`](../../project/todo-human.md) in the commit
that lands it (the pre-commit queue gate enforces this).

## Who builds this — Fable or Opus?

**Confidence: ( 90% Opus, 10% Fable )** — the 10%: the per-release
CHANGELOG voice, exercised by whichever session runs /ship, not at build.

**Opus 4.8 — Fable not required.** The judgment this plan needed — the
dirty-shared-tree isolation call (§2), the step ordering that makes every
failure state recoverable (§4), the R3 proof design, the tags/itch defaults —
is spent and encoded below. What remains is bash + two markdown files with a
mechanical, RED-able acceptance path (Phase 1's DoD is a *real shipped
release*). The one taste surface — the CHANGELOG section's player-facing
voice — is exercised *per release* by whichever session runs `/ship`, guided
by three lines of prose in the skill; it is not a build-time surface.

---

## 0 · Why — the release train today, with receipts

A release is currently ~9 hand-sequenced steps spread across scripts and
conventions: edit `package.json` version → author a `## [x.y.z]` CHANGELOG
section (the `verify-changelog` gate, 12th of 12, blocks a bump without one)
→ pathspec release commit in the house `chore(release): vX.Y.Z — …` style
(v0.3.3/4/5 were each exactly `package.json` + `CHANGELOG.md`, 2 files) →
push main (pre-push verify) → `npm run gh-pages` (build + the D-067/D-075
DEV-strip grep gate + rsync → gh-pages worktree → push) → eyeball the live
site → journal + snapshot ripple → push again. Nothing sequences it; each
seam is a forget-a-step opportunity.

Exploration also surfaced four real gaps the skill should close:

1. **`gh-pages.sh` builds the *shared* worktree.** `npm run build` reads
   `src/` as it sits — including co-agents' uncommitted WIP — and then labels
   the deploy `deploy: site @ main $(git rev-parse --short HEAD)`. A
   dirty-tree deploy ships unreviewed bytes *and* mislabels them as HEAD.
2. **Nothing ever verifies the committed snapshot in isolation.** Pre-commit
   and pre-push run `npm run verify` against the *working tree*, not the
   commit — in a shared tree, "verify green" proves the tree, not HEAD.
3. **A stranded gh-pages commit is silently skipped.** If a previous deploy
   committed in the gh-pages worktree but its push failed, a rerun rsyncs a
   byte-identical site, sees `git diff --cached --quiet`, prints "no site
   changes to publish", and exits 0 — *without pushing the pending commit*.
4. **"Deployed" is declared, not proven.** No step fetches the live site and
   confirms it serves the new `__VERSION__`/`__BUILD_SHA__` (R3).

## 1 · Ground rule — `/ship` is the human sign-off (R4)

Deploys are outward-facing; working-agreements' standing approval covers
`git push origin main`, **not** deploys. The design makes the *invocation*
the approval:

- `SKILL.md` frontmatter: `disable-model-invocation: true` (the
  prepare-to-exit / handoff precedent). **User-invoked only.**
- Agents are forbidden from invoking `/ship` autonomously, from running
  `src/scripts/ship.sh` directly, and from "helpfully" shipping at the end
  of a loop. `ship.sh` carries a header comment saying exactly this, and the
  Ph2 working-agreements edit records it: *deploy = `/ship`, human-invoked*.
- One mid-train confirmation (§3 step 3): before anything irreversible, the
  skill shows the exact payload — new version, drafted CHANGELOG section,
  HEAD SHA to be shipped — and asks once. `/ship` authorizes the train; the
  confirm shows what's on it. No other prompts.

## 2 · The core decision — build from a temp worktree of HEAD

Three options for the dirty-shared-tree problem:

| Option | Verdict |
|---|---|
| **(a) Ship the worktree as-is** (status quo) | Rejected. Ships co-agents' WIP; mislabels the deploy SHA (§0.1); un-reviewable payload. |
| **(b) Refuse if dirty** | Rejected as the primary mechanism. The shared tree is *legitimately* dirty much of the time (>1 agent); this blocks releases on other people's WIP, and the only "fix" it invites — stashing/checkouting files you didn't author — is explicitly banned (working-agreements shared-tree safety). A gate that's red half the time trains bypass reflexes (A11). |
| **(c) Build from a temp `git worktree add --detach` of HEAD** | **Recommended.** Builds exactly the committed release SHA; never reads, let alone touches, co-agents' WIP; the `deploy: site @ main <sha>` label becomes truthful by construction; and it closes gap §0.2 free — `npm run verify` inside the temp worktree is the repo's first true "the committed snapshot is green in isolation" proof. |

Mechanics (all inside `ship.sh`, cleaned up by an EXIT trap):

```bash
WT="$REPO_ROOT/tmp/ship/wt"                # tmp/ is gitignored (CLAUDE.md)
git worktree add --detach "$WT" HEAD
(cd "$WT" && npm ci --prefer-offline)      # honest deps from the shipped lock
(cd "$WT" && npm run verify)               # HEAD green in isolation (§0.2)
GH_PAGES_WORKTREE="$GH_WT" bash "$WT/src/scripts/gh-pages.sh"
```

The last line is the elegant part: `gh-pages.sh` derives `REPO_ROOT` from its
own `BASH_SOURCE` location, so running *the temp worktree's copy* makes it
build, DEV-strip-check, and stamp from the temp tree unchanged — zero edits
to the deploy script for Phase 1. `GH_PAGES_WORKTREE` (an existing override)
points back at the real sibling `../gh-pages-kami-kakushi`. The gh-pages
push runs no verify hook (the relative `core.hooksPath=.githooks` resolves
to nothing in that worktree — observed today), which is fine: verify already
ran twice upstream, against the exact shipped commit.

Cost: one `npm ci` (~30–60s) per release. A release happens every few days;
correctness wins. Preflight still *reports* shared-tree dirt (informational,
`git status --porcelain` summary) — it informs the human, it never blocks
and never touches.

## 3 · The step sequence

Judgment steps (bump choice, CHANGELOG prose, commit, journal) live in
`SKILL.md`; the mechanical train (steps 6–8) is `src/scripts/ship.sh`.

0. **Preflight** (skill). Confirm: invoked by the human (`/ship`); gh-pages
   worktree exists on branch `gh-pages`; `git fetch origin` succeeds; report
   shared-tree dirt (never touch); note any co-agent red ("don't fight
   someone else's red" — a red tree will block step 4's pre-commit verify,
   so surface it now).
1. **Bump choice** (skill). `/ship patch` or `/ship minor` via skill args
   (`argument-hint: "patch | minor"`); if absent, `AskUserQuestion` once.
   Compute `NEW` from `package.json`. Bump with `npm pkg set version=$NEW` —
   touches `package.json` only, matching the 2-file house release diff (the
   lockfile's root version sits deliberately at `0.0.0`; leave it).
2. **CHANGELOG section** (skill, agent-drafted). Find the last release
   (newest `## [x.y.z]` heading), draft `## [NEW] — <today>` from
   `git log <last-release-sha>..HEAD --oneline` in Keep-a-Changelog
   categories (Added/Changed/Fixed), newest-first insertion, **player-facing
   prose in the house voice** — the existing 0.3.4/0.3.5 sections are the
   exemplars — not a commit-log dump. ~80-char wrap.
3. **Payload confirm** (skill → human). Show version, the drafted section,
   and the SHA that will ship; one yes/no. No = abort with nothing changed
   beyond two unstaged edits, which the skill reverts *by path* (its own
   edits only).
4. **Release commit** (skill). Pathspec commit of exactly
   `package.json CHANGELOG.md`, house message
   (`chore(release): vX.Y.Z — <highlights>` + 50/72 body + `Assisted-by:`
   trailer), `SKIP_JOURNAL=1` (the journal lands in step 9, *after* the
   proof — you can't journal "live-verified" before it's verified).
   Pre-commit runs verify + the `verify-changelog` gate against the section
   just written.
5. **Push main** (skill). `git push origin main` — standing-approved;
   pre-push verify fires. The deploy must ship a publicly-reachable SHA.
6. **Isolated build + deploy** (`ship.sh`, §2). Refuses to run unless HEAD
   is an ancestor of `origin/main` (guards step 5). Temp worktree → `npm ci`
   → `npm run verify` → temp copy of `gh-pages.sh` (build, **DEV-strip grep
   gate**, rsync, gh-pages commit + push).
7. **Post-deploy proof** (`ship.sh` — the heart, R3). Poll
   `https://raynos.github.io/kami-kakushi/` (cache-busting query): fetch
   `index.html`, extract the hashed `/assets/index-*.js` path, fetch it, and
   require **both** the literal `"vX.Y.Z"` (`__VERSION__`) and the release
   short SHA (`__BUILD_SHA__` — unique per build, the stronger proof).
   15s interval, ≤10 min (Pages' cache TTL is ~10 min). Print the proven
   footer triple verbatim. **The deploy is not done until this passes** —
   exit 0 requires the proof; a timeout exits nonzero saying "pushed but
   UNPROVEN" (§4).
8. **Optional itch zip** (`ship.sh --itch`). Zip the *temp worktree's*
   `dist/` (the exact deployed bytes — don't rerun `build:itch`, which would
   rebuild from the shared tree) → `$REPO_ROOT/kami-kakushi-itch.zip`
   (already gitignored). Print "upload manually" — upload stays
   human/browser (D-016: manual, human-approved itch upload; no butler).
9. **Record + ripple** (skill). Journal entry (append-only house shape):
   version, release SHA, gh-pages deploy SHA, the fetched live footer string,
   itch zip if built. Refresh the deployed-version mentions in
   `project/status/project-status.md`. Pathspec commit (journal satisfies
   the pre-commit journal gate) + push. Report done — with the proof quoted.

**Tags: skip (proposed default).** H1/2026-07-01 made `package.json` the
single version source *specifically because* a lagging tag mislabeled the
build; a tag is a second source with no consumer today. The greppable
`chore(release):` commit + the CHANGELOG + the gh-pages `deploy: site @ main
<sha>` trail are the record. Revisit only if a consumer appears (e.g. GitHub
Releases).

## 4 · Failure handling — every stop leaves a stated, recoverable state

| Fails at | State left | Recovery |
|---|---|---|
| 3 confirm = no | Two unstaged own-file edits | Skill reverts them by path; report "aborted, nothing shipped" |
| 4 pre-commit red (often co-agent WIP) | Bump + section staged, uncommitted | Fix/wait for green; re-invoke `/ship` — it detects "version already bumped + section present" and **resumes**, never re-drafts |
| 5 push blocked (red / non-FF) | Release commit local only | Reconcile (house merge pattern), re-push; `ship.sh`'s ancestor check makes deploying an unpushed commit impossible |
| 6 `npm ci` / verify / strip gate red | Nothing deployed; temp worktree removed by trap | HEAD itself is bad: fix **forward** with a new commit (no version re-bump — nothing shipped, verify-changelog still satisfied), re-invoke; the fix SHA becomes `__BUILD_SHA__` |
| 6 gh-pages push fails (network) | Deploy commit stranded local in gh-pages worktree | Rerun: `ship.sh` checks `git -C $GH_WT log origin/gh-pages..gh-pages` **before** the byte-identical early-exit and pushes the pending commit — closing gap §0.3 (Ph2) |
| 7 proof times out | Everything pushed; deploy **UNPROVEN**; journal not yet written | `ship.sh --verify-live` re-polls without rebuilding; only after it passes does the skill write step 9's "shipped" record (R3: done is earned) |
| 9 ripple commit blocked | Release live + proven; docs lag | Ordinary checkpoint mechanics; report exactly what's left local |

Idempotency rule: re-invoking `/ship` after any failure is safe — each step
checks whether its outcome already exists (version bumped? committed? on
origin? site serving the SHA?) and skips forward. `ship.sh` alone, rerun
after success, rsyncs a no-op and re-proves the live site.

## 5 · What stays OUT

- **Autonomous invocation** — never; `/ship` is the sign-off (§1).
- **Force-push** — never, either branch. `gh-pages.sh --force` (empty-commit
  redeploy) is not part of the train; humans can still run it directly.
- **itch upload** — the zip is produced; upload is manual (D-016).
- **Git tags** (§3), **CI/butler automation**, **rollback automation**
  (rollback = a human decision; fix forward or redeploy an older SHA by
  hand), **any stash/checkout/restore of files the skill didn't author**.

## 6 · Skill shape — thin SKILL.md conducting a testable ship.sh

`prepare-to-exit` is pure delegation because the checkpoint's single source
is *prose* (working-agreements) and every step is judgment. Ship's middle is
the opposite: order-sensitive, failure-prone *shell* (worktree lifecycle,
npm ci, gates, rsync, push, polling) — the highest rung that soundly holds
it is a script (A11; house precedent: `gh-pages.sh` is already a script).
The judgment ends — bump choice, CHANGELOG voice, commit messages, journal
prose, the confirm — cannot be scripted and stay in `SKILL.md`. So:

- `.claude/skills/ship/SKILL.md` — frontmatter (`name: ship`,
  `argument-hint: "patch | minor"`, `disable-model-invocation: true`);
  steps 0–5 and 9 as short prose; steps 6–8 as "run
  `bash src/scripts/ship.sh [--itch]` and relay its report"; the resume
  rules of §4. Like prepare-to-exit, it holds **no copy** of the deploy
  mechanics — `ship.sh` is the single source.
- `src/scripts/ship.sh` — preflight ancestor check, temp-worktree build
  (§2), delegation to the temp `gh-pages.sh`, live proof (§3.7),
  `--itch`, `--verify-live`, EXIT-trap cleanup
  (`git worktree remove --force` + `prune`). `PAGES_URL` env-overridable
  constant. Header: human-invoked via `/ship` only.

## 7 · Phases

**Phase 1 — the happy path, proven on a real release.** `ship.sh` (preflight
+ temp-worktree build + delegation to gh-pages.sh + live proof + `--itch` +
cleanup trap); `SKILL.md`; queue entry for this plan.
*DoD:* a REAL patch release (v0.3.6) ships end-to-end via `/ship` — one
invocation, one confirm — and the journal entry quotes the live-fetched
footer (`v0.3.6 · build <release-sha> · <date>`) as the proof. Rerunning
`ship.sh` immediately after is a no-op that re-proves the live version.

**Phase 2 — failure-path hardening + docs ripple.** Stranded-gh-pages-commit
push (§4 / gap §0.3); `--verify-live`; resume-detection polish in SKILL.md
(bumped-but-uncommitted, committed-but-unpushed, pushed-but-unproven);
working-agreements one-liner (*deploy = `/ship`, human-invoked; agents never
self-invoke*); `repo-map.md` skill list gains `ship`.
*DoD:* each §4 row exercised once (deliberately killed push, deliberately
early proof-poll) and recovering as stated; docs pointers landed; a co-agent
reading working-agreements can tell deploys are `/ship`-only.

Two phases; no third. This scored 2/5 priority — the build stays small
(~150 lines of bash, ~40 of markdown), and it reuses `gh-pages.sh` verbatim
rather than rewriting it.

## 8 · Risks & open questions (defaults proposed — none block)

1. **`npm ci` cost per release (~30–60s).** *Default: accept —
   `--prefer-offline`, and a release is minutes-scale anyway. If it ever
   hurts, a documented `--reuse-node-modules` symlink fast path.*
2. **Pages propagation variance.** *Default: 15s × ≤10 min poll (matches
   Pages' max-age=600), then UNPROVEN + `--verify-live`. Never declare done
   on timeout.*
3. **One confirm vs zero.** Is §3.3 over-asking, given `/ship` is already
   the sign-off? *Default: keep the single confirm — it's the only moment
   the human sees the CHANGELOG text and the exact SHA before they're
   public; one question per release is cheap (D-089 spirit: ask once, about
   the thing that matters).*
4. **Tags.** *Default: skip (H1 rationale, §3). Cheap to add later.*
5. **itch in the train.** *Default: out; `--itch` produces the zip from the
   deployed bytes; upload manual (D-016).*
6. **Temp worktree location.** *Default: `tmp/ship/wt` (repo-local,
   gitignored, sandbox-friendly); sibling-dir alternative like the gh-pages
   worktree if tmp/ churn bothers anyone.*
7. **Should `ship.sh` grow a `verify-changelog`-style unit test?** *Default:
   no — its acceptance test is Phase 1's real release; bash test scaffolding
   would outweigh the script.*
8. **Minor-vs-patch judgment.** The human picks; should the skill advise?
   *Default: the skill may suggest based on the drafted section's Added
   weight, but never decides.*

---

## Critical files for implementation

- `src/scripts/gh-pages.sh` — reused verbatim from the temp worktree (§2)
- `.claude/skills/ship/SKILL.md` (new) — the judgment steps + delegation
- `src/scripts/ship.sh` (new) — the mechanical train
- `CHANGELOG.md` — the per-release section target
- `project/status/working-agreements.md` — Ph2 deploy-rule one-liner

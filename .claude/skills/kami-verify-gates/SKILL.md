---
name: kami-verify-gates
description: >-
  The per-gate RED-fix book for kami-kakushi's verify roster. Load this
  the moment `pnpm run verify` (or a pre-commit / pre-push / CI verify
  run) goes RED and you need to know what that specific gate checks,
  why it exists, and the sanctioned fix — for any of the 21 gates:
  tsgo, oxlint, oxfmt, vitest, verify-content, verify-prd, gen-docs,
  fixtures, gen-narrative, gen-prd-regions, pacing, playcheck,
  md-links, milestone-integrity, verify-changelog, doc-budgets,
  checkpoint, inbox-ledger, review-link, deferred-work, human-todo.
  Fire-phrases: "verify failed", "commit blocked", "gate went RED",
  "gen-docs is stale", "fixtures drift", "which SKIP flag", "can I
  bless the baseline", "someone else's red", "the 8s budget blocked
  my commit". Also covers the lane mechanics
  (SKIP_CODE_VERIFY / SKIP_DOCS_VERIFY / VERIFY_FULL), the pre-commit
  checks that are NOT roster gates (journal, reading-queue,
  plan-template, staged-set echo), and what is deliberately NOT in
  the roster (e2e, verify:tooling, verify:balance).
---

# kami-verify-gates — verify went RED: now what

"Verify" = `pnpm run verify`: the parallel gate suite that runs at
every commit (pre-commit hook), push (pre-push, full lane), and CI
(`.github/workflows/verify.yml`). The roster lives in ONE place:
`src/scripts/gates.ts` (its header: "the SINGLE SOURCE OF TRUTH for
the gate list"). Never hand-type a gate count — enumerate it:

```bash
grep -oE "name: '[a-z-]+'" src/scripts/gates.ts   # the roster
grep -c "name: '" src/scripts/gates.ts            # the count (21 at 2026-07-18)
```

That count command is THE canonical form — every kami-* skill uses
it verbatim; if it ever disagrees with the roster listing above,
`gates.ts` itself is the arbiter.

Jargon (AC/PH/FB/ADR tags, rung, fixture, bless, ratchet):
kami-domain-reference's glossary.

## First moves on any RED

1. Read the gate's own output — most REDs name the exact fix
   command or the exact file to edit. Trust the message.
2. Re-run just that gate for a clean view. Every gate's `cmd` is in
   `gates.ts`; run it verbatim, e.g.
   `pnpm exec tsx src/scripts/checkpoint.ts --check`.
   For interleaved-output confusion: `pnpm run verify -- --sequential`
   streams gates one at a time (verify-run.ts:10-13).
3. Check whose red it is. The tree is shared. If the failing file is
   a co-agent's uncommitted WIP, **don't fight someone else's red**
   (AGENTS.md, Checkpoint non-negotiable 3): leave your commit
   local, never `SKIP_VERIFY=1` a red tree onto `main`. Coordinate
   via herdr instead.
4. Then find the gate's entry below.

## Meta-rules that govern every gate

- **A gate never cries wolf (AC-11).** Every roster gate is a
  content invariant calibrated to zero false positives (AGENTS.md:
  "push each quality rule to the highest rung that can _soundly_
  hold it"). Corollary: treat every RED as REAL. The reflex "the
  gate is probably flaky" is wrong in this repo by construction.
- **Regen, don't hand-edit.** Five gates byte-compare generated
  output (gen-docs, fixtures, gen-narrative, gen-prd-regions,
  checkpoint). The fix is ALWAYS the named regen command; editing
  the generated file is drift by definition and REDs again next
  run. The error names the source of truth to edit.
- **Commit the regenerated artifact WITH the change** that staled
  it — one commit, or the gate is red for every co-agent in between.
- **Never fudge a check to go green (PH3).** An honest RED on
  pacing/playcheck/verify-content is a finding to surface, not a
  threshold to quietly widen. Widening a cap or blessing a baseline
  is itself a design change with its own record.
- **Shared-tree contamination:** gates read the WORKING TREE, not
  HEAD. A co-agent's uncommitted registry edit can red YOUR
  `fixtures`/`gen-docs` run; an untracked plan scaffold in
  `docs/plans/` reds `checkpoint` for everyone (checkpoint.ts uses
  `readdirSync`, which sees untracked files). Verify against
  committed canon with `git show HEAD:<path>` before assuming your
  change caused it.

## Gate-by-gate

Scopes (gates.ts:11-13): `code` / `docs` / `both` — decides which
lane-skip flag skips it (see "Lane mechanics" below).

### Toolchain lane

**tsgo** (`tsgo --noEmit`, code) — typecheck via the typescript-go
native-preview compiler, NOT tsc (package.json `typecheck`).
tsconfig is maximal-strict (`noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noUnusedLocals/Parameters`,
`verbatimModuleSyntax`) — most REDs are real index/optional bugs.
Fix the code; never loosen tsconfig.

**oxlint** (`oxlint`, code) — `.oxlintrc.json`. Carries the
**pure-core boundary as lint**: `src/core/**/*.ts` (non-test) bans
`window`, `document`, `localStorage`, `navigator`, etc. via
`no-restricted-globals` ("core is pure & deterministic — PRD
§6.1/§6.2"). A restricted-global RED in `src/core` means your
change belongs in the shell/renderer — move it; never disable the
rule (that's the single most load-bearing architectural rule here,
see kami-architecture-contract).

**oxfmt** (`oxfmt --check`, code) — formatting. Fix:
`pnpm run format`. Markdown and docs dirs are excluded
(`.oxfmtrc.json` ignore list), so a `.md` never trips it.

**vitest** (`tsx src/scripts/vitest-verify.ts`, code) — the COMMIT
lane runs every `src/**/*.test.ts` EXCEPT files carrying a
top-of-file `// @slow` pragma (matched in the first 2048 bytes);
`VERIFY_FULL=1` (set by pre-push + CI) runs everything
(vitest-verify.ts header). Count the slow lane:
`grep -rlE '^\s*//\s*@slow\b' src --include='*.test.ts'`
(12 files at HEAD 4bfb3ba3). A failing test: fix via the `tdd`
skill's red→green discipline — never delete the assertion. If YOUR
new test pushed the commit gate past the 8s budget, tag it
`// @slow` (lanes it to push/CI) — never `SKIP_BUDGET`
(.githooks/pre-commit:65-73).

### Regen gates (byte-compare; fix = run the generator)

**gen-docs** (`gen-docs.ts --check`, both) — regenerates
`docs/content/t0-content.md` + `docs/content/ui-tokens.md` from the
same typed registries and `:root` CSS tokens the game uses
(generate-don't-duplicate, PRD §6.6). RED
`gen:docs --check FAILED: <path> is stale` (gen-docs.ts:383).
Fix: `pnpm run gen:docs`, commit the output.

**fixtures** (`gen-fixtures.ts --check`, code) — FB-6: regenerates
every `src/fixtures/saves/*.json` by driving the REAL engine
through `src/fixtures/specs.ts` and byte-compares. RED after a
balance/content/schema change = waypoint states shifted. Fix:
`pnpm run fixtures:regen`, commit the saves WITH the core change
(shared-tree lore: "core+fixture regen land together"). If regen
itself fails a spec's `expect`, the spec no longer reaches its
waypoint — that's a real regression or a spec to update, not a
save to hand-edit. Schema bumps: see kami-save-and-schema.

**gen-narrative** (`gen-narrative.ts --check`, code) — FB-5: the
narrative markdown under `src/core/content/narrative/` compiles to
`*.gen.ts` registries + `docs/content/t0-story.md`. RED text names
the fix: "`<out> is out of date (or hand-edited). The source of
truth is <md> — edit THAT, then run \`pnpm run gen:narrative\`"
(gen-narrative.ts:135-138). NEVER edit a `.gen.ts`. Parse/validate
errors (bad grammar, dangling line ids): see kami-narrative-grammar
for the authoring syntax.

**gen-prd-regions** (`gen-prd-regions.ts --check`, both) —
transcludes shipped T0 IDENTITY facts (rank titles, weapon roster,
bestiary…) from the typed registries into marked PRD regions, so
that drift class is impossible rather than reported (ADR-128;
identity-in / tuning-out per ADR-168 — tuning numbers stay out).
Fix: `pnpm run gen:prd-regions`, commit the PRD files.

**checkpoint** (`checkpoint.ts --check`, both) — process-layer
gen-regions: the gate-roster line in `project/status/*`, the
active-plans list in `docs/plans/README.md`, the resume-journal
pointer. Three REDs (checkpoint.ts:521-564):
1. A plan's `**Status:**` token outside the closed set
   (PROPOSED · LOCKED · IN-PROGRESS · DONE · PARKED · SUPERSEDED)
   → edit the plan's Status line.
2. Stale generated region(s) → `pnpm run checkpoint`, stage the
   touched docs. Fires whenever gates.ts changed, a plan was
   added/removed/re-tokened, or a new journal landed.
3. `project/BACKLOG.md` points at a plan no longer in
   `docs/plans/` → delete/repoint the line by hand.
A DONE plan still in `docs/plans/` is a WARN, not a block; write
mode (`pnpm run checkpoint`) graduates it to `project/archive/`
and rewrites links. **Trap:** an untracked plan scaffold reds this
gate for every agent — scaffold+commit in one sitting, or draft in
`tmp/`.

### Content & canon invariants

**verify-content** (`verify-content.ts`, code) — cross-registry
invariants over the content canon. Two classes of RED:
- *Mechanical*: duplicate/unmirrored ids, unknown skill/area/
  surface refs, non-positive weapon stats, non-contiguous estate
  stages → fix your registry entry.
- *Canon law* (the message names the sanctioned fix; changing the
  LAW instead = ADR amendment, stop and surface):
  ≤2 zones per rung-up VN (ADR-184 — give extras their own reveal
  VN in `src/core/reveals.ts`); no belief-creatures in the bestiary
  (story-canon §E — tengu/kappa/oni/kami/… ids forbidden); human
  foes need `minTier ≥ 2` (no human combat in T0/T1, story-bible
  locked); the 16-entry real-Edo-name denylist (ADR-042 — pick a
  fictional name, never whitelist without the human).

**verify-prd** (`verify-prd.ts`, docs) — the PRD split's
completeness guard (monolith-truncation failure class): all 7
sections under `docs/living/prd/` present, ASCII-named
(`0N-slug.md`), contiguous §1…§7, non-truncated (>200 chars),
linked from the `docs/living/prd.md` stub. RED = a section file was
deleted/renamed/gutted — restore it from git, don't re-stub.

**verify-changelog** (`verify-changelog.ts`, both) — AC-22:
`package.json` `version` must have a matching `## [x.y.z]` section
in `CHANGELOG.md`. RED = a version bump without its release notes.
Fix: write the section — but note releases go through `/ship`
(human-invoked), which does this correctly; an agent shouldn't be
bumping the version by hand in the shared tree at all.

**md-links** (`check-md-links.ts`, both) — every intra-repo
relative markdown link in the authoritative roots resolves to an
existing file/dir. Existence ONLY — anchors deliberately unchecked
(would cry wolf on §/kanji headings, AC-11). RED lists
`file:line → target`. Fix: repair the link or restore the moved
target. History dirs aren't scanned, but links INTO them still
must resolve. Born of the 2026-06-30 stale-markdown sweep.

**milestone-integrity** (`milestone-integrity.ts`, both) — ADR-054/
ADR-088: every DoD-named test instrument must resolve to a real
test. The manifest is the hand-curated `MANIFEST` const INSIDE the
script (file + marker substring per contract), plus a `NAMED`
vocabulary checked against `docs/living/roadmap.md`. RED after
renaming a test file/describe = update the MANIFEST entry in the
SAME commit. RED because the underlying check was removed = a
DoD/ADR-054 amendment — stop and surface. New tier per ADR-088
(full-arc e2e + invariants test) = add manifest entries.

### Engine-driven proxies

**pacing** (`pacing-report.ts --check`, code) — G-PACING: drives
the focused-optimal auto-play path per rung through the REAL engine
(`createInitialState` + `reduce` — the model can't drift from the
game) and REDs any T0 climb rung outside the sane band. Read the
live band from source, never hardcode:
`grep -n 'T0_PACING_BAND\|RUNG_WALL_FLOOR' src/core/content/balance.ts`
(3–28 min/rung at 2026-07-18; the ≥30-min floor gates from T1).
The SUMMARY line names the failing rungs. Fix = a balance/content
retune (rung costs live in
`src/core/content/narrative/requirements.md` → `pnpm run
gen:narrative`, ADR-137/182), which follows the ADR-132 machine-
verdict flow — see kami-balance-analysis-toolkit. Never widen the
band to pass; band changes are a design decision.

**playcheck** (`tsx src/playcheck.ts --check`, code) — the
fun-proxy ratchet: headless run of the real core at fixed seed
(playcheck.ts:35), gating exactly two lower-is-better proxies —
`firstActionMs` (first rewarded intent) and `maxDeadTimeMs`
(longest unrewarded stretch) — against
`max(3 × blessed baseline, 2000ms)` (playcheck.ts:36-38), plus an
absolute 5s hard cap on `firstActionMs` that NO bless can lift.
Decision tree (the RED prints it):
- Unintended regression (your change made the early loop slower as
  a side effect) → fix the regression. Do NOT bless.
- The slowdown is the intended effect of a design change the human
  has ALREADY accepted (an ADR, a closed HD/HR item, or an explicit
  steer you can name) → `pnpm run playcheck -- --bless` rewrites
  `src/playcheck.baseline.json`; commit it WITH the change and name
  the accepting record in the commit body. The script's own header
  is the constraint: "The baseline rises deliberately (--bless) at
  a green slice-ship" (playcheck.ts:18) — a bless rides an accepted
  ship; it is never how a change GETS accepted. Precedent: ADR band
  `docs/living/decisions/050.md` "Re-bless playcheck/pacing if the
  win-curve shifts."
- The change is NOT yet human-accepted → a bless would permanently
  accept a fun regression on your own judgment (PH5: only a human
  certifies fun). Leave the RED honest, keep the commit local, and
  surface the fork (HD-item / commit-body note) instead.

### Process & queue gates

**doc-budgets** (`verify-doc-budgets.ts`, docs) — ADR-126 hard line
caps on snapshot-class docs, so "append" becomes "displace". Read
the live table from the `BUDGETS` const in the script; at
2026-07-18: taste.md 150 · ui-design.md 400 (warn 360) ·
project-status.md 120 · AGENTS.md 500 (warn 420) · repo-map.md 250
(warn 220). RED = over cap → CULL weaker lines (journal/ is the
lossless record; trimming the snapshot is correct, never a loss).
Warn-only genre tripwire: `(session-NN)` refs in taste/ui-design,
"Phase update" bullets in the snapshot — journal genre leaking into
replace-in-place docs. `SKIP_DOCBUDGET=1` is ONLY for a
human-blessed cap raise (pre-commit:266-280). Correction of a
stale fact: the old standalone snapshot line-cap gate
(`SKIP_SNAPSHOT`) is RETIRED — this gate absorbed it (the script's
header: "the pre-commit snapshot gate's own count check was
absorbed into this table").

**inbox-ledger** (`inbox-ledger.ts`, docs) — ADR-171 parallel-drain
invariants: no F-number stamped on two captures; unique F-log
heading allocations above `FB_BASELINE` (198,
src/scripts/inbox-lanes.ts:39); a `done` capture names its `fb` +
fixing `commit`; a fully-done bucket must be archived out of
`pending/`. Fix: stamp/complete the sidecar fields or archive the
bucket. The drain procedure itself is the `drain-inbox` skill —
this gate is only its teeth.

**review-link** (`verify-review-link.ts`, both) — binds the DEV
Review tab's registry (`src/ui/dev-surfaces.ts` +
`src/ui/storyTakes.ts` bundles) ⇄
`project/human-in-the-loop/review.md`, BOTH directions, by stable
id (ADR-192 — born of the human being sent to missing rows twice).
Each RED message names its mechanical fix: file the missing HR
section; add the `Review → Story|Variants → **id**` citation line;
strip the toggle of a CLOSED item (ADR-075 zero flag-debt) or
declare `hr: none · <why>` on a kept story bundle; repoint a stale
cross-reference. The one judgment call — is a surface SETTLED
(strip) or still open? — is the human's verdict; if unsure,
surface, don't guess.

**deferred-work** (`verify-deferred-work.ts`, docs) — "if it isn't
in the queue, it doesn't exist" (human, 2026-07-12; the session-183
sleep-verb incident is the script's header). A SHOUTED `NOT BUILT`
/ `NOT YET built` in the ADR log or the status snapshot must name a
queue home — a PATH matching `plans/`, `BACKLOG.md`, `roadmap.md`,
or `human-in-the-loop/` — within the shout's own line ±(1 before,
2 after). Fix: give the work a real home (write the plan — see
`write-plan` skill — then cite it next to the shout). Do NOT
lowercase the shout to dodge the gate: the shout is a promise to a
future reader, and un-shouting it is routing around the rule.

**human-todo** (`verify-human-todo.ts`, docs) — session-205: the
brief told the human "queue clear" while two live entries rotted
unseen. REDs the observed rot patterns in `project/todo-human.md`:
ticked `- [x]` left in place (closed items are REMOVED); orphan
fragments from partial deletes of wrapped entries; entries linking
into `project/archive/`; plain `- ` bullets where the contract is
checkboxes. Fix: tidy the file per its own header rules. Distinct
from the pre-commit HUMAN-TODO OWNERSHIP block (below), which
stops agents ADDING `## TODO` lines.

## Lane mechanics

Every gate's `scope` decides its skip lane (verify-scope.ts):
`SKIP_CODE_VERIFY=1` skips code-scoped gates, `SKIP_DOCS_VERIFY=1`
the docs-scoped mirror, `both`-scoped gates skip only when BOTH are
set. **Pre-push force-unsets the lane flags and sets
`VERIFY_FULL=1`** (.githooks/pre-push:36) — a push always verifies
the full roster including `@slow`; the lane flags are commit-time
conveniences only. Budget: <5s silent, 5–8s warn, >8s HARD-BLOCKS
the commit (ADR-176). Everything else — `SKIP_VERIFY`/`SKIP_BUDGET`
semantics, edge cases, the full escape catalog — is owned by
kami-config-and-flags; runner internals and CI mapping by
kami-build-and-env.

## Pre-commit checks that are NOT roster gates

These live in `.githooks/pre-commit` (+ `commit-msg`), fire only at
commit, and are invisible to `pnpm run verify`:

| Check | Rung | Escape | What / why |
|---|---|---|---|
| Staged-set echo | info | — | prints exactly what THIS commit contains (shared index — spot a swept-in co-agent file BEFORE committing; pre-commit:83-88) |
| herdr peer FYI | info | `SKIP_HERDR_PEERS=1` | lists live co-agents on the tree |
| PRD-drift nudge | warn | — | content-registry commit w/o PRD touch → run `pnpm run prd:drift` (D-117) |
| Balance-fresh | warn | `SKIP_BALANCE_FRESH=1` | design-input commit with a stale committed pacing report (fingerprint check, <1s) |
| Map signpost | warn | `SKIP_MAP_SIGNPOST=1` | map-sheets code edited w/o golden-pin regen — see `map-sheets` skill |
| Reading queue | HARD (plans) / warn (brainstorms, audit) | `SKIP_QUEUE=1` | a NEW `docs/plans/*.md` must be in `project/todo-human.md` in the SAME commit (pre-commit:165-203); model-prefix filename warn rides along |
| Plan template | HARD | `SKIP_PLAN_TEMPLATE=1` | new plan must pass `verify-plan-template.ts` — use the `write-plan` skill |
| Human-TODO ownership | HARD | `SKIP_HUMAN_TODO=1` (human-dictated only) | agents never ADD `## TODO` lines — file an HD/HR item instead (human, 2026-07-06) |
| Doc-budget re-check | HARD | `SKIP_DOCBUDGET=1` | re-runs verify-doc-budgets when `SKIP_VERIFY=1` dodged the roster |
| Journal hygiene | HARD | `SKIP_JOURNAL=1` (trivial commits) | every commit stages a `project/journal/` entry (pre-commit:282-312) |
| commit-msg trailer | HARD | `SKIP_ATTRIB=1` (human commits) | `Assisted-by: <agent>:<model>` trailer, never Co-Authored-By (`.githooks/commit-msg`) |

## Deliberately NOT in the roster

- **Playwright e2e** — CI-only (`e2e.yml`, every push), ~50s local
  across 3 projects; far past the 5s/8s budget (ADR-072). Pre-push
  prints a loud blast-radius advisory when pushed files touch the
  e2e surface (`SKIP_E2E_WARN=1` silences).
- **`pnpm run verify:tooling`** — the hook/guard meta-suite, runs
  ONLY in `verify-nightly.yml`. Its header forbids rostering it
  ("spawns dozens of processes", verify-tooling.ts:9-11). Never
  add it to gates.ts.
- **`pnpm run verify:balance`** (`balance-sim.ts --check`) —
  on-demand, part of the ADR-132 flow after balance edits; its
  nightly step is deliberately commented out (a silently-no-op
  step can never go RED). Owned by kami-balance-analysis-toolkit.
- **`verify-dev-strip.sh`** — proves prod strips `__qa`/DEV panel;
  runs in `build.yml` and nightly, after a prod build.

## When NOT to use this skill

- An unfamiliar term (rung, bless, fixture, AC-nn, PH-nn) →
  **kami-domain-reference** (the glossary).
- Deciding whether a change NEEDS a gate / which rung a new rule
  belongs on, or what's human-gated → **kami-change-control**.
- Fresh-clone setup, verify runner/budget anatomy, CI workflow map,
  dev-server law (:5264) → **kami-build-and-env**.
- Full SKIP_*/env-flag/URL-param catalog → **kami-config-and-flags**.
- A test fails and you don't know WHY (the bug, not the gate) →
  **kami-debugging-playbook**; writing/fixing tests → **tdd** skill.
- Balance-sim REDs, band/fingerprint methodology →
  **kami-balance-analysis-toolkit**.
- Narrative grammar/parse errors inside gen-narrative →
  **kami-narrative-grammar**; story process → **narrative-diverge**.
- Save/schema/fixture-migration recipes → **kami-save-and-schema**.
- Draining the playtest inbox → **drain-inbox** skill.
- The full story behind a gate's incident →
  **kami-failure-archaeology**.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (all
file:line citations verified against source that day; a co-agent's
uncommitted talk-system WIP was in the tree — every fact here was
checked against committed canon where it mattered).

Volatile facts + re-verify one-liners:

- Roster & count (21):
  `grep -oE "name: '[a-z-]+'" src/scripts/gates.ts`
- @slow lane (12 files):
  `grep -rlE '^\s*//\s*@slow\b' src --include='*.test.ts'`
- Doc-budget caps: read `BUDGETS` in
  `src/scripts/verify-doc-budgets.ts`
- Pacing band / floor:
  `grep -n 'PACING_BAND\|WALL_FLOOR' src/core/content/balance.ts`
- Playcheck ratchet consts:
  `grep -n 'RATCHET\|FIRST_ACTION_CAP\|SEED =' src/playcheck.ts`
- FB baseline: `grep -n 'FB_BASELINE' src/scripts/inbox-lanes.ts`
- Budget thresholds: `sed -n '33,34p' .githooks/pre-commit`
- Milestone manifest: read `MANIFEST` in
  `src/scripts/milestone-integrity.ts`

If a gate named here is missing from `gates.ts`, or a new name
appears there, this file is stale — re-derive from the scripts
(each gate's header comment is its own spec) and update this book.

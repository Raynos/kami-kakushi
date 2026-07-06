# Session 90 — 2026-07-06 — context-hardening build (P1–P4)

## ☀️ SUMMARY (read this first)

The human read + locked the context-hardening plan
(`docs/plans/fable-2026-07-05-context-hardening.md`) via AskUserQuestion, then
green-lit the FULL build in this session (Fable, per the live model switch —
supersedes the plan's Opus routing for P1–P3). Key rescope: P4 cut 1 grew from
two relabels into a repo-wide single-letter-prefix sweep — taste values →
`TST1–TST4` (not the plan's `V#`), philosophies → `PH1–PH6`, everything else
ID-like moves to 2/3-letter prefixes EXCEPT rungs R0–R7 + tiers T0–T5 (the
game's fundamental levels stay single-letter). P3.2 cull nod given; P4 lands
all cuts as individual commits, human reviews diffs after.

This file is HISTORY, not live state — the snapshot is
`project/status/project-status.md`.

---

## 1 · Plan lock + queue clear (932c9b1)

Recorded the four AskUserQuestion calls into the plan (Status → LOCKED),
cleared its reading-queue entry (D-089 implicit sign-off), regenerated the
checkpoint gen-regions. Committed via pathspec — 4 other agents live on the
tree with their own staged work.

## 2 · P1 — wire the floor (hooksPath)

- `package.json` — new `"prepare": "git config core.hooksPath .githooks || true"`
  (npm runs `prepare` on every install → any clone that can build is gated).
- `src/scripts/session-brief.sh` — 🚨 UNGATED CLONE warn at the top of the
  brief when `core.hooksPath` ≠ `.githooks` (belt for clones that never ran
  `npm install`).

DoD proven both directions in a `tmp/p1-clone-sim` scratch clone (deleted
after): fresh clone → hooksPath UNSET + warn fires → `npm install` → hooksPath
`.githooks` + a journal-less commit is BLOCKED by pre-commit; then unset +
`npm pkg delete scripts.prepare` + reinstall → stays UNSET + warn fires (the
check bites). Wired main repo: warn count 0 (no false positive).

## 3 · P2 — verify:tooling meta-suite

New `src/scripts/verify-tooling.ts` (+ npm script `verify:tooling`), wired into
`verify-nightly.yml` ONLY (D-072's 5s commit budget untouched). 26 checks, all
table-driven: hook `bash -n`/+x · a 15-case guard-git-add-all allow/block
matrix (run hermetically from a temp CWD — the bare-commit branch consults
`.git/MERGE_HEAD`) · an 9-case commit-msg matrix · hookify frontmatter/pattern/
fixtures (rules without registered fixtures get parse-only, so culling
no-bulk-git-add in P3 won't break it) · probe liveness (perl alarm+exec
time-box both directions, gh probe when authed, herdr-peers exit-0 both envs,
session-brief completes) · a mutation self-test (broken guard regex in a TEMP
copy → matrix RED; 5 cases caught it).

First run immediately caught a spec subtlety: `Assisted-by: Claude: Code:model`
legitimately PASSES the hook (first colon is the delimiter; extra colons land
in VERSION) — fixture corrected to encode that contract + a genuinely-bad case
(name starting with a colon) kept RED-able.

## 4 · P2 red-proof + a REAL committed-red catch · P3

Red-proof branch `tooling-redproof` (isolated worktree, per the established
pattern): broken guard regex committed, nightly dispatched
(run 28778902182) — expect RED at the `verify:tooling` step; branch + worktree
deleted after. **Pushing it surfaced that committed main is RED** (md-links +
checkpoint): my P1 commit's mechanically-regenerated `docs/plans/README.md`
links `opus-2026-07-06-ship-dev-tools-t0.md`, which a co-agent authored but
has NOT committed — the exact `local-green-hides-committed-red` class. Fixed
on the branch by regen; main heals when the co-agent's plan commit lands —
HOLD any main push until then (or land their plan file first, attributed).

P3: no-tree-mutation extended (fixtures FIRST → suite RED on
`git switch` / `git reset --hard` / `git clean -f` → pattern extended → green;
`switch -c`, `reset --soft`, `clean -n` stay exempt); `no-bulk-git-add`
DELETED (human nod — guard-git-add-all already hard-blocks those exact
patterns; the suite's parse-only fallback confirmed no structural break);
battery skill gains "(create if absent)"; repo-map gains the CI fan-out line.
P3.3 (`settings.local.json` prune) left for the human — their file.

## 5 · P4 cut 1 — the namespace collapse (ADR-140)

Human locked the map via AskUserQuestion (D→ADR · F→FB · A→AC · H→HD ·
review-R→HR · M→MS · taste V#/T#→TST · philosophy R→PH; sweep code comments
too). ~190 files: living docs + src/e2e comment-tails, historical records
untouched. The sweep surfaced FOUR id-collision classes the plan never knew
about — each caught by post-sweep audit, not luck:

- `V#` is QUADRUPLE-booked: taste values (→TST) vs PRD versions (V2.3) vs the
  T1/T2 **village rungs V1–V4** vs the T2 **V0–V7 village ladder** — PRD/
  roadmap/fun-factor V's reverted to V#; only taste.md + taste-citations carry
  TST.
- The PRD unlock-ladder has an **A1/B1/C1 quest-fork grid** — A→AC is
  enumerated (AC-6/11/15/17/20/21/22), never blind.
- Roadmap **composite codes** (`T2-M1-F2`) keep internal letters (lookbehind
  guards); plan-local card labels (ui-v2's M1→M7) stay.
- `git ls-files 'docs/living/**/*.md'` does NOT match the dir's top level —
  the first sweep silently missed decisions/roadmap/taste etc.; caught by the
  leftover-grep audit (PH3 in action).

Also repaired a co-agent's AGENTS.md clobber (their ADR-139 insertion ate the
"Push each quality rule…" bullet lead) + normalized their fresh ADR-139's
"R8"→"HR-8". gen:narrative/gen:docs/prd-regions/checkpoint regenerated —
**zero .gen.ts diffs** (player text untouched). verify 17 green ·
verify:tooling 25 green. Old ids remain valid in journal/archive via the
ADR-140 table.

## Next intended steps (current)

1. P2 — `verify:tooling` meta-suite (nightly-only), five fixture-driven groups.
2. P3 — no-tree-mutation extension + delete `no-bulk-git-add` + micro-hygiene.
3. P4 cuts 1–4, one commit each (relabel sweep first, map in `tmp/`).

## Landmines (current)

- Shared tree is BUSY (4 other agents) — every commit via explicit pathspec;
  re-check `git diff --cached --name-only` before each.
- P3.3 (`settings.local.json` prune) is HUMAN-owned — do not edit; it was
  surfaced as a reminder.
- The other s89 journal (telemetry-e2e-leak) belongs to w6:p1 — never touch.

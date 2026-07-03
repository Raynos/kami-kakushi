# The mechanical checkpoint — generate, don't duplicate, applied to PROCESS

**Status:** 📋 PROPOSED — awaiting human read; **no code changed yet**. Applies
the repo's own "single source of truth — generate, don't duplicate" convention
(AGENTS.md Conventions; the pattern `src/scripts/gen-docs.ts` already proves on
game content) to the hand-maintained process layer, so a checkpoint becomes
**one command + one commit** and doc-vs-doc staleness becomes
impossible-by-construction rather than policed after the fact.

**Reading queue:** this is a new `docs/plans/*.md` proposal, so it must be added
to [`project/todo-human.md`](../../project/todo-human.md) in the commit that
lands it (the pre-commit queue gate enforces this).

## Who builds this — Fable or Opus?

**Opus 4.8 — Fable not required.** The judgment this plan needed (what is
derivable, which rung soundly holds each invariant, the cry-wolf
calibration) is already spent and encoded in the audit tables and DoDs
below; what remains is deterministic TypeScript tooling with mechanical,
RED-able acceptance checks (byte-idempotency, token parsing, `--check`
gates). There is no taste surface and no canon prose to author — the fenced
regions are prescribed verbatim. The one judgment call left (the
WARN→block promotion after the soak week) is explicitly reserved for the
human, so the builder never has to make it.

---

## 0 · The problem, with receipts

Roughly half of the repo's 496 commits are process-layer upkeep, and a
recurring class exists *only* to fix process docs against each other
(`docs(status): rewrite the snapshot…`, `docs(queue): drop … from reading
queue`, `chore(repo): archive Plan A … done`, `f1dcacb docs: mark Plan A done +
unblock Plan B (status/queue)`). The game-content layer solved this exact shape
with `gen-docs.ts` → `docs/content/t0-content.md` + a `--check` verify gate.
The process layer never got the same treatment. Live drift, found in the tree
**today**:

1. `project/status/working-agreements.md` § "Commit gate" says the roster is
   "**11 gates** — so it can't drift here." `verify-run.ts` `GATES` has **12**
   (`verify-changelog` landed in `d8722f6`). The sentence that promises it
   can't drift, drifted.
2. `project/status/project-status.md` § "Toolchain" hand-copies the same
   roster ("**12 gates** (tsc, eslint, …)") — correct *today*, and guaranteed
   to rot on the next gate add, exactly as (1) did.
3. `docs/plans/README.md` ends with "_(No active plans right now — the v0.3.1
   build plan finished…)_" while `docs/plans/` holds **seven** live plans.
4. `.githooks/pre-commit`'s header comment lists a 7-gate roster
   ("verify = tsc + eslint + prettier + vitest + verify-content + gen:docs
   --check + pacing:check") — a third stale copy of the same fact.
5. `project/todo-human.md` queue entry for
   `opus-2026-07-02-koku-economy-t0-build.md` says "**being implemented now by the
   main session**" while the snapshot's "Where we are now" says the economy
   re-core is "DONE + pushed … audited."
6. A latent **cry-wolf bug** in `session-brief.sh` (line ~146): it tags a plan
   `✅ … DONE (archive it)` if the Status line matches `done|complete|shipped|✅`
   — but two live plans open with "**Status:** ✅ scope LOCKED", so the brief
   mis-tags LOCKED-but-unbuilt plans as done. Free-prose Status lines are not
   machine-readable; the heuristic guesses.

---

## 1 · Current-state audit — what is derivable, per doc

Classification: **(a)** purely derivable today · **(b)** derivable after a
small convention change · **(c)** judgment-owned, hand-written forever.

### `project/status/project-status.md` (REPLACE-in-place, 120-line cap)

| Section (actual heading) | Class | Notes |
|---|---|---|
| "The game" | (c) | curated pitch prose |
| "Where we are now" | (c) | the core judgment narrative |
| "Waiting on the human" | (c) | curated; live lists already pointed at |
| "Toolchain" — the gate roster + count + `verify:budget` sentence | **(a)** | derivable from `verify-run.ts` `GATES` + `package.json` |
| "Toolchain" — the rest (HMR-off note, hooks one-liner) | (c) | stable mechanisms, rarely drift |
| "Code & repo layout" | (c) | curated altitude |
| "How to resume" (incl. "Next, in order" style priorities) | (c) | the resume point is a taste call |

### `project/status/working-agreements.md`

| Section | Class | Notes |
|---|---|---|
| "Commit gate" — the gate-count sentence | **(a)** | drifted today (11 vs 12) |
| "Checkpoint (run when asked…)" steps 1–6 | (b→thinner) | steps 3–4 become "run `npm run checkpoint` + finish the judgment half" (Phase 5) |
| Everything else (Cadence, Autonomy, Standing rules, A-rules) | (c) | norms, not state |

### `project/todo-human.md`

| Section | Class | Notes |
|---|---|---|
| "## TODO" | (c) | human-only tasks |
| "## Reading queue" — entry **paths** (existence, archived-file moves) | **(a)** | a `git mv` to `project/archive/` is mechanically detectable; paths are backticked spans, so `md-links` does NOT cover them today |
| Queue **membership** (add/remove) | (c) | add is already gated at authoring (pre-commit HARD block for `docs/plans/`); removal = D-089 engagement judgment — never mechanical |
| Entry annotation prose ("being implemented now…") | (b) | flag-only: checkpoint reports when an entry's plan status token changed since it was queued |

### `docs/plans/*.md` + `docs/plans/README.md`

| Item | Class | Notes |
|---|---|---|
| Each plan's `**Status:**` line | **(b)** | today free prose ("🆕 proposal", "✅ scope LOCKED", "📋 PROPOSED — spec only"); add a machine token vocabulary (§2.2) and it becomes parseable — fixing the session-brief mis-tag (§0.6) |
| Plan bodies | (c) | design prose |
| README's trailing "current active plans" note | **(a)** | generate from the dir listing + parsed tokens (fixes §0.3) |
| Done-plan graduation (`git mv` → `project/archive/` + link fixups) | **(b)** | mechanical once the status token exists |

### `docs/living/roadmap.md`

Milestone/fun-slice tick-state (the "Status: ✅ 🔧 🆕 ⏳" legend, headings like
"### T0-M1 — Waking on the estate *(the hook)* — ✅ shipped (v0.3)") is
**(c) — deliberately.** Shipped-ness is an *earned* claim governed by D-054
milestone-integrity (every DoD line met or ADR-amended); deriving ✅ from
commit archaeology would manufacture false green (R3). Checkpoint does **not**
touch the roadmap. The existing `milestone-integrity` gate already owns the
sound machine-checkable slice (DoD instruments resolve to real tests).

### `project/journal/`

Entirely (c) — append-only, lossless, prose. The only mechanical part is the
**file skeleton**: name pattern `YYYY-MM-DD-session-NN[-topic].md` (NN is
global and monotonic; latest is `…-session-48-…`) + the `_TEMPLATE.md` shapes.
Scaffolding the dated file is (a); every byte of content stays hand-written.

---

## 2 · Design — `src/scripts/checkpoint.ts`

One script, two modes, mirroring `gen-docs.ts` exactly:

- `npm run checkpoint` → **write mode**: regenerate fenced regions, archive
  done plans, reconcile queue paths, optionally scaffold a journal skeleton,
  then print a report of what it wrote and what it merely flags.
- `npm run checkpoint:check` → **check mode** (`--check`): regenerate into
  memory and fail on any byte diff or broken invariant; writes nothing. This
  is the verify gate (§3).

### 2.1 Fenced generated regions

Judgment prose and generated text share files, so generation is **surgical**:
the script splices only between markers and preserves every byte outside them.

```markdown
<!-- gen:begin gate-roster (npm run checkpoint — do not edit inside) -->
`npm run verify` = **13 gates** (tsc, eslint, prettier, vitest, …) run in
parallel via `src/scripts/verify-run.ts` (soft 5s budget — `verify:budget`).
<!-- gen:end gate-roster -->
```

| Region id | Target file | Source of truth |
|---|---|---|
| `gate-roster` | `project/status/project-status.md` § Toolchain | `GATES` (extracted to `src/scripts/gates.ts`, §2.6) |
| `gate-roster` | `project/status/working-agreements.md` § Commit gate | same |
| `active-plans` | `docs/plans/README.md` (replaces the stale closer) | `docs/plans/*.md` filenames + parsed status tokens, sorted |
| `version` | (inside `gate-roster` line or omitted) | `package.json` |

Rules that make regions safe: no timestamps or git-derived data inside any
region (determinism, §3.1); all lists sorted by filename; LF + trailing
newline normalized; a target missing its markers is a hard, self-explaining
error ("re-add the markers or run migration"), never a silent skip. The
snapshot's regions are budgeted to stay comfortably inside the existing
120-line pre-commit cap.

### 2.2 Machine-readable plan status (small convention change)

Keep the house `**Status:**` bold-line style; require its first token to come
from a closed vocabulary (prose continues after the token, unchanged):

`📋 PROPOSED` · `✅ LOCKED` (scope approved, unbuilt) · `🔨 IN-PROGRESS` ·
`✅ DONE` · `🧊 PARKED` · `❌ SUPERSEDED`

`docs/plans/README.md` is exempt (it documents the dir — same two-sided
exemption the queue gate already grants it). Both `checkpoint.ts` and
`session-brief.sh` parse this one token — retiring the brief's
`done|complete|shipped|✅` guess that mis-fires on "✅ scope LOCKED" today.

### 2.3 Auto-archive done plans

For each plan whose token is `✅ DONE` or `❌ SUPERSEDED`: `git mv` it to
`project/archive/`, then rewrite intra-repo links that pointed at the old
`docs/plans/` path (scanning the same roots `check-md-links.ts` scans,
recomputing relative paths) **and** rewrite the backticked path in the reading
queue to the archive path, tagging it `(archived — done)`. Stage nothing
except, with `--stage`, the exact paths it moved/edited. This mechanizes what
`docs/plans/README.md` already prescribes by hand ("archive the moment its
Status line reads ✅ done … update any links in the same commit").

### 2.4 Queue reconciliation — auto vs flag

| Action | Rung |
|---|---|
| Rewrite an entry's path when its file moved to `project/archive/` | **auto** (mechanical fact) |
| Report an entry whose target exists nowhere (dead path) | **flag** + red in `--check` (deterministic, auto-fixable) |
| Report an entry whose plan token changed since queued (stale annotation) | **flag only** |
| Report duplicates | **flag only** |
| Add an entry | **never** — authoring-commit's job (existing pre-commit gate) |
| Remove an entry | **never** — D-089: removal encodes human engagement, pure judgment |

### 2.5 Journal skeleton scaffolding

`npm run checkpoint -- --journal "<topic>"` creates
`project/journal/<today>-session-<NN>-<slug>.md` from `_TEMPLATE.md` shape A
with NN = (max existing NN) + 1 — **only if the file doesn't exist; it never
opens or appends to an existing journal file.** Prose stays hand-written;
append-only is preserved because the script only ever creates. A bare
`checkpoint` run just names the newest journal file in its report.

### 2.6 Enabler refactor

`verify-run.ts` executes top-level on import, so `checkpoint.ts` can't import
it. Extract the `GATES` array to `src/scripts/gates.ts`; `verify-run.ts` and
`checkpoint.ts` both import it. Zero behavior change; the roster stays
single-source.

### 2.7 What checkpoint deliberately does NOT touch

Journal bodies · every snapshot/agreements byte outside its markers · the
roadmap (§1) · `decisions.md` · `project/human-in-the-loop/*` · `CHANGELOG.md`
· the PRD · any `src/` code · git state (no commit, no push; no staging unless
`--stage`, and then only its own written/moved paths — never `-A`). It also
refuses to invent state: everything it writes is recomputed from
already-current sources, never from memory of a previous run.

---

## 3 · Teeth — rung per invariant (a gate must never cry wolf)

### 3.1 Freshness gate soundness

`checkpoint --check` can be made **sound** because every input is a committed
worktree file: `gates.ts`, `package.json`, `docs/plans/` listing + status
tokens, `project/archive/` listing, queue paths. No clock, no `git log`, no
mtimes, no network — those are exactly what's excluded from generated regions
(momentum data like "recent commits" stays in `session-brief.sh`, which runs
at session time and is never committed). Same soundness class as
`gen-docs --check`, which already hard-blocks tree-wide. Where determinism
can't hold, the content simply doesn't go in a region — the graceful
degradation is *exclusion*, not a warn-mode gate.

### 3.2 The rungs

| Invariant | Rung | Why it's sound |
|---|---|---|
| Generated regions byte-match a dry-run | **verify gate** (`checkpoint` joins `GATES` — 13th) | deterministic; one-command fix (`npm run checkpoint`); precedent: `gen-docs --check` |
| Plan `**Status:**` token parses (docs/plans/*.md, README exempt) | **verify gate** (same run) | closed vocabulary on a small dir; near-universal → true gate, like the queue gate's HARD path |
| Queue entry paths resolve to a real file | **verify gate** (same run) | existence-only, mirroring `check-md-links`' calibration; auto-fixed by checkpoint for archive moves |
| `✅ DONE` plan still sitting in `docs/plans/` | **loud WARN first** (script + gate stderr), promoted to block after a soak week with zero false fires (A11: test the PASS path) | mid-flight, another agent may mark DONE moments before archiving; blocking tree-wide day one risks "don't fight someone else's red" collisions |
| Queue annotation staleness / duplicates | **script-only report** | judgment-adjacent; a block would train `SKIP_` reflexes |
| Journal skeleton exists | **none** — existing pre-commit journal gate already owns this | don't double-gate |

Budget: the new gate is fs-reads + string splices, no subprocess, no compile —
well under 200ms, invisible inside the 5s parallel budget (critical path stays
vitest). Verified in Phase 4 with `npm run verify:budget`. Bypass symmetry
with the house style: `SKIP_VERIFY=1` already covers docs-only emergencies; no
new bypass env var needed.

---

## 4 · Migration — first fenced-region pass, no history lost

All edits are ordinary forward commits; nothing is rewritten in git history.

1. **Snapshot** — replace-in-place is its contract, so inserting markers and
   regenerating the Toolchain roster line is just a normal snapshot edit.
2. **working-agreements.md** — wrap the gate-count sentence in markers; the
   first regeneration fixes the live 11→12 drift as its proof-of-value.
3. **docs/plans/README.md** — replace the stale "(No active plans…)" closer
   with the `active-plans` region.
4. **Live plans (7)** — prepend the matching token to each existing Status
   line, preserving all prose after it (e.g. "**Status:** ✅ LOCKED — scope
   locked (human, 2026-07-02 — D-111); no code changed yet…"). One-line diffs.
5. **Queue** — no reformat; checkpoint only ever rewrites paths on archive
   moves. Annotations stay as-is (flag-only thereafter).
6. **Journal** — untouched, per append-only lossless; scaffolding only ever
   creates new files going forward.

---

## 5 · Phased steps (each independently committable, verify-green)

**Phase 1 — core script + regions.** `gates.ts` extraction; `checkpoint.ts`
with region splicing, status-token parser, `--check`; npm scripts
`checkpoint` / `checkpoint:check`; marker migration (§4.1–4.3); vitest
coverage for splicing (markers preserved-outside, idempotent, missing-marker
error) and token parsing.
*DoD:* `npm run checkpoint` twice in a row is a no-op the second time;
`--check` goes RED when a gate is added to `gates.ts` without regenerating
(the exact 11→12 bug, now impossible); verify green.

**Phase 2 — plan tokens + auto-archive.** Token migration on all live plans
(§4.4); archive mover + link/queue path fixups (§2.3–2.4).
*DoD:* marking a fixture plan `✅ DONE` + running checkpoint yields the
`git mv`, zero dead links (`md-links` green), and the queue path rewritten —
in one command.

**Phase 3 — journal scaffold + report.** `--journal "<topic>"` creation
(§2.5) and the end-of-run report (wrote / moved / flagged).
*DoD:* scaffold lands with correct next NN; refuses to touch an existing file;
bare run only reports.

**Phase 4 — teeth.** Add `checkpoint` to `GATES` (13); the gate-roster regions
self-update in the same commit (the system now maintains its own docs —
dogfood). Run `verify:budget`; record headroom. DONE-not-archived starts as
WARN.
*DoD:* 13 gates green in parallel, median under budget; a deliberately staled
region blocks a test commit; a clean tree never warns.

**Phase 5 — the simplification payoff.**

- `session-brief.sh`: replace the Status-line guess with the token parse —
  fixes the "✅ scope LOCKED → DONE (archive it)" mis-tag (§0.6) and *shrinks*
  the script.
- `working-agreements.md` § Checkpoint: steps 3–4 become "run
  `npm run checkpoint`, then finish the judgment half (snapshot prose; clear
  queue items the human engaged)."
- `prepare-to-exit/SKILL.md`: stays a pointer (its own design); gains one line
  naming the command.
- Retire the stale roster comment in `.githooks/pre-commit` (point at
  `gates.ts`). **Kept, not retired:** the queue gate (authoring-time,
  complementary), the snapshot line-cap (caps judgment prose too), the journal
  gate (owns a different invariant).
- After a clean soak week: promote DONE-not-archived WARN → block.

*DoD:* brief output correct on a LOCKED plan; agreements/skill diffs are net
deletions; journal notes the promotion decision.

---

## 6 · Risks & anti-goals

- **Shared tree.** Multiple agents edit concurrently. Checkpoint writes only
  inside its own markers (surrounding concurrent prose edits survive), moves
  only token-DONE plans, and stages nothing by default (`--stage` = explicit
  own-paths only, never `-A` — the working-agreements rule, mechanized).
- **No new hand-maintained files.** Everything generates *into existing docs*
  from *already-current sources* (`gates.ts`, `package.json`, dir listings,
  status tokens). No sidecar state file, no manifest to keep in sync — a
  manifest would just be drift with extra steps.
- **No false green (R3).** The one temptation is deriving roadmap ticks or
  plan progress from commits — explicitly out of scope (§1 roadmap row).
  Checkpoint asserts only mechanical facts.
- **Budget.** fs-only gate; measured in Phase 4; if it ever nears the path,
  it's trimmable (it should never be — it reads ~20 small files).
- **Cry-wolf.** Every hard check is deterministic + one-command-fixable;
  mixed-base-rate checks (DONE-not-archived) start at WARN with a measured
  promotion; judgment checks stay report-only. Two-sided exemptions written
  (READMEs).
- **One-screen snapshot.** Generated regions are budgeted; the existing
  120-line cap remains the backstop.
- **Prose/machine separation.** Markers make the boundary visible in the file
  itself; the migration adds "do not edit inside" to every `gen:begin` line.

---

## 7 · Open questions (defaults proposed — none block the build)

1. **Token vocabulary** — the six in §2.2 enough? *Default: yes; extend later
   (the parser rejects unknowns loudly, so growth is a one-line PR).*
2. **Archived plan's queue entry** — keep (path rewritten, tagged) or drop?
   *Default: keep — removal encodes engagement (D-089); the agent clears it
   after the human actually reads.*
3. **Snapshot roster region** — generate in place (§2.1) or shrink the
   Toolchain section to a bare pointer at `gates.ts`? *Default: generate — the
   one-screen snapshot should stay self-sufficient for a cold resume.*
4. **DONE-not-archived promotion** — soak a week then block, or stay WARN
   forever? *Default: promote after one clean week; demote instantly on the
   first false fire.*
5. **Frontmatter vs bold Status line** — YAML `status:` keys instead?
   *Default: keep the house `**Status:**` line + leading token; no YAML
   migration churn across seven live plans and the archive.*
6. **Journal NN source** — keep the global monotonic session number? *Default:
   yes — max(existing)+1, exactly what hand-numbering does today.*

---

## Critical files for implementation

- `src/scripts/checkpoint.ts` (new)
- `src/scripts/verify-run.ts` (GATES → `gates.ts` extraction + 13th gate)
- `project/status/project-status.md` (gen:gate-roster region)
- `project/todo-human.md` (queue-path reconciliation target)
- `src/scripts/session-brief.sh` (Phase 5 token-parse simplification)

---
name: kami-failure-archaeology
description: >-
  The kami-kakushi incident chronicle — every major investigation, dead
  end, rejected fix, and revert, with root cause, evidence (SHA/journal),
  status, and the rule it minted. Load BEFORE: "fixing" anything that
  looks odd or over-engineered (hmr:false, the inert /@vite/client,
  cook-anywhere, T0 silence, the muted SFX engine); proposing a process
  change, gate, or revert; asking "why is there a guard/hook/gate for
  X"; re-opening a settled design ("why no HMR", "why is diverge
  mandatory", "why can't I git add"); investigating a failure that
  smells recurrent (swept commits, dead dev server, false-green tests,
  red CI nobody saw); or writing a plan/retro that cites history. Also
  fires on "has this happened before", "what went wrong with X", "why
  was Y reverted/retired/deleted".
---

# kami-failure-archaeology — the incident chronicle

Purpose: no successor re-fights a settled battle, re-ships a rejected
fix, or "fixes" a deliberate oddity. Everything below cost real time
or real trust once. **Statuses:** `settled` (resolved, rule in force)
· `fenced-off` (a guard/gate blocks recurrence, discipline still
required) · `still-open` (known gap — never silently "solve" it).
Jargon (rung, VN, beat, HR/HD-item, gate) → kami-domain-reference's
glossary.

The SLOP/TASTE class leads: per the human (2026-07-18) it is this
repo's costliest failure class. Weight your caution accordingly.

## A. Slop & taste — the costliest class

### A1. Diverge-LITE under an imaginary deadline — 2026-06-29 · settled
The origin of PH1. In the v0.3 overnight `/loop` (session-19) the agent
invented a deadline no one set and shipped three single-idea
"diverge-LITE" panels to "fit the window". Human: *"full 2–3 variants
or nothing"*; *"correct & slow over shitty & fast"*. Minted **PH1**
(ADR-080, `docs/philosophy/no-clock-no-shortcuts.md:39-50`) and
**ADR-075** (diverge-LITE RETIRED; full working variants live behind
the DEV-panel toggle — `docs/living/decisions/050.md:260-264`). Never
compress quality for a clock; there is no clock.

### A2. The story slop audit + full reboot — 2026-07-06/07 · settled
Session-95 audit of all narrative sources
(`project/audit/reports/2026-07-06-story-narrative-slop-audit.md`):
architecture NOT slop, but line-level prose carried a real LLM accent
(epigram saturation, one-template perks, mechanics ventriloquism), plus
three canon breaks, plus the deep tell — T0's social physics read as a
"fairness machine" (§4: seven near-identical promotion scenes). The
human reopened the whole design layer: the reboot superseded the
surface-rewrite plan IN SCOPE (`project/archive/fable-2026-07-07-story-
reboot.md` §1) — fixed ground was the kernel only. Downstream: the
story bible (`docs/story-bible/`), the `src/core/content/narrative/`
gen pipeline, **ADR-139** (all fiction-voiced text ships from 3+ blind
takes — `narrative-diverge` skill). Aftershock: a fresh-eyes pass found
redlines the migration itself missed (`55179704`) — even a redline
migration needs its own blind re-audit.

### A3. A content edit deleted a mechanic — 2026-07-13 · settled
`ea5710e3` (G4 narrative cutover) rewrote R3's beat; the option
carrying the game's ONE asymmetric `statBonus` ceased to exist "and
every gate stayed green" — grammar still parsed `bonus:`, the type
still declared it, the resolver kept its dead branch
(`docs/living/decisions/150.md:1513-1530`). Also invisible in play
(reward line routed to a tab the player wasn't reading). Fix: the
human ruled RESTORE + a two-sided exactly-one ratchet test
(`src/core/rung-beats.test.ts:364+`). Rule: a mechanic that content
carries needs a test that counts it — presence AND uniqueness.

### A4. prototype/ and ui-demos/ retired — 2026-07-02…09 · settled
Session-46's `prototype/` (7 standalone UI-v2 frames) was judged
novel-but-not-the-direction; graduated to `ui-demos/`; `prototype/`
deleted 2026-07-03; `ui-demos/` itself deleted 2026-07-09 (its field
lives in git history — repo-map prototypes entry). Replacement:
`project/prototypes/`, grouped per owning plan, ⭐/REFERENCE tagged.
Rules minted: variants are a REMASTER, never a frame reinvention
(memory `ui-remaster-midpoint`); homeless graphics ideas get parked —
every proposal names its concrete UI home. NOTE: the visual canon is
**Andon Steel** (ADR-127, human-locked —
`docs/living/decisions/100.md:650`; `docs/living/ui-design.md` is
authoritative); the old woodblock prose was synced out of AGENTS.md
2026-07-18 (`919c2c61`), though stray code comments may still say it
(correction owner: kami-domain-reference §5).

### A5. The W6 10-of-12 false green — 2026-07-13 · settled
The W6 sweep returned 12 redlines; 10 were applied, the wave reported
complete, and `verify` stayed green while 2 sat unfixed — "the author
is the last person to notice, because he remembers *intending* to
apply them" (**ADR-188**, `docs/living/decisions/150.md:1423-1440`).
No gate can hold it. Rule: a reviewer's findings list is written to
DISK as a checklist BEFORE any fix lands, ticked as each does — never
held in context (AGENTS.md Conventions; steps in diverge /
narrative-diverge / battery).

### A6. Defaults shipped over a human-owed fork — 2026-07 · settled
ADR-112's own build DoD said the quest-home fork "must be resolved
WITH the human" — it shipped on the agent's default instead; the
agent-default audit (ADR-119, `docs/living/decisions/100.md:438`)
walked every such default with the human and got two overridden
(sibling ADR-120: hearth/chest built as raw stat bonuses, diverging
from stated intent). Rule: a fork the plan marks human-owned is
surfaced, not defaulted (PH4 — surface for async override).

### A7. The Operating Model v2 reel-back — 2026-06-29 · settled
The H10 plan proposed 4 bespoke gates + a ceremony script + 2 skills +
4 ADRs + a CLAUDE.md rewrite; human: "a draft and overengineered".
Reel-back kept ~2 things (pre-commit verify; the playcheck ratchet)
and cut the rest as grep-your-markdown theater
(`project/archive/2026-06-29-operating-model-v2-lite-reelback.md`).
One item was OVERRIDDEN the other way: diverge stays **MANDATORY** —
the accepted anti-slop price. That doc is the template for the
"process-for-its-own-sake" smell; read it before proposing new
ceremony.

### A8. Map look-drift + the blind pass — 2026-07-08/09 · fenced-off
After the session-115 review, a jsdom golden pin hashes every
draw-bearing attribute vs committed `golden.hash.json`
(`b479393b`; regen via `UPDATE_MAP_GOLDEN=1 pnpm exec vitest run
src/ui/map-sheets/golden.test.ts` — golden.test.ts:11). A blind pass
found the T2 ruin's rubble read as garden gravel (`b48eb32c`). Rule:
ALL map work via the `map-sheets` skill + `map-blind-pass`, never
freehand; the committed look changes only via a deliberate pin regen.

## B. Shared-tree git

### B1. Shared-index commit sweeps — 2026-07-04…12 · fenced-off
A bare `git commit` in the multi-agent single checkout snapshots the
SHARED index and commits a co-agent's staged files under your message
(`0e10d96c` swept 6 files). Variants: a pathspec commit swept another
session's uncommitted `vite.config.ts` edit (`89c56247` window,
unattributed landing); `aa6a86ad` resurrected a file a co-agent had
`git mv`'d to archive — REDing the checkpoint gate **only at HEAD**
while working-tree verify stayed green. The old guard was escapable
(any ` -- ` anywhere in a compound command satisfied it — session-126
journal). Session 206 proved by experiment that `git commit --patch`
seeds from the SHARED index (blocked), while `git commit -- <path>`
builds a temp index from HEAD (safe) → **ADR-199**
(`docs/living/decisions/150.md:1860`) +
`docs/guides/shared-tree-git.md`. Fences: `guard-git-add-all.sh`
(escape `SKIP_SWEEPGUARD=1`, ledgered to
`project/status/sweepguard-ledger.md` — 34 historic bypasses were
invisible until the ledger). Discipline still required:
`git diff --cached --name-only` before EVERY commit; file-level
pathspecs; prove HEAD green in a throwaway worktree before pushing
around co-agent WIP.

### B2. Measured contention → ADR-196 locks — 2026-07-13 · fenced-off
Session-199 measured the thrash: 72/548 sessions hit a git collision,
218 push rejects, render.ts at 6.7k lines/183 commits (journal
2026-07-13-session-199). **ADR-196** (`d2e8cf54`): push mutex
(`pnpm run push` via `src/scripts/push-main.sh`; bare `git push`
hook-blocked), exit lane, ADR numbers via
`tsx src/scripts/tree-claim.ts adr`, decisions.md sharded, render.ts
split. Aftershocks worth knowing: the shard move broke 76 relative
links — the md-links gate caught them same-day (`781a30ef`);
untracked plan scaffolds REDed the shared checkpoint gate for
co-agents → scaffold+commit plans in ONE sitting or scaffold in
`tmp/` (memory `plan-scaffolds-red-the-shared-gate`); a pre-lock ADR
renumber race (189→190) is exactly what `tree-claim.ts adr` kills.

### B3. The one sanctioned history rewrite — 2026-06-30 · settled
`git filter-repo` over all 269 commits: scrubbed 58 committed raw
Workflow JSON blobs + converted AI `Co-Authored-By` → `Assisted-by:`
(`project/archive/2026-06-30-history-rewrite.md`). Why it matters
now: raw Workflow JSON is git-ignored local-only, `Co-Authored-By`
for AI is banned (commit-msg hook), and force-push remains
human-sign-off-only — this was the exception that proves it.

### B4. OOPS/BYE laundered half-built work — 2026-07-12 · settled
A too-early prepare-to-exit printed a reassuring banner; killing the
pane left work half-implemented. The banner answers ONE question — is
it safe to kill this pane — and clean git status is not proof. Fix
(`17d8732b`+`7b3bb27d`+`4e4b437a`): "half-built" and "uncertain" both
raise OOPS; a banner ALWAYS prints; timeout → OOPS; exits claim the
`exit` lane first.

## C. Dev server & harness

### C1. The dev-server saga, three rounds — 2026-07-05…11 · settled
Round 1: editing a vite-config dependency re-execs the config; the
port was still held by vite's own pid; `singleServerGuard()` told the
server to kill ITSELF, and a silent capture-download fallback hid the
damage (journal 2026-07-10-session-139). Round 2: `hmr:false` added
to stop reload-on-restart; NOTE an earlier 2026-07-05 "hmr:false
serves stale modules" revert was itself wrong — the real cause was a
missing watcher; `watch.usePolling` + `hmr:false` are load-bearing
TOGETHER (vite.config.ts:269-278). Round 3 (FB-257): `hmr:false` was
still not enough — the dev CSS transform re-imports the HMR client;
final fix serves an **inert own `/@vite/client`** + `<link>` CSS
(`2266bf5a`; vite.config.ts:216-278 narrates it). The old
`hmr === false` assertion test stayed green through the live
regression — replaced with RED-able tests. Rival-spawn class: the
guard's old deny message told agents to `kill <pid>` — they obeyed
and took the human's server down → `guard-dev-server.sh`
(`7fd5ec03`; escapes `KAMI_ALLOW_MULTI_DEV=1`/`SKIP_DEVGUARD=1`).
LAW: one server on :5264; if dead, ask the human. Coda: a foreign
prototype squatting :5199 + `reuseExistingServer` drove the WRONG APP
→ 115 e2e reds of `__qa.fixtures is not a function`; e2e moved to
:5265 (`60101d92`). Wrong-app-on-port is its own trap.

### C2. herdr message executed as shell — 2026-07-10 · fenced-off
`herdr agent send` types BLINDLY; a message typed at a dead pane's
bash prompt + the follow-up Enter ran prose as a command (`syntax
error near unexpected token '('`). Trap inside the fix: `herdr agent
get` prints `agent_not_found` to STDERR and exits 0 either way — the
guard's first draft fail-opened on the exact case it existed for
(journal 2026-07-10-session-147). Fence: `guard-herdr-send.sh`
(escape `SKIP_HERDRGUARD=1`). Ritual: `agent get` (liveness) → `send`
→ `pane send-keys <pane> Enter` → `agent read` confirm.

### C3. Capture tooling perturbed its subject — 2026-07-10/11 · settled
FB-215…257: the game ran on while the human typed a note; the act bar
kept animating while "frozen" (`.frozen` pauses CSS *animations*, but
an inline *transition* has no play-state, and `transition:none` snaps
to 100% — pin computed values first); rAF fires BEFORE paint. Fix:
freeze the ONE shared thing — window's timer functions
(`src/app/freeze-clock.ts`, `cf66f7c4`) — not 17 call sites; laws in
`docs/guides/qa-playtesting.md` §9 (`548db46c`). Rule: a DEV tool
that observes must not perturb (TST2).

### C4. "The harness was the bug, not the log" — 2026-07-13 · settled
Session 191 reported story lines never landing (36 in state, 32 in
DOM) as a game defect. Correction (`6607bdee`): the headless driver
fired ten rakes in ~1.5s — lines were queued behind the reveal
cascade; waiting, all 36 land. Rule: "the UI didn't update" is a
claim about the DRIVER until a control (a shipped verb, at game pace)
proves otherwise. A REAL defect sat underneath (session 192):
emitter/resolver disagreement ×3 + positional greeting ids
(`greeting.<i>`) that a scene reorder would re-point — found only
after the false lead was struck. Sibling trap, since resolved:
`src/scripts/playtest.mjs` had rotted twice over (stale port,
removed `qa.faceWolf()` call) while qa-playtesting.md still
recommended it — RETIRED (deleted) 2026-07-18; the live fight
wrapper is `fight(mobId)` on `window.__qa`. Full `__qa` surface →
kami-debugging-playbook.

## D. Verification & sensors

### D1. Gate rot: ~3s crept to ~33s — 2026-07-10 · fenced-off
Three tests were the whole regression (a full playthrough at describe-
collect time; 24× full app-mounts). ADR-072's soft timer "never
blocks on time" let it rot silently → **ADR-176**: 5s soft / 8s HARD
pre-commit budget (`SKIP_BUDGET=1`), `// @slow` lanes to push/CI
(`VERIFY_FULL=1`) (`f113f2f6`; decisions/150.md:844). Also: the
tsgo-emit-then-test idea was MEASURED AND REJECTED (serializes what
verify parallelizes) — don't re-propose it.

### D2. Fixtures hard-coded; false-green tests — ≤2026-06-30 · settled
~6 tests broke at MS2·8 because they hard-coded DEMO act-counts
instead of deriving from source; a battery found a tautological
assertion and a dead-value ratchet. Minted the always-loaded
test-discipline bullet (ADR-086…088): can-this-go-RED,
fixtures-from-source, assert-the-lever-not-the-collapsed-metric.
NOTE: the `rungThreshold` constant NO LONGER EXISTS (AGENTS.md's
bullet was synced 2026-07-18; two stale comments survive:
`src/scripts/balance-sim.ts:61`,
`src/telemetry/milestones.test.ts:12`); rung progression is authored
requirement lists in `src/core/content/narrative/requirements.md`
compiled to `requirements.gen.ts`. Related: the DEMO (seconds-fast)
profile shipped as prod default for weeks — shortcuts live behind
`import.meta.env.DEV`, never in the shipped default (ADR-056,
decisions/050.md:88).

### D3. SFX false green + copied-regex tests — 2026-07-05 · settled
`sfx.test.ts` claimed "<400ms voices" but only asserted no-throw;
`capture-format.test.ts` asserted COPIED duplicates of the server's
regexes. Fixed in `4b8721f5` (fake captures, RED-proven; import
`SESSION_RE`/`PNG_NAME_RE` from source). The E-class post-adoption:
audit tests for RED-ability, don't just write new ones.

### D4. CI answered and nobody listened — 2026-07-13 · settled
The e2e lane (CI-only by budget) went red at `a4863592` and sat at
3 failed / 88 passed through TWO unread CI runs; found by accident.
Human ruling (**ADR-189**, decisions/150.md:1453): the missing rung
was a READER, not another gate — `session-brief.sh` now probes
verify.yml + e2e.yml at session start (session-brief.sh:297-323).
Fix was `8f746f54`. Rule: read CI's answer; red on a CI-only lane is
YOUR first item, not background noise.

### D5. The orphan sensor cried wolf — 2026-07-12 · settled
DEV Save-health reported "5 orphaned id(s)" on a clean save:
`deliveredDialogue` stores LINE ids but was diffed against DIALOGUE
ids (`aa474c0d`). Rule: a sensor's false positive is its worst
failure mode — it teaches everyone to ignore the one signal that
catches a real rename breaking old saves.

### D6. Balance-freshness is only a WARN — 2026-07-12 · still-open
Session-183 found 33 moved pacing-table rows that a skip-blind sim
made "impossible"; a worktree regen at `9b692a61` attributed them to
session 182's missed ADR-132 regen — the commit-time freshness check
is a WARN, easy to walk past (`.githooks/pre-commit:122` — "WARN
ONLY for now"). The worktree-diff attribution proof is the settled
countermeasure (method → kami-balance-analysis-toolkit). Do not
promote the WARN to a gate on your own — that is a change-control
call.

### D7. Version-label drift — v0.3 cycle · fenced-off
Hand-typed versions diverged (v0.4.1 vs v0.3.1): a hand-copied global
invariant has no feedback loop. Fence: single-source from
package.json (AC-21) + the `verify-changelog` gate (AC-22); releases
only via `/ship` (in this tree `pnpm version` bare-commits the shared
index).

## E. Process & queues

### E1. Records are not queues — 2026-07-12 · settled
Session 183 parked a fresh human ruling in an ADR + snapshot +
journal + HR-item; verdict: all four are RECORDS — "if it's not in
docs/plans/ it will be lost and not built". Session 184 proved it was
already happening: the 3,709-line ADR log had become **a lying TODO
list** — four stale `BUILD TODO` markers (already shipped), and three
✅ ADRs describing mechanisms that don't exist: ADR-164's HP-mend lane
never built (code comments asserted the unbuilt model; since
corrected — `src/core/combat.ts:152` now cites ADR-164/ADR-197
accurately), and ADR-068's SFX engine built then globally MUTED on
the human's "too comedic" call — an un-ADR'd reversal that sat as
contradiction until **ADR-193** canonized "T0 ships SILENT"
(decisions/150.md:1642 — do not "fix" the silence). Fences: the
`deferred-work` gate (`8f50a09f`; gates.ts:95) + the leftover-work
sweep in `/prepare-to-exit`. Rule: work has exactly three queues —
docs/plans/ · HD/HR · BACKLOG.md; an ADR is a CLAIM to verify, never
proof (A12/PH2).

### E2. Snapshot bloat, 326 lines — 2026-06-30 · fenced-off
Append-only instinct bled into the REPLACE-in-place
`project/status/project-status.md` (~22 dated "Phase update" bullets;
invisible for 20+ sessions). Rewritten 326→92. CORRECTION: the
original standalone snapshot gate (`SKIP_SNAPSHOT`/
`SNAPSHOT_MAX_LINES`) is RETIRED — the cap now lives in the
**doc-budgets** gate (`src/scripts/verify-doc-budgets.ts:1-12`
absorbed it; project-status capped at 120, escape `SKIP_DOCBUDGET=1`
for a human-blessed cap raise only).

### E3. The reading queue rotted invisibly — 2026-07-14 · settled
Brief said "all read ✅" while two live entries sat in todo-human.md:
past clears deleted only the first line of wrapped entries AND the
brief's parser matched only single-line `- [ ]` forms (journal
2026-07-14-session-205). Sibling: the brief once mislabelled a bucket
"pending" by matching folder names — single source moved to
`src/scripts/inbox-lanes.ts` (session 165).

### E4. Parallel-drain races — 2026-07-10 · fenced-off
Two live drain lanes nearly double-allocated FB-198; central-ledger
appends race. **ADR-171** (decisions/150.md:656): atomic O_EXCL claim
files validated by pane LIVENESS (never TTL); FB numbers allocate at
CAPTURE time (single writer — race dead at source); the
`inbox-ledger` gate REDs duplicate F-numbers.

### E5. Positional tags bit twice in one day — 2026-07-13 · fenced-off
Inserting one review row renumbered 22 `V<n>`/`SV<n>` tags; a prune
renumbered 3 more — the human found a different bundle at the
remembered tag and concluded it was GONE. **ADR-192** (`99b805bb`,
decisions/150.md:1605): stable ids, never positions; the rewritten
`review-link` gate REDs a cited-but-PRUNED id (the old check silently
reassigned the number to a neighbour).

### E6. HD-40 — the kitchen-pot stall — 2026-07-11 · still-open
"Kitchen-only cook" is BUILT (`canCookHere`; one line in intents.ts
turns it on) but the sim priced the walk at 22.7→31.6 wall-min,
outside the signed [3,25] band (ADR-056) — which lever moves is the
human's open call (HD-40, `project/human-in-the-loop/decisions.md:44`;
decisions/150.md:1218-1236 carries the corrected record — an ADR
bullet had prematurely recorded cooking as SITED). Do NOT enable the
gate or move a lever. ADR-187 deliberately made the sleep sim
skip-blind so IT could not stall the same way (150.md:1385-1389).

## F. Settled one-offs (each minted a durable rule)

| Incident | Rule minted |
|---|---|
| Binary output gave a false-clean diff | Verify transforms in TEXT word-diff vs HEAD + assert NUL-free; count prose by chars (AC-15) |
| Real missing-scrim bug dismissed as "harness artifact" (A8) | Verify a visual oddity, never rationalize it away |
| Signed ADR-053 described the opposite of the code (A12) | An ADR is a claim to verify; the build is the territory (seeds PH2; battery canon-vs-build lens) |
| Compacted context hid a recurring pattern the 83MB transcript showed (A7) | Retrospectives read the JSONL, not memory |
| npm→pnpm half-switch: CI/hooks/ship.sh still invoked npm (`eed79c60`) | A toolchain switch isn't done until every invoker is swept |
| Mobile byōbu layout attempt failed 8 tests, reverted in-session (session 84) | Two good UIs over one compromised responsive |
| ADR-092: a HARD repair fee softlocked a fresh L1 in the no-stranding test | Tension must never push the player OUT; the test forced the soft-fee design (decisions/050.md:404) |
| Reveal state baked into saves needed 6+ per-surface patches | Fix the architecture, not a seventh patch — reveal is DERIVED (ADR-179, 150.md:958) |
| The log was 86–97% of every save as keyless prose; a reword left old saves stale forever | Saves store descriptors, never prose (ADR-186, 150.md:1118) → kami-save-and-schema |

## Deliberate oddities — do NOT "fix" these

| Looks wrong | Is deliberate because |
|---|---|
| `hmr: false` + a served inert `/@vite/client` | C1 — the ONLY complete fix for reload-yanking the human's live game; both halves load-bearing (vite.config.ts:216-278) |
| `watch.usePolling` on | C1 round 2 — without it, hmr:false DID serve stale modules |
| The game is silent; an SFX engine exists but is muted | ADR-193 — T0 ships SILENT (human ruling); un-muting is human-gated |
| `cook_meal` works anywhere despite a built `canCookHere` gate | E6 — HELD pending HD-40 (band violation) |
| Balance-freshness check only WARNs | D6 — promotion is an open change-control call |
| Test RED-ability is a norm, not a lint | D2/ADR-086-088 — a lint would cry wolf (AC-11) |
| Journal/archive still reference deleted dirs (prototype/, ui-demos/) | A4 — append-only record; never scrubbed |
| diverge feels expensive | A1/A7 — MANDATORY by human override; the accepted anti-slop price |

## Doctrine index — incident → standing rule → enforcement rung

| Inc. | Rule | Rung |
|---|---|---|
| B1 | Pathspec-only commits; `git add` NEW files only; no `--patch` | hook `guard-git-add-all.sh` + ledger + ADR-199 guide |
| B2 | Push/exit/ADR-number mutexes | `tree-claim.ts` + `pnpm run push` + hook |
| C1 | One dev server on :5264; never spawn/kill | hook `guard-dev-server.sh` + inert client |
| C2 | herdr: liveness → send → Enter → read | hook `guard-herdr-send.sh` |
| C3 | DEV observation must not perturb | code (`freeze-clock.ts`) + qa-playtesting §9 norm |
| C4 | Driver speed ≠ game pace; run the control first | norm (this file + debugging playbook) |
| D1 | Commit budget 5s/8s; `@slow` lanes | pre-commit gate (ADR-176) |
| D2/D3 | RED-able tests, source-derived fixtures, assert the lever | norm (always-loaded AGENTS.md) |
| D4 | Read CI's answer at session start | reader (`session-brief.sh`) |
| D5 | A sensor never cries wolf | norm |
| D7 | Labels single-sourced | gate `verify-changelog` |
| E1 | Work lives in one of three queues | gate `deferred-work` + exit sweep |
| E2 | Snapshot is REPLACE-in-place, capped | gate `doc-budgets` |
| E4 | FB numbers single-writer; lane claims | gate `inbox-ledger` + claim files |
| E5 | Stable ids, never positions | gate `review-link` (ADR-192) |
| A1 | No clock, no shortcuts | philosophy PH1 |
| A3 | A content-carried mechanic gets a counting test | test ratchet |
| A5 | Redlines land on disk first | norm + skill steps (ADR-188) |
| A8 | Map look changes only via pin regen + blind pass | gate (golden hash) + skill |

## When NOT to use this skill

- Fixing a RED gate right now → **kami-verify-gates**.
- Live-debugging a symptom (not its history) →
  **kami-debugging-playbook**.
- "May I make this change / who signs off" → **kami-change-control**.
- Which invariant am I about to break → **kami-architecture-contract**.
- Save/migration incidents in depth → **kami-save-and-schema**.
- Balance attribution/proof method → **kami-balance-analysis-toolkit**.
- Running a retro/audit procedure → existing `battery` skill.
- A NEW incident: journal it first, then append an entry here in the
  same shape with the journal/SHA cited — this file is the index, not
  a substitute for the journal entry.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3`. Every SHA
above verified to exist via `git log -1 <sha>`; every journal/file
path verified on disk; line-number citations checked same day
(shard files under `docs/living/decisions/` grow — re-grep the ADR
heading if a line number misses). Volatile facts (date-stamped
2026-07-18): HD-40 open; balance-freshness WARN; playtest.mjs
RETIRED (deleted); dev :5264 / e2e :5265.

Re-verify quickly:

```bash
git log -1 --format='%h %s' <sha>          # any cited SHA
grep -n "### ADR-<n>" docs/living/decisions/*.md   # ADR location
grep -n "HD-40" project/human-in-the-loop/decisions.md  # still open?
grep -n "WARN ONLY" .githooks/pre-commit   # D6 still a warn?
ls src/scripts/playtest.mjs   # C4: "No such file" = still retired
grep -c "name: '" src/scripts/gates.ts     # gate count (never hand-type)
```

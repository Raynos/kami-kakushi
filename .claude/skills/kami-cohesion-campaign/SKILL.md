---
name: kami-cohesion-campaign
description: >-
  The decision-gated, multi-session campaign against the project's
  hardest problem per the human (2026-07-18): making kami-kakushi a
  COHESIVE WHOLE — story, narrative, every UI surface, and the gameplay
  loop fitting cleanly and compounding, with graphics/art direction and
  fun elevated together — instead of a "checklist-style, feature-sponge,
  slop-cannon" pile of shallow features. Load when: the human says
  "cohesion", "make it feel like one game", "feature sponge", "slop
  audit", "does X earn its place", "cut/retire a feature", "graphics
  campaign", "art-direction pass", "elevate the UI/HUD"; when you are
  about to propose ADDING a feature to fix a feel problem; when picking
  a large autonomous workstream and the queue is empty; or when resuming
  a partially-run cohesion inventory/scoring pass. Covers the 5-phase
  runbook (orient → inventory → three-way scoring → HD-gated rulings →
  instrument-routed elevation → measured promotion), the registry
  enumeration commands, the scoring rubric, and the fenced wrong paths.
---

# kami-cohesion-campaign

The standing campaign, runnable across many sessions by a solo
zero-context agent. NOTE: this skill was AUTHORED in a repo-read-only
session; the campaign itself runs later with normal write access — all
"write X" steps below assume that.

## Why this campaign exists (the founding steer)

The human, 2026-07-18, asked what the hardest live problem is — not
FB-415, not T1. Verbatim:

> "a lot of shallow features were built in a checklist-style,
> feature-sponge, slop-cannon kind of way... not enough thought around
> a cohesive whole where story, narrative, all the UI surfaces, the
> gameplay loop fit cleanly together and compound... everything exists
> for a game purpose and a story purpose... every element built for
> fun and gameplay and narrative reason. No random gameplay features
> shoehorned in to hit the mega feature checklist."

Same Q&A: the costliest failure class here is **slop/taste**, and the
frontier priority is "game first, but also GRAPHICS GRAPHICS GRAPHICS,
ART, DIRECTION, ETC. UI POLISH, HUD POLISH."

The campaign's test for every shipped element is **three-way purpose**:

| Axis | The question | Canon it answers to |
|---|---|---|
| Game | What decision/loop does it feed? | fun-factor.md §2, PRD |
| Story | What fiction CAUSES it? (TST3, kernel #6 "form is the fiction") | docs/story-bible/00-kernel.md |
| Fun | Which of the seven fun loops does it serve? | docs/living/fun-factor.md §2.1–2.7 |

The steer's bar is ALL THREE: an element with a FAIL on ANY axis is
an incoherence candidate ("everything exists for a game purpose and a
story purpose… every element built for fun and gameplay and narrative
reason" — a single missing story cause is a kernel #6 / TST3
violation, not a pass). Fail-count and WEAK-count are for RANKING
order only (Phase 3), never for filtering candidates out. Fixing one
is NEVER "add a feature" — it is retire, fuse, or elevate, and the
retire/fuse call is the human's (Phase 3).

Jargon (rung, tier, kura, VN, HR/HD, diverge, blind pass, Andon
Steel): see the kami-domain-reference skill's glossary.

## Phase 0 — orient (every session that touches the campaign)

1. Read, in order (point, don't copy — these are living docs):
   - `docs/living/taste.md` (4 values + 21 principles, 150-line
     hard cap — verify-doc-budgets.ts:32)
   - `docs/living/fun-factor.md` §1–2 + §4
   - `docs/living/ui-design.md` §1 + §9 (the anti-slop checklist,
     ui-design.md:348)
   - `docs/story-bible/00-kernel.md`

   Visual canon is **Andon Steel** (ADR-127; ui-design.md
   authoritative — the stale "woodblock/ink" prose was synced out of
   AGENTS.md in commit `919c2c61`, 2026-07-18).
2. Check whether the campaign already progressed — NEVER restart what
   exists (PH2: verify, don't trust your assumption of a blank slate):
   ```bash
   ls project/audit/reports/ | grep -i cohesion
   grep -rln "cohesion" docs/plans/ project/human-in-the-loop/
   ```
   As of 2026-07-18 (HEAD 4bfb3ba3) NO cohesion artifacts exist — but
   five plans dated 2026-07-18 already do, mostly the graphics slate:
   - `docs/plans/fable-2026-07-18-bestiary-plates.md`
   - `docs/plans/fable-2026-07-18-pictogram-ab.md`
   - `docs/plans/fable-2026-07-18-stamp-book-resume.md`
   - `docs/plans/fable-2026-07-18-estate-sheet-craft-pass.md`
   - `docs/plans/fable-2026-07-18-reading-script-interleave.md`

   If those are active, Phase-4 graphics work routes THROUGH them,
   not around.
3. If the campaign has no plan file yet, author one via the
   **write-plan** skill (process class) and queue it in the reading
   queue — "if it isn't in `docs/plans/` it will be lost and not
   built" (human, s183; the deferred-work law). Starting the campaign
   is bias-to-motion-legal (PH4: act, surface for async override);
   every RULING inside it is not (Phase 3).
4. Read the open queues so you don't re-litigate:
   `project/human-in-the-loop/review.md` (27 open at authoring —
   derive the live count, and mind the trap: a bare
   `grep -c "### HR-"` also matches the commented format template's
   `### HR-1 … {what to review}` heading, overcounting by one; use
   the Provenance command below), `decisions.md` (HD-40 open), plus
   `project/BACKLOG.md`.
5. Founding-steer record check: if
   `ls project/feedback-human/ | grep 2026-07-18` is empty, the
   founding quote above is still un-canonized — land it as a dated
   feedback-human entry and lock the cohesion steer as an ADR
   BEFORE any Phase-3 ruling cites it (see Provenance).

## Phase 1 — inventory the shipped game from the REAL registries

Enumerate every player-reachable element. Counts below are the
2026-07-18 values at HEAD 4bfb3ba3 — **regenerate, don't trust**; if
your count differs, the repo moved: re-derive and use yours. Read
committed canon (`git show HEAD:`) if co-agent WIP is in the tree.

| What | Count @4bfb3ba3 |
|---|---|
| Surfaces (panel/tab/verb/row/readout/screen — ADR-179) | 60 |
| Intents (the verb union) | 44 |
| Labour activities | 8 |
| Quests (top-level; deeper-indent ids are STEPS) | 5 |
| Map nodes (ceiling `MAP_NODE_CEILING`, map.ts:49) | 16 |
| Tabs (read `TAB_ORDER` in `src/ui/render.ts`, ~:892) | 8 |
| Cast | 13 |
| Rungs (authored requirement lists — the retired `rungThreshold` meter is gone) | 8 |
| Diverged surfaces awaiting review | 9 |

Enumeration commands — copy-paste from THIS block, one per row
(kept out of the table so the pipes stay real, not `\|`-escaped):

```bash
grep -cE "id: '" src/core/content/surfaces.ts              # surfaces
sed -n "/^export type Intent =/,/^export type IntentType/p" \
  src/core/intents.ts | grep -cE "type: '"                 # intents
sed -n "/^export type ActivityId/,/;/p" \
  src/core/content/activities.ts | grep -c "'"             # activities
grep -cE "^    id: '" src/core/content/quests.ts           # quests
grep -cE "^\s+id: '" src/core/content/map.ts               # map nodes
grep -cE "^\s+id: '" src/core/content/people.ts            # cast
grep -cE "^## " src/core/content/narrative/requirements.md # rungs
grep -cE "^    id: '" src/ui/dev-surfaces.ts               # diverged
```

Also inventory: asks (`src/core/content/narrative/asks.md` → `asks.
gen.ts`, FB-415), scenes/rung beats (`narrative/` sources), weapons/
enemies/skills registries, and the DEV-only surfaces (excluded from
scoring — players never reach them, PH6).

**Branch gate:** a registry file missing or reshaped → do not force
the table; `git log --oneline -5 -- <path>` to see what moved, update
this skill's table in the same sitting (it is yours to maintain).

## Phase 2 — three-way scoring

For each inventoried element, score **game / story / fun** as
PASS · WEAK · FAIL, each with one line of EVIDENCE, never vibes:

- **Game:** the decision it offers or the loop it feeds (which
  resource, which tradeoff). "It exists" is not evidence.
- **Story:** the fiction that causes it — the kernel point, beat, or
  reveal (`revealLine`/`unlock` in surfaces.ts show the authored
  cause; a surface with no diegetic frame fails kernel #6).
- **Fun:** which of fun-factor.md §2's seven loops it serves (deed ·
  rung-climb · pillar · reveal · seasonal · combat ·
  narrative-payoff), and at what cadence.

Write the scored inventory to
`project/audit/reports/<YYYY-MM-DD>-cohesion-inventory.md` (the dir's
dated-report convention), one table row per element, and add it to the
reading queue in the same commit. This file is the campaign's spine —
later sessions resume from it (Phase 0 step 2 finds it).

**Branch gate:** an element you cannot reach as a player while scoring
it (drive the live game on `:5264` — reuse, never spawn; see
kami-build-and-env) is itself a finding: PH6 says it doesn't exist.
Score it FAIL/FAIL/FAIL and note the reach gap.

## Phase 3 — rank incoherences · THE DECISION GATE

Every element with a FAIL on ANY axis is a candidate — the founding
steer demands all three purposes, so a single failed axis (say, no
story cause: a kernel #6 / TST3 breach) is never filtered out. Rank
candidates worst-first by fail-count, then WEAK-count (the counts
order the queue; they never shrink it). Expected shape of findings —
the repo already names candidates, so cross-reference, don't
duplicate:

- Vestigial storehouse rice DEPOSIT row (`project/BACKLOG.md:76` —
  carried rice is always 0 since ADR-163; row permanently disabled).
- Dead `system`-channel scene stat-bonus line (`BACKLOG.md:106` —
  unreachable code, parked deliberately).

A candidate already homed in BACKLOG/HR/HD stays there — link it.

**The gate:** retirement and fusion proposals are DESIGN INTENT —
they change what the game is. File each as an **HD-item** in
`project/human-in-the-loop/decisions.md` (lifecycle: that dir's
README), as a COHERENT BUNDLE of related calls, never 25 atomized
taste questions (ADR-139's bundle law). **NEVER self-execute a
removal.** Routing detail: the kami-change-control skill.

**Branch gate:** while HD rulings are pending, do NOT start Phase-4
work on the ruled items. Independent elevation work (open HR items,
the graphics slate) may proceed — those are separately gated already.

## Phase 4 — elevate, through the correct instrument

Per accepted/ruled item, route by kind — never freehand:

| Kind | Instrument |
|---|---|
| UI surface (new or restyle) | **diverge** skill (ADR-075: 2–3 FULL working variants, DEV toggle, per-variant HR) + **taste-scorecard** Pass 1 BEFORE building |
| Fiction-voiced text | **narrative-diverge** (ADR-139: 3+ blind takes, bundle review) |
| Map/sheet | **map-sheets** skill (golden pin + blind pass) |
| Graphics/art concept | `docs/living/graphics-concepts.md` slate lifecycle — every idea names a concrete UI home; pilots are honest A/Bs where keeping the incumbent is a valid verdict ('"Both are slop, keep emoji" is a valid outcome' — graphics-concepts.md:60, the pictogram A/B) |
| Balance-adjacent | STOP — see fenced paths below |

Build to Andon Steel (ui-design.md §1–4) and the two density
registers; run the §9 anti-slop checklist on everything. Cutting an
approved element follows TST1: delete the old copy, one home.

## Phase 5 — measure and promote

Success is measurable, never judged by your own eye (PH3/PH5 — a
maker is blind to their own gaps; only a human certifies fun/taste):

- **Blind passes** for look-bearing map/sheet work (`map-blind-pass`
  workflow, scored vs map-spec's rubric).
- **Scorecard trend:** the [blind spot] ✘-rate across taste-scorecard
  Pass 2 runs should FALL over the campaign. Watch the ADR-135
  anti-theater tripwire: "if scorecards trend all-✔ with never a ✘,
  the flow is rubber-stamping — revisit the instrument, not the
  surfaces" (docs/living/decisions/100.md:979-980).
- **Playcheck/pacing proxies** stay green in verify (they prove fun's
  ABSENCE only — kami-verify-gates for RED handling).
- **HR/HD queue movement:** items filed by this campaign closing with
  human verdicts; the KEEP rate on diverge variants (how often the
  human keeps your self-pick) is the calibration number.
- **Promotion gate:** human HR/HD sign-off is the ONLY way a
  campaign outcome becomes canon. Alternates stay DEV-only until
  then (zero prod flag-debt, ADR-075).

Each session ends with the normal checkpoint ritual
(**prepare-to-exit**); campaign state lives in the inventory report +
plan Status line + HD/HR items, never in your context.

## Fenced wrong paths (each has bitten or is the named failure class)

- **Adding a feature to fix incoherence.** The feature sponge is the
  disease; more features are more sponge. The fix vocabulary is
  retire · fuse · elevate · reveal-later — and fun-factor §4's order
  (clarity → juice → pacing → goal/choice → novelty → rebalance LAST).
- **Self-certifying taste or fun.** PH5: proxies prove absence; only
  the human certifies presence. Your scorecard is evidence FOR the
  human, not a verdict.
- **Moving balance sliders.** ADR-134/ADR-059: the human tunes by
  cockpit slider, an agent only transcribes exports. A cohesion
  finding that wants a number moved becomes an HD-item plus the
  ADR-132 machine-verdict flow — see kami-balance-analysis-toolkit.
- **Atomizing taste calls at the human.** Bundle per ADR-139 —
  "coherent bundles — never 25+ atomized taste calls."
- **Executing removals before Phase 3's HD rulings return.** Removal
  without a ruling is exactly the silent-decide PH4 forbids.
- **Restarting the inventory because it looks stale.** Re-derive the
  counts against the current tree and AMEND the report (append a
  dated delta section); the scored judgments carry forward.

## When NOT to use this skill

- A single surface build/restyle with no campaign framing → diverge
  + taste-scorecard directly.
- One fiction unit → narrative-diverge. Map work → map-sheets.
- "Is this change agent-safe? / who signs off?" → kami-change-control.
- Debugging, gates, build questions → kami-debugging-playbook,
  kami-verify-gates, kami-build-and-env.
- Adding content the game already coheres around → kami-extension-
  recipes.
- Fresh-eyes audit of one artifact (not the whole) → battery (mini
  or diff mode).
- Frontier/research positioning of the cohesion problem →
  kami-research-frontier.

## Provenance and maintenance

Authored 2026-07-18 from repo state at HEAD `4bfb3ba3` (talk-system
`asks.ts` landed; co-agent WIP in `src/ui/dev-surfaces.ts` et al.
uncommitted — all facts above verified against committed canon via
`git show HEAD:`). The founding human quote is recorded durably in
[`project/feedback-human/2026-07-18-skill-library-rulings.md`](../../../project/feedback-human/2026-07-18-skill-library-rulings.md)
(R1 — the verbatim steer; R2–R4 anchor the sibling skills). Still
owed: the campaign's FIRST session locks the cohesion steer as an
ADR (ADR-022 — a steer this load-bearing belongs in the decision
log; reserve the number via `tree-claim.ts adr`).

Volatile facts (re-verify before leaning on them):

```bash
git rev-parse --short HEAD                      # repo moved?
ls project/audit/reports/ | grep -i cohesion    # campaign progressed?
grep -cE "id: '" src/core/content/surfaces.ts   # 60 @4bfb3ba3
grep '^### HR-' project/human-in-the-loop/review.md \
  | grep -vc '{what to review}'   # open HR items — 27 @4bfb3ba3.
                     # A bare `grep -c "### HR-"` ALSO counts the
                     # commented format template's heading (+1) —
                     # always exclude it as above
ls docs/plans/                                  # active plans
```

Phase-1 table counts, the open-queue sizes, and the named graphics
plans WILL drift — regenerate them each run; update this file when a
registry moves homes.

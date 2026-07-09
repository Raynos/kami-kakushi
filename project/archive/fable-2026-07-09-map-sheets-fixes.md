# Map-sheets fixes — trustworthy loop first, then the sheets

**Status: ✅ DONE (2026-07-09, session 135) — all phases landed; see the
audit report's addendum for the finding→commit map. Originally:
human signed off via pre-build Q&A;
all four forks locked on the plan's defaults: Fable builds it this
session (routing upgrade approved), 3-reader/2-of-3 ensemble, the
O-Sato fix lands here with the denylist test (storywave C1.1 ticks off
as done), P4 redraws autonomously. Two mid-build human rulings
(2026-07-09): the blind-pass reader+judge agents route **Opus medium**
(supersedes the 2026-07-08 Sonnet blessing — the ensemble votes stay
the variance instrument, the model upgrade removes tier noise from
reader recall and judge scoring); and **Fable does all map authoring
in this session** — the "Opus, whole plan" routing below is
superseded for this execution.**
**Confidence: ( 85% Opus, 15% Fable )** — every phase routes Opus under
the map rails (map-authoring §6: the pin + rubric + integrity test carry
the risk for geometry work to an EXISTING rubric); Fable/human enters
only if a robust fail turns out to demand a restyle of the committed
look or a rubric change (each an HR/HD-item by §6 anyway).

The follow-up to the map-sheets audit
(`project/audit/reports/2026-07-09-map-sheets-audit.md` — READ FIRST;
finding ids S1–S5 + Finding 0 resolve there). The audit's shape dictates
the plan's shape: **the sheets are structurally sound; the blind-pass
VERIFICATION LOOP is noisy** (the same unchanged T0/T1 drawings scored
all-M-green on 07-08 and 3/7 · 4/11 today, same rubric, same capture
recipe). So: fix the measurement first; redraw only what fails a
reproducible measurement. Mechanical canon fixes land immediately —
they don't depend on the loop.

## Who builds this — Fable or Opus?

**Opus, whole plan** (map-authoring §6: geometry edits / zone work under
the existing idiom are "any model, safely"; the ensemble work is
process/tooling; the blind describe/judge agents stay Sonnet by the
human-blessed 2026-07-08 routing). Escalation rule: if P4 finds a
robust-fail line that cannot be closed without restyling the committed
look or editing a rubric line, STOP that item — restyle = ADR-135 +
HR-item; rubric edit = the spec is the taste artifact (map-styles §4),
Fable/human owns it.

## Context a fresh executor needs (read in order)

1. The audit report (above) + the scored blind-pass report
   (`project/audit/reports/2026-07-09-t0t1t2-map-blind-pass.md`) and its
   07-08 predecessors (`…t0t1-map-blind-pass-3.md`, `…t2-map-blind-pass.md`)
   — the variance evidence lives in the comparison.
2. `docs/guides/map-authoring.md` (§5 the loop · §6 routing) +
   `docs/guides/map-spec.md` (§5 T0/T1 rubric · §6 T2 rubric) +
   `.claude/workflows/map-blind-pass.js` (the loop's code) +
   `src/ui/map-sheets/README.md`.
3. `docs/story-bible/tiers/t0.md · t1.md · t2.md` + `04-cast.md`
   (canon; read-only — ADR-150).
4. Coordination: the storywave-closure plan
   (`docs/plans/fable-2026-07-09-storywave-closure.md`) owns the O-Sato
   fix (its C1.1); the T2 rungs+fog plan
   (`docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`) builds on this
   directory in parallel — its assumptions were audit-verified TRUE, it
   does NOT wait on this plan, and P1 here touches none of its files'
   load-bearing shapes.

## Sequencing

P1 → P2 are immediate and loop-independent. P0 → P3 → P4 is the
measurement chain — no redraw before P3's ensemble verdict. P5 closes.
Shared-tree law throughout: pathspec commits, full verify at code
commits, journal + snapshot per session.

---

## P0 · Make the blind pass reproducible (ensemble) — ½ sitting, Opus

The loop today runs ONE fresh reader per sheet; Finding 0 shows a
single reader flips M-lines on identical pixels. Fix the instrument:

1. **`.claude/workflows/map-blind-pass.js`:** per sheet, spawn **3
   independent blind readers** (identical prompt, no shared context,
   Sonnet as routed); the judge scores EACH description against the
   rubric separately; a line's verdict = **majority (2/3)**; the sheet
   passes when every M-line holds a majority. The report gains a
   per-line **vote-spread column** (`3/3 · 2/3 · 1/3 · 0/3`) so a
   marginal line (2/3 either way) is visibly marginal — that column is
   the redraw-priority signal, not just the binary verdict.
2. Keep capture + phases otherwise unchanged (the recipe byte-matched
   across runs; it is not the noise source). Cost: +2 Sonnet readers
   + judge calls per sheet — cheap.
3. **`docs/guides/map-authoring.md` §5:** one added paragraph recording
   the variance finding and the new rule — a single-reader run is a
   SAMPLE, never a verdict; the ensemble majority is the verdict; a
   sheet's pass/fail claims cite the vote spread. (Norm-rung, not a
   gate — the workflow itself now embodies the rule.)

**DoD:** the workflow file runs green end-to-end on one sheet
(smoke-run T0 alone first — cheapest); the report template shows vote
spreads; the guide paragraph committed.

## P1 · Mechanical canon fixes (S1–S4) — ½ sitting, Opus, no pin

String/comment work only — no geometry, no pin regen; the integrity
test's rung-range assertions must stay green.

1. **S1 · `RUNG_LADDER` (`nodes.ts:26-44`):** first try DERIVING the
   T0 table from `ranks.ts` `rewardOnReach.unlock` room-flags (single
   source, TST1) — read how `room-*` ids map to zone ids; if the
   mapping is clean, derive and delete the literal table; if it is not
   (partial coverage — e.g. R0 zones carry no unlock flag), transcribe
   the real schedule as literals WITH a derivation comment naming
   `ranks.ts` as the source, and fix the header comment either way:
   "DEV rung-preview ONLY — the live map reads core `revealed`; this
   is NOT the reveal schedule's home." `weir`/`kitchen`/`sickroom`
   → the R0 set per the audit table.
2. **S2 · "Otoku" (`nodes.ts:203`):** the bible has no Otoku and
   harvest women are unnamed ambient — rewrite the `who:` line to the
   unnamed form ("village women at harvest"), dropping the invented
   name (mechanical canon-alignment; the sibling "Rokusuke-class" line
   at `:201` keeps its real cast name).
3. **S3 · Macrons:** Kyubei → **Kyūbei** (`nodes.ts:620,652,654`),
   Ganzo → **Ganzō** (`:609`).
4. **S4 · One status story:** rewrite `sheet.ts:610` and `:273` to the
   same truth — "`sheet.ts` is the DEV survey-sheet viewer; its
   geometry is player-bound through `map-variants/sheet-map.ts`
   (ADR-151)" — including the player-visible modal aside text at
   `:273` (keep it in-register; it is DEV-only chrome but reads by
   humans reviewing).

**DoD:** full verify green; grep proves zero `Otoku|Kyubei|Ganzo`
tokens in `src/ui/map-sheets/`; the DEV rung pill previews the real
R0/R1/R2/R3/R4 sequence.

## P2 · The content-string guard (S5) — small, Opus

Neither the pin (geometry-only) nor `integrity.test.ts` (ids/anchors)
can catch retired-name drift in `who`/`blurb`/`wrong` strings — the
exact class the storywave sweep missed here (O-Sato).

1. Add a **retired-name denylist test** (in `integrity.test.ts` or a
   sibling `content-strings.test.ts`): every string field of every
   tier's node roster contains no token from `RETIRED_NAMES` — the
   closed historical set transcribed from the 04-cast name-sweep
   docket (O-Sato · Shigemasa · Tokubei · Tōzō · Kanta · Oyuki ·
   Okimi · Osen · Gonsuke · Jinbei · Tazō · Akagi · Otoku), with a
   comment pointing at `04-cast.md`'s docket as the source. Walk ALL
   string fields generically (Object.values + typeof filter) so a new
   field is covered for free.
2. **RED-proof + coordination:** the test is RED against today's tree
   (the O-Sato ×4) — which proves it bites. Land it in the same commit
   as the O-Sato fix OR after the storywave-closure plan's C1.1 lands,
   whichever comes first; check `git log` for C1.1 before starting and
   note the order taken in the commit body (paste the RED run either
   way).

**DoD:** test green on the fixed tree; the RED run recorded; verify
green.

## P3 · Ensemble re-measure — the robust-fail set (Opus, cheap)

Run the P0 ensemble on **all three sheets**. Snapshot raw output
(`snapshot-research.sh`) + the scored report per the workflow's design.
Interpretation rule (write it into the report):

- **Majority-fail M-lines** = real communication gaps → P4's work list.
- **Split lines (2/3 pass)** = marginal — list them, fix only if the
  fix is free while P4 is in the file.
- **Majority-pass lines that failed today's single run** = variance
  confirmed; no action, the ensemble verdict stands.

Prior evidence says expect the T2 pair — **V3** (the ruin must read
RUINED and largest-footprint; today's reader saw "a normal occupied
building in a tended yard") and **V6** (the road south to the village +
continuing south + the NW upstream path) — to fail robustly: T2 FAILED
its 07-08 pass, the `86f6778`/`b48eb32` fixes were never re-scored, and
today's sample agrees. Do not pre-commit to that conclusion — let the
ensemble rule.

**DoD:** the ensemble report committed; the robust-fail set enumerated
(possibly empty → P4 collapses to "no redraw owed"; the plan then
closes at P5).

## P4 · Redraw the robust fails — Opus under the rails (size: per set)

For each majority-fail M-line, per `map-authoring.md` §5's loop:

1. Read the rubric line + the three readers' actual words (the misses
   name what fresh eyes saw instead — that IS the design brief).
2. Edit the drawing (geometry/ink under the existing idiom — §6 "any
   model, safely"). Candidate shapes from the two prior T2 attempts:
   V3 wants the ruin's brokenness LEGIBLE at fit-zoom (roof gaps /
   collapsed spans / no tended-yard dots), not only at detail zoom;
   V6 wants the south road drawn CONTINUING past the village edge and
   the NW upstream path present — exits must leave the frame.
3. **Pin discipline:** the regen rides the same map-intent commit,
   named in the subject (the audit verified all 5 historical regens
   deliberate — keep the streak).
4. Re-run the ensemble on the touched sheet; iterate to majority-green;
   commit per iteration or per sheet (small commits).
5. **Escalation:** a line that cannot pass without restyling the
   committed look → STOP; ADR-135 + HR-item (Fable/human). A line that
   seems WRONG as a spec → never edit the rubric to pass; HD-item
   (the spec is the human's taste artifact, map-styles §4).

**DoD:** every robust-fail M-line majority-green; pins regenerated
deliberately; per-sheet ensemble reports committed; verify green.

## P5 · Close-out (Opus, trivial)

1. Append the audit's caveat to
   `docs/plans/t2/opus-2026-07-09-t2-rungs-fog.md`: `T2_RUNG_LADDER`
   is DEV-preview-only (as T0's, S1) — a live T2 map must read core
   `ctx.revealed`; the seeded numbers are never the canon schedule.
2. Addendum on the audit report mapping finding → fixing commit.
3. Status → DONE; archive this plan to `project/archive/`; clear its
   queue entry.

## Definition of done (whole plan)

The blind-pass loop yields reproducible ensemble verdicts with visible
vote spreads; all three sheets are majority-green on every M-line (or
the exceptions are open HR/HD-items, not silence); the canon strings
carry zero retired names WITH a test that keeps it that way; the DEV
rung preview tells the truth; the T2 plan carries the ladder caveat.
The audit's one-line goal: *the map layer's green means something
again.*

# Session 135 — 2026-07-09 — map-sheets fixes: trustworthy loop, then the sheets

## ☀️ SUMMARY (read this first)

Executing `docs/plans/fable-2026-07-09-map-sheets-fixes.md` end-to-end
(human signed off via pre-build Q&A; all forks locked on the plan's
defaults, plus two mid-build rulings: blind-pass reader+judge agents →
**Opus medium**; **Fable executes the whole plan this session**, map
authoring included). Runs in parallel with session 134 (storywave
closure) in the SAME shared tree — coordination notes below. This file
is HISTORY; live state is `project/status/project-status.md`.

---

## 1 · P0 — the ensemble blind-pass loop

The audit's Finding 0 (one fresh reader flips M-lines on identical
pixels) → rebuilt `.claude/workflows/map-blind-pass.js`: **3
independent blind readers per sheet**, each description judged
**separately**, per-line verdict = **strict majority (2/3)**, report
carries a **vote-spread column** (`3/3 · 2/3 · 1/3 · 0/3`) as the
redraw-priority signal. Reader+judge routed **Opus medium** (human
ruling this session, supersedes the 2026-07-08 Sonnet blessing);
capture/report stay Sonnet (mechanical). `map-authoring.md` §5 gained
the variance paragraph (single-reader run = SAMPLE, never a verdict);
§6's routing note updated.

**Smoke run (T0 alone, DoD):** 8 agents green end-to-end; report
`project/audit/reports/2026-07-09-t0-map-blind-pass.md`. T0 scored
**M 6/7 · S 2/4** with spreads — vs 3/7 on today's single sample: the
ensemble verdict is visibly saner. Lone M-fail: **R5 at 1/3** (readers
see ruin + house as separate neighbours, not the house within the
ruin's own ground) — the same communication gap family as T2's
suspected V3. R7 marginal-pass 2/3.

**Gotcha paid for:** launching the workflow by `{name:}` served a
STALE session-cached copy of the old single-reader script (its stray
report was deleted, uncommitted); launch by `{scriptPath:}` after
editing a workflow file in-session.

## 2 · P1 — mechanical canon fixes (S1–S4)

- **S1** `nodes.ts` — `RUNG_LADDER` is now **DERIVED** from core
  `content/ranks.ts` `rewardOnReach.unlock` `room-*` flags (single
  source, TST1; the plan's "try derive first" turned out clean). One
  literal remains: `night-rounds: 3` (activity chip, no core map node —
  rides combat's R3). Absent = present from the start: the R0 four
  (weir/sickroom/forecourt/kitchen, no `revealFlag`) + `ruined` (locked
  scenery all tier). Derived values verified:
  gate/paddies/woodshed 1 · woodlot/field-margins 2 ·
  kura/weir-reeds/night-rounds 3 · drill-yard 4 · shrine/orchard 5 ·
  grove 7. Dead `SheetNode.rung` field deleted (never set, never
  read). `sheet.ts` pill now cycles EVERY rung R1–R7 (fog = nearest
  REVEAL stage at-or-below; stages stay sparse placeholder data).
- **S2** "Otoku-class village women" → "village women" (no Otoku in
  04-cast; harvest women are unnamed ambient).
- **S3** macrons: Kyūbei ×3, Ganzō ×1.
- **S4** one status story: `sheet.ts` is the DEV survey-sheet viewer;
  its geometry is player-bound through `map-variants/sheet-map.ts`
  (ADR-151) — both the `:610` comment and the player-readable aside.

Pin GREEN (no regen — nothing look-bearing changed on the committed
sheets); integrity green; full verify 17 gates green.

## 3 · Shared-tree coordination (session 134 runs in parallel)

Session 134 (storywave closure) had ALREADY fixed the O-Sato ×4 in
`nodes.ts` (its C1.1) and built `RETIRED_NAMES` (`names.ts`, 7 names)
+ the map-sheets denylist test (`integrity.test.ts`) — all uncommitted
in the shared tree when P1 landed. Rulings applied: the human's
pre-build Q&A blessed the O-Sato fix riding THIS plan's commit, so
`nodes.ts` was committed WHOLE (their 4 O-Sato→O-Hisa hunks folded in,
credited in the commit body) — removing the mutual pathspec-sweep
hazard on the one mixed-authorship file. Their coupled uncommitted
pair (`names.ts` + `integrity.test.ts`) was left strictly alone for
their own commit; this plan's P2 (extend `RETIRED_NAMES` to the full
04-cast docket + RED-proof) waits until theirs lands.

## Next intended steps

1. P2: after s134 commits the denylist pair → extend `RETIRED_NAMES`
   with the docket's missing names; RED-proof via isolated worktree.
2. P3: ensemble re-measure T0+T1+T2 → the robust-fail set.
3. P4: redraw majority-fail M-lines (T2 V3/V6 the candidates); P5
   close-out.

## Landmines

- Workflow-by-name serves a session-cached script — use `scriptPath`
  after editing `.claude/workflows/*.js` mid-session.
- `RUNG_LADDER` now imports `RANKS` from core — `nodes.ts` is no
  longer a zero-import data module (fine: UI→core is the allowed
  direction; the pin/integrity tests still pass in jsdom).
- The DEV pill's R2/R4/R6 stages reuse the nearest lower REVEAL fog
  poly — the fog GEOGRAPHY is still ADR-151 placeholder data; only the
  seal gating is real.

---

## 4 · P1 committed (split across two commits by the shared tree)

Session 134's pathspec commit of `nodes.ts` (`9b702d8`, their B1
O-Sato fix) swept this session's uncommitted S1–S3 hunks in with it —
the file-level sweep hazard §3 predicted. Work landed correctly;
their message doesn't describe the ladder hunks, so this session's
`sheet.ts` commit body carries the S1–S3 record. The sheet.ts half
(rung pill walks every rung; S4 one-status-story) committed
separately, full verify green, pin GREEN (no regen — nothing
look-bearing).

---

## 5 · P2 — the retired-name guard, completed to the full docket

Session 134's `9b702d8` landed the mechanism (RETIRED_NAMES ×7 + the
generic all-string-fields denylist test over all three tiers' nodes) —
exactly the plan's S5 shape, independently built. This session
completed the list to the FULL 04-cast docket (13): + Kanta (→Kenta) ·
Gonsuke (→Kumazō) · Tazō (→Ganzō) · Tōzō (the old smith; now Tetsuji)
· Osen (sweetheart — origin void) · Otoku (never canon, the S2
invention). Each verified against the bible before listing (Osen
nearly false-listed: decisions.md shows Ohana→Osen, but the whole
sweetheart origin is void — names.ts:39); no current name contains any
listed token as a substring (Matsuzō/Kumazō/Ganzō vs Tazō checked).
RED-proof banked pre-fix in an isolated worktree: the test against
HEAD@1407c6e fails with exactly the O-Sato ×4. prd-drift's RETIRED
table left alone — different mechanism (ADR-keyed, PRD-only), owned by
s134's C3.

---

## 6 · P3 — the ensemble re-measure (all three sheets)

20 agents, all green; report
`project/audit/reports/2026-07-09-t0t1t2-map-blind-pass-2.md` (T2
sheet-verdict corrected in place — the report writer mislabelled a
6/6-M · 5/6-S sheet as FAIL; the workflow rule says PASS); raw output
snapshotted to `project/brainstorms/raw/2026-07-09-…ensemble….json`.

**The robust-fail set (P4's work list):** T0-R7 (1/3, roads don't
read as leading OUT) · T1-R5 (0/3 — readers infer the OPPOSITE
nesting: ruin as separate twin compound) · T1-R6 (1/3, no shrinkage
read) · T1-R7 (0/3, readers explicitly deny through-roads) · T1-R14
(0/3 — the water-works REPAIR reads inverted as failure/drying).
**T2 owes nothing** — V3/V6 pass unanimously; the audit's suspicion
was single-sample noise, the 86f6778/b48eb32 fixes hold and are now
re-scored. Marginals (fix-if-free): T0-R5, T0-R6, T1-R12; S-fails
carried as free-fix candidates (T0/T1 R8+R9, T2 V10).

**Coherence note:** T0's R5/R6 pass marginally while T1's fail
robustly on the SAME one-geography drawing — the nesting/shrinkage
story survives the estate crop but dies at the whole-world frame; the
fix is T1-scale legibility, never moving a landmark.

---

## 7 · P4 — the redraw: the sheet learns to SAY its story

Root cause across all five robust fails, one defect class: **the
story's captions were kanji-only, tooltip-only, or dead data.** The
exit NOTES ("村へ 半里") existed in layout.ts but NO painter consumed
them — R7's roads read as internal lanes; the R14 repair story lived
in DEV tooltips behind red kanji (改・涸 read as "drying, ominous" —
inverted 0/3); R5/R6's nesting/shrinkage relied on pure inference at
fit zoom.

The fix (FB-181/183 idiom — English survey annotations, fit-visible;
every line transcribed from committed canon, never new fiction):

- `layout.ts` — NOTES translated to English + finally painted; three
  exit roads extended to bleed OFF the sheet edge (the proven T2-V6
  lesson); new `SURVEY_NOTES` data (precinct/ring-corner/old-fields/
  boundary-stone/stables lines from nodes.ts wrong-lines + tooltips).
- `ground.ts` — NOTES + SURVEY_NOTES painters (ink-soft, sizes 13/14,
  art layer NOT .ms-fine — the misses happen at fit); English red
  glosses beside 改・涸 (pools) and 改・塞 (breach); precinct ground
  wash 0.26 → 0.33 so the old enclosure reads as ONE ground.

Two capture rounds (tmp/p4-notes, tmp/p4-notes-2): first round found
a note collision (pass-road × ring-corner) + river overlap
(boundary-stone) — repositioned; second round reads composed on both
sheets, my own eyes. Pin regenerated deliberately WITH this commit.

---

## 8 · P4 verified — PASS, unanimous on every fixed line

The T0+T1 ensemble re-verification
(`project/audit/reports/2026-07-09-t0t1-map-blind-pass.md`, raw
snapshotted): **T0 M 7/7 · S 3/4 — T1 M 12/12 · S 4/6, overall
PASS.** Every P3 robust-fail flipped to **3/3 unanimous** (T0-R7,
T1-R5/R6/R7/R14) and the P3 marginals hardened to 3/3 (T0-R5/R6,
T1-R12). Left on the table, S-lines with quotas met: R9 both sheets
(orchard courtyard-rows + bamboo pressure — drawing-level, future
polish) and T1-R8 (the new stables note fixed T0 3/3 but on T1 reads
as a SEPARATE stable beside the drill yard — note placement, future
polish; not chased at ~800k tokens per ensemble iteration).

## 9 · P5 — close-out

Audit-report addendum (finding → fixing commit) appended; T2
rungs+fog plan carries the S1 caveat; plan Status → DONE, archived to
`project/archive/`; checkpoint (snapshot + push) closes the session.

# Session 116 — 2026-07-07 — story-reboot plan finished and archived

**Summary:** The story-reboot plan is finished as a plan and archived to
`project/archive/` (human call, this session): its Phases 0–2 completed
in place, its Phases 3–4 execution already lives in
`fable-2026-07-07-story-bible-finish.md` (A complete, B gated on the
bible blessing), so the doc's remaining role — the frame + kernel-redline
record — is archive-shaped. The frame ADR stays HELD (mints at B0,
citing the archived record); no ADR was minted here.

## What changed

- `docs/plans/fable-2026-07-07-story-reboot.md` →
  `project/archive/fable-2026-07-07-story-reboot.md` — Status rewritten
  to `🗄️ SUPERSEDED` (finished-as-a-plan; record preserved whole;
  ADR-hold restated), then graduated by `pnpm run checkpoint`.
- `docs/plans/fable-2026-07-07-story-bible-finish.md` — status/context
  pointers now cite the archived path; B5 trimmed (reboot no longer in
  its archive list); DoD likewise.
- `docs/plans/fable-2026-07-07-story-salvage.md` — companion pointer
  updated: the ONE live story plan is now bible-finish; reboot cited at
  its archived path.
- `docs/plans/t1/opus-2026-07-03-t1-capstone-branch.md` — reboot
  path pointer → archived path.
- `docs/story-bible/README.md` — history pointer → archived path.
- `project/archive/fable-2026-07-06-story-quality-ladder.md` — forward
  pointer updated (reboot archived alongside; live plan = bible-finish).
- `project/status/project-status.md` — checkpoint-regenerated
  resume-journal pointer (this journal).
- `docs/plans/README.md` active-plans region regenerated to 4 plans —
  landed via a concurrent agent's commit (07aa4ee) whose checkpoint run
  raced mine; content is correct, nothing to re-do.

## Next intended steps

1. The human reads the bible whole (`docs/story-bible/README.md`, top of
   the reading queue) → BIBLE DONE.
2. B0 mints the frame ADR (next free number; 147 is a hole — do not
   backfill), citing `project/archive/fable-2026-07-07-story-reboot.md`.
3. Workstream B proceeds per the finish plan (B1 PRD §5 → B2 engine
   ADRs → B3 prose wave → B4 migration → B5 salvage closure).

## Addendum — the salvage/audit vs bible cross-check

Second act of the session (human ask): read the salvage plan + the full
slop audit and reconcile them against the finished bible. Result:
`project/brainstorms/2026-07-07-salvage-audit-vs-bible-crosscheck.md`
(queued for the whole-read). Verdict: the bible absorbed the audit
nearly whole — canon breaks became rungs, the slop accent became the
prose law, the fairness machine became kernel #7, the protect-list
survived ~8/8. Residue: six small items (anti-thermometer decide rule
unstated · audit-praised lines as B3 salvage stock · kyō-masu/rusui
died with the old spine, weighing-yard noted as the T4 re-entry ·
"…"-react unowned · D5 per-tier want silently dropped · Sōan's epigram
license moved knowingly). No bible edits made — canon is human-locked
and mid-blessing.

## Addendum 2 — the residue ruled and transcribed

The human walked the cross-check residue via AskUserQuestion (all four
recommendations locked): prose law gains **§0.5 rule 7** (a decide is
never a morality dial) · **Kihei owns the "…"-react** (cast entry +
sharp-shapes ration) · **D5 relocked** — the want rule in
`03-tiers.md` + want lines for T0–T3 (board/door/name-at-the-well/
holding's-gate), T4–T6 at their sittings · **B3 salvage baked**
(Munemasa's two lines banked in his cast entry; kyō-masu banked at
T4's weighing-yard). Cross-check doc carries the rulings section;
queue blurb updated. These bible edits are human-ruled locks landed
mid-blessing — the whole-read covers them.

## Addendum 3 — BIBLE DONE; ADR-150 minted; salvage archived

The second question batch landed the big one: **the human had already
read the bible whole and signed off in-session — BIBLE DONE.** Executed
on that word: **ADR-150 minted** (the held frame ADR — reboot frame +
the bible's structural canon as the build wave's charter) · the
**salvage plan archived** (human call; forward pointers to the
cross-check + the audit report; checkpoint graduated it, 3 active plans
remain) · **HR-8 ruled** (stays open until B3 ships, then closes as
moot — condition noted on the item; B5 trimmed to match) · bible README
ledger → DONE · finish-plan Status → workstream B OPEN, B0 ✅ · the
snapshot's resume block updated · queue reconciled (bible read, salvage,
cross-check entries cleared — read/ruled/discussed). Also ruled: Otsuru's
why stays open for T3 (staged depth honored). **Next: B1 (PRD §5
rewrite), then B2 engine ADRs (Opus-routed, each its own plan).**

## Landmines

- Journal/HR-archive entries still cite the old `docs/plans/` path for
  the reboot plan — deliberate (append-only history), not rot.
- B5's archive step now covers ONLY the salvage doc; don't re-archive
  the reboot.
- The active-plans README region is generated — never hand-edit; a
  concurrent checkpoint run by another agent may commit it before you
  (harmless — byte-identical output).

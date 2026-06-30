# Session 33 — 2026-06-30 — stale-markdown sweep + full apply

## ☀️ SUMMARY (read this first)

The human asked what stale markdown / docs the repo carries. Ran a repo-wide
**`Workflow` sweep** of the authoritative docs (history/scratch excluded — A22):
8 doc groups → adversarial verify → convergence critic → completeness critic.
**21 findings, all grounded, 0 refuted.** Report:
[`../audit/reports/2026-06-30-stale-markdown-sweep.md`](../audit/reports/2026-06-30-stale-markdown-sweep.md)
(raw, git-ignored: `../brainstorms/raw/2026-06-30-stale-markdown-sweep.json`).

Root causes: (1) the **D-048 6-tier reshape was never finished rippling into the
PRD vision spine** (the snapshot's "fully rippled" claim was wrong); (2) the
**D-079 active-only clock** didn't propagate to roadmap/D-053; (3) **built features
described as unbuilt** (SFX, `__qa`, the split PRD). The human approved the **13
self-fix rows + 3 decisions** (cross-ref resolver → a verify GATE; gate-roster →
single-source pointer; diverge dead-template → fix §0 now). **Full apply pass in
progress.**

This file is HISTORY; live state is
[`../status/project-status.md`](../status/project-status.md).

---

## 1 · The PRD 6-tier ripple (the big one — HIGH)

`01-vision.md` (+ `06-tech-architecture.md`) still carried pre-reshape **5-tier**
numbering in the load-bearing spine. Rippled to match the canonical §1.6.3 table +
D-048 (T0 Estate-tutorial · T1 Estate-full · T2 Village · T3 Region · T4
Castle-town · T5 Edo):
- **§1.5.1** — added the **missing T1 Estate-full (`R8→R15`) section** (prose +
  pointer to §3, NOT a duplicated table — §3 says T1 is a forward-sketch, and
  duplicating it would create new single-source drift); relabelled the valley
  ladder **T1→T2** and the region ladder **T2→T3**; T0 capstone reveal corrected to
  **Estate-only** (Arms reveals at T1); scoped-forward T3/T4→**T4/T5**.
- **Weapon/combat-line schedule** shifted with the tiers: `T0+2 / T2+3 / T3+4`
  (T1 estate-full adds none — new lines gate to new domains); 2nd line → T2, 3rd →
  T3. (Required for internal consistency once the tiers were relabelled.)
- **§1.5.3/§1.5.4/§1.8** — "FIVE-TIER"→six; the per-tier **rep arc** + **domain
  expansion** re-mapped to 6 tiers (matching §1.6.3); Origin opens **T2→T3**;
  Jinpachi resolves T2→T3 / callback T4→T5; Magobei **T1→T2** antagonist; Hanzaki
  **T2→T3**; Yanagi-watari/Otsuru **T2→T3**.
- **§1.11** antagonist table — shifted each row **+1 tier**, **added a T1
  Estate-full row** (inherited debt continues, no new antagonist); "T3 stub"→T4;
  the rigged-masu motif tiers (Magobei T2 / Kuroiwa T4 / Echizen-ya T5).
- **§1.12** recap — added a T1 line, relabelled valley→T2 / region→T3, the quest
  T1→T2→**T2→T3**, auto-producers **T3+→T4+**.
- **`06`** — auto-producers **T3+→T4+** (4 refs).

**For the human to eyeball:** the rebuilt **T1 Estate-full** section in §1.5.1 +
the new T1 row in the §1.11 antagonist table (reconstructed from §1.6.3 + §3 canon,
not invented). Verified completeness with a residual-old-numbering grep (clean).

## Next intended steps (current)

1. The remaining apply clusters: active-only clock (D-053 supersession + roadmap);
   built-but-unbuilt docs (sfx/ui/qa/capture/docs-README); roadmap status + lows +
   held edits + decisions A/B; the **cross-ref resolver gate** + rotted prd.md links.
2. Re-review the v0.3.1 plan; update the snapshot; **diff re-audit (P1)** to verify;
   push.

## Landmines (current)

- The T1 weapon-line shift (`T0+2/T2+3/T3+4`) was inferred for consistency, not
  spelled in the finding — flag if the human wants the estate-full tier to add a
  weapon line instead.
- The new T1 antagonist-row + T1 §1.5.1 prose are reconstructions from canon —
  the human said they'd eyeball.

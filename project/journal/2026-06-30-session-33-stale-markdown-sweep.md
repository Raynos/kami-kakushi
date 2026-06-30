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

## 2 · Active-only clock cluster (D-079)

The D-079 active-only decision hadn't propagated. Fixed:
- `decisions.md` — **D-053 superseded append-only** (a banner + strikethrough of
  the wrong wall-time Decision → forward-pointer to D-079; the original kept as
  history). This was the literal "an ADR is a claim to verify" (A12) case — D-053
  described the opposite of the shipped `main.ts:174-176`. Fixed the live :157
  cross-ref to cite D-079.
- `roadmap.md` — both clock lines (§ and per-tier) wall-time→**active-only-pause**.
- v0.3.1 plan **Step 6 marked DONE** + corrected the line-ref (`main.ts:174-176`,
  not :205 — the comment already reads correctly, so code side was a confirm).

## 3 · Built-but-described-unbuilt docs

Several docs still framed shipped features as future. Grounded each against the
build (R2) and fixed:
- `sfx-spec.md` — the 3-cue pass is **built & wired** (`src/ui/sfx.ts`: taiko hit,
  shamisen/koto reward, suzu rank-up; Sound on/off toggle). Dropped "Part-2 build
  work / nothing ships sound"; §3 retitled "as built". §4 (full bed) stays deferred.
- `ui-design.md §6.8` — the build maps **rank-up → suzu** (`render.ts:1131`), not
  taiko; the drifted 4-row cue table is replaced by a deferral to sfx-spec (single
  source) + the as-built 3-cue summary; "Part-2 module" wording refreshed.
- `qa-playtesting.md §1` — synced the `__qa` Drive table to the real surface
  (`main.ts:261-383`): `setSpeed`→`speed`; dropped the unbuilt
  `advance`/`advanceSeason`/`export`/`import`; added `frames`/`pause`/`resume`/
  `forceState`/`setSeed`/`jumpToPhase2`/`jumpToAscension` + wrappers.
- `capture-game-states` skill — `__qa.step()` doesn't exist → `frames(1)`/`tick`;
  `frames(n,ms)`→`frames(n)`; dropped the dead `docs/plans/playtesting.md` pointer;
  point to qa-playtesting §1 as the authoritative API list.
- `docs/README.md` — prd.md is a **stub index** (point to `prd/01..07`); added
  `philosophy/` + `plans/` + `sfx-spec.md`; build state M0–M2b → **v0.3 T0 M0–M4**;
  content `t0`→`t0/t1/t2`.

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

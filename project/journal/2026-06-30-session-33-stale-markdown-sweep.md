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
single-source pointer; diverge dead-template → fix §0 now). **FULL APPLY PASS
COMPLETE** — all 21 findings landed across 6 commits, 10-gate verify green
throughout; the new cross-ref gate caught 8 more dead links. Remaining: a diff
re-audit (P1) + push.

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

## 4 · Roadmap status flips

The roadmap still marked the whole shipped T0 arc as 🆕/🔧. Flipped the
v0.3-shipped slices to **✅**: T0-M1 (F3/F4 + header), T0-M2 (F2/F3/F4 + header),
T0-M3 header (the macro spine closes — the audit's #1 item), T0-M4 header. Noted
that **combat (D-076) and koku (D-077) get further v0.3.1 rework** — the 🔧 markers
denoted the reshape-retune (shipped), not that rework. (The "M0–M2b carry-forward"
notes at :58/:76 are accurate history — left as-is.)

## 5 · Lows + held edits + decisions A/B

- **AGENTS.md** — dropped the stale "~1.7s" verify figure (lean on the 5s drift
  budget); appended the **test-discipline enforcement** clarification (held edit:
  milestone-integrity gate = the teeth; per-test RED-ability stays a norm — A11).
- **decisions.md** — D-072 stale timing made drift-proof (don't hard-code a
  figure); **D-088 consequence** gained the enforcement note (held edit).
- **archive.md** — H8 dead link to the retired `pending-prd-changes.md` →
  annotated "(ripple tracker retired 2026-06-29)".
- **Decision B** — `working-agreements.md:18` gate roster: replaced the inline
  6-gate list with a **pointer to `verify-run.ts`** (single source; can't re-drift).
- **Decision A** — `diverge` §0:63: the dead `?balance`/`resolveBootProfile`
  boot-channel (retired by D-056) → gate on `import.meta.env.DEV` + `__qa`; §3
  refs flagged for the §§2-8 v0.3.1 rework.

## 6 · Cross-ref resolver GATE (decision C) — and what it caught

Built `src/scripts/check-md-links.ts` (the 10th `verify` gate) — resolves every
intra-repo relative markdown link's file/dir existence across the authoritative
docs (history/scratch excluded — A22). Anchor-checking deliberately OMITTED: there
are **zero** intra-repo `#anchor` links, and slugifying the §/kanji/emoji headings
would risk crying wolf (A11 — file-existence is the sound, zero-false-positive rung).

**It immediately caught 8 dead links the prose sweep missed** — all PRD-split
artifacts (relative paths never adjusted for the extra `prd/` level):
- 5× `[…](roadmap.md)` in `prd/07` → `../roadmap.md`.
- 3× the `locked-decisions.md` link in `prd/01,03,07` → `../../../project/brainstorms/…`
  (was `../../project/…`, off by one).
Validated the completeness critic's #1 prediction (the split rotted links a prose
review can't see). Wired into `verify-run.ts` + `package.json` (`links:check`,
`verify:seq`); gate count **9 → 10** rippled (AGENTS.md, project-status, working-
agreements; D-072's hard count softened). Also **verified** the AGENTS.md `SKIP_*`
claims (VERIFY/JOURNAL/QUEUE/ATTRIB/SNAPSHOT) all resolve to real hooks.

Note: the "rotted prd.md inbound links" the critic flagged turned out **not broken**
(`[§6.10](prd.md)` → the stub exists + forwards) — imprecise, not dead, so left as-is.

## 7 · Diff re-audit (P1) — caught a regression + missed sections (R3 in action)

Ran an independent 3-lens adversarial diff re-audit (the P1 practice). **It was
NOT clean — and that's the point: I was blind to these.** Fixed all confirmed:
- **HIGH — weapon-line REGRESSION I introduced.** I'd "fixed" the cadence to
  T0+2/T2+3/T3+4, but §3 canon (authored Part-1, not in my diff) is **T0+2 /
  T1+3 sword / T2+4 staff / T3 +0** ("canon, not levers"). The original §1 numbers
  were already right; I reversed them. Reverted to canon across §1.5.1 preamble,
  the T1/T2/T3 sections, the V2 row, and the §1.12 ladder.
- **HIGH — §1.7.1 "LATER world" table** was left old-5-tier (only Yanagi-watari
  was bumped). Rippled it: Daikan's-Office **v1 stub = T4 (beyond v1)** not T3,
  Edo→T5, Kuzuhara/Sawatari→T3, headers, marriage T4/T5, maps T0-T3.
- **MED — §1.14 ADR/Round-A log** (D-009/D-012 v1=T0-T3/T4-stub/T5-roadmap;
  Jinpachi T3/T5; meibutsu T1→T5; marriage T4/T5), **§1.7 origin caption** T3,
  **V5 Gohei** "deployed not first" (first@T1, §3).
- **MED — sfx-spec "as built" mismatch.** The build fires `sfx.hit()` (taiko) on
  **every** `do_activity` deed, not just combat; "weightier on a crit" is unbuilt.
  Corrected the doc to match `src/ui/sfx.ts` + `main.ts:137`.
- **LOW — D-053 banner citation** → the guard is `main.ts:179`, not 174-176.

**Discovered a larger tail (NEW, beyond the sweep's §1 scope):** **§4
(04-combat-balance) is pervasively old-5-tier**, but it's **deliberately
banner-flagged** ("reads old, map through banner, §4 ripple pending"). Completing
it needs **balance design** (the T1 Estate-full split bands — re-derived numbers,
**liquid per D-059**), not hygiene. **Reverted my 3 partial §4 edits** (they broke
the banner's uniformity) and **filed it as a tracked follow-up** (task: "§4 balance
ripple"). One §5 residual (05:650) folded in there.

10-gate verify green after the fixes. The re-audit's only non-fix was the
md-links gate's latent robustness gaps (zero triggers today — not a defect).

## 8 · §4 partial relabel + the rest scheduled in v0.3.1 (human-steered)

Human decisions (from the report's open items): **track the real version**
(package.json `0.0.0`→**`0.3.0`**); **prd.md inbound links stay** (functional
stub); **§1 T1 reconstruction signed off** (both pieces approved).

On §4: scoped it and found it's **NOT a quick relabel** — 256 tier-refs, *mixed*
old/new (§4.8 already 6-tier; §4.0/§4.1 old), and the Estate→T0+T1 split is
**coupled** to the T1 *numbers* (which need the §4.8 floor re-derivation). Human's
call: **relabel now + the full coupled re-derivation → the v0.3.1 plan.** Executed
the safe, separable part:
- **§4.0 magnitude/band table relabeled to 6-tier** — T0 keeps the tutorial ~21K
  (it was already the new-T0 R0–R7 sum), **inserted a new T1 Estate-full row (TBD)**,
  shifted Village→T2 / Region→T3 / Castle→T4 / Edo→T5.
- **Banner rewritten** — the coupled §4 re-derivation (bands/floors/T1-split +
  the bulk §4.1–4.7 bare-ref relabel) now points to the **v0.3.1 plan** (was
  Ship-M1-F2); §4.8 already new; the rest reads old via the key until then.
- **v0.3.1 plan Step 4 (koku)** gained the §4 re-derivation fold-in (it moves the
  same balance numbers). Did NOT blanket-relabel the 443 bare-T-number balance math
  (entangled with the numbers → the coupled v0.3.1 pass; a partial pass would make
  worse hybrid tables).

10-gate verify green. *(The open AGENTS.md edit + session-34 journal are another
editor's WIP — left untouched per shared-tree safety.)*

**Checkpoint (prepare-to-exit):** snapshot brought current (§4.0 relabel +
version + the §4 re-derivation scheduled in v0.3.1 Step 4); all my work committed
+ pushed. `.claude/rules/commit-message-style.md` is the other editor's
uncommitted WIP — left untouched.

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

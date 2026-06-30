# Stale-markdown sweep — authoritative docs (2026-06-30)

_A repo-wide audit of the **authoritative/living** markdown (history/scratch
excluded by design — A22). Run as a `Workflow`: 8 doc groups → adversarial verify
→ convergence critic → completeness critic. Raw verdicts (verbatim, git-ignored):
`../../brainstorms/raw/2026-06-30-stale-markdown-sweep.json`._

## Verdict

**21 findings, all grounded, 0 refuted.** The build is healthy and shipped — **none
are functional defects; the rot is entirely living docs lagging landed work.** Three
root causes account for almost everything:
1. **The D-048 6-tier reshape was never finished rippling through `01-vision.md`** —
   the load-bearing spine (§1.5.1), antagonists (§1.11), reputation/Origin
   (§1.5.3/1.5.4/1.8), and the §1.2 v1-scope still carry **off-by-one pre-reshape
   5-tier numbering**, internally contradicting §1.6/§1.6.3 in the same file. *(This
   contradicts the snapshot's "fully rippled" claim — the snapshot was wrong.)*
2. **The D-079 active-only clock decision didn't propagate** to `roadmap.md` or to
   its own reverser ADR **D-053** (still states the opposite, no supersession marker).
3. **Several built features are still described as unbuilt/future** — the SFX module
   (`src/ui/sfx.ts`), the `__qa` harness surface, the split PRD — across sfx-spec,
   ui-design, qa-playtesting, the capture/diverge skills, docs/README, the roadmap.

13 self-fix hygiene rows; 2 need a human structural call; the completeness critic
adds a high-value follow-up (a cross-ref resolver).

## Self-fix — hygiene (agent applies; "self-adopt doc hygiene")

| # | Sev | File | Fix |
|---|---|---|---|
| 1 | **high** | `prd/01-vision.md` | Finish the D-048 6-tier ripple: §1.2/§1.5 scope T0–T2→T0–T3; §1.5.1 add the missing **T1 Estate-full (R8–R15)** ladder, relabel valley V0–V7 T1→**T2** + region G0–G7 T2→**T3**, stub/roadmap T3/T4→**T4/T5**, T0 reveal = Estate-only; §1.5.3/1.5.4/1.8 "FIVE-TIER"→six, Origin opens T2→**T3**; §1.11 antagonist table shift each row +1 tier + add a T1 row. (Match §1.6.3 + D-048; clears the D-014 pinned note.) |
| 2 | **high** | `sfx-spec.md` | SFX is **built + wired** (`src/ui/sfx.ts`): drop "Part-2 build work"/"nothing ships sound"; mark the 3-cue pass (taiko/koto/suzu) BUILT; keep §4 (ambient/music) as genuinely deferred. |
| 3 | **high** | `roadmap.md` | Flip shipped T0 slices (M1-F3/F4, M2 retunes, all M3, all M4) 🆕/🔧→**✅**; note combat/koku rework is now v0.3.1 D-076/D-077. |
| 4 | med | `ui-design.md` §6.8 | Rank-up = **suzu** bell, not taiko; defer per-cue mapping to sfx-spec (single-source); fix ":491 Part-2 module" wording. |
| 5 | med | `qa-playtesting.md` §1 | Sync the `__qa` Drive table to the real surface (`main.ts:261-383`): `setSpeed`→`speed`; drop unbuilt `advance/advanceSeason/export/import`; add `forceState/jumpToPhase2/jumpToAscension/setSeed/frames/pause/resume`. |
| 6 | med | `roadmap.md` | Clock wall-time→**active-only** (D-079, not D-053); add roadmap to v0.3.1 Step 6 ripple scope. |
| 7 | med | `decisions.md` D-053 | **Supersede (append-only)**: strikethrough the wrong wording + forward-pointer to D-079 (do NOT rewrite); fix the live cross-ref at :157 to cite D-079. |
| 8 | med | `capture-game-states` skill | `__qa.step()` doesn't exist → use `frames(1)`/`tick(dt)`; fix `frames(n,ms)`→`frames(n)`; drop the dead `docs/plans/playtesting.md` pointer; point to qa-playtesting §1. |
| 9 | med | `docs/README.md` | `prd.md` is now a **stub index** (point to `prd/01..07`); add `docs/philosophy/` + `docs/plans/`; build state M0–M2b→**T0 M0–M4 shipped**. |
| 10 | low | `AGENTS.md` :60 | Verify timing "~1.7s"→drop the hard number, lean on the 5s drift budget (also at `decisions.md:634` — completeness critic). |
| 11 | low | `prd/01-vision.md` + `06` | Auto-producers "T3+"→**T4+** at :971 / 06:214,793,884 (match §2.5/§3/§7). |
| 12 | low | v0.3.1 plan Step 6 | Clock comment is `main.ts:174-176` (not :205) and already active-only — Step 6 code-side is just a confirm. |
| 13 | low | `human-in-the-loop/archive.md` | H8 intent link → retired tracker (404); repoint or annotate "(tracker retired 2026-06-29)". |

## Needs a human call (2)

- **A · `diverge` skill dead template** (low) — §0:63/§3 tell authors to mirror the
  `?balance`/`resolveBootProfile`/`VITE_BALANCE_PROFILE` boot channel, **retired by
  D-056**. The §3 refs sit inside the §§2-8 branch-model already deferred to v0.3.1.
  → (a) fix §0:63 now + flag §3 for the deferred rework _(rec)_ · (b) defer all to
  the rework · (c) fix every occurrence now.
- **B · `working-agreements.md:18` gate roster** (low) — lists **6** verify gates;
  there are **9** (project-status.md already has the correct list). A volatile fact
  held in two places. → (a) replace the inline list with a pointer to the canonical
  source _(rec — single-source + avoid-new-maintained-files)_ · (b) complete it to 9
  and accept two synced copies.

## Completeness critic — gaps the sweep missed

- **Inbound `prd.md` cross-refs rotted by the split** (the biggest miss; sweep caught
  only the docs/README node): `fun-factor.md:370`, `qa-playtesting.md:4,269`,
  `AGENTS.md:232,295`, `README.md:5`, `project-status.md:24` still link to
  `living/prd.md#§…` anchors that now live in split files.
- The "~1.7s" timing also at `decisions.md:634` (unflagged).
- **No systematic relative-link/anchor resolver** was run — only 2 broken links
  caught incidentally.
- `package.json` version is `0.0.0` vs docs "v0.3" — likely intentional (Vite app);
  worth a one-line reconcile.
- 5 of 7 skills not surfaced — but those were cleared by the 2026-06-30 shelf-ware
  audit, so this is covered.

**Highest-value next check (critic's rec):** a **repo-wide markdown cross-reference
resolver** — assert every `[text](path#anchor)` target exists and that `prd.md`
section-refs resolve to the correct split file. Mechanically verifiable; catches the
PRD-split link rot + any renamed-target drift. Candidate for a new `verify` gate.

## Status

Self-fix rows + the cross-ref repointing are applied in the post-sweep batch (see the
session-32 journal); decisions A/B + the resolver-gate are surfaced to the human.

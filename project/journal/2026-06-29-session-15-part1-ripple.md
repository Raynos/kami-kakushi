# Session 15 — 2026-06-29 — Part 1 of v0.3: the PRD/doc ripple (audit → correct → ripple)

## ☀️ SUMMARY (read this first)

Executing **Part 1 of `path-to-v0.3`** — the markdown-only doc/PRD ripple of the locked 6-tier reshape
(D-048…D-069) + the 5 finalized forks into the PRD section files + the other living docs. Human directive:
audit the `pending-prd-changes` tracker first (stale or complete? respects the new roadmap + the PRD multi-file
breakout?) → if it checks out, do the whole ripple.

**This file is HISTORY, not live state** — the live snapshot is `project/status/project-status.md`.

- **Audit (multi-agent, 5 lenses + convergence critic):** verdict **fix-tracker-then-ripple** — the tracker is
  canon-faithful on the heavy content (all 23 DS locks, 8 reshape ADRs, the DS→ADR crosswalk, all 5 forks
  verbatim, kanji/bands/trade-cap verified; both ✅ done-claims + archive links resolve) but a literal executor
  would mis-edit. Raw: `project/brainstorms/raw/2026-06-29-prd-ripple-tracker-audit.json`.
- **Tracker corrected** for: 2 genuine missing roadmap locks (Staff-line pull-forward → new-T2; combo re-timing
  partial-T2/full-T3), 2 mis-targeted section refs (D-053 clock §6.10→§6.9/§6.3/§2.2; §2.16 reveal-ramp
  under-scoped), 1 wrong instruction (§4.8 "drop DEMO framing" — none there; it's Part-2 `balance.ts`), + hygiene
  (37→~41, §7 124↔204 conflict, Part-1/Part-2 banner, stale op-model "deferred" framing → already ADOPTED+BUILT).
- **Authoritative spec authored:** `docs/plans/2026-06-29-part1-ripple-spec.md` — the OLD→NEW tier mapping (the
  Estate *splits*; the renumber is NOT mechanical), the per-system re-placement table, the invariants, and the
  12-file work-list. Every ripple agent reads it so the mapping is applied identically.
- **Ripple EXECUTED (12-agent Workflow + convergence critic):** all 7 PRD section files + 5 living docs rippled.
  **`npm run verify` GREEN (9 gates, incl. `verify-prd`); ZERO accidental deletions** (the §7.2 M0–M7 gut,
  ~538 lines → a delegation pointer to `roadmap.md`, was the only large deletion; §7.1/§7.3/§7.4 survive);
  **ZERO missing work-list items**; tier mapping + net-new re-placements (Staff→T2, combos partial-T2/full-T3,
  rivals begin-T2/climax-T3, retinue+E1→E2 in T1) all consistent; invariants intact (kanji, 20–35% band, trade
  ≤⅓, 70/30, the D-053 clock reframe). Diff ≈ **+1322 / −1241 across 11 files**.
- **Structural-consistency cleanup (manual):** the critic's 6 flagged desyncs were mostly deliberate liquid
  deferrals (the §4 magnitude tables — banner'd, re-derive at Ship-M1-F2 per D-059). Fixed the genuine
  structural contradictions inline: 01-vision §1.2 "five tiers" + §1.14 D-007 ADR-table ref + the T5 Edo climax;
  06-tech the gate-rule mirror + the `T0..T4`→`T0..T5` enum comment + the reveal schedule; 03 §3.0.1(3) (the
  T1-gate mis-statement — it had carried the lenient old-T0 "good in both, one excellent" onto new-T1, which
  D-049 makes "1 GREAT + 1 EXCELLENT") + the gate-distribution flavour cells + the estate-stage R6 residue
  (E1→E2 belongs in T1, not T0); sfx-spec front-matter → house style. **Re-verified green.**
- **Tracker ticked:** the 2 markdown checklists are all `[x]`; the code checklist + `docs/content/` stay open for
  Part 2; the §4-magnitude deferral noted in the top banner. `path-to-v0.3` + `project-status` refreshed.

---

## 1 · Audit the tracker (multi-agent)

Ran the `audit-prd-ripple-tracker` Workflow: 5 independent lenses (feedback↔tracker · ADR↔tracker ·
roadmap↔tracker · PRD-breakout↔tracker · internal-consistency/staleness) → a convergence critic that grounded +
deduped into a go/no-go + the definitive Part-1 markdown scope. Snapshotted raw verbatim, distilled into the
tracker corrections + the spec doc. Verdict **fix-tracker-then-ripple**; **none of it required the human** (all
resolvable from locked canon — the human had already signed off that all PRD feedback is given).

Key confirmed findings: the Staff/polearm 3rd weapon line is **pulled forward from Region into new-T2 Village**
(roadmap:186/223/324 — a locked 2026-06-29 steer the tracker missed); cross-pillar combos surface as a **partial
Office-pairs set at new-T2**, full 4-pillar at **new-T3** (roadmap:205/327). Verified both against the roadmap
before baking into canon.

## 2 · Apply tracker corrections + author the spec

`project/status/pending-prd-changes.md` corrected (Precedence note, 37→~41, DS#10→D-073 crosswalk, §1.6.3 T0-collapse
note, §4.8 DEMO de-scope, §6.9 clock repoint, §2.16 reveal-ramp broaden, weapon-line + combo new items, rival
attribution, §7 cross-link, Part-1/Part-2 banner on the code + docs/content sections, op-model framing,
version-display bullet, SFX-spec as a Part-1 deliverable). Authored
`docs/plans/2026-06-29-part1-ripple-spec.md` (the reshape-mapping linchpin).

---

## Next intended steps (current)
1. **Part 1 is DONE + committed.** Next is **Part 2 — the spine-first v0.3 build** (roadmap T0-M3: the live Estate
   pillar + the BIG T0→T1 ascension, + the T0-M2 HP-carry retune) per `path-to-v0.3` Part 2.
2. At the start of Part 2, re-derive the **§4 balance MAGNITUDES** onto the 6-tier spine (the liquid tables
   banner'd in `prd/04-combat-balance.md`), and regen `docs/content/` once the code reflects the new tiers.
3. **R1** (the human's M0–M2 fun/taste call) is still open in parallel.

## Landmines (current)
- The renumber is **NOT mechanical** — the Estate splits into T0(tutorial)+T1(full); weapon lines, combos,
  pillar reveals, rivals re-place per locked steers. Use the spec's mapping table, not a search-replace.
- §7 (`07-roadmap-scope.md`) is the heaviest edit: gut §7.2 (M0–M7, ~538 lines) + delegate to the living
  roadmap, but RESHAPE-and-KEEP §7.1 (v1 scope) and KEEP §7.3/§7.4.
- `balance.ts` DEMO/REAL retirement + `docs/content/` regen + all code = **Part 2**, not this ripple.

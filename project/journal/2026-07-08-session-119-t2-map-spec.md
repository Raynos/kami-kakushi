# Session 119 — 2026-07-08 — the T2 valley map spec (spec-first gate)

**Summary:** Wrote the **T2 valley map sheet spec** as a new **§6** in
`docs/guides/map-spec.md`, per the map-styles §4 locked flow (**spec → HR
read → build**). The T2 sheet is a **same-class extension** of the estate
survey (mura-ezu, wide) — so **no ADR-075 diverge** (§4.5); it extends the
one master layout. Queued **HR-13** for the human to read the spec BEFORE any
drawing; the build is blocked on that read. No drawing code touched — the gate
holds.

## What changed
- `docs/guides/map-spec.md` — added **§6 · The T2 sheet — the Valley,
  Asagiri (1784)**: §6.0 valley geography (the demotion — estate → one
  compound pictogram, ruin still the largest footprint in the valley;
  frame grows south to Asagiri; anchors that must agree) · §6.1 zone table
  (estate-as-compound + gatehouse/outer-domain + Asagiri's well/market/
  temple/headman/mill/ferry + gorge/quarry/valley-woods/hill-shrines/
  bandit-camp/night-roads/moved-stone, each with its seed-forward wrong
  thing) · §6.2 the `ruinRevealed` re-label (main house ⇄ guest house) ·
  §6.3 look deltas vs the estate-survey default · §6.4 the **V1–V12**
  blind-reader rubric · §6.5 build notes (extend `WORLD` south; new seeded
  vocabulary; T2_NODES/ANCHORS; the pin regen). Also added a §5 pointer to
  §6.4.
- `project/human-in-the-loop/review.md` — **HR-13** filed: read & sign off
  the T2 spec before the build draws (read gate, no scorecard yet — pre-build).
- `project/todo-human.md` — reading-queue line for map-spec §6 (HR-13).

## Next intended steps
1. **Human reads HR-13.** Build is GATED on it (map-styles §4). Do not draw
   the T2 sheet before sign-off.
2. On sign-off → build per map-authoring §6: extend `layout.ts` `WORLD`
   south (estate anchors unchanged so T1 stays a crop of T2) → new seeded
   vocabulary (village block/street, shrine/temple glyph, mill, ferry,
   quarry scar, palisade/campfire) → `ground.ts` T2 composition + the
   `ruinRevealed` seam → `t2-sheet.ts` + golden entry → the blind-pass loop
   against the §6.4 V-lines until all M + ≥half S.
3. Fiction-voiced T2 zone TEXT is NOT in the spec — that's ADR-139
   narrative-diverge territory at build time (not authored solo).

## Landmines
- **Spec, not build.** §6 opens with a "SPEC, pre-build — no drawing until
  sign-off" banner. Respect it — the whole point of the locked flow is the
  cheap read before the expensive draw.
- **Same-class = no diverge.** Do not run the ADR-075 diverge for T2's look
  (§4.5). A diverge is only raised if the build discovers the estate-demotion
  or village grammar genuinely needs a look CHOICE.
- **The one-geography law.** T2 must EXTEND the master (grow `WORLD` south,
  estate anchors fixed) so T0 ⊂ T1 ⊂ T2 stays literal — never a separate
  coordinate space. Inserting marks reshuffles seeds → the golden pin goes
  RED by design; regen deliberately, eyeball first.
- Shared tree: another agent (`w2:p2`) was live on story-wave docs this
  session; only my three files were staged.

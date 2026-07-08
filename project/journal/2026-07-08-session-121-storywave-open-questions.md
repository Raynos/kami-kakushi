# Session 121 — 2026-07-08 — storywave Plan B: walk the 13 open questions

**Summary:** Walked the human through all 13 open questions in
`docs/plans/fable-2026-07-07-storywave-game.md` one by one. All ruled. Three
overrode the plan's executor-defaults; the economy walkthrough also surfaced a
new **soft-caps self-balancing principle** + a **rice/anti-grind economy
shape** (measured units in the kura, finite seasonal pool w/ diminishing
returns, sinks). Captured durably in a brainstorm decision-record for Plan A
to transcribe into the A0 economy docket-ADR.

## What changed
- `project/brainstorms/2026-07-08-storywave-economy-decisions.md` — NEW. The
  full ruling record: soft-caps principle + soft-cap map, Cluster A economy
  (Q3/4/5/8/9 + rice units + anti-grind spine), Clusters B/C/D
  (Q6/7/11/2/13/12/10/1), and an overrides-vs-defaults summary.
- `docs/living/decisions.md` — NEW ADR-163 (economy: soft caps, rice-as-kura-
  units, the sink loop; 🔁 refines ADR-158), ADR-164 (body: defeat still
  bleeds + the no-auto-trickle HP-mend split; 🔁 refines ADR-155), ADR-165
  (every rung-up opens a VN; R2 silent content). Forward-pointer notes added
  to ADR-158 and ADR-155. NB the docket ADRs (152–162) already existed — my
  rulings are refinements, not new dockets.
- `docs/plans/fable-2026-07-07-storywave-game.md` — Open-questions section
  marked ✅ RESOLVED with the ruling summary (original forks kept below for
  reference); a resolved banner at the top; and inline milestone patches for
  the 3 overrides + the rice reframe (G3 keep-the-bleed + no-auto-trickle;
  G4.1 R2-opens-a-VN; G4.5 wage-verb + the rice-as-kura-units/soft-caps
  NEW-scope note).
- `docs/plans/fable-2026-07-07-storywave-game.md` (2nd pass) — added the
  "Economy spec (embed of ADR-163)" block before the milestones + threaded
  G1/G4.5 to it (rice/soft-cap scoping pass; MD-only).
- `project/status/project-status.md` — snapshot "Next" refreshed: Plan B open
  questions RULED (s121), ADR-163/164/165, Economy spec, rebuild PAUSED.
- `project/todo-human.md` — cleared the storywave Plan B reading-queue entry
  (engaged + ruled this session; ADR-089 implicit sign-off).
- `project/journal/2026-07-08-session-121-storywave-open-questions.md` — this.

## Overrode the plan default
- **Q3** wage → collect-at-the-board verb (cadence = ×7/÷7 scalar).
- **Q6** R2 → every rung-up gets a VN (R2's content is silent/narration).
- **Q8** defeat → keep the carried-loss bleed (coin + goods; rice isn't
  pocketed so it's safe by construction).
- **NEW economy:** rice = measured units (shō/bale/koku), lives in the kura,
  never pocketed; anti-grind = finite seasonal pool depleting by diminishing
  returns; sinks = consumption/spoilage/nengu/debt/seed; progress = deeds not
  the rice integer; **soft caps** the stated self-balancing principle.
- **Q9** refined: treatment mends (mon) + manual "rest at sickroom" trickle;
  NO auto HP trickle.

## Next intended steps
1. ~~Plan A transcribes the economy rulings into ADRs~~ — DONE this session
   (human directed it directly; ADR-163/164/165 written as refinements to the
   existing docket). Human intent supersedes §S sync-point 1's Plan-A-owns-ADRs
   convention (ADR-022).
2. ~~Update the plan body~~ — DONE (resolved banner + inline milestone patches).
3. ~~Rice-model scoping pass~~ — DONE. Added an **"Economy spec (embed of
   ADR-163)"** block to the plan (mirrors its calendar/night-round embeds):
   the soft-cap law, rice-as-measured-units (shō/bale/koku), the finite
   seasonal production pool w/ diminishing returns, the five sinks, and a
   milestone split (G1 = units+pool+consumption+spoilage · G3 = HP cap+bleed ·
   G4.5 = wage verb+market+nengu/debt/lease+banked). Threaded pointers into
   G1 (engine-spec slice), G3 (already patched), G4.5 (trimmed to a pointer so
   the two copies can't drift). All magnitudes flagged sim-owned.
4. Plan B execution starts at G0 when the human is ready — **NOT yet** (human
   paused the rebuild: "before we rebuild the whole game wait a minute";
   "don't touch any typescript just yet"). The plan is now build-ready on the
   economy scope; a fresh-eyes read of the Economy spec (is the loop actually
   fun / are the sinks balanced in principle?) is a good pre-build check.

## Landmines
- Shared tree: another agent (graphics) is live — this session touched only
  its own two files (pathspec commit).
- The economy shape here is DESIGN intent, not yet balance numbers — all
  magnitudes stay SIM-OWNED (ADR-132) at build time.

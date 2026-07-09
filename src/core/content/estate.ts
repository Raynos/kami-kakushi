// The estate REPAIR/RECLAMATION ladder (G4 re-fiction of the old U1–U4 kura-works coin ladder;
// bible tiers/t0.md — the T0 estate work is repair + reclamation, not shopping): mend the leased
// weir screens → reclaim the overgrown orchard → raise the granary → the house set in order. Each
// stage still mutates `estateStage` (U0→U4) and grants a small persistent satietyMax bonus — a
// curve-NEUTRAL soft-pacing buffer (it never touches the combat win-rate, computed at full satiety).
// Costs are strictly ascending and the stages are contiguous 1..N (verify-content asserts this).
// NOTE (G4): the numeric SHAPE is unchanged this chunk — `coinCost` still gates each project (the
// rice/deed reframe + coin-lane rewiring land in the NEXT G4 chunk); the strings are re-fictioned to
// the bible's repair/reclamation projects, grounded in flavor.gen (perkWeirSlats · questOrchard*
// · estateSourceStores · estateStands). All numbers are SEED / sim-owned — tune by playtest.

export interface EstateStageDef {
  readonly stage: number;
  readonly label: string;
  /** Integer coin price (base unit mon) — the estate coin sink (ADR-107). */
  readonly coinCost: number;
  readonly satietyMaxBonus: number;
  /** Labour-yield bonus this stage adds, in fixed-point /100 (T0-M4-F2 / ADR-051 / ADR-066): the
   *  coin flywheel — a higher estate raises every labour act's output, so work→coin→upgrade→
   *  MORE output compounds. Cumulative across stages (like satietyMaxBonus). provisional (v0.2). */
  readonly yieldBonusNum: number;
  readonly logLine: string;
  readonly blurb: string;
}

export const ESTATE_STAGES: readonly EstateStageDef[] = [
  {
    stage: 1,
    label: 'Mend the weir screens',
    coinCost: 100, // SEED (sim-owned) — coin-gate retained this chunk; deed reframe is next
    satietyMaxBonus: 20,
    yieldBonusNum: 15, // +15% labour output — the flywheel's first turn
    logLine:
      "You mend the leased weir screens slat by slat — green bamboo split with the grain, lashed wet to tighten as it dries. The rats' road is closed; the lease's damage line stays empty this season. (U1 · Stabilising)",
    blurb: 'Mend the leased weir screens the river rats gnaw through.',
  },
  {
    stage: 2,
    label: 'Reclaim the orchard',
    coinCost: 300, // SEED (sim-owned)
    satietyMaxBonus: 20,
    yieldBonusNum: 20, // cumulative +35%
    logLine:
      'The dens stand empty and the wild rows are cut back — sound fruit trees found under the choke. The day-book opens a line it has not carried in years: orchard. (U2 · Recovering)',
    blurb: 'Clear the overgrown orchard and bring it back to fruit.',
  },
  {
    stage: 3,
    label: 'Raise the granary',
    coinCost: 700, // SEED (sim-owned)
    satietyMaxBonus: 30,
    yieldBonusNum: 30, // cumulative +65% — a full storehouse, real output
    logLine:
      "A second granary is raised board by board and the kura kept past this winter's need. The storehouse takes in more than it pays out at last. (U3 · Prosperous)",
    blurb: 'Raise a second granary; keep the stores past winter.',
  },
  {
    // U4 — the reclamation capstone (was the "long-house" coin sink; ADR-086 scarcity). The
    // flywheel's biggest turn: the late-T0 project to work toward, priming the house's rise to T1.
    stage: 4,
    label: 'Set the house in order',
    coinCost: 1400, // SEED (sim-owned)
    satietyMaxBonus: 30,
    yieldBonusNum: 30, // cumulative +95% — surplus and order, written down
    logLine:
      'Repairs holding, reclamation bearing fruit, the barn full past need — surplus and order, written down. Let it be entered plainly: the estate stands. (U4 · Risen)',
    blurb: 'Repairs hold and the reclamation bears — the estate stands.',
  },
];

export const MAX_ESTATE_STAGE = ESTATE_STAGES.length; // 4

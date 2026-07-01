// The kura-works PURCHASE ladder (U1–U4, D-098; PRD §2.17 / audit #5): the koku SINK
// that mutates `estateStage` (U0→U4). Each stage grants a small persistent
// satietyMax bonus — a curve-NEUTRAL soft-pacing buffer (it never touches the combat
// win-rate, which is computed at full satiety). Costs are strictly ascending and the
// stages are contiguous 1..N (verify-content asserts this). All numbers are
// provisional (v0.2) — tune by playtest.

export interface EstateStageDef {
  readonly stage: number;
  readonly label: string;
  readonly kokuCost: number;
  readonly satietyMaxBonus: number;
  /** Labour-yield bonus this stage adds, in fixed-point /100 (T0-M4-F2 / D-051 / D-066): the
   *  koku flywheel — a higher estate raises every labour act's output, so work→koku→upgrade→
   *  MORE output compounds. Cumulative across stages (like satietyMaxBonus). provisional (v0.2). */
  readonly yieldBonusNum: number;
  readonly logLine: string;
  readonly blurb: string;
}

export const ESTATE_STAGES: readonly EstateStageDef[] = [
  {
    stage: 1,
    label: 'Patch the kura',
    kokuCost: 100,
    satietyMaxBonus: 20,
    yieldBonusNum: 15, // +15% labour output — the flywheel's first turn
    logLine:
      "You spend the house's first surplus mending the cracked kura and re-hanging the rotted door-bar. The stores keep dry now; the estate stops bleeding. (U1 · Stabilising)",
    blurb: 'Mend the cracked storehouse so the rice keeps.',
  },
  {
    stage: 2,
    label: 'Clear the drill yard',
    kokuCost: 300,
    satietyMaxBonus: 20,
    yieldBonusNum: 20, // cumulative +35%
    logLine:
      'The choked drill yard is cleared and a night-watch set. The estate begins to look defended. (U2 · Recovering)',
    blurb: 'Clear the yard and set a night-watch.',
  },
  {
    stage: 3,
    label: 'Reclaim the first shinden',
    kokuCost: 700,
    satietyMaxBonus: 30,
    yieldBonusNum: 30, // cumulative +65% — new paddy, real output
    logLine:
      'The first fallow shinden is broken and put to rice. The house edges toward solvency. (U3 · Prosperous)',
    blurb: 'Break new paddy from the fallow ground.',
  },
  {
    // U4 (v0.3.1 Step 4 — a DEEPER estate koku sink; D-086 scarcity / batch-1 call 4). The
    // flywheel's biggest turn: a late-T0 koku sink to work toward, priming the house's rise to T1.
    stage: 4,
    label: 'Raise the long-house',
    kokuCost: 1400,
    satietyMaxBonus: 30,
    yieldBonusNum: 30, // cumulative +95% — the house stands proud
    logLine:
      'The long-house is re-roofed and the family crest re-hung above a mended gate. The Kurosawa name stands proud again — a house on the rise. (U4 · Risen)',
    blurb: 'Re-roof the long-house and re-hang the crest.',
  },
];

export const MAX_ESTATE_STAGE = ESTATE_STAGES.length; // 4

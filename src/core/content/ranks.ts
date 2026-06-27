// The T0 estate rung ladder (PRD §3.2 / §3.2.1 earned-transition spine / §4.1.1).
// Phase 1 = climb the rungs; each promotes on an AND-gate: the per-rung-reset
// numeric meter ≥ its threshold AND the rung's story milestone. The meter is fed by
// CURATED per-rung activities (a one-to-many set, not a single repeat-counter; FU7).
// `rewardOnReach` fires when promoted INTO that rank (the reveal reads as plot).
//
// M1 authors R0→R2 fully; R3 (the combat gate) is filled at M2a; R4→R7 at M3.

import type { RewardBundle } from '../rewards';
import { NAMES } from './names';

export type RankId = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';

export interface RankDef {
  readonly id: RankId;
  readonly tier: 0;
  readonly title: string;
  readonly kanji: string;
  readonly granter?: string;
  /** Points to fill THIS rung's meter, toward the next rung (per-rung-reset). This is the
   *  DEMO-profile value and the canonical mirror of balance.RUNG_METER_THRESHOLDS.demo (drift
   *  is verifier-enforced). The ACTIVE threshold is resolved per-profile via
   *  balance.rungThreshold(id, state.balanceProfile). */
  readonly meterThreshold: number;
  /** Action ids that feed the meter while AT this rung (curated, one-to-many). */
  readonly eligible: readonly string[];
  /** The story half of the AND-gate (flags). Defaults to always-ready. */
  readonly storyGate: (flags: Readonly<Record<string, boolean>>) => boolean;
  /** Fired when promoted INTO this rank. */
  readonly rewardOnReach?: RewardBundle;
}

export const RANKS: readonly RankDef[] = [
  {
    id: 'R0',
    tier: 0,
    title: 'Day-labourer',
    kanji: '日雇',
    meterThreshold: 14,
    eligible: ['rake_rice'],
    storyGate: () => true, // raking the spilled stores is proof enough to be kept on
  },
  {
    id: 'R1',
    tier: 0,
    title: 'Kept hand',
    kanji: '下人',
    granter: NAMES.elder,
    meterThreshold: 30,
    eligible: ['farm_paddy', 'haul_stores'],
    storyGate: (f) => f['farmed'] === true, // you've taken to the fieldwork
    rewardOnReach: {
      flags: ['rank-r1'],
      unlock: [
        'room-gate-forecourt',
        'room-home-paddies',
        'verb-farm',
        'verb-haul',
        'readout-clock',
        'readout-stamina',
        'panel-rung-ladder',
      ],
      log: [
        {
          channel: 'milestone',
          text: `${NAMES.elder} the elder watches you clear the stores without being told twice. "The house is short of hands and shorter of trustworthy ones. Stay. Earn your rice." You are taken on as a kept hand.`,
        },
      ],
    },
  },
  {
    id: 'R2',
    tier: 0,
    title: 'Trusted hand',
    kanji: '手代',
    granter: NAMES.elder,
    meterThreshold: 48,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: (f) => f['first-fight-survived'] === true, // the humbling fight (M2a) opens R3
    rewardOnReach: {
      flags: ['rank-r2', 'porters-knot'],
      unlock: [
        'tab-skills',
        'room-woodlot-edge',
        'room-near-satoyama',
        'verb-woodcut',
        'verb-forage',
        'verb-face-wolf',
        'row-wood',
        'row-sansai',
        'skill-conditioning',
      ],
      log: [
        {
          channel: 'milestone',
          text: `You can be set to a task and trusted to finish it. ${NAMES.elder} gives you the run of the woodlot and the near hill. A way to track what your hands are learning appears.`,
        },
        {
          channel: 'narration',
          text: "Knotting a load for the woodlot, your fingers tie a porter's knot you never learned — quick, certain, a stranger's habit in your own hands. It means nothing. It will not leave you.",
        },
      ],
    },
  },
  // R3 — Gate-watch: the humbling first fight (the grain-store wolf) opens it; combat
  // goes live (Combat tab, the drill yard, the duty of estate defence).
  {
    id: 'R3',
    tier: 0,
    title: 'Gate-watch',
    kanji: '門番',
    granter: NAMES.drillmaster,
    meterThreshold: 80,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: () => false, // R3→R4 (the Phase-2 gate) is built at M3
    rewardOnReach: {
      flags: ['rank-r3', 'combat-unlocked'],
      unlock: [
        'tab-combat',
        'panel-drill-yard',
        'readout-combat-level',
        'verb-repair',
        'panel-house-influence',
      ],
      log: [
        {
          channel: 'milestone',
          text: `${NAMES.drillmaster} sets you to the estate's defence — pests, beasts, and the masterless men on the woodlot road. A weapon, a yard to train in, and a duty that is yours. You are the gate-watch now.`,
        },
      ],
    },
  },
];

export const RANK_IDS: ReadonlySet<string> = new Set(RANKS.map((r) => r.id));

export function getRank(id: RankId): RankDef {
  const r = RANKS.find((x) => x.id === id);
  if (!r) throw new Error(`unknown rank: ${id}`);
  return r;
}

export function nextRankId(id: RankId): RankId | null {
  const i = RANKS.findIndex((r) => r.id === id);
  if (i < 0 || i + 1 >= RANKS.length) return null;
  return RANKS[i + 1]!.id;
}

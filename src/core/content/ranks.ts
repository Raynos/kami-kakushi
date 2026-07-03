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
  /** Points to fill THIS rung's meter, toward the next rung (per-rung-reset). The canonical
   *  mirror of balance.RUNG_METER_THRESHOLDS[id] (drift is verifier-enforced); resolved at
   *  runtime via balance.rungThreshold(id). Single profile since D-056 (fork retired). */
  readonly meterThreshold: number;
  /** Action ids that feed the meter while AT this rung (curated, one-to-many). */
  readonly eligible: readonly string[];
  /** The story half of the AND-gate (flags). Defaults to always-ready. */
  readonly storyGate: (flags: Readonly<Record<string, boolean>>) => boolean;
  /** Shown by the rung ladder when the meter is FULL but the storyGate is unmet — the deed still
   *  owed, so a maxed bar never reads as a dead/stuck wall (fun-factor "always a visible next goal"). */
  readonly advanceHint?: string;
  /** Fired when promoted INTO this rank. */
  readonly rewardOnReach?: RewardBundle;
}

export const RANKS: readonly RankDef[] = [
  {
    id: 'R0',
    tier: 0,
    title: 'Day-labourer',
    kanji: '日雇',
    meterThreshold: 1100, // D-056 single profile — ≈ 5-min cold-open (mirrors balance.ts)
    eligible: ['rake_rice'],
    storyGate: () => true, // raking the spilled stores is proof enough to be kept on
  },
  {
    id: 'R1',
    tier: 0,
    title: 'Kept hand',
    kanji: '下人',
    granter: NAMES.elder,
    meterThreshold: 2150, // ≈ 10 min
    eligible: ['farm_paddy', 'haul_stores'],
    storyGate: (f) => f['farmed'] === true, // you've taken to the fieldwork
    advanceHint: 'Service enough — now take to the fieldwork. Farm the home paddies.',
    rewardOnReach: {
      // Each rung stamps its own `rank-rN` marker — a deliberate SYMMETRIC set (battery #19 audit):
      // `rank-r1` gates a reveal (intents.ts) and the rest are the per-rung record used by test
      // fixtures + reserved as gate-hooks for later rungs — kept complete, not dead write-only cruft.
      flags: ['rank-r1'],
      // F103 / D-110: the rung-up STORY prose now lives in RUNG_BEATS.R1.greeting (spoken in the
      // beat → Story channel); `applyPromotion` emits the single terse "Rank ↑" marker to Progress.
      // So `rewardOnReach` carries NO log line — only the flags + the surfaces the beat motivates.
      unlock: [
        'room-gate-forecourt',
        'room-home-paddies',
        'verb-farm',
        'verb-haul',
        'readout-clock',
        'readout-stamina',
        'panel-rung-ladder',
      ],
    },
  },
  {
    id: 'R2',
    tier: 0,
    title: 'Trusted hand',
    kanji: '手代',
    granter: NAMES.elder,
    meterThreshold: 2600, // ≈ 12 min
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: (f) => f['first-fight-survived'] === true, // the humbling fight (M2a) opens R3
    advanceHint: 'Service enough — but the grain-store wolf still waits. Face it to rise.',
    rewardOnReach: {
      flags: ['rank-r2', 'porters-knot'],
      // F103 / D-110: both the milestone prose AND the porters-knot narration move into
      // RUNG_BEATS.R2.greeting (the beat's closing narrator line), so all of R2's story prose lives
      // in one place (Story channel). `rewardOnReach` keeps only flags + unlocks; `applyPromotion`
      // emits the terse "Rank ↑" marker to Progress.
      unlock: [
        'tab-skills',
        'room-woodlot-edge',
        'room-near-satoyama',
        'room-deep-satoyama',
        'verb-woodcut',
        'verb-forage',
        'verb-face-wolf',
        'row-wood',
        'row-sansai',
        'skill-conditioning',
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
    meterThreshold: 2800, // ≈ 13 min (not sim-measured — sim stops at the R3 combat gate)
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    // M2·2: R3→R4 opens once you've actually stood the gate-watch — done real combat duty,
    // not merely filled the meter with labour (the `combat-blooded` flag, set on any grind fight).
    storyGate: (f) => f['combat-blooded'] === true,
    advanceHint: 'Service enough — now blood the blade. Stand a real watch in the field.',
    rewardOnReach: {
      flags: ['rank-r3', 'combat-unlocked'],
      // v0.3.2 A7 — staggered combat reveal (§4.6.9): R3 opens combat's FLOOR only — the weapon,
      // the auto-resolve fight loop (verb, auto-modes, retreat), and the Bestiary. Durability +
      // repair + craft/equip wait for R4 (`readout-durability`/`panel-equipment`); the stance
      // control waits for R5 (`stance-control`) — one beat per rung, not the whole tab at once.
      unlock: [
        'tab-combat',
        'panel-drill-yard',
        'readout-combat-level',
        'panel-bestiary',
        'panel-house-influence',
      ],
      // F103 / D-110: story prose → RUNG_BEATS.R3.greeting (Kihei's full VN meet); terse marker only.
    },
  },
  // R4–R7 — the rest of the T0 estate ladder (M2·2, deliberately THIN: threshold + a reveal-as-
  // plot log beat, reusing the existing labour verbs). The estate's trust deepens toward the
  // capstone; R7 sets `t0-capstone`, opening Phase 2 (the Estate-pillar grind) + the T0→T1 ascension.
  {
    id: 'R4',
    tier: 0,
    title: 'Kura-warden',
    kanji: '蔵番',
    granter: NAMES.elder,
    meterThreshold: 2950,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: () => true,
    rewardOnReach: {
      flags: ['rank-r4'],
      // v0.3.2 A7 — the loot→craft beat: weapon durability bands + repair + the Equipment/craft
      // loop (the craft panel + the equip switcher) reveal here, one rung after combat opens.
      unlock: ['readout-durability', 'panel-equipment', 'verb-repair', 'house-omoya'],
      // F103 / D-110: story prose → RUNG_BEATS.R4.greeting (Genemon + the smith Tōzō); terse marker only.
    },
  },
  {
    id: 'R5',
    tier: 0,
    title: 'House-servant',
    kanji: '家人',
    granter: NAMES.elder,
    meterThreshold: 3100,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: () => true,
    rewardOnReach: {
      // D-122 — the T0 status token: reaching R5 mounts the weapon you WIELD on your home wall (the
      // housing status-mirror). The `wall-weapon` flag latches the mount; applyPromotion emits the
      // dynamic reveal line naming your ACTUAL weapon (never a generic sword), and the home renders it.
      flags: ['rank-r5', 'wall-weapon'],
      // v0.3.2 A7 — the combat-rung beat: the stance control (glass-cannon↔tank) reveals here,
      // the last staggered combat surface (§4.6.9). D-119 — the QUESTS tab also reveals at R5 (its own
      // quest-log beat, tab-quests), one beat per rung.
      unlock: ['stance-control', 'tab-quests'],
      // F103 / D-110: story prose → RUNG_BEATS.R5.greeting (Genemon confers + Kihei teaches the
      // stance, two-voice; BQ3). Terse "Rank ↑" marker only.
    },
  },
  {
    id: 'R6',
    tier: 0,
    title: "Steward's man",
    kanji: '用人',
    granter: NAMES.steward,
    meterThreshold: 3250,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: () => true,
    rewardOnReach: {
      flags: ['rank-r6'],
      unlock: ['house-workshops', 'house-granary'],
      // F103 / D-110: story prose → RUNG_BEATS.R6.greeting (Lady Chiyo's full VN meet); terse marker only.
    },
  },
  {
    id: 'R7',
    tier: 0,
    title: 'Trusted of the house',
    kanji: '内衆',
    granter: NAMES.lord,
    meterThreshold: 3400,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    storyGate: () => true,
    rewardOnReach: {
      // the T0 capstone: `t0-capstone` opens Phase 2 (`phaseOf`), where Estate-pillar deeds
      // begin to bank toward the T0→T1 ascension grade (built in M2·3–M2·5).
      flags: ['rank-r7', 't0-capstone'],
      unlock: ['house-study'],
      // F103 / D-110: story prose → RUNG_BEATS.R7.greeting (the lord Shigemasa's capstone VN meet);
      // terse "Rank ↑" marker only. `t0-capstone` fires here regardless of the beat's choice (BQ4).
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

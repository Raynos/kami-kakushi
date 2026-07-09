// The NIGHT-ROUND registry (storywave G2) — an AUTHORED, ON-RAILS combat sequence, not
// free map movement. "Begin the night round" posts at the Gate (bible: its post at the
// gate); the first round is a quest, repeatable after. A round is a list of STAGES, each
// a foe on a named area, resolved through the existing combat resolver on the seeded
// `combat` stream (see `night-rounds.ts`). One stage is the R3 wolf — `scripted: 'survive'`
// — guaranteed survival, NEVER a win (blood on the sill, mostly his; the wolf flees
// bleeding), replacing the old `applyScriptedWolf` semantics.
//
// DORMANT at G2: the registry is EMPTY. The gate surface + quest wiring arrive at G4, so
// no round is reachable in the live arc. Pure-core: DATA + a lookup only.

import type { AreaId } from './areas';
import type { MobId } from './enemies';

export interface NightRoundStage {
  readonly id: string;
  readonly areaId: AreaId;
  /** The foe fought at this stage — a bestiary mob id (`enemies.ts`). */
  readonly foe: MobId;
  /** `'survive'` = the R3 wolf stage: guaranteed survival, never a win. Absent ⇒ a real
   *  fight (win advances, fall ends the round). */
  readonly scripted?: 'survive';
}

export interface NightRoundDef {
  readonly id: string;
  readonly stages: readonly NightRoundStage[];
}

/** The R3 FIRST night round (bible R3 'the grain-watch') — walked at the gate post once R3 opens
 *  (the quest `first_night_round`). Two winnable stages along the kura wall (the store rats, the roof
 *  marten — mirroring the quest's kill:store_rats / kill:marten steps), then the WOLF as a
 *  `scripted: 'survive'` terminal stage: survived-not-won, ribs cracked, the rice behind the door
 *  untouched. Surviving it latches `wolf-survived-not-won` (night-rounds.ts), the R3→R4 requirement.
 *  Repeatable after (the first walk is the quest; later rounds are the ongoing grain-watch duty). */
export const NIGHT_ROUNDS: readonly NightRoundDef[] = [
  {
    id: 'first-night-round',
    stages: [
      { id: 'kura-store-rats', areaId: 'kura', foe: 'store_rats' },
      { id: 'roof-marten', areaId: 'kura', foe: 'marten' },
      { id: 'the-wolf', areaId: 'kura', foe: 'wolf', scripted: 'survive' },
    ],
  },
];

/** A round by id, or undefined (the reducer arm no-ops on undefined — dormant here). */
export function nightRoundById(id: string): NightRoundDef | undefined {
  return NIGHT_ROUNDS.find((r) => r.id === id);
}

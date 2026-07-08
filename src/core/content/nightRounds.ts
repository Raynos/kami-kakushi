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

/** EMPTY at G2 — dormant. The pre-R3 / R3 / post-R3 rounds land as content at G4. */
export const NIGHT_ROUNDS: readonly NightRoundDef[] = [];

/** A round by id, or undefined (the reducer arm no-ops on undefined — dormant here). */
export function nightRoundById(id: string): NightRoundDef | undefined {
  return NIGHT_ROUNDS.find((r) => r.id === id);
}

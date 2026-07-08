// The DEFEAT → sickroom consequence (storywave G3 — ADR-155/ADR-164). A lost fight or a fallen
// night-round routes the MC toward the sickroom: Sōan's ledger grows and whole days are lost, and
// (from G4) the MC is relocated to the sickroom node. Shared so the grind-fight loss branch and the
// night-round fall path apply the SAME cost. PURE + deterministic (no RNG): reads/writes state only.
//
// The ONE-WAY body coupling (ADR-164): this is the DEFEAT cost, NOT an HP mend. HP has no
// auto-trickle — it mends only via the paid treatment action / manual "rest at sickroom", both G4
// sickroom CONTENT; food stays satiety-only. Each caller keeps its own HP-floor + carried-loss
// bleed; only the days + ledger (+ the guarded relocation) live here.

import type { GameState } from './state';
import { MAP_NODE_IDS } from './content/map';
import { advanceClock } from './step';
import { SICKROOM_DAYS_LOST } from './content/balance';
import { TICKS_PER_DAY } from './constants';

/** The placeholder sickroom node id. The node itself lands at G4; until then it is ABSENT from
 *  MAP_NODE_IDS, so the relocation below no-ops and the current arc stays green. */
export const SICKROOM_NODE = 'sickroom';

/** Apply the shared defeat consequences: grow Sōan's ledger by one, lose SICKROOM_DAYS_LOST whole
 *  days (via advanceClock, ON TOP of the caller's own tick cost), and relocate to the sickroom node
 *  ONCE it exists. Never touches HP and never mends (recovery is a deliberate G4 act — ADR-164). */
export function applyDefeatConsequences(state: GameState): GameState {
  let next: GameState = { ...state, soanLedger: state.soanLedger + 1 };
  // G4: delete the guard once the sickroom node exists. Until then relocating to an absent node
  // would strand the player off-graph, so the move no-ops and only the days + ledger apply.
  if (MAP_NODE_IDS.has(SICKROOM_NODE)) {
    next = { ...next, location: SICKROOM_NODE };
  }
  next = advanceClock(next, SICKROOM_DAYS_LOST * TICKS_PER_DAY);
  return next;
}

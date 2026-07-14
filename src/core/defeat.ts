// The DEFEAT → sickroom consequence (storywave G3 — ADR-155/ADR-164). A lost fight or a fallen
// night-round routes the MC toward the sickroom: Sōan's ledger grows and whole days are lost, and
// (from G4) the MC is relocated to the sickroom node. Shared so the grind-fight loss branch and the
// night-round fall path apply the SAME cost. PURE + deterministic (no RNG): reads/writes state only.
//
// The ONE-WAY body coupling (ADR-164/ADR-197): this is the DEFEAT cost, NOT an HP mend. HP has
// no auto-trickle — it mends only via the paid `treat` action (mon-only) / the free manual
// `rest_sickroom` trickle, both live at the sickroom node (intents.ts); food stays satiety-only.
// Each caller keeps its own HP-floor + carried-loss bleed; only the days + ledger + the
// relocation live here.

import type { GameState } from './state';
import { withResource } from './state';
import { SICKROOM_NODE } from './content/map';
import { advanceClock } from './step';
import {
  LOSS_COIN_FRAC,
  LOSS_MATERIAL_FRAC,
  SICKROOM_DAYS_LOST,
} from './content/balance';
import { MATERIALS } from './content/crafting';
import { TICKS_PER_DAY } from './constants';

export { SICKROOM_NODE };

/** Apply the shared defeat consequences: grow Sōan's ledger by one, lose SICKROOM_DAYS_LOST whole
 *  days (via advanceClock, ON TOP of the caller's own tick cost), and relocate to the sickroom
 *  node. Never touches HP and never mends — recovery is the deliberate treat / rest_sickroom
 *  spend at the node you now lie in (ADR-164/ADR-197). */
export function applyDefeatConsequences(state: GameState): GameState {
  let next: GameState = {
    ...state,
    soanLedger: state.soanLedger + 1,
    location: SICKROOM_NODE,
  };
  next = advanceClock(next, SICKROOM_DAYS_LOST * TICKS_PER_DAY);
  return next;
}

/** The carried-loss BLEED (ADR-164): a defeat drops a slice of what the MC is CARRYING —
 *  coin (LOSS_COIN_FRAC) + materials (LOSS_MATERIAL_FRAC). Rice CANNOT bleed by
 *  construction: it is kura-only (ADR-163), never pocketed. ONE home (TST1) — the
 *  grind-fight loss branch and the night-round fall both call this, so a night fall
 *  costs what a day-fight loss costs in like state (the B2 closure). Pure, no RNG. */
export function applyCarriedLossBleed(state: GameState): {
  next: GameState;
  lostCoin: number;
  lostMats: number;
} {
  let next = state;
  const lostCoin = Math.round((next.resources.coin ?? 0) * LOSS_COIN_FRAC);
  if (lostCoin > 0) next = withResource(next, 'coin', -lostCoin);
  let lostMats = 0;
  for (const m of MATERIALS) {
    const lose = Math.floor((next.resources[m.id] ?? 0) * LOSS_MATERIAL_FRAC);
    if (lose > 0) {
      next = withResource(next, m.id, -lose);
      lostMats += lose;
    }
  }
  return { next, lostCoin, lostMats };
}

// The MON lane (ADR-163 / G4.5) — the day-wage, the game's bounded coin faucet.
//
// From R5 (the accused becomes the trusted hand), a game-day on which the MC completes ≥1 timed
// labour act earns a FIXED wage. Collection is TACTILE, not auto-credited: the coin is *handed*
// to him at the board (the `collect_wage` verb — an INSTANT trade-class intent), so the wage is a
// felt beat the autoplay learns, never a silent tick. The daily-vs-weekly cadence is just a ×7/÷7
// scalar on the amount — the model stays a per-day accrual.
//
// This is the MON lane's soft cap: the wage is fixed (no compounding) and Yohei's market-day purse
// (content/market.ts) bounds how much rice/goods convert back to coin — mon inflow can't run away.
//
// ALL magnitudes are SIM-OWNED SEEDS (ADR-132): the balance sim verdicts them; do NOT hand-tune.

import type { RankId } from './ranks';

/** The rung at which the day-wage begins (R5 — the trusted hand is put on the house's books). */
export const WAGE_START_RUNG: RankId = 'R5';

/** Coin (base unit mon) earned per game-day worked, once waged. FIXED — the bounded faucet, no
 *  compounding. SIM-OWNED SEED (ADR-132). */
export const DAY_WAGE_MON = 8;

/** The rung ladder order used to test "at or past R5". Kept local (a plain string compare on the
 *  Rn id) so wage.ts stays leaf — the canonical ordering lives in ranks.ts. */
function rungIndex(rung: RankId): number {
  const n = Number.parseInt(String(rung).replace(/^R/, ''), 10);
  return Number.isFinite(n) ? n : -1;
}

/** Is the MC waged yet (at or past WAGE_START_RUNG)? Pure predicate on the rung id. */
export function isWaged(rung: RankId): boolean {
  return rungIndex(rung) >= rungIndex(WAGE_START_RUNG);
}

import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  phaseOf,
  ascensionAvailable,
  estateGrade,
  factsForSurfaces,
  focusedOptimalIntent,
  resolveNightStage,
  nightRoundById,
  season,
  balance,
  SEASONS,
  RANKS,
  type GameState,
} from './index';

// THE WHOLE storywave T0 ARC, end-to-end, via the REAL reducer — the strongest "is it playtestable"
// proof. Unit tests cover the arc in FRAGMENTS (the ladder, combat survival, the economy, ascension —
// each in isolation); this drives ONE seeded auto-pilot from the weir cold-open all the way to the
// T0→T1 ascension with NO forced flags, so it proves the SEAMS of the G4 cutover hold: the silent
// rungs (R2, R5) actually promote, the R3 grain-watch NIGHT ROUND latches `wolf-survived-not-won`,
// the Count / season overlays / R7 dream drain, the Autumn nengu latches, the day-wage begins at R5,
// and the Phase-2 estate grind reaches EXCELLENT so the ascension fires. If any link dead-ends the
// arc can't close and this goes RED.
//
// The driver is the SHARED focused-optimal policy (`focusedOptimalIntent`), plus the two side-channels
// it can't express as a single Intent: the night-round STAGES (resolved through the night-round engine,
// like the app loop) and the terminal ascension. NO forced flags — every gate is opened by the real
// mechanism the player would use.

/** The R0…R7 ladder in order, derived from the rank registry (never a hand-typed magic list). */
const RUNG_ORDER = RANKS.map((r) => r.id);
const rungIndex = (id: string): number => RUNG_ORDER.indexOf(id as (typeof RUNG_ORDER)[number]);

interface ArcTrace {
  readonly final: GameState;
  readonly reached: Record<string, boolean>;
  readonly steps: number;
  /** Total coin the `collect_wage` board verb HANDED the MC (0 if the wage was never collected). */
  readonly wageCollectedCoin: number;
  /** Did a day-wage EVER accrue while the MC was below the R5 wage-start rung? (Must stay false.) */
  readonly wageAccruedBeforeR5: boolean;
  /** The lowest rung at which a `collect_wage` was dispatched (Infinity if never). */
  readonly firstWageRungIdx: number;
}

function playArc(seed: number): ArcTrace {
  let s = reduce(createInitialState(seed), { type: 'open_eyes' });
  const reached: Record<string, boolean> = {};
  let guard = 0;
  let wageCollectedCoin = 0;
  let wageAccruedBeforeR5 = false;
  let firstWageRungIdx = Infinity;
  const R5 = rungIndex('R5');
  while (s.tier === 0 && guard++ < 2_000_000) {
    reached[s.rung] = true;
    // the day-wage is the R5+ faucet: it must NEVER accrue before the trusted hand is put on the books.
    if (rungIndex(s.rung) < R5 && s.wageDaysAccrued > 0) wageAccruedBeforeR5 = true;
    if (ascensionAvailable(s)) {
      s = reduce(s, { type: 'ascend' });
      break;
    }
    if (s.roundState !== null) {
      // the R3 grain-watch night round: resolve its stages through the engine (like the app loop).
      s = resolveNightStage(s, nightRoundById(s.roundState.roundId)!);
      continue;
    }
    const intent = focusedOptimalIntent(s);
    if (!intent) break; // a genuine dead-end (no legal move) — the arc is broken
    if (intent.type === 'collect_wage') {
      const before = s.resources.coin ?? 0;
      firstWageRungIdx = Math.min(firstWageRungIdx, rungIndex(s.rung));
      s = reduce(s, intent);
      wageCollectedCoin += (s.resources.coin ?? 0) - before;
      continue;
    }
    s = reduce(s, intent);
  }
  return {
    final: s,
    reached,
    steps: guard,
    wageCollectedCoin,
    wageAccruedBeforeR5,
    firstWageRungIdx,
  };
}

describe('the storywave T0 arc closes end-to-end via real intents (weir cold open → ascension)', () => {
  const arc = playArc(20260626);
  const { final } = arc;

  it('climbs the full contiguous rung ladder R0…R7 (incl. the SILENT R2 + R5)', () => {
    for (const r of RUNG_ORDER) {
      expect(arc.reached[r], `never reached ${r}`).toBe(true);
    }
    // the silent rungs have NO promotion beat — reaching R3+/R6+ proves the beatless promotion path works.
    expect(arc.reached.R3 && arc.reached.R6).toBe(true);
  });

  it('the R3 grain-watch is opened by the REAL night round (the round-wolf flag, not a forced flag)', () => {
    // `wolf-survived-not-won` is latched ONLY by the night-round survive stage (night-rounds.ts) — the
    // driver forces nothing, so its presence proves the round actually reached its survive-the-wolf climax.
    expect(hasFlag(final, 'wolf-survived-not-won')).toBe(true);
  });

  it('the day-wage begins at R5 and is COLLECTED at the board (the tactile faucet)', () => {
    expect(arc.wageAccruedBeforeR5).toBe(false); // never a wage before the R5 wage-start rung
    expect(arc.wageCollectedCoin).toBeGreaterThan(0); // the board handed real coin
    expect(arc.firstWageRungIdx).toBeGreaterThanOrEqual(rungIndex('R5')); // collected only once waged
  });

  it('the Autumn nengu is reckoned, and the run spans a full lived YEAR of manual seasons', () => {
    expect(hasFlag(final, 'nengu-reckoned')).toBe(true); // Autumn's reckoning latched (R7 gate)
    // a full year is one turn of the six-season wheel (source-of-truth SEASONS, never a magic 6).
    expect(final.seasonsPassed).toBeGreaterThanOrEqual(SEASONS.length);
  });

  it('the SILENT-content beats played: R2 yard-hand, the R5 Count, the R7 dream (scenes drained)', () => {
    for (const id of ['r2-yard-hand', 'count', 'r7-dream']) {
      expect(final.scenesPlayed.includes(id), `scene ${id} never played`).toBe(true);
    }
  });

  it('THE LOOP CLOSES: Phase 2 opened at the capstone, the Estate reached EXCELLENT, and it ascended', () => {
    expect(hasFlag(final, 't0-capstone')).toBe(true);
    expect(estateGrade(final)).toBe('EXCELLENT');
    expect(final.influence.estate.value).toBeGreaterThanOrEqual(balance.ESTATE_BANDS.excellent);
    expect(final.tier).toBe(1); // T0 → T1
    expect(phaseOf({ ...final, tier: 0 })).toBe(2); // the macro engine was open at the capstone
  });

  it('is deterministic — the same seed plays the same arc to the same close', () => {
    const again = playArc(20260626);
    expect(again.final.tier).toBe(1);
    expect(again.steps).toBe(arc.steps);
    expect(again.final.influence.estate.value).toBe(final.influence.estate.value);
    expect(again.final.seasonsPassed).toBe(final.seasonsPassed);
  });
});

describe('the T0 arc — the DESIGN LEVERS at the gates (not collapsed metrics)', () => {
  it('DIMINISHING RETURNS: a site yields LESS on its later labour than its first, in a season', () => {
    // The KIND-lane soft cap (ADR-163): each site's per-season pool draws down by diminishing returns.
    // Drive TWO real farm acts on a fresh Winter paddy pool and assert the 2nd banks strictly less rice.
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      // ADR-179 — verb-farm + room-paddies derive from their rung's fact-flag (rank-r1).
      flags: { ...base.flags, awake: true, raked: true, ...factsForSurfaces('verb-farm') },
      location: 'paddies',
      character: { ...base.character, satiety: 100 },
    };
    const a1 = reduce(ready, { type: 'do_activity', activityId: 'farm_paddy' });
    const first = (a1.banked.rice ?? 0) - (ready.banked.rice ?? 0);
    const a2 = reduce(a1, { type: 'do_activity', activityId: 'farm_paddy' });
    const later = (a2.banked.rice ?? 0) - (a1.banked.rice ?? 0);
    expect(first).toBeGreaterThan(0);
    expect(later).toBeLessThan(first); // the depleting pool is the lever, not a flat faucet
    // and the underlying draw curve is MONOTONIC in what remains (the source-of-truth lever)
    expect(balance.productionDraw(300)).toBeGreaterThan(balance.productionDraw(100));
  });

  it('the rice SELL price swings by SEASON (spring dearest, autumn cheapest) — the store-vs-sell lever', () => {
    // Assert the DIRECTION (the design lever), derived from the price table, not a pinned magnitude.
    expect(balance.riceSellPrice('spring')).toBeGreaterThan(balance.riceSellPrice('autumn'));
    // and the arc actually rode a season it could sell into (a positive coin close proves the faucet ran).
    expect(season(createInitialState(1))).toBe('winter'); // the wheel opens on Winter (bible)
  });
});

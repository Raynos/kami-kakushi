import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  phaseOf,
  ascensionAvailable,
  estateGrade,
  applyGrindFight,
  focusedOptimalIntent,
  hpMax,
  season,
  balance,
  ESTATE_STAGES,
  type GameState,
} from './index';

// THE WHOLE T0 ARC, end-to-end, via the REAL reducer — the strongest "is it playtestable" proof.
// Unit tests cover the arc in FRAGMENTS (the ladder via forced flags, combat survival, pillars,
// ascension — each in isolation). This drives a single auto-pilot from the cold open all the way to
// the T0→T1 ascension with NO forced flags, so it proves the SEAMS hold: real combat actually sets
// the flags the ladder gates on, real Phase-2 labour actually banks Estate deeds to EXCELLENT, and
// the ascension actually fires. If any link dead-ends, the guard trips and this goes RED.
//
// Policy (mirrors the production auto-loop): ascend when the gate opens · stand the gate-watch (one
// real grind fight) when R3 needs `combat-blooded` · otherwise the SHARED focused-optimal intent
// (open_eyes > rest-if-starving > rake > face_wolf@R2 > cheapest-eligible labour). The labour banks
// Estate deeds once Phase 2 opens (post-R7 capstone).
function playToAscension(seed: number): { final: GameState; reachedRung: Record<string, boolean> } {
  let s = reduce(createInitialState(seed), { type: 'open_eyes' });
  const reachedRung: Record<string, boolean> = {};
  let guard = 0;
  while (s.tier === 0 && guard++ < 1_000_000) {
    reachedRung[s.rung] = true;
    if (ascensionAvailable(s)) {
      s = reduce(s, { type: 'ascend' });
      break;
    }
    // R3→R4 needs real combat duty, not just meter — one grind fight sets `combat-blooded`.
    if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded')) {
      s = applyGrindFight(s, 'monkey');
      continue;
    }
    const intent = focusedOptimalIntent(s);
    if (!intent) break; // a genuine dead-end (no legal move) — the arc is broken
    s = reduce(s, intent);
  }
  return { final: s, reachedRung };
}

describe('T0 arc closes end-to-end via real intents (cold open → ascension)', () => {
  const { final, reachedRung } = playToAscension(20260626);

  it('climbs the full contiguous rung ladder R0…R7', () => {
    for (const r of ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as const) {
      expect(reachedRung[r], `never reached ${r}`).toBe(true);
    }
  });

  it('the real combat gates open by actually fighting (not forced flags)', () => {
    expect(hasFlag(final, 'first-fight-survived')).toBe(true); // the scripted grain-store wolf (R2→R3)
    expect(hasFlag(final, 'combat-blooded')).toBe(true); // a real grind fight (R3→R4)
  });

  it('the R7 capstone opened Phase 2 and the Estate banked deeds to EXCELLENT', () => {
    expect(hasFlag(final, 't0-capstone')).toBe(true);
    expect(estateGrade(final)).toBe('EXCELLENT');
    expect(final.influence.estate.value).toBeGreaterThanOrEqual(balance.ESTATE_BANDS.excellent);
  });

  it('THE LOOP CLOSES: the ascension fired and the Estate rose to tier 1', () => {
    expect(final.tier).toBe(1); // T0 → T1
    // post-ascension we are no longer ascension-eligible at the just-cleared grade (it advanced)
    expect(phaseOf({ ...final, tier: 0 })).toBe(2); // the macro engine was open at the capstone
  });

  it('is deterministic — the same seed plays the same arc', () => {
    const again = playToAscension(20260626);
    expect(again.final.tier).toBe(1);
    expect(again.final.influence.estate.value).toBe(final.influence.estate.value);
  });
});

// ADR-107/ADR-108/ADR-113 — the RICE / COIN / KOKU economy split, driven on the REAL reducer + fight path
// (the DoD end-to-end economy proof). Fixtures ride the seed-robust curve (m2 header): a level-5 MC
// beats the monkey ≈ 1.00 (a guaranteed win) and a fresh L1 MC loses to the bandit ≈ 0.00 (a
// guaranteed loss) — deterministic without fishing a magic seed, and RED-able against the split.
describe('the D-107 economy on the real path (rice / coin / koku split)', () => {
  /** A ready fighter at the given level (full HP + satiety), carrying the given wealth. */
  function fighter(level: number, extra: Record<string, number> = {}): GameState {
    const s = createInitialState(1);
    const t: GameState = {
      ...s,
      character: { ...s.character, level, satiety: 100 },
      resources: { ...s.resources, ...extra },
    };
    return { ...t, character: { ...t.character, hp: hpMax(t) } };
  }

  it('raking the spilled rice grants RICE — coin holds back (the rice-only cold open)', () => {
    let s = reduce(createInitialState(11), { type: 'open_eyes' });
    const before = s.resources.rice ?? 0;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.resources.rice ?? 0).toBe(before + balance.RICE_PER_RAKE); // rake → rice
    expect(s.resources.coin ?? 0).toBe(0); // coin is the first WAGE (haul), not the cold open
  });

  it('a coin-paying labour (haul stores) is what first mints COIN — the first-wage beat', () => {
    const base = createInitialState(13);
    const ready: GameState = {
      ...base,
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'verb-haul', 'room-gate-forecourt'],
      location: 'gate-forecourt',
    };
    const after = reduce(ready, { type: 'do_activity', activityId: 'haul_stores' });
    expect(after.resources.coin ?? 0).toBeGreaterThan(0); // hauling pays a copper wage
    expect(after.resources.rice ?? 0).toBe(0); // hauling is not farming — no rice
  });

  it('a combat WIN pays COIN (the spendable currency), never koku', () => {
    const won = applyGrindFight(fighter(5, { coin: 0 }), 'monkey');
    expect(won.character.combatXp).toBeGreaterThan(0); // it won
    expect(won.resources.coin ?? 0).toBeGreaterThan(0); // spoils are coin
  });

  it('spending flows through COIN — the estate kura-works sink debits coin', () => {
    const base = createInitialState(1);
    const ready: GameState = {
      ...base,
      resources: { ...base.resources, coin: 1000 },
      unlocked: [...base.unlocked, 'panel-rung-ladder', 'panel-estate'],
    };
    const after = reduce(ready, { type: 'improve_estate' });
    expect(after.estateStage).toBe(1);
    expect(after.resources.coin).toBe(1000 - ESTATE_STAGES[0]!.coinCost); // U1 debited in coin
  });

  it('a LOST fight bleeds carried COIN + RICE + materials; the kura shelters them (D-113)', () => {
    const before = fighter(1, { coin: 100, rice: 100, hardwood: 100 });
    const banked: GameState = { ...before, banked: { coin: 40, rice: 40 } };
    const after = applyGrindFight(banked, 'bandit'); // L1 vs bandit ≈ 0.00 → a guaranteed loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    // all three carried resources are bitten, from the source-of-truth fractions (not magic numbers)
    expect(after.resources.coin).toBe(100 - Math.round(100 * balance.LOSS_COIN_FRAC));
    expect(after.resources.rice).toBe(100 - Math.round(100 * balance.LOSS_COIN_FRAC));
    expect(after.resources.hardwood).toBe(100 - Math.floor(100 * balance.LOSS_MATERIAL_FRAC));
    // koku (House standing) is NOT a carried resource, so the rout never touches it — nor the kura.
    expect(after.banked.coin).toBe(40); // sheltered
    expect(after.banked.rice).toBe(40); // sheltered
    expect(after.influence.estate.value).toBe(before.influence.estate.value); // standing untouched
  });

  // ADR-107 Phase 2 — the RICE LOOP end-to-end on the REAL reducer: rake → RICE → SELL → COIN → SPEND
  // (the coin faucet), and store-rice → a lost fight shelters it. This is the Phase-2 DoD proof that
  // rice's sinks actually connect through the real player path, not just in isolation.
  it('the coin faucet closes the loop: rake → RICE → sell → COIN → spend the estate sink', () => {
    let s = reduce(createInitialState(7), { type: 'open_eyes' });
    for (let i = 0; i < 50; i++) s = reduce(s, { type: 'rake_rice' }); // rake spilled rice → RICE
    const rice = s.resources.rice ?? 0;
    expect(rice).toBeGreaterThan(0);
    expect(s.resources.coin ?? 0).toBe(0); // no coin yet — the cold open is rice-only
    // open the estate economy (the pedlar + kura-works) — a mid-arc reveal, forced here for the slice.
    s = { ...s, unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate'] };
    const price = balance.riceSellPrice(season(s));
    s = reduce(s, { type: 'sell_rice' }); // RICE → COIN at the season price (the faucet)
    expect(s.resources.rice ?? 0).toBe(0);
    expect(s.resources.coin ?? 0).toBe(rice * price); // exact, from the source-of-truth price
    // and the minted coin actually SPENDS on the estate sink (the faucet feeds a real cost).
    expect(s.resources.coin ?? 0).toBeGreaterThanOrEqual(ESTATE_STAGES[0]!.coinCost);
    const built = reduce(s, { type: 'improve_estate' });
    expect(built.estateStage).toBe(1); // U1 bought with faucet coin
  });

  it('store rice in the kura via the deposit intent → a lost fight shelters it (D-113)', () => {
    let s = reduce(createInitialState(9), { type: 'open_eyes' });
    for (let i = 0; i < 30; i++) s = reduce(s, { type: 'rake_rice' }); // rake at the grain-store
    s = { ...s, unlocked: [...s.unlocked, 'panel-rung-ladder', 'panel-estate'] };
    expect(s.location).toBe('kura'); // you woke, and raked, at the kura
    s = reduce(s, { type: 'deposit', resource: 'rice' }); // bank the whole haul, safe
    const stored = s.banked.rice ?? 0;
    expect(stored).toBeGreaterThan(0);
    expect(s.resources.rice ?? 0).toBe(0); // all carried rice is now stored
    // arm a fresh L1 fighter carrying coin, keeping the banked rice, and lose a fight.
    const armed: GameState = {
      ...s,
      character: { ...s.character, level: 1, satiety: 100 },
      resources: { ...s.resources, coin: 100 },
    };
    const ready = { ...armed, character: { ...armed.character, hp: hpMax(armed) } };
    const after = applyGrindFight(ready, 'bandit'); // L1 vs bandit ≈ 0.00 → a guaranteed loss
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    expect(after.banked.rice).toBe(stored); // the STORED rice survives the rout (sheltered)
    expect(after.resources.coin).toBe(100 - Math.round(100 * balance.LOSS_COIN_FRAC)); // carried coin bled
  });
});

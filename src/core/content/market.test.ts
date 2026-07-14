import { describe, it, expect } from 'vitest';
import {
  MARKET_ITEMS,
  MARKET_ITEM_IDS,
  getItem,
  canBuy,
  MARKET_COIN_SINK_NOTE,
} from './market';

// The capped coin-sink market (T0-M4-F3 / ADR-008: trade ≤ ⅓, a MINORITY lane). The
// contract under test is the canBuy gate (coin AND the per-run stockCap), that the
// roster is a tiny taste of REAL T0 goods, and that costs/caps stay small enough to
// keep it from ever becoming a primary engine.

// The only resources a T0 good may grant (coin is income — a sink must never refund it).
const T0_RESOURCES = new Set(['wood', 'sansai']);

describe('canBuy — the coin + per-run-cap gate (the minority-lane clamp)', () => {
  it('is false when short of coin, even with stock left', () => {
    const item = getItem('whetstone_kit'); // 28 coin, cap 3
    expect(canBuy({ coin: item.coinCost - 1 }, item, 0)).toBe(false);
    expect(canBuy({}, item, 0)).toBe(false); // no coin field at all → treated as 0
  });

  it('is false at or over the stockCap, however much coin you hoard', () => {
    const item = getItem('whetstone_kit'); // cap 3
    expect(canBuy({ coin: 100_000 }, item, item.stockCap)).toBe(false); // exactly at cap
    expect(canBuy({ coin: 100_000 }, item, item.stockCap + 5)).toBe(false); // over cap
  });

  it('is true when affordable AND still under the cap (boundaries included)', () => {
    const item = getItem('whetstone_kit'); // 28 coin, cap 3
    expect(canBuy({ coin: item.coinCost }, item, 0)).toBe(true); // exact coin, fresh
    expect(canBuy({ coin: item.coinCost }, item, item.stockCap - 1)).toBe(true); // last buy
    expect(canBuy({ coin: 100_000 }, item, 1)).toBe(true); // plenty coin, mid-stock
  });

  it('holds the coin-and-cap conjunction across every item in the roster', () => {
    for (const item of MARKET_ITEMS) {
      // affordable but capped out → false
      expect(canBuy({ coin: 100_000 }, item, item.stockCap)).toBe(false);
      // under cap but one coin short → false
      expect(canBuy({ coin: item.coinCost - 1 }, item, 0)).toBe(false);
      // both conditions met → true
      expect(canBuy({ coin: item.coinCost }, item, item.stockCap - 1)).toBe(
        true,
      );
    }
  });
});

describe('MARKET_ITEMS — a tiny roster of real T0 goods', () => {
  it('is a small taste roster (≤6) with unique ids', () => {
    expect(MARKET_ITEMS.length).toBeGreaterThanOrEqual(3);
    // v0.3.1 Step 4 market-depth add → 6; still a MINORITY lane by SPEND (≤⅓ of the estate
    // sink — asserted in economy.test), which is the real ADR-008 invariant, not the item count.
    expect(MARKET_ITEMS.length).toBeLessThanOrEqual(6);
    expect(MARKET_ITEM_IDS.size).toBe(MARKET_ITEMS.length); // ids are unique
  });

  it('every item grants real, positive T0 resources (and never refunds coin)', () => {
    for (const item of MARKET_ITEMS) {
      const entries = Object.entries(item.grants);
      expect(entries.length).toBeGreaterThan(0); // a good must actually grant something
      for (const [resource, amount] of entries) {
        expect(T0_RESOURCES.has(resource)).toBe(true); // wood / sansai only
        expect(resource).not.toBe('coin'); // a coin sink must not hand coin back
        expect(amount).toBeGreaterThan(0); // real, positive goods
        expect(Number.isInteger(amount)).toBe(true); // integer quantities
      }
    }
  });

  it('costs are positive and ascending-ish; caps are small and positive', () => {
    let prevCost = 0;
    for (const item of MARKET_ITEMS) {
      expect(item.coinCost).toBeGreaterThan(0); // a price, not a giveaway
      expect(Number.isInteger(item.coinCost)).toBe(true); // integer coin (no floats)
      expect(item.coinCost).toBeGreaterThanOrEqual(prevCost); // ascending-ish
      prevCost = item.coinCost;

      expect(item.stockCap).toBeGreaterThan(0); // you can buy at least one
      expect(item.stockCap).toBeLessThanOrEqual(5); // small per-run cap → minority lane
    }
  });
});

describe('getItem — id resolution', () => {
  it('resolves a known id to its item', () => {
    const item = getItem('greens_sack');
    expect(item.id).toBe('greens_sack');
    expect(MARKET_ITEM_IDS.has(item.id)).toBe(true);
  });

  it('throws on an unknown id', () => {
    expect(() => getItem('no_such_item')).toThrow();
  });
});

describe('MARKET_COIN_SINK_NOTE — documents the ≤⅓ minority-lane intent', () => {
  it('is a non-empty note naming the minority-lane intent', () => {
    expect(typeof MARKET_COIN_SINK_NOTE).toBe('string');
    expect(MARKET_COIN_SINK_NOTE.length).toBeGreaterThan(0);
    expect(MARKET_COIN_SINK_NOTE).toMatch(/minority/i);
    expect(MARKET_COIN_SINK_NOTE).toMatch(/D-008/);
  });
});

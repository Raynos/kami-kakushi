// A tiny CAPPED koku-sink market — the TRADE taste (T0-M4-F3 / D-008: trade ≤ ⅓ of
// Estate & Wealth, a deliberate MINORITY lane). NOT an engine: a handful of modest T0
// goods bought with koku, each with a small per-run stockCap so buying can never
// become a primary income/output loop. The real village market (broker standing, the
// silk meibutsu) arrives at T2. Pure data + pure predicates; costs are integer koku
// (no floats). All numbers are provisional (v0.2) — tune by playtest.

export type MarketItemId = string;

export interface MarketItem {
  readonly id: MarketItemId;
  readonly label: string;
  readonly blurb: string;
  /** Integer koku price — the sink. */
  readonly kokuCost: number;
  /** Resources granted on a buy (e.g. { sansai: 3 } or { wood: 5 }) — real T0 goods. */
  readonly grants: Readonly<Record<string, number>>;
  /** Hard per-run buy cap — the clamp that keeps TRADE a minority lane (D-008). */
  readonly stockCap: number;
}

export const MARKET_ITEMS: readonly MarketItem[] = [
  {
    id: 'greens_sack',
    label: 'Sack of mountain greens',
    blurb:
      "A travelling forager's sack of sansai — fern-shoots and butterbur, enough for a few hot meals when the satoyama is bare.",
    kokuCost: 10,
    grants: { sansai: 3 },
    stockCap: 5,
  },
  {
    id: 'wood_bundle',
    label: 'Bundle of split kindling',
    blurb:
      "Dry, split wood off a charcoaler's cart — good for a quick mend or to feed the cookfire on a wet day.",
    kokuCost: 16,
    grants: { wood: 4 },
    stockCap: 4,
  },
  {
    id: 'whetstone_kit',
    label: 'Hone and ash-faggot',
    blurb:
      'A river-stone whetstone and a faggot of seasoned ash — what a porter needs to keep his carrying-pole sound.',
    kokuCost: 28,
    grants: { wood: 7 },
    stockCap: 3,
  },
  {
    id: 'greens_basket',
    label: "Pedlar's greens-basket",
    blurb:
      'A heaped basket from the valley pedlar — a proper store of sansai laid by against a lean week.',
    kokuCost: 40,
    grants: { sansai: 9 },
    stockCap: 2,
  },
];

export const MARKET_ITEM_IDS: ReadonlySet<string> = new Set(MARKET_ITEMS.map((m) => m.id));

export function getItem(id: MarketItemId): MarketItem {
  const it = MARKET_ITEMS.find((x) => x.id === id);
  if (!it) throw new Error(`unknown market item: ${id}`);
  return it;
}

/**
 * Pure affordability/availability check: you have the koku AND you are still under
 * this item's per-run stockCap. `boughtCount` is how many of this item have already
 * been bought this run (the caller tracks it). The cap is the minority-lane clamp —
 * it is impossible to buy past it however much koku you hoard.
 */
export function canBuy(
  resources: Readonly<Record<string, number>>,
  item: MarketItem,
  boughtCount: number,
): boolean {
  const koku = resources.koku ?? 0;
  return koku >= item.kokuCost && boughtCount < item.stockCap;
}

/**
 * The standing intent of this surface, for docs/UI/reviewers: the market is a small
 * CAPPED koku sink (the TRADE taste, T0-M4-F3), held to a MINORITY lane by D-008
 * (trade ≤ ⅓ of Estate & Wealth). Every good carries a tiny per-run stockCap so
 * buying can never become a primary income or output engine — that is deliberate.
 * The real village market (coin, broker standing, the silk meibutsu) is T2, not here.
 */
export const MARKET_KOKU_SINK_NOTE =
  'TRADE taste only (T0-M4-F3 / D-008): a small CAPPED koku sink, a deliberate MINORITY ' +
  'lane (≤ ⅓ of Estate & Wealth). Every item has a tiny per-run stockCap so buying can ' +
  'never become a primary income/output engine — the real village market arrives at T2.';

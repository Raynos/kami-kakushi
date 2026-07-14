// A tiny CAPPED provisioning shop — a PERSONAL COIN SINK (ADR-099/ADR-107): the player spends HIS OWN
// coin on goods for HIS OWN character/needs (greens for the pot, wood to keep an edge), NOT the
// estate trading for profit. This is the player finance lane, distinct from the ESTATE lane — the
// estate's own coin sink is the kura-works ladder (estate.ts). A deliberate MINORITY lane (total
// spend ≤ ⅓ of the kura-works sink, §4.6.6d), each item small-stockCap-capped so buying can never
// become a primary income/output loop. The estate-scale TRADE ENGINE (trade on the estate's behalf,
// broker standing, the silk meibutsu) arrives at T2 (ADR-066/ADR-099). Pure data + pure predicates;
// costs are integer coin (base unit mon, no floats). All numbers are provisional (v0.2) — tune by
// playtest.

import type { DayOfWeek, Season } from '../constants';
import { DAY_OF_WEEK_NAMES, dayOfWeek } from '../constants';

export type MarketItemId = string;

export interface MarketItem {
  readonly id: MarketItemId;
  readonly label: string;
  readonly blurb: string;
  /** Integer coin price (base unit mon) — the sink (ADR-107). */
  readonly coinCost: number;
  /** Resources granted on a buy (e.g. { sansai: 3 } or { wood: 5 }) — real T0 goods. */
  readonly grants: Readonly<Record<string, number>>;
  /** Hard per-run buy cap — the clamp that keeps TRADE a minority lane (ADR-008). */
  readonly stockCap: number;
  /** Seasons this item is STOCKED (ADR-163 / G4.5 — the stall re-keys per season; one straw coat
   *  this winter). OMITTED = stocked every season (the staple goods). SIM-OWNED SEED (ADR-132). */
  readonly seasons?: readonly Season[];
}

export const MARKET_ITEMS: readonly MarketItem[] = [
  {
    id: 'greens_sack',
    label: 'Sack of mountain greens',
    blurb:
      "A travelling forager's sack of sansai — fern-shoots and butterbur, enough for a few hot meals when the woodlot is bare.",
    coinCost: 10,
    grants: { sansai: 3 },
    stockCap: 5,
  },
  {
    id: 'wood_bundle',
    label: 'Bundle of split kindling',
    blurb:
      "Dry, split wood off a charcoaler's cart — good for a quick mend or to feed the cookfire on a wet day.",
    coinCost: 16,
    grants: { wood: 4 },
    stockCap: 4,
  },
  {
    id: 'whetstone_kit',
    label: 'Hone and ash-faggot',
    blurb:
      'A river-stone whetstone and a faggot of seasoned ash — what a porter needs to keep his carrying-pole sound.',
    coinCost: 28,
    grants: { wood: 7 },
    stockCap: 3,
  },
  {
    id: 'greens_basket',
    label: "Pedlar's greens-basket",
    blurb:
      'A heaped basket from the valley pedlar — a proper store of sansai laid by against a lean week.',
    coinCost: 40,
    grants: { sansai: 9 },
    stockCap: 2,
  },
  // v0.3.1 Step 4 — market DEPTH (a deeper coin sink; ADR-086 scarcity / batch-1 call 4), still held
  // inside the ADR-008 MINORITY-lane cap (≤ ⅓ of Estate & Wealth) by tight per-run stockCaps.
  {
    id: 'road_rations',
    label: "Porter's road-rations",
    blurb:
      'A pedlar bundles greens, dried fish, and kindling for the road — a working man revictualling before a long haul.',
    coinCost: 55,
    grants: { sansai: 8, wood: 5 },
    stockCap: 2,
  },
  {
    id: 'smith_billet',
    label: "Smith's seasoned billet",
    blurb:
      'A dear length of close-grained, kiln-dry timber off the smith’s own rack — the good wood, for a blade you mean to keep.',
    coinCost: 70,
    grants: { wood: 12 },
    stockCap: 2,
  },
];

export const MARKET_ITEM_IDS: ReadonlySet<string> = new Set(MARKET_ITEMS.map((m) => m.id));

/** The cheapest thing the stall stocks — DERIVED from the roster (never a copied number). It is the
 *  threshold of "coin you have nowhere to spend": the gate's reveal VN (reveals.ts `sb-market`)
 *  fires once the purse first covers it, which is the moment a stall starts to mean something. */
export const CHEAPEST_STALL_ITEM_COST: number = Math.min(...MARKET_ITEMS.map((m) => m.coinCost));

// ── Yohei's stall (ADR-163 / G4.5) — the MON lane's market side ─────────────────────────────────
// The pedlar Yohei sets up on named MARKET DAYS only (scarcity that pulls the wheel), carries a
// FINITE purse per visit (he stops BUYING when it's empty — the kind-overflow soft cap, so selling
// rice into coin can't run away), and BUYS only a whitelist: rice + named finished goods, never raw
// materials (wood/sansai stay carried, unsellable in T0 — overflow feeds the house stores). ALL
// magnitudes SIM-OWNED SEEDS (ADR-132).

/** The weekdays Yohei's stall is open (0..6). Two market days a week — the rest of the week the
 *  stall is bare, so selling is a TIMING beat. SIM-OWNED SEED (ADR-132). */
export const YOHEI_MARKET_DAYS: readonly DayOfWeek[] = [2, 5];

/** Yohei's SEED/RESTOCK purse (base unit mon) — since ADR-194 this is the level his permanent
 *  purse drifts back TOWARD on market days (merchantRestock), not a per-visit draw. Once his
 *  purse is spent buying your rice/goods he stops buying until restock catches up — the
 *  finite-purse soft cap on mon inflow, now emergent from state. SIM-OWNED SEED (120 → 160 in
 *  the ADR-194 landing balance pass: the bounded lane must still carry the D-133 Phase-2 pace). */
export const YOHEI_PURSE_MON = 160;

/** What Yohei will BUY (his `buys:` whitelist) — rice + named finished goods only. Raw materials
 *  (wood, sansai) are NOT here: unsellable in T0 (overflow feeds house stores, not coin). */
export const YOHEI_BUYS: ReadonlySet<string> = new Set(['rice']);

/** Is Yohei's stall open on this absolute day? (market-day clamp for sell/buy.) */
export function isMarketDay(day: number): boolean {
  return YOHEI_MARKET_DAYS.includes(dayOfWeek(day));
}

// ── Merchant PERMANENT STATE (ADR-194, extends ADR-163 §5) — a merchant is a real counterparty:
// a purse (mon) and a stock (what he's bought off you), BOTH persisted and MUTATED by every trade.
// The per-visit cap now EMERGES from state (his purse runs dry) instead of a per-transaction clamp;
// YOHEI_PURSE_MON above is his SEED/RESTOCK purse, not a ceiling per call. Only Yohei is seeded in
// T0; the shape is generic so T1+ merchants inherit it. All magnitudes SIM-OWNED SEEDS (ADR-132).

export type MerchantId = string;

export interface MerchantState {
  /** His coin on hand (base unit mon). Debited when he BUYS your rice; credited when you buy
   *  his goods. When it can't cover the next shō he stops buying until restock. */
  readonly mon: number;
  /** What he's holding of each resource he's bought — the pile that SAGS his offer (ADR-194:
   *  the Nth measure of rice pays less than the first). Sold down toward 0 on market days. */
  readonly stock: Readonly<Partial<Record<string, number>>>;
}

/** The seeded merchant roster — a fresh run's counterparties. */
export function initialMerchants(): Record<MerchantId, MerchantState> {
  return { yohei: { mon: YOHEI_PURSE_MON, stock: {} } };
}

/** Every SAG_STEP shō of a good the merchant already holds knocks 1 mon off the next shō's
 *  offer — the RuneScape-general-store curve, integer + deterministic. The price CAN reach 0
 *  (human, 2026-07-14): stuffed full, he stops buying that good until his stock drains.
 *  SIM-OWNED SEED (ADR-132). */
export const MERCHANT_SAG_STEP_SHO = 24;

/** The marginal price the merchant pays for the NEXT unit of `resource`, given his current
 *  stock of it — a decreasing step curve off the season base price, floor 0 (he refuses).
 *  ONE fn for the executed trade AND the displayed offer (AC-6): the shown price sags live. */
export function merchantOffer(
  merchant: MerchantState,
  resource: string,
  basePrice: number,
): number {
  const held = merchant.stock[resource] ?? 0;
  return Math.max(0, basePrice - Math.floor(held / MERCHANT_SAG_STEP_SHO));
}

/** Restock DRIFT rate — each market day the merchant recovers 3/4 of the gap: purse back up
 *  toward YOHEI_PURSE_MON, stock sold down toward 0. NEVER a full reset (human, 2026-07-14):
 *  Tuesday's rice-dump still depresses Friday's price. SIM-OWNED SEEDS (ADR-132; 1/2 → 3/4
 *  in the landing balance pass — the D-133 Phase-2:Phase-1 ratio gate sat at 1.31 on 1/2). */
export const MERCHANT_RESTOCK_NUM = 3;
export const MERCHANT_RESTOCK_DEN = 4;

/** One market-day arrival: drift the merchant partway back toward his seed shape. Purse only
 *  ever tops UP (coin the player spent at his stall is his to keep); stock only drains.
 *  Integer + deterministic (fold-invariant with the clock, B10); converges in finite days
 *  (ceil on the purse gap, floor-halving on stock). */
export function merchantRestock(merchant: MerchantState, seedMon: number): MerchantState {
  const gap = seedMon - merchant.mon;
  const mon =
    gap > 0
      ? merchant.mon + Math.ceil((gap * MERCHANT_RESTOCK_NUM) / MERCHANT_RESTOCK_DEN)
      : merchant.mon;
  const stock: Record<string, number> = {};
  for (const [r, held] of Object.entries(merchant.stock)) {
    const kept =
      held === undefined
        ? 0
        : held - Math.ceil((held * MERCHANT_RESTOCK_NUM) / MERCHANT_RESTOCK_DEN);
    if (kept > 0) stock[r] = kept;
  }
  return { mon, stock };
}

/** The market days as their kanji day-names ("水・土") — derived from YOHEI_MARKET_DAYS +
 *  the day-name canon (AC-21: never hand-typed where a schedule hint is shown). */
export function marketDaysKanji(): string {
  return YOHEI_MARKET_DAYS.map((d) => DAY_OF_WEEK_NAMES[d]!.kanji).join('・');
}

/** Is this market item STOCKED this season? (absent `seasons` ⇒ every season.) */
export function itemInSeason(item: MarketItem, season: Season): boolean {
  return item.seasons === undefined || item.seasons.includes(season);
}

/** Does Yohei buy this resource? (his whitelist — rice + named goods; raw materials refused.) */
export function yoheiBuys(resource: string): boolean {
  return YOHEI_BUYS.has(resource);
}

export function getItem(id: MarketItemId): MarketItem {
  const it = MARKET_ITEMS.find((x) => x.id === id);
  if (!it) throw new Error(`unknown market item: ${id}`);
  return it;
}

/**
 * Pure affordability/availability check: you have the coin AND you are still under
 * this item's per-run stockCap. `boughtCount` is how many of this item have already
 * been bought this run (the caller tracks it). The cap is the minority-lane clamp —
 * it is impossible to buy past it however much coin you hoard.
 */
export function canBuy(
  resources: Readonly<Record<string, number>>,
  item: MarketItem,
  boughtCount: number,
): boolean {
  const coin = resources.coin ?? 0;
  return coin >= item.coinCost && boughtCount < item.stockCap;
}

/**
 * The standing intent of this surface, for docs/UI/reviewers: the market is a small
 * CAPPED coin sink (the TRADE taste, T0-M4-F3), held to a MINORITY lane by ADR-008
 * (trade ≤ ⅓ of Estate & Wealth). Every good carries a tiny per-run stockCap so
 * buying can never become a primary income or output engine — that is deliberate.
 * The real village market (broker standing, the silk meibutsu) is T2, not here.
 */
export const MARKET_COIN_SINK_NOTE =
  'TRADE taste only (T0-M4-F3 / D-008): a small CAPPED coin sink, a deliberate MINORITY ' +
  'lane (≤ ⅓ of Estate & Wealth). Every item has a tiny per-run stockCap so buying can ' +
  'never become a primary income/output engine — the real village market arrives at T2.';

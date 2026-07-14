// The MARKET surface (split out of render.ts, 2026-07-13 render-split): the pedlar's
// talk-to-reveal shop — buy rows + the ADR-107 sell-rice faucet. The default (A)
// presentation ships from here; the diverged B/C alternates stay DEV-only in
// ui/dev/variant-renderers.ts behind the same `dev.renderVariant` seam.
import {
  balance,
  canBuy,
  formatCoin,
  season,
  peopleHere,
  riceSellQuote,
  FLAVOR,
  MARKET_ITEMS,
  type GameState,
  type Intent,
} from '../../core';
import { el, SEASON_TAG, MARKET_BLURB } from '../render';
import { reconcileList, setText, setDisabled, toggle } from '../reconcile';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createMarketView(ctx: {
  pane: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  /** The shared shell state the market row gates on (owned by mount, read-only here). */
  activeTab(): string;
  openPersonId(): string | null;
}): { renderMarket(state: GameState): void } {
  const { pane: marketPane, dispatch, dev } = ctx;

  // marketRefs — the buy rows + (ADR-107 Phase 2) the sell-rice faucet (season price + sell button).
  let marketRefs: {
    card: HTMLElement;
    rows: HTMLElement;
    sellPrice: HTMLElement;
    sellPurse: HTMLElement;
    sellBtn: HTMLButtonElement;
  } | null = null;

  function marketGrantStr(item: (typeof MARKET_ITEMS)[number]): string {
    return Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');
  }
  // build ONE pedlar row skeleton (FB-67/FB-72 vertical stack: item copy, then the buy cell). The
  // price label + click listener are stable; patchMarketRow fills the mutable state.
  function buildMarketRow(item: (typeof MARKET_ITEMS)[number]): HTMLElement {
    const row = el('div', 'market-row');
    const left = el('div', 'market-item');
    left.append(el('span', 'market-name', item.label));
    left.append(el('span', 'market-grant lock-hint'));
    // the WHEN/WHY blurb (authored in market.ts) — so trade isn't a bare price list.
    left.append(el('span', 'skill-blurb market-blurb', item.blurb));
    row.append(left);
    // FB-67/FB-72 — the buy control sits in its OWN in-flow cell BELOW the item copy (the row is a
    // vertical stack, styles.css), so a narrow byōbu column can't let the price float over the copy.
    const buy = el('div', 'market-buy');
    const btn = el('button', 'auto-toggle', formatCoin(item.coinCost));
    btn.type = 'button';
    btn.addEventListener('click', () => dispatch({ type: 'buy_item', itemId: item.id }));
    buy.append(btn);
    row.append(buy);
    return row;
  }
  function patchMarketRow(
    row: HTMLElement,
    item: (typeof MARKET_ITEMS)[number],
    state: GameState,
  ): void {
    const bought = state.marketBought[item.id] ?? 0;
    const capped = bought >= item.stockCap;
    const grantStr = marketGrantStr(item);
    setText(row.querySelector('.market-grant')!, `${grantStr}${capped ? ' · sold out' : ''}`);
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    // a11y: the visible label is just the price — a full accessible name so a screen-reader hears
    // WHAT it buys, not a bare "10 mon" (ADR-045 a11y-ink).
    const aria = `Buy ${item.label} (${grantStr}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`;
    if (btn.getAttribute('aria-label') !== aria) btn.setAttribute('aria-label', aria);
    setDisabled(btn, !canBuy(state.resources, item, bought));
    const title = capped
      ? "You've taken all the pedlar carries this run."
      : btn.disabled && (state.banked.coin ?? 0) >= item.coinCost
        ? 'Draw coin from the kura storehouse first'
        : '';
    if (btn.title !== title) btn.title = title;
  }
  // ── the SELL-RICE faucet (ADR-107 Phase 2 / §14): rice → coin at the SEASON-swinging price. The
  //    pedlar buys your rice — DEAR in the lean spring, CHEAP at the autumn glut — so store-or-sell
  //    is a light timing call. Built ONCE; the price line + sell button patch in place (zero churn). ──
  function buildSellRice(): {
    sell: HTMLElement;
    sellPrice: HTMLElement;
    sellPurse: HTMLElement;
    sellBtn: HTMLButtonElement;
  } {
    const sell = el('div', 'market-sell');
    sell.append(el('div', 'rung-now', 'Sell your rice 米'));
    const sellPrice = el('div', 'skill-blurb');
    // ADR-194 (TST4, human 2026-07-14): Yohei's remaining purse is an EXPLICIT number — the
    // player never guesses whether he can pay.
    const sellPurse = el('div', 'skill-blurb market-purse');
    const buy = el('div', 'market-buy');
    const sellBtn = el('button', 'auto-toggle');
    sellBtn.type = 'button';
    sellBtn.addEventListener('click', () => dispatch({ type: 'sell_rice' }));
    buy.append(sellBtn);
    sell.append(sellPrice, sellPurse, buy);
    return { sell, sellPrice, sellPurse, sellBtn };
  }
  // ADR-194 stall voice (bundle yohei-stall, FB-5 canon in narrative/flavor.md): the FLAVOR
  // read goes through dev.subFlavor so the DEV Story switcher live-swaps the takes (ADR-143).
  function stallLine(key: keyof typeof FLAVOR): string {
    const canon = FLAVOR[key];
    return __DEV_TOOLS__ && dev ? dev.subFlavor(key, canon) : canon;
  }
  function patchSellRice(
    sellPrice: HTMLElement,
    sellPurse: HTMLElement,
    sellBtn: HTMLButtonElement,
    state: GameState,
  ): void {
    const s = season(state);
    // ADR-194 / AC-6 — ONE quote fn (riceSellQuote) behind the display AND the dispatched trade:
    // the shown per-measure price is the CURVE's marginal price (it sags live as he fills up on
    // rice), and the button's total is exactly what the reducer would pay.
    const quote = riceSellQuote(state);
    const base = balance.riceSellPrice(s);
    const prices = Object.values(balance.RICE_SELL_PRICE_BY_SEASON);
    const gloss = stallLine(
      quote.unitNow < base
        ? 'stallGlossSagged'
        : base >= Math.max(...prices)
          ? 'stallGlossDear'
          : base <= Math.min(...prices)
            ? 'stallGlossGlut'
            : 'stallGlossFair',
    );
    setText(
      sellPrice,
      quote.unitNow <= 0
        ? stallLine('stallRefusal')
        : `The pedlar pays ${formatCoin(quote.unitNow)} the measure now — ${SEASON_TAG[s].name}, ${gloss}.`,
    );
    setText(sellPurse, `Yohei's purse: ${formatCoin(quote.merchantMon)}.`);
    const rice = state.banked.rice ?? 0;
    setText(sellBtn, `Sell kura rice (${quote.sho} shō → ${formatCoin(quote.coin)})`);
    // a11y: a full accessible name so a screen-reader hears WHAT the sell does + the live price.
    const aria = `Sell ${quote.sho} shō of kura rice for ${formatCoin(quote.coin)} at the sagging ${SEASON_TAG[s].name} price, ${formatCoin(quote.unitNow)} the next measure. Yohei's purse holds ${formatCoin(quote.merchantMon)}`;
    if (sellBtn.getAttribute('aria-label') !== aria) sellBtn.setAttribute('aria-label', aria);
    setDisabled(sellBtn, quote.sho <= 0);
    const title =
      rice <= 0
        ? 'No kura rice to sell — rake or farm to gather it.'
        : quote.unitNow <= 0
          ? stallLine('stallRefusal')
          : quote.sho <= 0
            ? stallLine('stallPurseEmpty')
            : '';
    if (sellBtn.title !== title) sellBtn.title = title;
  }
  function renderMarket(state: GameState): void {
    // IA reorg (ADR-112 §2 / FB-109 / ADR-114 / FB-332) — the pedlar (Yohei) is a TALKABLE PERSON on
    // the Zone tab's "who's here" list, not an inline menu. His wares (a `tiny` trader's shop) open ONLY while
    // he is the OPEN person: talk-to-reveal. Gate on `openPersonId === 'pedlar'` AND that he is
    // actually present (peopleHere) — so his shop is never dumped inline (on Work OR on Map).
    const pedlarPresent = peopleHere(state).some((p) => p.id === 'yohei');
    // FB-332 — talk-to-reveal follows the who's-here rows to the Zone tab.
    const show = ctx.activeTab() === 'work' && ctx.openPersonId() === 'yohei' && pedlarPresent;
    toggle(marketPane, show);
    if (!show) return;
    // ── the diverged goods presentation (ADR-075) — A = the price-button list (default, ships).
    //    B/C live DEV-only behind the variant toggle (ui/dev.ts). This DEV branch folds to dead code
    //    in a STRIP build (`__DEV_TOOLS__` → false, tree-shaken) and `dev` is undefined there AND
    //    tests, so ONLY a live DEV session takes it — where the variant toggle needs the wholesale
    //    clear-and-rebuild. Prod/tests use the incremental path below (FB-81, zero idle churn). ──
    if (__DEV_TOOLS__ && dev) {
      marketRefs = null; // drop the incremental shell so returning to default rebuilds cleanly
      marketPane.textContent = '';
      const card = el('div', 'rung-card frame market-card');
      card.append(el('div', 'rung-now', 'The pedlar 市'));
      card.append(el('div', 'skill-blurb', MARKET_BLURB));
      if (!dev.renderVariant('market', card, state, dispatch)) {
        for (const item of MARKET_ITEMS) {
          const row = buildMarketRow(item);
          patchMarketRow(row, item, state);
          card.append(row);
        }
      }
      // the sell-rice faucet is always present (a fresh build per wholesale render — DEV-only path).
      const { sell, sellPrice, sellPurse, sellBtn } = buildSellRice();
      patchSellRice(sellPrice, sellPurse, sellBtn, state);
      card.append(sell);
      marketPane.append(card);
      return;
    }
    // prod / test — build the card + rows container + sell section ONCE, then patch in place.
    if (!marketRefs) {
      const card = el('div', 'rung-card frame market-card');
      card.append(el('div', 'rung-now', 'The pedlar 市'));
      card.append(el('div', 'skill-blurb', MARKET_BLURB));
      const rows = el('div', 'market-rows');
      card.append(rows);
      const { sell, sellPrice, sellPurse, sellBtn } = buildSellRice();
      card.append(sell);
      marketPane.append(card);
      marketRefs = { card, rows, sellPrice, sellPurse, sellBtn };
    }
    reconcileList(marketRefs.rows, MARKET_ITEMS, {
      key: (item) => item.id,
      build: (item) => buildMarketRow(item),
      patch: (row, item) => patchMarketRow(row, item, state),
      order: true,
    });
    patchSellRice(marketRefs.sellPrice, marketRefs.sellPurse, marketRefs.sellBtn, state);
  }

  return { renderMarket };
}

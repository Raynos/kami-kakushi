// The INVENTORY tab pair (split out of render.ts, 2026-07-13 render-split): the kura
// storehouse (ADR-113 shelter) + the home/belongings card (ADR-111). The default (A) home
// presentation ships from here; the diverged alternates stay DEV-only in
// ui/dev/variant-renderers.ts behind `dev.renderVariant`.
import {
  balance,
  formatCoin,
  isUnlocked,
  hasFlag,
  getWeapon,
  kuraBales,
  cornerRestBonus,
  homeSatietyBonus,
  homeStorageBonus,
  homeHasCook,
  homeSetComplete,
  ownedBelongings,
  ownedBelongingIds,
  ownsBelonging,
  BELONGINGS,
  HOME_TIERS,
  type BelongingDef,
  type GameState,
  type Intent,
} from '../../core';
import { el, stampAct } from '../render';
import {
  reconcileList,
  setText,
  setClass,
  setDisabled,
  toggle,
} from '../reconcile';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createInventoryView(ctx: {
  storehousePane: HTMLElement;
  belongingsPane: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
}): {
  renderStorehouse(state: GameState): void;
  renderBelongings(state: GameState): void;
} {
  const { storehousePane, belongingsPane, dispatch, dev } = ctx;

  let storehouseRefs: {
    card: HTMLElement;
    when: HTMLElement;
    row: HTMLElement;
    dep: HTMLButtonElement;
    wd: HTMLButtonElement;
    // ADR-107 Phase 2 — rice deposit, so the kura shelters rice beside coin (the ADR-113
    // loss-shelter now applies to rice too). Rice withdraw is a retired verb (H3, ADR-163:
    // rice is one-way — it fills the kura and is spent from the store).
    riceRow: HTMLElement;
    depRice: HTMLButtonElement;
    away: HTMLElement;
  } | null = null;
  // belongingsRefs (ADR-111 / FB-89) — the home card: a header, the owned-belongings list (the mat + bowl
  // + bought furniture), the acquire (buy) list, and a comfort-summary line. Build-once/patch (FB-81):
  // the two lists reconcile, the summary patches its text, so an idle re-render churns nothing.
  let belongingsRefs: {
    card: HTMLElement;
    homeName: HTMLElement;
    homeBlurb: HTMLElement;
    // ADR-122 — the status-mirror: the weapon mounted on your home wall (granted at R5), read live.
    statusMirror: HTMLElement;
    ownedHead: HTMLElement;
    ownedList: HTMLElement;
    comfort: HTMLElement;
    // ADR-120 — the hearth homes the cook verb: a cook affordance surfaced in the home when owned.
    cookRow: HTMLElement;
    cookBtn: HTMLButtonElement;
    acquireHead: HTMLElement;
    acquireList: HTMLElement;
  } | null = null;

  function renderStorehouse(state: GameState): void {
    // the kura storehouse (batch-2 call 7 / ADR-113) — shelter CARRIED coin + rice from a lost-fight
    // penalty. Opens with the estate economy; spatially gated to the kura node in Step 5. ADR-107
    // Phase 2 surfaces RICE beside coin (deposit/withdraw are already resource-generic), so the
    // "what you store, you keep" shelter closes the rice loss-shelter gap.
    // IA reorg (ADR-112 §2 / FB-108) — the kura bank is the Inventory tab's home (a clean lift).
    const show =
      ctx.activeTab() === 'inventory' && isUnlocked(state, 'panel-estate');
    toggle(storehousePane, show);
    if (!show) return;
    // build the shell ONCE (FB-81): the coin + rice store/withdraw rows and the "walk back" blurb are
    // all present, toggled in place by location; the balance line patches its text.
    if (!storehouseRefs) {
      const card = el('div', 'rung-card frame');
      card.append(el('div', 'rung-now', 'The storehouse 蔵'));
      card.append(
        el(
          'div',
          'skill-blurb',
          'Stow your coin and rice in the kura, safe from a beating on the road. What you carry, a lost fight can take; what you store, you keep — but rice spoils a little each season, and the kura holds only so much (raise it by improving the estate).',
        ),
      );
      const when = el('div', 'influence-when');
      card.append(when);
      const row = el('div', 'labour-row');
      const dep = el('button', 'auto-toggle', 'Store all coin');
      dep.type = 'button';
      dep.addEventListener('click', () =>
        dispatch({ type: 'deposit', resource: 'coin' }),
      );
      const wd = el('button', 'auto-toggle', 'Withdraw all coin');
      wd.type = 'button';
      wd.addEventListener('click', () =>
        dispatch({ type: 'withdraw', resource: 'coin' }),
      );
      row.append(dep, wd);
      const riceRow = el('div', 'labour-row');
      const depRice = el('button', 'auto-toggle', 'Store all rice');
      depRice.type = 'button';
      depRice.addEventListener('click', () =>
        dispatch({ type: 'deposit', resource: 'rice' }),
      );
      riceRow.append(depRice);
      const away = el(
        'div',
        'area-blurb',
        'Use the Map 地図 tab to head back to the kura (蔵) to store or draw coin and rice.',
      );
      card.append(row, riceRow, away);
      storehousePane.append(card);
      storehouseRefs = { card, when, row, dep, wd, riceRow, depRice, away };
    }
    const r = storehouseRefs;
    const carried = state.resources.coin ?? 0;
    const banked = state.banked.coin ?? 0;
    // ADR-163 — rice lives ONLY in the kura (shō); the carried pocket holds no rice. The kura reads
    // in BALES (TST4 — never a unit-less "N rice"). The rice-withdraw row is retired (H3) — rice is
    // one-way; the deposit row stays for the barn-filling model (always disabled while carried
    // rice is zero).
    const carriedRice = 0;
    const bankedRice = state.banked.rice ?? 0;
    const riceCap = balance.kuraRiceCap(state.estateStage);
    const riceRoom = Math.max(0, riceCap - bankedRice);
    setText(
      r.when,
      `Carried ${formatCoin(carried)} · stored ${formatCoin(banked)}, ${kuraBales(state)} bales (safe)`,
    );
    // spatial (Step 5c): the storehouse IS the kura — the balance shows anywhere (your safe reserve
    // is worth seeing on the road), but you can only store/draw while standing at the grain-store.
    const atKura = state.location === 'kura';
    toggle(r.row, atKura);
    toggle(r.riceRow, atKura);
    toggle(r.away, !atKura);
    if (atKura) {
      setDisabled(r.dep, carried <= 0);
      const depTitle = r.dep.disabled ? 'No carried coin to store.' : '';
      if (r.dep.title !== depTitle) r.dep.title = depTitle;
      setDisabled(r.wd, banked <= 0);
      const wdTitle = r.wd.disabled ? 'Nothing stored to withdraw.' : '';
      if (r.wd.title !== wdTitle) r.wd.title = wdTitle;
      // ADR-118 §1 — a full kura (no room under the cap) disables the rice store, pointing at the fix.
      setDisabled(r.depRice, carriedRice <= 0 || riceRoom <= 0);
      const depRiceTitle =
        carriedRice <= 0
          ? 'No carried rice to store.'
          : riceRoom <= 0
            ? 'The kura is full — improve the estate to raise its rice capacity.'
            : '';
      if (r.depRice.title !== depRiceTitle) r.depRice.title = depRiceTitle;
    }
  }

  // ADR-111 / FB-89 — the comfort badge a belonging carries (a keepsake, or its legible comfort bonus).
  // Read from the def's comfort field (source of truth), so the shown bonus never drifts from the
  // real one applied by the reducer/selector (AC-6).
  // ADR-120 — the home's live-comfort summary line: rest recovery, any warmth buffer, the chest's
  // storage capacity, and the hearth-cook note — read through the SAME selectors the reducer uses (AC-6).
  function comfortSummaryText(state: GameState, settled: boolean): string {
    const restB = cornerRestBonus(state); // the corner's property (FB-409 — restRefill applies it only AT the corner)
    const bodyB = homeSatietyBonus(state);
    const storageB = homeStorageBonus(state);
    const parts: string[] = [];
    if (restB > 0) parts.push(`rest +${restB} body`);
    if (bodyB > 0) parts.push(`+${bodyB} max body`);
    if (storageB > 0) parts.push(`storage for ${storageB} belongings`);
    if (homeHasCook(state)) parts.push('a hearth to cook at');
    const base =
      parts.length > 0
        ? `Comfort in effect · ${parts.join(' · ')}`
        : 'A bare corner — no comforts yet.';
    return settled ? `${base} · a settled home 整` : base;
  }
  function comfortLabel(def: BelongingDef): string {
    if (def.homesCook) return 'The hearth · cook here'; // ADR-120 — diegetic, not a stat
    if (!def.comfort) return 'Keepsake';
    switch (def.comfort.kind) {
      case 'rest':
        return `Comfort · rest +${def.comfort.amount}`;
      case 'storage':
        return `Storage · keeps ${def.comfort.amount} belongings`; // ADR-120 — a dry buffer, not a stat
      case 'body':
        return `Comfort · warmth +${def.comfort.amount} max body`;
    }
  }
  // build ONE belonging row (owned OR acquirable): kanji · name, the inked blurb, the comfort badge,
  // and — for an acquirable piece — a buy cell. Stable structure; patch fills the mutable bits.
  function buildBelongingRow(def: BelongingDef): HTMLElement {
    const row = el('div', 'belonging-row');
    const head = el('div', 'belonging-head');
    head.append(el('span', 'belonging-kanji', def.kanji));
    head.append(el('span', 'belonging-name', def.label));
    row.append(head);
    row.append(el('div', 'skill-blurb belonging-blurb', def.blurb));
    row.append(el('div', 'lock-hint belonging-comfort', comfortLabel(def)));
    if (def.source.kind === 'buy') {
      const buy = el('div', 'belonging-buy');
      const btn = el('button', 'auto-toggle', formatCoin(def.source.coinCost));
      btn.type = 'button';
      btn.addEventListener('click', () =>
        dispatch({ type: 'buy_belonging', belongingId: def.id }),
      );
      buy.append(btn);
      row.append(buy);
    }
    return row;
  }

  function renderBelongings(state: GameState): void {
    // ADR-111 / FB-89 — the HOME + belongings, the Inventory tab's second home beside the kura bank.
    // Reveal-gated on the home existing (panel-home, R1 — "a place here is yours"); hidden on every
    // other tab + before the home is granted (no ghost box, FB-72). Belongings are DISTINCT from the
    // storehouse's resources: possessions you own + keep, shown with their comfort bonuses.
    const show =
      ctx.activeTab() === 'inventory' && isUnlocked(state, 'panel-home');
    toggle(belongingsPane, show);
    if (!show) return;
    // ── the diverged HOME / belongings presentation (ADR-075) — A = the functional list (default,
    //    ships). B (一間 room cutaway) / C (持ち物帳 ledger) live DEV-only behind the variant toggle
    //    (ui/dev.ts). This DEV branch folds to dead code in a STRIP build (`__DEV_TOOLS__` → false,
    //    tree-shaken) and `dev` is undefined in prod AND tests, so ONLY a live DEV session takes it —
    //    where the variant toggle needs the wholesale clear-and-rebuild. Prod/tests use the
    //    incremental path below (FB-81, zero idle churn). Every variant shows the SAME home data + the
    //    SAME live comfort tally, and every buy button drives the real `buy_belonging` intent. ──
    if (__DEV_TOOLS__ && dev) {
      const tierD = HOME_TIERS[0]!;
      belongingsRefs = null; // drop the incremental shell so returning to default rebuilds cleanly
      belongingsPane.textContent = '';
      const card = el('div', 'rung-card frame');
      card.append(el('div', 'rung-now', `${tierD.label} ${tierD.kanji}`));
      card.append(el('div', 'skill-blurb', tierD.blurb));
      if (!dev.renderVariant('home', card, state, dispatch)) {
        // default A, wholesale — the same owned/comfort/acquire structure the incremental path builds.
        const ownedHead = el('div', 'belongings-subhead', 'What is yours');
        const ownedList = el('div', 'belongings-list');
        for (const def of ownedBelongings(state))
          ownedList.append(buildBelongingRow(def));
        const settledD = homeSetComplete(ownedBelongingIds(state));
        const comfortD = el(
          'div',
          'rung-hint belongings-comfort-summary',
          comfortSummaryText(state, settledD),
        );
        const acquirableD = BELONGINGS.filter(
          (b) => b.source.kind === 'buy' && !ownsBelonging(state, b.id),
        );
        card.append(ownedHead, ownedList, comfortD);
        if (acquirableD.length > 0) {
          card.append(el('div', 'belongings-subhead', 'Settle your corner'));
          const acquireList = el('div', 'belongings-list');
          for (const def of acquirableD)
            acquireList.append(buildBelongingRow(def));
          card.append(acquireList);
        }
      }
      belongingsPane.append(card);
      return;
    }
    if (!belongingsRefs) {
      const card = el('div', 'rung-card frame');
      const homeName = el('div', 'rung-now');
      const homeBlurb = el('div', 'skill-blurb');
      // ADR-122 — the status-mirror: the weapon mounted on your wall at R5 (its own inked line).
      const statusMirror = el('div', 'rung-hint belongings-status-mirror');
      const ownedHead = el('div', 'belongings-subhead', 'What is yours');
      const ownedList = el('div', 'belongings-list');
      const comfort = el('div', 'rung-hint belongings-comfort-summary');
      // ADR-120 — the cook-at-the-hearth affordance (shown once the hearth is owned).
      const cookRow = el('div', 'labour-row belongings-cook');
      const cookBtn = el('button', 'verb') as HTMLButtonElement;
      cookBtn.type = 'button';
      stampAct(cookBtn, 'cook_meal');
      cookBtn.addEventListener('click', () => dispatch({ type: 'cook_meal' }));
      cookRow.append(cookBtn);
      const acquireHead = el('div', 'belongings-subhead', 'Settle your corner');
      const acquireList = el('div', 'belongings-list');
      card.append(
        homeName,
        homeBlurb,
        statusMirror,
        ownedHead,
        ownedList,
        comfort,
        cookRow,
        acquireHead,
        acquireList,
      );
      belongingsPane.append(card);
      belongingsRefs = {
        card,
        homeName,
        homeBlurb,
        statusMirror,
        ownedHead,
        ownedList,
        comfort,
        cookRow,
        cookBtn,
        acquireHead,
        acquireList,
      };
    }
    const r = belongingsRefs;
    // T0 ships one home tier (HOME_TIERS[0] — "your corner"); the growing-with-rung tiers are a
    // deferred T1+ seam (ADR-111 §2.1), so this is a stable header today.
    const tier = HOME_TIERS[0]!;
    setText(r.homeName, `${tier.label} ${tier.kanji}`);
    setText(r.homeBlurb, tier.blurb);

    // ADR-122 — the status-mirror: at R5 your wielded weapon is mounted on the wall. Read the ACTUAL
    // equipped weapon LIVE (never a generic sword), so re-equipping updates the mount. Hidden until R5.
    const hasWallWeapon = hasFlag(state, 'wall-weapon');
    toggle(r.statusMirror, hasWallWeapon);
    if (hasWallWeapon) {
      const w = getWeapon(state.equippedWeapon);
      setText(
        r.statusMirror,
        `On the wall · your ${w.label.toLowerCase()} ${w.kanji} — a servant's token`,
      );
    }

    // the OWNED list — the granted keepsakes (mat + bowl) + any bought furniture, in roster order.
    const owned = ownedBelongings(state);
    reconcileList(r.ownedList, owned, {
      key: (def) => def.id,
      build: buildBelongingRow,
      order: true,
    });

    // the comfort SUMMARY — the live bonuses in effect (read through the SAME selectors the reducer
    // uses, AC-6). Reads bare for an empty corner; the settled-home set adds its synergy note. ADR-120 —
    // the hearth (cook locus) + the chest (storage) show their diegetic worth, not a satiety stat.
    const ownedIds = ownedBelongingIds(state);
    const settled = homeSetComplete(ownedIds);
    setText(r.comfort, comfortSummaryText(state, settled));

    // ADR-120 — the hearth homes the cook verb: once you own the hearth, cooking a meal
    // (sansai → belly, ADR-164/ADR-197) is reachable here, at your own fire. Shown only when
    // the hearth is owned AND cook is unlocked (verb-cook, ~R2); disabled + explained when
    // you're short on sansai (mirrors the Character Body-card cook).
    const canCookHere = homeHasCook(state) && isUnlocked(state, 'verb-cook');
    toggle(r.cookRow, canCookHere);
    if (canCookHere) {
      const cost = balance.COOK_SANSAI_COST;
      const short = (state.resources.sansai ?? 0) < cost;
      setText(r.cookBtn, `Cook a meal at the hearth (${cost} sansai)`);
      setClass(r.cookBtn, 'primary', false); // the heal cue left with the mend (ADR-197)
      setDisabled(r.cookBtn, short);
      const title = short
        ? `Need ${cost} sansai to cook — forage the woodlot for wild greens.`
        : 'Boil the wild greens into a hot meal — a full belly for the day’s work.';
      if (r.cookBtn.title !== title) r.cookBtn.title = title;
    }

    // the ACQUIRE list — buyable comfort pieces you don't yet own; disabled when you can't pay.
    const acquirable = BELONGINGS.filter(
      (b) => b.source.kind === 'buy' && !ownsBelonging(state, b.id),
    );
    toggle(r.acquireHead, acquirable.length > 0);
    const carriedCoin = state.resources.coin ?? 0;
    reconcileList(r.acquireList, acquirable, {
      key: (def) => def.id,
      build: buildBelongingRow,
      patch: (row, def) => {
        if (def.source.kind !== 'buy') return;
        const btn = row.querySelector<HTMLButtonElement>(
          '.belonging-buy button',
        );
        if (!btn) return;
        const afford = carriedCoin >= def.source.coinCost;
        setDisabled(btn, !afford);
        const title = afford ? '' : `Needs ${formatCoin(def.source.coinCost)}`;
        if (btn.title !== title) btn.title = title;
        const aria = `Bring a ${def.label.toLowerCase()} into your corner (${comfortLabel(def)}) for ${formatCoin(def.source.coinCost)}`;
        if (btn.getAttribute('aria-label') !== aria)
          btn.setAttribute('aria-label', aria);
      },
      order: true,
    });
  }

  return { renderStorehouse, renderBelongings };
}

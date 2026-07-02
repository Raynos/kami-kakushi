// DEV-only harness (PRD §6.10 / D-075): the in-UI DEV panel + the live variant-toggle
// infrastructure. This WHOLE module is referenced only behind `import.meta.env.DEV` —
// `createDevApi`/`mountDevPanel` are called from a DEV-guarded branch in main.ts, and the
// renderer reaches `renderVariant` only through `import.meta.env.DEV && dev` (a branch Vite
// folds to dead code in prod). So Rollup tree-shakes this module — and everything it carries
// (variant ids, the alternate renderers, the panel labels) — out of the production bundle.
// The `gh-pages.sh` strip-guard greps the prod bundle for DEV_SENTINEL to PROVE it.
//
// The renderer reads a DEV-only `variant: Record<surface,id>` to choose which rendering of a
// diverged surface to show; NOTHING in src/core branches on it — variants are pure
// presentation. Prod ships only each surface's DEFAULT (the first variant), so there is zero
// prod flag-debt (D-075).

import {
  balance,
  bestiaryEntries,
  canBuy,
  canCraft,
  getMaterial,
  getNode,
  reachableFrom,
  skillLevel,
  ACTIVITIES,
  MOBS,
  MARKET_ITEMS,
  QUESTS,
  RECIPES,
  type ActivityId,
  type GameState,
  type Intent,
  type MarketItem,
  type MobId,
  type RankId,
} from '../core';
import { el, pct } from './render';

/** A marker that exists ONLY in this DEV module. The gh-pages guard greps the prod bundle for
 *  it and refuses to deploy if it leaked — proof the DEV harness + variants were stripped. */
export const DEV_SENTINEL = '__KAMI_DEV_PANEL__';

export interface VariantDef {
  id: string;
  label: string;
  /** A one-line gloss shown under the toggle so the human knows what they are picking. */
  blurb: string;
}
export interface SurfaceDef {
  id: string;
  label: string;
  /** variants[0] is the prod DEFAULT (self-picked); the rest are DEV-only alternates. */
  variants: VariantDef[];
}

/** The registry of diverged surfaces + their variants — the single source the panel toggle
 *  and the renderer both read. Grows as Step 2 adds craft / market / quests. */
export const SURFACES: SurfaceDef[] = [
  {
    id: 'influence',
    label: 'House-Influence grade',
    variants: [
      {
        id: 'influence-a',
        label: 'A · continuous bar',
        blurb: 'Indigo→gold ink bar, ticks at Good/Great/Excellent (the shipped default).',
      },
      {
        id: 'influence-b',
        label: 'B · segmented bands',
        blurb: 'Three lacquer band-boxes (Good/Great/Excellent); the current band fills.',
      },
      {
        id: 'influence-c',
        label: 'C · standing marks',
        blurb: 'A row of ink marks ◆◇ filling toward Excellent — a diegetic tally.',
      },
    ],
  },
  {
    id: 'craft',
    label: 'Crafting',
    variants: [
      {
        id: 'craft-a',
        label: 'A · work-order checklist',
        blurb: 'Name…have/need rows, green once met, one Forge button (the shipped default).',
      },
      {
        id: 'craft-b',
        label: "B · smith's measures",
        blurb: 'Each material a continuous ink fill-gauge toward the needed amount.',
      },
      {
        id: 'craft-c',
        label: 'C · diegetic assembly',
        blurb: 'Each material shown as the part it becomes; a 整/未 verdict at the foot.',
      },
    ],
  },
  {
    id: 'market',
    label: 'Travelling market',
    variants: [
      {
        id: 'market-a',
        label: 'A · price-button list',
        blurb: 'Flat rows: name + grant, a bare koku buy-button (the calm, shipped default).',
      },
      {
        id: 'market-b',
        label: 'B · posted price-board',
        blurb: 'One notice: name … grant · price · 求, with stock/shortfall beneath.',
      },
      {
        id: 'market-c',
        label: "C · pedlar's ground-cloth",
        blurb: 'Purse up top, emoji goods, remaining stock as continuous ochre ink.',
      },
    ],
  },
  {
    id: 'map',
    label: 'Estate map',
    variants: [
      {
        id: 'map-a',
        label: 'A · paths list',
        blurb: 'You-are-here card + a plain "Paths lead to →" list of moves (the shipped default).',
      },
      {
        id: 'map-b',
        label: 'B · 絵地図 estate schematic',
        blurb:
          'A spatial trail: revealed nodes laid out by distance from the kura, you-are-here lit, walkable ones live.',
      },
      {
        id: 'map-c',
        label: 'C · 道中記 traveller’s ledger',
        blurb:
          'Informed routes: each path shows the destination’s blurb + what awaits (labour/foe/danger).',
      },
    ],
  },
  {
    id: 'bestiary',
    label: 'Bestiary',
    variants: [
      {
        id: 'bestiary-a',
        label: 'A · field-guide cards',
        blurb:
          'Foe cards: kanji seal · tell · win-rate · haunt; unfaced foes fogged (the default).',
      },
      {
        id: 'bestiary-b',
        label: 'B · danger ledger',
        blurb: 'A ranked ink table easiest→deadliest, each foe a continuous danger-gauge (A19).',
      },
      {
        id: 'bestiary-c',
        label: 'C · 図鑑 scroll',
        blurb:
          'Diegetic scroll entries: a silhouette that inks into a portrait as you learn a foe.',
      },
    ],
  },
  {
    id: 'quests',
    label: 'Quests',
    variants: [
      {
        id: 'quests-a',
        label: 'A · woodblock cards',
        blurb:
          'Square .frame cards: title, blurb, ☑/☐ checklist, Take this on (the shipped default).',
      },
      {
        id: 'quests-b',
        label: 'B · 高札 notice-board',
        blurb: 'Commission-bills on a board; a continuous-ink deeds stroke; 請ける to take.',
      },
      {
        id: 'quests-c',
        label: 'C · 用帳 field-ledger',
        blurb: 'Aligned ledger rows: kind · note · ink tally · right-aligned koku column.',
      },
    ],
  },
];

export interface DevApi {
  getVariant(surface: string): string;
  setVariant(surface: string, id: string): void;
  surfaces: readonly SurfaceDef[];
  /** Render a NON-default variant of `surface` into `container`. Returns true if it rendered
   *  (a non-default is selected) → the caller skips its default; false → the caller renders the
   *  prod default. `dispatch` is the renderer's own dispatch (threaded so interactive variants —
   *  market/quests buttons — drive the real reducer, not a global). Always absent in prod. */
  renderVariant(
    surface: string,
    container: HTMLElement,
    state: GameState,
    dispatch: (intent: Intent) => void,
  ): boolean;
}

export function createDevApi(): DevApi {
  const variant: Record<string, string> = {};
  for (const s of SURFACES) variant[s.id] = s.variants[0]!.id;
  const defaultOf = (s: string): string => SURFACES.find((x) => x.id === s)?.variants[0]?.id ?? '';
  return {
    getVariant: (s) => variant[s] ?? defaultOf(s),
    setVariant: (s, id) => {
      variant[s] = id;
    },
    surfaces: SURFACES,
    renderVariant: (s, container, state, dispatch) => {
      const id = variant[s] ?? defaultOf(s);
      if (id === defaultOf(s)) return false; // default → the caller renders it (and ships it)
      return renderSurfaceVariant(s, id, container, state, dispatch);
    },
  };
}

// ── the alternate (non-default) variant renderers — DEV-only, stripped from prod ──

function renderSurfaceVariant(
  surface: string,
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (surface === 'influence') return renderInfluenceGrade(variantId, container, state);
  if (surface === 'craft') return renderCraftVariant(variantId, container, state);
  if (surface === 'market') return renderMarketVariant(variantId, container, state, dispatch);
  if (surface === 'quests') return renderQuestsVariant(variantId, container, state, dispatch);
  if (surface === 'map') return renderMapVariant(variantId, container, state, dispatch);
  if (surface === 'bestiary') return renderBestiaryVariant(variantId, container, state);
  return false;
}

/** The diverged Bestiary (B / C) — DEV-only, stripped from prod. Default A (the field-guide card
 *  list) ships inline in render.ts; B/C are pure re-presentations of the SAME `bestiaryEntries`
 *  data — an un-faced foe stays fogged in every take (scout-by-fighting). No dispatch: read-only. */
function renderBestiaryVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  if (variantId !== 'bestiary-b' && variantId !== 'bestiary-c') return false;
  const entries = bestiaryEntries(state);
  const known = entries.filter((e) => e.seen).length;

  if (variantId === 'bestiary-b') {
    // ── B · the danger ledger — a ranked ink table, easiest→deadliest, each faced foe carrying a
    //    single CONTINUOUS danger-gauge (A19: ink over pips) that fills as the odds worsen. An
    //    un-faced foe is a fogged row (silhouette + hatched gauge), so the shape is legible but the
    //    threat unknown until met. ──
    const ledger = el('div');
    ledger.style.cssText =
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem .6rem;display:flex;flex-direction:column;gap:.4rem;';
    const banner = el('div');
    banner.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;color:var(--ink);';
    const bt = el('span', undefined, `Danger ledger — ${known} of ${entries.length} recorded`);
    bt.style.fontWeight = '700';
    banner.append(bt);
    const bk = el('span', undefined, '危険帳');
    bk.lang = 'ja';
    bk.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    banner.append(bk);
    ledger.append(banner);

    // seen foes ranked easiest (highest win-rate) → deadliest; the fogged ones trail after.
    const ranked = entries
      .slice()
      .sort((a, b) => Number(b.seen) - Number(a.seen) || b.winRate - a.winRate);
    for (const e of ranked) {
      const danger = e.seen ? 1 - e.winRate : 0;
      const row = el('div');
      row.style.cssText = 'display:flex;align-items:center;gap:.5rem;';
      const name = el('span', undefined, e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe');
      name.style.cssText = `flex:0 0 9rem;color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
      const track = el('div');
      track.style.cssText =
        'position:relative;flex:1;height:.7rem;border:1px solid var(--ink-faint);background:var(--washi);overflow:hidden;';
      if (e.seen) {
        const fill = el('span');
        // deadlier → fuller + hotter ink (rokusho→ochre→beni as the odds worsen).
        const hue =
          danger >= 0.72 ? 'var(--beni)' : danger >= 0.45 ? 'var(--ochre)' : 'var(--rokusho)';
        fill.style.cssText = `position:absolute;left:0;top:0;height:100%;width:${Math.round(danger * 100)}%;background:${hue};`;
        track.append(fill);
      } else {
        track.style.backgroundImage =
          'repeating-linear-gradient(45deg,var(--washi),var(--washi) 4px,var(--washi-shade) 4px,var(--washi-shade) 8px)';
      }
      const read = el('span', undefined, e.seen ? `${pct(1 - danger)} win` : 'unknown');
      read.style.cssText = `flex:0 0 4.5rem;text-align:right;font-variant-numeric:tabular-nums;font-size:var(--fs-micro);color:${e.seen ? 'var(--ink-soft)' : 'var(--ink-faint)'};`;
      row.append(name, track, read);
      ledger.append(row);
    }
    container.append(ledger);
    return true;
  }

  // ── C · the 図鑑 scroll — diegetic bestiary entries. Each foe is a scroll row led by a KANJI
  //    "portrait" that inks in once faced (a faint silhouette ？ before), with the field-note prose
  //    and its tell beneath; unfaced foes read as a rumour, not a stat-line. ──
  const scroll = el('div');
  scroll.style.cssText =
    'border:2px solid var(--ink);background:var(--washi);padding:.55rem .65rem;display:flex;flex-direction:column;gap:.5rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  const ct = el(
    'span',
    undefined,
    `The beasts of the estate — ${known} of ${entries.length} known`,
  );
  ct.style.fontWeight = '700';
  cap.append(ct);
  const ck = el('span', undefined, '図鑑');
  ck.lang = 'ja';
  ck.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(ck);
  scroll.append(cap);

  for (const e of entries) {
    const row = el('div');
    row.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start;';
    const portrait = el('div');
    portrait.lang = 'ja';
    portrait.textContent = e.seen ? e.mob.kanji : '？';
    portrait.style.cssText =
      `flex:0 0 3rem;height:3rem;display:flex;align-items:center;justify-content:center;` +
      `font-size:1.8rem;border:1px solid ${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};` +
      `background:${e.seen ? 'var(--washi-shade)' : 'var(--washi-deep)'};` +
      `color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};`;
    row.append(portrait);
    const body = el('div');
    body.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:.12rem;';
    const nm = el('span', undefined, e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'A beast unmet');
    nm.style.cssText = `font-weight:700;color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};`;
    body.append(nm);
    if (e.seen) {
      body.append(el('div', 'skill-blurb', e.mob.blurb));
      const note = el(
        'div',
        undefined,
        `Its way in a fight — ${e.tell}. Your odds against it: ${pct(e.winRate)}.`,
      );
      note.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-soft);';
      body.append(note);
    } else {
      const rumour = el(
        'div',
        undefined,
        'Only a rumour so far. Face it, and this entry will ink itself in.',
      );
      rumour.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-faint);font-style:italic;';
      body.append(rumour);
    }
    row.append(body);
    scroll.append(row);
  }
  container.append(scroll);
  return true;
}

/** The diverged House-Influence grade visual (B / C). The shared frame / head / silhouettes /
 *  ascend CTA live in render.ts (default A ships to prod); only this grade block diverges. */
function renderInfluenceGrade(variantId: string, card: HTMLElement, state: GameState): boolean {
  const est = state.influence.estate;
  const bands = balance.ESTATE_BANDS;
  if (variantId === 'influence-b') {
    // B — three lacquer band-boxes (Good / Great / Excellent); reached bands lit, the current
    // one partially filled. (The old B bug — fill used `color`, not `background` — is fixed.)
    const wrap = el('div', 'influence-seg');
    wrap.style.cssText = 'display:flex;gap:.4rem;margin:.5rem 0;';
    const segs: { label: string; lo: number; hi: number }[] = [
      { label: 'Good 良', lo: 0, hi: bands.good },
      { label: 'Great 優', lo: bands.good, hi: bands.great },
      { label: 'Excellent 秀', lo: bands.great, hi: bands.excellent },
    ];
    const hue = ['var(--ai)', 'var(--ochre)', 'var(--gold)'];
    segs.forEach((s, i) => {
      const frac = Math.max(0, Math.min(1, (est.value - s.lo) / (s.hi - s.lo)));
      const box = el('div');
      box.style.cssText =
        'flex:1;position:relative;height:2.4rem;border:1px solid var(--ink-faint);border-radius:2px;overflow:hidden;background:var(--washi);';
      const fill = el('span');
      fill.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${Math.round(frac * 100)}%;background:${hue[i]};opacity:.85;`;
      const lab = el('span', undefined, s.label);
      lab.style.cssText =
        'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:var(--fs-micro)/1 var(--font-body);color:var(--ink);';
      box.append(fill, lab);
      wrap.append(box);
    });
    card.append(wrap);
  } else if (variantId === 'influence-c') {
    // C — "standing marks": a row of ink pips ◆◇ filling toward Excellent (a diegetic tally).
    const MARKS = 12;
    const filled = Math.round(Math.min(1, est.value / bands.excellent) * MARKS);
    const row = el('div', 'influence-marks');
    row.style.cssText = 'margin:.5rem 0;letter-spacing:.18em;font-size:1.1rem;';
    let marks = '';
    for (let i = 0; i < MARKS; i++) marks += i < filled ? '◆' : '◇';
    const span = el('span', undefined, marks);
    span.style.color = 'var(--gold)';
    row.append(span);
    card.append(row);
  } else {
    return false;
  }
  card.append(
    el('div', 'influence-when', `Standing ${est.value} · the season judges at ${est.highWater}`),
  );
  return true;
}

/** The diverged Craft panel (B / C) — DEV-only, stripped from prod. The shared chrome (recipe
 *  title, intro blurb, and the dispatch-bound Forge button) stays inline in render.ts (default A
 *  ships); only the material-status DISPLAY portion diverges, rendered into `container`. Pure
 *  presentation of the same data — no dispatch needed (the Forge button is shared). */
function renderCraftVariant(variantId: string, container: HTMLElement, state: GameState): boolean {
  // Mirror render.ts: the NEXT un-crafted recipe in progression order (axe → yari, A3), so the
  // DEV variants show the same card the default renderer does — not a stale RECIPES[0].
  const recipe = RECIPES.find((r) => !state.flags[`crafted-${r.outputWeapon}`]) ?? RECIPES[0]!;
  const can = canCraft(state.resources, recipe);
  const inputs = Object.entries(recipe.inputs);

  if (variantId === 'craft-b') {
    // B — "the smith's measures": each material a single CONTINUOUS ink fill-gauge (A19:
    // continuous ink over a bare number) filling toward what the recipe asks. The exact
    // tabular have/need stays beside it, so no count is lost; gold when full, ochre while short.
    const wrap = el('div', 'craft-measures');
    wrap.style.cssText = 'margin:.4rem 0;display:flex;flex-direction:column;gap:.45rem;';
    for (const [mat, need] of inputs) {
      const have = state.resources[mat] ?? 0;
      const m = getMaterial(mat);
      const full = have >= need;
      const frac = need > 0 ? Math.max(0, Math.min(1, have / need)) : 1;
      const row = el('div', 'craft-measure');
      row.style.cssText = 'display:flex;flex-direction:column;gap:.15rem;';
      const head = el('div');
      head.style.cssText =
        'display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;';
      head.append(el('span', undefined, `${m.label} ${m.kanji}`));
      const tally = el(
        'span',
        undefined,
        full ? `${have}/${need} · 足` : `${have}/${need} · ${need - have} wanting`,
      );
      tally.style.cssText =
        'font-variant-numeric:tabular-nums;color:var(--ink);white-space:nowrap;';
      tally.title = full
        ? 'This measure runs full.'
        : `Fell more foes — ${need - have} more ${m.label.toLowerCase()} wanting.`;
      head.append(tally);
      row.append(head);
      const track = el('div');
      track.style.cssText =
        'position:relative;height:.7rem;border:1px solid var(--ink-faint);' +
        'background:var(--washi-shade);overflow:hidden;';
      const fill = el('span');
      fill.style.cssText =
        `position:absolute;left:0;top:0;height:100%;width:${Math.round(frac * 100)}%;` +
        `background:${full ? 'var(--gold)' : 'var(--ochre)'};`;
      track.append(fill);
      row.append(track);
      wrap.append(row);
    }
    container.append(wrap);
    container.append(
      el(
        'div',
        'skill-blurb',
        can
          ? 'Every measure runs full — strike the smithy and bind the axe.'
          : 'The axe binds once every measure runs full.',
      ),
    );
    return true;
  }

  if (variantId === 'craft-c') {
    // C — "what the axe waits on": a FOCUSED DIEGETIC assembly readout (A19: a focused in-world
    // view over an abstract tally). Each material is the part it becomes — its blurb names the
    // role — with a left ink-rule gold-once-gathered / indigo-while-wanting, and a 整/未 verdict.
    const list = el('div', 'craft-assembly');
    list.style.cssText = 'margin:.4rem 0;display:flex;flex-direction:column;gap:.5rem;';
    for (const [mat, need] of inputs) {
      const have = state.resources[mat] ?? 0;
      const m = getMaterial(mat);
      const full = have >= need;
      const part = el('div');
      part.style.cssText =
        `display:flex;gap:.5rem;padding-left:.5rem;` +
        `border-left:3px solid ${full ? 'var(--gold)' : 'var(--ai)'};`;
      const kan = el('span', undefined, m.kanji);
      kan.style.cssText = 'font-size:1.3rem;line-height:1.1;color:var(--ink);';
      part.append(kan);
      const body = el('div');
      body.style.cssText = 'flex:1;';
      const headRow = el('div');
      headRow.style.cssText =
        'display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;';
      headRow.append(el('span', undefined, m.label));
      const status = el(
        'span',
        undefined,
        full ? `${have}/${need} · 足` : `${have}/${need} · ${need - have} wanting`,
      );
      status.style.cssText =
        'font-variant-numeric:tabular-nums;color:var(--ink);white-space:nowrap;';
      status.title = full
        ? 'This part is gathered.'
        : `Fell more foes — ${need - have} more ${m.label.toLowerCase()} wanting.`;
      headRow.append(status);
      body.append(headRow);
      body.append(el('div', 'skill-blurb', m.blurb));
      part.append(body);
      list.append(part);
    }
    container.append(list);
    const verdict = el(
      'div',
      undefined,
      can ? '整 — the bench is set; bind the axe.' : '未 — the bench wants for materials yet.',
    );
    verdict.style.cssText =
      `margin-top:.35rem;font-weight:700;font-variant-numeric:tabular-nums;` +
      `color:${can ? 'var(--gold)' : 'var(--shu)'};`;
    container.append(verdict);
    return true;
  }

  return false;
}

/** The diverged travelling-market visual (B / C) — DEV-only. The shared stall heading + intro
 *  blurb stay in render.ts (default A — the price-button list — ships); only the GOODS
 *  presentation diverges. Buy buttons drive the real reducer via the threaded `dispatch`. */
function renderMarketVariant(
  variantId: string,
  card: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  const buy = (itemId: string): void => dispatch({ type: 'buy_item', itemId });
  const koku = state.resources.koku ?? 0;
  const grantStr = (item: MarketItem): string =>
    Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');

  if (variantId === 'market-b') {
    // B — the posted price-board (品書 shinagaki): one notice, each good a justified ledger line —
    // name, a dotted leader, grant + price right-aligned tabular, then a 求 ("buy") verb. Stock +
    // any koku shortfall read as plain ink beneath, so an unaffordable good is HINTED, never grey.
    const board = el('div', 'market-board');
    board.style.cssText = 'margin:.5rem 0;border-top:1px solid var(--ink-faint);padding-top:.2rem;';
    for (const item of MARKET_ITEMS) {
      const bought = state.marketBought[item.id] ?? 0;
      const remaining = item.stockCap - bought;
      const capped = remaining <= 0;
      const affordable = canBuy(state.resources, item, bought);

      const line = el('div', 'market-board-line');
      line.style.cssText = 'display:flex;align-items:center;gap:.45rem;padding:.3rem 0 .1rem;';
      const name = el('span', undefined, item.label);
      name.style.cssText = 'color:var(--ink);white-space:nowrap;';
      const leader = el('span');
      leader.style.cssText =
        'flex:1;height:0;border-bottom:1px dotted var(--ink-faint);min-width:1.5rem;';
      leader.setAttribute('aria-hidden', 'true');
      const grant = el('span', undefined, grantStr(item));
      grant.style.cssText =
        'color:var(--rokusho);font-variant-numeric:tabular-nums;white-space:nowrap;';
      const price = el('span', undefined, `${item.kokuCost} koku`);
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;min-width:5rem;text-align:right;white-space:nowrap;';
      const verb = el('button', 'verb', capped ? '尽' : '求');
      verb.type = 'button';
      verb.disabled = !affordable;
      verb.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${item.kokuCost} koku${capped ? ' — sold out' : ''}`,
      );
      verb.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Pay ${item.kokuCost} koku`
          : `Need ${item.kokuCost - koku} more koku`;
      verb.addEventListener('click', () => buy(item.id));
      line.append(name, leader, grant, price, verb);

      const hintText = capped
        ? 'sold out'
        : affordable
          ? `${remaining} left`
          : `${remaining} left · need ${item.kokuCost - koku} more koku`;
      const hint = el('div', 'lock-hint', hintText);
      hint.style.cssText = 'margin:0 0 .25rem;font-style:italic;';
      board.append(line, hint);
    }
    card.append(board);
    return true;
  }

  if (variantId === 'market-c') {
    // C — the pedlar's ground-cloth: the purse up top, each good led by ONE curated good-emoji,
    // the price to the right, and REMAINING stock as CONTINUOUS INK (an ochre bar shortening as
    // the cloth empties, A19 — not pips). Unaffordable goods name the koku shortfall, not grey.
    const icon: Record<string, string> = {
      greens_sack: '🌿',
      wood_bundle: '🪵',
      whetstone_kit: '🪨',
      greens_basket: '🧺',
    };
    const purse = el('div', 'lock-hint', `Your purse · ${koku} koku`);
    purse.style.cssText =
      'margin:.4rem 0 .2rem;color:var(--ink-soft);font-variant-numeric:tabular-nums;align-self:flex-start;';
    card.append(purse);
    for (const item of MARKET_ITEMS) {
      const bought = state.marketBought[item.id] ?? 0;
      const remaining = item.stockCap - bought;
      const capped = remaining <= 0;
      const affordable = canBuy(state.resources, item, bought);
      const frac = item.stockCap > 0 ? remaining / item.stockCap : 0;

      const row = el('div', 'market-cloth-row');
      row.style.cssText =
        'display:flex;align-items:flex-start;gap:.55rem;padding:.45rem 0;border-top:1px solid var(--ink-faint);';
      const glyph = el('span', undefined, icon[item.id] ?? '🎒');
      glyph.style.cssText = 'font-size:1.5rem;line-height:1.1;flex:0 0 auto;';
      glyph.setAttribute('aria-hidden', 'true');
      const mid = el('div');
      mid.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:.14rem;min-width:0;';
      const nameLine = el('span', undefined, item.label);
      nameLine.style.cssText = 'color:var(--ink);';
      const grant = el('span', undefined, grantStr(item));
      grant.style.cssText = 'color:var(--rokusho);font-variant-numeric:tabular-nums;';
      const track = el('div');
      track.style.cssText =
        'height:.28rem;max-width:7rem;background:var(--washi-shade);margin-top:.15rem;';
      const ink = el('div');
      ink.style.cssText = `height:100%;width:${Math.round(frac * 100)}%;background:${capped ? 'var(--ink-faint)' : 'var(--ochre)'};`;
      track.append(ink);
      const stockText = capped
        ? 'cloth bare · sold out'
        : affordable
          ? `${remaining} of ${item.stockCap} left`
          : `${remaining} of ${item.stockCap} left · need ${item.kokuCost - koku} more koku`;
      const stockLabel = el('span', 'lock-hint', stockText);
      stockLabel.style.cssText =
        'font-style:italic;font-variant-numeric:tabular-nums;align-self:flex-start;';
      mid.append(nameLine, grant, track, stockLabel);
      const right = el('div');
      right.style.cssText =
        'flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;';
      const price = el('span', undefined, `${item.kokuCost} koku`);
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;white-space:nowrap;';
      const take = el('button', 'verb', capped ? 'gone' : 'take 取');
      take.type = 'button';
      take.disabled = !affordable;
      take.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${item.kokuCost} koku${capped ? ' — sold out' : ''}`,
      );
      take.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Take it — pay ${item.kokuCost} koku`
          : `Need ${item.kokuCost - koku} more koku`;
      take.addEventListener('click', () => buy(item.id));
      right.append(price, take);
      row.append(glyph, mid, right);
      card.append(row);
    }
    return true;
  }

  return false;
}

/** The diverged Quests surface (B / C) — DEV-only. The shared <h2> title ("Quests 用") stays in
 *  render.ts; each variant supplies its own diegetic framing + body for the SAME data. Accept
 *  buttons drive the real reducer via the threaded `dispatch`. */
function renderQuestsVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'quests-b' && variantId !== 'quests-c') return false;

  // kind → a brushed category stamp (kanji + roman word) + its accent. Colour is ALWAYS backed by
  // the word text (§9). The keys match QuestKind exactly, so KIND[q.kind] is total.
  const KIND = {
    PEST: { kanji: '害', word: 'PEST', accent: 'var(--beni)' },
    HUNT: { kanji: '狩', word: 'HUNT', accent: 'var(--ai)' },
    CLEAR: { kanji: '掃', word: 'CLEAR', accent: 'var(--ochre)' },
    DEFEND: { kanji: '守', word: 'DEFEND', accent: 'var(--rokusho)' },
  };
  const take = (questId: string): void => dispatch({ type: 'accept_quest', questId });

  if (variantId === 'quests-b') {
    // ── B · 高札場 — the village notice-board. Each quest a posted commission-bill; progress reads
    //    as ONE CONTINUOUS ink "deeds answered" stroke (A19), the deeds fine-listed beneath. ──
    const board = el('div');
    board.style.cssText =
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem .6rem;' +
      'display:flex;flex-direction:column;gap:.55rem;';
    const banner = el('div');
    banner.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;color:var(--ink);';
    banner.append(el('span', undefined, '📜'));
    const bTitle = el('span', undefined, 'Kōsatsu — the village notice-board');
    bTitle.style.fontWeight = '700';
    banner.append(bTitle);
    const bKanji = el('span', undefined, '高札場');
    bKanji.lang = 'ja';
    bKanji.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    banner.append(bKanji);
    board.append(banner);

    for (const q of QUESTS) {
      const done = new Set(state.quests.progress[q.id] ?? []);
      const completed = state.quests.completed.includes(q.id);
      const accepted = state.quests.accepted.includes(q.id);
      const k = KIND[q.kind];

      const bill = el('div');
      bill.style.cssText =
        'border:1px solid var(--ink-faint);border-left:4px solid ' +
        k.accent +
        ';background:var(--washi);padding:.4rem .5rem;display:flex;flex-direction:column;gap:.32rem;';
      const head = el('div');
      head.style.cssText = 'display:flex;align-items:baseline;gap:.45rem;flex-wrap:wrap;';
      const stamp = el('span');
      stamp.style.cssText =
        'display:inline-flex;align-items:baseline;gap:.2rem;color:' +
        k.accent +
        ';border:1px solid currentColor;padding:0 .25rem;font-size:var(--fs-micro);font-weight:700;';
      const stampKanji = el('span', undefined, k.kanji);
      stampKanji.lang = 'ja';
      stamp.append(stampKanji, el('span', undefined, k.word));
      head.append(stamp);
      const title = el('span', undefined, q.title);
      title.style.cssText = 'font-weight:700;color:var(--ink);';
      head.append(title);
      if (completed) {
        const fulfilled = el('span', undefined, '果 fulfilled ✓');
        fulfilled.style.cssText =
          'margin-left:auto;color:var(--shu-deep);font-weight:700;font-size:var(--fs-small);';
        head.append(fulfilled);
      }
      bill.append(head);
      bill.append(el('div', 'skill-blurb', q.blurb));

      if (accepted || completed) {
        const total = q.steps.length;
        const ndone = q.steps.filter((s) => done.has(s.id)).length;
        const frac = total === 0 ? 1 : ndone / total;
        const meter = el('div');
        meter.style.cssText = 'display:flex;align-items:center;gap:.5rem;';
        const bar = el('div');
        bar.style.cssText =
          'position:relative;flex:1;height:.5rem;border:1px solid var(--ink-faint);background:var(--washi-deep);overflow:hidden;';
        const fill = el('span');
        fill.style.cssText =
          'position:absolute;left:0;top:0;bottom:0;background:var(--ink-soft);width:' +
          Math.round(frac * 100) +
          '%;';
        bar.append(fill);
        const count = el('span', undefined, ndone + ' of ' + total + ' deeds');
        count.style.cssText =
          'color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;white-space:nowrap;';
        meter.append(bar, count);
        bill.append(meter);

        const list = el('div');
        list.style.cssText = 'display:flex;flex-direction:column;gap:.12rem;';
        for (const s of q.steps) {
          const ok = done.has(s.id);
          const row = el('div');
          row.style.cssText =
            'display:flex;gap:.4rem;align-items:baseline;font-size:var(--fs-small);color:' +
            (ok ? 'var(--ink)' : 'var(--ink-soft)') +
            ';';
          const mark = el('span', undefined, ok ? '■' : '□');
          mark.style.color = ok ? 'var(--ink)' : 'var(--ink-faint)';
          row.append(mark, el('span', undefined, s.label));
          list.append(row);
        }
        bill.append(list);

        const rk = q.reward.resources?.koku;
        if (rk && !completed) {
          const reward = el('div', undefined, 'On fulfilment — ' + rk + ' koku');
          reward.style.cssText =
            'align-self:flex-start;border:1px solid var(--gold);color:var(--gold);padding:0 .3rem;font-size:var(--fs-micro);font-variant-numeric:tabular-nums;';
          bill.append(reward);
        }
      } else {
        const foot = el('div');
        foot.style.cssText = 'display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;';
        const btn = el('button', 'verb', 'Take the commission 請ける');
        btn.type = 'button';
        btn.addEventListener('click', () => take(q.id));
        foot.append(btn);
        const rk = q.reward.resources?.koku;
        if (rk) {
          const posted = el('span', undefined, 'Posted reward — ' + rk + ' koku');
          posted.style.cssText =
            'color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;';
          foot.append(posted);
        }
        bill.append(foot);
      }
      board.append(bill);
    }
    container.append(board);
    return true;
  }

  // ── C · 用帳 — the steward's field-ledger. One aligned entry per commission: a kind stamp, the
  //    name + terse note, an ink deeds-tally, the koku in a right-aligned tabular column (§9), and
  //    a status; a 合計 foot totals the koku in hand. ──
  const ledger = el('div');
  ledger.style.cssText =
    'border:1px solid var(--ink);background:var(--washi);padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  cap.append(el('span', undefined, '📖'));
  const cTitle = el('span', undefined, 'Field-ledger of commissions');
  cTitle.style.fontWeight = '700';
  cap.append(cTitle);
  const cKanji = el('span', undefined, '用帳');
  cKanji.lang = 'ja';
  cKanji.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(cKanji);
  ledger.append(cap);

  let kokuInHand = 0;
  for (const q of QUESTS) {
    const done = new Set(state.quests.progress[q.id] ?? []);
    const completed = state.quests.completed.includes(q.id);
    const accepted = state.quests.accepted.includes(q.id);
    const k = KIND[q.kind];
    const total = q.steps.length;
    const ndone = q.steps.filter((s) => done.has(s.id)).length;
    const rk = q.reward.resources?.koku ?? 0;
    if (accepted && !completed) kokuInHand += rk;

    const row = el('div');
    row.style.cssText =
      'display:flex;align-items:baseline;gap:.5rem;border-bottom:1px solid var(--ink-faint);padding:.32rem 0;';
    const stamp = el('span');
    stamp.style.cssText =
      'flex:0 0 auto;color:' +
      k.accent +
      ';border:1px solid currentColor;padding:0 .25rem;font-size:var(--fs-micro);font-weight:700;';
    const stampKanji = el('span', undefined, k.kanji);
    stampKanji.lang = 'ja';
    stamp.append(stampKanji);
    row.append(stamp);

    const main = el('div');
    main.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:.08rem;';
    const title = el('span', undefined, q.title);
    title.style.cssText =
      'font-weight:700;color:' + (completed ? 'var(--ink-soft)' : 'var(--ink)') + ';';
    main.append(title);
    const note = el('span', undefined, k.word + ' · ' + q.blurb);
    note.style.cssText = 'color:var(--ink-soft);font-size:var(--fs-micro);';
    main.append(note);
    row.append(main);

    const deeds = el('span');
    deeds.style.cssText =
      'flex:0 0 auto;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;';
    if (!accepted && !completed) {
      const dash = el('span', undefined, '—');
      dash.style.color = 'var(--ink-faint)';
      deeds.append(dash);
    } else {
      const inked = el('span', undefined, '┃'.repeat(ndone));
      inked.style.color = 'var(--ink)';
      const faint = el('span', undefined, '┃'.repeat(total - ndone));
      faint.style.color = 'var(--ink-faint)';
      const num = el('span', undefined, ' ' + ndone + '/' + total);
      num.style.cssText = 'color:var(--ink-soft);font-size:var(--fs-micro);';
      deeds.append(inked, faint, num);
    }
    row.append(deeds);

    const koku = el('span', undefined, rk ? rk + ' koku' : '—');
    koku.style.cssText =
      'flex:0 0 4.6rem;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:' +
      (rk ? 'var(--gold)' : 'var(--ink-faint)') +
      ';';
    row.append(koku);

    const status = el('span');
    status.style.cssText = 'flex:0 0 auto;text-align:right;';
    if (completed) {
      status.textContent = '果 done ✓';
      status.style.cssText += 'color:var(--shu-deep);font-weight:700;font-size:var(--fs-small);';
    } else if (accepted) {
      status.textContent = 'in hand';
      status.style.cssText += 'color:var(--rokusho);font-size:var(--fs-small);';
    } else {
      const btn = el('button', 'verb', 'Take on');
      btn.type = 'button';
      btn.addEventListener('click', () => take(q.id));
      status.append(btn);
    }
    row.append(status);
    ledger.append(row);
  }

  const foot = el('div', undefined, '合計 — koku in hand: ' + kokuInHand);
  foot.style.cssText =
    'align-self:flex-end;color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;padding-top:.15rem;';
  ledger.append(foot);
  container.append(ledger);
  return true;
}

function renderMapVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'map-b' && variantId !== 'map-c') return false;
  const revealed = new Set(state.unlocked);
  const here = state.location;
  const condOk = skillLevel(state, 'conditioning') >= balance.CONDITIONING_GATE_LEVEL;
  const neighbours = new Map(reachableFrom(here, revealed).map((n) => [n.id, n]));

  if (variantId === 'map-b') {
    // ── B · 絵地図 — the estate as a spatial trail: revealed nodes laid out in COLUMNS by their
    //    distance from the kura (a left→right path outward), you-are-here lit gold, the walkable
    //    neighbours live buttons. Derived from the graph (BFS), so it never drifts from the map. ──
    const depth = new Map<string, number>([['kura', 0]]);
    const queue: string[] = ['kura'];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of reachableFrom(cur, revealed)) {
        if (depth.has(nb.id)) continue;
        depth.set(nb.id, (depth.get(cur) ?? 0) + 1);
        queue.push(nb.id);
      }
    }
    const maxDepth = Math.max(...depth.values());
    const board = el('div');
    board.style.cssText =
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.6rem;display:flex;gap:.5rem;align-items:stretch;overflow-x:auto;';
    for (let d = 0; d <= maxDepth; d++) {
      const ids = [...depth.entries()].filter(([, dd]) => dd === d).map(([id]) => id);
      const colEl = el('div');
      colEl.style.cssText =
        'display:flex;flex-direction:column;gap:.5rem;justify-content:center;min-width:8.5rem;';
      for (const id of ids) {
        const node = getNode(id);
        const isHere = id === here;
        const walkable = neighbours.has(id);
        const danger = node.dangerRing === true;
        const locked = danger && !condOk && walkable;
        const live = walkable && !locked;
        const cell = el(live ? 'button' : 'div');
        if (live) {
          (cell as HTMLButtonElement).type = 'button';
          cell.addEventListener('click', () => dispatch({ type: 'move_to', to: id }));
        }
        cell.style.cssText =
          'text-align:left;padding:.35rem .45rem;display:flex;flex-direction:column;gap:.1rem;' +
          'border:' +
          (isHere ? '2px solid var(--gold)' : '1px solid var(--ink-faint)') +
          ';background:' +
          (isHere || walkable ? 'var(--washi)' : 'var(--washi-deep)') +
          ';color:' +
          (isHere || walkable ? 'var(--ink)' : 'var(--ink-soft)') +
          ';cursor:' +
          (live ? 'pointer' : 'default') +
          ';';
        const line1 = el('div');
        line1.style.cssText =
          'display:flex;align-items:baseline;gap:.3rem;font-weight:' +
          (isHere ? '700' : '600') +
          ';';
        if (node.kanji) {
          const k = el('span', undefined, node.kanji);
          k.lang = 'ja';
          line1.append(k);
        }
        line1.append(el('span', undefined, node.label.replace(/^The /, '')));
        if (danger) line1.append(el('span', undefined, '⚠'));
        cell.append(line1);
        const tag = isHere
          ? 'You are here'
          : locked
            ? 'Needs Conditioning Lv' + balance.CONDITIONING_GATE_LEVEL
            : walkable
              ? 'Walk here →'
              : '';
        if (tag) {
          const t = el('div', undefined, tag);
          t.style.cssText =
            'font-size:var(--fs-micro);color:' +
            (isHere ? 'var(--gold)' : locked ? 'var(--shu-deep)' : 'var(--ink-soft)') +
            ';';
          cell.append(t);
        }
        colEl.append(cell);
      }
      board.append(colEl);
    }
    container.append(board);
    return true;
  }

  // ── C · 道中記 — the traveller's ledger: an INFORMED route list. Each path onward shows the
  //    destination's blurb AND what awaits there (the labours to work, the foes to fight, the
  //    danger), so you choose your road from the map instead of walking in blind. ──
  const ledger = el('div');
  ledger.style.cssText =
    'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem .6rem;display:flex;flex-direction:column;gap:.5rem;';
  const hereNode = getNode(here);
  const banner = el('div');
  banner.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;color:var(--ink);';
  banner.append(el('span', undefined, '🧭'));
  const bt = el(
    'span',
    undefined,
    'You stand at the ' + hereNode.label.toLowerCase().replace(/^the /, ''),
  );
  bt.style.fontWeight = '700';
  banner.append(bt);
  const bk = el('span', undefined, '道中記');
  bk.lang = 'ja';
  bk.style.cssText = 'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  banner.append(bk);
  ledger.append(banner);
  ledger.append(el('div', 'skill-blurb', hereNode.blurb));

  const routes = reachableFrom(here, revealed);
  if (routes.length === 0) ledger.append(el('div', 'skill-blurb', 'No path leads on from here.'));
  for (const n of routes) {
    const danger = n.dangerRing === true;
    const locked = danger && !condOk;
    const foesThere = MOBS.filter((m) => !m.scripted && m.area === n.id);
    const laboursThere = ACTIVITIES.filter((a) => a.area === n.id);
    const row = el('div');
    row.style.cssText =
      'border:1px solid var(--ink-faint);border-left:4px solid ' +
      (danger ? 'var(--beni)' : 'var(--ai)') +
      ';background:var(--washi);padding:.4rem .5rem;display:flex;flex-direction:column;gap:.28rem;';
    const head = el('div');
    head.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;flex-wrap:wrap;color:var(--ink);';
    if (n.kanji) {
      const k = el('span', undefined, n.kanji);
      k.lang = 'ja';
      head.append(k);
    }
    const nm = el('span', undefined, n.label.replace(/^The /, ''));
    nm.style.fontWeight = '700';
    head.append(nm);
    if (danger) {
      const d = el('span', undefined, '⚠ danger');
      d.style.cssText = 'color:var(--shu-deep);font-size:var(--fs-micro);';
      head.append(d);
    }
    row.append(head);
    row.append(el('div', 'skill-blurb', n.blurb));
    const tags = el('div');
    tags.style.cssText = 'display:flex;gap:.3rem;flex-wrap:wrap;font-size:var(--fs-micro);';
    for (const a of laboursThere) {
      const t = el('span', undefined, '⛏ ' + a.label.replace(/^.*?the /i, ''));
      t.style.cssText = 'border:1px solid var(--ink-faint);padding:0 .25rem;color:var(--ink-soft);';
      tags.append(t);
    }
    for (const f of foesThere) {
      const t = el('span', undefined, '⚔ ' + f.label);
      t.style.cssText = 'border:1px solid var(--beni);padding:0 .25rem;color:var(--beni);';
      tags.append(t);
    }
    if (laboursThere.length === 0 && foesThere.length === 0) {
      const t = el('span', undefined, '· quiet ground');
      t.style.color = 'var(--ink-faint)';
      tags.append(t);
    }
    row.append(tags);
    const btn = el(
      'button',
      'verb',
      locked ? 'Needs Conditioning Lv' + balance.CONDITIONING_GATE_LEVEL : 'Set out 発つ →',
    );
    btn.type = 'button';
    btn.disabled = locked;
    btn.style.alignSelf = 'flex-start';
    if (!locked) btn.addEventListener('click', () => dispatch({ type: 'move_to', to: n.id }));
    row.append(btn);
    ledger.append(row);
  }
  container.append(ledger);
  return true;
}

// ── the DEV panel — a floating, collapsible control surface (DEV-only) ──

/** The subset of `window.__qa` the panel drives. main.ts's qa object satisfies this
 *  structurally; the panel never sees the rest of __qa. */
export interface DevQa {
  speed(mult: number): number;
  jumpToPhase2(): unknown;
  jumpToAscension(): void;
  faceWolf(): void;
  toRung(id: RankId): unknown;
  auto(id: ActivityId | null): void;
  autoCombat(id: MobId | null): void;
  newGame(seed?: number): void;
}

export function mountDevPanel(
  host: HTMLElement,
  opts: { qa: DevQa; dev: DevApi; rerender: () => void },
): void {
  const { qa, dev, rerender } = opts;

  const panel = el('div');
  panel.setAttribute('data-dev', DEV_SENTINEL);
  // bottom-anchored floating overlay; collapsed it shrinks to the header (width:fit-content),
  // expanded it grows to 15rem (see the head click handler). Never reserves layout space (F2/F4).
  panel.style.cssText =
    'position:fixed;bottom:.5rem;right:.5rem;z-index:9999;width:fit-content;max-width:16rem;max-height:82vh;overflow:auto;' +
    'background:#1c1814;color:#e7d9bc;font:12px/1.45 ui-monospace,SFMono-Regular,monospace;' +
    'border:1px solid #b08d4f;border-radius:4px;box-shadow:0 2px 14px rgba(0,0,0,.45);';

  // header (click to collapse the body)
  const head = el('div');
  head.style.cssText =
    'display:flex;justify-content:space-between;align-items:center;padding:.35rem .5rem;' +
    'background:#26221e;border-bottom:1px solid #7a6c59;cursor:pointer;user-select:none;font-weight:700;';
  head.append(el('span', undefined, '⚙ DEV'));
  const caret = el('span', undefined, '▾');
  head.append(caret);
  panel.append(head);

  const body = el('div');
  // start COLLAPSED so the panel is as small as possible by default (F4).
  body.style.cssText = 'padding:.4rem .5rem;display:none;flex-direction:column;gap:.5rem;';
  panel.append(body);
  caret.textContent = '▸';
  head.addEventListener('click', () => {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    caret.textContent = hidden ? '▾' : '▸';
    panel.style.width = hidden ? '15rem' : 'fit-content';
  });

  const mono = (label: string, onClick: () => void): HTMLButtonElement => {
    const b = el('button', undefined, label);
    b.type = 'button';
    b.style.cssText =
      'background:#3a322a;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;' +
      'padding:.18rem .4rem;font:inherit;cursor:pointer;';
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return b;
  };
  const section = (title: string): HTMLElement => {
    const sec = el('div');
    const h = el('div', undefined, title);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.2rem;';
    sec.append(h);
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    sec.append(rows);
    body.append(sec);
    return rows;
  };

  // speed
  const speed = section('Speed');
  for (const m of [1, 2, 4, 8]) speed.append(mono(`${m}×`, () => qa.speed(m)));

  // teleports
  const jump = section('Jump');
  jump.append(mono('→ Phase 2', () => qa.jumpToPhase2()));
  jump.append(mono('→ Ascend-ready', () => qa.jumpToAscension()));
  const rungs = section('Rung');
  // R3/R4/R5 expose each beat of the A7 staggered combat reveal (bestiary → durability/equip →
  // stance); R7 opens Phase 2.
  for (const r of ['R3', 'R4', 'R5', 'R7'] as RankId[]) rungs.append(mono(r, () => qa.toRung(r)));

  // combat + auto
  const combat = section('Combat / Auto');
  combat.append(mono('Face wolf', () => qa.faceWolf()));
  combat.append(mono('Auto: farm', () => qa.auto('farm_paddy' as ActivityId)));
  combat.append(mono('Auto: monkey', () => qa.autoCombat('monkey' as MobId)));
  combat.append(
    mono('Stop auto', () => {
      qa.auto(null);
      qa.autoCombat(null);
    }),
  );

  // lifecycle
  const life = section('Game');
  life.append(mono('New game', () => qa.newGame()));

  // ── the live variant toggle — the heart of D-075 review ──
  for (const surface of dev.surfaces) {
    const sec = el('div');
    const h = el('div', undefined, `Variant · ${surface.label}`);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.2rem;';
    sec.append(h);
    const blurb = el('div', undefined, '');
    blurb.style.cssText = 'color:#9b8e78;font-size:11px;margin-bottom:.25rem;min-height:1.4em;';
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    const buttons: HTMLButtonElement[] = [];
    const paint = (): void => {
      const cur = dev.getVariant(surface.id);
      surface.variants.forEach((v, i) => {
        const on = v.id === cur;
        buttons[i]!.style.background = on ? '#b08d4f' : '#3a322a';
        buttons[i]!.style.color = on ? '#1c1814' : '#e7d9bc';
        if (on) blurb.textContent = v.blurb;
      });
    };
    surface.variants.forEach((v) => {
      const b = mono(v.label, () => {
        dev.setVariant(surface.id, v.id);
        paint();
        rerender();
      });
      buttons.push(b);
      rows.append(b);
    });
    sec.append(blurb, rows);
    body.append(sec);
    paint();
  }

  host.append(panel);
  // NOTE: the panel is position:fixed and floats OVER the app (bottom-right), so it reserves
  // NO layout space — the game UI centers on the full viewport (playtest F2/F4). The old
  // `#app paddingRight:16rem` gutter (which de-centered the UI and exposed a white strip) is gone.
}
